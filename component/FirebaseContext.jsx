import { useState, useContext } from "react";
import SessionContext from "./SessionContext";
import DuneAppContext from "./DuneAppContext";
import { getApp, initializeApp } from "firebase/app";
import {
  getFirestore, collection, query, where, getDocs, getDoc, doc
} from "firebase/firestore";
import ComplexErrorContext from "./ErrorContext";
import config from "../private/firebase.config.json";

/**
 * The predicate type returning a promise.
 * @template TYPE
 * @typedef {import("../modules/tools.promise.mjs").Predicate<TYPE>} Predicate
 */

/**
 * The supplier of a value.
 * @template TYPE The value type. 
 * @typedef {import("../modules/tools.promise.mjs").Supplier<TYPE>} Supplier
 */

/**
 * The getter of the collection members.
 * @template TYPE The collection member type.
 * @typedef {Supplier<Array<TYPE>>} CollectionGetter
 */

/**
 * The logger stub for future replacement with logging system.
 */
const logger = console;


/**
 * The firebase context implementing both session
 * and dune app context.
 * @module FirebaseContext
 */

/**
 * The user information structure.
 * @typedef {import("firebase/auth").UserInfo} UserInfo
 */

/**
 * The firebase using implemetnation of the dune app context.
 * @param {import("react").PropsWithChildren} props The properties of 
 * the context provider component.
 * @param {string[]} [path=[]] The initial path within the context.
 * @param {string[]} [rootPath=[]] All paths of the context path are preceded by the
 * root path.
 * @param {string[]} [dbRootPath=[]] The root database path where the context begins.
 * @param {import("firebase/app").FirebaseApp} [props.app] The firebase application.
 * @param {import("firebase/app").FirebaseAppSettings} [props.fireBaseConfig]
 * The firebase configuration used to initialize the app. Defaults to the 
 * default configuration load from private JSON file.
 * @returns {import("react").JSXElementConstructor} The react component
 * of the dune app context provider.
 */
export function DuneAppContextProvider(props) {
  const session = useContext(SessionContext);
  const errors = useContext(ComplexErrorContext);
  const [dbRootPath] = useState(props.dbRootPath || []);
  const [rootPath] = useState(props.rootPath || []);
  const [path, setPath] = useState(props.path || []);
  const [app, setApp] = useState(props.app || initializeApp(props.fireBaseConfig || config))
  const [db, setDb] = useState(getFirestore(app))
  const [data, setData] = useState({
    /** @type {SkillModel[]} */ skills: [],
    /** @type {DriveModel[]} */ drives: [],
    /** @type {TraitModel[]} */ traits: [],
    /** @type {AssetModel[]} */ assets: [],
    /** @type {CharacterModel[]} */ people: []
  });
  const [isLoaded, setIsLoaded] = useState(
    {
      /** @type {boolean} */ skills: false,
      /** @type {boolean} */ drives: false,
      /** @type {boolean} */ traits: false,
      /** @type {boolean} */ assets: false,
      /** @type {boolean} */ people: false,
    }
  )
  // Use effect hook to load the database snapshot during
  useEffect(async () => {
    if (session == null || !(session.isLoggedIn())) {
      // The session is not logged in thus we do not have database to load.
      logger.error(`Attempting to load firebase while not logged in`);
      return;
    }
    // Loading collections the people are relying on before
    // loading the people. 
    // - The previously loaded collections may be used to decipher
    //  the people collection to the people model.
    const dependedCollections = ["skills", "traits", "assets", "drives"];
    Promise.all(
      dependedCollections.map(
        async (collectionName) => {
          // Creating a promise for all collections.
          return new Promise((resolve, reject) => {
            try {
              logger.log(`Loading ${collectionName}...`);
              resolve(query(collection(getFirestore(), ...dbRootPath, collectionName), where("id", ">", 0)));
            } catch (error) {
              reject(error);
            }
          }).then((result) => {
            setIsLoaded((current) => ({ ...current, [collectionName]: true }));
            logger.log(`Collection [${collectionName}] loaded.`);
            setData((current) => ({ ...current, [collectionName]: result }));
          })
            .catch((error) => {
              // Logging failure.
              logger.error(`Could not load [${collectionName}]!`)
              throw error;
            })
        })).then(() => {
          // The loading of the people requires all other collections are populated.
          async (result) => {
            const collectionName = "people";
            return new Promise((resolve, reject) => {
              try {
                logger.log(`Loading ${collctionName}...`);
                resolve([...result,
                query(collection(db, ...dbRootPath, collectionName))
                ]);
              } catch (error) {
                reject(error);
              }
            }).then((result) => {
              // The people has been loaded.
              setIsLoaded((current) => ({ ...current, [collectionName]: true }));
              logger.log(`Collection [${collectionName}] loaded.`);
              setData((current) => ({ ...current, [collectionName]: result }));
            })
              .catch((error) => {
                // Logging failure.
                logger.error(`Could not load [${collectionName}]!`)
                throw error;
              })
          }
        })
  }, []);

  /**
   * Get the collection contents.
   * @template TYPE The type of hte collection entry.
   * @param {string} collectionName The name of the queried collection.
   * @param {Predicate<TYPE>} [filter] The filter filtering the resulting
   * values.
   * @returns {Promise<TYPE[]>} The promise of the collection contents.
   */
  function getCollection(collectionName, filter = null) {
    if (collectionName in data) {
      if (filter) {
        // TODO: Implement firebase filters.
        return Promise.resolve(data[collectionName].filter(filter));
      } else {
        return Promise.resolve(data[collectionName]);
      }
    } else {
      return Promise.reject(errors.createErrorDefinition(collectionName,
        new RangeError("Collection does not exist")));
    }
  }

  /**
   * Update collection. 
   * @template TYPE The type of the collection entry.
   * @param {string} collectionName The name of the set collection.
   * @param {Array<TYPE>} contents The contents of the collection.
   * @returns {Promise<never>} The promise of the completion of the
   * update.
   */
  function setCollection(collectionName, contents) {
    return Promise(async (resolve, reject) => {
      if (session.isLoggedIn()) {
        if (typeof collectionName === "string") {
          await setDoc(doc(db, ...dbRootPath, collectionName), contents);
          resolve();
        } else {
          const error = TypeError("Invalid collection name");
          reject(errors.createErrorDefinition(collectionName, error))
        }
      } else {
        reject(errors.createErrorDefinition(collectionName,
          new Error("Authentication error: Write access requires login"),
          "Please, log in to proceed."))
      }
    })

  }

  /**
   * Getter of the skills.
   * @returns {Promise<SkillModel[]>}
   */
  const getSkills = () => {
    return data.skills;
  }
  /**
   * Setter of the skills.
   * @param {SkillModel[]} skills The new skills.
   * @returns {Promise<never>} The promise the skills
   * are updated. 
   */
  const setSkills = (skills) => {
    return setCollection("skills", skills);
  }

  /**
   * Getter of drives.
   * @type {import("./DuneAppContext").CollectionGetter<DriveModel>}
   */
  const getDrives = () => {
    return data.drives;
  }

  /**
   * Setter the drives.
   * @param {import("./DuneAppContext").CollectionSetter<DriveModel>} drives 
   * @returns {Promise<never>} The promise of completion.
   */
  const setDrives = (drives) => {
    return setCollection("drives", drives);
  }
  const getTraits = () => {
    return data.traits;
  }

  const setTraits = (traits) => {
    return setCollection("traits", traits);
  }
  const getAssets = () => {
    return data.assets;
  }
  const setAssets = (assets) => {
    return setCollection("assets", assets);
  }
  const getPeople = () => {
    return data.people;
  }
  const setPeople = (people) => {
    return setCollection("people", people);
  }

  // The context of the provider.
  const context = {
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
    skills: data.skills,
    /**
     * The drivess of the system.
     * @type {Array<DriveModel>}
     */
    drives: data.drives,
    /**
     * The characters of the system.
     * @type {Array<CharacterModel>}
     */
    people: data.people,
    /**
     * The assets of the system.
     * @type {Array<SkillModel>} 
     */
    assets: data.assets,

    /**
     * The traits of the system.
     * @type {Array<SkillModel>} 
     */
    traits,

    /**
     * Add a new character to the context.
     * @method
     * @param {CharacterModel} newCharacter The added character.
     * @returns {Promise<DuneIdType>} The promise of the identifier
     * assigned for the character.
     */
    addCharacter: (newCharacter) => {
      return Promise.reject("Unimplemented")
    },

    /**
     * Is the collection loaded.
     * @param {string} collectionName The collection nam.e
     * @returns {boolean} True, if and only if the collection is loaded.
     */
    isCollectionLoaded: (collectionName) => {
      return typeof collectionName === "string" && isLoaded[collectionName] == true;
    },

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
    selectSkill: (_id) => {
      if (drives[id]) {
        // Selectable.

      } else {
        // Error.
      }
    },
    /**
     * Select a drive with an identifier.
     * @param {DuneIdType} id The identifier of the selected character.
     * @returns {Promise<DriveModel>} The promise of the selected
     * drive model. 
     */
    selectDrive: (id) => {
      const collectionName = "drives";
      const all = getCollection(collectionName);
      if (id in all) {
        // The asset was found - returning the model.
        setPath([collectionName, id]);
        return Promise.resolve(all[id]);
      } else {
        return Promise.reject("Not found");
      }
    },
    /**
     * Select an asset with an identifier.
     * @param {DuneIdType} id The identifier of the selected character.
     * @returns {Promise<AssetModel>} The promise of the selected
     * asset model. 
     */
    selectAsset: (id) => {
      if (id in assets) {
        // The asset was found - setting path to the asset.
        return Promise.resolve(assets[id]);
      } else {
        return Promise.reject("Not found");
      }
    },
    setDrives,
    setSkills,
    setTraits,
    setPeople,
    setAssets,
    getDrives,
    getSkills,
    getTraits,
    getPeople,
    getAssets
  };

  return (<DuneAppContext.Provider value={context}>
    {props.children}
  </DuneAppContext.Provider>);
}

