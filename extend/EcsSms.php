<?php


/* 短信模块主类 */
class EcsSms {

    var $sms_name = NULL; //用户名
    var $sms_password = NULL; //密码
    var $signature = NULL;

    function __construct() {
        /* 直接赋值 */
        $this->sms_name = '306400850';
        $this->sms_password = 'tlgaj400850';
        $this->signature = '虚拟仿真';
    }
    
    // 发送短消息
    function send($phones, $msg, $send_date = '', $send_num = 1, $sms_type = '', $version = '1.0', &$sms_error = '') {

        //function send($phones, $msg, &$sms_error = '') {
        /* 检查发送信息的合法性 */
        $contents = $this->get_contents($phones, $msg);
        if (!$contents) {
            return false;
        }
        /* 获取API URL */
        $sms_url = "http://api.sms.cn/mt/";
        if (count($contents) > 1) {
            foreach ($contents as $key => $val) {
                //传数据
                $post_data = array();
                $post_data['uid'] = $this->sms_name;
                $post_data['pwd'] = md5($this->sms_password.$this->sms_name); //网关验证密码
                $post_data['mobile'] = $val['phones'];
                $post_data['content'] = $this->safecode($content);
                $post_data['mobileids'] = $val['phones'].time();
                $post_data['encode'] = "utf8";
                echo('1');
                dump($post_data);
                $result = $this->curlPost($sms_url, $post_data);
                sleep(1);
            }
        } else {
            $post_data = array();
            $post_data['uid'] = $this->sms_name;
            $post_data['pwd'] = md5($this->sms_password.$this->sms_name); //网关验证密码
            $post_data['mobile'] = $contents[0]['phones'];
            $post_data['content'] = $this->safecode($contents[0]['content']);
            $post_data['mobileids'] = $contents[0]['phones'].time();
            $post_data['encode'] = "utf8";
            echo('2');
            dump($post_data);
            $result = $this->curlPost($sms_url, $post_data);
        }
        return $result;
//        if( strstr($result,'stat=100'))
//        {
//            return true;
//        }
//        else if( strstr($result,'stat=101'))
//        {
//            $this->logResult("验证失败! 状态：".$result);
//            return false;
//        }
//        else
//        {
//            $this->logResult("发送失败! 状态：".$result);
//            return false;
//        }
    }
    function safecode($content=""){
        //过滤黑字典
        $content = str_replace('1989','1 9 8 9',$content);
        $content = str_replace('1259','1 2 5 9',$content);
        $content = str_replace('12590','1 2 5 9 0',$content);
        $content = str_replace('10086','1 0 0 8 6',$content);
        $content = urlencode($content);
        return $content;
    }
    //检查手机号和发送的内容并生成生成短信队列
    function get_contents($phones, $msg) {
        if (empty($phones) || empty($msg)) {
            return false;
        }
        //$msg.='【'. $GLOBALS['_CFG']['shop_name'].'】'; //by wanganlin delete
        $phone_key = 0;
        $i = 0;
        $phones = explode(',', $phones);
        foreach ($phones as $key => $value) {
            if ($i < 200) {
                $i++;
            } else {
                $i = 0;
                $phone_key++;
            }
            if ($this->is_moblie($value)) {
                $phone[$phone_key][] = $value;
            } else {
                $i--;
            }
        }
        $from = $this->auto_encode($msg);
        if (!empty($phone)) {
            foreach ($phone as $phone_key => $val) {
                // dump($this->auto_charset($msg));
                // exit;
//                if (EC_CHARSET != 'utf-8') {
//                    $phone_array[$phone_key]['phones'] = implode(',', $val);
//
//                    $phone_array[$phone_key]['content'] = $this->auto_charset($msg,$from);
//                } else {
                    $phone_array[$phone_key]['phones'] = implode(',', $val);
                    $phone_array[$phone_key]['content'] = $msg;
//                }
            }
            return $phone_array;
        } else {
            return false;
        }
    }

    function auto_encode($fContent){
        $encode = mb_detect_encoding($fContent, array("ASCII","UTF-8","GB2312","GBK","BIG5"));
        return $encode;
    }

    // 自动转换字符集 支持数组转换
    function auto_charset($fContents, $from, $to = 'utf-8') {
        $from = strtoupper($from) == 'UTF8' ? 'utf-8' : $from;
        $to = strtoupper($to) == 'UTF8' ? 'utf-8' : $to;
        if (strtoupper($from) === strtoupper($to) || empty($fContents) || (is_scalar($fContents) && !is_string($fContents))) {
            //如果编码相同或者非字符串标量则不转换
            return $fContents;
        }
        if (is_string($fContents)) {

            if (function_exists('mb_convert_encoding')) {
                return mb_convert_encoding($fContents, $to, "auto");
            } elseif (function_exists('iconv')) {
                return iconv($from, $to, $fContents);
            } else {
                return $fContents;
            }
        } elseif (is_array($fContents)) {
            foreach ($fContents as $key => $val) {
                $_key = auto_charset($key, $from, $to);
                $fContents[$_key] = auto_charset($val, $from, $to);
                if ($key != $_key)
                    unset($fContents[$key]);
            }
            return $fContents;
        }
        else {
            return $fContents;
        }
    }
    // 检测手机号码是否正确
    function is_moblie($moblie) {
        return preg_match("/^0?1((3|8|7)[0-9]|5[0-35-9]|4[57])\d{8}$/", $moblie);
    }
    //打印日志
    function logResult($word = '') {
        $fp = fopen(ROOT_PATH . "data/smserrlog.txt", "a");
        flock($fp, LOCK_EX);
        fwrite($fp, "执行日期：" . strftime("%Y%m%d%H%M%S", time()) . "\n" . $word . "\n");
        flock($fp, LOCK_UN);
        fclose($fp);
    }

    /**
     * 通过CURL发送数据
     * @param $url 请求的URL地址
     * @param $post_data 发送的数据
     * return 请求结果
    */
    protected function curlPost($url,$post_data)
    {
        //支持json数据数据提交
        if(is_array($post_data)){
            $post_string = http_build_query($post_data, '', '&');
        }else {
            $post_string = $post_data;
        }  
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_string);
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);    // https请求 不验证证书和hosts
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 5);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array()); //模拟的header头
        $result = curl_exec($ch);
        curl_close($ch);
        return $result;
    }
}

?>