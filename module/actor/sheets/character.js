import ActorSheetSwd6 from "./base.js"

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheetSwd6}
 */
export default class ActorSheetSwd6Character extends ActorSheetSwd6 {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["swd6", "sheet", "actor", "character"],
      width: 600,
      height: 600,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "attributes" }],
      dragDrop: [{ dragSelector: ".item-list .item", dropSelector: null }]
    });
  }



  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(li.data("itemId"));
      li.slideUp(200, () => this.render(false));
    });

    html.find(".skill-add").click(this._onClickAddSkill.bind(this));;
  }

 
  async _onClickAddSkill(event) {
    event.preventDefault();

    const a = event.currentTarget;
    var parent = a.dataset.id.split('.');
  
    const category = parent[0];
    const attribute = parent[1];

    await this._onSubmit(event);
    return this.actor.addNewSkill(category, attribute);


     /*


    // Add new attribute
    if ( action === "addskill" ) {
      const nk = Math.random().toString(36).substring(2) + Date.now().toString(36);
      let newKey = document.createElement("div");
      newKey.innerHTML = `<input type="text" name="data.attributes.${parent}.skills.${nk}.name" value="New Skill"/>`;
      
      newKey = newKey.children[0];
      skillList.appendChild(newKey);
      await this._onSubmit(event);
    }
    */
  }


  /* -------------------------------------------- */

  /** @override */
  setPosition(options = {}) {
    const position = super.setPosition(options);
    const sheetBody = this.element.find(".sheet-body");
    const bodyHeight = position.height - 192;
    sheetBody.css("height", bodyHeight);
    return position;
  }
}
