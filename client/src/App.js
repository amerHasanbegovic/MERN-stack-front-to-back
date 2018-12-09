import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import jwt_decode from 'jwt-decode'
import setAuthToken from './utils/setAuthToken'
import { setCurrentUser, logoutUser } from './actions/authActions'

import './App.css'
import Navbar from './components/layout/Navbar'
import Landing from './components/layout/Landing'
import Footer from './components/layout/Footer'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import store from './store'


//if page is reloaded user doesnt stay logged in, logic to keep logged in
//check for token
if(localStorage.jwtToken){
  //Set auth token header auth
  setAuthToken(localStorage.jwtToken)
  //decode token and get user info and expiration
  const decoded = jwt_decode(localStorage.jwtToken)
  //set User and isAuthenticated (to keep user logged in)
  store.dispatch(setCurrentUser(decoded))


  //check for expired token
  const currentTime = Date.now() / 1000 
  if(decoded.exp < currentTime){
    //Log out the user
    store.dispatch(logoutUser())

    //TODO: Clear current Profile

    //Rediret to login page if token is expired
    window.location.href="/login";
  }
}

class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <Router>
          <div className='App'>
            <Navbar />
            <Route exact path='/' component={Landing} />
            <div className='container'>
              <Route exact path='/login' component={Login} />
              <Route exact path='/register' component={Register} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    )
  }
}

export default App
