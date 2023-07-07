import * as os from 'node:os';
import * as path from 'node:path';

export const absolutePathFor = (relativePath:string) => {
    return path.resolve(replaceTilde(relativePath))
}

const replaceTilde = (path: string) => {
    if (path.startsWith('~/') || path === '~') {
        return path.replace('~', os.homedir());
    }
    throw path
}