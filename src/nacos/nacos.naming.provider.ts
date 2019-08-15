import { Provider } from "@nestjs/common";
import { NacosNamingOptions } from "./nacos.interface";
import { NACOS_NAMING_OPTION } from "./nacos.naming.constants";

export function createProvider(nacosNamingOptions: NacosNamingOptions): Provider<NacosNamingOptions> {
    return {
        provide: NACOS_NAMING_OPTION,
        useValue: nacosNamingOptions
    };
}
