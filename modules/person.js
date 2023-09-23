import { SkillModel } from "./skill.mjs";

/**
 * The CJS module containing Person. 
 * @module Person
 */

/**
 * The model of a person.
 * @typedef {object} PersonModel
 * @property {Array<SkillModel>} [skills=[]] The skills of the character.
 * @property {Array<TraitModel>} [traits=[]] The traits of the character.
 * @property {Array<AssetModel>} [assets=[]] The assets of the character.
 * @property {Array<MotivationModel>} [motivations=[]] The motivations of the character.
 * @property {Array<FocusModel>} [focuses=[]] The focuses of the character.
 * @property {Array<TalentModel>} [talents=[]] The talents of the character.
 */

/**
 * The person of the DUNE game.
 * @extends PersonModel
 */
export class Person {
  /**
   * Create a new person.
   * @param {PersonModel} param0 The parameters of the contruction.
   */
  constructor({ name, traits = [], skills = [], motivations = [], talents = [], focuses = [], assets = [] }) {
    this.name = name;
    this.focuses = focuses;
    this.skills = skills;
    this.talents = talents;
    this.motivations = motivations;
    this.assets = assets;
  }


  /**
   * 
   * @param {*} name 
   * @param {*} level 
   */
  addSkill(name, level = null) {
    const skill = this.skills.find(
      (v) => (v.name === name));
    if (skill) {
      throw new Error("Skill already exists");
    }
    this.skills.push(new Skill(name, { level: level }));
  }

  setSkill(name, level) {
    const skill = this.skills.find(
      (v) => (v.name === name));
    if (skill) {
      skill.level = level;
    }
  }

  getSkill(name) {
    const skill = this.skills.find(
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

export class Motivation extends NamedAndValued {
  constructor(name, { level = undefined, max = 8, min = 4 }) {
    super(name, level, min.max);
  }
}

export class Skill extends NamedAndValued {
  constructor({ name, level = undefined, max = 8, min = 4 }) {
    super(name, level, min.max);
  }
}
