(function(modules) {
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
})([ function(module, exports, __webpack_require__) {
    (function(Promise, utils, CustomError, tbr, api) {
        __webpack_require__(20)(function() {
            "use strict";
            Promise.resolve().then(function() {
                __webpack_require__(14)(utils);
                __webpack_require__(16)(utils);
                if (utils.isFrame()) throw new CustomError("Inside frame!");
                tbr.hostname = location.hostname;
                tbr.currentProfile = __webpack_require__(6)();
                if (!tbr.currentProfile) {
                    tbr.error("Invalid location!", location.href);
                    throw new CustomError("Invalid location!");
                }
                api.sendMessagePromise = function(msg) {
                    return new Promise(function(resolve) {
                        api.sendMessage(msg, resolve);
                    });
                };
                return api.sendMessagePromise({
                    action: "tbrGetInfo"
                }).then(function(info) {
                    utils.extend(tbr.appInfo, info);
                    tbr.log("Version", tbr.version);
                    tbr.log("Set info", info);
                    if (!info.id) throw new CustomError("Partner id is not set!");
                    return api.sendMessagePromise({
                        action: "tbrIsAllow",
                        hostname: tbr.hostname
                    }).then(function(result) {
                        if (!result) {
                            tbr.log("Bar is closed!", tbr.hostname);
                            throw new CustomError("Bar is closed!");
                        }
                        if (utils.tbrExists()) throw new CustomError("Bar exists!");
                        if (!utils.mutationWatcher.isAvailable()) throw new CustomError("MutationObserver is not support!");
                        utils.tbrSetGlobal();
                        tbr.language = __webpack_require__(7);
                    });
                });
            }).then(function() {
                var main = tbr.main;
                main.avia = __webpack_require__(9)();
                main.hotel = __webpack_require__(10)();
                main.cars = __webpack_require__(11)();
                main.currency = __webpack_require__(12)();
                main.bar = __webpack_require__(13)();
                main.watcher = __webpack_require__(15)();
                main.watcher.initProfile(tbr.currentProfile);
            }).catch(function(err) {
                if (err instanceof CustomError) tbr.log(err.message); else {
                    tbr.error("Init error!", err);
                    tbr.trackError(err);
                }
            });
        });
    }).call(exports, __webpack_require__(19), __webpack_require__(2), __webpack_require__(18), __webpack_require__(8), __webpack_require__(1));
}, function(module, exports) {
    var api = {
        sendMessage: function(msg, response) {
            chrome.runtime.sendMessage(msg, response);
        },
        getUILanguage: function() {
            if ("undefined" != typeof chrome && chrome.i18n && chrome.i18n.getUILanguage) return chrome.i18n.getUILanguage();
        }
    };
    module.exports = api;
}, function(module, exports, __webpack_require__) {
    (function(Promise, CustomError) {
        var utils = {};
        utils.extend = function() {
            var obj = arguments[0];
            for (var i = 1, len = arguments.length; i < len; i++) {
                var item = arguments[i];
                for (var key in item) void 0 !== item[key] && (obj[key] = item[key]);
            }
            return obj;
        };
        utils.param = function(obj) {
            if ("string" == typeof obj) return obj;
            var itemsList = [];
            for (var key in obj) if (obj.hasOwnProperty(key)) {
                void 0 !== obj[key] && null !== obj[key] || (obj[key] = "");
                itemsList.push(encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]));
            }
            return itemsList.join("&");
        };
        (function() {
            utils.create = function(tagName, obj) {
                var el;
                var func;
                el = "object" != typeof tagName ? document.createElement(tagName) : tagName;
                for (var attr in obj) {
                    var value = obj[attr];
                    (func = hook[attr]) ? func(el, value) : el[attr] = value;
                }
                return el;
            };
            var hook = {
                text: function(el, value) {
                    el.textContent = value;
                },
                data: function(el, value) {
                    for (var item in value) el.dataset[item] = value[item];
                },
                class: function(el, value) {
                    if (Array.isArray(value)) for (var i = 0, len = value.length; i < len; i++) el.classList.add(value[i]); else el.setAttribute("class", value);
                },
                style: function(el, value) {
                    if ("object" == typeof value) for (var item in value) {
                        var key = item;
                        "float" === key && (key = "cssFloat");
                        var _value = value[item];
                        if (Array.isArray(_value)) for (var i = 0, len = _value.length; i < len; i++) el.style[key] = _value[i]; else el.style[key] = _value;
                    } else el.setAttribute("style", value);
                },
                append: function(el, value) {
                    Array.isArray(value) || (value = [ value ]);
                    for (var i = 0, len = value.length; i < len; i++) {
                        var node = value[i];
                        if (node || 0 === node) {
                            "object" != typeof node && (node = document.createTextNode(node));
                            el.appendChild(node);
                        }
                    }
                },
                on: function(el, eventList) {
                    "object" != typeof eventList[0] && (eventList = [ eventList ]);
                    for (var i = 0, len = eventList.length; i < len; i++) {
                        var args = eventList[i];
                        Array.isArray(args) && utils.on(el, args[0], args[1], args[2]);
                    }
                },
                onCreate: function(el, value) {
                    value.call(el, el);
                }
            };
        })();
        utils.on = function(el, type, onEvent, capture) {
            el.addEventListener(type, onEvent, capture);
        };
        utils.off = function(el, type, onEvent, capture) {
            el.removeEventListener(type, onEvent, capture);
        };
        utils.parseUrl = function(url, details) {
            details = details || {};
            var query = null;
            query = !details.params && /\?/.test(url) ? url.match(/[^?]+\?(.+)/)[1] : url;
            var separator = details.sep || "&";
            var dblParamList = query.split(separator);
            var params = {};
            for (var i = 0, len = dblParamList.length; i < len; i++) {
                var item = dblParamList[i];
                var keyValue = item.split("=");
                var key = keyValue[0];
                var value = keyValue[1] || "";
                if (details.noDecode) params[key] = value; else {
                    try {
                        key = decodeURIComponent(key);
                    } catch (err) {
                        key = unescape(key);
                    }
                    try {
                        params[key] = decodeURIComponent(value);
                    } catch (err) {
                        params[key] = unescape(value);
                    }
                }
            }
            return params;
        };
        utils.debounce = function(fn, delay) {
            var timer = null;
            return function() {
                var context = this, args = arguments;
                clearTimeout(timer);
                timer = setTimeout(function() {
                    fn.apply(context, args);
                }, delay);
            };
        };
        utils.getPageScript = function(html, match) {
            match && !Array.isArray(match) && (match = [ match ]);
            var scriptList = [];
            html.replace(/<script(?:|\s[^>]+[^\/])>/g, function(text, offset) {
                offset += text.length;
                var endPos = html.indexOf("</script>", offset);
                if (endPos !== -1) {
                    var content = html.substr(offset, endPos - offset);
                    match ? match.every(function(r) {
                        return r.test(content);
                    }) && scriptList.push(content) : scriptList.push(content);
                }
            });
            return scriptList;
        };
        utils.findJson = function(html, match) {
            match && !Array.isArray(match) && (match = [ match ]);
            var rawJson = [];
            var obj = {
                "{": 0,
                "[": 0
            };
            var map = {
                "}": "{",
                "]": "["
            };
            var jsonSymbols = /[{}\]\[":0-9.,-]/;
            var whiteSpace = /[\r\n\s\t]/;
            var jsonText = "";
            for (var symbol, i = 0; symbol = html[i]; i++) if ('"' !== symbol) {
                if (jsonSymbols.test(symbol)) {
                    jsonText += symbol;
                    if ("{" === symbol || "[" === symbol) {
                        obj["{"] || obj["["] || (jsonText = symbol);
                        obj[symbol]++;
                    } else if ("}" === symbol || "]" === symbol) {
                        obj[map[symbol]]--;
                        obj["{"] || obj["["] || rawJson.push(jsonText);
                    }
                } else if ("t" === symbol && "true" === html.substr(i, 4)) {
                    jsonText += "true";
                    i += 3;
                } else if ("f" === symbol && "false" === html.substr(i, 5)) {
                    jsonText += "false";
                    i += 4;
                } else if ("n" === symbol && "null" === html.substr(i, 4)) {
                    jsonText += "null";
                    i += 3;
                } else if (!whiteSpace.test(symbol)) {
                    obj["{"] = 0;
                    obj["["] = 0;
                    jsonText = "";
                }
            } else {
                var end = i;
                for (;end !== -1 && (end === i || "\\" === html[end - 1]); ) end = html.indexOf('"', end + 1);
                end === -1 && (end = html.length - 1);
                jsonText += html.substr(i, end - i + 1);
                i = end;
            }
            var jsonList = [];
            for (var item, i = 0; item = rawJson[i]; i++) if ("{}" !== item && "[]" !== item) try {
                match ? match.every(function(r) {
                    return r.test(item);
                }) && jsonList.push(JSON.parse(item)) : jsonList.push(JSON.parse(item));
            } catch (e) {}
            return jsonList;
        };
        utils.style2Text = function(cssStyleObj, parentSelector) {
            var list = [];
            Array.isArray(cssStyleObj) || (cssStyleObj = [ cssStyleObj ]);
            parentSelector && !Array.isArray(parentSelector) && (parentSelector = [ parentSelector ]);
            var styleToText = function(selectorArr, styleObj) {
                var content = [];
                for (var item in styleObj) {
                    var value = styleObj[item];
                    "cssFloat" === item && (item = "float");
                    var key = item.replace(/([A-Z])/g, function(text, letter) {
                        return "-" + letter.toLowerCase();
                    });
                    content.push(key + ":" + value);
                }
                return content.length ? [ selectorArr.join(","), "{", content.join(";"), "}" ].join("") : "";
            };
            var inheritSelector = function(section, selector) {
                Array.isArray(selector) || (selector = [ selector ]);
                if (parentSelector) {
                    var _selector = [];
                    var join = section.join || "" === section.join ? section.join : " ";
                    parentSelector.forEach(function(parentSelector) {
                        selector.forEach(function(selector) {
                            _selector.push(parentSelector + join + selector);
                        });
                    });
                    selector = _selector;
                }
                return selector;
            };
            cssStyleObj.forEach(function(section) {
                var inhSelector = null;
                var media = section.media;
                var selector = section.selector;
                var style = section.style;
                var append = section.append;
                if (media && append) list.push([ media, "{", utils.style2Text(append, parentSelector), "}" ].join("")); else if (selector || style) {
                    inhSelector = inheritSelector(section, selector);
                    list.push(styleToText(inhSelector, style));
                    append && list.push(utils.style2Text(append, inhSelector));
                } else for (var key in section) if ([ "append", "join" ].indexOf(key) === -1) {
                    selector = key;
                    style = section[key];
                    append = style.append;
                    append && delete style.append;
                    inhSelector = inheritSelector(section, selector);
                    list.push(styleToText(inhSelector, style));
                    append && list.push(utils.style2Text(append, inhSelector));
                }
            });
            return list.join("");
        };
        utils.styleReset = {
            animation: "none 0s ease 0s 1 normal none running",
            backfaceVisibility: "visible",
            background: "transparent none repeat 0 0 / auto auto padding-box border-box scroll",
            border: "medium none currentColor",
            borderCollapse: "separate",
            borderImage: "none",
            borderRadius: "0",
            borderSpacing: "0",
            bottom: "auto",
            boxShadow: "none",
            boxSizing: "content-box",
            captionSide: "top",
            clear: "none",
            clip: "auto",
            color: "inherit",
            columns: "auto",
            columnCount: "auto",
            columnFill: "balance",
            columnGap: "normal",
            columnRule: "medium none currentColor",
            columnSpan: "1",
            columnWidth: "auto",
            content: "normal",
            counterIncrement: "none",
            counterReset: "none",
            cursor: "auto",
            direction: "ltr",
            display: "inline",
            emptyCells: "show",
            float: "none",
            font: "normal normal normal normal medium/normal inherit",
            height: "auto",
            hyphens: "none",
            left: "auto",
            letterSpacing: "normal",
            listStyle: "disc outside none",
            margin: "0",
            maxHeight: "none",
            maxWidth: "none",
            minHeight: "0",
            minWidth: "0",
            opacity: "1",
            orphans: "0",
            outline: "medium none invert",
            overflow: "visible",
            overflowX: "visible",
            overflowY: "visible",
            padding: "0",
            pageBreakAfter: "auto",
            pageBreakBefore: "auto",
            pageBreakInside: "auto",
            perspective: "none",
            perspectiveOrigin: "50% 50%",
            position: "static",
            right: "auto",
            tabSize: "8",
            tableLayout: "auto",
            textAlign: "inherit",
            textAlignLast: "auto",
            textDecoration: "none solid currentColor",
            textIndent: "0",
            textShadow: "none",
            textTransform: "none",
            top: "auto",
            transform: "none",
            transformOrigin: "50% 50% 0",
            transformStyle: "flat",
            transition: "none 0s ease 0s",
            unicodeBidi: "normal",
            verticalAlign: "baseline",
            visibility: "visible",
            whiteSpace: "normal",
            widows: "0",
            width: "auto",
            wordSpacing: "normal",
            zIndex: "auto",
            all: "initial"
        };
        utils.bridge = function(details) {
            details.args = details.args || [];
            void 0 === details.timeout && (details.timeout = 300);
            var scriptId = "sf-bridge-" + parseInt(1e3 * Math.random()) + "-" + Date.now();
            var listener = function(e) {
                window.removeEventListener("sf-bridge-" + scriptId, listener);
                var data;
                data = e.detail ? JSON.parse(e.detail) : void 0;
                details.cb(data);
            };
            window.addEventListener("sf-bridge-" + scriptId, listener);
            var wrapFunc = "(" + function(func, args, scriptId, timeout) {
                var node = document.getElementById(scriptId);
                node && node.parentNode.removeChild(node);
                var fired = !1;
                var done = function(data) {
                    if (!fired) {
                        fired = !0;
                        var event = new CustomEvent("sf-bridge-" + scriptId, {
                            detail: JSON.stringify(data)
                        });
                        window.dispatchEvent(event);
                    }
                };
                timeout && setTimeout(function() {
                    done();
                }, timeout);
                args.push(done);
                func.apply(null, args);
            }.toString() + ")(" + [ details.func.toString(), JSON.stringify(details.args), JSON.stringify(scriptId), parseInt(details.timeout) ].join(",") + ");";
            var script = document.createElement("script");
            script.id = scriptId;
            script.textContent = wrapFunc;
            document.body.appendChild(script);
        };
        utils.mutationWatcher = {
            getMutationObserver: function() {
                var MutationObserverCtor = null;
                "undefined" != typeof MutationObserver ? MutationObserverCtor = MutationObserver : "undefined" != typeof WebKitMutationObserver ? MutationObserverCtor = WebKitMutationObserver : "undefined" != typeof MozMutationObserver ? MutationObserverCtor = MozMutationObserver : "undefined" != typeof JsMutationObserver && (MutationObserverCtor = JsMutationObserver);
                return MutationObserverCtor;
            },
            isAvailable: function() {
                return !!this.getMutationObserver();
            },
            disconnect: function(details) {
                details.observer.disconnect();
            },
            connect: function(details) {
                details.observer.observe(details.target, details.config);
            },
            joinMutations: function(mutations) {
                var jMutations = [];
                var targetList = [];
                var obj, hasNodes, jObj = {};
                var mutation, i, node, tIndex;
                for (;mutation = mutations.shift(); ) {
                    tIndex = targetList.indexOf(mutation.target);
                    if (tIndex === -1) {
                        tIndex = targetList.push(mutation.target) - 1;
                        jObj[tIndex] = {
                            target: mutation.target,
                            added: [],
                            removed: []
                        };
                    }
                    obj = jObj[tIndex];
                    hasNodes = void 0;
                    for (i = 0; node = mutation.addedNodes[i]; i++) if (1 === node.nodeType) {
                        obj.added.push(node);
                        hasNodes = !0;
                    }
                    for (i = 0; node = mutation.removedNodes[i]; i++) if (1 === node.nodeType) {
                        obj.removed.push(node);
                        hasNodes = !0;
                    }
                    if (void 0 !== hasNodes && void 0 === obj.inList) {
                        obj.inList = !0;
                        jMutations.push(obj);
                    }
                }
                return jMutations;
            },
            isMatched: null,
            prepareMatched: function() {
                if (!this.isMatched) {
                    var el = document.createElement("div");
                    "function" == typeof el.matches ? this.isMatched = function(node, selector) {
                        return node.matches(selector);
                    } : "function" == typeof el.matchesSelector ? this.isMatched = function(node, selector) {
                        return node.matchesSelector(selector);
                    } : "function" == typeof el.webkitMatchesSelector ? this.isMatched = function(node, selector) {
                        return node.webkitMatchesSelector(selector);
                    } : "function" == typeof el.mozMatchesSelector ? this.isMatched = function(node, selector) {
                        return node.mozMatchesSelector(selector);
                    } : "function" == typeof el.oMatchesSelector ? this.isMatched = function(node, selector) {
                        return node.oMatchesSelector(selector);
                    } : "function" == typeof el.msMatchesSelector && (this.isMatched = function(node, selector) {
                        return node.msMatchesSelector(selector);
                    });
                    el = null;
                }
            },
            match: function(details, summaryList, mutation) {
                var _this = this;
                var node, i, query, n;
                var queries = details.queries;
                var hasChanges = !1;
                [ "added", "removed" ].forEach(function(type) {
                    var nodeList = mutation[type];
                    for (n = 0; node = nodeList[n]; n++) for (i = 0; query = queries[i]; i++) if (void 0 === query.is || query.is === type) {
                        var nodeArr = summaryList[i][type];
                        _this.isMatched(node, query.css) === !0 ? nodeArr.push(node) : nodeArr.push.apply(nodeArr, node.querySelectorAll(query.css));
                        hasChanges === !1 && (hasChanges = void 0 !== nodeArr[0]);
                    }
                });
                return hasChanges;
            },
            filterTarget: function(queries, node) {
                var i, query;
                for (i = 0; query = queries[i]; i++) if (this.isMatched(node, query.css) === !0) return !0;
                return !1;
            },
            run: function(_details) {
                var _this = this;
                var details = {
                    config: {
                        childList: !0,
                        subtree: !0
                    },
                    target: document.body,
                    filterTarget: []
                };
                utils.extend(details, _details);
                details._disconnect = this.disconnect.bind(this, details);
                details._connect = this.connect.bind(this, details);
                details._match = this.match.bind(this, details);
                var _summaryList = [];
                for (var i = 0; i < details.queries.length; i++) _summaryList.push({
                    added: [],
                    removed: []
                });
                _summaryList = JSON.stringify(_summaryList);
                this.prepareMatched();
                var mObserver = this.getMutationObserver();
                details.observer = new mObserver(function(mutations) {
                    var jMutations = _this.joinMutations(mutations);
                    if (0 !== jMutations.length) {
                        var hasChanges = !1;
                        var mutation;
                        var summaryList = JSON.parse(_summaryList);
                        for (;mutation = jMutations.shift(); ) _this.filterTarget(details.filterTarget, mutation.target) === !1 && details._match(summaryList, mutation) === !0 && (hasChanges = !0);
                        hasChanges === !0 && details.callback(summaryList);
                    }
                });
                details.start = function() {
                    details._disconnect();
                    details._connect();
                    var hasChanges = !1;
                    var summaryList = JSON.parse(_summaryList);
                    var mutation = {
                        added: [ details.target ],
                        removed: []
                    };
                    details._match(summaryList, mutation) && (hasChanges = !0);
                    hasChanges === !0 && details.callback(summaryList);
                };
                details.stop = function() {
                    details._disconnect();
                };
                details.start();
                return details;
            }
        };
        utils.request = function(details) {
            "object" != typeof details && (details = {
                url: details
            });
            var xhrSuccessStatus = {
                0: 200,
                1223: 204
            };
            return new Promise(function(resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", details.url, !0);
                xhr.onload = function() {
                    var status = xhrSuccessStatus[xhr.status] || xhr.status;
                    (status >= 200 && status < 300 || 304 === status) && "string" == typeof xhr.responseText ? resolve({
                        body: xhr.responseText
                    }) : reject(new CustomError(xhr.status + " " + xhr.statusText));
                };
                xhr.onerror = xhr.onabort = function() {
                    reject(new CustomError(xhr.status + " " + xhr.statusText));
                };
                xhr.send();
            });
        };
        utils.tbrExists = function() {
            return !!document.body.parentNode.dataset.travelBar;
        };
        utils.tbrSetGlobal = function() {
            return document.body.parentNode.dataset.travelBar = "1";
        };
        utils.isFrame = function() {
            return document.defaultView.self !== document.defaultView.top;
        };
        utils.stripStack = function(stack) {
            var m = /([^\s(]+\/)([^\/\s]+\.js)/.exec(stack);
            if (m) {
                var path = m[1];
                var fn = m[2];
                var shortFn = fn;
                shortFn = shortFn.replace(".lite", "l");
                shortFn = shortFn.replace(".min", "m");
                shortFn = shortFn.replace("travelBar", "t");
                stack = shortFn + ":" + stack.split(path + fn).join("js");
            }
            stack = stack.replace(/\r/g, "").replace(/\s*\n\s*/g, ">").replace(/\s{2,}/g, " ");
            return stack;
        };
        module.exports = utils;
    }).call(exports, __webpack_require__(19), __webpack_require__(18));
}, function(module, exports, __webpack_require__) {
    var getProfileName = function() {
        var origin = location.origin || location.protocol + "//" + location.hostname;
        var urlPatternToStrRe = __webpack_require__(4);
        var siteList = __webpack_require__(5);
        var patternArray = Object.keys(siteList);
        var profilePattern;
        var patternRe;
        for (var id, i = 0; id = patternArray[i]; i++) {
            patternRe = new RegExp(urlPatternToStrRe(id));
            if (patternRe.test(origin)) {
                profilePattern = id;
                break;
            }
        }
        return profilePattern;
    };
    module.exports = getProfileName;
}, function(module, exports) {
    var escapeRegex = function(value) {
        return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    };
    var urlPatternToStrRe = function(value) {
        if ("<all_urls>" === value) return "^https?:\\/\\/.+$";
        var m = /(\*|http|https|file|ftp):\/\/([^\/]+)(?:\/(.*))?/.exec(value);
        if (!m) throw new Error("Invalid url-pattern");
        var scheme = m[1];
        "*" === scheme && (scheme = "https?");
        var host = m[2];
        if ("*" === host) host = ".+"; else {
            host = escapeRegex(host);
            host = host.replace(/^\\\*\\\./, "(?:[^/]+\\.)?");
            host = host.replace(/\\\.\\\*$/g, "\\.[a-z\\.]{2,}");
        }
        var pattern = [ "^", scheme, ":\\/\\/", host ];
        var path = m[3];
        if (path) {
            if ("*" === path) {
                path = "(?:|/.*)";
                pattern.push(path);
                pattern.push("$");
            } else if (path) {
                path = "/" + path;
                path = escapeRegex(path);
                path = path.replace(/\\\*/g, ".*");
                pattern.push(path);
                pattern.push("$");
            }
        } else pattern.push("$");
        return pattern.join("");
    };
    module.exports = urlPatternToStrRe;
}, function(module, exports, __webpack_require__) {
    var patternIdList = {
        "*://*.ozon.travel/*": "ozon_travel",
        "*://*.onetwotrip.com/*": "onetwotrip_com",
        "*://*.aeroflot.ru/*": "aeroflot_ru",
        "*://*.momondo.*/*": "momondo_com",
        "*://*.anywayanyday.com/*": "anywayanyday_com",
        "*://*.svyaznoy.travel/*": "svyaznoy_travel",
        "*://avia.tickets.ru/*": "tickets_ru",
        "*://*.s7.ru/*": "s7_ru",
        "*://*.kupibilet.ru/*": "kupibilet_ru",
        "*://*.trip.ru/*": "trip_ru",
        "*://*.sindbad.ru/*": "sindbad_ru",
        "*://*.aviakassa.ru/*": "aviakassa_ru",
        "*://*.biletix.ru/*": "biletix_ru",
        "*://*.utair.ru/*": "utair_ru",
        "*://*.kayak.*/*": "kayak_com",
        "*://*.orbitz.com/*": "travelocity_com",
        "*://*.travelocity.com/*": "travelocity_com",
        "*://*.expedia.com/*": "travelocity_com",
        "*://*.priceline.com/*": "priceline_com",
        "*://booking.airasia.com/*": "airasia_com",
        "*://*.ryanair.com/*": "ryanair_com",
        "*://*.booking.*/*": "booking_com",
        "*://*.agoda.*/*": "agoda_com",
        "*://*.hotels.com/*": "hotels_com",
        "*://*.ostrovok.ru/*": "ostrovok_ru",
        "*://*.travel.ru/*": "travel_ru",
        "*://*.oktogo.ru/*": "oktogo_ru",
        "*://*.roomguru.ru/*": "roomguru_ru",
        "*://*.tripadvisor.ru/*": "tripadvisor_ru",
        "*://*.hilton.ru/*": "hilton_com",
        "*://*.hilton.com/*": "hilton_com",
        "*://*.marriott.com/*": "marriott_com",
        "*://*.hostelworld.com/*": "hostelworld_com",
        "*://*.tiket.com/*": "tiket_com",
        "*://*.hotelsclick.com/*": "hotelsclick_com",
        "*://*.hotelscombined.com/*": "hotelscombined_com",
        "*://*.avis.*/*": "avis_com",
        "*://*.budget.com/*": "budget_com",
        "*://*.wizzair.com/*": "wizzair_com",
        "*://*.emirates.com/*": "emirates_com",
        "*://*.delta.com/*": "delta_com",
        "*://*.hertz.com/*": "hertz_com",
        "*://*.europcar.com/*": "europcar_com"
    };
    patternIdList["*://*.skyscanner.*/*"] = "skyscanner_com";
    module.exports = patternIdList;
}, function(module, exports, __webpack_require__) {
    (function(tbr, CustomError) {
        var getPageProfile = function() {
            var pattern = __webpack_require__(3)();
            if (!pattern) {
                tbr.error("Profile is not exists!", location.href);
                throw new CustomError("Profile is not exists!");
            }
            var profileList = __webpack_require__(17)();
            var profile = profileList[pattern];
            if (!profile) {
                tbr.error("Template is not found!", pattern);
                throw new CustomError("Template is not found!");
            }
            var profileDetails = profile();
            Array.isArray(profileDetails) || (profileDetails = [ profileDetails ]);
            var details = null;
            profileDetails.some(function(item) {
                if (!item.locationCheck) {
                    details = item;
                    return !0;
                }
                if (item.locationCheck(location.href)) {
                    details = item;
                    return !0;
                }
            });
            return details;
        };
        module.exports = getPageProfile;
    }).call(exports, __webpack_require__(8), __webpack_require__(18));
}, function(module, exports, __webpack_require__) {
    (function(api) {
        var getLanguage = function() {
            var langCode = function() {
                var langCode = "";
                api.getUILanguage && (langCode = api.getUILanguage());
                langCode || (langCode = navigator.language);
                langCode && "string" == typeof langCode || (langCode = "en");
                return langCode.toLowerCase().substr(0, 2);
            }();
            var lang = {
                ru: {
                    lang: "ru",
                    foundOneWay: "Найден билет дешевле",
                    foundTwoWay: "Билеты дешевле",
                    view: "Посмотреть",
                    origin: "Туда:",
                    destination: "Обратно:",
                    close: "Закрыть",
                    foundHotel: "Найдена лучшая цена",
                    aroundHotel: "Рядом есть отель лучше",
                    checkIn: "Дата заезда:",
                    checkOut: "Дата отъезда:",
                    inMonth: "в %month%",
                    calLabel: "Выгодное предложение!",
                    suggests: "Ещё отели",
                    foundCars: "Забронируй со скидкой!",
                    carsView: "Сэкономить",
                    e1_foundOneWay: "Есть билеты дешевле",
                    e1_view: "Сэкономить",
                    e2_foundHotel: "Хотите сэкономить?",
                    e2_pricePre: "за",
                    e2_view: "Забронировать дешевле"
                },
                en: {
                    lang: "en",
                    foundOneWay: "Found a better price",
                    foundTwoWay: "Better price",
                    view: "Learn more",
                    origin: "Depart:",
                    destination: "Return:",
                    close: "Close",
                    foundHotel: "Found a better price",
                    aroundHotel: "Found a better hotel around",
                    checkIn: "Check-in:",
                    checkOut: "Check-out:",
                    inMonth: "in %month%",
                    calLabel: "Get a better deal!",
                    suggests: "More hotels",
                    foundCars: "Get discount on booking!",
                    carsView: "Book now!"
                }
            };
            "uk" === langCode && (langCode = "ru");
            return lang[langCode] || lang.en;
        };
        module.exports = getLanguage();
    }).call(exports, __webpack_require__(1));
}, function(module, exports, __webpack_require__) {
    (function(api) {
        var tbr = {
            appName: "tbr",
            appId: "tbr.chrome",
            version: "20170206.091707",
            language: null,
            appInfo: {},
            errorMap: {
                LOW_PRICE_IS_NOT_FOUND: 10,
                REQUEST_ABORTED: 11,
                CCY_NOT_SUPPORT: 42,
                AVIA_BACK_FAIL: 110,
                HOTEL_BACK_FAIL: 120,
                CARS_BACK_FAIL: 160
            },
            main: {}
        };
        tbr.error = function() {
            if (tbr.appInfo.debug) {
                var args = [ "tbr" ];
                args.push.apply(args, arguments);
                console.error.apply(console, args);
            }
        };
        tbr.log = function() {
            if (tbr.appInfo.debug) {
                var args = [ "tbr" ];
                args.push.apply(args, arguments);
                console.log.apply(console, args);
            }
        };
        tbr.emit = function(type) {
            if (tbr.appInfo[type]) {
                var args = [].slice.call(arguments, 1);
                try {
                    api.sendMessage({
                        action: "tbrEvent",
                        type: type,
                        data: args
                    });
                } catch (err) {
                    tbr.error("Emit error", err);
                }
            }
        };
        var errors = [];
        tbr.trackError = function(err) {
            var utils = __webpack_require__(2);
            var stack = "";
            stack = "string" == typeof err.stack ? err.stack : [ err.filename, err.lineno, err.name, err.message ].join(" ");
            stack = utils.stripStack(stack);
            if (errors.indexOf(stack) === -1) {
                errors.push(stack);
                tbr.emit("directTrack", {
                    t: "exception",
                    exd: stack.substr(0, 150),
                    an: tbr.appName,
                    aid: tbr.appId,
                    av: tbr.version,
                    tid: "UA-7055055-10"
                });
            }
        };
        module.exports = tbr;
    }).call(exports, __webpack_require__(1));
}, function(module, exports, __webpack_require__) {
    (function(tbr, Promise, utils, CustomError) {
        var getAvia = function() {
            var main = tbr.main;
            var cache = {};
            var getPrice = function(params, priceParams) {
                var price = null;
                priceParams.price ? price = priceParams.price : priceParams.minPriceOut && priceParams.minPriceIn ? price = priceParams.minPriceOut + priceParams.minPriceIn : priceParams.minPriceOut ? price = priceParams.minPriceOut : priceParams.minPriceIn && (price = priceParams.minPriceIn);
                return price;
            };
            var requestAirports = function() {
                return cache.airportCityCodeMap ? Promise.resolve() : utils.request({
                    url: "https://api.travelbar.tools/v1/tp/data/airports.json?" + utils.param({
                        partnerId: tbr.appInfo.id
                    })
                }).then(function(response) {
                    var airports = JSON.parse(response.body);
                    var airportCityCodeMap = {};
                    airports.forEach(function(item) {
                        item.code && item.city_code && (airportCityCodeMap[item.code] = item.city_code);
                    });
                    cache.airportCityCodeMap = airportCityCodeMap;
                });
            };
            var requestCities = function() {
                return cache.cityMap ? Promise.resolve() : utils.request({
                    url: "https://api.travelbar.tools/v1/tp/data/cities.json?" + utils.param({
                        partnerId: tbr.appInfo.id
                    })
                }).then(function(response) {
                    var cities = JSON.parse(response.body);
                    var cityMap = {};
                    cities.forEach(function(item) {
                        item.code && item.name && (cityMap[item.code] = {
                            name: item.name,
                            name_translations: item.name_translations
                        });
                    });
                    cache.cityMap = cityMap;
                });
            };
            var getCityName = function(code) {
                return Promise.all([ requestCities(), requestAirports() ]).then(function() {
                    var name = null;
                    var city = cache.cityMap[code];
                    if (!city) {
                        code = cache.airportCityCodeMap[code];
                        city = cache.cityMap[code];
                    }
                    if (city) {
                        var localName = city.name_translations && city.name_translations[tbr.language.lang];
                        name = localName || city.name;
                    }
                    return name;
                });
            };
            var requestPrices = function(pageInfo) {
                var data = {
                    origin: pageInfo.origin,
                    destination: pageInfo.destination,
                    depart_date: pageInfo.dateStart,
                    return_date: pageInfo.dateEnd,
                    currency: pageInfo.currency,
                    locale: tbr.language.lang,
                    partnerId: tbr.appInfo.id
                };
                return utils.request({
                    url: "https://api.travelbar.tools/v1/avia/prices?" + utils.param(data)
                }).then(function(response) {
                    var aviaResponse = JSON.parse(response.body);
                    if (!(aviaResponse && aviaResponse.success && aviaResponse.currency && Array.isArray(aviaResponse.data))) {
                        tbr.error("API is not success!", response.body);
                        throw new CustomError("AVIA_BACK_FAIL");
                    }
                    return aviaResponse;
                });
            };
            var convertCurrency = function(results, fromCurrency, toCurrency) {
                var fromCcy = fromCurrency.toUpperCase();
                var toCcy = toCurrency.toUpperCase();
                return fromCcy === toCcy ? Promise.resolve() : main.currency.load().then(function() {
                    if (!main.currency.exists(toCcy) || !main.currency.exists(fromCcy)) {
                        tbr.error("Currency is not support!", toCcy, fromCcy);
                        throw new CustomError("CCY_NOT_SUPPORT");
                    }
                    results.forEach(function(item) {
                        item.converted_value = main.currency.convert(item.value, fromCcy, toCcy);
                    });
                });
            };
            var requestData = function(pageInfo) {
                return requestPrices(pageInfo).then(function(aviaResponse) {
                    return convertCurrency(aviaResponse.data, aviaResponse.currency, pageInfo.currency).then(function() {
                        return aviaResponse;
                    });
                });
            };
            var getLowPrice = function(results) {
                var lowValue = null;
                results.forEach(function(item) {
                    var value = item.converted_value || item.value;
                    (null === lowValue || lowValue > value) && (lowValue = value);
                });
                return lowValue;
            };
            return {
                getCityName: getCityName,
                onGetData: function(pageInfo) {
                    tbr.log("Info", pageInfo);
                    if (pageInfo.barRequestData) tbr.log("Data from API was requested, before. Skip"); else {
                        pageInfo.barRequestData = !0;
                        var currentBar = main.bar.current;
                        currentBar && main.watcher.clearInfoObj(pageInfo);
                        tbr.emit("track", {
                            cd: "flightrequestdata",
                            t: "screenview"
                        });
                        tbr.emit("track", {
                            ec: "cheapflight",
                            ea: "requestData",
                            el: tbr.hostname,
                            cd: "flightrequestdata",
                            t: "event"
                        });
                        var onAbort = function(err) {
                            var eventName = "discard";
                            var errorMessage = err.message;
                            "betterPrice" === errorMessage && (eventName = errorMessage);
                            tbr.emit("track", {
                                ec: "cheapflight",
                                ea: eventName,
                                el: tbr.hostname,
                                t: "event"
                            });
                            var index = tbr.errorMap[errorMessage];
                            if (index) {
                                var label = [ index, pageInfo.origin, pageInfo.destination, pageInfo.price, pageInfo.currency, pageInfo.dateStart, pageInfo.dateEnd || "" ].join(";");
                                tbr.emit("directTrack", {
                                    ec: "cheapflightError",
                                    ea: tbr.hostname,
                                    el: label,
                                    t: "event",
                                    an: tbr.appName,
                                    aid: tbr.appId,
                                    av: tbr.version,
                                    tid: "UA-7055055-10"
                                });
                            }
                        };
                        main.bar.isAborted = !1;
                        requestData(pageInfo).then(function(aviaResponse) {
                            if (main.bar.isAborted) throw new CustomError("REQUEST_ABORTED");
                            var lowPrice = getLowPrice(aviaResponse.data);
                            if (null === lowPrice) {
                                tbr.error("Low price is not found!", pageInfo.price);
                                throw new CustomError("LOW_PRICE_IS_NOT_FOUND");
                            }
                            tbr.emit("track", {
                                cd: "flightresponsedata",
                                t: "screenview"
                            });
                            tbr.emit("track", {
                                ec: "cheapflight",
                                ea: "responseData",
                                el: tbr.hostname,
                                cd: "flightresponsedata",
                                t: "event"
                            });
                            main.bar.aviaBarSaveInHistory(pageInfo, aviaResponse);
                            var hasLowerPrice = lowPrice >= pageInfo.price;
                            hasLowerPrice && tbr.log("Has lower price!", lowPrice, pageInfo.price);
                            tbr.appInfo.debug && (hasLowerPrice = !1);
                            if (hasLowerPrice) throw new CustomError("betterPrice");
                            return main.bar.create({
                                type: "avia",
                                prices: aviaResponse,
                                pageInfo: pageInfo
                            });
                        }).catch(function(err) {
                            if (err instanceof CustomError) tbr.log(err.message); else {
                                tbr.error(err);
                                tbr.trackError(err);
                            }
                            currentBar && currentBar.close();
                            onAbort(err);
                        });
                    }
                },
                page: {
                    getData: function(params, priceParams) {
                        var checkKeys = [ "origin", "destination", "dateStart", "currency", "price" ];
                        var data = {
                            origin: params.origin,
                            destination: params.destination,
                            dateStart: params.dateStart,
                            dateEnd: params.dateEnd,
                            currency: params.currency,
                            price: getPrice(params, priceParams)
                        };
                        var r = checkKeys.every(function(key) {
                            return !!data[key];
                        });
                        return r ? data : null;
                    },
                    getPriceId: function(params) {
                        var idKeys = [ "origin", "destination", "dateStart", "dateEnd", "currency" ];
                        var id = [];
                        var r = idKeys.every(function(key) {
                            var value = params[key];
                            id.push(value);
                            return "dateEnd" === key || !!value;
                        });
                        return r ? id.join(";") : null;
                    }
                }
            };
        };
        module.exports = getAvia;
    }).call(exports, __webpack_require__(8), __webpack_require__(19), __webpack_require__(2), __webpack_require__(18));
}, function(module, exports, __webpack_require__) {
    (function(tbr, utils, CustomError, Promise) {
        var getHotel = function() {
            var main = tbr.main;
            var getPrice = function(params, priceParams) {
                var price = null;
                if (priceParams.price) price = priceParams.price; else if (priceParams.oneDayPrice && params.dayCount) price = priceParams.oneDayPrice * params.dayCount; else if (priceParams.oneDayPrice && params.dateIn && params.dateOut) {
                    var dateIn = new Date(params.dateIn);
                    var dateOut = new Date(params.dateOut);
                    var dayCount = Math.round((dateOut.getTime() - dateIn.getTime()) / 24 / 60 / 60 / 1e3);
                    price = priceParams.oneDayPrice * dayCount;
                }
                return price;
            };
            var getLowPrices = function(prices) {
                var value = null;
                var suggestsValue = null;
                prices.forEach(function(item) {
                    var _value = item.converted_value || item.value;
                    item.isSuggest ? (null === suggestsValue || _value < suggestsValue) && (suggestsValue = _value) : (null === value || _value < value) && (value = _value);
                });
                return [ value, suggestsValue ];
            };
            var requestHotelQueryPrices = function(pageInfo, index) {
                var data = {
                    hotel_name: pageInfo.query[index],
                    checkIn: pageInfo.dateIn,
                    checkOut: pageInfo.dateOut,
                    adults: pageInfo.adults,
                    currency: pageInfo.currency,
                    locale: tbr.language.lang,
                    partnerId: tbr.appInfo.id
                };
                return utils.request({
                    url: "https://api.travelbar.tools/v1/hotel/prices?" + utils.param(data)
                }).then(function(response) {
                    var hotelResponse = JSON.parse(response.body);
                    if (!(hotelResponse && hotelResponse.success && hotelResponse.currency && Array.isArray(hotelResponse.data))) {
                        tbr.error("API is not success!", response.body);
                        throw new CustomError("HOTEL_BACK_FAIL");
                    }
                    return hotelResponse;
                });
            };
            var requestHotelPrices = function(pageInfo) {
                var promise = Promise.reject();
                var lastSuggestsResponse = null;
                pageInfo.query.forEach(function(query, index) {
                    promise = promise.catch(function() {
                        return requestHotelQueryPrices(pageInfo, index).then(function(hotelResponse) {
                            if (!hotelResponse.hasTarget) {
                                lastSuggestsResponse = hotelResponse;
                                throw new Error("Target is not exists!");
                            }
                            return hotelResponse;
                        });
                    });
                });
                promise = promise.catch(function(err) {
                    if (!lastSuggestsResponse) throw err;
                    return lastSuggestsResponse;
                });
                return promise;
            };
            var convertCurrency = function(results, fromCurrency, toCurrency) {
                var fromCcy = fromCurrency.toUpperCase();
                var toCcy = toCurrency.toUpperCase();
                return fromCcy === toCcy ? Promise.resolve() : main.currency.load().then(function() {
                    if (!main.currency.exists(toCcy) || !main.currency.exists(fromCcy)) {
                        tbr.error("Currency is not support!", toCcy, fromCcy);
                        throw new CustomError("CCY_NOT_SUPPORT");
                    }
                    results.forEach(function(item) {
                        item.converted_value = main.currency.convert(item.value, fromCcy, toCcy);
                    });
                });
            };
            var requestHotelData = function(pageInfo) {
                return requestHotelPrices(pageInfo).then(function(hotelResponse) {
                    return convertCurrency(hotelResponse.data, hotelResponse.currency, pageInfo.currency).then(function() {
                        return hotelResponse;
                    });
                });
            };
            return {
                onGetData: function(pageInfo) {
                    tbr.log("Info", pageInfo);
                    if (pageInfo.barRequestData) tbr.log("Data from API was requested, before. Skip"); else {
                        pageInfo.barRequestData = !0;
                        var currentBar = main.bar.current;
                        currentBar && main.watcher.clearInfoObj(pageInfo);
                        var onAbort = function(err) {
                            var eventName = "discard";
                            var errorMessage = err.message;
                            "betterPrice" === errorMessage && (eventName = errorMessage);
                            tbr.emit("track", {
                                ec: "hotel",
                                ea: eventName,
                                el: tbr.hostname,
                                t: "event"
                            });
                            var index = tbr.errorMap[errorMessage];
                            if (index) {
                                var query = pageInfo.query[0];
                                var label = [ index, tbr.language.lang, pageInfo.dateIn, pageInfo.dateOut, pageInfo.adults, pageInfo.price, pageInfo.currency, query ].join(";");
                                tbr.emit("directTrack", {
                                    ec: "hotelError",
                                    ea: tbr.hostname,
                                    el: label,
                                    t: "event",
                                    an: tbr.appName,
                                    aid: tbr.appId,
                                    av: tbr.version,
                                    tid: "UA-7055055-10"
                                });
                            }
                        };
                        tbr.emit("track", {
                            cd: "hotelrequestdata",
                            t: "screenview"
                        });
                        tbr.emit("track", {
                            ec: "hotel",
                            ea: "requestData",
                            el: tbr.hostname,
                            cd: "hotelrequestdata",
                            t: "event"
                        });
                        main.bar.isAborted = !1;
                        requestHotelData(pageInfo).then(function(hotelResponse) {
                            if (main.bar.isAborted) throw new CustomError("REQUEST_ABORTED");
                            tbr.emit("track", {
                                cd: "hotelresponsedata",
                                t: "screenview"
                            });
                            tbr.emit("track", {
                                ec: "hotel",
                                ea: "responseData",
                                el: tbr.hostname,
                                cd: "hotelresponsedata",
                                t: "event"
                            });
                            var lowPrices = getLowPrices(hotelResponse.data);
                            var lowPrice = lowPrices[0];
                            var lowSuggestPrice = lowPrices[1];
                            var maxSuggestPrice = pageInfo.price + .2 * pageInfo.price;
                            var targetPriceIsLow = lowPrice && lowPrice < pageInfo.price;
                            var showSuggest = !1;
                            var suggestPriceIsLow = !1;
                            targetPriceIsLow || (suggestPriceIsLow = showSuggest = lowSuggestPrice && lowSuggestPrice < maxSuggestPrice);
                            targetPriceIsLow || suggestPriceIsLow || tbr.log("Has low price!", lowPrices, pageInfo.price);
                            tbr.appInfo.debug && (lowPrice ? targetPriceIsLow = !0 : suggestPriceIsLow && (suggestPriceIsLow = showSuggest = !0));
                            if (!targetPriceIsLow && !suggestPriceIsLow) throw new CustomError("betterPrice");
                            return main.bar.create({
                                type: "hotel",
                                showSuggestPrice: showSuggest,
                                prices: hotelResponse,
                                pageInfo: pageInfo
                            });
                        }).catch(function(err) {
                            if (err instanceof CustomError) tbr.log(err.message); else {
                                tbr.error(err);
                                tbr.trackError(err);
                            }
                            currentBar && currentBar.close();
                            onAbort(err);
                        });
                    }
                },
                page: {
                    getData: function(params, priceParams) {
                        var checkKeys = [ "query", "dateIn", "dateOut", "currency", "adults", "price" ];
                        var data = {
                            query: params.query,
                            dateIn: params.dateIn,
                            dateOut: params.dateOut,
                            currency: params.currency,
                            adults: params.adults,
                            price: getPrice(params, priceParams)
                        };
                        var r = checkKeys.every(function(key) {
                            return !!data[key];
                        });
                        return r ? data : null;
                    },
                    getPriceId: function(params) {
                        var idKeys = [ "dateIn", "dateOut", "currency", "adults" ];
                        var id = [];
                        var r = idKeys.every(function(key) {
                            var value = params[key];
                            id.push(value);
                            return !!value;
                        });
                        return r ? id.join(";") : null;
                    }
                }
            };
        };
        module.exports = getHotel;
    }).call(exports, __webpack_require__(8), __webpack_require__(2), __webpack_require__(18), __webpack_require__(19));
}, function(module, exports, __webpack_require__) {
    (function(tbr, utils, CustomError, Promise) {
        var getCars = function() {
            var main = tbr.main;
            var getPrice = function(params, priceParams) {
                var price = null;
                priceParams.price && (price = priceParams.price);
                return price;
            };
            var requestCarsPrice = function(pageInfo) {
                var data = {
                    pickUpLocationId: pageInfo.pickUpLocationId,
                    pickUpDate: pageInfo.pickUpDate,
                    dropOffLocationId: pageInfo.dropOffLocationId,
                    dropOffDate: pageInfo.dropOffDate,
                    driverAge: pageInfo.driverAge,
                    currency: pageInfo.currency,
                    locale: tbr.language.lang,
                    partnerId: tbr.appInfo.id
                };
                return utils.request({
                    url: "https://api.travelbar.tools/v1/cars/prices?" + utils.param(data)
                }).then(function(response) {
                    var carsResponse = JSON.parse(response.body);
                    if (!(carsResponse && carsResponse.success && carsResponse.currency && Array.isArray(carsResponse.data))) {
                        tbr.error("API is not success!", response.body);
                        throw new CustomError("CARS_BACK_FAIL");
                    }
                    return carsResponse;
                });
            };
            var convertCurrency = function(results, fromCurrency, toCurrency) {
                var fromCcy = fromCurrency.toUpperCase();
                var toCcy = toCurrency.toUpperCase();
                return fromCcy === toCcy ? Promise.resolve() : main.currency.load().then(function() {
                    if (!main.currency.exists(toCcy) || !main.currency.exists(fromCcy)) {
                        tbr.error("Currency is not support!", toCcy, fromCcy);
                        throw new CustomError("CCY_NOT_SUPPORT");
                    }
                    results.forEach(function(item) {
                        item.converted_value = main.currency.convert(item.value, fromCcy, toCcy);
                    });
                });
            };
            var requestData = function(pageInfo) {
                return requestCarsPrice(pageInfo).then(function(carsResponse) {
                    return convertCurrency(carsResponse.data, carsResponse.currency, pageInfo.currency).then(function() {
                        return carsResponse;
                    });
                });
            };
            var getLowPrice = function(results) {
                var lowValue = null;
                results.forEach(function(item) {
                    var value = item.converted_value || item.value;
                    (null === lowValue || lowValue > value) && (lowValue = value);
                });
                return lowValue;
            };
            return {
                onGetData: function(pageInfo) {
                    tbr.log("Info", pageInfo);
                    if (pageInfo.barRequestData) tbr.log("Data from API was requested, before. Skip"); else {
                        pageInfo.barRequestData = !0;
                        var currentBar = main.bar.current;
                        currentBar && main.watcher.clearInfoObj(pageInfo);
                        var onAbort = function(err) {
                            var eventName = "discard";
                            var errorMessage = err.message;
                            "betterPrice" === errorMessage && (eventName = errorMessage);
                            tbr.emit("track", {
                                ec: "cars",
                                ea: eventName,
                                el: tbr.hostname,
                                t: "event"
                            });
                            var index = tbr.errorMap[errorMessage];
                            if (index) {
                                var label = [ index, tbr.language.lang, pageInfo.pickUpLocationId, pageInfo.dropOffLocationId, pageInfo.driverAge, pageInfo.price, pageInfo.currency, pageInfo.pickUpDate, pageInfo.dropOffDate ].join(";");
                                tbr.emit("directTrack", {
                                    ec: "carsError",
                                    ea: tbr.hostname,
                                    el: label,
                                    t: "event",
                                    an: tbr.appName,
                                    aid: tbr.appId,
                                    av: tbr.version,
                                    tid: "UA-7055055-10"
                                });
                            }
                        };
                        tbr.emit("track", {
                            cd: "carsrequestdata",
                            t: "screenview"
                        });
                        tbr.emit("track", {
                            ec: "cars",
                            ea: "requestData",
                            el: tbr.hostname,
                            cd: "carsrequestdata",
                            t: "event"
                        });
                        main.bar.isAborted = !1;
                        requestData(pageInfo).then(function(carsResponse) {
                            if (main.bar.isAborted) throw new CustomError("REQUEST_ABORTED");
                            var lowPrice = getLowPrice(carsResponse.data);
                            if (null === lowPrice) {
                                tbr.error("Low price is not found!", pageInfo.price);
                                throw new CustomError("LOW_PRICE_IS_NOT_FOUND");
                            }
                            tbr.emit("track", {
                                cd: "carsresponsedata",
                                t: "screenview"
                            });
                            tbr.emit("track", {
                                ec: "cars",
                                ea: "responseData",
                                el: tbr.hostname,
                                cd: "carsresponsedata",
                                t: "event"
                            });
                            var hasLowerPrice = lowPrice >= pageInfo.price;
                            hasLowerPrice && tbr.log("Has lower price!", lowPrice, pageInfo.price);
                            tbr.appInfo.debug && (hasLowerPrice = !1);
                            if (hasLowerPrice) throw new CustomError("betterPrice");
                            return main.bar.create({
                                type: "cars",
                                prices: carsResponse,
                                pageInfo: pageInfo
                            });
                        }).catch(function(err) {
                            if (err instanceof CustomError) tbr.log(err.message); else {
                                tbr.error(err);
                                tbr.trackError(err);
                            }
                            currentBar && currentBar.close();
                            onAbort(err);
                        });
                    }
                },
                page: {
                    getData: function(params, priceParams) {
                        var checkKeys = [ "pickUpLocationId", "pickUpDate", "dropOffLocationId", "dropOffDate", "driverAge", "currency", "price" ];
                        var data = {
                            pickUpLocationId: params.pickUpLocationId,
                            pickUpDate: params.pickUpDate,
                            dropOffLocationId: params.dropOffLocationId,
                            dropOffDate: params.dropOffDate,
                            driverAge: params.driverAge,
                            currency: params.currency,
                            price: getPrice(params, priceParams)
                        };
                        var r = checkKeys.every(function(key) {
                            return !!data[key];
                        });
                        return r ? data : null;
                    },
                    getPriceId: function(params) {
                        var idKeys = [ "pickUpLocationId", "pickUpDate", "dropOffLocationId", "dropOffDate", "driverAge", "currency" ];
                        var id = [];
                        var r = idKeys.every(function(key) {
                            var value = params[key];
                            id.push(value);
                            return !!value;
                        });
                        return r ? id.join(";") : null;
                    }
                }
            };
        };
        module.exports = getCars;
    }).call(exports, __webpack_require__(8), __webpack_require__(2), __webpack_require__(18), __webpack_require__(19));
}, function(module, exports, __webpack_require__) {
    (function(Promise, utils, tbr) {
        var getCurrency = function() {
            var cache = null;
            return {
                exists: function(currency) {
                    return !!cache[currency];
                },
                load: function() {
                    return cache ? Promise.resolve(cache) : utils.request({
                        url: "https://api.travelbar.tools/v1/as/currencies/all_currencies_rates?" + utils.param({
                            partnerId: tbr.appInfo.id
                        })
                    }).then(function(response) {
                        var obj = JSON.parse(response.body);
                        var _cache = {};
                        Object.keys(obj).forEach(function(key) {
                            _cache[key.toUpperCase()] = obj[key];
                        });
                        return cache = _cache;
                    });
                },
                convert: function(price, fromCcy, toCcy) {
                    toCcy = toCcy.toUpperCase();
                    fromCcy = fromCcy.toUpperCase();
                    var fromCourse = cache[fromCcy];
                    var toCourse = cache[toCcy];
                    return price * fromCourse / toCourse;
                }
            };
        };
        module.exports = getCurrency;
    }).call(exports, __webpack_require__(19), __webpack_require__(2), __webpack_require__(8));
}, function(module, exports, __webpack_require__) {
    (function(tbr, utils, CustomError, api) {
        var getBarUi = function() {
            var main = tbr.main;
            var origPageStyle = {};
            var getRandomInt = function(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            };
            var marginPage = function(barObj, show) {
                var barHeight = 55;
                var barNode = barObj.body.node;
                var htmlNode = document.body.parentNode;
                if (show) {
                    origPageStyle.marginTop = htmlNode.style.marginTop;
                    origPageStyle.transition = htmlNode.style.transition;
                    htmlNode.style.transition = "margin-top 0.2s";
                    barNode.style.transition = "margin-top 0.2s";
                    setTimeout(function() {
                        htmlNode.style.marginTop = barHeight + "px";
                        barNode.style.marginTop = 0;
                        htmlNode.style.setProperty && htmlNode.style.setProperty("margin-top", barHeight + "px", "important");
                        setTimeout(function() {
                            htmlNode.style.transition = origPageStyle.transition;
                            barNode.style.transition = "";
                        }, 250);
                    }, 0);
                    var onShow = tbr.currentProfile.onShow;
                    onShow && onShow(barHeight);
                } else {
                    htmlNode.style.marginTop = origPageStyle.marginTop;
                    var onHide = tbr.currentProfile.onHide;
                    onHide && onHide();
                }
            };
            var rndClassName = function(barNode, styleNode) {
                var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                var dDbl = {};
                var getRnd = function() {
                    var limit = 10;
                    var rnd = "t";
                    do {
                        limit--;
                        for (var i = 0; i < 21; i++) rnd += possible.charAt(Math.floor(Math.random() * possible.length));
                    } while (dDbl[rnd] && limit > 0);
                    dDbl[rnd] = 1;
                    return rnd;
                };
                var classMap = {};
                var slice = [].slice;
                slice.call(barNode.querySelectorAll("[class]")).forEach(function(node) {
                    slice.call(node.classList).forEach(function(className) {
                        classMap[className] || (classMap[className] = getRnd());
                        node.classList.remove(className);
                        var rnd = classMap[className];
                        node.classList.add(rnd);
                    });
                });
                var styleText = styleNode.textContent;
                Object.keys(classMap).sort(function(a, b) {
                    return a.length > b.length ? -1 : 1;
                }).forEach(function(origClassName) {
                    var newClassName = classMap[origClassName];
                    styleText = styleText.replace(new RegExp(origClassName, "gi"), newClassName);
                });
                styleNode.textContent = styleText;
            };
            var getRandomIndex = function(len) {
                var value = getRandomInt(0, 100);
                var percent = 100 / len;
                var index = 0;
                if (len > 0 && percent > 0) for (;value > percent; ) {
                    value -= percent;
                    index++;
                }
                return index;
            };
            var wrapAviaBarContent = function(pageInfo, content) {
                var isCalendar = content.isCalendar;
                if (!isCalendar) {
                    var modList = [ "" ];
                    "ru" === tbr.language.lang && modList.push(function() {
                        content.barTitle = tbr.language.e1_foundOneWay;
                        content.open = tbr.language.e1_view;
                    });
                    var index = getRandomIndex(modList.length);
                    var fn = modList[index];
                    fn && fn();
                }
            };
            var wrapHotelBarContent = function(pageInfo, content) {
                var isSuggest = content.isSuggest;
                if (!isSuggest) {
                    var modList = [ "" ];
                    "ru" === tbr.language.lang && modList.push(function() {
                        content.barTitle = tbr.language.e2_foundHotel;
                        content.priceText = utils.create(document.createDocumentFragment(), {
                            append: [ tbr.language.e2_pricePre + " ", utils.getPriceNode(content.currency, content.value) ]
                        });
                        content.open = tbr.language.e2_view;
                    });
                    var index = getRandomIndex(modList.length);
                    var fn = modList[index];
                    fn && fn();
                }
            };
            var Bar = function(details) {
                this.hostname = tbr.hostname;
                this.type = details.type;
                this.details = details;
                this.isClosed = !1;
                this.isRemoved = !1;
                this.container = document.createDocumentFragment();
                this.styleCss = [];
                this.barContent = this.getBarContent();
                this.body = this.getBody();
                this.content = this.getContent();
                this.body.content.appendChild(this.content.node);
                this.style = this.getStyle();
                this.container.appendChild(this.body.node);
                this.container.appendChild(this.style.node);
                rndClassName(this.container, this.style.node);
            };
            Bar.prototype.trackByVendor = function(data) {
                var map = {
                    aviasales: "as",
                    skyscanner: "sc"
                };
                var vendor = this.barContent.vendor;
                var prefix = map[vendor];
                if (prefix) {
                    data.ec += "-" + prefix;
                    return tbr.emit("track", data);
                }
                return tbr.error("Prefix is not found!", vendor);
            };
            Bar.prototype.getAviaBarContent = function() {
                var _this = this;
                var details = this.details;
                var pageInfo = details.pageInfo;
                var prices = details.prices;
                var getAviaBarItemIndex = function(priceList) {
                    var minDate = null;
                    var minItem = null;
                    priceList.forEach(function(item) {
                        var m = /(\d{4}.\d{2}.\d{2})/.exec(item.depart_date);
                        if (m) {
                            var date = m[1];
                            if (null === minDate || minDate > date) {
                                minDate = date;
                                minItem = null;
                            }
                            date === minDate && (null === minItem || item.value < minItem.value) && (minItem = item);
                        }
                    });
                    var index = priceList.indexOf(minItem);
                    tbr.log("Bar item", index, minItem);
                    tbr.log("Result prices", priceList);
                    return index;
                };
                var barItem = prices.data[getAviaBarItemIndex(prices.data)];
                if (!barItem) {
                    tbr.error("Bar item is not found!", details);
                    return null;
                }
                var isCalendar = !!barItem.monthPrice;
                var isOneWay = !pageInfo.dateEnd;
                var content = {
                    value: barItem.converted_value || barItem.value,
                    currency: pageInfo.currency,
                    origin: barItem.origin,
                    originName: barItem.originName,
                    destination: barItem.destination,
                    destinationName: barItem.destinationName,
                    dateStart: barItem.depart_date,
                    dateEnd: barItem.return_date,
                    open: tbr.language.view,
                    monthPrice: !!barItem.monthPrice,
                    vendor: barItem.vendor || "aviasales",
                    url: barItem.url,
                    isCalendar: isCalendar,
                    isOneWay: isOneWay
                };
                isCalendar ? content.priceText = utils.getPriceNode(content.currency, content.value) : content.priceText = utils.create(document.createDocumentFragment(), {
                    append: function() {
                        var nodes = [];
                        if (pageInfo.price > content.value) {
                            _this.styleCss.push({
                                ".tbr-red-price": {
                                    textDecoration: "line-through",
                                    color: "#F44336"
                                }
                            });
                            nodes.push(utils.create("span", {
                                class: [ "tbr-red-price" ],
                                append: [ utils.getPriceNode(content.currency, pageInfo.price) ]
                            }));
                            nodes.push(String.fromCharCode(160));
                        } else tbr.error("Red price is hidden", pageInfo.price, content.value);
                        nodes.push(utils.getPriceNode(content.currency, content.value));
                        return nodes;
                    }()
                });
                if (isCalendar) {
                    content.barTitle = tbr.language.calLabel;
                    content.dateText = tbr.language.inMonth.replace("%month%", utils.getCalMonth(content.dateStart));
                } else if (isOneWay) {
                    content.barTitle = tbr.language.foundOneWay;
                    content.dateText = utils.getDate(content.dateStart, !0);
                } else {
                    content.barTitle = tbr.language.foundTwoWay;
                    content.dateText = utils.getDateInterval(content.dateStart, content.dateEnd);
                }
                if (!content.originName || !content.destinationName) {
                    tbr.error("City name is not found!", content.origin, content.destination);
                    throw new CustomError("City name is not found!");
                }
                wrapAviaBarContent(pageInfo, content);
                return content;
            };
            Bar.prototype.getHotelBarContent = function() {
                var details = this.details;
                var pageInfo = details.pageInfo;
                var prices = details.prices;
                var getHotelBarItem = function(prices) {
                    var barItem = null;
                    var isSuggest = !!details.showSuggestPrice;
                    prices.data.filter(function(item) {
                        return isSuggest === !!item.isSuggest;
                    }).forEach(function(item) {
                        (null === barItem || barItem.value > item.value) && (barItem = item);
                    });
                    var suggestItemList = [];
                    prices.data.forEach(function(item) {
                        item.isSuggest && item !== barItem && suggestItemList.push(item);
                    });
                    return {
                        barItem: barItem,
                        suggestItemList: suggestItemList
                    };
                };
                var pricesObj = getHotelBarItem(prices);
                var barItem = pricesObj.barItem;
                if (!barItem) {
                    tbr.error("Bar item is not found!", details);
                    return null;
                }
                var getHotelContent = function(barItem) {
                    var isSuggest = !!barItem.isSuggest;
                    ("number" != typeof barItem.stars || barItem < 0 || barItem.stars > 5) && (barItem.stars = 0);
                    var content = {
                        name: barItem.name,
                        stars: barItem.stars,
                        value: barItem.converted_value || barItem.value,
                        currency: pageInfo.currency,
                        dateIn: pageInfo.dateIn,
                        dateOut: pageInfo.dateOut,
                        open: tbr.language.view,
                        url: barItem.deeplink,
                        isSuggest: isSuggest
                    };
                    content.priceText = utils.getPriceNode(content.currency, content.value);
                    isSuggest ? content.barTitle = tbr.language.aroundHotel : content.barTitle = tbr.language.foundHotel;
                    content.dateText = utils.getDateInterval(content.dateIn, content.dateOut);
                    return content;
                };
                var content = getHotelContent(barItem);
                content.suggestList = pricesObj.suggestItemList.map(getHotelContent);
                content.suggestList.sort(function(a, b) {
                    return a.value < b.value ? -1 : 1;
                });
                wrapHotelBarContent(pageInfo, content);
                return content;
            };
            Bar.prototype.getCarsBarContent = function() {
                var _this = this;
                var details = this.details;
                var pageInfo = details.pageInfo;
                var prices = details.prices;
                var getCarsBarItem = function(priceList) {
                    var barItem = null;
                    priceList.forEach(function(item) {
                        (!barItem || barItem.value > item.value) && (barItem = item);
                    });
                    return barItem;
                };
                var barItem = getCarsBarItem(prices.data);
                if (!barItem) {
                    tbr.error("Bar item is not found!", details);
                    return null;
                }
                var content = {
                    value: barItem.converted_value || barItem.value,
                    currency: pageInfo.currency,
                    vehicleName: barItem.vehicleName,
                    pickUpLocName: barItem.pickUpLocName,
                    pickUpLocCode: barItem.pickUpLocCode,
                    pickUpDate: barItem.pickUpDate,
                    dropOffLocName: barItem.dropOffLocName,
                    dropOffLocCode: barItem.dropOffLocCode,
                    dropOffDate: barItem.dropOffDate,
                    url: barItem.url
                };
                content.priceText = utils.create(document.createDocumentFragment(), {
                    append: function() {
                        var nodes = [];
                        if (pageInfo.price > content.value) {
                            _this.styleCss.push({
                                ".tbr-red-price": {
                                    textDecoration: "line-through",
                                    color: "#F44336"
                                }
                            });
                            nodes.push(utils.create("span", {
                                class: [ "tbr-red-price" ],
                                append: [ utils.getPriceNode(content.currency, pageInfo.price) ]
                            }));
                            nodes.push(String.fromCharCode(160));
                        } else tbr.error("Red price is hidden", pageInfo.price, content.value);
                        nodes.push(utils.getPriceNode(content.currency, content.value));
                        return nodes;
                    }()
                });
                content.pickUpText = content.pickUpLocName;
                content.pickUpLocCode && (content.pickUpText += ", " + content.pickUpLocCode);
                content.dropOffText = content.dropOffLocName;
                content.dropOffLocCode && (content.dropOffText += ", " + content.dropOffLocCode);
                content.isOnePoint = content.pickUpText === content.dropOffText;
                if (content.isOnePoint) content.dateText = utils.getDateInterval(content.pickUpDate, content.dropOffDate); else {
                    content.pickUpDateText = utils.getDate(content.pickUpDate, !0);
                    content.dropOffDateText = utils.getDate(content.dropOffDate, !0);
                }
                content.barTitle = tbr.language.foundCars;
                content.open = tbr.language.carsView;
                return content;
            };
            Bar.prototype.getBarContent = function() {
                return "avia" === this.type ? this.getAviaBarContent() : "hotel" === this.type ? this.getHotelBarContent() : "cars" === this.type ? this.getCarsBarContent() : void 0;
            };
            Bar.prototype.insertAviaBar = function() {
                var _this = this;
                var barContent = this.barContent;
                var content = document.createDocumentFragment();
                this.styleCss.push({
                    ".tbr-cell": {
                        display: "inline-block"
                    }
                }, {
                    ".tbr-cell": {
                        display: "-webkit-inline-flex"
                    }
                }, {
                    ".tbr-cell": {
                        display: "inline-flex"
                    }
                });
                this.styleCss.push({
                    ".tbr-title": {
                        fontSize: "20px",
                        fontWeight: "bold",
                        margin: "auto 10px",
                        lineHeight: "23px"
                    }
                });
                content.appendChild(utils.create("div", {
                    class: [ "tbr-cell", "tbr-title" ],
                    style: {
                        verticalAlign: "middle"
                    },
                    append: [ barContent.barTitle ]
                }));
                var flightInfoCell = utils.create("div", {
                    class: [ "tbr-cell" ],
                    style: {
                        verticalAlign: "middle",
                        WebkitFlex: 2,
                        flex: 2,
                        overflow: "hidden"
                    }
                });
                content.appendChild(flightInfoCell);
                var infoBorder = "1px solid rgba(0,0,0,0.10)";
                this.styleCss.push({
                    ".tbr-info": {
                        height: "38px",
                        border: infoBorder,
                        margin: "auto 10px",
                        borderRadius: "19px",
                        padding: "0 15px"
                    }
                });
                var flightInfoWrapper = utils.create("div", {
                    class: [ "tbr-cell", "tbr-info" ],
                    style: {
                        overflow: "hidden"
                    }
                });
                flightInfoCell.appendChild(flightInfoWrapper);
                var pointColor = "#000";
                this.styleCss.push({
                    ".tbr-point": {
                        display: "inline-block",
                        verticalAlign: "middle",
                        margin: "auto 0",
                        textOverflow: "ellipsis",
                        color: pointColor,
                        fontWeight: "bold",
                        fontSize: "14px"
                    }
                });
                var getPoint = function(name) {
                    return utils.create("div", {
                        class: [ "tbr-point" ],
                        style: {
                            overflow: "hidden"
                        },
                        title: name,
                        text: name
                    });
                };
                var flightWrapper = utils.create("div", {
                    class: [ "tbr-cell" ],
                    style: {
                        verticalAlign: "middle",
                        overflow: "hidden",
                        margin: "auto 0",
                        lineHeight: "36px"
                    }
                });
                flightInfoWrapper.appendChild(flightWrapper);
                flightWrapper.appendChild(getPoint(barContent.originName));
                this.styleCss.push({
                    ".tbr-way-icon": {
                        display: "inline-block",
                        verticalAlign: "middle",
                        margin: "auto 6px"
                    },
                    ".tbr-way-icon svg": {
                        display: "block",
                        opacity: .4
                    }
                });
                barContent.isOneWay ? flightWrapper.appendChild(utils.create("div", {
                    class: [ "tbr-way-icon" ],
                    append: this.getOneWaySvg()
                })) : flightWrapper.appendChild(utils.create("div", {
                    class: [ "tbr-way-icon" ],
                    append: this.getTwoWaySvg()
                }));
                flightWrapper.appendChild(getPoint(barContent.destinationName));
                var dateColor = "#978f6c";
                this.styleCss.push({
                    ".tbr-dates": {
                        verticalAlign: "middle",
                        margin: "auto 0 auto 10px",
                        fontSize: "14px",
                        color: dateColor
                    }
                });
                var flightDates = utils.create("div", {
                    class: [ "tbr-cell", "tbr-dates" ]
                });
                flightInfoWrapper.appendChild(flightDates);
                flightDates.appendChild(document.createTextNode(barContent.dateText));
                var barPriceColor = "#4b9f00";
                this.styleCss.push({
                    ".tbr-price": {
                        verticalAlign: "middle",
                        fontSize: "20px",
                        fontWeight: "bold",
                        margin: "auto 10px",
                        lineHeight: "23px",
                        color: barPriceColor
                    }
                });
                this.styleCss.push({
                    ".tbr-price *": {
                        fontWeight: "inherit",
                        fontSize: "inherit",
                        lineHeight: "inherit"
                    }
                });
                content.appendChild(utils.create("div", {
                    class: [ "tbr-cell", "tbr-price" ],
                    append: [ barContent.priceText ]
                }));
                var barMoreBtnColor = "#4b9f00";
                var barMoreBtnOverColor = "#66ad26";
                var barMoreColor = "#FFF";
                barMoreBtnColor += " !important";
                barMoreBtnOverColor += " !important";
                barMoreColor += " !important";
                this.styleCss.push({
                    ".tbr-open-btn": {
                        verticalAlign: "middle",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: barMoreColor,
                        margin: "auto 10px",
                        padding: "10px 25px",
                        backgroundColor: barMoreBtnColor,
                        borderRadius: "19px",
                        textDecoration: "none !important"
                    },
                    ".tbr-open-btn:hover": {
                        backgroundColor: barMoreBtnOverColor,
                        color: barMoreColor
                    }
                });
                var moreBtn = null;
                content.appendChild(moreBtn = utils.create("a", {
                    class: [ "tbr-cell", "tbr-open-btn" ],
                    href: barContent.url,
                    target: "_blank",
                    append: [ barContent.open ],
                    on: [ "click", function(e) {
                        e.stopPropagation();
                        _this.content.onClick();
                    } ]
                }));
                this.styleCss.push({
                    media: "@media only screen and (max-width: 1150px)",
                    append: [ {
                        ".tbr-content": {
                            maxWidth: "960px"
                        },
                        ".tbr-title": {
                            fontSize: "18px"
                        }
                    } ]
                });
                this.styleCss.push({
                    media: "@media only screen and (max-width: 1050px)",
                    append: [ {
                        ".tbr-content": {
                            maxWidth: "810px"
                        },
                        ".tbr-close-btn": {
                            width: "24px"
                        },
                        ".tbr-right-padding": {
                            width: "24px"
                        },
                        ".tbr-title": {
                            fontSize: "14px",
                            marginLeft: "5px",
                            marginRight: "5px"
                        },
                        ".tbr-info": {
                            marginLeft: "5px",
                            marginRight: "5px",
                            paddingLeft: "5px",
                            paddingRight: "5px"
                        },
                        ".tbr-dates": {
                            marginLeft: "5px",
                            marginRight: "5px"
                        },
                        ".tbr-price": {
                            fontSize: "16px",
                            marginLeft: "5px",
                            marginRight: "5px"
                        },
                        ".tbr-open-btn": {
                            fontSize: "14px",
                            marginLeft: "5px",
                            marginRight: "5px",
                            paddingLeft: "10px",
                            paddingRight: "10px"
                        }
                    } ]
                });
                this.styleCss.push({
                    media: "@media only screen and (max-width: 850px)",
                    append: [ {
                        ".tbr-content": {
                            maxWidth: "700px"
                        }
                    } ]
                });
                var onAppend = function() {
                    tbr.emit("track", {
                        cd: "flightshow",
                        t: "screenview"
                    });
                    tbr.emit("track", {
                        ec: "cheapflight",
                        ea: "show",
                        el: _this.hostname,
                        cd: "flightshow",
                        t: "event"
                    });
                    if (barContent.isCalendar) tbr.emit("track", {
                        cd: "flight_calendar_show",
                        t: "screenview"
                    }); else {
                        _this.trackByVendor({
                            ec: "cheapflight",
                            ea: "show",
                            el: _this.hostname,
                            cd: "flightshow",
                            t: "event"
                        });
                        tbr.emit("track", {
                            cd: "flight_betterprice_show",
                            t: "screenview"
                        });
                    }
                };
                var onReplace = function() {
                    tbr.emit("track", {
                        ec: "cheapflight",
                        ea: "update",
                        el: _this.hostname,
                        t: "event"
                    });
                    if (barContent.isCalendar) tbr.emit("track", {
                        cd: "flight_calendar_update",
                        t: "screenview"
                    }); else {
                        _this.trackByVendor({
                            ec: "cheapflight",
                            ea: "update",
                            el: _this.hostname,
                            t: "event"
                        });
                        tbr.emit("track", {
                            cd: "flight_betterprice_update",
                            t: "screenview"
                        });
                    }
                };
                var onShow = function() {
                    barContent.isCalendar && tbr.emit("track", {
                        ec: "cheapflight",
                        ea: "calendarPrice",
                        el: _this.hostname,
                        t: "event"
                    });
                };
                var onClick = function() {
                    tbr.emit("track", {
                        cd: "flightclick",
                        t: "screenview"
                    });
                    tbr.emit("track", {
                        ec: "cheapflight",
                        ea: "click",
                        el: _this.hostname,
                        cd: "flightclick",
                        t: "event"
                    });
                    if (barContent.isCalendar) {
                        tbr.emit("track", {
                            cd: "flight_calendar_click",
                            t: "screenview"
                        });
                        tbr.emit("track", {
                            ec: "cheapflight",
                            ea: "calendarclick",
                            el: _this.hostname,
                            cd: "flight_calendar_click",
                            t: "event"
                        });
                    } else {
                        tbr.emit("track", {
                            cd: "flight_betterprice_click",
                            t: "screenview"
                        });
                        tbr.emit("track", {
                            ec: "cheapflight",
                            ea: "betterpriceclick",
                            el: _this.hostname,
                            cd: "flight_betterprice_click",
                            t: "event"
                        });
                        _this.trackByVendor({
                            ec: "cheapflight",
                            ea: "betterpriceclick",
                            el: _this.hostname,
                            cd: "flight_betterprice_click",
                            t: "event"
                        });
                    }
                };
                var onClose = function() {
                    tbr.emit("track", {
                        ec: "cheapflight",
                        ea: "close",
                        el: _this.hostname,
                        t: "event"
                    });
                    _this.trackByVendor({
                        ec: "cheapflight",
                        ea: "close",
                        el: _this.hostname,
                        t: "event"
                    });
                };
                return {
                    node: content,
                    moreBtn: moreBtn,
                    onAppend: onAppend,
                    onReplace: onReplace,
                    onShow: onShow,
                    onClick: onClick,
                    onClose: onClose
                };
            };
            Bar.prototype.insertCarsBar = function() {
                var _this = this;
                var barContent = this.barContent;
                var content = document.createDocumentFragment();
                this.styleCss.push({
                    ".tbr-cell": {
                        display: "inline-block",
                        verticalAlign: "middle",
                        margin: "auto 5px"
                    }
                }, {
                    ".tbr-cell": {
                        display: "-webkit-inline-flex"
                    }
                }, {
                    ".tbr-cell": {
                        display: "inline-flex"
                    }
                });
                this.styleCss.push({
                    ".tbr-title": {
                        fontSize: "20px",
                        margin: "auto 10px"
                    }
                });
                content.appendChild(utils.create("div", {
                    class: [ "tbr-cell", "tbr-title" ],
                    append: [ barContent.barTitle ]
                }));
                this.styleCss.push({
                    ".tbr-point-cell": {
                        WebkitFlexDirection: "column",
                        flexDirection: "column"
                    }
                });
                if (barContent.isOnePoint) {
                    this.styleCss.push({
                        ".tbr-line-date-cell": {
                            color: "#666"
                        }
                    });
                    content.appendChild(utils.create("div", {
                        class: [ "tbr-cell", "tbr-point-cell" ],
                        append: [ utils.create("div", {
                            text: barContent.pickUpText
                        }), utils.create("div", {
                            class: [ "tbr-line-date-cell" ],
                            text: barContent.dateText
                        }) ]
                    }));
                } else {
                    content.appendChild(utils.create("div", {
                        class: [ "tbr-cell", "tbr-point-cell" ],
                        append: [ utils.create("div", {
                            text: barContent.pickUpText
                        }), utils.create("div", {
                            text: barContent.dropOffText
                        }) ]
                    }));
                    this.styleCss.push({
                        ".tbr-date-cell": {
                            marginLeft: 0,
                            color: "#666"
                        }
                    });
                    content.appendChild(utils.create("div", {
                        class: [ "tbr-cell", "tbr-point-cell", "tbr-date-cell" ],
                        append: [ utils.create("div", {
                            text: barContent.pickUpDateText
                        }), utils.create("div", {
                            text: barContent.dropOffDateText
                        }) ]
                    }));
                }
                this.styleCss.push({
                    ".tbr-car-cell": {
                        WebkitFlexGrow: 1,
                        flexGrow: 1,
                        margin: "auto 10px",
                        fontWeight: "bold",
                        fontSize: "18px",
                        overflow: "hidden"
                    },
                    ".tbr-car-cell > span": {
                        textOverflow: "ellipsis",
                        overflow: "hidden"
                    }
                });
                var car = utils.create("div", {
                    class: [ "tbr-cell", "tbr-car-cell" ],
                    append: [ utils.create("span", {
                        text: barContent.vehicleName
                    }) ]
                });
                content.appendChild(car);
                var barPriceColor = "#4b9f00";
                this.styleCss.push({
                    ".tbr-price": {
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: barPriceColor
                    }
                });
                this.styleCss.push({
                    ".tbr-price *": {
                        fontWeight: "inherit",
                        fontSize: "inherit",
                        lineHeight: "inherit"
                    }
                });
                content.appendChild(utils.create("div", {
                    class: [ "tbr-cell", "tbr-price" ],
                    append: [ barContent.priceText ]
                }));
                var barMoreBtnColor = "#4b9f00";
                var barMoreBtnOverColor = "#66ad26";
                var barMoreColor = "#FFF";
                barMoreBtnColor += " !important";
                barMoreBtnOverColor += " !important";
                barMoreColor += " !important";
                this.styleCss.push({
                    ".tbr-open-btn": {
                        fontSize: "16px",
                        color: barMoreColor,
                        padding: "10px 20px",
                        backgroundColor: barMoreBtnColor,
                        borderRadius: "19px",
                        textDecoration: "none !important"
                    },
                    ".tbr-open-btn:hover": {
                        backgroundColor: barMoreBtnOverColor,
                        color: barMoreColor
                    }
                });
                var openBtn = null;
                content.appendChild(openBtn = utils.create("a", {
                    class: [ "tbr-cell", "tbr-open-btn" ],
                    href: barContent.url,
                    target: "_blank",
                    append: [ barContent.open ],
                    on: [ "click", function(e) {
                        e.stopPropagation();
                        _this.content.onClick();
                    } ]
                }));
                this.styleCss.push({
                    media: "@media only screen and (max-width: 1150px)",
                    append: [ {
                        ".tbr-content": {
                            maxWidth: "960px"
                        },
                        ".tbr-title": {
                            fontSize: "18px"
                        }
                    } ]
                });
                this.styleCss.push({
                    media: "@media only screen and (max-width: 1050px)",
                    append: [ {
                        ".tbr-content": {
                            maxWidth: "810px"
                        },
                        ".tbr-close-btn": {
                            width: "24px"
                        },
                        ".tbr-right-padding": {
                            width: "24px"
                        },
                        ".tbr-title": {
                            fontSize: "14px",
                            fontWeight: "bold",
                            marginLeft: "5px",
                            marginRight: "5px"
                        },
                        ".tbr-car-cell": {
                            fontSize: "14px",
                            marginLeft: "5px",
                            marginRight: "5px"
                        },
                        ".tbr-price": {
                            fontSize: "16px"
                        },
                        ".tbr-open-btn": {
                            fontSize: "14px",
                            paddingLeft: "10px",
                            paddingRight: "10px"
                        }
                    } ]
                });
                this.styleCss.push({
                    media: "@media only screen and (max-width: 850px)",
                    append: [ {
                        ".tbr-content": {
                            maxWidth: "700px"
                        }
                    } ]
                });
                var onAppend = function() {
                    tbr.emit("track", {
                        cd: "carsshow",
                        t: "screenview"
                    });
                    tbr.emit("track", {
                        ec: "cars",
                        ea: "show",
                        el: _this.hostname,
                        cd: "carsshow",
                        t: "event"
                    });
                };
                var onReplace = function() {
                    tbr.emit("track", {
                        ec: "cars",
                        ea: "update",
                        el: _this.hostname,
                        t: "event"
                    });
                };
                var onShow = function() {};
                var onClick = function() {
                    tbr.emit("track", {
                        cd: "carsclick",
                        t: "screenview"
                    });
                    tbr.emit("track", {
                        ec: "cars",
                        ea: "click",
                        el: _this.hostname,
                        cd: "carsclick",
                        t: "event"
                    });
                };
                var onClose = function() {
                    tbr.emit("track", {
                        ec: "cars",
                        ea: "close",
                        el: _this.hostname,
                        t: "event"
                    });
                };
                return {
                    node: content,
                    moreBtn: openBtn,
                    onAppend: onAppend,
                    onReplace: onReplace,
                    onShow: onShow,
                    onClick: onClick,
                    onClose: onClose
                };
            };
            Bar.prototype.getHotelSuggests = function(suggestList) {
                var _this = this;
                var getLayerPosition = function(moreBtn) {
                    var getPosition = function(node) {
                        var box = node.getBoundingClientRect();
                        return {
                            top: Math.round(box.top),
                            left: Math.round(box.left + window.pageXOffset)
                        };
                    };
                    var getSize = function(node) {
                        return {
                            width: node.offsetWidth,
                            height: node.offsetHeight
                        };
                    };
                    var btnPositionObj = getPosition(moreBtn);
                    var btnSizeObj = getSize(moreBtn);
                    var layerWidth = 720;
                    var layerHeight = 480;
                    var layerTop = btnPositionObj.top + btnSizeObj.height;
                    var layerRight = 10;
                    layerTop += 18;
                    return {
                        width: layerWidth,
                        height: layerHeight,
                        right: layerRight,
                        top: layerTop
                    };
                };
                var createSuggests = function(moreBtn) {
                    var styleCss = [];
                    styleCss.push({
                        ".tbr-layer": {
                            backgroundColor: "#fff",
                            padding: "30px 0",
                            margin: 0,
                            overflow: "auto",
                            boxSizing: "border-box",
                            border: "1px solid #ccc",
                            boxShadow: "0 10px 20px rgba(0,0,0,.4)"
                        },
                        ".tbr-layer__close": {
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            opacity: "0.3"
                        },
                        ".tbr-layer__close:hover": {
                            opacity: "0.7"
                        },
                        ".tbr-suggest": {
                            display: "table",
                            width: "100%",
                            height: "40px",
                            fontSize: "15px",
                            padding: "0 30px",
                            boxSizing: "border-box",
                            cursor: "pointer"
                        },
                        ".tbr-suggest:hover": {
                            backgroundColor: "#fcefb4"
                        },
                        ".tbr-suggest__cell": {
                            display: "table-cell",
                            width: "100px",
                            verticalAlign: "middle",
                            padding: "0 5px",
                            textAlign: "center"
                        },
                        ".tbr-suggest__stars": {
                            width: "90px",
                            paddingTop: "2px"
                        },
                        ".tbr-suggest__date": {
                            width: "150px",
                            fontSize: "14px",
                            color: "#4a4a4a"
                        },
                        ".tbr-suggest__name": {
                            width: "auto",
                            textAlign: "left"
                        },
                        ".tbr-suggest__price": {
                            fontWeight: "bold"
                        },
                        ".tbr-suggest__action": {},
                        "a.tbr-suggest__open-btn": {
                            padding: "6px 15px",
                            color: "#fff !important",
                            backgroundColor: "#4b9f00",
                            borderRadius: "3px",
                            textDecoration: "none",
                            fontWeight: "normal",
                            whiteSpace: "pre"
                        },
                        "a.tbr-suggest__open-btn:hover": {
                            backgroundColor: "#66ad26 !important"
                        }
                    });
                    var updatePosition = function() {
                        var position = getLayerPosition(moreBtn);
                        layer.style.width = position.width + "px";
                        layer.style.maxHeight = position.height + "px";
                        layer.style.right = position.right + "px";
                        layer.style.top = position.top + "px";
                    };
                    var layer = utils.create("div", {
                        class: [ "tbr-layer" ],
                        style: {
                            position: "fixed",
                            zIndex: 99999999,
                            cursor: "default"
                        },
                        on: [ "click", function(e) {
                            e.stopPropagation();
                        } ]
                    });
                    layer.appendChild(utils.create("a", {
                        class: [ "tbr-layer__close" ],
                        href: "#tbr-suggests-close",
                        title: tbr.language.close,
                        append: [ utils.create(_this.getCloseSvg(), {
                            style: {
                                width: "20px",
                                height: "20px"
                            }
                        }) ],
                        on: [ "click", function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            hideLayer();
                        } ]
                    }));
                    var suggests = layer.appendChild(utils.create("div", {
                        class: [ "tbr-suggests" ]
                    }));
                    suggestList.slice(0, 6).forEach(function(item) {
                        var getStar = function(one) {
                            var style = {
                                width: "16px",
                                height: "16px"
                            };
                            one && (style.verticalAlign = "text-bottom");
                            return utils.create(_this.getStarSvg("#F0BE22"), {
                                style: style
                            });
                        };
                        var fullStarsBody = utils.create("span", {
                            class: [ "tbr-suggest__stars-full" ]
                        });
                        for (var i = 0; i < item.stars; i++) fullStarsBody.appendChild(getStar());
                        var link = null;
                        suggests.appendChild(utils.create("div", {
                            class: "tbr-suggest",
                            on: [ "click", function(e) {
                                e.stopPropagation();
                                e.preventDefault();
                                link.dispatchEvent(new MouseEvent("click"));
                            } ],
                            append: [ utils.create("div", {
                                class: [ "tbr-suggest__cell", "tbr-suggest__name" ],
                                text: item.name
                            }), utils.create("div", {
                                class: [ "tbr-suggest__cell", "tbr-suggest__stars" ],
                                append: [ fullStarsBody ]
                            }), utils.create("div", {
                                class: [ "tbr-suggest__cell", "tbr-suggest__date" ],
                                text: item.dateText
                            }), utils.create("div", {
                                class: [ "tbr-suggest__cell", "tbr-suggest__price" ],
                                append: [ item.priceText ]
                            }), utils.create("div", {
                                class: [ "tbr-suggest__cell", "tbr-suggest__action" ],
                                append: [ link = utils.create("a", {
                                    class: [ "tbr-suggest__open-btn" ],
                                    target: "_blank",
                                    href: item.url,
                                    text: item.open,
                                    on: [ "click", function(e) {
                                        e.stopPropagation();
                                        onClick();
                                    } ]
                                }) ]
                            }) ]
                        }));
                    });
                    var style = utils.create("style", {
                        text: utils.style2Text(styleCss)
                    });
                    layer.appendChild(style);
                    var container = document.createDocumentFragment();
                    container.appendChild(layer);
                    rndClassName(container, style);
                    _this.body.node.appendChild(container);
                    var onClick = function() {
                        tbr.emit("track", {
                            cd: "hotelclick",
                            t: "screenview"
                        });
                        tbr.emit("track", {
                            ec: "hotel",
                            ea: "suggestClick",
                            el: _this.hostname,
                            cd: "hotelclick",
                            t: "event"
                        });
                    };
                    var onShow = function() {
                        tbr.emit("track", {
                            ec: "hotel",
                            ea: "suggestsShow",
                            el: _this.hostname,
                            cd: "hotelshow",
                            t: "event"
                        });
                    };
                    var onBodyClick = function() {
                        document.body.removeEventListener("click", onBodyClick);
                        hideLayer();
                    };
                    var showLayer = function() {
                        suggestObj.show = !0;
                        document.body.addEventListener("click", onBodyClick);
                        layer.style.display = "block";
                        updatePosition();
                        onShow();
                    };
                    var hideLayer = function() {
                        suggestObj.show = !1;
                        layer.style.display = "none";
                        clearTimeout(hideTimer);
                    };
                    var onToggle = function() {
                        "none" === layer.style.display ? showLayer() : hideLayer();
                    };
                    var suggestObj = {
                        show: !0,
                        toggle: onToggle
                    };
                    showLayer();
                    var hideTimer = null;
                    var hideOnMouseLeave = function(layer) {
                        layer.addEventListener("mouseenter", function() {
                            clearTimeout(hideTimer);
                        });
                        layer.addEventListener("mouseleave", function() {
                            clearTimeout(hideTimer);
                            hideTimer = setTimeout(function() {
                                suggestObj.show && hideLayer();
                            }, 1500);
                        });
                    };
                    hideOnMouseLeave(layer);
                    return suggestObj;
                };
                var getBtn = function() {
                    _this.styleCss.push({
                        ".tbr-more-btn": {
                            verticalAlign: "middle",
                            fontSize: "14px",
                            fontWeight: "normal !important",
                            color: "#000 !important",
                            margin: "auto 5px",
                            padding: "8px 18px",
                            backgroundColor: "rgba(255, 255, 255, 0.30) !important",
                            borderRadius: "19px",
                            boxShadow: "0 0 1px rgba(0,0,0,0.40)",
                            textDecoration: "none !important"
                        },
                        ".tbr-more-btn:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.70) !important",
                            color: "#000 !important"
                        }
                    });
                    var suggestLayer = null;
                    var closeLocked = !1;
                    var toggleSuggestLayer = function() {
                        suggestLayer ? closeLocked || suggestLayer.toggle() : suggestLayer = createSuggests(moreBtn);
                    };
                    var moreBtn = utils.create("a", {
                        class: [ "tbr-cell", "tbr-more-btn" ],
                        href: "#tbr-suggests",
                        append: [ tbr.language.suggests ],
                        on: [ "click", function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            clearTimeout(showTimer);
                            toggleSuggestLayer();
                        } ]
                    });
                    var showTimer = null;
                    var bindShowOnMouseOver = function(btn) {
                        btn.addEventListener("mouseenter", function() {
                            clearTimeout(showTimer);
                            showTimer = setTimeout(function() {
                                if (!suggestLayer || !suggestLayer.show) {
                                    toggleSuggestLayer();
                                    clearTimeout(closeLocked);
                                    closeLocked = setTimeout(function() {
                                        closeLocked = !1;
                                    }, 500);
                                }
                            }, 250);
                        });
                        btn.addEventListener("mouseleave", function() {
                            clearTimeout(showTimer);
                        });
                    };
                    bindShowOnMouseOver(moreBtn);
                    return moreBtn;
                };
                return getBtn();
            };
            Bar.prototype.insertHotelBar = function() {
                var _this = this;
                var barContent = this.barContent;
                var content = document.createDocumentFragment();
                this.styleCss.push({
                    ".tbr-cell": {
                        display: "inline-block"
                    }
                }, {
                    ".tbr-cell": {
                        display: "-webkit-inline-flex"
                    }
                }, {
                    ".tbr-cell": {
                        display: "inline-flex"
                    }
                });
                this.styleCss.push({
                    ".tbr-title": {
                        fontSize: "20px",
                        fontWeight: "bold",
                        margin: "auto 10px",
                        lineHeight: "23px"
                    }
                });
                content.appendChild(utils.create("div", {
                    class: [ "tbr-cell", "tbr-title" ],
                    style: {
                        verticalAlign: "middle"
                    },
                    append: [ barContent.barTitle ]
                }));
                var hotelInfoCell = utils.create("div", {
                    class: [ "tbr-cell" ],
                    style: {
                        verticalAlign: "middle",
                        WebkitFlex: 2,
                        flex: 2,
                        overflow: "hidden"
                    }
                });
                content.appendChild(hotelInfoCell);
                var infoBorder = "1px solid rgba(0,0,0,0.10)";
                this.styleCss.push({
                    ".tbr-info": {
                        height: "38px",
                        border: infoBorder,
                        margin: "auto 10px",
                        borderRadius: "19px",
                        padding: "0 15px",
                        boxSizing: "border-box",
                        lineHeight: "36px"
                    }
                });
                var hotelColor = "#000";
                this.styleCss.push({
                    ".tbr-hotel": {
                        textOverflow: "ellipsis",
                        margin: "auto",
                        color: hotelColor,
                        fontWeight: "bold",
                        fontSize: "14px"
                    }
                });
                var fullStarsBody = utils.create("span", {
                    class: [ "tbr-stars-full" ]
                });
                var getStar = function(one) {
                    var style = {
                        width: "16px",
                        height: "16px"
                    };
                    one && (style.verticalAlign = "text-bottom");
                    return utils.create(_this.getStarSvg(), {
                        style: style
                    });
                };
                var starText = "";
                for (var i = 0; i < barContent.stars; i++) {
                    fullStarsBody.appendChild(getStar());
                    starText += String.fromCharCode(9733);
                }
                starText && (starText = " " + starText);
                var hotelInfoWrapper = utils.create("div", {
                    class: [ "tbr-cell", "tbr-info" ],
                    style: {
                        overflow: "hidden"
                    },
                    append: [ utils.create("span", {
                        class: [ "tbr-hotel" ],
                        style: {
                            overflow: "hidden"
                        },
                        title: barContent.name + starText,
                        text: barContent.name
                    }) ]
                });
                hotelInfoCell.appendChild(hotelInfoWrapper);
                this.styleCss.push({
                    ".tbr-stars-full": {
                        display: "inline-block",
                        verticalAlign: "middle",
                        margin: "auto 0",
                        marginTop: "3px"
                    }
                });
                hotelInfoWrapper.appendChild(fullStarsBody);
                this.styleCss.push({
                    ".tbr-stars-short": {
                        display: "none",
                        verticalAlign: "middle",
                        margin: "auto 0 auto 5px"
                    }
                });
                if (barContent.stars > 0) {
                    var shortStarsBody = utils.create("span", {
                        class: [ "tbr-stars-short" ],
                        append: [ barContent.stars, getStar(!0) ]
                    });
                    hotelInfoWrapper.appendChild(shortStarsBody);
                }
                var dateColor = "#978f6c";
                this.styleCss.push({
                    ".tbr-dates": {
                        verticalAlign: "middle",
                        margin: "auto 0 auto 10px",
                        fontSize: "14px",
                        color: dateColor
                    }
                });
                var bookingDates = utils.create("div", {
                    class: [ "tbr-cell", "tbr-dates" ],
                    text: barContent.dateText
                });
                hotelInfoWrapper.appendChild(bookingDates);
                var barPriceColor = "#4b9f00";
                this.styleCss.push({
                    ".tbr-price": {
                        verticalAlign: "middle",
                        fontSize: "20px",
                        fontWeight: "bold",
                        margin: "auto 10px",
                        lineHeight: "23px",
                        color: barPriceColor
                    }
                });
                this.styleCss.push({
                    ".tbr-price *": {
                        fontWeight: "inherit",
                        fontSize: "inherit",
                        lineHeight: "inherit"
                    }
                });
                content.appendChild(utils.create("div", {
                    class: [ "tbr-cell", "tbr-price" ],
                    append: [ barContent.priceText ]
                }));
                var barMoreBtnColor = "#4b9f00";
                var barMoreBtnOverColor = "#66ad26";
                var barMoreColor = "#FFF";
                barMoreBtnColor += " !important";
                barMoreBtnOverColor += " !important";
                barMoreColor += " !important";
                this.styleCss.push({
                    ".tbr-open-btn": {
                        verticalAlign: "middle",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: barMoreColor,
                        margin: "auto 10px",
                        padding: "10px 25px",
                        backgroundColor: barMoreBtnColor,
                        borderRadius: "19px",
                        textDecoration: "none"
                    },
                    ".tbr-open-btn:hover": {
                        backgroundColor: barMoreBtnOverColor,
                        color: barMoreColor
                    }
                });
                var moreBtn = null;
                content.appendChild(moreBtn = utils.create("a", {
                    class: [ "tbr-cell", "tbr-open-btn" ],
                    href: barContent.url,
                    target: "_blank",
                    append: [ barContent.open ],
                    on: [ "click", function(e) {
                        e.stopPropagation();
                        _this.content.onClick();
                    } ]
                }));
                if (barContent.suggestList.length) {
                    var suggestsBtn = _this.getHotelSuggests(barContent.suggestList);
                    content.appendChild(suggestsBtn);
                }
                this.styleCss.push({
                    media: "@media only screen and (max-width: 1150px)",
                    append: [ {
                        ".tbr-content": {
                            maxWidth: "960px"
                        },
                        ".tbr-title": {
                            fontSize: "18px"
                        }
                    } ]
                });
                this.styleCss.push({
                    media: "@media only screen and (max-width: 1050px)",
                    append: [ {
                        ".tbr-content": {
                            maxWidth: "810px"
                        },
                        ".tbr-close-btn": {
                            width: "24px"
                        },
                        ".tbr-right-padding": {
                            width: "24px"
                        },
                        ".tbr-title": {
                            fontSize: "14px",
                            marginLeft: "5px",
                            marginRight: "5px"
                        },
                        ".tbr-info": {
                            marginLeft: "5px",
                            marginRight: "5px",
                            paddingLeft: "5px",
                            paddingRight: "5px"
                        },
                        ".tbr-stars-short": {
                            display: "inline-block"
                        },
                        ".tbr-stars-full": {
                            display: "none"
                        },
                        ".tbr-dates": {
                            marginLeft: "5px",
                            marginRight: "5px"
                        },
                        ".tbr-price": {
                            fontSize: "16px",
                            marginLeft: "5px",
                            marginRight: "5px"
                        },
                        ".tbr-open-btn": {
                            fontSize: "14px",
                            marginLeft: "5px",
                            marginRight: "5px",
                            paddingLeft: "10px",
                            paddingRight: "10px"
                        },
                        ".tbr-more-btn": {
                            fontSize: "12px",
                            marginLeft: "2px",
                            marginRight: "2px",
                            paddingLeft: "7px",
                            paddingRight: "7px"
                        }
                    } ]
                });
                this.styleCss.push({
                    media: "@media only screen and (max-width: 850px)",
                    append: [ {
                        ".tbr-content": {
                            maxWidth: "700px"
                        }
                    } ]
                });
                var onAppend = function() {
                    tbr.emit("track", {
                        cd: "hotelshow",
                        t: "screenview"
                    });
                    tbr.emit("track", {
                        ec: "hotel",
                        ea: "show",
                        el: _this.hostname,
                        cd: "hotelshow",
                        t: "event"
                    });
                    if (_this.barContent.isSuggest) {
                        tbr.emit("track", {
                            cd: "hotelNearbyShow",
                            t: "screenview"
                        });
                        tbr.emit("track", {
                            ec: "hotel",
                            ea: "nearbyShow",
                            el: _this.hostname,
                            cd: "hotelNearbyShow",
                            t: "event"
                        });
                    }
                };
                var onReplace = function() {
                    tbr.emit("track", {
                        ec: "hotel",
                        ea: "update",
                        el: _this.hostname,
                        t: "event"
                    });
                    if (_this.barContent.isSuggest) {
                        tbr.emit("track", {
                            cd: "hotelNearbyUpdate",
                            t: "screenview"
                        });
                        tbr.emit("track", {
                            ec: "hotel",
                            ea: "nearbyUpdate",
                            el: _this.hostname,
                            cd: "hotelNearbyUpdate",
                            t: "event"
                        });
                    }
                };
                var onShow = function() {};
                var onClick = function() {
                    tbr.emit("track", {
                        cd: "hotelclick",
                        t: "screenview"
                    });
                    tbr.emit("track", {
                        ec: "hotel",
                        ea: "click",
                        el: _this.hostname,
                        cd: "hotelclick",
                        t: "event"
                    });
                    if (_this.barContent.isSuggest) {
                        tbr.emit("track", {
                            cd: "hotelNearbyClick",
                            t: "screenview"
                        });
                        tbr.emit("track", {
                            ec: "hotel",
                            ea: "nearbyClick",
                            el: _this.hostname,
                            cd: "hotelNearbyClick",
                            t: "event"
                        });
                    }
                };
                var onClose = function() {
                    tbr.emit("track", {
                        ec: "hotel",
                        ea: "close",
                        el: _this.hostname,
                        t: "event"
                    });
                };
                return {
                    node: content,
                    moreBtn: moreBtn,
                    onAppend: onAppend,
                    onReplace: onReplace,
                    onShow: onShow,
                    onClick: onClick,
                    onClose: onClose
                };
            };
            Bar.prototype.getContent = function() {
                return "hotel" === this.type ? this.insertHotelBar() : "avia" === this.type ? this.insertAviaBar() : "cars" === this.type ? this.insertCarsBar() : void 0;
            };
            Bar.prototype.getStyle = function() {
                return {
                    node: utils.create("style", {
                        text: utils.style2Text(this.styleCss)
                    })
                };
            };
            Bar.prototype.getCloseSvg = function() {
                var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                var svgNS = svg.namespaceURI;
                svg.setAttribute("width", "80");
                svg.setAttribute("height", "80");
                svg.setAttribute("viewBox", "0 0 80 80");
                var color = "#000";
                var path = document.createElementNS(svgNS, "path");
                svg.appendChild(path);
                path.setAttribute("fill", color);
                path.setAttribute("d", "M56.971 52.729L44.243 40l12.728-12.728-4.242-4.243L40 35.757 27.272 23.029l-4.243 4.243L35.757 40 23.029 52.729l4.243 4.242L40 44.243l12.729 12.728z");
                return svg;
            };
            Bar.prototype.getOneWaySvg = function() {
                var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                var svgNS = svg.namespaceURI;
                svg.setAttribute("width", "24px");
                svg.setAttribute("height", "24px");
                svg.setAttribute("viewBox", "4 4 24 24");
                var color = "#000";
                var path = document.createElementNS(svgNS, "path");
                svg.appendChild(path);
                path.setAttribute("fill", color);
                path.setAttribute("d", "M4.538 16.618h21.626l-4.48 4.463a.537.537 0 0 0 0 .761c.21.211.551.211.761 0l5.328-5.327a.543.543 0 0 0 0-.762l-5.328-5.327a.537.537 0 0 0-.761 0 .537.537 0 0 0 0 .761l4.48 4.354H4.538a.538.538 0 1 0 0 1.077z");
                return svg;
            };
            Bar.prototype.getTwoWaySvg = function() {
                var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                var svgNS = svg.namespaceURI;
                svg.setAttribute("width", "24px");
                svg.setAttribute("height", "24px");
                svg.setAttribute("viewBox", "4 4 24 24");
                var color = "#000";
                var path = document.createElementNS(svgNS, "path");
                svg.appendChild(path);
                path.setAttribute("fill", color);
                path.setAttribute("d", "M27.391 10.382H5.764l4.481-4.463a.538.538 0 0 0-.761-.761l-5.328 5.328a.542.542 0 0 0 0 .761l5.328 5.328a.538.538 0 0 0 .761-.761L5.764 11.46H27.39a.539.539 0 0 0 .001-1.078zM4.538 21.618h21.626l-4.48 4.463a.537.537 0 0 0 0 .761c.21.211.551.211.761 0l5.328-5.327a.543.543 0 0 0 0-.762l-5.328-5.327a.537.537 0 0 0-.761 0 .537.537 0 0 0 0 .761l4.48 4.354H4.538a.538.538 0 1 0 0 1.077z");
                return svg;
            };
            Bar.prototype.getStarSvg = function(color) {
                var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                var svgNS = svg.namespaceURI;
                svg.setAttribute("width", "24");
                svg.setAttribute("height", "24");
                svg.setAttribute("viewBox", "0 0 24 24");
                color = color || "#000";
                var path = document.createElementNS(svgNS, "path");
                svg.appendChild(path);
                path.setAttribute("fill", color);
                path.setAttribute("d", "M9.362 9.158l-5.268.584c-.19.023-.358.15-.421.343s0 .394.14.521c1.566 1.429 3.919 3.569 3.919 3.569-.002 0-.646 3.113-1.074 5.19a.504.504 0 0 0 .196.506.494.494 0 0 0 .538.027c1.844-1.047 4.606-2.623 4.606-2.623l4.604 2.625c.168.092.379.09.541-.029a.5.5 0 0 0 .195-.505l-1.07-5.191s2.353-2.14 3.918-3.566a.499.499 0 0 0-.279-.865c-2.108-.236-5.27-.586-5.27-.586l-2.183-4.83a.499.499 0 1 0-.909 0l-2.183 4.83z");
                return svg;
            };
            Bar.prototype.getBody = function() {
                var barHeight = 55;
                var _this = this;
                this.styleCss.push({
                    ".tbr-body": utils.styleReset
                });
                var barColor = "#fcefb4";
                var barFontColor = "#000";
                var barOverColor = "#ffeb91";
                this.styleCss.push({
                    ".tbr-body": {
                        backgroundColor: barColor,
                        color: barFontColor,
                        cursor: "pointer",
                        marginTop: "-" + barHeight + "px",
                        display: "table !important",
                        opacity: "1 !important"
                    },
                    ".tbr-body:hover": {
                        backgroundColor: barOverColor
                    }
                });
                this.styleCss.push({
                    ".tbr-close-btn": {
                        width: "45px",
                        opacity: .3
                    }
                });
                this.styleCss.push({
                    ".tbr-close-btn:hover": {
                        opacity: .7
                    }
                });
                this.styleCss.push({
                    ".tbr-right-padding": {
                        width: "45px",
                        opacity: .5
                    }
                });
                this.styleCss.push({
                    ".tbr-content": {
                        maxWidth: "1100px"
                    }
                });
                var content = null;
                var node = utils.create("div", {
                    class: [ "tbr-body" ],
                    style: {
                        position: "fixed",
                        top: 0,
                        left: 0,
                        fontWeight: "normal",
                        font: "normal normal 14px Arial, sans-serif",
                        display: "table",
                        width: "100%",
                        height: "55px",
                        lineHeight: "normal",
                        opacity: 1,
                        zIndex: 99999999
                    },
                    onCreate: function() {
                        this.style.zIndex = 2147483648;
                    },
                    on: [ "click", function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        _this.content.moreBtn.dispatchEvent(new MouseEvent("click"));
                    } ],
                    append: [ utils.create("div", {
                        style: {
                            display: "table-cell",
                            verticalAlign: "middle"
                        },
                        append: utils.create("a", {
                            class: [ "tbr-close-btn" ],
                            href: "#close",
                            title: tbr.language.close,
                            style: {
                                display: "block",
                                height: "45px",
                                textAlign: "center",
                                cursor: "pointer"
                            },
                            on: [ "click", function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                _this.close(!0);
                                _this.content.onClose();
                            } ],
                            append: utils.create(_this.getCloseSvg(), {
                                style: {
                                    marginLeft: "4px",
                                    marginTop: "10px",
                                    width: "24px",
                                    height: "24px"
                                }
                            })
                        })
                    }), utils.create("div", {
                        style: {
                            display: "table-cell",
                            verticalAlign: "middle",
                            textAlign: "center"
                        },
                        append: utils.create("div", {
                            class: [ "tbr-content" ],
                            style: {
                                display: "inline-block",
                                width: "100%",
                                textAlign: "left",
                                position: "relative"
                            },
                            append: content = utils.create("div", {
                                style: {
                                    WebkitAlignItems: "center",
                                    alignItems: "center",
                                    WebkitFlexDirection: "row",
                                    flexDirection: "row",
                                    whiteSpace: "pre"
                                },
                                onCreate: function() {
                                    this.style.display = "block";
                                    this.style.display = "-webkit-flex";
                                    this.style.display = "flex";
                                }
                            })
                        })
                    }), utils.create("div", {
                        class: [ "tbr-right-padding" ],
                        style: {
                            display: "table-cell",
                            verticalAlign: "middle"
                        }
                    }) ]
                });
                return {
                    node: node,
                    content: content
                };
            };
            Bar.prototype.remove = function() {
                if (!this.isRemoved) {
                    this.isRemoved = !0;
                    var parent = this.body.node.parentNode;
                    parent && parent.removeChild(this.body.node);
                    parent = this.style.node.parentNode;
                    parent && parent.removeChild(this.style.node);
                }
            };
            Bar.prototype.insertBody = function(node) {
                var parent = document.body;
                var profile = tbr.currentProfile;
                var selector = profile.bodySelector;
                if (selector) {
                    "function" == typeof selector && (selector = profile.bodySelector());
                    var _parent = document.querySelector(selector);
                    _parent ? parent = _parent : tbr.error("Body insert container is not found!");
                }
                parent.appendChild(node);
            };
            Bar.prototype.insertStyle = function(node) {
                var parent = document.body;
                var profile = tbr.currentProfile;
                var selector = profile.styleSelector;
                if (selector) {
                    "function" == typeof selector && (selector = profile.styleSelector());
                    var _parent = document.querySelector(selector);
                    _parent ? parent = _parent : tbr.error("Style insert container is not found!");
                }
                parent.appendChild(node);
            };
            Bar.prototype.replace = function(newBar) {
                this.isRemoved = !0;
                this.isClosed = !0;
                newBar.body.node.style.marginTop = 0;
                var parent = this.body.node.parentNode;
                parent ? parent.replaceChild(newBar.body.node, this.body.node) : this.insertBody(newBar.body.node);
                parent = this.style.node.parentNode;
                parent ? parent.replaceChild(newBar.style.node, this.style.node) : this.insertStyle(newBar.style.node);
            };
            Bar.prototype.close = function(byUser) {
                var _this = this;
                try {
                    if (!this.isClosed) {
                        this.isClosed = !0;
                        this.remove();
                        marginPage(this, !1);
                        if (byUser) {
                            main.watcher.stopObserver();
                            return api.sendMessage({
                                action: "tbrCloseBar",
                                hostname: _this.hostname
                            });
                        }
                    }
                } catch (err) {
                    tbr.trackError(err);
                }
            };
            return {
                current: null,
                create: function(details) {
                    var previewBar = this.current;
                    var bar = this.current = new Bar(details);
                    var isReplace = !1;
                    if (previewBar && !previewBar.isClosed) {
                        isReplace = !0;
                        previewBar.replace(bar);
                    } else {
                        marginPage(bar, !0);
                        bar.insertBody(bar.body.node);
                        bar.insertStyle(bar.style.node);
                    }
                    isReplace ? bar.content.onReplace() : bar.content.onAppend();
                    bar.content.onShow();
                },
                aviaBarSaveInHistory: function(pageInfo, aviaResponse) {
                    if (tbr.appInfo.history) {
                        var origin = "";
                        var originName = "";
                        var destination = "";
                        var destinationName = "";
                        aviaResponse.data.some(function(item) {
                            origin = item.origin;
                            originName = item.originName;
                            destination = item.destination;
                            destinationName = item.destinationName;
                            return !0;
                        });
                        if (origin && originName && destination && destinationName) {
                            var data = {
                                origin: origin,
                                originCity: originName,
                                destination: destination,
                                destinationCity: destinationName,
                                dateStart: pageInfo.dateStart,
                                dateEnd: pageInfo.dateEnd,
                                time: parseInt(Date.now() / 1e3)
                            };
                            return tbr.emit("history", data);
                        }
                    }
                }
            };
        };
        module.exports = getBarUi;
    }).call(exports, __webpack_require__(8), __webpack_require__(2), __webpack_require__(18), __webpack_require__(1));
}, function(module, exports, __webpack_require__) {
    (function(tbr) {
        module.exports = function(utils) {
            var cultureInfo = {
                ru: {
                    weekdaysShort: "Вс_Пн_Вт_Ср_Чт_Пт_Сб".split("_"),
                    months: "января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря".split("_"),
                    monthsCal: "январе_феврале_марте_апреле_мае_июне_июле_августе_сентябре_октябре_ноябре_декабре".split("_"),
                    monthsShort: "янв._февр._мар._апр._мая_июн._июл._авг._сент._окт._нояб._дек.".split("_"),
                    dateFormat: "d MMMM, E",
                    dateFormatNoWeekdays: "d MMMM",
                    timeFormat: "H:mm",
                    dateTimeFormat: "d MMM, H:mm",
                    dateIntervalFormat: "d — d MMMM",
                    dateMonthIntervalFormat: "d MMM — d MMM"
                },
                en: {
                    weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
                    months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
                    monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
                    dateFormat: "MMMM d, E",
                    dateFormatNoWeekdays: "MMMM d",
                    timeFormat: "h:mm a",
                    dateTimeFormat: "MMM d, h:mm a",
                    dateIntervalFormat: "MMMM d — d",
                    dateMonthIntervalFormat: "d MMM — d MMM"
                },
                de: {
                    weekdaysShort: "So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),
                    months: "Jänner_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
                    monthsShort: "Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.".split("_"),
                    dateFormat: "E, d. MMMM",
                    dateFormatNoWeekdays: "d. MMMM",
                    timeFormat: "H:mm",
                    dateTimeFormat: "d. MMM, H:mm",
                    dateIntervalFormat: "d. — d. MMMM",
                    dateMonthIntervalFormat: "d. MMM — d. MMM"
                }
            };
            var ccyFormats = {
                USD: {
                    symbol: "$",
                    standard: "¤#,##0.00",
                    details: {
                        symbolRight: !1,
                        symbolSep: "",
                        toFixed: 2,
                        round: !1,
                        group: ",",
                        decimal: "."
                    }
                },
                EUR: {
                    symbol: "€",
                    standard: "#,##0.00 ¤",
                    details: {
                        symbolRight: !0,
                        symbolSep: " ",
                        toFixed: 2,
                        round: !1,
                        group: ".",
                        decimal: ","
                    }
                },
                RUB: {
                    symbol: "₽",
                    standard: "#,##0.00 ¤",
                    details: {
                        symbolRight: !0,
                        symbolSep: " ",
                        toFixed: 2,
                        round: !0,
                        group: " ",
                        decimal: ","
                    },
                    getNode: function() {
                        var link = document.querySelector("link.sf-price-font");
                        if (!link) {
                            link = utils.create("link", {
                                class: "sf-price-font",
                                href: "https://fonts.googleapis.com/css?family=PT+Sans:bold",
                                rel: "stylesheet",
                                type: "text/css"
                            });
                            document.head.appendChild(link);
                        }
                        return utils.create("span", {
                            text: this.symbol,
                            style: {
                                fontFamily: '"PT Sans", Arial, serif'
                            }
                        });
                    }
                },
                BYR: {
                    symbol: "р.",
                    standard: "#,##0.00 ¤",
                    details: {
                        symbolRight: !0,
                        symbolSep: " ",
                        toFixed: 2,
                        round: !0,
                        group: " ",
                        decimal: ","
                    }
                },
                BYN: {
                    symbol: "р.",
                    standard: "#,##0.00 ¤",
                    details: {
                        symbolRight: !0,
                        symbolSep: " ",
                        toFixed: 2,
                        round: !0,
                        group: " ",
                        decimal: ","
                    }
                },
                KZT: {
                    symbol: "T",
                    standard: "#,##0.00 ¤",
                    details: {
                        symbolRight: !0,
                        symbolSep: " ",
                        toFixed: 2,
                        round: !0,
                        group: " ",
                        decimal: ","
                    }
                },
                UAH: {
                    symbol: "₴",
                    standard: "#,##0.00 ¤",
                    details: {
                        symbolRight: !0,
                        symbolSep: " ",
                        toFixed: 2,
                        round: !0,
                        group: " ",
                        decimal: ","
                    }
                },
                THB: {
                    symbol: "฿",
                    details: {
                        symbolRight: !1,
                        symbolSep: "",
                        toFixed: 2,
                        round: !0,
                        group: ",",
                        decimal: "."
                    }
                }
            };
            var dateTemplateParse = function(template, culture, time, time2) {
                var h;
                var dbl = {};
                template = template.replace(/([a-zA-Z]+)/g, function(text, value) {
                    var timeItem = null;
                    if (time2) if (dbl[value]) timeItem = time2; else {
                        dbl[value] = !0;
                        timeItem = time;
                    } else timeItem = time;
                    switch (value) {
                      case "d":
                        return timeItem.getUTCDate();

                      case "MMMM":
                        return culture.months[timeItem.getUTCMonth()];

                      case "MMM":
                        return culture.monthsShort[timeItem.getUTCMonth()];

                      case "h":
                        h = timeItem.getUTCHours();
                        h %= 12;
                        h || (h = 12);
                        return h;

                      case "H":
                        return timeItem.getUTCHours();

                      case "mm":
                        var m = timeItem.getUTCMinutes();
                        m < 10 && (m = "0" + m);
                        return m;

                      case "a":
                        var a = "AM";
                        h = timeItem.getUTCHours();
                        h >= 12 && (a = "PM");
                        return a;

                      case "E":
                        return culture.weekdaysShort[timeItem.getUTCDay()];
                    }
                });
                return template;
            };
            var getPrice = function(ccy, value) {
                var cultureCcy = ccyFormats[ccy];
                cultureCcy || (cultureCcy = {
                    symbol: ccy,
                    details: {
                        symbolRight: !0,
                        symbolSep: " ",
                        toFixed: 2,
                        round: !1,
                        group: ",",
                        decimal: "."
                    }
                });
                var details = cultureCcy.details;
                value = details.round ? Math.round(value) : value.toFixed(details.toFixed);
                var splitValue = value.toString().split(".");
                var b = splitValue[1];
                var fixedValue = "";
                for (var i = 0; i < details.toFixed; i++) fixedValue += "0";
                b === fixedValue && (b = "");
                var a = splitValue[0];
                a = a.split("").reverse().join("");
                a = a.replace(/(\d{3})/g, "$1,");
                a = a.split("").reverse().join("");
                "," === a[0] && (a = a.substr(1));
                a = a.split(",");
                a = a.join(details.group);
                splitValue = [ a ];
                b && splitValue.push(b);
                var strValue = splitValue.join(details.decimal);
                var arr = [ strValue ];
                if (details.symbolRight) {
                    details.symbolSep && arr.push(details.symbolSep);
                    arr.push(cultureCcy.symbol);
                } else {
                    details.symbolSep && arr.unshift(details.symbolSep);
                    arr.unshift(cultureCcy.symbol);
                }
                var strValueSymbol = arr.join("");
                return {
                    string: strValueSymbol,
                    value: strValue,
                    cultureCcy: cultureCcy
                };
            };
            var getNewDate = function(_date) {
                var date = _date;
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(_date) && (date = _date + "Z");
                return new Date(date);
            };
            utils.getCityName = function(cityCode) {
                return tbr.main.avia.getCityName(cityCode);
            };
            utils.getDate = function(value, noWeekdays, isShort) {
                var time = getNewDate(value);
                var culture = cultureInfo[tbr.language.lang] || cultureInfo.en;
                var template = culture.dateFormat;
                noWeekdays && (template = culture.dateFormatNoWeekdays);
                isShort && (template = "d");
                template = dateTemplateParse(template, culture, time);
                return template;
            };
            utils.getCalMonth = function(value) {
                var time = getNewDate(value);
                var culture = cultureInfo[tbr.language.lang] || cultureInfo.en;
                return (culture.monthsCal || culture.months)[time.getUTCMonth()];
            };
            utils.getDateTime = function(value) {
                var time = getNewDate(value);
                var culture = cultureInfo[tbr.language.lang] || cultureInfo.en;
                var template = culture.dateTimeFormat;
                template = dateTemplateParse(template, culture, time);
                return template;
            };
            utils.getDateInterval = function(valueA, valueB) {
                var timeA = getNewDate(valueA);
                var timeB = getNewDate(valueB);
                var culture = cultureInfo[tbr.language.lang] || cultureInfo.en;
                var template = null;
                template = timeA.getUTCFullYear() === timeB.getUTCFullYear() && timeA.getUTCMonth() === timeB.getUTCMonth() ? culture.dateIntervalFormat : culture.dateMonthIntervalFormat;
                template = dateTemplateParse(template, culture, timeA, timeB);
                return template;
            };
            utils.getPriceNode = function(currency, value) {
                var priceObj = getPrice(currency, value);
                var cultureCcy = priceObj.cultureCcy;
                var details = cultureCcy.details;
                var getSymbol = function() {
                    return cultureCcy.getNode ? cultureCcy.getNode() : cultureCcy.symbol;
                };
                var symbolSep = details.symbolSep;
                " " === symbolSep && (symbolSep = String.fromCharCode(160));
                var arr = [ priceObj.value ];
                if (details.symbolRight) {
                    symbolSep && arr.push(symbolSep);
                    arr.push(getSymbol());
                } else {
                    symbolSep && arr.unshift(symbolSep);
                    arr.unshift(getSymbol());
                }
                return utils.create(document.createDocumentFragment(), {
                    append: arr
                });
            };
        };
    }).call(exports, __webpack_require__(8));
}, function(module, exports, __webpack_require__) {
    (function(tbr, utils, Promise) {
        var getWatcher = function() {
            var main = tbr.main;
            var watchTemplateObj = {
                price: function(profile, summary, item) {
                    var page = profile.page;
                    item.key || (item.key = "price");
                    for (var node, n = 0; node = summary.added[n]; n++) {
                        var price = utils.preparePrice(node.textContent);
                        page.setPrice(item.key, price);
                    }
                },
                currency: function(profile, summary, item) {
                    var page = profile.page;
                    item.key || (item.key = "currency");
                    for (var node, n = 0; node = summary.added[n]; n++) {
                        var text = node.textContent;
                        var ccy = text && text.replace(/[\s\t]/g, "");
                        item.currencyMap && item.currencyMap[ccy] && (ccy = item.currencyMap[ccy]);
                        page.set(item.key, ccy);
                    }
                }
            };
            var Page = function(profile) {
                var _this = this;
                var type = null;
                var params = {};
                var priceObj = {};
                var getPriceObj = function(priceId) {
                    var obj = priceObj[priceId];
                    obj || (priceObj[priceId] = obj = {});
                    return obj;
                };
                var removePrice = function() {
                    for (var key in priceObj) delete priceObj[key];
                };
                var isEq = function(a, b) {
                    return Array.isArray(a) && b ? JSON.stringify(a) === JSON.stringify(b) : a === b;
                };
                var onFormChange = function() {
                    if (type) {
                        var priceId = main[type].page.getPriceId(params);
                        var info = getInfoObj();
                        delete info.barRequestData;
                        removePrice();
                        priceId ? profile.matchPrice = !0 : profile.matchPrice = !1;
                    }
                };
                var onPriceChange = utils.debounce(function(priceParams) {
                    var data = main[type].page.getData(params, priceParams);
                    data && _this.setData(type, data);
                }, 50);
                this.setData = function(type, params) {
                    params.type = type;
                    var info = getInfoObj();
                    for (var key in params) info[key] = params[key];
                    onGetPageInfo(params);
                };
                this.setType = function(theType) {
                    type = theType;
                };
                this.set = function(key, value) {
                    value = utils.validate(key, value);
                    var cValue = params[key];
                    if (!isEq(value, cValue)) {
                        params[key] = value;
                        tbr.log("Page set", key, value);
                        onFormChange();
                    }
                };
                this.get = function(key) {
                    return params[key] || null;
                };
                this.setPrice = function(key, value) {
                    value = utils.validate(key, value);
                    if (!value) return tbr.error("setPrice error, value is not valid", key, value);
                    if (!type) return tbr.error("setPrice error, type is not found!", params);
                    var priceId = main[type].page.getPriceId(params);
                    var data = getPriceObj(priceId);
                    var cValue = data[key];
                    if (value && cValue !== value && (!cValue || cValue > value)) {
                        data[key] = value;
                        tbr.log("Page setPrice", key, value);
                        onPriceChange(data);
                    }
                };
                this.clear = function() {
                    tbr.log("Page clear");
                    profile.matchPrice = !1;
                    type = null;
                    for (var key in params) params[key] = null;
                };
            };
            var Watcher = function(profile, watchObj) {
                var observer = null;
                var watch = function(profile, watchObj) {
                    var queries = [];
                    var keys = [];
                    Object.keys(watchObj).forEach(function(key) {
                        var query = watchObj[key].query;
                        Array.isArray(query) || (query = [ query ]);
                        return query.forEach(function(query) {
                            keys.push(key);
                            queries.push(query);
                        });
                    });
                    return utils.mutationWatcher.run({
                        callback: function(summaryList) {
                            for (var summary, i = 0; summary = summaryList[i]; i++) if (0 !== summary.added.length || 0 !== summary.removed.length) {
                                var item = watchObj[keys[i]];
                                profile.summaryStack.push([ item, summary ]);
                            }
                        },
                        queries: queries
                    });
                };
                this.stop = function() {
                    observer && observer.stop();
                    observer = null;
                };
                this.start = function() {
                    observer && observer.stop();
                    observer = watch(profile, watchObj);
                };
                this.destroy = this.stop;
            };
            var SummaryStack = function(profile) {
                var _this = this;
                var stack = [];
                var templateObj = watchTemplateObj;
                var next = function() {
                    var stackItem = stack[0];
                    if (stackItem) {
                        var item = stackItem[0];
                        var summary = stackItem[1];
                        var promise = Promise.resolve();
                        if (!item.isPrice || profile.matchPrice) {
                            item.cb && (promise = promise.then(function() {
                                return item.cb(profile, summary);
                            }));
                            item.template && (promise = promise.then(function() {
                                var template = templateObj[item.template];
                                return template(profile, summary, item);
                            }));
                        }
                        promise.catch(function(err) {
                            tbr.error("Parse item error!", err);
                            tbr.trackError(err);
                        }).then(function() {
                            var pos = stack.indexOf(stackItem);
                            pos !== -1 && stack.splice(pos, 1);
                            next();
                        });
                    }
                };
                var checkStack = function() {
                    var len = stack.length;
                    len > 30 && stack.shift();
                    if (1 === len) return next();
                };
                _this.push = function(data) {
                    stack.push(data);
                    return checkStack();
                };
            };
            var Profile = function(details) {
                var _this = this;
                var watchObj = {};
                for (var key in details.formWatcher) watchObj[key] = details.formWatcher[key];
                for (var key in details.priceWatcher) {
                    watchObj[key] = details.priceWatcher[key];
                    watchObj[key].isPrice = !0;
                }
                _this.matchPrice = !1;
                _this.summaryStack = new SummaryStack(_this);
                _this.watcher = new Watcher(_this, watchObj);
                _this.page = new Page(_this);
                _this.watcher.start();
                _this.destroy = function() {
                    _this.watcher && _this.watcher.destroy();
                };
            };
            var profile = null;
            var infoList = {};
            var getInfoObj = function() {
                var url = location.href;
                var info = infoList[url];
                info || (info = infoList[url] = {});
                return info;
            };
            var onGetPageInfo = function() {
                var pageInfo = getInfoObj();
                var obj = main[pageInfo.type];
                return obj ? obj.onGetData(pageInfo) : tbr.error("Type is not found!", pageInfo);
            };
            return {
                closeCurrentBar: function() {
                    var currentBar = main.bar.current;
                    main.bar.isAborted = !0;
                    currentBar && !currentBar.isClosed && currentBar.close();
                },
                stopObserver: function() {
                    profile && profile.destroy();
                },
                clearInfoObj: function(pageInfo) {
                    for (var url in infoList) infoList[url] !== pageInfo && delete infoList[url];
                },
                initProfile: function(profileDetails) {
                    profile && profile.destroy();
                    profile = new Profile(profileDetails);
                }
            };
        };
        module.exports = getWatcher;
    }).call(exports, __webpack_require__(8), __webpack_require__(2), __webpack_require__(19));
}, function(module, exports, __webpack_require__) {
    (function(Promise, tbr) {
        module.exports = function(utils) {
            utils.waitResponse = function(delay, limit, fn) {
                return new Promise(function(resolve) {
                    var waitResponse = utils.waitResponse;
                    (function timer(retry) {
                        tbr.log("waitResponse retry", retry);
                        waitResponse.timer && clearTimeout(waitResponse.timer);
                        if (!(retry < 0)) return fn(function(err) {
                            if (err) waitResponse.timer = setTimeout(function() {
                                waitResponse.timer = null;
                                return timer(--retry);
                            }, delay); else {
                                tbr.log("waitResponse get response!");
                                resolve();
                            }
                        });
                        tbr.error("waitResponse response is empty!");
                        resolve();
                    })(limit);
                });
            };
            utils.getParamsFromPage = function(varList) {
                return new Promise(function(resolve) {
                    var isObjMode = !1;
                    if ("object" == typeof varList && !Array.isArray(varList)) {
                        isObjMode = Object.keys(varList);
                        varList = isObjMode.map(function(key) {
                            return varList[key];
                        });
                    }
                    utils.bridge({
                        args: [ varList ],
                        func: function(varList, cb) {
                            var rList = [];
                            varList.forEach(function(item) {
                                var path = item;
                                var args = null;
                                if ("string" != typeof path) {
                                    path = item.path;
                                    args = item.args;
                                }
                                var vars = path.split(".");
                                var obj;
                                var key;
                                var result = window;
                                for (;vars.length; ) {
                                    obj = result;
                                    key = vars.shift();
                                    try {
                                        result = obj[key];
                                    } catch (e) {
                                        result = null;
                                        console.error("Bridge error", e);
                                        break;
                                    }
                                }
                                if (args) try {
                                    result = obj[key].apply(obj, args);
                                } catch (e) {
                                    result = null;
                                }
                                rList.push(result);
                            });
                            return cb(rList);
                        },
                        cb: function(_data) {
                            var data = _data;
                            if (isObjMode) {
                                data = {};
                                _data && _data.forEach(function(item, index) {
                                    data[isObjMode[index]] = item;
                                });
                            }
                            return resolve(data);
                        }
                    });
                });
            };
            utils.validatorMap = {
                origin: "validateIataCode",
                destination: "validateIataCode",
                pickUpLocationId: "validateIataCode",
                dropOffLocationId: "validateIataCode",
                dateStart: "validateDate",
                dateEnd: "validateDate",
                dateIn: "validateDate",
                dateOut: "validateDate",
                pickUpDate: "validateDateTime",
                dropOffDate: "validateDateTime",
                currency: "validateCcy",
                adults: "validateAdults",
                price: "validatePrice",
                oneDayPrice: "validatePrice",
                minPriceIn: "validatePrice",
                minPriceOut: "validatePrice",
                minPriceBoth: "validatePrice",
                query: "validateQuery",
                dayCount: "validateNumber",
                driverAge: "validateNumber"
            };
            utils.validate = function(key, value) {
                var validateFnName = utils.validatorMap[key];
                validateFnName ? value = utils[validateFnName](value) : tbr.error("validator is not found!", key, value);
                return value;
            };
            utils.validateIataCode = function(value) {
                if (/^[A-Z]{3}$/.test(value)) return value.toUpperCase();
                tbr.error("City validation error!", value);
                return null;
            };
            utils.validateDate = function(value) {
                if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
                if (/^\d{4}-\d{2}$/.test(value)) return value;
                tbr.error("Date validation error!", value);
                return null;
            };
            utils.validateDateTime = function(value) {
                if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
                    tbr.error("DateTime validation error!", value);
                    value = null;
                }
                return value;
            };
            utils.validateCcy = function(value) {
                if (/^[A-Z]{3}$/.test(value)) return value;
                tbr.error("Currency validation error!", value);
                return null;
            };
            utils.validateNumber = function(value) {
                var int = parseInt(value);
                if (isNaN(int)) {
                    tbr.error("Number validation error!", value);
                    return null;
                }
                return int;
            };
            utils.validateAdults = function(value) {
                var int = utils.validateNumber(value);
                if (!int || int < 1) {
                    tbr.error("Adults validation error!", value);
                    return null;
                }
                return int;
            };
            utils.validateQuery = function(value) {
                if (Array.isArray(value) && value.length) return value;
                tbr.error("Query validation error!", value);
                return null;
            };
            utils.validatePrice = function(value) {
                if (!/^\d+(\.\d+)?$/.test(value)) {
                    tbr.error("Price validation error!", value);
                    return null;
                }
                return value;
            };
            utils.preparePrice = function(value) {
                if (!value) {
                    tbr.log("Price is empty!", value);
                    return null;
                }
                value = value.replace(",", ".");
                value = value.replace(/[^\d.]/g, "");
                value = value.replace(/\.(\d{3,})/, "$1");
                var m = value.match(/(\d+)(\.\d+)?/);
                if (!m) {
                    tbr.log("Price is empty 2!", value);
                    return null;
                }
                value = m[1];
                m[2] && (value += m[2]);
                value = parseFloat(value);
                if (isNaN(value)) {
                    tbr.log("Price is NaN!", value);
                    return null;
                }
                return value;
            };
            utils.reFormatDate = function(value, re, template) {
                var result = null;
                var m = re.exec(value);
                m && (result = template.replace(/\$(\d)/g, function(text, index) {
                    return m[index];
                }));
                return result;
            };
            var codeSymbol = {
                USD: "$",
                EUR: "€",
                AZN: "₼",
                GBP: "£",
                CNY: "¥",
                GEL: "₾",
                TRY: "₺",
                RUB: "₽",
                UAH: "₴"
            };
            var fCcyRe = null;
            utils.findCurrency = function(text) {
                if (!fCcyRe) {
                    var words = [];
                    for (var key in codeSymbol) words.push(key, codeSymbol[key]);
                    fCcyRe = new RegExp("(" + words.join("|") + ")");
                }
                var m = fCcyRe.exec(text);
                if (m) for (var key in codeSymbol) if (key === m[1] || codeSymbol[key] === m[1]) return key;
                return null;
            };
        };
    }).call(exports, __webpack_require__(19), __webpack_require__(8));
}, function(module, exports, __webpack_require__) {
    (function(tbr, utils) {
        var getProfileList = function() {
            var main = tbr.main;
            var profileList = {};
            profileList["*://*.skyscanner.*/*"] = function() {
                var details = {
                    locationCheck: function(url) {
                        return /\/transport\/flights\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: "#content-main",
                                is: "added"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                return utils.getParamsFromPage({
                                    origin: "Skyscanner.ComponentContext.originIataCode",
                                    destination: "Skyscanner.ComponentContext.destinationIataCode",
                                    dateStart: "Skyscanner.ComponentContext.outboundDate",
                                    dateEnd: "Skyscanner.ComponentContext.inboundDate",
                                    currency: "Skyscanner.ComponentContext.currency"
                                }).then(function(dataObj) {
                                    page.setType("avia");
                                    page.set("origin", dataObj.origin);
                                    page.set("destination", dataObj.destination);
                                    page.set("dateStart", dataObj.dateStart);
                                    page.set("dateEnd", dataObj.dateEnd);
                                    page.set("currency", dataObj.currency);
                                });
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".card.result .mainquote-price",
                                is: "added"
                            },
                            template: "price"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.momondo.*/*"] = function() {
                var details = {
                    locationCheck: function(url) {
                        return /\/flightsearch\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: [ {
                                css: "#flight-list",
                                is: "added"
                            }, {
                                css: ".results",
                                is: "removed"
                            } ],
                            cb: function(profile) {
                                var page = profile.page;
                                page.setType("avia");
                                var queryString = /#(.+)/.exec(location.href) || /\?(.+)/.exec(location.href);
                                queryString = queryString && queryString[1];
                                if (queryString) {
                                    var params = utils.parseUrl(queryString, {
                                        params: 1
                                    });
                                    page.set("origin", params.SO0);
                                    page.set("destination", params.SD0);
                                    var dateStart = utils.reFormatDate(params.SDP0, /(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1");
                                    page.set("dateStart", dateStart);
                                    var dateEnd = utils.reFormatDate(params.SDP1, /(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1");
                                    page.set("dateEnd", dateEnd);
                                } else page.clear();
                            }
                        },
                        ccy: {
                            query: {
                                css: ".ticketinfo .price .unit",
                                is: "added"
                            },
                            template: "currency"
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".ticketinfo .price .value",
                                is: "added"
                            },
                            template: "price"
                        }
                    },
                    onShow: function(barHeight) {
                        var header = document.querySelector("#mui-header");
                        header && (header.style.marginTop = barHeight + "px");
                    },
                    onHide: function() {
                        var header = document.querySelector("#mui-header");
                        header && (header.style.marginTop = 0);
                    }
                };
                return details;
            };
            profileList["*://*.ozon.travel/*"] = function() {
                var aviaDetails = {
                    locationCheck: function(url) {
                        return /\/flight\/search\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: ".content"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                return utils.getParamsFromPage({
                                    origin: "a.data.SearchParams.CodeFrom1",
                                    destination: "a.data.SearchParams.CodeTo1",
                                    dateStart: "a.data.SearchParams.Date1",
                                    dateEnd: "a.data.SearchParams.Date2",
                                    Date3: "a.data.SearchParams.Date3",
                                    CodeFrom2: "a.data.SearchParams.CodeFrom2",
                                    CodeTo2: "a.data.SearchParams.CodeTo2"
                                }).then(function(dataObj) {
                                    if (dataObj.Date3) {
                                        tbr.error("More two params.");
                                        page.clear();
                                    } else if (!dataObj.CodeFrom2 || dataObj.origin === dataObj.CodeTo2 && dataObj.destination === dataObj.CodeFrom2) {
                                        page.setType("avia");
                                        page.set("origin", dataObj.origin);
                                        page.set("destination", dataObj.destination);
                                        page.set("dateStart", dataObj.dateStart);
                                        page.set("dateEnd", dataObj.dateEnd);
                                    } else {
                                        tbr.error("More one way!", dataObj);
                                        page.clear();
                                    }
                                });
                            }
                        },
                        ccy: {
                            query: {
                                css: ".tariffs .price",
                                is: "added"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                var ccy = document.querySelector('.currency-form .currency-filter input[name="Currency"]');
                                ccy = ccy && ccy.value;
                                if (ccy) {
                                    ccy = ccy.replace(/[\s\t]/g, "");
                                    page.set("currency", ccy);
                                }
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".tariffs .price",
                                is: "added"
                            },
                            template: "price"
                        }
                    }
                };
                var hotelDetails = {
                    locationCheck: function(url) {
                        return /\/hotel_by_accommodation\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: ".hotel-head"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                var params = utils.parseUrl(location.href);
                                var dates = /in(\d{4}-\d{2}-\d{2})out(\d{4}-\d{2}-\d{2})/.exec(location.href);
                                if (params.NumOfRooms && 1 != params.NumOfRooms) tbr.log("More one room", params.NumOfRooms); else {
                                    if (dates) {
                                        params.Dlts || tbr.log("Adults is not found!");
                                        var name = document.querySelector("h1.hotel-head-main-title");
                                        name = name && name.textContent.trim();
                                        page.setType("hotel");
                                        page.set("dateIn", dates[1]);
                                        page.set("dateOut", dates[2]);
                                        page.set("adults", params.Dlts || 2);
                                        document.querySelector(".currency-sign.rouble") && page.set("currency", "RUB");
                                        return utils.getParamsFromPage({
                                            name: "a.data.name",
                                            city: "a.data.cityName"
                                        }).then(function(dataObj) {
                                            var query = [];
                                            name === dataObj.name && (name = null);
                                            dataObj.name ? query.push(dataObj.name) : tbr.log("Hotel name is not found!");
                                            name && query.push(dataObj.name);
                                            dataObj.city ? query.slice(0).forEach(function(name) {
                                                query.push(name + " " + dataObj.city);
                                            }) : tbr.log("Hotel city is not found!");
                                            page.set("query", query);
                                        });
                                    }
                                    tbr.log("Dates is not found!");
                                }
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".tariff .tariff-price .tariff-price-current .tariff-price-current-value"
                            },
                            template: "price"
                        }
                    }
                };
                return [ aviaDetails, hotelDetails ];
            };
            profileList["*://*.onetwotrip.com/*"] = function() {
                var getFormatDate = function(month, date) {
                    var now = new Date();
                    var cYear = now.getFullYear();
                    var cDate = now.getDate();
                    var cMonth = now.getMonth() + 1;
                    var intMonth = parseInt(month);
                    var intDate = parseInt(date);
                    (cMonth > intMonth || cMonth === intMonth && intDate < cDate) && (cYear += 1);
                    return utils.validateDate([ cYear, month, date ].join("-"));
                };
                var aviaDetails = {
                    locationCheck: function(url) {
                        return /\/(?:flights|aviabilety|aviabileti|fluege|vuelos|loty|ucus)/.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: [ {
                                css: "#layout_results",
                                is: "added"
                            }, {
                                css: ".loader",
                                is: "removed"
                            }, {
                                css: "#avia_structure",
                                is: "added"
                            } ],
                            cb: function(profile) {
                                var page = profile.page;
                                page.clear();
                                var params = /#(\d{2})(\d{2})(\w{3})(\w{3})(\d{2})?(\d{2})?/.exec(location.href);
                                var pDateStart;
                                var pDateEnd;
                                var pOrigin;
                                var pDestination;
                                if (params) {
                                    pOrigin = params[3];
                                    pDestination = params[4];
                                    pDateStart = getFormatDate(params[2], params[1]);
                                    params[5] && params[6] && (pDateEnd = getFormatDate(params[6], params[5]));
                                }
                                return utils.getParamsFromPage({
                                    origin: "xcnt_transport_from",
                                    destination: "xcnt_transport_to",
                                    dateStart: "xcnt_transport_depart_date",
                                    dateEnd: "xcnt_transport_return_date",
                                    currency: "tw.currency",
                                    type: "xcnt_transport_type"
                                }).then(function(dataObj) {
                                    if ("air" === dataObj.type) {
                                        page.setType("avia");
                                        if (params) {
                                            page.set("origin", pOrigin);
                                            page.set("destination", pDestination);
                                            page.set("dateStart", pDateStart);
                                            page.set("dateEnd", pDateEnd);
                                        } else {
                                            page.set("origin", dataObj.origin);
                                            page.set("destination", dataObj.destination);
                                            var dateStart = utils.reFormatDate(dataObj.dateStart, /(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
                                            page.set("dateStart", dateStart);
                                            var dateEnd = utils.reFormatDate(dataObj.dateEnd, /(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
                                            page.set("dateEnd", dateEnd);
                                        }
                                        page.set("currency", dataObj.currency);
                                    }
                                });
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".price_button .money-formatted"
                            },
                            template: "price"
                        }
                    },
                    bodySelector: "body",
                    styleSelector: "head",
                    onShow: function(height) {
                        document.body.style.marginTop = height + "px";
                    },
                    onHide: function() {
                        document.body.style.marginTop = 0;
                    }
                };
                var hotelDetails = {
                    locationCheck: function(url) {
                        return /\/hotel\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: ".hotelDetail"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                page.setType("hotel");
                                var params = utils.parseUrl(location.href);
                                page.set("dateIn", params.date_start);
                                page.set("dateOut", params.date_end);
                                var adults = /([0-9]+)/.exec(params.persons);
                                adults = adults && adults[1];
                                page.set("adults", adults);
                                var hotelName = document.querySelector("h1#hc_name");
                                hotelName = hotelName && hotelName.textContent.trim();
                                if (hotelName) {
                                    var query = [];
                                    query.push(hotelName);
                                    var city = document.querySelector(".hc_address span");
                                    city = city && city.textContent.trim();
                                    city && query.push(hotelName + " " + city);
                                    page.set("query", query);
                                    return utils.getParamsFromPage({
                                        currency: "tw.bonus.currency"
                                    }).then(function(dataObj) {
                                        page.set("currency", params.display_currency || dataObj.currency);
                                    });
                                }
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: "#rooms .oViews .offer .priceContent .price > .number > em > .leftNumber"
                            },
                            cb: function(profile, summary) {
                                var page = profile.page;
                                var ccy = document.querySelector("#labelPerson .link3.selected[data-num]");
                                ccy = ccy && ccy.dataset.num;
                                if (ccy) {
                                    page.set("currency", ccy);
                                    var type = document.querySelector("#labelPerson .link.selected[data-num]");
                                    type = type && type.dataset.num;
                                    if (type) {
                                        type = 0 == type ? "oneDayPrice" : "price";
                                        for (var node, n = 0; node = summary.added[n]; n++) {
                                            var price = utils.preparePrice(node.textContent);
                                            page.setPrice(type, price);
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                return [ aviaDetails, hotelDetails ];
            };
            profileList["*://*.kayak.*/*"] = function() {
                var details = {
                    locationCheck: function(url) {
                        return /\/flights\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: [ "#resbody", "#searchResultsList" ]
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                var params = /flights\/(\w{3})-(\w{3})\/(\d{4}-\d{2}-\d{2})(?:\/(\d{4}-\d{2}-\d{2}))?(?:\/(\w{3})-\w{3})?/.exec(location.href);
                                if (params && !params[5]) return utils.getParamsFromPage({
                                    origin: "R9.globals.analytics.pixelContext.originCode",
                                    destination: "R9.globals.analytics.pixelContext.destinationCode",
                                    dateStart: "R9.globals.analytics.pixelContext.departureDate",
                                    dateEnd: "R9.globals.analytics.pixelContext.returnDate",
                                    currency: "R9.globals.analytics.pixelContext.site_currency",
                                    tripType: "R9.globals.analytics.pixelContext.roundTrip",
                                    dateStartEn: "R9.globals.analytics.pixelContext.depart_date",
                                    dateEndEn: "R9.globals.analytics.pixelContext.return_date"
                                }).then(function(dataObj) {
                                    page.setType("avia");
                                    if (params) {
                                        page.set("origin", params[1]);
                                        page.set("destination", params[2]);
                                        page.set("dateStart", params[3]);
                                        page.set("dateEnd", params[4]);
                                    } else {
                                        page.set("origin", dataObj.origin);
                                        page.set("destination", dataObj.destination);
                                        var dateStart = dataObj.dateStart || dataObj.dateStartEn;
                                        dateStart = utils.reFormatDate(dateStart, /(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3");
                                        page.set("dateStart", dateStart);
                                        var dateEnd = dataObj.dateEnd || dataObj.dateEndEn;
                                        dateEnd = utils.reFormatDate(dateEnd, /(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3");
                                        page.set("dateEnd", dateEnd);
                                    }
                                    page.set("currency", dataObj.currency);
                                });
                                main.watcher.closeCurrentBar();
                                page.clear();
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: [ ".flightresult .results_price", ".book-price .bigPrice" ]
                            },
                            template: "price"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.travelocity.com/*"] = profileList["*://*.orbitz.com/*"] = profileList["*://*.expedia.com/*"] = function() {
                var getAvia = function() {
                    return {
                        locationCheck: function(url) {
                            return /\/Flights-Search/.test(url);
                        },
                        formWatcher: {
                            ctr: {
                                query: {
                                    css: "#flightModuleList"
                                },
                                cb: function(profile) {
                                    var page = profile.page;
                                    return utils.getParamsFromPage({
                                        origin: "IntentMediaProperties.flight_origin",
                                        destination: "IntentMediaProperties.flight_destination",
                                        dateStart: "IntentMediaProperties.travel_date_start",
                                        dateEnd: "IntentMediaProperties.travel_date_end",
                                        currency: "IntentMediaProperties.site_currency",
                                        type: "IntentMediaProperties.product_category",
                                        tripType: "IntentMediaProperties.trip_type"
                                    }).then(function(dataObj) {
                                        if ("flights" === dataObj.type) {
                                            page.setType("avia");
                                            page.set("origin", dataObj.origin);
                                            page.set("destination", dataObj.destination);
                                            page.set("currency", dataObj.currency);
                                            var dateStart = utils.reFormatDate(dataObj.dateStart, /(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
                                            page.set("dateStart", dateStart);
                                            var dateEnd = null;
                                            "ROUND_TRIP" === dataObj.tripType && (dateEnd = utils.reFormatDate(dataObj.dateEnd, /(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"));
                                            page.set("dateEnd", dateEnd);
                                        } else page.clear();
                                    });
                                }
                            }
                        },
                        priceWatcher: {
                            price: {
                                query: {
                                    css: "#flightModuleList .offer-price .visuallyhidden"
                                },
                                template: "price"
                            }
                        }
                    };
                };
                var getHotel = function() {
                    var requestBaseData = function(profile, cb) {
                        var page = profile.page;
                        return utils.getParamsFromPage({
                            city: "IntentMediaProperties.hotel_city_name",
                            name: "IntentMediaProperties.hotel_supplier",
                            adults: "IntentMediaProperties.adults",
                            rooms: "IntentMediaProperties.hotel_rooms",
                            dateIn: "IntentMediaProperties.travel_date_start",
                            dateOut: "IntentMediaProperties.travel_date_end",
                            currency: "IntentMediaProperties.site_currency",
                            pageId: "IntentMediaProperties.page_id"
                        }).then(function(dataObj) {
                            if (null === dataObj.pageId) return 1;
                            if ("hotel.details" !== dataObj.pageId || dataObj.rooms > 1 || !dataObj.name) {
                                page.clear();
                                return 0;
                            }
                            page.setType("hotel");
                            var query = [ dataObj.name ];
                            dataObj.city && query.unshift(dataObj.name + " " + dataObj.city);
                            page.set("query", query);
                            page.set("adults", dataObj.adults);
                            page.set("currency", dataObj.currency);
                            var dateIn = utils.reFormatDate(dataObj.dateIn, /(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
                            page.set("dateIn", dateIn);
                            var dateOut = utils.reFormatDate(dataObj.dateOut, /(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
                            page.set("dateOut", dateOut);
                            return 0;
                        }).then(function(result) {
                            cb(result);
                        }, function() {
                            cb(1);
                        });
                    };
                    return {
                        locationCheck: function(url) {
                            return /Hotel-Information/.test(url);
                        },
                        formWatcher: {
                            ctr: {
                                query: [ {
                                    css: ".hotelInformation"
                                } ],
                                cb: function(profile) {
                                    return utils.waitResponse(250, 20, function(cb) {
                                        return requestBaseData(profile, cb);
                                    });
                                }
                            }
                        },
                        priceWatcher: {
                            price: {
                                query: {
                                    css: "#rooms-and-rates .room-price-info-wrapper .room-price"
                                },
                                template: "price",
                                key: "oneDayPrice"
                            }
                        }
                    };
                };
                return [ getHotel(), getAvia() ];
            };
            profileList["*://*.priceline.com/*"] = function() {
                var details = {
                    locationCheck: function(url) {
                        return /\/fly(\/#)?\/search\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: ".fly-search-listings-container"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                var url = location.href;
                                var m = url.match(/\/search\/([^-\/]+)-([^-\/]+)-([^-\/]+)\/(?:([^-\/]+)-([^-\/]+)-([^-\/]+)\/)?/);
                                if (m) {
                                    page.setType("avia");
                                    var origin = m[1].split(":")[0];
                                    page.set("origin", origin);
                                    var destination = m[2].split(":")[0];
                                    page.set("destination", destination);
                                    var dateStart = utils.reFormatDate(m[3], /(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
                                    page.set("dateStart", dateStart);
                                    var dateEnd = utils.reFormatDate(m[6], /(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
                                    page.set("dateEnd", dateEnd);
                                    return utils.getParamsFromPage({
                                        currency: "pclntms.dataDictionary.currencyCode"
                                    }).then(function(dataObj) {
                                        page.set("currency", dataObj.currency);
                                    });
                                }
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".fly-itinerary .details .price"
                            },
                            template: "price"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.aeroflot.ru/*"] = function() {
                var details = {
                    locationCheck: function(url) {
                        return /\/webqtrip.html/.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: ".flight-list"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                var dataArr = null;
                                var html = document.body.innerHTML;
                                var dataRe = /"itineraryAirportPairs":(\[[^\]]+])/;
                                utils.getPageScript(html, dataRe).some(function(script) {
                                    var m = script.match(dataRe);
                                    m = m && m[1];
                                    if (m) return utils.findJson(m).some(function(arr) {
                                        if (Array.isArray(arr)) {
                                            if (!(arr.length > 2)) {
                                                dataArr = arr;
                                                return !0;
                                            }
                                            tbr.error("More two way!");
                                        }
                                    });
                                });
                                if (dataArr) {
                                    var originData = dataArr[0];
                                    if (originData) {
                                        page.setType("avia");
                                        page.set("origin", originData.departureCode);
                                        page.set("destination", originData.arrivalCode);
                                        var dateStart = utils.reFormatDate(originData.date, /(\d{4})\/(\d{2})\/(\d{2})/, "$1-$2-$3");
                                        page.set("dateStart", dateStart);
                                        var dateEnd = null;
                                        var destData = dataArr[1];
                                        destData && (dateEnd = utils.reFormatDate(destData.date, /(\d{4})\/(\d{2})\/(\d{2})/, "$1-$2-$3"));
                                        page.set("dateEnd", dateEnd);
                                        var ccy = /"currency":"([^"]{3})"/.exec(html);
                                        ccy = ccy && ccy[1];
                                        ccy && page.set("currency", ccy);
                                    } else tbr.error("Origin data is not found!", dataArr);
                                } else tbr.error("Data is not found!");
                            }
                        }
                    },
                    priceWatcher: {
                        minPriceOut: {
                            query: {
                                css: "#outbounds .flight-list .prices-all .prices-amount"
                            },
                            template: "price",
                            key: "minPriceOut"
                        },
                        minPriceIn: {
                            query: {
                                css: "#inbounds .flight-list .prices-all .prices-amount"
                            },
                            template: "price",
                            key: "minPriceIn"
                        },
                        priceBoth: {
                            query: {
                                css: "#both .flight-list .prices-all .prices-amount"
                            },
                            template: "price"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.anywayanyday.com/*"] = function() {
                var aviaDetails = {
                    locationCheck: function(url) {
                        return /\/avia\/offers\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: ".offers-tickets-container"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                var url = location.href;
                                var m = url.match(/\/avia\/offers\/(\d{2})(\d{2})(\w{3})(\w{3})(?:(\d{2})(\d{2})(\w{3})(\w{3}))?/);
                                if (m) {
                                    m.shift();
                                    page.setType("avia");
                                    var isOneWay = !m[4];
                                    if (isOneWay || m[2] === m[7] && m[3] === m[6]) {
                                        var now = new Date();
                                        var getFormatDate = function(month, date) {
                                            var cYear = now.getFullYear();
                                            var cDate = now.getDate();
                                            var cMonth = now.getMonth() + 1;
                                            var intMonth = parseInt(month);
                                            var intDate = parseInt(date);
                                            (cMonth > intMonth || cMonth === intMonth && intDate < cDate) && (cYear += 1);
                                            return utils.validateDate([ cYear, month, date ].join("-"));
                                        };
                                        page.set("origin", m[2]);
                                        page.set("destination", m[3]);
                                        var dateStart = getFormatDate(m[1], m[0]);
                                        page.set("dateStart", dateStart);
                                        var dateEnd = !isOneWay && getFormatDate(m[5], m[4]);
                                        page.set("dateEnd", dateEnd);
                                    } else tbr.error("More one way in URL!", m);
                                }
                            }
                        },
                        ccy: {
                            query: {
                                css: ".header-sidebar-DropdownCurrency .b-menu-item-button-text"
                            },
                            template: "currency"
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".offers-tickets-container .fareTickets .b-price"
                            },
                            template: "price"
                        }
                    },
                    onShow: function(height) {
                        var app = document.querySelector("#app");
                        var top = document.querySelector("#app .page-top");
                        app && (app.style.top = height + "px");
                        top && (top.style.top = height + "px");
                    },
                    onHide: function() {
                        var app = document.querySelector("#app");
                        var top = document.querySelector("#app .page-top");
                        app && (app.style.top = 0);
                        top && (top.style.top = 0);
                    }
                };
                var hotelDetails = {
                    locationCheck: function(url) {
                        return /hotels\.anywayanyday.+\/offers/.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: [ {
                                css: ".hotel-rooms",
                                is: "added"
                            }, {
                                css: ".hotel-rooms_load",
                                is: "removed"
                            } ],
                            cb: function(profile) {
                                var page = profile.page;
                                page.setType("hotel");
                                var params = utils.parseUrl(location.href.split(/[?#]/).slice(-1)[0] || "", {
                                    params: !0
                                });
                                var dateIn = utils.reFormatDate(params.fromDate, /(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1");
                                var dateOut = utils.reFormatDate(params.toDate, /(\d{2})-(\d{2})-(\d{4})/, "$3-$2-$1");
                                page.set("dateIn", dateIn);
                                page.set("dateOut", dateOut);
                                var adults = document.querySelector(".offers-search > .offers-search_item .offers-search_item-content .offers-search_item-value > span");
                                adults = adults && adults.textContent;
                                page.set("adults", adults);
                                return utils.waitResponse(250, 20, function(cb) {
                                    return cb(null === document.querySelector("div.hotelName"));
                                }).then(function() {
                                    var name = document.querySelector("div.hotelName");
                                    name = name && name.textContent.trim();
                                    if (name) {
                                        var query = [];
                                        query.push(name);
                                        var baseParams = utils.parseUrl(location.href);
                                        var place = /(.+)\/(.+)/.exec(baseParams.cityId);
                                        if (place) {
                                            query.push(name + " " + place[1]);
                                            query.push(name + " " + place[1] + " " + place[2]);
                                        }
                                        page.set("query", query);
                                    } else tbr.error("Hotel name is not found!");
                                });
                            }
                        },
                        ccy: {
                            query: {
                                css: ".header-sidebar-DropdownCurrency .b-menu-item-button-text"
                            },
                            template: "currency"
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".hotel-rooms .hotel-offer .hotel-offer_price-value .b-price"
                            },
                            template: "price"
                        }
                    },
                    onShow: function(height) {
                        var app = document.querySelector("#app");
                        var top = document.querySelector("#app .page-top");
                        app && (app.style.top = height + "px");
                        top && (top.style.top = height + "px");
                    },
                    onHide: function() {
                        var app = document.querySelector("#app");
                        var top = document.querySelector("#app .page-top");
                        app && (app.style.top = 0);
                        top && (top.style.top = 0);
                    }
                };
                return [ aviaDetails, hotelDetails ];
            };
            profileList["*://*.svyaznoy.travel/*"] = function() {
                var aviaDetails = {
                    formWatcher: {
                        ctr: {
                            query: [ {
                                css: "#results"
                            }, {
                                css: ".best-results-price"
                            } ],
                            cb: function(profile) {
                                var page = profile.page;
                                return utils.getParamsFromPage({
                                    origin: "currentSearch.from_code",
                                    destination: "currentSearch.to_code",
                                    dateStart: "currentSearch.from_date",
                                    dateEnd: "currentSearch.to_date",
                                    type: "curDir"
                                }).then(function(dataObj) {
                                    if ("/avia" === dataObj.type) {
                                        page.setType("avia");
                                        page.set("origin", dataObj.origin);
                                        page.set("destination", dataObj.destination);
                                        var dateStart = utils.reFormatDate(dataObj.dateStart, /(\d{2})\.(\d{2})\.(\d{4})/, "$3-$2-$1");
                                        page.set("dateStart", dateStart);
                                        var dateEnd = utils.reFormatDate(dataObj.dateEnd, /(\d{2})\.(\d{2})\.(\d{4})/, "$3-$2-$1");
                                        page.set("dateEnd", dateEnd);
                                        document.querySelector(".sum_rub") && page.set("currency", "RUB");
                                    } else page.clear();
                                });
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".box-results-best .best-results-price"
                            },
                            template: "price"
                        }
                    }
                };
                var hotelDetails = {
                    locationCheck: function(url) {
                        return /\/hotels\/hotel\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: ".d__hotelPage"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                var params = utils.parseUrl(location.href);
                                var hotelName = document.querySelector(".d__hotel__title");
                                hotelName = hotelName && hotelName.textContent.trim();
                                if (hotelName) {
                                    if (1 == params.rooms) {
                                        page.setType("hotel");
                                        page.set("dateIn", params.arrival_date);
                                        page.set("dateOut", params.departure_date);
                                        page.set("adults", params.adults);
                                        return utils.getParamsFromPage({
                                            name: "_pageData.contentModel.name",
                                            city: "_pageData.contentModel.cities.name",
                                            currency: "_pageData.contentModel.currencycode"
                                        }).then(function(dataObj) {
                                            page.set("currency", dataObj.currency);
                                            hotelName === dataObj.name && (hotelName = null);
                                            var query = [];
                                            dataObj.name && query.push(dataObj.name);
                                            hotelName && query.push(hotelName);
                                            dataObj.city && query.slice(0).forEach(function(name) {
                                                query.push(name + " " + dataObj.city);
                                            });
                                            page.set("query", query);
                                        });
                                    }
                                    tbr.error("More one room!");
                                } else tbr.error("Hotel name is not found!");
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".d__hotel__rooms-container .d__hotel__rooms__room__header__price span"
                            },
                            template: "price"
                        }
                    }
                };
                return [ hotelDetails, aviaDetails ];
            };
            profileList["*://avia.tickets.ru/*"] = function() {
                var details = {
                    locationCheck: function(url) {
                        return /\/search\/results/.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: ".result_block"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                return utils.getParamsFromPage({
                                    origin: "avia_form_search_params.from_code",
                                    destination: "avia_form_search_params.to_code",
                                    dateStart: "avia_form_search_params.departure_date",
                                    dateEnd: "avia_form_search_params.departure_date1",
                                    fromCode1: "avia_form_search_params.from_code1",
                                    toCode1: "avia_form_search_params.to_code1",
                                    type: "cur_domain_name"
                                }).then(function(dataObj) {
                                    if ("avia" === dataObj.type) {
                                        page.setType("avia");
                                        if (!dataObj.dateEnd || dataObj.origin === dataObj.toCode1 && dataObj.destination === dataObj.fromCode1) {
                                            page.set("origin", dataObj.origin);
                                            page.set("destination", dataObj.destination);
                                            var dateStart = utils.reFormatDate(dataObj.dateStart, /(\d{2})\.(\d{2})\.(\d{4})/, "$3-$2-$1");
                                            page.set("dateStart", dateStart);
                                            var dateEnd = utils.reFormatDate(dataObj.dateEnd, /(\d{2})\.(\d{2})\.(\d{4})/, "$3-$2-$1");
                                            page.set("dateEnd", dateEnd);
                                        } else tbr.error("More one way", dataObj);
                                    } else {
                                        tbr.error("Is not avia page!");
                                        page.clear();
                                    }
                                });
                            }
                        },
                        ccy: {
                            query: {
                                css: ".currency-change-block .nav-currency .iradio_minimal.checked + label"
                            },
                            template: "currency",
                            currencyMap: {
                                RUR: "RUB"
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: "#offers_table .item-block .price-block strong span:not(.hidden)"
                            },
                            template: "price"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.s7.ru/*"] = function() {
                var details = {
                    locationCheck: function(url) {
                        return /\/selectExactDateSearchFlights\.action/.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: [ {
                                css: "#expandSearchForm"
                            } ],
                            cb: function(profile) {
                                var page = profile.page;
                                var origin = document.querySelector("#expandSearchForm input#departureLocationIataCode");
                                origin = origin && origin.value;
                                var destination = document.querySelector("#expandSearchForm input#arrivalLocationIataCode");
                                destination = destination && destination.value;
                                var dateStart = document.querySelector("#expandSearchForm input#departureDates");
                                dateStart = dateStart && dateStart.value;
                                dateStart && (dateStart = utils.reFormatDate(dateStart, /(\d{2})\.(\d{2})\.(\d{4})/, "$3-$2-$1"));
                                var dateEnd = document.querySelector('#expandSearchForm input[name="model.arrivalDate"]');
                                dateEnd = dateEnd && dateEnd.value;
                                dateEnd && (dateEnd = utils.reFormatDate(dateEnd, /(\d{2})\.(\d{2})\.(\d{4})/, "$3-$2-$1"));
                                var currency = document.querySelector('#expandSearchForm input[name="model.currencyType"]');
                                currency = currency && currency.value;
                                page.setType("avia");
                                page.set("origin", origin);
                                page.set("destination", destination);
                                page.set("dateStart", dateStart);
                                page.set("dateEnd", dateEnd);
                                page.set("currency", currency);
                            }
                        }
                    },
                    priceWatcher: {
                        priceOut: {
                            query: {
                                css: '#ibe_exact_outbound_flight_table .select-flights span[data-qa="amount"]'
                            },
                            template: "price",
                            key: "minPriceOut"
                        },
                        travelWithPriceOut: {
                            query: {
                                css: '#exact_outbound_flight_table .select-tariff span[data-qa="amount"]'
                            },
                            template: "price",
                            key: "minPriceOut"
                        },
                        priceIn: {
                            query: {
                                css: '#ibe_exact_inbound_flight_table .select-flights span[data-qa="amount"]'
                            },
                            template: "price",
                            key: "minPriceIn"
                        },
                        travelWithPriceIn: {
                            query: {
                                css: '#exact_inbound_flight_table .select-tariff span[data-qa="amount"]'
                            },
                            template: "price",
                            key: "minPriceIn"
                        }
                    },
                    onShow: function(barHeight) {
                        document.body.style.marginTop = barHeight + "px";
                    },
                    onHide: function() {
                        document.body.style.marginTop = 0;
                    }
                };
                return details;
            };
            profileList["*://*.kupibilet.ru/*"] = function() {
                var details = {
                    formWatcher: {
                        ctr: {
                            query: [ {
                                css: ".results-list-wrap"
                            }, {
                                css: ".preloader"
                            } ],
                            cb: function(profile) {
                                var page = profile.page;
                                var url = location.href;
                                var m = url.match(/\/search\/(?:\w\d{3})(\d{2})(\w{3})(\w{3})(\w{3})(?:(\d{2})(\w{3})(\w{3})?)?/);
                                if (m) {
                                    m.shift();
                                    if (m[6]) tbr.error("More two way!", m); else {
                                        var isOneWay = !m[4];
                                        var now = new Date();
                                        var monthMap = {
                                            JAN: "01",
                                            FEB: "02",
                                            MAR: "03",
                                            APR: "04",
                                            MAY: "05",
                                            JUN: "06",
                                            JUL: "07",
                                            AUG: "08",
                                            SEP: "09",
                                            OCT: 10,
                                            NOV: 11,
                                            DEC: 12
                                        };
                                        var getFormatDate = function(month, date) {
                                            month = monthMap[month];
                                            if (!month) return null;
                                            var cYear = now.getFullYear();
                                            var cDate = now.getDate();
                                            var cMonth = now.getMonth() + 1;
                                            var intMonth = parseInt(month);
                                            var intDate = parseInt(date);
                                            (cMonth > intMonth || cMonth === intMonth && intDate < cDate) && (cYear += 1);
                                            return utils.validateDate([ cYear, month, date ].join("-"));
                                        };
                                        page.setType("avia");
                                        page.set("origin", m[2]);
                                        page.set("destination", m[3]);
                                        var dateStart = getFormatDate(m[1], m[0]);
                                        page.set("dateStart", dateStart);
                                        var dateEnd = !isOneWay && getFormatDate(m[5], m[4]);
                                        page.set("dateEnd", dateEnd);
                                        document.querySelector(".fa-rub") && page.set("currency", "RUB");
                                    }
                                }
                            }
                        },
                        ccy: {
                            query: {
                                css: "div.ReactVirtualized__Grid__innerScrollContainer > div > div:nth-child(1) > div ~ div > div > span",
                                is: "added"
                            },
                            cb: function(profile, summary) {
                                var page = profile.page;
                                for (var node, n = 0; node = summary.added[n]; n++) if (node.textContent.indexOf(String.fromCharCode(8381)) !== -1) {
                                    page.set("currency", "RUB");
                                    break;
                                }
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: "div.ReactVirtualized__Grid__innerScrollContainer > div > div:nth-child(1) > div ~ div > div > span",
                                is: "added"
                            },
                            template: "price"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.trip.ru/*"] = function() {
                var details = {
                    locationCheck: function(url) {
                        return /\/flights\/searches\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: "#results-container"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                var paramsEl = [].slice.call(document.querySelectorAll("#flights_view_type_tabs a"));
                                var url = null;
                                var re = /e_travel_flights_search/;
                                paramsEl.some(function(node) {
                                    var hasParams = re.test(node.href);
                                    if (hasParams) {
                                        url = node.href;
                                        return !0;
                                    }
                                });
                                if (url) {
                                    var params = utils.parseUrl(url);
                                    page.setType("avia");
                                    var origin = params["e_travel_flights_search[from]"];
                                    page.set("origin", origin);
                                    var destination = params["e_travel_flights_search[to]"];
                                    page.set("destination", destination);
                                    var dateStart = params["e_travel_flights_search[departure]"];
                                    page.set("dateStart", dateStart);
                                    var dateEnd = params["e_travel_flights_search[return]"];
                                    page.set("dateEnd", dateEnd);
                                    var ccy = document.querySelector("#localization_selector_currency");
                                    ccy && ccy.value && page.set("currency", ccy.value);
                                } else tbr.error("Search url is not found!");
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".flights-product-details .price span > a"
                            },
                            template: "price"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.sindbad.ru/*"] = function() {
                var details = {
                    formWatcher: {
                        ctr: {
                            query: [ {
                                css: ".trips"
                            }, {
                                css: ".wait_loop"
                            } ],
                            cb: function(profile) {
                                var page = profile.page;
                                return utils.getParamsFromPage({
                                    origin: "App.searchModel.attributes.request.src",
                                    destination: "App.searchModel.attributes.request.dst",
                                    dateStart: "App.searchModel.attributes.request.date_out",
                                    dateEnd: "App.searchModel.attributes.request.date_in"
                                }).then(function(dataObj) {
                                    page.setType("avia");
                                    page.set("origin", dataObj.origin);
                                    page.set("destination", dataObj.destination);
                                    page.set("dateStart", dataObj.dateStart);
                                    page.set("dateEnd", dataObj.dateEnd);
                                    document.querySelector(".ruble") && page.set("currency", "RUB");
                                });
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".trips .trip-worth .trip-worth__price",
                                is: "added"
                            },
                            template: "price"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.aviakassa.ru/*"] = function() {
                var details = {
                    locationCheck: function(url) {
                        return /\/results\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: [ {
                                css: "#resultList"
                            } ],
                            cb: function(profile) {
                                var page = profile.page;
                                var formSwitch = document.querySelector('input[name="search[switch]"]');
                                formSwitch = formSwitch && formSwitch.value;
                                return utils.getParamsFromPage({
                                    origin: "APRT_DATA.searchTickets.codeFrom",
                                    destination: "APRT_DATA.searchTickets.codeDest",
                                    dateStart: "APRT_DATA.searchTickets.dateFrom",
                                    dateEnd: "APRT_DATA.searchTickets.dateTill",
                                    type: "APRT_DATA.searchTickets.type"
                                }).then(function(dataObj) {
                                    if ("avia" === dataObj.type) {
                                        page.setType("avia");
                                        if ("mult" !== formSwitch) {
                                            dataObj.dateStart === dataObj.dateEnd && "ow" === formSwitch && (dataObj.dateEnd = null);
                                            page.set("origin", dataObj.origin);
                                            page.set("destination", dataObj.destination);
                                            var dateStart = utils.reFormatDate(dataObj.dateStart, /(\d{2})\.(\d{2})\.(\d{4})/, "$3-$2-$1");
                                            page.set("dateStart", dateStart);
                                            var dateEnd = utils.reFormatDate(dataObj.dateEnd, /(\d{2})\.(\d{2})\.(\d{4})/, "$3-$2-$1");
                                            page.set("dateEnd", dateEnd);
                                        }
                                    } else page.clear();
                                });
                            }
                        },
                        ccy: {
                            query: {
                                css: ".price"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                var ccy = document.querySelector(".price");
                                ccy && /руб\./.test(ccy.textContent) && page.set("currency", "RUB");
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: "#resultList .flight-result .price"
                            },
                            template: "price"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.biletix.ru/*"] = function() {
                var details = {
                    formWatcher: {
                        ctr: {
                            query: [ {
                                css: ".flights"
                            }, {
                                css: ".progress-ajax-border"
                            } ],
                            cb: function(profile) {
                                var page = profile.page;
                                return utils.getParamsFromPage({
                                    origin: "xcnt_transport_from",
                                    destination: "xcnt_transport_to",
                                    dateStart: "xcnt_transport_depart_date",
                                    dateEnd: "xcnt_transport_return_date",
                                    type: "APRT_DATA.searchTickets.type"
                                }).then(function(dataObj) {
                                    if ("avia" === dataObj.type) {
                                        page.setType("avia");
                                        page.set("origin", dataObj.origin);
                                        page.set("destination", dataObj.destination);
                                        var dateStart = utils.reFormatDate(dataObj.dateStart, /(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
                                        page.set("dateStart", dateStart);
                                        var dateEnd = utils.reFormatDate(dataObj.dateEnd, /(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
                                        page.set("dateEnd", dateEnd);
                                        var ccy = document.querySelector('#currency_form .selected input[name="currency"]');
                                        ccy = ccy && ccy.value;
                                        if (ccy) {
                                            "RUR" === ccy && (ccy = "RUB");
                                            page.set("currency", ccy);
                                        }
                                    } else page.clear();
                                });
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".offers .offer .price .caption"
                            },
                            template: "price"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.utair.ru/*"] = function() {
                var details = {
                    formWatcher: {
                        ctr: {
                            query: [ {
                                css: ".directions_wrapper"
                            }, {
                                css: ".progress-text"
                            } ],
                            cb: function(profile) {
                                var page = profile.page;
                                page.setType("avia");
                                var origin = document.querySelector(".location.departure .code");
                                origin = origin && origin.textContent;
                                page.set("origin", origin);
                                var destination = document.querySelector(".location.arrival .code");
                                destination = destination && destination.textContent;
                                page.set("destination", destination);
                                var ccy = document.querySelector('input#matrix_currency[name="currency"]');
                                ccy && page.set("currency", ccy.value);
                                return utils.getParamsFromPage({
                                    dateStart: "cfg_split_fares.selected_date_to",
                                    dateEnd: "cfg_split_fares.selected_date_back"
                                }).then(function(dataObj) {
                                    var dateStart = utils.reFormatDate(dataObj.dateStart, /(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
                                    page.set("dateStart", dateStart);
                                    var dateEnd = utils.reFormatDate(dataObj.dateEnd, /(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
                                    page.set("dateEnd", dateEnd);
                                });
                            }
                        }
                    },
                    priceWatcher: {
                        priceOut: {
                            query: {
                                css: ".direction.direction-to .price"
                            },
                            template: "price",
                            key: "minPriceOut"
                        },
                        priceIn: {
                            query: {
                                css: ".direction.direction-back .price"
                            },
                            template: "price",
                            key: "minPriceIn"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.booking.*/*"] = function() {
                var details = {
                    locationCheck: function(url) {
                        return /\/hotel\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: "#hotelTmpl"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                var hotelName = document.querySelector("#hp_hotel_name");
                                hotelName = hotelName && hotelName.textContent.trim();
                                if (hotelName) return utils.getParamsFromPage({
                                    city: "utag_data.city_name",
                                    country: "utag_data.country_name",
                                    dateIn: "utag_data.date_in",
                                    dateOut: "utag_data.date_out",
                                    currency: "utag_data.currency",
                                    adults: "utag_data.adults"
                                }).then(function(dataObj) {
                                    page.setType("hotel");
                                    var query = [ hotelName ];
                                    dataObj.city && dataObj.country ? query.unshift(hotelName + " " + dataObj.city + " " + dataObj.country) : dataObj.city ? query.unshift(hotelName + " " + dataObj.city) : dataObj.country && query.unshift(hotelName + " " + dataObj.country);
                                    page.set("query", query);
                                    page.set("dateIn", dataObj.dateIn);
                                    page.set("dateOut", dataObj.dateOut);
                                    page.set("currency", dataObj.currency);
                                    page.set("adults", dataObj.adults);
                                });
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".booking_summary .roomPrice strong.rooms-table-room-price"
                            },
                            template: "price"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.agoda.*/*"] = function() {
                var details = {
                    locationCheck: function(url) {
                        return /\/hotel\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: ".hotel-header-section"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                page.setType("hotel");
                                return utils.getParamsFromPage({
                                    checkIn: "rtag_checkin",
                                    checkOut: "rtag_checkout",
                                    adults: "agoda.searchBoxConfig.defaultOccupancy.adults",
                                    children: "agoda.searchBoxConfig.defaultOccupancy.children",
                                    rooms: "agoda.searchBoxConfig.defaultOccupancy.rooms",
                                    defaultText: "agoda.searchBoxConfig.defaultText",
                                    city: "rtag_cityname"
                                }).then(function(dataObj) {
                                    if (1 === dataObj.rooms) {
                                        page.set("dateIn", dataObj.checkIn);
                                        page.set("dateOut", dataObj.checkOut);
                                        page.set("adults", dataObj.adults);
                                        var hotelName = dataObj.defaultText;
                                        var enName = /\((.+)\)$/.exec(hotelName);
                                        enName = enName && enName[1];
                                        enName && (hotelName = hotelName.replace("(" + enName + ")", ""));
                                        var query = [ hotelName ];
                                        enName && query.push(enName);
                                        if (dataObj.city) {
                                            enName && query.unshift(enName + " " + dataObj.city);
                                            query.unshift(hotelName + " " + dataObj.city);
                                        }
                                        page.set("query", query);
                                    }
                                });
                            }
                        },
                        ccy: {
                            query: {
                                css: [ "#room-grid-table .price .pricing.display", "#room-grid-table .price span.room-grouping-room-price", "#room-grid-table .price-panel .sellprice" ]
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                var ccy = document.getElementById("currency");
                                ccy && (ccy = ccy.textContent);
                                page.set("currency", ccy);
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: [ "#room-grid-table .price .pricing.display", "#room-grid-table .price span.room-grouping-room-price", "#room-grid-table .price-panel .sellprice" ]
                            },
                            template: "price",
                            key: "oneDayPrice"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.hotels.com/*"] = function() {
                var details = {
                    locationCheck: function(url) {
                        return /\/hotel\/|\/ho\d+\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: "#property-details"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                var name = document.querySelector('.vcard h1[itemprop="name"]');
                                name = name && name.textContent.trim();
                                return utils.getParamsFromPage({
                                    dateIn: "commonDataBlock.search.checkinDate",
                                    dateOut: "commonDataBlock.search.checkoutDate",
                                    name: "commonDataBlock.property.hotelName",
                                    country: "commonDataBlock.property.country",
                                    city: "commonDataBlock.property.city",
                                    currency: "commonDataBlock.property.featuredPrice.currency",
                                    rooms: "commonDataBlock.search.numRooms",
                                    searchRooms: "commonDataBlock.search.rooms"
                                }).then(function(dataObj) {
                                    if (1 == dataObj.rooms && Array.isArray(dataObj.searchRooms) && 1 === dataObj.searchRooms.length && dataObj.searchRooms[0]) {
                                        page.setType("hotel");
                                        name === dataObj.name && (name = null);
                                        var query = [];
                                        dataObj.name && query.push(dataObj.name);
                                        name && query.push(name);
                                        query.slice(0).forEach(function(name) {
                                            if (name) {
                                                var place = [ dataObj.city, dataObj.country ].filter(function(place) {
                                                    return !!place;
                                                });
                                                place.length && query.unshift([ name, place.join(" ") ].join(" "));
                                            }
                                        });
                                        page.set("query", query);
                                        page.set("dateIn", dataObj.dateIn);
                                        page.set("dateOut", dataObj.dateOut);
                                        page.set("currency", dataObj.currency);
                                        var adults = dataObj.searchRooms[0].numAdults;
                                        page.set("adults", adults);
                                    }
                                });
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: "#rooms-and-rates .current-price"
                            },
                            template: "price"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.ostrovok.ru/*"] = function() {
                var details = {
                    formWatcher: {
                        ctr: {
                            query: {
                                css: [ ".rate-pricevalue", ".zen-roomspagerate-price-value", ".hotel-metaroom-rate-pricevalue" ]
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                var isRoom = /\/rooms\//.test(location.href);
                                var isHotel = /\/hotel\//.test(location.href);
                                if (isRoom || isHotel) {
                                    var name = document.querySelector("h1.zen-roomspage-title-name");
                                    name = name && name.textContent;
                                    if (!name) {
                                        var nameNode = document.querySelector("h1.hotel-header-title");
                                        if (nameNode) {
                                            nameNode = nameNode.cloneNode(!0);
                                            var preferred = nameNode.querySelector(".preferred");
                                            preferred && preferred.parentNode.removeChild(preferred);
                                            name = nameNode.textContent.trim();
                                        }
                                    }
                                    if (name) return utils.getParamsFromPage({
                                        dateIn: "qubit_event.page_checkin_date",
                                        dateOut: "qubit_event.page_checkout_date",
                                        city: "qubit_event.page_city",
                                        country: "qubit_event.page_country",
                                        adults: "qubit_event.page_adults",
                                        currency: "qubit_event.product_currency"
                                    }).then(function(dataObj) {
                                        page.setType("hotel");
                                        var query = [ name ];
                                        dataObj.city && dataObj.country ? query.unshift(name + " " + dataObj.city + " " + dataObj.country) : dataObj.city ? query.unshift(name + " " + dataObj.city) : dataObj.country && query.unshift(name + " " + dataObj.country);
                                        page.set("query", query);
                                        page.set("adults", dataObj.adults);
                                        page.set("currency", dataObj.currency);
                                        var dateIn = utils.reFormatDate(dataObj.dateIn, /(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
                                        page.set("dateIn", dateIn);
                                        var dateOut = utils.reFormatDate(dataObj.dateOut, /(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
                                        page.set("dateOut", dateOut);
                                    });
                                } else page.clear();
                            }
                        },
                        changePage: {
                            query: {
                                css: "h1.zen-roomspage-title-name",
                                is: "removed"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                tbr.log("page change!");
                                main.watcher.closeCurrentBar();
                                page.clear();
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: [ ".rate-pricevalue", ".zen-roomspagerate-price-value", ".hotel-metaroom-rate-pricevalue" ]
                            },
                            cb: function(profile, summary) {
                                var page = profile.page;
                                var childNode = null;
                                var i = 0;
                                var price = null;
                                for (var node, n = 0; node = summary.added[n]; n++) {
                                    i = 0;
                                    for (;childNode = node.childNodes[i]; ) {
                                        i++;
                                        if (3 === childNode.nodeType) {
                                            var textContent = childNode.textContent.trim();
                                            if (textContent) {
                                                textContent = textContent.replace("тыс.", "000");
                                                price = utils.preparePrice(textContent);
                                                page.setPrice("price", price);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
                return details;
            };
            profileList["*://*.travel.ru/*"] = function() {
                var hotel = {
                    locationCheck: function(url) {
                        return /\/hotel\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: ".b-av .b-av-rate_price_rub"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                var ccy = document.querySelector(".b-currency-trigger button");
                                ccy = ccy && ccy.textContent;
                                ccy = ccy && ccy.match(/([A-Z]{3})/);
                                ccy = ccy && ccy[1];
                                var name = document.querySelector("h1.b-hotel_title");
                                name = name && name.textContent;
                                name = name && name.trim();
                                if (ccy && name) {
                                    var url = location.href;
                                    var params = utils.parseUrl(url);
                                    page.setType("hotel");
                                    var dateIn = utils.reFormatDate(params.in, /(\d{2})\.(\d{2})\.(\d{4})/, "$3-$2-$1");
                                    page.set("dateIn", dateIn);
                                    var dateOut = utils.reFormatDate(params.out, /(\d{2})\.(\d{2})\.(\d{4})/, "$3-$2-$1");
                                    page.set("dateOut", dateOut);
                                    var query = [ name ];
                                    var hotelName = document.querySelector(".breadcrumb > li.active > span[title]");
                                    hotelName = hotelName && hotelName.title;
                                    hotelName && query.push(hotelName);
                                    page.set("query", query);
                                    page.set("adults", params.occ);
                                    page.set("currency", ccy);
                                }
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".b-av .b-av-rate_price_rub"
                            },
                            template: "price"
                        }
                    }
                };
                var hotels = {
                    locationCheck: function(url) {
                        return /\/hotels\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: [ ".TPWL-hotels-one-rooms-item-price-value" ]
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                var ccy = document.querySelector(".TPWL-currency-switcher__selected");
                                ccy = ccy && ccy.textContent;
                                ccy = ccy && ccy.match(/([A-Z]{3})/);
                                ccy = ccy && ccy[1];
                                var name = document.querySelector(".TPWL-hotels-one-title");
                                name || (name = document.querySelector("h1.b-hotel_title"));
                                name = name && name.textContent;
                                name = name && name.trim();
                                if (ccy && name) {
                                    var params = utils.parseUrl(location.href);
                                    page.setType("hotel");
                                    var dateIn = utils.reFormatDate(params.checkIn, /(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3");
                                    page.set("dateIn", dateIn);
                                    var dateOut = utils.reFormatDate(params.checkOut, /(\d{4})-(\d{2})-(\d{2})/, "$1-$2-$3");
                                    page.set("dateOut", dateOut);
                                    page.set("query", [ name ]);
                                    var adults = document.querySelector("#room_type");
                                    adults = adults && adults.value;
                                    "family" === adults && (adults = 4);
                                    page.set("adults", adults);
                                    page.set("currency", ccy);
                                }
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: [ ".TPWL-hotels-one-rooms-item-price-value" ]
                            },
                            template: "price"
                        }
                    }
                };
                return [ hotels, hotel ];
            };
            profileList["*://*.oktogo.ru/*"] = function() {
                var getData = function(profile, cb) {
                    var page = profile.page;
                    return utils.getParamsFromPage({
                        name: "APRT_DATA.currentProduct.name",
                        dateIn: "APRT_DATA.searchTickets.dateFrom",
                        dateOut: "APRT_DATA.searchTickets.dateTill",
                        adults: "APRT_DATA.searchTickets.count",
                        currency: "currency",
                        type: "APRT_DATA.searchTickets.type",
                        country: "APRT_DATA.searchTickets.country",
                        city: "APRT_DATA.searchTickets.dest"
                    }).then(function(dataObj) {
                        if ("hotel" !== dataObj.type || !dataObj.name) return cb(1);
                        page.setType("hotel");
                        dataObj.name && (dataObj.name = dataObj.name.trim());
                        var query = [ dataObj.name ];
                        dataObj.city && dataObj.country ? query.unshift(dataObj.name + " " + dataObj.city + " " + dataObj.country) : dataObj.city ? query.unshift(dataObj.name + " " + dataObj.city) : dataObj.country && query.unshift(dataObj.name + " " + dataObj.country);
                        page.set("query", query);
                        page.set("currency", dataObj.currency);
                        var params = utils.parseUrl(location.href);
                        if (params.in && params.out) {
                            var dateIn = utils.reFormatDate(params.in, /(\d{2})\.(\d{2})\.(\d{4})/, "$3-$2-$1");
                            page.set("dateIn", dateIn);
                            var dateOut = utils.reFormatDate(params.out, /(\d{2})\.(\d{2})\.(\d{4})/, "$3-$2-$1");
                            page.set("dateOut", dateOut);
                        } else {
                            page.set("dateIn", dataObj.dateIn);
                            page.set("dateOut", dataObj.dateOut);
                        }
                        params.occ ? page.set("adults", params.occ) : page.set("adults", dataObj.adults);
                        cb();
                    });
                };
                var details = {
                    formWatcher: {
                        ctr: {
                            query: {
                                css: '.priceContainer *[data-price="period-price"] span.rub'
                            },
                            cb: function(profile) {
                                return utils.waitResponse(500, 20, function(cb) {
                                    return getData(profile, cb);
                                });
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: '.priceContainer *[data-price="period-price"] span.rub'
                            },
                            template: "price"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.roomguru.ru/*"] = function() {
                var details = {
                    locationCheck: function(url) {
                        return /\/Hotel\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: "#ratesSearchResultsHolder"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                var name = document.querySelector("h1.hc_htl_intro_name");
                                name = name && name.textContent.trim();
                                if (name) {
                                    var params = utils.parseUrl(location.href);
                                    var adults = params.adults_1;
                                    var place = params.destination;
                                    place = place && place.match(/place:(.+)/);
                                    place = place && place[1].trim();
                                    var query = [ name ];
                                    place && query.unshift(name + " " + place);
                                    return utils.getParamsFromPage({
                                        fields: "HC.Common.fields",
                                        gCurrencyCode: "gCurrencyCode"
                                    }).then(function(dataObj) {
                                        var fields = dataObj.fields;
                                        var ccy = dataObj.gCurrencyCode;
                                        if (fields && ccy) {
                                            page.setType("hotel");
                                            page.set("query", query);
                                            page.set("adults", adults);
                                            page.set("dateIn", fields.checkin);
                                            page.set("dateOut", fields.checkout);
                                            page.set("currency", ccy);
                                        }
                                    });
                                }
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: "#hc_htl_pm_rates_content .hc_tbl_col2 #TotalLink"
                            },
                            template: "price"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.tripadvisor.ru/*"] = function() {
                var getData = function(profile) {
                    var page = profile.page;
                    var queryName = document.querySelector("h1.header");
                    queryName = queryName && queryName.textContent.trim();
                    var name = null;
                    var altName = null;
                    var nameNode = document.querySelector("h1.heading_name");
                    if (nameNode) {
                        nameNode = nameNode.cloneNode(!0);
                        var altHead = nameNode.querySelector(".altHead");
                        if (altHead) {
                            altName = altHead.textContent.trim();
                            altHead.parentNode.removeChild(altHead);
                        }
                        name = nameNode.textContent.trim();
                    }
                    var tree = document.querySelector("div[data-targetEvent='offerClickTrackingTree']");
                    tree = tree && tree.innerHTML;
                    if (tree) {
                        var ccy = tree.match(/\\PC:([A-Z]{3})\\/);
                        ccy = ccy && ccy[1];
                        var dateIn = tree.match(/\\CI:(\d{4}-\d{2}-\d{2})\\/);
                        dateIn = dateIn && dateIn[1];
                        var dateOut = tree.match(/\\CO:(\d{4}-\d{2}-\d{2})\\/);
                        dateOut = dateOut && dateOut[1];
                        if (name && ccy && dateIn && dateOut) return utils.getParamsFromPage({
                            adultsCount: {
                                path: "ta.retrieve",
                                args: [ "multiDP.adultsCount" ]
                            }
                        }).then(function(dataObj) {
                            if (dataObj && dataObj.adultsCount) {
                                page.setType("hotel");
                                page.set("dateIn", dateIn);
                                page.set("dateOut", dateOut);
                                page.set("currency", ccy);
                                var query = [ name ];
                                altName && query.push(altName);
                                queryName && query.unshift(queryName);
                                page.set("query", query);
                                page.set("adults", dataObj.adultsCount);
                            }
                        });
                    }
                };
                var details = {
                    formWatcher: {
                        ctr: {
                            query: {
                                css: ".viewDealChevrons .price"
                            },
                            cb: function(profile) {
                                return getData(profile);
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".viewDealChevrons .price"
                            },
                            template: "price",
                            key: "oneDayPrice"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.hilton.com/*"] = profileList["*://*.hilton.ru/*"] = function() {
                var details = {
                    locationCheck: function(url) {
                        return /\/reservation\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: "#roomViewRegularView"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                var name = document.querySelector("h1.hotelNameNoLink");
                                name = name && name.textContent.trim();
                                var roomsAdults = document.querySelector(".sumOccupancy");
                                roomsAdults = roomsAdults && roomsAdults.textContent.trim();
                                var ccy = document.querySelector("select#changeCurrency");
                                ccy = ccy && ccy.value;
                                if (name && roomsAdults && ccy) return utils.getParamsFromPage({
                                    dateInfo: "digitalData.page.attributes.propertySearchDateInfo"
                                }).then(function(dataObj) {
                                    if (dataObj.dateInfo) {
                                        page.setType("hotel");
                                        var query = [ name ];
                                        page.set("query", query);
                                        roomsAdults = roomsAdults.match(/(\d+)/g);
                                        if (roomsAdults && "1" == roomsAdults[0]) {
                                            page.set("adults", roomsAdults[1]);
                                            page.set("currency", ccy);
                                            var searchDetails = dataObj.dateInfo.split(":");
                                            var dateIn = searchDetails[1];
                                            dateIn = utils.reFormatDate(dateIn, /(\d{2})(\d{2})(\d{4})/, "$3-$1-$2");
                                            page.set("dateIn", dateIn);
                                            var dateOut = searchDetails[2];
                                            dateOut = utils.reFormatDate(dateOut, /(\d{2})(\d{2})(\d{4})/, "$3-$1-$2");
                                            page.set("dateOut", dateOut);
                                        }
                                    }
                                });
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".price .priceamount"
                            },
                            cb: function(profile, summary) {
                                var arr = [];
                                for (var node, n = 0; node = summary.added[n]; n++) {
                                    node = node.cloneNode(!0);
                                    var del = node.querySelector("del");
                                    del && del.parentNode.removeChild(del);
                                    arr.push(node);
                                }
                                summary.added = arr;
                            },
                            template: "price",
                            key: "oneDayPrice"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.marriott.com/*"] = function() {
                var details = {
                    locationCheck: function(url) {
                        return /\/reservation\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: ".results-container"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                return utils.getParamsFromPage({
                                    dataLayer: "dataLayer"
                                }).then(function(dataObj) {
                                    if (dataObj.dataLayer && !(dataObj.dataLayer.numRooms > 1)) {
                                        page.setType("hotel");
                                        var name = dataObj.dataLayer.prop_name;
                                        var query = [ name ];
                                        dataObj.dataLayer.prop_address_city && query.unshift(name + " " + dataObj.dataLayer.prop_address_city);
                                        page.set("query", query);
                                        var adults = dataObj.dataLayer.numGuestsPerRoom;
                                        page.set("adults", adults);
                                        var currency = null;
                                        if (!currency) {
                                            currency = document.querySelector(".m-pricing-block span.t-nightly");
                                            currency = currency && currency.textContent;
                                            currency = currency && currency.match(/([A-Z]{3})\//);
                                            currency = currency && currency[1];
                                        }
                                        if (!currency) {
                                            currency = document.head.innerHTML.match(/tm_currency_type\s*:\s*"(\w{3})"/);
                                            currency = currency && currency[1];
                                        }
                                        currency || (currency = dataObj.dataLayer.prop_currency_type);
                                        page.set("currency", currency);
                                        var dateIn = dataObj.dataLayer.chckInDat;
                                        dateIn = utils.reFormatDate(dateIn, /(\d{2})\/(\d{2})\/(\d{4})/, "$3-$1-$2");
                                        page.set("dateIn", dateIn);
                                        var dateOut = dataObj.dataLayer.chckOutDate;
                                        dateOut = utils.reFormatDate(dateOut, /(\d{2})\/(\d{2})\/(\d{4})/, "$3-$1-$2");
                                        page.set("dateOut", dateOut);
                                        page.set("dayCount", dataObj.dataLayer.nmbNights);
                                    }
                                });
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".results-container .t-price"
                            },
                            template: "price",
                            key: "oneDayPrice"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.hostelworld.com/*"] = function() {
                var details = {
                    locationCheck: function(url) {
                        return /\/hosteldetails/.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: ".resultcolumn"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                return utils.getParamsFromPage({
                                    dataLayer: "dataLayer",
                                    currency: "$.currency.code"
                                }).then(function(dataObj) {
                                    if (Array.isArray(dataObj.dataLayer)) {
                                        var query = [];
                                        var name = null;
                                        dataObj.dataLayer.forEach(function(obj) {
                                            if (obj && "production" === obj.gtmApplicationEnv) {
                                                name = obj.gtmPropertyName;
                                                var city = document.querySelector('input[name="city"]');
                                                city = city && city.value;
                                                var country = document.querySelector('input[name="country"]');
                                                country = country && country.value;
                                                city && country ? query.push([ name, city, country ].join(" ")) : city ? query.push([ name, city ].join(" ")) : country && query.push([ name, country ].join(" "));
                                                query.push(name);
                                                page.set("dateIn", obj.gtmArrivalDate);
                                                page.set("dateOut", obj.gtmDepartureDate);
                                                page.set("adults", obj.gtmTotalGuestCount);
                                                page.set("dayCount", obj.gtmTotalGuestCount);
                                            }
                                        });
                                        page.setType("hotel");
                                        page.set("query", query);
                                        page.set("currency", dataObj.currency);
                                    }
                                });
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".rooms tr > td > .averageprice.currency"
                            },
                            template: "price",
                            key: "oneDayPrice"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.tiket.com/*"] = function() {
                var getOutDate = function(dateIn, days) {
                    var now = new Date(dateIn);
                    var time = now.getTime();
                    time += 24 * days * 60 * 60 * 1e3;
                    now = new Date(time);
                    var year = now.getUTCFullYear();
                    var month = now.getUTCMonth() + 1;
                    month < 10 && (month = "0" + month);
                    var date = now.getUTCDate();
                    date < 10 && (date = "0" + date);
                    return utils.validateDate([ year, month, date ].join("-"));
                };
                var details = {
                    locationCheck: function(url) {
                        return /\/hotel\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: ".tipe-kamar"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                page.setType("hotel");
                                var params = utils.parseUrl(location.href);
                                var room = params.room;
                                if (!room) {
                                    room = document.querySelector("#room2");
                                    room = room && room.value;
                                }
                                if (1 === parseInt(room)) {
                                    var name = document.querySelector(".head h1");
                                    name = name && name.textContent.trim();
                                    var query = [ name ];
                                    var address = document.querySelector('.head span[itemprop="address"]');
                                    address = address && address.textContent.trim();
                                    address && query.unshift(name + " " + address);
                                    var place = document.title.match(/\(([^)]+)\)/);
                                    place = place && place[1].trim();
                                    place && query.unshift(name + " " + place);
                                    page.set("query", query);
                                    var dateIn = params.startdate;
                                    if (!dateIn) {
                                        dateIn = document.querySelector("#hotelcheckin2");
                                        dateIn = dateIn && dateIn.value;
                                    }
                                    page.set("dateIn", dateIn);
                                    var dateOut;
                                    params.startdate && params.night && (dateOut = getOutDate(params.startdate, params.night));
                                    if (!dateOut) {
                                        dateOut = document.querySelector("#hotelcheckout2");
                                        dateOut = dateOut && dateOut.value;
                                    }
                                    page.set("dateOut", dateOut);
                                    var adult = params.adult;
                                    if (!adult) {
                                        adult = document.querySelector("#adult2");
                                        adult = adult && adult.value;
                                    }
                                    page.set("adults", adult);
                                    var ccy = document.querySelector(".nav .dropdown > a");
                                    ccy = ccy && ccy.textContent.trim();
                                    page.set("currency", ccy);
                                }
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".tipe-kamar .price > .currency"
                            },
                            template: "price"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.hotelsclick.com/*"] = function() {
                var roomTypeAdultMap = {
                    DBC: 3,
                    DBL: 2,
                    EXTRA: 1,
                    JRS: 2,
                    QUD: 4,
                    SGL: 1,
                    STR: 2,
                    TRC: 4,
                    TRP: 3,
                    TSU: 1,
                    TWC: 3,
                    TWN: 2
                };
                var details = {
                    formWatcher: {
                        ctr: {
                            query: {
                                css: [ ".cnt.hotel li.room" ]
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                var roomType = document.querySelector('select[name="roomtype"]');
                                roomType = roomType && roomType.value;
                                var rooms = document.querySelector('input[name="rooms"]');
                                rooms = rooms && rooms.value || 1;
                                var adults = roomTypeAdultMap[roomType];
                                if (adults && 1 == rooms) {
                                    var dateIn = document.querySelector('input[name="checkin"]');
                                    dateIn = dateIn && dateIn.value;
                                    var dateOut = document.querySelector('input[name="checkout"]');
                                    dateOut = dateOut && dateOut.value;
                                    page.setType("hotel");
                                    var query = [];
                                    var name = document.querySelector('.title_cnt .name h1 span[itemprop="name"]');
                                    if (name) {
                                        name = name.textContent.trim();
                                        query.push(name);
                                        var hotelInfoNode = document.querySelector(".title_cnt .address > a");
                                        if (hotelInfoNode) {
                                            var hotelInfo = hotelInfoNode.textContent.trim();
                                            var cityCountry = hotelInfo.split("-").slice(-1)[0];
                                            cityCountry && query.unshift(name + " " + cityCountry);
                                        }
                                    }
                                    var currency = document.querySelector('input[name="currency"]');
                                    currency = currency && currency.value;
                                    page.set("query", query);
                                    page.set("dateIn", dateIn);
                                    page.set("dateOut", dateOut);
                                    page.set("adults", adults);
                                    page.set("currency", currency);
                                }
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".cnt.hotel li.room li.total > span"
                            },
                            template: "price"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.hotelscombined.com/*"] = function() {
                var details = {
                    locationCheck: function(url) {
                        return /\/Hotel\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: "#hc_htl_pm_rates_content"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                page.setType("hotel");
                                var params = utils.parseUrl(location.href);
                                if (1 == params.Rooms) {
                                    var name = document.querySelector("h1.hc_htl_intro_name");
                                    name = name && name.textContent.trim();
                                    var query = [ name ];
                                    var place = document.head.innerHTML.match(/HC\.Affiliate\.setCurrentPlaceName\('([^']+)'\)/);
                                    place = place && place[1];
                                    place && query.unshift(name + " " + place);
                                    page.set("query", query);
                                    page.set("dateIn", params.checkin);
                                    page.set("dateOut", params.checkout);
                                    page.set("adults", params.adults_1);
                                    return utils.getParamsFromPage({
                                        currency: "HC.gCurrencyCode"
                                    }).then(function(dataObj) {
                                        page.set("currency", dataObj.currency || params.currencyCode);
                                    });
                                }
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: "#hc_htl_pm_rates_content #TotalLink"
                            },
                            template: "price"
                        }
                    }
                };
                return details;
            };
            profileList["*://booking.airasia.com/*"] = function() {
                var getCurrentDate = function() {
                    var now = new Date();
                    var year = now.getUTCFullYear();
                    var month = now.getUTCMonth() + 1;
                    month < 10 && (month = "0" + month);
                    var date = now.getUTCDate();
                    date < 10 && (date = "0" + date);
                    return [ year, month, date ].join("-");
                };
                var details = {
                    locationCheck: function(url) {
                        return /\/Flight\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: "#availabilityForm"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                var params = utils.parseUrl(location.href);
                                page.setType("avia");
                                if (!params.dd3) {
                                    page.set("origin", params.o1);
                                    page.set("destination", params.d1);
                                    var currentDate = getCurrentDate();
                                    params.dd1 < currentDate && (params.dd1 = currentDate);
                                    page.set("dateStart", params.dd1);
                                    params.dd2 && params.dd2 < params.dd1 && (params.dd2 = params.dd1);
                                    page.set("dateEnd", params.dd2);
                                    return utils.getParamsFromPage({
                                        currency: "currencyCodeJson.userCurrency"
                                    }).then(function(dataObj) {
                                        page.set("currency", params.cc || dataObj.currency);
                                    });
                                }
                            }
                        }
                    },
                    priceWatcher: {
                        minPriceOut: {
                            query: {
                                css: "#availabilityForm .avail-fare.depart .avail-fare-price"
                            },
                            template: "price",
                            key: "minPriceOut"
                        },
                        minPriceIn: {
                            query: {
                                css: "#availabilityForm .avail-fare.return .avail-fare-price"
                            },
                            template: "price",
                            key: "minPriceIn"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.ryanair.com/*"] = function() {
                var getData = function(profile) {
                    var page = profile.page;
                    return utils.getParamsFromPage({
                        searchCityPair: "dataLayer.searchCityPair",
                        searchDepartureDate: "dataLayer.searchDepartureDate",
                        searchArrivalDate: "dataLayer.searchArrivalDate",
                        currency: "dataLayer.currency"
                    }).then(function(dataObj) {
                        try {
                            var origin = "";
                            var destination = "";
                            var searchCityPair = dataObj.searchCityPair;
                            var pairs = searchCityPair.split(">");
                            if (3 === pairs.length) {
                                if (pairs[2] === pairs[0]) {
                                    origin = pairs[0];
                                    destination = pairs[1];
                                }
                            } else if (2 === pairs.length) {
                                origin = pairs[0];
                                destination = pairs[1];
                            }
                            var dateStart = utils.reFormatDate(dataObj.searchDepartureDate, /(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1");
                            var dateEnd = utils.reFormatDate(dataObj.searchArrivalDate, /(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1");
                            var currency = dataObj.currency;
                            currency === !1 && (currency = "EUR");
                            page.setType("avia");
                            page.set("origin", origin);
                            page.set("destination", destination);
                            page.set("dateStart", dateStart);
                            page.set("dateEnd", dateEnd);
                            page.set("currency", currency);
                        } catch (e) {
                            tbr.error("Error", e);
                        }
                    });
                };
                var details = {
                    formWatcher: {
                        ctr: {
                            query: {
                                css: ".flight-list"
                            },
                            cb: function(profile) {
                                return getData(profile);
                            }
                        }
                    },
                    priceWatcher: {
                        minPriceOut: {
                            query: {
                                css: '.flight-list div[type="outbound"] + .flight-list-wrapper span.price'
                            },
                            template: "price",
                            key: "minPriceOut"
                        },
                        minPriceIn: {
                            query: {
                                css: '.flight-list div[type="inbound"] + .flight-list-wrapper span.price'
                            },
                            template: "price",
                            key: "minPriceIn"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.avis.*/*"] = function() {
                var timeRe = /(\d+):(\d+)\s+(PM|AM)/;
                var time12to24 = function(time) {
                    var m = timeRe.exec(time);
                    if (m) {
                        m[1] = parseInt(m[1]);
                        m[2] = parseInt(m[2]);
                        "PM" === m[3] && m[1] < 12 && (m[1] += 12);
                        "AM" === m[3] && 12 === m[1] && (m[1] -= 12);
                        m[1] < 10 && (m[1] = "0" + m[1]);
                        m[2] < 10 && (m[2] = "0" + m[2]);
                        return m[1] + ":" + m[2];
                    }
                };
                var avisCom = {
                    locationCheck: function(url) {
                        return /avis\.com\/(.+\/)?reservation/.test(url);
                    },
                    formWatcher: {
                        changePage: {
                            query: {
                                css: ".vehicle-availability .container-fluid .step2dtl",
                                is: "removed"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                tbr.log("page change!");
                                main.watcher.closeCurrentBar();
                                page.clear();
                            }
                        },
                        ctr: {
                            query: {
                                css: ".vehicle-availability .container-fluid .step2dtl",
                                is: "added"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                page.setType("cars");
                                return utils.getParamsFromPage({
                                    reservationModel: "sessionStorage.ngStorage-reservationModel"
                                }).then(function(dataObj) {
                                    try {
                                        var obj = JSON.parse(dataObj.reservationModel);
                                        page.set("pickUpLocationId", obj.pickInfo);
                                        var pickUpDate = obj.pickUpDate + "T" + time12to24(obj.pickUpTime);
                                        page.set("pickUpDate", pickUpDate);
                                        page.set("dropOffLocationId", obj.dropInfo);
                                        var dropOffDate = obj.dropDate + "T" + time12to24(obj.dropTime);
                                        page.set("dropOffDate", dropOffDate);
                                        page.set("driverAge", obj.personalInfoRQ.age);
                                        var currency = document.querySelector('a[ng-bind="vm.userCurrency"]');
                                        currency = currency && currency.textContent;
                                        page.set("currency", obj.userSelectedCurrency || currency);
                                    } catch (e) {
                                        tbr.error("Error", e);
                                    }
                                });
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".row.avilablecar.available-car-box .payamntr"
                            },
                            template: "price"
                        }
                    },
                    onShow: function(barHeight) {
                        var header = document.querySelector(".navbar.navbar-fixed-top");
                        header && (header.style.top = barHeight + "px");
                    },
                    onHide: function() {
                        var header = document.querySelector(".navbar.navbar-fixed-top");
                        header && (header.style.top = 0);
                    }
                };
                var avis = {
                    locationCheck: function(url) {
                        return /&return-search=/.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: ".search-results-wrapper",
                                is: "added"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                page.setType("cars");
                                var params = utils.parseUrl(location.href);
                                var hireLocation = params["hire-location"];
                                var returnLocation = params["return-location"] || hireLocation;
                                var dateFrom = params["date-from"];
                                var timeFrom = params["time-from"];
                                var dateTo = params["date-to"];
                                var timeTo = params["time-to"];
                                var age = 30;
                                page.set("pickUpLocationId", hireLocation);
                                var pickUpDate = utils.reFormatDate(dateFrom + "T" + timeFrom, /(\d{2})\/(\d{2})\/(\d{4})T(\d{2})(\d{2})/, "$3-$2-$1T$4:$5");
                                page.set("pickUpDate", pickUpDate);
                                page.set("dropOffLocationId", returnLocation);
                                var dropOffDate = utils.reFormatDate(dateTo + "T" + timeTo, /(\d{2})\/(\d{2})\/(\d{4})T(\d{2})(\d{2})/, "$3-$2-$1T$4:$5");
                                page.set("dropOffDate", dropOffDate);
                                page.set("driverAge", age);
                                var currency = document.querySelector(".car-result-module.type-car .price");
                                currency = utils.findCurrency(currency && currency.textContent);
                                page.set("currency", currency);
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".search-results-wrapper .car-result-module.type-car .price"
                            },
                            template: "price"
                        }
                    }
                };
                return [ avisCom, avis ];
            };
            profileList["*://*.budget.com/*"] = function() {
                var details = {
                    locationCheck: function(url) {
                        return /\/home\.ex|\/reservation\//.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: ".vehPresentation"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                page.setType("cars");
                                return utils.getParamsFromPage({
                                    pickup_time: "pickup_time",
                                    return_time: "return_time",
                                    pickup_location: "pickup_location",
                                    return_location: "return_location"
                                }).then(function(dataObj) {
                                    try {
                                        page.set("pickUpLocationId", dataObj.pickup_location);
                                        var pickUpDate = utils.reFormatDate(dataObj.pickup_time, /(\d{2})(\d{2})(\d{4})(\d{2})(\d{2})/, "$3-$1-$2T$4:$5");
                                        page.set("pickUpDate", pickUpDate);
                                        page.set("dropOffLocationId", dataObj.return_location);
                                        var dropOffDate = utils.reFormatDate(dataObj.return_time, /(\d{2})(\d{2})(\d{4})(\d{2})(\d{2})/, "$3-$1-$2T$4:$5");
                                        page.set("dropOffDate", dropOffDate);
                                        var age = /s\.eVar59='(\d{2})'/.exec(document.body.innerHTML);
                                        age = age && age[1];
                                        page.set("driverAge", age);
                                        var ccy = document.querySelector('input[name="userPrefCurrency"]');
                                        ccy = ccy && ccy.value;
                                        page.set("currency", ccy);
                                    } catch (e) {
                                        tbr.error("Error", e);
                                    }
                                });
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: ".vehPresentation .pricePD"
                            },
                            template: "price"
                        }
                    }
                };
                return details;
            };
            profileList["*://*.wizzair.com/*"] = function() {
                var updateDate = function(page) {
                    var dateStartInput = document.querySelector("#fare-selector-outbound .js-selected input.booking-flow__flight-select__chart__day__input");
                    dateStartInput = dateStartInput && dateStartInput.value;
                    var dateEndInput = document.querySelector("#fare-selector-return .js-selected input.booking-flow__flight-select__chart__day__input");
                    dateEndInput = dateEndInput && dateEndInput.value;
                    null !== dateStartInput && page.set("dateStart", dateStartInput);
                    null !== dateEndInput && page.set("dateEnd", dateEndInput);
                };
                return {
                    formWatcher: {
                        ctr: {
                            query: {
                                css: "#booking-flow-step-select-flight",
                                is: "added"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                page.setType("avia");
                                var data = /\/booking\/select-flight\/([A-Z]{3})\/([A-Z]{3})\/(\d{4}-\d{2}-\d{2})\/(\d{4}-\d{2}-\d{2}|null)\/(\d+)\/(\d+)\/(\d+)/.exec(location.href);
                                if (data) {
                                    page.set("origin", data[1]);
                                    page.set("destination", data[2]);
                                    page.set("dateStart", data[3]);
                                    "null" === data[4] && (data[4] = null);
                                    page.set("dateEnd", data[4]);
                                    updateDate(page);
                                }
                            }
                        },
                        ccy: {
                            query: {
                                css: ".booking-flow__prices-table__price",
                                is: "added"
                            },
                            cb: function(profile, summary) {
                                var page = profile.page;
                                updateDate(page);
                                var re = /€/;
                                var found = summary.added.some(function(node) {
                                    return re.test(node.textContent);
                                });
                                found && page.set("currency", "EUR");
                            }
                        },
                        changePage: {
                            query: {
                                css: "#booking-flow-step-select-flight",
                                is: "removed"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                tbr.log("page change!");
                                main.watcher.closeCurrentBar();
                                page.clear();
                            }
                        }
                    },
                    priceWatcher: {
                        priceOut: {
                            query: {
                                css: "#fare-selector-outbound .booking-flow__prices-table__price"
                            },
                            template: "price",
                            key: "minPriceOut"
                        },
                        priceIn: {
                            query: {
                                css: "#fare-selector-return .booking-flow__prices-table__price"
                            },
                            template: "price",
                            key: "minPriceIn"
                        }
                    },
                    onShow: function(barHeight) {
                        var node = document.querySelector("aside.booking-flow__itinerary");
                        node && (node.style.top = barHeight + "px");
                        node = document.querySelector("div.booking-flow__sticky-header");
                        node && (node.style.top = barHeight + "px");
                    },
                    onHide: function() {
                        var node = document.querySelector("aside.booking-flow__itinerary");
                        node && (node.style.top = 0);
                        node = document.querySelector("div.booking-flow__sticky-header");
                        node && (node.style.top = 0);
                    }
                };
            };
            profileList["*://*.emirates.com/*"] = function() {
                return {
                    locationCheck: function(url) {
                        return /\/SelectPrice\.aspx/.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: "#ctl00_c_dvOBBResult"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                page.setType("avia");
                                return utils.getParamsFromPage({
                                    dataLayer: "dataLayer",
                                    dateStart: "flightDateOutIBE",
                                    dateEnd: "flightDateBackIBE"
                                }).then(function(dataObj) {
                                    try {
                                        var info = null;
                                        dataObj.dataLayer.some(function(item) {
                                            if (item.flightRoute) {
                                                info = item;
                                                return !0;
                                            }
                                        });
                                        if (info) {
                                            if (info.flightRoute.split("-").length > 3) throw "More one way";
                                            dataObj.dateStart === dataObj.dateEnd && (dataObj.dateEnd = null);
                                            page.set("origin", info.originSearchIBE);
                                            page.set("destination", info.destinationSearchIBE);
                                            page.set("dateStart", dataObj.dateStart);
                                            page.set("dateEnd", dataObj.dateEnd);
                                            page.set("currency", info.pooFlightCurrencyCode);
                                        }
                                    } catch (e) {
                                        tbr.error("Error", e);
                                    }
                                });
                            }
                        }
                    },
                    priceWatcher: {
                        minPriceOut: {
                            query: {
                                css: ".flight-list.outbound-list .flight-fares-content .flight-fares-table .curr-only"
                            },
                            template: "price",
                            key: "minPriceOut"
                        },
                        minPriceIn: {
                            query: {
                                css: ".flight-list.inbound-list .flight-fares-content .flight-fares-table .curr-only"
                            },
                            template: "price",
                            key: "minPriceIn"
                        }
                    }
                };
            };
            profileList["*://*.delta.com/*"] = function() {
                var getOutDate = function(dateIn, days) {
                    var now = new Date(dateIn);
                    var time = now.getTime();
                    time += 24 * days * 60 * 60 * 1e3;
                    now = new Date(time);
                    var year = now.getUTCFullYear();
                    var month = now.getUTCMonth() + 1;
                    month < 10 && (month = "0" + month);
                    var date = now.getUTCDate();
                    date < 10 && (date = "0" + date);
                    return utils.validateDate([ year, month, date ].join("-"));
                };
                return {
                    locationCheck: function(url) {
                        return /\/air-shopping\/findFlights\.action/.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: "#_fareDisplayContainer_tmplHolder"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                page.setType("avia");
                                return utils.getParamsFromPage({
                                    origin: "delta.airShopping.originCode",
                                    destination: "delta.airShopping.destinationCode",
                                    dateStart: "delta.airShopping.originDate",
                                    dayCount: "delta.airShopping.differenceInDays",
                                    tripType: "delta.airShopping.tripType"
                                }).then(function(dataObj) {
                                    try {
                                        if ([ "ROUND_TRIP", "ONE_WAY" ].indexOf(dataObj.tripType) === -1) throw "Unsupported type";
                                        page.set("origin", dataObj.origin);
                                        page.set("destination", dataObj.destination);
                                        page.set("dateStart", dataObj.dateStart);
                                        "ROUND_TRIP" === dataObj.tripType && page.set("dateEnd", getOutDate(dataObj.dateStart, dataObj.dayCount));
                                    } catch (e) {
                                        tbr.error("Error", e);
                                    }
                                });
                            }
                        },
                        ccy: {
                            query: {
                                css: "#redeemMilesToggle"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                var btn = document.querySelector('#redeemMilesToggle label.btn.checked[for="revenueSearch"]');
                                var m = btn && /([A-Z]{3})/.exec(btn.textContent);
                                m && page.set("currency", m[1]);
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: "#_fareDisplayContainer_tmplHolder .tableHeaderHolderFare .priceHolder"
                            },
                            template: "price"
                        }
                    }
                };
            };
            profileList["*://*.hertz.com/*"] = function() {
                var details = {
                    locationCheck: function(url) {
                        return /\/rentacar\/reservation\//.test(url);
                    },
                    formWatcher: {
                        changePage: {
                            query: [ {
                                css: "#itn-location",
                                is: "added"
                            } ],
                            cb: function(profile) {
                                var page = profile.page;
                                main.watcher.closeCurrentBar();
                                page.clear();
                            }
                        },
                        ctr: {
                            query: {
                                css: "#res-vehicles-page"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                page.setType("cars");
                                return utils.getParamsFromPage({
                                    pickup_date: "htz.homepage.json.data.model.formData.pickupDay",
                                    pickup_time: "htz.homepage.json.data.model.formData.pickupTime",
                                    return_date: "htz.homepage.json.data.model.formData.dropoffDay",
                                    return_time: "htz.homepage.json.data.model.formData.dropoffTime",
                                    pickup_location: "htz.homepage.json.data.model.formData.pickupHiddenEOAG",
                                    return_location: "htz.homepage.json.data.model.formData.dropoffHiddenEOAG",
                                    age: "htz.homepage.json.data.model.formData.ageSelector",
                                    militaryClock: "htz.homepage.json.data.model.formData.militaryClock"
                                }).then(function(dataObj) {
                                    page.set("pickUpLocationId", dataObj.pickup_location.substr(0, 3));
                                    var pickUpDate = dataObj.pickup_date + "T" + dataObj.pickup_time;
                                    var dropOffDate = dataObj.return_date + "T" + dataObj.return_time;
                                    if (dataObj.militaryClock) {
                                        pickUpDate = utils.reFormatDate(pickUpDate, /(\d{2})\/(\d{2})\/(\d{4})T(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5");
                                        dropOffDate = utils.reFormatDate(dropOffDate, /(\d{2})\/(\d{2})\/(\d{4})T(\d{2}):(\d{2})/, "$3-$2-$1T$4:$5");
                                    } else {
                                        pickUpDate = utils.reFormatDate(pickUpDate, /(\d{2})\/(\d{2})\/(\d{4})T(\d{2}):(\d{2})/, "$3-$1-$2T$4:$5");
                                        dropOffDate = utils.reFormatDate(dropOffDate, /(\d{2})\/(\d{2})\/(\d{4})T(\d{2}):(\d{2})/, "$3-$1-$2T$4:$5");
                                    }
                                    page.set("pickUpDate", pickUpDate);
                                    dataObj.return_location || (dataObj.return_location = dataObj.pickup_location);
                                    page.set("dropOffLocationId", dataObj.return_location.substr(0, 3));
                                    page.set("dropOffDate", dropOffDate);
                                    page.set("driverAge", dataObj.age);
                                });
                            }
                        },
                        ccy: {
                            query: {
                                css: "#res-vehicles-page .price-wrapper",
                                is: "added"
                            },
                            cb: function(profile, summary) {
                                var page = profile.page;
                                var currentCcy = page.get("currency");
                                !currentCcy && summary.added.some(function(node) {
                                    var ccyNode = node.querySelector(".price + span");
                                    var ccy = ccyNode && utils.validateCcy(ccyNode.textContent);
                                    if (ccy) {
                                        page.set("currency", ccy);
                                        return !0;
                                    }
                                });
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: "#res-vehicles-page .price-wrapper",
                                is: "added"
                            },
                            cb: function(profile, summary) {
                                var page = profile.page;
                                summary.added.forEach(function(node) {
                                    var priceNode = node.querySelector(".price");
                                    var isRate = !!node.querySelector(".rate");
                                    var approxTotalPriceNode = node.querySelector(".approx-total-price");
                                    var ccyNode = node.querySelector(".price + span");
                                    var price = "";
                                    price = isRate && approxTotalPriceNode ? utils.preparePrice(approxTotalPriceNode.textContent) : priceNode && utils.preparePrice(priceNode.textContent);
                                    var ccy = ccyNode && utils.validateCcy(ccyNode.textContent);
                                    price && ccy && page.get("currency") === ccy && page.setPrice("price", price);
                                });
                            }
                        }
                    }
                };
                return details;
            };
            profileList["*://*.europcar.com/*"] = function() {
                var details = {
                    locationCheck: function(url) {
                        return /\/DotcarClient\/step2\.action/.test(url);
                    },
                    formWatcher: {
                        ctr: {
                            query: {
                                css: "#contents .main-content",
                                is: "added"
                            },
                            cb: function(profile) {
                                var page = profile.page;
                                page.setType("cars");
                                return utils.getParamsFromPage({
                                    pickup_date: "tc_vars.select_checkout_date",
                                    pickup_time: "tc_vars.select_checkout_time",
                                    return_date: "tc_vars.select_checkin_date",
                                    return_time: "tc_vars.select_checkin_time",
                                    pickup_location: "tc_vars.select_checkout_station_code",
                                    return_location: "tc_vars.select_checkin_station_code"
                                }).then(function(dataObj) {
                                    page.set("pickUpLocationId", dataObj.pickup_location.substr(0, 3));
                                    var pickUpDate = utils.reFormatDate(dataObj.pickup_date + "T" + dataObj.pickup_time, /(\d{4})(\d{2})(\d{2})T(\d{2})h(\d{2})/, "$1-$2-$3T$4:$5");
                                    page.set("pickUpDate", pickUpDate);
                                    dataObj.return_location || (dataObj.return_location = dataObj.pickup_location);
                                    page.set("dropOffLocationId", dataObj.return_location.substr(0, 3));
                                    var dropOffDate = utils.reFormatDate(dataObj.return_date + "T" + dataObj.return_time, /(\d{4})(\d{2})(\d{2})T(\d{2})h(\d{2})/, "$1-$2-$3T$4:$5");
                                    page.set("dropOffDate", dropOffDate);
                                    var age = document.querySelector('select[name="driverAge"]');
                                    age = age && age.value;
                                    age > 26 && (age = 26);
                                    page.set("driverAge", age);
                                    var ccy = null;
                                    [].slice.call(document.querySelectorAll(".vehicle-block .price-info .price")).some(function(node) {
                                        var m = /([A-Z]{3})/.exec(node.textContent);
                                        if (m) {
                                            ccy = m[1];
                                            return !0;
                                        }
                                    });
                                    page.set("currency", ccy);
                                });
                            }
                        }
                    },
                    priceWatcher: {
                        price: {
                            query: {
                                css: "#contents .main-content ul .vehicle-block .price-info .price"
                            },
                            template: "price"
                        }
                    }
                };
                return details;
            };
            return profileList;
        };
        module.exports = getProfileList;
    }).call(exports, __webpack_require__(8), __webpack_require__(2));
}, function(module, exports) {
    function CustomError(message) {
        this.name = "CustomError";
        this.message = message;
        Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack;
    }
    CustomError.prototype = Object.create(Error.prototype);
    CustomError.prototype.constructor = CustomError;
    module.exports = CustomError;
}, function(module, exports) {
    var Promise = function() {
        var Promise = null;
        Promise = "function" == typeof window.Promise && "function" == typeof window.Promise.resolve && "function" == typeof window.Promise.reject ? window.Promise : function() {
            /**
	       @license
	       Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
	       This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
	       The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
	       The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
	       Code distributed by Google as part of the polymer project is also
	       subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
	       */
            function MakePromise(asap) {
                function Promise(fn) {
                    if ("object" != typeof this || "function" != typeof fn) throw new TypeError();
                    this._state = null;
                    this._value = null;
                    this._deferreds = [];
                    doResolve(fn, resolve.bind(this), reject.bind(this));
                }
                function handle(deferred) {
                    var me = this;
                    null !== this._state ? asap(function() {
                        var cb = me._state ? deferred.onFulfilled : deferred.onRejected;
                        if ("function" == typeof cb) {
                            var ret;
                            try {
                                ret = cb(me._value);
                            } catch (e) {
                                deferred.reject(e);
                                return;
                            }
                            deferred.resolve(ret);
                        } else (me._state ? deferred.resolve : deferred.reject)(me._value);
                    }) : this._deferreds.push(deferred);
                }
                function resolve(newValue) {
                    try {
                        if (newValue === this) throw new TypeError();
                        if (newValue && ("object" == typeof newValue || "function" == typeof newValue)) {
                            var then = newValue.then;
                            if ("function" == typeof then) {
                                doResolve(then.bind(newValue), resolve.bind(this), reject.bind(this));
                                return;
                            }
                        }
                        this._state = !0;
                        this._value = newValue;
                        finale.call(this);
                    } catch (e) {
                        reject.call(this, e);
                    }
                }
                function reject(newValue) {
                    this._state = !1;
                    this._value = newValue;
                    finale.call(this);
                }
                function finale() {
                    for (var i = 0, len = this._deferreds.length; i < len; i++) handle.call(this, this._deferreds[i]);
                    this._deferreds = null;
                }
                function doResolve(fn, onFulfilled, onRejected) {
                    var done = !1;
                    try {
                        fn(function(value) {
                            if (!done) {
                                done = !0;
                                onFulfilled(value);
                            }
                        }, function(reason) {
                            if (!done) {
                                done = !0;
                                onRejected(reason);
                            }
                        });
                    } catch (ex) {
                        if (done) return;
                        done = !0;
                        onRejected(ex);
                    }
                }
                Promise.prototype.catch = function(onRejected) {
                    return this.then(null, onRejected);
                };
                Promise.prototype.then = function(onFulfilled, onRejected) {
                    var me = this;
                    return new Promise(function(resolve, reject) {
                        handle.call(me, {
                            onFulfilled: onFulfilled,
                            onRejected: onRejected,
                            resolve: resolve,
                            reject: reject
                        });
                    });
                };
                Promise.resolve = function(value) {
                    return value && "object" == typeof value && value.constructor === Promise ? value : new Promise(function(resolve) {
                        resolve(value);
                    });
                };
                Promise.reject = function(value) {
                    return new Promise(function(resolve, reject) {
                        reject(value);
                    });
                };
                return Promise;
            }
            var asap = "function" == typeof setImmediate && setImmediate || function(fn) {
                setTimeout(fn, 0);
            };
            return MakePromise(asap);
        }();
        (function(Promise) {
            Promise.all = Promise.all || function() {
                var args = Array.prototype.slice.call(1 === arguments.length && Array.isArray(arguments[0]) ? arguments[0] : arguments);
                return new Promise(function(resolve, reject) {
                    function res(i, val) {
                        try {
                            if (val && ("object" == typeof val || "function" == typeof val)) {
                                var then = val.then;
                                if ("function" == typeof then) {
                                    then.call(val, function(val) {
                                        res(i, val);
                                    }, reject);
                                    return;
                                }
                            }
                            args[i] = val;
                            0 === --remaining && resolve(args);
                        } catch (ex) {
                            reject(ex);
                        }
                    }
                    if (0 === args.length) return resolve([]);
                    var remaining = args.length;
                    for (var i = 0; i < args.length; i++) res(i, args[i]);
                });
            };
            Promise.race = Promise.race || function(values) {
                return new Promise(function(resolve, reject) {
                    for (var i = 0, len = values.length; i < len; i++) values[i].then(resolve, reject);
                });
            };
        })(Promise);
        return Promise;
    }();
    module.exports = Promise;
}, function(module, exports) {
    module.exports = function(callback) {
        if ([ "interactive", "complete" ].indexOf(document.readyState) !== -1) callback(); else {
            var onLoad = function() {
                document.removeEventListener("DOMContentLoaded", onLoad, !1);
                window.removeEventListener("load", onLoad, !1);
                callback();
            };
            document.addEventListener("DOMContentLoaded", onLoad, !1);
            window.addEventListener("load", onLoad, !1);
        }
    };
} ]);