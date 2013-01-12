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
		
		trans = trans.replace(/A1/g, "Ā");
		trans = trans.replace(/A2/g, "Á");
		trans = trans.replace(/A3/g, "Ǎ");
		trans = trans.replace(/A4/g, "À");
		
		trans = trans.replace(/E1/g, "Ē");
		trans = trans.replace(/E2/g, "É");
		trans = trans.replace(/E3/g, "Ě");
		trans = trans.replace(/E4/g, "È");
		
		trans = trans.replace(/I1/g, "Ī");
		trans = trans.replace(/I2/g, "Í");
		trans = trans.replace(/I3/g, "Ǐ");
		trans = trans.replace(/I4/g, "Ì");
		
		trans = trans.replace(/O1/g, "Ō");
		trans = trans.replace(/O2/g, "Ó");
		trans = trans.replace(/O3/g, "Ǒ");
		trans = trans.replace(/O4/g, "Ò");

		trans = trans.replace(/U1/g, "Ū");
		trans = trans.replace(/U2/g, "Ú");
		trans = trans.replace(/U3/g, "Ǔ");
		trans = trans.replace(/U4/g, "Ù");

		trans = trans.replace(/Ü1/g, "Ǖ");
		trans = trans.replace(/Ü2/g, "Ǘ");
		trans = trans.replace(/Ü3/g, "Ǚ");
		trans = trans.replace(/Ü4/g, "Ǜ");
		
		trans = trans.replace(/{}/g, "");

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