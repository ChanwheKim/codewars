const express = require('express');
const mongoose = require('mongoose');
const vm = require('vm');
const Problem = require('../models/Problem');
const { WrongEntityError, GeneralServerError } = require('../lib/error');
const { development } = require('../config/index');

const router = express.Router();

mongoose.connect(development.DB);

const db = mongoose.connection;

db.on('error', (error) => {
	console.warn('An error has occured while connecting.', error);
});

db.once('open', () => {
	console.log('The database has been connected. :)');
});

router.get('/', (req, res) => {
	if (req.query.level) {
		Problem.find({ difficulty_level: req.query.level }).then((problems) => {
			res.render('index', { problems });
		});
	} else {
		Problem.find().then((problems) => {
			res.render('index', { problems });
		});
	}
});

router.get('/problems/:problem_id', (req, res, next) => {
	const id = req.params.problem_id;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		next(new WrongEntityError());
		return;
	}

	Problem.findById(id).then((problem) => {
		res.render('kata', { problem });
	});
});

router.post('/problems/:problem_id', (req, res, next) => {
	const id = req.params.problem_id;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		next(new WrongEntityError());
		return;
	}

	try {
		Problem.findById(id).then((problem) => {
			let result;
			let isPassed = true;
			const failedCase = [];
			const { solution } = req.body;
			const sandbox = {
				setTimeout: global.setTimeout,
				setInterval: global.setInterval,
			};

			for (let i = 0; i < problem.tests.length; i++) {
				try {
					result = vm.runInNewContext(solution + problem.tests[i].code, sandbox);
				} catch (err) {
					res.render('kata-error', { problem, solution, errorMessage: err.message });
					return;
				}

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
				res.render('success', { problem, solution, tests: problem.tests });
			} else {
				res.render('failure', { problem, solution, failedCase });
			}
		});
	} catch (err) {
		next(new GeneralServerError());
	}
});

module.exports = router;
