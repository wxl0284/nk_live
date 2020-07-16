<?php
namespace app\common\validate;

use think\Validate;

class  CategoryMajor extends Validate
{
    protected $rule = [
        "major|专业分类名称" => "require",
    ];
}
