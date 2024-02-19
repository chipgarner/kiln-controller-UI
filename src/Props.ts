
export type profileNamesProps = {
    name: string;
}[];

export type statusProps = {
    'state': string,
    'temperature': number,
    'target': number,
    'pid': number
    'heat_rate': number,
    'cost': number,
    'time_to_go': number,
}

export function initStatusProps() {
    let sprops: statusProps
    sprops = {
        'state': 'Off',
        'temperature': -99,
        'target': -99,
        'pid': 0,
        'heat_rate': 0,
        'cost': 0,
        'time_to_go': 0
    }
    return sprops
}

export type timeTempProps = {
    time: number;
    temperature: number;
}[];

export type profilesProps = {
    name: string;
    data: timeTempProps;
}[];


export type usingProfileProps = {
    name: string;
    data: timeTempProps;
};