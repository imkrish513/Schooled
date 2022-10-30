
import React, {useState, useEffect} from 'react';
import { SafeAreaView, StyleSheet, Text, View, Button, TextInput, Vibration, TouchableOpacity, Keyboard } from 'react-native';
import Constants from 'expo-constants';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';

import { LinearGradient } from 'expo-linear-gradient';



const Timer = props => {
  const StartLabel = "Start";
  const StopLabel = 'Stop';
  const [sound, setSound] = React.useState();

  const navigation = useNavigation();

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( require('./Alarms.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();}
      : undefined;
  }, [sound]);


  const[userWorkTimer, setUserWorkTimer] = useState('');
  const [userBreakTimer, setUserBreakTimer] = useState('');
  //timer stopped
  const [timerStopped, setTimerStopped] = useState(true);
  //work timer
  const [workMinutes, setWorkMinutes] = useState('25');
  const [seconds, setSeconds] = useState('0');
  //break timer
  const [breakMinutes, setBreakMinutes] = useState('5');
  const [breakSeconds, setBreakSeconds] = useState('0');

  const [timerSwitch, setTimerSwitch] = useState(true);

  const [label, setLabel] = useState(StartLabel);
 

  useEffect(() => {
    let intervalID = null;
    

    if(!timerStopped) {
      setLabel(StopLabel);
      
      if(timerSwitch){
        if(workMinutes == 0 && seconds == 0) {
          playSound()
          Vibration.vibrate(1000);
          setTimerSwitch(!timerSwitch);
        } 
        else {       
          intervalID = setInterval(() => {  
            if(seconds == 0){
              setSeconds(59);
              setWorkMinutes(workMinutes - 1) 
            }
            else{
              setSeconds(seconds - 1);
            }
          }, 1000);        
        }
      }
      else if(!timerSwitch){
        if(breakMinutes == 0 && breakSeconds == 0){
          Vibration.vibrate(1000);
          playSound()
          
          setSeconds(59);
          setBreakMinutes(userBreakTimer);
          setBreakSeconds(0);
          setTimerSwitch(!timerSwitch);
          }
        else{
          intervalID = setInterval(() => {
            if(breakSeconds == 0){
              setBreakSeconds(59);
              setBreakMinutes(breakMinutes - 1);
            }
            else{
              setBreakSeconds(breakSeconds - 1);
            }           
          }, 1000);
        }
        
      }
    }
    else{
      setLabel(StartLabel);
    }
    return () => {
      clearInterval(intervalID);
    };
  });


  return (
    <LinearGradient colors={['#91a6ff', '#7facf5']}
                        start={{x:0.7,y:-0.4}}
                        style={styles.body}>
    <SafeAreaView style={styles.safeAreaView}>
    <Feather onPress={() => navigation.navigate('Home')} name="home" size={28} style={styles.btnBack}/>
      <Text style={styles.timerHeader}>Work Timer</Text>
      <Text style= {styles.timerText}>{workMinutes}:{(seconds < 10) ? '0' + seconds:seconds}</Text>
      
       <View style = {styles.inputContainer}>
      <Text style={styles.labelText}>Work Mins: </Text>
      <TextInput keyboardType='numeric' value={userWorkTimer} onChangeText={(text) => setUserWorkTimer(text)} style={styles.input}/>
      </View>
      <View style = {styles.inputContainer}>
      <Text style={styles.labelText}>Break Mins: </Text>
      <TextInput keyboardType="numeric" value={userBreakTimer} onChangeText={(text) => setUserBreakTimer(text)} style={styles.input}/>
      </View>
      <TouchableOpacity style={styles.submitTimer} onPress={() => {       
        setWorkMinutes(Number(userWorkTimer));
        setBreakMinutes(Number(userBreakTimer));
        Keyboard.dismiss()
           
      }}>
      <Text style={styles.submitText}>Submit Timer</Text>
      </TouchableOpacity>
      <View style = {styles.startResetButtons}>
      <TouchableOpacity style = {styles.startBtn}  onPress={() => setTimerStopped(!timerStopped)} >
        <Text style={styles.startText}>{label}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.reset} onPress={() => {
        setWorkMinutes(userWorkTimer) ,
         setSeconds(0),
         setBreakMinutes(userBreakTimer), 
         setBreakSeconds(0)}
         }>
         <Text style={styles.resetText}>Reset</Text>   
      </TouchableOpacity>
         </View>
      <Text style={styles.timerHeader}>Break Timer</Text>
      <Text style = {styles.timerText}>{breakMinutes}:{(breakSeconds < 10 ? '0' + breakSeconds:breakSeconds)}</Text>

      
      
    </SafeAreaView>
    </LinearGradient>
   
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex : 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    
    color: 'white',
    fontSize: 70,
    fontWeight: 'bold'
  },
  input: {
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#4A5568',
    borderRadius: 10,
    minWidth: 40,
    maxWidth: 60,
    padding: 5,
    marginLeft: 5,
    fontSize: 18,
    color: 'white',
    marginBottom: 15,
    justifyContent: 'center',
    alignContent:'center',
  },
  startResetButtons: {
    alignItems: 'center',
    flexDirection: 'row',
    margin: 10,
  },
  submitTimer:{
    marginRight: 15,
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
  },
  submitText:{
    color: '#0984e3',
    fontSize: 25,
  },
  body: {
    height: "100%",
  },
  startBtn: {
    marginRight: 15,
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
  },
  startText: {
    color: '#26CF08',
    fontSize: 25,
  },
  btnBack: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    color: "#FFFFFF",
    paddingTop: 25,
   paddingLeft: 10,
   width: 50,
   height:65,
  
  },
  reset: {
    marginRight: 15,
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
  },
  resetText: {
    color: '#ff7675',
    fontSize: 25,
  },
  timerHeader: {
    
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    
  },
  labelText: {
    paddingRight: 10,
    paddingTop: 5,
    fontSize: 18,
    fontWeight: 'bold',
  },
  
});

export default Timer;
