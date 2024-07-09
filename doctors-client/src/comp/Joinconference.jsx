import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const JoinConference = () => {
    const conf = useParams();
    const conf_id = conf.conference_id;
    const [slotId, setSlotId] = useState(conf_id); 
    const [conference, setConference] = useState(null);

    console.log("conf--", conf_id);

    const handleJoin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`http://localhost:8000/${slotId}`);
            setConference(res.data);
        } catch (err) {
            console.error(err);
            setConference(null);
        }
    };

    useEffect(() => {
        if (conf_id) {
            setSlotId(conf_id);
        }
    }, [conf_id]);

    useEffect(() => {
        if (conference) {
            const domain = 'meet.jit.si';
            const options = {
                roomName: conference.slotId,
                width: '100%',
                height: '100%',
                parentNode: document.querySelector('#jitsi-container'),
                interfaceConfigOverwrite: {
                    SHOW_JITSI_WATERMARK: false,
                    DEFAULT_REMOTE_DISPLAY_NAME: 'Guest',
                    SHOW_BRAND_WATERMARK: false,
                    SHOW_POWERED_BY: false,
                    TOOLBAR_BUTTONS: [
                        'microphone', 'camera', 'desktop', 'fullscreen',
                        'fodeviceselection', 'hangup', 'profile', 'chat',
                        'recording', 'livestreaming', 'etherpad', 'sharedvideo',
                        'settings', 'raisehand', 'videoquality', 'filmstrip',
                        'invite', 'feedback', 'stats', 'shortcuts',
                        'tileview', 'videobackgroundblur', 'download', 'help'
                    ]
                }
            };
            const api = new window.JitsiMeetExternalAPI(domain, options);

            api.addEventListener('videoConferenceJoined', () => {
                const iframe = document.querySelector('#jitsi-container iframe');
                if (iframe.requestFullscreen) {
                    iframe.requestFullscreen();
                } else if (iframe.mozRequestFullScreen) {
                    iframe.mozRequestFullScreen();
                } else if (iframe.webkitRequestFullscreen) {
                    iframe.webkitRequestFullscreen();
                } else if (iframe.msRequestFullscreen) {
                    iframe.msRequestFullscreen();
                }
            });
        }
    }, [conference]);

    return (
        <div style={styles.container}>
            {!conference && (
                <>
                    <h1 style={styles.heading}>Join Conference</h1>
                    <form onSubmit={handleJoin} style={styles.form}>
                        <input
                            type="text"
                            value={slotId}
                            onChange={(e) => setSlotId(e.target.value)}
                            placeholder="Enter Slot ID"
                            required
                            style={styles.input}
                        />
                        <button type="submit" style={styles.button}>Join</button>
                    </form>
                </>
            )}
            {conference && (
                <div style={styles.conferenceContainer}>
                    <h2>{conference.title}</h2>
                    <div id="jitsi-container" style={styles.jitsiContainer}></div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#f0f2f5',
    },
    heading: {
        color: '#333',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '20px',
    },
    input: {
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        width: '200px',
    },
    button: {
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#007bff',
        color: '#fff',
        cursor: 'pointer',
    },
    conferenceContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
    },
    jitsiContainer: {
        width: '100%',
        height: '80vh',
        marginTop: '20px',
        borderRadius: '5px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    }
};

export default JoinConference;