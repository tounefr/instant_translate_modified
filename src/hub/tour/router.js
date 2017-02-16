/* Kumquat Hub Options Router
 * 
 **/

// Google Analytics Initialization
var _gaq = _gaq || [];
_gaq.push(['_setAccount', ke.getTrackingCode()]);
_gaq.push(['_trackPageview']);

if (ke.IS_OPERA) {
    ke.attachGA();
}

(function (undefined) {

    pl.extend(ke.app, {
        import: [
            'ext.const.storage',
            'ext.util.storageUtil',
            'ext.tpl',
            'ui_views.i18n',
            'ui_components.ss_selector.ss_selector'
        ],

        temp: {
            currentBid: 1
        },

        callbacksInitialization: {},

        init: function () {
            document.title = ke.getLocale("Tour_Title");

            ke.ui.ss_selector.init(ke.app.handlers.stateChangeCallbacks);

            if (!ke.IS_OPERA) {
                ke.import('lib.ga');
            }

            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                {fn: 'isTrueOption', args: ['monetization']},
                {fn: 'isTrueOption', args: ['double_click']},
                {fn: 'isTrueOption', args: ['mon_is_cis']}
            ], function (responses) {
                ke.ui.ss_selector.setState('monetization', responses[0].response);
                ke.ui.ss_selector.setState('double_click', responses[1].response);

                if (ke.isMonetizable) {
                    // if from CIS
                    if (responses[2].response) {
                        $('.monetization-block').show();

                        $('#Tour_MonDesc').attr('id', 'Tour_MonCisDesc');
                        $('#Tour_ProFeature3').attr('id', 'Tour_ProFeature3_Cis');

                        if (!ke.IS_CHROME) {
                            $('.buy-pro').remove();
                            $('.monetization-block')
                                .detach()
                                .prependTo('.first-col')
                                .removeClass('wide-block');

                            $('#Tour_MonLater').remove();
                            $('#Tour_MonCis').attr('id', 'Tour_Mon');
                            $('#Tour_MonDesc').attr('id', 'Tour_MonNotChromeDesc');
                        }
                    } else {
                        if (ke.IS_CHROME) {
                            $('.monetization-block').show();
                        }
                    }
                }

                ke.ui_views.i18n.init();
            });

            ke.app.render.events.gotIt();
            ke.app.render.organize.setupChangeableImages();

            $('.pro-version-button').on('click', ke.app.handlers.upgrade);

            /* === Start of showing promotion === */

            chrome.runtime.sendMessage({
                action: ke.processCall('app', 'option', 'getPromotionalTableButtons')
            }, function (data) {
                if (data.buttons_code) {
                    $('.promo-layout').html(data.buttons_code);
                }
            });

            if (ke.IS_OPERA) {
                $('.chang-popup').attr('src', 'http://insttranslate.com/files/browser_tutorial_img/popup_1_opera.png');
            }
        }
    });

})();