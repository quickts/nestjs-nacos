import { Injectable, Inject } from "@nestjs/common";
import { NestContainer } from "@nestjs/core";
import { NACOS_CONFIG_OPTION, NACOS_CONFIG_METADATA } from "./nacos.config.constants";
import { NacosConfigOptions } from "./nacos.config.interface";
import { NacosConfigClient as ConfigClient } from "nacos";

@Injectable()
export class NacosConfigClient extends ConfigClient {
    constructor(@Inject(NACOS_CONFIG_OPTION) options: NacosConfigOptions) {
        super(options);
    }

    initialize(container: NestContainer) {
        this.scanContorller(container, (instance: any) => {
            if (typeof instance !== "object") {
                return;
            }
            this.reflectConfigMetadata(instance);
        });

        this.scanProvider(container, (instance: any) => {
            if (typeof instance !== "object") {
                return;
            }
            this.reflectConfigMetadata(instance);
        });
    }

    private scanContorller(container: NestContainer, cb: (instance: any) => void) {
        container.getModules().forEach(({ controllers }) => {
            controllers.forEach(({ instance }) => {
                if (instance) {
                    cb(instance);
                }
            });
        });
    }

    private scanProvider(container: NestContainer, cb: (instance: any) => void) {
        container.getModules().forEach(({ providers }) => {
            providers.forEach(({ instance }) => {
                if (instance) {
                    cb(instance);
                }
            });
        });
    }

    private reflectConfigMetadata(instance: any) {
        if (typeof instance !== "object") {
            return;
        }
        for (const propertyKey in instance) {
            const metadata = Reflect.getMetadata(NACOS_CONFIG_METADATA, instance, propertyKey) as {
                configId: string;
                group: string;
                options?: any;
            };
            if (!metadata) {
                continue;
            }
            Object.defineProperty(instance, propertyKey, {
                configurable: true,
                enumerable: true,
                get: () => {
                    // this.getConfig(metadata.configId, metadata.group, metadata.options);
                }
            });
            // let setterArr = this.allConfigHandler.get(configName);
            // if (!setterArr) {
            //     setterArr = [];
            //     this.allConfigHandler.set(configName, setterArr);
            //     this.logger.log(`Watch config '${configName}'`);
            // }
            // setterArr.push((config: any) => {
            //     Reflect.set(instance, propertyKey, config);
            // });
        }
    }
}
