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
            };
            if (!metadata) {
                continue;
            }
            let config: any = null;
            Object.defineProperty(instance, propertyKey, {
                configurable: true,
                enumerable: true,
                get: () => {
                    return config;
                }
            });
            this.subscribe(
                {
                    dataId: metadata.configId,
                    group: metadata.group
                },
                (content: string) => {
                    config = JSON.parse(content);
                }
            );
        }
    }
}
