
import * as PIXI from 'pixi.js';
import Particles = require('pixi-particles');
import * as particleJson from "../../assets/particles/particle.json";
import {TILE_SIZE} from "./Const";

//Adjust the scale of the particle according to the tile size
let scale: number = TILE_SIZE / 64;
particleJson.scale.start *= scale;
particleJson.scale.end *= scale;

class Particle extends Particles.Emitter
{
    constructor(container: PIXI.Container, texture: PIXI.Texture) {
        super(container, [texture], particleJson);
        this.playOnceAndDestroy(null);
        this.autoUpdate = true;
    }
    public show(pos: {x: number, y: number}) {
        this.updateSpawnPos(pos.x, pos.y);
        this.emit = true;
        this.autoUpdate = true;
    }
    public static show(container: PIXI.Container, texture: PIXI.Texture, pos: {x: number, y: number}, delay: number = 0) {
        if(delay > 0) {
            setTimeout(() => {
                let particle: Particle = new Particle(container, texture);
                particle.show(pos);
            }, delay);
        } else {
            let particle: Particle = new Particle(container, texture);
            particle.show(pos);
        }
    }
}

export default Particle;