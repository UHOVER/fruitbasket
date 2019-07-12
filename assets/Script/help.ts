import PopAction from './common/popAction';
import GameFruit from './gameFruit';
const {ccclass, property} = cc._decorator;

@ccclass
export default class Help extends PopAction {
    
    private fruitGame: GameFruit = undefined;

    onLoad(){
        let game = cc.find('game');
        this.fruitGame = game.getComponent(GameFruit);

        super.onLoad();
    }

    start(){
        super.start();
    }

    private onClickClose(){
        this.fruitGame.audioMgr.playClose();
        super.closeAnim();
    }

}
