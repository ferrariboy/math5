/* Module 5: Ratios and Before and After Models. Lessons, vocabulary and question skills. */
(function () {
  'use strict';
  var B = window.Bank, R = B.R, S = B.s, Q = B.q, T = Q.trap;
  var x = S.x, note = S.note, bars = S.bars, fb = S.fb, row = S.row, groups = S.groups;

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

  /* ---------- Helpers ---------- */
  function rt(a, b, c) { return a + ' : ' + b + (c === undefined ? '' : ' : ' + c); }
  function dec2(c) {
    var s = String(c);
    while (s.length < 3) s = '0' + s;
    return s.slice(0, s.length - 2) + '.' + s.slice(s.length - 2);
  }
  function money(c) { return '$' + dec2(c); }
  var RED = 'bg-rose-400', BLUE = 'bg-sky-400', GREEN = 'bg-emerald-400', AMBER = 'bg-amber-300';
  /* mixRow: a bar with base boxes in one color and extra boxes in another */
  function mixRow(label, base, extra, c1, c2, tot, t1, t2) {
    var segs = [], i;
    for (i = 0; i < base; i++) segs.push({ n: 1, cls: c1, text: t1 === undefined ? '' : String(t1) });
    for (i = 0; i < extra; i++) segs.push({ n: 1, cls: c2, text: t2 === undefined ? '' : String(t2) });
    var r = { label: label, segs: segs };
    if (tot) r.total = tot;
    return r;
  }
  var PEOPLE = [['Mia', 'Leo'], ['Rinka', 'Ben'], ['Tom', 'Sam'], ['Ava', 'Noah'], ['Ella', 'Max']];
  var THINGS = ['stickers', 'marbles', 'cards', 'coins'];
  var PAIRS = [['red counters', 'blue counters'], ['boys', 'girls'], ['cats', 'dogs'], ['apples', 'pears'], ['pens', 'pencils']];
  function coprime(a, b) { return R.gcd(a, b) === 1; }

  /* ---------- Vocabulary ---------- */
  window.MATH_VOCAB[5] = [
    { w: 'Ratio', m: 'A way to compare two amounts. For every 3 red counters there are 2 blue counters, so the ratio is 3 : 2.' },
    { w: 'Part to part', m: 'A ratio that compares one group to another group, like red counters to blue counters.' },
    { w: 'Part to whole', m: 'A ratio that compares one group to everything. It can be written as a fraction.' },
    { w: 'Equivalent ratios', m: 'Different ratios that describe the same recipe, like 2 : 3 and 4 : 6.' },
    { w: 'Simplest form', m: 'A ratio with the smallest whole numbers possible. 4 : 6 in simplest form is 2 : 3.' },
    { w: 'One unit', m: 'The size of one box in a bar model. Once you know it, every other box is easy.' },
    { w: 'Rate', m: 'A comparison of two different kinds of things, like kilometers and hours.' },
    { w: 'Unit rate', m: 'A rate for exactly one. 60 kilometers per hour is a unit rate.' }
  ];

  /* ---------- Lessons ---------- */
  window.MATH_LESSONS[5] = [
    { title: '1. What is a ratio?',
      explain: [
        'A ratio compares two amounts. It tells how many of one thing there are for how many of another thing.',
        'Say a fruit bowl has 3 apples and 2 oranges. For every 3 apples there are 2 oranges. The ratio of apples to oranges is 3 to 2.',
        'We write a ratio with a colon, like 3 : 2. The colon is read as the word to.'
      ],
      rule: 'A ratio compares two amounts. Write it as first : second.',
      mistake: 'A ratio is not a take away. 3 : 2 does not mean 1 more. It means for every 3 of one thing there are 2 of the other.',
      steps: [
        bars('Here is a fruit bowl. There are 3 apples and 2 oranges.', [row('Apples', 3, RED, ''), row('Oranges', 2, AMBER, '')]),
        x('The ratio of apples to oranges is 3 to 2. We write 3 : 2.', ['3', 'apples'], ' : ', ['2', 'oranges']),
        bars('Now make a bigger bowl with the same recipe. It has 6 apples and 4 oranges.', [row('Apples', 6, RED, ''), row('Oranges', 4, AMBER, '')]),
        x('Both bowls taste the same. 3 : 2 and 6 : 4 are the same ratio.', ['3 : 2', 'small bowl'], ' = ', ['6 : 4', 'big bowl']),
        bars('Look at the boxes in groups. In both bowls, every 3 apples go with 2 oranges.', [row('Apples', 3, RED, '3'), row('Oranges', 2, AMBER, '2')]),
        note('Three things to remember about ratios.', 'Ratio facts', ['A ratio compares two amounts', 'The colon means to', 'The order matters'])
      ] },

    { title: '2. Writing a ratio in the right order',
      explain: [
        'The order matters. The ratio of red to blue puts red first. The ratio of blue to red puts blue first.',
        'A part to part ratio compares one group with another group. A part to whole ratio compares one group with everything.',
        'A part to whole ratio can be written as a fraction. If 3 out of 8 counters are red, then 3/8 of the counters are red.'
      ],
      rule: 'Say the ratio in the order of the words. The first word gives the first number.',
      mistake: 'Do not flip the order. Red to blue is 3 : 5, but blue to red is 5 : 3.',
      steps: [
        bars('A box has 3 red counters and 5 blue counters.', [row('Red', 3, RED, ''), row('Blue', 5, BLUE, '')]),
        x('Red to blue. Red is first, so red goes first. The ratio is 3 : 5.', ['3', 'red'], ' : ', ['5', 'blue']),
        x('Blue to red. Now blue is first. The ratio is 5 : 3.', ['5', 'blue'], ' : ', ['3', 'red']),
        bars('All the counters together are 3 + 5 = 8.', [mixRow('All counters', 3, 5, RED, BLUE, '8')]),
        x('Red to all the counters is a part to whole ratio. It is 3 : 8.', ['3', 'red'], ' : ', ['8', 'all']),
        x('As a fraction, 3 out of 8 counters are red. The bottom is the total, 8.', ['3/8', 'of the counters are red']),
        note('Be careful with the words.', 'Part to part or part to whole?', ['Red to blue is part to part: 3 : 5', 'Red to all is part to whole: 3 : 8', 'The whole is the total of all the parts'])
      ] },

    { title: '3. Equivalent ratios',
      explain: [
        'A wizard mixes 2 scoops of juice with 3 scoops of water. To make a bigger batch that tastes the same, he doubles both amounts. That gives 4 scoops of juice and 6 scoops of water.',
        'Ratios that describe the same recipe are called equivalent ratios. 2 : 3 and 4 : 6 are equivalent.',
        'To make an equivalent ratio, multiply both numbers by the same number. You can also divide both by the same number.'
      ],
      rule: 'Multiply or divide both parts by the same number.',
      mistake: 'Do not add the same number to both parts. 2 : 3 becomes 4 : 6, not 4 : 5.',
      steps: [
        bars('One batch has 2 scoops of juice and 3 scoops of water.', [row('Juice', 2, AMBER, ''), row('Water', 3, BLUE, '')]),
        bars('Two batches. That is 4 scoops of juice and 6 scoops of water.', [row('Juice', 4, AMBER, ''), row('Water', 6, BLUE, '')]),
        x('We multiplied both parts by 2. The recipe is the same.', ['2', '× 2'], ' : ', ['3', '× 2'], ' = ', ['4 : 6', 'equivalent']),
        x('Three batches. Multiply both parts by 3.', '2 : 3 = ', ['6 : 9', '× 3 on both']),
        x('Now find a missing number. 2 : 3 = 10 : ?. The first part went from 2 to 10.', '2 : 3 = 10 : ', ['?', 'missing']),
        x('2 × 5 = 10, so the multiplier is 5. Do the same to the second part: 3 × 5 = 15.', '2 : 3 = 10 : ', ['15', '3 × 5']),
        x('Check. Both parts were multiplied by 5, so the ratios are equivalent.', ['2 : 3', 'start'], ' = ', ['10 : 15', 'answer'])
      ] },

    { title: '4. Simplest form of a ratio',
      explain: [
        'Simplest form means the ratio uses the smallest whole numbers possible. It is like tidying up the ratio.',
        'To simplify, find a number that goes into both parts. Divide both parts by it. Keep going until only 1 goes into both.',
        'The biggest number that goes into both parts makes it quick. For 12 : 18 the biggest is 6.'
      ],
      rule: 'Divide both parts by the same number until only 1 goes into both.',
      mistake: 'Stopping too early. 6 : 9 is not in simplest form. Both parts still divide by 3.',
      steps: [
        x('Write 12 : 18 in simplest form. We look for a number that goes into both 12 and 18.', ['12 : 18', 'simplify']),
        groups('Put the 12 red counters into groups of 6. That makes 2 groups.', 2, 6, 2, '2 groups of 6'),
        groups('Put the 18 blue counters into groups of 6. That makes 3 groups.', 3, 6, 3, '3 groups of 6'),
        x('So there are 2 groups of red for every 3 groups of blue.', ['12', '÷ 6 = 2'], ' : ', ['18', '÷ 6 = 3']),
        x('Divide both by 6. 12 ÷ 6 = 2 and 18 ÷ 6 = 3.', '12 : 18 = ', ['2 : 3', 'simplest']),
        x('Check. Only 1 goes into both 2 and 3. So 2 : 3 is in simplest form.', ['2 : 3', 'done']),
        x('Try 8 : 20. 4 goes into both. 8 ÷ 4 = 2 and 20 ÷ 4 = 5.', '8 : 20 = ', ['2 : 5', 'simplest'])
      ] },

    { title: '5. Finding one unit with a bar model',
      explain: [
        'A bar model draws each part of a ratio as a row of equal boxes. Every box is the same size. That size is called one unit.',
        'If you know how many are in some boxes, you can find what is in one box. Then every other box is easy.',
        'The plan is: draw the boxes, find one unit by dividing, then multiply to find what you want.'
      ],
      rule: 'Divide to find one unit. Then multiply by the number of boxes you need.',
      mistake: 'Do not add or subtract to go from one part to the other. Find one unit, then multiply.',
      steps: [
        x('The ratio of red to blue counters is 3 : 5. There are 12 red counters. How many blue counters?', ['3 : 5', 'red to blue'], '  and  ', ['12', 'red']),
        bars('Draw 3 boxes for red and 5 boxes for blue. Every box is the same size.', [row('Red', 3, RED, ''), row('Blue', 5, BLUE, '')]),
        bars('The 3 red boxes hold 12 counters in all.', [row('Red', 3, RED, '', '12'), row('Blue', 5, BLUE, '')]),
        x('Find one unit. Share 12 into 3 boxes. 12 ÷ 3 = 4.', '12 ÷ 3 = ', ['4', 'one unit']),
        bars('Every box holds 4 counters.', [row('Red', 3, RED, '4', '12'), row('Blue', 5, BLUE, '4')]),
        x('Blue has 5 boxes. 5 × 4 = 20.', '5 × 4 = ', ['20', 'blue counters']),
        bars('Now the blue bar shows the total.', [row('Red', 3, RED, '4', '12'), row('Blue', 5, BLUE, '4', '20')]),
        x('Check the ratio. 12 : 20 divides by 4 to give 3 : 5. It matches.', '12 : 20 = ', ['3 : 5', 'check'])
      ] },

    { title: '6. The total is given',
      explain: [
        'Sometimes a problem tells you the total of both parts together. Add up all the boxes to see how many units the total is made of.',
        'Then divide the total by the number of boxes to find one unit.',
        'Finally multiply one unit by the number of boxes for the part you are asked about.'
      ],
      rule: 'Total ÷ all the boxes = one unit. Then multiply for the part you want.',
      mistake: 'Do not divide the total by only one part. Divide by all the boxes, boys and girls together.',
      steps: [
        x('Boys and girls in a club are in the ratio 3 : 4. There are 28 children. How many girls?', ['3 : 4', 'boys to girls'], '  and  ', ['28', 'in all']),
        bars('Draw 3 boxes for boys and 4 boxes for girls.', [row('Boys', 3, RED, ''), row('Girls', 4, BLUE, '')]),
        bars('Both bars together make 3 + 4 = 7 boxes. These 7 boxes hold 28 children.', [mixRow('Total', 3, 4, RED, BLUE, '28')]),
        x('Find one unit. 28 ÷ 7 = 4. Each box holds 4 children.', '28 ÷ 7 = ', ['4', 'one unit']),
        bars('Write 4 in every box.', [row('Boys', 3, RED, '4', '12'), row('Girls', 4, BLUE, '4', '16')]),
        x('Girls have 4 boxes. 4 × 4 = 16.', '4 × 4 = ', ['16', 'girls']),
        x('Check. Boys 12 plus girls 16 is 28. It matches the total.', '12 + 16 = ', ['28', 'total'])
      ] },

    { title: '7. The difference is given',
      explain: [
        'Sometimes a problem tells you how much more one person has than another. On the bar model, that is the extra boxes on the longer bar.',
        'Count how many extra boxes there are. The difference of the boxes matches the difference in the story.',
        'Divide to find one unit, then multiply to find what you want.'
      ],
      rule: 'Difference in boxes matches the difference in the story. Divide to find one unit.',
      mistake: 'The difference in the story is not one unit. It is usually several boxes.',
      steps: [
        x('Tom and Sam have stickers in the ratio 5 : 2. Tom has 18 more than Sam. How many does Tom have?', ['5 : 2', 'Tom to Sam'], '  and  ', ['18 more', 'difference']),
        bars('Tom has 5 boxes and Sam has 2 boxes.', [row('Tom', 5, RED, ''), row('Sam', 2, BLUE, '')]),
        bars('Tom has 3 extra boxes. 5 − 2 = 3. These 3 boxes are the 18 more.', [mixRow('Tom', 2, 3, RED, AMBER, '18 more'), row('Sam', 2, BLUE, '')]),
        x('Find one unit. 18 ÷ 3 = 6.', '18 ÷ 3 = ', ['6', 'one unit']),
        bars('Every box holds 6 stickers.', [row('Tom', 5, RED, '6', '30'), row('Sam', 2, BLUE, '6', '12')]),
        x('Tom has 5 boxes. 5 × 6 = 30.', '5 × 6 = ', ['30', 'Tom']),
        x('Check. Sam has 2 × 6 = 12, and 30 − 12 = 18.', '30 − 12 = ', ['18', 'the difference'])
      ] },

    { title: '8. Before and after: one part stays the same',
      explain: [
        'Before and after problems tell a story about a change. Draw one bar model for before and one for after. Line up the parts that did not change.',
        'If one person gets more, only their bar gets longer. The other person stays the same, so their boxes stay the same.',
        'The extra boxes on the longer bar match the amount that was added. That lets you find one unit.'
      ],
      rule: 'Find the part that did not change. Extra boxes match the change.',
      mistake: 'Do not use the after ratio to describe the before amounts. Draw two models, before and after.',
      steps: [
        x('Mia and Leo have stickers in the ratio 2 : 5. Mia gets 12 more and the ratio becomes 4 : 5, so how many does Leo have?', ['2 : 5', 'before'], '  then  ', ['4 : 5', 'after']),
        bars('Before, Mia has 2 boxes and Leo has 5 boxes.', [row('Mia before', 2, RED, ''), row('Leo before', 5, BLUE, '')]),
        bars('After, Mia has 4 boxes and Leo still has 5, because Leo did not change.', [mixRow('Mia after', 2, 2, RED, AMBER, ''), row('Leo after', 5, BLUE, '')]),
        x('Mia gets 2 more boxes. Those 2 boxes are the 12 stickers she was given.', ['2 boxes', 'added'], ' = ', ['12', 'stickers']),
        x('Find one unit. 12 ÷ 2 = 6.', '12 ÷ 2 = ', ['6', 'one unit']),
        bars('Every box holds 6 stickers.', [row('Mia before', 2, RED, '6', '12'), row('Leo', 5, BLUE, '6', '30')]),
        x('Leo has 5 boxes. 5 × 6 = 30 stickers.', '5 × 6 = ', ['30', 'Leo']),
        x('Check. Mia now has 4 × 6 = 24, and 24 : 30 is 4 : 5.', '24 : 30 = ', ['4 : 5', 'check'])
      ] },

    { title: '9. Before and after: the total stays the same',
      explain: [
        'Sometimes people give things to each other. Then nobody gains or loses in total. The total number of boxes stays the same before and after.',
        'What one person gains, the other loses. So the boxes that moved are the same number on both bars.',
        'Find how many boxes moved. That number of boxes holds the amount given. Divide to find one unit.'
      ],
      rule: 'When things are shared or passed on, the total does not change.',
      mistake: 'Do not forget that the giver loses what the receiver gains. Check that both bars still make the same total.',
      steps: [
        x('Mia and Leo have stickers in the ratio 2 : 5. Leo gives Mia 14 stickers and the ratio becomes 4 : 3, so how many stickers do they have in all?', ['2 : 5', 'before'], '  then  ', ['4 : 3', 'after']),
        bars('Before, there are 2 + 5 = 7 boxes in all.', [row('Mia before', 2, RED, ''), row('Leo before', 5, BLUE, '')]),
        bars('After, there are 4 + 3 = 7 boxes in all, so the total did not change.', [mixRow('Mia after', 2, 2, RED, AMBER, ''), row('Leo after', 3, BLUE, '')]),
        x('Mia went from 2 boxes to 4 boxes. She gained 2 boxes. They are the 14 stickers.', ['2 boxes', 'moved'], ' = ', ['14', 'stickers']),
        x('Find one unit. 14 ÷ 2 = 7.', '14 ÷ 2 = ', ['7', 'one unit']),
        x('The total is 7 boxes. 7 × 7 = 49.', '7 × 7 = ', ['49', 'stickers in all']),
        x('Check. Mia had 14 and Leo had 35, and 14 + 35 = 49.', '14 + 35 = ', ['49', 'check'])
      ] },

    { title: '10. Rates and unit rates',
      explain: [
        'A rate compares two different kinds of things, like kilometers and hours, or dollars and kilograms.',
        'A unit rate tells you the amount for exactly one. If 3 kilograms of apples cost $7.50, the unit rate is the cost of 1 kilogram.',
        'Divide to find the unit rate. Then multiply the unit rate to find the amount for any number.'
      ],
      rule: 'Divide to find the amount for one. Multiply to find the amount for many.',
      mistake: 'Do not add to scale a rate. If 3 kilograms cost $7.50, then 5 kilograms do not cost $7.50 + $2. Find one first.',
      steps: [
        x('A car drives 180 kilometers in 3 hours at the same speed. How far in 1 hour?', ['180 km', 'distance'], ' in ', ['3 hours', 'time']),
        bars('Draw 3 boxes for the 3 hours. Together they hold 180 kilometers.', [row('Hours', 3, BLUE, '', '180 km')]),
        x('Share equally. 180 ÷ 3 = 60. The unit rate is 60 kilometers per hour.', '180 ÷ 3 = ', ['60', 'km in 1 hour']),
        x('Now use the rate. How much do 5 kilograms of apples cost if 3 kilograms cost $7.50?', ['$7.50', '3 kg']),
        bars('3 kilograms cost $7.50. Share it into 3 equal boxes.', [row('Kilograms', 3, GREEN, '$2.50', '$7.50')]),
        x('One kilogram costs $2.50. 750 cents ÷ 3 = 250 cents.', '$7.50 ÷ 3 = ', ['$2.50', 'one kilogram']),
        bars('For 5 kilograms we need 5 boxes of $2.50.', [row('Kilograms', 5, GREEN, '$2.50', '$12.50')]),
        x('5 × $2.50 = $12.50. So 5 kilograms cost $12.50.', '5 × $2.50 = ', ['$12.50', 'answer'])
      ] }
  ];

  /* ---------- Question skills ---------- */
  B.register(5, [

    { id: 'write', level: 1, name: 'Write a ratio in order', make: function () {
      var a = R.int(2, 9), b = R.int(2, 9);
      while (b === a) b = R.int(2, 9);
      var ctx = R.pick(PAIRS), flip = R.int(0, 1);
      var p = flip ? b : a, q = flip ? a : b, n1 = flip ? ctx[1] : ctx[0], n2 = flip ? ctx[0] : ctx[1];
      var ok = rt(p, q), sw = rt(q, p), pw = rt(p, a + b);
      return Q.choice({
        skill: 'Write a ratio', prompt: 'A box holds ' + a + ' ' + ctx[0] + ' and ' + b + ' ' + ctx[1] + '. What is the ratio of ' + n1 + ' to ' + n2 + '?',
        options: [
          { text: ok, ok: true },
          { text: sw, ok: false, trap: 'The order is flipped. The ratio of ' + n1 + ' to ' + n2 + ' must start with the number of ' + n1 + '.' },
          { text: pw, ok: false, trap: 'That compares ' + n1 + ' to all the things together. We want ' + n1 + ' to ' + n2 + '.' }
        ],
        work: 'There are ' + p + ' ' + n1 + ' and ' + q + ' ' + n2 + '. The ratio of ' + n1 + ' to ' + n2 + ' is ' + ok + '.',
        plain: 'Say the words in order. The first thing named gives the first number.',
        teach: [
          bars('Here are the ' + a + ' ' + ctx[0] + ' and the ' + b + ' ' + ctx[1] + '.', [row(ctx[0], a, RED, ''), row(ctx[1], b, BLUE, '')]),
          x('We want the ratio of ' + n1 + ' to ' + n2 + '. ' + n1 + ' come first.', [n1, 'first'], ' to ', [n2, 'second']),
          x('There are ' + p + ' ' + n1 + '. That is the first number.', [String(p), n1]),
          x('There are ' + q + ' ' + n2 + '. That is the second number.', String(p) + ' : ', [String(q), n2]),
          x('So the ratio is ' + ok + '.', [ok, 'answer'])
        ]
      });
    } },

    { id: 'fraction', level: 2, name: 'Ratio to fraction of the whole', make: function () {
      var a, b;
      do { a = R.int(1, 8); b = R.int(1, 8); } while (a === b || !coprime(a, b));
      var tot = a + b, ctx = R.pick(PAIRS);
      var ans = a + '/' + tot;
      return num({
        skill: 'Ratio and fractions', prompt: 'The ratio of ' + ctx[0] + ' to ' + ctx[1] + ' is ' + rt(a, b) + '. What fraction of all the things are ' + ctx[0] + '?',
        answer: ans, simplest: true, placeholder: 'Like 3/8',
        traps: [T(a + '/' + b, 'That compares ' + ctx[0] + ' to ' + ctx[1] + '. The bottom number must be all the parts, ' + a + ' + ' + b + ' = ' + tot + '.'),
                T(b + '/' + tot, 'That is the fraction of ' + ctx[1] + '. We want the fraction of ' + ctx[0] + '.')],
        work: 'The whole is ' + a + ' + ' + b + ' = ' + tot + ' parts. ' + ctx[0] + ' are ' + a + ' of them, so ' + a + '/' + tot + '.',
        plain: 'Add the parts to find the whole. The fraction has the part on top and the whole on the bottom.',
        teach: [
          bars('Draw ' + a + ' boxes for ' + ctx[0] + ' and ' + b + ' boxes for ' + ctx[1] + '.', [row(ctx[0], a, RED, ''), row(ctx[1], b, BLUE, '')]),
          bars('All the boxes together make ' + a + ' + ' + b + ' = ' + tot + '.', [mixRow('All together', a, b, RED, BLUE, String(tot))]),
          x('The whole is ' + tot + ' equal parts. That is the bottom number.', [String(tot), 'whole']),
          x(ctx[0] + ' take up ' + a + ' of the ' + tot + ' parts. So the fraction is ' + a + '/' + tot + '.', [a + '/' + tot, 'answer'])
        ]
      });
    } },

    { id: 'equiv', level: 2, name: 'Equivalent ratios', make: function () {
      var a, b;
      do { a = R.int(1, 9); b = R.int(2, 9); } while (a === b || !coprime(a, b));
      var m = R.int(2, 9), am = a * m, bm = b * m, v = R.int(0, 2);
      var prompt, ans, traps, work, teach;
      if (v === 0) {
        prompt = 'Fill in the missing number: ' + a + ' : ' + b + ' = ? : ' + bm;
        ans = am;
        traps = [T(String(a + bm - b), 'You added ' + (bm - b) + ' to the first part. To keep the same ratio you must multiply both parts by the same number.'), T(String(m), 'That is the number we multiply by. Now use it on ' + a + ': ' + a + ' × ' + m + '.')];
        work = b + ' × ' + m + ' = ' + bm + ', so ' + a + ' × ' + m + ' = ' + am + '.';
        teach = [
          x('Look at the second parts. ' + b + ' turned into ' + bm + '.', a + ' : ' + b + ' = ', ['?', 'missing'], ' : ' + bm),
          x(b + ' × ' + m + ' = ' + bm + '. Both parts must be multiplied by ' + m + '.', b + ' × ', [String(m), 'multiplier'], ' = ' + bm),
          x('Do the same to the first part. ' + a + ' × ' + m + ' = ' + am + '.', a + ' × ' + m + ' = ', [String(am), 'missing number']),
          x('So the ratios are equal.', a + ' : ' + b + ' = ', [am + ' : ' + bm, 'answer'])
        ];
      } else if (v === 1) {
        prompt = 'Fill in the missing number: ' + a + ' : ' + b + ' = ' + am + ' : ?';
        ans = bm;
        traps = [T(String(b + am - a), 'You added ' + (am - a) + ' to the second part. To keep the same ratio you must multiply both parts by the same number.'), T(String(m), 'That is the number we multiply by. Now use it on ' + b + ': ' + b + ' × ' + m + '.')];
        work = a + ' × ' + m + ' = ' + am + ', so ' + b + ' × ' + m + ' = ' + bm + '.';
        teach = [
          x('Look at the first parts. ' + a + ' turned into ' + am + '.', a + ' : ' + b + ' = ' + am + ' : ', ['?', 'missing']),
          x(a + ' × ' + m + ' = ' + am + '. Both parts must be multiplied by ' + m + '.', a + ' × ', [String(m), 'multiplier'], ' = ' + am),
          x('Do the same to the second part. ' + b + ' × ' + m + ' = ' + bm + '.', b + ' × ' + m + ' = ', [String(bm), 'missing number']),
          x('So the ratios are equal.', a + ' : ' + b + ' = ' + am + ' : ', [String(bm), 'answer'])
        ];
      } else {
        prompt = 'Fill in the missing number: ' + am + ' : ' + bm + ' = ' + a + ' : ?';
        ans = b;
        traps = [T(String(bm - (am - a)), 'You took away ' + (am - a) + ' from the second part. To keep the same ratio you must divide both parts by the same number.'), T(String(m), 'That is the number we divide by. Now use it on ' + bm + ': ' + bm + ' ÷ ' + m + '.')];
        work = am + ' ÷ ' + m + ' = ' + a + ', so ' + bm + ' ÷ ' + m + ' = ' + b + '.';
        teach = [
          x('Look at the first parts. ' + am + ' turned into ' + a + '.', am + ' : ' + bm + ' = ' + a + ' : ', ['?', 'missing']),
          x(am + ' ÷ ' + m + ' = ' + a + '. Both parts must be divided by ' + m + '.', am + ' ÷ ', [String(m), 'divider'], ' = ' + a),
          x('Do the same to the second part. ' + bm + ' ÷ ' + m + ' = ' + b + '.', bm + ' ÷ ' + m + ' = ', [String(b), 'missing number']),
          x('So the ratios are equal.', am + ' : ' + bm + ' = ' + a + ' : ', [String(b), 'answer'])
        ];
      }
      traps = traps.filter(function (t) { return t.value !== String(ans); });
      return num({ skill: 'Equivalent ratios', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type the missing number', traps: traps, work: work, plain: 'Whatever you do to one part, you do to the other part. Multiply both or divide both.', teach: teach });
    } },

    { id: 'simplest', level: 2, name: 'Ratio in simplest form', make: function () {
      var a, b;
      do { a = R.int(1, 9); b = R.int(1, 9); } while (a === b || !coprime(a, b));
      var g = R.pick([2, 3, 4, 5, 6, 8, 9, 10, 12]), n = a * g, d = b * g;
      var pf = 0;
      for (var f = 2; f < g; f++) if (g % f === 0) { pf = f; break; }
      var ok = rt(a, b), orig = rt(n, d), rev = rt(b, a);
      var opts = [
        { text: ok, ok: true },
        { text: rev, ok: false, trap: 'The order changed. The ratio ' + orig + ' has ' + n + ' first, so the simplest form has ' + a + ' first.' },
        { text: orig, ok: false, trap: 'That is the ratio you started with. It can still be made smaller by dividing both parts by ' + g + '.' }
      ];
      if (pf) opts.push({ text: rt(n / pf, d / pf), ok: false, trap: 'That is closer, but both parts still divide by ' + (g / pf) + '. Keep dividing until only 1 goes into both.' });
      var teach = [
        x('We look for a number that goes into both ' + n + ' and ' + d + '.', [orig, 'simplify']),
        note('The biggest number that goes into both ' + n + ' and ' + d + ' is ' + g + '.', 'A number that fits both', [g + ' goes into ' + n + ' ' + a + ' times', g + ' goes into ' + d + ' ' + b + ' times']),
        x('Divide the first part. ' + n + ' ÷ ' + g + ' = ' + a + '.', n + ' ÷ ' + g + ' = ', [String(a), 'first part']),
        x('Divide the second part. ' + d + ' ÷ ' + g + ' = ' + b + '.', d + ' ÷ ' + g + ' = ', [String(b), 'second part']),
        x('Only 1 goes into both ' + a + ' and ' + b + '. So ' + ok + ' is the simplest form.', orig + ' = ', [ok, 'simplest'])
      ];
      return Q.choice({
        skill: 'Simplest form of a ratio', prompt: 'Which shows the ratio ' + orig + ' in simplest form?',
        options: opts,
        work: 'Divide both parts by ' + g + '. ' + n + ' ÷ ' + g + ' = ' + a + ' and ' + d + ' ÷ ' + g + ' = ' + b + '. The answer is ' + ok + '.',
        plain: 'Find the biggest number that goes into both parts. Divide both parts by it.',
        teach: teach
      });
    } },

    { id: 'oneunit', level: 3, name: 'Find one unit', make: function () {
      var a, b;
      do { a = R.int(2, 9); b = R.int(2, 9); } while (a === b || !coprime(a, b));
      var u = R.int(2, 9), ctx = R.pick(PAIRS), givenFirst = R.int(0, 1) === 1;
      var gN = givenFirst ? a : b, wN = givenFirst ? b : a, gName = givenFirst ? ctx[0] : ctx[1], wName = givenFirst ? ctx[1] : ctx[0];
      var given = gN * u, ans = wN * u;
      var add = wN + (given - gN);
      var traps = [T(String(u), 'That is the size of one unit, one box. The ' + wName + ' have ' + wN + ' boxes, so multiply ' + u + ' by ' + wN + '.'),
                   T(String(add), 'You added the same amount to both parts. In a ratio you multiply, so find one unit and multiply.')];
      if (wN * given === ans) traps.pop();
      var rowsA = [row(ctx[0], a, RED, ''), row(ctx[1], b, BLUE, '')];
      var rowsG = givenFirst ? [row(ctx[0], a, RED, '', String(given)), row(ctx[1], b, BLUE, '')] : [row(ctx[0], a, RED, ''), row(ctx[1], b, BLUE, '', String(given))];
      var rowsF = [row(ctx[0], a, RED, String(u), String(a * u)), row(ctx[1], b, BLUE, String(u), String(b * u))];
      return num({
        skill: 'Ratio, find one unit', prompt: 'The ratio of ' + ctx[0] + ' to ' + ctx[1] + ' is ' + rt(a, b) + '. There are ' + given + ' ' + gName + '. How many ' + wName + ' are there?',
        answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number', traps: traps,
        work: given + ' ÷ ' + gN + ' = ' + u + ' for one unit. Then ' + wN + ' × ' + u + ' = ' + ans + ' ' + wName + '.',
        plain: 'Draw a box for each part. Share what you know equally to find one box. Then count the boxes you need.',
        teach: [
          x('The ratio is ' + rt(a, b) + '. We know there are ' + given + ' ' + gName + '.', [rt(a, b), ctx[0] + ' to ' + ctx[1]]),
          bars('Draw ' + a + ' boxes for ' + ctx[0] + ' and ' + b + ' boxes for ' + ctx[1] + '.', rowsA),
          bars('The ' + gN + ' boxes for ' + gName + ' hold ' + given + '.', rowsG),
          x('Find one unit. ' + given + ' ÷ ' + gN + ' = ' + u + '.', given + ' ÷ ' + gN + ' = ', [String(u), 'one unit']),
          bars('Every box holds ' + u + '.', rowsF),
          x(wName + ' have ' + wN + ' boxes. ' + wN + ' × ' + u + ' = ' + ans + '.', wN + ' × ' + u + ' = ', [String(ans), wName])
        ]
      });
    } },

    { id: 'partwhole', level: 3, name: 'Ratio with the total given', make: function () {
      var a, b;
      do { a = R.int(1, 8); b = R.int(2, 9); } while (a === b || !coprime(a, b));
      var u = R.int(2, 9), tot = (a + b) * u, ctx = R.pick(PAIRS), second = R.int(0, 1) === 1;
      var wN = second ? b : a, oN = second ? a : b, wName = second ? ctx[1] : ctx[0];
      var ans = wN * u;
      var traps = [T(String(u), 'That is one unit. The ' + wName + ' have ' + wN + ' boxes, so multiply.'),
                   T(String(oN * u), 'That is the other group. The question asks about the ' + wName + '.')];
      if (tot % wN === 0 && tot / wN !== ans && tot / wN !== u && tot / wN !== oN * u) traps.push(T(String(tot / wN), 'You divided the total by only the ' + wName + ' boxes. Divide by all ' + (a + b) + ' boxes.'));
      return num({
        skill: 'Ratio, total given', prompt: 'The ratio of ' + ctx[0] + ' to ' + ctx[1] + ' is ' + rt(a, b) + '. There are ' + tot + ' altogether. How many ' + wName + ' are there?',
        answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number', traps: traps,
        work: a + ' + ' + b + ' = ' + (a + b) + ' boxes. ' + tot + ' ÷ ' + (a + b) + ' = ' + u + '. Then ' + wN + ' × ' + u + ' = ' + ans + '.',
        plain: 'Add up all the boxes. Share the total equally among them. Then count the boxes for the group you want.',
        teach: [
          x('The ratio is ' + rt(a, b) + ' and the total is ' + tot + '.', [rt(a, b), ctx[0] + ' to ' + ctx[1]], '  total ', [String(tot), 'altogether']),
          bars('Draw ' + a + ' boxes and ' + b + ' boxes. Together that is ' + a + ' + ' + b + ' = ' + (a + b) + ' boxes.', [row(ctx[0], a, RED, ''), row(ctx[1], b, BLUE, ''), mixRow('Total', a, b, RED, BLUE, String(tot))]),
          x('Find one unit. ' + tot + ' ÷ ' + (a + b) + ' = ' + u + '.', tot + ' ÷ ' + (a + b) + ' = ', [String(u), 'one unit']),
          bars('Every box holds ' + u + '.', [row(ctx[0], a, RED, String(u), String(a * u)), row(ctx[1], b, BLUE, String(u), String(b * u))]),
          x(wName + ' have ' + wN + ' boxes. ' + wN + ' × ' + u + ' = ' + ans + '.', wN + ' × ' + u + ' = ', [String(ans), wName])
        ]
      });
    } },

    { id: 'rate', level: 3, name: 'Unit rate', make: function () {
      var H = R.int(2, 9), q = R.int(3, 25), D = q * H;
      var c = R.pick([
        { p: 'A car travels ' + D + ' kilometers in ' + H + ' hours at the same speed. How many kilometers does it travel in 1 hour?', u: 'kilometers', t: 'hours' },
        { p: 'A machine makes ' + D + ' cookies in ' + H + ' minutes. How many cookies does it make in 1 minute?', u: 'cookies', t: 'minutes' },
        { p: 'Rinka reads ' + D + ' pages in ' + H + ' days, reading the same amount each day. How many pages does she read in 1 day?', u: 'pages', t: 'days' },
        { p: 'A tap fills ' + D + ' liters in ' + H + ' minutes. How many liters flow out in 1 minute?', u: 'liters', t: 'minutes' }
      ]);
      return num({
        skill: 'Unit rate', prompt: c.p, answer: q, keyboard: 'numeric', placeholder: 'Type a whole number',
        traps: [T(String(D * H), 'You multiplied. To find the amount for 1, share ' + D + ' equally into ' + H + ' ' + c.t + '. That is division.')],
        work: D + ' ÷ ' + H + ' = ' + q + '.',
        plain: 'Share the total equally among the boxes. What is in one box is the unit rate.',
        teach: [
          x('We know ' + D + ' ' + c.u + ' in ' + H + ' ' + c.t + '. We want the amount for 1.', [String(D), c.u], ' in ', [String(H), c.t]),
          bars('Draw ' + H + ' equal boxes, one for each of the ' + c.t + '. Together they hold ' + D + '.', [row(c.t, H, BLUE, '', String(D))]),
          x('Share equally. ' + D + ' ÷ ' + H + ' = ' + q + '.', D + ' ÷ ' + H + ' = ', [String(q), 'in one box']),
          bars('Every box holds ' + q + '.', [row(c.t, H, BLUE, String(q), String(D))]),
          x('So the unit rate is ' + q + ' ' + c.u + ' for every 1.', [String(q), 'unit rate'])
        ]
      });
    } },

    { id: 'rateuse', level: 4, name: 'Use a rate', make: function () {
      if (R.int(0, 1)) {
        var H = R.int(2, 6), q = R.int(3, 15), K = R.int(H + 2, 12), D = q * H, ans = q * K;
        var c = R.pick([['A tap fills', 'liters', 'minutes'], ['A machine makes', 'cups', 'minutes'], ['A cyclist rides', 'kilometers', 'hours']]);
        return num({
          skill: 'Use a unit rate', prompt: c[0] + ' ' + D + ' ' + c[1] + ' in ' + H + ' ' + c[2] + ' at a steady rate. How many ' + c[1] + ' in ' + K + ' ' + c[2] + '?',
          answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number',
          traps: [T(String(q), 'That is the amount for 1. We need ' + K + ' ' + c[2] + ', so multiply ' + q + ' by ' + K + '.'),
                  T(String(D + (K - H)), 'You added ' + (K - H) + ' to ' + D + '. Rates grow by multiplying. Find the amount for 1 first.')],
          work: D + ' ÷ ' + H + ' = ' + q + ' for 1. Then ' + q + ' × ' + K + ' = ' + ans + '.',
          plain: 'First find how much for one. Then multiply by the number you need.',
          teach: [
            x('We know ' + D + ' ' + c[1] + ' in ' + H + ' ' + c[2] + '. We want ' + K + ' ' + c[2] + '.', [String(D), c[1]], ' in ', [String(H), c[2]]),
            bars('Draw ' + H + ' boxes. Together they hold ' + D + '.', [row(c[2], H, BLUE, '', String(D))]),
            x('Find one unit. ' + D + ' ÷ ' + H + ' = ' + q + '.', D + ' ÷ ' + H + ' = ', [String(q), 'for 1']),
            bars('Now draw ' + K + ' boxes with ' + q + ' in each.', [row(c[2], K, GREEN, String(q), '?')]),
            x(K + ' boxes of ' + q + '. ' + K + ' × ' + q + ' = ' + ans + '.', K + ' × ' + q + ' = ', [String(ans), 'answer'])
          ]
        });
      }
      var H2 = R.int(2, 6), p = R.int(4, 25) * 10, K2 = R.int(H2 + 2, 10);
      if (p % 5 !== 0) p += 5;
      var tot = p * H2, ans2 = p * K2;
      var thing = R.pick(['pens', 'muffins', 'notebooks', 'apples']);
      return num({
        skill: 'Use a unit price', prompt: H2 + ' ' + thing + ' cost ' + money(tot) + '. All the ' + thing + ' have the same price. How many dollars do ' + K2 + ' ' + thing + ' cost?',
        answer: dec2(ans2), answerText: money(ans2), keyboard: 'decimal', placeholder: 'Like 9.60',
        traps: [T(dec2(p), 'That is the price of one. We need the price of ' + K2 + '.'),
                T(dec2(tot * K2), 'That is far too much. First find the price of one, then multiply by ' + K2 + '.')],
        work: money(tot) + ' ÷ ' + H2 + ' = ' + money(p) + ' for one. Then ' + K2 + ' × ' + money(p) + ' = ' + money(ans2) + '.',
        plain: 'Find the price of one by sharing equally. Then multiply by how many you want.',
        teach: [
          x(H2 + ' ' + thing + ' cost ' + money(tot) + '. We want the cost of ' + K2 + '.', [money(tot), H2 + ' ' + thing]),
          bars('Draw ' + H2 + ' equal boxes. Together they cost ' + money(tot) + '.', [row(thing, H2, AMBER, '', money(tot))]),
          x('Find the price of one. ' + tot + ' cents ÷ ' + H2 + ' = ' + p + ' cents, which is ' + money(p) + '.', tot + ' ÷ ' + H2 + ' = ', [p + ' cents', money(p)]),
          bars('Now draw ' + K2 + ' boxes of ' + money(p) + '.', [row(thing, K2, GREEN, money(p), '?')]),
          x(K2 + ' × ' + p + ' = ' + ans2 + ' cents. That is ' + money(ans2) + '.', K2 + ' × ' + p + ' = ', [money(ans2), 'answer'])
        ]
      });
    } },

    { id: 'difference', level: 4, name: 'Ratio with the difference given', make: function () {
      var a, b;
      do { a = R.int(3, 9); b = R.int(1, a - 1); } while (!coprime(a, b));
      var u = R.int(2, 9), d = a - b, diff = d * u, pp = R.pick(PEOPLE), th = R.pick(THINGS);
      var big = R.int(0, 1) === 1;
      var wN = big ? a : b, oN = big ? b : a, wName = big ? pp[0] : pp[1];
      var ans = wN * u;
      return num({
        skill: 'Ratio, difference given', prompt: pp[0] + ' and ' + pp[1] + ' have ' + th + ' in the ratio ' + rt(a, b) + '. ' + pp[0] + ' has ' + diff + ' more ' + th + ' than ' + pp[1] + '. How many ' + th + ' does ' + wName + ' have?',
        answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number',
        traps: [T(String(diff), 'That is how many more ' + pp[0] + ' has. It is ' + d + ' boxes, not one box. Divide to find one unit.'),
                T(String(u), 'That is one unit. ' + wName + ' has ' + wN + ' boxes, so multiply ' + u + ' by ' + wN + '.'),
                T(String(oN * u), 'That is what ' + (big ? pp[1] : pp[0]) + ' has. The question asks about ' + wName + '.')],
        work: a + ' − ' + b + ' = ' + d + ' boxes = ' + diff + '. One unit is ' + diff + ' ÷ ' + d + ' = ' + u + '. Then ' + wN + ' × ' + u + ' = ' + ans + '.',
        plain: 'The extra boxes on the longer bar are the difference. Share the difference among those boxes to find one box.',
        teach: [
          x('The ratio is ' + rt(a, b) + '. ' + pp[0] + ' has ' + diff + ' more.', [rt(a, b), pp[0] + ' to ' + pp[1]], '  and  ', [String(diff) + ' more', 'difference']),
          bars('Draw ' + a + ' boxes for ' + pp[0] + ' and ' + b + ' boxes for ' + pp[1] + '.', [row(pp[0], a, RED, ''), row(pp[1], b, BLUE, '')]),
          bars(pp[0] + ' has ' + d + ' extra boxes. ' + a + ' − ' + b + ' = ' + d + '. These are the ' + diff + ' more.', [mixRow(pp[0], b, d, RED, AMBER, diff + ' more'), row(pp[1], b, BLUE, '')]),
          x('Find one unit. ' + diff + ' ÷ ' + d + ' = ' + u + '.', diff + ' ÷ ' + d + ' = ', [String(u), 'one unit']),
          bars('Every box holds ' + u + '.', [row(pp[0], a, RED, String(u), String(a * u)), row(pp[1], b, BLUE, String(u), String(b * u))]),
          x(wName + ' has ' + wN + ' boxes. ' + wN + ' × ' + u + ' = ' + ans + '.', wN + ' × ' + u + ' = ', [String(ans), th])
        ]
      });
    } },

    { id: 'threepart', level: 5, name: 'Ratio with three parts', make: function () {
      var a, b, c;
      do { a = R.int(1, 6); b = R.int(1, 6); c = R.int(1, 6); } while (a === b || b === c || a === c);
      var u = R.int(2, 9), tot = (a + b + c) * u;
      var names = ['red', 'blue', 'green'], cls = [RED, BLUE, GREEN], parts = [a, b, c];
      var i = R.int(0, 2), ans = parts[i] * u;
      var others = [0, 1, 2].filter(function (k) { return k !== i; });
      var traps = [T(String(u), 'That is one unit. There are ' + parts[i] + ' boxes of ' + names[i] + ', so multiply.'),
                   T(String(parts[others[0]] * u), 'That is the number of ' + names[others[0]] + ' counters. The question asks for ' + names[i] + '.')];
      if (tot % parts[i] === 0 && tot / parts[i] !== ans && tot / parts[i] !== u) traps.push(T(String(tot / parts[i]), 'You divided by only the ' + names[i] + ' boxes. Divide the total by all ' + (a + b + c) + ' boxes.'));
      return num({
        skill: 'Ratio with three parts', prompt: 'Red, blue and green counters are in the ratio ' + rt(a, b, c) + '. There are ' + tot + ' counters in all. How many ' + names[i] + ' counters are there?',
        answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number', traps: traps,
        work: a + ' + ' + b + ' + ' + c + ' = ' + (a + b + c) + ' boxes. ' + tot + ' ÷ ' + (a + b + c) + ' = ' + u + '. Then ' + parts[i] + ' × ' + u + ' = ' + ans + '.',
        plain: 'Add up all three parts to count the boxes. Share the total equally. Then take the boxes for the color you want.',
        teach: [
          x('The ratio is ' + rt(a, b, c) + ' and there are ' + tot + ' counters.', [rt(a, b, c), 'red, blue, green'], '  total ', [String(tot), 'all']),
          bars('Draw ' + a + ' boxes for red, ' + b + ' for blue and ' + c + ' for green.', [row('Red', a, RED, ''), row('Blue', b, BLUE, ''), row('Green', c, GREEN, '')]),
          x('All the boxes together make ' + a + ' + ' + b + ' + ' + c + ' = ' + (a + b + c) + '. They hold ' + tot + '.', String(a + b + c) + ' boxes = ', [String(tot), 'counters']),
          x('Find one unit. ' + tot + ' ÷ ' + (a + b + c) + ' = ' + u + '.', tot + ' ÷ ' + (a + b + c) + ' = ', [String(u), 'one unit']),
          bars('Every box holds ' + u + '.', [row('Red', a, RED, String(u), String(a * u)), row('Blue', b, BLUE, String(u), String(b * u)), row('Green', c, GREEN, String(u), String(c * u))]),
          x(names[i] + ' has ' + parts[i] + ' boxes. ' + parts[i] + ' × ' + u + ' = ' + ans + '.', parts[i] + ' × ' + u + ' = ', [String(ans), names[i] + ' counters'])
        ]
      });
    } },

    { id: 'unchanged', level: 5, name: 'Before and after, one part unchanged', make: function () {
      var a, b, c;
      do { a = R.int(1, 7); c = R.int(a + 1, 9); b = R.int(3, 9); } while (a === b || c === b || !coprime(a, b) || !coprime(c, b) || c - a > 4);
      var d = c - a, u = R.int(2, 9), k = d * u, pp = R.pick(PEOPLE), th = R.pick(THINGS);
      var askB = R.int(0, 1) === 1;
      var ans = askB ? b * u : c * u;
      var q = askB ? 'How many ' + th + ' does ' + pp[1] + ' have?' : 'How many ' + th + ' does ' + pp[0] + ' have after getting more?';
      var traps = [T(String(u), 'That is one unit. Multiply it by the number of boxes you need.'),
                   T(String(k), 'That is how many ' + pp[0] + ' was given. It is ' + d + ' box' + (d === 1 ? '' : 'es') + ', not one box.')];
      if (askB) traps.push(T(String(a * u), 'That is what ' + pp[0] + ' had before. The question asks about ' + pp[1] + '.'));
      else traps.push(T(String(a * u), 'That is what ' + pp[0] + ' had before the gift. The question asks for after.'));
      return num({
        skill: 'Before and after, one part unchanged', prompt: pp[0] + ' and ' + pp[1] + ' have ' + th + ' in the ratio ' + rt(a, b) + '. ' + pp[0] + ' is given ' + k + ' more ' + th + '. Now the ratio is ' + rt(c, b) + '. ' + q,
        answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number', traps: traps,
        work: pp[1] + ' did not change, so the ' + d + ' extra boxes are ' + k + '. One unit is ' + k + ' ÷ ' + d + ' = ' + u + '. Then ' + (askB ? b : c) + ' × ' + u + ' = ' + ans + '.',
        plain: 'Draw before and after. The part that did not change keeps the same boxes. The extra boxes are what was given.',
        teach: [
          x('Before the ratio is ' + rt(a, b) + '. After it is ' + rt(c, b) + '.', [rt(a, b), 'before'], '   ', [rt(c, b), 'after']),
          bars('Before, ' + pp[0] + ' has ' + a + ' boxes and ' + pp[1] + ' has ' + b + '.', [row(pp[0], a, RED, ''), row(pp[1], b, BLUE, '')]),
          bars('After, ' + pp[0] + ' has ' + c + ' boxes and ' + pp[1] + ' still has ' + b + '. The gold boxes are new.', [mixRow(pp[0], a, d, RED, AMBER, ''), row(pp[1], b, BLUE, '')]),
          x(d + ' new box' + (d === 1 ? '' : 'es') + ' are the ' + k + ' ' + th + ' that were given. So ' + k + ' ÷ ' + d + ' = ' + u + '.', k + ' ÷ ' + d + ' = ', [String(u), 'one unit']),
          bars('Every box holds ' + u + '.', [row(pp[0] + ' after', c, RED, String(u), String(c * u)), row(pp[1], b, BLUE, String(u), String(b * u))]),
          x((askB ? pp[1] + ' has ' + b : pp[0] + ' has ' + c) + ' boxes. ' + (askB ? b : c) + ' × ' + u + ' = ' + ans + '.', (askB ? b : c) + ' × ' + u + ' = ', [String(ans), th])
        ]
      });
    } },

    { id: 'totalsame', level: 6, name: 'Before and after, total unchanged', make: function () {
      var a, b, c, dd, x1;
      var t;
      for (t = 0; t < 200; t++) {
        a = R.int(1, 6); b = R.int(3, 8); x1 = R.int(1, 3); c = a + x1; dd = b - x1;
        if (dd >= 1 && a !== b && c !== dd && coprime(a, b) && coprime(c, dd)) break;
      }
      var u = R.int(2, 9), k = x1 * u, tot = (a + b) * u, pp = R.pick(PEOPLE), th = R.pick(THINGS);
      var askTot = R.int(0, 1) === 1;
      var ans = askTot ? tot : b * u;
      var q = askTot ? 'How many ' + th + ' do they have altogether?' : 'How many ' + th + ' did ' + pp[1] + ' have at first?';
      var traps = [T(String(u), 'That is one unit. Multiply it by the number of boxes you need.'),
                   T(String(k), 'That is how many ' + pp[1] + ' gave away. It is ' + x1 + ' box' + (x1 === 1 ? '' : 'es') + ', not one box.')];
      if (askTot) traps.push(T(String(b * u), 'That is only what ' + pp[1] + ' had at first. The question asks for the total of both.'));
      else traps.push(T(String(tot), 'That is the total of both. The question asks about ' + pp[1] + ' only.'));
      return num({
        skill: 'Before and after, total unchanged', prompt: pp[0] + ' and ' + pp[1] + ' have ' + th + ' in the ratio ' + rt(a, b) + '. ' + pp[1] + ' gives ' + pp[0] + ' ' + k + ' ' + th + '. Now the ratio is ' + rt(c, dd) + '. ' + q,
        answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number', traps: traps,
        work: 'The total stays the same, ' + (a + b) + ' boxes. ' + pp[0] + ' gains ' + x1 + ' box' + (x1 === 1 ? '' : 'es') + ', which is ' + k + '. One unit is ' + u + '. ' + (askTot ? (a + b) + ' × ' + u + ' = ' + tot + '.' : b + ' × ' + u + ' = ' + ans + '.'),
        plain: 'What one person gains, the other loses. Both bars make the same number of boxes. The boxes that moved hold the amount that was given.',
        teach: [
          x('Before the ratio is ' + rt(a, b) + '. After it is ' + rt(c, dd) + '.', [rt(a, b), 'before'], '   ', [rt(c, dd), 'after']),
          bars('Before, ' + a + ' + ' + b + ' = ' + (a + b) + ' boxes in all.', [row(pp[0], a, RED, ''), row(pp[1], b, BLUE, '')]),
          bars('After, ' + c + ' + ' + dd + ' = ' + (a + b) + ' boxes in all, so the total did not change.', [mixRow(pp[0], a, x1, RED, AMBER, ''), row(pp[1], dd, BLUE, '')]),
          x(pp[0] + ' gained ' + x1 + ' box' + (x1 === 1 ? '' : 'es') + '. That is ' + k + ' ' + th + '. So ' + k + ' ÷ ' + x1 + ' = ' + u + '.', k + ' ÷ ' + x1 + ' = ', [String(u), 'one unit']),
          bars('Every box holds ' + u + '. These are the amounts before.', [row(pp[0], a, RED, String(u), String(a * u)), row(pp[1], b, BLUE, String(u), String(b * u))]),
          askTot ? x('All ' + (a + b) + ' boxes. ' + (a + b) + ' × ' + u + ' = ' + tot + '.', (a + b) + ' × ' + u + ' = ', [String(tot), 'altogether']) : x(pp[1] + ' had ' + b + ' boxes at first. ' + b + ' × ' + u + ' = ' + ans + '.', b + ' × ' + u + ' = ', [String(ans), th])
        ]
      });
    } }
  ]);
})();
