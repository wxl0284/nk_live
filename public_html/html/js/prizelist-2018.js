/**
 * My module:
 *  2018认定项目-列表页
 */
X.sub("init", function() {
    var ismore = true;
    var canload = true;
    var limit = 8;
    var start = 1;
    var total = 0;
    var currentPage = 1;
    var qt = ""; //专业参数使用

    /*检查当前语言*/
    function checkLang() {
        if (LANG == "EN") {
            document.title = EN.prizeList.title;
            $(".static-wrapper").hide();
            $(".top").hide();
            $(".list-title-bg").css({
                background: "url(../images/en-p-l-t-2.jpg) no-repeat center center",
                backgroundSize: "cover",
                width: "1000px",
                height: "129px"
            });
            $(".list-tip").text(EN.prizeList.brief);
            $(".getMore").html('<span class="more">'+(EN.public.more)+'+</span>');
        }
    }
    // checkLang();

    /**
     * 获取轮播图
     */
    X.get('/json/flashes?sortby=id&reverse=true&status=1&del=0&positionId=4', function(resp) {
        resp = JSON.parse(resp);
        resp.meta = resp.meta || {
            total: "0",
            size: "0"
        };
        var res = '',
            res1 = '';
        if (resp.meta && resp.meta.total === '0') {
            //$('#list_'+_c+' .list').html("<div class='noitems'>" + msgs.noItem + "</div>");
        } else {
            var size = parseInt(resp.meta.size);
            var ids = {};
            for (var i = 0; i < size; ++i) {
                var item = resp.data[i];
                item.type = item.type || "1";
                item.link = item.link || "#";
                if (i === 0) {
                    res += '<div class="banner_list">';
                    res1 += '<li class="on">';
                } else {
                    res += '<div class="banner_list">';
                    res1 += '<li>';
                }
                var attr = '';
                if (item.link != "#") {
                    attr = '_blank';
                }
                res += '<a href="' + (item.link || "#") + '" target="' + attr + '"><img src="' + item.imgPath + '" /></a></div>';
                res1 += '</li>';
            }


            $(".center_box .b-img").html(res);
            $('.center_box .clickBtn').html(res1);

            courseCarousel();
        }
    });

    var time = 4000,
        t = 0,
        n = 0,
        count;

    function courseCarousel() {
        count = $(".banner_list").length;

        $(".banner_list:first-child").show();
        $(".banner_list:not(:first-child)").hide();
        if (count > 1) {
            $(".clickBtn li").click(function() {
                clearInterval(t);
                var i = $(".clickBtn li").index($(this));
                n = i;
                if (i >= count) return;

                $(".banner_list").filter(":visible").fadeOut(500).parent().children().eq(i).fadeIn(1000);

                $(this).addClass("on");
                $(this).siblings().removeAttr("class");

                t = setInterval(function() {
                    showAuto();
                }, time);
            });
            t = setInterval(function() {
                showAuto();
            }, time);
            // $(".center_box").hover(function() {
            //     clearInterval(t);
            // }, function() {
            //     t = setInterval(function() {
            //       showAuto();
            //     }, time);
            // });
        } else {
            $(".clickBtn li, .swiper-button-prev, .swiper-button-next").hide();
        }

        function showAuto() {
            n = n >= (count - 1) ? 0 : ++n;
            $(".clickBtn li").eq(n).trigger('click');
        }

        $('.swiper-button-prev').on('click', function(e) {
            e.preventDefault();
            e.preventDefault();
            if ((n - 1) < 0) return;
            n -= 1;
            clearInterval(t);
            $(".banner_list").filter(":visible").fadeOut(500).parent().children().eq(n).fadeIn(1000);
            $(".clickBtn li").eq(n).addClass("on").siblings().removeAttr("class");
            t = setInterval(function() {
                showAuto();
            }, time);
        });

        $('.swiper-button-next').on('click', function(e) {
            e.preventDefault();
            if ((n + 1) >= count) return;
            n += 1;
            clearInterval(t);
            $(".banner_list").filter(":visible").fadeOut(500).parent().children().eq(n).fadeIn(1000);
            $(".clickBtn li").eq(n).addClass("on").siblings().removeAttr("class");
            t = setInterval(function() {
                showAuto();
            }, time);
        });
    }

    /**
     * 获取分类
     */

    function setSubject() {
        var res = "";
        res += '<div class="category-row">';
        res += '<span class="subject-item" onclick="X.pub(\'getPrizeSubject\',\'09\',$(this))">化学</span>';
        res += '<span class="subject-item" onclick="X.pub(\'getPrizeSubject\',\'01\',$(this))">生物科学</span>';
        res += '<span class="subject-item" onclick="X.pub(\'getPrizeSubject\',\'10\',$(this))">心理学</span>';
        res += '<span class="subject-item" onclick="X.pub(\'getPrizeSubject\',\'02\',$(this))">机械</span>';
        res += '<span class="subject-item" onclick="X.pub(\'getPrizeSubject\',\'11\',$(this))">能源动力</span>';
        res += '<span class="subject-item" onclick="X.pub(\'getPrizeSubject\',\'12\',$(this))">土木</span>';
        res += '<span class="subject-item" onclick="X.pub(\'getPrizeSubject\',\'13\',$(this))">测绘</span>';
        res += '<span class="subject-item nth8" onclick="X.pub(\'getPrizeSubject\',\'04\',$(this))">化工与制药</span>';
        res += '</div>';
        res += '<div class="category-row">';
        res += '<span class="subject-item" onclick="X.pub(\'getPrizeSubject\',\'14\',$(this))">地质</span>';
        res += '<span class="subject-item" onclick="X.pub(\'getPrizeSubject\',\'05\',$(this))">交通运输</span>';
        res += '<span class="subject-item" onclick="X.pub(\'getPrizeSubject\',\'15\',$(this))">航空航天</span>';
        res += '<span class="subject-item" onclick="X.pub(\'getPrizeSubject\',\'06\',$(this))">核工程</span>';
        res += '<span class="subject-item" onclick="X.pub(\'getPrizeSubject\',\'16\',$(this))">环境科学与工程</span>';
        res += '<span class="subject-item" onclick="X.pub(\'getPrizeSubject\',\'17\',$(this))">食品科学与工程</span>';
        res += '<span class="subject-item" onclick="X.pub(\'getPrizeSubject\',\'18\',$(this))">植物</span>';
        res += '<span class="subject-item nth8" onclick="X.pub(\'getPrizeSubject\',\'19\',$(this))">动物</span>';
        res += '</div>';
        res += '<div class="category-row">';
        res += '<span class="subject-item" onclick="X.pub(\'getPrizeSubject\',\'20\',$(this))">基础医学</span>';
        res += '<span class="subject-item" onclick="X.pub(\'getPrizeSubject\',\'07\',$(this))">临床医学</span>';
        res += '<span class="subject-item" onclick="X.pub(\'getPrizeSubject\',\'21\',$(this))">中医</span>';
        res += '<span class="subject-item" onclick="X.pub(\'getPrizeSubject\',\'08\',$(this))">药学</span>';
        res += '<span class="subject-item" onclick="X.pub(\'getPrizeSubject\',\'22\',$(this))">护理学</span>';
        res += '<span class="subject-item" onclick="X.pub(\'getPrizeSubject\',\'23\',$(this))">教育学</span>';
        res += '<span class="subject-item" onclick="X.pub(\'getPrizeSubject\',\'24\',$(this))">文学</span>';
        res += '<span class="subject-item nth8 empty"></span>';
        res += '</div>';
        $(".category-list").html(res);
    }
    setSubject();

    /**
     * 获取公示列表
     */

    //获取项目数据

    function loadContent() {
        //初始化分页信息
        ismore = true;
        canload = true;
        start = 1;
        total = 0;
        currentPage = 1;
        $("#list").html("");
        var uri = '/json/projects?sortby=pubSeq&reverse=true&isPrized=1&declareYear=2018&del=0&isToDeclare=1&limit=' + limit + qt;
        //兼容IE，使用encode
        X.get(encodeURI(uri), onGetContent);
    }
    loadContent();

    function onGetContent(respText) {
        var resp = JSON.parse(respText);
        resp.meta = resp.meta || {
            total: "0",
            size: "0"
        };
        var res = '';

        if (resp.meta && resp.meta.total === '0') {
            res = '<div class="noitems">' + (LANG == "EN" ? EN.public.noItems : "暂无数据") + '</div>';
        } else {
            var size = parseInt(resp.meta.size);
            for (var i = 0; i < size; ++i) {
                var item = resp.data[i];
                item.score = item.score || 0;
                item.schoolInfo = item.schoolInfo || {};
                var cls = "";
                if ((i + 1) % 4 === 0) {
                    cls = "nth4";
                }
                res += '<li class="clearfix ' + cls + '">';
                res += '<a href="/details?id=' + item.id + '"  target="_blank">';
                res += '<div class="cover">';
                item.imgPath = item.imgPath || "";
                var _imgs = item.imgPath.split("=");
                res += '<div class="pic"><img src="/imgview/' + (_imgs[1] || "") + '_278x161.jpg" onerror="this.src=\'/images/default.jpg\'" /></div>';
                res += '</div>'; //cover
                res += '<div class="editbox">';
                res += '<div class="word" title="' + (LANG == "EN" ? (item.en_title || item.title || "") : (item.title || "")) + '">' + (LANG == "EN" ? (sliceEnglish((item.en_title || item.title || ""), 65) || "") : (item.title || "")) + '</div>';
                res += '<div class="txt">';
                res += '<span>' + (LANG == "EN" ? (item.schoolInfo.en_title || item.schoolTitle || "") : (item.schoolTitle || "")) + '</span>'+(LANG == "EN"?"<br />":"")+'<span>' + (LANG == "EN" ? (item.en_incharge || item.incharge || "") : (item.incharge || "")) + '</span>';
                res += '<span class="num">' + item.score + ' ' + (LANG == "EN" ? "" : "分") + '</span>';
                res += '</div>';
                res += '</div>'; //editbox
                res += '</a>';
                res += '</li>';
            }
        }

        if (start == 1) {
            $("#list").html(res);
        } else {
            $("#list").append(res);
        }

        if (resp.meta.size === '0' || parseInt(resp.meta.size) < limit) {
            ismore = false;
            $(".getMore").hide();
            // $(".noMore").hide();
        } else {
            ismore = true;
            $(".getMore").show();
            // $(".noMore").hide();
        }

        canload = true;
        total = parseInt(resp.meta.total);
    }
    /**
     * 点击时动态加载
     */
    $(".getMore").click(function() {
        if (ismore && canload) {
            canload = false;
            start = start + limit;
            if (start < 1) {
                start = 1;
            }
            var uri = '/json/projects?sortby=pubSeq&reverse=true&isPrized=1&declareYear=2018&del=0&isToDeclare=1&limit=' + limit + '&start=' + start + qt;
            X.get(encodeURI(uri), onGetContent);
        }
    });

    /**
     * 点击分类
     */
    X.sub("getPrizeSubject", function(evt, num, that) {
        $(".category-row span").removeClass("subject-item-active");
        that.addClass("subject-item-active");
        X.get('/json/specialty/subjects?num=' + num, function(respText) {
            var resp = JSON.parse(respText);
            resp.meta = resp.meta || {
                total: "0",
                size: "0"
            };
            resp.data = resp.data || [];
            var item = resp.data[0] || {};
            qt = "&specialtySubject=" + item.id;
            loadContent();
        });
    });
    // 判断高度
    (function() {
        var h = $(window).height();
        var bh = $("body").height();
        var nh = $("#north").height();
        var sh = $("#south").height();
        var cpt = parseInt($("#center").css("padding-top"));
        var cpb = parseInt($("#center").css("padding-bottom"));
        if (bh < h) {
            $("#center").css("min-height", h - nh - sh - cpt - cpb - 1);
        }
    })();
});