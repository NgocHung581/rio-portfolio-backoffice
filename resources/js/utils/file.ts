export const convertBytes = (bytes?: number, unit: 'KB' | 'MB' | 'GB' = 'KB') => {
    if (!bytes) return 0;

    const units = {
        KB: 1024,
        MB: 1024 ** 2,
        GB: 1024 ** 3,
    };

    return Number(parseFloat((bytes / units[unit]).toFixed(1)));
};

/**
 * Describe accepted files in a short, readable way, for the `file_requirements` translation.
 * E.g. `{ types: 'JPEG, PNG', size: '5 MB' }`.
 */
export const describeFileRequirements = (mimeTypes: string[], maxFileSize?: number) => {
    const types = mimeTypes.map((mimeType) => mimeType.split('/').pop()?.toUpperCase()).join(', ');

    return { types, size: maxFileSize ? `${convertBytes(maxFileSize, 'MB')} MB` : '' };
};
