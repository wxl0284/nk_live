/**
 * 我的评价
 */
X.sub("init", function() {

    var user = {};
    var c_limit = 20;
    var c_itemList = "/json/projectScores";
    //用户信息
    X.sub('userLogged', function(evt, respText) {
        user = respText;
        loadComment();
    });

    /*评论列表*/

    function loadComment() {
        X.get(uri_pipe(c_itemList + '?username=' + user.username + '&limit=' + c_limit + '&sortby=id&reverse=true'), onGetComment);
    }

    /**
     * 分页显示
     **/
    function gotoPage(evt, page) {
        X.get(uri_pipe(c_itemList + '?username=' + user.username + '&sortby=id&reverse=true&limit=' + c_limit + '&start=' + page.start), onGetComment);
    }

    X.sub('gotoPage', gotoPage);

    function onGetComment(respText) {
        var resp = JSON.parse(respText);
        resp.meta = resp.meta || {
            total: "0",
            size: "0"
        };
        var res = "";
        if (resp.meta && resp.meta.total === '0') {
            res = "<div class='noitems'>暂无评论</div>";
        } else {
            var size = parseInt(resp.meta.size);
            for (var i = 0; i < size; ++i) {
                var item = resp.data[i];
                item.type = item.type || 3;
                item.projInfo = item.projInfo || {};
                res += '<li class="item">';
                
                var detailsUrl = "";
                if (item.projInfo.isPrized == 1) {
                    detailsUrl = "/details";
                } else {
                    if (item.projInfo.declareYear == "2017") {
                        detailsUrl = "/details/v1";
                    } else {
                        detailsUrl = "/details/v3";
                    }
                }
                
                res += '<div class="info"><span>项目：<a href="' + detailsUrl + '?id=' + item.projectID + '">' + (item.project || "") + '</a></span><span>评价时间：' + moment(item.created).format("YYYY-MM-DD HH:mm:ss") + '</span>';
                if (item.type != 2) {
                    res += '<span>评分：' + (item.score || "0") + '分</span>';
                }
                res += '</div>';
                res += '<p class="cont">' + (item.comment || "") + '</p>';
                res += '</li>';
            }
        }

        $("#list").html(res);
        //分页
        resp.limit = c_limit;
        X.pub('pagination', resp);
    }
});