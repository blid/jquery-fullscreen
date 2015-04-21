/*
 * Copyright 2014-15 Krzysztof Kucharski
 */

(function ($) {
    'use strict';
    /*
     * Element which is fullscreen called on
     */
    var element = document.documentElement;
    /*
     * Currently used adapter
     */
    var adapter = null;

    var doc = document.documentElement;
    var _adapters = [NativeAdapter, WebkitAdapter, MozillaAdapter, MicrosoftAdapter, NotSupportedAdapter];

    /*
     * Bind browser specific event and trigger jQuery event
     */
    function _bindAndTriggerEvents(adapter) {
        $(document).off(adapter.eventName).on(adapter.eventName, function () {
            if (adapter.isActive()) {
                $(document).trigger(new jQuery.Event("enterFullScreen"));
            } else {
                $(document).trigger(new jQuery.Event("exitFullScreen"));
            }

            $(document).trigger(new jQuery.Event("fullScreenChange"), {isActive: adapter.isActive()});
        });
    }

    function NativeAdapter() {
    }

    function WebkitAdapter() {
    }

    function MozillaAdapter() {
    }

    function NotSupportedAdapter() {
    }

    function MicrosoftAdapter() {

    }

    $.extend(NativeAdapter.prototype, {
        isAvailabile: function () {
            return !!doc.requestFullscreen;
        },

        request: function () {
            element.requestFullscreen();
        },

        cancel: function () {
            document.exitFullscreen();
        },

        isActive: function () {
            return !!document.fullscreenElement;
        },

        eventName: "fullscreenchange"
    });

    $.extend(WebkitAdapter.prototype, {
        isAvailabile: function () {
            return !!doc.webkitRequestFullscreen;
        },

        request: function () {
            element.webkitRequestFullscreen();
        },

        cancel: function () {
            document.webkitCancelFullScreen();
        },

        isActive: function () {
            return document.webkitIsFullScreen;
        },

        eventName: "webkitfullscreenchange"
    });

    $.extend(MozillaAdapter.prototype, {
        isAvailabile: function () {
            return !!doc.mozRequestFullScreen;
        },

        request: function () {
            element.mozRequestFullScreen();
        },

        cancel: function () {
            document.mozCancelFullScreen();
        },

        isActive: function () {
            return window.fullScreen;
        },

        eventName: "mozfullscreenchange"
    });

    $.extend(MicrosoftAdapter.prototype, {
        isAvailabile: function () {
            return !!doc.msRequestFullscreen;
        },

        request: function () {
            element.msRequestFullscreen();
        },

        cancel: function () {
            document.msExitFullscreen();
        },

        isActive: function () {
            return !!document.msFullscreenElement;
        },

        eventName: "MSFullscreenChange"
    });


    // Not support browsers like IE8-10, just made the container pop above everything else
    $.extend(NotSupportedAdapter.prototype, {
        isAvailabile: function () {
            return true;
        },
        request: function () {
            var self = this;
            window.fakeFullScreenActive = true;

            var $window = $(window),
                $element = $(element),
                viewport_dimensions = {width: $window.width(), height: $window.height()},
                margin = 0;

            $element.css({
                width: viewport_dimensions.width - margin * 2,
                height: viewport_dimensions.height - margin * 2
            }).addClass('fakeFullScreen');

            $j(document).on('keyup.cancelFakeFullScreen', function (e) {
                if (e.keyCode == 27) {
                    self.cancel();
                }
            });

            $(document).trigger(this.eventName);
        },
        cancel: function () {
            window.fakeFullScreenActive = false;

            var $element = $(element);
            $element.removeClass('fakeFullScreen').css({
                width: '100%',
                height: '100%'
            });

            $(document).off('keyup.cancelFakeFullScreen');
            $(document).trigger(this.eventName);
        },

        isActive: function () {
            return window.fakeFullScreenActive;
        },

        eventName: "notsupportfullscreenchange"
    });

    var toggleExtension = {
        toggle: function () {
            if (!this.isActive()) {
                this.request();
            } else {
                this.cancel();
            }
        }
    };

    $.fn.fullscreen = function () {
        if (this.length > 1) {
            throw new Error("This plugin can be called on one element at once.");
        }
        if (!$.data(this[0], 'fullscreen')) {
            $.each(_adapters, function (i, val) {
                var implementation = new val();
                if (implementation.isAvailabile()) {
                    adapter = implementation;
                    _bindAndTriggerEvents(adapter);
                    $.extend(adapter, toggleExtension);
                    // way to check outside whether browser supports fullscreen API
                    $.support.fullscreen = true;
                    return false;
                }
            });
            element = this[0];

            $.data(this[0], 'fullscreen', adapter);
        }
        return $.data(this[0], 'fullscreen');
    }
})(jQuery);