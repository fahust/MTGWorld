import { StyleSheet,Image, Text, ScrollView, View, SafeAreaView, Dimensions, ImageBackground,TouchableOpacity,TextInput } from 'react-native';
import React, { Component } from 'react';
import { Radio,Input} from "native-base"
import ConvertText from '../services/ConvertText';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient'
import DividerLinearFullWidth from '../services/DividerLinearFullWidth';
import { SvgUri } from 'react-native-svg';
import { width } from 'styled-system';

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

 class AddcardFilter extends Component {
  constructor(properties) {
    super(properties);
    this.state = {
      index:20,
      search:'',
    };
  }
  
    filterSelect = () => {
      var indexable = 0;
      return <View>
      {this.props.route.params.type=="set"?<Input
        style={{height:50,margin:10,width:Dimensions.get('window').width-60,color:"white"}}
        width={Dimensions.get('window').width}
        color="white"
          autoCapitalize="none"
          placeholder="Search"
          underlineColorAndroid='rgba(0, 0, 0, 0)'
          value = {this.state.search}
          onChangeText={search => this.setState({search: search,index:20})}
        />:<></>}
        <Radio.Group
        defaultValue={this.props.route.params.value}
        name="myRadioGroup"
        accessibilityLabel="Pick your favorite number"
        onChange={(value) => {
          this.props.route.params.setFilter(this.props.route.params.type,value)
        }}
      >
        {Object.keys(this.props.route.params.filter[this.props.route.params.type]).map((filter,key)=>{
          if(indexable<this.state.index && (this.state.search == '' || similarity(this.state.search,this.props.route.params.filter[this.props.route.params.type][filter].n)>0.3)){
            indexable++
            return <View style={{alignContent:"flex-start",alignItems:"flex-start",alignSelf:"flex-start"}}><Radio value={filter} colorScheme="purple">
              <View style={{flexDirection:'row',width:Dimensions.get('window').width/1.3,}}>
              {this.props.route.params.filter[this.props.route.params.type][filter].svg?<SvgUri
              style={{...styles.innerCircle,marginLeft:10,alignSelf:"center",alignItems:"center",alignContent:"center",color:"white"}}
                fill={"white"}
                fillAll={"white"}
                stroke="white"
                strokeOpacity={1}
                color={"white"}
                fillOpacity={1}
                width="25"
                height="25"
                uri={this.props.route.params.filter[this.props.route.params.type][filter].svg}
            />:<></>}
              <Text style={styles.textLabel}>{this.props.route.params.filter[this.props.route.params.type][filter].n=="Select"?"None":(this.props.route.params.type=="cost"?"":this.props.route.params.filter[this.props.route.params.type][filter].n)}</Text></View></Radio>
            {DividerLinearFullWidth()}
            </View>
          }
            
        })}
      </Radio.Group>
    </View>
    }

    addIndexToScroll = () => {
      //if(this.state.index<50)
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
        <ImageBackground  blurRadius={1} style={{width:Dimensions.get('window').width,height:Dimensions.get('window').height/2,marginTop:Dimensions.get('window').height/3,resizeMode: 'cover',position:"absolute"}} source={backgroundImg} alt="image base" resizeMode="cover" roundedTop="md" imageStyle= {{opacity:0.1}} />
        <View style={{marginBottom:80}} >

          <ScrollView style={{marginBottom:5}}
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                this.addIndexToScroll();
              }
            }}
            scrollEventThrottle={400}>
              <View style={{padding:20,backgroundColor:"rgba(0,0,0,0)"}}>
                {this.filterSelect()}
              </View>
          </ScrollView>
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

export default AddcardFilter;
