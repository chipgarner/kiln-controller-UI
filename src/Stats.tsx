import {statusProps, timeTempProps} from "./Props";
import labelledeNumber from "./labelledeNumber";

export function Stats (status: statusProps){
 return (
     <>

         {labelledeNumber('Target', Math.round(status.target))}
         {labelledeNumber('State', status.state)}
     </>
)
}

// function getLastTimeTempElement(array: timeTempProps): Number  {
//     if (array.length === 0) return -1;
//     return array[array.length - 1].temperature;
// }
