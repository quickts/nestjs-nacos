import { Injectable, Inject, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { ScannerService } from "@quickts/nestjs-scanner";
import { NACOS_CONFIG_OPTION, NACOS_CONFIG_METADATA, NACOS_CONFIG_CLIENT_METADATA } from "./nacos.config.constants";
import { NacosConfigClient, ClientOptions } from "nacos";

@Injectable()
export class NacosConfigService implements OnModuleInit, OnModuleDestroy {
    private configClient: NacosConfigClient = null;
    private readonly logger = new Logger("NacosConfigService");
    private readonly listeners = new Array<{ dataId: string; group: string; listener: Function }>();
    constructor(
        private readonly scannerService: ScannerService, //
        @Inject(NACOS_CONFIG_OPTION) private readonly options: ClientOptions
    ) {}

    async onModuleInit() {
        this.logger.log("Initializing...");
        this.configClient = new NacosConfigClient(this.options);
        await this.scannerService.scanProviderPropertyMetadates(NACOS_CONFIG_METADATA, async (instance, propertyKey, metadata) => {
            this.listeners.push({
                dataId: metadata.configId,
                group: metadata.group,
                listener: (content: string) => {
                    this.logger.log(`Config update! group: ${metadata.group} configId: ${metadata.configId}`);
                    this.logger.log(content);
                    try {
                        const config = metadata.parser(content);
                        instance[propertyKey] = config;
                    } catch (err) {
                        this.logger.error("Parser config error!");
                        this.logger.error(err);
                    }
                }
            });
        });

        for (const { dataId, group, listener } of this.listeners) {
            this.configClient.subscribe({ dataId, group }, listener);
            this.logger.log(`Subscribed Config! group: ${group} configId: ${dataId}`);
        }

        await this.scannerService.scanProviderPropertyMetadates(NACOS_CONFIG_CLIENT_METADATA, async (instance, propertyKey) => {
            instance[propertyKey] = this.configClient;
        });

        await this.scannerService.scanProvider(async instance => {
            if (instance["onConfigClientInit"]) {
                await instance["onConfigClientInit"](this.configClient);
            }
        });
    }

    async onModuleDestroy() {
        for (const { dataId, group, listener } of this.listeners) {
            this.configClient.unSubscribe({ dataId, group }, listener);
        }
        this.listeners.length = 0;
    }
}
