import React, {useState, useEffect} from 'react'
import { Link, useParams, useNavigate} from 'react-router-dom';
import {Row, Col, Image, ListGroup, Card, Button, Form} from 'react-bootstrap'
import Rating from '../components/Rating';
import { useDispatch, useSelector} from 'react-redux';
import { listProductDetails, productCreateReviewAction } from '../actions/productActions';
import Loader from '../components/Loader';
import Message from '../components/Message'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productsConstants';
import Meta from '../components/Meta';
import Tooltips from '../components/Tooltips';



const ProductScreen = () => {
  
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  
  const params = useParams();

  const navigate = useNavigate()

  const dispatch = useDispatch()
  const productDetails = useSelector(state => state.productDetails)
  const {loading, product, error} = productDetails
  
  const productCreateReviewReducer = useSelector(state => state.productCreateReviewReducer)
  const {
    error: errorReview,
    success: successReview
  } = productCreateReviewReducer

  const userLogin = useSelector(state => state.userLogin)
  const {userInfo} = userLogin

  useEffect(()=>{
    if (successReview){
      alert('Review Submitted')
      setRating(0)
      setComment('')
      dispatch({type: PRODUCT_CREATE_REVIEW_RESET})
    }
    dispatch(listProductDetails(params.id))
  }, [dispatch, params.id, successReview])

  const addToCartHandler = () => {
    navigate(`/cart/${params.id}?qty=${qty}`)
  }

  const submitHandler =(e)=>{
    e.preventDefault()
    dispatch(productCreateReviewAction(params.id, {
      rating,
      comment
    }))
  }

  return (
    <>
        {loading && <Loader /> } 
        {error && <Message variant='danger'>{error} </Message> } 
        <Link to={'/'} >
          <span className="material-icons">home</span>
        </Link>
        {product && 
        (<>
        <Meta title={product.name}/>
        <Row>
          <Col md={5} xs={5}>
            <Image src={product.image} alt={product.name} fluid ></Image>
          </Col>
          <Col md={4}>
            <ListGroup variant='flush'>
              <ListGroup.Item>{product.name}</ListGroup.Item>
              <ListGroup.Item ><Rating value={product.rating} text={`${product.numReviews} ${product.numReviews>1? 'reviews': 'review'}`} /></ListGroup.Item>
              <ListGroup.Item>Price: &#8358;{`${Number(product.price).toLocaleString()}`}</ListGroup.Item>
              <ListGroup.Item>Description: {product.description}</ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>&#8358;{`${Number(product.price).toLocaleString()}`}</Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Status:</Col>
                    <Col>{product.countInStock > 0? 'In Stock': 'Out Of Stock'}</Col>
                  </Row>
                </ListGroup.Item>

              {
                product.countInStock > 0 && 
              (<ListGroup.Item>
                <Row>
                  <Col>Qty</Col>
                  <Col>
                    <Form.Select 
                      value={qty} onChange={(e)=>setQty(e.target.value)} >
                      {[...Array(product.countInStock).keys()].map(x=>(
                        <option key={x+1} value={x+1}>
                          {x+1}
                        </option>
                        ))}
                    </Form.Select>
                  </Col>
                </Row>
              </ListGroup.Item>)
              }

                <ListGroup.Item className='mx-auto'>
                  <Button disabled={product.countInStock===0} 
                  className='btn-block' type='button'
                  onClick={addToCartHandler}
                  >
                    Add to Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <h2>Reviews</h2>
            {product.reviews.length===0 && <Message>No Reviews</Message>}
            <ListGroup variant='flush'>
              {product.reviews.map(review=>(
                <ListGroup.Item key={review._id}>
                  <strong> {review.name} </strong>
                  <Rating value={review.rating}/>
                  <p>{review.createdAt.substring(0, 10)} <br/> {review.comment} </p>
                  {/* <p>{review.comment} </p> */}
                </ListGroup.Item>
              ))}
              <ListGroup.Item>
                <h2>Please Add a Customer Review</h2>
                {errorReview && <Message variant={'danger'}>{errorReview}</Message>}
                {userInfo? (
                  <Form onSubmit={submitHandler}>
                    <Form.Group controlId='rating'>
                      <Form.Label>Rating</Form.Label>
                      <Form.Select value={rating} 
                        onChange={(e)=>setRating(e.target.value)}>
                          <option value=''>Select</option>
                          <option value='1'>1-Poor</option>
                          <option value='2'>2-Fair</option>
                          <option value='3'>3-Good</option>
                          <option value='4'>4-Very Good</option>
                          <option value='5'>5-Excellent</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId='comment'>
                      <Form.Label>Comment</Form.Label>
                      <Form.Control as='textarea' row='3'value={comment}
                        onChange={(e)=>setComment(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                    <Form.Group className='mt-2 d-flex justify-content-center '>  
                      <Button className='btn-block'type='submit' variant='primary'>
                        Submit
                      </Button>
                    </Form.Group>

                  </Form>
                ) :(
                <>
                  Please {' '}                 
                  <Link to={'/login'}>
                    <Tooltips className='mx-3' tipText={'click to login'} target={'Login'} size='sm' />
                  </Link> {' '}
                  to add a customer review
                </>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>
        </>
        )}     
    </>
  )
}

export default ProductScreen 