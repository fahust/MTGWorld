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
import Toast, {DURATION} from 'react-native-easy-toast'
import {
  BarChart,
  PieChart,
} from "react-native-chart-kit";
import LinearGradient from 'react-native-linear-gradient'
import DividerLinear from './services/DividerLinear';
import DividerLinearFullWidth from './services/DividerLinearFullWidth';
import storeData from './services/StoreData';
import * as Animatable from 'react-native-animatable';



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


 class OneMultiCard extends Component {
  constructor(properties) {
    super(properties);
    this.myRefs = []
    this.title1=undefined;
    this.state = {
      inputValue: '',
      list: [],
      sortedCards : {
        "creature":{},
        "sorcery":{},
        "instant":{},
        "land":{},
        "artifact":{},
        "enchantment":{},
        "rituel":{},
        "planeswalker":{},
        "conspiracy":{},
        "phenomenon":{},
        "token":{},
        "tribal":{},
        "scheme":{},
        "vanguard":{},
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
    this.use = this.props.use[this.props.item]?this.props.use[this.props.item]:(this.props.use);
    //console.log(this.use)
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
  //if(this.props.collections)console.log(this.use);
      var uncomon = 0;
      var common = 0;
      var rare = 0;
      var mythic = 0;
      //var price = 0;

    this.state.sortedCards =  {
      "creature":{},
      "sorcery":{},
      "instant":{},
      "land":{},
      "artifact":{},
      "enchantment":{},
      "rituel":{},
      "planeswalker":{},
      "conspiracy":{},
      "phenomenon":{},
      "token":{},
      "tribal":{},
      "scheme":{},
      "vanguard":{},
    };
    this.state.sortedCardsCount = {
      "creature":0,
      "sorcery":0,
      "instant":0,
      "land":0,
      "artifact":0,
      "enchantment":0,
      "rituel":0,
      "planeswalker":0,
      "conspiracy":0,
      "phenomenon":0,
      "token":0,
      "tribal":0,
      "scheme":0,
      "vanguard":0,
    }
    if(this.use.cards){
      Object.keys(this.use.cards).forEach(card => {
        
        //https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000
        if(this.use.cards[card].rarity == "uncommon") uncomon++
        if(this.use.cards[card].rarity == "common") common++
        if(this.use.cards[card].rarity == "rare") rare++
        if(this.use.cards[card].rarity == "mythic") mythic++
        //if(this.use.cards[card].prices.eur != null) price += parseInt(this.use.cards[card].prices.eur);

        Object.keys(this.state.sortedCardsCount).forEach(element => {
          if(this.use.cards[card].type_line.toLowerCase().includes(element)){
            this.state.sortedCardsCount[element]+=1;
            if(this.state.sortedCards[element][this.use.cards[card].oracle_id]){
              this.state.sortedCards[element][this.use.cards[card].oracle_id].nombre += 1;
            }else{
              this.state.sortedCards[element][this.use.cards[card].oracle_id] = this.use.cards[card];
              this.state.sortedCards[element][this.use.cards[card].oracle_id].nombre = 1;
            }
          }
        });
        
        //CREATURE
        /*if(this.use.cards[card].power){
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
        }*/
        
      });
    }
    

    this.use.uncomon = uncomon
    this.use.common = common
    this.use.rare = rare
    this.use.mythic = mythic
    //this.use.price = price

    this.setState({})
    
    if(!this.props.collections)this.props.navigation.setOptions({title:'Deck : '+this.use.title});
}

handleDelete = (item) => {
  var BreakException = {};
  try {
    Object.keys(this.use.cards).forEach(card => {
      if(this.use.cards[card].oracle_id == item){
        this.toast.show('Card '+this.use.cards[card].name+' deleted', 2000);
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
    this.toast.show("Card "+item.name+" added", 2000);
    this.use.cards[Date.now()] = Object.assign({}, item)
    this.sortFunction();
    storeData(this.props.pro);
    this.props.setPro({});
  }
};

loved = (card) => {
  
  fetch('http://'+this.props.pro.url+'/love', {
    method: 'POST',
    credentials: 'same-origin',
    mode: 'same-origin',
    body: JSON.stringify({'card':card}),
    headers: {
      'Accept':       'application/json',
      'Content-Type': 'application/json'
    }
  }).then((response) => {return response.json();})
  .then((data) => {
    if(data=="ok"){
      this.props.pro.loved.push(card.oracle_id);
      this.toast.show("Card "+card.name+" loved", 2000);
      storeData(this.props.pro);
      this.setState({})
      //this.props.setPro({});
    }
  })
  .catch((error) => {
    this.toast.show("Connection error", 2000);
    console.error('net error',error);
  });
}

unloved = (card) => {
  fetch('http://'+this.props.pro.url+'/unlove', {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'same-origin',
        body: JSON.stringify({'card':card}),
        headers: {
          'Accept':       'application/json',
          'Content-Type': 'application/json'
        }
      }).then((response) => {return response.json();})
      .then((data) => {
        if(data=="ok"){
          if (this.props.pro.loved.indexOf(card.oracle_id) > -1) 
          this.props.pro.loved.splice(this.props.pro.loved.indexOf(card.oracle_id), 1);
          this.toast.show("Card "+card.name+" unloved", 2000);
          storeData(this.props.pro);
          this.setState({})
          //this.props.setPro({});
        }
      })
      .catch((error) => {
        this.toast.show("Connection error", 2000);
        console.error('net error',error);
      });
}

addSideCard = (item) => {
  if(!this.use.sideCards) this.use.sideCards = {}
  var BreakException = {};
  try {
    Object.keys(this.use.cards).forEach(card => {
      if(this.use.cards[card].oracle_id == item){
        this.toast.show("Card "+this.use.cards[card].name+" added to side cards", 2000);
        if(this.use.sideCards[item]){
          this.use.sideCards[item].nombre++;
        }else{
          this.use.sideCards[item] = Object.assign({}, this.use.cards[card]);
          this.use.sideCards[item].nombre=1;
        }
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
        this.toast.show("Card "+this.use.cards[card].name+" deleted from side cards", 2000);
        if(this.use.sideCards[card].nombre>1){
          this.use.sideCards[card].nombre--;
        }else{
          delete this.use.sideCards[card];
        }
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
        this.toast.show("Card "+this.use.cards[card].name+" added to key cards", 2000);
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
        this.toast.show("Card "+this.use.cards[card].name+" deleted from key cards", 2000);
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
  this.toast.show("Deck format updated", 2000);
  this.props.use[index].mode = text;
  storeData(this.props.pro);
  this.setState({})
  this.props.setPro({});
}

endEditDescription = () => {
  this.toast.show("Deck description edited", 2000);
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
        
        {this.props.cantUpdate==true?<></>:<Animatable.View  animation="rubberBand" delay={1000+this.keyglobal*100}><Menu closeOnSelect={false} style={{right:0}}
          trigger={(triggerProps) => {
            return (
              <Pressable accessibilityLabel="More options menu" {...triggerProps}>
                <Icon name="bars" size={20} color="white" style={{paddingHorizontal:10,paddingVertical:2}}/>
              </Pressable>
            )
          }}
        >
        {(side == false)?<><Menu.Group title={this.props.collections?"Collections":"Deck"}>
          <Menu.Item onPress={() => {this.handleDelete(item)}} style={{flexDirection:"row"}}><Icon name="trash" size={20} color="black" />    {deck[item].nombre>1?"sub":"Delete"}</Menu.Item>
          {Object.keys(this.use.cards).length<=99?<Menu.Item onPress={() => {this.handleAdd(deck[item])}} style={{flexDirection:"row"}}><Icon name="plus-square" size={20} color="black" />    Add</Menu.Item>:<Menu.Item style={{flexDirection:"row"}}><Icon name="plus-square" size={20} color="black" />    100 Cards Max</Menu.Item>}
        </Menu.Group>
        {this.props.collections?<View></View>:<Menu.Group title="Key Cards">
        {this.use.keyCards&&Object.keys(this.use.keyCards).length<=9?<Menu.Item onPress={() => {this.addKeyCard(item)}} style={{flexDirection:"row"}}><Icon name="key" size={20} color="black" />  Add to Key Cards</Menu.Item>:<Menu.Item style={{flexDirection:"row"}}><Icon name="key" size={20} color="black" />  10 Cards Max</Menu.Item>}
        </Menu.Group>}
        {this.props.collections?<View></View>:<Menu.Group title="SideCard">
          {(this.use.sideCards&&Object.keys(this.use.sideCards).length<=39?<Menu.Item onPress={() => {this.addSideCard(item)}} style={{flexDirection:"row"}}><Icon name="arrows-alt" size={20} color="black" />  Add to SideCard</Menu.Item>:<Menu.Item onPress={() => {this.addSideCard(item)}} style={{flexDirection:"row"}}><Icon name="arrows-alt" size={20} color="black" />  40 Cards Max</Menu.Item>)}
        </Menu.Group>}
        <Menu.Group title="Interact">
            <Menu.Item onPress={() => this.props.pro.loved.includes(deck[item].oracle_id)?this.unloved(deck[item]):this.loved(deck[item])} style={{flexDirection:"row"}}><Icon style={{color:(this.props.pro.loved.includes(deck[item].oracle_id)?"red":"black")}} name={"heart"} size={20}  /><Text>   {this.props.pro.loved.includes(deck[item].oracle_id)?"Unlove":"Love"}</Text></Menu.Item>
          </Menu.Group>
        </>:<Menu.Item onPress={() => {this.subSideCard(item)}} style={{flexDirection:"row"}}><Icon name="trash" size={20} color="black" />    Delete</Menu.Item>
        }
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
    <View 
    style={{
      height:Dimensions.get('window').height,
      width:Dimensions.get('window').width,
    }}>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
  <ScrollView style={{marginBottom:190}}
  stickyHeaderIndices={[1,3,5,7,9,11,13,15,17,19,21,23,25,27,29, 32,34,36]}>
      <View>
      {(!this.props.cantUpdate&&Object.keys(this.use.cards).length<=0)||this.props.collections?
          <TouchableHighlight
          activeOpacity={0.9}
          underlayColor="rgba(255,255,255,0.1)" onPress={() => this.props.navigation.navigate('addCardByText', {collection:this.props.collections,item: this.props.item,type:this.props.oneNavigateType,functionReload:()=>this.sortFunction()})} style={{color:"white",margin:2,backgroundColor:"#28283C",borderRadius: 10,width:Dimensions.get('window').width,flexDirection:"row",flexGrow:1,justifyContent:"space-between"}}>
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
        {/*Object.keys(this.state.sortedCardsCount).map(element => {
          return <View>
            {Object.keys(this.state.sortedCardsCount[element]).length<=0?<View></View>:<View>
            <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{Object.keys(this.state.sortedCards[element]).length <= 0 ?<></>:<Animatable.View  animation="slideInLeft" style={{flexDirection:"row"}}><View style={{flexDirection:"row"}}><Heading color="yellow.100" style={{fontSize:24,top:6}}>{element.toUpperCase()}</Heading><Text style={{margin:10,fontSize:22,color:"white",fontWeight:"bold",bottom:3}}>[ {this.state.sortedCardsCount[element]} ]</Text></View></Animatable.View>}</LinearGradient>

            <View>{Object.keys(this.state.sortedCards[element]).length > 0 ?
            <VStack>
              {Object.keys(this.state.sortedCards[element]).map((item, itemI) => (this.SetCard(item, itemI,element)))}
            </VStack>:<></>}</View>
            </View>}
          </View>
        })
      */}
        
        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{Object.keys(this.state.sortedCards["creature"]).length <= 0 ?<></>:<Animatable.View  animation="slideInLeft" style={{flexDirection:"row"}}><View style={{flexDirection:"row"}}><Heading color="yellow.100" style={{fontSize:24,top:6}}>CREATURES</Heading><Text style={{margin:10,fontSize:22,color:"white",fontWeight:"bold",bottom:3}}>[ {this.state.sortedCardsCount["creature"]} ]</Text></View></Animatable.View>}</LinearGradient>

          <View>{Object.keys(this.state.sortedCards["creature"]).length > 0 ?
          <VStack>
            {Object.keys(this.state.sortedCards["creature"]).map((item, itemI) => (this.SetCard(item, itemI,"creature")))}
        </VStack>:<></>}</View>

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{Object.keys(this.state.sortedCards["sorcery"]).length <= 0 ?<></>:<Animatable.View  animation="slideInLeft" style={{flexDirection:"row"}}><View style={{flexDirection:"row"}}><Heading color="yellow.100" style={{fontSize:24,top:6}}>SORCERIES</Heading><Text style={{padding:10,fontSize:22,color:"white",fontWeight:"bold",bottom:3}}>[ {this.state.sortedCardsCount["sorcery"]} ]</Text></View></Animatable.View>}</LinearGradient>

        <View>{Object.keys(this.state.sortedCards["sorcery"]).length > 0 ?
          <VStack>
            {Object.keys(this.state.sortedCards["sorcery"]).map((item, itemI) => (this.SetCard(item, itemI,"sorcery")))}
        </VStack>:<></>}</View>

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{Object.keys(this.state.sortedCards["instant"]).length <= 0 ?<></>:<Animatable.View  animation="slideInLeft" style={{flexDirection:"row"}}><View style={{flexDirection:"row"}}><Heading color="yellow.100" style={{fontSize:24,top:6}}>INSTANTS</Heading><Text style={{padding:10,fontSize:22,color:"white",fontWeight:"bold",bottom:3}}>[ {this.state.sortedCardsCount["instant"]} ]</Text></View></Animatable.View>}</LinearGradient>

        <View>{Object.keys(this.state.sortedCards["instant"]).length > 0 ?
          <VStack>
            {Object.keys(this.state.sortedCards["instant"]).map((item, itemI) => (this.SetCard(item, itemI,"instant")))}
        </VStack>:<></>}</View>

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{Object.keys(this.state.sortedCards["artifact"]).length <= 0 ?<></>:<Animatable.View  animation="slideInLeft" style={{flexDirection:"row"}}><View style={{flexDirection:"row"}}><Heading color="yellow.100" style={{fontSize:24,top:6}}>ARTIFACTS</Heading><Text style={{padding:10,fontSize:22,color:"white",fontWeight:"bold",bottom:3}}>[ {this.state.sortedCardsCount["artifact"]} ]</Text></View></Animatable.View>}</LinearGradient>

        <View>{Object.keys(this.state.sortedCards["artifact"]).length > 0 ?
          <VStack>
            {Object.keys(this.state.sortedCards["artifact"]).map((item, itemI) => (this.SetCard(item, itemI,"artifact")))}
        </VStack>:<></>}</View>

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{Object.keys(this.state.sortedCards["enchantment"]).length <= 0 ?<></>:<Animatable.View  animation="slideInLeft" style={{flexDirection:"row"}}><View style={{flexDirection:"row"}}><Heading color="yellow.100" style={{fontSize:24,top:6}}>ENCHANTMENTS</Heading><Text style={{padding:10,fontSize:22,color:"white",fontWeight:"bold",bottom:3}}>[ {this.state.sortedCardsCount["enchantment"]} ]</Text></View></Animatable.View>}</LinearGradient>

        <View>{Object.keys(this.state.sortedCards["enchantment"]).length > 0 ?
          <VStack>
            {Object.keys(this.state.sortedCards["enchantment"]).map((item, itemI) => (this.SetCard(item, itemI,"enchantment")))}
        </VStack>:<></>}</View>

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{Object.keys(this.state.sortedCards["vanguard"]).length <= 0 ?<></>:<Animatable.View  animation="slideInLeft" style={{flexDirection:"row"}}><View style={{flexDirection:"row"}}><Heading color="yellow.100" style={{fontSize:24,top:6}}>VANGUARDS</Heading><Text style={{padding:10,fontSize:22,color:"white",fontWeight:"bold",bottom:3}}>[ {this.state.sortedCardsCount["vanguard"]} ]</Text></View></Animatable.View>}</LinearGradient>

        <View>{Object.keys(this.state.sortedCards["vanguard"]).length > 0 ?
          <VStack>
            {Object.keys(this.state.sortedCards["vanguard"]).map((item, itemI) => (this.SetCard(item, itemI,"vanguard")))}
        </VStack>:<></>}</View>

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{Object.keys(this.state.sortedCards["scheme"]).length <= 0 ?<></>:<Animatable.View  animation="slideInLeft" style={{flexDirection:"row"}}><View style={{flexDirection:"row"}}><Heading color="yellow.100" style={{fontSize:24,top:6}}>SCHEMES</Heading><Text style={{padding:10,fontSize:22,color:"white",fontWeight:"bold",bottom:3}}>[ {this.state.sortedCardsCount["scheme"]} ]</Text></View></Animatable.View>}</LinearGradient>

        <View>{Object.keys(this.state.sortedCards["scheme"]).length > 0 ?
          <VStack>
            {Object.keys(this.state.sortedCards["scheme"]).map((item, itemI) => (this.SetCard(item, itemI,"scheme")))}
        </VStack>:<></>}</View>

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{Object.keys(this.state.sortedCards["tribal"]).length <= 0 ?<></>:<Animatable.View  animation="slideInLeft" style={{flexDirection:"row"}}><View style={{flexDirection:"row"}}><Heading color="yellow.100" style={{fontSize:24,top:6}}>TRIBALS</Heading><Text style={{padding:10,fontSize:22,color:"white",fontWeight:"bold",bottom:3}}>[ {this.state.sortedCardsCount["tribal"]} ]</Text></View></Animatable.View>}</LinearGradient>

        <View>{Object.keys(this.state.sortedCards["tribal"]).length > 0 ?
          <VStack>
            {Object.keys(this.state.sortedCards["tribal"]).map((item, itemI) => (this.SetCard(item, itemI,"tribal")))}
        </VStack>:<></>}</View>

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{Object.keys(this.state.sortedCards["token"]).length <= 0 ?<></>:<Animatable.View  animation="slideInLeft" style={{flexDirection:"row"}}><View style={{flexDirection:"row"}}><Heading color="yellow.100" style={{fontSize:24,top:6}}>TOKENS</Heading><Text style={{padding:10,fontSize:22,color:"white",fontWeight:"bold",bottom:3}}>[ {this.state.sortedCardsCount["token"]} ]</Text></View></Animatable.View>}</LinearGradient>

        <View>{Object.keys(this.state.sortedCards["token"]).length > 0 ?
          <VStack>
            {Object.keys(this.state.sortedCards["token"]).map((item, itemI) => (this.SetCard(item, itemI,"token")))}
        </VStack>:<></>}</View>

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{Object.keys(this.state.sortedCards["phenomenon"]).length <= 0 ?<></>:<Animatable.View  animation="slideInLeft" style={{flexDirection:"row"}}><View style={{flexDirection:"row"}}><Heading color="yellow.100" style={{fontSize:24,top:6}}>PHENOMENONS</Heading><Text style={{padding:10,fontSize:22,color:"white",fontWeight:"bold",bottom:3}}>[ {this.state.sortedCardsCount["phenomenon"]} ]</Text></View></Animatable.View>}</LinearGradient>

        <View>{Object.keys(this.state.sortedCards["phenomenon"]).length > 0 ?
          <VStack>
            {Object.keys(this.state.sortedCards["phenomenon"]).map((item, itemI) => (this.SetCard(item, itemI,"phenomenon")))}
        </VStack>:<></>}</View>

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{Object.keys(this.state.sortedCards["conspiracy"]).length <= 0 ?<></>:<Animatable.View  animation="slideInLeft" style={{flexDirection:"row"}}><View style={{flexDirection:"row"}}><Heading color="yellow.100" style={{fontSize:24,top:6}}>CONSPIRACY</Heading><Text style={{padding:10,fontSize:22,color:"white",fontWeight:"bold",bottom:3}}>[ {this.state.sortedCardsCount["conspiracy"]} ]</Text></View></Animatable.View>}</LinearGradient>

        <View>{Object.keys(this.state.sortedCards["conspiracy"]).length > 0 ?
          <VStack>
            {Object.keys(this.state.sortedCards["conspiracy"]).map((item, itemI) => (this.SetCard(item, itemI,"conspiracy")))}
        </VStack>:<></>}</View>

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{Object.keys(this.state.sortedCards["planeswalker"]).length <= 0 ?<></>:<Animatable.View  animation="slideInLeft" style={{flexDirection:"row"}}><View style={{flexDirection:"row"}}><Heading color="yellow.100" style={{fontSize:24,top:6}}>PLANESWALKERS</Heading><Text style={{padding:10,fontSize:22,color:"white",fontWeight:"bold",bottom:3}}>[ {this.state.sortedCardsCount["planeswalker"]} ]</Text></View></Animatable.View>}</LinearGradient>

        <View>{Object.keys(this.state.sortedCards["planeswalker"]).length > 0 ?
          <VStack>
            {Object.keys(this.state.sortedCards["planeswalker"]).map((item, itemI) => (this.SetCard(item, itemI,"planeswalker")))}
        </VStack>:<></>}</View>

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{Object.keys(this.state.sortedCards["rituel"]).length <= 0 ?<></>:<Animatable.View  animation="slideInLeft" style={{flexDirection:"row"}}><View style={{flexDirection:"row"}}><Heading color="yellow.100" style={{fontSize:24,top:6}}>RITUEL</Heading><Text style={{padding:10,fontSize:22,color:"white",fontWeight:"bold",bottom:3}}>[ {this.state.sortedCardsCount["rituel"]} ]</Text></View></Animatable.View>}</LinearGradient>

        <View>{Object.keys(this.state.sortedCards["rituel"]).length > 0 ?
          <VStack>
            {Object.keys(this.state.sortedCards["rituel"]).map((item, itemI) => (this.SetCard(item, itemI,"rituel")))}
        </VStack>:<></>}</View>

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{Object.keys(this.state.sortedCards["land"]).length <= 0 ?<></>:<Animatable.View  animation="slideInLeft" style={{flexDirection:"row"}}><View style={{flexDirection:"row"}}><Heading color="yellow.100" style={{fontSize:24,top:6}}>LANDS</Heading><Text style={{padding:10,fontSize:22,color:"white",fontWeight:"bold",bottom:3}}>[ {this.state.sortedCardsCount["land"]} ]</Text></View></Animatable.View>}</LinearGradient>

        <View>{Object.keys(this.state.sortedCards["land"]).length > 0 ?
          <VStack>
            {Object.keys(this.state.sortedCards["land"]).map((item, itemI) => (this.SetCard(item, itemI,"land")))}
        </VStack>:<></>}</View>
        
        
        <View></View>
        <View>
      {(!this.props.cantUpdate&&Object.keys(this.use.cards).length>0)&&!this.props.collections?
          <TouchableHighlight
          activeOpacity={0.9}
          underlayColor="rgba(255,255,255,0.1)" onPress={() => this.props.navigation.navigate('addCardByText', {collection:this.props.collections,item: this.props.item,type:this.props.oneNavigateType,functionReload:()=>this.sortFunction()})} style={{color:"white",margin:2,backgroundColor:"#28283C",borderRadius: 10,width:Dimensions.get('window').width,flexDirection:"row",flexGrow:1,justifyContent:"space-between",marginTop:50}}>
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

        <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{!this.use.keyCards||this.props.collections?<></>:this.use.keyCards&&Object.keys(this.use.keyCards).length>0?DividerLinear("Key Cards",0):<></>}</LinearGradient>

        <View style={{marginBottom:20,marginTop:20}}>{!this.use.keyCards||this.props.collections?<></>:
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
      {this.props.cantUpdate==true?<></>:<Menu  closeOnSelect={false}
      trigger={(triggerProps) => {
        return (
          <Pressable accessibilityLabel="More options menu" {...triggerProps}>
            <Icon style={{margin:5}} name="bars" size={25} color="white" />
          </Pressable>
        )
      }}
      >
      <Menu.Item onPress={() => {this.subKeyCard(item)}} style={{flexDirection:"row"}}><Icon name="key" size={20} color="black" />  {this.use.keyCards[item].nombre>1?"Sub Key Card":"Delete Key Card"}</Menu.Item>
    </Menu>}

      </ImageBackground>
      
      
      </Box>
      </View>
      </TouchableHighlight>
      ))}
      </View>
      </>}</View>


      <LinearGradient colors={[ 'rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']} start={{ x: 0, y: 0.9 }} end={{ x: 0, y: 1 }} >{!this.use.sideCards||this.props.collections?<></>:this.use.sideCards&&Object.keys(this.use.sideCards).length>0?DividerLinear("Side Cards",0):<></>}</LinearGradient>

        <View style={{marginBottom:20,marginTop:20}}>{!this.use.sideCards||this.props.collections?<></>:
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

      </ScrollView>
      <Toast opacity={1} style={{zIndex:99999}} positionValue={50} position='top' textStyle={{color:'white',fontSize:16,fontWeight:"bold",}} ref={(toast) => this.toast = toast}/>
      </KeyboardAvoidingView>
      </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(OneMultiCard);