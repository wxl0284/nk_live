X.sub("resizePanel", function(evt,ele) {
    function resize() {
        var form_panel = ele || $(".form_panel");
        if (form_panel) {
            form_panel.removeAttr("style");
            //top
            var fh = form_panel.innerHeight();
            var ph = $(window).height();
            if (fh > ph * 99 / 100) {
                fh = ph * 99 / 100;
                form_panel.height(fh - 60);
            } else {
                //form_panel.height("auto");
            }
            form_panel.css("marginTop", Math.floor(-fh / 2 - (ph - fh) / 4));
            //left
            var fw = form_panel.innerWidth();
            var pw = $(window).width();
            form_panel.css("marginLeft", Math.floor(-fw / 2));
        }
    }
    resize();
    window.onresize = function() {
        setTimeout(resize, 200);
        //resize();
    };
});