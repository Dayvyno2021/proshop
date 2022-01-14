import React from 'react'
import {Spinner, Container} from 'react-bootstrap'

const Loader = () => {
  return (
    <Container className='loader'>
      <Spinner 
      animation="border"
      variant='success' role="status" 
      style={{width: '80px', height: '80px'}}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  )
}

export default Loader
