const SectionNameRE= RegExp("\\p{L}[\\p{L}\\d_-]*");

export function validSection(name) {
  return name != null && SectionNameRE.matches(name);
}

export function getSection(name) {
  if (validSection(name)) {
    return document.getElementById(name);
  } else {
    return undefined;
  }
}

export function getSectionItem(name , target) {
  const itemSelect = (typeof target === "number" ? `:nth-child(${target} of article)`:` >article#${target}`);
  let query = `(main|section)#${name}${itemSelect}]`;
  console.log("Query: ", query);
  return document.querySelector(query);
}

console.log("ES6 sections module loaded");