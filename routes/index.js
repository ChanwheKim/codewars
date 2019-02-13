var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var fs = require('fs');
const vm = require('vm');

const Problem = require('../models/Problem');

mongoose.connect('mongodb://localhost:27017/codewars');

const db = mongoose.connection;

db.on('error', () => {
	console.log('error!!');
});
db.once('open', () => {
	console.log('connected');
});

/* GET home page. */
router.get('/', (req, res) => {
	fs.readFile( __dirname + '/../data/problems.json', 'utf8', (err, data) => {
		let katas = JSON.parse(data);

		if (req.query.level) {
			katas = kata.filter(kata => kata.difficulty_level === parseInt(req.query.level));
		}

		Problem.find().then(problems => {
			res.render('index', { problems });
		});
	});
});

router.get('/problems/:problem_id', (req, res) => {
	fs.readFile( __dirname + '/../data/problems.json', 'utf8', (err, data) => {
		const katas = JSON.parse(data);
		const idx = parseInt(req.params.problem_id) - 1;

		res.render('kata', { kata: katas[idx], tests: katas[idx].tests });
	});
});

router.post('/problems/:problem_id', (req, res) => {
	fs.readFile( __dirname + '/../data/problems.json', 'utf8', (err, data) => {
		const kata = JSON.parse(data).find(kata => kata.id === parseInt(req.params.problem_id));
		const sandbox = { a: 1};
		let result;
		let isPassed = true;
		const failedCase = [];

		try {
			for (let i = 0; i < kata.tests.length; i++) {
					result = vm.runInNewContext(req.body.solution + kata.tests[i].code, sandbox);

				// 에러 처리 별도

				if (result !== kata.tests[i].solution) {
					isPassed = false;

					if (result === undefined) {
						result = 'undefined';
					} else if (result === null) {
						result = 'null';
					}

					failedCase.push({ test: kata.tests[i], result });
				}
			}

			if (isPassed) {
				res.render('success', { kata, solution: req.body.solution, tests: kata.tests });
			} else {
				res.render('failure', { kata, solution: req.body.solution, failedCase });
			}
		} catch(err) {
			res.render('error', { kata, solution: req.body.solution, errorMessage: err.message });
		}
	});
});

module.exports = router;

function solution(seoul) {
	var inx = seoul.indexOf('Kim');
	return '김서방은 ' + inx +'에 있다';
}

function solution(n) {
	var str = '';
	for(var i = 1; i <= n; i++) {
			if(i % 2 === 1) {
					str += '수';
			} else {
					str += '박';
			}
	}
	return str;
}

function solution(num) {
	if (num === 0) return 0;
	if (num === 1) return 1;
	return solution(num - 1) + solution(num -2);
}
