<?php
use think\Route;

Route::rule('/api/check_user/[:admin_log]', 'index/Subject/check_user');//南开统一身份认证登录 获取师生信息,如果路由中带一个参数则表示登录后去后台管理实验项目
Route::get('/api/experts_enter', 'index/Subject/experts_enter');//专家登录
