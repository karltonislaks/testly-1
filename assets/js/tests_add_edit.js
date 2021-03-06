var current_type_id = 1;
var ylakoma = "'";
var jutum2rk = '"';

function addMultipleChoice() {
	var html = '<div class="answer-option"><input type="radio" name="mc.correct" value="<id>">&nbsp;<textarea name="mc.answer.<id>"></textarea></div>';
	var textareas_count = $('#multiple-choice-options textarea').length;
	html = html.replace(/<id>/g, textareas_count + 1);
	$('#multiple-choice-options').append(html);
	return false;
}
var i = 0;
var id = 'tekstikast_0';
function addMultipleResponse() {
	if ($('#' + id).val().length > 0) {
		i = i+1;
		id = 'tekstikast_'+i;
		$('#answer_options').append('<div><input type="checkbox" style="margin: 5px; margin-bottom: 10px"><textarea oninput="addMultipleResponse()" id="tekstikast_'+i+'"></textarea></div>');
	}
	return false;
}
function removeMultipleChoice() {
	if ($('#multiple-choice-options textarea').length > 1) {
		$('#multiple-choice-options .answer-option:last').remove();
	}
	return false;
}
function removeMultipleResponse() {
	if ($('#multiple-response-answer-option textarea').length > 1) {
		$('#multiple-response-answer-option .answer-option:last').remove();
	}
	return false;
}
function checkForm() {
	var elements = $('#question_type_id_' + current_type_id + 'input[type=checkbox]:not(.shuffle_answers), #question_type_id_' + current_type_id + 'input[type=radio]:not(#shuffle)');
	var textbox = $('#question_type_id_' + current_type_id + 'textarea');
	for (var i = 0; i < elements.length; i++) {
		if ($(elements[i]).attr('checked') && $.trim($(textbox[i]).val()) != "") {
			return true;
		}
	}
	alert("Palun märgi õige vastus");
	return false;
}
function save_test_changes() {
	$('#test_edit_form').submit();
}
function add_question() {
	$.ajax({
		type    : 'POST',
		dataType: 'html',
		data    : {
			question: {
				question_text   : $('#question_text').val(),
				question_type_id: $('#question_type_id').val()

			}
		},
		url     : BASE_URL + 'tests/add',
		complete: function (data) {
			console.log(data);
			if (!isNaN(data.responseText) && data.responseText > 0) {
				window.location = BASE_URL + 'tests/edit/' + data.responseText
			}
			else {
				alert("Viga testi lisamisel baasi!" + ' ' + data.responseText)
			}
		}
	})
}
$(function () {

	$('#question_type_id').bind('change', function (event) {
		// change answer_option type
		switch ($(this).val().trim()) {
			case '1':
				// õige/vale
				$('#answer_options div').remove();
				$('#answer_options').append('<p>Märgi ära õige vastus:</p>');
				$('#answer_options').append('<div style="padding: 5px"><input style="margin: 5px; margin-bottom: 9px" type="radio" id="answer_option[0]" name="tfselected">Jah</div>');
				$('#answer_options').append('<div style="padding: 5px"><input style="margin: 5px; margin-bottom: 9px" type="radio" id="answer_option[1]" name="tfselected">Ei</div>');
				break;
			case '2':
				// mitmikvalik
				$('#answer_options div').remove();
				break;
			case '3':
				// mitmikvastus
				$('#answer_options div').remove();
				$('#answer_options').append('<p>Märgi ära õiged vastused:</p>');
				$('#answer_options').append('<div><input class="input" type="checkbox" style="margin: 5px; margin-bottom: 10px"><textarea oninput="addMultipleResponse()" id="tekstikast_0"></textarea></div>');

				break;
			case '4':
				// fill in the blank
				$('#answer_options div').remove();
				break;
			default:
				alert('Viga');
		}

		current_type_id = $(this).val();
	})

	$('#answer-template .answer-template').hide();
	$('#question_type_' + current_type_id).show();
	$('#question_type_id').bind('change', function (event) {
		if ($(this).val() != current_type_id) {
			$('#answer-template .answer-template').hide();
			current_type_id = $(this).val();
			$('#question_type_' + current_type_id).show();
		}
	});
	var list = $('#question_type_id option');
	for (var i = 0; i < list.length; i++) {
		if ($(list[i]).val() == current_type_id) {
			$(list[i]).attr('selected', 'selected');
		}
	}
	$('input:first').focus();
});
