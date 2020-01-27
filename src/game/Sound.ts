import {Howl, Howler} from 'howler';

class Sound {
    private static urls = {};
    private static caches = {};

    public static init(sounds) {
        for(let s in sounds) {
            Sound.urls[s] = sounds[s];
        }
    }
    public static play(name): Howl{
        let s: Howl = Sound.caches[name];
        if(s == null) {
            let url: string = Sound.urls[name];
            if(url == null) return;
            s = new Howl({
                src: [url]
            })
            Sound.caches[name] = s;
        }
        s.play();
        return s;
    }
    public static stop(name): void {
        let s: Howl = Sound.caches[name];
        if(s != null) s.stop();
    }
}

export default Sound;