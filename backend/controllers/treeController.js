const TreeSubmission = require('../models/TreeSubmission');
const User = require('../models/User');
const { generateText } = require('../config/ollama');
const { TREE_VERIFICATION_PROMPT } = require('../utils/promptTemplates');

// @route   POST /api/trees/submit
// @desc    Submit tree for verification
// @access  Private (Tenant)
exports.submitTree = async (req, res) => {
    try {
        const { location, plantedDate } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Tree image is required',
            });
        }

        const imageUrl = `/${req.file.path.replace(/\\/g, '/')}`;

        // Call Ollama AI for analysis
        const aiResult = await generateText(TREE_VERIFICATION_PROMPT, {
            format: 'json',
        });

        let aiAnalysis;
        if (aiResult.success) {
            try {
                aiAnalysis = JSON.parse(aiResult.response);
            } catch (parseError) {
                // Fallback if JSON parsing fails
                aiAnalysis = {
                    classification: 'uncertain',
                    confidence: 0,
                    reasoning: 'AI service returned invalid response. Manual review required.',
                };
            }
        } else {
            // Fallback if Ollama unavailable
            aiAnalysis = {
                classification: 'uncertain',
                confidence: 0,
                reasoning: 'AI service unavailable. Manual review required.',
            };
        }

        // Get current month
        const month = new Date().toISOString().slice(0, 7);

        // Create submission
        const submission = await TreeSubmission.create({
            userId: req.user._id,
            imageUrl,
            location,
            plantedDate,
            aiAnalysis: {
                classification: aiAnalysis.classification,
                confidence: aiAnalysis.confidence || 0,
                reasoning: aiAnalysis.reasoning,
                modelUsed: process.env.OLLAMA_MODEL || 'llama2',
            },
            month,
        });

        res.status(201).json({
            success: true,
            message: 'Tree submission created. Awaiting admin review.',
            data: { submission },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @route   GET /api/trees/my-submissions
// @desc    Get user's tree submissions
// @access  Private
exports.getMySubmissions = async (req, res) => {
    try {
        const submissions = await TreeSubmission.find({ userId: req.user._id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: submissions.length,
            data: { submissions },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @route   GET /api/trees/leaderboard
// @desc    Get monthly leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
    try {
        const month = req.params.month || new Date().toISOString().slice(0, 7);

        const users = await User.find({ role: 'tenant' })
            .select('firstName lastName treePoints')
            .sort({ treePoints: -1 })
            .limit(10);

        res.json({
            success: true,
            month,
            data: { leaderboard: users },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
