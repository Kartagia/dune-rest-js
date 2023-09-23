class Person {
  constructor({name, traits=[], skills=[], motivations=[], talents=[], focuses=[], assets=[]}) {
    this.name = name;
    this.focuses = focuses;
    this.skills = skills;
    this.talents = talents;
    this.motivations = motivations;
    this.assets = assets;
  }
  
  addSkill(name, level=null) {
    const skill  = this.skills.find(
       (v) => (v.name === name));
    if (skill) {
      throw new Error("Skill already exists");
    }
    this.skills.push(new Skill(name, {level:level}));
  }
  
  setSkill(name, level) {
    const skill = this.skills.find(
      (v) => (v.name===name));
    if (skill) {
      skill.level = level;
    }
  }
  
  getSkill(name, level) {
    const skill  = this.skills.find(
       (v) => (v.name === name));
    return skill ? skill.level : undefined;
  }
}

class NamedAndValued {
  constructor(name, level, min, max) {
    this.name = name;
    this.level = level;
    this.min = min;
    this.max = max;
  }
  
  toString() {
    return `${this.name}${(this.level === undefined ? "" : "(" + this.level + ")")}`;
  }
  valueOf() {
    return this.level;
  }
}

class Motivation extends NamedAndValued {
  constructor(name, { level = undefined, max = 8, min = 4 }) {
    super(name, level, min.max);
  }
}

class Skill extends NamedAndValued {
  constructor({name, level=undefined, max=8, min=4}) {
    super(name, level, min. max);
  }
}


exports = {Person, Skill, Motivation};