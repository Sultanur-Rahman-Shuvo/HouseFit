const Bill = require('../models/Bill');
const Flat = require('../models/Flat');

exports.getMyBills = async (req, res) => {
    try {
        const bills = await Bill.find({ tenantId: req.user._id })
            .populate('flatId')
            .sort({ month: -1 });

        res.json({
            success: true,
            data: { bills },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getBillById = async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id)
            .populate('flatId')
            .populate('paymentId');

        if (!bill) {
            return res.status(404).json({ success: false, message: 'Bill not found' });
        }

        res.json({ success: true, data: { bill } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.generateBill = async (req, res) => {
    try {
        const {
            flatId,
            tenantId,
            rent,
            electricity,
            gas,
            water,
            maintenance,
            cleaning,
            garbage,
        } = req.body;

        const flat = await Flat.findById(flatId);
        if (!flat) {
            return res.status(404).json({ success: false, message: 'Flat not found' });
        }

        const resolvedTenantId = tenantId || flat.currentTenant;
        if (!resolvedTenantId) {
            return res.status(400).json({ success: false, message: 'Tenant is required for billing' });
        }

        const billPayload = {
            ...req.body,
            tenantId: resolvedTenantId,
            rent: rent !== undefined ? rent : flat.rent,
            maintenance: maintenance !== undefined ? maintenance : flat.defaultMaintenance,
            cleaning: cleaning !== undefined ? cleaning : flat.defaultCleaning,
            garbage: garbage !== undefined ? garbage : flat.defaultGarbage,
            electricity: electricity !== undefined ? electricity : 0,
            gas: gas !== undefined ? gas : 0,
            water: water !== undefined ? water : 0,
            generatedBy: req.user._id,
        };

        const bill = await Bill.create(billPayload);

        res.status(201).json({
            success: true,
            data: { bill },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
