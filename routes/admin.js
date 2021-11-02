const { response } = require('express');
var express = require('express');
var router = express.Router();
var productHelp=require('../help/product_help')
const userHelp=require('../help/signup_help')

/* GET users listing. */
router.get('/',(req,res)=>{
  if(req.session.loggedIn)
  res.redirect("/admin/products")   
  else
  {
    res.render('admin/login',{admin:true, "logerr":req.session.loginErr})
    req.session.loginErr=false
  }
})

router.post('/',(req,res)=>{
  userHelp.doLogin(req.body).then((response)=>{
    if(response.status)
    {
      req.session.loggedIn=true
      req.session.employee=response.employee
      res.redirect('/admin/products')
    }
    else
    {
      req.session.loginErr=true
      res.redirect('/admin')
    }
  })
})

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/admin')
})

router.get('/signup',(req,res)=>{
  res.render('admin/signup',{admin:true})
})

router.post('/signup',(req,res)=>{
  userHelp.doSignup(req.body).then((response)=>{
    console.log(response)
  })
  res.render('admin/login',{admin:true})
})

router.get('/products', function(req, res, next) {
  let employee=req.session.employee
  console.log(employee)
  if(req.session.loggedIn)
  {
    productHelp.getAllProducts().then((products)=>{
      res.render('admin/view_products',{admin:true,products,employee})
    })
  }
  else
  res.redirect('/admin')
});

router.get('/add-product',function(req,res){
  let employee=req.session.employee
  if(req.session.loggedIn)
  {
    productHelp.getAllProducts().then((products)=>{
      res.render('admin/add-product',{admin:true,employee})
    })
  }
  else
  res.redirect('/admin')
})

router.post('/add-product',(req,res)=>{
  let employee=req.session.employee
  console.log(req.body)
  console.log(req.files.Image);

  productHelp.addProduct(req.body,(id)=>
  {
    let image=req.files.Image
    let employee=req.session.employee
    image.mv('./public/images/'+id+'.jpeg'),(err,done)=>{
    }
    res.redirect("/admin/products") 
  })
})


router.get('/products/edit',(req,res)=>{

})

router.get('/products/delete/:ID',(req,res)=>{
  let itemid=req.params.ID
  console.log(itemid)
  productHelp.deleteitem(itemid).then((response)=>{
    console.log(response)
    res.redirect("/admin/products")
  })
})

router.get('/products/edit/:ID',async(req,res)=>{
  let itemid=req.params.ID
  console.log(itemid)
  let employee=req.session.employee
  let product=await productHelp.getdetails(itemid)
  console.log(product)
  res.render('admin/edit-product',{admin:true,employee,product})
})

router.post('/products/edit/:ID',(req,res)=>{
  let itemid=req.params.ID
  productHelp.updateitem(req.body).then(()=>{
    res.redirect('/admin/products')
    if(req.files.Image){
      let image=req.files.Image
      image.mv('./public/images/'+itemid+'.jpeg')
    }
  })
})
module.exports = router;
