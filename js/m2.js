/* Module 2: The Multiplication and Division Engine. Lessons, vocabulary and question skills. */
(function () {
  'use strict';
  var B = window.Bank, R = B.R, S = B.s, Q = B.q, T = Q.trap;
  var x = S.x, note = S.note, bars = S.bars, row = S.row, grid = S.grid, groups = S.groups;
  var fmt = R.fmt;

  /* ---------- Vocabulary ---------- */
  window.MATH_VOCAB[2] = [
    { w: 'Factor', m: 'A number you multiply. In 6 × 7, the factors are 6 and 7.' },
    { w: 'Product', m: 'The answer to a multiplication. In 6 × 7 = 42, the product is 42.' },
    { w: 'Quotient', m: 'The answer to a division. In 42 ÷ 6 = 7, the quotient is 7.' },
    { w: 'Remainder', m: 'The amount left over after sharing equally. 17 ÷ 5 is 3 with a remainder of 2.' },
    { w: 'Partial product', m: 'A small multiplication you do on the way to the answer, like 300 × 7. You add the partial products at the end.' },
    { w: 'Brackets', m: 'Curved lines around part of a problem, like (3 + 4). Whatever is inside the brackets gets done first.' },
    { w: 'Order of operations', m: 'The rules for which step to do first. Brackets first, then times and divide, then add and take away.' },
    { w: 'Estimate', m: 'A quick answer that is close to the exact one. You find it by rounding to easy numbers.' }
  ];

  /* ---------- Helpers ---------- */
  function pow10(k) { return Math.pow(10, k); }
  function zeros(k) { return new Array(k + 1).join('0'); }
  function plural(k, word) { return k + ' ' + word + (k === 1 ? '' : 's'); }
  function rnd(n, p) { return Math.floor((n + p / 2) / p) * p; }
  function lead(n) { return rnd(n, pow10(String(n).length - 1)); }
  function stripZ(n) { var z = 0; while (n > 0 && n % 10 === 0) { n = n / 10; z++; } return { core: n, z: z }; }
  function clean(list, ans) {
    var seen = {}, out = [];
    seen[String(ans)] = true;
    list.forEach(function (t) {
      var v = String(t.value);
      if (!/^\d+(\.\d+)?$/.test(v) || seen[v]) return;
      seen[v] = true;
      out.push(T(v, t.say));
    });
    return out.slice(0, 3);
  }
  function digs(n) { return String(n).split('').map(Number); }

  /* ---------- Order of operations engine ---------- */
  function calc(a, op, b) {
    if (op === '+') return a + b;
    if (op === '−') return a - b;
    if (op === '×') return a * b;
    return a / b;
  }
  function tokStr(toks) {
    var s = '';
    toks.forEach(function (t, i) {
      var str = typeof t === 'number' ? fmt(t) : t;
      if (t === '(') s += (s && toks[i - 1] !== '(' ? ' ' : '') + '(';
      else if (t === ')') s += ')';
      else if (!s || toks[i - 1] === '(') s += str;
      else s += ' ' + str;
    });
    return s;
  }
  /* Splits the expression around a highlighted range of tokens a to b. */
  function partsFor(toks, a, b, tag) {
    var pre = tokStr(toks.slice(0, a)), mid = tokStr(toks.slice(a, b + 1)), post = tokStr(toks.slice(b + 1));
    var parts = [];
    if (pre) parts.push(pre + (pre.charAt(pre.length - 1) === '(' ? '' : ' '));
    parts.push([mid, tag]);
    if (post) parts.push((post.charAt(0) === ')' ? '' : ' ') + post);
    return parts;
  }
  /* Works out each single step of an expression. Returns { plan, result, ok } */
  function oooPlan(toks) {
    var cur = toks.slice(), plan = [], guard = 0, ok = true, i;
    while (cur.length > 1 && guard++ < 40) {
      var lo = 0, hi = cur.length, inBr = false, ci = cur.indexOf(')'), oi = -1;
      if (ci >= 0) { oi = ci; while (cur[oi] !== '(') oi--; lo = oi + 1; hi = ci; inBr = true; }
      var idx = -1, kind = 'md';
      for (i = lo; i < hi; i++) { if (cur[i] === '×' || cur[i] === '÷') { idx = i; break; } }
      if (idx < 0) { kind = 'as'; for (i = lo; i < hi; i++) { if (cur[i] === '+' || cur[i] === '−') { idx = i; break; } } }
      if (idx < 0) { cur = cur.slice(0, oi).concat([cur[lo]], cur.slice(ci + 1)); continue; }
      var a = cur[idx - 1], b = cur[idx + 1], op = cur[idx], r = calc(a, op, b);
      if (!(r >= 0) || Math.floor(r) !== r || (op === '÷' && b === 0)) ok = false;
      plan.push({ toks: cur.slice(), a: idx - 1, b: idx + 1, kind: kind, inBr: inBr, r: r, x: a, y: b, op: op });
      cur = cur.slice(0, idx - 1).concat([r], cur.slice(idx + 2));
      if (inBr && cur[oi] === '(' && cur[oi + 2] === ')') cur = cur.slice(0, oi).concat([cur[oi + 1]], cur.slice(oi + 3));
    }
    return { plan: plan, result: cur[0], ok: ok };
  }
  function oooSteps(toks) {
    var pl = oooPlan(toks), steps = [];
    steps.push(x('Here is the problem. Brackets go first, then times and divide, then add and take away.', tokStr(toks)));
    pl.plan.forEach(function (p) {
      var tag = p.inBr ? 'brackets first' : (p.kind === 'md' ? (p.op === '×' ? 'times next' : 'divide next') : 'left to right');
      var lead = p.inBr ? 'Do the brackets first. ' : (p.kind === 'md' ? 'Times and divide come next. ' : 'Now add and take away, from left to right. ');
      steps.push(x.apply(null, [lead + fmt(p.x) + ' ' + p.op + ' ' + fmt(p.y) + ' = ' + fmt(p.r) + '.'].concat(partsFor(p.toks, p.a, p.b, tag))));
    });
    steps.push(x('That is everything. The answer is ' + fmt(pl.result) + '.', [fmt(pl.result), 'answer']));
    return steps;
  }
  function lrEval(toks) {
    var t = toks.slice(), ci;
    function flat(a) { var acc = a[0]; for (var i = 1; i < a.length; i += 2) acc = calc(acc, a[i], a[i + 1]); return acc; }
    while ((ci = t.indexOf(')')) >= 0) { var oi = ci; while (t[oi] !== '(') oi--; t = t.slice(0, oi).concat([flat(t.slice(oi + 1, ci))], t.slice(ci + 1)); }
    return flat(t);
  }
  function noBrackets(toks) { return toks.filter(function (t) { return t !== '(' && t !== ')'; }); }
  /* Builds a random expression from a template like ['a','+','b','×','c']. Every step must be a whole number that is not negative. */
  function genOOO(template, lo, hi) {
    for (var tries = 0; tries < 600; tries++) {
      var vals = {}, toks = template.map(function (t) {
        if (/^[a-e]$/.test(t)) { if (!vals[t]) vals[t] = R.int(lo, hi); return vals[t]; }
        return t;
      });
      var pl = oooPlan(toks);
      if (!pl.ok) continue;
      if (pl.plan.length < 2) continue;
      var lr = lrEval(toks), nb = oooPlan(noBrackets(toks));
      var lrOk = Math.floor(lr) === lr && lr >= 0 && lr !== pl.result;
      var nbOk = nb.ok && nb.result !== pl.result;
      if (!lrOk && !nbOk) continue;
      if (pl.result > 400) continue;
      return { toks: toks, plan: pl, lr: lrOk ? lr : null, nb: nbOk ? nb.result : null };
    }
    return null;
  }
  function oooQuestion(template, lo, hi, skill) {
    var g = genOOO(template, lo, hi);
    while (!g) g = genOOO(template, lo, hi + 3);
    var expr = tokStr(g.toks), ans = g.plan.result, traps = [];
    if (g.nb !== null && g.toks.indexOf('(') >= 0) traps.push(T(g.nb, 'It looks like you skipped the brackets. Do what is inside the brackets first.'));
    if (g.lr !== null) traps.push(T(g.lr, 'It looks like you went straight from left to right. Times and divide must be done before add and take away.'));
    if (g.nb !== null && g.toks.indexOf('(') < 0) traps.push(T(g.nb, 'Check the order. Times and divide come before add and take away.'));
    var stepsText = g.plan.plan.map(function (p) { return fmt(p.x) + ' ' + p.op + ' ' + fmt(p.y) + ' = ' + fmt(p.r); }).join(', then ');
    return Q.num({
      skill: skill, prompt: 'What is ' + expr + '?', answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number',
      traps: clean(traps, ans),
      work: 'Follow the order: ' + stepsText + '. The answer is ' + fmt(ans) + '.',
      plain: 'Brackets first. Then times and divide. Then add and take away. Rewrite the problem after each step.',
      teach: oooSteps(g.toks)
    });
  }

  /* ---------- Multiplication teaching steps ---------- */
  function mulStories(a, b) {
    return R.pick([
      'A box holds ' + a + ' markers. A school buys ' + b + ' boxes. How many markers is that in all?',
      'A train has ' + b + ' cars with ' + a + ' seats in each car. How many seats are there in all?',
      'A baker makes ' + b + ' trays of ' + a + ' muffins each. How many muffins is that?',
      'Each page has ' + a + ' stickers. A book has ' + b + ' pages. How many stickers are in the book?'
    ]);
  }
  function estCheck(a, b, ans) {
    var ra = lead(a), rb = lead(b), est = ra * rb;
    return x('Check with an estimate. ' + fmt(ra) + ' × ' + fmt(rb) + ' = ' + fmt(est) + '. Our answer ' + fmt(ans) + ' is in the same neighborhood, so it makes sense.', fmt(ra) + ' × ' + fmt(rb) + ' = ', [fmt(est), 'estimate']);
  }
  function partialSteps3x1(n, k) {
    var d = digs(n), h = d[0] * 100, t = d[1] * 10, o = d[2], ans = n * k;
    return [
      bars('Picture ' + k + ' groups of ' + n + '. We will find how many there are in all.', [row(k + ' groups of ' + n, k, 'bg-indigo-400', String(n))]),
      x('Break ' + n + ' into hundreds, tens and ones.', String(n) + ' = ', [fmt(h), 'hundreds'], ' + ', [String(t), 'tens'], ' + ', [String(o), 'ones']),
      x('Multiply the hundreds part. ' + d[0] + ' × ' + k + ' = ' + d[0] * k + ', so ' + fmt(h) + ' × ' + k + ' = ' + fmt(h * k) + '.', fmt(h) + ' × ' + k + ' = ', [fmt(h * k), 'partial product']),
      x('Multiply the tens part. ' + d[1] + ' × ' + k + ' = ' + d[1] * k + ', so ' + t + ' × ' + k + ' = ' + fmt(t * k) + '.', t + ' × ' + k + ' = ', [fmt(t * k), 'partial product']),
      x('Multiply the ones part. ' + o + ' × ' + k + ' = ' + o * k + '.', o + ' × ' + k + ' = ', [fmt(o * k), 'partial product']),
      x('Add the three partial products.', fmt(h * k) + ' + ' + fmt(t * k) + ' + ' + fmt(o * k) + ' = ', [fmt(ans), 'answer']),
      estCheck(n, k, ans)
    ];
  }
  function areaSteps2x2(a, b) {
    var A = digs(a), Bd = digs(b), a1 = A[0] * 10, a0 = A[1], b1 = Bd[0] * 10, b0 = Bd[1];
    var p1 = a1 * b1, p2 = a1 * b0, p3 = a0 * b1, p4 = a0 * b0, ans = a * b;
    return [
      x('Break both numbers into tens and ones.', String(a) + ' = ' + a1 + ' + ' + a0 + '   and   ' + b + ' = ' + b1 + ' + ' + b0),
      grid('Draw a box cut into four parts. Each part is one small multiplication.', 2, 2, [
        { c0: 0, c1: 1, r0: 0, r1: 1, cls: 'bg-indigo-400' }, { c0: 1, c1: 2, r0: 0, r1: 1, cls: 'bg-emerald-400' },
        { c0: 0, c1: 1, r0: 1, r1: 2, cls: 'bg-amber-300' }, { c0: 1, c1: 2, r0: 1, r1: 2, cls: 'bg-rose-400' }]),
      x('Blue part: tens times tens. ' + a1 + ' × ' + b1 + ' = ' + fmt(p1) + '.', a1 + ' × ' + b1 + ' = ', [fmt(p1), 'blue box']),
      x('Green part: ' + a1 + ' × ' + b0 + ' = ' + fmt(p2) + '.', a1 + ' × ' + b0 + ' = ', [fmt(p2), 'green box']),
      x('Yellow part: ' + a0 + ' × ' + b1 + ' = ' + fmt(p3) + '.', a0 + ' × ' + b1 + ' = ', [fmt(p3), 'yellow box']),
      x('Pink part: ' + a0 + ' × ' + b0 + ' = ' + fmt(p4) + '.', a0 + ' × ' + b0 + ' = ', [fmt(p4), 'pink box']),
      x('Add the four boxes.', fmt(p1) + ' + ' + fmt(p2) + ' + ' + fmt(p3) + ' + ' + fmt(p4) + ' = ', [fmt(ans), 'answer'])
    ];
  }
  function partialSteps3x2(n, b) {
    var t = Math.floor(b / 10), o = b % 10, ans = n * b, top = n * t * 10, low = n * o;
    return [
      x('Break ' + b + ' into ' + (t * 10) + ' and ' + o + '. We multiply by each part.', String(b) + ' = ', [String(t * 10), 'tens part'], ' + ', [String(o), 'ones part']),
      x('First the tens part. ' + n + ' × ' + t + ' = ' + fmt(n * t) + '. Add a zero because it is really ' + (t * 10) + '.', n + ' × ' + (t * 10) + ' = ', [fmt(top), 'partial product']),
      x('Now the ones part. ' + n + ' × ' + o + ' = ' + fmt(low) + '.', n + ' × ' + o + ' = ', [fmt(low), 'partial product']),
      x('Add the two partial products.', fmt(top) + ' + ' + fmt(low) + ' = ', [fmt(ans), 'answer']),
      estCheck(n, b, ans)
    ];
  }

  /* ---------- Division teaching steps ---------- */
  function divTeach(N, d, q, r) {
    var steps = window.MathEngine.longDiv(N, d);
    steps.push(x('Check by multiplying back. ' + q + ' × ' + d + ' = ' + fmt(q * d) + ', and ' + fmt(q * d) + ' + ' + r + ' = ' + fmt(N) + '.', q + ' × ' + d + ' + ' + r + ' = ', [fmt(N), 'the start']));
    return steps;
  }
  function divTraps(q, r, d) {
    var tr = [T([q, 0], 'You forgot the leftover. Some are left after the equal groups are made. Write it in the remainder box.')];
    if (q > 1) tr.push(T([q - 1, r + d], 'The remainder is ' + (r + d) + ', which is as big as ' + d + ' or bigger. That means ' + d + ' fits one more time. Add 1 to the quotient.'));
    tr.push(T([q + 1, null], 'That is one group too many. Multiply your answer by ' + d + ' and see if it goes over the number you started with.'));
    return tr;
  }
  var DIV_STORIES = [
    function (N, d) { return 'A baker packs ' + N + ' cookies into boxes of ' + d + '. How many full boxes are there, and how many cookies are left over?'; },
    function (N, d) { return 'Rinka has ' + N + ' stickers. Each page holds ' + d + ' stickers. How many full pages are there, and how many stickers are left over?'; },
    function (N, d) { return N + ' students line up in rows of ' + d + '. How many full rows are there, and how many students are left over?'; },
    function (N, d) { return 'A farm has ' + N + ' eggs. Each carton holds ' + d + ' eggs. How many full cartons are there, and how many eggs are left over?'; }
  ];

  /* ---------- Lessons ---------- */
  window.MATH_LESSONS[2] = [
    { title: '1. Times facts and division facts',
      explain: [
        'Times facts are the building blocks for all the big math in this module. A times fact and a divide fact are a family. If 7 × 8 = 56, then 56 ÷ 7 = 8 and 56 ÷ 8 = 7.',
        'If you forget a fact, do not guess. Break it into two easier facts. To find 7 × 8, do 7 × 5 and then 7 × 3, and add them.',
        'Division asks a question about times. 56 ÷ 8 means, "8 times what number makes 56?"'
      ],
      rule: 'Every times fact has a divide fact. Break hard facts into easy ones.',
      mistake: 'Do not guess a fact that is close. 7 × 8 is 56, not 54 or 58. Break it apart and check.',
      steps: [
        grid('This grid has 7 rows of 8. That is 7 × 8.', 8, 7, []),
        grid('Cut the grid after 5 columns. The blue part is 7 × 5. The green part is 7 × 3.', 8, 7, [{ c0: 0, c1: 5, r0: 0, r1: 7, cls: 'bg-indigo-400' }, { c0: 5, c1: 8, r0: 0, r1: 7, cls: 'bg-emerald-400' }]),
        x('7 × 5 = 35 and 7 × 3 = 21. Add the two parts.', '7 × 5 + 7 × 3 = ', ['35', 'blue'], ' + ', ['21', 'green'], ' = ', ['56', 'answer']),
        x('Every times fact has a divide fact. Since 7 × 8 = 56, we know 56 ÷ 8 = 7.', ['56 ÷ 8 = 7', 'divide fact']),
        note('These four facts belong together.', 'A fact family', ['7 × 8 = 56', '8 × 7 = 56', '56 ÷ 7 = 8', '56 ÷ 8 = 7']),
        x('A missing number works the same way. For ? × 6 = 54, think 54 ÷ 6.', ['?', 'missing'], ' × 6 = 54,  so  54 ÷ 6 = ', ['9', 'answer']),
        note('Some quick tricks for hard facts.', 'Fact tricks', ['9s: 9 × 7 is 10 × 7 take away 7, so 70 − 7 = 63', '6s: 6 × 8 is double 3 × 8, so 24 + 24 = 48', '5s: count by 5s, or take half of the 10s fact'])
      ] },

    { title: '2. Multiplying tens, hundreds and thousands',
      explain: [
        'A number like 40 is just 4 with a zero. So 40 × 30 is really the fact 4 × 3, with zeros added.',
        'Multiply the front digits first. Then count all the zeros in both numbers and put them at the end.',
        'Watch out when the fact ends in a zero. 5 × 4 = 20, and it keeps its zero. Then you add more.'
      ],
      rule: 'Multiply the front digits. Then add all the zeros from both numbers.',
      mistake: 'Do not lose a zero. 600 × 5 is 3,000, not 300. The fact 6 × 5 = 30 already has a zero, and the two zeros from 600 come after it.',
      steps: [
        x('Try 40 × 30. Each number is a basic fact with zeros.', '40 × 30'),
        x('40 is 4 × 10 and 30 is 3 × 10.', '40 × 30 = 4 × 10 × 3 × 10'),
        x('Multiply the front digits first. 4 × 3 = 12.', ['4 × 3', 'basic fact'], ' = ', ['12', 'basic answer']),
        x('Count the zeros. 40 has 1 zero and 30 has 1 zero. That makes 2 zeros.', ['40', '1 zero'], ' and ', ['30', '1 zero']),
        x('Put 2 zeros after 12. So 40 × 30 = 1,200.', ['12', 'fact'], ['00', '2 zeros'], ' = ', ['1,200', 'answer']),
        x('One more. 600 × 5. The fact 6 × 5 = 30, and then 2 zeros from the 600.', '600 × 5 = ', ['30', 'fact'], ['00', '2 zeros'], ' = ', ['3,000', 'answer']),
        note('Some facts end in a zero.', 'Keep every zero', ['5 × 4 = 20 already has a zero', '50 × 40 = 20 with 2 more zeros = 2,000'])
      ] },

    { title: '3. Partial products: 3 digit by 1 digit',
      explain: [
        'A big multiplication is hard to do all at once. So we break the big number into hundreds, tens and ones. Then we multiply each part.',
        'Each small answer is called a partial product. Partial means a piece. At the end we add all the pieces.',
        'This works because 7 groups of 346 are the same as 7 groups of 300, plus 7 groups of 40, plus 7 groups of 6.'
      ],
      rule: 'Break the number apart. Multiply each part. Add the partial products.',
      mistake: 'Do not multiply the digits alone. The 4 in 346 is 40, so use 40 × 7 = 280, not 4 × 7 = 28.',
      steps: partialSteps3x1(346, 7) },

    { title: '4. The area model: 2 digit by 2 digit',
      explain: [
        'An area model is a box cut into parts. It shows how every part of one number multiplies every part of the other number.',
        'To multiply 34 × 27, break each number into tens and ones. That gives four small boxes. Find each box, then add them.',
        'Nothing gets left out. Every part of 34 meets every part of 27.'
      ],
      rule: 'Break both numbers into tens and ones. Find four boxes. Add them.',
      mistake: 'Do not only multiply tens by tens and ones by ones. That misses two boxes. Every part must multiply every part.',
      steps: areaSteps2x2(34, 27) },

    { title: '5. Multiplying 3 digit by 2 digit',
      explain: [
        'This uses the same idea, with bigger numbers. Break the second number into tens and ones. Then multiply the top number by each part.',
        'When you multiply by the tens part, you are really multiplying by a number like 20. So multiply by 2 first, then put a zero on the end.',
        'Then add the two partial products.'
      ],
      rule: 'Multiply by the tens part and by the ones part. Add the two answers.',
      mistake: 'When you multiply by 20, do not forget the zero. 234 × 2 = 468, but 234 × 20 = 4,680.',
      steps: [
        x('Let us find 234 × 26.', '234 × 26'),
        x('Break 26 into 20 and 6.', '26 = ', ['20', 'tens part'], ' + ', ['6', 'ones part']),
        x('First 234 × 2 = 468. Because it is really 20, add a zero.', '234 × 20 = ', ['4,680', 'partial product']),
        x('Next 234 × 6. 200 × 6 = 1,200, 30 × 6 = 180 and 4 × 6 = 24. Together that is 1,404.', '234 × 6 = ', ['1,404', 'partial product']),
        x('Add the two partial products.', '4,680 + 1,404 = ', ['6,084', 'answer']),
        x('Check with an estimate. 200 × 30 = 6,000. Our answer is close.', '200 × 30 = ', ['6,000', 'estimate']),
        note('Always check for the zero.', 'Common slip', ['234 × 20 needs a zero on the end', 'Ask: is my answer near the estimate?'])
      ] },

    { title: '6. Order of operations',
      explain: [
        'If two people work a problem in a different order, they can get different answers. So math has a traffic law that everyone follows.',
        'Brackets go first. Then times and divide. Then add and take away. Times and divide are twins. They share a lane, so go from left to right. Add and take away are twins too.',
        'Take 5 + 3 × 4. Times goes before add, so 3 × 4 = 12 first. Then 5 + 12 = 17. The answer is not 32.'
      ],
      rule: 'Brackets first. Then × and ÷ left to right. Then + and − left to right.',
      mistake: 'Do not always go left to right. In 5 + 3 × 4 the times goes first, so the answer is 17, not 32.',
      steps: [
        note('Here is the traffic law.', 'The order', ['1. Brackets, like an ambulance, go first', '2. Times and divide, left to right', '3. Add and take away, left to right'])
      ].concat(oooSteps([20, '−', '(', 3, '+', 4, ')', '×', 2])).concat([
        x('Times and divide are twins. When they sit together, go left to right. First 8 ÷ 2 = 4.', ['8 ÷ 2', 'first'], ' × 4'),
        x('Then 4 × 4 = 16. Going right to left would give a different answer.', '4 × 4 = ', ['16', 'answer'])
      ]) },

    { title: '7. Sharing with leftovers',
      explain: [
        'Sometimes you cannot share things perfectly equally. There are pieces left over. The leftover amount is called the remainder.',
        'Say 17 cookies go into boxes of 5. You can fill 3 boxes with 15 cookies. That leaves 2 cookies. We say 17 ÷ 5 = 3 remainder 2.',
        'The remainder is always smaller than the number you divide by. If it is not, one more group still fits.'
      ],
      rule: 'Remainder = what is left. It must be smaller than the divisor.',
      mistake: 'If your remainder is as big as the number you divide by, you can make one more group. Add 1 to the answer and try again.',
      steps: [
        x('17 cookies go into boxes of 5. How many full boxes can we fill?', ['17 ÷ 5', 'how many boxes?']),
        groups('Fill box after box with 5 cookies. We can fill 3 full boxes.', 3, 5, 3, '3 full boxes'),
        x('3 boxes hold 3 × 5 = 15 cookies.', '3 × 5 = ', ['15', 'in the boxes']),
        x('We had 17. We used 15. So 2 cookies are left over.', '17 − 15 = ', ['2', 'remainder']),
        x('We say 3 remainder 2. Some people write 3 R 2.', '17 ÷ 5 = ', ['3', 'boxes'], ' remainder ', ['2', 'left over']),
        note('Is 2 a fair leftover? Yes.', 'Remainder rule', ['The remainder must be smaller than 5', 'If 5 or more were left, another box would fill']),
        x('Check with times. Full boxes times box size, plus the leftover.', '3 × 5 + 2 = ', ['17', 'we started here'])
      ] },

    { title: '8. Long division: one digit divisor',
      explain: [
        'Long division is a neat way to share a big number. You do four moves again and again: divide, multiply, subtract, bring down.',
        'Start at the left. Ask how many times the divisor fits into the first digits. Write that number on top. Multiply, take away, and bring down the next digit.',
        'When there are no more digits, what is left is the remainder.'
      ],
      rule: 'Divide, multiply, subtract, bring down. Repeat.',
      mistake: 'Do not forget to bring the next digit down. And check that the leftover is smaller than the divisor.',
      steps: window.MathEngine.longDiv(85, 6) },

    { title: '9. Long division: two digit divisor',
      explain: [
        'It works exactly the same when the divisor has two digits. The only hard part is guessing how many times it fits.',
        'Use a friendly fact to guess. To see how many times 12 fits into 72, think 12 × 6 = 72. So it fits 6 times.',
        'If your guess is too big, the product will be more than the number. Try one smaller.'
      ],
      rule: 'Guess with a times fact. Multiply. Subtract. Bring down.',
      mistake: 'When the divisor does not fit into a number, write 0 on top. Do not just skip the place.',
      steps: [x('Let us divide 725 by 12. First we look for a fact. 12 × 6 = 72, so 12 fits into 72 six times.', '725 ÷ 12')].concat(window.MathEngine.longDiv(725, 12)) },

    { title: '10. Estimating products and quotients',
      explain: [
        'An estimate is a quick answer that is close. It helps you check your work and it is easy to do in your head.',
        'To estimate a product, round each number to its biggest place. Then multiply the front digits and add the zeros.',
        'To estimate a quotient, find a nearby number that the divisor goes into easily. Use a basic fact to help.'
      ],
      rule: 'Round to friendly numbers first. Then do the easy math.',
      mistake: 'An estimate is not exact. Do not do the hard math and then round at the end.',
      steps: [
        x('Estimate 48 × 31. Round each number to its biggest place.', '48 × 31'),
        x('48 is about 50. 31 is about 30.', '48 is about ', ['50', 'rounded'], ' and 31 is about ', ['30', 'rounded']),
        x('Now do 50 × 30. 5 × 3 = 15, and add 2 zeros.', '50 × 30 = ', ['1,500', 'estimate']),
        x('The exact answer is 1,488. Our estimate is close.', ['1,500', 'estimate'], ' and ', ['1,488', 'exact']),
        x('Now estimate 812 ÷ 9. We know 9 × 9 = 81.', '812 ÷ 9'),
        x('812 is very close to 810. That is 81 with a zero.', '812 is about ', ['810', 'friendly number']),
        x('81 ÷ 9 = 9. With the zero, 810 ÷ 9 = 90.', '810 ÷ 9 = ', ['90', 'estimate']),
        note('Estimates are your safety net.', 'Why estimate?', ['If the exact answer is far from the estimate, look for a mistake', 'Estimates need no paper'])
      ] },

    { title: '11. Word problems and remainders',
      explain: [
        'In a story problem, do the division first. Then read the question again. The remainder can mean different things.',
        'If the question asks how many are full, drop the remainder. If it asks how many are needed, the leftover still needs a place, so add one more. If it asks how many are left, the answer is the remainder.',
        'Always ask yourself what the question wants.'
      ],
      rule: 'Divide first. Then read the question. Full: drop it. Needed: add one. Left: use it.',
      mistake: 'Do not always round up or always drop the remainder. It depends on the question.',
      steps: [
        x('23 students need rides. Each van holds 5 students.', ['23 ÷ 5', 'students ÷ van size']),
        x('Divide first. 23 ÷ 5 = 4 remainder 3.', '23 ÷ 5 = ', ['4', 'full vans'], ' remainder ', ['3', 'students left']),
        groups('4 vans are full. 3 students still need a ride.', 4, 5, 4, '4 full vans'),
        note('The remainder can be used three ways. Read the question.', 'Three questions', ['How many vans are full? Answer 4', 'How many vans are needed? Answer 5', 'How many students are left over? Answer 3']),
        x('Full vans: ignore the remainder.', ['4', 'full vans']),
        x('Vans needed: the 3 students also need a van. Add one more.', '4 + 1 = ', ['5', 'vans needed']),
        x('Left over: the remainder is the answer.', ['3', 'students left over'])
      ] }
  ];

  /* ---------- Question skills ---------- */
  var SK = 'Multiplication and division';

  B.register(2, [

    { id: 'mfact', level: 1, name: 'Multiplication facts', make: function () {
      var a = R.int(4, 9), b = R.int(6, 9), p = a * b, s = b - 5, story = R.int(0, 2) === 0;
      var prompt = story ? 'There are ' + a + ' rows of chairs with ' + b + ' chairs in each row. How many chairs are there?' : 'What is ' + a + ' × ' + b + '?';
      return Q.num({
        skill: 'Times facts', prompt: prompt, answer: p, keyboard: 'numeric', placeholder: 'Type a number',
        traps: clean([T(a * (b - 1), 'That is one group too few. Check ' + a + ' × ' + b + ' by adding ' + a + ' to ' + a * (b - 1) + '.'),
                      T(a * (b + 1), 'That is one group too many. Check it by breaking the fact into 5s.'),
                      T(a + b, 'You added. The sign is times, so find ' + a + ' groups of ' + b + '.')], p),
        work: a + ' × 5 = ' + a * 5 + ' and ' + a + ' × ' + s + ' = ' + a * s + '. ' + a * 5 + ' + ' + a * s + ' = ' + p + '.',
        plain: 'Break the hard fact into a 5s fact and a small fact. Then add.',
        teach: [
          x('Think of ' + a + ' rows with ' + b + ' in each row.', [a + ' × ' + b, 'rows times columns']),
          grid('This grid has ' + a + ' rows and ' + b + ' columns.', b, a, []),
          grid('Cut it after 5 columns. We get two easier facts.', b, a, [{ c0: 0, c1: 5, r0: 0, r1: a, cls: 'bg-indigo-400' }, { c0: 5, c1: b, r0: 0, r1: a, cls: 'bg-emerald-400' }]),
          x(a + ' × 5 = ' + a * 5 + ' and ' + a + ' × ' + s + ' = ' + a * s + '.', a + ' × 5 = ', [String(a * 5), 'blue'], ',  ' + a + ' × ' + s + ' = ', [String(a * s), 'green']),
          x('Add the two parts. ' + a * 5 + ' + ' + a * s + ' = ' + p + '.', [String(a * 5), 'blue'], ' + ', [String(a * s), 'green'], ' = ', [String(p), 'answer'])
        ]
      });
    } },

    { id: 'dfact', level: 1, name: 'Division facts and missing factors', make: function () {
      var a = R.int(3, 12), b = R.int(3, 9), N = a * b, mode = R.int(0, 2);
      var prompt, ans, steps;
      if (mode === 0) {
        prompt = 'What is ' + N + ' ÷ ' + b + '?'; ans = a;
        steps = [
          x('Division asks how many groups of ' + b + ' fit in ' + N + '.', N + ' ÷ ' + b),
          x('Turn it into a times question. ' + b + ' times what number is ' + N + '?', b + ' × ', ['?', 'missing'], ' = ' + N),
          x(b + ' × ' + a + ' = ' + N + '. So the missing number is ' + a + '.', b + ' × ', [String(a), 'fits'], ' = ' + N),
          x('So ' + N + ' ÷ ' + b + ' = ' + a + '.', [String(a), 'answer'])
        ];
      } else if (mode === 1) {
        prompt = 'Find the missing number. ? × ' + b + ' = ' + N; ans = a;
        steps = [
          x('We need the number that times ' + b + ' makes ' + N + '.', ['?', 'missing'], ' × ' + b + ' = ' + N),
          x('Undo the times with divide. ' + N + ' ÷ ' + b + ' will find it.', N + ' ÷ ' + b + ' = ', ['?', 'missing']),
          x('Think of the fact family. ' + a + ' × ' + b + ' = ' + N + '.', [String(a), 'fits'], ' × ' + b + ' = ' + N),
          x('So the missing number is ' + a + '.', [String(a), 'answer'])
        ];
      } else {
        prompt = 'Find the missing number. ' + N + ' ÷ ? = ' + a; ans = b;
        steps = [
          x('We need the number to divide ' + N + ' by to get ' + a + '.', N + ' ÷ ', ['?', 'missing'], ' = ' + a),
          x('Turn it around. ? × ' + a + ' = ' + N + '.', ['?', 'missing'], ' × ' + a + ' = ' + N),
          x(b + ' × ' + a + ' = ' + N + '. So the missing number is ' + b + '.', [String(b), 'fits'], ' × ' + a + ' = ' + N),
          x('Check. ' + N + ' ÷ ' + b + ' = ' + a + '.', [String(b), 'answer'])
        ];
      }
      steps.push(note('These four facts belong together.', 'A fact family', [a + ' × ' + b + ' = ' + N, b + ' × ' + a + ' = ' + N, N + ' ÷ ' + a + ' = ' + b, N + ' ÷ ' + b + ' = ' + a]));
      return Q.num({
        skill: 'Division facts', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: clean([T(ans + 1, 'Close, but check by multiplying. Does your number times the other number make ' + N + '?'),
                      T(ans - 1, 'Close, but check by multiplying. Does your number times the other number make ' + N + '?'),
                      T(N - (mode === 2 ? a : b), 'You took away. Division shares into equal groups. Think of the times fact.')], ans),
        work: 'The fact family is ' + a + ' × ' + b + ' = ' + N + '. The missing number is ' + ans + '.',
        plain: 'Every division fact is a times fact turned around. Think which times fact fits.',
        teach: steps
      });
    } },

    { id: 'mulbytens', level: 2, name: 'Multiply tens, hundreds, thousands', make: function () {
      var a = R.int(2, 9), b = R.int(2, 9), i = R.int(0, 2), j = R.int(1, 2), A = a * pow10(i), Bv = b * pow10(j), zt = i + j, f = a * b, ans = A * Bv;
      if (R.int(0, 1)) { var tt = A; A = Bv; Bv = tt; }
      return Q.num({
        skill: 'Multiply by tens and hundreds', prompt: 'What is ' + fmt(A) + ' × ' + fmt(Bv) + '?', answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: clean([T(ans / 10, 'You lost a zero. Count the zeros in both numbers and put them all at the end.'),
                      T(ans * 10, 'You added one zero too many. Count the zeros in both numbers carefully.'),
                      T(f, 'That is just the basic fact. Now add the zeros from both numbers.')], ans),
        work: a + ' × ' + b + ' = ' + f + '. There are ' + plural(zt, 'zero') + ' in all, so the answer is ' + fmt(ans) + '.',
        plain: 'Multiply the front digits. Then count every zero in both numbers and add them at the end.',
        teach: [
          x('Each number is a basic fact with zeros on the end.', fmt(A) + ' × ' + fmt(Bv)),
          x('Multiply the front digits. ' + a + ' × ' + b + ' = ' + f + '.', [String(a), 'front digit'], ' × ', [String(b), 'front digit'], ' = ', [String(f), 'basic fact']),
          x('Count the zeros. ' + fmt(A) + ' has ' + plural(i, 'zero') + ' and ' + fmt(Bv) + ' has ' + plural(j, 'zero') + '. That is ' + plural(zt, 'zero') + ' in all.', [String(zt), 'zeros in all']),
          x('Put ' + plural(zt, 'zero') + ' after ' + f + '.', [String(f), 'fact'], [zeros(zt), zt + ' zeros']),
          x('So ' + fmt(A) + ' × ' + fmt(Bv) + ' = ' + fmt(ans) + '.', [fmt(ans), 'answer'])
        ]
      });
    } },

    { id: 'mul3x1', level: 2, name: 'Multiply 3 digit by 1 digit', make: function () {
      var n = R.int(1, 9) * 100 + R.int(1, 9) * 10 + R.int(1, 9), k = R.int(3, 9), d = digs(n), ans = n * k, story = R.int(0, 2) === 0;
      var prompt = story ? mulStories(n, k) : 'What is ' + n + ' × ' + k + '?';
      return Q.num({
        skill: 'Multiply with partial products', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: clean([T(d[0] * k + d[1] * k + d[2] * k, 'You multiplied the digits alone. The ' + d[0] + ' is worth ' + d[0] * 100 + ' and the ' + d[1] + ' is worth ' + d[1] * 10 + '.'),
                      T(d[0] * 100 * k + d[2] * k, 'You left out the tens part. Multiply hundreds, tens and ones, then add all three.')], ans),
        work: d[0] * 100 + ' × ' + k + ' = ' + fmt(d[0] * 100 * k) + ', ' + d[1] * 10 + ' × ' + k + ' = ' + fmt(d[1] * 10 * k) + ', ' + d[2] + ' × ' + k + ' = ' + d[2] * k + '. Total ' + fmt(ans) + '.',
        plain: 'Break the big number into hundreds, tens and ones. Multiply each piece. Add the pieces.',
        teach: partialSteps3x1(n, k)
      });
    } },

    { id: 'ooo1', level: 2, name: 'Order of operations, no brackets', make: function () {
      var kind = R.int(0, 4), c, b, a;
      if (kind === 0) {
        c = R.int(2, 6); b = c * R.int(2, 6); a = c * R.int(1, 5);
        return oooQuestionFrom([a, '+', b, '÷', c], 'Order of operations');
      }
      if (kind === 1) {
        c = R.int(2, 6); b = R.int(2, 6); a = b * c + R.int(1, 15);
        return oooQuestionFrom([a, '−', b, '×', c], 'Order of operations');
      }
      var t = [['a', '+', 'b', '×', 'c'], ['a', '×', 'b', '−', 'c', '×', 'd'], ['a', '−', 'b', '+', 'c', '×', 'd']][kind - 2];
      return oooQuestion(t, 2, 9, 'Order of operations');
    } },

    { id: 'mul2x2', level: 3, name: 'Multiply 2 digit by 2 digit', make: function () {
      var a = R.int(1, 4) * 10 + R.int(2, 9), b = R.int(1, 3) * 10 + R.int(2, 9), ans = a * b, story = R.int(0, 2) === 0;
      var A = digs(a), Bd = digs(b), a1 = A[0] * 10, a0 = A[1], b1 = Bd[0] * 10, b0 = Bd[1];
      var prompt = story ? 'A theater has ' + a + ' rows with ' + b + ' seats in each row. How many seats are there in all?' : 'What is ' + a + ' × ' + b + '?';
      return Q.num({
        skill: 'Multiply 2 digit numbers', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: clean([T(a1 * b1 + a0 * b0, 'You only did tens times tens and ones times ones. Every part of one number must multiply every part of the other.'),
                      T(a * Bd[0] + a * b0, 'You forgot the zero. ' + a + ' × ' + b1 + ' is ' + fmt(a * b1) + ', not ' + fmt(a * Bd[0]) + '.'),
                      T(a * b1, 'You forgot to multiply by the ' + b0 + ' ones. Add ' + a + ' × ' + b0 + ' too.')], ans),
        work: fmt(a1 * b1) + ' + ' + fmt(a1 * b0) + ' + ' + fmt(a0 * b1) + ' + ' + a0 * b0 + ' = ' + fmt(ans) + '.',
        plain: 'Break both numbers into tens and ones. Find the four small boxes. Add them.',
        teach: areaSteps2x2(a, b)
      });
    } },

    { id: 'ooo2', level: 3, name: 'Order of operations with brackets', make: function () {
      var t = R.pick([
        ['(', 'a', '+', 'b', ')', '×', 'c'], ['a', '×', '(', 'b', '+', 'c', ')'], ['(', 'a', '−', 'b', ')', '×', 'c'],
        ['a', '−', '(', 'b', '−', 'c', ')'], ['(', 'a', '+', 'b', ')', '×', 'c', '−', 'd'], ['a', '+', '(', 'b', '−', 'c', ')', '×', 'd'],
        ['a', '×', '(', 'b', '+', 'c', ')', '−', 'd']
      ]);
      return oooQuestion(t, 2, 12, 'Order of operations with brackets');
    } },

    { id: 'divrem1', level: 3, name: 'Long division, one digit divisor', make: function () {
      var d = R.int(3, 9), q = R.int(12, Math.floor(999 / d) - 1), r = R.int(1, d - 1), N = d * q + r;
      var story = R.int(0, 2) === 0;
      var prompt = story ? R.pick(DIV_STORIES)(N, d) : 'Divide ' + N + ' by ' + d + '. Write the quotient and the remainder.';
      return Q.divrem({
        skill: 'Long division', prompt: prompt, answer: [q, r], divisor: d, traps: divTraps(q, r, d),
        work: q + ' × ' + d + ' = ' + fmt(q * d) + ' and ' + N + ' − ' + fmt(q * d) + ' = ' + r + '. So ' + N + ' ÷ ' + d + ' = ' + q + ' remainder ' + r + '.',
        plain: 'Divide, multiply, subtract, bring down. Repeat. What is left at the end is the remainder.',
        teach: divTeach(N, d, q, r)
      });
    } },

    { id: 'estimate', level: 4, name: 'Estimate products and quotients', make: function () {
      if (R.int(0, 1) === 0) {
        var a, b, ra, rb, tries = 0;
        do {
          a = R.pick([R.int(12, 98), R.int(112, 899)]); b = R.int(12, 98); ra = lead(a); rb = lead(b); tries++;
        } while ((ra === a && rb === b) && tries < 100);
        var est = ra * rb, exact = a * b, za = stripZ(ra), zb = stripZ(rb), f = za.core * zb.core, z = za.z + zb.z;
        return Q.num({
          skill: 'Estimate a product', prompt: 'Estimate ' + a + ' × ' + b + ' by rounding each number to its biggest place.',
          answer: est, keyboard: 'numeric', placeholder: 'Type your estimate',
          traps: clean([T(exact, 'That is the exact answer. An estimate rounds first so the math is easy.'),
                        T(est * 10, 'Count the zeros again. Multiply the front digits, then add the zeros from both rounded numbers.'),
                        T(est / 10, 'Count the zeros again. Multiply the front digits, then add the zeros from both rounded numbers.')], est),
          work: a + ' is about ' + ra + ' and ' + b + ' is about ' + rb + '. ' + fmt(ra) + ' × ' + fmt(rb) + ' = ' + fmt(est) + '.',
          plain: 'Round both numbers to friendly numbers. Multiply the front digits and add the zeros.',
          teach: [
            x('First round each number to its biggest place.', a + ' × ' + b),
            x('Round ' + a + '. It is about ' + fmt(ra) + '.', a + ' is about ', [fmt(ra), 'rounded']),
            x('Round ' + b + '. It is about ' + fmt(rb) + '.', b + ' is about ', [fmt(rb), 'rounded']),
            x('Multiply the front digits. ' + za.core + ' × ' + zb.core + ' = ' + f + '. Then add ' + plural(z, 'zero') + '.', [String(f), 'fact'], [zeros(z), plural(z, 'zero')], ' = ', [fmt(est), 'estimate']),
            x('The exact answer is ' + fmt(exact) + '. Our estimate is close.', [fmt(est), 'estimate'], ' and ', [fmt(exact), 'exact'])
          ]
        });
      }
      var d = R.int(3, 9), fct = R.int(3, 9), k = R.int(1, 2), P = d * fct, base = P * pow10(k), off = R.int(1, 4) * (k === 2 ? 10 : 1) * (R.int(0, 1) ? 1 : -1), N = base + off, ans = fct * pow10(k);
      return Q.num({
        skill: 'Estimate a quotient', prompt: 'Estimate ' + fmt(N) + ' ÷ ' + d + '. Use the basic fact ' + d + ' × ' + fct + ' = ' + P + ' to help you.',
        answer: ans, keyboard: 'numeric', placeholder: 'Type your estimate',
        traps: clean([T(ans * 10, 'You have one zero too many. ' + fmt(N) + ' is close to ' + fmt(base) + ', which is ' + fmt(P) + ' with ' + plural(k, 'zero') + '.'),
                      T(ans / 10, 'You have one zero too few. ' + fmt(N) + ' is close to ' + fmt(base) + ', which is ' + fmt(P) + ' with ' + plural(k, 'zero') + '.'),
                      T(fct, 'That is the basic fact answer. ' + fmt(N) + ' is much bigger than ' + P + ', so add the zeros.')], ans),
        work: fmt(N) + ' is close to ' + fmt(base) + '. ' + fmt(base) + ' ÷ ' + d + ' = ' + fmt(ans) + '.',
        plain: 'Swap the number for a friendly one that ' + d + ' divides easily. Then use the fact and add the zeros.',
        teach: [
          x('We look for a friendly number near ' + fmt(N) + '. The fact ' + d + ' × ' + fct + ' = ' + P + ' helps.', fmt(N) + ' ÷ ' + d),
          x(fmt(N) + ' is very close to ' + fmt(base) + '. That is ' + P + ' with ' + plural(k, 'zero') + '.', fmt(N) + ' is about ', [fmt(base), 'friendly number']),
          x('Use the fact. ' + P + ' ÷ ' + d + ' = ' + fct + '.', P + ' ÷ ' + d + ' = ', [String(fct), 'basic fact']),
          x('Add ' + plural(k, 'zero') + ' back. ' + fmt(base) + ' ÷ ' + d + ' = ' + fmt(ans) + '.', [String(fct), 'fact'], [zeros(k), plural(k, 'zero')], ' = ', [fmt(ans), 'estimate']),
          x('Check with times. ' + d + ' × ' + fmt(ans) + ' = ' + fmt(base) + ', which is close to ' + fmt(N) + '.', d + ' × ' + fmt(ans) + ' = ', [fmt(base), 'close to ' + fmt(N)])
        ]
      });
    } },

    { id: 'mul3x2', level: 4, name: 'Multiply 3 digit by 2 digit', make: function () {
      var n = R.int(1, 8) * 100 + R.int(0, 9) * 10 + R.int(1, 9), b = R.int(1, 4) * 10 + R.int(2, 9), t = Math.floor(b / 10), o = b % 10, ans = n * b, story = R.int(0, 2) === 0;
      var prompt = story ? R.pick([
        'A warehouse has ' + b + ' shelves. Each shelf holds ' + n + ' books. How many books are on the shelves in all?',
        'A bus company runs ' + b + ' trips. Each trip carries ' + n + ' people. How many people is that in all?'
      ]) : 'What is ' + n + ' × ' + b + '?';
      return Q.num({
        skill: 'Multiply 3 digit by 2 digit', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: clean([T(n * t + n * o, 'You forgot the zero. ' + n + ' × ' + t * 10 + ' is ' + fmt(n * t * 10) + ', not ' + fmt(n * t) + '.'),
                      T(n * t * 10, 'You forgot to multiply by the ' + o + ' ones. Add ' + n + ' × ' + o + ' too.'),
                      T(n * o, 'You only multiplied by the ones. Multiply by the tens part too and add.')], ans),
        work: n + ' × ' + t * 10 + ' = ' + fmt(n * t * 10) + ' and ' + n + ' × ' + o + ' = ' + fmt(n * o) + '. Total ' + fmt(ans) + '.',
        plain: 'Multiply by the tens part and by the ones part. Add the two answers.',
        teach: partialSteps3x2(n, b)
      });
    } },

    { id: 'divrem2', level: 4, name: 'Long division, two digit divisor', make: function () {
      var d = R.int(12, 48), q = R.int(10, Math.min(60, Math.floor(999 / d) - 1)), r = R.int(1, d - 1), N = d * q + r;
      return Q.divrem({
        skill: 'Long division, 2 digit divisor', prompt: 'Divide ' + N + ' by ' + d + '. Write the quotient and the remainder.', answer: [q, r], divisor: d, traps: divTraps(q, r, d),
        work: q + ' × ' + d + ' = ' + fmt(q * d) + ' and ' + N + ' − ' + fmt(q * d) + ' = ' + r + '. So ' + N + ' ÷ ' + d + ' = ' + q + ' remainder ' + r + '.',
        plain: 'Guess how many times ' + d + ' fits using a times fact. Multiply, subtract, bring down. The leftover is the remainder.',
        teach: divTeach(N, d, q, r)
      });
    } },

    { id: 'remstory', level: 5, name: 'Remainders in word problems', make: function () {
      var d = R.int(3, 9), q = R.int(3, Math.floor(99 / d) - 1), r = R.int(1, d - 1), N = d * q + r, mode = R.pick(['full', 'need', 'left']);
      var t = R.pick([
        { s: N + ' students are going on a trip. Each van holds ' + d + ' students.', full: 'How many vans will be completely full?', need: 'How many vans are needed to carry all the students?', left: 'How many students ride in the van that is not full?', a: 'vans', b: 'students' },
        { s: 'A baker has ' + N + ' cookies. Each box holds ' + d + ' cookies.', full: 'How many boxes can be completely filled?', need: 'How many boxes are needed to hold all the cookies?', left: 'How many cookies are left after the full boxes are packed?', a: 'boxes', b: 'cookies' },
        { s: 'Rinka has ' + N + ' stickers. Each page holds ' + d + ' stickers.', full: 'How many pages will be completely filled?', need: 'How many pages does she need to fit all the stickers?', left: 'How many stickers go on the last page that is not full?', a: 'pages', b: 'stickers' },
        { s: 'A farm collects ' + N + ' eggs. Each carton holds ' + d + ' eggs.', full: 'How many cartons will be completely full?', need: 'How many cartons are needed for all the eggs?', left: 'How many eggs are left over after the full cartons are filled?', a: 'cartons', b: 'eggs' }
      ]);
      var ans = mode === 'full' ? q : (mode === 'need' ? q + 1 : r);
      var traps = [];
      if (mode === 'full') { traps.push(T(q + 1, 'The last ' + t.a.replace(/s$/, '') + ' is not full. The question asks only for the full ones.')); traps.push(T(r, 'That is the remainder. The question asks how many are full.')); }
      if (mode === 'need') { traps.push(T(q, 'That is only the full ones. The ' + r + ' left over still need one more.')); traps.push(T(r, 'That is the remainder. The question asks how many are needed.')); }
      if (mode === 'left') { traps.push(T(q, 'That is the number of full ones. The question asks how many are left over.')); traps.push(T(q + 1, 'The question asks how many are left over, which is the remainder.')); }
      var meaning = mode === 'full' ? 'The question asks for full ones, so we drop the remainder. The answer is ' + q + '.'
        : (mode === 'need' ? 'The ' + r + ' left over need one more, so we add 1. ' + q + ' + 1 = ' + (q + 1) + '.' : 'The question asks what is left over. The remainder is the answer, ' + r + '.');
      return Q.num({
        skill: 'Remainders in stories', prompt: t.s + ' ' + t[mode], answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: clean(traps, ans),
        work: N + ' ÷ ' + d + ' = ' + q + ' remainder ' + r + '. ' + meaning,
        plain: 'Divide first. Then read what the question asks. Full: drop the remainder. Needed: add one. Left over: use the remainder.',
        teach: [
          x('First divide the total by the size of each group.', [String(N), 'total'], ' ÷ ', [String(d), 'in each group']),
          x('The biggest multiple of ' + d + ' that fits is ' + d + ' × ' + q + ' = ' + d * q + '. The next one, ' + d * (q + 1) + ', is too big.', d + ' × ' + q + ' = ', [String(d * q), 'fits']),
          x(N + ' − ' + d * q + ' = ' + r + ' left over.', N + ' ÷ ' + d + ' = ', [String(q), 'full groups'], ' remainder ', [String(r), 'left over']),
          note('Now read the question again. It asks: ' + t[mode], 'What does the question want?', [mode === 'full' ? 'Full groups: drop the remainder' : (mode === 'need' ? 'Needed: the leftover needs a group too' : 'Left over: the remainder is the answer')]),
          x(meaning, [String(ans), 'answer'])
        ]
      });
    } },

    { id: 'twostep', level: 6, name: 'Two step word problems', make: function () {
      var kind = R.int(0, 5), A, Bv, C, toks, prompt, plan, tr = [];
      for (var tries = 0; tries < 500; tries++) {
        if (kind === 0) {
          A = R.int(2, 9); Bv = R.int(2, 9); C = R.pick([20, 50, 100]);
          if (C <= A * Bv) continue;
          toks = [C, '−', A, '×', Bv];
          prompt = 'A store sells notebooks for $' + A + ' each. Mia buys ' + Bv + ' notebooks and pays with a $' + C + ' bill. How many dollars of change does she get?';
          plan = 'The change is the money paid minus the cost. The cost is ' + A + ' × ' + Bv + '.';
          tr = [T(A * Bv, 'That is the cost of the notebooks. The question asks for the change.'), T((C - A) * Bv, 'You took away first. The notebooks cost ' + A + ' × ' + Bv + ' before you take anything away from ' + C + '.')];
        } else if (kind === 1) {
          A = R.int(3, 9); Bv = R.int(6, 12); C = R.int(5, A * Bv - 1);
          toks = [A, '×', Bv, '−', C];
          prompt = 'A baker bakes ' + A + ' trays of ' + Bv + ' muffins. He sells ' + C + ' muffins. How many muffins are left?';
          plan = 'First find how many muffins were baked, ' + A + ' × ' + Bv + '. Then take away the ones sold.';
          tr = [T(A * Bv, 'That is how many muffins were baked. Now take away the ' + C + ' that were sold.'), T(A * Bv + C, 'Muffins that are sold are gone. Take them away, do not add them.')];
        } else if (kind === 2) {
          A = R.int(2, 10) * 5; Bv = R.int(4, 12); C = R.int(3, 8);
          toks = [A, '+', Bv, '×', C];
          prompt = 'Rinka has $' + A + '. She earns $' + Bv + ' every week for ' + C + ' weeks. How many dollars does she have then?';
          plan = 'First find what she earns, ' + Bv + ' × ' + C + '. Then add the money she already has.';
          tr = [T((A + Bv) * C, 'You added first. Find the money earned, ' + Bv + ' × ' + C + ', before you add.'), T(Bv * C, 'That is only what she earned. Add the $' + A + ' she started with.')];
        } else if (kind === 3) {
          A = R.int(3, 9); Bv = R.int(6, 12); C = R.int(2, 9);
          if ((A * Bv) % C !== 0) continue;
          toks = ['(', A, '×', Bv, ')', '÷', C];
          prompt = 'A school orders ' + A + ' boxes with ' + Bv + ' pencils in each box. The pencils are shared equally among ' + C + ' classes. How many pencils does each class get?';
          plan = 'First find how many pencils there are, ' + A + ' × ' + Bv + '. Then share them equally.';
          tr = [T(A * Bv, 'That is the total number of pencils. Now share them among the ' + C + ' classes.'), (Bv % C === 0 ? T(Bv / C, 'That shares only one box. Share all ' + A + ' boxes of pencils.') : T(A + Bv, 'You added. Multiply the boxes by the pencils in each box first.'))];
        } else if (kind === 4) {
          A = R.int(4, 9); Bv = R.int(6, 12); C = R.int(3, A * Bv - 1);
          toks = [A, '×', Bv, '−', C];
          prompt = 'A cinema has ' + A + ' rows with ' + Bv + ' seats in each row. ' + C + ' seats are broken. How many seats can people use?';
          plan = 'First find all the seats, ' + A + ' × ' + Bv + '. Then take away the broken seats.';
          tr = [T(A * Bv, 'That counts the broken seats too. Take away the ' + C + ' broken seats.'), T(A * Bv + C, 'The broken seats cannot be used. Take them away, do not add them.')];
        } else {
          Bv = R.int(2, 6); C = R.int(3, 12); A = Bv * C + R.int(2, 30);
          toks = [A, '−', Bv, '×', C];
          prompt = 'Sam has $' + A + '. He buys ' + Bv + ' packs of cards for $' + C + ' each. How many dollars does he have left?';
          plan = 'First find the cost of the cards, ' + Bv + ' × ' + C + '. Then take it away from $' + A + '.';
          tr = [T(Bv * C, 'That is what the cards cost. The question asks how much money is left.'), T((A - Bv) * C, 'You took away first. Find the cost, ' + Bv + ' × ' + C + ', and take that away from $' + A + '.')];
        }
        var pl = oooPlan(toks);
        if (!pl.ok) continue;
        var ans = pl.result;
        var steps = [x(plan, tokStr(toks))].concat(oooSteps(toks).slice(1));
        return Q.num({
          skill: 'Two step word problems', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
          traps: clean(tr, ans),
          work: 'Write it as ' + tokStr(toks) + '. ' + pl.plan.map(function (p) { return fmt(p.x) + ' ' + p.op + ' ' + fmt(p.y) + ' = ' + fmt(p.r); }).join(', then ') + '. The answer is ' + fmt(ans) + '.',
          plain: 'Find the first amount, then use it for the second step. Write the two steps as one math sentence and follow the order of operations.',
          teach: steps
        });
      }
      return null;
    } }
  ]);

  /* Helper used by the one skill that builds its own numbers. */
  function oooQuestionFrom(toks, skill) {
    var pl = oooPlan(toks), ans = pl.result, traps = [];
    var lr = lrEval(toks);
    if (Math.floor(lr) === lr && lr >= 0) traps.push(T(lr, 'It looks like you went straight from left to right. Times and divide must be done before add and take away.'));
    var stepsText = pl.plan.map(function (p) { return fmt(p.x) + ' ' + p.op + ' ' + fmt(p.y) + ' = ' + fmt(p.r); }).join(', then ');
    return Q.num({
      skill: skill, prompt: 'What is ' + tokStr(toks) + '?', answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number',
      traps: clean(traps, ans),
      work: 'Follow the order: ' + stepsText + '. The answer is ' + fmt(ans) + '.',
      plain: 'Brackets first. Then times and divide. Then add and take away. Rewrite the problem after each step.',
      teach: oooSteps(toks)
    });
  }
})();
