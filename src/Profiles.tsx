/** @jsxImportSource theme-ui */
import {Grid} from "theme-ui"
import {profilesProps, usingProfileProps, timeTempProps} from "./Props";
import {Select} from "theme-ui";
import {ProfileTable} from "./ProfileTable"
import {ProfileChart} from "./ProfileChart"
import {useEffect, useState} from "react";
import useWebSocket, {ReadyState} from "react-use-websocket";
import labelledeNumber from "./labelledeNumber";

let server: string = window.location.href
server = server.split(":")[1]
server = server.split(":")[0]
// server = '//192.168.1.91'
const WS_URL = 'ws:' + server + ':8081';

export function Profiles(usingProfile: usingProfileProps, state: string, updateUsingProfile: any) {
    const [profiles, setProfiles] = useState<profilesProps>([]);
    const [socketUrl,] = useState(WS_URL + '/storage');
    const {
        sendMessage, readyState
    } = useWebSocket(socketUrl, {
        onOpen: () => {
            console.log('WebSocket connection established: ' + socketUrl);
        },
        share: true,
        filter: () => false,
        retryOnError: true,
        shouldReconnect: () => false,
        onMessage: (event: WebSocketEventMap['message']) => processMessages(event),
        onClose: (): void => {
            console.debug('Socket closed: ' + socketUrl)
        }
    });

    useEffect(() => {
        if (readyState === ReadyState.OPEN) {
            if (profiles.length < 1) { // No list of profile names, get them from the server.
                sendMessage('GET');
                console.debug('sendMessage')
            }
        }
    }, [sendMessage, readyState]);

    const processMessages = (event: { data: string; }) => {
        try {
            const response = JSON.parse(event.data);
            console.debug(response)
            if (response[0].name) {
                let theProfiles: profilesProps = []
                for (let i = 0; i < response.length; i++) {
                    let profileName: string = response[i].name
                    let segments: timeTempProps = []
                    response[i].data.forEach((segment: number[]) => {
                        let thisSegment = {"time": segment[0] / 3600, "temperature": segment[1]}
                        segments.push(thisSegment)
                    })
                    let thisProfile = {"name": profileName, "data": segments}
                    theProfiles.push(thisProfile)
                }
                setProfiles(profiles => theProfiles)
            }
        } catch (e) {
            console.warn("Not a JSON message from ws storage " + e);
        }
    }

    function handleProfileSelected(event: React.ChangeEvent<HTMLSelectElement>) {
        console.debug(event)
        console.debug(usingProfile)
        if (event.target !== undefined) {
            if (usingProfile.name !== event.target.value) {
                profiles.forEach((profile: usingProfileProps) => {
                    if (profile.name === event.target.value) {
                        updateUsingProfile(profile)
                    }
                })
            }
        }
    }

    function showChoiceOrProfile(): React.JSX.Element {
        if (state === 'RUNNING') {
            return (<div sx={{display: 'flex',}}>
                {labelledeNumber('Using Profile', usingProfile.name)}
            </div>)
        }
        return (
            <div>
                <div sx={{display: 'flex',}}>
                    {labelledeNumber('Using Profile', usingProfile.name)}
                    <Select onChange={handleProfileSelected}
                            bg={'primary'}
                            sx={{
                                fontSize: ['10px', '30px', '30px'],
                                fontWeight: 'bold',
                                // width: '350px',
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
                        {profiles.slice(0).map((category) => (
                            <option>
                                {category.name}
                            </option>
                        ))
                        }
                    </Select>
                </div>

                <Grid gap={1} columns={[1, 1, 2]} margin={1}>
                    {ProfileChart(usingProfile.data, "whatever")}
                    {ProfileTable(usingProfile.data)}
                </Grid>
            </div>
        )
    }

    return (
        <div>
            <div sx={{display: 'flex',}}>

                {showChoiceOrProfile()}

            </div>

        </div>
    )
}

