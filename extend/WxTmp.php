<?php


/* 模板信息推送主类 */
class WxTmp
{
    //请求模板消息的地址
    const TEMP_URL = 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=';

    private $access_token;
    private $appid;
    private $appsecret;

    public function __construct()
    {
        $this->appid = APPID;
        $this->appsecret = APPSECRET;
    }

    public function getAccessToken(){
        //这里获取accesstoken  请根据自己的程序进行修改
        // $tmp_access_token = \think\Session::get('tmp_access_token');
        // if (empty($tmp_access_token)) {
        //     $url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' . $this->appid . '&secret=' . $this->appsecret;
        //     // $res = curlGet($url, [], 2);
        //     $res = get_contents($url, true);
        //     if ($res['access_token']) {
        //         \think\Session::set('tmp_access_token', $res['access_token'], $res['expires_in']-200);
        //         $tmp_access_token = $res['access_token'];
        //     } else {
        //         return false;
        //     }
        // }
        //全局只能有一个地方存储access_token，不能有多个，会有冲突，导致微信的jssdk问题，不易查找
        $tmp_access_token = model('wechat')->getWAccessToken();
        return $tmp_access_token;
    }
    /**
    * 微信模板消息发送
    * @param $openid 接收用户的openid
    * return 发送结果
    */
    public function send($touser,$template_id,$_url,$data){
        $tokens = $this->getAccessToken();
        $url = self::TEMP_URL . $tokens;
        $params = [
            // 'touser' => $openid,
            'touser' => $touser,
            // 'template_id' => 'Oblr5uXH_fS79gMC8E0mYz0CpUAHnJtdvAC3PWABrsk',//模板ID
            'template_id' => $template_id,
            // 'url' => 'https://www.liminghulian.com/course/3/lesson/list', //点击详情后的URL可以动态定义
            'url' => $_url,
            'data' => $data
            // 'data' => 
            //         [
            //           'first' => 
            //              [
            //                 'value' => '您好!有访客访给您留言了。',
            //                 'color' => '#173177'
            //              ],
            //           'user' => 
            //              [
            //                 'value' => '张三',
            //                 'color' => '#FF0000'
            //              ],
 
            //           'ask' => 
            //              [
            //                     'value' => '您好,非常关注黎明互联,有没有关于支付宝的视频教程?',
            //                     'color' => '#173177'
            //              ],
            //            'remark' => 
            //              [
            //                     'value' => '该用户已注册12天',
            //                     'color' => 'blue'
            //              ] 
            //           ]
        ]; 
        $json = json_encode($params,JSON_UNESCAPED_UNICODE);
        $res_json = $this->curlPost($url, $json);
        $res = json_decode($res_json,true);
        if (!empty($res['msgid'])) {
            $this->write_file($touser,$json);
            return true;
        }
        return false;
    }

    /**
     * 通过CURL发送数据
     * @param $url 请求的URL地址
     * @param $data 发送的数据
     * return 请求结果
    */
    protected function curlPost($url,$data)
    {
        $ch = curl_init();
        $params[CURLOPT_URL] = $url;    //请求url地址
        $params[CURLOPT_HEADER] = FALSE; //是否返回响应头信息
        $params[CURLOPT_SSL_VERIFYPEER] = false;
        $params[CURLOPT_SSL_VERIFYHOST] = false;
        $params[CURLOPT_RETURNTRANSFER] = true; //是否将结果返回
        $params[CURLOPT_POST] = true;
        $params[CURLOPT_POSTFIELDS] = $data;
        curl_setopt_array($ch, $params); //传入curl参数
        $content = curl_exec($ch); //执行
        curl_close($ch); //关闭连接
        return $content;
    }

    private function write_file($file_name, $content) {
        $this->mkdirs(ROOT_PATH . 'data/messagelog/' . date('Ym'));
        $filename = ROOT_PATH . 'data/messagelog/' . date('Ym') . '/' . $file_name . '.log';
        $Ts = fopen($filename, "a+");
        fputs($Ts, "\r\n" . $content);
        fclose($Ts);
    }

    private function mkdirs($dir, $mode = 0777) {
        if (is_dir($dir) || @mkdir($dir, $mode))
            return TRUE;
        if (!$this->mkdirs(dirname($dir), $mode))
            return FALSE;
        return @mkdir($dir, $mode);
    }
}

?>