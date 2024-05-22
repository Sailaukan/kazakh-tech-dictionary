import React, { useEffect, useState } from "react";
import supabase from "../client";
import classes from "./main.module.css"
import { useNavigate } from 'react-router-dom';


const Main = () => {
    const [words, setWords] = useState([]);
    const navigate = useNavigate();

    const handlePage = (newWord) => {
        const lowerCaseWord = String(newWord).toLowerCase();
        navigate(`/${lowerCaseWord}`);
        console.log("LOWER"+lowerCaseWord);
    };

    useEffect(() => {
        getWords();
    }, []);

    async function getWords() {
        const { data } = await supabase.from("words").select();
        setWords(data);
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
        </div>
    )
}

export default Main;