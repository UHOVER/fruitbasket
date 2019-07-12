const {ccclass, property} = cc._decorator;

@ccclass
export default class Start extends cc.Component {
    
    @property(cc.Node)
    private logoNode: cc.Node = undefined;

    private anim: cc.Animation = undefined;

    private animState: cc.AnimationState = undefined;

    onLoad(){
        this.anim = this.logoNode.getComponent(cc.Animation);
        this.animState = this.anim.play();
    }

    start(){
        this.anim.on('finished', this.onFinished, this);
    }

    onFinished(){
        cc.log('anim onFinished');
        cc.director.loadScene('GameScene');
    }

}
