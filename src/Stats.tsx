import {statusProps} from "./Props";
import labelledeNumber from "./labelledeNumber";
import {Example} from "./PieNeedle";

export function Stats (status: statusProps){
    const ttg = new Date(status.time_to_go * 1000).toISOString().slice(11, 19)
    const temp_error:number = (status.temperature - status.target) * 5 + 50

 return (
     <>
         {labelledeNumber('State', status.state)}
         {labelledeNumber('Temp.', Math.round(status.temperature))}
         {labelledeNumber('Target', Math.round(status.target))}
         {labelledeNumber('Heat Rate', Math.round(status.heat_rate))}
         {labelledeNumber('Cost', status.cost.toFixed(2))}
         {labelledeNumber('Time Remaining', ttg)}

         {Example(heat_percent(status.pid), pid_data)}
         {Example(temp_error, temp_error_data)}
     </>
)

}

function heat_percent(pid: number) {
    if (pid > 100) {
        return 100
    }
    else if (pid < 0) {
        return 0
    }
    else {
        return pid
    }
}


const pid_data = [
    { name: 'A', value: 80, color: '#ff5000' },
];

const temp_error_data = [
    { name: 'A', value: 45, color: '#ff0000' },
    { name: 'B', value: 27, color: '#ffff00' },
    { name: 'C', value: 36, color: '#00ff00' },
    { name: 'D', value: 27, color: '#ffff00' },
    { name: 'E', value: 45, color: '#ff0000' },
];