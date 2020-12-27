

let streams = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(0,0,0);
    // c.update();

    const streamfreq = 20;

    if(frameCount % streamfreq === 0) {
        streams.push(new Stream(width * Math.random() ,"haha brrrrr"))
    }

    for(const stream of streams) {
        stream.update();
    }

    for(let i = 0; i < streams.length; i++) {
        if(streams[i].done) {
            streams.splice(i, 1);
        }
    }
}

class Stream {

    /**
     * 
     * @param {number} x 
     * @param {string} str 
     */
    constructor(x,str) {
        this.x = x;
        this.y = 0;
        this.values = [];

        this.offset = 0;

        this.speed = 3;

        this.maxlen = 20;
        this.textsize = 30;

        this.totalchars = Math.floor( height / this.textsize ) ;
        let lastpossibleopportunity = this.totalchars - str.length;
        this.startpoint = Math.round(lastpossibleopportunity * Math.random())

        this.completed = 0;

        // this.string = str.replace(/ /g, "");
        this.string = str;

        this.changeprob = 0.05;

        this.done = false;
    }

    getRandomValue(){ 
        return String.fromCharCode(0x0021 + Math.round(93 * Math.random()));
    }

    render(){
        fill(0,255,0);
        textAlign(CENTER,CENTER);
        textSize(this.textsize);
        textFont("Inconsolata")

        for(let i = 0; i < this.values.length; i++) {
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
