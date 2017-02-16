(function () {
    var PID = 'ap_id=chernikovalex';
    var PARAMS_REGEX = /([A-z0-9]+)\=/;

    chrome.webRequest.onBeforeRequest.addListener(function (data) {
        if (ke.ext.util.storageUtil.isTrueOption('monetization')
            && data.url.indexOf(PID) === -1
            && data.type === 'main_frame') {
            return {
                redirectUrl: data.url + (!PARAMS_REGEX.test(data.url) ? ('?' + PID) : ('&' + PID))
            };
        }
    }, {
        urls: ['http://bundlehunt.com/*', 'https://bundlehunt.com/*', 'http://www.bundlehunt.com/*', 'https://www.bundlehunt.com/*']
    }, ['blocking']);
})();