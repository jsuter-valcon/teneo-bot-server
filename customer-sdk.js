(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.CustomerSDK = {}));
}(this, (function (exports) { 'use strict';

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

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

  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];

    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }

    return (hint === "string" ? String : Number)(input);
  }

  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");

    return typeof key === "symbol" ? key : String(key);
  }

  var testKey = '__test_storage_support__';
  var testValue = '@@test';

  var testStorageSupport = function testStorageSupport(type) {
    if (type === void 0) {
      type = 'local';
    }

    try {
      var storage = type === 'session' ? window.sessionStorage : window.localStorage;
      storage.setItem(testKey, testValue);

      if (storage.getItem(testKey) !== testValue) {
        return false;
      }

      storage.removeItem(testKey);
      return true;
    } catch (err) {
      return false;
    }
  };

  var createStorage = function createStorage() {
    var memoryStorage = Object.create(null);
    return {
      getItem: function getItem(key) {
        var value = memoryStorage[key];
        return typeof value === 'string' ? value : null;
      },
      setItem: function setItem(key, value) {
        memoryStorage[key] = value;
      },
      removeItem: function removeItem(key) {
        delete memoryStorage[key];
      },
      clear: function clear() {
        memoryStorage = Object.create(null);
      }
    };
  };

  var index = /*#__PURE__*/createStorage();

  var usedStorage = testStorageSupport() ? window.localStorage : index;
  var storage = {
    setItem: function setItem(key, value) {
      return new Promise(function (resolve) {
        return resolve(usedStorage.setItem(key, value));
      });
    },
    getItem: function getItem(key) {
      return new Promise(function (resolve) {
        return resolve(usedStorage.getItem(key));
      });
    },
    removeItem: function removeItem(key) {
      return new Promise(function (resolve) {
        return resolve(usedStorage.removeItem(key));
      });
    }
  };

  var _ref = {},
      hasOwnProperty = _ref.hasOwnProperty;
  function hasOwn(prop, obj) {
    return hasOwnProperty.call(obj, prop);
  }

  function flatMap(iteratee, arr) {
    var _ref;

    return (_ref = []).concat.apply(_ref, arr.map(iteratee));
  }

  var isArray = Array.isArray;

  function isObject(obj) {
    return typeof obj === 'object' && obj !== null && !isArray(obj);
  }

  function mapValues(mapper, obj) {
    return Object.keys(obj).reduce(function (acc, key) {
      acc[key] = mapper(obj[key]);
      return acc;
    }, {});
  }

  function identity(value) {
    return value;
  }

  function generateRandomId() {
    return Math.random().toString(36).substring(2);
  }

  function generateUniqueId(map) {
    var id = generateRandomId();
    return hasOwn(id, map) ? generateUniqueId(map) : id;
  }

  // based on https://github.com/developit/dlv/blob/d7ec976d12665f1c25dec2acf955dfc2e8757a9c/index.js
  function get(propPath, obj) {
    var arrPath = typeof propPath === 'string' ? propPath.split('.') : propPath;
    var pathPartIndex = 0;
    var result = obj;

    while (result && pathPartIndex < arrPath.length) {
      result = result[arrPath[pathPartIndex++]];
    }

    return result;
  }

  function includes(value, arrOrStr) {
    return arrOrStr.indexOf(value) !== -1;
  }

  function isEmpty(collection) {
    return (isArray(collection) ? collection : Object.keys(collection)).length === 0;
  }

  function keyBy(prop, arr) {
    return arr.reduce(function (acc, el) {
      acc[el[prop]] = el;
      return acc;
    }, {});
  }

  // TODO: this  should return `T | undefined` to match native behavior
  function last(arr) {
    return arr.length > 0 ? arr[arr.length - 1] : null;
  }

  function noop() {}

  function values(obj) {
    return Object.keys(obj).map(function (key) {
      return obj[key];
    });
  }

  function numericSortBy(propOrMapper, collection) {
    var mapper = typeof propOrMapper === 'function' ? propOrMapper : function (element) {
      return get(propOrMapper, element);
    };
    return (isArray(collection) ? [].concat(collection) : values(collection)).sort(function (elementA, elementB) {
      return mapper(elementA) - mapper(elementB);
    });
  }

  function pick(props, obj) {
    return props.reduce(function (acc, prop) {
      acc[prop] = obj[prop];
      return acc;
    }, {});
  }

  function pickOwn(props, obj) {
    return props.reduce(function (acc, prop) {
      if (hasOwn(prop, obj)) {
        acc[prop] = obj[prop];
      }

      return acc;
    }, {});
  }

  var toPairs = function toPairs(obj) {
    return Object.keys(obj).map(function (key) {
      return [key, obj[key]];
    });
  };

  var stringCompare = function stringCompare(strA, strB) {
    if (strA === strB) {
      return 0;
    }

    return strA < strB ? -1 : 1;
  };

  function uniqBy(iteratee, arr) {
    // with polyfills this could be just: return Array.from(new Set(arr.map(iteratee)))
    var seen = [];
    return arr.filter(function (element) {
      var key = iteratee(element);

      if (seen.indexOf(key) === -1) {
        seen.push(key);
        return true;
      }

      return false;
    });
  }

  function getRoot() {
    return new Promise(function (resolve) {
      var next = function next() {
        if (!document.body) {
          setTimeout(next, 100);
          return;
        }

        resolve(document.body);
      };

      next();
    });
  }

  function removeNode(node) {
    var parentNode = node.parentNode;

    if (parentNode) {
      parentNode.removeChild(node);
    }
  }

  var buildQueryString = function buildQueryString(obj) {
    return toPairs(obj).map(function (pair) {
      return pair.map(encodeURIComponent).join('=');
    }).join('&');
  };

  var originRegexp = /[^:]+:\/\/[^(/|?)\s]+/;

  var getOrigin = function getOrigin(url) {
    var domain = url.match(originRegexp);
    return domain && domain[0];
  };

  // URL can contain leading C0 control or \u0020 SPACE,
  // and any newline or tab are filtered out as if they're not part of the URL.
  // https://url.spec.whatwg.org/#url-parsing
  // Tab or newline are defined as \r\n\t:
  // https://infra.spec.whatwg.org/#ascii-tab-or-newline
  // A C0 control is a code point in the range \u0000 NULL to \u001F
  // INFORMATION SEPARATOR ONE, inclusive:
  // https://infra.spec.whatwg.org/#c0-control-or-space
  var intersperseWithTabOrNewline = function intersperseWithTabOrNewline(str) {
    return str.replace(/\w/g, '$&[\\r\\n\\t]*');
  };

  var unsafeProtocol = new RegExp("^[\0-\x1F]*(" + intersperseWithTabOrNewline('javascript') + "|" + intersperseWithTabOrNewline('data') + "):", 'i'); // would be better to filter safe things

  // this is the same as "https://accounts.livechatinc.com"
  // it's hardcoded here because chat.io has its own ACCOUNTS_URL
  // but this variable has to have the same value for both LiveChat and chat.io
  var POST_MESSAGE_ORIGIN = 'https://accounts.livechatinc.com'; // as const

  var CUSTOMER_AUTH_FOOTPRINT = '@livechat/customer-auth'; // as const

  var ACCOUNTS_URL = "https://accounts.livechatinc.com";

  var buildParams = function buildParams(_ref, redirectUri) {
    var clientId = _ref.clientId,
        licenseId = _ref.licenseId;
    return {
      license_id: String(licenseId),
      flow: 'button',
      response_type: 'token',
      client_id: clientId,
      redirect_uri: redirectUri,
      post_message_uri: redirectUri,
      state: CUSTOMER_AUTH_FOOTPRINT
    };
  };

  var buildPath = function buildPath(_ref2) {
    var uniqueGroups = _ref2.uniqueGroups,
        licenseId = _ref2.licenseId,
        groupId = _ref2.groupId;
    return (uniqueGroups ? "/licence/g" + licenseId + "_" + groupId : '') + "/customer";
  };

  var buildSrc = function buildSrc(config, redirectUri, env) {
    var url = env === 'production' ? ACCOUNTS_URL : ACCOUNTS_URL.replace('accounts.', "accounts." + env + ".");
    var path = buildPath(config);
    var query = buildQueryString(buildParams(config, redirectUri));
    return "" + url + path + "?" + query;
  };

  var createError = function createError(_ref) {
    var code = _ref.code,
        message = _ref.message;
    var err = new Error(message);
    err.code = code;
    return err;
  };

  var parseTokenResponse = function parseTokenResponse(token, licenseId) {
    if ('identity_exception' in token) {
      throw createError({
        code: 'SSO_IDENTITY_EXCEPTION',
        message: token.identity_exception
      });
    }

    if ('oauth_exception' in token) {
      throw createError({
        code: 'SSO_OAUTH_EXCEPTION',
        message: token.oauth_exception
      });
    }

    return {
      accessToken: token.access_token,
      entityId: token.entity_id,
      expiresIn: token.expires_in * 1000,
      tokenType: token.token_type,
      creationDate: Date.now(),
      licenseId: licenseId
    };
  };

  var getPostMessageOrigin = function getPostMessageOrigin(env) {
    return env === 'production' ? POST_MESSAGE_ORIGIN : POST_MESSAGE_ORIGIN.replace('accounts.', "accounts." + env + ".");
  };

  var buildIframe = function buildIframe(config, env) {
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.setAttribute('src', buildSrc(config, getOrigin(String(window.location)) + window.location.pathname, env));
    return iframe;
  };

  var isTokenResponse = function isTokenResponse(data) {
    return data && data.state === CUSTOMER_AUTH_FOOTPRINT;
  };

  var fetchToken = function fetchToken(config, env) {
    var licenseId = config.licenseId;
    var postMessageOrigin = getPostMessageOrigin(env);
    return new Promise(function (resolve, reject) {
      var iframe = buildIframe(config, env);

      var cleanup = function cleanup() {
        removeNode(iframe); // eslint-disable-next-line no-use-before-define

        window.removeEventListener('message', listener, false);
      };

      var timeoutId = setTimeout(function () {
        cleanup();
        reject(createError({
          message: 'Request timed out.',
          code: 'REQUEST_TIMEOUT'
        }));
      }, 15 * 1000);

      var listener = function listener(_ref) {
        var origin = _ref.origin,
            data = _ref.data;

        if (origin !== postMessageOrigin) {
          return;
        }

        if (!isTokenResponse(data)) {
          return;
        }

        clearTimeout(timeoutId);
        cleanup();

        try {
          resolve(parseTokenResponse(data, licenseId));
        } catch (err) {
          reject(err);
        }
      };

      window.addEventListener('message', listener, false);
      getRoot().then(function (body) {
        body.appendChild(iframe);
      });
    });
  };

  var validateConfig = function validateConfig(_ref) {
    var licenseId = _ref.licenseId,
        clientId = _ref.clientId;

    if (typeof licenseId !== 'number' || typeof clientId !== 'string') {
      throw new Error('You need to pass valid configuration object: { licenseId, clientId }.');
    }
  };

  var isExpiredToken = function isExpiredToken(_ref) {
    var creationDate = _ref.creationDate,
        expiresIn = _ref.expiresIn;
    return Date.now() >= creationDate + expiresIn;
  };

  var createAuth = function createAuth(config, env) {
    validateConfig(config);
    var cacheKey = "" + "@@lc_auth_token:" + config.licenseId + (config.uniqueGroups ? ":" + config.groupId : '');
    var pendingTokenRequest = null;
    var cachedToken = null;
    var retrievingToken = storage.getItem(cacheKey).then(function (token) {
      if (retrievingToken === null) {
        return;
      }

      retrievingToken = null;

      if (!token) {
        return;
      }

      cachedToken = JSON.parse(token);
    });

    var getFreshToken = function getFreshToken() {
      pendingTokenRequest = fetchToken(config, env).then(function (token) {
        pendingTokenRequest = null;
        storage.setItem(cacheKey, JSON.stringify(token));
        cachedToken = token;
        return token;
      }, function (err) {
        pendingTokenRequest = null;
        throw err;
      });
      return pendingTokenRequest;
    };

    var getToken = function getToken() {
      if (pendingTokenRequest) {
        return pendingTokenRequest;
      }

      if (cachedToken && !isExpiredToken(cachedToken)) {
        return Promise.resolve(cachedToken);
      }

      if (retrievingToken) {
        return retrievingToken.then(getToken);
      }

      return getFreshToken();
    };

    var hasToken = function hasToken() {
      if (retrievingToken) {
        return retrievingToken.then(hasToken);
      }

      return Promise.resolve(!!cachedToken);
    };

    var invalidate = function invalidate() {
      cachedToken = null;
      retrievingToken = null;
      return storage.removeItem(cacheKey);
    };

    return {
      getFreshToken: getFreshToken,
      getToken: getToken,
      hasToken: hasToken,
      invalidate: invalidate
    };
  };

  //      
  // An event handler can take an optional event argument
  // and should not return a value
  // An array of all currently registered event handlers for a type
  // A map of event types and their corresponding event handlers.

  /** Mitt: Tiny (~200b) functional event emitter / pubsub.
   *  @name mitt
   *  @returns {Mitt}
   */
  function mitt(all) {
    all = all || Object.create(null);
    return {
      /**
       * Register an event handler for the given type.
       *
       * @param  {String} type	Type of event to listen for, or `"*"` for all events
       * @param  {Function} handler Function to call in response to given event
       * @memberOf mitt
       */
      on: function on(type, handler) {
        (all[type] || (all[type] = [])).push(handler);
      },

      /**
       * Remove an event handler for the given type.
       *
       * @param  {String} type	Type of event to unregister `handler` from, or `"*"`
       * @param  {Function} handler Handler function to remove
       * @memberOf mitt
       */
      off: function off(type, handler) {
        if (all[type]) {
          all[type].splice(all[type].indexOf(handler) >>> 0, 1);
        }
      },

      /**
       * Invoke all handlers for the given type.
       * If present, `"*"` handlers are invoked after type-matched handlers.
       *
       * @param {String} type  The event type to invoke
       * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
       * @memberOf mitt
       */
      emit: function emit(type, evt) {
        (all[type] || []).slice().map(function (handler) {
          handler(evt);
        });
        (all['*'] || []).slice().map(function (handler) {
          handler(type, evt);
        });
      }
    };
  }

  var mitt$1 = mitt;

  // Our wrapper over `mitt` starts here
  var createMitt = function createMitt() {
    var eventsMap = Object.create(null);
    var instance = mitt$1(eventsMap);

    var off = function off(type, handler) {
      if (!type) {
        Object.keys(eventsMap).forEach(function (key) {
          delete eventsMap[key];
        });
        return;
      }

      instance.off(type, handler);
    };

    var once = function once(type, handler) {
      // for '*' type handler is invoked with 2 arguments - type, evt
      instance.on(type, function onceHandler(data, maybeSecondArg) {
        instance.off(type, onceHandler);
        handler(data, maybeSecondArg);
      });
    };

    return _extends({}, instance, {
      off: off,
      once: once
    });
  };

  var CHANGE_REGION = 'change_region';
  var CHECK_GOALS = 'check_goals';
  var DESTROY = 'destroy';
  var FAIL_ALL_REQUESTS = 'fail_all_requests';
  var LOGIN_SUCCESS = 'login_success';
  var PAUSE_CONNECTION = 'pause_connection';
  var PREFETCH_TOKEN = 'prefetch_token';
  var PUSH_RECEIVED = 'push_received';
  var PUSH_RESPONSE_RECEIVED = 'push_response_received';
  var RECONNECT = 'reconnect';
  var REQUEST_FAILED = 'request_failed';
  var RESPONSE_RECEIVED = 'response_received';
  var SEND_REQUEST = 'send_request';
  var SET_CHAT_ACTIVE = 'set_chat_active';
  var SET_SELF_ID = 'set_self_id';
  var SOCKET_CONNECTED = 'socket_connected';
  var SOCKET_DISCONNECTED = 'socket_disconnected';
  var SOCKET_RECOVERED = 'socket_recovered';
  var SOCKET_UNSTABLE = 'socket_unstable';
  var START_CONNECTION = 'start_connection';
  var UPDATE_CUSTOMER_PAGE = 'update_customer_page';

  var CONNECTION_LOST = 'CONNECTION_LOST';
  var IDENTITY_MISMATCH = 'IDENTITY_MISMATCH';
  var MISDIRECTED_CONNECTION = 'MISDIRECTED_CONNECTION';
  var MISSING_CHAT_THREAD = 'MISSING_CHAT_THREAD';
  var NO_CONNECTION = 'NO_CONNECTION';
  var REQUEST_TIMEOUT = 'REQUEST_TIMEOUT';
  var SDK_DESTROYED = 'SDK_DESTROYED';
  var SERVICE_TEMPORARILY_UNAVAILABLE = 'SERVICE_TEMPORARILY_UNAVAILABLE';
  var TOO_BIG_FILE = 'TOO_BIG_FILE';

  var ACCEPT_GREETING = 'accept_greeting';
  var CANCEL_GREETING = 'cancel_greeting';
  var CHECK_GOALS$1 = 'check_goals';
  var DEACTIVATE_CHAT = 'deactivate_chat';
  var DELETE_CHAT_PROPERTIES = 'delete_chat_properties';
  var DELETE_EVENT_PROPERTIES = 'delete_event_properties';
  var DELETE_THREAD_PROPERTIES = 'delete_thread_properties';
  var GET_CHAT = 'get_chat';
  var GET_CUSTOMER = 'get_customer';
  var GET_FORM = 'get_form';
  var GET_PREDICTED_AGENT = 'get_predicted_agent';
  var GET_URL_INFO = 'get_url_info';
  var LIST_CHATS = 'list_chats';
  var LIST_GROUP_STATUSES = 'list_group_statuses';
  var LIST_THREADS = 'list_threads';
  var LOGIN = 'login';
  var MARK_EVENTS_AS_SEEN = 'mark_events_as_seen';
  var RESUME_CHAT = 'resume_chat';
  var SEND_EVENT = 'send_event';
  var SEND_RICH_MESSAGE_POSTBACK = 'send_rich_message_postback';
  var SEND_SNEAK_PEEK = 'send_sneak_peek';
  var SET_CUSTOMER_SESSION_FIELDS = 'set_customer_session_fields';
  var START_CHAT = 'start_chat';
  var UPDATE_CHAT_PROPERTIES = 'update_chat_properties';
  var UPDATE_CUSTOMER = 'update_customer';
  var UPDATE_CUSTOMER_PAGE$1 = 'update_customer_page';
  var UPDATE_EVENT_PROPERTIES = 'update_event_properties';
  var UPDATE_THREAD_PROPERTIES = 'update_thread_properties';
  var UPLOAD_FILE = 'upload_file';

  function symbolObservablePonyfill(root) {
    var result;
    var Symbol = root.Symbol;

    if (typeof Symbol === 'function') {
      if (Symbol.observable) {
        result = Symbol.observable;
      } else {
        result = Symbol('observable');
        Symbol.observable = result;
      }
    } else {
      result = '@@observable';
    }

    return result;
  }

  /* global window */
  var root;

  if (typeof self !== 'undefined') {
    root = self;
  } else if (typeof window !== 'undefined') {
    root = window;
  } else if (typeof global !== 'undefined') {
    root = global;
  } else if (typeof module !== 'undefined') {
    root = module;
  } else {
    root = Function('return this')();
  }

  var result = symbolObservablePonyfill(root);

  /**
   * These are private action types reserved by Redux.
   * For any unknown actions, you must return the current state.
   * If the current state is undefined, you must return the initial state.
   * Do not reference these action types directly in your code.
   */

  var randomString = function randomString() {
    return Math.random().toString(36).substring(7).split('').join('.');
  };

  var ActionTypes = {
    INIT: "@@redux/INIT" + randomString(),
    REPLACE: "@@redux/REPLACE" + randomString(),
    PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
      return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
    }
  };
  /**
   * @param {any} obj The object to inspect.
   * @returns {boolean} True if the argument appears to be a plain object.
   */

  function isPlainObject(obj) {
    if (typeof obj !== 'object' || obj === null) return false;
    var proto = obj;

    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }

    return Object.getPrototypeOf(obj) === proto;
  }
  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [preloadedState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @param {Function} [enhancer] The store enhancer. You may optionally specify it
   * to enhance the store with third-party capabilities such as middleware,
   * time travel, persistence, etc. The only store enhancer that ships with Redux
   * is `applyMiddleware()`.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */


  function createStore(reducer, preloadedState, enhancer) {
    var _ref2;

    if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
      throw new Error('It looks like you are passing several store enhancers to ' + 'createStore(). This is not supported. Instead, compose them ' + 'together to a single function.');
    }

    if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
      enhancer = preloadedState;
      preloadedState = undefined;
    }

    if (typeof enhancer !== 'undefined') {
      if (typeof enhancer !== 'function') {
        throw new Error('Expected the enhancer to be a function.');
      }

      return enhancer(createStore)(reducer, preloadedState);
    }

    if (typeof reducer !== 'function') {
      throw new Error('Expected the reducer to be a function.');
    }

    var currentReducer = reducer;
    var currentState = preloadedState;
    var currentListeners = [];
    var nextListeners = currentListeners;
    var isDispatching = false;
    /**
     * This makes a shallow copy of currentListeners so we can use
     * nextListeners as a temporary list while dispatching.
     *
     * This prevents any bugs around consumers calling
     * subscribe/unsubscribe in the middle of a dispatch.
     */

    function ensureCanMutateNextListeners() {
      if (nextListeners === currentListeners) {
        nextListeners = currentListeners.slice();
      }
    }
    /**
     * Reads the state tree managed by the store.
     *
     * @returns {any} The current state tree of your application.
     */


    function getState() {
      if (isDispatching) {
        throw new Error('You may not call store.getState() while the reducer is executing. ' + 'The reducer has already received the state as an argument. ' + 'Pass it down from the top reducer instead of reading it from the store.');
      }

      return currentState;
    }
    /**
     * Adds a change listener. It will be called any time an action is dispatched,
     * and some part of the state tree may potentially have changed. You may then
     * call `getState()` to read the current state tree inside the callback.
     *
     * You may call `dispatch()` from a change listener, with the following
     * caveats:
     *
     * 1. The subscriptions are snapshotted just before every `dispatch()` call.
     * If you subscribe or unsubscribe while the listeners are being invoked, this
     * will not have any effect on the `dispatch()` that is currently in progress.
     * However, the next `dispatch()` call, whether nested or not, will use a more
     * recent snapshot of the subscription list.
     *
     * 2. The listener should not expect to see all state changes, as the state
     * might have been updated multiple times during a nested `dispatch()` before
     * the listener is called. It is, however, guaranteed that all subscribers
     * registered before the `dispatch()` started will be called with the latest
     * state by the time it exits.
     *
     * @param {Function} listener A callback to be invoked on every dispatch.
     * @returns {Function} A function to remove this change listener.
     */


    function subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new Error('Expected the listener to be a function.');
      }

      if (isDispatching) {
        throw new Error('You may not call store.subscribe() while the reducer is executing. ' + 'If you would like to be notified after the store has been updated, subscribe from a ' + 'component and invoke store.getState() in the callback to access the latest state. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
      }

      var isSubscribed = true;
      ensureCanMutateNextListeners();
      nextListeners.push(listener);
      return function unsubscribe() {
        if (!isSubscribed) {
          return;
        }

        if (isDispatching) {
          throw new Error('You may not unsubscribe from a store listener while the reducer is executing. ' + 'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.');
        }

        isSubscribed = false;
        ensureCanMutateNextListeners();
        var index = nextListeners.indexOf(listener);
        nextListeners.splice(index, 1);
      };
    }
    /**
     * Dispatches an action. It is the only way to trigger a state change.
     *
     * The `reducer` function, used to create the store, will be called with the
     * current state tree and the given `action`. Its return value will
     * be considered the **next** state of the tree, and the change listeners
     * will be notified.
     *
     * The base implementation only supports plain object actions. If you want to
     * dispatch a Promise, an Observable, a thunk, or something else, you need to
     * wrap your store creating function into the corresponding middleware. For
     * example, see the documentation for the `redux-thunk` package. Even the
     * middleware will eventually dispatch plain object actions using this method.
     *
     * @param {Object} action A plain object representing “what changed”. It is
     * a good idea to keep actions serializable so you can record and replay user
     * sessions, or use the time travelling `redux-devtools`. An action must have
     * a `type` property which may not be `undefined`. It is a good idea to use
     * string constants for action types.
     *
     * @returns {Object} For convenience, the same action object you dispatched.
     *
     * Note that, if you use a custom middleware, it may wrap `dispatch()` to
     * return something else (for example, a Promise you can await).
     */


    function dispatch(action) {
      if (!isPlainObject(action)) {
        throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
      }

      if (typeof action.type === 'undefined') {
        throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
      }

      if (isDispatching) {
        throw new Error('Reducers may not dispatch actions.');
      }

      try {
        isDispatching = true;
        currentState = currentReducer(currentState, action);
      } finally {
        isDispatching = false;
      }

      var listeners = currentListeners = nextListeners;

      for (var i = 0; i < listeners.length; i++) {
        var listener = listeners[i];
        listener();
      }

      return action;
    }
    /**
     * Replaces the reducer currently used by the store to calculate the state.
     *
     * You might need this if your app implements code splitting and you want to
     * load some of the reducers dynamically. You might also need this if you
     * implement a hot reloading mechanism for Redux.
     *
     * @param {Function} nextReducer The reducer for the store to use instead.
     * @returns {void}
     */


    function replaceReducer(nextReducer) {
      if (typeof nextReducer !== 'function') {
        throw new Error('Expected the nextReducer to be a function.');
      }

      currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
      // Any reducers that existed in both the new and old rootReducer
      // will receive the previous state. This effectively populates
      // the new state tree with any relevant data from the old one.

      dispatch({
        type: ActionTypes.REPLACE
      });
    }
    /**
     * Interoperability point for observable/reactive libraries.
     * @returns {observable} A minimal observable of state changes.
     * For more information, see the observable proposal:
     * https://github.com/tc39/proposal-observable
     */


    function observable() {
      var _ref;

      var outerSubscribe = subscribe;
      return _ref = {
        /**
         * The minimal observable subscription method.
         * @param {Object} observer Any object that can be used as an observer.
         * The observer object should have a `next` method.
         * @returns {subscription} An object with an `unsubscribe` method that can
         * be used to unsubscribe the observable from the store, and prevent further
         * emission of values from the observable.
         */
        subscribe: function subscribe(observer) {
          if (typeof observer !== 'object' || observer === null) {
            throw new TypeError('Expected the observer to be an object.');
          }

          function observeState() {
            if (observer.next) {
              observer.next(getState());
            }
          }

          observeState();
          var unsubscribe = outerSubscribe(observeState);
          return {
            unsubscribe: unsubscribe
          };
        }
      }, _ref[result] = function () {
        return this;
      }, _ref;
    } // When a store is created, an "INIT" action is dispatched so that every
    // reducer returns their initial state. This effectively populates
    // the initial state tree.


    dispatch({
      type: ActionTypes.INIT
    });
    return _ref2 = {
      dispatch: dispatch,
      subscribe: subscribe,
      getState: getState,
      replaceReducer: replaceReducer
    }, _ref2[result] = observable, _ref2;
  }
  /**
   * Prints a warning in the console if it exists.
   *
   * @param {String} message The warning message.
   * @returns {void}
   */


  function warning(message) {
    /* eslint-disable no-console */
    if (typeof console !== 'undefined' && typeof console.error === 'function') {
      console.error(message);
    }
    /* eslint-enable no-console */


    try {
      // This error was thrown as a convenience so that if you enable
      // "break on all exceptions" in your console,
      // it would pause the execution at this line.
      throw new Error(message);
    } catch (e) {} // eslint-disable-line no-empty

  }

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

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      keys.push.apply(keys, Object.getOwnPropertySymbols(object));
    }

    if (enumerableOnly) keys = keys.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(source, true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(source).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }
  /**
   * Composes single-argument functions from right to left. The rightmost
   * function can take multiple arguments as it provides the signature for
   * the resulting composite function.
   *
   * @param {...Function} funcs The functions to compose.
   * @returns {Function} A function obtained by composing the argument functions
   * from right to left. For example, compose(f, g, h) is identical to doing
   * (...args) => f(g(h(...args))).
   */


  function compose() {
    for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
      funcs[_key] = arguments[_key];
    }

    if (funcs.length === 0) {
      return function (arg) {
        return arg;
      };
    }

    if (funcs.length === 1) {
      return funcs[0];
    }

    return funcs.reduce(function (a, b) {
      return function () {
        return a(b.apply(void 0, arguments));
      };
    });
  }
  /**
   * Creates a store enhancer that applies middleware to the dispatch method
   * of the Redux store. This is handy for a variety of tasks, such as expressing
   * asynchronous actions in a concise manner, or logging every action payload.
   *
   * See `redux-thunk` package as an example of the Redux middleware.
   *
   * Because middleware is potentially asynchronous, this should be the first
   * store enhancer in the composition chain.
   *
   * Note that each middleware will be given the `dispatch` and `getState` functions
   * as named arguments.
   *
   * @param {...Function} middlewares The middleware chain to be applied.
   * @returns {Function} A store enhancer applying the middleware.
   */


  function applyMiddleware() {
    for (var _len = arguments.length, middlewares = new Array(_len), _key = 0; _key < _len; _key++) {
      middlewares[_key] = arguments[_key];
    }

    return function (createStore) {
      return function () {
        var store = createStore.apply(void 0, arguments);

        var _dispatch = function dispatch() {
          throw new Error('Dispatching while constructing your middleware is not allowed. ' + 'Other middleware would not be applied to this dispatch.');
        };

        var middlewareAPI = {
          getState: store.getState,
          dispatch: function dispatch() {
            return _dispatch.apply(void 0, arguments);
          }
        };
        var chain = middlewares.map(function (middleware) {
          return middleware(middlewareAPI);
        });
        _dispatch = compose.apply(void 0, chain)(store.dispatch);
        return _objectSpread2({}, store, {
          dispatch: _dispatch
        });
      };
    };
  }
  /*
   * This is a dummy function to check if the function name has been altered by minification.
   * If the function has been minified and NODE_ENV !== 'production', warn the user.
   */


  function isCrushed() {}

  if ( typeof isCrushed.name === 'string' && isCrushed.name !== 'isCrushed') {
    warning('You are currently using minified code outside of NODE_ENV === "production". ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or setting mode to production in webpack (https://webpack.js.org/concepts/mode/) ' + 'to ensure you have the correct code for your production build.');
  }

  var createSideEffectsMiddleware = function createSideEffectsMiddleware() {
    var handlers = [];

    var sideEffectsMiddleware = function sideEffectsMiddleware(store) {
      return function (next) {
        return function (action) {
          var result = next(action);
          handlers.forEach(function (handler) {
            handler(action, store);
          });
          return result;
        };
      };
    };

    sideEffectsMiddleware.add = function (handler) {
      handlers.push(handler);
    };

    return sideEffectsMiddleware;
  };

  function deferred() {
    var def = {};
    def.promise = new Promise(function (resolve, reject) {
      def.resolve = resolve;
      def.reject = reject;
    });
    return def;
  }

  var createReducer = function createReducer(initialState, reducersMap) {

    return function reducer(state, action) {
      if (state === void 0) {
        state = initialState;
      }

      if (hasOwn(action.type, reducersMap)) {
        return reducersMap[action.type](state, action.payload);
      }

      return state;
    };
  }; // TODO: this is the same as built-in redux's combineReducers, should be remobed

  var CONNECTED = 'connected';
  var DESTROYED = 'destroyed';
  var DISCONNECTED = 'disconnected';
  var PAUSED = 'paused';
  var RECONNECTING = 'reconnecting';

  var AGENT = 'agent';
  var CUSTOMER = 'customer';

  var getAllRequests = function getAllRequests(state) {
    return state.requests;
  };
  var getConnectionStatus = function getConnectionStatus(state) {
    return state.connection.status;
  };
  var getRequest = function getRequest(state, id) {
    return state.requests[id];
  };
  var getSelfId = function getSelfId(state) {
    return state.users.self.id;
  };
  var isChatActive = function isChatActive(state, chatId) {
    var chat = state.chats[chatId];
    return !!chat && chat.active;
  };
  var isConnected = function isConnected(state) {
    return getConnectionStatus(state) === CONNECTED;
  };
  var isDestroyed = function isDestroyed(state) {
    return getConnectionStatus(state) === DESTROYED;
  };

  var getEnvPart = function getEnvPart(_ref) {
    var licenseId = _ref.licenseId,
        env = _ref.env;

    if (licenseId === 1520) {
      return '.staging';
    }

    if (env === 'production') {
      return '';
    }

    return "." + env;
  };

  var getApiOrigin = function getApiOrigin(state) {
    var region = state.region;
    var regionPart = region ? "-" + region : '';
    return "https://api" + regionPart + getEnvPart(state) + ".livechatinc.com";
  };
  var getServerUrl = function getServerUrl(state) {
    return getApiOrigin(state) + "/v3.3/customer";
  };
  var createInitialState = function createInitialState(initialStateData) {
    var _initialStateData$app = initialStateData.application,
        application = _initialStateData$app === void 0 ? {} : _initialStateData$app,
        licenseId = initialStateData.licenseId,
        _initialStateData$gro = initialStateData.groupId,
        groupId = _initialStateData$gro === void 0 ? null : _initialStateData$gro,
        env = initialStateData.env,
        _initialStateData$pag = initialStateData.page,
        page = _initialStateData$pag === void 0 ? null : _initialStateData$pag,
        _initialStateData$reg = initialStateData.region,
        region = _initialStateData$reg === void 0 ? null : _initialStateData$reg,
        _initialStateData$ref = initialStateData.referrer,
        referrer = _initialStateData$ref === void 0 ? null : _initialStateData$ref,
        _initialStateData$uni = initialStateData.uniqueGroups,
        uniqueGroups = _initialStateData$uni === void 0 ? false : _initialStateData$uni,
        _initialStateData$mob = initialStateData.mobile,
        mobile = _initialStateData$mob === void 0 ? false : _initialStateData$mob;
    return {
      application: _extends({}, application, {
        name: "customer_sdk",
        version: "3.0.0"
      }),
      licenseId: licenseId,
      env: env,
      groupId: groupId,
      chats: {},
      connection: {
        status: DISCONNECTED
      },
      page: page,
      region: region,
      referrer: referrer,
      requests: {},
      users: {
        self: {
          id: null,
          type: CUSTOMER
        },
        others: {}
      },
      uniqueGroups: uniqueGroups,
      mobile: mobile
    };
  };

  var removeStoredRequest = function removeStoredRequest(state, _ref2) {
    var id = _ref2.id;

    // eslint-disable-next-line no-unused-vars
    var _state$requests = state.requests,
        requests = _objectWithoutPropertiesLoose(_state$requests, [id].map(_toPropertyKey));

    return _extends({}, state, {
      requests: requests
    });
  };

  var setConnectionStatus = function setConnectionStatus(status, state) {
    return _extends({}, state, {
      connection: _extends({}, state.connection, {
        status: status
      })
    });
  };

  var createReducer$1 = (function (state) {
    var _createReducer;

    return createReducer(state, (_createReducer = {}, _createReducer[CHANGE_REGION] = function (state, _ref3) {
      var region = _ref3.region;
      return _extends({}, state, {
        region: region
      });
    }, _createReducer[DESTROY] = function (state) {
      return setConnectionStatus(DESTROYED, state);
    }, _createReducer[LOGIN_SUCCESS] = function (state) {
      return setConnectionStatus(CONNECTED, state);
    }, _createReducer[PAUSE_CONNECTION] = function (state) {
      return setConnectionStatus(PAUSED, state);
    }, _createReducer[REQUEST_FAILED] = removeStoredRequest, _createReducer[RESPONSE_RECEIVED] = removeStoredRequest, _createReducer[PUSH_RESPONSE_RECEIVED] = removeStoredRequest, _createReducer[SEND_REQUEST] = function (state, _ref4) {
      var _extends2;

      var promise = _ref4.promise,
          resolve = _ref4.resolve,
          reject = _ref4.reject,
          id = _ref4.id,
          request = _ref4.request;
      return _extends({}, state, {
        requests: _extends({}, state.requests, (_extends2 = {}, _extends2[id] = {
          id: id,
          promise: promise,
          resolve: resolve,
          reject: reject,
          request: request
        }, _extends2))
      });
    }, _createReducer[SET_CHAT_ACTIVE] = function (state, _ref5) {
      var _extends3;

      var id = _ref5.id,
          active = _ref5.active;
      return _extends({}, state, {
        chats: _extends({}, state.chats, (_extends3 = {}, _extends3[id] = _extends({}, state.chats[id], {
          active: active
        }), _extends3))
      });
    }, _createReducer[SET_SELF_ID] = function (state, payload) {
      return _extends({}, state, {
        users: _extends({}, state.users, {
          self: _extends({}, state.users.self, {
            id: payload.id
          })
        })
      });
    }, _createReducer[SOCKET_DISCONNECTED] = function (state) {
      var previousStatus = getConnectionStatus(state);

      if ( (previousStatus === PAUSED || previousStatus === DESTROYED)) {
        throw new Error("Got 'socket_disconnected' action when in " + previousStatus + " state. This should be an impossible state.");
      }

      var state1 = setConnectionStatus(previousStatus === DISCONNECTED ? DISCONNECTED : RECONNECTING, state);
      return _extends({}, state1, {
        requests: {}
      });
    }, _createReducer[UPDATE_CUSTOMER_PAGE] = function (state, page) {
      return _extends({}, state, {
        page: _extends({}, state.page, page)
      });
    }, _createReducer));
  });

  function finalCreateStore(initialStateData) {
    var compose =  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      name: '@livechat/customer-sdk'
    }) : identity;
    var sideEffectsMiddleware = createSideEffectsMiddleware();
    var store = createStore(createReducer$1(createInitialState(initialStateData)), compose(applyMiddleware(sideEffectsMiddleware)));
    store.addSideEffectsHandler = sideEffectsMiddleware.add;
    return store;
  }

  function createError$1(_ref) {
    var message = _ref.message,
        code = _ref.code;
    var error = new Error(message);
    error.code = code;
    return error;
  }

  var ACCESS_TOKEN_EXPIRED = 'access_token_expired';
  var CUSTOMER_BANNED = 'customer_banned'; // customer tried reconnecting too many times after they received too_many_connections error

  var CUSTOMER_TEMPORARILY_BLOCKED = 'customer_temporarily_blocked';
  var LICENSE_EXPIRED = 'license_expired';
  var LICENSE_NOT_FOUND = 'license_not_found';
  var MISDIRECTED_CONNECTION$1 = 'misdirected_connection';
  var PRODUCT_VERSION_CHANGED = 'product_version_changed'; // the limit of connections per user host has been exceeded
  // or rate limit for new connections has been hit
  // (in 3.2 only the latter case, the first one is using `too_many_connections` to avoid breaking changes)

  var SERVICE_TEMPORARILY_UNAVAILABLE$1 = 'service_temporarily_unavailable'; // the limit of those connections is per user

  var TOO_MANY_CONNECTIONS = 'too_many_connections'; // the limit of unauthorized connections is per IP

  var TOO_MANY_UNAUTHORIZED_CONNECTIONS = 'too_many_unauthorized_connections';
  var UNSUPPORTED_VERSION = 'unsupported_version';

  var CHAT_DEACTIVATED = 'chat_deactivated';
  var CHAT_PROPERTIES_DELETED = 'chat_properties_deleted';
  var CHAT_PROPERTIES_UPDATED = 'chat_properties_updated';
  var CHAT_TRANSFERRED = 'chat_transferred';
  var CUSTOMER_DISCONNECTED = 'customer_disconnected';
  var CUSTOMER_PAGE_UPDATED = 'customer_page_updated';
  var CUSTOMER_SIDE_STORAGE_UPDATED = 'customer_side_storage_updated';
  var CUSTOMER_UPDATED = 'customer_updated';
  var EVENT_PROPERTIES_DELETED = 'event_properties_deleted';
  var EVENT_PROPERTIES_UPDATED = 'event_properties_updated';
  var EVENT_UPDATED = 'event_updated';
  var EVENTS_MARKED_AS_SEEN = 'events_marked_as_seen';
  var GREETING_ACCEPTED = 'greeting_accepted';
  var GREETING_CANCELED = 'greeting_canceled';
  var INCOMING_CHAT = 'incoming_chat';
  var INCOMING_EVENT = 'incoming_event';
  var INCOMING_GREETING = 'incoming_greeting';
  var INCOMING_MULTICAST = 'incoming_multicast';
  var INCOMING_RICH_MESSAGE_POSTBACK = 'incoming_rich_message_postback';
  var INCOMING_TYPING_INDICATOR = 'incoming_typing_indicator';
  var QUEUE_POSITION_UPDATED = 'queue_position_updated';
  var THREAD_PROPERTIES_DELETED = 'thread_properties_deleted';
  var THREAD_PROPERTIES_UPDATED = 'thread_properties_updated';
  var USER_ADDED_TO_CHAT = 'user_added_to_chat';
  var USER_REMOVED_FROM_CHAT = 'user_removed_from_chat';

  var serverPushActions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    CHAT_DEACTIVATED: CHAT_DEACTIVATED,
    CHAT_PROPERTIES_DELETED: CHAT_PROPERTIES_DELETED,
    CHAT_PROPERTIES_UPDATED: CHAT_PROPERTIES_UPDATED,
    CHAT_TRANSFERRED: CHAT_TRANSFERRED,
    CUSTOMER_DISCONNECTED: CUSTOMER_DISCONNECTED,
    CUSTOMER_PAGE_UPDATED: CUSTOMER_PAGE_UPDATED,
    CUSTOMER_SIDE_STORAGE_UPDATED: CUSTOMER_SIDE_STORAGE_UPDATED,
    CUSTOMER_UPDATED: CUSTOMER_UPDATED,
    EVENT_PROPERTIES_DELETED: EVENT_PROPERTIES_DELETED,
    EVENT_PROPERTIES_UPDATED: EVENT_PROPERTIES_UPDATED,
    EVENT_UPDATED: EVENT_UPDATED,
    EVENTS_MARKED_AS_SEEN: EVENTS_MARKED_AS_SEEN,
    GREETING_ACCEPTED: GREETING_ACCEPTED,
    GREETING_CANCELED: GREETING_CANCELED,
    INCOMING_CHAT: INCOMING_CHAT,
    INCOMING_EVENT: INCOMING_EVENT,
    INCOMING_GREETING: INCOMING_GREETING,
    INCOMING_MULTICAST: INCOMING_MULTICAST,
    INCOMING_RICH_MESSAGE_POSTBACK: INCOMING_RICH_MESSAGE_POSTBACK,
    INCOMING_TYPING_INDICATOR: INCOMING_TYPING_INDICATOR,
    QUEUE_POSITION_UPDATED: QUEUE_POSITION_UPDATED,
    THREAD_PROPERTIES_DELETED: THREAD_PROPERTIES_DELETED,
    THREAD_PROPERTIES_UPDATED: THREAD_PROPERTIES_UPDATED,
    USER_ADDED_TO_CHAT: USER_ADDED_TO_CHAT,
    USER_REMOVED_FROM_CHAT: USER_REMOVED_FROM_CHAT
  });

  var FILE = 'file';
  var FILLED_FORM = 'filled_form';
  var MESSAGE = 'message';
  var RICH_MESSAGE = 'rich_message';
  var SYSTEM_MESSAGE = 'system_message';
  var CUSTOM = 'custom';

  var createEventBase = function createEventBase(event) {
    var base = {};

    if (typeof event.customId === 'string') {
      base.custom_id = event.customId;
    }

    if (isObject(event.properties)) {
      base.properties = event.properties;
    }

    return base;
  }; // TODO: we could validate and throw here
  // but should we? maybe only in DEV mode?


  var parseEvent = function parseEvent(event) {
    switch (event.type) {
      case MESSAGE:
        {
          var message = _extends({}, createEventBase(event), {
            type: event.type,
            text: event.text
          });

          if (event.postback) {
            message.postback = {
              id: event.postback.id,
              thread_id: event.postback.threadId,
              event_id: event.postback.eventId,
              type: event.postback.type,
              value: event.postback.value
            };
          }

          return message;
        }

      case FILE:
        {
          var file = _extends({}, createEventBase(event), {
            type: event.type,
            url: event.url,
            alternative_text: event.alternativeText
          });

          return file;
        }

      case FILLED_FORM:
        {
          var filledForm = _extends({}, createEventBase(event), {
            type: event.type,
            form_id: event.formId,
            fields: event.fields.map(function (field) {
              switch (field.type) {
                case 'group_chooser':
                  {
                    if (!field.answer) {
                      return field;
                    }

                    var _field$answer = field.answer,
                        groupId = _field$answer.groupId,
                        answer = _objectWithoutPropertiesLoose(_field$answer, ["groupId"]);

                    return _extends({}, field, {
                      answer: _extends({}, answer, {
                        group_id: groupId
                      })
                    });
                  }

                default:
                  return field;
              }
            })
          });

          return filledForm;
        }

      case SYSTEM_MESSAGE:
        {
          var systemMessage = _extends({}, createEventBase(event), {
            type: event.type,
            text: event.text,
            system_message_type: event.systemMessageType
          });

          if (event.recipients) {
            systemMessage.recipients = event.recipients;
          }

          return systemMessage;
        }

      case CUSTOM:
        {
          var customEvent = _extends({}, createEventBase(event), {
            type: event.type
          });

          if (event.content) {
            customEvent.content = event.content;
          }

          return customEvent;
        }
    }
  };

  var parseThreadData = function parseThreadData(thread) {
    var data = {};
    var events = thread.events,
        properties = thread.properties;

    if (events) {
      data.events = events.map(parseEvent);
    }

    if (properties) {
      data.properties = properties;
    }

    return data;
  };

  var parseStartChatData = function parseStartChatData(_ref) {
    var _ref$active = _ref.active,
        active = _ref$active === void 0 ? true : _ref$active,
        chat = _ref.chat,
        continuous = _ref.continuous;
    var data = {
      active: active,
      chat: {}
    };

    if (typeof continuous === 'boolean') {
      data.continuous = continuous;
    }

    if (!chat) {
      return data;
    }

    var access = chat.access,
        thread = chat.thread,
        properties = chat.properties;

    if (access && access.groupIds) {
      data.chat.access = {
        group_ids: access.groupIds
      };
    }

    if (properties) {
      data.chat.properties = properties;
    }

    if (thread) {
      data.chat.thread = parseThreadData(thread);
    }

    return data;
  };
  var parseResumeChatData = function parseResumeChatData(requestData) {
    var data = parseStartChatData(requestData);
    return _extends({}, data, {
      chat: _extends({}, data.chat, {
        id: requestData.chat.id
      })
    });
  };
  var parseCustomerSessionFields = function parseCustomerSessionFields(sessionFields) {
    return toPairs(sessionFields).map(function (_ref2) {
      var _ref3;

      var key = _ref2[0],
          value = _ref2[1];
      return _ref3 = {}, _ref3[key] = value, _ref3;
    });
  };
  var parseCustomerUpdate = function parseCustomerUpdate(update) {
    var result = pickOwn(['avatar', 'name', 'email'], update);

    if (update.sessionFields) {
      result.session_fields = parseCustomerSessionFields(update.sessionFields);
    }

    return result;
  };

  var destroy = function destroy(reason) {
    return {
      type: DESTROY,
      payload: {
        reason: reason
      }
    };
  };
  var loginSuccess = function loginSuccess(payload) {
    return {
      type: LOGIN_SUCCESS,
      payload: payload
    };
  };
  var pauseConnection = function pauseConnection(reason) {
    return {
      type: PAUSE_CONNECTION,
      payload: {
        reason: reason
      }
    };
  };
  var prefetchToken = function prefetchToken(fresh) {
    if (fresh === void 0) {
      fresh = false;
    }

    return {
      type: PREFETCH_TOKEN,
      payload: {
        fresh: fresh
      }
    };
  };
  var reconnect = function reconnect(delay) {
    return {
      type: RECONNECT,
      payload: {
        delay: delay
      }
    };
  }; // TODO: this one was currently pretty hard to type in full
  // we should explore providing stricter types for this in the future

  var sendRequest = function sendRequest(action, payload, source) {
    return {
      type: SEND_REQUEST,
      payload: _extends({
        request: {
          action: action,
          payload: payload
        }
      }, source && {
        source: source
      })
    };
  };
  var sendEvent = function sendEvent(_ref) {
    var chatId = _ref.chatId,
        event = _ref.event,
        attachToLastThread = _ref.attachToLastThread;
    var payload = {
      chat_id: chatId,
      event: parseEvent(event)
    };

    if (attachToLastThread) {
      payload.attach_to_last_thread = true;
    }

    return sendRequest(SEND_EVENT, payload);
  };
  var setChatActive = function setChatActive(id, active) {
    return {
      type: SET_CHAT_ACTIVE,
      payload: {
        id: id,
        active: active
      }
    };
  };
  var setSelfId = function setSelfId(id) {
    return {
      type: SET_SELF_ID,
      payload: {
        id: id
      }
    };
  };
  var socketDisconnected = function socketDisconnected() {
    return {
      type: SOCKET_DISCONNECTED
    };
  };

  // TODO: this thing is not really well typed and should be improved
  var sendRequestAction = function sendRequestAction(store, action) {
    action.payload.id = generateUniqueId(store.getState().requests);

    var _deferred = deferred(),
        resolve = _deferred.resolve,
        reject = _deferred.reject,
        promise = _deferred.promise;

    action.payload.promise = promise;
    action.payload.resolve = resolve;
    action.payload.reject = reject;
    store.dispatch(action);
    return promise;
  };

  var promiseTry = (function (fn) {
    return new Promise(function (resolve) {
      resolve(fn());
    });
  });

  var createBackoff = function createBackoff(_ref) {
    var _ref$min = _ref.min,
        min = _ref$min === void 0 ? 1000 : _ref$min,
        _ref$max = _ref.max,
        max = _ref$max === void 0 ? 5000 : _ref$max,
        _ref$jitter = _ref.jitter,
        jitter = _ref$jitter === void 0 ? 0.5 : _ref$jitter;
    var attempts = 0;
    return {
      duration: function duration() {
        var ms = min * Math.pow(2, attempts++);

        if (jitter) {
          var rand = Math.random();
          var deviation = Math.floor(rand * jitter * ms);
          ms = (Math.floor(rand * 10) & 1) === 0 ? ms - deviation : ms + deviation;
        }

        return Math.min(ms, max) | 0;
      },
      reset: function reset() {
        attempts = 0;
      }
    };
  };

  var AUTHENTICATION = 'AUTHENTICATION';
  var CUSTOMER_BANNED$1 = 'CUSTOMER_BANNED';
  var USERS_LIMIT_REACHED = 'USERS_LIMIT_REACHED';
  var WRONG_PRODUCT_VERSION = 'WRONG_PRODUCT_VERSION';

  var getSideStorageKey = function getSideStorageKey(store) {
    var _store$getState = store.getState(),
        licenseId = _store$getState.licenseId,
        groupId = _store$getState.groupId,
        uniqueGroups = _store$getState.uniqueGroups;

    return "side_storage_" + licenseId + (uniqueGroups ? ":" + groupId : '');
  };

  var getSideStorage = function getSideStorage(store) {
    return storage.getItem(getSideStorageKey(store))["catch"](noop).then(function (sideStorage) {
      return JSON.parse(sideStorage || '{}');
    }) // shouldnt get triggered, just a defensive measure against malformed storage entries
    ["catch"](function () {
      return {};
    });
  };
  var saveSideStorage = function saveSideStorage(store, sideStorage) {
    return storage.setItem(getSideStorageKey(store), JSON.stringify(sideStorage))["catch"](noop);
  };

  var taskChain = function taskChain(_ref, onSuccess, onError) {
    var steps = _ref.slice(0);

    var cancelled = false;

    var next = function next(intermediateResult) {
      var step = steps.shift();
      promiseTry(function () {
        return step(intermediateResult);
      }).then(function (result) {
        if (cancelled) {
          return;
        }

        if (steps.length) {
          next(result);
          return;
        }

        onSuccess(result);
      }, function (error) {
        if (cancelled) {
          return;
        }

        onError(error);
      });
    };

    next();
    return {
      cancel: function cancel() {
        cancelled = true;
      }
    };
  };

  var sendLoginFlowRequest = function sendLoginFlowRequest(store, type, payload) {
    return sendRequestAction(store, sendRequest(type, payload, 'login'));
  };

  var delay = function delay(ms) {
    return new Promise(function (resolve) {
      setTimeout(resolve, ms);
    });
  };

  function createLoginTask(auth, customerDataProvider) {
    var store;
    var sentPage = null;
    var task;
    var backoffConfig = {
      min: 300,
      max: 60000,
      jitter: 0.3
    };
    var defaultBackoffStrategy = createBackoff(backoffConfig);
    var slowerBackoffStrategy = createBackoff(_extends({}, backoffConfig, {
      min: 1000
    }));
    var currentBackoffStrategy = defaultBackoffStrategy;

    var destroy$1 = function destroy$1(reason) {
      return store.dispatch(destroy(reason));
    };

    var reconnect$1 = function reconnect$1() {
      return store.dispatch(reconnect(currentBackoffStrategy.duration()));
    };

    var getTokenAndSideStorage = function getTokenAndSideStorage() {
      return Promise.all([auth.getToken(), getSideStorage(store)]);
    };

    var dispatchSelfId = function dispatchSelfId(_ref2) {
      var token = _ref2[0],
          sideStorage = _ref2[1];
      var selfId = getSelfId(store.getState());

      if (selfId === null) {
        store.dispatch(setSelfId(token.entityId));
      } else if (selfId !== token.entityId) {
        var err = new Error('Identity has changed.');
        err.code = IDENTITY_MISMATCH;
        throw err;
      }

      return [token, sideStorage];
    };

    var _sendLogin = function sendLogin(_ref3) {
      var token = _ref3[0],
          sideStorage = _ref3[1];
      var state = store.getState();
      var application = state.application,
          groupId = state.groupId,
          page = state.page,
          referrer = state.referrer,
          mobile = state.mobile;
      var payload = {
        token: token.tokenType + " " + token.accessToken,
        customer: typeof customerDataProvider === 'function' ? parseCustomerUpdate(customerDataProvider()) : {},
        customer_side_storage: sideStorage,
        is_mobile: mobile,
        application: pick(['name', 'version'], application)
      };

      if (typeof groupId === 'number') {
        payload.group_id = groupId;
      }

      if (application.channelType) {
        payload.application.channel_type = application.channelType;
      }

      if (page !== null) {
        sentPage = page;
        payload.customer_page = page;
      }

      if (referrer !== null) {
        payload.referrer = referrer;
      }

      return Promise.race([sendLoginFlowRequest(store, LOGIN, payload), delay(15 * 1000).then(function () {
        return Promise.reject(createError$1({
          message: 'Request timed out.',
          code: REQUEST_TIMEOUT
        }));
      })]);
    };

    var updateCustomerPageIfNeeded = function updateCustomerPageIfNeeded() {
      var _store$getState = store.getState(),
          page = _store$getState.page;

      if (sentPage !== page) {
        sendLoginFlowRequest(store, UPDATE_CUSTOMER_PAGE$1, page)["catch"](noop);
      }

      sentPage = null;
    };

    return {
      sendLogin: function sendLogin(_store) {
        var _task;

        // after switching to callbags, we should be able to use smth similar to redux-observable
        // and thus just use store given to epic
        store = _store; // eslint-disable-next-line no-unused-expressions

        (_task = task) == null ? void 0 : _task.cancel();
        task = taskChain([getTokenAndSideStorage, dispatchSelfId, _sendLogin], function (loginResponse) {
          task = null;
          defaultBackoffStrategy.reset();
          slowerBackoffStrategy.reset();
          currentBackoffStrategy = defaultBackoffStrategy; // TODO: rethink if this should be handled by SDK consumer

          updateCustomerPageIfNeeded();
          store.dispatch(loginSuccess(loginResponse));
        }, function (error) {
          task = null;

          {
            console.error('[Customer SDK] Login flow has thrown code', error.code, 'with', error);
          }

          switch (error.code) {
            case AUTHENTICATION:
              auth.getFreshToken();
              reconnect$1();
              return;

            case CONNECTION_LOST:
              // this is connectivity problem, not a server error
              // and is taken care of in socket module
              // as it has its own backoff implementation
              return;

            case MISDIRECTED_CONNECTION:
              // socket gets reinitialized on this anyway, so just ignore it here
              return;

            case SDK_DESTROYED:
              return;
            // those are auth errors, we should maybe export those constants from the auth package

            case 'SSO_IDENTITY_EXCEPTION':
            case 'SSO_OAUTH_EXCEPTION':
              if (error.message === 'server_error' || error.message === 'temporarily_unavailable') {
                reconnect$1();
                return;
              }

              destroy$1(error.message);
              return;

            case USERS_LIMIT_REACHED:
              store.dispatch(pauseConnection(error.code.toLowerCase()));
              return;

            case IDENTITY_MISMATCH:
            case CUSTOMER_BANNED$1:
            case WRONG_PRODUCT_VERSION:
              destroy$1(error.code.toLowerCase());
              return;

            case SERVICE_TEMPORARILY_UNAVAILABLE:
              currentBackoffStrategy = slowerBackoffStrategy;
              reconnect$1();
              return;

            default:
              reconnect$1();
              return;
          }
        });
      },
      cancel: function cancel() {
        var _task2;

        // eslint-disable-next-line no-unused-expressions
        (_task2 = task) == null ? void 0 : _task2.cancel();
      }
    };
  }

  function unfetch (e, n) {
    return n = n || {}, new Promise(function (t, r) {
      var s = new XMLHttpRequest(),
          o = [],
          u = [],
          i = {},
          a = function () {
        return {
          ok: 2 == (s.status / 100 | 0),
          statusText: s.statusText,
          status: s.status,
          url: s.responseURL,
          text: function () {
            return Promise.resolve(s.responseText);
          },
          json: function () {
            return Promise.resolve(s.responseText).then(JSON.parse);
          },
          blob: function () {
            return Promise.resolve(new Blob([s.response]));
          },
          clone: a,
          headers: {
            keys: function () {
              return o;
            },
            entries: function () {
              return u;
            },
            get: function (e) {
              return i[e.toLowerCase()];
            },
            has: function (e) {
              return e.toLowerCase() in i;
            }
          }
        };
      };

      for (var l in s.open(n.method || "get", e, !0), s.onload = function () {
        s.getAllResponseHeaders().replace(/^(.*?):[^\S\n]*([\s\S]*?)$/gm, function (e, n, t) {
          o.push(n = n.toLowerCase()), u.push([n, t]), i[n] = i[n] ? i[n] + "," + t : t;
        }), t(a());
      }, s.onerror = r, s.withCredentials = "include" == n.credentials, n.headers) s.setRequestHeader(l, n.headers[l]);

      s.send(n.body || null);
    });
  }

  var checkGoals = function checkGoals(store, auth, sessionFields) {
    return auth.getToken().then(function (token) {
      var state = store.getState();

      if (getSelfId(state) === null) {
        store.dispatch(setSelfId(token.entityId));
      }

      var page = state.page;

      if (!page || !page.url) {
        return;
      }

      var query = buildQueryString({
        license_id: state.licenseId
      });
      var payload = {
        session_fields: parseCustomerSessionFields(sessionFields || {}),
        group_id: state.groupId || 0,
        page_url: page.url
      };
      return unfetch(getServerUrl(state) + "/action/" + CHECK_GOALS$1 + "?" + query, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token.tokenType + " " + token.accessToken
        },
        body: JSON.stringify(payload)
      }).then(function () {
        // TODO: we should actually normalize response here
        return undefined;
      });
    });
  };

  var failAllRequests = function failAllRequests(_ref, reason) {
    var getState = _ref.getState,
        dispatch = _ref.dispatch;
    var state = getState();
    var requests = getAllRequests(state);
    dispatch({
      type: FAIL_ALL_REQUESTS,
      payload: {
        rejects: Object.keys(requests).map(function (requestId) {
          return requests[requestId].reject;
        }),
        reason: reason
      }
    });
  };
  var failRequest = function failRequest(_ref2, requestAction, error) {
    var getState = _ref2.getState,
        dispatch = _ref2.dispatch;
    var requestId = requestAction.payload.id;
    dispatch({
      type: REQUEST_FAILED,
      payload: {
        id: requestId,
        reject: getState().requests[requestId].reject,
        error: error
      }
    });
  };

  var SUCCESS = Object.freeze({
    success: true
  });

  var parseCommonEventProps = function parseCommonEventProps(threadId, event) {
    var parsed = {
      id: event.id,
      authorId: event.author_id,
      createdAt: event.created_at,
      threadId: threadId,
      properties: event.properties || {}
    };

    if (event.custom_id !== undefined) {
      parsed.customId = event.custom_id;
    }

    return parsed;
  };

  var downsizeWithRatio = function downsizeWithRatio(max, dimensions) {
    var _ref;

    var biggerProp;
    var smallerProp;
    var bigger;
    var smaller;

    if (dimensions.height > dimensions.width) {
      biggerProp = 'height';
      smallerProp = 'width';
      bigger = dimensions.height;
      smaller = dimensions.width;
    } else {
      biggerProp = 'width';
      smallerProp = 'height';
      bigger = dimensions.width;
      smaller = dimensions.height;
    }

    var ratio = max / bigger;
    return _ref = {}, _ref[biggerProp] = Math.ceil(Math.min(bigger, max)), _ref[smallerProp] = Math.ceil(Math.min(ratio * smaller, smaller)), _ref;
  };

  var parseImage = function parseImage(thread, image) {
    return _extends({}, parseCommonEventProps(thread, image), {
      type: FILE,
      contentType: image.content_type,
      url: image.url,
      name: image.name,
      width: image.width,
      height: image.height,
      thumbnails: {
        "default": _extends({
          url: image.thumbnail_url
        }, downsizeWithRatio(300, image)),
        high: _extends({
          url: image.thumbnail2x_url
        }, downsizeWithRatio(600, image))
      }
    }, image.alternative_text && {
      alternativeText: image.alternative_text
    });
  };

  var parseFile = function parseFile(thread, file) {
    if (file.width !== undefined && file.height !== undefined) {
      return parseImage(thread, file);
    }

    return _extends({}, parseCommonEventProps(thread, file), {
      type: FILE,
      contentType: file.content_type,
      url: file.url,
      name: file.name
    });
  };
  var parseFilledForm = function parseFilledForm(thread, filledForm) {
    return _extends({}, parseCommonEventProps(thread, filledForm), {
      type: FILLED_FORM,
      formId: filledForm.form_id,
      fields: filledForm.fields.map(function (field) {
        switch (field.type) {
          case 'group_chooser':
            {
              if (!field.answer) {
                return field;
              }

              var _field$answer = field.answer,
                  groupId = _field$answer.group_id,
                  answer = _objectWithoutPropertiesLoose(_field$answer, ["group_id"]);

              return _extends({}, field, {
                answer: _extends({}, answer, {
                  groupId: groupId
                })
              });
            }

          default:
            return field;
        }
      })
    });
  };
  var parseMessage = function parseMessage(thread, message) {
    return _extends({}, parseCommonEventProps(thread, message), {
      type: MESSAGE,
      text: message.text
    });
  };
  var parseCustomEvent = function parseCustomEvent(thread, event) {
    return _extends({}, parseCommonEventProps(thread, event), {
      type: CUSTOM
    }, event.content && {
      content: event.content
    });
  };

  var parseRichMessageElement = function parseRichMessageElement(element) {
    var parsed = {};

    if (typeof element.title === 'string') {
      parsed.title = element.title;
    }

    if (typeof element.subtitle === 'string') {
      parsed.subtitle = element.subtitle;
    }

    if (element.image) {
      // TODO: we should reuse parseImage here
      var image = element.image;
      parsed.image = _extends({
        url: image.url,
        name: image.name
      }, image.alternative_text && {
        alternativeText: image.alternative_text
      });
    }

    if (element.buttons) {
      parsed.buttons = element.buttons.map(function (serverButton) {
        switch (serverButton.type) {
          case 'message':
          case 'phone':
            {
              return {
                type: serverButton.type,
                text: serverButton.text,
                postbackId: serverButton.postback_id,
                userIds: serverButton.user_ids,
                value: serverButton.value,
                role: serverButton.role || 'default'
              };
            }

          case 'cancel':
            {
              return {
                type: serverButton.type,
                text: serverButton.text,
                postbackId: serverButton.postback_id,
                userIds: serverButton.user_ids,
                role: serverButton.role || 'default'
              };
            }

          case 'url':
            {
              var button = {
                type: serverButton.type,
                text: serverButton.text,
                postbackId: serverButton.postback_id,
                userIds: serverButton.user_ids,
                value: serverButton.value,
                role: serverButton.role || 'default'
              };

              if (serverButton.target) {
                button.target = serverButton.target;
              }

              return button;
            }

          case 'webview':
            {
              var _button = {
                type: serverButton.type,
                text: serverButton.text,
                postbackId: serverButton.postback_id,
                userIds: serverButton.user_ids,
                value: serverButton.value,
                role: serverButton.role || 'default'
              };

              if (typeof serverButton.webview_height === 'string') {
                _button.webviewHeight = serverButton.webview_height;
              }

              return _button;
            }

          default:
            {
              return {
                text: serverButton.text,
                postbackId: serverButton.postback_id,
                userIds: serverButton.user_ids,
                role: serverButton.role || 'default'
              };
            }
        }
      });
    }

    return parsed;
  };

  var parseRichMessage = function parseRichMessage(thread, richMessage) {
    switch (richMessage.template_id) {
      case 'cards':
      case 'quick_replies':
      case 'sticker':
        return _extends({}, parseCommonEventProps(thread, richMessage), {
          type: RICH_MESSAGE,
          template: richMessage.template_id,
          elements: richMessage.elements.map(parseRichMessageElement)
        });

      default:
        return null;
    }
  };
  var parseSystemMessage = function parseSystemMessage(thread, systemMessage) {
    var parsed = _extends({}, parseCommonEventProps(thread, _extends({}, systemMessage, {
      author_id: 'system'
    })), {
      type: SYSTEM_MESSAGE,
      text: systemMessage.text,
      systemMessageType: systemMessage.system_message_type
    });

    if (systemMessage.text_vars) {
      parsed.textVars = systemMessage.text_vars;
    }

    return parsed;
  };
  var parseEvent$1 = function parseEvent(thread, event) {
    switch (event.type) {
      case FILE:
        return parseFile(thread, event);

      case FILLED_FORM:
        return parseFilledForm(thread, event);

      case MESSAGE:
        return parseMessage(thread, event);

      case RICH_MESSAGE:
        return parseRichMessage(thread, event);

      case SYSTEM_MESSAGE:
        return parseSystemMessage(thread, event);

      case CUSTOM:
        return parseCustomEvent(thread, event);

      default:
        return null;
    }
  };
  var parseGreeting = function parseGreeting(greeting) {
    return {
      id: greeting.id,
      addon: greeting.addon || null,
      uniqueId: greeting.unique_id,
      displayedFirstTime: greeting.displayed_first_time,
      accepted: greeting.accepted || false,
      subtype: greeting.subtype || 'greeting',
      // threadId is typed as nonoptional string but for greetings it doesn't exist
      event: parseEvent$1(null, greeting.event),
      agent: {
        id: greeting.agent.id,
        name: greeting.agent.name,
        avatar: greeting.agent.avatar,
        jobTitle: greeting.agent.job_title,
        isBot: greeting.agent.is_bot || false
      }
    };
  };

  // so it's better to rely on a custom implementation

  var parseCustomerSessionFields$1 = function parseCustomerSessionFields(sessionFields) {
    return sessionFields.reduce(function (acc, field) {
      var _Object$keys = Object.keys(field),
          key = _Object$keys[0];

      acc[key] = field[key];
      return acc;
    }, {});
  };

  var parseAccess = function parseAccess(access) {
    if (access === void 0) {
      access = {};
    }

    return access.group_ids ? {
      groupIds: access.group_ids
    } : {};
  };
  var getEventsSeenUpToMap = function getEventsSeenUpToMap(users) {
    return mapValues(function (user) {
      return user.events_seen_up_to ? user.events_seen_up_to : null;
    }, keyBy('id', users));
  };
  var parseThread = function parseThread(chatId, thread) {
    var properties = thread.properties || {};
    return {
      id: thread.id,
      chatId: chatId,
      active: thread.active,
      access: parseAccess(thread.access),
      createdAt: thread.created_at,
      userIds: thread.user_ids,
      events: thread.events.map(function (event) {
        return parseEvent$1(thread.id, event);
      }).filter(Boolean),
      properties: properties,
      previousThreadId: thread.previous_thread_id || null,
      nextThreadId: thread.next_thread_id || null,
      queue: thread.queue ? parseQueue(thread.queue) : null
    };
  };
  var parseChatCommon = function parseChatCommon(chat) {
    return {
      id: chat.id,
      access: parseAccess(chat.access),
      users: chat.users.map(parseChatUser),
      properties: chat.properties || {},
      eventsSeenUpToMap: getEventsSeenUpToMap(chat.users)
    };
  };
  var parseChatAgent = function parseChatAgent(agent) {
    return {
      id: agent.id,
      // keep literal here, so every non-customer gets treated as agent
      // currently there are only 2 types of users - customer & agent (bots have type: "agent")
      // so this is purely defensive measure, trying to stay future-proof
      type: AGENT,
      name: agent.name,
      avatar: agent.avatar,
      jobTitle: agent.job_title,
      present: agent.present
    };
  };
  var parseCustomerOptionalProps = function parseCustomerOptionalProps(customerProps) {
    var optionalProps = pickOwn(['avatar', 'email', 'name'], customerProps);

    if (customerProps.session_fields) {
      optionalProps.sessionFields = parseCustomerSessionFields$1(customerProps.session_fields);
    }

    return optionalProps;
  };

  var parseCustomerCommonProps = function parseCustomerCommonProps(customer) {
    var optionalProps = parseCustomerOptionalProps(customer);
    return _extends({
      id: customer.id,
      type: CUSTOMER
    }, optionalProps, {
      sessionFields: optionalProps.sessionFields || {}
    });
  };

  var parseChatCustomer = function parseChatCustomer(customer) {
    return _extends({}, parseCustomerCommonProps(customer), {
      present: customer.present
    });
  };
  var parseCustomer = function parseCustomer(customer) {
    var statistics = customer.statistics;
    return _extends({}, parseCustomerCommonProps(customer), {
      statistics: {
        chatsCount: statistics.chats_count,
        threadsCount: statistics.threads_count,
        visitsCount: statistics.visits_count,
        pageViewsCount: statistics.page_views_count,
        greetingsShownCount: statistics.greetings_shown_count,
        greetingsAcceptedCount: statistics.greetings_accepted_count
      }
    });
  };
  var parsePredictedAgent = function parsePredictedAgent(payload) {
    var agent = payload.agent,
        queue = payload.queue;
    return {
      agent: {
        id: agent.id,
        type: AGENT,
        name: agent.name,
        avatar: agent.avatar,
        jobTitle: agent.job_title,
        isBot: agent.is_bot
      },
      queue: queue
    };
  };
  var parseQueueUpdate = function parseQueueUpdate(queueUpdate) {
    return {
      position: queueUpdate.position,
      waitTime: queueUpdate.wait_time
    };
  };
  var parseQueue = function parseQueue(queue) {
    return _extends({}, parseQueueUpdate(queue), {
      queuedAt: queue.queued_at
    });
  };
  var parseChatUser = function parseChatUser(user) {
    return user.type === CUSTOMER ? parseChatCustomer(user) : parseChatAgent(user);
  };
  var parseGroupStatus = function parseGroupStatus(status) {
    return status === 'offline' ? 'offline' : 'online';
  };

  var _FAIL_ALL_REQUESTS_ME;

  var SMALL_RECONNECT_DELAY = 100;
  var FAIL_ALL_REQUESTS_MESSAGES = (_FAIL_ALL_REQUESTS_ME = {}, _FAIL_ALL_REQUESTS_ME[CONNECTION_LOST] = 'Connection lost.', _FAIL_ALL_REQUESTS_ME[MISDIRECTED_CONNECTION] = 'Connected to wrong region.', _FAIL_ALL_REQUESTS_ME);

  var updateStateIfNeeded = function updateStateIfNeeded(store, action) {
    var state = store.getState();

    switch (action.type) {
      case PUSH_RESPONSE_RECEIVED:
      case PUSH_RECEIVED:
        switch (action.payload.action) {
          case CHAT_DEACTIVATED:
            store.dispatch(setChatActive(action.payload.payload.chatId, false));
            return;

          case INCOMING_CHAT:
            store.dispatch(setChatActive(action.payload.payload.chat.id, true));
            return;

          default:
            return;
        }

      case RESPONSE_RECEIVED:
        switch (action.payload.action) {
          case LIST_CHATS:
            action.payload.payload.chatsSummary.filter(function (_ref) {
              var id = _ref.id,
                  active = _ref.active;
              return isChatActive(state, id) !== active;
            }).forEach(function (_ref2) {
              var id = _ref2.id,
                  active = _ref2.active;
              store.dispatch(setChatActive(id, active));
            });
            return;

          default:
            return;
        }

    }
  };

  var sendRequest$1 = function sendRequest(socket, _ref3) {
    var _ref3$payload = _ref3.payload,
        id = _ref3$payload.id,
        request = _ref3$payload.request;

    var frame = _extends({
      request_id: id
    }, request);

    switch (frame.action) {
      case LOGIN:
        {
          var upgradedPushes = [];
          socket.emit(_extends({}, frame, {
            version: '3.3',
            payload: _extends({}, frame.payload, {
              pushes: {
                // '3.4': upgradedPushes,
                '3.3': values(serverPushActions).filter(function (pushAction) {
                  return (// `customer_disconnected` can be sent immediately after opening the connection, before it even received login request
                    // therefore it's not possible to subscribe for a particular version of this push - the "connection version" is always used
                    pushAction !== CUSTOMER_DISCONNECTED && !includes(pushAction, upgradedPushes)
                  );
                })
              }
            })
          }));
          return;
        }

      default:
        socket.emit(frame);
        return;
    }
  };

  var emitUsers = function emitUsers(emit, users) {
    users.forEach(function (user) {
      if ('present' in user) {
        var rest = _objectWithoutPropertiesLoose(user, ["present"]);

        emit('user_data', rest);
        return;
      }

      if (user.type === CUSTOMER) {
        var _rest = _objectWithoutPropertiesLoose(user, ["statistics"]);

        emit('user_data', _rest);
        return;
      }

      emit('user_data', user);
    });
  };

  var handleMulticast = function handleMulticast(emit, _ref4) {
    var type = _ref4.type,
        content = _ref4.content;

    if (type !== 'lc2') {
      return;
    }

    if (content.name === 'groups_update' && 'groups' in content && !isEmpty(content.groups)) {
      var _content$groups = content.groups,
          group = _content$groups[0];
      var availability = parseGroupStatus(group.status);
      emit('availability_updated', {
        availability: availability
      });
    }
  };

  var handlePush = function handlePush(_ref5, _ref6) {
    var emit = _ref5.emit,
        store = _ref5.store;
    var payload = _ref6.payload;

    switch (payload.action) {
      case THREAD_PROPERTIES_UPDATED:
        if (payload.payload.properties.lc2 && 'queue_pos' in payload.payload.properties.lc2) {
          emit(QUEUE_POSITION_UPDATED, {
            chatId: payload.payload.chatId,
            threadId: payload.payload.threadId,
            queue: {
              position: payload.payload.properties.lc2.queue_pos,
              waitTime: payload.payload.properties.lc2.queue_waiting_time
            }
          });
        }

        emit('thread_properties_updated', payload.payload);
        return;

      case CUSTOMER_SIDE_STORAGE_UPDATED:
        saveSideStorage(store, payload.payload.customer_side_storage);
        return;

      case CUSTOMER_DISCONNECTED:
        // each of those should currently lead to either reconnect or destroy call
        // after receiving this push server closes the connection with us
        // which results in SOCKET_DISCONNECTED action being dispatched
        // we don't want to rely on this (nor we want to risk emitting 'disconnected' twice)
        // so we should handle all cases ourselves and close the connection preemptively
        switch (payload.payload.reason) {
          case ACCESS_TOKEN_EXPIRED:
            // we passthrough access_token_expired here, so pending requests receive CONNECTION_LOST error
            // we could fail them with ACCESS_TOKEN_EXPIRED, but it could force people to handle it in special manner
            // but actually they should handle it exactly like CONNECTION_LOST:
            // a request could succeed, who knows, it has to be checked after being reconnected
            store.dispatch(prefetchToken(true));
            store.dispatch(reconnect(SMALL_RECONNECT_DELAY));
            emit('disconnected', payload.payload);
            break;

          case CUSTOMER_BANNED:
          case CUSTOMER_TEMPORARILY_BLOCKED:
          case LICENSE_NOT_FOUND:
          case PRODUCT_VERSION_CHANGED:
          case TOO_MANY_CONNECTIONS:
          case UNSUPPORTED_VERSION:
            // this also emits `disconnected` event - but it's handled in response to this action by destroy handler
            store.dispatch(destroy(payload.payload.reason));
            break;

          case MISDIRECTED_CONNECTION$1:
            failAllRequests(store, MISDIRECTED_CONNECTION);
            store.dispatch({
              type: CHANGE_REGION,
              payload: payload.payload.data
            });
            break;

          case SERVICE_TEMPORARILY_UNAVAILABLE$1:
          case TOO_MANY_UNAUTHORIZED_CONNECTIONS:
            // this should only really fail a `login` request - as it's the only one sent before authorization
            // and login should reconnect on its own right now
            failAllRequests(store, payload.payload.reason.toUpperCase());
            break;

          default:
            store.dispatch(reconnect(SMALL_RECONNECT_DELAY));
            emit('disconnected', payload.payload);
            break;
        }

        return;

      case INCOMING_CHAT:
        emitUsers(emit, payload.payload.chat.users);
        emit(payload.action, payload.payload);
        return;

      case INCOMING_EVENT:
        if (payload.payload.event === null) {
          return;
        }

        emit(payload.action, payload.payload);
        return;

      case INCOMING_TYPING_INDICATOR:
        emit(payload.action, payload.payload);
        return;

      case INCOMING_MULTICAST:
        handleMulticast(emit, payload.payload); // we passthrough this action even if it was already handled above

        emit(payload.action, payload.payload);
        return;

      case USER_ADDED_TO_CHAT:
        emitUsers(emit, [payload.payload.user]);
        emit(payload.action, payload.payload);
        return;

      default:
        emit(payload.action, payload.payload);
        return;
    }
  };

  var handleResponse = function handleResponse(_ref7, _ref8) {
    var emit = _ref7.emit;
    var payload = _ref8.payload;

    switch (payload.action) {
      case CHAT_DEACTIVATED:
        payload.resolve(SUCCESS);
        return;

      case GET_CHAT:
        emitUsers(emit, payload.payload.users);
        payload.resolve(payload.payload);
        return;

      case INCOMING_CHAT:
        emitUsers(emit, payload.payload.chat.users);
        payload.resolve(payload.payload);
        return;

      case INCOMING_EVENT:
        payload.resolve(payload.payload.event);
        return;

      case LIST_CHATS:
        emitUsers(emit, payload.payload.users);
        payload.resolve(payload.payload);
        return;

      default:
        payload.resolve(payload.payload);
        return;
    }
  };

  var createSideEffectsHandler = (function (_ref9) {
    var auth = _ref9.auth,
        customerDataProvider = _ref9.customerDataProvider,
        emitter = _ref9.emitter,
        socket = _ref9.socket;
    var emit = emitter.emit;
    var loginTask = createLoginTask(auth, customerDataProvider); // TODO: using Store type here is a lie, middleware only provides MiddlewareAPI here

    return function (action, store) {
      switch (action.type) {
        case CHANGE_REGION:
          socket.reinitialize();
          return;

        case CHECK_GOALS:
          checkGoals(store, auth, action.payload.sessionFields)["catch"](noop);
          return;

        case DESTROY:
          {
            var payload = action.payload;
            loginTask.cancel();
            socket.destroy();

            switch (payload.reason) {
              case 'manual':
                failAllRequests(store, SDK_DESTROYED);
                break;

              case CUSTOMER_BANNED:
              case LICENSE_EXPIRED:
              case PRODUCT_VERSION_CHANGED:
                // normalize those to CONNECTION_LOST as the handling on the consumer's side should be the same
                failAllRequests(store, CONNECTION_LOST);
                emit('disconnected', payload);
                break;

              default:
                // in general those deestroys should only come either from login errors
                // or from customer_disconnected pushes that are sent immediately after connection
                // so this case would only be able to fail login requests but that wouldn't even be caught be a handler there
                // as we cancel the loginTask beforehand
                emit('disconnected', payload);
                break;
            }

            emitter.off();
            return;
          }

        case FAIL_ALL_REQUESTS:
          {
            var _action$payload = action.payload,
                reason = _action$payload.reason,
                rejects = _action$payload.rejects;
            var error = {
              message: FAIL_ALL_REQUESTS_MESSAGES[reason],
              code: reason
            };
            rejects.forEach(function (reject) {
              reject(createError$1(error));
            });
            return;
          }

        case LOGIN_SUCCESS:
          {
            var _action$payload2 = action.payload,
                dynamicConfig = _action$payload2.dynamicConfig,
                customer = _action$payload2.customer,
                chats = _action$payload2.chats,
                greeting = _action$payload2.greeting,
                availability = _action$payload2.availability;

            var eventData = _extends({
              customer: customer,
              availability: availability
            }, greeting && {
              greeting: greeting
            });

            Object.defineProperty(eventData, '__unsafeDynamicConfig', {
              value: dynamicConfig
            });
            Object.defineProperty(eventData, '__unsafeChats', {
              value: chats
            });
            emit('connected', eventData);
            return;
          }

        case PAUSE_CONNECTION:
          {
            var _payload = action.payload;
            socket.disconnect();

            if (_payload.reason !== 'manual') {
              emit('disconnected', _payload);
            }

            return;
          }

        case PREFETCH_TOKEN:
          if (action.payload.fresh) {
            auth.getFreshToken()["catch"](noop);
            return;
          }

          auth.hasToken().then(function (hasToken) {
            if (!hasToken) {
              return auth.getToken();
            }

            return auth.getToken().then(function (_ref10) {
              var creationDate = _ref10.creationDate,
                  expiresIn = _ref10.expiresIn;
              var ONE_HOUR = 60 * 60 * 1000; // check if the token is worth reusing
              // we don't want to get disconnected in a moment because of expired token

              if (creationDate + expiresIn - Date.now() > ONE_HOUR) {
                return;
              }

              return auth.invalidate().then(auth.getFreshToken);
            });
          })["catch"](noop);
          return;

        case PUSH_RECEIVED:
          // TODO: this if doesn't seem to make much sense
          // I'm too afraid to remove it right now though
          if (action.payload.action === CUSTOMER_DISCONNECTED) {
            handlePush({
              emit: emit,
              store: store
            }, action);
            return;
          }

          updateStateIfNeeded(store, action);
          handlePush({
            emit: emit,
            store: store
          }, action);
          return;

        case PUSH_RESPONSE_RECEIVED:
          updateStateIfNeeded(store, action);
          handleResponse({
            emit: emit
          }, action);
          return;

        case RECONNECT:
          failAllRequests(store, CONNECTION_LOST);
          socket.reconnect(action.payload.delay);
          return;

        case REQUEST_FAILED:
          {
            var _action$payload3 = action.payload,
                reject = _action$payload3.reject,
                _error = _action$payload3.error;
            reject(createError$1(_error));
            return;
          }

        case RESPONSE_RECEIVED:
          updateStateIfNeeded(store, action);
          handleResponse({
            emit: emit
          }, action);
          return;

        case SEND_REQUEST:
          {
            var state = store.getState();

            if (isDestroyed(state)) {
              failRequest(store, action, {
                code: SDK_DESTROYED,
                message: 'SDK destroyed.'
              });
              return;
            }

            if (!isConnected(state) && action.payload.source !== 'login') {
              failRequest(store, action, {
                code: NO_CONNECTION,
                message: 'No connection.'
              });
              return;
            }

            sendRequest$1(socket, action);
          }
          return;

        case SET_SELF_ID:
          emit('customer_id', action.payload.id);
          return;

        case SOCKET_DISCONNECTED:
          emit('disconnected', {
            reason: 'connection_lost'
          });
          return;

        case SOCKET_CONNECTED:
          loginTask.sendLogin(store);
          return;

        case SOCKET_RECOVERED:
          // don't emit if from consumer's perspective we haven't been connected
          if (!isConnected(store.getState())) {
            return;
          }

          emit('connection_recovered');
          return;

        case SOCKET_UNSTABLE:
          // don't emit if from consumer's perspective we haven't been connected
          if (!isConnected(store.getState())) {
            return;
          }

          emit('connection_unstable');
          return;

        case START_CONNECTION:
          socket.connect();
          store.dispatch(prefetchToken());
          return;

        case UPDATE_CUSTOMER_PAGE:
          if (!isConnected(store.getState())) {
            return;
          }

          sendRequestAction(store, sendRequest(UPDATE_CUSTOMER_PAGE$1, action.payload))["catch"](noop);
          return;

        default:
          return;
      }
    };
  });

  var HISTORY_EVENT_COUNT_TARGET = 25;

  var createState = function createState() {
    return {
      status: 'idle',
      queuedTasks: [],
      nextPageId: null
    };
  };

  var createChatHistoryIterator = function createChatHistoryIterator(sdk, chatId) {
    var historyState = createState();

    var next = function next(resolve, reject) {
      switch (historyState.status) {
        case 'idle':
          historyState.status = 'fetching';
          sdk.listThreads(historyState.nextPageId ? {
            chatId: chatId,
            pageId: historyState.nextPageId
          } : {
            chatId: chatId,
            minEventsCount: HISTORY_EVENT_COUNT_TARGET
          }).then(function (_ref) {
            var threads = _ref.threads,
                nextPageId = _ref.nextPageId;
            historyState.nextPageId = nextPageId;

            if (!historyState.nextPageId) {
              historyState.status = 'done';
              resolve({
                value: {
                  threads: [].concat(threads).reverse()
                },
                done: true
              });
            } else {
              historyState.status = 'idle';
              resolve({
                value: {
                  threads: [].concat(threads).reverse()
                },
                done: false
              });
            }

            var queuedTask = historyState.queuedTasks.shift();

            if (!queuedTask) {
              return;
            }

            next(queuedTask.resolve, queuedTask.reject);
          }, function (err) {
            var queuedTasks = historyState.queuedTasks;
            historyState.status = 'idle';
            historyState.queuedTasks = [];
            reject(err);
            queuedTasks.forEach(function (queuedTask) {
              return queuedTask.reject(err);
            });
          });
          return;

        case 'fetching':
          historyState.queuedTasks.push({
            resolve: resolve,
            reject: reject
          });
          return;

        case 'done':
          resolve({
            value: undefined,
            done: true
          });
          return;
      }
    };

    return {
      next: function (_next) {
        function next() {
          return _next.apply(this, arguments);
        }

        next.toString = function () {
          return _next.toString();
        };

        return next;
      }(function () {
        return new Promise(next);
      })
    };
  };

  // based on WebSocket's readyState - https://www.w3.org/TR/websockets/#the-websocket-interface
  var CONNECTING = 0;
  var OPEN = 1;
  var CLOSED = 3;

  // I've tried upgrading but it had some other problems and I couldn't debug the problem quickly

  var createWebSocketManager = function createWebSocketManager(url, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$query = _ref.query,
        query = _ref$query === void 0 ? {} : _ref$query;

    var queryString = buildQueryString(query);
    var finalUrl = queryString ? url + "?" + queryString : url;
    var emitter = createMitt();
    var backoff = createBackoff({
      min: 1000,
      max: 5000,
      jitter: 0.5
    });
    var state = CLOSED;
    var reconnectTimer;
    var socket = null;

    var openListener = function openListener() {
      state = OPEN;
      backoff.reset();
      emitter.emit('connect');
    };

    var closeListener = function closeListener() {
      close();
      reconnect();
      emitter.emit('disconnect');
    };

    var messageListener = function messageListener(_ref2) {
      var data = _ref2.data;
      emitter.emit('message', data);
    };

    var addEventListeners = function addEventListeners(instance) {
      instance.addEventListener('open', openListener);
      instance.addEventListener('close', closeListener);
      instance.addEventListener('message', messageListener);
    };

    var removeEventListeners = function removeEventListeners(instance) {
      instance.removeEventListener('open', openListener);
      instance.removeEventListener('close', closeListener);
      instance.removeEventListener('message', messageListener);
    };

    var close = function close() {
      clearTimeout(reconnectTimer);
      state = CLOSED;

      if (!socket) {
        return;
      }

      removeEventListeners(socket);
      socket.close();
      socket = null;
    };

    var connect = function connect() {
      state = CONNECTING;
      socket = new WebSocket(finalUrl);
      addEventListeners(socket);
    };

    var reconnect = function reconnect(delay) {
      if (delay === void 0) {
        delay = backoff.duration();
      }

      close();

      if (delay === 0) {
        connect();
        return;
      }

      reconnectTimer = setTimeout(connect, delay);
    };

    return {
      connect: function (_connect) {
        function connect() {
          return _connect.apply(this, arguments);
        }

        connect.toString = function () {
          return _connect.toString();
        };

        return connect;
      }(function () {
        if (state !== CLOSED) {
          throw new Error('Socket is already open or connecting.');
        }

        clearTimeout(reconnectTimer);
        connect();
      }),
      destroy: function destroy() {
        emitter.off();
        close();
      },
      disconnect: close,
      reconnect: reconnect,
      emit: function emit(data) {
        if (state !== OPEN) {
          throw new Error('Socket is not connected.');
        } // if we are connected we can be sure that socket is defined


        socket.send(data);
      },
      getReadyState: function getReadyState() {
        return state;
      },
      on: emitter.on,
      off: emitter.off
    };
  };

  var createConnectionHero = function createConnectionHero() {
    var resolve = noop;
    var timer;
    return {
      cancel: function cancel() {
        clearTimeout(timer);
        resolve = noop;
      },
      check: function check() {
        var deferred$1 = deferred();
        resolve = deferred$1.resolve;
        timer = setTimeout(function () {
          var err = new Error('Timeout.');
          err.code = 'TIMEOUT';
          deferred$1.reject(err);
        }, 2000);
        return deferred$1.promise;
      },
      resolve: function (_resolve) {
        function resolve() {
          return _resolve.apply(this, arguments);
        }

        resolve.toString = function () {
          return _resolve.toString();
        };

        return resolve;
      }(function () {
        clearTimeout(timer);
        resolve();
      })
    };
  };

  // based on server heartbeat interval - which is 25s
  var DEFAULT_RESCHEDULE_PING_TIMEOUT = 30 * 1000;

  // this is not quite type-safe (it doesn't constraint soure & sink types that much)
  // it's generic and really simple though, so we don't waste time to make this completely type-safe
  var forwardEvents = function forwardEvents(source, sink, types) {
    types.forEach(function (type) {
      source.on(type, function (data) {
        sink.emit(type, data);
      });
    });
  };

  var createPlatformClient = function createPlatformClient(url, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        _ref$query = _ref.query,
        query = _ref$query === void 0 ? {} : _ref$query,
        _ref$rescheduleTimeou = _ref.rescheduleTimeout,
        rescheduleTimeout = _ref$rescheduleTimeou === void 0 ? DEFAULT_RESCHEDULE_PING_TIMEOUT : _ref$rescheduleTimeou,
        _ref$emitter = _ref.emitter,
        emitter = _ref$emitter === void 0 ? createMitt() : _ref$emitter;

    var manager = createWebSocketManager(url, {
      query: query
    });
    var pingTimer;
    var connectionHero = createConnectionHero();

    var isSocketOpen = function isSocketOpen() {
      return manager.getReadyState() === OPEN;
    };

    var emit = function emit(frame) {
      manager.emit(JSON.stringify(frame));
      reschedulePing();
    };

    var ping = function ping() {
      // ping action doesn't extend Outgoing - it's internal, so doesn't have to be specified by a consumer
      // but it's safe to use emit with it
      emit({
        action: 'ping'
      });
    }; // extra measure to keep the connection alive
    // in theory this timer should never fire though
    // because we ping after each received heartbeat & sent request


    var reschedulePing = function reschedulePing() {
      clearTimeout(pingTimer);
      pingTimer = setTimeout(ping, rescheduleTimeout);
    };

    var cleanupPossiblyPendingTasks = function cleanupPossiblyPendingTasks() {
      connectionHero.cancel();
      clearTimeout(pingTimer);
    };

    forwardEvents(manager, emitter, ['connect', 'disconnect']);
    manager.on('connect', reschedulePing);
    manager.on('disconnect', cleanupPossiblyPendingTasks);
    manager.on('message', function (data) {
      connectionHero.resolve();
      var message = JSON.parse(data);

      if (message.action === 'ping') {
        return;
      } // Incoming requires `action` property to be a string, we cannot forbid in typings `ping` as valid action though
      // so TS cannot narrow the type down to `Incoming` here (it stays `Incoming | Ping`), that's why we are using `any` here


      emitter.emit('message', message);
    }); // React Native uses window as global object, but without addEventListener method

    if (typeof window !== 'undefined' && typeof window.addEventListener !== 'undefined') {
      window.addEventListener('online', function () {
        if (!isSocketOpen()) {
          return;
        }

        connectionHero.check().then(function () {
          connectionHero.cancel();
          emitter.emit('connection_recovered');
        }, function (err) {
          connectionHero.cancel();

          if (err.code !== 'TIMEOUT') {
            throw err;
          }

          manager.reconnect();
        });
        ping();
      });
      window.addEventListener('offline', function () {
        connectionHero.cancel();

        if (!isSocketOpen()) {
          return;
        }

        emitter.emit('connection_unstable');
      });
    }

    return _extends({}, manager, {
      destroy: function destroy() {
        cleanupPossiblyPendingTasks();
        manager.destroy();
      },
      disconnect: function disconnect() {
        cleanupPossiblyPendingTasks();
        manager.disconnect();
      },
      reconnect: function reconnect(delay) {
        cleanupPossiblyPendingTasks();
        manager.reconnect(delay);
      },
      emit: emit,
      on: emitter.on,
      off: emitter.off
    });
  };

  var initialize = function initialize(store, emitter) {
    var state = store.getState();
    var url = (getServerUrl(state) + "/rtm/ws").replace(/^https/, 'wss');
    return createPlatformClient(url, {
      query: {
        license_id: state.licenseId
      },
      emitter: emitter
    });
  };

  var createSocketClient = function createSocketClient(store) {
    var emitter = createMitt();
    var client = initialize(store, emitter);
    return _extends({}, Object.keys(client).reduce(function (proxy, method) {
      proxy[method] = function () {
        var _client;

        return (_client = client)[method].apply(_client, arguments);
      };

      return proxy;
    }, {}), {
      reinitialize: function reinitialize() {
        client.disconnect();
        client = initialize(store, emitter);
        client.connect();
      }
    });
  };

  var parseChatPropertiesDeletedPush = function parseChatPropertiesDeletedPush(payload) {
    return {
      chatId: payload.chat_id,
      properties: payload.properties
    };
  };

  var parseChatPropertiesUpdatedPush = function parseChatPropertiesUpdatedPush(payload) {
    return {
      chatId: payload.chat_id,
      properties: payload.properties
    };
  };

  var parseChatTransferredPush = function parseChatTransferredPush(payload) {
    var basePayload = {
      chatId: payload.chat_id,
      threadId: payload.thread_id,
      transferredTo: _extends({}, payload.transferred_to.agent_ids && {
        agentIds: payload.transferred_to.agent_ids
      }, payload.transferred_to.group_ids && {
        groupIds: payload.transferred_to.group_ids
      }),
      queue: payload.queue ? parseQueue(payload.queue) : null
    };

    if (payload.reason === 'manual') {
      return _extends({}, basePayload, {
        reason: payload.reason,
        requesterId: payload.requester_id
      });
    }

    return _extends({}, basePayload, {
      reason: payload.reason
    });
  };

  var parseCustomerPageUpdatedPush = function parseCustomerPageUpdatedPush(payload) {
    return {
      url: payload.url,
      title: payload.title,
      openedAt: payload.opened_at
    };
  };

  var parseCustomerUpdatedPush = function parseCustomerUpdatedPush(payload) {
    return _extends({
      id: payload.id
    }, parseCustomerOptionalProps(payload));
  };

  var parseEventPropertiesDeletedPush = function parseEventPropertiesDeletedPush(payload) {
    return {
      chatId: payload.chat_id,
      threadId: payload.thread_id,
      eventId: payload.event_id,
      properties: payload.properties
    };
  };

  var parseEventPropertiesUpdatedPush = function parseEventPropertiesUpdatedPush(payload) {
    return {
      chatId: payload.chat_id,
      threadId: payload.thread_id,
      eventId: payload.event_id,
      properties: payload.properties
    };
  };

  var parseEventUpdatedPush = function parseEventUpdatedPush(payload) {
    var threadId = payload.thread_id;
    return {
      chatId: payload.chat_id,
      threadId: threadId,
      event: parseEvent$1(threadId, payload.event)
    };
  };

  var parseEventsMarkedAsSeenPush = function parseEventsMarkedAsSeenPush(payload) {
    return {
      chatId: payload.chat_id,
      userId: payload.user_id,
      seenUpTo: payload.seen_up_to
    };
  };

  var parseGreetingAcceptedPush = function parseGreetingAcceptedPush(payload) {
    return {
      uniqueId: payload.unique_id
    };
  };

  var parseGetChatResponse = function parseGetChatResponse(payload) {
    return _extends({}, parseChatCommon(payload), {
      thread: payload.thread ? parseThread(payload.id, payload.thread) : null
    });
  };

  var parseIncomingChatPush = function parseIncomingChatPush(payload) {
    var chat = payload.chat;
    return {
      chat: _extends({}, parseChatCommon(chat), {
        thread: parseThread(chat.id, chat.thread)
      })
    };
  };

  var parseIncomingEventPush = function parseIncomingEventPush(payload) {
    return {
      chatId: payload.chat_id,
      event: parseEvent$1(payload.thread_id, payload.event)
    };
  };

  var parseIncomingGreetingPush = function parseIncomingGreetingPush(payload) {
    return parseGreeting(payload);
  };

  var parseIncomingRichMessagePostbackPush = function parseIncomingRichMessagePostbackPush(payload) {
    return {
      userId: payload.user_id,
      chatId: payload.chat_id,
      threadId: payload.thread_id,
      eventId: payload.event_id,
      postback: payload.postback
    };
  };

  var parseIncomingTypingIndicatorPush = function parseIncomingTypingIndicatorPush(payload) {
    var chatId = payload.chat_id,
        typingIndicator = payload.typing_indicator;
    return {
      chatId: chatId,
      typingIndicator: {
        authorId: typingIndicator.author_id,
        isTyping: typingIndicator.is_typing
      }
    };
  };

  var parseQueuePositionUpdatedPush = function parseQueuePositionUpdatedPush(payload) {
    return {
      chatId: payload.chat_id,
      threadId: payload.thread_id,
      queue: parseQueueUpdate(payload.queue)
    };
  };

  var parseThreadPropertiesDeletedPush = function parseThreadPropertiesDeletedPush(payload) {
    return {
      chatId: payload.chat_id,
      threadId: payload.thread_id,
      properties: payload.properties
    };
  };

  var parseThreadPropertiesUpdatedPush = function parseThreadPropertiesUpdatedPush(payload) {
    return {
      chatId: payload.chat_id,
      threadId: payload.thread_id,
      properties: payload.properties
    };
  };

  var parseUserAddedToChatPush = function parseUserAddedToChatPush(payload) {
    return {
      chatId: payload.chat_id,
      user: parseChatUser(payload.user),
      present: payload.user.present
    };
  };

  var parseUserRemovedFromChatPush = function parseUserRemovedFromChatPush(payload) {
    return {
      chatId: payload.chat_id,
      userId: payload.user_id
    };
  };

  var parseFields = function parseFields(fields) {
    return fields.map(function (field) {
      switch (field.type) {
        case 'group_chooser':
          return _extends({}, field, {
            options: field.options.map(function (_ref) {
              var groupId = _ref.group_id,
                  option = _objectWithoutPropertiesLoose(_ref, ["group_id"]);

              return _extends({}, option, {
                groupId: groupId
              });
            })
          });

        case 'rating':
          {
            var commentLabel = field.comment_label,
                parsed = _objectWithoutPropertiesLoose(field, ["comment_label"]);

            return _extends({}, parsed, {
              commentLabel: commentLabel
            });
          }

        default:
          return field;
      }
    });
  };

  var parseTicketFormFields = function parseTicketFormFields(fields) {
    var withFakeIds = fields.map(function (field, index) {
      return _extends({}, field, {
        id: String(index)
      });
    });
    return parseFields(withFakeIds);
  };

  var parseForm = function parseForm(form) {
    var isTicketForm = !('id' in form.fields[0]);
    return {
      id: form.id,
      fields: isTicketForm ? parseTicketFormFields(form.fields) : parseFields(form.fields)
    };
  };

  var parseGetFormResponse = function parseGetFormResponse(payload) {
    if (!payload.enabled) {
      return payload;
    }

    return _extends({}, payload, {
      form: parseForm(payload.form)
    });
  };

  var parseGetUrlInfoResponse = function parseGetUrlInfoResponse(payload) {
    var urlInfo = {
      url: payload.url
    };

    if (payload.title) {
      urlInfo.title = payload.title;
    }

    if (payload.description) {
      urlInfo.description = payload.description;
    }

    if (payload.image_url) {
      urlInfo.imageUrl = "https://" + payload.image_url;

      if (payload.image_width && payload.image_height) {
        urlInfo.imageWidth = payload.image_width;
        urlInfo.imageHeight = payload.image_height;
      }
    }

    return urlInfo;
  };

  var getAvailabilityBasedOnDynamicConfig = function getAvailabilityBasedOnDynamicConfig(_ref2) {
    var onlineGroups = _ref2.online_groups_ids,
        customerGroups = _ref2.customer_groups;

    // this might be missing if all groups are offline
    if (!onlineGroups) {
      return 'offline';
    }

    var monitoringGroupId = customerGroups.monitoring.id;
    return includes(monitoringGroupId, onlineGroups) ? 'online' : 'offline';
  };

  var parseListChatsResponse = function parseListChatsResponse(payload) {
    var chatsSummary = payload.chats_summary.map(function (_ref3) {
      var id = _ref3.id,
          active = _ref3.active,
          access = _ref3.access,
          lastThreadCreatedAt = _ref3.last_thread_created_at,
          lastThreadId = _ref3.last_thread_id,
          lastEventsPerType = _ref3.last_event_per_type,
          _ref3$properties = _ref3.properties,
          properties = _ref3$properties === void 0 ? {} : _ref3$properties,
          users = _ref3.users;
      var chatSummary = {
        id: id,
        active: active,
        access: parseAccess(access),
        properties: properties,
        users: users.map(parseChatUser),
        lastThreadId: lastThreadId || null,
        lastThreadCreatedAt: lastThreadCreatedAt || null,
        eventsSeenUpToMap: getEventsSeenUpToMap(users)
      };

      if (!lastEventsPerType) {
        return chatSummary;
      }

      chatSummary.lastEventsPerType = mapValues(function (lastEventPerType) {
        return parseEvent$1(lastEventPerType.thread_id, lastEventPerType.event);
      }, lastEventsPerType);
      var refinedLastEventsPerType = lastEventsPerType;
      var lastEventSummariesArray = Object.keys(refinedLastEventsPerType).map(function (eventType) {
        return refinedLastEventsPerType[eventType];
      });
      var lastEventSummary = last(lastEventSummariesArray.sort(function (eventSummaryA, eventSummaryB) {
        return eventSummaryA.thread_id === eventSummaryB.thread_id ? stringCompare(eventSummaryA.event.created_at, eventSummaryB.event.created_at) : stringCompare(eventSummaryA.thread_created_at, eventSummaryB.thread_created_at);
      }));

      if (lastEventSummary) {
        chatSummary.lastEvent = chatSummary.lastEventsPerType[lastEventSummary.event.type];
      }

      return chatSummary;
    });
    return {
      chatsSummary: numericSortBy(function (_ref4) {
        var lastEvent = _ref4.lastEvent,
            order = _ref4.order;
        return -1 * (lastEvent !== undefined ? lastEvent.timestamp : order);
      }, chatsSummary),
      totalChats: payload.total_chats,
      users: uniqBy(function (user) {
        return user.id;
      }, flatMap(function (summary) {
        return summary.users;
      }, chatsSummary)),
      previousPageId: payload.previous_page_id || null,
      nextPageId: payload.next_page_id || null
    };
  };

  var parseListGroupStatusesResponse = function parseListGroupStatusesResponse(payload) {
    return payload.groups_status;
  };

  var parseListThreadsResponse = function parseListThreadsResponse(request, payload) {
    return {
      threads: payload.threads.map(function (thread) {
        return parseThread(request.payload.chat_id, thread);
      }),
      previousPageId: payload.previous_page_id || null,
      nextPageId: payload.next_page_id || null
    };
  };

  var parseLoginResponse = function parseLoginResponse(payload) {
    var dynamicConfig = payload.__priv_dynamic_config,
        chats = payload.chats,
        greeting = payload.greeting;
    return _extends({
      dynamicConfig: dynamicConfig,
      customer: parseCustomer(payload.customer),
      availability: getAvailabilityBasedOnDynamicConfig(dynamicConfig),
      chats: chats.map(function (chat) {
        return {
          id: chat.chat_id,
          active: 'has_active_thread' in chat ? chat.has_active_thread : // temporary fallback, waiting for API to move this flag into `chats` array
          payload.has_active_thread,
          hasUnreadEvents: chat.has_unread_events
        };
      })
    }, greeting && {
      greeting: parseGreeting(greeting)
    });
  };

  var parsePush = function parsePush(push) {
    switch (push.action) {
      case CHAT_DEACTIVATED:
        return {
          action: push.action,
          payload: {
            chatId: push.payload.chat_id
          }
        };

      case CHAT_PROPERTIES_DELETED:
        return {
          action: push.action,
          payload: parseChatPropertiesDeletedPush(push.payload)
        };

      case CHAT_PROPERTIES_UPDATED:
        return {
          action: push.action,
          payload: parseChatPropertiesUpdatedPush(push.payload)
        };

      case CHAT_TRANSFERRED:
        return {
          action: push.action,
          payload: parseChatTransferredPush(push.payload)
        };

      case CUSTOMER_SIDE_STORAGE_UPDATED:
        return {
          action: push.action,
          payload: push.payload
        };

      case CUSTOMER_DISCONNECTED:
        return {
          action: push.action,
          payload: push.payload
        };

      case CUSTOMER_PAGE_UPDATED:
        return {
          action: push.action,
          payload: parseCustomerPageUpdatedPush(push.payload)
        };

      case CUSTOMER_UPDATED:
        return {
          action: push.action,
          payload: parseCustomerUpdatedPush(push.payload)
        };

      case EVENT_PROPERTIES_DELETED:
        return {
          action: push.action,
          payload: parseEventPropertiesDeletedPush(push.payload)
        };

      case EVENT_PROPERTIES_UPDATED:
        return {
          action: push.action,
          payload: parseEventPropertiesUpdatedPush(push.payload)
        };

      case EVENT_UPDATED:
        return {
          action: push.action,
          payload: parseEventUpdatedPush(push.payload)
        };

      case EVENTS_MARKED_AS_SEEN:
        return {
          action: push.action,
          payload: parseEventsMarkedAsSeenPush(push.payload)
        };

      case GREETING_ACCEPTED:
        return {
          action: push.action,
          payload: parseGreetingAcceptedPush(push.payload)
        };

      case GREETING_CANCELED:
        return {
          action: push.action,
          // 'greeting_canceled' has the same payload as `greeting_accepted`
          payload: parseGreetingAcceptedPush(push.payload)
        };

      case INCOMING_CHAT:
        return {
          action: push.action,
          payload: parseIncomingChatPush(push.payload)
        };

      case INCOMING_EVENT:
        return {
          action: push.action,
          payload: parseIncomingEventPush(push.payload)
        };

      case INCOMING_GREETING:
        return {
          action: push.action,
          payload: parseIncomingGreetingPush(push.payload)
        };

      case INCOMING_MULTICAST:
        return {
          action: push.action,
          payload: push.payload
        };

      case INCOMING_RICH_MESSAGE_POSTBACK:
        return {
          action: push.action,
          payload: parseIncomingRichMessagePostbackPush(push.payload)
        };

      case INCOMING_TYPING_INDICATOR:
        return {
          action: push.action,
          payload: parseIncomingTypingIndicatorPush(push.payload)
        };

      case QUEUE_POSITION_UPDATED:
        return {
          action: push.action,
          payload: parseQueuePositionUpdatedPush(push.payload)
        };

      case THREAD_PROPERTIES_DELETED:
        return {
          action: push.action,
          payload: parseThreadPropertiesDeletedPush(push.payload)
        };

      case THREAD_PROPERTIES_UPDATED:
        return {
          action: push.action,
          payload: parseThreadPropertiesUpdatedPush(push.payload)
        };

      case USER_ADDED_TO_CHAT:
        return {
          action: push.action,
          payload: parseUserAddedToChatPush(push.payload)
        };

      case USER_REMOVED_FROM_CHAT:
        return {
          action: push.action,
          payload: parseUserRemovedFromChatPush(push.payload)
        };
    }
  };
  var parseResponse = function parseResponse(_ref5) {
    var request = _ref5.request,
        response = _ref5.response;

    switch (response.action) {
      case ACCEPT_GREETING:
        return {
          action: response.action,
          payload: SUCCESS
        };

      case CANCEL_GREETING:
        return {
          action: response.action,
          payload: SUCCESS
        };

      case DELETE_CHAT_PROPERTIES:
        return {
          action: response.action,
          payload: SUCCESS
        };

      case DELETE_EVENT_PROPERTIES:
        return {
          action: response.action,
          payload: SUCCESS
        };

      case DELETE_THREAD_PROPERTIES:
        return {
          action: response.action,
          payload: SUCCESS
        };

      case GET_CHAT:
        return {
          action: response.action,
          payload: parseGetChatResponse(response.payload)
        };

      case GET_CUSTOMER:
        return {
          action: response.action,
          payload: parseCustomer(response.payload)
        };

      case GET_FORM:
        return {
          action: response.action,
          payload: parseGetFormResponse(response.payload)
        };

      case GET_PREDICTED_AGENT:
        return {
          action: response.action,
          payload: parsePredictedAgent(response.payload)
        };

      case GET_URL_INFO:
        return {
          action: response.action,
          payload: parseGetUrlInfoResponse(response.payload)
        };

      case LIST_CHATS:
        return {
          action: response.action,
          payload: parseListChatsResponse(response.payload)
        };

      case LIST_GROUP_STATUSES:
        return {
          action: response.action,
          payload: parseListGroupStatusesResponse(response.payload)
        };

      case LIST_THREADS:
        return {
          action: response.action,
          payload: parseListThreadsResponse(request, response.payload)
        };

      case LOGIN:
        return {
          action: response.action,
          payload: parseLoginResponse(response.payload)
        };

      case MARK_EVENTS_AS_SEEN:
        return {
          action: response.action,
          payload: SUCCESS
        };

      case SEND_SNEAK_PEEK:
        return {
          action: response.action,
          payload: SUCCESS
        };

      case SET_CUSTOMER_SESSION_FIELDS:
        return {
          action: response.action,
          payload: SUCCESS
        };

      case SEND_RICH_MESSAGE_POSTBACK:
        return {
          action: response.action,
          payload: SUCCESS
        };

      case UPDATE_CHAT_PROPERTIES:
        return {
          action: response.action,
          payload: SUCCESS
        };

      case UPDATE_CUSTOMER:
        return {
          action: response.action,
          payload: SUCCESS
        };

      case UPDATE_CUSTOMER_PAGE$1:
        return {
          action: response.action,
          payload: SUCCESS
        };

      case UPDATE_EVENT_PROPERTIES:
        return {
          action: response.action,
          payload: SUCCESS
        };

      case UPDATE_THREAD_PROPERTIES:
        return {
          action: response.action,
          payload: SUCCESS
        };
    }
  };
  var parseServerError = function parseServerError(error) {
    return {
      code: error.type.toUpperCase(),
      message: error.message
    };
  };

  var handleResponseError = function handleResponseError(_ref, response) {
    var dispatch = _ref.dispatch,
        getState = _ref.getState;
    var requestId = response.request_id,
        payload = response.payload;

    var _getRequest = getRequest(getState(), requestId),
        reject = _getRequest.reject;

    dispatch({
      type: REQUEST_FAILED,
      payload: {
        id: requestId,
        reject: reject,
        error: parseServerError(payload.error)
      }
    });
  };

  var handleResponse$1 = function handleResponse(_ref2, response) {
    var dispatch = _ref2.dispatch,
        getState = _ref2.getState;
    var requestId = response.request_id;

    var _getRequest2 = getRequest(getState(), requestId),
        promise = _getRequest2.promise,
        resolve = _getRequest2.resolve,
        request = _getRequest2.request;

    var parsedResponse = parseResponse({
      request: request,
      response: response
    });
    dispatch({
      type: RESPONSE_RECEIVED,
      payload: _extends({
        id: requestId,
        promise: promise,
        resolve: resolve
      }, parsedResponse)
    });
  };

  var handlePushResponse = function handlePushResponse(_ref3, response) {
    var dispatch = _ref3.dispatch,
        getState = _ref3.getState;
    var requestId = response.request_id;

    var _getRequest3 = getRequest(getState(), requestId),
        promise = _getRequest3.promise,
        resolve = _getRequest3.resolve;

    var parsedPush = parsePush(response);
    dispatch({
      type: PUSH_RESPONSE_RECEIVED,
      payload: _extends({
        id: requestId,
        promise: promise,
        resolve: resolve
      }, parsedPush)
    });
  };

  var handlePush$1 = function handlePush(store, push) {
    var parsedPush = parsePush(push);

    if (!parsedPush) {
      // defensive measure against receiving unknown push
      return;
    }

    store.dispatch({
      type: PUSH_RECEIVED,
      payload: parsedPush
    });
  };

  var socketListener = (function (store, socket) {
    var dispatch = store.dispatch;
    socket.on('connect', function () {
      dispatch({
        type: SOCKET_CONNECTED
      });
    });
    socket.on('message', function (message) {
      if (message.type === 'response') {
        if (!message.success) {
          handleResponseError(store, message);
          return;
        }

        switch (message.action) {
          case DEACTIVATE_CHAT:
          case RESUME_CHAT:
          case SEND_EVENT:
          case START_CHAT:
            // those are requests with indirect responses
            return;

          default:
            handleResponse$1(store, message);
            return;
        }
      }

      if ('request_id' in message) {
        switch (message.action) {
          case CHAT_DEACTIVATED:
          case INCOMING_CHAT:
          case INCOMING_EVENT:
            // those are acting as indirect responses
            handlePushResponse(store, message);
            return;
        }
      }

      handlePush$1(store, message);
    });
    socket.on('disconnect', function () {
      failAllRequests(store, CONNECTION_LOST);

      if (getConnectionStatus(store.getState()) === CONNECTED) {
        store.dispatch(socketDisconnected());
      }
    });
    socket.on('connection_unstable', function () {
      dispatch({
        type: SOCKET_UNSTABLE
      });
    });
    socket.on('connection_recovered', function () {
      dispatch({
        type: SOCKET_RECOVERED
      });
    });
    return socket.off;
  });

  var INCORRECT_REQUESTER_STRUCTURE = 'incorrect requester structure';

  var appendString = function appendString(input, str) {
    return input.length ? input + "\n" + str : str;
  };

  var createTicketBody = function createTicketBody(state, _ref) {
    var fields = _ref.fields,
        customerId = _ref.customerId,
        _ref$groupId = _ref.groupId,
        groupId = _ref$groupId === void 0 ? state.groupId : _ref$groupId,
        timeZone = _ref.timeZone;

    var ticketBody = _extends({
      licence_id: state.licenseId,
      ticket_message: '',
      offline_message: '',
      visitor_id: customerId,
      requester: {}
    }, typeof groupId === 'number' && {
      group: groupId
    }, state.page && {
      source: {
        url: state.page.url
      }
    }, timeZone && {
      timezone: timeZone
    });

    return fields.reduce(function (body, field) {
      switch (field.type) {
        case 'subject':
          {
            var value = field.answer;
            var text = value ? field.label + " " + value : field.label;

            if (value) {
              body.subject = value;
            }

            body.offline_message = appendString(body.offline_message, text);
            return body;
          }

        case 'name':
          {
            var _value = field.answer;

            var _text = _value ? field.label + " " + _value : field.label;

            if (_value) {
              body.requester.name = _value;
            }

            body.offline_message = appendString(body.offline_message, _text);
            return body;
          }

        case 'email':
          {
            var _value2 = field.answer;

            var _text2 = _value2 ? field.label + " " + _value2 : field.label;

            body.requester.mail = _value2;
            body.offline_message = appendString(body.offline_message, _text2);
            return body;
          }

        case 'question':
        case 'textarea':
          {
            var _value3 = field.answer;

            var _text3 = _value3 ? field.label + " " + _value3 : field.label;

            body.offline_message = appendString(body.offline_message, _text3);
            body.ticket_message = appendString(body.ticket_message, _text3);
            return body;
          }

        case 'radio':
        case 'select':
          {
            var _value4 = field.answer && field.answer.label;

            var _text4 = _value4 ? field.label + " " + _value4 : field.label;

            body.offline_message = appendString(body.offline_message, _text4);
            body.ticket_message = appendString(body.ticket_message, _text4);
            return body;
          }

        case 'checkbox':
          {
            var _value5 = field.answers && field.answers.map(function (answer) {
              return answer.label;
            }).join(', ');

            var _text5 = _value5 ? field.label + " " + _value5 : field.label;

            body.offline_message = appendString(body.offline_message, _text5);
            body.ticket_message = appendString(body.ticket_message, _text5);
            return body;
          }

        default:
          return body;
      }
    }, ticketBody);
  };

  var sendTicketForm = function sendTicketForm(store, auth, _ref2) {
    var filledForm = _ref2.filledForm,
        groupId = _ref2.groupId,
        timeZone = _ref2.timeZone;
    return auth.getToken().then(function (token) {
      var state = store.getState();

      if (getSelfId(state) === null) {
        store.dispatch(setSelfId(token.entityId));
      }

      var url = getApiOrigin(state) + "/v2/tickets/new";
      var body = createTicketBody(state, {
        fields: filledForm.fields,
        customerId: token.entityId,
        groupId: groupId,
        timeZone: timeZone
      });
      return unfetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }).then(function (response) {
        if (response.ok) {
          return response.json().then(function (res) {
            return _extends({}, res, {
              text: body.ticket_message
            });
          });
        } // we actually should normalize this somehow


        if (response.status === 400 || response.status === 422) {
          var errHandler = function errHandler(error) {
            if (!error || !error.errors) {
              // TODO: I honestly don't know if this can even be reached and even if it is - What error should be thrown here
              throw new Error();
            } // we receive some hardcore aggregate error here 😱


            var firstError = error.errors[0];
            var type = Object.keys(firstError)[0];

            if (type === INCORRECT_REQUESTER_STRUCTURE) {
              throw createError$1({
                message: firstError[INCORRECT_REQUESTER_STRUCTURE][0],
                code: 'VALIDATION'
              });
            }

            throw new Error();
          };

          return response.json().then(errHandler, errHandler);
        }

        throw new Error();
      });
    });
  };

  var toFormData = function toFormData(object) {
    var formData = new FormData();
    Object.keys(object).forEach(function (key) {
      return formData.append(key, object[key]);
    });
    return formData;
  };

  var UPLOAD_FAILED = 'UPLOAD_FAILED';
  var UPLOAD_CANCELED = 'UPLOAD_CANCELED';

  var uploadFile = function uploadFile(url, data, _temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        headers = _ref.headers,
        _ref$method = _ref.method,
        method = _ref$method === void 0 ? 'POST' : _ref$method,
        onProgress = _ref.onProgress,
        _ref$withCredentials = _ref.withCredentials,
        withCredentials = _ref$withCredentials === void 0 ? false : _ref$withCredentials;

    var xhr = new XMLHttpRequest();
    var upload = new Promise(function (resolve, reject) {
      if (typeof onProgress === 'function') {
        xhr.upload.onprogress = function (event) {
          onProgress(event.loaded / event.total);
        };
      }

      xhr.onload = function () {
        var response;

        try {
          response = JSON.parse(xhr.response);
        } catch (err) {
          response = xhr.response;
        }

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(response);
          return;
        }

        var err = new Error('Upload failed.');
        err.code = UPLOAD_FAILED;
        err.response = response;
        reject(err);
      };

      xhr.onerror = function () {
        var err = new Error('Upload failed.');
        err.code = UPLOAD_FAILED;
        reject(err);
      };

      xhr.onabort = function () {
        var err = new Error('Upload canceled.');
        err.code = UPLOAD_CANCELED;
        reject(err);
      };

      xhr.open(method, url);
      xhr.withCredentials = withCredentials;

      if (headers) {
        Object.keys(headers).forEach(function (header) {
          return xhr.setRequestHeader(header, headers[header]);
        });
      }

      xhr.send(toFormData(data));
    });
    return {
      promise: upload,
      cancel: function cancel() {
        xhr.abort();
      }
    };
  };

  var KILOBYTE = 1024;
  var MEGABYTE = 1024 * KILOBYTE;
  var GIGABYTE = 1024 * MEGABYTE;
  var SIZE_LIMIT = 10 * MEGABYTE;

  var formatBytes = function formatBytes(bytes, precision) {
    if (precision === void 0) {
      precision = 2;
    }

    if (bytes < KILOBYTE) {
      return bytes + " b";
    }

    var kilobytes = bytes / 1024;

    if (bytes < MEGABYTE) {
      return kilobytes.toFixed(precision) + " kb";
    }

    var megabytes = kilobytes / 1024;

    if (bytes < GIGABYTE) {
      return megabytes.toFixed(precision) + " MB";
    }

    var gigabytes = megabytes / 1024;
    return gigabytes.toFixed(precision) + " GB";
  };

  var validateFile = function validateFile(file) {
    if (file.size > SIZE_LIMIT) {
      throw createError$1({
        message: "The file is too big (max size is " + formatBytes(SIZE_LIMIT) + ").",
        code: TOO_BIG_FILE
      });
    }
  };

  var uploadFile$1 = function uploadFile$1(_ref, _ref2) {
    var auth = _ref.auth,
        store = _ref.store;
    var file = _ref2.file,
        onProgress = _ref2.onProgress;
    var upload;
    var cancelled = false;
    var send = new Promise(function (resolve, reject) {
      validateFile(file);
      var state = store.getState();
      var query = buildQueryString({
        license_id: state.licenseId
      });
      var url = getServerUrl(state) + "/action/" + UPLOAD_FILE + "?" + query;
      var payload = {
        file: file
      };
      auth.getToken().then(function (token) {
        if (cancelled) {
          reject(new Error('Upload cancelled.'));
          return;
        }

        upload = uploadFile(url, payload, {
          headers: {
            Authorization: token.tokenType + " " + token.accessToken
          },
          onProgress: onProgress
        });
        upload.promise.then(resolve, function (uploadError) {
          // an error might not come from a server
          if (!uploadError.response) {
            reject(uploadError);
            return;
          }

          var _uploadError$response = uploadError.response.error,
              type = _uploadError$response.type,
              message = _uploadError$response.message;
          reject(createError$1({
            message: message,
            code: type.toUpperCase()
          }));
        });
      });
    });
    return {
      promise: send,
      cancel: function cancel() {
        if (cancelled) {
          return;
        }

        cancelled = true;

        if (upload) {
          upload.cancel();
        }
      }
    };
  };

  var makeGraylogRequest = function makeGraylogRequest(url, body) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.src = url + "?" + body;
      img.onerror = noop;

      img.onload = function () {
        return resolve();
      };
    });
  };

  /**
   * Logs event to Graylog with provided config data.
   * Logging request is fired only when all of those conditions are true:
   * 1. package is used in lc production environment
   * 2. package is used standalone because only then "customer_sdk" will be set to customer_sdk
   */
  var log = function log(_ref) {
    var env = _ref.env,
        licenseId = _ref.licenseId,
        eventName = _ref.eventName;

    if (env !== 'production' || "customer_sdk" !== 'customer_sdk') {
      return Promise.resolve();
    }

    var message = {
      event_name: eventName,
      severity: 'Informational',
      sdkVersion: "3.0.0"
    };
    var body = {
      licence_id: licenseId,
      event_id: 'chat_widget_customer_sdk',
      message: JSON.stringify(message)
    };
    return makeGraylogRequest('https://queue.livechatinc.com/logs', buildQueryString(body));
  };

  var LISTENER_IDENTITY = 'LISTENER_IDENTITY';
  var listenersMap = {};

  var createDebuggedMethods = function createDebuggedMethods(methods, prefix) {
    if (prefix === void 0) {
      prefix = '';
    }

    var methodNames = Object.keys(methods);
    return methodNames.map(function (methodName) {
      var method = methods[methodName];
      return function () {
        var _console;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        (_console = console).info.apply(_console, [prefix + "." + methodName + "() ===>"].concat(args));

        var result = method.apply(void 0, args);

        if (typeof (result == null ? void 0 : result.then) === 'function') {
          return result.then(function (data) {
            console.info(prefix + "." + methodName + "() <===", data);
            return data;
          }, function (err) {
            console.error(prefix + "." + methodName + "() <===", err);
            throw err;
          });
        }

        return result;
      };
    }).reduce(function (acc, method, index) {
      acc[methodNames[index]] = method;
      return acc;
    }, {});
  };

  var createEnhancedListener = function createEnhancedListener(label, event, listener) {
    if (listener[LISTENER_IDENTITY] === undefined) {
      Object.defineProperty(listener, LISTENER_IDENTITY, {
        value: {}
      });
    }

    if (listener[LISTENER_IDENTITY][event]) {
      var enhancedListenerId = listener[LISTENER_IDENTITY][event];
      return listenersMap[enhancedListenerId];
    }

    var enhancedListener = function enhancedListener(data) {
      console.info("." + label + "(\"" + event + "\") <===", data);
      listener(data);
    };

    var uniqueId = generateUniqueId(listenersMap);
    listener[LISTENER_IDENTITY][event] = uniqueId;
    listenersMap[uniqueId] = enhancedListener;
    return enhancedListener;
  }; // TODO: this really should just accept & return CustomerSdk type


  var debug = (function (_sdk) {
    var sdk = _sdk;

    var _on = sdk.on,
        _once = sdk.once,
        _off = sdk.off,
        _getChatHistory = sdk.getChatHistory,
        auth = sdk.auth,
        rest = _objectWithoutPropertiesLoose(sdk, ["on", "once", "off", "getChatHistory", "auth"]);

    var methods = createDebuggedMethods(rest);
    return Object.freeze(_extends({
      auth: Object.freeze(createDebuggedMethods(auth, '.auth'))
    }, methods, {
      getChatHistory: function getChatHistory() {
        var _console2;

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        (_console2 = console).info.apply(_console2, [".getChatHistory()"].concat(args));

        var history = _getChatHistory.apply(void 0, args);

        var logLabel = 'history.next()';
        return {
          next: function next() {
            var _console3;

            (_console3 = console).info.apply(_console3, [logLabel + " ===>"].concat(args));

            return history.next().then(function (data) {
              var _console4;

              (_console4 = console).info.apply(_console4, [logLabel + " <==="].concat(args, [data]));

              return data;
            }, function (err) {
              var _console5;

              (_console5 = console).error.apply(_console5, [logLabel + " <==="].concat(args, [err]));

              throw err;
            });
          }
        };
      },
      off: function off(event, listener) {
        console.info(".off(\"" + event + "\", " + (listener.name || 'anonymous') + ")");
        var enhancedListener = listener;

        if (listener[LISTENER_IDENTITY] !== undefined) {
          var enhancedListenerId = listener[LISTENER_IDENTITY][event];
          enhancedListener = listenersMap[enhancedListenerId];
        }

        _off(event, enhancedListener);
      },
      on: function on(event, listener) {
        _on(event, createEnhancedListener('on', event, listener));
      },
      once: function once(event, listener) {
        _once(event, createEnhancedListener('once', event, listener));
      }
    }));
  });

  var CHATS_PAGINATION_MAX_LIMIT = 25;
  var init = function init(config, env) {
    if (env === void 0) {
      env = 'production';
    }

    validateConfig(config);

    var _config$autoConnect = config.autoConnect,
        autoConnect = _config$autoConnect === void 0 ? true : _config$autoConnect,
        customerDataProvider = config.customerDataProvider,
        instanceConfig = _objectWithoutPropertiesLoose(config, ["autoConnect", "customerDataProvider"]);

    var store = finalCreateStore(_extends({}, instanceConfig, {
      env: env
    }));
    var emitter = createMitt();
    var socket = createSocketClient(store);
    var auth = createAuth(instanceConfig, env);
    store.addSideEffectsHandler(createSideEffectsHandler({
      emitter: emitter,
      socket: socket,
      auth: auth,
      customerDataProvider: customerDataProvider
    }));
    socketListener(store, socket);

    var sendRequestAction$1 = sendRequestAction.bind(null, store);

    var startConnection = function startConnection() {
      store.dispatch({
        type: START_CONNECTION
      });
    };

    var api = Object.freeze({
      acceptGreeting: function acceptGreeting(_ref) {
        var greetingId = _ref.greetingId,
            uniqueId = _ref.uniqueId;
        return sendRequestAction$1(sendRequest(ACCEPT_GREETING, {
          greeting_id: greetingId,
          unique_id: uniqueId
        }));
      },
      auth: auth,
      cancelGreeting: function cancelGreeting(_ref2) {
        var uniqueId = _ref2.uniqueId;
        return sendRequestAction$1(sendRequest(CANCEL_GREETING, {
          unique_id: uniqueId
        }));
      },
      cancelRate: function cancelRate(params) {
        var chatId = params.chatId,
            _params$properties = params.properties,
            properties = _params$properties === void 0 ? ['score'] : _params$properties;
        return api.listThreads({
          chatId: chatId
        }).then(function (_ref3) {
          var threads = _ref3.threads;

          if (!threads.length) {
            throw createError$1({
              message: "There is no thread in \"" + chatId + "\".",
              code: MISSING_CHAT_THREAD
            });
          }

          return api.deleteThreadProperties({
            chatId: chatId,
            threadId: threads[0].id,
            properties: {
              rating: properties
            }
          });
        });
      },
      connect: startConnection,
      deactivateChat: function deactivateChat(_ref4) {
        var id = _ref4.id;
        return sendRequestAction$1(sendRequest(DEACTIVATE_CHAT, {
          id: id
        }));
      },
      deleteChatProperties: function deleteChatProperties(_ref5) {
        var id = _ref5.id,
            properties = _ref5.properties;
        return sendRequestAction$1(sendRequest(DELETE_CHAT_PROPERTIES, {
          id: id,
          properties: properties
        }));
      },
      deleteEventProperties: function deleteEventProperties(_ref6) {
        var chatId = _ref6.chatId,
            threadId = _ref6.threadId,
            eventId = _ref6.eventId,
            properties = _ref6.properties;
        return sendRequestAction$1(sendRequest(DELETE_EVENT_PROPERTIES, {
          chat_id: chatId,
          thread_id: threadId,
          event_id: eventId,
          properties: properties
        }));
      },
      deleteThreadProperties: function deleteThreadProperties(_ref7) {
        var chatId = _ref7.chatId,
            threadId = _ref7.threadId,
            properties = _ref7.properties;
        return sendRequestAction$1(sendRequest(DELETE_THREAD_PROPERTIES, {
          chat_id: chatId,
          thread_id: threadId,
          properties: properties
        }));
      },
      destroy: function destroy$1() {
        store.dispatch(destroy('manual'));
      },
      disconnect: function disconnect() {
        store.dispatch(pauseConnection('manual'));
      },
      getChat: function getChat(_ref8) {
        var chatId = _ref8.chatId,
            threadId = _ref8.threadId;
        return sendRequestAction$1(sendRequest(GET_CHAT, {
          chat_id: chatId,
          thread_id: threadId
        }));
      },
      getChatHistory: function getChatHistory(_ref9) {
        var chatId = _ref9.chatId;
        return createChatHistoryIterator(api, chatId);
      },
      getCustomer: function getCustomer() {
        return sendRequestAction$1(sendRequest(GET_CUSTOMER, {}));
      },
      getForm: function getForm(_ref10) {
        var groupId = _ref10.groupId,
            type = _ref10.type;
        return sendRequestAction$1(sendRequest(GET_FORM, {
          group_id: groupId,
          type: type
        }));
      },
      getPredictedAgent: function getPredictedAgent(params) {
        if (params === void 0) {
          params = {};
        }

        var _params = params,
            groupId = _params.groupId;
        return sendRequestAction$1(sendRequest(GET_PREDICTED_AGENT, typeof groupId === 'number' ? {
          group_id: groupId
        } : {}));
      },
      getUrlInfo: function getUrlInfo(_ref11) {
        var url = _ref11.url;
        return sendRequestAction$1(sendRequest(GET_URL_INFO, {
          url: url
        }));
      },
      listChats: function listChats(params) {
        if (params === void 0) {
          params = {};
        }

        if ('limit' in params && typeof params.limit === 'number' && params.limit > CHATS_PAGINATION_MAX_LIMIT) {
          return Promise.reject(new Error("Specified limit is too high (max " + CHATS_PAGINATION_MAX_LIMIT + ")."));
        }

        return sendRequestAction$1(sendRequest(LIST_CHATS, params.pageId === undefined ? {
          limit: params.limit || 10
        } : {
          page_id: params.pageId
        }));
      },
      listGroupStatuses: function listGroupStatuses(_temp) {
        var _ref12 = _temp === void 0 ? {} : _temp,
            groupIds = _ref12.groupIds;

        return sendRequestAction$1(sendRequest(LIST_GROUP_STATUSES, groupIds ? {
          group_ids: groupIds
        } : {
          all: true
        }));
      },
      listThreads: function listThreads(params) {
        return sendRequestAction$1(sendRequest(LIST_THREADS, params.pageId === undefined ? {
          chat_id: params.chatId,
          sort_order: params.sortOrder,
          limit: params.limit,
          min_events_count: params.minEventsCount
        } : {
          chat_id: params.chatId,
          page_id: params.pageId
        }));
      },
      markEventsAsSeen: function markEventsAsSeen(_ref13) {
        var chatId = _ref13.chatId,
            seenUpTo = _ref13.seenUpTo;
        return sendRequestAction$1(sendRequest(MARK_EVENTS_AS_SEEN, {
          chat_id: chatId,
          seen_up_to: seenUpTo
        }));
      },
      on: emitter.on,
      once: emitter.once,
      off: emitter.off,
      rateChat: function rateChat(params) {
        var chatId = params.chatId,
            rating = params.rating;
        return api.listThreads({
          chatId: chatId
        }).then(function (_ref14) {
          var threads = _ref14.threads;

          if (!threads.length) {
            throw createError$1({
              message: "There is no thread in \"" + chatId + "\".",
              code: MISSING_CHAT_THREAD
            });
          }

          return api.updateThreadProperties({
            chatId: chatId,
            threadId: threads[0].id,
            properties: {
              rating: rating
            }
          });
        });
      },
      resumeChat: function resumeChat(data) {
        log({
          env: env,
          licenseId: config.licenseId,
          eventName: 'chat_started'
        });
        return sendRequestAction$1(sendRequest(RESUME_CHAT, parseResumeChatData(data)));
      },
      sendEvent: function (_sendEvent) {
        function sendEvent(_x) {
          return _sendEvent.apply(this, arguments);
        }

        sendEvent.toString = function () {
          return _sendEvent.toString();
        };

        return sendEvent;
      }(function (params) {
        return sendRequestAction$1(sendEvent(params));
      }),
      sendTicketForm: function sendTicketForm$1(options) {
        return sendTicketForm(store, auth, options);
      },
      sendRichMessagePostback: function sendRichMessagePostback(_ref15) {
        var chatId = _ref15.chatId,
            threadId = _ref15.threadId,
            eventId = _ref15.eventId,
            postback = _ref15.postback;
        return sendRequestAction$1(sendRequest(SEND_RICH_MESSAGE_POSTBACK, {
          chat_id: chatId,
          event_id: eventId,
          thread_id: threadId,
          postback: postback
        }));
      },
      setCustomerSessionFields: function setCustomerSessionFields(_ref16) {
        var sessionFields = _ref16.sessionFields;
        return sendRequestAction$1(sendRequest(SET_CUSTOMER_SESSION_FIELDS, {
          session_fields: parseCustomerSessionFields(sessionFields)
        }));
      },
      setSneakPeek: function setSneakPeek(_ref17) {
        var chatId = _ref17.chatId,
            sneakPeekText = _ref17.sneakPeekText;
        var state = store.getState();

        if (!isChatActive(state, chatId) || !isConnected(state)) {
          return;
        }

        sendRequestAction$1(sendRequest(SEND_SNEAK_PEEK, {
          chat_id: chatId,
          sneak_peek_text: sneakPeekText
        }))["catch"](noop);
      },
      startChat: function startChat(data) {
        if (data === void 0) {
          data = {};
        }

        log({
          env: env,
          licenseId: config.licenseId,
          eventName: 'chat_started'
        });
        return sendRequestAction$1(sendRequest(START_CHAT, parseStartChatData(data)));
      },
      updateChatProperties: function updateChatProperties(_ref18) {
        var id = _ref18.id,
            properties = _ref18.properties;
        return sendRequestAction$1(sendRequest(UPDATE_CHAT_PROPERTIES, {
          id: id,
          properties: properties
        }));
      },
      updateCustomer: function updateCustomer(update) {
        return sendRequestAction$1(sendRequest(UPDATE_CUSTOMER, parseCustomerUpdate(update)));
      },
      updateCustomerPage: function updateCustomerPage(page) {
        store.dispatch({
          type: UPDATE_CUSTOMER_PAGE,
          payload: pickOwn(['title', 'url'], page)
        });
      },
      updateEventProperties: function updateEventProperties(_ref19) {
        var chatId = _ref19.chatId,
            threadId = _ref19.threadId,
            eventId = _ref19.eventId,
            properties = _ref19.properties;
        return sendRequestAction$1(sendRequest(UPDATE_EVENT_PROPERTIES, {
          chat_id: chatId,
          event_id: eventId,
          thread_id: threadId,
          properties: properties
        }));
      },
      updateThreadProperties: function updateThreadProperties(_ref20) {
        var chatId = _ref20.chatId,
            threadId = _ref20.threadId,
            properties = _ref20.properties;
        return sendRequestAction$1(sendRequest(UPDATE_THREAD_PROPERTIES, {
          chat_id: chatId,
          thread_id: threadId,
          properties: properties
        }));
      },
      uploadFile: function uploadFile(options) {
        return uploadFile$1({
          auth: auth,
          store: store
        }, options);
      }
    });

    if (autoConnect) {
      startConnection();
    } else {
      store.dispatch({
        type: CHECK_GOALS,
        payload: {
          sessionFields: typeof customerDataProvider === 'function' ? customerDataProvider().sessionFields : {}
        }
      });
    }

    return api;
  };

  exports.debug = debug;
  exports.init = init;
  exports.parseCustomEvent = parseCustomEvent;
  exports.parseEvent = parseEvent$1;
  exports.parseFile = parseFile;
  exports.parseFilledForm = parseFilledForm;
  exports.parseForm = parseForm;
  exports.parseGreeting = parseGreeting;
  exports.parseMessage = parseMessage;
  exports.parseRichMessage = parseRichMessage;
  exports.parseSystemMessage = parseSystemMessage;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
