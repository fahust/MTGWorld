import React, { Component } from 'react';
import {connect} from 'react-redux';
import {setPro} from '../../redux/ProActions';
import {bindActionCreators} from 'redux';
import OneMulti from '../oneMulti';

 class OneWishlist extends Component {
  constructor(properties) {
    super(properties);
  }
  
  render() {

  return (
    <OneMulti route={this.props.route} navigationDrawer={this.props.route.params.navigationDrawer} navigation={this.props.navigation} use={this.props.pro.wishlists} title={"My Decks"} oneNavigateType={'wishlist'}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(OneWishlist);