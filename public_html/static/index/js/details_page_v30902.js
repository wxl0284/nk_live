/**
 * details v3
 */
X.sub("init", function() {
    moment.locale('zh_cn');
    var vid = X.qs.id;
    var timer;
    var limit = 5;
    var user = {};
    var isLogged = false;
    var qt = '&category=0';
    var DEFAULT_AVATAR = "/static/index/images/user.png";
    var ONERROR_IMG = "/images/default.jpg";
    var project = {};
    var isReply = false;
    var reply = {};
    var inChargeInfo = {};
    var projectInfo = {};
    var stat = {};
    var SCORE_TEXT = ["", "失望", "不满", "一般", "满意", "惊喜"];
    var EN_SCORE_TEXT = ["", EN.detail.disappoint, EN.detail.discontent, EN.detail.general, EN.detail.satisfaction, EN.detail.surprise];
    var SEARCH_USERNAME = "";
    var EVALUATE_TYPE = ["", "好评", "差评"];
    var EN_EVALUATE_TYPE = ["", EN.detail.good, EN.detail.bad];
    var clickState = false;
    var videoType = "1"; //切换项目视频类型：1-项目简介视频 2-项目引导视频
    
    
      
 
    document.oncontextmenu = function(evt) {
        evt.preventDefault();
    };

    document.onselectstart = function(evt) {
        evt.preventDefault();
    };

    // $("#detailsPageInfo").width($(".details-page-container").width() - parseInt($("#detailsPageInfo").css("paddingLeft")) - parseInt($("#detailsPageInfo").css("paddingRight")));

    /* 判断是否登录 */
    X.sub('userNotLogin', function() {
        setTimeout(function() {
            count();
        }, 2000);
        
    });
    loadContent();

    X.sub('userLogged', function(evt, respText) {
        user = respText;
        isLogged = true;
        setTimeout(function() {
            count();
        }, 2000);
        loadContent();
    });


    /* 统计浏览次数 */
    function count() {
        var item = {};
        item.name = user.name;
        item.userId = user.id;
        item.role = user.role;
        item.id = X.qs.id;
    }

    function loadContent() {
        X.get('/index/subject/detail_up?id=' + vid, onGetContent);
    }

    function refreshContent(cb) {
        X.get('/index/subject/detail_up?id=' + vid, function(respText) {
            var resp = JSON.parse(respText);
            project = resp.result;
            cb();
        });
    }

    function onGetContent(respText) {
        var resp = JSON.parse(respText);
        var item = resp.result;
        // item.videoPath = item.videoPath || "";
        // item.guideVideo = item.guideVideo || "";
        // item.sps1 = item.sps1 || {};
        // item.sps2 = item.sps2 || {};
        // item.expSub01 = item.expSub01 || {};
        // item.expSub02 = item.expSub02 || {};
        // item.expSub03 = item.expSub03 || {};
        // item.schoolInfo = item.schoolInfo || {};
        // item.orderTime = item.orderTime || [];
         project = item;
        
      
        var res = '';
        res += '<div>';
        res += '<h1 class="details-page-info-title">' + (item.subject_name || "") + '</h1>';
        res += '<div class="details-page-info-score" id="infoScore"></div>';
        res += '</div>';
        res += '<ul class="details-page-info-tags">';
        res += '<li>' + ("所属专业类：" + (item.cat_name1 || "")) + '</li>';
        res += '<li>' + ("对应专业：" + (item.cat_name || "")) + '</li>';
        res += '<li>' + ("学校：" + (item.school_name || "")) + '</li>';
        res += '<li>' + ("负责人：" + (item.person_charge || ""))+ '</li>';
        res += '<li>' + ("试用账号：" + (item.trial_account || "")) + '</li>';
        res += '<li>' + ("试用密码：" + (item.trial_pass || "")) + '</li>';
        res += '</ul>';
        res += '<div class="details-page-info-description">';
        res += '<p>' +  (sb_substr(item.subject_brief) || "") + '</p>';
        res += '</div>';
        res += '<div class="details-page-info-btns">';
        res += '<button type="button" class="btn btn-primary details-page-info-do-btn" id="doBtn" onclick="X.pub(\'goTolink\',\'http://vschemlabsalen.hunnu.edu.cn\')"></button>';
        res += '<button type="button" class="btn btn-white btn-opacity" id="collectionBtn"><i class="iconfont"></i></button>';
        res += '<button type="button" class="btn btn-white btn-opacity" id="likeBtn"><i class="iconfont"></i></button>';
        /* res += '<button type="button" class="btn btn-white btn-opacity" id="likeBtn"><i class="iconfont"></i>（' + item.like + '）</button>'; */
        res += '</div>';

        $("#detailsInfo").html(res);
        
        // 判断项目视频是否加工完
        function checkVideo(type) {
           //console.log(type);
            var dom = $("#video01");
            var res2 = '<video id="videoPlayer" class="video-js vjs-default-skin vjs-big-play-centered video-player details-page-thumb-video" controls="controls" preload="none">';
            if(type == 1 || type == 3){
                res2 += '<source src="' + item.subject_brief_video + '" type="video/mp4" />';
                var poster = item.subject_brief_img;
            }
            if(type == 2 || type == 4){
                res2 += '<source src="' + item.subject_lead_video + '" type="video/mp4" />';
                var poster = item.subject_lead_img;
            }
            
            res2 += '</video>';
            if(type == 1){
                res2 += '<span id="changeVideo" class=""><img src="/static/index/pic/change_jt.png" /></span>';
                res2 += '<span id="changeVideo2" class="myvideo_hidden"><img src="/static/index/pic/change_jt.png" /></span>';
            }
            if(type == 2){
                res2 += '<span id="changeVideo" class="myvideo_hidden"><img src="/static/index/pic/change_jt.png" /></span>';
                res2 += '<span id="changeVideo2" class="myvideo_visible"><img src="/static/index/pic/change_jt.png" /></span>';
            }
            dom.html(res2);
            //视频
            var options = {
                controls: true,
                bigPlayButton: true,
                controlBar: true,
                loadingSpinner: true,
                preload: 'none',
                poster: "/"+poster
            };
            var videoPlayer = videojs.getPlayers()["videoPlayer"];
            if (videoPlayer) {
                if (videoPlayer.options_) {
                    videoPlayer.dispose();
                }
            }
            var player = videojs('videoPlayer', options, function() {
                this.volume(0.5);
            });
        }
        if(item.subject_brief_img && item.subject_brief_video && (item.subject_lead_img && item.subject_lead_video)){
            console.log("111");
            checkVideo(1);
        }

        if((item.subject_brief_img && item.subject_brief_video) && (!item.subject_lead_img || !item.subject_lead_video)){
            console.log("222");
            checkVideo(3);
        }

        if((!item.subject_brief_img || !item.subject_brief_video) && (item.subject_lead_img && item.subject_lead_video)){
            console.log("3333");
            checkVideo(4);
        }
        

        $(document).on("click","#changeVideo",function(){
            console.log("1111");
            $("#videoPlayer").addClass("myvideo_hidden").siblings().removeClass("myvideo_hidden");
            $(this).addClass("myvideo_hidden").siblings().removeClass("myvideo_hidden");
            $("#videoPlayer2").addClass("myvideo_visible").siblings().removeClass("myvideo_visible");
            $("#changeVideo2").addClass("myvideo_visible").siblings().removeClass("myvideo_visible");
            console.log("2222");
            if(item.subject_brief_img && item.subject_brief_video){
                checkVideo(2);
            }
        });

        $(document).on("click","#changeVideo2",function(){
            console.log("3333");
            $("#videoPlayer2").addClass("myvideo_hidden").siblings().removeClass("myvideo_hidden");
            $(this).addClass("myvideo_hidden").siblings().removeClass("myvideo_hidden");
            $("#videoPlayer").addClass("myvideo_visible").siblings().removeClass("myvideo_visible");
            $("#changeVideo").addClass("myvideo_visible").siblings().removeClass("myvideo_visible");
            console.log("4444");
            if(item.subject_lead_img && item.subject_lead_video){
                checkVideo(1);
            }
        });

        // 切换项目视频
        $(".videoTab>a").off('click').on('click', function() {
            if (!$(this).hasClass("on")) {
                $(this).addClass("on").siblings().removeClass("on");
                videoType = $(this).data("video-type");
                checkVideo();
            }
        });

        loadStat();
        initInfoScore(); // 加载星级评分
        initTabNav(); // 加载右侧模块
        //checkCollection(); //检测是否收藏
        if (isLogged) {
            checkCollection(); //检测是否收藏
        }

        // 我要做实验
        X.sub('goTolink', function(evt, url) {
            console.log(item);

            X.post("/index/subject/examine", {
                "id": "" + X.qs.id
            }, function(resp) {
                resp = JSON.parse(resp);
                if (resp.code == '200') {
                    gotoConfirm(resp.result);
                } else {
                    X.error(resp.msg);
                }
            })
        });

        function gotoConfirm(url) {
            var item = {};
                item.title = "跳转提示";
                item.msg = '<p class="goLink-tip">您将要离开本站前往其他网站，确认请点击下面的链接。</p><p class="goLink-link" onclick="X.pub(\'closeDialog\')"><a href="' + url + '" target="_blank">' + url + '</a></p>';
                item.okText = "取消";
            item.noCancel = true;
            X.pub("showDialog", item);
        }


        // 点赞
        $("#likeBtn").unbind().on("click", function() {
            if (project.status == "0") {
                X.error("项目未发布！");
            }
          
            var item = {};
            item.id = X.qs.id;
            X.post("/index/subject/like_add", item, function(resp) {
                resp = JSON.parse(resp);
                if(resp.code == 100){
                    toLogin();
                    return;
                }else{
                    X.dialog(resp.msg); 
                    /* loadContent();
                    refreshContent(function() {
                        loadStat();
                    }); */
                }
            }, function(code) {
                toLogin();
            });
            
        });

        // 收藏
        $("#collectionBtn").off('click').on("click", function() {
            if (project.status == "0") {
                X.error("项目未发布！");
                return;
            }
            var item = {};
            item.id = X.qs.id;
            X.post("/index/subject/collection_add", item, function(resp) {
                resp = JSON.parse(resp);
                if(resp.code == 100){
                    toLogin();
                    return;
                }else{
                    X.dialog(resp.msg);
                }
            }, function(code) {
                toLogin();
            });
        });
    }

    function loadStat() {
        var div = '';
        div += '<div class="stat_main">';
        div += '<div class="details-page-stat-box">';
        div += '<h3 class="details-page-stat-title">共享应用</h3>';
        div += '<ul class="details-page-stat-shared">';
        div += '<li class="first">';
        div += '<div class="icon"><i class="iconfont"></i></div>';
        div += '<div class="label">浏览量 <span>' + (project.browse || 0) + '</span></div>';
        div += '</li>';
        div += '<li class="second">';
        div += '<div class="icon"><i class="iconfont"></i></div>';
        div += '<div class="label">点赞数<span>' + (project.like || 0) + '</span></div>';
        div += '</li>';
        div += '<li class="third">';
        div += '<div class="icon"><i class="iconfont"></i></div>';
        div += '<div class="label">收藏数<span>' + (project.collect || 0) + '</span></div>';
        div += '</li>';
        div += '</ul>';
        div += '</div>';
        div += '<div class="details-page-stat-box">';
        div += '<h3 class="details-page-stat-title">实验评分</h3>';
        div += '<div class="details-page-stat-evaluate" id="evaluate">加载中...';
        // div += '<div class="go-evaluate" style="margin-bottom:0;">';
        // div += '<div class="number">4.9</div>';
        // div += '<div class="star">';
        // div += '<div class="starbox"><span class="star yes"></span>';
        // div += '<span class="star yes"></span><span class="star yes"></span>';
        // div += '<span class="star yes"></span><span class="star yes"></span></div>';
        // div += '<span class="txt">22130 人评分<span></span></span>';
        //div += ' </div></div></div></div>';
        div += '</div></div>';
        div += '<div class="details-page-stat-box">';
        div += '<h3 class="details-page-stat-title">实验评价</h3>';
        div += '<ul class="details-page-stat-shared">';
        div += '<li class="first">';
        div += '<div class="icon pinglun"><i class="iconfont"></i></div>';
        div += '<div class="label">评论数<span>' + (project.evaluate || 0) + '</span></div>';
        div += '</li>';
        div += '</ul>';
        div += '<hr />';
        div += '<div id="evaluate-box"></div>';
        div += '</div></div>';
        $('#stat').html(div);
        checkProjectScore(initEvaluate);
        checkProjectEvaluate();
    }

    function onSubmitEvaluate() {
        $("#btn-subComment").off('click').on('click', function() {
            var aForm = X("commentForm");
            var item = {};
            item.id = X.qs.id || "";
            item.comment = aForm.comment.value || "";
          
            if (!item.comment.length) {
                X.error("请填写评价");
                return;
            }
            if (item.comment.length > 200) {
                X.error("评价字数超出限制");
                return;
            }
            X.post('/index/subject/evaluate_add', item, function(res) {
                res = JSON.parse(res);
                if (res.code == "200") {
                    X.dialog(res.msg);
                    loadContent();
                    refreshContent(function() {
                        loadStat();
                    });
                } else {
                    X.dialog("评价提交错误");
                    return false;
                }
            });
        });
      
    }

    $('body').on('keyup', '#commentForm textarea[name=comment]', function() {
        var $this = $(this);
        countWords($this.val(), 200, $('#commentForm #textMaxNumber1'), "cn");
    });

    function checkProjectEvaluate() {
        var div = '';
       // if (user.name) { //未登录
            div += '<h5 class="evaluate_tip">我要评价</h5>';
            div += '<div class="details-page-discuss-submit">';
            div += '<form class="details-page-discuss-submit-form" id="commentForm" onsubmit="return false;">';
            div += '<textarea rows="8" class="form-control" name="comment" placeholder="输入评价内容..."></textarea>';
            div += '<div style="font-size:12px;color:#666;" id="textMaxNumber1"></div>';
            div += '<button type="submit" class="btn btn-primary" id="btn-subComment">发表评价</button>';
            div += '</form>';
            div += '</div>';
            $("#evaluate-box").html(div);
            onSubmitEvaluate();
        // } else {
        //     X.get("/index/subject/evaluate?id=" + X.qs.id, function(resp) {
        //         resp = JSON.parse(resp);
        //         if (resp.code == '200') {
        //             var evaluate = resp.result;
        //             div += '<p class="evaluate_content">' + (evaluate.content || "") + '</p>';
        //             div += '<p class="evaluate_time">' + evaluate.create_time + '</p>';
        //             div += '<p class="evaluate_time">' + (evaluate.name || "") + '</p>';
        //         } else {
        //             div += '<h5 class="evaluate_tip">我要评价</h5>';
        //             div += '<div class="details-page-discuss-submit">';
        //             div += '<form class="details-page-discuss-submit-form" id="commentForm" onsubmit="return false;">';
        //             div += '<textarea rows="8" class="form-control" name="comment" placeholder="输入评价内容..."></textarea>';
        //             div += '<div style="font-size:12px;color:#666;" id="textMaxNumber1"></div>';
        //             div += '<button type="submit" class="btn btn-primary" id="btn-subComment">发表评价</button>';
        //             div += '</form>';
        //             div += '</div>';
        //         }
        //         $("#evaluate-box").html(div);
        //         onSubmitEvaluate();
        //     });
        // }
    }

    /* 星级评分 */
    function initInfoScore() {
        var res = '<div class="starbox left">';
        for (var i = 0; i < 5; i++) {
            if (i < project.score) {
                res += '<span class="star yes"></span>';
            } else {
                res += '<span class="star no"></span>';
            }
        }
        res += '</div>';
        res += '<span class="num">(<em>' + project.score + '</em>)分</span>';
        $('#infoScore').html(res);
    }

    /* 检查是否收藏 */
    function checkCollection() {
        X.get(uri_pipe('/index/subject/is_collection?id=' + X.qs.id), function(resp) {
            resp = JSON.parse(resp);
            if (resp.result == "200") {
                $("#collectionBtn").addClass("on").html('<i class="iconfont">&#xe707;</i>取消收藏');
            } else {
                $("#collectionBtn").removeClass("on").html('<i class="iconfont">&#xe707;</i>收藏');
            }
        });
    }

  
    var category = category || "0";

    function initTabNav() {
        var div = '';
        div += '<button type="button" data-category="0" class="btn btn-default ' + ((category === "0") ? "active" : "") + '">项目团队</button>';
        div += '<button type="button" data-category="1" class="btn btn-default ' + ((category === "1") ? "active" : "") + '">项目描述</button>';
        div += '<button type="button" data-category="4" class="btn btn-default ' + ((category === "4") ? "active" : "") + '">网络要求</button>';
        div += '<button type="button" data-category="5" class="btn btn-default ' + ((category === "5") ? "active" : "") + '">技术架构</button>';
        div += '<button type="button" data-category="2" class="btn btn-default ' + ((category === "2") ? "active" : "") + '">项目特色</button>';
        div += '<button type="button" data-category="3" class="btn btn-default ' + ((category === "3") ? "active" : "") + '">服务计划</button>';
        div += '<button type="button" data-category="7" class="btn btn-default ' + ((category === "7") ? "active" : "") + '">项目申报</button>';
        div += '<button type="button" id="more_citizen" data-category="6" class="btn btn-default ' + ((category === "6") ? "active" : "") + '">更多评论</button>';
        $('#tabNav').html(div);
        checkLoadedInfo();
    }

    function checkLoadedInfo() {
        onTabLoading();
        if (typeof projectInfo[category] == 'undefined') {
            getProjectInfo(function() {
                onTab();
            });
        } else {;
            onTab();
        }
    }

    function onTab() {
        getProjectInfo(function() {
            projectInfo[category] = projectInfo[category] || {};
            var resourceId = projectInfo[category].resourceId || "";
            if (!resourceId) {
                switch (category) {
                    case "0":
                        getInChargeInfo();
                        break;
                    case "1":
                        initProjectRecord();
                        break;
                    case "2":
                        initProjectFeature();
                        break;
                    case "3":
                        initProjectBuilding();
                        break;
                    case "4":
                        initProjectNetwork();
                        break;
                    case "5":
                        initProjectSchema();
                        break;
                    case "6":
                        initMoreCitizen();
                    case "7":
                        initProjectApplication();
                }
            } else {
                $('#detailsPageInfo').html('<div id="playerContent"></div>');
                X.pub("projectResPreview", resourceId);
                onTabLoaded();
            }
            setCuttle(); // 各模块内容超过限高后设置折叠
        });
    }

    function setCuttle() {
        var dom = $(".part-content");
        for (var i = 0; i < dom.length; i++) {
            var domItem = dom.eq(i);
            if (domItem.outerHeight() > 500) {
                domItem.css({
                    height: "500px"
                }).append('<div class="moreBox"><a href="javascript:;" title="查看更多" class="showMore"><span>查看更多<i class="iconfont">&#xe8c8;</i><span></a></div>');
            }
        }
        $(".showMore").off('click').on('click', function() {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                $(this).parents(".part-content").css({
                    height: "500px",
                    paddingBottom: "20px"
                });
                $(this).attr("title", "查看更多").find("span").fadeOut('fast').html('<span>查看更多<i class="iconfont">&#xe8c8;</i><span>').fadeIn('fast');
            } else {
                $(this).addClass("active");
                $(this).parents(".part-content").css({
                    height: "auto",
                    paddingBottom: "40px"
                });
                $(this).attr("title", "收起更多").find("span").fadeOut('fast').html('<span>收起更多<i class="iconfont">&#xe8d8;</i></span>').fadeIn('fast');
            }
        });
    }

    $('body').off('click', '#tabNav button').on('click', '#tabNav button', function(e) {
        e.preventDefault();
        if (clickState) {
            return;
        }
        clickState = true;
        X.dialogLoading();
        var $this = $(this);
        category = $this.data('category');
        category = String(category);
        initTabNav();
    });

    function onTabLoading() {
        $('#infoModal').find('#detailsPageInfo').addClass('onloading');
    }

    function onTabLoaded() {
        $('#infoModal').find('#detailsPageInfo').removeClass('onloading');
        X.pub("closeDialog");
        clickState = false;
    }

    function getProjectInfo(load) {
        load = load || function() {};
        X.get('/index/subject/detail_up?id=' + vid, function(resp) {
            resp = JSON.parse(resp);
            resp = resp.result;
            resp.infoId = resp.id || "";
            projectInfo = resp;
            load();
            // if (resp.infoId.length) {
            //     X.get("/large/text/get?id=" + resp.infoId, function(res) {
            //         res = JSON.parse(res);
            //         resp.body = res || {};
            //         projectInfo[category] = resp;
            //         load();
            //     });
            // } else {
            //     projectInfo[category] = resp;
            //     load();
            // }
           
        });
    }

    function getInChargeInfo() {
        inChargeInfo = project || {};
        var div = '<div class="incharge-info">';
        div += '<p class="part-title" style="margin-top:5px;">实验教学项目负责人情况</p>';
        div += '<table class="table table-bordered part-table">';
        if (project.status == "0") { // 项目未发布
            div += '<tr>';
            div += '<th>姓名</th><td>' + (inChargeInfo.person_charge || "无") + '</td>';
            div += '<th>性别</th><td>' + (inChargeInfo.gender || "无") + '</td>';
            if (inChargeInfo.birth_day !== null && inChargeInfo.birth_day !== "" && inChargeInfo.birth_day != " " && inChargeInfo.birth_day !== undefined) {
                div += '<th>出生年月</th><td>' + inChargeInfo.birth_day + '</td>';
            } else {
                div += '<th>出生年月</th><td>无</td>';
            }
            div += '</tr>';
            div += '<tr>';
            div += '<th>学历</th><td>' + (inChargeInfo.educate || "无") + '</td>';
            div += '<th>学位</th><td>' + (inChargeInfo.junior_college || "无") + '</td>';
            div += '<th>电话</th><td>' + (inChargeInfo.phone || "无") + '</td>';
            div += '</tr>';
            div += '<tr>';
            if (inChargeInfo.skill_work) {
                div += '<th>专业技术职务</th><td>' + inChargeInfo.skill_work + '</td>';
            } else {
                div += '<th>专业技术职务</th><td>-</td>';
            }
            div += '<th>行政职务</th><td>' + (inChargeInfo.administration_work || "无") + '</td>';
            div += '<th>手机</th><td>' + (inChargeInfo.mobile || "无") + '</td>';
            div += '</tr>';
            div += '<th>院系</th><td>' + (inChargeInfo.college || "无") + '</td>';
            div += '<th>电子邮箱</th><td>' + (inChargeInfo.email || "无") + '</td>';
            div += '<th>邮编</th><td>' + (inChargeInfo.postal_code || "无") + '</td>';
            div += '</tr>';
            div += '<tr>';
            div += '<th>地址</th><td colspan="5">' + (inChargeInfo.address || "无") + '</td>';
            div += '</tr>';
        } else if (project.status == "1") { // 项目已发布
            div += '<tr>';
            div += '<th>姓名</th><td>' + (inChargeInfo.person_charge || "无") + '</td>';
            div += '<th>性别</th><td>' + (inChargeInfo.gender || "无") + '</td>';
            if (inChargeInfo.birth_day !== null && inChargeInfo.birth_day !== "" && inChargeInfo.birth_day != " " && inChargeInfo.birth_day !== undefined) {
                div += '<th>出生年月</th><td>' + inChargeInfo.birth_day + '</td>';
            } else {
                div += '<th>出生年月</th><td>无</td>';
            }
            div += '</tr>';
            div += '<tr>';
            div += '<th>学历</th><td>' + (inChargeInfo.educate || "无") + '</td>';
            div += '<th>学位</th><td>' + (inChargeInfo.junior_college || "无") + '</td>';
            if (inChargeInfo.skill_work) {
                div += '<th>专业技术职务</th><td>' + inChargeInfo.skill_work + '</td>';
            } else {
                div += '<th>专业技术职务</th><td>-</td>';
            }
            div += '</tr>';
            div += '<tr>';
            div += '<th>行政职务</th><td>' + (inChargeInfo.administration_work || "无") + '</td>';
            div += '<th>院系</th><td>' + (inChargeInfo.college || "无") + '</td>';
            div += '<th>邮编</th><td>' + (inChargeInfo.postal_code || "无") + '</td>';
            div += '</tr>';
            div += '<tr>';
            div += '<th>地址</th><td colspan="5">' + (inChargeInfo.address || "无") + '</td>';
            div += '</tr>';
        }
        div += '</table>';
        div += '<p class="part-title">教学研究情况</p>';
        div += '<div class="part-content"><p class="fangsong">（主持的教学研究课题（含课题名称、来源、年限，不超过5项）；作为第一署名人在国内外公开发行的刊物上发表的教学研究论文（含题目、刊物名称、时间，不超过10项）；获得的教学表彰/奖励（不超过5项））</p>' + (inChargeInfo.teach_reseatch || "暂无内容") + '</div>';
        div += '<p class="part-title">学术研究情况</p>';
        div += '<div class="part-content"><p class="fangsong">（近五年来承担的学术研究课题（含课题名称、来源、年限、本人所起作用，不超过5项）；在国内外公开发行刊物上发表的学术论文（含题目、刊物名称、署名次序与时间，不超过5项）；获得的学术研究表彰/奖励（含奖项名称、授予单位、署名次序、时间，不超过5项））</p>' + (inChargeInfo.academic_research || "暂无内容") + '</div>';
        div += '<p class="part-title">实验教学项目教学服务团队情况</p>';
        div += '<div class="part-table-responsive">';
        div += '<table class="part-table" id="mainTable"></table>';
        div += '</div>';
        div += '<ul id="pagination3" class="cN-pagination"></ul>';
        div += '<div class="part-table-responsive">';
        div += '<table class="part-table" id="otherTable"></table>';
        div += '</div>';
        div += '<ul id="pagination4" class="cN-pagination"></ul>';
        div += '<p class="part-tip">';
        div += '项目团队总人数：<span class="teamPeoTotal" id="teamPeoTotal">'+(inChargeInfo.total_team || 0)+'</span>人';
        div += '<i style="margin:0 8px;"></i>高校人员数量：<span class="schoolPeoNum" id="schoolPeoNum">'+(inChargeInfo.personnel1 || 0)+'</span>人';
        div += '<i style="margin:0 8px;"></i>企业人员数量：<span class="societyPeoNum" id="societyPeoNum">'+(inChargeInfo.personnel2 || 0)+'</span>人';
        div += '</p>';
        div += '<p class="fangsong">注：1.教学服务团队成员所在单位需如实填写，可与负责人不在同一单位。</p>';
        div += '<p class="fangsong" style="margin-left:2em;">2.教学服务团队须有在线教学服务人员和技术支持人员，请在备注中说明。</p>';
        div += '</div>';
        $('#detailsPageInfo').html(div);
        getMainMember();
    }


    /*获取团队主要成员*/
    var mainStart = 1;
    function getMainMember() {
        X.get('/index/subject/team_major?status=1&memberType=1&start=0&limit=' + limit + '&id=' + vid, onGetMainMember);
    }

    function onGetMainMember(respText) {
        // console.log("------------");
        // console.log(respText);
        var resp = JSON.parse(respText);
        resp = resp.result;
        resp.meta = resp.meta || {
            total: "0",
            size: "0"
        };
        var divTh = '<caption>团队主要成员（除负责人外，5人以内）</caption>';
        divTh += '<tr><th style="width:45px;">序号</th><th>姓名</th><th>所在单位</th><th>专业技术职务</th><th>行政职务</th><th>承担任务</th><th>备注</th></tr>';
        var main = '',
            div = '';
        if (resp.meta && resp.meta.total != "0") {
            var size = parseInt(resp.meta.size);
            var num = 1;
            mainStart--;
            for (var i = 0; i < size; i++) {
                var teamItem = resp.data[i];
               
                div += '<tr>';
                div += '<td style="width:45px;">' + (++mainStart) + '</td>';
                div += '<td>' + (teamItem.name || "-") + '</td>';
                div += '<td>' + (teamItem.unit || "-") + '</td>';
                div += '<td>' + (teamItem.skill_work || "-") + '</td>';
                div += '<td>' + (teamItem.administration_work || "-") + '</td>';
                div += '<td>' + (teamItem.ready_task || "-") + '</td>';
                div += '<td>' + (teamItem.mark || "-") + '</td>';
                div += '</tr>';
                
            }
        } else {
            div += '<tr><td colspan="7"><span class="text-muted">暂无数据</span></td></tr>';
        }
        $('#mainTable').html(divTh + main + div);
        resp.limit = limit;
        resp.evt = "gotoMainMemberPage";
        resp.ele = X("pagination3", true);
        X.pub('pagination', resp);
        getOtherMember();
    }

    function gotoMainMemberPage(evt, page) {
        mainStart = page.start;
        X.get('/index/subject/team_major?status=1&memberType=1&limit=' + limit + '&id=' + vid + '&start=' + page.start + qt, onGetMainMember);
    }
    X.sub('gotoMainMemberPage', gotoMainMemberPage);

    /*获取团队其他成员*/
    var otherStart = 1;
    function getOtherMember() {
        X.get('/index/subject/team_other?status=1&memberType=2&limit=' + limit + '&id=' + vid + "&start=0", onGetOtherMember);
    }

    function onGetOtherMember(respText) {
        var resp = JSON.parse(respText);
        resp = resp.result;
        resp.meta = resp.meta || {
            total: "0",
            size: "0"
        };
        var div = '<caption>团队其他成员</caption>';
        div += '<tr><th style="width:45px;">序号</th><th>姓名</th><th>所在单位</th><th>专业技术职务</th><th>行政职务</th><th>承担任务</th><th>备注</th></tr>';
        if (resp.meta && resp.meta.total != "0") {
            var size = parseInt(resp.meta.size);
            otherStart--;
            for (var i = 0; i < size; i++) {
                var teamItem = resp.data[i];
                div += '<tr>';
                div += '<td style="width:45px;">' + (++otherStart) + '</td>';
                div += '<td>' + (teamItem.name || "-") + '</td>';
                div += '<td>' + (teamItem.unit || "-") + '</td>';
                div += '<td>' + (teamItem.skill_work || "-") + '</td>';
                div += '<td>' + (teamItem.administration_work || "-") + '</td>';
                div += '<td>' + (teamItem.ready_task || "-") + '</td>';
                div += '<td>' + (teamItem.mark || "-") + '</td>';
                div += '</tr>';
            }
        } else {
            div += '<tr><td colspan="7"><span class="text-muted">暂无数据</span></td></tr>';
        }
        $('#otherTable').html(div);
        resp.limit = limit;
        resp.evt = "gotoOtherMemberPage";
        resp.ele = X("pagination4", true);
        X.pub('pagination', resp);
        onTabLoaded();
    }

    function gotoOtherMemberPage(evt, page) {
        otherStart = page.start;
        X.get('/index/subject/team_other?status=1&memberType=2&limit=' + limit + '&id=' + vid + '&start=' + page.start + qt, onGetOtherMember);
    }
    X.sub('gotoOtherMemberPage', gotoOtherMemberPage);

    /* category=1 */
    function initProjectRecord() {
        var div = '<div style="padding:20px;">';
        div += '<p class="part-title">实验目的</p>';
        div += '<div class="part-content">' + (projectInfo.desc_purpose || "暂无内容") + '</div>';

        div += '<p class="part-title">实验原理</p>';
        div += '<div class="part-content">';
        div += '<div class="content-text">' + (projectInfo.desc_principle || "暂无内容") + '</div>';
        div += '</div>';

        div += '<p class="part-title">实验仪器设备（装置或软件等）</p>';
        div += '<div class="part-content">';
        div += '<div class="content-text">' + (projectInfo.desc_experiment || "暂无内容") + '</div>';
        div += '</div>';

        div += '<p class="part-title">实验材料（或预设参数等）</p>';
        div += '<div class="part-content">';
        div += '<div class="content-text">' + (projectInfo.desc_material || "暂无内容") + '</div>';
        div += '</div>';

        div += '<p class="part-title">实验方法与步骤要求</p>';
        div += '<div class="part-content">';
        div += '<div class="content-text">' + (projectInfo.desc_method_step || "暂无内容") + '</div>';
        div += '</div>';

        div += '<p class="part-title">实验结果与结论要求</p>';
        div += '<div class="part-content">';
        div += '<div class="content-text">' + (projectInfo.desc_result || "暂无内容") + '</div>';
        div += '</div>';

        div += '<p class="part-title">考核要求</p>';
        div += '<div class="part-content">';
        div += '<div class="content-text">' + (projectInfo.desc_assessment || "暂无内容") + '</div>';
        div += '</div>';

        div += '<p class="part-title">面向学生要求</p>';
        div += '<div class="part-content">';
        div += '<div class="content-text">' + (projectInfo.desc_face_student || "暂无内容") + '</div>';
        div += '</div>';

        div += '<p class="part-title">实验项目应用情况</p>';
        div += '<div class="part-content">';
        div += '<div class="content-text">' + (projectInfo.desc_project_orientie || "暂无内容") + '</div>';
        div += '</div>';
        div += '</div>';
        $('#detailsPageInfo').html(div);
        onTabLoaded();
    }

    /* category=2 */
    function initProjectFeature() {
        var div = '<div style="padding:20px;">';
        div += '<p class="part-title" style="margin-top:5px;">实验教学项目特色</p>';
        div += '<div class="part-content">';
        div += '<div class="content-text">' + (projectInfo.project_features || "暂无内容") + '</div>';
        div += '<div class="clearfix"></div>';
        div += '</div>';
        div += '</div>';
        $('#detailsPageInfo').html(div);
        onTabLoaded();
    }

    /* category=3 */
    function initProjectBuilding() {
        var div = '<div style="padding:20px;">';
        div += '<p class="part-title" style="margin-top:5px;">实验教学项目持续建设与共享服务计划</p>';
        div += '<div class="part-content">';
        div += '<div class="content-text">' + (projectInfo.service_plan || "暂无内容") + '</div>';
        div += '<div class="clearfix"></div>';
        div += '</div>';
        div += '</div>';
        $('#detailsPageInfo').html(div);
        onTabLoaded();
    }

    /* category=4 */
    function initProjectNetwork() {
        var div = '<div style="padding:20px;">';
        div += '<p class="part-title">网络条件要求</p>';
        div += '<div class="part-content">';
        div += '<div class="content-text">' + (projectInfo.net_require || "暂无内容") + '</div>';
        div += '<div class="clearfix"></div>';
        div += '</div>';

        div += '<p class="part-title">用户操作系统要求（如Window、Unix、iOS、Android等）</p>';
        div += '<div class="part-content">';
        div += '<div class="content-text">' + (projectInfo.net_system_require || "暂无内容") + '</div>';
        div += '<div class="clearfix"></div>';
        div += '</div>';

        div += '<p class="part-title">用户非操作系统软件配置要求（如浏览器、特定软件等）</p>';
        div += '<div class="part-content">';
        div += '<div class="content-text">' + (projectInfo.net_non_operate || "暂无内容") + '</div>';
        div += '<div class="clearfix"></div>';
        div += '</div>';

        div += '<p class="part-title">用户硬件配置要求（如主频、内存、显存、存储容量等）</p>';
        div += '<div class="part-content">';
        div += '<div class="content-text">' + (projectInfo.net_user_hardware || "暂无内容") + '</div>';
        div += '<div class="clearfix"></div>';
        div += '</div>';

        div += '<p class="part-title">用户特殊外置硬件配置要求（如可穿戴设备等）</p>';
        div += '<div class="part-content">';
        div += '<div class="content-text">' + (projectInfo.net_special_hardware || "暂无内容") + '</div>';
        div += '<div class="clearfix"></div>';
        div += '</div>';
        div += '</div>';
        $('#detailsPageInfo').html(div);
        onTabLoaded();
    }

    /* category=5 */
    function initProjectSchema() {
        var div = '<div style="padding:20px;">';

        div += '<p class="part-title" style="margin-top:5px;">系统架构图及简要说明</p>';
        div += '<div class="part-content">';
        div += '<span class="content-title">简要说明：</span>';
        div += '<div class="content-text">' + (projectInfo.skill_explain || "暂无内容") + '</div>';
        div += '<div class="clearfix"></div>';
        div += '</div>';

        div += '<p class="part-title">实验教学项目</p>';
        div += '<div class="part-content">';
        div += '<span class="content-title">简要说明：</span>';
        div += '<div class="content-text">' + (projectInfo.skill_teach_project || "暂无内容") + '</div>';
        div += '<div class="clearfix"></div>';
        div += '</div>';

        div += '<p class="part-title">管理平台</p>';
        div += '<div class="part-content">';
        div += '<span class="content-title">简要说明：</span>';
        div += '<div class="content-text">' + (projectInfo.skill_simp || "暂无内容") + '</div>';
        div += '<div class="clearfix"></div>';
        div += '</div>';
        div += '</div>';
        $("#detailsPageInfo").html(div);
        onTabLoaded();
    }

    /* category=7 */
    function initProjectApplication() {
        var div = '<div style="padding:20px;">';
        div += '<p class="part-title">项目申报表</p>';
        div += '<div class="part-content">';
        div += '<div class="content-text">' + (projectInfo.subject_report || "暂无内容") + '</div>';
        div += '<div class="clearfix"></div>';
        div += '</div>';
        div += '</div>';
        $("#detailsPageInfo").html(div);
        onTabLoaded();
    }
    
    /* category=6 */
    function initMoreCitizen() {
        loadDiscuss();
    
        onTabLoaded();
    }

    /* 加载项目评论 */
    function loadDiscuss() {
        X.get('/index/subject/evaluate_list?sortby=id&reverse=true&limit=' + limit + '&del=0&status=1&type=2&level=1&start=0&id=' + vid, onLoadDiscuss);
    }

    function gotoDiscussPage(evt, page) {
        X.get('/index/subject/evaluate_list?sortby=id&reverse=true&limit=' + limit + '&del=0&status=1&type=2&level=1&id=' + vid + '&start=' + page.start + qt, onLoadDiscuss);
    }

    X.sub('gotoDiscussPage', gotoDiscussPage);

    function onLoadDiscuss(respText) {
        var res = JSON.parse(respText);
        res = res.result;
        res.meta = res.meta || {
            total: '0',
            size: '0'
        };
        var div = '<ul class="details-page-discuss-tab">';
        div += '<li class="active"><a href="javascript:void(0);">实验交流 (<span id="commentCount">' + (res.meta.total || 0) + '</span>)</a></li>';
        div += '</ul>';
        div += '<div class="details-page-discuss-submit">';
        div += '<form class="details-page-discuss-submit-form" id="commentForms" onsubmit="return false;">';
        div += '<textarea rows="4" class="form-control" name="comment" placeholder="输入评论内容..."></textarea>';
        div += '<button type="submit" class="btn btn-primary">发表评论</button>';
        div += '</form>';
        div += '</div>';
        div += '<div class="details-page-discuss-list">';
        if (res.meta.total != '0') {
            div += '<h3>最新评论</h3>';
            div += '<ul>';
            var size = parseInt(res.meta.size);
            for (var i = 0; i < size; i++) {
                var item = res.data[i];
                div += '<li data-list="' + item.id + '">';
                div += '<div class="left">';
                div += '<a href="javascript:void(0);"><img src="' + (item.img || DEFAULT_AVATAR) + '"  onerror="this.src=\'' + DEFAULT_AVATAR + '\'" alt="' + item.name + '" width="50" height="50" /></a>';
                div += '</div>';
                div += '<div class="body">';
                div += '<h4>' + (item.name || "未知用户") + '<small><span>' + (item.created) + '</span>发表</small></h4>';
                div += '<p>' + (item.content || "...") + '</p>';
                div += '<div class="append">';
                div += '<a href="javascript:void(0);" data-reply="' + item.id + '" data-count="' + (item.reply_count || 0) + '"><i class="iconfont talk">&#xe876;</i>回复(' + (item.reply_count || 0) + ')</a>';
                div += '</div>';
                div += '</div>';
                div += '</li>';
            }
            div += '</ul>';
        } else {
            div += '<div class="noitems">暂无评论</div>';
        }
        div += '</div>';
        div += '<ul id="pagination1" class="cN-pagination"></ul>';
        $("#detailsPageInfo").html(div);
        /* 分页 */
        res.limit = limit;
        res.evt = "gotoDiscussPage";
        res.ele = X("pagination1",true);
        X.pub('pagination', res);

        /* 发表评论 */
        $('#commentForms').submit(function() {
            var $this = $(this);
            var d = {};
            d.id = vid;
            d.comment = $this[0].comment.value || "";

            X.post('/index/subject/evaluate_add', d, function(res) {
                res = JSON.parse(res);
                if (res.code == '200') {
                    X.dialog("评论成功");
                    loadDiscuss();
                } else {
                    X.dialog(res.msg);
                }
            });
        });

        /* 回复 */
        $('[data-reply]').click(function(e) {
            e.preventDefault();
            var $this = $(this);
            var id = $this.data('reply');
            var count = $this.data('count');
            if ($('#replyBox-' + id).length == 0) {
                X.dialogLoading();
                loadComments(id);
            } else {
                $('#replyBox-' + id).remove();
                $this.html('<i class="iconfont talk">&#xe876;</i> 回复(' + count + ')');
            }
        });
    }

    /* 加载回复列表 */
    function loadComments(pid) {
        X.get('/index/subject/reply_list?sortby=id&reverse=true&limit=' + limit + '&del=0&status=1&type=2&level=2&start=0&pid='+pid+'&id=' + vid, function(respText) {
            onLoadComments(respText, pid);
        });
    }
    function gotoCommentsPage(evt, page) {
        X.get('/index/subject/reply_list?sortby=id&reverse=true&limit=' + limit + '&del=0&status=1&type=2&level=2&pid='+pid+'&id=' + vid + '&start=' + page.start + qt, onLoadComments);
    }

    X.sub('gotoCommentsPage', gotoCommentsPage);

    function onLoadComments(respText, pid) {
        var resp = JSON.parse(respText);
        resp = resp.result;
        resp.meta = resp.meta || {
            total: '0',
            size: '0'
        };
        resp.data = resp.data || [];
        pid = String(pid) || "";
      
        var div = '<div class="details-page-discuss-list-reply" id="replyBox-' + pid + '">';
        div += '<form class="details-page-discuss-list-reply-form" id="replyForm" onsubmit="return false;">';
        div += '<textarea rows="3" class="form-control" name="comment" placeholder="输入回复内容..."></textarea>';
        div += '<button type="submit" class="btn btn-primary">回复</button>';
        div += '</form>';
        div += '<div class="details-page-discuss-list-reply-list">';
        if (resp.meta.total == '0') {
            div += '<div class="noitems">暂无回复内容</div>';
        } else {
            var size = parseInt(resp.meta.size);
            div += '<ul>';
            for (var i = 0; i < size; i++) {
                var item = resp.data[i];
                div += '<li>';
                div += '<div class="left">';
                div += '<a href="javascript:void(0);"><img src="' + (item.img || DEFAULT_AVATAR) + '"  onerror="this.src=\'' + DEFAULT_AVATAR + '\'" alt="' + item.name + '" width="50" height="50" /></a>';
                div += '</div>';
                div += '<div class="body" style="padding-right:0;">';
                div += '<h4>' + (item.name || "未知用户") + '<small><span>' + item.created + '</span>回复</small></h4>';
                div += '<p>' + (item.reply_content || "...") + '</p>';
                div += '</div>';
                div += '</li>';
            }
            div += '</ul>';
        }
        div += '</div>';
        div += '<ul id="pagination2" class="cN-pagination"></ul>';
        div += '</div>';
        $('[data-list=' + pid + ']').find('#replyBox-' + pid).remove();
        $('[data-list=' + pid + ']').append(div);
        $('[data-reply=' + pid + ']').html('<i class="iconfont talk">&#xe705;</i>收起回复');
        X.pub('closeDialog');

        /* 分页 */
        resp.limit = limit;
        resp.evt = "gotoCommentsPage";
        resp.ele = X("pagination2",true);
        X.pub('pagination', resp);

        /* 回复 */
        $('#replyForm').submit(function() {
            var $this = $(this);
            X.dialogLoading();
            var d = {};
            d.pid = pid;
            d.comment = $this[0].comment.value || "";

            X.post('/index/subject/reply_add', d, function(res) {
                res = JSON.parse(res);
                if (res.code == '200') {
                    //console.log("qqqqqqqqqqqqqqqqqqq");
                    X.dialog("回复成功");
                    loadComments(pid);
                } else {
                    X.dialog(res.msg);
                }
            });
           
        });
    }


    function initEvaluate(isTure) {
        //console.log(isTure);
        var div2 = '';
        if (isTure) { // 已评分
            div2 += '<div class="go-evaluate" style="margin-bottom:0;">';
            div2 += '<div class="number">' + Number(project.score).toFixed(1) + '</div>';
            div2 += '<div class="star">';
            div2 += '<div class="starbox">';
            for (var i = 0; i < 5; i++) {
                if (i < project.score) {
                    div2 += '<span class="star yes"></span>';
                } else {
                    div2 += '<span class="star no"></span>';
                }
            }
            div2 += '</div>';
            div2 += '<span class="txt">' + (project.scoreCount || 0) + ' 人评分' + '<span>';
            
            div2 += '</div>';
            div2 += '</div>';
        } else { // 未评分
            div2 += '<h5>我要评分</h5>';
            div2 += '<a href="javascript:void(0);">';
            div2 += '<div class="starbox left">';
            for (var i = 0; i < 5; i++) {
                div2 += '<span class="star no" data-star="' + (i + 1) + '">☆</span>';
            }
            div2 += '</div>';
            div2 += '<span class="num left" id="scoreText"></span>';
            div2 += '</a>';
        }
        $('#evaluate').html(div2);
    }

    /* 星级事件 */
    $('body').on('mouseover', '#evaluate .starbox [data-star]', function(e) {
        var $this = $(this);
        var index = $this.data('star');
        for (var i = 1; i <= 5; i++) {
            if (i <= index) {
                $('#evaluate .starbox [data-star=' + i + ']').removeClass('no').addClass('yes');
                $('#evaluate .starbox [data-star=' + i + ']').text('');
            } else {
                $('#evaluate .starbox [data-star=' + i + ']').addClass('no').removeClass('yes');
                $('#evaluate .starbox [data-star=' + i + ']').text('☆');
            }
        }
        $('#scoreText').text("(" + SCORE_TEXT[index] + ")");
    });

    $('body').on('mouseout', '#evaluate .starbox [data-star]', function(e) {
        $('#evaluate .starbox [data-star]').addClass('no').removeClass('yes'); 
        $('#evaluate .starbox [data-star]').text('☆');
        $('#scoreText').text("");
    });

    $('body').on('click', '#evaluate .starbox [data-star]', function(e) {
        if (project.status == "0") {
            X.error("项目未发布！");
            return;
        }
        var $this = $(this);
        var score = $this.data('star');
        var obj = {};
   
        obj.title = "提示";
        obj.msg = "当前实验评分为" + score + "分，是否确认提交？";
        obj.callback = function() {
            X.dialogLoading();
            var item = {};
            item.id = project.id;
            item.score = String(score);
            if (!INT_REG_F.test(item.score) || !item.score) {
                X.dialog("请选择星级评分");
                return;
            }
            X.post("/index/subject/score_add", item, function(resp) {
                resp = JSON.parse(resp);
                if (resp.code == "200"){
                    X.dialog(resp.msg);
                    loadContent();
                    refreshContent(function() {
                        loadStat();
                    });
                } else {
                    X.dialog(resp.msg);
                }
            });
                
         
        };
        X.pub("showDialog", obj);
    });

    /* 跳转登录 */
    function toLogin() {
        var obj = {};
            obj.title = "提示";
            obj.msg = "请先登录";
            obj.okText = "登录";
        obj.callback = function() {
            document.location = "/index/login/index";
        };
        X.pub("showDialog", obj);
    }

    /* 时间转换 */
    function timeToStringInt(t) {
        var date = new Date(t);
        var Y = date.getFullYear() + '';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '';
        var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '';
        return Y + '' + M + '' + D;
    }

    /* 项目资料资源预览 */
    X.sub("projectResPreview", function(evt, id) {
        var resourceDetail = "/resource/get", //资源详情
            resourceView = "/api/resource/view/add", //资源浏览
            resourceDownload = "/api/resource/download/add"; //资源下载
        X.get(resourceDetail + '?id=' + id, function(resp) {
            resp = JSON.parse(resp);
            resp.viewer = resp.viewer || 1;
            if (resp.convertStatus == 1) {

                if (!swfobject.hasFlashPlayerVersion("6.0.65")) {
                    $("#playerContent").html('<a id="getflashplayerScope" href="http://www.adobe.com/go/getflashplayer" style="color:#ff0000;padding:15px;display:block;">请点击这里允许浏览器运行 Adobe Flash Player</a>');
                    $('#getflashplayerScope')[0].click();
                }

                //预览文件可以在播放器中显示
                var viewer = resp.viewer || "1";
                var width = 850;
                var length = 440;
                if (viewer == 1) {
                    length = 800;
                }
                var uuid = resp.id;
                var playerSrc = "/player/DocPlayer.swf"; //viewer=0或1时用此播放器
                var IService = '/docXML';
                if (viewer === "2") {
                    IService = '/videoXML';
                    playerSrc = "/player/FlvPlayer.swf"; //音视频播放器，即viewer=2时用此播放器
                }

                var flashvars = {
                    'uuid': uuid,
                    'id': resp.id,
                    //这里需要开发一个服务，返回xml格式的数据给播放器
                    'IService': IService
                };
                var params = {
                    quality: "high",
                    wmode: "opaque",
                    allowscriptaccess: "always",
                    allowfullscreen: "true",
                    bgcolor: "#fff"
                };
                var attributes = {
                    id: "player",
                    name: "player"
                };
                var swf = playerSrc;
                swfobject.embedSWF(swf, "playerContent", width, length, "9.0.0", "/files/expressInstall.swf", flashvars, params, attributes);

                //统计浏览数
                // X.post(resourceView, {
                //     "id": "" + id
                // });
            } else {
                $("#playerContent").html('<div class="noitems">' + (LANG == "EN" ? EN.detail.checkLater : "资源加工中，请稍后查看") + '</div>');
            }
        });
    });

    /* 检查是否评分过 */
    function checkProjectScore(cb) {
        X.dialogLoading();
        X.get(uri_pipe("/index/subject/score?id=" + vid), function(resp) {
            resp = JSON.parse(resp);
            if (resp.code == '200') {
                cb(1);
            } else {
                cb(0);
            }
            X.pub('closeDialog');
        });
    }
    
        

});