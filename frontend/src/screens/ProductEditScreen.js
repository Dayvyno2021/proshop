
import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Form, Button} from 'react-bootstrap'
import {useParams, Link, useNavigate} from 'react-router-dom'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainer from '../components/FormContainer'
import { listProductDetails, productUpdateAction/*, productUpdateResetAction */} from '../actions/productActions'
import { PRODUCT_UPDATE_RESET } from '../constants/productsConstants'

const ProductEditScreen = () => {

  const params = useParams()
  const navigate = useNavigate()
  

  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [image, setImage] = useState('')
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)


  const dispatch = useDispatch();
  
  const productDetails = useSelector(state => state.productDetails)
  const {loading, error, product} = productDetails

  const productUpdateReducer = useSelector(state => state.productUpdateReducer)
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate
  } = productUpdateReducer
  
//|| product._id !== params.id
  useEffect(() => {

    if (successUpdate){
      dispatch({type:PRODUCT_UPDATE_RESET})
      navigate('/admin/productlist')
    } else{
      if (!product.name ){
        dispatch(listProductDetails(params.id))
      }else{
        setName(product.name)
        setPrice(product.price)
        setImage(product.image)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setDescription(product.description)
        }
    }

  }, [dispatch, product, params.id, successUpdate, navigate])
  
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }

      const { data } = await axios.post('/api/upload', formData, config)

      setImage(data)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }

  
  const submitHandler =(e)=>{
    e.preventDefault()
    dispatch(productUpdateAction({
      _id : params.id, //coming from the url
      name,
      price,
      image,
      brand,
      category,
      countInStock,
      description,
    }))

  }

  return (
    <>
    {uploading && <Loader />}
      <Link to={'/admin/productlist'} className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormContainer>
        <strong><h1 className='text-success'>Add New Product</h1></strong>
        {loadingUpdate && <Loader/>}
        {errorUpdate && <Message variant={'danger'}>{errorUpdate} </Message> }
        {loading && <Loader/>}
        {error && <Message variant={'danger'}>{error}</Message>}
        {
          product && (
            <Form onSubmit={submitHandler}>

              <Form.Group controlId='name'>
                <Form.Label className='text-success'>Name</Form.Label>
                <Form.Control onChange={(e)=>setName(e.target.value)} 
                type='name' placeholder='Enter name' value={name}/>
              </Form.Group>

              <Form.Group controlId='price'>
                <Form.Label className='text-success'>Price</Form.Label>
                <Form.Control onChange={(e)=>setPrice(e.target.value)} 
                type='number' placeholder='Enter Price' value={price}/>
              </Form.Group>

              <Form.Group controlId='image'>
                <Form.Label className='text-success'>Image</Form.Label>
                <Form.Control 
                  onChange={(e)=>setImage(e.target.value)} 
                  type='text' 
                  placeholder='Enter image url' 
                  value={image}
                ></Form.Control>
   
              </Form.Group>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Label className='text-success'>Default file input example</Form.Label>
                <Form.Control 
                  type="file"   
                  onChange={uploadFileHandler} 
                />
              </Form.Group>

              <Form.Group controlId='brand'>
                <Form.Label className='text-success'>Brand</Form.Label>
                <Form.Control onChange={(e)=>setBrand(e.target.value)} 
                type='text' placeholder='Enter Brand' value={brand}/>
              </Form.Group>

              <Form.Group controlId='category'>
                <Form.Label className='text-success'>Category</Form.Label>
                <Form.Control onChange={(e)=>setCategory(e.target.value)} 
                type='text' placeholder='Enter Category' value={category}/>
              </Form.Group>

              <Form.Group controlId='countInStock'>
                <Form.Label className='text-success'>CountInStock</Form.Label>
                <Form.Control onChange={(e)=>setCountInStock(e.target.value)} 
                type='number' placeholder='Enter CountInStock' value={countInStock}/>
              </Form.Group>

              <Form.Group controlId='description'>
               <Form.Label className='text-success'>Description</Form.Label>
                <Form.Control onChange={(e)=>setDescription(e.target.value)} 
                type='text' placeholder='Enter Description' value={description}/>
              </Form.Group>
              <Form.Group className='d-flex justify-content-center'>
                <Button className='my-2' type='submit' variant='primary'>Update</Button>
              </Form.Group>
            </Form>
          )
        }

      </FormContainer>
    </>
  )
}

export default ProductEditScreen

