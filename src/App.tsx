/** @jsxImportSource theme-ui */
import React, {useEffect, useState} from 'react';
import useWebSocket, {ReadyState} from 'react-use-websocket';
import {ThemeUIProvider, Grid, useColorMode} from 'theme-ui'
import {MainChart} from "./MainChart";
import {initStatusProps, Controls} from "./Controls"
import {statusProps, usingProfileProps, profileNamesProps, profilesProps, timeTempProps} from './Props'
import {theme} from "./TheTheme"

// Example:  const WS_URL = 'ws://127.0.0.1:8081/status';
// This is needed if the server is running on a different machine than the browser.
let server: string = window.location.href
server = server.split(":")[1]
server = server.split(":")[0]
console.log(server)
const WS_URL = 'ws:' + server + ':8081';
console.log(WS_URL)

function App() {
    const [socketUrl, setSocketUrl] = useState(WS_URL + '/status');
    const {sendMessage,
        sendJsonMessage, readyState} = useWebSocket(socketUrl, {
        onOpen: () => {
            console.log('WebSocket connection established.');
            if (socketUrl.indexOf('storage') > -1) {
                sendMessage('GET')
            }
        },
        share: true,
        filter: () => false,
        retryOnError: true,
        shouldReconnect: () => true,
        onMessage: (event: WebSocketEventMap['message']) => processMessages(event)
    });

    useEffect(() => {
        if (readyState === ReadyState.OPEN) {
            sendMessage('');
            console.debug('sendMessage')
        }
    }, [sendMessage, readyState]);

    useEffect(() => {
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage({});
            console.debug('sendJasonMessage')
        }
    }, [sendJsonMessage, readyState]);

    const [timesTemps, setTimesTemps] = useState<timeTempProps>([]);
    const [profileData, setProfile] = useState<timeTempProps>([]);
    const [status, setStatus] = useState<statusProps>(initStatusProps)
    const [profileNames, setProfileNames] = useState<profileNamesProps>([]);
    const [profiles, setProfiles] = useState<profilesProps>([]);

    let initProfile: usingProfileProps = {name: 'None', data: []}
    const [usingProfile, setUsingProfile] = useState<usingProfileProps>(initProfile);

    const processMessages = (event: { data: string; }) => {
        try {
            const response = JSON.parse(event.data);
            console.debug(response)

            if (profileNames.length < 1) { // No list of profile names, switch websockets to get them.
                setSocketUrl(WS_URL + '/storage')
                if (response[0].name) {
                    let theProfiles: profilesProps = []
                    for (let i = 0; i < response.length; i++) {
                        setProfileNames(profileNames => [...profileNames, response[i]])
                        let profileName: string = response[i].name
                        let segments: timeTempProps = []
                        response[i].data.forEach((segment: number[]) => {
                            let thisSegment = {"time": segment[0] * 1000, "temperature": segment[1]}
                            setProfile(profileData => [...profileData, thisSegment])
                            segments.push(thisSegment)
                            console.debug(thisSegment)
                        })
                        let thisProfile = {"name": profileName, "data": segments}
                        console.debug(thisProfile)
                        theProfiles.push(thisProfile)
                        // setProfiles(profiles => [profiles, ...thisProfile)
                    }
                    console.debug(theProfiles)
                    setProfiles(profiles => theProfiles)
                    setUsingProfile(usingProfile => theProfiles[0])
                    console.debug(profiles)
                    setSocketUrl(WS_URL + '/status')
                }
            }

            if (response.runtime) {
                let newtime: number = response.runtime * 1000 //moment needs milliseconds, show actual times in the charts
                let newtemp: number = response.temperature
                let tt = {"time": newtime, "temperature": newtemp}
                setTimesTemps(timesTemps => [...timesTemps, tt])
            } else if (response.profile) { // This is from the Backlog message.
                response.profile.data.forEach((segment: number[]) => {
                    let thisSegment = {"time": segment[0] * 1000, "temperature": segment[1]}
                    setProfile(profileData => [...profileData, thisSegment])
                })
                console.debug(profileData)
            }

        } catch (e) {
            console.warn("Not a JSON message (?) " + e);
        }
    };
    // {
    //   "cost": 1.109707095827976,
    //     "runtime": 15550.60239,
    //     "temperature": 1050.8827333811785,
    //     "target": 1050.72998473,
    //     "state": "RUNNING",
    //     "heat": 0.9242447578287815,
    //     "heat_rate": 345.049584101278,
    //     "totaltime": 48780,
    //     "kwh_rate": 0.1319,
    //     "currency_type": "$",
    //     "profile": "cone-6-long-glaze",
    //     "pidstats": {
    //   "time": 1705873257,
    //       "timeDelta": 2.01467,
    //       "setpoint": 1050.72998473,
    //       "ispoint": 1050.6888458995468,
    //       "err": 0.04113883045329203,
    //       "errDelta": -0.0003263665997372329,
    //       "p": 1.0284707613323008,
    //       "i": 45.24904045005422,
    //       "d": -0.06527331994744658,
    //       "kp": 25,
    //       "ki": 10,
    //       "kd": 200,
    //       "pid": 46.212237891439074,
    //       "out": 0.46212237891439073
    // }

    return (
        <ThemeUIProvider theme={theme}>
            {Controls(timesTemps, status, profileNames, profiles)}
            <Grid gap={1} columns={[1, 1, 2]} margin={1}>
                {MainChart(timesTemps, usingProfile, "black")}
            </Grid>
            <ColorModeButton/>
        </ThemeUIProvider>
    );
}

function ColorModeButton() {
    const [mode, setMode] = useColorMode()
    // let color_mode = mode
    return (
        <button
            onClick={(e) => {
                const next = mode === 'dark' ? 'light' : 'dark'
                setMode(next)
            }}
        >Mode</button>
    )
}

export default App;
