import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true
  },
  {
    name: 'David Princess',
    email: 'princess@gmail.com',
    password: bcrypt.hashSync('123456', 10)

  },
  {
    name: 'David Oluwaseun',
    email: 'oluwaseun@gmail.com',
    password: bcrypt.hashSync('123456', 10)

  }
]

export default users