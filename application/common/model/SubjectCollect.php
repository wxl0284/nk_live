<?php
namespace app\common\model;

use think\Model;

class SubjectCollect extends Model
{
    // 指定表名,不含前缀
    protected $name = 'subject_collect';

    public function user(){
        return $this->hasOne('User','id','user_id');
    }
    public function subject(){
        return $this->hasOne('Subject','id','subject_id');
    }
    
}
