import axios from 'axios';

import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DELETE_REQUEST,
  PRODUCT_DELETE_SUCCESS,
  PRODUCT_DELETE_FAIL,
  PRODUCT_CREATE_REQUEST,
  PRODUCT_CREATE_SUCCESS,
  PRODUCT_CREATE_FAIL,
  PRODUCT_CREATE_RESET,
  PRODUCT_UPDATE_REQUEST,
  PRODUCT_UPDATE_SUCCESS,
  PRODUCT_UPDATE_FAIL,
  PRODUCT_CREATE_REVIEW_REQUEST,
  PRODUCT_CREATE_REVIEW_SUCCESS,
  PRODUCT_CREATE_REVIEW_FAIL,
  PRODUCT_TOP_REQUEST,
  PRODUCT_TOP_SUCCESS,
  PRODUCT_TOP_FAIL,

} from "../constants/productsConstants"

export const listProducts = (searchparams='', pageNumber='') => async(dispatch)=>{ //
  try {
    dispatch({type: PRODUCT_LIST_REQUEST})

    const {data} = await axios.get(
      `/api/products?searchparams=${searchparams}&pageNumber=${pageNumber}` //
    ) 
    dispatch({type: PRODUCT_LIST_SUCCESS, payload: data})

  } catch (error) {
    dispatch({
      type: PRODUCT_LIST_FAIL, 
      payload: error.response && error.response.data.message
      ? error.response.data.message
      : error.message
    })
  }
}

export const listProductDetails = (id) => async(dispatch) =>{
  
  try {
    dispatch({type: PRODUCT_DETAILS_REQUEST})
    // const params = useParams()
    const {data} = await axios.get(`/api/products/${id}`)
    dispatch({type: PRODUCT_DETAILS_SUCCESS, payload: data})

  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL, 
      payload: error.response && error.response.data.message?
      error.response.data.message : error.message
    })
  }
}

export const productDeleteAction = (id) => async(dispatch, getState) =>{  
  try {
    dispatch({type: PRODUCT_DELETE_REQUEST})

    const {userLogin:{userInfo}} = getState()
    const token = userInfo.token

    const config = {
      headers:{
        Authorization: `Bearer ${token}`
      }
    }

    await axios.delete(`/api/products/${id}`, config)
    dispatch({type: PRODUCT_DELETE_SUCCESS})

  } catch (error) {
    dispatch({
      type: PRODUCT_DELETE_FAIL, 
      payload: error.response && error.response.data.message?
      error.response.data.message : error.message
    })
  }
}

export const productCreateAction = () => async(dispatch, getState) =>{  
  try {
    dispatch({type: PRODUCT_CREATE_REQUEST})

    const {userLogin:{userInfo}} = getState()
    const token = userInfo.token

    const config = {
      headers:{
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }

    const {data} = await axios.post(`/api/products`, {}, config)
    
    dispatch({type: PRODUCT_CREATE_SUCCESS, payload: data})

  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_FAIL, 
      payload: error.response && error.response.data.message?
      error.response.data.message : error.message
    })
  }
}

export const productCreateResetAction = () => (dispatch)=>{
  dispatch({type:PRODUCT_CREATE_RESET})
}


export const productUpdateAction = (product) => async(dispatch, getState) =>{  
  try {
    dispatch({type: PRODUCT_UPDATE_REQUEST})

    const {userLogin:{userInfo}} = getState()
    const token = userInfo.token

    const config = {
      headers:{
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }

    const {data} = await axios.put(`/api/products/${product._id}`, product, config)
    
    dispatch({type: PRODUCT_UPDATE_SUCCESS, payload: data})

  } catch (error) {
    dispatch({
      type: PRODUCT_UPDATE_FAIL, 
      payload: error.response && error.response.data.message?
      error.response.data.message : error.message
    })
  }
}

export const productCreateReviewAction = (productId, review) => async(dispatch, getState) =>{  
  try {
    dispatch({type: PRODUCT_CREATE_REVIEW_REQUEST})

    const {userLogin:{userInfo}} = getState()
    const token = userInfo.token

    const config = {
      headers:{
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    }

    await axios.post(`/api/products/${productId}/reviews`, review, config)
    
    dispatch({type: PRODUCT_CREATE_REVIEW_SUCCESS})

  } catch (error) {
    dispatch({
      type: PRODUCT_CREATE_REVIEW_FAIL, 
      payload: error.response && error.response.data.message?
      error.response.data.message : error.message
    })
  }
}

export const productTopRatedAction = () => async(dispatch) =>{  
  try {
    dispatch({type: PRODUCT_TOP_REQUEST})

    const {data} =  await axios.get(`/api/products/product/top`)
    
    dispatch({type: PRODUCT_TOP_SUCCESS, payload: data})

  } catch (error) {
    dispatch({
      type: PRODUCT_TOP_FAIL, 
      payload: error.response && error.response.data.message?
      error.response.data.message : error.message
    })
  }
}