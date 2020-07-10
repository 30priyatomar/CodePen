import React from 'react';
import Draggable from 'react-draggable';
import styles from './main.module.css';
import { Row, Col } from 'antd';

const VideoChatComponent = props => {
    const { draggableRef,
        remoteRef,
        localRef,
        peerConnected,
        controls,
        gotMediaDevice,
        connecting,
        toggleVideo,
        toggleAudio,
        createOffer,
    } = props;
    console.log(localRef.current, peerConnected)
    return (
        <Draggable nodeRef={draggableRef} >
            <div className={styles.outer} ref={draggableRef}>
                <div className={styles.remote}>
                    <video
                        className={styles.remoteVideo}
                        ref={remoteRef}
                        autoPlay={true}
                        muted={!peerConnected}>
                    </video>
                    {connecting && <div className={styles.overlay}>
                        <h2>Connecting...</h2>
                    </div>}
                    <div className={styles.local}>
                        <video
                            className={styles.localVideo}
                            ref={localRef}
                            autoPlay={true}
                            muted={true}>
                        </video>
                    </div>
                    {peerConnected &&
                        <div className={styles.controls}>
                            <Row>
                                <Col span={12}>
                                    <button className="btn_primary" onClick={toggleVideo}>
                                        {controls.video ? "Video On" : "Video Off"}
                                    </button>
                                </Col>
                                <Col span={12}>
                                    <button className="btn_primary" onClick={toggleAudio}>
                                        {controls.audio ? "Audio On" : "Audio Off"}
                                    </button>
                                </Col>
                            </Row>
                        </div>
                    }
                    {gotMediaDevice && !peerConnected &&
                        <div className={styles.connect}>
                            <button
                                className="btn_primary"
                                onClick={createOffer}
                            >
                                start
                                </button>
                        </div>

                    }
                </div>

            </div>
        </Draggable>
    );
}

export default VideoChatComponent;