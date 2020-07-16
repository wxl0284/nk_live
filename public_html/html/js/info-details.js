/**
 * My module:资讯详情页
 *  description about what it does
 */
X.sub("init", function() {
    //fill in your code here
    var vid = X.qs.id;
    var qt = '';
    var elList = X('elList');
    var user = {};
    
    loadContent();
    
    // X.sub('userLogged', function(evt, respText) {
    //     user = respText;
    //     loadContent();
    // });
    
    function loadContent() {
        X.get('/json/info?id=' + vid, onGetContent);
    }

    function onGetContent(respText) {
        var resp = JSON.parse(respText);
        var item = resp;
        item.attPath = item.attPath || {};
        item.isCanEva = item.isCanEva || 2;
        var res = '';
        var SOURCE = ['原创', '转载'];
        res += '<div class="news">';
        res += '<div class="title">' + (item.title || "") + '</div>';
        res += '<div class="info"><span class="source">' + (SOURCE[item.source] || "") + '</span><span class=""time>' + (item.date || moment(item.created).format("YYYY-MM-DD")) + '</span></div>';
        res += '<div class="article">' + (item.contents || "")  + '</div>';
        res += '</div>';
        elList.innerHTML = res;
        // 附件显示
        var attPath = JSON.stringify(item.attPath);
        if (attPath == "{}") {
            // $("#attachment").html('附件：无');
        } else {
            var filebox = item.attPath || {};
            var str = '<p class="attachment-download"><i class="iconfont icon-attachment">&#xe6f8;</i>附件下载：</p><ul>';
            for (var a in filebox) {
                str += '<li><a href=" ' + filebox[a]['url'] + ' " >' + filebox[a]['name'] + '</a></li>';
            }
            str += "</ul>";
            if (str == "") {
                str = "-";
            }
            $("#attachment").html(str);
        }
        // 加载评论框
        var div = '<div class="infoEvaBox">';
        div += '<form class="infoEvaForm" id="commentForm" onsubmit="return false;">';
        div += '<textarea rows="6" class="form-control evaContent" name="comment" placeholder="输入评论内容..."></textarea>';
        div += '<button type="submit" class="btn_subEva">发表评论</button>';
        div += '</form>';
        div += '</div>';
        if(item.isCanEva === 1){
            $("#evaBox").html(div);
            /* 发表评论 */
            $('#commentForm').submit(function() {
                var $this = $(this);
                X.get("/user/session", function(us) {
                    us = JSON.parse(us);
                    if (us.code && us.code != '0') {
                        toLogin();
                        return;
                    }
                    var d = {};
                    d.infoId = item.id;
                    d.info = item.title;
                    d.comment = $this[0].comment.value || "";
                    if(!d.comment.length){
                        X.error("请输入评论内容");
                        return false;
                    }
                    X.post('/info/api/evaluation/add', d, function(res) {
                        res = JSON.parse(res);
                        if (res.code == '0') {
                            X.dialog("评论成功");
                            $this[0].comment.value = "";
                        } else {
                            X.dialog(res.msg);
                        }
                    });
                });
            });
        }
    }
    /* 跳转登录 */
    function toLogin() {
        var obj = {};
        obj.title = "提示";
        obj.msg = "请先登录";
        obj.okText = "登录";
        obj.callback = function() {
            document.location = "/login?ref=" + encodeURIComponent(window.location.href);
        };
        X.pub("showDialog", obj);
    }
});