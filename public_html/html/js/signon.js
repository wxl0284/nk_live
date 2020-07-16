/**
 * My module:
 *  登录
 */
X.sub("init", function() {
    // $(".login_item").eq(0).html('<input class="ipt" id="user" type="text" name="phone" placeholder="手机号/用户名" required="" autofocus="" />');
    // $(".login_item").eq(1).html('<input class="ipt" type="password" name="password" placeholder="密码" required="" />');
    //placeholder
    $('input[type=password],input[type=text],input[type=email],input[type=search],textarea').placeholder({
        isUseSpan: true
    });
    // 参数
    var isNeedVerify = false;
    var canLogin = true;
    var NOTICE_TYPE = ["", "更新通知"];
    var EN_NOTICE_TYPE = ["", "Update Notice"];
    var path = window.location.pathname;

    //设置页面高度

    function setHeight() {
        var ph = $(window).height();
        var mh = (ph - 148 - 165);
        if (mh < 420) {
            mh = 420;
        }
        $("#center").css("min-height", mh);
    }

    setHeight();

    $(window).resize(function() {
        setHeight();
    });

    /*检查当前语言*/
    function checkLang() {
        if (LANG == "EN") {
            document.title = EN.login.title;
            $(".login_title").text(EN.login.logTitle);
            $(".login_btn").text(EN.login.btnLogin);
            $(".login_resigter a").text(EN.login.btnLogon);
            $(".login_remenber a").text(EN.login.btnForgetPWD);
            $("#user").attr("placeholder", EN.login.account);
            $("#password").attr("placeholder", EN.login.password);
            $(".verify").attr("placeholder", EN.login.verification);
        }
    }
    checkLang();

    function onGetSession(respText) {
        // alert(respText);
        var resp = JSON.parse(respText);

        if (resp.username) {
            loadNotices();
        }
    }

    /*获取通知*/
    var start = 1;

    function loadNotices() {
        X.get("/json/update/notices?sortby=id&reverse=true&status=1&isExpire=2&limit=1&start=" + start, function(resp) {
            resp = JSON.parse(resp);
            resp.meta = resp.meta || {
                total: "0",
                size: "0"
            };
            if (resp.meta && resp.meta.total != "0") {
                var item = resp.data[0];
                var noticeTotal = parseInt(resp.meta.total);
                var curTime = new Date().getTime();
                var div = '<div class="dialog_bg"></div>';
                div += '<div class="dialog_box">';
                div += '<p class="dialog_top">' + (LANG == "EN" ? (EN_NOTICE_TYPE[item.type] || "Notice") : (NOTICE_TYPE[item.type] || "通知")) + '<span class="close_dialog btn_close">&times;</span></p>';
                div += '<div class="dialog_content">';
                div += '<h2 class="dialog_title">' + (item.title || "-") + '</h2>';
                div += '<ul class="content_list">';
                div += '<li><strong class="content_title">' + (LANG == "EN" ? EN.public.startTime : "开始时间") + '：</strong>' + (moment(item.startTime).format("YYYY-MM-DD HH:mm:ss") || "-") + '</li>';
                div += '<li><strong class="content_title">' + (LANG == "EN" ? EN.public.endTime : "结束时间") + '：</strong>' + (moment(item.endTime).format("YYYY-MM-DD HH:mm:ss") || "-") + '</li>';
                div += '<li><strong class="content_title">' + (LANG == "EN" ? EN.public.noticeContent : "通知内容") + '：</strong>' + (item.content || "-") + '</li>';
                div += '</ul>';
                div += '<button class="close_dialog dialog_btn btn_confirm">' + (LANG == "EN" ? EN.public.confirm : "确认") + '</button>';
                div += '</div>';
                div += '</div>';
                if (curTime <= item.endTime) {
                    $("body").append(div);
                    $(".dialog_bg,.dialog_box").fadeIn('fast');
                    $(".close_dialog").off('click').on('click', function() {
                        $(".dialog_bg,.dialog_box").hide().remove();
                        goAnyway();
                    });
                } else {
                    goAnyway();
                }
            } else {
                goAnyway();
            }
        });
    }

    // 跳转

    function goAnyway() {
        if (X.qs.ref) {
            window.location = decodeURIComponent(X.qs.ref);
        } else {
            window.location = '/';
        }
    }

    function checkSession() {
        if (X.cookie.get('xsid')) {
            X.get("/user/session?xsid=" + X.cookie.get('xsid'), onGetSession);
        }
    }

    var f = X('loginForm', true);
    var logBut = X('loginBut', true);
    logBut.addEventListener("click", function(e) {
        e.preventDefault();
        loginFun();
    }, false);

    $("input").keyup(function(e) {
        if (e.keyCode == 13) {
            loginFun();
        }
    });

    function loginFun() {
        if (!canLogin) {
            return;
        }
        if (!f.phone.value) {
            if (LANG == "EN") {
                en_error(EN.login.accountTip);
            } else {
                X.error("请输入手机号/用户名/邮箱");
            }
            return;
        }
        if (!f.password.value) {
            if (LANG == "EN") {
                en_error(EN.login.passwordTip);
            } else {
                X.error("请输入密码");
            }
            return;
        }
        if (MOBILE_REG.test(f.phone.value)) {
            X.post("/api/nologin/user/check/members?mobile=" + f.phone.value, {}, function(resp) {
                resp = JSON.parse(resp);
                if (resp.code !== 0) {
                    loginByUsername();
                    return;
                } else {
                    login(resp.username, f.password.value);
                }
            });
        } else if (EMAIL_REG.test(f.phone.value)) {
            X.post("/api/nologin/user/check/members/email?email=" + f.phone.value, {}, function(resp) {
                resp = JSON.parse(resp);
                if (resp.code !== 0) {
                    loginByUsername();
                    return;
                } else {
                    login(resp.username, f.password.value);
                }
            });
        } else {
            loginByUsername();
        }
    }

    function loginByUsername() {
        X.post("/api/nologin/user/check/members/username?username=" + encodeURI(f.phone.value), {}, function(resp) {
            resp = JSON.parse(resp);
            if (resp.code !== 0) {
                if(LANG == "EN"){
                    en_error(EN.public.submitError+"("+resp.msg+")");
                }else{
                    X.error(resp.msg);
                }
                return;
            } else {
                login(f.phone.value, f.password.value);
            }
        });
    }

    function login(username, password) {
        var cred = {};
        cred.username = encodeURI(username);
        cred.password = password;
        cred.onLoginResponse = onLoginResponse;
        logBut.innerHTML = '<img src="/images/loaderBgWhite.gif"/>';
        if (isNeedVerify) {
            if (!f.verify.value) {
                if (LANG == "EN") {
                    logBut.innerHTML = EN.public.login;
                    en_error(EN.login.verificationTip);
                } else {
                    logBut.innerHTML = '登录';
                    X.error("请填写验证码");
                }
                return;
            }
            var req = {
                key: $(".verify-code").attr("data-key"),
                captcha: f.verify.value
            };
            X.post("/captcha/c", req, function(resp) {
                resp = JSON.parse(resp);
                if (resp.code === 0) {
                    cred.captchaToken = resp.captchaToken;
                    X.pub('login', cred);
                } else {
                    if (LANG == "EN") {
                        logBut.innerHTML = EN.public.login;
                        en_error(EN.login.verificationError);
                    } else {
                        logBut.innerHTML = '登录';
                        X.error("验证码错误");
                    }
                }
            });
        } else {
            X.pub('login', cred);
        }
    }

    function onLoginResponse(respText) {
        if (LANG == "EN") {
            logBut.innerHTML = EN.public.login;
        } else {
            logBut.innerHTML = '登录';
        }
        var resp = JSON.parse(respText);
        if (resp.code !== 0) {
            if (resp.code === 31) { //验证码
                loadVerify();
            } else {
                if (resp.code === 32) {
                    if (LANG == "EN") {
                        en_error(EN.login.lockedTip);
                    } else {
                        X.error("账号被锁定，30分钟后自动解锁");
                    }
                    canLogin = false;
                } else {
                    if (LANG == "EN") {
                        en_error(EN.login.loginError);
                    } else {
                        X.error("用户名或密码错误，请重新输入");
                    }
                }
                if (isNeedVerify) {
                    loadVerify();
                }
            }
            return;
        }
        X.pub('checkSession', '');
        var sid = X.cookie.get('xsid');
        X.cookie.add('xsid', sid, 7);
        checkSession();
    }

    // 验证码

    function loadVerify() {
        isNeedVerify = true;
        $(".item-verify").show();
        $("input.verify").val("");
        X.get("/captcha/c", function(jresp) {
            jresp = JSON.parse(jresp);
            if (LANG == "EN") {
                $(".verify-code").attr({
                    "data-key": jresp.key,
                    "title": EN.login.changeCodeTip
                }).html('<img src="' + jresp.img + '" />');
            } else {
                $(".verify-code").attr({
                    "data-key": jresp.key,
                    "title": "看不清，换一个"
                }).html('<img src="' + jresp.img + '" />');
            }
        });
    }

    $("#loginForm .verify-code").on("click", function() {
        loadVerify();
    });
});