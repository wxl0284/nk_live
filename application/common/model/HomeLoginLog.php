<?php


//------------------------
// 登录日志模型
//-------------------------

namespace app\common\model;

use think\Model;

class HomeLoginLog extends Model
{
    public function user()
    {
        return $this->hasOne('User', "id", "uid", ["id" => "uuid"]);
    }
}
