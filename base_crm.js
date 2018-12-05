(function ($) {
    /**
     * form表单数据格式化
     * @returns {@this;@pro;value|Array}
     */
    $.fn.serializeJson = function () {
        var serializeObj = {};
        var array = this.serializeArray();
        var str = this.serialize();
        $(array).each(function () {
            if (serializeObj[this.name]) {
                if ($.isArray(serializeObj[this.name])) {
                    serializeObj[this.name].push(this.value);
                } else {
                    serializeObj[this.name] = [serializeObj[this.name], this.value];
                }
            } else {
                serializeObj[this.name] = this.value;
            }
        });
        return serializeObj;
    };
    /**
     * 
     * @param {type} opt
     * @returns {Boolean}
     */
    $.fn.bindTree = function (opt) {
        if (opt['url'] === undefined || opt['url'] === "") {
            com.alert("初始化树失败，请检查传入参数~");
            return false;
        }
        try {
            this.each(function () {
                var self = this;
                com.ajaxGet(opt.url, ((opt.data !== undefined && typeof (opt.data) === "object") ? opt.data : {})).done(function (ret) {
                    if (opt.done !== undefined && typeof (opt.done) === "function") {
                        opt.done(ret);
                    }
                    $(self).empty();
                    var json = $.extend({}, {
                        elem: $(self),
                        target: function () {
                            if (opt.target !== undefined) {
                                return opt.target;
                            }
                            return '_blank';
                        }(),
                        click: function (item) { //点击节点回调
                            if (opt.click !== undefined && typeof (opt.click) === "function") {
                                opt.click(item);
                            }
                        },
                        nodes: ret.data
                    }, opt);
                    layui.tree(json);
                });
            });
        } catch (e) {
            console.log(e);
            com.alert("初始化树失败，请检查JS引用情况~");
            return false;
        }
    };
    /**
     * 
     * @param {type} setting
     * @param {type} zNodes
     * @returns {unresolved}
     */
    $.fn.bindZTree = function (setting, zNodes) {
        return $.fn.zTree.init($(this), setting, zNodes);
    };
    /**
     * 初始化layui table
     * @param {type} table
     * @param {type} opt
     * @returns {unresolved}
     */
    $.fn.renderTable = function (table, opt) {
        opt.elem = $(this);
        return table.render(opt);
    };
    /**
     * 
     * @param {type} table
     * @param {type} opt
     * @returns {unresolved}
     */
    $.fn.renderPageTable = function (table, opt) {
        opt.elem = $(this);
        opt = $.extend({}, {
            height: 'full-100',
            loading: true,
            page: true,
            method: 'get',
            limits: [10, 20, 50, 100],
            limit: 20,
            groups: 5,
            layout: ['prev', 'page', 'next', 'skip', 'limit', 'count']
        }, opt);
        com.currentLayTable = table.render(opt);
        return com.currentLayTable;
    };
    /**
     * 初始化侧边弹窗
     * @param {type} options
     * @returns {undefined}
     */
    $.fn.showSide = function (options) {
        var self = $(this);
        self.data("animating", false);
        options = $.extend({}, {side: 'right'}, options);
        self.data("options", options);
        var content = $(".side-content", self);
        content.addClass("content-" + options['side']).css(options.side, '-' + content.css("width"));
        self.show();
        var conf = {};
        conf[options.side] = 0;
        self.data("animating", true);
        content.animate(conf, 250, function () {
            self.data("animating", false);
        });
        $("button[data-dismiss]", self).unbind("click").click(function () {
            if (!self.data("animating")) {
                var sc = $(this).closest(".side-content");
                var cscss = {};
                cscss[options.side] = ("-" + sc.css("width"));
                sc.animate(cscss, 250, function () {
                    $(this).closest(".side").hide();
                });
            }
        });
        $(".side-dialog", self).unbind("click").click(function (e) {
            if (!self.data("animating")) {
                var sc = $(".side-content", self);
                var cscss = {};
                cscss[options.side] = ("-" + sc.css("width"));
                sc.animate(cscss, 250, function () {
                    $(this).closest(".side").hide();
                });
            }
        });
    };
    /**
     * 隐藏侧边弹窗
     * @returns {undefined}
     */
    $.fn.hideSide = function () {
        var self = $(this),
                side = 'right',
                sc = $(".side-content", self),
                cscss = {};
        if (sc.hasClass("content-left")) {
            side = 'left';
        }
        cscss[side] = ("-" + sc.css("width"));
        self.data("animating", true);
        sc.animate(cscss, 250, function () {
            $(this).closest(".side").hide();
            self.data("animating", false);
        });
    };
    /**
     * 部门下拉树
     * @returns {undefined}
     */
    $.fn.deptTree = function () {
        this.each(function () {
            var self = $(this),
                    opt = $(this).data(),
                    opt = $.extend({}, {}, opt);

        });
    };
    /**
     * 
     * @returns {undefined}
     */
    $.fn.loading = function () {
        this.each(function () {
            $(this).html([
                '<div style="position: absolute;top: 50%;left: 50%;margin-left: -27px;margin-top: -25px;text-align: center;">',
                '<div>',
                '<i class="layui-icon layui-anim layui-anim-rotate layui-anim-loop" style="font-size: 50px;">',
                '&#xe63d;',
                '</i>',
                '</div>',
                '加载中',
                '</div>'
            ].join(""));
        });
    };
    /**
     * 显示Layui错误红框
     * @returns {undefined}
     */
    $.fn.showDanger = function () {
        var self = $(this);
        self.addClass("layui-form-danger").focus();
        self.change(function () {
            self.removeClass("layui-form-danger");
        });
        self.blur(function () {
            self.removeClass("layui-form-danger");
        });
    };
    /**
     * 隐藏Layui错误红框
     * @returns {undefined}
     */
    $.fn.hideDanger = function () {
        $(this).removeClass("layui-form-danger");
    };
    /**
     * 
     * @returns {undefined}
     */
    $.fn.loadProvinces = function () {
        this.each(function () {
            var opts = '<option value="">请选择省</option>';
            var value = $(this).data("value");
            $.each(com.getProvinces(), function (i, d) {
                opts += '<option value="' + d + '" ';
                if (value === d) {
                    opts += 'selected = "" ';
                }
                opts += ' >' + d + '</option>';
            });
            $(this).html(opts);
        });
    };
    /**
     * 
     * @param {type} pname
     * @returns {undefined}
     */
    $.fn.loadCities = function (pname) {
        this.each(function () {
            var opts = '<option value="">请选择市</option>';
            var value = $(this).data("value");
            $.each(com.getCities(pname), function (i, d) {
                opts += '<option value="' + d + '" ';
                if (value === d) {
                    opts += 'selected = "" ';
                }
                opts += ' >' + d + '</option>';
            });
            $(this).html(opts);
        });
    };
    /**
     * 
     * @param {type} pname
     * @param {type} cname
     * @returns {undefined}
     */
    $.fn.loadAreas = function (pname, cname) {
        this.each(function () {
            var opts = '<option value="">请选择地区</option>';
            var value = $(this).data("value");
            $.each(com.getAreas(pname, cname), function (i, d) {
                opts += '<option value="' + d + '" ';
                if (value === d) {
                    opts += 'selected = "" ';
                }
                opts += ' >' + d + '</option>';
            });
            $(this).html(opts);
        });
    };
    $.fn.tooltip = function () {
        com.util.tooltip(this);
    };
    $(".c-checkbox").unbind("change").bind("change", function () {
        if ($(this).hasClass("checkAll")) {
            $(".c-checkbox", $(this).closest("table")).prop("checked", $(this).is(":checked"));
        } else {
            var all = $(".c-checkbox", $(this).closest("table")).not(".checkAll").length;
            var checked = $(".c-checkbox:checked", $(this).closest("table")).not(".checkAll").length;
            $(".checkAll", $(this).closest("table")).prop("checked", (all === checked));
        }
    });
    $("body").on("click", "button[data-toggle='side']", function () {
        var options = $(this).data(),
                animating = false;
        options = $.extend({}, {side: 'right'}, options);
        if (!options.target) {
            return false;
        }
        var content = $(".side-content", $(options.target));
        content.addClass("content-" + options['side']).css(options.side, '-' + content.css("width"));
        $(options.target).show();
        var conf = {};
        conf[options.side] = 0;
        animating = true;
        content.animate(conf, 250, function () {
            animating = false;
        });
        $("button[data-dismiss]", $(options.target)).unbind("click").click(function () {
            if (!animating) {
                var sc = $(this).closest(".side-content");
                var cscss = {};
                cscss[options.side] = ("-" + sc.css("width"));
                sc.animate(cscss, 250, function () {
                    $(this).closest(".side").hide();
                });
            }
        });
        $(".side-dialog", $(options.target)).unbind("click").click(function (e) {
            if (!animating) {
                var sc = $(".side-content", $(options.target));
                var cscss = {};
                cscss[options.side] = ("-" + sc.css("width"));
                sc.animate(cscss, 250, function () {
                    $(this).closest(".side").hide();
                });
            }
        });
    });
})(jQuery);

$.validator && $.validator.setDefaults({
    highlight: function (element) {
        $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
    },
    success: function (element) {
        element.closest('.form-group').removeClass('has-error').addClass('has-success');
    },
    errorElement: "div",
    errorPlacement: function (error, element) {
        if (element.is(":radio") || element.is(":checkbox")) {
            error.appendTo(element.parent());
        } else {
            if (element.parent(".form-group").length) {
                error.appendTo(element.parent());
            } else {
                element.parent().after(error);
            }
        }
    },
    errorClass: "help-block m-b-none",
    validClass: "help-block m-b-none"
});
if (typeof String.prototype.trim !== 'function') {
    String.prototype.trim = function () {
        return $.trim(this);
    };
}
String.prototype.MD5 = function (bit) {
    var sMessage = this;
    function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4)
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        if (lX4 | lY4)
        {
            if (lResult & 0x40000000)
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            else
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
        } else
            return (lResult ^ lX8 ^ lY8);
    }
    function F(x, y, z) {
        return (x & y) | ((~x) & z);
    }
    function G(x, y, z) {
        return (x & z) | (y & (~z));
    }
    function H(x, y, z) {
        return (x ^ y ^ z);
    }
    function I(x, y, z) {
        return (y ^ (x | (~z)));
    }
    function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }
    function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }
    function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }
    function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    }
    function ConvertToWordArray(sMessage) {
        var lWordCount;
        var lMessageLength = sMessage.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (sMessage.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    }
    function WordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    }
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    // Steps 1 and 2. Append padding bits and length and convert to words 
    x = ConvertToWordArray(sMessage);
    // Step 3. Initialise 
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;
    // Step 4. Process the message in 16-word blocks 
    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD);
    }
    if (bit == 32) {
        return WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
    } else {
        return WordToHex(b) + WordToHex(c);
    }
};
//扩展时间类 yyy-MM-dd hh:mm:ss
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month 
        "d+": this.getDate(), //day 
        "h+": this.getHours(), //hour 
        "m+": this.getMinutes(), //minute 
        "s+": this.getSeconds(), //second 
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
        "S": this.getMilliseconds() //millisecond 
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
var com = new function () {
    var self = this;
    window.com = this;
    self.util = {
        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        isEmpty: function (obj) {
            return obj === undefined || obj === null || obj === "";
        },
        isEmptyOrWhiteSpace: function (obj) {
            return obj === undefined || obj === null || obj === "" || !/[\S]+/.test(obj);
        },
        focus: function (element) {
            var $element = (element instanceof jQuery) ? element : $(element);
            if (this.isMsie8()) {
                $element[0].focus();
            } else {
                $element.focus();
            }
        },
        stringCompareIgnoreCase: function (s1, s2) {
            if (self.util.isEmpty(s1) && self.util.isEmpty(s2)) {
                return true;
            }

            if (self.util.isEmpty(s1) || self.util.isEmpty(s2)) {
                return false;
            }

            return s1.toUpperCase() === s2.toUpperCase();
        },
        isMsie8: function () {
            var rv = -1;
            var ua = navigator.userAgent;
            var re = new RegExp("Trident\/([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null) {
                rv = parseFloat(RegExp.$1);
            }
            return (rv == 4);
        },
        queryString: function (name, defaultValue) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
            var results = regex.exec(location.search);
            return results === null ? defaultValue : decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        isArray: function (obj) {
            return Object.prototype.toString.call(obj) == '[object Array]';
        },
        /**
         * 判断文件是都是图片
         * @param {type} file
         * @returns {Boolean}
         */
        isImageFile: function (file) {
            if (file.type) {
                return /^image\/\w+$/.test(file.type);
            } else {
                return /\.(jpg|jpeg|png|gif)$/.test(file);
            }
        },
        /**
         * 随机字符串
         * @param {type} len
         * @returns {com.basecom.randomString.str|String}
         */
        randomString: function (len) {
            len = len || 32;
            var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            var maxPos = chars.length;
            var str = '';
            for (i = 0; i < len; i++) {
                str += chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return str;
        },
        /**
         * 获取文件后缀
         * @param {type} filename
         * @returns {String}
         */
        fileExtName: function (file) {
            var ext = "png";
            if (file['name']) {
                var pos = file['name'].lastIndexOf('.') + 1;
                if (pos !== -1) {
                    return file['name'].substring(pos).toLocaleLowerCase();
                }
            }
            if (file['type']) {
                var pos = file['type'].lastIndexOf('/') + 1;
                if (pos !== -1) {
                    return file['type'].substring(pos).toLocaleLowerCase();
                }
            }
            return ext;
        },
        /**
         * base64转Blob
         * @param {type} base64Data
         * @returns {Blob}
         */
        baseToBlob: function (base64Data) {
            var byteString;
            if (base64Data.split(',')[0].indexOf('base64') >= 0) {
                byteString = atob(base64Data.split(',')[1]);
            } else {
                byteString = unescape(base64Data.split(',')[1]);
            }
            var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            return new Blob([ia], {type: mimeString});
        },
        /**
         * 获取随机文件名称
         * @param {type} file
         * @returns {com.basecom.util.createFileName.filename}
         */
        createRandomFileName: function (file) {
            var filename = function () {
                var name = file['name'];
                var reg = /\s+|[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]/g;
                name = name.replace(reg, '');
                name = name.substring(0, name.lastIndexOf("."));
                return name + "_" + com.util.randomString(16) + "." + com.util.fileExtName(file);
            }();
            return  filename;
        },
        /**
         *  图片压缩
         * @param {type} files
         * @param {type} config
         * @returns {undefined}
         */
        imageCompress: function (files, config) {
            var opt = $.extend({}, {
                point: 0.6, //压缩质量 0~1超过此范围默认为0.92
            }, config);
            var _files = [];
            for (var i = 0; i < files.length; i++) {
                var file = files[i],
                        fileType = file.type;
                if (/image\/\w+/.test(fileType)) {
                    _files.push(file);
                }
            }
            var maxLength = _files.length;
            var index = 1;
            for (var i = 0; i < maxLength; i++) {
                var file = files[i],
                        fileType = file.type;
                var URL = window.URL || window.webkitURL;
                var objectURL = URL.createObjectURL(file);
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = function (event) {
                    var result = event.target.result;//返回的dataURL
                    var image = new Image();
                    image.src = result;
                    image.onload = function () {
                        var cvs = document.createElement('canvas');
                        var scale = 1;
                        var max = this.width > this.height ? this.width : this.height;
                        if (!opt['max']) {
                            opt['max'] = max;
                        }
                        if (max > opt['max']) {
                            scale = opt['max'] / max;
                        }
                        cvs.width = this.width * scale;
                        cvs.height = this.height * scale;//计算等比缩小后图片宽高  
                        var ctx = cvs.getContext('2d');
                        ctx.drawImage(this, 0, 0, cvs.width, cvs.height);
                        var base64Data = cvs.toDataURL(fileType, opt['point']);   //重新生成图
                        var byteString = base64Data.replace("data:" + fileType + ";base64,", '');
                        var ia = new Uint8Array(byteString.length);
                        for (var i = 0; i < byteString.length; i++) {
                            ia[i] = byteString.charCodeAt(i);
                        }
                        var blobImage = new Blob([ia], {type: fileType});
                        blobImage.name = file['name'];
                        blobImage.base64Data = base64Data;
                        opt['call'] && opt['call'].call(blobImage, index, maxLength);
                        index++;
                    };
                };
            }
        }, tooltip: function (elems) {
            if (!elems && !elems.length) {
                return false;
            }
            var tipsIndex = 0;
            elems.on("mouseenter", function () {
                if ($(this).text()) {
                    tipsIndex = layer.tips($(this).text(), $(this), {tips: [4, '#3595CC'], time: 9999999});
                } else {
                    tipsIndex = 0;
                }
            });
            elems.on("mouseleave", function () {
                if (tipsIndex) {
                    layer.close(tipsIndex);
                }
            });
        }, copyText(text) {
            var textArea = document.createElement("textarea");
            textArea.style.position = 'fixed';
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = '0';
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            textArea.style.opacity = 0;
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                if (document.execCommand('copy')) {
                    layer.msg("复制成功", {icon: 1});
                } else {
                    layer.msg("复制失败", {icon: 2, shift: 6});
                }
            } catch (err) {
                layer.msg("该浏览器不支持点击复制到剪贴板", {icon: 2, shift: 6});
            } finally {
                document.body.removeChild(textArea);
            }
        }
    };
    self.countDownTimer = new function () {
        var _timer;
        var _totalTicks = 60;
        var _ticks = _totalTicks;
        var _self = this;
        _self.countDown = function (progress, completed) {
            _ticks--;
            if (_ticks > 0) {
                if (typeof progress === 'function') {
                    progress(_ticks);
                }
            } else {
                clearInterval(_timer);
                _ticks = _totalTicks;
                if (typeof completed === 'function') {
                    completed();
                }
            }
        }
        _self.start = function (totalTicks, progress, completed) {
            clearInterval(_timer);
            _totalTicks = _ticks = totalTicks;
            _timer = setInterval(function () {
                _self.countDown(progress, completed);
            }, 1000);
        };
    };
    self.getNoCacheUrl = function (url) {
        if (url.indexOf("ts=") > 0) {
            return url;
        }
        if (url.indexOf('?') > 0) {
            return url + "&ts=" + new Date().getTime();
        }
        return url + "?ts=" + new Date().getTime();
    };
    /**
     * url（String）                    (默认: 当前页面地址)发送请求的地址。
     * type（String）                   (默认: 'GET')请求方式 ("POST" 或 "GET")， 默认为 "GET"。注意:其它 HTTP 请求方法，如 PUT 和 DELETE 也可以使用，但仅部分浏览器支持。
     * data（Object, String）           发送到服务器的数据。将自动转换为请求字符串格式。
     * dataType（String）               (默认: Intelligent Guess (xml, json, script, or html))可用值xml，html，script，json，jsonp，text
     * async（ Boolean）                (默认: true)
     *                                  默认设置下，所有请求均为异步请求（也就是说这是默认设置为 true ）。如果需要发送同步请求，请将此选项设置为 false 。跨域请求和 dataType: "jsonp" 请求不支持同步操作。
     *                                  注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。
     *                                  GET 请求中将附加在 URL 后面。对象必须为"{键:值}"格式。如果这个参数是一个数组，jQuery会按照traditional 参数的值， 将自动转化为一个同名的多值查询字符串。
     * cache（Boolean）                 (默认: 取决于数据类型)如果设置为 false ，浏览器将不缓存此页面。
     *                                  注意: 设置cache为 false将在 HEAD和GET请求中正常工作。它的工作原理是在GET请求参数中附加"_={时间戳}"。
     *                                  该参数不是其他请求所必须的，除了在IE8中，当一个POST请求一个已经用GET请求过的URL。
     * contentType（String）            (默认: 'application/x-www-form-urlencoded; charset=UTF-8')
     *                                  发送信息至服务器时内容编码类型。默认值是"application/x-www-form-urlencoded; charset=UTF-8"，适合大多数情况。
     *                                  如果你明确地传递了一个内容类型（Content-Type）给 $.ajax()，那么他必定会发送给服务器（即使没有数据要发送）。
     *                                  数据将总是使用UTF-8字符集传递给服务器；你必须在服务器端进行适当的解码。
     * context（Object）                这个对象用于设置Ajax相关回调函数的上下文。 
     *                                  默认情况下，这个上下文是一个ajax请求使用的参数设置对象，（$.ajaxSettings合并独傲这个设置，传递给$.ajax）。
     *                                  比如指定一个DOM元素作为context参数，这样就设置了complete回调函数的上下文为这个DOM元素。
     * crossDomain（Boolean）           (默认: 同域请求为false， 跨域请求为true)如果你想在同一域中强制跨域请求（如JSONP形式），例如，想服务器端重定向到另一个域，那么需要将crossDomain设置为 true 。
     * headers（PlainObject）           (默认: {})一个额外的"{键:值}"对映射到请求一起发送。此设置会在beforeSend 函数调用之前被设置 ;因此，请求头中的设置值，会被beforeSend 函数内的设置覆盖。
     * ifModified（Boolean）            (默认: false)只有上次请求响应改变时，才允许请求成功。使用 HTTP 包 Last-Modified 头信息判断。默认值是false，忽略HTTP头信息。
     *                                  在jQuery 1.4中，他也会检查服务器指定的'etag'来确定数据没有被修改过。
     * isLocal（Boolean）               (默认: 取决于当前的位置协议)允许当前环境被认定为“本地”，（如文件系统），即使jQuery默认情况下不会这么做。
     *                                  以下协议目前公认为本地：file, *-extension, and widget。如果isLocal设置需要修改，建议在$.ajaxSetup()方法中这样做一次。
     * jsonp（String）                  在一个jsonp请求中重写回调函数的名字。
     *                                  这个值用来替代在"callback=?"这种GET或POST请求中URL参数里的"callback"部分，比如{jsonp:'onJsonPLoad'}会导致将"onJsonPLoad=?"传给服务器。
     *                                  在jQuery 1.5，，设置jsonp选项为false，阻止了jQuery从加入"?callback"字符串的URL或试图使用"=?"转换。在这种情况下，你也应该明确设置jsonpCallback设置。
     *                                  例如, { jsonp: false, jsonpCallback: "callbackName" }
     * jsonpCallback（String, Function）为jsonp请求指定一个回调函数名。这个值将用来取代jQuery自动生成的随机函数名。
     *                                  这主要用来让jQuery生成一个独特的函数名，这样管理请求更容易，也能方便地提供回调函数和错误处理。
     *                                  你也可以在想让浏览器缓存GET请求的时候，指定这个回调函数名。
     *                                  从jQuery 1.5开始，你也可以使用一个函数作为该参数设置，在这种情况下，该函数的返回值就是jsonpCallback的结果。
     * mimeType（String）               一个mime类型用来覆盖XHR的 MIME类型。
     * password（String）               用于响应HTTP访问认证请求的密码。
     * username（String）               于响应HTTP访问认证请求的用户名。
     * processData（Boolean）           默认情况下，通过data选项传递进来的数据，如果是一个对象(技术上讲只要不是字符串)，都会处理转化成一个查询字符串，以配合默认内容类型 "application/x-www-form-urlencoded"。
     *                                  如果要发送 DOM 树信息或其它不希望转换的信息，请设置为 false。
     * scriptCharset（String）          仅适用于当"script"传输使用时（例如，跨域的"jsonp"或 dataType选项为"script" 和 "GET"类型）。请求中使用在script标签上设置charset 属性。通常只在本地和远程的内容编码不同时使用。
     * statusCode（PlainObject）        (默认: {})一组数值的HTTP代码和函数对象，当响应时调用了相应的代码。例如，如果响应状态是404，将触发以下警报：
     *                                  $.ajax({
     *                                      statusCode: {
     *                                        404: function() {
     *                                          alert("page not found");
     *                                        }
     *                                     }
     *                                  });
     *                                  如果请求成功，状态代码对应的函数作为回调的成功相同的参数;如果在一个错误的结果，他们采取了相同的参数error回调。
     * timeout（Number）                设置请求超时时间（毫秒）。
     *                                  此设置将覆盖$.ajaxSetup() 里的全局设置。 超时周期开始于$.ajax 访问成功的那个时间点；如果几个其他请求都在进步并且浏览器有没有可用的连接，它有可能在被发送前就超时了。
     *                                  在 jQuery 1.4.x 和前面的版本中, 如果请求超时，XMLHttpRequest对象是处于无效状态;访问任何对象的成员可能会抛出一个异常。
     *                                  只有在 Firefox 3.0+,script 和 JSONP请求在超时后不能被取消;该脚本将运行即使超时后到达。
     * traditional（Boolean）           如果你想要用传统的方式来序列化数据，那么就设置为true。请参考工具分类下面的jQuery.param 方法.
     *
     * * @param {type} options
     * @returns {undefined}
     */
    self.ajax = function (options, type) {
        var config = $.extend({}, {
            url: '/',
            cache: true,
            contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
            type: 'get',
            data: {},
            dataType: 'json'
        }, options);
        var index = layer.load(2);
        var request = $.ajax(config);
        request.fail(function (xhr, status, error) {
            var data = xhr.responseJSON ? xhr.responseJSON : {msg: error};
            switch (xhr.status) {
                case 403:
                    layer.msg(data.msg, {icon: 5, shift: 6, time: 2500, fixed: false});
                    break;
                case 401:
                    layer.alert(data.msg, {icon: 5, shift: 6, fixed: false}, function () {
                        (data['redirect_uri'] !== undefined) && (window.top.location.href = data['redirect_uri']);
                    });
                    break;
                default:
                    try {
                        layer.msg(error, {icon: 5, shift: 6, time: 2500, fixed: false});
                    } catch (e) {
                        layer.msg("获取接口信息失败~", {icon: 5, shift: 6, time: 2500, fixed: false});
                        console.log("获取接口信息失败~" + e);
                    }
                    break;
            }
        });
        request.done(function (ret, a, b, c) {
            if (ret['code'] === 0) {
                if (type === 'post' && ret['msg'] !== "") {
                    layer.msg(ret['msg']);
                }
            } else if (ret['code'] === 1) {
                layer.msg(ret['msg'], {icon: 2, shift: 6});
            }
        });
        request.always(function () {
            layer.close(index);
        });
        return request;
    };

    /**
     * 
     * @param {type} url
     * @param {type} data
     * @param {type} config
     * @returns {jqXHR|com.basecom.ajax.request|com.ajax.request|undefined}
     */
    self.ajaxPost = function (url, data, config) {
        config = $.extend({}, {
            url: url,
            type: 'post',
            data: (data !== undefined && ((typeof (data) === 'string')) || (typeof (data) === 'object')) ? data : {}
        }, config);
        return com.ajax(config, 'post');
    };

    /**
     * 
     * @param {type} url
     * @param {type} data
     * @param {type} config
     * @returns {jqXHR|com.basecom.ajax.request|com.ajax.request|undefined}
     */
    self.ajaxGet = function (url, data, config) {
        config = $.extend({}, {
            url: url,
            type: 'get',
            data: (data !== undefined && ((typeof (data) === 'string')) || (typeof (data) === 'object')) ? data : {}
        }, config);
        return com.ajax(config, 'get');
    };
    /**
     * 
     * @param {type} msg
     * @param {type} icon
     * @param {type} call
     * @returns {undefined}
     */
    self.alert = function (msg, icon, call) {
        try {
            var index = layer.alert(msg, {icon: icon, anim: 0, fixed: false, closeBtn: 0}, function () {
                call && call();
                layer.close(index);
            });
        } catch (e) {
            alert(msg);
            call && call();
        }
    };
    /**
     * 
     * @param {type} msg
     * @param {type} icon
     * @param {type} call
     * @returns {Boolean}
     */
    self.confirm = function (msg, icon, call) {
        try {
            var index = layer.confirm(msg, {
                icon: icon,
                closeBtn: 0,
                btn: ['确定', '取消']
            }, function () {
                call && call(true);
                layer.close(index);
            }, function () {
                call && call(false);
                layer.close(index);
            });
        } catch (e) {
            if (confirm(msg)) {
                call && call(true);
                return false;
            }
            call && call(false);
        }
    };
    /**
     * 获取全部省
     * @returns {Array|com.basecom.getProvinces.p|com.getProvinces.p}
     */
    self.getProvinces = function () {
        var p = [];
        $.each(pcaData, function (i, d) {
            p.push(d['name']);
        });
        return p;
    };
    /**
     * 根据省份获取市
     * @param {type} pname
     * @returns {Array|com.basecom.getCities.c|com.getCities.c}
     */
    self.getCities = function (pname) {
        var c = [];
        if (pname === undefined) {
            return c;
        }
        $.each(pcaData, function (i, d) {
            if (d['name'] === pname) {
                $.each(d['city'], function (ii, dd) {
                    c.push(dd['name']);
                });
                return false;
            }
        });
        return c;
    };
    /**
     * 
     * @returns {undefined}
     */
    self.getAreas = function (pname, cname) {
        var c = [];
        if (pname === undefined || cname === undefined) {
            return c;
        }
        $.each(pcaData, function (i, d) {
            if (d['name'] === pname) {
                $.each(d['city'], function (ii, dd) {
                    if (dd['name'] === cname) {
                        c = dd['area'];
                        return false;
                    }
                });
                return false;
            }
        });
        return c;
    };
    /**
     * 
     * @param {type} ct 默认时间
     * @param {type} yes 
     * @param {type} clear
     * @returns {undefined}
     */
    self.dateTimtSelectorPanel = function (ct, yes, clear) {
        var date = function () {
            if (com.util.isEmpty(ct)) {
                return new Date().format('yyyy-MM-dd');
            } else {
                return new Date(ct).format('yyyy-MM-dd');
            }
        }();
        var time = function () {
            if (com.util.isEmpty(ct)) {
                return new Date().format('hh:mm:ss');
            } else {
                return new Date(ct).format('hh:mm:ss');
            }
        }();
        var date_time_selector = $([
            '<div class="trace_datetime_selector">',
            '<div class="trace_date_selector"></div>',
            '<div class="trace_time_selector"></div>',
            '<div class="trace_time_selector_showtime">',
            date + ' ' + time,
            '</div>',
            '</div>'
        ].join(""));
        $("body").append(date_time_selector);
        var laydate = layui.laydate;
        laydate.render({
            elem: '.trace_datetime_selector .trace_date_selector',
            type: 'date',
            position: 'static',
            showBottom: false,
            value: date,
            done: function (value) {
                date = value;
                $(".trace_time_selector_showtime", date_time_selector).text(date + ' ' + time);
            }
        });
        laydate.render({
            elem: '.trace_datetime_selector .trace_time_selector',
            type: 'time',
            position: 'static',
            showBottom: false,
            value: time,
            change: function (value) {
                time = value;
                $(".trace_time_selector_showtime", date_time_selector).text(date + ' ' + time);
            }
        });
        layer.open({
            type: 1,
            title: '请选择时间',
            closeBtn: 0,
            area: ['580px', '420px'], //宽高
            shade: [0.1, '#000000'],
            resize: false,
            content: date_time_selector,
            btn: ['确定', '清空', '关闭'],
            yes: function (index, layero) {
                yes && yes(date + " " + time, date_time_selector, index);
            },
            btn2: function (index, layero) {
                clear && clear(date_time_selector, index);
                return false;
            },
            btn3: function (index, layero) {
                date_time_selector.remove();
                layer.close(index);
                setTimeout(function () {
                    $("#layui-layer" + index).remove();
                }, 500);
            }
        });
    };

    /**
     * 
     * @param {type} body
     * @returns {undefined}
     */
    self.onMessage = function (body, h) {
        var handler = {
            PUSH_DATA: function () {
                if (com.currentLayTable) {
                    $("body").queue(function () {
                        var self = $(this);
                        com.currentLayTable.pushData(body['data'], function () {
                            setTimeout(function () {
                                self.dequeue();
                            }, 50);
                        });
                    });
                } else {
                    layer.open({
                        type: 1,
                        title: body['title'],
                        shade: 0,
                        area: ['340px', '220px'],
                        offset: 'rb',
                        time: body['delay'] || 10000,
                        anim: 2,
                        content: '<div class="notice-message-box">' + body['msg'] + '</div>'
                    });
                }
            },
            /**
             * 中间弹出 常规消息
             * @returns {undefined}
             */
            SHOW_MSG: function () {
                layui.layer.alert(body['msg']);
            },
            /**
             * 弹出页面
             * @returns {undefined}
             */
            SHOW_DIALOG: function () {
                layer.open({
                    type: 2,
                    title: body['title'],
                    shade: [0.3, '#000'],
                    maxmin: true,
                    area: ['900px', '600px'],
                    content: body['msg']
                });
            },
            /**
             * 弹出公告
             * @returns {undefined}
             */
            SHOW_TOPIC: function () {
                layer.open({
                    type: 1,
                    title: false,
                    closeBtn: false,
                    area: ['500px', '400px'],
                    shade: 0.8,
                    btn: ['我知道了'],
                    btnAlign: 'c',
                    moveType: 1,
                    content: '<div class="notice-message-box">' + body['msg'] + '</div>'
                });
            },
            /**
             * 右下角
             * @returns {undefined}
             */
            SHOW_NOTIFY: function () {
                layer.open({
                    type: 1,
                    title: body['title'],
                    shade: 0,
                    area: ['340px', '220px'],
                    offset: 'rb',
                    time: body['delay'] || 10000,
                    anim: 2,
                    content: '<div class="notice-message-box">' + body['msg'] + '</div>'
                });
            },
            /**
             * 
             * @returns {undefined}
             */
            SHOW_TIPS: function () {
                layer.msg(body['msg']);
            },
            /**
             * 
             * @returns {undefined}
             */
            RELOAD_DATA: function () {
                com.currentLayTable.reloadData();
            },
            SHOW_NOTIFY_SALES: function () {

            }
        };
        try {
            handler[h].call();
        } catch (e) {
            console.warn(e);
        }
    };
};