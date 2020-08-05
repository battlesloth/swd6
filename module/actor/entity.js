import {rollDice} from "../dice.js"

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
   
    const rollData = {speaker: ChatMessage.getSpeaker({actor: this}), skill: skill, value: value, mod: mod};
    const dialogOptions = {};
    return rollDice(rollData, dialogOptions);
  }

}
