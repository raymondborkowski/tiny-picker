function extend(out = {}) {
    const obj = out;
    for (let i = 1; i < arguments.length; i++) {
        if (arguments[i]) {
            Object.keys(arguments[i]).forEach((key) => {
                if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
                    obj[key] = arguments[i][key];
                }
            });
        }
    }
    return obj;
}

const defaultOptions = {
    firstDayOfWeek: 0,
    months: {
        short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    },
    outputFormat: '%Y-%m-%d',
    weekdays: {
        short: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        long: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
};

class TinyPicker {
    constructor(query, options) {
        this.options = extend({}, defaultOptions, options);
        this.query = query;
        window.document.addEventListener('click', (e) => { this.setOpenBindings(e); }, false);
        this.dp = 'dp';
        this.picker = null;
    }

    setOpenBindings(e) {
        let target = e.target;
        if (target.className === 'month_nav next') {
            this.getNextMonth();
        } else if (target.className === 'month_nav previous') {
            this.getPreviousMonth();
        } else if (target.className === 'day') {
            this.setDate(target.innerHTML);
            this.close();
        } else {
            while (target && !this.matchesReferrerEl(target) && target.className !== this.dp) {
                target = target.parentNode;
            }
            if (target && this.matchesReferrerEl(target)) { this.render(target); }
            if (!target) { this.close(); }
        }
    }

    matchesReferrerEl(elm) {
        const referers = document.querySelectorAll(this.query);
        for (let i = 0; i < referers.length; i++) {
            if (elm === referers[i]) return true;
        }
        return false;
    }

    addWeek(days) {
        const week = document.createElement('div');
        week.classList.add('week');
        for (let i = 0; i < days.length; i++) {
            week.appendChild(days[i]);
        }
        return week;
    }

    render(target) {
        this.target = typeof target !== typeof undefined ? target : this.target;
        if (target || typeof this.current === typeof undefined) {
            let currentDate = new Date();
            if (target) { this.selected = null; }
            if (target && target.value) {
                const ts = Date.parse(target.value.toLowerCase());
                currentDate = new Date(ts);
                this.selected = {
                    year: currentDate.getFullYear(),
                    month: currentDate.getMonth(),
                    day: currentDate.getDate(),
                };
            }
            this.current = {
                year: currentDate.getFullYear(),
                month: currentDate.getMonth(),
            };
        }
        this.cleanPicker();
        this.draw();
    }

    cleanPicker() {
        const picker = document.querySelector(`.${this.dp}`);
        if (picker) picker.remove();
    }

    draw() {
        const position = {
            x: this.target.offsetLeft,
            y: this.target.offsetTop + this.target.offsetHeight,
        };
        this.picker = document.createElement('div');
        this.picker.classList.add('dp');
        this.picker.style.left = `${position.x}px`;
        this.picker.style.top = `${position.y}px`;
        this.picker.appendChild(this.getNav());
        this.picker.appendChild(this.getHeader());
        const weeks = this.getWeeks();
        for (let i = 0; i < weeks.length; i++) {
            this.picker.appendChild(weeks[i]);
        }

        this.target.parentNode.insertBefore(this.picker, this.target.nextSibling);
    }

    getNav() {
        const nav = document.createElement('div');
        nav.classList.add('title-nav');

        const previousMonth = document.createElement('div');
        previousMonth.classList.add('month_nav');
        previousMonth.classList.add('previous');
        previousMonth.innerHTML = '<';

        const currentMonth = document.createTextNode(`${this.options.months.long[this.current.month]} ${this.current.year}`);

        const nextMonth = document.createElement('div');
        nextMonth.classList.add('month_nav');
        nextMonth.classList.add('next');
        nextMonth.innerHTML = '>';

        nav.appendChild(previousMonth);
        nav.appendChild(currentMonth);
        nav.appendChild(nextMonth);

        return nav;
    }

    getHeader() {
        const weekdays = this.options.weekdays.short.slice(this.options.firstDayOfWeek)
            .concat(this.options.weekdays.short.slice(0, this.options.firstDayOfWeek));
        const header = document.createElement('div');
        header.classList.add('week-header');
        for (let i = 0; i < 7; i++) {
            const dayOfWeek = document.createElement('div');
            dayOfWeek.innerHTML = weekdays[i];
            header.appendChild(dayOfWeek);
        }
        return header;
    }

    getWeeks() {
        // Get first day of month and update acconding to options
        let firstOfMonth = new Date(this.current.year, this.current.month, 1).getDay();
        firstOfMonth =
            firstOfMonth < this.options.firstDayOfWeek ?
                7 + (firstOfMonth - this.options.firstDayOfWeek) :
                firstOfMonth - this.options.firstDayOfWeek;

        const daysInPreviousMonth = new Date(this.current.year, this.current.month, 0).getDate();
        const daysInMonth = new Date(this.current.year, this.current.month + 1, 0).getDate();

        let days = [];
        const weeks = [];
        // Define last days of previous month if current month does not start on `firstOfMonth`
        for (let i = firstOfMonth - 1; i >= 0; i--) {
            const lastMonthDay = document.createElement('div');
            lastMonthDay.classList.add('no-select');
            lastMonthDay.innerHTML = daysInPreviousMonth - i;
            days.push(lastMonthDay);
        }
        // Define days in current month
        for (let i = 0; i < daysInMonth; i++) {
            if (i && (firstOfMonth + i) % 7 === 0) {
                weeks.push(this.addWeek(days));
                days = [];
            }
            const currentMonthDay = document.createElement('div');
            currentMonthDay.classList.add('day');
            if (this.selected && this.selected.year === this.current.year &&
                this.selected.month === this.current.month && this.selected.day === i + 1) {
                currentMonthDay.classList.add('selected');
            }
            currentMonthDay.innerHTML = i + 1;
            days.push(currentMonthDay);
        }
        // Define days of next month if last week is not full
        if (days.length) {
            const len = days.length;
            for (let i = 0; i < 7 - len; i++) {
                const nextMonthDay = document.createElement('div');
                nextMonthDay.classList.add('no-select');
                nextMonthDay.innerHTML = i + 1;
                days.push(nextMonthDay);
            }
            weeks.push(this.addWeek(days));
        }
        return weeks;
    }

    getNextMonth() {
        const current = new Date(this.current.year, this.current.month + 1);
        this.current = {
            year: current.getFullYear(),
            month: current.getMonth(),
        };
        this.render();
    }

    getPreviousMonth() {
        const current = new Date(this.current.year, this.current.month - 1);
        this.current = {
            year: current.getFullYear(),
            month: current.getMonth(),
        };
        this.show();
    }

    setDate(day) {
        const oldDateValue = this.target.value;
        const dayOfWeek = new Date(this.current.year, this.current.month, day).getDay();
        const date = this.options.outputFormat
            .replace('%a', this.options.weekdays.short[dayOfWeek])
            .replace('%A', this.options.weekdays.long[dayOfWeek])
            .replace('%d', (`0${day}`).slice(-2))
            .replace('%e', day)
            .replace('%b', this.options.months.short[this.current.month])
            .replace('%B', this.options.months.long[this.current.month])
            .replace('%m', (`0${this.current.month + 1}`).slice(-2))
            .replace('%w', dayOfWeek)
            .replace('%Y', this.current.year);
        this.target.value = date;

        if (date !== oldDateValue) {
            if ('createEvent' in document) {
                const changeEvent = document.createEvent('HTMLEvents');
                changeEvent.initEvent('change', false, true);
                this.target.dispatchEvent(changeEvent);
            } else {
                this.target.fireEvent('onchange');
            }
        }
    }

    close() {
        delete this.current;
        delete this.target;
        if (this.picker) { this.picker.remove(); }
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = TinyPicker;
else
    window.TinyPicker = TinyPicker;
