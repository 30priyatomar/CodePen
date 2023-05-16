import React from 'react';
import { Link } from 'react-router-dom';
import styles from './main.module.css';

const HomeComponent = props => {
    const { createId } = props;
    return (
        <div className={styles.home}>
            <h1>CodePen ✏️</h1>
            <p className={styles.heading}>Collaborative code platform</p>
            <p className={styles.description}>Enter room to start</p>
            <Link to={`/${createId()}`}>
                <button className={`${styles.btn} btn_primary`}>Enter Room</button>
            </Link>
        </div>
    );
}

export default HomeComponent;