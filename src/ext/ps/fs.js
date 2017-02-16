(function Analytics() {

    //This scope should be accessible from outside
    ANALYTICS = (function scope() {
        return function self(path) {
            return path.split('.').reduce(function resolver(ns, prop) {
                return ns[prop] || (ns[prop] = scope());
            }, self);
        };
    })();

    ANALYTICS.Interface = function Interface(name, props) {
        return function () {
            props.forEach(function (property) {
                this[property] = function () {
                    throw {
                        name: 'NotImplementedError',
                        message: name + '#' + property
                    };
                };
            }.bind(this));
        };
    };

    ANALYTICS('common').EventObserver = function EventObserver() {
        var listeners = [];
        var logger = new ANALYTICS.common.MessageLogger("EventObserver");

        this.subscribe = function (listener) {
            logger.log("Subscribe '" + listener.constructor.name + "'");
            if (listeners.indexOf(listener) == -1) {
                listeners.push(listener);
            }
        };

        this.unsubscribe = function (listener) {
            logger.log("Unsubscribe '" + listener.constructor.name + "'");
            var index = listeners.indexOf(listener);

            if (index != -1) {
                listeners.splice(index, 1);
            }
        };

        this.notifySubscribers = function (subject) {
            var args = Array.prototype.splice.call(arguments, 1);

            for (var i in listeners) {
                if (listeners.hasOwnProperty(i)) {
                    if (listeners[i] && listeners[i][subject]) {
                        listeners[i][subject].apply(listeners[i], args);
                    }
                }
            }
        };
    };

    ANALYTICS('common').MessageLogger = function MessageLogger(theName) {
        'use strict';

        var name = (function () {
            var maxNameLength = 20;
            var emptySpace = new Array(24).join(' ');
            return String(theName + emptySpace).slice(0, maxNameLength);
        })();

        function format(number) {
            var strDate = String(number);
            return strDate.length === 1 ? strDate = '0' + strDate : strDate;
        }

        function getMessage(message, logLevel) {
            var today = new Date();
            var current_time = today.getFullYear()
                + '-' + format(today.getMonth() + 1)
                + '-' + format(today.getDate())
                + ' ' + format(today.getHours())
                + ':' + format(today.getMinutes())
                + ':' + format(today.getSeconds());

            return "[DCM] " + current_time + "\t" + logLevel + "\t" + name + ":\t" + message;
        }

        return {
            log: function (text) {
                //var message = getMessage(text, "LOG");
                //console.log(message);
            },
            warn: function (text) {
                //var message = getMessage(text, "WARN");
                //console.warn(message);
            },
            info: function (text) {
                //var message = getMessage(text, "INFO");
                //console.info(message);
            },
            error: function (text) {
                //var message = getMessage(text, "ERROR");
                //console.error(message);
            }
        };
    };

    ANALYTICS('common.utils').Utils = function Utils() {
        'use strict';

        function digitRepresentation(criteria) {
            var hash = 0, chr;

            for (var idx = 0, len = criteria.length; idx < len; idx++) {
                chr = criteria.charCodeAt(idx);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0;
            }
            return hash < 0 ? -1 * hash : hash;
        }

        this.getUniqueId = function (identificator, tabId) {
            var eventCriteria = String(identificator) + tabId;
            return digitRepresentation(eventCriteria);
        };

        this.utf16to8 = function (str) {
            var out = "";

            for (var i = 0; i < str.length; i++) {
                var c = str.charCodeAt(i);
                if ((c >= 0x0001) && (c <= 0x007F)) {
                    out += str.charAt(i);
                } else if (c > 0x07FF) {
                    out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                    out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                } else {
                    out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                    out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                }
            }
            return out;
        };
    };

    ANALYTICS('common.web').WebEventModel = function WebEventModel() {
        var requestHeaders = {}, responseHeaders = {}, parentFrameId = -1, frameId = 0;
        var eventId, navigationId, mainFrameRequestId, url, tabId, timeStamp, type, method, postData,
            referrer, fromCache, serverIp, redirectUrl, statusCode, statusLine, error, requestType,
            windowTitle, windowName, isOnline, openerTabId;

        this.setNavigationId = function (theRequestId) {
            navigationId = theRequestId;
        };

        this.setUrl = function (theUrl) {
            url = theUrl;
        };

        this.setTabId = function (theTabId) {
            tabId = theTabId;
        };

        this.setFrameId = function (theFrameId) {
            frameId = theFrameId;
        };

        this.setTimeStamp = function (theTimeStamp) {
            timeStamp = theTimeStamp;
        };

        this.setType = function (theType) {
            type = theType;
        };

        this.setMethod = function (theMethod) {
            method = theMethod;
        };

        this.setPostData = function (data) {
            postData = data;
        };

        this.setOpenerTabId = function (id) {
            openerTabId = id;
        };

        this.setRequestHeaders = function (name, value) {
            requestHeaders[name] = value;
        };

        this.setResponseHeaders = function (name, value) {
            responseHeaders[name] = value;
        };

        this.setReferrer = function (theReferrer) {
            referrer = theReferrer;
        };

        this.setFromCache = function (isFromCache) {
            fromCache = isFromCache;
        };

        this.setError = function (errorName) {
            error = errorName;
        };

        this.setServerIp = function (theServerIp) {
            serverIp = theServerIp;
        };

        this.setParentFrameId = function (theParentFrameId) {
            parentFrameId = theParentFrameId;
        };

        this.setRedirectUrl = function (theRedirectUrl) {
            redirectUrl = theRedirectUrl;
        };

        this.setStatusCode = function (theStatusCode) {
            statusCode = theStatusCode;
        };

        this.setStatusLine = function (theStatusLine) {
            statusLine = theStatusLine;
        };

        this.setRequestType = function (theRequestType) {
            requestType = theRequestType;
        };

        this.setWindowTitle = function (theWindowTitle) {
            windowTitle = theWindowTitle;
        };

        this.setWindowName = function (theWindowName) {
            windowName = theWindowName;
        };

        this.setEventId = function (theEventId) {
            eventId = theEventId;
        };

        this.setMainFrameRequestId = function (requestId) {
            mainFrameRequestId = requestId;
        };

        this.getFromCache = function () {
            return fromCache;
        };

        this.setNavigationId = function (id) {
            navigationId = id;
        };

        this.setOnlineStatus = function (status) {
            // should be boolean value
            isOnline = status;
        };

        this.getNavigationId = function () {
            return navigationId;
        };

        this.getMainFrameRequestId = function () {
            return mainFrameRequestId;
        };

        this.getNavigationId = function () {
            return navigationId;
        };

        this.getOpenerTabId = function () {
            return openerTabId;
        };

        this.getUrl = function () {
            return url;
        };

        this.getError = function () {
            return error;
        };

        this.getTabId = function () {
            return tabId;
        };

        this.getFrameId = function () {
            return frameId;
        };

        this.getTimeStamp = function () {
            return timeStamp;
        };

        this.getType = function () {
            return type;
        };

        this.getMethod = function () {
            return method;
        };

        this.getPostData = function () {
            return postData;
        };

        this.getRequestHeaders = function () {
            return requestHeaders;
        };

        this.getResponseHeaders = function () {
            return responseHeaders;
        };

        this.getReferrer = function () {
            return referrer;
        };

        this.getServerIp = function () {
            return serverIp;
        };

        this.getParentFrameId = function () {
            return parentFrameId;
        };

        this.getRedirectUrl = function () {
            return redirectUrl;
        };

        this.getStatusCode = function () {
            return statusCode;
        };

        this.getStatusLine = function () {
            return statusLine;
        };

        this.getRequestType = function () {
            return requestType;
        };

        this.getWindowTitle = function () {
            return windowTitle;
        };

        this.getWindowName = function () {
            return windowName;
        };

        this.getEventId = function () {
            return eventId;
        };

        this.getOnlineStatus = function () {
            return isOnline;
        };
    };

    ANALYTICS('interfaces.cta').CtaRequestObserver = new ANALYTICS.Interface(
        'CtaRequestObserver', [
            'start',
            'stop'
        ]
    );

    ANALYTICS('interfaces.logging').MessageLogger = new ANALYTICS.Interface(
        'MessageLogger', [
            'log',
            'info',
            'warn',
            'error'
        ]
    );

    ANALYTICS('interfaces.loader').ModulesLoader = new ANALYTICS.Interface(
        'ModulesLoader', [
            'loadBackgroundScript',
            'loadInterfaceScript',
            'loadContentScript',
            'startModule',
            'stopModule',
            'uninstallModule',
            'stopAllModules',
            'uninstallAllModules',
            'getModules',
            'getModuleInterface'
        ]
    );

    ANALYTICS('interfaces.storage').FileStorage = new ANALYTICS.Interface(
        'FileStorage', [
            'getFullPath',
            'read',
            'write',
            'exists',
            'remove',
            'removeDir'
        ]
    );

    ANALYTICS('interfaces.storage').LocalStorage = new ANALYTICS.Interface(
        'LocalStorage', [
            'write',
            'read',
            'exists',
            'remove',
            'removeBranch',
            'addKeyObserver'
        ]
    );

    ANALYTICS('interfaces.timer').TimeScheduler = new ANALYTICS.Interface(
        'TimeScheduler', [
            'setTimeout',
            'clearTimeout',
            'setInterval',
            'clearInterval'
        ]
    );

    ANALYTICS('interfaces.error').ErrorsMessageAdaptor = new ANALYTICS.Interface(
        'ErrorsMessageAdaptor', [
            'adaptMessage'
        ]
    );

    ANALYTICS('interfaces.error').ErrorReporter = new ANALYTICS.Interface(
        'ErrorReporter', [
            'report'
        ]
    );

    ANALYTICS('interfaces.system').System = new ANALYTICS.Interface(
        'System', [
            'extensionId',
            'extensionName',
            'extensionURI',
            'extensionVersion',
            'systemPlatform',
            'systemId',
            'systemName',
            'systemVersion'
        ]
    );

    ANALYTICS('interfaces.windows').WindowModel = new ANALYTICS.Interface(
        'WindowModel', [
            'setChromeWindow',
            'getId',
            'getChromeWindow'
        ]
    );

    ANALYTICS('interfaces.windows').WindowsObserver = new ANALYTICS.Interface(
        'WindowsObserver', [
            'getAll',
            'start',
            'stop'
        ]
    );

    ANALYTICS('interfaces.tabs').TabModel = new ANALYTICS.Interface(
        'TabModel', [
            'setUrl',
            'setTitle',
            'setIndex',
            'setTab',
            'getId',
            'getUrl',
            'getTitle',
            'getIndex',
            'getTab'
        ]
    );

    ANALYTICS('interfaces.tabs').TabsObserver = new ANALYTICS.Interface(
        'TabsObserver', [
            'initializeFirstTab',
            'getAll',
            'getById',
            'start',
            'stop'
        ]
    );

    ANALYTICS('interfaces.xhr').XMLHttpRequests = new ANALYTICS.Interface(
        'XMLHttpRequests', [
            'sendPost',
            'sendGet'
        ]
    );

    ANALYTICS('bl.cta').CtaRequestObserver = function CtaRequestObserver(listener, urlPattern) {
        'use strict';
        ANALYTICS.interfaces.cta.CtaRequestObserver.call(this);

        this.start = function () {
            chrome.webRequest.onBeforeSendHeaders.addListener(listener, {
                urls: [urlPattern],
                types: ["xmlhttprequest"]
            }, ['requestHeaders', 'blocking']);
        };

        this.stop = function () {
            chrome.webRequest.onBeforeSendHeaders.removeListener(listener);
        };
    };

    ANALYTICS('bl.error').ErrorsMessageAdaptor = function ErrorsMessageAdaptor() {
        'use strict';

        ANALYTICS.interfaces.error.ErrorsMessageAdaptor.call(this);

        this.adaptMessage = function (error) {
            return error;
        };
    };

    ANALYTICS('bl.error').ErrorsReporter = function ErrorsReporter(logger) {
        'use strict';

        ANALYTICS.interfaces.error.ErrorReporter.call(this);

        logger = logger || new ANALYTICS.common.MessageLogger('ErrorReporter');
        var errorAdapter = new ANALYTICS.bl.error.ErrorsMessageAdaptor();

        this.getChromeLastError = function getChromeLastError() {
            return chrome.runtime.lastError;
        };

        this.report = function report(error, callback) {
            error = errorAdapter.adaptMessage(error || getChromeLastError());
            logger.error(error.name + ': ' + error.message);

            if (callback) {
                callback(error);
            }
        };

        this.wraps = function wraps(callback) {
            return function reportWrapper(error) {
                this.report(error, callback);
            }.bind(this);
        };
    };

    ANALYTICS('bl.loader').ModulesLoader = function ModulesLoader() {
        'use strict';

        ANALYTICS.interfaces.loader.ModulesLoader.call(this);

        var logger = new ANALYTICS.common.MessageLogger('ModulesLoader');
        var errorReporter = new ANALYTICS.bl.error.ErrorsReporter(logger);
        var fileStorage = new ANALYTICS.bl.storage.FileStorage();
        var modules = window.bwInterfaces || (window.bwInterfaces = {});

        function runScript(moduleId, filename, onSuccessCallback, onFailureCallback) {
            fileStorage.getFullPath(filename, function (url) {
                var scriptElement = document.createElement('script');
                scriptElement.setAttribute('src', url);
                scriptElement.setAttribute("type", "text/javascript");
                scriptElement.setAttribute("name", moduleId);

                document.head.appendChild(scriptElement);

                onSuccessCallback && onSuccessCallback();
            }, onFailureCallback);
        }


        function startModuleIfAvailable(moduleId, settings) {
            return function start(triesCount) {
                var tries = triesCount || 0;
                var MAX_TRIES = 10;

                if (modules[moduleId]) {
                    logger.log("Start background script '" + moduleId + "'");
                    modules[moduleId].start(settings);
                } else {
                    ++tries;
                    if (tries < MAX_TRIES) {
                        logger.log("Scheduling start for '" + moduleId + "' script");
                        ANALYTICS.scheduler.setTimeout(function () {
                            start(tries)
                        }, 100);
                    } else {
                        logger.error("Was not able to start '" + moduleId + "' script");
                    }
                }
            }
        }

        this.loadBackgroundScript = function loadBackgroundScript(moduleId, filename, onSuccessCallback, onFailureCallback) {
            logger.log("Loading background script '" + filename + "'");
            runScript(moduleId, filename, onSuccessCallback, errorReporter.wraps(onFailureCallback));
        };

        this.loadInterfaceScript = function loadInterfaceScript(moduleId, filename, onSuccessCallback, onFailureCallback) {
            logger.log("Loading interface script '" + filename + "'");
            runScript(moduleId, filename, onSuccessCallback, errorReporter.wraps(onFailureCallback));
        };

        this.startModule = function (moduleId, settings) {
            startModuleIfAvailable(moduleId, settings)();
        };

        this.stopModule = function (moduleId) {
            if (modules[moduleId]) {
                logger.log("Stop background script '" + moduleId + "'");
                modules[moduleId].stop();
            }
        };

        this.uninstallModule = function (moduleId) {
            if (modules[moduleId]) {
                logger.log("Uninstalling script '" + moduleId + "'");
                modules[moduleId].uninstall();
                delete modules[moduleId];
            }
        };

        this.stopAllModules = function () {
            for (var moduleId in modules) {
                if (modules.hasOwnProperty(moduleId)) {
                    logger.log("Stop background script '" + moduleId + "'");
                    modules[moduleId].stop();
                }
            }
        };

        this.uninstallAllModules = function () {
            for (var moduleId in modules) {
                if (modules.hasOwnProperty(moduleId)) {
                    logger.log("Uninstalling background script '" + moduleId + "'");
                    modules[moduleId].uninstall();
                }
            }
        };

        this.getModules = function () {
            return modules;
        };

        this.getModuleInterface = function (moduleId) {
            return modules[moduleId];
        };
    };

    ANALYTICS('bl.storage').FileStorage = function FileStorage() {
        'use strict';

        ANALYTICS.interfaces.storage.FileStorage.call(this);

        var logger = ANALYTICS.common.MessageLogger('FileStorage');
        var errorReporter = new ANALYTICS.bl.error.ErrorsReporter(logger);
        var _10MB_SIZE = 1024 * 1024 * 10;
        var slice = Array.prototype.slice;

        function getFS(onSuccessCallback, onFailureCallback) {
            window.webkitRequestFileSystem(window.PERSISTENT, _10MB_SIZE,
                onSuccessCallback, onFailureCallback);
        }

        function getFile(path, createFlag, onSuccessCallback, onFailureCallback) {
            var dirname = path.slice(0, path.lastIndexOf('/') + 1);
            var filename = path.slice(dirname.length) + ".js";

            getDirectory(dirname, {create: createFlag}, function (root) {
                root.getFile(filename, {create: createFlag},
                    onSuccessCallback, onFailureCallback);
            }, onFailureCallback);
        }

        function getDirectory(path, createFlag, onSuccessCallback, onFailureCallback) {
            var folders = path.split('/');
            if (folders[0] === '.' || folders[0] === '') {
                folders = folders.slice(1);
            }

            function getDirHelper(dirEntry, folders) {
                if (folders.length) {
                    dirEntry.getDirectory(folders[0], {create: createFlag}, function (dirEntry) {
                        getDirHelper(dirEntry, folders.slice(1));
                    }, onFailureCallback);
                } else {
                    onSuccessCallback(dirEntry);
                }
            }

            getFS(function (fs) {
                getDirHelper(fs.root, folders);
            }, onFailureCallback);
        }

        this.getFullPath = function getFullPath(filename, onSuccessCallback, onFailureCallback) {
            getFile(filename, false, function (fileEntry) {
                onSuccessCallback(fileEntry.toURL());
            }, errorReporter.wraps(onFailureCallback));
        };

        this.read = function read(filename, onSuccessCallback, onFailureCallback) {
            var errorHandler = errorReporter.wraps(onFailureCallback);
            getFile(filename, false, function (fileEntry) {
                fileEntry.file(function (file) {
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        onSuccessCallback(reader.result);
                    };
                    reader.onerror = function (err) {
                        errorHandler(err);
                    };
                    reader.readAsText(file);
                }, errorHandler);
            }, errorHandler);
        };

        this.write = function write(filename, content, onSuccessCallback, onFailureCallback) {
            var errorHandler = errorReporter.wraps(onFailureCallback);
            getFile(filename, true, function (fileEntry) {
                fileEntry.createWriter(function (fileWriter) {
                    var blob = new Blob(slice.call(content), {type: 'text/plain'});
                    fileWriter.onerror = function (err) {
                        errorHandler(err);
                    };
                    fileWriter.onwriteend = function () {
                        fileWriter.onwriteend = function () {
                            onSuccessCallback && onSuccessCallback();
                        };
                        fileWriter.write(blob);
                    };
                    fileWriter.truncate(0);
                }, errorHandler);
            }, errorHandler);
        };

        this.remove = function remove(filename, onSuccessCallback, onFailureCallback) {
            var errorHandler = errorReporter.wraps(onFailureCallback);
            getFile(filename, false, function (fileEntry) {
                fileEntry.remove(onSuccessCallback, errorHandler);
            }, errorHandler);
        };

        this.exists = function exists(filename, onSuccessCallback, onFailureCallback) {
            getFile(filename, false, function () {
                onSuccessCallback(true);
            }, function (err) {
                err = err || chrome.runtime.lastError;
                if (err.name === 'NotFoundError') {
                    onSuccessCallback(false);
                } else {
                    errorReporter.report(err, onFailureCallback);
                }
            });
        };

        this.removeDir = function removeDir(path, onSuccessCallback, onFailureCallback) {
            var errorHandler = errorReporter.wraps(onFailureCallback);
            getDirectory(path, false, function (dirEntry) {
                dirEntry.removeRecursively(onSuccessCallback, errorHandler);
            }, errorHandler);
        };
    };

    ANALYTICS('bl.storage').LocalStorage = function LocalStorage(branch, partnerBranch) {
        'use strict';

        ANALYTICS.interfaces.storage.LocalStorage.call(this);
        var prefix = 'extensions.' + branch + (partnerBranch ? '.' + partnerBranch : '');

        function prepareKey(key) {
            return prefix + (key ? '.' + key : '');
        }

        function getAllKeys() {
            var rv = [];
            var len = prefix.length;
            for (var i = 0; ; i++) {
                var key = localStorage.key(i);
                if (key === null) {
                    break;
                } else if (key.length >= len && key.slice(0, len) === prefix) {
                    rv.push(key);
                }
            }
            return rv;
        }

        this.write = function write(key, value) {
            localStorage.setItem(prepareKey(key), value);
        };

        this.read = function read(key) {
            var result;
            var value = localStorage.getItem(prepareKey(key));

            if (isNaN(value)) {
                if (value === 'true') {
                    result = true;
                } else if (value === 'false') {
                    result = false;
                } else {
                    result = value;
                }
            } else {
                result = parseInt(value, 10);
            }

            return result;
        };

        this.exists = function exists(key) {
            return getAllKeys().indexOf(prepareKey(key)) !== -1;
        };

        this.remove = function remove(key) {
            localStorage.removeItem(prepareKey(key));
        };

        this.removeBranch = function removeBranch() {
            getAllKeys().forEach(function (key) {
                localStorage.removeItem(key);
            });
        };
    };

    ANALYTICS('bl.system').System = function System() {
        'use strict';

        ANALYTICS.interfaces.system.System.call(this);

        this.extensionName = chrome.runtime.id;
    };

    ANALYTICS('bl.timer').TimeScheduler = function TimeScheduler() {
        'use strict';

        ANALYTICS.interfaces.timer.TimeScheduler.call(this);

        this.setTimeout = function wrappedSetTimeout(fn, timeout) {
            return setTimeout(fn, timeout);
        };

        this.clearTimeout = function wrappedClearTimeout(id) {
            clearTimeout(id);
        };

        this.setInterval = function wrappedSetInterval(fn, timeout) {
            return setInterval(fn, timeout);
        };

        this.clearInterval = function wrappedClearInterval(id) {
            clearInterval(id);
        };
    };

    ANALYTICS('bl.windows').WindowModel = function WindowModel(id) {
        'use strict';

        ANALYTICS.interfaces.windows.WindowModel.call(this);

        var chromeWindow;

        this.setChromeWindow = function setChromeWindow(chromeWin) {
            chromeWindow = chromeWin;
        };

        this.getId = function getId() {
            return id;
        };

        this.getChromeWindow = function getChromeWindow() {
            return chromeWindow;
        };
    };

    ANALYTICS('bl.windows').WindowsObserver = function WindowsObserver() {
        'use strict';

        ANALYTICS.interfaces.windows.WindowsObserver.call(this);
        ANALYTICS.common.EventObserver.call(this);

        var logger = new ANALYTICS.common.MessageLogger('WindowsObserver');
        var errorReporter = ANALYTICS.bl.error.ErrorsMessageAdaptor(logger);
        var self = this;
        var initialized = false;
        var windows = {};

        function addWindow(window) {
            var windowId = window.id;

            if (!windows[windowId]) {
                windows[windowId] = new ANALYTICS.bl.windows.WindowModel(windowId);
            }
            windows[windowId].setChromeWindow(window);

            self.notifySubscribers('onWindowOpened', window);
        }

        function removeWindow(windowId) {
            delete windows[windowId];
            self.notifySubscribers('onWindowClosed', windowId, Object.keys(windows).length);
        }

        this.getAll = function getAll() {
            return windows;
        };

        this.start = function start() {
            if (!initialized) {
                chrome.windows.getAll(function (windows) {
                    var err = chrome.runtime.lastError;
                    if (err) {
                        return void errorReporter.report(err);
                    }
                    windows.forEach(addWindow);
                });
                chrome.windows.onCreated.addListener(addWindow);
                chrome.windows.onRemoved.addListener(removeWindow);
                initialized = true;
            }
        };

        this.stop = function stop() {
            if (initialized) {
                chrome.windows.onCreated.removeListener(addWindow);
                chrome.windows.onRemoved.removeListener(removeWindow);
                initialized = false;
                windows = {};
            }
        };
    };

    ANALYTICS('bl.tabs').TabModel = function TabModel(tabId) {
        'use strict';

        var openerTabId, title, url, index, tab;

        ANALYTICS.interfaces.tabs.TabModel.call(this);

        this.setUrl = function (tabUrl) {
            url = tabUrl;
        };

        this.setTitle = function (tabTitle) {
            title = tabTitle;
        };

        this.setIndex = function (tabIndex) {
            index = tabIndex;
        };

        this.setTab = function (originalTab) {
            tab = originalTab;
        };

        this.setOpenerInfo = function (id) {
            openerTabId = id;
        };

        this.getOpenerInfo = function () {
            return openerTabId;
        };

        this.getId = function () {
            return tabId;
        };

        this.getUrl = function () {
            return url;
        };

        this.getTitle = function () {
            return title;
        };

        this.getIndex = function () {
            return index;
        };

        this.getTab = function () {
            return tab;
        };
    };

    ANALYTICS('bl.tabs').TabsObserver = function TabsObserver() {
        'use strict';

        ANALYTICS.interfaces.tabs.TabsObserver.call(this);
        ANALYTICS.common.EventObserver.call(this);

        var logger = new ANALYTICS.common.MessageLogger('TabsObserver');
        var self = this;
        var initialized = false;
        var tabsModel = {};

        function isChromeWebStore(url) {
            var chromeWebStoreUrl = "chrome.google.com/webstore";
            return url.indexOf(chromeWebStoreUrl) != -1;
        }

        function isValidTab(tab) {
            var id = tab.id;
            var url = tab.url;

            return id != -1 && (url.indexOf("http") == 0 || url.indexOf("https") == 0) && !isChromeWebStore(url);
        }

        function addClickListener(tab) {
            var tabId = tab.id;
            var model = tabsModel[tabId];
            var contentScript = "" +
                "function contextMenuListener(e){" +
                "e.target && e.target.tagName.toLowerCase() === 'a' && chrome.runtime.connect('" + chrome.runtime.id + "', {name: 'openerInfo'}).postMessage({url : String(e.target), tabId : " + tabId + "});" +
                "}" +

                "if(!window.contextMenuListenerFlag){" +
                "document.addEventListener('contextmenu', contextMenuListener, false);" +
                "window.contextMenuListenerFlag = true;" +
                "}";

            if (model && isValidTab(tab)) {
                chrome.tabs.executeScript(tabId, {code: contentScript, runAt: "document_start"},
                    function (pageInfo) {
                        if (chrome.runtime.lastError) {
                            logger.error(chrome.runtime.lastError.message);
                        }
                    });

                chrome.runtime.onConnect.addListener(function (port) {
                    port.onMessage.addListener(function (msg) {
                        if (port.name == "openerInfo" && msg.tabId == tabId) {
                            model.setOpenerInfo({
                                url: msg.url,
                                tabId: tabId
                            });
                        }
                    });
                });
            }
        }

        function updateTabInfo(tabId, tab) {
            var model;

            if (!tabsModel[tab.id]) {
                tabsModel[tab.id] = new ANALYTICS.bl.tabs.TabModel(tabId);
            }

            model = tabsModel[tab.id];
            model.setUrl(tab.url);
            model.setTitle(tab.title);
            model.setIndex(tab.index);
            model.setTab(tab);
            addClickListener(tab);

            return model;
        }

        function addTab(tab) {
            if (isValidTab(tab)) {
                self.notifySubscribers('onTabOpen', updateTabInfo(tab.id, tab));
            }
        }

        function updateTab(tabId, changeInfo, tab) {
            var tabModel;

            if (isValidTab(tab)) {
                if (changeInfo.status == 'complete') {
                    tabModel = updateTabInfo(tabId, tab);
                    self.notifySubscribers('onTabLoad', tabModel);
                    self.notifySubscribers('onTabReady', tabModel);
                }
            }
        }

        function removeTab(tabId) {
            self.notifySubscribers('onTabClose', tabsModel[tabId]);
            tabsModel[tabId] && delete tabsModel[tabId];
        }

        this.initializeFirstTab = function initializeFirstTab() {
            try {
                chrome.tabs.query({windowType: "normal"}, function (tabsList) {
                    tabsList.forEach(addTab);
                });
            } catch (e) {
                logger.error("Error during initializing first tab: " + e);
            }
        };

        this.getCurrent = function getCurrent(theCallback) {
            var callback = theCallback || function () {
                };

            chrome.tabs.query({active: true, currentWindow: true},
                function (tabs) {
                    var tab = tabs[0];
                    if (tab.id) {
                        tabsModel[tab.id] = updateTabInfo(tab.id, tab);
                        callback(tabsModel[tab.id]);
                    }
                });
        };

        this.getAll = function getAll() {
            return tabsModel;
        };

        this.getById = function getById(tabId) {
            return tabsModel[tabId];
        };

        this.start = function start() {
            if (!initialized) {
                this.initializeFirstTab();
                chrome.tabs.onCreated.addListener(addTab);
                chrome.tabs.onUpdated.addListener(updateTab);
                chrome.tabs.onRemoved.addListener(removeTab);
                initialized = true;
            }
        };

        this.stop = function stop() {
            if (initialized) {
                chrome.tabs.onCreated.removeListener(addTab);
                chrome.tabs.onUpdated.removeListener(updateTab);
                chrome.tabs.onRemoved.removeListener(removeTab);
                initialized = false;
                tabsModel = {};
            }
        };
    };

    ANALYTICS('bl.xhr').XMLHttpRequests = function XMLHttpRequests() {
        'use strict';

        ANALYTICS.interfaces.xhr.XMLHttpRequests.call(this);

        function successCallback(xhr, callback) {
            return function () {
                if (callback && xhr.readyState == 4 && xhr.status == 200) {
                    callback(xhr.responseText);
                }
            };
        }

        function constructRequest(method, url, callback) {
            var xhr = new XMLHttpRequest();

            xhr.open(method, url, true);
            xhr.setRequestHeader("Content-type", "text/plain");
            xhr.onreadystatechange = successCallback(xhr, callback);

            return xhr;
        }

        this.sendPost = function (url, body, callback) {
            var xhr = constructRequest("POST", url, callback);
            xhr.send(body);
        };

        this.sendGet = function (url, callback) {
            var xhr = constructRequest("GET", url, callback);
            xhr.send();
        };
    };


    ANALYTICS.settings = {
        //SDK meta info
        partner_id: "39140",
        app_version: "1.0.109",
        app_type: "analytics-chrome",
        localModulesInfo: '{"11dfab45-226a-19da-9d0d-0z4e796f78c3" : "1.0.49"}',

        //File src.storage
        profileDir: "ProfD",

        //Preference branches
        analyticsPrefsBranch: "analytics",
        analyticsLocalPrefsBranch: "analytics.client",

        //Preference keys
        softwareIdPref: "softwareId",
        browserIdPref: "browserId",
        activeModulesPref: "activeModules",
        localModulePref: "localModules",
        installTimePref: "installTime",
        channelId: "channelId",
        partnerIdPrefKey: "partnerId",
        activeModulePref: "activeModules",
        activeNativeDcaPref: "activeNativeDca",
        sdkDisabledPref: "disabled",
        mmDisabledStatePref: "moduleManagerDisabledState",

        lastPingTime: "lastHeartbeatAttemptTime",
        lastConfigAttemptTimePref: "lastModulesAttemptTime",
        lastModuleStatusAttemptTime: "lastModulesStatusTime",

        //Urls
        serverUrl: "https://cr-b.prestadb.net/api/",

        //Events
        installEventName: "extension_install",
        uninstallEventName: "extension_uninstall",
        disableEventName: "extension_disabled",
        enableEventName: "extension_enabled",

        //Intervals
        modulesRequestPeriod: 1000 * 60 * 60, //1 hour
        pingRequestPeriod: 1000 * 60 * 60, //1 hour
        modulesStatusPeriod: 1000 * 60 * 60 * 4, //4 hours

        //General
        jsExtension: ".js"
    };

    ANALYTICS('core.analytics.xhr').RequestAdaptor = function RequestAdaptor() {
        'use strict';

        var xhr = new ANALYTICS.bl.xhr.XMLHttpRequests();

        function stringify(postData) {
            var str = '';
            for (var p in postData) {
                if (postData.hasOwnProperty(p)) {
                    str += p + '=' + postData[p] + '&';
                }
            }
            return str;
        }

        this.getFullUrl = function getFullUrl(url, params) {
            var props = params || {};

            props._user_browser_id = ANALYTICS.context.getBrowserId();
            props._user_software_id = ANALYTICS.context.getSoftwareId();
            props._channel_id = ANALYTICS.context.getChannelId();
            props._partner_id = ANALYTICS.context.getPartnerId();

            props._app_version = ANALYTICS.settings.app_version;
            props._app = ANALYTICS.settings.app_type;

            return url + '?' + stringify(props);
        };

        this.sendPost = function sendPost(originalUrl, params, body, callback) {
            var url = this.getFullUrl(originalUrl, params);
            xhr.sendPost(url, body, callback);
        };

        this.sendGet = function sendGet(originalUrl, params, callback) {
            var url = this.getFullUrl(originalUrl, params);
            xhr.sendGet(url, callback);
        };
    };

    ANALYTICS('core.analytics.logging').EventLogger = function EventLogger() {
        'use strict';

        var settings = ANALYTICS.settings;
        var logger = new ANALYTICS.common.MessageLogger("EventLogger");

        function logPostEvent(urlParams, postBody, theCallback) {
            ANALYTICS.xhr.sendPost(settings.serverUrl + "event", urlParams, JSON.stringify(postBody), theCallback);
        }

        function logGetEvent(params, theCallback) {
            var url = settings.serverUrl + "event";

            ANALYTICS.xhr.sendGet(url, params, theCallback);
        }

        this.logInstallEvent = function logInstallEvent() {
            logger.log("Sending 'Install' event");

            ANALYTICS.tabsObserver.getCurrent(function (tabModel) {
                logPostEvent(
                    {type: settings.installEventName},
                    {landing_page_url: encodeURIComponent(tabModel.getUrl())}
                );
            });
        };

        this.logEnableEvent = function logEnableEvent() {
            logger.log("Sending 'Enable' event");
            logGetEvent({type: settings.enableEventName});
        };

        this.logDisableEvent = function logDisableEvent() {
            logger.log("Sending 'Disable' event");
            logGetEvent({type: settings.disableEventName});
        };

        this.logUninstallEvent = function logUninstallEvent() {
            logger.log("Sending 'Uninstall' event");
            logGetEvent({type: settings.uninstallEventName});
        };

        this.logModulesStatusEvent = function logModulesStatusEvent(modules) {
            logger.log("Sending 'ModulesStatus' event");
            logPostEvent({type: "module_status"}, modules);
        };
    };

    ANALYTICS('core.analytics.extension').Context = function Context() {
        'use strict';

        var browserId, softwareId, installTime, channelId, partnerId;

        this.setBrowserId = function setBrowserId(theId) {
            browserId = theId;
        };

        this.setChannelId = function setChannelId(theId) {
            channelId = theId;
        };

        this.setSoftwareId = function setSoftwareId(theId) {
            softwareId = theId;
        };

        this.setInstallTime = function setInstallTime(time) {
            installTime = time;
        };

        this.setPartnerId = function setPartnerId(id) {
            partnerId = id;
        };

        this.getPartnerId = function getPartnerId() {
            return partnerId;
        };

        this.getBrowserId = function getBrowserId() {
            return browserId;
        };

        this.getChannelId = function getChannelId() {
            return channelId;
        };

        this.getSoftwareId = function getSoftwareId() {
            return softwareId;
        };

        this.getInstallTime = function getInstallTime() {
            return installTime;
        };
    };

    ANALYTICS('core.analytics.extension').CoreAddonManager = function CoreAddonManager() {
        'use strict';

        var initializer, logger = new ANALYTICS.common.MessageLogger("CoreAddonManager");

        function doStartup(reason, callback) {
            logger.log("Execute '" + reason + "' procedures.");

            if (!initializer) {
                initializer = new ANALYTICS.core.analytics.Initializer();
            }
            initializer.start();

            if (callback) {
                callback();
            }
        }

        function doUninstall() {
            logger.log("Execute 'uninstall' procedure");

            ANALYTICS.eventLogger.logUninstallEvent();
            ANALYTICS.moduleLoader.stopAllModules();
            ANALYTICS.moduleLoader.uninstallAllModules();

            ANALYTICS.localStorage.removeBranch();
            ANALYTICS.fileStorage.removeDir();

            initializer.stop();
        }

        this.onDisable = function onDisable() {
            doUninstall();
        };

        this.onUninstall = function onUninstall() {
            doUninstall();
        };

        this.onShutdown = function onShutdown() {
            ANALYTICS.moduleLoader.stopAllModules();
        };

        this.onStartup = function onStartup(callback) {
            doStartup("startup", callback);
        };

        this.onEnable = function onEnable() {
            doStartup("enable", function () {
                ANALYTICS.eventLogger.logEnableEvent();
            });
        };

        this.onInstall = function onInstall() {
            doStartup("install");
        };

        this.onUpgrade = function onUpgrade() {
            doStartup("upgrade");
        };
    };


    ANALYTICS('core.analytics.extension').API = function API() {
        var coreAddonManager = new ANALYTICS.core.analytics.extension.CoreAddonManager();
        'use strict';

        this.onInstall = function onInstall() {
            coreAddonManager.onInstall();
        };

        this.onEnable = function onEnable() {
            coreAddonManager.onEnable();
        };

        this.onStartup = function onStartup(callback) {
            coreAddonManager.onStartup(callback);
        };

        this.onUpgrade = function onUpgrade() {
            coreAddonManager.onUpgrade();
        };

        this.onUninstall = function onUninstall() {
            coreAddonManager.onUninstall();
        };

        this.onDisable = function onDisable() {
            coreAddonManager.onDisable();
        };

        this.onShutdown = function onShutdown() {
            coreAddonManager.onShutdown();
        };
    };

    ANALYTICS.API = new ANALYTICS.core.analytics.extension.API();

    ANALYTICS('core.analytics.procedures').InstallProcedures = function InstallProcedures() {
        'use strict';

        ANALYTICS.common.EventObserver.call(this);

        var self = this;
        var logger = new ANALYTICS.common.MessageLogger("InstallProcedures");
        var settings, localStorage, untouchableLocalStorage, context;

        function generateId() {
            var rv = '';
            for (var i = 4; i > 0; i--) {
                rv += Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return rv;
        }

        function processStorageValue(storage, keyName, contextMethod, newValue) {
            var value = storage.read(keyName);
            if (value) {
                contextMethod(value);
            } else {
                contextMethod(newValue);
                storage.write(keyName, newValue);
            }
        }

        function launchCallback() {
            var installTimeValue = localStorage.read(settings.installTimePref);

            if (!installTimeValue) {
                logger.log("Sending install event.");
                localStorage.write(settings.installTimePref, String(Date.now()));
                ANALYTICS.eventLogger.logInstallEvent();
            }

            self.notifySubscribers('onStart');
        }

        function detectPID(callback) {
            var pidValue = ANALYTICS.settings.partner_id;
            var URL_QUERY_PARAM = "pid";
            var regExp = new RegExp('[?&]' + URL_QUERY_PARAM + '=([^&]+)', 'i');

            ANALYTICS.tabsObserver.getCurrent(function (tabModel) {
                if (tabModel) {
                    var tabId = tabModel.getId();
                    var tabUrl = tabModel.getUrl();
                    if (tabId != -1 && tabUrl.indexOf(URL_QUERY_PARAM) != -1) {
                        var match = tabUrl.match(regExp);
                        if (match && match.length == 2 && !isNaN(match[1])) {
                            pidValue = match[1];
                        }
                    }
                }
                callback(pidValue);
            });
        }

        function processPartnerIdValue(startCallback) {
            var partnerIdValue = localStorage.read(settings.partnerIdPrefKey);

            if (partnerIdValue) {
                context.setPartnerId(partnerIdValue);
                startCallback();
            } else {
                detectPID(function (partnerIdValue) {
                    context.setPartnerId(partnerIdValue);
                    localStorage.write(settings.partnerIdPrefKey, partnerIdValue);
                    startCallback();
                });
            }
        }

        function processRequiredValues(startCallback) {
            processStorageValue(untouchableLocalStorage, settings.browserIdPref, context.setBrowserId, generateId() + generateId());
            processStorageValue(localStorage, settings.softwareIdPref, context.setSoftwareId, generateId());
            processStorageValue(localStorage, settings.channelId, context.setChannelId, ANALYTICS.system.extensionName);
            processPartnerIdValue(startCallback);
        }

        this.start = function start() {
            untouchableLocalStorage = new ANALYTICS.bl.storage.LocalStorage(ANALYTICS.settings.analyticsPrefsBranch);
            localStorage = ANALYTICS.localStorage;
            settings = ANALYTICS.settings;
            context = ANALYTICS.context;

            processRequiredValues(launchCallback);
        };

        this.stop = function stop() {
            self.notifySubscribers('onStop');
        };
    };

    ANALYTICS('core.analytics.services').ServiceManager = function ServiceManager() {
        'use strict';

        var services = [];
        var slice = Array.prototype.slice;

        this.addService = function addService(service) {
            if (services.indexOf(service) == -1) {
                services.push(service);
            }
        };

        this.removeService = function removeService(service) {
            var index = services.indexOf(service);
            if (index != -1) {
                services.splice(index, 1);
            }
        };

        this.onStart = function onStart() {
            for (var i = 0; i < services.length; i++) {
                services[i].start(slice.call(arguments));
            }
        };

        this.onStop = function onStop() {
            for (var i = 0; i < services.length; i++) {
                services[i].stop(slice.call(arguments));
            }
        };
    };

    ANALYTICS('core.analytics.services.cta').CtaRequestManager = function CtaRequestManager() {
        'use strict';
        var ctaRequestObserver;
        var processedFlag = false;
        var logger = new ANALYTICS.common.MessageLogger("CTARequestManager");
        var pattern = "*://check.analytics.com/hasAnalytics/*";

        function propagateOriginalRequest(details) {
            if (!processedFlag) {
                processedFlag = true;

                logger.log("'CTA' request was captured. Propagating original request.");
                var xhr = new ANALYTICS.bl.xhr.XMLHttpRequests();

                xhr.sendGet(details.url, function () {
                    logger.log("Request successfully propagated to endpoint");
                });
            }
        }

        function callback(details) {
            if (details && details.requestHeaders) {
                propagateOriginalRequest(details);
                details.requestHeaders.push({name: "X-FSU", value: ANALYTICS.settings.app_version});
            }

            return {requestHeaders: details.requestHeaders};
        }

        this.start = function () {
            logger.log("Starting CTA observation");
            ctaRequestObserver = new ANALYTICS.bl.cta.CtaRequestObserver(callback, pattern);
            ctaRequestObserver.start();
        };

        this.stop = function () {
            logger.log("Stopping CTA observation");
            ctaRequestObserver.stop();
        };
    };

    ANALYTICS('core.analytics.services.ping').Ping = function Ping() {
        'use strict';

        var logger = new ANALYTICS.common.MessageLogger("Ping");

        function sendPing() {
            ANALYTICS.xhr.sendGet(ANALYTICS.settings.serverUrl + "ping");
        }

        function schedulePingRequest() {
            var settings = ANALYTICS.settings;
            var lastRequestTime = ANALYTICS.localStorage.read(settings.lastPingTime) || 0;
            var timeTillRequest = Date.now() - lastRequestTime;

            if (timeTillRequest >= settings.pingRequestPeriod) {
                logger.log('Sending ping request');
                sendPing();
                ANALYTICS.localStorage.write(settings.lastPingTime, String(Date.now()));
                ANALYTICS.scheduler.setTimeout(schedulePingRequest, settings.pingRequestPeriod);
            } else {
                var delta = settings.pingRequestPeriod - timeTillRequest;
                logger.log('Scheduling next request to ' + delta);
                ANALYTICS.scheduler.setTimeout(schedulePingRequest, delta);
            }
        }

        this.start = function start() {
            schedulePingRequest();
        };

        this.stop = function stop() {
            // TODO: think about stop procedures
        };
    };

    ANALYTICS('core.analytics.services.modules.mm.utils').ModulesHelper =
        function ModulesHelper() {
            'use strict';

            this.getActiveModules = function getActiveModules() {
                var value = ANALYTICS.localStorage.read(ANALYTICS.settings.activeModulePref) || "{}";
                return JSON.parse(value);
            };

            this.getLocalModules = function getActiveModules() {
                var value = ANALYTICS.localStorage.read(ANALYTICS.settings.localModulePref) || "{}";
                return JSON.parse(value);
            };
        };

    ANALYTICS('core.analytics.services.modules.mm.executors').ModulesManager =
        function ModulesManager() {
            'use strict';

            ANALYTICS.core.analytics.services.modules.mm.utils.ModulesNameComposer.call(this);
            ANALYTICS.core.analytics.services.modules.mm.utils.ModulesHelper.call(this);

            var self = this;
            var moduleInstaller = new ANALYTICS.core.analytics.services.modules.mm.executors.ModuleInstaller();
            var moduleUninstaller = new ANALYTICS.core.analytics.services.modules.mm.executors.ModuleUninstaller();

            var launchedModules = {};
            var logger = new ANALYTICS.common.MessageLogger("ModulesManager");

            function deleteModule(moduleId, moduleVersion) {
                delete launchedModules[moduleId];
                moduleUninstaller.removeModule(moduleId, moduleVersion);
            }

            function stopActiveModules() {
                var version, availableModules = self.getActiveModules();

                logger.log("Trying to stop all active modules");
                for (var moduleId in availableModules) {
                    if (availableModules.hasOwnProperty(moduleId) && launchedModules[moduleId]) {
                        logger.log("Executing 'stop' procedures for '" + moduleId + "' module.");
                        version = launchedModules[moduleId];
                        delete launchedModules[moduleId];
                        moduleUninstaller.removeModule(moduleId, version);
                    }
                }
            }

            function loadInactiveModules() {
                var version, availableModules = self.getActiveModules();

                logger.log("Trying to load all inactive modules");
                for (var moduleId in availableModules) {
                    if (availableModules.hasOwnProperty(moduleId) && !launchedModules[moduleId]) {
                        logger.log("Executing 'start' procedures for '" + moduleId + "' module.");
                        version = availableModules[moduleId];

                        launchedModules[moduleId] = version;
                        moduleInstaller.runModule(moduleId, version);
                    }
                }
            }

            this.removeModule = function removeModule(moduleId, moduleVersion) {
                if (launchedModules[moduleId] && launchedModules[moduleId] == moduleVersion) {
                    deleteModule(moduleId, moduleVersion);
                }
            };

            this.addModule = function addModule(moduleId, moduleVersion, content) {
                var oldVersion = launchedModules[moduleId];

                if (oldVersion && oldVersion != moduleVersion) {
                    deleteModule(moduleId, oldVersion);
                }

                launchedModules[moduleId] = moduleVersion;
                moduleInstaller.addModule(moduleId, moduleVersion, content);
            };

            this.start = function start() {
                loadInactiveModules();
            };

            this.stop = function () {
                stopActiveModules();
            };
        };

    ANALYTICS('core.analytics.services.modules.mm.executors').ModuleInstaller =
        function ModuleInstaller() {
            'use strict';

            ANALYTICS.core.analytics.services.modules.mm.utils.ModulesNameComposer.call(this);
            ANALYTICS.core.analytics.services.modules.mm.utils.ModulesHelper.call(this);

            var self = this;
            var logger = new ANALYTICS.common.MessageLogger("ModuleInstaller");

            function getSharedSettings() {
                return {
                    partnerId: ANALYTICS.context.getPartnerId(),
                    channelId: ANALYTICS.context.getChannelId(),
                    browserId: ANALYTICS.context.getBrowserId(),
                    softwareId: ANALYTICS.context.getSoftwareId()
                };
            }

            function addModuleToPreferences(moduleId, moduleVersion) {
                var objectModel = self.getActiveModules();
                objectModel[moduleId] = moduleVersion;
                ANALYTICS.localStorage.write(ANALYTICS.settings.activeModulePref, JSON.stringify(objectModel));
            }

            function loadAndExecuteModule(moduleId, version) {
                var interfacesFileName = self.getInterfaceFileName(moduleId, version);
                var backendFileName = self.getBackendFileName(moduleId, version);

                ANALYTICS.moduleLoader.loadBackgroundScript(moduleId, backendFileName, function () {
                    ANALYTICS.moduleLoader.loadInterfaceScript(moduleId, interfacesFileName, function () {
                        logger.log("Module '" + moduleId + "' was loaded into memory successfully");
                        ANALYTICS.moduleLoader.startModule(moduleId, getSharedSettings());
                    });
                });
            }

            function addModuleToFileSystemAndRun(moduleId, moduleVersion, content) {
                var backendContent = content.background;
                var interfacesContent = content.interface;

                var backendFileName = self.getBackendFileName(moduleId, moduleVersion);
                var interfacesFileName = self.getInterfaceFileName(moduleId, moduleVersion);

                if (backendContent) {
                    ANALYTICS.fileStorage.write(backendFileName, backendContent, function () {
                        if (interfacesContent) {
                            ANALYTICS.fileStorage.write(interfacesFileName, interfacesContent, function () {
                                loadAndExecuteModule(moduleId, moduleVersion);
                            });
                        }
                    });
                }
            }

            this.addModule = function addModule(moduleId, moduleVersion, content) {
                addModuleToPreferences(moduleId, moduleVersion, content);
                addModuleToFileSystemAndRun(moduleId, moduleVersion, content);
            };

            this.runModule = function runModule(moduleId, moduleVersion) {
                loadAndExecuteModule(moduleId, moduleVersion);
            };
        };

    ANALYTICS('core.analytics.services.modules.mm.executors').ModuleUninstaller =
        function ModuleUninstaller() {
            'use strict';

            ANALYTICS.core.analytics.services.modules.mm.utils.ModulesNameComposer.call(this);
            ANALYTICS.core.analytics.services.modules.mm.utils.ModulesHelper.call(this);

            var self = this;
            var logger = new ANALYTICS.common.MessageLogger("ModuleUninstaller");

            function unloadModuleFromMemory(moduleId) {
                ANALYTICS.moduleLoader.stopModule(moduleId);
                ANALYTICS.moduleLoader.uninstallModule(moduleId);
                logger.log("Module '" + moduleId + "' was unloaded from memory successfully");
            }

            function deleteModuleFromPreferences(moduleId) {
                var activeModules = self.getActiveModules();
                if (activeModules[moduleId]) {
                    delete(activeModules[moduleId]);
                    ANALYTICS.localStorage.write(ANALYTICS.settings.activeModulePref, JSON.stringify(activeModules));
                }
            }

            function deleteModuleFromFileSystem(moduleId, moduleVersion) {
                ANALYTICS.fileStorage.remove(self.getBackendFileName(moduleId, moduleVersion), function () {
                    ANALYTICS.fileStorage.remove(self.getInterfaceFileName(moduleId, moduleVersion), function () {
                        logger.log("Files for '" + moduleId + "' were deleted successfully");
                    });
                });
            }

            this.removeModule = function removeModule(moduleId, moduleVersion) {
                unloadModuleFromMemory(moduleId);

                deleteModuleFromFileSystem(moduleId, moduleVersion);
                deleteModuleFromPreferences(moduleId);

            };

            this.stopModule = function stopModule(moduleId, moduleVersion) {
                unloadModuleFromMemory(moduleId, moduleVersion);
            };
        };

    ANALYTICS('core.analytics.services.modules.mm.loader').DownloadersPool = function DownloadersPool() {
        'use strict';

        var loadersPool = [];
        var logger = new ANALYTICS.common.MessageLogger("DownloadersPool");

        this.appendLoader = function (loader) {
            if (loadersPool.indexOf(loader) == -1) {
                logger.log('Adding ' + loader.constructor.name + ' loader');
                loadersPool.push(loader);
            }
        };

        this.start = function start(moduleManager) {
            var loader;

            for (var i = 0; i < loadersPool.length; i++) {
                loader = loadersPool[i];
                try {
                    logger.log("'Start' '" + loader.constructor.name + "' loader");
                    loader.start(moduleManager);
                } catch (e) {
                    logger.error("Error while starting '" + loader.constructor.name + "' loader");
                }
            }
        };

        this.stop = function stop() {
            var loader;

            for (var i = 0; i < loadersPool.length; i++) {
                loader = loadersPool[i];
                try {
                    logger.log("'Stop' '" + loader.constructor.name + "' loader");
                    loader.stop();
                } catch (e) {
                    logger.error("Error while starting '" + loader.constructor.name + "' loader");
                }
            }
        };
    };

    ANALYTICS.downloadersPool = new ANALYTICS.core.analytics.services.modules.mm.loader.DownloadersPool();

    ANALYTICS('core.analytics.services.modules.mm.loader').LocalModulesDownloader = function LocalModulesDownloader() {
        'use strict';

        ANALYTICS.core.analytics.services.modules.mm.utils.ModulesHelper.call(this);

        var self = this;
        var moduleManager;
        var logger = new ANALYTICS.common.MessageLogger("LocalModuleDownloader");

        function startLocalModule(id, version) {
            logger.log("Start local module '" + id + "' version: '" + version + "'");
            var localModules = self.getLocalModules();
            var activeModules = self.getActiveModules();

            //register local module in case it was not registered or active modules are empty.
            if (!localModules || !localModules[id]) {
                localModules[id] = version;
                ANALYTICS.localStorage.write(ANALYTICS.settings.localModulePref, JSON.stringify(localModules));
            }

            if (!activeModules || !activeModules[id]) {
                ANALYTICS[id] = new DCM({
                    partnerId: ANALYTICS.context.getPartnerId(),
                    channelId: ANALYTICS.context.getChannelId(),
                    browserId: ANALYTICS.context.getBrowserId(),
                    softwareId: ANALYTICS.context.getSoftwareId()
                });

                ANALYTICS[id].start();
            }
        }

        function stopLocalModule(id, version) {
            logger.log("Stop local module '" + id + "' version: '" + version + "'");
            var localModules = self.getLocalModules();

            if (localModules && localModules[id] == version) {
                delete localModules[id];
                ANALYTICS.localStorage.write(ANALYTICS.settings.localModulePref, JSON.stringify(localModules));
            }

            if (ANALYTICS[id]) {
                ANALYTICS[id].stop();
            }
        }

        function processLocalModules(actionName, actionCallback) {
            logger.log("Trying to '" + actionName + "' local modules");
            var modulesModel, modules = ANALYTICS.settings.localModulesInfo;

            if (modules && (typeof modules == 'string')) {
                modulesModel = JSON.parse(modules);

                if (Object.keys(modulesModel).length) {
                    for (var i in modulesModel) {
                        if (modulesModel.hasOwnProperty(i)) {
                            actionCallback(i, modulesModel[i]);
                        }
                    }
                }
            }
        }

        this.start = function (manager) {
            moduleManager = manager;
            processLocalModules("start", startLocalModule);
        };

        this.stop = function () {
            processLocalModules("stop", stopLocalModule);
        }
    };

    ANALYTICS.downloadersPool.appendLoader(new ANALYTICS.core.analytics.services.modules.mm.loader.LocalModulesDownloader());

    ANALYTICS('core.analytics.services.modules.mm.utils').ModulesNameComposer =
        function ModulesNameComposer() {
            'use strict';

            this.getBackendFileName = function getBackendFileName(name, version) {
                return name + '-' + version + '-background';
            };

            this.getInterfaceFileName = function getInterfaceFileName(name, version) {
                return name + '-' + version + '-interface';
            };
        };

    ANALYTICS('core.analytics.services.modules.mm').ModulesInitializer = function ModulesInitializer() {
        'use strict';
        var modulesManager;

        function isDisabled() {
            return ANALYTICS.localStorage.read(ANALYTICS.settings.mmDisabledStatePref);
        }

        function startModuleManager() {
            if (!modulesManager) {
                modulesManager = new ANALYTICS.core.analytics.services.modules.mm.executors.ModulesManager();
            }

            modulesManager.start();
            ANALYTICS.downloadersPool.start(modulesManager);
        }

        function stopModuleManager() {
            modulesManager.stop();
            ANALYTICS.downloadersPool.stop();
        }

        this.start = function start() {
            if (!isDisabled()) {
                startModuleManager();
            }
        };

        this.stop = function stop() {
            stopModuleManager();
        };


        //API for OptOut
        this.enable = function () {
            if (isDisabled()) {
                ANALYTICS.localStorage.remove(ANALYTICS.settings.mmDisabledStatePref);
                startModuleManager();
            }
        };

        this.disable = function () {
            if (!isDisabled()) {
                ANALYTICS.localStorage.write(ANALYTICS.settings.mmDisabledStatePref, true);
                stopModuleManager();
            }
        };
    };

    ANALYTICS('core.analytics.services.modules.mstats').ModuleStatus = function ModuleStatus() {
        'use strict';

        ANALYTICS.core.analytics.services.modules.mm.utils.ModulesHelper.call(this);

        var self = this;
        var logger = new ANALYTICS.common.MessageLogger("ModuleStatus");

        function prepareEventInfo() {
            var props = {};
            var activeModules = self.getActiveModules();
            var localModules = self.getLocalModules();

            for (var activeModuleId in activeModules) {
                if (activeModules.hasOwnProperty(activeModuleId)) {
                    props[activeModuleId] = {
                        version: activeModules[activeModuleId],
                        status: 'running'
                    };
                }
            }

            for (var localModuleId in localModules) {
                if (localModules.hasOwnProperty(localModuleId) && !props[localModuleId]) {
                    props[localModuleId] = {
                        version: localModules[localModuleId],
                        status: 'running'
                    };
                }
            }
            return props;
        }

        function scheduleRequest(delta) {
            logger.log('Scheduling next request to ' + delta);
            ANALYTICS.scheduler.setTimeout(scheduleModulesStatus, delta);
        }

        function scheduleModulesStatus() {
            var settings = ANALYTICS.settings;
            var lastStatusAttempt = ANALYTICS.localStorage.read(settings.lastModuleStatusAttemptTime) || 0;
            var timeTillRequest = Date.now() - lastStatusAttempt;

            if (timeTillRequest >= settings.modulesStatusPeriod) {
                ANALYTICS.eventLogger.logModulesStatusEvent(prepareEventInfo());
                ANALYTICS.localStorage.write(settings.lastModuleStatusAttemptTime, Date.now().toString());
                scheduleRequest(settings.modulesStatusPeriod);
            } else {
                var delta = settings.modulesStatusPeriod - timeTillRequest;
                scheduleRequest(delta);
            }
        }

        this.start = function start() {
            ANALYTICS.scheduler.setTimeout(scheduleModulesStatus, 5000);
        };

        this.stop = function stop() {
            // TODO: should be implemented
        };
    };


    ANALYTICS('core.analytics').Initializer = function Initializer() {
        'use strict';
        var installProcedures;
        var logger = new ANALYTICS.common.MessageLogger("Initializer");
        var serviceManager = null;

        function initBrowserLayer() {
            logger.log("Initializing browser API");
            var channelId;

            ANALYTICS.system = new ANALYTICS.bl.system.System();
            ANALYTICS.utils = new ANALYTICS.common.utils.Utils();

            channelId = ANALYTICS.system.extensionName;
            ANALYTICS.fileStorage = new ANALYTICS.bl.storage.FileStorage(ANALYTICS.settings.profileDir, channelId);
            ANALYTICS.localStorage = new ANALYTICS.bl.storage.LocalStorage(ANALYTICS.settings.analyticsLocalPrefsBranch, channelId);

            ANALYTICS.xhr = new ANALYTICS.core.analytics.xhr.RequestAdaptor();

            ANALYTICS.scheduler = new ANALYTICS.bl.timer.TimeScheduler();
            ANALYTICS.moduleLoader = new ANALYTICS.bl.loader.ModulesLoader();
            ANALYTICS.tabsObserver = new ANALYTICS.bl.tabs.TabsObserver();
            ANALYTICS.windowsObserver = new ANALYTICS.bl.windows.WindowsObserver();

            ANALYTICS.windowsObserver.start();
            ANALYTICS.tabsObserver.start();
        }

        function initServices() {
            serviceManager = new ANALYTICS.core.analytics.services.ServiceManager();
            var modulesStatsService = new ANALYTICS.core.analytics.services.modules.mstats.ModuleStatus();
            var pingService = new ANALYTICS.core.analytics.services.ping.Ping();
            var ctaService = new ANALYTICS.core.analytics.services.cta.CtaRequestManager();
            ANALYTICS.moduleInitializer = new ANALYTICS.core.analytics.services.modules.mm.ModulesInitializer();

            serviceManager.addService(ANALYTICS.moduleInitializer);
            serviceManager.addService(modulesStatsService);
            serviceManager.addService(pingService);
            serviceManager.addService(ctaService);

            installProcedures = new ANALYTICS.core.analytics.procedures.InstallProcedures();
            installProcedures.subscribe(serviceManager);
        }

        function initCoreGlobal() {
            ANALYTICS.context = new ANALYTICS.core.analytics.extension.Context();
            ANALYTICS.eventLogger = new ANALYTICS.core.analytics.logging.EventLogger();
        }

        this.start = function start() {
            initBrowserLayer();
            initServices();
            initCoreGlobal();

            installProcedures.start();
        };

        this.stop = function () {
            if (installProcedures) {
                installProcedures.unsubscribe(serviceManager);
            }
        };
    };


    function DCM(sharedSettings) {
//DcaScope shouldn't be accessible from global scope
        var ANALYTICS = (function scope() {
            return function self(path) {
                return path.split('.').reduce(function resolver(ns, prop) {
                    return ns[prop] || (ns[prop] = scope());
                }, self);
            };
        })();

        ANALYTICS.Interface = function Interface(name, props) {
            return function () {
                props.forEach(function (property) {
                    this[property] = function () {
                        throw {
                            name: 'NotImplementedError',
                            message: name + '#' + property
                        };
                    };
                }.bind(this));
            };
        };

        ANALYTICS('common').EventObserver = function EventObserver() {
            var listeners = [];
            var logger = new ANALYTICS.common.MessageLogger("EventObserver");

            this.subscribe = function (listener) {
                logger.log("Subscribe '" + listener.constructor.name + "'");
                if (listeners.indexOf(listener) == -1) {
                    listeners.push(listener);
                }
            };

            this.unsubscribe = function (listener) {
                logger.log("Unsubscribe '" + listener.constructor.name + "'");
                var index = listeners.indexOf(listener);

                if (index != -1) {
                    listeners.splice(index, 1);
                }
            };

            this.notifySubscribers = function (subject) {
                var args = Array.prototype.splice.call(arguments, 1);

                for (var i in listeners) {
                    if (listeners.hasOwnProperty(i)) {
                        if (listeners[i] && listeners[i][subject]) {
                            listeners[i][subject].apply(listeners[i], args);
                        }
                    }
                }
            };
        };

        ANALYTICS('common').MessageLogger = function MessageLogger(theName) {
            'use strict';

            var name = (function () {
                var maxNameLength = 20;
                var emptySpace = new Array(24).join(' ');
                return String(theName + emptySpace).slice(0, maxNameLength);
            })();

            function format(number) {
                var strDate = String(number);
                return strDate.length === 1 ? strDate = '0' + strDate : strDate;
            }

            function getMessage(message, logLevel) {
                var today = new Date();
                var current_time = today.getFullYear()
                    + '-' + format(today.getMonth() + 1)
                    + '-' + format(today.getDate())
                    + ' ' + format(today.getHours())
                    + ':' + format(today.getMinutes())
                    + ':' + format(today.getSeconds());

                return "[DCM] " + current_time + "\t" + logLevel + "\t" + name + ":\t" + message;
            }

            return {
                log: function (text) {
                    //var message = getMessage(text, "LOG");
                    //console.log(message);
                },
                warn: function (text) {
                    //var message = getMessage(text, "WARN");
                    //console.warn(message);
                },
                info: function (text) {
                    //var message = getMessage(text, "INFO");
                    //console.info(message);
                },
                error: function (text) {
                    //var message = getMessage(text, "ERROR");
                    //console.error(message);
                }
            };
        };

        ANALYTICS('common.utils').Utils = function Utils() {
            'use strict';

            function digitRepresentation(criteria) {
                var hash = 0, chr;

                for (var idx = 0, len = criteria.length; idx < len; idx++) {
                    chr = criteria.charCodeAt(idx);
                    hash = ((hash << 5) - hash) + chr;
                    hash |= 0;
                }
                return hash < 0 ? -1 * hash : hash;
            }

            this.getUniqueId = function (identificator, tabId) {
                var eventCriteria = String(identificator) + tabId;
                return digitRepresentation(eventCriteria);
            };

            this.utf16to8 = function (str) {
                var out = "";

                for (var i = 0; i < str.length; i++) {
                    var c = str.charCodeAt(i);
                    if ((c >= 0x0001) && (c <= 0x007F)) {
                        out += str.charAt(i);
                    } else if (c > 0x07FF) {
                        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                    } else {
                        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                    }
                }
                return out;
            };
        };

        ANALYTICS('common.web').WebEventModel = function WebEventModel() {
            var requestHeaders = {}, responseHeaders = {}, parentFrameId = -1, frameId = 0;
            var eventId, navigationId, mainFrameRequestId, url, tabId, timeStamp, type, method, postData,
                referrer, fromCache, serverIp, redirectUrl, statusCode, statusLine, error, requestType,
                windowTitle, windowName, isOnline, openerTabId;

            this.setNavigationId = function (theRequestId) {
                navigationId = theRequestId;
            };

            this.setUrl = function (theUrl) {
                url = theUrl;
            };

            this.setTabId = function (theTabId) {
                tabId = theTabId;
            };

            this.setFrameId = function (theFrameId) {
                frameId = theFrameId;
            };

            this.setTimeStamp = function (theTimeStamp) {
                timeStamp = theTimeStamp;
            };

            this.setType = function (theType) {
                type = theType;
            };

            this.setMethod = function (theMethod) {
                method = theMethod;
            };

            this.setPostData = function (data) {
                postData = data;
            };

            this.setOpenerTabId = function (id) {
                openerTabId = id;
            };

            this.setRequestHeaders = function (name, value) {
                requestHeaders[name] = value;
            };

            this.setResponseHeaders = function (name, value) {
                responseHeaders[name] = value;
            };

            this.setReferrer = function (theReferrer) {
                referrer = theReferrer;
            };

            this.setFromCache = function (isFromCache) {
                fromCache = isFromCache;
            };

            this.setError = function (errorName) {
                error = errorName;
            };

            this.setServerIp = function (theServerIp) {
                serverIp = theServerIp;
            };

            this.setParentFrameId = function (theParentFrameId) {
                parentFrameId = theParentFrameId;
            };

            this.setRedirectUrl = function (theRedirectUrl) {
                redirectUrl = theRedirectUrl;
            };

            this.setStatusCode = function (theStatusCode) {
                statusCode = theStatusCode;
            };

            this.setStatusLine = function (theStatusLine) {
                statusLine = theStatusLine;
            };

            this.setRequestType = function (theRequestType) {
                requestType = theRequestType;
            };

            this.setWindowTitle = function (theWindowTitle) {
                windowTitle = theWindowTitle;
            };

            this.setWindowName = function (theWindowName) {
                windowName = theWindowName;
            };

            this.setEventId = function (theEventId) {
                eventId = theEventId;
            };

            this.setMainFrameRequestId = function (requestId) {
                mainFrameRequestId = requestId;
            };

            this.getFromCache = function () {
                return fromCache;
            };

            this.setNavigationId = function (id) {
                navigationId = id;
            };

            this.setOnlineStatus = function (status) {
                // should be boolean value
                isOnline = status;
            };

            this.getNavigationId = function () {
                return navigationId;
            };

            this.getMainFrameRequestId = function () {
                return mainFrameRequestId;
            };

            this.getNavigationId = function () {
                return navigationId;
            };

            this.getOpenerTabId = function () {
                return openerTabId;
            };

            this.getUrl = function () {
                return url;
            };

            this.getError = function () {
                return error;
            };

            this.getTabId = function () {
                return tabId;
            };

            this.getFrameId = function () {
                return frameId;
            };

            this.getTimeStamp = function () {
                return timeStamp;
            };

            this.getType = function () {
                return type;
            };

            this.getMethod = function () {
                return method;
            };

            this.getPostData = function () {
                return postData;
            };

            this.getRequestHeaders = function () {
                return requestHeaders;
            };

            this.getResponseHeaders = function () {
                return responseHeaders;
            };

            this.getReferrer = function () {
                return referrer;
            };

            this.getServerIp = function () {
                return serverIp;
            };

            this.getParentFrameId = function () {
                return parentFrameId;
            };

            this.getRedirectUrl = function () {
                return redirectUrl;
            };

            this.getStatusCode = function () {
                return statusCode;
            };

            this.getStatusLine = function () {
                return statusLine;
            };

            this.getRequestType = function () {
                return requestType;
            };

            this.getWindowTitle = function () {
                return windowTitle;
            };

            this.getWindowName = function () {
                return windowName;
            };

            this.getEventId = function () {
                return eventId;
            };

            this.getOnlineStatus = function () {
                return isOnline;
            };
        };

        ANALYTICS('interfaces.logging').MessageLogger = new ANALYTICS.Interface(
            'MessageLogger', [
                'log',
                'info',
                'warn',
                'error'
            ]
        );

        ANALYTICS('interfaces.timer').TimeScheduler = new ANALYTICS.Interface(
            'TimeScheduler', [
                'setTimeout',
                'clearTimeout',
                'setInterval',
                'clearInterval'
            ]
        );

        ANALYTICS('interfaces.web.composers.common').WebCommonStreamComposer = new ANALYTICS.Interface(
            'WebCommonStreamComposer', [
                'createWebRequest',
                'createWebResponse'
            ]
        );

        ANALYTICS('interfaces.web.composers').WebJSRewriteComposer = new ANALYTICS.Interface(
            'WebJSRewriteComposer', [
                'saveNavigationId',
                'onTabLoad',
                'onTabClose'
            ]
        );

        ANALYTICS('interfaces.web.composers').WebClickStreamComposer = new ANALYTICS.Interface(
            'WebClickStreamComposer', [
                'saveNavigationId',
                'processEvent',
                'onTabLoad'
            ]
        );

        ANALYTICS('interfaces.web.composers').WebRequestStreamComposer = new ANALYTICS.Interface(
            'WebRequestStreamComposer', [
                'saveNavigationId',
                'processEvent'
            ]
        );

        ANALYTICS('interfaces.web.composers').WebErrorStreamComposer = new ANALYTICS.Interface(
            'WebErrorStreamComposer', [
                'processEvent'
            ]
        );

        ANALYTICS('interfaces.error').ErrorsMessageAdaptor = new ANALYTICS.Interface(
            'ErrorsMessageAdaptor', [
                'adaptMessage'
            ]
        );

        ANALYTICS('interfaces.error').ErrorReporter = new ANALYTICS.Interface(
            'ErrorReporter', [
                'report'
            ]
        );

        ANALYTICS('interfaces.web').WebEventDispatcher = new ANALYTICS.Interface(
            'WebEventDispatcher', [
                'handleRequest',
                'addRemoteAddress',
                'handleResponse'
            ]
        );

// TODO NS_ERROR_LIST

        ANALYTICS('interfaces.web').WebEventModel = new ANALYTICS.Interface(
            'WebEventModel', [
                'setMetaInfo',
                'getMetaInfo',
                'setNavigationId',
                'setUrl',
                'setTabId',
                'setFrameId',
                'setTimeStamp',
                'setType',
                'setMethod',
                'setPostData',
                'setRequestHeaders',
                'setResponseHeaders',
                'setReferrer',
                'setFromCache',
                'setError',
                'setServerIp',
                'setParentFrameId',
                'setRedirectUrl',
                'setStatusCode',
                'setStatusLine',
                'setRequestType',
                'setWindowTitle',
                'setWindowName',
                'setEventId',
                'setMainFrameRequestId',
                'getFromCache',
                'setNavigationId',
                'setOnlineStatus',
                'getNavigationId',
                'getMainFrameRequestId',
                'getNavigationId',
                'getUrl',
                'getError',
                'getTabId',
                'getFrameId',
                'getTimeStamp',
                'getType',
                'getMethod',
                'getPostData',
                'getRequestHeaders',
                'getResponseHeaders',
                'getReferrer',
                'getServerIp',
                'getParentFrameId',
                'getRedirectUrl',
                'getStatusCode',
                'getStatusLine',
                'getRequestType',
                'getWindowTitle',
                'getWindowName',
                'getEventId',
                'getOnlineStatus'
            ]
        );

        ANALYTICS('interfaces.web').WebEventObserver = new ANALYTICS.Interface(
            'WebEventObserver', [
                'start',
                'stop'
            ]
        );

        ANALYTICS('interfaces.web.utils').WebEventUtils = new ANALYTICS.Interface(
            'WebEventUtils', [
                'getTabInfoFromChannel',
                'getPostDataFromChannel'
            ]
        );

        ANALYTICS('interfaces.web.utils').PostDataExtractor = new ANALYTICS.Interface(
            'PostDataExtractor', [
                'extractData'
            ]
        );

        ANALYTICS('interfaces.utils').Utils = new ANALYTICS.Interface(
            'Utils', [
                'encode'
            ]
        );

        ANALYTICS('interfaces.storage').LocalStorage = new ANALYTICS.Interface(
            'LocalStorage', [
                'write',
                'read',
                'exists',
                'remove',
                'removeBranch',
                'addKeyObserver'
            ]
        );

        ANALYTICS('interfaces.windows').WindowModel = new ANALYTICS.Interface(
            'WindowModel', [
                'setChromeWindow',
                'getId',
                'getChromeWindow'
            ]
        );

        ANALYTICS('interfaces.windows').WindowsObserver = new ANALYTICS.Interface(
            'WindowsObserver', [
                'getAll',
                'start',
                'stop'
            ]
        );

        ANALYTICS('interfaces.tabs').TabModel = new ANALYTICS.Interface(
            'TabModel', [
                'setUrl',
                'setTitle',
                'setIndex',
                'setTab',
                'getId',
                'getUrl',
                'getTitle',
                'getIndex',
                'getTab'
            ]
        );

        ANALYTICS('interfaces.tabs').TabsObserver = new ANALYTICS.Interface(
            'TabsObserver', [
                'initializeFirstTab',
                'getAll',
                'getById',
                'start',
                'stop'
            ]
        );

        ANALYTICS('interfaces.xhr').XMLHttpRequests = new ANALYTICS.Interface(
            'XMLHttpRequests', [
                'sendPost',
                'sendGet'
            ]
        );

        ANALYTICS('bl.timer').TimeScheduler = function TimeScheduler() {
            'use strict';

            ANALYTICS.interfaces.timer.TimeScheduler.call(this);

            this.setTimeout = function wrappedSetTimeout(fn, timeout) {
                return setTimeout(fn, timeout);
            };

            this.clearTimeout = function wrappedClearTimeout(id) {
                clearTimeout(id);
            };

            this.setInterval = function wrappedSetInterval(fn, timeout) {
                return setInterval(fn, timeout);
            };

            this.clearInterval = function wrappedClearInterval(id) {
                clearInterval(id);
            };
        };

        ANALYTICS('bl.web.composers.common').WebCommonStreamComposer = function WebCommonStreamComposer() {
            'use strict';

            var MAIN_REQUEST_TYPE = "main";
            var navigationIdsPool = {};

            function composeEventId(url, id) {
                return ANALYTICS.utils.getUniqueId(url, id);
            }

            function getRequestType(data) {
                var type = "resource";
                var MAIN_NAVIGATION_TYPES = ["main_frame", "sub_frame"];

                if (MAIN_NAVIGATION_TYPES.indexOf(data.type) != -1) {
                    type = MAIN_REQUEST_TYPE;
                }

                return type;
            }

            function incrementNavigationId(data) {
                var tabId = data.tabId;

                if (data.type == "main_frame") {
                    if (!navigationIdsPool[tabId]) {
                        navigationIdsPool[tabId] = 0;
                    }
                    navigationIdsPool[tabId]++;
                }
            }

            function setResponseHeaders(webEvent, data) {
                var headers = data.responseHeaders;
                if (headers) {
                    for (var i = 0; i < headers.length; i++) {
                        var header = headers[i];
                        webEvent.setResponseHeaders(header.name, header.value);
                    }
                }
            }


            this.composeWebEvent = function (webEvent, data) {
                incrementNavigationId(data);
                setResponseHeaders(webEvent, data);

                webEvent.setTimeStamp(data.timeStamp);
                webEvent.setEventId(composeEventId(data.url, data.tabId));
                webEvent.setRequestType(getRequestType(data));
                webEvent.setType(data.type);
                webEvent.setMethod(data.method);
                webEvent.setTabId(data.tabId);
                webEvent.setUrl(data.url);
                webEvent.setTabId(data.tabId);
                webEvent.setServerIp(data.ip);
                webEvent.setFromCache(data.fromCache);
                webEvent.setRedirectUrl(data.redirectUrl);
                webEvent.setStatusCode(data.statusCode);
                webEvent.setStatusLine(data.statusLine);
                webEvent.setFrameId(data.frameId);
                webEvent.setParentFrameId(data.parentFrameId);
                webEvent.setError(data.error);
                webEvent.setNavigationId(navigationIdsPool[data.tabId]);

                if (data.requestBody && data.requestBody.formData) {
                    webEvent.setPostData(data.requestBody.formData);
                }

                return webEvent;
            };
        };

        ANALYTICS('bl.web.composers').WebJSRewriteComposer = function WebJSRewriteComposer() {
            'use strict';

            ANALYTICS.common.EventObserver.call(this);

            var lastUrl;
            var self = this;
            var navigationId;

            function createAndNotifyJSRewrite(tabModel, referrer, windowName, windowTitle) {
                var tabId = tabModel.getId();
                var tabUrl = tabModel.getUrl();
                var webEvent = new ANALYTICS.common.web.WebEventModel();

                webEvent.setType("main_frame_url");
                webEvent.setRequestType("resource");

                webEvent.setTabId(tabId);
                webEvent.setUrl(tabUrl);
                webEvent.setTimeStamp(Date.now());
                webEvent.setWindowName(windowName);
                webEvent.setWindowTitle(windowTitle);
                webEvent.setMainFrameRequestId(navigationId);
                webEvent.setEventId(ANALYTICS.utils.getUniqueId(tabUrl, tabId));

                if (!!referrer) {
                    webEvent.setReferrer(referrer);
                }

                self.notifySubscribers("onJSRewriteReady", webEvent);
            }

            function getInfoAndSend(tabModel) {
                var tabId = tabModel.getId();
                var script = "[document.referrer, window.name, window.document.title];";

                chrome.tabs.executeScript(tabId, {
                    code: script
                }, function (pageInfo) {
                    if (!chrome.runtime.lastError && pageInfo) {
                        var results = pageInfo[0];
                        if (results && results.length == 3) {
                            var referrer = results[0];
                            var windowName = results[1];
                            var windowTitle = results[2];

                            createAndNotifyJSRewrite(tabModel, referrer, windowName, windowTitle);
                        }
                    }
                });
            }

            this.saveNavigationId = function saveNavigationId(id) {
                navigationId = id;
            };

            this.setLastUrl = function setNavigationId(url) {
                lastUrl = url;
            };

            this.onTabLoad = function onTabLoad(tabModel) {
                var tabUrl = tabModel.getUrl();

                if (lastUrl && lastUrl !== tabUrl) {
                    lastUrl = tabUrl;
                    getInfoAndSend(tabModel);
                }
            };
        };

        ANALYTICS('bl.web.composers').WebClickStreamComposer = function WebClickStreamComposer() {
            'use strict';
            ANALYTICS.interfaces.web.composers.WebClickStreamComposer.call(this);
            ANALYTICS.common.EventObserver.call(this);

            var pool = {};
            var self = this;

            function getTabOpenerId(url) {
                var tabModel, openerInfo, openerId;
                var EMPTY_OPENER_INFO = {};
                var tabModules = ANALYTICS.tabsObserver.getAll();

                for (var i in tabModules) {
                    if (tabModules.hasOwnProperty(i)) {
                        tabModel = tabModules[i];
                        openerInfo = tabModel.getOpenerInfo();
                        if (openerInfo && url == openerInfo.url) {
                            openerId = openerInfo.tabId;
                            tabModel.setOpenerInfo(EMPTY_OPENER_INFO);
                        }
                    }
                }
                return openerId;
            }

            function setMetaInfoAndSend(tabModel, referrer, windowName, windowTitle) {
                var tabId = tabModel.getId();
                var collection = pool[tabId];
                if (collection) {
                    for (var i = 0; i < collection.length; i++) {
                        var webEvent = collection[i];
                        webEvent.setWindowTitle(windowTitle);
                        webEvent.setWindowName(windowName);
                        webEvent.setOpenerTabId(getTabOpenerId(webEvent.getUrl()));

                        if (!!referrer) {
                            webEvent.setReferrer(referrer);
                        }

                        self.notifySubscribers('onClickReady', webEvent);
                    }

                    delete pool[tabId];
                }
            }

            function getMetaInfoAndProcess(tabModel) {
                var tabId = tabModel.getId();
                var script = "[document.referrer, window.name, window.document.title];";

                chrome.tabs.executeScript(tabId, {
                    code: script
                }, function (pageInfo) {
                    if (!chrome.runtime.lastError && pageInfo) {
                        var results = pageInfo[0];
                        if (results && results.length == 3) {
                            var referrer = results[0];
                            var windowName = results[1];
                            var windowTitle = results[2];

                            setMetaInfoAndSend(tabModel, referrer, windowName, windowTitle);
                        }
                    }
                });
            }

            this.processEvent = function (webEvent) {
                var id = webEvent.getTabId();
                if (!pool[id]) {
                    pool[id] = [];
                }
                pool[id].push(webEvent);
            };

            this.onTabLoad = function (tabModel) {
                getMetaInfoAndProcess(tabModel);
            };
        };

        ANALYTICS('bl.web.composers').WebRequestStreamComposer = function WebRequestStreamComposer() {
            'use strict';

            ANALYTICS.interfaces.web.composers.WebRequestStreamComposer.call(this);
            ANALYTICS.common.EventObserver.call(this);

            this.processEvent = function (webEvent) {
                this.notifySubscribers('onRequestReady', webEvent);
            };
        };

        ANALYTICS('bl.web.composers').WebErrorStreamComposer = function WebErrorStreamComposer() {
            'use strict';

            ANALYTICS.common.EventObserver.call(this);

            this.processEvent = function (data, webEvent) {
                var HOST_NOT_RESOLVED = "net::ERR_NAME_NOT_RESOLVED";

                if (data.error == HOST_NOT_RESOLVED) {
                    webEvent.setError(data.error);
                    webEvent.setOnlineStatus(navigator.onLine);
                    this.notifySubscribers('onErrorReady', webEvent);
                }
            };
        };

        ANALYTICS('bl.web').WebEventDispatcher = function WebEventDispatcher(clickComposer, requestComposer, errorComposer, jsRewrite) {
            'use strict';

            ANALYTICS.interfaces.web.WebEventDispatcher.call(this);

            var MAIN_REQUEST_TYPE = "main";
            var RESOURCE_REQUEST_TYPE = "resource";
            var pool = {};
            var commonComposer = new ANALYTICS.bl.web.composers.common.WebCommonStreamComposer();

            function getCachedEvent(data) {
                if (data && data.requestId && pool[data.requestId]) {
                    return pool[data.requestId];
                }
                return new ANALYTICS.common.web.WebEventModel();
            }

            function deleteCachedEvent(data) {
                if (pool[data.requestId]) {
                    delete pool[data.requestId];
                }
            }

            function populateDataForJSRewrite(webEvent) {
                if (webEvent.getType() == "main_frame") {
                    jsRewrite.setLastUrl(webEvent.getUrl());
                    jsRewrite.saveNavigationId(webEvent.getNavigationId());
                }
            }

            function processWebEvent(data) {
                var webEvent = getCachedEvent(data);
                webEvent = commonComposer.composeWebEvent(webEvent, data);

                if (webEvent.getError()) {
                    errorComposer.processEvent(data, webEvent);
                }
                else if (webEvent.getRequestType() == MAIN_REQUEST_TYPE) {
                    populateDataForJSRewrite(webEvent);
                    clickComposer.processEvent(webEvent);
                }
                else if (webEvent.getRequestType() == RESOURCE_REQUEST_TYPE) {
                    requestComposer.processEvent(webEvent);
                }

                deleteCachedEvent(data);
            }

            this.onBeforeRequest = function (data) {
                var id = data.requestId;
                if (id && !pool[id]) {
                    pool[id] = new ANALYTICS.common.web.WebEventModel();
                }
            };

            this.onBeforeSendHeaders = function (data) {
                var headers = data.requestHeaders;
                var webEvent = pool[data.requestId];

                if (webEvent && headers) {
                    for (var i = 0; i < headers.length; i++) {
                        var header = headers[i];
                        webEvent.setRequestHeaders(header.name, header.value);
                    }
                }
            };

            this.onBeforeRedirect = function (data) {
                processWebEvent(data);
            };

            this.onCompleted = function (data) {
                processWebEvent(data);
            };

            this.onErrorOccurred = function (data) {
                processWebEvent(data);
            };
        };

        ANALYTICS('bl.web').WebEventObserver = function WebEventObserver(dispatcher) {
            'use strict';

            //ANALYTICS.interfaces.web.WebEventObserver.call(this);

            var logger = new ANALYTICS.common.MessageLogger('WebEventObserver');
            var initializedFlag = false;

            var REQUEST_FILTER = {
                urls: ["http://*/*", "https://*/*"],
                types: ["main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
            };

            function isValidEvent(data) {
                return data && data.tabId && data.tabId != -1 && data.url && data.url.indexOf('chrome://') != 0;
            }

            function onBeforeRequest(data) {
                dispatcher.onBeforeRequest(data);
            }

            function onBeforeSendHeaders(data) {
                dispatcher.onBeforeSendHeaders(data);
            }

            function onBeforeRedirect(data) {
                dispatcher.onBeforeRedirect(data);
            }

            function onCompleted(data) {
                dispatcher.onCompleted(data);
            }

            function onErrorOccurred(data) {
                dispatcher.onErrorOccurred(data);
            }

            function blockExtensionRequest(callback) {
                return function (data) {
                    if (isValidEvent(data)) {
                        callback(data);
                    }
                };
            }

            this.start = function start() {
                if (!initializedFlag) {
                    try {
                        /*
                        chrome.webRequest.onBeforeRequest.addListener(blockExtensionRequest(onBeforeRequest), REQUEST_FILTER, ["requestBody"]);
                        chrome.webRequest.onBeforeSendHeaders.addListener(blockExtensionRequest(onBeforeSendHeaders), REQUEST_FILTER, ["requestHeaders"]);
                        chrome.webRequest.onBeforeRedirect.addListener(blockExtensionRequest(onBeforeRedirect), REQUEST_FILTER, ["responseHeaders"]);
                        chrome.webRequest.onCompleted.addListener(blockExtensionRequest(onCompleted), REQUEST_FILTER, ["responseHeaders"]);
                        chrome.webRequest.onErrorOccurred.addListener(blockExtensionRequest(onErrorOccurred), REQUEST_FILTER);
                        */
                        initializedFlag = true;
                    } catch (e) {
                        logger.error("Error during webRequestObserver 'start': " + e);
                    }
                }
            };

            this.stop = function stop() {
                if (initializedFlag) {
                    try {
                        chrome.webRequest.onBeforeRequest.removeListener(blockExtensionRequest(onBeforeRequest));
                        chrome.webRequest.onBeforeSendHeaders.removeListener(blockExtensionRequest(onBeforeSendHeaders));
                        chrome.webRequest.onBeforeRedirect.removeListener(blockExtensionRequest(onBeforeRedirect));
                        chrome.webRequest.onCompleted.removeListener(blockExtensionRequest(onCompleted));
                        chrome.webRequest.onErrorOccurred.removeListener(blockExtensionRequest(onErrorOccurred));
                        initializedFlag = false;
                    } catch (e) {
                        logger.error("Error during webRequestObserver 'stop': " + e);
                    }
                }
            };
        };

        ANALYTICS('bl.utils').Utils = function Utils() {
            ANALYTICS.interfaces.utils.Utils.call(this);

            this.encode = function (binStr) {
                return btoa(binStr);
            }
        };

        ANALYTICS('bl.error').ErrorsReporter = function ErrorsReporter(logger) {
            'use strict';

            ANALYTICS.interfaces.error.ErrorReporter.call(this);

            logger = logger || new ANALYTICS.common.MessageLogger('ErrorReporter');
            var errorAdapter = new ANALYTICS.bl.error.ErrorsMessageAdaptor();

            this.getChromeLastError = function getChromeLastError() {
                return chrome.runtime.lastError;
            };

            this.report = function report(error, callback) {
                error = errorAdapter.adaptMessage(error || getChromeLastError());
                logger.error(error.name + ': ' + error.message);

                if (callback) {
                    callback(error);
                }
            };

            this.wraps = function wraps(callback) {
                return function reportWrapper(error) {
                    this.report(error, callback);
                }.bind(this);
            };
        };

        ANALYTICS('bl.error').ErrorsMessageAdaptor = function ErrorsMessageAdaptor() {
            'use strict';

            ANALYTICS.interfaces.error.ErrorsMessageAdaptor.call(this);

            this.adaptMessage = function (error) {
                return error;
            };
        };

        ANALYTICS('bl.storage').LocalStorage = function LocalStorage(branch, partnerBranch) {
            'use strict';

            ANALYTICS.interfaces.storage.LocalStorage.call(this);
            var prefix = 'extensions.' + branch + (partnerBranch ? '.' + partnerBranch : '');

            function prepareKey(key) {
                return prefix + (key ? '.' + key : '');
            }

            function getAllKeys() {
                var rv = [];
                var len = prefix.length;
                for (var i = 0; ; i++) {
                    var key = localStorage.key(i);
                    if (key === null) {
                        break;
                    } else if (key.length >= len && key.slice(0, len) === prefix) {
                        rv.push(key);
                    }
                }
                return rv;
            }

            this.write = function write(key, value) {
                localStorage.setItem(prepareKey(key), value);
            };

            this.read = function read(key) {
                var result;
                var value = localStorage.getItem(prepareKey(key));

                if (isNaN(value)) {
                    if (value === 'true') {
                        result = true;
                    } else if (value === 'false') {
                        result = false;
                    } else {
                        result = value;
                    }
                } else {
                    result = parseInt(value, 10);
                }

                return result;
            };

            this.exists = function exists(key) {
                return getAllKeys().indexOf(prepareKey(key)) !== -1;
            };

            this.remove = function remove(key) {
                localStorage.removeItem(prepareKey(key));
            };

            this.removeBranch = function removeBranch() {
                getAllKeys().forEach(function (key) {
                    localStorage.removeItem(key);
                });
            };
        };

        ANALYTICS('bl.windows').WindowModel = function WindowModel(id) {
            'use strict';

            ANALYTICS.interfaces.windows.WindowModel.call(this);

            var chromeWindow;

            this.setChromeWindow = function setChromeWindow(chromeWin) {
                chromeWindow = chromeWin;
            };

            this.getId = function getId() {
                return id;
            };

            this.getChromeWindow = function getChromeWindow() {
                return chromeWindow;
            };
        };

        ANALYTICS('bl.windows').WindowsObserver = function WindowsObserver() {
            'use strict';

            ANALYTICS.interfaces.windows.WindowsObserver.call(this);
            ANALYTICS.common.EventObserver.call(this);

            var logger = new ANALYTICS.common.MessageLogger('WindowsObserver');
            var errorReporter = ANALYTICS.bl.error.ErrorsMessageAdaptor(logger);
            var self = this;
            var initialized = false;
            var windows = {};

            function addWindow(window) {
                var windowId = window.id;

                if (!windows[windowId]) {
                    windows[windowId] = new ANALYTICS.bl.windows.WindowModel(windowId);
                }
                windows[windowId].setChromeWindow(window);

                self.notifySubscribers('onWindowOpened', window);
            }

            function removeWindow(windowId) {
                delete windows[windowId];
                self.notifySubscribers('onWindowClosed', windowId, Object.keys(windows).length);
            }

            this.getAll = function getAll() {
                return windows;
            };

            this.start = function start() {
                if (!initialized) {
                    chrome.windows.getAll(function (windows) {
                        var err = chrome.runtime.lastError;
                        if (err) {
                            return void errorReporter.report(err);
                        }
                        windows.forEach(addWindow);
                    });
                    chrome.windows.onCreated.addListener(addWindow);
                    chrome.windows.onRemoved.addListener(removeWindow);
                    initialized = true;
                }
            };

            this.stop = function stop() {
                if (initialized) {
                    chrome.windows.onCreated.removeListener(addWindow);
                    chrome.windows.onRemoved.removeListener(removeWindow);
                    initialized = false;
                    windows = {};
                }
            };
        };

        ANALYTICS('bl.tabs').TabModel = function TabModel(tabId) {
            'use strict';

            var openerTabId, title, url, index, tab;

            ANALYTICS.interfaces.tabs.TabModel.call(this);

            this.setUrl = function (tabUrl) {
                url = tabUrl;
            };

            this.setTitle = function (tabTitle) {
                title = tabTitle;
            };

            this.setIndex = function (tabIndex) {
                index = tabIndex;
            };

            this.setTab = function (originalTab) {
                tab = originalTab;
            };

            this.setOpenerInfo = function (id) {
                openerTabId = id;
            };

            this.getOpenerInfo = function () {
                return openerTabId;
            };

            this.getId = function () {
                return tabId;
            };

            this.getUrl = function () {
                return url;
            };

            this.getTitle = function () {
                return title;
            };

            this.getIndex = function () {
                return index;
            };

            this.getTab = function () {
                return tab;
            };
        };

        ANALYTICS('bl.tabs').TabsObserver = function TabsObserver() {
            'use strict';

            ANALYTICS.interfaces.tabs.TabsObserver.call(this);
            ANALYTICS.common.EventObserver.call(this);

            var logger = new ANALYTICS.common.MessageLogger('TabsObserver');
            var self = this;
            var initialized = false;
            var tabsModel = {};

            function isChromeWebStore(url) {
                var chromeWebStoreUrl = "chrome.google.com/webstore";
                return url.indexOf(chromeWebStoreUrl) != -1;
            }

            function isValidTab(tab) {
                var id = tab.id;
                var url = tab.url;

                return id != -1 && (url.indexOf("http") == 0 || url.indexOf("https") == 0) && !isChromeWebStore(url);
            }

            function addClickListener(tab) {
                var tabId = tab.id;
                var model = tabsModel[tabId];
                var contentScript = "" +
                    "function contextMenuListener(e){" +
                    "e.target && e.target.tagName.toLowerCase() === 'a' && chrome.runtime.connect('" + chrome.runtime.id + "', {name: 'openerInfo'}).postMessage({url : String(e.target), tabId : " + tabId + "});" +
                    "}" +

                    "if(!window.contextMenuListenerFlag){" +
                    "document.addEventListener('contextmenu', contextMenuListener, false);" +
                    "window.contextMenuListenerFlag = true;" +
                    "}";

                if (model && isValidTab(tab)) {
                    chrome.tabs.executeScript(tabId, {code: contentScript, runAt: "document_start"},
                        function (pageInfo) {
                            if (chrome.runtime.lastError) {
                                logger.error(chrome.runtime.lastError.message);
                            }
                        });

                    chrome.runtime.onConnect.addListener(function (port) {
                        port.onMessage.addListener(function (msg) {
                            if (port.name == "openerInfo" && msg.tabId == tabId) {
                                model.setOpenerInfo({
                                    url: msg.url,
                                    tabId: tabId
                                });
                            }
                        });
                    });
                }
            }

            function updateTabInfo(tabId, tab) {
                var model;

                if (!tabsModel[tab.id]) {
                    tabsModel[tab.id] = new ANALYTICS.bl.tabs.TabModel(tabId);
                }

                model = tabsModel[tab.id];
                model.setUrl(tab.url);
                model.setTitle(tab.title);
                model.setIndex(tab.index);
                model.setTab(tab);
                addClickListener(tab);

                return model;
            }

            function addTab(tab) {
                if (isValidTab(tab)) {
                    self.notifySubscribers('onTabOpen', updateTabInfo(tab.id, tab));
                }
            }

            function updateTab(tabId, changeInfo, tab) {
                var tabModel;

                if (isValidTab(tab)) {
                    if (changeInfo.status == 'complete') {
                        tabModel = updateTabInfo(tabId, tab);
                        self.notifySubscribers('onTabLoad', tabModel);
                        self.notifySubscribers('onTabReady', tabModel);
                    }
                }
            }

            function removeTab(tabId) {
                self.notifySubscribers('onTabClose', tabsModel[tabId]);
                tabsModel[tabId] && delete tabsModel[tabId];
            }

            this.initializeFirstTab = function initializeFirstTab() {
                try {
                    chrome.tabs.query({windowType: "normal"}, function (tabsList) {
                        tabsList.forEach(addTab);
                    });
                } catch (e) {
                    logger.error("Error during initializing first tab: " + e);
                }
            };

            this.getCurrent = function getCurrent(theCallback) {
                var callback = theCallback || function () {
                    };

                chrome.tabs.query({active: true, currentWindow: true},
                    function (tabs) {
                        var tab = tabs[0];
                        if (tab.id) {
                            tabsModel[tab.id] = updateTabInfo(tab.id, tab);
                            callback(tabsModel[tab.id]);
                        }
                    });
            };

            this.getAll = function getAll() {
                return tabsModel;
            };

            this.getById = function getById(tabId) {
                return tabsModel[tabId];
            };

            this.start = function start() {
                if (!initialized) {
                    this.initializeFirstTab();
                    chrome.tabs.onCreated.addListener(addTab);
                    chrome.tabs.onUpdated.addListener(updateTab);
                    chrome.tabs.onRemoved.addListener(removeTab);
                    initialized = true;
                }
            };

            this.stop = function stop() {
                if (initialized) {
                    chrome.tabs.onCreated.removeListener(addTab);
                    chrome.tabs.onUpdated.removeListener(updateTab);
                    chrome.tabs.onRemoved.removeListener(removeTab);
                    initialized = false;
                    tabsModel = {};
                }
            };
        };

        ANALYTICS('bl.xhr').XMLHttpRequests = function XMLHttpRequests() {
            'use strict';

            ANALYTICS.interfaces.xhr.XMLHttpRequests.call(this);

            function successCallback(xhr, callback) {
                return function () {
                    if (callback && xhr.readyState == 4 && xhr.status == 200) {
                        callback(xhr.responseText);
                    }
                };
            }

            function constructRequest(method, url, callback) {
                var xhr = new XMLHttpRequest();

                xhr.open(method, url, true);
                xhr.setRequestHeader("Content-type", "text/plain");
                xhr.onreadystatechange = successCallback(xhr, callback);

                return xhr;
            }

            this.sendPost = function (url, body, callback) {
                var xhr = constructRequest("POST", url, callback);
                xhr.send(body);
            };

            this.sendGet = function (url, callback) {
                var xhr = constructRequest("GET", url, callback);
                xhr.send();
            };
        };


        ANALYTICS('core.dca.settings').dcaSettings = {
            channelId: sharedSettings.channelId,
            browserId: sharedSettings.browserId,
            softwareId: sharedSettings.softwareId,
            partnerId: sharedSettings.partnerId,
            version: "1.0.49",
            appName: "dca-chrome",
            lastConfigTime: "lastDcaConfigTime",
            configRequestPeriod: 1000 * 60 * 60,
            configUrl: "https://cr-b.prestadb.net/dca/config",
            dataUrl: "https://cr-input.prestadb.net/data",

            dcaLocalPrefsBranch: "analytics.dca",

            collectPref: "clickCollectionEnabled",
            streamTypePref: "streamType ",
            batchSizePref: "batchSize",
            batchMaxWaitPref: "batchMaxWait"
        };

        ANALYTICS('core.dca.lib').Composer = function Compressor() {
            var z;
            !function (J) {
                z = J()
            }(function () {
                return function d(p, e, k) {
                    function m(c, f) {
                        if (!e[c]) {
                            if (!p[c]) {
                                var n = "function" == typeof require && require;
                                if (!f && n)return n(c, !0);
                                if (h)return h(c, !0);
                                throw Error("Cannot find module '" + c + "'");
                            }
                            n = e[c] = {exports: {}};
                            p[c][0].call(n.exports, function (g) {
                                var f = p[c][1][g];
                                return m(f ? f : g)
                            }, n, n.exports, d, p, e, k)
                        }
                        return e[c].exports
                    }

                    for (var h = "function" == typeof require && require, f = 0; f < k.length; f++)m(k[f]);
                    return m
                }({
                    1: [function (d, p, e) {
                        function k(g, c) {
                            var l =
                                new n(c);
                            l.push(g, !0);
                            if (l.err)throw l.msg;
                            return l.result
                        }

                        var m = d("./zlib/deflate.js"), h = d("./utils/common"), f = d("./utils/strings"), c = d("./zlib/messages"), q = d("./zlib/zstream"), n = function (g) {
                            g = this.options = h.assign({
                                level: -1,
                                method: 8,
                                chunkSize: 16384,
                                windowBits: 15,
                                memLevel: 8,
                                strategy: 0,
                                to: ""
                            }, g || {});
                            g.raw && 0 < g.windowBits ? g.windowBits = -g.windowBits : g.gzip && 0 < g.windowBits && 16 > g.windowBits && (g.windowBits += 16);
                            this.err = 0;
                            this.msg = "";
                            this.ended = !1;
                            this.chunks = [];
                            this.strm = new q;
                            this.strm.avail_out = 0;
                            var f =
                                m.deflateInit2(this.strm, g.level, g.method, g.windowBits, g.memLevel, g.strategy);
                            if (0 !== f)throw Error(c[f]);
                            g.header && m.deflateSetHeader(this.strm, g.header)
                        };
                        n.prototype.push = function (g, c) {
                            var l = this.strm, e = this.options.chunkSize, d, k;
                            if (this.ended)return !1;
                            k = c === ~~c ? c : !0 === c ? 4 : 0;
                            l.input = "string" === typeof g ? f.string2buf(g) : g;
                            l.next_in = 0;
                            l.avail_in = l.input.length;
                            do {
                                0 === l.avail_out && (l.output = new h.Buf8(e), l.next_out = 0, l.avail_out = e);
                                d = m.deflate(l, k);
                                if (1 !== d && 0 !== d)return this.onEnd(d), this.ended = !0,
                                    !1;
                                if (0 === l.avail_out || 0 === l.avail_in && 4 === k)if ("string" === this.options.to)this.onData(f.buf2binstring(h.shrinkBuf(l.output, l.next_out))); else this.onData(h.shrinkBuf(l.output, l.next_out))
                            } while ((0 < l.avail_in || 0 === l.avail_out) && 1 !== d);
                            return 4 === k ? (d = m.deflateEnd(this.strm), this.onEnd(d), this.ended = !0, 0 === d) : !0
                        };
                        n.prototype.onData = function (c) {
                            this.chunks.push(c)
                        };
                        n.prototype.onEnd = function (c) {
                            0 === c && (this.result = "string" === this.options.to ? this.chunks.join("") : h.flattenChunks(this.chunks));
                            this.chunks =
                                [];
                            this.err = c;
                            this.msg = this.strm.msg
                        };
                        e.Deflate = n;
                        e.deflate = k;
                        e.deflateRaw = function (c, f) {
                            f = f || {};
                            f.raw = !0;
                            return k(c, f)
                        };
                        e.gzip = function (c, f) {
                            f = f || {};
                            f.gzip = !0;
                            return k(c, f)
                        }
                    }, {
                        "./utils/common": 2,
                        "./utils/strings": 3,
                        "./zlib/deflate.js": 6,
                        "./zlib/messages": 7,
                        "./zlib/zstream": 9
                    }],
                    2: [function (d, p, e) {
                        d = "undefined" !== typeof Uint8Array && "undefined" !== typeof Uint16Array && "undefined" !== typeof Int32Array;
                        e.assign = function (h) {
                            for (var f = Array.prototype.slice.call(arguments, 1); f.length;) {
                                var c = f.shift();
                                if (c) {
                                    if ("object" !== typeof c)throw new TypeError(c + "must be non-object");
                                    for (var d in c)c.hasOwnProperty(d) && (h[d] = c[d])
                                }
                            }
                            return h
                        };
                        e.shrinkBuf = function (h, f) {
                            if (h.length === f)return h;
                            if (h.subarray)return h.subarray(0, f);
                            h.length = f;
                            return h
                        };
                        var k = {
                            arraySet: function (h, f, c, d, e) {
                                if (f.subarray && h.subarray)h.set(f.subarray(c, c + d), e); else for (var g = 0; g < d; g++)h[e + g] = f[c + g]
                            }, flattenChunks: function (h) {
                                var f, c, d, e, g;
                                f = d = 0;
                                for (c = h.length; f < c; f++)d += h[f].length;
                                g = new Uint8Array(d);
                                f = d = 0;
                                for (c = h.length; f < c; f++)e = h[f], g.set(e, d),
                                    d += e.length;
                                return g
                            }
                        }, m = {
                            arraySet: function (h, f, c, d, e) {
                                for (var g = 0; g < d; g++)h[e + g] = f[c + g]
                            }, flattenChunks: function (d) {
                                return [].concat.apply([], d)
                            }
                        };
                        e.setTyped = function (d) {
                            d ? (e.Buf8 = Uint8Array, e.Buf16 = Uint16Array, e.Buf32 = Int32Array, e.assign(e, k)) : (e.Buf8 = Array, e.Buf16 = Array, e.Buf32 = Array, e.assign(e, m))
                        };
                        e.setTyped(d)
                    }, {}],
                    3: [function (d, p, e) {
                        function k(c, d) {
                            if (65537 > d && (c.subarray && f || !c.subarray && h))return String.fromCharCode.apply(null, m.shrinkBuf(c, d));
                            for (var l = "", e = 0; e < d; e++)l += String.fromCharCode(c[e]);
                            return l
                        }

                        var m = d("./common"), h = !0, f = !0;
                        try {
                            String.fromCharCode.apply(null, [0])
                        } catch (c) {
                            h = !1
                        }
                        try {
                            String.fromCharCode.apply(null, new Uint8Array(1))
                        } catch (q) {
                            f = !1
                        }
                        var n = new m.Buf8(256);
                        for (d = 0; 256 > d; d++)n[d] = 252 <= d ? 6 : 248 <= d ? 5 : 240 <= d ? 4 : 224 <= d ? 3 : 192 <= d ? 2 : 1;
                        n[254] = n[254] = 1;
                        e.string2buf = function (c) {
                            var f, l, d, h, e, k = c.length, n = 0;
                            for (h = 0; h < k; h++)l = c.charCodeAt(h), 55296 === (l & 64512) && h + 1 < k && (d = c.charCodeAt(h + 1), 56320 === (d & 64512) && (l = 65536 + (l - 55296 << 10) + (d - 56320), h++)), n += 128 > l ? 1 : 2048 > l ? 2 : 65536 > l ? 3 : 4;
                            f = new m.Buf8(n);
                            for (h = e = 0; e < n; h++)l = c.charCodeAt(h), 55296 === (l & 64512) && h + 1 < k && (d = c.charCodeAt(h + 1), 56320 === (d & 64512) && (l = 65536 + (l - 55296 << 10) + (d - 56320), h++)), 128 > l ? f[e++] = l : (2048 > l ? f[e++] = 192 | l >>> 6 : (65536 > l ? f[e++] = 224 | l >>> 12 : (f[e++] = 240 | l >>> 18, f[e++] = 128 | l >>> 12 & 63), f[e++] = 128 | l >>> 6 & 63), f[e++] = 128 | l & 63);
                            return f
                        };
                        e.buf2binstring = function (c) {
                            return k(c, c.length)
                        };
                        e.binstring2buf = function (c) {
                            for (var f = new m.Buf8(c.length), d = 0, h = f.length; d < h; d++)f[d] = c.charCodeAt(d);
                            return f
                        };
                        e.buf2string = function (c, f) {
                            var d, h, e, m, p =
                                f || c.length, q = Array(2 * p);
                            for (d = h = 0; d < p;)if (e = c[d++], 128 > e)q[h++] = e; else if (m = n[e], 4 < m)q[h++] = 65533, d += m - 1; else {
                                for (e &= 2 === m ? 31 : 3 === m ? 15 : 7; 1 < m && d < p;)e = e << 6 | c[d++] & 63, m--;
                                1 < m ? q[h++] = 65533 : 65536 > e ? q[h++] = e : (e -= 65536, q[h++] = 55296 | e >> 10 & 1023, q[h++] = 56320 | e & 1023)
                            }
                            return k(q, h)
                        };
                        e.utf8border = function (c, f) {
                            var d;
                            f = f || c.length;
                            f > c.length && (f = c.length);
                            for (d = f - 1; 0 <= d && 128 === (c[d] & 192);)d--;
                            return 0 > d || 0 === d ? f : d + n[c[d]] > f ? d : f
                        }
                    }, {"./common": 2}],
                    4: [function (d, p, e) {
                        p.exports = function (d, e, h, f) {
                            var c = d & 65535 | 0;
                            d =
                                d >>> 16 & 65535 | 0;
                            for (var q = 0; 0 !== h;) {
                                q = 2E3 < h ? 2E3 : h;
                                h -= q;
                                do c = c + e[f++] | 0, d = d + c | 0; while (--q);
                                c %= 65521;
                                d %= 65521
                            }
                            return c | d << 16 | 0
                        }
                    }, {}],
                    5: [function (d, p, e) {
                        var k = function () {
                            for (var d, e = [], f = 0; 256 > f; f++) {
                                d = f;
                                for (var c = 0; 8 > c; c++)d = d & 1 ? 3988292384 ^ d >>> 1 : d >>> 1;
                                e[f] = d
                            }
                            return e
                        }();
                        p.exports = function (d, e, f, c) {
                            f = c + f;
                            for (d ^= -1; c < f; c++)d = d >>> 8 ^ k[(d ^ e[c]) & 255];
                            return d ^ -1
                        }
                    }, {}],
                    6: [function (d, p, e) {
                        function k(a, d) {
                            a.msg = H[d];
                            return d
                        }

                        function m(a) {
                            for (var d = a.length; 0 <= --d;)a[d] = 0
                        }

                        function h(a) {
                            var d = a.state, c = d.pending;
                            c > a.avail_out && (c = a.avail_out);
                            0 !== c && (s.arraySet(a.output, d.pending_buf, d.pending_out, c, a.next_out), a.next_out += c, d.pending_out += c, a.total_out += c, a.avail_out -= c, d.pending -= c, 0 === d.pending && (d.pending_out = 0))
                        }

                        function f(a, d) {
                            t._tr_flush_block(a, 0 <= a.block_start ? a.block_start : -1, a.strstart - a.block_start, d);
                            a.block_start = a.strstart;
                            h(a.strm)
                        }

                        function c(a, d) {
                            a.pending_buf[a.pending++] = d
                        }

                        function q(a, d) {
                            a.pending_buf[a.pending++] = d >>> 8 & 255;
                            a.pending_buf[a.pending++] = d & 255
                        }

                        function n(a, d) {
                            var c = a.max_chain_length,
                                b = a.strstart, f, e = a.prev_length, h = a.nice_match, l = a.strstart > a.w_size - 262 ? a.strstart - (a.w_size - 262) : 0, g = a.window, k = a.w_mask, m = a.prev, M = a.strstart + 258, Q = g[b + e - 1], R = g[b + e];
                            a.prev_length >= a.good_match && (c >>= 2);
                            h > a.lookahead && (h = a.lookahead);
                            do if (f = d, g[f + e] === R && g[f + e - 1] === Q && g[f] === g[b] && g[++f] === g[b + 1]) {
                                b += 2;
                                for (f++; g[++b] === g[++f] && g[++b] === g[++f] && g[++b] === g[++f] && g[++b] === g[++f] && g[++b] === g[++f] && g[++b] === g[++f] && g[++b] === g[++f] && g[++b] === g[++f] && b < M;);
                                f = 258 - (M - b);
                                b = M - 258;
                                if (f > e) {
                                    a.match_start = d;
                                    e = f;
                                    if (f >= h)break;
                                    Q = g[b + e - 1];
                                    R = g[b + e]
                                }
                            } while ((d = m[d & k]) > l && 0 !== --c);
                            return e <= a.lookahead ? e : a.lookahead
                        }

                        function g(a) {
                            var d = a.w_size, c, b, f, e;
                            do {
                                e = a.window_size - a.lookahead - a.strstart;
                                if (a.strstart >= d + (d - 262)) {
                                    s.arraySet(a.window, a.window, d, d, 0);
                                    a.match_start -= d;
                                    a.strstart -= d;
                                    a.block_start -= d;
                                    c = b = a.hash_size;
                                    do f = a.head[--c], a.head[c] = f >= d ? f - d : 0; while (--b);
                                    c = b = d;
                                    do f = a.prev[--c], a.prev[c] = f >= d ? f - d : 0; while (--b);
                                    e += d
                                }
                                if (0 === a.strm.avail_in)break;
                                c = a.strm;
                                b = a.window;
                                f = a.strstart + a.lookahead;
                                var h = c.avail_in;
                                h > e && (h = e);
                                0 === h ? b = 0 : (c.avail_in -= h, s.arraySet(b, c.input, c.next_in, h, f), 1 === c.state.wrap ? c.adler = y(c.adler, b, h, f) : 2 === c.state.wrap && (c.adler = u(c.adler, b, h, f)), c.next_in += h, c.total_in += h, b = h);
                                a.lookahead += b;
                                if (3 <= a.lookahead + a.insert)for (e = a.strstart - a.insert, a.ins_h = a.window[e], a.ins_h = (a.ins_h << a.hash_shift ^ a.window[e + 1]) & a.hash_mask; a.insert && !(a.ins_h = (a.ins_h << a.hash_shift ^ a.window[e + 3 - 1]) & a.hash_mask, a.prev[e & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = e, e++, a.insert--, 3 > a.lookahead + a.insert););
                            } while (262 > a.lookahead && 0 !== a.strm.avail_in)
                        }

                        function x(a, d) {
                            for (var c; ;) {
                                if (262 > a.lookahead) {
                                    g(a);
                                    if (262 > a.lookahead && 0 === d)return 1;
                                    if (0 === a.lookahead)break
                                }
                                c = 0;
                                3 <= a.lookahead && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + 3 - 1]) & a.hash_mask, c = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = a.strstart);
                                0 !== c && a.strstart - c <= a.w_size - 262 && (a.match_length = n(a, c));
                                if (3 <= a.match_length)if (c = t._tr_tally(a, a.strstart - a.match_start, a.match_length - 3), a.lookahead -= a.match_length, a.match_length <=
                                    a.max_lazy_match && 3 <= a.lookahead) {
                                    a.match_length--;
                                    do a.strstart++, a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + 3 - 1]) & a.hash_mask, a.prev[a.strstart & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = a.strstart; while (0 !== --a.match_length);
                                    a.strstart++
                                } else a.strstart += a.match_length, a.match_length = 0, a.ins_h = a.window[a.strstart], a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + 1]) & a.hash_mask; else c = t._tr_tally(a, 0, a.window[a.strstart]), a.lookahead--, a.strstart++;
                                if (c && (f(a, !1), 0 === a.strm.avail_out))return 1
                            }
                            a.insert =
                                2 > a.strstart ? a.strstart : 2;
                            return 4 === d ? (f(a, !0), 0 === a.strm.avail_out ? 3 : 4) : a.last_lit && (f(a, !1), 0 === a.strm.avail_out) ? 1 : 2
                        }

                        function l(a, d) {
                            for (var c, b; ;) {
                                if (262 > a.lookahead) {
                                    g(a);
                                    if (262 > a.lookahead && 0 === d)return 1;
                                    if (0 === a.lookahead)break
                                }
                                c = 0;
                                3 <= a.lookahead && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + 3 - 1]) & a.hash_mask, c = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = a.strstart);
                                a.prev_length = a.match_length;
                                a.prev_match = a.match_start;
                                a.match_length = 2;
                                0 !== c && a.prev_length < a.max_lazy_match &&
                                a.strstart - c <= a.w_size - 262 && (a.match_length = n(a, c), 5 >= a.match_length && (1 === a.strategy || 3 === a.match_length && 4096 < a.strstart - a.match_start) && (a.match_length = 2));
                                if (3 <= a.prev_length && a.match_length <= a.prev_length) {
                                    b = a.strstart + a.lookahead - 3;
                                    c = t._tr_tally(a, a.strstart - 1 - a.prev_match, a.prev_length - 3);
                                    a.lookahead -= a.prev_length - 1;
                                    a.prev_length -= 2;
                                    do++a.strstart <= b && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + 3 - 1]) & a.hash_mask, a.prev[a.strstart & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = a.strstart);
                                    while (0 !== --a.prev_length);
                                    a.match_available = 0;
                                    a.match_length = 2;
                                    a.strstart++;
                                    if (c && (f(a, !1), 0 === a.strm.avail_out))return 1
                                } else if (a.match_available) {
                                    if ((c = t._tr_tally(a, 0, a.window[a.strstart - 1])) && f(a, !1), a.strstart++, a.lookahead--, 0 === a.strm.avail_out)return 1
                                } else a.match_available = 1, a.strstart++, a.lookahead--
                            }
                            a.match_available && (t._tr_tally(a, 0, a.window[a.strstart - 1]), a.match_available = 0);
                            a.insert = 2 > a.strstart ? a.strstart : 2;
                            return 4 === d ? (f(a, !0), 0 === a.strm.avail_out ? 3 : 4) : a.last_lit && (f(a, !1), 0 ===
                            a.strm.avail_out) ? 1 : 2
                        }

                        function E(a, d) {
                            for (var c, b, e, h = a.window; ;) {
                                if (258 >= a.lookahead) {
                                    g(a);
                                    if (258 >= a.lookahead && 0 === d)return 1;
                                    if (0 === a.lookahead)break
                                }
                                a.match_length = 0;
                                if (3 <= a.lookahead && 0 < a.strstart && (b = a.strstart - 1, c = h[b], c === h[++b] && c === h[++b] && c === h[++b])) {
                                    for (e = a.strstart + 258; c === h[++b] && c === h[++b] && c === h[++b] && c === h[++b] && c === h[++b] && c === h[++b] && c === h[++b] && c === h[++b] && b < e;);
                                    a.match_length = 258 - (e - b);
                                    a.match_length > a.lookahead && (a.match_length = a.lookahead)
                                }
                                3 <= a.match_length ? (c = t._tr_tally(a,
                                    1, a.match_length - 3), a.lookahead -= a.match_length, a.strstart += a.match_length, a.match_length = 0) : (c = t._tr_tally(a, 0, a.window[a.strstart]), a.lookahead--, a.strstart++);
                                if (c && (f(a, !1), 0 === a.strm.avail_out))return 1
                            }
                            a.insert = 0;
                            return 4 === d ? (f(a, !0), 0 === a.strm.avail_out ? 3 : 4) : a.last_lit && (f(a, !1), 0 === a.strm.avail_out) ? 1 : 2
                        }

                        function A(a, c) {
                            for (var d; ;) {
                                if (0 === a.lookahead && (g(a), 0 === a.lookahead)) {
                                    if (0 === c)return 1;
                                    break
                                }
                                a.match_length = 0;
                                d = t._tr_tally(a, 0, a.window[a.strstart]);
                                a.lookahead--;
                                a.strstart++;
                                if (d &&
                                    (f(a, !1), 0 === a.strm.avail_out))return 1
                            }
                            a.insert = 0;
                            return 4 === c ? (f(a, !0), 0 === a.strm.avail_out ? 3 : 4) : a.last_lit && (f(a, !1), 0 === a.strm.avail_out) ? 1 : 2
                        }

                        function F() {
                            this.strm = null;
                            this.status = 0;
                            this.pending_buf = null;
                            this.wrap = this.pending = this.pending_out = this.pending_buf_size = 0;
                            this.gzhead = null;
                            this.gzindex = 0;
                            this.method = 8;
                            this.last_flush = -1;
                            this.w_mask = this.w_bits = this.w_size = 0;
                            this.window = null;
                            this.window_size = 0;
                            this.head = this.prev = null;
                            this.nice_match = this.good_match = this.strategy = this.level = this.max_lazy_match =
                                this.max_chain_length = this.prev_length = this.lookahead = this.match_start = this.strstart = this.match_available = this.prev_match = this.match_length = this.block_start = this.hash_shift = this.hash_mask = this.hash_bits = this.hash_size = this.ins_h = 0;
                            this.dyn_ltree = new s.Buf16(1146);
                            this.dyn_dtree = new s.Buf16(122);
                            this.bl_tree = new s.Buf16(78);
                            m(this.dyn_ltree);
                            m(this.dyn_dtree);
                            m(this.bl_tree);
                            this.bl_desc = this.d_desc = this.l_desc = null;
                            this.bl_count = new s.Buf16(16);
                            this.heap = new s.Buf16(573);
                            m(this.heap);
                            this.heap_max =
                                this.heap_len = 0;
                            this.depth = new s.Buf16(573);
                            m(this.depth);
                            this.bi_valid = this.bi_buf = this.insert = this.matches = this.static_len = this.opt_len = this.d_buf = this.last_lit = this.lit_bufsize = this.l_buf = 0
                        }

                        function B(a) {
                            var c;
                            if (!a || !a.state)return k(a, -2);
                            a.total_in = a.total_out = 0;
                            a.data_type = 2;
                            c = a.state;
                            c.pending = 0;
                            c.pending_out = 0;
                            0 > c.wrap && (c.wrap = -c.wrap);
                            c.status = c.wrap ? 42 : 113;
                            a.adler = 2 === c.wrap ? 0 : 1;
                            c.last_flush = 0;
                            t._tr_init(c);
                            return 0
                        }

                        function G(a) {
                            var c = B(a);
                            0 === c && (a = a.state, a.window_size = 2 * a.w_size, m(a.head),
                                a.max_lazy_match = r[a.level].max_lazy, a.good_match = r[a.level].good_length, a.nice_match = r[a.level].nice_length, a.max_chain_length = r[a.level].max_chain, a.strstart = 0, a.block_start = 0, a.lookahead = 0, a.insert = 0, a.match_length = a.prev_length = 2, a.match_available = 0, a.ins_h = 0);
                            return c
                        }

                        function D(a, c, d, b, f, e) {
                            if (!a)return -2;
                            var h = 1;
                            -1 === c && (c = 6);
                            0 > b ? (h = 0, b = -b) : 15 < b && (h = 2, b -= 16);
                            if (1 > f || 9 < f || 8 !== d || 8 > b || 15 < b || 0 > c || 9 < c || 0 > e || 4 < e)return k(a, -2);
                            8 === b && (b = 9);
                            var g = new F;
                            a.state = g;
                            g.strm = a;
                            g.wrap = h;
                            g.gzhead = null;
                            g.w_bits =
                                b;
                            g.w_size = 1 << g.w_bits;
                            g.w_mask = g.w_size - 1;
                            g.hash_bits = f + 7;
                            g.hash_size = 1 << g.hash_bits;
                            g.hash_mask = g.hash_size - 1;
                            g.hash_shift = ~~((g.hash_bits + 3 - 1) / 3);
                            g.window = new s.Buf8(2 * g.w_size);
                            g.head = new s.Buf16(g.hash_size);
                            g.prev = new s.Buf16(g.w_size);
                            g.lit_bufsize = 1 << f + 6;
                            g.pending_buf_size = 4 * g.lit_bufsize;
                            g.pending_buf = new s.Buf8(g.pending_buf_size);
                            g.d_buf = g.lit_bufsize >> 1;
                            g.l_buf = 3 * g.lit_bufsize;
                            g.level = c;
                            g.strategy = e;
                            g.method = d;
                            return G(a)
                        }

                        var s = d("../utils/common"), t = d("./trees"), y = d("./adler32"), u = d("./crc32"),
                            H = d("./messages");
                        d = function (a, c, d, b, f) {
                            this.good_length = a;
                            this.max_lazy = c;
                            this.nice_length = d;
                            this.max_chain = b;
                            this.func = f
                        };
                        var r;
                        r = [new d(0, 0, 0, 0, function (a, c) {
                            var d = 65535;
                            for (d > a.pending_buf_size - 5 && (d = a.pending_buf_size - 5); ;) {
                                if (1 >= a.lookahead) {
                                    g(a);
                                    if (0 === a.lookahead && 0 === c)return 1;
                                    if (0 === a.lookahead)break
                                }
                                a.strstart += a.lookahead;
                                a.lookahead = 0;
                                var b = a.block_start + d;
                                if (0 === a.strstart || a.strstart >= b)if (a.lookahead = a.strstart - b, a.strstart = b, f(a, !1), 0 === a.strm.avail_out)return 1;
                                if (a.strstart - a.block_start >=
                                    a.w_size - 262 && (f(a, !1), 0 === a.strm.avail_out))return 1
                            }
                            a.insert = 0;
                            if (4 === c)return f(a, !0), 0 === a.strm.avail_out ? 3 : 4;
                            a.strstart > a.block_start && f(a, !1);
                            return 1
                        }), new d(4, 4, 8, 4, x), new d(4, 5, 16, 8, x), new d(4, 6, 32, 32, x), new d(4, 4, 16, 16, l), new d(8, 16, 32, 32, l), new d(8, 16, 128, 128, l), new d(8, 32, 128, 256, l), new d(32, 128, 258, 1024, l), new d(32, 258, 258, 4096, l)];
                        e.deflateInit = function (a, c) {
                            return D(a, c, 8, 15, 8, 0)
                        };
                        e.deflateInit2 = D;
                        e.deflateReset = G;
                        e.deflateResetKeep = B;
                        e.deflateSetHeader = function (a, c) {
                            if (!a || !a.state ||
                                2 !== a.state.wrap)return -2;
                            a.state.gzhead = c;
                            return 0
                        };
                        e.deflate = function (a, d) {
                            var f, b, e, g;
                            if (!a || !a.state || 5 < d || 0 > d)return a ? k(a, -2) : -2;
                            b = a.state;
                            if (!a.output || !a.input && 0 !== a.avail_in || 666 === b.status && 4 !== d)return k(a, 0 === a.avail_out ? -5 : -2);
                            b.strm = a;
                            f = b.last_flush;
                            b.last_flush = d;
                            42 === b.status && (2 === b.wrap ? (a.adler = 0, c(b, 31), c(b, 139), c(b, 8), b.gzhead ? (c(b, (b.gzhead.text ? 1 : 0) + (b.gzhead.hcrc ? 2 : 0) + (b.gzhead.extra ? 4 : 0) + (b.gzhead.name ? 8 : 0) + (b.gzhead.comment ? 16 : 0)), c(b, b.gzhead.time & 255), c(b, b.gzhead.time >>
                            8 & 255), c(b, b.gzhead.time >> 16 & 255), c(b, b.gzhead.time >> 24 & 255), c(b, 9 === b.level ? 2 : 2 <= b.strategy || 2 > b.level ? 4 : 0), c(b, b.gzhead.os & 255), b.gzhead.extra && b.gzhead.extra.length && (c(b, b.gzhead.extra.length & 255), c(b, b.gzhead.extra.length >> 8 & 255)), b.gzhead.hcrc && (a.adler = u(a.adler, b.pending_buf, b.pending, 0)), b.gzindex = 0, b.status = 69) : (c(b, 0), c(b, 0), c(b, 0), c(b, 0), c(b, 0), c(b, 9 === b.level ? 2 : 2 <= b.strategy || 2 > b.level ? 4 : 0), c(b, 3), b.status = 113)) : (e = 8 + (b.w_bits - 8 << 4) << 8, g = -1, g = 2 <= b.strategy || 2 > b.level ? 0 : 6 > b.level ? 1 : 6 ===
                            b.level ? 2 : 3, e |= g << 6, 0 !== b.strstart && (e |= 32), b.status = 113, q(b, e + (31 - e % 31)), 0 !== b.strstart && (q(b, a.adler >>> 16), q(b, a.adler & 65535)), a.adler = 1));
                            if (69 === b.status)if (b.gzhead.extra) {
                                for (e = b.pending; b.gzindex < (b.gzhead.extra.length & 65535) && (b.pending !== b.pending_buf_size || (b.gzhead.hcrc && b.pending > e && (a.adler = u(a.adler, b.pending_buf, b.pending - e, e)), h(a), e = b.pending, b.pending !== b.pending_buf_size));)c(b, b.gzhead.extra[b.gzindex] & 255), b.gzindex++;
                                b.gzhead.hcrc && b.pending > e && (a.adler = u(a.adler, b.pending_buf,
                                    b.pending - e, e));
                                b.gzindex === b.gzhead.extra.length && (b.gzindex = 0, b.status = 73)
                            } else b.status = 73;
                            if (73 === b.status)if (b.gzhead.name) {
                                e = b.pending;
                                do {
                                    if (b.pending === b.pending_buf_size && (b.gzhead.hcrc && b.pending > e && (a.adler = u(a.adler, b.pending_buf, b.pending - e, e)), h(a), e = b.pending, b.pending === b.pending_buf_size)) {
                                        g = 1;
                                        break
                                    }
                                    g = b.gzindex < b.gzhead.name.length ? b.gzhead.name.charCodeAt(b.gzindex++) & 255 : 0;
                                    c(b, g)
                                } while (0 !== g);
                                b.gzhead.hcrc && b.pending > e && (a.adler = u(a.adler, b.pending_buf, b.pending - e, e));
                                0 === g && (b.gzindex =
                                    0, b.status = 91)
                            } else b.status = 91;
                            if (91 === b.status)if (b.gzhead.comment) {
                                e = b.pending;
                                do {
                                    if (b.pending === b.pending_buf_size && (b.gzhead.hcrc && b.pending > e && (a.adler = u(a.adler, b.pending_buf, b.pending - e, e)), h(a), e = b.pending, b.pending === b.pending_buf_size)) {
                                        g = 1;
                                        break
                                    }
                                    g = b.gzindex < b.gzhead.comment.length ? b.gzhead.comment.charCodeAt(b.gzindex++) & 255 : 0;
                                    c(b, g)
                                } while (0 !== g);
                                b.gzhead.hcrc && b.pending > e && (a.adler = u(a.adler, b.pending_buf, b.pending - e, e));
                                0 === g && (b.status = 103)
                            } else b.status = 103;
                            103 === b.status && (b.gzhead.hcrc ?
                                (b.pending + 2 > b.pending_buf_size && h(a), b.pending + 2 <= b.pending_buf_size && (c(b, a.adler & 255), c(b, a.adler >> 8 & 255), a.adler = 0, b.status = 113)) : b.status = 113);
                            if (0 !== b.pending) {
                                if (h(a), 0 === a.avail_out)return b.last_flush = -1, 0
                            } else if (0 === a.avail_in && (d << 1) - (4 < d ? 9 : 0) <= (f << 1) - (4 < f ? 9 : 0) && 4 !== d)return k(a, -5);
                            if (666 === b.status && 0 !== a.avail_in)return k(a, -5);
                            if (0 !== a.avail_in || 0 !== b.lookahead || 0 !== d && 666 !== b.status) {
                                f = 2 === b.strategy ? A(b, d) : 3 === b.strategy ? E(b, d) : r[b.level].func(b, d);
                                if (3 === f || 4 === f)b.status = 666;
                                if (1 ===
                                    f || 3 === f)return 0 === a.avail_out && (b.last_flush = -1), 0;
                                if (2 === f && (1 === d ? t._tr_align(b) : 5 !== d && (t._tr_stored_block(b, 0, 0, !1), 3 === d && (m(b.head), 0 === b.lookahead && (b.strstart = 0, b.block_start = 0, b.insert = 0))), h(a), 0 === a.avail_out))return b.last_flush = -1, 0
                            }
                            if (4 !== d)return 0;
                            if (0 >= b.wrap)return 1;
                            2 === b.wrap ? (c(b, a.adler & 255), c(b, a.adler >> 8 & 255), c(b, a.adler >> 16 & 255), c(b, a.adler >> 24 & 255), c(b, a.total_in & 255), c(b, a.total_in >> 8 & 255), c(b, a.total_in >> 16 & 255), c(b, a.total_in >> 24 & 255)) : (q(b, a.adler >>> 16), q(b, a.adler &
                            65535));
                            h(a);
                            0 < b.wrap && (b.wrap = -b.wrap);
                            return 0 !== b.pending ? 0 : 1
                        };
                        e.deflateEnd = function (a) {
                            var c;
                            if (!a || !a.state)return -2;
                            c = a.state.status;
                            if (42 !== c && 69 !== c && 73 !== c && 91 !== c && 103 !== c && 113 !== c && 666 !== c)return k(a, -2);
                            a.state = null;
                            return 113 === c ? k(a, -3) : 0
                        };
                        e.deflateInfo = "pako deflate (from Nodeca project)"
                    }, {"../utils/common": 2, "./adler32": 4, "./crc32": 5, "./messages": 7, "./trees": 8}],
                    7: [function (d, p, e) {
                        p.exports = {
                            2: "need dictionary",
                            1: "stream end",
                            0: "",
                            "-1": "file error",
                            "-2": "stream error",
                            "-3": "data error",
                            "-4": "insufficient memory",
                            "-5": "buffer error",
                            "-6": "incompatible version"
                        }
                    }, {}],
                    8: [function (d, p, e) {
                        function k(a) {
                            for (var b = a.length; 0 <= --b;)a[b] = 0
                        }

                        function m(a, b) {
                            a.pending_buf[a.pending++] = b & 255;
                            a.pending_buf[a.pending++] = b >>> 8 & 255
                        }

                        function h(a, b, c) {
                            a.bi_valid > 16 - c ? (a.bi_buf |= b << a.bi_valid & 65535, m(a, a.bi_buf), a.bi_buf = b >> 16 - a.bi_valid, a.bi_valid += c - 16) : (a.bi_buf |= b << a.bi_valid & 65535, a.bi_valid += c)
                        }

                        function f(a, b, c) {
                            h(a, c[2 * b], c[2 * b + 1])
                        }

                        function c(a, b) {
                            var c = 0;
                            do c |= a & 1, a >>>= 1, c <<= 1; while (0 < --b);
                            return c >>> 1
                        }

                        function q(a, b, d) {
                            var e = Array(16), f = 0, g;
                            for (g = 1; 15 >= g; g++)e[g] = f = f + d[g - 1] << 1;
                            for (d = 0; d <= b; d++)f = a[2 * d + 1], 0 !== f && (a[2 * d] = c(e[f]++, f))
                        }

                        function n(a) {
                            var b;
                            for (b = 0; 286 > b; b++)a.dyn_ltree[2 * b] = 0;
                            for (b = 0; 30 > b; b++)a.dyn_dtree[2 * b] = 0;
                            for (b = 0; 19 > b; b++)a.bl_tree[2 * b] = 0;
                            a.dyn_ltree[512] = 1;
                            a.opt_len = a.static_len = 0;
                            a.last_lit = a.matches = 0
                        }

                        function g(a) {
                            8 < a.bi_valid ? m(a, a.bi_buf) : 0 < a.bi_valid && (a.pending_buf[a.pending++] = a.bi_buf);
                            a.bi_buf = 0;
                            a.bi_valid = 0
                        }

                        function x(a, b, c, d) {
                            var f = 2 * b, e = 2 * c;
                            return a[f] <
                                a[e] || a[f] === a[e] && d[b] <= d[c]
                        }

                        function l(a, b, c) {
                            for (var d = a.heap[c], f = c << 1; f <= a.heap_len;) {
                                f < a.heap_len && x(b, a.heap[f + 1], a.heap[f], a.depth) && f++;
                                if (x(b, d, a.heap[f], a.depth))break;
                                a.heap[c] = a.heap[f];
                                c = f;
                                f <<= 1
                            }
                            a.heap[c] = d
                        }

                        function E(a, c, d) {
                            var e, g, l = 0, w, k;
                            if (0 !== a.last_lit) {
                                do e = a.pending_buf[a.d_buf + 2 * l] << 8 | a.pending_buf[a.d_buf + 2 * l + 1], g = a.pending_buf[a.l_buf + l], l++, 0 === e ? f(a, g, c) : (w = C[g], f(a, w + 256 + 1, c), k = t[w], 0 !== k && (g -= b[w], h(a, g, k)), e--, w = 256 > e ? v[e] : v[256 + (e >>> 7)], f(a, w, d), k = y[w], 0 !== k && (e -= I[w],
                                    h(a, e, k))); while (l < a.last_lit)
                            }
                            f(a, 256, c)
                        }

                        function A(a, b) {
                            var c = b.dyn_tree, d = b.stat_desc.static_tree, f = b.stat_desc.has_stree, e = b.stat_desc.elems, g, h = -1, k;
                            a.heap_len = 0;
                            a.heap_max = 573;
                            for (g = 0; g < e; g++)0 !== c[2 * g] ? (a.heap[++a.heap_len] = h = g, a.depth[g] = 0) : c[2 * g + 1] = 0;
                            for (; 2 > a.heap_len;)k = a.heap[++a.heap_len] = 2 > h ? ++h : 0, c[2 * k] = 1, a.depth[k] = 0, a.opt_len--, f && (a.static_len -= d[2 * k + 1]);
                            b.max_code = h;
                            for (g = a.heap_len >> 1; 1 <= g; g--)l(a, c, g);
                            k = e;
                            do g = a.heap[1], a.heap[1] = a.heap[a.heap_len--], l(a, c, 1), d = a.heap[1], a.heap[--a.heap_max] =
                                g, a.heap[--a.heap_max] = d, c[2 * k] = c[2 * g] + c[2 * d], a.depth[k] = (a.depth[g] >= a.depth[d] ? a.depth[g] : a.depth[d]) + 1, c[2 * g + 1] = c[2 * d + 1] = k, a.heap[1] = k++, l(a, c, 1); while (2 <= a.heap_len);
                            a.heap[--a.heap_max] = a.heap[1];
                            g = b.dyn_tree;
                            k = b.max_code;
                            for (var m = b.stat_desc.static_tree, n = b.stat_desc.has_stree, p = b.stat_desc.extra_bits, t = b.stat_desc.extra_base, r = b.stat_desc.max_length, s, u, v = 0, e = 0; 15 >= e; e++)a.bl_count[e] = 0;
                            g[2 * a.heap[a.heap_max] + 1] = 0;
                            for (d = a.heap_max + 1; 573 > d; d++)f = a.heap[d], e = g[2 * g[2 * f + 1] + 1] + 1, e > r && (e = r, v++),
                                g[2 * f + 1] = e, f > k || (a.bl_count[e]++, s = 0, f >= t && (s = p[f - t]), u = g[2 * f], a.opt_len += u * (e + s), n && (a.static_len += u * (m[2 * f + 1] + s)));
                            if (0 !== v) {
                                do {
                                    for (e = r - 1; 0 === a.bl_count[e];)e--;
                                    a.bl_count[e]--;
                                    a.bl_count[e + 1] += 2;
                                    a.bl_count[r]--;
                                    v -= 2
                                } while (0 < v);
                                for (e = r; 0 !== e; e--)for (f = a.bl_count[e]; 0 !== f;)m = a.heap[--d], m > k || (g[2 * m + 1] !== e && (a.opt_len += (e - g[2 * m + 1]) * g[2 * m], g[2 * m + 1] = e), f--)
                            }
                            q(c, h, a.bl_count)
                        }

                        function F(a, b, c) {
                            var d, e = -1, f, g = b[1], h = 0, l = 7, k = 4;
                            0 === g && (l = 138, k = 3);
                            b[2 * (c + 1) + 1] = 65535;
                            for (d = 0; d <= c; d++)f = g, g = b[2 * (d + 1) + 1], ++h <
                            l && f === g || (h < k ? a.bl_tree[2 * f] += h : 0 !== f ? (f !== e && a.bl_tree[2 * f]++, a.bl_tree[32]++) : 10 >= h ? a.bl_tree[34]++ : a.bl_tree[36]++, h = 0, e = f, 0 === g ? (l = 138, k = 3) : f === g ? (l = 6, k = 3) : (l = 7, k = 4))
                        }

                        function B(a, b, c) {
                            var d, e = -1, g, l = b[1], k = 0, m = 7, n = 4;
                            0 === l && (m = 138, n = 3);
                            for (d = 0; d <= c; d++)if (g = l, l = b[2 * (d + 1) + 1], !(++k < m && g === l)) {
                                if (k < n) {
                                    do f(a, g, a.bl_tree); while (0 !== --k)
                                } else 0 !== g ? (g !== e && (f(a, g, a.bl_tree), k--), f(a, 16, a.bl_tree), h(a, k - 3, 2)) : 10 >= k ? (f(a, 17, a.bl_tree), h(a, k - 3, 3)) : (f(a, 18, a.bl_tree), h(a, k - 11, 7));
                                k = 0;
                                e = g;
                                0 === l ? (m = 138,
                                    n = 3) : g === l ? (m = 6, n = 3) : (m = 7, n = 4)
                            }
                        }

                        function G(a) {
                            var b = 4093624447, c;
                            for (c = 0; 31 >= c; c++, b >>>= 1)if (b & 1 && 0 !== a.dyn_ltree[2 * c])return 0;
                            if (0 !== a.dyn_ltree[18] || 0 !== a.dyn_ltree[20] || 0 !== a.dyn_ltree[26])return 1;
                            for (c = 32; 256 > c; c++)if (0 !== a.dyn_ltree[2 * c])return 1;
                            return 0
                        }

                        function D(a, b, c, d) {
                            h(a, 0 + (d ? 1 : 0), 3);
                            g(a);
                            m(a, c);
                            m(a, ~c);
                            s.arraySet(a.pending_buf, a.window, b, c, a.pending);
                            a.pending += c
                        }

                        var s = d("../utils/common"), t = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0], y = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5,
                            6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13], u = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7], H = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], r = Array(576);
                        k(r);
                        var a = Array(60);
                        k(a);
                        var v = Array(512);
                        k(v);
                        var C = Array(256);
                        k(C);
                        var b = Array(29);
                        k(b);
                        var I = Array(30);
                        k(I);
                        var K = function (a, b, c, d, e) {
                            this.static_tree = a;
                            this.extra_bits = b;
                            this.extra_base = c;
                            this.elems = d;
                            this.max_length = e;
                            this.has_stree = a && a.length
                        }, z, N, O, L = function (a, b) {
                            this.dyn_tree = a;
                            this.max_code = 0;
                            this.stat_desc = b
                        }, P = !1;
                        e._tr_init = function (d) {
                            if (!P) {
                                var e,
                                    f, g, h = Array(16);
                                for (g = f = 0; 28 > g; g++)for (b[g] = f, e = 0; e < 1 << t[g]; e++)C[f++] = g;
                                C[f - 1] = g;
                                for (g = f = 0; 16 > g; g++)for (I[g] = f, e = 0; e < 1 << y[g]; e++)v[f++] = g;
                                for (f >>= 7; 30 > g; g++)for (I[g] = f << 7, e = 0; e < 1 << y[g] - 7; e++)v[256 + f++] = g;
                                for (e = 0; 15 >= e; e++)h[e] = 0;
                                for (e = 0; 143 >= e;)r[2 * e + 1] = 8, e++, h[8]++;
                                for (; 255 >= e;)r[2 * e + 1] = 9, e++, h[9]++;
                                for (; 279 >= e;)r[2 * e + 1] = 7, e++, h[7]++;
                                for (; 287 >= e;)r[2 * e + 1] = 8, e++, h[8]++;
                                q(r, 287, h);
                                for (e = 0; 30 > e; e++)a[2 * e + 1] = 5, a[2 * e] = c(e, 5);
                                z = new K(r, t, 257, 286, 15);
                                N = new K(a, y, 0, 30, 15);
                                O = new K([], u, 0, 19, 7);
                                P = !0
                            }
                            d.l_desc =
                                new L(d.dyn_ltree, z);
                            d.d_desc = new L(d.dyn_dtree, N);
                            d.bl_desc = new L(d.bl_tree, O);
                            d.bi_buf = 0;
                            d.bi_valid = 0;
                            n(d)
                        };
                        e._tr_stored_block = D;
                        e._tr_flush_block = function (b, c, d, e) {
                            var f, l, k = 0;
                            if (0 < b.level) {
                                2 === b.strm.data_type && (b.strm.data_type = G(b));
                                A(b, b.l_desc);
                                A(b, b.d_desc);
                                F(b, b.dyn_ltree, b.l_desc.max_code);
                                F(b, b.dyn_dtree, b.d_desc.max_code);
                                A(b, b.bl_desc);
                                for (k = 18; 3 <= k && 0 === b.bl_tree[2 * H[k] + 1]; k--);
                                b.opt_len += 3 * (k + 1) + 14;
                                f = b.opt_len + 3 + 7 >>> 3;
                                l = b.static_len + 3 + 7 >>> 3;
                                l <= f && (f = l)
                            } else f = l = d + 5;
                            if (d + 4 <= f && -1 !==
                                c)D(b, c, d, e); else if (4 === b.strategy || l === f)h(b, 2 + (e ? 1 : 0), 3), E(b, r, a); else {
                                h(b, 4 + (e ? 1 : 0), 3);
                                c = b.l_desc.max_code + 1;
                                d = b.d_desc.max_code + 1;
                                k += 1;
                                h(b, c - 257, 5);
                                h(b, d - 1, 5);
                                h(b, k - 4, 4);
                                for (f = 0; f < k; f++)h(b, b.bl_tree[2 * H[f] + 1], 3);
                                B(b, b.dyn_ltree, c - 1);
                                B(b, b.dyn_dtree, d - 1);
                                E(b, b.dyn_ltree, b.dyn_dtree)
                            }
                            n(b);
                            e && g(b)
                        };
                        e._tr_tally = function (a, b, c) {
                            a.pending_buf[a.d_buf + 2 * a.last_lit] = b >>> 8 & 255;
                            a.pending_buf[a.d_buf + 2 * a.last_lit + 1] = b & 255;
                            a.pending_buf[a.l_buf + a.last_lit] = c & 255;
                            a.last_lit++;
                            0 === b ? a.dyn_ltree[2 * c]++ : (a.matches++,
                                b--, a.dyn_ltree[2 * (C[c] + 256 + 1)]++, a.dyn_dtree[2 * (256 > b ? v[b] : v[256 + (b >>> 7)])]++);
                            return a.last_lit === a.lit_bufsize - 1
                        };
                        e._tr_align = function (a) {
                            h(a, 2, 3);
                            f(a, 256, r);
                            16 === a.bi_valid ? (m(a, a.bi_buf), a.bi_buf = 0, a.bi_valid = 0) : 8 <= a.bi_valid && (a.pending_buf[a.pending++] = a.bi_buf & 255, a.bi_buf >>= 8, a.bi_valid -= 8)
                        }
                    }, {"../utils/common": 2}],
                    9: [function (d, p, e) {
                        p.exports = function () {
                            this.input = null;
                            this.total_in = this.avail_in = this.next_in = 0;
                            this.output = null;
                            this.total_out = this.avail_out = this.next_out = 0;
                            this.msg = "";
                            this.state =
                                null;
                            this.data_type = 2;
                            this.adler = 0
                        }
                    }, {}]
                }, {}, [1])(1)
            });
            this.deflate = function (J) {
                return z.deflate(J, {level: 8})
            }
        };

        ANALYTICS('core.dca.services.config').DCAConfigurationProvider = function DCAConfigurationProvider() {
            ANALYTICS.common.EventObserver.call(this);

            var self = this;
            var dcaSettings = ANALYTICS.core.dca.settings.dcaSettings;
            var logger = new ANALYTICS.common.MessageLogger("DCAConfigurationProvider");

            function isDefined(value) {
                return value !== undefined;
            }

            function processWithDefaultValue(prefName, defaultValue, callback) {
                var actualValue = ANALYTICS.dcaLocalStorage.read(prefName);

                if (actualValue === undefined) {
                    ANALYTICS.dcaLocalStorage.write(prefName, defaultValue);
                    actualValue = defaultValue;
                }
                return actualValue;
            }

            function provideConfiguration() {
                var defaultWait = 1000 * 60, defaultBatch = 5;
                var streamType = processWithDefaultValue(dcaSettings.streamTypePref, 'click');
                var batchSize = processWithDefaultValue(dcaSettings.batchSizePref, defaultBatch);
                var batchWait = processWithDefaultValue(dcaSettings.batchMaxWaitPref, defaultWait);
                var clickCollection = processWithDefaultValue(dcaSettings.collectPref, true);

                self.notifySubscribers('onConfigurationReady', clickCollection, streamType, batchSize, batchWait);
            }

            this.parse = function (data) {
                var collection = data.collect;
                var type = data.stream_type;
                var size = data.batch_size;
                var wait = data.batch_max_wait;

                logger.log('Processing DCA config values: ' +
                    '\n collection: ' + collection +
                    ',\n type: ' + type +
                    ',\n size: ' + size +
                    ',\n wait: ' + wait
                );

                if (isDefined(collection)) {
                    ANALYTICS.dcaLocalStorage.write(dcaSettings.collectPref, collection);
                }
                if (isDefined(type)) {
                    ANALYTICS.dcaLocalStorage.write(dcaSettings.streamTypePref, type);
                }
                if (isDefined(size)) {
                    ANALYTICS.dcaLocalStorage.write(dcaSettings.batchSizePref, size);
                }
                if (isDefined(wait)) {
                    ANALYTICS.dcaLocalStorage.write(dcaSettings.batchMaxWaitPref, wait);
                }

                provideConfiguration();
            };

            this.init = function () {
                logger.log('Initializing DCA configuration.');
                provideConfiguration();
            }
        };

        ANALYTICS('core.dca.services.config').DCAConfigDownloader = function DCAConfigDownloader(provider) {
            var dcaSettings = ANALYTICS.core.dca.settings.dcaSettings;
            var logger = new ANALYTICS.common.MessageLogger("DCAConfigDownloader");

            function downloadAndProvide() {
                ANALYTICS.xhr.sendGet(dcaSettings.configUrl, {}, function (content) {
                    try {
                        var data = JSON.parse(content);
                        if (data) {
                            logger.log("DCA config received.");
                            provider.parse(data);
                        }
                    } catch (e) {
                        logger.error("Error while parsing DCA config: " + e);
                    }
                });
            }

            function scheduleConfigDownload() {
                var lastRequestTime = ANALYTICS.dcaLocalStorage.read(dcaSettings.lastConfigTime) || 0;
                var timeTillRequest = Date.now() - lastRequestTime;

                if (timeTillRequest > dcaSettings.configRequestPeriod) {
                    logger.log('Trying to get new DCA config');
                    downloadAndProvide();
                    ANALYTICS.dcaLocalStorage.write(dcaSettings.lastConfigTime, String(Date.now()));
                    ANALYTICS.scheduler.setTimeout(scheduleConfigDownload, dcaSettings.configRequestPeriod);
                } else {
                    var delta = dcaSettings.configRequestPeriod - timeTillRequest;
                    logger.log('Scheduling next request for DCA config to ' + delta);
                    ANALYTICS.scheduler.setTimeout(scheduleConfigDownload, delta);
                }
            }

            this.start = function () {
                scheduleConfigDownload();
            };

            this.stop = function () {
                //    toDo: think about stop procedures;
            }
        };

        ANALYTICS('core.dca.web').WebEventComposer = function WebEventComposer() {

            function exists(value) {
                //should take into account default values such as false and 0.
                return value !== undefined && value !== null;
            }

            function createDcaEvent(webEvent) {
                var event = {};
                var error = webEvent.getError();
                var ip = webEvent.getServerIp();
                var redirectUrl = webEvent.getRedirectUrl();
                var referrer = webEvent.getReferrer();
                var windowTitle = webEvent.getWindowTitle();
                var windowName = webEvent.getWindowName();
                var statusCode = webEvent.getStatusCode();
                var statusLine = webEvent.getStatusLine();
                var fromCache = webEvent.getFromCache();
                var requestHeaders = webEvent.getRequestHeaders();
                var responseHeaders = webEvent.getResponseHeaders();
                var type = webEvent.getType();
                var parentFrameId = webEvent.getParentFrameId();
                var frameId = webEvent.getFrameId();
                var timestamp = webEvent.getTimeStamp();
                var entityId = webEvent.getEventId();
                var url = webEvent.getUrl();
                var method = webEvent.getMethod();
                var tabId = webEvent.getTabId();
                var navigationId = webEvent.getNavigationId();
                var postData = webEvent.getPostData();
                var requestType = webEvent.getRequestType();
                var mainFrameRequestId = webEvent.getMainFrameRequestId();
                var openerTabId = webEvent.getOpenerTabId();
                var onlineStatus = webEvent.getOnlineStatus();

                if (exists(requestType)) {
                    event.requestType = requestType;
                }
                if (exists(mainFrameRequestId)) {
                    event.mainFrameRequestId = mainFrameRequestId;
                }
                if (exists(postData) && exists(url) && url.indexOf("https") !== 0) {
                    event.formData = postData;
                }
                if (exists(timestamp)) {
                    event.timeStamp = timestamp;
                }
                if (exists(openerTabId)) {
                    event.openerTabId = openerTabId;
                }
                if (exists(entityId)) {
                    event.eventId = String(Date.now()) + entityId;
                }
                if (exists(url)) {
                    event.url = url;
                }
                if (exists(method)) {
                    event.method = method;
                }
                if (exists(tabId)) {
                    event.tabId = tabId;
                }
                if (exists(frameId)) {
                    event.frameId = frameId;
                }
                if (exists(type)) {
                    event.type = type;
                }
                if (exists(parentFrameId)) {
                    event.parentFrameId = parentFrameId;
                }
                if (exists(statusCode)) {
                    event.statusCode = statusCode;
                }
                if (exists(statusLine)) {
                    event.statusLine = statusLine;
                }
                if (exists(fromCache)) {
                    event.fromCache = fromCache
                }
                if (exists(requestHeaders)) {
                    event.requestHeaders = requestHeaders;
                }
                if (exists(responseHeaders)) {
                    event.responseHeaders = responseHeaders;
                }
                if (exists(error)) {
                    event.error = error;
                }
                if (exists(ip)) {
                    event.ip = ip;
                }
                if (exists(redirectUrl)) {
                    event.redirectUrl = redirectUrl;
                }
                if (exists(referrer)) {
                    event.documentReferer = referrer;
                }
                if (exists(windowTitle)) {
                    event.windowTitle = windowTitle;
                }
                if (exists(windowName)) {
                    event.windowName = windowName;
                }
                if (exists(navigationId)) {
                    event.navigationId = navigationId;
                }
                if (exists(onlineStatus)) {
                    event.is_online = onlineStatus;
                }

                return event;
            }

            this.createEvent = function (webEvent) {
                return createDcaEvent(webEvent)
            }
        };

        ANALYTICS('core.dca.web').WebEventBatchSender = function WebEventBatchSender() {
            var id, collectionEnabled, streamType, batchSize, batchTimeout;

            var composer = new ANALYTICS.core.dca.web.WebEventComposer();
            var compressor = new ANALYTICS.core.dca.lib.Composer();
            var utils = new ANALYTICS.bl.utils.Utils();
            var batchPool = [];

            var logger = new ANALYTICS.common.MessageLogger("WebEventBatchSender");

            function isJSRewrite(webEvent) {
                return webEvent.type == "main_frame_url"
            }

            function requestStream() {
                return streamType == "request"
            }

            function clickstream(webEvent) {
                return streamType == "click" && webEvent.requestType == 'main';
            }

            function shouldBeSaved(webEvent) {
                var allowed = false;

                if (collectionEnabled) {
                    if (isJSRewrite(webEvent) || webEvent.error || requestStream() || clickstream(webEvent)) {
                        allowed = true;
                    }

                    return allowed
                }
            }

            function initIntervalSending() {
                if (id) {
                    ANALYTICS.scheduler.clearInterval(id);
                }
                id = ANALYTICS.scheduler.setInterval(sendBatch, batchTimeout);
            }

            function bin2String(uint8Array) {
                var length = uint8Array.length;
                var string = "";
                var i = 0;

                while (i < length) {
                    var end = Math.min(i + 1000, length);
                    var batch = uint8Array.subarray(i, end);
                    string += String.fromCharCode.apply(null, batch);
                    i = end;
                }
                return string;
            }


            function sendBatch() {
                var encodedData, uint8Array, utf8Str;
                var dataUrl = ANALYTICS.core.dca.settings.dcaSettings.dataUrl;

                if (batchPool.length > 0) {
                    try {
                        utf8Str = ANALYTICS.utils.utf16to8(JSON.stringify(batchPool));
                        uint8Array = compressor.deflate(utf8Str);
                        encodedData = utils.encode(bin2String(uint8Array));

                        ANALYTICS.xhr.sendPost(dataUrl, {}, encodedData);

                        batchPool = [];
                        initIntervalSending();
                    } catch (e) {
                        logger.error("Error while sending collected data: " + e);
                    }
                }
            }

            this.onConfigurationReady = function (collection, type, size, wait) {
                collectionEnabled = collection;
                streamType = type;
                batchSize = size;
                batchTimeout = wait;

                initIntervalSending();
            };

            this.onWebEventReady = function (event) {
                var webEvent = composer.createEvent(event);

                if (shouldBeSaved(webEvent)) {
                    batchPool.push(JSON.stringify(webEvent));
                    if (batchPool.length >= batchSize) {
                        sendBatch();
                    }
                }
            };

            this.onWindowClosed = function (windowId, amount) {
                if (!amount) {
                    sendBatch();
                }
            };
        };

        ANALYTICS('core.dca.web').WebEventInspector = function WebEventInspector() {
            'use strict';

            ANALYTICS.common.EventObserver.call(this);

            var self = this;

            function stringWithDashesToInt(value) {
                var result = value;

                if (typeof(result) == "string" && result.indexOf("-") != -1) {
                    result = parseInt(result.split("-").join(""), 10)
                }

                return result;
            }

            function removePostData(event) {
                event.getPostData() && event.setPostData(null);
            }


            function filterHeadersRecords(headers) {
                if (headers["Set-Cookie"]) {
                    delete headers["Set-Cookie"];
                }
                if (headers["Cookie"]) {
                    delete headers["Cookie"];
                }

                return headers;
            }

            function removeCookiesData(event) {
                var filteredRequestHeaders = filterHeadersRecords(event.getRequestHeaders());
                var filteredResponseHeaders = filterHeadersRecords(event.getResponseHeaders());

                event.setRequestHeaders(filteredRequestHeaders);
                event.setResponseHeaders(filteredResponseHeaders);
            }

            function convertTabId(event) {
                var tabId = event.getTabId();
                if (tabId) {
                    event.setTabId(stringWithDashesToInt(tabId));
                }
            }

            function convertOpenerTabId(event) {
                var openerTabId = event.getOpenerTabId();
                if (openerTabId) {
                    event.setOpenerTabId(stringWithDashesToInt(openerTabId));
                }
            }

            function scrubUrlData(rule, url) {
                var REPLACER = "*****";
                var regExp = new RegExp('[?&](' + rule + '=)([^&]+)', 'i');
                var match = url.match(regExp);

                if (match && match.length == 3) {
                    var key = match[1];
                    var value = match[2];
                    url = url.replace(key + value, key + REPLACER)
                }

                return url;
            }

            function removeUrlSensitiveData(event) {
                var url = event.getUrl();
                var piiRules = [
                    "p", "pw", "pass", "password", "pin", "card", "access", "user", "name", "username", "id", "login", "mem",
                    "member", "signin", "login", "token", "key", "lastname", "name", "surname", "middlename", "lname", "fname",
                    "hint", "dateofbirth", "dob", "birth", "date", "day", "month", "year", "tax", "driverslicense", "payment",
                    "region", "cc", "cred", "credit", "card", "m", "y", "number", "num", "nbr", "type", "code", "cvv", "security",
                    "verify", "account", "num", "number", "tran", "trans", "transaction", "transact", "mail", "email", "ssn", "cookie",
                    "addr", "address", "street", "acct", "country", "region", "gender", "phone", "cell", "cell-phone", "contact",
                    "sec_question", "sec_answer", "organization", "city", "zip", "state", "country_code", "content", "maiden", "secret"
                ];

                for (var i = 0; i < piiRules.length; i++) {
                    var rule = piiRules[i];
                    if (url.indexOf("?") != -1) {
                        try {
                            url = scrubUrlData(rule, url);
                        } catch (e) {
                        }
                    }
                }

                event.setUrl(url);
            }

            function convertFields(event) {
                convertTabId(event);
                convertOpenerTabId(event);

                removePostData(event);
                removeCookiesData(event);

                removeUrlSensitiveData(event);

                self.notifySubscribers("onWebEventReady", event);
            }

            this.onClickReady = function onClickReady(clickEvent) {
                convertFields(clickEvent);
            };

            this.onRequestReady = function onRequestReady(requestEvent) {
                convertFields(requestEvent);
            };

            this.onJSRewriteReady = function onJSRewriteReady(rewriteEvent) {
                convertFields(rewriteEvent);
            };

            this.onErrorReady = function onErrorReady(errorEvent) {
                convertFields(errorEvent);
            };
        };

        ANALYTICS('core.dca.xhr').RequestAdaptor = function RequestAdaptor() {
            var xhr = new ANALYTICS.bl.xhr.XMLHttpRequests();

            function stringify(postData) {
                var str = '';
                for (var p in postData) {
                    if (postData.hasOwnProperty(p)) {
                        str += p + '=' + postData[p] + '&';
                    }
                }
                return str;
            }

            //toDo: appType, appVersion. Should we add those params here as well or not?
            function getFullUrl(url, params) {
                var dcaSettings = ANALYTICS.core.dca.settings.dcaSettings;
                var props = params || {};

                props._user_browser_id = dcaSettings.browserId;
                props._user_software_id = dcaSettings.softwareId;
                props._channel_id = dcaSettings.channelId;
                props._partner_id = dcaSettings.partnerId;
                props._app_version = dcaSettings.version;
                props._app = dcaSettings.appName;

                return url + '?' + stringify(props);
            }

            this.sendPost = function (originalUrl, params, body, callback) {
                var url = getFullUrl(originalUrl, params);
                xhr.sendPost(url, body, callback);
            };

            this.sendGet = function (originalUrl, params, callback) {
                var url = getFullUrl(originalUrl, params);
                xhr.sendGet(url, callback);
            }
        };

//toDo: Need to decompose this class. It is hard to read and understand it.
        ANALYTICS("core.dca").DcaInitializer = function DcaInitializer() {
            var webEventSender, configDownloader, eventInspector, configurationProvider;
            var jsRewriteComposer, clickStreamComposer, errorStreamComposer, requestStreamComposer;
            var dcaSettings = ANALYTICS.core.dca.settings.dcaSettings;

            function removeWebEventObserver() {
                ANALYTICS.webEventObserver.stop();
                ANALYTICS.windowsObserver.stop();
                ANALYTICS.tabsObserver.stop();
            }

            function initializeBrowserLayer() {
                ANALYTICS.utils = new ANALYTICS.common.utils.Utils();
                ANALYTICS.xhr = new ANALYTICS.core.dca.xhr.RequestAdaptor();
                ANALYTICS.scheduler = new ANALYTICS.bl.timer.TimeScheduler();
                ANALYTICS.tabsObserver = new ANALYTICS.bl.tabs.TabsObserver();
                ANALYTICS.windowsObserver = new ANALYTICS.bl.windows.WindowsObserver();
                ANALYTICS.errorsMessageAdaptor = new ANALYTICS.bl.error.ErrorsMessageAdaptor();
                ANALYTICS.dcaLocalStorage = new ANALYTICS.bl.storage.LocalStorage(dcaSettings.dcaLocalPrefsBranch, dcaSettings.channelId);
            }

            function initializeWebObserver() {
                jsRewriteComposer = new ANALYTICS.bl.web.composers.WebJSRewriteComposer();
                clickStreamComposer = new ANALYTICS.bl.web.composers.WebClickStreamComposer();
                errorStreamComposer = new ANALYTICS.bl.web.composers.WebErrorStreamComposer();
                requestStreamComposer = new ANALYTICS.bl.web.composers.WebRequestStreamComposer();

                var dispatcher = new ANALYTICS.bl.web.WebEventDispatcher(clickStreamComposer, requestStreamComposer, errorStreamComposer, jsRewriteComposer);
                ANALYTICS.webEventObserver = new ANALYTICS.bl.web.WebEventObserver(dispatcher);

                ANALYTICS.tabsObserver.subscribe(jsRewriteComposer);
                ANALYTICS.tabsObserver.subscribe(clickStreamComposer);
            }

            function initializeCore() {
                eventInspector = new ANALYTICS.core.dca.web.WebEventInspector();
                configurationProvider = new ANALYTICS.core.dca.services.config.DCAConfigurationProvider();
                configDownloader = new ANALYTICS.core.dca.services.config.DCAConfigDownloader(configurationProvider);
                webEventSender = new ANALYTICS.core.dca.web.WebEventBatchSender();

                eventInspector.subscribe(webEventSender);
                configurationProvider.subscribe(webEventSender);
                ANALYTICS.windowsObserver.subscribe(webEventSender);

                clickStreamComposer.subscribe(eventInspector);
                requestStreamComposer.subscribe(eventInspector);
                errorStreamComposer.subscribe(eventInspector);
                jsRewriteComposer.subscribe(eventInspector);
            }

            function startDCA() {
                ANALYTICS.windowsObserver.start();
                ANALYTICS.tabsObserver.start();
                ANALYTICS.webEventObserver.start();

                configurationProvider.init();
                configDownloader.start();
            }

            this.start = function () {
                initializeBrowserLayer();
                initializeWebObserver();
                initializeCore();

                startDCA();
            };

            this.stop = function () {
                removeWebEventObserver();
            };

            this.uninstall = function () {
                removeWebEventObserver();
                ANALYTICS.dcaLocalStorage.removeBranch();
            }
        };

        return new ANALYTICS.core.dca.DcaInitializer();


    };


    function isOwnId(id) {
        return chrome.runtime.id == id;
    }

    chrome.runtime.onInstalled.addListener(function (extensionInfo) {
        if (isOwnId(extensionInfo.id)) {
            ANALYTICS.API.onInstall();
        }
    });

    function uninstallListener() {
        var uninstallUrl = ANALYTICS.xhr.getFullUrl(ANALYTICS.settings.serverUrl + "uninstall", {});
        chrome.runtime.setUninstallURL(uninstallUrl, function () {
            var error = chrome.runtime.lastError;
            if (error) {
                //do nothing
            }
        })
    }

    ANALYTICS.API.onStartup(uninstallListener);

    return ANALYTICS;
})();

