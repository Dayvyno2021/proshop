import React, {useState} from 'react'
import {Form, Button} from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { saveShippingAddress } from '../actions/cartActions'
import FormContainer from '../components/FormContainer'
import { useNavigate } from 'react-router-dom'
import CheckoutSteps from '../components/CheckoutSteps'

const ShippingScreen = () => {

  const cart = useSelector(state => state.cart)
  const {shippingAddress} = cart

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [address, setAddress] = useState(shippingAddress.address)
  const [city, setCity] = useState(shippingAddress.city)
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode)
  const [country, setCountry] = useState(shippingAddress.country)
  
  const submitHandler =(e)=>{
    e.preventDefault()
    dispatch(saveShippingAddress({address, city, postalCode, country}))
    navigate('/payment')
  }
  

  return (
    <FormContainer>
      <h1>Shipping</h1>
      <CheckoutSteps step1 step2/>
      <Form onSubmit={submitHandler} > 
        <Form.Group controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control onChange={(e)=>setAddress(e.target.value)} 
          type='text' required placeholder='Enter Address'  value={address}/>
        </Form.Group>

        <Form.Group controlId='city'>
          <Form.Label>City</Form.Label>
          <Form.Control onChange={(e)=>setCity(e.target.value)} 
          type='text' required placeholder='Enter City' value={city}/>
        </Form.Group>

        <Form.Group controlId='postalCode'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control onChange={(e)=>setPostalCode(e.target.value)} 
          type='text' required placeholder='Enter Postal Code' value={postalCode}/>
        </Form.Group>

        <Form.Group controlId='country'>
          <Form.Label>Country</Form.Label>
          <Form.Control onChange={(e)=>setCountry(e.target.value)} 
          type='text' required placeholder='Enter Country' value={country}/>
        </Form.Group>
        <Button className='my-2' type='submit' variant='primary'>Continue</Button>

      </Form>
    </FormContainer>
  )
}

export default ShippingScreen