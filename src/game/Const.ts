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
 * The original tile size in pixel in assets
 */
export const ORITIN_TILE_SIZE: number = 216;

/**
 * The tile size in pixel in game scene
 */
export const TILE_SIZE: number = isMobile ? 64 : 64;


function checkMobile(): boolean {
    let _isMobile: boolean = true;

    if(window.navigator) {
        var ua = window.navigator.userAgent.toLowerCase();
        _isMobile = ua.indexOf('mobile') !== -1 || ua.indexOf('android') !== -1;
    }
    return _isMobile;
}