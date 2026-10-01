/* Question banks and step builders.
   Each module file (js/m1.js ... js/m8.js) registers skills here.
   A skill makes a fresh question with new numbers every time, so practice and tests can be redone. */
(function () {
  'use strict';

  /* ---------- Random helpers ---------- */
  var R = {
    int: function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); },
    pick: function (arr) { return arr[Math.floor(Math.random() * arr.length)]; },
    shuffle: function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = a[i]; a[i] = a[j]; a[j] = t;
      }
      return a;
    },
    gcd: function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a; },
    lcm: function (a, b) { return a / R.gcd(a, b) * b; },
    fmt: function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); },
    /* n/d reduced, returned as text like "3/4" or "2" when d becomes 1 */
    fr: function (n, d) {
      var g = R.gcd(n, d); n /= g; d /= g;
      return d === 1 ? String(n) : n + '/' + d;
    }
  };

  /* ---------- Lesson step builders ---------- */
  /* x(cap, part, part ...): a row of big tokens. A string is plain. An array [text, tag] is highlighted. */
  function x(cap) {
    var parts = Array.prototype.slice.call(arguments, 1);
    return {
      kind: 'expr', cap: cap,
      tokens: parts.map(function (p) {
        return typeof p === 'string' ? { t: p, hi: false, tag: '' } : { t: p[0], hi: true, tag: p[1] || '' };
      })
    };
  }
  /* note(cap, title, points): a card with a title and short points */
  function note(cap, title, points) { return { kind: 'note', cap: cap, title: title, points: points || [] }; }
  /* bars(cap, rows): rows of boxes. Use fb() to make a fraction row. */
  function bars(cap, rows) { return { kind: 'bars', cap: cap, rows: rows }; }
  /* fb(label, den, num, cls, text, total): a bar cut in den parts, num of them shaded */
  function fb(label, den, num, cls, text, total) {
    var segs = [];
    for (var i = 0; i < den; i++) {
      segs.push({ n: 1, cls: i < num ? (cls || 'bg-indigo-400') : 'bg-slate-200', text: (den <= 8 && text) ? text : '' });
    }
    var row = { label: label, segs: segs };
    if (total) row.total = total;
    return row;
  }
  /* seg(cls, text, count): a helper row of count equal boxes */
  function row(label, count, cls, text, total) {
    var segs = [];
    for (var i = 0; i < count; i++) segs.push({ n: 1, cls: cls, text: text === undefined ? '' : String(text) });
    var r = { label: label, segs: segs };
    if (total) r.total = total;
    return r;
  }
  /* grid(cap, cols, rows, shades): shades are { c0, c1, r0, r1, cls } and later ones paint over earlier ones */
  function grid(cap, cols, rows, shades) { return { kind: 'grid', cap: cap, cols: cols, rows: rows, shades: shades || [] }; }
  /* groups(cap, groups, per, take): counters in equal groups. The first take groups are colored. */
  function groups(cap, g, per, take, tag) { return { kind: 'groups', cap: cap, groups: g, per: per, take: take || 0, tag: tag || '' }; }
  /* lines(cap, lines, hiFrom): monospace layout */
  function lines(cap, ls, hiFrom) { return { kind: 'lines', cap: cap, lines: ls, hiFrom: hiFrom === undefined ? 99 : hiFrom }; }

  /* numline(cap, o): a number line. o = { min, max, ticks:[{v,label}], marks:[{v,label}], jumps:[{from,to,label}] } */
  function numline(cap, o) { return { kind: 'numline', cap: cap, min: o.min, max: o.max, ticks: o.ticks || [], marks: o.marks || [], jumps: o.jumps || [] }; }
  /* clock(cap, h, m, tag): an analog clock. h is 1 to 12, m is 0 to 59 */
  function clock(cap, h, m, tag) { return { kind: 'clock', cap: cap, h: h, m: m, tag: tag || '' }; }
  /* bargraph(cap, labels, values, o): vertical bars. o = { max, title, hi } where hi is the index to highlight */
  function bargraph(cap, labels, values, o) { o = o || {}; return { kind: 'bargraph', cap: cap, labels: labels, values: values, max: o.max || Math.max.apply(null, values), title: o.title || '', hi: o.hi === undefined ? -1 : o.hi }; }

  /* ---------- Question builders ---------- */
  function capsOf(steps) { return (steps || []).map(function (s) { return s.cap; }); }
  function trap(value, say) { return { value: value, say: say }; }

  /* A trap that equals the right answer would never be shown, so drop it. */
  function cleanTraps(traps, answer) {
    function val(t) { var m = String(t).match(/^(\d+)\/(\d+)$/); return m ? m[1] / m[2] : parseFloat(t); }
    var a = val(answer);
    return (traps || []).filter(function (t) { var v = val(t.value); return !(String(t.value) === String(answer) || (isFinite(v) && isFinite(a) && Math.abs(v - a) < 1e-9)); });
  }

  /* num(o): a typed answer. o.teach is the list of animated steps for Teach Me. */
  function num(o) {
    var caps = capsOf(o.teach);
    return {
      type: 'number', keyboard: o.keyboard || 'text', placeholder: o.placeholder || 'Type your answer',
      simplest: !!o.simplest, skill: o.skill, prompt: o.prompt, answer: String(o.answer),
      traps: cleanTraps(o.traps, o.answer),
      hint: { nudge: o.nudge || caps[0] || 'Take it one step at a time.', steps: o.hintSteps || caps.slice(1, 4) },
      solution: { answer: o.answerText || String(o.answer), work: o.work || '', plain: o.plain || '' },
      teach: { steps: o.teach || [] }
    };
  }
  /* choice(o): options is a list of { text, ok, trap } */
  function choice(o) {
    var caps = capsOf(o.teach);
    var right = o.options.filter(function (op) { return op.ok; })[0];
    return {
      type: 'choice', skill: o.skill, prompt: o.prompt,
      options: R.shuffle(o.options),
      hint: { nudge: o.nudge || caps[0] || 'Take it one step at a time.', steps: o.hintSteps || caps.slice(1, 4) },
      solution: { answer: o.answerText || (right ? right.text : ''), work: o.work || '', plain: o.plain || '' },
      teach: { steps: o.teach || [] }
    };
  }
  /* divrem(o): quotient and remainder boxes */
  function divrem(o) {
    var caps = capsOf(o.teach);
    return {
      type: 'divrem', skill: o.skill, prompt: o.prompt, answer: o.answer, divisor: o.divisor,
      traps: o.traps || [],
      hint: { nudge: o.nudge || caps[0] || 'Take it one step at a time.', steps: o.hintSteps || caps.slice(1, 4) },
      solution: { answer: o.answer[0] + ' remainder ' + o.answer[1], work: o.work || '', plain: o.plain || '' },
      teach: { steps: o.teach || [] }
    };
  }

  /* ---------- Registry ---------- */
  var skills = {};
  function register(id, list) { skills[id] = list; }
  /* extend(id, list) adds more skills to a module that is already registered */
  function extend(id, list) { skills[id] = (skills[id] || []).concat(list); }
  function has(id) { return !!(skills[id] && skills[id].length); }

  function makeUnique(skill, seen) {
    var q = null;
    for (var t = 0; t < 8; t++) {
      q = skill.make();
      if (!seen[q.prompt]) break;
    }
    seen[q.prompt] = true;
    q.skillId = skill.id;
    q.level = skill.level;
    return q;
  }

  /* Practice: easy to hard, spread across all skills */
  function practiceSet(id, n) {
    n = n || 10;
    var list = (skills[id] || []).slice().sort(function (a, b) { return a.level - b.level; });
    if (!list.length) return [];
    var seen = {}, out = [];
    for (var i = 0; i < n; i++) {
      var k = n === 1 ? 0 : Math.round(i * (list.length - 1) / (n - 1));
      out.push(makeUnique(list[k], seen));
    }
    return out;
  }

  /* Test: every skill appears, in a mixed order */
  function testSet(id, n) {
    n = n || 25;
    var list = skills[id] || [];
    if (!list.length) return [];
    var seen = {}, out = [], pool = [];
    while (out.length < n) {
      if (!pool.length) pool = R.shuffle(list);
      out.push(makeUnique(pool.shift(), seen));
    }
    return R.shuffle(out);
  }

  window.Bank = {
    R: R, register: register, extend: extend, has: has, practiceSet: practiceSet, testSet: testSet, skills: skills,
    s: { x: x, note: note, bars: bars, fb: fb, row: row, grid: grid, groups: groups, lines: lines, numline: numline, clock: clock, bargraph: bargraph },
    q: { num: num, choice: choice, divrem: divrem, trap: trap }
  };
  window.MATH_LESSONS = window.MATH_LESSONS || {};
  window.MATH_VOCAB = window.MATH_VOCAB || {};
  window.MATH_TOOLS = window.MATH_TOOLS || {};
})();
