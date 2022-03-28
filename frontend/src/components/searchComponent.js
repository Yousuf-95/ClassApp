import React, { useState } from 'react';
import styles from '../styles/searchComponent.module.css';
import {debounce} from 'lodash';
// import { FaSearch, FaTimes } from 'react-icons/fa';



const SearchComponent = ({ addToList }) => {

    const [filteredData, setFilteredData] = useState([]);

    const handleFilter = async (event) => {
        const searchWord = event.target.value;
        // const newFilter = data.filter((value) => {
        //     return value.title.includes(searchWord);
        // });
        const result = await fetch('https://tctest-api.herokuapp.com/api/get-students', {
            method: 'POST',
            body: JSON.stringify({ searchWord }),
            headers: {
                "content-type": "application/json"
            }
        });
        const { students } = await result.json();
        // console.log(students);
        if (searchWord === '')
            setFilteredData([]);
        else
            setFilteredData(students);
    };

    return (
        <div className={`${styles.search}`}>
            <div className={`${styles.searchInputs}`}>
                <input type="text" placeholder="Enter students' name" onChange={debounce(handleFilter,300)} />
                {/* <div className={`${styles.searchIcon}`}>
                    {filteredData.length === 0 ? <FaSearch /> : <FaTimes />} 
                </div> */}
            </div>
            {
                filteredData.length !== 0 && (<div className={`${styles.dataResult}`}>
                    {filteredData.map((element, key) => {
                        return (<div key={key} value={element.firstName + ' ' + element.lastName} className={`${styles.dataItem}`} onClick={(e) => addToList(e)}>
                            {element.firstName + ' ' + element.lastName}
                        </div>)
                    })}
                </div>)
            }
        </div>
    );
}

export default SearchComponent;