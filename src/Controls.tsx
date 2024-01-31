/** @jsxImportSource theme-ui */
import React, {useEffect} from "react";
import {Button} from "theme-ui"
// import {Profiles} from './Profiles'
import useWebSocket, {ReadyState} from "react-use-websocket";
import {MainChart, timeTempProps} from "./MainChart";
import {Grid, Select} from "theme-ui";

let server: string = window.location.href
server = server.split(":")[1]
server = server.split(":")[0]
const SERVER = 'http:' + server + ':8081/'
export function handleClickStartStop() {
    // Send data to the backend via POST
    console.debug(SERVER)
    fetch( SERVER + 'start_stop', {
        mode: 'no-cors',
        method: 'POST',
    })
}

export type profileNamesProps = {
    name: string;
}[];

export type statusProps = {
    'label': string,
    'StartStop': string,
    'StartStopDisabled': boolean,
    'Manual': boolean,
    'ManualDisabled': boolean,
    'ProfileName': string,
    'ProfileSelectDisabled': boolean,
}

function handleProfileSelected(event: React.ChangeEvent<HTMLSelectElement>) {
    let message = {'profile_name': event.target.value}
    console.debug(message)
    fetch(SERVER + 'profile', {
        mode: 'no-cors',
        method: 'POST',
        body: JSON.stringify(message)
    })
}


export function initStatusProps() {
    let sprops: statusProps
    sprops = {
        'label': 'Not Connected',
        'StartStop': 'Start',
        'StartStopDisabled': true,
        'Manual': false,
        'ManualDisabled': true,
        'ProfileName': 'None',
        'ProfileSelectDisabled': true,
    }
    return sprops
}

const WS_URL =  'ws://localhost:8081'

export function Controls(timesTemps: timeTempProps,
                         kilnStatus: statusProps,
                         profileNames: profileNamesProps,
                         profileData: timeTempProps) {

    // const {sendMessage, readyState} = useWebSocket(WS_URL + '/storage', {
    //     onOpen: () => {
    //         console.log('Storage WebSocket connection established.');
    //         sendMessage('GET')
    //     },
    //     share: true,
    //     filter: () => false,
    //     retryOnError: true,
    //     shouldReconnect: () => false,
    //     onMessage: (event: WebSocketEventMap['message']) => processMessages(event)
    // });
    //
    // useEffect(() => {
    //     if (readyState === ReadyState.OPEN) {
    //         sendMessage('');
    //     }
    // }, [sendMessage, readyState]);

    const processMessages = (event: { data: string; }) => {
        console.log('Got a STORAGE message' + event.data)
        try {
            const response = JSON.parse(event.data);
            console.log('STORAGE ' + response.length)

            if (response[0].name) {
                for (let i = 0; i < response.length; i++) {
                    console.log(response[i].name)
                }
            }

        } catch (e) {
            console.warn("Storage ws, not a JSON message (?) " + e);
        }
    };
    console.debug(profileNames)

    return (
        <div
            sx={{
                display: 'flex',
            }}>
            <Button disabled={kilnStatus.StartStopDisabled} onClick={handleClickStartStop}
                    sx={{width: '150px'}}>{kilnStatus.StartStop}</Button>

            <Button disabled={kilnStatus.ProfileSelectDisabled}
                    sx={{width: '300px'}}>Profiles</Button>

            <Select onChange={handleProfileSelected}
                    bg={'primary'}
                    sx={{
                        fontSize: ['10px', '30px', '30px'],
                        fontWeight: 'bold',
                        width: '300px',
                        marginLeft: '2px',
                        marginRight: '2px',
                        '&:disabled': {
                            bg: 'muted',
                            '&:hover': {
                                bg: 'muted',
                                border: 'none',
                            },
                            '&:active': {
                                bg: 'muted'
                            }
                        },
                        '&:hover': {
                            bg: 'secondary',
                            border: '3px solid',
                            borderColor: 'primary'
                        },
                        '&:active': {
                            bg: 'red',
                        }
                    }}>
                <option value="value" selected>Select Profile</option>
                {profileNames.slice(1).map((category) => (
                    <option>
                        {category.name}
                    </option>
                ))
                }
            </Select>




        </div>
    )
}
