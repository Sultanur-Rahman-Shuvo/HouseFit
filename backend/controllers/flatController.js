const Flat = require('../models/Flat');

// @route   GET /api/flats
// @desc    Get all available flats
// @access  Public
exports.getAllFlats = async (req, res) => {
    try {
        const { status, minRent, maxRent, bedrooms, buildingId } = req.query;

        let query = {};

        if (status) query.status = status;
        else query.status = 'available'; // Default to available only

        if (minRent || maxRent) {
            query.rent = {};
            if (minRent) query.rent.$gte = parseInt(minRent);
            if (maxRent) query.rent.$lte = parseInt(maxRent);
        }

        if (bedrooms) query.bedrooms = parseInt(bedrooms);
        if (buildingId) query.buildingId = buildingId;

        const flats = await Flat.find(query)
            .populate('buildingId', 'name address')
            .populate('ownerId', 'firstName lastName email phone')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: flats.length,
            data: { flats },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @route   GET /api/flats/:id
// @desc    Get single flat
// @access  Public
exports.getFlatById = async (req, res) => {
    try {
        const flat = await Flat.findById(req.params.id)
            .populate('buildingId')
            .populate('ownerId', 'firstName lastName email phone')
            .populate('currentTenant', 'firstName lastName email');

        if (!flat) {
            return res.status(404).json({
                success: false,
                message: 'Flat not found',
            });
        }

        res.json({
            success: true,
            data: { flat },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @route   GET /api/flats/search
// @desc    Search flats
// @access  Public
exports.searchFlats = async (req, res) => {
    try {
        const { keyword, location } = req.query;

        let query = { status: 'available' };

        if (keyword) {
            query.$or = [
                { flatNumber: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ];
        }

        const flats = await Flat.find(query)
            .populate('buildingId')
            .limit(20);

        res.json({
            success: true,
            count: flats.length,
            data: { flats },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @route   GET /api/flats/my-flats
// @desc    Get owner's flats
// @access  Private (Owner)
exports.getMyFlats = async (req, res) => {
    try {
        const flats = await Flat.find({ ownerId: req.user._id })
            .populate('buildingId')
            .populate('currentTenant', 'firstName lastName email phone');

        res.json({
            success: true,
            count: flats.length,
            data: { flats },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @route   PUT /api/flats/my-flats/:id/fare
// @desc    Owner updates fare defaults for own flat
// @access  Private (Owner)
exports.updateMyFlatFare = async (req, res) => {
    try {
        const flat = await Flat.findById(req.params.id);

        if (!flat) {
            return res.status(404).json({ success: false, message: 'Flat not found' });
        }

        if (flat.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const { rent, defaultMaintenance, defaultCleaning, defaultGarbage } = req.body;

        if (rent !== undefined) flat.rent = rent;
        if (defaultMaintenance !== undefined) flat.defaultMaintenance = defaultMaintenance;
        if (defaultCleaning !== undefined) flat.defaultCleaning = defaultCleaning;
        if (defaultGarbage !== undefined) flat.defaultGarbage = defaultGarbage;

        await flat.save();

        res.json({ success: true, message: 'Fare updated', data: { flat } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
