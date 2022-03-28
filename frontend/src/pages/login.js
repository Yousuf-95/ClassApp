import React, { useState, useContext } from 'react';
import styles from '../styles/login.module.css';
import { FaUserAlt, FaKey } from 'react-icons/fa';
import { BsArrowRight } from 'react-icons/bs';
import { AuthContext } from '../context/authContext';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
    const authContext = useContext(AuthContext);
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');
    let [redirectOnLogin, setRedirectOnLogin] = useState(false);

    const submitCredentials = async (e) => {
        e.preventDefault();

        const submitResult = await fetch('https://tctest-api.herokuapp.com/api/login', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            }),
            headers: {
                "content-type": "application/json"
            }
        });

        if(submitResult.status === 403) 
            alert('invalid Username/Password combination');

        const {userInfo} = await submitResult.json();
        // console.log(userInfo);
        if(submitResult.status === 200 && userInfo){
            authContext.setAuthState({userInfo});
            setRedirectOnLogin(true);
        }
    }

    return (
        <>
            {redirectOnLogin && <Navigate to="/dashboard" replace={true} />}
            <section className={`${styles.loginSection}`}>

                <div className={`${styles.container}`}>
                    <div className={`${styles.flexContainer}`}>
                        <div>
                            {/* <p>something</p> */}
                        </div>

                        <div className={`${styles.box}`}>
                            <form className={`${styles.loginForm}`}>
                                <h2>User Login</h2>
                                <div className={`${styles.formGroup}`}>
                                    <div><label>Username</label></div>
                                    <div className={`${styles.userIcon}`}>
                                        <span>< FaUserAlt /></span>
                                        <input type="text" placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} />
                                    </div>
                                </div>
                                <div className={`${styles.formGroup}`}>
                                    <label>Password</label>
                                    <div className={`${styles.userIcon}`}>
                                        <span>< FaKey /></span>
                                        <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                                    </div>
                                </div>

                                <button type="submit" className={`${styles.btn}`} onClick={(e) => submitCredentials(e)} >Login <span className={`${styles.arrowKey}`}>< BsArrowRight /></span></button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default LoginPage;