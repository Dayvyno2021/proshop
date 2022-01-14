import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import Loader from '../components/Loader'
import {Table, Button, Row, Col} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
import Message from '../components/Message'
import { useNavigate, useParams } from 'react-router-dom'
import Paginate from '../components/Paginate'
import { 
  listProducts, 
  productCreateAction, 
  productCreateResetAction, 
  productDeleteAction 
} from '../actions/productActions'

const ProductListScreen = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()

  const pageNumber = params.pageNumber || 1

  const productList = useSelector(state => state.productList)
  const {loading, products, error, page, pages} = productList

  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin

  const productDeleteReducer = useSelector(state => state.productDeleteReducer)

  const {
    loading:loadingDelete, 
    success: successDelete, 
    error:errorDelete
  } = productDeleteReducer

  const productCreateReducer = useSelector(state => state.productCreateReducer)
  const {
    loading: loadingCreate,
    success: successCreate,
    error: errorCreate,
    product : createdProduct
  } = productCreateReducer

  useEffect(() => {

    dispatch(productCreateResetAction()) //This is here because after creating
    // and updating the product, it will navigate back here, so we need to reset

    if (!userInfo.isAdmin){
      navigate('/login')
    } 
    if (successCreate){
      navigate(`/admin/createproduct/${createdProduct._id}/edit`)
    } else {
      dispatch(listProducts('', pageNumber))
    }
  }, [
    dispatch, 
    navigate, 
    userInfo, 
    successDelete, 
    successCreate, 
    createdProduct,
    pageNumber
  ]) 
  // successDel as a dependency there will force a reload after each delete

  const deleteHandler = (id) =>{
      if(window.confirm('Delete Product')){
        dispatch(productDeleteAction(id))
    }
  }
  
  const createProductHandler = () =>{
    dispatch(productCreateAction())
  }

  return (
    <>
    <Row className='d-flex justify-content-between'>
      <Col>
        <h1>Products</h1>
      </Col>
      <Col className='d-flex justify-content-end'>
        <Button className='my-2' onClick={createProductHandler}>
        <span className="material-icons">add</span>Create Products
        </Button>
      </Col>
    </Row>
      {loadingCreate && <Loader/>}
      {errorCreate && <Message variant={'danger'}> {errorCreate} </Message>}
      {loading && <Loader />}
      {loadingDelete && <Loader/>}
      {error && <Message variant='danger'>{error}</Message>}
      {errorDelete && <Message variant={'danger'}>{error}</Message>}
      {products && (
        <>
          <Table striped bordered hover responsive className='table-xs table-sm '>
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map(product=> (
                <tr key={product._id} >
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>&#8358;{(product.price).toLocaleString()} </td>
                  <td>{product.category}  </td>
                  <td>{product.brand }</td>
                  <td>
                    <LinkContainer to={`/admin/createproduct/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm'>
                        <span className="material-icons">edit</span>
                      </Button>
                    </LinkContainer>
                    <Button variant='danger' className='btn-sm' 
                      onClick={()=>deleteHandler(product._id)}>
                      <span style={{color:'#c2c2a3'}} className="material-icons">delete</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate page={page} pages={pages} isAdmin={true} />
        </>
      )}
    </>
  )
}

export default ProductListScreen
