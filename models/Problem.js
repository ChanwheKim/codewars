const mongoose = require('mongoose');

const ProblemSchema = mongoose.Schema({
	title: { type: String, required: true },
	solution_count: { type: Number, required: true },
	difficulty_level: { type: Number, required: true },
	description: { type: String, required: true },
	tests: { type: Array },
});

module.exports = mongoose.model('Problem', ProblemSchema);
