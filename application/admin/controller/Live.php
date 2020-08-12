<?php
namespace app\admin\controller;
use think\Response;
use think\Db;
use think\Session;
use think\Controller;
use think\exception\HttpException;

/*
关于直播功能的控制器
*/
class Live extends Controller
{
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
            ->where('L.status', 1)
            ->where($where)
            ->field('L.id, L.live_name, L.live_brief, L.start_time, L.end_time, L.teacher, L.status, L.live_pic, c.cat_name')
            ->order('id', 'desc')
            ->paginate( config('paginate.list_rows') );
            //->paginate(config('paginate.list_rows'), false, ['query' => $this->request->get()]);
        
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
      
            $err = $this->check_live_data($data); //验证表单数据

            if ( $err !== '' )
            {
                return ajax_return_adv_error($err);
            }

            $data['status'] = 1;//默认为发布状态
            $data['live_adder'] = session('auth_id');//直播添加者的admin_user表的id

            //生成直播的链接地址及二维码
            $domain = $this->request->domain(); //http://nk360_live.com
            //$live_time = str_replace(['-', ' ', ':'], '', $data['start_time']);//把 - 空格 ：都替换为空
            $live_time = strtotime( $data['start_time'] );//转为时间戳
            $dir = '/qrcode2/'; //二维码存放的目录，即网站根目录的qrcode2/中

            create_qr_code($domain, $dir, $live_time);//调用application/common.php中二维码生成的函数
            //生成直播的链接地址及二维码 结束

            $data['live_qrcode'] = $dir . $live_time . '.png';//将二维码图片地址存入tp_live表中
            $data['start_time'] = $live_time;
            $data['end_time'] = strtotime( $data['end_time'] );

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

    /*
    edit() :对直播信息进行编辑修改
    */

    public function edit()
    {
        //$d = input();    $data['live_adder'] = session('auth_id');//直播添加者的admin_user表的id
        //halt( $this->request->isAjax() );
        if ( $this->request->isAjax() )
        {
            $data = input();
            //halt($data);
            $err = $this->check_live_data($data); //验证表单数据

            if ( $err !== '' )
            {
                return ajax_return_adv_error($err);
            }

            //生成直播的链接地址及二维码
            $domain = $this->request->domain(); //http://nk360_live.com
            $live_time = strtotime( $data['start_time'] );//把 - 空格 ：都替换为空
            $dir = '/qrcode2/'; //二维码存放的目录，即网站根目录的qrcode2/中

            create_qr_code($domain, $dir, $live_time);//调用application/common.php中二维码生成的函数
            //生成直播的链接地址及二维码 结束

            $data['live_qrcode'] = $dir . $live_time . '.png';//将二维码图片地址存入tp_live表中
            $data['start_time'] = $live_time;
            $data['end_time'] = strtotime( $data['end_time'] );

            $r = Db::table('tp_live')->where('id', $data['id'])->update($data);

            if ($r)
            {
               return ajax_return_adv("编辑成功");
            }else{
               return ajax_return_adv_error('编辑失败');
            }

        }else{
            $id = $this->request->param('id');

            if ( !$id )
            {
                $this->error('缺少参数');
            }

            //$res = Db::table('tp_live')->where('id', $id)->find();
            $res = Db::table('tp_live')->alias('L')
                ->join('tp_category c','L.category = c.id')
                ->where('L.id', $id)
                ->field('L.id, L.live_name, L.live_brief, L.start_time, L.end_time, L.teacher, L.live_pic, L.category, c.cat_name')
                ->find();
         
            if (!$res)
            {
                $this->error('记录未查到');
            }

            $this->view->assign(["vo" => $res]);
            return $this->view->fetch();
        }
    }//edit 结束

    /*
     *check_live_data($data): 校验直播的提交的数据 
     $data:提交的数据
    */

    protected function check_live_data ($data)
    {
        $err_msg = '';//错误信息
        //halt($data);
        //验证数据
        if ( !( isset($data['category']) && preg_match('/^([0-9]){1,10}$/', $data['category']) ) )
        {
            //return ajax_return_adv_error("请选择专业分类！");
            $err_msg .= '请选择专业分类！';
        }

        if ( !( isset($data['live_name']) && preg_match('/^\S{1,90}$/', $data['live_name']) ) )
        {//直播名称
            //return ajax_return_adv_error("直播名称应为30汉字以内！");
            $err_msg .= '直播名称应为30汉字以内！';
        }

        if ( !( isset($data['teacher']) && preg_match('/^\S{1,21}$/', $data['teacher']) ) )
        {//直播老师姓名，不一定是
            //return ajax_return_adv_error("直播老师姓名应为7汉字以内！");
            $err_msg .= '直播老师姓名应为7汉字以内！';
        }

        $now = time();
        $t1 = strtotime($data['start_time']);
        $t2 = strtotime($data['end_time']);

        if ( !( isset($data['start_time']) && ( $t1 > $now ) ) )
        {//直播开始时间
            //return ajax_return_adv_error("直播开始时间有误");
            $err_msg .= '直播开始时间有误！';
        }

        if ( !( isset($data['end_time']) && ( $t2 > $now ) ) )
        {//直播结束时间
            //return ajax_return_adv_error("直播结束时间有误");
            $err_msg .= '直播结束时间有误！';
        }

        $data['start_time'] = $t1;// 开始的时间戳
        $data['end_time'] = $t2;//结束的时间戳

        if ( $data['end_time'] <= $data['start_time'] )
        {
            $err_msg .= '直播结束时间有误！';
        }

        $t = $data['end_time']-$data['start_time'];

        if ( $t > 0 && $t < 600 )//直播时长应大于10分钟
        {
            $err_msg .= '直播时长应大于10分钟！';                
        }

        if ( !( isset($data['live_pic']) && !empty($data['live_pic']) ) )//必须有封面图片
        {
            $err_msg .= '请上传直播封面图！';     
        }

        //查数据表里与当前提交的直播时间有可能冲突的直播(仅此一个直播教室)
        if ( $this->request->action() == 'edit' )
        {
            $live_all = Db::table('tp_live')->where('id', '<>', $data['id'])->field('start_time, end_time, live_name, id')->select();
        }elseif  ( $this->request->action() == 'add' )
        {
            $live_all = Db::table('tp_live')->field('start_time, end_time, live_name, id')->select();
        }        

        if ( $live_all )
        {
            //判断提交的时间段与表中的时间段是否有交集
            foreach ($live_all as $v)
            {
                $a = $data['start_time']  > $v['end_time'];//当前提交的时间与数据库时间段没有冲突
                $b = $data['end_time'] < $v['start_time'];//当前提交的时间与数据库时间段没有冲突

                $res = ( $a || $b );//无冲突
            
                if ( !$res )//有交叉冲突
                {
                    //return ajax_return_adv_error("直播时间有冲突, 请重新选择时间");
                    $err_msg .= '直播时间有冲突, 请重新选择时间！';
                    break;
                }
            }
            
            if ( $this->request->action() == 'add' )
            {//若为添加直播时
                foreach ($live_all as $v)//判断直播名称是否有重复的
                {
                    if ( $v['live_name'] == $data['live_name'] )
                    {
                        $err_msg .= '直播名称已存在！';
                        break;
                    }                
                }
            }else if ( $this->request->action() == 'edit' )
            {//若为编辑直播时 看其他直播记录中是否存在相同的直播名称
                foreach ($live_all as $v)
                {
                    if ( $v['live_name'] == $data['live_name'] && $v['live_name'] != $data['id'] )
                    {
                        $err_msg .= '直播名称重复了！';
                        break;
                    }                
                }
            }
            
        }
        //验证结束
        return $err_msg;
    }//check_live_data 结束

    /*
     *delete_forever() 彻底删除一条直播信息
    */

    public function delete_forever ()
    {
        if ( !session('auth_id') )
        {
            $this->error('请先登录~');
        }

        $d = input();

        $r = Db::table('tp_live')->where('id', $d['id'])->delete();

        if ($r)
        {
            return json(['code'=>200,'msg'=>'删除成功']);
        }else{
            return json(['code'=>100,'msg'=>'删除失败']);
        }
    }//delete_forever 结束

    /*
    watch_live() 观看直播，判断手机还是电脑来显示不同的页面
    /admin/live/watch_live/time/1597215600.html ,请求的url,
    手机扫二维码和电脑点击鼠标都是请求此地址，time参数是直播开始的时间戳
    */

    public function watch_live ()
    {
        $live_start_time = input('time'); //开始的时间戳

        if($this->request->isMobile())
        {
    
            return view('mobile');
        }else{
            return view('pc');
        }
    }//watch_live 结束
}