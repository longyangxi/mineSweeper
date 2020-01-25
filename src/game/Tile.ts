import * as PIXI from 'pixi.js';
import { assets } from '../../assets/loader';
import { TILE_SIZE, ORITIN_TILE_SIZE, TILE_STATE, isMobile } from "./Const";

const TILE_SCALE: number = TILE_SIZE / ORITIN_TILE_SIZE;

class Tile extends PIXI.AnimatedSprite{
    /**
     * Current tile state
     */
    private _state: TILE_STATE = TILE_STATE.OTHER;
    /**
     * The number sign of a known tile
     */
    private _konwnNumber: number = -1;

    /**
     * If it's a mine
     */
    private _isMine: boolean = false;
    
    constructor(x: number = 0, y: number = 0, isMine: boolean = false) {
        // let tiles = assets.tiles;
        super(assets.tiles.map(path => PIXI.Texture.from(path)));
        this.anchor.set(0.5);
        this.animationSpeed = 0.3;
        this.scale.set(TILE_SCALE);
        this.state = TILE_STATE.UNKNOWN;
        this.setIndex(x, y);
        this._isMine = isMine;
        // if(isMine) this.state = TILE_STATE.MINE;
    }
    /**
     * 
     * @param s TILE_STATE state of the tile
     * @param n number if it's known tile, the number on it
     */
    public set state(s: TILE_STATE) {
        if(this._state == s) return;
        //todo
        let n: number = -1
        this._state = s;
        if(s == TILE_STATE.KNOWN) {
            this.gotoAndStop(n);
            this._konwnNumber = n;
        } else {
            this.gotoAndStop(s);
        }
    }
    public get state():TILE_STATE
    {
        return this._state;
    }
    public get knownNumber():number
    {
        return this._konwnNumber;
    }
    public get isMine():boolean
    {
        return this._isMine;
    }
    public setIndex(x: number, y: number) {
        x += 0.5;
        y += 0.5;
        this.position.set(TILE_SIZE * x, TILE_SIZE * y)
    }
}

export default Tile;