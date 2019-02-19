import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

class LoginPage extends Component {
  state = {
    username: '',
    password: '',
  };

  login = (event) => {
    event.preventDefault();

    if (this.state.username && this.state.password) {
      this.props.dispatch({
        type: 'LOGIN',
        payload: {
          username: this.state.username,
          password: this.state.password,
        },
      });
    } else {
      this.props.dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  } // end login

  handleInputChangeFor = propertyName => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }
  
  render() {
    return (
      <div>
        <Grid container spacing={24} style={{ padding: 24 }}
        direction="column"
        alignItems="center">
        {this.props.errors.loginMessage && (
          <h2
            className="alert"
            role="alert"
          >
            {this.props.errors.loginMessage}
          </h2>
        )}
        <form onSubmit={this.login}>
          <h1>Login</h1>
          <div>
            <label htmlFor="username">
              <TextField item xs={12} xl={12}
                variant="outlined"
              id="outlined-name"
                type="text"
                label="username"
                value={this.state.username}
                onChange={this.handleInputChangeFor('username')}
              />
            </label>
          </div>
          <div>
            <label htmlFor="password">
              <TextField
                  style={{ paddingTop: 10, paddingBottom:  10 }}
                variant="outlined"
                  type="password"
                  label="password"
                value={this.state.password}
                onChange={this.handleInputChangeFor('password')}
              />
            </label>
          </div>
          <div >
            <Grid item direction="row"
            alignItems="center">
                
            <input
              className="log-in"
              type="submit"
              name="submit"
              value="Log In"
            />
              
                <Button
                variant="contained"
                style={{height:47, width:97}}
                  type="button"
                  className="link-button"
                  onClick={() => { this.props.dispatch({ type: 'SET_TO_REGISTER_MODE' }) }}
                >
                  Register
          </Button>
              
              </Grid>
          </div>
        </form>
        
        
        </Grid>
      </div>
    );
  }
}

// Instead of taking everything from state, we just want the error messages.
// if you wanted you could write this code like this:
// const mapStateToProps = ({errors}) => ({ errors });
const mapStateToProps = state => ({
  errors: state.errors,
});

export default connect(mapStateToProps)(LoginPage);
