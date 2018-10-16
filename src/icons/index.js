import loading from './loading.svg';
import play from './play.svg';

const Icons = {
  loading,
  play
};

function creatDomFromSvg(map) {
  const result = {};
  Object.keys(map).forEach(name => {
    const tmp = document.createElement('div');
    tmp.innerHTML = `<i class="art-icon art-icon-${name}">${map[name]}</i>`;
    [result[name]] = tmp.childNodes;
  });
  return result;
}

export default creatDomFromSvg(Icons);
