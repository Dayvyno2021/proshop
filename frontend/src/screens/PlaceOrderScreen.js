import React, {useEffect} from 'react'
import {Row, ListGroup, Image, Col, Button, Card} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import { useNavigate } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'
import { createOrderAction } from '../actions/orderActions'


const PlaceOrderScreen = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const cart = useSelector(state => state.cart)

  // Calculate Prices
  cart.itemsPrice = cart.cartItems.reduce((total, cartItem)=>
  total + cartItem.price * cartItem.qty, 0)

  cart.shippingPrice = Math.round(Number(cart.itemsPrice * 0.1)) 

  cart.taxPrice =Math.round(Number(cart.itemsPrice * 0.15)) 

  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice


  const orderCreateReducer = useSelector(state => state.orderCreateReducer)
  const {success, order, error} = orderCreateReducer

  useEffect(()=>{
    
    if (success){
      navigate(`/order/${order._id}`)
    }
  }, [success, navigate, order])

  const placeOrderHandler =()=>{
    dispatch(createOrderAction({
      orderItems: cart.cartItems, 
      shippingAddress: cart.shippingAddress , 
      paymentMethod: cart.paymentMethod , 
      itemsPrice:  cart.itemsPrice,
      taxPrice:  cart.taxPrice,
      shippingPrice:  cart.shippingPrice,
      totalPrice:  cart.totalPrice
    }))
  }

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4/>
      <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2 className='poTextColor'>Shipping</h2>
              <p>
                <strong>Address:{' '}</strong>
                {cart.shippingAddress.address},{' '}
                {cart.shippingAddress.city},{' '}
                {cart.shippingAddress.postalCode},{' '}
                {cart.shippingAddress.country}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2 className='poTextColor'>Payment Method</h2>
              <p>
                <strong>Method: {' '}</strong> {cart.paymentMethod}
              </p>
            </ListGroup.Item>
            <ListGroup.Item>
              <h2 className='poTextColor'>Order Items</h2>
              {
                cart.cartItems.length === 0 ? <Message>Your Cart is empty</Message>:
                (
                  <ListGroup variant='flush'>
                    {cart.cartItems.map((item, index)=>(
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col xs={2} md={1}>
                            <Image src={item.image} alt={item.name} fluid rounded />
                          </Col>
                          <Col>
                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                          </Col>
                          <Col md={4} >
                            {item.qty} x &#8358;{(item.price).toLocaleString()} = 
                            &#8358;{(item.qty * item.price).toLocaleString()}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )
              }
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <Col><h2>Order Summary</h2></Col>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>&#8358;{(cart.itemsPrice).toLocaleString()} </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>&#8358;{(cart.shippingPrice).toLocaleString()} </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>&#8358;{(cart.taxPrice).toLocaleString()} </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>&#8358;{(cart.totalPrice).toLocaleString()} </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                {error && <Message variant={'danger'}>{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item className='d-flex justify-content-center'>
                <Button type='button' 
                  disable={cart.cartItems.length===0? true:undefined} 
                  onClick={placeOrderHandler}  
                >Place Order</Button>
              </ListGroup.Item>

            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default PlaceOrderScreen
