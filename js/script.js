'use strict';

const {DateTime} = window.luxon;

const FIRST_DAY = DateTime.local(2021, 1, 19);
const LAST_DAY = DateTime.local(2021, 4, 21);
const today = DateTime.now();
const format = "LLL d";

document.getElementById("today").innerText = "Today: " + today.toFormat(format);

document.getElementById("lastDay").innerText = "Last day: " + LAST_DAY.toFormat(format);
document.getElementById("classesUntilLastDay").innerText = "Classes until: " + classesUntilLastDay(today, LAST_DAY);
document.getElementById("daysUntilLastDay").innerText = "Days until: " + daysUntil(today, LAST_DAY);
const progressPercent = (daysUntil(FIRST_DAY, LAST_DAY) - daysUntil(today, LAST_DAY))/daysUntil(FIRST_DAY, LAST_DAY) * 100;
document.getElementById("progressDay").value = progressPercent;
document.getElementById("progressDayLabel").innerText = Math.floor(progressPercent) + "%";

document.getElementById("nextWellness").innerText =
    "Next wellness break: " + getDaysOff(today, LAST_DAY)[0].toFormat(format);
document.getElementById("daysToNextWellness").innerText =
    "Classes until: " + classesUntil(today, getDaysOff(today, LAST_DAY)[0]);

function classesUntilLastDay(start, end) {
    const weekdaysUntil = classesUntil(start, end);
    let amtDaysOff = getDaysOff(start, end).length;
    return weekdaysUntil - amtDaysOff;
}

function getDaysOff(start, end) {
    const daysOff = [
        DateTime.local(2021, 2, 24),
        DateTime.local(2021, 3, 23)
    ];

    return daysOff.filter(d => d > start && d < end);
}

function classesUntil(start, end) {
    // make sure end date is a class day
    console.assert(end.weekday < 6);

    // if on weekend, go to the next monday
    let isWeekend = start.weekday >= 6;
    if (isWeekend) {
        start = start.plus({days: 8 - start.weekday});
    }

    // assuming same year
    console.assert(end.year === start.year);
    const weeksApart = end.weekNumber - start.weekNumber;

    // multiply by 2 for Saturday and Sunday
    // if weekday, class day has not occurred yet, so add 1
    return daysUntil(start, end) - (weeksApart * 2) + isWeekend;
}

function daysUntil(start, end) {
    return Math.ceil(start.until(end).toDuration('days').days);
}

(function test() {
    console.log("Running tests for classes until");

    // friday and a monday
    console.assert(
        classesUntil(DateTime.local(2021, 2, 26), DateTime.local(2021, 3, 1)) === 1);

    // same week
    console.assert(
        classesUntil(DateTime.local(2021, 2, 22), DateTime.local(2021, 2, 25)) === 3);

    // 2 weeks out
    console.assert(
        classesUntil(DateTime.local(2021, 2, 24), DateTime.local(2021, 3, 9)) === 9);

    // weekend to weekday check
    console.assert(
        classesUntil(DateTime.local(2021, 2, 21), DateTime.local(2021, 3, 1)) === 6);
    console.assert(
        classesUntil(DateTime.local(2021, 2, 20), DateTime.local(2021, 3, 1)) === 6);

    console.log("No errors found!");
})()