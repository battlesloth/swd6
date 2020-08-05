export async function rollDice(rollData, dialogOptions) {
    let rolled = false;
    const speaker = rollData.speaker || ChatMessage.getSpeaker({actor: this});

    const _roll = async function (rollData) {

        let result = 0;
        let norm = [];
        let wild = [];

        let die = new Die(6);

        die.roll(rollData.value - 1);
        die.rolls.forEach(n => {
          norm.push(n.roll);
        });

        let wildDie = new Die(6);
        wildDie.roll(1);
        wildDie.explode([6]);
        wildDie.rolls.forEach(n =>{
          wild.push(n.roll);
        });

        if (wild[0] === 1) {
            if (norm.length === 1) {
                results = rollData.mod;
            } else {
                var idx = 0;
                var highest = 0;

                for (let i = 0; i < norm.length; i++) {
                    if (norm[i] > highest) {
                        idx = i;
                        highest = norm[i]
                    }
                }

                var temp = norm.slice();
                temp.splice(idx, 1);

                result = temp.reduce((a,b) => a + b, 0);
                result = result + rollData.mod;
            }
        } else {
            result = norm.reduce((a,b) => a + b, 0) + 
                wild.reduce((a,b) => a + b, 0) + rollData.mod;
        }

        let resultColor = "";

        if (wild[0] === 1){
          resultColor = "fumble";
        } else if (wild[0] === 6){
          resultColor = "critical";
        }

        let resultDialogData = {
          skill: rollData.skill,
          diceRoll: `${rollData.value}D + ${rollData.mod}`,
          resultColor: resultColor,
          result: result,
          normalRolls: `${norm.join(",")}`,
          wildRolls: `${wild.join(",")}`
        }

        let template = "systems/swd6/templates/chat/roll-result-dialog.html";

        const html = await renderTemplate(template, resultDialogData)

        await ChatMessage.create({content: html,  speaker: speaker});
        //return { norm, wild, result };
    }

    // Render modal dialog
  let template = "systems/swd6/templates/chat/roll-dialog.html";
  let dialogData = {
    skill: rollData.skill,
    value: `${rollData.value}D + ${rollData.mod}`,
    data: rollData
  };
  const html = await renderTemplate(template, dialogData);

  // Create the Dialog window
  let roll;
  return new Promise(resolve => {
    new Dialog({
      title: dialogData.skill,
      content: html,
      buttons: {
        normal: {
          label: game.i18n.localize("Roll!"),
          callback: html => roll = _roll(dialogData.data)
        }
      },
      default: "normal",
      close: html => {
        resolve(rolled ? roll : false);
      }
    }, dialogOptions).render(true);
  });
}