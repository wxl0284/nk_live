<?php
namespace app\index\controller;
use think\Response;
use think\Db;
use think\Session;
use think\Cookie;
/**
 * 用户模块控制器
 * Class Subject
 * @package app\index\controller
 */
class Common extends Wx
{
    public $user_id;

    public function __construct()
    {
        parent::__construct();
        $info = Session::get('home_info');
        $this->user_id = Session::get('home_user_id');
        if(empty($info) || empty($this->user_id)){
            return $this->redirect('login/index');
        }
        $info = Db::name("user")->where(['id'=>$this->user_id])->find();
        if($info['identity'] != '社会人士'){
            if($info['school']){
                $school_info = Db::name('school')->where(array('id' => $info['school']))->find();
                $info['school'] = $school_info['school_name'];
            }else{
                $info['school'] = '';
            }
        }else{
            if($info['position']){
                $school_info = Db::name('industry')->where(array('id' => $info['school']))->find();
                $info['position'] = $school_info['industry_name'];
            }else{
                $info['position'] = '';
            }
        }
        if($info['province']){
            $school_info = Db::name('region')->where(array('id' => $info['province']))->find();
            $info['province'] = $school_info['province'];
        }else{
            $info['province'] = '';
        }
        Session::set('home_info', $info);
        $this->assign('info', $info);
    }
}
