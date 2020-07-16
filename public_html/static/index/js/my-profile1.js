/**
 * My module:个人信息
 */
X.sub("init", function() {
    //fill in your code here

    var qt = '';
    var images = "/imgs"; //图片上传服务
    var image = "/img?id="; //图片展示服务
    var itemUpload = "/user/api/update/headimg";
    var imgid;
    var elList = X('elList');
    var user = {};
    var ROLE = ["", "管理员", "学生", "教师", "社会人士", "省级管理员", "校级管理员", "运营管理员", "专家", "项目填报帐户", "申报管理员", "国际用户"];
    var EN_ROLE = ["", "管理员", "学生", "教师", "社会人士", "省级管理员", "校级管理员", "运营管理员", "专家", "项目填报帐户", "申报管理员", "International visitor"];
    var emailUpload = "/user/api/update/email";
    var genderUpload = "/index/user/updateSex";
    var nameUpload = "/index/user/updateName";
    var hasTeam = false;

    // 检查当前语言
    function checkLang() {
        if (LANG == "EN") {
            document.title = EN.my.title01;
            $("#uploadimg").text(EN.my.changeHead).css({
                fontSize: "13px"
            });
            $("#form_overlay .form_title").text(EN.my.changeGender);
            $("input[name='username']").prev().html('<i class="require">*</i>' + EN.my.username);
            var div = '';
            div += '<option value="">' + (EN.my.selectGender) + '</option>';
            div += '<option value="M">' + (EN.my.male) + '</option>';
            div += '<option value="F">' + (EN.my.female) + '</option>';
            $("select[name='gender']").html(div);
            $("select[name='gender']").prev().html('<i class="require">*</i>' + EN.my.gender);
            $("#name_overlay .form_title").text(EN.my.changeName);
            $("input[name='name']").prev().html('<i class="require">*</i>' + EN.my.name);
            $("#form_close,#name_close").text(EN.public.cancel);
            $("#form_submit,#name_submit").text(EN.public.save);
        }
    }

    //用户信息
    X.sub('userLogged', function(evt, respText) {
        user = respText;
        display(user);
    });

    //显示用户信息
    function loadContent() {
        X.post('/user/api/get', {}, function(resp) {
            resp = JSON.parse(resp);
            display(resp);
        });
    }

    function display(resp) {
        resp.mobile = resp.mobile || "";
        var res = '';
        var arr_role = user.role.split(" ");
        res += '<li><div class="info">' + (LANG == "EN" ? EN.my.name : "姓名") + '：<span>' + (resp.name || "-") + '</span><a href="javascript:;" onClick="X.pub(\'editName\',\'' + resp.username + '\')" class="change-email">' + (LANG == "EN" ? EN.my.reset : "修改") + '</a></div> </li>';
        res += '<li><div class="info">' + (LANG == "EN" ? EN.my.identity : "身份") + '：<span>';
        if (!user.role.length) {
            res += "-";
        } else {
            for (var i = 0; i < arr_role.length; i++) {
                if (i != arr_role.length - 1) {
                    if (LANG == "EN") {
                        res += EN_ROLE[arr_role[i]] + "，";
                    } else {
                        res += ROLE[arr_role[i]] + "，";
                    }
                } else {
                    if (LANG == "EN") {
                        res += EN_ROLE[arr_role[i]];
                    } else {
                        res += ROLE[arr_role[i]];
                    }
                }
            }
        }
        res += '</span></div> </li>';
        res += '<li><div class="info">' + (LANG == "EN" ? EN.my.gender : "性别") + '：<span>' + (LANG == "EN" ? (EN_GENDER[resp.gender] || "-") : (GENDER[resp.gender] || "-")) + '</span><a href="javascript:;" onClick="X.pub(\'editGender\',\'' + resp.username + '\')" class="change-email">' + (LANG == "EN" ? EN.my.reset : "修改") + '</a></div> </li>';
        if (resp.role == 2 || resp.role == 3) {
            res += '<li><div class="info">省份：<span>' + (PROVINCE[resp.province] || "-") + '</span></div> </li>';
            res += '<li><div class="info">学校：<span>' + (resp.schoolTitle || "-") + '</span></div> </li>';
        } else if (resp.role == 4) {
            res += '<li><div class="info">行业：<span>' + (INDUSTRY[resp.industry] || "-") + '</span></div> </li>';
            res += '<li><div class="info">单位：<span>' + (resp.unit || "-") + '</span></div> </li>';
        }
        if (resp.role == 1) {

        } else { //普通用户显示手机号
            if (resp.role != "11") {
                if (resp.mobile.length) {
                    if (isDeclare()) {
                        res += '<li><div class="info">手机号：<span>' + resp.mobile.substr(0, 3) + '****' + resp.mobile.substr(7) + '</span><a href="javascript:void(0);" class="change-phone">修改</a></div> </li>';
                    } else {
                        res += '<li><div class="info">手机号：<span>' + resp.mobile.substr(0, 3) + '****' + resp.mobile.substr(7) + '</span><a href="javascript:void(0)" class="change-phone">修改</a></div> </li>';
                    }
                } else {
                    res += '<li><div class="info">手机号：<span>-</span><a href="/bind/phone" class="change-phone">绑定</a></div> </li>';
                }
            }
        }
        // res += '<li><div class="info">邮箱：<span>' + (resp.email || "-") + '</span><a href="javascript:;" onClick="X.pub(\'editEmail\',\''+resp.username+'\')" class="change-email">修改</a></div> </li>';

        elList.innerHTML = res;

        resp.headPath = resp.headPath || "";
        var _imgs = resp.headPath.split("=");

        $(".userhead").html('<img src="/imgview/' + (_imgs[1] || "") + '_150x150.jpg" onerror="this.src=\'/images/user.png\'" />');
        //顶部用户头像同时更新
        $("#user-info .pic, .t-user img").attr('src', '/imgview/' + (_imgs[1] || "") + '_30x30.jpg').error(function() {
            $(this).attr('src', "/images/user.png");
        });

        checkLang();
    }

    //上传头像
    var uib = X('uploadimg');

    uib.addEventListener("click", function(e) {
        e.preventDefault();
        uploadCover();
    }, false);

    function coverUploaded(request) {
        var url = images;
        url += '?desc=' + request.name;
        X.post(url, request.body, function(respText) {
            var resp = JSON.parse(respText);
            if (resp.code === 0) {
                var item = {};
                item.headimg = image + resp.id;
                X.post(itemUpload, item, function(resp) {
                    resp = JSON.parse(resp);
                    if (resp.code === 0) {
                        if (LANG == "EN") {
                            X.dialog(EN.my.uploadSuccess);
                        } else {
                            X.dialog("上传成功");
                        }
                        loadContent();
                    } else {
                        if (LANG == "EN") {
                            en_error(EN.my.uploadFailed);
                        } else {
                            error("上传失败，请重试");
                        }
                    }
                });
            } else {
                if (LANG == "EN") {
                    en_error(EN.my.uploadFailed);
                } else {
                    error("上传失败，请重试");
                }
            }
        });
    }

    function uploadCover() {
        var data = {};
        data.callback = function(evts) {
            for (var i = 0; i < evts.length; i++) {
                var evt = evts[i];
                var request = {};
                request.body = evt.data;
                request.name = evt.name;
                coverUploaded(request);
            }
        };

        data.multiple = false;
        data.defaultThumbPreview = "/static/index/pic/uphead.jpg";
        data.size = 100 * 1024;
        data.tipText = "推荐图片尺寸：200px*200px，JPG/PNG格式。图片大小在100KB以内。";
        data.max_width = 200;
        data.max_height = 200;
        data.lang = LANG;
        X.pub('selectImage', data);
    }

    /*编辑性别*/
    var overlay = X('form_overlay');

    function onClose() {
        overlay.style.visibility = 'hidden';
    }

    function onSubmit() {
        var item = {};
        var aForm = X('itemForm');
        item.username = aForm.username.value;
        item.gender = aForm.gender.value;
        if (!item.username) {
            if (LANG == "EN") {
                en_error(EN.public.losePara);
            } else {
                error("缺少参数");
            }
            return;
        }
        if (!item.gender) {
            if (LANG == "EN") {
                en_error(EN.my.selectGender);
            } else {
                error("请选择性别");
            }
            return;
        }
        X.post(genderUpload, item, function(respText) {
            var resp = JSON.parse(respText);
            if (resp.code === 0) {
                // if (LANG == "EN") {
                //     X.dialog(EN.public.saved);
                // } else {
                X.dialog("保存成功");
                // }
                // loadContent();
                window.location.reload();
                onClose();
            } else {
                // if (LANG == "EN") {
                //     en_error(EN.public.updateFailed + "（" + resp.msg + "）");
                // } else {
                error(resp.msg || "更新失败");
                // }
            }
        });
    }

    function onDisplay(item) {
        var form = X('itemForm');
        item.username = item.username || "";
        item.gender = item.gender || "";
        form.username.value = item.username;
        form.gender.value = item.gender;
        overlay.style.visibility = 'visible';
        X.pub('resizePanel');
        X('form_close').addEventListener('click', onClose);
        X('form_submit').addEventListener('click', onSubmit);
    }

    function loadItem(evt, username) {
        var item = user;
        item.username = username;
        isEdit = true;
        onDisplay(item);
    }
    X.sub('editGender', loadItem);
    /*编辑姓名*/
    var nameOverlay = X('name_overlay');

    function onCloseName() {
        nameOverlay.style.visibility = 'hidden';
    }

    function onSubmitName() {
        var item = {};
        var aForm = X('nameForm');
        item.username = user.username;
        item.name = aForm.name.value;
        if (!item.username) {
            if (LANG == "EN") {
                en_error(EN.public.losePara);
            } else {
                error("缺少参数");
            }
            return;
        }
        if (!item.name) {
            if (LANG == "EN") {
                en_error(EN.my.nameTip);
            } else {
                error("请输入姓名");
            }
            return;
        }
        X.post(nameUpload, item, function(respText) {
            var resp = JSON.parse(respText);
            if (resp.code === 0) {
                // if (LANG == "EN") {
                //     X.dialog(EN.public.saved);
                // } else {
                X.dialog("保存成功");
                // }
                // loadContent();
                window.location.reload();
                onCloseName();
            } else {
                // if (LANG == "EN") {
                //     en_error(EN.public.updateFailed + "（" + resp.msg + "）");
                // } else {
                error(resp.msg || "更新失败");
                // }
            }
        });
    }

    function onDisplayName(item) {
        var form = X('nameForm');
        item.name = item.name || "";
        form.name.value = item.name;
        nameOverlay.style.visibility = 'visible';
        X.pub('resizePanel');
        X('name_close').addEventListener('click', onCloseName);
        X('name_submit').addEventListener('click', onSubmitName);
    }

    function loadNameItem(evt, username) {
        var item = user;
        item.username = username;
        isEdit = true;
        onDisplayName(item);
    }
    X.sub('editName', loadNameItem);

    function error(msg) {
        var obj = {};
        obj.title = "提示";
        obj.msg = '<p>' + msg + '</p>';
        obj.noCancel = true;
        X.pub('showDialog', obj);
    }

    function isDeclare() {
        var r = false;
        var path = window.location.pathname;
        if (path.indexOf("/declare") != -1) {
            r = true;
        }
        return r;
    }
});