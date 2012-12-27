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

function HanziViewModel() {
    this.number = ko.observable(6);
	this.showSolution = ko.observable(false);
	this.initialData = [];
	this.generateData = ko.computed(function() {
		return this.initialData;
	});
};

function init() {
	$("#tabs").tabs();
	ko.applyBindings(new HanziViewModel());
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