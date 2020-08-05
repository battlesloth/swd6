/**
 * An implmentation of the Star Wars D6 system for Foundry VTT
 * Author: Jrector
 * Software License: GNU GPLv3
 */

// Import Modules
import { preloadHandlebarsTemplates } from "./module/templates.js";

// Import Entities
import ActorSwd6 from "./module/actor/entity.js";
import ItemSwd6 from "./module/item/entity.js";


// Import Applications
import ItemSheetSwd6 from "./module/item/item-sheet.js";
import ActorSheetSwd6Character from "./module/actor/sheets/character.js";

// Import Helpers
import * as dice from "./module/dice.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", async function () {
  console.log(`Initializing Star Wars D6 System`);

  // Create a namespace within the game global
  game.swd6 = {
    applications: {
      ActorSheetSwd6Character,
      ItemSheetSwd6
    },
    dice: dice,
    entities: {
      ActorSwd6,
      ItemSwd6,
    }
  };

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
  Items.registerSheet("swd6", ItemSheetSwd6, { makeDefault: true });

  preloadHandlebarsTemplates();

  console.log(`Initialization of Star Wars D6 System complete`);
});
