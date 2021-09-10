import React, { Component } from 'react';
import stacksDecks from './deck/stacksDecks';
import stacksWishlist from './wishlists/stacksWishlist';
import stacksTopDecks from './topDeck/stacksTopDecks';
import stacksTopCards from './topCard/stacksTopCards';
import stacksCollections from './collections/stacksCollections';
import stacksAbilities from './abilities/stacksAbilities';
import stacksRulings from './rulings/stacksRulings';
import stacksPlayers from './players/stacksPlayers';

import storeData from './services/StoreData';
import clientToServer from './services/ClientToServer';



var DecksImg = require('./img/DecksImg.png');
var TopDecksImg = require('./img/TopDecksImg.png');
var CollectionsImg = require('./img/CollectionsImg.png');
var TopCardsImg = require('./img/TopCardsImg.png');
var WishlistImg = require('./img/WhishlistImg.png');

import {
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  SafeAreaView
} from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer,DefaultTheme  } from '@react-navigation/native';
import {connect} from 'react-redux';
import {setPro} from '../redux/ProActions';
import {bindActionCreators} from 'redux';
import AsyncStorage from '@react-native-community/async-storage';
import Dialog from "react-native-dialog";


 class App extends Component {
  constructor(properties) {
    super(properties);
    this.state={
      name:'',
      open:false,
    }
  }

  fetchAllSymbol = () => {
    fetch('https://api.scryfall.com/symbology', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      }).then((response) => response.json())
      .then((json) => {//console.log('test',json)//this.props.pro.symbols
        json.data.forEach(element => {
          this.props.pro.symbols[element.symbol] = element.svg_uri;
        });
        
    })
    .catch((error) => {
      console.error(error);
    });
  }


  sendDataServer(){
    fetch('https://api.scryfall.com/sets', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      }).then((response) => response.json())
      .then((json) => {
        //this.fetchAllSymbol();
        json.data.forEach(set => {
          //if(set.set_type != "token" && set.set_type != "promo" )
            this.props.pro.setName[set.code] = {"name":set.name,svg:set.icon_svg_uri};
          
          if(set.icon_svg_uri && set.icon_svg_uri != null){
            this.props.pro.set[set.code] = {icon : set.icon_svg_uri};
          }else{
            this.props.pro.set[set.code] = {icon : "https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"};
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });

      clientToServer(this.props.pro);
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('decks');
      if (value !== null) {
        var load = JSON.parse(value);
        //console.log(load.collectionsCards)
        this.props.pro.decks = load.decks;
        this.props.pro.wishlists = load.wishlists;
        this.props.pro.idClient = load.idClient;
        this.props.pro.topDecks = load.topDecks;
        this.props.pro.topCards = load.topCards;
        this.props.pro.voted = load.voted;
        this.props.pro.loved = load.loved;
        this.props.pro.collections = load.collections;
        this.props.pro.collectionsCards = load.collectionsCards;
        this.props.pro.nameClient = load.nameClient;
        this.props.pro.symbols = load.symbols
        if(load.lang) this.props.pro.lang = load.lang
        if(!this.props.pro.idClient) this.props.pro.idClient=Date.now();
        this.props.setPro({});
        this.sendDataServer();
      }else{
        this.props.pro.idClient=Date.now();
      }
    } catch (e) {
      console.log('error reading value', e);
    }
  };

  componentDidMount(){
    this.getData();
  }

  changeName = () => {
    this.props.pro.nameClient = this.state.name;
    storeData(this.props.pro);
    this.props.setPro({});
  }

  closeChangeName = () =>{
    if(this.state.name == ""){
      this.state.name = "client "+Date.now();
      this.props.pro.nameClient = this.state.name;
    }else{
      this.props.pro.nameClient = this.state.name;
    }
    storeData(this.props.pro);
    this.props.setPro({});
  }

  render() {
  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'black'
    },
  };
  const Drawer = createDrawerNavigator();
  return (<>
  <SafeAreaView
    style={{
      height:Dimensions.get('window').height+20,
      width:Dimensions.get('window').width,
    }}>
    <ImageBackground  blurRadius={1} style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height/2,marginTop:Dimensions.get('window').height/3,resizeMode: 'cover',position:"absolute"}} source={backgroundImg} alt="image base" resizeMode="cover" roundedTop="md" imageStyle= {{opacity:0.1}} />
    <Dialog.Container visible={this.props.pro.nameClient.length<=0?true:false}>
      <Dialog.Title>Choose your username</Dialog.Title>
      <Dialog.Input
      onRequestClose={()=>{this.closeChangeName()}}
      placeholder="Tap your Username"
      style={{width:imageWidth/2,backgroundColor:"white",height:40,color:"black"}}
      onChangeText={(text)=> this.setState({ name: text })}
      value={this.state.name}
      >
      </Dialog.Input>
      <Dialog.Button label="Choose" onPress={ ()=>{this.closeChangeName()} }  />
    </Dialog.Container>
    
    

        <NavigationContainer theme={MyTheme}>
          <Drawer.Navigator lazy={true}
          drawerContentOptions={{ 
            activeTintColor: '#7B4E89',
            backgroundColor: '#191919',
            inactiveTintColor:"white",
            labelStyle:{fontSize:20,fontWeight:"bold"}
          }}
          initialRouteName="stacksDecks">
            <Drawer.Screen name="stacksDecks" component={stacksDecks} options={{
                drawerLabel: "My Decks",
                drawerIcon: ({ color }) => <Image style={{width:30,height:30,margin:0,tintColor:"white"}} source={DecksImg} />
            }} />
            <Drawer.Screen name="stacksWishlist" component={stacksWishlist} options={{
                drawerLabel: "My Wishlists",
                drawerIcon: ({ color }) => <Image style={{width:30,height:30,margin:0,tintColor:"white"}} source={WishlistImg} />
            }} />
            <Drawer.Screen name="stacksCollections" component={stacksCollections} options={{
                drawerLabel: "My Collection",
                drawerIcon: ({ color }) => <Image style={{width:30,height:30,margin:0,tintColor:"white"}} source={CollectionsImg} />
            }} />
            <Drawer.Screen name="stacksTopDecks" component={stacksTopDecks} options={{
                drawerLabel: "Top Decks",
                drawerIcon: ({ color }) => <Image style={{width:30,height:30,margin:0,tintColor:"white"}} source={TopDecksImg} />
            }} />
            <Drawer.Screen name="stacksTopCards" component={stacksTopCards} options={{
                drawerLabel: "Top Cards",
                drawerIcon: ({ color }) => <Image style={{width:30,height:30,margin:0,tintColor:"white"}} source={TopCardsImg} />
            }} />
            <Drawer.Screen name="stacksPlayers" component={stacksPlayers} options={{
                drawerLabel: "Players",
                drawerIcon: ({ color }) => <Image style={{width:30,height:30,margin:0,tintColor:"white"}} source={TopDecksImg} />
            }} />
            <Drawer.Screen name="abilities" component={stacksAbilities} options={{
                drawerLabel: "Abilities",
                drawerIcon: ({ color }) => <Image style={{width:30,height:30,margin:0,tintColor:"white"}} source={DecksImg} />
            }} />
            <Drawer.Screen name="rulings" component={stacksRulings} options={{
                drawerLabel: "Rulings",
                drawerIcon: ({ color }) => <Image style={{width:30,height:30,margin:0,tintColor:"white"}} source={DecksImg} />
            }} />
          </Drawer.Navigator>
        </NavigationContainer>
        </SafeAreaView>
        
      </>
  );
}

}


const dimensions = Dimensions.get('window');
const imageHeight = Math.round(dimensions.width * 9 / 16);
const imageWidth = dimensions.width;

  
 const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
  
//Get function
const mapStateToProps = (state) => {
  const {pro} = state;
  return {pro};
};

//Call set functions
const mapDispatchToProps = (dispatch) => bindActionCreators({setPro}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);