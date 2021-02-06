export default class ModifyAttributeDialog extends Dialog{
    constructor(attribute, charpoints, dialogData ={}, options={}){
        super(dialogData, options);
        this.attribute = attribute;
        this.charpoints = charpoints;
    }

    /** @override */
    static get defaultOptions(){
        return mergeObject(super.defaultOptions,{
            template: "systems/swd6/templates/apps/modify-attribute.html",
            classes: ["swd6","dialog"]
        });
    }


    /** @override */
    getData(){
        const data = super.getData();
        data.attribute = this.attribute;
        data.charpoints = this.charpoints;
        //data.skills = {d1:{ name:"Blaster"},d2:{ name:"Dodge"},d3:{ name:"Grenade"}};
        return data;
    }

    static async modifyAttributeDialog(attribute, charpoints){
        return new Promise((resolve, reject) => {
            let label = attribute.label;
            const dlg = new this(attribute, charpoints, {
                title: `Modify ${label}`,
                buttons: {
                    save: {
                        icon:'<i class="fas fa-check"></i>',
                        label: "Save",
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
                default: 'save',
                close: reject
            });
            dlg.render(true);
        });
    }
}