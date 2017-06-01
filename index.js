var express = require('express');
var app = express();
var path    = require("path");
var bodyParser = require("body-parser");

app.use(express.static(__dirname + '/semantic'));
app.use(express.static(__dirname + '/assets'));

const urlencodedParser = bodyParser.urlencoded({extended: false});

const 
	subjects = [
		{id: 1, name: "Math"},
		{id: 2, name: "English"},
		{id: 3, name: "Biology"}
	],
	questions = [
		{id: 1, name: "Math_QUES_1", subjects_id: 1},
		{id: 2, name: "Math_QUES_2", subjects_id: 1},
		{id: 7, name: "Math_QUES_3", subjects_id: 1},
		{id: 3, name: "English_QUES_1", subjects_id: 2},
		{id: 4, name: "English_QUES_2", subjects_id: 2},
		{id: 5, name: "Biology_QUES_1", subjects_id: 3},
		{id: 6, name: "Biology_QUES_2", subjects_id: 3},
	],
	answers = [
		{id: 1, options: ["a1", "a2", "a3"], questions_id: 1},
		{id: 2, options: ["b1", "b2", "b3", "b4"], questions_id: 2},
		{id: 3, options: ["a1", "a2", "a3"], questions_id: 3},
		{id: 4, options: ["b1", "b2", "b3"], questions_id: 4},
		{id: 5, options: ["a1", "a2", "a3"], questions_id: 5},
		{id: 6, options: ["b1", "b2", "b3"], questions_id: 6},
		{id: 7, options: ["с1", "с2", "с3"], questions_id: 7},
	];

	R_answers = [
		{id: 1, correct: 1, answers_id: 1},
		{id: 2, correct: 0, answers_id: 2},
		{id: 3, correct: 2, answers_id: 3},
		{id: 4, correct: 1, answers_id: 4},
		{id: 5, correct: 2, answers_id: 5},
		{id: 6, correct: 0, answers_id: 6},
		{id: 7, correct: 0, answers_id: 7}
	]

const all = {
	s : subjects,
	q : questions,
	a : answers
};


app.get('/getMassiv',function(req,res){
	console.log("gm");
	let all1 = JSON.stringify(all);
	res.send(all1);
});

app.post('/getAnswers',urlencodedParser, function(req,res){
	let res_array =[];
	let inf ={};
	res_array = JSON.parse(req.body.data); 
	var result = Count(res_array);
	//res.send(""+result);
	inf.points = result;
	inf.n = req.body.name;
	inf.s = req.body.subject;
	inf = JSON.stringify(inf);
	res.send(inf);
});

function Count(res_array){
	var r_ans = 0;
	for (var i = 0; i<res_array.length; i++){
		for (var j =0; j<R_answers.length; j++){
			if (res_array[i].id == R_answers[j].answers_id){
				if (res_array[i].selected == R_answers[j].correct){
					r_ans++;
				}
			}
		}
	}
	return r_ans;
}

app.post("/register", urlencodedParser, function (request, response) {
	console.log(request.body);
    //response.send(`${request.body.userName} - ${request.body.userAge}`);
    response.send(request.body.userName + " - " +request.body.userAge);
});

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.listen(3000, function () {
  console.log('Приклад застосунку, який прослуховує 3000-ий порт!');
});
