import React, {useEffect} from 'react'
import {Link} from 'react-router-dom'
import {Carousel, Image} from 'react-bootstrap'
import {useDispatch, useSelector} from 'react-redux'
import Message from './Message'
import { productTopRatedAction } from '../actions/productActions'


const ProductCarousel = () => {

  const dispatch = useDispatch()

  const productTopRatedReducer = useSelector(state => state.productTopRatedReducer)
  const {products, error} = productTopRatedReducer

  useEffect(() => {
    dispatch(productTopRatedAction())
  }, [dispatch])

  return (
    <>
      {error && <Message variant={'danger'}>{error} </Message>}
      {products && (
        <Carousel pause='hover' className='bg-success rounded'>
          {products.map(product=>(
            <Carousel.Item key={product._id}>
              <Link to={`/product/${product._id}`}>
                <Image src={product.image} alt={product.name} fluid />
                <Carousel.Caption className='carousel-caption'>
                  <h2>{product.name} (&#8358;{product.price.toLocaleString()}) </h2>
                </Carousel.Caption>
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </>
  )
}

export default ProductCarousel
