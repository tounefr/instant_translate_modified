(function (undefined) {

    // Almost the same object as `ke.ext.const.lang.list` is, but this one is reversed.
    // In other words, language code here appears as a key, not value.

    var LANG_LIST_REVERSED = {};

    var SUPPORT_TRANSLIT = 'hy,bn,be,bg,zh-CN,zh-TW,ka,el,gu,hi,ja,kn,kk,km,ko,lo,mk,ml,mr,mn,my,my,me,pa,ru,sr,si,tg,ta,te,th,uk,yi'.split(',');
    var RTL = ['ar', 'yi', 'ur'];
    var HIEROGLYPH = ['zh-TW', 'zh-CN'];

    var bing_langs = {
        'auto': '',
        'bs': 'bs-Latn',
        'sr': 'sr-Cyrl',
        'zh-TW': 'zh-CHT',
        'zh-CN': 'zh-CHS'
    };

    pl.extend(ke.ext.util.langUtil, {
        import: ['ext.const.storage'],

        supportsTranslit: function (lang) {
            return $.inArray(lang, SUPPORT_TRANSLIT) > -1;
        },

        isHieroglyphical: function (lang) {
            return $.inArray(lang, HIEROGLYPH) > -1;
        },

        isRtl: function (lang) {
            return $.inArray(lang, RTL) > -1;
        },

        getCurrentUiLang: function (simplify) {
            return ke.getCurrentLocale(simplify);
        },

        getFromLang: function () {
            return ke.app.temp && ke.app.temp.currentDetectedLang
                ? ke.app.temp.currentDetectedLang
                : localStorage[ke.getStorageConst('from_lang')];
        },

        getToLang: function () {
            return localStorage[ke.getStorageConst('to_lang')];
        },

        setFromLang: function (c) {
            localStorage[ke.getStorageConst('from_lang')] = c;
        },

        setToLang: function (c) {
            localStorage[ke.getStorageConst('to_lang')] = c;
        },

        isFromLang: function (c) {
            return c === ke.ext.util.langUtil.getFromLang();
        },

        isToLang: function (c) {
            return c === ke.ext.util.langUtil.getToLang();
        },

        simplifyLangCode: function (c) {
            return ke.simplifyLC(c);
        },

        getDetectedLang: function (input, callback) {
            ke.idb.exists('it', 'history', ['input', input], {
                l_from: 'auto'
            }, function (exists, primaryKey, existing_obj) {
                if (!exists) {
                    callback(null);
                    return;
                }
                callback(existing_obj.it_resp[5]);
            });
        },

        getLangNameByKey: function (k) {
            if (k in LANG_LIST_REVERSED) {
                return LANG_LIST_REVERSED[k];
            }

            for (var key in ke.ext.const.lang.list) {
                if (k === ke.ext.const.lang.list[key]) {
                    LANG_LIST_REVERSED[k] = key;
                    return key;
                }
            }

            return null;
        },

        getBingSyncedLang: function (lang) {
            return bing_langs[lang] != undefined ? bing_langs[lang] : lang;
        }
    });

})();