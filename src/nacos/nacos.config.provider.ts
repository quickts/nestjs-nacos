import { Provider } from "@nestjs/common";
import { NacosConfigOptions } from "./nacos.config.interface";
import { NACOS_CONFIG_OPTION } from "./nacos.config.constants";

export function createProvider(nacosConfigOptions: NacosConfigOptions): Provider<NacosConfigOptions> {
    return {
        provide: NACOS_CONFIG_OPTION,
        useValue: nacosConfigOptions
    };
}
