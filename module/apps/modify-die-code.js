/**
 * @extends {Dialog}
 */
export default class ModifyDieCodeDialog extends Dialog{
    constructor(dieCode, charpoints, dialogData ={}, options={}){
        super(dialogData, options);
        this.dieCode = dieCode;
        this.charpoints = charpoints;
    }

    /** @override */
    static get defaultOptions(){
        return mergeObject(super.defaultOptions,{
            template: "systems/swd6/templates/apps/modify-die-code.html",
            classes: ["swd6", "dialog"]
        });
    }


    /**
     * dieCode {
     *  label: {string}
     *  type: {string},
     *  id: {string},
     *  value: {number},
     *  mod: {number}
     * }
     * 
     */

    /** @override */
    getData(){
        const data = super.getData();
        data.charpoints = this.charpoints;
        data.dieCode = this.dieCode;
        return data;
    }

    /**@override */
    activateListeners(html) {
        super.activateListeners(html);
        let downBtn = html.find("#mod-down");
        let upBtn = html.find("#mod-up");

        downBtn.click(this._onModDown.bind(this));
        upBtn.click(this._onModUp.bind(this));
    }

    async _onModDown(event){
        event.preventDefault();
        
        this.dieCode.mod--;

        if (this.dieCode.mod < 0){
            this.dieCode.value--;
            this.dieCode.mod = 2;
        }

        if (this.dieCode.value < 0){
            this.dieCode.value = 0;
            this.dieCode.mod = 0;
        }

        this.render();
    }

    async _onModUp(event){
        event.preventDefault();

        this.dieCode.mod++;

        if (this.dieCode.mod > 2){
            this.dieCode.value++;
            this.dieCode.mod = 0;
        }
         
        this.render();
    }
     
    static async modifyDieCodeDialog(dieCode, charpoints){
        return new Promise((resolve, reject) => {
            let label = dieCode.label;
            const dlg = new this(dieCode, charpoints, {
                title: `Modify ${label}`,
                buttons: {
                    save: {
                        icon:'<i class="fas fa-check"></i>',
                        label: "Save",
                        callback: html => {
                            resolve(dieCode);
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