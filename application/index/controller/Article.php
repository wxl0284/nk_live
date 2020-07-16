<?php
namespace app\index\controller;
use think\Response;
use think\Db;
use think\Session;
/**
 * 设备台账管理
 * Class Subject
 * @package app\index\controller
 */
class Article extends Wx
{
    public function __construct()
    {
        parent::__construct();
        $info = Session::get('home_info');
        $this->assign('info', $info);
    }

    

    public function index(){
        $article_cat = $this->request->get("article_cat") ? $this->request->get("article_cat") : 0;
        $this->assign("article_cat",$article_cat);
        return $this->fetch();
    }

    public function article_list(){
        $get = $this->request->get();
        $where = [];
        if($get['title']){
            $where['title'] = ["like",'%'.$get['title'].'%'];
        }
        $where['article_cat'] = ["=",$get['article_cat']];
        $article = Db::name("article")->where($where)->limit($get['start'],$get['limit'])->order("create_time desc")->select();
        foreach($article as $key => $val){
            $article[$key]['create_time'] = date("Y-m-d",$val['create_time']);
        }
        $total = Db::name("article")->where($where)->count();
        $result['data'] = $article;
        $result['meta'] = array(
            "total" => $total,
            "size" => count($article),
            "start" => $get['start']
        );
        return json(['code'=>200,'result'=>$result]);
    }

    public function detail(){
        return $this->fetch();
    }

    public function detail_up(){
        $get = $this->request->get();
        $article = Db::name("article")->where(['id'=>$get['id']])->find();
        $article['create_time'] = date("Y-m-d",$article['create_time']);
        if($article['type'] == 1){
            $article['types'] = '转载';
        }else{
            $article['types'] = '原创';
        }
        $article['content'] = htmlspecialchars_decode($article['content']);
        return json(['code'=>200,'result'=>$article]);

    }
    
    //项目介绍
    public function intro(){
        $equip_pic = Db::name("banner")->where(['type'=>3])->value("equip_pic");
        $this->assign("equip_pic",$equip_pic);
        $banner = Db::name("banner")->where(['type'=>5])->field("equip_pic")->select();
        $this->assign("banner",$banner);
        $video = Db::name("banner")->where(['type'=>7])->field("equip_pic,equip_video")->find();
        $this->assign("video",$video);
        return $this->fetch();
    }
    
    //关于我们
    public function about(){
        $equip_pic = Db::name("banner")->where(['type'=>4])->value("equip_pic");
		//halt($equip_pic);
        $this->assign("equip_pic",$equip_pic);
        $banner = Db::name("banner")->where(['type'=>6])->field("equip_pic")->select();
        $this->assign("banner",$banner);
        return $this->fetch();
    }
}
