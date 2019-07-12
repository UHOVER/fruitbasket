import GameFruit from '../gameFruit';
const {ccclass, property} = cc._decorator;

@ccclass
export default class Fruit extends cc.Component {

    public fruitGame: GameFruit = undefined;

    onLoad(){
        let game = cc.find('game');
        this.fruitGame = game.getComponent(GameFruit);
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider){
        let otherTag = other.tag;
        let selfTag = self.tag
        if (selfTag === 6 || selfTag !== otherTag) {
            console.log('失败了');
            this.fruitGame.audioMgr.playBoom();
            this.fruitGame.gameOver()
            return;
        }

        console.log('得分', self);
        let node = self.node;
        node.stopAllActions();
        let r = cc.sequence(cc.rotateTo(0.2, -15).easing(cc.easeBounceInOut()), cc.rotateTo(0.2, 15).easing(cc.easeBounceInOut()));
        let spa = cc.spawn(cc.scaleTo(0.2, 0), cc.fadeOut(0.2));
        node.runAction(cc.sequence(r, spa, cc.callFunc(() => {this.fruitGame.addScore();})));
    }

    onCollisionStay(other: cc.Collider, self: cc.Collider){
        // console.log('onCollisionStay');
        
    }

    onCollisionExit(other: cc.Collider, self: cc.Collider){
        // console.log('onCollisionExit');
        
    }

}
