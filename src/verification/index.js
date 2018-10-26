import { errorHandle, getType } from '../utils';
import scheme from './scheme';

export default function validOption(option, param = scheme, path = ['option']) {
  Object.keys(option).some(key => {
    if (!param[key]) {
      return true;
    }

    const value = option[key];
    const type = getType(value);
    const requiredType = param[key].type;
    const isRequired = param[key].required;
    const requiredChild = param[key].child;

    if (type === 'object' && requiredChild) {
      validOption(value, requiredChild, path.concat(key));
    }

    if (type === 'array' && requiredChild) {
      value.forEach((item, index) => {
        validOption(item, requiredChild, path.concat(`${key}[${index}]`));
      });
    }

    errorHandle(!isRequired || value, `'${path.join('.')}.${key}' is required`);
    errorHandle(requiredType === type, `'${path.join('.')}.${key}' require '${requiredType}' type, but got '${type}'`);
    return false;
  });
}
