(function () {

        function YOURAPPNAME(doc) {
            var _self = this;

            _self.doc = doc;
            _self.window = window;
            _self.html = _self.doc.querySelector('html');
            _self.body = _self.doc.body;
            _self.location = location;
            _self.hash = location.hash;
            _self.Object = Object;
            _self.scrollWidth = 0;

            _self.bootstrap();
        }

        YOURAPPNAME.prototype.bootstrap = function () {
            var _self = this;

            // Initialize window scollBar width
            _self.scrollWidth = _self.scrollBarWidth();
        };

        // Window load types (loading, dom, full)
        YOURAPPNAME.prototype.appLoad = function (type, callback) {
            var _self = this;

            switch (type) {
                case 'loading':
                    if (_self.doc.readyState === 'loading') callback();

                    break;
                case 'dom':
                    _self.doc.onreadystatechange = function () {
                        if (_self.doc.readyState === 'complete') callback();
                    };

                    break;
                case 'full':
                    _self.window.onload = function (e) {
                        callback(e);
                    };

                    break;
                default:
                    callback();
            }
        };

        // Detect scroll default scrollBar width (return a number)
        YOURAPPNAME.prototype.scrollBarWidth = function () {
            var _self = this,
                outer = _self.doc.createElement("div");
            outer.style.visibility = "hidden";
            outer.style.width = "100px";
            outer.style.msOverflowStyle = "scrollbar";

            _self.body.appendChild(outer);

            var widthNoScroll = outer.offsetWidth;

            outer.style.overflow = "scroll";

            var inner = _self.doc.createElement("div");

            inner.style.width = "100%";
            outer.appendChild(inner);

            var widthWithScroll = inner.offsetWidth;

            outer.parentNode.removeChild(outer);

            return widthNoScroll - widthWithScroll;
        };

        YOURAPPNAME.prototype.initSwitcher = function () {
            var _self = this;

            var switchers = _self.doc.querySelectorAll('[data-switcher]');

            if (switchers && switchers.length > 0) {
                for (var i = 0; i < switchers.length; i++) {
                    var switcher = switchers[i],
                        switcherOptions = _self.options(switcher.dataset.switcher),
                        switcherElems = switcher.children,
                        switcherTargets = _self.doc.querySelector('[data-switcher-target="' + switcherOptions.target + '"]').children;

                    for (var y = 0; y < switcherElems.length; y++) {
                        var switcherElem = switcherElems[y],
                            parentNode = switcher.children,
                            switcherTarget = switcherTargets[y];

                        if (switcherElem.classList.contains('active')) {
                            for (var z = 0; z < parentNode.length; z++) {
                                parentNode[z].classList.remove('active');
                                switcherTargets[z].classList.remove('active');
                            }
                            switcherElem.classList.add('active');
                            switcherTarget.classList.add('active');
                        }

                        switcherElem.children[0].addEventListener('click', function (elem, target, parent, targets) {
                            return function (e) {
                                e.preventDefault();
                                if (!elem.classList.contains('active')) {
                                    for (var z = 0; z < parentNode.length; z++) {
                                        parent[z].classList.remove('active');
                                        targets[z].classList.remove('active');
                                    }
                                    elem.classList.add('active');
                                    target.classList.add('active');
                                }
                            };

                        }(switcherElem, switcherTarget, parentNode, switcherTargets));
                    }
                }
            }
        };

        YOURAPPNAME.prototype.str2json = function (str, notevil) {
            try {
                if (notevil) {
                    return JSON.parse(str
                        .replace(/([\$\w]+)\s*:/g, function (_, $1) {
                            return '"' + $1 + '":';
                        })
                        .replace(/'([^']+)'/g, function (_, $1) {
                            return '"' + $1 + '"';
                        })
                    );
                } else {
                    return (new Function("", "var json = " + str + "; return JSON.parse(JSON.stringify(json));"))();
                }
            } catch (e) {
                return false;
            }
        };

        YOURAPPNAME.prototype.options = function (string) {
            var _self = this;

            if (typeof string != 'string') return string;

            if (string.indexOf(':') != -1 && string.trim().substr(-1) != '}') {
                string = '{' + string + '}';
            }

            var start = (string ? string.indexOf("{") : -1), options = {};

            if (start != -1) {
                try {
                    options = _self.str2json(string.substr(start));
                } catch (e) {
                }
            }

            return options;
        };

        YOURAPPNAME.prototype.formStyler = function () {
            const _self = this;
            const stylerVars = {
                inputs: $('input'),
                checkboxes: [],
                radio: []
            };
            const styler = {
                init: function () {
                    styler.sorting();
                    styler.checkbox(stylerVars.checkboxes);
                    styler.radio(stylerVars.radio);
                },
                sorting: function () {
                    stylerVars.inputs.each(function () {
                        var input = $(this);

                        if (this.hasAttribute('data-rendered') || this.hasAttribute('data-no-style'))
                            return;

                        if (input.attr('type') === 'checkbox') {
                            stylerVars.checkboxes.push(input);
                        }
                        else if (input.attr('type') === 'radio') {
                            stylerVars.radio.push(input);
                        }
                    });
                },
                checkbox: function (checkboxes) {
                    checkboxes.forEach(function (val, key) {
                        styler.templateBoxes('checkbox', val);
                    })
                    ;
                },
                radio: function (radio) {
                    radio.forEach(function (val, key) {
                        styler.templateBoxes('radio', val);
                    })
                    ;
                },
                templateBoxes: function (template_name, element) {
                    $(element)
                        .wrap('<span class="input-' + template_name + '"></span>')
                        .after('<span class="input-' + template_name + '__detector"></span>');
                }
            };

            styler.init();
        };

        YOURAPPNAME.prototype.popups = function (options) {
            var _self = this;

            var defaults = {
                reachElementClass: '.js-modal',
                closePopupClass: '.js-close-modal',
                currentElementClass: '.js-open-modal',
                changePopupClass: '.js-change-modal'
            };

            options = $.extend({}, options, defaults);

            var plugin = {
                reachPopups: $(options.reachElementClass),
                bodyEl: $('body'),
                topPanelEl: $('.top-panel-wrapper'),
                htmlEl: $('html'),
                closePopupEl: $(options.closePopupClass),
                openPopupEl: $(options.currentElementClass),
                changePopupEl: $(options.changePopupClass),
                bodyPos: 0
            };

            plugin.openPopup = function (popupName) {
                plugin.reachPopups.filter('[data-modal="' + popupName + '"]').addClass('opened');
                plugin.bodyEl.css('overflow-y', 'scroll');
                // plugin.topPanelEl.css('padding-right', scrollSettings.width);
                plugin.htmlEl.addClass('modal-opened');
            };

            plugin.closePopup = function (popupName) {
                plugin.reachPopups.filter('[data-modal="' + popupName + '"]').removeClass('opened');
                // setTimeout(function () {
                plugin.bodyEl.removeAttr('style');
                plugin.htmlEl.removeClass('modal-opened');
                plugin.topPanelEl.removeAttr('style');
                // }, 500);
            };

            plugin.changePopup = function (closingPopup, openingPopup) {
                plugin.reachPopups.filter('[data-modal="' + closingPopup + '"]').removeClass('opened');
                plugin.reachPopups.filter('[data-modal="' + openingPopup + '"]').addClass('opened');
            };

            plugin.init = function () {
                plugin.bindings();
            };

            plugin.bindings = function () {
                plugin.openPopupEl.on('click', function (e) {
                    e.preventDefault();
                    var pop = $(this).attr('data-open-modal');
                    plugin.openPopup(pop);
                });

                plugin.closePopupEl.on('click', function (e) {
                    var pop;
                    if (this.hasAttribute('data-close-modal')) {
                        pop = $(this).attr('data-close-modal');
                    } else {
                        pop = $(this).closest(options.reachElementClass).attr('data-modal');
                    }

                    plugin.closePopup(pop);
                });

                plugin.changePopupEl.on('click', function (e) {
                    e.preventDefault();
                    var closingPop = $(this).attr('data-closing-modal');
                    var openingPop = $(this).attr('data-opening-modal');

                    plugin.changePopup(closingPop, openingPop);
                });

                plugin.reachPopups.on('click', function (e) {
                    var target = $(e.target);
                    var className = options.reachElementClass.replace('.', '');
                    if (target.hasClass(className)) {
                        plugin.closePopup($(e.target).attr('data-modal'));
                    }
                });
            };

            if (options)
                plugin.init();

            return plugin;
        };

        YOURAPPNAME.prototype.headerChange = function () {
            var $header = $('.header__top-line');
            headerDetect($(window));
            $(window).scroll(function (e) {
                headerDetect($(this));
            });

            function headerDetect($window) {
                if ($window.scrollTop() > 0) {
                    $header.addClass('fixed');
                } else {
                    $header.removeClass('fixed');
                }
            }
        };

        YOURAPPNAME.prototype.accordion = function (selector) {
            var accordion = $(selector);
            accordion.find('[data-title]').on('click', function (e) {
                e.preventDefault();
                var $this = $(this);
                if ($this.parent().hasClass('active')) {
                    $this.parent().removeClass('active')
                    $this.next().slideUp(300);
                } else {
                    $this.closest('[data-item]').siblings().removeClass('active').find('[data-content]').slideUp(300);
                    $this.next().stop().slideDown(300).parent().addClass('active');
                }
            });
        };

        YOURAPPNAME.prototype.menu = function () {
            $('.js-open-menu').on('click', function (e) {
                e.preventDefault();
                $('html').addClass('menu-opened');
            });

            $('.js-close-menu').on('click', function (e) {
                e.preventDefault();
                $('html').removeClass('menu-opened');
            });
        };

        YOURAPPNAME.prototype.fileInput = function () {
            var input = $('[data-file-container] input[type="file"]');
            input.on('change', function () {
                var wrapper = $(this).parent('[data-file-container]');
                var str = $(this).val();

                var file = str.split(/(\\|\/)/g).pop();

                wrapper.find('[data-file-name]').text(file);
            });
        };

        var app = new YOURAPPNAME(document);

        app.appLoad('loading', function () {
            console.log('App is loading... Paste your app code here.');
            // App is loading... Paste your app code here. 4example u can run preloader event here and stop it in action appLoad dom or full
        });

        app.appLoad('dom', function () {
            console.log('DOM is loaded! Paste your app code here (Pure JS code).');
            // DOM is loaded! Paste your app code here (Pure JS code).
            // Do not use jQuery here cause external libs do not loads here...

            app.initSwitcher(); // data-switcher="{target='anything'}" , data-switcher-target="anything"
        });

        app.appLoad('full', function (e) {

            app.accordion('[data-accordion]');
            app.headerChange();

            $('.reviews__carousel').owlCarousel({
                items: 1,
                navigation: true,
                responsive: {
                    0: {
                        items: 1,
                        nav: false,
                        dots: true
                    },
                    768: {
                        items: 1,
                        nav: true,
                        dots: false
                    }
                }
            });

            $('.partners__carousel').owlCarousel({
                navigation: true,
                autoWidth: true,
                margin: 30,
                loop: true,
                responsive: {
                    0: {
                        nav: false,
                        dots: true
                    },
                    768: {
                        nav: true,
                        dots: false
                    }
                }
            });

            new WOW().init()

            app.menu();

            app.popups();
            app.formStyler();
            $('.chosen-select').chosen({
                width: 100
            });
            app.fileInput();
        });

    })();
