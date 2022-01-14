import React, {useEffect, useState} from 'react'
import { login } from '../actions/userAction'
import {useDispatch, useSelector} from 'react-redux'
import {Form, Row, Col, Button} from 'react-bootstrap'
import {Link, useLocation, useNavigate} from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import Meta from '../components/Meta'

const LoginScreen = () => {

  const location = useLocation()
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  const redirect = location.search? location.search.split('=')[1] : '/'

  const dispatch = useDispatch();
  const userLogin = useSelector(state => state.userLogin)
  
  const {loading, userInfo, error} = userLogin
  
  useEffect(()=>{
    if (userInfo){
      navigate(redirect) //will take you to /login/shipping if location.search exists
    }
  }, [userInfo, redirect, navigate])
  
  const submitHandler =(e)=>{
    e.preventDefault()
    dispatch(login(email, password))
  }

  return (
    <FormContainer>
      <Meta title='Login to DayveOshop'/>
      <h1>Sign In</h1>
      {error && <Message variant={'danger'}>{error}</Message>}
      {loading && <Loader/>}
      <Form onSubmit={submitHandler}>
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
        <Button className='my-2' type='submit' variant='primary'>Sign In</Button>
      </Form>
      <Row className='py-2'>
        <Col>
          New Customer?{' '}
          <Link to={redirect? `/register?redirect=${redirect}`:'/register'}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen
