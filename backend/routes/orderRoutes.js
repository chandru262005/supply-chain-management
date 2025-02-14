const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrder);
router.post('/', orderController.createOrder);
router.patch('/:id/status', orderController.updateOrderStatus);
router.patch('/:id/tracking', orderController.updateTracking);

module.exports = router;