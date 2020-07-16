<?php

namespace app\task\controller;

use app\task\model\Order as OrderModel;
use app\common\library\wechat\WxPay;
use think\Request;
use think\Db;
/**
 * 支付成功异步通知接口
 * Class Notify
 * @package app\api\controller
 */
class Notify
{
    public function test(){
        $OrdersModel = new OrderModel();
        $OrdersModel->updatePayStatus(7,"o-tzp5qBTzTVzSx2ZcEH7EFZ4zhc","2019");
       
    }
    /**
     * 支付成功异步通知
     * @throws \think\Exception
     * @throws \think\exception\DbException
     */
    public function order()
    {
        $WxPay = new WxPay([]);
        
        $WxPay->notify(new OrderModel);
    }

    public function orders(){
        $order = new OrderModel();
        $o = $order->aa();
    }

    /**
     * 
     * @return mixed
     * @throws \think\exception\DbException
     */
    public function index()
    {
        $data['add_time'] = time();
        $order = DB::name("atest")->order("add_time desc")->value("order");
        $data['order'] = $order + 1;
        DB::name("atest")->insert($data); 
    }



}
