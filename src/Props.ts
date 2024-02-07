
export type profileNamesProps = {
    name: string;
}[];

export type statusProps = {
    'label': string,
    'StartStop': string,
    'state': string,
    'target': number,
    'heat_rate': number,
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