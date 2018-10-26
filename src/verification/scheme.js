const validElement = (key, value, type, path) => {
  let handle = false;
  let msg = `${path.join('.')}.${key} require 'string' or 'Element' type, but got '${type}'`;

  if (type === 'string') {
    if (type.trim() === '') {
      handle = false;
      msg = `${path.join('.')}.${key} can not be empty'`;
    } else {
      handle = true;
    }
  }

  if (value instanceof Element) {
    handle = true;
  }

  return {
    handle: handle,
    msg: msg
  };
};

export default {
  container: {
    validator: validElement
  },
  url: {
    type: 'string',
    required: true
  },
  poster: {
    type: 'string'
  },
  volume: {
    type: 'number'
  },
  thumbnails: {
    type: 'object',
    child: {
      url: {
        type: 'string'
      },
      number: {
        type: 'number'
      },
      width: {
        type: 'number'
      },
      height: {
        type: 'number'
      },
      column: {
        type: 'number'
      }
    }
  },
  autoplay: {
    type: 'boolean'
  },
  loop: {
    type: 'boolean'
  },
  type: {
    type: 'string'
  },
  mimeCodec: {
    type: 'string'
  },
  layers: {
    type: 'array',
    child: {
      name: {
        type: 'string'
      },
      index: {
        type: 'number'
      },
      html: {
        validator: validElement
      },
      style: {
        type: 'object'
      }
    }
  },
  contextmenu: {
    type: 'array',
    child: {
      name: {
        type: 'string'
      },
      html: {
        validator: validElement
      },
      click: {
        type: 'function'
      }
    }
  },
  loading: {
    type: 'string'
  },
  theme: {
    type: 'string'
  },
  hotkey: {
    type: 'boolean'
  },
  subtitle: {
    type: 'object',
    child: {
      url: {
        type: 'string'
      },
      style: {
        type: 'object'
      }
    }
  },
  controls: {
    type: 'array',
    child: {
      option: {
        disable: {
          type: 'boolean'
        },
        position: {
          type: 'string'
        },
        index: {
          type: 'number'
        }
      }
    }
  },
  highlight: {
    type: 'array',
    child: {
      time: {
        type: 'number'
      },
      text: {
        type: 'string'
      }
    }
  },
  moreVideoAttr: {
    type: 'object'
  },
  lang: {
    type: 'string'
  }
};
