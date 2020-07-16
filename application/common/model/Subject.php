<?php
namespace app\common\model;

use think\Model;
use think\Db;

class Subject extends Model
{
    // 指定表名,不含前缀
    protected $name = 'subject';
    // 开启自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    // 关闭自动写入更新时间
    protected $updateTime = false;
    //大类
    public function get_cat_parent_name($cat_id){
        $category = Db::name("category")->where(['id'=>$cat_id])->find();
        if($category['parent_id']){
            $cat_name = Db::name("category")->where(['id'=>$category['parent_id']])->value("cat_name");  
        }else{
            $cat_name = $category['cat_name'];
        }
        return $cat_name;

    }
    //分类
    public function get_cat_name($cat_id){
    	return Db::name("category")->where(['id'=>$cat_id])->value("cat_name");
    }
    //获奖，申报
    public function get_award_win($type){
        return Db::name("award_win")->where(['type'=>$type])->select();
    }
    
}
