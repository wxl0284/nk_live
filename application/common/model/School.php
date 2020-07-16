<?php
namespace app\common\model;

use think\Model;

class School extends Model
{
    // 指定表名,不含前缀
    protected $name = 'school';
    public function region(){
        return $this->hasOne('Region','id','region_id');
    }

}
