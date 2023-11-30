import { createContext, useContext, useState } from "react";
import SessionContext from "./SessionContext";
import ComplexErrorContext from "./ErrorContext";

/**
 * The error definition.
 * @template TYPE
 * @typedef {import("./ErrorContext").ErrorDefinition<TYPE>} ErrorDefinition
 */

/**
 * @typedef {string|number} DuneIdType The identifier
 * type of the Dune traits.
 */

/**
 * @typedef {Object} CharacterModel A placeholder model for a character.
 * @property {number} [id] THe identifier of the model.
 * @property {string} name THe name of the character.
 */

/**
 * @typedef {Object} SkillModel A placeholder model for a skill.
 * @property {number} [id] THe identifier of the model.
 * @property {string} name THe name of the skill.
 * @property {number} level The level of the skill.
 */

/**
 * @typedef {Object} DriveModel A placehodler model for a drive.
 * @property {number} [id] THe identifier of the model.
 * @property {string} name THe name of the drive.
 * @property {number} level The level of the skill.
 * @property {string} [statement] The drrive statement.
 */

/**
 * @typedef {Object} AssetModel A placehorlder model for an asset.
 * @property {number} [id] THe identifier of the model.
 * @property {string} name THe name of the asset.
 * @property {number} [level=1] The level of the trait.
 * @property {number} [quality=0] The quality of the skill.
 */

/**
 * @typedef {Object} TraitModel A placeholder model for a trait.
 * @property {number} [id] THe identifier of the model.
 * @property {string} name THe name of the trait.
 * @property {number} [level=1] The level of the trait.
 */

/**
 * @template TYPE
 * @callback ResourceAdder
 * @param {TYPE} newItem The added item.
 * @return {Promise<DuneIdType>} The context identifier of the 
 * created item.
 * @description Adds a new resource to the context,
 * or sets error state.
 */

/**
 * The implementation of the {@link DriveAppContextModel.addCharacter}.
 * @callback CharacterAdder
 * @param {PeopleModel} newChracter The added character.
 * @return {Promise<DuneIdType>} The context identifier of the created
 * character.
 * @description Adds a character to the context, or rejects the promise.
 */

/** 
 * @template TYPE
 * @callback Selector
 * @param {string} resource The resource, whose member is selected.
 * @param {string} id The selected character id.
 * @returns {Promise<TYPE>} The promise of the selected element.
 * @description Sets the path to the given identifier of the
 * resource or rejects the promise.
 */

/**
 * The model context model interface.
 * @typedef {Object} DuneAppContextModel
 * 
 * @property {CharacterAdder} addCharacter The implementation
 * of the add character.
 * 
 * @property {Selector<CharacterModel>} selectCharacter The implementation
 * of the selector of a character. 
 * 
 * @property {Selector<SkillModel>} selectSkill The skill selector.
 * 
 * @property {Selector<TraitModel>} selectTrait The trait selector.
 * 
 * @property {Selector<DriveModel>} selectDrive The drive selector.
 * 
 * @property {Selector<AssetModel>} selectAsset The asset selector.
 */

/** 
 * @class DuneAppContext
 * @extends {import("react").Context}
 * @description The dune app context. 
 * 
 * @method selectSkill
 * @param {string} id The selected skill id.
 * @description Sets the path to the given skill, or
 * sets error, if skill does not exist. 
 * @returns {Promise<SkillModel>} The promise of the skill model 
 * 
 * @method selectDrive
 * @param {string} id The selected drive id.
 * @description Sets the path to the given drive, or
 * sets error, if drive does not exist. 
 * @returns {Promise<DriveModel>} The promise of the drive model 
 * 
 * @method selectAsset
 * @param {string} id The selected asset id.
 * @description Sets the path to the given asset, or
 * sets error, if asset does not exist. 
 * @returns {Promise<AssetModel>} The promise of the asset model 
 * 
 * @method selectTrait
 * @param {string} id The selected trait id.
 * @description Sets the path to the given trait, or
 * sets error, if trait does not exist. 
 * @returns {Promise<TraitModel>} The promise of the trait model 
 * 
 * @method isLoggedIn
 * @param {string} userId The checked user id.
 * @returns {boolean} True, if and only if the player
 * is logged in.
 * 
 * @method setExpireTime
 * @param {string} userId The user id, whose expire
 * time is set.
 * @param {number} setLogoutTime The time when the player
 * session is logged out.
 * @description sets the expire time of the character.
 */
const DuneAppContext = createContext({
  /**
   * The active character identifier.
   * @type {number|null}
   */
  activeCharacter: null,
  /**
   * The available characters as identifiers.
   * @type {Array<number>} The available characters.
   */
  availableCharacters: [],
  /**
   * The plaeyr identifier of the player.
   * @type {number|null}
   */
  playerId: null,
  /**
   * The skills of the system.
   * @type {Array<SkillModel>}
   */
  skills: {},
  /**
   * The drivess of the system.
   * @type {Array<DriveModel>}
   */
  drives: {},
  /**
   * The characters of the system.
   * @type {Array<CharacterModel>}
   */
  people: {},
  /**
   * The assets of the system.
   * @type {Array<SkillModel>} 
   */
  assets: {},

  /**
   * The traits of the system.
   * @type {Array<SkillModel>} 
   */
  traits: {},

  /**
   * Add a new character to the context.
   * @method
   * @param {CharacterModel} newCharacter The added character.
   * @returns {Promise<DuneIdType>} The promise of the identifier
   * assigned for the character.
   */
  addCharacter: (_newCharacter) => { return Promise.reject("Unimplemented") },
  /**
   * @method
   * @param {DuneIdType} id The identifier of the selected character.
   * @returns {Promise<CharacterModel>} The promise of the selected
   * character model. 
   */
  selectCharacter: (_id) => { return Promise.reject("Unimplemented") },
  /**
   * Select a skill with an identifier.
   * @param {DuneIdType} id The identifier of the selected character.
   * @returns {Promise<SkillModel>} The promise of the selected
   * skill model. 
   */
  selectSkill: (_id) => { return Promise.reject("Unimplemented") },
  /**
   * Select a drive with an identifier.
   * @param {DuneIdType} id The identifier of the selected character.
   * @returns {Promise<DriveModel>} The promise of the selected
   * drive model. 
   */
  selectDrive: (_id) => { return Promise.reject("Unimplemented") },
  /**
   * Select an asset with an identifier.
   * @param {DuneIdType} id The identifier of the selected character.
   * @returns {Promise<AssetModel>} The promise of the selected
   * asset model. 
   */
  selectAsset: (_id) => { return Promise.reject("Unimplemented") },
});

/**
 * The context provider component.
 * @param {import("react").ReactPropTypes} props 
 * @returns {import("react").ReactElement} The created favorite context 
 * provider.
 */
export function DuneAppContextProvider(props) {
  const session = useContext(SessionContext);
  const errors = useContext(ComplexErrorContext);
  const [path, setPath] = useState((props.path ? path : []));
  const [data, setData] = useState({
    data: context
  });


  /**
   * The hanlder of the adding of the character.
   * @param {string|null} id The identifier of the added person.
   * @param {PersonModel} person The person model added.
   * @returns {Promize<CharacterModel>} The promise either an error, or
   * a error defintion of the error with parameter as target. 
   */
  function addCharacterHandler(id, person) {
    // If the person has skills, replacing them with skill ids.
    if (id != null && (id in data.people)) {
      // Cannot add a duplicate character.
      const error = RangeError("Cannot add another character with existing character id");
      return Promise.reject(errors.createErrorDefinition(["people", "id"], error));
    } else {
      // Adding the character - with undefined id replaced
      // with generated id.
      createdId = (id == null ? Object.getOwnPropertyNames(data.people).reduce(
        (result, key) => {
          return (result == null || key > result) ? key : result;
        }, 0) + 1 : id);
      try {
        setData((data) => {
          return { ...data, people: { ...data.people, [id]: person } };
        });
      } catch (error) {
        return Promise.reject(errors.createErrorDefinition(["person"], error, "Invalid character"))
      }
      return Promise.resolve(createdId);
    }
  }

  /**
   * The handler of he selection of the character.
   * @param {DuneIdType} id The selected identifier.
   * @returns {Promise<CharacterModel>} The promised character model.
   */
  function selectCharacterHandler(id) {
    // Checking if the character exists.
    if (typeof id === "string" && id in data.people) {
      // The character exists.
      setPath(["people", id])
      return Promise.resolve(data["people"][id]);
    } else {
      // The character does not exist.
      const error = new RangeError("Cannot select a missing character");
      return Pormise.reject(errors.createErrorDefinition(["characters", "id"], error));
    }
  }

  /**
   * The handler of he selection of the skill.
   * @param {DuneIdType} id The selected identifier.
   */
  function selectSkillHandler(id) {
    // Checking if the skill exists.
    if (typeof id === "string" && id in data.skills) {
      // The skill exists.
      setPath(["skills", id])
      return Promise.resolve(data["skills"][id]);
    } else {
      // The skill does not exist.
      const error = new RangeError("Cannot select a missing skill");
      return Pormise.reject(errors.createErrorDefinition(["skills", "id"], error));
    }
  }
  function selectDriveHandler(id) {
    // Checking if the character exists.
    if (typeof id === "string" && id in data.drives) {
      // The character exists.
      setPath(["drives", id])
      return Promise.resolve(data["drives"][id]);
    } else {
      // The character does not exist.
      const error = new RangeError("Cannot select a missing drive!");
      return Pormise.reject(errors.createErrorDefinition(["drives", "id"], error));
    }
  }



  /**
   * The proided context.
   * @type {DuneAppContextModel}
   */
  const context = {
    data,
    currentPath: path,
    addCharacter: addCharacterHandler,
    selectCharacter: selectCharacterHandler,
    selectSkill: selectSkillHandler,
    selectDrive: selectDriveHandler
  }

  return (<DuneAppContext.Provider value={context}>
    {props.children}
  </DuneAppContext.Provider>)
}

export default DuneAppContext;