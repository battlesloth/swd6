import ActorSheetSwd6 from "./base.js"
import NewSkillDialog from "../apps/new-skill.js"

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
    const action = a.dataset.action;
    var parent = a.dataset.id.split('.');
  
    const category = parent[0];
    const attribute = parent[1];
    const label = this.actor.data.data.attributes[category][attribute].label;




    let type = action === 'addSkill' ? 'Skill' : 'Specialization'

    let newSkill = "error";

    try{
      newSkill = await NewSkillDialog.newSkillDialog({lables: {name: label, type: type}})
    } catch(err){
      console.log(err);
      return;
    }

    var attr = this.actor.data.data.attributes[category][attribute];
    
    if ( action === "addskill" ) {
      var exists = false;
      
      Object.entries(attr.skills).forEach(([key, value]) =>{
        if (value.name.toLowerCase() === newSkill.toLowerCase()){
          exists = true;
        }
      });

      if (!exists){
        const nk = Math.random().toString(36).substring(2) + Date.now().toString(36);

        this.actor.data.data.attributes[category][attribute].skills[nk] = {
          name:(newSkill.charAt(0).toUpperCase() + newSkill.slice(1)), 
          value: attr.value, 
          mod: attr.mod
        };
      }
    }

     await this._onSubmit(event);
  

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
