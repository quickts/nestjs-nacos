import { format } from "util";
import { Logger } from "@nestjs/common";
const LoggerLevels = {
    DEBUG: 0,
    LOG: 1,
    INFO: 1,
    WARN: 2,
    ERROR: 3
};
export class NacosLogger {
    constructor(private readonly loggerLevel: "DEBUG" | "INFO" | "WARN" | "ERROR" = "WARN") {}
    private readonly logger = new Logger("NacosNative");
    log(message?: any, ...optionalParams: any[]) {
        if (LoggerLevels.LOG >= LoggerLevels[this.loggerLevel]) {
            this.logger.log(format(message, ...optionalParams));
        }
    }
    info(message?: any, ...optionalParams: any[]) {
        if (LoggerLevels.INFO >= LoggerLevels[this.loggerLevel]) {
            this.logger.log(format(message, ...optionalParams));
        }
    }
    warn(message?: any, ...optionalParams: any[]) {
        if (LoggerLevels.WARN >= LoggerLevels[this.loggerLevel]) {
            this.logger.warn(format(message, ...optionalParams));
        }
    }
    debug(message?: any, ...optionalParams: any[]) {
        if (LoggerLevels.DEBUG >= LoggerLevels[this.loggerLevel]) {
            this.logger.debug(format(message, ...optionalParams));
        }
    }
    error(message?: any, ...optionalParams: any[]) {
        if (LoggerLevels.ERROR >= LoggerLevels[this.loggerLevel]) {
            this.logger.error(format(message, ...optionalParams));
        }
    }
}
