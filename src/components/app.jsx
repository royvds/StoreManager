import React, { Component } from 'react'
import { Route } from 'react-router'
import { BrowserRouter } from 'react-router-dom'

import Routes from '../routes'
import Nav from '../components/shared/nav'

const AppContent = () => (
  <div>
    <Nav />

    <Routes />
  </div>
)

const LoadingScreen = () => (
  <div className="loadingScreen">
    <p>LOADING...</p>
  </div>
)

class App extends Component {
  state = {
    isLoading : true
  }

  componentDidMount() {
    this.setState({ isLoading: false })
  }

  render() {
    return (
      this.state.isLoading ? <LoadingScreen /> : <AppContent />
    )
  }
}

export default App
