/**
 * 实验云-我的预约
 */
X.sub("init", function() {
    var itemList = "/json/experiment/order/students";
    var scoreList = "/open/session/api/score/user/search";
    var stuScoreLog = "/experiment/api/experiment/student/scoreLog";

    var limit = 10,
        cLimit = 6,
        eList = X("list"),
        isEdit = false,
        pid,
        submit = false,
        user = {};

    var qt = "&orderIsDone=2",
        isDone = 2,
        start = 1,
        EXP_STATUS = ["", "完成", "未完成"];

    X.sub("userLogged", function(evt, resp) {
        user = resp;
        if (user.role != "2") {
            X.dialog("无权限");
            document.location = "/";
            return;
        }
        loadContent();
    });

    /*切换是否完成状态*/
    $(".isDone").off('click').on('click', function() {
        $(this).addClass("on").siblings(".isDone").removeClass("on");
        isDone = $(this).data("isdone");
        // qt = '&orderIsDone=' + isDone;
        loadContent();
    });

    /*加载我的实验*/
    function loadContent() {
        // X.get(itemList + '?sortby=id&reverse=true&del=2&username=' + user.username + '&limit=' + limit + '&start=' + start + qt, onGetContent);
        X.get(stuScoreLog + '?limit=' + limit + '&orderIsDone=' + isDone + '&orderStatus=1', onGetContent);
    }

    function onGetContent(resp) {
        resp = JSON.parse(resp);
        resp.meta = resp.meta || {
            total: "0",
            size: "0"
        };
        var res = '';
        if (resp.meta && resp.meta.total == "0") {
            res += '<li class="noitems">暂无数据</li>';
        } else {
            var size = parseInt(resp.meta.size);
            for (var i = 0; i < size; i++) {
                var item = resp.data[i];
                res += '<li class="clearfix">';
                res += '<div class="cover">';
                res += '<span data-photo="' + item.imgPath + '"></span>';
                res += '</div>';
                res += '<div class="info">';
                res += '<div class="project-title">' + (item.expTitle || "-") + '</div>';
                res += '<div class="project-level"><span class="proLevel">' + (item.en_expTitle || "-") + '</span></div>';
                res += '<div class="project-brief"><span class="brief-title">实验简介：</span>' + sb_substr(item.brief, 130, true) + '</div>';
                res += '<div class="project-brief">';
                res += '<span class="brief-title orderDate">预约日期：</span>' + (item.orderDate || "-") + '<span class="brief-title orderDate">预约时间：</span>' + (item.orderTime[0].start || "-") + ' ~ ' + (item.orderTime[0].end || "-");
                if (isDone == "1") {
                    if (item.score) {
                        res += '<span class="brief-title orderDate expScore">实验成绩：</span><a href="#" onclick="X.pub(\'viewScoreLog\',\'' + item.expId + '\',\'' + item.username + '\',\'' + item.name + '\',\'' + item.score + '\')">' + (item.score || "-") + '</a>';
                    } else {
                        res += '<span class="brief-title orderDate">实验成绩：</span>' + (item.score || "-");
                    }
                    res += '<span class="brief-title orderDate">实验结果：</span>' + (EXP_STATUS[item.status] || "-");
                }
                res += '</div>';
                res += '<div class="btns">';
                if (isDone == "2") {
                    res += '<a class="preview-btn btn" href="/cloud/experiment/details?id=' + item.expId + '&prev=2" target="_blank">立即前往</a>';
                } else {
                    if (item.attachmentId) {
                        res += '<a class="preview-btn btn" href="/project/log/attachment?id=' + item.attachmentId + '&download=true" target="_blank">实验报告下载</a>';
                    }
                }
                res += '</div>';
                res += '</li>';
            }
        }
        eList.innerHTML = res;
        resp.limit = limit;
        X.pub('pagination', resp);
        $('[data-photo]').each(function() {
            var $this = $(this);
            var img = new Image();
            var url = $this.data('photo');
            img.src = url || PROJECT_DEFAULT;
            img.onload = function() {
                $this.replaceWith('<img src="' + img.src + '" class="project-img" />');
                imgAutoPostion($('img[src="' + img.src + '"]'), 284, 164, img.width, img.height);
            };
        });
    }

    function gotoPage(evt, page) {
        // X.get(itemList + '?sortby=id&reverse=true&del=2&username=' + user.username + '&limit=' + limit + '&start=' + page.start + qt, onGetContent);
        X.get(stuScoreLog + '?limit=' + limit + '&orderIsDone=' + isDone + "&start=" + page.start, onGetContent);
    }
    X.sub('gotoPage', gotoPage);

    /*查看学生的所有实验结果*/
    var slist = $("#sList");
    var username = "",
        name = "",
        score = "",
        expId = "";

    X.sub("viewScoreLog", function(evt, experimentId, username, name, score) {
        username = username;
        name = name;
        score = score;
        expId = experimentId;
        start = 1;
        $(".stuName").text(name);
        $(".stuScore>i").text(score);
        loadScore();
        $("#c-panel01").show();
    });

    function loadScore() {
        X.dialogLoading();
        X.get(scoreList + "?projId=" + expId, onGetScore);
    }

    function onGetScore(respText) {
        var resp = JSON.parse(respText);
        resp.meta = resp.meta || {
            total: "0",
            size: "0"
        };
        $(".stuScoreTotal>i").text(resp.meta.total);
        var res = "";
        if (resp.meta && resp.meta.total === '0') {
            res += "<div class='noitems'>暂无数据</div>";
        } else {
            var size = parseInt(resp.meta.size);
            res += "<table><tr class='l_header'><th class='itemTitle'>序号</th><th class='itemCategory'>实验开始时间</th><th class='itemTitle'>实验结束时间</th><th class='itemTitle'>实验结果</th><th class='itemTitle'>实验成绩</th></tr>";
            for (var i = 0; i < size; ++i) {
                var item = resp.data[i];
                res += '<tr>';
                res += '<td>' + (start + i) + '</td>';
                res += '<td>' + (moment(item.startDate).format("YYYY-MM-DD HH:mm:ss") || "-") + '</td>';
                res += '<td>' + (moment(item.endDate).format("YYYY-MM-DD HH:mm:ss") || "-") + '</td>';
                res += '<td>' + (EXP_STATUS[item.status] || "-") + '</td>';
                res += '<td>' + (item.score || "-") + '</td>';
                res += '</tr>';
            }
            res += "</table>";
        }
        slist.html(res);
        resp.limit = limit;
        resp.ele = X("pagination1");
        resp.evt = "gotoPage1";
        X.pub('pagination', resp);
        X.pub("resizePanel2", $("#c-panel01 .c-content"));
        X.pub("closeDialog");
    }

    function gotoPage1(evt, page) {
        X.dialogLoading();
        start = page.start;
        X.get(scoreList + "?projId=" + expId + "&start=" + page.start, onGetScore);
    }
    X.sub('gotoPage1', gotoPage1);

    $("#c-panel01 .close-cpanel").click(function() {
        $("#c-panel01").hide();
    });
});