import Order from '../models/orderModel.js'


// @desc  Create new Order
// @route POST /api/orders
// @access Private
const addOrderItems =async(req, res)=>{

  try {
    const {
      orderItems, 
      shippingAddress, 
      paymentMethod, 
      itemsPrice, 
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body

    if (orderItems && orderItems.length===0){
      return res.status(400).json({
        message: "No item has been selected"
      })
      //return 
    } else{
      const order = new Order ({
        user: req.user._id,  
        orderItems, 
        shippingAddress, 
        paymentMethod, 
        itemsPrice, 
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentResult: {}
      })
      const createOrder = await order.save()

      if (createOrder){
        res.json({
          _id: createOrder._id
        })
      } else {
        res.status(400).json({
          message: '_id not found'
        })
      }
    }

  } catch (error) {
    res.status(404).json({
      message: 'Order could not be placed, server error',
      systemMessage: process.env.NODE_ENV==='production'? null: error
    })
  }
}

// @desc  Get order by ID
// @route GET /api/orders/:id
// @access Private
const getOrderById =async(req, res)=>{
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email')
  if (order){
    res.json(order)
  } else {
    res.status(400).json({
      message: "Server error, order not found"
    })
  }

  } catch (error) {
    res.status(400).json({
      message: 'Order not found',
      systemMessage: process.env.NODE_ENV==='production'? null: error
    })
  }
}

// @desc  Update order to paid
// @route put /api/orders/:id/pay
// @access Private
const updateOrderToPaid =async(req, res)=>{
  try {
    const order = await Order.findById(req.params.id)
  if (order){
    //This payment method is for PayPal. Another payment method will likely different varriables
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address
    }

    const updatedOrder = await order.save()

    res.json(updatedOrder)

  } else {
    res.status(400).json({
      message: "Server error, order could not be updated"
    })
  }

  } catch (error) {
    res.status(400).json({
      message: 'Order could not be updated',
      systemMessage: process.env.NODE_ENV==='production'? null: error
    })
  }
}

// @desc  Get logged in user orders
// @route GET /api/orders/myorders
// @access Private
const getMyOrders =async(req, res)=>{
  try {
    const order = await Order.find({user: req.user._id})
    res.json(order)

  } catch (error) {
    res.status(400).json({
      message: 'Order could not be updated',
      systemMessage: process.env.NODE_ENV==='production'? null: error
    })
  }
}


// @desc  Get all orders
// @route GET /api/orders
// @access Private/Admin
const getOrders =async(req, res)=>{
  try {
    const orders = await Order.find({}).populate('user', 'id name')
    res.json(orders)

  } catch (error) {
    res.status(400).json({
      message: 'Orders not found',
      systemMessage: process.env.NODE_ENV==='production'? null: error
    })
  }
}


// @desc  Update order to delivered
// @route PUT /api/orders/:id/delivered
// @access Private/Admin
const updateOrderToDelivered =async(req, res)=>{
  try {
    const order = await Order.findById(req.params.id)
  if (order){
    //This payment method is for PayPal. Another payment method will likely different varriables
    order.isDelivered = true
    order.deliveredAt = Date.now()

    const updatedOrder = await order.save()

    res.json(updatedOrder)

  } else {
    res.status(400).json({
      message: "Server error, order could not be updated to delivered"
    })
  }

  } catch (error) {
    res.status(400).json({
      message: 'Order could not be updated',
      systemMessage: process.env.NODE_ENV==='production'? null: error
    })
  }
}


export {
  addOrderItems, 
  getOrderById, 
  updateOrderToPaid, 
  getMyOrders, 
  getOrders,
  updateOrderToDelivered
}