import React, { Component } from 'react';
import {connect} from 'react-redux';
import {setPro} from '../../redux/ProActions';
import {bindActionCreators} from 'redux';
import OneMulti from '../oneMulti';

 class Collections extends Component {
  constructor(properties) {
    super(properties);
  }
  
  render() {
  return ( 
    <OneMulti route={this.props.route} navigation={this.props.navigation} use={this.props.pro.collectionsCards} title={"My Collections"} oneNavigateType={'collection'} collections={true}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Collections);