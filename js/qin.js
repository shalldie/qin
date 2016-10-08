; (function ($) {
    $.extend($.easing, {
        easeOutElastic: function (x, t, b, c, d) {
            var s = 1.70158; var p = 0; var a = c;
            if (t == 0) return b; if ((t /= d) == 1) return b + c; if (!p) p = d * .3;
            if (a < Math.abs(c)) { a = c; var s = p / 4; }
            else var s = p / (2 * Math.PI) * Math.asin(c / a);
            return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
        }
    });

    $.fn.qin = function (options) {
        var defaults = {
            offset: 22,  // 最大偏移量
            duration: 500,  // 晃动时间
            recline: 0.1 // 每像素偏移量
        };

        var opt = $.extend({}, defaults, options);

        return this.each(function () {
            var $ele = $(this);
            fillSpan($ele);
            stringAnimate($ele, opt);
        });
    };

    function fillSpan($ele) {
        // var content = [
        //     '<span>',
        //     [].join.call($ele.html(), '</span><span>'),
        //     '</span>'
        // ].join(''); // IE9+
        var baseContent = $ele.html();
        var content = '';
        for (var i = 0, len = baseContent.length; i < len; i++) {
            // content += '<span>' + baseContent[i] + '</span>' // IE8+
            content += '<span>' + baseContent.substr(i, 1) + '</span>' // 兼容到IE6...
        }
        $ele.html(content);
        var positionArr = [];  //存放原始位置
        $ele.children('span').each(function () {
            var $span = $(this);
            var position = $span.position();
            positionArr.push(position);
            $span.css({
                top: position.top + "px",
                left: position.left + "px"
            });
            setTimeout(function () {
                $span.css("position", "absolute");
            }, 0);
        });
        $ele.data("stringPosition", positionArr);
    }

    function stringAnimate($ele, opt) {
        var positionArr = $ele.data("stringPosition"); // 原始位置 

        var startX = 0; // 初始x轴位置
        var startY = 0; // 初始y轴位置 

        $ele.mouseenter(function (ex) {

            var offset = $ele.offset();

            startX = ex.pageX - offset.left; // 鼠标在容器内 x 坐标
            startY = ex.pageY - offset.top;  // 鼠标在容器内 y 坐标
        });

        $ele.mousemove(function (ex) {
            var offset = $ele.offset();

            var xPos = ex.pageX - offset.left; // 鼠标在容器内 x 坐标
            var yPos = ex.pageY - offset.top;  // 鼠标在容器内 y 坐标

            var offsetY = yPos - startY; // Y轴移动距离

            if (Math.abs(offsetY) > opt.offset) { // 如果偏移超过最大值
                return;
            }

            var ifDown = offsetY > 0; // 是否是向下移动

            $ele.children("span").each(function (index) {
                var $span = $(this); // 当前span
                var position = positionArr[index]; // 当前原始position
                var reclineNum = Math.abs(xPos - position.left) * opt.recline; // Y 轴移动距离，基于原始位置
                reclineNum *= ifDown ? 1 : (-1); // 基于向下为正方向

                var resultY = position.top + offsetY - reclineNum;

                if (ifDown && resultY < position.top) {
                    resultY = position.top;
                }
                else if (!ifDown && resultY > position.top) {
                    resultY = position.top;
                }

                $span.css({
                    top: resultY + "px"
                });

            });
        });
        $ele.mouseleave(function () {
            $ele.children("span").each(function (index) {
                $(this).stop(true, false).animate({
                    top: positionArr[index].top + "px"
                }, {
                        duration: opt.duration,
                        easing: "easeOutElastic"
                    });
            });
        });
    };

})(jQuery);