function TinyPicker(query, options) {
    var defaultOptions = {
        start: 1,
        format: '%Y-%m-%d',
        months: ['January','February','March','April','May','June','July','August','September','October','November','December'],
        days: ['S','M','T','W','T','F','S'],
        doubleMonth: true,
        stayOpen: true,
        range: true,
        history: false
    };
    var DIV = 'div';
    var queryElms;
    var currentDate = new Date();

    if (!(this instanceof TinyPicker)) {
        return new TinyPicker(query, options);
    }

    options = extend({}, defaultOptions, options);
    document.addEventListener('click', function(e) {setOpenBindings(e.target);}, false);
    var picker = null, targetEl = null, current, selected;

    function setOpenBindings(target) {
        queryElms = document.querySelectorAll(query);
        var className = target.className;
        if (className === 'next') {
            getNextMonth();
        } else if (className === 'prev') {
            getPreviousMonth();
        } else if (className === 'day') {
            setDate(target.innerHTML);
            if (options.stayOpen) {
                close();
                openNext();
            } else {
                close();
            }
        } else {
            while (target && !matchesReferrerEl(target) && className !== 'dp') {
                target = target.parentNode;
            }
            if (target && matchesReferrerEl(target)) { render(target); }
            if (!target) { close(); }
        }
    }

    function openNext() {
        for (var i = 0; i < queryElms.length; i++) {
            if (!queryElms[i].value) {render(queryElms[i]);}
        }
    }

    function matchesReferrerEl(elm) {
        for (var i = 0; i < queryElms.length; i++) {
            if (elm === queryElms[i]) {return true;}
        }
        return false;
    }

    function addWeek(days) {
        var week = createEl(DIV);
        week.classList.add('w');
        for (var i = 0; i < days.length; i++) {
            appendChild(week, days[i]);
        }
        return week;
    }

    function render(target) {
        targetEl = typeof target !== typeof undefined ? target : targetEl;
        if (target || typeof current === typeof undefined) {
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
        picker = createEl(DIV);
        picker.classList.add('dp');
        picker.style.cssText = 'left:' + targetEl.offsetLeft+ 'px;top:' + (targetEl.offsetTop + targetEl.offsetHeight) + 'px;solid:blue;';
        appendChild(picker, getNav());
        appendChild(picker, getHeader());
        for (var i = 0; i < getWeeks().length; i++) {
            appendChild(picker, getWeeks()[i]);
        }

        targetEl.parentNode.insertBefore(picker, targetEl.nextSibling);
    }

    function getNav() {
        var nav = createEl(DIV);
        nav.classList.add('tn');

        var previousMonth = createEl(DIV);
        previousMonth.className = 'prev';
        previousMonth.innerHTML = '<';

        var currentMonth = document.createTextNode(options.months[current.month] + ' ' + current.year);

        var nextMonth = createEl(DIV);
        nextMonth.className = 'next';
        nextMonth.innerHTML = '>';

        appendChild(nav, previousMonth);
        appendChild(nav, currentMonth);
        appendChild(nav, nextMonth);

        return nav;
    }

    function getHeader() {
        var weekdays = options.days.slice(options.start).concat(options.days.slice(0, options.start));
        var header = createEl(DIV);
        header.classList.add('wh');
        for (var i = 0; i < 7; i++) {
            var dayOfWeek = createEl(DIV);
            dayOfWeek.innerHTML = weekdays[i];
            appendChild(header, dayOfWeek);
        }
        return header;
    }

    function getWeeks() {
        var firstOfMonth = new Date(current.year, current.month, 1).getDay();
        firstOfMonth = firstOfMonth < options.start ? 7+(firstOfMonth - options.start ) : firstOfMonth - options.start;
        var daysInMonth = new Date(current.year, current.month + 1, 0).getDate();
        var days = [];
        var weeks = [];

        // Create empty spaces for last month
        for (var i = firstOfMonth - 1; i >= 0; i--) {
            days.push(createEl(DIV));
        }
        // current month days
        for (var i = 0; i < daysInMonth; i++) {
            if (i && (firstOfMonth + i) % 7 === 0) {
                weeks.push(addWeek(days));
                days = [];
            }
            var currentMonthDay = createEl(DIV);
            currentMonthDay.classList.add('day');
            if (selected && selected.year === current.year && selected.month === current.month && selected.day === i + 1) {
                currentMonthDay.classList.add('selected');
            }
            currentMonthDay.innerHTML = i + 1;
            if (currentDate.getDate() > currentMonthDay.innerHTML && currentDate.getMonth() === current.month && currentDate.getFullYear() === current.year) {
                currentMonthDay.classList.add('disabled');
            }
            days.push(currentMonthDay);
        }
        // Create empty spaces for next month
        if (days.length) {
            var len = days.length;
            for (var i = 0; i < 7 - len; i++) {
                days.push(createEl(DIV));
            }
            weeks.push(addWeek(days));
        }
        return weeks;
    }

    function getNextMonth() {
        var currentSelectedDate = new Date(current.year, current.month + 1);
        current = {
            year: currentSelectedDate.getFullYear(),
            month: currentSelectedDate.getMonth(),
        };
        render();
    }

    function getPreviousMonth() {
        var currentSelectedDate = new Date(current.year, current.month - 1);
        if (options.history || (current.month <= currentDate.getMonth() && current.year == currentDate.getFullYear())) { return; } // Do not let them go backwards
        current = {
            year: currentSelectedDate.getFullYear(),
            month: currentSelectedDate.getMonth(),
        };
        render();
    }

    function setDate(day) {
        var oldDateValue = targetEl.value;
        var date = options.format
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

    /*
     * HELPERS
     */

    function extend(out) {
        var args = arguments;
        out = out || {};
        for (var i = 1; i < args.length; i++) {
            if (args[i]) {
                for (var key in args[i]) {
                    if (args[i].hasOwnProperty(key)) {
                        out[key] = args[i][key];
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

    function createEl(type) {
        return document.createElement(type);
    }

    function appendChild(parent, child){
        parent.appendChild(child);
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = TinyPicker;
} else {
    window.TinyPicker = TinyPicker;
}