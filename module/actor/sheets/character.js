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
      template: "systems/swd6/templates/actors/character-sheet.html",
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

    html.find(".add-skill-ok").click(ev =>{
      this._addNewSkill(ev);
    });
    html.find(".add-skill-cancel").click(ev =>{
      document.getElementById(this.object._id + "-skill-modal").style.display = "none";
    });
    html.find(".skill-add").click(ev =>{
      this._onClickAddSkill(event);
    });
  }


  async _addNewSkill(event){
    event.preventDefault();
    
    var modal = document.getElementById(this.object._id + "-skill-modal"); 
    var parent = modal.dataset.skillparent;      

    var skill = {"name": "Test", "value": 3, "mod": 1}

    switch(parent){
      case "Knowledge":
        this.actor.data.data.attributes.ment.kno.skills["test"] = skill;
        break;
    }
    
    modal.style.display = "none";
    await this._onSubmit(event);
  }
  
  async _onClickAddSkill(event) {
    event.preventDefault();
 
    const a = event.currentTarget;
    const action = a.dataset.action;
    const parent = a.dataset.id;
  
    const skillList = document.getElementById(`${this.actor._id}-${parent}-skills`);

    // Add new attribute
    if ( action === "addskill" ) {
      const nk = Math.random().toString(36).substring(2) + Date.now().toString(36);
      let newKey = document.createElement("div");
      newKey.innerHTML = `<input type="text" name="data.attributes.${parent}.skills.${nk}.name" value="New Skill"/>`;
      
      newKey = newKey.children[0];
      skillList.appendChild(newKey);
      await this._onSubmit(event);
    }
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
