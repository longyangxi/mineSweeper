import * as PIXI from "pixi.js";

export const titleStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 30,
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff00'],
    stroke: '#4a1850',
    strokeThickness: 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6
});

export const textStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 26,
    fontWeight: 'bold',
    fill: ['#ffffff', '#cccccc'],
    stroke: '#333333',
    strokeThickness: 5
});