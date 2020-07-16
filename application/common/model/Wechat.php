<?php
namespace app\common\model;

class Wechat
{
    private $access_token;
    private $openid;
    private $appid;
    private $appsecret;

    public function __construct()
    {
        $this->appid = APPID;
        $this->appsecret = APPSECRET;
    }

    /**
     * 获取用户openid和用户access_token
     */
    protected function getUserOpenidAndAccessToken()
    {
        $code = input('param.code');
        if (!$code) {
            $url = 'http://'.$_SERVER['SERVER_NAME'].$_SERVER["REQUEST_URI"];

            // 用header跳转
            $header = 'Location:https://open.weixin.qq.com/connect/oauth2/authorize?appid=' . $this->appid . '&redirect_uri=' . urlencode($url) . '&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';
            // $header = 'Location:https://open.weixin.qq.com/connect/oauth2/authorize?appid=' . $this->appid . '&redirect_uri=' . urlencode($url) . '&response_type=code&scope=snsapi_base&state=1#wechat_redirect';
            header($header);
            exit;
        } else {
            //使用code获取OpenID  
            $openid_url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' . $this->appid . '&secret=' . $this->appsecret . '&code=' . $code . '&grant_type=authorization_code';
            $openid_data = get_contents($openid_url);
            // dump($openid_data);die;
            $arr_openid = json_decode($openid_data, true);
            if (!$arr_openid['openid']) {
                header("Content-type:text/html;charset=utf-8");
                die('获取openid失败, 请稍后重试');
            }
            $this->openid = $arr_openid['openid'];
            $this->access_token = $arr_openid['access_token'];

            if ($this->openid) {
                return true;
            } else {
                return false;
            }
        }
    }

    /**
     * 得到微信用户信息
     */
    public function getWechatUserInfo()
    {
        if (($wechatUserInfo = session('wechatUserInfo')) && $wechatUserInfo['nickname'] && $wechatUserInfo['headimgurl'])  {
            return $wechatUserInfo;
        }

        $this->getUserOpenidAndAccessToken();

        $wechatUserInfo_json = get_contents('https://api.weixin.qq.com/sns/userinfo?access_token=' . $this->access_token . '&openid=' . $this->openid . '&lang=zh_CN');
        $wechatUserInfo_array = json_decode($wechatUserInfo_json, true);
        if ($wechatUserInfo_array['headimgurl'] == '') {
            $wechatUserInfo_array['headimgurl'] = '/static/index/images/wutouxiang.png';
        }
        if (!($wechatUserInfo_array['nickname'] && isset($wechatUserInfo_array['headimgurl']))) {
            header("Content-type:text/html;charset=utf-8");
            die('获取用户信息失败, 请稍后重试');
        }
        $wechatUserInfo = array(
            'nickname' => $wechatUserInfo_array['nickname'],
            'headimgurl' => $wechatUserInfo_array['headimgurl'],
            'openid' => $this->openid,
        );
        // $unionid = $wechatUserInfo_arr['unionid'] ? $wechatUserInfo_arr['unionid'] : false;
        session('wechatUserInfo', $wechatUserInfo);
        // session('unionid', $unionid);
        return $wechatUserInfo;
    }

    /**
     * 获取全局access_token
     */
    public function getWAccessToken()
    {
        $w_access_token = \think\Cache::get('w_access_token');
        if (empty($w_access_token)) {
            $url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' . $this->appid . '&secret=' . $this->appsecret;
            // $res = curlGet($url, [], 2);
            $res = get_contents($url, true);
            if ($res['access_token']) {
                \think\Cache::set('w_access_token', $res['access_token'], $res['expires_in']-200);
                $w_access_token = $res['access_token'];
            } else {
                return false;
            }
        }
        return $w_access_token;
    }

}