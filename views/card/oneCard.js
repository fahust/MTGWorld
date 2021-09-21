import { StyleSheet,Image, ScrollView, View, SafeAreaView, TouchableOpacity, Dimensions, ImageBackground, Linking, FlatList} from 'react-native';
import React, { Component } from 'react';
import {
  IconButton,
  Text,
  Center,
  Menu,
  Pressable,
} from "native-base"
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {setPro} from '../../redux/ProActions';
import {bindActionCreators} from 'redux';
import ConvertText from '../services/ConvertText';
import { SvgUri } from 'react-native-svg';
import ImageModal from 'react-native-image-modal';
import LinearGradient from 'react-native-linear-gradient';
import DividerLinear from '../services/DividerLinear';
import {
  LineChart,
} from "react-native-chart-kit";
import DividerLinearFullWidth from '../services/DividerLinearFullWidth';
import storeData from '../services/StoreData';
import * as Animatable from 'react-native-animatable';
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import Dialog from "react-native-dialog";
import Toast, {DURATION} from 'react-native-easy-toast'


var CardBack = require('../img/cardBack.png');
var DecksImg = require('../img/DecksImg.png');

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 250;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

 class OneCard extends Component {
  constructor(properties) {
    super(properties);
    this.state = {
      index:10,
      createType:undefined,
      nameCreateDeck:'',
      dialog:false,
      versions:[],
      duplicateAction:'',
      fullCard:false,
      original:false,
      inputValue: '',
      list: [],
      tempUriBorder : this.props.route.params.item.image_uris?(this.props.route.params.item.image_uris.art_crop?this.props.route.params.item.image_uris.art_crop:this.props.route.params.item.image_uris.border_crop?this.props.route.params.item.image_uris.border_crop:''):'',
      tempUri : this.props.route.params.item.image_uris?(this.props.route.params.item.image_uris.art_crop?this.props.route.params.item.image_uris.art_crop:this.props.route.params.item.image_uris.border_crop?this.props.route.params.item.image_uris.border_crop:''):'',
      trendPrices : {
        labels: [""],
        datasets: [{data: [0],
         }],
      }
    };
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

getVersionsCards(){
    try {
      fetch('https://api.scryfall.com/cards/search?q=name:"'+encodeURI(this.props.route.params.item.name)+'"+include%3Aextras&unique=prints', {
            method: 'GET',
            credentials: 'same-origin',
            mode: 'same-origin',
            headers: {
              'Accept':       'application/json',
              'Content-Type': 'application/json'
            }
          }).then((response) => {return response.json();})
          .then((data) => {
            if(data.data){
              this.state.versions = data.data.slice(0,30);
              this.setState({})
            }
          })
          .catch((error) => {
            console.error('net error',error);
          });
    } catch (error) {
      console.error('net error2',error);
    }
  }

  sendServerData(){
    try {
      fetch('http://'+this.props.pro.url+'/oneCardView', {
            method: 'POST',
            credentials: 'same-origin',
            mode: 'same-origin',
            body: JSON.stringify({'nameCard':this.props.route.params.item.name}),
            headers: {
              'Accept':       'application/json',
              'Content-Type': 'application/json'
            }
          }).then((response) => {return response.json();})
          .then((data) => {
            if(data.card.trendPrices){
              if(Object.keys(data.card.trendPrices).length<2){
                this.state.trendPrices = {labels:[""],datasets:[]}
                var datasets = [0]
              }else{
                this.state.trendPrices = {labels:[],datasets:[]}
                var datasets = []
              }
              Object.keys(data.card.trendPrices).forEach(price => {
                if(!isNaN(data.card.trendPrices[price])){
                  this.state.trendPrices.labels.push(price)
                  datasets.push(parseFloat(data.card.trendPrices[price]))
                }
              });
              this.state.trendPrices.datasets.push({
                data:datasets,
                color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
                strokeWidth: 2 // optional
              })
              this.props.route.params.item.trendPrices = this.state.trendPrices;
            }
            this.state.tempUri = data.card.image_uris.art_crop;
            this.state.tempUriBorder = data.card.image_uris.border_crop;
            this.props.route.params.item.image_uris.art_crop = data.card.image_uris.art_crop;
            this.getVersionsCards();
            this.props.pro.noSendModif = true;
            storeData(this.props.pro);
            this.setState({})
          })
          .catch((error) => {
            console.error('net error',error);
          });
    } catch (error) {
      console.error('net error2',error);
    }
  }

  componentDidMount(){
    if(this.state.original==true){
      this.props.navigation.setOptions({title:this.props.route.params.item.name});
    }else{
      this.props.navigation.setOptions({title:this.props.route.params.item.printed_name?this.props.route.params.item.printed_name:this.props.route.params.item.name});
    }
    if(this.props.route.params.noLoadNewImage){
      this.getVersionsCards()
    }else{
      this.sendServerData()
    }
  }

  changeToOriginal = () => {
    if(this.state.original==true){
      this.setState({original:false})
      this.props.navigation.setOptions({title:this.props.route.params.item.printed_name?this.props.route.params.item.printed_name:this.props.route.params.item.name});
    }else{
      this.props.navigation.setOptions({title:this.props.route.params.item.name});
      this.setState({original:true})
    }
  }
  
  svgCreate = (item,set,size=50) => {
    var svg = <View></View>;
    try {
      svg = <SvgUri
        style={styles.innerCircle}
        fill={item.rarity == "uncommon"?"rgba(192,192,192,0.1)":(item.rarity == "rare"?"gold":(item.rarity == "common"?"black":("orange")))}
        stroke="white"
        strokeOpacity={0.5}
        color={item.rarity == "uncommon"?"rgba(192,192,192,0.1)":(item.rarity == "rare"?"gold":(item.rarity == "common"?"black":("orange")))}
        fillOpacity={1}
        width={size}
        height={size}
        uri={set}
      />
    } catch (error) {
      console.log('svg',error)
    }
    return svg;
  }

  trendPricesCreate = (trendPrice) => {
    var trendPriceComponent = <View></View>
    try {
      trendPriceComponent = trendPrice&&trendPrice.labels&&trendPrice.labels.length>0?<LineChart
      style={{paddingTop:50,paddingBottom:30}}
      data={trendPrice}
      verticalLabelRotation={30}
      width={Dimensions.get("window").width}
      height={300}
      yAxisLabel="$  "
      chartConfig={{
        barColors: ["#fff", "#fff", "#fff","#fff", "#fff", "#fff"],
        backgroundColor: "#fff",
        backgroundGradientFrom: "#fff",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#fff",
        backgroundGradientToOpacity: 0,
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, 1)`,
        strokeWidth: 20,
        style: {
          borderRadius: 16
        },
      }}
      bezier
    />:<></>
    } catch (error) {
      console.log(error)
    }
    return trendPriceComponent;
  }

  addItem = () => {
    var dateNow = Date.now();
    this.state.createType[dateNow] = {
      title : this.state.nameCreateDeck,
      cards : {},
      idClient : this.props.pro.idClient,
      vote:0,
      keyCards:{},
      sideCards:{},
      description:"",
      mode:"standard",
    }
    this.toast.show("Deck created", 2000);
    this.props.pro.lastDeckUpdate = dateNow;
    storeData(this.props.pro);
    this.props.setPro({});
    this.setState({dialog:false})
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
      this.toast.show("Card "+card.name+" loved", 2000);
      this.props.pro.loved.push(card.oracle_id);
      this.props.pro.noSendModif = true;
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
          this.toast.show("Card "+card.name+" unloved", 2000);
          if (this.props.pro.loved.indexOf(card.oracle_id) > -1) 
          this.props.pro.loved.splice(this.props.pro.loved.indexOf(card.oracle_id), 1);
          this.props.pro.noSendModif = true;
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

addToDeck = (deck,card) => {
  if(Object.keys(this.props.pro.decks[deck].cards).length<=99){
    this.toast.show("Card added to deck "+this.props.pro.decks[deck].title, 2000);
    this.props.pro.decks[deck].cards[Date.now()] = card;
    this.props.pro.lastDeckUpdate = deck;
    storeData(this.props.pro);
  }else{
    this.toast.show("Max cards reached", 2000);
  }
  //this.props.setPro({});
  //if(this.props.pro.sortFunctionDeck)this.props.pro.sortFunctionDeck.sortFunction()
}

addToWishlist = (wishlist,card) => {
  if(Object.keys(this.props.pro.wishlists[wishlist].cards).length<=99){
    this.toast.show("Card added to wishlist "+this.props.pro.wishlists[wishlist].title, 2000);
    this.props.pro.wishlists[wishlist].cards[Date.now()] = card;
    this.props.pro.noSendModif = true;
    storeData(this.props.pro);
  }else{
    this.toast.show("Max cards reached", 2000);
  }
  //this.props.setPro({});
  //if(this.props.pro.sortFunctionWishlist)this.props.pro.sortFunctionWishlist.sortFunction()
}

addCardCollection = (card) => { 
  if(!this.props.pro.collections.cards[card.oracle_id]){
    this.props.pro.collections.cards[card.oracle_id]=1;
  }else{
    this.props.pro.collections.cards[card.oracle_id]++;
  }
  this.toast.show("Card added into collection ", 2000);
  this.props.pro.collectionsCards.cards[Date.now()] = card
  this.props.pro.noSendModif = true;
  storeData(this.props.pro);
  this.setState({})
  //this.props.setPro({});
  if(this.props.pro.sortFunctionCollection)this.props.pro.sortFunctionCollection.sortFunction()
}

subCardCollection = (card) => {
  if(!this.props.pro.collections.cards[card.oracle_id]){
    this.props.pro.collections.cards[card.oracle_id]=0;
  }else if(this.props.pro.collections.cards[card.oracle_id]>0){
    this.props.pro.collections.cards[card.oracle_id]--;
    var BreakException = {};
    try {
      Object.keys(this.props.pro.collectionsCards.cards).forEach(element => {
        if(this.props.pro.collectionsCards.cards[element].oracle_id == card.oracle_id ){
          delete this.props.pro.collectionsCards.cards[element];
          throw BreakException;
        }
      });
    } catch (e) {
      if (e !== BreakException) throw e;
    }
  }
  this.toast.show("Card deleted from collection ", 2000);
  this.props.pro.noSendModif = true;
  storeData(this.props.pro);
  this.setState({})
  //this.props.setPro({});
  if(this.props.pro.sortFunctionCollection)this.props.pro.sortFunctionCollection.sortFunction()
}

headerRenderForeground = () => {
  return <View>
  
  </View>
}

headerRender = () => {
  return <View>
    <Toast opacity={1} style={{zIndex:99999}} positionValue={10} position='top' textStyle={{color:'white',fontSize:16,fontWeight:"bold",}} ref={(toast) => this.toast = toast}/>
    <ImageModal imageBackgroundColor="#000000" modalImageStyle={{resizeMode:this.state.fullCard?"contain":"contain"}} source={{uri: this.state.fullCard?(this.state.original==true?this.state.tempUriBorder:this.props.route.params.item.image_uris.border_crop):this.state.tempUri}} style={{...styles.image,height:this.state.fullCard?dimensions.height-130:imageHeight}} resizeMode={this.state.fullCard?"contain":"cover"}
    
  /*onOpen={()=>{
    this.setState({tempUri : this.props.route.params.item.image_uris.border_crop})
  }}
  willClose={()=>{
    this.setState({tempUri : this.props.route.params.item.image_uris.art_crop})
  }}*/
  />
  
  {this.state.fullCard?<View></View>:<Text style={{
        position: 'absolute',
        right: 0,
        top: this.state.fullCard?0:imageHeight-25,
        backgroundColor:"rgba(50, 50, 50, 0.5)",
        color:"white",
        padding:3
  }}>By {this.props.route.params.item.artist + " - " + this.props.route.params.item.released_at }</Text>}
  
  <View style={{position:"absolute",right:0,top:0,zIndex:999}}>
    <Animatable.View  animation="rubberBand" delay={500}>
  <Menu closeOnSelect={false}
    onClose={()=>{this.setState({duplicateAction:""})}}
      trigger={(triggerProps) => {
        return (
          <Pressable accessibilityLabel="More options menu" {...triggerProps}>
            <Icon style={{padding:15,zIndex:999}} name="bars" size={30} color="white" />
          </Pressable>
        )
      }}
      >
        {this.state.duplicateAction!=''?<View></View>:<View>
          <Menu.Group title="Deck & Wishlist">
            {Object.keys(this.props.pro.decks).length>0?<Menu.Item onPress={() => {this.setState({duplicateAction:"deck"})}} style={{flexDirection:"row"}}><Image style={{width:20,height:20,margin:0,tintColor:"black"}} source={DecksImg} />  Add to a deck</Menu.Item>:<Menu.Item onPress={()=>{this.setState({duplicateAction:'',dialog:true,createType:this.props.pro.decks})}} style={{flexDirection:"row"}}><Icon name="plus-square" size={20} color="black" />  Create Deck
            </Menu.Item>}
            {Object.keys(this.props.pro.wishlists).length>0?<Menu.Item onPress={() => {this.setState({duplicateAction:"whishlist"})}} style={{flexDirection:"row"}}><Icon name="star" size={20} color="black" />  Add to a whishlist</Menu.Item>:<Menu.Item onPress={()=>{this.setState({duplicateAction:'',dialog:true,createType:this.props.pro.wishlists})}} style={{flexDirection:"row"}}><Icon name="plus-square" size={20} color="black" />  Create Wishlist
        </Menu.Item>}
          </Menu.Group>
          <Menu.Group title={"In collections "+"("+(this.props.pro.collections.cards[this.props.route.params.item.oracle_id]?this.props.pro.collections.cards[this.props.route.params.item.oracle_id]:0)+")"}>
            <Menu.Item onPress={() => {this.addCardCollection(this.props.route.params.item)}} style={{flexDirection:"row"}}><Icon name="plus-square" size={20} color="black" /><Text>  Add to collection</Text></Menu.Item>
            {(this.props.pro.collections.cards[this.props.route.params.item.oracle_id]?this.props.pro.collections.cards[this.props.route.params.item.oracle_id]:0)>0?<Menu.Item onPress={() => {this.subCardCollection(this.props.route.params.item)}} style={{flexDirection:"row"}}><Icon name="minus-square" size={20} color="black" /><Text>  Sub to collection</Text></Menu.Item>:<View></View>}
          </Menu.Group>
          <Menu.Group title="Interact">
            <Menu.Item onPress={() => this.props.pro.loved.includes(this.props.route.params.item.oracle_id)?this.unloved(this.props.route.params.item):this.loved(this.props.route.params.item)} style={{flexDirection:"row"}}><Icon style={{color:(this.props.pro.loved.includes(this.props.route.params.item.oracle_id)?"red":"black")}} name={"heart"} size={20}  /><Text>   {this.props.pro.loved.includes(this.props.route.params.item.oracle_id)?"Unlove":"Love"}</Text></Menu.Item>
          </Menu.Group>
        </View>}

        

        {this.state.duplicateAction=='deck'?
        <Menu.Group title="List Decks">
        {Object.keys(this.props.pro.decks).map((deck)=>{return <Menu.Item onPress={() => {this.setState({duplicateAction:""},()=>{this.addToDeck(deck,this.props.route.params.item)})}} style={{flexDirection:"row"}}><Icon name="copy" size={20} color="black" />  {this.props.pro.decks[deck].title}</Menu.Item>})}
        <Menu.Item onPress={()=>{this.setState({duplicateAction:'',dialog:true,createType:this.props.pro.decks})}} style={{flexDirection:"row"}}><Icon name="plus-square" size={20} color="black" />  Create Deck
        </Menu.Item>
        </Menu.Group>
        :<View></View>}

        {this.state.duplicateAction=='whishlist'?
        <Menu.Group title="List Wishlits">
        {Object.keys(this.props.pro.wishlists).map((wishlist)=>{return <Menu.Item onPress={() => {this.setState({duplicateAction:""},()=>{this.addToWishlist(wishlist,this.props.route.params.item)})}} style={{flexDirection:"row"}}><Icon name="copy" size={20} color="black" />  {this.props.pro.wishlists[wishlist].title}</Menu.Item>})}
        <Menu.Item onPress={()=>{this.setState({duplicateAction:'',dialog:true,createType:this.props.pro.wishlists})}} style={{flexDirection:"row"}}><Icon name="plus-square" size={20} color="black" />  Create Wishlist
        </Menu.Item>
        </Menu.Group>
        :<View></View>}
      </Menu>
      </Animatable.View>
    </View>
  {this.props.pro.set && this.props.pro.set[this.props.route.params.item.set] && !this.state.fullCard && this.props.pro.set[this.props.route.params.item.set].icon && this.props.pro.set[this.props.route.params.item.set].icon != null && this.props.pro.set[this.props.route.params.item.set].icon !="afc" && this.props.pro.set[this.props.route.params.item.set].icon!="gk2"?this.svgCreate(this.props.route.params.item,this.props.pro.set[this.props.route.params.item.set].icon):<></>}
  </View>
}

addIndexToScroll = () => {
  //if(this.state.index<50)
    this.setState({index:this.state.index+10})
}

renderItem = ({item,key}) => (item&&item.image_uris&&item.image_uris.border_crop?<View style={{marginBottom:-Math.round(dimensions.height/9.5)}}>
  <TouchableOpacity style={{backgroundColor:"#28283C",flexDirection:"row"}} onPress={() => {
    this.props.navigation.goBack();
    this.props.navigation.navigate('OneCard', {item: this.deleteDatas(item),noLoadNewImage:true})}}>
    <View style={{margin:7}}>{!this.state.fullCard && this.props.pro.set[item.set].icon && this.props.pro.set[item.set].icon != null && this.props.pro.set[item.set].icon !="afc" && this.props.pro.set[item.set].icon!="gk2"?this.svgCreate(item,this.props.pro.set[item.set].icon,30):<></>}</View>
    <Text style={{color:"white",padding:10,marginLeft:30,fontWeight:"bold",fontSize:14}}>{item.set_name}</Text>
  </TouchableOpacity>
  <View style={{width:Math.round(dimensions.width),flexDirection:"row",alignItems:"center",alignSelf:"center",alignContent:"center"}}>
  {item&&item.image_uris&&item.image_uris.border_crop?<ImageModal imageBackgroundColor="rgba(255,255,255,0)" modalImageStyle={{resizeMode:"contain"}} source={{uri: item.image_uris.border_crop}} style={{width:Math.round(dimensions.width/2.5),height:Math.round(dimensions.height/2.5)}} resizeMode={"contain"}/>:<></>}
  <View style={{justifyContent:"center",padding:20,height:Math.round(dimensions.height/8)}}>
    {item.prices.eur?<View style={{flexDirection:"row"}}><Text style={{color:"white",margin:10,fontWeight:"bold"}}>Non Foil :</Text><Text style={{color:"white",margin:10}}> {item.prices.eur} €</Text></View>:<View></View>}
    {item.prices.eur_foil?<View style={{flexDirection:"row"}}><Text style={{color:"white",margin:10,fontWeight:"bold"}}>Foil : </Text><Text style={{color:"white",margin:10}}>{item.prices.eur_foil} €</Text></View>:<View></View>}
    {item.prices.usd?<View style={{flexDirection:"row"}}><Text style={{color:"white",margin:10,fontWeight:"bold"}}>Non Foil : </Text><Text style={{color:"white",margin:10}}>{item.prices.usd} $</Text></View>:<View></View>}
    {item.prices.usd_foil?<View style={{flexDirection:"row"}}><Text style={{color:"white",margin:10,fontWeight:"bold"}}>Foil : </Text><Text style={{color:"white",margin:10}}>{item.prices.usd_foil} $</Text></View>:<View></View>}
  </View>
</View>
</View>:<></>)

render() {
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
    <Dialog.Container visible={this.state.dialog}>
      <Dialog.Title>Choose name deck</Dialog.Title>
      <Dialog.Input
      placeholder="Tap your name deck"
      style={{width:imageWidth/2,backgroundColor:"white",height:40,color:"black"}}
      onChangeText={(text)=> this.setState({ nameCreateDeck: text })}
      value={this.state.nameCreateDeck}
      >
      </Dialog.Input>
      <Dialog.Button label="Choose" onPress={ ()=>{this.addItem()} }  />
      <Dialog.Button label="Cancel" onPress={ ()=>{this.setState({dialog:false})} }  />
    </Dialog.Container>
  
    <ParallaxScroll style={{marginBottom:80}}
      
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                this.addIndexToScroll();
              }
            }}
            scrollEventThrottle={400}
      headerFixedBackgroundColor="rgba(25, 25, 25, 0)"
      fadeOutParallaxBackground={false}
      fadeOutParallaxForeground={true}
      headerHeight={50}
      isHeaderFixed={false}
      parallaxHeight={this.state.fullCard?dimensions.height-130:imageHeight}
      renderParallaxBackground={({ animatedValue }) => <ImageBackground  blurRadius={1} style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height/2,marginTop:Dimensions.get('window').height/3,resizeMode: 'cover',position:"absolute"}} source={backgroundImg} alt="image base" resizeMode="cover" roundedTop="md" imageStyle= {{opacity:0.1}} />}
      renderParallaxForeground={({ animatedValue }) => this.headerRender()}
      renderHeader={({ animatedValue }) => this.headerRenderForeground(animatedValue)}
      parallaxBackgroundScrollSpeed={10}
      parallaxForegroundScrollSpeed={2}>
          <View style={{marginBottom:80,marginTop:-(this.state.fullCard?dimensions.height-130:imageHeight),zIndex:999}}>
            <View style={{flexDirection:"row",justifyContent:"space-between",paddingBottom:25,backgroundColor:"rgba(25, 25, 25, 1)"}}>
              <Animatable.View  animation="rubberBand" delay={1000}>
                <TouchableOpacity style={{padding:10}} onPress={()=>{this.setState({fullCard:!this.state.fullCard})}}>
                  <Image source={CardBack} style={{tintColor:"white",width:25,height:25}}/>
                </TouchableOpacity>
              </Animatable.View>
              <Text style={{fontWeight:"bold",fontSize:18, paddingTop:10,color:"white",textAlign:"center",width:imageWidth-120}}>{ConvertText(this.props.route.params.item.mana_cost,this.state.original==true?"en":this.props.route.params.item.lang)} {  this.props.route.params.item.type_line}</Text>
              <Animatable.View  animation="rubberBand" delay={1500}>
                <TouchableOpacity onPress={()=>{this.changeToOriginal()}}>
                  <Icon style={{padding:10,zIndex:9999}} name="flag-checkered" size={25} color="white"/>
                </TouchableOpacity>
              </Animatable.View>
            </View>
            <LinearGradient
              colors={['rgba(25, 25, 25, 1)', 'rgba(25, 25, 25, 0)']}
              style={{
              }}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
            {this.state.original==true?<Text style={{padding:30,color:"white"}}>{ConvertText(this.props.route.params.item.oracle_text,this.state.original==true?"en":this.props.route.params.item.lang)}</Text>:(this.props.route.params.item.printed_text ? <Text style={{padding:30,color:"white"}}>{ConvertText(this.props.route.params.item.printed_text,this.state.original==true?"en":this.props.route.params.item.lang)}</Text> : (this.props.route.params.item.oracle_text?<Text style={{padding:30,color:"white"}}>{ConvertText(this.props.route.params.item.oracle_text,this.state.original==true?"en":this.props.route.params.item.lang)}</Text>:<></>))}
            
            <View style={styles.lineStyle}/>
            {DividerLinearFullWidth()}
              {this.props.route.params.item.flavor_text ? <Text style={{fontSize:15, padding:10,color:"white",fontStyle: 'italic'}}>{this.props.route.params.item.flavor_text}</Text> : <></>}
            {DividerLinearFullWidth()}
              </LinearGradient>
              
            <View style={styles.lineStyle}/>
              <SafeAreaView>
              <View style={styles.screenRight}>
                {this.props.route.params.item.power ? <Text style={{borderBottomColor:"white",borderBottomWidth:0.5,padding:10,color:"white",fontSize:20,fontWeight:"bold",fontStyle:"italic"}}>{this.props.route.params.item.power + " / " + this.props.route.params.item.toughness}</Text>:<></>}
              </View>
                {this.props.route.params.item.rarity ? <Text style={{color:"white",paddingLeft:20,paddingBottom:20,paddingTop:30,textDecorationLine: 'underline'}}>Rarity : {this.props.route.params.item.rarity}</Text>:<></>}
                {DividerLinear("Trend Prices")}
                <View style={{flexDirection:"row",textAlign:"center",justifyContent:"center",alignItems:"center",marginTop:-20}}>
                  
                  {this.props.route.params.item.purchase_uris && this.props.route.params.item.purchase_uris.cardmarket ? <Animatable.View  animation="rubberBand" delay={2000}><Text onPress={()=>{Linking.openURL(this.props.route.params.item.purchase_uris.cardmarket)}} style={{color:"gold",padding:10,textDecorationLine: 'underline'}}>Card Market</Text></Animatable.View>:<></>}
                  
                  {this.props.route.params.item.purchase_uris && this.props.route.params.item.purchase_uris.cardhoarder ? <Animatable.View  animation="rubberBand" delay={2250}><Text onPress={()=>{Linking.openURL(this.props.route.params.item.purchase_uris.cardhoarder)}} style={{color:"gold",padding:10,textDecorationLine: 'underline'}}>Card Hoarder</Text></Animatable.View>:<></>}

                  {this.props.route.params.item.purchase_uris && this.props.route.params.item.purchase_uris.tcgplayer ? <Animatable.View  animation="rubberBand" delay={2500}><Text onPress={()=>{Linking.openURL(this.props.route.params.item.purchase_uris.tcgplayer)}} style={{color:"gold",padding:10,textDecorationLine: 'underline'}}>TCG Player</Text></Animatable.View>:<></>}
                </View>

                {this.trendPricesCreate(this.props.route.params.item.trendPrices)}

                
                {DividerLinear("Legalities")}

                <View style={{justifyContent: 'center',
                paddingBottom:40,
                flexDirection: 'row',
                flexWrap: 'wrap',
                flex: 1,}}>
                  {this.props.route.params.item.legalities ? Object.keys(this.props.route.params.item.legalities).map((element)=>{
                    return this.props.route.params.item.legalities[element]=="legal" ?
                    <Center height={10} bg="emerald.900" rounded="md" shadow={3} style={{margin:10,padding:5}}>{element}</Center>
                    :
                    <Center height={10} bg="red.900" rounded="md" shadow={3} style={{margin:10,padding:5}}>{element}</Center>
                  }) : <></>
                  }
                </View>
                

                {DividerLinear("Versions")}

                <View style={{justifyContent:"center"}}>
                  <FlatList
                    data={this.state.versions}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id}
                  />
                  

                </View>


            </SafeAreaView>
          </View>
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
    position: 'absolute',
    left: 0,
    top: 0,
    borderRadius: 5,
    width: 100,
    height: 100,
  },
  backgroundStyle:{
    backgroundColor:"black"
  },
  
  image: {
    width: imageWidth,
    height: imageHeight,
    
},
imageSymbol: {
  flex: 1,
  width: 15,
  height: 15,
},

  screen: {
    flex: 1,
    alignItems: 'center',
  },
  screenRight: {
    fontSize:20,
    flex:1,
    justifyContent:"flex-end",
    alignItems:"flex-end",
    
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
  /*lineStyle:{
    width:"100%",
    borderWidth: 0.5,
    borderColor:'grey',
    marginTop:5,
    marginBottom:5,
    
  },*/
});
  
//Get function
const mapStateToProps = (state) => {
  const {pro} = state;
  return {pro};
};

//Call set functions
const mapDispatchToProps = (dispatch) => bindActionCreators({setPro}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(OneCard);