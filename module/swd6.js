/**
 * An implmentation of the Star Wars D6 system for Foundry VTT
 * Author: Jrector
 * Software License: GNU GPLv3
 */

// Import Modules
import { Swd6Actor } from "./actor.js";
import { Swd6ItemSheet } from "./item-sheet.js";
import { Swd6ActorSheet } from "./actor-sheet.js";

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
    CONFIG.Actor.entityClass = Swd6Actor;
  
    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("swd6", Swd6ActorSheet, { makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("swd6", Swd6ItemSheet, {makeDefault: true});
  
    // Register system settings
    //game.settings.register("swd6", "macroShorthand", {
    //  name: "Shortened Macro Syntax",
    //  hint: "Enable a shortened macro syntax which allows referencing attributes directly, for example @str instead of @attributes.str.value. Disable this setting if you need the ability to reference the full attribute model, for example @attributes.str.label.",
    //  scope: "world",
    //  type: Boolean,
    //  default: false,
    //  config: false
    //});
  });
  