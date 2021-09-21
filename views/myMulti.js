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
import {setPro} from '../redux/ProActions';
import {bindActionCreators} from 'redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { SvgUri } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient'
import * as Animatable from 'react-native-animatable';

import storeData from './services/StoreData';
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import Ripple from 'react-native-advanced-ripple'

import Toast, {DURATION} from 'react-native-easy-toast'

backgroundImg = require("./img/backgroundMagicFrench.jpeg");
const ArrayColors={
  "U" : require('./img/U.png'),
  "B" : require('./img/B.png'),
  "W" : require('./img/W.png'),
  "G" : require('./img/G.png'),
  "R" : require('./img/R.png')
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
    };
  }

  componentDidMount(){
    //if(this.props.oneNavigate == 'OneTopDeck') this.props.pro.allNavigation["topDeck"] = this.props.navigation;
    this.props.navigation.addListener('focus', () => {
      this.props.setPro({});
    });
    if(this.props.player) this.props.navigation.setOptions({title:'Decks Of : '+this.props.player});
  }

  
  
  addItem = (title) => {
    var dateNow = Date.now();
    //this.props.route.params.item
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

  duplicateWishlist = (index,deckLoop) => {
    Alert.alert(
      "WARNING",
      "Are you sure to add this deck at yours whishlist ?",
      [
        { text: "Add", onPress: () => {
            this.toast.show('Deck duplicated to wishlist', 2000);
            this.props.pro.wishlists[index] = deckLoop[index];
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

  duplicate = (index,deckLoop) => {
    Alert.alert(
      "WARNING",
      "Are you sure to add this deck at yours decks ?",
      [
        { text: "Add", onPress: () => {
            this.toast.show('Deck duplicated to your decks', 2000);
            
            this.props.pro.decks[index] = deckLoop[index];
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
    var deckLoop = Object.keys(this.state.topDecksResult).length>0?this.state.topDecksResult:this.props.use;
    Object.keys(deckLoop).forEach((deck, itemI)=> {
      var uncomon = 0;
      var common = 0;
      var rare = 0;
      var mythic = 0;
      var price = 0;
      var colors = []
      Object.keys(deckLoop[deck].cards).forEach((card, itemI)=> {
        //https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000
        if(deckLoop[deck].cards[card].rarity == "uncommon") uncomon++
        if(deckLoop[deck].cards[card].rarity == "common") common++
        if(deckLoop[deck].cards[card].rarity == "rare") rare++
        if(deckLoop[deck].cards[card].rarity == "mythic") mythic++
        if(deckLoop[deck].cards[card].prices.eur != null) price += parseInt(deckLoop[deck].cards[card].prices.eur);
        colors = arrayUnique(colors.concat(deckLoop[deck].cards[card].color_identity));
      })
      deckLoop[deck].uncomon = uncomon
      deckLoop[deck].common = common
      deckLoop[deck].rare = rare
      deckLoop[deck].mythic = mythic
      deckLoop[deck].price = price
      deckLoop[deck].colors = colors
    })
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

  navigateToDeck = (props,item) => {
    props.navigation.navigate(props.oneNavigate, {item: (Object.keys(this.state.topDecksResult).length>0)?this.state.topDecksResult[item]:(props.player?props.use[item]:item),route:props.route,cantUpdate:props.cantUpdate,player:props.player?props.player:undefined,decks:Object.keys(this.state.topDecksResult).length>0?this.state.topDecksResult[item]:this.props.pro.topDecks})
  }

  searchTopDeck = () => {
    if(this.props.oneNavigate == 'OneTopDeck'){
      fetch('http://'+this.props.pro.url+'/searchDeck', {
      method: 'POST',
      credentials: 'same-origin',
      mode: 'same-origin',
      body: JSON.stringify({"name":this.state.searchDeck,"orderBy":this.state.orderBy,"pagination":this.state.pagination,"mode":this.state.mode,"colors":this.state.colors}),
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json'
      }
      }).then((response) => {return response.json();}) 
      .then((datas) => {//console.log(datas)
        if(Object.keys(datas).length <= 0){this.state.notFound = true;}else{this.state.notFound = false;}
        Object.keys(datas).forEach(data => {
          this.state.topDecksResult[data] = datas[data];
        });
        this.setState({})
      })
      .catch((error) => {
        console.error('net error',error);
      });
    }
  }


  addIndexToScroll = () => {
    this.setState({pagination:this.state.pagination+6},()=>{this.searchTopDeck()})
  }

  filterRender = (props,tthis) => {
    return <Animatable.View animation="bounceIn" style={{marginTop:-25}}>{(props.oneNavigate == 'OneTopDeck')?(this.state.filterActive==false?<Animatable.View animation="bounceIn" style={{backgroundColor:"#28283C",borderRadius: 10,margin:2}}>
      <TouchableOpacity onPress={()=>{this.setState({filterActive:!this.state.filterActive})}} style={{flexDirection:"row",flexGrow:1,justifyContent:"space-between",paddingBottom:50}}>
      <View>
        <Text style={{color:"white",fontSize:24,marginLeft:10,marginTop:10,fontWeight:"bold"}}>Filter</Text>
        <Text style={{color:"white",fontSize:18,marginLeft:10,marginTop:10,fontWeight:"bold",width:Dimensions.get('window').width-80}}>use filtering to order and find decks by name, size or colour</Text>
      </View>
      <Icon onPress={()=>{this.setState({filterActive:!this.state.filterActive})}} style={{margin:20,marginBottom:10}} name="sort-up" size={30} color="white" /></TouchableOpacity>
      <Animatable.View animation="bounceIn" style={{flexDirection:"row",flexGrow:1,justifyContent:"space-between",marginHorizontal:10,marginTop:-20,height:50}}>
        <Select
        style={{backgroundColor:"rgba(0,0,0,0.5)",width:Dimensions.get('window').width/2.2,fontSize:15,color:"white"}}
          selectedValue={tthis.state.orderBy}
          minWidth={Dimensions.get('window').width/2.2}
          minheight={50}
          height={50}
          accessibilityLabel=""
        placeholder=""
        _selectedItem={{
          bg: "teal.600",
          endIcon: <CheckIcon style={{color:"white"}} size={10} />,
        }}
        onValueChange={(itemValue) => {
          tthis.state.topDecksResult = {}
          tthis.state.pagination = 0
          tthis.state.orderBy = itemValue
            tthis.searchTopDeck()
        }}
      >
        <Select.Item label="By name (A-Z)" value="name" />
        <Select.Item label="Best vote" value="v" />
        <Select.Item label="Best rarity" value="r" />
      </Select>
      <Input
      shadow={9}
      color="gold"
      textColor="gold"
      style={{width:Dimensions.get('window').width/2.2,fontSize:18,color:"white",top:0,margin:0,borderWidth:1,borderColor:"white"}}
      onEndEditing={()=>{
        tthis.state.topDecksResult = {}
        tthis.state.pagination = 0
        tthis.searchTopDeck()
      }}
      onChangeText={(text)=>{tthis.setState({searchDeck:text})}}
      defaultValue={this.state.searchDeck}
      variant=""
      placeholder="search By Name"
      _light={{
        placeholderTextColor: "teal.50",
      }}
      _dark={{
        placeholderTextColor: "teal.50",
      }}
    />
  </Animatable.View>
  
  <Animatable.View animation="bounceIn" style={{padding:8}}>
    <Select
    style={{backgroundColor:"rgba(0,0,0,0.5)",width:Dimensions.get('window').width/2.2,fontSize:15,color:"white"}}
      selectedValue={tthis.state.mode}
      minWidth={Dimensions.get('window').width/2.2}
      minheight={50}
      height={50}
      accessibilityLabel=""
    placeholder=""
    _selectedItem={{
      bg: "teal.600",
      endIcon: <CheckIcon style={{color:"white"}} size={10} />,
    }}
    onValueChange={(itemValue) => {
      tthis.state.topDecksResult = {}
      tthis.state.pagination = 0
      tthis.state.mode = itemValue
      tthis.searchTopDeck()
    }}
  >
    <Select.Item label="All Format Decks" value='' />
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
  </Select>
</Animatable.View>
<Animatable.View animation="bounceIn" style={{padding:8}}>
<Checkbox.Group
style={{padding:2}}
  onChange={(setGroupValues)=>{
    tthis.state.topDecksResult = {}
    tthis.state.pagination = 0
    tthis.state.colors = setGroupValues
    tthis.searchTopDeck()
  }}
  value={tthis.state.colors}
  accessibilityLabel="choose numbers"
>
  <View style={{flexDirection:"row",flexGrow:1,flex:1,justifyContent:"space-between",width:Dimensions.get('window').width-40}}>
    <View style={{alignContent:"flex-start",alignItems:"flex-start",alignSelf:"flex-start"}}>
      <Checkbox value="W" accessibilityLabel="White" colorScheme="light" style={{padding:3}} ><Text style={{color:"white",fontSize:17,fontWeight:"bold"}}> White</Text></Checkbox>
      <Checkbox value="U" accessibilityLabel="Blue" colorScheme="primary" style={{padding:3}} ><Text style={{color:"white",fontSize:17,fontWeight:"bold"}}> Blue</Text></Checkbox>
    </View>
    <View style={{alignContent:"flex-start",alignItems:"flex-start",alignSelf:"flex-start"}}>
      <Checkbox value="G" accessibilityLabel="Green" colorScheme="emerald" style={{padding:3}} ><Text style={{color:"white",fontSize:17,fontWeight:"bold"}}> Green</Text></Checkbox>
      <Checkbox value="B" accessibilityLabel="Black" colorScheme="purple" style={{padding:3}} ><Text style={{color:"white",fontSize:17,fontWeight:"bold"}}> Black</Text></Checkbox>
    </View>
    <Checkbox value="R" accessibilityLabel="Red" colorScheme="red" style={{alignContent:"flex-start",alignItems:"flex-start",alignSelf:"flex-start",padding:3}} ><Text style={{color:"white",fontSize:17,fontWeight:"bold"}}> Red</Text></Checkbox>
  </View>
</Checkbox.Group>
</Animatable.View>
</Animatable.View>:<TouchableOpacity onPress={()=>{this.setState({filterActive:!this.state.filterActive})}}><Animatable.View animation="bounceIn" style={{flexDirection:"row",flexGrow:1,justifyContent:"space-between",backgroundColor:"#28283C",borderRadius: 10,paddingBottom:15,margin:2,width:Dimensions.get('window').width}}>
  <View>
    <Text style={{color:"white",fontSize:24,marginLeft:10,marginTop:10,fontWeight:"bold"}}>Filter</Text>
    <Text style={{color:"white",fontSize:18,marginLeft:10,marginTop:10,fontWeight:"bold",width:Dimensions.get('window').width-80}}>use filtering to order and find decks by name, size or colour</Text>
  </View>
  <Icon onPress={()=>{this.setState({filterActive:!this.state.filterActive})}} style={{margin:20,marginTop:10}} name="sort-down" size={30} color="white" /></Animatable.View></TouchableOpacity>):<View></View>}</Animatable.View>
  }


  render() {
    this.dataBigCard();
    var props = this.props;
    var tthis = this;
    var keysCard = undefined;
    if(props.cantUpdate){
      if(Object.keys(this.state.topDecksResult).length>0){
        var keysCard = Object.keys(this.state.topDecksResult);
        var deckLoop = this.state.topDecksResult;
      }else{
        var deckLoop = this.props.use;
        var keysCard = Object.keys(props.use);
        keysCard = keysCard.sort(function(a, b) {return props.use[b].vote - props.use[a].vote})
      }
    }else{
      var deckLoop = this.props.use;
    }
    
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
      fadeOutParallaxBackground={false}
      fadeOutParallaxForeground={false}
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
          {this.props.cantUpdate?<></>:<Input
            maxLength={10}
            variant="filled"
            
            InputRightElement={
              <IconButton
                icon={<Icon name="plus" size={20} color="black" />}
              colorScheme="emerald"
                ml={1}
                onPress={() => {
                  this.addItem(this.state.inputValue);
                  this.setState({inputValue:""})
                }}

                mr={1}/>

            }
            onChangeText={(v) => this.setState({inputValue:v})}
            value={this.state.inputValue}
            placeholder="Add New Deck"
          />}
          
          <VStack>
      {(props.oneNavigate == 'OneTopDeck')?this.filterRender(props,tthis):<View></View>}
      {this.state.notFound==true&&Object.keys(this.state.topDecksResult).length<=0?<TouchableHighlight activeOpacity={0.9} underlayColor="rgba(255,255,255,0.1)"  style={{color:"white",margin:2,backgroundColor:"#28283C",borderRadius: 10,width:Dimensions.get('window').width,flexDirection:"row",flexGrow:1,justifyContent:"space-between"}}>
            <View style={{color:"white",width:Dimensions.get('window').width,flexDirection:"row",flexGrow:1,justifyContent:"space-between"}}>
            <View style={{flexDirection:"row"}}>
              <Icon style={{padding:20}} name="search-plus" size={40} color="white" />
              <View>
                <Text style={{color:"white",fontSize:20,fontWeight:"bold",padding:5}}>Nothing found</Text>
                <Text style={{color:"white",fontSize:16,padding:5,width:Dimensions.get('window').width/1.55}}>change your search filters to find better results.</Text>
              </View>
            </View>
            <Icon style={{textAlignVertical: 'center',padding:15}} name="filter" size={20} color="white" />
            </View>
          </TouchableHighlight>:<View></View>}
        {!this.props.cantUpdate&&Object.keys(deckLoop).length<=0?
          <TouchableHighlight activeOpacity={0.9} underlayColor="rgba(255,255,255,0.1)" onPress={() => {
            this.addItem(this.state.inputValue);
            this.setState({inputValue:""})
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
          <View 
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
              flex: 1}}>
            {
            (keysCard?keysCard:Object.keys(deckLoop)).map(function(item, itemI) {
              var cardsTemp = {}
              var BreakException = {};
              try {
                Object.keys(deckLoop[item].cards).forEach((card,key) => {
                  if(deckLoop[item].cards[card]){
                    cardsTemp[deckLoop[item].cards[card].name] = deckLoop[item].cards[card]
                    if(Object.keys(cardsTemp).length >1)
                    throw BreakException;
                  }
                });
              } catch (e) {
                if (e !== BreakException) throw e;
              }
              if((tthis.props.oneNavigate != 'OneTopDeck'||itemI<tthis.state.pagination+6)&&(tthis.state.notFound==false||Object.keys(tthis.state.topDecksResult).length>0))
              return <Animatable.View animation="fadeIn" style={{margin:5,paddingBottom:30}}>
              <TouchableHighlight cancelTolerance={100} useForeground={true} style={{borderRadius: 5,zIndex:-999,backgroundColor:"rgba(25,25,25,1)"}}  rippleColor="rgba(255,255,255,0.5)" activeOpacity={0.5} underlayColor="rgba(255,255,255,0.5)" onPress={() => {tthis.navigateToDeck(props,item)}}
                 key={deckLoop[item].title + itemI.toString()} >
                   <View>
          <Box style={{borderColor:"black",borderWidth:0.5}} shadow={5} rounded="lg" width={Dimensions.get('window').width/2.2} height={350}>
          <Ripple cancelTolerance={100} color='rgb(255, 255, 255)' onPress={()=>{tthis.navigateToDeck(props,item)}}><ImageBackground style={{width:Dimensions.get('window').width/2.2,height:150,resizeMode: 'contain',}} source={{uri: deckLoop[item].image&&deckLoop[item].image.image_uris&&deckLoop[item].image.image_uris.art_crop?deckLoop[item].image.image_uris.art_crop:(cardsTemp[Object.keys(cardsTemp)[0]]&&cardsTemp[Object.keys(cardsTemp)[0]].image_uris&&cardsTemp[Object.keys(cardsTemp)[0]].image_uris.art_crop?cardsTemp[Object.keys(cardsTemp)[0]].image_uris.art_crop:(cardsTemp[Object.keys(cardsTemp)[0]]&&cardsTemp[Object.keys(cardsTemp)[0]].image_uris&&cardsTemp[Object.keys(cardsTemp)[0]].image_uris.art_crop?cardsTemp[Object.keys(cardsTemp)[0]].image_uris.art_crop:"https://media.wizards.com/2017/images/daily/41mztsnrdm.jpg"))}} alt="image base" resizeMode="cover" roundedTop="md" >
          
            
          </ImageBackground>
          </Ripple>
          <View style={{width:Dimensions.get('window').width/3,position:"absolute",right:0}}>
          {props.cantUpdate!=true?<Select
            isDisabled={props.cantUpdate==true?true:false}
            style={{backgroundColor:"rgba(0,0,0,0.5)",width:50,fontSize:10,color:"white"}}
              selectedValue={deckLoop[item].mode}
              minWidth={50}
              minheight={10}
              height={10}
              accessibilityLabel="Mode"
              placeholder="Mode"
              onValueChange={(itemValue) => {
                tthis.changeMode(itemValue,item)
              }}
              _selectedItem={{
                bg: "teal.600",
                endIcon: <CheckIcon size={10} />,
              }}
              mt={1}
            >
              <View>{tthis.linkFormat(deckLoop[item].mode)}</View>
              
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
            </Select>:<Text style={{right:0,position:"absolute",backgroundColor:"rgba(0,0,0,0.5)",fontSize:20,color:"white",fontWeight:"bold",padding:5,}}>{deckLoop[item].mode?deckLoop[item].mode.charAt(0).toUpperCase() + deckLoop[item].mode.slice(1):''}</Text>}
            </View>
          
          {props.cantUpdate?<Text style={{fontSize:25,fontWeight:"bold",color:"white",top:0,marginLeft:5}}>{deckLoop[item].title}</Text>:<Input
            maxLength={10}
            shadow={9}
            color="gold"
            textColor="gold"
            style={{fontSize:25,fontWeight:"bold",color:"white",top:0,margin:-10}}
            onEndEditing={()=>{tthis.endEditingTitle(item)}}
            onChangeText={(text)=>{tthis.changeName(text,item)}}
            defaultValue={deckLoop[item].title}
            variant="Click here"
            placeholder="Click here"
            _light={{
              placeholderTextColor: "yellow.400",
            }}
            _dark={{
              placeholderTextColor: "yellow.50",
            }}
          />}
          <Ripple cancelTolerance={100} color='rgb(255, 255, 255)' onPress={()=>{tthis.navigateToDeck(props,item)}}>
            <Stack space={0} p={[1, 1, 1]}>
              <Heading size={["md", "lg", "md"]} noOfLines={2}>
                {deckLoop[item]&&deckLoop[item].colors?deckLoop[item].colors.map((color, keyColor) =>{return <View key={color+keyColor} style={{position:"absolute",right:0,paddingLeft:5,paddingRight:5}}>
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
              <Text style={{marginTop:2,fontWeight:"bold",fontSize:16,color:"white"}}>{deckLoop[item].common}</Text>
              <SvgUri
                style={styles.innerCircle} fill={"#83AFC2"} stroke={"#83AFC2"}
                strokeWidth={2} strokeOpacity={1} strokeLinecap="butt" color={"white"} fillOpacity={1} width="18" height="20"
                uri="https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"
              />
              <Text style={{marginTop:2,fontWeight:"bold",fontSize:16,color:"white"}}>{deckLoop[item].uncomon}</Text>
              <SvgUri
                style={styles.innerCircle} fill={"#CFA20B"} stroke={"#CFA20B"}
                strokeWidth={2} strokeOpacity={1} strokeLinecap="butt" color={"white"} fillOpacity={1} width="18" height="20"
                uri="https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"
              />
              <Text style={{marginTop:2,fontWeight:"bold",fontSize:16,color:"white"}}>{deckLoop[item].rare}</Text>
              <SvgUri
                style={styles.innerCircle} fill={"#D15410"} stroke={"#D15410"}
                strokeWidth={2} strokeOpacity={1} strokeLinecap="butt" color={"white"} fillOpacity={1} width="18" height="20"
                uri="https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"
              />
              <Text style={{marginTop:2,fontWeight:"bold",fontSize:16,color:"white"}}>{deckLoop[item].mythic}</Text>
            </View>
          </Ripple>
          
          
          {/*deckLoop[item].price!=0?<Text style={{marginTop:2,fontWeight:"bold",fontSize:18,position:"absolute",left:5,bottom:5,color:"white"}}>{deckLoop[item].price} eur</Text>:<></>*/}
          
          {props.cantUpdate?<></>:<View style={{position:"absolute",bottom:0,right:0,zIndex:999}}>
            <IconButton
            colorScheme="emerald"
            icon={<Icon name="trash" size={20} color="white" />}
            onPress={() => tthis.handleDelete(item)}
          /></View>}
            {!props.cantUpdate?<></>:<View style={{flexDirection:"row",position:"absolute",bottom:0,flexGrow:1}}>
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
                  <Menu.Item onPress={() => {tthis.duplicate(item,deckLoop)}} style={{flexDirection:"row"}}><Icon name="copy" size={20} color="black" />  Duplicate to my decks</Menu.Item>
                  <Menu.Item onPress={() => {tthis.duplicateWishlist(item,deckLoop)}} style={{flexDirection:"row"}}><Icon name="copy" size={20} color="black" />  Duplicate to my whishlists</Menu.Item>
                </Menu>
              </View>

              <Text style={{fontWeight:"bold",marginTop:8,color:"white"}}>{deckLoop[item].vote}</Text>
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
          </VStack>
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