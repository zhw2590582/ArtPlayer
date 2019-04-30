(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.ArtplayerReact = factory());
}(this, function () { 'use strict';

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  var objectWithoutPropertiesLoose = _objectWithoutPropertiesLoose;

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = objectWithoutPropertiesLoose(source, excluded);
    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  var objectWithoutProperties = _objectWithoutProperties;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty = _defineProperty;

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  var objectSpread = _objectSpread;

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var _typeof_1 = createCommonjsModule(function (module) {
  function _typeof2(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof2 = function _typeof2(obj) { return typeof obj; }; } else { _typeof2 = function _typeof2(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof2(obj); }

  function _typeof(obj) {
    if (typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol") {
      module.exports = _typeof = function _typeof(obj) {
        return _typeof2(obj);
      };
    } else {
      module.exports = _typeof = function _typeof(obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : _typeof2(obj);
      };
    }

    return _typeof(obj);
  }

  module.exports = _typeof;
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var classCallCheck = _classCallCheck;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var createClass = _createClass;

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  var assertThisInitialized = _assertThisInitialized;

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof_1(call) === "object" || typeof call === "function")) {
      return call;
    }

    return assertThisInitialized(self);
  }

  var possibleConstructorReturn = _possibleConstructorReturn;

  var getPrototypeOf = createCommonjsModule(function (module) {
  function _getPrototypeOf(o) {
    module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  module.exports = _getPrototypeOf;
  });

  var setPrototypeOf = createCommonjsModule(function (module) {
  function _setPrototypeOf(o, p) {
    module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  module.exports = _setPrototypeOf;
  });

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) setPrototypeOf(subClass, superClass);
  }

  var inherits = _inherits;

  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */
  /* eslint-disable no-unused-vars */
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;

  function toObject(val) {
  	if (val === null || val === undefined) {
  		throw new TypeError('Object.assign cannot be called with null or undefined');
  	}

  	return Object(val);
  }

  function shouldUseNative() {
  	try {
  		if (!Object.assign) {
  			return false;
  		}

  		// Detect buggy property enumeration order in older V8 versions.

  		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
  		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
  		test1[5] = 'de';
  		if (Object.getOwnPropertyNames(test1)[0] === '5') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test2 = {};
  		for (var i = 0; i < 10; i++) {
  			test2['_' + String.fromCharCode(i)] = i;
  		}
  		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
  			return test2[n];
  		});
  		if (order2.join('') !== '0123456789') {
  			return false;
  		}

  		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
  		var test3 = {};
  		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
  			test3[letter] = letter;
  		});
  		if (Object.keys(Object.assign({}, test3)).join('') !==
  				'abcdefghijklmnopqrst') {
  			return false;
  		}

  		return true;
  	} catch (err) {
  		// We don't expect any of the above to throw, but better to be safe.
  		return false;
  	}
  }

  var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
  	var from;
  	var to = toObject(target);
  	var symbols;

  	for (var s = 1; s < arguments.length; s++) {
  		from = Object(arguments[s]);

  		for (var key in from) {
  			if (hasOwnProperty.call(from, key)) {
  				to[key] = from[key];
  			}
  		}

  		if (getOwnPropertySymbols) {
  			symbols = getOwnPropertySymbols(from);
  			for (var i = 0; i < symbols.length; i++) {
  				if (propIsEnumerable.call(from, symbols[i])) {
  					to[symbols[i]] = from[symbols[i]];
  				}
  			}
  		}
  	}

  	return to;
  };

  var n="function"===typeof Symbol&&Symbol.for,p=n?Symbol.for("react.element"):60103,q=n?Symbol.for("react.portal"):60106,r=n?Symbol.for("react.fragment"):60107,t=n?Symbol.for("react.strict_mode"):60108,u=n?Symbol.for("react.profiler"):60114,v=n?Symbol.for("react.provider"):60109,w=n?Symbol.for("react.context"):60110,x=n?Symbol.for("react.concurrent_mode"):60111,y=n?Symbol.for("react.forward_ref"):60112,z=n?Symbol.for("react.suspense"):60113,aa=n?Symbol.for("react.memo"):
  60115,ba=n?Symbol.for("react.lazy"):60116,A="function"===typeof Symbol&&Symbol.iterator;function ca(a,b,d,c,e,g,h,f){if(!a){a=void 0;if(void 0===b)a=Error("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");else{var l=[d,c,e,g,h,f],m=0;a=Error(b.replace(/%s/g,function(){return l[m++]}));a.name="Invariant Violation";}a.framesToPop=1;throw a;}}
  function B(a){for(var b=arguments.length-1,d="https://reactjs.org/docs/error-decoder.html?invariant="+a,c=0;c<b;c++)d+="&args[]="+encodeURIComponent(arguments[c+1]);ca(!1,"Minified React error #"+a+"; visit %s for the full message or use the non-minified dev environment for full errors and additional helpful warnings. ",d);}var C={isMounted:function(){return !1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},D={};
  function E(a,b,d){this.props=a;this.context=b;this.refs=D;this.updater=d||C;}E.prototype.isReactComponent={};E.prototype.setState=function(a,b){"object"!==typeof a&&"function"!==typeof a&&null!=a?B("85"):void 0;this.updater.enqueueSetState(this,a,b,"setState");};E.prototype.forceUpdate=function(a){this.updater.enqueueForceUpdate(this,a,"forceUpdate");};function F(){}F.prototype=E.prototype;function G(a,b,d){this.props=a;this.context=b;this.refs=D;this.updater=d||C;}var H=G.prototype=new F;
  H.constructor=G;objectAssign(H,E.prototype);H.isPureReactComponent=!0;var I={current:null},J={current:null},K=Object.prototype.hasOwnProperty,L={key:!0,ref:!0,__self:!0,__source:!0};
  function M(a,b,d){var c=void 0,e={},g=null,h=null;if(null!=b)for(c in void 0!==b.ref&&(h=b.ref),void 0!==b.key&&(g=""+b.key),b)K.call(b,c)&&!L.hasOwnProperty(c)&&(e[c]=b[c]);var f=arguments.length-2;if(1===f)e.children=d;else if(1<f){for(var l=Array(f),m=0;m<f;m++)l[m]=arguments[m+2];e.children=l;}if(a&&a.defaultProps)for(c in f=a.defaultProps,f)void 0===e[c]&&(e[c]=f[c]);return {$$typeof:p,type:a,key:g,ref:h,props:e,_owner:J.current}}
  function da(a,b){return {$$typeof:p,type:a.type,key:b,ref:a.ref,props:a.props,_owner:a._owner}}function N(a){return "object"===typeof a&&null!==a&&a.$$typeof===p}function escape(a){var b={"=":"=0",":":"=2"};return "$"+(""+a).replace(/[=:]/g,function(a){return b[a]})}var O=/\/+/g,P=[];function Q(a,b,d,c){if(P.length){var e=P.pop();e.result=a;e.keyPrefix=b;e.func=d;e.context=c;e.count=0;return e}return {result:a,keyPrefix:b,func:d,context:c,count:0}}
  function R(a){a.result=null;a.keyPrefix=null;a.func=null;a.context=null;a.count=0;10>P.length&&P.push(a);}
  function S(a,b,d,c){var e=typeof a;if("undefined"===e||"boolean"===e)a=null;var g=!1;if(null===a)g=!0;else switch(e){case "string":case "number":g=!0;break;case "object":switch(a.$$typeof){case p:case q:g=!0;}}if(g)return d(c,a,""===b?"."+T(a,0):b),1;g=0;b=""===b?".":b+":";if(Array.isArray(a))for(var h=0;h<a.length;h++){e=a[h];var f=b+T(e,h);g+=S(e,f,d,c);}else if(null===a||"object"!==typeof a?f=null:(f=A&&a[A]||a["@@iterator"],f="function"===typeof f?f:null),"function"===typeof f)for(a=f.call(a),h=
  0;!(e=a.next()).done;)e=e.value,f=b+T(e,h++),g+=S(e,f,d,c);else"object"===e&&(d=""+a,B("31","[object Object]"===d?"object with keys {"+Object.keys(a).join(", ")+"}":d,""));return g}function U(a,b,d){return null==a?0:S(a,"",b,d)}function T(a,b){return "object"===typeof a&&null!==a&&null!=a.key?escape(a.key):b.toString(36)}function ea(a,b){a.func.call(a.context,b,a.count++);}
  function fa(a,b,d){var c=a.result,e=a.keyPrefix;a=a.func.call(a.context,b,a.count++);Array.isArray(a)?V(a,c,d,function(a){return a}):null!=a&&(N(a)&&(a=da(a,e+(!a.key||b&&b.key===a.key?"":(""+a.key).replace(O,"$&/")+"/")+d)),c.push(a));}function V(a,b,d,c,e){var g="";null!=d&&(g=(""+d).replace(O,"$&/")+"/");b=Q(b,g,c,e);U(a,fa,b);R(b);}function W(){var a=I.current;null===a?B("321"):void 0;return a}
  var X={Children:{map:function(a,b,d){if(null==a)return a;var c=[];V(a,c,null,b,d);return c},forEach:function(a,b,d){if(null==a)return a;b=Q(null,null,b,d);U(a,ea,b);R(b);},count:function(a){return U(a,function(){return null},null)},toArray:function(a){var b=[];V(a,b,null,function(a){return a});return b},only:function(a){N(a)?void 0:B("143");return a}},createRef:function(){return {current:null}},Component:E,PureComponent:G,createContext:function(a,b){void 0===b&&(b=null);a={$$typeof:w,_calculateChangedBits:b,
  _currentValue:a,_currentValue2:a,_threadCount:0,Provider:null,Consumer:null};a.Provider={$$typeof:v,_context:a};return a.Consumer=a},forwardRef:function(a){return {$$typeof:y,render:a}},lazy:function(a){return {$$typeof:ba,_ctor:a,_status:-1,_result:null}},memo:function(a,b){return {$$typeof:aa,type:a,compare:void 0===b?null:b}},useCallback:function(a,b){return W().useCallback(a,b)},useContext:function(a,b){return W().useContext(a,b)},useEffect:function(a,b){return W().useEffect(a,b)},useImperativeHandle:function(a,
  b,d){return W().useImperativeHandle(a,b,d)},useDebugValue:function(){},useLayoutEffect:function(a,b){return W().useLayoutEffect(a,b)},useMemo:function(a,b){return W().useMemo(a,b)},useReducer:function(a,b,d){return W().useReducer(a,b,d)},useRef:function(a){return W().useRef(a)},useState:function(a){return W().useState(a)},Fragment:r,StrictMode:t,Suspense:z,createElement:M,cloneElement:function(a,b,d){null===a||void 0===a?B("267",a):void 0;var c=void 0,e=objectAssign({},a.props),g=a.key,h=a.ref,f=a._owner;if(null!=
  b){void 0!==b.ref&&(h=b.ref,f=J.current);void 0!==b.key&&(g=""+b.key);var l=void 0;a.type&&a.type.defaultProps&&(l=a.type.defaultProps);for(c in b)K.call(b,c)&&!L.hasOwnProperty(c)&&(e[c]=void 0===b[c]&&void 0!==l?l[c]:b[c]);}c=arguments.length-2;if(1===c)e.children=d;else if(1<c){l=Array(c);for(var m=0;m<c;m++)l[m]=arguments[m+2];e.children=l;}return {$$typeof:p,type:a.type,key:g,ref:h,props:e,_owner:f}},createFactory:function(a){var b=M.bind(null,a);b.type=a;return b},isValidElement:N,version:"16.8.6",
  unstable_ConcurrentMode:x,unstable_Profiler:u,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{ReactCurrentDispatcher:I,ReactCurrentOwner:J,assign:objectAssign}},Y={default:X},Z=Y&&X||Y;var react_production_min=Z.default||Z;

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

  var ReactPropTypesSecret_1 = ReactPropTypesSecret;

  var printWarning = function() {};

  if (process.env.NODE_ENV !== 'production') {
    var ReactPropTypesSecret$1 = ReactPropTypesSecret_1;
    var loggedTypeFailures = {};
    var has = Function.call.bind(Object.prototype.hasOwnProperty);

    printWarning = function(text) {
      var message = 'Warning: ' + text;
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };
  }

  /**
   * Assert that the values match with the type specs.
   * Error messages are memorized and will only be shown once.
   *
   * @param {object} typeSpecs Map of name to a ReactPropType
   * @param {object} values Runtime values that need to be type-checked
   * @param {string} location e.g. "prop", "context", "child context"
   * @param {string} componentName Name of the component for error messages.
   * @param {?Function} getStack Returns the component stack.
   * @private
   */
  function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
    if (process.env.NODE_ENV !== 'production') {
      for (var typeSpecName in typeSpecs) {
        if (has(typeSpecs, typeSpecName)) {
          var error;
          // Prop type validation may throw. In case they do, we don't want to
          // fail the render phase where it didn't fail before. So we log it.
          // After these have been cleaned up, we'll let them throw.
          try {
            // This is intentionally an invariant that gets caught. It's the same
            // behavior as without this statement except with a better message.
            if (typeof typeSpecs[typeSpecName] !== 'function') {
              var err = Error(
                (componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' +
                'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.'
              );
              err.name = 'Invariant Violation';
              throw err;
            }
            error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret$1);
          } catch (ex) {
            error = ex;
          }
          if (error && !(error instanceof Error)) {
            printWarning(
              (componentName || 'React class') + ': type specification of ' +
              location + ' `' + typeSpecName + '` is invalid; the type checker ' +
              'function must return `null` or an `Error` but returned a ' + typeof error + '. ' +
              'You may have forgotten to pass an argument to the type checker ' +
              'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' +
              'shape all require an argument).'
            );
          }
          if (error instanceof Error && !(error.message in loggedTypeFailures)) {
            // Only monitor this failure once because there tends to be a lot of the
            // same error.
            loggedTypeFailures[error.message] = true;

            var stack = getStack ? getStack() : '';

            printWarning(
              'Failed ' + location + ' type: ' + error.message + (stack != null ? stack : '')
            );
          }
        }
      }
    }
  }

  /**
   * Resets warning cache when testing.
   *
   * @private
   */
  checkPropTypes.resetWarningCache = function() {
    if (process.env.NODE_ENV !== 'production') {
      loggedTypeFailures = {};
    }
  };

  var checkPropTypes_1 = checkPropTypes;

  var react_development = createCommonjsModule(function (module) {



  if (process.env.NODE_ENV !== "production") {
    (function() {

  var _assign = objectAssign;
  var checkPropTypes = checkPropTypes_1;

  // TODO: this is special because it gets imported during build.

  var ReactVersion = '16.8.6';

  // The Symbol used to tag the ReactElement-like types. If there is no native Symbol
  // nor polyfill, then a plain number is used for performance.
  var hasSymbol = typeof Symbol === 'function' && Symbol.for;

  var REACT_ELEMENT_TYPE = hasSymbol ? Symbol.for('react.element') : 0xeac7;
  var REACT_PORTAL_TYPE = hasSymbol ? Symbol.for('react.portal') : 0xeaca;
  var REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb;
  var REACT_STRICT_MODE_TYPE = hasSymbol ? Symbol.for('react.strict_mode') : 0xeacc;
  var REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2;
  var REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd;
  var REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace;

  var REACT_CONCURRENT_MODE_TYPE = hasSymbol ? Symbol.for('react.concurrent_mode') : 0xeacf;
  var REACT_FORWARD_REF_TYPE = hasSymbol ? Symbol.for('react.forward_ref') : 0xead0;
  var REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1;
  var REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3;
  var REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4;

  var MAYBE_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator';

  function getIteratorFn(maybeIterable) {
    if (maybeIterable === null || typeof maybeIterable !== 'object') {
      return null;
    }
    var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
    if (typeof maybeIterator === 'function') {
      return maybeIterator;
    }
    return null;
  }

  /**
   * Use invariant() to assert state which your program assumes to be true.
   *
   * Provide sprintf-style format (only %s is supported) and arguments
   * to provide information about what broke and what you were
   * expecting.
   *
   * The invariant message will be stripped in production, but the invariant
   * will remain to ensure logic does not differ in production.
   */

  var validateFormat = function () {};

  {
    validateFormat = function (format) {
      if (format === undefined) {
        throw new Error('invariant requires an error message argument');
      }
    };
  }

  function invariant(condition, format, a, b, c, d, e, f) {
    validateFormat(format);

    if (!condition) {
      var error = void 0;
      if (format === undefined) {
        error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
      } else {
        var args = [a, b, c, d, e, f];
        var argIndex = 0;
        error = new Error(format.replace(/%s/g, function () {
          return args[argIndex++];
        }));
        error.name = 'Invariant Violation';
      }

      error.framesToPop = 1; // we don't care about invariant's own frame
      throw error;
    }
  }

  // Relying on the `invariant()` implementation lets us
  // preserve the format and params in the www builds.

  /**
   * Forked from fbjs/warning:
   * https://github.com/facebook/fbjs/blob/e66ba20ad5be433eb54423f2b097d829324d9de6/packages/fbjs/src/__forks__/warning.js
   *
   * Only change is we use console.warn instead of console.error,
   * and do nothing when 'console' is not supported.
   * This really simplifies the code.
   * ---
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   */

  var lowPriorityWarning = function () {};

  {
    var printWarning = function (format) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });
      if (typeof console !== 'undefined') {
        console.warn(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };

    lowPriorityWarning = function (condition, format) {
      if (format === undefined) {
        throw new Error('`lowPriorityWarning(condition, format, ...args)` requires a warning ' + 'message argument');
      }
      if (!condition) {
        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];
        }

        printWarning.apply(undefined, [format].concat(args));
      }
    };
  }

  var lowPriorityWarning$1 = lowPriorityWarning;

  /**
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   */

  var warningWithoutStack = function () {};

  {
    warningWithoutStack = function (condition, format) {
      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      if (format === undefined) {
        throw new Error('`warningWithoutStack(condition, format, ...args)` requires a warning ' + 'message argument');
      }
      if (args.length > 8) {
        // Check before the condition to catch violations early.
        throw new Error('warningWithoutStack() currently supports at most 8 arguments.');
      }
      if (condition) {
        return;
      }
      if (typeof console !== 'undefined') {
        var argsWithFormat = args.map(function (item) {
          return '' + item;
        });
        argsWithFormat.unshift('Warning: ' + format);

        // We intentionally don't use spread (or .apply) directly because it
        // breaks IE9: https://github.com/facebook/react/issues/13610
        Function.prototype.apply.call(console.error, console, argsWithFormat);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        var argIndex = 0;
        var message = 'Warning: ' + format.replace(/%s/g, function () {
          return args[argIndex++];
        });
        throw new Error(message);
      } catch (x) {}
    };
  }

  var warningWithoutStack$1 = warningWithoutStack;

  var didWarnStateUpdateForUnmountedComponent = {};

  function warnNoop(publicInstance, callerName) {
    {
      var _constructor = publicInstance.constructor;
      var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
      var warningKey = componentName + '.' + callerName;
      if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
        return;
      }
      warningWithoutStack$1(false, "Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);
      didWarnStateUpdateForUnmountedComponent[warningKey] = true;
    }
  }

  /**
   * This is the abstract API for an update queue.
   */
  var ReactNoopUpdateQueue = {
    /**
     * Checks whether or not this composite component is mounted.
     * @param {ReactClass} publicInstance The instance we want to test.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function (publicInstance) {
      return false;
    },

    /**
     * Forces an update. This should only be invoked when it is known with
     * certainty that we are **not** in a DOM transaction.
     *
     * You may want to call this when you know that some deeper aspect of the
     * component's state has changed but `setState` was not called.
     *
     * This will not invoke `shouldComponentUpdate`, but it will invoke
     * `componentWillUpdate` and `componentDidUpdate`.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {?function} callback Called after component is updated.
     * @param {?string} callerName name of the calling function in the public API.
     * @internal
     */
    enqueueForceUpdate: function (publicInstance, callback, callerName) {
      warnNoop(publicInstance, 'forceUpdate');
    },

    /**
     * Replaces all of the state. Always use this or `setState` to mutate state.
     * You should treat `this.state` as immutable.
     *
     * There is no guarantee that `this.state` will be immediately updated, so
     * accessing `this.state` after calling this method may return the old value.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} completeState Next state.
     * @param {?function} callback Called after component is updated.
     * @param {?string} callerName name of the calling function in the public API.
     * @internal
     */
    enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
      warnNoop(publicInstance, 'replaceState');
    },

    /**
     * Sets a subset of the state. This only exists because _pendingState is
     * internal. This provides a merging strategy that is not available to deep
     * properties which is confusing. TODO: Expose pendingState or don't use it
     * during the merge.
     *
     * @param {ReactClass} publicInstance The instance that should rerender.
     * @param {object} partialState Next partial state to be merged with state.
     * @param {?function} callback Called after component is updated.
     * @param {?string} Name of the calling function in the public API.
     * @internal
     */
    enqueueSetState: function (publicInstance, partialState, callback, callerName) {
      warnNoop(publicInstance, 'setState');
    }
  };

  var emptyObject = {};
  {
    Object.freeze(emptyObject);
  }

  /**
   * Base class helpers for the updating state of a component.
   */
  function Component(props, context, updater) {
    this.props = props;
    this.context = context;
    // If a component has string refs, we will assign a different object later.
    this.refs = emptyObject;
    // We initialize the default updater but the real one gets injected by the
    // renderer.
    this.updater = updater || ReactNoopUpdateQueue;
  }

  Component.prototype.isReactComponent = {};

  /**
   * Sets a subset of the state. Always use this to mutate
   * state. You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * There is no guarantee that calls to `setState` will run synchronously,
   * as they may eventually be batched together.  You can provide an optional
   * callback that will be executed when the call to setState is actually
   * completed.
   *
   * When a function is provided to setState, it will be called at some point in
   * the future (not synchronously). It will be called with the up to date
   * component arguments (state, props, context). These values can be different
   * from this.* because your function may be called after receiveProps but before
   * shouldComponentUpdate, and this new state, props, and context will not yet be
   * assigned to this.
   *
   * @param {object|function} partialState Next partial state or function to
   *        produce next partial state to be merged with current state.
   * @param {?function} callback Called after state is updated.
   * @final
   * @protected
   */
  Component.prototype.setState = function (partialState, callback) {
    !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : void 0;
    this.updater.enqueueSetState(this, partialState, callback, 'setState');
  };

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {?function} callback Called after update is complete.
   * @final
   * @protected
   */
  Component.prototype.forceUpdate = function (callback) {
    this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
  };

  /**
   * Deprecated APIs. These APIs used to exist on classic React classes but since
   * we would like to deprecate them, we're not going to move them over to this
   * modern base class. Instead, we define a getter that warns if it's accessed.
   */
  {
    var deprecatedAPIs = {
      isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
      replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
    };
    var defineDeprecationWarning = function (methodName, info) {
      Object.defineProperty(Component.prototype, methodName, {
        get: function () {
          lowPriorityWarning$1(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
          return undefined;
        }
      });
    };
    for (var fnName in deprecatedAPIs) {
      if (deprecatedAPIs.hasOwnProperty(fnName)) {
        defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      }
    }
  }

  function ComponentDummy() {}
  ComponentDummy.prototype = Component.prototype;

  /**
   * Convenience component with default shallow equality check for sCU.
   */
  function PureComponent(props, context, updater) {
    this.props = props;
    this.context = context;
    // If a component has string refs, we will assign a different object later.
    this.refs = emptyObject;
    this.updater = updater || ReactNoopUpdateQueue;
  }

  var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
  pureComponentPrototype.constructor = PureComponent;
  // Avoid an extra prototype jump for these methods.
  _assign(pureComponentPrototype, Component.prototype);
  pureComponentPrototype.isPureReactComponent = true;

  // an immutable object with a single mutable value
  function createRef() {
    var refObject = {
      current: null
    };
    {
      Object.seal(refObject);
    }
    return refObject;
  }

  /**
   * Keeps track of the current dispatcher.
   */
  var ReactCurrentDispatcher = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: null
  };

  /**
   * Keeps track of the current owner.
   *
   * The current owner is the component who should own any components that are
   * currently being constructed.
   */
  var ReactCurrentOwner = {
    /**
     * @internal
     * @type {ReactComponent}
     */
    current: null
  };

  var BEFORE_SLASH_RE = /^(.*)[\\\/]/;

  var describeComponentFrame = function (name, source, ownerName) {
    var sourceInfo = '';
    if (source) {
      var path = source.fileName;
      var fileName = path.replace(BEFORE_SLASH_RE, '');
      {
        // In DEV, include code for a common special case:
        // prefer "folder/index.js" instead of just "index.js".
        if (/^index\./.test(fileName)) {
          var match = path.match(BEFORE_SLASH_RE);
          if (match) {
            var pathBeforeSlash = match[1];
            if (pathBeforeSlash) {
              var folderName = pathBeforeSlash.replace(BEFORE_SLASH_RE, '');
              fileName = folderName + '/' + fileName;
            }
          }
        }
      }
      sourceInfo = ' (at ' + fileName + ':' + source.lineNumber + ')';
    } else if (ownerName) {
      sourceInfo = ' (created by ' + ownerName + ')';
    }
    return '\n    in ' + (name || 'Unknown') + sourceInfo;
  };

  var Resolved = 1;


  function refineResolvedLazyComponent(lazyComponent) {
    return lazyComponent._status === Resolved ? lazyComponent._result : null;
  }

  function getWrappedName(outerType, innerType, wrapperName) {
    var functionName = innerType.displayName || innerType.name || '';
    return outerType.displayName || (functionName !== '' ? wrapperName + '(' + functionName + ')' : wrapperName);
  }

  function getComponentName(type) {
    if (type == null) {
      // Host root, text node or just invalid type.
      return null;
    }
    {
      if (typeof type.tag === 'number') {
        warningWithoutStack$1(false, 'Received an unexpected object in getComponentName(). ' + 'This is likely a bug in React. Please file an issue.');
      }
    }
    if (typeof type === 'function') {
      return type.displayName || type.name || null;
    }
    if (typeof type === 'string') {
      return type;
    }
    switch (type) {
      case REACT_CONCURRENT_MODE_TYPE:
        return 'ConcurrentMode';
      case REACT_FRAGMENT_TYPE:
        return 'Fragment';
      case REACT_PORTAL_TYPE:
        return 'Portal';
      case REACT_PROFILER_TYPE:
        return 'Profiler';
      case REACT_STRICT_MODE_TYPE:
        return 'StrictMode';
      case REACT_SUSPENSE_TYPE:
        return 'Suspense';
    }
    if (typeof type === 'object') {
      switch (type.$$typeof) {
        case REACT_CONTEXT_TYPE:
          return 'Context.Consumer';
        case REACT_PROVIDER_TYPE:
          return 'Context.Provider';
        case REACT_FORWARD_REF_TYPE:
          return getWrappedName(type, type.render, 'ForwardRef');
        case REACT_MEMO_TYPE:
          return getComponentName(type.type);
        case REACT_LAZY_TYPE:
          {
            var thenable = type;
            var resolvedThenable = refineResolvedLazyComponent(thenable);
            if (resolvedThenable) {
              return getComponentName(resolvedThenable);
            }
          }
      }
    }
    return null;
  }

  var ReactDebugCurrentFrame = {};

  var currentlyValidatingElement = null;

  function setCurrentlyValidatingElement(element) {
    {
      currentlyValidatingElement = element;
    }
  }

  {
    // Stack implementation injected by the current renderer.
    ReactDebugCurrentFrame.getCurrentStack = null;

    ReactDebugCurrentFrame.getStackAddendum = function () {
      var stack = '';

      // Add an extra top frame while an element is being validated
      if (currentlyValidatingElement) {
        var name = getComponentName(currentlyValidatingElement.type);
        var owner = currentlyValidatingElement._owner;
        stack += describeComponentFrame(name, currentlyValidatingElement._source, owner && getComponentName(owner.type));
      }

      // Delegate to the injected renderer-specific implementation
      var impl = ReactDebugCurrentFrame.getCurrentStack;
      if (impl) {
        stack += impl() || '';
      }

      return stack;
    };
  }

  var ReactSharedInternals = {
    ReactCurrentDispatcher: ReactCurrentDispatcher,
    ReactCurrentOwner: ReactCurrentOwner,
    // Used by renderers to avoid bundling object-assign twice in UMD bundles:
    assign: _assign
  };

  {
    _assign(ReactSharedInternals, {
      // These should not be included in production.
      ReactDebugCurrentFrame: ReactDebugCurrentFrame,
      // Shim for React DOM 16.0.0 which still destructured (but not used) this.
      // TODO: remove in React 17.0.
      ReactComponentTreeHook: {}
    });
  }

  /**
   * Similar to invariant but only logs a warning if the condition is not met.
   * This can be used to log issues in development environments in critical
   * paths. Removing the logging code for production environments will keep the
   * same logic and follow the same code paths.
   */

  var warning = warningWithoutStack$1;

  {
    warning = function (condition, format) {
      if (condition) {
        return;
      }
      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      var stack = ReactDebugCurrentFrame.getStackAddendum();
      // eslint-disable-next-line react-internal/warning-and-invariant-args

      for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      warningWithoutStack$1.apply(undefined, [false, format + '%s'].concat(args, [stack]));
    };
  }

  var warning$1 = warning;

  var hasOwnProperty = Object.prototype.hasOwnProperty;

  var RESERVED_PROPS = {
    key: true,
    ref: true,
    __self: true,
    __source: true
  };

  var specialPropKeyWarningShown = void 0;
  var specialPropRefWarningShown = void 0;

  function hasValidRef(config) {
    {
      if (hasOwnProperty.call(config, 'ref')) {
        var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }
    return config.ref !== undefined;
  }

  function hasValidKey(config) {
    {
      if (hasOwnProperty.call(config, 'key')) {
        var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
        if (getter && getter.isReactWarning) {
          return false;
        }
      }
    }
    return config.key !== undefined;
  }

  function defineKeyPropWarningGetter(props, displayName) {
    var warnAboutAccessingKey = function () {
      if (!specialPropKeyWarningShown) {
        specialPropKeyWarningShown = true;
        warningWithoutStack$1(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
      }
    };
    warnAboutAccessingKey.isReactWarning = true;
    Object.defineProperty(props, 'key', {
      get: warnAboutAccessingKey,
      configurable: true
    });
  }

  function defineRefPropWarningGetter(props, displayName) {
    var warnAboutAccessingRef = function () {
      if (!specialPropRefWarningShown) {
        specialPropRefWarningShown = true;
        warningWithoutStack$1(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
      }
    };
    warnAboutAccessingRef.isReactWarning = true;
    Object.defineProperty(props, 'ref', {
      get: warnAboutAccessingRef,
      configurable: true
    });
  }

  /**
   * Factory method to create a new React element. This no longer adheres to
   * the class pattern, so do not use new to call it. Also, no instanceof check
   * will work. Instead test $$typeof field against Symbol.for('react.element') to check
   * if something is a React Element.
   *
   * @param {*} type
   * @param {*} key
   * @param {string|object} ref
   * @param {*} self A *temporary* helper to detect places where `this` is
   * different from the `owner` when React.createElement is called, so that we
   * can warn. We want to get rid of owner and replace string `ref`s with arrow
   * functions, and as long as `this` and owner are the same, there will be no
   * change in behavior.
   * @param {*} source An annotation object (added by a transpiler or otherwise)
   * indicating filename, line number, and/or other information.
   * @param {*} owner
   * @param {*} props
   * @internal
   */
  var ReactElement = function (type, key, ref, self, source, owner, props) {
    var element = {
      // This tag allows us to uniquely identify this as a React Element
      $$typeof: REACT_ELEMENT_TYPE,

      // Built-in properties that belong on the element
      type: type,
      key: key,
      ref: ref,
      props: props,

      // Record the component responsible for creating this element.
      _owner: owner
    };

    {
      // The validation flag is currently mutative. We put it on
      // an external backing store so that we can freeze the whole object.
      // This can be replaced with a WeakMap once they are implemented in
      // commonly used development environments.
      element._store = {};

      // To make comparing ReactElements easier for testing purposes, we make
      // the validation flag non-enumerable (where possible, which should
      // include every environment we run tests in), so the test framework
      // ignores it.
      Object.defineProperty(element._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: false
      });
      // self and source are DEV only properties.
      Object.defineProperty(element, '_self', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: self
      });
      // Two elements created in two different places should be considered
      // equal for testing purposes and therefore we hide it from enumeration.
      Object.defineProperty(element, '_source', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: source
      });
      if (Object.freeze) {
        Object.freeze(element.props);
        Object.freeze(element);
      }
    }

    return element;
  };

  /**
   * Create and return a new ReactElement of the given type.
   * See https://reactjs.org/docs/react-api.html#createelement
   */
  function createElement(type, config, children) {
    var propName = void 0;

    // Reserved names are extracted
    var props = {};

    var key = null;
    var ref = null;
    var self = null;
    var source = null;

    if (config != null) {
      if (hasValidRef(config)) {
        ref = config.ref;
      }
      if (hasValidKey(config)) {
        key = '' + config.key;
      }

      self = config.__self === undefined ? null : config.__self;
      source = config.__source === undefined ? null : config.__source;
      // Remaining properties are added to a new props object
      for (propName in config) {
        if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          props[propName] = config[propName];
        }
      }
    }

    // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.
    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
      {
        if (Object.freeze) {
          Object.freeze(childArray);
        }
      }
      props.children = childArray;
    }

    // Resolve default props
    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;
      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }
    {
      if (key || ref) {
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }
        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
      }
    }
    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
  }

  /**
   * Return a function that produces ReactElements of a given type.
   * See https://reactjs.org/docs/react-api.html#createfactory
   */


  function cloneAndReplaceKey(oldElement, newKey) {
    var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

    return newElement;
  }

  /**
   * Clone and return a new ReactElement using element as the starting point.
   * See https://reactjs.org/docs/react-api.html#cloneelement
   */
  function cloneElement(element, config, children) {
    !!(element === null || element === undefined) ? invariant(false, 'React.cloneElement(...): The argument must be a React element, but you passed %s.', element) : void 0;

    var propName = void 0;

    // Original props are copied
    var props = _assign({}, element.props);

    // Reserved names are extracted
    var key = element.key;
    var ref = element.ref;
    // Self is preserved since the owner is preserved.
    var self = element._self;
    // Source is preserved since cloneElement is unlikely to be targeted by a
    // transpiler, and the original source is probably a better indicator of the
    // true owner.
    var source = element._source;

    // Owner will be preserved, unless ref is overridden
    var owner = element._owner;

    if (config != null) {
      if (hasValidRef(config)) {
        // Silently steal the ref from the parent.
        ref = config.ref;
        owner = ReactCurrentOwner.current;
      }
      if (hasValidKey(config)) {
        key = '' + config.key;
      }

      // Remaining properties override existing props
      var defaultProps = void 0;
      if (element.type && element.type.defaultProps) {
        defaultProps = element.type.defaultProps;
      }
      for (propName in config) {
        if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          if (config[propName] === undefined && defaultProps !== undefined) {
            // Resolve default props
            props[propName] = defaultProps[propName];
          } else {
            props[propName] = config[propName];
          }
        }
      }
    }

    // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.
    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
      props.children = childArray;
    }

    return ReactElement(element.type, key, ref, self, source, owner, props);
  }

  /**
   * Verifies the object is a ReactElement.
   * See https://reactjs.org/docs/react-api.html#isvalidelement
   * @param {?object} object
   * @return {boolean} True if `object` is a ReactElement.
   * @final
   */
  function isValidElement(object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }

  var SEPARATOR = '.';
  var SUBSEPARATOR = ':';

  /**
   * Escape and wrap key so it is safe to use as a reactid
   *
   * @param {string} key to be escaped.
   * @return {string} the escaped key.
   */
  function escape(key) {
    var escapeRegex = /[=:]/g;
    var escaperLookup = {
      '=': '=0',
      ':': '=2'
    };
    var escapedString = ('' + key).replace(escapeRegex, function (match) {
      return escaperLookup[match];
    });

    return '$' + escapedString;
  }

  /**
   * TODO: Test that a single child and an array with one item have the same key
   * pattern.
   */

  var didWarnAboutMaps = false;

  var userProvidedKeyEscapeRegex = /\/+/g;
  function escapeUserProvidedKey(text) {
    return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
  }

  var POOL_SIZE = 10;
  var traverseContextPool = [];
  function getPooledTraverseContext(mapResult, keyPrefix, mapFunction, mapContext) {
    if (traverseContextPool.length) {
      var traverseContext = traverseContextPool.pop();
      traverseContext.result = mapResult;
      traverseContext.keyPrefix = keyPrefix;
      traverseContext.func = mapFunction;
      traverseContext.context = mapContext;
      traverseContext.count = 0;
      return traverseContext;
    } else {
      return {
        result: mapResult,
        keyPrefix: keyPrefix,
        func: mapFunction,
        context: mapContext,
        count: 0
      };
    }
  }

  function releaseTraverseContext(traverseContext) {
    traverseContext.result = null;
    traverseContext.keyPrefix = null;
    traverseContext.func = null;
    traverseContext.context = null;
    traverseContext.count = 0;
    if (traverseContextPool.length < POOL_SIZE) {
      traverseContextPool.push(traverseContext);
    }
  }

  /**
   * @param {?*} children Children tree container.
   * @param {!string} nameSoFar Name of the key path so far.
   * @param {!function} callback Callback to invoke with each child found.
   * @param {?*} traverseContext Used to pass information throughout the traversal
   * process.
   * @return {!number} The number of children in this subtree.
   */
  function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
    var type = typeof children;

    if (type === 'undefined' || type === 'boolean') {
      // All of the above are perceived as null.
      children = null;
    }

    var invokeCallback = false;

    if (children === null) {
      invokeCallback = true;
    } else {
      switch (type) {
        case 'string':
        case 'number':
          invokeCallback = true;
          break;
        case 'object':
          switch (children.$$typeof) {
            case REACT_ELEMENT_TYPE:
            case REACT_PORTAL_TYPE:
              invokeCallback = true;
          }
      }
    }

    if (invokeCallback) {
      callback(traverseContext, children,
      // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows.
      nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
      return 1;
    }

    var child = void 0;
    var nextName = void 0;
    var subtreeCount = 0; // Count of children found in the current subtree.
    var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        child = children[i];
        nextName = nextNamePrefix + getComponentKey(child, i);
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    } else {
      var iteratorFn = getIteratorFn(children);
      if (typeof iteratorFn === 'function') {
        {
          // Warn about using Maps as children
          if (iteratorFn === children.entries) {
            !didWarnAboutMaps ? warning$1(false, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.') : void 0;
            didWarnAboutMaps = true;
          }
        }

        var iterator = iteratorFn.call(children);
        var step = void 0;
        var ii = 0;
        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = nextNamePrefix + getComponentKey(child, ii++);
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else if (type === 'object') {
        var addendum = '';
        {
          addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + ReactDebugCurrentFrame.getStackAddendum();
        }
        var childrenString = '' + children;
        invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum);
      }
    }

    return subtreeCount;
  }

  /**
   * Traverses children that are typically specified as `props.children`, but
   * might also be specified through attributes:
   *
   * - `traverseAllChildren(this.props.children, ...)`
   * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
   *
   * The `traverseContext` is an optional argument that is passed through the
   * entire traversal. It can be used to store accumulations or anything else that
   * the callback might find relevant.
   *
   * @param {?*} children Children tree object.
   * @param {!function} callback To invoke upon traversing each child.
   * @param {?*} traverseContext Context for traversal.
   * @return {!number} The number of children in this subtree.
   */
  function traverseAllChildren(children, callback, traverseContext) {
    if (children == null) {
      return 0;
    }

    return traverseAllChildrenImpl(children, '', callback, traverseContext);
  }

  /**
   * Generate a key string that identifies a component within a set.
   *
   * @param {*} component A component that could contain a manual key.
   * @param {number} index Index that is used if a manual key is not provided.
   * @return {string}
   */
  function getComponentKey(component, index) {
    // Do some typechecking here since we call this blindly. We want to ensure
    // that we don't block potential future ES APIs.
    if (typeof component === 'object' && component !== null && component.key != null) {
      // Explicit key
      return escape(component.key);
    }
    // Implicit key determined by the index in the set
    return index.toString(36);
  }

  function forEachSingleChild(bookKeeping, child, name) {
    var func = bookKeeping.func,
        context = bookKeeping.context;

    func.call(context, child, bookKeeping.count++);
  }

  /**
   * Iterates through children that are typically specified as `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
   *
   * The provided forEachFunc(child, index) will be called for each
   * leaf child.
   *
   * @param {?*} children Children tree container.
   * @param {function(*, int)} forEachFunc
   * @param {*} forEachContext Context for forEachContext.
   */
  function forEachChildren(children, forEachFunc, forEachContext) {
    if (children == null) {
      return children;
    }
    var traverseContext = getPooledTraverseContext(null, null, forEachFunc, forEachContext);
    traverseAllChildren(children, forEachSingleChild, traverseContext);
    releaseTraverseContext(traverseContext);
  }

  function mapSingleChildIntoContext(bookKeeping, child, childKey) {
    var result = bookKeeping.result,
        keyPrefix = bookKeeping.keyPrefix,
        func = bookKeeping.func,
        context = bookKeeping.context;


    var mappedChild = func.call(context, child, bookKeeping.count++);
    if (Array.isArray(mappedChild)) {
      mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, function (c) {
        return c;
      });
    } else if (mappedChild != null) {
      if (isValidElement(mappedChild)) {
        mappedChild = cloneAndReplaceKey(mappedChild,
        // Keep both the (mapped) and old keys if they differ, just as
        // traverseAllChildren used to do for objects as children
        keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
      }
      result.push(mappedChild);
    }
  }

  function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
    var escapedPrefix = '';
    if (prefix != null) {
      escapedPrefix = escapeUserProvidedKey(prefix) + '/';
    }
    var traverseContext = getPooledTraverseContext(array, escapedPrefix, func, context);
    traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
    releaseTraverseContext(traverseContext);
  }

  /**
   * Maps children that are typically specified as `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenmap
   *
   * The provided mapFunction(child, key, index) will be called for each
   * leaf child.
   *
   * @param {?*} children Children tree container.
   * @param {function(*, int)} func The map function.
   * @param {*} context Context for mapFunction.
   * @return {object} Object containing the ordered map of results.
   */
  function mapChildren(children, func, context) {
    if (children == null) {
      return children;
    }
    var result = [];
    mapIntoWithKeyPrefixInternal(children, result, null, func, context);
    return result;
  }

  /**
   * Count the number of children that are typically specified as
   * `props.children`.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrencount
   *
   * @param {?*} children Children tree container.
   * @return {number} The number of children.
   */
  function countChildren(children) {
    return traverseAllChildren(children, function () {
      return null;
    }, null);
  }

  /**
   * Flatten a children object (typically specified as `props.children`) and
   * return an array with appropriately re-keyed children.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
   */
  function toArray(children) {
    var result = [];
    mapIntoWithKeyPrefixInternal(children, result, null, function (child) {
      return child;
    });
    return result;
  }

  /**
   * Returns the first child in a collection of children and verifies that there
   * is only one child in the collection.
   *
   * See https://reactjs.org/docs/react-api.html#reactchildrenonly
   *
   * The current implementation of this function assumes that a single child gets
   * passed without a wrapper, but the purpose of this helper function is to
   * abstract away the particular structure of children.
   *
   * @param {?object} children Child collection structure.
   * @return {ReactElement} The first and only `ReactElement` contained in the
   * structure.
   */
  function onlyChild(children) {
    !isValidElement(children) ? invariant(false, 'React.Children.only expected to receive a single React element child.') : void 0;
    return children;
  }

  function createContext(defaultValue, calculateChangedBits) {
    if (calculateChangedBits === undefined) {
      calculateChangedBits = null;
    } else {
      {
        !(calculateChangedBits === null || typeof calculateChangedBits === 'function') ? warningWithoutStack$1(false, 'createContext: Expected the optional second argument to be a ' + 'function. Instead received: %s', calculateChangedBits) : void 0;
      }
    }

    var context = {
      $$typeof: REACT_CONTEXT_TYPE,
      _calculateChangedBits: calculateChangedBits,
      // As a workaround to support multiple concurrent renderers, we categorize
      // some renderers as primary and others as secondary. We only expect
      // there to be two concurrent renderers at most: React Native (primary) and
      // Fabric (secondary); React DOM (primary) and React ART (secondary).
      // Secondary renderers store their context values on separate fields.
      _currentValue: defaultValue,
      _currentValue2: defaultValue,
      // Used to track how many concurrent renderers this context currently
      // supports within in a single renderer. Such as parallel server rendering.
      _threadCount: 0,
      // These are circular
      Provider: null,
      Consumer: null
    };

    context.Provider = {
      $$typeof: REACT_PROVIDER_TYPE,
      _context: context
    };

    var hasWarnedAboutUsingNestedContextConsumers = false;
    var hasWarnedAboutUsingConsumerProvider = false;

    {
      // A separate object, but proxies back to the original context object for
      // backwards compatibility. It has a different $$typeof, so we can properly
      // warn for the incorrect usage of Context as a Consumer.
      var Consumer = {
        $$typeof: REACT_CONTEXT_TYPE,
        _context: context,
        _calculateChangedBits: context._calculateChangedBits
      };
      // $FlowFixMe: Flow complains about not setting a value, which is intentional here
      Object.defineProperties(Consumer, {
        Provider: {
          get: function () {
            if (!hasWarnedAboutUsingConsumerProvider) {
              hasWarnedAboutUsingConsumerProvider = true;
              warning$1(false, 'Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
            }
            return context.Provider;
          },
          set: function (_Provider) {
            context.Provider = _Provider;
          }
        },
        _currentValue: {
          get: function () {
            return context._currentValue;
          },
          set: function (_currentValue) {
            context._currentValue = _currentValue;
          }
        },
        _currentValue2: {
          get: function () {
            return context._currentValue2;
          },
          set: function (_currentValue2) {
            context._currentValue2 = _currentValue2;
          }
        },
        _threadCount: {
          get: function () {
            return context._threadCount;
          },
          set: function (_threadCount) {
            context._threadCount = _threadCount;
          }
        },
        Consumer: {
          get: function () {
            if (!hasWarnedAboutUsingNestedContextConsumers) {
              hasWarnedAboutUsingNestedContextConsumers = true;
              warning$1(false, 'Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
            }
            return context.Consumer;
          }
        }
      });
      // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty
      context.Consumer = Consumer;
    }

    {
      context._currentRenderer = null;
      context._currentRenderer2 = null;
    }

    return context;
  }

  function lazy(ctor) {
    var lazyType = {
      $$typeof: REACT_LAZY_TYPE,
      _ctor: ctor,
      // React uses these fields to store the result.
      _status: -1,
      _result: null
    };

    {
      // In production, this would just set it on the object.
      var defaultProps = void 0;
      var propTypes = void 0;
      Object.defineProperties(lazyType, {
        defaultProps: {
          configurable: true,
          get: function () {
            return defaultProps;
          },
          set: function (newDefaultProps) {
            warning$1(false, 'React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
            defaultProps = newDefaultProps;
            // Match production behavior more closely:
            Object.defineProperty(lazyType, 'defaultProps', {
              enumerable: true
            });
          }
        },
        propTypes: {
          configurable: true,
          get: function () {
            return propTypes;
          },
          set: function (newPropTypes) {
            warning$1(false, 'React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');
            propTypes = newPropTypes;
            // Match production behavior more closely:
            Object.defineProperty(lazyType, 'propTypes', {
              enumerable: true
            });
          }
        }
      });
    }

    return lazyType;
  }

  function forwardRef(render) {
    {
      if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
        warningWithoutStack$1(false, 'forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
      } else if (typeof render !== 'function') {
        warningWithoutStack$1(false, 'forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
      } else {
        !(
        // Do not warn for 0 arguments because it could be due to usage of the 'arguments' object
        render.length === 0 || render.length === 2) ? warningWithoutStack$1(false, 'forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.') : void 0;
      }

      if (render != null) {
        !(render.defaultProps == null && render.propTypes == null) ? warningWithoutStack$1(false, 'forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?') : void 0;
      }
    }

    return {
      $$typeof: REACT_FORWARD_REF_TYPE,
      render: render
    };
  }

  function isValidElementType(type) {
    return typeof type === 'string' || typeof type === 'function' ||
    // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
    type === REACT_FRAGMENT_TYPE || type === REACT_CONCURRENT_MODE_TYPE || type === REACT_PROFILER_TYPE || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || typeof type === 'object' && type !== null && (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE);
  }

  function memo(type, compare) {
    {
      if (!isValidElementType(type)) {
        warningWithoutStack$1(false, 'memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
      }
    }
    return {
      $$typeof: REACT_MEMO_TYPE,
      type: type,
      compare: compare === undefined ? null : compare
    };
  }

  function resolveDispatcher() {
    var dispatcher = ReactCurrentDispatcher.current;
    !(dispatcher !== null) ? invariant(false, 'Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://fb.me/react-invalid-hook-call for tips about how to debug and fix this problem.') : void 0;
    return dispatcher;
  }

  function useContext(Context, unstable_observedBits) {
    var dispatcher = resolveDispatcher();
    {
      !(unstable_observedBits === undefined) ? warning$1(false, 'useContext() second argument is reserved for future ' + 'use in React. Passing it is not supported. ' + 'You passed: %s.%s', unstable_observedBits, typeof unstable_observedBits === 'number' && Array.isArray(arguments[2]) ? '\n\nDid you call array.map(useContext)? ' + 'Calling Hooks inside a loop is not supported. ' + 'Learn more at https://fb.me/rules-of-hooks' : '') : void 0;

      // TODO: add a more generic warning for invalid values.
      if (Context._context !== undefined) {
        var realContext = Context._context;
        // Don't deduplicate because this legitimately causes bugs
        // and nobody should be using this in existing code.
        if (realContext.Consumer === Context) {
          warning$1(false, 'Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
        } else if (realContext.Provider === Context) {
          warning$1(false, 'Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
        }
      }
    }
    return dispatcher.useContext(Context, unstable_observedBits);
  }

  function useState(initialState) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useState(initialState);
  }

  function useReducer(reducer, initialArg, init) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useReducer(reducer, initialArg, init);
  }

  function useRef(initialValue) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useRef(initialValue);
  }

  function useEffect(create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useEffect(create, inputs);
  }

  function useLayoutEffect(create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useLayoutEffect(create, inputs);
  }

  function useCallback(callback, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useCallback(callback, inputs);
  }

  function useMemo(create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useMemo(create, inputs);
  }

  function useImperativeHandle(ref, create, inputs) {
    var dispatcher = resolveDispatcher();
    return dispatcher.useImperativeHandle(ref, create, inputs);
  }

  function useDebugValue(value, formatterFn) {
    {
      var dispatcher = resolveDispatcher();
      return dispatcher.useDebugValue(value, formatterFn);
    }
  }

  /**
   * ReactElementValidator provides a wrapper around a element factory
   * which validates the props passed to the element. This is intended to be
   * used only in DEV and could be replaced by a static type checker for languages
   * that support it.
   */

  var propTypesMisspellWarningShown = void 0;

  {
    propTypesMisspellWarningShown = false;
  }

  function getDeclarationErrorAddendum() {
    if (ReactCurrentOwner.current) {
      var name = getComponentName(ReactCurrentOwner.current.type);
      if (name) {
        return '\n\nCheck the render method of `' + name + '`.';
      }
    }
    return '';
  }

  function getSourceInfoErrorAddendum(elementProps) {
    if (elementProps !== null && elementProps !== undefined && elementProps.__source !== undefined) {
      var source = elementProps.__source;
      var fileName = source.fileName.replace(/^.*[\\\/]/, '');
      var lineNumber = source.lineNumber;
      return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
    }
    return '';
  }

  /**
   * Warn if there's no key explicitly set on dynamic arrays of children or
   * object keys are not valid. This allows us to keep track of children between
   * updates.
   */
  var ownerHasKeyUseWarning = {};

  function getCurrentComponentErrorInfo(parentType) {
    var info = getDeclarationErrorAddendum();

    if (!info) {
      var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
      if (parentName) {
        info = '\n\nCheck the top-level render call using <' + parentName + '>.';
      }
    }
    return info;
  }

  /**
   * Warn if the element doesn't have an explicit key assigned to it.
   * This element is in an array. The array could grow and shrink or be
   * reordered. All children that haven't already been validated are required to
   * have a "key" property assigned to it. Error statuses are cached so a warning
   * will only be shown once.
   *
   * @internal
   * @param {ReactElement} element Element that requires a key.
   * @param {*} parentType element's parent's type.
   */
  function validateExplicitKey(element, parentType) {
    if (!element._store || element._store.validated || element.key != null) {
      return;
    }
    element._store.validated = true;

    var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
    if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
      return;
    }
    ownerHasKeyUseWarning[currentComponentErrorInfo] = true;

    // Usually the current owner is the offender, but if it accepts children as a
    // property, it may be the creator of the child that's responsible for
    // assigning it a key.
    var childOwner = '';
    if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
      // Give the component that originally created this child.
      childOwner = ' It was passed a child from ' + getComponentName(element._owner.type) + '.';
    }

    setCurrentlyValidatingElement(element);
    {
      warning$1(false, 'Each child in a list should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.', currentComponentErrorInfo, childOwner);
    }
    setCurrentlyValidatingElement(null);
  }

  /**
   * Ensure that every element either is passed in a static location, in an
   * array with an explicit keys property defined, or in an object literal
   * with valid key property.
   *
   * @internal
   * @param {ReactNode} node Statically passed child of any type.
   * @param {*} parentType node's parent's type.
   */
  function validateChildKeys(node, parentType) {
    if (typeof node !== 'object') {
      return;
    }
    if (Array.isArray(node)) {
      for (var i = 0; i < node.length; i++) {
        var child = node[i];
        if (isValidElement(child)) {
          validateExplicitKey(child, parentType);
        }
      }
    } else if (isValidElement(node)) {
      // This element was passed in a valid location.
      if (node._store) {
        node._store.validated = true;
      }
    } else if (node) {
      var iteratorFn = getIteratorFn(node);
      if (typeof iteratorFn === 'function') {
        // Entry iterators used to provide implicit keys,
        // but now we print a separate warning for them later.
        if (iteratorFn !== node.entries) {
          var iterator = iteratorFn.call(node);
          var step = void 0;
          while (!(step = iterator.next()).done) {
            if (isValidElement(step.value)) {
              validateExplicitKey(step.value, parentType);
            }
          }
        }
      }
    }
  }

  /**
   * Given an element, validate that its props follow the propTypes definition,
   * provided by the type.
   *
   * @param {ReactElement} element
   */
  function validatePropTypes(element) {
    var type = element.type;
    if (type === null || type === undefined || typeof type === 'string') {
      return;
    }
    var name = getComponentName(type);
    var propTypes = void 0;
    if (typeof type === 'function') {
      propTypes = type.propTypes;
    } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE ||
    // Note: Memo only checks outer props here.
    // Inner props are checked in the reconciler.
    type.$$typeof === REACT_MEMO_TYPE)) {
      propTypes = type.propTypes;
    } else {
      return;
    }
    if (propTypes) {
      setCurrentlyValidatingElement(element);
      checkPropTypes(propTypes, element.props, 'prop', name, ReactDebugCurrentFrame.getStackAddendum);
      setCurrentlyValidatingElement(null);
    } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
      propTypesMisspellWarningShown = true;
      warningWithoutStack$1(false, 'Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', name || 'Unknown');
    }
    if (typeof type.getDefaultProps === 'function') {
      !type.getDefaultProps.isReactClassApproved ? warningWithoutStack$1(false, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
    }
  }

  /**
   * Given a fragment, validate that it can only be provided with fragment props
   * @param {ReactElement} fragment
   */
  function validateFragmentProps(fragment) {
    setCurrentlyValidatingElement(fragment);

    var keys = Object.keys(fragment.props);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (key !== 'children' && key !== 'key') {
        warning$1(false, 'Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);
        break;
      }
    }

    if (fragment.ref !== null) {
      warning$1(false, 'Invalid attribute `ref` supplied to `React.Fragment`.');
    }

    setCurrentlyValidatingElement(null);
  }

  function createElementWithValidation(type, props, children) {
    var validType = isValidElementType(type);

    // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.
    if (!validType) {
      var info = '';
      if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
        info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
      }

      var sourceInfo = getSourceInfoErrorAddendum(props);
      if (sourceInfo) {
        info += sourceInfo;
      } else {
        info += getDeclarationErrorAddendum();
      }

      var typeString = void 0;
      if (type === null) {
        typeString = 'null';
      } else if (Array.isArray(type)) {
        typeString = 'array';
      } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
        typeString = '<' + (getComponentName(type.type) || 'Unknown') + ' />';
        info = ' Did you accidentally export a JSX literal instead of a component?';
      } else {
        typeString = typeof type;
      }

      warning$1(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
    }

    var element = createElement.apply(this, arguments);

    // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.
    if (element == null) {
      return element;
    }

    // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)
    if (validType) {
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], type);
      }
    }

    if (type === REACT_FRAGMENT_TYPE) {
      validateFragmentProps(element);
    } else {
      validatePropTypes(element);
    }

    return element;
  }

  function createFactoryWithValidation(type) {
    var validatedFactory = createElementWithValidation.bind(null, type);
    validatedFactory.type = type;
    // Legacy hook: remove it
    {
      Object.defineProperty(validatedFactory, 'type', {
        enumerable: false,
        get: function () {
          lowPriorityWarning$1(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
          Object.defineProperty(this, 'type', {
            value: type
          });
          return type;
        }
      });
    }

    return validatedFactory;
  }

  function cloneElementWithValidation(element, props, children) {
    var newElement = cloneElement.apply(this, arguments);
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], newElement.type);
    }
    validatePropTypes(newElement);
    return newElement;
  }

  var React = {
    Children: {
      map: mapChildren,
      forEach: forEachChildren,
      count: countChildren,
      toArray: toArray,
      only: onlyChild
    },

    createRef: createRef,
    Component: Component,
    PureComponent: PureComponent,

    createContext: createContext,
    forwardRef: forwardRef,
    lazy: lazy,
    memo: memo,

    useCallback: useCallback,
    useContext: useContext,
    useEffect: useEffect,
    useImperativeHandle: useImperativeHandle,
    useDebugValue: useDebugValue,
    useLayoutEffect: useLayoutEffect,
    useMemo: useMemo,
    useReducer: useReducer,
    useRef: useRef,
    useState: useState,

    Fragment: REACT_FRAGMENT_TYPE,
    StrictMode: REACT_STRICT_MODE_TYPE,
    Suspense: REACT_SUSPENSE_TYPE,

    createElement: createElementWithValidation,
    cloneElement: cloneElementWithValidation,
    createFactory: createFactoryWithValidation,
    isValidElement: isValidElement,

    version: ReactVersion,

    unstable_ConcurrentMode: REACT_CONCURRENT_MODE_TYPE,
    unstable_Profiler: REACT_PROFILER_TYPE,

    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: ReactSharedInternals
  };



  var React$2 = Object.freeze({
  	default: React
  });

  var React$3 = ( React$2 && React ) || React$2;

  // TODO: decide on the top-level export form.
  // This is hacky but makes it work with both Rollup and Jest.
  var react = React$3.default || React$3;

  module.exports = react;
    })();
  }
  });

  var react = createCommonjsModule(function (module) {

  if (process.env.NODE_ENV === 'production') {
    module.exports = react_production_min;
  } else {
    module.exports = react_development;
  }
  });

  var artplayer = createCommonjsModule(function (module, exports) {
  /*!
   * artplayer.js v1.0.7
   * Github: https://github.com/zhw2590582/ArtPlayer#readme
   * (c) 2017-2019 Harvey Zack
   * Released under the MIT License.
   */

  !function(t,e){module.exports=e();}(commonjsGlobal,function(){var a=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")};function i(t,e){for(var n=0;n<e.length;n++){var i=e[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i);}}var r=function(t,e,n){return e&&i(t.prototype,e),n&&i(t,n),t},o="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof commonjsGlobal?commonjsGlobal:"undefined"!=typeof self?self:{};function t(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}function e(t,e){return t(e={exports:{}},e.exports),e.exports}var n=e(function(e){function n(t){return (n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function i(t){return "function"==typeof Symbol&&"symbol"===n(Symbol.iterator)?e.exports=i=function(t){return n(t)}:e.exports=i=function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":n(t)},i(t)}e.exports=i;});var s=function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t};var c=function(t,e){return !e||"object"!==n(e)&&"function"!=typeof e?s(t):e},l=e(function(e){function n(t){return e.exports=n=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},n(t)}e.exports=n;}),u=e(function(n){function i(t,e){return n.exports=i=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},i(t,e)}n.exports=i;});var d=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&u(t,e);};function f(){}f.prototype={on:function(t,e,n){var i=this.e||(this.e={});return (i[t]||(i[t]=[])).push({fn:e,ctx:n}),this},once:function(t,e,n){var i=this;function r(){i.off(t,r),e.apply(n,arguments);}return r._=e,this.on(t,r,n)},emit:function(t){for(var e=[].slice.call(arguments,1),n=((this.e||(this.e={}))[t]||[]).slice(),i=0,r=n.length;i<r;i++)n[i].fn.apply(n[i].ctx,e);return this},off:function(t,e){var n=this.e||(this.e={}),i=n[t],r=[];if(i&&e)for(var o=0,a=i.length;o<a;o++)i[o].fn!==e&&i[o].fn._!==e&&r.push(i[o]);return r.length?n[t]=r:delete n[t],this}};var p=f,h=f;p.TinyEmitter=h;var v=e(function(t,e){t.exports=function(){function s(t){return (s="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}var c=Object.prototype.toString,a=function(t){if(void 0===t)return "undefined";if(null===t)return "null";var e,n,i,r,o,a=s(t);if("boolean"===a)return "boolean";if("string"===a)return "string";if("number"===a)return "number";if("symbol"===a)return "symbol";if("function"===a)return "GeneratorFunction"===l(t)?"generatorfunction":"function";if(e=t,Array.isArray?Array.isArray(e):e instanceof Array)return "array";if(function(t){return !(!t.constructor||"function"!=typeof t.constructor.isBuffer)&&t.constructor.isBuffer(t)}(t))return "buffer";if(function(t){try{if("number"==typeof t.length&&"function"==typeof t.callee)return !0}catch(t){if(-1!==t.message.indexOf("callee"))return !0}return !1}(t))return "arguments";if((n=t)instanceof Date||"function"==typeof n.toDateString&&"function"==typeof n.getDate&&"function"==typeof n.setDate)return "date";if((i=t)instanceof Error||"string"==typeof i.message&&i.constructor&&"number"==typeof i.constructor.stackTraceLimit)return "error";if((r=t)instanceof RegExp||"string"==typeof r.flags&&"boolean"==typeof r.ignoreCase&&"boolean"==typeof r.multiline&&"boolean"==typeof r.global)return "regexp";switch(l(t)){case"Symbol":return "symbol";case"Promise":return "promise";case"WeakMap":return "weakmap";case"WeakSet":return "weakset";case"Map":return "map";case"Set":return "set";case"Int8Array":return "int8array";case"Uint8Array":return "uint8array";case"Uint8ClampedArray":return "uint8clampedarray";case"Int16Array":return "int16array";case"Uint16Array":return "uint16array";case"Int32Array":return "int32array";case"Uint32Array":return "uint32array";case"Float32Array":return "float32array";case"Float64Array":return "float64array"}if("function"==typeof(o=t).throw&&"function"==typeof o.return&&"function"==typeof o.next)return "generator";switch(a=c.call(t)){case"[object Object]":return "object";case"[object Map Iterator]":return "mapiterator";case"[object Set Iterator]":return "setiterator";case"[object String Iterator]":return "stringiterator";case"[object Array Iterator]":return "arrayiterator"}return a.slice(8,-1).toLowerCase().replace(/\s/g,"")};function l(t){return t.constructor?t.constructor.name:null}function o(t,e){var n=2<arguments.length&&void 0!==arguments[2]?arguments[2]:["option"];for(var i in d(t,e,n),f(t,e,n),p(t,e,n),e)if(e.hasOwnProperty(i)){var r=t[i],o=e[i],a=n.concat(i);if(u(t,i,o,a))continue;d(r,o,a),f(r,o,a),p(r,o,a);}}function u(t,e,n,i){if(!Object.prototype.hasOwnProperty.call(t,e)){if(!0===n.__required__||!0===n.required)throw new TypeError("'".concat(i.join("."),"' is required"));return !0}}function d(t,e,n){var i;if("string"===a(e)?i=e:"function"===a(e)?e.___validator__=e:e.__type__?i=e.__type__:e.type&&(i=e.type),i&&"string"===a(i)){i=i.trim().toLowerCase();var r=a(t),o=r===i;if(-1<i.indexOf("|")&&(o=i.split("|").filter(Boolean).some(function(t){return r===t.trim()})),!o)throw new TypeError("'".concat(n.join("."),"' require '").concat(i,"' type, but got '").concat(r,"'"))}}function f(t,e,n){var i;if(e.___validator__?i=e.___validator__:e.validator&&(i=e.validator),"function"===a(i)){var r=i(n,t,a(t));if(!0!==r)throw new TypeError("The scheme for '".concat(n.join("."),"' validator function require return true, but got '").concat(r,"'"))}}function p(t,e,n){var i;if(e.___child__?i=e.___child__:e.child&&(i=e.child),"object"===a(i)){var r=a(t);"object"===r?o(t,i,n):"array"===r&&t.forEach(function(t,e){o(t,i,n.concat(e));});}}return o.kindOf=a,window.optionValidator=o}();});var y=function(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t};var m=function(t){return -1!==Function.toString.call(t).indexOf("[native code]")},g=e(function(i){function r(t,e,n){return !function(){if("undefined"==typeof Reflect||!Reflect.construct)return !1;if(Reflect.construct.sham)return !1;if("function"==typeof Proxy)return !0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return !1}}()?i.exports=r=function(t,e,n){var i=[null];i.push.apply(i,e);var r=new(Function.bind.apply(t,i));return n&&u(r,n.prototype),r}:i.exports=r=Reflect.construct,r.apply(null,arguments)}i.exports=r;}),b=function(t){function i(t,e){var n;return a(this,i),n=c(this,l(i).call(this,t)),"function"==typeof Error.captureStackTrace&&Error.captureStackTrace(s(n),e||n.constructor),n.name="ArtPlayerError",n}return d(i,t),i}(e(function(e){function i(t){var n="function"==typeof Map?new Map:void 0;return e.exports=i=function(t){if(null===t||!m(t))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==n){if(n.has(t))return n.get(t);n.set(t,e);}function e(){return g(t,arguments,l(this).constructor)}return e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),u(e,t)},i(t)}e.exports=i;})(Error));function w(t,e){if(!t)throw new b(e)}function x(t,e,n){return Math.max(Math.min(t,Math.max(e,n)),Math.min(e,n))}function k(t){return t.includes("?")?k(t.split("?")[0]):t.includes("#")?k(t.split("#")[0]):t.trim().toLowerCase().split(".").pop()}function E(t){var e=Math.floor(t/3600),n=Math.floor((t-3600*e)/60),i=Math.floor(t-3600*e-60*n);return (0<e?[e,n,i]:[n,i]).map(function(t){return t<10?"0".concat(t):String(t)}).join(":")}function S(){var e=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0;return new Promise(function(t){return setTimeout(t,e)})}function $(i,r,o){var a;function t(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];clearTimeout(a),a=setTimeout(function(){a=null,i.apply(o,e);},r);}return t.clearTimeout=function(){clearTimeout(a);},t}function P(t){return t&&"object"===n(t)&&!Array.isArray(t)}function T(t){return t instanceof Element}function R(n,i){var r=Object.assign({},n);return P(n)&&P(i)&&Object.keys(i).forEach(function(t){var e=i[t];P(e)&&!T(e)&&t in n?r[t]=R(n[t],e):Object.assign(r,y({},t,e));}),r}function O(t,e){return e instanceof Element?t.appendChild(e):t.insertAdjacentHTML("beforeend",e),t.lastElementChild}function C(t,e,n){var i=Array.from(t.children);e.dataset.index=n;var r=i.find(function(t){return Number(t.dataset.index)>=Number(n)});return r?r.insertAdjacentElement("beforebegin",e):O(t,e),e}function L(t,e,n){return t.style[e]=n,t}function _(e,n){return Object.keys(n).forEach(function(t){L(e,t,n[t]);}),e}function j(t,e){var n=!(2<arguments.length&&void 0!==arguments[2])||arguments[2],i=window.getComputedStyle(t,null).getPropertyValue(e);return n?parseFloat(i):i}function M(e){return Array.from(e.parentElement.children).filter(function(t){return t!==e})}function A(t,e){M(t).forEach(function(t){return t.classList.remove(e)}),t.classList.add(e);}function z(t,e){var n=2<arguments.length&&void 0!==arguments[2]?arguments[2]:"up";t.setAttribute("data-balloon",e),t.setAttribute("data-balloon-pos",n);}function W(t){return "WEBVTT \r\n\r\n".concat(t.replace(/\{\\([ibu])\}/g,"</$1>").replace(/\{\\([ibu])1\}/g,"<$1>").replace(/\{([ibu])\}/g,"<$1>").replace(/\{\/([ibu])\}/g,"</$1>").replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g,"$1.$2").concat("\r\n\r\n"))}function D(t){return URL.createObjectURL(new Blob([t],{type:"text/vtt"}))}function q(t,e){var n=document.createElement("a");L(n,"display","none"),n.href=t,n.download=e,document.body.appendChild(n),n.click(),document.body.removeChild(n);}var H=Object.freeze({ArtPlayerError:b,errorHandle:w,clamp:x,getExt:k,secondToTime:E,sleep:S,debounce:$,isObject:P,isElement:T,mergeDeep:R,append:O,remove:function(t){return t.parentNode.removeChild(t)},insertByIndex:C,setStyle:L,setStyles:_,getStyle:j,sublings:M,inverseClass:A,tooltip:z,srtToVtt:W,vttToBlob:D,downloadImage:q});function B(t,e,n){if("string"===n){if(""===e.trim())throw new b("".concat(t.join(".")," can not be empty"));return !0}if(e instanceof Element)return !0;throw new b("".concat(t.join(".")," require 'string' or 'Element' type, but got '").concat(n,"'"))}var F={container:{validator:B,required:!0},url:{type:"string|function",required:!0},poster:"string",title:"string",type:{type:"string"},mimeCodec:"string",theme:"string",volume:"number",isLive:"boolean",muted:"boolean",autoplay:"boolean",autoSize:"boolean",loop:"boolean",playbackRate:"boolean",aspectRatio:"boolean",screenshot:"boolean",setting:"boolean",hotkey:"boolean",pip:"boolean",mutex:"boolean",fullscreen:"boolean",fullscreenWeb:"boolean",plugins:{type:"array",child:{type:"function"}},whitelist:{type:"array",child:{type:"string|function|regexp"}},layers:{type:"array",child:{type:"object|function",disable:"boolean",name:"string",index:"number",html:B,style:"object",click:"function"}},contextmenu:{type:"array",child:{type:"object|function",disable:"boolean",name:"string",index:"number",html:B,style:"object",click:"function"}},quality:{type:"array",child:{default:"boolean",name:"string",url:"string"}},controls:{type:"array",child:{type:"object|function",disable:"boolean",name:"string",index:"number",html:B,style:"object",click:"function",position:function(t,e){return ["top","left","right"].includes(e)}}},highlight:{type:"array",child:{type:"object",time:"number",text:"string"}},thumbnails:{type:"object",child:{type:"object",url:"string",number:"number",width:"number",height:"number",column:"number"}},subtitle:{type:"object",child:{type:"object",url:"string",style:"object"}},moreVideoAttr:"object",icons:"object",customType:"object",lang:"string"},I={mimeCodec:{mp4:'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',webm:'video/webm; codecs="vorbis, vp8"',ts:'video/mp2t; codecs="avc1.42E01E, mp4a.40.2"'},mse:{mediaSource:{propertys:["activeSourceBuffers","duration","readyState","sourceBuffers"],methods:["addSourceBuffer","endOfStream","removeSourceBuffer","clearLiveSeekableRange","setLiveSeekableRange"],events:["sourceclose","sourceended","sourceopen"]},sourceBuffer:{propertys:["mode","updating","buffered","timestampOffset","audioTracks","videoTracks","textTracks","appendWindowStart","appendWindowEnd","trackDefaults"],methods:["appendBuffer","appendStream","abort","remove"],events:["abort","error","update","updateend","updatestart"]},sourceBufferList:{propertys:["length"],events:["addsourcebuffer","removesourcebuffer"]}},video:{propertys:["audioTracks","autoplay","buffered","controller","controls","crossOrigin","currentSrc","currentTime","defaultMuted","defaultPlaybackRate","duration","ended","error","loop","mediaGroup","muted","networkState","paused","playbackRate","played","preload","readyState","seekable","seeking","src","startDate","textTracks","videoTracks","volume"],methods:["addTextTrack","canPlayType","load","play","pause"],events:["abort","canplay","canplaythrough","durationchange","emptied","ended","error","loadeddata","loadedmetadata","loadstart","pause","play","playing","progress","ratechange","seeked","seeking","stalled","suspend","timeupdate","volumechange","waiting"]}},N=function t(e){var n=this;a(this,t);var i=e.option.whitelist;this.userAgent=window.navigator.userAgent,this.isMobile=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(this.userAgent),this.state=!this.isMobile||i.some(function(t){var e=!1;switch(v.kindOf(t)){case"string":e=-1<n.userAgent.indexOf(t);break;case"function":e=t(n.userAgent);break;case"regexp":e=t.test(n.userAgent);}return e});},U=function(){function n(t){var e=this;a(this,n),t.option.container instanceof Element?this.$container=t.option.container:this.$container=document.querySelector(t.option.container),t.constructor.instances.some(function(t){return t.template.$container===e.$container})&&w(!1,"Cannot mount multiple instances on the same dom element"),t.whitelist.state?this.initDesktop():this.initMobile();}return r(n,[{key:"initDesktop",value:function(){this.$container.innerHTML='\n          <div class="artplayer-video-player">\n            <video class="artplayer-video"></video>\n            <div class="artplayer-subtitle"></div>\n            <div class="artplayer-layers"></div>\n            <div class="artplayer-mask"></div>\n            <div class="artplayer-bottom">\n              <div class="artplayer-progress"></div>\n              <div class="artplayer-controls">\n                <div class="artplayer-controls-left"></div>\n                <div class="artplayer-controls-right"></div>\n              </div>\n            </div>\n            <div class="artplayer-loading"></div>\n            <div class="artplayer-notice">\n              <div class="artplayer-notice-inner"></div>\n            </div>\n            <div class="artplayer-setting">\n              <div class="artplayer-setting-inner">\n                <div class="artplayer-setting-body"></div>\n                <div class="artplayer-setting-close">×</div>\n              </div>\n            </div>\n            <div class="artplayer-info">\n              <div class="artplayer-info-panel"></div>\n              <div class="artplayer-info-close">[x]</div>\n            </div>\n            <div class="artplayer-pip-header">\n              <div class="artplayer-pip-title"></div>\n              <div class="artplayer-pip-close">×</div>\n            </div>\n            <div class="artplayer-contextmenu"></div>\n          </div>\n        ',this.$player=this.$container.querySelector(".artplayer-video-player"),this.$video=this.$container.querySelector(".artplayer-video"),this.$subtitle=this.$container.querySelector(".artplayer-subtitle"),this.$bottom=this.$container.querySelector(".artplayer-bottom"),this.$progress=this.$container.querySelector(".artplayer-progress"),this.$controls=this.$container.querySelector(".artplayer-controls"),this.$controlsLeft=this.$container.querySelector(".artplayer-controls-left"),this.$controlsRight=this.$container.querySelector(".artplayer-controls-right"),this.$layers=this.$container.querySelector(".artplayer-layers"),this.$loading=this.$container.querySelector(".artplayer-loading"),this.$notice=this.$container.querySelector(".artplayer-notice"),this.$noticeInner=this.$container.querySelector(".artplayer-notice-inner"),this.$mask=this.$container.querySelector(".artplayer-mask"),this.$setting=this.$container.querySelector(".artplayer-setting"),this.$settingInner=this.$container.querySelector(".artplayer-setting-inner"),this.$settingBody=this.$container.querySelector(".artplayer-setting-body"),this.$settingClose=this.$container.querySelector(".artplayer-setting-close"),this.$info=this.$container.querySelector(".artplayer-info"),this.$infoPanel=this.$container.querySelector(".artplayer-info-panel"),this.$infoClose=this.$container.querySelector(".artplayer-info-close"),this.$pipHeader=this.$container.querySelector(".artplayer-pip-header"),this.$pipTitle=this.$container.querySelector(".artplayer-pip-title"),this.$pipClose=this.$container.querySelector(".artplayer-pip-close"),this.$contextmenu=this.$container.querySelector(".artplayer-contextmenu");}},{key:"initMobile",value:function(){this.$container.innerHTML='\n          <div class="artplayer-video-player">\n            <video class="artplayer-video"></video>\n          </div>\n        ',this.$player=this.$container.querySelector(".artplayer-video-player"),this.$video=this.$container.querySelector(".artplayer-video");}},{key:"destroy",value:function(t){t?this.$container.innerHTML="":this.$player.classList.add("artplayer-destroy");}}]),n}(),V={"zh-cn":{"About author":"关于作者","Video info":"视频统计信息",Close:"关闭","Video load failed":"视频加载失败",Volume:"音量",Play:"播放",Pause:"暂停",Rate:"速度",Mute:"静音",Flip:"视频翻转",Horizontal:"水平",Vertical:"垂直",Reconnect:"重新连接","Hide subtitle":"隐藏字幕","Show subtitle":"显示字幕","Hide danmu":"隐藏弹幕","Show danmu":"显示弹幕","Show setting":"显示设置","Hide setting":"隐藏设置",Screenshot:"截图","Play speed":"播放速度","Aspect ratio":"画面比例",Default:"默认",Normal:"正常","Switch video":"切换","Switch subtitle":"切换字幕",Fullscreen:"全屏","Exit fullscreen":"退出全屏","Web fullscreen":"网页全屏","Exit web fullscreen":"退出网页全屏","Mini player":"迷你播放器"},"zh-tw":{"About author":"關於作者","Video info":"影片統計訊息",Close:"關閉","Video load failed":"影片載入失敗",Volume:"音量",Play:"播放",Pause:"暫停",Rate:"速度",Mute:"靜音",Flip:"影片翻轉",Horizontal:"水平",Vertical:"垂直",Reconnect:"重新連接","Hide subtitle":"隱藏字幕","Show subtitle":"顯示字幕","Show setting":"顯示设置","Hide setting":"隱藏设置","Hide danmu":"隱藏彈幕","Show danmu":"顯示彈幕",Screenshot:"截圖","Play speed":"播放速度","Aspect ratio":"畫面比例",Default:"默認",Normal:"正常","Switch video":"切換","Switch subtitle":"切換字幕",Fullscreen:"全屏","Exit fullscreen":"退出全屏","Web fullscreen":"網頁全屏","Exit web fullscreen":"退出網頁全屏","Mini player":"迷你播放器"}},Q=function(){function e(t){a(this,e),this.art=t,this.init();}return r(e,[{key:"init",value:function(){this.language=V[this.art.option.lang.toLowerCase()]||{};}},{key:"get",value:function(t){return this.language[t]||t}},{key:"update",value:function(t){V=R(V,t),this.init();}}]),e}();function Y(e,t){var n=e.option,i=e.notice,r=e.template.$video;Object.defineProperty(t,"screenshot",{value:function(){try{var t=function(){var t=document.createElement("canvas");t.width=r.videoWidth,t.height=r.videoHeight,t.getContext("2d").drawImage(r,0,0);var e=t.toDataURL("image/png");return q(e,"".concat(n.title||"artplayer","_").concat(E(r.currentTime),".png")),e}();e.emit("screenshot",t);}catch(t){i.show(t),console.warn(t);}}});}var J=e(function(t){var o,e,r,a,i,n;o="undefined"!=typeof window&&void 0!==window.document?window.document:{},e=t.exports,r="undefined"!=typeof Element&&"ALLOW_KEYBOARD_INPUT"in Element,a=function(){for(var t,e=[["requestFullscreen","exitFullscreen","fullscreenElement","fullscreenEnabled","fullscreenchange","fullscreenerror"],["webkitRequestFullscreen","webkitExitFullscreen","webkitFullscreenElement","webkitFullscreenEnabled","webkitfullscreenchange","webkitfullscreenerror"],["webkitRequestFullScreen","webkitCancelFullScreen","webkitCurrentFullScreenElement","webkitCancelFullScreen","webkitfullscreenchange","webkitfullscreenerror"],["mozRequestFullScreen","mozCancelFullScreen","mozFullScreenElement","mozFullScreenEnabled","mozfullscreenchange","mozfullscreenerror"],["msRequestFullscreen","msExitFullscreen","msFullscreenElement","msFullscreenEnabled","MSFullscreenChange","MSFullscreenError"]],n=0,i=e.length,r={};n<i;n++)if((t=e[n])&&t[1]in o){for(n=0;n<t.length;n++)r[e[0][n]]=t[n];return r}return !1}(),i={change:a.fullscreenchange,error:a.fullscreenerror},n={request:function(i){return new Promise(function(t){var e=a.requestFullscreen,n=function(){this.off("change",n),t();}.bind(this);i=i||o.documentElement,/ Version\/5\.1(?:\.\d+)? Safari\//.test(navigator.userAgent)?i[e]():i[e](r?Element.ALLOW_KEYBOARD_INPUT:{}),this.on("change",n);}.bind(this))},exit:function(){return new Promise(function(t){if(this.isFullscreen){var e=function(){this.off("change",e),t();}.bind(this);o[a.exitFullscreen](),this.on("change",e);}else t();}.bind(this))},toggle:function(t){return this.isFullscreen?this.exit():this.request(t)},onchange:function(t){this.on("change",t);},onerror:function(t){this.on("error",t);},on:function(t,e){var n=i[t];n&&o.addEventListener(n,e,!1);},off:function(t,e){var n=i[t];n&&o.removeEventListener(n,e,!1);},raw:a},a?(Object.defineProperties(n,{isFullscreen:{get:function(){return Boolean(o[a.fullscreenElement])}},element:{enumerable:!0,get:function(){return o[a.fullscreenElement]}},enabled:{enumerable:!0,get:function(){return Boolean(o[a.fullscreenEnabled])}}}),e?(t.exports=n,t.exports.default=n):window.screenfull=n):e?t.exports=!1:window.screenfull=!1;});var X=e(function(t){var e,n;e=window,n=function(){function m(t){var e=parseFloat(t);return -1==t.indexOf("%")&&!isNaN(e)&&e}var n="undefined"==typeof console?function(){}:function(t){console.error(t);},g=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],b=g.length;function w(t){var e=getComputedStyle(t);return e||n("Style returned "+e+". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"),e}var x,k=!1;function E(t){if(function(){if(!k){k=!0;var t=document.createElement("div");t.style.width="200px",t.style.padding="1px 2px 3px 4px",t.style.borderStyle="solid",t.style.borderWidth="1px 2px 3px 4px",t.style.boxSizing="border-box";var e=document.body||document.documentElement;e.appendChild(t);var n=w(t);x=200==Math.round(m(n.width)),E.isBoxSizeOuter=x,e.removeChild(t);}}(),"string"==typeof t&&(t=document.querySelector(t)),t&&"object"==typeof t&&t.nodeType){var e=w(t);if("none"==e.display)return function(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0;e<b;e++)t[g[e]]=0;return t}();var n={};n.width=t.offsetWidth,n.height=t.offsetHeight;for(var i=n.isBorderBox="border-box"==e.boxSizing,r=0;r<b;r++){var o=g[r],a=e[o],s=parseFloat(a);n[o]=isNaN(s)?0:s;}var c=n.paddingLeft+n.paddingRight,l=n.paddingTop+n.paddingBottom,u=n.marginLeft+n.marginRight,d=n.marginTop+n.marginBottom,f=n.borderLeftWidth+n.borderRightWidth,p=n.borderTopWidth+n.borderBottomWidth,h=i&&x,v=m(e.width);!1!==v&&(n.width=v+(h?0:c+f));var y=m(e.height);return !1!==y&&(n.height=y+(h?0:l+p)),n.innerWidth=n.width-(c+f),n.innerHeight=n.height-(l+p),n.outerWidth=n.width+u,n.outerHeight=n.height+d,n}}return E},t.exports?t.exports=n():e.getSize=n();}),Z=e(function(t){var e,n;e="undefined"!=typeof window?window:o,n=function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var n=this._events=this._events||{},i=n[t]=n[t]||[];return -1==i.indexOf(e)&&i.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var n=this._onceEvents=this._onceEvents||{};return (n[t]=n[t]||{})[e]=!0,this}},e.off=function(t,e){var n=this._events&&this._events[t];if(n&&n.length){var i=n.indexOf(e);return -1!=i&&n.splice(i,1),this}},e.emitEvent=function(t,e){var n=this._events&&this._events[t];if(n&&n.length){n=n.slice(0),e=e||[];for(var i=this._onceEvents&&this._onceEvents[t],r=0;r<n.length;r++){var o=n[r];i&&i[o]&&(this.off(t,o),delete i[o]),o.apply(this,e);}return this}},e.allOff=function(){delete this._events,delete this._onceEvents;},t},t.exports?t.exports=n():e.EvEmitter=n();}),G=e(function(t){var e,n;e=window,n=function(r,t){function e(){}var n=e.prototype=Object.create(t.prototype);n.bindStartEvent=function(t){this._bindStartEvent(t,!0);},n.unbindStartEvent=function(t){this._bindStartEvent(t,!1);},n._bindStartEvent=function(t,e){var n=(e=void 0===e||e)?"addEventListener":"removeEventListener",i="mousedown";r.PointerEvent?i="pointerdown":"ontouchstart"in r&&(i="touchstart"),t[n](i,this);},n.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t);},n.getTouch=function(t){for(var e=0;e<t.length;e++){var n=t[e];if(n.identifier==this.pointerIdentifier)return n}},n.onmousedown=function(t){var e=t.button;e&&0!==e&&1!==e||this._pointerDown(t,t);},n.ontouchstart=function(t){this._pointerDown(t,t.changedTouches[0]);},n.onpointerdown=function(t){this._pointerDown(t,t);},n._pointerDown=function(t,e){t.button||this.isPointerDown||(this.isPointerDown=!0,this.pointerIdentifier=void 0!==e.pointerId?e.pointerId:e.identifier,this.pointerDown(t,e));},n.pointerDown=function(t,e){this._bindPostStartEvents(t),this.emitEvent("pointerDown",[t,e]);};var i={mousedown:["mousemove","mouseup"],touchstart:["touchmove","touchend","touchcancel"],pointerdown:["pointermove","pointerup","pointercancel"]};return n._bindPostStartEvents=function(t){if(t){var e=i[t.type];e.forEach(function(t){r.addEventListener(t,this);},this),this._boundPointerEvents=e;}},n._unbindPostStartEvents=function(){this._boundPointerEvents&&(this._boundPointerEvents.forEach(function(t){r.removeEventListener(t,this);},this),delete this._boundPointerEvents);},n.onmousemove=function(t){this._pointerMove(t,t);},n.onpointermove=function(t){t.pointerId==this.pointerIdentifier&&this._pointerMove(t,t);},n.ontouchmove=function(t){var e=this.getTouch(t.changedTouches);e&&this._pointerMove(t,e);},n._pointerMove=function(t,e){this.pointerMove(t,e);},n.pointerMove=function(t,e){this.emitEvent("pointerMove",[t,e]);},n.onmouseup=function(t){this._pointerUp(t,t);},n.onpointerup=function(t){t.pointerId==this.pointerIdentifier&&this._pointerUp(t,t);},n.ontouchend=function(t){var e=this.getTouch(t.changedTouches);e&&this._pointerUp(t,e);},n._pointerUp=function(t,e){this._pointerDone(),this.pointerUp(t,e);},n.pointerUp=function(t,e){this.emitEvent("pointerUp",[t,e]);},n._pointerDone=function(){this._pointerReset(),this._unbindPostStartEvents(),this.pointerDone();},n._pointerReset=function(){this.isPointerDown=!1,delete this.pointerIdentifier;},n.pointerDone=function(){},n.onpointercancel=function(t){t.pointerId==this.pointerIdentifier&&this._pointerCancel(t,t);},n.ontouchcancel=function(t){var e=this.getTouch(t.changedTouches);e&&this._pointerCancel(t,e);},n._pointerCancel=function(t,e){this._pointerDone(),this.pointerCancel(t,e);},n.pointerCancel=function(t,e){this.emitEvent("pointerCancel",[t,e]);},e.getPointerPoint=function(t){return {x:t.pageX,y:t.pageY}},e},t.exports?t.exports=n(e,Z):e.Unipointer=n(e,e.EvEmitter);}),K=e(function(t){var e,n;e=window,n=function(o,t){function e(){}var n=e.prototype=Object.create(t.prototype);n.bindHandles=function(){this._bindHandles(!0);},n.unbindHandles=function(){this._bindHandles(!1);},n._bindHandles=function(t){for(var e=(t=void 0===t||t)?"addEventListener":"removeEventListener",n=t?this._touchActionValue:"",i=0;i<this.handles.length;i++){var r=this.handles[i];this._bindStartEvent(r,t),r[e]("click",this),o.PointerEvent&&(r.style.touchAction=n);}},n._touchActionValue="none",n.pointerDown=function(t,e){this.okayPointerDown(t)&&(this.pointerDownPointer=e,t.preventDefault(),this.pointerDownBlur(),this._bindPostStartEvents(t),this.emitEvent("pointerDown",[t,e]));};var r={TEXTAREA:!0,INPUT:!0,SELECT:!0,OPTION:!0},a={radio:!0,checkbox:!0,button:!0,submit:!0,image:!0,file:!0};return n.okayPointerDown=function(t){var e=r[t.target.nodeName],n=a[t.target.type],i=!e||n;return i||this._pointerReset(),i},n.pointerDownBlur=function(){var t=document.activeElement;t&&t.blur&&t!=document.body&&t.blur();},n.pointerMove=function(t,e){var n=this._dragPointerMove(t,e);this.emitEvent("pointerMove",[t,e,n]),this._dragMove(t,e,n);},n._dragPointerMove=function(t,e){var n={x:e.pageX-this.pointerDownPointer.pageX,y:e.pageY-this.pointerDownPointer.pageY};return !this.isDragging&&this.hasDragStarted(n)&&this._dragStart(t,e),n},n.hasDragStarted=function(t){return 3<Math.abs(t.x)||3<Math.abs(t.y)},n.pointerUp=function(t,e){this.emitEvent("pointerUp",[t,e]),this._dragPointerUp(t,e);},n._dragPointerUp=function(t,e){this.isDragging?this._dragEnd(t,e):this._staticClick(t,e);},n._dragStart=function(t,e){this.isDragging=!0,this.isPreventingClicks=!0,this.dragStart(t,e);},n.dragStart=function(t,e){this.emitEvent("dragStart",[t,e]);},n._dragMove=function(t,e,n){this.isDragging&&this.dragMove(t,e,n);},n.dragMove=function(t,e,n){t.preventDefault(),this.emitEvent("dragMove",[t,e,n]);},n._dragEnd=function(t,e){this.isDragging=!1,setTimeout(function(){delete this.isPreventingClicks;}.bind(this)),this.dragEnd(t,e);},n.dragEnd=function(t,e){this.emitEvent("dragEnd",[t,e]);},n.onclick=function(t){this.isPreventingClicks&&t.preventDefault();},n._staticClick=function(t,e){this.isIgnoringMouseUp&&"mouseup"==t.type||(this.staticClick(t,e),"mouseup"!=t.type&&(this.isIgnoringMouseUp=!0,setTimeout(function(){delete this.isIgnoringMouseUp;}.bind(this),400)));},n.staticClick=function(t,e){this.emitEvent("staticClick",[t,e]);},e.getPointerPoint=t.getPointerPoint,e},t.exports?t.exports=n(e,G):e.Unidragger=n(e,e.Unipointer);}),tt=e(function(t){var e,n;e=window,n=function(o,c,t){function n(t,e){for(var n in e)t[n]=e[n];return t}var i=o.jQuery;function e(t,e){this.element="string"==typeof t?document.querySelector(t):t,i&&(this.$element=i(this.element)),this.options=n({},this.constructor.defaults),this.option(e),this._create();}var r=e.prototype=Object.create(t.prototype);e.defaults={},r.option=function(t){n(this.options,t);};var a={relative:!0,absolute:!0,fixed:!0};function l(t,e,n){return n=n||"round",e?Math[n](t/e)*e:t}return r._create=function(){this.position={},this._getPosition(),this.startPoint={x:0,y:0},this.dragPoint={x:0,y:0},this.startPosition=n({},this.position);var t=getComputedStyle(this.element);a[t.position]||(this.element.style.position="relative"),this.on("pointerDown",this.onPointerDown),this.on("pointerMove",this.onPointerMove),this.on("pointerUp",this.onPointerUp),this.enable(),this.setHandles();},r.setHandles=function(){this.handles=this.options.handle?this.element.querySelectorAll(this.options.handle):[this.element],this.bindHandles();},r.dispatchEvent=function(t,e,n){var i=[e].concat(n);this.emitEvent(t,i),this.dispatchJQueryEvent(t,e,n);},r.dispatchJQueryEvent=function(t,e,n){var i=o.jQuery;if(i&&this.$element){var r=i.Event(e);r.type=t,this.$element.trigger(r,n);}},r._getPosition=function(){var t=getComputedStyle(this.element),e=this._getPositionCoord(t.left,"width"),n=this._getPositionCoord(t.top,"height");this.position.x=isNaN(e)?0:e,this.position.y=isNaN(n)?0:n,this._addTransformPosition(t);},r._getPositionCoord=function(t,e){if(-1==t.indexOf("%"))return parseInt(t,10);var n=c(this.element.parentNode);return n?parseFloat(t)/100*n[e]:0},r._addTransformPosition=function(t){var e=t.transform;if(0===e.indexOf("matrix")){var n=e.split(","),i=0===e.indexOf("matrix3d")?12:4,r=parseInt(n[i],10),o=parseInt(n[1+i],10);this.position.x+=r,this.position.y+=o;}},r.onPointerDown=function(t,e){this.element.classList.add("is-pointer-down"),this.dispatchJQueryEvent("pointerDown",t,[e]);},r.dragStart=function(t,e){this.isEnabled&&(this._getPosition(),this.measureContainment(),this.startPosition.x=this.position.x,this.startPosition.y=this.position.y,this.setLeftTop(),this.dragPoint.x=0,this.dragPoint.y=0,this.element.classList.add("is-dragging"),this.dispatchEvent("dragStart",t,[e]),this.animate());},r.measureContainment=function(){var t=this.getContainer();if(t){var e=c(this.element),n=c(t),i=this.element.getBoundingClientRect(),r=t.getBoundingClientRect(),o=n.borderLeftWidth+n.borderRightWidth,a=n.borderTopWidth+n.borderBottomWidth,s=this.relativeStartPosition={x:i.left-(r.left+n.borderLeftWidth),y:i.top-(r.top+n.borderTopWidth)};this.containSize={width:n.width-o-s.x-e.width,height:n.height-a-s.y-e.height};}},r.getContainer=function(){var t=this.options.containment;if(t)return t instanceof HTMLElement?t:"string"==typeof t?document.querySelector(t):this.element.parentNode},r.onPointerMove=function(t,e,n){this.dispatchJQueryEvent("pointerMove",t,[e,n]);},r.dragMove=function(t,e,n){if(this.isEnabled){var i=n.x,r=n.y,o=this.options.grid,a=o&&o[0],s=o&&o[1];i=l(i,a),r=l(r,s),i=this.containDrag("x",i,a),r=this.containDrag("y",r,s),i="y"==this.options.axis?0:i,r="x"==this.options.axis?0:r,this.position.x=this.startPosition.x+i,this.position.y=this.startPosition.y+r,this.dragPoint.x=i,this.dragPoint.y=r,this.dispatchEvent("dragMove",t,[e,n]);}},r.containDrag=function(t,e,n){if(!this.options.containment)return e;var i="x"==t?"width":"height",r=l(-this.relativeStartPosition[t],n,"ceil"),o=this.containSize[i];return o=l(o,n,"floor"),Math.max(r,Math.min(o,e))},r.onPointerUp=function(t,e){this.element.classList.remove("is-pointer-down"),this.dispatchJQueryEvent("pointerUp",t,[e]);},r.dragEnd=function(t,e){this.isEnabled&&(this.element.style.transform="",this.setLeftTop(),this.element.classList.remove("is-dragging"),this.dispatchEvent("dragEnd",t,[e]));},r.animate=function(){if(this.isDragging){this.positionDrag();var t=this;requestAnimationFrame(function(){t.animate();});}},r.setLeftTop=function(){this.element.style.left=this.position.x+"px",this.element.style.top=this.position.y+"px";},r.positionDrag=function(){this.element.style.transform="translate3d( "+this.dragPoint.x+"px, "+this.dragPoint.y+"px, 0)";},r.staticClick=function(t,e){this.dispatchEvent("staticClick",t,[e]);},r.setPosition=function(t,e){this.position.x=t,this.position.y=e,this.setLeftTop();},r.enable=function(){this.isEnabled=!0;},r.disable=function(){this.isEnabled=!1,this.isDragging&&this.dragEnd();},r.destroy=function(){this.disable(),this.element.style.transform="",this.element.style.left="",this.element.style.top="",this.element.style.position="",this.unbindHandles(),this.$element&&this.$element.removeData("draggabilly");},r._init=function(){},i&&i.bridget&&i.bridget("draggabilly",e),e},t.exports?t.exports=n(e,X,K):e.Draggabilly=n(e,e.getSize,e.Unidragger);});function et(t,e){document.pictureInPictureEnabled?function(t,e){var n=t.notice,i=t.template.$video,r=t.events.proxy;i.disablePictureInPicture=!1,Object.defineProperty(e,"pipState",{get:function(){return document.pictureInPictureElement}}),Object.defineProperty(e,"pipEnabled",{value:function(){i.requestPictureInPicture().catch(function(t){n.show(t,!0,3e3),console.warn(t);});}}),Object.defineProperty(e,"pipExit",{value:function(){document.exitPictureInPicture().catch(function(t){n.show(t,!0,3e3),console.warn(t);});}}),r(i,"enterpictureinpicture",function(){t.emit("pipEnabled");}),r(i,"leavepictureinpicture",function(){t.emit("pipExit");}),t.on("destroy",function(){e.pipState&&e.pipExit();});}(t,e):function(t,e){var n=t.option,i=t.i18n,r=t.template,o=r.$player,a=r.$pipClose,s=r.$pipTitle,c=t.events,l=c.destroyEvents,u=c.proxy,d=null,f=null;Object.defineProperty(e,"pipState",{get:function(){return o.classList.contains("artplayer-pip")}}),Object.defineProperty(e,"pipEnabled",{value:function(){e.autoSizeState&&e.autoSizeRemove(),f?(L(o,"left","".concat(d.x,"px")),L(o,"top","".concat(d.y,"px"))):(f=new tt(o,{handle:".artplayer-pip-header"}),O(s,n.title||i.get("Mini player")),u(a,"click",function(){e.pipExit();}),l.push(function(){f.destroy();})),o.classList.add("artplayer-pip"),e.fullscreenExit(),e.fullscreenWebExit(),e.aspectRatioRemove(),e.playbackRateRemove(),t.emit("pipEnabled");}}),Object.defineProperty(e,"pipExit",{value:function(){e.pipState&&(o.classList.remove("artplayer-pip"),d=f.position,L(o,"left",null),L(o,"top",null),e.fullscreenExit(),e.fullscreenWebExit(),e.aspectRatioRemove(),e.playbackRateRemove(),t.emit("pipExit"));}});}(t,e),Object.defineProperty(e,"pipToggle",{value:function(){e.pipState?e.pipExit():e.pipEnabled();}});}var nt=function t(e){a(this,t),function(i,t){var e=i.option,r=e.type,o=e.customType,a=i.template.$video;Object.defineProperty(t,"attachUrl",{value:function(t){return S().then(function(){function e(t){var e=r||k(t),n=o[e];return e&&n?(i.loading.show(),i.emit("beforeCustomType",e),n.call(i,a,t,i),i.emit("afterCustomType",e)):(i.emit("beforeAttachUrl"),a.src=t,i.emit("afterAttachUrl")),Promise.resolve(t)}return "function"==typeof t?t.call(i).then(function(t){return i.loading.show(),e(t)}):e(t)})}});}(e,this),function(e,t){var n=e.option,i=e.events.proxy,r=e.template,o=r.$player,a=r.$video,s=e.i18n,c=e.notice,l=!1,u=0;i(a,"click",function(){t.toggle();}),I.video.events.forEach(function(t){i(a,t,function(t){e.emit("video:".concat(t.type),t);});}),e.on("video:canplay",function(){l||(l=!0,n.autoplay&&t.play(),e.emit("firstCanplay")),u=0,e.controls.show(),e.mask.show(),e.loading.hide();}),e.on("video:ended",function(){e.controls.show(),e.mask.show(),n.loop&&(t.seek(0),t.play());}),e.on("video:error",function(){u<5?S(1e3).then(function(){u+=1,t.attachUrl(n.url),c.show("".concat(s.get("Reconnect"),": ").concat(u));}):(e.loading.hide(),e.controls.hide(),o.classList.add("artplayer-error"),S(1e3).then(function(){c.show(s.get("Video load failed"),!1),e.destroy();}));}),e.on("video:loadedmetadata",function(){n.autoSize&&t.autoSize();}),e.on("video:loadstart",function(){e.loading.show();}),e.on("video:pause",function(){e.controls.show(),e.mask.show();}),e.on("video:play",function(){e.controls.hide(),e.mask.hide();}),e.on("video:playing",function(){e.controls.hide(),e.mask.hide();}),e.on("video:seeked",function(){e.loading.hide();}),e.on("video:seeking",function(){e.loading.show();}),e.on("video:timeupdate",function(){e.controls.hide(),e.mask.hide();}),e.on("video:waiting",function(){e.loading.show();});}(e,this),function(t,e){var n=t.option,i=t.template.$video;Object.keys(n.moreVideoAttr).forEach(function(t){i[t]=n.moreVideoAttr[t];}),n.muted&&(i.muted=n.muted),n.volume&&(i.volume=x(n.volume,0,1)),n.poster&&(i.poster=n.poster),n.autoplay&&(i.autoplay=n.autoplay),e.attachUrl(n.url);}(e,this),function(e,t){var n=e.template.$video,i=e.i18n,r=e.notice,o=e.option.mutex;Object.defineProperty(t,"play",{value:function(){var t=n.play();void 0!==t&&t.then().catch(function(t){r.show(t,!0,3e3),console.warn(t);}),o&&e.constructor.instances.filter(function(t){return t!==e}).forEach(function(t){return t.player.pause()}),r.show(i.get("Play")),e.emit("play");}});}(e,this),function(t,e){var n=t.template.$video,i=t.i18n,r=t.notice;Object.defineProperty(e,"pause",{value:function(){n.pause(),r.show(i.get("Pause")),t.emit("pause");}});}(e,this),function(t,e){Object.defineProperty(e,"toggle",{value:function(){e.playing?e.pause():e.play();}});}(0,this),function(n,i){var r=n.notice;Object.defineProperty(i,"seek",{value:function(t){var e=Math.max(t,0);i.duration&&(e=Math.min(e,i.duration)),i.currentTime=e,r.show("".concat(E(e)," / ").concat(E(i.duration))),n.emit("seek",e);}});}(e,this),function(e,t){var n=e.template.$video,i=e.i18n,r=e.notice,o=e.storage;Object.defineProperty(t,"volume",{get:function(){return n.volume||0},set:function(t){void 0!==t&&(n.volume=x(t,0,1),r.show("".concat(i.get("Volume"),": ").concat(parseInt(100*n.volume,10))),0!==n.volume&&o.set("volume",n.volume),e.emit("volumeChange",n.volume));}}),Object.defineProperty(t,"muted",{get:function(){return n.muted},set:function(t){n.muted=t,e.emit("volumeChange",n.volume);}});}(e,this),function(e,t){Object.defineProperty(t,"currentTime",{get:function(){return e.template.$video.currentTime||0},set:function(t){e.template.$video.currentTime=t;}});}(e,this),function(t,e){Object.defineProperty(e,"duration",{get:function(){return t.template.$video.duration||0}});}(e,this),function(r,o){var a=r.i18n,s=r.notice,c=r.option;Object.defineProperty(o,"switchQuality",{value:function(t){var e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"unknown";if(t!==c.url){var n=o.currentTime,i=o.playing;o.attachUrl(t).then(function(){c.url=t,o.playbackRateRemove(),o.aspectRatioRemove(),o.seek(n),i&&o.play(),s.show("".concat(a.get("Switch video"),": ").concat(e)),r.emit("switch",t);});}}});}(e,this),function(n,e){var t=n.template,i=t.$video,r=t.$player,o=n.i18n,a=n.notice;Object.defineProperty(e,"playbackRateState",{get:function(){return r.dataset.playbackRate}}),Object.defineProperty(e,"playbackRate",{value:function(t){var e=[.5,.75,1,1.25,1.5,2];w(e.includes(t),"'playbackRate' only accept ".concat(e.toString()," as parameters")),t!==r.dataset.playbackRate&&(i.playbackRate=t,r.dataset.playbackRate=t,a.show("".concat(o.get("Rate"),": ").concat(1===t?o.get("Normal"):"".concat(t,"x"))),n.emit("playbackRateChange",t));}}),Object.defineProperty(e,"playbackRateRemove",{value:function(){e.$playbackRateState&&(e.playbackRate(1),delete r.dataset.playbackRate,n.emit("playbackRateRemove"));}}),Object.defineProperty(e,"playbackRateReset",{value:function(){var t=r.dataset.playbackRate;t&&(e.playbackRate(Number(t)),n.emit("playbackRateReset"));}});}(e,this),function(d,f){var t=d.template,p=t.$video,h=t.$player,v=d.i18n,y=d.notice;Object.defineProperty(f,"aspectRatioState",{get:function(){return h.dataset.aspectRatio||""}}),Object.defineProperty(f,"aspectRatio",{value:function(t){var e=["default","4:3","16:9"];if(w(e.includes(t),"'aspectRatio' only accept ".concat(e.toString()," as parameters")),"default"===t)f.aspectRatioRemove();else{var n=t.split(":"),i=p.videoWidth,r=p.videoHeight,o=h.clientWidth,a=h.clientHeight,s=i/r,c=n[0]/n[1];if(c<s){var l=c*r/i;L(p,"width","".concat(100*l,"%")),L(p,"height","100%"),L(p,"padding","0 ".concat((o-o*l)/2,"px"));}else{var u=i/c/r;L(p,"width","100%"),L(p,"height","".concat(100*u,"%")),L(p,"padding","".concat((a-a*u)/2,"px 0"));}}h.dataset.aspectRatio=t,y.show("".concat(v.get("Aspect ratio"),": ").concat("default"===t?v.get("Default"):t)),d.emit("aspectRatioChange",t);}}),Object.defineProperty(f,"aspectRatioRemove",{value:function(){f.aspectRatioState&&(L(p,"width",null),L(p,"height",null),L(p,"padding",null),delete h.dataset.aspectRatio,d.emit("aspectRatioRemove"));}}),Object.defineProperty(f,"aspectRatioReset",{value:function(){var t=h.dataset.aspectRatio;t&&(f.aspectRatio(t),d.emit("aspectRatioReset"));}});}(e,this),Y(e,this),function(t,e){var n=t.notice,i=t.events.destroyEvents,r=t.template.$player,o=function(){t.emit("fullscreen",J.isFullscreen);},a=function(){n.show("Your browser does not seem to support full screen functionality.");};try{J.on("change",o),J.on("error",a),i.push(function(){J.off("change",o),J.off("error",a);});}catch(t){console.error(t);}Object.defineProperty(e,"fullscreenState",{get:function(){return J.isFullscreen}}),Object.defineProperty(e,"fullscreenEnabled",{value:function(){e.fullscreenWebState&&e.fullscreenWebExit(),r.classList.add("artplayer-fullscreen"),J.request(r),e.aspectRatioReset(),t.emit("fullscreen:enabled");}}),Object.defineProperty(e,"fullscreenExit",{value:function(){e.fullscreenState&&(e.fullscreenWebExit(),r.classList.remove("artplayer-fullscreen"),J.exit(),e.aspectRatioReset(),t.emit("fullscreen:exit"));}}),Object.defineProperty(e,"fullscreenToggle",{value:function(){e.fullscreenState?e.fullscreenExit():e.fullscreenEnabled();}});}(e,this),function(t,e){var n=t.template.$player;Object.defineProperty(e,"fullscreenWebState",{get:function(){return n.classList.contains("artplayer-web-fullscreen")}}),Object.defineProperty(e,"fullscreenWebEnabled",{value:function(){e.fullscreenState&&e.fullscreenExit(),n.classList.add("artplayer-web-fullscreen"),e.aspectRatioReset(),t.emit("fullscreenWeb:enabled");}}),Object.defineProperty(e,"fullscreenWebExit",{value:function(){e.fullscreenWebState&&(e.fullscreenExit(),n.classList.remove("artplayer-web-fullscreen"),e.aspectRatioReset(),t.emit("fullscreenWeb:exit"));}}),Object.defineProperty(e,"fullscreenWebToggle",{value:function(){e.fullscreenWebState?e.fullscreenWebExit():e.fullscreenWebEnabled();}});}(e,this),et(e,this),function(t,e){var n=t.template.$video;Object.defineProperty(e,"loaded",{get:function(){return n.buffered.length?n.buffered.end(n.buffered.length-1)/n.duration:0}});}(e,this),function(t,e){Object.defineProperty(e,"played",{get:function(){return t.template.$video.currentTime/t.template.$video.duration}});}(e,this),function(t,e){var n=t.template.$video;Object.defineProperty(e,"playing",{get:function(){return !!(0<n.currentTime&&!n.paused&&!n.ended&&2<n.readyState)}});}(e,this),function(c,t){var e=c.template,l=e.$container,u=e.$player,d=e.$video;Object.defineProperty(t,"autoSizeState",{get:function(){return l.classList.contains("artplayer-auto-size")}}),Object.defineProperty(t,"autoSize",{value:function(){var t=d.videoWidth,e=d.videoHeight,n=l.getBoundingClientRect(),i=n.width,r=n.height,o=t/e,a=i/r;if(l.classList.add("artplayer-auto-size"),o<a)L(u,"width","".concat(r*o/i*100,"%")),L(u,"height","100%");else{var s=i/o/r*100;L(u,"width","100%"),L(u,"height","".concat(s,"%"));}c.emit("autoSizeChange");}}),Object.defineProperty(t,"autoSizeRemove",{value:function(){l.classList.remove("artplayer-auto-size"),L(u,"width",null),L(u,"height",null),c.emit("autoSizeRemove");}});}(e,this),function(n,t){Object.defineProperty(t,"flipState",{get:function(){return n.template.$player.dataset.flip}}),Object.defineProperty(t,"flip",{value:function(t){var e=["normal","horizontal","vertical"];w(e.includes(t),"'flip' only accept ".concat(e.toString()," as parameters")),n.template.$player.dataset.flip=t,n.emit("flipChange",t);}}),Object.defineProperty(t,"flipRemove",{value:function(){delete n.template.$player.dataset.flip,n.emit("flipRemove");}});}(e,this);};function it(e,n,t,i,r,o){var a="function"==typeof i?i(e):i;if(!a.disable){n.id+=1;var s=a.name||"".concat(o).concat(n.id),c=document.createElement("div");c.classList.value="art-".concat(o," art-").concat(o,"-").concat(s),a.html&&O(c,a.html),a.style&&_(c,a.style),a.click&&e.events.proxy(c,"click",function(t){t.preventDefault(),a.click.call(n,t),e.emit("".concat(o,":click"),c);}),Object.defineProperty(a,"$ref",{get:function(){return c}}),Object.defineProperty(a,"hide",{value:function(){L(c,"display","none"),e.emit("".concat(o,":hide"),c);}}),Object.defineProperty(a,"show",{value:function(){L(c,"display","block"),e.emit("".concat(o,":show"),c);}}),C(t,c,a.index||n.id),a.mounted&&a.mounted(c),r&&r(c),n[s]=a,e.emit("".concat(o,":add"),a);}}var rt=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},i=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter(function(t){return Object.getOwnPropertyDescriptor(n,t).enumerable}))),i.forEach(function(t){y(e,t,n[t]);});}return e};var ot=function(t){if(Array.isArray(t))return t};var at=function(t,e){var n=[],i=!0,r=!1,o=void 0;try{for(var a,s=t[Symbol.iterator]();!(i=(a=s.next()).done)&&(n.push(a.value),!e||n.length!==e);i=!0);}catch(t){r=!0,o=t;}finally{try{i||null==s.return||s.return();}finally{if(r)throw o}}return n};var st=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")};var ct=function(t,e){return ot(t)||at(t,e)||st()};var lt,ut,dt=(lt={loading:'<svg xmlns="http://www.w3.org/2000/svg" width="50px" height="50px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-default">\n  <rect x="0" y="0" width="100" height="100" fill="none" class="bk"/>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(0 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-1s" repeatCount="indefinite"/>\n  </rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(30 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.9166666666666666s" repeatCount="indefinite"/>\n  </rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(60 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"/>\n  </rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(90 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.75s" repeatCount="indefinite"/></rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(120 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"/>\n  </rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(150 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.5833333333333334s" repeatCount="indefinite"/>\n  </rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(180 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.5s" repeatCount="indefinite"/></rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(210 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.4166666666666667s" repeatCount="indefinite"/>\n  </rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(240 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"/>\n  </rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(270 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.25s" repeatCount="indefinite"/></rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(300 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"/>\n  </rect>\n  <rect x="47" y="40" width="6" height="20" rx="5" ry="5" fill="#ffffff" transform="rotate(330 50 50) translate(0 -30)">\n    <animate attributeName="opacity" from="1" to="0" dur="1s" begin="-0.08333333333333333s" repeatCount="indefinite"/>\n  </rect>\n</svg>',playBig:'<svg xmlns="http://www.w3.org/2000/svg" height="60" width="60" style="filter: drop-shadow(0px 1px 1px black);" viewBox="0 0 24 24">\n    <path d="M20,2H4C1.8,2,0,3.8,0,6v12c0,2.2,1.8,4,4,4h16c2.2,0,4-1.8,4-4V6C24,3.8,22.2,2,20,2z M15.6,12.8L10.5,16 C9.9,16.5,9,16,9,15.2V8.8C9,8,9.9,7.5,10.5,8l5.1,3.2C16.3,11.5,16.3,12.5,15.6,12.8z"/>\n</svg>',play:'<svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 22 22">\n  <path d="M17.982 9.275L8.06 3.27A2.013 2.013 0 0 0 5 4.994v12.011a2.017 2.017 0 0 0 3.06 1.725l9.922-6.005a2.017 2.017 0 0 0 0-3.45z"></path>\n</svg>',pause:'<svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 22 22">\n    <path d="M7 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2zM15 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2z"></path>\n</svg>',volume:'<svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 22 22">\n    <path d="M10.188 4.65L6 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39V5.04a.498.498 0 0 0-.812-.39zM14.446 3.778a1 1 0 0 0-.862 1.804 6.002 6.002 0 0 1-.007 10.838 1 1 0 0 0 .86 1.806A8.001 8.001 0 0 0 19 11a8.001 8.001 0 0 0-4.554-7.222z"></path>\n    <path d="M15 11a3.998 3.998 0 0 0-2-3.465v6.93A3.998 3.998 0 0 0 15 11z"></path>\n</svg>',volumeClose:'<svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 22 22">\n    <path d="M15 11a3.998 3.998 0 0 0-2-3.465v2.636l1.865 1.865A4.02 4.02 0 0 0 15 11z"></path>\n    <path d="M13.583 5.583A5.998 5.998 0 0 1 17 11a6 6 0 0 1-.585 2.587l1.477 1.477a8.001 8.001 0 0 0-3.446-11.286 1 1 0 0 0-.863 1.805zM18.778 18.778l-2.121-2.121-1.414-1.414-1.415-1.415L13 13l-2-2-3.889-3.889-3.889-3.889a.999.999 0 1 0-1.414 1.414L5.172 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39v-3.131l2.587 2.587-.01.005a1 1 0 0 0 .86 1.806c.215-.102.424-.214.627-.333l2.3 2.3a1.001 1.001 0 0 0 1.414-1.416zM11 5.04a.5.5 0 0 0-.813-.39L8.682 5.854 11 8.172V5.04z"></path>\n</svg>',subtitle:'<svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 48 48">\n    <path d="M0 0h48v48H0z" fill="none"/>\n    <path d="M40 8H8c-2.21 0-4 1.79-4 4v24c0 2.21 1.79 4 4 4h32c2.21 0 4-1.79 4-4V12c0-2.21-1.79-4-4-4zM8 24h8v4H8v-4zm20 12H8v-4h20v4zm12 0h-8v-4h8v4zm0-8H20v-4h20v4z"/>\n</svg>',screenshot:'<svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 50 50">\n\t<path d="M 19.402344 6 C 17.019531 6 14.96875 7.679688 14.5 10.011719 L 14.097656 12 L 9 12 C 6.238281 12 4 14.238281 4 17 L 4 38 C 4 40.761719 6.238281 43 9 43 L 41 43 C 43.761719 43 46 40.761719 46 38 L 46 17 C 46 14.238281 43.761719 12 41 12 L 35.902344 12 L 35.5 10.011719 C 35.03125 7.679688 32.980469 6 30.597656 6 Z M 25 17 C 30.519531 17 35 21.480469 35 27 C 35 32.519531 30.519531 37 25 37 C 19.480469 37 15 32.519531 15 27 C 15 21.480469 19.480469 17 25 17 Z M 25 19 C 20.589844 19 17 22.589844 17 27 C 17 31.410156 20.589844 35 25 35 C 29.410156 35 33 31.410156 33 27 C 33 22.589844 29.410156 19 25 19 Z "/>\n</svg>\n',setting:'<svg xmlns="http://www.w3.org/2000/svg" height="22" width="22" viewBox="0 0 22 22">\n    <circle cx="11" cy="11" r="2"></circle>\n    <path d="M19.164 8.861L17.6 8.6a6.978 6.978 0 0 0-1.186-2.099l.574-1.533a1 1 0 0 0-.436-1.217l-1.997-1.153a1.001 1.001 0 0 0-1.272.23l-1.008 1.225a7.04 7.04 0 0 0-2.55.001L8.716 2.829a1 1 0 0 0-1.272-.23L5.447 3.751a1 1 0 0 0-.436 1.217l.574 1.533A6.997 6.997 0 0 0 4.4 8.6l-1.564.261A.999.999 0 0 0 2 9.847v2.306c0 .489.353.906.836.986l1.613.269a7 7 0 0 0 1.228 2.075l-.558 1.487a1 1 0 0 0 .436 1.217l1.997 1.153c.423.244.961.147 1.272-.23l1.04-1.263a7.089 7.089 0 0 0 2.272 0l1.04 1.263a1 1 0 0 0 1.272.23l1.997-1.153a1 1 0 0 0 .436-1.217l-.557-1.487c.521-.61.94-1.31 1.228-2.075l1.613-.269a.999.999 0 0 0 .835-.986V9.847a.999.999 0 0 0-.836-.986zM11 15a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"></path>\n</svg>',fullscreen:'<svg xmlns="http://www.w3.org/2000/svg" height="36" width="36" viewBox="0 0 36 36">\n\t<path d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z"></path>\n\t<path d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z"></path>\n\t<path d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z"></path>\n\t<path d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z"></path>\n</svg>',fullscreenWeb:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" height="36" width="36">\n\t<path d="m 28,11 0,14 -20,0 0,-14 z m -18,2 16,0 0,10 -16,0 0,-10 z" fill-rule="evenodd"></path>\n</svg>',pip:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" height="32" width="32">\n    <path d="M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 Z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 Z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 Z"></path>\n</svg>',prev:'<svg xmlns="http://www.w3.org/2000/svg" height="36" width="36" viewBox="0 0 36 36">\n    <path d="m 12,12 h 2 v 12 h -2 z m 3.5,6 8.5,6 V 12 z"></path>\n</svg>',next:'<svg xmlns="http://www.w3.org/2000/svg" height="36" width="36" viewBox="0 0 36 36">\n    <path d="M 12,24 20.5,18 12,12 V 24 z M 22,12 v 12 h 2 V 12 h -2 z"></path>\n</svg>'},ut={},Object.keys(lt).forEach(function(t){var e=document.createElement("div");e.innerHTML='<i class="art-icon art-icon-'.concat(t,'">').concat(lt[t],"</i>");var n=ct(e.childNodes,1);ut[t]=n[0];}),ut);function ft(t,e){var n=t.template.$progress,i=t.player,r=n.getBoundingClientRect().left,o=x(e.x-r,0,n.clientWidth),a=o/n.clientWidth*i.duration;return {second:a,time:E(a),width:o,percentage:x(o/n.clientWidth,0,1)}}function pt(i){return function(u){var t=u.option,e=t.highlight,n=t.theme,d=u.events.proxy,f=u.player;return rt({},i,{html:'\n                <div class="art-control-progress-inner">\n                    <div class="art-progress-loaded"></div>\n                    <div class="art-progress-played" style="background: '.concat(n,'"></div>\n                    <div class="art-progress-highlight"></div>\n                    <div class="art-progress-indicator" style="background: ').concat(n,'"></div>\n                    <div class="art-progress-tip art-tip"></div>\n                </div>\n            '),mounted:function(o){var r=!1,n=o.querySelector(".art-progress-loaded"),i=o.querySelector(".art-progress-played"),a=o.querySelector(".art-progress-highlight"),s=o.querySelector(".art-progress-indicator"),c=o.querySelector(".art-progress-tip");function l(t,e){"loaded"===t&&L(n,"width","".concat(100*e,"%")),"played"===t&&(L(i,"width","".concat(100*e,"%")),L(s,"left","calc(".concat(100*e,"% - ").concat(j(s,"width")/2,"px)")));}e.forEach(function(t){var e=x(t.time,0,f.duration)/f.duration*100;O(a,'<span data-text="'.concat(t.text,'" data-time="').concat(t.time,'" style="left: ').concat(e,'%"></span>'));}),l("loaded",f.loaded),u.on("video:progress",function(){l("loaded",f.loaded);}),u.on("video:timeupdate",function(){l("played",f.played);}),u.on("video:ended",function(){l("played",1);}),d(o,"mousemove",function(t){L(c,"display","block"),-1<t.composedPath().indexOf(a)?function(t){var e=t.target.dataset,n=e.text,i=e.time;c.innerHTML=n;var r=Number(i)/u.player.duration*o.clientWidth+t.target.clientWidth/2-c.clientWidth/2;L(c,"left","".concat(r,"px"));}(t):function(t){var e=ft(u,t),n=e.width,i=e.time,r=c.clientWidth;c.innerHTML=i,n<=r/2?L(c,"left",0):n>o.clientWidth-r/2?L(c,"left","".concat(o.clientWidth-r,"px")):L(c,"left","".concat(n-r/2,"px"));}(t);}),d(o,"mouseout",function(){L(c,"display","none");}),d(o,"click",function(t){if(t.target!==s){var e=ft(u,t),n=e.second;l("played",e.percentage),f.seek(n);}}),d(s,"mousedown",function(){r=!0;}),d(document,"mousemove",function(t){if(r){var e=ft(u,t),n=e.second,i=e.percentage;s.classList.add("art-show-indicator"),l("played",i),f.seek(n);}}),d(document,"mouseup",function(){r&&(r=!1,s.classList.remove("art-show-indicator"));});}})}}function ht(t){return function(h){return rt({},t,{mounted:function(f){var p=h.template.$progress,t=h.events,e=t.proxy,n=t.loadImg,i=!1,r=!1;e(p,"mousemove",function(t){i||(i=!0,n(h.option.thumbnails.url).then(function(){r=!0;})),r&&(L(f,"display","block"),function(t){var e=ft(h,t).width,n=h.option.thumbnails,i=n.url,r=n.height,o=n.width,a=n.number,s=n.column,c=p.clientWidth/a,l=Math.ceil(e/c),u=Math.ceil(l/s)-1,d=l%s||s-1;L(f,"backgroundImage","url(".concat(i,")")),L(f,"height","".concat(r,"px")),L(f,"width","".concat(o,"px")),L(f,"backgroundPosition","-".concat(d*o,"px -").concat(u*r,"px")),e<=o/2?L(f,"left",0):e>p.clientWidth-o/2?L(f,"left","".concat(p.clientWidth-o,"px")):L(f,"left","".concat(e-o/2,"px"));}(t));}),e(p,"mouseout",function(){L(f,"display","none");});}})}}var vt=function(){function n(t){var e=this;a(this,n),this.id=0,this.art=t,this.art.on("firstCanplay",function(){e.init();});}return r(n,[{key:"init",value:function(){var e=this,t=this.art.option;this.add(pt({name:"progress",disable:t.isLive,position:"top",index:10})),this.add(ht({name:"thumbnails",disable:!t.thumbnails.url||t.isLive,position:"top",index:20})),this.add(function(t){return function(c){return rt({},t,{mounted:function(t){var e=c.events.proxy,n=c.player,i=c.i18n,r=O(t,dt.play),o=O(t,dt.pause);function a(){L(r,"display","flex"),L(o,"display","none");}function s(){L(r,"display","none"),L(o,"display","flex");}z(r,i.get("Play")),z(o,i.get("Pause")),e(r,"click",function(){n.play();}),e(o,"click",function(){n.pause();}),n.playing?s():a(),c.on("video:playing",function(){s();}),c.on("video:pause",function(){a();});}})}}({name:"playAndPause",disable:!1,position:"left",index:10})),this.add(function(t){return function(d){return rt({},t,{mounted:function(t){var e=d.events.proxy,r=d.player,n=d.i18n,i=!1,o=O(t,dt.volume),a=O(t,dt.volumeClose),s=O(t,'<div class="art-volume-panel"></div>'),c=O(s,'<div class="art-volume-slider-handle"></div>');function l(t){var e=s.getBoundingClientRect(),n=e.left,i=e.width,r=c.getBoundingClientRect().width;return x(t.x-n-r/2,0,i-r/2)/(i-r)}function u(){var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:.7;if(r.muted||0===t)L(o,"display","none"),L(a,"display","flex"),L(c,"left","0");else{var e=j(s,"width")||60,n=j(c,"width"),i=n/2+(e-n)*t-n/2;L(o,"display","flex"),L(a,"display","none"),L(c,"left","".concat(i,"px"));}}z(o,n.get("Mute")),L(a,"display","none"),u(r.volume),d.on("video:volumechange",function(){u(r.volume);}),e(o,"click",function(){r.muted=!0;}),e(a,"click",function(){r.muted=!1;}),e(s,"click",function(t){r.muted=!1,r.volume=l(t);}),e(c,"mousedown",function(){i=!0;}),e(c,"mousemove",function(t){i&&(r.muted=!1,r.volume=l(t));}),e(document,"mouseup",function(){i&&(i=!1);});}})}}({name:"volume",disable:!1,position:"left",index:20})),this.add(function(t){return function(i){return rt({},t,{mounted:function(e){function n(){var t="".concat(E(i.player.currentTime)," / ").concat(E(i.player.duration));t!==e.innerHTML&&(e.innerHTML=t);}n(),["video:loadedmetadata","video:timeupdate","video:progress"].forEach(function(t){i.on(t,n);});}})}}({name:"time",disable:t.isLive,position:"left",index:30})),this.add(function(t){return function(r){return rt({},t,{mounted:function(t){var o=r.option,e=r.events.proxy,a=r.player,s=-1,n=o.quality.find(function(t){return t.default})||o.quality[0];s=o.quality.indexOf(n);var c=O(t,'<div class="art-quality-name">'.concat(n.name,"</div>")),i=o.quality.map(function(t,e){return '<div class="art-quality-item" data-index="'.concat(e,'">').concat(t.name,"</div>")}).join("");e(O(t,'<div class="art-qualitys">'.concat(i,"</div>")),"click",function(t){var e=Number(t.target.dataset.index),n=o.quality[e],i=n.url,r=n.name;i&&r&&s!==e&&(a.switchQuality(i,r),c.innerHTML=r,s=e);});}})}}({name:"quality",disable:0===t.quality.length,position:"right",index:10})),this.add(function(t){return function(o){return rt({},t,{mounted:function(t){var e=o.events.proxy,n=o.i18n,i=o.player,r=O(t,dt.screenshot);z(r,n.get("Screenshot")),e(r,"click",function(){i.screenshot();});}})}}({name:"screenshot",disable:!t.screenshot,position:"right",index:20})),this.add(function(t){return function(o){return rt({},t,{mounted:function(t){var e=o.events.proxy,n=o.i18n,i=o.subtitle,r=O(t,dt.subtitle);z(r,n.get("Hide subtitle")),e(t,"click",function(){i.toggle();}),o.on("subtitle:show",function(){L(r,"opacity","1"),z(r,n.get("Hide subtitle"));}),o.on("subtitle:hide",function(){L(r,"opacity","0.8"),z(r,n.get("Show subtitle"));});}})}}({name:"subtitle",disable:!t.subtitle.url,position:"right",index:30})),this.add(function(t){return function(o){return rt({},t,{mounted:function(t){var e=o.events.proxy,n=o.i18n,i=o.setting,r=O(t,dt.setting);z(r,n.get("Show setting")),e(t,"click",function(){i.toggle();}),o.on("setting:show",function(){L(r,"opacity","0.8"),z(r,n.get("Hide setting"));}),o.on("setting:hide",function(){L(r,"opacity","1"),z(r,n.get("Show setting"));});}})}}({name:"setting",disable:!t.setting,position:"right",index:40})),this.add(function(t){return function(r){return rt({},t,{mounted:function(t){var e=r.events.proxy,n=r.i18n,i=r.player;z(O(t,dt.pip),n.get("Mini player")),e(t,"click",function(){i.pipEnabled();});}})}}({name:"pip",disable:!t.pip,position:"right",index:50})),this.add(function(t){return function(o){return rt({},t,{mounted:function(t){var e=o.events.proxy,n=o.i18n,i=o.player,r=O(t,dt.fullscreenWeb);z(r,n.get("Web fullscreen")),e(t,"click",function(){i.fullscreenWebToggle();}),o.on("fullscreenWeb:enabled",function(){L(r,"opacity","0.8"),z(r,n.get("Exit web fullscreen"));}),o.on("fullscreenWeb:exit",function(){L(r,"opacity","1"),z(r,n.get("Web fullscreen"));});}})}}({name:"fullscreenWeb",disable:!t.fullscreenWeb,position:"right",index:60})),this.add(function(t){return function(o){return rt({},t,{mounted:function(t){var e=o.events.proxy,n=o.i18n,i=o.player,r=O(t,dt.fullscreen);z(r,n.get("Fullscreen")),e(t,"click",function(){i.fullscreenToggle();}),o.on("fullscreen:enabled",function(){L(r,"opacity","0.8"),z(r,n.get("Exit fullscreen"));}),o.on("fullscreen:exit",function(){L(r,"opacity","1"),z(r,n.get("Fullscreen"));});}})}}({name:"fullscreen",disable:!t.fullscreen,position:"right",index:70})),t.controls.forEach(function(t){e.add(t);});}},{key:"add",value:function(t,e){var n,i="function"==typeof t?t(this.art):t,r=this.art.template,o=r.$progress,a=r.$controlsLeft,s=r.$controlsRight;switch(i.position){case"top":n=o;break;case"left":n=a;break;case"right":n=s;}n&&it(this.art,this,n,i,e,"control");}},{key:"show",value:function(){this.art.template.$player.classList.add("artplayer-controls-show");}},{key:"hide",value:function(){this.art.template.$player.classList.remove("artplayer-controls-show");}}]),n}();var yt=function(){function n(t){var e=this;a(this,n),this.id=0,this.art=t,this.art.on("firstCanplay",function(){e.init();});}return r(n,[{key:"init",value:function(){var e=this,t=this.art,n=t.option,i=t.template,r=i.$player,o=i.$contextmenu,a=t.events.proxy;this.add(function(e){return function(n){var t=n.i18n,i=n.player;return rt({},e,{html:"\n                ".concat(t.get("Play speed"),':\n                <span data-rate="0.5">0.5</span>\n                <span data-rate="0.75">0.75</span>\n                <span data-rate="1.0" class="normal current">').concat(t.get("Normal"),'</span>\n                <span data-rate="1.25">1.25</span>\n                <span data-rate="1.5">1.5</span>\n                <span data-rate="2.0">2.0</span>\n            '),click:function(t){var e=t.target.dataset.rate;e&&(i.playbackRate(Number(e)),n.contextmenu.hide());},mounted:function(t){n.on("playbackRateChange",function(e){A(Array.from(t.querySelectorAll("span")).find(function(t){return Number(t.dataset.rate)===e}),"current");});}})}}({disable:!n.playbackRate,name:"playbackRate",index:10})),this.add(function(e){return function(n){var t=n.i18n,i=n.player;return rt({},e,{html:"\n                ".concat(t.get("Aspect ratio"),':\n                <span data-ratio="default" class="default current">').concat(t.get("Default"),'</span>\n                <span data-ratio="4:3">4:3</span>\n                <span data-ratio="16:9">16:9</span>\n            '),click:function(t){var e=t.target.dataset.ratio;e&&(i.aspectRatio(e),n.contextmenu.hide());},mounted:function(t){n.on("aspectRatioChange",function(e){A(Array.from(t.querySelectorAll("span")).find(function(t){return t.dataset.ratio===e}),"current");});}})}}({disable:!n.aspectRatio,name:"aspectRatio",index:20})),this.add(function(e){return function(t){return rt({},e,{html:t.i18n.get("Video info"),click:function(){t.info.show(),t.contextmenu.hide();}})}}({disable:!1,name:"info",index:30})),this.add(function(t){return rt({},t,{html:'<a href="https://github.com/zhw2590582/artplayer" target="_blank">ArtPlayer 1.0.7</a>'})}({disable:!1,name:"version",index:40})),this.add(function(e){return function(t){return rt({},e,{html:t.i18n.get("Close"),click:function(){t.contextmenu.hide();}})}}({disable:!1,name:"close",index:50})),n.contextmenu.forEach(function(t){e.add(t);}),a(r,"contextmenu",function(t){t.preventDefault(),e.show(),e.setPos(t);}),a(r,"click",function(t){t.composedPath().includes(o)||e.hide();});}},{key:"add",value:function(t,e){var n=this.art.template.$contextmenu;it(this.art,this,n,t,e,"contextmenu");}},{key:"setPos",value:function(t){var e=this.art.template,n=e.$player,i=e.$contextmenu,r=t.clientX,o=t.clientY,a=n.getBoundingClientRect(),s=a.height,c=a.width,l=a.left,u=a.top,d=i.getBoundingClientRect(),f=d.height,p=d.width,h=r-l,v=o-u;l+c<r+p&&(h=c-p),u+s<o+f&&(v=s-f),L(i,"left","".concat(h,"px")),L(i,"top","".concat(v,"px"));}},{key:"hide",value:function(){var t=this.art.template.$contextmenu;L(t,"display","none"),this.art.emit("contextmenu:hide",t);}},{key:"show",value:function(){var t=this.art.template.$contextmenu;L(t,"display","block"),this.art.emit("contextmenu:show",t);}}]),n}(),mt=function(){function e(t){a(this,e),this.art=t,this.init();}return r(e,[{key:"init",value:function(){var t=this,e=this.art,n=e.template.$infoClose;(0, e.events.proxy)(n,"click",function(){t.hide();});}},{key:"show",value:function(){var t=this.art.template,e=t.$info,n=t.$infoPanel;L(e,"display","block"),n.innerHTML||O(n,this.creatInfo()),clearTimeout(this.timer),this.loop(),this.art.emit("info:show",e);}},{key:"creatInfo",value:function(){var t=[];return t.push('\n          <div class="art-info-item ">\n            <div class="art-info-title">Player version:</div>\n            <div class="art-info-content">1.0.7</div>\n          </div>\n        '),t.push('\n          <div class="art-info-item">\n            <div class="art-info-title">Video url:</div>\n            <div class="art-info-content">'.concat(this.art.option.url,"</div>\n          </div>\n        ")),t.push('\n          <div class="art-info-item">\n            <div class="art-info-title">Video volume:</div>\n            <div class="art-info-content" data-video="volume"></div>\n          </div>\n        '),t.push('\n          <div class="art-info-item">\n            <div class="art-info-title">Video time:</div>\n            <div class="art-info-content" data-video="currentTime"></div>\n          </div>\n        '),t.push('\n          <div class="art-info-item">\n            <div class="art-info-title">Video duration:</div>\n            <div class="art-info-content" data-video="duration"></div>\n          </div>\n        '),t.push('\n          <div class="art-info-item">\n            <div class="art-info-title">Video resolution:</div>\n            <div class="art-info-content">\n              <span data-video="videoWidth"></span> x <span data-video="videoHeight"></span>\n            </div>\n          </div>\n        '),t.join("")}},{key:"readInfo",value:function(){var t=this.art.template,e=t.$infoPanel,n=t.$video;Array.from(e.querySelectorAll("[data-video]")).forEach(function(t){var e=n[t.dataset.video];t.innerHTML=void 0!==e?e:"unknown";});}},{key:"loop",value:function(){var t=this;this.readInfo(),this.timer=setTimeout(function(){t.readInfo(),t.loop();},1e3);}},{key:"hide",value:function(){var t=this.art.template.$info;L(t,"display","none"),clearTimeout(this.timer),this.art.emit("info:hide",t);}}]),e}(),gt=function(){function n(t){a(this,n),this.art=t,this.state=!0;var e=this.art.option.subtitle.url;e&&this.init(e);}return r(n,[{key:"init",value:function(t){var i=this,e=this.art,r=e.events.proxy,n=e.option.subtitle,o=e.template,a=o.$video,s=o.$subtitle,c=o.$track;if(_(s,n.style||{}),!c){var l=document.createElement("track");l.default=!0,l.kind="metadata",a.appendChild(l),this.art.template.$track=l;}this.load(t).then(function(t){if(i.art.template.$track.src=t,i.art.emit("subtitle:load",t),a.textTracks&&a.textTracks[0]){var n=ct(a.textTracks,1)[0];r(n,"cuechange",function(){var t=ct(n.activeCues,1)[0];if(s.innerHTML="",t){var e=document.createElement("div");e.appendChild(t.getCueAsHTML()),s.innerHTML=e.innerHTML.split(/\r?\n/).map(function(t){return "<p>".concat(t,"</p>")}).join("");}i.art.emit("subtitle:update",s);});}});}},{key:"load",value:function(e){var n,i=this.art.notice;return fetch(e).then(function(t){return n=t.headers.get("Content-Type"),t.text()}).then(function(t){return /x-subrip/gi.test(n)?D(W(t)):e}).catch(function(t){i.show(t),console.warn(t);})}},{key:"show",value:function(){var t=this.art,e=t.template.$subtitle,n=t.i18n,i=t.notice;L(e,"display","block"),this.state=!0,i.show(n.get("Show subtitle")),this.art.emit("subtitle:show",e);}},{key:"hide",value:function(){var t=this.art,e=t.template.$subtitle,n=t.i18n,i=t.notice;L(e,"display","none"),this.state=!1,i.show(n.get("Hide subtitle")),this.art.emit("subtitle:hide",e);}},{key:"toggle",value:function(){this.state?this.hide():this.show();}}]),n}();var bt=e(function(t,e){Object.defineProperty(e,"__esModule",{value:!0});e.ContentRect=function(t){if("getBBox"in t){var e=t.getBBox();return Object.freeze({height:e.height,left:0,top:0,width:e.width})}var n=window.getComputedStyle(t);return Object.freeze({height:parseFloat(n.height||"0"),left:parseFloat(n.paddingLeft||"0"),top:parseFloat(n.paddingTop||"0"),width:parseFloat(n.width||"0")})};});t(bt);bt.ContentRect;var wt=e(function(t,e){Object.defineProperty(e,"__esModule",{value:!0});var n=function(){function t(t){this.target=t,this.$$broadcastWidth=this.$$broadcastHeight=0;}return Object.defineProperty(t.prototype,"broadcastWidth",{get:function(){return this.$$broadcastWidth},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"broadcastHeight",{get:function(){return this.$$broadcastHeight},enumerable:!0,configurable:!0}),t.prototype.isActive=function(){var t=bt.ContentRect(this.target);return !!t&&(t.width!==this.broadcastWidth||t.height!==this.broadcastHeight)},t}();e.ResizeObservation=n;});t(wt);wt.ResizeObservation;var xt=e(function(t,e){Object.defineProperty(e,"__esModule",{value:!0});var n=function(t){this.target=t,this.contentRect=bt.ContentRect(t);};e.ResizeObserverEntry=n;});t(xt);xt.ResizeObserverEntry;var kt=e(function(t,e){Object.defineProperty(e,"__esModule",{value:!0});var n=[],i=function(){function t(t){this.$$observationTargets=[],this.$$activeTargets=[],this.$$skippedTargets=[];var e=function(t){if(void 0===t)return "Failed to construct 'ResizeObserver': 1 argument required, but only 0 present.";if("function"!=typeof t)return "Failed to construct 'ResizeObserver': The callback provided as parameter 1 is not a function."}(t);if(e)throw TypeError(e);this.$$callback=t,n.push(this);}return t.prototype.observe=function(t){var e=r("observe",t);if(e)throw TypeError(e);0<o(this.$$observationTargets,t)||(this.$$observationTargets.push(new wt.ResizeObservation(t)),d());},t.prototype.unobserve=function(t){var e=r("unobserve",t);if(e)throw TypeError(e);var n=o(this.$$observationTargets,t);n<0||(this.$$observationTargets.splice(n,1),p());},t.prototype.disconnect=function(){this.$$observationTargets=[],this.$$activeTargets=[];},t}();function r(t,e){return void 0===e?"Failed to execute '"+t+"' on 'ResizeObserver': 1 argument required, but only 0 present.":e instanceof window.Element?void 0:"Failed to execute '"+t+"' on 'ResizeObserver': parameter 1 is not of type 'Element'."}function o(t,e){for(var n=0;n<t.length;n+=1)if(t[n].target===e)return n;return -1}e.ResizeObserver=i;var a,s=function(i){n.forEach(function(n){n.$$activeTargets=[],n.$$skippedTargets=[],n.$$observationTargets.forEach(function(t){if(t.isActive()){var e=l(t.target);i<e?n.$$activeTargets.push(t):n.$$skippedTargets.push(t);}});});},c=function(){var r=1/0;return n.forEach(function(t){if(t.$$activeTargets.length){var i=[];t.$$activeTargets.forEach(function(t){var e=new xt.ResizeObserverEntry(t.target);i.push(e),t.$$broadcastWidth=e.contentRect.width,t.$$broadcastHeight=e.contentRect.height;var n=l(t.target);n<r&&(r=n);}),t.$$callback(i,t),t.$$activeTargets=[];}}),r},l=function(t){for(var e=0;t.parentNode;)t=t.parentNode,e+=1;return e},u=function(){var t=0;for(s(t);n.some(function(t){return !!t.$$activeTargets.length});)t=c(),s(t);n.some(function(t){return !!t.$$skippedTargets.length})&&function(){var t=new window.ErrorEvent("ResizeLoopError",{message:"ResizeObserver loop completed with undelivered notifications."});window.dispatchEvent(t);}();},d=function(){a||f();},f=function(){a=window.requestAnimationFrame(function(){u(),f();});},p=function(){a&&!n.some(function(t){return !!t.$$observationTargets.length})&&(window.cancelAnimationFrame(a),a=void 0);};e.install=function(){return window.ResizeObserver=i};});t(kt);var Et=kt.ResizeObserver;kt.install;var St=function(){function n(t){var e=this;a(this,n),this.destroyEvents=[],this.proxy=this.proxy.bind(this),this.hover=this.hover.bind(this),this.loadImg=this.loadImg.bind(this),t.on("firstCanplay",function(){!function(e,t){var n=e.template.$player;t.proxy(document,["click","contextmenu"],function(t){-1<t.composedPath().indexOf(n)?e.isFocus=!0:(e.isFocus=!1,e.contextmenu.hide());});}(t,e),function(t,e){var n=t.template.$player;e.hover(n,function(){n.classList.add("artplayer-hover"),t.emit("hoverenter");},function(){n.classList.remove("artplayer-hover"),t.emit("hoverleave");});}(t,e),function(e,t){var n=e.template,i=n.$player,r=n.$video,o=e.player,a=$(function(){i.classList.add("artplayer-hide-cursor"),i.classList.remove("artplayer-hover"),e.controls.hide();},5e3);e.on("hoverleave",function(){o.playing&&a();}),t.proxy(i,"mousemove",function(t){a.clearTimeout(),i.classList.remove("artplayer-hide-cursor"),e.controls.show(),!e.player.pipState&&o.playing&&t.target===r&&a();});}(t,e),function(t,e){var n=t.option,i=t.template.$player,r=new Et(function(){n.autoSize&&(t.player.fullscreenState||t.player.fullscreenWebState||t.player.pipState?t.player.autoSizeRemove():t.player.autoSize()),t.player.aspectRatioReset(),t.emit("resize",i);});r.observe(i),e.destroyEvents.push(function(){r.unobserve(i);});}(t,e);});}return r(n,[{key:"proxy",value:function(e,t,n){var i=this,r=3<arguments.length&&void 0!==arguments[3]?arguments[3]:{};Array.isArray(t)?t.forEach(function(t){return i.proxy(e,t,n,r)}):(e.addEventListener(t,n,r),this.destroyEvents.push(function(){e.removeEventListener(t,n,r);}));}},{key:"hover",value:function(t,e,n){this.proxy(t,"mouseenter",e),this.proxy(t,"mouseleave",n);}},{key:"loadImg",value:function(i){var r=this;return new Promise(function(t,e){var n;if(i instanceof HTMLImageElement)n=i;else{if("string"!=typeof i)return e(i);(n=new Image).src=i;}return n.complete?t(n):(r.proxy(n,"load",function(){return t(n)}),r.proxy(n,"error",function(){return e(n)}),i)})}},{key:"destroy",value:function(){this.destroyEvents.forEach(function(t){return t()});}}]),n}(),$t=function(){function n(t){var e=this;a(this,n),this.art=t,this.art.option.hotkey&&this.art.on("firstCanplay",function(){e.init();});}return r(n,[{key:"init",value:function(){var i=this,t=this.art,r=t.player;(0, t.events.proxy)(window,"keydown",function(t){if(i.art.isFocus){var e=document.activeElement.tagName.toUpperCase(),n=document.activeElement.getAttribute("contenteditable");if("INPUT"!==e&&"TEXTAREA"!==e&&""!==n&&"true"!==n)switch(i.art.emit("hotkey",t),t.keyCode){case 39:t.preventDefault(),r.seek(r.currentTime+10);break;case 37:t.preventDefault(),r.seek(r.currentTime-10);break;case 38:t.preventDefault(),r.volume+=.05;break;case 40:t.preventDefault(),r.volume-=.05;break;case 32:t.preventDefault(),r.toggle();}}});}}]),n}(),Pt=function(){function n(t){var e=this;a(this,n),this.id=0,this.art=t,this.add=this.add.bind(this),this.art.option.layers.forEach(function(t){e.add(t);});}return r(n,[{key:"add",value:function(t,e){var n=this.art.template.$layers;it(this.art,this,n,t,e,"layer");}},{key:"show",value:function(){var t=this.art.template.$layers;L(t,"display","block"),this.art.emit("layers:show",t);}},{key:"hide",value:function(){var t=this.art.template.$layers;L(t,"display","none"),this.art.emit("layers:hide",t);}}]),n}(),Tt=function(){function n(t){a(this,n);var e=(this.art=t).option;O(t.template.$loading,e.icons.loading||dt.loading);}return r(n,[{key:"hide",value:function(){var t=this.art.template.$loading;L(t,"display","none"),this.art.emit("loading:hide",t);}},{key:"show",value:function(){var t=this.art.template.$loading;L(t,"display","flex"),this.art.emit("loading:show",t);}}]),n}(),Rt=function(){function e(t){a(this,e),this.art=t,this.timer=null;}return r(e,[{key:"show",value:function(t){var e=this,n=!(1<arguments.length&&void 0!==arguments[1])||arguments[1],i=2<arguments.length&&void 0!==arguments[2]?arguments[2]:1e3,r=this.art.template,o=r.$notice,a=r.$noticeInner;L(o,"display","block"),a.innerHTML=t instanceof Error?t.message.trim():t,clearTimeout(this.timer),n&&(this.timer=setTimeout(function(){e.hide();},i)),this.art.emit("notice:show",o);}},{key:"hide",value:function(){var t=this.art.template.$notice;L(t,"display","none"),this.art.emit("notice:hide",t);}}]),e}(),Ot=function(){function n(t){a(this,n);var e=(this.art=t).option;O(O(t.template.$mask,'<div class="art-playBig"></div>'),e.icons.playBig||dt.playBig);}return r(n,[{key:"show",value:function(){var t=this.art.template.$mask;L(t,"display","flex"),this.art.emit("mask:show",t);}},{key:"hide",value:function(){var t=this.art.template.$mask;L(t,"display","none"),this.art.emit("mask:show",t);}}]),n}();var Ct=function(){function n(t){var e=this;a(this,n),this.id=0,this.art=t,this.state=!1,t.option.setting&&this.art.on("firstCanplay",function(){e.init();});}return r(n,[{key:"init",value:function(){var t=this,e=this.art,n=e.template.$settingClose;(0, e.events.proxy)(n,"click",function(){t.hide();}),this.add(function(i){return function(e){var t=e.i18n,n=e.player;return rt({},i,{html:'\n                <div class="art-setting-header">'.concat(t.get("Flip"),'</div>\n                <div class="art-setting-body">\n                    <div class="art-setting-btns">\n                        <div class="art-setting-btn current">\n                            <span data-flip="normal">').concat(t.get("Normal"),'</span>\n                        </div>\n                        <div class="art-setting-btn">\n                            <span data-flip="horizontal">').concat(t.get("Horizontal"),'</span>\n                        </div>\n                        <div class="art-setting-btn">\n                            <span data-flip="vertical">').concat(t.get("Vertical"),"</span>\n                        </div>\n                    </div>\n                </div>\n            "),click:function(t){var e=t.target.dataset.flip;e&&n.flip(e);},mounted:function(t){e.on("flipChange",function(e){A(Array.from(t.querySelectorAll("span")).find(function(t){return t.dataset.flip===e}).parentElement,"current");});}})}}({disable:!1,name:"flip",index:10}));}},{key:"add",value:function(t,e){var n=this.art.template.$settingBody;it(this.art,this,n,t,e,"setting");}},{key:"show",value:function(){var t=this.art.template.$setting;L(t,"display","flex"),this.state=!0,this.art.emit("setting:show",t);}},{key:"hide",value:function(){var t=this.art.template.$setting;L(t,"display","none"),this.state=!1,this.art.emit("setting:hide",t);}},{key:"toggle",value:function(){this.state?this.hide():this.show();}}]),n}(),Lt=function(){function e(t){a(this,e),this.art=t,this.storageName="artplayer_settings",this.init();}return r(e,[{key:"init",value:function(){var t=this.art.option,e=this.get("volume");e&&(t.volume=e);}},{key:"get",value:function(t){var e=JSON.parse(localStorage.getItem(this.storageName))||{};return t?e[t]:{}}},{key:"set",value:function(t,e){var n=Object.assign({},this.get(),y({},t,e));localStorage.setItem(this.storageName,JSON.stringify(n));}}]),e}();function _t(i){var t=i.i18n,r=i.events.proxy;return {title:"Subtitle",name:"subtitle",index:20,html:'\n            <div class="art-setting-header">\n                '.concat(t.get("Subtitle offset time"),': <span class="art-subtitle-value">0</span>s\n            </div>\n            <div class="art-setting-body">\n                <input\n                    style="width: 100%;height: 3px;outline: none;appearance: none;-moz-appearance: none;-webkit-appearance: none;background-color: #fff;"\n                    class="art-subtitle-range"\n                    type="range"\n                    min="-5"\n                    max="5"\n                    step="0.5"\n                >\n            </div>\n        '),mounted:function(t){var e=t.querySelector(".art-subtitle-range"),n=t.querySelector(".art-subtitle-value");r(e,"change",function(){var t=e.value;n.innerText=t,i.plugins.subtitle.offset(Number(t));}),i.on("subtitle:switch",function(){e.value=0,n.innerText=0;}),i.on("artplayerPluginSubtitle:set",function(t){e.value!==t&&(e.value=t,n.innerText=t);});}}}function jt(i){var r=i.constructor.utils.clamp,t=i.setting,o=i.notice,a=i.template,s=i.i18n;!function(t){t.update({"zh-cn":{"Subtitle offset time":"字幕偏移时间","No subtitles found":"未发现字幕"},"zh-tw":{"Subtitle offset time":"字幕偏移時間","No subtitles found":"未發現字幕"}});}(s),t.add(_t);var c=[];return i.on("subtitle:switch",function(){c=[];}),{name:"subtitle",offset:function(t){if(a.$track&&a.$track.track){var e=Array.from(a.$track.track.cues),n=r(t,-5,5);e.forEach(function(t,e){c[e]||(c[e]={startTime:t.startTime,endTime:t.endTime}),t.startTime=c[e].startTime+n,t.endTime=c[e].endTime+n;}),o.show("".concat(s.get("Subtitle offset time"),": ").concat(t,"s")),i.emit("artplayerPluginSubtitle:set",t);}else o.show("".concat(s.get("No subtitles found"))),i.emit("artplayerPluginSubtitle:set",0);}}}function Mt(r){var t=r.constructor.utils,n=t.append,i=t.setStyle,o=t.setStyles,a=t.sleep,s=r.events.proxy,c=r.option,l=r.notice,u=r.i18n,d=r.template,f=r.player;function p(t){if(t){var e=d.$video.canPlayType(t.type);if("maybe"===e||"probably"===e){var n=URL.createObjectURL(t);f.playbackRateRemove(),f.aspectRatioRemove(),d.$video.src=n,a(1e3).then(function(){f.currentTime=0;}),c.url=n,r.emit("switch",n),l.show(u.get("Load local video successfully"));}else{var i="".concat(u.get("Playback of this file format is not supported"),": ").concat(t.type);l.show(i,!0,3e3),console.warn(i);}}}return function(t){t.update({"zh-cn":{"Playback of this file format is not supported":"不支持播放该文件格式","Load local video successfully":"加载本地视频成功"},"zh-tw":{"Playback of this file format is not supported":"不支持播放該文件格式","Load local video successfully":"加載本地視頻成功"}});}(u),s(d.$player,"dragover",function(t){t.preventDefault(),l.show(u.get("Load local video successfully"));}),s(d.$player,"drop",function(t){t.preventDefault(),p(t.dataTransfer.files[0]);}),{name:"localPreview",attach:function(t){var e=n(t,'<input type="file">');i(t,"position","relative"),o(e,{position:"absolute",width:"100%",height:"100%",left:"0",top:"0",opacity:"0"}),s(e,"change",function(){p(e.files[0]);});}}}var At=function(){function n(t){var e=this;a(this,n),this.art=t,this.id=0,this.add(jt),this.add(Mt),t.option.plugins.forEach(function(t){e.add(t);});}return r(n,[{key:"add",value:function(t){this.id+=1;var e=t.call(this,this.art);return this[e&&e.name?e.name:t.name?t.name:"plugin".concat(this.id)]=e,this.art.emit("plugin:add",t),this}}]),n}(),zt=function t(e){a(this,t);var n=e.option,i=e.template.$video;Object.keys(n.moreVideoAttr).forEach(function(t){i[t]=n.moreVideoAttr[t];}),n.muted&&(i.muted=n.muted),n.volume&&(i.volume=x(n.volume,0,1)),n.poster&&(i.poster=n.poster),n.autoplay&&(i.autoplay=n.autoplay),i.controls=!0;var r=n.type||k(n.url),o=n.customType[r];r&&o?(e.emit("beforeCustomType",r),o(i,n.url,e),e.emit("afterCustomType",r)):(e.emit("beforeAttachUrl",n.url),i.src=n.url,e.emit("afterAttachUrl",i.src));},Wt=0,Dt=function(t){function n(t){var e;return a(this,n),e=c(this,l(n).call(this)),w("function"==typeof window.Promise,"Unsupported 'Promise' method"),e.option=R(n.DEFAULTS,t),v(e.option,F),e.init(),e}return d(n,p),r(n,[{key:"init",value:function(){this.whitelist=new N(this),this.template=new U(this),this.whitelist.state?(this.isFocus=!1,this.storage=new Lt(this),this.i18n=new Q(this),this.notice=new Rt(this),this.events=new St(this),this.player=new nt(this),this.layers=new Pt(this),this.controls=new vt(this),this.contextmenu=new yt(this),this.subtitle=new gt(this),this.info=new mt(this),this.loading=new Tt(this),this.hotkey=new $t(this),this.mask=new Ot(this),this.setting=new Ct(this),this.plugins=new At(this)):this.mobile=new zt(this),Wt+=1,this.id=Wt,n.instances.push(this);}},{key:"destroy",value:function(){var t=0<arguments.length&&void 0!==arguments[0]&&arguments[0];this.events&&this.events.destroy(),this.template.destroy(t),n.instances.splice(n.instances.indexOf(this),1),this.emit("destroy");}}],[{key:"version",get:function(){return "1.0.7"}},{key:"env",get:function(){return '"production"'}},{key:"config",get:function(){return I}},{key:"utils",get:function(){return H}},{key:"DEFAULTS",get:function(){return {container:"#artplayer",url:"",poster:"",title:"",type:"",mimeCodec:"",theme:"#f00",volume:.7,isLive:!1,muted:!1,autoplay:!1,autoSize:!1,loop:!1,playbackRate:!1,aspectRatio:!1,screenshot:!1,setting:!1,hotkey:!0,pip:!1,mutex:!0,fullscreen:!1,fullscreenWeb:!1,layers:[],contextmenu:[],quality:[],controls:[],highlight:[],plugins:[],whitelist:[],thumbnails:{url:"",number:60,width:160,height:90,column:10},subtitle:{url:"",style:{}},moreVideoAttr:{controls:!1,preload:"auto"},icons:{loading:"",playBig:""},customType:{},lang:navigator.language.toLowerCase()}}}]),n}();return Object.defineProperty(Dt,"instances",{value:[]}),window.Artplayer=Dt});
  });

  var Artplayer = unwrapExports(artplayer);

  var ArtplayerReact =
  /*#__PURE__*/
  function (_React$Component) {
    inherits(ArtplayerReact, _React$Component);

    function ArtplayerReact(props) {
      var _this;

      classCallCheck(this, ArtplayerReact);

      _this = possibleConstructorReturn(this, getPrototypeOf(ArtplayerReact).call(this, props));
      Artplayer.utils.errorHandle(props.option && _typeof_1(props.option) === 'object', "The prop 'option' object cannot be missing");
      _this.instance = null;
      _this.artRef = react.createRef();
      return _this;
    }

    createClass(ArtplayerReact, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        var _this$props = this.props,
            option = _this$props.option,
            getInstance = _this$props.getInstance;
        this.instance = new Artplayer(objectSpread({}, option, {
          container: this.artRef.current
        }));

        if (getInstance && typeof getInstance === 'function') {
          getInstance(this.instance);
        }
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        if (this.instance && this.instance.destroy) {
          this.instance.destroy();
        }
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props2 = this.props,
            option = _this$props2.option,
            getInstance = _this$props2.getInstance,
            rest = objectWithoutProperties(_this$props2, ["option", "getInstance"]);

        return react.createElement('div', objectSpread({
          ref: this.artRef
        }, rest));
      }
    }]);

    return ArtplayerReact;
  }(react.Component);

  return ArtplayerReact;

}));
//# sourceMappingURL=artplayer-react.js.map
