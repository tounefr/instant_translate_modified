/**
 * Created by chernikovalexey on 8/14/16.
 */

(function () {
    var $input = $('.translation-input');
    var $stt_layout = $('.stt-layout');

    var recognition;
    var loweringInterval;

    pl.extend(ke.particles.stt.model, {
        toggle: function () {
            if (!ke.isChromePro) {
                ke.particles.stt.model.upgradeToPro();
                return;
            }

            if (!ke.app.$stt_button.hasClass('active')) {
                $stt_layout.fadeIn(150, 'easeInSine');

                ke.app.siriWave.start();

                ke.app.$stt_button.addClass('active');

                recognition = new speechRecognition();
                recognition.lang = ke.ext.const.lang.stt[ke.ext.util.langUtil.getFromLang()][0];
                recognition.continuous = true;
                recognition.interimResults = true;

                loweringInterval = setInterval(function () {
                    ke.app.siriWave.setNoise(ke.app.siriWave._interpolation.amplitude - 0.05);
                }, 100);

                recognition.onresult = function (event) {
                    $input.val(event.results[0][0].transcript);

                    ke.app.siriWave.setNoise(ke.app.siriWave._interpolation.amplitude + 0.25);

                    if (event.results[0].isFinal) {
                        recognition.onend(null);

                        ke.app.handlers.toggleRawControls(false);
                    }
                };

                recognition.onerror = function (event) {
                    if (event.error === 'not-allowed') {
                        ke.particles.stt.model.requestPermission();
                    }
                };

                recognition.onstart = function (event) {
                };

                recognition.onend = function (event) {
                    ke.particles.stt.model.stop();
                };

                recognition.start();
            } else {
                recognition.stop();
            }
        },

        stop: function () {
            ke.app.siriWave.stop();
            $stt_layout.fadeOut(150, 'easeInSine');
            ke.app.siriWave._clear();
            ke.app.$stt_button.removeClass('active');

            clearInterval(loweringInterval);

            if (ke.app.flags.shouldHideSttButtonAfterEnd) {
                ke.app.flags.shouldHideSttButtonAfterEnd = false;

                ke.app.$stt_button.hide();
            }

            recognition.stop();
        },

        ctrlMicVisibility: function (lang) {
            if (lang in ke.ext.const.lang.stt && (ke.IS_CHROME || ke.IS_CHROME_PRO)) {
                ke.app.$stt_button.show();
            } else {
                if (ke.app.$stt_button.hasClass('active')) {
                    ke.app.flags.shouldHideSttButtonAfterEnd = true;
                } else {
                    ke.app.$stt_button.hide();
                }
            }
        },

        requestPermission: function () {
            window.open("../public/mic_access.html", "_blank", "resizable=0, scrollbars=0, titlebar=0, width=550, height=441, top=10, left=10");
        },

        upgradeToPro: function () {
            ke.particles.upgradeTt.model.show(ke.app.$stt_button, {
                desc: ke.getLocale('Window_Stt_OnlyProDesc')
            });
        }
    });

})();