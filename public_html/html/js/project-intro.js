/**
 * My module:
 *  项目介绍
 */
X.sub("init", function() {
    /*检查当前语言*/
    function checkLang() {
        if (LANG == "EN") {
            document.title = EN.intro.title;
            $(".top,.center3").hide();
            $(".center2").css({background:"#f5f5f5"});
            
            var div = '';
            div += '<div class="goal">';
            div += '<span class="txt"><span class="Lwire"></span>'+(EN.intro.title)+'<span class="Rwire"></span></span>';
            div += '</div>';
            div += '<p>'+(EN.intro.content)+'</p>';
            $(".intro").html(div);
        }
    }
    checkLang();
    
    $(".picbox .bg").hover(function() {
        $(this).stop(true, true).animate({
            marginTop: "-40px"
        }, 200, null);
    }, function() {
        $(this).stop(true, true).animate({
            marginTop: "0"
        }, 500);
    });
    
    /**
     * swf播放器
     */
    function playResource() {
        //预览文件可以在播放器中显示
        setTimeout(function() {
            if (!swfobject.hasFlashPlayerVersion("6.0.65")) {
                $("#playerContent").html('<a id="getflashplayerScope" href="http://www.adobe.com/go/getflashplayer" style="color:#ff0000;padding:15px;display:block;text-align:center;">请点击这里允许浏览器运行 Adobe Flash Player</a>');
                $('#getflashplayerScope')[0].click();
            }
            var width = 1024;
            var length = 618;
            var viewer = "2";
            var playerSrc = "/player/DocPlayer.swf";
            var IService = '/assets/xml/aboutPlay.xml';
            if (LANG == "EN") {
                IService = '/assets/xml/aboutPlay_en.xml';
            }
            playerSrc = "/player/FlvPlayer.swf";
            var flashvars = {
                'uuid': '',
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
        }, 800);
    }
    
    playResource();

});