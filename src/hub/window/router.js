/* Kumquat Hub Window Router
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
            'ext.const.lang',
            'ext.const.selectors',
            'ext.const.storage',
            'ext.util.langUtil',
            'ext.util.selectorsUtil',
            'ext.util.storageUtil',

            'ext.tpl',
            'ext.event',
            'ext.audio',
            'ext.input',
            'ext.errorManager',
            'ext.dom',
            'ext.string',

            'particles.lang_selectors.lsView',
            'particles.lang_selectors.lsModel',
            'particles.listen.lModel',
            'particles.translate.tModel',
            'particles.tr_input.trView',
            'particles.tr_input.trModel',
            'particles.scrollbars.sModel',
            'particles.stt.sttModel',
            'particles.upgrade_tooltip.upgradeTtModel',

            'ui_views.i18n',
            'ui_views.empty_trans_states',

            'ui_components.tooltip.modal',
            'ui_components.tooltip.confirm',
            'ui_components.dropdown.dropdown',
            'ui_components.scrollbar.scrollbar',

            'lib.siriwave'
        ],

        temp: {
            currentDetectedLang: '',
            valueBeforeAutocorrection: '',

            // compatibility with buggy FF
            prev_window_size: {
                w: null,
                h: null
            }
        },

        SHORTCUTS: {
            SEL_FROM: 'ctrl+alt',
            SEL_TO: 'ctrl+space',
            CLEAR: 'alt+c',
            SWAP: 'alt+s',
            LISTEN_RAW: 'alt+q',
            LISTEN_TRANS: 'alt+a'
        },

        // Will be extended on init
        flags: {
            isPrevTranslationMulti: false,
            isCurrentTranslationMulti: false,
            rawUtterancePermission: false,
            transUterrancePermission: false,

            isTranslating: false,
            isPlayingRaw: false,
            isPlayingTrans: false,
            shortcutsProceeding: false,
            isAutocorrected: false,

            clearFadedOut: false,

            forceShowKeysSettingTooltip: false,

            shownTSL: false,
            isNarrow: false,

            shouldHideSttButtonAfterEnd: false
        },

        prevInput: '',
        $input: $('.translation-input'),
        $main_wrap: $('#main-wrap'),
        siriWave: null,
        $stt_button: $('.toggle-stt'),

        // It will initialized directly from binding functions
        callbacksInitialization: {},

        init: function () {
            document.title = "Instant Translate Unpinned";
            ke.app.render.organize.toggleUnpinLink();

            this.siriWave = new SiriWave({
                container: $('.stt-layout').get(0),
                width: 233,
                height: 40,
                speed: 0.1,
                color: '#3E8DD7',
                amplitude: 0
            });

            ke.ext.event.listen(function (keys_down) {
                if (keys_down[27]) {
                }
            }, ke.EF, ke.EF);

            if (!ke.IS_OPERA) {
                ke.import('lib.ga');
            }

            ke.app.render.organize.ctrlHistoryLinkVisibility();

            this.initDropdown();

            ke.particles.listen.model.ctrlRawVisibility();
            ke.particles.listen.model.ctrlTransVisibility();

            this.initFlags();

            ke.particles.scrollbars.model.setupTranslationScroll();

            ke.app.render.events.swap();
            ke.app.render.events.toggleTextareaFocus();
            ke.app.render.events.enableRawListen();
            ke.app.render.events.listen();
            ke.app.render.events.listenTranslation();
            ke.app.render.events.onHistoryLinkClick();
            ke.app.render.events.onSettingsLinkClick();
            ke.app.render.events.onUnpinLinkClick();
            ke.app.render.events.shortcuts();
            ke.app.render.events.clearInput();
            ke.app.render.events.dontAutocorrect();

            $('.ac-close').on('click', ke.app.handlers.closeAutocorrection);
            $('.toggle-stt').on('click', ke.particles.stt.model.toggle);

            ke.app.render.organize.fadeInElements();
            ke.app.render.events.bindSelectingKeysForTranslation();
            ke.app.render.events.onResize();

            if (!ke.isChromePro && !ke.app.flags.isNarrow) {
                ke.app.render.organize.tryShowingUpgrade(function () {
                    ke.app.render.organize.tryShowingPromotion(function () {
                        ke.app.render.organize.tryShowingRateUs(function () {
                        });
                    });
                });
            } else {
                ke.app.render.organize.tryShowingRateUs(function () {
                });
            }

            ke.app.temp.toLang = ke.ext.util.langUtil.getToLang();

            ke.app.handlers.onResize();

            if (ke.isChromePro) {
                $('.app-name sup').show();
            } else if (ke.IS_FIREFOX) {
                $(".left-part").css("top", "-1px");
                $(".action-bar").css("margin-top", "-1px");
                $(".mw-inner").css("top", "15px");
            }

            if (ke.ext.util.storageUtil.isTrueOption('mon_is_cis')) {
                $('#Tour_ProFeature3').attr('id', 'Tour_ProFeature3_Cis');
            }

            ke.ui_views.i18n.init();
        },

        initFlags: function () {
            var that = this;
            ke.ext.util.storageUtil.chainRequestBackgroundOption([
                {fn: 'isTrueOption', args: ['instant']},
                {fn: 'isTrueOption', args: ['save']}
            ], function (responses) {
                ke.app.flags.instant = responses[0].response;
                ke.app.flags.save = responses[1].response;

                that.initSavedValue(ke.app.initEmptyCap);
                that.initInstant();
            });
        },

        initInstant: function () {
            if (this.flags.instant) {
                ke.particles.translate.model.ctrlInstantVisibility('hide');
                ke.app.render.events.translateOnKeyup();
            } else {
                ke.app.render.events.translateOnClick();
                ke.app.render.events.translateOnKeyCombinations();
            }
        },

        initDropdown: function () {
            ke.ui.dropdown.init(
                ke.particles.lang_selectors.model.onLangDropdownChange,
                [ke.particles.lang_selectors.model.onOpen, ke.EF],
                function (type, data, callback) {
                    ke.particles.lang_selectors.view.fillDropdown(type, type, data, callback);
                },
                '',
                function () {
                    $('.rm-recent').unbind().bind('click', ke.particles.lang_selectors.model.removeRecentLanguage);
                }
            );
        },

        // saves now anyway
        initSavedValue: function (callback) {
            if (this.flags.save) {
                ke.app.render.events.saveValueOnKeyup();

                ke.particles.tr_input.view.displaySaveValue(function (is_empty) {
                    callback(is_empty);
                    ke.particles.translate.model.translateSimple();
                });
            } else {
                callback(true);
            }
        },

        initEmptyCap: function (isEmpty) {
            if (isEmpty) {
                setTimeout(function () {
                    ke.ui_views.empty_trans_states.displayEmptiness();
                    ke.app.handlers.toggleRawControls(true);
                }, 10);
            }
        }
    });
})();
