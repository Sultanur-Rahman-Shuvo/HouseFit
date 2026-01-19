// Ollama prompt templates for AI features

// Tree verification prompt - returns strict JSON
const TREE_VERIFICATION_PROMPT = `You are an expert environmental analyst. Analyze this tree plantation image.

STRICT OUTPUT FORMAT (JSON only):
{
  "classification": "likely_genuine" | "likely_fake" | "uncertain",
  "confidence": 0.0 to 1.0,
  "reasoning": "brief 1-2 sentence explanation"
}

GUIDELINES:
- "likely_genuine": Real tree, proper plantation, visible soil/roots, outdoor setting, natural appearance
- "likely_fake": Stock photo, indoor plant, screenshot, heavily edited, cartoon/drawing, artificial plant
- "uncertain": Poor quality image, ambiguous context, insufficient evidence, unclear perspective

IMPORTANT:
- Be conservative in your assessment
- Consider image quality, context, and authenticity indicators
- Provide specific reasoning based on visual evidence

Image context: User claims to have planted a tree and submitted this photo for verification.

Respond ONLY with valid JSON. No additional text.`;

// Flat price prediction prompt with real market data
const createFlatPredictionPrompt = ({ area, bedrooms, bathrooms, floor, location, marketData }) => {
    let marketContext = '';

    if (marketData) {
        const bedroomAvg = marketData.avgBedroomsByCount[bedrooms] || 'N/A';
        marketContext = `

REAL MARKET DATA FROM DATABASE (${marketData.totalFlats} flats analyzed):
- Average rent: ${marketData.avgRent} BDT
- Average area: ${marketData.avgArea} sqft
- Price per sqft: ${marketData.avgPricePerSqft} BDT
- Min/Max rent: ${marketData.minRent} - ${marketData.maxRent} BDT
- Average ${bedrooms}-bed rent: ${bedroomAvg} BDT`;
    }

    return `You are a real estate pricing expert in Dhaka, Bangladesh.

PROPERTY:
- Area: ${area} sqft
- Bedrooms: ${bedrooms}
- Bathrooms: ${bathrooms}
- Floor: ${floor}
- Location: ${location}${marketContext}

ESTIMATE the monthly rent using the market data. Respond with ONLY this JSON format:
{
  "estimatedRent": 35000,
  "confidence": "medium",
  "factors": ["location", "size", "bedrooms"],
  "range": {"min": 32000, "max": 38000},
  "locationCategory": "mid-range"
}`;
};

// Area suggestion based on budget with real market data
const createAreaSuggestionPrompt = ({ budget, bedrooms, location, marketData }) => {
    let marketContext = '';

    if (marketData) {
        const avgPricePerSqft = marketData.avgPricePerSqft || 25;
        const minArea = Math.round(budget / (avgPricePerSqft * 1.2));
        const maxArea = Math.round(budget / (avgPricePerSqft * 0.8));
        const bedroomAvg = marketData.avgBedroomsByCount[bedrooms] || 'N/A';

        marketContext = `

REAL MARKET DATA (${marketData.totalFlats} flats):
- Average rent: ${marketData.avgRent} BDT
- Price per sqft: ${avgPricePerSqft} BDT
- ${bedrooms}-bed average: ${bedroomAvg} BDT
- Expected area range for ${budget} BDT: ${minArea} - ${maxArea} sqft`;
    }

    return `You are a real estate advisor in Dhaka, Bangladesh.

CLIENT NEEDS:
- Budget: ${budget} BDT/month
- Bedrooms: ${bedrooms}
- Location: ${location || 'Any'}${marketContext}

SUGGEST flat size based on market data. Respond with ONLY this JSON format:
{
  "recommendedArea": 1100,
  "areaRange": {"min": 900, "max": 1300},
  "estimatedPrice": ${budget},
  "suggestions": ["Look near Dhanmondi", "Check mirpur area", "Consider Mohammadpur"],
  "alternativeLocations": ["Mirpur", "Mohammadpur"],
  "feasibility": "realistic",
  "marketInsight": "Based on market data, this budget allows for a reasonable apartment"
}`;
};

// Budget suggestion based on area with real market data
const createBudgetFromAreaPrompt = ({ area, bedrooms, bathrooms, location, marketData }) => {
    let marketContext = '';

    if (marketData) {
        const bedroomAvg = marketData.avgBedroomsByCount[bedrooms] || 'N/A';
        const estimatedBudget = Math.round(area * (marketData.avgPricePerSqft || 25));

        marketContext = `

REAL MARKET DATA (${marketData.totalFlats} flats):
- Average rent: ${marketData.avgRent} BDT
- Price per sqft: ${marketData.avgPricePerSqft} BDT
- ${bedrooms}-bed average: ${bedroomAvg} BDT
- Estimated budget for ${area} sqft: ${estimatedBudget} BDT`;
    }

    return `You are a real estate advisor in Dhaka, Bangladesh.

PROPERTY REQUIREMENTS:
- Area: ${area} sqft
- Bedrooms: ${bedrooms}
- Bathrooms: ${bathrooms}
- Location: ${location || 'Any'}${marketContext}

SUGGEST realistic budget (monthly rent) based on market data. Respond with ONLY this JSON format:
{
  "suggestedBudget": 35000,
  "budgetRange": {"min": 32000, "max": 38000},
  "rationale": "Based on market trends",
  "tips": ["This is realistic for this area", "Look for flats in this price range"],
  "marketComparison": "Higher/Lower than average",
  "confidence": "medium"
}`;
};

module.exports = {
    TREE_VERIFICATION_PROMPT,
    createFlatPredictionPrompt,
    createAreaSuggestionPrompt,
    createBudgetFromAreaPrompt,
};
