/**
 * My module:
 *  description about what it does
 */
X.sub("init", function() {
    //fill in your code here
    //显示账户名  
    var user;
    var subject = subjects; //24个学科分类
    console.log(subject);

    X.sub('userLogged', function(evt, respText) {
        user = respText;
    });

    // 检查当前语言

    function checkLang() {
        if (LANG == "EN") {
            subject = en_subjects;
            $("body").addClass("en-lang");
            $(".ns1 img").attr("src", "/images/en_ns1.png");
            $(".ns2 img").attr("src", "/images/en_ns2.png");
            var div = '';
            div += '<p>';
            // div += '<span>' + (EN.public.directedBy) + '</span>';
            // div += '<span>' + (EN.public.techSupport) + '</span>';
            div += '<span>' + (EN.public.hostedBy) + '</span>';
            div += '<span>' + (EN.public.copyright) + '</span>';
            // div += '<span class="iconfont wechat">'+(EN.public.followUs)+': <i>&#xe615;</i> '+(EN.public.wechat);
            // div += '<span class="wechat-img">';
            // div += '<img src="/images/wechat.png" alt="'+(EN.public.wechatCode)+'" />';
            // div += '<!--<span class="img-title">ilabx实验空间</span>-->';
            // div += '<!--<span class="img-text">微信扫描二维码，关注我的公众号</span>-->';
            // div += '</span>';
            // div += '</span>';
            div += '<a href="/contact" class="contactUs"><span>' + (EN.public.contactUs) + '</span></a>';
            div += '</p>';
            $(".bottom").html(div);

            $("#changeLang").text("中文");
            $("#changeLang").data("lang", "CN");
            $(".ns1,.ns2,.ns3").hide(); // 英文版下隐藏header上2017年项目认定页入口和2018项目公示入口
            $(".changeLang").addClass("before");
            $(".bottom p>span").css({
                marginRight: "12px"
            });

            $(".nav_item:eq(4)").hide();
        } else {
            $("#changeLang").text("English");
            $("#changeLang").data("lang", "EN");
            $(".changeLang").addClass("before");
            $(".ns1,.ns3").show();
        }
        $("#changeLang").off('click').on('click', function() {
            X.cookie.add('lang', $(this).data("lang"));
            window.location.href = "/";
        });
        // $(".wechat").hover(function() {
        //     $(".wechat-img").stop().fadeIn('fast');
        // }, function() {
        //     $(".wechat-img").stop().fadeOut('fast');
        // });
    }

    onChoicetype(); //专业分类

    function onChoicetype() {
        
        var div = '';
        div += '<div class="changeLang">';
        div += '</div>';
       //var res = '';
        X.get('/index/index/navigation', function(respText) {
            var resp = JSON.parse(respText);
            resp = resp.result;
            var res = '';
            for(var m=0;m<resp.length;m++){
                if(m == 1){
                    res += '<li class="nav_item" id="subsLink"><a href="'+resp[m].link_url+'">'+resp[m].name+'</a><ul class="subjects-box"></ul></li>';
                }else{
                    res += '<li class="nav_item"><a href="'+resp[m].link_url+'">'+resp[m].name+'</a></li>';
                }
            }
            $("#menu").html(res);
            $(".nav").find(".changeLang").remove();
            $(".nav-right").prepend(div);
            checkLang();
            onSubjectContent();
        })

        // res += '<li class="nav_item"><a href="/">首页</a></li>';
        // res += '<li class="nav_item" id="subsLink">';
        // res += '<a href="/index/subject/index">学科分类</a>';
        // res += '<ul class="subjects-box"></ul>';
        // res += '</li>';
        // res += '<li class="nav_item"><a href="/index/article/intro">项目介绍</a></li>';
        // res += '<li class="nav_item"><a href="/index/article/about">关于我们</a></li>';
        // $("#menu").html(res);
        // $(".nav").find(".changeLang").remove();
        // $(".nav-right").prepend(div);
        // checkLang();
        // onSubjectContent();
    }

    function onSubjectContent() {
        var result = [];
        for (var i = 0, size = subject.length; i < size; i += 6) {
            result.push(subject.slice(i, i + 6));
        }
        result.reverse();
        for (var i = 0, size = result.length; i < size; i++) {
            result[i].reverse();
        }
        var lk = '';
        lk += '<div class="bubbleTail"></div>';
        for (var i = 0; i < result.length; i++) {
            for (var j = 0; j < result[i].length; j++) {
                var item = result[i][j];
                if (j == 0 || j == 1 || j == 2) {
                    lk += '<li><a href="javascript:void(0);" onclick="X.pub(\'getMenuSubject\',\'' + item.id + '\')">' + item.cat_name + '</a></li>';
                } else {
                    lk += '<li><a href="javascript:void(0);" onclick="X.pub(\'getMenuSubject\',\'' + item.id + '\')">' + item.cat_name + '<span class="line"></span></a></li>';
                }
            }
        }
        $('#subsLink .subjects-box').html(lk);
    }

    X.sub("getMenuSubject", function(evt, id) {
        X.get('/index/subject/categorys?id=' + id, function(respText) {
            var resp = JSON.parse(respText);
            resp = resp.result;
            var uri = "/index/subject/index";
            var qt = "";
            if (resp.parent_id == "0") {
                qt = "?sid=" + resp.id;
            } else{
                qt = "?sid=" + resp.parent_id + "&vid=" + resp.id;
            } 
            document.location = uri + qt;
        });
    });

    // 判断申报链接
    if (document.location.href.indexOf("ilab-x.com") === -1) {
        $(".nav .project.ns2").attr("href", "/declare");
    }

    //placeholder
    $('input[type=password],input[type=text],input[type=email],input[type=search],textarea').placeholder({
        isUseSpan: true
    });



});