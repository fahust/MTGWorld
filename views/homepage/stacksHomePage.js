import { StyleSheet,View } from 'react-native';
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {setPro} from '../../redux/ProActions';
import {bindActionCreators} from 'redux';
import {createStackNavigator} from '@react-navigation/stack';
import Burger from '../services/Burger';
import oneCard from '../card/oneCard';
import Homepage from './homepage';
import oneDeckView from './oneDeckView';
import allSets from './allSets';
import oneSet from './oneSet';

//import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

 class StacksHomePage extends Component {
  constructor(properties) {
    super(properties);
  }
  render() {
    
    //const Stack = createSharedElementStackNavigator();
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
    <Stack.Navigator initialRouteName={'HomePageView'}>
        
        <Stack.Screen
          name="HomePageView"
          component={Homepage}
          navigationDrawer={this.props.navigation}
          initialParams={{ type: "deck" }}
          type="deck"
          options={() => ({
            title: 'HomePage',
            ...stylesHeader,
          })}
        />
        <Stack.Screen
          name="OneCardView"
          component={oneCard}
          navigationDrawer={this.props.navigation}
          options={() => ({
            title: 'Accueil',
            ...stylesHeader,
          })}
        />
        <Stack.Screen
          name="OneDeckView"
          component={oneDeckView}
          initialParams={{ type: "deck" }}
          navigationDrawer={this.props.navigation}
          options={() => ({
            title: 'Accueil',
            ...stylesHeader,
          })}
        />
        <Stack.Screen
          name="allSets"
          component={allSets}
          initialParams={{ type: "deck" }}
          navigationDrawer={this.props.navigation}
          options={() => ({
            title: 'All Sets',
            ...stylesHeader,
          })}
        />
        <Stack.Screen
          name="oneSet"
          component={oneSet}
          initialParams={{ type: "deck" }}
          navigationDrawer={this.props.navigation}
          options={() => ({
            title: 'One Set',
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

export default connect(mapStateToProps, mapDispatchToProps)(StacksHomePage);