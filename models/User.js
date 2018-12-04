const mongoose = require('mongoose')
const Schema = mongoose.Schema

// creating schema

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String },
  date: { type: Date, default: Date.now }
})

//                                      name,   actual schema
module.exports = User = mongoose.model('users', UserSchema)

