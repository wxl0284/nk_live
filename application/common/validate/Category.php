<?php
namespace app\common\validate;

use think\Validate;

class Category extends Validate
{
    protected $rule = [
        "cat_name|分类标题" => "require",
    ];
}
