<?php
namespace app\admin\controller;
use think\Response;
use think\Db;
use think\Session;
use think\Controller;

/*
关于直播功能的控制器
*/
class Live extends Controller
{
    /*
    index() 根据用户端为手机、还是pc分别显示不同的页面
    
    
    public function index ()
    {
        create_qr_code();//调用app/common.php中二维码生成的函数
    }//index 结束*/
    
    /*
    index() 根据用户端为手机、还是pc分别显示不同的页面
    */
    
    public function index ()
    {
        echo '123';
    }//index 结束
}