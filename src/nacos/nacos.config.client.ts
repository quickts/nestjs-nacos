import { Injectable, Inject, OnModuleInit, Logger } from "@nestjs/common";
import { ModulesContainer } from "@nestjs/core/injector/modules-container";
import { NACOS_CONFIG_OPTION, NACOS_CONFIG_METADATA } from "./nacos.config.constants";
import { NacosConfigOptions } from "./nacos.config.interface";
import { NacosConfigClient as ConfigClient } from "nacos";

@Injectable()
export class NacosConfigClient extends ConfigClient implements OnModuleInit {
    private readonly logger = new Logger("NacosConfigClient");
    constructor(private readonly modulesContainer: ModulesContainer, @Inject(NACOS_CONFIG_OPTION) options: NacosConfigOptions) {
        super(options);
    }

    scanInstances(cb: (instance: any) => void) {
        this.modulesContainer.forEach(({ controllers, providers }) => {
            controllers.forEach(({ instance }) => {
                if (instance && typeof instance === "object") {
                    cb(instance);
                }
            });
            providers.forEach(({ instance }) => {
                if (instance && typeof instance === "object") {
                    cb(instance);
                }
            });
        });
    }

    scanPropertyMetadates(metaKey: any, cb: (instance: any, propertyKey: string, metadata: any) => void) {
        this.scanInstances((instance: any) => {
            for (const propertyKey in instance) {
                const metadata = Reflect.getMetadata(metaKey, instance, propertyKey);
                if (metadata) {
                    cb(instance, propertyKey, metadata);
                }
            }
        });
    }

    onModuleInit() {
        this.logger.log("Initializing...");
        this.scanPropertyMetadates(NACOS_CONFIG_METADATA, (instance, propertyKey, metadata) => {
            this.subscribe(
                {
                    dataId: metadata.configId,
                    group: metadata.group
                },
                (content: string) => {
                    this.logger.log(`Config Config! group: ${metadata.group} configId: ${metadata.configId}`);
                    this.logger.log(content);
                    const config = metadata.parser(content);
                    instance[propertyKey] = config;
                }
            );

            this.logger.log(`Subscribed Config! group: ${metadata.group} configId: ${metadata.configId}`);
        });
    }
}
