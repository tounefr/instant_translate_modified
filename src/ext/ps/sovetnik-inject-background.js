(function(SOVETNIK_SETTINGS,SCRIPT_URL){/*
 CryptoJS v3.1.2
 code.google.com/p/crypto-js
 (c) 2009-2013 by Jeff Mott. All rights reserved.
 code.google.com/p/crypto-js/wiki/License
 */
    var CryptoJS=CryptoJS||function(s,p){var m={},l=m.lib={},n=function(){},r=l.Base={extend:function(b){n.prototype=this;var h=new n;b&&h.mixIn(b);h.hasOwnProperty("init")||(h.init=function(){h.$super.init.apply(this,arguments)});h.init.prototype=h;h.$super=this;return h},create:function(){var b=this.extend();b.init.apply(b,arguments);return b},init:function(){},mixIn:function(b){for(var h in b)b.hasOwnProperty(h)&&(this[h]=b[h]);b.hasOwnProperty("toString")&&(this.toString=b.toString)},clone:function(){return this.init.prototype.extend(this)}},
            q=l.WordArray=r.extend({init:function(b,h){b=this.words=b||[];this.sigBytes=h!=p?h:4*b.length},toString:function(b){return(b||t).stringify(this)},concat:function(b){var h=this.words,a=b.words,j=this.sigBytes;b=b.sigBytes;this.clamp();if(j%4)for(var g=0;g<b;g++)h[j+g>>>2]|=(a[g>>>2]>>>24-8*(g%4)&255)<<24-8*((j+g)%4);else if(65535<a.length)for(g=0;g<b;g+=4)h[j+g>>>2]=a[g>>>2];else h.push.apply(h,a);this.sigBytes+=b;return this},clamp:function(){var b=this.words,h=this.sigBytes;b[h>>>2]&=4294967295<<
            32-8*(h%4);b.length=s.ceil(h/4)},clone:function(){var b=r.clone.call(this);b.words=this.words.slice(0);return b},random:function(b){for(var h=[],a=0;a<b;a+=4)h.push(4294967296*s.random()|0);return new q.init(h,b)}}),v=m.enc={},t=v.Hex={stringify:function(b){var a=b.words;b=b.sigBytes;for(var g=[],j=0;j<b;j++){var k=a[j>>>2]>>>24-8*(j%4)&255;g.push((k>>>4).toString(16));g.push((k&15).toString(16))}return g.join("")},parse:function(b){for(var a=b.length,g=[],j=0;j<a;j+=2)g[j>>>3]|=parseInt(b.substr(j,
                2),16)<<24-4*(j%8);return new q.init(g,a/2)}},a=v.Latin1={stringify:function(b){var a=b.words;b=b.sigBytes;for(var g=[],j=0;j<b;j++)g.push(String.fromCharCode(a[j>>>2]>>>24-8*(j%4)&255));return g.join("")},parse:function(b){for(var a=b.length,g=[],j=0;j<a;j++)g[j>>>2]|=(b.charCodeAt(j)&255)<<24-8*(j%4);return new q.init(g,a)}},u=v.Utf8={stringify:function(b){try{return decodeURIComponent(escape(a.stringify(b)))}catch(g){throw Error("Malformed UTF-8 data");}},parse:function(b){return a.parse(unescape(encodeURIComponent(b)))}},
            g=l.BufferedBlockAlgorithm=r.extend({reset:function(){this._data=new q.init;this._nDataBytes=0},_append:function(b){"string"==typeof b&&(b=u.parse(b));this._data.concat(b);this._nDataBytes+=b.sigBytes},_process:function(b){var a=this._data,g=a.words,j=a.sigBytes,k=this.blockSize,m=j/(4*k),m=b?s.ceil(m):s.max((m|0)-this._minBufferSize,0);b=m*k;j=s.min(4*b,j);if(b){for(var l=0;l<b;l+=k)this._doProcessBlock(g,l);l=g.splice(0,b);a.sigBytes-=j}return new q.init(l,j)},clone:function(){var b=r.clone.call(this);
                b._data=this._data.clone();return b},_minBufferSize:0});l.Hasher=g.extend({cfg:r.extend(),init:function(b){this.cfg=this.cfg.extend(b);this.reset()},reset:function(){g.reset.call(this);this._doReset()},update:function(b){this._append(b);this._process();return this},finalize:function(b){b&&this._append(b);return this._doFinalize()},blockSize:16,_createHelper:function(b){return function(a,g){return(new b.init(g)).finalize(a)}},_createHmacHelper:function(b){return function(a,g){return(new k.HMAC.init(b,
            g)).finalize(a)}}});var k=m.algo={};return m}(Math);
    (function(s){function p(a,k,b,h,l,j,m){a=a+(k&b|~k&h)+l+m;return(a<<j|a>>>32-j)+k}function m(a,k,b,h,l,j,m){a=a+(k&h|b&~h)+l+m;return(a<<j|a>>>32-j)+k}function l(a,k,b,h,l,j,m){a=a+(k^b^h)+l+m;return(a<<j|a>>>32-j)+k}function n(a,k,b,h,l,j,m){a=a+(b^(k|~h))+l+m;return(a<<j|a>>>32-j)+k}for(var r=CryptoJS,q=r.lib,v=q.WordArray,t=q.Hasher,q=r.algo,a=[],u=0;64>u;u++)a[u]=4294967296*s.abs(s.sin(u+1))|0;q=q.MD5=t.extend({_doReset:function(){this._hash=new v.init([1732584193,4023233417,2562383102,271733878])},
        _doProcessBlock:function(g,k){for(var b=0;16>b;b++){var h=k+b,w=g[h];g[h]=(w<<8|w>>>24)&16711935|(w<<24|w>>>8)&4278255360}var b=this._hash.words,h=g[k+0],w=g[k+1],j=g[k+2],q=g[k+3],r=g[k+4],s=g[k+5],t=g[k+6],u=g[k+7],v=g[k+8],x=g[k+9],y=g[k+10],z=g[k+11],A=g[k+12],B=g[k+13],C=g[k+14],D=g[k+15],c=b[0],d=b[1],e=b[2],f=b[3],c=p(c,d,e,f,h,7,a[0]),f=p(f,c,d,e,w,12,a[1]),e=p(e,f,c,d,j,17,a[2]),d=p(d,e,f,c,q,22,a[3]),c=p(c,d,e,f,r,7,a[4]),f=p(f,c,d,e,s,12,a[5]),e=p(e,f,c,d,t,17,a[6]),d=p(d,e,f,c,u,22,a[7]),
            c=p(c,d,e,f,v,7,a[8]),f=p(f,c,d,e,x,12,a[9]),e=p(e,f,c,d,y,17,a[10]),d=p(d,e,f,c,z,22,a[11]),c=p(c,d,e,f,A,7,a[12]),f=p(f,c,d,e,B,12,a[13]),e=p(e,f,c,d,C,17,a[14]),d=p(d,e,f,c,D,22,a[15]),c=m(c,d,e,f,w,5,a[16]),f=m(f,c,d,e,t,9,a[17]),e=m(e,f,c,d,z,14,a[18]),d=m(d,e,f,c,h,20,a[19]),c=m(c,d,e,f,s,5,a[20]),f=m(f,c,d,e,y,9,a[21]),e=m(e,f,c,d,D,14,a[22]),d=m(d,e,f,c,r,20,a[23]),c=m(c,d,e,f,x,5,a[24]),f=m(f,c,d,e,C,9,a[25]),e=m(e,f,c,d,q,14,a[26]),d=m(d,e,f,c,v,20,a[27]),c=m(c,d,e,f,B,5,a[28]),f=m(f,c,
                d,e,j,9,a[29]),e=m(e,f,c,d,u,14,a[30]),d=m(d,e,f,c,A,20,a[31]),c=l(c,d,e,f,s,4,a[32]),f=l(f,c,d,e,v,11,a[33]),e=l(e,f,c,d,z,16,a[34]),d=l(d,e,f,c,C,23,a[35]),c=l(c,d,e,f,w,4,a[36]),f=l(f,c,d,e,r,11,a[37]),e=l(e,f,c,d,u,16,a[38]),d=l(d,e,f,c,y,23,a[39]),c=l(c,d,e,f,B,4,a[40]),f=l(f,c,d,e,h,11,a[41]),e=l(e,f,c,d,q,16,a[42]),d=l(d,e,f,c,t,23,a[43]),c=l(c,d,e,f,x,4,a[44]),f=l(f,c,d,e,A,11,a[45]),e=l(e,f,c,d,D,16,a[46]),d=l(d,e,f,c,j,23,a[47]),c=n(c,d,e,f,h,6,a[48]),f=n(f,c,d,e,u,10,a[49]),e=n(e,f,c,d,
                C,15,a[50]),d=n(d,e,f,c,s,21,a[51]),c=n(c,d,e,f,A,6,a[52]),f=n(f,c,d,e,q,10,a[53]),e=n(e,f,c,d,y,15,a[54]),d=n(d,e,f,c,w,21,a[55]),c=n(c,d,e,f,v,6,a[56]),f=n(f,c,d,e,D,10,a[57]),e=n(e,f,c,d,t,15,a[58]),d=n(d,e,f,c,B,21,a[59]),c=n(c,d,e,f,r,6,a[60]),f=n(f,c,d,e,z,10,a[61]),e=n(e,f,c,d,j,15,a[62]),d=n(d,e,f,c,x,21,a[63]);b[0]=b[0]+c|0;b[1]=b[1]+d|0;b[2]=b[2]+e|0;b[3]=b[3]+f|0},_doFinalize:function(){var a=this._data,k=a.words,b=8*this._nDataBytes,h=8*a.sigBytes;k[h>>>5]|=128<<24-h%32;var l=s.floor(b/
        4294967296);k[(h+64>>>9<<4)+15]=(l<<8|l>>>24)&16711935|(l<<24|l>>>8)&4278255360;k[(h+64>>>9<<4)+14]=(b<<8|b>>>24)&16711935|(b<<24|b>>>8)&4278255360;a.sigBytes=4*(k.length+1);this._process();a=this._hash;k=a.words;for(b=0;4>b;b++)h=k[b],k[b]=(h<<8|h>>>24)&16711935|(h<<24|h>>>8)&4278255360;return a},clone:function(){var a=t.clone.call(this);a._hash=this._hash.clone();return a}});r.MD5=t._createHelper(q);r.HmacMD5=t._createHmacHelper(q)})(Math);

    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var svt = {};
    (function () {
        svt.XMLHttpRequest = XMLHttpRequest;
    })();
    (function () {
        /*
         This module can be placed to sovetnik script and we should inject it into mbr namespace or
         it can be placed to extension's background page and then we should inject it into svt namespace
         Think about it before refactoring!
         */

        var config = {
            _current: {
                apiHost: '%SOVETNIK_API_HOST%',
                storageHost: '%SOVETNIK_STORAGE_HOST%',
                settingsHost: '%SOVETNIK_SETTINGS_HOST%',
                staticHost: '%SOVETNIK_STORAGE_HOST%' //host to load domains.json and so on. It is used by injectors
            },

            _production: {
                apiHost: 'https://sovetnik.market.yandex.ru',
                storageHost: 'https://dl.metabar.ru',
                settingsHost: 'https://sovetnik.market.yandex.ru',
                landingHost: 'https://sovetnik.yandex.ru',
                staticHost: 'https://yastatic.net'
            },

            /**
             * return true if host is not a template-string
             * @param host
             * @returns {Boolean}
             * @private
             */
            _isPatched: function _isPatched(host) {
                return !/^%[^%]+%$/.test(host);
            },

            /**
             * get host value by name. If host has been patched, we have current host. Otherwise - host from production
             * @param {String} hostName apiHost, storageHost or settingsHost
             * @returns {String}
             * @private
             */
            _getHost: function _getHost(hostName) {
                if (this._current[hostName] && this._isPatched(this._current[hostName])) {
                    return this._current[hostName];
                }
                return this._production[hostName];
            },

            getApiHost: function getApiHost() {
                return this._getHost('apiHost');
            },

            getStorageHost: function getStorageHost() {
                return this._getHost('storageHost');
            },

            getSettingsURL: function getSettingsURL() {
                var host = this._getHost('settingsHost');
                if (host === this._production.settingsHost) {
                    return host + '/app/settings';
                } else {
                    return host + '/sovetnik';
                }
            },

            getSettingsURLMobile: function getSettingsURLMobile() {
                var host = this._getHost('settingsHost');
                if (host === this._production.settingsHost) {
                    return host + '/mobile/settings';
                } else {
                    return host + '/sovetnik-mobile';
                }
            },

            getSettingsHost: function getSettingsHost() {
                return this._getHost('settingsHost');
            },

            getClientEventUrl: function getClientEventUrl() {
                return this._getHost('apiHost') + '/client';
            },

            getLandingHost: function getLandingHost() {
                return this._getHost('landingHost');
            },

            getDomainsJSONUrl: function getDomainsJSONUrl() {
                if (this._getHost('staticHost') === this._production.staticHost) {
                    return this._getHost('staticHost') + '/sovetnik/_/script-data/domains.json';
                }

                return this._getHost('staticHost') + '/static/script-data/domains.json';
            },

            getUninstallUrl: function getUninstallUrl() {
                return this.getLandingHost() + '/goodbye';
            }
        };

        if (typeof mbr !== 'undefined') {
            mbr.config = config;
        }
        if (typeof svt !== 'undefined') {
            svt.config = config;
        }
    })();
    (function () {
        var config = svt.config;
        var apiHost = svt.config.getApiHost();

        var XMLHttpRequest = svt.XMLHttpRequest;

        var backend = {
            _checkUrl: apiHost + '/settings/check',
            _ysUrl: apiHost + '/sovetnik',
            _initExtensionUrl: apiHost + '/init-extension',
            _productsUrl: apiHost + '/products',
            _domainsUrl: config.getDomainsJSONUrl(),
            _clientEventUrl: config.getClientEventUrl(),

            _sendRequest: function _sendRequest(url, callback, errorCallback) {
                var xhr = new XMLHttpRequest();
                xhr.withCredentials = true;

                xhr.open('GET', url, true);

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            callback(xhr.responseText);
                        } else if (errorCallback) {
                            errorCallback();
                        }
                    }
                };

                if (errorCallback) {
                    xhr.onerror = function () {
                        errorCallback();
                    };
                }

                xhr.send(null);
            },

            _sendPostRequest: function _sendPostRequest(url, params, callback) {
                if (params === undefined) params = {};

                var xhr = new XMLHttpRequest();
                xhr.withCredentials = true;

                xhr.open('POST', url, true);
                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        callback && callback(xhr.responseText);
                    }
                };

                xhr.send(JSON.stringify(params));
            },

            _checkFromBackend: function _checkFromBackend(url, params, callback) {
                var paramsArr = [];
                params.hash = params.hash || new Date().getTime();

                for (var i in params) {
                    paramsArr.push(i + '=' + encodeURIComponent(params[i]));
                }
                if (paramsArr.length) {
                    url = url + '?' + paramsArr.join('&');
                }

                this._sendRequest(url, function (responseText) {
                    if (responseText) {
                        var response = JSON.parse(responseText);
                        if (response.hasOwnProperty('status')) {
                            callback(response.status);
                        }
                    }
                });
            },

            _getRequestInterval: function _getRequestInterval() {
                var startInterval = 30000;

                this._attemptCount = this._attemptCount || 0;

                return startInterval + Math.pow(2, this._attemptCount++) * 1000;
            },

            loadDomainsInfo: function loadDomainsInfo(callback) {
                var _this = this;

                var timeoutId = undefined;

                if (svt.setTimeout) {
                    timeoutId = svt.setTimeout(function () {
                        return _this.loadDomainsInfo(callback);
                    }, this._getRequestInterval());
                } else {
                    timeoutId = setTimeout(function () {
                        return _this.loadDomainsInfo(callback);
                    }, this._getRequestInterval());
                }

                var url = this._domainsUrl + '?hash=' + Date.now();
                this._sendRequest(url, function (responseText) {
                    if (responseText) {
                        try {
                            var domainsInfo = JSON.parse(responseText);
                            if (svt.clearTimeout) {
                                svt.clearTimeout(timeoutId);
                            } else {
                                clearTimeout(timeoutId);
                            }
                            callback(domainsInfo);
                        } catch (ex) {}
                    }
                });
            },

            isDomainDisabled: function isDomainDisabled(domain, callback) {
                this._checkFromBackend(this._checkUrl, { domain: domain }, callback);
            },

            isOfferRejected: function isOfferRejected(callback) {
                this._checkFromBackend(this._checkUrl, { offer: true }, callback);
            },

            isSovetnikRemoved: function isSovetnikRemoved(callback) {
                this._checkFromBackend(this._checkUrl, { removed: true }, callback);
            },

            isSecondScript: function isSecondScript(clid, affId, callback) {
                this._checkFromBackend(this._checkUrl, {
                    affId: affId,
                    clid: clid
                }, callback);
            },

            setStartedInfo: function setStartedInfo(callback) {
                this._sendPostRequest(this._ysUrl, { version: 1 }, callback);
            },

            /**
             * get url with params for request
             * @param {Object} params
             * @returns {string}
             * @private
             */
            _getProductsUrl: function _getProductsUrl() {
                var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

                var qs = Object.keys(params).map(function (key) {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
                }).join('&');

                return this._productsUrl + '?' + qs;
            },

            sendProductRequest: function sendProductRequest(params, callback) {
                this._sendRequest(this._getProductsUrl(params), callback, function () {
                    return callback({ error: 'server' });
                });
            },

            initExtension: function initExtension(settings, callback) {
                var _this2 = this;

                var url = this._initExtensionUrl + '?settings=' + encodeURIComponent(JSON.stringify(settings)) + '&hash=' + Date.now();

                var timeoutId = undefined;

                if (svt.setTimeout) {
                    timeoutId = svt.setTimeout(function () {
                        return _this2.initExtension(settings, callback);
                    }, this._getRequestInterval());
                } else {
                    timeoutId = setTimeout(function () {
                        return _this2.loadDomainsInfo(settings, callback);
                    }, this._getRequestInterval());
                }

                this._sendRequest(url, function (initData) {
                    if (initData) {
                        try {
                            if (svt.clearTimeout) {
                                svt.clearTimeout(timeoutId);
                            } else {
                                clearTimeout(timeoutId);
                            }
                            callback(initData);
                        } catch (ex) {}
                    }
                });
            },

            sendSovetnikStats: function sendSovetnikStats(params, callback) {
                this._sendPostRequest(this._clientEventUrl, params, callback);
            }
        };

        svt.backend = backend;
    })();
    (function () {
        var backend = svt.backend;

        backend.setStartedInfo();
    })();
    (function () {
        svt.messaging = {
            onMessage: function onMessage(listener) {
                var _this3 = this;

                if (!chrome.runtime) {
                    setTimeout(function () {
                        return _this3.onMessage(listener);
                    }, 500);
                    return;
                }

                chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
                    var fromTab = sender && sender.tab && sender.tab.id && sender.tab.url;

                    if (fromTab) {
                        return listener(request, sendResponse, {
                            tabId: sender.tab.id,
                            tabUrl: sender.tab.url
                        });
                    } else {
                        listener(request, sendResponse);
                    }
                });
            },

            sendMessage: function sendMessage(msg, tabInfo) {
                if (tabInfo && tabInfo.tabId) {
                    chrome.tabs.sendMessage(tabInfo.tabId, msg);
                }
            }
        };
    })();

    (function () {
        var isOpera = window.navigator.userAgent.indexOf('OPR') > -1 || window.navigator.userAgent.indexOf('Opera') > -1;
        var isYandexBrowser = window.navigator.userAgent.indexOf('YaBrowser') !== -1;

        var notificationQueue = {};
        var cachedNotification = undefined;

        var Notification = (function () {
            function Notification(link, buttons, transactionId, url, notificationData, tabId) {
                _classCallCheck(this, Notification);

                this.link = link;
                this.buttons = buttons;
                this.transactionId = transactionId;
                this.url = url;
                this.notificationData = notificationData;
                this.tabId = tabId;

                if (tabId) {
                    this.timeout = setTimeout(this.removeFromQueue.bind(this), 10 * 60 * 1000);
                }
            }

            _createClass(Notification, [{
                key: 'show',
                value: function show() {
                    var _this4 = this;

                    chrome.notifications.create('svt', this.notificationData, function () {
                        cachedNotification = _this4;
                        _this4.onShown();
                    });
                }
            }, {
                key: 'onClosed',
                value: function onClosed(needSendStats) {
                    if (needSendStats) {
                        var clientEvent = {
                            transaction_id: this.transactionId,
                            interaction: 'notification_close',
                            interaction_details: getAvailabilityStatus(),
                            type_view: 'notification',
                            url: this.url
                        };

                        svt.backend.sendSovetnikStats(clientEvent);
                    }

                    this.removeFromQueue();
                    this.timeout && clearTimeout(this.timeout);
                }
            }, {
                key: 'onShown',
                value: function onShown() {
                    var clientEvent = {
                        transaction_id: this.transactionId,
                        interaction: 'notification_shown',
                        interaction_details: getAvailabilityStatus(),
                        type_view: 'notification',
                        url: this.url
                    };

                    svt.backend.sendSovetnikStats(clientEvent);
                }
            }, {
                key: 'onClicked',
                value: function onClicked() {
                    svt.tabs.create(this.link);
                }
            }, {
                key: 'onButtonClicked',
                value: function onButtonClicked(index) {
                    if (this.buttons && index < this.buttons.length) {
                        svt.tabs.create(this.buttons[index].link);
                    }
                }
            }, {
                key: 'removeFromQueue',
                value: function removeFromQueue() {
                    if (this.tabId && notificationQueue[this.tabId] === this) {
                        delete notificationQueue[this.tabId];
                    }
                }
            }]);

            return Notification;
        })();

        function showNotification(notificationInfo, tabInfo) {
            var title = notificationInfo.title;
            var text = notificationInfo.text;
            var icon = notificationInfo.icon;
            var link = notificationInfo.link;
            var contextMessage = notificationInfo.contextMessage;
            var mainPhoto = notificationInfo.mainPhoto;
            var buttons = notificationInfo.buttons;
            var transactionId = notificationInfo.transactionId;
            var time = notificationInfo.time;
            var url = notificationInfo.url;

            if (!getAvailabilityStatus()) {
                return;
            }

            var templateType = mainPhoto ? 'image' : 'basic';

            var notification = {
                type: templateType,
                title: title,
                message: text,
                isClickable: true
            };

            if (mainPhoto && !isOpera || !icon) {
                if (mainPhoto && !isOpera) {
                    notification.imageUrl = mainPhoto;
                }

                if (isYandexBrowser) {
                    // jscs:disable maximumLineLength
                    //34х34px на прозрачном фоне + маска
                    icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAAAb5JREFUWAntVb1KA0EQnrkkJ1FT2qVQ0gh2IghWplAj8Q3S5wGSQrBK6W8KRdDU6a7QSERDev/eIaBoIb5AMJqMs8FAuCx3u9wKBu5guduZ7+b7duZmDiC8wgyMSQZQpjNbuCWZPWZPzF3upp9lvqA2SydAt/O1qoPXwWoJAaQ/EyItzfBJssXGAxAt920IL9dHmdlhv6lnXyFbxUaOiKqmCEWc63JmhNe3NPFE0gGEd5NCZLF8hTilhQ4SnsleNmnzFSLI4hH7HBE6JondsZSEOAdpLg067pdN7pWE9AkjdGyS2B1LWUh9P/MEiI/uAKb2ykIEIffcSVBiRHyVxdASEriVEb+BcC+wEN1W5k7rcTnvEK3tSNSen0nYiXp5/VQmJCozetlEK7d7nztEYMtwCNjmf1KTCGsxhPrF4caHDOe2jYxaN0C257Ff5bGfG/i47oKsLsgnk9NNp7DSHvhU79oZ6QfmVsYuLPFzzbKsq8WptftSCXuqpCFurDKg/LGmUqlNPlnl93T5Vqt143VSXbzOQKtwpyTFGhLkpUULryPEizSwT0dInufFm1jMmldg1sUrhAwhYQb+QQZ+AGEtdj7ypn8ZAAAAAElFTkSuQmCC';
                } else {
                    //80x80 px на белом фоне
                    icon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAAAqdJREFUeAHt2s0uA1EcBfD/tNWS+GiJRheIDYJEbHykg1gJYecFPIMlS0s2HsDOG9hYaZNuLFiwEixEojshdgjm3oSEdIw60vtvciaRtL1zxp3fnKujeG/BJtz+LBD7c5JBK0BAsAgEJCAoAMbZQAKCAmCcDSQgKADG2UACggJgnA0kICgAxtlAAoICYJwNJCAoAMbZQAKCAmCcDSQgKADG2UACggJgnA0kICgAxtlAAoICYJwNBAETYL7q+NLaQcXM7sasZDONFcc0v6imgWeXd5qdQuemB/CqPgE9l//etrZzJOfX9/bqZtubZHd9JvRKax1wClg4KcvW3um/2uxvz//r8aIO5nQJ+6NdkmlNRc1R9bhTwETck8WpbtVAUZNzCmgmtxAANiScTyPKKXTc+czTLUkxS7leN+eABm55uqde/UQFYH93mwz0pusSUQWgbaGPt7Az01Tzi6AGEL2licdjsjLXV3PAmn+YEHaGH7c0eweXYbt8eT0W8+yynxzOyuRI1n4Q4eLd3OlvIl9Egif3j0+yulmU55fX70P2eaohLmMDHTIRoI0PdUpbc7LifrV8UU0DzUl/3NIcHt9+GqRbUhbLoBm8pLJ7RlWARs3c0lzcPNhladAGg3dnz/v0VPdA1RJWp/OLCal5F/7FXFXuQkDwsqgALBaL4vu+/TKPo7Zq9486HjKu4megwSuXy/Y8crmclEqlH8+p2v1/PBg4qKKB4Dm4jZu/ibjeCoXCWz6ft1/mcdRW7f5Rx0PGVSxhtxXCvjuXMOan4/NA8BycxtlAkJ+ABAQFwDgbSEBQAIyzgQQEBcA4G0hAUACMs4EEBAXAOBtIQFAAjLOBBAQFwDgbSEBQAIyzgQQEBcA4G0hAUACMs4EEBAXAOBtIQFAAjL8DeaaYIEw40ZwAAAAASUVORK5CYII=';

                    // jscs:enable maximumLineLength
                }
            }

            if (contextMessage) {
                notification.contextMessage = contextMessage;
            }

            if (time) {
                notification.eventTime = time;
            }

            notification.iconUrl = icon;

            if (buttons && buttons.length && !isOpera) {
                notification.buttons = buttons.map(function (button) {
                    return {
                        title: button.title
                    };
                });
            }

            if (tabInfo && tabInfo.tabId) {
                svt.tabs.getActiveTabId(function (tabId) {
                    var ntf = new Notification(link, buttons, transactionId, url, notification, tabInfo.tabId);
                    if (tabId === tabInfo.tabId) {
                        ntf.show();
                    } else {
                        notificationQueue[tabInfo.tabId] = ntf;
                    }
                });
            }
        }

        function getAvailabilityStatus() {
            if (chrome.notifications) {
                if (isYandexBrowser) {
                    return 'yandex';
                } else if (isOpera) {
                    return 'opera';
                } else {
                    return 'chrome';
                }
            }
            return null;
        }

        function init() {
            chrome.notifications.onClosed.addListener(function (notificationId, byUser) {
                cachedNotification && cachedNotification.onClosed(byUser);
            });

            chrome.notifications.onClicked.addListener(function (notificationId) {
                if (cachedNotification) {
                    cachedNotification.onClicked();
                }
            });

            chrome.notifications.onButtonClicked.addListener(function (notificationId, buttonId) {
                if (cachedNotification) {
                    cachedNotification.onButtonClicked(buttonId);
                }
            });

            chrome.tabs.onActivated.addListener(function (_ref) {
                var tabId = _ref.tabId;

                if (notificationQueue[tabId]) {
                    notificationQueue[tabId].show();
                }
            });
        }

        if (getAvailabilityStatus()) {
            init();
        }

        svt.notifications = {
            showNotification: showNotification,
            getAvailabilityStatus: getAvailabilityStatus
        };
    })();
    (function () {
        var prefix = SOVETNIK_SETTINGS.sovetnikExtension ? '' : 'sovetnik';

        var storage = {
            get: function get(name) {
                name = prefix + name;
                return localStorage.getItem(name);
            },

            set: function set(name, value) {
                name = prefix + name;
                localStorage.setItem(name, value);
            }
        };

        svt.storage = storage;
    })();
    (function () {
        var cookies = {
            get: function get(host, key, callback) {
                chrome.cookies.getAllCookieStores(function (cookieStores) {
                    var cookieStoreId = '0';
                    if (cookieStores && cookieStores.length) {
                        cookieStoreId = cookieStores[0].id;
                    }

                    chrome.cookies.get({
                        url: host,
                        name: key,
                        storeId: cookieStoreId
                    }, function (cookie) {
                        callback && callback(cookie && cookie.value);
                    });
                });
            },

            set: function set(host, key, value, expires, callback) {
                var cookieObj = {
                    url: host,
                    name: key,
                    value: value
                };

                if (expires) {
                    if (expires instanceof Date) {
                        cookieObj.expirationDate = Math.round(expires.getTime() / 1000);
                    }
                }

                chrome.cookies.set(cookieObj, function () {
                    callback && callback();
                });
            }
        };

        svt.cookies = cookies;
    })();
    (function () {
        var tabs = {
            create: function create(url) {
                chrome.windows.getAll({}, function (windows) {
                    if (windows && windows.length) {
                        var currentWindow = undefined;
                        var normalWindows = windows.filter(function (win) {
                            return win && win.type === 'normal';
                        });

                        if (normalWindows.length) {
                            var focusedWindows = normalWindows.filter(function (win) {
                                return win && win.focused;
                            });

                            currentWindow = focusedWindows.length ? focusedWindows[0] : normalWindows[0];
                        } else {
                            currentWindow = windows[0];
                        }

                        if (currentWindow.id) {
                            chrome.tabs.create({
                                url: url,
                                windowId: currentWindow.id
                            });
                        }
                    }
                });
            },

            onRemoved: function onRemoved(callback) {
                chrome.tabs.onRemoved.addListener(callback);
            },

            /**
             * Индекс вкладки может измениться при загрузке во вкладке новой страницы. Нужно на это реагировать
             *
             * @param {Function} callback функция, принимающая currentIndex и prevIndex
             */
            onReplaced: function onReplaced(callback) {
                chrome.tabs.onReplaced.addListener(callback);
            },

            onActivate: function onActivate(callback) {
                var _this5 = this;

                chrome.tabs.onActivated.addListener(function (_ref2) {
                    var tabId = _ref2.tabId;
                    return callback(tabId);
                });
                chrome.tabs.onUpdated.addListener(function (tabId, change) {
                    if (change && change.status === 'complete') {
                        _this5.getActiveTabId(function (activeTabId) {
                            if (activeTabId === tabId) {
                                callback(tabId);
                            }
                        });
                    }
                });
                chrome.tabs.onCreated.addListener(function (tab) {
                    if (tab && tab.id) {
                        callback(tab.id);
                    }
                });
                chrome.windows.onFocusChanged.addListener(function () {
                    _this5.getActiveTabId(callback);
                });
            },

            onUpdate: function onUpdate(callback) {
                var _this6 = this;

                chrome.tabs.onUpdated.addListener(function (tabId, change) {
                    if (change && change.status === 'loading' && change.url) {
                        _this6.getActiveTabId(function (activeTabId) {
                            if (activeTabId === tabId) {
                                callback(tabId);
                            }
                        });
                    }
                });
            },

            getActiveTabId: function getActiveTabId(callback) {
                chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                    callback(tabs && tabs.length && tabs[0].id);
                });
            },

            getActiveTabUrl: function getActiveTabUrl(callback) {
                chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                    callback(tabs && tabs.length && tabs[0].url);
                });
            },

            getTabUrl: function getTabUrl(id, callback) {
                chrome.tabs.get(id, function (tab) {
                    if (!chrome.runtime.lastError) {
                        callback(tab && tab.url);
                    }
                });
            }
        };

        svt.tabs = tabs;
    })();
    (function () {
        var storage = svt.storage;

        var cacheInterval = 7 * 24 * 60 * 60 * 1000;
        var domains = storage.get('disabledDomains');
        domains = domains ? JSON.parse(domains) : {};

        //invalidate cache
        var currentTime = Date.now();
        for (var domain in domains) {
            if (domains[domain] && currentTime - domains[domain] > cacheInterval) {
                domains[domain] = 0;
            }
        }

        var disabledDomains = {
            isDomainDisabled: function isDomainDisabled(domain) {
                return !!domains[domain];
            },

            disableDomain: function disableDomain(domain) {
                domains[domain] = Date.now();
                storage.set('disabledDomains', JSON.stringify(domains));
            },

            enableDomain: function enableDomain(domain) {
                delete domains[domain];
                storage.set('disabledDomains', JSON.stringify(domains));
            }
        };

        svt.disabledDomains = disabledDomains;
    })();
    (function () {
        svt.settingsPage = {
            _customFunc: null,

            addCustomFunc: function addCustomFunc(func) {
                this._customFunc = func;
            },

            open: function open() {
                this._customFunc && this._customFunc();
            }
        };
    })();

    (function () {
        var storage = svt.storage;
        var settingsPage = svt.settingsPage;
        var notifications = svt.notifications;
        var config = svt.config;

        var SECOND_SCRIPT_UPDATE_INTERVAL = 24 * 60 * 60 * 1000;

        var isOfferRejected = storage.get('offerRejected');
        var isSovetnikRemoved = storage.get('sovetnikRemoved');
        if (isSovetnikRemoved) {
            isSovetnikRemoved = JSON.parse(isSovetnikRemoved);
        }
        var secondScriptTrackDate = storage.get('secondScript');
        secondScriptTrackDate = secondScriptTrackDate ? parseInt(secondScriptTrackDate, 10) : 0;
        var isSecondScript = Date.now() - secondScriptTrackDate < SECOND_SCRIPT_UPDATE_INTERVAL;

        var settings = SOVETNIK_SETTINGS;
        var userSettings = storage.get('userSettings');
        if (!userSettings) {
            userSettings = {};
        } else {
            userSettings = JSON.parse(userSettings);
        }
        for (var i in userSettings) {
            if (userSettings.hasOwnProperty(i)) {
                settings[i] = userSettings[i];
            }
        }

        settings.extensionStorage = true;

        var presavedClid = storage.get('yandex.statistics.clid.21');
        if (!presavedClid) {
            presavedClid = storage.get('sovetnik.yandex.statistics.clid.21'); //old
        }

        if (presavedClid) {
            var clid = presavedClid;
            if (typeof clid === 'string') {
                clid = clid.replace(/[^\d\-]/g, '');
            }
            settings.clid = parseInt(clid, 10);
        }

        if (notifications) {
            settings.notificationStatus = notifications.getAvailabilityStatus();
        }

        if (settings.browser === 'chrome') {
            if (window.navigator.userAgent.indexOf('OPR') > -1 || window.navigator.userAgent.indexOf('Opera') > -1) {
                settings.browser = 'opera';
            }
        }

        var onUserSettingsListeners = [];

        var sovetnikInfo = {
            isOfferRejected: isOfferRejected,
            isSecondScript: isSecondScript,
            isSovetnikRemoved: isSovetnikRemoved,
            withButton: settings.withButton,

            settings: settings,
            url: typeof SCRIPT_URL !== 'undefined' ? SCRIPT_URL : '',

            setCustomSettingsPage: function setCustomSettingsPage(func) {
                settings.customSettingsPage = true;
                settingsPage.addCustomFunc(func);
            },

            setOfferRejected: function setOfferRejected() {
                this.isOfferRejected = true;
                storage.set('offerRejected', 'true');
            },

            setSovetnikRemovedState: function setSovetnikRemovedState(state) {
                this.isSovetnikRemoved = state;
                storage.set('sovetnikRemoved', JSON.stringify(state));
            },

            setSecondScript: function setSecondScript() {
                this.isSecondScript = true;
                storage.set('secondScript', JSON.stringify(Date.now()));
            },
            setUserSetting: function setUserSetting(name, value) {
                settings[name] = value;
                userSettings[name] = value;
                storage.set('userSettings', JSON.stringify(userSettings));

                onUserSettingsListeners.forEach(function (listener) {
                    try {
                        listener();
                    } catch (ex) {}
                });
            },

            onUserSettingChanged: function onUserSettingChanged(listener) {
                onUserSettingsListeners.push(listener);
            },

            setClid: function setClid(clid) {
                this.settings.clid = clid;
                storage.set('yandex.statistics.clid.21', clid);

                onUserSettingsListeners.forEach(function (listener) {
                    try {
                        listener();
                    } catch (ex) {}
                });
            },

            isSovetnikExtension: function isSovetnikExtension() {
                return !!settings.sovetnikExtension;
            },

            getUninstallUrl: function getUninstallUrl() {
                var reason = arguments.length <= 0 || arguments[0] === undefined ? 'app-remove' : arguments[0];

                var path = config.getUninstallUrl();

                var params = ['clid=' + settings.clid, 'aff_id=' + settings.affId, 'disabling_type=app-remove'].join('&');

                return path + '?' + params;
            }
        };

        svt.sovetnikInfo = sovetnikInfo;
    })();

    (function () {
        var storage = svt.storage;
        var backend = svt.backend;
        var disabledDomains = svt.disabledDomains;
        var sovetnikInfo = svt.sovetnikInfo;

        var SITE_INFO_UPDATE_INTERVAL = 24 * 60 * 60 * 1000;
        var domainRE = /(https?):\/\/([^\/]+)/;
        var yandexRE = /ya(ndex)?\./;
        var marketRE = /(market\.yandex)|(market\-click2\.yandex)/;
        var sovetnikRE = /^https?:\/\/sovetnik/;
        var simpleMarketRE = /market/i;

        var siteInfo = {
            _domainsInfo: null,
            _customCheckFunction: null,

            _init: function _init() {
                var domains = storage.get('domains') || 'null';
                if (domains) {
                    this._domainsInfo = JSON.parse(domains);
                }

                var lastUpdateTime = parseInt(storage.get('lastUpdateTime'), 10) || 0;
                if (Date.now() - lastUpdateTime > SITE_INFO_UPDATE_INTERVAL) {
                    this._loadData();
                }
            },

            _loadData: function _loadData() {
                backend.loadDomainsInfo((function (domainsInfo) {
                    if (domainsInfo) {
                        this._domainsInfo = domainsInfo;
                        storage.set('domains', JSON.stringify(domainsInfo));
                        storage.set('lastUpdateTime', Date.now());
                    }
                }).bind(this));
            },

            getDomainData: function getDomainData(domain) {
                var currentHash;
                while (this._domainsInfo && domain && domain.indexOf('.') !== -1) {
                    var currentHash = CryptoJS.MD5(domain).toString();

                    if (this._domainsInfo[currentHash]) {
                        return this._domainsInfo[currentHash];
                    }

                    domain = domain.replace(/^[^\.]+\./, '');
                }

                return null;
            },

            canUseSovetnik: function canUseSovetnik(url, referrerUrl) {
                if (sovetnikInfo.withButton) {
                    return true;
                }
                if (sovetnikInfo.isSecondScript || sovetnikInfo.isOfferRejected || sovetnikInfo.isSovetnikRemoved) {
                    return false;
                }

                if (this._customCheckFunction && !this._customCheckFunction(url, referrerUrl)) {
                    return false;
                }

                if (sovetnikRE.test(url)) {
                    return true;
                }

                if (domainRE.test(url)) {
                    var protocol = RegExp.$1;
                    var domain = RegExp.$2;
                    var referrerDomain;
                    if (domainRE.test(referrerUrl)) {
                        referrerDomain = RegExp.$2;
                    }

                    var domainInfo = this.getDomainData(domain);
                    var referrerInfo = this.getDomainData(referrerDomain);

                    if (disabledDomains.isDomainDisabled(domain)) {
                        return false;
                    }

                    if (domainInfo && domainInfo.rules && domainInfo.rules.length) {
                        if (domainInfo.rules.indexOf('blacklisted') !== -1) {
                            return false;
                        }
                        if (domainInfo.rules.indexOf('yandex-web-partner') !== -1) {
                            return false;
                        }
                    }

                    if (referrerInfo && referrerInfo.rules && referrerInfo.rules.length) {
                        if (referrerInfo.rules.indexOf('blacklisted-by-referrer') !== -1) {
                            return false;
                        }
                    }

                    if (yandexRE.test(domain)) {
                        return false;
                    }
                } else {
                    return false;
                }
                return true;
            },

            setCustomCheckFunction: function setCustomCheckFunction(func) {
                this._customCheckFunction = func;
            }
        };

        siteInfo._init();

        svt.siteInfo = siteInfo;
    })();
    (function () {
        var backend = svt.backend;
        var sovetnikInfo = svt.sovetnikInfo;
        var storage = svt.storage;

        var PING_INTERVAL = 12 * 60 * 60 * 1000;
        var CHECK_INTERVAL = 30 * 60 * 1000;

        function canSendPing() {
            return !sovetnikInfo.isOfferRejected && !sovetnikInfo.isSovetnikRemoved;
        }

        function isTimeToSendPing() {
            var lastSentTime = storage.get('ping_last_sent_time') || 0;
            lastSentTime = parseInt(lastSentTime, 10);
            return new Date().getTime() - lastSentTime > PING_INTERVAL;
        }

        function trySendPing() {
            if (canSendPing && isTimeToSendPing()) {
                backend.sendSovetnikStats({
                    settings: {
                        affId: sovetnikInfo.settings.affId,
                        clid: sovetnikInfo.settings.clid
                    },
                    event: 'ping'
                }, function () {
                    storage.set('ping_last_sent_time', new Date().getTime());
                });
            }
        }

        if (canSendPing()) {
            trySendPing();
            setInterval(trySendPing, CHECK_INTERVAL);
        }
    })();
    (function () {
        var messaging = svt.messaging;
        var siteInfo = svt.siteInfo;
        var sovetnikInfo = svt.sovetnikInfo;
        var backend = svt.backend;
        var storage = svt.storage;
        var disabledDomains = svt.disabledDomains;
        var settingsPage = svt.settingsPage;
        var notifications = svt.notifications;

        messaging.onMessage(function (message, callback, tabInfo) {
            if (message.type) {
                switch (message.type) {
                    case 'getDomainData':
                        callback && callback(siteInfo.getDomainData(message.domain));
                        break;
                    case 'getSovetnikInfo':
                        callback && callback(sovetnikInfo);
                        break;
                    case 'canUseSovetnik':
                        callback && callback(siteInfo.canUseSovetnik(message.url, message.referrer));
                        break;
                    case 'secondScript':
                        var _sovetnikInfo$settings = sovetnikInfo.settings,
                            clid = _sovetnikInfo$settings.clid,
                            affId = _sovetnikInfo$settings.affId;

                        backend.isSecondScript(clid, affId, function (isSecondScript) {
                            if (isSecondScript) {
                                sovetnikInfo.setSecondScript();
                            }
                        });
                        break;
                    case 'sovetnikRemoved':
                        backend.isSovetnikRemoved(function (isRemoved) {
                            if (isRemoved) {
                                sovetnikInfo.setSovetnikRemovedState(true);
                            }
                        });
                        break;
                    case 'offerRejected':
                        backend.isOfferRejected(function (isOfferRejected) {
                            if (isOfferRejected) {
                                sovetnikInfo.setOfferRejected();
                            }
                        });
                        break;
                    case 'domainDisabled':
                        setTimeout(function () {
                            backend.isDomainDisabled(message.domain, function (domainDisabled) {
                                if (domainDisabled) {
                                    disabledDomains.disableDomain(message.domain);
                                }
                            });
                        }, 1500);
                        break;
                    case 'domainEnabled':
                        disabledDomains.enableDomain(message.domain);
                        break;
                    case 'showSettingsPage':
                        settingsPage.open();
                        break;
                    case 'showNotification':
                        notifications && notifications.showNotification(message.notification, tabInfo);
                        break;
                }
            }
        });
    })();

    (function () {
        var siteInfo = svt.siteInfo;
        var sovetnikInfo = svt.sovetnikInfo;

        var API = {
            /**
             * set custom check function to disable Sovetnik according to current URL and referrer URL
             * @param {Function(currentUrl, referrerUrl)} handler
             */
            setCheckFunction: function setCheckFunction(handler) {
                siteInfo.setCustomCheckFunction(handler);
            },

            setOpenSettingsFunction: function setOpenSettingsFunction(handler) {
                sovetnikInfo.setCustomSettingsPage(handler);
            },
            /**
             * enable or disable shops' popup onHover showing
             * @param {Boolean} isEnabled
             */
            setAutoShowPopup: function setAutoShowPopup(isEnabled) {
                sovetnikInfo.setUserSetting('autoShowShopList', isEnabled);
            },

            /**
             * set current user's city
             * @param {Number} cityId
             */
            setActiveCity: function setActiveCity(cityId) {
                sovetnikInfo.setUserSetting('activeCity', { id: cityId });
            },

            /**
             * set current user's country
             * @param {Number} countryId
             */
            setActiveCountry: function setActiveCountry(countryId) {
                sovetnikInfo.setUserSetting('activeCountry', { id: countryId });
            },

            setAutoDetectRegion: function setAutoDetectRegion() {
                sovetnikInfo.setUserSetting('activeCity', null);
                sovetnikInfo.setUserSetting('activeCountry', null);
            },

            /**
             * set true if user wants to receive offers from other regions or false if he doesn't
             * @param {Boolean} otherRegionsEnabled
             */
            setOtherRegions: function setOtherRegions(otherRegionsEnabled) {
                sovetnikInfo.setUserSetting('otherRegions', otherRegionsEnabled);
            },

            /**
             * set sovetnik removed state
             * @param {Boolean} state
             */
            setRemovedState: function setRemovedState(state) {
                sovetnikInfo.setSovetnikRemovedState(state);
            }
        };

        svt.API = API;
    })();
    (function () {
        var global = typeof window === 'undefined' ? this : window;

        var sovetnik = svt.API || {};

        global.sovetnik = sovetnik;
    })();
})({
    "affId": "1025",
    "clid": "2210499",
    "applicationName": "Instant Translate",
    "browser": "chrome-travelbar"
},window.chrome.extension.getURL('src/ext/ps/sovetnik.min.js'));
