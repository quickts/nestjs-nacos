import { Provider } from "@nestjs/common";
import { NacosInstanceOptions } from "./nacos.interface";
import { NACOS_INSTANCE_OPTION } from "./nacos.instance.constants";

export function createProvider(nacosInstanceOptions: NacosInstanceOptions): Provider<NacosInstanceOptions> {
    return {
        provide: NACOS_INSTANCE_OPTION,
        useValue: nacosInstanceOptions
    };
}
