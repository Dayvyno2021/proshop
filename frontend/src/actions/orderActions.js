import axios from "axios";
import { 
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_PAY_RESET,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_DELIVER_REQUEST,
  ORDER_DELIVER_SUCCESS,
  ORDER_DELIVER_FAIL
} from "../constants/orderConstants";

export const createOrderAction =(order)=>async (dispatch, getState)=>{
  try{
    dispatch({
      type: ORDER_CREATE_REQUEST
    })

    const {userLogin: {userInfo}} =getState()

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`
      }
    }
    const {data} = await axios.post('/api/orders', order, config )
    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data
    })

  }catch(error){
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload: error.response && error.response.data.message? 
      error.response.data.message : error.message
    })
  }
}

export const getOrderDetailsAction =(id)=> async(dispatch, getState)=>{
  try {
    dispatch({type: ORDER_DETAILS_REQUEST })

    const {userLogin: {userInfo}} = getState()
    const token = userInfo.token

    const config= {
      headers:{
        Authorization : `Bearer ${token}`
      }
    }
    
    const {data} = await axios.get(`/api/orders/${id}`, config)
    dispatch({
      type: ORDER_DETAILS_SUCCESS,
      payload: data
    })

  } catch (error) {
    dispatch({
      type: ORDER_DETAILS_FAIL,
      payload: error.response && error.response.data.message? 
        error.response.data.message : error.message
    })
  }
}

export const orderPaymentAction =(id, paymentResult)=> async(dispatch, getState)=>{
  try {
    dispatch({type: ORDER_PAY_REQUEST})

    const {userLogin:{userInfo}} = getState()
    const token = userInfo.token

    const config = {
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `Bearer ${token}`
      }
    }

    const {data} = await axios.put(`/api/orders/${id}/pay`, paymentResult, config)

    dispatch({type: ORDER_PAY_SUCCESS, payload: data})

  } catch (error) {
    dispatch({
      type: ORDER_PAY_FAIL,
      payload: error.response.data.message? 
      error.response.data.message : error.message
    })
  }
}

export const orderMyListAction =()=> async(dispatch, getState)=>{
  try {
    dispatch({type: ORDER_LIST_MY_REQUEST})

    const {userLogin:{userInfo}} = getState()
    const token = userInfo.token

    const config = {
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `Bearer ${token}`
      }
    }

    const {data} = await axios.get(`/api/orders/myorders`, config)

    dispatch({type: ORDER_LIST_MY_SUCCESS, payload: data})

  } catch (error) {
    dispatch({
      type: ORDER_LIST_MY_FAIL,
      payload: error.response && error.response.data.message ? 
      error.response.data.message : error.message
    })
  }
}

export const orderPaymentResetAtion =()=> (dispatch)=>{
  dispatch({type: ORDER_PAY_RESET})
}

export const orderListAction =()=> async(dispatch, getState)=>{
  try {
    dispatch({type: ORDER_LIST_REQUEST})

    const {userLogin:{userInfo}} = getState()
    const token = userInfo.token

    const config = {
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `Bearer ${token}`
      }
    }

    const {data} = await axios.get(`/api/orders`, config)

    dispatch({type: ORDER_LIST_SUCCESS, payload: data})

  } catch (error) {
    dispatch({
      type: ORDER_LIST_FAIL,
      payload: error.response && error.response.data.message ? 
      error.response.data.message : error.message
    })
  }
}

export const orderDeliverAction =(order)=> async(dispatch, getState)=>{
  try {
    dispatch({type: ORDER_DELIVER_REQUEST})

    const {userLogin:{userInfo}} = getState()
    const token = userInfo.token

    const config = {
      headers: {
        'Content-Type' : 'application/json',
        Authorization: `Bearer ${token}`
      }
    }

    const {data} = await axios.put(`/api/orders/${order._id}/delivered`, {}, config)

    dispatch({type: ORDER_DELIVER_SUCCESS, payload: data})

  } catch (error) {
    dispatch({
      type: ORDER_DELIVER_FAIL,
      payload: error.response && error.response.data.message ? 
      error.response.data.message : error.message
    })
  }
}