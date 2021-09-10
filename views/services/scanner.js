import { StyleSheet,Image, Text, ScrollView, View, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import React, { useState } from 'react';
import TesseractOcr, { LANG_FRENCH, LANG_ENGLISH, LEVEL_WORD, LANG_VIETNAMESE, LEVEL_BLOCK  } from 'react-native-tesseract-ocr';
import {
  Button,
  Stack,
} from "native-base"




export default function App() {
    const [image, setImage] = useState();
    const [result, setResult] = useState();
    const [imageCard, setImageCard] = useState();
    const [oneTime, setOneTime] = useState();
    const [searching, setSearching] = useState();
    const [currentCard, setCurrentCard] = useState();
    const [currentDeck, setCurrentDeck] = useState({});

    const addToDeck= (card) =>{
      setCurrentDeck({[currentCard.card_back_id]:currentCard})
      //currentDeck[currentCard.card_back_id] = currentCard;
    }

    const recognizeTextFromImage = async (path) => {
  
      try {
        const tesseractOptions = {level:LEVEL_BLOCK,denylist:'1234567890\'!"#$%&/()={}[]+*-_:;<>«»‹›“”„‘’…¿?¡¨´`^ˆ~˜¸•|¦—–-@',
        blacklist: '1234567890\'!"#$%&/()={}[]+*-_:;<>«»‹›“”„‘’…¿?¡¨´`^ˆ~˜¸•|¦—–-@'};
        /*var recognizedText = await TesseractOcr.recognize(
          path.replace('file://', ''),
          LANG_FRENCH,
          tesseractOptions,
        );*/
        
        TesseractOcr.recognize(path.replace('file://', ''), LANG_FRENCH, tesseractOptions).then(response => setResult(response));
        
        ;
      } catch (err) {
        setResult(err.message );
        console.log('error tesseract')
      }
    };

    const onImageSelect = async (media) => {
        if (!media.didCancel) {
            await setImage(media.assets[0].uri);
            await recognizeTextFromImage(media.assets[0].uri);
        }
      };

      

    /*const onTakePhoto = () => ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      onImageSelect(image)
    });*/

    const onTakePhoto = () => launchCamera({ mediaType: 'image',quality:1,videoQuality:'high',imageQuality: 100,
    width : 4000,
    height : 8000,
    maxHeight: 4000,
    maxWidth: 8000, }, onImageSelect);

    const onSelectImagePress = () => launchImageLibrary({ mediaType: 'image',quality:1 }, onImageSelect);

  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>Scan Card</Text>

      <ScrollView>
        <Stack direction={{ base: "column", md: "row", }} space={2} mx={{ base: "auto", md: 0, }} >
          <Button colorScheme="dark" size="sm" onPress={onTakePhoto}>Récuperer depuis votre camera</Button>
          <Button colorScheme="dark" size="sm" onPress={onSelectImagePress}>Récuperer depuis une image</Button>
          <Button colorScheme="dark" size="sm" onPress={addToDeck}>Ajouter a votre deck</Button>

      </Stack>
            
        <Image source={{uri: image}} style={styles.image} resizeMode="contain" />
        
        <View style={{marginTop: 30}}>
            <Text style={{fontSize: 30,color:"white"}}>{result}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
      marginVertical: 40,
      color:"white"
    },
    button: {
      padding:20,
      marginTop: 20,
      marginBottom: 20,
    },
    buttonText: {
      color: '#fff',
    },
  });