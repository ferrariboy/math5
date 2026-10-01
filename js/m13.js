/* Module 13: One Step Equations. Lessons, vocabulary and question skills. */
(function () {
  'use strict';
  var B = window.Bank, R = B.R, S = B.s, Q = B.q, T = Q.trap;
  var x = S.x, note = S.note, bars = S.bars, row = S.row, lines = S.lines;

  /* ---------- Helpers ---------- */
  function val(s) { var m = String(s).match(/^(\d+)\/(\d+)$/); return m ? m[1] / m[2] : parseFloat(s); }
  /* Q.num with the trap list cleaned: no trap may equal the answer, repeat, or be a bad number. */
  function N(o) {
    var a = val(o.answer), seen = {};
    o.traps = (o.traps || []).filter(function (t) {
      var s = String(t.value), v = val(s);
      if (!/^\d+(\.\d+)?$|^\d+\/\d+$/.test(s) || !isFinite(v) || Math.abs(v - a) < 1e-9 || seen[v]) return false;
      seen[v] = true; t.value = s; return true;
    });
    return Q.num(o);
  }
  var LETTERS = ['n', 'a', 'k', 'y', 'm', 'p', 'w', 't', 'b', 'c', 'd', 's'];
  function box(text, cls) { return { n: 1, cls: cls || 'bg-indigo-400', text: String(text) }; }
  function rowOf(label, boxes, total) { var r = { label: label, segs: boxes }; if (total !== undefined) r.total = String(total); return r; }
  function rep(count, text, cls) { var o = []; for (var i = 0; i < count; i++) o.push(box(text, cls)); return o; }
  var UNK = 'bg-amber-300', KNOWN = 'bg-indigo-400', RES = 'bg-emerald-400', GONE = 'bg-slate-300';

  /* An equation of one kind with its numbers.
     add: L + a = b    sub: L − a = b    mul: a × L = b    div: L ÷ a = b    subfrom: a − L = b */
  function make(kind, hard) {
    var L = R.pick(LETTERS), a, b, ans;
    for (var t = 0; t < 80; t++) {
      if (kind === 'add') { a = R.int(hard ? 15 : 5, 60); ans = R.int(hard ? 12 : 3, Math.min(70, 100 - a)); b = a + ans; }
      else if (kind === 'sub') { a = R.int(hard ? 12 : 4, 50); b = R.int(hard ? 12 : 3, 50); ans = a + b; }
      else if (kind === 'mul') { a = R.int(2, hard ? 9 : 10); ans = R.int(hard ? 6 : 2, 12); b = a * ans; }
      else if (kind === 'div') { a = R.int(2, hard ? 9 : 10); b = R.int(hard ? 5 : 2, 12); ans = a * b; }
      else { a = R.int(hard ? 45 : 30, 100); b = R.int(hard ? 12 : 4, a - (hard ? 12 : 4)); ans = a - b; }
      if (ans >= 2 && ans <= 100 && b <= 100 && a <= 100 && b >= 1) break;
    }
    return { kind: kind, L: L, a: a, b: b, ans: ans };
  }
  function eqText(f, alt) {
    if (f.kind === 'add') return (alt ? f.a + ' + ' + f.L : f.L + ' + ' + f.a) + ' = ' + f.b;
    if (f.kind === 'sub') return f.L + ' − ' + f.a + ' = ' + f.b;
    if (f.kind === 'mul') return (alt ? f.L + ' × ' + f.a : f.a + ' × ' + f.L) + ' = ' + f.b;
    if (f.kind === 'div') return f.L + ' ÷ ' + f.a + ' = ' + f.b;
    return f.a + ' − ' + f.L + ' = ' + f.b;
  }
  /* left side value when the letter is v */
  function lhs(f, v) {
    if (f.kind === 'add') return v + f.a;
    if (f.kind === 'sub') return v - f.a;
    if (f.kind === 'mul') return v * f.a;
    if (f.kind === 'div') return v / f.a;
    return f.a - v;
  }
  function lhsText(f, v) {
    if (f.kind === 'add') return v + ' + ' + f.a;
    if (f.kind === 'sub') return v + ' − ' + f.a;
    if (f.kind === 'mul') return f.a + ' × ' + v;
    if (f.kind === 'div') return v + ' ÷ ' + f.a;
    return f.a + ' − ' + v;
  }
  /* left side value as text, or null when it is not a whole number that is zero or more */
  function lhsSay(f, v) { var r = lhs(f, v); return (r >= 0 && r === Math.floor(r)) ? String(r) : null; }
  function trapsFor(f) {
    var tr = [];
    if (f.kind === 'add') { tr.push(T(String(f.b + f.a), 'You added. The equation adds ' + f.a + ', so undo it by taking ' + f.a + ' away.')); tr.push(T(String(f.b), 'That is the total on the right side. The mystery number is only one part of that total.')); }
    if (f.kind === 'sub') { tr.push(T(String(f.b - f.a), 'You took ' + f.a + ' away again. The equation takes ' + f.a + ' away, so undo it by adding ' + f.a + '.')); tr.push(T(String(f.b), 'That is what is left on the right side. Add back the ' + f.a + ' that was taken away.')); }
    if (f.kind === 'mul') { tr.push(T(String(f.b - f.a), 'You subtracted. The equation multiplies by ' + f.a + ', so undo it by dividing by ' + f.a + '.')); tr.push(T(String(f.b), 'That is the total. Share it equally into ' + f.a + ' parts.')); }
    if (f.kind === 'div') { tr.push(T(String(f.b + f.a), 'You added. The equation divides by ' + f.a + ', so undo it by multiplying by ' + f.a + '.')); tr.push(T(String(f.b), 'That is the answer after dividing. Multiply by ' + f.a + ' to get back to the start.')); if (f.b % f.a === 0) tr.push(T(String(f.b / f.a), 'You divided again. The equation already divided. Undo it by multiplying.')); }
    if (f.kind === 'subfrom') { tr.push(T(String(f.a + f.b), 'You added the two numbers. Ask instead: ' + f.a + ' minus what leaves ' + f.b + '?')); tr.push(T(String(f.b), 'That is what is left. The mystery number is the part that was taken away from ' + f.a + '.')); }
    return tr;
  }
  function workFor(f) {
    var L = f.L;
    if (f.kind === 'add') return L + ' = ' + f.b + ' − ' + f.a + ' = ' + f.ans + '. Check: ' + f.ans + ' + ' + f.a + ' = ' + f.b + '.';
    if (f.kind === 'sub') return L + ' = ' + f.b + ' + ' + f.a + ' = ' + f.ans + '. Check: ' + f.ans + ' − ' + f.a + ' = ' + f.b + '.';
    if (f.kind === 'mul') return L + ' = ' + f.b + ' ÷ ' + f.a + ' = ' + f.ans + '. Check: ' + f.a + ' × ' + f.ans + ' = ' + f.b + '.';
    if (f.kind === 'div') return L + ' = ' + f.b + ' × ' + f.a + ' = ' + f.ans + '. Check: ' + f.ans + ' ÷ ' + f.a + ' = ' + f.b + '.';
    return L + ' = ' + f.a + ' − ' + f.b + ' = ' + f.ans + '. Check: ' + f.a + ' − ' + f.ans + ' = ' + f.b + '.';
  }
  function plainFor(f) {
    if (f.kind === 'add') return 'Undo the adding by taking ' + f.a + ' away from ' + f.b + '.';
    if (f.kind === 'sub') return 'Undo the taking away by adding ' + f.a + ' to ' + f.b + '.';
    if (f.kind === 'mul') return 'Undo the multiplying by dividing ' + f.b + ' by ' + f.a + '.';
    if (f.kind === 'div') return 'Undo the dividing by multiplying ' + f.b + ' by ' + f.a + '.';
    return 'Ask what number taken from ' + f.a + ' leaves ' + f.b + '. That is ' + f.a + ' − ' + f.b + '.';
  }
  /* Animated steps that solve an equation. eq is the text shown, intro false skips the first step. */
  function solveSteps(f, eq, intro) {
    var L = f.L, a = f.a, b = f.b, ans = f.ans, s = [];
    if (intro !== false) s.push(x('We want the number that ' + L + ' stands for. Here is the equation.', [eq, 'equation']));
    if (f.kind === 'add') {
      s.push(bars('Picture it. ' + L + ' and ' + a + ' are two parts. Together they make ' + b + '.', [rowOf('Two parts', [box(L, UNK), box(a, KNOWN)], b)]));
      s.push(x('To get ' + L + ' alone, undo the plus ' + a + '. The opposite of adding is taking away. Take ' + a + ' from both sides.', L + ' + ' + a + ' − ' + a + ' = ' + b + ' − ' + a));
      s.push(x(b + ' − ' + a + ' = ' + ans + '. So ' + L + ' is ' + ans + '.', b + ' − ' + a + ' = ', [String(ans), L + ' equals']));
      s.push(x('Check by putting ' + ans + ' back in. ' + ans + ' + ' + a + ' = ' + b + '. It balances.', ans + ' + ' + a + ' = ', [String(b), 'matches']));
    } else if (f.kind === 'sub') {
      s.push(bars('Picture it. We start with a whole amount ' + L + '. We take away ' + a + ' and ' + b + ' is left.', [rowOf('The whole is ' + L, [box(b, RES), box(a, GONE)], L)]));
      s.push(x('To get ' + L + ' alone, undo the take away ' + a + '. The opposite of taking away is adding. Add ' + a + ' to both sides.', L + ' − ' + a + ' + ' + a + ' = ' + b + ' + ' + a));
      s.push(x(b + ' + ' + a + ' = ' + ans + '. So ' + L + ' is ' + ans + '.', b + ' + ' + a + ' = ', [String(ans), L + ' equals']));
      s.push(x('Check by putting ' + ans + ' back in. ' + ans + ' − ' + a + ' = ' + b + '. It balances.', ans + ' − ' + a + ' = ', [String(b), 'matches']));
    } else if (f.kind === 'mul') {
      s.push(bars('Picture it. There are ' + a + ' equal boxes. Each box holds ' + L + '. Together they make ' + b + '.', [rowOf(a + ' boxes of ' + L, rep(a, L, UNK), b)]));
      s.push(x('To get ' + L + ' alone, undo the times ' + a + '. The opposite of multiplying is dividing. Divide both sides by ' + a + '.', a + ' × ' + L + ' ÷ ' + a + ' = ' + b + ' ÷ ' + a));
      s.push(bars('Share ' + b + ' equally into ' + a + ' boxes. Each box gets ' + ans + '.', [rowOf(a + ' equal boxes', rep(a, ans, RES), b)]));
      s.push(x(b + ' ÷ ' + a + ' = ' + ans + '. So ' + L + ' is ' + ans + '.', b + ' ÷ ' + a + ' = ', [String(ans), L + ' equals']));
      s.push(x('Check by putting ' + ans + ' back in. ' + a + ' × ' + ans + ' = ' + b + '. It balances.', a + ' × ' + ans + ' = ', [String(b), 'matches']));
    } else if (f.kind === 'div') {
      s.push(bars('Picture it. We share ' + L + ' equally into ' + a + ' boxes. Each box gets ' + b + '.', [rowOf(a + ' equal boxes', rep(a, b, RES), L)]));
      s.push(x('To get ' + L + ' alone, undo the divide by ' + a + '. The opposite of dividing is multiplying. Multiply both sides by ' + a + '.', L + ' ÷ ' + a + ' × ' + a + ' = ' + b + ' × ' + a));
      s.push(x(b + ' × ' + a + ' = ' + ans + '. So ' + L + ' is ' + ans + '.', b + ' × ' + a + ' = ', [String(ans), L + ' equals']));
      s.push(x('Check by putting ' + ans + ' back in. ' + ans + ' ÷ ' + a + ' = ' + b + '. It balances.', ans + ' ÷ ' + a + ' = ', [String(b), 'matches']));
    } else {
      s.push(bars('Picture it. The whole is ' + a + '. We take away ' + L + ' and ' + b + ' is left. So ' + b + ' and ' + L + ' are the two parts of ' + a + '.', [rowOf('The whole is ' + a, [box(b, RES), box(L, UNK)], a)]));
      s.push(x('The mystery number is the part that was taken away. Take the part that is left from the whole.', a + ' − ' + b + ' = ', [String(ans), L + ' equals']));
      s.push(note('This one is different. Do not add here.', 'Watch out', [a + ' − ' + L + ' = ' + b + ' is not solved by adding.', 'Ask: ' + a + ' minus what leaves ' + b + '?']));
      s.push(x('Check by putting ' + ans + ' back in. ' + a + ' − ' + ans + ' = ' + b + '. It balances.', a + ' − ' + ans + ' = ', [String(b), 'matches']));
    }
    return s;
  }
  var PHRASES = [
    function (eq, L) { return 'Solve ' + eq + '. What number does ' + L + ' stand for?'; },
    function (eq, L) { return 'What is the value of ' + L + ' in the equation ' + eq + '?'; },
    function (eq, L) { return 'The equation ' + eq + ' has a mystery number ' + L + '. Find it.'; },
    function (eq, L) { return 'Solve for ' + L + '. ' + eq + '.'; }
  ];
  function eqSkill(kind, name, level, extra) {
    return { id: kind + 'eq', level: level, name: name, make: function () {
      var f = make(kind), eq = eqText(f, R.int(0, 1) === 1);
      return N({
        skill: name, prompt: R.pick(PHRASES)(eq, f.L), answer: f.ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: trapsFor(f), work: workFor(f), plain: plainFor(f), teach: solveSteps(f, eq, true)
      });
    } };
  }

  /* ---------- Stories ---------- */
  var PEOPLE = [['Sam', 'he'], ['Mia', 'she'], ['Rinka', 'she'], ['Priya', 'she'], ['Jun', 'he'], ['Leo', 'he'], ['Amara', 'she'], ['Noah', 'he']];
  function cap1(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function story(kind, hard) {
    var f = make(kind, hard), p = R.pick(PEOPLE), nm = p[0], pr = p[1], a = f.a, b = f.b, st;
    if (kind === 'add') {
      st = R.pick([
        { stem: nm + ' had some hockey cards. ' + cap1(pr) + ' got ' + a + ' more cards and now has ' + b + ' cards.', ask: 'How many cards did ' + nm + ' have at first?', unit: 'cards' },
        { stem: 'A bus had some people on it. Then ' + a + ' more people got on. Now there are ' + b + ' people on the bus.', ask: 'How many people were on the bus at first?', unit: 'people' },
        { stem: 'A rain barrel had some liters of water. ' + a + ' more liters were poured in. Now it holds ' + b + ' liters.', ask: 'How many liters were in the barrel at first?', unit: 'liters' }
      ]);
    } else if (kind === 'sub') {
      st = R.pick([
        { stem: nm + ' had some stickers. ' + cap1(pr) + ' gave away ' + a + ' stickers and has ' + b + ' left.', ask: 'How many stickers did ' + nm + ' have at first?', unit: 'stickers' },
        { stem: 'A store had some apples. It sold ' + a + ' apples and now has ' + b + ' apples left.', ask: 'How many apples did the store have at first?', unit: 'apples' },
        { stem: 'A jar had some marbles. Then ' + a + ' marbles rolled out. Now ' + b + ' marbles are left.', ask: 'How many marbles were in the jar at first?', unit: 'marbles' }
      ]);
    } else if (kind === 'subfrom') {
      st = R.pick([
        { stem: nm + ' had $' + a + '. ' + cap1(pr) + ' bought a game and now has $' + b + ' left.', ask: 'How many dollars did the game cost?', unit: 'dollars' },
        { stem: 'A tank held ' + a + ' liters of water. Some water was used. Now ' + b + ' liters are left.', ask: 'How many liters of water were used?', unit: 'liters' },
        { stem: 'A book has ' + a + ' pages. ' + nm + ' read some pages. There are ' + b + ' pages left to read.', ask: 'How many pages did ' + nm + ' read?', unit: 'pages' }
      ]);
    } else if (kind === 'mul') {
      st = R.pick([
        { stem: 'There are ' + a + ' boxes with the same number of crayons in each box. There are ' + b + ' crayons in all.', ask: 'How many crayons are in one box?', unit: 'crayons' },
        { stem: nm + ' buys ' + a + ' movie tickets that all cost the same. The total cost is $' + b + '.', ask: 'How many dollars does one ticket cost?', unit: 'dollars' },
        { stem: 'A hall has ' + a + ' rows with the same number of chairs in each row. There are ' + b + ' chairs in all.', ask: 'How many chairs are in one row?', unit: 'chairs' }
      ]);
    } else {
      st = R.pick([
        { stem: 'Some students are shared equally into ' + a + ' teams. Each team gets ' + b + ' students.', ask: 'How many students are there in all?', unit: 'students' },
        { stem: 'A baker puts cookies equally into ' + a + ' bags. Each bag holds ' + b + ' cookies.', ask: 'How many cookies did the baker have?', unit: 'cookies' },
        { stem: 'Some dollars are shared equally by ' + a + ' friends. Each friend gets $' + b + '.', ask: 'How many dollars were shared in all?', unit: 'dollars' }
      ]);
    }
    f.stem = st.stem; f.ask = st.ask; f.unit = st.unit; f.eq = eqText(f, false);
    return f;
  }
  function storyTraps(f) {
    var tr = [];
    if (f.kind === 'add') { tr.push(T(String(f.b + f.a), 'You added. The story says ' + f.a + ' were added to make ' + f.b + ', so undo it by taking ' + f.a + ' away.')); tr.push(T(String(f.b), 'That is the number at the end. The question asks for the number at first.')); }
    if (f.kind === 'sub') { tr.push(T(String(f.b - f.a), 'You took away again. The story says ' + f.a + ' were taken away, so to find the start you add them back.')); tr.push(T(String(f.b), 'That is the number left. The question asks for the number at first.')); }
    if (f.kind === 'subfrom') { tr.push(T(String(f.a + f.b), 'You added. The whole was ' + f.a + '. Take away what is left to find what was used.')); tr.push(T(String(f.b), 'That is the amount left, not the amount used or bought.')); }
    if (f.kind === 'mul') { tr.push(T(String(f.b - f.a), 'You subtracted. Equal groups mean you divide the total by the number of groups.')); tr.push(T(String(f.b), 'That is the total for all the groups. Share it equally.')); }
    if (f.kind === 'div') { tr.push(T(String(f.b + f.a), 'You added. Sharing equally is undone by multiplying the share by the number of groups.')); tr.push(T(String(f.b), 'That is only one share. Multiply by ' + f.a + ' to get the whole amount.')); }
    return tr;
  }
  function storyTeach(f) {
    var s = [note('Pick a letter for the unknown number. The letter is ' + f.L + '.', 'Read the story', ['Unknown: ' + f.ask.replace(/\?$/, ''), 'Numbers we know: ' + f.a + ' and ' + f.b]),
             x('Write the story as an equation.', [f.eq, 'equation'])];
    s = s.concat(solveSteps(f, f.eq, false));
    s.push(x('Answer the question with the unit. ' + f.L + ' = ' + f.ans + ', so the answer is ' + f.ans + ' ' + f.unit + '.', [f.ans + ' ' + f.unit, 'answer']));
    return s;
  }

  /* ---------- Vocabulary ---------- */
  window.MATH_VOCAB[13] = [
    { w: 'Equation', m: 'A math sentence with an equal sign. Both sides have the same value, like n + 17 = 45.' },
    { w: 'Variable', m: 'A letter that stands for a number, like n or y.' },
    { w: 'Unknown', m: 'The mystery number you are trying to find.' },
    { w: 'Solve', m: 'To find the number that makes an equation true.' },
    { w: 'Inverse operation', m: 'The opposite operation. Adding and taking away are opposites. Multiplying and dividing are opposites.' },
    { w: 'Balance', m: 'Both sides of an equation weigh the same, like a level scale. Keep it balanced by doing the same thing to both sides.' },
    { w: 'Substitute', m: 'To put a number in place of a letter.' },
    { w: 'Check', m: 'Put your answer back into the equation to see if both sides are equal.' }
  ];

  /* ---------- Lessons ---------- */
  window.MATH_LESSONS[13] = [
    { title: '1. A letter is a mystery number',
      explain: [
        'In math, a letter can stand for a number that we do not know yet. It is like a mystery box. We call the letter a variable.',
        'Look at n + 5 = 12. The letter n is a number. When you add 5 to it, you get 12. Your job is to find n.',
        'Any letter can be used. n, a, k and y all work the same way.'
      ],
      rule: 'A letter stands for a number we want to find.',
      mistake: 'A letter is not a word or a name. It is a number that is hiding.',
      steps: [
        note('A variable is a letter that stands for a number.', 'Mystery number', ['n is a mystery number', 'We want to find it']),
        x('Here is an equation. n is the mystery number.', ['n', 'mystery'], ' + 5 = 12'),
        bars('Picture it. n and 5 are two parts. Together they make 12.', [rowOf('Two parts', [box('n', UNK), box(5)], 12)]),
        x('Try n = 4. 4 + 5 = 9. That is not 12, so n is not 4.', '4 + 5 = ', ['9', 'not 12']),
        x('Try n = 7. 7 + 5 = 12. That is right, so n is 7.', '7 + 5 = ', ['12', 'yes']),
        note('Guessing works for small numbers. Soon we will learn a faster way that works for any numbers.', 'What is next', ['Guess and check is slow', 'Undoing is faster'])
      ] },

    { title: '2. The balance model',
      explain: [
        'An equal sign works like a balance scale. Both sides weigh the same, so the scale is level.',
        'If you take the same amount off both sides, the scale stays level. If you add the same amount to both sides, it stays level too.',
        'We use this to get the mystery number alone on one side.'
      ],
      rule: 'Whatever you do to one side, do to the other side.',
      mistake: 'If you change only one side, the scale tips and the equation is no longer true.',
      steps: [
        lines('A balance scale. The two sides weigh the same, so the scale is level.', ['  LEFT SIDE    RIGHT SIDE', '   n + 5    =     12'], 99),
        bars('On the left there is the mystery box n and 5 blocks. On the right there are 12 blocks.', [rowOf('Left: n + 5', [box('n', UNK)].concat(rep(5, '1', KNOWN))), rowOf('Right: 12', rep(12, '1', RES))]),
        bars('Take 5 blocks off both sides. The grey blocks are removed.', [rowOf('Left', [box('n', UNK)].concat(rep(5, '', GONE))), rowOf('Right', rep(7, '1', RES).concat(rep(5, '', GONE)))]),
        bars('The scale is still level. n is alone on the left. It balances with 7 blocks.', [rowOf('Left', [box('n', UNK)]), rowOf('Right', rep(7, '1', RES))]),
        x('In numbers, we take 5 from both sides. Now n is alone.', 'n + 5 − 5 = 12 − 5,  so ', ['n = 7', 'solved']),
        note('This is the golden rule of equations.', 'Keep it balanced', ['Do the same to both sides', 'Then the equation stays true'])
      ] },

    { title: '3. Solving add equations',
      explain: [
        'Look at n + 17 = 45. The equation adds 17 to n. To get n alone, we undo the adding.',
        'The opposite of adding is taking away. So take 17 away from both sides.',
        'Left side: n + 17 − 17 is just n. Right side: 45 − 17 = 28. So n = 28.'
      ],
      rule: 'To undo adding, take away the same number from both sides.',
      mistake: 'Do not add. 45 + 17 = 62 is wrong. Adding again makes the number bigger, but n must be smaller than 45.',
      steps: [
        x('Solve n + 17 = 45.', ['n + 17 = 45', 'equation']),
        bars('n and 17 are two parts. Together they make 45.', [rowOf('Two parts', [box('n', UNK), box(17)], 45)]),
        x('The equation adds 17 to n. The opposite of adding is taking away. Take 17 from both sides.', 'n + 17 − 17 = 45 − 17'),
        x('The left side is just n now. The right side is 45 − 17 = 28.', 'n = ', ['28', 'answer']),
        x('Check by putting 28 back in. 28 + 17 = 45. It balances.', '28 + 17 = ', ['45', 'matches']),
        x('Now try again with a + 26 = 71. Take 26 from both sides.', 'a + 26 − 26 = 71 − 26'),
        x('71 − 26 = 45. So a = 45. Check: 45 + 26 = 71.', 'a = ', ['45', 'answer'])
      ] },

    { title: '4. Solving take away equations',
      explain: [
        'Look at k − 15 = 22. Some amount k had 15 taken away and 22 was left.',
        'To get k alone, undo the taking away by adding 15 to both sides. That gives k = 22 + 15 = 37.',
        'Careful with 50 − k = 18. Here the mystery number is what was taken away. Ask: 50 minus what leaves 18? The answer is 50 − 18 = 32.'
      ],
      rule: 'k − a = b: add a to both sides. a − k = b: take b from a.',
      mistake: 'For 50 − k = 18, do not add. The mystery number is the part taken away, so subtract 50 − 18.',
      steps: [
        x('Solve k − 15 = 22.', ['k − 15 = 22', 'equation']),
        bars('We start with k. Take away 15 and 22 is left.', [rowOf('The whole is k', [box(22, RES), box(15, GONE)], 'k')]),
        x('The opposite of taking away is adding. Add 15 to both sides.', 'k − 15 + 15 = 22 + 15'),
        x('22 + 15 = 37. So k = 37. Check: 37 − 15 = 22.', 'k = ', ['37', 'answer']),
        x('Now a different kind. Solve 50 − k = 18. The mystery number is being taken away from 50.', ['50 − k = 18', 'equation']),
        bars('The whole is 50. The part that is left is 18. The other part is k.', [rowOf('The whole is 50', [box(18, RES), box('k', UNK)], 50)]),
        x('Take the left over part from the whole. 50 − 18 = 32.', 'k = 50 − 18 = ', ['32', 'answer']),
        x('Check. 50 − 32 = 18. It balances.', '50 − 32 = ', ['18', 'matches'])
      ] },

    { title: '5. Solving multiply equations',
      explain: [
        'Look at 6 × a = 54. Six equal boxes each hold a, and the total is 54.',
        'The opposite of multiplying is dividing. Divide both sides by 6.',
        'Left side: 6 × a ÷ 6 is just a. Right side: 54 ÷ 6 = 9. So a = 9.'
      ],
      rule: 'To undo multiplying, divide both sides by the same number.',
      mistake: 'Do not subtract 54 − 6. The equation multiplies, so we divide.',
      steps: [
        x('Solve 6 × a = 54.', ['6 × a = 54', 'equation']),
        bars('There are 6 equal boxes. Each holds a. Together they make 54.', [rowOf('6 boxes of a', rep(6, 'a', UNK), 54)]),
        x('The opposite of multiplying is dividing. Divide both sides by 6.', '6 × a ÷ 6 = 54 ÷ 6'),
        bars('Share 54 equally into 6 boxes. Each box gets 9.', [rowOf('6 equal boxes', rep(6, 9, RES), 54)]),
        x('54 ÷ 6 = 9. So a = 9.', 'a = ', ['9', 'answer']),
        x('Check. 6 × 9 = 54. It balances.', '6 × 9 = ', ['54', 'matches']),
        x('Try another. 7 × m = 56. Divide both sides by 7. 56 ÷ 7 = 8, so m = 8.', '7 × m = 56,  m = ', ['8', 'answer'])
      ] },

    { title: '6. Solving divide equations',
      explain: [
        'Look at y ÷ 4 = 12. A number y was shared equally into 4 parts and each part is 12.',
        'The opposite of dividing is multiplying. Multiply both sides by 4.',
        'Left side: y ÷ 4 × 4 is just y. Right side: 12 × 4 = 48. So y = 48.'
      ],
      rule: 'To undo dividing, multiply both sides by the same number.',
      mistake: 'Do not divide again. 12 ÷ 4 = 3 is wrong. Sharing made the number smaller, so y must be bigger than 12.',
      steps: [
        x('Solve y ÷ 4 = 12.', ['y ÷ 4 = 12', 'equation']),
        bars('y is shared equally into 4 boxes. Each box gets 12.', [rowOf('4 equal boxes', rep(4, 12, RES), 'y')]),
        x('The opposite of dividing is multiplying. Multiply both sides by 4.', 'y ÷ 4 × 4 = 12 × 4'),
        x('12 × 4 = 48. So y = 48.', 'y = ', ['48', 'answer']),
        x('Check. 48 ÷ 4 = 12. It balances.', '48 ÷ 4 = ', ['12', 'matches']),
        x('Try another. p ÷ 6 = 7. Multiply both sides by 6. 7 × 6 = 42, so p = 42.', 'p ÷ 6 = 7,  p = ', ['42', 'answer'])
      ] },

    { title: '7. Inverse operations',
      explain: [
        'An inverse operation is the opposite one. It undoes what the first one did.',
        'Adding and taking away are inverses. Multiplying and dividing are inverses.',
        'To solve a one step equation, look at the operation next to the letter. Then use its inverse on both sides.'
      ],
      rule: 'Add undoes take away. Take away undoes add. Multiply undoes divide. Divide undoes multiply.',
      mistake: 'Pick the opposite operation, not the same one. To undo + 17, use − 17.',
      steps: [
        note('Every operation has an opposite that undoes it.', 'Inverse pairs', ['+ and − undo each other', '× and ÷ undo each other']),
        lines('Here is the chart of undo moves.', ['Equation      Undo with', 'n + 17 = 45   subtract 17', 'n − 12 = 20   add 12', '6 × n = 54    divide by 6', 'n ÷ 4 = 12    multiply by 4'], 99),
        x('Put a number on 5, then add 3. To undo it, take away 3. You are back to 5.', '5 + 3 = 8,  8 − 3 = ', ['5', 'back']),
        x('Put a number on 5, then multiply by 3. To undo it, divide by 3.', '5 × 3 = 15,  15 ÷ 3 = ', ['5', 'back']),
        x('So for k + 9 = 30, the operation is adding, and the inverse is taking away. k = 30 − 9 = 21.', 'k = 30 − 9 = ', ['21', 'answer']),
        x('For 8 × w = 48, the operation is multiplying, and the inverse is dividing. w = 48 ÷ 8 = 6.', 'w = 48 ÷ 8 = ', ['6', 'answer'])
      ] },

    { title: '8. Checking by substituting',
      explain: [
        'To substitute means to put a number in place of the letter. It is a great way to check your answer.',
        'Put your answer where the letter is. Work out the left side. If it equals the right side, you are correct.',
        'If the two sides are different, your answer is wrong. Go back and try again.'
      ],
      rule: 'Put your answer in place of the letter. Both sides must be equal.',
      mistake: 'Always check with the original equation, not with a step you wrote later.',
      steps: [
        x('Rinka says n = 28 solves n + 17 = 45. Let us check it.', ['n + 17 = 45', 'equation']),
        x('Put 28 in place of n.', ['28', 'in place of n'], ' + 17'),
        x('Work out the left side. 28 + 17 = 45.', '28 + 17 = ', ['45', 'left side']),
        x('The left side is 45 and the right side is 45. They match, so n = 28 is right.', ['45 = 45', 'balanced']),
        x('Now try n = 62. Put 62 in place of n. 62 + 17 = 79.', '62 + 17 = ', ['79', 'left side']),
        x('79 is not 45. The two sides do not match, so n = 62 is wrong.', ['79 ≠ 45', 'not balanced'])
      ] },

    { title: '9. Writing an equation from a story',
      explain: [
        'Many stories hide an equation. To find it, choose a letter for the unknown number. Then decide what the story is doing.',
        'Words like "more" or "got" mean adding. Words like "gave away" or "left" mean taking away. "Equal groups" means multiplying. "Shared equally" means dividing.',
        'Write the equation so it tells the story in order.'
      ],
      rule: 'Choose a letter. Match the story words to add, take away, multiply or divide.',
      mistake: 'Do not put the numbers in the order you see them without thinking. Match the story action.',
      steps: [
        x('Sam had some cards. He got 14 more and now has 52. We choose n for the cards he had at first.', ['n', 'cards at first']),
        note('Match the story to an operation.', 'Story words', ['More or got: add', 'Gave away or left: take away', 'Equal groups: multiply', 'Shared equally: divide']),
        x('Sam had n cards. He got 14 more. Now he has 52. That is add.', ['n + 14 = 52', 'the equation']),
        x('Solve it. Take 14 from both sides. 52 − 14 = 38.', 'n = 52 − 14 = ', ['38', 'answer']),
        x('Another story. A tray has 8 cookies in each row. There are 72 cookies. How many rows? Let r be the rows.', ['r', 'rows']),
        x('Rows of 8 means multiply. 8 rows times r is not it. It is r rows with 8 in each.', ['8 × r = 72', 'the equation']),
        x('Divide both sides by 8. 72 ÷ 8 = 9. There are 9 rows.', 'r = 72 ÷ 8 = ', ['9', 'rows'])
      ] },

    { title: '10. Solving a story, start to finish',
      explain: [
        'Here are the four steps. Read the story and pick a letter. Write the equation. Solve it with the inverse operation. Check and answer with the unit.',
        'The unit is the word after the number, like dollars or cards. Put it in your answer.',
        'Sometimes the unknown is what was taken away, like a price. Watch for those.'
      ],
      rule: 'Letter, equation, solve, check, answer with the unit.',
      mistake: 'Do not stop at the number. Read the question again and answer what it asks.',
      steps: [
        x('Rinka had $50. She bought a game and has $18 left. How much did the game cost? Let k be the cost.', ['k', 'cost of the game']),
        x('She started with 50, took away k, and has 18. That is a take away story.', ['50 − k = 18', 'the equation']),
        bars('The whole is 50. What is left is 18. The rest is k.', [rowOf('The whole is 50', [box(18, RES), box('k', UNK)], 50)]),
        x('The mystery number is the part taken away. 50 − 18 = 32.', 'k = 50 − 18 = ', ['32', 'answer']),
        x('Check. 50 − 32 = 18. It matches the story.', '50 − 32 = ', ['18', 'matches']),
        x('Answer with the unit. The game cost $32.', ['$32', 'the game cost'])
      ] },

    { title: '11. Equations written the other way',
      explain: [
        'An equal sign works in both directions. So 45 = n + 17 means the same as n + 17 = 45.',
        'You can turn it around first. Then solve like before.',
        'You can also leave it. The same undo move works on either side.'
      ],
      rule: 'Equal means the same on both sides, so you can flip an equation around.',
      mistake: 'Do not think the answer goes on the right. The mystery number can be on either side.',
      steps: [
        x('Here the mystery number is on the right side.', ['45 = n + 17', 'equation']),
        x('Turn it around. The equal sign means both sides are the same, so this says the same thing.', '45 = n + 17  is the same as  ', ['n + 17 = 45', 'flipped']),
        x('Now solve like before. Take 17 from both sides.', 'n = 45 − 17 = ', ['28', 'answer']),
        x('Another one. 54 = 6 × a. Turn it around to get 6 × a = 54.', '54 = 6 × a  is  ', ['6 × a = 54', 'flipped']),
        x('Divide both sides by 6. 54 ÷ 6 = 9.', 'a = 54 ÷ 6 = ', ['9', 'answer']),
        note('Any equation can be flipped.', 'Flip it', ['Turn it around so the letter is on the left', 'Then solve as usual'])
      ] }
  ];

  /* ---------- Skills ---------- */
  var SUBFORMS = [
    { k: 'add', f: function (L, c) { return L + ' + ' + c; }, ev: function (v, c) { return v + c; } },
    { k: 'sub', f: function (L, c) { return L + ' − ' + c; }, ev: function (v, c) { return v - c; } },
    { k: 'mul', f: function (L, c) { return c + ' × ' + L; }, ev: function (v, c) { return v * c; } },
    { k: 'div', f: function (L, c) { return L + ' ÷ ' + c; }, ev: function (v, c) { return v / c; } },
    { k: 'from', f: function (L, c) { return c + ' − ' + L; }, ev: function (v, c) { return c - v; } }
  ];
  var OPTEXT = { add: 'Add', sub: 'Subtract', mul: 'Multiply', div: 'Divide' };
  var MEANING = {
    add: 'putting more together (adding)', sub: 'taking some away from the mystery number', mul: 'equal groups (multiplying)',
    div: 'sharing equally (dividing)', subfrom: 'the mystery number is the part that was taken away'
  };
  var STORYMEAN = {
    add: 'some were added to a starting number', sub: 'some were taken away from a starting number', mul: 'equal groups making a total',
    div: 'a total shared equally', subfrom: 'a whole with a part taken away'
  };

  B.register(13, [
    { id: 'evalexp', level: 1, name: 'Put a number in for a letter', make: function () {
      var fm = R.pick(SUBFORMS), L = R.pick(LETTERS), v, c, ans;
      if (fm.k === 'add') { c = R.int(3, 40); v = R.int(2, 50); }
      else if (fm.k === 'sub') { c = R.int(3, 30); v = R.int(c + 1, c + 40); }
      else if (fm.k === 'mul') { c = R.int(2, 9); v = R.int(2, 12); }
      else if (fm.k === 'div') { c = R.int(2, 9); v = c * R.int(2, 12); }
      else { c = R.int(20, 90); v = R.int(2, c - 2); }
      ans = fm.ev(v, c);
      var expr = fm.f(L, c), filled = fm.f(String(v), c);
      var wrongs = [];
      SUBFORMS.forEach(function (o) { if (o.k !== fm.k) { var w = o.ev(v, c); if (w === Math.floor(w) && w > 0) wrongs.push(w); } });
      var traps = [T(String(wrongs[0]), 'You used a different operation. Look at the sign in ' + expr + ' and use exactly that one.'),
                   T(String(v), 'That is just the number that replaces ' + L + '. You still need to do the operation.')];
      return N({
        skill: 'Put a number in for a letter', prompt: R.pick(['If ' + L + ' = ' + v + ', what is the value of ' + expr + '?', 'The letter ' + L + ' stands for ' + v + '. What is ' + expr + '?']),
        answer: ans, keyboard: 'numeric', placeholder: 'Type a number', traps: traps,
        work: filled + ' = ' + ans + '.', plain: 'Put ' + v + ' where the letter is, then work out the sum.',
        teach: [
          note('A letter stands for a number. To find the value, put the number in place of the letter.', 'Substitute', [L + ' = ' + v, 'Expression: ' + expr]),
          x('Replace ' + L + ' with ' + v + '.', expr + '  becomes  ', [filled, L + ' is ' + v]),
          x('Now work it out. ' + filled + ' = ' + ans + '.', filled + ' = ', [String(ans), 'value']),
          x('So when ' + L + ' is ' + v + ', ' + expr + ' is ' + ans + '.', [String(ans), 'answer'])
        ]
      });
    } },

    eqSkill('add', 'Solve an add equation', 1),
    eqSkill('sub', 'Solve a take away equation', 2),
    eqSkill('mul', 'Solve a multiply equation', 2),

    { id: 'whichop', level: 2, name: 'Choose the undo step', make: function () {
      var kind = R.pick(['add', 'sub', 'mul', 'div']), f = make(kind), eq = eqText(f, false);
      var rightTxt = kind === 'add' ? 'Subtract ' + f.a + ' from both sides' : kind === 'sub' ? 'Add ' + f.a + ' to both sides' : kind === 'mul' ? 'Divide both sides by ' + f.a : 'Multiply both sides by ' + f.a;
      var all = [['Subtract ' + f.a + ' from both sides', 'add'], ['Add ' + f.a + ' to both sides', 'sub'], ['Divide both sides by ' + f.a, 'mul'], ['Multiply both sides by ' + f.a, 'div']];
      var op = { add: 'adds', sub: 'takes away', mul: 'multiplies by', div: 'divides by' }[kind];
      var opts = all.map(function (o) {
        return { text: o[0], ok: o[1] === kind, trap: 'That does not undo the equation. The equation ' + op + ' ' + f.a + ', so use the opposite operation.' };
      });
      var inv = { add: 'taking away', sub: 'adding', mul: 'dividing', div: 'multiplying' }[kind];
      return Q.choice({
        skill: 'Choose the undo step', prompt: R.pick(['Which step gets ' + f.L + ' alone in ' + eq + '?', 'To solve ' + eq + ', what should you do to both sides?']),
        options: opts, work: rightTxt + '. Then ' + workFor(f), plain: 'Find the operation next to the letter and use its opposite.',
        teach: [
          x('Look at the equation. Find the operation that is next to ' + f.L + '.', [eq, 'equation']),
          x('The equation ' + op + ' ' + f.a + '. We need the opposite, which is ' + inv + '.', [inv, 'the inverse']),
          x('Do it to both sides so the equation stays balanced.', [rightTxt, 'the step']),
          x('Now ' + f.L + ' is alone. ' + f.L + ' = ' + f.ans + '.', f.L + ' = ', [String(f.ans), 'answer'])
        ]
      });
    } },

    { id: 'balance', level: 2, name: 'Balance scale puzzle', make: function () {
      var sub = R.int(0, 1);
      if (sub === 0) {
        var c = R.int(2, 7), total = R.int(c + 3, 12), ans = total - c;
        var thing = R.pick(['small blocks', 'coins', 'cubes']);
        return N({
          skill: 'Balance scale puzzle', prompt: 'A balance scale is level. The left pan has a mystery box and ' + c + ' ' + thing + '. The right pan has ' + total + ' ' + thing + '. Each of the ' + thing + ' weighs 1 unit. How many units does the mystery box weigh?',
          answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
          traps: [T(String(total + c), 'You added. To keep the scale level, take the ' + c + ' ' + thing + ' off both pans instead.'), T(String(total), 'That is the whole right pan. The left pan also holds ' + c + ' ' + thing + ', which count too.')],
          work: 'Take ' + c + ' off both pans. ' + total + ' − ' + c + ' = ' + ans + '. The box weighs ' + ans + ' units.',
          plain: 'Take the same amount off both sides. What is left on the right is the weight of the box.',
          teach: [
            bars('Left pan: the box and ' + c + ' ' + thing + '. Right pan: ' + total + ' ' + thing + '.', [rowOf('Left pan', [box('box', UNK)].concat(rep(c, '1', KNOWN))), rowOf('Right pan', rep(total, '1', RES))]),
            bars('Take ' + c + ' off both pans. The grey ones are removed.', [rowOf('Left pan', [box('box', UNK)].concat(rep(c, '', GONE))), rowOf('Right pan', rep(ans, '1', RES).concat(rep(c, '', GONE)))]),
            x('The scale is still level. The box alone balances with ' + ans + ' units.', 'box = ' + total + ' − ' + c + ' = ', [String(ans), 'units']),
            x('Check. ' + ans + ' + ' + c + ' = ' + total + '. It balances.', ans + ' + ' + c + ' = ', [String(total), 'matches'])
          ]
        });
      }
      var k = R.int(2, 4), each = R.int(2, 12), tot = k * each;
      return N({
        skill: 'Balance scale puzzle', prompt: 'A balance scale is level. The left pan has ' + k + ' identical bags. The right pan has ' + tot + ' small blocks that each weigh 1 unit. How many units does one bag weigh?',
        answer: each, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(tot - k), 'You subtracted. There are ' + k + ' equal bags, so share the ' + tot + ' equally instead.'), T(String(tot), 'That is the weight of all ' + k + ' bags together. Share it among the ' + k + ' bags.')],
        work: tot + ' ÷ ' + k + ' = ' + each + '. One bag weighs ' + each + ' units.',
        plain: 'The ' + k + ' bags weigh the same, so share the ' + tot + ' equally.',
        teach: [
          bars('Left pan: ' + k + ' bags. Right pan: ' + tot + ' units.', [rowOf('Left pan', rep(k, 'bag', UNK)), rowOf('Right pan', [box(tot, RES)])]),
          bars('Share the ' + tot + ' equally, one part for each bag.', [rowOf('Left pan', rep(k, 'bag', UNK)), rowOf('Right pan', rep(k, each, RES), tot)]),
          x('To share equally we divide. ' + tot + ' ÷ ' + k + ' = ' + each + '.', tot + ' ÷ ' + k + ' = ', [String(each), 'per bag']),
          x('Check. ' + k + ' × ' + each + ' = ' + tot + '. It balances.', k + ' × ' + each + ' = ', [String(tot), 'matches'])
        ]
      });
    } },

    eqSkill('div', 'Solve a divide equation', 3),

    { id: 'subfromeq', level: 3, name: 'Solve when the letter is taken away', make: function () {
      var f = make('subfrom'), eq = eqText(f, false);
      return N({
        skill: 'Solve when the letter is taken away', prompt: R.pick(PHRASES)(eq, f.L), answer: f.ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: trapsFor(f), work: workFor(f), plain: plainFor(f), teach: solveSteps(f, eq, true)
      });
    } },

    { id: 'flipped', level: 3, name: 'Equation written backwards', make: function () {
      var kind = R.pick(['add', 'sub', 'mul', 'div']), f = make(kind), eq = eqText(f, false);
      var flip = f.b + ' = ' + eq.replace(/ = \d+$/, '');
      var teach = [x('The equal sign works both ways. Turn the equation around so the letter is on the left.', flip + '  is the same as  ', [eq, 'flipped'])].concat(solveSteps(f, eq, false));
      return N({
        skill: 'Equation written backwards', prompt: R.pick(['Solve ' + flip + '. What number does ' + f.L + ' stand for?', 'What is the value of ' + f.L + ' in ' + flip + '?']),
        answer: f.ans, keyboard: 'numeric', placeholder: 'Type a number', traps: trapsFor(f),
        work: 'Turn it around: ' + eq + '. ' + workFor(f), plain: 'The two sides are the same, so flip it. Then undo the operation.', teach: teach
      });
    } },

    { id: 'check', level: 3, name: 'Check by substituting', make: function () {
      var kind = R.pick(['add', 'sub', 'mul', 'div', 'subfrom']), f = make(kind), eq = eqText(f, false);
      var wrongV = kind === 'subfrom' ? f.ans - R.int(1, 2) : kind === 'mul' ? f.ans + R.int(1, 3) : kind === 'div' ? f.ans + f.a * R.int(1, 2) : f.ans + R.int(1, 4);
      if (wrongV < 1) wrongV = f.ans + 2;
      var sub = R.int(0, 1);
      var teach = [
        x('To check an answer, put it in place of ' + f.L + ' and see if both sides match.', [eq, 'equation']),
        x('Try ' + f.ans + '. ' + lhsText(f, f.ans) + ' = ' + f.b + '. It matches ' + f.b + '.', lhsText(f, f.ans) + ' = ', [String(f.b), 'matches']),
        x('Try ' + wrongV + '. ' + lhsText(f, wrongV) + ' = ' + lhs(f, wrongV) + '. That is not ' + f.b + '.', lhsText(f, wrongV) + ' = ', [String(lhs(f, wrongV)), 'not ' + f.b]),
        x('So ' + f.L + ' = ' + f.ans + ' is the number that makes the equation true.', [f.L + ' = ' + f.ans, 'true'])
      ];
      if (sub === 0) {
        var cands = [f.ans, wrongV], guard = 0;
        var extras = [f.b, f.a, f.ans + f.a, Math.max(1, f.ans - f.a), f.ans + 5];
        R.shuffle(extras).forEach(function (v) { if (cands.indexOf(v) < 0 && cands.length < 4 && v >= 1 && Math.abs(lhs(f, v) - f.b) > 1e-9) cands.push(v); });
        var opts = cands.map(function (v) {
          return { text: String(v), ok: v === f.ans, trap: 'Put ' + v + ' in place of ' + f.L + '. ' + lhsText(f, v) + (lhsSay(f, v) !== null ? ' = ' + lhsSay(f, v) + ', not ' + f.b : ' does not give ' + f.b) + '. So it is not the answer.' };
        });
        return Q.choice({
          skill: 'Check by substituting', prompt: 'Which number makes ' + eq + ' true? Put each one in place of ' + f.L + ' to test it.', options: opts,
          work: f.L + ' = ' + f.ans + '. Check: ' + lhsText(f, f.ans) + ' = ' + f.b + '.', plain: 'The right number makes both sides equal.', teach: teach
        });
      }
      var right = R.int(0, 1) === 1, v = right ? f.ans : wrongV;
      var res = lhs(f, v);
      return Q.choice({
        skill: 'Check by substituting', prompt: R.pick(['Rinka solved ' + eq + ' and says ' + f.L + ' = ' + v + '. Is she right?', 'Sam says ' + f.L + ' = ' + v + ' solves ' + eq + '. Check by putting ' + v + ' in place of ' + f.L + '. Is he right?']),
        options: [
          { text: 'Yes, the two sides are equal', ok: right, trap: 'Check it. ' + lhsText(f, v) + ' = ' + res + ', which is not ' + f.b + '. So the two sides are not equal.' },
          { text: 'No, the two sides are not equal', ok: !right, trap: 'Check it. ' + lhsText(f, v) + ' = ' + f.b + '. The two sides are equal, so the answer is right.' }
        ],
        work: lhsText(f, v) + ' = ' + res + '. ' + (right ? 'That matches ' + f.b + ', so ' : 'That is not ' + f.b + ', so ') + f.L + ' = ' + v + (right ? ' is right.' : ' is wrong. The right answer is ' + f.ans + '.'),
        plain: 'Put the number in place of the letter and work out the left side. Compare it with the right side.',
        teach: [
          x('We test the answer ' + v + '. Put it in place of ' + f.L + '.', [eq, 'equation']),
          x('The left side becomes ' + lhsText(f, v) + '.', [lhsText(f, v), 'left side']),
          x('Work it out. ' + lhsText(f, v) + ' = ' + res + '.', lhsText(f, v) + ' = ', [String(res), 'left side']),
          x('Compare with the right side, which is ' + f.b + '. ' + (right ? 'They match, so it is right.' : 'They are different, so it is wrong. The right answer is ' + f.ans + '.'), [String(res), 'left'], right ? ' = ' : ' is not ', [String(f.b), 'right'])
        ]
      });
    } },

    { id: 'writeeq', level: 4, name: 'Match an equation to a story', make: function () {
      var kind = R.pick(['add', 'sub', 'subfrom', 'mul', 'div']), f = story(kind, false);
      var forms = ['add', 'sub', 'mul', 'div', 'subfrom'];
      var eqs = {}; forms.forEach(function (k) { var g = { kind: k, L: f.L, a: f.a, b: f.b }; eqs[k] = eqText(g, false); });
      var others = R.shuffle(forms.filter(function (k) { return k !== kind; })).slice(0, 3);
      var opts = [{ text: eqs[kind], ok: true }].concat(others.map(function (k) {
        return { text: eqs[k], ok: false, trap: 'That equation shows ' + MEANING[k] + '. The story is about ' + STORYMEAN[kind] + '.' };
      }));
      return Q.choice({
        skill: 'Match an equation to a story', prompt: f.stem + ' Let ' + f.L + ' stand for the unknown number. Which equation matches the story?', options: opts,
        work: 'The story is about ' + STORYMEAN[kind] + '. So the equation is ' + eqs[kind] + '.', plain: 'Decide what the story is doing. Then pick the equation with that operation.',
        teach: [
          x('Pick a letter for the unknown number. We use ' + f.L + '.', [f.L, 'unknown']),
          note('Ask what the story is doing.', 'The story action', ['The story is about ' + STORYMEAN[kind]]),
          x('Write it in the same order as the story.', [eqs[kind], 'the equation']),
          x('Check it tells the story. ' + f.L + ' is the unknown and ' + f.a + ' and ' + f.b + ' come from the story.', [eqs[kind], 'matches the story'])
        ]
      });
    } },

    { id: 'storyaddsub', level: 4, name: 'Solve an add or take away story', make: function () {
      var f = story(R.pick(['add', 'sub', 'subfrom']), false);
      return N({
        skill: 'Solve an add or take away story', prompt: f.stem + ' ' + f.ask, answer: f.ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: storyTraps(f), work: 'Equation ' + f.eq + '. ' + workFor(f), plain: 'Write the story as an equation. Undo the operation to find the unknown.', teach: storyTeach(f)
      });
    } },

    { id: 'storygroups', level: 4, name: 'Solve a groups or sharing story', make: function () {
      var f = story(R.pick(['mul', 'div']), false);
      return N({
        skill: 'Solve a groups or sharing story', prompt: f.stem + ' ' + f.ask, answer: f.ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: storyTraps(f), work: 'Equation ' + f.eq + '. ' + workFor(f), plain: 'Write the story as an equation. Undo the operation to find the unknown.', teach: storyTeach(f)
      });
    } },

    { id: 'errorspot', level: 5, name: 'Spot the mistake', make: function () {
      var kind = R.pick(['add', 'sub', 'mul', 'div']), f, wrong;
      if (kind === 'div') { var a = R.int(2, 4), m = R.int(2, 6); f = { kind: 'div', L: R.pick(LETTERS), a: a, b: a * m, ans: a * a * m }; wrong = m; }
      else if (kind === 'mul') { var a2 = R.int(2, 6), r2 = R.int(2, 6); f = { kind: 'mul', L: R.pick(LETTERS), a: a2, b: a2 * r2, ans: r2 }; wrong = a2 * a2 * r2; }
      else if (kind === 'add') { f = make('add'); wrong = f.b + f.a; }
      else { f = make('sub'); while (f.b <= f.a) f = make('sub'); wrong = f.b - f.a; }
      var eq = eqText(f, false), nm = R.pick(['Mia', 'Sam', 'Priya', 'Jun']);
      var mistakes = {
        add: { txt: 'added ' + f.a + ' instead of taking ' + f.a + ' away', fix: 'take away ' + f.a },
        sub: { txt: 'took ' + f.a + ' away instead of adding ' + f.a, fix: 'add ' + f.a },
        mul: { txt: 'multiplied by ' + f.a + ' instead of dividing by ' + f.a, fix: 'divide by ' + f.a },
        div: { txt: 'divided by ' + f.a + ' instead of multiplying by ' + f.a, fix: 'multiply by ' + f.a }
      };
      var pron = nm === 'Sam' || nm === 'Jun' ? 'He' : 'She';
      var gives = { add: f.b + f.a, sub: f.b - f.a, mul: f.b * f.a, div: f.b / f.a };
      var opts = ['add', 'sub', 'mul', 'div'].map(function (k) {
        var g = gives[k], okv = g >= 0 && g === Math.floor(g);
        return { text: pron + ' ' + mistakes[k].txt, ok: k === kind, trap: 'Test that idea. ' + (okv ? 'It would give ' + g + ', but ' + (pron === 'He' ? 'he' : 'she') + ' wrote ' + wrong + '.' : 'It would not give a whole number answer here.') + ' Look for the move that gives ' + wrong + '.' };
      });
      var pickAns = mistakes[kind];
      return Q.choice({
        skill: 'Spot the mistake', prompt: nm + ' solved ' + eq + ' and wrote ' + f.L + ' = ' + wrong + '. What did ' + (pron === 'He' ? 'he' : 'she') + ' do wrong?', options: opts,
        work: 'The equation needs ' + pickAns.fix + '. The right answer is ' + f.ans + '. ' + nm + ' wrote ' + wrong + ' because ' + (pron === 'He' ? 'he' : 'she') + ' ' + pickAns.txt + '.',
        plain: 'Find the operation in the equation. The right move is its opposite.',
        teach: [
          x('Look at the equation and at what ' + nm + ' wrote.', [eq, 'equation'], ',  ' + f.L + ' = ', [String(wrong), 'her answer']),
          x('The equation calls for the opposite move. We need to ' + pickAns.fix + '.', [pickAns.fix, 'the right move']),
          x('The right answer is ' + f.ans + '.', f.L + ' = ', [String(f.ans), 'right answer']),
          lhsSay(f, wrong) !== null
            ? x('Check ' + wrong + ': ' + lhsText(f, wrong) + ' = ' + lhsSay(f, wrong) + ', not ' + f.b + '. So ' + wrong + ' is wrong.', lhsText(f, wrong) + ' = ', [lhsSay(f, wrong), 'not ' + f.b])
            : x('Check ' + wrong + ': ' + lhsText(f, wrong) + ' takes away more than we have, so it cannot equal ' + f.b + '. So ' + wrong + ' is wrong.', [lhsText(f, wrong), 'cannot equal ' + f.b])
        ]
      });
    } },

    { id: 'solveuse', level: 5, name: 'Solve, then use the answer', make: function () {
      var kind = R.pick(['add', 'sub', 'mul', 'div']), f = make(kind), eq = eqText(f, R.int(0, 1) === 1);
      var pool = ['sub', 'half'], c = R.int(2, 12), ans2, phr, exp;
      if (f.ans + 2 <= 100) { pool.push('add'); c = Math.min(c, 100 - f.ans); }
      if (f.ans <= 50) pool.push('twice');
      var use = R.pick(pool);
      if (use === 'add') { ans2 = f.ans + c; phr = f.L + ' + ' + c; exp = f.ans + ' + ' + c; }
      else if (use === 'sub') { if (f.ans <= c) c = 1; ans2 = f.ans - c; phr = f.L + ' − ' + c; exp = f.ans + ' − ' + c; }
      else if (use === 'twice') { ans2 = f.ans * 2; phr = 'twice ' + f.L; exp = f.ans + ' × 2'; }
      else { if (f.ans % 2) { ans2 = f.ans + 1; phr = f.L + ' + 1'; exp = f.ans + ' + 1'; } else { ans2 = f.ans / 2; phr = 'half of ' + f.L; exp = f.ans + ' ÷ 2'; } }
      var traps = [T(String(f.ans), 'That is the value of ' + f.L + '. The question asks for ' + phr + '.')];
      var wr = trapsFor(f)[0]; if (wr) traps.push(T(String(use === 'twice' ? Number(wr.value) * 2 : Number(wr.value) + (ans2 - f.ans)), 'Check how you found ' + f.L + '. Use the inverse operation on both sides first.'));
      return N({
        skill: 'Solve, then use the answer', prompt: 'If ' + eq + ', what is ' + phr + '?', answer: ans2, keyboard: 'numeric', placeholder: 'Type a number', traps: traps,
        work: workFor(f) + ' Then ' + exp + ' = ' + ans2 + '.', plain: 'First find the mystery number. Then use it in the new sum.',
        teach: [
          x('First solve for ' + f.L + '.', [eq, 'equation']),
          x('Use the inverse operation. ' + workFor(f).split('. Check')[0] + '.', f.L + ' = ', [String(f.ans), 'solved']),
          x('Now use it. The question asks for ' + phr + '. Put ' + f.ans + ' in for ' + f.L + '.', [phr, 'question'], ' becomes ', [exp, 'with the number']),
          x('Work it out. ' + exp + ' = ' + ans2 + '.', exp + ' = ', [String(ans2), 'answer'])
        ]
      });
    } },

    { id: 'wordbank', level: 6, name: 'Write and solve a story', make: function () {
      var f = story(R.pick(['add', 'sub', 'subfrom', 'mul', 'div']), true);
      return N({
        skill: 'Write and solve a story', prompt: f.stem + ' Write an equation with ' + f.L + ' for the unknown and solve it. ' + f.ask, answer: f.ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: storyTraps(f), work: 'Equation ' + f.eq + '. ' + workFor(f), plain: 'Write the story as an equation. Use the opposite operation to find the unknown. Then check.', teach: storyTeach(f)
      });
    } }
  ]);
})();
