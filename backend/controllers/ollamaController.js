const { generateText } = require('../config/ollama');
const { createFlatPredictionPrompt, createAreaSuggestionPrompt, createBudgetFromAreaPrompt } = require('../utils/promptTemplates');
const Flat = require('../models/Flat');

// Helper function to fetch and analyze market data from database
const getMarketData = async () => {
    try {
        const flats = await Flat.find({ status: 'available' })
            .populate('buildingId', 'name address')
            .select('area bedrooms bathrooms rent floor orientation')
            .limit(50)
            .lean()
            .exec();

        if (flats.length === 0) {
            console.log('No available flats found in database');
            return null;
        }

        console.log(`Found ${flats.length} available flats for market analysis`);

        // Calculate market statistics
        const stats = {
            totalFlats: flats.length,
            avgRent: Math.round(flats.reduce((sum, f) => sum + f.rent, 0) / flats.length),
            avgArea: Math.round(flats.reduce((sum, f) => sum + f.area, 0) / flats.length),
            avgBedroomsByCount: {},
            pricePerSqft: {},
            rentByArea: [],
        };

        // Group by bedrooms
        const byBedrooms = {};
        flats.forEach(f => {
            if (!byBedrooms[f.bedrooms]) byBedrooms[f.bedrooms] = [];
            byBedrooms[f.bedrooms].push(f.rent);
        });

        Object.keys(byBedrooms).forEach(br => {
            stats.avgBedroomsByCount[br] = Math.round(
                byBedrooms[br].reduce((a, b) => a + b, 0) / byBedrooms[br].length
            );
        });

        // Price per sqft analysis
        flats.forEach(f => {
            if (f.area > 0) {
                stats.rentByArea.push({
                    area: f.area,
                    rent: f.rent,
                    pricePerSqft: Math.round(f.rent / f.area),
                });
            }
        });

        // Calculate average price per sqft
        const avgPricePerSqft = Math.round(
            stats.rentByArea.reduce((sum, r) => sum + r.pricePerSqft, 0) / stats.rentByArea.length
        );

        stats.avgPricePerSqft = avgPricePerSqft;
        stats.minRent = Math.min(...flats.map(f => f.rent));
        stats.maxRent = Math.max(...flats.map(f => f.rent));

        return { flats, stats };
    } catch (error) {
        console.error('Error fetching market data:', error);
        return null;
    }
};

// @route   POST /api/predict/flat-price
// @desc    Predict flat price using AI with real market data
// @access  Public
exports.predictFlatPrice = async (req, res) => {
    try {
        const { area, bedrooms, bathrooms, floor, location } = req.body;

        if (!area || !bedrooms || !location) {
            return res.status(400).json({
                success: false,
                message: 'Area, bedrooms, and location are required',
            });
        }

        // Fetch real market data
        const marketData = await getMarketData();

        const prompt = createFlatPredictionPrompt({
            area,
            bedrooms,
            bathrooms,
            floor,
            location,
            marketData: marketData?.stats,
        });

        const aiResult = await generateText(prompt, { format: 'json' });

        if (!aiResult.success) {
            console.error('Ollama generation failed:', aiResult.error);
            return res.status(503).json({
                success: false,
                message: 'Prediction service unavailable',
                error: aiResult.error,
                suggestion: 'Make sure Ollama is running at ' + (process.env.OLLAMA_URL || 'http://127.0.0.1:11435'),
            });
        }

        let prediction;
        try {
            // Extract JSON from response if it contains extra text
            let jsonStr = aiResult.response;
            const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonStr = jsonMatch[0];
            }
            prediction = JSON.parse(jsonStr);
        } catch (error) {
            console.error('JSON parsing error:', error.message, 'Response:', aiResult.response);
            return res.status(500).json({
                success: false,
                message: 'AI returned invalid JSON response',
                debug: process.env.NODE_ENV === 'development' ? aiResult.response : undefined,
            });
        }

        res.json({
            success: true,
            data: { prediction },
        });
    } catch (error) {
        console.error('Prediction error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @route   POST /api/predict/area-suggestion
// @desc    Suggest area and budget based on market data
// @access  Public
exports.suggestArea = async (req, res) => {
    try {
        const { budget, bedrooms, location } = req.body;

        if (!budget || !bedrooms) {
            return res.status(400).json({
                success: false,
                message: 'Budget and bedrooms are required',
            });
        }

        // Fetch real market data
        const marketData = await getMarketData();

        const prompt = createAreaSuggestionPrompt({
            budget,
            bedrooms,
            location,
            marketData: marketData?.stats,
        });

        const aiResult = await generateText(prompt, { format: 'json' });

        if (!aiResult.success) {
            console.error('Ollama generation failed:', aiResult.error);

            // Return fallback suggestion based on market data when Ollama is unavailable
            if (marketData?.stats) {
                const stats = marketData.stats;
                const avgPricePerSqft = stats.avgPricePerSqft || 25;
                const minArea = Math.round(budget / (avgPricePerSqft * 1.2));
                const maxArea = Math.round(budget / (avgPricePerSqft * 0.8));

                return res.json({
                    success: true,
                    data: {
                        suggestion: {
                            recommendedArea: Math.round((minArea + maxArea) / 2),
                            areaRange: { min: minArea, max: maxArea },
                            estimatedPrice: budget,
                            suggestions: ['Check local market', 'Consider nearby areas'],
                            alternativeLocations: ['Dhaka', 'Suburbs'],
                            feasibility: 'realistic',
                            marketInsight: `Based on market data with ${stats.totalFlats} flats analyzed`,
                        },
                        fallback: true,
                    }
                });
            }

            return res.status(503).json({
                success: false,
                message: 'Suggestion service unavailable',
                error: aiResult.error,
                suggestion: 'Make sure Ollama is running at ' + (process.env.OLLAMA_URL || 'http://127.0.0.1:11435'),
            });
        }

        let suggestion;
        try {
            // Extract JSON from response if it contains extra text
            let jsonStr = aiResult.response;
            const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonStr = jsonMatch[0];
            }
            suggestion = JSON.parse(jsonStr);
        } catch (error) {
            console.error('JSON parsing error:', error.message, 'Response:', aiResult.response);
            return res.status(500).json({
                success: false,
                message: 'AI returned invalid JSON response',
                debug: process.env.NODE_ENV === 'development' ? aiResult.response : undefined,
            });
        }

        res.json({
            success: true,
            data: { suggestion },
        });
    } catch (error) {
        console.error('Area suggestion error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @route   POST /api/predict/budget-from-area
// @desc    Suggest budget based on area specifications
// @access  Public
exports.budgetFromArea = async (req, res) => {
    try {
        const { area, bedrooms, bathrooms, location } = req.body;

        if (!area || !bedrooms) {
            return res.status(400).json({
                success: false,
                message: 'Area and bedrooms are required',
            });
        }

        // Fetch real market data
        const marketData = await getMarketData();

        const prompt = createBudgetFromAreaPrompt({
            area,
            bedrooms,
            bathrooms,
            location,
            marketData: marketData?.stats,
        });

        const aiResult = await generateText(prompt, { format: 'json' });

        if (!aiResult.success) {
            console.error('Ollama generation failed:', aiResult.error);

            // Return fallback budget suggestion based on market data when Ollama is unavailable
            if (marketData?.stats) {
                const stats = marketData.stats;
                const estimatedBudget = Math.round(area * (stats.avgPricePerSqft || 25));
                const minBudget = Math.round(estimatedBudget * 0.8);
                const maxBudget = Math.round(estimatedBudget * 1.2);

                return res.json({
                    success: true,
                    data: {
                        budget: {
                            suggestedBudget: estimatedBudget,
                            budgetRange: { min: minBudget, max: maxBudget },
                            rationale: `Based on market data with ${stats.totalFlats} flats analyzed`,
                            tips: ['Market prices may vary', 'Check with multiple properties'],
                            marketComparison: 'Market average',
                            confidence: 'medium',
                        },
                        fallback: true,
                    }
                });
            }

            return res.status(503).json({
                success: false,
                message: 'Budget suggestion service unavailable',
                error: aiResult.error,
                suggestion: 'Make sure Ollama is running at ' + (process.env.OLLAMA_URL || 'http://127.0.0.1:11435'),
            });
        }

        let budget;
        try {
            // Extract JSON from response if it contains extra text
            let jsonStr = aiResult.response;
            const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                jsonStr = jsonMatch[0];
            }
            budget = JSON.parse(jsonStr);
        } catch (error) {
            console.error('JSON parsing error:', error.message, 'Response:', aiResult.response);
            return res.status(500).json({
                success: false,
                message: 'AI returned invalid JSON response',
                debug: process.env.NODE_ENV === 'development' ? aiResult.response : undefined,
            });
        }

        res.json({
            success: true,
            data: { budget },
        });
    } catch (error) {
        console.error('Budget suggestion error:', error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
