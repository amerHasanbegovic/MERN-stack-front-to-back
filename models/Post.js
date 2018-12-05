const mongoose = require('mongoose')
const Schema = mongoose.Schema

// creating schema

const PostSchema = new Schema({
  // connect each post with user
  user: { type: Schema.Types.ObjectId, ref: 'users' },
  text: { type: String, required: true },
  name: { type: String },
  avatar: { type: String }, 
  // name and avatar will show next to post
  // if users account get deleted, posts will stay
  // that is why we need name and avatar in PostSchema
  date: { type: Date, default: Date.now },
  likes: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'users' }
      // array of likes, every like has its user and id will be stored in array
    }
  ],
  comments: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'users' }, // same as likes, id gets stored
      text: { type: String, required: true },
      name: { type: String },
      avatar: { type: String },
      date: { type: Date, default: Date.now }
    }
  ],

})

//                                      name,   actual schema
module.exports = Post = mongoose.model('post', PostSchema)
