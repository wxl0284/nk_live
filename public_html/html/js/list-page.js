/**
 * My module:
 *  项目列表页
 */
X.sub("init", function() {
    //fill in your code here
    var ismore = true;
    var canload = true;
    var limit = 9;
    var start = 1;
    var total = 0;
    var currentPage = 1;
    var qt = ""; //专业参数使用
    var qt1 = ""; //标题查询参数
    var qt2 = ""; //专业大类查询参数
    var qt3 = ""; //专业分类查询参数
    var qt4 = ""; //专业查询参数
    var subject01 = ""; //专业大类
    var subject02 = ""; //专业类
    var subject03 = ""; //专业
    var kg = 0;
    var qt5 = "&sortby=proLevel"; //排序
    var qt6 = "&reverse=true"; //正序反序
    var qt7 = ""; //级别查询参数
    var qt8 = ""; //获奖年份查询参数
    var qt9 = ""; //申报查询参数
    var qtdel = "&del=0";

    X.pub("showLoading"); //显示loading图标

    if (X.qs.sid) {
        var _sid = X.qs.sid;
        var hashStr = location.hash.replace("#", "");
        if (hashStr && !isNaN(hashStr)) {
            _sid = hashStr;
        }
        subject01 = _sid;
        //专业大类查询参数
        // qt2 = "&subject01=" + X.qs.sid;
        qt2 = "&specialtySubject=" + _sid;
        if (_sid == "all" || hashStr == "all") {
            subject01 = "";
            qt2 = "";
        } else {
            onChoicetype(_sid); //获取专业分类
        }
        getLevelCount();
    }
    if (X.qs.vid) {
        subject02 = X.qs.vid;
        onChoicetype(X.qs.sid); //获取专业类
        //专业分类查询参数
        $(".hide1").show();
        // qt3 = "&subject02=" + X.qs.vid;
        qt3 = "&specialtySubject2=" + X.qs.vid;
        getLevelCount();
    }
    if (X.qs.proLevel) {
        //项目级别
        qt7 = "&queryProLevel=" + X.qs.proLevel;
        $(".proLevel li[data=" + X.qs.proLevel + "]").addClass("on").siblings().removeClass("on");
    }
    if (X.qs.title) {
        //项目名称
        qt1 = "&title=" + decodeURIComponent(X.qs.title);
        var f = X('searchSection');
        f.title.value = decodeURIComponent(X.qs.title);
    }
    if (X.qs.schoolTitle) {
        //学校名称
        qt1 = "&schoolTitle=" + decodeURIComponent(X.qs.schoolTitle);
        var f = X('searchSection');
        f.schoolTitle.value = decodeURIComponent(X.qs.schoolTitle);
    }
    if (X.qs.incharge) {
        //负责人姓名
        qt1 = "&incharge=" + decodeURIComponent(X.qs.incharge);
        var f = X('searchSection');
        f.incharge.value = decodeURIComponent(X.qs.incharge);
    }
    // if (X.qs.tid) {
    //     subject03 = X.qs.tid;
    //     //专业查询参数
    //     qt4 = "&subject03=" + X.qs.tid;

    // }

    var user = {};

    //用户信息
    X.sub('userLogged', function(evt, respText) {
        user = respText;
        checkLang();
    });

    /*检查当前语言*/
    function checkLang() {
        if (LANG == "EN") {
            document.title = EN.list.title;
            $(".more").text(EN.public.more + "+");

        }
    }
    checkLang();

    // 设置搜索表单

    function setSearchForm() {
        var div = '';
        var res = '';
        div += '<div class="menu">';
        div += '<div class="menubox">';
        div += '<div class="sort clearfix">';
        div += '<div class="title">' + (LANG == "EN" ? EN.public.subject : "专业大类") + '：</div>';
        div += '<div class="list"></div>';
        div += '</div>';
        div += '<div class="sort clearfix hide1">';
        div += '<div class="title">' + (LANG == "EN" ? EN.public.category : "专业分类") + '：</div>';
        div += '<div class="type"></div>';
        div += '</div>';
        div += '<div class="sort clearfix hide2" style="display:none">';
        div += '<div class="title">' + (LANG == "EN" ? EN.public.major : "专业") + '：</div>';
        div += '<div class="classify"></div>';
        div += '</div>';
        div += '<div class="sort clearfix">';
        div += '<div class="sub-sort">';
        div += '<div class="title">' + (LANG == "EN" ? EN.projectInfo.proLevel : "项目级别") + '：</div>';
        div += '<div class="proLevel">';
        div += '<ul class="clearfix">';
        div += '<li data="all" class="on">' + (LANG == "EN" ? EN.list.all : "全部") + '</li>';
        div += '<li data="1">' + (LANG == "EN" ? EN.list.affirmPro : "认定项目") + '</li>';
        div += '<li data="2">' + (LANG == "EN" ? EN.list.otherPro : "其他项目") + '</li>';
        div += '</ul>';
        div += '</div>';
        div += '</div>';
        div += '<div class="sub-sort">';
        div += '<div class="title">' + (LANG == "EN" ? EN.projectInfo.awardYear : "获奖年份") + '：</div>';
        div += '<div class="prizeYear">';
        div += '<ul class="clearfix">';
        div += '<li data="all" class="on">' + (LANG == "EN" ? EN.list.all : "全部") + '</li>';
        div += '<li data="2018">2018</li>';
        div += '<li data="2017">2017</li>';
        div += '</ul>';
        div += '</div>';
        div += '</div>';
        div += '<div class="sub-sort">';
        div += '<div class="title">' + (LANG == "EN" ? EN.projectInfo.declareYear : "申报年份") + '：</div>';
        div += '<div class="declareYear">';
        div += '<ul class="clearfix">';
        div += '<li data="all" class="on">' + (LANG == "EN" ? EN.list.all : "全部") + '</li>';
        div += '<li data="2018">2018</li>';
        div += '<li data="2017">2017</li>';
        div += '</ul>';
        div += '</div>';
        div += '</div>';
        div += '</div>';
        div += '<div class="sort clearfix">';
        div += '<div class="title">' + (LANG == "EN" ? EN.projectInfo.keyWords : "关键词") + '：</div>';
        div += '<div class="edit">';
        div += '<input type="text" name="title" placeholder="' + (LANG == "EN" ? EN.projectInfo.proTitle : "项目名称") + '" />';
        div += '<input type="text" name="schoolTitle" placeholder="' + (LANG == "EN" ? EN.projectInfo.schoolTitle : "学校名称") + '" class="' + (LANG == "EN" ? "hide" : "") + '" />';
        div += '<input type="text" name="incharge" class="school-title" placeholder="' + (LANG == "EN" ? EN.projectInfo.incharge : "负责人姓名") + '" />';
        // div += '<span class="search"></span>';
        if (LANG == "EN") {
            div += '<button type="submit" class="s-btn search">' + (EN.public.search) + '</button>';
        } else {
            div += '<button type="submit" class="s-btn search">搜索</button>';
        }
        div += '</div>';
        div += '</div>';
        div += '</div>';
        div += '</div>';
        $("#searchSection").html(div);

        res += '<div class="sort-title">' + (LANG == "EN" ? EN.list.sortby : "排序") + '：</div>';
        res += '<div class="sort-list clearfix">';
        // res += '<span class="desc">' + (LANG == "EN" ? EN.list.byDefault : "默认") + '</span>';
        res += '<span class="aesc">' + (LANG == "EN" ? EN.list.byNewest : "最新") + '</span>';
        res += '<span>' + (LANG == "EN" ? EN.list.byScore : "评分") + '</span>';
        res += '<span>' + (LANG == "EN" ? EN.list.byCollection : "收藏") + '</span>';
        res += '<span>' + (LANG == "EN" ? EN.list.byLike : "点赞") + '</span>';
        res += '</div>';
        $(".sort-container").html(res);
        if (LANG == "EN") {
            $(".center_content .menu .menubox .title").css({
                width: "126px"
            });
        }
        //选择专业大类
        onChoice();
    }
    setSearchForm();

    function onChoice() {
        X.get('/api/nologin/specialty/subject/search', function(respText) {
            var resp = JSON.parse(respText);
            resp.meta = resp.meta || {
                total: "0",
                size: "0"
            };

            if (resp.meta && resp.meta.total != '0') {
                var size = parseInt(resp.meta.size);
                var res = '<ul class="clearfix">';
                var num = 0;

                for (var j = 0; j < size; ++j) { //统计全部
                    var item = resp.data[j];
                    item.projectNum = item.projectNum || 0;
                    num += parseInt(item.projectNum);
                }
                res += '<li data="all" class="on">' + (LANG == "EN" ? EN.list.all : "全部") + '(' + (num || 0) + ')</li>';
                for (var i = 0; i < size; ++i) {
                    var item = resp.data[i];
                    item.id = item.id || "";
                    if(parseInt(item.id) <= 216){ //隐藏2019年新分类
                        res += '<li';
                        if (subject01 == item.id) { //如果是跳转过来的，当前的专业大类为选中状态
                            res += ' class="on"';
                        }
                        res += ' data="' + item.id + '">' + (LANG == "EN" ? item.en_title : item.title) + '(' + (item.projectNum || 0) + ')</li>';
                    }
                }
                res += '</ul> ';
                $(".list").html(res);

                //如果是跳转过来的，则取消全部专业大类的选中状态并显示专业分类
                if (subject01) {
                    $(".list li").eq(0).removeClass("on");
                    $(".hide1").show();
                }
                $(".list li").click(function() {

                    var vid = $(this).attr("data");
                    $(this).addClass("on").siblings().removeClass("on");
                    onChoicetype(vid); //获取二级专业

                    location.hash = "#" + vid;

                    //查询该专业大类下的项目
                    // qt2 = "&subject01=" + vid;
                    qt2 = "&specialtySubject=" + vid;
                    //初始化
                    subject02 = "";
                    subject03 = "";
                    if (vid == "all") {
                        qt2 = ""; //清空专业大类
                        qt3 = ""; //清空专业分类
                        qt4 = ""; //清空专业
                        $(".hide1").hide(); //专业分类隐藏
                    } else {
                        $(".hide1").show(); //专业分类显示
                    }
                    $(".hide2").hide(); //专业隐藏

                    $(".type").html(""); //专业分类
                    qt3 = "";
                    $(".classify").html(""); //专业
                    qt4 = "";
                    start = 1;
                    loadContent();
                    getLevelCount();
                });
            }

        });
    }

    //选择专业分类

    function onChoicetype(vid) {
        X.get('/api/nologin/specialty/subject2/search?parentId=' + vid, function(respText) {
            var resp = JSON.parse(respText);
            resp.meta = resp.meta || {
                total: "0",
                size: "0"
            };
            if (resp.meta && resp.meta.total != '0') {
                var size = parseInt(resp.meta.size);
                var res = '<ul class="clearfix"> ';
                var num = 0;
                for (var j = 0; j < size; ++j) {
                    var item = resp.data[j];
                    item.projectNum = item.projectNum || 0;
                    num += parseInt(item.projectNum);
                }
                res += '<li data="all" class="on">' + (LANG == "EN" ? EN.list.all : "全部") + '(' + (num || 0) + ')</li>';
                for (var i = 0; i < size; ++i) {
                    var item = resp.data[i];
                    item.id = item.id || "";
                    if(parseInt(item.id) <= 216){ //隐藏2019年新分类
                        res += '<li';
                        if (subject02 == item.id) { //如果是跳转过来的，当前的专业分类为选中状态
                            res += ' class="on"';
                        }
                        res += ' data="' + item.id + '">' + (LANG == "EN" ? item.en_title : item.title) + '(' + (item.projectNum || 0) + ')</li>';
                    }
                }
                res += '</ul>';
                $(".type").html(res);
                //如果是跳转过来的，则取消全部专业分类的选中状态
                if (subject02) {
                    $(".type li").eq(0).removeClass("on");
                }

                $(".type li").click(function() {

                    var cid = $(this).attr("data");
                    $(this).addClass("on").siblings().removeClass("on");
                    // onChoiceclassify(cid); //获取三级专业
                    //查询专业分类下的项目
                    // qt3 = "&subject02=" + cid;
                    qt3 = "&specialtySubject2=" + cid;
                    if (cid == "all") {
                        qt3 = ""; //清空专业分类
                        qt4 = ""; //清空专业
                        $(".hide2").hide(); //专业隐藏
                    } else {
                        // $(".hide2").show(); //专业显示
                    }

                    $(".classify").html(""); //专业
                    qt4 = "";
                    start = 1;
                    loadContent();
                    getLevelCount();
                });
            }

        });
    }

    //选择专业


    // function onChoiceclassify(cid) {
    //     X.get('/json/subjects?sortby=id&reverse=true&grade=2&status=1&del=0&limit=200&parent2=' + cid, function(respText) {
    //         var resp = JSON.parse(respText);
    //         resp.meta = resp.meta || {
    //             total: "0",
    //             size: "0"
    //         };
    //         if (resp.meta && resp.meta.total != '0') {
    //             var size = parseInt(resp.meta.size);
    //             var res = '<ul class="clearfix"> ';
    //             res += '<li data="all" class="on">全部</li>';
    //             for (var i = 0; i < size; ++i) {
    //                 var item = resp.data[i];
    //                 res += '<li';
    //                 if (subject03 == item.id) { //如果是跳转过来的，当前的专业分类为选中状态
    //                     res += ' class="on"';
    //                 }
    //                 res += ' data="' + item.id + '"> ' + item.title + ' </li>';
    //             }
    //             res += ' </ul>';
    //             $(".classify").html(res);
    //             //如果是跳转过来的，则取消全部专业分类的选中状态
    //             if (subject03) {
    //                 $(".classify li").eq(0).removeClass("on");
    //             }
    //             $(".classify li").click(function() {
    //                 $(this).addClass("on").siblings().removeClass("on");
    //                 //查询专业下的项目
    //                 var kid = $(this).attr("data");
    //                 qt4 = "&subject03=" + kid;
    //                 if (kid == "all") {
    //                     qt4 = ""; //清空专业
    //                 }
    //                 loadContent();
    //             });
    //         }

    //     });
    // }

    /**
     * 级别
     */
    $(".proLevel li").on('click', function() {
        var cid = $(this).attr("data");
        $(this).addClass("on").siblings().removeClass("on");
        qt7 = "&queryProLevel=" + cid;
        if (cid == "all") {
            qt7 = ""; //清空级别
        }
        start = 1;
        loadContent();
    });

    function getLevelCount() {
        X.get("/json/projects?status=1&del=0&proLevel=1&queryProLevel=1&isToDeclare=1&limit=0" + qt2 + qt3 + qt4, function(resp) {
            resp = JSON.parse(resp);
            resp.meta = resp.meta || {
                "total": "0"
            };
            $(".proLevel ul li[data=1]").text(LANG == "EN" ? (EN.list.affirmPro + "(" + resp.meta.total + ")") : ("认定项目(" + resp.meta.total + ")"));
        });
        X.get("/json/projects?status=1&del=0&proLevel=1&queryProLevel=2&isToDeclare=1&limit=0" + qt2 + qt3 + qt4, function(resp) {
            resp = JSON.parse(resp);
            resp.meta = resp.meta || {
                "total": "0"
            };
            $(".proLevel ul li[data=2]").text(LANG == "EN" ? (EN.list.otherPro + "(" + resp.meta.total + ")") : ("其他项目(" + resp.meta.total + ")"));
        });
    }

    /**
     * 获奖年份
     */

    $(".prizeYear li").on('click', function() {
        var cid = $(this).attr("data");
        $(this).addClass("on").siblings().removeClass("on");
        qt8 = "&prizeYear=" + cid;
        if (cid == "all") {
            qt8 = ""; //清空获奖年份
        }
        start = 1;
        loadContent();
    });

    /**
     * 申报年份
     */

    $(".declareYear li").on('click', function() {
        var cid = $(this).attr("data");
        $(this).addClass("on").siblings().removeClass("on");
        qt9 = "&declareYear=" + cid;
        if (cid == "all") {
            qt9 = ""; //清空申报年份
        }
        start = 1;
        loadContent();
    });

    /**
     * 搜索
     */
    $('.search').click(function() {
        qt1 = '';
        var f = X('searchSection');
        if (f.title.value !== ' ' && f.title.value !== '') {
            if (LANG == "EN") {
                qt1 += '&en_title=' + f.title.value;
            } else {
                qt1 += '&title=' + f.title.value;
            }
        }
        if (f.schoolTitle.value !== ' ' && f.schoolTitle.value !== '') {
            qt1 += '&schoolTitle=' + f.schoolTitle.value;
        }
        if (f.incharge.value !== ' ' && f.incharge.value !== '') {
            if (LANG == "EN") {
                qt1 += '&en_incharge=' + f.incharge.value;
            } else {
                qt1 += '&incharge=' + f.incharge.value;
            }
        }
        start = 1;
        loadContent();
    });

    /**
     * 排序
     */

    $(".sort-list span").on("click", function() {
        setSort($(this).index());
    });

    function setSort(i) {
        var that = $(".sort-list span").eq(i);
        that.addClass("on").siblings().removeClass("on aesc desc");
        switch (i) {
            // case 0:
            //     qt5 = "&sortby=queryProLevel";
            //     break;
            case 0:
                qt5 = "&sortby=pubSeq";
                break;
            case 1:
                qt5 = "&sortby=intScore";
                break;
            case 2:
                qt5 = "&sortby=collectionCount";
                break;
            case 3:
                qt5 = "&sortby=upCount";
                break;
            default:
                qt5 = "&sortby=queryProLevel";
                break;
        }
        if (that.hasClass("desc")) {
            that.addClass("aesc").removeClass("desc");
            qt6 = "&reverse=false";
        } else {
            that.addClass("desc").removeClass("aesc");
            qt6 = "&reverse=true";
        }
        loadContent();
    }

    setSort(0);

    // loadContent();

    //获取项目数据

    function loadContent() {
        var f = X('searchSection');
        if (f.schoolTitle.value !== ' ' && f.schoolTitle.value !== '') {
            qtdel = '';
        } else {
            qtdel = '&del=0';
        }
        //初始化分页信息
        var ismore = true;
        var canload = true;
        var start = 1;
        var total = 0;
        var currentPage = 1;
        $("#list").html("");
        $(".getMore").hide();
        X.pub("showLoading"); //开始loading
        var uri = '/json/projects?status=1&del=0&proLevel=1&isToDeclare=1&limit=' + limit + qt1 + qt2 + qt3 + qt4 + qt5 + qt6 + qt7 + qt8 + qt9 + qtdel;
        //兼容IE，使用encode
        X.get(encodeURI(uri), onGetContent);

        // getLevelCount();
    }

    function onGetContent(respText) {
        var resp = JSON.parse(respText);
        resp.meta = resp.meta || {
            total: "0",
            size: "0"
        };
        var res = '';

        if (resp.meta && resp.meta.total === '0') {
            if (LANG == "EN") {
                res = '<div class="noitems">' + (EN.public.noItems) + '</div>';
            } else {
                res = '<div class="noitems">暂无数据</div>';
            }
        } else {
            var size = parseInt(resp.meta.size);
            for (var i = 0; i < size; ++i) {
                var item = resp.data[i];
                item.schoolInfo = item.schoolInfo || {};
                var len = 220;
                if (item.title.length > 22) {
                    len = 180;
                }
                var cls = "";
                if ((i + 1) % 3 === 0) {
                    cls = "nth3";
                }
                var detailsUrl = "";
                // if (item.isPrized == 1 && item.prizeLevel == "1") {
                //     detailsUrl = "/details";
                // } else {
                //     if (item.declareYear == "2017") {
                //         detailsUrl = "/details/v1";
                //     } else {
                //         detailsUrl = "/details/v3";
                //     }
                // }
                if (item.isPrized == 1 && item.prizeLevel == "1") {
                    if (item.declareYear == "2019") {
                        detailsUrl = "/details/v4";
                    } else {
                        detailsUrl = "/details";
                    }
                } else {
                    if (item.declareYear == "2019") {
                        detailsUrl = "/details/v5";
                    } else if (item.declareYear == "2018") {
                        detailsUrl = "/details/v3";
                    } else {
                        detailsUrl = "/details/v1";
                    }
                }
                res += '<li class="' + cls + '">';
                res += '<a href="' + detailsUrl + '?id=' + item.id + '&isView=true"  target="_blank" title="' + ((LANG == "EN" ? (item.en_title || item.title || "") : (item.title || ""))) + '">';
                res += '<div class="cover">';
                res += '<div class="cover-bg"></div>';
                res += '<div class="editbox">';
                if (LANG == "EN") {
                    res += '<div class="word">' + (sliceEnglish((item.en_title || item.title || ""), 65) || "") + '</div>';
                    res += '<div class="txt"><span>' + (item.schoolInfo.en_title || item.schoolTitle || "") + '</span><span>' + (item.en_incharge || "") + '</span><em>' + item.score + '</em></div>';
                    res += '<div class="intro" title="' + (item.en_brief || "") + '">' + (sliceEnglish((item.en_brief || item.brief || ""), len) || "") + '</div>';
                } else {
                    res += '<div class="word">' + (item.title || "") + '</div>';
                    res += '<div class="txt"><span>' + (item.schoolTitle || "") + '</span><span>' + (item.incharge || "") + '</span><em>' + item.score + ' 分</em></div>';
                    res += '<div class="intro" title="' + (item.brief || "") + '">' + (sb_substr((item.brief || ""), len, true) || "") + '</div>';
                }
                res += '</div>'; //editbox
                res += '</div>'; //cover
                res += '<div class="cbox">';
                item.imgPath = item.imgPath || "";
                var _imgs = item.imgPath.split("=");
                res += '<div class="pic"><img src="/imgview/' + (_imgs[1] || "") + '_388x224.jpg" onerror="this.src=\'/images/default.jpg\'" /></div>';
                res += '<div class="text clearfix">';
                if (LANG == "EN") {
                    res += '<div class="infor"> <p class="p1">' + (sliceEnglish((item.en_title || item.title || ""), 65) || "") + '</p><p class="p2"><span>' + (item.schoolInfo.en_title || item.schoolTitle || "") + '</span><br /><span>' + (item.en_incharge || item.incharge || "") + '</span>';
                } else {
                    res += '<div class="infor"> <p class="p1">' + (item.title || "") + '</p><p class="p2"><span>' + (item.schoolTitle || "") + '</span><span>' + (item.incharge || "") + '</span>';
                }
                if (item.declareYear == "2018") {
                    if (item.isPrized == 1 && item.prizeLevel == "1") {
                        // res += '<span class="proLevel-1">国家项目</span>';
                        res += '<span class="proLevel-1"></span>';
                    }
                } else if (item.declareYear == "2017") {
                    if (item.isPrized == 1) {
                        // res += '<span class="proLevel-1">国家项目</span>';
                        res += '<span class="proLevel-1"></span>';
                    }
                }

                res += '</p></div>';
                res += '<div class="score">' + item.score + (LANG == "EN" ? " " : " 分") + '</div>';
                res += '</div>'; //text
                res += '</div>'; //cbox
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

        // 遮罩层
        var animate = false;
        $("#list li .pic").stop().hover(function() {
            if (animate) {
                return;
            }
            var parent = $(this).parents("li");
            parent.find(".pic").css("height", "224px");
            parent.find("img").css("marginTop", "0");
            parent.find(".text").hide();
            parent.find(".cover").css({
                "visibility": "visible",
                "opacity": 1
            });
            animate = true;
        }, function() {
            return;
        });
        $("#list li .cover").stop().hover(function() {
            return;
        }, function() {
            var parent = $(this).parents("li");
            parent.find(".pic").css("height", "162px");
            parent.find("img").css("marginTop", "-31px");
            parent.find(".cbox").children(".text").show();
            parent.find(".cover").css({
                "visibility": "hidden",
                "opacity": 0
            });
            setTimeout(function() {
                animate = false;
            }, 200);
        });

        X.pub("closeLoading"); //关闭loading
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
            X.pub("showLoading"); //开始loading
            var f = X('searchSection');
            if (f.schoolTitle.value !== ' ' && f.schoolTitle.value !== '') {
                qtdel = '';
            } else {
                qtdel = '&del=0';
            }
            var uri = '/json/projects?status=1&del=0&proLevel=1&isToDeclare=1&limit=' + limit + '&start=' + start + qt1 + qt2 + qt3 + qt5 + qt6 + qt7 + qt8 + qt9 + qtdel;
            X.get(encodeURI(uri), onGetContent);
        }
    });
});