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


    var f = X('loginForm', true);

    $("#loginBut").on("click",function(e) {
        if (!f.phone.value) {
            X.error("请输入手机号/用户名/邮箱");
            return;
        }
        if (!f.password.value) {
            X.error("请输入密码");
            return;
        }
        var item = {};
        item.phone = f.phone.value;
        item.password = f.password.value;
        X.post("/index/login/login_up", item, function(resp) {
            resp = JSON.parse(resp);
            if (resp.code !== 200) {
                error("账号或密码错误");
                return false;
            } else {
                window.location = '/';
                // login(resp.result, f.password.value);
            }
        });
    });

    function loginFun() {
        if (!canLogin) {
            return;
        }
        
    }

    function error(msg) {
        var obj = {};
        obj.title = "提示";
        obj.msg = '<p>' + msg + '</p>';
        obj.noCancel = true;
        obj.okText = "确定";
        X.pub('showDialog', obj);
        submit = false;
        isSend = true;
        X.pub("closeLoading");
    }

});