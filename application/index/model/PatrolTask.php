<?php
namespace app\index\model;
use think\Response;
use app\common\model\PatrolTask as PatrolTaskModel;
/**
 * 运检任务模型
 * Class PatrolTask
 * @package app\index\modelr
 */
class PatrolTask extends PatrolTaskModel
{
	public function getList($field=[],$where=[]){
		return $this->field($field)->where($where)->select();
	}
}