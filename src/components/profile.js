import React, { useState, useEffect } from "react";
import supabase from "../client";
import classes from "./profile.module.css";

const Profile = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [profile, setProfile] = useState(null);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isSignIn, setIsSignIn] = useState(false);

    useEffect(() => {
        const getProfile = async () => {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) {
                console.error(error);
                return;
            }

            if (user) {
                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();
                if (data) setProfile(data);
                if (error) console.error(error);
            }
        };

        getProfile();
    }, []);

    const handleSignUp = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setError(error.message);
        else setSuccess("Аккаунтты растау үшін электронды поштаңызды тексеріңіз.");
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
        else window.location.reload();
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.reload();
    };

    if (!profile) {
        return (
            <div className={classes.mainWrapper}>
                <div className={classes.content}>
                    <h2 className={classes.title}>{isSignUp ? "Тіркелу" : "Кіру"}</h2>
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    {success && <p style={{ color: "green" }}>{success}</p>}
                    <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
                        <input
                            type="email"
                            placeholder="Эл. пошта"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Кұпия сөз"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button className={classes.submit} type="submit">{isSignUp ? "Тіркелу" : "Кіру"}</button>
                        <button className={classes.add} onClick={() => setIsSignUp(!isSignUp)}>
                            {isSignUp ? "Аккаунтыңыз бар ма? Кіру" : "Аккаунтыңыз жоқ па? Тіркелу"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={classes.mainWrapper}>
            <div className={classes.content}>
                <h2>Profile</h2>
                <p>Email: {profile.email}</p>
                <p>Username: {profile.username}</p>
                <div onClick={handleSignOut}>Sign Out</div>
            </div>
        </div>
    );
};

export default Profile;