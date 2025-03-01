export const convertBytes = (bytes?: number, unit: 'KB' | 'MB' | 'GB' = 'KB') => {
    if (!bytes) return 0;

    const units = {
        KB: 1024,
        MB: 1024 ** 2,
        GB: 1024 ** 3,
    };

    return Number(parseFloat((bytes / units[unit]).toFixed(1)));
};
