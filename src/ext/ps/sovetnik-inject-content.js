(function () {
    'use strict';

    var svt = {};
    (function () {
        var postMessageParser = {
            /**
             * return message if postMessage event was sent from our script
             * @param  {PostMessage} event
             * @return {Object}
             */
            getMessageFromEvent: function getMessageFromEvent(event) {
                if (!event.data) {
                    return null;
                }

                var message = event.data;

                if (typeof message === 'string') {
                    try {
                        message = JSON.parse(message);
                    } catch (ex) {
                        return null;
                    }
                }

                if (message && message.type === 'MBR_ENVIRONMENT' && !message.hasOwnProperty('response') && (message.clid || message.affId)) {
                    return message;
                }

                return null;
            }
        };

        svt.postMessageParser = postMessageParser;
    })();
    (function () {
        var messaging = {
            sendMessage: function sendMessage(msg, responseCallback) {
                responseCallback = responseCallback || function () {
                };
                chrome.runtime.sendMessage(msg, function () {
                    var args = arguments;
                    setTimeout(function () {
                        responseCallback.apply(this, args);
                    }, 0);
                });

                return this;
            }
        };

        svt.messaging = messaging;
    })();

    (function () {
        var messaging = svt.messaging;

        function canUseSovetnik(url, referrer, successCallback) {
            messaging.sendMessage({
                type: 'canUseSovetnik',
                url: url,
                referrer: referrer
            }, function (res) {
                if (res) {
                    successCallback();
                }
            });
        }

        svt.canUseSovetnik = canUseSovetnik;
    })();

    (function () {
        function injectScript(doc, url, settings) {
            var script = doc.createElement('script');
            var params = [];
            params.push('mbr=true');
            params.push('settings=' + encodeURIComponent(JSON.stringify(settings)));
            params = params.join('&');

            url += '?' + params;

            script.setAttribute('src', url);
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('charset', 'UTF-8');

            doc.body.appendChild(script);
        }

        svt.injectScript = injectScript;
    })();

    (function () {
        var messaging = svt.messaging;
        var injectScript = svt.injectScript;
        var canUseSovetnik = svt.canUseSovetnik;
        var postMessageParser = svt.postMessageParser;

        function initListeners() {
            var sovetnikInfo = null;
            var canUse = null;

            messaging.sendMessage({
                type: 'getSovetnikInfo'
            }, function (info) {
                sovetnikInfo = info;

                if (sovetnikInfo) {
                    canUseSovetnik(document.URL, document.referrer, function () {
                        injectScript(document, sovetnikInfo.url, sovetnikInfo.settings);
                    });
                }
            });

            window.addEventListener('message', function (event) {
                var message = postMessageParser.getMessageFromEvent(event, window.location.origin);

                if (message && sovetnikInfo && sovetnikInfo.settings) {
                    if (sovetnikInfo.settings.clid) {
                        if (sovetnikInfo.settings.clid != message.clid) {
                            return;
                        }
                    } else if (sovetnikInfo.settings.affId != message.affId) {
                        return;
                    }
                    //message from our script
                    if (message.command) {
                        switch (message.command) {
                            case 'getDomainData':
                                messaging.sendMessage({
                                    type: 'getDomainData',
                                    domain: message.data.domain
                                }, function (domainData) {
                                    message.response = domainData;
                                    window.postMessage(JSON.stringify(message), event.origin);
                                });
                                break;
                            case 'getSovetnikInfo':
                                message.response = sovetnikInfo.settings;
                                window.postMessage(JSON.stringify(message), event.origin);
                                break;
                            case 'serverMessage':
                                messaging.sendMessage({
                                    type: message.data.type,
                                    domain: window.location.host
                                });
                                break;
                            case 'showSettingsPage':
                                messaging.sendMessage({
                                    type: 'showSettingsPage'
                                });
                                break;

                        }
                    }
                }
            }, false);
        }

        if (window && window.document && window.self === window.top) {
            if (window.document.readyState === 'complete' || window.document.readyState === 'interactive') {
                initListeners();
            } else {
                window.document.addEventListener("DOMContentLoaded", initListeners, false);
            }
        }
    })();
})();