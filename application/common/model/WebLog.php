<?php


namespace app\common\model;

use think\Model;

class WebLog extends Model
{
    protected $name = 'log';

    public function user()
    {
//        return $this->hasOne('AdminUser', "id", "uid")->setAlias(["id" => "uuid"]);
    }

    public function map()
    {
//        return $this->hasOne('NodeMap', "map", "map")->setAlias(["id" => "map_id"]);
    }
}