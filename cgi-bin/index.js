/**
 * The main program script using JavaScript.
 */

var store;

/**
 * The basic types of the JavaScript
 * @typedef {number|string|object|array|boolean|symbol|undefined|null} BasicTypes
 */

/**
 * @typedef {BasicTypes} State
 */

/**
 * @typedef {onject} ReduxAction
 * @property {string} type The type of the action.
 * @property {*} Payload The data of the action. 
 */

const actions = [];

const getActions = () => ([...actions]);
const getActionsByName = (name) => {
  return actions.filter((item) => (item.name === name));
}

const addAction = (action) => {
  if ((action?.name != null) && ("" + action?.name) &&
    (action?.reducer instanceof Function)) {
    actions.push(action);
  } else {
    throw TypeError("Invalid action");
  }
}
const removeAction = (action) => {
  const index = actions.findIndex((item) => (item === action));
  return (index >= 0 ? actions.splice(index, 1) : undefined);
}
const removeActionByName = (name) => {
  const index = actions.findIndex((item) => (item.name === name));
  return (index >= 0 ? actions.splice(index, 1) : undefined);
}

/**
 * The root reducer performing the actions.
 * @param {State} state The current state.
 * @param {ReduxAction} action
 * @returns {State} The resulting state.
 */
const rootReducer = (state, action) => {

  // Cannot use reduce
  let result = state;
  getActionsByName(action.type).forEach((act) => {
    try {
      result = act.reducer(result);
    } catch (err) {
      // Error
      log(`Data Reducer ${act.name} failed: ${err}`)
    }
  })
  return result;
};

try {

  store = createStore(rootReducer, createState());
  console.log("Redux container created");
} catch (err) {
  console.log("Using Redux Dummy")
  store = createData(rootReducer);
}

/**
 * Create state by creating a state
 * with default values, and values of
 * the give state.
 * @param {State} [source] The initial values.
 * @return {State} The state derived from t
 * source with missing values replaced with defaults.
 */
function createState(source = {}) {
  return {
    skills: { min: 4, max: 8, list: [] },
    motivations: { min: 4, max: 8, list: [] },
    people: [],
    ...source
  };
}
/**
 * Create the data storage, if the Redux storage is not available.
 */
function createData(reducer, state = undefined) {
  return {
    state: createState(state),
    listeners: [],
    lastIndex: 0,
    getState() {
      return this.state;
    },
    dispatch(action) {
      reducer(this.state, action);
    },
    subscribe(listener) {
      if (!(listener instanceof Function)) {
        throw new TypeError("Not valid a listener");
      }

      const index = this.lastIndex++;
      const unsubscriber = () => {
        delete this.listeners[index];
      }
      this.listeners[index] = listener;
      return unsubscriber;
    }

  }
}

/**
 * Get state of an action.
 * @param {string} [action] The action resource whose state is fetced.
 * @return {ReduxState|undefined} The redux shatd state associated to the action.
 * @throws {RangeError} The action path was invalid. The cause contains the actual error.
 */
function getState(action = undefined) {
  const root = store.getState();
  if (action) {
    return split(/[\.]/g, action).reduce(
      (result, name, index, names) => {
        if (result instanceof Array || result instanceof Object) {
          try {
            return result[name];
          } catch (err) {
              throw RangeError(
                `Invalid action: ${names.slice(index).join(".")}`, { cause: err });
          }
        } else {
          throw new RangeError(
            `Invalid action: ${names.slice(index).join(".")}`,
            TypeError("Broken path"));
        }
      }, root
    );
  } else {
    return root;
  }
}

function addClass(classes, added) {
  const arr = split(/\s+/g, "" + string);
  split(/\s+/g, added).forEach(
    (name) => {
      if (!(name in arr)) {
        arr.push(name);
      }
    });
  return arr.join(" ");
}

function removeClass(classes, removed) {
  const arr = split(/\s+/g, "" + string);
  split(/\s+/g, removed).forEach(
    (name) => {
      const i = arr.indexOf(name);
      if (i >= 0) {
        delete arr[i];
      }
    });
  return arr.join(" ");
}

function getClassList(classStr) {
  return (classStr ? split(/\s+/g, "" + classStr) : []);
}

function getClassSelector(classStr, delim = "") {

  return (classStr instanceof Array ? classStr : (
    classStr instanceof DOMTokenList ? [...classStr] :
    getClassList(classStr))).map((s) => (`.${s}`)).join(delim);
}

function resetUI() {
  // Removing state items
  const stateItems = document.querySelectorAll("body .state");
  alert(`Removing ${navItems.map(
    (n) => (`${n.name}${getClassSelector(n.className)}${(n.id?`#${n.id}`:"")}`).join(","))}`);
  stateItems.forEach(
    (n) => {
      n.remove();
    })

  // Initializing the current state
  populateState();
}

function populateState({
  state = undefined,
  logger = console.log
}) {
  const current =
    (state === undefined ?
      store.getState() : state);
  if (state._links) {
    // REST/HATEOAS state defines the UI

  } else if (state.links) {
    // Linkd contsines the UI
  } else if (state.current) {
    // The current contains the state
    if (getState(state.current)) {

    }
  } else {
    // The state is the state definition
    // - No state specific nav links
  }
}

/**
 * Add middleware to the storage 
 * @param {ReduxMiddleware} handler
 */
function addHandler(handler) {
  console.error(`Middleware not supported: ${handler}`);
}

/**
 * The unsubscribers of the registered data lusteners.
 * @type {Array<DataListener>}
 */
var unsubscribers = [];

function removeAllDataListeners() {
  uninstallers.forEach((listener) => {
    if (listener) {
      listener();
    }
  });
  uninstallers = [];
}

/**
 * The main program.
 */
function main({
  logger = console = log,
  initialState = undefined,
  actions = []
}) {
  if (logger) logger("Executing main");


  // Initialize reducers
  if (actions instanceof Array) {
    actions.forEach((act) => {
      addAction(act);
    });
  }

  // Initialize middleware
  if (handlers instanceof Array) {
    handlers.forEach((handler) => {
      addHandler(handler);
    })
  }

  // Create data storage
  try {
    store = createStore(rootReducer, createState(initialState));
  } catch (err) {
    store = createData(createState(initialState));
  }

  try {

    // Initialize listeners
    const uninstallers = listeners.map(
      (list) => (store.subscribe(list))
    );
    unsubscribers = uninstallers;
  } catch (err) {

  }
}

/**
 * Change the current state.
 * @param {string} state The next application state.
 */
function selectState(state, payload = undefined) {
  store.dispatch({
    type: state,
    paymoad: payload
  });
}

exports = {
  main,
  selectState,
  removeAllDataListeners,
  addAction,
  addHandler
};