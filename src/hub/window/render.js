/* Kumquat Hub Window Render
 *
 **/

(function (undefined) {

    var PROMO_CODE = '\
        <div class="promo-white-bg">\
            <div class="promo-close"></div>\
            <div class="promo-screenshot"></div>\
            <div class="promo-buttons-wrap">\
                <div class="promo-other-label"><%=other_platforms_label%></div>\
                <div><%=buttons%></div>\
            </div>\
        </div>\
    ';

    var BOTTOM_PROMO = '<div class="bottom-promo" data-link="<%=link%>"><div class="bp-text"><%=try%> <b><%=platform%></b></div><div class="promo-close"></div></div>';
    var ONE_DAY = 86400000;

    var updateBottomPromoTime = function () {
        ke.ext.util.storageUtil.requestBackgroundOption('setIntValue', ['last_pro_shown', Date.now()]);
        ke.ext.util.storageUtil.requestBackgroundOption('setIntValue', ['last_bottom_promo_show', Date.now()]);
        ke.ext.util.storageUtil.requestBackgroundOption('setIntValue', ['last_rate_show', Date.now()]);
    };

    pl.extend(ke.app.render, {
        organize: {
            ctrlHistoryLinkVisibility: function () {
                ke.ext.util.storageUtil.requestBackgroundOption('isTrueOption', ['history'], function (is_true) {
                    $('.collapsable-history').css('display', is_true ? 'inline-block' : 'none');
                });
            },

            fadeInElements: function () {
                $('.complex-wrap')
                    .fadeIn(175, ke.getAnimType('slide_up'), function () {
                        $(this).addClass('unfaded-cw');
                        pl('.translation-input').caretToEnd();
                    });
            },

            toggleUnpinLink: function () {
                if (ke.IS_EDGE || document.location.hash.substr(1) === "unpinned") {
                    $('.unpin').fadeOut(300, ke.getAnimType('fade_out'));
                }
            },

            keysSettingTooltipId: 0,

            showKeysSettingTooltip: function () {
                var template = $('.t-keys-setting-tooltip').html();
                $('body').append(ke.ext.tpl.compile(template, {
                    tooltip_id: ++ke.app.render.organize.keysSettingTooltipId,
                    ctrl_cmd: ke.isMac ? 'Cmd' : 'Ctrl',
                    toggle_foreword_class: ke.ext.util.storageUtil.isTrueOption('win_trans_type_shown') ? 'ks-hide-foreword' : ''
                }));

                //$t = $('.ks-' + ke.app.render.organize.keysSettingTooltipId);

                var arrow_left = $('.translate-button').width() / 2 + 10 + 8 / 2;
                var top = $('.translate-button').offset().top - $('.ks-' + ke.app.render.organize.keysSettingTooltipId).height() - 5;

                $('.ks-' + ke.app.render.organize.keysSettingTooltipId)
                    .css({
                        'top': top - 20,
                        'opacity': 0.0
                    })
                    .animate({
                        'top': top,
                        'opacity': 1.0
                    }, 300, ke.getAnimType('slide_up'));

                $('.ks-' + ke.app.render.organize.keysSettingTooltipId).find('.ks-bottom-arrow').css('margin-left', arrow_left);

                ke.ext.util.storageUtil.requestBackgroundOption('getVal', ['win_trans_type'], function (type) {
                    ke.app.handlers.onKeysSettingOptionClick.call($('.ks-' + ke.app.render.organize.keysSettingTooltipId).find('.kso-' + type).get(0), null);
                });

                $('.ks-option').off('click').on('click', ke.app.handlers.onKeysSettingOptionClick);
                $('.keys-setting-tooltip').off('click').on('mouseover', ke.app.handlers.overTooltip);
                $('.keys-setting-tooltip').on('mouseout', ke.app.handlers.offTooltip);
            },

            hideKeysSettingTooltip: function () {
                var top = $('.translate-button').offset().top - $('.ks-' + ke.app.render.organize.keysSettingTooltipId).height() - 5;

                $('.ks-' + ke.app.render.organize.keysSettingTooltipId)
                    .animate({
                        'top': top - 20,
                        'opacity': 0.0
                    }, 300, ke.getAnimType('slide_up'), function () {
                        $(this).remove();
                    });
            },

            tryShowingUpgrade: function (not_shown_callback) {
                var is_cis = ke.ext.util.storageUtil.isTrueOption("mon_is_cis");

                if (ke.isMonetizable
                    && !ke.ext.util.storageUtil.isTrueOption("mon_warn")
                    && Date.now() - ke.ext.util.storageUtil.getIntValue("last_pro_show") >= ONE_DAY
                    && !(!ke.IS_CHROME && !is_cis)) {

                    var layout_class = '.monetization-warn-layout';

                    if (ke.IS_CHROME && !is_cis) {
                        layout_class = '.monetization-pro-layout';
                    } else if (!ke.IS_CHROME && is_cis) {
                        layout_class = '.monetization-optin-layout';
                    }

                    updateBottomPromoTime();
                    ke.ext.util.storageUtil.setVal("mon_warn", true);

                    var $mw = $(layout_class);
                    $mw.show();
                    $mw.find('.agree-button').on('click', function () {
                        $mw.hide();
                        ke.ext.util.storageUtil.setVal("monetization", true);

                        _gaq.push(['_trackEvent', 'monetization-agree', 'clicked']);
                    });

                    var close = function () {
                        $mw.hide();

                        _gaq.push(['_trackEvent', 'monetization-close', 'clicked']);
                    };

                    if (ke.IS_CHROME) {
                        $mw.find('.mw-close').on('click', close);

                        $mw.find('.pro-version-button').on('click', function () {
                            chrome.runtime.sendMessage({
                                action: ke.processCall('app', 'opt', 'buy')
                            });

                            _gaq.push(['_trackEvent', 'upgrade-pro', 'window']);
                        });
                    } else {
                        $mw.find('.later-button').on('click', close);
                    }
                } else {
                    not_shown_callback();
                }
            },

            tryShowingPromotion: function (not_shown_callback) {
                var promo_clicks = ke.ext.util.storageUtil.getDecodedVal('promo_clicks');
                var isMac = window.navigator.userAgent.indexOf('Mac OS X') > -1;

                var showBottomPromo = function (key, pt) {
                    ke.ext.util.storageUtil.requestBackgroundOption('incrementIntValue', ['shown_bottom_promos']);
                    ke.ext.util.storageUtil.requestBackgroundOption('setJsonField', ['promo_clicks', key, true]);

                    $('body').append(ke.ext.tpl.compile(BOTTOM_PROMO, {
                        try: ke.getLocale('Promo_Try'),
                        platform: ke.getLocale('Promo_' + ke.capitalize(key)),
                        link: pt[key][1]
                    }));

                    $('.bottom-promo').on('click', function (event) {
                        updateBottomPromoTime();
                        chrome.tabs.create({
                            url: $(this).data('link')
                        });
                    });

                    $('.bottom-promo .promo-close').on('click', function (event) {
                        event.stopPropagation();

                        updateBottomPromoTime();

                        $(this).parent().animate({
                            bottom: -40,
                            opacity: 0.0
                        }, 125, 'easeOutBounce', function () {
                            $(this).remove();
                        });
                    });
                };

                function Checker(pt, pc) {
                    this.pt = pt;
                    this.pc = pc;
                    this.can_check = true;
                }

                Checker.prototype.check = function (flag, pl) {
                    if (this.can_check && flag && this.pt[pl][0] && !this.pc[pl]) {
                        showBottomPromo(pl, this.pt);
                        this.can_check = false;
                    }
                    return this;
                };

                ke.ext.util.storageUtil.chainRequestBackgroundOption([
                    {fn: 'getIntValue', args: ['shown_promos']},
                    {fn: 'getIntValue', args: ['last_promo_show']},
                    {fn: 'getIntValue', args: ['shown_bottom_promos']},
                    {fn: 'getIntValue', args: ['last_bottom_promo_show']}
                ], function (responses) {
                    if (responses[2].response < 5 && Date.now() - responses[3].response >= ONE_DAY) {
                        chrome.runtime.sendMessage({
                            action: ke.processCall('app', 'option', 'getPromotionalTable')
                        }, function (data) {
                            var checker = new Checker(data.promotional_table, promo_clicks);

                            checker
                                .check(isMac, 'mac')
                                .check(!isMac, 'windows')
                                .check(true, 'ios')
                                .check(true, 'android')
                                .check(!ke.IS_CHROME && !ke.IS_CHROME_PRO, 'chrome')
                                .check(!ke.IS_EDGE, 'edge')
                                .check(true, 'firefox');
                        });
                    } else {
                        not_shown_callback();
                    }
                });
            },

            tryShowingRateUs: function (not_shown_callback) {
                if (!ke.IS_EDGE
                    && ke.ext.util.storageUtil.getIntValue("last_rate_show") != -1
                    && Date.now() - ke.ext.util.storageUtil.getIntValue("last_rate_show") >= ONE_DAY) {

                    var $mw = $('.rate-layout');

                    $mw.show();

                    $mw.find('.rate-now').on('click', function () {
                        $mw.hide();

                        ke.ext.util.storageUtil.setIntValue("last_rate_show", -1);
                        _gaq.push(['_trackEvent', 'rate-now', 'clicked']);
                        chrome.tabs.create({url: ke.storeLink});
                    });

                    $mw.find('.remind-later').on('click', function () {
                        $mw.hide();

                        ke.ext.util.storageUtil.setIntValue("last_rate_show", Date.now());
                        _gaq.push(['_trackEvent', 'rate-later', 'clicked']);
                    });

                    $mw.find('.remind-never').on('click', function () {
                        $mw.hide();

                        ke.ext.util.storageUtil.setIntValue("last_rate_show", -1);
                        _gaq.push(['_trackEvent', 'rate-never', 'clicked']);
                    });
                } else {
                    not_shown_callback();
                }
            }
        },

        events: {
            swap: function () {
                $('.lang-swap').bind('click', ke.app.handlers.onSwapLang);
            },

            toggleTextareaFocus: function () {
                $(document).off('focus').on('focus', '.translation-input', ke.particles.tr_input.model.onTextareaFocus);
                $(document).off('blur').on('blur', '.translation-input', ke.particles.tr_input.model.onTextareaBlur);
            },

            listenRaw: function () {
                $('.listen-raw-button').bind('click', ke.particles.listen.model.playRaw);
            },

            listenTranslation: function () {
                $('.listen-translation').bind('click', ke.particles.listen.model.playTranslation);
            },

            listenSynonym: function () {
                $('.listen-v-item').bind('click', ke.particles.listen.model.playSynonym);
            },

            useSynonym: function () {
                $('.synonym').bind('click', ke.app.handlers.useSynonym);
            },

            listen: function () {
                this.listenRaw();
                this.listenTranslation();
            },

            clearInput: function () {
                $('.clear-input').bind('click', ke.app.handlers.clearInput);
                //$('.translation-input').bind('keyup', ke.app.handlers.ctrlClearInputVisibility);
            },

            enableRawListen: function () {
                $('.translation-input').bind('keyup', ke.particles.listen.model.ctrlRawVisibility);
            },

            onHistoryLinkClick: function () {
                $('.history-button').bind('click', ke.app.handlers.onHistoryLinkClick);
            },

            onSettingsLinkClick: function () {
                $('.settings-button').bind('click', ke.app.handlers.onSettingsLinkClick);
            },

            onUnpinLinkClick: function () {
                $('.unpin').bind('click', ke.app.handlers.onUnpinLinkClick);
            },

            translateOnClick: function () {
                $('.translate-button').bind('click', ke.particles.translate.model.translateSimple);
            },

            onResize: function () {
                $(window).resize(ke.app.handlers.onResize);
            },

            // in this method
            translateOnKeyCombinations: function () {
                ke.ext.util.storageUtil.requestBackgroundOption('getVal', ['win_trans_type'], function (type) {
                    if (type == 1) {
                        $('.translation-input')
                            .unbind()
                            .bind('keyup', function (event) {
                                ke.particles.translate.model.checkTranslationShortcut(event, 1);
                            });
                    } else {
                        $('.translation-input')
                            .unbind()
                            .bind('keydown', function (event) {
                                ke.particles.translate.model.checkTranslationShortcut(event, 2);
                            });
                    }
                });
            },

            translateOnKeyup: function () {
                $('.translation-input').bind('keyup', ke.particles.translate.model.translateOnKeyup);
            },

            translateOnBlur: function () {
                $('.translation-input').bind('blur', ke.particles.translate.model.translateSimple);
            },

            saveValueOnKeyup: function () {
                pl('.translation-input').bind('keyup', ke.particles.tr_input.model.saveValueOnKeyup);
            },

            shortcuts: function () {
                $(document.body).bind('keyup', ke.app.handlers.onShortcutsUp);
                $('.translation-input').bind('keyup', ke.app.handlers.onShortcutsUp);
            },

            bindSelectingKeysForTranslation: function () {
                $('.translate-button').bind('mouseover', ke.app.handlers.countdownToShowKeysSelector);
                $('.translate-button').bind('mouseout', ke.app.handlers.removeKeysSelector);
            },

            dontAutocorrect: function () {
                $('.autocorrection-layout .ac-word').on('click', ke.app.handlers.dontAutocorrect);
            }
        }
    });

})();
