# DatePicker
DatePicker是基于moment.js的日期选择器插件，支持小时、日、周、月、季、年的日期选择方式

它简单、好用

# 使用方法

#### 引入CSS文件
```javascript
<link rel="stylesheet" href="http://at.alicdn.com/t/font_2431045_hbwl3x53oep.css">  
<link rel="stylesheet" href="./index.css">
```

#### 引入javascript文件
```javascript
    <script src="./jquery-1.12.4.js"></script>
    <script src="./moment.js"></script>
    <script src="./jquery.datePicker.js"></script>
```

#### DOM结构
```html
    <div class="wrap">
        <div class="wrap-l">
            <i class="ali-iconfont ali-iconshizhong"></i>
            <div class="wrap-l-starTime">
                <input name="startTime" type="text" placeholder="开始日期">
            </div>
            
        </div>
        <div class="wrap-r">
            <i class="ali-iconfont ali-iconshizhong"></i>
            <div class="wrap-l-endTime">
                <input name="endTime" type="text" placeholder="结束日期">
            </div>
        </div>
    </div>
```

#### 调用方式
```javascript
    $('.wrap').on('click', function () {
        var _this = this;
        var reportTimeType = 4;
        var double = true;
        if(!$(this).next('[name="datePicker"]').length) {
            $(this).after("<div class='datePicker-x' name='datePicker'></div>");
                datePicker = $('.datePicker-x').datePicker({
                    reportTimeType: reportTimeType, // 4代表小时、5代表天、6代表周、7代表月、8代表季、9代表年
                    startDom: $(_this).find('input[name="startTime"]'),  // 开始时间要赋值的DOM元素
                    endDom: $(_this).find('input[name="endTime"]'),  // 结束时间要赋值的DOM元素
                    format: 'YYYY-MM-DD HH:mm:ss',
                    fastTime: fastTime[double][reportTimeType], // 快速选择的时间
                    isFast: true,   // 是否显示快速选择的选项
                    isDouble: double,   // 是否双选择的日历
                    disabledDate: false,    // 是否禁用以后的时间
                    yes: function (startTime, endTime) {    // 成功赋值前的回调可改变赋值的时间格式
                    },
                });
        }else {
            if($(this).next('[name="datePicker"]').hasClass('hide')) {
                $(this).next('[name="datePicker"]').removeClass('hide');
                datePicker.render();
            }else {
                $(this).next('[name="datePicker"]').addClass('hide');

            }
        }
    });
```

#### 参数说明
|      名称      |             默认值             |                            说明                            |
| :------------: | :----------------------------: | :--------------------------------------------------------: |
| reportTimeType |               4                |         4: 小时、5: 天、6: 周、7: 月、8: 季、9:年          |
|    startDom    |           container            |                   开始时间的赋值DOM对象                    |
|     endDom     |           container            |                   结束时间的赋值DOM对象                    |
|     format     |      YYYY-MM-DD HH:mm:ss       |                   只针对小时的格式化对象                   |
|    fastTime    | 默认值详见下方快速选择参数格式 |                     快速选择的时间格式                     |
|     isFast     |             false              |                    是否显示快速选择面板                    |
|    isDouble    |             false              |                      是否是单双选日历                      |
|  disabledDate  |             false              |               是否禁用当前之后的时间不可选择               |
|      yes       |                                | 确认选择后赋值前的格式化回调函数，可改变赋值元素的时间格式 |

#### 快速选择的格式参数
```javascript
    var fastTime = {
        true: {
            4: { // 双日历天、小时的快速选择格式
                '最近7天': { startTime: moment().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().format('YYYY-MM-DD HH:mm:ss') },
                '最近一个月': { startTime: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().format('YYYY-MM-DD HH:mm:ss') },
                '最近三个月': { startTime: moment().subtract(3, 'month').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().format('YYYY-MM-DD HH:mm:ss') }
            },
            5: { // 双日历天、小时的快速选择格式
                '最近7天': { startTime: moment().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().format('YYYY-MM-DD HH:mm:ss') },
                '最近一个月': { startTime: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().format('YYYY-MM-DD HH:mm:ss') },
                '最近三个月': { startTime: moment().subtract(3, 'month').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().format('YYYY-MM-DD HH:mm:ss') }
            },
            6: { // 双日历周的快速选择格式
                '本周': { startTime: moment().startOf('week').subtract(0, 'week').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().endOf('week').format('YYYY-MM-DD HH:mm:ss') },
                '最近2周': { startTime: moment().startOf('week').subtract(2, 'week').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().endOf('week').format('YYYY-MM-DD HH:mm:ss') },
                '最近4周': { startTime: moment().startOf('week').subtract(4, 'week').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().endOf('week').format('YYYY-MM-DD HH:mm:ss') },
                '最近8周': { startTime: moment().startOf('week').subtract(8, 'week').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().endOf('week').format('YYYY-MM-DD HH:mm:ss') },
            },
            7: { // 双日历月的快速选择格式
                "本月": { startTime: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss')},
                "本年": { startTime: moment().startOf('year').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss')},
                "最近六个月": { startTime: moment().startOf('month').subtract(6, 'month').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss')}
            },
            8:{ // 双日历季的快速选择格式
                "本季度": { startTime: moment().startOf('quarter').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().endOf('quarter').format('YYYY-MM-DD HH:mm:ss')},
                "今年至今": { startTime: moment().startOf('year').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().endOf('quarter').format('YYYY-MM-DD HH:mm:ss')},
                "上一季度": { startTime: moment().subtract(1, 'quarter').startOf('quarter').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().subtract(1, 'quarter').endOf('quarter').format('YYYY-MM-DD HH:mm:ss')}
            },
            9: { // 双日历年的快速选择格式
                "今年": { startTime: moment().startOf('year').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().endOf('year').format('YYYY-MM-DD HH:mm:ss')},
                "近一年": { startTime: moment().subtract(1, 'year').startOf('year').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().endOf('year').format('YYYY-MM-DD HH:mm:ss')},
                "近二年": { startTime: moment().subtract(2, 'year').startOf('year').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().endOf('year').format('YYYY-MM-DD HH:mm:ss')},
                "近十一年": { startTime: moment().subtract(11, 'year').startOf('year').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().endOf('year').format('YYYY-MM-DD HH:mm:ss')}
            }
        },
        false: {
                4: {  // 单日历天和小时的快速时间选择格式
                    '今天': { startTime: moment().format('YYYY-MM-DD HH:mm:ss') },
                    '昨天': { startTime: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss') },
                    '一周前': { startTime: moment().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss') },
                },
                5: {  // 单日历天和小时的快速时间选择格式
                    '今天': { startTime: moment().format('YYYY-MM-DD HH:mm:ss') },
                    '昨天': { startTime: moment().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss') },
                    '一周前': { startTime: moment().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss') },
                },
                6: { // 单日历周的快速选择格式
                    '本周': { startTime: moment().startOf('week').subtract(0, 'week').format('YYYY-MM-DD HH:mm:ss')},
                    '上一周': { startTime: moment().startOf('week').subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss')},
                    '上二周': { startTime: moment().startOf('week').subtract(2, 'week').format('YYYY-MM-DD HH:mm:ss')},
                },
                7: {  // 单选日历月的快速时间选择格式
                    '当前月': { startTime: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss') },
                    '一个月前': { startTime: moment().startOf('month').subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss') },
                    '半年前': { startTime: moment().startOf('month').subtract(6, 'month').format('YYYY-MM-DD HH:mm:ss') },
                    '一年前': { startTime: moment().startOf('month').subtract(12, 'month').format('YYYY-MM-DD HH:mm:ss') },
                },
                8: {  // 单选日历季的快速时间选择格式
                    '本季度': { startTime: moment().startOf('quarter').format('YYYY-MM-DD HH:mm:ss') },
                    '上一季度': { startTime: moment().startOf('quarter').subtract(1, 'quarter').format('YYYY-MM-DD HH:mm:ss') },
                    '上二季度': { startTime: moment().startOf('quarter').subtract(2, 'quarter').format('YYYY-MM-DD HH:mm:ss') },
                },
                9: {  // 单选日历年的快速时间选择格式
                    '今年': { startTime: moment().startOf('year').format('YYYY-MM-DD HH:mm:ss') },
                    '去年': { startTime: moment().startOf('year').subtract(1, 'year').format('YYYY-MM-DD HH:mm:ss') },
                    '前年': { startTime: moment().startOf('year').subtract(2, 'year').format('YYYY-MM-DD HH:mm:ss') },
                },
        }

    }
```

#### 有点忙，不定时更新，谢谢大家。
