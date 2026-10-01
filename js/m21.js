/* Module 21: Budgets and Smart Spending. Lessons, vocabulary and question skills. */
(function () {
  'use strict';
  var B = window.Bank, R = B.R, S = B.s, Q = B.q, T = Q.trap;
  var x = S.x, note = S.note, bars = S.bars, row = S.row, groups = S.groups, lines = S.lines;

  /* ---------- Helpers: money is worked in cents so there are no floating point slips ---------- */
  function m(c) { return (c / 100).toFixed(2); }
  function usd(c) { return '$' + m(c); }
  function dl(c) { return '$' + (c % 100 === 0 ? String(c / 100) : m(c)); }
  function ans(c) { return c % 100 === 0 ? String(c / 100) : m(c); }
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
  function sum(a) { return a.reduce(function (p, c) { return p + c; }, 0); }
  function cap1(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  /* A budget table drawn with text. rows are [name, cents]. */
  function budgetLines(head, items) {
    var w = 4;
    items.forEach(function (it) { if (it[0].length > w) w = it[0].length; });
    w += 3;
    var out = [pad('', 0) + pad(head[0], w) + head[1]];
    items.forEach(function (it) { out.push(pad(it[0], w) + (typeof it[1] === 'string' ? it[1] : dl(it[1]))); });
    return out;
  }
  var SPEND = ['snacks', 'a comic book', 'a movie ticket', 'a toy', 'stickers', 'a game', 'bubble tea', 'a book', 'a hockey card pack', 'a school lunch'];
  var JOBS = [['dog walk', 'walking a neighbour dog'], ['car wash', 'washing a car'], ['lawn', 'raking a lawn'], ['lemonade sale', 'running a lemonade stand'], ['snow job', 'shovelling a driveway']];

  /* ---------- Vocabulary ---------- */
  window.MATH_VOCAB[21] = [
    { w: 'Income', m: 'Money that comes in to you, like allowance or pay for a job.' },
    { w: 'Expense', m: 'Money that goes out when you spend it on something.' },
    { w: 'Savings', m: 'Money you keep and do not spend right now.' },
    { w: 'Budget', m: 'A plan for how much money will come in and how you will spend it and save it.' },
    { w: 'Need', m: 'Something you must have to live and be safe, like food, a warm coat and a home.' },
    { w: 'Want', m: 'Something that is nice to have but you can live without, like a new game.' },
    { w: 'Savings goal', m: 'An amount of money you are saving up for something special.' },
    { w: 'Unit price', m: 'The price of one item. It helps you compare deals fairly.' }
  ];

  /* ---------- Lessons ---------- */
  window.MATH_LESSONS[21] = [
    { title: '1. Income, expenses and savings',
      explain: [
        'Income is money that comes in. It might be allowance, a gift, or pay for doing a job.',
        'An expense is money that goes out when you buy something. Savings is money that you keep for later.',
        'A simple rule ties them together. Income minus expenses is what is left. What is left can go into savings.'
      ],
      rule: 'Income − expenses = money left. Money left can be savings.',
      mistake: 'Do not add the expenses to the income. Money you spend goes out, so take it away.',
      steps: [
        note('Rinka gets $20 allowance. She buys a comic for $6 and stickers for $4.', 'The story', ['Income: $20', 'Expense: comic $6', 'Expense: stickers $4']),
        bars('The whole bar is her $20 income. Some is spent. The rest is left.', [row('Income $20', 10, 'bg-emerald-400', '2'), row('Spent $10', 5, 'bg-rose-400', '2')]),
        x('Add up the expenses first. 6 + 4 = 10.', '6 + 4 = ', ['$10', 'expenses']),
        x('Take the expenses from the income. 20 − 10 = 10.', '20 − 10 = ', ['$10', 'left']),
        x('Rinka can save the $10 that is left.', ['$10', 'savings'])
      ] },

    { title: '2. Needs and wants',
      explain: [
        'A need is something you must have to live and be safe. Food, a warm coat, a place to live and school supplies are needs.',
        'A want is something that is nice to have but you can live without it. A new video game, candy and a movie ticket are wants.',
        'Needs come first in a budget. Wants come after the needs are paid for.'
      ],
      rule: 'Can you live safely without it? If yes, it is a want. If no, it is a need.',
      mistake: 'Some items look like needs but are wants. You need a coat, but you do not need the most costly brand.',
      steps: [
        note('Ask one question. Can I live safely and go to school without it?', 'How to decide', ['If no, it is a need', 'If yes, it is a want']),
        lines('Sort some items into two lists.', ['NEEDS               WANTS', 'Dinner groceries     Video game', 'Winter coat         Candy', 'School notebooks    Movie ticket'], 0),
        x('A bus pass to get to school is a need. You must get to school.', ['Bus pass', 'need']),
        x('Bubble tea is a want. It is a treat, but you can live without it.', ['Bubble tea', 'want']),
        note('Pay for needs first. Then use what is left for wants and savings.', 'Budget order', ['Needs first', 'Savings next', 'Wants with what is left'])
      ] },

    { title: '3. Reading a budget table',
      explain: [
        'A budget table lists the money coming in and the money going out. Each row is one item with its amount.',
        'Read the table from top to bottom. Find the income, then the expenses, then the savings.',
        'If the table is complete, the expenses and the savings add up to the income.'
      ],
      rule: 'Expenses + savings = income. Use it to check or to find a missing number.',
      mistake: 'Do not forget any row. Add every expense before you compare to the income.',
      steps: [
        lines('Sam has a monthly budget table.', budgetLines(['Item', 'Amount'], [['Income', 40], ['Snacks', 12], ['Games', 8], ['Savings', 20]].map(function (r) { return [r[0], r[1] * 100]; })), 0),
        x('Add the money going out and saved. 12 + 8 + 20 = 40.', '12 + 8 + 20 = ', ['$40', 'total']),
        x('That equals the income of $40. The budget is balanced.', ['$40', 'income'], ' = ', ['$40', 'plan']),
        x('Now a missing number. Income is $40. Snacks is $12 and games is $8. How much is left for savings?', '40 − 12 − 8 = ', ['$20', 'savings']),
        note('Work in two steps.', 'Missing number', ['Add the amounts you know', 'Take that total away from the income'])
      ] },

    { title: '4. How much money is left?',
      explain: [
        'To find money that is left, first add up all the expenses. Then take that total from the income.',
        'You can take away one expense at a time too. Both ways give the same answer.',
        'Money left is important. It shows what you can save or use later.'
      ],
      rule: 'Add the expenses. Take the total from the income.',
      mistake: 'Do not take away only one expense. Take away all of them.',
      steps: [
        x('Mia has $25. She spends $7, $5 and $6. How much is left?', ['$25', 'income'], ' spends ', ['$7 + $5 + $6', 'expenses']),
        x('Add the expenses. 7 + 5 = 12. 12 + 6 = 18.', '7 + 5 + 6 = ', ['$18', 'spent']),
        bars('Show it in a bar. The whole bar is $25. The spent part is $18.', [row('Income $25', 5, 'bg-emerald-400', '5'), row('Spent $18', 4, 'bg-rose-400', '')]),
        x('Take away. 25 − 18 = 7.', '25 − 18 = ', ['$7', 'left']),
        x('Check by adding. 18 + 7 = 25.', '18 + 7 = ', ['$25', 'matches'])
      ] },

    { title: '5. Savings goals',
      explain: [
        'A savings goal is an amount you want to reach, like $60 for a new bike helmet.',
        'To see how far you have to go, take what you already saved from the goal. The answer is how much more you need.',
        'Saving over time works too. If you save $5 each week, then after 4 weeks you have 4 × $5 = $20.'
      ],
      rule: 'Still needed = goal − saved so far.',
      mistake: 'Do not add the goal and the savings. Take away to see what is still needed.',
      steps: [
        x('Leo wants a $60 helmet. He has saved $35. How much more does he need?', ['$60', 'goal'], ' and ', ['$35', 'saved']),
        bars('The whole bar is the goal. The saved part is $35. The empty part is what is still needed.', [row('Goal $60', 12, 'bg-slate-300', '5'), row('Saved $35', 7, 'bg-emerald-400', '5')]),
        x('Count up from 35 to 60. 35 + 25 = 60.', '35 + ', ['25', 'still needed'], ' = 60'),
        x('Or subtract. 60 − 35 = 25.', '60 − 35 = ', ['$25', 'still needed']),
        x('Saving $5 a week for 4 weeks gives 4 × 5 = 20.', '4 × 5 = ', ['$20', 'saved'])
      ] },

    { title: '6. How many weeks to reach a goal?',
      explain: [
        'When you save the same amount every week, you can find how many weeks it will take. Divide the amount you still need by the amount you save each week.',
        'For example, if you need $40 more and save $8 each week, ask how many 8s fit into 40.',
        'If you already have some money saved, take it from the goal first. Then divide.'
      ],
      rule: 'Weeks = amount still needed ÷ amount saved each week.',
      mistake: 'Do not divide the whole goal if you have already saved some. Take the saved money away first.',
      steps: [
        x('Ana needs $40 more. She saves $8 each week. How many weeks?', ['$40', 'still needed'], ' ÷ ', ['$8', 'each week']),
        bars('Each box is one week of saving. Each box is $8.', [row('Week by week', 5, 'bg-emerald-400', '8', '$40')]),
        x('Count the boxes. 8, 16, 24, 32, 40. That is 5 weeks.', '40 ÷ 8 = ', ['5', 'weeks']),
        x('Now with money already saved. Goal $90. Saved $30. Saves $10 a week.', ['$90', 'goal'], ' and ', ['$30', 'saved']),
        x('Take away first. 90 − 30 = 60 still needed.', '90 − 30 = ', ['$60', 'needed']),
        x('Then divide. 60 ÷ 10 = 6 weeks.', '60 ÷ 10 = ', ['6', 'weeks'])
      ] },

    { title: '7. Percent of income saved',
      explain: [
        'Percent means out of 100. Saving 10 percent of your income means saving 10 dollars from every 100 dollars.',
        'Some percents are easy to find. 50 percent is half. 25 percent is a quarter. 10 percent is one tenth. 20 percent is two tenths.',
        'If you know the amount saved and the income, you can also find the percent. Ask what part of the income was saved.'
      ],
      rule: '50% is half. 25% is a quarter. 10% is a tenth. 20% is two tenths.',
      mistake: 'Do not divide by the percent number. For 25 percent, divide by 4, not by 25.',
      steps: [
        x('Ava earns $40. She saves 25 percent. 25 percent is one quarter.', ['25%', 'a quarter'], ' of ', ['$40', 'income']),
        x('Divide by 4. 40 ÷ 4 = 10.', '40 ÷ 4 = ', ['$10', 'saved']),
        x('Now 10 percent of $40. Divide by 10.', '40 ÷ 10 = ', ['$4', '10%']),
        x('20 percent is double 10 percent. 4 × 2 = 8.', '4 × 2 = ', ['$8', '20%']),
        x('Going backward. Sam earns $50 and saves $10. Ten is one fifth of 50, which is 20 percent.', '$10 out of $50 = ', ['20%', 'saved'])
      ] },

    { title: '8. Unit price',
      explain: [
        'The unit price is the price of one item. It is the total price divided by the number of items.',
        'If a pack of 4 juice boxes costs $3.00, one juice box costs $3.00 ÷ 4 = $0.75.',
        'Working in cents makes dividing easier. 300 cents ÷ 4 = 75 cents.'
      ],
      rule: 'Unit price = total price ÷ number of items.',
      mistake: 'Do not divide the number of items by the price. Divide the price by the number of items.',
      steps: [
        x('A pack of 4 juice boxes costs $3.00. What does one cost?', ['$3.00', 'total'], ' ÷ ', ['4', 'items']),
        x('Change to cents. $3.00 is 300 cents.', '$3.00 = ', ['300', 'cents']),
        x('Divide by 4. 300 ÷ 4 = 75 cents.', '300 ÷ 4 = ', ['75', 'cents each']),
        x('Change back to dollars. 75 cents is $0.75.', '75 cents = ', ['$0.75', 'one juice box']),
        x('Check. 4 × $0.75 = $3.00.', '4 × 0.75 = ', ['$3.00', 'matches'])
      ] },

    { title: '9. Comparing unit prices',
      explain: [
        'Bigger packs are not always a better deal. To compare fairly, find the unit price of each pack. The lower unit price is the better buy.',
        'Suppose one store sells 4 pens for $6.00 and another sells 6 pens for $8.40. It is hard to compare directly, because the packs are different sizes.',
        'Find the price of one pen in each store. Then compare.'
      ],
      rule: 'Find the price of one for each. The lower price of one is the better buy.',
      mistake: 'A lower total price is not always the better deal. The packs may hold different numbers of items.',
      steps: [
        lines('Two deals for pens.', ['Store A   4 pens   $6.00', 'Store B   6 pens   $8.40'], 0),
        x('Store A. 600 cents ÷ 4 = 150 cents each.', '600 ÷ 4 = ', ['$1.50', 'each at A']),
        x('Store B. 840 cents ÷ 6 = 140 cents each.', '840 ÷ 6 = ', ['$1.40', 'each at B']),
        x('$1.40 is less than $1.50. Store B is the better buy.', ['$1.40', 'B'], ' < ', ['$1.50', 'A']),
        x('How much do you save on each pen? 1.50 − 1.40 = 0.10.', '1.50 − 1.40 = ', ['$0.10', 'saved per pen'])
      ] },

    { title: '10. Allowance and earning',
      explain: [
        'Income can come from allowance, gifts or jobs. To find the total, multiply the amount you get each time by the number of times.',
        'Then add other money, like a birthday gift. After that, take away what you spend.',
        'Do one step at a time. Write down the answer for each step.'
      ],
      rule: 'Earn: amount × times. Add gifts. Take away spending.',
      mistake: 'Do not forget to multiply by the number of weeks or jobs before you add or subtract.',
      steps: [
        note('Rinka gets $6 allowance each week for 5 weeks. She also gets a $10 gift. She buys a $25 game.', 'The story', ['$6 each week for 5 weeks', 'Gift of $10', 'Spends $25']),
        x('Step one. Allowance. 5 × 6 = 30.', '5 × 6 = ', ['$30', 'allowance']),
        x('Step two. Add the gift. 30 + 10 = 40.', '30 + 10 = ', ['$40', 'total income']),
        x('Step three. Take away the game. 40 − 25 = 15.', '40 − 25 = ', ['$15', 'left']),
        x('Rinka has $15 left.', ['$15', 'answer'])
      ] },

    { title: '11. A smart savings plan',
      explain: [
        'A smart plan uses several ideas together. Decide how much of your income to save. Then find how long it takes to reach your goal.',
        'Start by finding the weekly savings. If you save 25 percent of a $40 allowance, that is $10 each week.',
        'Then take away what you already saved and divide to get the number of weeks.'
      ],
      rule: 'Weekly savings first. Then amount still needed ÷ weekly savings.',
      mistake: 'Do not mix up the weekly income with the weekly savings. Only the saved part counts toward the goal.',
      steps: [
        note('Kai gets $40 allowance each week. He saves 25 percent. He wants a $100 skateboard and has $20 saved.', 'The plan', ['Weekly allowance $40', 'Saves 25%', 'Goal $100', 'Saved so far $20']),
        x('Step one. 25 percent of $40 is a quarter. 40 ÷ 4 = 10.', '40 ÷ 4 = ', ['$10', 'saved each week']),
        x('Step two. How much more is needed? 100 − 20 = 80.', '100 − 20 = ', ['$80', 'still needed']),
        x('Step three. How many weeks? 80 ÷ 10 = 8.', '80 ÷ 10 = ', ['8', 'weeks']),
        x('Check. 8 weeks × $10 = $80. Add the $20 he already has to reach $100.', '80 + 20 = ', ['$100', 'goal'])
      ] }
  ];

  /* ---------- Question skills ---------- */
  var NEEDS = [
    ['A warm winter coat', 'You need a coat to stay warm in winter.'],
    ['Groceries for dinner', 'Everyone needs food to live.'],
    ['A bus pass to get to school', 'You must get to school.'],
    ['School notebooks and pencils', 'You need supplies to learn.'],
    ['Toothpaste', 'You need it to keep your teeth healthy.'],
    ['Rent for the family home', 'A safe home is a need.'],
    ['A rain jacket for walking to school', 'You need to stay dry and safe on the way to school.']
  ];
  var WANTS = [
    ['A new video game', 'You can live safely without a game.'],
    ['Candy and chips', 'Treats are nice, but you can live without them.'],
    ['A movie ticket', 'A movie is fun, but not something you must have.'],
    ['Bubble tea', 'It is a treat, not something you must have.'],
    ['A toy robot', 'Toys are fun, but you can live without one.'],
    ['A fancy phone case', 'It is nice to have, but you do not need it.'],
    ['Concert tickets', 'A concert is fun, but you can live without it.']
  ];

  B.register(21, [

    { id: 'incomeexp', level: 1, name: 'Income minus an expense', make: function () {
      var inc = R.pick([10, 15, 20, 25, 30, 40, 50]), spend = R.int(2, inc - 2), it = R.pick(SPEND);
      var ph = R.pick(['Mia gets $' + inc + ' allowance. She spends $' + spend + ' on ' + it + '. How many dollars can she save?',
        'Sam earns $' + inc + ' this week. He buys ' + it + ' for $' + spend + '. How many dollars does he have left?']);
      return N({
        skill: 'Income minus an expense', prompt: ph, answer: inc - spend, placeholder: 'Type a number',
        traps: [T(String(inc + spend), 'You added. Money spent goes out, so take it away from the income.'), T(String(spend), 'That is the amount spent. The question asks how much is left.')],
        work: inc + ' − ' + spend + ' = ' + (inc - spend) + '.', plain: 'What is left is the income minus what you spent.',
        teach: [
          x('The income is $' + inc + '. The expense is $' + spend + '.', [dl(inc * 100), 'income'], ' and ', [dl(spend * 100), 'expense']),
          bars('The whole bar is the income. Part of it is spent.', [row('Income $' + inc, inc / 5, 'bg-emerald-400', '5'), row('Spent $' + spend, Math.round(spend / 5), 'bg-rose-400', '')]),
          x('Take away what was spent. ' + inc + ' − ' + spend + ' = ' + (inc - spend) + '.', inc + ' − ' + spend + ' = ', [dl((inc - spend) * 100), 'left']),
          x('Check by adding. ' + (inc - spend) + ' + ' + spend + ' = ' + inc + '.', (inc - spend) + ' + ' + spend + ' = ', [dl(inc * 100), 'matches'])
        ]
      });
    } },

    { id: 'needwant', level: 1, name: 'Needs and wants', make: function () {
      var askNeed = R.int(0, 1) === 1, rightList = askNeed ? NEEDS : WANTS, wrongList = askNeed ? WANTS : NEEDS;
      var right = R.pick(rightList), wrongs = R.shuffle(wrongList).slice(0, 3);
      var word = askNeed ? 'need' : 'want';
      var opts = [{ text: right[0], ok: true }].concat(wrongs.map(function (w) {
        return { text: w[0], ok: false, trap: askNeed ? w[0] + ' is a want. ' + w[1] : w[0] + ' is a need. ' + w[1] };
      }));
      return Q.choice({
        skill: 'Needs and wants', prompt: 'Which of these is a ' + word.toUpperCase() + '?', options: opts,
        work: right[0] + ' is a ' + word + '. ' + right[1], plain: 'A need is something you must have to live safely. A want is nice to have but you can live without it.',
        teach: [
          x('Ask one question about each item. Can I live safely and go to school without it?', ['Need or want?', 'the question']),
          note('If you cannot live safely without it, it is a need. If you can, it is a want.', 'How to decide', ['No: it is a need', 'Yes, I can live without it: it is a want']),
          x(right[1], [right[0], word]),
          note('Remember the order in a budget.', 'Budget order', ['Needs first', 'Savings next', 'Wants last'])
        ]
      });
    } },

    { id: 'missingcat', level: 2, name: 'Find the missing budget number', make: function () {
      var inc = R.pick([20, 30, 40, 50, 60]), cats = R.shuffle(['Snacks', 'Comics', 'Games', 'Bus fare', 'Gifts', 'Lunch']).slice(0, 3);
      var parts = [R.int(2, Math.floor(inc / 4)), R.int(2, Math.floor(inc / 4)), R.int(2, Math.floor(inc / 4))], known = sum(parts);
      var miss = inc - known, hide = R.int(0, 3);
      var rows = [['Income', inc * 100]];
      cats.forEach(function (c, i) { rows.push([c, parts[i] * 100]); });
      rows.push(['Savings', miss * 100]);
      var tab = rows.map(function (r) { return r[0] + ' $' + (r[1] / 100); });
      var target = hide === 3 ? 'Savings' : cats[hide], tv = hide === 3 ? miss : parts[hide];
      var shown = rows.filter(function (r) { return r[0] !== target; }).map(function (r) { return r[0] + ' $' + (r[1] / 100); });
      var kn = hide === 3 ? known : (inc - miss - tv + 0);
      // The total of everything except income and target
      var others = rows.slice(1).filter(function (r) { return r[0] !== target; }).reduce(function (p, r) { return p + r[1] / 100; }, 0);
      return N({
        skill: 'Find the missing budget number', prompt: 'A budget balances when the expenses and savings add up to the income. Here is a budget with one number hidden: ' + shown.join(', ') + ', ' + target + ' ?. How many dollars is ' + target + '?',
        answer: tv, placeholder: 'Type a number',
        traps: [T(String(others), 'That is the total of the amounts you can see. Take it away from the income.'), T(String(inc), 'That is the whole income. The hidden part is only a piece of it.')],
        work: 'Add what you can see: ' + others + '. ' + inc + ' − ' + others + ' = ' + tv + '.', plain: 'Add the rows you know. Take that total away from the income to find the hidden row.',
        teach: [
          lines('Here is the budget. One row is hidden.', budgetLines(['Item', 'Amount'], rows.map(function (r) { return [r[0], r[0] === target ? '?' : r[1]]; })), 0),
          x('Add the amounts that are not the income and not the hidden row.', rows.slice(1).filter(function (r) { return r[0] !== target; }).map(function (r) { return String(r[1] / 100); }).join(' + ') + ' = ', [String(others), 'known']),
          x('Take that away from the income. ' + inc + ' − ' + others + ' = ' + tv + '.', inc + ' − ' + others + ' = ', [dl(tv * 100), target]),
          x('Check. Everything adds back to ' + inc + '.', others + ' + ' + tv + ' = ', [dl(inc * 100), 'income'])
        ]
      });
    } },

    { id: 'remaining', level: 2, name: 'Money left after spending', make: function () {
      var dec = R.int(0, 1) === 1, inc = dec ? R.pick([2000, 2500, 3000, 4000, 5000]) : R.pick([20, 25, 30, 40, 50]) * 100;
      var mx = Math.floor(inc / 4 / 50), e = [R.int(2, mx) * 50, R.int(2, mx) * 50, R.int(2, mx) * 50];
      if (!dec) e = e.map(function (v) { return Math.round(v / 100) * 100 || 100; });
      var tot = sum(e), left = inc - tot, its = R.shuffle(SPEND).slice(0, 3);
      return N({
        skill: 'Money left after spending', prompt: 'Rinka has ' + dl(inc) + '. She spends ' + dl(e[0]) + ' on ' + its[0] + ', ' + dl(e[1]) + ' on ' + its[1] + ' and ' + dl(e[2]) + ' on ' + its[2] + '. How much money does she have left?' + (left % 100 === 0 ? '' : ' Type the answer like 7.50.'),
        answer: ans(left), placeholder: 'Type your answer',
        traps: [T(ans(tot), 'That is the total she spent. The question asks how much is left.'), T(ans(inc - e[0]), 'That takes away only the first expense. Take away all three.'), T(ans(inc + tot), 'You added. Money spent goes out, so take it away.')],
        work: 'Spent ' + e.map(function (v) { return dl(v); }).join(' + ') + ' = ' + dl(tot) + '. ' + dl(inc) + ' − ' + dl(tot) + ' = ' + dl(left) + '.', plain: 'Add all the expenses. Take that total away from what she started with.',
        teach: [
          x('Step one. Add the three expenses.', e.map(function (v) { return dl(v); }).join(' + ') + ' = ', [dl(tot), 'spent']),
          bars('The whole bar is what she had. The red part is what she spent.', [row('Had ' + dl(inc), Math.round(inc / 500), 'bg-emerald-400', ''), row('Spent ' + dl(tot), Math.max(1, Math.round(tot / 500)), 'bg-rose-400', '')]),
          x('Step two. Take the spending from what she had. ' + dl(inc) + ' − ' + dl(tot) + ' = ' + dl(left) + '.', dl(inc) + ' − ' + dl(tot) + ' = ', [dl(left), 'left']),
          x('Check by adding. ' + dl(tot) + ' + ' + dl(left) + ' = ' + dl(inc) + '.', dl(tot) + ' + ' + dl(left) + ' = ', [dl(inc), 'matches'])
        ]
      });
    } },

    { id: 'savetotal', level: 2, name: 'Saving each week', make: function () {
      var per = R.pick([2, 3, 4, 5, 6, 8, 10]), w = R.int(3, 12), start = R.pick([0, 0, 5, 10, 15]), tot = per * w + start;
      var ph = start === 0 ? 'Leo saves $' + per + ' each week. How much has he saved after ' + w + ' weeks?' : 'Leo already has $' + start + '. He saves $' + per + ' each week. How much will he have after ' + w + ' weeks?';
      var st = [x('Each week he adds $' + per + '. That happens ' + w + ' times.', [String(w), 'weeks'], ' × ', ['$' + per, 'each week']),
        bars('Each box is one week of saving.', [row(w + ' weeks', w, 'bg-emerald-400', String(per), '$' + (per * w))]),
        x('Multiply. ' + w + ' × ' + per + ' = ' + (per * w) + '.', w + ' × ' + per + ' = ', [dl(per * w * 100), 'saved'])];
      if (start > 0) st.push(x('Add what he already had. ' + (per * w) + ' + ' + start + ' = ' + tot + '.', (per * w) + ' + ' + start + ' = ', [dl(tot * 100), 'total']));
      else st.push(x('So after ' + w + ' weeks he has $' + tot + '.', [dl(tot * 100), 'total']));
      return N({
        skill: 'Saving each week', prompt: ph, answer: tot, placeholder: 'Type a number',
        traps: [T(String(per + w + start), 'You added. Saving the same amount many times is multiplying.'), T(String(per * w), 'That leaves out the money he already had.')],
        work: w + ' × ' + per + ' = ' + (per * w) + (start ? '. ' + (per * w) + ' + ' + start + ' = ' + tot : '') + '.', plain: 'Multiply the weekly amount by the number of weeks. Add any money already saved.',
        teach: st.length < 4 ? st.concat([x('Check by counting by ' + per + 's.', [String(per), 'each week'])]) : st
      });
    } },

    { id: 'goalneeded', level: 2, name: 'How much more is needed', make: function () {
      var goal = R.pick([40, 50, 60, 75, 80, 90, 100, 120]), saved = R.int(Math.ceil(goal * 0.2), Math.floor(goal * 0.8)), need = goal - saved, it = R.pick(['a bike helmet', 'a skateboard', 'a video game', 'a soccer ball', 'a art set', 'a new backpack']).replace('a art', 'an art');
      return N({
        skill: 'How much more is needed', prompt: 'Rinka wants to buy ' + it + ' that costs $' + goal + '. She has saved $' + saved + '. How many more dollars does she need?',
        answer: need, placeholder: 'Type a number',
        traps: [T(String(goal + saved), 'You added. To see what is still needed, take the savings from the goal.'), T(String(saved), 'That is what she has already. The question asks how much more she needs.')],
        work: goal + ' − ' + saved + ' = ' + need + '.', plain: 'Take what she has from the goal. The answer is what is still missing.',
        teach: [
          x('The goal is $' + goal + '. She has $' + saved + '.', [dl(goal * 100), 'goal'], ' and ', [dl(saved * 100), 'saved']),
          bars('The whole bar is the goal. The green part is saved. The grey part is still needed.', [row('Goal $' + goal, Math.round(goal / 5), 'bg-slate-300', ''), row('Saved $' + saved, Math.round(saved / 5), 'bg-emerald-400', '')]),
          x('Take away. ' + goal + ' − ' + saved + ' = ' + need + '.', goal + ' − ' + saved + ' = ', [dl(need * 100), 'still needed']),
          x('Check. ' + saved + ' + ' + need + ' = ' + goal + '.', saved + ' + ' + need + ' = ', [dl(goal * 100), 'matches'])
        ]
      });
    } },

    { id: 'weeksgoal', level: 3, name: 'Weeks to reach a goal', make: function () {
      var per = R.pick([2, 3, 4, 5, 6, 8, 10]), w = R.int(3, 12), goal = per * w, it = R.pick(['a kite', 'a book set', 'a board game', 'a toy drone', 'a puzzle', 'a small telescope']);
      return N({
        skill: 'Weeks to reach a goal', prompt: 'Sam wants ' + it + ' that costs $' + goal + '. He saves $' + per + ' every week. How many weeks will it take him to save $' + goal + '?',
        answer: w, placeholder: 'Type a number',
        traps: [T(String(goal - per), 'You took away. To find how many weeks, divide $' + goal + ' by $' + per + '.'), T(String(per), 'That is what he saves each week. How many weeks does he need?')],
        work: goal + ' ÷ ' + per + ' = ' + w + '.', plain: 'Ask how many times $' + per + ' fits into $' + goal + '. That is the number of weeks.',
        teach: [
          x('He needs $' + goal + '. He saves $' + per + ' each week. How many ' + per + 's make ' + goal + '?', [dl(goal * 100), 'goal'], ' ÷ ', [dl(per * 100), 'each week']),
          bars('Each box is one week of saving.', [row('Weeks of saving', w, 'bg-emerald-400', String(per), '$' + goal)]),
          x('Count the boxes. ' + goal + ' ÷ ' + per + ' = ' + w + '.', goal + ' ÷ ' + per + ' = ', [String(w), 'weeks']),
          x('Check. ' + w + ' × ' + per + ' = ' + goal + '.', w + ' × ' + per + ' = ', [dl(goal * 100), 'matches'])
        ]
      });
    } },

    { id: 'weeksgoal2', level: 4, name: 'Weeks with money already saved', make: function () {
      var per = R.pick([3, 4, 5, 6, 8, 10]), w = R.int(3, 10), start = R.pick([10, 15, 20, 25, 30, 40]), need = per * w, goal = start + need;
      var it = R.pick(['a scooter', 'a chess set', 'a telescope', 'a pair of skates', 'a drum kit toy']);
      return N({
        skill: 'Weeks with money already saved', prompt: 'Ana wants ' + it + ' that costs $' + goal + '. She has already saved $' + start + ' and adds $' + per + ' every week. How many more weeks until she can buy it?',
        answer: w, placeholder: 'Type a number',
        traps: [T(String(Math.floor(goal / per)), 'You forgot the $' + start + ' she has already saved. Take it away from the goal first.'), T(String(need), 'That is the dollars still needed. Divide by $' + per + ' to get the number of weeks.'), T(String(per), 'That is what she saves each week. How many weeks does she need?')],
        work: goal + ' − ' + start + ' = ' + need + '. ' + need + ' ÷ ' + per + ' = ' + w + '.', plain: 'Take the saved money from the goal. Then divide by the weekly amount.',
        teach: [
          x('Step one. How much more is needed? Take the savings from the goal.', goal + ' − ' + start + ' = ', [dl(need * 100), 'still needed']),
          bars('Each box is one week of saving. Together the boxes make the amount still needed.', [row('Weeks of saving', w, 'bg-emerald-400', String(per), '$' + need)]),
          x('Step two. Divide by the weekly amount. ' + need + ' ÷ ' + per + ' = ' + w + '.', need + ' ÷ ' + per + ' = ', [String(w), 'weeks']),
          x('Check. ' + w + ' × ' + per + ' = ' + need + ', and ' + need + ' + ' + start + ' = ' + goal + '.', need + ' + ' + start + ' = ', [dl(goal * 100), 'goal'])
        ]
      });
    } },

    { id: 'pctsaved', level: 3, name: 'Percent of income saved', make: function () {
      var p = R.pick([10, 20, 25, 50]), I = R.pick([20, 40, 60, 80, 100, 120, 200]), s = I * p / 100;
      var st = [x('We need ' + p + ' percent of $' + I + '.', [p + '%', 'of'], ' ', [dl(I * 100), 'income'])];
      if (p === 50) st.push(x('50 percent is half. Divide by 2.', I + ' ÷ 2 = ', [dl(s * 100), 'saved']));
      else if (p === 25) st.push(x('25 percent is one quarter. Divide by 4.', I + ' ÷ 4 = ', [dl(s * 100), 'saved']));
      else if (p === 10) st.push(x('10 percent is one tenth. Divide by 10.', I + ' ÷ 10 = ', [dl(s * 100), 'saved']));
      else { st.push(x('First find 10 percent. Divide by 10.', I + ' ÷ 10 = ', [dl(I * 10), '10%'])); st.push(x('20 percent is double 10 percent.', (I / 10) + ' × 2 = ', [dl(s * 100), 'saved'])); }
      st.push(bars('The whole bar is the income. The green part is what is saved.', [row('Income $' + I, 10, 'bg-slate-300', ''), row('Saved $' + s, Math.max(1, Math.round(s / I * 10)), 'bg-emerald-400', '')]));
      st.push(x('So ' + p + ' percent of $' + I + ' is $' + s + '.', [p + '% of $' + I, 'is'], ' = ', [dl(s * 100), 'answer']));
      return N({
        skill: 'Percent of income saved', prompt: R.pick(['Ava earns $' + I + ' from her jobs. She saves ' + p + ' percent of it. How many dollars does she save?', 'Kai gets $' + I + '. He puts ' + p + ' percent into savings. How many dollars is that?']),
        answer: s, placeholder: 'Type a number',
        traps: [T(String(I * p), 'You multiplied by the percent number. Percent means out of 100.'), T(String(I - s), 'That is the money she keeps to spend. The question asks how much she saves.'), T(String(p), 'That is the percent, not the dollars. Find ' + p + ' percent of $' + I + '.')],
        work: p + '% of ' + I + ' = ' + s + '.', plain: p === 50 ? 'Half of the income.' : p === 25 ? 'A quarter of the income.' : p === 10 ? 'One tenth of the income.' : 'Find one tenth, then double it.', teach: st
      });
    } },

    { id: 'unitprice', level: 3, name: 'Price of one', make: function () {
      var n = R.pick([2, 3, 4, 5, 6, 8, 10, 12]), per = p5(25, 350), tot = n * per, it = R.pick(['juice boxes', 'granola bars', 'pencils', 'muffins', 'apples', 'stickers', 'erasers']);
      return N({
        skill: 'Price of one', prompt: 'A pack of ' + n + ' ' + it + ' costs ' + dl(tot) + '. What is the price of one? Type the answer like 1.25.',
        answer: m(per), placeholder: 'Like 1.25',
        traps: [T(m(tot), 'That is the price of the whole pack. Divide by ' + n + ' to find one.'), T(m(tot * n), 'You multiplied. To find the price of one, divide.'), T(m(per + 5), 'Check your division. Multiply your answer by ' + n + ' to get back to ' + dl(tot) + '.')],
        work: tot + ' cents ÷ ' + n + ' = ' + per + ' cents = ' + usd(per) + '.', plain: 'Change to cents. Divide by the number of items. Change back to dollars.',
        teach: [
          x('The unit price is the total ÷ the number of items.', [dl(tot), 'total'], ' ÷ ', [String(n), 'items']),
          x('Work in cents. ' + dl(tot) + ' is ' + tot + ' cents.', dl(tot) + ' = ', [String(tot), 'cents']),
          x('Divide. ' + tot + ' ÷ ' + n + ' = ' + per + ' cents.', tot + ' ÷ ' + n + ' = ', [String(per), 'cents each']),
          x('Back to dollars. ' + per + ' cents is ' + usd(per) + '.', per + ' cents = ', [usd(per), 'one item']),
          x('Check. ' + n + ' × ' + usd(per) + ' = ' + usd(tot) + '.', n + ' × ' + usd(per) + ' = ', [usd(tot), 'matches'])
        ]
      });
    } },

    { id: 'earnscen', level: 4, name: 'Earning and spending', make: function () {
      var job = R.pick(JOBS), e = R.pick([4, 5, 6, 8, 10, 12]), k = R.int(3, 8), sp = R.int(2, Math.floor(e * k / 2)), it = R.pick(SPEND), tot = e * k, left = tot - sp;
      return N({
        skill: 'Earning and spending', prompt: 'Mia earns $' + e + ' for ' + job[1] + '. She does it ' + k + ' times. Then she spends $' + sp + ' on ' + it + '. How many dollars does she have left?',
        answer: left, placeholder: 'Type a number',
        traps: [T(String(tot), 'That is what she earned. She also spent some, so take that away.'), T(String(e + k - sp), 'You added the jobs. Earning the same amount many times is multiplying.'), T(String(tot + sp), 'You added the spending. Spending goes out, so take it away.')],
        work: k + ' × ' + e + ' = ' + tot + '. ' + tot + ' − ' + sp + ' = ' + left + '.', plain: 'Multiply to find what she earned. Then take away what she spent.',
        teach: [
          x('Step one. She earns $' + e + ' each time, ' + k + ' times.', [String(k), 'jobs'], ' × ', [dl(e * 100), 'each']),
          x('Multiply. ' + k + ' × ' + e + ' = ' + tot + '.', k + ' × ' + e + ' = ', [dl(tot * 100), 'earned']),
          x('Step two. She spends $' + sp + '. Take it away.', tot + ' − ' + sp + ' = ', [dl(left * 100), 'left']),
          x('Check. ' + left + ' + ' + sp + ' = ' + tot + '.', left + ' + ' + sp + ' = ', [dl(tot * 100), 'matches'])
        ]
      });
    } },

    { id: 'betterbuy', level: 4, name: 'Which is the better buy', make: function () {
      var a, b, na, nb, ok = false;
      while (!ok) {
        na = R.pick([2, 3, 4, 5, 6]); nb = R.pick([3, 4, 5, 6, 8, 10]);
        a = p5(50, 300); b = p5(50, 300);
        ok = na !== nb && a !== b;
      }
      var ta = na * a, tb = nb * b, it = R.pick(['juice boxes', 'notebooks', 'granola bars', 'pens', 'bottles of water']);
      var better = a < b ? 'Store A' : 'Store B', lowp = Math.min(a, b);
      var says = { 'Store A': 'Check again. Divide the price of Store A by ' + na + ' and compare with Store B.', 'Store B': 'Check again. Divide the price of Store B by ' + nb + ' and compare with Store A.' };
      var opts = [{ text: 'Store A', ok: better === 'Store A', trap: better === 'Store A' ? undefined : 'Store A costs ' + usd(a) + ' for one. Store B costs only ' + usd(b) + ' for one. Lower is the better buy.' },
                  { text: 'Store B', ok: better === 'Store B', trap: better === 'Store B' ? undefined : 'Store B costs ' + usd(b) + ' for one. Store A costs only ' + usd(a) + ' for one. Lower is the better buy.' },
                  { text: 'They are the same price for one', ok: false, trap: 'The price for one is ' + usd(a) + ' at Store A and ' + usd(b) + ' at Store B. They are not the same.' }];
      return Q.choice({
        skill: 'Which is the better buy', prompt: 'Store A sells ' + na + ' ' + it + ' for ' + usd(ta) + '. Store B sells ' + nb + ' ' + it + ' for ' + usd(tb) + '. Which store has the better buy?', options: opts,
        work: 'A: ' + ta + ' ÷ ' + na + ' = ' + a + ' cents each. B: ' + tb + ' ÷ ' + nb + ' = ' + b + ' cents each. ' + better + ' is cheaper for one.', plain: 'Find the price of one at each store. The lower price of one is the better buy.',
        teach: [
          lines('Two deals.', ['Store A   ' + na + ' for ' + usd(ta), 'Store B   ' + nb + ' for ' + usd(tb)], 0),
          x('Store A. ' + ta + ' cents ÷ ' + na + ' = ' + a + ' cents each.', ta + ' ÷ ' + na + ' = ', [usd(a), 'each at A']),
          x('Store B. ' + tb + ' cents ÷ ' + nb + ' = ' + b + ' cents each.', tb + ' ÷ ' + nb + ' = ', [usd(b), 'each at B']),
          x('Compare. ' + usd(lowp) + ' is the lower price for one.', [usd(a), 'A'], a < b ? ' < ' : ' > ', [usd(b), 'B']),
          x(better + ' is the better buy.', [better, 'better buy'])
        ]
      });
    } },

    { id: 'unitdiff', level: 5, name: 'How much cheaper for one', make: function () {
      var a, b, na, nb, ok = false;
      while (!ok) {
        na = R.pick([2, 3, 4, 5, 6]); nb = R.pick([3, 4, 5, 6, 8, 10]);
        a = p5(50, 300); b = p5(50, 300);
        ok = na !== nb && a !== b;
      }
      var ta = na * a, tb = nb * b, it = R.pick(['pencils', 'stickers', 'muffins', 'juice boxes', 'granola bars']);
      var d = Math.abs(a - b), hi = Math.max(a, b), lo = Math.min(a, b), better = a < b ? 'Pack A' : 'Pack B';
      return N({
        skill: 'How much cheaper for one', prompt: 'Pack A has ' + na + ' ' + it + ' for ' + usd(ta) + '. Pack B has ' + nb + ' ' + it + ' for ' + usd(tb) + '. How much less does one cost in the better buy than in the other pack? Type the answer like 0.15.',
        answer: m(d), placeholder: 'Like 0.15',
        traps: [T(m(hi), 'That is the price of one in the more costly pack. Subtract the two prices for one.'), T(m(hi + lo), 'You added. To find how much less, take away.'), T(m(Math.abs(ta - tb)), 'That compares the whole packs. Compare the price of one in each pack.')],
        work: 'A: ' + a + ' cents. B: ' + b + ' cents. ' + hi + ' − ' + lo + ' = ' + d + ' cents = ' + usd(d) + '.', plain: 'Find the price of one for each pack. Then take the smaller from the bigger.',
        teach: [
          x('First find the price of one in each pack. Pack A: ' + ta + ' ÷ ' + na + ' = ' + a + ' cents.', ta + ' ÷ ' + na + ' = ', [usd(a), 'each at A']),
          x('Pack B: ' + tb + ' ÷ ' + nb + ' = ' + b + ' cents.', tb + ' ÷ ' + nb + ' = ', [usd(b), 'each at B']),
          x(better + ' has the lower price for one.', [better, 'better buy']),
          x('Take away to find how much less. ' + usd(hi) + ' − ' + usd(lo) + ' = ' + usd(d) + '.', usd(hi) + ' − ' + usd(lo) + ' = ', [usd(d), 'less for one']),
          x('So one costs ' + usd(d) + ' less in ' + better + '.', [usd(d), 'answer'])
        ]
      });
    } },

    { id: 'allowance', level: 5, name: 'Allowance, gift and a purchase', make: function () {
      var a = R.pick([4, 5, 6, 8, 10]), w = R.int(3, 8), g = R.pick([5, 10, 15, 20]), inc = a * w + g, cost = R.int(Math.floor(inc / 3), inc - 3), left = inc - cost, it = R.pick(['a board game', 'a soccer ball', 'a art kit', 'a book set', 'headphones', 'a science kit']).replace('a art', 'an art');
      return N({
        skill: 'Allowance, gift and a purchase', prompt: 'Rinka gets $' + a + ' allowance each week for ' + w + ' weeks. She also gets $' + g + ' as a birthday gift. Then she buys ' + it + ' for $' + cost + '. How many dollars does she have left?',
        answer: left, placeholder: 'Type a number',
        traps: [T(String(inc), 'That is all the money she got. She also spent some on ' + it + '. Take that away.'), T(String(a + g - cost > 0 ? a + g - cost : 0), 'You used only one week of allowance. She gets $' + a + ' for each of ' + w + ' weeks.'), T(String(a * w - cost > 0 ? a * w - cost : 0), 'You forgot the birthday gift. Add it before you take away the cost.')],
        work: w + ' × ' + a + ' = ' + (a * w) + '. ' + (a * w) + ' + ' + g + ' = ' + inc + '. ' + inc + ' − ' + cost + ' = ' + left + '.', plain: 'Multiply for the allowance. Add the gift. Take away the cost.',
        teach: [
          x('Step one. The allowance. ' + w + ' weeks of $' + a + '.', w + ' × ' + a + ' = ', [dl(a * w * 100), 'allowance']),
          x('Step two. Add the birthday gift. ' + (a * w) + ' + ' + g + ' = ' + inc + '.', (a * w) + ' + ' + g + ' = ', [dl(inc * 100), 'total income']),
          x('Step three. Take away the cost. ' + inc + ' − ' + cost + ' = ' + left + '.', inc + ' − ' + cost + ' = ', [dl(left * 100), 'left']),
          x('Check. ' + left + ' + ' + cost + ' = ' + inc + '.', left + ' + ' + cost + ' = ', [dl(inc * 100), 'matches'])
        ]
      });
    } },

    { id: 'pctask', level: 4, name: 'What percent was saved', make: function () {
      var p = R.pick([10, 20, 25, 50]), I = R.pick([20, 40, 50, 60, 80, 100, 200]);
      if (p === 25 && I % 4 !== 0) I = 40;
      if (p === 20 && I % 5 !== 0) I = 50;
      var s = I * p / 100, name = R.pick(['Sam', 'Ava', 'Leo', 'Mia']);
      var how = { 50: 'Half of the income is 50 percent.', 25: 'A quarter of the income is 25 percent.', 10: 'One tenth of the income is 10 percent.', 20: 'One fifth of the income is 20 percent.' };
      return N({
        skill: 'What percent was saved', prompt: name + ' earns $' + I + ' and saves $' + s + '. What percent of the income does ' + name + ' save?',
        answer: p, placeholder: 'Type a number',
        traps: [T(String(s), 'That is the dollars saved, not the percent. Ask what part of the income was saved.'), T(String(100 - p), 'That is the percent that was NOT saved. The question asks about the part saved.')],
        work: '$' + s + ' out of $' + I + ' is ' + R.fr(s, I) + ' of the income. ' + how[p], plain: 'Write the saved money over the income as a fraction. Then use a friendly percent.',
        teach: [
          x(name + ' saves $' + s + ' out of $' + I + '.', [dl(s * 100), 'saved'], ' out of ', [dl(I * 100), 'income']),
          x('Write it as a fraction. ' + s + ' over ' + I + '. Simplify to ' + R.fr(s, I) + '.', s + '/' + I + ' = ', [R.fr(s, I), 'simplest']),
          x(how[p], [R.fr(s, I), 'of the income'], ' = ', [p + '%', 'percent']),
          x('So ' + name + ' saves ' + p + ' percent.', [p + '%', 'answer'])
        ]
      });
    } },

    { id: 'planweeks', level: 6, name: 'A savings plan', make: function () {
      var pr = R.pick([[20, 25], [20, 50], [40, 25], [40, 50], [10, 50], [30, 10], [50, 20]]), W = pr[0], p = pr[1], s = W * p / 100, wk = R.int(3, 10), start = R.pick([10, 15, 20, 25, 30]), goal = start + s * wk;
      var it = R.pick(['a skateboard', 'a scooter', 'a tablet case', 'a guitar', 'a tent for camping']);
      var frac = p === 50 ? 'half' : p === 25 ? 'a quarter' : p === 10 ? 'one tenth' : 'one fifth';
      var div = p === 50 ? 2 : p === 25 ? 4 : p === 10 ? 10 : 5;
      return N({
        skill: 'A savings plan', prompt: 'Kai gets $' + W + ' allowance each week. He saves ' + p + ' percent of it. He wants ' + it + ' that costs $' + goal + ' and he has already saved $' + start + '. How many weeks will it take him to reach the goal?',
        answer: wk, placeholder: 'Type a number',
        traps: [T(String(Math.round(goal / W * 10) / 10), 'That uses the whole allowance. Only the saved part counts, which is ' + p + ' percent of $' + W + '.'), T(String(Math.floor(goal / s)), 'You forgot he has already saved $' + start + '. Take that away from the goal first.'), T(String(goal - start), 'That is how many dollars are still needed. Divide by the weekly savings to get weeks.')],
        work: p + '% of ' + W + ' = ' + s + '. ' + goal + ' − ' + start + ' = ' + (goal - start) + '. ' + (goal - start) + ' ÷ ' + s + ' = ' + wk + '.', plain: 'Find the weekly savings. Find how much is still needed. Divide.',
        teach: [
          x('Step one. Weekly savings. ' + p + ' percent is ' + frac + '. ' + W + ' ÷ ' + div + ' = ' + (W / div) + (p === 20 ? '.' : '.'), W + ' ÷ ' + div + ' = ', [dl(W / div * 100), 'saved each week']),
          x('Step two. How much is still needed? ' + goal + ' − ' + start + ' = ' + (goal - start) + '.', goal + ' − ' + start + ' = ', [dl((goal - start) * 100), 'still needed']),
          bars('Each box is one week of saving.', [row('Weeks of saving', wk, 'bg-emerald-400', String(s), '$' + (goal - start))]),
          x('Step three. Divide. ' + (goal - start) + ' ÷ ' + s + ' = ' + wk + '.', (goal - start) + ' ÷ ' + s + ' = ', [String(wk), 'weeks']),
          x('Check. ' + wk + ' × ' + s + ' = ' + (goal - start) + ', and ' + (goal - start) + ' + ' + start + ' = ' + goal + '.', (goal - start) + ' + ' + start + ' = ', [dl(goal * 100), 'goal'])
        ]
      });
    } }
  ]);

  /* p5 is defined here so the file stands alone. */
  function p5(lo, hi) { return 5 * R.int(Math.ceil(lo / 5), Math.floor(hi / 5)); }
})();
