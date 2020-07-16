<?php
namespace app\index\controller;
use think\Response;
use think\Db;
use Ucpaas;

/**
 * 首页管理
 * Class Index
 * @package app\index\controller
 */
class Api extends Wx
{
    private $token = [
        'accountsid' => '3109422aeee78d7f5f219fdb3c9d7cab',
        'token' => '65ecf4196436032ccda850288b6c7d2d',
    ];

    private $appid = [
        'appid' => '65ecf4196436032ccda850288b6c7d2d',
        'templateid' => '418908',
    ];

    /**
     * 首页
     * @method：index
     *
     */
    public function send()
    {
        $data = $this->request->post();
        dump($data);die;
        $ucpass = new Ucpaas($this->token);
        $ucpass->SendSms($this->appid['appid'],$this->appid['templateid'],$data['content'],$data['phone'],'');
    }
    /**
     * 代办
     * @method：agency
     **/
    public function agency(){
        return $this->fetch();
    }
    /**
     * 统计
     * @method:statistics
     **/
    public function statistics(){
        return $this->fetch();
    }
}