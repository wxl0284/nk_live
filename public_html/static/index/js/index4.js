/**
 * index_v4
 */
X.sub("init", function() {

    var qt = "";
    var limit = 6;
    var user = {};
    var subject = subjects; //24个学科分类

    var ICONS_C = [{
        num: '01',
        value: '&#xe635;' // 生物科学类
    }, {
        num: '02',
        value: '&#xe603;' // 机械类
    }, {
        num: '03',
        value: '&#xe699;' // 电子信息类
    }, {
        num: '04',
        value: '&#xe608;' // 化工与制药类
    }, {
        num: '05',
        value: '&#xe65f;' // 交通运输类
    }, {
        num: '06',
        value: '&#xe605;' // 核工程类
    }, {
        num: '07',
        value: '&#xe61a;' // 临床医学类
    }, {
        num: '08',
        value: '&#xe69d;' // 药学类
    }, {
        num: '09',
        value: '&#xe67f;' // 化学类
    }, {
        num: '10',
        value: '&#xe694;' // 心理学类
    }, {
        num: '11',
        value: '&#xe6be;' // 能源动力类
    }, {
        num: '12',
        value: '&#xe67e;' // 土木类
    }, {
        num: '13',
        value: '&#xe619;' // 测绘类
    }, {
        num: '14',
        value: '&#xe63a;' // 地质类
    }, {
        num: '15',
        value: '&#xe680;' // 航空航天类
    }, {
        num: '16',
        value: '&#xe61f;' // 环境科学与工程类
    }, {
        num: '17',
        value: '&#xe64c;' // 食品科学与工程类
    }, {
        num: '18',
        value: '&#xe604;' // 植物类
    }, {
        num: '19',
        value: '&#xe606;' // 动物类
    }, {
        num: '20',
        value: '&#xe64f;' // 医学基础类
    }, {
        num: '21',
        value: '&#xe614;' // 中医类
    }, {
        num: '22',
        value: '&#xe611;' // 护理学类
    }, {
        num: '23',
        value: '&#xe673;' // 教育学类
    }, {
        num: '24',
        value: '&#xeeff;' // 新闻传播学类
    }];

    loadContent();
    onImgContent();

    //用户信息
    X.sub('userLogged', function(evt, respText) {
        user = respText;
    });

    /*检查当前语言*/
    function checkLang() {
        if (LANG == "EN") {
            subject = en_subjects;
            document.title = EN.index.title;
            $(".notice").html('<i></i>' + EN.index.notice);
            $(".news").html('<i></i>' + EN.index.news);
            $(".more").html(EN.public.more + '<i class="iconfont" style="font-size:13px;">&#xe60b;</i>');
            $(".slogan-text").hide();
            $(".topbox").css({
                padding: "190px 0 40px"
            });
            $(".news2").hide();
            $(".content, .center_box").css({
                minHeight: "auto"
            });
            onImgContent();
            $(".subs-list a:first-of-type").css({
                marginLeft: "0"
            });
        } else {
            $(".news2, .projectSort").show();
        }
    }
    checkLang();

    function getIcon(num, _icons) {
        _icons = _icons || [];
        var r = '';
        for (var i = 0; i < _icons.length; i++) {
            if (num == _icons[i].num) {
                r = _icons[i].value;
                break;
            }
        }
        return r;
    }

    function onImgContent() {
        var res = '';
        res += '<div class="swiper-container">';
        res += '<div class="swiper-wrapper">';
        var result = [];
        for (var i = 0, size = subject.length; i < size; i += 6) {
            result.push(subject.slice(i, i + 6));
        }
        
        // result.reverse();
        // for (var i = 0, size = result.length; i < size; i++) {
        //     result[i].reverse();
        // }
        // console.log((result),2222222)
        var lk = '';
        for (var i = 0; i < result.length; i++) {
            res += '<div class="swiper-slide" data-index="' + i + '">';
            res += '<div class="subs-wrapper">';
            res += '<div class="subs-ul">';
            for (var j = 0; j < result[i].length; j++) {
                var item = result[i][j];
                /*if (j == 0 || j == 1 || j == 2) {
                    if (j == 0) {
                        lk += '<div class="bubbleTail"></div>';
                    }
                    lk += '<li><a href="javascript:void(0);" onclick="X.pub(\'getMenuSubject\',\'' + item.num + '\')">' + item.title + '</a></li>';
                } else {
                    lk += '<li><a href="javascript:void(0);" onclick="X.pub(\'getMenuSubject\',\'' + item.num + '\')">' + item.title + '<span class="line"></span></a></li>';
                }*/

                var eqn = 'eq' + (j + 1);
                res += '<div class="subs-box"><div class="subs-box_left"></div>';
                res += '<div class="subs-icon"><img src="'+item.equip_pic+'" style="width:45px;height:45px;"></div>';
                res += '<div class="subs-list">';
                res += '<h1><a href="javascript:void(0);" onclick="X.pub(\'getMenuSubject\',\'' + item.id + '\')">' + item.cat_name + '</a></h1>';
                res += '<span>对应专业:</span>';
                var size = item.children.length;
                var isMore = false;
                if (size > 6) {
                    size = 6;
                    isMore = true;
                }

                for (var f = 0; f < size; f++) {
                    var child = item.children[f];
                    res += '<a href="javascript:void(0);" onclick="X.pub(\'getMenuSubject\',\'' + child.id + '\')">' + child.cat_name + '</a>';
                    if ((f + 1) !== size) {
                        res += '<span>|</span>';
                    } else {
                        if (isMore) {
                            res += '<span>...</span>';
                        }
                    }
                }
                res += '</div>';
                res += '<div class="eqs ' + eqn + '"></div>';
                res += '</div>';
            }
            res += '</div>';
            res += '</div>';
            res += '</div>';
        }

        res += '</div>';
        res += '</div>';
        res += '<div class="swiper-pagination"></div>';
        res += '<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>';
        // $('#subsLink .subjects-box').html(lk);
        $("#imgList").html(res);

        // 调用swiper
        var swiper = new Swiper('.swiper-container', {
            loop: true,
            autoplay: 5000,
            pagination: '.swiper-pagination',
            paginationClickable: true,
            grabCursor: true,
            calculateHeight: true
        });
        $('.swiper-button-prev').on('click', function(e) {
            e.preventDefault();
            swiper.swipePrev();
        });
        $('.swiper-button-next').on('click', function(e) {
            e.preventDefault();
            swiper.swipeNext();
        });
    }

    //咨询管理

    function loadContent() {
        loadNew1();
        loadNew2();
    }

    function loadNew1() {
        X.get('/index/index/article?article_cat=1', function(respText) {
            var resp = JSON.parse(respText);
            resp = resp.result;
            var div = '';
            if (resp.length == '0') {
                div += '<div class="noitems">暂无通知公告</div>';
            } else {
                for (var i = 0, size = resp.length; i < size; i++) {
                    var item = resp[i];
                    var len = 160;
                    if (item.title.length > 22) {
                        len = 100;
                    }
                    item.date = item.create_time;
                    var dates = item.date.split("-");
                    div += '<li>';
                    div += '<a href="/index/article/detail?id=' + item.id + '">';
                    div += '<div class="new2-date">';
                    div += '<div class="mouth">' + dates[1] + '-' + dates[2] + '</div>';
                    div += '<div class="year">' + dates[0] + '</div>';
                    div += '</div>';
                    div += '<div class="news2-title">' + sb_substr((item.title || ""), len, true) + '</div>';
                    div += '</a>';
                    div += '</li>';
                }
            }
            $('#newList1').html(div);
        });
    }

    function loadNew2() {
        X.get('/index/index/article?article_cat=2', function(respText) {
            var resp = JSON.parse(respText);
            resp = resp.result;
            var div = '';
            if (resp.length == '0') {
                div += '<div class="noitems">暂无新闻资讯</div>';
            } else {
                for (var i = 0, size = resp.length; i < size; i++) {
                    var item = resp[i];
                    var len = 160;
                    if (item.title.length > 22) {
                        len = 100;
                    }
                    item.date = item.create_time;
                    var dates = item.date.split("-");
                    div += '<li>';
                    div += '<a href="/index/article/detail?id=' + item.id + '">';
                    div += '<div class="new2-date">';
                    div += '<div class="mouth">' + dates[1] + '-' + dates[2] + '</div>';
                    div += '<div class="year">' + dates[0] + '</div>';
                    div += '</div>';
                    div += '<div class="news2-title">' + sb_substr((item.title || ""), len, true) + '</div>';
                    div += '</a>';
                    div += '</li>';
                }
            }
            $('#newList2').html(div);
        });
    }

    /*排行榜相关*/
    var sort01 = "1"; //左侧排序类别
    var sort02 = "1"; //右上角月/总排行
    var start = 1;
    // var sortTable01 = X('leftTable'),
    // sortTable02 = X('rightTable');
    var SORT_BY = [
        ["", "", ""],
        ["", "mDoExpNum", "tDoExpNum"],
        ["", "mExpComNum", "tExpComNum"],
        ["", "mExpScore", "tExpScore"],
        ["", "mExpSDNum", "tExpSDNum"]
    ];
    /*点击切换排序类别*/
    $(".sort_menu>li").off('click').on('click', function() {
        if (!$(this).hasClass("on")) {
            var sortby = $(this).data("sortby");
            $(this).addClass("on").siblings("li").removeClass("on");
            $(".sort_tab>li").removeClass("on").eq(0).addClass("on");
            start = 1;
            sort01 = sortby;
            sort02 = "1";
            loadProjectSort();
        }
    });

    /*点击切换月/总排行*/
    $(".sort_tab>li").off('click').on('click', function() {
        if (!$(this).hasClass("on")) {
            var sortType = $(this).data("sort-type");
            $(this).addClass("on").siblings("li").removeClass("on");
            start = 1;
            sort02 = sortType;
            loadProjectSort();
        }
    });

    // loadProjectSort();

    function loadProjectSort() {
        X.get('/json/projectSorts?reverse=true&sortby=' + SORT_BY[sort01][sort02] + '&limit=10&start=' + start, onGetProjectSort);
    }

    function onGetProjectSort(respText) {
        var resp = JSON.parse(respText);

        resp.meta = resp.meta || {
            total: "0",
            size: "0"
        };
        if (resp.meta && resp.meta.total == '0') {
            sortTable01.innerHTML = '<div class="noitems">暂无数据</div>';
            sortTable02.innerHTML = '<div class="noitems">暂无数据</div>';
            $(".moreSort").hide();
        } else {
            $(".moreSort").show();
            var size = parseInt(resp.meta.size);
            var res = '<tr><th class="expNum"></th><th class="expTitle">实验名称</th><th class="expIncharge">负责人</th><th class="expSchool">所属学校</th></tr>';
            start--;
            var left = '',
                right = '';
            for (var i = 0; i < size; ++i) {
                var item = resp.data[i];
                item.projectInfo = item.projectInfo || {};
                var detailsUrl = "";
                // if (item.projectInfo.isPrized == 1 && item.projectInfo.prizeLevel == "1") {
                //     detailsUrl = "/details";
                // } else {
                //     if (item.projectInfo.declareYear == "2017") {
                //         detailsUrl = "/details/v1";
                //     } else {
                //         detailsUrl = "/details/v3";
                //     }
                // }
                if (item.projectInfo.isPrized == 1 && item.projectInfo.prizeLevel == "1") {
                    if (item.projectInfo.declareYear == "2019") {
                        detailsUrl = "/details/v4";
                    } else {
                        detailsUrl = "/details";
                    }
                } else {
                    if (item.projectInfo.declareYear == "2019") {
                        detailsUrl = "/details/v5";
                    } else if (item.projectInfo.declareYear == "2018") {
                        detailsUrl = "/details/v3";
                    } else {
                        detailsUrl = "/details/v1";
                    }
                }
                if (i < 5) {
                    if (start < 3) {
                        left += '<tr class="top3">';
                    } else {
                        left += '<tr>';
                    }
                    left += '<td>' + (++start) + '</td>';
                    left += '<td>';
                    left += '<a href="' + detailsUrl + '?id=' + item.projectId + '" target="_blank" title="' + (item.projectTitle || "") + '">' + sb_substr((item.projectTitle || ""), 30, true) + '</a>';
                    left += '</td>';
                    left += '<td>' + (item.projectInfo.incharge || "-") + '</td>';
                    left += '<td>' + (item.projectInfo.schoolTitle || "-") + '</td>';
                    left += '</tr>';
                } else {
                    right += '<tr>';
                    right += '<td>' + (++start) + '</td>';
                    right += '<td>';
                    right += '<a href="' + detailsUrl + '?id=' + item.projectId + '" target="_blank" title="' + (item.projectTitle || "") + '">' + sb_substr((item.projectTitle || ""), 30, true) + '</a>';
                    right += '</td>';
                    right += '<td>' + (item.projectInfo.incharge || "-") + '</td>';
                    right += '<td>' + (item.projectInfo.schoolTitle || "-") + '</td>';
                    right += '</tr>';
                }
            }
            sortTable01.innerHTML = res + left;
            sortTable02.innerHTML = res + right;
        }
    }

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
