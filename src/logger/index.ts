import moment from 'moment';
import { bold, greenBright, magenta, red, white, yellow, bgCyan, bgMagenta, bgWhite, blue, blueBright, gray, green, } from 'colorette';
import { LoggingLevel } from '../types/logging';

export class Logging {
    private static appName: string = "FLEXIPAY"

    static dev(text: string, type: LoggingLevel = "info") {
        const title = this.appName?.toUpperCase()
        switch (type) {
            case "info":
                return process.stdout.write(greenBright(`[${title}] ${yellow(process.pid)} - ${white(moment().format('DD/MM/YYYY hh:mm:ss A'))}, ${(type).toUpperCase()} ${text} \n`))

            case "error":
                return process.stdout.write(red(`[${title}] ${process.pid} - ${white(moment().format('DD/MM/YYYY hh:mm:ss A'))}, ${(type).toUpperCase()} ${text} \n`))

            case "debug":
                process.stdout.write(bold(`[${title}] ${process.pid} - ${white(moment().format('DD/MM/YYYY hh:mm:ss A'))},${(type).toUpperCase()} ${text} \n`))
                return process.exit(1)
            case "alert":
                return process.stdout.write(magenta(`[${title}] ${yellow(process.pid)} - ${white(moment().format('DD/MM/YYYY hh:mm:ss A'))}, ${(type).toUpperCase()} ${text}\n`))

            case "notice":
                return process.stdout.write(yellow(`[${title}] ${process.pid} - ${white(moment().format('DD/MM/YYYY hh:mm:ss A'))}, ${(type).toUpperCase()} ${text}\n`))

            default:
                return process.stdout.write(greenBright(`[${title}] ${yellow(process.pid)} - ${white(moment().format('DD/MM/YYYY hh:mm:ss A'))}, ${"INFO".toUpperCase()} ${text} \n`))
        }
    };
}
export function Log(message: string, type: LoggingLevel = "info") {
    return (target: any, key: string, descriptor: any) => {
        const original = descriptor.value;

        descriptor.value = function (...args: any[]) {
            Logging.dev(`${yellow(`[${key}]`)} ${message}`, type)
        }
    }
}