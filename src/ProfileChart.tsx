/** @jsxImportSource theme-ui */
import {CartesianGrid,
    ComposedChart,
    Line,
    ResponsiveContainer,
    XAxis,
    YAxis} from "recharts";
import { Box  } from 'theme-ui'
import React from "react";
import {timeTempProps} from './Props'

export function ProfileChart(
                          profileData: timeTempProps,
                          grid_fill_color: string) {
    return (
        <Box color="text" bg="background"
             sx={{
                 padding: '25px',
                 border: '5px solid',
                 borderColor: 'secondary',
                 width: '100%'
             }}>
            <ResponsiveContainer width = "100%" aspect={2} >
                <ComposedChart
                    data={profileData}>
                    <CartesianGrid strokeDasharray="4" fill={grid_fill_color}/>
                    <XAxis dataKey="time"
                           label={{ value: 'Time', position: 'bottom'}}
                           domain={[0, "auto"]}
                           allowDataOverflow={false}
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
                          stroke="#fcae05"
                          dot={false} />
                </ComposedChart>
            </ResponsiveContainer>
         </Box>

    );}
