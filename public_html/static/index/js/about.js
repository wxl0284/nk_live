/**
 * 关于我们
 */
X.sub("init", function() {
    /*检查当前语言*/
    function checkLang() {
        if (LANG == "EN") {
            document.title = EN.about.title;
            $(".top").css({
                background: "url(/static/index/images/bg2.jpg) no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }).hide();
            $("body").css({
                background: "inherit"
            });
            $(".center_content .top .cover").css({
                opacity: "0.15",
                filter: "alpha(opacity = 15)"
            });
            $(".intro,.top-icons,.toptxt").hide();

            var div = '';
            div += '<div class="en_content">';
            div += '<p class="title">' + (EN.about.title) + '</p>';
            div += '<p class="txt">' + (EN.about.content) + '</p>';
            div += '</div>';
            $(".center_content").append(div);
        }
    }
    checkLang();

    function changeText() {
        var div = '';
        div += '<p>实验空间（www.ilab-x.com）——国家虚拟仿真实验教学项目共享平台，是全球第一个汇聚全部学科专业、覆盖各个层次高校、直接服务于学生和社会学习者使用的实验教学公共服务平台，是国家虚拟仿真实验教学项目共享服务体系建设支撑平台。</p>';
        div += '<p>为推进国家虚拟仿真实验教学项目的开放共享和高效利用，提升国家项目在应用中的效果与效能，按照共享资源的服务范围以及空间联系，实验空间将打造国家、省、校三级共享应用服务体系，形成脉络分明的有机整体，达到项目广泛共享的最终目标。</p>';
        div += '<p>每个虚拟仿真实验教学项目都会呈现：完整的宣传片、详尽的实验项目说明、无缝对接的实验跳转，力求给参与者提供一个简洁便利的实验通道。</p>';
        div += '<div class="img-ctn"><img src="/static/index/pic/about_chart.png"></div>';
        $(".intro .about-bottom-ctn1 .content").html(div);
    }
    changeText();

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