import Product from '../models/productModel.js'


// @desc  Fetch all products
// @route GET /api/products
// @access Public
const getProducts =async(req, res)=>{
  try {
    const pageSize = 12 //Number of items in a page
    const page = Number(req.query.pageNumber) || 1 //current page
  
    const searchparams = req.query.searchparams? {
      name: {
        $regex: req.query.searchparams,
        $options: 'i'
      }
    } : {}

    const count = await Product.count({...searchparams})

    const products = await Product.find({...searchparams})
    .limit(pageSize)
    .skip(pageSize*(page-1))

    res.json({products, page, pages: Math.ceil(count / pageSize)})
    // const products = await Product.find({})
    // res.json(products)

  } catch (error) {
    res.status(404).json({
      message: 'Failed to fetch data',
      systemMessage: process.env.NODE_ENV==='production'? null:error
    })
  }
}

// @desc  Fetch a single product
// @route GET /api/products/:id
// @access Public
const getProductById=async (req, res)=>{

  try {
    const product = await Product.findById(req.params.id)
    res.json(product)
  } catch (error) {
    res.status(404).json({
      message: 'Failed to fetch data',
      systemMessage: process.env.NODE_ENV==='production'? null:error
    })
  }
}

// @desc  Delete a product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct=async (req, res)=>{

  try {
    const product = await Product.findById(req.params.id)
    if (product){
      await product.remove()
      res.json("Product Deleted")
    }else {
      res.status(400).json("Already Deleted")
    }

  } catch (error) {
    res.status(404).json({
      message: 'Could not find product',
      systemMessage: error 
    })
  }
}

// @desc  Create a product
// @route POST /api/products
// @access /Private/Admin
  const createProduct=async (req, res)=>{
    
    try {
      const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: 'Sample category',
        countInStock: 0,
        numReviews: 0,
        description:'Sample description'
      })
      const createdProduct = await product.save()
      if (createdProduct){
        res.status(201).json(createdProduct)
      } else {
        res.status(404).json("Could not create peoduct")
      }
      
    } catch (error) {
      res.status(404).json({
        message: 'Could not create product',
        systemMessage: error 
      })
      
    }

  }


// @desc  Update a product
// @route PUT /api/products/:id
// @access Private/Admin
const updateProduct=async (req, res)=>{
    
  try {

    const product = await Product.findById(req.params.id)
    if (product){
      const {
        name, 
        price,
        image, 
        brand, 
        category, 
        countInStock, 
        numReviews, 
        description
      } = req.body

      product.name =name,
      product.price = price,
      product.image = image ,
      product.brand = brand,
      product.category = category,
      product.countInStock = countInStock,
      product.numReviews = numReviews,
      product.description = description

      const updatedproduct = await product.save()
      if (updatedproduct){
        res.json(updatedproduct)
      } else{
        res.status(401).json('Could not update new product')
      }

    } else{
      res.status(404).json("could not find product")
    }

    
  } catch (error) {
    res.status(404).json({
      message: 'Server could not Update product',
      systemMessage: process.env.NODE_ENV==='production'? null:error
    })
    
  }
}


// @desc  Create new review
// @route POST /api/products/:id/reviews
// @access /Private
const createProductReview=async (req, res)=>{
    
  try {
    const {rating, comment} = req.body

    const product = await Product.findById(req.params.id)
    if (product){
      const alreadyreviewed  =  product.reviews.find(r=> 
        r.user.toString()===req.user._id.toString())
        if (alreadyreviewed){
          res.status(400).json('product already reviewed by you')
        } else{
          const review = {
            name : req.user.name,
            rating: Number(rating), 
            comment, 
            user: req.user._id
          }
          product.reviews.push(review)
          product.numReviews = product.reviews.length
          product.rating = 
          product.reviews.reduce((acc, review)=>acc + review.rating, 0)/product.reviews.length

          await product.save()
          res.status(201).json({message: 'Review added'})
        }

    } else{
      res.status(404).json("Product not found")
    }
    
  } catch (error) {
    res.status(404).json({
      message: 'Server could not Update review',
      systemMessage: process.env.NODE_ENV==='production'? null:error
    })
    
  }
}

// @desc  get top rated products
// @route GET /api/products/top
// @access /Public
const getTopProducts=async (req, res)=>{
    try {
      const products = await Product.find({}).sort({rating:-1}).limit(4)
      res.json(products)
      
    } catch (error) {
      res.status(400).json({
        message: "Could not get top Products",
        systemMessage: process.env.NODE_ENV==='production'? null:error
      })
    }  
  }


export {
  getProducts, 
  getProductById, 
  deleteProduct, 
  createProduct, 
  updateProduct, 
  createProductReview,
  getTopProducts
}
