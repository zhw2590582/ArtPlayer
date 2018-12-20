import { getUint8Sum, readUint8, bin2String, bin2Boolean, bin2Float } from '../utils';

function getValueLength(type) {
    return {
        0: 8, // Number
        1: 1, // Boolean
        2: 200, // String
        3: 1, // Object
        4: 1, // MovieClip
        5: 1, // Null
        6: 1, // Undefined
        7: 1, // Reference
        8: 1, // ECMA array
        9: 1, // Object end marker
        10: 4, // Strict array
        11: 8, // Date
        12: 4, // Long string
    }[type];
}

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

    console.log(scripTag.body.slice(13));

    const nameLength = getUint8Sum(readMetaData(2));
    const name = bin2String(readMetaData(nameLength));
    const type = readMetaData(1)[0];
    const valueLength = getUint8Sum(readMetaData(2));
    const value = bin2String(readMetaData(valueLength));
    console.log(type, name, value);

    const nameLength2 = getUint8Sum(readMetaData(2));
    const name2 = bin2String(readMetaData(nameLength2));
    const type2 = readMetaData(1)[0];
    const valueLength2 = getUint8Sum(readMetaData(2));
    const value2 = bin2String(readMetaData(valueLength2));
    console.log(type2, name2, value2);

    const nameLength3 = getUint8Sum(readMetaData(2));
    const name3 = bin2String(readMetaData(nameLength3));
    const type3 = readMetaData(1)[0];
    const value3 = bin2Boolean(readMetaData(1)[0]);
    console.log(type3, name3, value3);

    const nameLength4 = getUint8Sum(readMetaData(2));
    const name4 = bin2String(readMetaData(nameLength4));
    const type4 = readMetaData(1)[0];
    const value4 = bin2Boolean(readMetaData(1)[0]);
    console.log(type4, name4, value4);

    const nameLength5 = getUint8Sum(readMetaData(2));
    const name5 = bin2String(readMetaData(nameLength5));
    const type5 = readMetaData(1)[0];
    const value5 = bin2Boolean(readMetaData(1)[0]);
    console.log(type5, name5, value5);

    const nameLength6 = getUint8Sum(readMetaData(2));
    const name6 = bin2String(readMetaData(nameLength6));
    const type6 = readMetaData(1)[0];
    const value6 = bin2Boolean(readMetaData(1)[0]);
    console.log(type6, name6, value6);

    const nameLength7 = getUint8Sum(readMetaData(2));
    const name7 = bin2String(readMetaData(nameLength7));
    const type7 = readMetaData(1)[0];
    const value7 = bin2Boolean(readMetaData(1)[0]);
    console.log(type7, name7, value7);

    const nameLength8 = getUint8Sum(readMetaData(2));
    const name8 = bin2String(readMetaData(nameLength8));
    const type8 = readMetaData(1)[0];
    const value8 = bin2Float(readMetaData(8));
    console.log(type8, name8, value8);

    const nameLength9 = getUint8Sum(readMetaData(2));
    const name9 = bin2String(readMetaData(nameLength9));
    const type9 = readMetaData(1)[0];
    const value9 = bin2Float(readMetaData(8));
    console.log(type9, name9, value9);

    const nameLength10 = getUint8Sum(readMetaData(2));
    const name10 = bin2String(readMetaData(nameLength10));
    const type10 = readMetaData(1)[0];
    const value10 = bin2Float(readMetaData(8));
    console.log(type10, name10, value10);

    const nameLength11 = getUint8Sum(readMetaData(2));
    const name11 = bin2String(readMetaData(nameLength11));
    const type11 = readMetaData(1)[0];
    const value11 = bin2Float(readMetaData(8));
    console.log(type11, name11, value11);

    const nameLength12 = getUint8Sum(readMetaData(2));
    const name12 = bin2String(readMetaData(nameLength12));
    const type12 = readMetaData(1)[0];
    const value12 = bin2Float(readMetaData(8));
    console.log(type12, name12, value12);

    const nameLength13 = getUint8Sum(readMetaData(2));
    const name13 = bin2String(readMetaData(nameLength13));
    const type13 = readMetaData(1)[0];
    const value13 = bin2Float(readMetaData(8));
    console.log(type13, name13, value13);

    const nameLength14 = getUint8Sum(readMetaData(2));
    const name14 = bin2String(readMetaData(nameLength14));
    const type14 = readMetaData(1)[0];
    const value14 = bin2Float(readMetaData(8));
    console.log(type14, name14, value14);

    const nameLength15 = getUint8Sum(readMetaData(2));
    const name15 = bin2String(readMetaData(nameLength15));
    const type15 = readMetaData(1)[0];
    const value15 = bin2Float(readMetaData(8));
    console.log(type15, name15, value15);

    const nameLength16 = getUint8Sum(readMetaData(2));
    const name16 = bin2String(readMetaData(nameLength16));
    const type16 = readMetaData(1)[0];
    const value16 = bin2Float(readMetaData(8));
    console.log(type16, name16, value16);

    const nameLength17 = getUint8Sum(readMetaData(2));
    const name17 = bin2String(readMetaData(nameLength17));
    const type17 = readMetaData(1)[0];
    const value17 = bin2Float(readMetaData(8));
    console.log(type17, name17, value17);

    const nameLength18 = getUint8Sum(readMetaData(2));
    const name18 = bin2String(readMetaData(nameLength18));
    const type18 = readMetaData(1)[0];
    const value18 = bin2Float(readMetaData(8));
    console.log(type18, name18, value18);

    const nameLength19 = getUint8Sum(readMetaData(2));
    const name19 = bin2String(readMetaData(nameLength19));
    const type19 = readMetaData(1)[0];
    const value19 = bin2Float(readMetaData(8));
    console.log(type19, name19, value19);

    const nameLength20 = getUint8Sum(readMetaData(2));
    const name20 = bin2String(readMetaData(nameLength20));
    const type20 = readMetaData(1)[0];
    const value20 = bin2Float(readMetaData(8));
    console.log(type20, name20, value20);

    const nameLength21 = getUint8Sum(readMetaData(2));
    const name21 = bin2String(readMetaData(nameLength21));
    const type21 = readMetaData(1)[0];
    const value21 = bin2Boolean(readMetaData(1)[0]);
    console.log(type21, name21, value21);

    const nameLength22 = getUint8Sum(readMetaData(2));
    const name22 = bin2String(readMetaData(nameLength22));
    const type22 = readMetaData(1)[0];
    const value22 = bin2Float(readMetaData(8));
    console.log(type22, name22, value22);

    const nameLength23 = getUint8Sum(readMetaData(2));
    const name23 = bin2String(readMetaData(nameLength23));
    const type23 = readMetaData(1)[0];
    const value23 = bin2Float(readMetaData(8));
    console.log(type23, name23, value23);

    const nameLength24 = getUint8Sum(readMetaData(2));
    const name24 = bin2String(readMetaData(nameLength24));
    const type24 = readMetaData(1)[0];
    const value24 = bin2Float(readMetaData(8));
    console.log(type24, name24, value24);

    const nameLength25 = getUint8Sum(readMetaData(2));
    const name25 = bin2String(readMetaData(nameLength25));
    const type25 = readMetaData(1)[0];
    const value25 = bin2Float(readMetaData(8));
    console.log(type25, name25, value25);

    const nameLength26 = getUint8Sum(readMetaData(2));
    const name26 = bin2String(readMetaData(nameLength26));
    const type26 = readMetaData(1)[0];
    console.log(scripTag.body.slice(readMetaData.index));
    console.log(type26, name26);

    // while (readMetaData.index < scripTag.body.length) {

    // }

    metadata.amf1 = amf1;
    metadata.amf2 = amf2;
    return metadata;
}
