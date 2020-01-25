import * as PIXI from "pixi.js";
import Tile from './Tile';
import { GRID_SIZE, TILE_SIZE, isMobile, TILE_STATE } from "./Const";

class Grid extends PIXI.Container {
    public readonly  w: number = GRID_SIZE.w;
    public readonly h: number = GRID_SIZE.h;
    public readonly wx: number = this.w * TILE_SIZE;
    public readonly wy: number = this.h * TILE_SIZE;

    private tiles: Tile[][] = [];

    constructor() {
        super();
        this.init();
    }
    private init() {
        for(let i: number = 0; i < this.w; i++) {
            this.tiles[i] = [];
            for(let j: number = 0; j < this.h; j++) {
                let tile:Tile = new Tile(i, j);
                this.addChild(tile);
                this.tiles[i][j] = tile;
            } 
        }
        this.addEvents();
        this.updatePosition();
    }
    private addEvents() {
        this.interactive = true;
        let click: string = isMobile ? "tap" : "click";
        //todo on mobile
        let rightClick: string = isMobile ? "todo" : "rightclick";

        this.on(click, this.onClick);
        this.on(rightClick, this.onRightClick);
    }
    private  onClick(evt) {
        let pos = evt.data.getLocalPosition(this);
        let tpos = Grid.calTilePos(pos.x, pos.y);
        let tile:Tile = this.tiles[tpos.x][tpos.y];
        if(tile) {
            tile.setState(TILE_STATE.BOMB);
        }
        console.log("clik", tpos);
    }
    private onRightClick(evt) {
        let pos = evt.data.getLocalPosition(this);
        let tpos = Grid.calTilePos(pos.x, pos.y);
        let tile:Tile = this.tiles[tpos.x][tpos.y];
        if(tile) {

        }
        console.log("right clik", tpos);
    }
    public updatePosition() {
        let windowWidth: number = window.innerWidth;
        let windowHeight: number = window.innerHeight;
        this.position.set((windowWidth - this.wx)/2, (windowHeight - this.wy)/2);
    }
    public static calTilePos(x: number, y: number) : {x: number, y: number} {
        let tp = {x: Math.floor(x / TILE_SIZE), y: Math.floor(y / TILE_SIZE)};
        return tp;
    }
}

export default Grid;