import { NACOS_CONFIG_METADATA, NACOS_CONFIG_CLIENT_METADATA } from "./nacos.config.constants";
import * as stripJsonComments from "strip-json-comments";

function defaultParser(data: string) {
    return JSON.parse(stripJsonComments(data), function(key, value) {
        if (typeof value === "string") {
            if (/^\d\d\d\d-\d\d-\d\dT|\s\d\d:\d\d:\d\d(\.\d\d\d)?Z?$/.test(value)) {
                return new Date(value);
            }
        }
        return value;
    });
}

export function Config(configId: string, group: string = "DEFAULT_GROUP", parser: Function = defaultParser) {
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
