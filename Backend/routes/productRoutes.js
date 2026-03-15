const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/', productController.createProduct);
router.get('/', productController.getProducts);
router.get('/products/:id', productController.getProductById);
router.get('/category/:id', productController.getProductsByCategory);
router.get('/user/:id', productController.getProductsByUser);
router.get('/search', productController.searchProducts);
router.delete('/:id', productController.deleteProduct);
router.put("/:id", productController.updateProduct);

module.exports = router;