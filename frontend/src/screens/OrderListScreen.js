import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Loader from '../components/Loader'
import {Table, Button} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import Message from '../components/Message'
import { useNavigate } from 'react-router-dom'
import {orderListAction} from '../actions/orderActions'

const OrderListScreen = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const orderListReducer = useSelector(state => state.orderListReducer)
  const {loading, allOrders, error} = orderListReducer

  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin

  useEffect(() => {
    if (userInfo && userInfo.isAdmin){
      dispatch(orderListAction())
    } else {
      navigate('/login')
    }
  }, [dispatch, navigate, userInfo]) 


  return (
    <>
      {loading && <Loader />}
      <h1>Orders</h1> 
      {error && <Message variant='danger'>{error}</Message>}
      {allOrders && (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>PAYMENT DATE</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map(order=> (
              <tr key={order._id} >
                <td>{order._id}</td>
                <td>{order.user && order.name}</td>
                <td> {order.createdAt.substring(0, 10)} </td>
                <td>&#8358;{order.totalPrice.toLocaleString()} </td>
                <td>
                  {
                    order.isPaid? 
                    <span style={{color:'green'}} className="material-icons">check</span>:
                    <span style={{color:'red'}} className="material-icons">clear</span>
                  }
                </td>
                <td>
                  {
                    order.isPaid? (order.paidAt.substring(0, 10)) :
                    (<span style={{color:'red'}} className="material-icons">clear</span>)
                  }
                </td>
                <td>
                  {
                    order.isDelivered? (order.deliveredAt.substring(0, 10)) :
                    (<span style={{color:'red'}} className="material-icons">clear</span>)
                  }
                </td>

                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='light' className='btn-sm'>
                      Details
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default OrderListScreen
