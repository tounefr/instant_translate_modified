(function (modules) {
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) return installedModules[moduleId].exports;
        var module = installedModules[moduleId] = {
            exports: {},
            id: moduleId,
            loaded: !1
        };
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        module.loaded = !0;
        return module.exports;
    }

    var installedModules = {};
    __webpack_require__.m = modules;
    __webpack_require__.c = installedModules;
    __webpack_require__.p = "";
    return __webpack_require__(0);
})([function (module, exports, __webpack_require__) {
    (function (apiBg) {
        (function () {
            "use strict";
            var travelBar = {};
            travelBar.appInfo = {
                id: "insttranslate." + ke.PLATFORM_CODE
            };
            var prepareStorage = function (storage) {
                storage.aviaBar && "object" == typeof storage.aviaBar || (storage.aviaBar = {});
                Array.isArray(storage.aviaBar.blackList) || (storage.aviaBar.blackList = []);
            };
            travelBar.API = {
                setRemovedState: function (state) {
                    apiBg.storage.get("aviaBar", function (storage) {
                        prepareStorage(storage);
                        storage.aviaBar.removed = !!state;
                        return apiBg.storage.set(storage);
                    });
                }
            };
            apiBg.onMessage(function (msg, response) {
                if (msg && msg.action) switch (msg.action) {
                    case "tbrGetInfo":
                        response(travelBar.appInfo);
                        break;

                    case "tbrIsAllow":
                        apiBg.storage.get("aviaBar", function (storage) {
                            prepareStorage(storage);
                            var removed = storage.aviaBar.removed;
                            if (removed) return response(!1);
                            var allow = !0;
                            var blackList = storage.aviaBar.blackList;
                            var item = null;
                            blackList.some(function (_item) {
                                if (_item.hostname === msg.hostname) {
                                    item = _item;
                                    return !0;
                                }
                            });
                            if (item) {
                                var now = parseInt(Date.now() / 1e3);
                                if (item.expire > now) allow = !1; else {
                                    var pos = blackList.indexOf(item);
                                    blackList.splice(pos, 1);
                                    apiBg.storage.set(storage);
                                }
                            }
                            return response(allow);
                        });
                        return !0;

                    case "tbrCloseBar":
                        apiBg.storage.get("aviaBar", function (storage) {
                            prepareStorage(storage);
                            var blackList = storage.aviaBar.blackList;
                            var item = null;
                            blackList.some(function (_item) {
                                if (_item.hostname === msg.hostname) {
                                    item = _item;
                                    return !0;
                                }
                            });
                            if (!item) {
                                var now = parseInt(Date.now() / 1e3);
                                blackList.push({
                                    hostname: msg.hostname,
                                    expire: now + 18e3
                                });
                                apiBg.storage.set(storage);
                            }
                        });
                }
            });
            window.travelBar = travelBar.API;
        })();
    }).call(exports, __webpack_require__(1));
}, function (module, exports) {
    var apiBg = {
        onMessage: function (cb) {
            chrome.runtime.onMessage.addListener(function (msg, sender, response) {
                return cb(msg, response);
            });
        },
        storage: {
            get: function (data, cb) {
                if (chrome.storage) return chrome.storage.local.get(data, cb);
                Array.isArray(data) || (data = [data]);
                var obj = {};
                data.forEach(function (key) {
                    var value = localStorage.getItem(key);
                    if (value) try {
                        value = JSON.parse(value);
                        obj[key] = value;
                    } catch (e) {
                    }
                });
                return cb(obj);
            },
            set: function (data, cb) {
                if (chrome.storage) return chrome.storage.local.set(data, cb);
                Object.keys(data).forEach(function (key) {
                    var value = data[key];
                    if (void 0 !== value) {
                        value = JSON.stringify(value);
                        localStorage.setItem(key, value);
                    }
                });
                return cb && cb();
            }
        }
    };
    module.exports = apiBg;
}]);