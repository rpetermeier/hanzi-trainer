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
	var data = [
		new Hanzi("nǐ", "你"),
		new Hanzi("hǎo", "好"),
		new Hanzi("ma", "吗"),
		new Hanzi("tiān", "天"),
		new Hanzi("qì", "气")
	];
	
	return data;
}

var HanziViewModel = function() {
    this.number = ko.observable(5);
	this.showSolution = ko.observable(false);
	this.currentData = ko.observableArray(initializeHanzi());
	// this.currentData = ko.observableArray([]);
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
};

function init() {
	$("#tabs").tabs();
	vm = new HanziViewModel();
	// Here's a custom Knockout binding that makes elements shown/hidden via jQuery's fadeIn()/fadeOut() methods
	// Could be stored in a separate utility library
	ko.bindingHandlers.fadeVisible = {
		init: function(element, valueAccessor) {
			// Initially set the element to be instantly visible/hidden depending on the value
			var value = valueAccessor();
			$(element).toggle(ko.utils.unwrapObservable(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
		},
		update: function(element, valueAccessor) {
			// Whenever the value subsequently changes, slowly fade the element in or out
			var value = valueAccessor();
			ko.utils.unwrapObservable(value) ? $(element).fadeIn() : $(element).fadeOut();
		}
	};
	ko.applyBindings(vm);
	// initFlexigrid();
}

/*
function initFlexigrid() {
	$("#flex1").flexigrid({
		dataType: 'json',
		colModel : [
					{display: 'Pinyin', name : 'pinyin', width : 200, sortable : true, align: 'left'},
					{display: 'Hanzi', name : 'hanzi', width : 200, sortable : true, align: 'left'}
					],
			searchitems : [
					{display: 'Pinyin', name : 'pinyin'},
					{display: 'Hanzi', name : 'hanzi', isdefault: true}
					],
			sortname: "pinyin",
			sortorder: "asc",
			usepager: true,
			title: 'Hanzi',
			useRp: true,
			rp: 15,
			showTableToggleBtn: true,
			width: 700,
			height: 200
	});

	$.getJSON('json/hanzi.json', function(jsonData) {
		var fg = $("#flex1");
		fg.flexAddData(jsonData);
	});
}
*/
