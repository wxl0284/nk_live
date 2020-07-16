/**
 * details v3
 */
X.sub("init", function() {

    function onGetContent(respText) {
        var res = '';
        res += '<div>';
        res += '<h1 class="details-page-info-title">' + (LANG == "EN" ? (item.en_title || item.title || "") : (item.title || "")) + '</h1>';
        res += '<div class="details-page-info-score" id="infoScore"></div>';
        res += '</div>';
        res += '<ul class="details-page-info-tags">';
        res += '<li>' + (LANG == "EN" ? (EN.public.subject + "：" + (item.sps1.en_title || item.sps1.title || "")) : ("所属专业类：" + (item.sps1.title || ""))) + '</li>';
        res += '<li>' + (LANG == "EN" ? (EN.public.major + "：" + (item.sps2.en_title || item.sps2.title || "")) : ("对应专业：" + (item.sps2.title || ""))) + '</li>';
        // res += '<li>' + (LANG == "EN" ? (EN.detail.course + "：" + (item.course || "")) : ("课程：" + (item.course || ""))) + '</li>';
        res += '<li>' + (LANG == "EN" ? (EN.detail.school + "：" + (item.schoolInfo.en_title || item.schoolTitle || "")) : ("学校：" + (item.schoolTitle || ""))) + '</li>';
        res += '<li>' + (LANG == "EN" ? (EN.detail.incharge + "：" + (item.en_incharge || item.incharge || "")) : ("负责人：" + (item.incharge || ""))) + '</li>';
        res += '<li>' + (LANG == "EN" ? (EN.detail.demoAcount + "：" + (item.demoUsername || "")) : ("试用账号：" + (item.demoUsername || ""))) + '</li>';
        res += '<li>' + (LANG == "EN" ? (EN.detail.demoPassword + "：" + (item.demoPassword || "")) : ("试用密码：" + (item.demoPassword || ""))) + '</li>';
        res += '</ul>';
        res += '<div class="details-page-info-description">';
        res += '<p>' + (LANG == "EN" ? (sb_substr((item.en_brief || item.brief || ""), 2000, true) || "") : (item.brief || "")) + '</p>';
        res += '</div>';
        res += '<div class="details-page-info-btns">';
        res += '<button type="button" class="btn btn-primary details-page-info-do-btn" id="doBtn" onclick="X.pub(\'goTolink\',\'' + item.url + '\')">' + (LANG == "EN" ? EN.detail.doExp : "我要做实验") + '</button>';
        res += '<button type="button" class="btn btn-white btn-opacity" id="collectionBtn"><i class="iconfont">&#xe707;</i> ' + (LANG == "EN" ? EN.detail.collect : "收藏") + '</button>';
        res += '<button type="button" class="btn btn-white btn-opacity" id="likeBtn"><i class="iconfont">&#xe6eb;</i> ' + (LANG == "EN" ? EN.detail.like : "点赞") + '（' + item.upCount + '）</button>';
        res += '</div>';

        $("#detailsInfo").html(res);



        function loadStat() {
            var div = '';
            div += '<div class="details-page-stat-box">';
            div += '<h3 class="details-page-stat-title">' + (LANG == "EN" ? EN.detail.shareApp : "共享应用") + '</h3>';
            div += '<ul class="details-page-stat-shared">';
            div += '<li class="first">';
            div += '<div class="icon"><i class="iconfont">&#xe6fd;</i></div>';
            div += '<div class="label">' + (LANG == "EN" ? EN.detail.viewCount : "浏览量") + ' <span>' + (project.viewCount || 0) + '</span></div>';
            div += '</li>';
            div += '<li class="second">';
            div += '<div class="icon"><i class="iconfont">&#xe6eb;</i></div>';
            div += '<div class="label">' + (LANG == "EN" ? EN.detail.likeCount : "点赞数") + ' <span>' + (project.upCount || 0) + '</span></div>';
            div += '</li>';
            div += '<li class="third">';
            div += '<div class="icon"><i class="iconfont">&#xe707;</i></div>';
            div += '<div class="label">' + (LANG == "EN" ? EN.detail.collectCount : "收藏数") + ' <span>' + (project.collectionCount || 0) + '</span></div>';
            div += '</li>';
            div += '</ul>';
            div += '</div>';
            div += '<div class="details-page-stat-box">';
            if (LANG == "EN") {
                div += '<h3 class="details-page-stat-title hide">' + (EN.detail.expScore) + '</h3>';
            } else {
                div += '<h3 class="details-page-stat-title">实验评分</h3>';
            }
            div += '<div class="details-page-stat-evaluate" id="evaluate">' + (LANG == "EN" ? EN.detail.loading : "加载中...") + '</div>';
            div += '</div>';
            div += '<div class="details-page-stat-box">';
            div += '<h3 class="details-page-stat-title">' + (LANG == "EN" ? EN.detail.expEvaluate : "实验评价") + '</h3>';
            div += '<ul class="details-page-stat-shared">';
            div += '<li class="first">';
            div += '<div class="icon"><i class="iconfont">&#xe876;</i></div>';
            div += '<div class="label">' + (LANG == "EN" ? EN.detail.peopleCount : "评论数") + ' <span>' + (project.evaluateCount || 0) + '</span></div>';
            div += '</li>';
            // div += '<li class="second">';
            // div += '<div class="icon"><i class="iconfont">&#xe710;</i></div>';
            // div += '<div class="label">' + (LANG == "EN" ? EN.detail.goodCount : "好评数") + ' <span>' + (project.goodCount || 0) + '</span></div>';
            // div += '</li>';
            // div += '<li class="third">';
            // div += '<div class="icon"><i class="iconfont">&#xe70f;</i></div>';
            // div += '<div class="label">' + (LANG == "EN" ? EN.detail.badCount : "差评数") + ' <span>' + (project.badCount || 0) + '</span></div>';
            // div += '</li>';
            div += '</ul>';
            div += '<hr />';
            div += '<div id="evaluate-box"></div>';
            div += '</div>';
            $('#stat').html(div);
            checkProjectScore(initEvaluate);
            checkProjectEvaluate();
        }



        $('body').on('keyup', '#commentForm textarea[name=comment]', function() {
            var $this = $(this);
            countWords($this.val(), 200, $('#commentForm #textMaxNumber1'), "cn");
        });


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
            X.get('/json/projectInfos?del=0&projectID=' + vid + '&category=' + category, function(resp) {
                resp = JSON.parse(resp);
                resp.meta = resp.meta || {
                    total: "0"
                };
                if (resp.meta.total != "0") {
                    resp = resp.data[0];
                    resp.infoId = resp.infoId || "";
                    if (resp.infoId.length) {
                        X.get("/large/text/get?id=" + resp.infoId, function(res) {
                            res = JSON.parse(res);
                            resp.body = res || {};
                            projectInfo[category] = resp;
                            load();
                        });
                    } else {
                        projectInfo[category] = resp;
                        load();
                    }
                } else {
                    projectInfo[category] = resp;
                    load();
                }
            });
        }

        function getInChargeInfo() {
            inChargeInfo = project.userInfo || {};

            projectInfo = projectInfo || {};
            projectInfo["0"] = projectInfo["0"] || {};
            projectInfo["0"].body = projectInfo["0"].body || {};
            var div = '<div class="incharge-info">';
            div += '<p class="part-title" style="margin-top:5px;">实验教学项目负责人情况</p>';
            div += '<table class="table table-bordered part-table">';
            if (project.status == "0") { // 项目未发布
                div += '<tr>';
                div += '<th>姓名</th><td>' + (inChargeInfo.name || "无") + '</td>';
                div += '<th>性别</th><td>' + (GENDER[inChargeInfo.gender] || "无") + '</td>';
                if (inChargeInfo.birthday !== null && inChargeInfo.birthday !== "" && inChargeInfo.birthday != " " && inChargeInfo.birthday !== undefined) {
                    div += '<th>出生年月</th><td>' + moment(inChargeInfo.birthday).format("YYYY-MM-DD") + '</td>';
                } else {
                    div += '<th>出生年月</th><td>无</td>';
                }
                div += '</tr>';
                div += '<tr>';
                div += '<th>学历</th><td>' + (EDUCATION[inChargeInfo.education] || "无") + '</td>';
                div += '<th>学位</th><td>' + (DEGREE[inChargeInfo.degree] || "无") + '</td>';
                div += '<th>电话</th><td>' + (inChargeInfo.phone || "无") + '</td>';
                div += '</tr>';
                div += '<tr>';
                if (parseInt(inChargeInfo.techDuty) && parseInt(inChargeInfo.otherDuty)) {
                    div += '<th>专业技术职务</th><td>' + TECH_DUTY[inChargeInfo.techDuty] + '，<br />' + OTHER_DUTY[inChargeInfo.otherDutySet][parseInt(inChargeInfo.otherDuty) - 1] + '</td>';
                } else {
                    if (parseInt(inChargeInfo.techDuty)) {
                        div += '<th>专业技术职务</th><td>' + TECH_DUTY[inChargeInfo.techDuty] + '</td>';
                    } else if (parseInt(inChargeInfo.otherDuty)) {
                        div += '<th>专业技术职务</th><td>' + OTHER_DUTY[inChargeInfo.otherDutySet][parseInt(inChargeInfo.otherDuty) - 1] + '</td>';
                    } else {
                        div += '<th>专业技术职务</th><td>-</td>';
                    }
                }
                div += '<th>行政职务</th><td>' + (inChargeInfo.adminDuty || "无") + '</td>';
                div += '<th>手机</th><td>' + (inChargeInfo.mobile || "无") + '</td>';
                div += '</tr>';
                div += '<th>院系</th><td>' + (inChargeInfo.faculty || "无") + '</td>';
                div += '<th>电子邮箱</th><td>' + (inChargeInfo.email || "无") + '</td>';
                div += '<th>邮编</th><td>' + (inChargeInfo.postcode || "无") + '</td>';
                div += '</tr>';
                div += '<tr>';
                div += '<th>地址</th><td colspan="5">' + (inChargeInfo.address || "无") + '</td>';
                div += '</tr>';
            } else if (project.status == "1") { // 项目已发布
                div += '<tr>';
                div += '<th>姓名</th><td>' + (inChargeInfo.name || "无") + '</td>';
                div += '<th>性别</th><td>' + (GENDER[inChargeInfo.gender] || "无") + '</td>';
                if (inChargeInfo.birthday !== null && inChargeInfo.birthday !== "" && inChargeInfo.birthday != " " && inChargeInfo.birthday !== undefined) {
                    div += '<th>出生年月</th><td>' + moment(inChargeInfo.birthday).format("YYYY-MM-DD") + '</td>';
                } else {
                    div += '<th>出生年月</th><td>无</td>';
                }
                div += '</tr>';
                div += '<tr>';
                div += '<th>学历</th><td>' + (EDUCATION[inChargeInfo.education] || "无") + '</td>';
                div += '<th>学位</th><td>' + (DEGREE[inChargeInfo.degree] || "无") + '</td>';
                if (parseInt(inChargeInfo.techDuty) && parseInt(inChargeInfo.otherDuty)) {
                    div += '<th>专业技术职务</th><td>' + TECH_DUTY[inChargeInfo.techDuty] + '，<br />' + OTHER_DUTY[inChargeInfo.otherDutySet][parseInt(inChargeInfo.otherDuty) - 1] + '</td>';
                } else {
                    if (parseInt(inChargeInfo.techDuty)) {
                        div += '<th>专业技术职务</th><td>' + TECH_DUTY[inChargeInfo.techDuty] + '</td>';
                    } else if (parseInt(inChargeInfo.otherDuty)) {
                        div += '<th>专业技术职务</th><td>' + OTHER_DUTY[inChargeInfo.otherDutySet][parseInt(inChargeInfo.otherDuty) - 1] + '</td>';
                    } else {
                        div += '<th>专业技术职务</th><td>-</td>';
                    }
                }
                div += '</tr>';
                div += '<tr>';
                div += '<th>行政职务</th><td>' + (inChargeInfo.adminDuty || "无") + '</td>';
                div += '<th>院系</th><td>' + (inChargeInfo.faculty || "无") + '</td>';
                div += '<th>邮编</th><td>' + (inChargeInfo.postcode || "无") + '</td>';
                div += '</tr>';
                div += '<tr>';
                div += '<th>地址</th><td colspan="5">' + (inChargeInfo.address || "无") + '</td>';
                div += '</tr>';
            }
            div += '</table>';
            div += '<p class="part-title">教学研究情况</p>';
            div += '<div class="part-content"><p class="fangsong">（主持的教学研究课题（含课题名称、来源、年限，不超过5项）；作为第一署名人在国内外公开发行的刊物上发表的教学研究论文（含题目、刊物名称、时间，不超过10项）；获得的教学表彰/奖励（不超过5项））</p>' + (projectInfo["0"].body.teachStudy || "暂无内容") + '</div>';
            div += '<p class="part-title">学术研究情况</p>';
            div += '<div class="part-content"><p class="fangsong">（近五年来承担的学术研究课题（含课题名称、来源、年限、本人所起作用，不超过5项）；在国内外公开发行刊物上发表的学术论文（含题目、刊物名称、署名次序与时间，不超过5项）；获得的学术研究表彰/奖励（含奖项名称、授予单位、署名次序、时间，不超过5项））</p>' + (projectInfo["0"].body.learningStudy || "暂无内容") + '</div>';
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
            div += '项目团队总人数：<span class="teamPeoTotal" id="teamPeoTotal">0</span>人';
            div += '<i style="margin:0 8px;"></i>高校人员数量：<span class="schoolPeoNum" id="schoolPeoNum">0</span>人';
            div += '<i style="margin:0 8px;"></i>企业人员数量：<span class="societyPeoNum" id="societyPeoNum">0</span>人';
            div += '</p>';
            div += '<p class="fangsong">注：1.教学服务团队成员所在单位需如实填写，可与负责人不在同一单位。</p>';
            div += '<p class="fangsong" style="margin-left:2em;">2.教学服务团队须有在线教学服务人员和技术支持人员，请在备注中说明。</p>';
            div += '</div>';
            $('#detailsPageInfo').html(div);
            getProjectTeamCount(function() {
                getMainMember();
            });
        }

        function getProjectTeamCount(complete) {
            X.post('/api/nologin/project/team/peoNum', {
                projectId: vid
            }, function(resp) {
                resp = JSON.parse(resp);
                $('#detailsPageInfo').find("#teamPeoTotal").text(resp.teamPeoTotal || 0);
                $('#detailsPageInfo').find("#schoolPeoNum").text(resp.schoolPeoNum || 0);
                $('#detailsPageInfo').find("#societyPeoNum").text(resp.societyPeoNum || 0);
                complete();
            }, function(x) {
                complete();
            });
        }

        /* category=1 */
        function initProjectRecord() {
            projectInfo["1"].body = projectInfo["1"].body || {};
            var div = '<div style="padding:20px;">';
            // div += '<p class="part-title" style="margin-top:5px;">名称</p>';
            // div += '<div class="part-content">' + (projectInfo["1"].body.title || "暂无内容") + '</div>';
            div += '<p class="part-title">实验目的</p>';
            div += '<div class="part-content">' + (projectInfo["1"].body.target || "暂无内容") + '</div>';
            div += '<p class="part-title">实验原理</p>';
            div += '<div class="part-content">';
            // div += '<div class="left-content">';
            div += '<span class="content-title">实验原理说明：</span>';
            div += '<div class="content-text">' + (projectInfo["1"].body.basis || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            // div += '<span class="content-title">步骤：</span>';
            // div += '<div class="content-text">' + (projectInfo["1"].body.basisStep || "暂无内容") + '</div>';
            // div += '</div>';
            // div += '<div class="right-content">';
            div += '<span class="content-title">知识点：</span>';
            div += '<b style="line-height:20px;">' + (projectInfo["1"].body.points || 0) + '</b>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title"></span>';
            projectInfo["1"].body.pointsStep = projectInfo["1"].body.pointsStep || "";
            if (projectInfo["1"].body.pointsStep.length == 0) {
                div += '<div class="content-text">暂无内容</div>';
            } else {
                div += '<div class="content-text">';
                div += '<ol>';
                for (var i = 0; i < projectInfo["1"].body.pointsStep.length; i++) {
                    div += '<li>(' + (i + 1) + ') ' + (projectInfo["1"].body.pointsStep[i] || "") + '</li>';
                }
                div += '</ol>';
                div += '</div>';
            }
            // div += '<div class="content-text">' + (projectInfo["1"].body.pointsStep || "暂无内容") + '</div>';
            // div += '</div>';
            div += '</div>';
            div += '<p class="part-title">实验仪器设备（装置或软件等）</p>';
            div += '<div class="part-content">' + (projectInfo["1"].body.devices || "暂无内容") + '</div>';
            div += '<p class="part-title">实验材料（或预设参数等）</p>';
            div += '<div class="part-content">' + (projectInfo["1"].body.data || "暂无内容") + '</div>';
            div += '<p class="part-title">实验教学方法</p>';
            div += '<div class="part-content">';
            div += '<div class="content-text"><p class="fangsong">（举例说明采用的教学方法的使用目的、实施过程与实施效果）</p>' + (projectInfo["1"].body.teachWay || "暂无内容") + '</div>';
            div += '</div>';
            div += '<p class="part-title">实验方法与步骤要求</p>';
            div += '<div class="part-content">';
            div += '<p class="fangsong">（学生交互性操作步骤应不少于10步）</p>';
            div += '<span class="content-title">实验方法描述：</span>';
            div += '<div class="content-text">' + (projectInfo["1"].body.methods || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">学生交互性操作步骤：</span>';
            div += '<div class="content-text">' + (projectInfo["1"].body.handleSteps || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">学生交互性操作步骤说明：</span>';
            div += '<div class="content-text">' + (projectInfo["1"].body.stepExplain || "暂无内容") + '</div>';
            div += '</div>';
            div += '<p class="part-title">实验结果与结论要求</p>';
            div += '<div class="part-content">';
            div += '<span class="content-title">是否记录每步实验结果：</span>';
            div += '<div class="content-text">' + (ISNOT[projectInfo["1"].body.isStepLog] || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">实验结果与结论要求：</span>';
            /*if (projectInfo["1"].body.resultRequire == "3") {
                div += '<div class="content-text">' + (RESULTREQUIRE[projectInfo["1"].body.resultRequire]) + '<span>' + projectInfo["1"].body.otherRequire + '</span></div>';
            } else {
                div += '<div class="content-text">' + (RESULTREQUIRE[projectInfo["1"].body.resultRequire] || "暂无内容") + '</div>';
            }*/
            projectInfo["1"].body.resultRequire = projectInfo["1"].body.resultRequire || "";
            if (projectInfo["1"].body.resultRequire.length > 0) {
                var results = projectInfo["1"].body.resultRequire.split(" ");
                var _str = '';
                for (var j = 0; j < results.length; j++) {
                    var resultItem = results[j];
                    _str += RESULTREQUIRE[resultItem] + "，";
                }
                _str = _str.substring(0, _str.length - 1);
                if (projectInfo["1"].body.resultRequire.indexOf("3") != -1) {
                    div += '<div class="content-text">' + (_str) + '<span class="otherRequire_content">' + projectInfo["1"].body.otherRequire + '</span></div>';
                } else {
                    div += '<div class="content-text">' + (_str) + '</div>';
                }
            } else {
                div += '<div class="content-text">暂无内容</div>';
            }
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">其他描述：</span>';
            div += '<div class="content-text">' + (projectInfo["1"].body.otherRecord || "暂无内容") + '</div>';
            div += '</div>';
            div += '<p class="part-title">考核要求</p>';
            div += '<div class="part-content">';
            div += '<span class="content-title">考核要求：</span>';
            div += '<div class="content-text">' + (projectInfo["1"].body.checkRequire || "暂无内容") + '</div>';
            div += '</div>';
            div += '<p class="part-title">面向学生要求</p>';
            div += '<div class="part-content">';
            div += '<span class="content-title">专业与年级要求：</span>';
            div += '<div class="content-text">' + (projectInfo["1"].body.majorRequire || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">基本知识和能力要求等：</span>';
            div += '<div class="content-text">' + (projectInfo["1"].body.baseRequire || "暂无内容") + '</div>';
            div += '</div>';
            div += '<p class="part-title">实验项目应用情况</p>';
            div += '<div class="part-content">';
            div += '<span class="content-title">上线时间：</span>';
            if (projectInfo["1"].body.onlineTime !== null && projectInfo["1"].body.onlineTime !== "" && projectInfo["1"].body.onlineTime != " " && projectInfo["1"].body.onlineTime !== undefined) {
                div += '<div class="content-text">' + moment(parseInt(projectInfo["1"].body.onlineTime)).format("YYYY-MM-DD") + '</div>';
            } else {
                div += '<div class="content-text">暂无内容</div>';
            }
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">开放时间：</span>';
            if (projectInfo["1"].body.openTime !== null && projectInfo["1"].body.openTime !== "" && projectInfo["1"].body.openTime != " " && projectInfo["1"].body.openTime !== undefined) {
                div += '<div class="content-text">' + moment(parseInt(projectInfo["1"].body.openTime)).format("YYYY-MM-DD") + '</div>';
            } else {
                div += '<div class="content-text">暂无内容</div>';
            }
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">已服务过的学生人数：</span>';
            div += '<div class="content-text">' + (projectInfo["1"].body.studentNum || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">是否面向社会提供服务：</span>';
            div += '<div class="content-text">' + (ISNOT[projectInfo["1"].body.isToSociety] || "暂无内容") + '</div>';
            div += '</div>';
            div += '</div>';
            $('#detailsPageInfo').html(div);
            onTabLoaded();
        }

        /* category=2 */
        function initProjectFeature() {
            projectInfo["2"].body = projectInfo["2"].body || {};
            var div = '<div style="padding:20px;">';
            div += '<p class="part-title" style="margin-top:5px;">实验教学项目特色</p>';
            div += '<div class="part-content">';
            div += '<p class="fangsong">（体现虚拟仿真实验项目建设的必要性及先进性、教学方式方法、评价体系及对传统教学的延伸与拓展等方面的特色情况介绍）</p>';
            div += '<span class="content-title">实验方案设计思路：</span>';
            div += '<div class="content-text">' + (projectInfo["2"].body.planThinking || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">教学方法：</span>';
            div += '<div class="content-text">' + (projectInfo["2"].body.teachMethod || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">评价体系：</span>';
            div += '<div class="content-text">' + (projectInfo["2"].body.evaluationSys || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">传统教学的延伸与拓展：</span>';
            div += '<div class="content-text">' + (projectInfo["2"].body.teachRange || "暂无内容") + '</div>';
            div += '</div>';
            $('#detailsPageInfo').html(div);
            onTabLoaded();
        }

        /* category=3 */
        function initProjectBuilding() {
            projectInfo["3"].body = projectInfo["3"].body || {};
            var div = '<div style="padding:20px;">';
            div += '<p class="part-title" style="margin-top:5px;">实验教学项目持续建设与共享服务计划</p>';
            div += '<div class="part-content">';
            div += '<p class="fangsong">（本实验教学项目今后5年内继续向高校和社会开放服务计划，包括面向高校的教学推广应用计划、持续建设与更新、持续提供教学服务计划等，不超过600字）</p>';
            div += '<span class="content-title">持续建设与更新：</span>';
            div += '<div class="content-text">' + (projectInfo["3"].body.keepBuilding || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">面向高校的教学推广应用计划：</span>';
            div += '<div class="content-text">' + (projectInfo["3"].body.schDepolyPlan || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">面向社会的推广与持续服务计划：</span>';
            div += '<div class="content-text">' + (projectInfo["3"].body.socDepolyPlan || "暂无内容") + '</div>';
            div += '</div>';
            $('#detailsPageInfo').html(div);
            onTabLoaded();
        }

        /* category=4 */
        function initProjectNetwork() {
            projectInfo["4"].body = projectInfo["4"].body || {};
            var div = '<div style="padding:20px;">';
            // div += '<p class="part-title" style="margin-top:5px;">有效链接网址</p>';
            // div += '<div class="part-content">';
            // div += '<div class="content-text">' + (projectInfo["4"].body.domainURL || "暂无内容") + '</div>';
            // div += '</div>';
            div += '<p class="part-title">网络条件要求</p>';
            div += '<div class="part-content">';
            div += '<span class="content-title">说明客户端到服务器的带宽要求<span class="fangsong">（需提供测试带宽服务）</span>：</span>';
            div += '<div class="content-text">' + (projectInfo["4"].body.bandwidth || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">说明能够提供的并发响应数量<span class="fangsong">（需提供在线排队提示服务）</span>：</span>';
            div += '<div class="content-text">' + (projectInfo["4"].body.responseNum || "暂无内容") + '</div>';
            div += '</div>';
            div += '<p class="part-title">用户操作系统要求（如Window、Unix、iOS、Android等）</p>';
            div += '<div class="part-content">';
            div += '<span class="content-title">计算机操作系统和版本要求：</span>';
            div += '<div class="content-text">' + (projectInfo["4"].body.pcos || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">其他计算机终端操作系统和版本要求：</span>';
            div += '<div class="content-text">' + (projectInfo["4"].body.otherPcos || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">支持移动端：</span>';
            div += '<div class="content-text">' + (ISNOT[projectInfo["4"].body.isMobile] || "暂无内容") + '</div>';
            div += '</div>';
            div += '<p class="part-title">用户非操作系统软件配置要求（如浏览器、特定软件等）</p>';
            div += '<div class="part-content">';
            div += '<span class="content-title">需要特定插件：</span>';
            div += '<div class="content-text">' + (ISNOT[projectInfo["4"].body.isNeedCard] || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">插件名称：</span>';
            div += '<div class="content-text">' + (projectInfo["4"].body.cardTitle || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">插件容量：</span>';
            div += '<div class="content-text">' + (projectInfo["4"].body.cardBytes || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">下载链接：</span>';
            div += '<div class="content-text">' + (projectInfo["4"].body.cardURL || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">其他计算机终端非操作系统软件配置要求<span class="fangsong">（需说明是否可提供相关软件下载服务）</span>：</span>';
            div += '<div class="content-text">' + (projectInfo["4"].body.otherCard || "暂无内容") + '</div>';
            div += '</div>';
            div += '<p class="part-title">用户硬件配置要求（如主频、内存、显存、存储容量等）</p>';
            div += '<div class="part-content">';
            div += '<span class="content-title">计算机硬件配置要求：</span>';
            div += '<div class="content-text">' + (projectInfo["4"].body.PCHardware || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">其他计算终端硬件配置要求：</span>';
            div += '<div class="content-text">' + (projectInfo["4"].body.otherPCHW || "暂无内容") + '</div>';
            div += '</div>';
            div += '<p class="part-title">用户特殊外置硬件配置要求（如可穿戴设备等）</p>';
            div += '<div class="part-content">';
            div += '<span class="content-title">计算机特殊外置硬件要求：</span>';
            div += '<div class="content-text">' + (projectInfo["4"].body.specialHardware || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">其他计算终端特殊外置硬件要求：</span>';
            div += '<div class="content-text">' + (projectInfo["4"].body.otherSpecialHW || "暂无内容") + '</div>';
            div += '</div>';
            div += '</div>';
            $('#detailsPageInfo').html(div);
            onTabLoaded();
        }

        /* category=5 */
        function initProjectSchema() {
            projectInfo["5"].body = projectInfo["5"].body || {};
            var div = '<div style="padding:20px;">';
            div += '<p class="part-title" style="margin-top:5px;">系统架构图及简要说明</p>';
            div += '<div class="part-content">';
            div += '<span class="content-title">简要说明：</span>';
            div += '<div class="content-text">' + (projectInfo["5"].body.schemaRecord || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<div class="content-text">';
            if (projectInfo["5"].body.schemaPics) {
                var schemaPics = projectInfo["5"].body.schemaPics;
                div += '<ul id="schemaPics">';
                for (var k in schemaPics) {
                    div += '<li><img src="' + schemaPics[k]['url'] + '" data-original="' + schemaPics[k]['url'] + '" data-photo="' + schemaPics[k]['url'] + '" alt="' + schemaPics[k]['name'] + '" onerror="this.src=\'' + ONERROR_IMG + '\'"></li>';
                }
                div += '</ul>';
            }
            div += '</div>';
            div += '</div>';
            div += '<p class="part-title">实验教学项目</p>';
            div += '<div class="part-content">';
            div += '<span class="content-title">开发技术<span class="fangsong">（如：3D仿真、VR技术、AR技术、动画技术、WebGL技术、OpenGL技术等）</span>：</span>';
            div += '<div class="content-text">' + (projectInfo["5"].body.developTech || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">开发工具<span class="fangsong">（如：Unity3d、Virtools、Cult3D、Visual Studio、Adobe Flash、百度VR内容展示SDK等）</span>：</span>';
            div += '<div class="content-text">' + (projectInfo["5"].body.developTool || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">项目品质<span class="fangsong">（如：单场景模型总面数、贴图分辨率、每帧渲染次数、动作反馈时间、显示刷新率、分辨率等）</span>：</span>';
            div += '<div class="content-text">' + (projectInfo["5"].body.proQuality || "暂无内容") + '</div>';
            div += '</div>';
            div += '<p class="part-title">管理平台</p>';
            div += '<div class="part-content">';
            div += '<span class="content-title">开发语言<span class="fangsong">（如：JAVA、.Net、PHP等）</span>：</span>';
            div += '<div class="content-text">' + (projectInfo["5"].body.CMSDevelopLang || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">开发工具<span class="fangsong">（如：Eclipse、Visual Studio、NetBeans、百度VR课堂SDK等）</span>：</span>';
            div += '<div class="content-text">' + (projectInfo["5"].body.CMSDevelopTool || "暂无内容") + '</div>';
            div += '<div class="clearfix"></div>';
            div += '<span class="content-title">采用的数据库<span class="fangsong">（如：HBASE、Mysql、SQL Server、Oracle等）</span>：</span>';
            div += '<div class="content-text">' + (projectInfo["5"].body.CMSDatabase || "暂无内容") + '</div>';
            div += '</div>';
            div += '</div>';
            $("#detailsPageInfo").html(div);
            $('#detailsPageInfo').find("[data-photo]").each(function() {
                var $this = $(this);
                var img = new Image();
                var url = $this.data('photo');
                img.src = url || PROJECT_DEFAULT;
                img.onload = function() {
                    imgAutoPostion($('img[src="' + url + '"]'), 160, 160, img.width, img.height);
                };
            });
            /*初始化图片查看器*/
            $('#schemaPics').viewer({
                url: 'data-original',
                show: function() {
                    $("#modalClose").hide();
                },
                hidden: function() {
                    $("#modalClose").show();
                }
            });
            onTabLoaded();
        }

        /* 星级事件 */
        $('body').on('mouseover', '#evaluate .starbox [data-star]', function(e) {
            var $this = $(this);
            var index = $this.data('star');
            for (var i = 1; i <= 5; i++) {
                if (i <= index) {
                    $('#evaluate .starbox [data-star=' + i + ']').removeClass('no').addClass('yes');
                } else {
                    $('#evaluate .starbox [data-star=' + i + ']').addClass('no').removeClass('yes');
                }
            }
            $('#scoreText').text("(" + (LANG == "EN" ? EN_SCORE_TEXT[index] : SCORE_TEXT[index]) + ")");
        });

        $('body').on('mouseout', '#evaluate .starbox [data-star]', function(e) {
            $('#evaluate .starbox [data-star]').addClass('no').removeClass('yes');
            $('#scoreText').text("");
        });

    }
});