import validElement from './validElement';

export default {
  container: {
    validator: validElement,
    required: true
  },
  url: {
    type: 'string',
    required: true
  },
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
  playbackRate: 'boolean',
  aspectRatio: 'boolean',
  loop: 'boolean',
  type: 'string',
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
      name: 'string',
      html: {
        validator: validElement
      },
      click: 'function'
    }
  },
  loading: 'string',
  theme: 'string',
  hotkey: 'boolean',
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
