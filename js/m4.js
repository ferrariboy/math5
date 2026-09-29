/* Module 4: Decimals Mastery. Lessons, vocabulary and question skills. */
(function () {
  'use strict';
  var B = window.Bank, R = B.R, S = B.s, Q = B.q, T = Q.trap;
  var x = S.x, note = S.note, bars = S.bars, fb = S.fb, row = S.row, grid = S.grid, groups = S.groups, lines = S.lines;
  var E = window.MathEngine;

  /* num(o): Q.num with the trap list cleaned. A trap may not equal the answer, repeat, or break the answer format. */
  function pv(s) {
    s = String(s);
    var m = s.match(/^(\d+)\/(\d+)$/);
    if (m) return +m[2] ? (+m[1]) / (+m[2]) : NaN;
    return /^\d+(\.\d+)?$/.test(s) ? parseFloat(s) : NaN;
  }
  function num(o) {
    var a = pv(o.answer), seen = [], keep = [];
    (o.traps || []).forEach(function (t) {
      var v = pv(t.value);
      if (isNaN(v) || Math.abs(v - a) < 1e-9) return;
      for (var i = 0; i < seen.length; i++) if (Math.abs(seen[i] - v) < 1e-9) return;
      seen.push(v); keep.push(t);
    });
    o.traps = keep.slice(0, 3);
    return Q.num(o);
  }

  /* ---------- Helpers: decimals are built from whole numbers so nothing goes wrong with floating point ---------- */
  function dec(n, p) {
    var s = String(Math.abs(n));
    if (!p) return s;
    while (s.length <= p) s = '0' + s;
    return s.slice(0, s.length - p) + '.' + s.slice(s.length - p);
  }
  function strip(s) { return s.indexOf('.') < 0 ? s : s.replace(/0+$/, '').replace(/\.$/, ''); }
  function ds(n, p) { return strip(dec(n, p)); }
  function pw(k) { return Math.pow(10, k); }
  function money(c) { return '$' + dec(c, 2); }
  function pl(n, one, many) { return n + ' ' + (n === 1 ? one : (many || one + 's')); }
  var PLACE = ['', 'tenths', 'hundredths', 'thousandths'];
  var ORD = ['', 'first', 'second', 'third'];

  /* xt(cap, parts): x() with the parts already in a list */
  function xt(cap, parts) { return x.apply(null, [cap].concat(parts)); }
  /* toks(s, marks): split a string into tokens. marks maps a character index to a tag. */
  function toks(s, marks) {
    var out = [], buf = '';
    for (var i = 0; i < s.length; i++) {
      if (marks[i] !== undefined) {
        if (buf) { out.push(buf); buf = ''; }
        out.push([s.charAt(i), marks[i]]);
      } else buf += s.charAt(i);
    }
    if (buf) out.push(buf);
    return out;
  }

  /* shift(str, k): move the decimal point k places right (k > 0) or left (k < 0) and tidy the result */
  function shift(str, k) {
    var p = String(str).split('.');
    var digits = p[0] + (p[1] || '');
    var pos = p[0].length + k;
    if (pos <= 0) { var z = 1 - pos; digits = new Array(z + 1).join('0') + digits; pos += z; }
    while (pos > digits.length) digits += '0';
    var ip = digits.slice(0, pos).replace(/^0+(?=\d)/, '');
    var fp = digits.slice(pos).replace(/0+$/, '');
    return fp ? ip + '.' + fp : ip;
  }

  function sortedIdxOf(vals, k) { return [0, 1, 2].sort(function (a, b) { return vals[a] - vals[b]; })[k]; }

  /* Round a number stored in thousandths to p decimal places. Half rounds up. */
  function roundThou(N, p) {
    var f = pw(3 - p);
    return Math.floor((N + f / 2) / f);
  }

  /* Column subtraction with borrowing. aInt and bInt are whole numbers that count 10^-p units. aInt > bInt. */
  function subSteps(aInt, bInt, p) {
    var ad = dec(aInt, p).replace('.', ''), bd = dec(bInt, p).replace('.', '');
    var n = Math.max(ad.length, bd.length);
    while (ad.length < n) ad = '0' + ad;
    while (bd.length < n) bd = '0' + bd;
    var top = ad.split('').map(Number), bot = bd.split('').map(Number);
    var dotAt = n - p;
    var cur = top.slice(), chg = [], res = [];
    var i;
    for (i = 0; i < n; i++) { chg.push(null); res.push(null); }
    function cell(v) { return v === null ? '   ' : (v < 10 ? ' ' + v + ' ' : v + ' '); }
    function rowStr(cells, showDot) {
      var a = cells.slice(0, dotAt).map(cell).join('');
      var b = cells.slice(dotAt).map(cell).join('');
      return a + (showDot ? ' . ' : '   ') + b;
    }
    function nameAt(idx) {
      if (idx >= dotAt) return PLACE[idx - dotAt + 1];
      return ['ones', 'tens', 'hundreds', 'thousands'][dotAt - 1 - idx] || 'next place';
    }
    function frame(hi, cap) {
      return {
        kind: 'lines', cap: cap, hiFrom: hi,
        lines: [
          '   ' + rowStr(chg, true),
          '   ' + rowStr(top, true),
          '−  ' + rowStr(bot, true),
          '   ' + new Array(3 * n + 4).join('_'),
          '   ' + rowStr(res, res[dotAt] !== null && res[dotAt] !== undefined)
        ]
      };
    }
    var steps = [];
    steps.push(frame(99, 'Line up the decimal points. Fill any gap with a zero so both numbers end in the same place.'));
    for (var col = n - 1; col >= 0; col--) {
      if (cur[col] < bot[col]) {
        var k = col - 1;
        while (k >= 0 && cur[k] === 0) k--;
        var was = cur[col], oldk = cur[k];
        cur[k] -= 1;
        for (var m = k + 1; m < col; m++) cur[m] = 9;
        cur[col] += 10;
        chg[k] = cur[k];
        for (var m2 = k + 1; m2 < col; m2++) chg[m2] = 9;
        chg[col] = cur[col];
        var bc;
        if (k === col - 1) {
          bc = was + ' is less than ' + bot[col] + '. Borrow 1 from the ' + nameAt(k) + ': ' + oldk + ' becomes ' + cur[k] + ' and ' + was + ' becomes ' + cur[col] + '.';
        } else {
          bc = 'The next place is 0, so borrow from the ' + nameAt(k) + '. The zeros in between become 9s and ' + was + ' becomes ' + cur[col] + '.';
        }
        steps.push(frame(0, bc));
      }
      var d = cur[col] - bot[col];
      res[col] = d;
      steps.push(frame(4, 'Take away the ' + nameAt(col) + ': ' + cur[col] + ' − ' + bot[col] + ' = ' + d + '.'));
    }
    steps.push(frame(4, dec(aInt, p) + ' − ' + dec(bInt, p) + ' = ' + dec(aInt - bInt, p) + '.'));
    return steps;
  }
  function withCap(step, cap) {
    var c = JSON.parse(JSON.stringify(step));
    c.cap = cap;
    return c;
  }
  function lastOf(steps) { return steps[steps.length - 1]; }
  function finalAdd(aStr, bStr, cap) { return withCap(lastOf(E.verticalAdd(aStr, bStr)), cap); }
  function finalSub(aInt, bInt, p, cap) { return withCap(lastOf(subSteps(aInt, bInt, p)), cap); }

  /* ---------- Vocabulary ---------- */
  window.MATH_VOCAB[4] = [
    { w: 'Decimal', m: 'A number that uses a decimal point to show parts of a whole, like 3.45.' },
    { w: 'Decimal point', m: 'The dot in a decimal. Whole numbers are on its left. Parts of a whole are on its right.' },
    { w: 'Tenths', m: 'The first place after the point. One tenth is 0.1, or one part out of 10.' },
    { w: 'Hundredths', m: 'The second place after the point. One hundredth is 0.01, or one part out of 100.' },
    { w: 'Thousandths', m: 'The third place after the point. One thousandth is 0.001, or one part out of 1000.' },
    { w: 'Place value', m: 'The job a digit has because of where it sits. The 4 in 0.4 means 4 tenths, but the 4 in 0.04 means 4 hundredths.' },
    { w: 'Round', m: 'Change a number to a nearby simpler number. 3.47 rounded to the nearest tenth is 3.5.' },
    { w: 'Estimate', m: 'A quick answer that is close but not exact. You round the numbers first, then work with the easy ones.' }
  ];

  /* ---------- Lessons ---------- */
  var sq = 'bg-indigo-400';
  window.MATH_LESSONS[4] = [
    { title: '1. Tenths: one whole cut into ten',
      explain: [
        'Whole numbers count things, like 1, 2 and 3. But what about the space between 0 and 1? That is where decimals live.',
        'Picture a chocolate bar cut into 10 equal strips. One strip is one tenth. We write one tenth as 0.1. The dot is called the decimal point.',
        'Digits to the left of the point are whole things. Digits to the right of the point are parts of one whole.'
      ],
      rule: 'One tenth is 0.1. Ten tenths make 1 whole.',
      mistake: 'Do not read 0.3 as zero point thirty. It is 3 tenths. Say zero point three.',
      steps: [
        bars('Here is one whole chocolate bar.', [row('Whole bar', 1, 'bg-amber-300', '1')]),
        bars('Cut it into 10 equal strips.', [fb('10 equal strips', 10, 0)]),
        bars('One strip is one tenth of the bar. We write 0.1.', [fb('1 strip', 10, 1, 'bg-amber-400', '', '0.1')]),
        bars('Three strips are three tenths. We write 0.3.', [fb('3 strips', 10, 3, 'bg-amber-400', '', '0.3')]),
        x('The 0 shows no whole bars. The dot separates whole bars from parts. The 3 counts tenths.', ['0', 'ones'], ['.', 'decimal point'], ['3', 'tenths']),
        bars('All ten strips make one whole bar again. Ten tenths equal 1.', [fb('10 tenths', 10, 10, 'bg-amber-400', '', '1')]),
        bars('One whole bar and 4 more tenths is 1.4.', [row('1 whole', 10, 'bg-amber-400', ''), fb('4 tenths', 10, 4, 'bg-amber-400', '', '0.4')]),
        x('So 1 whole and 4 tenths is written 1.4.', ['1', 'whole'], ['.', 'point'], ['4', 'tenths'])
      ] },

    { title: '2. Hundredths and thousandths',
      explain: [
        'Look closely at one tenth strip. Cut it into 10 tiny pieces. Each tiny piece is one hundredth. We write it 0.01.',
        'Now cut one hundredth into 10 crumbs. Each crumb is one thousandth. We write it 0.001.',
        'Every place is 10 times smaller than the place on its left. That is why one whole has 1000 thousandths.'
      ],
      rule: 'Each place is 10 times smaller than the place to its left.',
      mistake: '0.05 and 0.005 are not the same. 5 hundredths is ten times more than 5 thousandths.',
      steps: [
        grid('This big square is one whole. It is cut into 100 small squares.', 10, 10, []),
        grid('One column has 10 small squares. That is one tenth, 0.1.', 10, 10, [{ c0: 0, c1: 1, r0: 0, r1: 10, cls: sq }]),
        grid('One small square is one hundredth, 0.01.', 10, 10, [{ c0: 0, c1: 1, r0: 0, r1: 1, cls: 'bg-emerald-500' }]),
        grid('Shade 2 full columns and 3 more squares. That is 23 small squares.', 10, 10, [{ c0: 0, c1: 2, r0: 0, r1: 10, cls: sq }, { c0: 2, c1: 3, r0: 0, r1: 3, cls: 'bg-emerald-500' }]),
        x('That is 2 tenths and 3 hundredths. It is also 23 hundredths.', ['0', 'ones'], ['.', 'point'], ['2', 'tenths'], ['3', 'hundredths']),
        note('Cut one small square into 10 crumbs. Each crumb is one thousandth, 0.001.', 'Thousandths', ['1 whole is 1000 thousandths', '1 tenth is 100 thousandths', '1 hundredth is 10 thousandths']),
        x('Here is 0.406. The zero holds the hundredths place, so the 6 can sit in the thousandths place.', ['0', 'ones'], ['.', 'point'], ['4', 'tenths'], ['0', 'hundredths'], ['6', 'thousandths'])
      ] },

    { title: '3. The place value chart',
      explain: [
        'Every digit has a job that depends on where it sits. In 3.472 the 3 is in the ones place and the 7 is in the hundredths place.',
        'The value of a digit is the digit times its place. The 7 in the hundredths place means 7 hundredths, or 0.07.',
        'A zero is a placeholder. It keeps the other digits in the right places.'
      ],
      rule: 'A digit is worth the digit times its place value.',
      mistake: 'Do not drop a zero. 0.05 is not 0.5. The zero holds the tenths place.',
      steps: [
        x('Look at 3.472. Every digit sits in a place.', ['3', 'ones'], ['.', 'point'], ['4', 'tenths'], ['7', 'hundredths'], ['2', 'thousandths']),
        x('The 4 is in the tenths place. It is worth 4 tenths, which is 0.4.', '3.', ['4', '= 0.4'], '72'),
        x('The 7 is in the hundredths place. It is worth 7 hundredths, which is 0.07.', '3.4', ['7', '= 0.07'], '2'),
        x('The 2 is in the thousandths place. It is worth 2 thousandths, which is 0.002.', '3.47', ['2', '= 0.002']),
        x('Add the values to build the number. This is called expanded form.', ['3', 'ones'], ' + ', ['0.4', 'tenths'], ' + ', ['0.07', 'hundredths'], ' + ', ['0.002', 'thousandths']),
        x('Now try 5.06. The zero is in the tenths place.', ['5', 'ones'], '.', ['0', 'tenths'], ['6', 'hundredths']),
        x('5.06 is 5 ones, 0 tenths and 6 hundredths. Without the zero, 5.6 would be a different number.', '5 + 0 + ', ['0.06', 'hundredths']),
        note('Read it out loud like this.', 'How to read decimals', ['Say the whole part first', 'Say point', 'Say each digit after the point', '3.472 is three point four seven two'])
      ] },

    { title: '4. Comparing decimals',
      explain: [
        'To compare two decimals, start at the left and go place by place. The first place where the digits are different decides which number is bigger.',
        'A longer decimal is not always bigger. 0.5 is bigger than 0.45. Half a bar is more than four strips and a little bit.',
        'You can add zeros at the end of a decimal and the value stays the same. 0.5 is the same as 0.50.'
      ],
      rule: 'Match the places with zeros. Then compare from the left.',
      mistake: 'Do not say 0.45 is bigger than 0.5 because 45 is bigger than 5. The tenths digit decides first.',
      steps: [
        x('Which is bigger, 0.5 or 0.45? Many people guess 0.45 because it is longer.', ['0.5', 'one place'], ' or ', ['0.45', 'two places']),
        grid('0.5 is 5 full columns out of 10.', 10, 10, [{ c0: 0, c1: 5, r0: 0, r1: 10, cls: sq }]),
        grid('0.45 is 4 full columns and 5 more squares. That is a bit less than 5 columns.', 10, 10, [{ c0: 0, c1: 4, r0: 0, r1: 10, cls: 'bg-emerald-500' }, { c0: 4, c1: 5, r0: 0, r1: 5, cls: 'bg-emerald-500' }]),
        x('Write a zero after 0.5 so both have two decimal places. The value does not change.', ['0.5', 'same as'], ' = ', ['0.50', 'zero added']),
        x('Compare the tenths first. 5 tenths is more than 4 tenths.', '0.', ['5', 'tenths'], '0  and  0.', ['4', 'tenths'], '5'),
        x('The tenths already decide it. So 0.5 is greater than 0.45.', ['0.5', 'greater'], ' > ', '0.45'),
        x('Try another. Compare 3.208 and 3.28. Add a zero to 3.28 to get 3.280.', '3.208  and  3.', ['280', 'zero added']),
        x('Tenths are equal at 2. Hundredths are 0 and 8. So 3.28 is greater than 3.208.', ['3.28', 'greater'], ' > ', '3.208')
      ] },

    { title: '5. Ordering decimals',
      explain: [
        'To put decimals in order, give them all the same number of decimal places by adding zeros. Then they are easy to compare.',
        'Once the places match, you can read the digits after the point like a whole number. 0.700 is 700 thousandths and 0.075 is 75 thousandths.',
        'Least means smallest. Greatest means biggest. Check your list by going from left to right.'
      ],
      rule: 'Add zeros so all numbers have the same places. Then order them like whole numbers.',
      mistake: 'Do not order by how long the number is. 0.07 is smaller than 0.7 even though it has more digits after the zero.',
      steps: [
        x('Put these in order from least to greatest.', '0.7,  0.07,  0.75,  0.705'),
        x('Make every number have three decimal places. Add zeros where needed.', ['0.700', 'zeros added'], ',  ', ['0.070', 'zeros added'], ',  ', ['0.750', 'zeros added'], ',  ', '0.705'),
        x('Now read the digits after the point as whole numbers. They are thousandths.', '700,  70,  750,  705'),
        x('The smallest is 70. That is 0.07. The next smallest is 700, which is 0.7.', ['0.07', 'least'], ',  ', ['0.7', 'next']),
        x('Then comes 705, which is 0.705. The greatest is 750, which is 0.75.', ['0.705', 'next'], ',  ', ['0.75', 'greatest']),
        x('The order from least to greatest is here.', ['0.07', '1st'], ' < ', ['0.7', '2nd'], ' < ', ['0.705', '3rd'], ' < ', ['0.75', '4th']),
        note('A quick check.', 'Check your work', ['Are all numbers in the list?', 'Does each one get bigger as you read to the right?'])
      ] },

    { title: '6. Rounding decimals',
      explain: [
        'Rounding means changing a number to a simpler one that is close. We round to a place, like the nearest tenth or the nearest whole number.',
        'Find the digit in the place you are rounding to. Look at the digit just to its right. If it is 5 or more, the digit goes up by 1. If it is 4 or less, the digit stays.',
        'Then drop all the digits after the place you rounded to.'
      ],
      rule: 'Look one place to the right. 5 or more goes up. 4 or less stays.',
      mistake: 'Only look at the very next digit. To round 3.449 to the nearest tenth, look at the 4 and not at the 9. The answer is 3.4.',
      steps: [
        x('Round 3.478 to the nearest tenth. First find the tenths digit. It is 4.', '3.', ['4', 'tenths'], '78'),
        lines('3.478 sits between two tenths. It is between 3.4 and 3.5.', ['3.4        3.45        3.5', '            3.478'], 99),
        x('Look at the digit just to the right of the 4. It is 7.', '3.', ['4', 'keep place'], ['7', 'look here'], '8'),
        x('7 is 5 or more, so the 4 goes up to 5.', ['7', '5 or more'], ' so ', ['4', 'goes up'], ' becomes ', ['5', 'new digit']),
        x('Drop the digits after the tenths place. 3.478 rounds to 3.5.', '3.478 ≈ ', ['3.5', 'answer']),
        x('Now round 12.86 to the nearest whole number. The ones digit is 2 and the digit to its right is 8.', '1', ['2', 'ones'], '.', ['8', 'look here'], '6'),
        x('8 is 5 or more, so the 2 goes up to 3. The answer is 13.', '12.86 ≈ ', ['13', 'answer'])
      ] },

    { title: '7. Adding decimals',
      explain: [
        'Adding decimals is just like adding whole numbers, with one big rule. Line up the decimal points so tenths sit over tenths and hundredths over hundredths.',
        'If one number has fewer decimal places, fill the empty places with zeros. This does not change its value.',
        'Add from the right, one column at a time. Carry when a column makes 10 or more. Bring the decimal point straight down.'
      ],
      rule: 'Line up the decimal points. Add from the right. Bring the point down.',
      mistake: 'Do not line up the last digits. 3.4 and 2.75 must be lined up by the point, so 3.4 becomes 3.40.',
      steps: [x('Add 3.4 + 2.75. Do not line up the last digits. Line up the decimal points.', ['3.4', 'one place'], ' + ', ['2.75', 'two places'])]
        .concat(E.verticalAdd('3.4', '2.75'))
        .concat([
          x('Check with a quick estimate. 3 plus 3 is about 6. Our answer 6.15 is close, so it makes sense.', '3.4 + 2.75 = ', ['6.15', 'answer']),
          finalAdd('12.5', '6.85', 'Try 12.5 + 6.85. Write 12.5 as 12.50 and add to get 19.35.')
        ]) },

    { title: '8. Subtracting decimals',
      explain: [
        'Subtracting decimals uses the same idea. Line up the decimal points and fill gaps with zeros.',
        'Start at the right. If the top digit is too small, borrow 1 from the place on its left. That 1 is worth 10 in the place you borrowed for.',
        'Take away column by column. Bring the decimal point straight down.'
      ],
      rule: 'Line up the points. Borrow when the top digit is too small.',
      mistake: 'Do not take the smaller digit from the bigger one in each column. If the top digit is too small, you must borrow.',
      steps: [x('Work out 8.4 − 2.75. Write 8.4 as 8.40 so both numbers have two decimal places.', ['8.4', 'top'], ' − ', ['2.75', 'bottom'])]
        .concat(subSteps(840, 275, 2))
        .concat([x('Check by adding back. 5.65 + 2.75 = 8.40. It works.', '5.65 + 2.75 = ', ['8.40', 'check'])]) },

    { title: '9. Times and divide by 10, 100 and 1000',
      explain: [
        'When you multiply by 10, every digit moves one place to the left. It becomes 10 times bigger. When you divide by 10, every digit moves one place to the right.',
        'For 100 the digits move 2 places. For 1000 they move 3 places. Count the zeros in 10, 100 or 1000 to know how far to move.',
        'Some places will be empty after the move. Fill them with zeros.'
      ],
      rule: 'Times makes bigger, so digits move left. Divide makes smaller, so digits move right. Move one place for each zero.',
      mistake: 'Do not just add zeros at the end of a decimal. 3.4 × 100 is 340, not 3.400.',
      steps: [
        lines('Here is 3.4 on a place value chart.', ['Tens  Ones . Tenths', '        3   .   4'], 99),
        lines('Times 10. Each digit moves 1 place to the left. So 3.4 × 10 = 34.', ['Tens  Ones . Tenths', '  3     4   .   0'], 1),
        x('Times 100 moves the digits 2 places to the left. There is an empty place, so we fill it with a zero.', '3.4 × 100 = ', ['340', 'moved 2 places']),
        x('Now divide. Take 45.6 ÷ 10. The digits move 1 place to the right.', '45.6 ÷ 10 = ', ['4.56', 'moved 1 place']),
        x('Divide by 1000 moves the digits 3 places to the right. We fill the empty places with zeros.', '45.6 ÷ 1000 = ', ['0.0456', 'moved 3 places']),
        note('Use these to help you.', 'Count the zeros', ['10 has one zero, move 1 place', '100 has two zeros, move 2 places', '1000 has three zeros, move 3 places', 'Times moves left, divide moves right'])
      ] },

    { title: '10. Decimals and fractions',
      explain: [
        'Tenths, hundredths and thousandths are fractions. 0.7 is 7/10. 0.07 is 7/100. 0.007 is 7/1000.',
        'The number of digits after the point tells you how many zeros are in the bottom number. One digit means 10. Two digits means 100.',
        'To write a fraction as a decimal, first make the bottom number 10, 100 or 1000. Then read it as tenths, hundredths or thousandths.'
      ],
      rule: 'One digit after the point is over 10. Two digits is over 100. Three digits is over 1000.',
      mistake: 'Do not write 3/4 as 3.4. The bottom number is not the digit after the point.',
      steps: [
        bars('0.7 is 7 tenths. Seven strips out of ten.', [fb('7 tenths', 10, 7, 'bg-amber-400', '', '7/10')]),
        x('One digit after the point means the bottom number is 10. So 0.7 = 7/10.', ['0.7', 'decimal'], ' = ', ['7/10', 'fraction']),
        x('Two digits after the point means the bottom is 100. 0.35 is 35 hundredths.', ['0.35', 'decimal'], ' = ', ['35/100', 'fraction']),
        x('Simplify. 5 goes into 35 and 100. 35 ÷ 5 = 7 and 100 ÷ 5 = 20.', '35/100 = ', ['7/20', 'simplest']),
        x('Now write 3/4 as a decimal. We want a bottom of 100, and 4 × 25 = 100.', '3/4 = ', ['?', 'need /100']),
        x('Multiply the top by 25 too. 3 × 25 = 75. So 3/4 is 75/100.', '3/4 = ', ['75/100', '× 25 on both']),
        x('75 hundredths is written 0.75. So 3/4 = 0.75.', '3/4 = ', ['0.75', 'answer'])
      ] },

    { title: '11. Money problems and estimating',
      explain: [
        'Money is a decimal story. $3.45 means 3 dollars and 45 hundredths of a dollar, which is 45 cents. Money always has two decimal places.',
        'Add and subtract money the same way as other decimals. Line up the points.',
        'Before you work it out, estimate. Round each amount to the nearest dollar. If your exact answer is close to the estimate, it makes sense.'
      ],
      rule: 'Estimate first. Line up the points. Check that the answer is close to the estimate.',
      mistake: 'Change is what is left after paying. Do not stop at the total cost.',
      steps: [
        note('Rinka buys a notebook for $3.45 and a pen for $1.29. She pays with $10.00. How much change?', 'The plan', ['Estimate: 3 + 1 = 4', 'Add the two prices', 'Take the total away from $10.00']),
        finalAdd('3.45', '1.29', 'First add the prices. $3.45 + $1.29 = $4.74.'),
        x('The total cost is $4.74. This is close to our estimate of $4.', ['$4.74', 'total cost']),
        finalSub(1000, 474, 2, 'Now take the total from $10.00. $10.00 − $4.74 = $5.26.'),
        x('Estimate check. 10 − 4 is 6. Our answer $5.26 is close, so it makes sense.', ['$5.26', 'change']),
        x('Now 4 pens at $2.35 each. Think in cents, where $2.35 is 235 cents.', '4 × ', ['235 cents', 'one pen']),
        x('235 × 4 = 940 cents. 100 cents make a dollar, so 940 cents is $9.40.', '235 × 4 = 940  so  ', ['$9.40', 'total'])
      ] }
  ];

  /* ---------- Question skills ---------- */
  B.register(4, [

    { id: 'place', level: 1, name: 'Digit in a place', make: function () {
      var d = R.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
      var s = d[0] + '.' + d[1] + d[2] + d[3];
      var p = R.int(1, 3), ans = d[p], traps = [];
      for (var i = 1; i <= 3; i++) if (i !== p) traps.push(T(String(d[i]), 'That digit is in the ' + PLACE[i] + ' place. The ' + PLACE[p] + ' place is the ' + ORD[p] + ' digit after the point.'));
      traps.push(T(String(d[0]), 'That is the digit in the ones place. Look to the right of the decimal point.'));
      traps = traps.slice(0, 3);
      var all = { 0: 'ones', 2: 'tenths', 3: 'hundredths', 4: 'thousandths' }, one = {}; one[1 + p] = PLACE[p];
      return num({
        skill: 'Place value of decimals', prompt: 'In the number ' + s + ', which digit is in the ' + PLACE[p] + ' place?',
        answer: ans, keyboard: 'numeric', placeholder: 'Type one digit', traps: traps,
        work: 'After the point the places are tenths, hundredths and thousandths. The ' + PLACE[p] + ' place is the ' + ORD[p] + ' digit, which is ' + ans + '.',
        plain: 'Count the digits after the point. First is tenths, second is hundredths, third is thousandths.',
        teach: [
          xt('Look at ' + s + '. After the point the places go tenths, hundredths, then thousandths.', toks(s, all)),
          xt('We need the ' + PLACE[p] + ' place. It is the ' + ORD[p] + ' digit after the point.', toks(s, one)),
          note('Count along the digits after the point.', 'Counting places', ['1st digit: tenths', '2nd digit: hundredths', '3rd digit: thousandths']),
          x('The digit in the ' + PLACE[p] + ' place is ' + ans + '.', [String(ans), 'answer'])
        ]
      });
    } },

    { id: 'write', level: 1, name: 'Write a decimal from its places', make: function () {
      var w = R.int(1, 9), t = R.int(1, 9), h = R.int(1, 9), k = R.int(1, 9), z = R.int(0, 2);
      if (z === 1) t = 0; else if (z === 2) h = 0;
      var s = w + '.' + t + h + k;
      var traps = [];
      if (t === 0) traps.push(T(w + '.' + h + k, 'You left out the zero. The 0 holds the tenths place, so the other digits must stay in their own places.'));
      if (h === 0) traps.push(T(w + '.' + t + k, 'You left out the zero. The 0 holds the hundredths place, so the ' + k + ' belongs in the thousandths place.'));
      var rev = w + '.' + k + h + t;
      if (rev !== s) traps.push(T(rev, 'The digits are in the wrong order. Tenths come first after the point, then hundredths, then thousandths.'));
      traps.push(T(String(w) + t + h + k, 'The decimal point is missing. It goes right after the ones digit.'));
      return num({
        skill: 'Write decimals', prompt: 'Write this as a decimal: ' + pl(w, 'one') + ', ' + pl(t, 'tenth') + ', ' + pl(h, 'hundredth') + ' and ' + pl(k, 'thousandth') + '.',
        answer: s, keyboard: 'decimal', placeholder: 'Like 4.305', traps: traps,
        work: 'Ones ' + w + ', point, tenths ' + t + ', hundredths ' + h + ', thousandths ' + k + '. That gives ' + s + '.',
        plain: 'Write each digit in its own place. If a place is empty, write 0 there.',
        teach: [
          note('Make a small chart in your head and fill each place.', 'Place value boxes', ['Ones: ' + w, 'Tenths: ' + t, 'Hundredths: ' + h, 'Thousandths: ' + k]),
          x('Start with the ones digit, then the decimal point.', [String(w), 'ones'], ['.', 'point']),
          xt('Now add the digits in order.' + ((t === 0 || h === 0) ? ' The zero must be written.' : ''), toks(s, (function () { var m = { 0: 'ones', 2: 'tenths', 3: 'hundredths', 4: 'thousandths' }; if (t === 0) m[2] = 'zero holds place'; if (h === 0) m[3] = 'zero holds place'; return m; })())),
          x('The number is ' + s + '.', [s, 'answer'])
        ]
      });
    } },

    { id: 'units', level: 2, name: 'How many tenths, hundredths or thousandths', make: function () {
      var p = R.int(1, 2), N;
      do { N = R.int(1, p === 1 ? 99 : 399); } while (N % 10 === 0);
      var u = R.int(p, 3), f = pw(u - p), A = N * f, v = dec(N, p);
      var traps = [];
      if (u > p) traps.push(T(String(N), 'You counted ' + PLACE[p] + '. The question asks for ' + PLACE[u] + '. Each one of the ' + PLACE[p] + ' holds ' + f + ' of the ' + PLACE[u] + '.'));
      else traps.push(T(v, 'That is the number itself. Count how many ' + PLACE[u] + ' it holds.'));
      traps.push(T(String(A * 10), 'That has one zero too many. Each step to a smaller place multiplies by 10 only once.'));
      var mid = [
        note('Each place is 10 times smaller than the one before it.', 'Ten times rule', ['1 whole is 10 tenths', '1 tenth is 10 hundredths', '1 hundredth is 10 thousandths']),
        x(v + ' is ' + N + ' ' + PLACE[p] + '. We read the digits as a whole number of ' + PLACE[p] + '.', v, ' = ', [N + ' ' + PLACE[p], 'own unit'])
      ];
      if (u > p) {
        mid.push(x('We need ' + PLACE[u] + '. Each ' + PLACE[p].replace(/s$/, '') + ' holds ' + f + ' ' + PLACE[u] + '. So multiply by ' + f + '.', N + ' × ' + f + ' = ', [String(A), PLACE[u]]));
      } else {
        mid.push(x('That is already the unit we want. No changing is needed.', [String(N), PLACE[u]]));
      }
      mid.push(x('So ' + v + ' holds ' + A + ' ' + PLACE[u] + '.', v + ' = ', [A + ' ' + PLACE[u], 'answer']));
      return num({
        skill: 'Decimals as counts of tenths, hundredths, thousandths', prompt: 'How many ' + PLACE[u] + ' are in ' + v + '?',
        answer: A, keyboard: 'numeric', placeholder: 'Type a whole number', traps: traps,
        work: v + ' is ' + N + ' ' + PLACE[p] + (u > p ? ', and ' + N + ' × ' + f + ' = ' + A + ' ' + PLACE[u] : '') + '.',
        plain: 'Think of tiny pieces. Each bigger piece breaks into 10 smaller ones, so you multiply by 10 for each step down.',
        teach: mid
      });
    } },

    { id: 'compare', level: 2, name: 'Which decimal is greater', make: function () {
      var w = R.int(0, 6), t1 = R.int(1, 9), same = R.int(0, 1), t2 = same ? t1 : t1 - 1, h = R.int(1, 9);
      var A = w + '.' + t1, A2 = w + '.' + t1 + '0', Bt = w + '.' + t2 + h;
      var aInt = w * 100 + t1 * 10, bInt = w * 100 + t2 * 10 + h;
      var bigger = aInt > bInt ? A : Bt, smaller = aInt > bInt ? Bt : A;
      var flip = R.int(0, 1), first = flip ? Bt : A, second = flip ? A : Bt;
      var why = same
        ? 'The tenths are the same, ' + t1 + ' and ' + t1 + '. Look at hundredths. 0 is less than ' + h + '.'
        : 'Compare the tenths. ' + t1 + ' tenths is more than ' + t2 + ' tenths.';
      return Q.choice({
        skill: 'Compare decimals', prompt: 'Which decimal is greater, ' + first + ' or ' + second + '?',
        options: [
          { text: bigger, ok: true },
          { text: smaller, ok: false, trap: 'A longer decimal is not always bigger. Write ' + A + ' as ' + A2 + '. Then compare the tenths, and then the hundredths.' },
          { text: 'They are equal', ok: false, trap: 'They are not equal. Write ' + A + ' as ' + A2 + ' and compare place by place.' }
        ],
        work: A2 + ' and ' + Bt + '. ' + why + ' So ' + bigger + ' is greater.',
        plain: 'Add a zero so both have the same places. Then compare from the left. The first different digit decides.',
        teach: [
          x('We compare ' + first + ' and ' + second + '. The lengths are different, so we match them.', [first, '?'], ' or ', [second, '?']),
          x('Write a zero after ' + A + ' so both have two decimal places. The value stays the same.', [A, 'same as'], ' = ', [A2, 'zero added']),
          x('Compare the ones. Both are ' + w + ', so they are equal. Move right to the tenths.', String(w), ' and ', String(w)),
          x(why, [t1 + ' or ' + t2, 'tenths']),
          x('So ' + bigger + ' is the greater decimal.', [bigger, 'greater'])
        ]
      });
    } },

    { id: 'order', level: 3, name: 'Order three decimals', make: function () {
      var v1, v2, v3, t;
      for (t = 0; t < 40; t++) {
        v1 = R.int(1, 9) * 100;
        v2 = R.int(1, 9) * 10 + R.int(1, 9); v2 *= 10;
        v3 = R.int(1, 9) * 100 + R.int(0, 9) * 10 + R.int(1, 9);
        if (v1 !== v2 && v2 !== v3 && v1 !== v3 && Math.abs(Math.floor(v1 / 100) - Math.floor(v3 / 100)) <= 3) break;
      }
      var w = R.int(1, 9);
      var vals = [v1, v2, v3], strs = vals.map(function (v) { return w + '.' + strip(dec(v, 3)).split('.')[1]; });
      var padded = vals.map(function (v) { return w + '.' + dec(v, 3).split('.')[1]; });
      var order = R.shuffle([0, 1, 2]);
      var sorted = vals.slice().sort(function (a, b) { return a - b; });
      var midV = sorted[1], midIdx = vals.indexOf(midV);
      var traps = [];
      if (midIdx !== 2) traps.push(T(strs[2], 'The longest number is not always the middle one. Add zeros to match the places and compare.'));
      var lo = sortedIdxOf(vals, 0), hi = sortedIdxOf(vals, 2);
      traps.push(T(strs[lo], 'That is the least number. The question asks for the one in the middle.'));
      traps.push(T(strs[hi], 'That is the greatest number. The question asks for the one in the middle.'));
      var listMid = order[1];
      if (listMid !== midIdx && listMid !== 2) traps.push(T(strs[listMid], 'That one is just in the middle of the list as it was written. Put the numbers in order first.'));
      var sortedIdx = [0, 1, 2].sort(function (a, b) { return vals[a] - vals[b]; });
      return num({
        skill: 'Order decimals', prompt: 'Put these in order from least to greatest: ' + order.map(function (i) { return strs[i]; }).join(', ') + '. Which number is in the middle?',
        answer: strs[midIdx], keyboard: 'decimal', placeholder: 'Type the middle number', traps: traps,
        work: 'With zeros added: ' + sortedIdx.map(function (i) { return padded[i]; }).join(' < ') + '. The middle one is ' + strs[midIdx] + '.',
        plain: 'Give every number three decimal places. Then the one with the smallest digits after the point is least.',
        teach: [
          x('We need to order ' + order.map(function (i) { return strs[i]; }).join(', ') + '.', order.map(function (i) { return strs[i]; }).join(',  ')),
          x('Add zeros so each number has three decimal places.', padded[order[0]], ',  ', padded[order[1]], ',  ', padded[order[2]]),
          x('The parts after the point are now thousandths. Compare them like whole numbers.', vals[order[0]] + ',  ' + vals[order[1]] + ',  ' + vals[order[2]]),
          x('From least to greatest the order is ' + sortedIdx.map(function (i) { return strs[i]; }).join(', ') + '.', [strs[sortedIdx[0]], 'least'], ',  ', [strs[sortedIdx[1]], 'middle'], ',  ', [strs[sortedIdx[2]], 'greatest']),
          x('The number in the middle is ' + strs[midIdx] + '.', [strs[midIdx], 'answer'])
        ]
      });
    } },

    { id: 'round', level: 3, name: 'Round a decimal', make: function () {
      var p = R.int(0, 2), W, f1, f2, f3, t;
      do { W = String(R.int(1, 99)); } while (p === 0 && W.slice(-1) === '9');
      do { f1 = R.int(0, 9); } while (p === 1 && f1 === 9);
      do { f2 = R.int(0, 9); } while (p === 2 && f2 === 9);
      f3 = R.int(0, 9);
      var s = W + '.' + f1 + f2 + f3;
      var N = parseInt(W + f1 + f2 + f3, 10);
      var r = roundThou(N, p), ans = dec(r, p);
      var name = ['whole number', 'tenth', 'hundredth'][p];
      var ti = p === 0 ? W.length - 1 : W.length + p;
      var ni = p === 0 ? W.length + 1 : W.length + p + 1;
      var nd = parseInt(s.charAt(ni), 10), up = nd >= 5;
      var traps = [];
      var alt = up ? Math.floor(N / pw(3 - p)) : Math.floor(N / pw(3 - p)) + 1;
      traps.push(T(dec(alt, p), 'Look at the digit just to the right of the ' + (p === 0 ? 'ones' : PLACE[p]) + ' place. It is ' + nd + ', which is ' + (up ? '5 or more, so the digit goes up.' : '4 or less, so the digit stays the same.')));
      for (var q = 0; q <= 2; q++) if (q !== p) {
        var v = dec(roundThou(N, q), q);
        if (v !== ans && parseFloat(v) !== parseFloat(ans)) traps.push(T(v, 'That rounds to the nearest ' + ['whole number', 'tenth', 'hundredth'][q] + '. The question asks for the nearest ' + name + '.'));
      }
      traps = traps.slice(0, 3);
      var mk = {}; mk[ti] = 'round this place';
      var mk2 = {}; mk2[ti] = 'keep place'; mk2[ni] = 'look here';
      var mk3 = {}; mk3[ti] = 'new digit';
      var kept = s.slice(0, ti + 1);
      var newTop = String(parseInt(s.charAt(ti), 10) + (up ? 1 : 0));
      var showNew = s.slice(0, ti) + newTop;
      return num({
        skill: 'Round decimals', prompt: 'Round ' + s + ' to the nearest ' + name + '.',
        answer: ans, keyboard: 'decimal', placeholder: 'Type your answer', traps: traps,
        work: 'The digit to the right is ' + nd + '. ' + (up ? 'It is 5 or more, so we round up' : 'It is less than 5, so the digit stays') + '. The answer is ' + ans + '.',
        plain: 'Find the place you are rounding to. Peek at the next digit to the right. Five or more goes up. Then drop the rest.',
        teach: [
          xt('We round ' + s + ' to the nearest ' + name + '. First find that place.', toks(s, mk)),
          xt('Look at the digit just to the right. It is ' + nd + '.', toks(s, mk2)),
          x(nd + ' is ' + (up ? '5 or more, so the ' + s.charAt(ti) + ' goes up by 1.' : 'less than 5, so the ' + s.charAt(ti) + ' stays the same.'), [String(nd), up ? '5 or more' : '4 or less'], ' so ', [s.charAt(ti), up ? 'goes up' : 'stays'], ' becomes ', [newTop.slice(-1), 'new digit']),
          x('Drop every digit after that place. Keep ' + ans + '.', s + ' ≈ ', [ans, 'answer'])
        ]
      });
    } },

    { id: 'add', level: 3, name: 'Add decimals in columns', make: function () {
      var a, b, pa, pb, t;
      for (t = 0; t < 60; t++) {
        pa = R.pick([1, 2, 2, 3]); pb = R.pick([1, 2, 2, 3]);
        var pm = Math.max(pa, pb);
        var top = pm === 3 ? 9 : 40;
        a = R.int(1, top * pw(pa)); b = R.int(1, top * pw(pb));
        if (pa === 0) continue;
        if (a % 10 === 0 || b % 10 === 0) continue;
        var il = Math.max(String(Math.floor(a / pw(pa))).length, String(Math.floor(b / pw(pb))).length);
        if (il + pm <= 4 && (pa !== pb || R.int(0, 3) === 0)) break;
      }
      var p = Math.max(pa, pb);
      var aS = dec(a, pa), bS = dec(b, pb);
      var sum = a * pw(p - pa) + b * pw(p - pb), ans = dec(sum, p);
      var traps = [];
      var wrong = dec(a + b, p);
      if (pa !== pb && wrong !== ans) traps.push(T(wrong, 'You lined up the last digits instead of the decimal points. Line up the points, and fill empty places with zeros.'));
      var A1 = String(a * pw(p - pa)), B1 = String(b * pw(p - pb)), nc = '';
      while (A1.length < B1.length) A1 = '0' + A1;
      while (B1.length < A1.length) B1 = '0' + B1;
      for (var ci = 0; ci < A1.length; ci++) nc += (parseInt(A1.charAt(ci), 10) + parseInt(B1.charAt(ci), 10)) % 10;
      if (parseInt(nc, 10) !== sum) traps.push(T(dec(parseInt(nc, 10), p), 'You forgot to carry. When a column adds to 10 or more, write the ones digit and carry 1 to the next column.'));
      return num({
        skill: 'Add decimals', prompt: 'What is ' + aS + ' + ' + bS + '?',
        answer: ans, keyboard: 'decimal', placeholder: 'Type your answer', traps: traps,
        work: 'Line up the points: ' + dec(a * pw(p - pa), p) + ' + ' + dec(b * pw(p - pb), p) + ' = ' + ans + '.',
        plain: 'Stack the numbers with the decimal points in a straight line. Add each column from the right.',
        teach: [x('Add ' + aS + ' + ' + bS + '. Line up the decimal points, not the last digits.', [aS, 'first'], ' + ', [bS, 'second'])].concat(E.verticalAdd(aS, bS))
      });
    } },

    { id: 'sub', level: 4, name: 'Subtract decimals in columns', make: function () {
      var a, b, st, t;
      for (t = 0; t < 80; t++) {
        a = R.int(150, 1500); b = R.int(30, a - 20);
        if (R.int(0, 2) === 0) a = Math.floor(a / 10) * 10;
        if (a % 10 !== 0 && b % 10 === 0) continue;
        if (a <= b) continue;
        st = subSteps(a, b, 2);
        if (st.length <= 7) break;
      }
      var aS = ds(a, 2), bS = ds(b, 2), ans = dec(a - b, 2);
      var ad = dec(a, 2).replace('.', ''), bd = dec(b, 2).replace('.', '');
      var n = Math.max(ad.length, bd.length);
      while (ad.length < n) ad = '0' + ad;
      while (bd.length < n) bd = '0' + bd;
      var nb = '';
      for (var i = 0; i < n; i++) nb += Math.abs(parseInt(ad.charAt(i), 10) - parseInt(bd.charAt(i), 10));
      var trapV = dec(parseInt(nb, 10), 2);
      var traps = [];
      var rawA = parseInt(aS.replace('.', ''), 10), rawB = parseInt(bS.replace('.', ''), 10), plA = (aS.split('.')[1] || '').length, plB = (bS.split('.')[1] || '').length;
      if (plA !== plB && rawA > rawB) traps.push(T(dec(rawA - rawB, Math.max(plA, plB)), 'You lined up the last digits instead of the decimal points. Line up the points and fill gaps with zeros first.'));
      if (parseFloat(trapV) !== parseFloat(ans)) traps.push(T(trapV, 'You took the smaller digit from the bigger digit in each column. When the top digit is too small you must borrow from the next place.'));
      return num({
        skill: 'Subtract decimals', prompt: 'What is ' + aS + ' − ' + bS + '?',
        answer: ans, keyboard: 'decimal', placeholder: 'Type your answer', traps: traps,
        work: dec(a, 2) + ' − ' + dec(b, 2) + ' = ' + ans + '.',
        plain: 'Line up the points and fill gaps with zeros. Start at the right and borrow when the top digit is too small.',
        teach: [x('Work out ' + aS + ' − ' + bS + '. We will write both with two decimal places.', [dec(a, 2), 'top'], ' − ', [dec(b, 2), 'bottom'])].concat(st)
      });
    } },

    { id: 'shift', level: 4, name: 'Times or divide by 10, 100, 1000', make: function () {
      var W = R.int(0, 60), fl = R.int(1, 3), fr = '';
      for (var i = 0; i < fl; i++) fr += (i === fl - 1 ? R.int(1, 9) : R.int(0, 9));
      var s = W + '.' + fr;
      if (W === 0 && R.int(0, 1)) s = String(R.int(1, 99)) + '.' + fr;
      var mul = R.int(0, 1) === 1, k = R.int(1, 3), K = pw(k);
      var ans = shift(s, mul ? k : -k);
      var op = mul ? '×' : '÷';
      var traps = [];
      var opp = shift(s, mul ? -k : k);
      traps.push(T(opp, 'The digits moved the wrong way. ' + (mul ? 'Multiplying makes a number bigger, so the digits move left.' : 'Dividing makes a number smaller, so the digits move right.')));
      var shortK = shift(s, (mul ? 1 : -1) * (k - 1)), longK = shift(s, (mul ? 1 : -1) * (k + 1));
      if (k > 1) traps.push(T(shortK, 'The digits moved ' + (k - 1) + ' place' + (k - 1 === 1 ? '' : 's') + '. ' + K + ' has ' + k + ' zeros, so they move ' + k + ' places.'));
      else traps.push(T(longK, 'The digits moved too far. 10 has one zero, so they move only 1 place.'));
      traps = traps.filter(function (tr) { return parseFloat(tr.value) !== parseFloat(ans); });
      var dir = mul ? 'left' : 'right';
      return num({
        skill: 'Multiply and divide decimals by 10, 100, 1000', prompt: 'What is ' + s + ' ' + op + ' ' + K + '?',
        answer: ans, keyboard: 'decimal', placeholder: 'Type your answer', traps: traps,
        work: K + ' has ' + k + ' zero' + (k === 1 ? '' : 's') + ', so the digits move ' + k + ' place' + (k === 1 ? '' : 's') + ' to the ' + dir + '. ' + s + ' ' + op + ' ' + K + ' = ' + ans + '.',
        plain: (mul ? 'Times 10, 100 or 1000 makes the number bigger.' : 'Dividing by 10, 100 or 1000 makes the number smaller.') + ' Count the zeros to know how many places to move.',
        teach: [
          x(K + ' has ' + k + ' zero' + (k === 1 ? '' : 's') + '. So every digit moves ' + k + ' place' + (k === 1 ? '' : 's') + '.', [s + ' ' + op + ' ' + K, k + ' zero' + (k === 1 ? '' : 's')]),
          note(mul ? 'Times makes the number bigger. So the digits move to the left.' : 'Divide makes the number smaller. So the digits move to the right.', 'Which way?', [mul ? 'Times: move left' : 'Divide: move right', 'One place for each zero']),
          x('Move the digits of ' + s + ' ' + k + ' place' + (k === 1 ? '' : 's') + ' to the ' + dir + '.', [s, 'start'], ' → ', [ans, 'moved ' + k + ' to the ' + dir]),
          x('Fill any empty place with a zero, and tidy the ends. Zeros at the end of a decimal can go.', [ans, 'tidied']),
          x(s + ' ' + op + ' ' + K + ' = ' + ans + '.', [ans, 'answer'])
        ]
      });
    } },

    { id: 'frac', level: 4, name: 'Decimals and fractions', make: function () {
      if (R.int(0, 1)) {
        /* decimal to fraction */
        var p = R.int(1, 3), N;
        do { N = R.int(1, pw(p) - 1); } while (p > 1 && N % 10 === 0);
        var den = pw(p), g = R.gcd(N, den), sn = N / g, sd = den / g, v = dec(N, p);
        var raw = N + '/' + den, ans = R.fr(N, den);
        var traps = [];
        var wrongDen = p === 1 ? 100 : 10;
        traps.push(T(N + '/' + wrongDen, 'The bottom number must match the last place. ' + p + ' digit' + (p === 1 ? '' : 's') + ' after the point means the bottom is ' + den + '.'));
        var steps = [
          x(v + ' has ' + p + ' digit' + (p === 1 ? '' : 's') + ' after the point. That means ' + PLACE[p] + '.', v, ' = ', [N + ' ' + PLACE[p], PLACE[p]]),
          x('Write it as a fraction. The bottom number is ' + den + '.', v, ' = ', [raw, 'over ' + den])
        ];
        if (g > 1) {
          steps.push(x('Simplify. ' + g + ' goes into ' + N + ' and ' + den + '. Divide both by ' + g + '.', raw, ' = ', [sn + '/' + sd, '÷ ' + g + ' on both']));
          steps.push(x('Nothing but 1 goes into both ' + sn + ' and ' + sd + '. This is simplest form.', v + ' = ', [ans, 'simplest']));
        } else {
          steps.push(x('Check if it can be simplified. Nothing but 1 goes into both ' + N + ' and ' + den + '.', [raw, 'checked']));
          steps.push(x('It is already in simplest form.', v + ' = ', [ans, 'simplest']));
        }
        return num({
          skill: 'Write a decimal as a fraction', prompt: 'Write ' + v + ' as a fraction in simplest form.',
          answer: ans, simplest: true, placeholder: 'Like 7/20', traps: traps,
          work: v + ' = ' + raw + (g > 1 ? ' = ' + ans : '') + '.',
          plain: 'Read the decimal as tenths, hundredths or thousandths. That gives the bottom number. Then simplify.',
          teach: steps
        });
      }
      /* fraction to decimal */
      var d = R.pick([2, 4, 5, 8, 10, 20, 25, 50, 100]), n = R.int(1, d - 1);
      var pp = 1; while (pw(pp) % d !== 0) pp++;
      var f = pw(pp) / d, top = n * f, ans2 = strip(dec(top, pp));
      var traps2 = [];
      var lo = strip(dec(top, pp + 1)), hi = pp > 1 ? strip(dec(top, pp - 1)) : String(top);
      traps2.push(T(lo, 'Check the place value. That answer is ten times too small.'));
      if (hi !== ans2) traps2.push(T(hi, 'Check the place value. That answer is ten times too big.'));
      var st2 = [
        x('We want ' + n + '/' + d + ' as a decimal. A decimal needs a bottom number of ' + pw(pp) + '.', n + '/' + d + ' = ', ['?', 'decimal']),
        x(d + ' × ' + f + ' = ' + pw(pp) + '. So we multiply top and bottom by ' + f + '.', d + ' × ', [String(f), 'multiplier'], ' = ' + pw(pp)),
        x('Do the same on top. ' + n + ' × ' + f + ' = ' + top + '.', n + '/' + d + ' = ', [top + '/' + pw(pp), '× ' + f + ' on both']),
        x(top + ' ' + PLACE[pp] + ' is written with ' + pp + ' digit' + (pp === 1 ? '' : 's') + ' after the point.', top + '/' + pw(pp) + ' = ', [dec(top, pp), PLACE[pp]]),
        x('Tidy up. Zeros at the end can go. So ' + n + '/' + d + ' = ' + ans2 + '.', n + '/' + d + ' = ', [ans2, 'answer'])
      ];
      return num({
        skill: 'Write a fraction as a decimal', prompt: 'Write ' + n + '/' + d + ' as a decimal.',
        answer: ans2, keyboard: 'decimal', placeholder: 'Like 0.75', traps: traps2,
        work: n + '/' + d + ' = ' + top + '/' + pw(pp) + ' = ' + ans2 + '.',
        plain: 'Make the bottom number 10, 100 or 1000 by multiplying top and bottom by the same number. Then read it as a decimal.',
        teach: st2
      });
    } },

    { id: 'money', level: 5, name: 'Money problems', make: function () {
      if (R.int(0, 1)) {
        var a, b, P, tot;
        do { a = R.int(120, 890); b = R.int(120, 890); tot = a + b; P = R.pick([1000, 1500, 2000]); } while (tot >= P - 100);
        var item = R.pick([['a notebook', 'a pen'], ['a juice', 'a muffin'], ['a ruler', 'an eraser'], ['a comic', 'a bookmark']]);
        var ch = P - tot;
        var stp = [
          note('We need the total cost first. Then we take it from what Rinka paid.', 'The plan', ['Add the two prices', 'Take the total from ' + money(P)]),
          finalAdd(dec(a, 2), dec(b, 2), 'Add the prices. ' + money(a) + ' + ' + money(b) + ' = ' + money(tot) + '.'),
          x('The total cost is ' + money(tot) + '. But that is not the change.', [money(tot), 'total cost']),
          finalSub(P, tot, 2, 'Take the total from what she paid. ' + money(P) + ' − ' + money(tot) + ' = ' + money(ch) + '.'),
          x('Rinka gets ' + money(ch) + ' in change.', [money(ch), 'change'])
        ];
        return num({
          skill: 'Money change', prompt: 'Rinka buys ' + item[0] + ' for ' + money(a) + ' and ' + item[1] + ' for ' + money(b) + '. She pays with ' + money(P) + '. How many dollars does she get back in change?',
          answer: dec(ch, 2), answerText: money(ch), keyboard: 'decimal', placeholder: 'Like 5.26',
          traps: [T(dec(tot, 2), 'That is the total cost. Change is what is left after she pays, so take the total away from ' + money(P) + '.'),
                  T(dec(P - a, 2), 'You only took away the first price. She bought two things, so take away both prices.')],
          work: money(a) + ' + ' + money(b) + ' = ' + money(tot) + '. Then ' + money(P) + ' − ' + money(tot) + ' = ' + money(ch) + '.',
          plain: 'Add what she spent. Then take that from what she paid. What is left is her change.',
          teach: stp
        });
      }
      var n = R.int(3, 8), u = R.int(125, 495);
      while (u % 5 !== 0 || u % 100 === 0) u++;
      var tc = n * u;
      var thing = R.pick(['pencils', 'stickers', 'apples', 'hockey cards']);
      var part1 = Math.floor(u / 100) * 100, part2 = u - part1;
      return num({
        skill: 'Money times a whole number', prompt: 'One pack of ' + thing + ' costs ' + money(u) + '. How many dollars do ' + n + ' packs cost?',
        answer: dec(tc, 2), answerText: money(tc), keyboard: 'decimal', placeholder: 'Like 9.40',
        traps: [T(dec(tc, 1), 'The decimal point is in the wrong place. Money has two places after the point, for cents.'),
                T(dec(u + n * 100, 2), 'You added. The packs are equal groups, so multiply the price by ' + n + '.')],
        work: money(u) + ' is ' + u + ' cents. ' + u + ' × ' + n + ' = ' + tc + ' cents, which is ' + money(tc) + '.',
        plain: 'Change dollars into cents so it is a whole number. Multiply. Then change back to dollars.',
        teach: [
          x('Think in cents. ' + money(u) + ' is ' + u + ' cents.', money(u) + ' = ', [u + ' cents', 'whole number']),
          x('We need ' + n + ' packs, so multiply. ' + part1 + ' × ' + n + ' = ' + (part1 * n) + '.', part1 + ' × ' + n + ' = ', [String(part1 * n), 'first part']),
          x('Then ' + part2 + ' × ' + n + ' = ' + (part2 * n) + '.', part2 + ' × ' + n + ' = ', [String(part2 * n), 'second part']),
          x('Add the parts. ' + (part1 * n) + ' + ' + (part2 * n) + ' = ' + tc + ' cents.', (part1 * n) + ' + ' + (part2 * n) + ' = ', [tc + ' cents', 'total']),
          x('100 cents make one dollar. ' + tc + ' cents is ' + money(tc) + '.', tc + ' cents = ', [money(tc), 'answer'])
        ]
      });
    } },

    { id: 'estimate', level: 5, name: 'Estimate and check', make: function () {
      var a, b, ra, rb, t, plus = R.int(0, 1) === 1;
      for (t = 0; t < 200; t++) {
        a = R.int(120, 990); b = R.int(120, 990);
        if (!plus && a < b) { var z = a; a = b; b = z; }
        ra = roundThou(a * 10, 0); rb = roundThou(b * 10, 0);
        if (a % 10 !== 0 && b % 10 !== 0 && (plus || a - b >= 200)) break;
      }
      var op = plus ? '+' : '−';
      var aS = dec(a, 2), bS = dec(b, 2);
      var est = plus ? ra + rb : ra - rb;
      var exact = plus ? a + b : a - b;
      var rounds = [
        x('Round each number to the nearest whole number. Look at the tenths digit.', [aS, 'round'], '  ' + op + '  ', [bS, 'round']),
        x(aS + ' rounds to ' + ra + '. ' + bS + ' rounds to ' + rb + '.', [aS + ' ≈ ' + ra, 'rounded'], '   ', [bS + ' ≈ ' + rb, 'rounded'])
      ];
      if (R.int(0, 1)) {
        return num({
          skill: 'Estimate with rounding', prompt: 'Estimate ' + aS + ' ' + op + ' ' + bS + ' by rounding each number to the nearest whole number. What is your estimate?',
          answer: est, keyboard: 'numeric', placeholder: 'Type a whole number',
          traps: [T(dec(exact, 2), 'That is the exact answer. An estimate uses the rounded numbers, so the sum is easy to work out.'),
                  T(String(plus ? Math.floor(a / 100) + Math.floor(b / 100) : Math.floor(a / 100) - Math.floor(b / 100)), 'You cut off the decimals instead of rounding. Look at the tenths digit. 5 or more rounds up.')],
          work: aS + ' ≈ ' + ra + ' and ' + bS + ' ≈ ' + rb + '. ' + ra + ' ' + op + ' ' + rb + ' = ' + est + '.',
          plain: 'Make each number a whole number that is close. Then do the easy sum or take away.',
          teach: rounds.concat([
            x('Now do the easy calculation with the rounded numbers.', ra + ' ' + op + ' ' + rb + ' = ', [String(est), 'estimate']),
            x('The estimate is ' + est + '. The exact answer will be close to this.', [String(est), 'answer'])
          ])
        });
      }
      var ans = dec(exact, 2), big = dec(exact, 1), small = dec(exact, 3);
      var wrongBig = strip(dec(exact * 10, 2)), wrongSmall = strip(dec(exact, 3));
      var right = strip(ans);
      return Q.choice({
        skill: 'Is the answer sensible', prompt: 'Without working it out exactly, which answer is sensible for ' + aS + ' ' + op + ' ' + bS + '? Round first.',
        options: [
          { text: right, ok: true },
          { text: wrongBig, ok: false, trap: 'The estimate is ' + est + '. ' + wrongBig + ' is far too big. The decimal point is in the wrong place.' },
          { text: wrongSmall, ok: false, trap: 'The estimate is ' + est + '. ' + wrongSmall + ' is far too small. The decimal point is in the wrong place.' }
        ],
        work: aS + ' ≈ ' + ra + ' and ' + bS + ' ≈ ' + rb + ', so the estimate is ' + est + '. Only ' + right + ' is close to ' + est + '.',
        plain: 'Round the numbers and work out the easy answer. Pick the choice that is close to it.',
        teach: rounds.concat([
          x('Do the easy calculation to get an estimate.', ra + ' ' + op + ' ' + rb + ' = ', [String(est), 'estimate']),
          x('Look for the choice that is close to ' + est + '.', [String(est), 'target']),
          x(right + ' is the choice that is close to ' + est + '. The others have the decimal point in the wrong place.', [right, 'sensible'])
        ])
      });
    } },

    { id: 'challenge', level: 6, name: 'Two step decimal problems', make: function () {
      var kind = R.int(0, 2);
      if (kind === 0) {
        var X, A, Bc, t;
        for (t = 0; t < 40; t++) { X = R.int(300, 900); A = R.int(45, 180); Bc = R.int(45, 180); if (X - A - Bc >= 40) break; }
        var left = X - A - Bc, cut = A + Bc, eX = Math.round(X / 100), eA = Math.round(A / 100), eB = Math.round(Bc / 100);
        return num({
          skill: 'Two step: take away twice', prompt: 'A ribbon is ' + dec(X, 2) + ' meters long. Mia cuts off ' + dec(A, 2) + ' meters for a bow and ' + dec(Bc, 2) + ' meters for a card. How many meters of ribbon are left?',
          answer: dec(left, 2), keyboard: 'decimal', placeholder: 'Type your answer',
          traps: [T(dec(cut, 2), 'That is the length she cut off. The question asks how much ribbon is left.'),
                  T(dec(X - A, 2), 'You took away only the first cut. She made two cuts, so take away both.')],
          work: dec(A, 2) + ' + ' + dec(Bc, 2) + ' = ' + dec(cut, 2) + ' meters cut off. Then ' + dec(X, 2) + ' − ' + dec(cut, 2) + ' = ' + dec(left, 2) + ' meters.',
          plain: 'Find how much she cut in all. Then take that from the whole ribbon.',
          teach: [
            note('There are two cuts. Add them to find the total cut. Then take that from the ribbon.', 'The plan', ['Add the two cuts', 'Take the total cut from ' + dec(X, 2)]),
            finalAdd(dec(A, 2), dec(Bc, 2), 'Add the cuts. ' + dec(A, 2) + ' + ' + dec(Bc, 2) + ' = ' + dec(cut, 2) + '.'),
            x('Mia cut off ' + dec(cut, 2) + ' meters in all.', [dec(cut, 2), 'total cut']),
            finalSub(X, cut, 2, 'Take it from the ribbon. ' + dec(X, 2) + ' − ' + dec(cut, 2) + ' = ' + dec(left, 2) + '.'),
            x('There are ' + dec(left, 2) + ' meters of ribbon left.', [dec(left, 2), 'left']),
            x('Check with an estimate. ' + eX + ' − ' + eA + ' − ' + eB + ' = ' + (eX - eA - eB) + '. Our answer is close to that.', [dec(left, 2), 'sensible'])
          ]
        });
      }
      if (kind === 1) {
        var a = R.int(15, 90), b = R.int(15, 90), c = R.int(15, 90);
        var s1 = a + b, s2 = s1 + c;
        return num({
          skill: 'Two step: add three decimals', prompt: 'Tom runs ' + dec(a, 1) + ' km on Monday, ' + dec(b, 1) + ' km on Tuesday and ' + dec(c, 1) + ' km on Wednesday. How many kilometers does he run in all?',
          answer: dec(s2, 1), keyboard: 'decimal', placeholder: 'Type your answer',
          traps: [T(dec(s1, 1), 'That is only the first two days. Add Wednesday too.')],
          work: dec(a, 1) + ' + ' + dec(b, 1) + ' = ' + dec(s1, 1) + '. Then ' + dec(s1, 1) + ' + ' + dec(c, 1) + ' = ' + dec(s2, 1) + ' km.',
          plain: 'Add two numbers first. Then add the third number to that answer.',
          teach: [
            note('Three numbers to add. We add two, then add the third.', 'The plan', ['Monday plus Tuesday', 'Then add Wednesday']),
            finalAdd(dec(a, 1), dec(b, 1), 'Monday plus Tuesday. ' + dec(a, 1) + ' + ' + dec(b, 1) + ' = ' + dec(s1, 1) + '.'),
            x('After two days, Tom has run ' + dec(s1, 1) + ' kilometers.', [dec(s1, 1), 'so far']),
            finalAdd(dec(s1, 1), dec(c, 1), 'Now add Wednesday. ' + dec(s1, 1) + ' + ' + dec(c, 1) + ' = ' + dec(s2, 1) + '.'),
            x('In all Tom runs ' + dec(s2, 1) + ' kilometers.', [dec(s2, 1), 'total'])
          ]
        });
      }
      var n = R.int(3, 6), u = R.int(60, 240), X2;
      while (u % 5 !== 0) u++;
      var spent = n * u;
      do { X2 = R.pick([1000, 1500, 2000, 2500]); } while (X2 - spent < 100);
      var rem = X2 - spent;
      return num({
        skill: 'Two step: multiply then subtract', prompt: 'Sam has ' + money(X2) + '. He buys ' + n + ' books that cost ' + money(u) + ' each. How many dollars does he have left?',
        answer: dec(rem, 2), answerText: money(rem), keyboard: 'decimal', placeholder: 'Type your answer',
        traps: [T(dec(spent, 2), 'That is the money Sam spent. The question asks how much he has left.'),
                T(dec(X2 - u, 2), 'You took away the price of only one book. He bought ' + n + ' books.')],
        work: n + ' × ' + money(u) + ' = ' + money(spent) + '. Then ' + money(X2) + ' − ' + money(spent) + ' = ' + money(rem) + '.',
        plain: 'First find the cost of all the books. Then take that away from the money Sam had.',
        teach: [
          note('First find what the books cost. Then find what is left.', 'The plan', ['Multiply the price by ' + n, 'Take the cost from ' + money(X2)]),
          x('In cents, ' + money(u) + ' is ' + u + ' cents. ' + u + ' × ' + n + ' = ' + spent + ' cents.', u + ' × ' + n + ' = ', [spent + ' cents', 'cost of books']),
          x('That is ' + money(spent) + '.', spent + ' cents = ', [money(spent), 'spent']),
          finalSub(X2, spent, 2, 'Take it from his money. ' + money(X2) + ' − ' + money(spent) + ' = ' + money(rem) + '.'),
          x('Sam has ' + money(rem) + ' left.', [money(rem), 'left'])
        ]
      });
    } }
  ]);
})();
