/*
 *
 * TODO:
 * Fix state if user enters dates then deletes end date, remove shading from "selected dates"
 * If window size small, only show one month
 *
 */

function TinyPicker(settings) { // eslint-disable-line no-unused-vars
    if (!(this instanceof TinyPicker)) {
        return new TinyPicker(settings);
    }

    var defaults = {
        local: settings.local || 'en-US',
        monthsToShow: window.innerWidth > 500 ? settings.monthsToShow || 2 : 1,
        days: settings.days || ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    };

    var today = newDateInstance(newDateInstance().setHours(0, 0, 0, 0));
    var firstBox = settings.firstBox;
    var lastBox = settings.lastBox;
    var startDate = firstBox.value === '' ? today : newDateInstance(firstBox.value);
    var endDate = newDateInstance(lastBox.value);
    var calendarClassName = 'cal';
    var div = 'div';
    var selectedString = 'selected';
    var spanDateString = 'spanDate';

    /*
    *
    * Visual
    *
    */


    function getChevrons(element, calendarObj) {
        var navWrapper = createElementWithClass(div, 'nav');

        appendChild(navWrapper, createElementWithClass('span', 'right'));
        appendChild(navWrapper, createElementWithClass('span', 'left'));

        navWrapper.addEventListener('click', function (e) {
            var monthChange = e.target.className === 'right' ? 1 : -1;
            var firstWeek = calendarObj[0].weeks[0];
            var date = firstWeek[Object.keys(firstWeek)[0]].date;
            var newStartDate = newDateInstance(date.setMonth(date.getMonth() + monthChange));

            showCalendar(element, newStartDate);
        });
        return navWrapper;
    }

    function positionCalendar(calendarElement, shadowElement) {
        calendarElement.style.top  =  shadowElement.offsetTop + shadowElement.offsetHeight + 15 + 'px';
        calendarElement.style.left = shadowElement.offsetLeft + 'px';
    }

    function showCalendar(element, newStartDate) {
        if (!newStartDate) {
            newStartDate = element === firstBox ? startDate : new Date(endDate.getFullYear(), endDate.getMonth());
        }

        newStartDate = isDateTodayOrFuture(newStartDate, today) ? newStartDate : today;
        renderCalendar(element, newStartDate);
        positionCalendar(getFirstElementByClass(calendarClassName), element);

        // Close the calendar listener
        document.addEventListener('click', function (e) {
            var el = e.target;
            var calendarEl = getFirstElementByClass(calendarClassName);
            if (calendarEl && el !== firstBox && el !== lastBox && !calendarEl.contains(getFirstElementByClass(el.className))) {
                removeCalendar(calendarClassName);
            }
        });
    }

    function getMonthsInfoForCalendar(passedInDate) {
        var monthsArr = [];
        var year = passedInDate.getFullYear();
        var monthNum = passedInDate.getMonth();
        for (var i = 0; i < defaults.monthsToShow; i++) {
            var date = new Date(year, monthNum + i, 1); // Get first day of the month
            var month = getDays(passedInDate, date, i); // Get the days that go in the month
            monthsArr.push(month);
        }

        return monthsArr;
    }

    function handleCalendar(shadowElement, date) {
        if (shadowElement === firstBox) {
            startDate = date;
            if (isDateTodayOrFuture(startDate, endDate)) {
                endDate = date;
            }
            endDate = startDate;

            // If user reenters startDate, force reselect of enddate
            lastBox.value = '';
            lastBox.focus();
        } else {
            endDate = date;
            removeCalendar(calendarClassName);
            shadowElement.classList.remove('error');
        }
    }

    function renderCalendar(element, newDate) {
        removeCalendar(calendarClassName);

        var calendarObj = getMonthsInfoForCalendar(newDate);
        var sinceDate = element !== firstBox && isDateTodayOrFuture(startDate, today) ? startDate : today;

        var calendarWidget = createElementWithClass(div, calendarClassName);
        appendChild(calendarWidget, getChevrons(element, calendarObj));
        appendChild(document.body, calendarWidget);

        calendarObj.forEach(function (month) {
            var monthDiv = createElementWithClass(div, 'month');

            var monthHeader = createElementWithClass('p', 'header');
            monthHeader.innerHTML = month.name + ' ' + month.year;
            appendChild(monthDiv, monthHeader);

            var calendarContainer = createElementWithClass(div);

            defaults.days.forEach(function (day) {
                var dayEl = createElementWithClass(div, 'dName');
                dayEl.innerHTML = day;
                appendChild(calendarContainer, dayEl);
            });

            appendChild(calendarContainer, createMonthBody(month.weeks, sinceDate, element));
            appendChild(monthDiv, calendarContainer);
            appendChild(calendarWidget, monthDiv);
        });
    }

    function createMonthBody(weeks, sinceDate, element) {
        var calendarBody = createElementWithClass(div);

        weeks.forEach(function (week) {
            for (var i = 0; i < 7; i++) {
                var currentDate = week[i] && week[i].date;
                var dayOfWeekEl = createElementWithClass(div, 'day');

                if (typeof currentDate === 'undefined') {
                    appendChild(calendarBody, dayOfWeekEl);
                } else {
                    dayOfWeekEl.className = 'disabled';
                    if (isDateTodayOrFuture(currentDate, sinceDate)) {
                        dayOfWeekEl.className =  'active';

                        if (isDayInRange(startDate, endDate, currentDate) && firstBox.value) {
                            if (getTime(startDate) === getTime(currentDate) || getTime(endDate) === getTime(currentDate)) {
                                addClass(dayOfWeekEl, selectedString);
                            } else {
                                addClass(dayOfWeekEl, spanDateString);
                            }
                        }
                        dayOfWeekEl.addEventListener('click', setDateInEl.bind(this, currentDate, element));
                    }

                    dayOfWeekEl.innerHTML = currentDate.getDate();
                    dayOfWeekEl.classList.add('day');
                    dayOfWeekEl.setAttribute('time', getTime(currentDate));
                    appendChild(calendarBody, dayOfWeekEl);
                    hoverRange(dayOfWeekEl, element);
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
            name: date.toLocaleString(defaults.local, { month: 'long'}),
            year: date.getFullYear(),
            weeks: []
        };
        var newDate = new Date(passedInDate.getFullYear(), passedInDate.getMonth() + i, 1).getMonth();
        while (date.getMonth() === newDate) {
            var week = getNumberOfWeeks(newDateInstance(date));
            if (typeof month.weeks[week] === 'undefined') {
                month.weeks[week] = {};
            }

            var day = newDateInstance(date);
            month.weeks[week][day.getDay()] = {
                date: day
            };
            date.setDate(date.getDate() + 1);
        }
        return month;
    }

    function hoverRange(el, inputClicked) {
        el.addEventListener('mouseover', function (e) {
            var days = document.getElementsByClassName('day');
            var hoverTime = parseInt(e.target.getAttribute('time'), 10);
            var startTime = getTime(startDate);

            for (var i = 0; i < days.length; i++) {
                var day = days[i];
                var elTime = parseInt(days[i].getAttribute('time'), 10);

                day.classList.remove(selectedString, spanDateString);
                if (inputClicked === lastBox && elTime < hoverTime && elTime > startTime) {
                    addClass(day, spanDateString);
                } else if (hoverTime === elTime || (elTime === startTime && inputClicked !== firstBox) || hoverTime === elTime) {
                    addClass(day, selectedString);
                }
            }
        });
    }

    // Init listeners to properly display calendar
    this.init = function () {
        [firstBox, lastBox].forEach(function (element) {
            element.addEventListener('focus', function (e) {
                showCalendar(e.target);
            });
            // TODO: Should this be here??? I can do this somewhere else
            var timer;
            element.addEventListener('keydown', function (e) {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    userInputedDateHandler(e.target);
                }, 1000);
            });
        });
    };

    // helper functions to minimize file size - can move out of TinyPicker

    function createElementWithClass(type, className) {
        var el = document.createElement(type);
        el.className = className || '';
        return el;
    }

    function appendChild(parent, child) {
        parent.appendChild(child);
    }

    function getFirstElementByClass(className) {
        return document.getElementsByClassName(className)[0];
    }

    function newDateInstance(val) {
        return val ? new Date(val) : new Date();
    }

    function addClass(el, className) {
        el.classList.add(className);
    }

    function getTime(date) {
        return date.getTime();
    }

    // Specific helpers for TinyPicker
    function isDateTodayOrFuture(currentDate, checkThisDate) {
        return getTime(currentDate) >= getTime(checkThisDate);
    }

    function isDayInRange(beginDate, finalDate, checkThisDate) {
        return isDateTodayOrFuture(checkThisDate, beginDate) && isDateTodayOrFuture(finalDate, checkThisDate);
    }

    function setDateInEl(date, shadowElement) {
        shadowElement.value = date.toLocaleDateString(defaults.local);
        handleCalendar(shadowElement, date);
    }

    function userInputedDateHandler(element) {
        var val = element.value;
        var userInputedDate = val && newDateInstance(val);
        var errorClass = 'error';

        userInputedDate instanceof Date && isFinite(userInputedDate) ? element.classList.remove(errorClass) : element.classList.add(errorClass);
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

module.exports = TinyPicker;