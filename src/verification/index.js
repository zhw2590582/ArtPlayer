import { errorHandle, getType } from '../utils';
import scheme from './scheme';

export default function validOption(option, param = scheme, path = ['option']) {
  Object.keys(option).some(key => {
    const paramObj = param[key];

    if (!paramObj) {
      return true;
    }

    const value = option[key];
    const type = getType(value);
    const paramType = paramObj.type;
    const paramRequired = paramObj.required;
    const paramChild = paramObj.child;
    const paramValidator = paramObj.validator;

    if (type === 'object' && paramChild) {
      validOption(value, paramChild, path.concat(key));
    }

    if (type === 'array' && paramChild) {
      value.forEach((item, index) => {
        validOption(item, paramChild, path.concat(`${key}[${index}]`));
      });
    }

    if (paramValidator) {
      const result = paramValidator(key, value, type, path);
      errorHandle(result.handle, result.msg);
    } else {
      errorHandle(!paramRequired || value, `'${path.join('.')}.${key}' is required`);
      errorHandle(paramType === type, `'${path.join('.')}.${key}' require '${paramType}' type, but got '${type}'`);
    }

    return false;
  });
}
