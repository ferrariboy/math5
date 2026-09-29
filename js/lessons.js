/* Animated lessons. Each module has one or more scenes. Each scene is a list of steps.
   Step kinds: expr (tokens), bars (rows of boxes), grid (shaded squares), lines (worked layout).
   The cap text is what is shown on screen and what the voice reads. */
(function () {
  var E = window.MathEngine;
  function tok(t, hi, tag) { return { t: t, hi: !!hi, tag: tag || '' }; }

  var BASE = {
    1: [
      { title: 'Round 4,589,201', steps: [
        { kind: 'expr', tokens: [tok('4,589,201')], cap: 'Here is a big number. Let us round it to the nearest hundred thousand.' },
        { kind: 'expr', tokens: [tok('4,'), tok('5', true, 'hundred thousands'), tok('89,201')], cap: 'Find the hundred thousands place. It holds the digit 5.' },
        { kind: 'expr', tokens: [tok('4,'), tok('5'), tok('8', true, 'look here'), tok('9,201')], cap: 'Look one place to the right. It is an 8.' },
        { kind: 'expr', tokens: [tok('4,'), tok('5', true, 'goes up'), tok('8', true, '5 or more'), tok('9,201')], cap: '8 is 5 or more, so the 5 goes up to 6.' },
        { kind: 'expr', tokens: [tok('4,'), tok('6', true), tok('00,000')], cap: 'Every digit after it turns into a zero.' },
        { kind: 'expr', tokens: [tok('4,600,000', true, 'answer')], cap: '4,589,201 rounds to 4,600,000.' }
      ] }
    ],
    2: [
      { title: 'Order of operations', steps: [
        { kind: 'expr', tokens: [tok('30 − (2 × 5) + 6 ÷ 3')], cap: 'Solve 30 minus 2 times 5 in brackets, plus 6 divided by 3.' },
        { kind: 'expr', tokens: [tok('30 − '), tok('(2 × 5)', true, 'brackets first'), tok(' + 6 ÷ 3')], cap: 'Brackets go first. 2 times 5 is 10.' },
        { kind: 'expr', tokens: [tok('30 − '), tok('10', true), tok(' + 6 ÷ 3')], cap: 'The bracket is now 10.' },
        { kind: 'expr', tokens: [tok('30 − 10 + '), tok('6 ÷ 3', true, 'divide next')], cap: 'Times and division come next. 6 divided by 3 is 2.' },
        { kind: 'expr', tokens: [tok('30 − 10 + '), tok('2', true)], cap: 'Now we have 30 minus 10 plus 2.' },
        { kind: 'expr', tokens: [tok('30 − 10', true, 'left to right'), tok(' + 2')], cap: 'Go from left to right. 30 minus 10 is 20.' },
        { kind: 'expr', tokens: [tok('20 + 2', true)], cap: 'Then 20 plus 2.' },
        { kind: 'expr', tokens: [tok('22', true, 'answer')], cap: 'The answer is 22.' }
      ] },
      { title: 'Long division 1250 ÷ 12', steps: E.longDiv(1250, 12) }
    ],
    3: [
      { title: 'Half of three quarters', steps: [
        { kind: 'grid', cols: 4, rows: 2, shades: [], cap: 'Here is one whole. Cut it into 4 columns and 2 rows.' },
        { kind: 'grid', cols: 4, rows: 2, shades: [{ c0: 0, c1: 3, r0: 0, r1: 2, cls: 'bg-indigo-400' }], cap: 'Color 3 of the 4 columns. That is 3 over 4.' },
        { kind: 'grid', cols: 4, rows: 2, shades: [{ c0: 0, c1: 3, r0: 0, r1: 2, cls: 'bg-indigo-400' }, { c0: 0, c1: 4, r0: 0, r1: 1, cls: 'bg-amber-300' }, { c0: 0, c1: 3, r0: 0, r1: 1, cls: 'bg-emerald-500' }], cap: 'Now take half of it. Half means the top row.' },
        { kind: 'grid', cols: 4, rows: 2, shades: [{ c0: 0, c1: 3, r0: 0, r1: 1, cls: 'bg-emerald-500' }], cap: 'Only the green boxes are half of three quarters. There are 3 out of 8.' },
        { kind: 'expr', tokens: [tok('1/2 × 3/4 = '), tok('3/8', true, 'answer')], cap: '1/2 times 3/4 equals 3/8.' }
      ] }
    ],
    4: [
      { title: 'Add 3.4 + 2.75', steps: E.verticalAdd('3.4', '2.75') }
    ],
    5: [
      { title: 'Red and blue 3 : 2', steps: [
        { kind: 'bars', rows: [
          { label: 'Red', segs: [{ n: 1, cls: 'bg-rose-400' }, { n: 1, cls: 'bg-rose-400' }, { n: 1, cls: 'bg-rose-400' }] },
          { label: 'Blue', segs: [{ n: 1, cls: 'bg-sky-400' }, { n: 1, cls: 'bg-sky-400' }] }
        ], cap: 'Red to blue is 3 to 2. Draw 3 boxes for red and 2 for blue.' },
        { kind: 'bars', rows: [
          { label: 'Red', segs: [{ n: 1, cls: 'bg-rose-400' }, { n: 1, cls: 'bg-rose-400' }, { n: 1, cls: 'bg-rose-400' }], total: '15' },
          { label: 'Blue', segs: [{ n: 1, cls: 'bg-sky-400' }, { n: 1, cls: 'bg-sky-400' }] }
        ], cap: 'There are 15 red counters. Those 3 boxes hold 15.' },
        { kind: 'bars', rows: [
          { label: 'Red', segs: [{ n: 1, cls: 'bg-rose-400', text: '5' }, { n: 1, cls: 'bg-rose-400', text: '5' }, { n: 1, cls: 'bg-rose-400', text: '5' }], total: '15' },
          { label: 'Blue', segs: [{ n: 1, cls: 'bg-sky-400' }, { n: 1, cls: 'bg-sky-400' }] }
        ], cap: 'Share 15 into 3 boxes. 15 divided by 3 is 5 in each box.' },
        { kind: 'bars', rows: [
          { label: 'Red', segs: [{ n: 1, cls: 'bg-rose-400', text: '5' }, { n: 1, cls: 'bg-rose-400', text: '5' }, { n: 1, cls: 'bg-rose-400', text: '5' }], total: '15' },
          { label: 'Blue', segs: [{ n: 1, cls: 'bg-sky-400', text: '5' }, { n: 1, cls: 'bg-sky-400', text: '5' }], total: '10' }
        ], cap: 'Every box is 5. Blue has 2 boxes, so 2 times 5 is 10 blue counters.' }
      ] }
    ],
    6: [
      { title: 'Bike helmet sale', steps: [
        { kind: 'expr', tokens: [tok('$40', true, 'price')], cap: 'A helmet costs $40. It is 25% off.' },
        { kind: 'expr', tokens: [tok('$40 × 25% = '), tok('$10', true, 'discount')], cap: '25% of $40 is $10. That is the discount.' },
        { kind: 'expr', tokens: [tok('$40 − $10 = '), tok('$30', true, 'sale price')], cap: 'Take $10 off. The sale price is $30.' },
        { kind: 'expr', tokens: [tok('$30 × 5% = '), tok('$1.50', true, 'tax')], cap: 'Add 5% tax. 5% of $30 is $1.50.' },
        { kind: 'expr', tokens: [tok('$30 + $1.50 = '), tok('$31.50', true, 'total')], cap: 'You pay $31.50 in total.' }
      ] }
    ],
    7: [
      { title: 'Angles on a straight line', steps: [
        { kind: 'expr', tokens: [tok('180°', true, 'straight line')], cap: 'A straight line is a half turn. It measures 180 degrees.' },
        { kind: 'expr', tokens: [tok('a', true, 'missing'), tok(' + 65° = 180°')], cap: 'One angle is 65 degrees. The other angle is a. Together they make 180.' },
        { kind: 'expr', tokens: [tok('a = 180° − 65°', true)], cap: 'To find a, take 65 away from 180.' },
        { kind: 'expr', tokens: [tok('a = 115°', true, 'answer')], cap: 'The missing angle is 115 degrees.' }
      ] }
    ],
    8: [
      { title: 'Count the cubes in a box', steps: [
        { kind: 'grid', cols: 4, rows: 3, shades: [{ c0: 0, c1: 4, r0: 0, r1: 3, cls: 'bg-emerald-400' }], cap: 'The floor of a box is 4 cubes long and 3 cubes wide.' },
        { kind: 'expr', tokens: [tok('4 × 3 = '), tok('12', true, 'cubes on the floor')], cap: '4 times 3 is 12 cubes cover the floor.' },
        { kind: 'expr', tokens: [tok('12 × '), tok('2', true, 'layers')], cap: 'The box is 2 layers tall. So we stack the floor 2 times.' },
        { kind: 'expr', tokens: [tok('12 × 2 = '), tok('24', true, 'cubes')], cap: '12 times 2 is 24. The box holds 24 cubes.' }
      ] }
    ]
  };
  window.MATH_LESSONS = window.MATH_LESSONS || {};
  Object.keys(BASE).forEach(function (k) { if (!window.MATH_LESSONS[k]) window.MATH_LESSONS[k] = BASE[k]; });
})();
