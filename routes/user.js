var express = require('express');
var router = express.Router();
var productHelp=require('../help/product_help')
var cartHelp=require('../help/cart_help')

/* GET home page. */
router.get('/',(req,res)=>{
  res.render('user/welcome')
})

router.get('/products', function(req, res, next) {
  productHelp.getAllProducts().then((products)=>{
    res.render('user/view-products',{user:true,products})
    })
});

router.get('/cart',async(req,res)=>{
  let total=await cartHelp.getTotal()
  cartHelp.getCartItems().then((Items)=>{
    res.render('user/cart',{user:true,Items,total})
  })
})

router.get('/add-to-cart/:id',(req,res)=>{
  let itemid=req.params.id
  cartHelp.addToCart(itemid)
    res.redirect('/products')
})


router.get('/products/delete/:ID',(req,res)=>{
  let itemid=req.params.ID
  cartHelp.deleteitem(itemid).then((response)=>{
    console.log(response)
    res.redirect("/cart")
  })
})

router.get('/products/increment/:ID',(req,res)=>{
  let itemid=req.params.ID
  cartHelp.incrementitem(itemid).then((response)=>{
    console.log(response)
    res.redirect("/cart")
  })
})

router.get('/products/decrement/:ID',(req,res)=>{
  let itemid=req.params.ID
  cartHelp.decrementitem(itemid).then((response)=>{
    console.log(response)
    res.redirect("/cart")
  })
})

router.get('/checkout',async(req,res)=>{
  let total=await cartHelp.getTotal()
  cartHelp.getCartItems().then((Items)=>{
  res.render('user/summary',{user:true,Items,total})
  })
})

router.get('/payment',async(req,res)=>{
  let total=await cartHelp.getTotal()
  res.render('user/payment',{user:true,total})
})

module.exports = router;
