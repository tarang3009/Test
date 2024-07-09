const express = require("express")
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;

router.get('./products', async(req, res)=>{
    let data = req.body;
    let minPrice = data.minPrice;
    const collection = db.collection('products');
    const products = await collection.find({ price: { $gt: minPrice } }).sort({ price: -1 });

    res.json(products);
})

module.exports = router;