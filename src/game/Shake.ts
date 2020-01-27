import * as PIXI from 'pixi.js';

class Shake {
    _shakeTarget: PIXI.DisplayObject;
    _originPos: PIXI.Point;
    _lastAxis: string = "";
    _lastOffset: number = 0;
    _shakeCount: number = 0;
    _maxCount: number = 0;
    _shakeRange: number = 0;
    _timer: number = -1;
    start(target: PIXI.DisplayObject, range: number = 8, count: number = 5, interval: number = 30)
    {
        this.stop();

        this._shakeTarget = target;

        this._shakeRange = range;
        this._maxCount = count;

        this._originPos = new PIXI.Point(target.x, target.y);
        this._shakeCount = 0;
        this._lastAxis = "";

        this._timer = setInterval(this._doShake.bind(this), interval);
    }
    stop () {
        if(!this._shakeTarget) return;
        if(this._originPos) this._shakeTarget.position = this._originPos;
        this._shakeTarget = null;
        clearInterval(this._timer);
    }
    _doShake()
    {
        if(!this._shakeTarget) return;

        var range = this._shakeRange;

        if(this._lastAxis) {
            this._shakeTarget[this._lastAxis] -= this._lastOffset;
            this._lastAxis = "";
        } else {
            this._lastAxis = (Math.random() <= 0.5) ? "x" : "y";
            var r = range/2 + Math.random()*range/2;
            if(Math.random() <= 0.5) r *= -1;
            this._lastOffset = r;
            this._shakeTarget[this._lastAxis] += this._lastOffset;
        }

        this._shakeCount++;
        if(this._shakeCount > this._maxCount) {
            this.stop();
        }
    }
}

export default Shake;