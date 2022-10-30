import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Button, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

export default function Home(){

    const navigation = useNavigation();
    
    function navigate(destination){
        navigation.navigate(destination);
    }

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.subtitle}>Welcome to</Text>
                <Text style={styles.title}>Schooled!</Text>
                <Text style={styles.titleInfo}>All your school needs in one app!  </Text>
                <Text style={styles.subtitle}>By: Krish Patel </Text>
            </View>

            <View style={styles.btnContainer}>
                
                <TouchableOpacity onPress={() => navigate('Create')}>
                    <LinearGradient style={styles.btnCreate} 
                                    colors={['#ddf45b', '#00d4ff']}
                                    start={{x:0,y:1}}
                                    end={{x:3,y:1}}>

                        <View style={styles.btnTextBox}>
                            <Text style={styles.btnDescript}>Start a new quiz</Text>
                            <Text style={styles.btnTextHome}>Create</Text>
                        </View>

                    </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigate('Load')}>
                    <LinearGradient style={styles.btnLoad} 
                                    colors={['#ff88f8', '#ff5154']}
                                    start={{x:-1,y:1}}
                                    end={{x:1.5,y:1}}>

                        <View style={styles.btnTextBox}>
                            <Text style={styles.btnDescript}>           View my quizes</Text>
                            <Text style={styles.btnTextHome}>Load quizzes</Text>
                        </View>

                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigate('ToDoList')}>
                <LinearGradient 
                     style={styles.btnList} 
                                colors={['#d3d3d3', '#9e9e9e']}
                                start={{x:0,y:1}}
	                            end={{x:4,y:1}}>
                               
                    <View style={styles.btnTextBox}>
                        <Text style={styles.btnDescript}>Arrange your homework and tasks</Text>
                        <Text style={styles.btnTextHome}>To Do List</Text>
                    </View>
                    
                </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigate('Timer')}>
                <LinearGradient 
                     style={styles.btnTimer} 
                                colors={['#91a6ff', '#1f4aff']}
                                start={{x:0,y:1}}
	                            end={{x:2,y:1}}>
                               
                    <View style={styles.btnTextBox}>
                        <Text style={styles.btnDescript}>Manage your time efficently</Text>
                        <Text style={styles.btnTextHome}>Study Timer</Text>
                    </View>
                    
                </LinearGradient>
                </TouchableOpacity>

               

               
            </View>
        </View>
    );
}