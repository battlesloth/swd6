import SkillSelector from "../../apps/skill-selector.js";
import { SWD6 } from "../../config.js";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export default class ActorSheetSwd6 extends ActorSheet {
  constructor(...args) {
    super(...args);
  }

  /** @override */
  getData() {
    //const data = super.getData();

    let isOwner = this.entity.owner;

    const data = {
      owner: isOwner,
      options: this.options,
      config: CONFIG.SWD6
    }

    data.actor = duplicate(this.actor.data);
    data.data = data.actor.data;

    this._prepareAttributes(data.actor.data);

    return data;
  }

  _prepareAttributes(data) {

    const displayAttr = {}

    for (let cat of Object.keys(data.attributes)) {

      displayAttr[cat] = {}; 
      
      for (let attr of Object.keys(data.attributes[cat])) {

        var val = data.attributes[cat][attr];

        displayAttr[cat][attr] = {label: val.label, value: val.value, mod: val.mod, skills: {}};
        var selected = {};

        val.skills.sort((a, b) => a.name.localeCompare(b.name));

        val.skills.forEach(s => {
          selected[s.key] = {
            name: s.name,
            value: s.value,
            mod: s.mod
          }
        });

        displayAttr[cat][attr].skills = selected; 
      }
    }

    data.displayAttributes = displayAttr;
  }

  /** @override */
  get template() {
    return `systems/swd6/templates/actors/${this.actor.data.type}-sheet.html`;
  }

  /** @override */
  activateListeners(html) {
  
    html.find('.skill-selector').click(this._onSkillSelector.bind(this));
    html.find('.modify-die-code').click(this._onModifyDieCode.bind(this));
    html.find('.skill-roll').click(this._onRollSkillCheck.bind(this));

    super.activateListeners(html);
  }


  /**
  * Handle spawning the SkillSelector application which allows a checkbox of multiple skill options
  * @param {Event} event   The click event which originated the selection
  * @private
  */
  async _onSkillSelector(event) {
    event.preventDefault();
    const a = event.currentTarget;

    await this._onSubmit(event);
    this.actor.selectSkills(a.dataset.options, a.dataset.id, a.dataset.name);
  }


  /**
   * Handle spawnign the ModifyDieCode application which allows changing a die code
   * @param {Event} event 
   */
  async _onModifyDieCode(event) {
    event.preventDefault();
    const a = event.currentTarget;

    await this._onSubmit(event);
    this.actor.modifyDieCode(a.dataset.options, a.dataset.id);
  }

  /**
 * Handle rolling a Skill check
 * @param {Event} event   The originating click event
 * @private
 */
  _onRollSkillCheck(event) {
    event.preventDefault();
    const a = event.currentTarget;
    this.actor.rollSkill(a.dataset.name, parseInt(a.dataset.value), parseInt(a.dataset.mod));
  }


}