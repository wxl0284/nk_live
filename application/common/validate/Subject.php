<?php
namespace app\common\validate;

use think\Validate;

class Subject extends Validate
{
    protected $rule = [
        "cat_id|学院分类分类" => "require",
        //"subject_level|项目级别" => "require",
        "subject_name|直播名称" => "require",
        //"school_name|学校名称" => "require",
        "person_charge|直播老师姓名" => "require",
    ];
}
