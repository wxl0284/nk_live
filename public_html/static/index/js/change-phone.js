/**
 * My module:
 *  更换手机号
 */
X.sub("init", function() {
    var h = $(window).height();
    var h1 = $("#north").height();
    var h2 = $("#south").height();
    $("#center").css({
        "min-height": (h - h1 - h2)
    });

    var submit = false;
    var isver = false;
    var isSend = true;
    var canver = false;
    var t = 0;
    var user = {};
    $(".step1").show();
    //检查是否登录
    X.sub('userLogged', function(evt, respText) {
        user = respText;
        user.mobile = user.mobile || "";
        if (!user.mobile.length) {
            document.location = "/";
        }
        $(".tip").html("请验证原手机号");
        if (user.mobile.length) {
            var aForm = X('itemForm');
            aForm.phone.value = user.mobile.substr(0, 3) + '****' + user.mobile.substr(7);
        }
    });

    /**
     * 手机号验证
     */
    $(".sendCode1").on("click", function() {
        if (!isSend) {
            return;
        }
        var aForm = X('itemForm');
        /* var phone = user.mobile; */
        var phone=$("input[name='phone']").val();
        if (phone.length != 11) {
            error("请输入正确的手机号");
            return false;
        }
        if (!phone.length || !MOBILE_REG.test(phone)) {
            error("您的手机号填写不正确！");
            return false;
        } else {
            isSend = false;
            sendSms("/sms/api/change/phone/send", phone, $(".sendCode1"));
        }
    });

    /**
     * 发送验证码
     */

    function sendSms(service, phone, ele) {
        var item = {};
        item.phone = phone;
        X.post(service, item, function(response) {
            var res = JSON.parse(response);
            if (res.code === 0) {
                X.dialog("验证码已发送");
                canver = true;
                var c = 120;
                ele.html(c + "秒");
                t = setInterval(function() {
                    ele.html(c + "秒");
                    --c;
                    if (c <= 0) {
                        isSend = true;
                        ele.html("获取验证码");
                        clearInterval(t);
                    }
                }, 1000); //成功
            } else {
                error(res.msg);
                resetVer(ele);
                return;
            }
        });
    }

    //重置验证按钮

    function resetVer(ele) {
        ele.html("获取验证码");
        isver = false;
        isSend = true;
        canver = false;
        clearInterval(t);
        t = 0;
    }
    
    /**
     * 验证原手机号
     */
    $("#submitBtn").click(function() {
        if (submit) {
            return;
        }
        submit = true;
        var f = X("itemForm");
        var item = {};
        item.phone = user.mobile;
        item.code = f.code.value;
        // if (item.phone.length === 0 || !MOBILE_REG.test(item.phone)) {
        //     error("请输入正确的手机号");
        //     return;
        // }
        if (item.code.length === 0) {
            error("请输入正确的验证码");
            return;
        }
        X.post("/user/api/check/oldphone", item, onSubmit);
    });

    function onSubmit(respText) {
        var resp = JSON.parse(respText);
        if (resp.code === 0) {
            isSend = true;
            $(".tip").html("请输入新手机号并绑定");
            $(".step1").hide();
            $(".step2").show();
        } else {
            error(resp.msg);
        }
        submit = false;
    }
    
    /**
     * 新手机号发送验证码
     */
    $(".sendCode2").on("click", function() {
        if (!isSend) {
            return;
        }
        var aForm = X('itemForm');
        var phone = aForm.phone2.value;
        if (phone.length !== 11) {
            error("请输入正确的手机号");
            return false;
        }
        if (!phone.length || !MOBILE_REG.test(phone)) {
            error("您的手机号填写不正确！");
            return false;
        } else {
            isSend = false;
            sendSms("/sms/api/band/phone/send", phone, $(".sendCode2"));
        }
    });
    
    /**
     * 绑定新手机号 
     */
    $("#submitBtn2").click(function() {
        if (submit) {
            return;
        }
        submit = true;
        var f = X("itemForm");
        var item = {};
        item.phone = f.phone2.value;
        item.code = f.code2.value;
        item.oldPhone = user.mobile;
        item.code1 = f.code.value;
        if (item.phone.length === 0 || !MOBILE_REG.test(item.phone)) {
            error("请输入正确的手机号");
            return;
        }
        if (item.code.length === 0) {
            error("请输入正确的验证码");
            return;
        }
        X.post("/user/api/change/phone", item, onSubmit2);
    });

    function onSubmit2(respText) {
        var resp = JSON.parse(respText);
        if (resp.code === 0) {
            X.dialog("修改成功");
            setTimeout(function() {
                document.location = "/";
            }, 1500);
        } else {
            error(resp.msg);
        }
    }

    function error(msg) {
        var obj = {};
        obj.title = "Error";
        obj.msg = '<p>' + msg + '</p>';
        obj.noCancel = true;
        X.pub('showDialog', obj);
        submit = false;
    }
});