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
       
    	$where = "1=1";
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
        if($get['queryProLevel']){
            $where .= " AND ss.subject_level = '".$get['queryProLevel']."'";
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
        if($get['sortby'] == 'pubSeq'){
            
            $sql = "select ss.* from tp_subject ss where $where order by ss.create_time ".$order." limit ".$get['start'].",".$get['limit'];
        }

        // echo("<pre>");
        // print_r($get['start']);
        // echo("<pre>");
        // print_r($get['limit']);
     
        //评分
        if($get['sortby'] == 'intScore'){
            $sql = "select * from (select s.*, COALESCE(o.cnt,0) o_cnt from tp_subject s left join (select count(id) as cnt,subject_id from tp_subject_score group by subject_id) o on s.id = o.subject_id) ss where $where order by o_cnt ".$order.",id asc limit ".$get['start'].",".$get['limit'];
            // $sql = "select ss.* from (select s.*, COALESCE(o.cnt,0) o_cnt from tp_subject s left join (select count(id) as cnt,subject_id from tp_subject_score group by subject_id) o on s.id = o.subject_id) ss where $where order by ss.o_cnt ".$order.",ss.id asc limit ".$get['start'].",".$get['limit'];

        }
        //收藏
        if($get['sortby'] == 'collectionCount'){
            $sql = "select * from (select s.*, COALESCE(c.cnt,0) c_cnt from tp_subject s left join (select count(id) as cnt,subject_id from tp_subject_collect group by subject_id) c on s.id = c.subject_id) ss where $where order by c_cnt ".$order.",id asc limit ".$get['start'].",".$get['limit'];

        }
        //点赞
        if($get['sortby'] == 'upCount'){
            $sql = "select * from (select s.*, COALESCE(l.cnt,0) l_cnt from tp_subject s left join (select count(id) as cnt,subject_id from tp_subject_like group by subject_id) l on s.id = l.subject_id) ss where $where order by l_cnt ".$order.",id asc limit ".$get['start'].",".$get['limit']; 
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
        // echo("<pre>");
        // print_r($total);
        
      //  $where .= " AND ss.subject_level = 1";
        $identify_project = Db::query("select COUNT(*) as identify_project from tp_subject ss where $where"." AND ss.subject_level = 1");
        //$where .= " AND ss.subject_level = 2";
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
    
        return $this->fetch();
    }

    public function detail_up(){
        $date = $this->request->get();
        $data = array();
        $data = array(
            "subject_id" => $date['id'],
            "create_time" => time()
        );
        Db::name("subject_browse")->insert($data); 
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
                return json(['code'=>201,'msg'=>"取消收藏！"]);
            }
            if($subject_collect['is_delete'] == 1){
                $data = array(
                    "is_delete" => 0,
                    "delete_time" => time()
                );
                Db::name("subject_collect")->where(['subject_id'=>$date['id'],'user_id'=>session::get('home_user_id')])->update($data);
                return json(['code'=>201,'msg'=>"收藏成功！"]);
            }
            
        }else{
            $data = array(
                "subject_id" => $date['id'],
                "user_id" => session::get('home_user_id'),
                "create_time" => time()
            );
            Db::name("subject_collect")->insert($data);
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
            return json(['code'=>200,'msg'=>"点赞成功！"]);
        }
    }

    //评价
    public function evaluate_add(){
        $date = $this->request->post();
        if(!session::get('home_user_id')){
            return json(['code'=>100,'msg'=>"您还未登陆"]);
        }
        $subject_evaluate = Db::name("subject_evaluate")->where(['subject_id'=>$date['id'],'user_id'=>session::get('home_user_id')])->find();
        if($subject_evaluate){
            return json(['code'=>201,'msg'=>"您已经评价！"]);
        }else{
            $data = array(
                "subject_id" => $date['id'],
                "user_id" => session::get('home_user_id'),
                "content" => $date['comment'],
                "create_time" => time()
            );
            Db::name("subject_evaluate")->insert($data);
            return json(['code'=>200,'msg'=>"评价成功！"]);
        }
       
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
            return json(['code'=>200,'msg'=>"评分成功！"]);
        }
        
    }

    public function examine(){
        $date = $this->request->post();

        if(!session::get('home_user_id')){
            return json(['code'=>100,'msg'=>"您还未登陆"]);
        }
        $subject_examine = Db::name("subject_examine")->where(['subject_id'=>$date['id'],'user_id'=>session::get("home_user_id")])->find();

        if(!$subject_examine){

            $data = array(
                "subject_id" => $date['id'],
                "user_id" => session::get("home_user_id"),
                "create_time" => time()
            );
            Db::name("subject_examine")->insert($data);
        }
        
        $emulate_subject = Db::name("subject")->where(['id'=>$date['id']])->value("emulate_subject");

        return json(['code'=>200,'result'=>$emulate_subject]);
    }

    public function aa1(){
        echo("<pre>");
        print_r(session::get("home_user_id"));
        exit;
    }



 
}
