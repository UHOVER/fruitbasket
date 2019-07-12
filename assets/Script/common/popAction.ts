const { ccclass, property } = cc._decorator;

@ccclass
export default class PopAction extends cc.Component {

    @property(cc.Node)
    content: cc.Node = undefined;

    onLoad () {
        this.node.position = cc.v2(0,0);
        this.content.scale = 0;
    }

    start () {
        this.openAnim();
    }

    protected openAnim () {
        this.node.active = true;
        let animTime = 0.3;
        this.content.runAction(cc.scaleTo(animTime, 1).easing(cc.easeBackOut()));
    }

    protected closeAnim () {
        let animTime = 0.3;
        this.content.runAction(cc.sequence(cc.scaleTo(animTime, 0).easing(cc.easeBackOut()), cc.callFunc(() => {
            this.node.active = false;
        })));
    }


}
