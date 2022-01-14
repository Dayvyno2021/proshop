import React, {useEffect} from 'react'
import {Link, useLocation, useParams, useNavigate} from 'react-router-dom'
import { addToCart, removeFromCart } from '../actions/cartActions'
import {useDispatch, useSelector} from 'react-redux'
import Message from '../components/Message'
import {Row, Col, ListGroup, Image, Form, Button, Card} from 'react-bootstrap'
import Meta from '../components/Meta'

const CartScreen = () => {

  const params = useParams()
  const productId = params.id

  const location = useLocation()
  const navigate = useNavigate()
  const qty = location.search? Number(location.search.split('=')[1]) : 1

  const cart = useSelector(state => state.cart)
  const {cartItems} = cart

  const dispatch = useDispatch()

  // const removeFromCartHandler = (id) =>{
  //   dispatch(removeFromCart(id))
  // }

  const checkoutHandler =()=>{
    navigate('/login?redirect=shipping')
  }

  useEffect(()=>{
    if (productId){
      dispatch(addToCart(productId, qty))
    }
  },[dispatch, productId, qty])
  
  return (
    <>
    <Meta />
    <Row>
      <Col>
        <Link to={'/'}>shop more<span className="col material-icons">shopping_cart</span></Link>
      </Col>
    </Row>
    <Row>
      <Col md={8}>
        <h1 className='shopping-cart'>Shopping Cart</h1>
        {cartItems.length===0? <Message>
          Your cart is empty <Link to={`/`} >Go Back</Link>
        </Message>: (
          <ListGroup variant='flush'>
            {cartItems.map(item=>(
              <ListGroup key={item.product}>
                <Row className='my-1'>
                  <Col md={2} >
                    <Image src={item.image} alt={item.name} fluid rounded />
                  </Col>
                  <Col md={3} >
                    <Link to={`/product/${item.product}`}>{item.name} </Link>
                  </Col>
                  <Col md={2} >
                    &#8358;{`${(item.price * qty).toLocaleString()}`} 
                  </Col>
                  <Col md={2}>
                    <Form.Select 
                      value={item.qty} onChange={(e)=>dispatch(addToCart(item.product, 
                      Number(e.target.value)))} >
                      {[...Array(item.countInStock).keys()].map(x=>(
                        <option key={x+1} value={x+1}>
                          {x+1}
                        </option>
                        ))}
                    </Form.Select>
                  </Col>
                  <Col md={2}>
                    <Button type='button' variant='light' 
                    onClick={()=>dispatch(removeFromCart(item.product))}>
                      <span className="material-icons">delete</span> 
                    </Button>
                  </Col>
                </Row>
              </ListGroup>
            ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4} >
        <Card>
          <ListGroup variant='flush' >
            <ListGroup.Item>
              <h2>
                Subtotal ({cartItems.reduce((acc, item)=>acc + item.qty, 0)}) items
              </h2>
              &#8358;{Number(cartItems.reduce((acc, item)=> acc + item.price*item.qty, 0)).toLocaleString()}
            </ListGroup.Item>
            <ListGroup.Item className='mx-auto'>
              <Button type='button' className='btn-block' disabled={cartItems.length===0} 
              onClick={checkoutHandler}> 
                Proceed to Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  </>
  )
}

export default CartScreen
