function init() {
	$("#tabs").tabs();
	$("button").button();
	
	$("#button-transform").click(function() {
		var input = $("#ta-macro").val();
		var trans = input.replace(/a1/g, "ā");
		trans = trans.replace(/a2/g, "á");
		trans = trans.replace(/a3/g, "ǎ");
		trans = trans.replace(/a4/g, "à");
		
		trans = trans.replace(/e1/g, "ē");
		trans = trans.replace(/e2/g, "é");
		trans = trans.replace(/e3/g, "ě");
		trans = trans.replace(/e4/g, "è");
		
		trans = trans.replace(/i1/g, "ī");
		trans = trans.replace(/i2/g, "í");
		trans = trans.replace(/i3/g, "ǐ");
		trans = trans.replace(/i4/g, "ì");
		
		trans = trans.replace(/o1/g, "ō");
		trans = trans.replace(/o2/g, "ó");
		trans = trans.replace(/o3/g, "ǒ");
		trans = trans.replace(/o4/g, "ò");

		trans = trans.replace(/u1/g, "ū");
		trans = trans.replace(/u2/g, "ú");
		trans = trans.replace(/u3/g, "ǔ");
		trans = trans.replace(/u4/g, "ù");

		trans = trans.replace(/ü1/g, "ǖ");
		trans = trans.replace(/ü2/g, "ǘ");
		trans = trans.replace(/ü3/g, "ǚ");
		trans = trans.replace(/ü4/g, "ǜ");
		
		$("#ta-pinyin").val(trans);
	});
	
	$("#button-empty").click(function() {
		$("#ta-macro").val("");
		$("#ta-pinyin").val("");
	});
	
	$("#ta-pinyin").attr("readonly", "readonly");

	$("#pinyin-assistant-alert-replacement").dialog({
		modal: true,
		autoOpen: false,
		buttons: {
			Ok: function() {
				$(this).dialog("close");
			}
		},
		resizable: false
	});
}