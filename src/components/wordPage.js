import React, { useState, useEffect } from "react";
import classes from "./wordPage.module.css";
import supabase from "../client";

const WordPage = (props) => {
    const [translations, setTranslations] = useState([]);
    const [showTextarea, setShowTextarea] = useState(false);
    const [newTranslation, setNewTranslation] = useState('');

    useEffect(() => {
        getTranslations();
    }, []);

    async function getTranslations() {
        const { data, error } = await supabase.from("translations").select();
        if (error) {
            console.error('Error fetching translations:', error.message);
        } else {
            setTranslations(data);
        }
    }

    const handleRequestTranslation = () => {
        setShowTextarea(true);
    }

    const handleTranslationChange = (event) => {
        setNewTranslation(event.target.value);
    }

    const handleSaveTranslation = async () => {
        await sendTranslation(newTranslation);
        setShowTextarea(false);
        setNewTranslation('');
        await getTranslations();
    }

    async function sendTranslation(translation) {
        const { data, error } = await supabase
            .from('translations')
            .insert([
                { word: props.word, translation: translation, count: 0 },
            ]);
        if (error) {
            console.error('Error inserting translation:', error.message);
        } else {
            console.log('Inserted data:', data);
        }
    }

    return (
        <div className={classes.mainWrapper}>
            <div className={classes.title}>{props.word}</div>
            <div className="font-light text-center mb-4">Орысша</div>
            <div className={classes.content}>
                <div className="font-light opacity-60">Аудармалар</div>
                <div className={classes.translation}>
                    {translations
                        .filter((translation) => translation.word === props.word)
                        .sort((a, b) => b.count - a.count)
                        .map((translation) => (
                            <div className={classes.wordDiv} key={translation.translation}>
                                {translation.translation}
                                <div className="flex justify-between">
                                    <div className="mr-2">
                                        {translation.count}
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="opacity-40 hover:opacity-100 cursor-pointer" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                </div>
                {showTextarea ? (
                    <div>
                        <textarea
                            className={classes.textarea}
                            placeholder="Аударманы енгізіңіз"
                            value={newTranslation}
                            onChange={handleTranslationChange}
                        />
                        <button className={classes.saveButton} onClick={handleSaveTranslation}>
                            Жіберу
                        </button>
                    </div>
                ) : (
                    <div className={classes.add} onClick={handleRequestTranslation}>
                        Аударманы ұсыну
                    </div>
                )}
            </div>
        </div>
    )
}

export default WordPage;
