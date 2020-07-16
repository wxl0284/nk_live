<?php

return [
	// 日志记录
    'module_init' => [
        '\\app\\common\\behavior\\WebLog',
    ],
    'app_end' => [
        '\\app\\common\\behavior\\WebLog',
    ]
];
