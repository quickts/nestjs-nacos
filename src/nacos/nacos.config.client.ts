import { NacosConfigClient as NacosConfigClientNative } from "nacos";
import { ClientOptions } from "./nacos.config.interface";

export class NacosConfigClient extends NacosConfigClientNative {
    constructor(options: ClientOptions) {
        super(options);
    }
    get clusterOptions() {
        const host = this.options.endpoint;
        return {
            name: `DiamondClient@${host}`,
            port: this.options.leaderPort || 7777
        };
    }
}
