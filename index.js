var words = [
    { word: 'hand hygiene', shuffled: shuffle('hand hygiene'), imagePrefix: "HH" },
    { word: 'patient safety', shuffled: shuffle('patient safety'), imagePrefix: "PS" },
    { word: 'patient centered care', shuffled: shuffle('patient centered care'), imagePrefix: "PCC" },
    { word: 'disclosure', shuffled: shuffle('disclosure'), imagePrefix: "DS" },
    { word: 'Medication Reconciliation', shuffled: shuffle('Medication Reconciliation'), imagePrefix: "MR" },
    { word: 'patient identification', shuffled: shuffle('patient identification'), imagePrefix: "PI" }
    // { word: '', shuffled: shuffle(''), imagePrefix: "" },
    
];


var app = new Vue({
    el: '#app',
    data: {
        gameOn: 0,
        playerName: '',
        playerScore: 0,
        wordIndex: 0,
        status: 2,
        actual: words[0].word,
        shuffled: words[0].shuffled,
        imagePrefix: 'HH',
        answer: '',
        highestScores: [],
        time: '00:00:00.000',
        timeBegan: null,
        timeStopped: null,
        stoppedDuration: 0,
        started: null,
        running: false,
        playDuration: 0
    },
    computed: {

    },
    mounted() {
        this.highestScores = JSON.parse(localStorage.getItem("highestScores"));
        if (this.highestScores != null)
            this.highestScores = _.orderBy(this.highestScores, 'playerScore', 'desc');
    },
    methods: {
        checkAnswer: function () {
            //console.log('event fired!', this.answer.toLowerCase(), this.actual.toLowerCase(), this.answer.length, this.actual.length);

            if (this.answer.toLowerCase() == this.actual.toLowerCase()) {
                this.status = 1;
                // May be show some pop up and continue to next word!
                this.playerScore++;
                //$('.toast').toast({delay: 2000});
                $('.toast').toast('show');
                setTimeout(() => this.getNextWord(), 2000);

            }
            else if (this.answer.length >= this.actual.length) {
                this.status = 0;
            }
            else {
                this.status = 2;
            }
        },
        getNextWord: function () {
            //            this.wordIndex = Math.floor(Math.random() * (words.length - 1) + 1);
            this.answer = '';
            this.status = 2;
            this.wordIndex++;
            if (this.wordIndex >= words.length)
                this.endGame(); //GAME OVER! Different strategy for randomized progression
            console.log('Word Index: ', this.wordIndex)
            this.actual = words[this.wordIndex].word;
            this.shuffled = words[this.wordIndex].shuffled;
            this.imagePrefix = words[this.wordIndex].imagePrefix;
            this.$refs.txtAnswer.focus();
        },
        startGame: function () {
            this.gameOn = 1;
            this.$nextTick(() => this.$refs.txtAnswer.focus()) //sometimes the element is not directly available
            this.start();
        },
        endGame: function () {
            this.stop();
            this.wordIndex = 0;
            var existingScores = JSON.parse(localStorage.getItem("highestScores"));
            if (existingScores == null)
                existingScores = [];
            this.playerScore =  Math.floor((this.playerScore * 500) / this.playDuration);
            existingScores.push({ playerName: this.playerName, playerScore: this.playerScore});
            localStorage.setItem('highestScores', JSON.stringify(existingScores));

            this.highestScores = JSON.parse(localStorage.getItem("highestScores"));
            if (this.highestScores != null)
                this.highestScores = _.orderBy(this.highestScores, 'playerScore', 'desc');

            
            this.resetGame();
        },
        resetGame: function () {
            //Save playerName
            this.gameOn = 0;
            this.wordIndex = 0;
            this.playerName = '';
            this.answer = '';
            this.$nextTick(() => this.$refs.txtName.focus()) //sometimes the element is not directly available
            this.reset();
        },
        start: function () {
            if (this.running) return;

            if (this.timeBegan === null) {
                this.reset();
                this.timeBegan = new Date();
            }

            if (this.timeStopped !== null) {
                this.stoppedDuration += (new Date() - this.timeStopped);
            }

            this.started = setInterval(this.clockRunning, 10);
            this.running = true;
        },
        stop: function () {
            this.running = false;
            this.timeStopped = new Date();
            var dif = this.timeStopped.getTime() - this.timeBegan.getTime();

            var Seconds_from_T1_to_T2 = dif / 1000;
            var Seconds_Between_Dates = Math.abs(Seconds_from_T1_to_T2);
            this.playDuration = Seconds_Between_Dates;
            
            clearInterval(this.started);
        },
        reset: function () {
            this.running = false;
            clearInterval(this.started);
            this.stoppedDuration = 0;
            this.timeBegan = null;
            this.timeStopped = null;
            this.time = "00:00:00.000";
        },
        clockRunning: function () {
            var currentTime = new Date()
                , timeElapsed = new Date(currentTime - this.timeBegan - this.stoppedDuration)
                , hour = timeElapsed.getUTCHours()
                , min = timeElapsed.getUTCMinutes()
                , sec = timeElapsed.getUTCSeconds()
                , ms = timeElapsed.getUTCMilliseconds();

            this.time =
                this.zeroPrefix(hour, 2) + ":" +
                this.zeroPrefix(min, 2) + ":" +
                this.zeroPrefix(sec, 2) + "." +
                this.zeroPrefix(ms, 3);
        },
        zeroPrefix: function (num, digit) {
            var zero = '';
            for (var i = 0; i < digit; i++) {
                zero += '0';
            }
            return (zero + num).slice(-digit);
        }
    },
    directives: {
        focus: {
            // directive definition
            inserted: function (el) {
                el.focus()
            }
        }
    }
});



function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function shuffle(str) {
    const randomChars = shuffleArray([...str.replace(/\s+/g, '')]);
    let index = 0;
    return str.replace(/\S/g, () => randomChars[index++]);
}

