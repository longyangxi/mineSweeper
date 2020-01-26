import * as PIXI from "pixi.js";
import Tile from './Tile';
import { assets } from "../../assets/loader";
import { GRID_SIZE, TILE_SIZE, isMobile, TILE_STATE, MINES_COUNT, NEIGHBOR_TILES, TILE_PARTILCE_DELAY} from "./Const";

/**
 * The grid container
 */
class Grid extends PIXI.Container {
    public readonly w: number = GRID_SIZE.w;
    public readonly h: number = GRID_SIZE.h;
    public readonly wx: number = this.w * TILE_SIZE;
    public readonly hx: number = this.h * TILE_SIZE;

    private tiles: Tile[][] = [];
    private mineTiles: Tile[] = [];
    private prevActiveTile: Tile;
    private tempDelay: number = 0;
    private totalReavealed: number = 0;
    private onceRevealed: number = 0;
    private inTouch: boolean = false;

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
                if(hasMine) this.mineTiles.push(tile);
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
        let rightClick: string = isMobile ? "touchstart" : "rightclick";

        this.on(click, this.onClick);
        this.on(rightClick, this.onRightClick);
        
        if(!isMobile) {
            this.on("mousemove", this.onMouseOver);
        }
    }
    private removeEvents() {
        this.interactive = false;
        let click: string = isMobile ? "tap" : "click";
        let rightClick: string = isMobile ? "touchstart" : "rightclick";

        this.removeListener(click, this.onClick);
        this.removeListener(rightClick, this.onRightClick);
        
        if(!isMobile) {
            this.removeListener("mousemove", this.onMouseOver);
        }
    }
    private gameOver(win: boolean, delay: number) {
        if(this.prevActiveTile) {
            this.prevActiveTile.tint = 0xFFFFFF;
            this.prevActiveTile = null;
        }
        this.emit("onGameOver", win);
        this.removeEvents();
        if(!win) {
            this.revealAllMines(TILE_PARTILCE_DELAY);
        }
        setTimeout(() => {
            this.emit("onGameEnd");
        }, delay);
        this.tiles = [];
        this.mineTiles = [];
    }
    private revealAllMines(delay: number) {
        let i: number;
        for(i = 0; i < this.mineTiles.length; i++) {
            let tile: Tile = this.mineTiles[i];
            if(tile.state == TILE_STATE.UNKNOWN) {
                tile.delayState(TILE_STATE.MINE, 500 + (i + 1) * delay);
            }
        }
    }
    /**
     * Try to reveal a tile on click
     * @param evt 
     */
    private  onClick(evt) {
        if(isMobile) {
            //If long touched, ignore this click in mobile
            if(!this.inTouch) {
                return;
            }
            this.inTouch = false;
        }
        let tile:Tile = this.getTileByEvent(evt);
        if(tile && tile.state == TILE_STATE.UNKNOWN) {
            if(tile.hasMine) {
                //failed
                tile.delayState(TILE_STATE.MINE, 0);
                //hilight the error
                if(this.prevActiveTile == tile) this.prevActiveTile = null;
                tile.tint = 0xFF0000;
                setTimeout(() => {
                    tile.tint = 0xFFFFFF;
                }, 500);
                //game fail
                this.gameOver(false, this.mineTiles.length * TILE_PARTILCE_DELAY + 1500);
            } else {
                this.tempDelay = 0;
                this.onceRevealed = 0;
                this.findBlankNeighbors(tile);
                this.emit("onSolve", this.onceRevealed);
                this.totalReavealed += this.onceRevealed;
                //win
                if(this.totalReavealed >= this.w * this.h - MINES_COUNT) {
                    this.gameOver(true, this.onceRevealed * TILE_PARTILCE_DELAY + 1000);
                }
            }
        }
    }
    /**
     * Show or hide a flag on right click
     * @param evt 
     */
    private onRightClick(evt) {
        if(!isMobile) {
            this.handleRightClick(evt);
        //In mobile, long press means right-click    
        } else {
            this.inTouch = true;
            setTimeout(() => {
                if(this.inTouch) {
                    this.inTouch = false;
                    this.handleRightClick(evt);
                }
            }, 500);
        }
        
    }
    private handleRightClick(evt) {
        let tile:Tile = this.getTileByEvent(evt);
        if(tile) {
            if(tile.state == TILE_STATE.FLAG) {
                tile.state = TILE_STATE.UNKNOWN;
                this.emit("onUnFlag", false)
            } else if(tile.state == TILE_STATE.UNKNOWN) {
                tile.state = TILE_STATE.FLAG;
                this.emit("onFlag", true)
            }
        }
    }
    /**
     * Mouse over effect on PC
     * @param evt 
     */
    private onMouseOver(evt) {
        let tile:Tile = this.getTileByEvent(evt);
        if(this.prevActiveTile == tile) return;
        if(this.prevActiveTile) {
            this.prevActiveTile.tint = 0xFFFFFF;
        }
        if(tile) {
            this.prevActiveTile = tile;
            tile.tint = 0x00FF00;
        }
    }
    /**
     * Update the grid's position on the scene
     */
    public updatePosition() {
        let windowWidth: number = window.innerWidth;
        let windowHeight: number = window.innerHeight;
        this.position.set((windowWidth - this.wx)/2, (windowHeight - this.hx)/2);
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
        if(tile.state != TILE_STATE.KNOWN) {
            this.onceRevealed ++;
            this.tempDelay += TILE_PARTILCE_DELAY;
            tile.delayState(TILE_STATE.KNOWN, this.tempDelay)
        }
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
            this.onceRevealed ++;
            this.tempDelay += TILE_PARTILCE_DELAY;
            nTile.delayState(TILE_STATE.KNOWN, this.tempDelay)
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