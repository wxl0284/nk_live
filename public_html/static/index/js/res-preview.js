/**
 * My module:
 *  资源预览
 */
X.sub("resPreviewPopup", function(evt, id) {
    var resourceDetail = "/resource/get", //资源详情
        resourceView = "/api/resource/view/add", //资源浏览
        resourceDownload = "/api/resource/download/add"; //资源下载
    X.get(resourceDetail + '?id=' + id, function(resp) {
        resp = JSON.parse(resp);
        resp.viewer = resp.viewer || 1;
        if (resp.convertStatus == 1) {

            if ($('#resPreviewModal').length > 0) {
                $("#res-previewPlayer").html('<p id="res-playerContent" />');
                $('#resPreviewModal').modal('show');
            } else {
                var res = '';
                res += '<div class="modal fade" id="resPreviewModal" tabindex="-1">';
                res += '<div class="modal-dialog" style="width:800px">';
                res += '<div class="modal-content">';
                res += '<div class="modal-header">';
                res += '<button type="button" class="close" data-dismiss="modal">';
                res += '<span>&times;</span>';
                res += '</button>';
                res += '<h5 class="modal-title"></h5>';
                res += '</div>';
                res += '<div class="modal-body clearfix">';
                res += '<div class="pull-left" id="res-previewPlayer"><p id="res-playerContent" /></div>';
                res += '<div class="pull-right" id="res-preview-info"></div>';
                res += '</div>';
                res += '</div>';
                res += '</div>';
                res += '</div>';
                $("body").append(res);
                $('#resPreviewModal').modal({
                    backdrop: "static",
                    show: true
                });
            }

            //插入数据
            $("#resPreviewModal .modal-title").html(resp.title);
            var str = "";
            str += '<p>媒体类型：' + (get_title(RES_MEDIA_TYPE, resp.mediaType) || "其他") + '</p>';
            // str += '<p>资源类型：' + (get_title(RES_TYPE, resp.resourceType) || "其他") + ' </p>';
            str += '<p>资源大小：' + resp.size + ' </p>';
            // str += '<p>作者：' + resp.author + '</p>';
            // str += '<p>上传者：' + resp.uploaderName + ' </p>';
            str += '<p>上传时间：' + moment(resp.created).format("YYYY-MM-DD") + ' </p>';
            // str += '<p><a class="btn btn-primary" href="javascript:" onclick="X.pub(\'downloadRes\',\'' + resp.resId + '\')">下载</a></p>';
            $("#resPreviewModal #res-preview-info").html(str);

            //预览文件可以在播放器中显示
            var viewer = resp.viewer || "1";
            var width = "600px";
            var length = 440;
            if (viewer == 1) {
                length = 740;
            }
            $("#res-previewPlayer").css({
                "width": width,
                "height": length
            });
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
            swfobject.embedSWF(swf, "res-playerContent", width, length, "9.0.0", false, flashvars, params, attributes);

            //统计浏览数
            // X.post(resourceView, {
            //     "id": "" + id
            // });
        } else {
            X.error("资源加工中，请稍后查看");
        }
    });

    //下载资源前先统计再下载
    // X.sub("downloadRes", function(evt, rid) {
    //     //统计下载数
    //     X.post(resourceDownload, {
    //         "id": "" + id
    //     }, function(resp) {
    //         resp = JSON.parse(resp);
    //         if (resp.code === 0) {
    //             document.location = "/resource/file?id=" + rid;
    //         } else {
    //             X.pub('toastError', "资源无法下载");
    //         }
    //     });
    // });
});