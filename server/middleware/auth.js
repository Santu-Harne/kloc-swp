const { StatusCodes } = require("http-status-codes")
const jwt = require('jsonwebtoken')

// logic to read logged user generated token
const auth = async (req, res, next) => {
  try {
    const authorizationHeader = req.header('Authorization')
    if (!authorizationHeader)
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Auth token is missing, please login again!" })

    if (!authorizationHeader.startsWith('Bearer '))
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid token!" })

    const token = req.header('Authorization').split(" ")[1]

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError')
          return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Token expired, Please login again!" })
        else return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Invalid token!" })
      }
      req.user = user
      next() // forwarding response to next controller
    })

  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message })
  }
}
module.exports = auth