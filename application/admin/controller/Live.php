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
        return $this->fetch('index');
    }//index 结束

    /*
     show_used_time()：在添加直播时，显示此教室已占用的时间段
    */
    
    public function show_used_time ()
    {
        $d = input();

        $data = Db::table('tp_subject')->where('status', 1)->where('start_time', '>', $d['t'])
                ->field('start_time, end_time')->select();

        if ($data)
        {
            $arr = [];
            foreach ($data as $v)
            {
                $t  = date('Y-m-d H:i', $v['start_time']);
                $t1 = date('H:i', $v['end_time']);
                $arr[] = $t . "~" . $t1;
            }

            return json(['code'=>200, 'data'=>$arr]);
        }else
        {
            return json(['code'=>100, 'data'=>'教室空闲']);
        }
        
    }//show_used_time 结束
}