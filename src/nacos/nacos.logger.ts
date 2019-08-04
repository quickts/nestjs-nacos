import { format } from "util";
import { Logger } from "@nestjs/common";

export class NacosLogger {
    private readonly logger = new Logger("NacosNative");
    log(message?: any, ...optionalParams: any[]) {
        this.logger.log(format(message, ...optionalParams));
    }
    info(message?: any, ...optionalParams: any[]) {
        this.logger.log(format(message, ...optionalParams));
    }
    warn(message?: any, ...optionalParams: any[]) {
        this.logger.warn(format(message, ...optionalParams));
    }
    debug(message?: any, ...optionalParams: any[]) {
        this.logger.debug(format(message, ...optionalParams));
    }
    error(message?: any, ...optionalParams: any[]) {
        this.logger.error(format(message, ...optionalParams));
    }
}
