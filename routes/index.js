var express = require('express');
var router = express.Router();
var fs = require('fs');
const vm = require('vm');

/* GET home page. */
router.get('/', (req, res) => {
	fs.readFile( __dirname + '/../data/problems.json', 'utf8', (err, data) => {
		let katas = JSON.parse(data);

		if (req.query.level) {
			katas = katas.filter(kata => kata.difficulty_level === parseInt(req.query.level));
		}

		res.render('index', { katas, data });
	});
});

router.get('/problems/:problem_id', (req, res) => {
	fs.readFile( __dirname + '/../data/problems.json', 'utf8', (err, data) => {
		const katas = JSON.parse(data);
		const idx = parseInt(req.params.problem_id) - 1;

		res.render('kata', { kata: katas[idx] });
	});
});

router.post('/problems/:problem_id', (req, res) => {
	fs.readFile( __dirname + '/../data/problems.json', 'utf8', (err, data) => {
		const kata = JSON.parse(data).find(kata => kata.id === parseInt(req.params.problem_id));
		const sandbox = {};
		let result;
		let isPassed = true;
		const failedCase = [];

		try {
			for (let i = 0; i < kata.tests.length; i++) {
				result = vm.runInNewContext(req.body.solution + kata.tests[i].code, sandbox);

				if (result !== kata.tests[i].solution) {
					isPassed = false;

					failedCase.push({ test: kata.tests[i], result });
				}
			}

			if (isPassed) {
				res.render('success', { kata, solution: req.body.solution, tests: kata.tests });
			} else {
				res.render('failure', { kata, solution: req.body.solution, failedCase });
			}
		} catch(err) {
			console.log(err.message);
			res.send('error');
		}
	});
});

module.exports = router;
