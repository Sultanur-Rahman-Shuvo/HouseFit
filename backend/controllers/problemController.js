const ProblemReport = require('../models/ProblemReport');

exports.createProblem = async (req, res) => {
    try {
        const problem = await ProblemReport.create({
            ...req.body,
            reportedBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            data: { problem },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyProblems = async (req, res) => {
    try {
        const problems = await ProblemReport.find({ reportedBy: req.user._id })
            .populate('assignedTo')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { problems },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getProblemById = async (req, res) => {
    try {
        const problem = await ProblemReport.findById(req.params.id)
            .populate('reportedBy', 'firstName lastName')
            .populate('assignedTo');

        if (!problem) {
            return res.status(404).json({ success: false, message: 'Problem not found' });
        }

        res.json({ success: true, data: { problem } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
