var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
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
	Problem.find().then(problems => {
		if (req.query.level) {
			problems = problems.filter(kata => kata.difficulty_level === parseInt(req.query.level));
		}

		res.render('index', { problems });
	});
});

router.get('/problems/:problem_id', (req, res) => {
	const id = req.params.problem_id;

	Problem.findById(id)
		.then(problem => {
			res.render('kata', { problem });
		});
});

router.post('/problems/:problem_id', (req, res) => {
	const id = req.params.problem_id;

	Problem.findById(id)
		.then(problem => {
			const sandbox = { a: 1 };
			let result;
			let isPassed = true;
			const failedCase = [];

			try {
				for (let i = 0; i < problem.tests.length; i++) {
						result = vm.runInNewContext(req.body.solution + problem.tests[i].code, sandbox);
	
					// 에러 처리 별도
	
					if (result !== problem.tests[i].solution) {
						isPassed = false;
	
						if (result === undefined) {
							result = 'undefined';
						} else if (result === null) {
							result = 'null';
						}
	
						failedCase.push({ test: problem.tests[i], result });
					}
				}

				if (isPassed) {
					res.render('success', { problem, solution: req.body.solution, tests: problem.tests });
				} else {
					res.render('failure', { problem, solution: req.body.solution, failedCase });
				}
			} catch(err) {
				res.render('error', { problem, solution: req.body.solution, errorMessage: err.message });
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
