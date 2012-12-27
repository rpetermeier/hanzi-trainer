var vm;

function Hanzi(pinyin, hanzi, german, timestamp) {
	this.pinyin = pinyin;
	this.hanzi = hanzi;
	if (german != null) {
		this.german = german;
	} else {
		this.german = "";
	}
	if (timestamp == null) {
		this.timestamp = new Date();
	} else {
		this.timestamp = timestamp;
	}
}

Hanzi.prototype.representation = function(showHanzi) {
	if (showHanzi) {
		return this.pinyin + " (" + this.german + ")" + ": " + this.hanzi;
	} else {
		return this.pinyin + " (" + this.german + ")";
	}
}

function convertToHanzi(dataFromJson) {
	var data = [];
	if (dataFromJson != null) {
		for (var ii = 0; ii < dataFromJson.length; ++ii) {
			data[ii] = new Hanzi(dataFromJson[ii].pinyin, dataFromJson[ii].hanzi, dataFromJson[ii].german, dataFromJson[ii].timestamp);
		}
	}
	return data;
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
	var dataFromJson = $.jStorage.get("list-of-hanzi");
	data = convertToHanzi(dataFromJson);
	return data;
}

var HanziViewModel = function() {
    this.numberOfHanzi = ko.observable(5);
	this.showSolution = false;

	this.currentData = ko.observableArray(initializeHanzi());
	this.currentSelection = ko.observableArray([]);
	
	// This function is currently not needed and not used
	this.generatedSelection = ko.computed(function() {
		// It is important to call the function currentSelection() here instead of accessing the property currentSelection
		return this.currentSelection();
		}, this);
	
	this.generateNewSelection = function() {
		// It is important to access the property this.currentSelection here, not the function this.currentSelection()
		this.currentSelection.removeAll();
		var data = this.currentData._latestValue;
		if (data.length > 0) {
			var usedIndexes = [];
			while (usedIndexes.length < Math.min(data.length, this.numberOfHanzi._latestValue)) {
				var index = Math.floor(Math.random() * data.length);
				if ($.inArray(index, usedIndexes) == -1) {
					this.currentSelection.push(data[index]);
					usedIndexes[usedIndexes.length] = index;
				}
			}
		}
	};
	
	this.removeHanziElement = function(elem) {
		$(elem).remove();
	};
	
	this.addNewHanziElement = function(elem) {
		// alert(elem);
	};
	
	this.addHanzi = function(hanzi) {
		this.currentData.push(hanzi);
		// $.jStorage.set("list-of-hanzi", this.currentData._latestValue);
	};
	
	this.rebuildFromLocalStorage = function() {
		this.currentData.removeAll();
		var hanzi = initializeHanzi();
		for (var ii = 0; ii < hanzi.length; ++ii) {
			this.currentData.push(hanzi[ii]);
		}
	}
};

function importJsonData() {
	var ta = $("#ta-import-export");
	var json = ta.val();
	var dataFromJson = JSON.parse(json);
	var dataAsHanzi = convertToHanzi(dataFromJson);
	$.jStorage.set("list-of-hanzi", dataAsHanzi);
	vm.rebuildFromLocalStorage();
}

function init() {
	$("#tabs").tabs();
	$("button").button();
	// Binding currently does not work correctly with a spinner;
	// probably some custom code is needed for this to work
	// $("#number-of-hanzi").spinner();
	$("#button-export").click(function() {
		var exportText = JSON.stringify($.jStorage.get("list-of-hanzi"));
		var ta = $("#ta-import-export");
		ta.val(exportText);
	});
	$("#button-import").click(importJsonData);
	vm = new HanziViewModel();
	ko.applyBindings(vm);
}