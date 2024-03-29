/** @jsxImportSource theme-ui */
import {
    CartesianGrid,
    ComposedChart,
    Line, LineChart,
    ResponsiveContainer,
    XAxis,
    YAxis
} from "recharts";
import moment from "moment/moment";
import { Box  } from 'theme-ui'
import {timeTempProps, usingProfileProps} from "./Props";

export function MainChart(tempData: timeTempProps,
                          usingProfile: usingProfileProps,
                          grid_fill_color: string) {
    return (
        <Box color="text" bg="background"
             sx={{
                 padding: '25px',
                 border: '5px solid',
                 borderColor: 'secondary',
                 width: '80%'
             }}>
            <strong style={{paddingLeft: "45%", fontSize: "40px"}}>Title Here</strong>
            <ResponsiveContainer width="100%" aspect={2}>
                <LineChart
                    data={tempData}
                    barCategoryGap={0}
                    margin={{top: 20, right: 0, left: 0, bottom: 0}}>
                    {/*<text x={500 / 2} y={20} fill="red" textAnchor="middle" dominantBaseline="central">*/}
                    {/*    <tspan fontSize="40">Title</tspan>*/}
                    {/*</text>*/}
                    <CartesianGrid strokeDasharray="4" fill={grid_fill_color}/>
                    <XAxis dataKey="time"
                           label={{value: 'Time', position: 'bottom'}}
                           domain={[0, 'auto']}
                        // allowDataOverflow={false}
                        // tickFormatter = {(zeroTime) => String(Math.round(zeroTime /3600000))}
                        // ticks = {[0, 1, 2, 3, 4, 5, 6, 7]}
                        // interval = {0}
                        // minTickGap={3}
                           type="number"
                           includeHidden={true}/>
                    <YAxis yAxisId="left-axis"
                           label={{
                               value: 'Temperature',
                               angle: -90,
                               position: 'insideLeft',
                           }}/>
                    <Line yAxisId="left-axis"
                          type="linear"
                          data={usingProfile.data}
                          isAnimationActive={false}
                          strokeWidth={3}
                          dataKey="temperature"
                          stroke="#999999"
                          dot={false}/>
                    <Line yAxisId="left-axis"
                          type="linear"
                          data={tempData}
                          isAnimationActive={true}
                          strokeWidth={3}
                          dataKey="temperature"
                          stroke="#fcae05"
                          dot={false}/>

                </LineChart>
            </ResponsiveContainer>
        </Box>

    );
}
