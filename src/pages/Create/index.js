import React, { useState, useRef, Fragment, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Button, Image, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Create(){

    const navigation = useNavigation();

    const [step, setStep] = useState("name");
    const [name, setName] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [correctAlternative, setCorrectAlternative] = useState("");
    const [question, setQuestion] = useState("");
    const [a, setA] = useState("");
    const [b, setB] = useState("");
    const [c, setC] = useState("");
    const [d, setD] = useState("");
    const [e, setE] = useState("");
    const [questionId, setQuestionId] = useState(0);
    const [questionQnt, setQuestionQnt] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [quiz, setQuiz] = useState({});
    const [finished, setFinished] = useState(false);


    // useEffect(() => {
    //     console.log(questions);
    // }, [questions]);

    useEffect(() => {
        loadQuestion();
    }, [questionId]);

    useEffect(() => {
        if(finished){
            setQuiz({
                name: name,
                questions: questions
            });
        }
    }, [questions]);

    useEffect(() => {
        if(finished){
            storeQuiz();
            navigation.navigate("Home");
        }
    }, [quiz]);

    async function storeQuiz(){
        try{
            const currentQuizJson = quiz;

            let savedQuizzes = JSON.parse(await AsyncStorage.getItem("quizzes"));

            let quizzes = [];

            if(savedQuizzes === null){
                savedQuizzes = currentQuizJson;
            }
            else{
                if(savedQuizzes.length >= 1){
                    savedQuizzes.push(currentQuizJson);
                }
                else{
                    quizzes.push(savedQuizzes);
                    quizzes.push(currentQuizJson);

                    savedQuizzes = quizzes;
                }
            }
            
            await AsyncStorage.setItem("quizzes", JSON.stringify(savedQuizzes));
        }
        catch(e){

        }
    }

    /**
      * Method responsible for controlling and executing the return button function.
      * Identifies the current page of the authoring component.
      */
    function returnButton(currentStep){
        if(currentStep === "name"){
            navigation.navigate("Home");
        }
        else if(currentStep === "questions"){
            setStep("name");
        }
    }


    //Method responsible for controlling the change of steps of the creation component. 
    function nextStep(currentStep){
        if(currentStep === "name"){
            setStep("questions");

            if(questionId === 0){
                setQuestionId(questionId + 1);
                setQuestionQnt(questionQnt + 1);
            }
        }
        else if(currentStep === "questions"){
            setFinished(true);

            createQuestion();            
        }
    }

    /**
      * Method responsible for controlling the display of questions, advancing/creating or rewinding a question.
      * Send "next" to advance the question or "back" to return it
      */
    function questionStep(action){
        if(action === "back"){
            if(questionId > 1){
                if(questionId === questionQnt){
                    createQuestion();
                }
                setQuestionId(questionId - 1);

                loadQuestion();
            }
        }
        else{
            if(questionId === questionQnt){
                createQuestion();
                setQuestionQnt(questionQnt + 1);

                setQuestion("");
                setA("");
                setB("");
                setC("");
                setD("");
                setE("");
                setCorrectAnswer("");
                setCorrectAlternative("");
            }

            setQuestionId(questionId + 1);
        }
    }

    /**
     * Method responsible for saving the question in the current edition.
     */
    function createQuestion(){
        setQuestions([...questions, {
            question: question,
            a: a,
            b: b,
            c: c,
            d: d,
            e: e,
            correctAnswer: correctAnswer,
            correctAlternative: correctAlternative,
            questionId: questionId
        }]);
    }

    /**
     * Method responsible for removing the question currently displayed in the component.
     */
    function removeQuestion(){
        if(questionQnt > 1){
            for(let i = 0; i < questions.length; i++){
                if(i === questionId - 1){
                    questions.splice(i, 1);
                    break;
                }
            }
    
            setQuestionQnt(questionQnt - 1);
            
            if(questionId > 1){
                setQuestionId(questionId - 1);
            }
            else if(questionId == 1){
                loadFirstQuestion();
            }
        }
    }

     // Method responsible for loading the index question currently displayed in the component.

    function loadQuestion(){
        if(questions.length > 0){
            questions.forEach(question => {
                if(question.questionId === questionId){
                    setQuestion(question.question);
                    setA(question.a);
                    setB(question.b);
                    setC(question.c);
                    setD(question.d);
                    setE(question.e);
                    setCorrectAnswer(question.correctAnswer);
                    setCorrectAlternative(question.correctAlternative);
                }
            });
        }
    }

     // Method responsible for loading the first question from the created questions array
     
    function loadFirstQuestion(){
        if(questions.length > 0){
            setQuestion(questions[0].question);
            setA(questions[0].a);
            setB(questions[0].b);
            setC(questions[0].c);
            setD(questions[0].d);
            setE(questions[0].e);
            setCorrectAnswer(questions[0].correctAnswer);
            setCorrectAlternative(questions[0].correctAlternative);
        }
    }

    return(
        <LinearGradient colors={['#ddf45b', '#00d4ff']}
                        start={{x:0.7,y:-0.4}}
                        style={styles.body}>
            <View style={styles.container}>
                {/* HEADER */}
                {
                    step ? 
                        
                            <View style={styles.header}>
                                <Feather onPress={() => returnButton(step)} name="home" size={28} style={styles.btnBack}/>
                               
                                    
                                    {/* Question counter */}
                                    {
                                    step === "questions" ? 
                                        <View style={styles.questionHeader}>
                                            
                                            <View style={styles.questionContainer}>
                                                <Text style={styles.questionCount}>Question {questionId}/{questionQnt}</Text>
                                            </View>
                                            <View style={styles.trashContainer}>
                                                {
                                                    questionQnt > 1 ?
                                                        <Feather onPress={() => removeQuestion()} name="trash-2" size={28} style={styles.btnTrash}/>
                                                    :
                                                        <Feather onPress={() => removeQuestion()} name="trash-2" size={28} style={styles.btnTrashLock}/>
                                                }
                                            </View>
                                        </View>
                                    :
                                        <Fragment></Fragment>
                                    }
                            </View>
                        
                    :
                        <Fragment></Fragment>
                }
                
                {/* BODY */}
                { step ? 
                    (step === "name" ? 
                        <View style={styles.formArea}>
                            <Text style={styles.title}>Schooled!</Text>
                            <Text style={styles.labelForm}>Enter the name of your quiz</Text>
                            <TextInput style={styles.input} 
                                        maxLength={26}
                                        onChangeText={text => setName(text)}/>

                            <TouchableOpacity onPress={() => nextStep(step)}>
                                <View style={styles.btnConfirm}>
                                    <Text style={styles.btnConfirmText}>OK!</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    :
                        (step === "questions" ? 
                            <View>
                                <View style={styles.questionCreateArea}>
                                    <Text style={styles.labelQuestionForm}>Enter the question</Text>
                                    <TextInput style={styles.questionInput} 
                                            maxLength={150}
                                            multiline={true}
                                            value={question}
                                            onChangeText={text => setQuestion(text)}/>

                                    <Text style={styles.labelAnswerForm}>Now enter the answers and select the true statement</Text>

                                    <View style={styles.alternative}>
                                        <TouchableOpacity onPress={() => {setCorrectAnswer(a); setCorrectAlternative("a")}}>
                                            <View style={ (correctAlternative === "a") ? styles.alternativeCircleCorrect : styles.alternativeCircle}>
                                                <Text style={styles.alternativeText}>A</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TextInput  style={ (correctAlternative === "a") ? styles.answerInputCorrect : styles.answerInput} 
                                                    maxLength={150}
                                                    value={a}
                                                    multiline={true}
                                                    onChangeText={text => setA(text)}
                                                    onPress={text => setCorrectAnswer(text)}/>
                                    </View>
                                    <View style={styles.alternative}>
                                        <TouchableOpacity onPress={() => {setCorrectAnswer(b); setCorrectAlternative("b")}}>
                                            <View style={ (correctAlternative === "b") ? styles.alternativeCircleCorrect : styles.alternativeCircle}>
                                                <Text style={styles.alternativeText}>B</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TextInput  style={ (correctAlternative === "b") ? styles.answerInputCorrect : styles.answerInput}
                                                    maxLength={150}
                                                    multiline={true}
                                                    value={b}
                                                    onChangeText={text => setB(text)}
                                                    onPress={text => setCorrectAnswer(text)}/>
                                    </View>
                                    <View style={styles.alternative}>
                                        <TouchableOpacity onPress={() => {setCorrectAnswer(c); setCorrectAlternative("c")}}>
                                            <View style={ (correctAlternative === "c") ? styles.alternativeCircleCorrect : styles.alternativeCircle}>
                                                <Text style={styles.alternativeText}>C</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TextInput  style={ (correctAlternative === "c") ? styles.answerInputCorrect : styles.answerInput}
                                                    maxLength={150}
                                                    multiline={true}
                                                    value={c}
                                                    onChangeText={text => setC(text)}
                                                    onPress={text => setCorrectAnswer(text)}/>
                                    </View>
                                    <View style={styles.alternative}>
                                        <TouchableOpacity onPress={() => {setCorrectAnswer(d); setCorrectAlternative("d")}}>
                                            <View style={ (correctAlternative === "d") ? styles.alternativeCircleCorrect : styles.alternativeCircle}>
                                                <Text style={styles.alternativeText}>D</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TextInput  style={ (correctAlternative === "d") ? styles.answerInputCorrect : styles.answerInput} 
                                                    maxLength={150}
                                                    multiline={true}
                                                    value={d}
                                                    onChangeText={text => setD(text)}
                                                    onPress={text => setCorrectAnswer(text)}/>
                                    </View>
                                    <View style={styles.alternative}>
                                        <TouchableOpacity onPress={() => {setCorrectAnswer(e); setCorrectAlternative("e")}}>
                                            <View style={ (correctAlternative === "e") ? styles.alternativeCircleCorrect : styles.alternativeCircle}>
                                                <Text style={styles.alternativeText}>E</Text>
                                            </View>
                                        </TouchableOpacity>
                                        <TextInput  style={ (correctAlternative === "e") ? styles.answerInputCorrect : styles.answerInput}
                                                    maxLength={150}
                                                    multiline={true}
                                                    value={e}
                                                    onChangeText={text => setE(text)}
                                                    onPress={text => setCorrectAnswer(text)}/>
                                    </View>
                                </View>

                                <View style={styles.questionFooter}>
                                    {
                                        questionId === 1 ?
                                            <Feather name="chevron-left" size={28} style={styles.questionDirectionLock} onPress={() => questionStep("back")}/>
                                        :
                                            <Feather name="chevron-left" size={28} style={styles.questionDirection} onPress={() => questionStep("back")}/>
                                    }
                                    
                                    {
                                        questionQnt > 1 ?
                                            <TouchableOpacity onPress={() => nextStep(step)}>
                                                <View style={styles.btnFinish}>
                                                    <Text style={styles.btnFinishText}>FINISH</Text>
                                                </View>
                                            </TouchableOpacity>
                                        :
                                            <View style={styles.btnFinishLock}>
                                                <Text style={styles.btnFinishText}>FINISH</Text>
                                            </View>
                                    }
                                    
                                    <Feather name="chevron-right" size={28} style={styles.questionDirection} onPress={() => questionStep("next")}/>
                                </View>
                            </View>
                        :
                            <View>

                            </View>
                        )
                    )

                :

                <View>
                    <Text>A failure occurred while displaying the next page.</Text>
                </View>

                }
            </View>
        </LinearGradient>
    );
}