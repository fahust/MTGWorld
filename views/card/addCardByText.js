import { StyleSheet,Image, Text, ScrollView, View, SafeAreaView, Dimensions, ImageBackground,TouchableOpacity,TouchableHighlight,TextInput } from 'react-native';
import React, { Component } from 'react';
import {
  Button,Select,CheckIcon,Badge
} from "native-base"
import {connect} from 'react-redux';
import {setPro} from '../../redux/ProActions';
import {bindActionCreators} from 'redux';
import ConvertText from '../services/ConvertText';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient'
import storeData from '../services/StoreData';
import DividerLinearFullWidth from '../services/DividerLinearFullWidth';

import Toast, {DURATION} from 'react-native-easy-toast'

import { SvgUri } from 'react-native-svg';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 250;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

 class AddcardByText extends Component {
  constructor(properties) {
    super(properties);
    this.state = {
      imageCard: '',
      searching: '',
      currentCard: '',
      currentDeck: {},
      textDescription: '',
      autocomplete:[],
      autocompleteObject:{},
      query:'',
      cardInTemp:[],
      color:'',
      rarity:'',
      language:this.props.pro.lang,
      cost:'',
      type:'',
      format:'',
      set:'',
      index:10,
      filter:{
        "color":{
          "":{n:"Select",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "b":{n:"Black",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/B.svg"},
          "u":{n:"Blue",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/U.svg"},
          "r":{n:"Red",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/R.svg"},
          "w":{n:"White",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/W.svg"},
          "g":{n:"Green",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/G.svg"},
        },
        "rarity":{
          "":{n:"Select",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "common":{n:"Common",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "uncommon":{n:"Uncommon",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "rare":{n:"Rare",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "mythic":{n:"Mythic",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
        },
        "language":{
          "fr":{n:"French",svg:""},
          "en":{n:"English",svg:""},
          "sp":{n:"Spanish",svg:""},
          "de":{n:"German",svg:""},
          "it":{n:"Italian",svg:""},
          "pt":{n:"Portuguese",svg:""},
          "jp":{n:"Japanese",svg:""},
          "kr":{n:"Korean",svg:""},
          "ru":{n:"Russian",svg:""},
          "cs":{n:"Chinese",svg:""},
        },
        "cost":{
          "":{n:"Select",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "0":{n:"0",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/0.svg"},
          "1":{n:"1",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/1.svg"},
          "2":{n:"2",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/2.svg"},
          "3":{n:"3",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/3.svg"},
          "4":{n:"4",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/4.svg"},
          "5":{n:"5",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/5.svg"},
          "6":{n:"6",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/6.svg"},
          "7":{n:"7",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/7.svg"},
          "8":{n:"8",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/8.svg"},
          "9":{n:"9",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/9.svg"},
          "10":{n:"10",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/10.svg"},
          "11":{n:"11",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/11.svg"},
          "12":{n:"12",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/12.svg"},
          "13":{n:"13",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/13.svg"},
          "14":{n:"14",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/14.svg"},
          "15":{n:"15",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/15.svg"},
          "16":{n:"16",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/16.svg"},
          "17":{n:"17",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/17.svg"},
          "18":{n:"18",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/18.svg"},
          "19":{n:"19",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/19.svg"},
          "20":{n:"20",svg:"https://c2.scryfall.com/file/scryfall-symbols/card-symbols/20.svg"},
        },
        "type":{
          "":{n:"Select",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "rituel":{n:"Ritual",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "enchantment":{n:"Enchantment",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "artifact":{n:"Artifact",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "planeswalker":{n:"Planeswalker",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "creature":{n:"Creature",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "sorcery":{n:"Sorcery",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "conspiracy":{n:"Conspiracy",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "instant":{n:"Instant",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "land":{n:"Land",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "phenomenon":{n:"Phenomenon",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "token":{n:"Token",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "tribal":{n:"Tribal",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "scheme":{n:"Scheme",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "vanguard":{n:"Vanguard",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
        },
        "format":{
          "":{n:"Select",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "standard":{n:"Standard",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "future":{n:"Future",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "historic":{n:"Historic",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "gladiator":{n:"Gladiator",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "pioneer":{n:"Pioneer",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "modern":{n:"Modern",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "legacy":{n:"Legacy",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "pauper":{n:"Pauper",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "vintage":{n:"Vintage",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "penny":{n:"Penny",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "commander":{n:"Commander",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "brawl":{n:"Brawl",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "duel":{n:"Duel",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "oldschool":{n:"Oldschool",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
          "premodern":{n:"Premodern",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
        },
        "set":{
          "":{n:"Select",svg:"https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"},
        }
      }
    };
    Object.keys(this.props.pro.setName).forEach(set => {
      this.state.filter.set[set] = {n:this.props.pro.setName[set].name.charAt(0).toUpperCase() + this.props.pro.setName[set].name.slice(1),svg:this.props.pro.setName[set].svg}
    });
  }
  
  search = () => {
    var randomPath = 'cards/search?q=name:/"'+this.state.query+'"+lang:'+this.state.language+(this.state.cost!=''?("+cmc="+this.state.cost):"")+(this.state.rarity!=''?("+r="+this.state.rarity):"")+(this.state.color!=''?("+c:"+this.state.color):"")+(this.state.type!=''?("+t:"+this.state.type):"")+(this.state.format!=''?("+is:"+this.state.format):"")+(this.state.set!=''?("+b:"+this.state.set):"");
    //var randomPath = "cards/search??q=%21%22sift+through+sands%22"
    //var randomPath = "/card/afc/330/fr/";
    //card_back_id
        fetch('https://api.scryfall.com/'+encodeURI(randomPath), {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
      }).then((response) => response.json())
      .then((json) => {
        if(json.status != 404 && json != undefined){
          this.state.autocompleteObject={}
          var BreakException = {};
          try {
            if(json.data.length > 0){
              json.data.forEach((element,key) => {
                if(element && element.image_uris && element.image_uris.art_crop){
                  //if(key > 15) throw BreakException;
                  this.state.autocompleteObject[element.id] = element;
                  if(!this.props.route.params.collection){
                    Object.keys((this.props.route.params.type == "deck" ?this.props.pro.decks:this.props.pro.wishlists)[this.props.route.params.item].cards).forEach(card => {
                      if((this.props.route.params.type == "deck" ?this.props.pro.decks:this.props.pro.wishlists)[this.props.route.params.item].cards[card].name==element.name)
                      this.state.autocompleteObject[element.id].count?this.state.autocompleteObject[element.id].count+=1:this.state.autocompleteObject[element.id].count=1
                    });
                  }else{
                    Object.keys(this.props.pro.collectionsCards.cards).forEach(card => {
                      if(this.props.pro.collectionsCards.cards[card].name==element.name) 
                      this.state.autocompleteObject[element.id].count?this.state.autocompleteObject[element.id].count+=1:this.state.autocompleteObject[element.id].count=1
                    });
                  }
                }
              });
            }else{
              this.state.autocompleteObject = [{name:"Nothing"}];
            }
          } catch (e) {
            if (e !== BreakException) throw e;
          }
          
        }else{
          this.state.autocompleteObject = [{name:"Nothing"}];
        }
        this.setState({autocomplete:json.data})
      })
      .catch((error) => {
        console.error(error);
      });
    }

deleteDatas(card){
  delete card["id"];
  delete card["mtgo_id"];
  delete card["mtgo_foil_id"];
  delete card["tcgplayer_id"];
  delete card["games"];
  delete card["foil"];
  delete card["nonfoil"];
  delete card["set_type"];
  delete card["collector_number"];
  delete card["full_art"];
  delete card["story_spotlight"];
  delete card["booster"];
  delete card["edhrec_rank"];
  delete card["related_uris"];
  delete card["object"]
  delete card["multiverse_ids"]
  delete card["uri"]
  delete card["scryfall_uri"]
  delete card["layout"]
  delete card["highres_image"]
  delete card["image_status"]
  if(card.image_uris){
    delete card.image_uris["small"]
    delete card.image_uris["normal"]
    delete card.image_uris["large"]
    delete card.image_uris["png"]
  }
  delete card["keywords"]
  delete card["reserved"]
  delete card["oversized"]
  delete card["promo"]
  delete card["reprint"]
  delete card["variation"]
  delete card["set_id"]
  delete card["set_uri"]
  delete card["set_search_uri"]
  delete card["scryfall_set_uri"]
  delete card["rulings_uri"]
  delete card["prints_search_uri"]
  delete card["digital"]
  delete card["card_back_id"]
  delete card["artist_ids"]
  delete card["illustration_id"]
  delete card["border_color"]
  delete card["frame"]
  delete card["textless"]
  return card;
}

addToDeck= async (key) =>{
  if(this.props.route.params.image==true){
    this.toast.show("Image deck added", 2000);
    this.props.pro.decks[this.props.route.params.item].image = this.deleteDatas(this.state.autocompleteObject[key]);
    this.setState({});
    this.props.pro.lastDeckUpdate = this.props.route.params.item;
    storeData(this.props.pro,false);
    this.props.route.params.functionReload();
  }else if((!this.state.autocompleteObject[key].count || this.state.autocompleteObject[key].count < 4)&&(Object.keys(this.props.pro.decks[this.props.route.params.item].cards).length<=99)){
    this.toast.show("Card "+this.state.autocompleteObject[key].name+" added", 2000);
    if(!this.state.autocompleteObject[key].count) this.state.autocompleteObject[key].count = 0;
    this.props.pro.decks[this.props.route.params.item].cards[Date.now()] = this.deleteDatas(this.state.autocompleteObject[key]);
    this.state.autocompleteObject[key].count += 1;
    this.setState({});
    //this.props.setPro({});
    //this.props.route.params.functionReload();
    this.props.pro.lastDeckUpdate = this.props.route.params.item;
    storeData(this.props.pro,false);
  }
}

addToWishlists= (key) =>{
  if(this.props.route.params.image==true){
    this.toast.show("Image deck added", 2000);
    this.props.pro.wishlists[this.props.route.params.item].image = this.deleteDatas(this.state.autocompleteObject[key]);
    this.setState({});
    storeData(this.props.pro,false);
    this.props.route.params.functionReload();
  }else if(!this.state.autocompleteObject[key].count || this.state.autocompleteObject[key].count < 4&&(Object.keys(this.props.pro.wishlists[this.props.route.params.item].cards).length<=99)){
    this.toast.show("Card "+this.state.autocompleteObject[key].name+" added", 2000);
    if(!this.state.autocompleteObject[key].count) this.state.autocompleteObject[key].count = 0;
    this.props.pro.wishlists[this.props.route.params.item].cards[Date.now()] = this.deleteDatas(this.state.autocompleteObject[key]);
    this.state.autocompleteObject[key].count += 1;
    this.setState({});
    //this.props.setPro({});
    //this.props.route.params.functionReload();
    this.props.pro.noSendModif = true;
    storeData(this.props.pro,false);
  }
}

subToDeck= (key) =>{
  if(!this.state.autocompleteObject[key].count || this.state.autocompleteObject[key].count > 0){
    if(!this.state.autocompleteObject[key].count) this.state.autocompleteObject[key].count = 0;
    var BreakException = {};
    try {
      Object.keys(this.props.pro.decks[this.props.route.params.item].cards).forEach(card => {
        if(this.props.pro.decks[this.props.route.params.item].cards[card].name==this.state.autocompleteObject[key].name){
          this.toast.show("Card "+this.state.autocompleteObject[key].name+" deleted", 2000);
          this.state.autocompleteObject[key].count -= 1;
          delete this.props.pro.decks[this.props.route.params.item].cards[card];
          throw BreakException;
        }
      });
    } catch (e) {
    if (e !== BreakException) throw e;
    }
    this.setState({});
    //this.props.setPro({});
    //this.props.route.params.functionReload();
    this.props.pro.lastDeckUpdate = this.props.route.params.item;
    storeData(this.props.pro,false);
  }
}


 subToWishlists= (key) =>{
  if(!this.state.autocompleteObject[key].count || this.state.autocompleteObject[key].count > 0){
    if(!this.state.autocompleteObject[key].count) this.state.autocompleteObject[key].count = 0;
    var BreakException = {};
    try {
      Object.keys(this.props.pro.wishlists[this.props.route.params.item].cards).forEach(card => {
        if(this.props.pro.wishlists[this.props.route.params.item].cards[card].name==this.state.autocompleteObject[key].name){
          this.toast.show("Card "+this.state.autocompleteObject[key].name+" deleted", 2000);
          this.state.autocompleteObject[key].count -= 1;
          delete this.props.pro.wishlists[this.props.route.params.item].cards[card];
          throw BreakException;
        }
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }
    this.setState({});
    //this.props.setPro({});
    //this.props.route.params.functionReload();
    this.props.pro.noSendModif = true;
    storeData(this.props.pro,false);
  }
}

  setFilter = (state,value) => {
    if(state=="language") this.props.pro.lang = value;
    this.setState({[state]:value})
  }


  addCardCollection = (card,key) => {//console.log(card)
    if(!this.state.autocompleteObject[key].count) this.state.autocompleteObject[key].count = 0;
    this.state.autocompleteObject[key].count += 1;
    
    if(!this.props.pro.collections.cards[card.oracle_id]){
      this.props.pro.collections.cards[card.oracle_id]=1;
    }else{
      this.props.pro.collections.cards[card.oracle_id]++;
    }
    this.props.pro.collectionsCards.cards[Date.now()] = this.deleteDatas(card);
    this.toast.show("Card "+this.state.autocompleteObject[key].name+" added into collection", 2000);
    this.setState({});
    //this.props.setPro({});
    this.props.pro.noSendModif = true;
    storeData(this.props.pro,false);
    if(this.props.pro.sortFunctionCollection)this.props.pro.sortFunctionCollection.sortFunction()
  }

  subCardCollection = (card,key) => {
    if(!this.state.autocompleteObject[key].count) this.state.autocompleteObject[key].count = 0;
    if(this.state.autocompleteObject[key].count>0) this.state.autocompleteObject[key].count -= 1;

    if(!this.props.pro.collections.cards[card.oracle_id]){
      this.props.pro.collections.cards[card.oracle_id]=0;
    }else if(this.props.pro.collections.cards[card.oracle_id]>0){
      this.props.pro.collections.cards[card.oracle_id]--;
      var BreakException = {};
      try {
        Object.keys(this.props.pro.collectionsCards.cards).forEach(element => {
          if(this.props.pro.collectionsCards.cards[element].oracle_id == card.oracle_id ){
            this.toast.show("Card "+card.name+" added into collection", 2000);
            delete this.props.pro.collectionsCards.cards[element];
            throw BreakException;
          }
        });
      } catch (e) {
        //console.log('error add collection ',e)
        if (e !== BreakException) throw e;
      }
    }
    this.setState({});
    //this.props.setPro({});
    this.props.pro.noSendModif = true;
    storeData(this.props.pro,false);
    if(this.props.pro.sortFunctionCollection) this.props.pro.sortFunctionCollection.sortFunction()
  }

  addIndexToScroll = () => {
    if(this.state.index<50)
      this.setState({index:this.state.index+10})
  }
    

  render(){
    
const dimensions = Dimensions.get('window');
const imageHeight = Math.round(dimensions.width * 9 / 16);
const imageWidth = dimensions.width;
    



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
    <Toast opacity={1} style={{zIndex:99999}} positionValue={50} position='center' textStyle={{color:'white',fontSize:16,fontWeight:"bold",}} ref={(toast) => this.toast = toast}/>
    <ImageBackground  blurRadius={1} style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height/2,marginTop:Dimensions.get('window').height/3,resizeMode: 'cover',position:"absolute"}} source={backgroundImg} alt="image base" resizeMode="cover" roundedTop="md" imageStyle= {{opacity:0.1}} />
    <View style={{marginBottom:80}} >
        <View style={{flexDirection:"row"}}>
          <TextInput
            //onTouchStart={()=>{this.search()}}
            //onEndEditing={()=>{this.search()}}
            onSubmitEditing={()=>{this.search()}}
            style={{width:imageWidth-50,backgroundColor:"white",height:40,color:"black"}}
            onChangeText={(text)=> this.setState({ query: text })}
            value={this.state.query}
          />
          <TouchableHighlight activeOpacity={0.9} underlayColor="rgba(255,255,255,0.1)" onPress={()=>{this.search()}} style={{padding:0,textAlign:"right",position:"absolute",right:60,padding:5}}>
            <Icon name="search" size={30} color="black" />
          </TouchableHighlight>
          <TouchableHighlight activeOpacity={0.9} underlayColor="rgba(255,255,255,0.1)"  onPress={()=>{
            if(Object.keys(this.state.autocompleteObject).length<=0){
              this.setState({query:'',index:10})
            }else{
              this.setState({autocompleteObject:{},index:10})
            }
            
          }}>
            <Icon style={{paddingLeft:10,zIndex:9999}} name={Object.keys(this.state.autocompleteObject).length<=0?"undo":"window-close"} size={30} color="white"/>
          </TouchableHighlight>
        </View>

        <ScrollView style={{backgroundColor:"white",marginBottom:5}}
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              this.addIndexToScroll();
            }
          }}
          scrollEventThrottle={400}>
          {Object.keys(this.state.autocompleteObject).map((element,key)=>{
            if(key<=this.state.index){
              return <View key={key} style={{flex:1, flexDirection:"row",borderTopWidth:1,borderTopColor:"black",justifyContent:"space-between",paddingBottom:key==this.state.index?50:0}}>
                <TouchableHighlight activeOpacity={0.9} underlayColor="rgba(255,255,255,0.1)"  onPress={() => {this.state.autocompleteObject[element].name != "Nothing"?this.props.navigation.navigate('OneCard', {item: this.state.autocompleteObject[element],}):''}}>
                  <View style={{flexDirection:"row"}}>
                    {this.state.autocompleteObject[element].name != "Nothing"?<Image resizeMethod={"scale"} style={{width:80,height:80}} source={this.state.autocompleteObject[element].image_uris && this.state.autocompleteObject[element].image_uris.art_crop?{uri:this.state.autocompleteObject[element].image_uris.art_crop}:""}/>:<View></View>}
                    
                    <View style={{padding:5}}>
                      <Text style={{paddingTop:10,fontSize:16,fontWeight:"bold",flex:1,flexWrap:"wrap",maxWidth:imageWidth/2}}>{this.state.autocompleteObject[element].printed_name?this.state.autocompleteObject[element].printed_name:this.state.autocompleteObject[element].name}</Text>
                      <View style={{flexDirection:"row"}}>
                      {this.props.pro.set && this.props.pro.set[this.state.autocompleteObject[element].set] && this.props.pro.set[this.state.autocompleteObject[element].set] && this.props.pro.set[this.state.autocompleteObject[element].set].icon && this.props.pro.set[this.state.autocompleteObject[element].set].icon != null && this.state.autocompleteObject[element].set !="afc" && this.props.pro.set[this.state.autocompleteObject[element].set].icon !="gk2"?<SvgUri
                        style={styles.innerCircle}
                          fill={this.state.autocompleteObject[element].rarity == "uncommon"?"rgba(192,192,192,0.8)":(this.state.autocompleteObject[element].rarity == "rare"?"gold":(this.state.autocompleteObject[element].rarity == "common"?"black":("orange")))}
                          stroke="white"
                          strokeOpacity={0.5}
                          color={this.state.autocompleteObject[element].rarity == "uncommon"?"rgba(192,192,192,0.8)":(this.state.autocompleteObject[element].rarity == "rare"?"gold":(this.state.autocompleteObject[element].rarity == "common"?"black":("orange")))}
                          fillOpacity={1}
                          width="25"
                          height="25"
                          uri={this.props.pro.set[this.state.autocompleteObject[element].set].icon}
                      />:<></>}
                        <Text style={{...styles.innerCircle,paddingTop:2,paddingLeft:3,paddingRight:3,height:25}}>{ConvertText(this.state.autocompleteObject[element].mana_cost,this.state.autocompleteObject[element].lang)}</Text>
                      </View>
                    </View>
                  </View>
  
                  
  
                </TouchableHighlight>
                {(this.props.route.params.image==true)?
                <TouchableHighlight activeOpacity={0.9} underlayColor="rgba(255,255,255,0.1)"  onPress={()=>{ this.addToDeck(element)}}><Badge style={{margin:0}} colorScheme="success"><Text style={{margin:0,padding:0}}>Select</Text><Text style={{margin:0,padding:0}}>deck</Text><Text style={{margin:0,padding:0}}>image</Text></Badge></TouchableHighlight>
                :
                (this.state.autocompleteObject[element].name != "Nothing" ?<View style={{flexDirection:"row",paddingTop:10}}>
                  <TouchableHighlight activeOpacity={0.9} underlayColor="rgba(255,255,255,0.1)"  onPress={()=>{ this.props.route.params.collection?this.addCardCollection(this.state.autocompleteObject[element],element):(this.props.route.params.type == "deck" ? this.addToDeck(element):this.addToWishlists(element))}}>
                    <Icon style={{paddingRight:10,zIndex:9999}} name="plus-square" size={20} color="black"/>
                  </TouchableHighlight>
                  <Text style={{paddingLeft:5,paddingRight:5}}>{this.state.autocompleteObject[element].count?this.state.autocompleteObject[element].count:0}</Text>
                  <TouchableHighlight activeOpacity={0.9} underlayColor="rgba(255,255,255,0.1)"  onPress={()=>{this.props.route.params.collection?this.subCardCollection(this.state.autocompleteObject[element],element):(this.props.route.params.type == "deck" ? this.subToDeck(element):this.subToWishlists(element))}}>
                    <Icon style={{paddingLeft:10,paddingRight:5,zIndex:9999}} name="minus-square" size={20} color="black"/>
                  </TouchableHighlight>
                </View>:<View></View>)}
              </View>
            }
          })

          }
        </ScrollView>

        
       
        <TouchableHighlight activeOpacity={0.9} underlayColor="rgba(255,255,255,0.1)"  onPress={() => this.search()} style={{color:"white",margin:2,backgroundColor:"#28283C",borderRadius: 10,width:Dimensions.get('window').width,flexDirection:"row",flexGrow:1,justifyContent:"space-between"}}>
          <View style={{flexDirection:"row"}}>
            <Icon style={{padding:20}} name="search" size={40} color="white" />
            <View>
              <Text style={{color:"white",fontSize:20,fontWeight:"bold",padding:5}}>Search with filter and name</Text>
              <Text style={{color:"white",fontSize:16,padding:5,width:Dimensions.get('window').width/1.55}}>use the filters to choose a card according to its type, color, language, rarity... or simply by its name.</Text>
            </View>
          </View>
        </TouchableHighlight>

        
        
        <View>
        {Object.keys(this.state.filter).map((filter)=>{
          return <View>
          <TouchableHighlight activeOpacity={0.9} underlayColor="rgba(255,255,255,0.1)"  onPress={()=>{
                this.props.navigation.navigate('addCardFilter', {filter:this.state.filter,type: filter,value:this.state[filter],setFilter:(type,value)=>this.setFilter(type,value)})
              }} style={{width:Dimensions.get('window').width,paddingTop:2,paddingBottom:5,borderColor:"white",padding:0,flexGrow:1,justifyContent:"space-between",flexDirection:"row"}}>
            <View style={{width:Dimensions.get('window').width,paddingTop:2,paddingBottom:5,borderColor:"white",padding:0,flexGrow:1,justifyContent:"space-between",flexDirection:"row"}}>
              <View style={{flexDirection:"row",width:Dimensions.get('window').width/2.5}}>
                <View style={{width:60}}>
                {filter=="rarity"?<SvgUri
                  style={{...styles.innerCircle,marginTop:2,marginLeft:7}} fill={"silver"} stroke={"silver"}
                  strokeWidth={2} strokeOpacity={1} strokeLinecap="butt" color={"white"} fillOpacity={1} width="30" height="30"
                  uri="https://c2.scryfall.com/file/scryfall-symbols/sets/default.svg?1627272000"
                />:(filter=="set"?<SvgUri
                style={{...styles.innerCircle,marginTop:2,marginLeft:7}} fill={"silver"} stroke={"silver"}
                strokeWidth={2} strokeOpacity={1} strokeLinecap="butt" color={"white"} fillOpacity={1} width="30" height="30"
                uri="https://c2.scryfall.com/file/scryfall-symbols/sets/aer.svg?1627272000"
              />:<Icon style={{paddingTop:5,paddingRight:15,paddingLeft:10,zIndex:9999}} name={filter=="color"?"tint":(filter=="language"?"flag":(filter=="cost"?"fire":(filter=="type"?"flag":(filter=="format"?"optin-monster":"fire"))))} size={30} color="silver"/>)}
              </View>
                <Text style={{color:"white",padding:5,fontSize:18,fontWeight:"bold"}}>{filter.charAt(0).toUpperCase() + filter.slice(1)}</Text>
              </View>
              <View style={{flexDirection:"row",}}>
                <Text style={{color:this.state.filter[filter][this.state[filter]].n=="Select"?"grey":"white",padding:5,fontSize:18,width:Dimensions.get('window').width/2.5}}>{this.state.filter[filter][this.state[filter]].n}</Text>
                <Icon style={{paddingRight:15,paddingLeft:10,zIndex:9999}} name="sort-down" size={30} color="silver"/>
              </View>
            </View>
          </TouchableHighlight>
           
          {DividerLinearFullWidth()}
          </View>
        })}


          
          {/*<View style={{width:Dimensions.get('window').width/2,padding:2,flexDirection:"row"}}>
            <View style={{paddingTop:7,paddingRight:8,paddingLeft:4}}>
              <SvgUri
                style={styles.innerCircle} fill={"silver"} stroke={"silver"}
                strokeWidth={2} strokeOpacity={1} strokeLinecap="butt" color={"white"} fillOpacity={1} width="30" height="30"
                uri="https://c2.scryfall.com/file/scryfall-symbols/sets/aer.svg?1629086400"
              />
            </View>
            <Input
            isDisabled
              variant="filled"
              onChangeText={(v) => this.setState({inputValue:v})}
              value={this.state.inputValue}
              placeholder="price"
            />
          </View>*/}
          
          <TouchableHighlight activeOpacity={0.9} underlayColor="rgba(255,255,255,0.1)"  style={{paddingTop:5}}>
        <Button onPress={()=>{this.setState({query:'',
          color:'',
          rarity:'',
          cost:'',
          type:'',
          format:'',
          set:'',})}} colorScheme="light" style={{fontSize:20,width:Dimensions.get('window').width/2.5,marginBottom:15}} size="sm">
            <View style={{flexDirection:"row"}}>
              <Icon name="filter" size={20} style={{paddingRight:10,paddingTop:3}} color="black"/>
              <Text style={{color:"black",fontSize:20}}>Clear filter</Text>
          </View>
        </Button>
        </TouchableHighlight>
        </View>
        


        <SafeAreaView style={styles.screen}>
          
      </SafeAreaView>
    </View>
    </LinearGradient>
  );

  


}

 }


 const styles = StyleSheet.create({
  backgroundStyle:{
    backgroundColor:"black"
  },
  image: {
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
      marginTop: 0,
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

export default connect(mapStateToProps, mapDispatchToProps)(AddcardByText);