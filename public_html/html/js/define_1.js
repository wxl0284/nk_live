/**
 *  定义常量
 */
//验证非0整数
var INT_REG_F = /^[1-9][0-9]*$/;
var INT_REG = /^[0-9]*$/;
var MOBILE_REG = /^1[0|1|2|3|4|5|6|7|8|9][0-9]{9}$/;
var EMAIL_REG = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var FLOAT_REG = /^[0-9]+\.?[0-9]+$/;
var FLOAT_REG2 = /(^[0-9]+$)|(^[0-9]+\.?[0-9]?$)/;
var URL_REG = /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/;
var SHENBAO_EXPIRE = (new Date("2018/09/30 23:59:59")).getTime();

var FILE_ALLOW_TYPE = {
    "jpg": ["实验/实训/实习", "教学案例", "人物", "票证账表", "工程图纸", "媒体素材", "学生作品", "教学软件", "虚拟仿真", "电子挂图", "行业信息", "技能竞赛", "职业认证", "教学系统", "拓展阅读", "专业资料", "其他"],
    "gif": ["实验/实训/实习", "教学案例", "人物", "票证账表", "工程图纸", "媒体素材", "学生作品", "教学软件", "虚拟仿真", "电子挂图", "行业信息", "技能竞赛", "职业认证", "教学系统", "拓展阅读", "专业资料", "其他"],
    "png": ["实验/实训/实习", "教学案例", "人物", "票证账表", "工程图纸", "媒体素材", "学生作品", "教学软件", "虚拟仿真", "电子挂图", "行业信息", "技能竞赛", "职业认证", "教学系统", "拓展阅读", "专业资料", "其他"],
    "avi": ["实验/实训/实习", "教学案例", "媒体素材", "专家讲座", "学生作品", "行业信息", "技能竞赛", "职业认证", "其他"],
    "flv": ["实验/实训/实习", "教学案例", "媒体素材", "专家讲座", "学生作品", "行业信息", "技能竞赛", "职业认证", "其他"],
    "mpeg": ["实验/实训/实习", "教学案例", "媒体素材", "专家讲座", "学生作品", "行业信息", "技能竞赛", "职业认证", "其他"],
    "rm": ["实验/实训/实习", "教学案例", "媒体素材", "专家讲座", "学生作品", "行业信息", "技能竞赛", "职业认证", "其他"],
    "rmvb": ["实验/实训/实习", "教学案例", "媒体素材", "专家讲座", "学生作品", "行业信息", "技能竞赛", "职业认证", "其他"],
    "mp4": ["教学录像", "实验/实训/实习", "教学案例", "媒体素材", "专家讲座", "学生作品", "专业标准", "行业信息", "技能竞赛", "职业认证", "课程标准", "工程录像", "微视频", "其他"],
    "mp3": ["实验/实训/实习", "媒体素材", "学生作品", "行业信息", "技能竞赛", "职业认证", "其他"],
    "doc": ["教学课件", "电子教案", "试卷", "实验/实训/实习", "教学案例", "习题作业", "文献资料", "名词术语", "人物", "常见问题", "任务工单", "学习手册", "票证账表", "例题习题", "媒体素材", "电子教材", "学生作品", "教学设计", "评价考核", "专业标准", "专业调研", "行业标准", "行业信息", "技能竞赛", "职业认证", "课程标准", "教学日历", "学习指南", "拓展阅读", "专业资料", "教学大纲", "重点难点", "课程简介", "微教案", "微习题", "微课件", "微反思", "其他"],
    "docx": ["教学课件", "电子教案", "试卷", "实验/实训/实习", "教学案例", "习题作业", "文献资料", "名词术语", "人物", "常见问题", "任务工单", "学习手册", "票证账表", "例题习题", "媒体素材", "电子教材", "学生作品", "教学设计", "评价考核", "专业标准", "专业调研", "行业标准", "行业信息", "技能竞赛", "职业认证", "课程标准", "教学日历", "学习指南", "拓展阅读", "专业资料", "教学大纲", "重点难点", "课程简介", "微教案", "微习题", "微课件", "微反思", "其他"],
    "xls": ["实验/实训/实习", "教学案例", "任务工单", "票证账表", "媒体素材", "学生作品", "行业信息", "技能竞赛", "职业认证", "其他"],
    "xlsx": ["实验/实训/实习", "教学案例", "任务工单", "票证账表", "媒体素材", "学生作品", "行业信息", "技能竞赛", "职业认证", "其他"],
    "ppt": ["教学课件", "实验/实训/实习", "教学案例", "演示文稿", "例题习题", "媒体素材", "电子教材", "学生作品", "教学设计", "评价考核", "专业标准", "专业调研", "行业标准", "行业信息", "技能竞赛", "职业认证", "课程标准", "拓展阅读", "专业资料", "微教案", "微习题", "微课件", "微反思", "其他"],
    "pptx": ["教学课件", "实验/实训/实习", "教学案例", "演示文稿", "例题习题", "媒体素材", "电子教材", "学生作品", "教学设计", "评价考核", "专业标准", "专业调研", "行业标准", "行业信息", "技能竞赛", "职业认证", "课程标准", "拓展阅读", "专业资料", "微教案", "微习题", "微课件", "微反思", "其他"],
    "pdf": ["教学课件", "电子教案", "试卷", "实验/实训/实习", "教学案例", "习题作业", "文献资料", "名词术语", "常见问题", "任务工单", "学习手册", "票证账表", "例题习题", "媒体素材", "电子教材", "学生作品", "教学设计", "评价考核", "专业标准", "专业调研", "行业标准", "行业信息", "技能竞赛", "职业认证", "课程标准", "教学日历", "学习指南", "拓展阅读", "专业资料", "教学大纲", "重点难点", "微教案", "微习题", "微课件", "微反思", "其他"],
    "txt": ["实验/实训/实习", "教学案例", "文献资料", "名词术语", "常见问题", "媒体素材", "学生作品", "行业信息", "技能竞赛", "职业认证", "其他"],
    "swf": ["实验/实训/实习", "教学案例", "媒体素材", "电子教材", "模拟实训\\实验动画", "学生作品", "教学软件", "虚拟仿真", "行业信息", "技能竞赛", "职业认证", "教学系统", "拓展阅读", "专业资料", "其他"]
};

var FILE_MIME = {
    "jpg": "image/*",
    "gif": "image/*",
    "png": "image/*",
    "avi": "video/x-msvideo",
    "flv": "flv-application/octet-stream",
    "mpeg": "video/mpeg",
    "rm": "audio/x-pn-realaudio",
    "rmvb": "audio/x-pn-realaudio",
    "mp4": "video/mp4",
    "mp3": "audio/mpeg",
    "doc": "application/msword",
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "xls": "application/vnd.ms-excel",
    "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "ppt": "application/vnd.ms-powerpoint",
    "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "pdf": "application/pdf",
    "txt": "text/plain",
    "swf": "application/x-shockwave-flash"
};
var FILE_TYPE = 'jpg,gif,png,avi,flv,mpeg,rm,rmvb,mp4,mp3,doc,docx,xls,xlsx,ppt,pptx,pdf,txt,swf';
var RES_MEDIA_TYPE = [{
        "title": "音频",
        "sid": "audio"
    }, {
        "title": "视频",
        "sid": "video"
    }, {
        "title": "图片",
        "sid": "image"
    }, {
        "title": "动画",
        "sid": "swf"
    }, {
        "title": "混合媒体",
        "sid": "multi"
    }, {
        "title": "其他",
        "sid": "other"
    }, {
        "title": "文本",
        "sid": "txt"
    }, {
        "title": "Word文档",
        "sid": "doc"
    }, {
        "title": "PPT文档",
        "sid": "ppt"
    }, {
        "title": "Excel文档",
        "sid": "xls"
    }, {
        "title": "PDF",
        "sid": "pdf"
    }
];

var PROVINCE = ["北京市", "天津市", "河北省", "山西省", "内蒙古自治区", "辽宁省", "吉林省", "黑龙江省", "上海市", "江苏省", "浙江省", "安徽省", "福建省",
        "江西省", "山东省", "河南省", "湖北省", "湖南省", "广东省", "广西壮族自治区", "海南省", "重庆市", "四川省", "贵州省", "云南省", "西藏自治区", "陕西省", "甘肃省", "青海省", "宁夏回族自治区", "新疆维吾尔自治区", "新疆生产建设兵团", "香港特别行政区", "澳门特别行政区", "台湾省", "军队本科高校"
];
var GENDER = {
    "M": "男",
    "F": "女",
    "A": "未知"
};
var EN_GENDER = {
    "M": "Male",
    "F": "Female",
    "A": "Unknown"
};
/*项目级别*/
var PROJECT_LEVEL = [{
        "title": "国家级",
        "sid": "1"
    }, {
        "title": "其它",
        "sid": "2"
    }, {
        "title": "省级",
        "sid": "3"
    }, {
        "title": "校级",
        "sid": "4"
    }
];

/*项目默认图片*/
var PROJECT_DEFAULT = "/images/project-default.png";

/*项目层次*/
var PROJECT_EDULEVEL = [{
        "title": "本科",
        "sid": "1"
    }
];

/*行业*/
var INDUSTRY = ['选择行业', '农、林、木、渔业', '采矿业', '制造业', '电力、热力、燃气及水生产和供应', '建筑业', '批发和零售业', '交通运输、仓储和邮政业', '住宿和餐饮业', '信息传输、软件和信息技术服务业', '金融业', '房地产业', '租赁和商务服务业', '科学研究和技术服务业', '水利、环境和公共设施管理业', '居民服务、修理和其他服务业', '教育', '卫生和社会工作', '文化、体育和娱乐业', '公共管理、社会保障和社会组织', '国际组织'];

/*学历*/
var EDUCATION = ["", "专科", "本科", "硕士研究生", "博士研究生"];

/*学位*/
var DEGREE = ["", "学士", "硕士", "博士"];

/*专业技术职务*/
var TECH_DUTY = ["", "助教", "讲师", "副教授", "教授", "无"];

/*是否记录每步实验结果*/
var ISNOT = ["", "是", "否"];

/*实验结果与结论要求*/
var RESULTREQUIRE = ["", "实验报告", "心得体会", "其它"];

/*开发模式*/
var DEVELOPMODE = ["", "自主开发", "合作开发"];

/*知识产权归属*/
var RIGHTSBELONG = ["", "自主知识产权", "共有知识产权"];

/*开发技术*/
var DEVELOP_TECH = ["", "VR", "AR", "MR", "3D仿真", "二维动画", "HTML5", "其他"];

/*开发工具*/
var DEVELOP_TOOL = ["", "Unity3D", "3D Studio Max", "Maya", "ZBrush", "SketchUp", "Adobe Flash", "Unreal Development Kit", "Animate CC", "Blender", "Visual Studio", "其他"];

/*操作系统*/
var SYSTEM = ["", "Windows Server", "Linux", "其他"];

/*数据库*/
var DATABASE = ["", "Mysql", "SQL Server", "Oracle", "其他"];

/*软件著作权登记情况*/
var COPYRIGHT = ["","已登记","未登记"];

/*学校属性*/
var SCHOOL_ATTR = ["部属院校", "军队院校", "普通院校"];

/*其它职称序列*/
var OTHER_DUTY_SET = ["", "自然科学研究人员", "社会科学研究人员", "工程技术人员", "实验技术人员", "卫生技术人员", "新闻专业人员", "出版专业人员", "广播电视播音人员"];

/*其它职称*/
var OTHER_DUTY = {
    "1": ["研究员(Z)", "副研究员(Z)", "助理研究员(Z)", "研究实习员(Z)"],
    "2": ["研究员(S)", "副研究员(S)", "助理研究员(S)", "研究实习员(S)"],
    "3": ["正高级工程师", "高级工程师", "工程师", "助理工程师", "技术员"],
    "4": ["正高级实验师", "高级实验师", "实验师", "助理实验师", "实验员"],
    "5": ["主任医师", "副主任医师", "主治（主管）医师", "医师", "医士", "主任药师", "副主任药师", "主管药师", "药师", "药士", "主任护师", "副主任护师", "主管护师", "护师", "护士", "主任技师", "副主任技师", "主管技师", "技师", "技士"],
    "6": ["高级记者", "主任记者", "记者", "助理记者", "高级编辑", "主任编辑", "编辑(X)", "助理编辑(X)"],
    "7": ["编审", "副编审", "编辑(C)", "助理编辑(C)", "技术编辑", "助理技术编辑", "技术设计员", "一级校对", "二级校对", "三级校对"],
    "8": ["播音指导", "主任播音员", "一级播音员", "二级播音员", "三级播音员"]
};

/*实验云-实验共享范围*/
var EXP_SHARE_SCOPE = ["", "全网范围", "省级范围", "校级范围"];

/*获取当前语言*/
var LANG = X.cookie.get("lang") || "CN";

function en_error(msg) {
    var obj = {};
    obj.title = EN.public.prompt;
    obj.msg = '<p>' + msg + '</p>';
    obj.noCancel = true;
    obj.okText = EN.public.confirm;
    X.pub('showDialog', obj);
    submit = false;
}
//判断是否IE
var ISIE = false;

function isIEB() {
    return ("ActiveXObject" in window);
}
var _IE = (function() {
    var v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');
    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]);
    return v > 4 ? v : false;
}());

if (isIEB() || _IE) {
    ISIE = true;
}


//uri转换

function uri_pipe(_url) {
    var uri = _url;
    if (ISIE) {
        uri = encodeURI(uri);
    }
    return uri;
}

//获取radio的值

function getRadioValue(n) {
    var r = document.getElementsByName(n);
    var v = '';
    for (var i = 0; i < r.length; i++) {
        if (r[i].checked === true) {
            v = r[i].value;
        }
    }
    return v;
}
//radio赋值

function setRadioValue(n, val) {
    var r = document.getElementsByName(n);
    var v = '';
    for (var i = 0; i < r.length; i++) {
        if (r[i].value == val) {
            r[i].checked = true;
        }
    }
}

function trim(str) { //删除左右两端的空格
    　　
    return str.replace(/(^\s*)|(\s*$)/g, "");　　
}

/*字符串长度*/
function sb_strlen(str) {
    var i = 0;
    var c = 0.0;
    var unicode = 0;
    var len = 0;
    if (str === null || str === "" || str === undefined) {
        return 0;
    }
    len = str.length;
    for (i = 0; i < len; i++) {
        unicode = str.charCodeAt(i);
        if (unicode < 127) {
            c += 1;
        } else { //chinese
            c += 2;
        }
    }
    return c;
}

/*分割字符串*/
function sb_substr(str, endp, hasDot) {
    var i = 0,
        c = 0,
        unicode = 0,
        rstr = '';
    str = str || "暂无";
    var len = str.length;
    var sblen = sb_strlen(str);

    if (endp < 1) {
        endp = sblen + endp; // - ((str.charCodeAt(len-1) < 127) ? 1 : 2);
    }
    // 开始取
    for (i = i; i < len; i++) {
        unicode = str.charCodeAt(i);
        if (unicode < 127) {
            c += 1;
        } else {
            c += 2;
        }
        rstr += str.charAt(i);
        if (c >= endp) {
            break;
        }
    }
    if (hasDot && sblen > endp) {
        rstr += '…';
    }
    return rstr;
}

//英文标题按单词截取(参数说明 text:要截取的英文 len：要截取的长度)

function sliceEnglish(text, length) {
    var sliceLength = length; // 截取字符串长度
    if (text.length <= sliceLength) {
        text = text || "";
    } else {
        for (; sliceLength > 0; sliceLength--) {
            if (text.charAt(sliceLength) == ' ') {
                text = text.slice(0, sliceLength) + " ...";
                sliceLength = length;
                break;
            }
        }
    }
    return text;
}

//计算还可以输入多少字

function countWords(w, max, ele, language) {
    language = language || "cn"; // 需要限制的语言
    var num = w.length; //sb_strlen(w);
    var ln = max - num;
    // if (num <= max) {
    //     //ln = Math.floor((max - num) / 2);
    // }
    var t = '';
    if (language == "cn") {
        if (ln < 0) {
            if (LANG == "EN") {
                t = "Has more than <font color='red'>" + Math.abs(ln) + "</font> words";
            } else {
                t = "已超出<font color='red'>" + Math.abs(ln) + "</font>字";
            }
        } else {
            if (LANG == "EN") {
                t = "You can also enter <em>" + ln + "</em> words";
            } else {
                t = "还可以输入<em>" + ln + "</em>字";
            }
        }
    } else {
        if (ln < 0) {
            if (LANG == "EN") {
                t = "Has more than <font color='red'>" + Math.abs(ln) + "</font> words";
            } else {
                t = "已超出<font color='red'>" + Math.abs(ln) + "</font>字符";
            }
        } else {
            if (LANG == "EN") {
                t = "You can also enter <em>" + ln + "</em> words";
            } else {
                t = "还可以输入<em>" + ln + "</em>字符";
            }
        }
    }
    ele.html(t);
}


//数字格式化

function formatNum(num) {
    var unit = '';
    var fn = parseInt(num);
    if (num > 9999) {
        fn = (num / 10000).toFixed(1);
        unit = '万';
    }
    return fn + '' + unit;
}

//检查是否含有权限

function CHECKROLE(user, o) {
    var r = false;
    var g = user.group || [];
    for (var i = 0; i < g.length; i++) {
        if (g[i] === o) {
            r = true;
            break;
        }
    }
    return r;
}

//html转换

function htmlEscape(text) {
    return text.replace(/[<>"&]/g, function(match, pos, orginalText) {
        switch (match) {
            case "<":
                return "&lt;";
            case ">":
                return "&gt;";
            case "&":
                return "&amp;";
            case "\"":
                return "&quot;";
        }
    });
}

//根据sid获取课程一些属性的title

function get_title(arr, sid) {
    var r = "";
    for (var i = 0; i < arr.length; ++i) {
        if (arr[i].sid == sid) {
            r = arr[i].title;
            break;
        }
    }
    return r;
}

//根据sid(空格分隔，多个sid)获取课程一些属性的title

function get_titles(arr, sids) {
    var r = "";
    var s = sids.split(" ");
    for (var j = 0; j < s.length; ++j) {
        for (var i = 0; i < arr.length; ++i) {
            if (arr[i].sid == s[j]) {
                r += arr[i].title + " ";
                break;
            }
        }
    }
    r = r.substring(0, r.length - 1);
    return r;
}

//move-top
$(document).ready(function() {
    $().UItoTop({
        text: '<i class="move-to-up iconfont">&#xe705;</i>',
        easingType: 'easeOutQuart'
    });
});

// 图片元素img 自动水平or垂直居中

function imgAutoPostion($img, w_r, h_r, W, H) {
    var sw = w_r,
        sh = w_r / W * H
    if (sh < h_r) {
        sh = h_r;
        sw = h_r / H * W
    }
    $img.css({
        height: sh,
        width: sw,
        marginTop: -(sh - h_r) / 2,
        marginLeft: -(sw - w_r) / 2
    });
}
/* 获取全部数据 */
function getDataAll(e, options) {
    options = options || {};
    options.url = options.url || "";
    options.qt = options.qt || "";
    options.limit = options.limit || 200;
    if (!options.url || !options.qt) {
        error({
            code: "1",
            msg: "缺少参数"
        });
    }
    options.onload = options.onload || function() {};
    options.onprogress = options.onprogress || function() {};
    var limit = options.limit;
    var result = {};

    function load(datas, start, loaded) {
        loaded = loaded || 0;
        datas = datas || [];
        start = start || 1;
        var data = datas;
        X.get(options.url + '?limit=' + limit + '&start=' + start + '&' + options.qt, function(respText) {
            var resp = JSON.parse(respText);
            resp.meta = resp.meta || {
                'total': '0',
                'size': '0'
            };
            loaded += parseInt(resp.meta.size);
            for (var i = 0; i < resp.data.length; ++i) {
                var obj = resp.data[i];
                data.push(obj);
            }
            progress(parseInt(resp.meta.total), loaded);
            if (parseInt(resp.meta.total) > loaded) {
                load(data, loaded + 1, loaded);
            } else {
                result.meta = {};
                result.meta.total = resp.meta.total;
                result.meta.size = loaded;
                result.data = data;
                success();
            }
        }, function() {
            load(data, loaded, loaded);
        });
    }

    function progress(total, current) {
        options.onprogress({
            total: total,
            current: current
        });
    }

    function error(err) {
        options.onload(err);
    }

    function success() {
        options.onload(result);
    }
    load();
}
X.sub('getDataAll', getDataAll);
/* 富文本储存 */
function largeTextUpdate(e, options) {
    options = options || {};
    options.id = options.id || "";
    options.desc = options.desc || "";
    options.parentId = options.parentId || "";
    options.type = options.type || "";
    options.data = options.data || {};
    options.callback = options.callback || function() {};
    if (!options.desc || !options.parentId || !options.type) {
        error('缺少参数');
        return;
    }
    var edit = "";
    if (options.id) {
        edit = "&id=" + options.id;
    }
    X.post('/large/text/update?desc=' + options.desc + '&parentId=' + options.parentId + '&type=' + options.type + edit, options.data, function(res) {
        res = JSON.parse(res);
        if (res.code != '0') {
            error(res.msg);
        } else {
            options.callback(res);
        }
    }, function() {
        error('超时');
    });

    function error(msg) {
        var err = {
            code: '1',
            msg: msg
        };
        options.callback(err);
    }
}
X.sub('largeTextUpdate', largeTextUpdate);

/*获取字符串在数据组中的下标index*/
function get_index(arr, str) {
    if (str === "") {
        return 0;
    } else {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === str) {
                return i;
            }
        }
    }
}

/* 文件 Reader */
function fileReader(e, options) {
    var file = "";
    var isDynamic = false;
    var _time = new Date().getTime();
    options = options || {};
    options.XLSX = options.XLSX || false;
    options.gb2312 = options.gb2312 || false;
    options.multiple = options.multiple || "";
    options.input = options.input || "";
    options.accept = options.accept || "";
    options.onload = options.onload || function() {};
    options.onloadend = options.onloadend || function() {};
    options.onloadstart = options.onloadstart || function() {};
    options.onprogress = options.onprogress || function() {};
    if (!options.input) {
        var $input = $("<input/>");
        if (options.multiple == "multiple") {
            $input.attr('multiple', 'multiple');
        }
        $input.attr('type', 'file');
        $input.attr('class', 'pos-abt invisible');
        $input.attr('style', 'z-index:-9999;top:-100%;left:-100%;');
        $input.attr('id', 'fileInput-' + _time);
        $input.attr('name', 'fileInput-' + _time);
        $input.attr('accept', options.accept);
        $('body').append($input);
        options.input = 'fileInput-' + _time;
        isDynamic = true;
    }
    if (!window.FileReader) {
        var $script = $('<script />');
        $script.attr('id', 'jqFileReader');
        $script.attr('src', '/js/fileReader/jquery.FileReader.js');
        if ($('body').find('#jqFileReader').length === 0) {
            $('body').append($script);
        }
        $('#' + options.input).fileReader({
            id: 'fileReaderSWF',
            filereader: '/js/fileReader/filereader.swf',
            expressInstall: '/js/fileReader/expressInstall.swf',
            debugMode: false
        });
    }
    var fr = new FileReader();
    var frSize = 0;
    var frs = [];
    var userAgent = navigator.userAgent;
    $('#' + options.input)[0].click();
    $('#' + options.input).on('change', function(e) {
        if (options.multiple == "multiple") {
            // file = e.target.files;
            file = [];
            frSize = e.target.files.length;
            for (var i = 0; i < frSize; i++) {
                var reader = new FileReader();
                reader.onloadend = (function(f) {
                    return function(e) {
                        frs.push(this);
                        file.push(f);
                        if (frs.length === frSize) {
                            options.onloadend(frs, file);
                            if (isDynamic) {
                                $('#' + options.input).remove();
                            }
                        }
                    };
                })(e.target.files[i]);
                e.target.files[i].name = e.target.files[i].name || "";
                if (options.XLSX) {
                    if ( !! window.ActiveXObject || "ActiveXObject" in window) {
                        if (e.target.files[i].name.indexOf('.csv') != -1) {
                            if (options.gb2312) {
                                reader.readAsText(e.target.files[i], 'gb2312');
                            } else {
                                reader.readAsDataURL(e.target.files[i]);
                            }
                        } else {
                            reader.readAsDataURL(e.target.files[i]);
                        }
                    } else if (userAgent.indexOf("Edge") > -1) {
                        if (e.target.files[i].name.indexOf('.csv') != -1) {
                            if (options.gb2312) {
                                reader.readAsText(e.target.files[i], 'gb2312');
                            } else {
                                reader.readAsDataURL(e.target.files[i]);
                            }
                        } else {
                            reader.readAsDataURL(e.target.files[i]);
                        }
                    } else {
                        reader.readAsBinaryString(e.target.files[i]);
                    }
                } else {
                    if (e.target.files[i].name.indexOf('.csv') != -1) {
                        if (options.gb2312) {
                            reader.readAsText(e.target.files[i], 'gb2312');
                        } else {
                            reader.readAsDataURL(e.target.files[i]);
                        }
                    } else {
                        reader.readAsDataURL(e.target.files[i]);
                    }
                }
            }
        } else {
            file = e.target.files[0];
            if (options.XLSX) {
                if ( !! window.ActiveXObject || "ActiveXObject" in window) {
                    if (e.target.files[0].name.indexOf('.csv') != -1) {
                        if (options.gb2312) {
                            fr.readAsText(e.target.files[0], 'gb2312');
                        } else {
                            fr.readAsDataURL(e.target.files[0]);
                        }
                    } else {
                        fr.readAsDataURL(e.target.files[0]);
                    }
                } else if (userAgent.indexOf("Edge") > -1) {
                    if (e.target.files[0].name.indexOf('.csv') != -1) {
                        if (options.gb2312) {
                            fr.readAsText(e.target.files[0], 'gb2312');
                        } else {
                            fr.readAsDataURL(e.target.files[0]);
                        }
                    } else {
                        fr.readAsDataURL(e.target.files[0]);
                    }
                } else {
                    fr.readAsBinaryString(e.target.files[0]);
                }
            } else {
                if (e.target.files[0].name.indexOf('.csv') != -1) {
                    if (options.gb2312) {
                        fr.readAsText(e.target.files[0], 'gb2312');
                    } else {
                        fr.readAsDataURL(e.target.files[0]);
                    }
                } else {
                    fr.readAsDataURL(e.target.files[0]);
                }
            }
        }
    });
    if ( !! window.ActiveXObject || "ActiveXObject" in window) {
        $('#' + options.input).change();
    } else if (userAgent.indexOf("Edge") > -1) {
        $('#' + options.input).change();
    }
    fr.onloadstart = function() {
        options.onloadstart();
    }
    fr.onprogress = function(e) {
        options.onprogress(e);
    }
    fr.onload = function(e) {
        options.onload(e);
    }
    fr.onloadend = function(e) {
        options.onloadend(e, file);
        if (isDynamic) {
            $('#' + options.input).remove();
        }
    }
}
X.sub('fileReader', fileReader);