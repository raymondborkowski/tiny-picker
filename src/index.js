function extend(out = {}) {
    for (var i = 1; i < arguments.length; i++) {
        if (!arguments[i]) { continue; }
        for (const key in arguments[i]) {
            if (arguments[i].hasOwnProperty(key)) { out[key] = arguments[i][key]; }
        }
    }
    return out;
}

class DatePicker {
    constructor(query, options) {
        this.options = extend({}, this.defaultOptions, options);
        this.query = query;
        Window.document.addEventListener('click', this.setOpenBindings, false);
        this.dp = '.dp';
    }

    setOpenBindings(e) {
        var target = e.target;
        while (target && !this.matchesReferrerEl(target) && target.className != this.dp) {
            target = target.parentNode;
        }
        if (target && this.matchesReferrerEl(target)) this.render(target);
        if (!target) this.close();
    }

    matchesReferrerEl(elm) {
        var referers = document.querySelectorAll(self.query);
        for (var i = 0; i < referers.length; i++) {
            if (elm === referers[i]) return true;
        }
        return false;
    }

    defaultOptions() {
        return {
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
        }
    }

    cleanPicker() {
        var picker = document.querySelector(this.dp);
        if (picker) picker.remove();
    }

    render(target = this.target) {
        if (target || typeof this.current === typeof undefined) {
            var currentDate = new Date();
            if (target) this.selected = null;
            if (target && target.value) {
                var ts = Date.parse(target.value.toLowerCase());
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
        this.drawPicker();
    }
}

module.exports = DatePicker;

