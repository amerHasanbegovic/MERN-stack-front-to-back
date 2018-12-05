const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateExperienceInput (data) {
  let errors = {}

  //title, company and from are required, need to be checked
  data.title = !isEmpty(data.title) ? data.title : ''
  data.company = !isEmpty(data.company) ? data.company : ''
  data.from = !isEmpty(data.from) ? data.from : ''

  
  if(Validator.isEmpty(data.title)){
    errors.title = 'Job title is required'
  }

  if(Validator.isEmpty(data.company)){
    errors.company = 'Company name is required'
  }

  if(Validator.isEmpty(data.from)){
      errors.from = "From date field is required"
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  }
}
