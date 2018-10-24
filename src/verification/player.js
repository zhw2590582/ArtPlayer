import { errorHandle, getType } from '../utils';

export default function validOption(DEFAULTS, option, path = ['option']) {
  Object.keys(DEFAULTS).forEach(key => {
    const defaultValue = DEFAULTS[key];
    const value = option[key];
    const defaultType = getType(defaultValue);
    const type = getType(value);

    if (key === 'container' || key === 'html') {
      errorHandle(
        type === 'string' || value instanceof Element,
        `'${path.join('.')}.${key}' require 'string' or 'Element' type, but got '${type}'`
      );
    } else {
      errorHandle(
        defaultType === type,
        `'${path.join('.')}.${key}' require '${defaultType}' type, but got '${type}'`
      );
    }

    if (type === 'object') {
      validOption(defaultValue, value, path.concat(key));
    }

    if (path.length === 1) {
      if (key === 'layers') {
        value.forEach((item, index) => {
          validOption(
            {
              name: '',
              index: 0,
              html: '',
              style: {}
            },
            item,
            path.concat(`${key}[${index}]`)
          );
        });
      }

      if (key === 'contextmenu') {
        value.forEach((item, index) => {
          validOption(
            {
              name: '',
              click: new Function(),
              html: '',
              style: {}
            },
            item,
            path.concat(`${key}[${index}]`)
          );
        });
      }

      if (key === 'highlight') {
        value.forEach((item, index) => {
          validOption(
            {
              time: 0,
              text: ''
            },
            item,
            path.concat(`${key}[${index}]`)
          );
        });
      }

      if (key === 'controls') {
        value.forEach((item, index) => {
          if (item.option) {
            validOption(
              {
                disable: false,
                position: '',
                index: 0
              },
              item.option,
              path.concat(`${key}[${index}]`)
            );
          }
        });
      }
    }
  });
}
