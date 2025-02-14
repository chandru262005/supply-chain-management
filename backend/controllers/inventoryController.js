const Inventory = require('../models/inventory');

const inventoryController = {
    // Get all inventory items
    getAllItems: async ( res) => {
        try {
            const items = await Inventory.find({});
            res.status(200).json(items);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get single inventory item
    getItem: async (req, res) => {
        try {
            const item = await Inventory.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.status(200).json(item);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Create new inventory item
    createItem: async (req, res) => {
        try {
            const newItem = new Inventory(req.body);
            const savedItem = await newItem.save();
            res.status(201).json(savedItem);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Update inventory item
    updateItem: async (req, res) => {
        try {
            const updatedItem = await Inventory.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!updatedItem) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.status(200).json(updatedItem);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Delete inventory item
    deleteItem: async (req, res) => {
        try {
            const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
            if (!deletedItem) {
                return res.status(404).json({ message: 'Item not found' });
            }
            res.status(200).json({ message: 'Item deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update inventory quantity
    updateQuantity: async (req, res) => {
        try {
            const { quantity, type, reference } = req.body;
            const item = await Inventory.findById(req.params.id);
            
            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }

            // Update quantity
            item.quantity += type === 'received' ? quantity : -quantity;
            
            // Add to movement history
            item.movementHistory.push({
                date: new Date(),
                quantity,
                type,
                reference
            });

            const updatedItem = await item.save();
            res.status(200).json(updatedItem);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

module.exports = inventoryController;