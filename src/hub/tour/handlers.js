/* Kumquat Hub Tour Handlers
 * 
 **/

(function (undefined) {

    pl.extend(ke.app.handlers, {
        gotIt: function (event) {
            chrome.tabs.getCurrent(function (tab) {
                chrome.tabs.remove(tab.id, function () {
                });
            });
        },

        upgrade: function (event) {
            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'opt', 'buy')
            });

            _gaq.push(['_trackEvent', 'upgrade-pro', 'tour']);
        },

        stateChangeCallbacks: {
            monetization: function (f) {
                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'option', 'toggleMonetization'),
                    state: f
                });
            },

            'double_click': function (f) {
                ke.ext.util.storageUtil.requestBackgroundOption('setOptionAsBoolean', ['double_click', f]);
            }
        }
    });

})();