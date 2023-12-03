
/**
 * The tools module implementation returning promises.
 * @module tools/promise
 */

/**
 * Predicate testing a value.
 * @template TYPE
 * @callback Predicate
 * @param {TYPE} tested The tested value.
 * @returns {Promise<never>} The promise of the
 * passing the predicate. Rejected on failure with the 
 * rejection reason.
 */

/**
 * Create the complement predicate performing opposite
 * predicate to the given predicate. 
 * @template TYPE
 * @param {Predicate<TYPE>} predicate The predicate to complement. 
 * @returns {Predicate<TYPE>} The predicate returning opposite result
 * to the given predicate.
 */
export function complementPredicate(predicate) {
  return (tested) => {
    return new Predicate( (resolve, reject) => {
      predicate(tested).then(reject, resolve);
    })
  }
}

/**
 * Create a predicate testing that the tested is equal to value.
 * @template TYPE
 * @param {TYPE} value The target of the equality test.
 * @returns {Predicate<TYPE>} The predicate testing equlaity with
 * the given value.
 */
export function equalsPredicate(value)  {
  return (tested) => {
    return tested === value ? Promise.resolve() : Promise.reject();
  }
}

/**
 * Create exists predicate testing that the valeu exists.
 * @template TYPE
 * @returns {Predicate<TYPE>} The tester of exitsence (non-nulless)
 */
export function existsPredicate() {
  return (tested) => {
    return tested == null ? Promise.resolve() : Promise.reject();
  }
}

/**
 * Create a predicate testing that the value is defined.
 * @template TYPE
 * @returns {Predicate<TYPE>} The tester of defined value.
 */
export function definedPredicate() {
  return (tested) => {
    return tested !== undefined ? Promise.resolve() : Promise.reject();
  }
}

/**
 * Create a predicate from a tester function.
 * @template TYPE The type of the function parameter
 * @param {{ (value: TYPE) => any}} func The function testing the value.
 * @returns {Predicate<TYPE>} The predicate passing any values of the
 * function.
 */
export function functionPredicate(func) {
  if (func instanceof Function) {
    return (tested) => {
      return Promise( (resolve, reject) => {
        try {
          resolve(func(tested) == true);
        } catch(error) {
          reject();
        }
      })
    }
  } else {
    throw new TypeError("Invalid function");
  }
}

/**
 * Create a predicate accepting any value
 * accepted, if some of the predicates accepts it.
 * @template TYPE
 * @param  {Predicate<TYPE>[]} ...predicates The testing rpedicates.
 * @return {Promise<TYPE>} The predicate passing a value which 
 * passes some of the given values. An empty list creates a predicate
 * rejecting all values.
 */
export function somePredicate(...predicates) {
  return (tested) => {
    return Promise.any(predicates).map( (predicate) => (predicate(tested)));
  }
}

/**
 * Create a predicate accepting any value
 * accepted by all predicates.
 * @template TYPE
 * @param  {Predicate<TYPE>[]} ...predicates The testing rpedicates.
 * @return {Promise<TYPE>} The predicate passing a value which 
 * passes all of the predicates. An empty list creates a predicate
 * accepting all values.
 */
export function everyPredicate(...predicates) {
  return (tested) => {
    return Promise.all(predicates).map( (predicate) => (predicate(tested)));
  }
}


/**
 * Supplier supplyign a value.
 * @template {TYPE}
 * @callback Supplier
 * @returns {Promise<TYPE>} The promise of the supplied value.
 * The promise reject with: 
 * - {@link Error}: There is no value to supply.
 */

/**
 * Supplier of a value.
 * @template TYPE The type of the supplied value. 
 * @param {TYPE} value The suppleid value.
 * @returns {Supplier<TYPE>} The promise of the value.
 */
export function valueSupplier(value) {
  return Promise.resolve(value);
}

/**
 * A supplier returning the result of a promise.
 * @template TYPE
 * @param {Promise<TYPE>} promise The promise.
 * @returns {Supplier<TYPE>} The supplier returning
 * the result of the type. 
 */
export function promiseSupplier(promise) {
  return () => (promise);
}

/**
 * Create a fucntion supplier. 
 * @param {{()=>TYPE}} func The function returnign value of type.
 * @returns {Supplier<TYPE>} A supplier returning the function value.
 */
export function functionSupplier(func) {
  return () => (Promise((resolve, reject) => {
    try {
      resolve(func());
    } catch(error) {
      reject(error);
    }
  }))
}

/**
 * Createa a supplier returning the first supplied result.
 * With promises this value is first resolved supplier value.
 * @template TYPE The type of the suppleid value.
 * @param {Predicate<TYPE>} predicate The supplier.
 * @param {Supplier<TYPE>[]} values The list of suppliers
 * @returns {Supplier<TYPE>} The supplier returning first 
 * completing promise of the suppliers accepted by the predicate.
 */
export function selectSupplier(predicate, values) {
  return Promise.some(Promise.allSettled(values).then((value) => (
    predicate(value).then(value, ()=>("Value filtered out"))))
  );
}