/*
 *
 * TODO:
 * Fix state if user enters dates then deletes end date, remove shading from "selected dates"
 * Properly highlight date range when hovering
 * If window size small, only show one month
 *
 */

function TinyPicker(settings) {
    if (!(this instanceof TinyPicker)) {
        return new TinyPicker(settings, overrides);
    }

    var defaults = {
        local: settings.local || 'en-US',
        selectToday: settings.selectToday || false,
        monthsToShow: settings.monthsToShow || 2,
        days: settings.days || ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        preChoose: settings.preChoose || 2,
        firstBox: settings.firstBox || getFirstElementByClass('TinyPicker'),
        lastBox: settings.lastBox || getFirstElementByClass('TinyPicker', 1),
    };

    var today = newDateInstance(defaults.selectToday ? newDateInstance().setHours(0,0,0,0) : '');
    var firstBox = defaults.firstBox;
    var lastBox = defaults.lastBox;
    var startDate = firstBox.value === '' ? today : newDateInstance(firstBox.value);
    var endDate = lastBox.value === '' ? addDayOrMonth(defaults.preChoose, 'days') : newDateInstance(lastBox.value);
    var calendarClassName = 'cal';
    var div = 'div';

    /*
     *
     * Visual
     *
     */

    function getChevrons(element, calendarObj) {
        var navWrapper = createElementWithClass(div, 'nav');

        appendChild(navWrapper, createElementWithClass('span', 'right'));
        appendChild(navWrapper, createElementWithClass('span', 'left'));

        addClickListener(navWrapper, function(e) {
            var monthChange = e.target.className === 'right' ? 1 : -1;
            var newStartDate = addDayOrMonth(monthChange, 'months', newDateInstance(Object.values(calendarObj[0].weeks[0])[0].date));

            showCalendar(element, newStartDate);
        });
        return navWrapper;
    }
    function positionCalendar(calendarElement, shadowElement) {
        calendarElement.style.top  =  shadowElement.offsetTop + shadowElement.offsetHeight + 15 + 'px';
        calendarElement.style.left = shadowElement.offsetLeft + 'px';
    }
    function showCalendar(element, newStartDate){
        if (!newStartDate) {
            newStartDate = element === firstBox ? startDate : new Date(endDate.getFullYear(), endDate.getMonth());
        }

        newStartDate = isDateTodayOrFuture(newStartDate, today) ? newStartDate : today;
        renderCalendar(element, newStartDate);
        positionCalendar(getFirstElementByClass(calendarClassName), element);

        addClickListener(document, function(e){
            var el = e.target;
            var calendarEl = getFirstElementByClass(calendarClassName);
            if (calendarEl && el !== firstBox && el !== lastBox && !calendarEl.contains(getFirstElementByClass(el.className)) && lastBox.value !== '') {
                removeCalendar(calendarClassName);
            }
        });
    }
    function setUpCalendar(passedInDate) {
        var monthsArr = [];
        var year = passedInDate.getFullYear();
        var monthNum = passedInDate.getMonth();
        for (var i = 0; i < defaults.monthsToShow; i++) {
            var date = new Date(year, monthNum + i, 1);
            var month = getDays(passedInDate, date, i);
            monthsArr.push(month);
        }

        return monthsArr;
    }
    function createEmptyDayHTML(appendTo) {
        var dayOfWeekEl = createElementWithClass(div, 'day');
        appendChild(appendTo, dayOfWeekEl);
    }
    function updateValidDates(shadowElement, date) {
        if(shadowElement === firstBox){
            startDate = date;
            if(isDateTodayOrFuture(startDate, endDate)){
                endDate = date;
            }
            // If user reenters startDate, force reselect of enddate
            lastBox.value = '';
            endDate = startDate;
            lastBox.focus();
        } else {
            endDate = date;
            removeCalendar(calendarClassName);
        }
    }












    function renderCalendar(element, newDate) {

        removeCalendar(calendarClassName);

        var calendarObj = setUpCalendar(newDate);
        var sinceDate = element !== firstBox && isDateTodayOrFuture(startDate, today) ? startDate : today;

        var calendarWidget = createElementWithClass(div, calendarClassName);
        appendChild(calendarWidget, getChevrons(element, calendarObj));
        appendChild(document.body, calendarWidget);

        calendarObj.forEach(function(month){
            var monthDiv = createElementWithClass(div, 'month');

            var monthHeader = createElementWithClass('p', 'header');
            monthHeader.innerHTML = month.name + ' ' + month.year;
            appendChild(monthDiv, monthHeader);

            var calendarContainer = createElementWithClass(div);

            defaults.days.forEach(function(day) {
                var dayEl = createElementWithClass(div, 'dName');
                dayEl.innerHTML = day;
                appendChild(calendarContainer, dayEl);
            });

            appendChild(calendarContainer, createMonthBody(month.weeks, sinceDate, element));
            appendChild(monthDiv, calendarContainer);
            appendChild(calendarWidget, monthDiv);
        });
    }

    function createMonthBody(weeks, sinceDate, element){
        var calendarBody = createElementWithClass(div);

        weeks.forEach(function(week){
            for(var i = 0; i < 7; i++) {
                var currentDate = week[i] && week[i].date;

                if(currentDate === undefined){
                    createEmptyDayHTML(calendarBody)
                } else {
                    var dayOfWeekEl = createElementWithClass(div, 'disabled');
                    if(isDateTodayOrFuture(currentDate, sinceDate)){
                        dayOfWeekEl.className =  'active';

                        if(isDaySelected(startDate, endDate, currentDate) && firstBox.value){
                            dayOfWeekEl.className = 'selected';
                        }
                        addClickListener(dayOfWeekEl, setDateInEl.bind(this, currentDate, element));
                    }

                    dayOfWeekEl.innerHTML = currentDate.getDate();
                    dayOfWeekEl.classList.add('day');
                    dayOfWeekEl.setAttribute('time', currentDate.getTime());
                    appendChild(calendarBody, dayOfWeekEl);
                    hoverRange(dayOfWeekEl);
                }
            }
        });

        return calendarBody;
    }

    /*
     *
     * Data functions (Manipulation)
     *
     */

    function getDays(passedInDate, date, i) {
        var month = {
            name: date.toLocaleString(defaults.local, { month: "long"}),
            year: date.getFullYear(),
            weeks: []
        };
        var newDate = new Date(passedInDate.getFullYear(), passedInDate.getMonth() + i, 1).getMonth();
        while (date.getMonth() === newDate) {
            var week = getNumberOfWeeks(newDateInstance(date));
            if(month.weeks[week] == null){
                month.weeks[week] = {};
            }

            var day = newDateInstance(date);
            month.weeks[week][day.getDay()] = {
                date: day,
            };
            date.setDate(date.getDate() + 1);
        }
        return month;
    }

    function hoverRange(el) {
        el.addEventListener('mouseover', function(e) {
            var days = document.getElementsByClassName('day');
            var hoverTime = parseInt(e.target.getAttribute('time'), 10);
            var startTime = startDate.getTime();

            for (var i = 0; i < days.length; i++) {
                var time = parseInt(days[i].getAttribute('time'), 10);

                if (time <= hoverTime && time >= startTime) {
                    days[i].classList.add('selected');
                } else {
                    days[i].classList.remove('selected');
                }
            }
        });
    }












    // Init listeners to properly display calendar

    [firstBox, lastBox].forEach(function(element){
        element.addEventListener('focus', function(e){
            showCalendar(e.target);
        });
        // TODO: Should this be here??? I can do this somewhere else
        var timer;
        element.addEventListener('keydown', function(e){
            clearTimeout(timer);
            timer = setTimeout(function() {
                userInputedDateHandler(e.target);
            }, 1000);
        });
    });

    // helper functions to minimize file size - can move out of TinyPicker

    function createElementWithClass(type, className) {
        var el = document.createElement(type);
        el.className = className || '';
        return el;
    }

    function appendChild(parent, child) {
        parent.appendChild(child);
    }

    function addDayOrMonth(number, unit, date) {
        date = date || newDateInstance();
        unit === 'days' ? date.setDate(date.getDate() + number) : date.setMonth(date.getMonth() + number);
        return date;
    }

    function getFirstElementByClass(className, i){
        return document.getElementsByClassName(className)[i || 0];
    }

    function addClickListener(el, callback){
        return el.addEventListener('click', callback);
    }

    function newDateInstance(val) {
        return val ? new Date(val) : new Date();
    }

    // Specific helpers for TinyPicker
    function isDateTodayOrFuture(currentDate, checkThisDate) {
        return currentDate.getTime() >= checkThisDate.getTime();
    }

    function isDaySelected(beginDate, finalDate, checkThisDate) {
        return isDateTodayOrFuture(checkThisDate, beginDate) && isDateTodayOrFuture(finalDate, checkThisDate);
    }

    function setDateInEl(date, shadowElement){
        shadowElement.value = date.toLocaleDateString(defaults.local);
        updateValidDates(shadowElement, date);
    }

    function userInputedDateHandler(element) {
        var userInputedDate = newDateInstance(element.value);
        var errorClass = 'error';

        userInputedDate instanceof Date && !isFinite(userInputedDate) ? element.classList.add(errorClass) : element.classList.remove(errorClass);
        isDateTodayOrFuture(userInputedDate, today) && setDateInEl(userInputedDate, element);
    }

    function getNumberOfWeeks(date) {
        return Math.ceil((date.getDate() - 1 - date.getDay()) / 7);
    }

    function removeCalendar(className) {
        var element = getFirstElementByClass(className);
        element && document.body.removeChild(element);
    }
}
