/** @jsxImportSource theme-ui */
import {Button, Grid} from "theme-ui"
import {profilesProps, usingProfileProps, timeTempProps} from "./Props";
import {Select} from "theme-ui";
import {statusProps} from "./Props";
import {ProfileTable} from "./ProfileTable"
import {ProfileChart} from "./ProfileChart"

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

function handleProfileSelected(event: React.ChangeEvent<HTMLSelectElement>) {
    let message = {'profile_name': event.target.value}
    console.debug(message)
    fetch(SERVER + 'api', {
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
        'StartStopDisabled': false,
        'ProfileName': 'None',
        'ProfileSelectDisabled': true,
    }
    return sprops
}

export function Controls(timesTemps: timeTempProps,
                         kilnStatus: statusProps,
                         usingProfile: usingProfileProps,
                         profiles: profilesProps) {

    return (
        <div
            sx={{
                display: 'flex',
            }}>
            {usingProfile.name}
            <Button disabled={kilnStatus.StartStopDisabled} onClick={handleClickStartStop}
                    sx={{width: '150px'}}>{kilnStatus.StartStop}</Button>

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
                {/*<option value="value" selected>Select Profile</option>*/}
                {profiles.slice(0).map((category) => (
                    <option>
                        {category.name}
                    </option>
                ))
                }
            </Select>

            <Grid gap={1} columns={[1, 1, 2]} margin={1}>
                {ProfileChart(usingProfile.data, "whatever")}
                {ProfileTable(usingProfile.data)}
            </Grid>



        </div>
    )
}
