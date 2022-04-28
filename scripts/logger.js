import chalk from 'chalk';
import { format } from 'util';

const prefix = 'artplayer-cli';
const sep = chalk.gray('·');

export function log(...args) {
    const msg = format.apply(format, args);
    console.log(chalk.white(prefix), sep, msg);
}

export function fatal(...args) {
    if (args[0] instanceof Error) args[0] = args[0].message.trim();
    const msg = format.apply(format, args);
    console.error(chalk.red(prefix), sep, msg);
    process.exit(1);
}

export function success(...args) {
    const msg = format.apply(format, args);
    console.log(chalk.green(prefix), sep, msg);
}

export function warn(...args) {
    const msg = format.apply(format, args);
    console.log(chalk.yellow(prefix), sep, msg);
}
