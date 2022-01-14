import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'

const protect = async(req, res, next)=>{
  try {
    const authToken = req.headers.authorization

    if (authToken && authToken.startsWith('Bearer')){
      const tokenArray= authToken.split(' ')
      const decoded =  jwt.verify(tokenArray[1], process.env.JWT_SECRET)
        req.user = await User.findById(decoded.id).select('-password')
        next()

      } 
  } catch (error) {
    console.error(error)
    res.status(401).json({
      message: 'UnAuthorized User',
      errorMessage: process.env.NODE_ENV==='production'? null : error
    })
  }
}

const admin = (req, res, next) =>{
  if (req.user && req.user.isAdmin){
    next()
  } else {
    res.status(401).json('Not authorized as an admin')
  }
}

export {protect, admin}
