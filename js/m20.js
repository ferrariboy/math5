/* Module 20: Making Change. Lessons, vocabulary and question skills. */
(function () {
  'use strict';
  var B = window.Bank, R = B.R, S = B.s, Q = B.q, T = Q.trap;
  var x = S.x, note = S.note, bars = S.bars, row = S.row, groups = S.groups, lines = S.lines;

  /* ---------- Helpers: all money is worked in cents so there are no floating point slips ---------- */
  function m(c) { return (c / 100).toFixed(2); }
  function usd(c) { return '$' + m(c); }
  function val(s) { var q = String(s).match(/^(\d+)\/(\d+)$/); return q ? q[1] / q[2] : parseFloat(s); }
  /* Q.num with the trap list cleaned: no trap may equal the answer, repeat, or be a bad number. */
  function N(o) {
    var a = val(o.answer), seen = {};
    o.traps = (o.traps || []).filter(function (t) {
      var s = String(t.value), v = val(s);
      if (!/^\d+(\.\d+)?$|^\d+\/\d+$/.test(s) || !isFinite(v) || v < 0 || Math.abs(v - a) < 1e-9 || seen[v]) return false;
      seen[v] = true; t.value = s; return true;
    });
    o.keyboard = o.keyboard || 'numeric';
    return Q.num(o);
  }
  function pad(s, n) { s = String(s); while (s.length < n) s += ' '; return s; }
  function lpad(s, n) { s = String(s); while (s.length < n) s = ' ' + s; return s; }
  function rnd5(c) { var r = c % 5; return r < 3 ? c - r : c + (5 - r); }
  /* A price that is a multiple of 5 cents, between lo and hi cents. */
  function p5(lo, hi) { return 5 * R.int(Math.ceil(lo / 5), Math.floor(hi / 5)); }
  function sum(a) { return a.reduce(function (p, c) { return p + c; }, 0); }
  var ITEMS = ['a notebook', 'a sandwich', 'a toy car', 'a comic book', 'a bottle of juice', 'a pencil case', 'a puzzle', 'a hockey card pack', 'a muffin', 'a bag of apples', 'a kite', 'a set of markers'];
  function two() { var a = R.int(0, ITEMS.length - 1), b = (a + R.int(1, ITEMS.length - 1)) % ITEMS.length; return [ITEMS[a], ITEMS[b]]; }
  /* Vertical addition drawn with text. */
  function vadd(cs) {
    var tot = sum(cs), w = m(tot).length + 1, out = [];
    cs.forEach(function (c, i) { out.push((i === cs.length - 1 ? '+ ' : '  ') + lpad(m(c), w)); });
    out.push('  ' + pad('', w).replace(/ /g, '_'));
    out.push('  ' + lpad(m(tot), w));
    return out;
  }
  /* Steps for counting up from price to paid. */
  function countUp(priceC, paidC) {
    var cur = priceC, hops = [], t;
    if (cur % 10 !== 0) { t = cur + 5; hops.push([cur, t]); cur = t; }
    if (cur % 100 !== 0 && cur < paidC) { t = Math.ceil(cur / 100) * 100; if (t > paidC) t = paidC; hops.push([cur, t]); cur = t; }
    if (cur < paidC) hops.push([cur, paidC]);
    var st = [x('Start at the price, ' + usd(priceC) + '. Count up to the money you paid, ' + usd(paidC) + '. The hops are the change.', [usd(priceC), 'start'], ' up to ', [usd(paidC), 'paid'])];
    hops.forEach(function (h, i) {
      st.push(x('Hop ' + (i + 1) + ' goes from ' + usd(h[0]) + ' up to ' + usd(h[1]) + '. That hop is ' + usd(h[1] - h[0]) + '.', usd(h[0]) + ' + ', [usd(h[1] - h[0]), 'hop ' + (i + 1)], ' = ' + usd(h[1])));
    });
    st.push(x('Add the hops to get the change: ' + hops.map(function (h) { return usd(h[1] - h[0]); }).join(' + ') + ' = ' + usd(paidC - priceC) + '.', hops.map(function (h) { return usd(h[1] - h[0]); }).join(' + ') + ' = ', [usd(paidC - priceC), 'change']));
    return st;
  }
  function checkStep(priceC, chC, paidC) {
    return x('Check by adding. The price plus the change should equal what you paid.', usd(priceC) + ' + ' + usd(chC) + ' = ', [usd(paidC), 'paid']);
  }

  /* ---------- Vocabulary ---------- */
  window.MATH_VOCAB[20] = [
    { w: 'Change', m: 'The money you get back when you pay with more than the price.' },
    { w: 'Loonie and toonie', m: 'A loonie is a coin worth 1 dollar. A toonie is a coin worth 2 dollars.' },
    { w: 'Counting up', m: 'Making change by starting at the price and adding on until you reach the money you paid.' },
    { w: 'Rounding to 5 cents', m: 'Canada has no penny. A cash total is rounded to the nearest 5 cents.' },
    { w: 'Total', m: 'All the prices added together. It is what you owe.' },
    { w: 'Price per item', m: 'The cost of just one item. Divide the total price by the number of items.' },
    { w: 'Sales tax', m: 'Extra money added to the price of things you buy. In this module we use 5 percent.' },
    { w: 'Decimal point', m: 'The dot in a money amount. It separates the dollars on the left from the cents on the right.' }
  ];

  /* ---------- Lessons ---------- */
  window.MATH_LESSONS[20] = [
    { title: '1. Canadian coins and bills',
      explain: [
        'Canada uses coins for small amounts and bills for bigger amounts. Each one has a value you need to know.',
        'The coins are the nickel, the dime, the quarter, the loonie and the toonie. The bills are 5, 10, 20, 50 and 100 dollars.',
        'A dollar is 100 cents. We write money with a decimal point. $1.25 means 1 dollar and 25 cents.'
      ],
      rule: 'Know each value. 100 cents make 1 dollar.',
      mistake: 'A dime is worth more than a nickel, even though the nickel is a bit bigger. Look at the number, not the size.',
      steps: [
        lines('Here are the coins and what each one is worth.', ['Nickel    5 cents    0.05', 'Dime      10 cents   0.10', 'Quarter   25 cents   0.25', 'Loonie    1 dollar   1.00', 'Toonie    2 dollars  2.00'], 0),
        lines('And here are the bills.', ['$5   $10   $20   $50   $100'], 0),
        x('100 cents make 1 dollar. So 4 quarters make a dollar.', '4 × 0.25 = ', ['1.00', 'one dollar']),
        x('The decimal point splits dollars from cents. In $3.45 the 3 is dollars and the 45 is cents.', ['3', 'dollars'], '.', ['45', 'cents']),
        note('Canada stopped making pennies. Cash totals are rounded to the nearest 5 cents.', 'No pennies', ['The smallest coin is the nickel', 'We round cash totals to 5 cents'])
      ] },

    { title: '2. Counting coins',
      explain: [
        'To count a pile of coins, start with the biggest coins and finish with the smallest. Count out loud as you go.',
        'Add each group to the running total. Toonies first, then loonies, then quarters, then dimes, then nickels.',
        'Write the total with a decimal point. Two digits after the point show the cents.'
      ],
      rule: 'Biggest coins first. Keep a running total.',
      mistake: 'Do not forget a coin group. Check each type off as you count it.',
      steps: [
        note('Rinka has 1 toonie, 2 loonies, 3 quarters and 1 dime.', 'The pile', ['1 toonie', '2 loonies', '3 quarters', '1 dime']),
        x('Start with the toonie. 1 toonie is 2 dollars.', '1 × 2.00 = ', ['2.00', 'toonie']),
        x('Add the loonies. 2 loonies are 2 dollars. 2.00 + 2.00 = 4.00.', '2.00 + 2.00 = ', ['4.00', 'so far']),
        x('Add the quarters. 3 quarters are 75 cents. 4.00 + 0.75 = 4.75.', '4.00 + 0.75 = ', ['4.75', 'so far']),
        x('Add the dime. 4.75 + 0.10 = 4.85.', '4.75 + 0.10 = ', ['4.85', 'total']),
        x('Rinka has 4 dollars and 85 cents.', ['$4.85', 'answer'])
      ] },

    { title: '3. Adding prices with decimals',
      explain: [
        'To add prices, line up the decimal points. Then add the cents column first, then the dollars column.',
        'If the cents add to 100 or more, carry 1 to the dollars, just like carrying in any addition.',
        'Always write two digits after the decimal point for money. Write 3.50, not 3.5.'
      ],
      rule: 'Line up the decimal points. Add cents, then dollars.',
      mistake: 'If you do not line up the points, you will add cents to dollars. Keep the dots in a straight line.',
      steps: [
        x('Add $3.45 and $1.80. First write them with the decimal points lined up.', ['$3.45', 'first'], ' + ', ['$1.80', 'second']),
        lines('Line up the points, one price under the other.', vadd([345, 180]).slice(0, 2), 0),
        x('Add the cents. 45 + 80 = 125 cents. That is 1 dollar and 25 cents. Write 25 and carry 1.', '45 + 80 = ', ['125', 'cents']),
        x('Add the dollars. 3 + 1 = 4. Then add the carried 1. That makes 5.', '3 + 1 + 1 = ', ['5', 'dollars']),
        lines('Here is the finished sum.', vadd([345, 180]), 3),
        x('The total is $5.25.', '$3.45 + $1.80 = ', ['$5.25', 'total'])
      ] },

    { title: '4. Rounding to the nearest 5 cents',
      explain: [
        'There are no pennies in Canada. When you pay with cash, the total is rounded to the nearest 5 cents.',
        'Look at the last digit of the total. If it is 1 or 2, round down. If it is 3 or 4, round up to the next 5. If it is 6 or 7, round down to the 5. If it is 8 or 9, round up to the next 10.',
        'Totals that already end in 0 or 5 do not change. This rounding only happens for cash.'
      ],
      rule: 'Last digit 1, 2, 6, 7 round down. Last digit 3, 4, 8, 9 round up.',
      mistake: 'Do not round to the nearest dollar. We only round to the nearest 5 cents.',
      steps: [
        x('A bill comes to $7.83. Paying with cash, we round to the nearest 5 cents.', ['$7.83', 'cash total']),
        lines('Put the total on a number line. The nearest 5 cent marks are 7.80 and 7.85.', ['7.80   7.81   7.82   7.83   7.84   7.85', '                       ^ here'], 1),
        x('7.83 is 3 cents above 7.80. It is only 2 cents below 7.85.', ['3 cents', 'from 7.80'], ' and ', ['2 cents', 'from 7.85']),
        x('7.83 is closer to 7.85. So we round up.', '$7.83 rounds to ', ['$7.85', 'answer']),
        x('Try $4.62. The nearest marks are 4.60 and 4.65. 4.62 is closer to 4.60. Round down.', '$4.62 rounds to ', ['$4.60', 'answer']),
        note('A quick rule using the last digit.', 'Last digit rule', ['1 or 2: round down to 0', '3 or 4: round up to 5', '6 or 7: round down to 5', '8 or 9: round up to 10'])
      ] },

    { title: '5. Making change by counting up',
      explain: [
        'Change is the money the cashier gives back. The easy way to find it is to count up. Start at the price and add small hops until you reach the money you gave.',
        'First hop to the next 10 cents. Then hop to the next dollar. Then hop by dollars to the bill you paid with.',
        'Add the hops. The total of the hops is the change.'
      ],
      rule: 'Start at the price. Hop up to what you paid. Add the hops.',
      mistake: 'Do not add the price and the payment together. Change is the gap between them.',
      steps: [
        x('A toy costs $3.65. Rinka pays with a $5 bill. Count up from 3.65.', ['$3.65', 'price'], ' up to ', ['$5.00', 'paid']),
        x('Hop to the next 10 cents. 3.65 + 0.05 = 3.70.', '3.65 + ', ['0.05', 'hop 1'], ' = 3.70'),
        x('Hop to the next dollar. 3.70 + 0.30 = 4.00.', '3.70 + ', ['0.30', 'hop 2'], ' = 4.00'),
        x('Hop to the bill. 4.00 + 1.00 = 5.00.', '4.00 + ', ['1.00', 'hop 3'], ' = 5.00'),
        x('Add the hops. 0.05 + 0.30 + 1.00 = 1.35.', '0.05 + 0.30 + 1.00 = ', ['$1.35', 'change']),
        x('Check. 3.65 + 1.35 = 5.00.', '3.65 + 1.35 = ', ['5.00', 'matches'])
      ] },

    { title: '6. Change from $5',
      explain: [
        'Many small purchases are paid with a $5 bill. The price is less than 5 dollars, so change is the gap up to 5.',
        'Count up from the price. Or subtract. Both give the same answer. Counting up is quick in your head.',
        'Give the answer with two digits after the decimal point.'
      ],
      rule: 'Change = 5.00 minus the price. Or count up from the price to 5.',
      mistake: 'Do not line up the numbers wrongly when you subtract. Write 5.00 so the decimal points match.',
      steps: [
        x('A muffin costs $2.35. You pay with a $5 bill. How much change?', ['$2.35', 'price'], ' from ', ['$5.00', 'bill']),
        x('Count up. 2.35 to 2.40 is 0.05.', '2.35 + ', ['0.05', 'hop 1'], ' = 2.40'),
        x('2.40 to 3.00 is 0.60.', '2.40 + ', ['0.60', 'hop 2'], ' = 3.00'),
        x('3.00 to 5.00 is 2.00.', '3.00 + ', ['2.00', 'hop 3'], ' = 5.00'),
        x('Add the hops. 0.05 + 0.60 + 2.00 = 2.65.', '0.05 + 0.60 + 2.00 = ', ['$2.65', 'change']),
        lines('Check by subtracting. 5.00 minus 2.35.', ['  5.00', '− 2.35', '______', '  2.65'], 3)
      ] },

    { title: '7. Change from $10 and $20',
      explain: [
        'The same counting up works for bigger bills. Hop to the next 10 cents, then the next dollar, then by dollars up to the bill.',
        'When the bill is big, you can hop to the next 5 dollars or 10 dollars too. Choose hops that are easy.',
        'Always check that the price plus the change equals the bill.'
      ],
      rule: 'Hop to the next 10 cents, then the next dollar, then up to the bill.',
      mistake: 'Do not forget the cents. $12.35 is not the same as $12.',
      steps: [
        x('A book costs $12.35. You pay with a $20 bill.', ['$12.35', 'price'], ' from ', ['$20.00', 'bill']),
        x('Hop to the next 10 cents. 12.35 + 0.05 = 12.40.', '12.35 + ', ['0.05', 'hop 1'], ' = 12.40'),
        x('Hop to the next dollar. 12.40 + 0.60 = 13.00.', '12.40 + ', ['0.60', 'hop 2'], ' = 13.00'),
        x('Hop to the bill. 13.00 + 7.00 = 20.00.', '13.00 + ', ['7.00', 'hop 3'], ' = 20.00'),
        x('Add the hops. 0.05 + 0.60 + 7.00 = 7.65.', '0.05 + 0.60 + 7.00 = ', ['$7.65', 'change']),
        x('Check. 12.35 + 7.65 = 20.00.', '12.35 + 7.65 = ', ['20.00', 'matches'])
      ] },

    { title: '8. Two step shopping',
      explain: [
        'Many problems need two steps. First add the prices to find the total. Then find the change from the total.',
        'Draw a bar to help. The whole bar is the money you paid. One part is the total and the other part is the change.',
        'Do one step at a time and write each answer down.'
      ],
      rule: 'Step 1: add the prices. Step 2: paid minus total is the change.',
      mistake: 'Do not find the change from only one price. Add all the items first.',
      steps: [
        note('Sam buys a sandwich for $6.50 and a juice for $2.25. He pays with a $10 bill.', 'The problem', ['Sandwich $6.50', 'Juice $2.25', 'Paid $10.00']),
        lines('Step one. Add the two prices.', vadd([650, 225]), 3),
        x('The total is $8.75.', '6.50 + 2.25 = ', ['$8.75', 'total']),
        bars('The whole bar is the $10 he paid. The total takes up most of it.', [row('Paid 10.00', 10, 'bg-sky-400', ''), row('Total 8.75', 9, 'bg-indigo-400', '')]),
        x('Step two. Count up from 8.75 to 10. Hop 1.25.', '8.75 + ', ['1.25', 'hop'], ' = 10.00'),
        x('Sam gets $1.25 in change.', ['$1.25', 'change'])
      ] },

    { title: '9. Many items and price per item',
      explain: [
        'If you buy several items at the same price, multiply. 4 muffins at $1.75 each cost 4 × $1.75.',
        'Do the dollars and the cents separately, then add. 4 × 1 = 4 dollars. 4 × 0.75 = 3 dollars. Together 7 dollars.',
        'To find the price of one item, divide. If 5 pens cost $7.50, one pen costs 7.50 ÷ 5. It helps to think in cents. 750 cents ÷ 5 = 150 cents.'
      ],
      rule: 'Many items: multiply. Price of one: divide the total by the number of items.',
      mistake: 'Do not divide when you should multiply. If you know the price of one and want more, multiply.',
      steps: [
        x('4 muffins cost $1.75 each. How much for all 4?', ['4', 'muffins'], ' × ', ['$1.75', 'each']),
        x('Split the price. 1.75 is 1 dollar and 75 cents. 4 × 1 = 4.', '4 × 1.00 = ', ['4.00', 'dollars']),
        x('Now the cents. 4 × 0.75 = 3.00.', '4 × 0.75 = ', ['3.00', 'cents part']),
        x('Add them. 4.00 + 3.00 = 7.00.', '4.00 + 3.00 = ', ['$7.00', 'total']),
        x('Now go the other way. 5 pens cost $7.50. Change to cents. 750 cents.', '$7.50 = ', ['750', 'cents']),
        x('Divide by 5. 750 ÷ 5 = 150 cents. That is $1.50 for one pen.', '750 ÷ 5 = ', ['150', 'cents each'])
      ] },

    { title: '10. Sales tax',
      explain: [
        'Sales tax is extra money added at the till. In these questions the tax is 5 percent. That means 5 cents for every dollar.',
        'A quick way is to find 10 percent first. 10 percent is one tenth, so divide the price by 10. Then 5 percent is half of that.',
        'Add the tax to the price to get the total you pay.'
      ],
      rule: '5% is half of 10%. Total = price + tax.',
      mistake: 'Do not stop at the tax. The tax is only the extra. Add it to the price.',
      steps: [
        x('A jacket costs $40. The sales tax is 5 percent. First find 10 percent.', ['$40', 'price'], ' ÷ 10 = ', ['$4.00', '10%']),
        x('5 percent is half of 10 percent. Half of 4.00 is 2.00.', '4.00 ÷ 2 = ', ['$2.00', '5% tax']),
        x('The tax is $2.00. Now add it to the price.', '$40.00 + $2.00 = ', ['$42.00', 'total']),
        x('Try $30. 10 percent is 3.00. 5 percent is half, so 1.50.', '30.00 ÷ 10 = 3.00, half = ', ['$1.50', '5% tax']),
        x('The total for $30 is 30.00 + 1.50 = 31.50.', '$30.00 + $1.50 = ', ['$31.50', 'total'])
      ] },

    { title: '11. Putting it all together',
      explain: [
        'A real shopping trip can need every skill. Find the tax, add it to the price, then find the change.',
        'If you pay with cash, round the total to the nearest 5 cents before you find the change.',
        'Work in small steps and check that your change is smaller than the bill you paid with.'
      ],
      rule: 'Price, then tax, then total, then change. Round for cash.',
      mistake: 'Do not forget the tax when the problem mentions it. Change comes from the total with tax.',
      steps: [
        note('Mia buys a game for $20. Tax is 5 percent. She pays with a $50 bill.', 'The problem', ['Price $20.00', 'Tax 5 percent', 'Paid $50.00']),
        x('Step one. Find 10 percent of $20. That is $2.00. Half of it is $1.00.', '20.00 ÷ 10 = 2.00, half = ', ['$1.00', 'tax']),
        x('Step two. Add the tax. 20.00 + 1.00 = 21.00.', '$20.00 + $1.00 = ', ['$21.00', 'total']),
        x('Step three. Count up from 21.00 to 50.00. Hop to 30.00 is 9.00.', '21.00 + ', ['9.00', 'hop 1'], ' = 30.00'),
        x('Then 30.00 to 50.00 is 20.00.', '30.00 + ', ['20.00', 'hop 2'], ' = 50.00'),
        x('Add the hops. 9.00 + 20.00 = 29.00. Mia gets $29.00 in change.', '9.00 + 20.00 = ', ['$29.00', 'change'])
      ] }
  ];

  /* ---------- Question skills ---------- */
  B.register(20, [

    { id: 'coinsum', level: 1, name: 'Count coins and bills', make: function () {
      var typ = R.int(0, 1), parts, names, vals, unit;
      if (typ === 0) {
        names = ['quarters', 'dimes', 'nickels']; vals = [25, 10, 5];
        parts = [R.int(1, 6), R.int(1, 5), R.int(0, 4)];
      } else {
        names = ['toonies', 'loonies', 'quarters', 'dimes']; vals = [200, 100, 25, 10];
        parts = [R.int(1, 3), R.int(1, 3), R.int(0, 3), R.int(0, 2)];
      }
      var items = [], tot = 0, st = [];
      parts.forEach(function (n, i) { if (n > 0) { items.push([n, names[i], vals[i]]); tot += n * vals[i]; } });
      var run = 0;
      var desc = items.map(function (it) { return it[0] + ' ' + (it[0] === 1 ? it[1].replace(/ies$/, 'ie').replace(/s$/, '') : it[1]); }).join(', ').replace(/, ([^,]*)$/, ' and $1');
      st.push(lines('List each coin group and what it is worth. The coins go biggest to smallest.', items.map(function (it) { return pad(it[0] + ' ' + it[1], 12) + usd(it[0] * it[2]); }), 0));
      items.forEach(function (it, i) {
        if (i === 0) { run = it[0] * it[2]; st.push(x('Start with the ' + it[1] + '. ' + it[0] + ' × ' + usd(it[2]) + ' = ' + usd(run) + '.', it[0] + ' × ' + usd(it[2]) + ' = ', [usd(run), 'so far'])); }
        else { st.push(x('Add the ' + it[1] + '. ' + usd(run) + ' + ' + usd(it[0] * it[2]) + ' = ' + usd(run + it[0] * it[2]) + '.', usd(run) + ' + ' + usd(it[0] * it[2]) + ' = ', [usd(run + it[0] * it[2]), i === items.length - 1 ? 'total' : 'so far'])); run += it[0] * it[2]; }
      });
      if (st.length < 4) st.push(x('That is all the coins. The total is ' + usd(tot) + '.', [usd(tot), 'total']));
      return N({
        skill: 'Count coins and bills', prompt: 'Rinka has ' + desc + '. How many dollars does she have altogether? Type the answer like 3.65.',
        answer: m(tot), placeholder: 'Like 3.65',
        traps: [T(m(tot + 25), 'That is a little too much. Check that you counted each coin group only once.'), T(m(items.reduce(function (p, it) { return p + it[0]; }, 0) * 100), 'That counts every coin as a dollar. Each type of coin has its own value.')],
        work: items.map(function (it) { return it[0] + ' × ' + usd(it[2]); }).join(' + ') + ' = ' + usd(tot) + '.', plain: 'Count each kind of coin, then add them up, biggest first.',
        teach: st
      });
    } },

    { id: 'addprices2', level: 2, name: 'Add two prices', make: function () {
      var a = R.int(105, 899), b = R.int(105, 899), it = two(), tot = a + b;
      return N({
        skill: 'Add two prices', prompt: 'Sam buys ' + it[0] + ' for ' + usd(a) + ' and ' + it[1] + ' for ' + usd(b) + '. What is the total cost? Type the answer like 7.35.',
        answer: m(tot), placeholder: 'Like 7.35',
        traps: [T(m(tot - 100), 'Check your carrying. When the cents add to 100 or more, carry 1 to the dollars.'), T(m(a + b + 100), 'You carried too much. Carry 1 only once.'), T(String((a + b) / 10), 'Keep two digits after the decimal point and line up the points.')],
        work: usd(a) + ' + ' + usd(b) + ' = ' + usd(tot) + '.', plain: 'Line up the decimal points. Add the cents, then the dollars.',
        teach: [
          x('We need the total, so we add the two prices.', [usd(a), it[0]], ' + ', [usd(b), it[1]]),
          lines('Line up the decimal points.', vadd([a, b]).slice(0, 2), 0),
          x('Add the cents. ' + (a % 100) + ' + ' + (b % 100) + ' = ' + ((a % 100) + (b % 100)) + (((a % 100) + (b % 100)) >= 100 ? ' cents. That is over 100, so carry 1 dollar.' : ' cents.'), (a % 100) + ' + ' + (b % 100) + ' = ', [String((a % 100) + (b % 100)), 'cents']),
          x('Add the dollars. ' + Math.floor(a / 100) + ' + ' + Math.floor(b / 100) + (((a % 100) + (b % 100)) >= 100 ? ' + 1 carried' : '') + ' = ' + (Math.floor(tot / 100)) + '.', Math.floor(a / 100) + ' + ' + Math.floor(b / 100) + (((a % 100) + (b % 100)) >= 100 ? ' + 1' : '') + ' = ', [String(Math.floor(tot / 100)), 'dollars']),
          lines('Here is the finished sum.', vadd([a, b]), 3),
          x('The total is ' + usd(tot) + '.', [usd(tot), 'total'])
        ]
      });
    } },

    { id: 'addprices3', level: 2, name: 'Add three prices', make: function () {
      var a = R.int(50, 499), b = R.int(50, 499), c = R.int(50, 499), tot = a + b + c;
      var lab = R.pick([['pencil case', 'ruler', 'eraser'], ['sandwich', 'apple', 'juice'], ['comic', 'bookmark', 'card'], ['hat', 'scarf', 'glove']]);
      return N({
        skill: 'Add three prices', prompt: 'At a shop, a ' + lab[0] + ' costs ' + usd(a) + ', a ' + lab[1] + ' costs ' + usd(b) + ' and a ' + lab[2] + ' costs ' + usd(c) + '. What is the total? Type the answer like 9.40.',
        answer: m(tot), placeholder: 'Like 9.40',
        traps: [T(m(a + b), 'That leaves out the third price. Add all three.'), T(m(tot + 100), 'You carried too much. Check the cents column again.'), T(m(tot - 100), 'You missed a carry. Check the cents column again.')],
        work: usd(a) + ' + ' + usd(b) + ' + ' + usd(c) + ' = ' + usd(tot) + '.', plain: 'Line up the points. Add the cents column, carry, then add the dollars.',
        teach: [
          x('Add all three prices to find the total.', [usd(a), lab[0]], ' + ', [usd(b), lab[1]], ' + ', [usd(c), lab[2]]),
          lines('Line up the decimal points.', vadd([a, b, c]).slice(0, 3), 0),
          x('Add the first two. ' + usd(a) + ' + ' + usd(b) + ' = ' + usd(a + b) + '.', usd(a) + ' + ' + usd(b) + ' = ', [usd(a + b), 'so far']),
          x('Add the third. ' + usd(a + b) + ' + ' + usd(c) + ' = ' + usd(tot) + '.', usd(a + b) + ' + ' + usd(c) + ' = ', [usd(tot), 'total']),
          lines('Here is the finished sum.', vadd([a, b, c]), 4)
        ]
      });
    } },

    { id: 'round5', level: 2, name: 'Round a cash total to 5 cents', make: function () {
      var dollars = R.int(1, 19), last = R.pick([1, 2, 3, 4, 6, 7, 8, 9]), tens = R.int(0, 9), c = dollars * 100 + tens * 10 + last;
      var r = rnd5(c), low = c - (c % 5), high = low + 5, up = r > c;
      var ph = R.pick(['A bill comes to ' + usd(c) + '. Rinka pays with cash, so the total is rounded to the nearest 5 cents. How much does she pay? Type the answer like 7.85.',
        'At the till the total is ' + usd(c) + '. There are no pennies, so cash totals are rounded to the nearest 5 cents. What is the rounded total? Type the answer like 7.85.']);
      return N({
        skill: 'Round a cash total to 5 cents', prompt: ph, answer: m(r), placeholder: 'Like 7.85',
        traps: [T(m(up ? low : high), 'That rounds the wrong way. Check which 5 cent mark is closer.'), T(String(Math.round(c / 100)), 'That rounds to the nearest dollar. We only round to the nearest 5 cents.')],
        work: usd(c) + ' is between ' + usd(low) + ' and ' + usd(high) + '. It is closer to ' + usd(r) + '.', plain: 'Look at the last digit. 1 or 2 round down. 3 or 4 round up. 6 or 7 round down. 8 or 9 round up.',
        teach: [
          x('The total is ' + usd(c) + '. We round to the nearest 5 cents.', [usd(c), 'cash total']),
          x('The last digit is ' + last + '. The nearest 5 cent marks are ' + usd(low) + ' and ' + usd(high) + '.', [usd(low), 'lower'], ' and ', [usd(high), 'higher']),
          x(usd(c) + ' is ' + (c - low) + (c - low === 1 ? ' cent' : ' cents') + ' above ' + usd(low) + ' and ' + (high - c) + (high - c === 1 ? ' cent' : ' cents') + ' below ' + usd(high) + '.', [(c - low) + ' above', usd(low)], ' and ', [(high - c) + ' below', usd(high)]),
          x('It is closer to ' + usd(r) + '. So we round ' + (up ? 'up' : 'down') + '.', usd(c) + ' rounds to ', [usd(r), 'answer']),
          note('The last digit rule.', 'Remember', ['1 or 2: down', '3 or 4: up to 5', '6 or 7: down to 5', '8 or 9: up to 10'])
        ]
      });
    } },

    { id: 'changefrom5', level: 2, name: 'Change from $5', make: function () {
      var price = p5(105, 495), it = R.pick(ITEMS), ch = 500 - price;
      var ph = R.pick(['Rinka buys ' + it + ' for ' + usd(price) + '. She pays with a $5 bill. How much change does she get? Type the answer like 2.65.',
        it.charAt(0).toUpperCase() + it.slice(1) + ' costs ' + usd(price) + '. Mia gives the cashier a $5 bill. How much change should she get back? Type the answer like 2.65.']);
      return N({
        skill: 'Change from $5', prompt: ph, answer: m(ch), placeholder: 'Like 2.65',
        traps: [T(m(500 + price), 'You added. Change is the gap between the price and the bill, so count up or take away.'), T(m(ch + 100), 'Check your hops. They should end exactly at the $5 bill.'), T(m(price), 'That is the price, not the change. Count up from the price to $5.')],
        work: '5.00 − ' + m(price) + ' = ' + m(ch) + '.', plain: 'Count up from the price to $5. The hops add up to the change.',
        teach: countUp(price, 500).concat([checkStep(price, ch, 500)])
      });
    } },

    { id: 'countup', level: 3, name: 'Count up to make change', make: function () {
      var price = p5(505, 995), it = R.pick(ITEMS), ch = 1000 - price;
      var ph = R.pick(['Use counting up. ' + it.charAt(0).toUpperCase() + it.slice(1) + ' costs ' + usd(price) + '. Sam pays with a $10 bill. How much change does he get? Type the answer like 3.65.',
        'The price is ' + usd(price) + '. Leo pays with a $10 bill. Count up to find his change. Type the answer like 3.65.']);
      return N({
        skill: 'Count up to make change', prompt: ph, answer: m(ch), placeholder: 'Like 3.65',
        traps: [T(m(ch + 100), 'Check your hops. They should end exactly at the $10 bill.'), T(m(ch - 100), 'You may have skipped a dollar hop. Count up to the $10 bill.'), T(m(1000 + price), 'You added. Count up from the price to the bill.')],
        work: usd(price) + ' up to $10.00 is ' + usd(ch) + '.', plain: 'Start at the price. Hop to the next 10 cents, then the next dollar, then up to the bill.',
        teach: countUp(price, 1000).concat([checkStep(price, ch, 1000)])
      });
    } },

    { id: 'change1020', level: 3, name: 'Change from $10 or $20', make: function () {
      var bill = R.pick([1000, 2000, 2000]), price = bill === 1000 ? p5(105, 895) : p5(1005, 1895), ch = bill - price;
      var it = R.pick(ITEMS);
      return N({
        skill: 'Change from $10 or $20', prompt: 'Rinka buys ' + it + ' for ' + usd(price) + '. She pays with a $' + (bill / 100) + ' bill. How much change does she get? Type the answer like 6.45.',
        answer: m(ch), placeholder: 'Like 6.45',
        traps: [T(m(ch + 100), 'Check your hops. They should end exactly at the $' + (bill / 100) + ' bill.'), T(m(ch - 100), 'You may have left out a dollar. Count up all the way to the bill.'), T(m(bill + price), 'You added. Change is the gap between the price and the bill.')],
        work: '$' + (bill / 100) + '.00 − ' + usd(price) + ' = ' + usd(ch) + '.', plain: 'Count up from the price to the bill. Add the hops.',
        teach: countUp(price, bill).concat([checkStep(price, ch, bill)])
      });
    } },

    { id: 'multitem', level: 3, name: 'Cost of many items', make: function () {
      var n = R.int(3, 8), price = p5(105, 495), tot = n * price, it = R.pick(['muffins', 'juice boxes', 'pencils', 'stickers', 'bus tickets', 'pears', 'granola bars', 'notebooks']);
      var d = Math.floor(price / 100), cc = price % 100;
      return N({
        skill: 'Cost of many items', prompt: 'One of these costs ' + usd(price) + '. Mia buys ' + n + ' ' + it + ' at that price. How much do they cost altogether? Type the answer like 9.75.',
        answer: m(tot), placeholder: 'Like 9.75',
        traps: [T(m(price + n * 100), 'You added instead of multiplying. Multiply the price by ' + n + '.'), T(m(n * d * 100), 'That leaves out the cents. Multiply the cents part by ' + n + ' too.'), T(m(Math.round(price / n)), 'You divided. When you buy many items, you multiply.')],
        work: n + ' × ' + usd(price) + ' = ' + usd(tot) + '.', plain: 'Each item costs the same, so multiply the price by how many you buy.',
        teach: [
          x('We buy ' + n + ' items at ' + usd(price) + ' each. Multiply.', [String(n), 'items'], ' × ', [usd(price), 'each']),
          x('Do the dollars. ' + n + ' × ' + d + ' = ' + (n * d) + '.', n + ' × ' + d + '.00 = ', [usd(n * d * 100), 'dollars']),
          x('Do the cents. ' + n + ' × ' + cc + ' = ' + (n * cc) + ' cents. That is ' + usd(n * cc) + '.', n + ' × ' + m(cc) + ' = ', [usd(n * cc), 'cents']),
          x('Add the two parts. ' + usd(n * d * 100) + ' + ' + usd(n * cc) + ' = ' + usd(tot) + '.', usd(n * d * 100) + ' + ' + usd(n * cc) + ' = ', [usd(tot), 'total']),
          x('So ' + n + ' items cost ' + usd(tot) + '.', [usd(tot), 'answer'])
        ]
      });
    } },

    { id: 'peritem', level: 3, name: 'Price of one item', make: function () {
      var n = R.pick([2, 3, 4, 5, 6, 8]), price = p5(35, 495), tot = n * price, it = R.pick(['pens', 'apples', 'stickers', 'erasers', 'juice boxes', 'granola bars', 'cookies']);
      return N({
        skill: 'Price of one item', prompt: n + ' ' + it + ' cost ' + usd(tot) + ' altogether. All of them cost the same. How much does one cost? Type the answer like 1.50.',
        answer: m(price), placeholder: 'Like 1.50',
        traps: [T(m(tot), 'That is the price of all of them. Divide by ' + n + ' to find one.'), T(m(tot * n), 'You multiplied. To find the price of one, divide.'), T(m(price + 5), 'Check your division. Multiply your answer by ' + n + ' to see if it gets back to ' + usd(tot) + '.')],
        work: usd(tot) + ' = ' + tot + ' cents. ' + tot + ' ÷ ' + n + ' = ' + price + ' cents = ' + usd(price) + '.', plain: 'Change the money to cents. Divide by the number of items. Change back to dollars.',
        teach: [
          x(n + ' items cost ' + usd(tot) + '. We want the price of one, so we divide.', [usd(tot), 'total'], ' ÷ ', [String(n), 'items']),
          x('It is easier in cents. ' + usd(tot) + ' is ' + tot + ' cents.', usd(tot) + ' = ', [String(tot), 'cents']),
          x('Divide by ' + n + '. ' + tot + ' ÷ ' + n + ' = ' + price + '.', tot + ' ÷ ' + n + ' = ', [String(price), 'cents each']),
          x('Change back to dollars. ' + price + ' cents is ' + usd(price) + '.', price + ' cents = ', [usd(price), 'one item']),
          x('Check. ' + n + ' × ' + usd(price) + ' = ' + usd(tot) + '.', n + ' × ' + usd(price) + ' = ', [usd(tot), 'matches'])
        ]
      });
    } },

    { id: 'fewestcoins', level: 4, name: 'Fewest coins', make: function () {
      var typ = R.int(0, 1), amt = typ === 0 ? p5(15, 95) : p5(105, 495);
      var den = [[200, 'toonie'], [100, 'loonie'], [25, 'quarter'], [10, 'dime'], [5, 'nickel']], rem = amt, used = [], cnt = 0;
      den.forEach(function (d) { var k = Math.floor(rem / d[0]); if (k > 0) { used.push([k, d[1], d[0]]); cnt += k; rem -= k * d[0]; } });
      var coinsList = typ === 0 ? 'quarters, dimes and nickels' : 'toonies, loonies, quarters, dimes and nickels';
      var st = [x('To use the fewest coins, start with the biggest coin that fits.', [usd(amt), 'amount to make'])];
      var left = amt;
      used.forEach(function (u) {
        st.push(x('Use ' + u[0] + ' ' + u[1] + (u[0] > 1 ? 's' : '') + ' for ' + usd(u[0] * u[2]) + '. That leaves ' + usd(left - u[0] * u[2]) + '.', [u[0] + ' ' + u[1], usd(u[0] * u[2])], ' left: ', [usd(left - u[0] * u[2]), 'left']));
        left -= u[0] * u[2];
      });
      st.push(x('Add up the coins. ' + used.map(function (u) { return u[0]; }).join(' + ') + ' = ' + cnt + ' coins.', used.map(function (u) { return u[0]; }).join(' + ') + ' = ', [String(cnt), 'coins']));
      st.push(x('Check that the coins add back to ' + usd(amt) + '.', used.map(function (u) { return usd(u[0] * u[2]); }).join(' + ') + ' = ', [usd(amt), 'amount']));
      return N({
        skill: 'Fewest coins', prompt: 'A cashier must give ' + usd(amt) + ' in change using only ' + coinsList + '. What is the fewest number of coins that can make that amount?',
        answer: cnt, placeholder: 'Type a number',
        traps: [T(String(cnt + 1), 'That is one more than needed. Check that you used the biggest coin that fits each time.'), T(String(amt / 5), 'That uses only nickels. Use bigger coins to need fewer.')],
        work: used.map(function (u) { return u[0] + ' ' + u[1]; }).join(', ') + ' makes ' + usd(amt) + ' with ' + cnt + ' coins.', plain: 'Use the biggest coin that fits. Then the next biggest with what is left.',
        teach: st
      });
    } },

    { id: 'twostep', level: 4, name: 'Two item change', make: function () {
      var a = p5(205, 895), b = p5(205, 795), it = two(), tot = a + b, bill = tot < 1000 ? 1000 : 2000, ch = bill - tot;
      return N({
        skill: 'Two item change', prompt: 'Sam buys ' + it[0] + ' for ' + usd(a) + ' and ' + it[1] + ' for ' + usd(b) + '. He pays with a $' + (bill / 100) + ' bill. How much change does he get? Type the answer like 4.55.',
        answer: m(ch), placeholder: 'Like 4.55',
        traps: [T(m(tot), 'That is the total cost. The question asks for the change from $' + (bill / 100) + '.'), T(m(bill - a), 'That is the change from only the first item. Add both prices first.'), T(m(ch + 100), 'Check your hops. They should end exactly at the $' + (bill / 100) + ' bill.')],
        work: usd(a) + ' + ' + usd(b) + ' = ' + usd(tot) + '. Then $' + (bill / 100) + '.00 − ' + usd(tot) + ' = ' + usd(ch) + '.', plain: 'Step one, add the prices. Step two, count up from the total to the bill.',
        teach: [
          x('Step one. Find the total. ' + usd(a) + ' + ' + usd(b) + ' = ' + usd(tot) + '.', usd(a) + ' + ' + usd(b) + ' = ', [usd(tot), 'total']),
          lines('Check the total with a vertical sum.', vadd([a, b]), 3)
        ].concat(countUp(tot, bill))
      });
    } },

    { id: 'taxeasy', level: 4, name: 'Find the 5 percent tax', make: function () {
      var P = R.pick([10, 12, 15, 20, 30, 40, 50, 60, 80, 100]), tax = P * 5, it = R.pick(ITEMS);
      return N({
        skill: 'Find the 5 percent tax', prompt: it.charAt(0).toUpperCase() + it.slice(1) + ' costs $' + P + '. The sales tax is 5 percent. How much is the tax? Type the answer like 2.50.',
        answer: m(tax), placeholder: 'Like 2.50',
        traps: [T(m(P * 10), '10 percent of $' + P + ' is $' + m(P * 10) + '. But 5 percent is only half of that.'), T(m(P * 100 + tax), 'That is the total with tax. The question asks only for the tax.'), T(m(P * 5 * 10), '5 percent is 5 cents for every dollar, not 50 cents.')],
        work: '10% of $' + P + ' is ' + usd(P * 10) + '. Half of that is ' + usd(tax) + '.', plain: '5 percent is 5 cents for every dollar. Find 10 percent, then take half.',
        teach: [
          x('We want 5 percent of $' + P + '. First find 10 percent. That is one tenth.', ['5%', 'of'], ' $' + P),
          x('Divide by 10. ' + P + ' ÷ 10 = ' + m(P * 10) + '.', P + ' ÷ 10 = ', [usd(P * 10), '10%']),
          x('5 percent is half of 10 percent. Half of ' + usd(P * 10) + ' is ' + usd(tax) + '.', usd(P * 10) + ' ÷ 2 = ', [usd(tax), '5%']),
          x('So the tax is ' + usd(tax) + '.', [usd(tax), 'tax']),
          x('Check. 5 cents for every dollar. ' + P + ' × 5 cents = ' + tax + ' cents.', P + ' × 5 = ', [String(tax), 'cents'])
        ]
      });
    } },

    { id: 'roundpay', level: 5, name: 'Round then make change', make: function () {
      var dollars = R.int(2, 17), last = R.pick([1, 2, 3, 4, 6, 7, 8, 9]), tens = R.int(0, 9), c = dollars * 100 + tens * 10 + last, r = rnd5(c), bill = c < 1000 ? 1000 : 2000, ch = bill - r;
      return N({
        skill: 'Round then make change', prompt: 'A bill totals ' + usd(c) + '. Rinka pays with a $' + (bill / 100) + ' bill in cash. Cash totals are rounded to the nearest 5 cents. How much change does she get? Type the answer like 2.15.',
        answer: m(ch), placeholder: 'Like 2.15',
        traps: [T(m(bill - c), 'You used the total before rounding. For cash, round the total first, then find the change.'), T(m(r), 'That is the rounded total. The question asks for the change.'), T(m(ch + 100), 'Check your hops. They should end exactly at the $' + (bill / 100) + ' bill.')],
        work: usd(c) + ' rounds to ' + usd(r) + '. $' + (bill / 100) + '.00 − ' + usd(r) + ' = ' + usd(ch) + '.', plain: 'Round the total to the nearest 5 cents first. Then count up to the bill.',
        teach: [
          x('Step one. Round the cash total to the nearest 5 cents. The last digit is ' + last + '.', [usd(c), 'total']),
          x(usd(c) + ' rounds to ' + usd(r) + '.', usd(c) + ' becomes ', [usd(r), 'rounded total']),
          x('Step two. Find the change from the rounded total. Count up from ' + usd(r) + ' to ' + usd(bill) + '.', [usd(r), 'start'], ' up to ', [usd(bill), 'paid'])
        ].concat(countUp(r, bill).slice(1))
      });
    } },

    { id: 'totalwithtax', level: 5, name: 'Total with tax', make: function () {
      var P = R.pick([10, 20, 30, 40, 50, 60, 80]), tax = P * 5, tot = P * 100 + tax, it = R.pick(ITEMS);
      return N({
        skill: 'Total with tax', prompt: it.charAt(0).toUpperCase() + it.slice(1) + ' costs $' + P + ' before tax. Sales tax is 5 percent. How much does Mia pay in all? Type the answer like 31.50.',
        answer: m(tot), placeholder: 'Like 31.50',
        traps: [T(m(tax), 'That is only the tax. Add it to the price.'), T(m(P * 100), 'That is the price before tax. Add the 5 percent tax.'), T(m(P * 100 + P * 10), 'That adds 10 percent. Tax here is 5 percent, which is half of that.')],
        work: '5% of $' + P + ' is ' + usd(tax) + '. $' + P + '.00 + ' + usd(tax) + ' = ' + usd(tot) + '.', plain: 'Find 10 percent, take half for 5 percent, then add the tax to the price.',
        teach: [
          x('Step one is the tax. 10 percent of $' + P + ' is ' + usd(P * 10) + '.', P + ' ÷ 10 = ', [usd(P * 10), '10%']),
          x('5 percent is half. Half of ' + usd(P * 10) + ' is ' + usd(tax) + '.', usd(P * 10) + ' ÷ 2 = ', [usd(tax), '5% tax']),
          x('Step two is the total. Add the tax to the price.', usd(P * 100) + ' + ' + usd(tax) + ' = ', [usd(tot), 'total']),
          lines('Check with a vertical sum.', vadd([P * 100, tax]), 3),
          x('Mia pays ' + usd(tot) + '.', [usd(tot), 'answer'])
        ]
      });
    } },

    { id: 'afford', level: 5, name: 'How many can you buy', make: function () {
      var cash = R.pick([1000, 2000]), price = cash === 1000 ? R.pick([125, 150, 175, 250, 350, 450]) : R.pick([250, 275, 350, 375, 450, 550]), n = Math.floor(cash / price);
      var it = R.pick(['notebooks', 'sandwiches', 'toy cars', 'juice boxes', 'sticker packs', 'bus passes']);
      var left = cash - n * price, askLeft = R.int(0, 1) === 1;
      var rows = [], s = 0;
      for (var i = 1; i <= n + 1 && i <= 12; i++) { s = i * price; rows.push(pad(i + (i === 1 ? ' item' : ' items'), 9) + usd(s)); }
      var head = 'Rinka has $' + (cash / 100) + '. ' + it.charAt(0).toUpperCase() + it.slice(1) + ' cost ' + usd(price) + ' each.';
      var st = [x('Keep adding one more item until the cost is more than $' + (cash / 100) + '.', ['$' + (cash / 100), 'to spend'], ' and ', [usd(price), 'each']),
        lines('Here are the costs as the number of items grows.', rows.slice(0, 9), 0),
        x(n + ' items cost ' + usd(n * price) + '. That fits in $' + (cash / 100) + '.', n + ' × ' + usd(price) + ' = ', [usd(n * price), 'fits']),
        x('One more item would cost ' + usd((n + 1) * price) + '. That is too much.', (n + 1) + ' × ' + usd(price) + ' = ', [usd((n + 1) * price), 'too much'])];
      if (askLeft) {
        st.push(x('The money left over is ' + usd(cash) + ' − ' + usd(n * price) + ' = ' + usd(left) + '.', usd(cash) + ' − ' + usd(n * price) + ' = ', [usd(left), 'left over']));
        return N({
          skill: 'How many can you buy', prompt: head + ' She buys as many as she can. How much money does she have left? Type the answer like 1.50.',
          answer: m(left), placeholder: 'Like 1.50',
          traps: [T(String(n), 'That is how many she can buy. The question asks how much money is left.'), T(m(cash), 'That is the money she started with. Take away what she spent.'), T(m(left + price), 'She can afford one more than that. Keep adding until it goes over.')],
          work: n + ' × ' + usd(price) + ' = ' + usd(n * price) + '. ' + usd(cash) + ' − ' + usd(n * price) + ' = ' + usd(left) + '.', plain: 'Find how many fit. Then take what they cost away from what she has.', teach: st
        });
      }
      return N({
        skill: 'How many can you buy', prompt: head + ' How many can she buy?', answer: n, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(n + 1), 'That costs ' + usd((n + 1) * price) + ', which is more than $' + (cash / 100) + '. She cannot afford it.'), T(String(n - 1), 'She can afford one more than that. Keep adding until it goes over.')],
        work: n + ' items cost ' + usd(n * price) + '. ' + (n + 1) + ' items cost ' + usd((n + 1) * price) + ', which is too much.', plain: 'Keep adding the price until you pass the money she has. The last one that fits is the answer.', teach: st
      });
    } },

    { id: 'changewithtax', level: 6, name: 'Tax then change', make: function () {
      var pr = R.pick([[10, 5000], [20, 5000], [30, 5000], [40, 5000], [50, 10000], [60, 10000], [20, 2500], [30, 4000], [40, 5000]]), P = pr[0], bill = pr[1];
      var tax = P * 5, tot = P * 100 + tax, ch = bill - tot, it = R.pick(ITEMS);
      return N({
        skill: 'Tax then change', prompt: it.charAt(0).toUpperCase() + it.slice(1) + ' costs $' + P + ' before tax. The sales tax is 5 percent. Sam pays with a $' + (bill / 100) + ' bill. How much change does he get? Type the answer like 18.50.',
        answer: m(ch), placeholder: 'Like 18.50',
        traps: [T(m(bill - P * 100), 'You forgot the tax. Change comes from the total with tax.'), T(m(tot), 'That is the total Sam pays. The question asks for his change.'), T(m(bill - P * 100 - P * 10), 'That uses 10 percent tax. The tax is 5 percent, which is half of that.')],
        work: 'Tax ' + usd(tax) + '. Total ' + usd(tot) + '. Change $' + m(bill) + ' − ' + usd(tot) + ' = ' + usd(ch) + '.', plain: 'Step one, find the tax. Step two, add it to the price. Step three, count up to the bill.',
        teach: [
          x('Step one. Find the tax. 10 percent of $' + P + ' is ' + usd(P * 10) + '. Half of it is ' + usd(tax) + '.', usd(P * 10) + ' ÷ 2 = ', [usd(tax), '5% tax']),
          x('Step two. Add the tax to the price to get the total.', usd(P * 100) + ' + ' + usd(tax) + ' = ', [usd(tot), 'total']),
          x('Step three. Find the change. Count up from ' + usd(tot) + ' to ' + usd(bill) + '.', [usd(tot), 'total'], ' up to ', [usd(bill), 'paid'])
        ].concat(countUp(tot, bill).slice(1)).concat([checkStep(tot, ch, bill)]).slice(0, 8)
      });
    } }
  ]);
})();
