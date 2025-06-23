const Problem = require('../models/Problem');

exports.createProblem = async (req, res) => {
  try {
    const problem = new Problem(req.body);
    await problem.save();
    res.status(201).json(problem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProblems = async (req, res) => {
  const problems = await Problem.find();
  res.json(problems);
};

exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    res.json(problem);
  } catch {
    res.status(404).json({ error: 'Problem not found' });
  }
};

exports.updateProblem = async (req, res) => {
  try {
    const updated = await Problem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch {
    res.status(400).json({ error: 'Unable to update problem' });
  }
};

exports.deleteProblem = async (req, res) => {
  try {
    await Problem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Problem deleted' });
  } catch {
    res.status(400).json({ error: 'Unable to delete problem' });
  }
};