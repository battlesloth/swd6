export default class NewSkillDialog extends Dialog{
    constructor(labels, dialogData ={}, options={}){
        super(dialogData, options);
        this.labels = labels;
    }


    static get defaultOptions(){
        return mergeObject(super.defaultOptions,{
            template: "systems/swd6/templates/apps/new-skill.html",
            classes: ["swd6","dialog"]
        });
    }

    static async newSkillDialog(labels){
        return new Promise((resolve, reject) => {
            let name = labels.name;
            let type = labels.type;
            const dlg = new this(labels, {
                title: `Add ${name} ${type}`,
                buttons: {
                    add: {
                        icon:'<i class="fas fa-check"></i>',
                        label: "Add",
                        callback: html =>{
                            let result = html.find('input[name=\'inputField\']');
                            if (result.val()!== '') {
                                resolve(result.val());
                            } else {
                                reject();
                            }
                        }
                    },
                    cancel: {
                        icon: '<i class="fas fa-times"></i>',
                        label: "Cancel",
                        callback: reject
                    },
                },
                default: 'cancel',
                close: reject
            });
            dlg.render(true);
        });
    }
}