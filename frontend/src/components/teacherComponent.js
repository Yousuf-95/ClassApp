import React, { useState } from 'react';
import styles from '../styles/teacherComponent.module.css';
// import { FaUserAlt } from 'react-icons/fa';
// import { BsArrowRight } from 'react-icons/bs';
import SearchComponent from './searchComponent';


const TeacherComponent = ({ teacher }) => {

    let [subject, setSubject] = useState('');
    let [selectedStudents, setSelectedStudents] = useState([]);
    let [selectedFile, setSelectedFile] = useState(null);


    const handleClick = async (event) => {
        event.preventDefault();
        // setSelectedFile(event.target.files[0]);

        const data = new FormData();
        data.append('file', selectedFile);
        data.append('subject', subject);
        data.append('selectedStudents', [selectedStudents]);
        data.append('teacher', teacher);


        await fetch('https://tctest-api.herokuapp.com/api/add-class', {
            method: 'POST',
            body: data
        });
    }

    const uploadFile = async (event) => {
        // console.log(event.target.files[0]);
        setSelectedFile(event.target.files[0]);
    }

    const clickedStudent = (event) => {
        // console.log(event);
        // const student = name;
        setSelectedStudents([...selectedStudents, event.target.innerHTML]);
    }


    return (
        <>

            <div className={`${styles.box}`}>
                {/* <div className={`${styles.classDetails}`}> */}
                <form className={`${styles.loginForm}`} encType="multipart/form-data">
                    <h2>Add new class</h2>
                    <div className={`${styles.formGroup}`}>
                        <div><label>Subject</label></div>
                        <div className={`${styles.userIcon}`}>
                            {/* <span>< FaUserAlt /></span> */}
                            <input type="text" placeholder='Subject' value={subject} onChange={(e) => setSubject(e.target.value)} />
                        </div>
                    </div>
                    <div className={`${styles.formGroup}`}>
                        <label>Students</label>
                        <SearchComponent addToList={clickedStudent} />
                    </div>
                    <div className={`${styles.formGroup}`}>
                        <label>Upload File</label>
                        <input type="file" name="file" onChange={uploadFile} />
                    </div>

                    <button type="submit" className={`${styles.btn}`} onClick={(e) => handleClick(e)} >Create new class</button>
                </form>
            </div>
            <div className={`${styles.box}`}>
                <div className={`${styles.classDetails}`}>
                    <h3 className={`${styles.listHeading}`}>Student List</h3>
                    <table className={`${styles.classList}`}>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Student Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                selectedStudents.map((element, key) =>
                                (
                                    <tr key={key}>
                                        <td>{key + 1}</td>
                                        <td>{element}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            {/* </div> */}
        </>
    );
}

export default TeacherComponent;