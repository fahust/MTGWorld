import { StyleSheet,View } from 'react-native';
import React, { Component } from 'react';

import {connect} from 'react-redux';
import {setPro} from '../../redux/ProActions';
import {bindActionCreators} from 'redux';
import {createStackNavigator} from '@react-navigation/stack';
import Burger from '../services/Burger';
import actionsLists from './actionsLists';

 class StacksAbilities extends Component {
  constructor(properties) {
    super(properties);
  }
  render() {
    const Stack = createStackNavigator();

    const stylesHeader = {
      headerStyle: {
        backgroundColor: Platform.OS == 'ios' ? '#FFFFFF' : '#1F1F1F',
        height:40,
      },
      headerTintColor: Platform.OS == 'ios' ? '#000000' : '#FFFFFF',
      headerRight: () => <Burger nav={this.props.navigation} />,
    };

  return (
    <Stack.Navigator initialRouteName={'TopDecks'}>
        
        <Stack.Screen
          name="TopDecks"
          component={actionsLists}
          navigationDrawer={this.props.navigation}
          initialParams={{ type: "deck" }}
          type="deck"
          options={() => ({
            title: 'Top Decks',
            ...stylesHeader,
          })}
        />
    
    </Stack.Navigator>
  );
}

}



  
 const styles = StyleSheet.create({
  backgroundStyle:{
    backgroundColor:"black"
  },
  image: {
      height: 300,
      width: 300,
      marginTop: 30,
      borderRadius: 10,
    },
  screen: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 35,
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#47477b',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
  },
});
  
//Get function
const mapStateToProps = (state) => {
  const {pro} = state;
  return {pro};
};

//Call set functions
const mapDispatchToProps = (dispatch) => bindActionCreators({setPro}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(StacksAbilities);