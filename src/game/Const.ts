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
 * The tile size in pixel in game scene
 */
export const TILE_SIZE: number = isMobile ? Math.round(window.innerWidth / GRID_SIZE.w) : 64;

/**
 * Mines tiles count in map
 */
export const MINES_COUNT: number = 10;

/**
 * Tile particle delay (ms)
 */
export const TILE_PARTILCE_DELAY: number = 20;

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

export const BACKGROUND = {
    color: 0x595959,//0x222222
    border:  10,
    top: 64
}

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