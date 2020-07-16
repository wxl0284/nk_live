/**
 * My module:资讯列表页
 *  description about what it does
 */
X.sub("init", function() {
    //fill in your code here

    var msgs = {};

    msgs.noItem = "没有数据";

    // service URLs
    var start = 0;
    var limit = 5;
    var elList = X('elList');

    var qt = "&title=0";
    var qt2 = "&article_cat=1";
    var user = "";

    if (X.qs.article_cat) {
        if (X.qs.article_cat == "1") {
            $('.word span').text('通知公告');
        } else if (X.qs.article_cat == "2") {
            qt2 = "&article_cat=" + X.qs.article_cat;
            $('.word span').text('新闻资讯');
        }
    }
    
     /**
     * 搜索
     */
    $('.s-btn').click(function() {
        qt = '';
        var f = X('searchForm');
        if (f.searchValue.value !== ' ' && f.searchValue.value !== '') {
            qt += '&title=' + f.searchValue.value;
        }

        loadContent();
    });

    loadContent();

    function loadContent() {
        X.get('/index/article/article_list?start='+start+'&limit=' + limit + qt + qt2, onGetContent);
    }

    //分页显示

    function gotoPage(evt, page) {
        X.get('/index/article/article_list?limit=' + limit + '&start=' + page.start + qt + qt2, onGetContent);
    }

    X.sub('gotoPage', gotoPage);


    function onGetContent(respText) {
        var resp = JSON.parse(respText);
        resp = resp.result
        resp.meta = resp.meta || {
            total: "0",
            size: "0"
        };
        var res = '';
        if (resp.meta && resp.meta.total == 0) {
             elList.innerHTML= '<div class="noitems">暂无数据</div>';
           
        } else {
            var size = parseInt(resp.meta.size);
            for (var i = 0; i < size; ++i) {
                var item = resp.data[i];
                res += '<li><a href="/index/article/detail?id=' + item.id + '" ><div class="text"><p class="txt">' + (item.title || "") + '</p><p class="time">[' + item.create_time + ']</p></div><div class="details">' + (item.brief || "") + '</div></a> </li>';
            }
            elList.innerHTML = res;

        }
        resp.limit = limit;
        resp.evt = "gotoPage";
        resp.ele = X("pagination", true);
        X.pub('pagination', resp);

    }


});