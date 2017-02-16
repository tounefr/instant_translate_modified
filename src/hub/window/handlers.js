/* Kumquat Hub Window Handlers
 * 
 **/

(function (undefined) {

    var $input = $('.translation-input');

    pl.extend(ke.app.handlers, {
        onHistoryLinkClick: function () {
            chrome.tabs.create({
                url: chrome.extension.getURL("pages/public/history.html")
            });
        },

        onSettingsLinkClick: function () {
            chrome.tabs.create({
                url: chrome.extension.getURL("pages/public/options.html")
            });
        },

        onUnpinLinkClick: function () {
            window.open("../public/window.html#unpinned", "_blank", "resizable=0, scrollbars=0, titlebar=0, width=550, height=462, top=10, left=10");
        },

        clearInput: function (event) {
            pl('.translation-input').clear(function () {
                ke.app.handlers.toggleRawControls(true);
                ke.particles.tr_input.model.saveValueOnKeyup();
                ke.particles.translate.model.translateSimple();
            });
        },

        closeAutocorrection: function () {
            $('.autocorrection-layout').hide();
        },

        dontAutocorrect: function (event) {
            var val = $(this).html();

            $('.autocorrection-layout').hide();
            $('.translation-input').val(val);

            ke.app.flags.isAutocorrected = false;
            ke.particles.translate.model.getTranslation(ke.particles.translate.model.routeTranslation, false, val, true);
        },

        onResize: function () {
            var w = $(window).width();
            var h = $(window).height();

            // Compatibility with buggy FF
            if (ke.IS_FIREFOX) {
                if (w === ke.app.temp.prev_window_size.w && h === ke.app.temp.prev_window_size.h) {
                    return;
                }

                ke.app.temp.prev_window_size.w = w;
                ke.app.temp.prev_window_size.h = h;
            }

            var ok = true;
            var scroll_reload = false;

            if (h < 420) {
                ok = false;
            } else {
                if (w < 400) {
                    ok = false;
                } else if (w < 550) {
                    $(ke.app.$main_wrap).addClass('it-narrow');
                    ke.app.flags.isNarrow = true;
                    scroll_reload = true;
                } else {
                    $(ke.app.$main_wrap).removeClass('it-narrow');
                    ke.app.flags.isNarrow = false;
                    scroll_reload = true;
                }
            }

            if (scroll_reload) {
                ke.particles.scrollbars.model.setupTranslationScroll();
            }

            if (!ok && !ke.app.flags.shownTSL) {
                ke.app.flags.shownTSL = true;
                $('body')
                    .append($('<div>', {class: "too-small-overlay"})
                        .append($('<div>', {class: "tso-text"})
                            .html(ke.getLocale('Window_TooSmall'))));
                $('#main-wrap').css('-webkit-filter', 'blur(5px)');
            } else if (ok) {
                ke.app.flags.shownTSL = false;

                $('#main-wrap').css('-webkit-filter', 'blur(0px)');
                $('.too-small-overlay').fadeOut(125, function () {
                    $(this).remove();
                });

                ke.ui.dropdown.globalRecrop();
            }
        },

        onShortcutsUp: function (e, only_for) {
            // Not to be called simultaneously
            if (ke.app.flags.shortcutsProceeding) {
                return;
            }

            ke.app.flags.shortcutsProceeding = true;
        },

        useSynonym: function (event) {
            var word = pl(event.target).html();
            $input.val(word);
            ke.particles.translate.model.translateSimple(null, false);
            if (ke.app.flags.save) {
                ke.particles.tr_input.model.saveValueOnKeyup();
            }
        },

        keysShowTimeout: null,

        countdownToShowKeysSelector: function (event) {
            clearTimeout(ke.app.handlers.keysShowTimeout);
            ke.app.handlers.keysShowTimeout = setTimeout(function () {
                ke.app.render.organize.showKeysSettingTooltip();
            }, 800);
        },

        canRemoveKeysSelector: true,

        removeKeysSelector: function (event) {
            setTimeout(function () {
                if (ke.app.handlers.canRemoveKeysSelector) {
                    clearTimeout(ke.app.handlers.keysShowTimeout);
                    ke.app.render.organize.hideKeysSettingTooltip();
                }
            }, 25);
        },

        onKeysSettingOptionClick: function (event) {
            $('.ks-active').removeClass('ks-active');
            $(this).addClass('ks-active');

            var id = +$(this).data('id');

            ke.ext.util.storageUtil.requestBackgroundOption('setVal', ['win_trans_type', id]);

            ke.app.render.events.translateOnKeyCombinations();
        },

        overTooltip: function (event) {
            ke.app.handlers.canRemoveKeysSelector = false;
        },

        offTooltip: function (event) {
            ke.app.handlers.canRemoveKeysSelector = true;
            ke.app.handlers.removeKeysSelector(event);
        },

        wereRawControlsEmpty: false,

        toggleRawControls: function (is_empty) {
            ke.particles.stt.model.ctrlMicVisibility(ke.ext.util.langUtil.getFromLang());

            if (is_empty === this.wereRawControlsEmpty) {
                return;
            }

            this.wereRawControlsEmpty = is_empty;

            ke.app.handlers.closeAutocorrection();

            if (is_empty) {
                $('.listen-raw-button').fadeOut(125, 'easeOutCubic');
                $('.clear-input').fadeOut(125, 'easeOutCubic');
                ke.app.$stt_button.addClass('on-empty');

                if (!ke.app.flags.instant) $('.translate-button').fadeOut(125, 'easeOutCubic');

                if (ke.app.temp.currentFromLang === 'auto') {
                    ke.app.initDropdown();
                }
            } else {
                $('.listen-raw-button').fadeIn(125, 'easeOutCubic');
                $('.clear-input').fadeIn(125, 'easeOutCubic');
                ke.app.$stt_button.removeClass('on-empty');

                if (!ke.app.flags.instant) $('.translate-button').fadeIn(125, 'easeOutCubic');
            }
        },

        onSwapLang: function () {
            var from = pl('.ui_selector .options', 0).find('.option_selected span').attr('val');
            var to = pl('.ui_selector .options', 1).find('.option_selected span').attr('val');

            if (ke.app.temp.currentDetectedLang) {
                from = ke.app.temp.currentDetectedLang;
            }

            if (from !== 'auto') {
                ke.ui.dropdown.data.callback(1, to, null, true);
                ke.ui.dropdown.data.callback(2, from, null, false);

                ke.app.temp.toLang = from;
            }
        }
    });

})();