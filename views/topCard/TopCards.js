import { StyleSheet,Image, ScrollView, View,  TouchableOpacity, Dimensions, ImageBackground,TouchableHighlight} from 'react-native';
import React, { Component } from 'react';
import {
  Text,
  VStack,
  Center,
  Stack,
  Heading,
  Box,
  Select,
  CheckIcon,
  Input,
  Checkbox,
} from "native-base"
import ConvertText from '../services/ConvertText';
import {connect} from 'react-redux';
import {setPro} from '../../redux/ProActions';
import {bindActionCreators} from 'redux';
import LinearGradient from 'react-native-linear-gradient'
import Ripple from 'react-native-advanced-ripple'
import ParallaxScroll from '@monterosa/react-native-parallax-scroll';
import Carousel, { ParallaxImage }  from 'react-native-snap-carousel';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
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

 class TopCards extends Component {
  constructor(properties) {
    super(properties);
    this.state = {
      inputValue: '',
      list: [],
      entries:[
        //{title:'test',text:'test description',thumbnail:''},
        //{title:'test',text:'test description',thumbnail:''}
      ],
      searchDeck:'',
      orderBy:'name',
      pagination:0,
      topDecksResult:{},
      rarity:"",
      notFound:false,
      colors:[],
      filterActive:true,
    };
  }

  componentDidMount(){
    this.searchTopDeck()
  }

  dataBigCard= () =>{
    /*{"arena_id": 77106, "artist": "Jarel Threat", "cardmarket_id": 571299, "cmc": 2, "color_identity": ["W"], "colors": ["B", "W"], "common": 1, "count": 1, "finishes": ["nonfoil", "foil"], "flavor_text": "The weight of this magic weapon falls heavy on the wicked.", "image_uris": {"art_crop": "https://c1.scryfall.com/file/scryfall-cards/art_crop/front/e/8/e882c9f9-bf30-46b6-bedc-379d2c80e5cb.jpg?1627701221", "border_crop": "https://c1.scryfall.com/file/scryfall-cards/border_crop/front/e/8/e882c9f9-bf30-46b6-bedc-379d2c80e5cb.jpg?1627701221"}, "lang": "en", "legalities": {"brawl": "legal", "commander": "legal", "duel": "legal", "future": "legal", "gladiator": "legal", "historic": "legal", "historicbrawl": "legal", "legacy": "legal", "modern": "legal", "oldschool": "not_legal", "pauper": "legal", "paupercommander": "not_legal", "penny": "legal", "pioneer": "legal", "premodern": "not_legal", "standard": "legal", "vintage": "legal"}, "mana_cost": "{1}{W}", "mythic": 0, "name": "+2 Mace", "nombre": 1, "oracle_id": "629fe1be-272d-465f-b9b1-2ce177410f13", "oracle_text": "Equipped creature gets +2/+2.
Equip {3} ({3}: Attach to target creature you control. Equip only as a sorcery.)", "preview": {"previewed_at": "2021-07-01", "source": "Wizards of the Coast", "source_uri": "https://twitter.com/MTG_Arena/status/1410327287317270534"}, "price": 0, "prices": {"eur": "0.04", "eur_foil": "0.15", "tix": "0.01", "usd": "0.02", "usd_etched": null, "usd_foil": "0.10"}, "purchase_uris": {"cardhoarder": "https://www.cardhoarder.com/cards/91504?affiliate_id=scryfall&ref=card-profile&utm_campaign=affiliate&utm_medium=card&utm_source=scryfall", "cardmarket": "https://www.cardmarket.com/en/Magic/Products/Search?referrer=scryfall&searchString=%2B2+Mace&utm_campaign=card_prices&utm_medium=text&utm_source=scryfall", "tcgplayer": "https://shop.tcgplayer.com/product/productsearch?id=243201&utm_campaign=affiliate&utm_medium=api&utm_source=scryfall"}, "rare": 1, "rarity": "common", "released_at": "2021-07-23", "set": "afr", "set_name": "Adventures in the Forgotten Realms", "type_line": "Artifact — Equipment", "uncomon": 1}*/
    Object.keys(this.props.pro.topCards).forEach((deck, itemI)=> {
      this.state.entries = []
      
      var uncomon = 0;
      var common = 0;
      var rare = 0;
      var mythic = 0;
      var price = 0;
      var colors = []
      Object.keys(this.props.pro.topCards).forEach((card, itemI)=> {//console.log(this.props.pro.topCards[card])
        this.state.entries.push({title:this.props.pro.topCards[card].name,text:'',thumbnail:this.props.pro.topCards[card].image_uris.art_crop,setName:this.props.pro.topCards[card].set_name,card:this.props.pro.topCards[card]});
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
          containerStyle={{width:Dimensions.get('window').width,height:Dimensions.get('window').height/2.65,backgroundColor:"rgba(0,0,0,0)",justifyContent:'flex-start',position: 'absolute',top:0,overflow:"hidden"}}
          style={{width:Dimensions.get('window').width+100,height:'100%',resizeMode: 'contain',justifyContent:'flex-start',}}
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


navigateToDeck = (props,item) => {
  props.navigation.navigate(props.oneNavigate, {item: (Object.keys(this.state.topDecksResult).length>0)?this.state.topDecksResult[item]:(props.player?props.use[item]:item),route:props.route,cantUpdate:props.cantUpdate,player:props.player?props.player:undefined,decks:Object.keys(this.state.topDecksResult).length>0?this.state.topDecksResult[item]:this.props.pro.topDecks})
}

searchTopDeck = () => {
  fetch('http://'+this.props.pro.url+'/searchCard', {
    method: 'POST',
    credentials: 'same-origin',
    mode: 'same-origin',
    body: JSON.stringify({"name":this.state.searchDeck,"orderBy":this.state.orderBy,"pagination":this.state.pagination,"rarity":this.state.rarity,"colors":this.state.colors}),
    headers: {
      'Accept':       'application/json',
      'Content-Type': 'application/json'
    }
  }).then((response) => {return response.json();}) 
  .then((datas) => {
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


addIndexToScroll = () => {
  this.setState({pagination:this.state.pagination+6},()=>{this.searchTopDeck()})
}

filterRender = (props,tthis) => {
  return <Animatable.View animation="bounceIn" style={{marginTop:-25}}>{(this.state.filterActive==false?<Animatable.View animation="bounceIn" style={{backgroundColor:"#28283C",borderRadius: 10,margin:2}}>
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
    selectedValue={tthis.state.rarity}
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
    tthis.state.rarity = itemValue
    tthis.searchTopDeck()
  }}
>
  <Select.Item label="All Rarity" value='' />
  <Select.Item label="Common" value="common" />
  <Select.Item label="Uncommon" value="uncommon" />
  <Select.Item label="Rare" value="rare" />
  <Select.Item label="Mythic" value="mythic" />
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
<Icon onPress={()=>{this.setState({filterActive:!this.state.filterActive})}} style={{margin:20,marginTop:10}} name="sort-down" size={30} color="white" /></Animatable.View></TouchableOpacity>)}</Animatable.View>
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
      parallaxForegroundScrollSpeed={1}
      
      onScroll={({nativeEvent}) => {
        if (isCloseToBottom(nativeEvent)){
          this.addIndexToScroll();
        }
      }}
      scrollEventThrottle={400}>
      <ImageBackground  blurRadius={0} style={{width:Dimensions.get('window').width*1.5,height:130,resizeMode: 'cover',marginTop:-(this.state.fullCard?dimensions.height-130:imageHeight)}} source={backgroundImg} alt="image base" resizeMode="cover" roundedTop="md" >
      </ImageBackground>
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
      <Center flex={1} style={{marginBottom:80}}>
        <VStack space={4} flex={1} w="100%" mt={8}>
          <VStack>
          {this.filterRender(props,tthis)}
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
          <View 
            style={{
              justifyContent: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
              flex: 1}}>
            {
            (Object.keys(tthis.state.topDecksResult)).map(function(item, itemI) {
              var cardsTemp = {}
              return  <TouchableOpacity style={{paddingBottom:30}}
                 key={tthis.state.topDecksResult[item].name + itemI.toString()} >
                   <Ripple highlight={true} cancelTolerance={100} color='rgb(255, 255, 255)' onPress={() => { 
                props.navigation.navigate("OneCard", {item: tthis.state.topDecksResult[item],route:props.route,cantUpdate:false})}} >
                     <TouchableOpacity>
          <Box style={{margin:5,borderWidth:0.5,borderColor:"#000"}}  bg='#141519' shadow={5} rounded="lg" width={Dimensions.get('window').width/2.2} height={350}>
          <Image style={{width:Dimensions.get('window').width/2.2,height:150,resizeMode: 'contain',}} source={{uri: tthis.state.topDecksResult[item].image_uris.art_crop}} alt="image base" resizeMode="cover" roundedTop="md" />
          
          <Text color="yellow.400" mx={2} style={{fontWeight:"bold",fontSize:18,textShadowColor: 'rgba(0, 0, 0, 1)',textShadowOffset: {width: 2, height: 2},textShadowRadius: 10,color:tthis.state.topDecksResult[item].rarity == "uncommon"?"silver":(tthis.state.topDecksResult[item].rarity == "rare"?"gold":(tthis.state.topDecksResult[item].rarity == "common"?"darkgrey":("orange")))}} >
          {tthis.state.topDecksResult[item].printed_name && tthis.state.topDecksResult[item].printed_name != "" ? tthis.state.topDecksResult[item].printed_name : tthis.state.topDecksResult[item].name}
          </Text>
          <Stack space={0} p={[1, 1, 1]}>
            <View style={{overflow:"hidden",height:90}}>
              {tthis.state.topDecksResult[item].printed_text ? <Text style={{padding:5,color:"white"}}>{ConvertText(tthis.state.topDecksResult[item].printed_text,tthis.state.topDecksResult[item].lang)}</Text> : (tthis.state.topDecksResult[item].oracle_text?<Text style={{padding:5,color:"white"}}>{ConvertText(tthis.state.topDecksResult[item].oracle_text,tthis.state.topDecksResult[item].lang)}</Text>:<></>)}
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
          <Text style={{fontWeight:"bold",fontSize:18, padding:3,color:"white",textAlign:"left"}}>{ConvertText(tthis.state.topDecksResult[item].mana_cost,tthis.state.topDecksResult[item].lang)}</Text>
          </View>
          <View style={{position:"absolute",bottom:10,right:0,flexDirection:"row"}}>
          {tthis.state.topDecksResult[item].power ? <Text style={{borderBottomColor:"white",borderBottomWidth:0.5,padding:10,color:"white",fontSize:20,fontWeight:"bold",fontStyle:"italic"}}>{tthis.state.topDecksResult[item].power + " / " + tthis.state.topDecksResult[item].toughness}</Text>:<></>}
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