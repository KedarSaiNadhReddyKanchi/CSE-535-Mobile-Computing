/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState ,useEffect } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  NativeModules,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StarRating from 'react-native-star-rating';
import {Picker} from '@react-native-picker/picker';
import SQLite from 'react-native-sqlite-storage';
import callRespiratoryCalculator from "@components/RespiratoryRates";
import heartratevideo from '@components/heartrateprovidedvideo.mp4';
import Video from 'react-native-video';
import { accelerometer } from "react-native-sensors";
import { setUpdateIntervalForType, SensorTypes } from "react-native-sensors";
import {RNCamera} from 'react-native-camera';
const { PixelColorExtractorModule } = NativeModules;
const { VideoFrameExtractorModule } = NativeModules;
const { FrameExtractorAsyncTaskModule } = NativeModules;
const { CSVAsyncFileReaderModule } = NativeModules;

type SectionProps = PropsWithChildren<{
  title: string;
}>;

const databaseName = 'myLocalDatabase.db';
const databaseVersion = '1.0';
const databaseDisplayname = 'My Local Database';
const databaseSize = 200000;

const db = SQLite.openDatabase(
  databaseName,
  databaseVersion,
  databaseDisplayname,
  databaseSize
);

const createTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS CSE535MobileComputingProject1 (' +
        'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
        'HeartRateSensing INTEGER DEFAULT 0,' +
        'RespiratoryRate INTEGER DEFAULT 0,' +
        'Nausea INTEGER DEFAULT 0,' +
        'Headache INTEGER DEFAULT 0,' +
        'Diarrhea INTEGER DEFAULT 0,' +
        'SoarThroat INTEGER DEFAULT 0,' +
        'Fever INTEGER DEFAULT 0,' +
        'MuscleAche INTEGER DEFAULT 0,' +
        'LossOfSmellOrTaste INTEGER DEFAULT 0,' +
        'Cough INTEGER DEFAULT 0,' +
        'ShortnessOfBreath INTEGER DEFAULT 0,' +
        'FeelingTired INTEGER DEFAULT 0' +
        ');'
    );
  });
};

const insertData = (values) => {
  db.transaction(tx => {
    tx.executeSql(
      'INSERT INTO CSE535MobileComputingProject1 (HeartRateSensing, RespiratoryRate, Nausea, Headache, Diarrhea, SoarThroat, Fever, MuscleAche, LossOfSmellOrTaste, Cough, ShortnessOfBreath,  FeelingTired) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
      values
    );
  });
  console.log("values inserted into the database from the database helper file");
};

const fetchCurrentData = (callback) => {
//   db.transaction(tx => {
//     tx.executeSql(
//       'SELECT * FROM CSE535MobileComputingProject1 ORDER BY id DESC LIMIT 1;',
//       [],
//       (_, { rows }) => callback(rows.item(0))
//     );
//   });
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM CSE535MobileComputingProject1 ORDER BY id DESC;',
      [],
      (_, { rows }) => {
      const length = Object.keys(rows).length;
      console.log("data length from the table is = ", length);
      for (let i = 0; i < length; i++) {
        console.log(rows.item(i));
      }

      callback(rows)
      }
    );
  });
};

let databaseEntries = {};

function Section({children, title}: SectionProps): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();




// const getCSV = () => {
// console.log("coming to the csv file parser function");
//     Papa.parse("CSVBreathe19.csv", {
//       header: false,
//       download: true,
//       skipEmptyLines: true,
//       delimiter: ",",
//       complete: (results: ParseResult<Data>) => {
//         setValues(results);
//         console.log(results);
//       },
//     })
//   };

//       const readLocalFile = async () => {
//         try {
//           const filePath = './assets/CSVBreathe19.csv'; // Adjust the path
//           const response = await fetch(filePath);
//           const content = await response.text();
//           setFileContent(content);
//         } catch (error) {
//           console.error('Error reading file:', error);
//         }
//       };

//   const readCSVFile = async () => {
//   console.log("coming to the readCSVFile function");
//   console.log('Document Directory Path:', RNFS.MainBundlePath );
// //         console.log("csvData " , csvData );
//         try {
//           //const filePath = RNFS.MainBundlePath  + '/CSVBreathe19.csv'; // Replace 'data.csv' with your actual file name
//           //const filePath = '/assets/CSVBreathe19.csv';
//           //const fileContent = await RNFS.readFile(filePath, 'utf8');
//           //const fileContent = await RNFS.readFileAssets(filePath, 'utf8');
// const filePath = RNFS.MainBundlePath + '/assets/CSVBreathe19.csv'; // Adjust the path and file name
//         const fileContent = await RNFS.readFile(filePath, 'utf8');
// console.log("contents of the file");
// console.log(fileContent);
// //           setCsvData(fileContent);
//         } catch (error) {
//           console.error('Error reading CSV file:', error);
//         }

//   RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
//     .then((result) => {
//       console.log('GOT RESULT', result);
//
//       // stat the first file
//       //return Promise.all([RNFS.stat(result[0].path), result[0].path]);
//     })
//     .then((statResult) => {
//         if (statResult[0].isFile()) {
//           // if we have a file, read it
//           console.log("statResult :" , statResult)
//           return RNFS.readFile(statResult[1], 'utf8');
//         }
//
//         return 'no file';
//       })
//       .then((contents) => {
//         // log the file contents
//         console.log("contents of the file");
//         console.log(contents);
//       })
//     .catch((err) => {
//         console.log(err.message, err.code);
//       });

// const filePath = "D://ASU MS IN CS COURSE CONTENT AND ALL//SEMESTERS COURSES CONTENT//FALL 2023//CSE 535 MOBILE COMPUTING//PROJECT 1//projectassignmentone//CSVBreathe19.csv";
// RNFS.readFile(filePath, 'ascii').then(res => {
//    console.log("result from the file");
//    console.log(res);
// })
// .catch(err => {
//     console.log(err.message, err.code);
// });

//};

// React.useEffect(() => {
//     readCSVFile();
//     //readLocalFile();
//   }, [])


const HomeScreen = ({navigation}) => {

      const homeScreenStyles = StyleSheet.create({
  capture: {
    flex: 0,
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 15,
    alignSelf: 'center',
    alignItems: "center",
  },
        bottomView: {
          width: '100%',
          height: 50,
          backgroundColor: 'green',
          justifyContent: 'center',
          alignItems: 'center',
          bottom: 0, //Here is the trick
          position: "absolute",
          flex: 0,
        },
          textStyle: {
            color: '#fff',
            fontSize: 18,
          },
            respiratoryRateButton: {
              backgroundColor: '#33B2FF',
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 8,
              flex: 0,
              justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
            },
            respiratoryRateButtonText: {
              color: 'white',
              fontSize: 18,
            },
  loginPageContainer: {
    flex: 1,
    backgroundColor: "#EAF2F8",
    flexDirection: 'column',
//     rowGap: 30
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  inputContainer: {
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    padding: 10,
    fontSize: 16,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
    video: {
      width: 300,
      height: 100,
    },
        cameraContainer: {
          flex: 1,
          backgroundColor: 'transparent',
        },
          cameraPreview: {
            flex: 1,
            overflow: 'hidden',
          },
            buttonContainer: {
              flex: 0,
              justifyContent: 'center',
              alignItems: 'center',
            },
            headerContainer: {
            flex : 1,
            top: 0,
            alignItems: 'center',
            },
            addingMarginTop : {
            marginTop: 20,
            }
      });



const [showGoToSymptomsPage, setGoToSymptomsPage] = useState(true)

  const [userDetails, setUserDetails] = useState({
      heart_rate: "",
      respiratory_Rate: "",
    });

      const [accelerometerSensorDetails, setAccelerometerSensorDetails] = useState({
          valuesX: [],
          valuesY: [],
          valuesZ: []
        });

    const [isCalculatingTheRespiratoryData , setLoader] = useState(false);
      const [recording, setRecording] = useState(false);
      const [processing, setProcessing] = useState(false);
      const [cameraReference, setCameraReference] = useState('');
      const [frameInterval , setFrameInterval ] = useState('');
      const [capturingFrame , setCapturingFrame] = useState(false);
      let captureInterval;
      let videoRef = React.createRef();

  const captureFrame = async () => {
    if (cameraReference) {
      try {
        const options = { quality: 0.1 };
        const data = await cameraReference.takePictureAsync(options);
        console.log(" cameraReference data ");
        console.log(data);
      } catch (error) {
        console.error('Error capturing frame:', error);
        setRecording(false);
        clearInterval(captureInterval);
      }
    }
  };

  const takePhoto = async () => {
    if(cameraReference) {
        try {
//         setCapturingFrame(true);
//         const options = {quality : 0.5 , doNotSave : true};
//         const data = await cameraReference.takePictureAsync(options);
//         await cameraReference.pausePreview();
        // return data;
        for (let i = 0 ; i < 5; i++) {
            const options = {quality : 0.5 , doNotSave : true , base64: true};
                    const data = await cameraReference.takePictureAsync(options);
        console.log("FOR LOOP : returned data for iteration - " , i);
        console.log(data);
        await getPixelColor(data.base64 , 50 , 50);
        }
        await stopRecording();

        } catch (error) {
                  console.warn('Error capturing photo:', error);
        clearInterval(captureInterval);
        setCapturingFrame(false);
        await stopRecording();
        } finally {
                   setCapturingFrame(false);
                   await cameraReference.resumePreview();
                 }
    }
  };

  const getPixelColor = async (base64String, x, y) => {
    try {
    // PixelColorExtractorModule
    const colorInfo = await PixelColorExtractorModule.getPixelColorFromBase64(base64String, x, y);
      console.log("colorInfo");
      console.log(colorInfo);
    } catch (error) {
      console.error('Error getting pixel color:', error);
    }
  };


  const startRecording = async () => {
    setRecording(true);
    await takePhoto();
//     console.log("returned data from the async takePhoto function is ");
//     console.log(photo);
//     await cameraReference.resumePreview();
//     captureInterval = setInterval(async () => {
//     if(!capturingFrame){
//             const newPhoto = await takePhoto();
//                 console.log("returned data from the async takePhoto function called within the interval method is  ");
//                 console.log(newPhoto);
//                 await cameraReference.resumePreview();
//     }
//
//     } , 2000);

//     captureInterval = setInterval(() => {
//             captureFrame();
//           }, 2000);

//     setTimeout(() => {
// let frameInterval = setInterval(captureFrame, 1500);
//     setFrameInterval(frameInterval);
//         }, 3000);

    //const { uri, codec = "mp4" } = await cameraReference.recordAsync();
    //setRecording(false);
    //setProcessing(true);

    console.log("recorded data from the camera : (step 1");
    //const type = `video/${codec}`;
    //const data = new FormData();
//     data.append("video", {
//       name: "mobile-video-upload",
//       type,
//       uri
//     });
    //console.log("recorded type from the camera : ", type);
    //console.log("recorded video is saved in the following path data from the camera : ", uri);
    //setProcessing(false);

  };

    const stopRecording = async () => {
      await cameraReference.stopRecording();
      clearInterval(captureInterval);
      setRecording(false);
      setProcessing(true);
      setCapturingFrame(false);
          await setTimeout(() => {
setProcessing(false);
              }, 3000);
    }

    let button = (
        <TouchableOpacity
          onPress={startRecording}
          style={homeScreenStyles.capture}
        >
          <Text style={{ fontSize: 14, color: "white" }}> Measure Heart Rate </Text>
        </TouchableOpacity>
      );

      if (recording) {
        button = (
          <TouchableOpacity
            onPress={stopRecording}
            style={homeScreenStyles.capture}
          >
            <Text style={{ fontSize: 14, color: "white" }}> STOP </Text>
          </TouchableOpacity>
        );
      }

      if (processing) {
        button = (
          <View style={homeScreenStyles.capture}>
            <ActivityIndicator animating size={18} />
          </View>
        );
      }

    const runAccelerometerSensorToCollectTheData = async () => {
    console.log("Accelerometer");
    console.log(accelerometer)
    setUpdateIntervalForType(SensorTypes.accelerometer, 100);
    const subscription = accelerometer.subscribe(({ x, y, z, timestamp }) => {
      console.log({ x, y, z, timestamp });
      const updatedArrayX = accelerometerSensorDetails.valuesX.push(x);
      const updatedArrayY = accelerometerSensorDetails.valuesY.push(y);
      const updatedArrayZ = accelerometerSensorDetails.valuesZ.push(z);
setUserDetails(() => ({
                                   valuesX: updatedArrayX,
                                   valuesY: updatedArrayY,
                                   valuesZ: updatedArrayZ
                          }));

      console.log(accelerometerSensorDetails);
    });
    await setTimeout(() => {
      // If it's the last subscription to accelerometer it will stop polling in the native API
      subscription.unsubscribe();
    }, 1000);
    };



const callRespiratoryCalculatorFunction = async () => {

    setLoader(true);

    await runAccelerometerSensorToCollectTheData();

    await setTimeout(async () => {
        //                       const returned_respiratory_Rate_value = await callRespiratoryCalculator();
        //                       returned_respiratory_Rate_value.then(() => {
        //                                             console.log("returned_respiratory_Rate_value is = ", returned_respiratory_Rate_value);
        //                                             setUserDetails(prevDetails => ({
        //                                                   ...prevDetails,
        //                                                   respiratory_Rate: returned_respiratory_Rate_value.toString()
        //                                                 }));
        //                                             databaseEntries["RespiratoryRate"] = returned_respiratory_Rate_value;
        //                                             //console.log(databaseEntries);
        //                                             setLoader(false);
        //                       }).catch((err) => {
        //                                    console.log(err.message, err.code);
        //                                    });


        CSVAsyncFileReaderModule.readCSVFile((error, respiratory_rate) => {
            if (error) {
                console.error('Error extracting frames:', error);
            } else {
                // Process 'frames' which contains frame information and pixel values
                console.log('Extracted respiratory_rate:', respiratory_rate);
                respiratory_rate = parseInt(respiratory_rate)
                setUserDetails(prevDetails => ({
                    ...prevDetails,
                    respiratory_Rate: respiratory_rate.toString()
                }));
                databaseEntries["RespiratoryRate"] = respiratory_rate;
                console.log(databaseEntries);
                setLoader(false);
            }
        })


    }, 1000);
};



    const newFrameCaptureMethod = async () => {
    setShowAlertMessage(true);
//     console.log("videoRef is ");
//     console.log(videoRef);
//     let response = await videoRef.save();
//     let path = response.uri;
//     console.log("videoRef path is ");
//         console.log(path);
FrameExtractorAsyncTaskModule.extractFrames((error, frames) => {
    if (error) {
        console.error('Error extracting frames:', error);
    } else {
        // Process 'frames' which contains frame information and pixel values
        console.log('Extracted frames:', frames);
                              setUserDetails(prevDetails => ({
                                    ...prevDetails,
                                    heart_rate: (frames)
                                  }));
        databaseEntries["HeartRateSensing"] = parseInt(frames);
        setShowAlertMessage(false);
    }
});
    }

    const [showAlertMessage , setShowAlertMessage] = useState(false);

  return (
  <SafeAreaView style={homeScreenStyles.loginPageContainer}>
     {/* < <SafeAreaView style={homeScreenStyles.headerContainer}>*/}
        {/* < <Text style={homeScreenStyles.title}>User Heart and Respiratory Rates</Text>*/}
       {/* <  </SafeAreaView>*/}
{/* <Text style={homeScreenStyles.title}>User Heart and Respiratory Rates</Text>*/}

<SafeAreaView>
 <Video 
 source={heartratevideo}
 resizeMode="cover"
 controls={true}
 paused={false}
 repeat={true}
 volume={1}
 ref={(ref) => {
    videoRef = ref
 }}
 style={{height: 200 , marginBottom: 25 , marginLeft: "1%" , marginRight: "1%"}}
 />
 </SafeAreaView>

{/* <SafeAreaView> */}
{/* <Video */}
{/*         source={require('@components/heartrateprovidedvideo.mp4')} */}
{/*         style={homeScreenStyles.video} */}
{/*         controls={true} */}
{/*       /> */}
{/* </SafeAreaView> */}

{/*       <SafeAreaView style={homeScreenStyles.cameraContainer}>
        <RNCamera
          ref={ref => {
            setCameraReference(ref)
          }}
          captureAudio={false}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          style={homeScreenStyles.cameraPreview}
          ratio="4:3"
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
      </SafeAreaView>

            <SafeAreaView style={[homeScreenStyles.buttonContainer , {marginTop: 10}]}>
              {button}
            </SafeAreaView>
*/}

{/*
<SafeAreaView style={homeScreenStyles.buttonContainer}>
        <TouchableOpacity style={homeScreenStyles.respiratoryRateButton}>
                          <Text style={homeScreenStyles.respiratoryRateButtonText}>Measure Heart rate</Text>
                        </TouchableOpacity>
</SafeAreaView>
*/}

<SafeAreaView style={homeScreenStyles.respiratoryRateButton}>
<TouchableOpacity onPress={newFrameCaptureMethod}>
                          <Text style={homeScreenStyles.respiratoryRateButtonText}>
                          Measure Heart rate
                          </Text>
                        </TouchableOpacity>
            </SafeAreaView>

{showAlertMessage && (
           <SafeAreaView style={{justifyContent: "center" , alignItems: "center"}}>
           <Text style={{color: "red"}}>*Heart Rate is being Calculated in the background*</Text>
           </SafeAreaView>
            )}



      <SafeAreaView style={[homeScreenStyles.inputContainer , homeScreenStyles.addingMarginTop]}>
        <TextInput
          style={homeScreenStyles.input}
          placeholder="Heart Rate Calculated"
          name="heartrate"
          value={userDetails.heart_rate}
          editable={false}
        />
</SafeAreaView>

<SafeAreaView style={homeScreenStyles.respiratoryRateButton}>
<TouchableOpacity
onPress={callRespiratoryCalculatorFunction}
>
                          <Text style={homeScreenStyles.respiratoryRateButtonText}>
                          Measure Respiratory rate
                          {isCalculatingTheRespiratoryData && (
     <ActivityIndicator animating size={30} color="#00ff00" style={{marginLeft: 10, marginTop: 10}}/>
                          )}

                          </Text>
                        </TouchableOpacity>
            </SafeAreaView>


  <SafeAreaView style={[homeScreenStyles.inputContainer , homeScreenStyles.addingMarginTop]}>
        <TextInput
          style={homeScreenStyles.input}
          placeholder="Respiratory Rate Calculated"
          name="respiratoryRate"
          value={userDetails.respiratory_Rate}
          editable={false}
        />
      </SafeAreaView>

      {showGoToSymptomsPage && (
            <SafeAreaView style={[homeScreenStyles.bottomView, homeScreenStyles.addingMarginTop]}>
                        <TouchableOpacity
          onPress={() => navigation.navigate('Symptoms' , {})}
                        >
                           <Text style={homeScreenStyles.textStyle}>Go to Symptoms Page</Text>
                        </TouchableOpacity>

                          </SafeAreaView>
            )}
    </SafeAreaView>
  );


};

const SymptomsScreen = ({navigation, route}) => {

const [selectedOption, setSelectedOption] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [showStarRating, setShowStarRating] = useState(false);
  const [showUploadAllSymptoms, setUploadAllSymptoms] = useState(false);

  const handleOptionChange = (value , index) => {
    setSelectedOption(value);
    if (value in databaseEntries) {
    setSelectedRating(databaseEntries[value]);
    } else {
    setSelectedRating(0); // Reset selected rating
    }

    setShowStarRating(value !== ''); // Show star rating only if an option is selected
    setUploadAllSymptoms(value !== '');
  };

  const handleRatingChange = (rating) => {
    setSelectedRating(rating);
  };

  const handleUploadSymptoms = () => {
    // Create and store the entry in the database
    const entry = {
      option: selectedOption,
      rating: selectedRating,
      // Add other key-value pairs as needed
    };
    databaseEntries[selectedOption] = selectedRating

    // Here you would implement the database storage logic
    // For demonstration purposes, we'll just log the entry
    console.log('Upload Entry:', entry);
    console.log('databaseEntries:', databaseEntries);
  };

  const handleUploadAllSymptoms = () => {
  const list_of_symptoms = [
  "HeartRateSensing",
  "RespiratoryRate",
  "Nausea",
  "Headache",
  "Diarrhea",
  "SoarThroat",
  "Fever",
  "MuscleAche",
  "LossOfSmellOrTaste",
  "Cough",
  "ShortnessOfBreath",
  "FeelingTired"
  ];
    var values = [];
    list_of_symptoms.forEach((property) => {
        if (property in databaseEntries) {
          values.push(databaseEntries[property]);
          } else {
          values.push(0);
          }
    });

        insertData(values);
        console.log("from the app main file --> values inserted into the database");

        fetchCurrentData((data) => {
  //                   setCurrentData(data);
                    console.log("data from the table is");
                    console.log(data);
                  });
  }

    const symptomsScreenStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "#EAF2F8",
    },
    picker: {
      width: 200,
      marginBottom: 20,
    },
    uploadButton: {
      backgroundColor: '#3498db',
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
    },
    uploadButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
      bottomView: {
        width: '100%',
        height: 50,
        backgroundColor: 'green',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute', //Here is the trick
        bottom: 0, //Here is the trick
      },
        textStyle: {
          color: '#fff',
          fontSize: 18,
        },
    });

  return (
    <View style={symptomsScreenStyles.container}>
    <Text>Symptoms Logging Page.</Text>
    <Text>Please select what Symptoms you do have </Text>
    <Text>and select an appropriate rating in terms of severity.</Text>
   <Picker
              selectedValue={selectedOption}
              onValueChange={(itemValue , itemIndex) => handleOptionChange(itemValue , itemIndex)}
              style={symptomsScreenStyles.picker}
            >
              <Picker.Item label="Select an option" value="" />
              <Picker.Item label="Nausea" value="Nausea" />
              <Picker.Item label="Headache" value="Headache" />
              <Picker.Item label="Diarrhea" value="Diarrhea" />
              <Picker.Item label="SoarThroat" value="SoarThroat" />
              <Picker.Item label="Fever" value="Fever" />
              <Picker.Item label="MuscleAche" value="MuscleAche" />
              <Picker.Item label="LossOfSmellOrTaste" value="LossOfSmellOrTaste" />
              <Picker.Item label="Cough" value="Cough" />
              <Picker.Item label="ShortnessOfBreath" value="ShortnessOfBreath" />
              <Picker.Item label="FeelingTired" value="FeelingTired" />

            </Picker>

       {showStarRating && (
               <StarRating
                 disabled={false}
                 maxStars={5}
                 rating={selectedRating}
                 selectedStar={(rating) => handleRatingChange(rating)}
               />
             )}

      {showStarRating && (
      <TouchableOpacity
        style={symptomsScreenStyles.uploadButton}
        onPress={handleUploadSymptoms}
        disabled={!selectedOption || !selectedRating}
      >

        <Text style={styles.uploadButtonText}>Add Symptom</Text>
      </TouchableOpacity>
      )}

      {showUploadAllSymptoms && (
      <View style={symptomsScreenStyles.bottomView}>
                  <TouchableOpacity
                    onPress={handleUploadAllSymptoms}
                    disabled={!selectedOption || !selectedRating}
                  >
                     <Text style={symptomsScreenStyles.textStyle}>Upload All the Showcased Symptoms</Text>
                  </TouchableOpacity>

                    </View>
      )}


    </View>
  );
};

const CameraImplementation = () => {

console.log("RNCamera" , RNCamera);
const [recording, setRecording] = useState(false);
  const [processing , setProcessing ] = useState(false);
  const [cameraReference , setCameraReference] = useState('');

const cameraScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  preview: {
    flex: 1,
    alignItems: "center",
    height: "16%",
    width: "100%",
  },
  capture: {
    flex: 0,
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 15,
    alignSelf: 'center',
    alignItems: "center",
  },
//     container: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     capture: {
//     alignItems: 'center',
//         backgroundColor: 'white',
//         padding: 10,
//     }
})

const startRecording = async () => {
setRecording(true);
const { uri, codec = "mp4" } = await cameraReference.recordAsync();
setRecording(false);
setProcessing(true);
console.log("recorded data from the camera : (step 1");
const type = `video/${codec}`;
const data = new FormData();
  data.append("video", {
    name: "mobile-video-upload",
    type,
    uri
  });
console.log("recorded type from the camera : " , type);
console.log("recorded video is saved in the following path data from the camera : " , uri);
setProcessing(false);
}

const stopRecording = () => {
cameraReference.stopRecording();
}

let button = (
      <TouchableOpacity
        onPress={startRecording}
        style={cameraScreenStyles.capture}
      >
        <Text style={{ fontSize: 14  , color: "white"}}> RECORD </Text>
      </TouchableOpacity>
    );

     if (recording) {
       button = (
         <TouchableOpacity
           onPress={stopRecording}
           style={cameraScreenStyles.capture}
         >
           <Text style={{ fontSize: 14 , color: "white" }}> STOP </Text>
         </TouchableOpacity>
       );
     }

     if (processing) {
           button = (
             <View style={cameraScreenStyles.capture}>
               <ActivityIndicator animating size={18} />
             </View>
           );
         }

const chatGptStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  cameraPreview: {
    flex: 1,
    overflow: 'hidden',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});


return (


<SafeAreaView style={chatGptStyles.container}>

        {/* First Part: RNCamera */}
        <SafeAreaView style={chatGptStyles.cameraContainer}>
                <RNCamera
                      ref={ref => {
                        setCameraReference(ref)
                      }}
                      captureAudio={false}
                      type={RNCamera.Constants.Type.back}
                      flashMode={RNCamera.Constants.FlashMode.on}
                      style={chatGptStyles.cameraPreview}
                      ratio="4:3"
                      androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                      }}
                      />


        </SafeAreaView>

        {/* Third Part: Button */}
        <SafeAreaView style={chatGptStyles.buttonContainer}>
{button}
        </SafeAreaView>

      </SafeAreaView>

)
}

function App(): JSX.Element {

useEffect(() => {
       createTable();
     }, []);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
<NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="User Heart and Respiratory Rates" component={HomeScreen} />
         <Stack.Screen name="Symptoms" component={SymptomsScreen} />
         <Stack.Screen name="CameraImplementation" component={CameraImplementation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
