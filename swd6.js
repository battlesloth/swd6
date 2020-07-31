/**
 * An implmentation of the Star Wars D6 system for Foundry VTT
 * Author: Jrector
 * Software License: GNU GPLv3
 */

// Import Modules

// Import Entities
import ActorSwd6 from "./module/actor/entity.js";
import ItemSwd6 from "./module/item/entity.js";



import ItemSheetSwd6 from "./module/item/item-sheet.js";
import ActorSheetSwd6Character from "./module/actor/sheets/character.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", async function() {
    console.log(`Initializing Star Wars D6 System`);
  
      /**
       * Set an initiative formula for the system
       * @type {String}
       */
      CONFIG.Combat.initiative = {
        formula: "1d20",
      decimals: 2
    };
  
      // Define custom Entity classes
    CONFIG.Actor.entityClass = ActorSwd6;
    CONFIG.Item.entityClass = ItemSwd6;
  
    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("swd6", ActorSheetSwd6Character, { types: ["character"], makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("swd6", ItemSheetSwd6, {makeDefault: true});
  
  });
  