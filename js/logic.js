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
    this.numberOfHanzi = ko.observable(2);
	this.showSolution = ko.observable(false);

	this.currentData = ko.observableArray(initializeHanzi());
	this.currentSelection = ko.observableArray([]);
	
	// This function is currently not needed
	this.generatedSelection = ko.computed(function() {
		// It is important to call the function currentSelection() here instead of accessing the property currentSelection
		return this.currentSelection();
		}, this);
	
	this.generateNewSelection = function() {
		// It is important to access the property this.currentSelection here, not the function this.currentSelection()
		this.currentSelection.removeAll();
		var data = this.currentData._latestValue;
		if (data.length > 0) {
			var index = Math.floor(Math.random() * data.length);
			this.currentSelection.push(data[index]);
		}
	};
	
	this.removeHanziElement = function(elem) {
		// alert(elem);
		$(elem).remove();
	};
	
	this.addNewHanziElement = function(elem) {
		// alert(elem);
	};
	
	this.addHanzi = function(hanzi) {
		this.currentData.push(hanzi);
		// $.jStorage.set("list-of-hanzi", this.currentData._latestValue);
	}
};

function init() {
	$("#tabs").tabs();
	$("button").button();
	// Binding currently does not work correctly with a spinner;
	// probably some custom code is needed for this to work
	// $("#number-of-hanzi").spinner();
	vm = new HanziViewModel();
	ko.applyBindings(vm);
}
