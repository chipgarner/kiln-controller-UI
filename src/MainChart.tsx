/** @jsxImportSource theme-ui */
import {CartesianGrid,
    ComposedChart,
    Line,
    ResponsiveContainer,
    XAxis,
    YAxis} from "recharts";
import moment from "moment/moment";
import { Box  } from 'theme-ui'
import React from "react";


export type timeTempProps = {
    time: number;
    temperature: number;
}[];

export function MainChart(tempData: timeTempProps,
                          profileData: timeTempProps,
                          grid_fill_color: string) {
    return (
        <Box color="text" bg="background"
             sx={{
                 padding: '25px',
                 border: '5px solid',
                 borderColor: 'secondary',
             }}>
            <ResponsiveContainer width = "100%" aspect={2} >
                <ComposedChart
                    data={tempData}
                    barCategoryGap={0}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }} >
                    <CartesianGrid strokeDasharray="4" fill={grid_fill_color}/>
                    <XAxis dataKey="time"
                           label={{ value: 'Time', position: 'bottom'}}
                           domain={["auto", "auto"]}
                           // allowDataOverflow={false}
                           tickFormatter = {(unixTime) => moment(unixTime).format('HH.mm')}
                           type="number"
                           includeHidden={true}/>
                    <YAxis yAxisId="left-axis"
                           label={{ value: 'Temperature',
                               angle: -90,
                               position: 'insideLeft',
                           }}/>
                    <Line yAxisId="left-axis"
                          type="linear"
                          data={profileData}
                          isAnimationActive={false}
                          strokeWidth={3}
                          dataKey="temperature"
                          stroke="#999999"
                          dot={false} />
                    <Line yAxisId="left-axis"
                          type="linear"
                          data={tempData}
                          isAnimationActive={true}
                          strokeWidth={3}
                          dataKey="temperature"
                          stroke="#fcae05"
                          dot={false} />

                </ComposedChart>
            </ResponsiveContainer>
        </Box>

    );}
