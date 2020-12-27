

const textsize = 20;

let data2020;
let streams;
let font;
let countdown;

function preload() {
    data2020 = loadJSON("https://raw.githubusercontent.com/BubbyBabur/Countdown2021/master/data/2020%20Sucks%20-%20Global.json");
    font = loadFont("https://raw.githubusercontent.com/BubbyBabur/Countdown2021/master/data/Lato-Bold.otf");
}

function setup() {

    createCanvas(windowWidth, windowHeight);
    streams = new AllStreams();

    countdown = new Countdown("2021-01-01T00:00:00.00");

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(0,0,0);

    streams.update();

    noStroke();

    fill(255, 0, 0);

    text(Math.round(frameRate()), 15,15);

    countdown.update();
}

class AllStreams {
    constructor(){
        this.streams = [];
        for(let i = 0; i < width / textsize; i++) {
            this.streams.push(this.randStream(i * textsize))
        } 

        console.log()
    }

    randChoice(arr) {
        return arr[Math.floor(Math.random() * Math.max(...Object.keys(data2020).map(a => parseInt(a))))];
        // return arr[Math.floor(arr.length * Math.random())]
    }

    randStream(x) {
        return new Stream(x, this.randChoice(data2020).Name, Math.floor(1 + 3 * Math.random()), Math.floor(30 + 40 * Math.random()), 200 * Math.random())
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

        // this.string = str.replace(/ /g, "");
        this.string = str;

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

class Node {
    constructor(x,y,px,py) {
        // 
        if(!px) {
            this.pos = createVector(Math.random() * width, Math.random() * height);
        } else {
            this.pos = createVector(px,py);
        }
        this.target = createVector(x,y);

        this.vel = createVector(0,0);
        this.maxvel = 20;
        this.maxforce = 3;
        this.acc = createVector(0,0);
    }

    update() {

        this.targetvel = p5.Vector.sub(this.target,this.pos);
        let speed = this.maxvel;
        if(this.targetvel.mag() < 100) {
            speed = map(this.targetvel.mag(), 0, 100, 0, this.maxvel);
        }
        this.targetvel.normalize();
        this.targetvel.mult(speed);

        this.targetforce = p5.Vector.sub(this.targetvel, this.vel);
        this.targetforce.limit(this.maxforce);

        this.acc = this.targetforce;

        this.pos.add(this.vel);
        this.vel.add(this.acc);

        this.render();
    }

    render() {
        fill(255,255,255);
        ellipse(this.pos.x,this.pos.y,10,10);
    }

    setTarget(x,y){
        this.target = createVector(x,y);
    }
}

class Morph {
    constructor(str,x,y,textsize) {

        this.pos = createVector(x,y);

        this.textsize = textsize || 300;

        textFont(font);
        textSize(this.textsize);
        fill(255, 0, 0);


        this.textstr = str;

        this.points = font.textToPoints(this.textstr, this.pos.x, this.pos.y);
        this.bounds = font.textBounds(this.textstr, this.pos.x, this.pos.y);

        this.nodes = [];
        for (const p of this.points) {
            this.nodes.push(new Node(p.x - this.bounds.w / 2, p.y + this.bounds.h / 2));
        }
    }

    changeStr(str) {

        this.textstr = str;
        textFont(font);
        textSize(this.textsize);
        fill(255, 0, 0);

        this.points = font.textToPoints(this.textstr, this.pos.x, this.pos.y);
        this.bounds = font.textBounds(this.textstr, this.pos.x, this.pos.y);

        if(this.points.length < this.nodes.length) {
            // We need less nodes!
            let todelete = this.nodes.length - this.points.length;
            for(let i = 0; i < todelete; i++) {
                // delete random nodes
                let randindex = Math.floor( Math.random() * this.nodes.length );
                this.nodes.splice(randindex,1);
            } 
        } else if(this.points.length > this.nodes.length) {
            // We need more nodes!
            let tocopy = this.points.length - this.nodes.length;
            for (let i = 0; i < tocopy; i++) {
                // copy random nodes
                let randindex = Math.floor(Math.random() * this.nodes.length);
                this.nodes.splice(randindex, 0, new Node(this.nodes[randindex].target.x, this.nodes[randindex].target.y, this.nodes[randindex].pos.x, this.nodes[randindex].pos.y ));
            }
        }

        for (let i = 0; i < this.points.length; i++) {
            const p = this.points[i];
            this.nodes[i].setTarget(p.x - this.bounds.w / 2, p.y + this.bounds.h / 2);
        }
    }

    update() {
        for (const n of this.nodes) {
            n.update();
        }
    }
}

class Countdown {
    constructor(to) {
        this.colons = [];

        this.days = new Morph("01", 1*width / 5, height / 2, width / 7);
        this.hours = new Morph("01", 2*width / 5, height / 2, width / 7);
        this.minutes = new Morph("01",3*width / 5, height / 2, width / 7);
        this.seconds = new Morph("01", 4*width / 5, height / 2, width / 7);


        this.todate = moment(to);

        this.setDiff();

        console.log(this.todate);
    }

    getDiff(){
        return moment.duration( this.todate.diff(moment()) );
    }

    setDiff(){
        this.diff = this.getDiff();
        let days = this.twoDigit(this.diff.days());
        if(days !== this.days.textstr) this.days.changeStr( days );
        let hours = this.twoDigit(this.diff.hours());
        if (hours !== this.hours.textstr) this.hours.changeStr(hours);
        let minutes = this.twoDigit(this.diff.minutes());
        if (minutes !== this.minutes.textstr) this.minutes.changeStr(minutes);
        let seconds = this.twoDigit(this.diff.seconds());
        if (seconds !== this.seconds.textstr) this.seconds.changeStr(seconds);
    }

    twoDigit(num) {
        num += "";
        if(num.length < 2) {
            num = `0${num}`;
        }
        return num;
    }

    update() {
        this.days.update();
        this.hours.update();
        this.minutes.update();
        this.seconds.update();

        this.setDiff()
    }
}
