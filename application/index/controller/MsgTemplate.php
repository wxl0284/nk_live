<?php
namespace app\index\controller;
use think\Response;
use think\Db;
header("Content-Type:text/html; charset=utf-8");
use app\common\model\MsgTemplate as MsgTemplateModel;
/**
 * 消息模板发送
 * Class MsgTemplate
 * @package app\index\controller
 */
class MsgTemplate extends Wx
{
    public function demo(){

        $other = [
            'number' => 'AAAA',
            'nickname' => '韩丙松',
            'link' => 'http://' . $_SERVER['HTTP_HOST'].'/index/purchase/detail/id/394'
        ];
        $msg_template = new MsgTemplateModel;
        $msg_template->sendTemMsg(1,'hanbingsong','已完成',$other);
    }
}
