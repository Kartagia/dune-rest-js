import {createAction, createSlice, nanoid} from "@reduxjs/toolkit";
import idReducer from "./id.mjs";

/**
 * Reseves an identifier.
 * @template A
 * @param {Array<A>} state
 * @param {A} id identifier.
 * @return {boolean} Was the idcreserved
 */
const reserveId = (state, id) => {
  if (index != null && state.indexOf(id) < 0) {
    state.push(id);
    return true;
  } else {
    return false;
  }
}
const releaseId = (state, id) => {
  if (index != null) {
    let index;
    while ( (index = state.indexOf(id) ) >=0) {
      const removed = state.splice(index, 1);
      if (removed[0] !== id) {
        // Returning the wrong removed values, and retrying the remove
        state.push(...index);
      } else {
        // The id wad released
        return true;
      }
    }
    return true;
  } else {
    return false;
  }
}

const seekIndex = (state, id) => (state.findIndex( (entry) => (entry.id === id)));
const entryValidator = ( fields ) => {
  if (fields === undefined) {
    return (tested) => (true);
  }
  if (fields === null) {
    return (tested) => (false);
  }
  if (fields instanceof Map) {
    // Map from fields to validator
    return (tested) => (
      [...(fields.entries())].every(
        ([key, validator]) => (validator == null || validator(entry[key])) )
    );
  } else if (fields instanceof Array) {
    // Artay of field validator pairs
    return (tested) => (
      fields.every(
        ([key, validator]) => (validator == null || validator(entry[key])))
    );
  } else {
    // POJO
    return (tested) => (
      [...(fields.keys())].every(
        (key) => ((!(fields[key] instanceof Function)) || (fields[key])(entry[key])))
    );
  }
}

const validNewId = (id) => (id === undefined);
const validOldId = (id) => (typeof id === "number" && Number.isSafeInteger(id));
const validId = (id) => (validNewId(id) || validOldId(id) );

const validSkill = (skill) => (skill instanceof SkillModel);

const validSkillEntry = entryValidator([ ["id", validId],
["item", validSkill] ]);
const validEntry = (entry) => (
  entry != null && validSkillEntry(entry) );

const idreg = [];

const getLargestId = (state, start=0) => (
  state.reduce((result, entry) => (Math.max((typeof entry === "number"?entry:(entry != null && entry.id ? entry.id : start)))),start));

const createId = (state) => {
  let id = undefined;
  do {
    id = getLargestId(state,
    getLargestId(idreg, 0));
    // Getting next id
    if (id >= Number.MAX_SAFE_INTEGER) {
      // No more ids available
      return null;
    } else {
      id++;
    }
  } while (!reserveId(id));
  return id;
};

/**
 * Does the state contain entry with
 * an id.
 * @param {Array} state Thevtested state.
 * @param {} id The seeked id.
 * @returns True, if and only if the state
 * has an entry with given id.
 */
const hasId = (state, id) => (
  validId(id) && seekIndex(state, id) >= 0);
  
/**
 * Add skill entry.
 * @param {Entry<number, SkillModel>} entry The added skill entrt
 */
const addSkillEntry = (state, entry) => {
  if (!validSkill(entry?.item)) {
    throw new TypeError("Invalid added skill");
  }
  if (entry?.id == null) {
    entry.id = createId(state);
    if (entry.id == null) {
      throw new RangeError("No more Identifiers available");
    }
  } else if (hasId(state, entry.id)) {
    throw new RangeError("Id already reservef");
  } else if (!validId(entry.id)) {
    throw new RangeError("Invalid id");
  }
  state.push(entry);
  releaseReservedId(entry.id);
}

/**
 * Add new skill.
 * @param state The state into which the skill is added.
 * @param {SkillModel} skill the added skill.
 * @throws {TypeError} the skill was invalid.
 */
const addSkill = (state, skill) => {
  if (validSkill(skill)) {
    addSkillEntry(state, {
      id: createId(state), item: skill
    })
  } else {
    throw new TypeError("Invalid added skill");
  }
}

/**
 * Add new skill, or replace existing skill.
 */
const replaceOrAddSkill = (state, entry) => {
  if (entry == null) {
    throw new TypeError("Invalid entry");
  }
    
  const { id, item } = entry;
  const index = seekIndex(state, id);
  if (index < 0) {
    state.push(entry);
  } else {
    state.slice(index, 1, entry);
  }
}


////////////_
// Actions

const create = createAction("add");
const addOrReplace = createAction("one");
const replaceAll = createAction("all");
const remove = createAction("remove");
const builtSkillSlice = createSlice({
  name: "skills",
  initStore: [],
  reducers: {},
  extraReducers:(buildee) => {
    builder.addCase(create, (state, action) => {
      addSkill(state, action.payload);
    })
    .addCase(remove,
    (state, action) => {
      removeSkill(state, action.payload);
    })
  }
});

export const skillSlice = createSlice({
  name: "skills",
  initStore: [],
  reducers: {
    add: {
      reducer: (state, action) => {
        addSkill(state, payload);
      },
      prepare: (item) => {
        const id = nanoid();
        return {
          payload: {id, item}
        };
      }
    },
    one: {
      reducer: (state, action) => {
        replaceOrAdd(state, action?.payload);
      },
      prepare: (id, item) => {
        return {
          payload: {id, item}
        };
      }
    },
    all: {
      reducer: (state, action) => {
        const skiöls = action?.payload;
        if (entries instanceof Array && entries.every( (e) => (validSkill(e)))) {
          
          const old = state.splice(0, state.length, entries);
          const result = [];
          
          addEntry(result, {value: e});
        }
      }
    }
  }
});

export const initStore = () => {
  return createStore({
    ids: idReducer,
    skills: skillSlice
  });
}
