/**
 * My module:
 *  description about what it does
 */
// X.sub("init", function() {
//     //fill in your code here

//     /**
//      * 弹出层
//      */
//     var overlayu = X('form_details_overlay');
//     overlayu.style.visibility = 'hidden';

//     X('form_details_close').addEventListener('click', function() {
//         overlayu.style.visibility = 'hidden';
//     });
//     //申报资料
//     $('#uploadApply').click(function(){
//         X.get('/json/project?del=0&id=' + X.qs.id, function(respText) {
//             var resp = JSON.parse(respText);
//             var item = resp;
//             var applyPath = JSON.stringify(item.applyPath);
//             if (applyPath == "{}") {
//                 $("#details").html('<div class="noitems">暂无资料</div>');
//             } else {
//                 var filebox = item.applyPath;
//                 var str = "";
//                 for (var a in filebox) {
//                     str += '<a href=" ' + filebox[a]['url'] + ' " >' + filebox[a]['name'] + '</a>';
//                 }

//                 if (str == "") {
//                     str = "-";
//                 }
//                 $("#details").html(str);
//             }

//             X.pub('resizePanel');
//             overlayu.style.visibility = 'visible';
//         });
//     });
X.sub("init", function() {
    // 回到顶部
    $("#return_top").click(function() {
        $('html,body').animate({
            scrollTop: 0
        }, 0);
    });

});