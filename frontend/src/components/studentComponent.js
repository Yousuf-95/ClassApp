import React, {useState, useEffect} from 'react';
import { FaUserAlt } from 'react-icons/fa';
import styles from '../styles/studentComponent.module.css';


const StudentComponent = ({ username, name }) => {

    let [classes, setclasses] = useState([]);
    
    useEffect(() => {
        fetch('https://tctest-api.herokuapp.com/api/get-classes', {
            method: 'POST',
            body: JSON.stringify({
                name: name.toLowerCase(),
            }),
            headers: {
                "content-type": "application/json"
            }
        }).then(result => 
            result.json()
            .then(finalResult => { setclasses(finalResult.classes) })
        ).catch(e => console.log(e));
        // console.log(getStudents);
    }, [name]);

    return (
        <>

            <div className={`${styles.box}`}>
                <div className={`${styles.userDetails}`}>
                    <div className={`${styles.userIcon}`}>
                        <FaUserAlt />
                    </div>
                    <h4>{`Username: ${username}`}</h4>
                </div>
            </div>
            <div className={`${styles.box}`}>
                <div className={`${styles.classDetails}`}>
                    <h3 className={`${styles.listHeading}`}>All classes</h3>
                    <table className={`${styles.classList}`}>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Subject</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                classes.map((element, key) =>
                                (
                                    <tr key={key}>
                                        <td>{key + 1}</td>
                                        <td>{element.subject}</td>
                                        {element.files.length !==0 ?
                                        element.files.map((file, key) =>
                                        (
                                            <td key={key}>
                                                <a href={file}>
                                                    {'File ' + key + 1}
                                                </a>
                                            </td>
                                        )
                                        )
                                        :
                                        <td>No notes found.</td>
                                        }
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default StudentComponent;