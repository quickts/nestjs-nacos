import { NACOS_CONFIG_METADATA } from "./nacos.config.constants";

export function Config(configId: string, group: string, options?: any) {
    return (target: any, propertyKey: string | symbol) => {
        Reflect.set(target, propertyKey, null);
        Reflect.defineMetadata(NACOS_CONFIG_METADATA, { configId, group, options }, target, propertyKey);
    };
}
