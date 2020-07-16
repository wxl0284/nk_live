/**
 * My module:
 * 个人中心
 */
X.sub("init", function() {
    var user = {};
    var url = document.location.href;

    function setCurClass() {
        var ele = $(".my-left li");
        var cls = "cur";
        ele.removeClass(cls);
        if (url.indexOf('/my/profile') !== -1) {
            $(".m-li1").addClass(cls);
        } else if (url.indexOf('/change/password') !== -1) {
            $(".m-li2").addClass(cls);
        } else if (url.indexOf('/my/collection') !== -1) {
            $(".m-li3").addClass(cls);
        } else if (url.indexOf('/my/evaluate') !== -1) {
            $(".m-li4").addClass(cls);
        } else if (url.indexOf('/my/audit') !== -1) {
            $(".m-li6").addClass(cls);
        } else if (url.indexOf('/before/project') !== -1) {
            $(".m-li7").addClass(cls);
        } else if (url.indexOf('/my/project') !== -1) {
            $(".m-li8").addClass(cls);
        } else if (url.indexOf('/teacher/info') !== -1) {
            $(".m-li9").addClass(cls);
        } else if (url.indexOf('/my/experiment') !== -1) {
            $(".m-li10").addClass(cls);
        } else if (url.indexOf('/my/class') !== -1) {
            $(".m-li11").addClass(cls);
        } else if (url.indexOf('/my/order/notice') !== -1) {
            $(".m-li12").addClass(cls);
        } else if (url.indexOf('/my/expOrder') !== -1) {
            $(".m-li13").addClass(cls);
        }
    }

    X.sub('userLogged', function(evt, resp) {
        user = resp;
        X.post('/user/api/has/proj', {}, function(res) {
            res = JSON.parse(res);
            user.headPath = user.headPath || "";
            var _imgs = user.headPath.split("=");
            var hm = "";
            hm += '<img src="/imgview/' + (_imgs[1] || "") + '_36x36.jpg" width="36" height="36" onerror="this.src=\'/images/user.png\'" />';
            hm += '<span style="margin-top:5px;display:inline-block;">' + (user.name || user.username || "") + '</span>';
            $(".t-user").html(hm);
            var lm = '';
            lm += '<li class="m-li1 cur"><i class="iconfont icon-wode">&#xe609;</i>';
            lm += '<a href="/my/profile">' + (LANG == "EN" ? EN.my.myInfo : "我的信息") + '</a>';
            lm += '</li>';
            lm += '<li class="m-li2"><i class="iconfont icon-chugui2">&#xe66e;</i>';
            lm += '<a href="/change/password">' + (LANG == "EN" ? EN.my.changePWD : "修改密码") + '</a>';
            lm += '</li>';
            if (user.role == 1 || user.role == 5 || user.role == 6 || user.role == 7 || user.role == 9 || user.role == 10) {
                lm += '<li class="m-li5 master"><i class="iconfont icon-set">&#xe8eb;</i>';
                lm += '<a href="/admin/project">后台管理</a>';
                lm += '</li>';
            } else {
                if (user.role == 11) { //国际用户
                    lm += '<li class="m-li3"><i class="iconfont icon-star-hollow">&#xe707;</i>';
                    lm += '<a href="/my/collection">' + (LANG == "EN" ? EN.my.myCollect : "我的收藏") + '</a>';
                    lm += '</li>';
                    lm += '<li class="m-li8"><i class="iconfont icon-555">&#xe65c;</i>';
                    lm += '<a href="/my/project/learn">' + (LANG == "EN" ? EN.my.myProjects : "我的项目") + '</a>';
                    lm += '</li>';
                } else {
                    lm += '<li class="m-li3"><i class="iconfont icon-star-hollow">&#xe707;</i>';
                    lm += '<a href="/my/collection">' + (LANG == "EN" ? EN.my.myCollect : "我的收藏") + '</a>';
                    lm += '</li>';
                    lm += '<li class="m-li4"><i class="iconfont icon-555">&#xe6f5;</i>';
                    lm += '<a href="/my/evaluate">我的评价</a>';
                    lm += '</li>';
                    lm += '<li class="m-li8"><i class="iconfont icon-555">&#xe65c;</i>';
                    lm += '<a href="/my/project/learn">' + (LANG == "EN" ? EN.my.myProjects : "我的项目") + '</a>';
                    lm += '</li>';
                }
            }
            if (CHECKROLE(user, "teacher")) {
                if (res.team) {
                    lm += '<li class="m-li7"><i class="iconfont icon-555">&#xe600;</i>';
                    lm += '<a href="/before/project">申报管理</a>';
                    lm += '</li>';
                }
                lm += '<li class="m-li9"><i class="iconfont icon-555">&#xe6db;</i>';
                lm += '<a href="/teacher/info">信息维护</a>';
                lm += '</li>';
                lm += '<li class="m-li10 hide"><i class="iconfont icon-555">&#xe67f;</i>';
                lm += '<a href="/my/experiment">我的实验</a>';
                lm += '</li>';
                lm += '<li class="m-li11 hide"><i class="iconfont icon-555">&#xe68c;</i>';
                lm += '<a href="/my/class">班级管理</a>';
                lm += '</li>';
            }
            if (user.role == "2") { //学生
                lm += '<li class="m-li12"><i class="iconfont icon-555">&#xe60e;</i>';
                lm += '<a href="/my/order/notice">预约通知</a>';
                lm += '</li>';
                lm += '<li class="m-li13"><i class="iconfont icon-555">&#xe61b;</i>';
                lm += '<a href="/my/expOrder">我的预约</a>';
                lm += '</li>';
            }
            if (user.isExpert == 1) {
                lm += '<li class="m-li6"><i class="iconfont icon-555">&#xe81f;</i>';
                lm += '<a href="/my/audit">评审项目</a>';
                lm += '</li>';
            }
            $(".my-left").html(lm);
            if (CHECKROLE(user, "teacher")) {
                getSchool();
            }
            
            if (user.role == 7) {
                $(".my-left li.master>a").attr("href", "/admin/flash");
            }
            
            setCurClass();

            // 左侧菜单最小高度，要撑满一屏
            var h = $(window).height();
            var bh = $("#left-menu").height();
            var nh = $("#north").height();
            var sh = $("#south").height();
            var cpt = parseInt($("#center").css("padding-top"));
            var cpb = parseInt($("#center").css("padding-bottom"));
            var mmt = parseInt($("#left-menu").css("margin-top"));
            var mmb = parseInt($("#left-menu").css("margin-bottom"));

            if (bh < (h - nh - sh - cpt - cpb - mmt - mmb)) {
                $("#left-menu .menu-wrap").css("min-height", h - nh - sh - cpt - cpb - mmt - mmb - 5);
            }
            // 右侧内容最小高度
            $(".center_content").css("min-height", $("#left-menu").height() - 40);

        });

    });
    
    function getSchool() {
        X.get('/json/school?id=' + user.school, function(res) {
            res = JSON.parse(res);
            if (res && res.hasCloud === 1) {
                $('.m-li10, .m-li11').removeClass('hide');
            }
        });
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