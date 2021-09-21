import { StyleSheet, ScrollView, View, TouchableHighlight,Pressable,Dimensions ,ImageBackground,TextInput, KeyboardAvoidingView, Linking} from 'react-native';
import React, { Component } from 'react';
import {
  Text,
  VStack,
  HStack,
  Heading,
  Center,
  Badge,
  Menu,
  Divider,
  Box,
  Select,
  CheckIcon,
} from "native-base"
import {connect} from 'react-redux';
import {setPro} from '../redux/ProActions';
import {bindActionCreators} from 'redux';
import ConvertText from './services/ConvertText';
import { SvgUri } from 'react-native-svg';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import {
  BarChart,
  PieChart,
} from "react-native-chart-kit";
import LinearGradient from 'react-native-linear-gradient'
import DividerLinear from './services/DividerLinear';
import DividerLinearFullWidth from './services/DividerLinearFullWidth';
import storeData from './services/StoreData';
import * as Animatable from 'react-native-animatable';

const Tab = createMaterialTopTabNavigator();


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


 class OneMulti extends Component {
  constructor(properties) {
    super(properties);
    this.myRefs = []
    this.title1=undefined;
    this.state = {
      inputValue: '',
      list: [],
      sortedCards : {
        "Creature":{},
        "Sorcery":{},
        "Instant":{},
        "Land":{},
        "Artifact":{},
        "Enchantment":{},
      },
      courbeDeMana:{
        1:0,
        2:0,
        3:0,
        4:0,
        5:0,
        6:0,
      },
      couleurs : [
      ],
    };
    this.use = this.props.use[this.props.route.params.item]?this.props.use[this.props.route.params.item]:(this.props.use);
  }

  tcgPlayer(cardsByType){
    var query ="https://www.tcgplayer.com/massentry?productline=Magic&utm_campaign=affiliate&utm_medium=AFFILIATECODE&utm_source=AFFILIATECODE&c=";
    Object.keys(cardsByType).forEach((type)=>{
      Object.keys(cardsByType[type]).forEach(card => {
        query = query+cardsByType[type][card].nombre+" "+cardsByType[type][card].name+"||"
      });
    })
    Linking.openURL(query)
  }

  cardKingdom(cardsByType){
    var query ="https://www.cardkingdom.com/builder/mtg?maindeck=";
    Object.keys(cardsByType).forEach((type)=>{
      Object.keys(cardsByType[type]).forEach(card => {
        query = query+cardsByType[type][card].nombre+"+"+cardsByType[type][card].name.replace(' ', '+')+"%0D%0A"
      });
    })
    query = query+"&format=all"
    Linking.openURL(query)
  }
  
  componentDidMount(){
    this.props.navigation.addListener('focus', () => {
      this.sortFunction();
    });
    this.sortFunction();
    if(this.props.collections){
      this.props.pro.sortFunctionCollection = this; 
    }
    
  }

sortFunction(){
      var uncomon = 0;
      var common = 0;
      var rare = 0;
      var mythic = 0;
      var price = 0;
      var colors = []

    this.state.sortedCards = {
      "Creature":{},
      "Sorcery":{},
      "Instant":{},
      "Land":{},
      "Artifact":{},
      "Enchantment":{},
    };
    this.state.sortedCardsCount ={
      "Creature":0,
      "Sorcery":0,
      "Instant":0,
      "Land":0,
      "Artifact":0,
      "Enchantment":0,
    }
    this.state.courbeDeMana = {
      1:0,
      2:0,
      3:0,
      4:0,
      5:0,
      6:0,
    }
    this.state.couleurs = []
    var couleurs = {}
    if(this.use.cards){
      Object.keys(this.use.cards).forEach(card => {
        
        //https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000
        if(this.use.cards[card].rarity == "uncommon") uncomon++
        if(this.use.cards[card].rarity == "common") common++
        if(this.use.cards[card].rarity == "rare") rare++
        if(this.use.cards[card].rarity == "mythic") mythic++
        if(this.use.cards[card].prices.eur != null) price += parseInt(this.use.cards[card].prices.eur);
        colors = arrayUnique(colors.concat(this.use.cards[card].color_identity));


        if(this.use.cards[card] && this.use.cards[card].colors && this.use.cards[card].colors.length > 0){
          this.use.cards[card].colors.forEach(color=>{
            if(!couleurs[color]){
              couleurs[color]=1;
            }else{
              couleurs[color]=couleurs[color]+1;
            }
          })
        }
  
        if(this.use.cards[card].cmc>=6){
          this.state.courbeDeMana[6]++;
        }else{
          this.state.courbeDeMana[this.use.cards[card].cmc]++;
        }
        //CREATURE
        if(this.use.cards[card].power){
          this.state.sortedCardsCount["Creature"]+=1;
          if(this.state.sortedCards["Creature"][this.use.cards[card].oracle_id]){
            this.state.sortedCards["Creature"][this.use.cards[card].oracle_id].nombre += 1;
          }else{
            this.state.sortedCards["Creature"][this.use.cards[card].oracle_id] = this.use.cards[card];
            this.state.sortedCards["Creature"][this.use.cards[card].oracle_id].nombre = 1;
          }
        }else if(this.use.cards[card].type_line.substring(0, 7) == "Sorcery"){
          this.state.sortedCardsCount["Sorcery"]+=1;
          if(this.state.sortedCards["Sorcery"][this.use.cards[card].oracle_id]){
            this.state.sortedCards["Sorcery"][this.use.cards[card].oracle_id].nombre += 1;
          }else{
            this.state.sortedCards["Sorcery"][this.use.cards[card].oracle_id] = this.use.cards[card];
            this.state.sortedCards["Sorcery"][this.use.cards[card].oracle_id].nombre = 1;
          }
        }else if(this.use.cards[card].type_line.substring(0, 4) == "Land"){
          this.state.sortedCardsCount["Land"]+=1;
          if(this.state.sortedCards["Land"][this.use.cards[card].oracle_id]){
            this.state.sortedCards["Land"][this.use.cards[card].oracle_id].nombre += 1;
          }else{
            this.state.sortedCards["Land"][this.use.cards[card].oracle_id] = this.use.cards[card];
            this.state.sortedCards["Land"][this.use.cards[card].oracle_id].nombre = 1;
          }
        }else if(this.use.cards[card].type_line.substring(0, 8) == "Artifact"){
          this.state.sortedCardsCount["Artifact"]+=1;
          if(this.state.sortedCards["Artifact"][this.use.cards[card].oracle_id]){
            this.state.sortedCards["Artifact"][this.use.cards[card].oracle_id].nombre += 1;
          }else{
            this.state.sortedCards["Artifact"][this.use.cards[card].oracle_id] = this.use.cards[card];
            this.state.sortedCards["Artifact"][this.use.cards[card].oracle_id].nombre = 1;
          }
        }else if(this.use.cards[card].type_line.substring(0, 8) == "Instant"){
          this.state.sortedCardsCount["Instant"]+=1;
          if(this.state.sortedCards["Instant"][this.use.cards[card].oracle_id]){
            this.state.sortedCards["Instant"][this.use.cards[card].oracle_id].nombre += 1;
          }else{
            this.state.sortedCards["Instant"][this.use.cards[card].oracle_id] = this.use.cards[card];
            this.state.sortedCards["Instant"][this.use.cards[card].oracle_id].nombre = 1;
          }
        }else{
          this.state.sortedCardsCount["Enchantment"]+=1;
          if(this.state.sortedCards["Enchantment"][this.use.cards[card].oracle_id]){
            this.state.sortedCards["Enchantment"][this.use.cards[card].oracle_id].nombre += 1;
          }else{
            this.state.sortedCards["Enchantment"][this.use.cards[card].oracle_id] = this.use.cards[card];
            this.state.sortedCards["Enchantment"][this.use.cards[card].oracle_id].nombre = 1;
          }
        }
        
      });
    }
    

    this.use.uncomon = uncomon
    this.use.common = common
    this.use.rare = rare
    this.use.mythic = mythic
    this.use.price = price
    this.use.colors = colors

    Object.keys(couleurs).forEach(couleur => {
      if(couleur=="R"){
        var colorTemp = {
          name: "Red",
          population: couleurs[couleur],
          color: "#4C1610",
          legendFontColor: "rgba(255, 255, 255, 1)",
          legendFontSize: 15
        }
      }else if(couleur=="U"){
        var colorTemp = {
          name: "Blue",
          population: couleurs[couleur],
          color: "#1A263F",
          legendFontColor: "rgba(255, 255, 255, 1)",
          legendFontSize: 15
        }
      }else if(couleur=="B"){
        var colorTemp = {
          name: "Black",
          population: couleurs[couleur],
          color: "rgba(75, 75, 75, 1)",
          legendFontColor: "rgba(255, 255, 255, 1)",
          legendFontSize: 15
        }
      }else if(couleur=="W"){
        var colorTemp = {
          name: "White",
          population: couleurs[couleur],
          color: "rgba(220, 220, 220, 1)",
          legendFontColor: "rgba(255, 255, 255, 1)",
          legendFontSize: 15
        }
      }else if(couleur=="G"){
        var colorTemp = {
          name: "Green",
          population: couleurs[couleur],
          color: "#254A0A",
          legendFontColor: "rgba(255, 255, 255, 1)",
          legendFontSize: 15
        }
      }
      this.state.couleurs.push(colorTemp);
    })
    this.setState({})
    
    if(!this.props.collections)this.props.navigation.setOptions({title:'Deck : '+this.use.title});
}

handleDelete = (item) => {
  var BreakException = {};
  try {
    Object.keys(this.use.cards).forEach(card => {
      if(this.use.cards[card].oracle_id == item){
        delete this.use.cards[card];
        throw BreakException;
      }
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }
  this.sortFunction();
  storeData(this.props.pro);
  this.props.setPro({});
};

handleAdd = (item) => {
  if(item.nombre < 4){
    this.use.cards[Date.now()] = Object.assign({}, item)
    this.sortFunction();
    storeData(this.props.pro);
    this.props.setPro({});
  }
};

sideCards

addSideCard = (item) => {
  if(!this.use.sideCards) this.use.sideCards = {}
  var BreakException = {};
  try {
    Object.keys(this.use.cards).forEach(card => {
      if(this.use.cards[card].oracle_id == item){
        this.use.sideCards[item] = this.use.cards[card];
        throw BreakException;
      }
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }

  this.sortFunction();
  storeData(this.props.pro);
  this.props.setPro({});
};

subSideCard = (item) => {
  var BreakException = {};
  try {
    Object.keys(this.use.sideCards).forEach(card => {
      if(this.use.sideCards[card].oracle_id == item){
        delete this.use.sideCards[card];
        throw BreakException;
      }
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }
  this.sortFunction();
  storeData(this.props.pro);
  this.props.setPro({});
};

addKeyCard = (item) => {
  var BreakException = {};
  try {
    Object.keys(this.use.cards).forEach(card => {
      if(this.use.cards[card].oracle_id == item){
        this.use.keyCards[item] = this.use.cards[card];
        throw BreakException;
      }
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }

  this.sortFunction();
  storeData(this.props.pro);
  this.props.setPro({});
};

subKeyCard = (item) => {
  var BreakException = {};
  try {
    Object.keys(this.use.keyCards).forEach(card => {
      if(this.use.keyCards[card].oracle_id == item){
        delete this.use.keyCards[card];
        throw BreakException;
      }
    });
  } catch (e) {
    if (e !== BreakException) throw e;
  }
  this.sortFunction();
  storeData(this.props.pro);
  this.props.setPro({});
};

changeMode = (text,index) =>{
  this.props.use[index].mode = text;
  storeData(this.props.pro);
  this.setState({})
  this.props.setPro({});
}

endEditDescription = () => {
  this.sortFunction();
  storeData(this.props.pro);
  this.props.setPro({});
}

setDescription = (text,item) => {
  this.props.use[item].description = text;
  this.setState({})
}


SetCard = (item, itemI,type,side = false) => {
  if(side == false){var deck = this.state.sortedCards[type];}else{var deck = this.use.sideCards;}
  this.keyglobal++
  return <Animatable.View delay={100*this.keyglobal} animation="fadeIn" key={this.keyglobal}>
    {itemI==0?<></>:DividerLinearFullWidth()}
    <HStack
  w="100%"
  justifyContent="space-between"
  alignItems="center"
  key={(deck[item].printed_name && deck[item].printed_name != "" ? deck[item].printed_name : deck[item].name) + itemI.toString()}
>
<LinearGradient
    colors={[deck[item].legalities[this.use.mode]=="not_legal"?'rgba(70, 10, 10, 0.5)':'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)']}
    style={{
      width:Dimensions.get('window').width,
    }}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
  >
  <TouchableHighlight
  activeOpacity={0.9}
  underlayColor="rgba(255,255,255,0.1)"
  style={{width:'97%',margin:2,padding:-10,flexDirection:"row"}}
    colorScheme="yellow"
    onPress={() => this.props.navigation.navigate('OneCard', {item: deck[item],})}
  >
    <View style={{flexDirection:"row",width:'97%',}}>
  {this.props.pro.set[deck[item].set].icon && this.props.pro.set[deck[item].set].icon != null && this.props.pro.set[deck[item].set].icon !="afc" && this.props.pro.set[deck[item].set].icon!="gk2"?
  <SvgUri
  style={styles.innerCircle}
    fill={deck[item].rarity == "uncommon"?"silver":(deck[item].rarity == "rare"?"gold":(deck[item].rarity == "common"?"darkgrey":("orange")))}
    strokeWidth={2}
    strokeOpacity={1}
    strokeLinecap="butt"
    stroke={deck[item].rarity == "uncommon"?"silver":(deck[item].rarity == "rare"?"gold":(deck[item].rarity == "common"?"darkgrey":("orange")))}
    color={"black"}
    fillOpacity={1}
    width="25"
    height="25"
    uri={this.props.pro.set[deck[item].set].icon}
    />:<></>}
    <View style={{flexDirection:"row",paddingTop:10,justifyContent:"space-between",flexGrow: 1,}}>
      <View style={{flexDirection:"row"}}>
        <Text style={{paddingLeft:10,marginTop:0,height:20}}>{ConvertText(deck[item].mana_cost,deck[item].lang)}</Text>
        <View style={{flexDirection:"column",overflow:"hidden",maxWidth:(Dimensions.get('window').width/1.8)}}>
          <Text color="yellow.400" mx={2} style={{fontWeight:"bold",textShadowColor: deck[item].rarity != "common"?'rgba(255, 255, 255, 0.6)':'rgba(255, 255, 255, 0)',textShadowOffset: {width: deck[item].rarity != "common"?1:0, height: deck[item].rarity != "common"?1:0},textShadowRadius: 5,fontSize:14,color:deck[item].rarity == "uncommon"?"silver":(deck[item].rarity == "rare"?"gold":(deck[item].rarity == "common"?"grey":("orange")))}} >
            {deck[item].printed_name && deck[item].printed_name != "" ? deck[item].printed_name : deck[item].name}
          </Text>
          {deck[item].legalities[this.use.mode]=="not_legal"?<Text color="red.400" mx={2} style={{fontWeight:"bold",marginTop:-4,fontSize:12}}>Not valid in {this.use.mode}</Text>:<></>}
        </View>
      </View>
      <View style={{flexDirection:"row"}}>
        {deck[item].nombre > 1 ? <Text style={{paddingLeft:10,marginTop:0,height:25,fontSize:15,color:"grey"}}>X {(deck[item].nombre)}</Text> : <></>}
        
        {this.props.cantUpdate==true?<></>:<Animatable.View  animation="rubberBand" delay={1000+this.keyglobal*100}><Menu style={{right:0}}
          trigger={(triggerProps) => {
            return (
              <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                <Icon name="bars" size={20} color="white" style={{paddingHorizontal:10,paddingVertical:2}}/>
              </Pressable>
            )
          }}
        >
        {(side == false)?<><Menu.Group title="Deck">
          <Menu.Item onPress={() => {this.handleDelete(item)}} style={{flexDirection:"row"}}><Icon name="trash" size={20} color="black" />    {deck[item].nombre>1?"sub":"Delete"}</Menu.Item>
          <Menu.Item onPress={() => {this.handleAdd(deck[item])}} style={{flexDirection:"row"}}><Icon name="plus-square" size={20} color="black" />    Add</Menu.Item>
        </Menu.Group>
        <Menu.Group title="Key Cards">
          <Menu.Item onPress={() => {this.addKeyCard(item)}} style={{flexDirection:"row"}}><Icon name="key" size={20} color="black" />  Add to Key Cards</Menu.Item>
        </Menu.Group>
        <Menu.Group title="SideCard">
          <Menu.Item onPress={() => {this.addSideCard(item)}} style={{flexDirection:"row"}}><Icon name="arrows-alt" size={20} color="black" />  Add to SideCard</Menu.Item>
        </Menu.Group></>:<Menu.Item onPress={() => {this.subSideCard(item)}} style={{flexDirection:"row"}}><Icon name="trash" size={20} color="black" />    delete</Menu.Item>}
      </Menu>
      </Animatable.View>}
    </View>
    </View>
    </View>
  </TouchableHighlight>

    </LinearGradient>
</HStack>
</Animatable.View>
}

  render() {
  this.keyglobal = 0;
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
    
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
    <ImageBackground  blurRadius={1} style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height/2,marginTop:Dimensions.get('window').height/3,resizeMode: 'cover',position:"absolute"}} source={backgroundImg} alt="image base" resizeMode="cover" roundedTop="md" imageStyle= {{opacity:0.1}} />
  <ScrollView style={{marginBottom:80}}
  stickyHeaderIndices={[2,4,6,8,10,12,14,17,19,21,23]}>
    <ImageBackground  blurRadius={8} style={{width:Dimensions.get('window').width*1.5,height:130,resizeMode: 'cover'}} source={{uri: this.use.cards && Object.keys(this.use.cards).length>0 && this.use.cards[Object.keys(this.use.cards)[0]].image_uris && this.use.cards[Object.keys(this.use.cards)[0]].image_uris.art_crop?this.use.cards[Object.keys(this.use.cards)[0]].image_uris.art_crop:"https://media.wizards.com/2017/images/daily/41mztsnrdm.jpg"}} alt="image base" resizeMode="cover" roundedTop="md" >
    <ImageBackground  style={{width:Dimensions.get('window').width/2.5,height:110,resizeMode: 'contain',paddingTop:25,top:10,left:10}} source={{uri: this.use.cards && Object.keys(this.use.cards).length>0 && this.use.cards[Object.keys(this.use.cards)[0]].image_uris && this.use.cards[Object.keys(this.use.cards)[0]].image_uris.art_crop?this.use.cards[Object.keys(this.use.cards)[0]].image_uris.art_crop:"https://media.wizards.com/2017/images/daily/41mztsnrdm.jpg"}} alt="image base" resizeMode="cover" roundedTop="md" />
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
            this.changeMode(itemValue,this.props.route.params.item)
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
        <Text style={{color:"white",fontSize:20,fontWeight:"bold",padding:5,textShadowColor: '#000', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 2,right:-20}}>{Object.keys(this.use.cards).length} Cards</Text>
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
      <View>
      {(!this.props.cantUpdate&&Object.keys(this.use.cards).length<=0)||this.props.collections?
          <TouchableHighlight
          activeOpacity={0.9}
          underlayColor="rgba(255,255,255,0.1)" onPress={() => this.props.navigation.navigate('addCardByText', {collection:this.props.collections,item: this.props.route.params.item,type:this.props.oneNavigateType,functionReload:()=>this.sortFunction()})} style={{color:"white",margin:2,backgroundColor:"#28283C",borderRadius: 10,width:Dimensions.get('window').width,flexDirection:"row",flexGrow:1,justifyContent:"space-between"}}>
            <View style={{color:"white",width:Dimensions.get('window').width,flexDirection:"row",flexGrow:1,justifyContent:"space-between"}}>
            <View style={{flexDirection:"row"}}>
              <Icon style={{padding:20}} name="search" size={40} color="white" />
              <View>
                <Text style={{color:"white",fontSize:20,fontWeight:"bold",padding:5}}>Looking for a card ?</Text>
                <Text style={{color:"white",fontSize:16,padding:5,width:Dimensions.get('window').width/1.55}}>Use quick search to find and add cards into {this.props.collections?"collection":'deck : '+this.use.title}.</Text>
              </View>
            </View>
            <Icon style={{textAlignVertical: 'center',padding:15}} name="chevron-right" size={20} color="white" />
            </View>
          </TouchableHighlight>:<></>}
        </View>

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{Object.keys(this.state.sortedCards["Creature"]).length <= 0 ?<></>:<Animatable.View  animation="slideInLeft" style={{flexDirection:"row"}}><View style={{flexDirection:"row"}}><Heading color="yellow.100" style={{fontSize:24,top:6}}>CREATURES</Heading><Text style={{margin:10,fontSize:22,color:"white",fontWeight:"bold",bottom:3}}>[ {this.state.sortedCardsCount["Creature"]} ]</Text></View></Animatable.View>}</LinearGradient>

          <View>{Object.keys(this.state.sortedCards["Creature"]).length > 0 ?
          <VStack>
            {Object.keys(this.state.sortedCards["Creature"]).map((item, itemI) => (this.SetCard(item, itemI,"Creature")))}
        </VStack>:<></>}</View>

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{Object.keys(this.state.sortedCards["Sorcery"]).length <= 0 ?<></>:<Animatable.View  animation="slideInLeft" style={{flexDirection:"row"}}><View style={{flexDirection:"row"}}><Heading color="yellow.100" style={{fontSize:24,top:6}}>SORCERIES</Heading><Text style={{padding:10,fontSize:22,color:"white",fontWeight:"bold",bottom:3}}>[ {this.state.sortedCardsCount["Sorcery"]} ]</Text></View></Animatable.View>}</LinearGradient>

        <View>{Object.keys(this.state.sortedCards["Sorcery"]).length > 0 ?
          <VStack>
            {Object.keys(this.state.sortedCards["Sorcery"]).map((item, itemI) => (this.SetCard(item, itemI,"Sorcery")))}
        </VStack>:<></>}</View>

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{Object.keys(this.state.sortedCards["Instant"]).length <= 0 ?<></>:<Animatable.View  animation="slideInLeft" style={{flexDirection:"row"}}><View style={{flexDirection:"row"}}><Heading color="yellow.100" style={{fontSize:24,top:6}}>INSTANTS</Heading><Text style={{padding:10,fontSize:22,color:"white",fontWeight:"bold",bottom:3}}>[ {this.state.sortedCardsCount["Instant"]} ]</Text></View></Animatable.View>}</LinearGradient>

        <View>{Object.keys(this.state.sortedCards["Instant"]).length > 0 ?
          <VStack>
            {Object.keys(this.state.sortedCards["Instant"]).map((item, itemI) => (this.SetCard(item, itemI,"Instant")))}
        </VStack>:<></>}</View>

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{Object.keys(this.state.sortedCards["Artifact"]).length <= 0 ?<></>:<Animatable.View  animation="slideInLeft" style={{flexDirection:"row"}}><View style={{flexDirection:"row"}}><Heading color="yellow.100" style={{fontSize:24,top:6}}>ARTIFACTS</Heading><Text style={{padding:10,fontSize:22,color:"white",fontWeight:"bold",bottom:3}}>[ {this.state.sortedCardsCount["Artifact"]} ]</Text></View></Animatable.View>}</LinearGradient>

        <View>{Object.keys(this.state.sortedCards["Artifact"]).length > 0 ?
          <VStack>
            {Object.keys(this.state.sortedCards["Artifact"]).map((item, itemI) => (this.SetCard(item, itemI,"Artifact")))}
        </VStack>:<></>}</View>

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{Object.keys(this.state.sortedCards["Enchantment"]).length <= 0 ?<></>:<Animatable.View  animation="slideInLeft" style={{flexDirection:"row"}}><View style={{flexDirection:"row"}}><Heading color="yellow.100" style={{fontSize:24,top:6}}>ENCHANTMENTS</Heading><Text style={{padding:10,fontSize:22,color:"white",fontWeight:"bold",bottom:3}}>[ {this.state.sortedCardsCount["Enchantment"]} ]</Text></View></Animatable.View>}</LinearGradient>

        <View>{Object.keys(this.state.sortedCards["Enchantment"]).length > 0 ?
          <VStack>
            {Object.keys(this.state.sortedCards["Enchantment"]).map((item, itemI) => (this.SetCard(item, itemI,"Enchantment")))}
        </VStack>:<></>}</View>

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{Object.keys(this.state.sortedCards["Land"]).length <= 0 ?<></>:<Animatable.View  animation="slideInLeft" style={{flexDirection:"row"}}><View style={{flexDirection:"row"}}><Heading color="yellow.100" style={{fontSize:24,top:6}}>LANDS</Heading><Text style={{padding:10,fontSize:22,color:"white",fontWeight:"bold",bottom:3}}>[ {this.state.sortedCardsCount["Land"]} ]</Text></View></Animatable.View>}</LinearGradient>

        <View>{Object.keys(this.state.sortedCards["Land"]).length > 0 ?
          <VStack>
            {Object.keys(this.state.sortedCards["Land"]).map((item, itemI) => (this.SetCard(item, itemI,"Land")))}
        </VStack>:<></>}</View>
        
        <View></View>
        <View>
      {(!this.props.cantUpdate&&Object.keys(this.use.cards).length>0)&&!this.props.collections?
          <TouchableHighlight
          activeOpacity={0.9}
          underlayColor="rgba(255,255,255,0.1)" onPress={() => this.props.navigation.navigate('addCardByText', {collection:this.props.collections,item: this.props.route.params.item,type:this.props.oneNavigateType,functionReload:()=>this.sortFunction()})} style={{color:"white",margin:2,backgroundColor:"#28283C",borderRadius: 10,width:Dimensions.get('window').width,flexDirection:"row",flexGrow:1,justifyContent:"space-between",marginTop:50}}>
            <View style={{color:"white",margin:2,backgroundColor:"#28283C",borderRadius: 10,width:Dimensions.get('window').width,flexDirection:"row",flexGrow:1,justifyContent:"space-between",}}>
            <View style={{flexDirection:"row"}}>
              <Icon style={{padding:20}} name="search" size={40} color="white" />
              <View>
                <Text style={{color:"white",fontSize:20,fontWeight:"bold",padding:5}}>Looking for a card ?</Text>
                <Text style={{color:"white",fontSize:16,padding:5,width:Dimensions.get('window').width/1.55}}>Use quick search to find and add cards into {this.props.collections?"collection":'deck : '+this.use.title}.</Text>
              </View>
            </View>
            <Icon style={{textAlignVertical: 'center',padding:15}} name="chevron-right" size={20} color="white" />
            </View>
          </TouchableHighlight>:<></>}
        </View>

        <View style={{flexDirection:"row",textAlign:"center",alignItems:"center",flexGrow:1,justifyContent:"space-between",paddingHorizontal:50,paddingBottom:50}}>
          <View style={{flexDirection:"row",textAlign:"center",alignItems:"center",flexGrow:1,justifyContent:"space-between",width:Dimensions.get("window").width/1.5}}>

            {Object.keys(this.use.cards).length>0 ? <Animatable.View  animation="rubberBand" delay={2500}><Text onPress={()=>{this.tcgPlayer(this.state.sortedCards)}} style={{color:"gold",paddingTop:50,textDecorationLine: 'underline'}}>TCG Player</Text></Animatable.View>:<></>}
            
            {Object.keys(this.use.cards).length>0 ? <Animatable.View  animation="rubberBand" delay={2500}><Text onPress={()=>{this.cardKingdom(this.state.sortedCards)}} style={{color:"gold",paddingTop:50,textDecorationLine: 'underline'}}>Card Kingdom</Text></Animatable.View>:<></>}
          </View>
        </View>
        
        
        

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{this.props.collections?<></>:DividerLinear("Description",0)}</LinearGradient>
        <View>{this.props.collections?<></>:<>
          <TextInput onEndEditing={()=>this.endEditDescription()} editable={this.props.cantUpdate==true?false:true} multiline value={this.use.description} style={{color:"white",width:Dimensions.get("window").width-15,padding:20,borderColor:"grey",borderWidth:0.5,borderRadius:5,margin:15}} onChangeText={text => this.setDescription(text,this.props.route.params.item)} placeholderTextColor="#fff"  placeholder="Write description deck here" /></>}</View>
          <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{DividerLinear("Mana Curve",0)}</LinearGradient>
        <BarChart
          style={{
            marginVertical: 8,
            borderRadius: 0,
            color:"white"
          }}
          data={{
            labels: ["1 Mana", "2 Mana", "3 Mana", "4 Mana", "5 Mana", "6+"],
            datasets: [
              {
                data: [
                  this.state.courbeDeMana[1],
                  this.state.courbeDeMana[2],
                  this.state.courbeDeMana[3],
                  this.state.courbeDeMana[4],
                  this.state.courbeDeMana[5],
                  this.state.courbeDeMana[6],
                ]
              }
            ]
          }}
          width={Dimensions.get("window").width}
          height={250}
          yAxisLabel="Nbr : "
          chartConfig={{
            barColors: ["#fff", "#fff", "#fff","#fff", "#fff", "#fff"],
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "#fff",
            backgroundGradientToOpacity: 0,
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, 1)`,
            strokeWidth: 20,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "20",
              stroke: "#ffa726"
            }
          }}
          verticalLabelRotation={30}
        />

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{!this.use.keyCards||this.props.collections?<></>:this.use.keyCards&&Object.keys(this.use.keyCards).length>0?DividerLinear("Key Cards",0):<></>}</LinearGradient>

        <View>{!this.use.keyCards||this.props.collections?<></>:
        <>
          <View 
            style={{
            justifyContent: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            flex: 1}}>
        {Object.keys(this.use.keyCards).map((item, itemI) => (//KEY CARDS
          <TouchableHighlight
          activeOpacity={0.9}
          underlayColor="rgba(255,255,255,0.1)" onPress={() => {
            this.props.navigation.navigate('OneCard', {item: this.use.keyCards[item],})}}
             key={this.use.keyCards[item].title + itemI.toString()} >
               <View>
      <Box style={{margin:5}} bg="white" shadow={5} rounded="lg" width={Dimensions.get('window').width/2.2} height={150}>

      <ImageBackground style={{width:Dimensions.get('window').width/2.2,height:150,resizeMode: 'contain',}} source={{uri: this.use.keyCards[item].image_uris && this.use.keyCards[item].image_uris.art_crop?this.use.keyCards[item].image_uris.art_crop:"https://media.wizards.com/2017/images/daily/41mztsnrdm.jpg"}} alt="image base" resizeMode="cover" roundedTop="md" >
      {this.props.cantUpdate==true?<></>:<Menu
      trigger={(triggerProps) => {
        return (
          <Pressable accessibilityLabel="More options menu" {...triggerProps}>
            <Icon style={{margin:5}} name="bars" size={25} color="white" />
          </Pressable>
        )
      }}
      >
      <Menu.Item onPress={() => {this.subKeyCard(item)}} style={{flexDirection:"row"}}><Icon name="key" size={20} color="black" />  Delete Key Cards</Menu.Item>
    </Menu>}

      </ImageBackground>
      
      
      </Box>
      </View>
      </TouchableHighlight>
      ))}
      </View>
      </>}</View>


      <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{!this.use.sideCards||this.props.collections?<></>:this.use.sideCards&&Object.keys(this.use.sideCards).length>0?DividerLinear("Side Cards",0):<></>}</LinearGradient>

        <View>{!this.use.sideCards||this.props.collections?<></>:
        <>
          <View 
            style={{
            justifyContent: 'center',
            flexDirection: 'row',
            flexWrap: 'wrap',
            flex: 1}}>
        {Object.keys(this.use.sideCards).map((item, itemI) => (//KEY CARDS
          this.SetCard(item, itemI,"Sorcery",true)
      ))}
      </View>
      </>}</View>


      <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} style={{marginTop:10}}>{Object.keys(this.state.couleurs).length<=0?<></>:DividerLinear("Colours",0)}</LinearGradient>
      <View>{Object.keys(this.state.couleurs).length<=0?<></>:<PieChart
        style={{marginBottom:50,paddingBottom:50}}
          data={this.state.couleurs}
          width={Dimensions.get('window').width}
          height={150}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          }}
          accessor={"population"}
          backgroundColor={"transparent"}
          paddingLeft={"15"}
          absolute
        />}</View>
        
      </ScrollView>
      </KeyboardAvoidingView>
      </LinearGradient>
  );
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