import React, {useEffect, useState} from 'react'
import { getUserDetails, updateUserProfile } from '../actions/userAction'
import {useDispatch, useSelector} from 'react-redux'
import {Form, Row, Col, Button, Table} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import {LinkContainer} from 'react-router-bootstrap'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { orderMyListAction } from '../actions/orderActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'

const ProfileScreen = () => {

  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  

  const dispatch = useDispatch();
  const userDetails = useSelector(state => state.userDetails)
  const {loading, error, user} = userDetails

  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin

  const userUpdateProfileReducer = useSelector(state => state.userUpdateProfileReducer)
  const {success} = userUpdateProfileReducer

  const orderMyListReducer = useSelector(state => state.orderMyListReducer)
  const {loading: loadingList, listOrders, error:errorList} = orderMyListReducer
  
  useEffect(()=>{
    if (!userInfo){
      navigate('/login')
    } else {
      if (!user || !user.name || success){
        dispatch({type: USER_UPDATE_PROFILE_RESET})
        dispatch(getUserDetails('profile'))
        dispatch(orderMyListAction())
      }
      else{
        setName(user.name)
        setEmail(user.email)
      }
    }
  }, [dispatch, user, userInfo, navigate, success])
  
  const submitHandler =(e)=>{
    e.preventDefault()
    if(password !== confirmPassword){
      setMessage("Passwords do not match")
    } else {
      dispatch(updateUserProfile({id: user._id, name, email, password}))
    }
  }

  return (
    <Row>
      <Col md={3}>  
        <h2>User Profile</h2>
        {message && <Message variant={'danger'}>{message}</Message>}
        {error && <Message variant={'danger'}>{error}</Message>}
        {success && <Message variant={'success'}>Profile Updated</Message>}
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
          <Form.Group className='d-flex justify-content-center' >
            <Button className='my-2' type='submit' variant='primary'>Update</Button>
          </Form.Group>

        </Form>
      </Col>
      <Col md={9}>
        <h2>My Orders</h2>
        {loadingList && <Loader/> } 
        {errorList && <Message variant={'danger'}>{errorList}</Message>} 
        {listOrders && 
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {listOrders.map((order)=>(
              <tr key={order._id}>
                <td>{order._id} </td>
                <td> {order.createdAt} </td>
                <td> &#8358;{(Number(order.totalPrice)).toLocaleString()} </td>
                <td> {order.isPaid?  
                  <span>{order.paidAt.substr(0, 10)}
                    <span className="material-icons" style={{color:'green'}}>gpp_good</span>
                  </span>
                :
                  <span style={{color:'red'}} className='material-icons'>close</span>  } 
                </td>
                <td> {order.isDelivered?
                    <span style={{color:'green'}}  className="material-icons">gpp_good</span>:
                    <span style={{color:'red'}} className='material-icons'>close</span>
                    } 
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='light'>Details</Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        }
      </Col>
    </Row>
  )
}

export default ProfileScreen