import {parseItem} from "./person.mjs";
export function addSection(type, parent = null) {
      alert(`Creating section ${type} on node ${parent}`)
      if (typeof type !== "string") {
        throw new TypeError("Invalid type type");
      }

      //TODO: Replace with isId
      if (type === "" || type.trim() !== type) {
        throw new RangeError("Invalid type value");
      }
      if (getSection(type, parent) == null) {
        const section = document.createElement("section");
        section.setAttribute("id", type);
        const caption = document.createElement("div");
        caption.textContent = type;
        section.appendChild(caption);
        (parent || document.getElementById("main")).appendChild(section);
        return true;
      } else {
        return false;
      }
    }

export function getSection(type, parent = null) {
      const result = Array();
      const sections = document.evaluate(
        `./section[@id="${type}"]`,
        (parent || document.getElementById("main")),
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE
      );
      let section = sections.iterateNext();
      while (section) {
        result.push(section);
        section = sections.iterateNext();
      }
      return result[0];
    }

/**
 * Handle qdding a new entry.
 * @param {SubmitEvent} formEvent 
 * The form event.
 */
export function addNew(formEvent) {
  console.log(`Handling: ${formEvent}`);
  alert(`form Event: ${formEvent}`);
      const data = new FormData(formEvent);
      const type = data.type;
      let section = null;
      let sectionName = null;
      let item = null;
      switch (type) {
        case 'people':
          // People
          sectionName = "people";
          item = { name: data.name };
          break;
        case 'motivation':
          // Motivation
          sectionName = "motivations";
          item = data.name;
          break;
        case 'skill':
          // Skill
          sectionName = "skills";
          item = data.name;
          break;
        default:
          alert("Unknown added item");
          return;
      };
      formEvent.preventDefault();

      addSection(sectionName);
      section = getSection(sectionName);
      parseItem(item, sectionName).forEach(
        (child) => {
          section.appendChild(child);
        }
      );
    };