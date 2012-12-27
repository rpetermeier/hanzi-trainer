var vm;

function Hanzi(pinyin, hanzi) {
	this.pinyin = pinyin;
	this.hanzi = hanzi;
	this.timestamp = new Date();
}

Hanzi.prototype.representation = function() {
	return this.pinyin + ": " + this.hanzi;
}

function initializeHanzi() {
	// Retrieve static data
	var data = [
		new Hanzi("nǐ", "你"),
		new Hanzi("hǎo", "好"),
		new Hanzi("ma", "吗"),
		new Hanzi("tiān", "天"),
		new Hanzi("qì", "气")
	];
	
	// Retrieve from JSON file
	// alert(JSON.stringify(data));
	// $.getJSON('json/hanzi.json', function(jsonData) {
	//	
	// });
	
	// Retrieve from local storage
	var storedData = $.jStorage.get("list-of-hanzi");
	
	return data;
}

var HanziViewModel = function() {
    this.number = ko.observable(5);
	this.showSolution = ko.observable(false);

	this.currentData = ko.observableArray(initializeHanzi());
	this.generatedData = ko.computed(function() {
		// It is important to call the function data() here instead of accessing the property data
		return this.currentData();
	}, this);
	
	this.generateNewData = function() {
		// this.currentData().removeAll();
		// It is important to access the propery this.currentData here, not the function this.currentData()
		this.currentData.push(new Hanzi("tiān", "天"));
	};
	
	this.removeHanziElement = function(elem) {
		alert(elem);
	};
	
	this.addNewHanziElement = function(elem) {
		alert(elem);
	};
	
	this.addHanzi = function(hanzi) {
		this.currentData.push(hanzi);
		// $.jStorage.set("list-of-hanzi", this.currentData._latestValue);
	}
};

function init() {
	$("#tabs").tabs();
	vm = new HanziViewModel();
	ko.applyBindings(vm);
}
