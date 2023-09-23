export function parseJsonData(json) {
  if (data instanceof Array) {
    // Array not supported
    console.log("Array data not supported");
  } else if (data instanceof Object) {
    data.forEach((d, i) => {
      console.log(`Parsing ${d} of ${i}`);
      const child = document.createElement("section");
      child.setAttribute("id", i);
      parseChildren(d, i).forEach(
        (added) => {
          child.appendChild(added)
        }
      );
      document.getElementById("main").appentChild(child);
    })
  }
}



/**
 * @param json The JSON of the children.
 * @param {string} type The type of the node.
 * @return {Array<Node>} The DOM Nodes of the children.
 */
export function parseChildren(json, type) {
  const result = new Array();
  if (json instanceof Array) {
    json.forEach(
      (item, index) => {
        result.push(document.createComment(`Item ${index}`));
        const parsed = parseItem(item, type);
        if (parsed) {
          result.push(parsed);
        }
      });
  } else if (typeof json === "object") {
    json.list.forEach(
      (item, index) => {
        result.push(document.createComment(`Item ${index}`));
        const parsed = parseItem(item, type);
        if (parsed) {
          result.push(parsed);
        }
      }
    );
  }
  return result;
}

export function parseItem(json, type, id = undefined) {
  const result = document.activeElement("article");
  if (id) {
    result.setAttribute("id", id);
  }
  switch (type) {
    case "skill":
    case "skills":
      result.setAttribute("class", "skill");
      result.textContent = json;
      break;
    case "person":
    case "people":
      result.setAttribute("class", "people");
      result.textContent = json.name;
      break;
    case "motivation":
    case "motivations":
      result.setAttribute("class", "motivation");
      result.textContent = json;
      break;
    default:
      return undefined;
  }

  return result;
}