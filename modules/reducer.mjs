/**
 * @typedef (undefined|null|boolean|number|string|object) BaseTypes
 */

/**
 * The state of the Redux container.
 * @typedef {Array<BaseTypes>|BaseTypes} ReduxState
 */

/**
 * @@typedef {object} ReduxAction
 * @template TYPE
 * @property {string} type The name of the action.
 * @property {TYPE} [payload] The payload of the action.
 */

/**
 * A function testing a value 
 * @callback Predicate
 * @template A
 * @param {A} tested The tested value.
 * @returns {boolean} True, if and only if the value passes the predicate.
 */

/**
 * Testing the validity of an action.
 * @callback.{Predicate<ReduxAction|string>}》ActionTester
 */

/**
 * Function performing change to the state.
 * @callback ReduxReducerFunc
 * @template STATE = ReduxState, [TYPE]
 * @param {STATE} state
 * @param {ReduxAction<TYPE>} action
 * @return {STATE} The new redux state. 
 */

/**
 * The class representing redux reducers.
 * @template STORAGE,TYPE
 */
export class ReduxReducer {

  /**
   * The reducer function performing the reduction.
   * @type {ReduxReducerFunc<STORAGE,TYPE>|undefined}
   */
  #act;


  /**
   * The valudator validsting an action.
   * @type {ActionTester}
   */
  #actionValidator;

  constructor(act, { actionValidator = null }) {
    if (act == null || act instanceof Function) {
      this.#act = act;
    } else {
      throw new TypeError("Invalid reducing function");
    }
    if (actionValidator == null) {
      this.#actionValidator = () => (true);
    } else if (actionValidator instanceof Function) {
      this.#actionValidator = actionValidator;
    } else {
      throw new TypeError("Invalid action validator");
    }
  }


  /**
   * Does the reducer handle given action.
   * @param {ReduxAction<TYPE>|string} action The handled qction, or the name of the action.
   * @returns {boolean} True, if and only if this reducer may handle the action.
   */
  handles(action) {
    if (action instanceof Object && ("type" in action) && typeof action.type === "string") {
      return this.#actionValidator(action.type);
    } else if (typeof action === "string") {
      return this.#actionValidator(action);
    } else {
      return false;
    }
  }

  /**
   * Handles the action.
   * @param {STATE} state The current state.
   * @param {ReduxAction<TYPE>} action The performed action. 
   * @returns {STATE} The old state, or the new state caused by the reduction.
   */
  reduce(state, action) {
    if (this.handles(action) && this.#act) {
      try {
        return this.#act(state, action);
      } catch (err) {
        // Error is ignored
      }
    }
    return state;
  }
  
  /**
   * Converts the reducer into the reducer function.
   * @returns {ReduxReducerFunc} The reducer function implementation of the current reducer.
   */
  asReducer() {
    return this.reduce;
  }
}

/**
 * The Root Reducer is a reducer
 * with any parameter types.
 */
export class RootReducer extends ReduxReducer {

  /**
   * The list of actions.
   */
  #actions = [];

  static combinedReducer(reducers = []) {
    const passed = reducers.filter(
      (reducer, index) => {
        return reducer instanceof Function || reducer instanceof ReduxReducer
      }
    );
    return (state, action) => {
      let result = state;
      passed.forEach((reducer) => {
        result = (reducer instanceof Function ?
          reducer(result, action) :
          (result.reduce(result, action)))
      });
      return result;
    }
  }

  /**
   * @param {Array<ReduxReducerFunc<TYPE>|ReduxReducer<STATE,TYPE>>} [reducers=[]] 
   */
  constructor(reducers = [], { log = null }) {
    super(null);
    // Storing act
    this.#actions = reducers.filter(
      (item, index) => {
        if (this.validReducer(redurer)) {
          if (log) {
            log.info(`Accepted reducer #${index}: ${reducer.name}`)
          }
          return true;
        } else if (log) {
          log.error(`Rejected reducer #${index}: ${reducer}`);
        }
        return false;
      });

  }

  static isValidReducer(reducer) {
    if (reducer instanceof Function) {
      return true;
    } else if (reducer instanceof ReduxReducer) {
      return true;
    } else {
      return false;
    }
  }
}