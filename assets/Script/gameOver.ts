import PopAction from './common/popAction';
import GameFruit from './gameFruit';
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOver extends PopAction {
    
    private fruitGame: GameFruit = undefined;

    onLoad(){
        let game = cc.find('game');
        this.fruitGame = game.getComponent(GameFruit);

        super.onLoad();
    }

    start(){
        super.start();
        this.fruitGame.audioMgr.playEnd();
        // this.scheduleOnce(this.onClose, 3)
    }

    private onClose(){
        this.fruitGame.audioMgr.playClose();
        this.fruitGame.initGame();
        super.closeAnim();
    }
}
