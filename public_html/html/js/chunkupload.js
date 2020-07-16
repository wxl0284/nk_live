/**
 * My module:
 *  大文件上传
 */
X.sub("init", function() {
    //文件上传
    var str = '<div id="file-upload-overlay">';
    str += '<div class="file-upload-bg"></div>';
    str += '<div class="file-upload"> ';
    str += '<div class="file-upload-type"></div>';
    str += '<div class="file-upload-close">×</div>';
    str += '<span class="file_uploadBtn" id="file_uploadBtn" style="display:block;">选择文件';
    str += '<input type="file" id="file_fileInput" style="display:block;" /></span>';
    str += '<div class="fileBox" id="file_uploadBox">';
    str += '<span class="pauseBtn" id="file_pauseBtn" style="display:none;">暂停</span>';
    str += '<span class="goBtn" id="file_goBtn" style="display:none;">继续</span>';
    str += '<div class="filename" id="file_filename"></div>';
    str += '<div class="pbar">';
    str += '<div class="progress" id="file_progress">';
    str += '</div>';
    str += '<div id="file_percent">0%</div>';
    str += '</div>';
    str += '</div>';
    str += '<div class="clear"></div>';
    str += '</div>';
    $("body").append(str);

    //关闭面板
    $(".file-upload-close").click(function() {
        stop = true;
        $("#file-upload-overlay").hide();
    });

    var rid;
    var res = [];
    var request = {};
    var chunk_size = 1024 * 1024;
    if (ISIE) {
        chunk_size = 4 * 1024;
    }
    var file_size = 0;
    var fb = null;
    var stop = false;
    var conf = {
        "uploader": 'file_uploadBtn',
        "goBtn": 'file_goBtn',//继续按钮
        "pauseBtn": 'file_pauseBtn', //暂停按钮
        "file": 'file_fileInput', //文件选择器
        "fileBox": 'file_uploadBox', //文件容器
        "processer": 'file_progress', //进度条
        "width": $(".pbar").width(), //进度条总宽度
        "percent": 'file_percent', //百分比
        "filename": 'file_filename', //文件名
        "fileType": '', //限制文件类型
        "maxFileSize": 1000 * 1024 * 1024, //上传文件的最大限制,单位B
        "minFileSize": 1, //上传文件的最小限制,单位B
        "uploaded": function(file) { //上传成功
            uploaded(file);
        },
        "callback": null
    };

    var sizeFormater = function(size) {
        var units = ['B', 'KB', 'MB', 'GB', 'TB'],
            bytes = size,
            i;

        for (i = 0; bytes >= 1024 && i < 4; i++) {
            bytes /= 1024;
        }

        return bytes.toFixed(2) + units[i];

    };

    function setBtnDisabled(flag) {
        var e = X(conf.uploader);
        if (flag) {
            e.style.display = 'none';
            $("#file_fileInput").hide();
        } else {
            X(conf.filename).style.display = 'none';
            $(".pbar").hide();
            e.style.display = 'block';
            $("#file_fileInput").show();
        }
    }
    
    var current = 0;
    var tries = 0;
    function ChunkedUploader(request) {
        tries = 0;
        var file = request.file;
        var uri = conf.uri;
        // current = current || 0;
        var rid;
        var totalChunks = Math.ceil(file_size / chunk_size);

        var slice_method = 'slice';

        if ('mozSlice' in file) {
            slice_method = 'mozSlice';
        } else if ('webkitSlice' in file) {
            slice_method = 'webkitSlice';
        }

        function upload() {
            X(conf.goBtn).css('display', 'none');
            X(conf.pauseBtn).css('display', 'none');
            if (stop) {
                X(conf.goBtn).css('display', 'block');
                X(conf.pauseBtn).css('display', 'none');
                return;
            } else {
                X(conf.goBtn).css('display', 'none');
                X(conf.pauseBtn).css('display', 'block');
            }

            X(conf.processer).css('width', (conf.width * current / totalChunks) + 'px');
            X(conf.percent).innerHTML = (100 * current / totalChunks).toFixed(0) + '%';

            var range_start = current * chunk_size;
            var range_end = Math.min(file_size, range_start + chunk_size);

            if (current >= totalChunks) {
                if (conf.uploaded) {
                    file.id = rid;
                    conf.uploaded(file);
                }
                return;
            }

            var req = {};
            var chunk;
            file.name = file.name.replace(/\s+/gi, "");
            if (!ISIE) {
                chunk = file[slice_method](range_start, range_end);
                req.uri = uri + "?totalChunks=" + totalChunks + "&current=" + current + "&filename=" + file.name + "&chunkSize=" + chunk_size;
            } else {
                chunk = fb.substring(range_start, range_end);
                var chunksize = chunk_size * 3 / 4;
                req.uri = uri + "?type=base64&totalChunks=" + totalChunks + "&current=" + current + "&filename=" + file.name + "&chunkSize=" + chunksize;
            }
            req.method = "POST";
            req.body = chunk;
            req.cb = chunkUploaded;
            req.oe = function(t) {
                if (tries < 25) {
                    tries++;
                    X.send(req);
                }
            };
            
            X.send(req);
        }

        function chunkUploaded(respText) {
            var resp = JSON.parse(respText);
            if (resp.code !== 0) {
                tries = 0;
                X.error("上传失败，请刷新后重试");
                setBtnDisabled(false);
                return;
            }
            if (resp.id) {
                //console.log(resp.id);
                rid = resp.id;
            }
            current += 1;
            upload();
        }

        return {
            upload: upload
        };
    }
    /**
     * jquery.filereader
     */
    $("#" + conf.file).fileReader({
        id: 'fileReaderSWF',
        filereader: '/js/fileReader/filereader.swf',
        expressInstall: '/js/fileReader/expressInstall.swf',
        debugMode: false,
        callback: function() {
            //alert('filereader polyfill loaded');
        }
    });
    
    /* 暂停 */
    $('body').on('click', "#" + conf.pauseBtn, function() {
        stop = true;
    });
    
    /* 继续 */
    $('body').on('click', "#" + conf.goBtn, function() {
        stop = false;
        ChunkedUploader(request).upload();
    });

    $("#" + conf.file).on('change', function(evt) {
        X.cookie.rm("uploaderId");
        setBtnDisabled(true);
        $(".pbar").show();
        stop = true;
        var file = evt.target.files[0];
        X(conf.filename).innerHTML = file.name;
        X(conf.fileBox).style.display = 'block';
        request.file = file;

        var fileName = file.name.split('.'); //文件的名称
        var fileType = fileName[fileName.length - 1].toLowerCase();
        if (conf.fileType.length > 0 && conf.fileType.indexOf(fileType) === -1) {
            X.error('不被允许的文件类型。');
            setBtnDisabled(false);
            return false;
        }
        if (ISIE) {
            var fr = new FileReader();
            fr.onloadend = function(data) {
                fb = data.target.result;
                // fb = fb.replace(/^data\:([^\;]+)\;base64,/gmi, '');
                fb = fb.replace(/^data\:.*?base64,/gmi, '');
                fb = fb.replace(/[\r\n]/g, '');
                fb = fb.replace(' ', '');
                fb = fb.replace('\n', '');
                fb = fb.replace('\r', '');
                //$("#console").html(fb);
                var m = fb.length % 4;
                if (m !== 0) {
                    for (var i = 0; i < (4 - m); i++) {
                        fb += '=';
                    }
                }
                file_size = fb.length;
                //console.log(file_size);

                if (typeof(conf.maxFileSize) !== 'undefined' && file.size > conf.maxFileSize) {
                    X.error('文件超出最大限制' + sizeFormater(conf.maxFileSize));
                    setBtnDisabled(false);
                    return false;
                }
                stop = false;
                ChunkedUploader(request).upload();
            };
            fr.readAsDataURL(file);
        } else {
            file_size = file.size;
            if (typeof(conf.maxFileSize) !== 'undefined' && file.size > conf.maxFileSize) {
                X.error('文件超出最大限制' + sizeFormater(conf.maxFileSize));
                setBtnDisabled(false);
                return false;
            }
            stop = false;
            ChunkedUploader(request).upload();
        }
    });

    /**
     * 资源上传完成
     */

    function uploaded(response) {
        // var form = X('itemForm');
        // var pos = response.name.lastIndexOf(".");
        // var fname = response.name.substring(pos + 1);
        var obj = {};
        obj.name = response.name;
        obj.id = response.id;
        conf.callback(obj);
        $("#file-upload-overlay").hide();
        stop = false;
        current = 0;
        tries = 0;
        X(conf.goBtn).css('display', 'none');
        X(conf.pauseBtn).css('display', 'none');
    }

    //打开面板

    function uploadFile(evt, obj) {
        if (!obj.callback) {
            X.error("缺少返回函数");
            return;
        }
        if (!obj.uri) {
            X.error("缺少上传服务地址");
            return;
        }
        // if (!obj.fileType) {
        //     X.error("缺少文件类型");
        //     return;
        // }
        $(".file-upload-type").html("允许上传的文件扩展名：" + (obj.fileType || "所有类型"));
        stop = false;
        conf.callback = obj.callback;
        conf.fileType = obj.fileType;

        if (obj.maxSize) {
            conf.maxFileSize = obj.maxSize;
            if (ISIE) {
                if (obj.maxSize > 10 * 1024 * 1024) {
                    conf.maxFileSize = 10 * 1024 * 1024; //上传文件的最大限制,单位B
                }
            } else {
                if (obj.maxSize > 200 * 1024 * 1024) {
                    conf.maxFileSize = 200 * 1024 * 1024; //上传文件的最大限制,单位B
                }
            }
        }

        conf.uri = obj.uri;
        setBtnDisabled(false);
        X(conf.filename).innerHTML = "";
        X(conf.processer).css('width', 0);
        X(conf.percent).innerHTML = '0%';
        $(".pbar").hide();
        $("#file-upload-overlay").show();
    }
    X.sub("chunkFile", uploadFile);
});