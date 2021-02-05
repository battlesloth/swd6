import { rollDice } from "../dice.js"
import NewSkillDialog from "../apps/new-skill.js"
/**
 * Extend the base Actor entity by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export default class ActorSwd6 extends Actor {

  /** @override */
  getRollData() {
    const data = super.getRollData();

    return data;
  }

  /**
   * 
   * @param {string} skill 
   * @param {int} value 
   * @param {int} mod 
   */
  rollSkill(skill, value, mod) {

    const rollData = { speaker: ChatMessage.getSpeaker({ actor: this }), skill: skill, value: value, mod: mod };
    const dialogOptions = {};
    return rollDice(rollData, dialogOptions);
  }

  /**
   * 
   * @param {string} category 
   * @param {string} attribute 
   */
  async addNewSkill(category, attribute) {

    const data = this.data.data;
    const key = `data.attributes.${category}.${attribute}`;
    const label = data.attributes[category][attribute].label;
    const updateData = {};

    let newSkill = "error";

    try {
      newSkill = await NewSkillDialog.newSkillDialog(label)
    } catch (err) {
      console.log(err);
      return;
    }

    var attr = data.attributes[category][attribute];

    var exists = false;

    Object.entries(attr.skills).forEach(([key, value]) => {
      if (value.name.toLowerCase() === newSkill.toLowerCase()) {
        exists = true;
      }
    });


    if (!exists) {
      const nk = Math.random().toString(36).substring(2) + Date.now().toString(36);

      updateData[`${key}.skills`] = data.attributes[category][attribute].skills;
      updateData[`${key}.skills`][nk] = {
        name: (newSkill.charAt(0).toUpperCase() + newSkill.slice(1)),
        value: attr.value,
        mod: attr.mod
      };

      // Perform the updates
      await this.update(updateData);
    }
  }
}
