import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

require('../../stylesheets/nav.sass')

class Navbar extends Component {
  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
  }

  state = {
    auth: false
  }

  componentDidMount() {
    this.setState({auth: cookies.get('jwt') != null})

    this.props.history.listen((location, action) => {
      this.setState({auth: cookies.get('jwt') != null})
    })
  }

  logout() {
    cookies.remove('jwt')
  }

  render() {
    const {auth} = this.state
    return (
      <nav className='noselect'>
        <img src='/images/logo-small.png' alt='Logo'/>

        {auth &&
          <ul>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/login' onClick={this.logout}>Logout</Link></li>
          </ul>
        }
      </nav>
    )
  }
}

export default withRouter(Navbar)
