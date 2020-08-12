<?php
namespace app\index\controller;
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
    */
    
    /*public function index ()
    {
        $mobile = $this->request->isMobile();
        //halt($mobile);
        if ($mobile)
        {
            return view('mobile');
        }

        return view('mobile');
        //create_qr_code();//调用app/common.php中二维码生成的函数
    }//index 结束*/

    /*
    index() 显示直播列表页面
    */
    
    public function index ()
    {
        //$info = Session::get('real_name');
        //$this->assign('info', $info);

        //查出在当前时间 直播还未结束的直播
        $data = Db::table('tp_live')
            ->where('status', 1)
            ->where('end_time', '>', time()+30)//查询半分钟后就结束的直播
            ->field('live_name, live_brief, start_time, end_time, teacher, live_pic, live_qrcode')
            ->order('start_time', 'asc')
            ->paginate( 4 );

        $num = count($data);

        if ($num > 0)
        {
            $this->assign(['list' => $data, 'have_live' => 1]);
        }else{
            $this->assign(['have_live' => 0]);
        }

        return view('live');        
    }//index 结束
}