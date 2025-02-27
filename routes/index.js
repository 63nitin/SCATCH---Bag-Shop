const express = require('express');
const router = express.Router();
const isloggedin = require('../middlewares/isLoggedin');
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');

const getProducts = async () => {
    // Your database logic here
    return [
        {
            name: "Product 1",
            price: 100,
            image: "image",
            bgcolor: '#ffffff',
            panelcolor: '#f0f0f0',
            textcolor: '#000000'
        },
        // Add more products here
    ];
};

router.get('/', function(req, res){
    let error = req.flash("error")
    res.render("index", {error, loggedin: false});
})

router.get('/shop', isloggedin, async function(req, res){
    let success = req.flash('success')
  let products = await productModel.find();
        res.render('shop', { products, success });
});

router.get('/addtocart/:productid', isloggedin, async function(req, res){
  let user = await  userModel.findOne({email: req.user.email});
  console.log(user)
  user.cart.push(req.params.productid);
  await user.save();
  req.flash("success", "Product Added to Cart");
  res.redirect('/shop');
})

router.get('/cart', isloggedin, async function(req, res){
    let user = await userModel.findOne({email: req.user.email}).populate('cart');
  const bill =  (Number(user.cart[0].price)+20) - Number(user.cart[0].discount)
    res.render('cart', {user, bill});
  })


module.exports = router;