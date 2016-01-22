if (typeof lipsumjs == 'undefined')lipsumjs = {};

(function (parent) {

    parent.words = [
        "a", "ac", "accumsan", "adipiscing", "aenean", "aliqua", "aliquam", "aliquet", "amet", "ante",
        "arcu", "at", "auctor", "augue", "bibendum", "blandit", "commodo", "condimentum", "congue", "consectetur",
        "consequat", "convallis", "cras", "cum", "curabitur", "cursus", "dapibus", "diam", "dictum", "dictumst",
        "dignissim", "dis", "dolor", "dolore", "do", "donec", "dui", "duis", "egestas", "eget", "eiusmod", "eleifend",
        "elementum", "elit", "enim", "erat", "eros", "est", "et", "etiam", "eu", "euismod", "facilisi", "facilisis",
        "fames", "faucibus", "felis", "fermentum", "feugiat", "fringilla", "fusce", "gravida", "habitant", "habitasse",
        "hac", "hendrerit", "iaculis", "id", "imperdiet", "in", "incididunt", "integer", "interdum", "ipsum", "justo",
        "labore", "lacinia", "lacus", "laoreet", "lectus", "leo", "libero", "ligula", "lobortis", "lorem", "luctus",
        "maecenas", "magna", "magnis", "malesuada", "massa", "mattis", "mauris", "metus", "mi", "molestie", "mollis",
        "montes", "morbi", "mus", "nam", "nascetur", "natoque", "nec", "neque", "netus", "nibh", "nisi", "nisl", "non",
        "nulla", "nullam", "nunc", "odio", "orci", "ornare", "parturient", "pellentesque", "penatibus", "pharetra",
        "phasellus", "placerat", "platea", "porta", "porttitor", "posuere", "potenti", "praesent", "pretium", "proin",
        "pulvinar", "purus", "quam", "quis", "quisque", "rhoncus", "ridiculus", "risus", "rutrum", "sagittis", "sapien",
        "scelerisque", "sed", "sem", "semper", "senectus", "sit", "sociis", "sodales", "sollicitudin", "suscipit",
        "suspendisse", "tellus", "tempor", "tempus", "tincidunt", "tortor", "tristique", "turpis", "ullamcorper",
        "ultrices", "ultricies", "urna", "ut", "varius", "vehicula", "vel", "velit", "venenatis", "vestibulum", "vitae",
        "vivamus", "viverra", "volutpat", "vulputate"
    ];

    parent.canon = {
        indeces: [84, 73, 32, 146, 8, 19, 3, 43, 142, 34, 40, 153, 70, 163, 75, 48, 33, 87, 5],
        commaIndeces: [4, 7],
        build: function (indeces) {
            var words = [];
            for(var index in indeces){
                words.push(parent.words[indeces[index]]);
            }
            return words;
        },
        generate:function(){
            return parent.buildSentenceFromWords(this.build(this.indeces),this.commaIndeces);
        }
    };

    parent.generate = function (num_sentences, min_words, max_words, addFirstCanon) {

        if (typeof num_sentences == "undefined")num_sentences = 10;
        if (typeof min_words == "undefined")min_words = 3;
        if (typeof max_words == "undefined")max_words = 10;
        if (typeof addFirstCanon == "undefined")addFirstCanon = true;

        var sentences = [];

        if(addFirstCanon){
            sentences.push(parent.canon.generate());
            num_sentences-=1;
        }

        for (var sn = 0; sn < num_sentences; sn++) {
            var sentence = this.generateSentence(min_words, max_words);
            sentences.push(sentence);
        }
        return sentences.join(' ');
    };

    parent.generateParagraphs = function(num_paragraphs,paragraphTag){
        if(typeof num_paragraphs == 'undefined')num_paragraphs=6;
        if(typeof paragraphTag == 'undefined')paragraphTag='p';
        var html = '';
        for(var pi=0;pi<=num_paragraphs;pi++) {
            var num_sentences = Math.round(Math.random()*30+3);
            html += '<' + paragraphTag + '>' + parent.generate(num_sentences, 3, 10, pi == 0) + '</' + paragraphTag + ">\n";
        }
        return html;
    };

    parent.generateSentence = function (min_words, max_words, commas) {

        var words = this.getWords(min_words, max_words);
        if(commas==undefined)commas=this.getCommaIndexes(words.length);
        return this.buildSentenceFromWords(words,commas);

    };

    parent.getCommaIndexes = function (num_words) {
        var num_commas = Math.floor(num_words / 4);
        var commaIndexes = [];
        for(var ci=0;ci<num_commas;ci++){
            var index = Math.floor(Math.random()*(num_words-1));
            if(commaIndexes.indexOf(index)==-1)commaIndexes.push(index);
        }
        return commaIndexes;
    };

    parent.getWords = function (min_words, max_words, wordsbase) {

        if(typeof wordsbase == 'undefined')wordsbase = parent.words;
        var num_words = Math.floor(Math.random() * (max_words - min_words)) + min_words;
        var words = [];
        for (var wn = 0; wn < num_words; wn++) {
            var word = wordsbase[Math.floor(Math.random() * wordsbase.length)];
            words.push(word);
        }
        return words;
    };

    parent.buildSentenceFromWords = function(words,commas){
        if(typeof commas!='undefined')commas.forEach(function(index){words[index]+=',';});
        var sentence = words.join(' ') + ".";
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
        return sentence;
    };

})(lipsumjs);