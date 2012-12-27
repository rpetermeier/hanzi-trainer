var vm;

function Hanzi(pinyin, hanzi, timestamp) {
	this.pinyin = pinyin;
	this.hanzi = hanzi;
	if (timestamp == null) {
		this.timestamp = new Date();
	} else {
		this.timestamp = timestamp;
	}
}

Hanzi.prototype.representation = function() {
	return this.pinyin + ": " + this.hanzi;
}

function initializeHanzi() {
	var data;
	// alert(JSON.stringify(data));
	// Retrieve static data
	/*data = [
		new Hanzi("nǐ", "你"),
		new Hanzi("hǎo", "好"),
		new Hanzi("ma", "吗"),
		new Hanzi("tiān", "天"),
		new Hanzi("qì", "气")
	];*/
	
	// Retrieve from JSON file
	// $.getJSON('json/hanzi.json', function(jsonData) {
	//	
	// });
	
	// Retrieve from local storage
	// var storedData = $.jStorage.get("list-of-hanzi");
	// data = storedData;
	// $.jStorage.set("list-of-hanzi", data);
	var localdata = $.jStorage.get("list-of-hanzi");
	data = [];
	if (localdata != null) {
		for (var ii = 0; ii < localdata.length; ++ii) {
			data[ii] = new Hanzi(localdata[ii].pinyin, localdata[ii].hanzi, localdata[ii].timestamp);
		}
	}
	return data;
}

var HanziViewModel = function() {
    this.number = ko.observable(5);
	this.showSolution = ko.observable(false);

	this.currentData = ko.observableArray(initializeHanzi());
	this.generatedData = ko.computed(function() {
		// It is important to call the function currentData() here instead of accessing the property data
		return this.currentData();
	}, this);
	
	this.generateNewData = function() {
		// this.currentData().removeAll();
		// It is important to access the property this.currentData here, not the function this.currentData()
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
