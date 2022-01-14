import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import { listUsersAction, userDeleteAction } from '../actions/userAction'
import Loader from '../components/Loader'
import {Table, Button} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import Message from '../components/Message'
import { useNavigate } from 'react-router-dom'

const UserListScreen = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userListReducer = useSelector(state => state.userListReducer)
  const {loading, users, error} = userListReducer

  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin

  const userDeleteReducer = useSelector(state => state.userDeleteReducer)
  const {success: successDel} = userDeleteReducer

  useEffect(() => {
    if (userInfo && userInfo.isAdmin){
      dispatch(listUsersAction())
    } else {
      navigate('/login')
    }
  }, [dispatch, navigate, userInfo, successDel]) 
  // successDel as a dependency there will force a reload after each delete

  const deleteHandler = (id) =>{
    if (window.confirm('Confirm user delete')){
      dispatch(userDeleteAction(id))
    }
  }

  return (
    <>
      <h1>Users</h1> 
      {loading && <Loader />}
      {error && <Message variant='danger'>{error}</Message>}
      {users && (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>ADMIN</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map(user=> (
              <tr key={user._id} >
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td> <a href={`mailto:${user.email}`} >{user.email}</a> </td>
                <td>
                  {
                    user.isAdmin? 
                    <span style={{color:'green'}} className="material-icons">check</span>:
                    <span style={{color:'red'}} className="material-icons">clear</span>
                  }
                </td>
                <td>
                  <LinkContainer to={`/admin/user/${user._id}/edit`}>
                    <Button variant='light' className='btn-sm'>
                      <span className="material-icons">edit</span>
                    </Button>
                  </LinkContainer>
                  <Button variant='danger' className='btn-sm' 
                    onClick={()=>deleteHandler(user._id)}>
                    <span style={{color:'#c2c2a3'}} className="material-icons">delete</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default UserListScreen
