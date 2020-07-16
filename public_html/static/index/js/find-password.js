/**
 * My module:
 *  使用手机号找回密码
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
    var rand;
    var t = 0;
    // var tip = "请输入绑定的手机号";
    var tip = "选择找回密码方式";
    var regMethod = "1";
    if (LANG == "EN") {
        tip = EN.findPwd.findWay;
    }
    $(".main .tip").text(tip);
    $(".step0").show();
    // $(".step1").hide();

    /*检查当前语言*/
    function checkLang() {
        if (LANG == "EN") {
            document.title = EN.findPwd.title;
            $(".word span").text(EN.findPwd.title);
            $(".tab1").text(EN.findPwd.mobileWay);
            $(".tab2").text(EN.findPwd.mailWay);
            $("input[name='phone']").attr("placeholder", EN.my.mobile);
            $("input[name='email']").attr("placeholder", EN.register.typeEmail);
            $("input[name='code']").attr("placeholder", EN.login.verificationTip);
            $(".sendCode1").text(EN.register.getCode).css({
                lineHeight: "1.2em",
                padding: "4px 0",
                height: "34px"
            });
            $("#submitBtn").val(EN.register.nextStep);
            $("input[name='password']").attr("placeholder", EN.my.newPwd);
            $("input[name='password2']").attr("placeholder", EN.my.confirmPwd);
            $("#submitBtn2").val(EN.public.submit);
            var div = '';
            div += '<p>1、' + EN.register.pwdLength + '</p>';
            div += '<p>2、' + EN.register.pwdContent + '</p>';
            div += '<p>3、' + EN.register.notEmailPwd + '</p>';
            $(".tip2").html(div);
        }
    }
    checkLang();

    /*选择找回密码方式*/
    $(".reg-tab .tab").on("click", function() {
        $(this).addClass("on").siblings().removeClass("on");
        if ($(this).index() === 0) {
            regMethod = "1";
            if (LANG == "EN") {
                tip = EN.findPwd.enterBindMobile;
            } else {
                tip = "请输入绑定的手机号";
            }
            $(".email-reg").hide();
            $(".phone-reg").show();
        } else {
            regMethod = "2";
            if (LANG == "EN") {
                tip = EN.findPwd.enterBindMail;
            } else {
                tip = "请输入绑定的邮箱";
            }
            $(".email-reg").show();
            $(".phone-reg").hide();
        }
        $(".main .tip").text(tip);
        $(".step0").hide();
        $(".step1").show();
    });

    /**
     * 手机号验证
     */
    $(".sendCode1").on("click", function() {
        if (!isSend) {
            return;
        }
        var f = X('itemForm');
        var phone = "";
        var mail = "";
        if (regMethod == 1) {
            phone = f.phone.value;
            if (phone.length !== 11) {
                if (LANG == "EN") {
                    en_error(EN.register.phoneTip);
                } else {
                    error("请输入正确的手机号");
                }
                return false;
            }
            if (!phone.length || !MOBILE_REG.test(phone)) {
                if (LANG == "EN") {
                    en_error(EN.register.phoneError);
                } else {
                    error("您的手机号填写不正确！");
                }
                return false;
            }
            isSend = false;
            sendSms("/index/login/send", phone, $(".sendCode1"));
        } else {
            email = f.email.value;
            if (!email.length) {
                if (LANG == "EN") {
                    en_error(EN.register.emailError01);
                } else {
                    error("请输入正确的邮箱");
                }
                return false;
            }
            if (!email.length || !EMAIL_REG.test(email)) {
                if (LANG == "EN") {
                    en_error(EN.register.emailTip);
                } else {
                    error("您的邮箱填写不正确！");
                }
                return false;
            }
            isSend = false;
            sendSms("/index/login/send_email", email, $(".sendCode1"));
        }
    });

    /**
     * 发送验证码
     */

    function sendSms(service, val, ele) {
        var item = {};
        if (regMethod == 1) {
            item.phone = val;
        } else {
            item.email = val;
        }
        X.post(service, item, function(response) {
            var res = JSON.parse(response);
            rand = res.data.rand;
            console.log(res);
            if (res.code === 0) {
                if (LANG == "EN") {
                    X.dialog(EN.register.codeSended);
                } else {
                    X.dialog("验证码已发送");
                }
                canver = true;
                var c = 120;
                ele.html(c + (LANG == "EN" ? "S" : "秒")).css({
                    height: "42px",
                    padding: "0",
                    lineHeight: "42px",
                    background: "#999999"
                });
                t = setInterval(function() {
                    --c;
                    if (c <= 0) {
                        isSend = true;
                        if (LANG == "EN") {
                            ele.html(EN.register.getCode).css({
                                lineHeight: "1.2em",
                                padding: "4px 0",
                                height: "34px"
                            });
                        } else {
                            ele.html("获取验证码").css({
                                height: "42px",
                                padding: "0",
                                lineHeight: "42px",
                                background:"#246acb"
                            });
                        }
                        clearInterval(t);
                    }
                    if (c > 0){
                        ele.html(c + (LANG == "EN" ? "S" : "秒")).css({
                        height: "42px",
                        padding: "0",
                        lineHeight: "42px",
                        background: "#999999"
                    });
                    }
                    
                }, 1000); //成功
            } else {
                if (LANG == "EN") {
                    if (res.code == "1") { //验证码获取失败，请重试
                        en_error(EN.register.sendFiled);
                    } else if (res.code == "2") { //用户验证失败，请重试
                        en_error(EN.register.userAuthFailed);
                    } else if (res.code == "4") { //操作过于频繁
                        en_error(EN.register.tooOften);
                    }
                } else {
                    error(res.msg);
                }
                resetVer(ele);
                return;
            }
        });
    }

    //重置验证按钮

    function resetVer(ele) {
        if (LANG == "EN") {
            ele.html(EN.register.getCode).css({
                lineHeight: "1.2em",
                padding: "4px 0",
                height: "34px"
            });
        } else {
            ele.html("获取验证码").css({
                height: "42px",
                padding: "0",
                lineHeight: "42px",
                background:"#246acb"
            });
        }
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
        var f = X("itemForm");
        var item = {};
        if (!submit) {
            email = f.email.value;
            if (!email.length) {
                if (LANG == "EN") {
                    en_error(EN.register.emailError01);
                } else {
                    error("请输入正确的邮箱");
                }
                return false;
            }
            if(rand != $('[name="code"]').val()){
                error("请输入正确的验证码");
                return false;
            }
        }
        submit = true;
        item.regMethod = regMethod;
        if (regMethod == 1) {
            item.phone = f.phone.value;
        } else {
            item.email = f.email.value;
        }
        item.code = f.code.value;
        // if (item.phone.length === 0 || !MOBILE_REG.test(item.phone)) {
        //     error("请输入正确的手机号");
        //     return;
        // }
        // if (item.code.length === 0) {
        //     if (LANG == "EN") {
        //         en_error(EN.login.verificationError);
        //     } else {
        //         error("请输入正确的验证码");
        //     }
        //     return;
        // }
        onSubmit();
        X.post("/index/user/change_password", item, onSubmit);
    });

    function onSubmit() {
        $(".tip").html("请重置你的密码");
        $(".step1").hide();
        $(".step2").show();
        // var resp = JSON.parse(respText);
        // if (resp.code === 0) {
        //     isSend = true;
        //     if (LANG == "EN") {
        //         $(".tip").html(EN.findPwd.resetPwd);
        //     } else {
        //         $(".tip").html("请重置你的密码");
        //     }
        //     $(".step1").hide();
        //     $(".step2").show();
        // } else {
        //     error(resp.msg);
        // }
        // submit = false;
    }

    /**
     * 重置密码
     */
    $("#submitBtn2").click(function() {
        // if (!submit) {
        //     return;
        // }
        submit = false;
        var f = X("itemForm");
        var item = {};
        item.code = f.code.value;
        item.password = f.password.value;
        item.password2 = f.password2.value;
        item.regMethod = regMethod;
        // item.email = regMethod;
        // if (regMethod == 1) {
        //     item.phone = f.phone.value;
        //     if (item.phone.length === 0 || !MOBILE_REG.test(item.phone)) {
        //         if (LANG == "EN") {
        //             en_error(EN.register.phoneTip);
        //         } else {
        //             error("请输入正确的手机号");
        //         }
        //         submit = false;
        //         return;
        //     }
        // } else {
        //     item.email = f.email.value;
        //     if (item.email.length === 0 || !EMAIL_REG.test(item.email)) {
        //         if (LANG == "EN") {
        //             en_error(EN.register.emailError01);
        //         } else {
        //             error("请输入正确的邮箱");
        //         }
        //         submit = false;
        //         return;
        //     }
        // }
        // if (item.code.length === 0) {
        //     if (LANG == "EN") {
        //         en_error(EN.login.verificationError);
        //     } else {
        //         error("请输入正确的验证码");
        //     }
        //     submit = false;
        //     return;
        // }
        if (item.password.length < 8) {
            if (LANG == "EN") {
                en_error(EN.my.newPwdTip01);
            } else {
                error("新密码需大于8位");
            }
            submit = false;
            return false;
        }

        if (item.password.length > 64) {
            if (LANG == "EN") {
                en_error(EN.my.newPwdTip02);
            } else {
                error("新密码需小于64位");
            }
            submit = false;
            return false;
        }

        if (passwordLevel(item.password) != 3) {
            if (LANG == "EN") {
                en_error(EN.my.pwdError);
            } else {
                error("密码不符合规则");
            }
            submit = false;
            return false;
        }

        if (item.password !== item.password2) {
            if (LANG == "EN") {
                en_error(EN.my.pwdNotSame);
            } else {
                error("两次输入的密码不相同");
            }
            submit = false;
            return false;
        }
        // onSubmit2();
        X.post("/index/login/change_password", item, function(respText){
            resp = JSON.parse(respText);
            if (resp.code === 0) {
                if (LANG == "EN") {
                    X.dialog(EN.my.pwdReseted);
                } else {
                    X.dialog("修改成功");
                }
                setTimeout(function() {
                    document.location = "/index/login/index";
                }, 1500);
            } else {
                error(resp.msg);
                submit = false;
            }
        });
        console.log(3);
    });

    function onSubmit2() {
        var resp = JSON.parse(respText);
        if (resp.code === 0) {
            if (LANG == "EN") {
                X.dialog(EN.my.pwdReseted);
            } else {
                X.dialog("修改成功");
            }
            setTimeout(function() {
                document.location = "/login";
            }, 1500);
        } else {
            error(resp.msg);
            submit = false;
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

    //密码等级验证

    function passwordLevel(password) {
        return 3;
        var Modes = 0;
        for (i = 0; i < password.length; i++) {
            Modes |= CharMode(password.charCodeAt(i));
        }
        return bitTotal(Modes);
        //CharMode函数

        function CharMode(iN) {
            if (iN >= 48 && iN <= 57) //数字
                return 1;
            if (iN >= 65 && iN <= 90) //大写字母
                return 2;
            if ((iN >= 97 && iN <= 122) || (iN >= 65 && iN <= 90))
            //大小写
                return 4;
            else
                return 8; //特殊字符
        }
        //bitTotal函数

        function bitTotal(num) {
            modes = 0;
            for (i = 0; i < 4; i++) {
                if (num & 1) modes++;
                num >>>= 1;
            }
            return modes;
        }
    }
});