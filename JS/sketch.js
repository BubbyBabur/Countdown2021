

const textsize = 20;

let data2020;
let streams;

let testdata2020;

function preload() {
    data2020 = [
        {
            "Name": "Hong Kong Protests",
            "Date": "January 2020",
            "Description": ""
        },
        {
            "Name": "Kanye West and Bloomberg run for president",
            "Date": "January 2020",
            "Description": "i- huh"
        },
        {
            "Name": "Flint Michigan still doesn't have clean water",
            "Date": "January 2020",
            "Description": "Yep, that's still happening"
        },
        {
            "Name": "David Stern passes away",
            "Date": "January 1 2020",
            "Description": ""
        },
        {
            "Name": "\"World War III\"",
            "Date": "3 January 2020",
            "Description": "Iranian general Soleimani drone striked by US"
        },
        {
            "Name": "Taal Volcano Eruption",
            "Date": "January 12 2020",
            "Description": ""
        },
        {
            "Name": "First coronavirus case in US",
            "Date": "1/20/2020",
            "Description": "It begins."
        },
        {
            "Name": "Kobe Bryant dies in helicopter crash",
            "Date": "1/26/2020",
            "Description": ""
        },
        {
            "Name": "Brexit",
            "Date": "Jan 31 2020",
            "Description": ""
        },
        {
            "Name": "People buy a lot of toilet paper",
            "Date": "February 2020",
            "Description": "Actual brain damage"
        },
        {
            "Name": "Trump Impeachment ",
            "Date": "2/5/2020",
            "Description": "Impeached, not removed from office though."
        },
        {
            "Name": "DJI plunges >1k points in one day",
            "Date": "March 9 2020",
            "Description": "stonks"
        },
        {
            "Name": "Prince Harry and Meghan Markle step down as senior members of royal family",
            "Date": "March 31 2020",
            "Description": ""
        },
        {
            "Name": "Oil prices go negative",
            "Date": "April 20 2020",
            "Description": "Buy oil!"
        },
        {
            "Name": "Australia Bushfires",
            "Date": "May 2020",
            "Description": ""
        },
        {
            "Name": "Death of George Floyd",
            "Date": "May 25 2020",
            "Description": ""
        },
        {
            "Name": "CNN Reporter Omar Jimenez is arrested live",
            "Date": "May 29 2020",
            "Description": "An understandable misunderstanding, considering all the, you know, news equipment around him."
        },
        {
            "Name": "Congo reports another case of ebola",
            "Date": "June 2020",
            "Description": ""
        },
        {
            "Name": "Locusts swarm East Africa",
            "Date": "June 2020",
            "Description": ""
        },
        {
            "Name": "Russian Power Plant leaks 20000 tons of oil into Arctic Circle",
            "Date": "June 4 2020",
            "Description": ":goodjob:"
        },
        {
            "Name": "Thailand Protests",
            "Date": "July 2020",
            "Description": ""
        },
        {
            "Name": "Twitter Hacked, Bitcoin Scam",
            "Date": "July 15 2020",
            "Description": ""
        },
        {
            "Name": "California Wildfires",
            "Date": "8/1/2020",
            "Description": "Thanks, lightning and gender reveals!"
        },
        {
            "Name": "Olympics cancelled",
            "Date": "August 2020",
            "Description": "because of that one virus"
        },
        {
            "Name": "Beirut Explosion",
            "Date": "August 4 2020",
            "Description": "haha go-BOOM"
        },
        {
            "Name": "Chadwick Boseman passes away",
            "Date": "August 28 2020",
            "Description": ""
        },
        {
            "Name": "RBG dies",
            "Date": "September 18 2020",
            "Description": ""
        },
        {
            "Name": "Global COVID19 deaths hit 1M",
            "Date": "September 29 2020",
            "Description": ""
        },
        {
            "Name": "Trump contracts COVID 19",
            "Date": "October 2020",
            "Description": "I totally didn't see this coming for a year now."
        },
        {
            "Name": "Indonesia floods",
            "Date": "October 7 2020",
            "Description": ""
        },
        {
            "Name": "Murder hornets discovered in the US",
            "Date": "10/23/2020",
            "Description": "Excellent"
        },
        {
            "Name": "2020 Aegean Sea Earthquake",
            "Date": "October 30 2020",
            "Description": ""
        },
        {
            "Name": "Alex Trebek dies",
            "Date": "November 8 2020",
            "Description": ""
        },
        {
            "Name": "Tiktok banned, but not really",
            "Date": "November 12 2020",
            "Description": "Oracle purchases TikTok operations in the US"
        },
        {
            "Name": "Post-Election, Trump touts massive electron fraud",
            "Date": "December 2020",
            "Description": "ebic"
        },
        {
            "Name": "New Strains of COVID19",
            "Date": "December2020",
            "Description": ""
        }
    ]

    testdata2020 = loadJSON("./../data/2020 Sucks - Global.json");

    // I hate github pages :/
}

function setup() {

    console.log(testdata2020)

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

        console.log()
    }

    randChoice(arr) {
        // return arr[Math.floor(Math.random() * Math.max(...Object.keys(data2020).map(a => parseInt(a))))];
        return arr[Math.floor(arr.length * Math.random())]
    }

    randStream(x) {
        return new Stream(x, this.randChoice(data2020).Name, Math.floor(1 + 4 * Math.random()), Math.floor(30 + 40 * Math.random()), 200 * Math.random())
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
