import * as PIXI from 'pixi.js';
import { assets } from '../../assets/loader';
import { TILE_SIZE, TILE_STATE } from "./Const";
import Particle from "./Particle";

/**
 * The original tile size in pixel in assets
 */
export const ORITIN_TILE_SIZE: number = 128;

const TILE_SCALE: number = TILE_SIZE / ORITIN_TILE_SIZE;

/**
 * The tile sprite
 */
class Tile extends PIXI.AnimatedSprite{
    /**
     * If it's a mine
     */
    public hasMine: boolean = false;

    /**
     * Current tile state
     */
    private _state: TILE_STATE = TILE_STATE.OTHER;

    /**
     * The number sign of a known tile
     */
    public minesNumber: number = -1;

    private _tx:number = -1;
    private _ty:number = -1;
    
    constructor(textures: PIXI.Texture[], x: number = 0, y: number = 0, hasMine: boolean = false) {
        super(textures);
        this.anchor.set(0.5);
        this.animationSpeed = 0.3;
        this.scale.set(TILE_SCALE);
        this.state = TILE_STATE.UNKNOWN;
        this.setIndex(x, y);
        this.hasMine = hasMine;
        // if(hasMine) this.state = TILE_STATE.MINE;
    }
    /**
     * 
     * @param s TILE_STATE state of the tile
     * @param n number if it's known tile, the number on it
     */
    public set state(s: TILE_STATE) {
        if(s == TILE_STATE.KNOWN) {
            this.gotoAndStop(this.minesNumber);
        } else {
            this.gotoAndStop(s);
            //show flag drop effect
            if(this._state == TILE_STATE.FLAG) {
                let texture: PIXI.Texture = PIXI.Texture.from(assets.flag);
                Particle.show(this.parent, texture, this.position);
            }
        }
        this._state = s;
    }
    public delayState(s: TILE_STATE, delay: number) {
        let texture: PIXI.Texture = PIXI.Texture.from(assets.rect);
        this._state = s;
        if(delay > 0) {
            setTimeout(() => {
                this.state = s;
                Particle.show(this.parent, texture, this.position)
            }, delay);
        } else {
            this.state = s;
            Particle.show(this.parent, texture, this.position)
        }
    }
    public get state():TILE_STATE
    {
        return this._state;
    }
    public get tx(): number
    {
        return this._tx;
    }
    public get ty(): number
    {
        return this._ty;
    }
    public setIndex(x: number, y: number) {
        this._tx = x;
        this._ty = y;
        x += 0.5;
        y += 0.5;
        this.position.set(TILE_SIZE * x, TILE_SIZE * y)
    }
}

export default Tile;