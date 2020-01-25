import { assets } from '../../assets/loader';
import * as PIXI from 'pixi.js';
import Grid from "./Grid";

export class GameApp extends PIXI.Application {

    grid: Grid;

    constructor(parent: HTMLElement, width: number, height: number) {

        super({width, height, backgroundColor : 0x000000});
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
        loader.add(assets.bg);

        // Load assets
        loader.load(this.onAssetsLoaded.bind(this));

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
    private onAssetsLoaded() {

        // let bgTexture = PIXI.Texture.from(assets.bg);
        // let bg = new PIXI.Sprite(bgTexture);
        // this.app.stage.addChild(bg);

        this.grid = new Grid();
        this.stage.addChild(this.grid);    
    }

}
