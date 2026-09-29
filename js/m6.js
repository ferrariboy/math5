/* Module 6: Percentages and Financial Scale. Lessons, vocabulary and question skills. */
(function () {
  'use strict';
  var B = window.Bank, R = B.R, S = B.s, Q = B.q, T = Q.trap;
  var x = S.x, note = S.note, bars = S.bars, fb = S.fb, grid = S.grid, groups = S.groups;

  /* ---------- Helpers ---------- */
  /* Money is worked in cents so there are no floating point slips. */
  function money(c) { return c % 100 === 0 ? String(c / 100) : (c / 100).toFixed(2); }
  function usd(c) { return '$' + (c % 100 === 0 ? R.fmt(c / 100) : (c / 100).toFixed(2)); }
  function dec(n) { var s = (n / 100).toFixed(2); return s.charAt(3) === '0' ? s.slice(0, 3) : s; }
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
  function mk(label, list, total) {
    var r = { label: label, segs: list.map(function (p) { return { n: 1, cls: p[0], text: p[1] || '' }; }) };
    if (total) r.total = total;
    return r;
  }
  /* Shade the first n squares of a 10 by 10 grid, row by row. */
  function hg(n, cls) {
    var r = Math.floor(n / 10), c = n % 10, out = [];
    if (r > 0) out.push({ c0: 0, c1: 10, r0: 0, r1: r, cls: cls });
    if (c > 0) out.push({ c0: 0, c1: c, r0: r, r1: r + 1, cls: cls });
    return out;
  }
  function all(cls) { return { c0: 0, c1: 10, r0: 0, r1: 10, cls: cls }; }

  /* Find p% of an amount by building it from 10% and 5%. p is a multiple of 5.
     If asMoney, amt is in dollars (a multiple of 10). Otherwise amt is a plain number (a multiple of 20). */
  function pctSteps(amt, p, asMoney) {
    var s = asMoney ? 100 : 1, A = amt * s, ten = A / 10, tens = Math.floor(p / 10), five = p % 10 === 5;
    var fm = function (v) { return asMoney ? usd(v) : String(v); };
    var whole = fm(A), prod = tens * ten, half = ten / 2, ans = p * A / 100, st = [];
    st.push(x('We want ' + p + '% of ' + whole + '. We will build it from 10%, which is one tenth.', [p + '%', 'find'], ' of ', [whole, 'the whole']));
    st.push(x('10% is one tenth. Divide by 10: ' + whole + ' ÷ 10 = ' + fm(ten) + '.', '10% of ' + whole + ' = ', [fm(ten), '10%']));
    if (tens > 1) st.push(x(tens * 10 + '% is ' + tens + ' tens. So ' + tens + ' × ' + fm(ten) + ' = ' + fm(prod) + '.', tens * 10 + '% of ' + whole + ' = ', [fm(prod), tens * 10 + '%']));
    if (five) st.push(x('5% is half of 10%. Half of ' + fm(ten) + ' is ' + fm(half) + '.', '5% of ' + whole + ' = ', [fm(half), '5%']));
    if (five && tens > 0) st.push(x('Put the pieces together: ' + fm(prod) + ' + ' + fm(half) + ' = ' + fm(ans) + '.', fm(prod) + ' + ' + fm(half) + ' = ', [fm(ans), p + '%']));
    st.push(x('So ' + p + '% of ' + whole + ' is ' + fm(ans) + '.', p + '% of ' + whole + ' = ', [fm(ans), 'answer']));
    var cmp = p < 50 ? 'less than half' : (p === 50 ? 'exactly half' : 'more than half');
    st.push(note('Quick check. Half of ' + whole + ' is ' + fm(A / 2) + '. ' + p + '% is ' + cmp + ', and ' + fm(ans) + ' fits that.', 'Does it make sense?', ['Half of ' + whole + ' is ' + fm(A / 2), p + '% is ' + cmp, 'Our answer is ' + fm(ans)]));
    return st;
  }

  /* ---------- Vocabulary ---------- */
  window.MATH_VOCAB[6] = [
    { m: 'A way to say out of 100. 30% means 30 out of every 100.', w: 'Percent' },
    { w: 'Benchmark percent', m: 'An easy percent you can use as a shortcut. 50% is a half, 25% is a quarter, and 10% is a tenth.' },
    { w: 'Discount', m: 'Money taken off the price. A 20% discount means you pay 20% less.' },
    { w: 'Sale price', m: 'The price you pay after the discount is taken off.' },
    { w: 'Sales tax', m: 'Extra money added to the price when you buy something. It goes to the government.' },
    { w: 'Tip', m: 'Extra money you give to a worker to say thanks, like at a restaurant. It is often a percent of the bill.' },
    { w: 'Unit price', m: 'The price of just one item. Divide the total price by how many items you get.' },
    { w: 'Change', m: 'The money you get back when you pay with more than the price.' }
  ];

  /* ---------- Lessons ---------- */
  window.MATH_LESSONS[6] = [
    { title: '1. What does percent mean?',
      explain: [
        'Percent means out of 100. The word comes from an old phrase that means for each hundred. We write it with the sign %.',
        'Picture a big square cut into 100 tiny squares, in 10 rows of 10. If 30 of the tiny squares are colored, then 30 out of 100 are colored. That is 30 percent.',
        'Percent is useful because the whole is always 100. That makes it fair to compare things of different sizes.'
      ],
      rule: 'Percent means out of 100. 30% means 30 out of every 100.',
      mistake: 'Percent is not the same as a count of things. 30% of a bag is not always 30 things. It means 30 out of every 100.',
      steps: [
        grid('Here is one whole, cut into 100 equal squares. That is 10 rows of 10.', 10, 10, []),
        grid('Color 30 squares. That is 3 full rows of 10.', 10, 10, hg(30, 'bg-emerald-400')),
        x('30 squares out of 100 squares. We say 30 percent.', [30 + '', 'colored'], ' out of 100 = ', ['30%', 'percent']),
        grid('Now color 7 more squares in the next row. Now 37 squares are colored.', 10, 10, hg(30, 'bg-emerald-400').concat([{ c0: 0, c1: 7, r0: 3, r1: 4, cls: 'bg-amber-300' }])),
        x('37 out of 100 is 37%. The whole is 100, so the count of squares is the percent.', ['37', 'squares'], ' out of 100 = ', ['37%', 'percent']),
        note('Percent always uses 100 as the whole.', 'Remember', ['Percent means out of 100', '100% is the whole thing', '0% is nothing at all'])
      ] },

    { title: '2. Percent, fraction and decimal',
      explain: [
        'A percent, a fraction and a decimal can all name the same amount. They are just three different outfits for one number.',
        'Percent means out of 100, so 25% is the fraction 25 over 100. You can simplify it. Divide the top and the bottom by 25 and you get 1 over 4.',
        'To write a percent as a decimal, move the decimal point 2 places to the left. 25% becomes 0.25.'
      ],
      rule: 'Percent is a fraction with 100 on the bottom. Divide by 100 for the decimal.',
      mistake: 'For a small percent like 7%, the decimal is 0.07, not 0.7. Do not forget the zero.',
      steps: [
        x('Start with 25%. It means 25 out of 100.', ['25%', 'percent']),
        x('As a fraction, that is 25 over 100.', '25% = ', ['25/100', 'fraction']),
        x('Divide the top and bottom by 25 to make the fraction simpler.', '25/100 = ', ['1/4', 'simplest form']),
        x('As a decimal, 25 hundredths is written 0.25. We moved the point 2 places left.', '25% = ', ['0.25', 'decimal']),
        x('Now try 7%. Move the point 2 places left. We need a zero to fill the gap.', '7% = ', ['0.07', 'decimal']),
        x('Do it backward. To go from a decimal to a percent, move the point 2 places right.', '0.6 = ', ['60%', 'percent']),
        note('One amount, three names.', 'Three names for the same amount', ['25% = 25/100 = 1/4 = 0.25', '50% = 50/100 = 1/2 = 0.5', '7% = 7/100 = 0.07'])
      ] },

    { title: '3. Benchmark percents',
      explain: [
        'Some percents are so friendly that you can find them in your head. We call them benchmarks.',
        '50% is one half. 25% is one quarter. 75% is three quarters. 10% is one tenth.',
        'If you know the benchmarks, you can solve many percent problems fast, without a calculator.'
      ],
      rule: '50% is a half. 25% is a quarter. 75% is three quarters. 10% is a tenth.',
      mistake: '25% is not a half. A half is 50%. 25% is half of a half, which is a quarter.',
      steps: [
        bars('Cut one whole into 4 equal parts. Each part is 25%.', [fb('One quarter is 25%', 4, 1, 'bg-indigo-400', '25%')]),
        bars('Two quarters make 50%. That is one half.', [fb('One half is 50%', 4, 2, 'bg-indigo-400', '25%')]),
        bars('Three quarters make 75%.', [fb('Three quarters is 75%', 4, 3, 'bg-indigo-400', '25%')]),
        bars('Cut one whole into 10 equal parts. Each part is 10%.', [fb('One tenth is 10%', 10, 1, 'bg-emerald-400')]),
        x('Let us use one. To find 25% of 80, find one quarter. Divide by 4.', ['25%', 'a quarter'], ' of 80 = 80 ÷ 4 = ', ['20', 'answer']),
        x('Another one. 50% of 90 is half of 90. Divide by 2.', ['50%', 'a half'], ' of 90 = 90 ÷ 2 = ', ['45', 'answer']),
        note('Learn these four by heart.', 'Benchmarks', ['50% is 1/2, so divide by 2', '25% is 1/4, so divide by 4', '75% is 3/4, so divide by 4 then times 3', '10% is 1/10, so divide by 10'])
      ] },

    { title: '4. Fractions to percents',
      explain: [
        'To turn a fraction into a percent, make the bottom number 100. Then the top number is the percent.',
        'Whatever you multiply the bottom by, you must multiply the top by too. That keeps the fraction the same size.',
        'This works best when the bottom number goes into 100 evenly, like 2, 4, 5, 10, 20, 25 or 50.'
      ],
      rule: 'Multiply top and bottom by the same number to make the bottom 100.',
      mistake: '3/20 is not 3%. First make the bottom 100. Then the top is the percent.',
      steps: [
        x('Write 3/20 as a percent. Percent needs 100 on the bottom.', ['3/20', 'to a percent']),
        x('What do we multiply 20 by to get 100? 20 × 5 = 100.', '20 × ', ['5', 'multiplier'], ' = 100'),
        x('Do the same to the top. 3 × 5 = 15.', '3 × 5 = ', ['15', 'new top']),
        x('Now the fraction is 15 over 100. That is 15%.', '3/20 = 15/100 = ', ['15%', 'percent']),
        x('Second example. 7 out of 25. 25 × 4 = 100, so multiply the top by 4.', '7/25 = ', ['28', '7 × 4'], '/100'),
        x('28 over 100 is 28%.', '7/25 = ', ['28%', 'percent'])
      ] },

    { title: '5. Percent of an amount',
      explain: [
        'To find a percent of an amount, start with 10%. 10% is one tenth, so just divide the amount by 10.',
        'Then build any percent that is a multiple of 5. 30% is 3 lots of 10%. 5% is half of 10%. 35% is 30% plus 5%.',
        'You can also change the percent into a decimal and multiply. 35% is 0.35, so 0.35 × 60 also works. The calculator is allowed here, but building it is often faster.'
      ],
      rule: 'Find 10% by dividing by 10. Then add pieces to build the percent you need.',
      mistake: 'Do not multiply the amount by the percent number. 35% of 60 is not 35 × 60.',
      steps: [
        x('Find 35% of 60. We build 35% from pieces we know: 30% and 5%.', ['35%', 'find'], ' of 60'),
        groups('10% is one tenth. Cut 60 into 10 equal groups of 6. Each group is 10%.', 10, 6, 1, '10% = 6'),
        x('10% of 60 is 60 ÷ 10 = 6.', '10% of 60 = ', ['6', '10%']),
        groups('30% is 3 of the groups. That is 3 × 6 = 18.', 10, 6, 3, '30% = 18'),
        x('5% is half of 10%. Half of 6 is 3.', '5% of 60 = ', ['3', '5%']),
        x('Add the pieces. 30% plus 5% gives 35%. So 18 + 3 = 21.', '18 + 3 = ', ['21', '35% of 60']),
        x('Check with a decimal. 35% is 0.35, and 0.35 × 60 is 21.', '0.35 × 60 = ', ['21', 'same answer'])
      ] },

    { title: '6. Finding the percent',
      explain: [
        'Sometimes you know the parts and you need the percent. For example, 18 out of 50 students walk to school. What percent walk?',
        'Write the parts as a fraction: 18 over 50. Then make the bottom 100, just like before. The top number is then your percent.',
        'Always put the part on top and the whole on the bottom.'
      ],
      rule: 'Part over whole. Make the bottom 100. The top is the percent.',
      mistake: 'Do not put the whole on top. 18 out of 50 is 18/50, not 50/18.',
      steps: [
        x('18 out of 50 students walk to school. What percent walk?', ['18', 'part'], ' out of ', ['50', 'whole']),
        x('Write it as a fraction. The part goes on top and the whole goes on the bottom.', ['18/50', 'part over whole']),
        x('Make the bottom 100. 50 × 2 = 100, so multiply the top by 2 as well.', '18/50 = ', ['36', '18 × 2'], '/100'),
        x('36 over 100 is 36%. So 36% of the students walk.', '18/50 = ', ['36%', 'answer']),
        x('Second example. 9 out of 20 pencils are red. 20 × 5 = 100, so 9 × 5 = 45.', '9/20 = 45/100 = ', ['45%', 'answer']),
        note('Same steps every time.', 'The recipe', ['Write part over whole', 'Multiply top and bottom to make 100', 'The top is the percent'])
      ] },

    { title: '7. Discounts and sale prices',
      explain: [
        'A discount is money taken off a price. If a shirt is 20% off, you pay 20% less than the normal price.',
        'First find how much the discount is, using the percent of an amount. Then take it away from the price. What is left is the sale price.',
        'The discount is a small piece of the price, so it is always less than the price.'
      ],
      rule: 'Find the discount. Then price minus discount is the sale price.',
      mistake: 'The discount is not the price you pay. Do not forget to take it away from the original price.',
      steps: [
        x('A helmet costs $40. It is 25% off. What is the sale price?', ['$40', 'price'], ' with ', ['25%', 'off']),
        bars('25% is one quarter. Cut $40 into 4 equal parts of $10.', [mk('$40 price', [['bg-indigo-400', '$10'], ['bg-indigo-400', '$10'], ['bg-indigo-400', '$10'], ['bg-indigo-400', '$10']])]),
        bars('One quarter is the discount. The other three quarters are what we pay.', [mk('$40 price', [['bg-rose-400', '$10'], ['bg-emerald-400', '$10'], ['bg-emerald-400', '$10'], ['bg-emerald-400', '$10']])]),
        x('The discount is $40 ÷ 4 = $10.', '25% of $40 = ', ['$10', 'discount']),
        x('Take the discount away from the price. $40 − $10 = $30.', '$40 − $10 = ', ['$30', 'sale price']),
        x('Second example. A game costs $60 and is 20% off. 10% is $6, so 20% is $12.', '20% of $60 = ', ['$12', 'discount']),
        x('Sale price: $60 − $12 = $48.', '$60 − $12 = ', ['$48', 'sale price'])
      ] },

    { title: '8. Sales tax and tips',
      explain: [
        'Sales tax is extra money added to the price when you buy something. A tip is extra money you give to say thanks, like at a restaurant.',
        'They work like a discount, but the other way around. You find the percent of the price, then you ADD it on.',
        'The total you pay is the price plus the tax, or the bill plus the tip.'
      ],
      rule: 'Find the percent of the price. Then ADD it to the price.',
      mistake: 'Tax and tips are added, not taken away. The total should be bigger than the price.',
      steps: [
        x('A toy costs $30. The sales tax is 5%. How much do you pay in total?', ['$30', 'price'], ' plus ', ['5%', 'tax']),
        x('10% of $30 is $3. Divide by 10.', '10% of $30 = ', ['$3', '10%']),
        x('5% is half of 10%. Half of $3 is $1.50.', '5% of $30 = ', ['$1.50', 'tax']),
        x('Add the tax to the price. $30 + $1.50 = $31.50.', '$30 + $1.50 = ', ['$31.50', 'total']),
        x('Second example. A meal is $40 and you leave a 15% tip. 10% is $4 and 5% is $2.', '15% of $40 = $4 + $2 = ', ['$6', 'tip']),
        x('The total is the bill plus the tip. $40 + $6 = $46.', '$40 + $6 = ', ['$46', 'total'])
      ] },

    { title: '9. Savings and budgets',
      explain: [
        'A budget is a plan for your money. You decide what part to save and what part to spend.',
        'Percents are perfect for budgets. Every part of your money is a percent, and all the parts together make 100%.',
        'If you know the percents you used, take them away from 100% to find what is left.'
      ],
      rule: 'All the parts add to 100%. What is left is 100% minus the parts used.',
      mistake: 'Do not stop after finding the saved amount. Read the question to see if it wants the amount left over.',
      steps: [
        x('Mia has $80. She saves 30% and spends 50% on a bike part. How much is left?', ['$80', 'money']),
        bars('Cut the $80 into 10 equal parts. Each part is 10%, which is $8.', [mk('$80 is 100%', [['bg-indigo-400'], ['bg-indigo-400'], ['bg-indigo-400'], ['bg-indigo-400'], ['bg-indigo-400'], ['bg-indigo-400'], ['bg-indigo-400'], ['bg-indigo-400'], ['bg-indigo-400'], ['bg-indigo-400']], 'each part is $8')]),
        bars('Saved is 3 parts, spent is 5 parts, and 2 parts are left.', [mk('Saved 30%, spent 50%', [['bg-emerald-400'], ['bg-emerald-400'], ['bg-emerald-400'], ['bg-amber-300'], ['bg-amber-300'], ['bg-amber-300'], ['bg-amber-300'], ['bg-amber-300'], ['bg-slate-200'], ['bg-slate-200']], '2 parts are left')]),
        x('Percent left is 100% − 30% − 50% = 20%.', '100% − 30% − 50% = ', ['20%', 'left']),
        x('20% is 2 parts of $8. So 2 × $8 = $16.', '2 × $8 = ', ['$16', 'left']),
        x('Check with the money. Saved $24, spent $40, and $80 − $24 − $40 = $16.', '$80 − $24 − $40 = ', ['$16', 'same answer'])
      ] },

    { title: '10. Making change',
      explain: [
        'When you pay with a bill that is bigger than the price, the seller gives back change. Change is the difference between what you paid and the price.',
        'The easy way to find change is to count up. Start at the price and count up to the next whole dollar. Then count up to the amount you paid.',
        'Add the little jumps together. That total is your change.'
      ],
      rule: 'Count up from the price to the amount you paid. Add the jumps.',
      mistake: 'Do not forget to add up ALL the things you buy before you work out the change.',
      steps: [
        x('You buy a book for $8.65. You pay with a $20 bill. How much change do you get?', ['$8.65', 'price'], ' and pay ', ['$20', 'paid']),
        x('Count up to the next whole dollar. From $8.65 to $9 is 35 cents.', '$8.65 + ', ['$0.35', 'jump one'], ' = $9'),
        x('Now count up from $9 to $20. That is 11 dollars.', '$9 + ', ['$11', 'jump two'], ' = $20'),
        x('Add the jumps together. $0.35 + $11 = $11.35.', '$0.35 + $11 = ', ['$11.35', 'change']),
        x('Check with taking away. $20 − $8.65 = $11.35. Same answer.', '$20 − $8.65 = ', ['$11.35', 'same answer']),
        x('Second example. You buy 2 things for $3.20 and $2.45. First add: $3.20 + $2.45 = $5.65.', '$3.20 + $2.45 = ', ['$5.65', 'total cost']),
        x('Count up from $5.65 to $10. 35 cents to $6, then $4 to $10. The change is $4.35.', '$0.35 + $4 = ', ['$4.35', 'change'])
      ] },

    { title: '11. Comparing prices',
      explain: [
        'Which is the better deal? A big pack costs more money, but you also get more things. To compare fairly, find the price of just ONE item.',
        'That price is called the unit price. Divide the total price by the number of items.',
        'The smaller unit price is the better buy.'
      ],
      rule: 'Divide the price by the number of items. The smaller unit price is the better buy.',
      mistake: 'The pack with the lower total price is not always the cheaper deal. It might have fewer items.',
      steps: [
        x('Pack A has 6 pencils for $3.00. Pack B has 10 pencils for $4.50. Which is the better buy?', ['Pack A', '6 for $3.00'], ' or ', ['Pack B', '10 for $4.50']),
        x('Pack A costs $3.00 for 6 pencils. $3.00 ÷ 6 = $0.50 for one pencil.', '$3.00 ÷ 6 = ', ['$0.50', 'each']),
        x('Pack B costs $4.50 for 10 pencils. $4.50 ÷ 10 = $0.45 for one pencil.', '$4.50 ÷ 10 = ', ['$0.45', 'each']),
        x('Compare the unit prices. 45 cents is less than 50 cents.', ['$0.45', 'Pack B'], ' is less than ', ['$0.50', 'Pack A']),
        x('Pack B is the better buy, even though it costs more in total.', ['Pack B', 'better buy']),
        x('Second example. 4 erasers for $2.80 is 70 cents each. 5 erasers for $3.25 is 65 cents each. The 5 pack wins.', ['65 cents', 'is less than'], ' 70 cents')
      ] }
  ];

  /* ---------- Question skills ---------- */
  B.register(6, [

    { id: 'pct100', level: 1, name: 'Percent from a hundred grid', make: function () {
      var n = R.int(6, 94), notMode = R.int(0, 1) === 1;
      while (n === 50) n = R.int(6, 94);
      if (!notMode) {
        return N({
          skill: 'Percent from a hundred grid', prompt: 'A grid has 100 equal squares. ' + n + ' of the squares are shaded. What percent of the grid is shaded?',
          answer: n, keyboard: 'numeric', placeholder: 'Type the percent',
          traps: [T(100 - n, 'That is the percent that is NOT shaded. The question asks about the shaded squares.')],
          work: n + ' out of 100 squares is ' + n + '%.',
          plain: 'Percent means out of 100. The grid has 100 squares, so the number of shaded squares is the percent.',
          teach: [
            grid('Here is a grid of 100 equal squares.', 10, 10, []),
            grid(n + ' of the squares are shaded.', 10, 10, hg(n, 'bg-emerald-400')),
            x('Percent means out of 100. ' + n + ' out of 100 is ' + n + '%.', [String(n), 'shaded'], ' out of 100 = ', [n + '%', 'percent']),
            note('The whole is 100 squares, so the count of shaded squares is the percent.', 'Shortcut', ['Whole grid is 100 squares', 'Shaded squares are the percent'])
          ]
        });
      }
      return N({
        skill: 'Percent from a hundred grid', prompt: 'A grid has 100 equal squares. ' + n + ' of the squares are NOT shaded. What percent of the grid IS shaded?',
        answer: 100 - n, keyboard: 'numeric', placeholder: 'Type the percent',
        traps: [T(n, 'That is the percent that is NOT shaded. The question asks about the shaded squares.')],
        work: '100 − ' + n + ' = ' + (100 - n) + ', so ' + (100 - n) + '% is shaded.',
        plain: 'The shaded part and the not shaded part make 100%. Take the not shaded part away from 100.',
        teach: [
          grid('Here is the grid of 100 squares. The red squares are NOT shaded.', 10, 10, [all('bg-emerald-400')].concat(hg(n, 'bg-rose-400'))),
          x(n + ' squares are red, so they are not shaded.', [String(n), 'not shaded']),
          x('The whole grid is 100 squares. Take the red squares away: 100 − ' + n + ' = ' + (100 - n) + '.', '100 − ' + n + ' = ', [String(100 - n), 'shaded']),
          x('So ' + (100 - n) + ' out of 100 squares are shaded. That is ' + (100 - n) + '%.', [(100 - n) + '%', 'shaded'])
        ]
      });
    } },

    { id: 'convert', level: 1, name: 'Percent, decimal and fraction', make: function () {
      var mode = R.pick(['dec', 'frac', 'decpct']);
      if (mode === 'dec') {
        var n = R.pick([3, 5, 7, 8, 12, 18, 25, 35, 40, 45, 60, 72, 80, 95]);
        return N({
          skill: 'Percent as a decimal', prompt: 'Write ' + n + '% as a decimal.', answer: dec(n), placeholder: 'Like 0.35',
          traps: [T(String(n / 10), 'You moved the point only one place. Move it 2 places to the left.'), T(String(n / 1000), 'You moved the point too far. Move it exactly 2 places to the left.')],
          work: n + ' ÷ 100 = ' + dec(n) + '.',
          plain: 'Percent means out of 100. Divide by 100 by moving the decimal point 2 places left.',
          teach: [
            x(n + '% means ' + n + ' out of 100.', [n + '%', 'percent']),
            x('As a fraction, that is ' + n + ' over 100.', n + '% = ', [n + '/100', 'fraction']),
            x('Divide by 100. Move the decimal point 2 places to the left.' + (n < 10 ? ' Fill the gap with a zero.' : ''), n + ' ÷ 100 = ', [dec(n), 'decimal']),
            x('So ' + n + '% is the decimal ' + dec(n) + '.', n + '% = ', [dec(n), 'answer'])
          ]
        });
      }
      if (mode === 'frac') {
        var f = R.pick([4, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 75, 80, 90]), g = R.gcd(f, 100);
        return N({
          skill: 'Percent as a fraction', prompt: 'Write ' + f + '% as a fraction in simplest form.', answer: R.fr(f, 100), simplest: true, placeholder: 'Like 3/4',
          traps: [T('100/' + f, 'You flipped it. Percent means out of 100, so 100 goes on the bottom.'), T('1/' + f, 'That puts 1 on top. ' + f + ' out of 100 has ' + f + ' on top.')],
          work: f + '% = ' + f + '/100. Divide top and bottom by ' + g + ' to get ' + R.fr(f, 100) + '.',
          plain: 'Write the percent over 100. Then divide the top and bottom by the biggest number that fits both.',
          teach: [
            x(f + '% means ' + f + ' out of 100.', [f + '%', 'percent']),
            x('Write it as a fraction with 100 on the bottom.', f + '% = ', [f + '/100', 'fraction']),
            x('The biggest number that goes into both ' + f + ' and 100 is ' + g + '.', [String(g), 'goes into both']),
            x('Divide the top: ' + f + ' ÷ ' + g + ' = ' + (f / g) + '. Divide the bottom: 100 ÷ ' + g + ' = ' + (100 / g) + '.', f + '/100 = ', [R.fr(f, 100), 'simplest form'])
          ]
        });
      }
      var p = R.pick([3, 8, 12, 35, 40, 56, 64, 75, 90]);
      return N({
        skill: 'Decimal as a percent', prompt: 'Write ' + dec(p) + ' as a percent. Type just the number.', answer: p, keyboard: 'numeric', placeholder: 'Type the percent',
        traps: [T(String(p / 10), 'You moved the point only one place. Move it 2 places to the right.'), T(dec(p), 'That is the same decimal. To make a percent, move the point 2 places to the right.')],
        work: dec(p) + ' × 100 = ' + p + ', so it is ' + p + '%.',
        plain: 'To go from a decimal to a percent, move the point 2 places to the right.',
        teach: [
          x('We start with the decimal ' + dec(p) + '.', [dec(p), 'decimal']),
          x('A percent is out of 100. So we multiply by 100. Move the point 2 places to the right.', dec(p) + ' × 100 = ', [String(p), 'moved 2 places']),
          note('Decimal to percent means move the point 2 places right.', 'Rule', ['Percent to decimal: move the point 2 places left', 'Decimal to percent: move the point 2 places right']),
          x('So ' + dec(p) + ' is ' + p + '%.', dec(p) + ' = ', [p + '%', 'answer'])
        ]
      });
    } },

    { id: 'fracpct', level: 2, name: 'Fraction to percent', make: function () {
      var d = R.pick([2, 4, 5, 10, 20, 25, 50]), n = R.int(1, d - 1), k = 100 / d, pc = n * k;
      var prompt = R.pick(['Write ' + n + '/' + d + ' as a percent.', n + ' out of ' + d + ' stickers are gold. What percent of the stickers are gold?']);
      var teach = [
        x('We need a fraction with 100 on the bottom. The bottom is ' + d + ' now.', [n + '/' + d, 'to a percent']),
        x(d + ' × ' + k + ' = 100. So we multiply the bottom by ' + k + '.', d + ' × ', [String(k), 'multiplier'], ' = 100'),
        x('Do the same to the top. ' + n + ' × ' + k + ' = ' + pc + '.', n + ' × ' + k + ' = ', [String(pc), 'new top']),
        x('Now it is ' + pc + ' over 100. That is ' + pc + '%.', n + '/' + d + ' = ' + pc + '/100 = ', [pc + '%', 'answer'])
      ];
      if (d <= 10) teach.unshift(bars('Here is the fraction ' + n + '/' + d + ' as a bar.', [fb(n + '/' + d, d, n, 'bg-indigo-400')]));
      return N({
        skill: 'Fraction to percent', prompt: prompt, answer: pc, keyboard: 'numeric', placeholder: 'Type the percent',
        traps: [T(n, 'That is just the top number. Make the bottom 100 first, and do the same to the top.'), T(k, 'That is the percent for one piece only. You have ' + n + ' pieces.')],
        work: n + '/' + d + ' = ' + pc + '/100 = ' + pc + '%.',
        plain: 'Grow the bottom number to 100. Grow the top number by the same amount. The top is then the percent.',
        teach: teach
      });
    } },

    { id: 'bench', level: 2, name: 'Benchmark percents of an amount', make: function () {
      var p = R.pick([10, 25, 50, 75]), amt = 20 * R.int(1, 20);
      var parts = { 10: 10, 25: 4, 50: 2, 75: 4 }[p], take = p === 75 ? 3 : 1, one = amt / parts, ans = one * take;
      var word = { 10: 'one tenth', 25: 'one quarter', 50: 'one half', 75: 'three quarters' }[p];
      var wrong = { 10: [T(amt / 100, 'You divided by 100. 10% is one tenth, so divide by 10.')], 25: [T(amt / 2, 'That is half. 25% is one quarter, so divide by 4.')],
                    50: [T(amt / 4, 'That is a quarter, which is 25%. 50% is one half, so divide by 2.')], 75: [T(amt / 4, 'That is only one quarter. 75% is three quarters, so multiply by 3.')] }[p];
      var teach = [
        x(p + '% is ' + word + '. So ' + p + '% of ' + amt + ' is ' + word + ' of ' + amt + '.', [p + '%', word], ' of ' + amt),
        bars('Cut the whole into ' + parts + ' equal parts.', [fb('Whole', parts, 0, 'bg-indigo-400')]),
        x('Share ' + amt + ' into ' + parts + ' parts. ' + amt + ' ÷ ' + parts + ' = ' + one + '.', amt + ' ÷ ' + parts + ' = ', [String(one), 'one part']),
        bars('Take ' + take + (take === 1 ? ' part' : ' parts') + '.', [fb('Take ' + take, parts, take, 'bg-emerald-400')])
      ];
      if (take === 1) teach.push(x('One part is the answer. ' + p + '% of ' + amt + ' is ' + ans + '.', p + '% of ' + amt + ' = ', [String(ans), 'answer']));
      else teach.push(x('Three parts of ' + one + ' is 3 × ' + one + ' = ' + ans + '.', p + '% of ' + amt + ' = ', [String(ans), 'answer']));
      return N({
        skill: 'Benchmark percents', prompt: 'What is ' + p + '% of ' + amt + '?', answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: wrong,
        work: p + '% is ' + word + '. ' + amt + ' ÷ ' + parts + ' = ' + one + (take > 1 ? ', and 3 × ' + one + ' = ' + ans : '') + '.',
        plain: 'Use the friendly fraction. 10% is a tenth, 25% is a quarter, 50% is a half and 75% is three quarters.',
        teach: teach
      });
    } },

    { id: 'pctamt', level: 3, name: 'Percent of an amount', make: function () {
      var p = 5 * R.int(1, 19), amt = 20 * R.int(1, 20), ans = p * amt / 100;
      return N({
        skill: 'Percent of an amount', prompt: 'What is ' + p + '% of ' + amt + '?', answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(p * amt / 10, 'That is 10 times too big. Divide by 10 to get 10% first, then build the percent you need.'), T(p * amt / 1000, 'That is 10 times too small. 10% of ' + amt + ' is ' + (amt / 10) + '.'), T(p, 'That is the percent number. We need that percent OF ' + amt + '.')],
        work: '10% of ' + amt + ' = ' + (amt / 10) + '. Build ' + p + '% from that to get ' + ans + '.',
        plain: 'Find 10% by dividing by 10. Then build the percent from tens and, if needed, half a ten for the 5.',
        teach: pctSteps(amt, p, false)
      });
    } },

    { id: 'findpct', level: 3, name: 'Find the percent', make: function () {
      var w = R.pick([4, 5, 10, 20, 25, 50]), part = R.int(1, w - 1), k = 100 / w, ans = part * k;
      var t = R.pick([
        part + ' out of ' + w + ' students in a class wear glasses. What percent wear glasses?',
        'A team played ' + w + ' games and won ' + part + '. What percent of the games did the team win?',
        'Sam answered ' + part + ' out of ' + w + ' quiz questions correctly. What percent is that?',
        'A jar holds ' + w + ' marbles. ' + part + ' of them are blue. What percent are blue?'
      ]);
      return N({
        skill: 'Find the percent', prompt: t, answer: ans, keyboard: 'numeric', placeholder: 'Type the percent',
        traps: [T(part, 'That is the number of parts, not the percent. Make the bottom of the fraction 100 first.'), T(100 - ans, 'That is the percent that is left over. The question asks about the ' + part + '.')],
        work: part + '/' + w + ' = ' + ans + '/100 = ' + ans + '%.',
        plain: 'Write part over whole. Multiply top and bottom by the same number to make the bottom 100.',
        teach: [
          x(part + ' out of ' + w + '. Part on top, whole on the bottom.', [part + '/' + w, 'part over whole']),
          x(w + ' × ' + k + ' = 100. So we multiply the bottom by ' + k + '.', w + ' × ', [String(k), 'multiplier'], ' = 100'),
          x('Do the same to the top. ' + part + ' × ' + k + ' = ' + ans + '.', part + ' × ' + k + ' = ', [String(ans), 'new top']),
          x(ans + ' over 100 is ' + ans + '%.', part + '/' + w + ' = ', [ans + '%', 'answer'])
        ]
      });
    } },

    { id: 'change', level: 3, name: 'Making change', make: function () {
      var pay, a, b, tot;
      for (var t = 0; t < 400; t++) {
        pay = R.pick([1000, 2000, 2000, 5000]);
        a = 5 * R.int(60, 700); b = 5 * R.int(40, 500); tot = a + b;
        if (tot % 100 !== 0 && tot < pay - 100) break;
      }
      var nextD = Math.ceil(tot / 100) * 100, j1 = nextD - tot, j2 = pay - nextD, ch = pay - tot;
      var it = R.pick([['a notebook', 'a pen set'], ['a sandwich', 'a juice'], ['a comic book', 'a bookmark'], ['a toy car', 'a sticker pack']]);
      return N({
        skill: 'Making change', prompt: 'Jo buys ' + it[0] + ' for ' + usd(a) + ' and ' + it[1] + ' for ' + usd(b) + '. She pays with a ' + usd(pay) + ' bill. How many dollars of change does she get?',
        answer: money(ch), keyboard: 'text', placeholder: 'Like 6.35',
        traps: [T(money(tot), 'That is the total cost. Change is what comes back, so take the total away from ' + usd(pay) + '.'), T(money(pay - a), 'You only took away the first item. Add both prices first, then find the change.')],
        work: usd(a) + ' + ' + usd(b) + ' = ' + usd(tot) + '. ' + usd(pay) + ' − ' + usd(tot) + ' = ' + usd(ch) + '.',
        plain: 'Add up everything she bought. Then count up from that total to the bill she paid.',
        teach: [
          x('First add the two prices. ' + usd(a) + ' + ' + usd(b) + ' = ' + usd(tot) + '.', usd(a) + ' + ' + usd(b) + ' = ', [usd(tot), 'total cost']),
          x('Count up from ' + usd(tot) + ' to the next whole dollar, ' + usd(nextD) + '. That jump is ' + usd(j1) + '.', usd(tot) + ' + ', [usd(j1), 'jump one'], ' = ' + usd(nextD)),
          x('Now count up from ' + usd(nextD) + ' to ' + usd(pay) + '. That jump is ' + usd(j2) + '.', usd(nextD) + ' + ', [usd(j2), 'jump two'], ' = ' + usd(pay)),
          x('Add the jumps: ' + usd(j1) + ' + ' + usd(j2) + ' = ' + usd(ch) + '.', usd(j1) + ' + ' + usd(j2) + ' = ', [usd(ch), 'change']),
          x('Check by taking away. ' + usd(pay) + ' − ' + usd(tot) + ' = ' + usd(ch) + '.', usd(pay) + ' − ' + usd(tot) + ' = ', [usd(ch), 'same answer'])
        ]
      });
    } },

    { id: 'discount', level: 4, name: 'Discounts and sale prices', make: function () {
      var price = 20 * R.int(1, 10), p = R.pick([10, 15, 20, 25, 30, 50]), disc = price * p / 100, sale = price - disc;
      var item = R.pick(['jacket', 'video game', 'backpack', 'pair of shoes', 'skateboard', 'bike helmet']);
      var askSale = R.int(0, 1) === 1;
      var steps = pctSteps(price, p, true);
      if (askSale) {
        steps.push(x('Now take the discount away from the price. $' + price + ' − $' + disc + ' = $' + sale + '.', '$' + price + ' − $' + disc + ' = ', [usd(sale * 100), 'sale price']));
        return N({
          skill: 'Sale price', prompt: 'A ' + item + ' costs $' + price + '. It is on sale for ' + p + '% off. What is the sale price in dollars?',
          answer: sale, keyboard: 'numeric', placeholder: 'Type dollars',
          traps: [T(disc, 'That is the discount, the money taken off. The sale price is what you still pay.'), T(price + disc, 'Off means take away, not add. The sale price is less than the price.')],
          work: p + '% of $' + price + ' = $' + disc + '. $' + price + ' − $' + disc + ' = $' + sale + '.',
          plain: 'Find how much comes off. Then take it away from the price.',
          teach: steps
        });
      }
      return N({
        skill: 'Discount amount', prompt: 'A ' + item + ' costs $' + price + '. It is on sale for ' + p + '% off. How many dollars does the discount save you?',
        answer: disc, keyboard: 'numeric', placeholder: 'Type dollars',
        traps: [T(sale, 'That is the sale price you pay. The question asks how much you SAVE.'), T(price, 'That is the full price. The discount is only ' + p + '% of it.')],
        work: p + '% of $' + price + ' = $' + disc + '.',
        plain: 'The discount is the percent of the price. Build it from 10% and 5%.',
        teach: steps
      });
    } },

    { id: 'taxtip', level: 4, name: 'Tax and tips', make: function () {
      var mode = R.pick(['tax', 'tip', 'taxtotal', 'tiptotal']);
      var item = R.pick(['a video game', 'a soccer ball', 'a puzzle', 'a lunch', 'a toy robot']);
      var price, rate, extra, tot, steps, prompt, ans, traps, skill;
      if (mode === 'tax' || mode === 'tip') {
        price = 20 * R.int(1, 10);
        rate = mode === 'tax' ? R.pick([5, 10]) : R.pick([10, 15, 20]);
        extra = price * rate / 100; ans = extra;
        steps = pctSteps(price, rate, true);
        if (mode === 'tax') {
          prompt = 'A price tag on ' + item + ' says $' + price + '. The sales tax is ' + rate + '%. How many dollars of tax do you pay?'; skill = 'Sales tax amount';
          traps = [T(price + extra, 'That is the price plus the tax. The question asks only for the tax.'), T(rate, 'That is the tax rate. We need ' + rate + '% of $' + price + '.')];
        } else {
          prompt = 'A family dinner bill is $' + price + '. They leave a ' + rate + '% tip. How many dollars is the tip?'; skill = 'Tip amount';
          traps = [T(price + extra, 'That is the bill plus the tip. The question asks only for the tip.'), T(rate, 'That is the tip rate. We need ' + rate + '% of $' + price + '.')];
        }
        return N({ skill: skill, prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type dollars', traps: traps,
          work: rate + '% of $' + price + ' = $' + extra + '.', plain: 'Find the percent of the price. Build it from 10% and 5%.', teach: steps });
      }
      price = 10 * R.int(1, 19);
      var tax = mode === 'taxtotal';
      rate = tax ? R.pick([5, 10]) : R.pick([10, 15, 20]);
      var priceC = price * 100, extraC = price * rate; tot = priceC + extraC;
      steps = pctSteps(price, rate, true);
      steps.push(x('Now ADD it on. ' + usd(priceC) + ' + ' + usd(extraC) + ' = ' + usd(tot) + '.', usd(priceC) + ' + ' + usd(extraC) + ' = ', [usd(tot), 'total']));
      return N({
        skill: tax ? 'Total with sales tax' : 'Total with a tip',
        prompt: tax ? 'A ' + R.pick(['game', 'book', 'toy', 'jacket']) + ' costs $' + price + ' before tax. The sales tax is ' + rate + '%. How many dollars do you pay in total?'
                    : 'A meal costs $' + price + '. Mia adds a ' + rate + '% tip. How many dollars does she pay in total?',
        answer: money(tot), keyboard: 'text', placeholder: 'Like 31.50',
        traps: [T(money(extraC), 'That is only the ' + (tax ? 'tax' : 'tip') + '. The total is the price PLUS the ' + (tax ? 'tax' : 'tip') + '.'), T(price, 'That is the price with nothing added. Do not forget the ' + (tax ? 'tax' : 'tip') + '.')],
        work: rate + '% of $' + price + ' = ' + usd(extraC) + '. $' + price + ' + ' + usd(extraC) + ' = ' + usd(tot) + '.',
        plain: 'Find the percent of the price, then add it to the price.',
        teach: steps
      });
    } },

    { id: 'budget', level: 5, name: 'Savings and budgets', make: function () {
      var W = 10 * R.int(4, 20), a = 10 * R.int(1, 5), b = 10 * R.int(1, 5);
      while (a + b > 80) { b = 10 * R.int(1, 5); }
      var ten = W / 10, sv = a / 10 * ten, sp = b / 10 * ten, left = W - sv - sp, lp = 100 - a - b;
      var segs = [], i;
      for (i = 0; i < 10; i++) segs.push([i < a / 10 ? 'bg-emerald-400' : (i < (a + b) / 10 ? 'bg-amber-300' : 'bg-slate-200')]);
      var t = R.pick([['Mia has $' + W + '. She saves ' + a + '% and spends ' + b + '% on snacks. How many dollars are left?', 'saves', 'spends'],
                      ['Sam earns $' + W + ' mowing lawns. He puts ' + a + '% in the bank and spends ' + b + '% on a game. How many dollars are left?', 'banks', 'spends']]);
      return N({
        skill: 'Savings and budgets', prompt: t[0], answer: left, keyboard: 'numeric', placeholder: 'Type dollars',
        traps: [T(sv + sp, 'That is the money already used. The question asks how much is LEFT.'), T(lp, 'That is the percent left. Now find that percent of $' + W + '.'), T(sv, 'That is only the money saved. Take away the spent money as well.')],
        work: '10% of $' + W + ' = $' + ten + '. ' + a + '% is $' + sv + ' and ' + b + '% is $' + sp + '. $' + W + ' − $' + sv + ' − $' + sp + ' = $' + left + '.',
        plain: 'Find 10% of the money. Use it to find each part. Then take the parts away from the total.',
        teach: [
          x('We start with $' + W + '. First find 10%. Divide by 10.', '10% of $' + W + ' = ', ['$' + ten, '10%']),
          bars('Cut $' + W + ' into 10 parts of $' + ten + '. Green is saved, yellow is spent, grey is left.', [mk('$' + W + ' is 100%', segs, 'each part is $' + ten)]),
          x(a + '% is ' + (a / 10) + ' parts. ' + (a / 10) + ' × $' + ten + ' = $' + sv + '.', a + '% of $' + W + ' = ', ['$' + sv, 'saved']),
          x(b + '% is ' + (b / 10) + ' parts. ' + (b / 10) + ' × $' + ten + ' = $' + sp + '.', b + '% of $' + W + ' = ', ['$' + sp, 'spent']),
          x('Add what was used. $' + sv + ' + $' + sp + ' = $' + (sv + sp) + '.', '$' + sv + ' + $' + sp + ' = ', ['$' + (sv + sp), 'used']),
          x('Take it away from the total. $' + W + ' − $' + (sv + sp) + ' = $' + left + '.', '$' + W + ' − $' + (sv + sp) + ' = ', ['$' + left, 'left'])
        ]
      });
    } },

    { id: 'compare', level: 5, name: 'Comparing prices', make: function () {
      var u1 = 5 * R.int(8, 20), u2, sizes = R.shuffle([R.pick([4, 5, 6, 8]), R.pick([10, 12, 15, 20])]);
      u2 = u1 - 5 * R.int(1, 3);
      var aCheap = R.int(0, 1) === 1;
      var uA = aCheap ? u2 : u1, uB = aCheap ? u1 : u2, nA = sizes[0], nB = sizes[1];
      var tA = uA * nA, tB = uB * nB, thing = R.pick(['markers', 'stickers', 'granola bars', 'juice boxes']);
      var okText = aCheap ? 'Pack A is cheaper for each one' : 'Pack B is cheaper for each one';
      var badText = aCheap ? 'Pack B is cheaper for each one' : 'Pack A is cheaper for each one';
      var lowTotal = tA < tB ? 'Pack A' : 'Pack B';
      return Q.choice({
        skill: 'Comparing prices', prompt: 'Pack A has ' + nA + ' ' + thing + ' for ' + usd(tA) + '. Pack B has ' + nB + ' ' + thing + ' for ' + usd(tB) + '. Which pack costs less for each one?',
        options: [
          { text: okText, ok: true },
          { text: badText, ok: false, trap: 'Not quite. Divide each price by the number of items to find the price of one. Then compare.' },
          { text: 'They cost the same for each one', ok: false, trap: 'The prices for one item are ' + usd(uA) + ' and ' + usd(uB) + '. They are different.' }
        ].concat(lowTotal !== (aCheap ? 'Pack A' : 'Pack B') ? [{ text: lowTotal + ' is cheaper because its total price is lower', ok: false, trap: 'A lower total price does not mean a lower price for each one. The packs have different numbers of items.' }] : []),
        work: 'Pack A: ' + usd(tA) + ' ÷ ' + nA + ' = ' + usd(uA) + ' each. Pack B: ' + usd(tB) + ' ÷ ' + nB + ' = ' + usd(uB) + ' each.',
        plain: 'Find the price of one item in each pack. The smaller price for one is the better buy.',
        teach: [
          x('The packs have different sizes, so we find the price of ONE item in each pack.', ['Pack A', nA + ' for ' + usd(tA)], ' or ', ['Pack B', nB + ' for ' + usd(tB)]),
          x('Pack A: ' + usd(tA) + ' ÷ ' + nA + ' = ' + usd(uA) + ' for one.', usd(tA) + ' ÷ ' + nA + ' = ', [usd(uA), 'each']),
          x('Pack B: ' + usd(tB) + ' ÷ ' + nB + ' = ' + usd(uB) + ' for one.', usd(tB) + ' ÷ ' + nB + ' = ', [usd(uB), 'each']),
          x('Compare. ' + usd(Math.min(uA, uB)) + ' is less than ' + usd(Math.max(uA, uB)) + '.', [usd(Math.min(uA, uB)), 'smaller'], ' is less than ', [usd(Math.max(uA, uB)), 'bigger']),
          x((aCheap ? 'Pack A' : 'Pack B') + ' is the better buy.', [aCheap ? 'Pack A' : 'Pack B', 'better buy'])
        ]
      });
    } },

    { id: 'reverse', level: 6, name: 'Find the original price', make: function () {
      var p = R.pick([10, 20, 30, 40, 50, 60]), k = (100 - p) / 10, v = R.int(2, 20), orig = 10 * v, sale = k * v;
      var addC = sale * (100 + p);
      var segs = [], i;
      for (i = 0; i < 10; i++) segs.push([i < p / 10 ? 'bg-rose-400' : 'bg-emerald-400']);
      return N({
        skill: 'Find the original price', prompt: 'A coat is on sale for ' + p + '% off. The sale price is $' + sale + '. What was the original price in dollars?',
        answer: orig, keyboard: 'numeric', placeholder: 'Type dollars',
        traps: [T(money(addC), 'You added ' + p + '% of the sale price. But the ' + p + '% came off the ORIGINAL price, so start from the ' + (100 - p) + '% you know.'), T(sale + p, 'You added the percent number to the price. That does not work. Use parts of the whole.')],
        work: (100 - p) + '% is $' + sale + '. That is ' + k + ' parts, so 1 part is $' + sale + ' ÷ ' + k + ' = $' + v + '. 10 parts is $' + orig + '.',
        plain: 'The whole price is 10 equal parts. The sale price is ' + k + ' of those parts. Find one part, then find all 10.',
        teach: [
          x('The sale price is what is left after ' + p + '% came off. So $' + sale + ' is ' + (100 - p) + '% of the original price.', ['$' + sale, (100 - p) + '% of the original']),
          bars('Cut the original price into 10 equal parts. Red is the discount. Green is what we pay.', [mk('Original price', segs, 'green parts: ' + k)]),
          x('The ' + k + ' green parts are $' + sale + '.', k + ' parts = ', ['$' + sale, 'sale price']),
          x('Find one part. $' + sale + ' ÷ ' + k + ' = $' + v + '.', '$' + sale + ' ÷ ' + k + ' = ', ['$' + v, 'one part']),
          x('The original price is all 10 parts. 10 × $' + v + ' = $' + orig + '.', '10 × $' + v + ' = ', ['$' + orig, 'original price']),
          x('Check. ' + p + '% of $' + orig + ' is $' + (orig * p / 100) + '. And $' + orig + ' − $' + (orig * p / 100) + ' = $' + sale + '.', ['$' + sale, 'matches'])
        ]
      });
    } },

    { id: 'multistep', level: 6, name: 'Discount then tax', make: function () {
      var price = 40 * R.int(1, 5), p = R.pick([10, 20, 25, 50]), div = { 10: 10, 20: 5, 25: 4, 50: 2 }[p];
      var disc = price / div, sale = price - disc, taxC = sale * 5, totC = sale * 105;
      var frac = { 10: 'one tenth', 20: 'one fifth', 25: 'one quarter', 50: 'one half' }[p];
      return N({
        skill: 'Discount then tax', prompt: 'Shoes cost $' + price + '. The store takes ' + p + '% off. Then 5% tax is added to the sale price. How many dollars do you pay in total?',
        answer: money(totC), keyboard: 'text', placeholder: 'Like 31.50',
        traps: [T(money(price * 105), 'You added the tax to the full price. The tax is worked out on the SALE price, after the discount.'), T(sale, 'That is the sale price before tax. Do not forget to add the 5% tax.'), T(money(taxC), 'That is only the tax. Add it to the sale price.')],
        work: p + '% of $' + price + ' = $' + disc + '. Sale price $' + sale + '. Tax is 5% of $' + sale + ' = ' + usd(taxC) + '. Total ' + usd(totC) + '.',
        plain: 'Do it in order. First take off the discount. Then work out the tax on the new price. Then add the tax.',
        teach: [
          x(p + '% is ' + frac + '. So the discount is $' + price + ' ÷ ' + div + ' = $' + disc + '.', p + '% of $' + price + ' = ', ['$' + disc, 'discount']),
          x('Take it off the price. $' + price + ' − $' + disc + ' = $' + sale + '.', '$' + price + ' − $' + disc + ' = ', ['$' + sale, 'sale price']),
          x('Tax is on the sale price. 10% of $' + sale + ' is ' + usd(sale * 10) + '.', '10% of $' + sale + ' = ', [usd(sale * 10), '10%']),
          x('5% is half of that. Half of ' + usd(sale * 10) + ' is ' + usd(taxC) + '.', '5% of $' + sale + ' = ', [usd(taxC), 'tax']),
          x('Add the tax to the sale price. $' + sale + ' + ' + usd(taxC) + ' = ' + usd(totC) + '.', '$' + sale + ' + ' + usd(taxC) + ' = ', [usd(totC), 'total'])
        ]
      });
    } }
  ]);
})();
