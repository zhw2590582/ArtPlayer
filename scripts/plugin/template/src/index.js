import style from 'bundle-text:./style.less';

export default function {{export}}(option) {
    return (art) => {
        return {
            name: '{{export}}',
        };
    };
}

if (typeof document !== 'undefined') {
  const id = 'artplayer-plugin-{{name}}';
  let $style = document.getElementById(id)
  if (!$style) {
    $style = document.createElement('style')
    $style.id = id
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        document.head.appendChild($style)
      })
    }
    else {
      (document.head || document.documentElement).appendChild($style)
    }
  }
  $style.textContent = style
}

if (typeof window !== 'undefined') {
    window.{{export}} = {{export}};
}
