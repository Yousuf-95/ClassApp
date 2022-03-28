import React from 'react';
import styles from '../styles/home.module.css'
// import mySVG from '../images/waves.svg';

const Home = () => {
    return(
        <section className={`${styles.showcase}`}>

            <div className={`${styles.container}`}>
                <div className={`${styles.showcaseContent}`}>
                    <h1>Schedule and view active classes</h1>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ea eum, nostrum, maxime voluptate esse rem officia, voluptatem quaerat velit nemo molestiae reiciendis ipsum fuga impedit.</p>
                </div>
            </div>
        </section>
    );
}

export default Home;