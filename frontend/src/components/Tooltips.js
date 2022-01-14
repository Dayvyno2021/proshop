import React from 'react'
import {Tooltip, OverlayTrigger, Button} from 'react-bootstrap'

const Tooltips = ({tipText, target, size}) => {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {tipText}
    </Tooltip>
  );
  
  return (
    <>
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
      >
      <Button size={size} variant="success" className='tooltipD'>{target} </Button>
    </OverlayTrigger>
    </>
  );
}

export default Tooltips
