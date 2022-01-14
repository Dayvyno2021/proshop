import React from 'react'
import {Row, Col} from 'react-bootstrap'
// import PropTypes from 'prop-types'


const Rating = ({value, text, color}) => {
  return (
    <Row className='rating rating1'>
      <Col xs={2} md={1} >
        <span className="material-icons" style={{color}}> 
          {
          value>=1 
          ? "star" 
          : value>=0.5 
          ? "star_half" 
          : "star_outline"
          }
        </span>
      </Col>
      <Col xs={2} md={1}>
        <span className="material-icons" style={{color}}> 
          {
          value>=2
          ? "star" 
          : value>=1.5 
          ? "star_half" 
          : "star_outline"
          }
        </span>
      </Col>
      <Col xs={2} md={1}>
        <span className="material-icons" style={{color}}> 
          {
          value>=3
          ? "star" 
          : value>=2.5 
          ? "star_half" 
          : "star_outline"
          }
        </span>
      </Col >
      <Col xs={2} md={1}>
        <span className="material-icons" style={{color}}> 
          {
          value>=4
          ? "star" 
          : value>=3.5 
          ? "star_half" 
          : "star_outline"
          }
        </span>
      </Col>
      <Col xs={2} md={1}>
        <span className="material-icons" style={{color}}>
          {
          value>=5
          ? "star" 
          : value>=4.5 
          ? "star_half" 
          : "star_outline"
          }
          </span>
      </Col>
      <Col xs={12}>{text && text}</Col>
      
    </Row>
  )
}

Rating.defaultProps = {
  color: "#b3b300"
}

// Rating.propTypes={
//   value: PropTypes.number.isRequired,
//   text: PropTypes.string.isRequired,
//   color: PropTypes.string
// }

export default Rating
