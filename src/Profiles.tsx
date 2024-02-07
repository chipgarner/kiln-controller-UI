/** @jsxImportSource theme-ui */
import {Grid} from "theme-ui"
import {profilesProps, usingProfileProps, timeTempProps} from "./Props";
import {Select} from "theme-ui";
import {statusProps} from "./Props";
import {ProfileTable} from "./ProfileTable"
import {ProfileChart} from "./ProfileChart"

export function initStatusProps() {
    let sprops: statusProps
    sprops = {
        'state': 'Off',
        'target': -99,
        'heat_rate': 0,
        'label': 'Not Connected',
        'StartStop': 'Start',
    }
    return sprops
}

export function Profiles(timesTemps: timeTempProps,
                         kilnStatus: statusProps,
                         usingProfile: usingProfileProps,
                         profiles: profilesProps,
                         updateUsingProfile: any) {

    function handleProfileSelected(event: React.ChangeEvent<HTMLSelectElement>) {
        console.debug(event)
        if (event.target !== undefined && usingProfile.name !== "None") {
            if (usingProfile.name !== event.target.value) {
                profiles.forEach((profile: usingProfileProps) => {
                    if (profile.name === event.target.value) {
                        updateUsingProfile(profile)
                    }
                })
            }
        }
    }

    return (
        <div>
        <div
            sx={{
                display: 'flex',
            }}>
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
        </div>

            <Grid gap={1} columns={[1, 1, 2]} margin={1}>
                {ProfileChart(usingProfile.data, "whatever")}
                {ProfileTable(usingProfile.data)}
            </Grid>

        </div>
    )
}

