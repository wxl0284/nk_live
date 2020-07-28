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
    index() 显示直播列表页面
    */
    
    public function index ()
    {
        //根据当前用户进行查询 若为超级管理员 则显示全部，否则只显示他自己添加的直播
        $admin_user_id = session('auth_id');
        
        $where = []; //查询条件

        if ( $admin_user_id > 1 )
        {
            $where = [ 'live_adder' => $admin_user_id, 'L.status' => 1 ];
        }else if ( $admin_user_id > 1 )
        {//等于1为超级管理员
            $where = [ 'L.status' => 1 ];
        }


        $data = Db::table('tp_live')->alias('L')
            ->join('tp_category c','L.category = c.id')
            //->where('L.status', 1)
            ->where($where)
            ->field('L.id, L.live_name, L.live_brief, L.start_time, L.end_time, L.teacher, L.status, c.cat_name')
            ->order('id', 'desc')
            ->paginate( config('paginate.list_rows') );
            //->paginate(config('paginate.list_rows'), false, ['query' => $this->request->get()]);
            //->paginate( 1 );
        
        $this->assign([
            'list'  => $data,
            'count' => count($data),
            ]);

        return $this->fetch('index');
    }//index 结束

    /*
     show_used_time()：在添加直播时，显示此教室已占用的时间段
    */
    
    public function show_used_time ()
    {
        $d = input();

        $data = Db::table('tp_live')->where('status', 1)->where('end_time', '>', $d['t'])
                ->field('start_time, end_time')->order('id','asc')->select();

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

    /*
     add() 显示添加直播的页面 若为ajax则执行数据添加
    */
    
    public function add ()
    {
        if ( $this->request->isAjax() )//接收直播的提交数据 执行添加
        {
            $data = input();
            //halt($d);

            //验证数据
            if ( !( isset($data['category']) && preg_match('/^([0-9]){1,10}$/', $data['category']) ) )
            {
                return ajax_return_adv_error("请选择专业分类！");
            }

            if ( !( isset($data['live_name']) && preg_match('/^\S{1,90}$/', $data['live_name']) ) )
            {//直播名称
                return ajax_return_adv_error("直播名称应为30汉字以内！");
            }

            if ( !( isset($data['teacher']) && preg_match('/^\S{1,21}$/', $data['teacher']) ) )
            {//直播老师姓名，不一定是
                return ajax_return_adv_error("直播老师姓名应为7汉字以内！");
            }

            $now = time();

            if ( !( isset($data['start_time']) && ( strtotime($data['start_time']) > $now ) ) )
            {//直播开始时间
                return ajax_return_adv_error("直播开始时间有误");
            }

            if ( !( isset($data['end_time']) && ( strtotime($data['end_time']) > $now ) ) )
            {//直播结束时间
                return ajax_return_adv_error("直播结束时间有误");
            }

            $data['start_time'] = strtotime($data['start_time']);// 开始的时间戳
            $data['end_time'] = strtotime($data['end_time']);//结束的时间戳

            $err_msg = '';

            if ( $data['end_time'] <= $data['start_time'] )
            {
                $err_msg .= '直播结束时间有误';
            }

            if ( ($data['end_time']-$data['start_time']) < 600 )//直播时长应大于10分钟
            {
                if($err_msg)
                {
                    $err_msg .= ',直播时长应大于10分钟';
                }else{
                    $err_msg .= '直播时长应大于10分钟';
                }              
            }

            if ( !( isset($data['live_pic']) && !empty($data['live_pic']) ) )//必须有封面图片
            {
                if($err_msg)
                {
                    $err_msg .= ',请上传直播封面图';
                }else{
                    $err_msg .= '请上传直播封面图';
                }              
            }

            if ( $err_msg !== '' )
            {
                return ajax_return_adv_error($err_msg);
            }

            //查数据表里与当前提交的直播时间有可能冲突的直播(仅此一个直播教室)
            $live_all = Db::table('tp_live')->field('start_time, end_time')->select();
            
            if ( $live_all )
            {
                //判断提交的时间段与表中的时间段是否有交集
                foreach ($live_all as $v)
                {
                    $a = $data['start_time']  > $v['end_time'];//当前提交的时间与数据库时间段没有冲突
                    $b = $data['end_time'] < $v['start_time'];//当前提交的时间与数据库时间段没有冲突

                    if ( !($a || $b) )
                    {
                        return ajax_return_adv_error("直播时间有冲突, 请重新选择时间");
                    }
                }
            }
            //验证结束

            $data['status'] = 1;//默认为发布状态
            //写入数据库
            $r = Db::table('tp_live')->insert($data);

            if ($r)
            {
               return ajax_return_adv("添加直播ok");
            }else{
               return ajax_return_adv_error("添加直播失败, 请再次提交");
            }

        }else{//显示添加直播页面
            return $this->fetch('add');
        }

        
    }//add 结束
}