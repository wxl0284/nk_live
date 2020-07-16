// session
X.sub("init", function() {
    var profile = {};
    var group; //角色
    var path = window.location.pathname;
    var url = window.location.href;
    
    function showLayout() {
        $("#layout").css("visibility", "visible");
    }

    function toLogin() {
        if (path.indexOf("/declare") != -1) {
            // 判断不同角色退出后显示的登录界面
            if (X.qs.ref) {
                window.location = '/declare/login';
            } else {
                var uri = encodeURIComponent(url);
                window.location = '/declare/login';
            }
        } else {
            // 判断不同角色退出后显示的登录界面
            if (X.qs.ref) {
                window.location = '/login?ref=' + X.qs.ref;
            } else {
                var uri = encodeURIComponent(url);
                window.location = '/login?ref=' + uri;
            }
        }
    }

    function onGetSession(respText) {
        var resp = JSON.parse(respText);

        if (resp.code && resp.code != '0') {
            toLogin();
            return;
        }
        X.post('/user/api/get', {}, function(respText) {
            // alert(respText);
            var u = JSON.parse(respText);
            profile = u || {};
            profile.id = resp.id;
            profile.group = resp.group;
            group = resp.group;
            if (!u.registerOrigin && !u.mobile && (u.role == 2 || u.role == 3)) {
                profile.registerOrigin = 1;
                profile.isFirstLog = 1;
            }

            //判断是否有权限
            if (path.indexOf("/admin/") !== -1) {
                if (profile.role != 1 && profile.role != 5 && profile.role != 6 && profile.role != 7 && profile.role != 9 && profile.role != 10) {
                    if(LANG == "EN"){
                        X.dialog(EN.public.noAccess);
                    }else{
                        X.dialog("无权限");
                    }
                    setTimeout(function() {
                        window.location.href = "/";
                    }, 1000);
                    return;
                }
            }

            showLayout();
            isTeacherLogged(u);
            displayProfile(profile);
            jumpOut(120); // 单位：分钟
            X.pub('userLogged', profile);
        });
    }

    /*判断教师用户是否为首次登录*/
    function isTeacherLogged(user) {
        var uri = encodeURIComponent(url);
        if(user.registerOrigin == 1 && user.isFirstLog == 1 && url.indexOf("/bind/phone") == -1){
            if (path.indexOf("/declare") != -1) {
                window.location = '/declare/bind/phone';
            } else {
                window.location = '/bind/phone';
            }
        }else if(user.registerOrigin != 1 || user.isFirstLog != 1){
            if (CHECKROLE(user, "teacher") && !(user.education) && url.indexOf("/teacher/info") == -1) {
                if (path.indexOf("/declare") != -1) {
                    window.location = '/declare/teacher/info';
                } else {
                    window.location = '/teacher/info';
                }
            }
        }
        /*if(user.registerOrigin == 1 && user.isFirstLog == 1 && url.indexOf("/bind/phone") == -1){
            window.location = '/bind/phone?ref=' + uri;
        }else{
            if (CHECKROLE(user, "teacher") && !(user.education) && url.indexOf("/teacher/info") == -1) {
                window.location = '/teacher/info?ref=' + uri;
            }
        }*/
    }
    
    //判断用户有没有操作页面
   	function jumpOut(time) {
        var userTime = (time || 60) * 60; // 单位：秒
        var objTime = {
            init:0,
            time:function(){
                objTime.init += 1;
                /*if(userTime - objTime.init == 3){
                    X.dialog("您还在电脑前吗？（用户将在3秒后退出）");
                }*/
                if(objTime.init == userTime){
                    X.post("/signoff?xsid=" + X.cookie.get('xsid'), null, onLogoff);
                    // X.cookie.rm('xsid');
                }
            },
            eventFun:function(){
                clearInterval(testUser);
                objTime.init = 0;
                testUser = setInterval(objTime.time,1000);
            }
        };
        var testUser = setInterval(objTime.time,1000);
        var body = document.querySelector('html');
        body.addEventListener("touchstart",objTime.eventFun);
        body.addEventListener("click",objTime.eventFun);
        body.addEventListener("keyup",objTime.eventFun);
        body.addEventListener("mousemove",objTime.eventFun);
	}
	
    function reject() {
        var msg = "";
        if(LANG == "EN"){
            msg = EN.public.noPermission;
        }else{
            msg = '无权限访问此页面';
        }
        var obj = {};
        obj.type = "1";
        obj.msg = msg;
        obj.callback = function() {
            X.post("/signoff?xsid=" + X.cookie.get('xsid'), null, onLogoff);
        };
        X.pub("showDialog", obj);
    }

    function checkSession() {
        if (X.cookie.get('xsid')) {
            X.get("/user/session?xsid=" + X.cookie.get('xsid'), onGetSession);
        } else {
            toLogin();
        }
    }
    checkSession();


    //已登录显示

    function displayProfile(resp) {
        var res = "";
        // if (resp.role == 1) {
        //     res += '<span id="import"><a href="/admin/flash">进入后台</a><span class="line">|</span></span>';
        // }
        res += '<div class="people">';
        if(LANG == "EN"){
            res += '<a href="#" id="signOff">'+EN.public.logout+'</a>';
        }else{
            res += '<a href="#" id="signOff">退出</a>';
        }
        resp.name = resp.name || "";
        var nameLength = (resp.name) ? resp.name.length: resp.username.length;
        var CN_CHAR = resp.name.match(/[^\x00-\x80]/g);
        if (CN_CHAR) {
            nameLength = CN_CHAR.length * 2;
        }
        if (nameLength > 6) {
            res += '<a href="/my/profile" id="username" style="width:50px;font-size:12px;line-height:1.3;text-align:left;margin-top:25px;transform:scale(0.9);word-break:break-all;">' + (resp.name || resp.username || "未知") + '</a>';
        } else {
            res += '<a href="/my/profile" id="username">' + (resp.name || resp.username || "未知") + '</a>';
        }
        resp.headPath = resp.headPath || "";
        var _imgs = resp.headPath.split("=");
        res += '<img class="pic" src="/imgview/' + (_imgs[1] || "") + '_30x30.jpg" onerror="this.src=\'/images/user.png\'" /> ';
        // res += '<div class="topmenu"><ul><li><a href="/person">个人信息</a></li><li><a href="/change/password">修改密码</a></li>';
        // if (resp.role == 1) {
        //     res += '<li><a href="/admin/flash">后台管理</a></li>';
        // }
        // res += '<li><a href="#" id="signOff">退出</a></li>';
        // res += '</ul></div>';
        res += '</div>';

        $("#user-info").html(res);
    }



    // 退出

    $("body").on("click", "#signOff", function(e) {
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