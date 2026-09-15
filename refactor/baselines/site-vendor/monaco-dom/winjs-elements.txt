// Copyright (c) Microsoft Corporation.  All Rights Reserved. Licensed under the MIT License. See License.txt in the project root for license information.
define([
    'exports',
    '../Core/_Global',
    '../Core/_Base',
    '../Core/_BaseUtils',
    '../Core/_WinRT',
    '../Promise',
    '../Scheduler'
], function elementUtilities(exports, _Global, _Base, _BaseUtils, _WinRT, Promise, Scheduler) {
    "use strict";

    // not supported in WebWorker
    if (!_Global.document) {
        return;
    }

    var _zoomToDuration = 167;

    // Firefox's implementation of getComputedStyle returns null when called within
    // an iframe that is display:none. This is a bug: https://bugzilla.mozilla.org/show_bug.cgi?id=548397
    // _getComputedStyle is a helper which is guaranteed to return an object whose keys
    // map to strings.
    var defaultComputedStyle = null;
    function getDefaultComputedStyle() {
        if (!defaultComputedStyle) {
            defaultComputedStyle = {};
            Object.keys(_Global.CSS2Properties.prototype).forEach(function (cssProperty) {
                defaultComputedStyle[cssProperty] = "";
            });
        }
        return defaultComputedStyle;
    }
    function _getComputedStyle(element, pseudoElement) {
        // jscs:disable disallowDirectGetComputedStyle
        return _Global.getComputedStyle(element, pseudoElement) || getDefaultComputedStyle();
        // jscs:enable disallowDirectGetComputedStyle
    }

    function removeEmpties(arr) {
        var len = arr.length;
        for (var i = len - 1; i >= 0; i--) {
            if (!arr[i]) {
                arr.splice(i, 1);
                len--;
            }
        }
        return len;
    }

    function getClassName(e) {
        var name = e.className || "";
        if (typeof (name) === "string") {
            return name;
        } else {
            return name.baseVal || "";
        }
    }
    function setClassName(e, value) {
        // SVG elements (which use e.className.baseVal) are never undefined,
        // so this logic makes the comparison a bit more compact.
        //
        var name = e.className || "";
        if (typeof (name) === "string") {
            e.className = value;
        } else {
            e.className.baseVal = value;
        }
        return e;
    }
    function addClass(e, name) {
        /// <signature helpKeyword="WinJS.Utilities.addClass">
        /// <summary locid="WinJS.Utilities.addClass">
        /// Adds the specified class(es) to the specified element. Multiple classes can be added using space delimited names.
        /// </summary>
        /// <param name="e" type="HTMLElement" locid="WinJS.Utilities.addClass_p:e">
        /// The element to which to add the class.
        /// </param>
        /// <param name="name" type="String" locid="WinJS.Utilities.addClass_p:name">
        /// The name of the class to add, multiple classes can be added using space delimited names
        /// </param>
        /// <returns type="HTMLElement" locid="WinJS.Utilities.addClass_returnValue">
        /// The element.
        /// </returns>
        /// </signature>
        if (e.classList) {
            // Fastpath: adding a single class, no need to string split the argument
            if (name.indexOf(" ") < 0) {
                e.classList.add(name);
            } else {
                var namesToAdd = name.split(" ");
                removeEmpties(namesToAdd);

                for (var i = 0, len = namesToAdd.length; i < len; i++) {
                    e.classList.add(namesToAdd[i]);
                }
            }
            return e;
        } else {
            var className = getClassName(e);
            var names = className.split(" ");
            var l = removeEmpties(names);
            var toAdd;

            // we have a fast path for the common case of a single name in the class name
            //
            if (name.indexOf(" ") >= 0) {
                var namesToAdd = name.split(" ");
                removeEmpties(namesToAdd);
                for (var i = 0; i < l; i++) {
                    var found = namesToAdd.indexOf(names[i]);
                    if (found >= 0) {
                        namesToAdd.splice(found, 1);
                    }
                }
                if (namesToAdd.length > 0) {
                    toAdd = namesToAdd.join(" ");
                }
            } else {
                var saw = false;
                for (var i = 0; i < l; i++) {
                    if (names[i] === name) {
                        saw = true;
                        break;
                    }
                }
                if (!saw) { toAdd = name; }

            }
            if (toAdd) {
                if (l > 0 && names[0].length > 0) {
                    setClassName(e, className + " " + toAdd);
                } else {
                    setClassName(e, toAdd);
                }
            }
            return e;
        }
    }
    function removeClass(e, name) {
        /// <signature helpKeyword="WinJS.Utilities.removeClass">
        /// <summary locid="WinJS.Utilities.removeClass">
        /// Removes the specified class from the specified element.
        /// </summary>
        /// <param name="e" type="HTMLElement" locid="WinJS.Utilities.removeClass_p:e">
        /// The element from which to remove the class.
        /// </param>
        /// <param name="name" type="String" locid="WinJS.Utilities.removeClass_p:name">
        /// The name of the class to remove.
        /// </param>
        /// <returns type="HTMLElement" locid="WinJS.Utilities.removeClass_returnValue">
        /// The element.
        /// </returns>
        /// </signature>
        if (e.classList) {

            // Fastpath: Nothing to remove
            if (e.classList.length === 0) {
                return e;
            }
            var namesToRemove = name.split(" ");
            removeEmpties(namesToRemove);

            for (var i = 0, len = namesToRemove.length; i < len; i++) {
                e.classList.remove(namesToRemove[i]);
            }
            return e;
        } else {
            var original = getClassName(e);
            var namesToRemove;
            var namesToRemoveLen;

            if (name.indexOf(" ") >= 0) {
                namesToRemove = name.split(" ");
                namesToRemoveLen = removeEmpties(namesToRemove);
            } else {
                // early out for the case where you ask to remove a single
                // name and that name isn't found.
                //
                if (original.indexOf(name) < 0) {
                    return e;
                }
                namesToRemove = [name];
                namesToRemoveLen = 1;
            }
            var removed;
            var names = original.split(" ");
            var namesLen = removeEmpties(names);

            for (var i = namesLen - 1; i >= 0; i--) {
                if (namesToRemove.indexOf(names[i]) >= 0) {
                    names.splice(i, 1);
                    removed = true;
                }
            }

            if (removed) {
                setClassName(e, names.join(" "));
            }
            return e;
        }
    }
    function toggleClass(e, name) {
        /// <signature helpKeyword="WinJS.Utilities.toggleClass">
        /// <summary locid="WinJS.Utilities.toggleClass">
        /// Toggles (adds or removes) the specified class on the specified element.
        /// If the class is present, it is removed; if it is absent, it is added.
        /// </summary>
        /// <param name="e" type="HTMLElement" locid="WinJS.Utilities.toggleClass_p:e">
        /// The element on which to toggle the class.
        /// </param>
        /// <param name="name" type="String" locid="WinJS.Utilities.toggleClass_p:name">
        /// The name of the class to toggle.
        /// </param>
        /// <returns type="HTMLElement" locid="WinJS.Utilities.toggleClass_returnValue">
        /// The element.
        /// </returns>
        /// </signature>
        if (e.classList) {
            e.classList.toggle(name);
            return e;
        } else {
            var className = getClassName(e);
            var names = className.trim().split(" ");
            var l = names.length;
            var found = false;
            for (var i = 0; i < l; i++) {
                if (names[i] === name) {
                    found = true;
                }
            }
            if (!found) {
                if (l > 0 && names[0].length > 0) {
                    setClassName(e, className + " " + name);
                } else {
                    setClassName(e, className + name);
                }
            } else {
                setClassName(e, names.reduce(function (r, e) {
                    if (e === name) {
                        return r;
                    } else if (r && r.length > 0) {
                        return r + " " + e;
                    } else {
                        return e;
                    }
                }, ""));
            }
            return e;
        }
    }

    // Only set the attribute if its value has changed
    function setAttribute(element, attribute, value) {
        if (element.getAttribute(attribute) !== "" + value) {
            element.setAttribute(attribute, value);
        }
    }

    function _clamp(value, lowerBound, upperBound, defaultValue) {
        var n = Math.max(lowerBound, Math.min(upperBound, +value));
        return n === 0 ? 0 : n || Math.max(lowerBound, Math.min(upperBound, defaultValue));
    }
    var _pixelsRE = /^-?\d+\.?\d*(px)?$/i;
    var _numberRE = /^-?\d+/i;
    function convertToPixels(element, value) {
        /// <signature helpKeyword="WinJS.Utilities.convertToPixels">
        /// <summary locid="WinJS.Utilities.convertToPixels">
        /// Converts a CSS positioning string for the specified element to pixels.
        /// </summary>
        /// <param name="element" type="HTMLElement" locid="WinJS.Utilities.convertToPixels_p:element">
        /// The element.
        /// </param>
        /// <param name="value" type="String" locid="WinJS.Utilities.convertToPixels_p:value">
        /// The CSS positioning string.
        /// </param>
        /// <returns type="Number" locid="WinJS.Utilities.convertToPixels_returnValue">
        /// The number of pixels.
        /// </returns>
        /// </signature>
        if (!_pixelsRE.test(value) && _numberRE.test(value)) {
            var previousValue = element.style.left;

            element.style.left = value;
            value = element.style.pixelLeft;

            element.style.left = previousValue;

            return value;
        } else {
            return Math.round(parseFloat(value)) || 0;
        }
    }

    function getDimension(element, property) {
        return convertToPixels(element, _getComputedStyle(element, null)[property]);
    }

    function _convertToPrecisePixels(value) {
        return parseFloat(value) || 0;
    }
    function _getPreciseDimension(element, property) {
        return _convertToPrecisePixels(_getComputedStyle(element, null)[property]);
    }
    function _getPreciseMargins(element) {
        var style = _getComputedStyle(element);
        return {
            top: _convertToPrecisePixels(style.marginTop),
            right: _convertToPrecisePixels(style.marginRight),
            bottom: _convertToPrecisePixels(style.marginBottom),
            left: _convertToPrecisePixels(style.marginLeft),
        };
    }

    var _MSGestureEvent = _Global.MSGestureEvent || {
        MSGESTURE_FLAG_BEGIN: 1,
        MSGESTURE_FLAG_CANCEL: 4,
        MSGESTURE_FLAG_END: 2,
        MSGESTURE_FLAG_INERTIA: 8,
        MSGESTURE_FLAG_NONE: 0
    };

    var _MSManipulationEvent = _Global.MSManipulationEvent || {
        MS_MANIPULATION_STATE_ACTIVE: 1,
        MS_MANIPULATION_STATE_CANCELLED: 6,
        MS_MANIPULATION_STATE_COMMITTED: 7,
        MS_MANIPULATION_STATE_DRAGGING: 5,
        MS_MANIPULATION_STATE_INERTIA: 2,
        MS_MANIPULATION_STATE_PRESELECT: 3,
        MS_MANIPULATION_STATE_SELECTING: 4,
        MS_MANIPULATION_STATE_STOPPED: 0
    };

    var _MSPointerEvent = _Global.MSPointerEvent || {
        MSPOINTER_TYPE_TOUCH: "touch",
        MSPOINTER_TYPE_PEN: "pen",
        MSPOINTER_TYPE_MOUSE: "mouse",
    };

    // Helpers for managing element._eventsMap for custom events
    //

    function addListenerToEventMap(element, type, listener, useCapture, data) {
        var eventNameLowercase = type.toLowerCase();
        if (!element._eventsMap) {
            element._eventsMap = {};
        }
        if (!element._eventsMap[eventNameLowercase]) {
            element._eventsMap[eventNameLowercase] = [];
        }
        element._eventsMap[eventNameLowercase].push({
            listener: listener,
            useCapture: useCapture,
            data: data
        });
    }

    function removeListenerFromEventMap(element, type, listener, useCapture) {
        var eventNameLowercase = type.toLowerCase();
        var mappedEvents = element._eventsMap && element._eventsMap[eventNameLowercase];
        if (mappedEvents) {
            for (var i = mappedEvents.length - 1; i >= 0; i--) {
                var mapping = mappedEvents[i];
                if (mapping.listener === listener && (!!useCapture === !!mapping.useCapture)) {
                    mappedEvents.splice(i, 1);
                    return mapping;
                }
            }
        }
        return null;
    }

    function lookupListeners(element, type) {
        var eventNameLowercase = type.toLowerCase();
        return element._eventsMap && element._eventsMap[eventNameLowercase] && element._eventsMap[eventNameLowercase].slice(0) || [];
    }

    // Custom focusin/focusout events
    // Generally, use these instead of using the browser's blur/focus/focusout/focusin events directly.
    // However, this doesn't support the window object. If you need to listen to focus events on the window,
    // use the browser's events directly.
    //
    // In order to send our custom focusin/focusout events synchronously on every browser, we feature detect
    // for native "focusin" and "focusout" since every browser that supports them will fire them synchronously.
    // Every browser in our support matrix, except for IE, also fires focus/blur synchronously, we fall back to
    // those events in browsers such as Firefox that do not have native support for focusin/focusout.

    function bubbleEvent(element, type, eventObject) {
        while (element) {
            var handlers = lookupListeners(element, type);
            for (var i = 0, len = handlers.length; i < len; i++) {
                handlers[i].listener.call(element, eventObject);
            }

            element = element.parentNode;
        }
    }

    function prepareFocusEvent(eventObject) {
        // If an iframe is involved, then relatedTarget should be null.
        if (eventObject.relatedTarget && eventObject.relatedTarget.tagName === "IFRAME" ||
                eventObject.target && eventObject.target.tagName === "IFRAME") {
            eventObject.relatedTarget = null;
        }

        return eventObject;
    }

    var nativeSupportForFocusIn = "onfocusin" in _Global.document.documentElement;
    var activeElement = null;
    _Global.addEventListener(nativeSupportForFocusIn ? "focusout" : "blur", function (eventObject) {
        // Fires focusout when focus move to another window or into an iframe.
        if (eventObject.target === _Global) {
            var previousActiveElement = activeElement;
            if (previousActiveElement) {
                bubbleEvent(previousActiveElement, "focusout", prepareFocusEvent({
                    type: "focusout",
                    target: previousActiveElement,
                    relatedTarget: null
                }));
            }
            activeElement = null;
        }
    });

    _Global.document.documentElement.addEventListener(nativeSupportForFocusIn ? "focusin" : "focus", function (eventObject) {
        var previousActiveElement = activeElement;
        activeElement = eventObject.target;
        if (previousActiveElement) {
            bubbleEvent(previousActiveElement, "focusout", prepareFocusEvent({
                type: "focusout",
                target: previousActiveElement,
                relatedTarget: activeElement
            }));
        }
        if (activeElement) {
            bubbleEvent(activeElement, "focusin", prepareFocusEvent({
                type: "focusin",
                target: activeElement,
                relatedTarget: previousActiveElement
            }));
        }
    }, true);

    function registerBubbleListener(element, type, listener, useCapture) {
        if (useCapture) {
            throw "This custom WinJS event only supports bubbling";
        }
        addListenerToEventMap(element, type, listener, useCapture);
    }

    // Custom pointer events
    //

    // Sets the properties in *overrideProperties* on the object. Delegates all other
    // property accesses to *eventObject*.
    //
    // The purpose of PointerEventProxy is that it allows us to customize properties on
    // an eventObject despite those properties being unwritable and unconfigurable.
    var PointerEventProxy = function (eventObject, overrideProperties) {
        overrideProperties = overrideProperties || {};
        this.__eventObject = eventObject;
        var that = this;
        Object.keys(overrideProperties).forEach(function (propertyName) {
            Object.defineProperty(that, propertyName, {
                value: overrideProperties[propertyName]
            });
        });
    };

    // Define PointerEventProxy properties which should be delegated to the original eventObject.
    [
        "altKey", "AT_TARGET", "bubbles", "BUBBLING_PHASE", "button", "buttons",
        "cancelable", "cancelBubble", "CAPTURING_PHASE", "clientX", "clientY",
        "ctrlKey", "currentTarget", "defaultPrevented", "detail", "eventPhase",
        "fromElement", "getModifierState", "height", "hwTimestamp", "initEvent",
        "initMouseEvent", "initPointerEvent", "initUIEvent", "isPrimary", "isTrusted",
        "layerX", "layerY", "metaKey", "offsetX", "offsetY", "pageX", "pageY",
        "pointerId", "pointerType", "pressure", "preventDefault", "relatedTarget",
        "rotation", "screenX", "screenY", "shiftKey", "srcElement", "stopImmediatePropagation",
        "stopPropagation", "target", "tiltX", "tiltY", "timeStamp", "toElement", "type",
        "view", "which", "width", "x", "y", "_normalizedType", "_fakedBySemanticZoom"
    ].forEach(function (propertyName) {
        Object.defineProperty(PointerEventProxy.prototype, propertyName, {
            get: function () {
                var value = this.__eventObject[propertyName];
                return typeof value === "function" ? value.bind(this.__eventObject) : value;
            },
            configurable: true
        });
    });

    function touchEventTranslator(callback, eventObject) {
        var changedTouches = eventObject.changedTouches,
            retVal = null;

        if (!changedTouches) {
            return retVal;
        }

        for (var i = 0, len = changedTouches.length; i < len; i++) {
            var touchObject = changedTouches[i];
            var pointerEventObject = new PointerEventProxy(eventObject, {
                pointerType: _MSPointerEvent.MSPOINTER_TYPE_TOUCH,
                pointerId: touchObject.identifier,
                isPrimary: i === 0,
                screenX: touchObject.screenX,
                screenY: touchObject.screenY,
                clientX: touchObject.clientX,
                clientY: touchObject.clientY,
                pageX: touchObject.pageX,
                pageY: touchObject.pageY,
                radiusX: touchObject.radiusX,
                radiusY: touchObject.radiusY,
                rotationAngle: touchObject.rotationAngle,
                force: touchObject.force,
                _currentTouch: touchObject
            });
            var newRetVal = callback(pointerEventObject);
            retVal = retVal || newRetVal;
        }
        return retVal;
    }

    function mouseEventTranslator(callback, eventObject) {
        eventObject.pointerType = _MSPointerEvent.MSPOINTER_TYPE_MOUSE;
        eventObject.pointerId = -1;
        eventObject.isPrimary = true;
        return callback(eventObject);
    }

    function mspointerEventTranslator(callback, eventObject) {
        return callback(eventObject);
    }

    var eventTranslations = {
        pointerdown: {
            touch: "touchstart",
            mspointer: "MSPointerDown",
            mouse: "mousedown"
        },
        pointerup: {
            touch: "touchend",
            mspointer: "MSPointerUp",
            mouse: "mouseup"
        },
        pointermove: {
            touch: "touchmove",
            mspointer: "MSPointerMove",
            mouse: "mousemove"
        },
        pointerenter: {
            touch: "touchenter",
            mspointer: "MSPointerEnter",
            mouse: "mouseenter"
        },
        pointerover: {
            touch: null,
            mspointer: "MSPointerOver",
            mouse: "mouseover"
        },
        pointerout: {
            touch: "touchleave",
            mspointer: "MSPointerOut",
            mouse: "mouseout"
        },
        pointercancel: {
            touch: "touchcancel",
            mspointer: "MSPointerCancel",
            mouse: null
        }
    };

    function registerPointerEvent(element, type, callback, capture) {
        var eventNameLowercase = type.toLowerCase();

        var mouseWrapper,
            touchWrapper,
            mspointerWrapper;
        var translations = eventTranslations[eventNameLowercase];

        // Browsers fire a touch event and then a mouse event when the input is touch. touchHandled is used to prevent invoking the pointer callback twice.
        var touchHandled;

        // If we are in IE10, we should use MSPointer as it provides a better interface than touch events
        if (_Global.MSPointerEvent) {
            mspointerWrapper = function (eventObject) {
                eventObject._normalizedType = eventNameLowercase;
                touchHandled = true;
                return mspointerEventTranslator(callback, eventObject);
            };
            element.addEventListener(translations.mspointer, mspointerWrapper, capture);
        } else {
            // Otherwise, use a mouse and touch event
            if (translations.mouse) {
                mouseWrapper = function (eventObject) {
                    eventObject._normalizedType = eventNameLowercase;
                    if (!touchHandled) {
                        return mouseEventTranslator(callback, eventObject);
                    }
                    touchHandled = false;
                };
                element.addEventListener(translations.mouse, mouseWrapper, capture);
            }
            if (translations.touch) {
                touchWrapper = function (eventObject) {
                    eventObject._normalizedType = eventNameLowercase;
                    touchHandled = true;
                    return touchEventTranslator(callback, eventObject);
                };
                element.addEventListener(translations.touch, touchWrapper, capture);
            }
        }

        addListenerToEventMap(element, type, callback, capture, {
            mouseWrapper: mouseWrapper,
            touchWrapper: touchWrapper,
            mspointerWrapper: mspointerWrapper
        });
    }

    function unregisterPointerEvent(element, type, callback, capture) {
        var eventNameLowercase = type.toLowerCase();

        var mapping = removeListenerFromEventMap(element, type, callback, capture);
        if (mapping) {
            var translations = eventTranslations[eventNameLowercase];
            if (mapping.data.mouseWrapper) {
                element.removeEventListener(translations.mouse, mapping.data.mouseWrapper, capture);
            }
            if (mapping.data.touchWrapper) {
                element.removeEventListener(translations.touch, mapping.data.touchWrapper, capture);
            }
            if (mapping.data.mspointerWrapper) {
                element.removeEventListener(translations.mspointer, mapping.data.mspointerWrapper, capture);
            }
        }
    }

    // Custom events dispatch table. Event names should be lowercased.
    //

    var customEvents = {
        focusout: {
            register: registerBubbleListener,
            unregister: removeListenerFromEventMap
        },
        focusin: {
            register: registerBubbleListener,
            unregister: removeListenerFromEventMap
        },
    };
    if (!_Global.PointerEvent) {
        var pointerEventEntry = {
            register: registerPointerEvent,
            unregister: unregisterPointerEvent
        };

        customEvents.pointerdown = pointerEventEntry;
        customEvents.pointerup = pointerEventEntry;
        customEvents.pointermove = pointerEventEntry;
        customEvents.pointerenter = pointerEventEntry;
        customEvents.pointerover = pointerEventEntry;
        customEvents.pointerout = pointerEventEntry;
        customEvents.pointercancel = pointerEventEntry;
    }

    // The MutationObserverShim only supports the following configuration:
    //  attributes
    //  attributeFilter
    var MutationObserverShim = _Base.Class.define(
        function MutationObserverShim_ctor(callback) {
            this._callback = callback;
            this._toDispose = [];
            this._attributeFilter = [];
            this._scheduled = false;
            this._pendingChanges = [];
            this._observerCount = 0;
            this._handleCallback = this._handleCallback.bind(this);
            this._targetElements = [];
        },
        {
            observe: function MutationObserverShim_observe(element, configuration) {
                if (this._targetElements.indexOf(element) === -1) {
                    this._targetElements.push(element);
                }
                this._observerCount++;
                if (configuration.attributes) {
                    this._addRemovableListener(element, "DOMAttrModified", this._handleCallback);
                }
                if (configuration.attributeFilter) {
                    this._attributeFilter = configuration.attributeFilter;
                }
            },
            disconnect: function MutationObserverShim_disconnect() {
                this._observerCount = 0;
                this._targetElements = [];
                this._toDispose.forEach(function (disposeFunc) {
                    disposeFunc();
                });
            },
            _addRemovableListener: function MutationObserverShim_addRemovableListener(target, event, listener) {
                target.addEventListener(event, listener);
                this._toDispose.push(function () {
                    target.removeEventListener(event, listener);
                });
            },
            _handleCallback: function MutationObserverShim_handleCallback(evt) {

                // prevent multiple events from firing when nesting observers
                evt.stopPropagation();

                var attrName = evt.attrName;
                if (this._attributeFilter.length && this._attributeFilter.indexOf(attrName) === -1) {
                    return;
                }

                // subtree:true is not currently supported
                if (this._targetElements.indexOf(evt.target) === -1) {
                    return;
                }

                var isAriaMutation = attrName.indexOf("aria") >= 0;

                // DOM mutation events use different naming for this attribute
                if (attrName === 'tabindex') {
                    attrName = 'tabIndex';
                }

                this._pendingChanges.push({
                    type: 'attributes',
                    target: evt.target,
                    attributeName: attrName
                });

                if (this._observerCount === 1 && !isAriaMutation) {
                    this._dispatchEvent();
                } else if (this._scheduled === false) {
                    this._scheduled = true;
                    _BaseUtils._setImmediate(this._dispatchEvent.bind(this));
                }

            },
            _dispatchEvent: function MutationObserverShim_dispatchEvent() {
                try {
                    this._callback(this._pendingChanges);
                }
                finally {
                    this._pendingChanges = [];
                    this._scheduled = false;
                }
            }
        },
        {
            _isShim: true
        }
    );

    var _MutationObserver = _Global.MutationObserver || MutationObserverShim;

    // Lazily init singleton on first access.
    var _resizeNotifier = null;

    // Class to provide a global listener for window.onresize events.
    // This keeps individual elements from having to listen to window.onresize
    // and having to dispose themselves to avoid leaks.
    var ResizeNotifier = _Base.Class.define(
        function ElementResizer_ctor() {
            _Global.addEventListener("resize", this._handleResize.bind(this));
        },
        {
            subscribe: function ElementResizer_subscribe(element, handler) {
                element.addEventListener(this._resizeEvent, handler);
                addClass(element, this._resizeClass);
            },
            unsubscribe: function ElementResizer_unsubscribe(element, handler) {
                removeClass(element, this._resizeClass);
                element.removeEventListener(this._resizeEvent, handler);
            },
            _handleResize: function ElementResizer_handleResize() {
                var resizables = _Global.document.querySelectorAll('.' + this._resizeClass);
                var length = resizables.length;
                for (var i = 0; i < length; i++) {
                    var event = _Global.document.createEvent("Event");
                    event.initEvent(this._resizeEvent, false, true);
                    resizables[i].dispatchEvent(event);
                }
            },
            _resizeClass: { get: function () { return 'win-element-resize'; } },
            _resizeEvent: { get: function () { return 'WinJSElementResize'; } }
        }
    );

    // - object: The object on which GenericListener will listen for events.
    // - objectName: A string representing the name of *object*. This will be
    //   incorporated into the names of the events and classNames created by
    //   GenericListener.
    // - options
    //   - registerThruWinJSCustomEvents: If true, will register for events using
    //     _exports._addEventListener so that you can take advantage of WinJS's custom
    //     events (e.g. focusin, pointer*). Otherwise, registers directly on *object*
    //     using its add/removeEventListener methods.
    var GenericListener = _Base.Class.define(
        function GenericListener_ctor(objectName, object, options) {
            options = options || {};
            this.registerThruWinJSCustomEvents = !!options.registerThruWinJSCustomEvents;

            this.objectName = objectName;
            this.object = object;
            this.capture = {};
            this.bubble = {};
        },
        {
            addEventListener: function GenericListener_addEventListener(element, name, listener, capture) {
                name = name.toLowerCase();
                var handlers = this._getHandlers(capture);
                var handler = handlers[name];

                if (!handler) {
                    handler = this._getListener(name, capture);
                    handler.refCount = 0;
                    handlers[name] = handler;

                    if (this.registerThruWinJSCustomEvents) {
                        exports._addEventListener(this.object, name, handler, capture);
                    } else {
                        this.object.addEventListener(name, handler, capture);
                    }
                }

                handler.refCount++;
                element.addEventListener(this._getEventName(name, capture), listener);
                addClass(element, this._getClassName(name, capture));
            },
            removeEventListener: function GenericListener_removeEventListener(element, name, listener, capture) {
                name = name.toLowerCase();
                var handlers = this._getHandlers(capture);
                var handler = handlers[name];

                if (handler) {
                    handler.refCount--;
                    if (handler.refCount === 0) {
                        if (this.registerThruWinJSCustomEvents) {
                            exports._removeEventListener(this.object, name, handler, capture);
                        } else {
                            this.object.removeEventListener(name, handler, capture);
                        }
                        delete handlers[name];
                    }
                }

                removeClass(element, this._getClassName(name, capture));
                element.removeEventListener(this._getEventName(name, capture), listener);
            },

            _getHandlers: function GenericListener_getHandlers(capture) {
                if (capture) {
                    return this.capture;
                } else {
                    return this.bubble;
                }
            },

            _getClassName: function GenericListener_getClassName(name, capture) {
                var captureSuffix = capture ? 'capture' : 'bubble';
                return 'win-' + this.objectName.toLowerCase() + '-event-' + name + captureSuffix;
            },

            _getEventName: function GenericListener_getEventName(name, capture) {
                var captureSuffix = capture ? 'capture' : 'bubble';
                return 'WinJS' + this.objectName + 'Event-' + name + captureSuffix;
            },

            _getListener: function GenericListener_getListener(name, capture) {
                var listener = function GenericListener_generatedListener(ev) {

                    var targets = _Global.document.querySelectorAll('.' + this._getClassName(name, capture));
                    var length = targets.length;
                    var handled = false;
                    for (var i = 0; i < length; i++) {
                        var event = _Global.document.createEvent("Event");
                        event.initEvent(this._getEventName(name, capture), false, true);
                        event.detail = { originalEvent: ev };
                        var doDefault = targets[i].dispatchEvent(event);
                        handled = handled || !doDefault;
                    }
                    return handled;
                };

                return listener.bind(this);
            }
        }
    );

    var determinedRTLEnvironment = false,
        usingWebkitScrollCoordinates = false,
        usingFirefoxScrollCoordinates = false;
    function determineRTLEnvironment() {
        var element = _Global.document.createElement("div");
        element.style.direction = "rtl";
        element.innerHTML = "" +
            "<div style='width: 100px; height: 100px; overflow: scroll; visibility:hidden'>" +
                "<div style='width: 10000px; height: 100px;'></div>" +
            "</div>";
        _Global.document.body.appendChild(element);
        var elementScroller = element.firstChild;
        if (elementScroller.scrollLeft > 0) {
            usingWebkitScrollCoordinates = true;
        }
        elementScroller.scrollLeft += 100;
        if (elementScroller.scrollLeft === 0) {
            usingFirefoxScrollCoordinates = true;
        }
        _Global.document.body.removeChild(element);
        determinedRTLEnvironment = true;
    }

    function getAdjustedScrollPosition(element) {
        var computedStyle = _getComputedStyle(element),
            scrollLeft = element.scrollLeft;
        if (computedStyle.direction === "rtl") {
            if (!determinedRTLEnvironment) {
                determineRTLEnvironment();
            }
            if (usingWebkitScrollCoordinates) {
                scrollLeft = element.scrollWidth - element.clientWidth - scrollLeft;
            }
            scrollLeft = Math.abs(scrollLeft);
        }

        return {
            scrollLeft: scrollLeft,
            scrollTop: element.scrollTop
        };
    }

    function setAdjustedScrollPosition(element, scrollLeft, scrollTop) {
        if (scrollLeft !== undefined) {
            var computedStyle = _getComputedStyle(element);
            if (computedStyle.direction === "rtl") {
                if (!determinedRTLEnvironment) {
                    determineRTLEnvironment();
                }
                if (usingFirefoxScrollCoordinates) {
                    scrollLeft = -scrollLeft;
                } else if (usingWebkitScrollCoordinates) {
                    scrollLeft = element.scrollWidth - element.clientWidth - scrollLeft;
                }
            }
            element.scrollLeft = scrollLeft;
        }

        if (scrollTop !== undefined) {
            element.scrollTop = scrollTop;
        }
    }

    function getScrollPosition(element) {
        /// <signature helpKeyword="WinJS.Utilities.getScrollPosition">
        /// <summary locid="WinJS.Utilities.getScrollPosition">
        /// Gets the scrollLeft and scrollTop of the specified element, adjusting the scrollLeft to change from browser specific coordinates to logical coordinates when in RTL.
        /// </summary>
        /// <param name="element" type="HTMLElement" domElement="true" locid="WinJS.Utilities.getScrollPosition_p:element">
        /// The element.
        /// </param>
        /// <returns type="Object" locid="WinJS.Utilities.getScrollPosition_returnValue">
        /// An object with two properties: scrollLeft and scrollTop
        /// </returns>
        /// </signature>
        return getAdjustedScrollPosition(element);
    }

    function setScrollPosition(element, position) {
        /// <signature helpKeyword="WinJS.Utilities.setScrollPosition">
        /// <summary locid="WinJS.Utilities.setScrollPosition">
        /// Sets the scrollLeft and scrollTop of the specified element, changing the scrollLeft from logical coordinates to browser-specific coordinates when in RTL.
        /// </summary>
        /// <param name="element" type="HTMLElement" domElement="true" locid="WinJS.Utilities.setScrollPosition_p:element">
        /// The element.
        /// </param>
        /// <param name="position" type="Object" domElement="true" locid="WinJS.Utilities.setScrollPosition_p:position">
        /// The element.
        /// </param>
        /// </signature>
        position = position || {};
        setAdjustedScrollPosition(element, position.scrollLeft, position.scrollTop);
    }

    // navigator.msManipulationViewsEnabled tells us whether snap points work or not regardless of whether the style properties exist, however,
    // on Phone WWAs, this check returns false even though snap points are supported. To work around this bug, we check for the presence of
    // 'MSAppHost' in the user agent string which indicates that we are in a WWA environment; all WWA environments support snap points.
    var supportsSnapPoints = _Global.navigator.msManipulationViewsEnabled || _Global.navigator.userAgent.indexOf("MSAppHost") >= 0;
    var supportsTouchDetection = !!(_Global.MSPointerEvent || _Global.TouchEvent);

    var uniqueElementIDCounter = 0;

    function uniqueID(e) {
        if (!(e.uniqueID || e._uniqueID)) {
            e._uniqueID = "element__" + (++uniqueElementIDCounter);
        }

        return e.uniqueID || e._uniqueID;
    }

    function ensureId(element) {
        if (!element.id) {
            element.id = uniqueID(element);
        }
    }

    function _getCursorPos(eventObject) {
        var docElement = _Global.document.documentElement;
        var docScrollPos = getScrollPosition(docElement);

        return {
            left: eventObject.clientX + (_Global.document.body.dir === "rtl" ? -docScrollPos.scrollLeft : docScrollPos.scrollLeft),
            top: eventObject.clientY + docElement.scrollTop
        };
    }

    function _getElementsByClasses(parent, classes) {
        var retVal = [];

        for (var i = 0, len = classes.length; i < len; i++) {
            var element = parent.querySelector("." + classes[i]);
            if (element) {
                retVal.push(element);
            }
        }
        return retVal;
    }

    var _selectionPartsSelector = ".win-selectionborder, .win-selectionbackground, .win-selectioncheckmark, .win-selectioncheckmarkbackground";
    var _dataKey = "_msDataKey";
    _Base.Namespace._moduleDefine(exports, "WinJS.Utilities", {
        _dataKey: _dataKey,

        _supportsSnapPoints: {
            get: function () {
                return supportsSnapPoints;
            }
        },

        _supportsTouchDetection: {
            get: function () {
                return supportsTouchDetection;
            }
        },

        _uniqueID: uniqueID,

        _ensureId: ensureId,

        _clamp: _clamp,

        _getCursorPos: _getCursorPos,

        _getElementsByClasses: _getElementsByClasses,

        _createGestureRecognizer: function () {
            if (_Global.MSGesture) {
                return new _Global.MSGesture();
            }

            var doNothing = function () {
            };
            return {
                addEventListener: doNothing,
                removeEventListener: doNothing,
                addPointer: doNothing,
                stop: doNothing
            };
        },

        _MSGestureEvent: _MSGestureEvent,
        _MSManipulationEvent: _MSManipulationEvent,

        _elementsFromPoint: function (x, y) {
            if (_Global.document.msElementsFromPoint) {
                return _Global.document.msElementsFromPoint(x, y);
            } else {
                var element = _Global.document.elementFromPoint(x, y);
                return element ? [element] : null;
            }
        },

        _matchesSelector: function _matchesSelector(element, selectorString) {
            var matchesSelector = element.matches
                    || element.msMatchesSelector
                    || element.mozMatchesSelector
                    || element.webkitMatchesSelector;
            return matchesSelector.call(element, selectorString);
        },

        _selectionPartsSelector: _selectionPartsSelector,

        _isSelectionRendered: function _isSelectionRendered(itemBox) {
            // The tree is changed at pointerDown but _selectedClass is added only when the user drags an item below the selection threshold so checking for _selectedClass is not reliable.
            return itemBox.querySelectorAll(_selectionPartsSelector).length > 0;
        },

        _addEventListener: function _addEventListener(element, type, listener, useCapture) {
            var eventNameLower = type && type.toLowerCase();
            var entry = customEvents[eventNameLower];
            var equivalentEvent = _BaseUtils._browserEventEquivalents[type];
            if (entry) {
                entry.register(element, type, listener, useCapture);
            } else if (equivalentEvent) {
                element.addEventListener(equivalentEvent, listener, useCapture);
            } else {
                element.addEventListener(type, listener, useCapture);
            }
        },

        _removeEventListener: function _removeEventListener(element, type, listener, useCapture) {
            var eventNameLower = type && type.toLowerCase();
            var entry = customEvents[eventNameLower];
            var equivalentEvent = _BaseUtils._browserEventEquivalents[type];
            if (entry) {
                entry.unregister(element, type, listener, useCapture);
            } else if (equivalentEvent) {
                element.removeEventListener(equivalentEvent, listener, useCapture);
            } else {
                element.removeEventListener(type, listener, useCapture);
            }
        },

        _initEventImpl: function (initType, event, eventType) {
            eventType = eventType.toLowerCase();
            var mapping = eventTranslations[eventType];
            if (mapping) {
                switch (initType.toLowerCase()) {
                    case "pointer":
                        if (!_Global.PointerEvent) {
                            arguments[2] = mapping.mspointer;
                        }
                        break;

                    default:
                        arguments[2] = mapping[initType.toLowerCase()];
                        break;
                }
            }
            event["init" + initType + "Event"].apply(event, Array.prototype.slice.call(arguments, 2));
        },

        _initMouseEvent: function (event) {
            this._initEventImpl.apply(this, ["Mouse", event].concat(Array.prototype.slice.call(arguments, 1)));
        },

        _initPointerEvent: function (event) {
            this._initEventImpl.apply(this, ["Pointer", event].concat(Array.prototype.slice.call(arguments, 1)));
        },

        _PointerEventProxy: PointerEventProxy,

        _bubbleEvent: bubbleEvent,

        _setPointerCapture: function (element, pointerId) {
            if (element.setPointerCapture) {
                element.setPointerCapture(pointerId);
            }
        },

        _releasePointerCapture: function (element, pointerId) {
            if (element.releasePointerCapture) {
                element.releasePointerCapture(pointerId);
            }
        },

        _MSPointerEvent: _MSPointerEvent,

        _getComputedStyle: _getComputedStyle,

        _zoomToDuration: _zoomToDuration,

        _zoomTo: function _zoomTo(element, args) {
            if (this._supportsSnapPoints && element.msZoomTo) {
                element.msZoomTo(args);
            } else {
                // Schedule to ensure that we're not running from within an event handler. For example, if running
                // within a focus handler triggered by WinJS.Utilities._setActive, scroll position will not yet be
                // restored.
                Scheduler.schedule(function () {
                    var initialPos = getAdjustedScrollPosition(element);
                    var effectiveScrollLeft = (typeof element._zoomToDestX === "number" ? element._zoomToDestX : initialPos.scrollLeft);
                    var effectiveScrollTop = (typeof element._zoomToDestY === "number" ? element._zoomToDestY : initialPos.scrollTop);
                    var cs = _getComputedStyle(element);
                    var scrollLimitX = element.scrollWidth - parseInt(cs.width, 10) - parseInt(cs.paddingLeft, 10) - parseInt(cs.paddingRight, 10);
                    var scrollLimitY = element.scrollHeight - parseInt(cs.height, 10) - parseInt(cs.paddingTop, 10) - parseInt(cs.paddingBottom, 10);

                    if (typeof args.contentX !== "number") {
                        args.contentX = effectiveScrollLeft;
                    }
                    if (typeof args.contentY !== "number") {
                        args.contentY = effectiveScrollTop;
                    }

                    var zoomToDestX = _clamp(args.contentX, 0, scrollLimitX);
                    var zoomToDestY = _clamp(args.contentY, 0, scrollLimitY);
                    if (zoomToDestX === effectiveScrollLeft && zoomToDestY === effectiveScrollTop) {
                        // Scroll position is already in the proper state. This zoomTo is a no-op.
                        return;
                    }

                    element._zoomToId = element._zoomToId || 0;
                    element._zoomToId++;
                    element._zoomToDestX = zoomToDestX;
                    element._zoomToDestY = zoomToDestY;

                    var thisZoomToId = element._zoomToId;
                    var start = _BaseUtils._now();
                    var xFactor = (element._zoomToDestX - initialPos.scrollLeft) / _zoomToDuration;
                    var yFactor = (element._zoomToDestY - initialPos.scrollTop) / _zoomToDuration;

                    var update = function () {
                        var t = _BaseUtils._now() - start;
                        if (element._zoomToId !== thisZoomToId) {
                            return;
                        } else if (t > _zoomToDuration) {
                            setAdjustedScrollPosition(element, element._zoomToDestX, element._zoomToDestY);
                            element._zoomToDestX = null;
                            element._zoomToDestY = null;
                        } else {
                            setAdjustedScrollPosition(element, initialPos.scrollLeft + t * xFactor, initialPos.scrollTop + t * yFactor);
                            _BaseUtils._requestAnimationFrame(update);
                        }
                    };

                    _BaseUtils._requestAnimationFrame(update);
                }, Scheduler.Priority.high, null, "WinJS.Utilities._zoomTo");
            }
        },

        _setActive: function _setActive(element, scroller) {
            var success = true;
            try {
                if (_Global.HTMLElement && _Global.HTMLElement.prototype.setActive) {
                    element.setActive();
                } else {
                    // We are aware that, unlike setActive(), focus() will scroll to the element that gets focus. However, this is
                    // our current cross-browser solution until there is an equivalent for setActive() in other browsers.
                    //
                    // This _setActive polyfill does have limited support for preventing scrolling: via the scroller parameter, it
                    // can prevent one scroller from scrolling. This functionality is necessary in some scenarios. For example, when using
                    // _zoomTo and _setActive together.

                    var scrollLeft,
                        scrollTop;

                    if (scroller) {
                        scrollLeft = scroller.scrollLeft;
                        scrollTop = scroller.scrollTop;
                    }
                    element.focus();
                    if (scroller) {
                        scroller.scrollLeft = scrollLeft;
                        scroller.scrollTop = scrollTop;
                    }
                }
            } catch (e) {
                // setActive() raises an exception when trying to focus an invisible item. Checking visibility is non-trivial, so it's best
                // just to catch the exception and ignore it. focus() on the other hand, does not raise exceptions.
                success = false;
            }
            return success;
        },

        _MutationObserver: _MutationObserver,

        _resizeNotifier: {
            get: function () {
                if (!_resizeNotifier) {
                    _resizeNotifier = new ResizeNotifier();
                }
                return _resizeNotifier;
            }
        },

        _GenericListener: GenericListener,
        _globalListener: new GenericListener("Global", _Global, { registerThruWinJSCustomEvents: true }),
        _documentElementListener: new GenericListener("DocumentElement", _Global.document.documentElement, { registerThruWinJSCustomEvents: true }),
        _inputPaneListener: _WinRT.Windows.UI.ViewManagement.InputPane ?
            new GenericListener("InputPane", _WinRT.Windows.UI.ViewManagement.InputPane.getForCurrentView()) :
            { addEventListener: function () { }, removeEventListener: function () { } },

        // Appends a hidden child to the given element that will listen for being added
        // to the DOM. When the hidden element is added to the DOM, it will dispatch a
        // "WinJSNodeInserted" event on the provided element.
        _addInsertedNotifier: function (element) {
            var hiddenElement = _Global.document.createElement("div");
            hiddenElement.style[_BaseUtils._browserStyleEquivalents["animation-name"].scriptName] = "WinJS-node-inserted";
            hiddenElement.style[_BaseUtils._browserStyleEquivalents["animation-duration"].scriptName] = "0.01s";
            hiddenElement.style["position"] = "absolute";
            element.appendChild(hiddenElement);

            exports._addEventListener(hiddenElement, "animationStart", function (e) {
                if (e.animationName === "WinJS-node-inserted") {
                    var e = _Global.document.createEvent("Event");
                    e.initEvent("WinJSNodeInserted", false, true);
                    element.dispatchEvent(e);
                }
            }, false);

            return hiddenElement;
        },

        // Returns a promise which completes when *element* is in the DOM.
        _inDom: function Utilities_inDom(element) {
            return new Promise(function (c) {
                if (_Global.document.body.contains(element)) {
                    c();
                } else {
                    var nodeInsertedHandler = function () {
                        element.removeEventListener("WinJSNodeInserted", nodeInsertedHandler, false);
                        c();
                    };
                    exports._addInsertedNotifier(element);
                    element.addEventListener("WinJSNodeInserted", nodeInsertedHandler, false);
                }
            });
        },

        // Browser agnostic method to set element flex style
        // Param is an object in the form {grow: flex-grow, shrink: flex-shrink, basis: flex-basis}
        // All fields optional
        _setFlexStyle: function (element, flexParams) {
            var styleObject = element.style;
            if (typeof flexParams.grow !== "undefined") {
                styleObject.msFlexPositive = flexParams.grow;
                styleObject.webkitFlexGrow = flexParams.grow;
                styleObject.flexGrow = flexParams.grow;
            }
            if (typeof flexParams.shrink !== "undefined") {
                styleObject.msFlexNegative = flexParams.shrink;
                styleObject.webkitFlexShrink = flexParams.shrink;
                styleObject.flexShrink = flexParams.shrink;
            }
            if (typeof flexParams.basis !== "undefined") {
                styleObject.msFlexPreferredSize = flexParams.basis;
                styleObject.webkitFlexBasis = flexParams.basis;
                styleObject.flexBasis = flexParams.basis;
            }
        },

        /// <field locid="WinJS.Utilities.Key" helpKeyword="WinJS.Utilities.Key">
        /// Defines a set of keyboard values.
        /// </field>
        Key: {
            /// <field locid="WinJS.Utilities.Key.backspace" helpKeyword="WinJS.Utilities.Key.backspace">
            /// BACKSPACE key.
            /// </field>
            backspace: 8,

            /// <field locid="WinJS.Utilities.Key.tab" helpKeyword="WinJS.Utilities.Key.tab">
            /// TAB key.
            /// </field>
            tab: 9,

            /// <field locid="WinJS.Utilities.Key.enter" helpKeyword="WinJS.Utilities.Key.enter">
            /// ENTER key.
            /// </field>
            enter: 13,

            /// <field locid="WinJS.Utilities.Key.shift" helpKeyword="WinJS.Utilities.Key.shift">
            /// Shift key.
            /// </field>
            shift: 16,

            /// <field locid="WinJS.Utilities.Key.ctrl" helpKeyword="WinJS.Utilities.Key.ctrl">
            /// CTRL key.
            /// </field>
            ctrl: 17,

            /// <field locid="WinJS.Utilities.Key.alt" helpKeyword="WinJS.Utilities.Key.alt">
            /// ALT key
            /// </field>
            alt: 18,

            /// <field locid="WinJS.Utilities.Key.pause" helpKeyword="WinJS.Utilities.Key.pause">
            /// Pause key.
            /// </field>
            pause: 19,

            /// <field locid="WinJS.Utilities.Key.capsLock" helpKeyword="WinJS.Utilities.Key.capsLock">
            /// CAPS LOCK key.
            /// </field>
            capsLock: 20,

            /// <field locid="WinJS.Utilities.Key.escape" helpKeyword="WinJS.Utilities.Key.escape">
            /// ESCAPE key.
            /// </field>
            escape: 27,

            /// <field locid="WinJS.Utilities.Key.space" helpKeyword="WinJS.Utilities.Key.space">
            /// SPACE key.
            /// </field>
            space: 32,

            /// <field locid="WinJS.Utilities.Key.pageUp" helpKeyword="WinJS.Utilities.Key.pageUp">
            /// PAGE UP key.
            /// </field>
            pageUp: 33,

            /// <field locid="WinJS.Utilities.Key.pageDown" helpKeyword="WinJS.Utilities.Key.pageDown">
            /// PAGE DOWN key.
            /// </field>
            pageDown: 34,

            /// <field locid="WinJS.Utilities.Key.end" helpKeyword="WinJS.Utilities.Key.end">
            /// END key.
            /// </field>
            end: 35,

            /// <field locid="WinJS.Utilities.Key.home" helpKeyword="WinJS.Utilities.Key.home">
            /// HOME key.
            /// </field>
            home: 36,

            /// <field locid="WinJS.Utilities.Key.leftArrow" helpKeyword="WinJS.Utilities.Key.leftArrow">
            /// Left arrow key.
            /// </field>
            leftArrow: 37,

            /// <field locid="WinJS.Utilities.Key.upArrow" helpKeyword="WinJS.Utilities.Key.upArrow">
            /// Up arrow key.
            /// </field>
            upArrow: 38,

            /// <field locid="WinJS.Utilities.Key.rightArrow" helpKeyword="WinJS.Utilities.Key.rightArrow">
            /// Right arrow key.
            /// </field>
            rightArrow: 39,

            /// <field locid="WinJS.Utilities.Key.downArrow" helpKeyword="WinJS.Utilities.Key.downArrow">
            /// Down arrow key.
            /// </field>
            downArrow: 40,

            /// <field locid="WinJS.Utilities.Key.insert" helpKeyword="WinJS.Utilities.Key.insert">
            /// INSERT key.
            /// </field>
            insert: 45,

            /// <field locid="WinJS.Utilities.Key.deleteKey" helpKeyword="WinJS.Utilities.Key.deleteKey">
            /// DELETE key.
            /// </field>
            deleteKey: 46,

            /// <field locid="WinJS.Utilities.Key.num0" helpKeyword="WinJS.Utilities.Key.num0">
            /// Number 0 key.
            /// </field>
            num0: 48,

            /// <field locid="WinJS.Utilities.Key.num1" helpKeyword="WinJS.Utilities.Key.num1">
            /// Number 1 key.
            /// </field>
            num1: 49,

            /// <field locid="WinJS.Utilities.Key.num2" helpKeyword="WinJS.Utilities.Key.num2">
            /// Number 2 key.
            /// </field>
            num2: 50,

            /// <field locid="WinJS.Utilities.Key.num3" helpKeyword="WinJS.Utilities.Key.num3">
            /// Number 3 key.
            /// </field>
            num3: 51,

            /// <field locid="WinJS.Utilities.Key.num4" helpKeyword="WinJS.Utilities.Key.num4">
            /// Number 4 key.
            /// </field>
            num4: 52,

            /// <field locid="WinJS.Utilities.Key.num5" helpKeyword="WinJS.Utilities.Key.num5">
            /// Number 5 key.
            /// </field>
            num5: 53,

            /// <field locid="WinJS.Utilities.Key.num6" helpKeyword="WinJS.Utilities.Key.num6">
            /// Number 6 key.
            /// </field>
            num6: 54,

            /// <field locid="WinJS.Utilities.Key.num7" helpKeyword="WinJS.Utilities.Key.num7">
            /// Number 7 key.
            /// </field>
            num7: 55,

            /// <field locid="WinJS.Utilities.Key.num8" helpKeyword="WinJS.Utilities.Key.num8">
            /// Number 8 key.
            /// </field>
            num8: 56,

            /// <field locid="WinJS.Utilities.Key.num9" helpKeyword="WinJS.Utilities.Key.num9">
            /// Number 9 key.
            /// </field>
            num9: 57,

            /// <field locid="WinJS.Utilities.Key.a" helpKeyword="WinJS.Utilities.Key.a">
            /// A key.
            /// </field>
            a: 65,

            /// <field locid="WinJS.Utilities.Key.b" helpKeyword="WinJS.Utilities.Key.b">
            /// B key.
            /// </field>
            b: 66,

            /// <field locid="WinJS.Utilities.Key.c" helpKeyword="WinJS.Utilities.Key.c">
            /// C key.
            /// </field>
            c: 67,

            /// <field locid="WinJS.Utilities.Key.d" helpKeyword="WinJS.Utilities.Key.d">
            /// D key.
            /// </field>
            d: 68,

            /// <field locid="WinJS.Utilities.Key.e" helpKeyword="WinJS.Utilities.Key.e">
            /// E key.
            /// </field>
            e: 69,

            /// <field locid="WinJS.Utilities.Key.f" helpKeyword="WinJS.Utilities.Key.f">
            /// F key.
            /// </field>
            f: 70,

            /// <field locid="WinJS.Utilities.Key.g" helpKeyword="WinJS.Utilities.Key.g">
            /// G key.
            /// </field>
            g: 71,

            /// <field locid="WinJS.Utilities.Key.h" helpKeyword="WinJS.Utilities.Key.h">
            /// H key.
            /// </field>
            h: 72,

            /// <field locid="WinJS.Utilities.Key.i" helpKeyword="WinJS.Utilities.Key.i">
            /// I key.
            /// </field>
            i: 73,

            /// <field locid="WinJS.Utilities.Key.j" helpKeyword="WinJS.Utilities.Key.j">
            /// J key.
            /// </field>
            j: 74,

            /// <field locid="WinJS.Utilities.Key.k" helpKeyword="WinJS.Utilities.Key.k">
            /// K key.
            /// </field>
            k: 75,

            /// <field locid="WinJS.Utilities.Key.l" helpKeyword="WinJS.Utilities.Key.l">
            /// L key.
            /// </field>
            l: 76,

            /// <field locid="WinJS.Utilities.Key.m" helpKeyword="WinJS.Utilities.Key.m">
            /// M key.
            /// </field>
            m: 77,

            /// <field locid="WinJS.Utilities.Key.n" helpKeyword="WinJS.Utilities.Key.n">
            /// N key.
            /// </field>
            n: 78,

            /// <field locid="WinJS.Utilities.Key.o" helpKeyword="WinJS.Utilities.Key.o">
            /// O key.
            /// </field>
            o: 79,

            /// <field locid="WinJS.Utilities.Key.p" helpKeyword="WinJS.Utilities.Key.p">
            /// P key.
            /// </field>
            p: 80,

            /// <field locid="WinJS.Utilities.Key.q" helpKeyword="WinJS.Utilities.Key.q">
            /// Q key.
            /// </field>
            q: 81,

            /// <field locid="WinJS.Utilities.Key.r" helpKeyword="WinJS.Utilities.Key.r">
            /// R key.
            /// </field>
            r: 82,

            /// <field locid="WinJS.Utilities.Key.s" helpKeyword="WinJS.Utilities.Key.s">
            /// S key.
            /// </field>
            s: 83,

            /// <field locid="WinJS.Utilities.Key.t" helpKeyword="WinJS.Utilities.Key.t">
            /// T key.
            /// </field>
            t: 84,

            /// <field locid="WinJS.Utilities.Key.u" helpKeyword="WinJS.Utilities.Key.u">
            /// U key.
            /// </field>
            u: 85,

            /// <field locid="WinJS.Utilities.Key.v" helpKeyword="WinJS.Utilities.Key.v">
            /// V key.
            /// </field>
            v: 86,

            /// <field locid="WinJS.Utilities.Key.w" helpKeyword="WinJS.Utilities.Key.w">
            /// W key.
            /// </field>
            w: 87,

            /// <field locid="WinJS.Utilities.Key.x" helpKeyword="WinJS.Utilities.Key.x">
            /// X key.
            /// </field>
            x: 88,

            /// <field locid="WinJS.Utilities.Key.y" helpKeyword="WinJS.Utilities.Key.y">
            /// Y key.
            /// </field>
            y: 89,

            /// <field locid="WinJS.Utilities.Key.z" helpKeyword="WinJS.Utilities.Key.z">
            /// Z key.
            /// </field>
            z: 90,

            /// <field locid="WinJS.Utilities.Key.leftWindows" helpKeyword="WinJS.Utilities.Key.leftWindows">
            /// Left Windows key.
            /// </field>
            leftWindows: 91,

            /// <field locid="WinJS.Utilities.Key.rightWindows" helpKeyword="WinJS.Utilities.Key.rightWindows">
            /// Right Windows key.
            /// </field>
            rightWindows: 92,

            /// <field locid="WinJS.Utilities.Key.menu" helpKeyword="WinJS.Utilities.Key.menu">
            /// Menu key.
            /// </field>
            menu: 93,

            /// <field locid="WinJS.Utilities.Key.numPad0" helpKeyword="WinJS.Utilities.Key.numPad0">
            /// Number pad 0 key.
            /// </field>
            numPad0: 96,

            /// <field locid="WinJS.Utilities.Key.numPad1" helpKeyword="WinJS.Utilities.Key.numPad1">
            /// Number pad 1 key.
            /// </field>
            numPad1: 97,

            /// <field locid="WinJS.Utilities.Key.numPad2" helpKeyword="WinJS.Utilities.Key.numPad2">
            /// Number pad 2 key.
            /// </field>
            numPad2: 98,

            /// <field locid="WinJS.Utilities.Key.numPad3" helpKeyword="WinJS.Utilities.Key.numPad3">
            /// Number pad 3 key.
            /// </field>
            numPad3: 99,

            /// <field locid="WinJS.Utilities.Key.numPad4" helpKeyword="WinJS.Utilities.Key.numPad4">
            /// Number pad 4 key.
            /// </field>
            numPad4: 100,

            /// <field locid="WinJS.Utilities.Key.numPad5" helpKeyword="WinJS.Utilities.Key.numPad5">
            /// Number pad 5 key.
            /// </field>
            numPad5: 101,

            /// <field locid="WinJS.Utilities.Key.numPad6" helpKeyword="WinJS.Utilities.Key.numPad6">
            /// Number pad 6 key.
            /// </field>
            numPad6: 102,

            /// <field locid="WinJS.Utilities.Key.numPad7" helpKeyword="WinJS.Utilities.Key.numPad7">
            /// Number pad 7 key.
            /// </field>
            numPad7: 103,

            /// <field locid="WinJS.Utilities.Key.numPad8" helpKeyword="WinJS.Utilities.Key.numPad8">
            /// Number pad 8 key.
            /// </field>
            numPad8: 104,

            /// <field locid="WinJS.Utilities.Key.numPad9" helpKeyword="WinJS.Utilities.Key.numPad9">
            /// Number pad 9 key.
            /// </field>
            numPad9: 105,

            /// <field locid="WinJS.Utilities.Key.multiply" helpKeyword="WinJS.Utilities.Key.multiply">
            /// Multiplication key.
            /// </field>
            multiply: 106,

            /// <field locid="WinJS.Utilities.Key.add" helpKeyword="WinJS.Utilities.Key.add">
            /// Addition key.
            /// </field>
            add: 107,

            /// <field locid="WinJS.Utilities.Key.subtract" helpKeyword="WinJS.Utilities.Key.subtract">
            /// Subtraction key.
            /// </field>
            subtract: 109,

            /// <field locid="WinJS.Utilities.Key.decimalPoint" helpKeyword="WinJS.Utilities.Key.decimalPoint">
            /// Decimal point key.
            /// </field>
            decimalPoint: 110,

            /// <field locid="WinJS.Utilities.Key.divide" helpKeyword="WinJS.Utilities.Key.divide">
            /// Division key.
            /// </field>
            divide: 111,

            /// <field locid="WinJS.Utilities.Key.F1" helpKeyword="WinJS.Utilities.Key.F1">
            /// F1 key.
            /// </field>
            F1: 112,

            /// <field locid="WinJS.Utilities.Key.F2" helpKeyword="WinJS.Utilities.Key.F2">
            /// F2 key.
            /// </field>
            F2: 113,

            /// <field locid="WinJS.Utilities.Key.F3" helpKeyword="WinJS.Utilities.Key.F3">
            /// F3 key.
            /// </field>
            F3: 114,

            /// <field locid="WinJS.Utilities.Key.F4" helpKeyword="WinJS.Utilities.Key.F4">
            /// F4 key.
            /// </field>
            F4: 115,

            /// <field locid="WinJS.Utilities.Key.F5" helpKeyword="WinJS.Utilities.Key.F5">
            /// F5 key.
            /// </field>
            F5: 116,

            /// <field locid="WinJS.Utilities.Key.F6" helpKeyword="WinJS.Utilities.Key.F6">
            /// F6 key.
            /// </field>
            F6: 117,

            /// <field locid="WinJS.Utilities.Key.F7" helpKeyword="WinJS.Utilities.Key.F7">
            /// F7 key.
            /// </field>
            F7: 118,

            /// <field locid="WinJS.Utilities.Key.F8" helpKeyword="WinJS.Utilities.Key.F8">
            /// F8 key.
            /// </field>
            F8: 119,

            /// <field locid="WinJS.Utilities.Key.F9" helpKeyword="WinJS.Utilities.Key.F9">
            /// F9 key.
            /// </field>
            F9: 120,

            /// <field locid="WinJS.Utilities.Key.F10" helpKeyword="WinJS.Utilities.Key.F10">
            /// F10 key.
            /// </field>
            F10: 121,

            /// <field locid="WinJS.Utilities.Key.F11" helpKeyword="WinJS.Utilities.Key.F11">
            /// F11 key.
            /// </field>
            F11: 122,

            /// <field locid="WinJS.Utilities.Key.F12" helpKeyword="WinJS.Utilities.Key.F12">
            /// F12 key.
            /// </field>
            F12: 123,

            /// <field locid="WinJS.Utilities.Key.NavigationView" helpKeyword="WinJS.Utilities.Key.NavigationView">
            /// XBox One Remote NavigationView key.
            /// </field>
            NavigationView: 136,

            /// <field locid="WinJS.Utilities.Key.NavigationMenu" helpKeyword="WinJS.Utilities.Key.NavigationMenu">
            /// XBox One Remote NavigationMenu key.
            /// </field>
            NavigationMenu: 137,

            /// <field locid="WinJS.Utilities.Key.NavigationUp" helpKeyword="WinJS.Utilities.Key.NavigationUp">
            /// XBox One Remote NavigationUp key.
            /// </field>
            NavigationUp: 138,

            /// <field locid="WinJS.Utilities.Key.NavigationDown" helpKeyword="WinJS.Utilities.Key.NavigationDown">
            /// XBox One Remote NavigationDown key.
            /// </field>
            NavigationDown: 139,

            /// <field locid="WinJS.Utilities.Key.NavigationLeft" helpKeyword="WinJS.Utilities.Key.NavigationLeft">
            /// XBox One Remote NavigationLeft key.
            /// </field>
            NavigationLeft: 140,

            /// <field locid="WinJS.Utilities.Key.NavigationRight" helpKeyword="WinJS.Utilities.Key.NavigationRight">
            /// XBox One Remote NavigationRight key.
            /// </field>
            NavigationRight: 141,

            /// <field locid="WinJS.Utilities.Key.NavigationAccept" helpKeyword="WinJS.Utilities.Key.NavigationAccept">
            /// XBox One Remote NavigationAccept key.
            /// </field>
            NavigationAccept: 142,

            /// <field locid="WinJS.Utilities.Key.NavigationCancel" helpKeyword="WinJS.Utilities.Key.NavigationCancel">
            /// XBox One Remote NavigationCancel key.
            /// </field>
            NavigationCancel: 143,

            /// <field locid="WinJS.Utilities.Key.numLock" helpKeyword="WinJS.Utilities.Key.numLock">
            /// NUMBER LOCK key.
            /// </field>
            numLock: 144,

            /// <field locid="WinJS.Utilities.Key.scrollLock" helpKeyword="WinJS.Utilities.Key.scrollLock">
            /// SCROLL LOCK key.
            /// </field>
            scrollLock: 145,

            /// <field locid="WinJS.Utilities.Key.browserBack" helpKeyword="WinJS.Utilities.Key.browserBack">
            /// Browser back key.
            /// </field>
            browserBack: 166,

            /// <field locid="WinJS.Utilities.Key.browserForward" helpKeyword="WinJS.Utilities.Key.browserForward">
            /// Browser forward key.
            /// </field>
            browserForward: 167,

            /// <field locid="WinJS.Utilities.Key.semicolon" helpKeyword="WinJS.Utilities.Key.semicolon">
            /// SEMICOLON key.
            /// </field>
            semicolon: 186,

            /// <field locid="WinJS.Utilities.Key.equal" helpKeyword="WinJS.Utilities.Key.equal">
            /// EQUAL key.
            /// </field>
            equal: 187,

            /// <field locid="WinJS.Utilities.Key.comma" helpKeyword="WinJS.Utilities.Key.comma">
            /// COMMA key.
            /// </field>
            comma: 188,

            /// <field locid="WinJS.Utilities.Key.dash" helpKeyword="WinJS.Utilities.Key.dash">
            /// DASH key.
            /// </field>
            dash: 189,

            /// <field locid="WinJS.Utilities.Key.period" helpKeyword="WinJS.Utilities.Key.period">
            /// PERIOD key.
            /// </field>
            period: 190,

            /// <field locid="WinJS.Utilities.Key.forwardSlash" helpKeyword="WinJS.Utilities.Key.forwardSlash">
            /// FORWARD SLASH key.
            /// </field>
            forwardSlash: 191,

            /// <field locid="WinJS.Utilities.Key.graveAccent" helpKeyword="WinJS.Utilities.Key.graveAccent">
            /// Accent grave key.
            /// </field>
            graveAccent: 192,

            /// <field locid="WinJS.Utilities.Key.GamepadA" helpKeyword="WinJS.Utilities.Key.GamepadA">
            /// XBox One GamepadA key.
            /// </field>
            GamepadA: 195,

            /// <field locid="WinJS.Utilities.Key.GamepadB" helpKeyword="WinJS.Utilities.Key.GamepadB">
            /// XBox One GamepadB key.
            /// </field>
            GamepadB: 196,

            /// <field locid="WinJS.Utilities.Key.GamepadX" helpKeyword="WinJS.Utilities.Key.GamepadX">
            /// XBox One GamepadX key.
            /// </field>
            GamepadX: 197,

            /// <field locid="WinJS.Utilities.Key.GamepadY" helpKeyword="WinJS.Utilities.Key.GamepadY">
            /// XBox One GamepadY key.
            /// </field>
            GamepadY: 198,

            /// <field locid="WinJS.Utilities.Key.GamepadRightShoulder" helpKeyword="WinJS.Utilities.Key.GamepadRightShoulder">
            /// XBox One GamepadRightShoulder key.
            /// </field>
            GamepadRightShoulder: 199,

            /// <field locid="WinJS.Utilities.Key.GamepadLeftShoulder" helpKeyword="WinJS.Utilities.Key.GamepadLeftShoulder">
            /// XBox One GamepadLeftShoulder key.
            /// </field>
            GamepadLeftShoulder: 200,

            /// <field locid="WinJS.Utilities.Key.GamepadLeftTrigger" helpKeyword="WinJS.Utilities.Key.GamepadLeftTrigger">
            /// XBox One GamepadLeftTrigger key.
            /// </field>
            GamepadLeftTrigger: 201,

            /// <field locid="WinJS.Utilities.Key.GamepadRightTrigger" helpKeyword="WinJS.Utilities.Key.GamepadRightTrigger">
            /// XBox One GamepadRightTrigger key.
            /// </field>
            GamepadRightTrigger: 202,

            /// <field locid="WinJS.Utilities.Key.GamepadDPadUp" helpKeyword="WinJS.Utilities.Key.GamepadDPadUp">
            /// XBox One GamepadDPadUp key.
            /// </field>
            GamepadDPadUp: 203,

            /// <field locid="WinJS.Utilities.Key.GamepadDPadDown" helpKeyword="WinJS.Utilities.Key.GamepadDPadDown">
            /// XBox One GamepadDPadDown key.
            /// </field>
            GamepadDPadDown: 204,

            /// <field locid="WinJS.Utilities.Key.GamepadDPadLeft" helpKeyword="WinJS.Utilities.Key.GamepadDPadLeft">
            /// XBox One GamepadDPadLeft key.
            /// </field>
            GamepadDPadLeft: 205,

            /// <field locid="WinJS.Utilities.Key.GamepadDPadRight" helpKeyword="WinJS.Utilities.Key.GamepadDPadRight">
            /// XBox One GamepadDPadRight key.
            /// </field>
            GamepadDPadRight: 206,

            /// <field locid="WinJS.Utilities.Key.GamepadMenu" helpKeyword="WinJS.Utilities.Key.GamepadMenu">
            /// XBox One GamepadMenu key.
            /// </field>
            GamepadMenu: 207,

            /// <field locid="WinJS.Utilities.Key.GamepadView" helpKeyword="WinJS.Utilities.Key.GamepadView">
            /// XBox One GamepadView key.
            /// </field>
            GamepadView: 208,

            /// <field locid="WinJS.Utilities.Key.GamepadLeftThumbstick" helpKeyword="WinJS.Utilities.Key.GamepadLeftThumbstick">
            /// XBox One GamepadLeftThumbstick key.
            /// </field>
            GamepadLeftThumbstick: 209,

            /// <field locid="WinJS.Utilities.Key.GamepadRightThumbstick" helpKeyword="WinJS.Utilities.Key.GamepadRightThumbstick">
            /// XBox One GamepadRightThumbstick key.
            /// </field>
            GamepadRightThumbstick: 210,

            /// <field locid="WinJS.Utilities.Key.GamepadLeftThumbstickUp" helpKeyword="WinJS.Utilities.Key.GamepadLeftThumbstickUp">
            /// XBox One GamepadLeftThumbstickUp key.
            /// </field>
            GamepadLeftThumbstickUp: 211,

            /// <field locid="WinJS.Utilities.Key.GamepadLeftThumbstickDown" helpKeyword="WinJS.Utilities.Key.GamepadLeftThumbstickDown">
            /// XBox One GamepadLeftThumbstickDown key.
            /// </field>
            GamepadLeftThumbstickDown: 212,

            /// <field locid="WinJS.Utilities.Key.GamepadLeftThumbstickRight" helpKeyword="WinJS.Utilities.Key.GamepadLeftThumbstickRight">
            /// XBox One GamepadLeftThumbstickRight key.
            /// </field>
            GamepadLeftThumbstickRight: 213,

            /// <field locid="WinJS.Utilities.Key.GamepadLeftThumbstickLeft" helpKeyword="WinJS.Utilities.Key.GamepadLeftThumbstickLeft">
            /// XBox One GamepadLeftThumbstickLeft key.
            /// </field>
            GamepadLeftThumbstickLeft: 214,

            /// <field locid="WinJS.Utilities.Key.GamepadRightThumbstickUp" helpKeyword="WinJS.Utilities.Key.GamepadRightThumbstickUp">
            /// XBox One GamepadRightThumbstickUp key.
            /// </field>
            GamepadRightThumbstickUp: 215,

            /// <field locid="WinJS.Utilities.Key.GamepadRightThumbstickDown" helpKeyword="WinJS.Utilities.Key.GamepadRightThumbstickDown">
            /// XBox One GamepadRightThumbstickDown key.
            /// </field>
            GamepadRightThumbstickDown: 216,

            /// <field locid="WinJS.Utilities.Key.GamepadRightThumbstickRight" helpKeyword="WinJS.Utilities.Key.GamepadRightThumbstickRight">
            /// XBox One GamepadRightThumbstickRight key.
            /// </field>
            GamepadRightThumbstickRight: 217,

            /// <field locid="WinJS.Utilities.Key.GamepadRightThumbstickLeft" helpKeyword="WinJS.Utilities.Key.GamepadRightThumbstickLeft">
            /// XBox One GamepadRightThumbstickLeft key.
            /// </field>
            GamepadRightThumbstickLeft: 218,

            /// <field locid="WinJS.Utilities.Key.openBracket" helpKeyword="WinJS.Utilities.Key.openBracket">
            /// OPEN BRACKET key.
            /// </field>
            openBracket: 219,

            /// <field locid="WinJS.Utilities.Key.backSlash" helpKeyword="WinJS.Utilities.Key.backSlash">
            /// BACKSLASH key.
            /// </field>
            backSlash: 220,

            /// <field locid="WinJS.Utilities.Key.closeBracket" helpKeyword="WinJS.Utilities.Key.closeBracket">
            /// CLOSE BRACKET key.
            /// </field>
            closeBracket: 221,

            /// <field locid="WinJS.Utilities.Key.singleQuote" helpKeyword="WinJS.Utilities.Key.singleQuote">
            /// SINGLE QUOTE key.
            /// </field>
            singleQuote: 222,

            /// <field locid="WinJS.Utilities.Key.IME" helpKeyword="WinJS.Utilities.Key.IME">
            /// Any IME input.
            /// </field>
            IME: 229
        },

        data: function (element) {
            /// <signature helpKeyword="WinJS.Utilities.data">
            /// <summary locid="WinJS.Utilities.data">
            /// Gets the data value associated with the specified element.
            /// </summary>
            /// <param name="element" type="HTMLElement" locid="WinJS.Utilities.data_p:element">
            /// The element.
            /// </param>
            /// <returns type="Object" locid="WinJS.Utilities.data_returnValue">
            /// The value associated with the element.
            /// </returns>
            /// </signature>
            if (!element[_dataKey]) {
                element[_dataKey] = {};
            }
            return element[_dataKey];
        },

        hasClass: function (e, name) {
            /// <signature helpKeyword="WinJS.Utilities.hasClass">
            /// <summary locid="WinJS.Utilities.hasClass">
            /// Determines whether the specified element has the specified class.
            /// </summary>
            /// <param name="e" type="HTMLElement" locid="WinJS.Utilities.hasClass_p:e">
            /// The element.
            /// </param>
            /// <param name="name" type="String" locid="WinJS.Utilities.hasClass_p:name">
            /// The name of the class.
            /// </param>
            /// <returns type="Boolean" locid="WinJS.Utilities.hasClass_returnValue">
            /// true if the specified element contains the specified class; otherwise, false.
            /// </returns>
            /// </signature>

            if (e.classList) {
                return e.classList.contains(name);
            } else {
                var className = getClassName(e);
                var names = className.trim().split(" ");
                var l = names.length;
                for (var i = 0; i < l; i++) {
                    if (names[i] === name) {
                        return true;
                    }
                }
                return false;
            }
        },

        addClass: addClass,

        removeClass: removeClass,

        toggleClass: toggleClass,

        _setAttribute: setAttribute,

        getRelativeLeft: function (element, parent) {
            /// <signature helpKeyword="WinJS.Utilities.getRelativeLeft">
            /// <summary locid="WinJS.Utilities.getRelativeLeft">
            /// Gets the left coordinate of the specified element relative to the specified parent.
            /// </summary>
            /// <param name="element" domElement="true" locid="WinJS.Utilities.getRelativeLeft_p:element">
            /// The element.
            /// </param>
            /// <param name="parent" domElement="true" locid="WinJS.Utilities.getRelativeLeft_p:parent">
            /// The parent element.
            /// </param>
            /// <returns type="Number" locid="WinJS.Utilities.getRelativeLeft_returnValue">
            /// The relative left coordinate.
            /// </returns>
            /// </signature>
            if (!element) {
                return 0;
            }

            var elementPosition = exports._getPositionRelativeTo(element, null);
            var parentPosition = exports._getPositionRelativeTo(parent, null);
            return elementPosition.left - parentPosition.left;
        },

        getRelativeTop: function (element, parent) {
            /// <signature helpKeyword="WinJS.Utilities.getRelativeTop">
            /// <summary locid="WinJS.Utilities.getRelativeTop">
            /// Gets the top coordinate of the element relative to the specified parent.
            /// </summary>
            /// <param name="element" domElement="true" locid="WinJS.Utilities.getRelativeTop_p:element">
            /// The element.
            /// </param>
            /// <param name="parent" domElement="true" locid="WinJS.Utilities.getRelativeTop_p:parent">
            /// The parent element.
            /// </param>
            /// <returns type="Number" locid="WinJS.Utilities.getRelativeTop_returnValue">
            /// The relative top coordinate.
            /// </returns>
            /// </signature>
            if (!element) {
                return 0;
            }

            var elementPosition = exports._getPositionRelativeTo(element, null);
            var parentPosition = exports._getPositionRelativeTo(parent, null);
            return elementPosition.top - parentPosition.top;
        },

        getScrollPosition: getScrollPosition,

        setScrollPosition: setScrollPosition,

        empty: function (element) {
            /// <signature helpKeyword="WinJS.Utilities.empty">
            /// <summary locid="WinJS.Utilities.empty">
            /// Removes all the child nodes from the specified element.
            /// </summary>
            /// <param name="element" type="HTMLElement" domElement="true" locid="WinJS.Utilities.empty_p:element">
            /// The element.
            /// </param>
            /// <returns type="HTMLElement" locid="WinJS.Utilities.empty_returnValue">
            /// The element.
            /// </returns>
            /// </signature>
            if (element.childNodes && element.childNodes.length > 0) {
                for (var i = element.childNodes.length - 1; i >= 0; i--) {
                    element.removeChild(element.childNodes.item(i));
                }
            }
            return element;
        },

        _isDOMElement: function (element) {
            return element &&
                typeof element === "object" &&
                typeof element.tagName === "string";
        },

        getContentWidth: function (element) {
            /// <signature helpKeyword="WinJS.Utilities.getContentWidth">
            /// <summary locid="WinJS.Utilities.getContentWidth">
            /// Gets the width of the content of the specified element. The content width does not include borders or padding.
            /// </summary>
            /// <param name="element" type="HTMLElement" locid="WinJS.Utilities.getContentWidth_p:element">
            /// The element.
            /// </param>
            /// <returns type="Number" locid="WinJS.Utilities.getContentWidth_returnValue">
            /// The content width of the element.
            /// </returns>
            /// </signature>
            var border = getDimension(element, "borderLeftWidth") + getDimension(element, "borderRightWidth"),
                padding = getDimension(element, "paddingLeft") + getDimension(element, "paddingRight");
            return element.offsetWidth - border - padding;
        },
        _getPreciseContentWidth: function (element) {
            var border = _getPreciseDimension(element, "borderLeftWidth") + _getPreciseDimension(element, "borderRightWidth"),
                padding = _getPreciseDimension(element, "paddingLeft") + _getPreciseDimension(element, "paddingRight");
            return element.offsetWidth - border - padding;
        },

        getTotalWidth: function (element) {
            /// <signature helpKeyword="WinJS.Utilities.getTotalWidth">
            /// <summary locid="WinJS.Utilities.getTotalWidth">
            /// Gets the width of the element, including margins.
            /// </summary>
            /// <param name="element" type="HTMLElement" locid="WinJS.Utilities.getTotalWidth_p:element">
            /// The element.
            /// </param>
            /// <returns type="Number" locid="WinJS.Utilities.getTotalWidth_returnValue">
            /// The width of the element including margins.
            /// </returns>
            /// </signature>
            var margin = getDimension(element, "marginLeft") + getDimension(element, "marginRight");
            return element.offsetWidth + margin;
        },
        _getPreciseTotalWidth: function (element) {
            var margin = _getPreciseDimension(element, "marginLeft") + _getPreciseDimension(element, "marginRight");
            return element.offsetWidth + margin;
        },

        getContentHeight: function (element) {
            /// <signature helpKeyword="WinJS.Utilities.getContentHeight">
            /// <summary locid="WinJS.Utilities.getContentHeight">
            /// Gets the height of the content of the specified element. The content height does not include borders or padding.
            /// </summary>
            /// <param name="element" type="HTMLElement" locid="WinJS.Utilities.getContentHeight_p:element">
            /// The element.
            /// </param>
            /// <returns type="Number" integer="true" locid="WinJS.Utilities.getContentHeight_returnValue">
            /// The content height of the element.
            /// </returns>
            /// </signature>
            var border = getDimension(element, "borderTopWidth") + getDimension(element, "borderBottomWidth"),
                padding = getDimension(element, "paddingTop") + getDimension(element, "paddingBottom");
            return element.offsetHeight - border - padding;
        },
        _getPreciseContentHeight: function (element) {
            var border = _getPreciseDimension(element, "borderTopWidth") + _getPreciseDimension(element, "borderBottomWidth"),
                padding = _getPreciseDimension(element, "paddingTop") + _getPreciseDimension(element, "paddingBottom");
            return element.offsetHeight - border - padding;
        },

        getTotalHeight: function (element) {
            /// <signature helpKeyword="WinJS.Utilities.getTotalHeight">
            /// <summary locid="WinJS.Utilities.getTotalHeight">
            /// Gets the height of the element, including its margins.
            /// </summary>
            /// <param name="element" type="HTMLElement" locid="WinJS.Utilities.getTotalHeight_p:element">
            /// The element.
            /// </param>
            /// <returns type="Number" locid="WinJS.Utilities.getTotalHeight_returnValue">
            /// The height of the element including margins.
            /// </returns>
            /// </signature>
            var margin = getDimension(element, "marginTop") + getDimension(element, "marginBottom");
            return element.offsetHeight + margin;
        },
        _getPreciseTotalHeight: function (element) {
            var margin = _getPreciseDimension(element, "marginTop") + _getPreciseDimension(element, "marginBottom");
            return element.offsetHeight + margin;
        },

        getPosition: function (element) {
            /// <signature helpKeyword="WinJS.Utilities.getPosition">
            /// <summary locid="WinJS.Utilities.getPosition">
            /// Gets the position of the specified element.
            /// </summary>
            /// <param name="element" type="HTMLElement" locid="WinJS.Utilities.getPosition_p:element">
            /// The element.
            /// </param>
            /// <returns type="Object" locid="WinJS.Utilities.getPosition_returnValue">
            /// An object that contains the left, top, width and height properties of the element.
            /// </returns>
            /// </signature>
            return exports._getPositionRelativeTo(element, null);
        },

        getTabIndex: function (element) {
            /// <signature helpKeyword="WinJS.Utilities.getTabIndex">
            /// <summary locid="WinJS.Utilities.getTabIndex">
            /// Gets the tabIndex of the specified element.
            /// </summary>
            /// <param name="element" type="HTMLElement" locid="WinJS.Utilities.getTabIndex_p:element">
            /// The element.
            /// </param>
            /// <returns type="Number" locid="WinJS.Utilities.getTabIndex_returnValue">
            /// The tabIndex of the element. Returns -1 if the element cannot be tabbed to
            /// </returns>
            /// </signature>
            // For reference: http://www.w3.org/html/wg/drafts/html/master/single-page.html#specially-focusable
            var tabbableElementsRE = /BUTTON|COMMAND|MENUITEM|OBJECT|SELECT|TEXTAREA/;
            if (element.disabled) {
                return -1;
            }
            var tabIndex = element.getAttribute("tabindex");
            if (tabIndex === null || tabIndex === undefined) {
                var name = element.tagName;
                if (tabbableElementsRE.test(name) ||
                    (element.href && (name === "A" || name === "AREA" || name === "LINK")) ||
                    (name === "INPUT" && element.type !== "hidden") ||
                    (name === "TH" && element.sorted)) {
                    return 0;
                }
                return -1;
            }
            return parseInt(tabIndex, 10);
        },

        convertToPixels: convertToPixels,
        _convertToPrecisePixels: _convertToPrecisePixels,
        _getPreciseMargins: _getPreciseMargins,


        eventWithinElement: function (element, event) {
            /// <signature helpKeyword="WinJS.Utilities.eventWithinElement">
            /// <summary locid="WinJS.Utilities.eventWithinElement">
            /// Determines whether the specified event occurred within the specified element.
            /// </summary>
            /// <param name="element" type="HTMLElement" locid="WinJS.Utilities.eventWithinElement_p:element">
            /// The element.
            /// </param>
            /// <param name="event" type="Event" locid="WinJS.Utilities.eventWithinElement_p:event">
            /// The event.
            /// </param>
            /// <returns type="Boolean" locid="WinJS.Utilities.eventWithinElement_returnValue">
            /// true if the event occurred within the element; otherwise, false.
            /// </returns>
            /// </signature>
            var related = event.relatedTarget;
            if (related && related !== element) {
                return element.contains(related);
            }

            return false;
        },

        //UI Utilities
        _deprecated: function (message) {
            _Global.console && _Global.console.warn(message);
        },

        // Take a renderer which may be a function (signature: (data) => element) or a WinJS.Binding.Template
        //  and return a function with a unified synchronous contract which is:
        //
        //  (data, container) => element
        //
        // Where:
        //
        //  1) if you pass container the content will be rendered into the container and the
        //     container will be returned.
        //
        //  2) if you don't pass a container the content will be rendered and returned.
        //
        _syncRenderer: function (renderer, tagName) {
            tagName = tagName || "div";
            if (typeof renderer === "function") {
                return function (data, container) {
                    if (container) {
                        container.appendChild(renderer(data));
                        return container;
                    } else {
                        return renderer(data);
                    }
                };
            }

            var template;
            if (typeof renderer.render === "function") {
                template = renderer;
            } else if (renderer.winControl && typeof renderer.winControl.render === "function") {
                template = renderer.winControl;
            }

            return function (data, container) {
                var host = container || _Global.document.createElement(tagName);
                template.render(data, host);
                if (container) {
                    return container;
                } else {
                    // The expectation is that the creation of the DOM elements happens synchronously
                    //  and as such we steal the first child and make it the root element.
                    //
                    var element = host.firstElementChild;

                    // Because we have changed the "root" we may need to move the dispose method
                    //  created by the template to the child and do a little switcheroo on dispose.
                    //
                    if (element && host.dispose) {
                        var prev = element.dispose;
                        element.dispose = function () {
                            element.dispose = prev;
                            host.appendChild(element);
                            host.dispose();
                        };
                    }
                    return element;
                }
            };
        },

        _getPositionRelativeTo: function Utilities_getPositionRelativeTo(element, ancestor) {
            var fromElement = element,
                offsetParent = element.offsetParent,
                top = element.offsetTop,
                left = element.offsetLeft;

            while ((element = element.parentNode) &&
                    element !== ancestor &&
                    element !== _Global.document.body &&
                    element !== _Global.document.documentElement) {
                top -= element.scrollTop;
                var dir = _getComputedStyle(element, null).direction;
                left -= dir !== "rtl" ? element.scrollLeft : -getAdjustedScrollPosition(element).scrollLeft;

                if (element === offsetParent) {
                    top += element.offsetTop;
                    left += element.offsetLeft;
                    offsetParent = element.offsetParent;
                }
            }

            return {
                left: left,
                top: top,
                width: fromElement.offsetWidth,
                height: fromElement.offsetHeight
            };
        },

        // *element* is not included in the tabIndex search
        _getHighAndLowTabIndices: function Utilities_getHighAndLowTabIndices(element) {
            var descendants = element.getElementsByTagName("*");
            var lowestTabIndex = 0;
            var highestTabIndex = 0;
            // tabIndex=0 is the highest (considered higher than positive tab indices) so
            // we can stop searching for a higher tab index once we find tabIndex=0.
            var foundTabIndex0 = false;
            for (var i = 0, len = descendants.length; i < len; i++) {
                var tabIndexStr = descendants[i].getAttribute("tabIndex");
                if (tabIndexStr !== null && tabIndexStr !== undefined) {
                    var tabIndex = parseInt(tabIndexStr, 10);
                    // Update lowest
                    if (tabIndex > 0 && (tabIndex < lowestTabIndex || lowestTabIndex === 0)) {
                        lowestTabIndex = tabIndex;
                    }
                    // Update highest
                    if (!foundTabIndex0) {
                        if (tabIndex === 0) {
                            foundTabIndex0 = true;
                            highestTabIndex = 0;
                        } else if (tabIndex > highestTabIndex) {
                            highestTabIndex = tabIndex;
                        }
                    }
                }
            }

            return {
                highest: highestTabIndex,
                lowest: lowestTabIndex
            };
        },

        _getLowestTabIndexInList: function Utilities_getLowestTabIndexInList(elements) {
            // Returns the lowest positive tabIndex in a list of elements.
            // Returns 0 if there are no positive tabIndices.
            var lowestTabIndex = 0;
            var elmTabIndex;
            for (var i = 0; i < elements.length; i++) {
                elmTabIndex = parseInt(elements[i].getAttribute("tabIndex"), 10);
                if ((0 < elmTabIndex)
                 && ((elmTabIndex < lowestTabIndex) || !lowestTabIndex)) {
                    lowestTabIndex = elmTabIndex;
                }
            }

            return lowestTabIndex;
        },

        _getHighestTabIndexInList: function Utilities_getHighestTabIndexInList(elements) {
            // Returns 0 if any element is explicitly set to 0. (0 is the highest tabIndex)
            // Returns the highest tabIndex in the list of elements.
            // Returns 0 if there are no positive tabIndices.
            var highestTabIndex = 0;
            var elmTabIndex;
            for (var i = 0; i < elements.length; i++) {
                elmTabIndex = parseInt(elements[i].getAttribute("tabIndex"), 10);
                if (elmTabIndex === 0) {
                    return elmTabIndex;
                } else if (highestTabIndex < elmTabIndex) {
                    highestTabIndex = elmTabIndex;
                }
            }

            return highestTabIndex;
        },

        _hasCursorKeysBehaviors: function Utilities_hasCursorKeysBehaviors(element) {
            if (element.tagName === "SELECT" ||
                element.tagName === "TEXTAREA") {
                return true;
            }
            if (element.tagName === "INPUT") {
                return element.type === "" ||
                    element.type === "date" ||
                    element.type === "datetime" ||
                    element.type === "datetime-local" ||
                    element.type === "email" ||
                    element.type === "month" ||
                    element.type === "number" ||
                    element.type === "password" ||
                    element.type === "range" ||
                    element.type === "search" ||
                    element.type === "tel" ||
                    element.type === "text" ||
                    element.type === "time" ||
                    element.type === "url" ||
                    element.type === "week";
            }
            return false;
        },

        _reparentChildren: function (originalParent, destinationParent) {
            var child = originalParent.firstChild;
            while (child) {
                var sibling = child.nextSibling;
                destinationParent.appendChild(child);
                child = sibling;
            }
        },

        // Ensures that the same element has focus before and after *callback* is
        // called. Useful if moving focus is an unintentional side effect of *callback*.
        // For example, this could happen if *callback* removes and reinserts elements
        // to the DOM.
        _maintainFocus: function ElementUtilities_maintainFocus(callback) {
            var focusedElement = _Global.document.activeElement;
            callback();
            exports._trySetActiveOnAnyElement(focusedElement);
        },

        // Tries to give focus to an element (even if its tabIndex is -1) via setActive.
        _trySetActiveOnAnyElement: function Utilities_trySetActiveOnAnyElement(element, scroller) {
            return exports._tryFocusOnAnyElement(element, true, scroller);
        },

        // Tries to give focus to an element (even if its tabIndex is -1).
        _tryFocusOnAnyElement: function Utilities_tryFocusOnAnyElement(element, useSetActive, scroller) {
            var previousActiveElement = _Global.document.activeElement;

            if (element === previousActiveElement) {
                return true;
            }

            if (useSetActive) {
                exports._setActive(element, scroller);
            } else {
                element.focus();
            }

            return previousActiveElement !== _Global.document.activeElement;
        },

        // Tries to give focus to an element which is a tabstop (i.e. tabIndex >= 0)
        // via setActive.
        _trySetActive: function Utilities_trySetActive(elem, scroller) {
            return this._tryFocus(elem, true, scroller);
        },

        // Tries to give focus to an element which is a tabstop (i.e. tabIndex >= 0).
        _tryFocus: function Utilities_tryFocus(elem, useSetActive, scroller) {
            var previousActiveElement = _Global.document.activeElement;

            if (elem === previousActiveElement) {
                return true;
            }

            var simpleLogicForValidTabStop = (exports.getTabIndex(elem) >= 0);
            if (!simpleLogicForValidTabStop) {
                return false;
            }

            if (useSetActive) {
                exports._setActive(elem, scroller);
            } else {
                elem.focus();
            }

            if (previousActiveElement !== _Global.document.activeElement) {
                return true;
            }
            return false;
        },

        _setActiveFirstFocusableElement: function Utilities_setActiveFirstFocusableElement(rootEl, scroller) {
            return this._focusFirstFocusableElement(rootEl, true, scroller);
        },

        _focusFirstFocusableElement: function Utilities_focusFirstFocusableElement(rootEl, useSetActive, scroller) {
            var _elms = rootEl.getElementsByTagName("*");

            // Get the tabIndex set to the firstDiv (which is the lowest)
            var _lowestTabIndex = this._getLowestTabIndexInList(_elms);
            var _nextLowestTabIndex = 0;

            // If there are positive tabIndices, set focus to the element with the lowest tabIndex.
            // Keep trying with the next lowest tabIndex until all tabIndices have been exhausted.
            // Otherwise set focus to the first focusable element in DOM order.
            var i;
            while (_lowestTabIndex) {
                for (i = 0; i < _elms.length; i++) {
                    if (_elms[i].tabIndex === _lowestTabIndex) {
                        if (this._tryFocus(_elms[i], useSetActive, scroller)) {
                            return true;
                        }
                    } else if ((_lowestTabIndex < _elms[i].tabIndex)
                            && ((_elms[i].tabIndex < _nextLowestTabIndex) || (_nextLowestTabIndex === 0))) {
                        // Here if _lowestTabIndex < _elms[i].tabIndex < _nextLowestTabIndex
                        _nextLowestTabIndex = _elms[i].tabIndex;
                    }
                }

                // We weren't able to set focus to anything at that tabIndex
                // If we found a higher valid tabIndex, try that now
                _lowestTabIndex = _nextLowestTabIndex;
                _nextLowestTabIndex = 0;
            }

            // Wasn't able to set focus to anything with a positive tabIndex, try everything now.
            // This is where things with tabIndex of 0 will be tried.
            for (i = 0; i < _elms.length; i++) {
                if (this._tryFocus(_elms[i], useSetActive, scroller)) {
                    return true;
                }
            }

            return false;
        },

        _setActiveLastFocusableElement: function Utilities_setActiveLastFocusableElement(rootEl, scroller) {
            return this._focusLastFocusableElement(rootEl, true, scroller);
        },

        _focusLastFocusableElement: function Utilities_focusLastFocusableElement(rootEl, useSetActive, scroller) {
            var _elms = rootEl.getElementsByTagName("*");
            // Get the tabIndex set to the finalDiv (which is the highest)
            var _highestTabIndex = this._getHighestTabIndexInList(_elms);
            var _nextHighestTabIndex = 0;

            // Try all tabIndex 0 first. After this conditional the _highestTabIndex
            // should be equal to the highest positive tabIndex.
            var i;
            if (_highestTabIndex === 0) {
                for (i = _elms.length - 1; i >= 0; i--) {
                    if (_elms[i].tabIndex === _highestTabIndex) {
                        if (this._tryFocus(_elms[i], useSetActive, scroller)) {
                            return true;
                        }
                    } else if (_nextHighestTabIndex < _elms[i].tabIndex) {
                        _nextHighestTabIndex = _elms[i].tabIndex;
                    }
                }

                _highestTabIndex = _nextHighestTabIndex;
                _nextHighestTabIndex = 0;
            }

            // If there are positive tabIndices, set focus to the element with the highest tabIndex.
            // Keep trying with the next highest tabIndex until all tabIndices have been exhausted.
            // Otherwise set focus to the last focusable element in DOM order.
            while (_highestTabIndex) {
                for (i = _elms.length - 1; i >= 0; i--) {
                    if (_elms[i].tabIndex === _highestTabIndex) {
                        if (this._tryFocus(_elms[i], useSetActive, scroller)) {
                            return true;
                        }
                    } else if ((_nextHighestTabIndex < _elms[i].tabIndex) && (_elms[i].tabIndex < _highestTabIndex)) {
                        // Here if _nextHighestTabIndex < _elms[i].tabIndex < _highestTabIndex
                        _nextHighestTabIndex = _elms[i].tabIndex;
                    }
                }

                // We weren't able to set focus to anything at that tabIndex
                // If we found a lower valid tabIndex, try that now
                _highestTabIndex = _nextHighestTabIndex;
                _nextHighestTabIndex = 0;
            }

            // Wasn't able to set focus to anything with a tabIndex, try everything now
            for (i = _elms.length - 2; i > 0; i--) {
                if (this._tryFocus(_elms[i], useSetActive, scroller)) {
                    return true;
                }
            }

            return false;
        }
    });
});
