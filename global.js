// ==================== 通用方法 ====================

function showLoading(text) {
    let t = text || '加载中……';
    let index = layer.msg(t, {icon: 16, shade: 0.01, time: 1000 * 60});
    return index;
}

function hideLoading(loadingIndex) {
    layer.close(loadingIndex);
}

function doGet(url, data, callback) {
    let loadingIndex = layer.msg('加载中', {icon: 16, shade: 0.01, time: 1000 * 3});
    $.ajax({
        type: 'GET',
        url: url,
        data: data,
        success: function (ret) {
            if (typeof callback === 'function') {
                callback(ret);
            }
        },
        error: function () {
            layer.alert('执行错误', {icon: 5});
        },
        complete: function (XHR, TS) {
            layer.close(loadingIndex);
        }
    });
}

function doPost(url, data, callback) {
    let loadingIndex = layer.msg('加载中', {icon: 16, shade: 0.01, time: 1000 * 3});
    $.ajax({
        type: "POST",
        url: url,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        data: data,
        traditional: true,//避免参数名称自动添加[]，如ids会变成ids[]
        dataType: "json",
        success: function (ret) {
            if (typeof callback === 'function') {
                callback(ret);
            }
        },
        error: function () {
            layer.alert('执行错误', {icon: 5});
        },
        complete: function (XHR, TS) {
            layer.close(loadingIndex);
        }
    });
}

function doDelete(url, data, callback) {
    layer.confirm('确定要删除?', function (i) {
        layer.close(i);

        let loadingIndex = layer.msg('加载中', {icon: 16, shade: 0.01, time: 1000 * 3});
        $.ajax({
            url: url,
            type: 'GET',
            data: data,
            success: function (ret) {
                if (ret.code == 200) {
                    layer.msg('删除成功!', {icon: 6, time: 500}, function (index) {
                        layer.close(index);
                        if (typeof callback === 'function') {
                            callback(ret);
                        }
                    });
                } else {
                    layer.alert('删除失败：' + ret.msg, {icon: 5});
                }
            },
            error: function () {
                layer.alert('执行错误', {icon: 5});
            },
            complete: function (XHR, TS) {
                layer.close(loadingIndex);
            }
        });
    });
}

function http(jqueryAjaxOption) {
    let index = showLoading();
    $.ajax({
        url: jqueryAjaxOption.url,
        type: jqueryAjaxOption.type || 'get',
        data: jqueryAjaxOption.params,
        dataType: jqueryAjaxOption.dataType || 'json',
        contentType: jqueryAjaxOption.contentType || "application/x-www-form-urlencoded; charset=utf-8",
        cache: false,
        traditional: jqueryAjaxOption.traditional || false,
        timeout: jqueryAjaxOption.timeout,
        success: function (result) {
            hideLoading(index);
            if (jqueryAjaxOption.toast) {
                layer.msg(jqueryAjaxOption.toast);
            }
            if (jqueryAjaxOption.callback) {
                jqueryAjaxOption.callback(null, result);
            }
        },
        error: function (error) {
            hideLoading(index);
            if (jqueryAjaxOption.callback) {
                jqueryAjaxOption.callback(error);
            }
        }
    });
}

/**
 * JS获取URL中参数值
 * https://www.cnblogs.com/jcz1206/p/4543593.html
 * 但是在使用的过程中，发现其在获取中文参数的时候，获取到的值是乱码的
 * 解决办法:将解码方式unescape换为decodeURI
 * 原因:浏览器会将url中的中文参数进行encodeURI编码，所以要通过js使用decodeURI进行解码
 * https://blog.csdn.net/yuxuemu/article/details/80054767
 */
function getQueryString(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
}

/**
 * 日期格式化
 * https://www.cnblogs.com/Angel-szl/p/11301472.html
 * @param date 日期
 * @param fmt 日期格式，例如：yyyy-MM-dd hh:mm:ss.S
 * @returns {*}
 */
function format(date, fmt) {
    let o = {
        "M+": date.getMonth() + 1,                      //月份
        "d+": date.getDate(),                           //日
        "h+": date.getHours(),                          //小时
        "m+": date.getMinutes(),                        //分
        "s+": date.getSeconds(),                        //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()                     //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

/**
 * 日期格式化
 * @param fmt
 * @returns {*}
 */
Date.prototype.format = function (fmt) {
    return format(this, fmt);
};

/**
 * js对象替换字符串占位符
 * https://blog.csdn.net/jiang_2992/article/details/75045199
 * @returns {String}
 */
String.prototype.format = function () {
    if (arguments.length == 0) return this;
    let obj = arguments[0];
    let s = this;
    for (var key in obj) {
        s = s.replace(new RegExp("\\{\\{" + key + "\\}\\}", "g"), obj[key]);
    }
    return s;
}

function gotoTop() {
    $('html, body').animate({scrollTop: 0}, 'fast');
}

/**
 * 随机4位数字密码
 * @returns {string}
 */
function randomPwd() {
    let pwd = '';
    for (let i = 0; i < 4; i++) {
        pwd += Math.floor(Math.random() * 10);//可均衡获取0到9的随机整数。
    }
    return pwd;
}

/**
 * Javascript \x 反斜杠x 16进制 解码
 * https://www.cnblogs.com/xiaoqi/p/js-x-encode-decode.html
 * @param str
 * @returns {*}
 */
function decode(str) {
    return str.replace(/\\x(\w{2})/g, function (_, $1) {
        return String.fromCharCode(parseInt($1, 16))
    });
}

/**
 * Javascript \x 反斜杠x 16进制 编码
 * https://www.cnblogs.com/xiaoqi/p/js-x-encode-decode.html
 * @param str
 * @returns {*}
 */
function encode(str) {
    return str.replace(/(\w)/g, function (_, $1) {
        return "\\x" + $1.charCodeAt(0).toString(16)
    });
}

// ==================== axios ====================

function axiosGet(url, params={}, headers={}) {
    console.log(url);
    console.log(params);
    console.log(headers);
    for (let k in params) {
        console.log(k + '=' + params[k]);
    }
}

function axiosPost(url, params={}, headers={}) {
    console.log(url);
    console.log(params);
    console.log(headers);
}
