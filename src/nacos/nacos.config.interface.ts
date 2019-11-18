import { ClientOptions as ClientOptionsNative } from "nacos";

export interface OnConfigUpdate {
    onConfigUpdate(config: any, configId: string, group: string): any;
}

export type ClientOptions = ClientOptionsNative & {
    leaderPort?: number;
};
