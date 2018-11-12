import validElement from './validElement';
import validStringEmpty from './validStringEmpty';

export default {
  container: {
    validator: validElement,
    required: true
  },
  url: {
    type: 'string',
    required: true,
    validator: validStringEmpty
  },
  title: 'string',
  volume: 'number',
  thumbnails: {
    type: 'object',
    child: {
      url: 'string',
      number: 'number',
      width: 'number',
      height: 'number',
      column: 'number'
    }
  },
  screenshot: 'boolean',
  autoplay: 'boolean',
  autoSize: 'boolean',
  playbackRate: 'boolean',
  aspectRatio: 'boolean',
  loop: 'boolean',
  type: {
    type: 'string'
  },
  mimeCodec: 'string',
  layers: {
    type: 'array',
    child: {
      name: 'string',
      index: 'number',
      html: {
        validator: validElement
      },
      style: 'object'
    }
  },
  contextmenu: {
    type: 'array',
    child: {
      type: 'object|function',
      name: 'string',
      html: {
        validator: validElement
      },
      click: 'function'
    }
  },
  quality: {
    type: 'array',
    child: {
      default: 'boolean',
      name: 'string',
      url: 'string'
    }
  },
  theme: 'string',
  hotkey: 'boolean',
  pip: 'boolean',
  mutex: 'boolean',
  fullscreen: 'boolean',
  fullscreenWeb: 'boolean',
  subtitle: {
    type: 'object',
    child: {
      url: 'string',
      style: 'object'
    }
  },
  controls: {
    type: 'array',
    child: {
      option: {
        type: 'object',
        child: {
          disable: 'boolean',
          position: 'boolean',
          index: 'number'
        }
      }
    }
  },
  highlight: {
    type: 'array',
    child: {
      time: 'number',
      text: 'string'
    }
  },
  moreVideoAttr: 'object',
  lang: 'string'
};
