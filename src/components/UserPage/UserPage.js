import React , {Component} from 'react';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import axios from 'axios';
import UserPageOrders from './UserPageOrders';

class UserPage extends Component {
  constructor(props){
    super(props)
    this.state={
      orders:[],
    }
  }

  componentDidMount(){
    this.getOrders();
  }
getOrders = (event) => {
  axios.get('api/dashboard').then(response => {
    this.setState({
      ...this.state,
      orders: response.data,
    })
  })
}

toOrderSheet = (event) =>{
  this.props.history.push('/home:/id')
  console.log('stuff',this.state.orders.id);
  
}

toHistory = (event)=>{
  this.props.history.push('/history')
}
// this could also be written with destructuring parameters as:
// const UserPage = ({ user }) => (
// and then instead of `props.user.username` you could use `user.username`
// this.render
// 
render(){
  return(
    <div>
      {/* {JSON.stringify(moment().format('l'))} */}
      
     <h1 id="welcome">
       Welcome, { this.props.user.username }!
     </h1>
     <p>{JSON.stringify(this.props)}</p>
      <p>Your Orders:</p>
      <ul>{this.state.orders.map((order) => {
        return (<UserPageOrders key={order.id}order={order} history={this.props.history} getOrders={this.getOrders}/>)
      })}</ul>
      <button onClick={this.toHistory}>History</button>
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
