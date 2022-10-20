export declare type Requet = {
    url?: string;
    payload: {
        id: string;
        name: string;
    }[];
};
export declare function sendRequest(request: Requet): void;
