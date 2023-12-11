const jwt = require("jsonwebtoken")

const tokenGenerator = (user) => {
  return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '5h' })
}


module.exports = { tokenGenerator }