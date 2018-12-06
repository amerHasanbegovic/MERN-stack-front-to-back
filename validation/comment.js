const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validateCommentInput (data) {
  let errors = {}

  // comment text is required
  data.text = !isEmpty(data.text) ? data.text : ''

  if (Validator.isEmpty(data.text)) {
    errors.text = 'Comment text is required'
  }
  
  return {
    errors: errors,
    isValid: isEmpty(errors)
  }
}
