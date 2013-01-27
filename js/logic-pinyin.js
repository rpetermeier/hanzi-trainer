vm = new ViewModel();

function init() {
	vm.init();
}

function ViewModel() {
}

ViewModel.prototype.init = function() {
	$("#tabs").tabs();
	$("button").button();
	
	$(".macro-input-info").tooltip({
		items: "label, img",
		content: 'In dieses Textfeld wird Text mit sogenannten Makros eingegeben, der dann über den Button "Transformiere!" '
			+ 'in Pinyin umgewandelt wird.<br/><br/>'
			+ 'Ein "Makro" ist dabei einfach ein Vokal, gefolgt von der Nummer des Tones, den man '
			+ 'eingeben möchte. a3 erzeugt also ǎ, i1 erzeugt ī usw.<br/><br/>'
			+ 'Tipp: Der Button "Vorlage" zeigt wie eine Eingabe mit Makros aussehen kann.',
		position: { my: "left+15 top", at: "right top" }
	});
	$("#lbl-pinyin").tooltip({
		items: "label",
		content: 'Ein Klick in dieses Textfeld selektiert den gesamten Inhalt, der dann mit Strg-C oder per Kontext-Menü (Rechts-Klick) kopiert werden kann.',
		position: { my: "left+15 center", at: "right top" }
	});
	$("#button-template").tooltip({
		items: "button",
		content: 'Hier klicken, um das obere Textfeld mit einem kleinen Beispieltext vorzubelegen.',
		position: { my: "left+5 top+20", at: "right top" }
	});
	$("#button-empty").tooltip({
		items: "button",
		content: 'Hier klicken, um alles wegzuräumen.',
		position: { my: "left+5 top+20", at: "right top" }
	});
	$("#button-transform").tooltip({
		items: "button",
		content: 'Hier klicken, um die Eingabe aus dem oberen Textfeld zu transformieren.',
		position: { my: "left+5 top+20", at: "right top" }
	});
	
	$("#button-transform").click(function() {
		vm.transformInput();
	});
	
	$("#button-empty").click(function() {
		$("#ta-macro").val("");
		$("#ta-pinyin").val("");
	});
	
	$("#button-template").click(function() {
		$("#ta-macro").val(vm.template());
		$("#ta-pinyin").val("");
	});
	
	$("#ta-pinyin").attr("readonly", "readonly");
	this.markAllTextOnFocus();

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

/* Mark all text in the output text area when it gets focus.
   A little trick is used to make this work with WebKit: a timer
   is necessary because apparently WebKit fires certain events 
   too early. Source:
   http://stackoverflow.com/questions/6201278/how-to-select-all-text-in-textarea-on-focus-in-safari
*/
ViewModel.prototype.markAllTextOnFocus = function() {
	$('#ta-pinyin').focus(function() {
		var $this = $(this);

		$this.select();

		window.setTimeout(function() {
			$this.select();
		}, 1);

		// Work around WebKit's little problem
		$this.mouseup(function() {
			// Prevent further mouseup intervention
			$this.unbind("mouseup");
			return false;
		});
	});
}

ViewModel.prototype.transformInput = function() {
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
}

ViewModel.prototype.template = function() {
	var tpl = "";
	tpl += "Ni3 ha3o!\n\n";
	tpl += 'Tia1nqi4 he3n le3ng. Wo3 yo4ng ma3i do1ngxi1.\n\n';
	tpl += "Shuo1 da4o Ca2o Ca1o, Ca2o Ca1o jiu4 da4o.\n\n";
	tpl += "Za2nmen mi2ngtia1n jia4n, ha3o ma?";
	
	return tpl;
}