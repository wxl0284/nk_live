//this allows a user to select a local file and then write it to a local canvas
X.sub("init", function() {

    var html = '<div class="imageSelector clearfix" ><div id="thumbPreview" > </div> <div class="image-file-content"><span class="image-file-btn" style="display:inline-block"><span class="image-file-txt" style="display:none;">选择图片</span><input id="imageFile"  type="file" name="imageFile"  accept="image/*"></span><div class="image-file-tip" style="display:none;padding:10px 0;font-size:13px;color:#999;"></div><div class="image-file-error" style="display:none;padding:10px 0;font-size:13px;color:#ff0000;"></div></div></div>';

    var callback = null;
    var res = [];
    var options = {};

    function onOK() {
        if (callback) {
            if (res.length) {
                callback(res);
            }
        }
    }

    var MAX_WIDTH = 26000;
    var MAX_HEIGHT = 26000;
    var lang = "CN";

    function read(file, preview) {
        var reader = new FileReader();
        reader.onloadend = function(evt) {
            var r = {};
            r.name = file.name;
            r.data = evt.target.result;

            var img = document.createElement("img");
            img.src = r.data;
            img.onload = function() {
                var width = img.width;
                var height = img.height;
                if (width > MAX_WIDTH) {
                    if (lang == "EN") {
                        error2("The image length  exceeds recommended size(" + MAX_WIDTH + " px), Please upload an image of recommended size.");
                    } else {
                        error2("图片宽度不符合规定(" + MAX_WIDTH + " px)，请重新上传。");
                    }
                    return;
                }
                if (height > MAX_HEIGHT) {
                    if (lang == "EN") {
                        error2("The image width exceeds recommended size(" + MAX_HEIGHT + " px), Please upload an image of recommended size.");
                    } else {
                        error2("图片高度不符合规定(" + MAX_HEIGHT + " px)，请重新上传。");
                    }
                    return;
                }
                if (width > MAX_WIDTH || height > MAX_HEIGHT) {
                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    var canvas = document.createElement("canvas");
                    canvas.width = width;
                    canvas.height = height;
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);
                    r.data = canvas.toDataURL("image/jpeg");
                    var i = file.name.indexOf('.');
                    if (i !== -1) {
                        r.name = file.name.substring(0, i) + ".jpg";
                    } else {
                        r.name = file.name + ".jpg";
                    }
                }
                r.data = r.data.replace(/[\r\n]/g, '');
                r.data = r.data.replace(' ', '');
                r.data = r.data.replace('\n', '');
                r.data = r.data.replace('\r', '');
                res.push(r);

                var ua = navigator.userAgent.toLowerCase();
                var bIE = ua.match(/msie/);
                var isIE8 = false;
                if (bIE) {
                    var va = ua.substr(ua.indexOf("msie "), 6);
                    var vs = va.split(' ');
                    //alert(vs[1]);
                    var v = parseInt(vs[1]);
                    if (v == 8) {
                        isIE8 = true;
                    }
                }

                if (file.size > 32 * 1024 && isIE8) {
                    X("thumbPreview").innerHTML = file.name;
                } else {
                    preview.appendChild(img);
                }
                X.pub("resizeDialog");
            };
        };

        reader.readAsDataURL(file);
    }

    // 错误提示

    function error2(msg) {
        $(".image-file-error").text(msg).show();
        res = [];
        if (options.defaultThumbPreview) {
            $("#thumbPreview").html('<img src="' + options.defaultThumbPreview + '" />');
        } else {
            $("#thumbPreview").html("");
        }
    }

    function onSelectImage(name, obj) {
        options = obj;
        if (!obj.callback) {
            alert('必须指定回调函数');
        }
        obj.size = obj.size || 1024 * 1024; //默认1M大小
        MAX_WIDTH = obj.max_width || 26000; //宽度限制
        MAX_HEIGHT = obj.max_height || 26000; //高度限制
        callback = obj.callback;
        lang = obj.lang || "CN";
        var show = {};
        show.msg = html;
        if (lang == "EN") {
            show.title = "Select Image";
            show.okText = "Confirm";
            show.closeText = "Cancel";
        } else {
            show.title = "选择图片";
        }
        show.callback = onOK;
        X.pub('showDialog', show);
        
        if(lang == "EN"){
            $(".image-file-txt").text("Select Image");
        }
        // 默认图片
        if (obj.defaultThumbPreview) {
            $("#thumbPreview").html('<img src="' + obj.defaultThumbPreview + '" />');
        }

        // 提示语
        if (obj.tipText) {
            $(".image-file-tip").html(obj.tipText).show();
        }
        /**
         * jquery.filereader
         */
        $('#imageFile').fileReader({
            id: 'fileReaderSWF',
            filereader: '/js/fileReader/filereader.swf',
            expressInstall: '/js/fileReader/expressInstall.swf',
            debugMode: false,
            callback: function() {
                // alert('filereader polyfill loaded');
            }
        });

        $('#imageFile').on('change', function(evt) {
            var preview = X('thumbPreview');
            res = [];
            var files = evt.target.files;
            // 重置错误提示
            $(".image-file-error").text("").hide();
            // 检测是否有不合格图片
            var isTest = true;
            for (var i = 0; i < files.length; ++i) {
                if (files[i].size > obj.size) {
                    isTest = false;
                    break;
                }
            }
            if (!isTest) {
                if (lang == "EN") {
                    error2("The image exceeds the recommended size(" + obj.size / 1024 + " KB), The image exceeds the recommended size.");
                } else {
                    error2("图片大小不符合规定(" + obj.size / 1024 + " KB)，请重新上传。");
                }
                return;
            }
            preview.innerHTML = "";
            // 读取图片
            for (var i = 0; i < files.length; ++i) {
                read(files[i], preview);
            }
        });
    }

    X.sub('selectImage', onSelectImage);
});