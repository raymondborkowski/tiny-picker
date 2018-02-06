var defaultOptions = {
    firstDayOfWeek: 0,
    months: {
        long: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    },
    weekdays: {
        short: ['S','M','T','W','T','F','S'],
    },
};
var MONTH_NAV = 'mn';
var DIV = 'div';

function extend(out) {
    out = out || {};
    for (var i = 1; i < arguments.length; i++) {
        if (arguments[i]) {
            for (var key in arguments[i]) {
                if (arguments[i].hasOwnProperty(key)) {
                    out[key] = arguments[i][key];
                }
            }
        }
    }
    return out;
};

function parseDate(input) {
    var parts = input.split('-');
    return new Date(parts[0], parts[1]-1, parts[2]);
}

function TinyPicker(query, options) {
    if (!(this instanceof TinyPicker)) {
        return new TinyPicker(query, options);
    }

    options = extend({}, defaultOptions, options);
    window.document.addEventListener('click', function(e) {setOpenBindings(e);}, false);
    var picker = null, targetEl = null, current, selected;

    function setOpenBindings(e) {
        var target = e.target;
        if (target.className === MONTH_NAV+ ' next') {
            getNextMonth();
        } else if (target.className ===  MONTH_NAV+ ' prev') {
            getPreviousMonth();
        } else if (target.className === 'day') {
            setDate(target.innerHTML);
            close();
        } else {
            while (target && !matchesReferrerEl(target) && target.className !== 'dp') {
                target = target.parentNode;
            }
            if (target && matchesReferrerEl(target)) { render(target); }
            if (!target) { close(); }
        }
    }

    function matchesReferrerEl(elm) {
        var referrers = document.querySelectorAll(query);
        for (var i = 0; i < referrers.length; i++) {
            if (elm === referrers[i]) return true;
        }
        return false;
    }

    function addWeek(days) {
        var week = document.createElement(DIV);
        week.classList.add('w');
        for (var i = 0; i < days.length; i++) {
            week.appendChild(days[i]);
        }
        return week;
    }

    function render(target) {
        targetEl = typeof target !== typeof undefined ? target : targetEl;
        if (target || typeof current === typeof undefined) {
            var currentDate = new Date();
            if (target) { selected = null; }
            if (target && target.value) {
                currentDate = parseDate(target.value.toLowerCase());
                selected = {
                    year: currentDate.getFullYear(),
                    month: currentDate.getMonth(),
                    day: currentDate.getDate(),
                };
            }
            current = {
                year: currentDate.getFullYear(),
                month: currentDate.getMonth(),
            };
        }
        cleanPicker();
        draw();
    }

    function cleanPicker() {
        var picker = document.querySelector('.dp');
        if (picker) picker.remove();
    }

    function draw() {
        var position = {
            x: targetEl.offsetLeft,
            y: targetEl.offsetTop + targetEl.offsetHeight,
        };
        picker = document.createElement(DIV);
        picker.classList.add('dp');
        picker.setAttribute('style', 'left:' + position.x + 'px;top:' + position.y + 'px;solid:blue;');
        picker.appendChild(getNav());
        picker.appendChild(getHeader());
        var weeks = getWeeks();
        for (var i = 0; i < weeks.length; i++) {
            picker.appendChild(weeks[i]);
        }

        targetEl.parentNode.insertBefore(picker, targetEl.nextSibling);
    }

    function getNav() {
        var nav = document.createElement(DIV);
        nav.classList.add('tn');

        var previousMonth = document.createElement(DIV);
        previousMonth.classList.add(MONTH_NAV);
        previousMonth.classList.add('prev');
        previousMonth.innerHTML = '<';

        var currentMonth = document.createTextNode(options.months.long[current.month] + ' ' + current.year);

        var nextMonth = document.createElement(DIV);
        nextMonth.classList.add(MONTH_NAV);
        nextMonth.classList.add('next');
        nextMonth.innerHTML = '>';

        nav.appendChild(previousMonth);
        nav.appendChild(currentMonth);
        nav.appendChild(nextMonth);

        return nav;
    }

    function getHeader() {
        var weekdays = options.weekdays.short.slice(options.firstDayOfWeek).concat(options.weekdays.short.slice(0, options.firstDayOfWeek));
        var header = document.createElement(DIV);
        header.classList.add('wh');
        for (var i = 0; i < 7; i++) {
            var dayOfWeek = document.createElement(DIV);
            dayOfWeek.innerHTML = weekdays[i];
            header.appendChild(dayOfWeek);
        }
        return header;
    }

    function getWeeks() {
        // Get first day of month and update acconding to options
        var firstOfMonth = new Date(current.year, current.month, 1).getDay();
        firstOfMonth = firstOfMonth < options.firstDayOfWeek ? 7 + (firstOfMonth - options.firstDayOfWeek) : firstOfMonth - options.firstDayOfWeek;
        var daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
        var days = [];
        var weeks = [];

        // Create empty spaces for last month
        for (var i = firstOfMonth - 1; i >= 0; i--) {
            days.push(document.createElement(DIV));
        }
        // Define days in current month
        for (var i = 0; i < daysInMonth; i++) {
            if (i && (firstOfMonth + i) % 7 === 0) {
                weeks.push(addWeek(days));
                days = [];
            }
            var currentMonthDay = document.createElement(DIV);
            currentMonthDay.classList.add('day');
            if (selected && selected.year === current.year &&
                selected.month === current.month && selected.day === i + 1) {
                currentMonthDay.classList.add('selected');
            }
            currentMonthDay.innerHTML = i + 1;
            days.push(currentMonthDay);
        }
        // Create empty spaces for next month
        if (days.length) {
            var len = days.length;
            for (var i = 0; i < 7 - len; i++) {
                days.push(document.createElement(DIV));
            }
            weeks.push(addWeek(days));
        }
        return weeks;
    }

    function getNextMonth() {
        var currentDate = new Date(current.year, current.month + 1);
        current = {
            year: currentDate.getFullYear(),
            month: currentDate.getMonth(),
        };
        render();
    }

    function getPreviousMonth() {
        var currentDate = new Date(current.year, current.month - 1);
        current = {
            year: currentDate.getFullYear(),
            month: currentDate.getMonth(),
        };
        render();
    }

    function setDate(day) {
        var oldDateValue = targetEl.value;
        var date = '%Y-%m-%d'
            .replace('%d', ('0'+ day).slice(-2))
            .replace('%m', ('0' + (current.month + 1)).slice(-2))
            .replace('%Y', current.year);
        targetEl.value = date;

        if (date !== oldDateValue) {
            if ('createEvent' in document) {
                var changeEvent = document.createEvent('HTMLEvents');
                changeEvent.initEvent('change', false, true);
                targetEl.dispatchEvent(changeEvent);
            } else {
                targetEl.fireEvent('onchange');
            }
        }
    }

    function close() {
        current = null;
        targetEl = null;
        if (picker) { picker.remove(); }
    }

}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = TinyPicker;
} else {
    window.TinyPicker = TinyPicker;
}