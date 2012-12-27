function Hanzi(pinyin, hanzi) {
	this.pinyin = pinyin;
	this.hanzi = hanzi;
	this.timestamp = new Date();
}

Hanzi.prototype.toString = function() {
	return this.pinyin + ": " + this.hanzi;
}

var initialData = [];
var generatedData = initializeHanzi();

function emptyData() {
	return [];
}

function initializeHanzi() {
	var initialData = {
		new Hanzi("nǐ", "你"),
		new Hanzi("hǎo", "好"),
		new Hanzi("ma", "吗"),
		new Hanzi("tiān", "天"),
		new Hanzi("qì", "气")
	};
	
	return initialData;
}