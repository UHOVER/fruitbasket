const {ccclass, property} = cc._decorator;

@ccclass
export default class Box extends cc.Component {
    
    @property(cc.Sprite)
    private box: cc.Sprite = undefined;

    @property([cc.SpriteFrame])
    boxFrame: cc.SpriteFrame[] = [];

    onLoad(){
        
    }

    getBox(): cc.Sprite{
        return this.box;
    }

    setBoxFrame(type: number){
        if (this.boxFrame[type] === undefined) {
            cc.log('not found boxFrame!')
            return;
        }
        this.box.spriteFrame = this.boxFrame[type];
        this.box.getComponent(cc.BoxCollider).tag = type+1
    }

}
