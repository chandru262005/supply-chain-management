const Order = require('../models/order');
const Inventory = require('../models/inventory');

const orderController = {
    // Get all orders
    getAllOrders: async (req, res) => {
        try {
            const orders = await Order.find({});
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get single order
    getOrder: async (req, res) => {
        try {
            const order = await Order.findById(req.params.id);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create new order
    createOrder: async (req, res) => {
        try {
            const newOrder = new Order(req.body);
            
            // Calculate total amount
            newOrder.totalAmount = newOrder.items.reduce(
                (total, item) => total + (item.quantity * item.unitPrice),
                0
            );

            // Check inventory availability
            for (const item of newOrder.items) {
                const inventoryItem = await Inventory.findOne({ productId: item.productId });
                if (!inventoryItem || inventoryItem.quantity < item.quantity) {
                    return res.status(400).json({
                        message: `Insufficient inventory for product ${item.productId}`
                    });
                }
            }

            const savedOrder = await newOrder.save();

            // Update inventory quantities
            for (const item of savedOrder.items) {
                await Inventory.findOneAndUpdate(
                    { productId: item.productId },
                    {
                        $inc: { quantity: -item.quantity },
                        $push: {
                            movementHistory: {
                                date: new Date(),
                                quantity: item.quantity,
                                type: 'shipped',
                                reference: savedOrder._id
                            }
                        }
                    }
                );
            }

            res.status(201).json(savedOrder);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Update order status
    updateOrderStatus: async (req, res) => {
        try {
            const { status } = req.body;
            const updatedOrder = await Order.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true, runValidators: true }
            );
            
            if (!updatedOrder) {
                return res.status(404).json({ message: 'Order not found' });
            }

            res.status(200).json(updatedOrder);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Update tracking information
    updateTracking: async (req, res) => {
        try {
            const { trackingInfo } = req.body;
            const updatedOrder = await Order.findByIdAndUpdate(
                req.params.id,
                { trackingInfo },
                { new: true, runValidators: true }
            );
            
            if (!updatedOrder) {
                return res.status(404).json({ message: 'Order not found' });
            }

            res.status(200).json(updatedOrder);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = orderController;