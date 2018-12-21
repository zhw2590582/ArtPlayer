import { getUint8Sum, readUint8, bin2String, bin2Boolean, bin2Float, errorHandle } from '../utils';

export default function getMetaData(scripTag) {
    const readScripTag = readUint8(scripTag.body);
    const metadata = Object.create(null);
    const amf1 = Object.create(null);
    const amf2 = Object.create(null);

    [amf1.type] = readScripTag(1);
    errorHandle(amf1.type === 2, `AMF: [amf1] type expect 2, but got ${amf1.type}`);
    amf1.size = getUint8Sum(readScripTag(2));
    amf1.string = bin2String(readScripTag(amf1.size));

    [amf2.type] = readScripTag(1);
    errorHandle(amf2.type === 8, `AMF: [amf1] type expect 8, but got ${amf2.type}`);
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
                    let endArray = false;
                    while (!endArray && readScripTag.index < scripTag.body.length) {
                        const nameLength = getUint8Sum(readScripTag(2));
                        const name = bin2String(readScripTag(nameLength));
                        const type = readScripTag(1)[0];
                        if (name) {
                            value[name] = getValue(type);
                        }
                        if (type === 9) {
                            endArray = true;
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
                    console.log(readScripTag(scripTag.body.length - readScripTag.index - 1));
                    errorHandle(false, `AMF: Unknown metaData type: ${type}`);
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

    errorHandle(readScripTag.index === scripTag.body.length, 'AMF: Seems to be incompletely parsed');
    errorHandle(amf2.size === Object.keys(amf2.metaData).length, 'AMF: [amf2] length does not match');

    metadata.amf1 = amf1;
    metadata.amf2 = amf2;
    return metadata;
}
