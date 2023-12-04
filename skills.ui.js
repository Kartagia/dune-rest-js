
import { initializeApp } from "./cdn_modules/firebase@10.7.0/firebase-app.js";
import { doc, collection, getDoc, setDoc, getDocs, query,
  getFirestore
} from "./cdn_modules/firebase@10.7.0/./cdn_modules/firebase@10.7.0/firebase-firestore.js";
import firebaseConfig from "./data/firebase.config.json";


console.log("Loading firebase");
console.table(firebaseConfig)

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


/**
 * The data types of the firestore
 * @typedef {Object|number|string} FirestoreTypes
 */
 // TODO: Add more supported types.


/**
 * @typedef {Object} SkillModel
 */
 
/**
 * Converter converting skills.
 */
export const skillConverter = {
  /**
   * @param {SkillModel} source The value to.convert.
   * @returns {FirestoreTypes} The firebase representation of the source.
   */
  toFirestore: (source) => {
    return {
      name: source.name,
      description: source.description
    };
  },
  /**
   * @param {Snapshot} snapshot
   */
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return {
      name: data.name,
      description: data.description
    };
  }
}

const skillsRoot = collection(db, "skills")

/**
 * Initialize skills.
 * @returns {Promise<never>} The promise of completion.
 */
export function initSkills() {
  
}

/**
 * Get skills from firestore.
 * @returns {Promise<SkillModel[]>}
 */
export async function getSkills() {
  return getDocs(query(skillsRoot));
}


///////////
// UI methods

/**
 * @typedef {Object} ElementOptions
 * @property {(Node|string)[]} [tooltip] The tooltip of the element.
 * @property {string|string[]} [class=[]] The CSS classes of the element.
 */

/**
 * Create a element.
 * @param {string} name Element name.
 * @param {ElementOptions} [options={}] Options.
 * @param {(Node|string)[]} [...content] The element content.
 */
export function createElement(name, options={}, ...content) {
  const result = document.createElement(name);
  if (options.tooltip) {
    const tooltip = createElement("span", {class: ["tooltip"]}, document.createTextNode(options.tooltip));
    tooltip.style.display = "none";
    result.appendChild(tooltip);
    result.addEventListener("mouseover", () => {tooltip.style.display = "block"})
    result.addEventListener("mouseout", () => {tooltip.style.display = "none"})
  }
  
  // Adding style classes
  if (options.class) {
    result.classList.add(...(options.class))
  }
  // Adding content
  content.forEach(
    (added) => {
      if (added instanceof Node) {
        result.appendChild(added)
      } else {
        result.appendChild(document.createTextNode(""+added));
      }
    })
  
  return result;
}

/**
 * Create a heading 1 element.
 * @param {ElementOptions} [options={}] Options.
 * @param {(Node|string)[]} [...content] The element content.
 */
export function h1(options = {}, ...content) {
  return createElement("h1", options, content);
}
/**
 * Create a section header element.
 * @param {ElementOptions} [options={}] Options.
 * @param {(Node|string)[]} [...content] The element content.
 */
export function createHeader(
  options={}, ...content) {
  return createElement("header", options, content);
}

/**
 * Create a section contents element.
 * @param {ElementOptions} [options={}] Options.
 * @param {(Node|string)[]} [...content] The element content.
 */
export function createMain(
  options={}, ...content) {
  return createElement("main", options, content);
}
/**
 * Create a section footer element.
 * @param {ElementOptions} [options={}] Options.
 * @param {(Node|string)[]} [...content] The element content.
 */
export function createFooter(
  options={}, ...content) {
  return createElement("footer", options, content);
}


/**
 * Load content intö a node.
 * @param {Element} target The target node.
 * @param {Promise<Element>} content The promise of contgnt.
 * @param {string} [placeHolder] The placeholder during loading.
 */
export async function loadContent(
target, content, placeHolder="Loading..."
  ) {
    const placeholder = document.createTextNode(placeHolder);
    target.appendChild(placeholder);
    return content.then(
      (loaded) => {
        if (loaded instanceof Array) {
          if (placeholder.nextSibling) {
            const follower = placeholder.nextSibling;
            loaded.filter( (added) => (added instanceof Node) ).forEach( (added) => {
              target.insertBefore(added, follower)
            })
          } else {
            loaded.filter( (added) => (added instanceof Node) ).forEach((added) => {
              target.appendChild(added)
            })
          }
          target.removeChild(placeholder);
        } else if (loaded instanceof Node) {
          target.replaceChild(loaded, placeholder);
        } else {
          target.removeChild(placeholder);
        }
      },
      (error) => {
        placeholder.textContent =  "Loading failed";
        throw {target: placeholder, error};
      }
    )
  }
// Building ui
const root = document.getElementById("root");
const sec = document.createElement("section");
root.appendChild(root);
const header = createHeader();
const main = createMain();
const footer = createFooter();
sec.appendChild(header);
sec.appendChild(main);
sec.appendChild(footer);
loadContent(header, Promise.resolve(h1("Skills"))).catch(
  ([ /** @type {Node} */ target, /** @type {any} */ error])=> {
    header.removeChild(target);
    console.error(`Loading header failed: ${error ? error : "No reason given"}`)
  });
  
loadContent(main,
getSkills().then(
  (skills) => {
    return skills.map(
      (skill) => {
        const result = document.createElement("article");
        result.appendChild(createSpan(skill.name, {tooltip: skill.description}));
        return result;
      })
  }
  )
).catch(
  ([ /** @type {Node} */ target, /** @type {any} */ error]) => {
    header.removeChild(target);
    console.error(`Loading content failed: ${error ? error : "No reason given"}`)
  });
  
console.log("Firebase skills loaded")