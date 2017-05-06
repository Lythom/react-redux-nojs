import React from 'react'
import { connect } from 'react-redux'
import {
  Route,
  withRouter,
  Redirect,
  Link
} from 'react-router-dom'

import Layout from 'app/components/Layout'

import * as interactions from 'app/reducers/interactions'
import Counter from 'app/components/pages/Counter'
import MapPage from 'app/components/pages/MapPage'
import { Helmet } from 'react-helmet'

const App = React.createClass({
  componentDidMount() {
    this.props.setDynamic()
  },

  render() {
    return <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{'Samuel Bouchet'}</title>
      </Helmet>
      <Route path="/" exact render={() => <h1>Home Page !<Redirect to="/index.html" /></h1>}/>
      <Route path="/index.html" render={() => <h1>Home Page !</h1>}/>
      <Route path="/demo.html" component={Counter}/>
      <Route path="/map.html" component={MapPage}/>
    </Layout>
  }
})

function mapDispatchToProps(dispatch) {
  return {
    setDynamic : () => dispatch(interactions.actions.setDynamic())
  }
}

export default withRouter(connect(undefined, mapDispatchToProps)(App))