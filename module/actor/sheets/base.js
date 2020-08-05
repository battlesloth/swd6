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
    const data = super.getData();
    for (let attr of Object.values(data.data.attributes.phys)) {
      this._normalizeValues(attr);
    }
    for (let attr of Object.values(data.data.attributes.ment)) {
      this._normalizeValues(attr);
    }
    return data;
  }

  /** @override */
  get template() {
    return `systems/swd6/templates/actors/${this.actor.data.type}-sheet.html`;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    html.find('.skill-roll').click(this._onRollSkillCheck.bind(this));
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
  
  _normalizeValues(attr) {
    if (attr.value < 1) {
      attr.value = 1;
    }

    if (attr.mod > 2) {
      attr.mod = 2;
    } else if (attr.mod < 0) {
      attr.mod = 0;
    }

    for (let skill of Object.values(attr.skills)) {

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
}