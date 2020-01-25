import * as PIXI from "pixi.js";
import Tile from './Tile';
import { GRID_SIZE, TILE_SIZE } from "./Const";

class Grid extends PIXI.Container {
    public readonly  w: number = GRID_SIZE.w;
    public readonly h: number = GRID_SIZE.h;
    public readonly wx: number = this.w * TILE_SIZE;
    public readonly wy: number = this.h * TILE_SIZE;
    constructor() {
        super();
        this.init();
    }
    private init() {
        for(let i: number = 0; i < this.w; i++) {
            for(let j: number = 0; j < this.h; j++) {
                let tile:Tile = new Tile(i, j);
                this.addChild(tile);
            } 
        }
        this.updatePosition();
    }
    public updatePosition() {
        let windowWidth: number = window.innerWidth;
        let windowHeight: number = window.innerHeight;
        this.position.set((windowWidth - this.wx)/2, (windowHeight - this.wy)/2);
    }
}

export default Grid;