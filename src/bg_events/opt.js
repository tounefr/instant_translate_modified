(function (undefined) {

    pl.extend(ke.app.handlers._processEventHandlers.app.opt, {
        buy: function (data, sendResponse) {
            google.payments.inapp.buy({
                'parameters': {'env': 'prod'},
                'sku': ke.getAppConst('chr_pro_sku'),
                'success': function (r) {
                    ke.ext.util.storageUtil.setVal('chr_pro_flag', true);
                    ke.app.handlers._processEventHandlers.app.option.toggleMonetization({
                        state: false
                    });

                    sendResponse({success: true, response: r.response});
                },
                'failure': function (r) {
                    sendResponse({success: false, response: r.response});
                }
            });
        },

        generateDropdownHtml: function (data, sendResponse) {
            ke.app.handlers.generateDropdownHtml();
            sendResponse({
                old_data: data
            });
        },

        chainRequestBackgroundOption: function (data, sendResponse) {
            ke.ext.util.storageUtil.chainRequestBackgroundOption(data.calls, sendResponse, true);
        }
    });

})();