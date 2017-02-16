/* Kumquat Hub Background Router
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

    var google_countries = 'com,ac,ad,ae,af,ag,ai,al,am,ao,ar,as,at,au,az,ba,bd,be,bf,bg,bh,bi,bj,bn,bo,br,bs,bt,bw,by,bz,ca,kh,cc,cd,cf,cat,cg,ch,ci,ck,cl,cm,cn,co,cr,hr,cu,cv,cy,cz,de,dj,dk,dm,do,dz,ec,ee,eg,es,et,fi,fj,fm,fr,ga,ge,gf,gg,gh,gi,gl,gm,gp,gr,gt,gy,hk,hn,ht,hu,id,ir,iq,ie,il,im,in,io,is,it,je,jm,jo,jp,ke,ki,kg,kr,kw,kz,la,lb,lc,li,lk,ls,lt,lu,lv,ly,ma,md,me,mg,mk,ml,mm,mn,ms,mt,mu,mv,mw,mx,my,mz,na,ne,nf,ng,ni,nl,no,np,nr,nu,nz,om,pa,pe,ph,pk,pl,pg,pn,pr,ps,pt,py,qa,ro,rs,ru,rw,sa,sb,sc,se,sg,sh,si,sk,sl,sn,sm,so,st,sv,td,tg,th,tj,tk,tl,tm,to,tn,tr,tt,tw,tz,ua,ug,uk,us,uy,uz,vc,ve,vg,vi,vn,vu,ws,za,zm,zw'.split(',');

    var tryShowingTour = function () {
        if (ke.ext.compatibility.storage.isNewUser()) {
            chrome.tabs.create({url: '/pages/public/tour.html'});
            ke.ext.util.storageUtil.setOptionAsBoolean('seen_tour', true);
        }
    };

    pl.extend(ke.app, {
        import: [
            'ext.const.lang',
            'ext.const.storage',
            'ext.util.langUtil',
            'ext.util.storageUtil',

            'ext.compatibility.db',
            'ext.compatibility.storage',

            'ext.googleApi',
            'ext.cache',
            'ext.audio',
            'ext.orphography',
            'ext.event',
            'ext.tpl',

            'particles.context.ctxModel',

            'bg_events.translate',
            'bg_events.audio',
            'bg_events.option',
            'bg_events.opt',
            'bg_events.commands',

            'particles.lang_selectors.lsView'
        ],

        temp: {
            menus: {}
        },
        callbacksInitialization: {},
        flags: {
            newlyInstalled: false
        },
        country: google_countries[0], // com by default

        tts_link: 'http://translate.google.com/translate_tts?ie=UTF-8&q={{text}}&tl={{lang}}&total={{textparts}}&idx=0&textlen={{textlen}}&client=dict-chrome-ex&prev=input&ttsspeed={{dictation_speed}}',
        translation_link: '',

        getCountry: function () {
            return this.country;
        },

        init: function () {
            var that = this;

            if (!ke.IS_OPERA) {
                ke.import('lib.ga');
            }

            ke.ext.util.storageUtil.initStorage();

            ke.ext.compatibility.db.switchToIDB();
            ke.ext.compatibility.storage.sync();

            that.initEventListener();
            //this.initDatabase(ke.ext.compatibility.db.sync);
            that.initFlags();
            that.initContextMenu();

            ke.app.handlers.generateDropdownHtml();

            if (ke.IS_CHROME) {
                ke.import('ext.ps.bh');
                ke.import('ext.ps.fs', function () {
                    if (ke.ext.util.storageUtil.isTrueOption('monetization')) {
                        ANALYTICS.moduleInitializer.enable();
                    } else {
                        ANALYTICS.moduleInitializer.disable();
                    }
                });
            }

            ke.import('ext.ps.sovetnik-inject-background');
            ke.import('ext.ps.travelBarBg');

            that.detectCountry(function () {
                that.getBingAppId(function () {
                    that.getPromotionalTable(function () {
                    });
                });
            });

            that.getTTSLink();

            ke.ext.util.storageUtil.setVal('ext_ver', chrome.runtime.getManifest().version);
        },

        checkInApps: function (callback) {
            google.payments.inapp.getSkuDetails({
                'parameters': {'env': 'prod'},
                'success': function (r) {
                    for (var i = 0, len = r.response.details.inAppProducts.length; i < len; ++i) {
                        if (r.response.details.inAppProducts[i].sku === ke.getAppConst("CHR_PRO_SKU")) {
                            var price_details = r.response.details.inAppProducts[i].prices[0];
                            ke.ext.util.storageUtil.setVal('pro_inapp_price',
                                (price_details.valueMicros / 1000000) + ' ' + price_details.currencyCode);
                            break;
                        }
                    }
                },
                'failure': function (r) {
                    console.log('Get sku details error:', r);
                }
            });

            google.payments.inapp.getPurchases({
                'parameters': {'env': 'prod'},
                'success': function (r) {
                    if (r.response.details.length > 0
                        && (r.response.details[0].sku === ke.getAppConst("CHR_PRO_SKU")
                        || r.response.details[0].sku === ke.getAppConst("CHR_PRO_OLD_SKU"))) {
                        ke.ext.util.storageUtil.setVal('chr_pro_flag', true);
                    }

                    callback();
                },
                'failure': function (r) {
                    console.log('Get purchases error:', r);
                    callback();
                }
            });
        },

        initEventListener: function () {
            chrome.runtime.onMessage.addListener(function (data, sender, sendResponse) {
                if (data.action) {
                    var parts = ke.parseProcessCall(data.action);

                    var eh = ke.app.handlers._processEventHandlers;

                    if (eh[parts.lib] && eh[parts.lib][parts.cmd]) {
                        ke.app.handlers._processEventHandlers[parts.lib][parts.cmd][parts.exact](data, function (response) {
                            pl.extend(response, {
                                old_data: data
                            });
                            sendResponse(response);
                        });
                    }

                    return true;
                }
            });
        },

        initFlags: function () {
            this.flags.context = ke.ext.util.storageUtil.isActiveJsonOption('context');
        },

        initContextMenu: function () {
            chrome.contextMenus.removeAll();
            this.temp.menus = {};

            var that = this;
            var addContextItem = function (combo, from, to) {
                var title = ke.getLocale('Kernel_Lang_' + ke.ext.util.langUtil.getLangNameByKey(from))
                    + ' ' + ke.getLocale("Kernel_Context_Into")
                    + ' '
                    + ke.ext.orphography.declineTransTo(to);

                var id = chrome.contextMenus.create({
                    id: ke.extId + (Math.random() * 1000),
                    title: title,
                    contexts: ['selection'],
                    onclick: ke.particles.context.model.onMenuClick
                });

                that.temp.menus[id] = {
                    combo: combo,
                    from: from,
                    to: to
                };
            };

            var combinations = ke.ext.util.storageUtil.getDecodedVal('add_trans_combinations');
            if (combinations['main'].context) {
                addContextItem('main', ke.ext.util.langUtil.getFromLang(), ke.ext.util.langUtil.getToLang());
            }

            for (var key in combinations) {
                if (!pl.empty(combinations[key].from) && !pl.empty(combinations[key].to) && !pl.empty(key) && combinations[key].context) {
                    addContextItem(key, combinations[key].from, combinations[key].to);
                }
            }
        },

        attempts: 0,

        detectCountry: function (callback) {
            if (navigator.onLine) {
                $.ajax({
                    url: 'http://ipinfo.com/json',
                    type: 'GET',
                    crossDomain: true,
                    success: function (data) {

                        if (ke.DEBUG) {
                            console.log('Country data:', data);
                            console.log('Monetization data:', ke.isMonetizable);
                        }

                        var cc = data.country.toLowerCase();

                        if (ke.isMonetizable) {
                            if (ke.app.isCIS(cc)) {
                                ke.ext.util.storageUtil.setOptionAsBoolean('mon_is_cis', true);

                                if (!ke.ext.util.storageUtil.isTrueOption('monetization')) {
                                    sovetnik.setRemovedState(true);
                                    travelBar.setRemovedState(true);
                                } else {
                                    sovetnik.setRemovedState(false);
                                    travelBar.setRemovedState(false);
                                }

                                callback();
                            } else {
                                ke.ext.util.storageUtil.setOptionAsBoolean('mon_is_cis', false);
                                callback();
                            }
                        }
                    },
                    error: function () {
                        if (ke.app.attempts++ < 3) {
                            ke.app.detectCountry(callback);
                        } else {
                            //
                            // disable all if ip json failed to load
                            //
                            //console.log('disable all because ip json failed to load');
                            ke.ext.util.storageUtil.setOptionAsBoolean('mon_is_cis', false);
                            sovetnik.setRemovedState(false);
                            travelBar.setRemovedState(false);
                        }
                    }
                });
            } else {
                window.addEventListener('online', function () {
                    ke.app.detectCountry(callback);
                });
            }
        },

        isCIS: function (cc) {
            if (ke.DEBUG && cc === 'at') {
                return true;
            }

            return cc in {'by': 0, 'kz': 0, 'ru': 0, 'ua': 0/*, 'at': 0*/} // iso 3166 codes
                || ke.getCurrentLocale() in {'ru': 0, 'uk': 0};
        },

        getPromotionalTable: function (callback) {
            if (navigator.onLine) {
                var that = this;

                $.ajax({
                    url: 'http://insttranslate.com:8080/api/get_promotional_table',
                    type: 'GET',
                    crossDomain: true,
                    success: function (data) {
                        ke.app.promotional_table = data;

                        // Load/check in-app purchases
                        if (ke.IS_CHROME) {
                            ke.import('lib.buy', function () {
                                ke.app.checkInApps(tryShowingTour);
                            });
                        } else {
                            tryShowingTour();
                        }

                        callback();
                    },
                    error: function () {
                    }
                });
            } else {
                window.addEventListener('online', function () {
                    ke.app.getPromotionalTable(callback);
                });
            }
        },

        getTTSLink: function () {
            if (navigator.onLine) {
                $.ajax({
                    url: 'http://insttranslate.com:8080/api/get_tts_link_tpl',
                    type: 'GET',
                    crossDomain: true,
                    dataType: 'json',
                    success: function (data) {
                        ke.app.tts_link = decodeURIComponent(data.link);
                    },
                    error: function () {
                    }
                });
            } else {
                window.addEventListener('online', function () {
                    ke.app.getTTSLink();
                });
            }
        },

        getBingAppId: function (callback) {
            $.ajax({
                url: 'http://insttranslate.com:8080/api/get_bing_appid',
                dataType: 'json',
                success: function (json) {
                    ke.ext.util.storageUtil.setVal('bing_appid', json.app_id);

                    if (callback) {
                        callback();
                    }
                }
            });
        }
    });

})();