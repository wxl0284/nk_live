<?php
namespace app\index\controller;
use think\Response;
use think\Db;
use think\Session;
use think\Cookie;
use think\Config;
use app\common\model\Redis;
use country_api\sdk\IlabJwt; //引入处理token的文件
/**
 * 设备台账管理
 * Class Subject
 * @package app\index\controller
 */
class Subject extends Wx
{
    public function __construct()
    {
        parent::__construct();
        $info = Session::get('home_info');
        $this->assign('info', $info);
    }

    public function index(){
    	
    	$where = [];
    	//项目列表
        $subject = Db::name("subject")->where($where)->select();
        $this->assign("subject",$subject);
        //专业大类,
        $category = Db::name("category")->where(['parent_id'=>0])->select();
        foreach($category as $key => $val){
        	$category[$key]['catgory_two'] = Db::name("category")->where(['parent_id'=>$val['id']])->select();
        }
        $this->assign("category",json_encode($category));
        $award = Db::name("award_win")->where(['type'=>1])->select();
        $declare = Db::name("award_win")->where(['type'=>2])->select();
        $this->assign("award",json_encode($award));
        $this->assign("declare",json_encode($declare));
        $equip_pic = Db::name("banner")->where(['type'=>2])->value("equip_pic");
        $this->assign("equip_pic",$equip_pic);

        return $this->fetch();
    }

    public function categorys(){
    	$get = $this->request->get();
    	$category = Db::name("category")->where(['id'=>$get['id']])->find();
    	
    	return json(['code'=>200,'result'=>$category]);
    }
    //专业大类
    public function category(){
    	if($this->request->isAjax()){
    		$category = Db::name("category")->where(['parent_id'=>0])->select();
    		foreach($category as $key => $val){
    			$cat_id = $this->have_child_cate($val['id']);
                $cat_id = substr($cat_id,0,-1);
                $where = [];
                $where['status'] = ["=",1];
                if($cat_id){
                	$where['cat_id'] = ["in",$cat_id];
                }else{
                	$where['cat_id'] = ["=",$val['id']];
                }
    			$category[$key]['projectNum'] = Db::name("subject")->where($where)->count();
    		}
    		$total = Db::name("category")->where(['parent_id'=>0])->count();
    		$result['data'] = $category;
    		$result['meta'] = array(
    			"total" => $total,
    			"size" => $total,
    			"start" => 1
    		);
    		return json(['code'=>200,'result'=>$result]);
    	}
    }

    



    //专业分类
    public function category_onchoice(){
    	if($this->request->isAjax()){
    		$date = $this->request->post();
    		$category = Db::name("category")->where(['parent_id'=>$date['parentId']])->select();
    		foreach($category as $key => $val){
    			$category[$key]['projectNum'] = Db::name("subject")->where(['cat_id'=>$val['id']])->count();
    		}
    		$total = Db::name("category")->where(['parent_id'=>$date['parentId']])->count();
    		$result['data'] = $category;
    		$result['meta'] = array(
    			"total" => $total,
    			"size" => $total,
    			"start" => 1
    		);
    		return json(['code'=>200,'result'=>$result]);
    	}
    }

    public function subject_list(){
    	$get = $this->request->get();
       
    	$where = "status=1";
    	//专业大类，专业分类
    	if($get['specialtySubject2']){
            $where .= " AND ss.cat_id = '".$get['specialtySubject2']."'";
    	}else{
    		if($get['specialtySubject'] <> 0){
    			$category = Db::name("category")->where(['parent_id'=>$get['specialtySubject']])->select();
    			if($category){
	    			$cat_id = [];
	    			foreach($category as $key => $val){
		    			$cat_id[] = $val['id'];
		    		}
                    $cats_id = implode(",",$cat_id);
                    $where .= " AND ss.cat_id in ($cats_id)";
	    		}else{
                    $where .= " AND ss.cat_id = '".$get['specialtySubject']."'";
	    		}
    		}
    		
    	}
    	//项目级别
        $wherel = "";
        if($get['queryProLevel']){
            $wherel = " AND ss.subject_level = '".$get['queryProLevel']."'";
        }else{
            $wherel = " AND (ss.subject_level = 1 OR ss.subject_level = 2)";
        }
        //获奖年份
        if($get['prizeYear']){
            $where .= " AND ss.award_year = '".$get['prizeYear']."'";
        }
        //申报年份
        if($get['declareYear']){
            $where .= " AND ss.declare_year = '".$get['declareYear']."'";
        }
        //搜索
         //项目名称
        if($get['title']){
            $title = $get['title'];
            $where .= " AND ss.subject_name like '%{$title}%'";
        } 
      
        //学校名称
        if($get['schoolTitle']){
            $schoolTitle = $get['schoolTitle'];
            $where .= " AND ss.school_name like '%{$schoolTitle}%'";
        }
        //负责人姓名
        if($get['incharge']){
            $incharge = $get['incharge'];
            $where .= " AND ss.person_charge like '%{$incharge}%'";
        }

        if($get['reverse'] == 'true'){
            $order = 'asc';
        }else{
            $order = 'desc';
        }


        //排序
        //最新
        if($get['sortby'] == 'pubSeq' || $get['sortby'] == 'proLevel'){
            
            $sql = "select ss.* from tp_subject ss where $where $wherel order by ss.create_time ".$order." limit ".$get['start'].",".$get['limit'];
        }

    
        //评分
        if($get['sortby'] == 'intScore'){
            $sql = "select * from (select s.*, COALESCE(o.cnt,0) o_cnt from tp_subject s left join (select count(id) as cnt,subject_id from tp_subject_score group by subject_id) o on s.id = o.subject_id) ss where $where $wherel order by o_cnt ".$order.",id asc limit ".$get['start'].",".$get['limit'];
            // $sql = "select ss.* from (select s.*, COALESCE(o.cnt,0) o_cnt from tp_subject s left join (select count(id) as cnt,subject_id from tp_subject_score group by subject_id) o on s.id = o.subject_id) ss where $where order by ss.o_cnt ".$order.",ss.id asc limit ".$get['start'].",".$get['limit'];

        }
        //收藏
        if($get['sortby'] == 'collectionCount'){
            $sql = "select * from (select s.*, COALESCE(c.cnt,0) c_cnt from tp_subject s left join (select count(id) as cnt,subject_id from tp_subject_collect group by subject_id) c on s.id = c.subject_id) ss where $where $wherel order by c_cnt ".$order.",id asc limit ".$get['start'].",".$get['limit'];

        }
        //点赞
        if($get['sortby'] == 'upCount'){
            $sql = "select * from (select s.*, COALESCE(l.cnt,0) l_cnt from tp_subject s left join (select count(id) as cnt,subject_id from tp_subject_like group by subject_id) l on s.id = l.subject_id) ss where $where $wherel order by l_cnt ".$order.",id asc limit ".$get['start'].",".$get['limit']; 
        }
        // echo("<pre>");
        // print_r($sql);
        
        $subject = Db::query($sql);
        // echo("<pre>");
        // print_r($subject);
        // exit;

         
      
    	//项目列表
       
       // $subject = Db::name("subject")->where($where)->limit($get[''],$get['limit'])->select();
       
        foreach($subject as $key => $val){
            $subject_score = Db::name("subject_score")->where(['subject_id'=>$val['id']])->select();
            $score_total = Db::name("subject_score")->where(['subject_id'=>$val['id']])->count();
            $score = 0; 
            if($subject_score){
                foreach($subject_score as $kk => $vv){
                    $score += $vv['score'];
                }
                $subject[$key]['score'] = round($score/$score_total,1);
            }else{
                $subject[$key]['score'] = 0;
            }
          
        }
    
        $total = Db::query("select COUNT(*) as count from tp_subject ss where $where");

        $identify_project = Db::query("select COUNT(*) as identify_project from tp_subject ss where $where"." AND ss.subject_level = 1");
        $other_project = Db::query("select COUNT(*) as other_project from tp_subject ss where $where"." AND ss.subject_level = 2");
        $result['data'] = $subject;
        $result['meta'] = array(
			"total" => $total[0]['count'],
			"size" => count($subject),
			"start" => 1,
			"identify_project" => $identify_project[0]['identify_project'],
			"other_project" => $other_project[0]['other_project']
		);
        return json(['code'=>200,'result'=>$result]);

    }

    public function aa(){
        $where = "1=1";
        $sql = "select COUNT(*) as a from tp_subject ss where $where";
        $aa = Db::query($sql);
        echo("<pre>");
        print_r($aa);

    }

    private function have_child_cate($cid)
    {
        $cate = Db::name("category")->where("parent_id='{$cid}'")->select();
        $cates = "";
        foreach ($cate as $key => $val) {
            $ca = $this->have_child_cate($val['id']);
            $cates .= $val['id']. "," . $ca;
        }
        return $cates;
    }

    public function detail(){
        $id = $this->request->get("id");

        //检查用户是否从国家平台登录后过来的
        $url = $this->request->url(true);
        //$url = "http://ilab.com/index/subject/detail?id=30&isView=true?token=AAABcsqOFzkBAAAAAAABkFI=.bqgvrZHv515fgUECBKFE6dTYdpMkq5vSPH+vmC3galrVmUvNNQ64ryfkrGQOcbcjWhs1xJhS5CamhvT6oK1Eqmmhf4RpOD5UnsFnGrpXiP4yYnvKCN4RBPIobqIHrC05dEo067B9IfKTYV0URElvKwMvC1eXLNRoyhrwTTkzdfHXvNLm21ChJJz2y7o0Fsq0IHMgryUfdY7f2l8m12yJWH61COm7IKMM3vW1zUokQaUe1NGF1YQWmauJizCvymOx0naN285RkLv243qXtbivwjcC2ErtROnea8EUYx3A8vfzxSQrEQyzzENo1Hnxx0U1YCbZ/QzGacMcLj8fewfpCg==.XHzPerCA47QDfHKjyEJ9KFZUDPfa8gvbcOEhjcxqzjA=";

        $r = $this->user_from_country($url, $id);

        if ( $r !== false )
        {//用户是从国家平台登录且token验证ok 数据入库ok
            session::set('home_user_id', $r['home_user_id']);

            cookie('user_type',  $r['home_user_type']);  
            cookie('experiment_id', $r['experiment_id']);     
        }
        //检查用户是否从国家平台登录后过来的 结束

        $data = array(
            "subject_id" => $id,
            "create_time" => time()
        );
        Db::name("subject_browse")->insert($data);
        return $this->fetch();
    }

    /*
     user_from_country() 检查url中是否带有国家平台的token
     参数：$url为请求的url，$id为当前实验项目在tp_subject表中的主键id
     $url:请求的url
     返回值 $return
    */

    protected function user_from_country ($url, $id)
    {
        //获取此国家平台分配给此实验key、名称等
        $subject = Db::table('tp_subject')->where('id', $id)->field('issuerId, projectTitle, secretKey, aesKey')->find();

        // 向ilabjwt类中的issuerId、secretKey、aesKey赋值 如下4个值都是国家空间分配给各实验的
        IlabJwt::$issuerId  = $subject['issuerId'];
        IlabJwt::$appName   = $subject['projectTitle'];
        IlabJwt::$secretKey = $subject['secretKey'];
        IlabJwt::$aesKey    = $subject['aesKey'];

        $return = array();//返回值

        //解析并验证url中的token
        $p = strpos($url, 'token=');

        if ( $p === false )
        {
           return $return = false;
        }

        $token = substr ($url, $p+6);

        $token = str_replace(' ', '+', urldecode($token));
       
        $token = IlabJwt::getBody($token);

        if ( $token !== null )//token验证ok
        {
            //将此用户数据插入到tp_user表，并设置session
            $user = Db::table('tp_user')->where('country_id', $token['id'])->find();

            if ( $user )
            {
                session::set('home_info', $user);//原有的登录功能 有此session
                $return['home_user_id'] = $user['id'];
                $return['home_user_type'] = $user['user_type'];
                $return['experiment_id'] = $id;

            }else{//表里无此用户
                $data['country_id'] = $token['id']; //国家平台用户id
                $data['country_un'] = $token['un']; //国家平台用户账号
                $data['user_name']  = $token['dis']; //国家平台用户姓名
                $data['user_type']  = 1;//国家平台登录用户类型

                $data['name']     = $token['dis']; //name字段 必填
                $data['password'] = '123456'; //password字段必填
                $data['phone'] = '18845623568'; //phone字段必填

                $res = Db::table('tp_user')->insertGetId($data);

                if ( $res )
                {
                    $info = Db::table('tp_user')->where('id', $res)->find();
                    session::set('home_info', $info);//原有的登录功能 有此session
                    $return['home_user_id'] = $res;
                    $return['home_user_type'] = 1;
                    $return['experiment_id'] = $id;
                }
            }

        }else{//token 验证失败
            $return = false;
        }

        return $return;
    }//user_from_country () 结束

    public function detail_up(){
        $date = $this->request->get();
        $data = array();
         
        $subject = Db::name("subject")->where(['id'=>$date['id']])->find();

        $subject['teach_reseatch'] = htmlspecialchars_decode($subject['teach_reseatch']);
        $subject['academic_research'] = htmlspecialchars_decode($subject['academic_research']);

        $subject['desc_purpose'] = htmlspecialchars_decode($subject['desc_purpose']);
        $subject['desc_principle'] = htmlspecialchars_decode($subject['desc_principle']);
        $subject['desc_experiment'] = htmlspecialchars_decode($subject['desc_experiment']);
        $subject['desc_material'] = htmlspecialchars_decode($subject['desc_material']);
        $subject['desc_method_step'] = htmlspecialchars_decode($subject['desc_method_step']);
        $subject['desc_result'] = htmlspecialchars_decode($subject['desc_result']);
        $subject['desc_assessment'] = htmlspecialchars_decode($subject['desc_assessment']);
        $subject['desc_face_student'] = htmlspecialchars_decode($subject['desc_face_student']);
        $subject['desc_project_orientie'] = htmlspecialchars_decode($subject['desc_project_orientie']);

        $subject['net_require'] = htmlspecialchars_decode($subject['net_require']);
        $subject['net_system_require'] = htmlspecialchars_decode($subject['net_system_require']);
        $subject['net_non_operate'] = htmlspecialchars_decode($subject['net_non_operate']);
        $subject['net_user_hardware'] = htmlspecialchars_decode($subject['net_user_hardware']);
        $subject['net_special_hardware'] = htmlspecialchars_decode($subject['net_special_hardware']);

        $subject['skill_explain'] = htmlspecialchars_decode($subject['skill_explain']);
        $subject['skill_teach_project'] = htmlspecialchars_decode($subject['skill_teach_project']);
        $subject['skill_simp'] = htmlspecialchars_decode($subject['skill_simp']);
        $subject['project_features'] = htmlspecialchars_decode($subject['project_features']);
        $subject['service_plan'] = htmlspecialchars_decode($subject['service_plan']);

        $subject['subject_report'] = htmlspecialchars_decode($subject['subject_report']);
        
        $category = Db::name("category")->where(['id'=>$subject['cat_id']])->field("parent_id,cat_name")->find();
        $subject['cat_name'] = $category['cat_name'];
        $subject['cat_name1'] = Db::name("category")->where(['id'=>$category['parent_id']])->value("cat_name");
        //团队主要成员
        $subject['team_major'] = Db::name("team_major")->where(['type'=>2,'subject_id'=>$date['id']])->select();
        //团队其它成员
        $subject['team_other'] = Db::name("team_major")->where(['type'=>1,'subject_id'=>$date['id']])->select();
        $subject['team_total'] = Db::name("team_major")->where(['subject_id'=>$date['id']])->count();
        $subject['collect'] = Db::name("subject_collect")->where(['subject_id'=>$date['id'],'is_delete'=>0])->count();
        $subject['like'] = Db::name("subject_like")->where(['subject_id'=>$date['id']])->count();
        $subject['browse'] = Db::name("subject_browse")->where(['subject_id'=>$date['id']])->count();
        $subject['evaluate'] = Db::name("subject_evaluate")->where(['subject_id'=>$date['id']])->count();
        $subject['scoreCount'] = Db::name("subject_score")->where(['subject_id'=>$date['id']])->count();
        //团队总成员数
        $subject['total_team'] = Db::name("team_major")->where(['subject_id'=>$date['id']])->count();
        //团队高校人员数
        $subject['personnel1'] = Db::name("team_major")->where(['personnel'=>1,'subject_id'=>$date['id']])->count();
        //团队企业人员数
        $subject['personnel2'] = Db::name("team_major")->where(['personnel'=>2,'subject_id'=>$date['id']])->count();

        $subject['collect_s'] = Db::name("subject_collect")->where(['subject_id'=>$date['id'],'is_delete'=>0,'user_id'=>session::get('home_user_id')])->count();
        $subject['like_s'] = Db::name("subject_like")->where(['subject_id'=>$date['id'],'user_id'=>session::get('home_user_id')])->count();
        //$subject['score'] = Db::name("subject_score")->where(['subject_id'=>$date['id'],'user_id'=>session::get("user_id")])->value("score");

        $subject_score = Db::name("subject_score")->where(['subject_id'=>$date['id']])->select();
        $score_total = Db::name("subject_score")->where(['subject_id'=>$date['id']])->count();
        $score = 0; 
        if($subject_score){
            foreach($subject_score as $kk => $vv){
                $score += $vv['score'];
            }
            $subject['score'] = round($score/$score_total,1);
        }else{
            $subject['score'] = 0;
        }

        if($subject['sex'] == 1){
            $subject['gender'] = '男';
        }else{
            $subject['gender'] = '女';
        }
        return json(['code'=>200,'result'=>$subject]);
    }

    public function team_major(){
        $get = $this->request->get();
        $team_major = Db::name("team_major")->where(['type'=>2,'subject_id'=>$get['id']])->limit($get['start'],$get['limit'])->select();
        $total = Db::name("team_major")->where(['type'=>2,'subject_id'=>$get['id']])->count();
        $result['data'] = $team_major;
        $result['meta'] = array(
            "total" => $total,
            "size" => count($team_major),
            "start" => $get['start']
        );
        return json(['code'=>200,'result'=>$result]);
    }

    public function team_other(){
        $get = $this->request->get();
        $team_other = Db::name("team_major")->where(['type'=>1,'subject_id'=>$get['id']])->limit($get['start'],$get['limit'])->select();
        $total = Db::name("team_major")->where(['type'=>1,'subject_id'=>$get['id']])->count();
        $result['data'] = $team_other;
        $result['meta'] = array(
            "total" => $total,
            "size" => count($team_other),
            "start" => $get['start']
        );
        return json(['code'=>200,'result'=>$result]);
    }
    //检测是否收藏
    public function is_collection(){
        $get = $this->request->get();
        $subject_collect = Db::name("subject_collect")->where(['subject_id'=>$get['id'],'user_id'=>session::get('home_user_id')])->find();
        if($subject_collect){
            return json(['code'=>200,'msg'=>"已收藏！"]);
        }else{
            return json(['code'=>100,'msg'=>"未收藏！"]);
        }
    }
    //收藏
    public function collection_add(){
        $date = $this->request->post();
        if(!session::get('home_user_id')){
            return json(['code'=>100,'msg'=>"您还未登陆"]);
        }
        $subject_collect = Db::name("subject_collect")->where(['subject_id'=>$date['id'],'user_id'=>session::get('home_user_id')])->find();
        if($subject_collect){
            
            if($subject_collect['is_delete'] == 0){
                $data = array(
                    "is_delete" => 1,
                    "delete_time" => time()
                );
                Db::name("subject_collect")->where(['subject_id'=>$date['id'],'user_id'=>session::get('home_user_id')])->update($data);
                $this->log('【取消收藏！】');
                return json(['code'=>201,'msg'=>"取消收藏！"]);
            }
            if($subject_collect['is_delete'] == 1){
                $data = array(
                    "is_delete" => 0,
                    "delete_time" => time()
                );
                Db::name("subject_collect")->where(['subject_id'=>$date['id'],'user_id'=>session::get('home_user_id')])->update($data);
                $this->log('【收藏】');
                return json(['code'=>201,'msg'=>"收藏成功！"]);
            }
            
        }else{
            $data = array(
                "subject_id" => $date['id'],
                "user_id" => session::get('home_user_id'),
                "create_time" => time()
            );
            Db::name("subject_collect")->insert($data);
            $this->log('【收藏】');
            return json(['code'=>200,'msg'=>"收藏成功！"]);
        }
    }

    //点赞
    public function like_add(){
        $date = $this->request->post();
        if(!session::get('home_user_id')){
            return json(['code'=>100,'msg'=>"您还未登陆"]);
        }
        $subject_like = Db::name("subject_like")->where(['subject_id'=>$date['id'],'user_id'=>session::get('home_user_id')])->find();
        if($subject_like){
            return json(['code'=>201,'msg'=>"您已经点赞！"]);
        }else{
            $data = array(
                "subject_id" => $date['id'],
                "user_id" => session::get('home_user_id'),
                "create_time" => time()
            );
            Db::name("subject_like")->insert($data);
            $this->log('【点赞】');
            return json(['code'=>200,'msg'=>"点赞成功！"]);
        }
    }

    //评价
    public function evaluate_add(){
        $date = $this->request->post();
        if(!session::get('home_user_id')){
            return json(['code'=>100,'msg'=>"您还未登陆"]);
        }
        if(!$date['comment']){
            return json(['code'=>100,'msg'=>"请填写评论内容！"]);
        }
        //$subject_evaluate = Db::name("subject_evaluate")->where(['subject_id'=>$date['id'],'user_id'=>session::get('home_user_id')])->find();
        // if($subject_evaluate){
        //     return json(['code'=>201,'msg'=>"您已经评价！"]);
        // }else{
        $data = array(
            "subject_id" => $date['id'],
            "user_id" => session::get('home_user_id'),
            "content" => $date['comment'],
            "create_time" => time()
        );
        Db::name("subject_evaluate")->insert($data);
        $this->log('【评价】');
        return json(['code'=>200,'msg'=>"评价成功！"]);
        //}
       
    }
    //评价
    public function evaluate(){
        $get = $this->request->get();
        $subject_evaluate = Db::name("subject_evaluate")->where(['subject_id'=>$get['id'],'user_id'=>session::get('home_user_id')])->find();
        if($subject_evaluate){
            $subject_evaluate['name'] = Db::name("user")->where(['id'=>session::get('home_user_id')])->value("name");
            $subject_evaluate['create_time'] = date("Y-m-d H:i:s",$subject_evaluate['create_time']);
            return json(['code'=>200,'result'=>$subject_evaluate]);
        }else{
            return json(['code'=>100,'msg'=>"您还未评价！"]);
        }
    } 
    //是否评过分
    public function score(){
        $get = $this->request->get();
        $subject_score = Db::name("subject_score")->where(['subject_id'=>$get['id'],'user_id'=>session::get('home_user_id')])->find();
        if($subject_score){
            return json(['code'=>200,'msg'=>"已评分！"]);
        }else{
            return json(['code'=>100,'msg'=>"未评分！"]);
        }
    }

    //评分
    public function score_add(){
        $date = $this->request->post();
        if(!session::get('home_user_id')){
            return json(['code'=>100,'msg'=>"您还未登陆"]);
        }
        $subject_score = Db::name("subject_score")->where(['subject_id'=>$date['id'],'user_id'=>session::get('home_user_id')])->find();
        if($subject_score){
            return json(['code'=>200,'msg'=>"您已经评分！"]);
        }else{
            $data = array(
                "subject_id" => $date['id'],
                "score" => $date['score'],
                "user_id" => session::get('home_user_id'),
                "create_time" => time()
            );
            Db::name("subject_score")->insert($data);
            $this->log('【评分】');
            return json(['code'=>200,'msg'=>"评分成功！"]);
        }
        
    }
	
    //做实验前
	public function examine(){
        $date = input();
        
        if ( !isset($date['id']) )
        {
            $date['id'] = cookie('experiment_id');
        }

        $is_ajax = $this->request->isAjax();
        
        if( $is_ajax && !session::get('home_user_id') )
        {
            return json([ 'code'=>100,'msg'=>"您还未登录", 'experiment_id'=>$date['id'] ]);//把当前实验的id返回给前端
        }elseif( !$is_ajax && !session::get('home_user_id') )
        {
            cookie('experiment_id', $date['id']);
            $this->error('登录后才可做实验');
        }

        $subject = Db::name("subject")->where(['id'=>$date['id']])->field("zip_file, zip_name, zip_name_file, emulate_subject")->find();
        
		$zip_name_file = '';
		
		if ( $subject['emulate_subject'] )//如果实验使用的是网址链接的话
		{
			$zip_name_file = $subject['emulate_subject'];
		}else{
			
			$zip = new \ZipArchive;
			$res = $zip->open($subject['zip_file']);
			
			if (!$subject['zip_name_file'] && $res === TRUE) {
	
				//解压缩
				$path = 'file/decompression/'.date('YmdHis',time()); // 解压缩目录
				$e_res = $zip->extractTo(ROOT_PATH . 'public_html/'.$path);
				$zip_name = explode(".",$subject['zip_name']);
				//$zip_name_file = $path."/".$zip_name[0];
				$zip_name_file = $path;
				Db::name("subject")->where(['id'=>$date['id']])->update(['zip_name_file'=>$zip_name_file]);
			   
			}else{
				$zip_name_file = $subject['zip_name_file'];
			}
			
		}

       // $emulate_subject = Db::name("subject")->where(['id'=>$date['id']])->value("zip_name_file");
        if(!$zip_name_file)
        {
            if ( $is_ajax )
            {
                return json(['code'=>100,'msg'=>"该项目不能做实验！"]);
            }else{
                $this->error('该项目不能做实验！');
            }            
        }

        $subject_examine = Db::name("subject_examine")->where(['subject_id'=>$date['id'],'user_id'=>session::get("home_user_id")])->find();
		
        if($subject_examine['is_delete'] == 1){
            Db::name("subject_examine")->where(['subject_id'=>$date['id'],'user_id'=>session::get("home_user_id")])->update(['is_delete'=>0]);
            $this->log('【做实验】');
        }
        
        if(!$subject_examine){
            $data = array(
                "subject_id" => $date['id'],
                "user_id" => session::get("home_user_id"),
                "create_time" => time()
            );
            Db::name("subject_examine")->insert($data);
            $this->log('【做实验】');
        }

        //与国家平台对接前 return json(['code'=>200,'result'=>$zip_name_file]);
        $this->redirect('index/subject/examine_url');
    }
	
	/*//做实验 去掉登录的examine()
	public function examine(){
        $date = $this->request->post();
		
        $subject = Db::name("subject")->where(['id'=>$date['id']])->field("zip_file, zip_name, zip_name_file, emulate_subject")->find();
        
		$zip_name_file = '';
		
		//halt( $subject );
		
		if ( $subject['emulate_subject'] )//如果实验使用的是网址链接的话
		{
			$zip_name_file = $subject['emulate_subject'];
		}else{
			
			$zip = new \ZipArchive;
			$res = $zip->open($subject['zip_file']);
			
			if (!$subject['zip_name_file'] && $res === TRUE) {
	
				//解压缩
				$path = 'file/decompression/'.date('YmdHis',time()); // 解压缩目录
				$e_res = $zip->extractTo(ROOT_PATH . 'public_html/'.$path);
				$zip_name = explode(".",$subject['zip_name']);
				//$zip_name_file = $path."/".$zip_name[0];
				$zip_name_file = $path;
				Db::name("subject")->where(['id'=>$date['id']])->update(['zip_name_file'=>$zip_name_file]);
			   
			}else{
				$zip_name_file = $subject['zip_name_file'];
			}
			
		}
		

       // $emulate_subject = Db::name("subject")->where(['id'=>$date['id']])->value("zip_name_file");
        if(!$zip_name_file){
            return json(['code'=>100,'msg'=>"该项目不能做实验！"]);
        }

		//halt($zip_name_file);
        return json(['code'=>200,'result'=>$zip_name_file]);
    }*/

    //评论列表
    public function evaluate_list(){
        $get = $this->request->get();
        $subject_evaluate = Db::name("subject_evaluate")->where(['subject_id'=>$get['id']])->order("create_time desc")->limit($get['start'],$get['limit'])->select();
        if($subject_evaluate){
            foreach($subject_evaluate as $key => $val){
                $user = Db::name("user")->where(['id'=>$val['user_id']])->field("name,img")->find();
                $subject_evaluate[$key]['name'] = $user['name'];
                $subject_evaluate[$key]['img'] = $user['img'];
                if(round((time()- $val['create_time'])/3600/24) == 0){
                    $subject_evaluate[$key]['created'] = "今天";
                }else{
                    $subject_evaluate[$key]['created'] = round((time()- $val['create_time'])/3600/24)."天前";
                }
                
                $subject_evaluate[$key]['reply_count'] = Db::name("subject_reply")->where(['evaluate_id'=>$val['id']])->count();
            }
        }
        $total = Db::name("subject_evaluate")->where(['subject_id'=>$get['id']])->count();
        $result['data'] = $subject_evaluate;
        $result['meta'] = array(
            "total" => $total,
            "size" => count($subject_evaluate),
            "start" => $get['start']
        );
        return json(['code'=>200,'result'=>$result]);
    }
    //回复列表
    public function reply_list(){
        $get = $this->request->get();
        $subject_reply = Db::name("subject_reply")->where(['evaluate_id'=>$get['pid']])->order("create_time desc")->limit($get['start'],$get['limit'])->select();
        if($subject_reply){
            foreach($subject_reply as $key => $val){
                $user = Db::name("user")->where(['id'=>$val['user_id']])->field("name,img")->find();
                $subject_reply[$key]['name'] = $user['name'];
                $subject_reply[$key]['img'] = $user['img'];
                if(round((time()- $val['create_time'])/3600/24) == 0){
                    $subject_reply[$key]['created'] = "今天";
                }else{
                    $subject_reply[$key]['created'] = round((time()- $val['create_time'])/3600/24)."天前";
                }
            }
        }
        $total = Db::name("subject_reply")->where(['evaluate_id'=>$get['pid']])->count();
        $result['data'] = $subject_reply;
        $result['meta'] = array(
            "total" => $total,
            "size" => count($subject_reply),
            "start" => $get['start']
        );
        return json(['code'=>200,'result'=>$result]);
    }
    //回复
    public function reply_add(){
        $date = $this->request->post();
        if(!session::get('home_user_id')){
            return json(['code'=>100,'msg'=>"您还未登陆"]);
        }
        if(!$date['comment']){
            return json(['code'=>100,'msg'=>"请填写回复内容！"]);
        }
        $data = array(
            "evaluate_id" => $date['pid'],
            "user_id" => session::get('home_user_id'),
            "reply_content" => $date['comment'],
            "create_time" => time()
        );
        Db::name("subject_reply")->insert($data);
        $this->log('【回复】');
        return json(['code'=>200,'msg'=>"回复成功！"]);
    }
	
	/*
	  examine_url()：在这里才开始去做实验的
	*/
    public function examine_url ()
	{
        $date = input();//仅提交了subject的id
        $is_ajax = $this->request->isAjax();
        
        $subject_id = cookie('experiment_id');
        $user_type = cookie('user_type');
		
        Vendor("GetMacAddr");
        $mac = new \GetMacAddr(PHP_OS); 
        $pc_card = $mac->mac_addr; 
        $examine = array(
            "pc_card" => $pc_card,
            "subject_id" => $subject_id,
            "create_time" => time()
        );
        $import_no = date("YmdGis", time());
        $model = new Redis();
        
        $keys = $model->getKeys("examine" . $import_no);
        $icount = 0;
		
        //$zip_name_file = Db::name("subject")->where(['id'=>$subject_id])->value("zip_name_file");
        $r = Db::name("subject")->where(['id'=>$subject_id])->field("zip_name_file, emulate_subject")->find();
		
		//判断zip_name_file（压缩文件）, emulate_subject（实验的url链接）,此二者为二选一，之前为只能用zip文件webGL做实验
		if ( $r['zip_name_file']  && !$r['emulate_subject'] )
		{
			$emulate_subject = "/". $r['zip_name_file'] ."/index.html";
		}else if( $r['emulate_subject'] )
		{
			$emulate_subject = $r['emulate_subject'];
		}else {
            if ($is_ajax)
            {
                return json(['code'=>100,'msg'=>"该项目不能做实验！"]);
            }else{
                $this->error('该项目不能做实验~');
            }
		}
       /* if($file_path){
            $emulate_subject = "/".$file_path."/index.html";
        }else{
            return json(['code'=>100,'msg'=>"该项目不能做实验！"]);
        }*/
		
        if($keys){
            foreach ($keys as $key => $val) {
                $getData = $model->getValue("examine" . $import_no, $val);
                if((time() - $getData['create_time'] <= 1800) && ($getData['subject_id'] == $examine['subject_id']) &&($getData['pc_card'] == $examine['pc_card']))
				{
                    //与国家平台对接前 return json(['code'=>200,'result'=>$emulate_subject]);

					if ( strpos($emulate_subject, '|') !== false )
					{//当实验项目的url地址是用'|'分隔，前面是专家做实验的的url
						$arr = explode('|', $emulate_subject);
						
						if ( $user_type == 4 )
                        {//是评审专家 用ajax 请求的
                            return json(['code'=>201,'href'=>$arr[0]]);
						}
						else
						{
                            if ($is_ajax)
                            {
                                return json(['code'=>201, 'href'=>$arr[1]]);
                            }else{
                                $this->redirect($arr[1]);//普通请求
                            }
						}
						
					}

                    if ($is_ajax)
                    {
                        return json(['code'=>201, 'href'=>$emulate_subject]);
                    }else{
                        $this->redirect($emulate_subject);//普通请求
                    }
				}
             
            }
			
            foreach ($keys as $key => $val) {
                $getData = $model->getValue("examine" . $import_no, $val);
                if(time() - $getData['create_time'] > 1800){
                   $model->del("examine" . $import_no, $val);
                }
                if($getData['subject_id'] == $examine['subject_id']){
                    ++$icount;
                }
            }
			
            if($icount >= 99)
			{
                if ($is_ajax)
                {
                    return json(['code'=>100,'msg'=>"该项目做实验已超过100，请稍后再试！"]);
                }else{
                    $this->error('该项目做实验已超过100，请稍后再试~');
                }

			}else{
                foreach ($keys as $key => $val) {
                    $getData = $model->getValue("examine" . $import_no, $val);
                    if((($getData['pc_card'] == $examine['pc_card']) && ($getData['subject_id'] <> $examine['subject_id'])) || (($getData['pc_card'] <> $examine['pc_card']) && ($getData['subject_id'] == $examine['subject_id'])) || (($getData['pc_card'] <> $examine['pc_card']) && ($getData['subject_id'] <> $examine['subject_id']))){
                       $model->setValue("examine" . $import_no, $icount, $examine);
                    }
                }
            }
        }else{
            $model->setValue("examine" . $import_no, $icount, $examine);
        }
		
        //与国家平台对接前 return json(['code'=>200,'result'=>$emulate_subject]);

		if ( strpos($emulate_subject, '|') !== false )
        {//当实验项目的url地址是用'|'分隔，前面是专家做实验的的url
            $arr = explode('|', $emulate_subject);
            
            if ( $user_type == 4 )
            {//是评审专家 用ajax 请求的
             
                return json(['code'=>201,'href'=>$arr[0]]);
            }
            else
            {
                if ($is_ajax)
                {
                    return json(['code'=>201, 'href'=>$arr[1]]);
                }else{
                    $this->redirect($arr[1]);//普通请求
                }
            }
            
        }

        if ($is_ajax)
        {
            return json(['code'=>201, 'href'=>$emulate_subject]);
        }else{
            $this->redirect($emulate_subject);//普通请求
        }
    }//examine_url 结束

    /*
    check_user(): 南开统一身份认证，获取师生信息
    返回值：师生信息的数组
    */
    
    public function check_user ()
    {
        $d = input('');
		
		if ( isset($d['admin_log']) )
		{
			$address         = "https://ilab-x.nankai.edu.cn/api/check_user?admin_log=01";//带个参数，让南开再请求时区别去做实验的身份验证操作
		}else{
			$address         = "https://ilab-x.nankai.edu.cn/api/check_user";//不带参数，表示是去做实验的身份认证操作
		}
		
        $experiment_id = cookie('experiment_id'); //判断并获取要做实验的experiment_id      
		
        $loginServer     = "https://sso.nankai.edu.cn/sso/login"; //南开统一身份认证登录地址
        //$address         = "https://ilab-x.nankai.edu.cn/api/check_user"; //当前控制器的此方法，即南开统一身份认证的回调地址
        $validateServer  = "https://sso.nankai.edu.cn/sso/serviceValidate"; //南开cas服务器验证地址
		
        if ( isset($_REQUEST["ticket"]) && !empty($_REQUEST["ticket"]) )
        {
            try {
                // url里带上ticket去cas服务验证地址
                $validate_url = $validateServer."?ticket=".$_REQUEST["ticket"]."&service=".$address;
                header("Content-Type:text/html;charset=utf-8");
                //服务端为https，需加以下配置
                $arrContextOptions = [
                    "ssl" => [
                        "verify_peer" => false,
                        "verify_peer_name" => false]
                ];

                $abc = urldecode(file_get_contents( $validate_url, false, stream_context_create($arrContextOptions) ) );
                
                //$abc = urldecode( file_get_contents($validate_url) ); //http使用这种方式
            		
                $dom = new \DOMDocument(); // 创建一个dom文档

                $dom->preserveWhiteSpace = false; //忽略xml命名空间
                $dom->encoding = "utf-8";
                $dom->loadXML($abc);
                /*
                获取用户的唯一标识信息
                由UIA的配置不同可分为两种：
                (1)学生：学号；教工：身份证号
                (2)学生：学号；教工：教工号
                */

                $extra_attributes = [];
                
                // CAS服务器只允许utf-8格式的数据
                $success = $dom->getElementsByTagName("authenticationSuccess");

                if( $success->length != 0 )
                {
                    $item      = $success->item(0);
                    $item_user = $item->getElementsByTagName("user");
                    
                    if ( $item_user->length == 0 )
                    {
                        header("Location: " . $loginServer . "?service=" . $address);
                    }
                    else 
                    {
                        $attr_nodes = $item->getElementsByTagName("attributes");

                        if ( $attr_nodes->length != 0 )
                        {
                            if ( $attr_nodes->item(0)->hasChildNodes() )
                            {
                                foreach ( $attr_nodes->item(0)->childNodes as $attr_child )
                                {
                                    _addAttributeToArray( $extra_attributes, $attr_child->localName, $attr_child->nodeValue );
                                }
                            }
                        }
                    }
                }
                else
                {
                    //header("Location:" . $loginServer . "?service=" . $address); //无法访问
					$this->redirect( $loginServer . "?service=" . $address );
                }
        
                // 获取登录用户的信息
                $res['password'] = '123456'; // password字段为必填
                $res['name'] = isExistInArray($extra_attributes,"comsys_name"); // name字段为必填 用户姓名
                
                if ( !$res['name'] )
                {
                    $res['name'] = ' ';//name 字段必填
                }

                $res['user_name'] = isExistInArray($extra_attributes,"comsys_name"); // 用户姓名
                $res['phone'] = isExistInArray($extra_attributes,"comsys_phone"); // 电话号码
                
                if ( !$res['phone'] )
                {
                    $res['phone'] = '13612326265';
                }

                $res['sex'] = isExistInArray($extra_attributes,"comsys_genders"); // 性别               
                $res['email'] = isExistInArray($extra_attributes,"comsys_email");// 邮件
                $res['teaching_number'] = isExistInArray($extra_attributes,"comsys_teaching_number");// 教工号                
                $res['student_number'] = isExistInArray($extra_attributes,"comsys_student_number");// 学生号                
                $res['type'] = isExistInArray($extra_attributes,"comsys_usertype");// 获取用户类型   1-学生  2-教工                
                $res['major'] = isExistInArray($extra_attributes,"comsys_disciplinename"); // 学生专业名称
                
                if ( isset($d['admin_log']) ) //南开老师用统一身份认证登录进后台
                {
                    $info = Db::table('tp_admin_user')->where('account', $res['teaching_number'])->find();

                    if (!$info)//第一次登录 把用户信息写入tp_admin_user表
                    {
                        //把教师数据写入此表中
                        $temp = [
                            'account'    => $res['teaching_number'],
                            'realname'   => $res['user_name'],
                            'type'       => 2,//教师角色
                            'status'     => 1,//账号 启用
                            'password'   => password_hash_tp('123456'),//初始密码123456
                        ];

                        $r_id = Db::table('tp_admin_user')->insertGetId( $temp );

                        if ($r_id)
                        {
                            // 生成session信息
                            Session::set(Config::get('rbac.user_auth_key'), $r_id);
                            Session::set('user_name', $res['teaching_number']);
                            Session::set('real_name', $res['user_name']);
                            Session::set('last_login_ip', '');
                            Session::set('last_login_time', 0);
                            Session::set('type', 2);
                          
                            // 保存登录信息
                            $update['last_login_time'] = time();
                            $update['login_count'] = ['exp', 'login_count+1'];
                            $update['last_login_ip'] = $this->request->ip(0,1);
                            Db::name("AdminUser")->where('id', $r_id)->update($update);

                            // 记录登录日志
                            $log['uid'] = $r_id;
                            $log['login_ip'] = $update['last_login_ip'];
                            $log['login_location'] = implode(" ", \Ip::find($log['login_ip']));
                            $log['login_browser'] = \Agent::getBroswer();
                            $log['login_os'] = \Agent::getOs();
                            Db::name("LoginLog")->insert($log);
							
							//进行做实验前的数据准备
							if ( $res['teaching_number'] )
							{
								$res['nankai_user_id'] = $res['teaching_number'];
								unset($res['teaching_number'], $res['student_number']);
							}else if ( $res['student_number'] )
							{
								$res['nankai_user_id'] = $res['student_number'];
								unset($res['teaching_number'], $res['student_number']);
							}

							if ( $res['type'] == 1 )//学生
							{
								$res['user_type'] = 2;
								unset($res['type']);
							}else if( $res['type'] == 2 )//老师
							{
								$res['user_type'] = 3;
								unset($res['type']);
							}

							$data = Db::table('tp_user')->where('nankai_user_id', $res['nankai_user_id'])->find();

							if ( !$data )//还没有此用户
							{
								$tp_user_id = Db::table('tp_user')->insertGetId($res);
								
								if ($tp_user_id)
								{
									$info = Db::table('tp_user')->where('id', $tp_user_id)->find();
									session::set('home_info', $info);//原有登录功能有此session 记录日志用的
									session::set('home_user_id', $tp_user_id);
									cookie('user_type', $res['user_type']);
								}
							}else//已有此用户
							{
								session::set('home_info', $data);//原有登录功能有此session 记录日志用的
								session::set('home_user_id', $data['id']);
								cookie('user_type', $res['user_type']);
							}
							//进行做实验前的数据准备 结束

                            // 缓存访问权限
                            \Rbac::saveAccessList();
                            $this->redirect('admin/index/index');

                        }else
                        {
                            $this->error('网络异常，请重新登录');
                        }                      

                    }else//已是再次登录
                    {
                        // 生成session信息
                        Session::set(Config::get('rbac.user_auth_key'), $info['id']);
                        Session::set('user_name', $info['account']);
                        Session::set('real_name', $info['realname']);
                        Session::set('last_login_ip', $info['last_login_ip']);
                        Session::set('last_login_time', $info['last_login_time']);
                        Session::set('type', $info['type']);
                      
                        // 保存登录信息
                        $update['last_login_time'] = time();
                        $update['login_count'] = ['exp', 'login_count+1'];
                        $update['last_login_ip'] = $this->request->ip(0,1);
                        Db::name("AdminUser")->where('id', $info['id'])->update($update);

                        // 记录登录日志
                        $log['uid'] = $info['id'];
                        $log['login_ip'] = $update['last_login_ip'];
                        $log['login_location'] = implode(" ", \Ip::find($log['login_ip']));
                        $log['login_browser'] = \Agent::getBroswer();
                        $log['login_os'] = \Agent::getOs();
                        Db::name("LoginLog")->insert($log);
						
						//进行做实验前的数据准备
						if ( $res['teaching_number'] )
							{
								$res['nankai_user_id'] = $res['teaching_number'];
								unset($res['teaching_number'], $res['student_number']);
							}else if ( $res['student_number'] )
							{
								$res['nankai_user_id'] = $res['student_number'];
								unset($res['teaching_number'], $res['student_number']);
							}

							if ( $res['type'] == 1 )//学生
							{
								$res['user_type'] = 2;
								unset($res['type']);
							}else if( $res['type'] == 2 )//老师
							{
								$res['user_type'] = 3;
								unset($res['type']);
							}

							$data = Db::table('tp_user')->where('nankai_user_id', $res['nankai_user_id'])->find();

							if ( !$data )//还没有此用户
							{
								$tp_user_id = Db::table('tp_user')->insertGetId($res);
								
								if ($tp_user_id)
								{
									$info = Db::table('tp_user')->where('id', $tp_user_id)->find();
									session::set('home_info', $info);//原有登录功能有此session 记录日志用的
									session::set('home_user_id', $tp_user_id);
									cookie('user_type', $res['user_type']);
								}
							}else//已有此用户
							{
								session::set('home_info', $data);//原有登录功能有此session 记录日志用的
								session::set('home_user_id', $data['id']);
								cookie('user_type', $res['user_type']);
							}
						//进行做实验前的数据准备 结束

                        // 缓存访问权限
                        \Rbac::saveAccessList();
                        $this->redirect('admin/index/index');
                    }//已是再次登录 结束

                }else//南开老师、学生用统一身份认证登录去做实验
                {
                    if ( $res['teaching_number'] )
                    {
                        $res['nankai_user_id'] = $res['teaching_number'];
                        unset($res['teaching_number'], $res['student_number']);
                    }else if ( $res['student_number'] )
                    {
                        $res['nankai_user_id'] = $res['student_number'];
                        unset($res['teaching_number'], $res['student_number']);
                    }
                    
                    if ( $res['type'] == 1 )//学生
                    {
                        $res['user_type'] = 2;
                        unset($res['type']);
                    }else if( $res['type'] == 2 )//老师
                    {
                        $res['user_type'] = 3;
                        unset($res['type']);
                    }
                    
                    $data = Db::table('tp_user')->where('nankai_user_id', $res['nankai_user_id'])->find();
                    
                    if ( !$data )//还没有此用户
                    {
                        $tp_user_id = Db::table('tp_user')->insertGetId($res);
                        
                        if ($tp_user_id)
                        {
                            $info = Db::table('tp_user')->where('id', $tp_user_id)->find();
                            session::set('home_info', $info);//原有登录功能有此session 记录日志用的
                            session::set('home_user_id', $tp_user_id);
                            cookie('user_type', $res['user_type']);
                            $this->redirect('index/subject/examine');
                        }
                    }else//已有此用户
                    {
                        session::set('home_info', $data);//原有登录功能有此session 记录日志用的
                        session::set('home_user_id', $data['id']);
                        cookie('user_type', $res['user_type']);
                        $this->redirect('index/subject/examine');
                    }
                }//南开老师、学生用统一身份认证登录去做实验 结束
                
            }//try 结束
            catch (Exception $e)
            {
                //header("Location:" . $loginServer . "?service=" . $address); //无法访问
				$this->redirect( $loginServer . "?service=" . $address );
            }    
        }
        else
        {
            //header("Location:" . $loginServer . "?service=" . $address); //无法访问
			$this->redirect( $loginServer . "?service=" . $address );
        }
        
        
    // cas服务器登录地址
	// 	$loginServer = "https://sso.nankai.edu.cn/sso/login";
	// 	// cas服务器验证地址
	// 	$validateServer = "https://sso.nankai.edu.cn/sso/serviceValidate";
	// 	// cas服务器回调地址
	// 	$address = "https://iclass.nankai.edu.cn/api/caslogin";
	// 	//cas退出地址,这是注销地址，注销时请先注销自己本地session,service参数就是回调地址
	// 	$casLogoutUrl="https://sso.nankai.edu.cn/sso/logout?service=https://iclass.nankai.edu.cn/web/index.html";
	//    // 如果请求带有ticket
	// 	if (isset($_REQUEST["ticket"]) && !empty($_REQUEST["ticket"])) {
	// 		try {
	// 			// url里带上ticket去cas服务验证地址
	// 			$validate_url = $validateServer."?ticket=".$_REQUEST["ticket"]."&service=".$address;
	// 			header("Content-Type:text/html;charset=utf-8");
	// 			//服务端为https，需加以下配置
	// 			$arrContextOptions=array(
	// 			"ssl"=>array(
	// 				"verify_peer"=>false,
	// 				"verify_peer_name"=>false,
	// 					),
	// 			);  
	// 			$abc=urldecode(file_get_contents($validate_url,false, stream_context_create($arrContextOptions)));
	// 			//http使用这种方式
	// 			//$abc=urldecode(file_get_contents($validate_url));
	// 			// 后去验证后的内容
	// 			// 常见一个dom文档
	// 			$dom = new \DOMDocument();
	// 			// 忽略xml命名空间
	// 			$dom->preserveWhiteSpace = false;
	// 			$dom->encoding = "utf-8";
	// 			$dom->loadXML($abc);
	// 			/**
	// 			*获取用户的唯一标识信息
	// 			*由UIA的配置不同可分为两种：
	// 			*(1)学生：学号；教工：身份证号
	// 			*(2)学生：学号；教工：教工号
	// 			**/
	// 			$userid="";
	// 			$extra_attributes = array();
	// 			// CAS服务器只允许utf-8格式的数据
	// 			 if($dom->getElementsByTagName("authenticationSuccess")->length != 0){
	// 				 $a = $dom->getElementsByTagName("authenticationSuccess");
	// 				  if ($a->item(0)->getElementsByTagName("user")->length == 0) {
	// 					 header("Location: " . $loginServer . "?service=" . $address);
	// 				  } else {
	// 					$userid=$a->item(0)->getElementsByTagName("user")->item(0)->nodeValue;
	// 					if ( $a->item(0)->getElementsByTagName("attributes")->length != 0) {
	// 						$attr_nodes = $a->item(0)->getElementsByTagName("attributes");
	// 						if ($attr_nodes->item(0)->hasChildNodes()) {
	// 							foreach ($attr_nodes->item(0)->childNodes as $attr_child) {
	// 								_addAttributeToArray($extra_attributes, $attr_child->localName,$attr_child->nodeValue);
	// 							}
	// 						}
	// 					}
	// 				}
	// 			}else{
	// 			   header("Location: " . $loginServer . "?service=" . $address); 
	// 			}
				
	// 		// 获取登录用户的扩展信息  
	// 		// 用户姓名
	// 		$name =isExistInArray($extra_attributes,"comsys_name");
	// 		// 电话号码
	// 		$phone =isExistInArray($extra_attributes,"comsys_phone");
	// 		// 民族
	// 		$national =isExistInArray($extra_attributes,"comsys_national");
	// 		// 性别
	// 		$genders =isExistInArray($extra_attributes,"comsys_genders");
	// 		// 邮件
	// 		$email = isExistInArray($extra_attributes,"comsys_email");
	// 		// 其它职位
	// 		$other_post = isExistInArray($extra_attributes,"comsys_other_post");
	// 		// 教育度程
	// 		$educationals = isExistInArray($extra_attributes,"comsys_educational");
	// 		// 教工号
	// 		$teaching_number = isExistInArray($extra_attributes,"comsys_teaching_number");
	// 		// 学生号
	// 		$studentNumber =isExistInArray($extra_attributes,"comsys_student_number");
	// 		// 获取用户类型   1-学生  2-教工
	// 		$type =isExistInArray($extra_attributes,"comsys_usertype");
	// 		/**
	// 		*  角色数组
	// 		*  key:ROLECNNAME;value:角色中文名称
	// 		*  key:ROLEIDENTIFY;value:角色代码
	// 		**/
	// 		$role = isExistInArray($extra_attributes,"comsys_role");
	// 		/**
	// 		*  部门数组
	// 		*  key:DEPARTMENTNAME;value:部门中文名称
	// 		*  key:DEPARTMENTIDENTIFY;value:部门代码
	// 		**/
	// 		$department =isExistInArray($extra_attributes,"comsys_department");
	// 		/**
	// 		*  岗位数组
	// 		*  key:POSTNAME;value:岗位中文名称
	// 		*key:POSTIDENTIFY;value:岗位代码
	// 		**/
	// 		$post = isExistInArray($extra_attributes,"comsys_post");
	// 		// 学生院系名称
	// 		$faculetName = isExistInArray($extra_attributes,"comsys_faculetyname");
	// 		// 学生院系代码
	// 		$faculetCode =isExistInArray($extra_attributes,"comsys_faculetycode");
	// 		// 学生年级名称
	// 		$gradName = isExistInArray($extra_attributes,"comsys_gradename");
	// 		// 学生年级代码
	// 		$gradCode = isExistInArray($extra_attributes,"comsys_gradecode");
	// 		// 学生专业名称
	// 		$disciplinName =isExistInArray($extra_attributes,"comsys_disciplinename");
	// 		// 学生专业代码
	// 		$disciplinCode = isExistInArray($extra_attributes,"comsys_disciplinecode");
	// 		// 学生班级名称
	// 		$className =isExistInArray($extra_attributes,"comsys_classname");
	// 		// 学生班级代码
	// 		$classCode = isExistInArray($extra_attributes,"comsys_classcode");
    //         $user_info = array('name' => $name, 'phone' => $phone, 'national' => $national, 'genders' => $genders, 'email' => $email, 'other_post' => $other_post, 'educationals' => $educationals, 'teaching_number' => $teaching_number, 'studentNumber' => $studentNumber, 'type' => $type, 'role' => $role, 'department' => $department, 'post' => $post, 'faculetName' => $faculetName, 'faculetCode' => $faculetCode, 'gradName' => $gradName, 'gradCode' => $gradCode, 'disciplinName' => $disciplinName, 'disciplinCode' => $disciplinCode, 'className' => $className, 'classCode' => $classCode);
    //         //print_r($user_info);exit;
    //         Session::set("user_infocas",$user_info);

    //         header("Location: https://".$_SERVER['SERVER_NAME']."/web/home.html");exit;

	// 		} catch (Exception $e) {
	// 			echo $e->getMessage();
	// 			header("Location: " . $loginServer . "?service=" . $address);
	// 		}
	// 	// 否则就去cas登录地址
	// 	} else {
	// 		header("Location: " . $loginServer . "?service=" . $address);
	// 		exit;
	// 	}
    }//check_user 结束
	
	/*
	  experts_enter() 评审专家进来 做实验, 直接用默认账号登录即可
	*/
	
	public function experts_enter ()
    {
		$data = Db::table('tp_user')->where('user_name', 'visitor')->find();
		
		if ($data)
		{
            session::set('home_info', $data);//原有的登录功能 有此session
            session::set('home_user_id', $data['id']);
            cookie('user_type', 4);
			$this->redirect('index/subject/examine');
		}else{
			
            $id = Db::table('tp_user')->insertGetId(['user_name'=>'visitor', 'user_type'=>4, 'name'=>'visitor', 'password'=>'123456', 'phone'=>'13612345678']);//name password为必填字段
			
			if ($id)
			{
                $info = Db::table('tp_user')->where('id', $id)->find();
                session::set('home_info', $info);//原有的登录功能 有此session
                session::set('home_user_id', $id);
                cookie('user_type', 4);
				$this->redirect('index/subject/examine');
			}
		}
		
    }//experts_enter 结束
    
    /*
	  out_logup() 南开校外注册
	*/
	
	public function out_logup ()
	{
        $d = input();

        //检查用户名是否已存在
        $res = Db::table('tp_user')->where('user_name', $d['user_name'])->find();
    
        if ( $res )
        {
            return json(['code'=>100,'msg'=>'该账号名已存在']);
        }

        $d['pswd'] = md5( $d['pswd'] );

        $temp = [
            'user_name' => $d['user_name'],
            'password' => $d['pswd'],
            'user_type' => 5,//校外注册人士
            'school' => $d['school'],
            'name' => $d['user_name'],//name字段必填 就给个值
            'phone' => '18836629287',
        ];

        $r = Db::table('tp_user')->insertGetId($temp);

        if ($r)
        {
            return json(['code'=>200,'msg'=>'注册成功,请登录后做实验']);
        }else{
            return json(['code'=>100,'msg'=>'网络异常,请再次提交']);
        }
		
    }//out_logup 结束
    
    /*
	  out_login() 南开校外登录
	*/
	
	public function out_login ()
	{
        $d = input();

        $pswd = md5 ($d['pswd']);

        //检查用户名是否已存在
        $res = Db::table('tp_user')->where('user_name', $d['user_name'])->find();

        if ( !$res )
        {
            return json(['code'=>100,'msg'=>'登录名或密码错误']);
        }else
        {
            if ( $pswd != $res['password'] )
            {
                return json(['code'=>100,'msg'=>'登录名或密码错误']);
            }else{//登录成功
                session::set('home_info', $res);//原有的登录功能 有此session
                session::set('home_user_id', $res['id']);
                cookie('user_type', $res['user_type']);
                $this->redirect('index/subject/examine');
            }
        }

    }//out_login 结束
    
    /*
    function reset_pass () 重置密码
    */

    public function reset_pass ()
    {
      $d = input();
      
      $user = Db::table('tp_user')->where('user_name', $d['user_name'])->find();

      if ($user)
      {
          $r = Db::table('tp_user')->where('user_name', $d['user_name'])->update(['password' => md5($d['pswd'])]);
          if ($r)
          {
            return json(['code'=>200,'msg'=>'重置密码OK']);
          }else{
            return json(['code'=>100,'msg'=>'重置密码失败~ 请重新操作']);
          }
      }else{
          return json(['code'=>100,'msg'=>'系统没有此账号~']);
      }
    }//reset_pass 结束

    public function xxx() //测试方法
    {
       echo '测试 redirect';
    }
}