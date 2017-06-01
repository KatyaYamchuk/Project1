var 
	s_index = 0
	,q_index = 0
	,a_idx = 0
	,q_arr = []
	,a_arr = {}
	,sel_arr = []
	,name
	,subject
	,data
	,selected = 40
	,counter = 0;
	;
window.onload = function() {
	set_mode_view();
}


function set_mode_view(id)
{
	$.ajax({
		url:'http://localhost:3000/getMassiv',
		success: serverDataParse,
	})
}
function serverDataParse (d){

	data = JSON.parse(d);
	$("#list1").append($("<option>", {'value': "-1", "html":"Выберите предмет"}));
	for (var i = 0; i < data.s.length; i++) {
			$("#list1").append($("<option>", {'value': i, "html":data.s[i].name}))
		}
	BattStart();
	}

function getQuestionsBySubject(s_index){
	var
		s_id = data.s[s_index].id;
		q2 = []; 

		for (var i=0; i<data.q.length; i++){
			if (data.q[i].subjects_id== s_id){
				q2.push(data.q[i]);
				}
			}
			return q2;
}

function BattStart(){
	$("#btnNext").on("click",  btnNextClick ) 
}

function btnNextClick(){
	s_index = $("#list1").val();
	if (s_index == "-1"){
		alert ("Выберите предмет тестирования");
		return;
		}
	name = $("#form1").val()
	if (name == ""){
		alert ("Введите свое имя и фамилию");
		return;
		}
	subejct = $("#list1 :selected").text();
	q_arr = getQuestionsBySubject(s_index);
	q_arr = q_arr.shuffle();
	BuildQCounter(q_index,a_arr.selected);
};

		//ПЕРЕМЕШКА ВОПРОСОВ
Array.prototype.shuffle = function() {
	for (var i = this.length - 1; i > 0; i--) {
		var num = Math.floor(Math.random() * (i + 1));
		var d = this[num];
		this[num] = this[i];
		this[i] = d;
		    }
	return this;
}

		//ОТВЕТИ К ВОПРОСАМ
function getAnswersByQuestions(q_index){
	if (q_index<q_arr.length){
		var 
			a_id = q_arr[q_index].id ;
			a2 = {};
		for (var i=0; i<data.a.length; i++){
				if (data.a[i].id == a_id ){
					a2 = data.a[i];
				}
			}
			return a2;
		}  
}

function BuildQCounter(q_index,selected){
	a_arr = getAnswersByQuestions(q_index);
	$(".center1").html("");
	$("<div>", {id:"q_div"}).appendTo($(".center1"));
	$("<p>", {id:"q"}).appendTo($("#q_div"));
	$("<div>", {id:"divAns"}).appendTo($(".center1"));
	$("<button>", {id:"butQ"}).html("Следующий").addClass("ui right labeled icon blue button").appendTo(
		$(".center1")).append(
		$("<i>").addClass("right arrow icon"));

	$("<button>", {id:"butP"}).html("Предыдущий").addClass("ui left labeled icon blue button").appendTo(
		$(".center1")).append(
		$("<i>").addClass("left arrow icon"));
	
	$("<button>", {id:"butF"}).html("ФИНИШ").attr("disabled",true).addClass("ui left labeled icon green button").appendTo(
		$(".center1")).append(
		$("<i>").addClass("check circle icon"));

	if (q_index<1){
		$("#butP").attr("disabled",true);
	}
	if (q_index==q_arr.length-1){
		$("#butQ").attr("disabled",true);
	}

	$("#q").html(q_arr[q_index].name);
	$("<div>", {id:"butdiv"}).appendTo($(".center1"));
	$("<div>").addClass("ui form").appendTo($("#divAns"));
    $("<div>").addClass("grouped fields katya").appendTo($(".ui.form"));
	var item;
	for (var i = 0; i < a_arr.options.length; i++){
		if (i == a_arr.selected){
				item = $("<input>",{'type':"radio", id : "cb"+i, "idx": i, "name":"example_", "checked":"cheched"})
		}else{
				item = $("<input>",{'type':"radio", id : "cb"+i, "idx": i, "name":"example_"})
		}

			$("<div>").addClass("field").appendTo($(".grouped.fields.katya")).append(
	    $("<div>").addClass("ui radio checkbox").append(item).append(
	    $("<label>").addClass("radiolab").html(a_arr.options[i])));
	}

	$("#butF").on("click", Send);
	$("#butdiv").append(SetBut);
	$("#butQ").on("click", NextB );
	$("#butP").on("click", PreviousB );
	$("input[type=radio]").on("click",setChecked);

}



function NextB(){
		q_index++;
		BuildQCounter(q_index);
	}

function PreviousB(){
	if (q_index>0){
		q_index--;
		BuildQCounter(q_index);
	}
}

function Switch(event){
	q_index = event.data.q_index;
	BuildQCounter(q_index);
}
	
	function setChecked(){
		
		var idx = $(this).attr('idx');
		if (!("selected" in a_arr)){
			a_arr.selected = idx;
		$("#b"+q_index).css("background-color","#7FFF00");
		counter++;
	}
	if (counter == q_arr.length){
		$("#butF").attr("disabled",false);
	}
}

	function SetBut(){
		for (var i=0; i<q_arr.length; i++){
			var a_arr_ = getAnswersByQuestions(i);
		$("<button>",{id: "b"+i}).html(i+1).addClass("SmallBut").on("click", {q_index : i}, Switch).appendTo($("#butdiv"));
		if (i == q_index){
			$("#b"+i).css("border", "2px solid #191970");
		}
		if ("selected" in a_arr_){
			$("#b"+i).css("background-color","#7FFF00");
		}
	}
	}

	function Send(){
		if (!(confirm("Вы уверены, что хотите закончить тест?"))){
			return;
		}
		var res_array = [];
		for (i=0;i<q_arr.length;i++){
			a_arr = getAnswersByQuestions(i);
			res_array[i] = a_arr;
		}
		res_array = JSON.stringify(res_array);
    $.ajax({
        url:'http://localhost:3000/getAnswers',
        method: 'POST',
        data: {"data": res_array, "name": name, "subject": subject}, 
        success:function (data) {
       		console.log(data);
       		data = JSON.parse(data)
       		$(".center1").html("");
       		$("<div>",{id:"result"}).appendTo($(".center1"));;
       		$('<p>', {id: "text_n"}).html(data.n+"!").appendTo($("#result"));
       		$('<p>', {id: "text_r"}).html("Ваш Результат:").appendTo($("#result"));
       		$('<p>', {id: "text_r2"}).html(data.points).appendTo($("#result"));
       }
   })
	}
