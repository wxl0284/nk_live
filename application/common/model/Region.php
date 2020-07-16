<?php
namespace app\common\model;

use think\Model;
use think\Db;

class Region extends Model
{
    // 指定表名,不含前缀
    protected $name = 'region';
    // 开启自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    // 关闭自动写入更新时间
    protected $updateTime = false;

    
    
    public function region_list(){
        return Db::name("region")->select();
    }
}
