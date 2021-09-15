import { StyleSheet,Image, ScrollView, View, TouchableOpacity, ImageBackground,Dimensions, Alert, Linking, KeyboardAvoidingView, TouchableHighlight} from 'react-native';
import React, { Component } from 'react';
import {
  Input,
  IconButton,
  Text,
  VStack,
  Center,
  Stack,
  Heading,
  Box,
  Select,
  CheckIcon,
  Menu, Pressable,Checkbox
} from "native-base"
import {connect} from 'react-redux';
import {setPro} from '../../redux/ProActions';
import {bindActionCreators} from 'redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SvgUri } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient'
import * as Animatable from 'react-native-animatable';

import storeData from '../services/StoreData';
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import Ripple from 'react-native-advanced-ripple'

import Toast, {DURATION} from 'react-native-easy-toast'
import Carousel, { ParallaxImage }  from 'react-native-snap-carousel';

import DividerLinear from '../services/DividerLinear';

backgroundImg = require("../img/backgroundMagicFrench.jpeg");
const ArrayColors={
  "U" : require('../img/U.png'),
  "B" : require('../img/B.png'),
  "W" : require('../img/W.png'),
  "G" : require('../img/G.png'),
  "R" : require('../img/R.png')
}

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

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

 class MyMulti extends Component {
  constructor(properties) {
    super(properties);
    this.state = {
      inputValue: '',
      list: [],
      searchDeck:'',
      orderBy:'name',
      pagination:0,
      topDecksResult:{},
      mode:"",
      notFound:false,
      colors:[],
      filterActive:true,
      entries:[],
    };
  }

  componentDidMount(){
    setTimeout(() => {
      this.dataBigCard();
    }, 2000);
    this.props.navigation.addListener('focus', () => {
      this.props.setPro({});
    });
  }

  
  
  addItem = (title) => {
    var dateNow = Date.now();
    this.props.route.params.item
    if(this.props.oneNavigate=='OneDeck')
      this.props.pro.lastDeckUpdate = dateNow;
    this.props.use[dateNow] = {
      title : title,
      cards : {},
      idClient : this.props.pro.idClient,
      vote:0,
      keyCards:{},
      sideCards:{},
      description:"",
      mode:"standard",
    }
    this.toast.show('Deck created', 2000);
    storeData(this.props.pro);
    this.props.setPro({});
  };

  handleDelete = (index) => {
    Alert.alert(
      "WARNING",
      "Are you sure to delete this deck ?",
      [
        { text: "Delete", onPress: () => {
            this.toast.show('Deck deleted', 2000);
            delete this.props.use[index];
            this.props.pro.noSendModif = true;
            storeData(this.props.pro);
            this.props.setPro({});
          } 
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ]
    );
  };

  duplicateWishlist = (index,deckloop) => {
    Alert.alert(
      "WARNING",
      "Are you sure to add this deck at yours whishlist ?",
      [
        { text: "Add", onPress: () => {
            this.toast.show('Deck duplicated to wishlist', 2000);
            this.props.pro.wishlists[index] = deckloop[index];
            this.props.pro.noSendModif = true;
            storeData(this.props.pro);
            this.props.setPro({});
          } 
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ]
    );
  };

  duplicate = (index,deckloop) => {
    Alert.alert(
      "WARNING",
      "Are you sure to add this deck at yours decks ?",
      [
        { text: "Add", onPress: () => {
            this.toast.show('Deck duplicated to your decks', 2000);
            
            this.props.pro.decks[index] = deckloop[index];
            this.props.pro.decks[index].duplicated = true;
            this.props.pro.noSendModif = true;
            storeData(this.props.pro);
            this.props.setPro({});
          } 
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        }
      ]
    );
  };

  vote = (index) => {
    fetch('http://'+this.props.pro.url+'/vote', {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'same-origin',
        body: JSON.stringify({'deck':index,'idClient':this.props.use[index].idClient}),
        headers: {
          'Accept':       'application/json',
          'Content-Type': 'application/json'
        }
      }).then((response) => {return response.json();})
      .then((data) => {
        if(data=="ok"){
          this.props.pro.voted.push(index);
          if(this.props.use[index])
          this.props.use[index].vote++
          this.props.setPro({});
          this.props.pro.noSendModif = true;
          storeData(this.props.pro);
        }
      })
      .catch((error) => {
        console.error('net error',error);
      });
  };

  unvote = (index) => {
    fetch('http://'+this.props.pro.url+'/unvote', {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'same-origin',
        body: JSON.stringify({'deck':index,'idClient':this.props.use[index].idClient}),
        headers: {
          'Accept':       'application/json',
          'Content-Type': 'application/json'
        }
      }).then((response) => {return response.json();})
      .then((data) => {
        if(data=="ok"){
          if (this.props.pro.voted.indexOf(index) > -1) 
          this.props.pro.voted.splice(this.props.pro.voted.indexOf(index), 1);
          if(this.props.use[index])
          this.props.use[index].vote--
          this.props.setPro({});
          this.props.pro.noSendModif = true;
          storeData(this.props.pro);
        }
      })
      .catch((error) => {
        console.error('net error',error);
      });
    //storeData(this.props.pro);
  };

  changeName = (text,index) => {
    this.props.use[index].title = text;
  }

  endEditingTitle = (index) =>{
    this.toast.show('Deck name updated', 2000);
    this.props.pro.noSendModif = true;
    storeData(this.props.pro);
    this.props.setPro({});
  }

  changeMode = (text,index) =>{
    this.toast.show('Deck format updated', 2000);
    this.props.use[index].mode = text;
    if(this.props.oneNavigate=='OneDeck')
      this.props.pro.lastDeckUpdate = index;
    storeData(this.props.pro);
    this.setState({})
    this.props.setPro({});
  }

  dataBigCard= () =>{
    this.state.entries = []
    //console.log(this.props.pro.topCards)
      Object.keys(this.props.pro.topCards).forEach((card, itemI)=> {//console.log(this.props.pro.topCards[card])
        this.state.entries.push({title:this.props.pro.topCards[card].name,text:'',thumbnail:this.props.pro.topCards[card].image_uris.art_crop,setName:this.props.pro.topCards[card].set_name,card:this.props.pro.topCards[card]});
      })

    Object.keys(this.props.pro.decks).forEach((deck, itemI)=> {
      var uncomon = 0;
      var common = 0;
      var rare = 0;
      var mythic = 0;
      var price = 0;
      var colors = []
      Object.keys(this.props.pro.decks[deck].cards).forEach((card, itemI)=> {
        //https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000
        if(this.props.pro.decks[deck].cards[card].rarity == "uncommon") uncomon++
        if(this.props.pro.decks[deck].cards[card].rarity == "common") common++
        if(this.props.pro.decks[deck].cards[card].rarity == "rare") rare++
        if(this.props.pro.decks[deck].cards[card].rarity == "mythic") mythic++
        if(this.props.pro.decks[deck].cards[card].prices.eur != null) price += parseInt(this.props.pro.decks[deck].cards[card].prices.eur);
        colors = arrayUnique(colors.concat(this.props.pro.decks[deck].cards[card].color_identity));
      })
      this.props.pro.decks[deck].uncomon = uncomon
      this.props.pro.decks[deck].common = common
      this.props.pro.decks[deck].rare = rare
      this.props.pro.decks[deck].mythic = mythic
      this.props.pro.decks[deck].price = price
      this.props.pro.decks[deck].colors = colors
    })
    this.setState({})
  }

  linkFormat = (mode) => {
    if(mode == "standard"){
      return <Text onPress={()=>{Linking.openURL("https://magic.wizards.com/en/formats/standard")}} style={{color:"blue",padding:30,textDecorationLine: 'underline',fontWeight:"bold",alignSelf:"center"}}>Presentation of the {mode} format</Text>
    }else if(mode == "modern"){
      return <Text onPress={()=>{Linking.openURL("https://magic.wizards.com/en/game-info/gameplay/formats/modern")}} style={{color:"blue",padding:10,textDecorationLine: 'underline',fontWeight:"bold",alignSelf:"center"}}>Presentation of the {mode} format</Text>
    }else if(mode == "commander"){
      return <Text onPress={()=>{Linking.openURL("https://magic.wizards.com/en/content/commander-format")}} style={{color:"blue",padding:10,textDecorationLine: 'underline',fontWeight:"bold",alignSelf:"center"}}>Presentation of the {mode} format</Text>
    }else if(mode == "brawl"){
      return <Text onPress={()=>{Linking.openURL("https://magic.wizards.com/en/game-info/gameplay/formats/brawl")}} style={{color:"blue",padding:10,textDecorationLine: 'underline',fontWeight:"bold",alignSelf:"center"}}>Presentation of the {mode} format</Text>
    }else if(mode == "vintage"){
      return <Text onPress={()=>{Linking.openURL("https://magic.wizards.com/en/game-info/gameplay/formats/vintage")}} style={{color:"blue",padding:10,textDecorationLine: 'underline',fontWeight:"bold",alignSelf:"center"}}>Presentation of the {mode} format</Text>
    }else if(mode == "legacy"){
      return <Text onPress={()=>{Linking.openURL("https://magic.wizards.com/en/game-info/gameplay/formats/legacy")}} style={{color:"blue",padding:10,textDecorationLine: 'underline',fontWeight:"bold",alignSelf:"center"}}>Presentation of the {mode} format</Text>
    }else if(mode == "pioneer"){
      return <Text onPress={()=>{Linking.openURL("https://magic.wizards.com/en/game-info/gameplay/formats/pioneer")}} style={{color:"blue",padding:10,textDecorationLine: 'underline',fontWeight:"bold",alignSelf:"center"}}>Presentation of the {mode} format</Text>
    }else if(mode == "pauper"){
      return <Text onPress={()=>{Linking.openURL("https://magic.wizards.com/en/game-info/gameplay/formats/pauper")}} style={{color:"blue",padding:10,textDecorationLine: 'underline',fontWeight:"bold",alignSelf:"center"}}>Presentation of the {mode} format</Text>
    }
  }

  navigateToDeck = (props,item,deck,view) => {
    //if(this.props.oneNavigate == 'OneTopDeck') this.props.pro.allNavigation["topDeck"] = this.props.navigation;
    props.navigation.navigate("OneDeckView", {item: item,route:props.route,cantUpdate:true,player:props.player?props.player:undefined,decks:deck})
  }

  addIndexToScroll = () => {
    this.setState({pagination:this.state.pagination+6},()=>{this.searchTopDeck()})
  }

  
  _renderItem = ({item, index}, parallaxProps) => {
    return (
      <View style={{
        backgroundColor:"rgba(0,0,0,0)",
        borderRadius: 0,
        height: 250,
        padding: 0,
        marginTop:10,}}>
        <ParallaxImage
          source={{ uri: item.thumbnail }}
          containerStyle={{width:Dimensions.get('window').width,height:'100%',top:0,backgroundColor:"rgba(0,0,0,0)"}}
          style={{resizeMode: 'cover',top:0}}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
        <TouchableOpacity onPress={() => {
        this.props.navigation.navigate("OneCard", {item: item.card,route:this.props.route,cantUpdate:false})}} style={{width:Dimensions.get('window').width,height:'100%',top:0,backgroundColor:"rgba(0,0,0,0)",position:"absolute",zIndex:9999}}></TouchableOpacity>
      <Text style={{width:Dimensions.get('window').width+10,fontSize: 26,fontWeight:"bold",position:"absolute",top:0,color:"white",textAlign:"center",alignSelf:"center",backgroundColor:"rgba(0,0,0,0.5)"}}>{item.title}</Text>
      <Text style={{width:Dimensions.get('window').width+10,fontSize: 20,position:"absolute",bottom:0,color:"white",textAlign:"center",alignSelf:"center",backgroundColor:"rgba(0,0,0,0.5)"}}>{item.setName}</Text>
      <Text>{item.text}</Text>
    </View>
    );
}

DeckList = (props,decks,tthis) => {
  return <View 
  style={{
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1}}>
  {(Object.keys(decks)).map(function(item, itemI) {
    var cardsTemp = {}
    var BreakException = {};
    try {
      Object.keys(decks[item].cards).forEach((card,key) => {
        if(decks[item].cards[card]){
          cardsTemp[decks[item].cards[card].name] = decks[item].cards[card]
          if(Object.keys(cardsTemp).length >1)
          throw BreakException;
        }
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }
    return <Animatable.View animation="fadeIn" style={{margin:5,paddingBottom:30}}>
    <TouchableHighlight cancelTolerance={100} useForeground={true} style={{borderRadius: 5,zIndex:-999,backgroundColor:"rgba(25,25,25,1)"}}  rippleColor="rgba(255,255,255,0.5)" activeOpacity={0.5} underlayColor="rgba(255,255,255,0.5)" onPress={() => {tthis.navigateToDeck(props,item,decks,"OneTopDeck")}}
       key={decks[item].title + itemI.toString()} >
         <View>
<Box style={{borderColor:"black",borderWidth:0.5}} shadow={5} rounded="lg" width={Dimensions.get('window').width/2.2} height={350}>
<Ripple cancelTolerance={100} color='rgb(255, 255, 255)' onPress={()=>{tthis.navigateToDeck(props,item,decks,"OneTopDeck")}}><ImageBackground style={{width:Dimensions.get('window').width/2.2,height:150,resizeMode: 'contain',}} source={{uri: decks[item].image&&decks[item].image.image_uris&&decks[item].image.image_uris.art_crop?decks[item].image.image_uris.art_crop:(cardsTemp[Object.keys(cardsTemp)[0]]&&cardsTemp[Object.keys(cardsTemp)[0]].image_uris&&cardsTemp[Object.keys(cardsTemp)[0]].image_uris.art_crop?cardsTemp[Object.keys(cardsTemp)[0]].image_uris.art_crop:(cardsTemp[Object.keys(cardsTemp)[0]]&&cardsTemp[Object.keys(cardsTemp)[0]].image_uris&&cardsTemp[Object.keys(cardsTemp)[0]].image_uris.art_crop?cardsTemp[Object.keys(cardsTemp)[0]].image_uris.art_crop:"https://media.wizards.com/2017/images/daily/41mztsnrdm.jpg"))}} alt="image base" resizeMode="cover" roundedTop="md" >

  
</ImageBackground>
</Ripple>
<View style={{width:Dimensions.get('window').width/3,position:"absolute",right:0}}>
<Text style={{right:0,position:"absolute",backgroundColor:"rgba(0,0,0,0.5)",fontSize:20,color:"white",fontWeight:"bold",padding:5,}}>{decks[item].mode?decks[item].mode.charAt(0).toUpperCase() + decks[item].mode.slice(1):''}</Text>
  </View>

<Text style={{fontSize:25,fontWeight:"bold",color:"white",top:0,marginLeft:5}}>{decks[item].title}</Text>

<Ripple cancelTolerance={100} color='rgb(255, 255, 255)' onPress={()=>{tthis.navigateToDeck(props,item,decks,"OneTopDeck")}}>
  <Stack space={0} p={[1, 1, 1]}>
    <Heading size={["md", "lg", "md"]} noOfLines={2}>
      {decks[item]&&decks[item].colors?decks[item].colors.map((color, keyColor) =>{return <View key={color+keyColor} style={{position:"absolute",right:0,paddingLeft:5,paddingRight:5}}>
        <Image style={{width:20,height:20}} source={ArrayColors[color]?ArrayColors[color]:""} />
        </View>
      }):<View></View>}
    </Heading>
    <View style={{padding:10,overflow:"hidden",height:75}}>
    {Object.keys(cardsTemp).map((cardTemp)=>(
      <Text key={cardTemp} lineHeight={[5, 5, 7]} noOfLines={[4, 4, 2]} color="gray.300" style={{fontSize:14} }>
        {cardsTemp[cardTemp].name}
      </Text>
    ))}
    </View>
    
  </Stack>
  <View style={{bottom:10,left:0,right:0,flexDirection:"row",flexGrow:1,justifyContent:"center",alignContent:"center"}}>
    <SvgUri
      style={styles.innerCircle} fill={"#BBBCBE"} stroke={"#BBBCBE"}
      strokeWidth={2} strokeOpacity={1} strokeLinecap="butt" color={"white"} fillOpacity={1} width="18" height="20"
      uri="https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"
    />
    <Text style={{marginTop:2,fontWeight:"bold",fontSize:16,color:"white"}}>{decks[item].common}</Text>
    <SvgUri
      style={styles.innerCircle} fill={"#83AFC2"} stroke={"#83AFC2"}
      strokeWidth={2} strokeOpacity={1} strokeLinecap="butt" color={"white"} fillOpacity={1} width="18" height="20"
      uri="https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"
    />
    <Text style={{marginTop:2,fontWeight:"bold",fontSize:16,color:"white"}}>{decks[item].uncomon}</Text>
    <SvgUri
      style={styles.innerCircle} fill={"#CFA20B"} stroke={"#CFA20B"}
      strokeWidth={2} strokeOpacity={1} strokeLinecap="butt" color={"white"} fillOpacity={1} width="18" height="20"
      uri="https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"
    />
    <Text style={{marginTop:2,fontWeight:"bold",fontSize:16,color:"white"}}>{decks[item].rare}</Text>
    <SvgUri
      style={styles.innerCircle} fill={"#D15410"} stroke={"#D15410"}
      strokeWidth={2} strokeOpacity={1} strokeLinecap="butt" color={"white"} fillOpacity={1} width="18" height="20"
      uri="https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"
    />
    <Text style={{marginTop:2,fontWeight:"bold",fontSize:16,color:"white"}}>{decks[item].mythic}</Text>
  </View>
</Ripple>


{/*decks[item].price!=0?<Text style={{marginTop:2,fontWeight:"bold",fontSize:18,position:"absolute",left:5,bottom:5,color:"white"}}>{decks[item].price} eur</Text>:<></>*/}

{true?<></>:<View style={{position:"absolute",bottom:0,right:0,zIndex:999}}>
  <IconButton
  colorScheme="emerald"
  icon={<Icon name="trash" size={20} color="white" />}
  onPress={() => tthis.handleDelete(item)}
/></View>}
  {!true?<></>:<View style={{flexDirection:"row",position:"absolute",bottom:0,flexGrow:1}}>
    <View style={{paddingRight:Dimensions.get('window').width/4,left:0}}>
      <Menu
      trigger={(triggerProps) => {
        return (
          <Pressable accessibilityLabel="More options menu" {...triggerProps}>
            <Icon style={{margin:5}} name="copy" size={25} color="white" />
          </Pressable>
        )
      }}
      >
        <Menu.Item onPress={() => {tthis.duplicate(item,decks)}} style={{flexDirection:"row"}}><Icon name="copy" size={20} color="black" />  Duplicate to my decks</Menu.Item>
        <Menu.Item onPress={() => {tthis.duplicateWishlist(item,decks)}} style={{flexDirection:"row"}}><Icon name="copy" size={20} color="black" />  Duplicate to my whishlists</Menu.Item>
      </Menu>
    </View>

    <Text style={{fontWeight:"bold",marginTop:8,color:"white"}}>{decks[item].vote}</Text>
    <IconButton
    style={{}}
    colorScheme="emerald"
    icon={<Icon name={props.pro.voted.includes(item)?"thumbs-down":"thumbs-up"} size={20} color="white" />}
    onPress={() => props.pro.voted.includes(item)?tthis.unvote(item):tthis.vote(item)}/>
  </View>}
</Box>
  </View>
</TouchableHighlight>
</Animatable.View>
})}
</View>
}


  render() {
    var props = this.props;
    var tthis = this;
    /*if(true){
      if(Object.keys(this.state.topDecksResult).length>0){
        var keysCard = Object.keys(this.state.topDecksResult);
        var this.props.pro.topDecks = this.state.topDecksResult;
      }else{
        var this.props.pro.topDecks = this.props.use;
        var keysCard = Object.keys(props.use);
        keysCard = keysCard.sort(function(a, b) {return props.use[b].vote - props.use[a].vote})
      }
    }else{
      var this.props.pro.topDecks = this.props.use;
    }*/
    
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
      <Toast opacity={1} textStyle={{color:'white',fontSize:16,fontWeight:"bold"}} ref={(toast) => this.toast = toast}/>
      <KeyboardAvoidingView
      keyboardVerticalOffset={80}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ParallaxScroll style={{marginBottom:80}}
      headerFixedBackgroundColor="rgba(25, 25, 25, 1)"
      headerBackgroundColor="rgba(25, 25, 25, 0)"
      fadeOutParallaxBackground={true}
      fadeOutParallaxForeground={true}
      headerHeight={200}
      parallaxHeight={250}
      parallaxHeight={this.state.fullCard?dimensions.height-130:imageHeight}
      renderParallaxBackground={({ animatedValue }) => <ImageBackground  blurRadius={1} style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height/2,marginTop:Dimensions.get('window').height/3,resizeMode: 'cover',position:"absolute"}} source={backgroundImg} alt="image base" resizeMode="cover" roundedTop="md" imageStyle= {{opacity:0.1}} 
      />}
      //renderParallaxForeground={({ animatedValue }) => this.filterRender(props,tthis);}
      //renderHeader={({ animatedValue }) => this.filterRender(props,tthis)}
      parallaxBackgroundScrollSpeed={10}
      parallaxForegroundScrollSpeed={1}
      isHeaderFixed={true}
      onScroll={({nativeEvent}) => {
        if (isCloseToBottom(nativeEvent)&&this.props.oneNavigate == 'OneTopDeck') {
          this.addIndexToScroll();
        }
      }}
      scrollEventThrottle={400}
      >
      <Animatable.View animation="fadeIn" style={{marginBottom:150,marginTop:-(this.state.fullCard?dimensions.height-130:imageHeight)}}>
        <ImageBackground  blurRadius={0} style={{width:Dimensions.get('window').width*1.5,height:130,resizeMode: 'cover',}} source={backgroundImg} alt="image base" resizeMode="cover" roundedTop="md" >
          </ImageBackground>
      <Center flex={1}>
        <VStack space={4} flex={1} w="100%" mt={4}>
        <Carousel layout={'default'} 
          autoplay={true}
          loop={true}
          //autoplayInterval
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
          lockScrollWhileSnapping={true}
          enableMomentum={true}
          ref={(c) => { this._carousel = c; }}
          data={this.state.entries}
          renderItem={this._renderItem}
          sliderWidth={Dimensions.get('window').width+10}
          itemWidth={Dimensions.get('window').width+10}
          hasParallaxImages={true}/>
        {this.state.entries.length>0?DividerLinear("Top Cards",0):<></>}

          {Object.keys(this.props.pro.decks).length<=0?<TouchableHighlight activeOpacity={0.9} underlayColor="rgba(255,255,255,0.1)" onPress={() => {
           props.navigation.navigate("stacksDecks")
          }} style={{color:"white",margin:2,backgroundColor:"#28283C",borderRadius: 10,width:Dimensions.get('window').width,flexDirection:"row",flexGrow:1,justifyContent:"space-between"}}>
            <View style={{color:"white",width:Dimensions.get('window').width,flexDirection:"row",flexGrow:1,justifyContent:"space-between"}}>
            <View style={{flexDirection:"row"}}>
              <Icon style={{padding:20}} name="edit" size={40} color="white" />
              <View>
                <Text style={{color:"white",fontSize:20,fontWeight:"bold",padding:5}}>Build your first deck !</Text>
                <Text style={{color:"white",fontSize:16,padding:5,width:Dimensions.get('window').width/1.55}}>Build powerful decks with our deck-builder. Explore and choose the cards that interest you. Add cards to your collection.</Text>
              </View>
            </View>
            <Icon style={{textAlignVertical: 'center',padding:15}} name="chevron-right" size={20} color="white" />
            </View>
          </TouchableHighlight>:<></>}
          <View style={{flexDirection:"row",alignSelf:"center",alignContent:"center",marginVertical:50}}>

          {Object.keys(this.props.pro.topCards).slice(0, 5).map((card, itemI)=> {
          return <View style={{margin:-20,
            transform: [{ rotate: -45+(itemI*20)+"deg" }]
          }}>
          <Image style={{width:100,height:140}} source={{ uri : this.props.pro.topCards[card].image_uris.border_crop }} />
        </View>
          })
          }
          </View>

          {DividerLinear("Top decks",0)}
          {this.DeckList(props,props.pro.topDecks,tthis)}

          {/*DividerLinear("Sets",0)*/}
          
          
          {/*Object.keys(this.props.pro.decks).length>0?DividerLinear("Your decks",0):<></>*/}
          {/*Object.keys(this.props.pro.decks).length>0?
          this.DeckList(props,props.pro.decks,tthis)
          :<></>*/}


        </VStack>
      </Center>
      </Animatable.View>
      </ParallaxScroll>
      </KeyboardAvoidingView>
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
    backgroundColor:"white"
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

export default connect(mapStateToProps, mapDispatchToProps)(MyMulti);