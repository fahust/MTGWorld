import { StyleSheet,View} from 'react-native';
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {setPro} from '../../redux/ProActions';
import {bindActionCreators} from 'redux';
import {createStackNavigator} from '@react-navigation/stack';
import Burger from '../services/Burger';
import Scanner from '../services/scanner';
import oneTopDeck from './oneTopDeck';
import oneCard from '../card/oneCard';
import TopDecks from './topDecks';
import addCardByText from '../card/addCardByText';
import addCardFilter from '../card/addCardFilter';

 class StacksTopDecks extends Component {
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
          component={TopDecks}
          navigationDrawer={this.props.navigation}
          initialParams={{ type: "deck" }}
          type="deck"
          options={() => ({
            title: 'Top Decks',
            ...stylesHeader,
          })}
        />
        <Stack.Screen
          name="addCardByText"
          component={addCardByText}
          navigationDrawer={this.props.navigation}
          options={() => ({
            title: 'Add Card',
            ...stylesHeader,
          })}
        />
        <Stack.Screen
          name="addCardFilter"
          component={addCardFilter}
          navigationDrawer={this.props.navigation}
          options={() => ({
            title: 'Filter',
            ...stylesHeader,
          })}
        />
        
        <Stack.Screen
          name="Scanner"
          component={Scanner}
          navigationDrawer={this.props.navigation}
          options={() => ({
            title: 'Scan Card',
            ...stylesHeader,
          })}
        />
        <Stack.Screen
          name="OneTopDeck"
          component={oneTopDeck}
          initialParams={{ type: "deck" }}
          navigationDrawer={this.props.navigation}
          options={() => ({
            title: 'Accueil',
            ...stylesHeader,
          })}
        />
        <Stack.Screen
          name="OneCard"
          component={oneCard}
          navigationDrawer={this.props.navigation}
          options={() => ({
            title: 'Accueil',
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

export default connect(mapStateToProps, mapDispatchToProps)(StacksTopDecks);