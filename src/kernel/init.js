/* Kumquat Kernel Additional Init
 * 
 * To avoid interfering the internal work of ./kernel.js user-init (additional) is passed to
 * another file (this).
 * 
 * It might be useful, if you have something that must initialized on every page or 
 * something like that.
 **/

(function (undefined) {

    // Will be fired along with ordinary Kernel Init
    ke.data.kernel.save.user_init = function () {
        ke.idb.def_obj_struct('translation', {
            l_from: '',
            l_to: '',
            input: '',
            it_resp: [],
            time: 0,
            sources: {}
        });

        ke.idb.open('it', 'history', {
            l_from: false,
            l_to: false,
            time: false,
            input: false
        }, function () {
        });

        // Complicated system of extensions
        pl.extend(ke.ext.constants, {});
        pl.extend(ke.ext.util, {});
        pl.extend(ke.ext.compatibility, {});

        // Additional kernel parts
        pl.extend(ke, {
            particles: {},
            ui_views: {},
            templates: {}
        });

        // Particles initialization
        var so = {
            view: {},
            model: {}
        };

        pl.extend(ke.particles, {
            lang_selectors: so,
            lang_swap: so,
            listen: so,
            translate: so,
            stt: so,
            upgradeTt: so,
            tr_input: so,
            translate_ctt: so,
            scrollbars: so,
            context: so,
            sett_int_allvar: so,
            sett_int_instant: so,
            sett_int_save: so,
            sett_trans_combo: so,
            sett_trans_context: so,
            sett_trans_history: so,
            sett_tabber: so,
            hist_list: so,
            hist_opt_delete: so,
            hist_search: so
        });

        // UI Views initialization
        pl.extend(ke.ui_views, {
            i18n: {},
            multi_variant: {},
            empty_trans_states: {},
            visibility: {}
        });

        // Extend UI for new components, but not inherited from previous projects
        pl.extend(ke.ui, {
            tooltip: {
                simple: {},      // Core of all underwritten stuff
                modal: {},       // A modal window
                help: {},        // Exactly, a tooltip
                confirm: {},     // A modal window with two yes/no buttons
                helpSelected: {} // A tooltip, appending near the selected text and containing html code inside instead of plain text
            }
        });
    };

    // Standard empty function as a substitution of undefined callbacks
    pl.extend(ke, {
        EF: function () {
        }
    });

    // Application constants
    var APP_CONST = {
        DB: 'It_DbVault',
        T_HISTORY: 'History',

        CHR_PRO_SKU: 'instant_translate_pro',
        CHR_PRO_OLD_SKU: 'it_pro',

        //
        // Animation constants

        ANIM_TYPE_SLIDE_UP: 'easeInOutQuint',
        ANIM_TYPE_SLIDE_DOWN: 'easeInOutQuint',
        ANIM_TYPE_FADE_OUT: 'easeOutExpo',
        ANIM_TYPE_FADE_IN: 'easeOutExpo',
        ANIM_TYPE_REL_MOVE: 'easeInExpo',

        ANIM_SPEED_SLIDE_UP: 150,
        ANIM_SPEED_SLIDE_DOWN: 150,
        ANIM_SPEED_FAST_SLIDE_UP: 90,
        ANIM_SPEED_FAST_SLIDE_DOWN: 90,
        ANIM_SPEED_FADE_OUT: 115,
        ANIM_SPEED_FADE_IN: 115,
        ANIM_SPEED_FAST_FADE_OUT: 55,
        ANIM_SPEED_FAST_FADE_IN: 55
    };

    pl.extend(ke, {
        getAppConst: function (n) {
            return APP_CONST[n.toUpperCase()];
        }
    });

    // ===================
    // Some common methods

    // Add common constants
    pl.extend(ke.data.kernel.const, {
        PREFIX: 'TnITTtw'
    });

    var tracking_codes = {
        "Chrome": "UA-66061856-6",
        "Chrome Pro": "UA-66061856-9",
        "Opera": "UA-66061856-7",
        "Edge": "UA-66061856-8",
        "Firefox": "UA-66061856-10",
        "Safari": "UA-66061856-11"
    };

    pl.extend(ke, {
        DEBUG: false,

        get isChrome() {
            return ke.IS_CHROME || ke.IS_CHROME_PRO;
        },

        get isChromePro() {
            return ke.IS_CHROME_PRO
                || ke.ext.util.storageUtil.isTrueOption("chr_pro_flag");
        },

        get storeLink() {
            if (ke.IS_CHROME_PRO) {
                return 'https://chrome.google.com/webstore/detail/instant-translate-pro/jlchdnnckapmdfniehlbbeaplhpjjogn';
            } else if (ke.IS_CHROME) {
                return 'https://chrome.google.com/webstore/detail/instant-translate-select/ihmgiclibbndffejedjimfjmfoabpcke';
            } else if (ke.IS_OPERA) {
                return 'https://addons.opera.com/de/extensions/details/instant-translate-2';
            } else if (ke.IS_EDGE) {
                return 'https://insttranslate.com/browsers';
            } else if (ke.IS_FIREFOX) {
                return 'https://addons.mozilla.org/firefox/addon/instant-translate/';
            }

            return '';
        },

        get isMonetizable() {
            return (ke.IS_CHROME && !ke.isChromePro) || ke.IS_OPERA || ke.IS_FIREFOX || ke.IS_EDGE;
        },

        inRange: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        attachGA: function () {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src = 'https://ssl.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
        },

        getKeyByVal: function (o, v) {
            for (var key in o) {
                if (o[key] == v) return key;
            }
            return null;
        },

        capitalize: function (s) {
            return pl.empty(s) || !s ? '' : s[0].toUpperCase() + s.substr(1).toLowerCase();
        },

        getPrefix: function () {
            return ke.getConst('prefix') + '-';
        },

        getAnimType: function (anim) {
            return ke.getAppConst('anim_type_' + anim);
        },

        getAnimSpeed: function (anim) {
            return ke.getAppConst('anim_speed_' + anim);
        },

        getTrackingCode: function () {
            return tracking_codes[ke.browserName];
        },

        // The following stuff should be here,
        // because there are certain problems with loading the scripts in the correct order

        getCurrentLocale: function (simplify) {
            var ul = window.navigator.userLanguage || window.navigator.language;
            return simplify ? ke.simplifyLC(ul) : ul;
        },

        // en_GB => en, zh-CW => zh
        simplifyLC: function (c) {
            return c.split('-')[0].split('_')[0];
        }
    });

})();