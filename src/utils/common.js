export const fullScreen = () => {
    let element = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
}

//退出全屏
export const exitFullscreen = () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    }
}

// 字体适配
export const fontSize = (res) => {
    let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (!clientWidth) return;
    let fontSize = 100 * (clientWidth / 1920);
    return res * fontSize;
}

export const getParam = function (b) {
    var c = document.location.href;
    if (!b) { return c }
    var d = new RegExp("[?&]" + b + "=([^&]+)", "g");
    var g = d.exec(c);
    var a = null;
    if (null != g) {
        try {
            a = decodeURIComponent(decodeURIComponent(g[1]))
        } catch (f) {
            try {
                a = decodeURIComponent(g[1])
            } catch (f) {
                a = g[1]
            }
        }
    } return a;
}

/**
 * 格式化数字、金额、千分位、保留几位小数、舍入舍去
 *
 * @since 1.0.7
 * @param number 要格式化的数字
 * @param decimals 保留几位小数
 * @param decPoint 小数点符号
 * @param thousandsSep 千分位符号
 * @param roundTag 舍入参数，默认 'ceil' 向上取,'floor'向下取,'round' 四舍五入
 * @returns {XML|void|*|string}
 * @example
 *
 * formatNumber(2, 2, '.', ',');
 * // => 2.00
 */
export const priceFormat = function(number) {
    var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    var decPoint = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';
    var thousandsSep = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : ',';
    var roundTag = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'floor';
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number;
    var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals);
    var sep = thousandsSep || ',';
    var dec = decPoint || '.';
    var re = /(-?\d+)(\d{3})/;
    var s = '';

    var toFixedFix = function toFixedFix(n, prec) {
        var k = Math.pow(10, prec);
        return '' + parseFloat(Math[roundTag](parseFloat((n * k).toFixed(prec * 2))).toFixed(prec * 2)) / k;
    };

    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    console.log(n, decimals,  99999999999)
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, '$1' + sep + '$2');
    }

    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

export const TOOLTIP_STYLE = {
    backgroundColor: 'rgba(0, 24, 62, 0.6)',
    borderWidth: 0,
    extraCssText: 'box-shadow: 0px 0px 14px 0px rgba(63, 129, 255, 0.8);color: #fff',
    textStyle: {
        color: '#fff',
        fontSize: fontSize(0.14),
    },
    axisPointer: {
        type: 'shadow'
    }
};

export const GRID = {
    left: fontSize(0.6),
    right: fontSize(0.6),
    bottom: fontSize(0.8),
    top: fontSize(0.62),
}

export const _cnDic = { 5: '万',6: '万', 7: '万', 8: '万', 9: '万', 10: '亿', 11: '亿', 12: '亿', 13: '亿', 14: '亿',};
export const _divisor = { 5: 10000, 6: 10000, 7: 10000, 8: 10000, 9: 10000, 10: 100000000, 11: 100000000, 12: 100000000, 13: 100000000, 14: 100000000,};

