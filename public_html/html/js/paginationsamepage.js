X.sub("pagination", function(evt, resp) {
    // similar to the Java StringBuilder
    /*检查当前语言*/
    var lang = X.cookie.get("lang") || "CN";

    var StringBuilder = function(value) {
        var data = [];

        this.append = function(v) {
            if (v) {
                data.push(v);
            }
            return this;
        };

        this.append(value);

        this.clear = function() {
            while (data.pop()) {}
        };

        this.toString = function() {
            return data.join("");
        };
    };
    //pagination
    var pagination = resp.ele || X('pagination');

    var limit = resp.limit || 10;
    limit = parseInt(limit);
    var sb = new StringBuilder();
    var start = parseInt(resp.meta.start);
    var total = parseInt(resp.meta.total);
    var totalPages = Math.ceil(total / limit);
    var currentPage = Math.floor(start / limit) + 1;
    if (limit === 1) {
        currentPage = Math.floor(start / limit);
    }

    var firstPage = Math.max(currentPage - 4, 1);
    var lastPage = Math.min(Math.max(currentPage + 4, 9), totalPages);


    if (currentPage > 1) {
        sb.append('<li class="prev">');
        sb.append('<a href="/#" onclick="X.pub(\'' + (resp.evt || "gotoPage") + '\',{start:');
        sb.append((((currentPage - 2) * limit) + 1) + "});return false;");
        sb.append()
            .append('" rel="prev" >« '+(lang == "EN"?"Previous Page":"上一页")+'</a></li>');
    }
    if (firstPage > 2) {
        sb.append('<li ><a href="/#" onclick="X.pub(\'' + (resp.evt || "gotoPage") + '\',{start:0});return false;"');
        sb.append('" rel="prev">1</a></li>');
    }

    for (var i = firstPage; i < lastPage + 1; ++i) {
        if (i === currentPage) {
            sb.append('<li class="selected">');
            sb.append(i + "").append('</li>');
        } else {
            sb.append('<li ><a href="/#" onclick="X.pub(\'' + (resp.evt || "gotoPage") + '\',{start:');
            sb.append((((i - 1) * limit) + 1) + "});return false;");
            sb.append('" rel="next">');
            sb.append(i + "").append('</a></li>');
        }
    }

    if (lastPage < totalPages) {
        sb.append('<li ><a href="/#" onclick="X.pub(\'' + (resp.evt || "gotoPage") + '\',{start:');
        sb.append((((totalPages - 1) * limit) + 1) + "});return false;");
        sb.append('" rel="next">');
        sb.append(totalPages + "").append('</a></li>');
    }

    if (currentPage * limit < total) {
        sb.append('<li class="next">');
        sb.append('<a href="/#" onclick="X.pub(\'' + (resp.evt || "gotoPage") + '\',{start:');
        sb.append(((currentPage * limit) + 1) + "});return false;");
        sb.append()
            .append('" rel="prev" >'+(lang == "EN"?"Next Page":"下一页")+' »</a></li>');
    }
    if(lang == "EN"){
        sb.append('<span class="page_total">Total of:<b>' + total + '</b></span>');
    }else{
        sb.append('<span class="page_total">共<b>' + total + '</b>条</span>');
    }
    
    pagination.innerHTML = sb.toString();


});