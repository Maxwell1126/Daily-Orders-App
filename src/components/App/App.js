import React, {Component} from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import {connect} from 'react-redux';

import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';

import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'
import UserPage from '../UserPage/UserPage';

import 'typeface-roboto';
import './App.css';
import UpdateOrders from '../UpdateOrders/UpdateOrders';
import OrderSheet from '../OrderSheet/OrderSheet';
import History from '../History/History';
class App extends Component {
  componentDidMount () {
    this.props.dispatch({type: 'FETCH_USER'})
  }

  render() {
    
    return (
      <Router>
        <div>
          <Nav />
          <Switch>
            {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
            <Redirect exact from="/" to="/home" />
            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/home will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the 'Login' or 'Register' page.
            Even though it seems like they are different pages, the user is always on localhost:3000/home */}
            <ProtectedRoute
              exact
              path="/home"
              component={UserPage}
            />
            <ProtectedRoute
              exact
              path="/home/:id"
              component={OrderSheet}
            />
            <ProtectedRoute
              exact
              path="/history"
              component={History}
            />
            {this.props.user.manager &&(
              <ProtectedRoute
                exact
                path="/update"
                component={UpdateOrders}
              />
            )}
            {/* If none of the other routes matched, we will show a 404. */}
            <Route render={() => <h1>404</h1>} />
          </Switch>
          <Footer />
        </div>
      </Router>
  )}
}
const mapStateToProps = state => ({
  user: state.user,
});
export default connect(mapStateToProps)(App);
