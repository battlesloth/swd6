import { rollDice } from "../dice.js";
import SkillSelector from "../apps/skill-selector.js";
import ModifyDieCodeDialog from "../apps/modify-die-code.js";


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
   * @param {string} key 
   * @param {string} parent 
   * @param {string} label 
   */
  selectSkills(key, parent, label) {

    var parts = parent.split(".");
    const category = parts[0];
    const attribute = parts[1];

    const choices = CONFIG.SWD6[key];

    const options = {
      category: category,
      attribute: attribute,
      name: label,
      title: label,
      choices
    };

    new SkillSelector(this, options).render(true)
  }


  async modifyDieCode(type, id) {

    let dieCode = {};
    let newValue = {};

    let charpoints = this.data.data.abilities.charpoints;

    switch (type) {
      case "attribute":
        dieCode = this._getAttributeDieCode(id)
        break
      case "skill":
        dieCode = this._getSkillDieCode(id);
        break
    }

    try {
      newValue = await ModifyDieCodeDialog.modifyDieCodeDialog(dieCode, charpoints);
    } catch (err) {
      console.log(err);
      return;
    }

    switch (type) {
      case "attribute":
        await this._setAttributeDieCode(id, newValue);
        break
      case "skill":
        await this._setSkillDieCode(id, newValue);
        break
    }
  }

  _getAttributeDieCode(id) {
    var parts = id.split('.');
    var die = this.data.data.attributes[parts[0]][parts[1]]

    return {
      label: die.label,
      type: "attribute",
      id: id,
      value: die.value,
      mod: die.mod
    }
  }

  _getSkillDieCode(id) {
    var parts = id.split('.');
    var skills = this.data.data.attributes[parts[0]][parts[1]].skills

    var skill = skills.find(e => e.key === parts[2]);

    return {
      label: skill.name,
      type: "skill",
      id: id,
      value: skill.value,
      mod: skill.mod
    }
  }

  async _setAttributeDieCode(id, newValue) {
    var parts = id.split('.');
    const update ={};
    const key = `data.attributes.${parts[0]}`;

    var cat = this.data.data.attributes[parts[0]]

    cat[parts[1]].value = newValue.value;
    cat[parts[1]].mod = newValue.mod;

    update[key] = cat;

    await this.update(update);
  }

  async _setSkillDieCode(id, newValue) {
    let parts = id.split('.');
    const update ={};
    const key = `data.attributes.${parts[0]}.${parts[1]}.skills`;

    let skills = this.data.data.attributes[parts[0]][parts[1]].skills

    for (let i in skills){
      if (skills[i].key === parts[2]){
        skills[i].value = newValue.value;
        skills[i].mod = newValue.mod;
      }
    }

    update[key] = skills;

    await this.update(update);
  }



  /**
    * Normalizes skill values to attriute value
    * This might be getting depricated....
    * @param {attribute} attr 
    */
  _normalizeValues(attr) {
    if (attr.value < 1) {
      attr.value = 1;
    }

    if (attr.mod > 2) {
      attr.mod = 2;
    } else if (attr.mod < 0) {
      attr.mod = 0;
    }


    for (let skill of attr.skills) {

      // skills will never be lower than
      if (skill.value <= attr.value || !skill.value) {
        skill.value = attr.value;
        if (skill.mod < attr.mod || !skill.mod) {
          skill.mod = attr.mod;
        }
      }

      if (skill.mod > 2) {
        skill.mod = 2;
      } else if (skill.mod < 0 || !skill.mod) {
        skill.mod = 0;
      }
    }
  }

  /**
   * 
   * @param {string} category 
   * @param {string} attribute 
   *
  async modifyAttribute(category, attr) {

    const data = this.data.data;
    const key = `data.attributes.${category}.${attr}`;
    const updateData = {};

    let attribute = data.attributes[category][attr];
    let charpoints = data.abilities.charpoints; 

    let newSkill = "error";

    try {
      newSkill = await ModifyAttributeDialog.modifyAttributeDialog(attribute, charpoints)
    } catch (err) {
      console.log(err);
      return;
    }

    var exists = false;

    Object.entries(attribute.skills).forEach(([key, value]) => {
      if (value.name.toLowerCase() === newSkill.toLowerCase()) {
        exists = true;
      }
    });


    if (!exists) {
      const nk = Math.random().toString(36).substring(2) + Date.now().toString(36);

      updateData[`${key}.skills`] = data.attributes[category][attr].skills;
      updateData[`${key}.skills`][nk] = {
        name: (newSkill.charAt(0).toUpperCase() + newSkill.slice(1)),
        value: attribute.value,
        mod: attribute.mod
      };

      // Perform the updates
      await this.update(updateData);
    }
  }*/
}
