import { Provider } from "@nestjs/common";
import { NacosInstanceOptions, NacosInstanceAsyncOptions } from "./nacos.interface";
import { NACOS_INSTANCE_OPTION } from "./nacos.instance.constants";

export function createProvider(nacosInstanceOptions: NacosInstanceOptions): Provider<NacosInstanceOptions> {
    return {
        provide: NACOS_INSTANCE_OPTION,
        useValue: nacosInstanceOptions
    };
}

export function createAsyncProvider(options: NacosInstanceAsyncOptions): Provider {
    return {
        provide: NACOS_INSTANCE_OPTION,
        useFactory: options.useFactory,
        inject: options.inject || [],
    };
}