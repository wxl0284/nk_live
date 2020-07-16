<?php
namespace app\common\model;

use think\Model;

class Article extends Model
{
    // 指定表名,不含前缀
    protected $name = 'article';
    // 开启自动写入时间戳字段
    protected $autoWriteTimestamp = 'int';
    // 关闭自动写入更新时间
    protected $updateTime = false;

    public function getCreateTimeAttr($value){
        if($value){
            return date('Y-m-d H:i',$value);
        }else{
            return "";
        }
    }
    
}
