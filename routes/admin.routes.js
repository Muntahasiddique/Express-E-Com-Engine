const express = require ('express');
const router = express.Router();
const adminController = require('../controllers/admin.Controller');
const imageUploadMiddleware = require('../middlewares/image_Upload');
router.get('/products' ,adminController.getProducts);
router.get('/products/new' ,adminController.getNewProduct); // Fixed: singular
router.post('/products', imageUploadMiddleware, adminController.createNewProduct); // Fixed: lowercase 'c' and singular
router.get('/products/:id', adminController.getUpdateProduct);
router.post('/products/:id', imageUploadMiddleware, adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

module.exports=router;