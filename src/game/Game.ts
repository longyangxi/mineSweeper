import { assets } from '../../assets/loader';
import * as PIXI from 'pixi.js';
import Grid from "./Grid";
import { BACKGROUND, TILE_SIZE, MINES_COUNT} from "./Const";
import {titleStyle, textStyle} from "./TextStyle";

/**
 * The game
 */
export class Game extends PIXI.Application {

    grid: Grid;

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
        const timeText = new PIXI.Text('Time: 0', textStyle);
        timeText.x = title.x + 250;
        timeText.y = title.y + 5;
        this.stage.addChild(timeText);

        //Mines text
        const mines = new PIXI.Text('Mines: ' + MINES_COUNT, textStyle);
        mines.x = timeText.x + 150;
        mines.y = timeText.y;
        this.stage.addChild(mines);

        let time:number = 0;
        let sid:number = setInterval(()=> {
            timeText.text = "Time: " + (++time);
        }, 1000);
    }

}
