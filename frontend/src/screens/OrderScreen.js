import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Row, ListGroup, Image, Col, Button, Card} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import { useParams, useNavigate } from 'react-router-dom'
import Loader from '../components/Loader'
import { 
  getOrderDetailsAction, 
  orderDeliverAction, 
  orderPaymentAction, 
  orderPaymentResetAtion } from '../actions/orderActions'
import { PayPalButton } from "react-paypal-button-v2"
import { ORDER_DELIVER_RESET } from '../constants/orderConstants'



const OrderScreen = () => {

  const params = useParams()
  const navigate = useNavigate()

  const [sdkReady, setSdkReady] = useState(false)

  const dispatch = useDispatch()

  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin

  const orderDetailsReducer = useSelector(state => state.orderDetailsReducer)
  const {loading, order, error} = orderDetailsReducer

  const orderPaymentReducer = useSelector(state => state.orderPaymentReducer)
  const {loading: loadingPay, success:successPay} = orderPaymentReducer

  const orderDeliverReducer = useSelector(state => state.orderDeliverReducer)
  const {
    loading: loadingDeliver,
    success: successDeliver
  } = orderDeliverReducer

  useEffect(()=>{
    if (!userInfo){
      navigate('/login')
    }

    const addPayPalScript = async ()=>{
      const script = document.createElement('script')
      const {data: clientId} = await axios.get('/api/config/paypal')
      script.type = 'text/javascript'
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
      script.async = true
      script.onload = ()=>setSdkReady(true) //Tells us if the paypal script has been loaded
      document.body.appendChild(script)
    }

    //Below conditional will cause the dispatch to happen twice
    //1. When !order
    //2. When successPay. this happens later after running successPaymentHandler
    if (!order || successPay || successDeliver){ 
      dispatch({type: ORDER_DELIVER_RESET})
      dispatch(orderPaymentResetAtion()) //without this, when you pay, it keeps refreshing
      dispatch(getOrderDetailsAction(params.id))
    } 
    else if(!order.isPaid ){
      if(!window.paypal){
        addPayPalScript()
      }else{
        setSdkReady(true)
      }
    }
  
  }, [dispatch, params.id, order, successPay, successDeliver, navigate, userInfo])

  if (order){
    order.itemsPrice = order.orderItems.reduce((total, value)=>
    total + value.price * value.qty, 0)
  }

  const successPaymentHandler = (paymentResult)=>{
    // console.log(paymentResult)
    dispatch(orderPaymentAction(params.id, paymentResult))
  }

  const deliverhandler = ()=>{
    dispatch(orderDeliverAction(order))

  }

  return (
    <>
      {loadingDeliver && <Loader/>}
      {loading && <Loader />}
      {error && <Message variant={'danger'}>{error} </Message> }
      {order && <>
        <Row>
        <Col md={8}>
          <ListGroup variant='flush'>
            <ListGroup.Item>
              <h2 className='poTextColor'>Shipping</h2>
              <strong>Name: </strong>{order.user.name}
              <p> <strong>Email: </strong><a href={`mailto: ${order.user.email}`}>{order.user.email} </a></p>
              <p>
                <strong>Address:{' '}</strong>
                {order.shippingAddress.address},{' '}
                {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>

              {order.isDelivered? 
              <Message variant={'success'}>Delivered on:{' '}{order.deliveredAt} </Message>:
              <Message variant={'danger'}>Delivery Pending</Message>
            }

            </ListGroup.Item>
            <ListGroup.Item>
              <h2 className='poTextColor'>Payment Method</h2>
              <p> <strong>Method: {' '}</strong> {order.paymentMethod} </p>
              {order.isPaid? 
              <Message variant={'success'}>Paid on:{' '}{order.paidAt}</Message>:
              <Message variant={'danger'}>Payment Pending</Message>
            }
            </ListGroup.Item>
            <ListGroup.Item>
              <h2 className='poTextColor'>Order Items</h2>
              {
                order.orderItems.length === 0 ? <Message>Order is empty</Message>:
                (
                  <ListGroup variant='flush'>
                    {order.orderItems.map((item, index)=>(
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}>
                            <Image src={item.image} alt={item.name} fluid rounded />
                          </Col>
                          <Col>
                            <Link to={`/product/${item.product}`}>{item.name}</Link>
                          </Col>
                          <Col md={4} >
                            {item.qty} x &#8358;{(Number(item.price)).toLocaleString()} = 
                            &#8358;{(Number(item.qty * item.price)).toLocaleString()}
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
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>&#8358;{(Number(order.itemsPrice)).toLocaleString()} </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>&#8358;{(Number(order.shippingPrice)).toLocaleString()} </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>&#8358;{(Number(order.taxPrice)).toLocaleString()} </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>&#8358;{(Number(order.totalPrice)).toLocaleString()} </Col>
                </Row>
              </ListGroup.Item>
              {
                (!order.isPaid && order.paymentMethod==='PayPal') && (
                  <ListGroup.Item>
                    {loadingPay && <Loader/>}
                    {!sdkReady? <Loader/>:
                      <PayPalButton amount={order.totalPrice} 
                        onSuccess={successPaymentHandler} 
                      />
                    }
                  </ListGroup.Item>
                )
              }
              {
                userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  
                  <ListGroup.Item>
                    <Button
                      type='button' className='btn btn-block'
                      onClick={deliverhandler}
                    >
                      Mark as Delivered
                      </Button>
                  </ListGroup.Item>
                )
              }
            </ListGroup>
          </Card>
        </Col>
      </Row>
      </>}   
    </> 
  )
}

export default OrderScreen
