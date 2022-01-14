import React, {useState, useEffect} from 'react'
import {Form, Button, Col} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { savePaymentMethod} from '../actions/cartActions'
import FormContainer from '../components/FormContainer'
import { useNavigate } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'

const PaymentScreen = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const cart = useSelector(state => state.cart)


  const [paymentMethod, setPaymentMethod] = useState(cart.paymentMethod)

  const submitHandler =(e)=>{
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    navigate('/placeorder')
  }

  useEffect(() => {
    if(Object.keys(cart.shippingAddress).length===0){
      navigate('/login/shipping')
    }
    dispatch(savePaymentMethod(paymentMethod))
  }, [cart.shippingAddress, navigate, dispatch, paymentMethod])

  return (
    <FormContainer>
      <h1>Payment Method</h1>
      <CheckoutSteps step1 step2 step3/>
      <Form onSubmit={submitHandler} > 
        <Form.Group>
          <Form.Label as='legend'>Select Method</Form.Label>
          <Col>
            <Form.Check 
              type='radio' 
              label='PayStack' 
              id='paystack' 
              name='paymentMethod' 
              disabled
              value='PayStack' 
              checked={cart.paymentMethod==="PayStack"}
              onChange={(e)=>setPaymentMethod(e.target.value)} 
              ></Form.Check>
            <Form.Check 
              type='radio' 
              label='Paypal or Credit Card' 
              id='PayPal' 
              name='paymentMethod' 
              value='PayPal' 
              checked ={cart.paymentMethod==="PayPal"}
              onChange ={(e)=>setPaymentMethod(e.target.value)} 
              ></Form.Check>
            <Form.Check 
              type='radio' 
              label='Flutterwave' 
              disabled
              id='flutterwave' 
              value='Flutterwave' 
              checked={cart.paymentMethod==="Flutterwave"}
              name='paymentMethod' 
              onChange={(e)=>setPaymentMethod(e.target.value)} 
              ></Form.Check>
            <Form.Check 
              type='radio' 
              label='Quickteller' 
              disabled
              id='quickteller' 
              value='Quickteller' 
              checked={cart.paymentMethod==="Quickteller"}
              name='paymentMethod' 
              onChange={(e)=>setPaymentMethod(e.target.value)} 
              ></Form.Check>
          </Col>      
        </Form.Group> 
        <Form.Group className='d-flex justify-content-center'>
         <Button className='my-2 btn-block' type='submit' variant='primary'>Continue</Button>
        </Form.Group>
      </Form>
    </FormContainer>
  )
}

export default PaymentScreen