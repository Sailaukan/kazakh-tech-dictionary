import React, { useState, useEffect } from 'react';
import supabase from '../client';
import classes from './profile.module.css';
import { useNavigate } from 'react-router-dom';


import { Auth } from '@supabase/auth-ui-react'

const Profile = () => {

    const [session, setSession] = useState(null)
    const [words, setWords] = useState([]);
    const navigate = useNavigate();

    const handlePage = (newWord2) => {
        const lowerCaseWord = String(newWord2).toLowerCase();
        navigate(`/${lowerCaseWord}`);
        console.log("LOWER: " + lowerCaseWord);
    };

    useEffect(() => {
        if (session) {
            getWords(session.user.id);
        }
    }, [session]);

    async function getWords(userId) {
        const { data } = await supabase
            .from('words')
            .select()
            .eq('userID', userId);
        setWords(data);
    }

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
            localStorage.setItem('signedIn', JSON.stringify(session))
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            localStorage.setItem('signedIn', JSON.stringify(session))
        })

        return () => subscription.unsubscribe()
    }, [])

    if (!session) {
        return (
            <div className={classes.mainWrapper}>
                <div className={classes.content}>
                    <Auth
                        supabaseClient={supabase}
                        appearance={{
                            style: {
                                button: {
                                    background: '#0099ff',
                                    color: 'white',
                                    padding: '12px 24px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontFamily: 'Helvetica, Arial, sans-serif',
                                    fontSize: '15px',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 2px 4px rgba(0, 118, 255, 0.2)',
                                    transition: 'background-color 0.3s, color 0.3s, transform 0.3s',
                                },
                                container: {
                                    margin: '0px',
                                    fontFamily: 'Helvetica, Arial, sans-serif',
                                    fontSize: '20px'
                                },
                                anchor: {
                                    color: '#777777',
                                    fontSize: '14px',
                                    textDecoration: 'none',
                                },
                                divider: {
                                    borderTop: '1px solid #DDD',
                                },
                                label: {
                                    fontWeight: 'bold',
                                    marginBottom: '8px',
                                },
                                input: {
                                    padding: '10px',
                                    border: '1px solid #DDD',
                                    borderRadius: '10px',
                                    fontFamily: 'Helvetica, Arial, sans-serif',
                                    fontSize: '14px',
                                    marginBottom: '0px',
                                },
                                loader: {
                                    color: '#0070F3',
                                },
                                message: {
                                    backgroundColor: '#F9F9F9',
                                    color: '#333',
                                    padding: '10px',
                                    borderRadius: '4px',
                                    fontFamily: 'Helvetica, Arial, sans-serif',
                                    fontSize: '14px',
                                    marginBottom: '12px',
                                },
                            },
                        }}


                        providers={[]}
                        localization={{
                            variables: {
                                sign_up: {
                                    social_provider_text: '{{provider}} арқылы тіркеліңіз',
                                    email_label: 'Электронды пошта',
                                    password_label: 'Кұпия сөз',
                                    email_input_placeholder: 'Cіздің эл. поштаңыз',
                                    password_input_placeholder: 'Сіздің құпия сөзіңіз',
                                    button_label: 'Тіркелу',
                                    loading_button_label: 'Тіркелуде ...',
                                    link_text: 'Аккаунтыңыз жоқ па? Тіркеліңіз',
                                    confirmation_text: 'Электронды поштаңызды тексеріңіз',
                                },
                                sign_in: {
                                    social_provider_text: '{{provider}} арқылы кіріңіз',
                                    email_label: 'Электронды пошта',
                                    password_label: 'Кұпия сөз',
                                    email_input_placeholder: 'Cіздің эл. поштаңыз',
                                    password_input_placeholder: 'Сіздің құпия сөзіңіз',
                                    button_label: 'Кіру',
                                    loading_button_label: 'Кіруде ...',
                                    link_text: 'Аккаунтыңыз бар ма? Кіріңіз',
                                },
                                forgotten_password: {
                                    email_label: 'Электронды пошта',
                                    password_label: 'Кұпия сөз',
                                    email_input_placeholder: 'Cіздің эл. поштаңыз',
                                    button_label: 'Құпия сөзді ауыстыру',
                                    link_text: 'Құпия сөзді ұмыттыңыз ба?',
                                    loading_button_label: 'Құпия сөзді ауыстыру бойынша ақпарат жіберілуде',
                                    confirmation_text: 'Электронды поштаңызды тексеріңіз',
                                },
                                update_password: {
                                    password_label: 'Кұпия сөз',
                                    password_input_placeholder: 'Сіздің жаңа құпия сөзіңіз',
                                    button_label: 'Құпия сөзді ауыстыру',
                                    loading_button_label: 'Құпия сөзді жаңартуда',
                                    confirmation_text: 'Құпия сөз жаңартылды',
                                },
                            },
                        }}
                    />
                </div>
            </div>
        )
    }
    else {
        return (
            <div className={classes.mainWrapper}>
                <div className={classes.content}>
                    <div>Сіз ұсынған сөздер</div>
                    {words.length > 0 ? (
                        words.map((word) => (
                            <div
                                className={classes.wordDiv}
                                key={word.word}
                                onClick={() => handlePage(word.word)}
                            >
                                <div className={classes.inline}>
                                    <div className={classes.word}>
                                        <div>{word.word}</div>
                                    </div>
                                    <div className={classes.topic}>
                                        {word.topic}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={classes.wordDiv}>
                            <div className="opacity-40">Сіз әлі еш сөзді ұсынған жоқсыз </div>
                        </div>
                    )}
                    <br />

                    <button
                        className={classes.submit}
                        onClick={() => supabase.auth.signOut()}>
                        Аккаунттан шығу
                    </button>
                </div>
            </div>
        )
    }
}

export default Profile;