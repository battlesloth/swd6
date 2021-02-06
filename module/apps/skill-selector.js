/**
 * A specialized form used to select from a checklist of skills
 * @implements {FormApplication}
 */
export default class SkillSelector extends FormApplication {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "skill-selector",
      classes: ["swd6"],
      title: "Actor Skill Selection",
      template: "systems/swd6/templates/apps/skill-selector.html",
      width: 320,
      height: "auto",
      choices: {},
      callback: null,
    });
  }

  /* -------------------------------------------- */

  /**
   * Return a reference to the target attribute
   * @type {String}
   */
  get attribute() {
    return this.options.attribute;
  }


  get category() {
    return this.options.category;
  }

  get choices() {
    return this.options.choices;
  }


  /* -------------------------------------------- */

  /** @override */
  getData() {

    this.callback = this.options.updateCallback;
    // Get current values
    let attr = getProperty(this.object.data.data.attributes[this.category], this.attribute);
    
    var skillList = [];
    attr.skills.forEach(s => {skillList.push(s.key)});

    // Populate choices
    const choices = duplicate(this.options.choices);
    for (let [k, v] of Object.entries(choices)) {
      choices[k] = {
        label: v,
        chosen: attr ? skillList.includes(k) : false
      }
    }

    // Return data
    return {
      choices: choices,
      
    }
  }

  /* -------------------------------------------- */

  /** @override */
 async _updateObject(event, formData) {
    const updateData = {};
    const key = `data.attributes.${this.category}.${this.attribute}.skills`;
    const attr = getProperty(this.object.data.data.attributes[this.category], this.attribute);
    
    // Obtain choices
    const chosen = [];
    for (let [k, v] of Object.entries(formData)) {
      if ((k !== "custom") && v) chosen.push(k);
    }

    updateData[key] = attr.skills;

    chosen.forEach(e =>{
      var skill = {
        key: e,
        name: this.choices[e],
        value: attr.value,
        mod: attr.mod
      };
      updateData[key].push(skill);
    });

    // Update the object
    await this.object.update(updateData);
  }
}