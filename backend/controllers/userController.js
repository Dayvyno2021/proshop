import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

// @desc  Auth user & get Token
// @route POST /api/users/login
// @access Public
const authUser =async(req, res)=>{
  try {
    const {email, password } = req.body
    if (!email || !password){
      res.status(400).json({
        message: "All fields must be passed"
      })
    }
    const user = await User.findOne({email})

    if (user && (await user.matchPassword(password))){
      res.json({
        _id: user._id,
        name: user.name,
        email:user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      })
    } else{
      res.status(401).json({message: 'Invalid email or password'})
    }

  } catch (error) {
    res.status(400).json({
      message: 'Error logging in',
      systemMessage: process.env.NODE_ENV==='production'? null: error
    })
  }
}

// @desc  Get user Profile
// @route GET /api/users/profile
// @access Private
const getUserProfile =async(req, res)=>{
  try {
    const user = await User.findById(req.user._id).select('-password') //1
    
    if(user){
      res.json({
        _id: user._id,
        name: user.name,
        email:user.email,
        isAdmin: user.isAdmin,
      })
    } else {
      res.status(401).json({message: 'Could not fetch user profile'})
    }
  } catch (error) {
    console.error(error)
    res.json(404).json({
      message: 'User not found',
      errorMessage: process.env.NODE_ENV==='production'? null : error
    })
  }
}

// @desc  Register a new User
// @route POST /api/users
// @access Public
const registerUser =async(req, res)=>{
  try {
    const {name, email, password} = req.body

    if(!name || !email || !password){
      res.status(400).json({
        message: "All fields are required for a valid registration"
      })
    }

    const userExists = await User.findOne({email})

    if (userExists){
      res.status(400).json({
        message: 'Bad Request, User already exists'
      })
    } else if (!userExists){
      const user = await User.create({
        name,
        email,
        password
      })
      if (user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email:user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
      }
    }


  } catch (error) {
    res.status(400).json({
      message: 'Could not register user',
      errorMessage: process.env.NODE_ENV === 'production'? null : error
    })
  }
}

// @desc  Update user Profile
// @route PUT /api/users/profile
// @access Private
const UpdateUserProfile =async(req, res)=>{
  try {
    const user = await User.findById(req.user._id).select('-password') 
    
    if(user){
      user.name = req.body.name || user.name
      if (req.body.password){
        user.password = req.body.password || user.password
      } 

      const updatedUser = await user.save()

      if (updatedUser){
        res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          token: generateToken(updatedUser._id) // Because the _id will be changed by mondoDB
        })
      } else {res.status(400).json({message: "Could not access new profile change"})}

    } else {res.status(401).json({message: 'Could not fetch user profile'})}

  } catch (error) {
    console.error(error)
    res.json(404).json({
      message: 'User not found',
      errorMessage: process.env.NODE_ENV==='production'? null : error
    })
  }
}

// @desc  Get all users
// @route GET /api/users/
// @access Private/Admin
const getUsersByAdmin =async(req, res)=>{
  try {
    const users = await User.find({})
    res.json(users)
    
  } catch (error) {
    console.error(error)
    res.json(404).json({
      message: 'Users not found for Admin',
      errorMessage: process.env.NODE_ENV==='production'? null : error
    })
  }
}

// @desc  Delete user
// @route DELETE /api/users/:id
// @access Private/Admin
const deleteUserByAdmin =async(req, res)=>{
  try {
    const user = await User.findById(req.params.id)
    if (user){
      await user.remove()
      res.json({message: "User Deleted"})
    }else{
      res.status(404).json('User not found')
    }
    
  } catch (error) {
    console.error(error)
    res.json(404).json({
      message: 'Admin could not delete user',
      errorMessage: process.env.NODE_ENV==='production'? null : error
    })
  }
}

// @desc  Get user by ID
// @route GET /api/users/:id
// @access Private/Admin
const adminGetUserById =async(req, res)=>{
  try {
    const user = await User.findById(req.params.id).select('-password')
    if (user && user._id){
      res.json(user)
    }else{
      res.status(401).json('User not found')
    }

    
  } catch (error) {
    console.error(error)
    res.json(404).json({
      message: 'User not found',
      errorMessage: process.env.NODE_ENV==='production'? null : error
    })
  }
}

// @desc  Update user Profile by Admin
// @route PUT /api/users/user/:id
// @access Private/Admin
const updateUserByAdmin =async(req, res)=>{
  try {
    const user = await User.findById(req.params.id).select('-password') 
    
    if(user && user._id){
      user.name = req.body.name || user.name
      user.isAdmin = req.body.isAdmin 

      const updatedUser = await user.save()

      res.json(updatedUser)

    } else {res.status(401).json({message: 'Could not change user profile'})}

  } catch (error) {
    console.error(error)
    res.json(404).json({
      message: 'Admin can not change user profile',
      errorMessage: process.env.NODE_ENV==='production'? null : error
    })
  }
}

export {
  authUser, 
  getUserProfile, 
  registerUser, 
  UpdateUserProfile, 
  getUsersByAdmin, 
  deleteUserByAdmin,
  adminGetUserById,
  updateUserByAdmin
}