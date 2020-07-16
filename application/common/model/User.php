<?php
namespace app\common\model;

use think\Model;

class User extends Model
{
    // 指定表名,不含前缀
    protected $name = 'user';
    // 开启自动写入时间戳字段
    public $autoWriteTimestamp  = true;

    //自动完成
    protected $auto = ['password'];

    /**
     * 修改密码
     */
    public function updatePassword($uid, $password)
    {
        return $this->where("id", $uid)->update(['password' => password_hash_tp($password)]);
    }
}
