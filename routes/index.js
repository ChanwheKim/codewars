var express = require('express');
var router = express.Router();
var fs = require('fs');

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
	req;
	res;
	debugger;
});

module.exports = router;
