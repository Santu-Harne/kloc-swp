
const { body, validationResult } = require('express-validator');

const validateRegister = [
  // Validate name
  body('userName')
    .trim()
    .not().isEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),

  // Validate email
  body('userEmail')
    .trim()
    .notEmpty().withMessage('Email is required')
    .matches(/^[a-zA-Z][a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i).withMessage('Invalid email address'),

  // Validate password
  body('userPassword')
    .notEmpty().withMessage('Password is required')
    .isStrongPassword().withMessage('Password must contain at least 8 characters, with a mix of uppercase, lowercase, digits, and symbols'),

  // Validate mobile number
  body('userMobileNo')
    .notEmpty().withMessage('Mobile number is required')
    .matches(/^\d{10}$/).withMessage('Invalid mobile number'),

  // Confirm password
  // body('confirmPassword')
  //   .custom((value, { req }) => {
  //     if (value !== req.body.password) {
  //       throw new Error('Passwords do not match');
  //     }
  //     return true;
  //   }),

  // Additional validations can be added as needed

  // Error handling logic
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array()[0].msg });
    }
    next();
  },
];


module.exports = {
  validateRegister,
};
