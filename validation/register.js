const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateRegisterInput (data) {
  let errors = {}

  //make sure it is a string, make sure it is not empty
  data.name = !isEmpty(data.name) ? data.name : ''
  //email
  data.email = !isEmpty(data.email) ? data.email : ''
  //password and password2(confirm password)
  data.password = !isEmpty(data.password) ? data.password : ''
  data.password2 = !isEmpty(data.password2) ? data.password2 : ''


  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters'
  }

  if(Validator.isEmpty(data.name)){
    errors.name = 'Name is required'
  }
  //email
  if(Validator.isEmpty(data.email)){
    errors.email = 'Email is required'
  }
  if(!Validator.isEmail(data.email)){
    errors.email = 'Email is invalid'
  }
  //password
  if(Validator.isEmpty(data.password)){
    errors.password = 'Password is required'
  }
  if(!Validator.isLength(data.password, { min: 6, max: 30})){
    errors.password = 'Password must be between 6 and 30 characters'
  }
  if(Validator.isEmpty(data.password2)){
    errors.password2 = 'Confirm password is required'
  }

  //check if password and confirm password matches
  if(!Validator.equals(data.password, data.password2)){
    errors.password2 = 'Passwords must match'
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  }
}
