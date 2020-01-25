import * as PIXI from "pixi.js";
import Tile from './Tile';
import { GRID_SIZE, TILE_SIZE, isMobile, TILE_STATE, MINES_COUNT } from "./Const";

class Grid extends PIXI.Container {
    public readonly  w: number = GRID_SIZE.w;
    public readonly h: number = GRID_SIZE.h;
    public readonly wx: number = this.w * TILE_SIZE;
    public readonly wy: number = this.h * TILE_SIZE;

    private tiles: Tile[][] = [];

    constructor() {
        super();
        this.initGrid();
        this.addEvents();
        this.updatePosition();
    }
    private initGrid() {
        let mines: number[] = this.randomMines();
        let isMine: boolean = false;
        for(let i: number = 0; i < this.w; i++) {
            this.tiles[i] = [];
            for(let j: number = 0; j < this.h; j++) {
                //check if this is a random mine tile
                isMine = mines.indexOf(i + j * this.w) > -1;
                //new tile
                let tile:Tile = new Tile(i, j, isMine);
                this.addChild(tile);
                this.tiles[i][j] = tile;
            } 
        }
    }
    private randomMines(): number[] {
        let len: number = this.w * this.h;

        let i: number = len, rand;
        let array: number[] = [];
        
        while (0 !== i) {
            rand = Math.floor(Math.random() * i);
            i -= 1;
            if(array.indexOf(rand) > -1) continue;
            array.push(rand);
            if(array.length >= MINES_COUNT) break;
        }
        
        return array;
    }
    private addEvents() {
        this.interactive = true;
        let click: string = isMobile ? "tap" : "click";
        //TODO on mobile
        let rightClick: string = isMobile ? "todo" : "rightclick";

        this.on(click, this.onClick);
        this.on(rightClick, this.onRightClick);
    }
    private  onClick(evt) {
        let pos = evt.data.getLocalPosition(this);
        let tpos = Grid.calTilePos(pos.x, pos.y);
        let tile:Tile = this.tiles[tpos.x][tpos.y];
        if(tile) {
            tile.state = TILE_STATE.MINE;
            console.log("click", tpos.x, tpos.y);
        }
    }
    private onRightClick(evt) {
        let pos = evt.data.getLocalPosition(this);
        let tpos = Grid.calTilePos(pos.x, pos.y);
        let tile:Tile = this.tiles[tpos.x][tpos.y];
        if(tile) {
            tile.state = TILE_STATE.FLAG;
            console.log("right click", tpos.x, tpos.y);
        }
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