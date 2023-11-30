import { useState, createContext } from "react";
/**
 * The context storing error state.
 * @module ComplexErrorContext
 * 
 */

/**
 * Error definition.
 * @template TYPE - The type of the target. 
 * @typedef {Object} ErrorDefinition
 * @property {TYPE} target The target of the error.
 * @property {Error} cause The error causing the trouble. 
 * @property {string} message The error message.
 * @method toString
 * @returns {string} The string representation of the error.
 */

/**
 * Create a new error definition.
 * @template TYPE Teh type of the target.
 * @param {TYPE} target The tareget of the error.
 * @param {Error} cause The actual error. 
 * @param {string} [message] The message of the created error.
 * Defaults to the message of the cause. 
 * @returns {ErrorDefinition<TYPE>}
 */
const createErrorDefinition = (target, cause, message=null) => {
  return {
    target,
    cause,
    message: message || cause.message,
    toString() {
      return this.message;
    }
  };
}

/**
 * The error getter of errors attached to an identifier.
 * @template KEY, [TYPE=any]
 * @callback ErrorGetter
 * @param {KEY} id The identifier of the resource.
 * @returns {Array<ErrorDefinition<TYPE>>} The list of errors.
 */

/**
 * The error setter of errors attached to an identifier.
 * @template KEY, [TYPE=any]
 * @callback ErrorsSetter
 * @param {KEY} id The identifier of the resource.
 * @param {Array<ErrorDefinition<TYPE>>} errors The list
 * of errors.
 * @throws {TypeError} Any error was invalid.
 * @throws {RangeError} The identifier is invalid.
 */

/**
 * The error adder for errors attached to an identifier.
 * @template KEY, [TYPE=any]
 * @callback ErrorAdder
 * @param {KEY} id The identifier of the resource.
 * @param {ErrorDefinition<TYPE>} error The added
 * error.
 * @throws {TypeError} Any error was invalid.
 * @throws {RangeError} The identifier is invalid.
 */


/**
 * The error clearer for errors attached to an identifier.
 * @template KEY, [TYPE=any]
 * @callback ErrorsClearer
 * @param {KEY} id The identifier of the resource.
 * @throws {RangeError} The identifier is invalid.
 */

/**
 * Test whether a resource has an error.
 * @template KEY, [TYPE=any] 
 * @callback ErrorsTester
 * @param {KEY} id The identifier of the resource.
 * @returns {boolean} True, if and only if the
 * given resource has an error.
 */

/**
 * The model for the error context.
 * @template [TYPE=any]
 * @typedef {Object} ErrorContextModel
 * 
 * @property {ErrorGetter<string, TYPE>} getErrors
 * @property {ErrorsSetter<string, TYPE>} setErrors
 * @property {ErrorAdder<string, TYPE>} addError
 * @property {ErrorsClearer<string>} clearErrors
 * @property {ErrorsTester<string, TYPE>} hasErrors
 */

/**
 * @type {ErrorContextModel<any>}
 */
const defaultContext = {

  /**
   * Get the errors of the resource.
   * @method
   * @param {string} resource The resource name 
   * @returns {Array<ErrorDefinition<any>>} The errors attached
   * to the resource.
   */
  getErrors: (resource) => ([]),
  /**
   * Set the errors of the resource.
   * @method
   * @param {string} resource The resource name.
   * @param {Array<ErrorDefinition<any>>} errors The new list
   * of errors.
   * @throws {TypeError} Some of the errors was invalid.
   * @throws {RangeError} The given resource name was invalid.
   * @throws {Error} The operation is not supported.
   */
  setErrors: (_resource, _errors) => { throw Error("Unimplemented") },
  /**
   * Clears errors from the resource.
   * @param {string} resource The resource name.
   * @returns {void} Nothing to do.
   * @throws {Error} The operation is not supported.
   */
  clearErrors: (_resource) => { throw Error("Unimplemented") },
  addError: (_resource, _error) => { throw Error("Unimplemented") },
  hasErrors: (resource) => { return this.getErrors(resource)?.length },
  createErrorDefinition
};


/**
 * The complex error context.
 * @type {import("react").Context<ErrorContextModel<any>>} 
 */
const ComplexErrorContext = createContext(defaultContext);

/**
 * The context provider component.
 * @param {import("react").ReactPropTypes} props 
 * @returns {import("react").ReactElement} The created favorite context 
 * provider.
 */
export const ComplexErrorContextProvider = (props) => {
  const [errors, setErrors] = useState({});

  function getErrorHandler(resource) {
    if (typeof resource === "string") {
      const result = errors[resource];
      return (result == null ? [] : [...result]);
    } else {
      return [];
    }
  }

  function validErrorDefinition(error) {
    if (typeof error === "object") {
      return ["target", "cause", "message", "toString"].every((field) => (field in error));
    } else {
      return false;
    }
  }

  function setErrorsHandler(resource, errors) {
    if (typeof resource === "string") {
      if (errors instanceof Array) {

      } else if (errors.some(error => (!validErrorDefinition(error)))) {
        throw new TypeError(`Invalid error at index ${index}`);
      }

      setErrors((currentErrors) => ({ ...currentErrors, [resource]: errors }));
    } else {
      throw new RangeError("Invalid resource name");
    }
  }

  function addErrorHandler(resource, error) {
    if (typeof resource === "string") {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [resource]: (currentErrors[resource] || []).concat(error)
      }));
    } else {
      throw new TypeError("Invalid resource name - not a string");
    }
  }

  function clearErrorsHandler(resource) {
    return setErrorsHandler(resource, []);
  }

  /**
   * Does the resource have errors.
   * @param {string} resource The resource name.
   * @returns {boolean} True, if and only if the resource
   * has errors.
   */
  function hasErrorsHandler(resource) {
    return (getErrorHandler(resource) || []).length > 0;
  }

  /**
   * @type {ErrorContextModel<any>}
   */
  const context = {
    getErrors: getErrorHandler,
    addError: addErrorHandler,
    setErrors: setErrorsHandler,
    clearErrors: clearErrorsHandler,
    /**
     * Does the resource have errors.
     * @param {string} resource The resource name.
     * @returns {boolean} True, if and only if the resource
     * has errors.
     */
    hasErrors: hasErrorsHandler,
    createErrorDefinition
  }

  return (<ComplexErrorContext.Provider value={context}>
    {props.children}
  </ComplexErrorContext.Provider>)
}


export default ComplexErrorContext;
