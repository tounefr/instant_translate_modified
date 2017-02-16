(function (undefined) {

    pl.extend(ke.ext.dom, {
        getPosition: function (e) {
            var left = 0;
            var top = 0;

            if (e.offsetParent) {
                do {
                    left += e.offsetLeft;
                    top += e.offsetTop;
                } while (e = e.offsetParent);
            }

            return [left, top];
        },

        getX: function (e) {
            return ke.ext.dom.getPosition(e)[0];
        },

        getY: function (e) {
            return ke.ext.dom.getPosition(e)[1];
        },

        getHeight: function (e) {
            return parseInt(pl(e).css('height'))
                + parseInt(pl(e).css('padding-top'))
                + parseInt(pl(e).css('padding-bottom'));
        },

        isVisible: function (e) {
            var y = this.getY(e);
            return y + this.getHeight(e) >= window.scrollY && y <= window.scrollY + window.innerHeight;
        }
    });

    pl.implement({
        rev: function () {
            this.elements.reverse();
            return this;
        }
    });

    $.fn.textWidth = function (text, font) {
        if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span>').hide().appendTo(document.body);
        $.fn.textWidth.fakeEl.text(text || this.val() || this.text()).css('font', font || this.css('font'));
        return $.fn.textWidth.fakeEl.width();
    };

    $.fn.placeholderWidth = function () {
        return $.fn.textWidth(this.attr('placeholder'));
    };

    $.fn.measure = function (fn) {
        var el = $(this).clone(false);
        el.css({
            visibility: 'hidden',
            position: 'absolute'
        });
        el.appendTo('body');
        var result = fn.apply(el);
        el.remove();
        return result;
    };
})();