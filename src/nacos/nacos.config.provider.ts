import { Provider } from "@nestjs/common";
import { ClientOptions } from "nacos";
import { NACOS_CONFIG_OPTION } from "./nacos.config.constants";

export function createProvider(nacosConfigOptions: ClientOptions): Provider<ClientOptions> {
    return {
        provide: NACOS_CONFIG_OPTION,
        useValue: nacosConfigOptions
    };
}
