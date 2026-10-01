/* Module 15: Elapsed Time. Lessons, vocabulary and question skills. */
(function () {
  'use strict';
  var B = window.Bank, R = B.R, S = B.s, Q = B.q, T = Q.trap;
  var x = S.x, note = S.note, bars = S.bars, lines = S.lines;

  /* ---------- Helpers ---------- */
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function h12(h) { return ((h + 11) % 12) + 1; }
  /* A time is stored as minutes since midnight, 0 to 1439. */
  function clk(t) { var h = Math.floor(t / 60); return h12(h) + ':' + pad2(t % 60) + ' ' + (h < 12 ? 'a.m.' : 'p.m.'); }
  function short(t) { return h12(Math.floor(t / 60)) + ':' + pad2(t % 60); }
  function c24(t) { return pad2(Math.floor(t / 60)) + pad2(t % 60); }
  function c24c(t) { return pad2(Math.floor(t / 60)) + ':' + pad2(t % 60); }
  function plur(n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); }
  function dur(m) {
    var h = Math.floor(m / 60), r = m % 60;
    if (!h) return plur(r, 'minute');
    if (!r) return plur(h, 'hour');
    return plur(h, 'hour') + ' ' + plur(r, 'minute');
  }
  function rep(c, n) { var o = ''; for (var i = 0; i < n; i++) o += c; return o; }
  function padR(s, n) { while (s.length < n) s += ' '; return s; }
  function ctr(s, n, f) { var t = n - s.length; if (t <= 0) return s; var l = Math.floor(t / 2); return rep(f, l) + s + rep(f, t - l); }
  function val(s) { var m = String(s).match(/^(\d+)\/(\d+)$/); return m ? m[1] / m[2] : parseFloat(s); }
  /* Q.num with the trap list cleaned: no trap may equal the answer, repeat, or be a bad number. */
  function N(o) {
    var a = val(o.answer), seen = {};
    o.traps = (o.traps || []).filter(function (t) {
      var s = String(t.value), v = val(s);
      if (!/^\d+(\.\d+)?$|^\d+\/\d+$/.test(s) || !isFinite(v) || Math.abs(v - a) < 1e-9 || seen[s]) return false;
      seen[s] = true; t.value = s; return true;
    });
    return Q.num(o);
  }

  /* A text clock face. The minute hand number is shown in [ ] and the hour hand number in ( ). */
  function ring(minN, hourN) {
    var pos = { 12: [0, 3], 1: [1, 4], 2: [2, 5], 3: [3, 6], 4: [4, 5], 5: [5, 4], 6: [6, 3], 7: [5, 2], 8: [4, 1], 9: [3, 0], 10: [2, 1], 11: [1, 2] };
    var g = [], r, c;
    for (r = 0; r < 7; r++) { g[r] = []; for (c = 0; c < 7; c++) g[r][c] = '    '; }
    g[3][3] = ' o  ';
    Object.keys(pos).forEach(function (k) {
      var n = parseInt(k, 10), p = pos[k], s = String(n), t;
      if (n === minN) t = '[' + s + ']';
      else if (n === hourN) t = '(' + s + ')';
      else t = ' ' + s + ' ';
      g[p[0]][p[1]] = padR(t, 4);
    });
    var out = [];
    for (r = 0; r < 7; r++) out.push(g[r].join('').replace(/\s+$/, ''));
    out.push('[ ] long hand');
    if (hourN) out.push('( ) short hand');
    return out;
  }

  /* A number line. points are labels. jumps are the words on each hop. */
  function jl(points, jumps) {
    var w = 11, a = '', b = '', i;
    for (i = 0; i < points.length; i++) a += padR(points[i], w);
    for (i = 0; i < jumps.length; i++) b += '|' + ctr(jumps[i], w - 1, '_');
    b += '|';
    return [a.replace(/\s+$/, ''), b];
  }

  function fmts(mode) { return mode === 24 ? { cap: c24c, lab: c24c } : { cap: clk, lab: short }; }

  /* Jumps forward from s to e: to the next whole hour, then whole hours, then leftover minutes. */
  function jumpsFor(s, e) {
    var pts = [s], js = [], cur = s;
    function go(to) { var d = to - cur; js.push({ d: d, hours: d >= 60 && d % 60 === 0, from: cur, to: to }); pts.push(to); cur = to; }
    var nh = Math.ceil(s / 60) * 60;
    if (s % 60 !== 0) {
      if (e <= nh) { go(e); return { pts: pts, js: js }; }
      go(nh);
    }
    var fh = Math.floor(e / 60) * 60;
    if (fh > cur) go(fh);
    if (e > cur) go(e);
    return { pts: pts, js: js };
  }
  function jt(j) { return '+' + (j.hours ? plur(j.d / 60, 'hour') : j.d + ' min'); }
  function nl(J, k, F) {
    var p = [], j = [], i;
    for (i = 0; i <= k; i++) p.push(F.lab(J.pts[i]));
    for (i = 0; i < k; i++) j.push(jt(J.js[i]));
    return jl(p, j);
  }

  /* Elapsed time by counting up. */
  function countUpSteps(s, e, mode) {
    var F = fmts(mode), J = jumpsFor(s, e), n = J.js.length, total = e - s, st = [], i;
    st.push(x('We start at ' + F.cap(s) + ' and want to reach ' + F.cap(e) + '. We will count up on a number line.', [F.cap(s), 'start'], ' to ', [F.cap(e), 'end']));
    for (i = 0; i < n; i++) {
      var j = J.js[i], c;
      if (j.hours) c = 'Jump whole hours. From ' + F.cap(j.from) + ' to ' + F.cap(j.to) + ' is ' + plur(j.d / 60, 'hour') + ', which is ' + j.d + ' minutes.';
      else if (i === 0 && s % 60 !== 0 && n > 1) c = 'First jump to the next whole hour. From ' + F.cap(j.from) + ' to ' + F.cap(j.to) + ' is ' + j.d + ' minutes.';
      else c = 'Jump from ' + F.cap(j.from) + ' to ' + F.cap(j.to) + '. That is ' + j.d + ' minutes.';
      st.push(lines(c, nl(J, i + 1, F), 1));
    }
    if (n > 1) {
      var parts = J.js.map(function (q) { return String(q.d); }).join(' + ');
      st.push(x('Add up all the jumps. ' + parts + ' = ' + total + ' minutes.', parts + ' = ', [total + ' minutes', 'elapsed']));
    }
    if (n === 1) {
      var mm = e % 60 === 0 ? '60 − ' + (s % 60) : (e % 60) + ' − ' + (s % 60);
      st.push(x('We can check by taking away the minutes. ' + mm + ' = ' + total + '.', mm + ' = ', [String(total), 'minutes']));
    }
    st.push(x(total >= 60 ? 'The time that passed is ' + total + ' minutes. That is ' + dur(total) + '.' : 'The time that passed is ' + total + ' minutes.', 'Elapsed time: ', [total >= 60 ? total + ' min = ' + dur(total) : total + ' minutes', 'answer']));
    return st;
  }

  /* End time: add the length of the event by hopping through whole hours. */
  function endSteps(s, d, mode) {
    var F = fmts(mode), e = s + d, J = jumpsFor(s, e), st = [], cum = 0;
    st.push(x('It starts at ' + F.cap(s) + ' and lasts ' + dur(d) + '. We add the time in chunks and use whole hours as stepping stones.', [F.cap(s), 'start'], ' + ', [dur(d), 'length']));
    J.js.forEach(function (j, i) {
      cum += j.d;
      var left = d - cum, c;
      if (j.hours) c = 'Add ' + plur(j.d / 60, 'hour') + ' to reach ' + F.cap(j.to) + '.';
      else if (i === 0 && s % 60 !== 0 && J.js.length > 1) c = 'It takes ' + j.d + ' minutes to reach the next whole hour, ' + F.cap(j.to) + '.';
      else c = 'Add ' + j.d + ' minutes to reach ' + F.cap(j.to) + '.';
      c += left > 0 ? ' There are ' + left + ' more minutes to add.' : ' Nothing is left to add.';
      st.push(lines(c, nl(J, i + 1, F), 1));
    });
    if (J.js.length < 3) st.push(x('Check by going back. ' + F.cap(e) + ' minus ' + dur(d) + ' is ' + F.cap(s) + '.', F.cap(e) + ' − ' + dur(d) + ' = ', [F.cap(s), 'start again']));
    st.push(x('The event ends at ' + F.cap(e) + '.', 'End time: ', [F.cap(e), 'answer']));
    return st;
  }

  /* Start time: count backwards from the end. */
  function backJumps(e, d) {
    var pts = [e], js = [], cur = e, left = d;
    function back(a) { var to = cur - a; left -= a; js.push({ d: a, hours: a >= 60 && a % 60 === 0, from: cur, to: to, left: left }); pts.push(to); cur = to; }
    var m = cur % 60;
    if (m > 0) { if (left <= m) { back(left); return { pts: pts, js: js }; } back(m); }
    var h = Math.floor(left / 60);
    if (h > 0) back(h * 60);
    if (left > 0) back(left);
    return { pts: pts, js: js };
  }
  function startSteps(e, d, mode) {
    var F = fmts(mode), J = backJumps(e, d), st = [], s = e - d;
    st.push(x('It ends at ' + F.cap(e) + ' and lasts ' + dur(d) + '. To find the start, we count backwards from the end.', [F.cap(e), 'end'], ' − ', [dur(d), 'length']));
    J.js.forEach(function (j, i) {
      var pts = J.pts.slice(0, i + 2).reverse().map(F.lab), jm = J.js.slice(0, i + 1).reverse().map(function (q) { return '−' + (q.hours ? plur(q.d / 60, 'hour') : q.d + ' min'); });
      var c;
      if (j.hours) c = 'Jump back ' + plur(j.d / 60, 'hour') + ' to ' + F.cap(j.to) + '.';
      else if (i === 0 && e % 60 !== 0 && J.js.length > 1) c = 'First jump back to the whole hour, ' + F.cap(j.to) + '. That is ' + j.d + ' minutes.';
      else c = 'Jump back ' + j.d + ' minutes to ' + F.cap(j.to) + '.';
      c += j.left > 0 ? ' There are ' + j.left + ' more minutes to go back.' : ' Nothing is left to go back.';
      st.push(lines(c, jl(pts, jm), 1));
    });
    if (J.js.length < 3) st.push(x('Check by counting up. ' + F.cap(s) + ' plus ' + dur(d) + ' is ' + F.cap(e) + '.', F.cap(s) + ' + ' + dur(d) + ' = ', [F.cap(e), 'end again']));
    st.push(x('The event started at ' + F.cap(s) + '.', 'Start time: ', [F.cap(s), 'answer']));
    return st;
  }

  /* Choice options for a clock time. others is a list of [minutes, kind words]. */
  function timeOpts(correct, others) {
    var seen = {}, opts = [{ text: clk(correct), ok: true }];
    seen[clk(correct)] = 1;
    others.forEach(function (o) {
      var t = o[0], s = clk(((t % 1440) + 1440) % 1440);
      if (!seen[s]) { seen[s] = 1; opts.push({ text: s, ok: false, trap: o[1] }); }
    });
    return opts;
  }
  var NEXT_HOUR = 'You forgot to move into the next hour. Count up to the next whole hour first, then add what is left.';

  /* ---------- Vocabulary ---------- */
  window.MATH_VOCAB[15] = [
    { w: 'Elapsed time', m: 'How much time passes between a start time and an end time.' },
    { w: 'a.m.', m: 'The hours from midnight up to just before noon. Morning time.' },
    { w: 'p.m.', m: 'The hours from noon up to just before midnight. Afternoon and evening time.' },
    { w: 'Noon', m: 'The middle of the day. It is 12:00 p.m., or 1200 on the 24 hour clock.' },
    { w: 'Midnight', m: 'The middle of the night, when one day ends and the next begins. It is 12:00 a.m.' },
    { w: '24 hour clock', m: 'A clock that counts the hours from 0 to 23, so it never needs a.m. or p.m. 3:45 p.m. is 1545.' },
    { w: 'Schedule', m: 'A plan that lists what happens and when, like a timetable for a day at camp.' },
    { w: 'Convert', m: 'To change a measure into another unit that means the same amount, like 2 hours into 120 minutes.' }
  ];

  /* ---------- Lessons ---------- */
  window.MATH_LESSONS[15] = [
    { title: '1. Reading a clock to the minute',
      explain: [
        'A clock has two hands. The short hand tells the hour. The long hand tells the minutes.',
        'When the long hand points at a number, count by fives. The 1 means 5 minutes. The 2 means 10 minutes. The 3 means 15 minutes, and so on. Between two numbers there are 4 tiny marks, and each mark is 1 minute.',
        'Read the hour first, then the minutes. Write the minutes with two digits. So 3 hours and 5 minutes is written 3:05.'
      ],
      rule: 'Short hand is the hour. Long hand is the minutes. Count by 5s around the clock.',
      mistake: 'Do not read the number under the long hand as the minutes. If the long hand is on the 7, it is 35 minutes, not 7.',
      steps: [
        lines('Here is a clock. The long hand is on the 9. The short hand is at the 3.', ring(9, 3), 0),
        x('Count by fives to the 9: 5, 10, 15, 20, 25, 30, 35, 40, 45. The 9 means 45 minutes.', ['9', 'long hand'], ' × 5 = ', ['45', 'minutes']),
        x('The short hand is at the 3, so the hour is 3.', ['3', 'short hand'], ' hours'),
        x('Write the hour, a colon, and then the minutes. This clock shows 3:45.', ['3', 'hour'], ':', ['45', 'minutes']),
        lines('Try another. The long hand is on the 4. The short hand has passed the 7 but has not reached the 8.', ring(4, 7), 0),
        x('The long hand on the 4 means 4 × 5 = 20 minutes. The short hand is just past the 7, so the hour is 7.', '4 × 5 = ', ['20', 'minutes']),
        x('The time is 7:20.', ['7', 'hour'], ':', ['20', 'minutes']),
        note('Learn these minute numbers. They come up all the time.', 'Number and minutes', ['12 means 0 minutes, the start of the hour', '3 means 15 minutes, a quarter past', '6 means 30 minutes, half past', '9 means 45 minutes, a quarter to the next hour'])
      ] },

    { title: '2. Minutes past and minutes to the hour',
      explain: [
        'One hour has 60 minutes. After the hour begins, the minutes count up from 0 to 60. When the long hand comes back to the 12, a new hour begins.',
        'Sometimes we need to know how many minutes are left until the next hour. Take the minutes away from 60.',
        'Half past means 30 minutes past the hour. Quarter past means 15 minutes past. Quarter to means 15 minutes before the next hour.'
      ],
      rule: 'Minutes until the next hour = 60 − the minutes now.',
      mistake: 'At 4:35 there are not 35 minutes until 5:00. Thirty five minutes have already gone by. Only 25 are left.',
      steps: [
        x('It is 4:35. How many minutes until 5:00?', ['4:35', 'now'], ' → ', ['5:00', 'next hour']),
        lines('Picture one full hour as a line. From 4:00 to 4:35 is 35 minutes already used.', jl(['4:00', '4:35', '5:00'], ['+35 min']), 1),
        lines('The rest of the hour is what we want. The whole hour is 60 minutes.', jl(['4:00', '4:35', '5:00'], ['+35 min', '+? min']), 1),
        x('Take away the minutes that are used. 60 − 35 = 25.', '60 − 35 = ', ['25', 'minutes left']),
        x('Check by counting up from 4:35 by fives. 5, 10, 15, 20, 25 gets to 5:00.', ['25 minutes', 'to 5:00']),
        x('Try 2:50. There are 60 − 50 = 10 minutes until 3:00.', '60 − 50 = ', ['10', 'minutes to 3:00']),
        note('These words are used every day.', 'Time words', ['Half past 4 is 4:30', 'Quarter past 4 is 4:15', 'Quarter to 5 is 4:45', 'At 4:45 there are 15 minutes to 5:00'])
      ] },

    { title: '3. a.m. and p.m.',
      explain: [
        'A clock face only has 12 numbers, but a day has 24 hours. So the clock goes around two times each day. We use a.m. and p.m. to tell the two trips apart.',
        'a.m. is for the time from midnight until just before noon. That is the night and the morning. p.m. is for the time from noon until just before midnight. That is the afternoon and the evening.',
        'Noon is 12:00 p.m. Midnight is 12:00 a.m. At these two times the clock changes from a.m. to p.m. or the other way.'
      ],
      rule: 'a.m. is midnight to noon. p.m. is noon to midnight.',
      mistake: '12:30 in the afternoon is 12:30 p.m., not a.m. The hour after noon is still p.m.',
      steps: [
        lines('Here is one whole day. The day starts at midnight, reaches noon in the middle, and ends at midnight.', ['midnight       noon       midnight', '12:00 a.m.   12:00 p.m.   12:00 a.m.', '|____ a.m. ____|____ p.m. ____|'], 2),
        x('Rinka eats breakfast at 7:30. That is in the morning, before noon. We write 7:30 a.m.', ['7:30 a.m.', 'morning']),
        x('Rinka eats supper at 7:30. That is in the evening, after noon. We write 7:30 p.m.', ['7:30 p.m.', 'evening']),
        x('The numbers are the same. Only a.m. and p.m. tell them apart.', '7:30 ', ['a.m.', 'morning'], ' or 7:30 ', ['p.m.', 'evening']),
        x('School ends at 3:15 in the afternoon. That is after noon, so it is 3:15 p.m.', ['3:15 p.m.', 'afternoon']),
        x('A movie starts at 11:45 at night. It is before midnight, so it is 11:45 p.m.', ['11:45 p.m.', 'night']),
        note('Ask yourself one question. Is it before noon or after noon?', 'A quick test', ['Before noon means a.m.', 'After noon means p.m.', 'Noon itself is 12:00 p.m.', 'Midnight itself is 12:00 a.m.'])
      ] },

    { title: '4. The 24 hour clock',
      explain: [
        'The 24 hour clock counts the hours from 0 all the way to 23. It never repeats, so it does not need a.m. or p.m. Trains, planes and hospitals use it.',
        'For morning times, the digits look almost the same. 9:30 a.m. is 0930. We add a zero in front so there are always four digits.',
        'For afternoon and evening times, add 12 to the hour. 3:45 p.m. is 15:45, and we can write it as 1545. The one exception is noon. 12:15 p.m. stays 1215.'
      ],
      rule: 'a.m. stays the same. p.m. add 12 to the hour. Noon hour stays 12.',
      mistake: 'Do not add 12 to 12 p.m. Noon is 1200, not 2400.',
      steps: [
        lines('Here are some matching times. Look at the pattern.', ['12 hour       24 hour', '12:00 a.m.     0000', '6:00 a.m.      0600', '12:00 p.m.     1200', '1:00 p.m.      1300', '3:45 p.m.      1545', '11:59 p.m.     2359'], 0),
        x('Change 3:45 p.m. to the 24 hour clock. It is p.m., so add 12 to the hour.', ['3', 'hour'], ' + 12 = ', ['15', 'new hour']),
        x('Keep the minutes the same. Put the hour and minutes together.', ['15', 'hour'], ['45', 'minutes'], ' = ', ['1545', '24 hour time']),
        x('Now change 8:20 a.m. It is a.m., so the hour stays the same. Add a zero in front.', ['08', 'hour'], ['20', 'minutes'], ' = ', ['0820', '24 hour time']),
        x('One more. 12:15 p.m. is just after noon. The hour stays 12.', '12:15 p.m. = ', ['1215', 'no change']),
        note('Keep this list handy.', 'Changing to 24 hour time', ['a.m. hours: keep the hour', 'p.m. hours: add 12', '12 p.m. is the only p.m. hour that stays 12', 'Always write four digits'])
      ] },

    { title: '5. Changing 24 hour time back to 12 hour time',
      explain: [
        'To go the other way, look at the hour. If the hour is 12 or more, it is afternoon or evening. Take away 12 and write p.m.',
        'If the hour is less than 12, it is morning. Keep the hour and write a.m. You can drop the zero in front.',
        'The hour 12 is the exception. 1205 is 12:05 p.m. because it is just after noon.'
      ],
      rule: 'Hour more than 12: take away 12 and write p.m. Hour less than 12: write a.m.',
      mistake: 'Do not forget the p.m. 1830 is 6:30 p.m., not 6:30 a.m.',
      steps: [
        x('Change 1830 to 12 hour time. The first two digits are the hour: 18. The last two are the minutes: 30.', ['18', 'hour'], ['30', 'minutes']),
        x('18 is more than 12, so it is p.m. Take away 12.', '18 − 12 = ', ['6', 'hour']),
        x('The minutes stay the same. So 1830 is 6:30 p.m.', '1830 = ', ['6:30 p.m.', 'answer']),
        x('Now change 0715. The hour is 07, which is less than 12. So it is a.m.', ['07', 'hour'], ' is less than 12'),
        x('Drop the zero in front. 0715 is 7:15 a.m.', '0715 = ', ['7:15 a.m.', 'answer']),
        x('One tricky one. 1205 has hour 12. That is just after noon.', '1205 = ', ['12:05 p.m.', 'answer'])
      ] },

    { title: '6. Elapsed time: counting up',
      explain: [
        'Elapsed time is how much time passes from a start time to an end time. It answers the question, "How long did it take?"',
        'The easiest way is to count up on a number line. Jump to the next whole hour first. Then jump whole hours. Then jump the last few minutes.',
        'Add up the jumps to get the answer. Each jump is easy because it starts or ends on a whole hour.'
      ],
      rule: 'Count up in jumps: to the next hour, then whole hours, then leftover minutes. Add the jumps.',
      mistake: 'Do not take away the minutes like plain numbers when the time crosses an hour. From 3:40 to 4:15 is not 25 minutes. It is 35.',
      steps: [note('We will find how long it is from 3:40 p.m. to 4:15 p.m.', 'Elapsed time', ['Start: 3:40 p.m.', 'End: 4:15 p.m.', 'Question: how many minutes pass?'])].concat(countUpSteps(15 * 60 + 40, 16 * 60 + 15, 12)) },

    { title: '7. Elapsed time with hours and minutes',
      explain: [
        'When more than an hour goes by, we still count up the same way. We add a jump for the whole hours in the middle.',
        'You can give the answer in minutes, or in hours and minutes. 105 minutes is the same as 1 hour 45 minutes, because 60 + 45 = 105.',
        'Always check that your answer makes sense. From 1:20 to 3:05 is a bit less than 2 hours.'
      ],
      rule: 'Count up in jumps and add them. 60 minutes make 1 hour.',
      mistake: 'Do not subtract 1:20 from 3:05 as if they were 305 and 120. Minutes are not out of 100. They are out of 60.',
      steps: countUpSteps(13 * 60 + 20, 15 * 60 + 5, 12).concat([note('Check your answer two ways.', 'Does it make sense?', ['From 1:20 to 3:20 would be exactly 2 hours', '3:05 is 15 minutes before 3:20', '120 − 15 = 105 minutes'])]) },

    { title: '8. Elapsed time across noon',
      explain: [
        'A trip might start in the morning and end in the afternoon. Then a.m. meets p.m., and the numbers on the clock get confusing.',
        'Here is a trick. Change both times to the 24 hour clock first. Then the hours just keep counting up, and you can subtract the hours.',
        'This works best when the minutes are the same. If they are not, count up on a number line.'
      ],
      rule: 'Change to 24 hour time. Then take the start hour away from the end hour.',
      mistake: 'Do not take 8 from 3 on the 12 hour clock. The end time is p.m., so its hour must be 15.',
      steps: [
        x('School starts at 8:30 a.m. and ends at 3:30 p.m. How many hours is that?', ['8:30 a.m.', 'start'], ' to ', ['3:30 p.m.', 'end']),
        x('Change the start to 24 hour time. It is a.m., so 8:30 a.m. is 0830. The hour is 8.', '8:30 a.m. = ', ['0830', 'hour 8']),
        x('Change the end. It is p.m., so add 12 to the hour. 3 + 12 = 15.', '3:30 p.m. = ', ['1530', 'hour 15']),
        x('The minutes are both 30, so we only take away the hours. 15 − 8 = 7.', '15 − 8 = ', ['7', 'hours']),
        lines('Check on a number line. From 8:30 a.m. to 12:30 p.m. is 4 hours. Then 3 more hours reaches 3:30 p.m.', jl(['8:30', '12:30', '3:30'], ['+4 hours', '+3 hours']), 1),
        x('4 + 3 = 7. Both ways give 7 hours.', '4 + 3 = ', ['7', 'hours'])
      ] },

    { title: '9. Finding the end time',
      explain: [
        'Sometimes you know when something starts and how long it lasts. You need to find when it ends.',
        'Start at the start time. Add the time in chunks, and use the next whole hour as a stepping stone. First add the minutes needed to reach the next hour. Then add what is left.',
        'Write the end time with a.m. or p.m. at the end.'
      ],
      rule: 'Add in chunks. Reach the next whole hour first, then add the rest.',
      mistake: '2:35 plus 50 minutes is not 2:85. There is no 85 on the clock. After 60 minutes we start a new hour.',
      steps: endSteps(14 * 60 + 35, 50, 12).concat([note('Check by going backward. 3:25 minus 50 minutes should be 2:35.', 'Does it make sense?', ['3:25 is 25 minutes after 3:00', '50 − 25 = 25 more minutes back', '3:00 minus 25 minutes is 2:35'])]) },

    { title: '10. Finding the start time',
      explain: [
        'Now the opposite. You know when something ends and how long it lasted. You need to find when it started.',
        'This time we count backwards from the end. First jump back to the whole hour. Then jump back whole hours. Then jump back the last few minutes.',
        'Check by counting up from your answer. You should land on the end time.'
      ],
      rule: 'Count backwards from the end time to find the start.',
      mistake: 'Do not add the length to the end time. The start is earlier than the end, so we go backwards.',
      steps: startSteps(16 * 60 + 10, 105, 12).concat([x('Check by counting up. 2:25 p.m. plus 1 hour 45 minutes lands on 4:10 p.m.', '2:25 + ', ['1 h 45 min', 'length'], ' = ', ['4:10', 'end'])]) },

    { title: '11. Schedules',
      explain: [
        'A schedule lists what happens in order. Each activity starts when the one before it ends.',
        'To fill in a schedule, find the end time of the first activity. That end time is the start of the next one. Keep going down the list.',
        'If there is a break, count the break too. It uses up time.'
      ],
      rule: 'The end of one activity is the start of the next. Add each length in order.',
      mistake: 'Do not forget breaks. A 10 minute break moves everything after it 10 minutes later.',
      steps: [
        lines('Music camp starts at 9:00 a.m. Warm up is 25 minutes. Band is 45 minutes. Snack is 15 minutes.', ['Activity    Length', 'Warm up     25 min', 'Band        45 min', 'Snack       15 min'], 0),
        lines('Warm up starts at 9:00. Add 25 minutes. It ends at 9:25.', ['Activity    Start   End', 'Warm up     9:00    9:25', 'Band', 'Snack'], 1),
        lines('Band starts when warm up ends, at 9:25. Add 45 minutes. 9:25 to 10:00 is 35 minutes, and 10 more makes 10:10.', ['Activity    Start   End', 'Warm up     9:00    9:25', 'Band        9:25    10:10', 'Snack'], 2),
        lines('Snack starts at 10:10. Add 15 minutes. It ends at 10:25.', ['Activity    Start   End', 'Warm up     9:00    9:25', 'Band        9:25    10:10', 'Snack       10:10   10:25'], 3),
        x('Check the total. 25 + 45 + 15 = 85 minutes. From 9:00 a.m. to 10:25 a.m. is 1 hour 25 minutes, which is 85 minutes.', '25 + 45 + 15 = ', ['85', 'minutes']),
        x('Camp ends at 10:25 a.m.', 'End of camp: ', ['10:25 a.m.', 'answer'])
      ] },

    { title: '12. Changing time units',
      explain: [
        'Time has many units. Here are the ones to know. 60 seconds make 1 minute. 60 minutes make 1 hour. 24 hours make 1 day. 7 days make 1 week.',
        'To change a bigger unit into a smaller unit, multiply. There are more small units. 3 hours is 3 × 60 = 180 minutes.',
        'To change a smaller unit into a bigger unit, divide. There are fewer big units. 300 minutes is 300 ÷ 60 = 5 hours.'
      ],
      rule: 'Big unit to small unit: multiply. Small unit to big unit: divide.',
      mistake: 'A day has 24 hours, not 12 and not 100. A week has 7 days.',
      steps: [
        lines('Learn this table of time facts.', ['1 minute = 60 seconds', '1 hour   = 60 minutes', '1 day    = 24 hours', '1 week   = 7 days'], 0),
        x('How many minutes are in 3 hours? Each hour has 60 minutes, so we multiply.', '3 × 60 = ', ['180', 'minutes']),
        x('How many hours are in 2 days? Each day has 24 hours.', '2 × 24 = ', ['48', 'hours']),
        x('Now go the other way. How many hours are in 300 minutes? We divide by 60.', '300 ÷ 60 = ', ['5', 'hours']),
        x('How many days are in 3 weeks? Each week has 7 days.', '3 × 7 = ', ['21', 'days']),
        x('Mixed units. 1 day and 6 hours is 24 + 6 = 30 hours.', '24 + 6 = ', ['30', 'hours']),
        x('Another mixed one. 150 minutes has 2 whole hours, which is 120 minutes. There are 30 minutes left over.', '150 = 120 + 30 = ', ['2 h 30 min', 'answer'])
      ] }
  ];

  /* ---------- Question skills ---------- */
  var SK = 'Elapsed time';
  var CONTEXTS = ['Rinka practises piano', 'A hockey game runs', 'A movie plays', 'Rinka reads her book', 'A soccer game runs', 'A swim lesson goes', 'A science fair runs', 'Rinka works on her puzzle'];
  function pickCtx() { return R.pick(CONTEXTS); }
  function startEndPrompt(ctx, s, e, ask) {
    return R.pick([
      ctx + ' from ' + clk(s) + ' to ' + clk(e) + '. ' + ask,
      'Start time: ' + clk(s) + '. End time: ' + clk(e) + '. ' + ask
    ]);
  }

  B.register(15, [

    { id: 'minhand', level: 1, name: 'Minutes from the long hand', make: function () {
      var k = R.int(1, 11), h = R.int(1, 12), m = k * 5, v = R.int(0, 2), p, teach;
      if (v === 0) {
        p = 'On a clock, the long hand points at the ' + k + '. How many minutes after the hour is it?';
      } else if (v === 1) {
        p = 'The short hand is just past the ' + h + '. The long hand is on the ' + k + '. How many minutes past ' + h + ' o\'clock is it?';
      } else {
        var w = R.pick([['quarter past', 15], ['half past', 30], ['ten past', 10], ['twenty past', 20], ['twenty five past', 25]]);
        p = 'A clock shows ' + w[0] + ' ' + h + '. How many minutes after the hour is that?';
        return N({
          skill: SK, prompt: p, answer: w[1], keyboard: 'numeric', placeholder: 'Type the minutes',
          traps: [], work: w[0] + ' means ' + w[1] + ' minutes past the hour.',
          plain: 'Past means after the hour. Half past is 30 minutes. Quarter past is 15 minutes.',
          teach: [
            x('The time is ' + w[0] + ' ' + h + '. The word past means the minutes after the hour.', [w[0], 'minutes after ' + h]),
            note('Learn the words.', 'Time words', ['Quarter past is 15 minutes', 'Half past is 30 minutes', 'Ten past is 10 minutes, twenty past is 20', 'Twenty five past is 25 minutes']),
            x(w[0] + ' means ' + w[1] + ' minutes.', [w[0], 'is'], ' = ', [String(w[1]), 'minutes']),
            x('So the time is written ' + h + ':' + pad2(w[1]) + '.', [h + ':' + pad2(w[1]), 'written time'])
          ]
        });
      }
      return N({
        skill: SK, prompt: p, answer: m, keyboard: 'numeric', placeholder: 'Type the minutes',
        traps: [T(String(k), 'That is the number the long hand points at. Each number on the clock stands for 5 minutes, so multiply by 5.')],
        work: k + ' × 5 = ' + m + ' minutes.',
        plain: 'The long hand counts in fives. Count by 5s until you reach the ' + k + '.',
        teach: [
          lines('Here is the clock. The long hand is on the ' + k + '.', ring(k, v === 1 ? h : null), 0),
          x('Each number is worth 5 minutes. Count by fives up to the ' + k + '.', 'Count by 5s: ', [Array.apply(null, Array(k)).map(function (_, i) { return (i + 1) * 5; }).join(', '), 'skip counting']),
          x(k + ' × 5 = ' + m + '.', k + ' × 5 = ', [String(m), 'minutes']),
          x('Check. The 6 means 30 minutes, so the ' + k + ' should be ' + (k < 6 ? 'less' : (k === 6 ? 'equal to' : 'more')) + ' than 30. ' + m + ' fits.', [String(m), 'makes sense'])
        ]
      });
    } },

    { id: 'minsto', level: 1, name: 'Minutes until the next hour', make: function () {
      var h = R.int(1, 12), mm = R.pick([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, R.int(1, 59), R.int(1, 59), R.int(1, 59)]);
      var nh = h % 12 + 1, ans = 60 - mm, base = h * 60;
      var p = R.pick([
        'The time is ' + h + ':' + pad2(mm) + '. How many minutes until ' + nh + ':00?',
        'Rinka\'s bus comes at ' + nh + ':00. It is now ' + h + ':' + pad2(mm) + '. How many minutes must she wait?',
        'A show starts at ' + nh + ':00. The clock says ' + h + ':' + pad2(mm) + '. How many minutes are left before it starts?'
      ]);
      var J = { pts: [base + mm, base + 60], js: [{ d: ans, hours: false, from: base + mm, to: base + 60 }] };
      return N({
        skill: SK, prompt: p, answer: ans, keyboard: 'numeric', placeholder: 'Type the minutes',
        traps: [T(String(mm), 'That is how many minutes have already passed in this hour. Take it away from 60 to find what is left.')],
        work: '60 − ' + mm + ' = ' + ans + ' minutes.',
        plain: 'An hour has 60 minutes. Take away the minutes already used to find the minutes left.',
        teach: [
          x('It is ' + h + ':' + pad2(mm) + '. We want to reach ' + nh + ':00. That is the next whole hour.', [h + ':' + pad2(mm), 'now'], ' → ', [nh + ':00', 'next hour']),
          lines(mm + ' minutes of this hour are already gone.', jl([h + ':00', h + ':' + pad2(mm), nh + ':00'], ['+' + mm + ' min']), 1),
          lines('Jump to the next hour. This is the part we want.', jl([h + ':00', h + ':' + pad2(mm), nh + ':00'], ['+' + mm + ' min', '+' + ans + ' min']), 1),
          x('An hour has 60 minutes. 60 − ' + mm + ' = ' + ans + '.', '60 − ' + mm + ' = ', [String(ans), 'minutes left'])
        ]
      });
    } },

    { id: 'ampm', level: 1, name: 'Choose a.m. or p.m.', make: function () {
      var t = R.pick([
        ['Rinka eats breakfast at 7:15 in the morning.', 'a.m.'], ['The school bell rings at 8:50 in the morning.', 'a.m.'],
        ['Recess starts at 10:30 in the morning.', 'a.m.'], ['A night owl looks at the clock at 1:30 in the morning.', 'a.m.'],
        ['Rinka gets out of bed at 6:45 in the morning.', 'a.m.'], ['Rinka eats supper at 6:00 in the evening.', 'p.m.'],
        ['Hockey practice ends at 8:15 in the evening.', 'p.m.'], ['The sun sets at 8:40 in the evening.', 'p.m.'],
        ['Lunch is at 12:15 in the afternoon.', 'p.m.'], ['Rinka has an afternoon snack at 3:20.', 'p.m.'],
        ['Fireworks start at 10:15 at night, before midnight.', 'p.m.'], ['School ends at 3:05 in the afternoon.', 'p.m.']
      ]);
      var other = t[1] === 'a.m.' ? 'p.m.' : 'a.m.';
      return Q.choice({
        skill: SK, prompt: t[0] + ' Which should you write after the time?',
        options: [
          { text: t[1], ok: true },
          { text: other, ok: false, trap: t[1] === 'a.m.' ? 'That time is before noon, so it is a.m.' : 'That time is after noon, so it is p.m.' },
          { text: 'Either one is fine', ok: false, trap: 'It matters. 7:00 a.m. is morning and 7:00 p.m. is evening. They are 12 hours apart.' }
        ],
        work: t[1] === 'a.m.' ? 'It happens before noon, so it is a.m.' : 'It happens after noon, so it is p.m.',
        plain: 'a.m. is the morning half of the day. p.m. is the afternoon and evening half.',
        teach: [
          lines('The day has two halves. Noon is the middle.', ['midnight       noon       midnight', '|____ a.m. ____|____ p.m. ____|'], 1),
          x('Ask yourself. Is this before noon or after noon?', [t[0], 'when?']),
          x(t[1] === 'a.m.' ? 'It is before noon. Before noon is a.m.' : 'It is after noon. After noon is p.m.', [t[1], 'answer']),
          note('Remember the test.', 'Before or after noon', ['Before noon is a.m.', 'After noon is p.m.'])
        ]
      });
    } },

    { id: 'to24', level: 2, name: 'Change to the 24 hour clock', make: function () {
      var t = R.int(10 * 60, 23 * 60 + 59);
      if (R.int(0, 2) > 0) t = t - (t % 5);
      if (t < 600) t = 600;
      var h = Math.floor(t / 60), mm = t % 60, pm = h >= 12, hh = h12(h), ans = c24(t);
      var p = R.pick([
        'Write ' + clk(t) + ' on the 24 hour clock. Type it as four digits, like 1545.',
        'A train leaves at ' + clk(t) + '. The schedule uses the 24 hour clock. Type the time as four digits.',
        'What is ' + clk(t) + ' in 24 hour time? Type four digits with no colon.'
      ]);
      var traps = [];
      if (h >= 13) traps.push(T(String(hh * 100 + mm), 'You forgot to add 12 to the hour. It is p.m., so ' + hh + ' + 12 = ' + h + '.'));
      if (h === 12) traps.push(T(String(2400 + mm), 'Do not add 12 to the hour at noon. The 12 o\'clock hour just after noon stays 12.'));
      return N({
        skill: SK, prompt: p, answer: ans, keyboard: 'numeric', placeholder: 'Four digits',
        traps: traps, work: pm ? (h === 12 ? 'The 12 o\'clock hour after noon stays 12, so the time is ' + ans + '.' : hh + ' + 12 = ' + h + ', so the time is ' + ans + '.') : 'It is a.m., so the hour stays ' + h + '. The time is ' + ans + '.',
        plain: pm ? 'For p.m. times, add 12 to the hour. Keep the minutes.' : 'For a.m. times the hour stays the same.',
        teach: [
          x('We change ' + clk(t) + ' to 24 hour time. First look at a.m. or p.m.', [clk(t), pm ? 'p.m.' : 'a.m.']),
          pm && h !== 12 ? x('It is p.m., so add 12 to the hour. ' + hh + ' + 12 = ' + h + '.', hh + ' + 12 = ', [String(h), 'new hour']) :
            (h === 12 ? x('It is the 12 o\'clock hour after noon. The hour stays 12.', ['12', 'stays the same']) : x('It is a.m., so the hour stays ' + h + '.', [String(h), 'same hour'])),
          x('The minutes stay ' + pad2(mm) + '.', [String(h), 'hour'], [pad2(mm), 'minutes']),
          x('Put them together as four digits. The answer is ' + ans + '.', clk(t) + ' = ', [ans, 'answer'])
        ]
      });
    } },

    { id: 'from24', level: 2, name: 'Change to the 12 hour clock', make: function () {
      var t = R.int(13 * 60, 23 * 60 + 59);
      if (R.int(0, 2) > 0) t = t - (t % 5);
      if (t < 780) t = 780;
      var h = Math.floor(t / 60), mm = t % 60, hh = h - 12, ans = clk(t);
      var opts = timeOpts(t, [
        [t - 720, 'That is the same time in the morning. The hour is more than 12, so it is p.m.'],
        [((h - 10) * 60 + mm), 'Take away 12, not 10, from the hour to change it to 12 hour time.'],
        [((h - 11) * 60 + mm), 'Take away 12 from the hour. ' + h + ' − 12 = ' + hh + '.'],
        [((h - 9) * 60 + mm), 'Take away 12 from the hour, not 9.']
      ]);
      return Q.choice({
        skill: SK, prompt: R.pick(['Which 12 hour time matches ' + c24(t) + '?', 'A bus schedule says ' + c24(t) + '. What time is that on a 12 hour clock?']),
        options: opts.slice(0, 4),
        work: 'The hour ' + h + ' is more than 12, so take away 12: ' + h + ' − 12 = ' + hh + '. It is p.m. The time is ' + ans + '.',
        plain: 'Hours after 12 mean afternoon or evening. Take away 12 and write p.m.',
        teach: [
          x('The time is ' + c24(t) + '. The first two digits are the hour: ' + h + '. The last two are the minutes: ' + pad2(mm) + '.', [String(h), 'hour'], [pad2(mm), 'minutes']),
          x(h + ' is more than 12, so it is afternoon or evening. That means p.m.', [String(h), 'more than 12'], ' → ', ['p.m.', 'afternoon or evening']),
          x('Take away 12 from the hour. ' + h + ' − 12 = ' + hh + '.', h + ' − 12 = ', [String(hh), 'new hour']),
          x('The answer is ' + ans + '.', c24(t) + ' = ', [ans, 'answer'])
        ]
      });
    } },

    { id: 'samehour', level: 2, name: 'Elapsed time inside one hour', make: function () {
      var h = R.int(1, 11), a = R.int(0, 8) * 5 + R.int(0, 1) * R.int(1, 4), b = a + R.int(2, 10) * 5 - R.int(0, 1) * 2;
      if (b > 59) b = 59;
      if (b <= a) b = a + 5;
      var pm = R.int(0, 1) === 1, base = (h % 12 + (pm ? 12 : 0)) * 60, s = base + a, e = base + b, ans = b - a, ctx = pickCtx();
      var ask = 'How many minutes went by?';
      return N({
        skill: SK, prompt: startEndPrompt(ctx, s, e, ask), answer: ans, keyboard: 'numeric', placeholder: 'Type the minutes',
        traps: [T(String(a + b), 'You added the minutes. Elapsed time is how much time passes, so count up from the start to the end.')],
        work: 'From ' + short(s) + ' to ' + short(e) + ' is ' + b + ' − ' + a + ' = ' + ans + ' minutes.',
        plain: 'Both times are in the same hour. Count up from the smaller minutes to the bigger minutes.',
        teach: countUpSteps(s, e, 12)
      });
    } },

    { id: 'overhour', level: 3, name: 'Elapsed time across an hour', make: function () {
      var h = R.int(1, 11), ms = R.int(7, 11) * 5 - R.int(0, 1) * R.int(0, 4), me = R.int(1, 5) * 5 + R.int(0, 1) * R.int(1, 4);
      if (ms >= 60) ms = 55;
      var pm = R.int(0, 1) === 1;
      if (pm && h > 10) h = R.int(1, 10);
      var base = (h % 12 + (pm ? 12 : 0)) * 60, s = base + ms, e = base + 60 + me, ans = e - s, ctx = pickCtx();
      var ask = 'How many minutes went by?';
      return N({
        skill: SK, prompt: startEndPrompt(ctx, s, e, ask), answer: ans, keyboard: 'numeric', placeholder: 'Type the minutes',
        traps: [T(String(Math.abs(me - ms)), 'You took the smaller minutes from the bigger ones, but the time crossed into the next hour. Count up to the whole hour first.'),
                T(String(ms + me), 'You added the two minute numbers. Count up to the next whole hour, then add the minutes after it.')],
        work: (60 - ms) + ' + ' + me + ' = ' + ans + ' minutes.',
        plain: 'Jump to the next whole hour first, then add the minutes after it.',
        teach: countUpSteps(s, e, 12)
      });
    } },

    { id: 'hoursnoon', level: 3, name: 'Hours from morning to afternoon', make: function () {
      var sh = R.int(6, 11), eh = R.int(1, 6), mm = R.pick([0, 15, 30, 45]);
      var s = sh * 60 + mm, e = (eh + 12) * 60 + mm, ans = eh + 12 - sh;
      var ctx = R.pick([['The farmers market opens at ' + clk(s) + ' and closes at ' + clk(e), 'is the market open'], ['Day camp starts at ' + clk(s) + ' and ends at ' + clk(e), 'does day camp last'], ['A ferry trip leaves at ' + clk(s) + ' and arrives at ' + clk(e), 'does the trip take'], ['The library is open from ' + clk(s) + ' to ' + clk(e), 'is the library open']]);
      var traps = [T(String(Math.abs(eh - sh)), 'You used the 12 hour numbers. The end time is p.m., so its hour is really ' + (eh + 12) + ' on the 24 hour clock.')];
      return N({
        skill: SK, prompt: ctx[0] + '. How many hours ' + ctx[1] + '?', answer: ans, keyboard: 'numeric', placeholder: 'Type the hours',
        traps: traps, work: 'On the 24 hour clock, ' + (eh + 12) + ' − ' + sh + ' = ' + ans + ' hours.',
        plain: 'Change the p.m. time by adding 12 to the hour. Then take the start hour away.',
        teach: [
          x('The start is ' + clk(s) + ' and the end is ' + clk(e) + '. The minutes match, so we only need the hours.', [clk(s), 'start'], ' to ', [clk(e), 'end']),
          x('Change the start to 24 hour time. It is a.m., so the hour stays ' + sh + '.', clk(s) + ' = ', [c24(s), 'hour ' + sh]),
          x('Change the end. It is p.m., so add 12 to the hour. ' + eh + ' + 12 = ' + (eh + 12) + '.', clk(e) + ' = ', [c24(e), 'hour ' + (eh + 12)]),
          x('Take the hours away. ' + (eh + 12) + ' − ' + sh + ' = ' + ans + '.', (eh + 12) + ' − ' + sh + ' = ', [String(ans), 'hours'])
        ]
      });
    } },

    { id: 'elapsedhm', level: 4, name: 'Elapsed minutes over an hour or more', make: function () {
      var s, d, e;
      for (var t = 0; t < 50; t++) {
        s = R.int(8 * 60, 15 * 60 + 55); s -= s % 5; d = R.int(75, 235); d -= d % 5;
        if (d % 60 !== 0 && s % 60 !== 0 && (s + d) % 60 !== 0 && s + d < 1400) break;
      }
      e = s + d;
      var ctx = R.pick([['A movie', 'starts', 'ends'], ['A hockey tournament game', 'starts', 'ends'], ['A hike', 'starts', 'ends'], ['A flight', 'leaves', 'lands'], ['A school concert', 'starts', 'ends']]);
      var naive = (h12(Math.floor(e / 60)) * 100 + e % 60) - (h12(Math.floor(s / 60)) * 100 + s % 60);
      var traps = [T(String(d % 60), 'That is only the leftover minutes. The question asks for all the minutes, so add the whole hours too.'),
                   T(String(Math.floor(d / 60) * 60), 'That is only the whole hours, in minutes. Do not forget the extra minutes at the end.')];
      if (naive > 0) traps.push(T(String(naive), 'You subtracted the times like plain numbers. But an hour has 60 minutes, not 100, so that does not work.'));
      return N({
        skill: SK, prompt: ctx[0] + ' ' + ctx[1] + ' at ' + clk(s) + ' and ' + ctx[2] + ' at ' + clk(e) + '. How many minutes long is it?',
        answer: d, keyboard: 'numeric', placeholder: 'Type the minutes',
        traps: traps, work: 'Count up from ' + short(s) + ' to ' + short(e) + '. The jumps add to ' + d + ' minutes, which is ' + dur(d) + '.',
        plain: 'Jump to the next hour, then whole hours, then the leftover minutes. Add the jumps.',
        teach: countUpSteps(s, e, 12)
      });
    } },

    { id: 'endtime12', level: 4, name: 'Find the end time', make: function () {
      var s = R.int(8 * 60, 16 * 60); s -= s % 5; var d = R.int(25, 175); d -= d % 5;
      if (s % 60 === 0) s += 15;
      var e = s + d;
      var ctx = R.pick([['A soccer game starts at ' + clk(s) + ' and lasts ' + dur(d), 'When does it end?'], ['A bus ride starts at ' + clk(s) + ' and takes ' + dur(d), 'When does the bus arrive?'],
                        ['Rinka begins her homework at ' + clk(s) + '. She works for ' + dur(d), 'When does she finish?'], ['A swim class starts at ' + clk(s) + ' and is ' + dur(d) + ' long', 'What time is it over?']]);
      var opts = timeOpts(e, [[e - 60, NEXT_HOUR], [e + 10, 'Check your adding. Count up to the next whole hour and then add the rest of the minutes.'], [e - 10, 'Check your adding. Count up to the next whole hour and then add the rest of the minutes.'], [e + 60, 'That is one hour too late. Add the minutes in chunks and check.']]);
      return Q.choice({
        skill: SK, prompt: ctx[0] + '. ' + ctx[1], options: opts.slice(0, 4),
        work: clk(s) + ' plus ' + dur(d) + ' is ' + clk(e) + '.',
        plain: 'Add in chunks. Reach the next whole hour first, then add the rest.',
        teach: endSteps(s, d, 12)
      });
    } },

    { id: 'endtime24', level: 5, name: 'Find the end time on the 24 hour clock', make: function () {
      var s = R.int(10 * 60, 18 * 60); s -= s % 5; var d = R.int(45, 290); d -= d % 5;
      if (s % 60 === 0) s += 20;
      var e = s + d;
      if (e >= 1439) { s = 11 * 60 + 20; e = s + d; }
      var sn = parseInt(c24(s), 10) + Math.floor(d / 60) * 100 + d % 60;
      var traps = [T(String(sn), 'You added like plain numbers. But there are only 60 minutes in an hour, so you must carry into the next hour.')];
      var ctx = R.pick(['A ferry leaves at ' + c24(s) + '. The trip takes ' + dur(d) + '. When does it arrive?', 'A train leaves at ' + c24(s) + ' and travels for ' + dur(d) + '. What time does it arrive?', 'A hockey camp starts at ' + c24(s) + ' and lasts ' + dur(d) + '. When does it finish?']);
      return N({
        skill: SK, prompt: ctx + ' Type the time as four digits.', answer: c24(e), keyboard: 'numeric', placeholder: 'Four digits',
        traps: traps, work: c24c(s) + ' plus ' + dur(d) + ' is ' + c24c(e) + ', or ' + c24(e) + '.',
        plain: 'Add the time in chunks, using the next whole hour as a stepping stone. Then write four digits.',
        teach: endSteps(s, d, 24)
      });
    } },

    { id: 'starttime', level: 5, name: 'Find the start time', make: function () {
      var e = R.int(13 * 60, 21 * 60); e -= e % 5; var d = R.int(35, 185); d -= d % 5;
      if (e % 60 === 0) e += 10;
      var s = e - d;
      if (s % 60 === 0) { d += 5; s = e - d; }
      if (R.int(0, 1) === 0) {
        var opts = timeOpts(s, [[s + 10, 'Check your counting back. Jump back to the whole hour first, then back the rest.'], [s - 10, 'Check your counting back. Jump back to the whole hour first, then back the rest.'], [s + 60, 'That is one hour too late. Count backwards in chunks and check.'], [s - 60, 'That is one hour too early. Count backwards in chunks and check.']]);
        return Q.choice({
          skill: SK, prompt: R.pick(['A movie ends at ' + clk(e) + ' and is ' + dur(d) + ' long. When did it start?', 'Rinka finished her chores at ' + clk(e) + '. They took ' + dur(d) + '. When did she start?', 'A concert ended at ' + clk(e) + ' after ' + dur(d) + '. When did it begin?']),
          options: opts.slice(0, 4),
          work: clk(e) + ' minus ' + dur(d) + ' is ' + clk(s) + '.',
          plain: 'Count backwards from the end time. Go to the whole hour first, then the rest.',
          teach: startSteps(e, d, 12)
        });
      }
      var sn = parseInt(c24(e), 10) - (Math.floor(d / 60) * 100 + d % 60);
      return N({
        skill: SK, prompt: 'A game ends at ' + c24(e) + ' and lasts ' + dur(d) + '. When did it start? Type the time as four digits.',
        answer: c24(s), keyboard: 'numeric', placeholder: 'Four digits',
        traps: [T(String(sn), 'You subtracted like plain numbers. An hour has 60 minutes, so you must borrow an hour and count in 60s.')],
        work: c24c(e) + ' minus ' + dur(d) + ' is ' + c24c(s) + ', or ' + c24(s) + '.',
        plain: 'Count backwards from the end time in chunks. Then write four digits.',
        teach: startSteps(e, d, 24)
      });
    } },

    { id: 'convert1', level: 3, name: 'Change big units to small units', make: function () {
      var v = R.int(0, 4), n, p, ans, tr, fact, tx;
      if (v === 0) { n = R.int(2, 9); ans = n * 60; p = 'How many minutes are in ' + n + ' hours?'; fact = '1 hour = 60 minutes'; tr = [T(String(n * 100), 'An hour has 60 minutes, not 100.')]; tx = [n + ' × 60 = ' + ans, 'minutes']; }
      else if (v === 1) { n = R.int(2, 6); ans = n * 24; p = 'How many hours are in ' + n + ' days?'; fact = '1 day = 24 hours'; tr = [T(String(n * 12), 'A day has 24 hours, not 12.')]; tx = [n + ' × 24 = ' + ans, 'hours']; }
      else if (v === 2) { n = R.int(2, 9); ans = n * 7; p = 'How many days are in ' + n + ' weeks?'; fact = '1 week = 7 days'; tr = [T(String(n * 5), 'A week has 7 days. Do not count only school days.')]; tx = [n + ' × 7 = ' + ans, 'days']; }
      else if (v === 3) { n = R.int(2, 8); ans = n * 60; p = 'How many seconds are in ' + n + ' minutes?'; fact = '1 minute = 60 seconds'; tr = [T(String(n * 100), 'A minute has 60 seconds, not 100.')]; tx = [n + ' × 60 = ' + ans, 'seconds']; }
      else {
        var h = R.int(1, 4), m = R.pick([10, 15, 20, 30, 45]); n = h; ans = h * 60 + m;
        p = 'How many minutes are in ' + h + ' ' + (h === 1 ? 'hour' : 'hours') + ' and ' + m + ' minutes?'; fact = '1 hour = 60 minutes';
        tr = [T(String(h * 100 + m), 'You joined the hours and minutes like a number. Change the hours to minutes first: ' + h + ' × 60 = ' + (h * 60) + '.')];
        return N({
          skill: SK, prompt: p, answer: ans, keyboard: 'numeric', placeholder: 'Type the minutes', traps: tr,
          work: h + ' × 60 = ' + (h * 60) + ', then ' + (h * 60) + ' + ' + m + ' = ' + ans + ' minutes.',
          plain: 'Change the hours to minutes by multiplying by 60. Then add the extra minutes.',
          teach: [
            x('We change ' + h + ' h ' + m + ' min into minutes. Start with the whole hours.', [h + ' h', 'hours'], ' + ', [m + ' min', 'minutes']),
            x('Each hour has 60 minutes. ' + h + ' × 60 = ' + (h * 60) + '.', h + ' × 60 = ', [String(h * 60), 'minutes']),
            x('Add the extra minutes. ' + (h * 60) + ' + ' + m + ' = ' + ans + '.', (h * 60) + ' + ' + m + ' = ', [String(ans), 'minutes']),
            x('So ' + h + ' h ' + m + ' min is ' + ans + ' minutes.', [h + ' h ' + m + ' min', 'equals'], ' = ', [ans + ' min', 'answer'])
          ]
        });
      }
      var unit = fact.split(' = ')[1];
      return N({
        skill: SK, prompt: p, answer: ans, keyboard: 'numeric', placeholder: 'Type a number', traps: tr,
        work: tx[0] + '.', plain: 'Going to a smaller unit means there are more of them. So multiply.',
        teach: [
          x(p, [p.replace('How many ', '').replace('?', ''), 'convert']),
          lines('Use this time fact.', [fact], 0),
          x('Change big units to small units by multiplying.', [String(n), 'how many'], ' × ', [unit.split(' ')[0], 'in each one']),
          x('Do the multiplying. ' + tx[0] + '.', tx[0].split(' = ')[0] + ' = ', [String(ans), tx[1]])
        ]
      });
    } },

    { id: 'convert2', level: 4, name: 'Change small units to big units', make: function () {
      var v = R.int(0, 4), p, ans, tr, work, plain, fact, a, b, unit;
      if (v === 0) { b = R.int(2, 9); a = b * 60; ans = b; p = 'How many hours are in ' + a + ' minutes?'; fact = '60 minutes = 1 hour'; unit = 'hours'; tr = [T(String(a), 'That is the number of minutes. Divide by 60 to change minutes into hours.')]; work = a + ' ÷ 60 = ' + ans + ' hours.'; }
      else if (v === 1) { b = R.int(2, 6); a = b * 24; ans = b; p = 'How many days are in ' + a + ' hours?'; fact = '24 hours = 1 day'; unit = 'days'; tr = [T(String(a), 'That is the number of hours. Divide by 24 to change hours into days.')]; work = a + ' ÷ 24 = ' + ans + ' days.'; }
      else if (v === 2) { b = R.int(2, 9); a = b * 7; ans = b; p = 'How many weeks are in ' + a + ' days?'; fact = '7 days = 1 week'; unit = 'weeks'; tr = [T(String(a), 'That is the number of days. Divide by 7 to change days into weeks.')]; work = a + ' ÷ 7 = ' + ans + ' weeks.'; }
      else if (v === 3) {
        var w = R.int(1, 4), d = R.int(2, 6); ans = w * 7 + d; p = 'A trip lasts ' + w + ' ' + (w === 1 ? 'week' : 'weeks') + ' and ' + d + ' days. How many days is that in all?';
        return N({
          skill: SK, prompt: p, answer: ans, keyboard: 'numeric', placeholder: 'Type the days',
          traps: [T(String(w + d), 'You added the numbers of weeks and days. Change the weeks to days first: ' + w + ' × 7 = ' + (w * 7) + '.')],
          work: w + ' × 7 = ' + (w * 7) + ', then ' + (w * 7) + ' + ' + d + ' = ' + ans + ' days.', plain: 'A week is 7 days. Change the weeks to days, then add the extra days.',
          teach: [
            x('Change the weeks to days. Each week has 7 days.', [w + ' weeks', 'to days'], ' × 7'),
            x(w + ' × 7 = ' + (w * 7) + '.', w + ' × 7 = ', [String(w * 7), 'days']),
            x('Add the extra days. ' + (w * 7) + ' + ' + d + ' = ' + ans + '.', (w * 7) + ' + ' + d + ' = ', [String(ans), 'days']),
            x('So ' + w + (w === 1 ? ' week and ' : ' weeks and ') + d + ' days is ' + ans + ' days.', [ans + ' days', 'answer'])
          ]
        });
      } else {
        var hh = R.int(2, 6), rr = R.int(1, 5) * 10 + R.int(0, 1) * 5; a = hh * 60 + rr;
        var ask = R.int(0, 1);
        p = ask ? 'Rinka practised for ' + a + ' minutes. How many whole hours is that?' : 'A video is ' + a + ' minutes long. That is ' + hh + ' whole hours and some minutes. How many minutes are left over?';
        ans = ask ? hh : rr;
        return N({
          skill: SK, prompt: p, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
          traps: [T(String(ask ? rr : hh), ask ? 'That is the leftover minutes. The question asks for the whole hours.' : 'That is the number of whole hours. The question asks for the minutes left over.')],
          work: hh + ' hours is ' + (hh * 60) + ' minutes. ' + a + ' − ' + (hh * 60) + ' = ' + rr + '. So ' + a + ' minutes is ' + hh + ' hours ' + rr + ' minutes.',
          plain: 'Find how many 60s fit into the minutes. What is left is the leftover minutes.',
          teach: [
            x('We split ' + a + ' minutes into whole hours and leftover minutes.', [String(a), 'minutes']),
            x('Count how many 60s fit. ' + hh + ' × 60 = ' + (hh * 60) + ', and that is not more than ' + a + '.', hh + ' × 60 = ', [String(hh * 60), 'fits']),
            x('The next hour would be ' + ((hh + 1) * 60) + ', which is too big. So there are ' + hh + ' whole hours.', [String(hh), 'whole hours']),
            x('Leftover minutes: ' + a + ' − ' + (hh * 60) + ' = ' + rr + '.', a + ' − ' + (hh * 60) + ' = ', [String(rr), 'minutes left over'])
          ]
        });
      }
      return N({
        skill: SK, prompt: p, answer: ans, keyboard: 'numeric', placeholder: 'Type a number', traps: tr,
        work: work, plain: 'Going to a bigger unit means there are fewer of them. So divide.',
        teach: [
          x(p, [p.replace('How many ', '').replace('?', ''), 'convert']),
          lines('Use this time fact.', [fact], 0),
          x('Change small units to big units by dividing.', [String(a), 'small units'], ' ÷ ', [fact.split(' ')[0], 'in one big unit']),
          x(work, a + ' ÷ ' + fact.split(' ')[0] + ' = ', [String(ans), unit])
        ]
      });
    } },

    { id: 'schedtotal', level: 5, name: 'Total time of a schedule', make: function () {
      var names = R.pick([['Warm up', 'Drills', 'Game'], ['Reading', 'Math', 'Art'], ['Stretching', 'Skating', 'Scrimmage'], ['Setup', 'Show', 'Cleanup']]);
      var a = R.int(2, 5) * 5, b = R.int(3, 8) * 5, c = R.int(3, 7) * 5, br = R.pick([0, 5, 10]);
      var total = a + b + c + 2 * br, plain = a + b + c;
      var intro = 'A practice has three parts. ' + names[0] + ' is ' + a + ' minutes. ' + names[1] + ' is ' + b + ' minutes. ' + names[2] + ' is ' + c + ' minutes.';
      var p = br ? intro + ' There is a ' + br + ' minute break after the first part and another after the second part. How many minutes does the whole practice take?' : intro + ' How many minutes does the whole practice take from start to finish?';
      var rows = [{ label: names[0], segs: [{ n: 1, cls: 'bg-indigo-400', text: a + ' min' }] }, { label: names[1], segs: [{ n: 1, cls: 'bg-emerald-400', text: b + ' min' }] }, { label: names[2], segs: [{ n: 1, cls: 'bg-amber-300', text: c + ' min' }] }];
      var tr = br ? [T(String(plain), 'You forgot the breaks. Each ' + br + ' minute break uses up time too.')] : [];
      return N({
        skill: SK, prompt: p, answer: total, keyboard: 'numeric', placeholder: 'Type the minutes', traps: tr,
        work: a + ' + ' + b + ' + ' + c + (br ? ' + ' + br + ' + ' + br : '') + ' = ' + total + ' minutes.',
        plain: 'Add the lengths of every part' + (br ? ', and add both breaks' : '') + '.',
        teach: [
          x('We add up the time for every part of the practice.', [String(a), names[0]], ' + ', [String(b), names[1]], ' + ', [String(c), names[2]]),
          bars('Here are the parts.', rows),
          x('Add the three parts. ' + a + ' + ' + b + ' + ' + c + ' = ' + plain + '.', a + ' + ' + b + ' + ' + c + ' = ', [String(plain), 'minutes'])
        ].concat(br ? [x('Now add the breaks. 2 breaks of ' + br + ' minutes is ' + (2 * br) + ' minutes. ' + plain + ' + ' + (2 * br) + ' = ' + total + '.', plain + ' + ' + (2 * br) + ' = ', [String(total), 'minutes'])] : [x('There are no breaks, so the total is ' + total + ' minutes.', [String(total), 'minutes'])])
      });
    } },

    { id: 'schedend', level: 6, name: 'Schedule end time', make: function () {
      var s = R.int(8, 15) * 60 + R.pick([0, 15, 30, 45]);
      var names = R.pick([['Circle time', 'Gym', 'Snack'], ['Warm up', 'Skills', 'Game'], ['Story', 'Craft', 'Clean up'], ['Sing along', 'Rehearsal', 'Photos']]);
      var a = R.int(2, 5) * 5, b = R.int(3, 9) * 5, c = R.int(2, 6) * 5, d = a + b + c, e = s + d;
      var opts = timeOpts(e, [[e - 60, NEXT_HOUR], [e + 10, 'Check the adding. Add the parts to find the total, then count up from the start.'], [e - 10, 'Check the adding. Add the parts to find the total, then count up from the start.'], [e + 60, 'That is one hour too late. Add the total minutes in chunks.']]);
      return Q.choice({
        skill: SK, prompt: 'Camp starts at ' + clk(s) + '. ' + names[0] + ' is ' + a + ' minutes, then ' + names[1] + ' is ' + b + ' minutes, then ' + names[2] + ' is ' + c + ' minutes. There are no breaks. When does camp finish?',
        options: opts.slice(0, 4),
        work: a + ' + ' + b + ' + ' + c + ' = ' + d + ' minutes. ' + clk(s) + ' plus ' + dur(d) + ' is ' + clk(e) + '.',
        plain: 'Add up all the parts first. Then count up from the start time.',
        teach: [
          x('First find the total time. Add the three parts.', [String(a), names[0]], ' + ', [String(b), names[1]], ' + ', [String(c), names[2]]),
          x(a + ' + ' + b + ' + ' + c + ' = ' + d + '. The whole camp is ' + d + ' minutes.', a + ' + ' + b + ' + ' + c + ' = ', [String(d), 'minutes'])
        ].concat(endSteps(s, d, 12))
      });
    } }
  ]);

  /* Clean up double full stops that appear when a time ending in a.m. or p.m. closes a sentence. */
  function clean(o) {
    if (typeof o === 'string') return o.replace(/\.\.(?!\.)/g, '.');
    if (Array.isArray(o)) { for (var i = 0; i < o.length; i++) o[i] = clean(o[i]); return o; }
    if (o && typeof o === 'object') { Object.keys(o).forEach(function (k) { o[k] = clean(o[k]); }); }
    return o;
  }
  clean(window.MATH_LESSONS[15]);
  B.skills[15].forEach(function (sk) { var mk = sk.make; sk.make = function () { return clean(mk()); }; });
})();
