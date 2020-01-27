import { assets } from '../../assets/loader';
import * as PIXI from 'pixi.js';
import Grid from "./Grid";
import Shake from "./Shake";
import {Howl, Howler} from 'howler';
import Sound from './Sound';

import { BACKGROUND, MINES_COUNT, titleStyle, tutoStyle, textStyle, isMobile} from "./Const";

enum GameState {
    IDLE,
    PLAY,
    OVER
}
/**
 * The game
 */
export class Game extends PIXI.Application {
    public gameState: GameState = GameState.IDLE;
    private grid: Grid;
    private mines: number = MINES_COUNT;
    private header: PIXI.Graphics;
    private titleTxt: PIXI.Text;
    private minesTxt: PIXI.Text;
    private timeTxt: PIXI.Text;
    private tutoTxt: PIXI.Text;
    private playedTime: number = 0;
    private timer: number = -1;
    private score: number = 0;
    private shake: Shake = new Shake();

    constructor(parent: HTMLElement, width: number, height: number) {

        super({width, height, backgroundColor : 0x000000, antialias: true});
        // Hack for parcel HMR
        parent.replaceChild(this.view, parent.lastElementChild); 

        // init Pixi loader
        let loader = PIXI.Loader.shared;
        // Add tile assets
        console.log('tiles to load', assets);

        //init sounds
        Sound.init(assets.sounds);

        //Add tiles assets
        for(let s in assets.tiles) {
            loader.add(assets.tiles[s]);
        }

        loader.add(assets.rect);
        loader.add(assets.flag);
        // Load assets
        loader.load(this.initGame.bind(this));
        //update grid position when window resized
        window.addEventListener("resize", this.updateLayout.bind(this), false);

        //No right click menu
        document.oncontextmenu = function() {
            return false;
        }
    }
    private initGame() {
        //hide loading
        if(document.getElementById("gameLoading")) document.body.removeChild(document.getElementById("gameLoading"));

        //Add tiles grid
        this.grid = new Grid();
        this.stage.addChild(this.grid);    

        //Add background
        this.header = new PIXI.Graphics();
        this.header.beginFill(BACKGROUND.color);
        this.header.drawRect(0, 0, this.grid.wx + BACKGROUND.border * 2, this.grid.hx + BACKGROUND.top +  + BACKGROUND.border);
        this.header.endFill();
        this.stage.addChildAt(this.header, 0);

        //Title
        this.titleTxt = new PIXI.Text('MineSweeper', titleStyle);
        this.stage.addChild(this.titleTxt);

        //Time text
        this.timeTxt = new PIXI.Text('Time: 0', textStyle);
        this.stage.addChild(this.timeTxt);

        //Mines text
        this.minesTxt = new PIXI.Text('Mines: ' + this.mines, textStyle);
        this.stage.addChild(this.minesTxt);

        //Tutorial text
        this.showTutorial();
        //Events
        this.addEvents();

        this.updateLayout();
    }
    private showTutorial() {
        this.tutoTxt = new PIXI.Text('TAP TO START', tutoStyle);
        this.stage.addChild(this.tutoTxt);
        this.updateLayout();
    }
    private hideTutorial() {
        if(this.tutoTxt != null) {
            this.tutoTxt.parent.removeChild(this.tutoTxt);
            this.tutoTxt = null;
            this.grid.removeListener(isMobile ? "touchstart" : "mousedown", this.hideTutorial.bind(this))
        }
    }
    private addEvents() {
        this.grid.on("onSolve", this.onSolve.bind(this));
        this.grid.on("onFlag" , this.updateMinesCount.bind(this))
        this.grid.on("onUnFlag", this.updateMinesCount.bind(this))
        this.grid.on("onGameOver", this.onGameOver.bind(this));
        this.grid.on("onGameEnd", this.onGameEnd.bind(this));
        this.grid.on(isMobile ? "touchstart" : "mousedown", this.hideTutorial.bind(this))
    }
    private removeEvents() {
        this.grid.removeListener("onSolve", this.onSolve.bind(this));
        this.grid.removeListener("onFlag" , this.updateMinesCount.bind(this))
        this.grid.removeListener("onUnFlag", this.updateMinesCount.bind(this))
        this.grid.removeListener("onGameOver", this.onGameOver.bind(this));
        this.grid.removeListener("onGameEnd", this.onGameEnd.bind(this));
    }
    private onSolve(count: number) {
        if(this.gameState == GameState.IDLE) {
            this.gameState = GameState.PLAY;
            this.startTimer();
        }
        //Simple calculate the score based on the revealed count
        this.score += count * count;

        //Shake effect
        if(count > 5) {
            this.shake.start(this.grid);
        }

        Sound.play("click");
    }
    private onGameOver(win: boolean) {
        win ? Sound.play("gameWin") : Sound.play("gameOver");
        if(!win) {
            Sound.play("wrong");
            this.score = 0;
            //Shake effect
            this.shake.start(this.grid);
        }
        this.gameState = GameState.OVER;
        clearInterval(this.timer);
        this.timeTxt.text = "Time: 0";
        this.timer = -1;
    }
    private onGameEnd() {
        alert(this.score > 0 ?  "You got score: " + this.score + " , play again?" : "You fail, play again?")
        this.removeEvents();
        this.grid = null;
        this.score = 0;
        this.playedTime = 0;
        this.gameState = GameState.IDLE;
        this.mines = MINES_COUNT;
        this.grid = new Grid();
        this.stage.addChild(this.grid);  
        this.addEvents();
        this.minesTxt.text = "Mines: " +  this.mines;
        this.showTutorial();
    }
    private startTimer() {
        this.playedTime = 0;
        this.timer = setInterval(()=> {
            this.timeTxt.text = "Time: " + (++this.playedTime);
        }, 1000);
    }
    private updateMinesCount(flag: boolean) {
        flag ? Sound.play("flag") : Sound.play("unflag");
        flag ? this.mines -- : this.mines ++;
        if(this.mines < 0) this.mines = 0;
        else if(this.mines > MINES_COUNT) this.mines = MINES_COUNT;
        this.minesTxt.text = "Mines: " +  this.mines;
    }

    private updateLayout() {
        let windowWidth: number = window.innerWidth;
        let windowHeight: number = window.innerHeight;
        this.renderer.resize(windowWidth, windowHeight);

        if(this.grid) {
            this.grid.updatePosition();
            this.header.position.set(this.grid.x - BACKGROUND.border, this.grid.y - BACKGROUND.top);
            this.titleTxt.position.set(this.grid.x + BACKGROUND.border, this.grid.y - BACKGROUND.top + BACKGROUND.border);
            this.timeTxt.position.set(this.titleTxt.x + (isMobile ? 165 : 250), this.timeTxt.y = this.titleTxt.y + 5);
            this.minesTxt.position.set(this.timeTxt.x + (isMobile ? 85 : 150), this.minesTxt.y = this.timeTxt.y);
        }
        
        if(this.tutoTxt) {
            this.tutoTxt.position.set((windowWidth - (isMobile ? 150 : 220))/2, (windowHeight - 50)/2);
        }
    }

}
