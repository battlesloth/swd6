export async function rollDice(rollData, dialogOptions) {
    let rolled = false;
    const speaker = rollData.speaker || ChatMessage.getSpeaker({actor: this});

    const _roll = async function (rollData, bonusDie, bonusMod) {
   
        let result = 0;
        let norm = [];
        let wild = [];

        var count = rollData.value - 1 + bonusDie;

        let die = new Die({faces: 6, number: count}).evaluate();


        //die.roll(count);
        die.results.forEach(n => {
          norm.push(n.result);
        });

        let wildDie = new Die({faces:6, number: 1}).evaluate();
        //wildDie.roll(1);
        wildDie.explode('X');
        wildDie.results.forEach(n =>{
          wild.push(n.result);
        });

        if (wild[0] === 1) {
            if (norm.length === 1) {
                result = rollData.mod + bonusMod;
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
                result = result + rollData.mod + bonusMod;
            }
        } else {
            result = norm.reduce((a,b) => a + b, 0) + 
                wild.reduce((a,b) => a + b, 0) + rollData.mod + bonusMod;
        }

        let resultColor = "";

        if (wild[0] === 1){
          resultColor = "fumble";
        } else if (wild[0] === 6){
          resultColor = "critical";
        }

        let bonusText = "";
        if (bonusDie > 0 || bonusMod > 0){
          bonusText = bonusText + ` + (${bonusDie}D + ${bonusMod})`
        }
        
        let resultDialogData = {
          skill: rollData.skill,
          diceRoll: `${rollData.value}D + ${rollData.mod}${bonusText}`,
          resultColor: resultColor,
          result: result,
          normalRolls: `${norm.join(",")}`,
          wildRolls: `${wild.join(",")}`,
          mod: rollData.mod + bonusMod
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
    bonusDie: 0,
    bonusMod: 0,
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
          callback: html => {
            let bonusDie =  html.find('.bonus-die-field')[0];
            let bonusMod =  html.find('.bonus-mod-field')[0];
            
            if (isNaN(bonusDie.value)){
              bonusDie.value = "0";
            }
            if (isNaN(bonusMod.value)){
              bonusMod.value = "0";
            }

            roll = _roll(dialogData.data, parseInt(bonusDie.value), parseInt(bonusMod.value))           
          }
        }
      },
      default: "normal",
      close: html => {
        resolve(rolled ? roll : false);
      }
    }, dialogOptions).render(true);
  });
}