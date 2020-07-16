/**
 * My module:资讯列表页
 *  description about what it does
 */
X.sub("init", function() {
    //fill in your code here

    var msgs = {};

    msgs.noItem = "没有数据";

    // service URLs
    var limit = 5;
    var elList = X('elList');

    var qt = "";
    var qt2 = "&type=1";
    var user = "";
    
    if (X.qs.type) {
        if (X.qs.type == "1") {
            $('.word span').text('通知公告');
        } else if (X.qs.type == "4") {
            qt2 = "&type=" + X.qs.type;
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
        X.get('/json/infos?sortby=id&reverse=true&status=1&del=0&limit=' + limit + qt + qt2, onGetContent);
    }

    //分页显示

    function gotoPage(evt, page) {
        X.get('/json/infos?sortby=id&reverse=true&status=1&del=0&limit=' + limit + '&start=' + page.start + qt + qt2, onGetContent);
    }

    X.sub('gotoPage', gotoPage);


    function onGetContent(respText) {
        var resp = JSON.parse(respText);
        
        resp.meta = resp.meta || {
            total: "0",
            size: "0"
        };
        var res = '';
        if (resp.meta && resp.meta.total === '0') {
             elList.innerHTML= '<div class="noitems">暂无数据</div>';
           
        } else {
            var size = parseInt(resp.meta.size);
            for (var i = 0; i < size; ++i) {
                var item = resp.data[i];
                // alert(JSON.stringify(item));
                res += '<li><a href="/infodetails?id=' + item.id + '" ><div class="text"><p class="txt">' + (item.title || "") + '</p><p class="time">[' + (item.date || moment(item.created).format("YYYY-MM-DD")) + ']</p></div><div class="details">' + (item.brief || "") + '</div></a> </li>';
            }
            elList.innerHTML = res;

        }

        //pagination
        resp.limit = limit;
        X.pub('pagination', resp);

    }


});