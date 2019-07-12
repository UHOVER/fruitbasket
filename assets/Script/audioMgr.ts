const {ccclass, property} = cc._decorator;

@ccclass
export default class AudioMgr extends cc.Component {
    
    @property(cc.AudioClip)
    private bgm: string = undefined;

    @property(cc.AudioClip)
    private boom: string = undefined;

    @property(cc.AudioClip)
    private click: string = undefined;

    @property(cc.AudioClip)
    private close: string = undefined;

    @property(cc.AudioClip)
    private end: string = undefined;

    @property(cc.AudioClip)
    private next: string = undefined;

    @property(cc.AudioClip)
    private score: string = undefined;

    onLoad(){

    }

    playBgm(){
        this.play(this.bgm);
    }

    playBoom(){
        this.play(this.boom);
    }

    playClick(){
        this.play(this.click);
    }

    playClose(){
        this.play(this.close);
    }

    playEnd(){
        this.play(this.end);
    }

    playNext(){
        this.play(this.next);
    }

    playScore(){
        this.play(this.score);
    }

    play(clip: string, loop = false){
        let audioId = cc.audioEngine.play(clip, loop, 1);
        return audioId;
    }

    
}
