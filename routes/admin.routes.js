const express = require ('express');
const router = express.Router();
const adminController = require('../controllers/admin.Controller');
const imageUploadMiddleware = require('../middlewares/image_Upload');

router.get('/products' ,adminController.getProducts);
router.get('/products/new' ,adminController.getNewProduct); 
router.post('/products', imageUploadMiddleware, adminController.createNewProduct); 
router.get('/products/:id', adminController.getUpdateProduct);
router.post('/products/:id', imageUploadMiddleware, adminController.updateProduct);
router.post('/products/:id/delete', adminController.deleteProduct);
// ADDED: The missing Order routes
router.get('/orders', adminController.getOrders);
router.post('/orders/:id', adminController.updateOrder);
module.exports=router;