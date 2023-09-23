

export function updateSkillElement(node, skill, id=null) {
  if (skill) {
    const skillId = (id==null?node.getAttribute("id"):id);
    var elem = document.getElementById(createId(id, "name"));
    if (elem) {
      elem.textContent = skill.name;
    }
    elem = document.getElementById(createId(id, "level"));
    if (elem) {
      elem.textContent = skill.level;
    }
  }
}

export function createSkillElement(node, skill) {
  const name = document.createElement("span");
  const id = node.getAttribute("id");
  name.textContent = skill.name;
  name.setAttribute("class", "name");
  name.setAttribute("id", createId(id, "name"));
  const level = document.createElement("span");
  level.setAttribute("class", "level");
  name.setAttribute("id", createId(id, "level"));
  level.textContent = (skill.level ? skill.level : "");
  node.appendChild(name);
  const remove = document.createElement("input");
  remove.setAttribute("type", "button");
  remove.setAttribute("value", "Remove");
  remove.addEventListener("click", (e) => {
    e.target.parent.remove();
    data.skills = data.skills.filter((k) => (k.name !== skill.name));
  });
  node.appendChild(remove);
}

const skillSection = getSection("skills");
getSkills().forEach(
  (skill) => {
    const id = createId("skills", skill.name);
    if (document.getElementById(id) == null) {
      // Create new
      const node = document.createElement("article");
      node.setAttribute("id", id);
      node.addEventListener("click",
        event => {
          alert('Selected ${id}');
        });
      createSkillElement(node, skill);
      skillSection.appendChild(node);
    } else {
      // Updating
      const node = document.getElementById(id);
      updateSkillElement(node, skill);
    }
  });