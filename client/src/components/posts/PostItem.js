import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import { deletePost, addLike, removeLike } from '../../actions/postActions'

class PostItem extends Component {
  handleDelete = id => {
    this.props.deletePost(id)
  }

  handleLike = id => {
    this.props.addLike(id)
  }

  handleUnlike = id => {
    this.props.removeLike(id)
  }

  findUserLike = likes => {
    const { auth } = this.props

    if (likes.filter(like => like.user === auth.user.id).length > 0) {
      return true
    } else {
      return false
    }
  }

  render () {
    const { auth, post, showActions } = this.props
    return (
      <div className='card card-body mb-3'>
        <div className='row'>
          <div className='col-md-2'>
            <Link to='/profile'>
              <img
                className='rounded-circle d-none d-md-block'
                src={post.avatar}
                alt=''
              />
            </Link>
            <br />
            <p className='text-center'>{post.name}</p>
          </div>
          <div className='col-md-10'>
            <p className='lead'>{post.text}</p>
            {showActions ? (
              <span>
                <button
                  onClick={this.handleLike.bind(this, post._id)}
                  type='button'
                  className='btn btn-light mr-1'
                >
                  <i
                    className={classnames('fas fa-thumbs-up', {
                      'text-info': this.findUserLike(post.likes)
                    })}
                  />
                  <span className='badge badge-light'>{post.likes.length}</span>
                </button>
                <button
                  onClick={this.handleUnlike.bind(this, post._id)}
                  type='button'
                  className='btn btn-light mr-1'
                >
                  <i className='text-secondary fas fa-thumbs-down' />
                </button>
                <Link to={`/post/${post._id}`} className='btn btn-info mr-1'>
                  Comments {post.comments.length > 0 ? <span className="ml-1">({post.comments.length})</span> : null}
                </Link> 
                {post.user === auth.user.id ? (
                  <button
                    onClick={this.handleDelete.bind(this, post._id)}
                    type='button'
                    className='btn btn-danger mr-1'
                    title="Remove post"
                  >
                    <i className='fas fa-times' />
                  </button>
                ) : null}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}

PostItem.defaultProps = {
  showActions: true
}

PostItem.propTypes = {
  deletePost: PropTypes.func.isRequired,
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(
  mapStateToProps,
  { deletePost, addLike, removeLike }
)(PostItem)
