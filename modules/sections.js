/**
 * Classic JS version of the sections module.
 */
 
 
 const SectionNameRE = RegExp("\\p{L}[\\p{L}\\d_-]*");
 
 function validSection(name) {
   return name != null && SectionNameRE.matches(name);
 }
 
 function getSection(name) {
   if (validSection(name)) {
     return document.getElementById(name);
   } else {
     return undefined;
   }
 }
 
 function getSectionItem(name, target) {
   const itemSelect = (typeof target === "number" ? `:nth-child(${target} of article)` : ` >article#${target}`);
   let query = `(main|section)#${name}${itemSelect}]`;
   console.log("Query: ", query);
   return document.querySelector(query);
 }
 console.log("Classic module sections loaded");
 exports = { validSection, getSection, getSectionItem };