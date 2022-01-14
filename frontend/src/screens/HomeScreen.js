import React, {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {Row, Col} from 'react-bootstrap'
import Product from '../components/Product.js'
import { listProducts } from '../actions/productActions.js'
import Loader from '../components/Loader.js'
import Message from '../components/Message.js'
import { useLocation, useParams, Link } from 'react-router-dom'
import Paginate from '../components/Paginate.js'
import ProductCarousel from '../components/ProductCarousel.js'
import Meta from '../components/Meta.js'

const HomeScreen = () => {
  
  const location = useLocation()
  const params = useParams()

  const searchparams = location.search.split('=')[1]
  const pageNumber = params.pageNumber

  


  const dispatch = useDispatch()

  const productList = useSelector(state => state.productList)
  const {loading, error, products, page, pages} = productList


  useEffect(()=>{
    dispatch(listProducts(searchparams, pageNumber)) //
  }, [dispatch, searchparams, pageNumber])

  return (
    <>
    <Meta title='DayveOshop | Home' />
    {!searchparams? <ProductCarousel/>: (
    <Link to={'/'}  ><span className="material-icons">home</span></Link>
    )}
     <h1 className='latest'>Latest Products</h1> 
     {loading 
     ? <Loader/> 
     : error
     ? <Message variant={'danger'}>{error}</Message>
     : (
       <>
        <Row>
        {products.map((product)=>(
          <Col xs={6} sm={6} md={6} lg={4} xlg={3} key={product._id}>
            <Product product={product} /> 
          </Col>
        ))}
       </Row>
       <Paginate page={page} pages={pages} />
      </>
       ) 
     }
    </>
  )
}

export default HomeScreen
