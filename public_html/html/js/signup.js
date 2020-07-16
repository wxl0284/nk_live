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
    var id = -1;
    var t;
    // var MOBILE_REG = /^1[0|1|2|3|4|5|6|7|8|9][0-9]{9}$/;
    // var EMAIL_REG = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var NAME_REG = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
    var shengid; //省id
    var aForm = X('itemForm');
    var loadData = [];
    var loadNum = 0;
    var limit2 = 500;
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

    /*检查当前语言*/
    function checkLang() {
        if (LANG == "EN") {
            document.title = EN.register.title;
            changeRegisterType(1);
            $(".r-title").text(EN.register.pageTitle);
            $(".r-tip").html(EN.register.toLogin);
            $(".s1").text(EN.register.email);
            $(".s2").text(EN.register.accountInfo);
            $(".s3").text(EN.register.setPwd);
            $(".s4").text(EN.register.registerDone);
            $(".register_title .pull-right span").css({
                marginLeft: "0"
            });
            $(".register_title .pull-right span:first-of-type").css({
                marginRight: "15px"
            });
            $("input[name='phone']").attr('placeholder', EN.register.typeMobile);
            $("input[name='regEmail']").attr('placeholder', EN.register.typeEmail);
            $("input[name='code']").attr('placeholder', EN.register.typeCode);
            $("#testcode").text(EN.register.getCode);
            $(".register_item .code").css({
                fontSize: "12px",
                lineHeight: "1.2em"
            });
            $(".next-btn").text(EN.register.nextStep);
            $(".pre-btn").text(EN.register.prevStep);
            $("input[name='name']").attr('placeholder', EN.register.nickName);
            $("input[name='email']").attr('placeholder', EN.register.Email);
            var roles = '';
            roles += '<option value="">' + (EN.register.identity) + '</option>';
            // roles += '<option value="2">' + (EN.register.student) + '</option>';
            // roles += '<option value="3">' + (EN.register.teacher) + '</option>';
            // roles += '<option value="4">' + (EN.register.others) + '</option>';
            roles += '<option value="11" selected="selected">' + (EN.register.intl) + '</option>';
            $("select[name='role']").html(roles).hide();
            $("select[name='role']").next().hide();
            $("#sheng").find("option[value='']").text(EN.register.selectProvince);
            $("#school").find("option[value='']").text(EN.register.selectSchool);
            $("#industry").find("option[value='']").text(EN.register.selectTrade);
            $("input[name='password']").attr('placeholder', EN.register.password);
            $("input[name='password2']").attr('placeholder', EN.register.comfirmPwd);
            $("#submitBtn").text(EN.register.submitInfo);
        }
    }
    checkLang();

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
                if (LANG == "EN") {
                    en_error(EN.register.phoneTip);
                } else {
                    error("请输入正确的手机号");
                }
                return false;
            }
            if (!MOBILE_REG.test(phone)) {
                if (LANG == "EN") {
                    en_error(EN.register.phoneError);
                } else {
                    error("您的手机号填写不正确！");
                }
                return false;
            }
        } else {
            email = aForm.regEmail.value;
            if (!email.length) {
                if (LANG == "EN") {
                    en_error(EN.register.emailError01);
                } else {
                    error("请输入正确的邮箱");
                }
                return false;
            }
            if (!EMAIL_REG.test(email)) {
                if (LANG == "EN") {
                    en_error(EN.register.emailTip);
                } else {
                    error("您的邮箱填写不正确！");
                }
                return false;
            }
        }
        if (!isSend) {
            return;
        }
        isSend = false;
        var item = {};
        var uri = "/sms/api/send";
        if (regMethod == 1) {
            item.phone = phone;
            uri = "/sms/api/send";
        } else {
            item.email = email;
            uri = "/email/api/code/send";
        }
        item.action = 0;
        item.id = id;
        X.post(uri, item, function(resp) {
            resp = JSON.parse(resp);
            if (resp.code !== 0) {
                if (regMethod == "1") {
                    if (resp.code == "1") { //验证码获取失败，请重试
                        if (LANG == "EN") {
                            en_error(EN.register.sendFiled);
                        } else {
                            error(resp.msg);
                        }
                    } else if (resp.code == "4") { //手机号已被绑定
                        if (LANG == "EN") {
                            en_error(EN.register.phoneBound);
                        } else {
                            error(resp.msg);
                        }
                    } else {
                        if (LANG == "EN") {
                            en_error(EN.register.sendFiled);
                        } else {
                            error(resp.msg);
                        }
                    }
                } else {
                    if (resp.code == "1") { //验证码获取失败，请重试
                        if (LANG == "EN") {
                            en_error(EN.register.sendFiled);
                        } else {
                            error(resp.msg);
                        }
                    } else if (resp.code == "2") { //请正确填写邮箱地址
                        if (LANG == "EN") {
                            en_error(EN.register.emailError02);
                        } else {
                            error(resp.msg);
                        }
                    } else if (resp.code == "3") { //用户验证失败，请重试
                        if (LANG == "EN") {
                            en_error(EN.register.userAuthFailed);
                        } else {
                            error(resp.msg);
                        }
                    } else if (resp.code == "4") { //操作过于频繁
                        if (LANG == "EN") {
                            en_error(EN.register.tooOften);
                        } else {
                            error(resp.msg);
                        }
                    } else if (resp.code == "5") { //邮箱已被注册
                        if (LANG == "EN") {
                            en_error(EN.register.emailRegisted);
                        } else {
                            error(resp.msg);
                        }
                    } else {
                        if (LANG == "EN") {
                            en_error(EN.register.sendFiled);
                        } else {
                            error(resp.msg);
                        }
                    }
                }
                return false;
            } else {
                // //测试使用
                // $("input[name=code]").val(resp.smscode);
                if (LANG == "EN") {
                    X.dialog(EN.register.codeSended);
                } else {
                    X.dialog("验证码已发送");
                }
                $("#testcode").css({
                    opacity: 1
                });
                $("#testcode").css("background", "#999");
                canver = true;
                var c = 120;
                if (LANG == "EN") {
                    $("#testcode").html(c + "S").css({
                        lineHeight: "45px"
                    });
                } else {
                    $("#testcode").html(c + "秒");
                }
                --c;
                t = setInterval(function() {
                    if (LANG == "EN") {
                        $("#testcode").html(c + "S");
                    } else {
                        $("#testcode").html(c + "秒");
                    }
                    --c;
                    if (c <= 0) {
                        isSend = true;
                        if (LANG == "EN") {
                            $("#testcode").html(EN.register.getCode).css({
                                "background": "#06c3a6",
                                "color": "#fff"
                            });
                            $(".register_item .code").css({
                                fontSize: "12px",
                                lineHeight: "1.2em"
                            });
                        } else {
                            $("#testcode").html("获取验证码").css({
                                "background": "#06c3a6",
                                "color": "#fff"
                            });
                        }

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
        if (LANG == "EN") {
            $("#testcode").html(EN.register.send).css("background", "#06c3a6");
        } else {
            $("#testcode").html("发送").css("background", "#06c3a6");
        }
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
        var uri = "/api/nologin/sms/code/check";
        var item = {};
        item.code = aForm.code.value;
        item.regMethod = regMethod;
        if (regMethod == 1) {
            item.phone = aForm.phone.value;
            // if (item.phone.length < 11) {
            //     if (LANG == "EN") {
            //         en_error(EN.register.phoneTip);
            //     } else {
            //         error("请输入正确的手机号");
            //     }
            //     return false;
            // }
            // if (!MOBILE_REG.test(item.phone)) {
            //     if (LANG == "EN") {
            //         en_error(EN.register.phoneTip);
            //     } else {
            //         error("请输入正确的手机号");
            //     }
            //     return false;
            // }
        } else {
            item.email = aForm.regEmail.value;
            if (!item.email.length) {
                if (LANG == "EN") {
                    en_error(EN.register.emailError01);
                } else {
                    error("请输入正确的邮箱");
                }
                return false;
            }
            if (!EMAIL_REG.test(item.email)) {
                if (LANG == "EN") {
                    en_error(EN.register.emailTip);
                } else {
                    error("您的邮箱填写不正确！");
                }
                return false;
            }
        }

        // if (!item.code.length) {
        //     if (LANG == "EN") {
        //         en_error(EN.register.typeCode);
        //     } else {
        //         error("请输入验证码");
        //     }
        //     return false;
        // }
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
        // var item = {};
        // item.name = aForm.name.value;
        // item.province = aForm.province.value;
        // if (regMethod == 1) {
        //     item.email = aForm.email.value;
        // }
        // item.role = aForm.role.value;
        // item.school = $("#school option:selected").attr("value");
        // item.schoolTitle = $("#school option:selected").attr("title");
        // item.unit = aForm.unit.value;
        // item.industry = aForm.industry.value;

        // if (!item.name.length) {
        //     if (LANG == "EN") {
        //         en_error(EN.register.nickName);
        //     } else {
        //         error("请输入昵称");
        //     }
        //     return false;
        // }

        // if (!NAME_REG.test(item.name) || sb_strlen(item.name) < 4 || sb_strlen(item.name) > 16) {
        //     if (LANG == "EN") {
        //         en_error(EN.register.nickNameError);
        //     } else {
        //         error("请输入正确的昵称（2-10位中文或4-20位字母数字）");
        //     }
        //     return false;
        // }

        // if (!item.role.length) {
        //     if (LANG == "EN") {
        //         en_error(EN.register.identity);
        //     } else {
        //         error("请选择身份");
        //     }
        //     return false;
        // }

        // if (item.role == 2 || item.role == 3) {
        //     if (!item.school.length) {
        //         if (LANG == "EN") {
        //             en_error(EN.register.selectSchool);
        //         } else {
        //             error("请选择学校");
        //         }
        //         return false;
        //     }
        // } else if (item.role == 4) {
        //     if (!item.province.length) {
        //         if (LANG == "EN") {
        //             en_error(EN.register.selectProvince);
        //         } else {
        //             error("请选择省份");
        //         }
        //         return false;
        //     }
        //     if (!item.industry.length) {
        //         if (LANG == "EN") {
        //             en_error(EN.register.selectTrade);
        //         } else {
        //             error("请选择行业");
        //         }
        //         return false;
        //     }
        // } else if (item.role == 11) {

        // } else {
        //     if (LANG == "EN") {
        //         en_error(EN.register.refresh);
        //     } else {
        //         error("请刷新重试");
        //     }
        //     return;
        // }

        setStep(3);
    });

    //身份选择
    $("#step2 select[name=role]").on("change", function() {
        var val = $(this).val();
        // console.log(val);
        if (val == 2 || val == 3) {
            $(".ts-unit").show();
            $(".so-unit").hide();
            aForm.province.value = "";
            $("#school").parent(".register_item").show();
            if (LANG == "EN") {
                $("#school").html('<option value="">' + (EN.register.selectSchool) + '</option>');
            } else {
                $("#school").html('<option value="">选择学校</option>');
            }
        } else if (val == 4) {
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
        // var item = {};
        // item.password = aForm.password.value;
        // item.password2 = aForm.password2.value;

        // if (item.password.length < 8 || item.password.length > 64) {
        //     if (LANG == "EN") {
        //         en_error(EN.register.passwordError);
        //     } else {
        //         error("请输入正确的密码（8-64位）");
        //     }
        //     return false;
        // }
        // if (item.password2.length < 8 || item.password2.length > 64) {
        //     if (LANG == "EN") {
        //         en_error(EN.register.confirmPwdError);
        //     } else {
        //         error("请输入正确的确认密码");
        //     }
        //     return false;
        // }
        // if (item.password !== item.password2) {
        //     if (LANG == "EN") {
        //         en_error(EN.register.notSame);
        //     } else {
        //         error("两次输入的密码不一致");
        //     }
        //     return false;
        // }

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
            if (LANG == "EN") {
                res += '<div class="success-title"><img src="/images/signup-success.png" /><span>' + (EN.register.registerSuccess) + '</span></div>';
                res += '<div class="success-tip">' + (EN.register.jumpPage) + '</div>';
                res += '<div class="success-btn"><a href="/">' + (EN.register.toHome) + '</a></div>';
            } else {
                res += '<div class="success-title"><img src="pic/register_success.png" /><span>您已注册成功</span></div>';
                // res += '<div class="success-tip">系统将在<span class="success-clock">5</span>秒后自动跳转到登录页面，如果没有请点击<a href="/login">手动跳转</a></div>';
                res += '<div class="success-btn"><a href="index.html">返回首页</a></div>';
            }
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
        setStep(4);
        /*
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
                item.id = id;
                shengid = item.province; //省id
                item.industry = aForm.industry.value;

                if (regMethod == 1) {
                    item.phone = aForm.phone.value;
                    item.email = aForm.email.value;

                    if (item.phone.length < 11) {
                        if (LANG == "EN") {
                            en_error(EN.register.phoneTip);
                        } else {
                            error("请输入正确的手机号");
                        }
                        return false;
                    }
                    if (!MOBILE_REG.test(item.phone)) {
                        if (LANG == "EN") {
                            en_error(EN.register.phoneTip);
                        } else {
                            error("请输入正确的手机号");
                        }
                        return false;
                    }
                } else {
                    item.email = aForm.regEmail.value;
                    if (item.email.length < 3 || !EMAIL_REG.test(item.email)) {
                        if (LANG == "EN") {
                            en_error(EN.register.emailError02);
                        } else {
                            error("请正确输入邮箱地址");
                        }
                        return false;
                    }
                }

                if (!item.code.length) {
                    if (LANG == "EN") {
                        en_error(EN.register.typeCode);
                    } else {
                        error("请输入验证码");
                    }
                    return false;
                }
                if (item.code.length < 6) {
                    if (LANG == "EN") {
                        en_error(EN.register.codeError);
                    } else {
                        error("请正确输入您的验证码");
                    }
                    return false;
                }

                if (!item.name.length) {
                    if (LANG == "EN") {
                        en_error(EN.register.nickName);
                    } else {
                        error("请输入昵称");
                    }
                    return false;
                }

                if (!item.role.length) {
                    if (LANG == "EN") {
                        en_error(EN.register.identity);
                    } else {
                        error("请选择身份");
                    }
                    return false;
                }

                if (item.role == 2 || item.role == 3) {
                    if (!item.school.length) {
                        if (LANG == "EN") {
                            en_error(EN.register.selectSchool);
                        } else {
                            error("请选择学校");
                        }
                        return false;
                    }
                } else if (item.role == 4) {
                    if (!item.industry.length) {
                        if (LANG == "EN") {
                            en_error(EN.register.selectTrade);
                        } else {
                            error("请选择行业");
                        }
                        return false;
                    }
                } else if (item.role == 11) {

                } else {
                    if (LANG == "EN") {
                        en_error(EN.register.refresh);
                    } else {
                        error("请刷新重试");
                    }
                    return;
                }

                if (item.password.length < 8 || item.password.length > 64) {
                    if (LANG == "EN") {
                        en_error(EN.register.passwordError);
                    } else {
                        error("请输入正确的密码（8-64位）");
                    }
                    return false;
                }
                // if (passwordLevel(item.password) != 3) {
                //     error("密码不符合规则");
                //     return false;
                // }
                if (item.password2.length < 8 || item.password2.length > 64) {
                    if (LANG == "EN") {
                        en_error(EN.register.confirmPwdError);
                    } else {
                        error("请输入正确的确认密码");
                    }
                    return false;
                }
                if (item.password !== item.password2) {
                    if (LANG == "EN") {
                        en_error(EN.register.notSame);
                    } else {
                        error("两次输入的密码不一致");
                    }
                    return false;
                }

                X.post("/api/nologin/user/update", item, function(respText) {
                    var resp = JSON.parse(respText);
                    if (resp.code === 0) {
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
                    } else if (resp.code == 2) {
                        if (LANG == "EN") {
                            if (regMethod == "1") {
                                en_error(EN.register.phoneRegisted);
                            } else {
                                en_error(EN.register.emailRegisted);
                            }
                        } else {
                            error(resp.msg);
                        }
                    } else {
                        if (LANG == "EN") {
                            en_error(EN.register.registerFail);
                        } else {
                            error("注册失败");
                        }
                    }
                });
                */
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
        var res = '<option value="">' + (LANG == "EN" ? EN.register.selectSchool : "选择学校") + '</option>';
        X.get('/json/schools?status=1&del=0&sortby=title&reverse=false&select=id,title&limit=' + limit2 + '&start=' + _start + '&province=' + shengid, function(respText) {
            var resp = JSON.parse(respText);
            resp.meta = resp.meta || {
                total: "0",
                size: "0"
            };
            loadNum += parseInt(resp.meta.size);

            if (resp.meta && resp.meta.total === '0') {
                $("#school").html(res);
                return;
            } else {
                var size = parseInt(resp.meta.size);
                for (var i = 0; i < size; ++i) {
                    var item = resp.data[i];
                    loadData.push(item);
                }
                if (parseInt(resp.meta.total) > loadNum) {
                    getSchool(loadNum + 1);
                } else {
                    loadData.sort(function(x, y) {
                        return x.title.localeCompare(y.title);
                    });
                    for (var i = 0; i < loadData.length; ++i) {
                        var item = loadData[i];
                        res += '<option value="' + item.id + '" title="' + item.title + '">' + sb_substr(item.title, 40, true) + '</option>';
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