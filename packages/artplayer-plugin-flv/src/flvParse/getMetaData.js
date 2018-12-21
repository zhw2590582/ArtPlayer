import { getUint8Sum, readUint8, bin2String, bin2Boolean, bin2Float } from '../utils';

export default function getMetaData(scripTag) {
    const readScripTag = readUint8(scripTag.body);
    const metadata = Object.create(null);
    const amf1 = Object.create(null);
    const amf2 = Object.create(null);
    [amf1.type] = readScripTag(1);
    amf1.size = getUint8Sum(readScripTag(2));
    amf1.string = bin2String(readScripTag(amf1.size));
    [amf2.type] = readScripTag(1);
    amf2.size = getUint8Sum(readScripTag(4));
    amf2.metaData = Object.create(null);

    function getValue(type) {
        let value = null;
        if (type !== undefined) {
            switch (type) {
                case 0:
                    value = bin2Float(readScripTag(8));
                    break;
                case 1:
                    value = bin2Boolean(readScripTag(1)[0]);
                    break;
                case 2: {
                    const valueLength = getUint8Sum(readScripTag(2));
                    value = bin2String(readScripTag(valueLength));
                    break;
                }
                case 3: {
                    value = Object.create(null);
                    let endObject = false;
                    while (!endObject && readScripTag.index < scripTag.body.length) {
                        const nameLength = getUint8Sum(readScripTag(2));
                        const name = bin2String(readScripTag(nameLength));
                        const type = readScripTag(1)[0];
                        if (name) {
                            value[name] = getValue(type);
                        }
                        if (type === 9) {
                            endObject = true;
                        }
                    }
                    break;
                }
                case 8: {
                    value = Object.create(null);
                    let endObject = false;
                    while (!endObject && readScripTag.index < scripTag.body.length) {
                        const nameLength = getUint8Sum(readScripTag(2));
                        const name = bin2String(readScripTag(nameLength));
                        const type = readScripTag(1)[0];
                        if (name) {
                            value[name] = getValue(type);
                        }
                        if (type === 9) {
                            endObject = true;
                        }
                    }
                    break;
                }
                case 10: {
                    const valueLength = getUint8Sum(readScripTag(4));
                    value = [];
                    for (let index = 0; index < valueLength; index += 1) {
                        const itemType = readScripTag(1)[0];
                        value.push(getValue(itemType));
                    }
                    break;
                }
                case 12: {
                    const valueLength = getUint8Sum(readScripTag(4));
                    value = bin2String(readScripTag(valueLength));
                    break;
                }
                default:
                    console.warn(`AMF: Unknown metaData type: ${type} in ${readScripTag.index - 1}`);
                    break;
            }
        }
        return value;
    }

    while (readScripTag.index < scripTag.body.length) {
        const nameLength = getUint8Sum(readScripTag(2));
        const name = bin2String(readScripTag(nameLength));
        const type = readScripTag(1)[0];
        if (name) {
            amf2.metaData[name] = getValue(type);
        }
    }

    metadata.amf1 = amf1;
    metadata.amf2 = amf2;
    return metadata;
}
