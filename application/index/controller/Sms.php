<?php
namespace app\index\controller;

/**
 * ============================================================================
 * 文件名称：SmsController.class.php
 * ----------------------------------------------------------------------------
 * 功能描述：ECTOUCH 短信发送控制器
 * ----------------------------------------------------------------------------
 */

use think\Cache;
use think\Db;
use think\Session;
//use EscSms;
use Ucpaas;

class Sms extends \think\Controller
{
    protected $mobile;
    protected $mobile_code;//手机接受验证码

    private $token = [
        'accountsid' => '3109422aeee78d7f5f219fdb3c9d7cab',
        'token' => '65ecf4196436032ccda850288b6c7d2d',
    ];

    private $appid = [
        'appid' => 'c80eea74e85b40d0af4437fa09d513be',
        'templateid' => '418908',
    ];

    public function __construct() {
        parent::__construct();
        $this->mobile = $this->filter(input('param.phone'));
    }
    //发送
    public function send() {
        if (empty($this->mobile)) {
            exit(json_encode(array('status' => false,'msg' => '手机号码不能为空')));
        }
//        if (preg_match("/^13[0-9]{1}[0-9]{8}$|15[0189]{1}[0-9]{8}$|189[0-9]{8}$/",$this->mobile)) {
//            exit(json_encode(array('status' => false,'msg' => '手机号码格式不正确')));
//        }
        if (Session::get('sms_mobile')) {
            if (strtotime($this->read_file($this->mobile)) > (time() - 60)) {
//                exit(json_encode(array('status' => false,'msg' => '操作太过频繁，一分钟之内只能获取一次。')));
            }
        }
        $data = $this->request->post();
        Session::set('sms_mobile', $this->mobile);
        $this->mobile_code = str_pad(mt_rand(0, 999999), 6, "0", STR_PAD_BOTH);
        Session::set('sms_mobile_code', $this->mobile_code);
        $ucpass = new Ucpaas($this->token);
        $status = $ucpass->SendSms($this->appid['appid'],$this->appid['templateid'],$this->mobile_code,$data['phone'],'');
        $status = json_decode($status, TRUE);
//        dump($status);
        exit(json_encode(array('code' => 0,'msg' => '开发中')));
        if($status['code'] == '000000'){
            exit(json_encode(array('code' => 0,'msg' => '发送成功')));
        }else{
            exit(json_encode(array('code' => 0,'msg' => '发送失败')));
        }

//        $message = sprintf("您好，您的验证码为%s【虚拟仿真】",$this->mobile_code);
//        $sms = new \EcsSms();
//        $sms_error = '';
//        $send_result = $sms->send($this->mobile, $message, $sms_error);
//        $this->write_file($this->mobile, date("Y-m-d H:i:s"));
//        dump($send_result);die;
//        if ($send_result) {
//            $result['status'] = true;
//            $result['code'] = 2;
//            $result['msg'] = $this->mobile_code;
//            die(json_encode($result));
//        } else {
//            //调试用
//            $r = array();
//            $r['mobile'] = $this->mobile;
//            $r['message'] = $message;
//            exit(json_encode(array('code' => 0,'msg' => '发送成功')));
//        }
    }

    //验证
    public function check() {
        if ($this->mobile != Session::get('sms_mobile') or $this->mobile_code != Session::get('sms_mobile_code')) {
            exit(json_encode(array('msg' => '手机验证码输入错误。')));
        } else {
            exit(json_encode(array('code' => '2')));
        }
    }

    private function write_file($file_name, $content) {
        $this->mkdirs(ROOT_PATH . 'data/smslog/' . date('Ymd'));
        $filename = ROOT_PATH . 'data/smslog/' . date('Ymd') . '/' . $file_name . '.log';
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

    private function read_file($file_name) {
        $content = '';
        $filename = ROOT_PATH . 'data/smslog/' . date('Ymd') . '/' . $file_name . '.log';
        if (function_exists('file_get_contents')) {
            @$content = file_get_contents($filename);
        } else {
            if (@$fp = fopen($filename, 'r')) {
                @$content = fread($fp, filesize($filename));
                @fclose($fp);
            }
        }
        $content = explode("\r\n", $content);
        return end($content);
    }
    /**
     * 数据过滤函数
     * @param string|array $data 待过滤的字符串或字符串数组
     * @param boolean $force 为true时忽略get_magic_quotes_gpc
     * @return mixed
     */
    private function filter($data, $force = false) {
        if (is_string($data)) {
            $data = trim(htmlspecialchars($data)); // 防止被挂马，跨站攻击
            if (($force == true) || (!get_magic_quotes_gpc())) {
                $data = addslashes($data); // 防止sql注入
            }
            return $data;
        } else if (is_array($data)) {
            foreach ($data as $key => $value) {
                $data[$key] = in($value, $force);
            }
            return $data;
        } else {
            return $data;
        }
    }

}