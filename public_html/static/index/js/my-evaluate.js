/**
 * 我的评价
 */
X.sub("init", function() {

    var user = {};
    var start = 0;
    var c_limit = 6;
    var c_itemList = "/index/user/evaluate_list";
    //用户信息
    loadComment();

    /*评论列表*/

    function loadComment() {
        X.get(uri_pipe(c_itemList + '?start=0&limit=' + c_limit + '&sortby=id&reverse=true'), onGetComment);
    }

    /**
     * 分页显示
     **/
    function gotoPage(evt, page) {
        X.get(uri_pipe(c_itemList + '?sortby=id&reverse=true&limit=' + c_limit + '&start=' + page.start), onGetComment);
    }

    X.sub('gotoPage', gotoPage);

    function onGetComment(respText) {
        var resp = JSON.parse(respText);
        resp = resp.result;
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
                res += '<li class="item">';
                res += '<div class="info"><span>项目：<a href="/index/subject/detail?id=' + item.sub_id + '&isView=true">' + (item.subject_name || "") + '</a></span><span>评价时间：' + item.create_time + '</span>';
                res += '</div>';
                res += '<p class="cont">' + (item.content || "") + '</p>';
                res += '</li>';
            }
        }

        $("#list").html(res);
        //分页
        resp.limit = c_limit;
        resp.evt = "gotoPage";
        resp.ele = X("pagination", true);
        X.pub('pagination', resp);
        
        var y1=$(".content-wrap #list").height();
        var y2=$(".cN-pagination");
            if(y1!=0){
                y2.css("position","initial")
            }
        
    }
    
});