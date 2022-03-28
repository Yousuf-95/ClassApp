import React, { useContext} from 'react';
import styles from '../styles/dashboard.module.css';
import { AuthContext } from '../context/authContext';
import StudentComponent from '../components/studentComponent';
import TeacherComponent from '../components/teacherComponent';

const Dashboard = () => {
    const authContext = useContext(AuthContext);
    const name = `${authContext.authState.userInfo.firstName.charAt(0).toUpperCase() + authContext.authState.userInfo.firstName.slice(1)} ${authContext.authState.userInfo.lastName}`
    const username = authContext.authState.userInfo.username;

    return (
        <>
            <section className={`${styles.dashboardSection}`}>
                <div className={`${styles.container}`}>
                    <h2 className={`${styles.welcomeText}`}>{`Welcome, ${name}`}</h2>
                    <div className={`${styles.flexContainer}`}>
                        {
                            authContext.authState.userInfo.role === 'student' ? <StudentComponent name={name} username={username} /> : <TeacherComponent teacher={name} />
                        }
                    </div>
                </div>
            </section>
        </>
    );
}

export default Dashboard;