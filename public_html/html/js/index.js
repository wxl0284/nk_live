/**
 * My module:
 *  description about what it does
 */
X.sub("init", function() {
	//fill in your code here
	
	var itemDetail = '/notice/get';
	var activitySearch = '/api/nologin/index/activity/search';
	
	loadBanner();
	loadNotice();
	loadActivity();
	loadAd();
	
	function loadBanner() {
	    X.get('/flash/search?sortby=id&reverse=true&position=0&status=1&isdel=2', function(respText) {
	        var resp = JSON.parse(respText);
	        var html = '';
	        if (resp.meta.total === '0') {
	            html = '';
	        } else if (resp.meta.total === '1'){
	            html = '<img src="' + resp.data[0].imgPath + '" />';
	        } else {
	            var size = resp.meta.size;
	            html += '<div class="swiper-container"><div class="swiper-wrapper">';
	            for (var i = 0; i < size; i++) {
	                var item = resp.data[i];
                    html += '<div class="swiper-slide"><img src="' + item.imgPath + '" /></div>';
	            }
	            html += '</div><div class="swiper-pagination"></div></div>';
	        }
	        $('#banner').html(html);
	    });
	}
	
	//轮播
    var mySwiper = new Swiper ('.swiper-container', {
        autoplay: 5000,
        direction: 'horizontal', // 水平切换选项
        speed: 300,
        loop: true, // 循环模式选项
        
        // 如果需要分页器
        pagination: '.swiper-pagination',
        paginationClickable :true,
        
        // 如果需要前进后退按钮
        // prevButton: '.swiper-button-prev',
        // nextButton: '.swiper-button-next',
    });
	
	function loadNotice() {
	    X.get('/notice/search?sortby=id&reverse=true&status=1&isdel=2', function(respText) {
	        var resp = JSON.parse(respText);
	        var html = '';
	        if (resp.meta.total !== '0') {
	            var size = resp.meta.size;
	            for (var i = 0; i < size; i++) {
	                var item = resp.data[i];
	                var date = new Date().getTime();
	                if (date > item.startTime && date < item.endTime) {
	                   // item.title = "长度测试长度测试长度测试长度测试长度测试长度测试";
	                    html += '<li><i class="iconfont icon-set">&#xe6ac;</i>';
    	                html += '<a href="javascript:;" onclick="X.pub(\'showNotice\',\'' + item.id + '\')">' + item.title + '</a>';
    	                html += '</li>';
	                }
	            }
	        }
	        if (html.length > 0) {
	            $('#noticeList').html(html);
	            noticeCircle();
	        } else {
	            $('#div1').empty();
	        }
	    });
	}
	
	function noticeCircle() {
	    //通知滚动
	    var odiv = document.getElementById('div1');
		var oul = odiv.getElementsByTagName('ul')[0];
		var ali = oul.getElementsByTagName('li');
		var spa = -1.5;
		var w = 0;
		for (var i = 0; i < ali.length; i++) {
		    w += ali[i].offsetWidth;
		    w += 150;
		}
		oul.style.width=w+ali.length+'px';
		oul.style.left=odiv.offsetWidth+'px';
		function move(){
			if(oul.offsetLeft<-oul.offsetWidth){
				oul.style.left=odiv.offsetWidth + 'px';
			}
			oul.style.left=oul.offsetLeft+spa+'px';
		}
		
		var timer = setInterval(move,35);
		odiv.onmousemove=function(){clearInterval(timer);}
		odiv.onmouseout=function(){timer = setInterval(move,35)};
	}
	
	function loadActivity() {
	    X.post(activitySearch, {}, onGetActivity);
	   // X.get('/info/search?sortby=dateSeq&reverse=true&status=1&isdel=2&limit=4', onGetActivity);
	}
	
	function onGetActivity(respText) {
	    var resp = JSON.parse(respText);
	    if (resp.meta.total === '0') {
	        $('#activityList').html('<div style="text-align: center;padding-right: 20px;">暂无活动</div>');
	    } else {
	        var size = parseInt(resp.meta.size);
	        var html = '';
	        for (var i = 0; i < size; i++) {
	            var item = resp.data[i];
	            html += '<ul class="news2-list" id="newList">';
	            var cls = '';
	            if (i == 0 || i == 2) {
	                cls = 'mr';
	            }
                html += '<li class="li ' + cls + '">';
                html += '<div class="new2-date">';
                var year = item.date.slice(0,4);
                var month = item.date.slice(5,7);
                var date = item.date.slice(8);
                html += '<div class="date">' + date + '</div>';
                html += '<div class="year">' + year + '/' + month + '</div>';
                html += '</div>';
                // var tl = item.title.length;
                // if (tl > 26) {
                //     item.title = (item.title).substring(0, 26) + '...';
                // }
                html += '<a href="/activity/detail?id=' + item.id + '" class="news2-title">' + item.title + '</a>';
                // if (item.brief.length > 0) {
                    
                //     var cl = item.brief.length;
                //     if (cl > 46) {
                //         item.brief = (item.brief).substring(0, 46) + '...';
                //     }
                //     html += '<div class="news2-content">' + item.brief + '</div>';
                // } else {
                //     html += '<a href="/activity/detail?id=' + item.id + '" class="news2-title nobrief">' + item.title + '</a>';
                // }
                html += '</li>';
                html += '</ul>';
	        }
	       // console.log(html);
	        $('#activityList').html(html);
	    }
	}
	
	function loadAd() {
	    X.get('/flash/search?sortby=id&reverse=true&position=1&status=1&isdel=2&limit=1', function(respText) {
	        var resp = JSON.parse(respText);
	        if (resp.meta.total === '0') {
	            $('#ad').html('<img src="images/ad.jpg" width="280" height="345" />');
	        } else {
	            var item = resp.data[0];
	            var html = '<img src="' + item.imgPath + '" width="280" height="345" />';
	            $('#ad').html(html);
	        }
	    });
	}
	
	// 点击通知
    X.sub("showNotice", function(evt, id) {
        X.get(itemDetail + "?id=" + id, function(resp) {
            resp = JSON.parse(resp);
            var div = '<div class="dialog_bg"></div>';
            div += '<div class="dialog_box">';
            div += '<p class="dialog_top">平台通知<span class="close btn_close">&times;</span></p>';
            div += '<div class="dialog_content">';
            div += '<h2 class="dialog_title">'+(resp.title || "-")+'</h2>';
            div += '<ul class="content_list">';
            // div += '<li><strong class="content_title">开始时间：</strong>'+(moment(resp.startTime).format("YYYY-MM-DD HH:mm:ss") || "-")+'</li>';
            // div += '<li><strong class="content_title">结束时间：</strong>'+(moment(resp.endTime).format("YYYY-MM-DD HH:mm:ss") || "-")+'</li>';
            div += '<li><strong class="content_title">通知内容：</strong>'+(resp.content || "-")+'</li>';
            div += '</ul>';
            div += '<button class="close dialog_btn btn_confirm">确认</button>';
            div += '</div>';
            div += '</div>';
            $("body").append(div);
            $(".dialog_bg,.dialog_box").fadeIn('fast');
            $(".close").off('click').on('click',function(){
    			$(".dialog_bg,.dialog_box").hide().remove();
    		});
        });
    });
});
