import API_BASE_URL from '../../config/api'
import './Login.css'
import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

class Login extends Component {
  state = {username: '', password: '', showSubmitError: false, errorMessage: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitFailure = errMessage => {
    this.setState({
      showSubmitError: true,
      errorMessage: errMessage,
    })
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = API_BASE_URL
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showSubmitError, errorMessage} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <form className="login-form-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <label htmlFor="username" className="login-form-label">
            USERNAME
          </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            className="login-form-input"
            onChange={this.onChangeUsername}
          />
          <label htmlFor="username" className="login-form-label">
            PASSWORD
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            className="login-form-input"
            onChange={this.onChangePassword}
          />
          <button type="submit" className="login-form-button">
            Login
          </button>
          {showSubmitError && (
            <p className="login-form-error-message">{errorMessage}</p>
          )}
        </form>
      </div>
    )
  }
}

export default Login
