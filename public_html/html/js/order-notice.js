/**
 * My module:
 *  实验云-个人中心-预约通知
 */
X.sub("init", function() {
    var itemList = "/json/experiment/order/students";

    var elList = X('list');
    var user = {};
    var limit = 10;
    var start = 1;

    X.sub('userLogged', function(evt, respText) {
        user = respText;
        if (user.role != "2") {
            X.dialog("无权限");
            document.location = "/";
            return;
        }
        loadContent();
    });


    /*加载内容*/
    function loadContent() {
        X.get(itemList + '?sortby=id&reverse=true&del=2&username=' + user.username + '&limit=' + limit + '&start=' + start, onGetContent);
    }

    function onGetContent(resp) {
        resp = JSON.parse(resp);
        resp.meta = resp.meta || {
            total: "0",
            size: "0"
        };
        if (resp.meta && resp.meta.total === '0') {
            elList.innerHTML = "<div class='noitems'>暂无数据</div>";
        } else {
            var size = parseInt(resp.meta.size);
            var res = '<ul class="noticeList clearfix">';
            for (var i = 0; i < size; ++i) {
                var item = resp.data[i];
                item.orderInfo = item.orderInfo || {};
                item.projInfo = item.projInfo || {};
                if ((i + 1) % 2 === 0) {
                    res += '<li class="pull-right">';
                } else {
                    res += '<li class="pull-left">';
                }
                res += '<p class="noticeTitle">预约成功通知<span class="pull-right">' + moment(item.created).format("YYYY/MM/DD HH:mm") + '</span></p>';
                res += '<p class="noticeContent">';
                res += '<span>预约实验：【<a class="a-link" href="/cloud/experiment/details?id=' + item.expId + '&prev=2" target="_blank">' + (item.expTitle || "-") + '</a>】</span>';
                res += '<span>预约日期：' + (item.orderInfo.orderDate || "-") + '</span>';
                res += '<span>预约时间：' + (item.orderInfo.orderTime[0].start) + ' ~ ' + (item.orderInfo.orderTime[0].end) + '</span>';
                res += '</p>';
                res += '<p class="noticeContent">请在“我的预约”中查看实验！<a class="a-link" href="/cloud/experiment/details?id=' + item.expId + '&prev=2" target="_blank">立即前往实验</a></p>';
                res += '</li>';
            }
            res += '</table>';
            elList.innerHTML = res;
        }

        //pagination
        resp.limit = limit;
        X.pub('pagination', resp);
    }

    /*分页显示*/
    function gotoPage(evt, page) {
        start = page.start;
        X.get(itemList + '?sortby=id&reverse=true&del=2&username=' + user.username + '&limit=' + limit + '&start=' + start + '&start=' + page.start, onGetContent);
    }
    X.sub('gotoPage', gotoPage);
});