/** @jsxImportSource theme-ui */
import {Button} from "theme-ui";
import React, {useEffect, useState} from "react";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {usingProfileProps} from "./Props";

let server: string = window.location.href
server = server.split(":")[1]
server = server.split(":")[0]
const WS_URL = 'ws:' + server + ':8081';

export function Controls( state: string, usingProfile: usingProfileProps):React.JSX.Element{
    const [socketUrl,] = useState(WS_URL + '/control');
    const {
        sendMessage,
        sendJsonMessage, readyState
    } = useWebSocket(socketUrl, {
        onOpen: () => {console.log('WebSocket connection established: ' + socketUrl);},
        share: true,
        filter: () => false,
        retryOnError: false,
        shouldReconnect: () => true,
        onMessage: (event: WebSocketEventMap['message']) => processMessages(event),
        onClose: (): void => {console.debug('Socket closed: ' + socketUrl)}
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


    function doStartStop ():void {
        console.debug('Doing stop start')
        console.debug(state)
        if (state === 'IDLE') {
            // {"cmd":"RUN","profile":{"type":"profile","data":[[0,65],[600,200],[2088,250],[5688,250],[23135,1733],[28320,1888],[30900,1888]],"name":"cone-05-fast-bisque"}}
            let segments: number[][] = []
            usingProfile.data.forEach((timeTemp): void => {
                segments.push([timeTemp.time / 1000, timeTemp.temperature])
            })
            let command = {'cmd': 'RUN', 'profile': {'type': 'progfile', 'data':segments, 'name': usingProfile.name}}
            console.debug(command)
            sendMessage(JSON.stringify(command))
        }
        else if (state === 'RUNNING') {
            sendMessage(JSON.stringify({'cmd': 'STOP'}))
        }
    }

    const processMessages = (event: { data: string; }) => {
        const response = JSON.parse(event.data); // This is not expected, could delete the function
        console.debug("WS message in Controls: " + response)
    }

    return (
    <Button onClick={doStartStop}
    sx={{width: '150px'}}>{startStop(state)}</Button>

);
}

function startStop (state: string): string {
    if (state === 'RUNNING') {
        return 'Stop'
    }
    else {
        return 'Start'
    }
}
