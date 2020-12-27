

const textsize = 20;

let data2020;
let streams;
let font;

function preload() {
    data2020 = loadJSON("https://raw.githubusercontent.com/BubbyBabur/Countdown2021/master/data/2020%20Sucks%20-%20Global.json");
    font = loadFont("https://raw.githubusercontent.com/BubbyBabur/Countdown2021/master/data/Lato-Bold.otf");
}



let textstr = "1"

let points;
let bounds;

let nodes = [];

function setup() {

    createCanvas(windowWidth, windowHeight);
    streams = new AllStreams();


    textFont(font);
    textSize(300);
    fill(255, 0, 0);

    points = font.textToPoints(textstr, width / 2, height / 2);
    bounds = font.textBounds(textstr, width / 2, height / 2);

    for (const p of points) {
        nodes.push(new Node(p.x - bounds.w / 2, p.y + bounds.h / 2));
    }

    setInterval(() => {

        textFont(font);
        textSize(300);
        fill(255, 0, 0);


        textstr = "" + Math.floor( 100*Math.random() );
        points = font.textToPoints(textstr, width / 2, height / 2);
        bounds = font.textBounds(textstr, width / 2, height / 2);

        if(points.length < nodes.length) {
            // We need less nodes!
            let todelete = nodes.length - points.length;
            for(let i = 0; i < todelete; i++) {
                // delete random nodes
                let randindex = Math.floor( Math.random() * nodes.length );
                nodes.splice(randindex,1);
            } 
        } else if(points.length > nodes.length) {
            // We need more nodes!
            let tocopy = points.length - nodes.length;
            for (let i = 0; i < tocopy; i++) {
                // copy random nodes
                let randindex = Math.floor(Math.random() * nodes.length);
                nodes.splice(randindex, 0, new Node(nodes[randindex].target.x, nodes[randindex].target.y, nodes[randindex].pos.x, nodes[randindex].pos.y ));
            }
        }

        // console.log(nodes.length, points.length)
        for (let i = 0; i < points.length; i++) {
            const p = points[i];
            nodes[i].setTarget(p.x - bounds.w / 2, p.y + bounds.h / 2);
        }
        // console.log(textstr)
    }, 1000);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(0,0,0);

    streams.update();

    noStroke();

    // textFont(font);
    // textSize(300);
    fill(255, 0, 0);

    text(Math.round(frameRate()), 15,15);

    for(const n of nodes) {
        n.update();
    }
    // fill(0,255,0);
    // ellipse(width/2, height/2, 100,100);
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
