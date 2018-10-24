import { errorHandle } from '../utils';

export default function validControl(option) {
  errorHandle(
    typeof option.disable === 'boolean',
    `'disable' option require 'boolean' type, but got '${typeof option.disable}'.`
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
