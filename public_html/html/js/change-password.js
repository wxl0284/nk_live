/**
 * My module:
 *  修改密码
 */
X.sub("init", function() {
    // service URLs
    var us = "/user/api/session/changepassword";
    var loaded = false;
    var user = {};
    
    // 检查当前语言
    function checkLang() {
        if (LANG == "EN") {
            document.title = EN.my.changePWD;
            $("input[name='oldPassword']").prev().text(EN.my.oldPwd).css({width:"200px"});
            $("input[name='password']").prev().text(EN.my.newPwd).css({width:"200px"});
            $("input[name='password2']").prev().text(EN.my.confirmPwd).css({width:"200px"});
            $(".submitBtn").text(EN.public.submit);
            var div = '';
            div += '<p>1、'+(EN.my.pwdLength)+'</p>';
            div += '<p>2、'+(EN.my.pwdContent)+'</p>';
            div += '<p>3、'+(EN.my.notEmailPwd)+'</p>';
            $(".tip").html(div);
        }
    }
    checkLang();

    X.sub('userLogged', function(evt, respText) {
        user = respText;
        loaded = true;
    });

    function cnonce() {
        var INT2HEX = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

        function toHEX(v) {
            var h = '';
            h += INT2HEX[v >>> 28 & 0xF];
            h += INT2HEX[v >>> 24 & 0xF];
            h += INT2HEX[v >>> 20 & 0xF];
            h += INT2HEX[v >>> 16 & 0xF];
            h += INT2HEX[v >>> 12 & 0xF];
            h += INT2HEX[v >>> 8 & 0xF];
            h += INT2HEX[v >>> 4 & 0xF];
            h += INT2HEX[v >>> 0 & 0xF];
            return h;
        }

        return toHEX(Math.floor(Math.random() * Math.pow(2, 32))) + toHEX(Math.floor(Math.random() * Math.pow(2, 32)));
    }

    function passwordLevel(password) {
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

    /**
     * 提交
     */

    $(".submitBtn").click(function() {
        if (!loaded) {
            return;
        }
        var item = {};
        var aForm = X('itemForm');
        item.username = user.username;
        item.oldPassword = aForm.oldPassword.value;
        item.password = aForm.password.value;
        item.password2 = aForm.password2.value;

        if (item.oldPassword.length === 0) {
            if(LANG == "EN"){
                en_error(EN.my.oldPwdTip);
            }else{
                error("请输入旧密码");
            }
            return false;
        }

        if (item.password.length < 8) {
            if(LANG == "EN"){
                en_error(EN.my.newPwdTip01);
            }else{
                error("新密码需大于8位");
            }
            return false;
        }

        if (item.password.length > 64) {
            if(LANG == "EN"){
                en_error(EN.my.newPwdTip02);
            }else{
                error("新密码需小于64位");
            }
            return false;
        }

        if (passwordLevel(item.password) != 3) {
            if(LANG == "EN"){
                en_error(EN.my.pwdError);
            }else{
                error("密码不符合规则");
            }
            return false;
        }

        if (item.password !== item.password2) {
            if(LANG == "EN"){
                en_error(EN.my.pwdNotSame);
            }else{
                error("两次输入的密码不相同");
            }
            return false;
        }

        var obj = {};
        obj.cnonce = cnonce();

        X.get("/user/login", function(n) {
            var nc = JSON.parse(n);
            obj.nonce = nc.nonce;
            var pw = obj.nonce;
            pw += X.sha256(item.oldPassword);
            pw += obj.cnonce;
            var hash = X.sha256(pw);

            X.post(us + "?password=" + hash + "&cnonce=" + obj.cnonce + "&nonce=" + obj.nonce, item, onSubmitResult);
        });

    });

    function onSubmitResult(respText) {
        //document.location = document.location;
        var resp = JSON.parse(respText);
        if (resp.code === 0) {
            success();
        } else {
            if(LANG == "EN"){
                en_error(EN.my.resetFailed+"（"+resp.msg+"）");
            }else{
                error(resp.msg || "修改失败，请检查后重新修改");
            }
        }
    }

    function onSubmitResult2(respText) {
        //document.location = document.location;
        var resp = JSON.parse(respText);
        if (resp.code === 0) {
            success();
        } else {
            if(LANG == "EN"){
                en_error(EN.my.resetFailed);
            }else{
                error(resp.msg || "修改失败，请检查后重新修改");
            }
        }
    }

    function success() {
        var obj = {};
        obj.type = "1";
        if(LANG == "EN"){
            obj.msg = EN.my.pwdReseted;
        }else{
            obj.msg = "密码修改成功";
        }
        obj.callback = function() {
            X('itemForm').reset();
            //document.location = document.location;
        };
        X.pub('showDialog', obj);
    }

    function error(msg) {
        var obj = {};
        obj.title = "Error";
        obj.msg = '<p>' + msg + '</p>';
        obj.noCancel = true;
        X.pub('showDialog', obj);
    }
});