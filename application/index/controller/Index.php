<?php
namespace app\index\controller;
use think\Response;
use think\Db;
use think\Session;

/**
 * 首页管理
 * Class Index
 * @package app\index\controller
 */
class Index extends Wx
{
    public function __construct()
    {
        parent::__construct();
        $info = Session::get('home_info');
        $this->assign('info', $info);
    }

	/**
	* 首页
	* @method：index
	*
	*/
    public function index()
    {
        $article_notify = Db::name("article")->where(['article_cat'=>1])->limit('0,4')->select();
        $article_news = Db::name("article")->where(['article_cat'=>2])->limit('0,4')->select();
        $this->assign("article_notify",$article_notify);
        $this->assign("article_news",$article_news);
        $equip_pic = Db::name("banner")->where(['type'=>1])->value("equip_pic");
        $this->assign("equip_pic",$equip_pic);

        //return \think\Response::create(\think\Url::build('/admin'), 'redirect');
        return $this->fetch();
    }

    public function article(){
        $get = $this->request->get();
        $where = [];
        $where['article_cat'] = ["=",$get['article_cat']];
        $article_notify = Db::name("article")->where($where)->order("create_time desc")->limit('0,2')->select();
        foreach($article_notify as $key => $val){
            $article_notify[$key]['create_time'] = date("Y-m-d",$val['create_time']);
        }
        return json(['code'=>200,'result'=>$article_notify]);
    }
    
    public function category(){
        $category = Db::name("category")->where(['parent_id'=>0])->select();
        foreach($category as $key => $val){
            $category[$key]['children'] = Db::name("category")->where(['parent_id'=>$val['id']])->select();
        }
        return json(['code'=>200,'result'=>$category]);
    }

    public function navigation(){
        $navigation = Db::name("navigation")->select();
        return json(['code'=>200,'result'=>$navigation]);
    }
}
