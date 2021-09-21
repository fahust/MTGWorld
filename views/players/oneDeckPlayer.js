import React, { Component } from 'react';
import {connect} from 'react-redux';
import {setPro} from '../../redux/ProActions';
import {bindActionCreators} from 'redux';
import OneMulti from '../oneMulti';

 class OneDeckPlayer extends Component {
  constructor(properties) {
    super(properties);
  }
  
  render() {
  return (
    <OneMulti navigationDrawer={this.props.route.params.navigationDrawer} route={this.props.route.params.route} navigation={this.props.navigation} use={this.props.route.params.item} title={"My Decks"} oneNavigateType={'deck'} cantUpdate={true} player={this.props.route.params.player}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(OneDeckPlayer);