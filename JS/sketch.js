

const textsize = 30;

let data2020;
let streams;

function preload() {
    data2020 = loadJSON("../data/2020 Sucks - Global.json");
}

function setup() {

    console.log(data2020)

    createCanvas(windowWidth, windowHeight);
    streams = new AllStreams();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(0,0,0);
    streams.update();
}

class AllStreams {
    constructor(){
        this.streams = [];
        for(let i = 0; i < width / textsize; i++) {
            this.streams.push(this.randStream(i * textsize))
        } 
    }

    randStream(x) {
        return new Stream(x, "haha brrrrrr", Math.floor(1 + 5 * Math.random()), Math.floor(30 + 40 * Math.random()), 255 * Math.random())
    }

    update(){ 
        for (const stream of this.streams) {
            stream.update();
        }

        for (let i = 0; i < this.streams.length; i++) {
            if (this.streams[i].done) {
                this.streams[i] = this.randStream(i * textsize)
            }
        }
    }
}

class Stream {

    /**
     * 
     * @param {number} x 
     * @param {string} str 
     * @param {number} speed
     * @param {number} len
     * @param {number} opacity
     */
    constructor(x,str,speed,len,opacity) {
        this.x = x;
        this.y = 0;
        this.values = [];

        this.offset = 0;

        this.speed = speed || 3;

        this.maxlen = len || 20;
        this.textsize = textsize;

        this.totalchars = Math.floor( height / this.textsize ) ;
        let lastpossibleopportunity = this.totalchars - str.length;
        this.startpoint = Math.round(lastpossibleopportunity * Math.random())

        this.completed = 0;

        this.string = str.replace(/ /g, "");
        // this.string = str;

        this.changeprob = 0.05;

        this.done = false;

        this.opacity = opacity || 255;

        const greengreen = color("#00FF00");
        const mintgreen = color("#9FFFA5")
        const teagreen = color("#C8FFC7");
        const nyanza = color("#DFFFDF");

        this.COLORSARRAY = [
            ...Array(1).fill(nyanza),
            ...Array(4).fill(teagreen),
            ...Array(8).fill(mintgreen),
            ...Array(this.maxlen).fill(greengreen),
        ] 

    }

    getRandomValue(){ 
        let english = String.fromCharCode(0x0021 + Math.round(93 * Math.random()));
        let katakana = String.fromCharCode(0x30A0 + Math.round(93 * Math.random()));
        if(Math.random() < 0.8) {
            return katakana;
        } else {
            return english;
        }
    }

    render(){
        
        textAlign(CENTER,CENTER);
        textSize(this.textsize);
        textFont("Inconsolata")

        for(let i = 0; i < this.values.length; i++) {
            // let rb = 150 - (this.values.length - i - 1) * 10;
            let reverseindex = this.values.length - i - 1;
            fill(red(this.COLORSARRAY[reverseindex]), green(this.COLORSARRAY[reverseindex]), blue(this.COLORSARRAY[reverseindex]), this.opacity);

            text(this.values[i], this.x, this.y + this.offset * this.textsize + this.textsize * i);
        }
    }

    update() {

        if(frameCount % this.speed === 0) {

            if(this.completed - this.startpoint >= 0 && this.completed - this.startpoint < this.string.length) {
                this.values.push(this.string[this.completed - this.startpoint]);
            } else {
                this.values.push(this.getRandomValue())
            }
            this.completed++;

            if(this.values.length > this.maxlen) {
                this.values.splice(0, 1);
                this.offset ++;
            }

        }

        if(this.y + this.textsize * this.offset > height) {
            this.done = true;
        }

        if(Math.random() < this.changeprob) {
            let index = Math.floor( Math.random() * this.values.length);
            this.values[index] = this.getRandomValue();
        }

        this.render();
    }
}
