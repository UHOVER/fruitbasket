import Box from './common/box';
import AudioMgr from './audioMgr';
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameFruit extends cc.Component {

    @property(cc.Node)
    bg: cc.Node = undefined;

    @property(cc.Node)
    boxLayer: cc.Node = undefined;

    @property(cc.Node)
    btnLayer: cc.Node = undefined;

    @property(cc.Prefab)
    helpPre: cc.Prefab = undefined;

    @property(cc.Prefab)
    overPre: cc.Prefab = undefined;

    @property(cc.Prefab)
    fruitPre: cc.Prefab = undefined;

    @property(cc.Node)
    private parent: cc.Node = undefined;

    @property(cc.Node)
    private content: cc.Node = undefined;

    @property(cc.Node)
    private boxNode: cc.Node = undefined;

    @property(cc.Node)
    private leftTouch: cc.Node = undefined;

    @property(cc.Node)
    private rightTouch: cc.Node = undefined;

    @property(cc.Label)
    private score: cc.Label = undefined;

    audioMgr: AudioMgr = undefined;

    private mvDuration: number = undefined;

    private beginPosY: number = undefined;

    private endPosY: number = undefined;

    private fruitCount = 5;
    private fruitPool: { [name: string]: cc.NodePool } = {};

    private boxOffset: number = 10;

    private isTouch: boolean = false;
    private direction: number = undefined;

    private updateTime: number = 0;

    private gameState: boolean = false;

    onLoad () {
        this.mvDuration = 5;
        this.beginPosY = 355;
        this.endPosY = -450;
        this.audioMgr = this.node.getChildByName('audio').getComponent(AudioMgr);

        this.leftTouch.on('touchstart', this.touchstart, this);
        this.leftTouch.on('touchend', this.touchend, this);
        this.rightTouch.on('touchstart', this.touchstart, this);
        this.rightTouch.on('touchend', this.touchend, this);
    }

    start () {
        this.audioMgr.playBgm();
        let collMgr = cc.director.getCollisionManager();
        collMgr.enabled = true;
        // collMgr.enabledDebugDraw = true;
        // collMgr.enabledDrawBoundingBox = true;

        this.onClickHelp();
        this.initFruit()
        this.initGame();
    }

    initGame () {
        this.isTouch = false;
        this.direction = undefined;
        this.updateTime = 0;
        this.gameState = false;
        this.score.string = '0';
        this.boxNode.setPositionX(0);
        this.changeBoxFrame();
        let nodes = this.content.children;
        nodes.forEach(ele => {
            this.removeFruit(ele);
        });
        this.content.removeAllChildren();
    }

    update (dt: number) {
        if (!this.gameState) {
            return;
        }
        if (this.isTouch && this.direction) {
            let posX = this.boxNode.getPositionX();
            // cc.log('===posX: ', posX);
            if (this.direction === 1 && posX > -460) {
                this.boxNode.setPositionX(posX - this.boxOffset);
            } else if (this.direction === 2 && posX < 460) {
                this.boxNode.setPositionX(posX + this.boxOffset);
            } else {
                let pos = this.boxNode.position;
                let offset = posX > 0 ? posX + 10 : posX - 10;
                this.boxNode.runAction(cc.sequence(cc.moveTo(0.1, cc.v2(offset, pos.y)), cc.moveTo(0.1, pos)))
                this.isTouch = false;
                this.direction = undefined;
            }
        }
        if (this.updateTime > 15) {
            this.updateTime = 0;
            this.changeBoxFrame();
        }
        this.updateTime = this.updateTime + dt
    }

    addScore () {
        console.log('add score');
        if (!this.gameState) return;
        this.audioMgr.playScore();
        this.score.string = (+this.score.string + 1).toString();
        let node = this.score.node;
        node.runAction(cc.sequence(cc.scaleTo(0.2, 1.3), cc.scaleTo(0.1, 1)));
    }

    gameOver () {
        console.log('game over');
        if (!this.gameState) return;
        this.gameState = false;
        this.bgShake();

        this.unschedule(this.showFruit);
        let nodes = this.content.children;
        nodes.forEach(ele => {
            ele.stopAllActions();
        });
        this.scheduleOnce(() => {
            let over = cc.instantiate(this.overPre);
            this.parent.addChild(over);
        }, 1);
    }

    changeBoxFrame () {
        let boxFrame: Box = this.boxNode.getComponent(Box);
        let type = Math.floor(Math.random() * 5);
        boxFrame.setBoxFrame(type);
    }

    initFruit () {
        let fruits = cc.instantiate(this.fruitPre);
        fruits.children.forEach(child => {
            let name = child.name;
            this.fruitPool[name] = new cc.NodePool();
            for (let i = 0; i < this.fruitCount; i++) {
                let fruit = cc.instantiate(child);
                this.fruitPool[name].put(fruit);
            }
        });
    }

    showFruit () {
        let id = Math.floor(Math.random() * 8) + 1
        let fruit = this.getFruitById(id.toString());
        fruit.opacity = 0;
        fruit.parent = this.content;
        let x: number = cc.randomMinus1To1() * 450;
        let y: number = this.beginPosY;
        fruit.position = cc.v2(x, y);
        let fadein = cc.fadeIn(0.5);
        let moveto = cc.moveTo(this.mvDuration, cc.v2(x, this.endPosY));
        fruit.runAction(cc.sequence(fadein, moveto, cc.callFunc(this.removeFruit, this, fruit)));
    }

    getFruitById (name: string) {
        let pool = this.fruitPool[name];
        return pool.get()
    }

    removeFruit (node: cc.Node) {
        let name = node.name
        this.fruitPool[name].put(node);
        node.removeFromParent()
    }

    bgShake() {
        this.bg.position = cc.v2(0, 0);
        this.btnLayer.position = cc.v2(0, 0);
        this.boxLayer.position = cc.v2(0, 0);
        this.content.position = cc.v2(0, 0);

        let t = 0.08;
        let action = cc.sequence(cc.moveBy(t / 2, cc.p(10, 10)), cc.moveBy(t, cc.p(-20, -20)),
            cc.moveBy(t / 2, cc.p(10, 10)), cc.moveBy(t / 2, cc.p(0, 10)), cc.moveBy(t, cc.p(0, -20)), cc.moveBy(t / 2, cc.p(0, 10)),
            cc.moveTo(0, cc.p(0, 0)));

        let action1 = action.clone();
        let action2 = action.clone();
        let action3 = action.clone();

        this.bg.runAction(action);
        this.btnLayer.runAction(action1);
        this.boxLayer.runAction(action2);
        this.content.runAction(action3);
    }

    private touchstart (event: cc.Event.EventCustom) {
        let target: cc.Node = event.getCurrentTarget();
        if (target.name === "left") {
            this.direction = 1;
        } else {
            this.direction = 2;
        }
        this.isTouch = true;
    }

    private touchend () {
        this.isTouch = false;
        this.direction = undefined;
    }

    private onClickStart () {
        this.audioMgr.playClick();
        this.unschedule(this.showFruit);
        this.gameState = true;
        this.schedule(this.showFruit, this.mvDuration / 4, cc.macro.REPEAT_FOREVER, 0.5);
    }

    private onClickHelp () {
        this.audioMgr.playClick();
        let help = cc.instantiate(this.helpPre);
        this.parent.addChild(help);
    }
}
