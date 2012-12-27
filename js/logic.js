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

Hanzi.prototype.hanziIfVisible = function(showHanzi) {
	if (showHanzi) {
		return this.hanzi;
	} else {
		return "";
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
    this.numberOfHanziToGenerate = ko.observable(13);
	this.showSolution = false;

	this.currentData = ko.observableArray(initializeHanzi());
	this.currentSelection = ko.observableArray([]);
	
	// This function is currently not needed and not used
	this.generatedSelection = ko.computed(function() {
		// It is important to call the function currentSelection() here instead of accessing the property currentSelection
		return this.currentSelection();
		}, this);

	this.totalNumberOfHanzi = ko.computed(function() {
			// It is important to call the function currentData() here instead of accessing the property currentData
			var number = this.currentData().length;
			return number;
		}, this);
	
	this.generateNewSelection = function() {
		// It is important to access the property this.currentData here, not the function this.currentData()
		this.currentSelection.removeAll();
		var data = this.currentData._latestValue;
		if (data.length > 0) {
			var usedIndexes = [];
			while (usedIndexes.length < Math.min(data.length, this.numberOfHanziToGenerate._latestValue)) {
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
	};
	
	this.rebuildFromJson = function(dataFromJson) {
		this.currentData.removeAll();
		var dataAsHanzi = convertToHanzi(dataFromJson);
		for (var ii = 0; ii < dataAsHanzi.length; ++ii) {
			this.currentData.push(dataAsHanzi[ii]);
		}
		$.jStorage.set("list-of-hanzi", dataAsHanzi);
	};
	
	this.gridViewModel = new ko.simpleGrid.viewModel({
        data: this.currentSelection,
        columns: [
            { headerText: "Pinyin", rowText: "pinyin" },
            { headerText: "Deutsch", rowText: "german" },
            { headerText: "Hanzi", rowText: function (hanzi) {
					return hanzi.hanziIfVisible(vm.showSolution);
				}
			}
        ],
        pageSize: 10
    });
};

function importJsonData() {
	try {
		var ta = $("#ta-import-export");
		var json = ta.val();
		var dataFromJson = JSON.parse(json);
		var dataAsHanzi = convertToHanzi(dataFromJson);
		$.jStorage.set("list-of-hanzi", dataAsHanzi);
		vm.rebuildFromLocalStorage();
		alert("Der Import war erfolgreich. Das Vokabular umfasst jetzt " + vm.totalNumberOfHanzi() + " Hanzi.");
		ta.val("");
	} catch (exc) {
		alert("Etwas ist schiefgegangen: " + exc);
	}
}

function loadJsonDataFromServer() {
	$.getJSON('json/hanzi.json', function(jsonData) {
		vm.rebuildFromJson(jsonData);
		alert("Das Laden der Hanzi aus der Datei auf dem Server war erfolgreich.\nDas Vokabular umfasst jetzt " + vm.totalNumberOfHanzi() + " Hanzi.");
	});
}

function init() {
	$("#tabs").tabs();
	$("button").button();
	// Binding currently does not work correctly with a spinner;
	// probably some custom code is needed for this to work
	// $("#number-of-hanzi-to-generate").spinner();
	$("#button-export").click(function() {
		var exportText = JSON.stringify($.jStorage.get("list-of-hanzi"));
		var ta = $("#ta-import-export");
		ta.val(exportText);
	});
	$("#button-import").click(importJsonData);
	$("#button-clear-import-export").click(function() {
		var ta = $("#ta-import-export");
		ta.val("");
	});
	$("#button-load-from-server").click(loadJsonDataFromServer);
	vm = new HanziViewModel();
	ko.applyBindings(vm);
}