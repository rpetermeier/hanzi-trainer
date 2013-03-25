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
var HanziViewModel = function() {
	this.convertToHanzi = function(dataFromJson) {
		var data = [];
		if (dataFromJson != null) {
			for (var ii = 0; ii < dataFromJson.length; ++ii) {
				data[ii] = new Hanzi(dataFromJson[ii].pinyin, dataFromJson[ii].hanzi, dataFromJson[ii].german, dataFromJson[ii].timestamp);
			}
		}
		return data;
	};
	
	this.initializeHanzi = function() {
		var dataFromJson = $.jStorage.get("list-of-hanzi");
		var data = this.convertToHanzi(dataFromJson);
		return data;
	};

    this.numberOfHanziToGenerate = ko.observable($.jStorage.get("number-of-hanzi-to-generate", 13));
	this.showSolution = ko.observable($.jStorage.get("show-solution", false));

	this.currentData = ko.observableArray(this.initializeHanzi());
	this.dataFromServerIsUsed = ko.observable($.jStorage.get("data-from-server-is-used", true));
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

	this.showDateOfNewestHanzi = ko.computed(function() {
		return this.dataFromServerIsUsed() && this.totalNumberOfHanzi() > 0;
	}, this);
	
	this.setDataFromServerIsUsed = function(dataFromServerIsUsed) {
		this.dataFromServerIsUsed(dataFromServerIsUsed);
		$.jStorage.set("data-from-server-is-used", dataFromServerIsUsed);
	};

	this.formatDate = function(date) {
		if (date != null) {
			var month = date.getMonth() + 1;
			month =  month < 10 ? ("0" + month) : ("" + month);
			var dayOfMonth = date.getDate() < 10 ? ("0" + date.getDate()) : ("" + date.getDate());
			return dayOfMonth + "." + month + "." + date.getFullYear();
		} else {
			return "";
		}
	};
		
	this.dateOfNewestHanzi = function() {
		var date = null;
		for (var ii = 0; ii < this.currentData().length; ++ii) {
			if (date != null) {
				var hanziDate = new Date(this.currentData()[ii].timestamp);
				if (hanziDate.getTime() > date.getTime()) {
					date = hanziDate;
				}
			} else {
				var hanziDate = new Date(this.currentData()[ii].timestamp);
				date = hanziDate;
			}
		}
		return date;
	};
	
	this.dateOfNewestHanziFormatted = ko.computed(function() {
		var date = this.dateOfNewestHanzi();
		return this.formatDate(date);
	}, this);
	
	this.showReloadHintIfNecessary = function() {
		if (this.dataFromServerIsUsed()) {
			var dateOfNewestHanzi = this.dateOfNewestHanzi();
			var now = new Date();
			if (dateOfNewestHanzi != null && now.getTime() - dateOfNewestHanzi.getTime() > 1000 * 60 * 60 * 24 * 7) {
				vm.alert("Hinweis", "Das neueste Hanzi ist vom " + this.formatDate(dateOfNewestHanzi) + 
				".\n\nLade die Seite neu (z.B. mit F5) und verwende dann " +
				"\"Lade vom Server\" unter \"Import/Export\" um " +
				"die neuesten Daten zu verwenden.");
			}
		}
	};
	
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
	
	this.rebuildFromLocalStorage = function() {
		this.currentData.removeAll();
		var hanzi = this.initializeHanzi();
		for (var ii = 0; ii < hanzi.length; ++ii) {
			this.currentData.push(hanzi[ii]);
		}
	};
	
	this.rebuildFromServerJson = function(dataFromJson) {
		this.setDataFromServerIsUsed(true);
		this.currentData.removeAll();
		var dataAsHanzi = this.convertToHanzi(dataFromJson);
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
					return hanzi.hanziIfVisible(vm.showSolution._latestValue);
				}
			}
        ],
        pageSize: 15
    });
	
	this.refreshGrid = function() {
		var temp = this.currentSelection._latestValue.slice();
		if (temp.length > 0) {
			this.currentSelection.removeAll();
			for (var ii = 0; ii < temp.length; ++ii) {
				this.currentSelection.push(temp[ii]);
			}
		}
	};
	
	this.hint = ko.computed(function() {
		if (this.currentData().length == 0) {
			return "Zum Laden von Hanzi gehe auf den Reiter \"Import/Export über Excel\" und wähle dort entweder "
				+ "\"Lade vom Server\" oder kopiere den Inhalt einer eigenen Datei in das Textfeld "
				+ "und wähle \"Importiere\".";
		} else {
			return "";
		}
	}, this);
	
	this.importJsonData = function() {
		try {
			var ta = $("#ta-import-export");
			var json = ta.val();
			var dataFromJson = JSON.parse(json);
			var dataAsHanzi = this.convertToHanzi(dataFromJson);
			$.jStorage.set("list-of-hanzi", dataAsHanzi);
			vm.rebuildFromLocalStorage();
			this.alert("Import erfolgreich", "Der Import war erfolgreich.<br/>Das Vokabular umfasst jetzt " + this.totalNumberOfHanzi() + " Hanzi.");
			ta.val("");
			this.setDataFromServerIsUsed(false);
		} catch (exc) {
			this.alert("Fehler", "Etwas ist schiefgegangen: " + exc);
		}
	};
	
	this.exportJsonData = function() {
		var hanzi = this.currentData._latestValue;
		if (hanzi != null) {
			var exportText = JSON.stringify(hanzi);
			var ta = $("#ta-import-export");
			ta.val(exportText);
		} else {
			ta.val("");
		}
	};
	
	this.loadJsonDataFromServer = function() {
		$.getJSON('json/hanzi/2013-03-25.json', function(jsonData) {
			vm.rebuildFromServerJson(jsonData);
			vm.alert("Laden war erfolgreich", "Das Laden der Hanzi vom Server war erfolgreich.<br/>Das Vokabular umfasst jetzt " + vm.totalNumberOfHanzi() + " Hanzi.");
		});
	};

	this.exportToExcel = function() {
		var data = this.currentData._latestValue.slice();
		data.sort(function(a, b) {
			return a.pinyin.localeCompare(b.pinyin);
		});
		var output = "";
		for (var ii = 0; ii < data.length; ++ii) {
			output += (data[ii].pinyin + "\t" + data[ii].german + "\t" + data[ii].hanzi);
			if (ii < data.length - 1) output += "\n";
		}
		$("#ta-import-export-excel").val(output);
	};

	this.importFromExcel = function() {
		try {
			var ta = $("#ta-import-export-excel");
			var tabSeparatedData = ta.val();
			var rows = tabSeparatedData.split(/\r\n|\n/);
			var hanzi = new Array();
			var counter = 0;
			for (var ii = 0; ii < rows.length; ++ii) {
				var row = rows[ii].split('\t');
				if (row.length == 3) {
					hanzi.push(new Hanzi(row[0], row[2], row[1]));
				}
			}
			this.currentData.removeAll();
			for (var ii = 0; ii < hanzi.length; ++ii) {
				if (hanzi[ii] != null) {
					this.currentData.push(hanzi[ii]);
				}
			}
			$.jStorage.set("list-of-hanzi", hanzi);
			ta.val("");
			this.setDataFromServerIsUsed(false);
			this.alert("Import erfolgreich", "Der Import war erfolgreich.<br/>Das Vokabular umfasst jetzt " + this.totalNumberOfHanzi() + " Hanzi.");
		} catch (exc) {
			this.alert("Fehler", "Etwas ist schiefgegangen: " + exc);
		}
	};
	
	this.alert = function(title, message) {
		var msg = $("#hanzi-trainer-alert-replacement-message");
		msg.empty();
		msg.append(message);
		var dlg = $("#hanzi-trainer-alert-replacement");
		dlg.dialog("option", "title", title);
		dlg.dialog("open");
	};
};

function init() {
	$("#tabs").tabs();
	$("button").button();
	// Binding currently does not work correctly with a spinner;
	// probably some custom code is needed for this to work
	// $("#number-of-hanzi-to-generate").spinner();
	$("#button-export").click(function() { vm.exportJsonData(); } );
	$("#button-import").click(function() { vm.importJsonData(); });
	$("#button-clear-import-export").click(function() {
		var ta = $("#ta-import-export");
		ta.val("");
	});
	$("#button-load-from-server").click(function() { vm.loadJsonDataFromServer(); } );
	$("#button-load-from-server-excel").click(function() { vm.loadJsonDataFromServer(); } );
	$("#button-export-excel").click(function() {
		vm.exportToExcel();
	});
	$("#button-import-excel").click(function() {
		vm.importFromExcel();
	});
	$("#button-clear-import-export-excel").click(function() {
		var ta = $("#ta-import-export-excel");
		ta.val("");
	});
	vm = new HanziViewModel();
		
	ko.applyBindings(vm);
	vm.showSolution.subscribe(function(newValue) {
		$.jStorage.set("show-solution", newValue);
		vm.refreshGrid();
	});
	vm.numberOfHanziToGenerate.subscribe(function(newValue) {
		$.jStorage.set("number-of-hanzi-to-generate", newValue);
	});
	
	$("#hanzi-trainer-alert-replacement").dialog({
		modal: true,
		autoOpen: false,
		buttons: {
			Ok: function() {
				$(this).dialog("close");
			}
		},
		resizable: false
	});
	
	vm.showReloadHintIfNecessary();
}