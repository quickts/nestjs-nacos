export interface NacosClientOptions {
    serverList?: string | string[];
    namespace?: string;
    ssl?: boolean;
    ak?: string;
    sk?: string;
    appName?: string;
    endpoint?: string;
    vipSrvRefInterMillis?: number;
}

export interface NacosInstanceOptions {
    serviceName: string;
    clusterName?: string;
    groupName?: string;
    ip: string;
    port: number;
    weight?: number;
    valid?: boolean;
    healthy?: boolean;
    enabled?: boolean;
    ephemeral?: boolean;
}

export interface NacosNamingOptions {
    clientOptions: NacosClientOptions;
    instanceOptions: NacosInstanceOptions;
}

export interface NacosInstance {
    instanceId: string;
    clusterName: string;
    serviceName: string;
    ip: string;
    port: number;
    weight: number;
    ephemeral: boolean;
    enabled: boolean;
    valid: boolean;
    marked: boolean;
    healthy: boolean;
    metadata: any;
}
