$(function (window, $) {

    var firstClass = {
        dContent: 'datePicker-content',
        dBottom: 'datePicker-bottom',
        dBBtn: 'datePicker-bottom-btn',
        dBBConfirm: 'datePicker-bottom-btn-confirm',
        dBBCancel: 'datePicker-bottom-btn-cancel',
        dCFast: 'datePicker-content-fast',
        dCFUl: 'datePicker-content-fast-ul',
        dCFULi: 'datePicker-content-fast-ul-li',
        dCCalender: 'datePicker-content-calendar',
        dCCHours: 'datePicker-content-calendar-hours',
        dCCHLeft: 'datePicker-content-calendar-hours-left',
        dCCHContent: 'datePicker-content-calendar-hours-content',
        dCCHRight: 'datePicker-content-calendar-hours-right',
        dCCBody: 'datePicker-content-calendar-body',
        dCCBLeft: 'datePicker-content-calendar-body-left',
        dCCBRight: 'datePicker-content-calendar-body-right'
    }

    var minorClass = {
        cBHeader: 'calendarBody-header',
        cBHLeft: 'calendarBody-header-left',
        cBHCenter: 'calendarBody-header-content',
        cBHCText: 'calendarBody-header-content-text',
        cBHRNextMonth: 'calendarBody-header-right-nextMonth',
        cBHLPrevMonth: 'calendarBody-header-left-prevMonth',
        cBHRNextYear: 'calendarBody-header-right-nextYear',
        cBHLPrevYear: 'calendarBody-header-left-prevYear',
        cBHRight: 'calendarBody-header-right',
        cBContent: 'calendarBody-content',
        cBCTitle: 'calendarBody-content-title',
        cBCTText: 'calendarBody-content-title-text',
        cBCBody: 'calendarBody-content-body',
        cBCBRow: 'calendarBody-content-body-row',
        cBCBRDate: 'calendarBody-content-body-row-date',
        cHLeft: 'calendarHour-day',
        cHRight: 'calendarHour-hour',
        cHLInput: 'calendarHour-day-input',
        cHRInput: 'calendarHour-hour-input',
        cHRPull: 'calendarHour-hour-pull',
        cHRPContent: 'calendarHour-hour-pull-content',
        cHRPFooter: 'calendarHour-hour-pull-footer',
        cHRPFCancel: 'calendarHour-hour-pull-footer-cancel',
        cHRPFConfirm: 'calendarHour-hour-pull-footer-confirm',
        cHRPCHours: 'calendarHour-hour-pull-content-hour',
        cHRPHUl: 'calendarHour-hour-pull-hour-ul',
        cHRPCMinute: 'calendarHour-hour-pull-content-minute',
        cHRPMUl: 'calendarHour-hour-pull-minute-ul',
        cHRPCSecond: 'calendarHour-hour-pull-content-second',
        cHRPSUl: 'calendarHour-hour-pull-second-ul',
    }

    function DatePicker(options) {
        this.options = {
            container: '#datePicker',   // ??????
            width: 646,     // ??????
            reportTimeType: 4,  // 4???????????????5????????????6????????????7????????????8????????????9?????????
            isDouble: true,     // ????????????????????????
            isFast: false,      // ?????????????????????????????????
            startDom: options.container,    // ????????????????????????DOM??????
            endDom: options.container,  // ????????????????????????DOM??????
            disabledDate: false,    // ???????????????????????????
            format: 'YYYY-MM-DD HH:mm:ss',  // ???????????????
            yes: function (startTime, endTime) {    // ??????????????????????????????????????????????????????
            },
            fastTime: { // ?????????????????????
                '??????7???': { startTime: moment().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().format('YYYY-MM-DD HH:mm:ss') },
                '???????????????': { startTime: moment().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().format('YYYY-MM-DD HH:mm:ss') },
                '???????????????': { startTime: moment().subtract(3, 'month').format('YYYY-MM-DD HH:mm:ss'), endTime: moment().format('YYYY-MM-DD HH:mm:ss') },
            }
        }

        this.options = $.extend({}, this.options, options);
        this.init();
        return this;
    }

    DatePicker.prototype.init = function () {   // ?????????
        this.initOptions(); // ?????????????????????
        this.resetTime();   // ???????????????
        this.createDom();   // ??????DOM??????
        this.createFastDom(); // ?????????????????????DOM??????
        this.createFooterDom();    // ????????????????????????
        this.cutState(); // ???????????????
        this.bindEvent();   // ??????????????????
    }

    DatePicker.prototype.initOptions = function () {    // ???????????????

        this.container = this.options.container;
        $(this.container).empty();
        this.id = this.options.id;
        this.reportTimeType = this.options.reportTimeType;
        this.options.startTime = this.options.isDouble ? moment().subtract(1, 'month').valueOf() : moment().valueOf();
        this.options.endTime = moment().subtract(1, 'month').valueOf();

        this.reportStartYear = -3;
        this.reportEndYear = 12;

        if(this.reportTimeType < 7) {
            this.options.endTime = moment(this.options.endTime).add(1, 'month').valueOf();
        }else if(this.reportTimeType <= 8 ) {
            this.options.startTime = moment().subtract(1, 'year').valueOf();
            this.options.endTime = moment(this.options.startTime).add(1, 'year').valueOf();
        }else if(this.reportTimeType === 9 ) {
            this.options.startTime = this.options.isDouble ?  moment().subtract(10, 'year').add(this.reportStartYear, 'year').valueOf() : moment().subtract(1, 'year').add(this.reportStartYear, 'year').valueOf();
            this.options.endTime = moment(this.options.startTime).add((this.reportEndYear + this.reportStartYear), 'year').valueOf();
        }

        this.selectTime = [];
        this.selectDom = [];
        this.weekText = ['???', '???', '???', '???', '???', '???', '???'];

        this.type = {
            4: 'hour',
            5: 'day',
            6: 'week',
            7: 'month',
            8: 'quarter',
            9: 'year'
        }

        if(this.options.isDouble) {
            this.date = [this.options.startTime, this.options.endTime];
        }else {
            this.date = [this.options.startTime];
        }
        
        if(this.options.isDouble){
            $(this.container).addClass('is-double');
        }
        if(this.options.isFast) {
            $(this.container).addClass('is-fast');
        }

        $(this.container).attr('reportTimeType', this.reportTimeType);
    }

    DatePicker.prototype.resetTime = function () {  // ????????????????????????
        var startTime = this.options.startTime;
        var endTime = this.options.endTime;
        this.options.startYear = moment(startTime).year();
        this.options.startMonth = moment(startTime).month();
        this.options.startDay = moment(startTime).date();
        this.options.startHour = moment(startTime).hour();
        this.options.startMinute = moment(startTime).minute();
        this.options.startSecond = moment(startTime).second();

        this.options.endYear = moment(endTime).year();
        this.options.endMonth = moment(endTime).month();
        this.options.endDay = moment(endTime).date();
        this.options.endHour = moment(endTime).hour();
        this.options.endMinute = moment(endTime).minute();
        this.options.endSecond = moment(endTime).second();

        this.options.startTime  = moment({ y: this.options.startYear, M: this.options.startMonth, d: this.options.startDay, h: this.options.startHour, m: this.options.startMinute, s: this.options.startSecond}).valueOf();
        this.options.endTime = moment({ y: this.options.endYear, M: this.options.endMonth, d: this.options.endDay, h: this.options.endHour, m: this.options.endMinute, s: this.options.endSecond}).valueOf();
    }

    DatePicker.prototype.setTime = function (time) {   // ????????????
        return moment(time).valueOf();
    }

    DatePicker.prototype.addTime = function (time, type, num) {   // ?????????
        num = this.options.reportTimeType === 9 && !num ? 9 : num;
        num = num || 1;
        return moment(time).add(num, type).valueOf();
    }

    DatePicker.prototype.subtractTime = function (time, type, num) { // ?????????
        num = this.options.reportTimeType === 9 && !num ? 9 : num;
        num = num || 1;
        return moment(time).subtract(num, type).valueOf();
    }

    DatePicker.prototype.createDom = function () {  // ??????DOM
        var isHours = this.options.reportTimeType !== 4 ? 'hide' : '';
        this.container.append('<div class="'+firstClass.dContent+'"><div class="'+firstClass.dCFast+'"></div><div class="'+firstClass.dCCalender+'"><div class="'+firstClass.dCCHours+' '+isHours+'"></div><div class="'+firstClass.dCCBody+'"></div></div></div><div class="'+firstClass.dBottom+'"></div>');
        if(this.options.isDouble) { // ??????????????????
            this.container.find('.' + firstClass.dCCBody).append('<div class="'+firstClass.dCCBLeft+'"></div><div class="'+firstClass.dCCBRight+'"></div>');
            this.container.find('.' + firstClass.dCCHours).append('<div class="'+firstClass.dCCHLeft+'" name-text="????????????,????????????"></div><div class="ali-iconfont ali-icon076arrowXY02 '+firstClass.dCCHContent+'"></div><div class="'+firstClass.dCCHRight+'" name-text="????????????,????????????"></div>');
            this.calendarDoms = [this.container.find('.' + firstClass.dCCBLeft), this.container.find('.' + firstClass.dCCBRight)];  // ??????doms
            this.hourDoms = [this.container.find('.' + firstClass.dCCHLeft), this.container.find('.' + firstClass.dCCHRight)];
        }else {
            this.calendarDoms = [this.container.find('.' + firstClass.dCCBody)];
            this.container.find('.' + firstClass.dCCHours).attr('name-text', '????????????,????????????');
            this.hourDoms = [this.container.find('.' + firstClass.dCCHours)];
        }
        
        for(var i = 0; i < this.date.length; i ++) {
            var calendarDom = this.calendarDoms[i];
            var hourDom = this.hourDoms[i];
            var time = this.date[i];
            this.createHeaderDom(calendarDom, time);
            this.createBodyDom(calendarDom, time);
            this.createDomBodyHours(hourDom, time);
        }
    }

    DatePicker.prototype.createHeaderDom = function (dom, time) {   // ????????????DOM??????
        var className = minorClass.cBHeader;
        var header = dom.find('.' + className);
        if(!header.length) {
            header = $('<div class="' + className + '"></div>');
            dom.append(header);
        }
        switch(this.reportTimeType) {
            case 4:
                this.createHeaderDomDay(header, time);
                break;
            case 5:
                this.createHeaderDomDay(header, time);
                break;
            case 6:
                this.createHeaderDomDay(header, time);
                break;
            case 7:
                this.createHeaderDomDay(header, time);
                break;
            case 8:
                this.createHeaderDomDay(header, time);
                break;
            case 9:
                this.createHeaderDomDay(header, time);
                break;
        }
    }

    DatePicker.prototype.createHeaderDomDay = function (header, time) { // ????????????DOM??????
        var isDouble = this.options.isDouble ? 'is-double' : '';
        var timeText = moment(time).format('YYYY ??? M ??? ');
            if(this.options.reportTimeType === 7 || this.options.reportTimeType === 8) {
                timeText = moment(time).format('YYYY ???');
            }else if(this.options.reportTimeType === 9) {
                timeText = moment(time).format('YYYY ???') + " - " + moment(time).add(8, 'year').format('YYYY ???');
            }

        // ???????????????
        var headerLeft = "<div class='" + minorClass.cBHLeft + "'><i class='ali-iconfont ali-icon081arrowXZ05 " + minorClass.cBHLPrevYear + "'></i><i class='ali-iconfont ali-icon075arrowXZ02 " + minorClass.cBHLPrevMonth + "'></i></div>";
        var headerCenter = "<div class='"+minorClass.cBHCenter+"'><span class='" + minorClass.cBHCText + " " + isDouble + "'>" + timeText + "</span></div>";
        var headerRight = "<div class='" + minorClass.cBHRight + "'><i class='ali-iconfont ali-icon076arrowXY02 " + minorClass.cBHRNextMonth + "'></i><i class='ali-iconfont ali-icon082arrowXY05 " + minorClass.cBHRNextYear + "'></i></div>";

        header.append(headerLeft).append(headerCenter).append(headerRight);
    }

    DatePicker.prototype.setHeaderText = function (dom, time) {
        var text = moment(time).format('YYYY ??? M ??? ');
        if(this.options.reportTimeType === 7 || this.options.reportTimeType === 8) {
            text = moment(time).format('YYYY ???');
        }else if(this.options.reportTimeType === 9) {
            text = moment(time).format('YYYY ???') + " - " + moment(time).add(8, 'year').format('YYYY ???');
        }
        dom.find('.' + minorClass.cBHCText).text(text);
    }

    DatePicker.prototype.createBodyDom = function (dom, time) {  // ??????ReportTimeType????????????????????????
        var className = minorClass.cBContent;
        var body = dom.find('.' + className).empty();
        if(!body.length) {
            body = $('<div class="' + className + '"></div>');
            dom.append(body);
        }
        switch(this.reportTimeType) {
            case 4:
                this.createDomBodyDay(body, time);
                break;
            case 5:
                this.createDomBodyDay(body, time);
                break;
            case 6:
                this.createDomBodyDay(body, time);
                break;
            case 7:
                this.createDomBodyMonth(body, time);
                break;
            case 8:
                this.createDomBodyQuarter(body, time);
                break;
            case 9:
                this.createDomBodyYear(body, time);
                break;
        }
    }

    DatePicker.prototype.createDomBodyDay = function (body, time) { // ????????????????????????DOM??????
        time = moment(time).startOf('day').valueOf();

        var bodyTitle = $("<div class='" + minorClass.cBCTitle + "'></div>");

        // ??????
        var bodyTitleSpan = '';
        for(var i = 0; i < this.weekText.length; i ++) {
            bodyTitleSpan +='<span class="' + minorClass.cBCTText + '">'+this.weekText[i]+'</span>';
        }
        bodyTitle.append(bodyTitleSpan);
       
        // ??????
        var bodyContent = $("<div class='" + minorClass.cBCBody + "'></div>");
        var index = 0;
        for(var i = 0; i < 6; i ++) {

            // ?????????????????? 
            var weekDay = moment(time).startOf('month').weekday(); // ????????????????????????
            var startDay = moment(time).startOf('month').subtract(weekDay, 'day').valueOf();  // ???????????????
            var titleWeek = this.options.reportTimeType === 6 ? "title='"+moment(startDay).add(i, 'week').week() + "???'" : '';
            var row = $("<div class='" + minorClass.cBCBRow + "' " + titleWeek + "></div>");

            var nowMonth = moment(time).month();
            var spans = '';
            var startClass = this.options.isDouble || this.reportTimeType === 6 ? ' start-date active' : ' current';
                startClass = this.selectTime[0] ? startClass : '';
            var endClass = this.options.isDouble || this.reportTimeType === 6 ? ' end-date active' : '';
                endClass = this.selectTime[1] ? endClass : '';
            var active = this.options.isDouble || this.reportTimeType === 6 ? ' active' : '';
       
            for(var j = 0; j < 7; j ++) {
                var tempDay = moment(startDay).add(index, 'day').date();
                var tempMonth = moment(startDay).add(index, 'day').month();
                var tempDate = moment(startDay).add(index, 'day').valueOf();
                var isAvaliable = 'available';
                var isDisabled = '';
                if(this.options.disabledDate) { // ???????????????????????????????????????
                    isDisabled = moment(tempDate).endOf('day').valueOf() > moment().endOf('day').valueOf() ? ' disabled' : '';
                }
                if(tempMonth > nowMonth) {  
                    isAvaliable = 'next-month';
                }else if(tempMonth < nowMonth){
                    isAvaliable = 'prev-month';
                }
                var startTime = moment(this.selectTime[0]).startOf('day').valueOf();   // ?????????????????????
                var endTime = moment(this.selectTime[1]).startOf('day').valueOf();     // ?????????????????????
                var isEndDate = tempDate === endTime && (isAvaliable === 'available' || (this.reportTimeType === 6 && !this.options.isDouble)) ? endClass : '';
                var isStartDate = tempDate === startTime && (isAvaliable === 'available' || (this.reportTimeType === 6 && !this.options.isDouble)) ? startClass : '';
                var isActive = tempDate > startTime && tempDate < endTime && (isAvaliable === 'available' || (this.reportTimeType === 6 && !this.options.isDouble))  ? active : '';
                var dateFormat = moment(tempDate).format('YYYY-MM-DD');
                var tempToday = dateFormat === moment().format('YYYY-MM-DD') && tempMonth === nowMonth ? ' today' : ''; // ?????????????????????

                spans += "<div class='" + minorClass.cBCBRDate + " " + isEndDate + isStartDate + isActive + tempToday + isDisabled + "' date='" + dateFormat + "'><span class='" + isAvaliable + "'>" + tempDay +"</span></div>";
                index ++;
            }
            row.append(spans);
            bodyContent.append(row);
        }
        body.append(bodyTitle).append(bodyContent);
    }

    DatePicker.prototype.createDomBodyMonth = function (body, time) {   // ????????????????????????DOM??????
        time = moment(moment(time).format('YYYY-MM-01 00:00:00')).valueOf();
       
        // ??????
        var bodyContent = $("<div class='" + minorClass.cBCBody + "'></div>");
        var index = 0;
        for(var i = 0; i < 3; i ++) {

            var row = $("<div class='" + minorClass.cBCBRow + "'></div>");
            // ?????????????????? 
            var startMonth = moment(time).startOf('year'); // ????????????????????????
            var spans = '';
            var startClass = this.options.isDouble ? ' start-date active' : ' current';
                startClass = this.selectTime[0] ? startClass : '';
            var endClass = this.options.isDouble ? ' end-date active' : '';
                endClass = this.selectTime[1] ? endClass : '';
            var active = this.options.isDouble ? ' active' : '';
       
            for(var j = 0; j < 4; j ++) {
                
                var isDisabled = '';
                var tempMonthText = this.lowerConvertUpper(moment(startMonth).add(index, 'month').format('MM')) + "???";
                var tempDate = moment(startMonth).add(index, 'month').valueOf();
                var isAvaliable = 'available';
                var startTime = moment(moment(this.selectTime[0]).format('YYYY-MM-01 00:00:00')).valueOf();   // ?????????????????????
                var endTime = moment(moment(this.selectTime[1]).format('YYYY-MM-01 00:00:00')).valueOf();     // ?????????????????????
                var isEndDate = tempDate === endTime && isAvaliable === 'available' ? endClass : '';
                var isStartDate = tempDate === startTime && isAvaliable === 'available' ? startClass : '';
                var isActive = tempDate > startTime && tempDate < endTime && isAvaliable === 'available'  ? active : '';
                var dateFormat = moment(tempDate).format('YYYY-MM');
                var tempToday = dateFormat === moment().format('YYYY-MM') ? ' today' : ''; // ?????????????????????
                if(this.options.disabledDate) { // ???????????????????????????????????????
                    isDisabled = moment(tempDate).endOf('month').valueOf() > moment().endOf('month').valueOf() ? ' disabled' : '';
                }
  
                spans += "<div class='" + minorClass.cBCBRDate + " " + isEndDate + isStartDate + isActive + tempToday + isDisabled +"' date='" + dateFormat + "'><span class='" + isAvaliable + "'>" + tempMonthText +"</span></div>";
                index ++;
            }
            row.append(spans);
            bodyContent.append(row);
        }
        body.append(bodyContent);
    }

    DatePicker.prototype.createDomBodyQuarter = function (body, time) {     // ????????????????????????DOM??????
        time = moment(time).startOf('quarter').valueOf();
       
        // ??????
        var bodyContent = $("<div class='" + minorClass.cBCBody + "'></div>");
        var index = 0;
        for(var i = 0; i < 2; i ++) {

            var row = $("<div class='" + minorClass.cBCBRow + "'></div>");
            // ?????????????????? 
            var startMonth = moment(time).startOf('year'); // ????????????????????????
            var spans = '';
            var startClass = this.options.isDouble ? ' start-date active' : ' current';
                startClass = this.selectTime[0] ? startClass : '';
            var endClass = this.options.isDouble ? ' end-date active' : '';
                endClass = this.selectTime[1] ? endClass : '';
            var active = this.options.isDouble ? ' active' : '';
       
            for(var j = 0; j < 2; j ++) {
                var isDisabled = '';
                var tempMonthText = "???" + this.lowerConvertUpper(moment(startMonth).add(index, 'quarter').quarter()) + '??????';
                var tempDate = moment(startMonth).add(index, 'quarter').valueOf();
                var isAvaliable = 'available';
                var startTime = moment(this.selectTime[0]).startOf('quarter').valueOf();   // ?????????????????????
                var endTime = moment(this.selectTime[1]).startOf('quarter').valueOf();     // ?????????????????????
                var isEndDate = tempDate === endTime && isAvaliable === 'available' ? endClass : '';
                var isStartDate = tempDate === startTime && isAvaliable === 'available' ? startClass : '';
                var isActive = tempDate > startTime && tempDate < endTime && isAvaliable === 'available'  ? active : '';
                var dateFormat = moment(tempDate).format('YYYY-MM');
                var tempToday = dateFormat === moment().format('YYYY-MM') ? ' today' : ''; // ?????????????????????
                if(this.options.disabledDate) { // ???????????????????????????????????????
                    isDisabled = moment(tempDate).endOf('month').valueOf() > moment().endOf('month').valueOf() ? ' disabled' : '';
                }
                spans += "<div class='" + minorClass.cBCBRDate + " " + isEndDate + isStartDate + isActive + tempToday + isDisabled + "' date='" + dateFormat + "'><span class='" + isAvaliable + "'>" + tempMonthText +"</span></div>";
                index ++;
            }
            row.append(spans);
            bodyContent.append(row);
        }
        body.append(bodyContent);
    }

    DatePicker.prototype.createDomBodyYear = function (body, time) {    // ????????????????????????DOM??????
        time = moment(time).startOf('year').valueOf();
       
        // ??????
        var bodyContent = $("<div class='" + minorClass.cBCBody + "'></div>");
        var index = 0;
        for(var i = 0; i < 3; i ++) {

            var row = $("<div class='" + minorClass.cBCBRow + "'></div>");
            // ?????????????????? 
            var spans = '';
            var startClass = this.options.isDouble ? ' start-date active' : ' current';
                startClass = this.selectTime[0] ? startClass : '';
            var endClass = this.options.isDouble ? ' end-date active' : '';
                endClass = this.selectTime[1] ? endClass : '';
            var active = this.options.isDouble ? ' active' : '';
       
            for(var j = 0; j < 3; j ++) {
                var isDisabled = '';
                var tempMonthText = moment(time).add(index, 'year').year() + '???';
                var tempDate = moment(time).add(index, 'year').valueOf();
                var isAvaliable = 'available';
                var startTime = moment(this.selectTime[0]).startOf('year').valueOf();   // ?????????????????????
                var endTime = moment(this.selectTime[1]).startOf('year').valueOf();     // ?????????????????????
                var isEndDate = tempDate === endTime && isAvaliable === 'available' ? endClass : '';
                var isStartDate = tempDate === startTime && isAvaliable === 'available' ? startClass : '';
                var isActive = tempDate > startTime && tempDate < endTime && isAvaliable === 'available'  ? active : '';
                var dateFormat = moment(tempDate).format('YYYY-MM');
                var tempToday = dateFormat === moment().format('YYYY-MM') ? ' today' : ''; // ?????????????????????
                if(this.options.disabledDate) { // ???????????????????????????????????????
                    isDisabled = moment(tempDate).endOf('month').valueOf() > moment().endOf('month').valueOf() ? ' disabled' : '';
                }
                spans += "<div class='" + minorClass.cBCBRDate + " " + isEndDate + isStartDate + isActive + tempToday + isDisabled + "' date='" + dateFormat + "'><span class='" + isAvaliable + "'>" + tempMonthText +"</span></div>";
                index ++;
            }
            row.append(spans);
            bodyContent.append(row);
        }
        body.append(bodyContent);
    }

    DatePicker.prototype.cutState = function () {    // ???????????????????????????  
        var nextSelect = this.calendarDoms[0].find(('.' + minorClass.cBHRNextMonth  + ',.' + minorClass.cBHRNextYear));
        var nextLeftYear = this.calendarDoms[0].find('.' + minorClass.cBHRNextYear);
        var nextRightYear = this.calendarDoms[1] && this.calendarDoms[1].find('.' + minorClass.cBHRNextYear);
        var nextRightMonth = this.calendarDoms[1] && this.calendarDoms[1].find('.' + minorClass.cBHRNextMonth);
        var nextLeftMonth = this.calendarDoms[0].find('.' + minorClass.cBHRNextMonth);
        var prevSelect = this.calendarDoms[1] && this.calendarDoms[1].find(('.' + minorClass.cBHLPrevMonth + ',.' + minorClass.cBHLPrevYear));
        var prevRightYear = this.calendarDoms[1] && this.calendarDoms[1].find('.' + minorClass.cBHLPrevYear);
        // var prevRightMonth = this.calendarDoms[1] && this.calendarDoms[1].find('.' + minorClass.cBHLPrevMonth);
        nextSelect && nextSelect.removeClass('is-disabled');
        prevSelect && prevSelect.removeClass('is-disabled');

        if(this.options.isDouble) {
            if(this.options.reportTimeType < 9) {
                if((this.options.endYear === this.options.startYear && this.options.endMonth - this.options.startMonth === 1) || (this.options.endYear - this.options.startYear === 1 && this.options.startMonth === 11 && this.options.endMonth === 0)) { // ??????????????????????????????????????????
                    nextSelect.addClass('is-disabled');
                    prevSelect.addClass('is-disabled');
                }else if((this.options.endYear === this.options.startYear && this.options.endMonth - this.options.startMonth > 1) || (this.options.endYear - this.options.startYear === 1 && this.options.endMonth === this.options.startMonth) || (this.options.endYear - this.options.startYear === 1 && this.options.endMonth < this.options.startMonth)) {
                    nextLeftYear.addClass('is-disabled');
                    prevRightYear.addClass('is-disabled');
                }
            }else {
                if(this.options.endYear - (this.options.startYear + this.reportEndYear) === this.reportStartYear) {
                    nextLeftYear.addClass('is-disabled');
                    prevRightYear.addClass('is-disabled');
                }
            }

            if(this.options.disabledDate) {
                nextRightYear.removeClass('is-disabled');
                nextRightMonth.removeClass('is-disabled');
                if(this.reportTimeType < 7) {
                    if(moment().month() === this.options.endMonth && moment().year() === this.options.endYear) {
                        nextRightYear.addClass('is-disabled');
                        nextRightMonth.addClass('is-disabled');
                    }else if((moment().year() === this.options.endYear && moment().month() > this.options.endMonth) || (moment().year() - this.options.endYear === 1 && moment().month() < this.options.endMonth)) {
                        nextRightYear.addClass('is-disabled');
                    }
                }else if(this.reportTimeType < 9){
                    if(this.options.endYear === moment().year()) {
                        nextRightYear.addClass('is-disabled');
                    }
                }else if(this.reportTimeType === 9) {
                    if(this.options.endYear + 9 === moment().year() + 5) {
                        nextRightYear.addClass('is-disabled');
                    }
                }
            }

        }else {
            nextLeftYear.removeClass('is-disabled');
            nextLeftMonth.removeClass('is-disabled');
            if(this.options.disabledDate) { 
                if(this.reportTimeType < 7) {
                    if(this.options.startMonth === moment().month() && this.options.startYear === moment().year()) {
                        nextLeftYear.addClass('is-disabled');
                        nextLeftMonth.addClass('is-disabled');
                    }else if((moment().year() === this.options.startYear && moment().month() > this.options.startMonth) || (moment().year() - this.options.startYear === 1 && moment().month() < this.options.startMonth)) {
                        nextLeftYear.addClass('is-disabled');
                    }
                }else if(this.reportTimeType < 9) {
                    if(this.options.startYear === moment().year()) {
                        nextLeftYear.addClass('is-disabled');
                    }
                }else if(this.reportTimeType === 9) {
                    if(this.options.startYear + 9 === moment().year() + 5) {
                        nextLeftYear.addClass('is-disabled');
                    }
                }
            }
        }
    }

    DatePicker.prototype.createDomBodyHours = function (dom, time) {    // ?????????????????????Dom??????
        var placeholder = dom.attr('name-text').split(',');
        var tempHtml = '<div class="'+minorClass.cHLeft+'"><input placeholder="'+placeholder[0]+'" class="hours-input '+minorClass.cHLInput+'"></input></div><div class="'+minorClass.cHRight+'"><input placeholder="'+placeholder[1]+'" class="hours-input '+minorClass.cHRInput+'"></input></div>';
        dom.append(tempHtml);
    }

    DatePicker.prototype.createFastDom = function () {  // ??????????????????Dom??????
        var fastUl = $('<ul class="' + firstClass.dCFUl + '"></ul>');

        var lis = '';
        var time = this.options.fastTime;
        for(var prop in time) {
            var startTime = time[prop].startTime;
            var endTime = time[prop].endTime;
            lis += '<li class="' + firstClass.dCFULi + '" start-time="' + startTime + '" end-time="' + endTime + '">'+prop+'</li>';
        }
        fastUl.append(lis);
        $(this.container).find('.' + firstClass.dCFast).append(fastUl);
    }

    DatePicker.prototype.createFooterDom = function () {    // ????????????DOM
        if(this.options.reportTimeType === 4) {
            var bottom = $(this.container).find('.' + firstClass.dBottom);
            bottom.append('<div class="'+firstClass.dBBtn+'"><span class="'+firstClass.dBBCancel+'">??????</span><span class="'+firstClass.dBBConfirm+' is-disabled">??????</span></div>');
        }
    }

    DatePicker.prototype.createHoursPullDown = function (node, time, index) {    // ???????????????????????????
        var dom = $(node).find('.' + minorClass.cHRPull);
        if(!dom.length) {
            var wrap = $('<div class="'+minorClass.cHRPull+'"></div>');
            node.find('.' + minorClass.cHRight).append(wrap);

            var wrapContent = $('<div class="'+minorClass.cHRPContent+'"></div>');
            var wrapFooter = $('<div class="'+minorClass.cHRPFooter+'"></div>');
            var wrapHours = $('<div class="'+minorClass.cHRPCHours+'"></div>');
            var wrapHoursUl = $('<ul class="'+minorClass.cHRPHUl+'"></ul>');
            var wrapMinute = $('<div class="'+minorClass.cHRPCMinute+'"></div>');
            var wrapMinuteUl = $('<ul class="'+minorClass.cHRPMUl+'"></ul>');
            var wrapSecond = $('<div class="'+minorClass.cHRPCSecond+'"></div>');
            var wrapSecondUl = $('<ul class="'+minorClass.cHRPSUl+'"></ul>');

            var hour = moment(time).format("HH");
            var minute = moment(time).format('mm');
            var second = moment(time).format('ss');
            
            var hourLis = '';
            var hScrollTop = 0;
            for(var i = 0; i < 24; i ++) {
                var num = i;
                    num = num <= 9 ? '0' + num : num;
                var active = String(hour) === String(num) ? 'active' : '';
                    if(active) {
                        hScrollTop = num * 28;
                    }
                hourLis += '<li class="' + active + '" text="' + num + '">'+ num +'</li>';
            }

            var minuteLis = '';
            var mScrollTop = 0;
            for(var i = 0; i < 60; i ++) {
                var num = i;
                    num = num <= 9 ? '0' + num : num;
                var active = String(minute) === String(num) ? 'active' : '';
                if(active) {
                    mScrollTop = num * 28;
                }
                minuteLis += '<li class="' + active + '" text="' + num + '">'+ num +'</li>';
            }

            var secondLis = '';
            var sScrollTop = 0;
            for(var i = 0; i < 60; i ++) {
                var num = i;
                    num = num <= 9 ? '0' + num : num;
                var active = String(second) === String(num) ? 'active' : '';
                if(active) {
                    sScrollTop = num * 28;
                }
                secondLis += '<li class="' + active + '" text="' + num + '">'+ num +'</li>';
            }

            // ????????????
            wrapFooter.append('<span class="'+minorClass.cHRPFCancel+'">??????</span><span class="'+minorClass.cHRPFConfirm+'">??????</span>');

            wrapHoursUl.append(hourLis);
            wrapMinuteUl.append(minuteLis);
            wrapSecondUl.append(secondLis);
            wrapHours.append(wrapHoursUl);
            wrapMinute.append(wrapMinuteUl);
            wrapSecond.append(wrapSecondUl);
            wrapContent.append(wrapHours).append(wrapMinute).append(wrapSecond);
            wrap.append(wrapContent).append(wrapFooter);
            wrapHoursUl.scrollTop(hScrollTop);
            wrapMinuteUl.scrollTop(mScrollTop);
            wrapSecondUl.scrollTop(sScrollTop);

            this.bindPullDown(wrap, time, index);
        }else {
            
            if(dom.hasClass('hide')) {
                dom.removeClass('hide');
                this.changePullDonwTime(node.find('.' + minorClass.cHRPContent + ' ul'), time); 
            }
        }
    }

    DatePicker.prototype.calendarRender = function (dom, time) {
        this.resetTime();
        this.cutState();
        dom && this.setHeaderText(dom, time);
        dom && this.createBodyDom(dom, time);
        this.bindEventBodyDay();
    }

    DatePicker.prototype.changePullDonwTime = function (ul, time) { // ?????????????????????????????????
        var hour = moment(time).format('HH');
        var minute = moment(time).format('mm');
        var second = moment(time).format('ss');
        $.each(ul, function (index, item) {
            if($(item).hasClass(minorClass.cHRPHUl)) {
                $(this).children('[text="' + hour + '"]').addClass('active').siblings().removeClass('active');
                $(this).scrollTop(hour * 28);
            }else if($(item).hasClass(minorClass.cHRPMUl)){
                $(this).children('[text="' + minute + '"]').addClass('active').siblings().removeClass('active');
                $(this).scrollTop(minute * 28);
            }else if($(item).hasClass(minorClass.cHRPSUl)) {
                $(this).children('[text="' + second + '"]').addClass('active').siblings().removeClass('active');
                $(this).scrollTop(second * 28);
            }
        });
    }

    DatePicker.prototype.bindPullDown = function (wrap, time, index) {   // ??????????????????????????????
        var _this = this;
        var tempHours = [];
        wrap.find('ul > li').on('click', function () {  // ????????????????????????
            if($(this).hasClass('active')) {
                return;
            }
            var num = $(this).text() * $(this).outerHeight();
            $(this).addClass('active').siblings().removeClass('active');
            $(this).parent().scrollTop(num);

            var liActives = wrap.find('li.active');
                tempHours = [];
            $.each(liActives, function (index, item) {
                tempHours.push($(item).text());
            });
            var value = tempHours.join(':');
            wrap.prev().val(value);
        });

        var timer = null;
        wrap.find('ul').scroll(function () {    // ????????????????????????
            var that = this;
            var top = $(this).scrollTop();
            var value = top / 28;
            var remainder =  top % 28;
            var num = remainder === 0 ? value : remainder > 14 ? (top + remainder) / 28 : (top - remainder) / 28;
                num = Number(num.toFixed(0));
                num = num <= 9 ? '0' + num : num;
            $(this).children('[text="' + num + '"]').addClass('active').siblings().removeClass('active');
            timer && clearTimeout(timer);
            timer = setTimeout(function () {
                var top = num * $(that).children().height();
                    top = top > ($(that).children('li:last').text() * 28) ? ($(that).children("li:last").text() * 28) : top;
                $(that).scrollTop(top);
                timer = null;
            }, 300);

            var liActives = wrap.find('li.active');
            tempHours = [];
            $.each(liActives, function (index, item) {
                tempHours.push($(item).text());
            });
            var value = tempHours.join(':');
            wrap.prev().val(value);
            

            // ??????????????????????????????????????????
            var tempTime = moment(moment(time).format('YYYY-MM-DD ') + value).valueOf();
            if(index === 0) {
                if(tempTime > _this.selectTime[1]) {
                    _this.selectTime[1] = tempTime;
                    _this.hourDoms[1] && _this.hourDoms[1].find('.' + minorClass.cHRInput).val(moment(_this.selectTime[1]).format("HH:mm:ss"));
                }
            }else if(index === 1) {
                if(tempTime < _this.selectTime[0]) {
                    _this.selectTime[0] = tempTime;
                    _this.hourDoms[0].find('.' + minorClass.cHRInput).val(moment(_this.selectTime[0]).format("HH:mm:ss"));

                }
            }
        });

        wrap.find('.' + minorClass.cHRPFCancel).on('click', function () {   // ????????????????????????
            wrap.addClass('hide');
            var value = moment(_this.selectTime[index]).format('HH:mm:ss');
            wrap.prev().val(value);
        });

        wrap.find('.' + minorClass.cHRPFConfirm).on('click', function () {   // ????????????????????????
            _this.selectTime[index] = moment(moment(time).format('YYYY-MM-DD ') + tempHours.join(':')).valueOf(); 
            wrap.addClass('hide');
        });

        $(document).on('click', function (e) {   // ?????????????????????
            var target = e.target;
            if(!$(target).hasClass(minorClass.cHRInput) && !$(target).parents('.' + minorClass.cHRPull).length) {
                wrap.addClass('hide');
                var value = moment(_this.selectTime[index]).format('HH:mm:ss');
                wrap.prev().val(value);
            }
        });
    }

    DatePicker.prototype.bindEvent = function () {  // ????????????
        var _this = this;

        var type = _this.options.reportTimeType;
        switch(type) {
            case 4:
                this.bindEventCut();    
                this.bindEventFast();
                this.bindEventFooter();
                this.bindEventBodyDay();
                break;
            case 5:
                this.bindEventCut();
                this.bindEventFast();
                this.bindEventBodyDay();
                break;
            case 6:
                this.bindEventCut();
                this.bindEventFast();
                this.bindEventBodyDay();
                break;
            case 7:
                this.bindEventCut();
                this.bindEventFast();
                this.bindEventBodyDay();
                break;
            case 8:
                this.bindEventCut();
                this.bindEventFast();
                this.bindEventBodyDay();
                break;
            case 9:
                this.bindEventCut();
                this.bindEventFast();
                this.bindEventBodyDay();
                break;
        }
        
    }

    DatePicker.prototype.bindEventFooter = function () {    // ??????????????????
        var _this = this;

        // ???????????????
        _this.container.find('.' + firstClass.dBBConfirm).on('click', function () {
            if(!$(this).hasClass('is-disabled')) {
                var startTime = moment(_this.selectTime[0]).format(_this.options.format);
                var endTime = moment(_this.selectTime[1]).format(_this.options.format);
                _this.options.startDom.val(startTime);

                _this.options.isDouble ? _this.options.endDom.val(endTime) : _this.options.endDom.val(startTime);
                typeof _this.options.yes === 'function' && _this.options.yes(startTime, endTime);
                _this.container.addClass('hide');
            }
        });

        // ???????????????
        _this.container.find('.' + firstClass.dBBCancel).on('click', function () {
            _this.options.startDom.val('')
            _this.options.endDom.val('');
            _this.container.remove();
        });
    }

    DatePicker.prototype.bindEventFast = function () {  // ???????????????????????????
        var _this = this;
        $(this.container).find('.' + firstClass.dCFULi).on('click', function () {
            var startTime = $(this).attr('start-time');
            var startYear = moment(startTime).year();
            var startMonth = moment(startTime).month();
            var endTime = $(this).attr('end-time');
            var endYear = moment(endTime).year();
            var endMonth = moment(endTime).month();
            var startDay = moment(startTime).format('YYYY-MM-DD');
            var startHours = moment(startTime).format('HH:mm:ss');
            var endDay = moment(endTime).format('YYYY-MM-DD');
            var endHours = moment(endTime).format('HH:mm:ss');
            var startFormat = 'YYYY-MM-DD HH:mm:ss';
            var endFormat = 'YYYY-MM-DD HH:mm:ss';
            var startName = 'YYYY-MM-DD HH:mm:ss';
            var endName = 'YYYY-MM-DD HH:mm:ss';

            var dayTime = moment(startTime).valueOf();
            var dayTime2 = moment(endTime).valueOf();

            _this.selectTime[0] = dayTime;
            _this.selectTime[1] = dayTime2 || (_this.reportTimeType === 6 && moment(_this.selectTime[0]).endOf('week').valueOf());

            switch(_this.reportTimeType) {
                case 4: // ???
                    if(startYear === endYear && endMonth === startMonth) {
                        var tempData = _this.options.isDouble ? _this.subtractTime(_this.selectTime[0], 'month') : _this.selectTime[0];
                        _this.options.startTime = tempData;
                        _this.options.endTime = _this.selectTime[0];
                        _this.calendarRender(_this.calendarDoms[0], tempData);
                        _this.calendarRender(_this.calendarDoms[1], _this.selectTime[0]);
                    }else {
                        _this.options.startTime = dayTime;
                        _this.options.endTime = dayTime2;
                        _this.calendarRender(_this.calendarDoms[0], _this.selectTime[0]);
                        _this.calendarRender(_this.calendarDoms[1], _this.selectTime[1]);
                    }
                    _this.hourDoms[0].find('.' + minorClass.cHLInput).val(startDay);
                    _this.hourDoms[0].find('.' + minorClass.cHRInput).val(startHours);
                    _this.hourDoms[1] && _this.hourDoms[1].find('.' + minorClass.cHLInput).val(endDay);
                    _this.hourDoms[1] && _this.hourDoms[1].find('.' + minorClass.cHRInput).val(endHours);
                    $(_this.container).find('.' + firstClass.dBBConfirm).removeClass('is-disabled');
                    break;
                case 5: // ???
                    if(startYear === endYear && endMonth === startMonth) {
                        var tempData = _this.options.isDouble ? _this.subtractTime(_this.selectTime[0], 'month') : _this.selectTime[0];
                        _this.options.startTime = tempData;
                        _this.options.endTime = _this.selectTime[0];
                        _this.calendarRender(_this.calendarDoms[0], tempData);
                        _this.calendarRender(_this.calendarDoms[1], _this.selectTime[0]);
                    }else {
                        _this.options.startTime = dayTime;
                        _this.options.endTime = dayTime2;
                        _this.calendarRender(_this.calendarDoms[0], _this.selectTime[0]);
                        _this.calendarRender(_this.calendarDoms[1], _this.selectTime[1]);
                    }
                    startFormat = 'YYYY-MM-DD';
                    endFormat = 'YYYY-MM-DD';
                    break;
                case 6: // ???

                    if(startYear === endYear && endMonth === startMonth) {
                        var tempData = _this.options.isDouble ? _this.subtractTime(_this.selectTime[0], 'month') : _this.selectTime[0];
                        _this.options.startTime = tempData;
                        _this.options.endTime = _this.selectTime[0];
                        _this.calendarRender(_this.calendarDoms[0], tempData);
                        _this.calendarRender(_this.calendarDoms[1], _this.selectTime[0]);
                    }else {
                        _this.options.startTime = dayTime;
                        _this.options.endTime = dayTime2;
                        _this.calendarRender(_this.calendarDoms[0], _this.selectTime[0]);
                        _this.calendarRender(_this.calendarDoms[1], _this.selectTime[1]);
                    }
                    startFormat = 'YYYY ???';
                    endFormat = 'YYYY ???';
                    break;
                case 7: // ???
                    if(endYear === startYear) {
                        var tempData = _this.subtractTime(_this.selectTime[0], 'year');
                        _this.options.startTime = tempData;
                        _this.options.endTime = _this.selectTime[0];
                        _this.calendarRender(_this.calendarDoms[0], tempData);
                        _this.calendarRender(_this.calendarDoms[1], _this.selectTime[0]);
                    }else {
                        _this.options.startTime = dayTime;
                        _this.options.endTime = dayTime2;
                        _this.calendarRender(_this.calendarDoms[0], _this.selectTime[0]);
                        _this.calendarRender(_this.calendarDoms[1], _this.selectTime[1]);
                    }
                    startFormat = 'YYYY-MM ';
                    endFormat = 'YYYY-MM ';
                    break;
                case 8: // ???
                    if(endYear === startYear) {
                        var tempData = _this.subtractTime(_this.selectTime[0], 'year');
                        _this.options.startTime = tempData;
                        _this.options.endTime = _this.selectTime[0];
                        _this.calendarRender(_this.calendarDoms[0], tempData);
                        _this.calendarRender(_this.calendarDoms[1], _this.selectTime[0]);
                    }else {
            

                        _this.options.startTime = dayTime;
                        _this.options.endTime = dayTime2;
                        _this.calendarRender(_this.calendarDoms[0], _this.selectTime[0]);
                        _this.calendarRender(_this.calendarDoms[1], _this.selectTime[1]);
                    }
                    startFormat = 'YYYY ??? ';
                    endFormat = 'YYYY ??? ';
                    break;
                case 9: // ???
                    if(endYear - startYear < 9) {
                        if(startYear < _this.options.startYear) {
                            _this.options.startTime = _this.date[0];
                            _this.options.endTime = _this.date[1];
                           var num = Math.ceil((_this.options.startYear - startYear) / 9) * 9;
                           _this.options.startTime = moment(_this.options.startTime).subtract(num, 'year').valueOf();
                           _this.options.endTime = moment(_this.options.startTime).add(num, 'year').valueOf()
                           _this.calendarRender(_this.calendarDoms[0], _this.options.startTime);
                           _this.calendarRender(_this.calendarDoms[1], _this.options.endTime);
                        }else {
                            _this.options.startTime = _this.date[0];
                            var tempData = _this.addTime(_this.options.startTime, 'year', 9);
                            _this.options.endTime = tempData;
                            _this.calendarRender(_this.calendarDoms[0], _this.options.startTime);
                            _this.calendarRender(_this.calendarDoms[1], tempData);
                        }
                    }else {
                        var num = Math.ceil((_this.options.startYear - startYear) / 9) * 9;
                        _this.options.startTime = moment(_this.options.startTime).subtract(num, 'year').valueOf();
                        _this.calendarRender(_this.calendarDoms[0], _this.options.startTime);
                        _this.calendarRender(_this.calendarDoms[1], _this.options.endTime);
                    }
                    startFormat = 'YYYY';
                    endFormat = 'YYYY';
                    break;
            }

            // ??????
            var startTimeVal = _this.options.isDouble ? moment(_this.selectTime[0]).format(startFormat) : moment(_this.selectTime[0]).startOf(_this.type[_this.reportTimeType]).format(startFormat);
                  startTimeVal = _this.reportTimeType === 6 ? startTimeVal + moment(_this.selectTime[0]).week() + ' ???' : startTimeVal;
                  startTimeVal = _this.reportTimeType === 8 ? startTimeVal + moment(_this.selectTime[0]).quarter() + ' ??????' : startTimeVal;
              var endTimeVal = _this.options.isDouble ? moment(_this.selectTime[1]).format(endFormat) : moment(_this.selectTime[0]).endOf(_this.type[_this.reportTimeType]).format(endFormat);
                  endTimeVal = _this.reportTimeType === 6 ? endTimeVal + moment((_this.selectTime[1] || _this.selectTime[0])).week() + ' ???' : endTimeVal;
                  endTimeVal = _this.reportTimeType === 8 ? endTimeVal + moment((_this.selectTime[1] || _this.selectTime[0])).quarter() + ' ??????' : endTimeVal;
              var startTimeName = _this.options.isDouble ? moment(_this.selectTime[0]).startOf(_this.type[_this.reportTimeType]).format(startName) : moment(_this.selectTime[0]).startOf(_this.type[_this.reportTimeType]).format(startName);
              var endTimeName = _this.options.isDouble ? moment(_this.selectTime[1]).endOf(_this.type[_this.reportTimeType]).format(endName) : moment(_this.selectTime[0]).endOf(_this.type[_this.reportTimeType]).format(endName);
              _this.options.startDom.val(startTimeVal);
              _this.options.endDom.val(endTimeVal);
              _this.options.startDom.attr('sdtDate', startTimeName);
              _this.options.endDom.attr('edtDate', endTimeName);
              typeof _this.options.yes === 'function' && _this.options.yes(startTimeName, endTimeName);
              $(_this.container).addClass('hide');
        });
    }

    DatePicker.prototype.bindEventBodyDay = function () {   // ???????????????????????????
        var _this = this;
        var className = '.' + minorClass.cBCBRDate;
        var classNameSelect = '.' + minorClass.cBCBRDate + '.active';
        var classNameStartTime= '.'+ minorClass.cBCBRDate + '.start-date';
        var classNameEndTime= '.'+ minorClass.cBCBRDate + '.end-date';
        var $rows = $(this.container).find(className);
        var startFormat = 'YYYY-MM-DD HH:mm:ss';
        var endFormat = 'YYYY-MM-DD HH:mm:ss';
        var startName = 'YYYY-MM-DD HH:mm:ss';
        var endName = 'YYYY-MM-DD HH:mm:ss';

        if(_this.options.isDouble) {
            $rows.off('click').on('click', function () {
                if($(this).hasClass('disabled')) {
                    return;
                }
                if(!_this.selectTime[0]) {  // ???????????????
                    var date = $(this).parent('[title]').children(':first').attr('date') || $(this).attr('date'); // ?????????
                    var time = moment({y: moment(date).year(), M: moment(date).month(), d: moment(date).date()}).valueOf();
                    var timeFormatDay = moment({y: moment(date).year(), M: moment(date).month(), d: moment(date).date()}).format('YYYY-MM-DD');
                    var timeFormatHours = moment({y: moment(date).year(), M: moment(date).month(), d: moment(date).date()}).format('00:00:00');

                    _this.selectTime[0] = time;
                    var firstDom = "[date='" + date + "']";
                    _this.selectDom[0] = $(_this.container).find(firstDom).children(':not(.prev-month, .next-month)').parent();
                    _this.selectDom[0].addClass('start-date');
                    _this.container.find('.' + minorClass.cHLInput).val(timeFormatDay);
                    _this.container.find('.'+ minorClass.cHRInput).val(timeFormatHours);
                    _this.container.find('.hours-input').attr('disabled', 'disabled');
                    _this.container.find('.' + firstClass.dBBConfirm).addClass('is-disabled');
                }else if(!_this.selectTime[1]) {    // ???????????????

                    var date = $(this).parent('[title]').children(':last').attr('date') ||  $(this).attr('date'); // ?????????
                    var time = moment({y: moment(date).year(), M: moment(date).month(), d: moment(date).date()}).valueOf();
                    var timeFormatDay = moment({y: moment(date).year(), M: moment(date).month(), d: moment(date).date()}).format('YYYY-MM-DD');
                    var timeFormatHours = moment({y: moment(date).year(), M: moment(date).month(), d: moment(date).date()}).format('00:00:00');

                    _this.selectTime[1] = moment(time).valueOf();
                    var firstDom = "[date='" + date + "']";
                    _this.selectDom[1] = $(_this.container).find(firstDom).children(':not(.prev-month, .next-month)').parent();
                    if(_this.selectTime[0] <= time) {
                        _this.selectDom[1].addClass('end-date');
                        switch(_this.reportTimeType) {
                            case 4: // ???
                                _this.hourDoms[1].find('.' + minorClass.cHLInput).val(timeFormatDay);
                                _this.hourDoms[1].find('.' + minorClass.cHRInput).val(timeFormatHours);
                                if(_this.selectTime[0] === time) {
                                    _this.hourDoms[1].find('.' + minorClass.cHRInput).val('23:00:00');
                                }
                                break;
                            case 5: // ???
                                startFormat = 'YYYY-MM-DD';
                                endFormat = 'YYYY-MM-DD';
                                break;
                            case 6: // ???
                                _this.selectDom[1].prevAll().addClass('active');
                                startFormat = 'YYYY ???';
                                endFormat = 'YYYY ???';
                                break;
                            case 7: // ???
                                _this.selectTime[1] = moment(_this.selectTime[1]).endOf('month').valueOf();
                                startFormat = 'YYYY-MM ';
                                endFormat = 'YYYY-MM ';
                                break;
                            case 8: // ???
                                _this.selectTime[1] = moment(_this.selectTime[1]).endOf('quarter').valueOf();
                                startFormat = 'YYYY ??? ';
                                endFormat = 'YYYY ??? ';
                                break;
                            case 9: // ???
                                _this.selectTime[1] = moment(_this.selectTime[1]).endOf('year').valueOf();

                                startFormat = 'YYYY';
                                endFormat = 'YYYY';
                                break;
                        }
                  
                    }else {
                        switch(_this.reportTimeType) {
                            case 4: // ???
                                _this.hourDoms[0].find('.' + minorClass.cHLInput).val(timeFormatDay);
                                _this.hourDoms[0].find('.' + minorClass.cHRInput).val(timeFormatHours);
                                break;
                            case 5: // ???
                                startFormat = 'YYYY-MM-DD';
                                endFormat = 'YYYY-MM-DD';
                                break;
                            case 6: // ???
                                _this.selectDom[1].siblings().removeClass('start-date');
                                _this.selectDom[0].removeClass('end-date');
                                _this.selectDom[1] = _this.selectDom[1].parent().children(':first').addClass('start-date');
                                _this.selectDom[0] = _this.selectDom[0].parent().children(':last').addClass('end-date');
                                _this.selectTime[0] = _this.selectDom[0].parent().children(':last').attr('date');
                                _this.selectTime[1] = _this.selectDom[1].parent().children(':first').attr('date');
                                _this.selectDom[1].nextAll().addClass('active');
                                _this.selectDom[0].prevAll().addClass('active');
                                startFormat = 'YYYY ???';
                                endFormat = 'YYYY ???';
                                break;
                            case 7: // ???
                                _this.selectTime[0] = moment(_this.selectTime[0]).endOf('month').valueOf();

                                startFormat = 'YYYY-MM ';
                                endFormat = 'YYYY-MM ';
                            case 8: // ???
                                _this.selectTime[0] = moment(_this.selectTime[0]).endOf('quarter').valueOf();
                                startFormat = 'YYYY ??? ';
                                endFormat = 'YYYY ??? ';
                                break;
                            case 9: // ???
                                _this.selectTime[0] = moment(_this.selectTime[0]).endOf('year').valueOf();
                                startFormat = 'YYYY';
                                endFormat = 'YYYY';
                                break;
                        }
                        _this.selectDom.reverse();
                        _this.selectTime.reverse();
                    }
                    _this.container.find('.hours-input').removeAttr('disabled', 'disabled');
                    _this.container.find('.' + firstClass.dBBConfirm).removeClass('is-disabled');

                    // ??????
                    var startTimeVal = _this.options.isDouble ? moment(_this.selectTime[0]).format(startFormat) : moment(_this.selectTime[0]).startOf(_this.type[_this.reportTimeType]).format(startFormat);
                        startTimeVal = _this.reportTimeType === 6 ? startTimeVal + moment(_this.selectTime[0]).week() + ' ???' : startTimeVal;
                        startTimeVal = _this.reportTimeType === 8 ? startTimeVal + moment(_this.selectTime[0]).quarter() + ' ??????' : startTimeVal;
                    var endTimeVal = _this.options.isDouble ? moment(_this.selectTime[1]).format(endFormat) : moment(_this.selectTime[0]).endOf(_this.type[_this.reportTimeType]).format(endFormat);
                        endTimeVal = _this.reportTimeType === 6 ? endTimeVal + moment((_this.selectTime[1] || _this.selectTime[0])).week() + ' ???' : endTimeVal;
                        endTimeVal = _this.reportTimeType === 8 ? endTimeVal + moment((_this.selectTime[1] || _this.selectTime[0])).quarter() + ' ??????' : endTimeVal;
                    var startTimeName = _this.options.isDouble ? moment(_this.selectTime[0]).startOf(_this.type[_this.reportTimeType]).format(startName) : moment(_this.selectTime[0]).startOf(_this.type[_this.reportTimeType]).format(startName);
                    var endTimeName = _this.options.isDouble ? moment(_this.selectTime[1]).endOf(_this.type[_this.reportTimeType]).format(endName) : moment(_this.selectTime[0]).endOf(_this.type[_this.reportTimeType]).format(endName);
                    _this.options.startDom.val(startTimeVal);
                    _this.options.endDom.val(endTimeVal);
                    _this.options.startDom.attr('sdtDate', startTimeName);
                    _this.options.endDom.attr('edtDate', endTimeName);
                    typeof _this.options.yes === 'function' && _this.options.yes(startTimeName, endTimeName);
                   _this.options.reportTimeType !== 4 && $(_this.container).addClass('hide');
                }else {
                    var date = $(this).parent('[title]').children(':first').attr('date') || $(this).attr('date'); // ?????????
                    var time = moment({y: moment(date).year(), M: moment(date).month(), d: moment(date).date()}).valueOf();
                    var timeFormatDay = moment({y: moment(date).year(), M: moment(date).month(), d: moment(date).date()}).format('YYYY-MM-DD');
                    var timeFormatHours = moment({y: moment(date).year(), M: moment(date).month(), d: moment(date).date()}).format('00:00:00');

                    _this.selectTime = [];
                    _this.selectDom = [];
                    $(_this.container).find(className).removeClass('start-date').removeClass('end-date').removeClass('active');
    
                    _this.selectTime[0] = time;
                    var firstDom = "[date='" + date + "']";
                    _this.selectDom[0] = $(_this.container).find(firstDom).children(':not(.prev-month, .next-month)').parent();
                    _this.selectDom[0].addClass('start-date');
                    _this.container.find('.' + minorClass.cHLInput).val(timeFormatDay);
                    _this.container.find('.'+ minorClass.cHRInput).val(timeFormatHours);
                    _this.container.find('.hours-input').attr('disabled', 'disabled');
                    _this.container.find('.' + firstClass.dBBConfirm).addClass('is-disabled');
                }
            });

            $rows.off('mouseenter').on('mouseenter', function () {
                if(_this.selectTime[1] || $(this).hasClass('disabled')) {    // ????????????????????????????????????
                    return;
                }
                var startTime = _this.selectTime[0];
                var nowDate = $(this).attr('date');
                var nowTime = moment({y: moment(nowDate).year(), M: moment(nowDate).month(), d: moment(nowDate).date()}).valueOf();
                
                if(_this.selectTime[0]) {  // ???????????????????????????
                    $(_this.container).find(classNameSelect).removeClass('active'); // ???????????????????????????????????????
                    $(_this.container).find(classNameStartTime + ',' + classNameEndTime).removeClass('start-date').removeClass('end-date'); // ????????????????????????
                    if(_this.selectTime[0] < nowTime) {
                        $(_this.container).find(classNameEndTime).removeClass('end-date'); // ????????????????????????
                        if(!_this.selectDom[0].hasClass('start-date')) {
                            _this.selectDom[0].addClass('start-date').removeClass('end-date');
                        }
                        !$(this).children('.next-month, .prev-month').length && _this.options.reportTimeType !== 6 && $(this).addClass('end-date');
                    }else {
                        if(!_this.selectDom[0].hasClass('end-date')) {
                            _this.selectDom[0].addClass('end-date').removeClass('start-date');
                        }
                        !$(this).children('.next-month, .prev-month').length && _this.options.reportTimeType !== 6 && $(this).addClass('start-date'); 
                    }

                    // ??????????????????dom???
                    $.each($rows, function (index, item) {
                        var date = $(item).attr('date');
                        var time = moment({y: moment(date).year(), M: moment(date).month(), d: moment(date).date()}).valueOf();
                        if(startTime < nowTime && time <= nowTime && time > startTime && !$(this).children('span.next-month, span.prev-month').length) {
                            $(item).addClass('active');
                            if(time === nowTime) {  
                                if(_this.options.reportTimeType !== 6) {
                                    $(item).addClass('end-date');
                                }else {
                                    !$(item).parent().children(':last').children('span.next-month, span.prev-month').length && $(item).parent().children(':last').addClass('end-date');
                                }
                            }
                        }else if(startTime >= nowTime && time >= nowTime && time < startTime && !$(this).children('span.next-month, span.prev-month').length){
                            $(item).addClass('active');
                            if(time === nowTime) {  
                                if(_this.options.reportTimeType !== 6) {
                                    $(item).addClass('start-date');
                                }else {
                                    $(item).parent().children(':first').addClass('start-date');
                                }
                            }
                        }
                    });

                }
            });
        }else {
            $rows.off('click').on('click', function () {    // ???????????????
                if($(this).hasClass('disabled')) {
                    return;
                }
                var date = $(this).attr('date');
                var time = moment({y: moment(date).year(), M: moment(date).month(), d: moment(date).date()}).valueOf();
                var timeFormatDay = moment({y: moment(date).year(), M: moment(date).month(), d: moment(date).date()}).format('YYYY-MM-DD');
                var timeFormatHours = moment({y: moment(date).year(), M: moment(date).month(), d: moment(date).date()}).format('HH:mm:ss');

                if(_this.options.reportTimeType === 6) {
                    $rows.removeClass('start-date').removeClass('end-date').removeClass('active');
                    $(this).parent().children(':first').addClass('start-date');    
                    $(this).parent().children(':first').nextAll().addClass('active');
                    $(this).parent().children(':last').addClass('end-date');    
                    _this.selectTime[0] = $(this).parent().children(':first').attr('date');
                    _this.selectTime[1] = $(this).parent().children(':last').attr('date');
                }else {
                    $rows.removeClass('current');
                    $(this).addClass('current');    
                    _this.selectTime[0] = time;
                    _this.selectTime[1] = time;
                    if(_this.options.reportTimeType === 7) {
                        _this.selectTime[1] = moment(_this.selectTime[1]).endOf('month').valueOf();
                    }else if(_this.options.reportTimeType === 8) {
                        _this.selectTime[1] = moment(_this.selectTime[1]).endOf('quarter').valueOf();
                    }
                }


                switch(_this.reportTimeType) {
                    case 4: // ???
                        _this.container.find('.' + firstClass.dBBConfirm).removeClass('is-disabled');
                        _this.container.find('.' + minorClass.cHLInput).val(timeFormatDay);
                        _this.container.find('.'+ minorClass.cHRInput).val(timeFormatHours);
                        break;
                    case 5: // ???
                        startFormat = 'YYYY-MM-DD';
                        endFormat = 'YYYY-MM-DD';
                        break;
                    case 6: // ???
                        startFormat = 'YYYY ???';
                        endFormat = 'YYYY ???';
                        break;
                    case 7: // ???
                        startFormat = 'YYYY-MM ';
                        endFormat = 'YYYY-MM ';
                        break;
                    case 8: // ???
                        startFormat = 'YYYY ??? ';
                        endFormat = 'YYYY ??? ';
                        break;
                    case 9: // ???
                        startFormat = 'YYYY';
                        endFormat = 'YYYY';
                        break;
                }

                // ??????
                var startTimeVal = _this.options.isDouble ? moment(_this.selectTime[0]).format(startFormat) : moment(_this.selectTime[0]).startOf(_this.type[_this.reportTimeType]).format(startFormat);
                    startTimeVal = _this.reportTimeType === 6 ? startTimeVal + moment(_this.selectTime[0]).week() + ' ???' : startTimeVal;
                    startTimeVal = _this.reportTimeType === 8 ? startTimeVal + moment(_this.selectTime[0]).quarter() + ' ??????' : startTimeVal;
                var endTimeVal = _this.options.isDouble ? moment(_this.selectTime[1]).format(endFormat) : moment(_this.selectTime[0]).endOf(_this.type[_this.reportTimeType]).format(endFormat);
                    endTimeVal = _this.reportTimeType === 6 ? endTimeVal + moment((_this.selectTime[1] || _this.selectTime[0])).week() + ' ???' : endTimeVal;
                    endTimeVal = _this.reportTimeType === 8 ? endTimeVal + moment((_this.selectTime[1] || _this.selectTime[0])).quarter() + ' ??????' : endTimeVal;
                var startTimeName = _this.options.isDouble ? moment(_this.selectTime[0]).startOf(_this.type[_this.reportTimeType]).format(startName) : moment(_this.selectTime[0]).startOf(_this.type[_this.reportTimeType]).format(startName);
                var endTimeName = _this.options.isDouble ? moment(_this.selectTime[1]).endOf(_this.type[_this.reportTimeType]).format(endName) : moment(_this.selectTime[0]).endOf(_this.type[_this.reportTimeType]).format(endName);
                _this.options.startDom.val(startTimeVal);
                _this.options.endDom.val(endTimeVal);
                _this.options.startDom.attr('sdtDate', startTimeName);
                _this.options.endDom.attr('edtDate', endTimeName);
                typeof _this.options.yes === 'function' && _this.options.yes(startTimeName, endTimeName);
                _this.options.reportTimeType !== 4 && $(_this.container).addClass('hide');

            });
        }

    
    }

    DatePicker.prototype.bindEventCut = function () { // ????????????
        var _this = this;
        if(this.options.isDouble) {

            // ????????????
            this.calendarDoms[0].find('.' + minorClass.cBHLPrevYear).on('click', function () {    // ????????????????????????
                _this.options.startTime = _this.subtractTime(_this.options.startTime, 'year');
                _this.calendarRender(_this.calendarDoms[0], _this.options.startTime);
            });

            this.calendarDoms[0].find('.' + minorClass.cBHLPrevMonth).on('click', function () { // ???????????????????????????
                _this.options.startTime = _this.subtractTime(_this.options.startTime, 'month');
                _this.calendarRender(_this.calendarDoms[0], _this.options.startTime);
            });

            this.calendarDoms[0].find('.' + minorClass.cBHRNextYear).on('click', function () { // ????????????????????????
                if($(this).hasClass('is-disabled')) {
                    return;
                }
                _this.options.startTime = _this.addTime(_this.options.startTime, 'year');
                _this.calendarRender(_this.calendarDoms[0], _this.options.startTime);
            });

            this.calendarDoms[0].find('.' + minorClass.cBHRNextMonth).on('click', function () { // ???????????????????????????
                if($(this).hasClass('is-disabled')) {
                    return;
                }
                _this.options.startTime = _this.addTime(_this.options.startTime, 'month');
                _this.calendarRender(_this.calendarDoms[0], _this.options.startTime);
            });

            this.hourDoms[0].find('.' + minorClass.cHLInput).bind('input propertychange', function () {  // ??????????????????input
                var value = $(this).val();
                var time = moment(value).valueOf();
                var isTime = moment(value).isValid();
                if(value.length === 10 && isTime) {
                    _this.options.startTime = _this.selectTime[0] = _this.setTime(time);
                    _this.calendarRender(_this.calendarDoms[0], _this.selectTime[0]);
                    if((moment(_this.selectTime[1]).month() - moment(_this.selectTime[0]).month() <= 1 && moment(_this.selectTime[0]).year() === moment(_this.selectTime[1]).year()) || moment(_this.selectTime[0]).year() > moment(_this.selectTime[1]).year()) { // ????????????????????????????????????
                        if(_this.selectTime[0] > _this.selectTime[1]) {
                            _this.selectTime[1] = _this.addTime(time, 'day');
                        }
                        _this.options.endTime = _this.addTime(time, 'month');
                        _this.calendarRender(_this.calendarDoms[0], _this.selectTime[0]);
                        _this.calendarRender(_this.calendarDoms[1], _this.options.endTime);
                        _this.hourDoms[1].find('.' + minorClass.cHLInput).val(moment(_this.selectTime[1]).format('YYYY-MM-DD'));
                    }
                }
            });

            this.hourDoms[0].find('.' + minorClass.cHRInput).on('click', function () { // ??????????????????input???????????????
                var value = $(this).val().trim();
                var value2 = _this.hourDoms[0].find('.' + minorClass.cHLInput).val().trim();
                var value3 = _this.hourDoms[1].find('.' + minorClass.cHLInput).val().trim();
                var value4 = _this.hourDoms[1].find('.' + minorClass.cHRInput).val().trim();
                var day = moment(_this.options.startTime).format('YYYY-MM-DD');
                var hours = moment(_this.options.startTime).format('HH:mm:ss');
                if(!value && !value2 && !value3 && !value4 && !_this.selectTime[0] && !_this.selectTime[1]) {
                    _this.selectTime[0] = _this.options.startTime;
                    _this.selectTime[1] = _this.options.startTime;
                    $(this).val(hours);
                    _this.hourDoms[1].find('.' + minorClass.cHRInput).val(hours);
                    _this.hourDoms[0].find('.' + minorClass.cHLInput).val(day);
                    _this.hourDoms[1].find('.' + minorClass.cHLInput).val(day); 
                    _this.calendarDoms[0].find('[date="' + day + '"]').addClass('active end-date start-date');
                }
                _this.createHoursPullDown(_this.hourDoms[0], _this.selectTime[0], 0);
                
            });
            
            this.hourDoms[0].find('.' + minorClass.cHRInput).bind('input propertychange', function () { // ?????????????????????
                var _day = moment(moment(_this.selectTime[0]).format('YYYY-MM-DD ') + $(this).val()).valueOf();
                if(_day && $(this).val().length === 8) {
                    _this.selectTime[0] = _day;
                    if(_this.selectTime[0] > _this.selectTime[1]) {
                        _this.selectTime[1] = _this.selectTime[0];
                        _this.hourDoms[1].find('.' + minorClass.cHRInput).val(moment(_this.selectTime[1]).format('HH:mm:ss'));
                    }
                    var next = _this.hourDoms[0].find('.' + minorClass.cHRPull + " ul");
                    if(next.length) {
                        _this.changePullDonwTime(next, _this.selectTime[0]);
                    }
                } 
            });

            // ????????????
            this.calendarDoms[1].find('.' + minorClass.cBHLPrevYear).on('click', function () {    // ????????????????????????
                if($(this).hasClass('is-disabled')) {
                    return;
                }
                _this.options.endTime = _this.subtractTime(_this.options.endTime, 'year');
                _this.calendarRender(_this.calendarDoms[1], _this.options.endTime);
            });

            this.calendarDoms[1].find('.' + minorClass.cBHLPrevMonth).on('click', function () { // ???????????????????????????
                if($(this).hasClass('is-disabled')) {
                    return;
                }
                _this.options.endTime = _this.subtractTime(_this.options.endTime, 'month');
                _this.calendarRender(_this.calendarDoms[1], _this.options.endTime);
            });

            this.calendarDoms[1].find('.' + minorClass.cBHRNextYear).on('click', function () { // ????????????????????????
                if($(this).hasClass('is-disabled') && _this.options.disabledDate) {
                    return;
                }
                _this.options.endTime = _this.addTime(_this.options.endTime, 'year');
                _this.calendarRender(_this.calendarDoms[1], _this.options.endTime);
            });

            this.calendarDoms[1].find('.' + minorClass.cBHRNextMonth).on('click', function () { // ???????????????????????????
                if($(this).hasClass('is-disabled') && _this.options.disabledDate) {
                    return;
                }
                _this.options.endTime = _this.addTime(_this.options.endTime, 'month');
                _this.calendarRender(_this.calendarDoms[1], _this.options.endTime);
            });

            this.hourDoms[1].find('.' + minorClass.cHLInput).bind('input propertychange', function () {  // ??????????????????input
                var value = $(this).val();
                var time = moment(value).valueOf();
                var isTime = moment(value).isValid();
                if(value.length === 10 && isTime) {
                    _this.options.endTime = _this.selectTime[1] = _this.setTime(time);
                    _this.calendarRender(_this.calendarDoms[1], _this.selectTime[1]);
                    if((moment(_this.selectTime[1]).month() - moment(_this.selectTime[0]).month() <= 1 && moment(_this.selectTime[0]).year() === moment(_this.selectTime[1]).year()) || moment(_this.selectTime[0]).year() > moment(_this.selectTime[1]).year()) { // ????????????????????????????????????
                        if(_this.selectTime[0] > _this.selectTime[1]) {
                            _this.selectTime[0] = _this.subtractTime(time, 'day');
                        }
                        _this.options.startTime = _this.subtractTime(time, 'month');
                        _this.calendarRender(_this.calendarDoms[0], _this.options.startTime);
                        _this.calendarRender(_this.calendarDoms[1], _this.selectTime[1]);
                        _this.hourDoms[0].find('.' + minorClass.cHLInput).val(moment(_this.selectTime[0]).format('YYYY-MM-DD'));
                    }
                }
            });

            this.hourDoms[1].find('.' + minorClass.cHRInput).on('click', function () {   // ?????????????????????????????????
                if(_this.selectTime[1]) {
                    _this.createHoursPullDown(_this.hourDoms[1], _this.selectTime[1], 1);
                }
            });

            this.hourDoms[1].find('.' + minorClass.cHRInput).bind('input propertychange', function () { // ?????????????????????
                var time = moment(moment(_this.selectTime[1]).format('YYYY-MM-DD ') + $(this).val()).valueOf();
                if(time && $(this).val().length === 8) {
                    _this.selectTime[1] = time;
                    if(_this.selectTime[0] > _this.selectTime[1]) {
                        _this.selectTime[0] = _this.selectTime[1];
                        _this.hourDoms[0].find('.' + minorClass.cHRInput).val(moment(_this.selectTime[0]).format('HH:mm:ss'));
                    }
                    var next = _this.hourDoms[1].find('.' + minorClass.cHRPull + " ul");
                    if(next.length) {
                        _this.changePullDonwTime(next, _this.selectTime[1]);
                    }
                }
            });

        }else {

            this.hourDoms[0].find('.' + minorClass.cHRInput).on('click', function () { // ?????????????????????
                var value = $(this).val().trim();
                var value2 = _this.hourDoms[0].find('.' + minorClass.cHLInput).val().trim();
                var day = moment(_this.options.startTime).format('YYYY-MM-DD');
                var hours = moment(_this.options.startTime).format('HH:mm:ss');
                if(!value && !value2 && !_this.selectTime[0]) {
                    _this.selectTime[0] = _this.options.startTime;
                    $(this).val(hours);
                    _this.hourDoms[0].find('.' + minorClass.cHLInput).val(day);
                    _this.calendarDoms[0].find('[date="'+day+'"]').addClass('current');
                }
                _this.createHoursPullDown(_this.hourDoms[0], _this.selectTime[0], 0);
            });

            this.hourDoms[0].find('.' + minorClass.cHLInput).bind('input propertychange', function () {  // ??????????????????input
                var value = $(this).val();
                var time = moment(value).valueOf();
                var isTime = moment(value).isValid();
                if(value.length === 10 && isTime) {
                    _this.options.startTime = _this.selectTime[0] = _this.setTime(time);
                    _this.calendarRender(_this.calendarDoms[0], _this.selectTime[0]);
                }
            });

            this.hourDoms[0].find('.' + minorClass.cHRInput).bind('input propertychange', function () { // ???????????????????????????
                var _day = moment(moment(_this.selectTime[0]).format('YYYY-MM-DD ') + $(this).val()).valueOf();
                if(_day && $(this).val().length === 8) {
                    _this.selectTime[0] = _day;
                }
            });

            // ????????????
            this.calendarDoms[0].find('.' + minorClass.cBHLPrevYear).on('click', function () {    // ?????????
                _this.options.startTime = _this.subtractTime(_this.options.startTime, 'year');
                _this.calendarRender(_this.calendarDoms[0], _this.options.startTime);
            });

            this.calendarDoms[0].find('.' + minorClass.cBHLPrevMonth).on('click', function () { //????????????
                _this.options.startTime = _this.subtractTime(_this.options.startTime, 'month');
                _this.calendarRender(_this.calendarDoms[0], _this.options.startTime);
            });

            this.calendarDoms[0].find('.' + minorClass.cBHRNextYear).on('click', function () { // ?????????
                if($(this).hasClass('is-disabled')) {
                    return;
                }
                _this.options.startTime = _this.addTime(_this.options.startTime, 'year');
                _this.calendarRender(_this.calendarDoms[0], _this.options.startTime);
            });

            this.calendarDoms[0].find('.' + minorClass.cBHRNextMonth).on('click', function () { // ????????????
                if($(this).hasClass('is-disabled')) {
                    return;
                }
                _this.options.startTime = _this.addTime(_this.options.startTime, 'month');
                _this.calendarRender(_this.calendarDoms[0], _this.options.startTime);
            });
        }
    }

    DatePicker.prototype.lowerConvertUpper = function (num) {
        num = Number(num);
        switch(num) {
            case 1:
                return '???';
            case 2:
                return '???';
            case 3:
                return '???';
            case 4:
                return '???';
            case 5:
                return '???';
            case 6:
                return '???';
            case 7:
                return '???';
            case 8:
                return '???';
            case 9:
                return '???'
            case 10:
                return '???';
            case 11:
                return '??????';
            case 12:
                return '??????';
        }
    }

    DatePicker.prototype.isBetween = function (current, min, max, unit) {  // ???????????????????????????????????????
        unit = unit || "year"
        return moment(current).isBetween(min, max, unit, '[]'); 
    }

    DatePicker.prototype.render = function () {
        var _this = this;
        var startTime = _this.selectTime[0];
        var startYear = moment(startTime).year();
        var startMonth = moment(startTime).month();
        var endTime = _this.selectTime[1];
        var endYear = moment(endTime).year();
        var endMonth = moment(endTime).month();
        var startDay = moment(startTime).format('YYYY-MM-DD');
        var startHours = moment(startTime).format('HH:mm:ss');
        var endDay = moment(endTime).format('YYYY-MM-DD');
        var endHours = moment(endTime).format('HH:mm:ss');

        var dayTime = moment(startTime).valueOf();
        var dayTime2 = moment(endTime).valueOf();

        switch(_this.reportTimeType) {
            case 4: // ???
                if(startYear === endYear && endMonth === startMonth) {
                    var tempData = _this.options.isDouble ? _this.subtractTime(_this.selectTime[0], 'month') : _this.selectTime[0];
                    _this.options.startTime = tempData;
                    _this.options.endTime = _this.selectTime[0];
                    _this.calendarRender(_this.calendarDoms[0], tempData);
                    _this.calendarRender(_this.calendarDoms[1], _this.selectTime[0]);
                }else {
                    _this.options.startTime = dayTime;
                    _this.options.endTime = dayTime2;
                    _this.calendarRender(_this.calendarDoms[0], _this.selectTime[0]);
                    _this.calendarRender(_this.calendarDoms[1], _this.selectTime[1]);
                }
                _this.hourDoms[0].find('.' + minorClass.cHLInput).val(startDay);
                _this.hourDoms[0].find('.' + minorClass.cHRInput).val(startHours);
                _this.hourDoms[1] && _this.hourDoms[1].find('.' + minorClass.cHLInput).val(endDay);
                _this.hourDoms[1] && _this.hourDoms[1].find('.' + minorClass.cHRInput).val(endHours);
                $(_this.container).find('.' + firstClass.dBBConfirm).removeClass('is-disabled');
                break;
            case 5: // ???
                if(startYear === endYear && endMonth === startMonth) {
                    var tempData = _this.options.isDouble ? _this.subtractTime(_this.selectTime[0], 'month') : _this.selectTime[0];
                    _this.options.startTime = tempData;
                    _this.options.endTime = _this.selectTime[0];
                    _this.calendarRender(_this.calendarDoms[0], tempData);
                    _this.calendarRender(_this.calendarDoms[1], _this.selectTime[0]);
                }else {
                    _this.options.startTime = dayTime;
                    _this.options.endTime = dayTime2;
                    _this.calendarRender(_this.calendarDoms[0], _this.selectTime[0]);
                    _this.calendarRender(_this.calendarDoms[1], _this.selectTime[1]);
                }

                break;
            case 6: // ???

                if(startYear === endYear && endMonth === startMonth) {
                    var tempData = _this.options.isDouble ? _this.subtractTime(_this.selectTime[0], 'month') : _this.selectTime[0];
                    _this.options.startTime = tempData;
                    _this.options.endTime = _this.selectTime[0];
                    _this.calendarRender(_this.calendarDoms[0], tempData);
                    _this.calendarRender(_this.calendarDoms[1], _this.selectTime[0]);
                }else {
                    _this.options.startTime = dayTime;
                    _this.options.endTime = dayTime2;
                    _this.calendarRender(_this.calendarDoms[0], _this.selectTime[0]);
                    _this.calendarRender(_this.calendarDoms[1], _this.selectTime[1]);
                }
  
                break;
            case 7: // ???
                if(endYear === startYear) {
                    var tempData = _this.options.isDouble ? _this.subtractTime(_this.selectTime[0], 'year') : _this.selectTime[0];
                    _this.options.startTime = tempData;
                    _this.options.endTime = _this.selectTime[0];
                    _this.calendarRender(_this.calendarDoms[0], tempData);
                    _this.calendarRender(_this.calendarDoms[1], _this.selectTime[0]);
                }else {
                    _this.options.startTime = dayTime;
                    _this.options.endTime = dayTime2;
                    _this.calendarRender(_this.calendarDoms[0], _this.selectTime[0]);
                    _this.calendarRender(_this.calendarDoms[1], _this.selectTime[1]);
                }

                break;
            case 8: // ???
                if(endYear === startYear) {
                    var tempData = _this.options.isDouble ? _this.subtractTime(_this.selectTime[0], 'year') : _this.selectTime[0];
                    _this.options.startTime = tempData;
                    _this.options.endTime = _this.selectTime[0];
                    _this.calendarRender(_this.calendarDoms[0], tempData);
                    _this.calendarRender(_this.calendarDoms[1], _this.selectTime[0]);
                }else {
        

                    _this.options.startTime = dayTime;
                    _this.options.endTime = dayTime2;
                    _this.calendarRender(_this.calendarDoms[0], _this.selectTime[0]);
                    _this.calendarRender(_this.calendarDoms[1], _this.selectTime[1]);
                }

                break;
            case 9: // ???
                if(endYear - startYear < 9) {
                    if(startYear < _this.options.startYear) {
                            _this.options.startTime = _this.date[0];
                            _this.options.endTime = _this.date[1];
                           var num = Math.ceil((_this.options.startYear - startYear) / 9) * 9;
                           _this.options.startTime = moment(_this.options.startTime).subtract(num, 'year').valueOf();
                           _this.options.endTime = _this.options.isDouble ? moment(_this.options.startTime).add(num, 'year').valueOf() : this.date[1];
                           _this.calendarRender(_this.calendarDoms[0], _this.options.startTime);
                           _this.calendarRender(_this.calendarDoms[1], _this.options.endTime);
           
                    }else {
                        if(_this.options.isDouble) {
                            _this.options.startTime = _this.date[0];
                            var tempData = _this.addTime(_this.options.startTime, 'year', 9);
                            _this.options.endTime = tempData;
                            _this.calendarRender(_this.calendarDoms[0], _this.options.startTime);
                            _this.calendarRender(_this.calendarDoms[1], tempData);
                        }else {
                            var num = Math.ceil((_this.options.startYear - startYear) / 9) * 9;
                            _this.options.startTime = moment(_this.options.startTime).subtract(num, 'year').valueOf();
                            _this.calendarRender(_this.calendarDoms[0], _this.options.startTime);
                        }
                    }
                }else {
                        var num = Math.ceil((_this.options.startYear - startYear) / 9) * 9;
                        _this.options.startTime = moment(_this.options.startTime).subtract(num, 'year').valueOf();
                        _this.calendarRender(_this.calendarDoms[0], _this.options.startTime);
                        _this.calendarRender(_this.calendarDoms[1], _this.options.endTime);
                }
                break;
        }
        
        // this.calendarRender(this.calendarDoms[0], this.options.startTime);
        // this.calendarRender(this.calendarDoms[1], this.options.endTime);

    }

    $.fn.extend({
        datePicker: function (options) {
            options.id = this.attr('name');
            options.container = this;
            return new DatePicker(options);
        }
    });

}(window, jQuery));