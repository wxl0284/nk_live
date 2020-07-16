// session
X.sub("init", function() {
    var profile = {};
    var group; //角色
    var path = window.location.pathname;
    var url = window.location.href;

    // var scale = window.innerWidth/1250;
    // document.querySelector('meta[name="viewport"]').setAttribute('content','width=1250,initial-scale=' + scale + ',minimum-scale=' + scale + ',maximum-scale=1.0,user-scalable=yes');

    checkSession();

    function checkSession() {
        if (X.cookie.get('xsid')) {
            X.get("/user/session?xsid=" + X.cookie.get('xsid'), onGetSession);
        } else {
            // toLogin();
            noLogin();
        }
    }

    function onGetSession(respText) {
        var resp = JSON.parse(respText);
        if (resp.code && resp.code != '0') {
            // toLogin();
            noLogin();
            profile.isLog = '-1';
            X.pub('userLogged', profile);
            return;
        }
        X.post('/user/api/get', {}, function(respText) {
            var u = JSON.parse(respText);
            profile = u || {};
            profile.id = resp.id;
            profile.group = resp.group;
            group = resp.group;
            if (!u.registerOrigin && !u.mobile && (u.role == 3 || u.role == 4)) {
                profile.registerOrigin = 1;
                profile.isFirstLog = 1;
            }

            //判断是否有权限
            if (path.indexOf("/admin/") !== -1) {
                if (profile.role != 0 && profile.role != 1 && profile.role != 2) {
                    X.dialog("无权限");
                    setTimeout(function() {
                        window.location.href = "/";
                    }, 1000);
                    return;
                }
            }

            showLayout();
            // isTeacherLogged(u);
            displayProfile(profile);
            jumpOut(120); // 单位：分钟
            X.pub('userLogged', profile);
        });
    }

    function toLogin() {
        // if (path.indexOf("/declare") != -1) {
        //     // 判断不同角色退出后显示的登录界面
        //     if (X.qs.ref) {
        //         window.location = '/declare/login';
        //     } else {
        //         var uri = encodeURIComponent(url);
        //         window.location = '/declare/login';
        //     }
        // } else {
        //     // 判断不同角色退出后显示的登录界面
        //     if (X.qs.ref) {
        //         window.location = '/login?ref=' + X.qs.ref;
        //     } else {
        //         var uri = encodeURIComponent(url);
        //         window.location = '/login?ref=' + uri;
        //     }
        // }
        if (X.qs.ref) {
            window.location = '/login?ref=' + X.qs.ref;
        } else {
            var uri = encodeURIComponent(url);
            window.location = '/login?ref=' + uri;
        }
    }

    //未登录显示

    function noLogin() {
        X.pub("userNotLogin");
        var res = '';
        res += '<a href="login.html" class="to-login">登录</a><span class="line">|</span><a href="register.html" class="to-register">注册</a>';
        $("#user-info").html(res);
    }

    function showLayout() {
        $("#layout").css("visibility", "visible");
    }

    //导航栏高亮显示

    function navHighlight() {
        var pathname = window.location.pathname;
        var am = $('#menu2 li');
        var cls = 'cur';
        am.removeClass(cls);
        var ma = $('#menu2 li a');
        for (var i = 0; i < ma.size(); i++) {
            var m = $('#menu2 li a').eq(i);
            var mas = m.attr('href');
            if (pathname == mas) {
                am.eq(i).addClass(cls);
            } else {
                if (pathname.indexOf('organization') !== -1) {
                    am.eq(2).addClass(cls);
                } else if (pathname.indexOf('introduction') !== -1) {
                    am.eq(1).addClass(cls);
                }
            }
        }
    }
    navHighlight();

    /*判断教师用户是否为首次登录*/
    // function isTeacherLogged(user) {
    //     var uri = encodeURIComponent(url);
    //     if(user.registerOrigin == 1 && user.isFirstLog == 1 && url.indexOf("/bind/phone") == -1){
    //         if (path.indexOf("/declare") != -1) {
    //             window.location = '/declare/bind/phone';
    //         } else {
    //             window.location = '/bind/phone';
    //         }
    //     }else if(user.registerOrigin != 1 || user.isFirstLog != 1){
    //         if (CHECKROLE(user, "teacher") && !(user.education) && url.indexOf("/teacher/info") == -1) {
    //             if (path.indexOf("/declare") != -1) {
    //                 window.location = '/declare/teacher/info';
    //             } else {
    //                 window.location = '/teacher/info';
    //             }
    //         }
    //     }
    // }

    //判断用户有没有操作页面
    function jumpOut(time) {
        var userTime = (time || 60) * 60; // 单位：秒
        var objTime = {
            init: 0,
            time: function() {
                objTime.init += 1;
                /*if(userTime - objTime.init == 3){
                    X.dialog("您还在电脑前吗？（用户将在3秒后退出）");
                }*/
                if (objTime.init == userTime) {
                    X.post("/signoff?xsid=" + X.cookie.get('xsid'), null, onLogoff);
                    // X.cookie.rm('xsid');
                }
            },
            eventFun: function() {
                clearInterval(testUser);
                objTime.init = 0;
                testUser = setInterval(objTime.time, 1000);
            }
        };
        var testUser = setInterval(objTime.time, 1000);
        var body = document.querySelector('html');
        body.addEventListener("touchstart", objTime.eventFun);
        body.addEventListener("click", objTime.eventFun);
        body.addEventListener("keyup", objTime.eventFun);
        body.addEventListener("mousemove", objTime.eventFun);
    }

    function reject() {
        var msg = "";
        msg = '无权限访问此页面';
        var obj = {};
        obj.type = "1";
        obj.msg = msg;
        obj.callback = function() {
            X.post("/signoff?xsid=" + X.cookie.get('xsid'), null, onLogoff);
        };
        X.pub("showDialog", obj);
    }

    //已登录显示

    function displayProfile(resp) {
        var res = "";
        res += '<div class="people">';
        res += '<a href="#" id="signOff">退出</a>';
        resp.name = resp.name || "";
        var nameLength = (resp.name) ? resp.name.length : resp.username.length;
        var CN_CHAR = resp.name.match(/[^\x00-\x80]/g);
        if (CN_CHAR) {
            nameLength = CN_CHAR.length * 2;
        }
        if (nameLength > 10) {
            res += '<a href="/my/profile" id="username" style="width:50px;font-size:12px;line-height:1.3;text-align:left;margin-top:25px;transform:scale(0.9);word-break:break-all;">' + (resp.name || resp.username || "未知") + '</a>';
        } else {
            res += '<a href="/my/profile" id="username">' + (resp.name || resp.username || "未知") + '</a>';
        }
        resp.avatar = resp.avatar || "";
        var _imgs = resp.avatar.split("=");
        res += '<img class="pic" src="' + resp.avatar + '" onerror="this.src=\'/images/user.png\'" /> ';
        res += '</div>';
        $("#user-info").html(res);
    }

    // 退出

    $("body").on("click", "#signOff", function(e) {
        e.preventDefault();
        X.post("/signoff?xsid=" + X.cookie.get('xsid'), null, onLogoff);
    });

    function onLogoff() {
        X.pub('userLogOff', '');
        X.cookie.rm('xsid');
        profile = {};
        if (path.indexOf("/declare") != -1) {
            window.location = '/declare';
            return;
        }
        checkSession();
    }
    X.sub('checkSession', checkSession);

    function error(msg) {
        var obj = {};
        obj.title = "Error";
        obj.msg = '<p>' + msg + '</p>';
        obj.noCancel = true;
        X.pub('showDialog', obj);
    }

});