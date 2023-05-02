export function humanFileSize(size) {
    if (size > 1024 ** 3) {
        return `${(size / (1024 ** 3)).toFixed(1)}GB`;
    }
    else if (size > 1024 ** 2) {
        return `${(size / (1024 ** 2)).toFixed(1)}MB`;
    }
    else if (size > 1024) {
        return `${(size / 1024).toFixed(1)}kB`;
    }
    else {
        return `${size}B`;
    }
}
