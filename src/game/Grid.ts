import * as PIXI from "pixi.js";
import Tile from './Tile';
import { GRID_SIZE, TILE_SIZE, isMobile, TILE_STATE, MINES_COUNT, NEIGHBOR_TILES} from "./Const";

/**
 * The grid container
 */
class Grid extends PIXI.Container {
    public readonly w: number = GRID_SIZE.w;
    public readonly h: number = GRID_SIZE.h;
    public readonly wx: number = this.w * TILE_SIZE;
    public readonly wy: number = this.h * TILE_SIZE;

    private tiles: Tile[][] = [];
    private prevTile: Tile;

    constructor() {
        super();
        this.initGrid();
        this.addEvents();
        this.updatePosition();
    }
    /**
     * Initialize the grid tiles
     */
    private initGrid() {
        let mines: number[] = this.randomMines();
        let hasMine: boolean = false;
        let i:number;
        let j:number;
        let tile:Tile;
        //init tiles
        for(i = 0; i < this.w; i++) {
            this.tiles[i] = [];
            for(j = 0; j < this.h; j++) {
                //check if this is a random mine tile
                hasMine = mines.indexOf(i + j * this.w) > -1;
                //new tile
                tile = new Tile(i, j, hasMine);
                this.addChild(tile);
                this.tiles[i][j] = tile;
            } 
        }
        //init numbers
        for(i = 0; i < this.w; i++) {
            for(j = 0; j < this.h; j++) {
                tile = this.tiles[i][j];
                if(!tile.hasMine) {
                    tile.minesNumber = this.findMinesAround(tile);
                }
            } 
        }
    }
    /**
     * Generate random mines
     */
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
    /**
     * Add click events
     */
    private addEvents() {
        this.interactive = true;
        let click: string = isMobile ? "tap" : "click";
        //TODO on mobile
        let rightClick: string = isMobile ? "todo" : "rightclick";

        this.on(click, this.onClick);
        this.on(rightClick, this.onRightClick);
        
        if(!isMobile) {
            this.on("mousemove", this.onMouseOver);
        }
    }
    /**
     * Try to reveal a tile on click
     * @param evt 
     */
    private  onClick(evt) {
        let tile:Tile = this.getTileByEvent(evt);
        if(tile && tile.state == TILE_STATE.UNKNOWN) {
            // console.log("click", tpos.x, tpos.y);
            if(tile.hasMine) {
                console.log("game over")
            } else {
                this.findBlankNeighbors(tile);
            }
        } 
    }
    /**
     * Show or hide a flag on right click
     * @param evt 
     */
    private onRightClick(evt) {
        let tile:Tile = this.getTileByEvent(evt);
        if(tile) {
            if(tile.state == TILE_STATE.FLAG) tile.state = TILE_STATE.UNKNOWN;
            else if(tile.state == TILE_STATE.UNKNOWN) tile.state = TILE_STATE.FLAG;
            // console.log("right click", tpos.x, tpos.y);
        }
    }
    /**
     * Mouse over effect on PC
     * @param evt 
     */
    private onMouseOver(evt) {
        let tile:Tile = this.getTileByEvent(evt);
        if(this.prevTile == tile) return;
        if(this.prevTile) {
            this.prevTile.tint = 0xFFFFFF;
        }
        if(tile) {
            this.prevTile = tile;
            tile.tint = 0x00FF00;
        }
    }
    /**
     * Update the grid's position on the scene
     */
    public updatePosition() {
        let windowWidth: number = window.innerWidth;
        let windowHeight: number = window.innerHeight;
        this.position.set((windowWidth - this.wx)/2, (windowHeight - this.wy)/2);
    }
    /**
     * Find how many mines around this tile
     */
    public findMinesAround(tile: Tile): number {
        let count: number = 0;
        let i: number = NEIGHBOR_TILES.length;
        let nTile: Tile;
        while(i--){
            let d = NEIGHBOR_TILES[i];
            let tx: number = tile.tx + d.x;
            let ty: number = tile.ty + d.y;
            if(!this.isValidTile(tx, ty)) continue;
            nTile = this.tiles[tx][ty];
            if(nTile.hasMine) count++;
        }
        return count;
    }
    
    /**
     * If this tile is cicked, unreal all the blank neighbors
     * @param tile 
     */
    public findBlankNeighbors(tile: Tile) {
        tile.state = TILE_STATE.KNOWN;
        if(tile.minesNumber > 0) return;
        var i = NEIGHBOR_TILES.length;
        let nTile: Tile;
        while(i--){
            var d = NEIGHBOR_TILES[i];
            var tx = tile.tx + d.x;
            var ty = tile.ty + d.y;
            if(!this.isValidTile(tx, ty)) continue;
            nTile = this.tiles[tx][ty];
            if(nTile.hasMine) continue;
            if(nTile.state == TILE_STATE.KNOWN) continue;
            nTile.state = TILE_STATE.KNOWN;
            if(nTile.minesNumber == 0) {
                this.findBlankNeighbors(nTile);
            }
        }
    }
    private getTileByEvent(evt): Tile {
        let pos = evt.data.getLocalPosition(this);
        let tpos = Grid.calTilePos(pos.x, pos.y);
        if(this.isValidTile(tpos.x, tpos.y)) {
            return this.tiles[tpos.x][tpos.y];
        }
        return null;
    }
    /**
     * If tx and ty are with the grid
     * @param tx 
     * @param ty 
     */
    public isValidTile(tx:number, ty:number):boolean
    {
        return !(tx < 0 || ty < 0 || tx >= this.w || ty >= this.h);
    }
    /**
     * Give x and y pixel position, calculate the tile index in the grid
     * @param x 
     * @param y 
     */
    public static calTilePos(x: number, y: number) : {x: number, y: number} {
        let tp = {x: Math.floor(x / TILE_SIZE), y: Math.floor(y / TILE_SIZE)};
        return tp;
    }
}

export default Grid;