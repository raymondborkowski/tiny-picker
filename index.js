/*
 *
 * TODO:
 * Dynamically add CSS
 *
 *
 */

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

function getNumberOfWeeks(date) {
    return Math.ceil((date.getDate() - 1 - date.getDay()) / 7);
}

function removeCalendar(className) {
    var element = getFirstElementByClass(className);
    element && document.body.removeChild(element);
}

function isDateTodayOrFuture(currentDate, checkThisDate) {
    return getTime(currentDate) >= getTime(checkThisDate);
}

function positionCalendar(calendarElement, shadowElement) {
    var positions = shadowElement.getBoundingClientRect();
    calendarElement.style.top  =  positions.top + positions.height + 15 + 'px';
    calendarElement.style.left = positions.left + 'px';
}

function writeCSSToHead() {
    var styleEl = document.createElement('style');
    styleEl.innerHTML = '.cal {\n' +
        '    background: white;\n' +
        '    border: 1px solid #ccc;\n' +
        '    position: absolute;\n' +
        '    z-index: 1;\n' +
        '    padding: 0;\n' +
        '    font-size: 10px;\n' +
        '    border-radius: 4px;\n' +
        '    box-shadow: 0 6px 12px rgba(0,0,0,0.175);\n' +
        '    color: black;\n' +
        '    font-family: Arial, Helvetica, sans-serif;\n' +
        '\n' +
        '}\n' +
        '\n' +
        '.cal:before {\n' +
        '    position: absolute;\n' +
        '    top: -7px;\n' +
        '    left: 9px;\n' +
        '    display: inline-block;\n' +
        '    border-right: 7px solid transparent;\n' +
        '    border-bottom: 7px solid #ccc;\n' +
        '    border-left: 7px solid transparent;\n' +
        '    border-bottom-color: rgba(0,0,0,0.2);\n' +
        '    content: \'\';\n' +
        '}\n' +
        '\n' +
        '.cal:after {\n' +
        '    position: absolute;\n' +
        '    top: -6px;\n' +
        '    left: 10px;\n' +
        '    display: inline-block;\n' +
        '    border-right: 6px solid transparent;\n' +
        '    border-bottom: 6px solid #fff;\n' +
        '    border-left: 6px solid transparent;\n' +
        '    content: "";\n' +
        '}\n' +
        '\n' +
        '.hed {\n' +
        '    font-size: 15px;\n' +
        '    text-align: center;\n' +
        '    font-weight: 500;\n' +
        '    margin: 15px 0 5px 0;\n' +
        '}\n' +
        '\n' +
        '.inBtw {\n' +
        '    background-color: #bbddf5;\n' +
        '}\n' +
        '\n' +
        '.nav {\n' +
        '    margin: 0;\n' +
        '}\n' +
        '\n' +
        '.dHd {\n' +
        '    text-align: center;\n' +
        '    float: left;\n' +
        '    width: 29.5px;\n' +
        '    color: #bbb;\n' +
        '    height: 30px;\n' +
        '    line-height: 30px;\n' +
        '    font-size: 12px;\n' +
        '}\n' +
        '\n' +
        '.mnt {\n' +
        '    max-width: 210px;\n' +
        '    width: auto;\n' +
        '    height: auto;\n' +
        '    display: inline-block;\n' +
        '    padding: 0 10px 10px;\n' +
        '}\n' +
        '\n' +
        '.day {\n' +
        '    float: left;\n' +
        '    text-align: center;\n' +
        '    border: none;\n' +
        '    width: 28px;\n' +
        '    height: 28px;\n' +
        '    line-height: 28px;\n' +
        '    color: #555;\n' +
        '    cursor: pointer;\n' +
        '    border-right: 1.5px solid white;\n' +
        '    border-bottom: 1.5px solid white;\n' +
        '    font-size: 14px;\n' +
        '}\n' +
        '\n' +
        '.sel:not(.disb) {\n' +
        '    background-color: #50a5e6;\n' +
        '}\n' +
        '\n' +
        '.err, .err:focus {\n' +
        '    outline: none !important;\n' +
        '    border:1px solid red;\n' +
        '    box-shadow: 0 0 10px red;\n' +
        '}\n' +
        '\n' +
        '.disb {\n' +
        '    opacity: 0.7;\n' +
        '    color: #888;\n' +
        '    cursor: default;\n' +
        '}\n' +
        '\n' +
        '.rChev:before, .lChev:before {\n' +
        '    border-style: solid;\n' +
        '    border-width: 3px 3px 0 0;\n' +
        '    content: "";\n' +
        '    display: inline-block;\n' +
        '    height: 7px;\n' +
        '    width: 7px;\n' +
        '    cursor: pointer;\n' +
        '}\n' +
        '\n' +
        '.rChev:before {\n' +
        '    transform: rotate(45deg);\n' +
        '}\n' +
        '\n' +
        '.lChev:before {\n' +
        '    transform: rotate(-135deg);\n' +
        '}\n' +
        '\n' +
        '.rChev, .lChev {\n' +
        '    position: absolute;\n' +
        '    top: 18px;\n' +
        '}\n' +
        '\n' +
        '.rChev {\n' +
        '    right: 25px;\n' +
        '}\n' +
        '\n' +
        '.lChev {\n' +
        '    left: 20px;\n' +
        '}';
    document.head.appendChild(styleEl);
}

function getDays(passedInDate, date, i, local) {
    var month = {
        name: date.toLocaleString(local, { month: 'long'}),
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

function getMonthsInfoForCalendar(passedInDate, monthsToShow, local) {
    var monthsArr = [];
    var year = passedInDate.getFullYear();
    var monthNum = passedInDate.getMonth();
    for (var i = 0; i < monthsToShow; i++) {
        var date = new Date(year, monthNum + i, 1); // Get first day of the month
        var month = getDays(passedInDate, date, i, local); // Get the days that go in the month
        monthsArr.push(month);
    }

    return monthsArr;
}

function TinyPicker(overrides) { // eslint-disable-line no-unused-vars
    var firstBox = overrides.firstBox;
    var lastBox = overrides.lastBox || {};
    firstBox.value = overrides.fbv || '';
    lastBox.value =  overrides.lbv || '';

    // Settings and constants
    var today = newDateInstance(newDateInstance().setHours(0, 0, 0, 0));
    var wroteCss = false;
    var calendarClassName = 'cal';
    var div = 'div';
    var selectedString = 'sel';
    var selectedRangeString = 'inBtw';
    var startDate = firstBox.value === '' ? today : newDateInstance(firstBox.value);
    var endDate = newDateInstance(lastBox.value);
    var settings = {
        local: overrides.local || 'en-US',
        months: window.innerWidth > 500 ? overrides.months || 2 : 1,
        days: overrides.days || ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        cb: overrides.cb || function () {}
    };

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
            if (calendarEl && !calendarEl.contains(getFirstElementByClass(el.className))) {
                removeCalendar(calendarClassName);
            }
        });
    }

    function renderCalendar(element, newDate) {
        removeCalendar(calendarClassName);

        var calendarObj = getMonthsInfoForCalendar(newDate, settings.months, settings.local);
        var sinceDate = element !== firstBox && isDateTodayOrFuture(startDate, today) ? startDate : today;

        var calendarWidget = createElementWithClass(div, calendarClassName);
        appendChild(calendarWidget, getChevrons(element, calendarObj));
        appendChild(document.body, calendarWidget);

        calendarObj.forEach(function (month) {
            var monthDiv = createElementWithClass(div, 'mnt');

            var monthHeader = createElementWithClass('p', 'hed');
            monthHeader.innerHTML = month.name + ' ' + month.year;
            appendChild(monthDiv, monthHeader);

            var calendarContainer = createElementWithClass(div);

            settings.days.forEach(function (day) {
                var dayEl = createElementWithClass(div, 'dHd');
                dayEl.innerHTML = day;
                appendChild(calendarContainer, dayEl);
            });

            appendChild(calendarContainer, createCalInnerWorkings(month.weeks, sinceDate, element));
            appendChild(monthDiv, calendarContainer);
            appendChild(calendarWidget, monthDiv);
        });
    }

    function handleCalendarState(shadowElement, date) {
        if (shadowElement === firstBox) {
            startDate = date;
            if (isDateTodayOrFuture(startDate, endDate)) {
                endDate = date;
            }
            endDate = startDate;
            if (lastBox.nodeType) {
                lastBox.value = ''; // If user reenters startDate, force reselect of enddate
                lastBox.focus();
            } else {
                removeCalendar(calendarClassName);
                settings.cb(startDate);
            }
        } else {
            endDate = date;
            removeCalendar(calendarClassName);
            shadowElement.classList.remove('err');
            settings.cb(startDate, endDate);
        }
    }

    function getChevrons(element, calendarObj) {
        var navWrapper = createElementWithClass(div, 'nav');

        appendChild(navWrapper, createElementWithClass('span', 'rChev'));
        appendChild(navWrapper, createElementWithClass('span', 'lChev'));

        navWrapper.addEventListener('click', function (e) {
            var monthChange = e.target.className === 'rChev' ? 1 : -1;
            var firstWeek = calendarObj[0].weeks[0];
            var date = firstWeek[Object.keys(firstWeek)[0]].date;
            var newStartDate = newDateInstance(date.setMonth(date.getMonth() + monthChange));

            showCalendar(element, newStartDate);
        });
        return navWrapper;
    }

    function createCalInnerWorkings(weeks, sinceDate, element) {
        var calendarBody = createElementWithClass(div);

        weeks.forEach(function (week) {
            for (var i = 0; i < 7; i++) {
                var currentDate = week[i] && week[i].date;
                var dayOfWeekEl = createElementWithClass(div, 'day');

                if (typeof currentDate === 'undefined') {
                    appendChild(calendarBody, dayOfWeekEl);
                } else {
                    dayOfWeekEl.className = 'disb';
                    var currentTime = getTime(currentDate);
                    if ((currentDate >= today && element === firstBox) || currentDate >= startDate) {
                        dayOfWeekEl.className =  'active';
                        dayOfWeekEl.addEventListener('click', setDateInEl.bind(this, currentDate, element));

                        // Add Highlights to days
                        if (endDate > currentDate && startDate < currentDate) {
                            addClass(dayOfWeekEl, selectedRangeString);
                        } else if (getTime(endDate) === currentTime || currentTime ===  getTime(startDate)) {
                            addClass(dayOfWeekEl, selectedString);
                        }
                    }

                    dayOfWeekEl.innerHTML = currentDate.getDate();
                    dayOfWeekEl.classList.add('day');
                    dayOfWeekEl.setAttribute('time', currentTime);
                    appendChild(calendarBody, dayOfWeekEl);
                    hoverRange(dayOfWeekEl, element);
                }
            }
        });

        return calendarBody;
    }

    function hoverRange(el, inputClicked) {
        el.addEventListener('mouseover', function (e) {
            var days = document.getElementsByClassName('day');
            var hoverTime = parseInt(e.target.getAttribute('time'), 10);
            var startTime = getTime(startDate);

            for (var i = 0; i < days.length; i++) {
                var day = days[i];
                var elTime = parseInt(day.getAttribute('time'), 10);

                day.classList.remove(selectedString, selectedRangeString);
                if (inputClicked === lastBox && elTime < hoverTime && elTime > startTime) {
                    addClass(day, selectedRangeString);
                } else if (hoverTime === elTime || (elTime === startTime && inputClicked !== firstBox)) {
                    addClass(day, selectedString);
                }
            }
        });
    }

    // Specific helpers for TinyPicker

    function setDateInEl(date, shadowElement) {
        shadowElement.value = date.toLocaleDateString(settings.local);
        handleCalendarState(shadowElement, date);
    }

    function userInputedDateHandler(element) {
        var val = element.value;
        var userInputedDate = val && newDateInstance(val);
        var errorClass = 'err';

        userInputedDate instanceof Date && isFinite(userInputedDate) ? element.classList.remove(errorClass) : element.classList.add(errorClass);
        isDateTodayOrFuture(userInputedDate, today) && setDateInEl(userInputedDate, element);
    }

    // Init listeners to properly display calendar
    this.init = function () {
        [firstBox, lastBox].forEach(function (element) {
            if (!element.nodeType) return;
            element.addEventListener('focus', function (e) {
                !wroteCss && writeCSSToHead();
                wroteCss = true;
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

            // Stop if you click on input
            element.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        });
    };
}

module.exports = TinyPicker;
