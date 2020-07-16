/**
 * My module:
 *  我的项目选课
 */
X.sub("init", function() {
    //变量
    var itemList = '/index/user/project_list';
    var scoreList = "/open/session/api/score/user/search";
    var limit = 6;
    var qt = '&projectTitle=0';
    var user = {};
    var ulist = $("#uList");
    var projectId = "";
    var STATUS = ["","完成","未完成"];

    // 检查当前语言

    function checkLang() {
        if (LANG == "EN") {
            document.title = EN.my.myProjects;
            $("input[name='title']").attr("placeholder", EN.projectInfo.proTitle);
            $(".s-btn").val(EN.public.search);
        }
    }
    checkLang();

    loadContent();

    /*搜索*/
    $(".s-btn").off('click').on('click', function() {
        qt = '';
        var f = X('searchSection');
        if (f.title.value !== ' ' && f.title.value !== '') {
                qt += '&projectTitle=' + f.title.value;
        }else{
            qt += '&projectTitle=0';
        }
        loadContent();
    });

    /**
     * 获取课程列表
     **/
    function loadContent() {
        X.get(uri_pipe(itemList + '?start=0&limit=' + limit + qt), onContentLoaded);
    }

    /**
     * 分页显示
     **/
    function gotoPage(evt, page) {
        X.get(uri_pipe(itemList + '?sortby=id&reverse=true&del=2&username=' + user.username + '&limit=' + limit + '&start=' + page.start + qt), onContentLoaded);
    }

    X.sub('gotoPage', gotoPage);

    /**
     * 展示选课列表
     **/
    function onContentLoaded(resp) {
        var resp = JSON.parse(resp);
        resp = resp.result;
        // resp.meta = resp.meta || {
        //     total: resp.total,
        //     size: resp.size
        // };
        var res = '';
        var ele = $('#list');
        if (resp.meta.total === 0) {
            res += '<div class="noitems">' + ("暂无学习的项目") + '</div>';
        } else {
            for (var i = 0; i < parseInt(resp.meta.size); i++) {
                var item = resp.data[i];
                console.log(item);
                res += '<li class="clearfix">';
                res += '<div class="cover">';
                res += '<img src="' + (item.equip_pic || "/static/index/pic/img.jpg") + '" onerror="this.src=\'/static/index/pic/img.jpg\'"></img>';
                res += '</div>';
                res += '<div class="info">';
                res += '<div class="project-title">' + (item.subject_name || "") + '</div>';
                res += '<div class="project-level">';
                // res += '<span class="proLevel">' + (LANG == "EN" ? EN.projectInfo.rank : "申报级别") + '：<i>' + (LANG == "EN"?(get_title(EN_PROJECT_LEVEL, item.projectInfo.proLevel) || "-"):(get_title(PROJECT_LEVEL, item.projectInfo.proLevel) || "-")) + '</i></span>';
                res += '<span class="incharge">负责人：<i>' + (item.person_charge || "-") + '</i></span>';
                res += '</div>';
                res += '<div class="project-brief"><span class="brief-title">项目简介：</span>' + (sb_substr(item.subject_brief, 20, true) || "-") + '</div>';
                res += '<div class="btns">';
                res += '<a href="/index/subject/detail?id=' + item.subject_id + '&isView=true" class="go-project btn">进入项目</a>';
                res += '<span class="rm-project btn" onclick="X.pub(\'delete\',{\'id\':\'' + item.id + '\'})">退出选课</span>';
                res += '<span class="rm-project btn" onclick="X.pub(\'showScore\',{\'id\':\'' + item.id + '\'})">我的成绩</span>';
                res += '</div>';
                res += '</li>';
            }
        }
        $('#list').html(res);
        //分页
        resp.limit = limit;
        resp.evt = "gotoPage";
        resp.ele = X("pagination", true);
        X.pub('pagination', resp);
    }

    //退选

    function delConfirm(evt, obj) {
        var show = {};
        if (LANG == "EN") {
            show.msg = EN.projectInfo.quitTip;
            show.title = EN.public.prompt;
            show.okText = EN.public.confirm;
            show.closeText = EN.public.cancel;
        } else {
            show.msg = "是否确认要退出本项目的学习？";
            show.title = "提示";
        }
        show.callback = function() {
            var item = {};
            item.id = obj.id;
            X.post('/api/project/learn/remove', item, function(resp) {
                resp = JSON.parse(resp);
                if (resp.code === 0) {
                    loadContent();
                } else {
                    if (LANG == "EN") {
                        en_error(EN.public.operationFailed + "（" + resp.msg + "）");
                    } else {
                        X.error("操作失败（" + resp.msg + "）");
                    }
                }
            });
        };
        alertMsg(show.msg, obj.id)
        //X.pub('showDialog', show);
    }
    X.sub('delete', delConfirm);

    //我的成绩
    X.sub("showScore", function(evt, obj) {
        /* X.dialogLoading(); */
        projectId = obj.id;
        X.get(scoreList + "?projId=" + obj.id, onGetScore);
        $("#c-panel").show();
    });

    function onGetScore(resp) {
        resp = JSON.parse(resp);

        resp.meta = resp.meta || {
            total: "0"
        };
        var res = "";
        if (resp.meta.total == "0") {
            res += "<div class='noitems'>暂无数据</div>";
        } else {
            var size = parseInt(resp.meta.size);
            res += "<table><tr class='l_header'><th class='itemTitle'>子实验名称</th><th class='itemCategory'>实验结果</th><th class='itemTitle'>实验成绩</th><th class='itemTitle'>实验开始时间</th><th class='itemTitle'>实验结束时间</th><th class='itemTitle'>实验用时</th><th class='action'>实验报告</th></tr>";
            for (var i = 0; i < size; ++i) {
                var item = resp.data[i];
                res += '<tr>';
                res += '<td class="itemStatus">' + (item.childProjectTitle || "-") + '</td>';
                res += '<td class="itemStatus">' + (STATUS[item.status] || "-") + '</td>';
                res += '<td class="itemStatus">' + (item.score + "" || "-") + '</td>';
                res += '<td class="itemStatus">' + (moment(item.startDate).format("YYYY-MM-DD HH:mm:ss") || "-") + '</td>';
                res += '<td class="itemStatus">' + (moment(item.endDate).format("YYYY-MM-DD HH:mm:ss") || "-") + '</td>';
                res += '<td class="itemStatus">' + (item.timeUsed || "-") + '</td>';
                res += '<td class="action">';
                if (!item.attachmentId) {
                    res += '-';
                } else {
                    res += '<a class="set" href="/project/log/attachment?id=' + item.attachmentId + '&download=true" target="_blank">下载</a>';
                }
                res += '</td>';
                res += '</tr>';
            }
            res += "</table>";
        }
        ulist.html(res);
        resp.limit = limit;
        resp.ele = X("pagination1");
        resp.evt = "gotoPage1";
        X.pub('pagination', resp);

        X.pub("resizePanel2");
        X.pub("closeDialog");
    }

    function gotoPage1(evt, page) {
        X.dialogLoading();
        X.get(scoreList + "?projId=" + projectId + '&start=' + page.start, onGetScore);
    }
    X.sub('gotoPage1', gotoPage1);

    $("#c-panel .close-cpanel").click(function() {
        $("#c-panel").hide();
    });

    //弹窗
    function alertMsg(ymsg, id){
        $("#dialog_overlay").css("visibility","visible")
        $("#dialog_close").css("display","block");
        $("#dialog_control").css("display","flex")
        $("#dialog_content").text(ymsg);
        $("#dialog_close").on('click',function(){
            $("#dialog_overlay").css("visibility","hidden")
        })
        $("#dialog_ok").on('click',function(){
            $.post('/index/user/out_project', {id:id}, function(resp) {
                // resp = JSON.parse(resp);
                if (resp.code === 0) {
                    window.location.href='/index/user/project_learn';
                } else {
                    X.error("操作失败（" + resp.msg + "）");
                }
            });
        })
    }
});
