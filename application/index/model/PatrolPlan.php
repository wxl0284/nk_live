<?php
namespace app\index\model;
use think\Response;
use app\common\model\PatrolPlan as PatrolPlanModel;
/**
 * 运检模型
 * Class PatrolPlan
 * @package app\index\modelr
 */
class PatrolPlan extends PatrolPlanModel
{
	
	//结束时间 - 获取器
	public function getList($field=[],$where=[]){
		return $this->field($field)->where($where)->select();
	}
}
