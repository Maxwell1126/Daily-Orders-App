import React , {Component} from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import UserPageOrders from './UserPageOrders';
import ManagerPageOrders from './ManagerPageOrders';
class UserPage extends Component {

// this could also be written with destructuring parameters as:
// const UserPage = ({ user }) => (
// and then instead of `props.user.username` you could use `user.username`
// this.render
// 
render(){
  let userPageContent;
  if (this.props.user.manager===false){
    userPageContent = 
    <div> 
      <p>Your Orders:</p>
      <UserPageOrders history={this.props.history} />
    </div>
  }else{
    userPageContent =
    <div>
      <ManagerPageOrders history={this.props.history} />
    </div>
  }
  return(
    <div>
      {/* {JSON.stringify(this.props.user.manager)} */}
     <h1 id="welcome">
       Welcome, { this.props.user.username }!
     </h1>
     {/* <p>{JSON.stringify(this.props)}</p> */}
     {userPageContent}
      <br></br>
     <LogOutButton className="log-in" />
   </div>
  )
}
}
// Instead of taking everything from state, we just want the user info.
// if you wanted you could write this code like this:
// const mapStateToProps = ({user}) => ({ user });
const mapStateToProps = state => ({
  user: state.user,
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(UserPage);
