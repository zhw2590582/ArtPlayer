import loading from './loading.svg';

const Icons = {
  loading: loading
};

function creatDomFromSvg(map) {
  const result = {};
  Object.keys(map).forEach(name => {
    const tmp = document.createElement('div');
    tmp.innerHTML = map[name];
    [result[name]] = tmp.childNodes;
  });
  return result;
}

export default creatDomFromSvg(Icons);
