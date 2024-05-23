import React, { useState, useEffect } from "react";
import classes from "./wordPage.module.css";
import supabase from "../client";
import { debounce } from 'lodash';

const WordPage = (props) => {
    const [translations, setTranslations] = useState([]);
    const [likedTranslations, setLikedTranslations] = useState([]);
    const [showTextarea, setShowTextarea] = useState(false);
    const [newTranslation, setNewTranslation] = useState('');
    const [signedIn, setSignedIn] = useState(false);
    const [userID, setUserID] = useState(null);
    const [likeTrigger, setLikeTrigger] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

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
            getLikedTranslations(session.user.id);
        }
    };

    useEffect(() => {
        getTranslations();
    }, [likeTrigger]);

    async function getTranslations() {
        const { data, error } = await supabase
            .from("translations")
            .select();
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
        const isValid = validateTranslation(newTranslation);
        if (!isValid) return;

        await sendTranslation(newTranslation);
        setShowTextarea(false);
        setNewTranslation('');
        await getTranslations();
    }

    const validateTranslation = (translation) => {
        const regex = /^[А-Яа-яӘәӨөҰұҮүҚқҒғҢңІі\s]+$/;
        if (!regex.test(translation)) {
            setErrorMessage('Аударма тек қана кириллица әріптерінен тұруы керек және ешқандай сан немесе арнайы таңбалар болмауы керек.');
            return false;
        }
        if (translation.length < 1 || translation.length > 25) {
            setErrorMessage('Аударма 1-ден 25-ке дейін әріптерден тұруы керек.');
            return false;
        }
        setErrorMessage('');
        return true;
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

    async function handleLike(translationID, translationCount) {
        if (!translationID || !userID) return;

        const { data: likeData, error: likeError } = await supabase
            .from('likes')
            .insert([
                { translationID: translationID, userID: userID }
            ]);

        if (likeError) {
            console.error('Error inserting like:', likeError.message);
            return;
        }

        console.log('Inserted like:', likeData);

        const { data: translationData, error: translationError } = await supabase
            .from('translations')
            .update({ count: translationCount + 1 })
            .eq('id', translationID);

        if (translationError) {
            console.error('Error updating translation count:', translationError.message);
            return;
        }

        setLikeTrigger(prev => prev + 1);

        await getLikedTranslations(userID);
    }

    const debouncedHandleLike = debounce(handleLike, 250);
    const handleLikeDebounced = async (translationID, translationCount) => {
        debouncedHandleLike(translationID, translationCount);
    };

    useEffect(() => {
        if (userID) {
            getLikedTranslations(userID);
        }
    }, [likeTrigger]);

    async function getLikedTranslations(userID) {
        const { data, error } = await supabase
            .from("likes")
            .select('translationID')
            .eq('userID', userID);

        if (error) {
            console.error('Error fetching liked translations:', error.message);
        } else {
            const likedTranslationIDs = data.map(item => parseInt(item.translationID, 10));
            setLikedTranslations(likedTranslationIDs);
        }
    }

    return (
        <div className={classes.mainWrapper}>
            <div className={classes.title}>{props.word}</div>
            <div className="font-light text-center mb-4">{props.language}</div>
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
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="22"
                                        height="22"
                                        fill="currentColor"
                                        className={`opacity-100 ${likedTranslations.includes(translation.id) || !userID ? 'opacity-20 cursor-not-allowed' : ' hover: opacity-80 cursor-pointer'}`}
                                        viewBox="0 0 16 16"
                                        onClick={() => !likedTranslations.includes(translation.id) && handleLikeDebounced(translation.id, translation.count)}
                                    >
                                        <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                </div>

                {signedIn ? (
                    showTextarea ? (
                        <div>
                            <textarea
                                className={classes.textarea}
                                placeholder="Аударманы енгізіңіз"
                                value={newTranslation}
                                onChange={handleTranslationChange}
                            />
                            {errorMessage && <div className={classes.errorMessage}>{errorMessage}</div>}
                            <button className={classes.saveButton} onClick={handleSaveTranslation}>
                                Жіберу
                            </button>
                        </div>
                    ) : (
                        <div className={classes.add} onClick={handleRequestTranslation}>
                            Аударманы ұсыну
                        </div>
                    )
                ) : null}

            </div>
        </div>
    )
}

export default WordPage;