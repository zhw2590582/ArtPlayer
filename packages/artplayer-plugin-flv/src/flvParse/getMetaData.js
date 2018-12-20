import { getUint8Sum, readUint8, bin2String, bin2Boolean, bin2Float, errorHandle } from '../utils';

export default function getMetaData(scripTag) {
    const readMetaData = readUint8(scripTag.body);
    const metadata = Object.create(null);
    const amf1 = Object.create(null);
    const amf2 = Object.create(null);
    [amf1.type] = readMetaData(1);
    amf1.size = getUint8Sum(readMetaData(2));
    amf1.string = bin2String(readMetaData(amf1.size));
    [amf2.type] = readMetaData(1);
    amf2.size = getUint8Sum(readMetaData(4));
    amf2.metaData = Object.create(null);

    while (readMetaData.index < scripTag.body.length) {
        const nameLength = getUint8Sum(readMetaData(2));
        const name = bin2String(readMetaData(nameLength));
        const type = readMetaData(1)[0];
        switch (type) {
            case 0:
                amf2.metaData[name] = bin2Float(readMetaData(8));
                break;
            case 1:
                amf2.metaData[name] = bin2Boolean(readMetaData(1)[0]);
                break;
            case 2: {
                const valueLength = getUint8Sum(readMetaData(2));
                amf2.metaData[name] = bin2String(readMetaData(valueLength));
                break;
            }
            case 3:
                amf2.metaData[name] = Object.create(null);
                readMetaData(scripTag.body.length - readMetaData.index);
                break;
            default:
                errorHandle(false, `AMF: Unknown metaData type: ${type}`);
                break;
        }
    }

    metadata.amf1 = amf1;
    metadata.amf2 = amf2;
    return metadata;
}
