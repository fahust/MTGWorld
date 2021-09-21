import { StyleSheet,Image, Text, ScrollView, View, SafeAreaView, Dimensions, ImageBackground,TouchableOpacity,TextInput,FlatList } from 'react-native';
import React, { Component } from 'react';
import { Radio,Input} from "native-base"
import ConvertText from '../services/ConvertText';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient'
import DividerLinearFullWidth from '../services/DividerLinearFullWidth';
import { SvgUri } from 'react-native-svg';
import { width } from 'styled-system';
import { TouchableHighlight } from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import {setPro} from '../../redux/ProActions';
import {bindActionCreators} from 'redux';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 250;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

 class AllSets extends Component {
  constructor(properties) {
    super(properties);
    this.state = {
      index:20,
      search:'',
      sets:{}
    };
  }

  componentDidMount(){
    Object.keys(this.props.pro.setSorted).forEach(set => {
      if(this.props.pro.setSorted[set] && this.props.pro.setSorted[set].name)
      this.state.sets[set] = {n:this.props.pro.setSorted[set].name.charAt(0).toUpperCase() + this.props.pro.setSorted[set].name.slice(1),svg:this.props.pro.setSorted[set].svg,child:this.props.pro.setSorted[set].child}
    });
    this.setState({})
  }

    renderItem = (set) => (<>
    <TouchableHighlight onPress={()=>{
        this.props.navigation.navigate("oneSet", {set: set,route:this.props.route,cantUpdate:true,player:this.props.player?this.props.player:undefined,navigation:this.props.route.params.navigation})
      }} style={{alignContent:"flex-start",alignItems:"flex-start",alignSelf:"flex-start"}} key={set.item}>
        <>
        <View style={{flexDirection:'row',width:Dimensions.get('window').width/1.3,}}>
        {this.state.sets[set.item].svg?<SvgUri
        style={{...styles.innerCircle,marginLeft:10,alignSelf:"center",alignItems:"center",alignContent:"center",color:"white"}}
          fill={"white"}
          fillAll={"white"}
          stroke="white"
          strokeOpacity={1}
          color={"white"}
          fillOpacity={1}
          width="25"
          height="25"
          uri={this.state.sets[set.item].svg}
      />:<></>}
        <Text style={styles.textLabel}>{this.state.sets[set.item].n}</Text></View>
      {DividerLinearFullWidth()}
      </>
      </TouchableHighlight>
      {/*Object.keys(this.state.sets[set.item].child).map((child)=>{
        return <TouchableHighlight onPress={()=>{
          this.props.navigation.navigate("oneSet", {set: set,route:this.props.route,cantUpdate:true,player:this.props.player?this.props.player:undefined,navigation:this.props.route.params.navigation})
        }} key={child} style={{alignContent:"flex-start",alignItems:"flex-start",alignSelf:"flex-start",marginLeft:10}}>
          <>
          <View style={{flexDirection:'row',width:Dimensions.get('window').width/1.3,}}>
            
          <Text style={{color:"white",paddingTop:10,paddingLeft:10,fontSize:16,fontWeight:"bold"}}>|___</Text>
          {this.state.sets[set.item].child[child].svg?<SvgUri
          style={{...styles.innerCircle,marginLeft:10,alignSelf:"center",alignItems:"center",alignContent:"center",color:"white"}}
            fill={"white"}
            fillAll={"white"}
            stroke="white"
            strokeOpacity={1}
            color={"white"}
            fillOpacity={1}
            width="25"
            height="25"
            uri={this.state.sets[set.item].child[child].svg}
          />:<></>}
        
          <Text style={{...styles.textLabel,fontWeight:"100",fontSize:16}}>{this.state.sets[set.item].child[child].name}</Text></View>
        {DividerLinearFullWidth()}
        </>
        </TouchableHighlight>
          })*/}
      </>
    )

  render(){
      
    const dimensions = Dimensions.get('window');
    const imageHeight = Math.round(dimensions.width * 9 / 16);
    const imageWidth = dimensions.width;
        
      var indexable = 0;
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
        <ImageBackground  blurRadius={1} style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height/2,marginTop:Dimensions.get('window').height/3,resizeMode: 'cover',position:"absolute"}} source={backgroundImg} alt="image base" resizeMode="cover" roundedTop="md" imageStyle= {{opacity:0.1}} />
          <View style={{marginBottom:80}} >
            <FlatList
              data={Object.keys(this.state.sets)}
              renderItem={this.renderItem}
              keyExtractor={item => item.id}
            />
          </View>
        </LinearGradient>
      );
  }

 }


 const styles = StyleSheet.create({
   textLabel:{
    color:"white",padding:15,fontSize:18,fontWeight:"bold"
   },
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

export default connect(mapStateToProps, mapDispatchToProps)(AllSets);
