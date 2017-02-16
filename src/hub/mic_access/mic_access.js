/**
 * Created by chernikovalexey on 8/14/16.
 */

window.addEventListener("DOMContentLoaded", function () {
    window.speechRecognition = window.SpeechRecognition || window.mozSpeechRecognition || window.webkitSpeechRecognition || window.msSpeechRecognition;

    var body_el = document.getElementsByTagName("body")[0];
    var head_el = document.getElementsByClassName("head")[0];
    var note_el = document.getElementsByClassName("note")[0];
    var button_el = document.getElementsByTagName("button")[0];
    var subnote_el = document.getElementsByClassName("subnote")[0];

    document.title = chrome.i18n.getMessage("MicAccess_PageTitle");
    head_el.innerHTML = chrome.i18n.getMessage("MicAccess_Title");
    note_el.innerHTML = chrome.i18n.getMessage("MicAccess_Note");
    button_el.innerHTML = chrome.i18n.getMessage("MicAccess_UnlockButton");
    subnote_el.innerHTML = chrome.i18n.getMessage("MicAccess_HowToUnlock", chrome.runtime.getURL(""));

    var r = new speechRecognition();
    r.lang = "en-US";
    r.interimResults = true;
    r.continuous = true;

    r.onstart = function (e) {
        r.stop();
        window.close();
    };

    r.onerror = function (e) {
        if (e.error === 'not-allowed') {
            body_el.style.marginTop = "70px";
            button_el.style.display = "inline-block";
            subnote_el.style.display = "block";

            button_el.onclick = function () {
                chrome.tabs.create({
                    url: "chrome://settings/contentExceptions#media-stream-mic"
                });
            };
        }
    };

    r.start();
}, false);