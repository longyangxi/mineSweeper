import * as PIXI from 'pixi.js';
import { assets } from '../../assets/loader';
import { TILE_SIZE, ORITIN_TILE_SIZE } from "./Const";
/**
 * Several Tile States
 */
enum TILE_STATE {
    KNOWN = 0,//Number from 0-8
    FLAG = 9,
    BOMB = 10,
    UNKNOWN = 11,
    OTHER = -1
}

const TILE_SCALE: number = TILE_SIZE / ORITIN_TILE_SIZE;

class Tile extends PIXI.AnimatedSprite{
    /**
     * Current tile state
     */
    state: TILE_STATE = TILE_STATE.OTHER;
    /**
     * The number sign of a known tile
     */
    konwnNumber: number = -1;

    constructor(x: number = 0, y: number = 0) {
        // let tiles = assets.tiles;
        super(assets.tiles.map(path => PIXI.Texture.from(path)));
        this.anchor.set(0.5);
        this.animationSpeed = 0.3;
        this.scale.set(TILE_SCALE);
        this.setState(TILE_STATE.UNKNOWN);
        this.setIndex(x, y);
    }
    /**
     * 
     * @param s TILE_STATE state of the tile
     * @param n number if it's known tile, the number on it
     */
    public setState(s: TILE_STATE, n: number = -1) {
        if(this.state == s) return;
        this.state = s;
        if(s == TILE_STATE.KNOWN) {
            this.gotoAndStop(n);
        } else {
            this.gotoAndStop(s);
        }
    }
    public setIndex(x: number, y: number) {
        x += 0.5;
        y += 0.5;
        this.position.set(TILE_SIZE * x, TILE_SIZE * y)
    }
}

export default Tile;