import { errorHandle, getType } from '../utils';

export default function validOption(DEFAULTS, option, path = ['option']) {
  Object.keys(DEFAULTS).forEach(key => {
    const defaultValue = DEFAULTS[key];
    const value = option[key];
    const defaultType = getType(defaultValue);
    const type = getType(value);
    errorHandle(defaultType === type, `'${path.join('.')}.${key}' require '${defaultType}' type, but got '${type}'`);

    if (type === 'object') {
      validOption(defaultValue, value, path.concat(key));
    }
  });
}
