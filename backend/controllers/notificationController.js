const Notification = require('../models/Notification');

exports.getMyNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            $or: [
                { recipientId: req.user._id },
                { recipientRole: req.user.role },
                { recipientRole: 'all' },
            ],
        }).sort({ createdAt: -1 })
            .limit(50);

        res.json({
            success: true,
            data: { notifications },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        res.json({ success: true, data: { notification } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                $or: [
                    { recipientId: req.user._id },
                    { recipientRole: req.user.role },
                ],
                isRead: false,
            },
            { isRead: true }
        );

        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
