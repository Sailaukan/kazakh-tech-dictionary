import React, { useEffect, useState } from "react";
import supabase from "../client";
import classes from "./main.module.css"
import { useNavigate } from 'react-router-dom';


const Main = ({refreshWords}) => {
    const [words, setWords] = useState([]);
    const navigate = useNavigate();
    const [signedIn, setSignedIn] = useState(false);
    const [userID, setUserID] = useState(null);
    const [newWord, setNewWord] = useState(null);
    const [newWordTopic, setNewWordTopic] = useState(null)
    const [trigger, setTrigger] = useState(0);



    const topics = [
        "Зымыран құрастыру",
        "Ядролы физика",
        "Бағдарламалау",
    ];


    useEffect(() => {
        const data = localStorage.getItem('signedIn');
        if (data) {
            setSignedIn(JSON.parse(data));
        }
    }, []);

    useEffect(() => {
        getSession();
    }, []);

    const getSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            setUserID(session.user.id);
        }
    };

    const handlePage = (newWord2) => {
        const lowerCaseWord = String(newWord2).toLowerCase();
        navigate(`/${lowerCaseWord}`);
        console.log("LOWER: " + lowerCaseWord);
    };

    useEffect(() => {
        getWords();
    }, []);

    async function getWords() {
        const { data } = await supabase
            .from("words")
            .select();
        setWords(data);
    }


    const handleWordChange = (event) => {
        setNewWord(event.target.value);
    }

    const handleSaveWord = async () => {
        await sendWord(newWord);
        // setShowTextarea(false);
        setNewWord('');
        await getWords();
        refreshWords();
    }

    async function sendWord(word) {
        const { data, error } = await supabase
            .from('words')
            .insert([
                { word: word, userID: userID, topic: newWordTopic },
            ]);
        if (error) {
            console.error('Error inserting translation:', error.message);
        } else {
            console.log('Inserted data:', data);
        }
        setTrigger(prev => prev + 1);
    }





    return (
        <div className={classes.mainWrapper}>
            <div>
                {words.map((word) => (
                    <div
                        className={classes.wordDiv}
                        key={word.word}
                        onClick={() => handlePage(word.word)}>
                        <div className={classes.inline}>
                            <div className={classes.word}>
                                <div >{word.word}</div>
                            </div>
                            <div className={classes.topic}>
                                {word.topic}
                            </div>
                        </div>
                        <button className={classes.bookmark}>Сақтау</button>
                    </div>
                ))}
            </div>
            <div className={classes.addWord}>
                <textarea
                    className={classes.textarea}
                    placeholder="Сөзді енгізіңіз"
                    value={newWord}
                    onChange={handleWordChange}
                />
                <div className={classes.topicMap}>
                    {topics.map((topic, index) => (
                        <button
                            key={index}
                            className={classes.topicButton}
                            onClick={() => setNewWordTopic(topic)}
                        >
                            {topic}
                        </button>
                    ))}
                </div>
                <button className={classes.saveButton} onClick={handleSaveWord}>
                    Жіберу
                </button>
            </div>

        </div>
    )
}

export default Main;