/**
 * My module:
 *  注册会员
 */
X.sub("init", function() {
    /**
     * 参数
     */
    var sex = 0;
    var submit = false;
    var rp = false;
    var ru = false;
    var psuc = false;
    var usuc = false;
    var loaded = 0;
    var isver = false;
    var isSend = true;
    var canver = false;
    var code = "";
    var t;
    // var MOBILE_REG = /^1[0|1|2|3|4|5|6|7|8|9][0-9]{9}$/;
    // var EMAIL_REG = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var NAME_REG = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
    var shengid; //省id
    var aForm = X('itemForm');
    var loadData = [];
    var loadNum = 0;
    var regMethod = "1";
    var step = 1;

    /**
     * 注册方式的切换
     */
    $(".reg-tab .tab").on("click", function() {
        if (step !== 1) {
            return;
        }
        $(this).addClass("on").siblings().removeClass("on");
        changeRegisterType($(this).index());
    });

    function changeRegisterType(type) {
        type = type || 0;
        var s1 = "添加手机号";
        if (type === 0) { //手机号注册
            regMethod = "1";
            s1 = "添加手机号";
            $(".email-reg").hide();
            $(".phone-reg").show();
        } else { //邮箱注册
            regMethod = "2";
            s1 = "添加邮箱";
            $(".email-reg").show();
            $(".phone-reg").hide();
        }
        $(".register_title .s1").text(s1);
    }
    /**
     * 手机号验证
     **/
    $("#testcode").click(function() {
        var aForm = X('itemForm');
        var phone = "",
            email = "";
        if (regMethod == 1) {
            phone = aForm.phone.value;
            if (phone.length !== 11) {
                error("请输入正确的手机号");
                return false;
            }
            if (!MOBILE_REG.test(phone)) {
                error("您的手机号填写不正确！");
                return false;
            }
        } else {
            email = aForm.regEmail.value;
            if (!email.length) {
                error("请输入正确的邮箱");
                return false;
            }
            if (!EMAIL_REG.test(email)) {
                error("您的邮箱填写不正确！");
                return false;
            }
        }
        if (!isSend) {
            return;
        }
        isSend = false;
        var item = {};
        var uri = "/index/sms/send";
        if (regMethod == 1) {
            item.phone = phone;
           uri = "/index/sms/send";
        } else {
            item.email = email;
           uri = "/email/api/code/send";
        }
        item.action = 0;
        // item.id = id;
        X.post(uri, item, function(resp) {
            resp = JSON.parse(resp);
            if (resp.code !== 0) {
                if (regMethod == "1") {
                    if (resp.code == "1") { //验证码获取失败，请重试
                        error(resp.msg);
                    } else if (resp.code == "4") { //手机号已被绑定
                        error(resp.msg);
                    } else {
                        error(resp.msg);
                    }
                } else {
                    if (resp.code == "1") { //验证码获取失败，请重试
                        error(resp.msg);
                    } else if (resp.code == "2") { //请正确填写邮箱地址
                        error(resp.msg);
                    } else if (resp.code == "3") { //用户验证失败，请重试
                        error(resp.msg);
                    } else if (resp.code == "4") { //操作过于频繁
                        error(resp.msg);
                    } else if (resp.code == "5") { //邮箱已被注册
                        error(resp.msg);
                    } else {
                        error(resp.msg);
                    }
                }
                return false;
            } else {
                // //测试使用
                // $("input[name=code]").val(resp.smscode);
                X.dialog(resp.msg);

                $("#testcode").css({
                    opacity: 1
                });
                $("#testcode").css("background", "#999");
                canver = true;
                var c = 120;
                $("#testcode").html(c + "秒");
                --c;
                t = setInterval(function() {
                    $("#testcode").html(c + "秒");
                    --c;
                    if (c <= 0) {
                        isSend = true;
                        $("#testcode").html("获取验证码").css({
                            "background": "#06c3a6",
                            "color": "#fff"
                        });
                        clearInterval(t);
                    }
                }, 1000); //成功
                return false;
            }
        });
    });

    //重置验证按钮

    function resetVer() {
        $(".cellbutton").show();
        $("#testcode").html("发送").css("background", "#06c3a6");
        $("#testcode").css({
            opacity: 0.6
        });
        isver = false;
        isSend = true;
        canver = false;
        code = "";
        t = 0;
    }

    /*手机号下一步*/
    $("#step1 .next-btn").on("click", function() {
        X.dialogLoading();
        //var uri = "/api/nologin/sms/code/check";
        var item = {};
        item.code = aForm.code.value;
        item.regMethod = regMethod;
        if (regMethod == 1) {
            item.phone = aForm.phone.value;
        } else {
            item.email = aForm.regEmail.value;
            if (!item.email.length) {
                error("请输入正确的邮箱");
                return false;
            }
            if (!EMAIL_REG.test(item.email)) {
                error("您的邮箱填写不正确！");
                return false;
            }
        }

        if (!item.code.length) {
            error("请输入验证码");
            return false;
        }
        // X.post(uri, item, function(resp) {
        //     X.pub("closeLoading");
        //     resp = JSON.parse(resp);
        //     if (resp.code === 0) {
        X.pub("closeDialog");
        setStep(2);
        //     } else {
        //         error(resp.msg);
        //     }
        // });
    });

    /*信息填写上一步,下一步*/
    $("#step2 .pre-btn").on("click", function() {
        setStep(1);
    });

    $("#step2 .next-btn").on("click", function() {
        var item = {};
        item.name = aForm.name.value;
        item.province = aForm.province.value;
        if (regMethod == 1) {
            item.email = aForm.email.value;
        }
        item.role = aForm.role.value;
        item.school = $("#school option:selected").attr("value");
        item.schoolTitle = $("#school option:selected").attr("title");
        item.unit = aForm.unit.value;
        item.industry = aForm.industry.value;

        if (!item.name.length) {
            error("请输入昵称");
            return false;
        }

        if (!NAME_REG.test(item.name) || sb_strlen(item.name) < 4 || sb_strlen(item.name) > 16) {
            error("请输入正确的昵称（2-10位中文或4-20位字母数字）");
            return false;
        }

        if (!item.role.length) {
            error("请选择身份");
            return false;
        }

        if (item.role == 1 || item.role == 2) {
            if (!item.school.length) {
                error("请选择学校");
                return false;
            }
        } else if (item.role == 3) {
            if (!item.province.length) {
                error("请选择省份");
                return false;
            }
            if (!item.industry.length) {
                error("请选择行业");
                return false;
            }
        } else if (item.role == 11) {

        } else {
            error("请刷新重试");
            return;
        }

        setStep(3);
    });

    //身份选择
    $("#step2 select[name=role]").on("change", function() {
        var val = $(this).val();
        // console.log(val);
        if (val == 1 || val == 2) {
            $(".ts-unit").show();
            $(".so-unit").hide();
            aForm.province.value = "";
            $("#school").parent(".register_item").show();
            $("#school").html('<option value="">选择学校</option>');
        } else if (val == 3) {
            $(".ts-unit").show();
            $(".so-unit").show();
            $("#school").parent(".register_item").hide();
        } else {
            $(".ts-unit").hide();
            $(".so-unit").hide();
        }
    });

    /*密码设置上一步,下一步*/
    $("#step3 .pre-btn").on("click", function() {
        setStep(2);
    });

    $("#step3 .next-btn").on("click", function() {
        var item = {};
        item.password = aForm.password.value;
        item.password2 = aForm.password2.value;

        if (item.password.length < 6 || item.password.length > 64) {
            error("请输入正确的密码（6-64位）");
            return false;
        }
        if (item.password2.length < 6 || item.password2.length > 64) {
            error("请输入正确的确认密码");
            return false;
        }
        if (item.password !== item.password2) {
            error("两次输入的密码不一致");
            return false;
        }

        onSubmit();
    });

    /*设置步骤*/
    function setStep(n) {
        step = n;
        $(".register_title .pull-right span").removeClass("on");
        $(".register_title .pull-right span").eq(n - 1).addClass("on");
        if (n == 1) {
            $("#step2, #step3, #step4").hide();
            $("#step1").show();
        } else if (n == 2) {
            $("#step1, #step3, #step4").hide();
            $("#step2").show();
        } else if (n == 3) {
            $("#step1, #step2, #step4").hide();
            $("#step3").show();
        } else if (n == 4) {
            $("#step1, #step2, #step3").hide();
            $("#step4").show();
            var res = "";
            res += '<div class="success-title"><img src="static/index/pic/register_success.png" /><span>您已注册成功</span></div>';
            // res += '<div class="success-tip">系统将在<span class="success-clock">5</span>秒后自动跳转到登录页面，如果没有请点击<a href="/login">手动跳转</a></div>';
            res += '<div class="success-btn"><a href="/">返回首页</a></div>';
            $("#step4").html(res);

            // var s = 5;
            // var st = setInterval(function() {
            //     $("#step4 .success-clock").html(s);
            //     --s;
            //     if (s <= 0) {
            //         clearInterval(st);
            //         document.location = "login.html";
            //     }
            // }, 1000); //成功
        }
    }

    /**
     * 提交form
     */
    function onSubmit() {
        if (submit) {
            return;
        }
        X.dialogLoading();
        loaded = 0;
        submit = true;
        var item = {};
        item.regMethod = regMethod;
        item.name = aForm.name.value;
        item.province = aForm.province.value;
        item.role = aForm.role.value;
        item.school = $("#school option:selected").attr("value");
        item.schoolTitle = $("#school option:selected").attr("title");
        item.unit = aForm.unit.value;
        item.code = aForm.code.value;
        item.password = aForm.password.value;
        item.password2 = aForm.password2.value;
        shengid = item.province; //省id
        item.industry = aForm.industry.value;

        if (regMethod == 1) {
            item.phone = aForm.phone.value;
            item.email = aForm.email.value;

            if (item.phone.length < 11) {
                error("请输入正确的手机号");
                return false;
            }
            if (!MOBILE_REG.test(item.phone)) {
                error("请输入正确的手机号");
                return false;
            }
        } else {
            item.email = aForm.regEmail.value;
            if (item.email.length < 3 || !EMAIL_REG.test(item.email)) {
                error("请正确输入邮箱地址");
                return false;
            }
        }

        if (!item.code.length) {
            error("请输入验证码");
            return false;
        }
        if (item.code.length < 6) {
            error("请正确输入您的验证码");
            return false;
        }

        if (!item.name.length) {
            error("请输入昵称");
            return false;
        }

        if (!item.role.length) {
            error("请选择身份");
            return false;
        }

        if (item.role == 1 || item.role == 2) {
            if (!item.school.length) {
                error("请选择学校");
                return false;
            }
        } else if (item.role == 3) {
            if (!item.industry.length) {
                error("请选择行业");
                return false;
            }
        }else {
            error("请刷新重试");
            return;
        }

        if (item.password.length < 6 || item.password.length > 64) {
            error("请输入正确的密码（6-64位）");
            return false;
        }
        // if (passwordLevel(item.password) != 3) {
        //     error("密码不符合规则");
        //     return false;
        // }
        if (item.password2.length < 6 || item.password2.length > 64) {
            error("请输入正确的确认密码");
            return false;
        }
        if (item.password !== item.password2) {
            error("两次输入的密码不一致");
            return false;
        }

        X.post("/index/user/register_up", item, function(respText) {
            var resp = JSON.parse(respText);
            if (resp.code === 200) {
                X('itemForm').reset();
                // var obj = {};
                // obj.type = '1';
                // obj.callback = function() {
                //     document.location = "/login";
                // };
                // obj.msg = '注册成功';
                // X.pub('showDialog', obj);
                setStep(4);
                X.pub("closeDialog");
            } else{
                error(resp.msg);
                return false;
            } 
        });
                
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

    function dialog(msg) {
        var obj = {};
        obj.type = "1";
        obj.disbg = true;
        obj.msg = '<p>' + msg + '</p>';
        X.pub('showDialog', obj);
        submit = false;
        isSend = true;
        X.pub("closeLoading");
    }
    //改变省份
    $('#sheng').change(function() {
        shengid = $(this).val(); //省份value
        loadData = [];
        loadNum = 0;
        getSchool(1);
    });
    //获取学校
    // getSchool(1);

    function getSchool(_start) {

        _start = _start || 1;
        var res = '<option value="">选择学校</option>';
        X.get('/index/user/school?province=' + shengid, function(respText) {
            var resp = JSON.parse(respText);
            loadNum += parseInt(resp.result.length);

            if (resp.result.length == 0) {
                $("#school").html(res);
                return;
            } else {
                for (var i = 0; i < resp.result.length; ++i) {
                    var item = resp.result[i];
                    loadData.push(item);
                }
                if (parseInt(resp.result.length) > loadNum) {
                    getSchool(loadNum + 1);
                } else {
                    for (var i = 0; i < loadData.length; ++i) {
                        var item = loadData[i];
                        res += '<option value="' + item.id + '" title="' + item.school_name + '">' + sb_substr(item.school_name, 40, true) + '</option>';
                    }
                    $("#school").html(res);

                    // X.pub("closeDialog");
                }
            }
        });
    }

    //placeholder
    $('input[type=password],input[type=text],input[type=email],input[type=search],textarea').placeholder({
        isUseSpan: true
    });
});