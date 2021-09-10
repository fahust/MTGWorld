import { StyleSheet,Image, ScrollView, View,  TouchableOpacity, Dimensions, ImageBackground} from 'react-native';
import React, { Component } from 'react';
import {
  Text,
  VStack,
  Center,
  Stack,
  Heading,
  Box,
} from "native-base"
import ConvertText from '../services/ConvertText';
import {connect} from 'react-redux';
import {setPro} from '../../redux/ProActions';
import {bindActionCreators} from 'redux';
import LinearGradient from 'react-native-linear-gradient'
import Ripple from 'react-native-advanced-ripple'
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
backgroundImg = require("../img/backgroundMagicFrench.jpeg");
const ArrayColors={
  "U" : require('../img/U.png'),
  "B" : require('../img/B.png'),
  "W" : require('../img/W.png'),
  "G" : require('../img/G.png'),
  "R" : require('../img/R.png')
}


function arrayUnique(array) {
  var a = array.concat();
  for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
          if(a[i] === a[j])
              a.splice(j--, 1);
      }
  }

  return a;
}

 class TopCards extends Component {
  constructor(properties) {
    super(properties);
    this.state = {
      inputValue: '',
      list: [],
    };
  }

  dataBigCard= () =>{
    Object.keys(this.props.pro.topCards).forEach((deck, itemI)=> {
      var uncomon = 0;
      var common = 0;
      var rare = 0;
      var mythic = 0;
      var price = 0;
      var colors = []
      Object.keys(this.props.pro.topCards).forEach((card, itemI)=> {
        //https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000
        if(this.props.pro.topCards[card].rarity == "uncommon") uncomon++
        if(this.props.pro.topCards[card].rarity == "common") common++
        if(this.props.pro.topCards[card].rarity == "rare") rare++
        if(this.props.pro.topCards[card].rarity == "mythic") mythic++
        if(this.props.pro.topCards[card].prices.eur != null) price += parseInt(this.props.pro.topCards[card].prices.eur);
        colors = arrayUnique(colors.concat(this.props.pro.topCards[card].color_identity));
      })
      this.props.pro.topCards[deck].uncomon = uncomon
      this.props.pro.topCards[deck].common = common
      this.props.pro.topCards[deck].rare = rare
      this.props.pro.topCards[deck].mythic = mythic
      this.props.pro.topCards[deck].price = price
      this.props.pro.topCards[deck].colors = colors
    })
  }


  render() {
    this.dataBigCard();
    var props = this.props;
    var tthis = this;
    var keysCard = Object.keys(props.pro.topCards);
    keysCard = keysCard.sort(function(a, b) {return props.pro.topCards[b].vote - props.pro.topCards[a].vote})
    
  return (
    <LinearGradient
      colors={['#191919', '#191919']}
      style={{
        height:Dimensions.get('window').height,
        width:Dimensions.get('window').width,
      }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
    <ParallaxScroll style={{marginBottom:80}}
      headerFixedBackgroundColor="rgba(25, 25, 25, 0)"
      fadeOutParallaxBackground={false}
      fadeOutParallaxForeground={true}
      headerHeight={0}
      isHeaderFixed={false}
      parallaxHeight={this.state.fullCard?dimensions.height-130:imageHeight}
      renderParallaxBackground={({ animatedValue }) => <ImageBackground  blurRadius={1} style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height/2,marginTop:Dimensions.get('window').height/3,resizeMode: 'cover',position:"absolute"}} source={backgroundImg} alt="image base" resizeMode="cover" roundedTop="md" imageStyle= {{opacity:0.1}} />}
      //renderParallaxForeground={({ animatedValue }) => this.headerRender()}
      //renderHeader={({ animatedValue }) => this.headerRenderForeground(animatedValue)}
      parallaxBackgroundScrollSpeed={10}
      parallaxForegroundScrollSpeed={1}>
      <ImageBackground  blurRadius={0} style={{width:Dimensions.get('window').width*1.5,height:130,resizeMode: 'cover',marginTop:-(this.state.fullCard?dimensions.height-130:imageHeight)}} source={backgroundImg} alt="image base" resizeMode="cover" roundedTop="md" >
      </ImageBackground>
      <Center flex={1} style={{marginBottom:80}}>
        <VStack space={4} flex={1} w="100%" mt={8}>
          <VStack>
          <View 
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
              flex: 1}}>
            {
            (keysCard?keysCard:Object.keys(props.pro.topCards)).map(function(item, itemI) {
              var cardsTemp = {}
              return  <TouchableOpacity style={{paddingBottom:30}}
                 key={props.pro.topCards[item].name + itemI.toString()} >
                   <Ripple highlight={true} cancelTolerance={100} color='rgb(255, 255, 255)'  onPress={() => { 
                props.navigation.navigate("OneCard", {item: props.pro.topCards[item],route:props.route,cantUpdate:false})}} >
                     <TouchableOpacity>
          <Box style={{margin:5,borderWidth:0.5,borderColor:"#000"}}  bg='#141519' shadow={5} rounded="lg" width={Dimensions.get('window').width/2.2} height={350}>
          <Image style={{width:Dimensions.get('window').width/2.2,height:150,resizeMode: 'contain',}} source={{uri: props.pro.topCards[item].image_uris.art_crop}} alt="image base" resizeMode="cover" roundedTop="md" />
          
          <Text color="yellow.400" mx={2} style={{fontWeight:"bold",fontSize:18,textShadowColor: 'rgba(0, 0, 0, 1)',textShadowOffset: {width: 2, height: 2},textShadowRadius: 10,color:props.pro.topCards[item].rarity == "uncommon"?"silver":(props.pro.topCards[item].rarity == "rare"?"gold":(props.pro.topCards[item].rarity == "common"?"darkgrey":("orange")))}} >
          {props.pro.topCards[item].printed_name && props.pro.topCards[item].printed_name != "" ? props.pro.topCards[item].printed_name : props.pro.topCards[item].name}
          </Text>
          <Stack space={0} p={[1, 1, 1]}>
            <View style={{overflow:"hidden",height:90}}>
              {props.pro.topCards[item].printed_text ? <Text style={{padding:5,color:"white"}}>{ConvertText(props.pro.topCards[item].printed_text,props.pro.topCards[item].lang)}</Text> : (props.pro.topCards[item].oracle_text?<Text style={{padding:5,color:"white"}}>{ConvertText(props.pro.topCards[item].oracle_text,props.pro.topCards[item].lang)}</Text>:<></>)}
            </View>
            <Heading size={["md", "lg", "md"]} noOfLines={2}>
              {/*props.pro.topCards[item].mana_cost.map((mana, keyMana) =>{return <View style={{position:"absolute",right:0,paddingLeft:5,paddingRight:5}}>
                <Image style={{width:20,height:20}} source={ArrayColors[mana]?ArrayColors[mana]:""} key={mana+keyMana}/>
                </View>
              })*/}
            </Heading>
            {Object.keys(cardsTemp).map((cardTemp)=>(
              <Text key={cardTemp} lineHeight={[5, 5, 7]} noOfLines={[4, 4, 2]} color="gray.700">
                {cardsTemp[cardTemp].name}
              </Text>
            ))}
            
          </Stack>
          <View style={{position:"absolute",bottom:10,left:0,flexDirection:"row"}}>
          <Text style={{fontWeight:"bold",fontSize:18, padding:3,color:"white",textAlign:"left"}}>{ConvertText(props.pro.topCards[item].mana_cost,props.pro.topCards[item].lang)}</Text>
          </View>
          <View style={{position:"absolute",bottom:10,right:0,flexDirection:"row"}}>
          {props.pro.topCards[item].power ? <Text style={{borderBottomColor:"white",borderBottomWidth:0.5,padding:10,color:"white",fontSize:20,fontWeight:"bold",fontStyle:"italic"}}>{props.pro.topCards[item].power + " / " + props.pro.topCards[item].toughness}</Text>:<></>}
          </View>
          
          {/*props.pro.topCards[item].price!=0?<Text style={{marginTop:2,fontWeight:"bold",fontSize:18,position:"absolute",left:5,bottom:5}}>{props.pro.topCards[item].price} eur</Text>:<></>*/}
          
          </Box>
          </TouchableOpacity>
          </Ripple>
          </TouchableOpacity>
          })}
            
          </View>
          </VStack>
        </VStack>
      </Center>
        
      </ParallaxScroll>
      </LinearGradient>
  );
}

}



const dimensions = Dimensions.get('window');
const imageHeight = Math.round(dimensions.width * 9 / 16);
const imageWidth = dimensions.width;

  
 const styles = StyleSheet.create({
  innerCircle: {
    borderRadius: 5,
    width: 10,
    height: 100,
    margin: 2,
    marginBottom: 25,
    padding: 2,
    paddingTop:5,
    marginTop:5,
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

export default connect(mapStateToProps, mapDispatchToProps)(TopCards);