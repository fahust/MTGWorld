import React, { Component } from 'react';
import {connect} from 'react-redux';
import {setPro} from '../../redux/ProActions';
import {bindActionCreators} from 'redux';
import MyMulti from '../myMulti';



 class MyWishlist extends Component {
  constructor(properties) {
    super(properties);
  }


  render() {
  
  return (
    <MyMulti route={this.props.route} navigation={this.props.navigation} use={this.props.pro.wishlists} title={"My Wishlists"} oneNavigate={'OneWishlist'}/>
  );
}

}



  
  
//Get function
const mapStateToProps = (state) => {
  const {pro} = state;
  return {pro};
};

//Call set functions
const mapDispatchToProps = (dispatch) => bindActionCreators({setPro}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MyWishlist);