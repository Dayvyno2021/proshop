import express from 'express'
const router = express.Router()
import { 
  authUser, 
  getUserProfile, 
  registerUser, 
  UpdateUserProfile,
  getUsersByAdmin,
  deleteUserByAdmin,
  adminGetUserById,
  updateUserByAdmin
} from "../controllers/userController.js";
import { protect, admin} from '../middleware/authMiddleware.js';


router.post('/', registerUser).get('/', protect, admin, getUsersByAdmin)
router.post('/login', authUser)
router.get('/profile', protect, getUserProfile)
  .put('/profile', protect, UpdateUserProfile)


router.delete('/:id', protect, admin, deleteUserByAdmin)
  .get('/:id', protect, admin, adminGetUserById)

router.put('/user/:id', protect, admin, updateUserByAdmin)



export default router