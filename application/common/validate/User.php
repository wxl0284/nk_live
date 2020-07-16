<?php
namespace app\common\validate;

use think\Validate;

class User extends Validate
{
    protected $rule = [
//        "password|密码" => "require",
        "email|邮箱" => "/([a-z0-9]*[-_.]?[a-z0-9]+)*@([a-z0-9]*[-_]?[a-z0-9]+)+[.][a-z]{2,3}([.][a-z]{2})?/i",
        "phone|电话" => "require|max:11|/^1[3-8]{1}[0-9]{9}$/|unique:user",
        "name|昵称" => "require",
    ];

    protected $message = [
        "email" => "邮箱格式不正确",
		"phone" => "手机号码格式不正确",
		

	];
}
