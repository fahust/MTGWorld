import React, { Component } from 'react';
import {connect} from 'react-redux';
import {setPro} from '../../redux/ProActions';
import {bindActionCreators} from 'redux';
import OneMulti from '../oneMulti';

 class OneDeck extends Component {
  constructor(properties) {
    super(properties);
  }
  
  render() {

  return (
    <OneMulti navigationDrawer={this.props.route.params.navigationDrawer} route={this.props.route} navigation={this.props.navigation} use={this.props.pro.decks} title={"My Decks"} oneNavigateType={'deck'} cantUpdate={this.props.cantUpdate}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(OneDeck);