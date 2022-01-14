import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Form, Button} from 'react-bootstrap'
import {useParams, Link, useNavigate} from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { getUserDetails, userProfUpdateByAdminAction, 
  resetAdminUpdatedField
} from '../actions/userAction'

const UserEditScreen = () => {

  const params = useParams()
  const navigate = useNavigate()
  

  const [name, setName] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)


  const dispatch = useDispatch();
  
  const userDetails = useSelector(state => state.userDetails)
  const {loading, error, user} = userDetails

  const userProfUpdateByAdminReducer = useSelector(state => state.userProfUpdateByAdminReducer)
  const {loading:loadingUpdate, success: successUpdate, error: errorUpdate} = 
  userProfUpdateByAdminReducer
  


  useEffect(() => {
    if (successUpdate){
      dispatch(resetAdminUpdatedField())
      navigate('/admin/userlist')
    }else{
      if (!user.name || user._id !==params.id){
        dispatch(getUserDetails(params.id))
      }else{
        setName(user.name)
        setIsAdmin(user.isAdmin)
      }
    }

  }, [dispatch, user, successUpdate, navigate, params.id])
  

  
  const submitHandler =(e)=>{
    e.preventDefault()
    dispatch(userProfUpdateByAdminAction(params.id, {name, isAdmin}))

  }

  return (
    <>
      <Link to={'/admin/userlist'} className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit User</h1>
        {loadingUpdate && <Loader/>}
        {errorUpdate && <Message variant={'danger'}>{errorUpdate}</Message>}
        {loading && <Loader/>}
        {error && <Message variant={'danger'}>{error}</Message>}
        {
          user && (
            <Form onSubmit={submitHandler}>

              <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control onChange={(e)=>setName(e.target.value)} 
                type='name' placeholder='Enter name' value={name}/>
              </Form.Group>
    
              <Form.Group controlId='isadmin'>
                <Form.Check 
                  onChange={(e)=>setIsAdmin(e.target.checked)} 
                  type='checkbox' 
                  checked = {isAdmin}
                  label={`Make ${user.name} Admin`} 
                />
              </Form.Group>
    
              <Button className='my-2' type='submit' variant='primary'>Update</Button>
              {/* {successUpdate && <Message variant={'success'}>Profile Updated</Message>} */}
            </Form>
          )
        }

      </FormContainer>
    </>
  )
}

export default UserEditScreen
