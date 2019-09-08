var words = [
    { word: 'hand hygiene', shuffled: shuffle('hand hygiene'), imagePrefix: "HH" },
    { word: 'patient safety', shuffled: shuffle('patient safety'), imagePrefix: "PS" },
    { word: 'risk management', shuffled: shuffle('risk management'), imagePrefix: "RM" },
];


var app = new Vue({
    el: '#app',
    data: {
        wordIndex: 0,
        status: 2,
        actual: words[0].word,
        shuffled: words[0].shuffled,
        imagePrefix: 'HH',
        answer: ''
    },
    computed: {

    },
    methods: {
        checkAnswer: function () {
            console.log('event fired!', this.answer.toLowerCase(), this.actual.toLowerCase(), this.answer.length, this.actual.length);

            if (this.answer.toLowerCase() == this.actual.toLowerCase()) {
                this.status = 1;
                console.log('cond 1 met');
                return;
            }
            else if (this.answer.length >= this.actual.length) {
                this.status = 0;
                console.log('cond 2 met');
            }
            else {
                this.status = 2;
                console.log('cond 3 met');
            }
        },
        getNextWord: function () {
//            this.wordIndex = Math.floor(Math.random() * (words.length - 1) + 1);
            this.wordIndex++;
            if(this.wordIndex >= words.length)
                this.wordIndex = 0; //OR GAME OVER!
            console.log('Word Index: ', this.wordIndex)
            this.actual = words[this.wordIndex].word;
            this.shuffled = words[this.wordIndex].shuffled;
            this.imagePrefix = words[this.wordIndex].imagePrefix;
            this.$refs.txtAnswer.focus();
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

