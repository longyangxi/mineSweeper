import { assets } from '../../assets/loader';
import * as PIXI from 'pixi.js';
import Grid from "./Grid";

export class GameApp extends PIXI.Application {

    constructor(parent: HTMLElement, width: number, height: number) {

        super({width, height, backgroundColor : 0x000000});
        // Hack for parcel HMR
        parent.replaceChild(this.view, parent.lastElementChild); 

        // init Pixi loader
        let loader = new PIXI.Loader();
        // Add user tile assets
        let tiles = assets.tiles;
        console.log('tiles to load', assets);

        tiles.map(path => {
            loader.add(path);
        })
        loader.add(assets.bg);

        // Load assets
        loader.load(this.onAssetsLoaded.bind(this));
    }

    private onAssetsLoaded() {

        // let bgTexture = PIXI.Texture.from(assets.bg);
        // let bg = new PIXI.Sprite(bgTexture);
        // this.app.stage.addChild(bg);

        let grid: Grid = new Grid();
        this.stage.addChild(grid);    
    }

}
