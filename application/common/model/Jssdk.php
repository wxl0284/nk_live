<?php
namespace app\common\model;

class Jssdk
{
  private $appId;
  private $appSecret;

  public function __construct()
  {
    $this->appId = APPID;
    $this->appSecret = APPSECRET;
  }

  public function getSignPackage()
  {
    $jsapiTicket = $this->getJsApiTicket();

    // 注意 URL 一定要动态获取，不能 hardcode.
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
    $url = "$protocol$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]";

    $timestamp = time();
    $nonceStr = $this->createNonceStr();

    // 这里参数的顺序要按照 key 值 ASCII 码升序排序
    $string = "jsapi_ticket=$jsapiTicket&noncestr=$nonceStr&timestamp=$timestamp&url=$url";

    $signature = sha1($string);

    $signPackage = array(
      "appId"     => $this->appId,
      "nonceStr"  => $nonceStr,
      "timestamp" => $timestamp,
      "url"       => $url,
      "signature" => $signature,
      "rawString" => $string
    );
    // dump($signPackage);
    return $signPackage;
  }

  private function createNonceStr($length = 16)
  {
    $chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    $str = "";
    for ($i = 0; $i < $length; $i++) {
      $str .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
    }
    return $str;
  }

  private function getJsApiTicket()
  {
    // jsapi_ticket 应该全局存储与更新，以下代码以写入到文件中做示例
    // $data = json_decode($this->get_php_file("jsapi_ticket.php"));
    $jsapi_ticket = \think\Cache::get('jsapi_ticket');
    if (empty($jsapi_ticket)) {
      $accessToken = model('Wechat')->getWAccessToken();
      // 如果是企业号用以下 URL 获取 ticket
      // $url = "https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token=$accessToken";
      //微信公众号
      $url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=$accessToken";
      $res = curlGet($url);
      // dump($res);die;
      $ticket = $res['ticket'];
      if ($ticket) {
        // $data->expire_time = time() + 7000;
        // $data->jsapi_ticket = $ticket;
        // $this->set_php_file("jsapi_ticket.php", json_encode($data));
        \think\Cache::set('jsapi_ticket', $ticket, 7000);
      }
    } else {
      $ticket = $jsapi_ticket;
    }

    return $ticket;
  }

  
  // private function httpGet($url)
  // {
  //   $curl = curl_init();
  //   curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
  //   curl_setopt($curl, CURLOPT_TIMEOUT, 500);
  //   // 为保证第三方服务器与微信服务器之间数据传输的安全性，所有微信接口采用https方式调用，必须使用下面2行代码打开ssl安全校验。
  //   // 如果在部署过程中代码在此处验证失败，请到 http://curl.haxx.se/ca/cacert.pem 下载新的证书判别文件。
  //   curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, true);
  //   curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 2);
  //   //curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, true);
  //   curl_setopt($curl, CURLOPT_URL, $url);

  //   $res = curl_exec($curl);
  //   curl_close($curl);

  //   return $res;
  // }

  public function getMenuShareAppMessage()
  {
    $jsapiTicket = $this->getJsApiTicket();

    // 注意 URL 一定要动态获取，不能 hardcode.
    $protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
    $url = "$protocol$_SERVER[HTTP_HOST]";

    $timestamp = time();
    $imgUrl = $url.'/static/index/images/jlhp_img.png';

    $Message = array(
      "title"     => '聚力和平',
      "desc"     => '美丽和平是我家  社会平安靠大家 ',
      "link"     => $url,
      "imgUrl"     => $imgUrl,
    );
    return $Message;
  }

}

