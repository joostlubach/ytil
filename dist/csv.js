export function csvArrayToJSON(values, options = {}) {
    const body = [...values];
    const fields = options.fields ?? body.shift();
    if (fields == null) {
        return [];
    }
    const convertValue = (field, value) => {
        if (typeof value === 'string' && options.trim) {
            value = value.trim();
        }
        if (options.convert != null) {
            return options.convert(field, value);
        }
        else {
            return value;
        }
    };
    const rowToJSON = (values) => {
        const item = {};
        for (const [index, field] of fields.entries()) {
            item[field] = convertValue(field, values[index]);
        }
        return item;
    };
    return body.map(rowToJSON);
}
