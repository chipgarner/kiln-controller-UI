/** @jsxImportSource theme-ui */
import React from "react";
import {timeTempProps} from "./Props";
import moment from "moment/moment";

export type profilePoints  = {
    time: number;
    temperature: number;
};

function showProfileData(profileData: timeTempProps) {

    if (profileData.length > 2) {
        let rows = []
        rows.push(
            <tr>{fillRow([moment(profileData[0]["time"] * 3600000).format('HH:mm:ss'),
                'Ambient',
                'Unknown',
                profileData[1]["temperature"],
                'Unknown'])}

            </tr>
        )

        for (let i = 0; i < profileData.length; i++) {
            if (i > 1) {
                rows.push(
                <tr>
                    {fillRow(segmentRowFromPoints(profileData[i - 1], profileData[i]))}
                </tr>
                )
            }
        }

        return rows
    }
}

function segmentRowFromPoints(time_temp_1: profilePoints, time_temp_2: profilePoints) {
    let segRow = [moment(time_temp_2["time"] * 3600000).format('HH:mm:ss'),
        time_temp_1["temperature"],
        ms_to_hr_min_sec((time_temp_2["time"] - time_temp_1["time"]) * 3600000),
            time_temp_2["temperature"],
            Math.round((time_temp_2["temperature"] - time_temp_1["temperature"])/
                ((time_temp_2["time"] - time_temp_1["time"])))]

    return segRow
}

function fillRow(items: (string|number)[]) {
    let row = []
    for (let item of items)
        row.push(<td
            sx={{
                paddingLeft: '15px',
                paddingRight: '15px'
            }}>{item}</td>)
    return row

}


export function ProfileTable(profileData: timeTempProps) {

    const columnLabels = ['Start Time', 'Start Temp', 'Duration', 'End Temp', 'Heating Rate']

    return (
        <table
            sx={{
                border: '5px solid',
                borderColor: 'secondary',
                marginLeft: 'auto',
                marginRight: 'auto',
                bg: 'contrastbg'
            }}>
            <thead>
            <tr>
                <th>
                    Firing Profile Segments
                </th>
            </tr>
            </thead>
<tbody
    sx={{
            bg: 'secondary',
        }}>
            <tr>
                {fillRow(columnLabels)}
            </tr>
            {showProfileData(profileData)}
</tbody>
        </table>
    )
}

function ms_to_hr_min_sec(ms: number) {
    let totalSeconds = Math.round(ms / 1000);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    let min = String(minutes).padStart(2, "0");
    let hr = String(hours).padStart(2, "0");
    let sec = String(seconds).padStart(2, "0");
    return (hr + ":" + min + ":" + sec);
}

