import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

import styles from '../styles/nav.module.css';

const NavBar = () => {
    const authContext = useContext(AuthContext);

    return (
        <>
            <nav className={`${styles.navBar}`}>
                <div className={`${styles.container}`}>
                    <div>
                        <h1><NavLink className={`${styles.logo}`} to="/">TCSystems</NavLink></h1>
                        {/* <h1 className={`${styles.logo}`}>TCSystems</h1> */}
                    </div>
                    <ul className={`${styles.navLinks}`}>

                        {/* Pages for logged-in users only */}
                        {
                            authContext.authState.isAuthenticated
                                ?
                                <li>
                                    <NavLink className={`${styles.link}`}
                                        style={({ isActive }) => {
                                            return {
                                                'boxShadow': isActive ? "0px -0.2rem 0px 0px #fff inset" : ""
                                            };
                                        }}
                                        to="/dashboard">Dashboard</NavLink>
                                </li>
                                :
                                ''
                        }

                        {/* Login/Logout conditional rendering */}
                        {authContext.authState.isAuthenticated
                            ?
                            <li>
                                <NavLink className={`${styles.link}`}
                                    style={({ isActive }) => {
                                        return {
                                            'boxShadow': isActive ? "0px -0.2rem 0px 0px #fff inset" : ""
                                        };
                                    }}
                                    to="/" onClick={() => authContext.logout()}>Logout</NavLink>
                            </li>
                            :
                            <li>
                                <NavLink className={`${styles.link}`}
                                    style={({ isActive }) => {
                                        return {
                                            'boxShadow': isActive ? "0px -0.2rem 0px 0px #fff inset" : ""
                                        };
                                    }}
                                    to="/login">Login</NavLink>
                            </li>
                        }

                    </ul>
                </div>
            </nav>
        </>
    );
}

export default NavBar;