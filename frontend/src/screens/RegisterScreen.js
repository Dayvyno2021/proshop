import React, {useEffect, useState} from 'react'
import { register } from '../actions/userAction'
import {useDispatch, useSelector} from 'react-redux'
import {Form, Row, Col, Button} from 'react-bootstrap'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import Meta from '../components/Meta'

const RegisterScreen = () => {

  const location = useLocation()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  
  const redirect = location.search? location.search.split('=')[1] : '/'

  const dispatch = useDispatch();
  const userRegister = useSelector(state => state.userRegister)
  
  const {loading, userInfo, error} = userRegister
  
  useEffect(()=>{
    if (userInfo){
      navigate(redirect)
    }
  }, [userInfo, redirect, navigate])
  
  const submitHandler =(e)=>{
    e.preventDefault()
    if(password !== confirmPassword){
      setMessage("Passwords do not match")
    } else {
      dispatch(register(name, email, password))
    }
  }

  return (
    <FormContainer>
      <Meta title='Register' />
      <h1>Sign Up</h1>
      {message && <Message variant={'danger'}>{message}</Message>}
      {error && <Message variant={'danger'}>{error}</Message>}
      {loading && <Loader/>}
      <Form onSubmit={submitHandler}>

        <Form.Group controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control onChange={(e)=>setName(e.target.value)} 
          type='name' placeholder='Enter name' value={name}/>
        </Form.Group>

        <Form.Group controlId='email'>
          <Form.Label>Email</Form.Label>
          <Form.Control onChange={(e)=>setEmail(e.target.value)} 
          type='email' placeholder='Enter email' value={email}/>
        </Form.Group>
        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control onChange={(e)=>setPassword(e.target.value)} 
          type='password' placeholder='Enter password' value={password}/>
        </Form.Group>

        <Form.Group controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control onChange={(e)=>setConfirmPassword(e.target.value)} 
          type='password' placeholder='Confirm password' value={confirmPassword}/>
        </Form.Group>
        <div className='d-flex justify-content-center'>
          <Button className='my-2' type='submit' variant='primary'>Register</Button>
        </div>
      </Form>
      <Row className='py-2'>
        <Col>
          Have an Account?{' '}
          <Link to={redirect? `/login?redirect=${redirect}`:'/login'}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default RegisterScreen
