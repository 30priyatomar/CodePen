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
                <div style={{margin:'60px 10px 10px 10px'}} >
                <button className={`${styles.btn} btn_primary`}>Enter Room</button>
                </div>
            </Link>
        </div>
    );
}

export default HomeComponent;