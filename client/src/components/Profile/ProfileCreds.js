import React, { Component } from 'react'
import Moment from 'react-moment'
import PropTypes from 'prop-types'
import isEmpty from '../../validation/is-empty'

class ProfileCreds extends Component {
  render () {
    const { experience, education } = this.props

    return (
      <div className='row'>
        <div className='col-md-6'>
          <h3 className='text-center text-info'>Experience</h3>
          {experience.length > 0 ? (
            <ul className='list-group'>
              {experience.map(item => (
                <li className='list-group-item' key={item._id}>
                  <h4>{item.company}</h4>
                  <p>
                    <Moment format='YYYY/MM/DD'>{item.from}</Moment> -
                    {item.to === null ? (
                      ' Now'
                    ) : (
                      <Moment format='YYYY/MM/DD'>{item.to}</Moment>
                    )}
                  </p>
                  <p>
                    <strong>Position:</strong> {item.title}
                  </p>
                  <p>
                    <strong>Location:</strong>{' '}
                    {isEmpty(item.location) ? 'No location' : item.location}
                  </p>
                  <p>
                    {isEmpty(item.description) ? null : (
                      <span>
                        <strong>Description:</strong> {item.description}
                      </span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="lead text-center">No experience listed</p>
          )}
        </div>

        <div className='col-md-6'>
          <h3 className='text-center text-info'>Education</h3>
          {education.length > 0 ? (
            <ul className='list-group'>
              {education.map(item => (
                <li className='list-group-item' key={item._id}>
                  <h4>{item.school}</h4>
                  <p>
                    <Moment format='YYYY/MM/DD'>{item.from}</Moment> -
                    {item.to === null ? (
                      ' Now'
                    ) : (
                      <Moment format='YYYY/MM/DD'>{item.to}</Moment>
                    )}
                  </p>
                  <p>
                    <strong>Degree:</strong> {item.degree}
                  </p>
                  <p>
                    <strong>Field of study:</strong> {item.fieldofstudy}
                  </p>
                  <p>
                    {isEmpty(item.description) ? null : (
                      <span>
                        <strong>Description:</strong> {item.description}
                      </span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="lead text-center">No education listed</p>
          )}
        </div>
      </div>
    )
  }
}

ProfileCreds.propTypes = {
  experience: PropTypes.array.isRequired,
  education: PropTypes.array.isRequired
}

export default ProfileCreds
