export interface NacosNamingOptions {
    serverList?: string | string[];
    namespace?: string;
    ssl?: boolean;
    ak?: string;
    sk?: string;
    appName?: string;
    endpoint?: string;
    vipSrvRefInterMillis?: number;
}
