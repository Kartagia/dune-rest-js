import { createStore } from "../cdn_modules/redux@4.2.1/redux.js";
import { createSelector } from "../cdn_modules/reselect@4.1.8/reselect.js";
import { Skill } from "./skill.mjs";

function unescapeString(val) {
  if (typeof val === "string") {
    const map = new Map(
      [['f', "\f"], ['n', "\n"], ['t', "\t"], ['r', "\r"]]);
    const re = RegExp("\\(.)", "g");
    let match;
    while ((match = re.exec(val))) {
      const replacement = map.get(match[1]) || match[1];
      val.splice(match.index, match[0].length, replacement);
      re.lastIndex = match.index + replacement.length;
    }
  } else {
    return undefined;
  }
}

/**
 * Get regular expression matching
 * values of type.
 * @param {Map|Array|string} def the action definition, or the type string.
 * @returns {RegExp} The regular expression matching the values of the type.
 */
function getRegExp(def) {
  if (def == null) {
    return getRegExp("");
  } else if (def instanceof Array) {
    return getRegExp(def[1]);
  } else if (typeof def === "object") {
    return getRegExp(def.type);
  } else if (typeof def === "string") {
    switch (def.trim()) {
      case "x":
      case "hex":
        return RegExp("(?:0x|\\x)?[\da-f]+", "yi");
      case "X":
      case "Hex":
        return RegExp("(?:0X|\\X)?[\dA-F]+", "y");
      case "d":
      case "dec":
      case "number":
        return RegExp("[+-]?\\d+(?:\\.\\d+)?", "y");
      case "int":
      case "i":
      case "integer":
        return RegExp("[+-]?\\d+", "y");
      case "string":
        return RegExp("\"(?:[^\"\\]+|\\.)*\"|\\w*", "y")
      default:
        return RegExp("[^/]*", "yu");
    }
  } else {
    return getRegExp("");
  }
}

/**
 * Get the vqlue parser of the type.
 * 
 * @param {Map|Array|string} def the action definition, or the type string.
 * @returns {Function} The function parsing value of the type.
 */
function getParser(def) {
  if (def == null) {
    return getRegExp("");
  } else if (def instanceof Array) {
    return def[2] || getParser(def[1]);
  } else if (typeof def === "object") {
    return def.parser || getParser(def.type);
  } else if (typeof def === "string") {
    const re = getRegExp(def.trim());
    switch (def.trim()) {
      case "x":
      case "hex":
        return (val) => {
          if (re.test(val)) {
            const delim = ["0x", "\\x"].find((v) => (val.startsWith(v)));
            if (delim) {
              return Number.parseInt(val.substring(delim.length).toLowerCase(), 16);
            } else {
              return Number.parseInt(val.toLowerCase(), 16);
            }
          } else {
            throw RangeError("Not a hex int");
          };

        }
      case "X":
      case "Hex":
        (val) => {
          if (re.test(val)) {
            const delim = ["0X", "\\X"].find((v) => (val.startsWith(v)));
            if (delim) {
              return Number.parseInt(val.substring(delim.length).toLowerCase(), 16);
            } else {
              return Number.parseInt(val.toLowerCase(), 16);
            }
          } else {
            throw RangeError("Not a hex int");
          };
        }
      case "d":
      case "dec":
      case "number":
        return (value) => (
          re.test(value) ? (value.indecOf(".") == -1 ? Number.parseInt(value) : Number.parseFloat(value)) : undefined);
      case "int":
      case "i":
      case "integer":
        return (value) => (
          re.test(value) ? Number.parseInt(value) : undefined);
      case "string":
        return (value) => (re.test(value) ? (value.startsWith("\"")
          ? unescapeString(value.substring(1, value.length - 1)) : value) : undefined);
      default:
        return (value) => (re.test(value)
          ? decodeURIComponent(value)
          : undefined);
    }
  } else {
    return getRegExp("");
  }
}

function parseActionDef(action) {
  const result = [];
  if (action) {
    const paramRegex = /\{(?<key>\w+)(?::(?<type>[^{}]*))?\}/ug;
    let match = undefined;
    let last = 0;
    while ((match = paramRegex.exec(action))) {
      result.push(action.substring(last, match.index));
      last = paramRegex.lastIndex;
      result.push({ name: match.groups["key"], type: (match.groups["type"] || "") });
    }
    if (last < action.length) {
      result.push(action.substring(last));
    }
  }
  return result;
}

/**
 * @param {string} action The matched action.
 * @param {Array|string} actionDef The action definition.
 * @param {boolean} [open=false] Is the action open ended.
 */
function matchAction(action, actionDef, open = false) {
  if (actionDef instanceof Array) {
    if (action == null) {
      return false;
    } else {
      const result = [];
      const actStr = "" + action;
      let index = 0;
      actionDef.forEach((def) => {
        if (typeof def === "object") {
          // Parameter type
          const re = getRegExp(def);
          re.lastIndex = index;
          let match = re.exec(actStr);
          if (match) {
            result.push(getParser(def)(match[0]));
            index = re.lastIndex;
          } else {
            return false;
          }
        } else if (actStr.startsWith(def, index)) {
          result.push(def);
          index += def.length;
        } else {
          // Pattern failed
          return false;
        }
      })
      if (index < actStr.length) {

        if (open) {
          result.push(actStr.substring(index));
        } else {
          return false;
        }
      }
      return result;
    }
  } else {
    return matchAction(action, parseActionDef("" + actionDef), open);
  }
}

function actionArrayReducer(state, command, actions = [], keyToAction = (key) => (key), matchAction = (source, target) => (source === target)) {
  const action = actions.find(
    (entry) => {
      if (entry instanceof Array) {
        return matchAction(command.type, keyToAction(entry[0]));
      } else {
        return matchAction(command.type, keyToAction(entry.name));
      }
    }
  );
  if (action != undefined) {
    const executor =
      (action instanceof Array ?
        action[1] : action.action);
    if (action) {
      return action(state, command);
    } else {
      return state;
    }
  } else {
    return state;
  }

}
function actionMapReducer(state, command, actionMap, keyToAction = (key) => (key)) {
  if (actionMap instanceof Map) {
    const action = actionMap.entries().find((value, key) => (keyToAction(key) === command.type));
    if (action) {
      return action(state, command);
    } else {
      return state;
    }
  } else {
    return state;
  }
}

function reducer(state, action, module, actions = {}) {
  if (actions) {
    const moduleAction = (key) => (`${module}/${key}`);
    if (actions instanceof Map) {
      return actionMapReducer(state, action, actions, moduleAction);
    } else if (typeof actions instanceof Array) {
      return actionArrayReducer(state, action, actions, moduleAction);
    } else if (actions instanceof Function) {
      return actions(state, action, module);
    } else {
      console.log("Unknown action set");
      return state;
    }
  } else {
    //
    console.log("Unknown action: ", action);
    return state;
  }
}

/**
 * Add item to target.
 * @template ITEM
 * @param {Array<ITEM>} target The altered list.
 * @param {ITEM} item The added item.
 * @return {Array<ITEM>} If the item was added, a new list with item added. Otherwise the original target.
 */
const addItem = (target, added) => {
  if (target instanceof Array) {
    return [...target, added];
  } else {
    return target;
  }
};

/**
 * Delete item from target.
 * @param {Array} target 
 */
const deleteItem = (target, item) => {
  if (target instanceof Array) {
    const index = target.findIndex((v) => (v === item));
    return (index < 0 ? target : [
      ...(target.slice(0, index)), ...(target.slice(index + 1))]);
  } else {
    return target;
  }
};

const selectName = (state, name) => (name);
const selectByName = (state, name) => (state.find((v) => (v.name === name)));

const selectId = (state, id) => (id);



/**
 * Select field value.
 * @param {object|undefined|null} source The source of the field.
 * @param {string|symbol} field The sought field. 
 * @returns {*} The value of the field, if the field exists. An undefined value otherwise.
 */
const selectFieldValue = (state, field) => ((state == null ? null : state[field]));
const selectIdValue = (state) => (selectFieldValue(state, field));
const selectById = (state, id) => (state.find((v) => (v.id === id)));


const selectSkills = (state) => (state.skills);
const selectMotivations = (state) => (state.motivations);
const selectPeople = (state) => (state.people);

const selectSkillByName = createSelector([selectSkills, selectName], selectByName);

const selectMotivationByName =
  createSelector([selectMotivations, selectName], selectByName);

const selectPersonById =
  createSelector([selectPeople, selectId], selectById);

function skillActions() {
  const getOrCreate = (state) => {
    if (state) {
      if (state.skills instanceof Array) {
        return state;
      } else {
        return { ...state, skills: [] };
      }
    } else {
      return { skills: [] };
    }
  };
  const result = new Map();
  result.set("set",
    createSelector([selectSkills, (_, skill) => (skill)],
      (skills, skill) => {
        if (skill == null) return skills;

        const index = skills.findIndex(
          (v) => (selectName(v) === selectName(skill)));
        if (index < 0) {
          return [
            ...(skills.slice(0, index)),
            skill,
            ...(skilld.slice(index + 1))
          ];
        } else {
          return skills;
        }
      }));
  result.set("add",
    createSelector([selectSkills, (_, skill) => (skill.added)], addItem
    ));
  return result;
}

function skillReducer(state = {
  skills: []
}, action) {
  return reducer(state, action, skillActions());
}

const data = createStore(skillReducer);

/**
 * Get skills of the data.
 * @returns {Array<SkillModel>} The skill model data.
 */
export function getSkills() {
  return selectFieldValue(data.getState(), "skills");
}

/**
 * Add a skill to the data.
 * @param {Skill} skill The added skill. 
 * @returns {boolean} True, if and only if the skill was added.
 */
export function addSkill(skill) {
  if (skill instanceof Skill) {
    if (hasSkill(skill.name)) {
      throw new Error("Skill already exists");
    }
    data.dispatch();
    getSkills().push(skill);
    return true;
  } else if (skill) {
    const name = "" + skill;
    if (hasSkill(name)) {
      throw new Error("Skill already exists");
    } else {
      data.skills.push(new Skill({ name: name }));
    }
  } else {
    return false;
  }
}

/**
 * Get skills of the data.
 * @param {string} name The name of the spught skill.
 * @return {Skill?} The skill of the storage, if any exists.
 */
export function getSkill(name) {
  return data.getState().skills.find(
    v => (v.name === name));
}

