import React, { useEffect, useState } from "react";
import supabase from "../client";
import classes from "./main.module.css"
import { useNavigate } from 'react-router-dom';


const Main = ({ refreshWords }) => {
    const [words, setWords] = useState([]);
    const navigate = useNavigate();
    const [signedIn, setSignedIn] = useState(false);
    const [userID, setUserID] = useState(null);
    const [newWord, setNewWord] = useState(null);
    const [newWordTopic, setNewWordTopic] = useState(null)
    const [trigger, setTrigger] = useState(0);
    const [showTextarea, setShowTextarea] = useState(false);
    const [newWordLanguage, setNewWordLanguage] = useState(null)



    const topics = [
        "Зымыран құрастыру",
        "Физика",
        "Бағдарламалау",
        "Робототехника",
        "Информатика",
        "Математика",
    ];

    const languages = [
        "Орыс тілі",
        "Ағылшын тілі",
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
        setShowTextarea(false);
        setNewWord('');
        await getWords();
        refreshWords();
    }

    async function sendWord(word) {
        const { data, error } = await supabase
            .from('words')
            .insert([
                { word: word, userID: userID, topic: newWordTopic, language: newWordLanguage },
            ]);
        if (error) {
            console.error('Error inserting translation:', error.message);
        } else {
            console.log('Inserted data:', data);
        }
        setTrigger(prev => prev + 1);
    }


    const handleRequestWord = () => {
        setShowTextarea(true);
    }


    return (
        <div className={classes.mainWrapper}>

            {signedIn ? (
                <>
                    {showTextarea ? (
                        <div>
                            <div className={classes.addWord}>

                                <div className={classes.topicMap}>
                                    <p className="mb-2">
                                        Тіл
                                    </p>
                                    {languages.map((language, index) => (
                                        <button
                                            key={index}
                                            className={`${classes.topicButton} ${newWordLanguage === language ? classes.selectedTopicButton : ''}`}
                                            onClick={() => setNewWordLanguage(language)}
                                        >
                                            {language}
                                        </button>
                                    ))}
                                    <p className="mb-2 mt-2">
                                        Тақырып
                                    </p>
                                    {topics.map((topic, index) => (
                                        <button
                                            key={index}
                                            className={`${classes.topicButton} ${newWordTopic === topic ? classes.selectedTopicButton : ''}`}
                                            onClick={() => setNewWordTopic(topic)}
                                        >
                                            {topic}
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    className={classes.textarea}
                                    placeholder="Аудармасы белгісіз сөзді енгізіңіз"
                                    value={newWord}
                                    onChange={handleWordChange}
                                />
                                <button className={classes.saveButton} onClick={handleSaveWord}>
                                    Жіберу
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex relative items-center">
                            <div className="border-b-2 border-blue-400 w-full absolute" />
                            <center className={classes.add} onClick={handleRequestWord} style={{ position: 'relative', zIndex: 1 }}>
                                <div className="flex items-center px-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle mr-2" viewBox="0 0 16 16">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                    </svg>
                                    Cөзді ұсыну
                                </div>
                            </center>
                        </div>
                    )}
                </>
            ) : (
                <div className={classes.info}>
                    Өз сөзіңізді немесе аудармаларды ұсыну үшін тіркелуіңіз қажет
                </div>
            )}


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
                    </div>
                ))}
            </div>


        </div>
    )
}

export default Main;