
import * as PIXI from 'pixi.js';
import Particles = require('pixi-particles');
import * as particleJson from "../../assets/particles/broken.json";

class Particle extends Particles.Emitter
{
    constructor(container: PIXI.Container, texture: PIXI.Texture) {
        super(container, [texture], particleJson);
    }
    public show(pos: {x: number, y: number}) {
        this.updateSpawnPos(pos.x, pos.y);
        this.emit = true;
        this.autoUpdate = true;
        this.playOnceAndDestroy(null);
    }
}

export default Particle;