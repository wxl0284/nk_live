<?php
namespace app\index\controller;
use think\Db;
use think\Request;
use think\Session;
use think\Cookie;
use app\home\model\User as UserModel;
/**
 *
 * 企业微信常规类
 * Class Wx
 * @author：韩丙松 - 2019-4-24
 * @package app\admin\controller
 */
class Wx extends Controller
{
    const LCHINA = "China";
    const ENGLISH = "Expatriate";
    public $nationality;
    protected $wxcfg = NULL;
    protected $obj = NULL;
    protected $wechat_config = array();
    public function _initialize(){
        parent::_initialize();
    }
    public function __construct()
    {
        parent::__construct();
        
        
    }

    public function e($agent_id){
       // $agent_id = $this->request->get("agent_id");

        $this->wechat_config = DB::name("wxapp")->where(['agent_id'=>$agent_id])->find();
        foreach ($this->wechat_config as $key => &$val) {
            $val = trim($val);
        }
        $this->wxcfg = array(
            'token' => $this->wechat_config["token"], 
            'encodingaeskey' => $this->wechat_config["encodingaeskey"], 
            'appid' => $this->wechat_config["app_id"], 
            'appsecret' => $this->wechat_config["app_secret"], 
            'agentid' => $this->wechat_config["agent_id"], 
            'debug' => true, 
            'logcallback' => 'log'
        );
        //dump($this->wxcfg);
        Vendor('wechat.Qywechat');
        $this->obj = new \Qywechat($this->wxcfg);
        $this->obj->valid();
    }

    public function WxsendMessage($message){
        return $this->obj->sendMessage($message);
    }
    /**
    *@method：企业微信登陆 - 扫码
    *
    */
    public function WxloginSweepCode(){
        //超过7200秒 重新获取 
        if((time()-intVal(session::get('expires_time'))>10800) || !session::get('userid')) session::delete('access_token',NULL);
        //判断access_token 是否存在
        if (!session::get('access_token')) {
            //得到code
            if ($code = $this->request->get('code')) {
                //获得token
                $token = $this->weObj->gettoken(true);
                //json - 转数组
                $token = json_decode($token,true);
                if ($token['access_token']) {
                    //设置session - access_token
                    session::set('access_token',$token['access_token']);
                    //设置session - expires_time access_token 有效期
                    session::set('expires_time',time());
                    //获得用户信息
                    $res=$this->weObj->getUserId($code,0,true);
                    if(!isset($res['UserId'])){
                        var_dump($res);exit();
                    }
                    //通过userid 判断用户在数据库里存不存在
                    $wx_user_info = $this->weObj->getUserInfo($res['UserId'],true);
                    $user_model = new UserModel;
                    if(!$user_model->where(['userid' => $wx_user_info['userid']])->find()){
                        abort(404,'暂无权限');
                        exit;
                    };
                    if($user_model->where(['userid' => $wx_user_info['userid'],'is_login' => 0])->find()){
                         //进行更新用户信息
                        $dept_list = Cache::get('deptList');
                        $user_model->updateUser($wx_user_info,$dept_list);
                    }
                    //设置session UserId
                    session::set('userid',$wx_user_info['userid']);
                } else {
                    exit($token['errmsg']);
                }
            } else {
                //获得code
                $host = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
                $url = 'https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=' . $this->config['appid'] . '&agentid=' . $this->config['agentid'] . '&redirect_uri=' . urlencode($host) . '&state=' . time();
                echo '<script>location.href="' . $url . '"</script>';
            }
        }
    }
    /**
    *@method：WxloginNotSpecified - 企业微信用户登陆，不指定特定用户
    *
    ***/
    public function WxLoginNotSpecified(){
        $code = $this->request->get("code");
        if ($code) {
            $res = $this->obj->getUserId($code);
            _log('res：'.var_export($res, true));
            if (!$res || $res['errcode']) {
                if ($res['errcode'] == '40029') {
                    exit('40029');
                    return redirect('WxLoginNotSpecified');
                }
                exit("getUserId error:" . $res['errcode']);
            }
            if (!isset($res['UserId'])) {
                $res = $this->obj->openidToUserId($res['OpenId']);
                _log('res UserId:'.var_export($res, true));
                if ($res['errcode']) {
                    exit("openidToUserId error:" . $res['errcode']);
                }
                if (!$res['userid'] || !$res){
                    $error_img = $this->non_enterprise;
                    return $this->fetch('error/error',compact('error_img'));
                    //print_r($wechat);
                    exit();
                }
                if ($res['userid']){
                    $UserId = $res['userid'];
                }
            } else {
                $UserId = $res['UserId'];
            }
            $wechat = $this->obj->getUserInfo($UserId);
            _log("wechat:".var_export($wechat, true));
            if (!isset($wechat['userid'])) {
                //非企业员工
                //输出页面
                $error_img = $this->non_enterprise;
                return $this->fetch('error/error',compact('error_img'));
                //print_r($wechat);
                exit();
            }
            $user_model = new UserModel;
            $u = $user_model->UgetUserInfo(['userid' => $wechat['userid']]);
            if (!$u) {
                $user_model->UuserAdd($wechat,$this->wechat_config['wxapp_id']);
                doRequest('http://'.$_SERVER['HTTP_HOST'].'/'.Url('index/head_pic'),['userid'=>$wechat["userid"],'avatar'=>$wechat["avatar"]]);
                
            }
            session('userID', $wechat["userid"]);
            return redirect()->restore();
        }
        $url = $this->obj->getOauthRedirect('http://' . $_SERVER['HTTP_HOST']  . '/' . url('index/WxLoginNotSpecified'), 'STATE', 'snsapi_userinfo');
        header("Location: " . $url);
        exit();
    }
    public function qywechatJsSdk($agent_id){
        Vendor('wechat.Qywechat');
        $this->wechat_config = DB::name("wxapp")->where(['agent_id'=>$agent_id])->find();
        $this->wxcfg = array(
            'token' => $this->wechat_config["token"], 
            'encodingaeskey' => $this->wechat_config["encodingaeskey"], 
            'appid' => $this->wechat_config["app_id"], 
            'appsecret' => $this->wechat_config["app_secret"], 
            'agentid' => $this->wechat_config["agent_id"], 
            'debug' => true, 
            'logcallback' => 'log'
        );
        $this->obj = new \Qywechat($this->wxcfg);
        $url = 'http://' . $_SERVER['HTTP_HOST']  . $_SERVER['REQUEST_URI'];
        $getJsSign = $this->obj->getJsSign($url);
        return $getJsSign;
    }
    /**
    *@method：WxloginAppoint - 企业微信用户登陆，指定特定用户
    *
    ***/
    public function WxLoginAppoint($agent_id){
        Vendor('wechat.Qywechat');
        $this->wechat_config = DB::name("wxapp")->where(['agent_id'=>$agent_id])->find();
        $this->wxcfg = array(
            'token' => $this->wechat_config["token"], 
            'encodingaeskey' => $this->wechat_config["encodingaeskey"], 
            'appid' => $this->wechat_config["app_id"], 
            'appsecret' => $this->wechat_config["app_secret"], 
            'agentid' => $this->wechat_config["agent_id"], 
            'debug' => true, 
            'logcallback' => 'log'
        );
        $this->obj = new \Qywechat($this->wxcfg);

        $code = $this->request->get("code");
        if ($code) {
            $res = $this->obj->getUserId($code);
          
            if (!$res || $res['errcode']) {
                if ($res['errcode'] == '40029') {
                    return redirect('login');
                }
                exit("getUserId error:" . $res['errcode']);
            }
            if (!isset($res['UserId'])) {
                $res = $this->obj->openidToUserId($res['OpenId']);
                if ($res['errcode']) {
                    exit("openidToUserId error:" . $res['errcode']);
                }
                $UserId = $res['userid'];
            } else {
                $UserId = $res['UserId'];
            }
            $wechat = $this->obj->getUserInfo($UserId);

            session('userid', $wechat["userid"]);
            return redirect()->restore();
        }
        $url = $this->obj->getOauthRedirect('http://' . $_SERVER['HTTP_HOST']  . $_SERVER['REQUEST_URI'], 'STATE', 'snsapi_userinfo');
        header("Location: " . $url);
        exit();
    }
    /**
    * 启用JSDK
    * @method：enableJsdk
    **/
    public function enableJsdk(){
        $url = "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";
        $signPackage = $this->obj->getJsSign($url);
        $this->assign('signPackage', $signPackage);
    }
    /**
    * 启用ShareAppMessage
    * @method：enableShareAppMessage
    **/
    public function enableShareAppMessage($config,$userid = "",$lan = "ch"){
        $share_config = get_paper_con($config);
        $share_config = json_decode($share_config,true);
        $share_config = $share_config['share_config'][$lan];
        if($lan == self::LANG_CH){
            $share_config['title'] = base64_decode($share_config['title']);
            $share_config['desc'] = base64_decode($share_config['desc']);
        }
        $menuShareAppMessage = $this->obj->getShareAppMessage($share_config);
        $menuShareAppMessage['link'] = $menuShareAppMessage['link'] . '&u=' . $userid . '&time=' . time() . "&lan=" . $lan;
        $this->assign('menuShareAppMessage',$menuShareAppMessage);
    }

    /**
     * @param string   $describe 描述
     */
    public function log($describe){
        $info = Session::get('home_info');
        Db::name('home_log')->insert(array('admin' => $info['name'], 'admin_id' => Session::get('home_user_id'), 'describe' => $describe, 'ip' => $this->request->ip(), 'time' => date('Y-m-d H:i:s', time())));
    }
    
}