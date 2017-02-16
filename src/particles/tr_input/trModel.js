(function (undefined) {

    pl.extend(ke.particles.tr_input.model, {
        onTextareaFocus: function () {
            pl('.left-part').addClass('textarea-with-focus-lp');
            pl('.action-bar').addClass('textarea-with-focus');
        },

        onTextareaBlur: function () {
            pl('.left-part').removeClass('textarea-with-focus-lp');
            pl('.action-bar').removeClass('textarea-with-focus');
        },

        saveValueOnKeyup: function () {
            ke.ext.util.storageUtil.requestBackgroundOption('setVal', ['saved_val', pl('.translation-input').val()]);
        }
    });

})();