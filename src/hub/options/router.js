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
            'ext.util.langUtil',
            'ext.const.selectors',
            'ext.const.storage',
            'ext.util.selectorsUtil',
            'ext.util.storageUtil',

            'ext.tpl',
            'ext.dom',
            'ext.input',

            'particles.sett_trans_combo.stcView',
            'particles.sett_trans_combo.stcModel',
            'particles.sett_tabber.tabView',
            'particles.sett_tabber.tabModel',
            'particles.scrollbars.sModel',
            'particles.lang_selectors.lsView',

            'ui_views.i18n',
            'ui_views.visibility',

            'ui_components.dropdown.dropdown',
            'ui_components.scrollbar.scrollbar',
            'ui_components.ss_selector.ss_selector'
        ],

        callbacksInitialization: {},
        temp: {
            combos: 0
        },

        share_links: {
            fb: 'http://www.facebook.com/sharer/sharer.php?u=<%=link%>',
            tw: 'https://twitter.com/intent/tweet?url=<%=link%>&text=<%=text%>&via=insttranslate',
            vk: 'https://vk.com/share.php?url=<%=link%>',
            gp: 'https://plus.google.com/share?url=<%=link%>'
        },

        init: function () {
            var that = this;

            if (!ke.IS_OPERA) {
                ke.import('lib.ga');
            }

            ke.import('s:ui_components.dropdown_narrow', function () {
                ke.ui_views.i18n.setSettingsTitle();

                ke.ui.ss_selector.init(ke.app.handlers.stateChangeCallbacks);

                $('.ss-button').each(function () {
                    var option = $(this).data('option');
                    ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', [option], function (is_true) {
                        ke.ui.ss_selector.setState(option, is_true);
                    });
                });

                ke.particles.sett_tabber.view.displayCurrentTab(1);

                // Render the list
                ke.particles.sett_trans_combo.view.renderAllCombinations(function () {
                    that.initCombinationsDropdown();
                });
                ke.app.render.events.bindCombinationRemoval();
                ke.app.render.events.bindCombinationAddition();

                ke.particles.sett_trans_combo.model.ctrlComboVisibility();

                ke.app.render.events.bindCombinationChange();
                ke.app.render.events.tabChange();
                ke.app.render.events.clickableLabel();

                ke.app.render.events.bindBeforeUnload();

                $('.mail-button').attr('href', $('.mail-button').attr('href') + ke.currentBrowser);

                /* === Start of showing promotion === */

                chrome.runtime.sendMessage({
                    action: ke.processCall('app', 'option', 'getPromotionalTableButtons')
                }, function (data) {
                    if (data.buttons_code) {
                        $('.promo-layout')
                            .html(data.buttons_code)
                            .removeClass('need-html-locale');
                    }
                });

                /* Sharing */

                $('.share-button').on('click', ke.app.handlers.showSharingWindow);

                /* Platform- and country-dependant */

                $('.pro-version-button').on('click', ke.app.handlers.upgrade);

                ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['mon_is_cis'], function (is_cis) {
                    if (ke.isMonetizable) {
                        $('.monetization-block').show();

                        if (!ke.IS_CHROME) {
                            $('.or-buy-pro').remove();
                            $('#Tour_MonCis').attr('id', 'Tour_Mon');
                            $('#Tour_MonDesc').attr('id', 'Tour_MonNotChromeDesc');
                        }

                        if (is_cis) {
                            $('#Tour_MonDesc').attr('id', 'Tour_MonCisDesc');
                            $('#Tour_ProFeature3').attr('id', 'Tour_ProFeature3_Cis');
                        } else {
                            $('.vk-button').remove();
                        }

                        ke.ui_views.i18n.init();

                    } else if (ke.isChromePro && !ke.IS_CHROME_PRO) {
                        $('.pro-block').show();

                        if (!is_cis) {
                            $('.vk-button').remove();
                        }
                    }

                    ke.ui_views.i18n.init();
                });
            });
        },

        initCombinationsDropdown: function (opt) {
            ke.ui.dropdown.init(
                ke.particles.sett_trans_combo.model.onComboDropdownChange,
                [ke.particles.sett_trans_combo.model.onComboDropdownOpen, ke.EF],
                ke.particles.sett_trans_combo.view.getComboVariants,
                opt || undefined,
                function () {
                }
            );
        }
    });

})();