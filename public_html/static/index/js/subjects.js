var subjects = [];
$.ajax({
    type:"POST",
    url:"/index/index/category",
    dataType:"json",
    async:false,
    success:function(r){
        
        subjects = r.result;
    },
    error:function(){
        console.log("error");
    }
})

    