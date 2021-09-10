import { StyleSheet, View,Dimensions ,ImageBackground,Image} from 'react-native';
import React, { Component } from 'react';
import {
  Text,
  Select,
  CheckIcon,
} from "native-base"
import {connect} from 'react-redux';
import {setPro} from '../redux/ProActions';
import {bindActionCreators} from 'redux';
import { SvgUri } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import storeData from './services/StoreData';
import * as Animatable from 'react-native-animatable';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Toast, {DURATION} from 'react-native-easy-toast'

import Cards from './oneMultiCards';
import Analyze from './oneMultiAnalyze';
import Settings from './oneMultiSettings';

var DecksImg = require('./img/DecksImg.png');

const Tab = createMaterialTopTabNavigator();


 class OneMulti extends Component {
  constructor(properties) {
    super(properties);
    this.use = this.props.use[this.props.route.params.item]?this.props.use[this.props.route.params.item]:(this.props.use);
    //console.log(this.use)
  }

  componentDidMount(){
    this.props.navigation.addListener('focus', () => {
      this.setState({})
    });
  }

  changeMode = (text) =>{
    this.toast.show('Deck format updated', 2000);
    this.use.mode = text;
    storeData(this.props.pro);
    this.setState({})
    this.props.setPro({});
  }

  render() {

  return <>
  <Toast opacity={1} textStyle={{color:'white',fontSize:16,fontWeight:"bold"}} ref={(toast) => this.toast = toast}/>
    <ImageBackground  blurRadius={1} style={{backgroundColor:"rgba(25,25,25,1)",width:Dimensions.get('window').width,height:Dimensions.get('window').height/1.2,paddingTop:Dimensions.get('window').width/4,marginTop:Dimensions.get('window').width/4,marginBottom:Dimensions.get('window').width/1.5,paddingBottom:Dimensions.get('window').width/2,resizeMode: 'contain',position:"absolute"}} source={backgroundImg} alt="image base" resizeMode="contain" roundedTop="md" imageStyle= {{opacity:0.1}} />
    
    
  <ImageBackground  blurRadius={8} style={{width:Dimensions.get('window').width*1.5,height:100,resizeMode: 'cover'}} source={{uri: this.use.image&&this.use.image.image_uris&&this.use.image.image_uris.art_crop?this.use.image.image_uris.art_crop:(this.use.cards && Object.keys(this.use.cards).length>0 && this.use.cards[Object.keys(this.use.cards)[0]].image_uris && this.use.cards[Object.keys(this.use.cards)[0]].image_uris.art_crop?this.use.cards[Object.keys(this.use.cards)[0]].image_uris.art_crop:"https://media.wizards.com/2017/images/daily/41mztsnrdm.jpg")}} alt="image base" resizeMode="cover" roundedTop="md" >
  <ImageBackground  style={{width:Dimensions.get('window').width/3,height:90,resizeMode: 'contain',paddingTop:25,top:5,left:5}} source={{uri: this.use.image&&this.use.image.image_uris&&this.use.image.image_uris.art_crop?this.use.image.image_uris.art_crop:(this.use.cards && Object.keys(this.use.cards).length>0 && this.use.cards[Object.keys(this.use.cards)[0]].image_uris && this.use.cards[Object.keys(this.use.cards)[0]].image_uris.art_crop?this.use.cards[Object.keys(this.use.cards)[0]].image_uris.art_crop:"https://media.wizards.com/2017/images/daily/41mztsnrdm.jpg")}} alt="image base" resizeMode="cover" roundedTop="md" />
  <View style={{width:Dimensions.get('window').width/3,position:"absolute",right:Dimensions.get('window').width*0.5,top:0}}>
  {this.props.collections?<></>:<Animatable.View  animation="rubberBand" delay={1000}><Select
      isDisabled={this.props.cantUpdate==true||this.props.collections?true:false}
      style={{backgroundColor:"rgba(0,0,0,0.5)",width:50,fontSize:10,color:"white"}}
        selectedValue={this.use.mode}
        minWidth={50}
        minheight={10}
        height={10}
        accessibilityLabel="Mode"
        placeholder="Mode"
        onValueChange={(itemValue) => {
          this.changeMode(itemValue)
        }}
        _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon size={10} />,
        }}
        mt={1}
      >
        <Select.Item label="Standard" value="standard" />
        <Select.Item label="Future" value="future" />
        <Select.Item label="Historic" value="historic" />
        <Select.Item label="Gladiator" value="gladiator" />
        <Select.Item label="Pioneer" value="pioneer" />
        <Select.Item label="Modern" value="modern" />
        <Select.Item label="Legacy" value="legacy" />
        <Select.Item label="Pauper" value="pauper" />
        <Select.Item label="Vintage" value="vintage" />
        <Select.Item label="Penny" value="penny" />
        <Select.Item label="Commander" value="commander" />
        <Select.Item label="Brawl" value="brawl" />
        <Select.Item label="Duel" value="duel" />
        <Select.Item label="Oldschool" value="oldschool" />
        <Select.Item label="Premodern" value="premodern" />
      </Select></Animatable.View>}
      <Text style={{color:"white",fontSize:20,fontWeight:"bold",padding:2,textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 2,right:-20}}>{Object.keys(this.use.cards).length} Cards</Text>
      <View style={{bottom:0,right:80,flexDirection:"row",textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 2,}}>
          <SvgUri
            style={styles.innerCircle} fill={"#888A8D"} stroke={"#888A8D"}
            strokeWidth={2} strokeOpacity={1} strokeLinecap="butt" color={"black"} fillOpacity={1} width="18" height="20"
            uri="https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"
          />
          <Text style={{marginTop:2,fontWeight:"bold",fontSize:16,color:"white",textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 2,}}>{this.use.common}</Text>
          <SvgUri
            style={styles.innerCircle} fill={"#83AFC2"} stroke={"#83AFC2"}
            strokeWidth={2} strokeOpacity={1} strokeLinecap="butt" color={"white"} fillOpacity={1} width="18" height="20"
            uri="https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"
          />
          <Text style={{marginTop:2,fontWeight:"bold",fontSize:16,color:"white",textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 2,}}>{this.use.uncomon}</Text>
          <SvgUri
            style={styles.innerCircle} fill={"#CFA20B"} stroke={"#CFA20B"}
            strokeWidth={2} strokeOpacity={1} strokeLinecap="butt" color={"white"} fillOpacity={1} width="18" height="20"
            uri="https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"
          />
          <Text style={{marginTop:2,fontWeight:"bold",fontSize:16,color:"white",textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 2,}}>{this.use.rare}</Text>
          <SvgUri
            style={styles.innerCircle} fill={"#D15410"} stroke={"#000"}
            strokeWidth={2} strokeOpacity={1} strokeLinecap="butt" color={"white"} fillOpacity={1} width="18" height="20"
            uri="https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"
          />
          <Text style={{marginTop:2,fontWeight:"bold",fontSize:16,color:"white",textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 2,}}>{this.use.mythic}</Text>
        </View>
      </View>
    </ImageBackground>
    <View style={{backgroundColor:"#fff",position:"absolute",height:Dimensions.get('window').height}}></View>
    <Tab.Navigator swipeEnabled={false} sceneContainerStyle={{backgroundColor: 'rgba(25,25,25,0)'}} initialRouteName="cards" screenOptions={{tabBarStyle:{backgroundColor:"rgba(25,25,25,0)"},tabBarLabelStyle:{fontSize:14}}} tabBarOptions={{showIcon: true, height:0, tabStyle:{ marginTop:(Platform.OS === 'ios') ? 0 : 0, flexDirection: 'row' }, style: { backgroundColor: 'rgba(25,25,25,0)', color: '#ffffff' }, headerStyle: { backgroundColor: "rgba(25,25,25,0)", height:0, }, visible: false, labelStyle: { fontSize: 15, fontWeight:"bold", }, indicatorStyle: { borderBottomColor: '#ffffff', borderBottomWidth: 2, }, activeTintColor: '#ffffff' }}>
      <Tab.Screen name="cards" options={{ tabBarIcon: ({ color, size }) => (
          <Image style={{width:20,height:20,marginTop:3,tintColor:"white"}} source={DecksImg} />
        ), tabBarLabel: 'Cards' }}>
        {(nav) => <Cards navigation={this.props.navigation} item={this.props.route.params.item} use={this.props.use} collections={this.props.collections} cantUpdate={this.props.cantUpdate} oneNavigateType={this.props.oneNavigateType}/>}
      </Tab.Screen>
      <Tab.Screen name="analyze" options={{ 
        tabBarIcon: ({ color, size }) => (
          <Icon name="database" size={20} color="white" style={{paddingVertical:2}}/>
        ), tabBarLabel: 'Analyze' }}>
        {(nav) => <Analyze navigation={this.props.navigation} item={this.props.route.params.item} use={this.props.use} collections={this.props.collections} cantUpdate={this.props.cantUpdate} oneNavigateType={this.props.oneNavigateType}/>}
      </Tab.Screen>
      <Tab.Screen name="settings" options={{
        tabBarIcon: ({ color, size }) => (
          <Icon name="cog" size={20} color="white" style={{paddingVertical:2}}/>
        ), tabBarLabel: 'Settings' }}>
        {(nav) => <Settings navigation={this.props.navigation} item={this.props.route.params.item} use={this.props.use} collections={this.props.collections} cantUpdate={this.props.cantUpdate} oneNavigateType={this.props.oneNavigateType} />}
      </Tab.Screen>
    </Tab.Navigator>
    </>
}

}

 const styles = StyleSheet.create({
  innerCircle: {
    borderRadius: 5,
    width: 50,
    height: 50,
    margin: 5,
    padding: 5,
    //backgroundColor:"rgba(0, 0, 0, 0.15)"
    //backgroundColor: 'rgba(50, 50, 50, 1.0)'
  },
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

export default connect(mapStateToProps, mapDispatchToProps)(OneMulti);