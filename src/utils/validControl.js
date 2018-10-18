import { errorHandle } from '.';

export default function validControl(option) {
  errorHandle(
    typeof option.control === 'function',
    `'control' option require 'function' type, but got '${typeof option.control}'.`
  );

  errorHandle(
    typeof option.disable === 'boolean',
    `'disable' option require 'boolean' type, but got '${typeof option.disable}'.`
  );

  errorHandle(
    typeof option.icon === 'string' || option.icon instanceof Element,
    `'icon' option require 'string' or 'Element' type, but got '${typeof option.icon}'.`
  );

  errorHandle(
    ['top', 'left', 'right'].indexOf(option.position) > -1,
    `'position' option require one of 'top、left、right', but got '${option.position}'.`
  );

  errorHandle(
    typeof option.index === 'number',
    `'index' option require 'number' type, but got '${typeof option.index}'.`
  );
}
