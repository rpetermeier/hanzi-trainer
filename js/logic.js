var hanziViewModel = {
    number: 5,
	showHanzi: true
};

function init() {
	$( "#tabs" ).tabs();
	ko.applyBindings(hanziViewModel);
	initFlexigrid();
}

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