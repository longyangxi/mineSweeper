import { assets } from '../../assets/loader';
import * as PIXI from 'pixi.js';
import Grid from "./Grid";
import { BACKGROUND, TILE_SIZE, MINES_COUNT} from "./Const";
import {titleStyle, textStyle} from "./TextStyle";
import Tile from './Tile';

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
    grid: Grid;
    mines: number = MINES_COUNT;
    minesTxt: PIXI.Text;
    timeTxt: PIXI.Text;
    timer: number = -1;

    constructor(parent: HTMLElement, width: number, height: number) {

        super({width, height, backgroundColor : 0x000000, antialias: true});
        // Hack for parcel HMR
        parent.replaceChild(this.view, parent.lastElementChild); 

        // init Pixi loader
        let loader = new PIXI.Loader();
        // Add tile assets
        let tiles = assets.tiles;
        console.log('tiles to load', assets);

        tiles.map(path => {
            loader.add(path);
        })
        loader.add(assets.rect);
        loader.add(assets.flag);

        // Load assets
        loader.load(this.initGame.bind(this));

        //update grid position when window resized
        window.addEventListener("resize", this.onResize.bind(this), false);

        document.oncontextmenu = function() {
            return false;
        }
    }
    private onResize() {
        if(this.grid) {
            this.grid.updatePosition();
        }
    }
    private initGame() {
        //hide loading
        if(document.getElementById("gameLoading")) document.body.removeChild(document.getElementById("gameLoading"));

        //Add tiles grid
        this.grid = new Grid();
        this.stage.addChild(this.grid);    

        //Add background
        const header: PIXI.Graphics = new PIXI.Graphics();
        header.beginFill(BACKGROUND.color);
        header.drawRect(0, 0, this.grid.wx + BACKGROUND.border * 2, this.grid.hx + BACKGROUND.top +  + BACKGROUND.border);
        header.endFill();
        header.position.set(this.grid.x - BACKGROUND.border, this.grid.y - BACKGROUND.top);
        this.stage.addChildAt(header, 0);

        //Title
        const title = new PIXI.Text('MineSweeper', titleStyle);
        title.x = this.grid.x + BACKGROUND.border;
        title.y = this.grid.y - BACKGROUND.top + BACKGROUND.border;
        this.stage.addChild(title);

        //Time text
        this.timeTxt = new PIXI.Text('Time: 0', textStyle);
        this.timeTxt.x = title.x + 250;
        this.timeTxt.y = title.y + 5;
        this.stage.addChild(this.timeTxt);

        //Mines text
        this.minesTxt = new PIXI.Text('Mines: ' + this.mines, textStyle);
        this.minesTxt.x = this.timeTxt.x + 150;
        this.minesTxt.y = this.timeTxt.y;
        this.stage.addChild(this.minesTxt);

        //Events
        this.addEvents();
    }
    addEvents() {
        this.grid.on("onSolve", this.onSolve.bind(this));
        this.grid.on("onFlag" , this.updateMinesCount.bind(this))
        this.grid.on("onUnFlag", this.updateMinesCount.bind(this))
        this.grid.on("onGameOver", this.onGameOver.bind(this));
        this.grid.on("onRestart", this.restartGame.bind(this));
    }
    removeEvents() {
        this.grid.removeListener("onSolve", this.onSolve.bind(this));
        this.grid.removeListener("onFlag" , this.updateMinesCount.bind(this))
        this.grid.removeListener("onUnFlag", this.updateMinesCount.bind(this))
        this.grid.removeListener("onGameOver", this.onGameOver.bind(this));
        this.grid.removeListener("onRestart", this.restartGame.bind(this));
    }
    onSolve(tile:Tile) {
        if(this.gameState == GameState.IDLE) {
            this.gameState = GameState.PLAY;
            this.startTimer();
        }
    }
    onGameOver() {
        alert("Game Over!")
        this.gameState = GameState.OVER;
        clearInterval(this.timer);
        this.timeTxt.text = "Time: 0";
        this.timer = -1;
    }
    restartGame(score: number = 0) {
        alert(score ?  "You win, play again?" : "You fail, play again?")
        this.removeEvents();
        this.grid = null;
        this.gameState = GameState.IDLE;
        this.mines = MINES_COUNT;
        this.grid = new Grid();
        this.stage.addChild(this.grid);  
        this.addEvents();
    }

    startTimer() {
        let time:number = 0;
        this.timer = setInterval(()=> {
            this.timeTxt.text = "Time: " + (++time);
        }, 1000);
    }
    updateMinesCount(flag: boolean) {
        flag ? this.mines -- : this.mines ++;
        if(this.mines < 0) this.mines = 0;
        else if(this.mines > MINES_COUNT) this.mines = MINES_COUNT;
        this.minesTxt.text = "Mines: " +  this.mines;
    }

}
