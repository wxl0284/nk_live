/**
 * My module:
 *  项目列表页
 */
X.sub("init", function() {
    //fill in your code here


    // 设置搜索表单

    function setSearchForm() {
        var div = '';
        var res = '';
        div += '<div class="menu">';
        div += '<div class="menubox">';
        div += '<div class="sort clearfix">';
        div += '<div class="title">' + (LANG == "EN" ? EN.public.subject : "专业大类") + '：</div>';
        div += '<div class="list"><ul class="clearfix">' +
            '<li data="all" class="on">全部(<c>1068</c>)</li>' +
            '<li data="80">化学类(<c>35</c>)</li>' +
            '<li data="81">心理学类(<c>12</c>)</li>' +
            '<li data="85">地质类(<c>20</c>)</li>' +
            '<li data="all" class="">全部(<c>1068</c>)</li>' +
            '<li data="80">化学类(<c>35</c>)</li>' +
            '<li data="81">心理学类(<c>12</c>)</li>' +
            '<li data="85">地质类(<c>20</c>)</li>' +
            '<li data="all" class="">全部(<c>1068</c>)</li>' +
            '<li data="80">化学类(<c>1068</c>)</li>' +
            '<li data="81">心理学类(<c>12</c>)</li>' +
            '<li data="85">地质类(<c>12</c>)</li>' +
            '<li data="all">全部(<c>12</c>)</li>' +
            '<li data="80">化学类(<c>12</c>)</li>' +
            '<li data="81">心理学类(<c>1068</c>)</li>' +
            '<li data="85">地质类(<c>1068</c>)</li>' +
            '<li data="all" class="">全部(<c>1068</c>)</li>' +
            '<li data="80">化学类(<c>35</c>)</li>' +
            '<li data="81">心理学类(<c>35</c>)</li>' +
            '<li data="85">地质类(<c>35</c>)</li>' +
            '<li data="7">药学类(<c>35</c>)</li>' +
            '</ul></div>';
        div += '</div>';
        div += '<div class="sort clearfix hide1">';
        div += '<div class="title">' + (LANG == "EN" ? EN.public.category : "专业分类") + '：</div>';
        div += '<div class="type"><ul class="clearfix">' +
            '<li data="all" class="on">全部(<c>1068</c>))</li>' +
            '<li data="80">化学类(<c>35</c>)</li>' +
            '<li data="81">心理学类(<c>12</c>)</li>' +
            '<li data="85">地质类(<c>20</c>)</li>' +
            '<li data="all" class="">全部(<c>1068</c>))</li>' +
            '<li data="80">化学类(<c>35</c>)</li>' +
            '<li data="81">心理学类(<c>12</c>)</li>' +
            '<li data="85">地质类(<c>20</c>)</li>' +
            '<li data="all" class="">全部(<c>1068</c>))</li>' +
            '<li data="80">化学类(<c>35</c>)</li>' +
            '<li data="81">心理学类(<c>12</c>)</li>' +
            '<li data="85">地质类(<c>20</c>)</li>' +
            '<li data="all" class="">全部(<c>1068</c>))</li>' +
            '<li data="80">化学类(<c>35</c>)</li>' +
            '<li data="81">心理学类(<c>12</c>)</li>' +
            '<li data="85">地质类(<c>20</c>)</li>' +
            '<li data="all" class="">全部(<c>1068</c>))</li>' +
            '<li data="80">化学类(<c>35</c>)</li>' +
            '<li data="81">心理学类(<c>12</c>)</li>' +
            '<li data="85">地质类(<c>20</c>)</li>' +
            '<li data="7">药学类(<c>20</c>)</li>' +
            '</ul></div>';
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
        //选择专业分类
        onChoicetype()
        onGetContent()
    }
    setSearchForm();

    function onChoice() {
        $(".list ul").on('click', 'li', function() {
            $(this).addClass("on").siblings().removeClass("on")
        })
    }

    //选择专业分类

    function onChoicetype() {
        $(".type ul").on('click', 'li', function() {
            $(this).addClass("on").siblings().removeClass("on")
        })
    }


    /**
     * 级别
     */
    $(".proLevel li").on('click', function() {
        $(this).addClass("on").siblings().removeClass("on");
    });

    /**
     * 获奖年份
     */

    $(".prizeYear li").on('click', function() {
        $(this).addClass("on").siblings().removeClass("on");
    });

    /**
     * 申报年份
     */

    $(".declareYear li").on('click', function() {
        $(this).addClass("on").siblings().removeClass("on");

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
    }

    setSort(0);

    function onGetContent() {

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
    }

});