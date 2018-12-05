(function () {
    /**
     * 接待客服选择列表
     * @param {type} opts opts.more|是否多选 opts.call|点击确定后的回调函数
     * @returns {undefined}
     */
    com.salerSelector = function (opts) {
        opts = $.extend({
            more: false,
            call: null,
            selected: [],
            title: '接待客服',
            cannull: false
        }, opts);
        var index, outer = $('<div class="saler-selecter"></div>');
        var createDataTable = function (data) {
            var data = $.map(data, function (d, i) {
                if (opts['more'] && (opts['selected'] ? opts['selected'] : []).indexOf(d['userid']) !== -1) {
                    d['LAY_CHECKED'] = true;
                } else if (!opts['more'] && (opts['selected'] ? opts['selected'] : []).indexOf(d['userid']) !== -1) {
                    d['important'] = '#5FB878';
                }
                return d;
            });
            var cols = [
                {field: 'nickname', title: '花名', width: 100},
                {field: 'dept_id', title: '部门', width: 100},
                {field: 'count', title: '累计接待', width: 100, sort: true},
                {field: 'limit', title: '接待上限', width: 100, sort: true},
                {field: 'order', title: '排序', width: 100, sort: true},
                {field: 'weight', title: '权重', width: 100, sort: true},
                {field: 'status', title: '状态', width: 100, sort: true, celHandler: function (d) {
                        return d['status'] ? '<span style="color:#5FB878;">接单中</span>' : '暂停中';
                    }}
            ];
            if (opts['more']) {
                cols.unshift({type: 'checkbox'});
            } else {
                cols.push({title: '#', width: 80, align: 'center', toolbar: '<script type="text/html" id="employee_table_bar"><a class="layui-btn layui-btn-sm layui-btn-xs" lay-event="add"> 分配 </a></script>'});
            }
            $("#base_saler_selecter_table", outer).renderTable(layui.table, {
                id: "base_saler_selecter_table",
                height: '350',
                limit: 1000,
                page: false,
                sortType: 'local',
                data: data,
                cols: [
                    cols
                ]
            });
            if (!opts['more']) {
                layui.table.on("tool(base_saler_selecter_table)", function (obj) {
                    var data = obj['data'];
                    opts['call'] && opts['call']({
                        userid: data['userid'],
                        name: data['nickname']
                    });
                    outer.remove();
                    layer.close(index);
                    setTimeout(function () {
                        $("#layui-layer" + index).remove();
                    }, 500);
                });
            }
        }, loadData = function (call) {
            com.ajaxGet("/business/Reception/list", {
                flow_id: opts['flow_id'],
                node: opts['node'],
                q: $("input[name='q']", outer).val()
            }).done(function (ret) {
                createDataTable(ret['data']);
            });
        }, loadSaler = function (gId) {
            outer.empty().append([
//                '<form class="layui-form" id="search-form">',
//                '<div class="layui-inline" style="margin-right: 10px;">',
//                '<input class="form-control datetime-select" name="q" placeholder="关键字搜索" autocomplete="off" style="width: 300px;">',
//                '</div>',
//                '<div class="layui-inline">',
//                '<button type="button" class="btn btn-outline btn-warning btn-search" style="margin-right: 10px;">搜索</button>',
//                '<button type="reset" class="btn btn-outline btn-info btn-search-reset">重置</button>',
//                '</div>',
//                '</form>',
                '<table class="layui-table" id="base_saler_selecter_table" style="display: none;" lay-filter="base_saler_selecter_table"></table>'
            ].join(""));
            loadData();
        }, bindEvent = function () {
            $(".btn-search", outer).click(function () {
                loadData();
            });
            $(".btn-search-reset", outer).click(function () {
                $("input[name='q']", outer).val('');
                loadData();
            });
        };
        $("body").append(outer);
        outer.loading();
        index = layer.open({
            type: 1,
            title: '请选择' + opts.title,
            closeBtn: 0,
            area: [(opts['more'] ? 787 : '819') + 'px', '500px'], //宽高
            shade: [0.1, '#000000'],
            resize: false,
            content: outer,
            btn: opts['more'] ? ['确定', '关闭'] : ['关闭'],
            yes: function (index, layero) {
                if (opts['more']) {
                    if (!opts['call']) {
                        return false;
                    }
                    var data = layui.table.checkStatus('base_saler_selecter_table')['data'];
                    var items = $.map(data, function (d, i) {
                        return {userid: d['userid'], name: d['nickname']};
                    });
                    if (!opts['cannull'] && items.length === 0) {
                        layer.msg("请选" + opts.title + "~", {icon: 2, shift: 6, time: 1500});
                        return false;
                    }
                    opts['call'](items);
                }
                outer.remove();
                layer.close(index);
                setTimeout(function () {
                    $("#layui-layer" + index).remove();
                }, 500);
            }, btn2: function (index, layero) {
                outer.remove();
                layer.close(index);
                setTimeout(function () {
                    $("#layui-layer" + index).remove();
                }, 500);
            }
        });
        loadSaler();
        bindEvent();
    };
    /**
     * 
     * @param {type} opts
     * more:是否可多选，
     * call:确定后的回调函数
     * gIds:需要显示的分组ID，默认空为显示全部
     * selected：需要默认选中的人员ID
     * title：标题
     * @returns more ? [{userid: xx,name: xx},...] : {userid: xx,name: xx}
     */
    com.servicerSelector = function (opts) {
        opts = $.extend({
            more: true,
            call: null,
            groupId: [],
            selected: [],
            title: '服务人员',
            cannull: false
        }, opts);
        var outer = $('<div class="saler-selecter"></div>'),
                loadServicer = function () {
                    outer.empty();
                    com.ajaxGet("/service/servicer/groupServicers", {
                        group_id: opts['groupId']
                    }).done(function (ret) {
                        $.each(ret['data'], function (ii, dd) {
                            outer.append($([
                                '<div class="fieldset">',
                                '<fieldset class="layui-elem-field layui-field-title">',
                                '<legend>' + dd['name'] + '</legend>',
                                '</fieldset>',
                                '</div>'
                            ].join("")));
                            $.each(dd['items'], function (i, d) {
                                var clasz = ((opts['selected'] ? opts['selected'] : []).indexOf(d['userid']) === -1) ? '' : 'current';
                                var defaultAvatar = 'http://zzms-assets.dev/assets/local/images/default-avatar.png';
                                outer.append($([
                                    '<div class="saler-item ' + clasz + '" data-value="' + d['userid'] + '" data-name="' + d['realname'] + '" title="' + d['realname'] + '">',
                                    '<img class="avatar" src="' + (d['avatar'] ? d['avatar'] : defaultAvatar) + '"/>',
                                    '<div class="realname">' + d['realname'] + '</div>',
                                    '<i class="layui-icon checked">&#xe618;</i>',
                                    '</div>'
                                ].join("")));
                            });
                        });
                    });
                };
        $("body").append(outer);
        outer.loading();
        layer.open({
            type: 1,
            title: '请选择' + opts.title,
            closeBtn: 0,
            area: ['760px', '500px'], //宽高
            shade: [0.1, '#000000'],
            resize: false,
            content: outer,
            btn: ['确定', '关闭'],
            yes: function (index, layero) {
                if (opts.more && opts.call) {
                    var items = [];
                    $(".current", outer).each(function (i, d) {
                        items.push({
                            userid: $(this).data("value"),
                            name: $(this).data("name")
                        });
                    });
                    if (!opts['cannull'] && items.length === 0) {
                        layer.msg("请选" + opts.title + "~", {icon: 2, shift: 6, time: 1500});
                        return false;
                    }
                    opts.call(items);
                } else if (!opts.more && opts.call) {
                    var current = $(".current", outer);
                    if (!opts['cannull'] && current.length === 0) {
                        layer.msg("请选择" + opts.title + "~", {icon: 2, shift: 6, time: 1500});
                        return false;
                    }
                    opts.call({
                        userid: current.data("value"),
                        name: current.data("name")
                    });
                }
                outer.remove();
                layer.close(index);
                setTimeout(function () {
                    $("#layui-layer" + index).remove();
                }, 500);
            }, btn2: function (index, layero) {
                outer.remove();
                layer.close(index);
                setTimeout(function () {
                    $("#layui-layer" + index).remove();
                }, 500);
            }
        });
        loadServicer();
        outer.on("click", ".saler-item", function (e) {
            if (opts.more) {
                $(this).toggleClass("current");
            } else {
                $(".saler-item", outer).removeClass("current");
                $(this).addClass("current");
            }
        });
    };
    /**
     * 服务选择列表
     * @param {type} opts opts.more|是否多选 opts.call|点击确定后的回调函数
     * @returns {undefined}
     */
    com.serviceSelector = function (opts) {
        opts = $.extend({
            more: true,
            call: null,
            title: '服务项',
            id: null,
            cannull: false
        }, opts);
        var outer = $('<div class="service-dept-selecter"><div class="service-dept-items"></div></div>'),
                navs = "",
                bodys = "",
                createElem = function () {
                    $(".service-dept-items", outer).html(['<div class="tabs-container full-height">',
                        '<div class="tabs-left full-height">',
                        '<ul class="nav nav-tabs full-height" style="overflow-y: auto;overflow-x: hidden;width: calc(20% + 1px);">' + navs + '</ul>',
                        '<div class="tab-content full-height">' + bodys + '</div>',
                        '</div>',
                        '</div>'].join(""));
                },
                loadServiceDept = function () {
                    com.ajaxGet("/sale/sale/associatedServiceTypes", {
                        id: opts['id']
                    }).done(function (ret) {
                        $(".service-dept-items", outer).empty();
                        if (!ret['data'] || ret['data'].length <= 0) {
                            $(".service-dept-items", outer).html('<div>暂无服务部门</div>');
                        } else {
                            $.each(ret['data'], function (i, d) {
                                var hasChecked = 0;
                                bodys += '<div id="tab-' + d['id'] + '" class="tab-pane full-height ' + (!i ? "active" : "") + '"><div class="panel-body full-height">';
                                $.each(d['service_types'], function (ii, dd) {
                                    var clasz = dd['checked'] ? 'current' : '';
                                    if (dd['checked']) {
                                        hasChecked++;
                                    }
                                    bodys += '<div class="service-dept-item ' + clasz + '" data-value="' + dd['id'] + '">' + dd['name'] + '</div>';
                                });
                                bodys += '</div></div>';
                                navs += '<li class="' + (!i ? "active" : "") + '"><a style="' + (hasChecked ? "color:#1ab394;" : "") + '" data-toggle="tab" href="#tab-' + d['id'] + '" aria-expanded="true" data-value="' + d['id'] + '"> ' + d['name'] + ' </a></li>';
                            });
                            createElem();
                        }
                    });
                };
        $("body").append(outer);
        $(".service-dept-items", outer).loading();
        layer.open({
            type: 1,
            title: '请选择' + opts.title,
            closeBtn: 1,
            area: ['650px', '450px'], //宽高
            shade: [0.1, '#000000'],
            resize: false,
            content: outer,
            btn: ['确定', '关闭'],
            yes: function (index, layero) {
                if (opts.more && opts.call) {
                    var items = [];
                    $(".service-dept-items .nav-tabs li a", outer).each(function () {
                        var aSelf = $(this),
                                id = aSelf.attr("href");
                        var checked = $(".service-dept-items " + id + " .current", outer);
                        if (checked.length) {
                            items.push({
                                id: aSelf.data("value"),
                                name: aSelf.text(),
                                sub: function () {
                                    var subs = [];
                                    checked.each(function () {
                                        var cSelf = $(this);
                                        subs.push({
                                            id: cSelf.data("value"),
                                            name: cSelf.text()
                                        });
                                    });
                                    return subs;
                                }()
                            });
                        }
                    });
                    if (!opts['cannull'] && items.length === 0) {
                        layer.msg("请选" + opts.title + "~", {icon: 2, shift: 6, time: 1500});
                        return false;
                    }
                    opts.call(items);
                } else if (!opts.more && opts.call) {
                    var current = $(".service-dept-items .current", outer);
                    if (!opts['cannull'] && current.length === 0) {
                        layer.msg("请选择" + opts.title + "~", {icon: 2, shift: 6, time: 1500});
                        return false;
                    }
                    var id = current.closest(".tab-pane").attr("id"),
                            nav = $(".service-dept-items .nav-tabs li a[href='#" + id + "']", outer);
                    opts.call({
                        id: nav.data("value"),
                        name: nav.text(),
                        sub: {
                            id: current.data("value"),
                            name: current.text()
                        }
                    });
                }
                outer.remove();
                layer.close(index);
            }, btn2: function (index, layero) {
                outer.remove();
            }
        });
        loadServiceDept();
        outer.on("click", ".service-dept-item", function (e) {
            var self = $(this);
            var id = "#" + self.closest(".tab-pane").attr("id"),
                    nav = $(".service-dept-items .nav-tabs li a[href='" + id + "']", outer);
            if (opts.more) {
                self.toggleClass("current");
                var groupIsChecked = function () {
                    return $(".current", self.closest(".tab-pane")).length;
                }();
                if (groupIsChecked) {
                    nav.css("color", "#1ab394");
                } else {
                    nav.css("color", "");
                }
            } else {
                $(".service-dept-item", outer).removeClass("current");
                $(".service-dept-items .nav-tabs li a", outer).css("color", "");
                self.addClass("current");
                nav.css("color", "#1ab394");
            }
        });
    };

    /**
     * 
     * @param {type} opts
     * @returns {undefined}
     */
    com.refundHandlerSelector = function (opts) {
        opts = $.extend({
            more: false,
            call: null,
            selected: [],
            title: '退款处理人员',
            cannull: false
        }, opts);
        var outer = $('<div class="saler-selecter"></div>'),
                loadSaler = function (gId) {
                    outer.empty();
                    com.ajaxGet("/refund/refunder/refunders").done(function (ret) {
                        $.each(ret['data'], function (i, d) {
                            var clasz = ((opts['selected'] ? opts['selected'] : []).indexOf(d['userid']) === -1) ? '' : 'current';
                            var defaultAvatar = 'http://zzms-assets.dev/assets/local/images/default-avatar.png';
                            outer.append($([
                                '<div class="saler-item ' + clasz + '" data-value="' + d['userid'] + '" data-name="' + d['nickname'] + '" title="' + d['nickname'] + '">',
                                '<img class="avatar" src="' + (d['avatar'] ? d['avatar'] : defaultAvatar) + '"/>',
                                '<div class="realname">' + d['nickname'] + '</div>',
                                '<i class="layui-icon checked">&#xe618;</i>',
                                '</div>'
                            ].join("")));
                        });
                    });
                };
        $("body").append(outer);
        outer.loading();
        layer.open({
            type: 1,
            title: '请选择' + opts.title,
            closeBtn: 0,
            area: ['760px', '500px'], //宽高
            shade: [0.1, '#000000'],
            resize: false,
            content: outer,
            btn: ['确定', '关闭'],
            yes: function (index, layero) {
                if (opts.more && opts.call) {
                    var items = [];
                    $(".current", outer).each(function (i, d) {
                        items.push({
                            userid: $(this).data("value"),
                            name: $(this).data("name")
                        });
                    });
                    if (!opts['cannull'] && items.length === 0) {
                        layer.msg("请选" + opts.title + "~", {icon: 2, shift: 6, time: 1500});
                        return false;
                    }
                    opts.call(items);
                } else if (!opts.more && opts.call) {
                    var current = $(".current", outer);
                    if (!opts['cannull'] && current.length === 0) {
                        layer.msg("请选择" + opts.title + "~", {icon: 2, shift: 6, time: 1500});
                        return false;
                    }
                    opts.call({
                        userid: current.data("value"),
                        name: current.data("name")
                    });
                }
                outer.remove();
                layer.close(index);
                setTimeout(function () {
                    $("#layui-layer" + index).remove();
                }, 500);
            }, btn2: function (index, layero) {
                outer.remove();
                layer.close(index);
                setTimeout(function () {
                    $("#layui-layer" + index).remove();
                }, 500);
            }
        });
        loadSaler();
        outer.on("click", ".saler-item", function (e) {
            if (opts.more) {
                $(this).toggleClass("current");
            } else {
                $(".saler-item", outer).removeClass("current");
                $(this).addClass("current");
            }
        });
    };

    /**
     * 
     * @param {type} type
     * @param {type} table
     * @param {type} data
     * @param {type} call
     * @returns {undefined}
     */
    com.matchSelector = function (type, data, call) {
        if (data.length === 1) {
            call(data[0]);
            return false;
        }
        if (!type) {
            type = 0;
        }
        var table = layui.table,
                layTaleCols = [
                    [
                        {"field": "crm_customer-wangwang", "title": "旺旺", "width": 120},
                        {"field": "crm_customer-qq", "title": "QQ", "width": 120},
                        {"field": "crm_customerweixin", "title": "微信", "width": 120},
                        {"field": "crm_customer-mobile", "title": "手机", "width": 120},
                        {"field": "crm_customer-name", "title": "姓名", "width": 70},
                        {"title": "#", "fixed": "right", "align": "center", "width": 60, "toolbar": "#match_selector_tools_bar"}
                    ],
                    [
                        {"field": "crm_customer-wangwang", "title": "旺旺", "width": 120},
                        {"field": "crm_customer-qq", "title": "QQ", "width": 120},
                        {"field": "crm_customerweixin", "title": "微信", "width": 120},
                        {"field": "crm_customer-mobile", "title": "手机", "width": 120},
                        {"field": "crm_customer-name", "title": "姓名", "width": 70},
                        {"field": "crm_sale-payment", "title": "付款金额", "width": 100},
                        {"field": "crm_sale-service_type", "title": "业务类型", "width": 100},
                        {"field": "crm_sale-create_time", "title": "创建时间", "width": 150},
                        {"title": "#", "fixed": "right", "align": "center", "width": 60, "toolbar": "#match_selector_tools_bar"}
                    ]
                ],
                layTaleColsToolbar = '<script type="text/html" id="match_selector_tools_bar"><i class="layui-btn layui-btn-danger layui-btn-xs fa fa-check" lay-event="selector_selected" title="确定"></i></script>',
                match_selector_outer = $('<div class="match-selector">' + layTaleColsToolbar + '<table class="layui-table" id="match_selector_table" style="display: none;" lay-filter="match_selector_table"></table></div>');
        $("body").append(match_selector_outer);
        $("#match_selector_table", match_selector_outer).renderTable(table, {
            id: 'match_selector_table',
            height: 360,
            data: data,
            cols: [
                layTaleCols[type]
            ]
        });
        var match_selector_index = layer.open({
            type: 1,
            title: '请选择匹配项',
            closeBtn: 0,
            area: type ? ['1000px', '500px'] : ['650px', '500px'], //宽高
            shade: [0.1, '#000000'],
            resize: false,
            content: match_selector_outer,
            btn: ['确定'],
            yes: function (index, layero) {
                layer.close(index);
                match_selector_outer.remove();
                setTimeout(function () {
                    $("#layui-layer" + index).remove();
                }, 500);
            }
        });
        call && table.on("tool(match_selector_table)", function (obj) {
            var data = obj['data'],
                    event = obj['event'];
            if (event === 'selector_selected') {
                call(data);
            }
            layer.close(match_selector_index);
            match_selector_outer.remove();
            setTimeout(function () {
                $("#layui-layer" + match_selector_index).remove();
            }, 500);
        });
    };
    /**
     * 
     * @param {type} data
     * @param {type} call
     * @returns {undefined}
     */
    com.matchRefundSelector = function (data, call) {
        call = call ? call : function () {};
        com.matchSelector(1, data, function (d) {
            call(d);
        });
    };
    /**
     * 
     * @param {type} data
     * @param {type} call
     * @returns {undefined}
     */
    com.matchSaleSelector = function (data, call) {
        call = call ? call : function () {};
        com.matchSelector(0, data, function (d) {
            call(d);
        });
    };
    /**
     * laytable tools扩展
     * @param {type} elem
     * @param {type} call
     * @returns {undefined}
     */
    com.extendBtns = function (elem, call) {
        elem = $(elem);
        if (!$(".dropdown-menu li", elem).length) {
            return false;
        }
        var offset = elem.offset(),
                extendBtnGroup = $('<div class="extend-btns-fixed">' + $(".dropdown-menu", elem).prop("outerHTML") + '</div>');
        $(".dropdown-menu", extendBtnGroup).show();
        extendBtnGroup.appendTo($("body"));
        var left = function () {
            if (offset['left'] < extendBtnGroup.width()) {
                return offset['left'];
            }
            return offset['left'] - extendBtnGroup.width() + elem.outerWidth();
        }();
        if (extendBtnGroup.height() + offset['top'] + elem.outerHeight() > $("body").height()) {
            extendBtnGroup.css({
                top: offset['top'] - extendBtnGroup.height(),
                left: left
            }).show();
            extendBtnGroup.css({
                "paddingBottom": elem.outerHeight() + "px",
                "boxShadow": "3px -2px 4px -3px rgba(0, 0, 0, 0.3)"
            });
        } else {
            extendBtnGroup.css({
                top: offset['top'] + 1,
                left: left
            }).show();
            extendBtnGroup.css("padding-top", elem.css("height"));
        }
        var hideGroup = function () {
            extendBtnGroup.fadeOut(100, function () {
                $(this).remove();
            });
        };
        extendBtnGroup.mouseleave(function () {
            hideGroup();
        });
        $('li', extendBtnGroup).unbind("click").bind("click", function () {
            var event = $(this).attr("lay-event");
            call && event && call.call(this, event);
            hideGroup();
        });
    };
    /**
     * 
     * @param {type} saleId
     * @returns {undefined}
     */
    com.archivesPanel = function (options) {
        var opt = $.extend({
            updateDemand: false,
            updateContract: false
        }, options);
        if (!opt['saleId']) {
            return false;
        }
        if ($("#show-archives-panel").length) {
            UM.getEditor("demand-desc-body").destroy();
            $("#show-archives-panel").remove();
            $("#show-archives-style").remove();
        }
        var body = $("body"),
                um = null,
                uploadObj = null,
                sideOuter = $([
                    '<div class="side" id="show-archives-panel">',
                    '<div class="side-dialog"></div>',
                    '<div class="side-content col-sm-4"><div class="side-header"><h4 class="side-title"> 客户档案 </h4></div>',
                    '<form class="form-horizontal layui-form form-archives">',
                    '<div class="side-body"></div>',
                    '<div class="side-footer"><button type="button" class="btn btn-default" data-dismiss="modal"> 关闭 </button></div>',
                    '</form>',
                    '</div>',
                    '</div>'
                ].join("")),
                style = $([
                    '<style type="text/css" id="show-archives-style">',
                    '.cus-res-context,.archives-context,.contract-context{background: #f5f5f5;border-radius: 0.25em;padding: 1em;}',
                    '.cus-res-context label{margin:0;padding: 0px 11px !important;}',
                    '.cus-res-context .layui-input-block{min-height: auto;}',
                    '.archives-context legend {width: auto;border-bottom: none;margin-bottom:0;}',
                    '.pdf-preview {width: 100%;height: 300px;border: none;}',
                    '#demand-desc-body {overflow: auto;height:300px;}',
                    '.demand-desc-body {overflow-x: auto;}',
                    '.demand-desc-body img{max-width: 150px;}',
                    '.attachment-list {font-size: 15px;line-height: 20px;margin-top: 10px;}',
                    '.archives-context .attachment-list .download {padding: 0 5px;color: #1ab394;}',
                    '.archives-context .attachment-list .remove {padding: 0 5px;color: #1ab394;}',
                    '.add-attachment .attachment-selector {width: 100%;opacity: 0;position: absolute;top: 0;left: 0;}',
                    '.archives-context .save-demand,.archives-context #demand-desc-body,.archives-context .remove,.archives-context .edui-container,.archives-context .add-attachment{display:none;}',
                    '.archives-context.edit .save-demand,.archives-context.edit #demand-desc-body,.archives-context.edit .remove,.archives-context.edit .edui-container,.archives-context.edit .add-attachment{display:block;}',
                    '.archives-context.edit .update-demand,.archives-context.edit .demand-desc-body,.archives-context.edit .download{display:none;}',
                    '.archives-context .attachment-list .progress {height:2px;clear: both;}',
                    '.contract-panel img{max-width:100%;}',
                    '.update-contract {float:right;position: relative;}',
                    '.update-contract input {position: absolute;left: 0;top: 0;width: 100%;opacity: 0;}',
                    '.attachment-list .file-name,.attachment-list .progress-txt,.attachment-list .remove {float:left;}',
                    '</style>'
                ].join("")),
                tabsOuter = [
                    '<div class="tabs-container">',
                    '<ul class="nav nav-tabs">',
                    '<li class="active"><a data-toggle="tab" href="#archives_tab_1" aria-expanded="true"> 客户资料 </a></li>',
                    '<li><a data-toggle="tab" href="#archives_tab_2" aria-expanded="false"> 客户需求 </a></li>',
                    '<li class=""><a data-toggle="tab" href="#archives_tab_3" aria-expanded="false"> 合同 </a></li>',
                    '</ul>',
                    '<div class="tab-content">',
                    '<div id="archives_tab_1" class="tab-pane active"><div class="panel-body"><div class="cus-res-context"></div></div></div>',
                    '<div id="archives_tab_2" class="tab-pane">',
                    '<div class="panel-body "><div class="archives-context">',
                    function () {
                        if (opt['updateDemand']) {
                            return [
                                '<button type="button" class="layui-btn layui-btn-sm layui-btn-warm update-demand" style="float:right;"> 修改客户需求 </button>',
                                '<button type="button" class="layui-btn layui-btn-sm layui-btn-warm save-demand" style="float:right;"> 保存修改 </button>',
                                '<div style="clear:both;"></div>',
                                '<hr class="layui-bg">'
                            ].join("");
                        }
                    }(),
                    '<div id="demand-desc-body"></div>',
                    '<div class="demand-desc-body"></div>',
                    '<fieldset class="layui-elem-field layui-field-title" style="margin-top: 20px;margin-bottom: 10px;"><legend> 附件 </legend></fieldset>',
                    '<button type="button" class="layui-btn layui-btn-sm layui-btn-warm add-attachment" id="add-attachment-btn" style="position: relative;float:right;"> 添加附件 </button>',
                    '<div style="clear:both;"></div>',
                    '<div class="attachment-list"></div>',
                    '</div>',
                    '</div>',
                    '</div>',
                    '<div id="archives_tab_3" class="tab-pane">',
                    '<div class="panel-body ">',
                    '<div class="contract-context">',
                    function () {
                        if (opt['updateContract']) {
                            return [
                                '<button type="button" class="layui-btn layui-btn-sm layui-btn-warm update-contract"> 修改合同 <input type="file" accept=".zip,.rar,.7z,.png,.jpg,.jpeg,.pdf"/></button>',
                                '<div style="clear:both;"></div>',
                                '<hr class="layui-bg">'
                            ].join("");
                        }
                    }(),
                    '<div class="contract-panel"></div>',
                    '</div>',
                    '</div>',
                    '</div>',
                    '</div>',
                    '</div>'
                ].join(""),
                createContractHtml = function (contract) {
                    if (!com.util.isEmptyOrWhiteSpace(contract)) {
                        var ext = com.util.fileExtName({name: contract});
                        if (ext === "pdf") {
                            $(".contract-panel", sideOuter).html([
                                '<embed class="pdf-preview" width="40%" height="500px" src="' + contract + '" type="application/pdf">',
                                '<a href="' + contract + '" class="layui-btn layui-btn-sm layui-btn-warm contract-preview" target="_blank"> <i class="fa fa-arrows-alt"></i> 全屏预览 </a>'
                            ].join(""));
                        } else if (["png", "jpg", "jpeg"].indexOf(ext) > -1) {
                            $(".contract-panel", sideOuter).html([
                                '<a href="' + contract + '" data-gallery><img src="' + contract + '"/></a>'
                            ].join(""));
                        } else if (["rar", 'zip', '7z'].indexOf(ext) > -1) {
                            var url = function () {
                                var start = contract.substring(0, contract.lastIndexOf("/") + 1);
                                var end = encodeURIComponent(contract.substring(contract.lastIndexOf("/") + 1, contract.length));
                                return start + end;
                            }(), name = contract.substring(contract.lastIndexOf("/") + 1, contract.length);
                            $(".contract-panel", sideOuter).html([
                                '<a href="' + url + '" data-gallery>' + name + '</a>'
                            ].join(""));
                        }
                    }
                },
                loadData = function () {
                    var data = {
                        sale_id: opt['saleId']
                    };
                    if (opt['incr_service_id']) {
                        data['incr_service_id'] = opt['incr_service_id'];
                    }
                    if (opt['incr_sale']) {
                        data['incr_sale'] = opt['incr_sale'];
                    }
                    if (opt['incr_sale_copy']) {
                        data['incr_sale_copy'] = opt['incr_sale_copy'];
                    }
                    com.ajaxGet("/sale/sale/viewDemandContract", data).done(function (ret) {
                        if (ret['code'] === 0) {
                            var data = ret['data'];
                            $(".demand-desc-body", sideOuter).html(data['demand_desc']);
                            $(".demand-desc-body img", sideOuter).each(function () {
                                var self = $(this);
                                self.wrap($('<a href=' + self.attr("src") + ' data-gallery="" > </a>'));
                            });
                            $(".cus-res-context", sideOuter).html($.map(data['customer'], function (d, i) {
                                return '<div class="layui-form-item"><label class="layui-form-block">' + i + '：</label><label class="layui-input-label">' + d + '</label></div>';
                            }).join(""));
                            $(".attachment-list", sideOuter).html($.map(data['attachment'], function (d, i) {
                                var url = d['url'];
                                url = function () {
                                    var start = url.substring(0, url.lastIndexOf("/") + 1);
                                    var end = encodeURIComponent(url.substring(url.lastIndexOf("/") + 1, url.length));
                                    return start + end;
                                }();
                                var title = d['title'];
                                title = function () {
                                    var ext = com.util.fileExtName({name: title});
                                    if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].indexOf(ext) > -1) {
                                        var viewUrl = "http://office.scaqjg.com/op/view.aspx?src=" + url;
                                        return '<a href="' + viewUrl + '" target="_blank">' + title + '</a>';
                                    }
                                    return title;
                                }();
                                return '<div class="attachment-item"><div class="file-name">' + title + '</div><a class="fa fa-cloud-download download" href="' + url + '" title="' + d['title'] + '" download="" target="_blank"></a><a class="fa fa-trash-o remove"></i></a><div style="clear:both;"></div></div>';
                            }).join(""));
                            createContractHtml(data['contract']);
                        }
                    });
                },
                createOssSign = function (done) {
                    $.ajax({
                        url: "/third/oss/sign",
                        type: 'POST'
                    }).done(function (ret) {
                        var ossSign = ret['data'];
                        done && done(ossSign);
                    });
                },
                submitDemand = function () {
                    var content = um.getContent();
                    var json = {
                        sale_id: opt['saleId'],
                        demand_desc: content,
                        attachment: function () {
                            var att = [];
                            $(".attachment-list .attachment-item", sideOuter).each(function () {
                                att.push({
                                    title: $(this).text(),
                                    url: $(".download", $(this)).attr("href")
                                });
                            });
                            return att;
                        }()
                    };
                    com.ajaxPost("/sale/sale/saveDemand", JSON.stringify(json), {
                        contentType: 'application/json'
                    }).done(function (ret) {
                        layer.msg(ret['msg']);
                        if (ret['code'] === 0) {
                            $(".demand-desc-body").html(content);
                        }
                        $(".demand-desc-body img", sideOuter).each(function () {
                            var self = $(this);
                            self.wrap($('<a href=' + self.attr("src") + ' data-gallery="" > </a>'));
                        });
                        $(".archives-context", sideOuter).removeClass("edit");
                        layer.close(uploadObj.layerIndex);
                    });
                },
                submitContract = function (contract, done) {
                    com.ajaxPost("/sale/sale/saveContract", {
                        sale_id: opt['saleId'],
                        contract: contract
                    }).done(function (ret) {
                        done();
                        layer.msg(ret['msg']);
                        if (ret['code'] === 0) {
                            createContractHtml(contract);
                        }
                    });
                },
                initUpload = function () {
                    uploadObj = new plupload.Uploader({
                        browse_button: 'add-attachment-btn',
                        filters: {
                            mime_types: [//只允许上传图片文件
                                {
                                    title: "Zip files",
                                    extensions: "rar,zip,7z,ppt,pptx,doc,docx,xls,xlsx,pdf,txt"
                                }
                            ],
                            max_file_size: '50mb', //最大只能上传50mb的文件
                            prevent_duplicates: true //不允许选取重复文件
                        },
                        init: {
                            PostInit: function () {

                            }, FilesAdded: function (up, files) {
                                $.each(files, function (i, f) {
                                    $(".attachment-list", sideOuter).append($([
                                        '<div class="attachment-item" id="' + f['id'] + '">',
                                        '<div class="file-name">' + f['name'] + '</div>',
                                        '<span class="progress-txt">（0%）</span>',
                                        '<a class="fa fa-trash-o remove" title="删除"></a>',
                                        '<div class="progress progress-striped active">',
                                        '<div style="width: 0%" class="progress-bar progress-bar-warning"></div>',
                                        '</div>',
                                        '<div style="clear:both;"></div>',
                                        '</div>'
                                    ].join("")));
                                });
                            }, BeforeUpload: function (up, file) {
                                var ossSign = up.ossSign;
                                up.setOption({
                                    url: ossSign['host'],
                                    multipart_params: {
                                        key: function () {
                                            var object_name = ossSign.dir + com.util.createRandomFileName(file);
                                            file.object_name = object_name;
                                            return object_name;
                                        }(),
                                        policy: ossSign['policy'],
                                        OSSAccessKeyId: ossSign['accessid'],
                                        success_action_status: '200', //让服务端返回200,不然，默认会返回204
                                        callbackUrl: ossSign['callback'],
                                        signature: ossSign['signature']
                                    }
                                });
                            }, UploadProgress: function (up, file) {
                                var elem = $(".attachment-list #" + file['id'], sideOuter);
                                $(".progress-txt", elem).text("（" + file['percent'] + "%）");
                                $(".progress-bar", elem).css("width", file['percent'] + "%");
                            }, Error: function (up, err) {
                                var msg = err.response;
                                if (err.code === -600) {
                                    msg = "选择的文件太大了";
                                } else if (err.code === -601) {
                                    msg = "选择的文件后缀不对";
                                } else if (err.code === -602) {
                                    msg = "这个文件已经上传过一遍了";
                                }
                                layer.close(up.layerIndex);
                                layer.msg(msg, {shift: 6, icon: 3});
                            }
                        }
                    });
                    uploadObj.init();
                },
                bindEvent = function () {
                    sideOuter.on("click", ".update-demand", function () {
                        $("#demand-desc-body", sideOuter).css("width", (parseInt($(".demand-desc-body", sideOuter).css("width")) - 5) + "px");
                        $(".demand-desc-body a[data-gallery]", sideOuter).each(function () {
                            $("img", $(this)).insertBefore($(this));
                            $(this).remove();
                        });
                        if (!um) {
                            um = UM.getEditor("demand-desc-body");
                        }
                        um.setContent($(".demand-desc-body").html());
                        $(".archives-context", sideOuter).addClass("edit");
                    });
                    sideOuter.on("click", ".save-demand", function () {
                        if (uploadObj.getFiles().length) {
                            createOssSign(function (ossSign) {
                                uploadObj.ossSign = ossSign;
                                uploadObj.bind("FileUploaded", function (up, file) {
                                    var elem = $(".attachment-list #" + file['id'], sideOuter);
                                    var url = file['object_name'];
                                    url = function () {
                                        var start = url.substring(0, url.lastIndexOf("/") + 1);
                                        var end = encodeURIComponent(url.substring(url.lastIndexOf("/") + 1, url.length));
                                        return start + end;
                                    }();
                                    $(".remove", elem).before('<a class="fa fa-cloud-download download" href="' + (ossSign['cname_host'] + '/' + url) + '" title="' + file['name'] + '" download="" target="_blank"></a>');
                                    $(".progress-txt", elem).remove();
                                    $(".progress", elem).remove();
                                    var ext = com.util.fileExtName(file);
                                    if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].indexOf(ext) > -1) {
                                        var viewUrl = "http://office.scaqjg.com/op/view.aspx?src=" + (ossSign['cname_host'] + '/' + file['object_name']);
                                        var html = '<a href="' + viewUrl + '" target="_blank">' + file['name'] + '</a>';
                                        $(".file-name", elem).html(html);
                                    }
                                    elem.removeAttr("id");
                                    up.removeFile(file);
                                    if (!up.getFiles().length) {
                                        submitDemand();
                                    }
                                });
                                uploadObj.layerIndex = layer.load(2);
                                uploadObj.start();
                            });
                        } else {
                            submitDemand();
                        }
                    });
                    sideOuter.on("click", ".attachment-list .remove", function () {
                        var id = $(this).closest(".attachment-item").attr("id");
                        id && uploadObj.removeFile(uploadObj.getFile(id));
                        $(this).closest(".attachment-item").remove();
                    });
                    sideOuter.on("change", ".update-contract input", function (e) {
                        var files = e['currentTarget'].files;
                        if (files.length > 0) {
                            var file = files[0];
                            if (['zip', 'rar', '7z', 'png', 'gif', 'jpg', 'jpeg', 'pdf'].indexOf(com.util.fileExtName(file)) !== -1) {
                                com.confirm("确定修改合同吗？", 3, function (r) {
                                    if (!r) {
                                        return false;
                                    }
                                    var index = layer.load(2);
                                    createOssSign(function (ossSign) {
                                        var object_name = ossSign.dir + com.util.createRandomFileName(file);
                                        var data = new FormData();
                                        // 添加签名信息
                                        data.append('OSSAccessKeyId', ossSign['accessid']);
                                        data.append('policy', ossSign['policy']);
                                        data.append('Signature', ossSign['signature']);
                                        data.append('key', object_name);
                                        // 添加文件
                                        data.append('file', file, file.name);
                                        $.ajax({
                                            url: ossSign['host'],
                                            data: data,
                                            processData: false,
                                            contentType: false,
                                            type: 'POST'
                                        }).done(function (ret) {
                                            submitContract(ossSign['cname_host'] + "/" + object_name, function () {
                                                layer.close(index);
                                            });
                                        }).fail(function () {
                                            layer.msg("图片上传失败~", {shift: 6, icon: 2});
                                            layer.close(index);
                                        });
                                    });
                                });
                            } else {
                                layer.msg("请选择后缀名为'.png','.gif','.jpg','.jpeg'</br>或'.pdf'的文件~", {shift: 6, icon: 2});
                                return false;
                            }
                        }
                    });
                };
        sideOuter.appendTo(body);
        style.appendTo(body);
        $(".side-body", sideOuter).loading();
        sideOuter.showSide();
        $(".side-body", sideOuter).html(tabsOuter);
        loadData();
        bindEvent();
        initUpload();
    };
    com.uploadScreenshotsPanel = function (opts) {
        opts = $.extend({
            elem: null,
            title: '上传截图',
            textarea_readonly: true,
            style: 'style1',
            single: false
        }, opts);
        if (com.util.isEmptyOrWhiteSpace(opts.elem)) {
            return false;
        }
        var elem = $(opts.elem),
                uploadPanelHtml = $([
                    '<div style="' + (opts['style'] === 'style1' ? 'padding: 10px;' : '') + ' position: relative;">',
                    '    <textarea class="layui-layer-input" placeholder="点击此处 Ctrl+V 可粘贴图片"></textarea>',
                    '    <button type="button" class="glyphicon glyphicon-picture chose-image-file" title="点击上传图片"></button>',
                    '    <input type="file" class="image-file" accept=".jpeg,.jpg,.png,.bmp,.gif"/>',
                    '    <ul class="imgs-box"></ul>',
                    '</div>'
                ].join("")),
                style1 = function () {
                    return [
                        '{elem} textarea{width: 560px;height: 50px;padding: 5px;}',
                        '{elem} .imgs-box{height: 460px;width: 100%;overflow-x: hidden;overflow-y: auto;}',
                        '{elem} .imgs-box:empty{display: none;}',
                        '{elem} .imgs-box li{position: relative;width: 50%;padding: 1%;float: left;}',
                        '{elem} .imgs-box li .img-remove{position: absolute;top: 10px;left: 10px;font-size: 20px;color: #ed5565;display: none;}',
                        '{elem} .imgs-box li:hover .img-remove{display: block;}',
                        '{elem} .imgs-box li img{width: 100%;border: solid 1px #a9a9a9;}',
                        '{elem} button{position: absolute;top: 10px;right: 10px;height: 50px;width: 50px;background: #fff;border: solid 1px #a9a9a9;}',
                        '{elem} input[type="file"]{display: none;}'
                    ].join("").replace(/{elem}/g, opts.elem);
                }(),
                style2 = function () {
                    return [
                        '{elem} textarea{width: 340px;height: 50px;padding: 5px;}',
                        '{elem} .imgs-box{height: 145px;width: 100%;overflow-x: hidden;overflow-y: auto;}',
                        '{elem} .imgs-box:empty{display: none;}',
                        '{elem} .imgs-box li{position: relative;width: 50%;padding: 1%;float: left;}',
                        '{elem} .imgs-box li .img-remove{position: absolute;top: 10px;left: 10px;font-size: 20px;color: #ed5565;display: none;}',
                        '{elem} .imgs-box li:hover .img-remove{display: block;}',
                        '{elem} .imgs-box li img{width: 100%;border: solid 1px #a9a9a9;}',
                        '{elem} button{position: absolute;right: 0;height: 50px;width: 50px;background: #fff;border: solid 1px #a9a9a9;}',
                        '{elem} input[type="file"]{display: none;}'
                    ].join("").replace(/{elem}/g, opts.elem);
                }(),
                bindEvents = function () {
                    $("textarea", elem)[0].addEventListener('paste', function (event) {
                        if (event.clipboardData || event.originalEvent) {
                            //not for ie11  某些chrome版本使用的是event.originalEvent
                            var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
                            var items = clipboardData.items;
                            if (items.length && items[0].type.indexOf('image') > -1) {
                                var file = items[0].getAsFile();//读取e.clipboardData中的数据：Blob对象
                                uploadImage(file, $(this));
                            }
                        }
                    });
                    elem.on("click", ".img-remove", function (e) {
                        $(this).closest("li").remove();
                        if (!$(opts.elem + " .imgs-box li").length) {
                            $(opts.elem + " .imgs-box").empty();
                        }
                    });
                    $(".chose-image-file", elem).click(function () {
                        $(".image-file", elem).click();
                    });
                    $(".image-file", elem).change(function () {
                        var files = $(this)[0].files;
                        if (files.length) {
                            uploadImage(files[0], $(this));
                            $(this).val("");
                        }
                    });
                },
                uploadImage = function (file, sender) {
                    $.ajax({
                        url: "/third/oss/sign",
                        type: 'POST'
                    }).done(function (ret) {
                        var sign = ret['data'];
                        var object_name = sign.dir + com.util.randomString(16) + "." + com.util.fileExtName(file);
                        var data = new FormData();
                        // 添加签名信息
                        data.append('OSSAccessKeyId', sign['accessid']);
                        data.append('policy', sign['policy']);
                        data.append('Signature', sign['signature']);
                        data.append('key', object_name);
                        // 添加文件
                        data.append('file', file, file.name);
                        $.ajax({
                            url: sign['host'],
                            data: data,
                            processData: false,
                            contentType: false,
                            type: 'POST'
                        }).done(function (ret) {
                            var picLink = sign['cname_host'] + "/" + object_name;
                            var imgHtml = $([
                                '<li>',
                                '<img src="' + picLink + '"/>',
                                '<a class="img-remove glyphicon glyphicon-trash"></a>',
                                '</li>'
                            ].join(""));
                            if (opts.single) {
                                $(".imgs-box", elem).html(imgHtml);
                            } else {
                                $(".imgs-box", elem).append(imgHtml);
                            }
                        }).fail(function () {
                            layer.msg("图片上传失败~");
                        });
                    });
                },
                styles = {
                    "style1": style1,
                    "style2": style2
                };
        opts.textarea_readonly && $("textarea", uploadPanelHtml).attr("readonly", "readonly");
        elem.append(uploadPanelHtml);
        bindEvents();
        $("head").append('<style type="text/css">' + styles[opts.style] + '</style>');
    };
    /**
     * 搜索自动补全
     * @param {type} callBack
     * @returns {undefined}
     */
    $.fn.autoComplete = function (callBack) {
        var style = [
            '<style>',
            '.autoComplete{position: absolute;z-index: 9999999999;width: 100%;background: #fff;padding: 10px 0;border: solid 1px #e6e6e6;display: none;}',
            '.autoComplete li{cursor: pointer;line-height: 36px;padding: 0 10px;}',
            '.autoComplete li:hover{background-color: #f2f2f2;}',
            '.autoComplete li.current,.autoComplete li.current:hover{background-color: #5FB878;color:#fff;}',
            '</style>'
        ].join(""),
                q = "";
        $("body").append(style);
        var autoCompleteSelect = function (elem, keyCode) {
            if (!elem.is(":hidden")) {
                var next = null;
                if (keyCode === 38) {
                    next = $(".current", elem).length ? ($(".current", elem).prev().length ? $(".current", elem).prev() : $("li:last", elem)) : $("li:last", elem);
                } else if (keyCode === 40) {
                    next = $(".current", elem).length ? ($(".current", elem).next().length ? $(".current", elem).next() : $("li:first", elem)) : $("li:first", elem);
                } else if (keyCode === 13) {
                    var current = $(".current", elem);
                    if (!current.length) {
                        return false;
                    }
                    var info = current.data("info");
                    callBack && callBack(info);
                    elem.fadeOut();
                    q = '';
                    return false;
                }
                $(".current", elem).removeClass("current");
                next.addClass("current");
                var info = next.data("info");
                elem.prev("input").val(info['com_employee-nickname']);
                q = info['com_employee-nickname'];
                return false;
            }
        }, showContent = function (elem) {
            var input = elem.prev("input"),
                    offset = input.offset(),
                    iHeight = input.outerHeight(),
                    height = elem.outerHeight(),
                    wHeight = $(window).height();
            if (wHeight - offset.top < height) {
                elem.css("top", (height * -1 + 1) + "px");
            } else {
                elem.css("top", (iHeight - 1) + "px");
            }
            elem.fadeIn(100);
        }, hideContent = function (elem) {
            if (elem.is(":hidden")) {
                return false;
            }
            elem.fadeOut(100, function () {
                elem.empty();
                elem.removeAttr("style");
            });
            q = '';
        }, loadData = function (e, content, val) {
            val = val.trim();
            var keyCode = e.keyCode;
            if (([13, 38, 40].indexOf(keyCode) !== -1)) {
                autoCompleteSelect(content, keyCode);
                return false;
            }
            if (!val) {
                hideContent(content);
                return false;
            }
            if (val === q) {
                return false;
            }
            q = val;
            com.ajaxGet("/structure/Public/Employees", {limit: 5, q: val}).done(function (ret) {
                if (ret.code === 0 && ret.data.length) {
                    content.empty();
                    $.each(ret.data, function (i, d) {
                        var li = $('<li>' + d['com_employee-nickname'] + (d['com_employee-dept_id'] ? ('-' + d['com_employee-dept_id']) : '') + '</li>');
                        li.data("info", d);
                        content.append(li);
                    });
                    showContent(content);
                } else {
                    hideContent(content);
                }
            });
        };
        this.each(function () {
            var self = $(this),
                    outer = $('<div class="autoCompleteBox" stype="position: relative;"></div>'),
                    content = $('<ul class="autoComplete"></ul>');
            self.addClass("autoCompleteInput");
            self.wrap(outer);
            self.after(content);
            self.keyup(function (e) {
                loadData(e, content, $(this).val());
            }).focus(function (e) {
                if (!content.is(":empty")) {
                    showContent(content);
                }
                loadData(e, content, $(this).val());
            });
            $("body").click(function (e) {
                if (!(($(e.target).hasClass("autoCompleteInput") ? 1 : 0) + ($(e.target).closest(".autoComplete").length))) {
                    hideContent(content);
                }
            });
            $("body").on("click", ".autoComplete li", function () {
                var parent = $(this).closest(".autoComplete");
                $(".current", parent).removeClass("current");
                $(this).addClass("current");
                var info = $(this).data("info");
                parent.prev("input").val(info['com_employee-nickname']);
                q = info['com_employee-nickname'];
                callBack && callBack(info);
                hideContent(content);
            });
        });
    };
})();