import * as PIXI from "pixi.js";

/**
 * If the game is on mobile
 */
export const isMobile = checkMobile();

/**
 * The grid tiles number in x and y
 */
export const GRID_SIZE = {
    w: 9,
    h: 9
}

/**
 * Mines tiles count in map
 */
export const MINES_COUNT: number = 10;

export const BACKGROUND = {
    color: 0x595959,//0x222222
    border:  10,
    top: 64
}

/**
 * The tile size in pixel in game scene
 */
export const TILE_SIZE: number = isMobile ? Math.round((window.innerWidth - 2 * BACKGROUND.border) / GRID_SIZE.w) : 64;

/**
 * Tile particle delay (ms)
 */
export const TILE_PARTILCE_DELAY: number = 50;

/**
 * Several Tile States
 */
export enum TILE_STATE {
    KNOWN = 0,//Number from 0-8
    FLAG = 9,
    MINE = 10,
    UNKNOWN = 11,
    OTHER = -1
}

/**
 * Neighbors tile index offset around a tile
 */
export const NEIGHBOR_TILES = [
    {x: -1, y: -1},
    {x: 0, y: -1},
    {x: 1, y: -1},
    {x: 1, y: 0},
    {x: 1, y: 1},
    {x: 0, y: 1},
    {x: -1, y: 1},
    {x: -1, y: 0}
];

export const tutoStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: isMobile ? 20 : 30,
    fontWeight: 'bold',
    fill: ['#ffffff', '#cccccc'],
    stroke: '#4a1850',
    strokeThickness: isMobile ? 3 : 5
});

export const titleStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: isMobile ? 20 : 30,
    fontWeight: 'bold',
    fill: ['#ffffff', '#00ff00'],
    stroke: '#4a1850',
    strokeThickness: isMobile ? 3 : 5,
    dropShadow: true,
    dropShadowColor: '#000000',
    dropShadowBlur: isMobile ? 3 : 6,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: isMobile ? 3 : 6
});

export const textStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: isMobile ? 18 : 26,
    fontWeight: 'bold',
    fill: ['#ffffff', '#cccccc'],
    stroke: '#333333',
    strokeThickness: isMobile ? 3 : 5
});

/**
 * Check if the device is mobile
 */
function checkMobile(): boolean {
    let _isMobile: boolean = true;

    if(window.navigator) {
        var ua = window.navigator.userAgent.toLowerCase();
        _isMobile = ua.indexOf('mobile') !== -1 || ua.indexOf('android') !== -1;
    }
    return _isMobile;
}