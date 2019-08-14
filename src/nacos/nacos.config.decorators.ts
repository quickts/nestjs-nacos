import { NACOS_CONFIG_METADATA, NACOS_CONFIG_CLIENT_METADATA } from "./nacos.config.constants";

export function Config(configId: string, group: string = "DEFAULT_GROUP", parser: Function = JSON.parse) {
    return (target: any, propertyKey: string | symbol) => {
        Reflect.set(target, propertyKey, null);
        Reflect.defineMetadata(NACOS_CONFIG_METADATA, { configId, group, parser }, target, propertyKey);
    };
}

export function ConfigClient() {
    return (target: any, propertyKey: string | symbol) => {
        Reflect.set(target, propertyKey, null);
        Reflect.defineMetadata(NACOS_CONFIG_CLIENT_METADATA, true, target, propertyKey);
    };
}
