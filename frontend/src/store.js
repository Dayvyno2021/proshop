import {createStore, combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import { 
  productCreateReducer,
  productCreateReviewReducer,
  productDeleteReducer, 
  productDetailsReducer, 
  productListReducer, 
  productTopRatedReducer, 
  productUpdateReducer
} from './reducers/productReducers'
import { cartReducer } from './reducers/cartReducers'
import { 
  userDeleteReducer,
  userDetailsReducer, 
  userListReducer, 
  userLoginReducer, 
  userProfUpdateByAdminReducer, 
  userRegisterReducer, 
  userUpdateProfileReducer 
} from './reducers/userReducers'
import { 
  orderCreateReducer, orderDeliverReducer, orderDetailsReducer, 
  orderListReducer, 
  orderMyListReducer, orderPaymentReducer 
} from './reducers/OrderReducers'

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDeleteReducer: productDeleteReducer,
  productCreateReducer:productCreateReducer,
  productUpdateReducer:productUpdateReducer,
  productCreateReviewReducer:productCreateReviewReducer,
  productTopRatedReducer:productTopRatedReducer,
  cart: cartReducer,
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  userDetails: userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer:userListReducer,
  userDeleteReducer:userDeleteReducer,
  userProfUpdateByAdminReducer:userProfUpdateByAdminReducer,
  orderCreateReducer,
  orderDetailsReducer,
  orderPaymentReducer,
  orderMyListReducer,
  orderListReducer:orderListReducer,
  orderDeliverReducer: orderDeliverReducer
})

const cartItemsFromStorage = 
localStorage.getItem('cartItems')? 
JSON.parse(localStorage.getItem('cartItems')): []

const userInfoFromStorage = localStorage.getItem('userInfo')? 
JSON.parse(localStorage.getItem('userInfo')) : null

const shippingAddressFromStorage = localStorage.getItem('shippingAddress')? 
JSON.parse(localStorage.getItem('shippingAddress')) : {}

const shippingPaymentFromStorage = localStorage.getItem('paymentMethod')? 
JSON.parse(localStorage.getItem('paymentMethod')) : ''



const initialState = {
  cart: {
    cartItems: cartItemsFromStorage,
    shippingAddress: shippingAddressFromStorage,
    paymentMethod: shippingPaymentFromStorage
  },
  userLogin: {userInfo: userInfoFromStorage}
}

const middleware = [thunk]

const store = createStore(
  reducer, 
  initialState, 
  composeWithDevTools(applyMiddleware(...middleware))
)

export default store