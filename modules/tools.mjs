/**
 * The module containing various basic tools.
 * @module tools
 */

/**
 * Predicate testing a value.
 * @template TYPE
 * @callback Predicate
 * @param {TYPE} tested The tested value.
 * @returns {boolean} True, if and only if the
 * tested value passes the predicate.
 */

/**
 * Supplier supplyign a value.
 * @template TYPE
 * @callback Supplier
 * @returns {TYPE} The supplied value.
 * @throws {Error} There is no value to supply.
 */

/**
 * A converter converting a value to a different type of value.
 * @template SOURCE the source type.
 * @template TARGET the target type.
 * @callback Converter
 * @param {TYPE} source the value to convert.
 * @returns {TARGET} The converterd value.
 * @throws {TypeError} The type of the source was invalid.
 * @throws {RangeError} Could not convert the source due its value.
 */

/**
 * Create exists predicate testing that the valeu exists.
 * @template TYPE
 * @returns {Predicate<TYPE>} The tester of exitsence (non-nulless)
 */
export function existsPredicate() {
  return (tested) => {
    return tested != null;
  };
}

/**
 * Create a predicate testing that the value is defined.
 * @template TYPE
 * @returns {Predicate<TYPE>} The tester of defined value.
 */
export function definedPredicate() {
  return (tested) => {
    return tested !== undefined;
  };
}

/**
 * Create a predicate from a tester function.
 * @template TYPE The type of the function parameter
 * @param {{ (value: TYPE) => any}} func The function testing the value.
 * @returns {Predicate<TYPE>} The predicate passing any values of the
 * function.
 */
export function functionPredicate(func) {
  return (tested) => {
    try {
      return func(tested) == true;
    } catch (error) {
      return false;
    }
  };
}

/**
 * Create a predicate testing that the tested is equal to value.
 * @template TYPE
 * @param {TYPE} value The target of the equality test.
 * @returns {Predicate<TYPE>} The predicate testing equlaity with
 * the given value.
 */
export function equalsPredicate(value) {
  return (tested) => tested === value;
}

/**
 * Create the complement predicate performing opposite
 * predicate to teh given predicate.
 * @template TYPE
 * @param {Predicate<TYPE>} predicate The predicate to complement.
 * @returns {Predicate<TYPE>} The predicate returning opposite result
 * to the given predicate.
 */
export function complementPredicate(predicate) {
  return (tested) => {
    return !predicate(tested);
  };
}

/**
 * Create a predicate accepting any value
 * accepted, if some of the predicates accept
 * it.
 * @template TYPE
 * @param  {Predicate<TYPE>[]} ...predicates The testing rpedicates.
 * @return {boolean} The predicate passing a value which
 * passes some of the given values. An empty list creates a predicate
 * rejecting all values.
 */
export function somePredicate(...predicates) {
  return (tested) => {
    return predicates.some((predicate) => predicate(tested));
  };
}

/**
 * Create a predicate accepting any value
 * accepted by all predicates.
 * @template TYPE
 * @param  {Predicate<TYPE>[]} ...predicates The testing rpedicates.
 * @return {boolean} The predicate passing a value which
 * passes all of the predicates. An empty list creates a predicate
 * accepting all values.
 */
export function everyPredicate(...predicates) {
  return (tested) => {
    return predicates.every((predicate) => predicate(tested));
  };
}

/**
 * Supplier of a value.
 * @template TYPE The type of the supplied value.
 * @param {TYPE} value The suppleid value.
 * @returns {Supplier<TYPE>} The promise of the value.
 */
export function valueSupplier(value) {
  return () => value;
}

/**
 * A supplier returning the result of a promise.
 * @template TYPE
 * @param {Promise<TYPE>} promise The promise.
 * @returns {Supplier<TYPE>} The supplier returning
 * the result of the type.
 */
export function promiseSupplier(promise) {
  return async () => {
    try {
      return await promise;
    } catch (error) {
      return new Error("No value available", { cause: error });
    }
  };
}

/**
 * Create a fucntion supplier.
 * @param {{()=>TYPE}} func The function returnign value of type.
 * @returns {Supplier<TYPE>} A supplier returning the function value.
 */
export function functionSupplier(func) {
  return () => {
    try {
      return func();
    } catch (error) {
      return new Error("No value available", { cause: error });
    }
  };
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
  return values.map( value => (value())).some(predicate);
}
