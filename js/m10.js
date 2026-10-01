/* Module 10: Multiplication and Division Facts. Lessons, vocabulary and question skills. */
(function () {
  'use strict';
  var B = window.Bank, R = B.R, S = B.s, Q = B.q, T = Q.trap;
  var x = S.x, note = S.note, bars = S.bars, fb = S.fb, row = S.row, grid = S.grid, groups = S.groups, lines = S.lines;

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
  function ord(n) { var s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); }
  /* skip counting list: per, 2 per, ... g times per */
  function skip(per, g) { var a = []; for (var i = 1; i <= g; i++) a.push(per * i); return a.join(', '); }
  function factorsOf(n) { var f = []; for (var i = 1; i <= n; i++) if (n % i === 0) f.push(i); return f; }
  function pairsOf(n) { var p = []; for (var i = 1; i * i <= n; i++) if (n % i === 0) p.push([i, n / i]); return p; }

  /* ---------- Vocabulary ---------- */
  window.MATH_VOCAB[10] = [
    { w: 'Factor', m: 'A number you multiply to make another number. 3 and 4 are factors of 12 because 3 × 4 = 12.' },
    { w: 'Multiple', m: 'A number you get when you count by another number. 6, 12, 18 and 24 are multiples of 6.' },
    { w: 'Product', m: 'The answer to a multiplication. In 6 × 7 = 42, the product is 42.' },
    { w: 'Quotient', m: 'The answer to a division. In 42 ÷ 6 = 7, the quotient is 7.' },
    { w: 'Array', m: 'Objects arranged in equal rows and columns, like eggs in a carton.' },
    { w: 'Square number', m: 'A number you get by multiplying a whole number by itself, like 5 × 5 = 25.' },
    { w: 'Fact family', m: 'Three numbers that make two multiplication facts and two division facts, like 6, 7 and 42.' },
    { w: 'Inverse operation', m: 'An operation that undoes another. Division undoes multiplication.' }
  ];

  /* ---------- Lessons ---------- */
  window.MATH_LESSONS[10] = [
    { title: '1. Arrays: rows and columns',
      explain: [
        'An array is a neat set of objects in equal rows and equal columns. Think of eggs in a carton, seats in a theatre, or windows on a tall building.',
        'To find how many there are in all, count one row and then count by that number for each row. This is multiplication. 3 rows of 4 is written 3 × 4.',
        'You can turn an array on its side. The number in all does not change. So 3 × 4 is the same as 4 × 3.'
      ],
      rule: 'Rows × number in each row = total. The order does not change the answer.',
      mistake: 'Do not add the rows and the columns. 3 rows of 4 is 3 × 4 = 12, not 3 + 4 = 7.',
      steps: [
        grid('An array. This one has 3 rows and 4 columns. Each row has 4 squares.', 4, 3, []),
        grid('Count the first row. There are 4 squares in it.', 4, 3, [{ c0: 0, c1: 4, r0: 0, r1: 1, cls: 'bg-indigo-400' }]),
        grid('Add the second row. Now we have 4 and 4, which is 8.', 4, 3, [{ c0: 0, c1: 4, r0: 0, r1: 1, cls: 'bg-indigo-400' }, { c0: 0, c1: 4, r0: 1, r1: 2, cls: 'bg-emerald-400' }]),
        grid('Add the third row. Now we have 4, 8, 12.', 4, 3, [{ c0: 0, c1: 4, r0: 0, r1: 1, cls: 'bg-indigo-400' }, { c0: 0, c1: 4, r0: 1, r1: 2, cls: 'bg-emerald-400' }, { c0: 0, c1: 4, r0: 2, r1: 3, cls: 'bg-amber-400' }]),
        x('Three rows of 4 is 3 × 4 = 12.', '3 × 4 = ', ['12', 'product']),
        grid('Turn the array on its side. Now it has 4 rows and 3 columns. Still 12 squares.', 3, 4, [{ c0: 0, c1: 3, r0: 0, r1: 4, cls: 'bg-teal-500' }]),
        x('So the order does not matter. 4 × 3 gives the same answer.', ['3 × 4', 'same'], ' = ', ['4 × 3', 'same'], ' = 12')
      ] },

    { title: '2. Doubling for times 2, 4 and 8',
      explain: [
        'Doubling means adding a number to itself. Double 7 is 7 + 7 = 14. So times 2 is just doubling.',
        'To multiply by 4, double the number, then double it again. To multiply by 8, double three times.',
        'This is a fast way because doubling is easy to do in your head.'
      ],
      rule: 'Times 2: double. Times 4: double twice. Times 8: double three times.',
      mistake: 'Count your doubles. Times 4 needs two doubles. If you double only once you have found times 2.',
      steps: [
        x('Double 7 means 7 + 7. That is 14. So 2 × 7 = 14.', '2 × 7 = ', ['14', 'double']),
        x('To find 4 × 7, double 7 to get 14. Then double 14.', '4 × 7: double ', ['7', 'start'], ' = 14, double ', ['14', 'again']),
        x('Double 14 is 14 + 14 = 28. So 4 × 7 = 28.', '4 × 7 = ', ['28', 'double double']),
        x('To find 8 × 7, start with 4 × 7 = 28. Double it one more time.', '8 × 7: double ', ['28', 'from 4 × 7']),
        x('Double 28 is 56. So 8 × 7 = 56.', '8 × 7 = ', ['56', 'double three times']),
        lines('Here is the doubling ladder for 7.', ['1 × 7 = 7', '2 × 7 = 14', '4 × 7 = 28', '8 × 7 = 56'], 1)
      ] },

    { title: '3. Times 10 and times 5',
      explain: [
        'Times 10 is easy. Every digit moves one place to the left, and a zero is put on the end. 6 × 10 = 60.',
        'Five is half of ten. So a times 5 fact is half of the times 10 fact. To find 6 × 5, find 6 × 10 = 60, then halve it to get 30.',
        'Answers to times 5 facts always end in 0 or 5.'
      ],
      rule: 'Times 5: find times 10, then take half.',
      mistake: 'Do not stop at the times 10 answer. Halve it. 6 × 10 = 60, but 6 × 5 = 30.',
      steps: [
        bars('Ten is twice as big as five. Look at 6 rows of 10 and 6 rows of 5.', [row('6 × 10', 6, 'bg-indigo-400', '10', '60'), row('6 × 5', 6, 'bg-emerald-400', '5', '30')]),
        x('First do the times 10 fact. 6 × 10 = 60.', '6 × 10 = ', ['60', 'times 10']),
        x('Then take half of 60. Half of 60 is 30.', 'half of 60 = ', ['30', 'half']),
        x('So 6 × 5 = 30.', '6 × 5 = ', ['30', 'answer']),
        x('Try 7 × 5. 7 × 10 = 70. Half of 70 is 35.', '7 × 5 = half of 70 = ', ['35', 'answer']),
        note('A quick pattern to check your work.', 'Times 5 pattern', ['Even number × 5 ends in 0', 'Odd number × 5 ends in 5'])
      ] },

    { title: '4. Times 9 tricks',
      explain: [
        'Nine is one less than ten. So 9 × 7 is one group of 7 less than 10 × 7. Find 10 × 7 = 70. Then take away 7 to get 63.',
        'There is a finger trick too. Hold up all 10 fingers. To find 9 × 7, fold down finger number 7. The fingers on the left are tens. The fingers on the right are ones.',
        'Another check: the digits of a times 9 answer add up to 9. 6 + 3 = 9.'
      ],
      rule: 'Times 9: do times 10, then take away the number once.',
      mistake: 'Take away the number itself, not 1. 9 × 7 is 70 − 7, not 70 − 1.',
      steps: [
        x('Find 9 × 7. Nine is 10 minus 1, so we can use 10 × 7.', '9 × 7 = ', ['10 × 7', 'one group too many'], ' − ', ['7', 'take one group back']),
        x('10 × 7 = 70.', '10 × 7 = ', ['70', 'times 10']),
        x('Take away one group of 7. 70 − 7 = 63.', '70 − 7 = ', ['63', 'answer']),
        lines('Finger trick. Ten fingers are shown. The X is finger number 7. It is folded down.', ['1 2 3 4 5 6 X 8 9 10', '(6 fingers)  X  (3 fingers)', ' 6 tens         3 ones'], 1),
        x('6 tens and 3 ones is 63. Both tricks give 9 × 7 = 63.', '9 × 7 = ', ['63', 'both tricks agree']),
        x('Check the digits. 6 + 3 = 9. That is a good sign.', ['6 + 3 = 9', 'digit check'])
      ] },

    { title: '5. Times 11 and times 12',
      explain: [
        'For 11 times a single digit, write the digit twice. 11 × 6 = 66. For bigger numbers, use 10 × the number plus 1 × the number.',
        'For times 12, think 10 groups plus 2 groups. 12 × 7 is 10 × 7 plus 2 × 7. That is 70 + 14 = 84.',
        'Splitting a hard fact into easy facts is a very useful habit.'
      ],
      rule: 'Times 11: 10 groups + 1 group. Times 12: 10 groups + 2 groups.',
      mistake: 'Do not forget the second part. 12 × 7 is not 70. You still need to add 2 × 7.',
      steps: [
        x('Times 11. 11 × 6 means 10 × 6 plus 1 × 6.', '11 × 6 = ', ['60', '10 × 6'], ' + ', ['6', '1 × 6']),
        x('60 + 6 = 66. The digit 6 shows up twice.', '11 × 6 = ', ['66', 'answer']),
        x('For 11 × 12 the digit trick does not work. Use 10 × 12 + 12.', '11 × 12 = ', ['120', '10 × 12'], ' + ', ['12', '1 × 12'], ' = 132'),
        x('Now times 12. 12 × 7 means 10 × 7 plus 2 × 7.', '12 × 7 = ', ['70', '10 × 7'], ' + ', ['14', '2 × 7']),
        x('70 + 14 = 84.', '12 × 7 = ', ['84', 'answer']),
        grid('See it as an array. 12 rows of 7 is 10 rows plus 2 rows.', 7, 12, [{ c0: 0, c1: 7, r0: 0, r1: 10, cls: 'bg-indigo-400' }, { c0: 0, c1: 7, r0: 10, r1: 12, cls: 'bg-emerald-400' }])
      ] },

    { title: '6. Square numbers',
      explain: [
        'A square number comes from multiplying a whole number by itself. 4 × 4 = 16, so 16 is a square number.',
        'It is called square because you can make a perfect square array. The rows and the columns have the same number.',
        'It is worth learning the first twelve square numbers by heart.'
      ],
      rule: 'A square number is a number times itself.',
      mistake: 'Do not double the number. 6 squared is 6 × 6 = 36. It is not 6 + 6 = 12.',
      steps: [
        grid('A 3 by 3 array is a square. It holds 3 × 3 = 9 squares.', 3, 3, [{ c0: 0, c1: 3, r0: 0, r1: 3, cls: 'bg-indigo-400' }]),
        grid('A 4 by 4 array holds 4 × 4 = 16 squares.', 4, 4, [{ c0: 0, c1: 4, r0: 0, r1: 4, cls: 'bg-emerald-400' }]),
        grid('A 5 by 5 array holds 5 × 5 = 25 squares.', 5, 5, [{ c0: 0, c1: 5, r0: 0, r1: 5, cls: 'bg-amber-400' }]),
        x('Each one is a number times itself. These numbers are called square numbers.', ['3 × 3 = 9', 'square'], '   ', ['4 × 4 = 16', 'square'], '   ', ['5 × 5 = 25', 'square']),
        lines('The first twelve square numbers.', ['1 × 1 = 1', '2 × 2 = 4', '3 × 3 = 9', '4 × 4 = 16', '5 × 5 = 25', '6 × 6 = 36', '7 × 7 = 49', '8 × 8 = 64', '9 × 9 = 81', '10 × 10 = 100', '11 × 11 = 121', '12 × 12 = 144'], 99)
      ] },

    { title: '7. Break apart a hard fact',
      explain: [
        'If you forget a fact, do not panic. Break it into two facts you know well, then add the answers.',
        'For 7 × 8, split the 7 into 5 and 2. You know 5 × 8 = 40 and 2 × 8 = 16. Add them to get 56.',
        'You can split either number. Pick the split that gives the easiest facts.'
      ],
      rule: 'Split one number into easy parts. Multiply each part. Add the answers.',
      mistake: 'Remember to add the two parts at the end. 5 × 8 = 40 is only part of the way.',
      steps: [
        x('Find 7 × 8. Split the 7 into 5 and 2, because 5 and 2 are easy to multiply.', '7 × 8 = ', ['5', 'part one'], ' + ', ['2', 'part two'], ' groups of 8'),
        grid('See it in an array. 7 rows of 8 is 5 rows and 2 rows.', 8, 7, [{ c0: 0, c1: 8, r0: 0, r1: 5, cls: 'bg-indigo-400' }, { c0: 0, c1: 8, r0: 5, r1: 7, cls: 'bg-emerald-400' }]),
        x('Blue part. 5 × 8 = 40.', '5 × 8 = ', ['40', 'blue part']),
        x('Green part. 2 × 8 = 16.', '2 × 8 = ', ['16', 'green part']),
        x('Add the two parts. 40 + 16 = 56.', '40 + 16 = ', ['56', 'answer']),
        x('So 7 × 8 = 56. Check by swapping: 8 × 7 is 56 too.', '7 × 8 = ', ['56', 'answer'])
      ] },

    { title: '8. Division undoes multiplication',
      explain: [
        'Division is the opposite of multiplication. Multiplication puts equal groups together. Division shares a total into equal groups, or finds how many groups fit.',
        'The opposite is called the inverse. So to find 42 ÷ 6, ask yourself: what number times 6 makes 42?',
        'If you know your times tables, you already know your division facts.'
      ],
      rule: 'To divide, think of the multiplication fact that gives the total.',
      mistake: 'Division is not the same both ways. 42 ÷ 6 = 7, but 6 ÷ 42 is not 7.',
      steps: [
        x('Find 42 ÷ 6. That asks how many groups of 6 fit into 42.', '42 ÷ 6 = ', ['?', 'how many 6s']),
        note('Count by 6 until you reach 42.', 'Skip counting', ['6, 12, 18, 24, 30, 36, 42', 'That took 7 counts']),
        groups('7 groups of 6 make 42.', 7, 6, 7, '6 in each group'),
        x('Because 7 × 6 = 42, we know that 42 ÷ 6 = 7.', '7 × 6 = 42, so ', '42 ÷ 6 = ', ['7', 'answer']),
        x('Check by multiplying back. 7 × 6 = 42. It matches.', ['7', 'quotient'], ' × 6 = ', ['42', 'the total'])
      ] },

    { title: '9. Fact families',
      explain: [
        'A fact family is a set of three numbers that go together. They make two multiplication facts and two division facts.',
        'The two smaller numbers multiply to make the biggest number. The biggest number divided by either small one gives the other.',
        'If you know one fact in the family, you know all four.'
      ],
      rule: 'Three numbers, four facts: two times, two divide.',
      mistake: 'In division, the biggest number goes first. 42 ÷ 6 is right. 6 ÷ 42 is not in this family.',
      steps: [
        lines('The numbers 6, 7 and 42 make a fact family. 42 is the biggest number, at the top.', ['        42', '       /  \\', '      6    7'], 99),
        x('First multiplication fact.', '6 × 7 = ', ['42', 'fact 1']),
        x('Second multiplication fact. Swap the numbers.', '7 × 6 = ', ['42', 'fact 2']),
        x('First division fact. Start with 42 and divide by 6.', '42 ÷ 6 = ', ['7', 'fact 3']),
        x('Second division fact. Start with 42 and divide by 7.', '42 ÷ 7 = ', ['6', 'fact 4']),
        note('If you know one fact, you know the family.', 'Four facts, one family', ['6 × 7 = 42', '7 × 6 = 42', '42 ÷ 6 = 7', '42 ÷ 7 = 6'])
      ] },

    { title: '10. Finding a missing factor',
      explain: [
        'Sometimes one factor is missing, like ? × 7 = 56. The question is: what number times 7 makes 56?',
        'Use the inverse. Divide the product by the factor you know. 56 ÷ 7 = 8. So the missing number is 8.',
        'Always check by multiplying back to see if you get the product.'
      ],
      rule: 'Missing factor = product ÷ the known factor.',
      mistake: 'Do not multiply the two numbers you can see. The product is already given. You need to divide.',
      steps: [
        x('We need to find the missing number. ? × 7 = 56.', ['?', 'missing'], ' × 7 = ', ['56', 'product']),
        bars('Draw 7 as the size of one group. The whole is 56. How many groups fit?', [row('56', 8, 'bg-indigo-400', '7', '56')]),
        x('Use the inverse. Divide the product by the factor you know.', '56 ÷ 7 = ', ['8', 'missing factor']),
        x('Check by multiplying back. 8 × 7 = 56. It works.', ['8', 'answer'], ' × 7 = 56'),
        x('It works from either side too. 6 × ? = 54 means 54 ÷ 6 = 9.', '6 × ', ['9', 'answer'], ' = 54')
      ] },

    { title: '11. Multiples and factors',
      explain: [
        'A multiple is what you get when you count by a number. The multiples of 4 are 4, 8, 12, 16 and so on. They are the answers in the 4 times table.',
        'A factor is a number that multiplies with another number to make a product. The factors of 12 are 1, 2, 3, 4, 6 and 12.',
        'To find all the factors, look for pairs that multiply to make the number. Start at 1 and work up.'
      ],
      rule: 'Multiples: count by the number. Factors: find pairs that multiply to the number.',
      mistake: 'Do not forget 1 and the number itself. Every number has both as factors.',
      steps: [
        lines('Multiples of 4. Count by 4s.', ['1 × 4 = 4', '2 × 4 = 8', '3 × 4 = 12', '4 × 4 = 16', '5 × 4 = 20'], 99),
        x('The first five multiples of 4 are 4, 8, 12, 16 and 20.', 'Multiples of 4: ', ['4, 8, 12, 16, 20', 'count by 4']),
        x('Now factors. To find the factors of 12, look for pairs that multiply to 12.', ['12', 'find its factors']),
        lines('Try 1, 2, 3 and so on. Keep the pairs that work.', ['1 × 12 = 12', '2 × 6 = 12', '3 × 4 = 12', '4 × 3 = 12  (already found, so stop)'], 0),
        x('Collect every number from the pairs. The factors of 12 are 1, 2, 3, 4, 6 and 12.', 'Factors of 12: ', ['1, 2, 3, 4, 6, 12', 'six factors'])
      ] },

    { title: '12. Word problems with bar models',
      explain: [
        'A bar model shows equal groups as equal boxes. It helps you see whether to multiply or divide.',
        'If you know the number of groups and the size of each group, multiply to find the total. If you know the total, divide to find the number of groups or the size of each.',
        'Always say what the answer means with a unit, like seats or dollars.'
      ],
      rule: 'Groups × size = total. Total ÷ groups = size. Total ÷ size = groups.',
      mistake: 'Read what is unknown. If the total is given, do not multiply. Divide.',
      steps: [
        x('A school bus has 9 rows of seats. Each row has 4 seats. How many seats are there?', ['9', 'rows'], ' × ', ['4', 'seats in each'], ' = ?'),
        bars('Draw 9 boxes, one for each row. Each box holds 4 seats.', [row('Rows', 9, 'bg-indigo-400', '4', '?')]),
        x('Groups times size equals total. 9 × 4 = 36.', '9 × 4 = ', ['36', 'seats']),
        x('Now a sharing problem. 36 seats are shared equally over 9 rows. How many in each row?', '36 ÷ 9 = ', ['4', 'seats in each row']),
        x('And a grouping problem. 36 students go on buses of 9. How many buses?', '36 ÷ 9 = ', ['4', 'buses']),
        note('The same three numbers give three different questions. Read what is missing.', 'Groups, size, total', ['Missing total: multiply', 'Missing size: divide the total by the groups', 'Missing groups: divide the total by the size'])
      ] }
  ];

  /* ---------- Question skills ---------- */
  var ctxStick = ['hockey cards', 'stickers', 'marbles', 'pencils', 'toy cars'];

  B.register(10, [

    { id: 'array', level: 1, name: 'Arrays', make: function () {
      var r = R.int(2, 9), c = R.int(2, 9);
      if (r === c) c = c === 9 ? 8 : c + 1;
      var t = R.pick([
        function () { return 'A tray has ' + r + ' rows of muffins. Each row has ' + c + ' muffins. How many muffins are on the tray?'; },
        function () { return 'A parking lot has ' + r + ' rows of cars with ' + c + ' cars in each row. How many cars are there?'; },
        function () { return 'A garden has ' + r + ' rows of tomato plants. There are ' + c + ' plants in every row. How many plants are there?'; },
        function () { return 'Stickers are arranged in an array with ' + r + ' rows and ' + c + ' columns. How many stickers are there?'; },
        function () { return 'A classroom has desks in ' + r + ' rows. Every row has ' + c + ' desks. How many desks are there?'; }
      ]);
      var p = r * c;
      return N({
        skill: 'Arrays', prompt: t(), answer: p, keyboard: 'numeric', placeholder: 'Type a whole number',
        traps: [T(String(r + c), 'You added the rows and the columns. An array means equal rows, so multiply: ' + r + ' × ' + c + '.'), T(String(p - c), 'You may have missed a row when counting. Count all ' + r + ' rows of ' + c + '.')],
        work: r + ' rows × ' + c + ' in each row = ' + p + '.', plain: 'Each row has ' + c + '. There are ' + r + ' rows. Count by ' + c + ' ' + r + ' times, or multiply.',
        teach: [
          x('There are ' + r + ' rows and ' + c + ' in each row. That means ' + r + ' groups of ' + c + '.', [String(r), 'rows'], ' × ', [String(c), 'in each row'], ' = ?'),
          grid('Here is the array. ' + r + ' rows and ' + c + ' columns.', c, r, [{ c0: 0, c1: c, r0: 0, r1: r, cls: 'bg-indigo-400' }]),
          x('Count by ' + c + ' once for each row: ' + skip(c, r) + '.', 'Skip count: ', [skip(c, r), 'count by ' + c]),
          x(r + ' × ' + c + ' = ' + p + '.', r + ' × ' + c + ' = ', [String(p), 'total']),
          x('Check by turning the array. ' + c + ' × ' + r + ' is ' + p + ' too.', c + ' × ' + r + ' = ', [String(p), 'same'])
        ]
      });
    } },

    { id: 'easyfacts', level: 1, name: 'Easy times table facts', make: function () {
      var a = R.pick([2, 3, 4, 5, 10]), b = R.int(2, 10);
      var v = R.int(0, 3), G, P, prompt;
      if (v === 0) { G = a; P = b; prompt = 'What is ' + a + ' × ' + b + '?'; }
      else if (v === 1) { G = a; P = b; prompt = 'Find the product of ' + a + ' and ' + b + '.'; }
      else if (v === 2) { G = b; P = a; prompt = 'What is ' + b + ' groups of ' + a + '?'; }
      else { G = b; P = a; var it = R.pick(ctxStick); prompt = 'One pack has ' + a + ' ' + it + '. How many ' + it + ' are in ' + b + ' packs?'; }
      var ans = G * P;
      return N({
        skill: 'Times table facts', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number',
        traps: [T(String(G + P), 'You added. The question is about equal groups, so multiply ' + G + ' × ' + P + '.'), T(String(ans + P), 'That is one group too many. Check your skip counting.'), T(String(ans - P), 'That is one group too few. Check your skip counting.')],
        work: G + ' groups of ' + P + ' = ' + G + ' × ' + P + ' = ' + ans + '.', plain: 'Count by ' + P + ' a total of ' + G + ' times, or use the times table.',
        teach: [
          x('This means ' + G + ' equal groups with ' + P + ' in each group.', [String(G), 'groups'], ' × ', [String(P), 'in each group']),
          groups('Here are ' + G + ' groups of ' + P + '.', G, P, G, P + ' in each group'),
          x('Skip count by ' + P + ', ' + G + ' times. ' + skip(P, G) + '.', 'Count: ', [skip(P, G), 'by ' + P]),
          x('The last number is the total. ' + G + ' × ' + P + ' = ' + ans + '.', G + ' × ' + P + ' = ', [String(ans), 'total']),
          x('Swap to check. ' + P + ' × ' + G + ' is also ' + ans + '.', P + ' × ' + G + ' = ', [String(ans), 'same'])
        ]
      });
    } },

    { id: 'dbl', level: 2, name: 'Doubling for times 4 and 8', make: function () {
      var m = R.pick([4, 8]), n = R.int(3, 12), v = R.int(0, 2), ans = m * n;
      var chain = [n, 2 * n, 4 * n]; if (m === 8) chain.push(8 * n);
      var prompt = v === 0 ? 'What is ' + m + ' × ' + n + '?' : (v === 1 ? 'Use doubling to find ' + n + ' × ' + m + '. Double ' + n + (m === 4 ? ' two times.' : ' three times.') + ' What number do you end with?' : 'One box holds ' + n + ' granola bars. How many bars are in ' + m + ' boxes?');
      var tr = [T(String(2 * n), 'You doubled only once. That is ' + 2 + ' × ' + n + '.'), T(String(4 * n === ans ? 8 * n : 4 * n), m === 8 ? 'You doubled only twice. Times 8 needs three doubles.' : 'You doubled three times. Times 4 needs only two doubles.'), T(String(m + n), 'You added. Double the number instead.')];
      var st = [
        x('Times ' + m + ' can be done by doubling. ' + (m === 4 ? 'Double twice.' : 'Double three times.'), m + ' × ' + n + ' = ', [n + ' doubled', m === 4 ? '2 times' : '3 times']),
        x('First double: ' + n + ' + ' + n + ' = ' + (2 * n) + '.', 'Double ' + n + ' = ', [String(2 * n), 'first double']),
        x('Second double: ' + (2 * n) + ' + ' + (2 * n) + ' = ' + (4 * n) + '.', 'Double ' + (2 * n) + ' = ', [String(4 * n), 'second double'])
      ];
      if (m === 8) st.push(x('Third double: ' + (4 * n) + ' + ' + (4 * n) + ' = ' + (8 * n) + '.', 'Double ' + (4 * n) + ' = ', [String(8 * n), 'third double']));
      st.push(lines('The doubling ladder for ' + n + '.', ['1 × ' + n + ' = ' + n, '2 × ' + n + ' = ' + (2 * n), '4 × ' + n + ' = ' + (4 * n)].concat(m === 8 ? ['8 × ' + n + ' = ' + (8 * n)] : []), 99));
      st.push(x('So ' + m + ' × ' + n + ' = ' + ans + '.', m + ' × ' + n + ' = ', [String(ans), 'answer']));
      return N({
        skill: 'Doubling strategy', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number', traps: tr,
        work: chain.join(' doubled is ') + '. So ' + m + ' × ' + n + ' = ' + ans + '.', plain: 'Double the number ' + (m === 4 ? 'two times' : 'three times') + '. Each double is easy to do.', teach: st
      });
    } },

    { id: 'five', level: 2, name: 'Times 5 from times 10', make: function () {
      var n = R.int(3, 12), ans = 5 * n, v = R.int(0, 2);
      var prompt = v === 0 ? 'What is 5 × ' + n + '?' : (v === 1 ? 'One nickel is worth 5 cents. How many cents are ' + n + ' nickels worth?' : 'What is half of 10 × ' + n + '?');
      return N({
        skill: 'Times 5', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number',
        traps: [T(String(10 * n), 'You stopped at times 10. Five is half of ten, so take half of ' + (10 * n) + '.'), T(String(5 + n), 'You added. Multiply ' + n + ' by 5, or halve ' + (10 * n) + '.')],
        work: n + ' × 10 = ' + (10 * n) + ', and half of ' + (10 * n) + ' is ' + ans + '.', plain: 'Five is half of ten. Do times 10 first, then cut it in half.',
        teach: [
          x('Five is half of ten. So 5 × ' + n + ' is half of 10 × ' + n + '.', '5 × ' + n + ' = half of ', ['10 × ' + n, 'times 10 first']),
          bars('Rows of 10 are twice as long as rows of 5.', [row(n + ' × 10', Math.min(n, 12), 'bg-indigo-400', '10', String(10 * n)), row(n + ' × 5', Math.min(n, 12), 'bg-emerald-400', '5', String(ans))]),
          x('Times 10: ' + n + ' × 10 = ' + (10 * n) + '.', n + ' × 10 = ', [String(10 * n), 'times 10']),
          x('Take half of ' + (10 * n) + '. Half of ' + (10 * n) + ' is ' + ans + '.', 'half of ' + (10 * n) + ' = ', [String(ans), 'half']),
          x('So the answer is ' + ans + '. It ends in ' + (ans % 10) + ', as times 5 answers should.', '5 × ' + n + ' = ', [String(ans), 'answer'])
        ]
      });
    } },

    { id: 'nine', level: 3, name: 'Times 9', make: function () {
      var n = R.int(3, 12), ans = 9 * n, v = R.int(0, 2);
      var prompt = v === 0 ? 'What is 9 × ' + n + '?' : (v === 1 ? 'Use 10 × ' + n + ' and take away ' + n + '. What is 9 × ' + n + '?' : 'A pack has 9 granola bars. Rinka buys ' + n + ' packs. How many bars does she have?');
      var st = [
        x('Nine is one less than ten. So 9 × ' + n + ' is 10 × ' + n + ' minus one group of ' + n + '.', '9 × ' + n + ' = ', ['10 × ' + n, 'one group too many'], ' − ', [String(n), 'take one group back']),
        x('10 × ' + n + ' = ' + (10 * n) + '.', '10 × ' + n + ' = ', [String(10 * n), 'times 10']),
        x('Take away ' + n + '. ' + (10 * n) + ' − ' + n + ' = ' + ans + '.', (10 * n) + ' − ' + n + ' = ', [String(ans), 'answer'])
      ];
      if (n <= 10) {
        var f = []; for (var i = 1; i <= 10; i++) f.push(i === n ? 'X' : String(i));
        st.push(lines('Finger trick. Finger number ' + n + ' is folded down, shown as X.', [f.join(' '), '(' + (n - 1) + ' fingers)  X  (' + (10 - n) + ' fingers)', ' ' + (n - 1) + ' tens          ' + (10 - n) + ' ones'], 1));
        st.push(x('The fingers give ' + (n - 1) + ' tens and ' + (10 - n) + ' ones. That is ' + ans + '.', '9 × ' + n + ' = ', [String(ans), 'both ways agree']));
      } else {
        st.push(x('Check with the digit trick. The digits of ' + ans + ' add to ' + (String(ans).split('').reduce(function (a, c) { return a + +c; }, 0)) + '. Times 9 answers add to a multiple of 9.', '9 × ' + n + ' = ', [String(ans), 'answer']));
      }
      return N({
        skill: 'Times 9', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number',
        traps: [T(String(10 * n), 'You stopped at 10 × ' + n + '. Now take away one group of ' + n + '.'), T(String(11 * n), 'That is 11 × ' + n + '. Nine is one less than ten, so take away, not add.'), T(String(9 + n), 'You added. Multiply 9 by ' + n + '.')],
        work: '10 × ' + n + ' = ' + (10 * n) + ', and ' + (10 * n) + ' − ' + n + ' = ' + ans + '.', plain: 'Nine is one less than ten. Do times 10, then take away the number once.', teach: st
      });
    } },

    { id: 'elev', level: 3, name: 'Times 11 and 12', make: function () {
      var m = R.pick([11, 12]), n = R.int(2, 12), ans = m * n, v = R.int(0, 2), ex = m - 10;
      var prompt = v === 0 ? 'What is ' + m + ' × ' + n + '?' : (v === 1 ? 'What is ' + n + ' × ' + m + '?' : (m === 12 ? 'A carton holds 12 eggs. How many eggs are in ' + n + ' cartons?' : 'A soccer team has 11 players. How many players are on ' + n + ' teams?'));
      return N({
        skill: 'Times 11 and 12', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number',
        traps: [T(String(10 * n), 'You did only the 10 groups. Add ' + ex + ' more group' + (ex > 1 ? 's' : '') + ' of ' + n + '.'), T(String(m + n), 'You added. Multiply instead.')],
        work: '10 × ' + n + ' = ' + (10 * n) + ', ' + ex + ' × ' + n + ' = ' + (ex * n) + ', and ' + (10 * n) + ' + ' + (ex * n) + ' = ' + ans + '.', plain: 'Split ' + m + ' into 10 and ' + ex + '. Multiply each part by ' + n + ' and add.',
        teach: [
          x(m + ' is 10 and ' + ex + '. So ' + m + ' × ' + n + ' is 10 × ' + n + ' plus ' + ex + ' × ' + n + '.', m + ' × ' + n + ' = ', ['10 × ' + n, 'ten groups'], ' + ', [ex + ' × ' + n, ex + ' more group' + (ex > 1 ? 's' : '')]),
          x('Ten groups first. 10 × ' + n + ' = ' + (10 * n) + '.', '10 × ' + n + ' = ', [String(10 * n), 'ten groups']),
          x('Now the extra. ' + ex + ' × ' + n + ' = ' + (ex * n) + '.', ex + ' × ' + n + ' = ', [String(ex * n), 'extra']),
          x('Add the parts. ' + (10 * n) + ' + ' + (ex * n) + ' = ' + ans + '.', (10 * n) + ' + ' + (ex * n) + ' = ', [String(ans), 'answer'])
        ]
      });
    } },

    { id: 'square', level: 3, name: 'Square numbers', make: function () {
      var n = R.int(2, 12), sq = n * n, v = R.int(0, 4);
      var prompt, ans, tr, teach, work, plain;
      if (v === 4) {
        var isSq = function (t) { var r = Math.round(Math.sqrt(t)); return r * r === t; };
        var wrong = [], tries = 0;
        while (wrong.length < 3 && tries++ < 60) { var w = sq + R.int(-9, 9); if (w > 1 && !isSq(w) && wrong.indexOf(w) < 0) wrong.push(w); }
        while (wrong.length < 3) wrong.push(sq + 100 + wrong.length * 2 + 1);
        return Q.choice({
          skill: 'Square numbers', prompt: 'Which of these is a square number?',
          options: [{ text: String(sq), ok: true }].concat(wrong.map(function (w) { return { text: String(w), ok: false, trap: w + ' is not a whole number times itself. A square number like ' + sq + ' is ' + n + ' × ' + n + '.' }; })),
          work: sq + ' = ' + n + ' × ' + n + ', so it is a square number.', plain: 'Try to write the number as a whole number times itself.',
          teach: [
            x('A square number is a whole number multiplied by itself.', ['? × ?', 'the same number twice']),
            lines('Here are the square numbers near ' + sq + '.', [(n - 1) + ' × ' + (n - 1) + ' = ' + ((n - 1) * (n - 1)), n + ' × ' + n + ' = ' + sq, (n + 1) + ' × ' + (n + 1) + ' = ' + ((n + 1) * (n + 1))], 99),
            x('Only ' + sq + ' from the choices is on the list. ' + n + ' × ' + n + ' = ' + sq + '.', n + ' × ' + n + ' = ', [String(sq), 'square number']),
            x('The other choices fall in the gaps between square numbers.', [String(sq), 'answer'])
          ]
        });
      }
      var nat = n < 12 ? n + 1 : 12;
      if (v === 0) {
        prompt = 'What is the square of ' + n + '? That means ' + n + ' × ' + n + '.'; ans = sq;
        tr = [T(String(2 * n), 'You doubled ' + n + '. A square number multiplies the number by itself: ' + n + ' × ' + n + '.'), T(String(sq + n), 'That is one row too many. You want exactly ' + n + ' rows of ' + n + '.')];
        work = n + ' × ' + n + ' = ' + sq + '.'; plain = 'Multiply the number by itself.';
        teach = [
          x('A square number is a number times itself. Here we find ' + n + ' × ' + n + '.', [String(n), 'the number'], ' × ', [String(n), 'itself']),
          grid('Make a square array. ' + n + ' rows and ' + n + ' columns.', n, n, [{ c0: 0, c1: n, r0: 0, r1: n, cls: 'bg-indigo-400' }]),
          x('Count by ' + n + ' for ' + n + ' rows. ' + skip(n, n) + '.', 'Count: ', [skip(n, n), 'by ' + n]),
          x(n + ' × ' + n + ' = ' + sq + '.', n + ' × ' + n + ' = ', [String(sq), 'square number'])
        ];
      } else if (v === 1) {
        var ctx = R.pick(['A square patio is ' + n + ' tiles long and ' + n + ' tiles wide. How many tiles cover the patio?', 'A square quilt has ' + n + ' patches along each side. How many patches are there in all?', 'Rinka makes a square of counters with ' + n + ' counters on each side. How many counters are in the square?']);
        prompt = ctx; ans = sq;
        tr = [T(String(4 * n), 'That counts only the edge going around. Fill the whole square: ' + n + ' rows of ' + n + '.'), T(String(2 * n), 'You added the two sides. Multiply them instead.')];
        work = n + ' × ' + n + ' = ' + sq + '.'; plain = 'A square has the same number in each row and each column. Multiply them.';
        teach = [
          x('Each side has ' + n + '. So we have ' + n + ' rows of ' + n + '.', [String(n), 'rows'], ' × ', [String(n), 'in each row']),
          grid('Here is the square.', n, n, [{ c0: 0, c1: n, r0: 0, r1: n, cls: 'bg-emerald-400' }]),
          x('Multiply. ' + n + ' × ' + n + ' = ' + sq + '.', n + ' × ' + n + ' = ', [String(sq), 'total']),
          x('There are ' + sq + ' in all.', [String(sq), 'answer'])
        ];
      } else if (v === 2) {
        prompt = 'What number multiplied by itself makes ' + sq + '?'; ans = n;
        tr = [T(String(sq / 2 === Math.floor(sq / 2) ? sq / 2 : sq - 1), 'That is half of ' + sq + '. The number times itself must equal ' + sq + '.'), T(String(n + 1), 'Check by multiplying. ' + (n + 1) + ' × ' + (n + 1) + ' is ' + ((n + 1) * (n + 1)) + ', not ' + sq + '.')];
        work = n + ' × ' + n + ' = ' + sq + '.'; plain = 'Go through the square numbers until you reach ' + sq + '.';
        var lst = []; for (var i = 1; i <= n; i++) lst.push(i + ' × ' + i + ' = ' + (i * i));
        teach = [
          x('We are looking for a number that times itself gives ' + sq + '.', ['?', 'the number'], ' × ', ['?', 'itself'], ' = ' + sq),
          lines('Try the square numbers in order until we reach ' + sq + '.', lst.slice(Math.max(0, lst.length - 6)), 99),
          x(n + ' × ' + n + ' = ' + sq + '. We found it.', n + ' × ' + n + ' = ', [String(sq), 'matches']),
          x('So the number is ' + n + '.', [String(n), 'answer'])
        ];
      } else {
        var nx = (n + 1) * (n + 1);
        prompt = 'What is the next square number after ' + sq + '?'; ans = nx;
        tr = [T(String(sq + n), 'That is one more group of ' + n + ', not the next square. The next square is ' + (n + 1) + ' × ' + (n + 1) + '.'), T(String(sq + 1), 'Adding 1 does not give a square number. The next square is ' + (n + 1) + ' × ' + (n + 1) + '.')];
        work = sq + ' is ' + n + ' × ' + n + '. The next is ' + (n + 1) + ' × ' + (n + 1) + ' = ' + nx + '.'; plain = 'Find which number times itself gives ' + sq + ', then go up by one.';
        teach = [
          x(sq + ' is a square number. First find which number times itself makes ' + sq + '.', n + ' × ' + n + ' = ', [String(sq), 'the square']),
          x('The next whole number is ' + (n + 1) + '. Multiply it by itself.', [String(n + 1), 'next number'], ' × ', [String(n + 1), 'itself']),
          x((n + 1) + ' × ' + (n + 1) + ' = ' + nx + '. Break it apart if you need to: ' + (n + 1) + ' × ' + n + ' = ' + ((n + 1) * n) + ', plus ' + (n + 1) + ' more is ' + nx + '.', (n + 1) + ' × ' + (n + 1) + ' = ', [String(nx), 'next square']),
          x('So the next square number is ' + nx + '.', [String(nx), 'answer'])
        ];
      }
      return N({ skill: 'Square numbers', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number', traps: tr, work: work, plain: plain, teach: teach });
    } },

    { id: 'divfact', level: 3, name: 'Division facts', make: function () {
      var a = R.int(2, 12), b = R.int(2, 12), p = a * b, v = R.int(0, 3);
      var prompt = v === 0 ? 'What is ' + p + ' ÷ ' + a + '?' : (v === 1 ? 'How many groups of ' + a + ' are in ' + p + '?' : (v === 2 ? 'A box of ' + p + ' crayons is shared equally among ' + a + ' friends. How many crayons does each friend get?' : 'There are ' + p + ' students. They make teams of ' + a + '. How many teams are there?'));
      return N({
        skill: 'Division facts', prompt: prompt, answer: b, keyboard: 'numeric', placeholder: 'Type a whole number',
        traps: [T(String(a), 'That is the number you divide by. Ask what number times ' + a + ' makes ' + p + '.'), T(String(p - a), 'You subtracted once. Division asks how many equal groups fit.'), T(String(a + 1 === b ? b + 1 : a + 1), 'Check by multiplying back. It should give ' + p + '.')],
        work: p + ' ÷ ' + a + ' = ' + b + ' because ' + b + ' × ' + a + ' = ' + p + '.', plain: 'Think of the times table. What number times ' + a + ' makes ' + p + '?',
        teach: [
          x('Turn the division into a multiplication question. What number times ' + a + ' makes ' + p + '?', p + ' ÷ ' + a + ' = ', ['?', 'missing'], '   ', ['? × ' + a + ' = ' + p, 'think this']),
          note('Count by ' + a + ' until you reach ' + p + '.', 'Skip counting', [skip(a, Math.min(b, 12)), 'That is ' + b + ' counts']),
          groups(b + ' groups of ' + a + ' make ' + p + '.', b, a, b, a + ' in each group'),
          x(b + ' × ' + a + ' = ' + p + ', so ' + p + ' ÷ ' + a + ' = ' + b + '.', p + ' ÷ ' + a + ' = ', [String(b), 'answer']),
          x('Check by multiplying back. ' + b + ' × ' + a + ' = ' + p + '.', b + ' × ' + a + ' = ', [String(p), 'the total'])
        ]
      });
    } },

    { id: 'hardfacts', level: 4, name: 'Hard facts by breaking apart', make: function () {
      var pool = [6, 7, 8, 9, 11, 12], a = R.pick(pool), b = R.pick(pool), v = R.int(0, 2);
      var p = a * b;
      var e1 = a <= 9 ? 5 : 10, e2 = a - e1;
      var prompt = v === 0 ? 'What is ' + a + ' × ' + b + '?' : (v === 1 ? 'What is the product of ' + a + ' and ' + b + '?' : 'A hockey arena has ' + a + ' sections. Each section has ' + b + ' seats. How many seats are there?');
      return N({
        skill: 'Hard multiplication facts', prompt: prompt, answer: p, keyboard: 'numeric', placeholder: 'Type a whole number',
        traps: [T(String(a + b), 'You added. Multiply instead.'), T(String(p - b), 'That is one group of ' + b + ' too few. Check both parts of your split.'), T(String(e1 * b), 'That is only the first part. Now add ' + e2 + ' × ' + b + '.')],
        work: a + ' = ' + e1 + ' + ' + e2 + '. ' + e1 + ' × ' + b + ' = ' + (e1 * b) + ', ' + e2 + ' × ' + b + ' = ' + (e2 * b) + ', and ' + (e1 * b) + ' + ' + (e2 * b) + ' = ' + p + '.', plain: 'Split ' + a + ' into ' + e1 + ' and ' + e2 + '. Multiply each part by ' + b + ' and add.',
        teach: [
          x('Split ' + a + ' into ' + e1 + ' and ' + e2 + ', two easier facts.', a + ' × ' + b + ' = ', [e1 + ' × ' + b, 'easy part'], ' + ', [e2 + ' × ' + b, 'other part']),
          grid('See it in an array. ' + a + ' rows of ' + b + ' is ' + e1 + ' rows and ' + e2 + ' rows.', b, a, [{ c0: 0, c1: b, r0: 0, r1: e1, cls: 'bg-indigo-400' }, { c0: 0, c1: b, r0: e1, r1: a, cls: 'bg-emerald-400' }]),
          x(e1 + ' × ' + b + ' = ' + (e1 * b) + '.', e1 + ' × ' + b + ' = ', [String(e1 * b), 'blue part']),
          x(e2 + ' × ' + b + ' = ' + (e2 * b) + '.', e2 + ' × ' + b + ' = ', [String(e2 * b), 'green part']),
          x('Add the two parts. ' + (e1 * b) + ' + ' + (e2 * b) + ' = ' + p + '.', (e1 * b) + ' + ' + (e2 * b) + ' = ', [String(p), 'answer'])
        ]
      });
    } },

    { id: 'famfam', level: 4, name: 'Fact families', make: function () {
      var a = R.int(2, 12), b = R.int(2, 12);
      while (b === a) b = R.int(2, 12);
      var p = a * b, v = R.int(0, 2);
      var fam = [
        lines('The numbers ' + a + ', ' + b + ' and ' + p + ' make a fact family. The biggest number is at the top.', ['      ' + p, '     /  \\', '    ' + a + '    ' + b], 99),
        x('Two multiplication facts.', a + ' × ' + b + ' = ' + p + '    ', b + ' × ' + a + ' = ' + p),
        x('Two division facts. Start with ' + p + '.', p + ' ÷ ' + a + ' = ', [String(b), 'fact 3'], '    ' + p + ' ÷ ' + b + ' = ', [String(a), 'fact 4'])
      ];
      if (v === 2) {
        var right = p + ' ÷ ' + b + ' = ' + a;
        var opts = [{ text: right, ok: true }, { text: a + ' ÷ ' + p + ' = ' + b, ok: false, trap: 'The biggest number must come first in a division fact. ' + a + ' ÷ ' + p + ' does not work.' }, { text: p + ' ÷ ' + a + ' = ' + a, ok: false, trap: p + ' ÷ ' + a + ' is ' + b + ', not ' + a + '.' }, { text: p + ' − ' + a + ' = ' + b, ok: false, trap: 'Fact families use times and divide, not take away.' }];
        return Q.choice({
          skill: 'Fact families', prompt: 'Which number sentence is in the same fact family as ' + a + ' × ' + b + ' = ' + p + '?', options: opts,
          work: 'The family has ' + a + ' × ' + b + ' = ' + p + ', ' + b + ' × ' + a + ' = ' + p + ', ' + p + ' ÷ ' + a + ' = ' + b + ' and ' + p + ' ÷ ' + b + ' = ' + a + '.', plain: 'A fact family uses the same three numbers. The biggest number is divided by the small ones.',
          teach: fam.concat([x('Check each choice. Only ' + right + ' is on the list.', [right, 'in the family']), note('Facts in this family.', 'Four facts', [a + ' × ' + b + ' = ' + p, b + ' × ' + a + ' = ' + p, p + ' ÷ ' + a + ' = ' + b, p + ' ÷ ' + b + ' = ' + a])])
        });
      }
      var q1 = v === 0 ? [p + ' ÷ ' + a, b] : [p + ' ÷ ' + b, a];
      return N({
        skill: 'Fact families', prompt: a + ', ' + b + ' and ' + p + ' are a fact family. Since ' + a + ' × ' + b + ' = ' + p + ', what is ' + q1[0] + '?', answer: q1[1], keyboard: 'numeric', placeholder: 'Type a whole number',
        traps: [T(String(p), 'That is the total. Divide the total by the small number.'), T(String(a + b), 'You added. Use the fact family instead.')],
        work: 'The family is ' + a + ' × ' + b + ' = ' + p + ', ' + b + ' × ' + a + ' = ' + p + ', ' + p + ' ÷ ' + a + ' = ' + b + ', ' + p + ' ÷ ' + b + ' = ' + a + '. So ' + q1[0] + ' = ' + q1[1] + '.', plain: 'Division undoes multiplication. The other small number in the family is the answer.',
        teach: fam.concat([x('So ' + q1[0] + ' = ' + q1[1] + '.', q1[0] + ' = ', [String(q1[1]), 'answer'])])
      });
    } },

    { id: 'missing', level: 4, name: 'Missing factor', make: function () {
      var a = R.int(3, 12), b = R.int(3, 12), p = a * b, v = R.int(0, 3);
      var prompt, ans = b, known = a;
      if (v === 0) { prompt = 'What number makes this true? ? × ' + a + ' = ' + p; }
      else if (v === 1) { prompt = 'What number makes this true? ' + a + ' × ? = ' + p; }
      else if (v === 2) { prompt = 'What number makes this true? ' + p + ' ÷ ? = ' + a; ans = b; }
      else { prompt = 'An array of ' + p + ' chairs has ' + a + ' rows. How many chairs are in each row?'; }
      var sh = v === 2 ? p + ' ÷ ' + b + ' = ' + a : '';
      return N({
        skill: 'Missing factor', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type the missing number',
        traps: [T(String(p + known), 'You added. The product is already given. Divide it by the number you know.'), T(String(p - known), 'You subtracted. Use division, the opposite of multiplication.'), T(String(known), 'That is the number you already know. Find the other one.')],
        work: p + ' ÷ ' + a + ' = ' + b + '. Check: ' + b + ' × ' + a + ' = ' + p + '.', plain: 'Use the inverse. Divide the total by the number you know.',
        teach: [
          x('Something is missing. We know the total is ' + p + ' and one number is ' + a + '.', ['?', 'missing'], ' and ', [String(a), 'known'], ' with total ', [String(p), 'product']),
          bars('Draw ' + a + ' as the size of one group. The whole is ' + p + '.', [row('Total ' + p, Math.min(b, 12), 'bg-indigo-400', String(a), String(p))]),
          x('Use the inverse. Divide the product by the known number. ' + p + ' ÷ ' + a + ' = ' + b + '.', p + ' ÷ ' + a + ' = ', [String(b), 'missing number']),
          x('Check by multiplying back. ' + b + ' × ' + a + ' = ' + p + '.', b + ' × ' + a + ' = ', [String(p), 'matches']),
          x('The missing number is ' + b + '.', [String(b), 'answer'])
        ]
      });
    } },

    { id: 'multiples', level: 4, name: 'Multiples', make: function () {
      var m = R.int(3, 12), v = R.int(0, 4), prompt, ans, tr, teach, work, plain;
      if (v === 4) {
        var kk0 = R.int(3, 12), good = m * kk0, bad = [], cands = R.shuffle([good + 1, good + 2, good - 1, good + m + 1, good - m + 1, good - 2]);
        for (var ci = 0; ci < cands.length && bad.length < 3; ci++) if (cands[ci] > 0 && cands[ci] % m !== 0 && bad.indexOf(cands[ci]) < 0) bad.push(cands[ci]);
        return Q.choice({
          skill: 'Multiples', prompt: 'Which of these numbers is a multiple of ' + m + '?',
          options: [{ text: String(good), ok: true }].concat(bad.map(function (w) { return { text: String(w), ok: false, trap: w + ' does not appear when you count by ' + m + '. It leaves a remainder of ' + (w % m) + ' when divided by ' + m + '.' }; })),
          work: good + ' = ' + kk0 + ' × ' + m + ', so it is a multiple of ' + m + '.', plain: 'A multiple of ' + m + ' divides by ' + m + ' with nothing left over.',
          teach: [
            x('A multiple of ' + m + ' appears when you count by ' + m + '. It also divides by ' + m + ' exactly.', ['multiple of ' + m, 'count by ' + m]),
            x('Count by ' + m + ' up to ' + good + '.', 'Multiples: ', [skip(m, Math.min(kk0, 8)) + (kk0 > 8 ? ', ...' : ''), 'count by ' + m]),
            x(good + ' ÷ ' + m + ' = ' + kk0 + ' with nothing left over, so ' + good + ' is a multiple of ' + m + '.', good + ' ÷ ' + m + ' = ', [String(kk0), 'no remainder']),
            x('The other choices leave a remainder, so they are not multiples.', [String(good), 'answer'])
          ]
        });
      }
      if (v === 0) {
        var k = R.int(3, 12); ans = m * k; prompt = 'What is the ' + ord(k) + ' multiple of ' + m + '?';
        tr = [T(String(m + k), 'You added. The ' + ord(k) + ' multiple means ' + k + ' × ' + m + '.'), T(String(m * (k - 1)), 'That is the ' + ord(k - 1) + ' multiple. Count one more.')];
        work = k + ' × ' + m + ' = ' + ans + '.'; plain = 'The ' + ord(k) + ' multiple of ' + m + ' is ' + k + ' × ' + m + '.';
        teach = [
          x('The multiples of ' + m + ' are the numbers when we count by ' + m + '.', 'Count by ' + m + ': ', [skip(m, Math.min(k, 6)) + ', ...', 'multiples']),
          x('The first multiple is 1 × ' + m + ' = ' + m + '. The second is 2 × ' + m + ' = ' + (2 * m) + '.', ['1 × ' + m + ' = ' + m, '1st'], '   ', ['2 × ' + m + ' = ' + (2 * m), '2nd']),
          x('The ' + ord(k) + ' multiple is ' + k + ' × ' + m + '.', ord(k) + ' multiple = ', [k + ' × ' + m, 'k times m']),
          x(k + ' × ' + m + ' = ' + ans + '.', k + ' × ' + m + ' = ', [String(ans), 'answer'])
        ];
      } else if (v === 1) {
        var X = R.int(30, 100); ans = m * (Math.floor(X / m) + 1); prompt = 'What is the smallest multiple of ' + m + ' that is greater than ' + X + '?';
        tr = [T(String(m * Math.floor(X / m)), Math.floor(X / m) * m === X ? 'That is equal to ' + X + ', but the question says greater than ' + X + '.' : 'That is below ' + X + '. We need one that is greater than ' + X + '.'), T(String(X + m), 'That is not always a multiple of ' + m + '. Count by ' + m + ' until you pass ' + X + '.')];
        work = 'Count by ' + m + ': the multiple just below or at ' + X + ' is ' + (m * Math.floor(X / m)) + '. The next one is ' + ans + '.'; plain = 'Count by ' + m + ' until you pass ' + X + '.';
        teach = [
          x('We need a multiple of ' + m + ' that is bigger than ' + X + '. Find how many ' + m + 's fit in ' + X + '.', ['multiple of ' + m, '> ' + X]),
          x('Look for the closest multiple at or below ' + X + '. ' + Math.floor(X / m) + ' × ' + m + ' = ' + (m * Math.floor(X / m)) + '.', Math.floor(X / m) + ' × ' + m + ' = ', [String(m * Math.floor(X / m)), 'at or below ' + X]),
          x('That is ' + (m * Math.floor(X / m) === X ? 'equal to ' + X + ', which is not greater. Go up one more.' : 'below ' + X + '. Go up one more multiple.'), (m * Math.floor(X / m)) + ' + ' + m + ' = ', [String(ans), 'next multiple']),
          x(ans + ' is greater than ' + X + '.', [String(ans), 'answer'], ' > ' + X)
        ];
      } else if (v === 2) {
        var Nn = R.int(40, 100); ans = Math.floor(Nn / m); prompt = 'How many multiples of ' + m + ' are there from ' + m + ' up to ' + Nn + '? Count ' + Nn + ' too if it is a multiple.';
        tr = [T(String(ans + 1), 'That is one too many. The next multiple is above ' + Nn + '.'), T(String(ans - 1), 'That is one too few. Count the last multiple that fits.')];
        work = Nn + ' ÷ ' + m + ' is about ' + ans + ' with some left over, so there are ' + ans + ' multiples.'; plain = 'Find how many times ' + m + ' fits into ' + Nn + '.';
        teach = [
          x('Each multiple is one more count of ' + m + '. So we want to know how many ' + m + 's fit into ' + Nn + '.', ['multiples of ' + m, 'up to ' + Nn]),
          x('Use division. ' + Nn + ' ÷ ' + m + ' is ' + ans + ' with ' + (Nn - ans * m) + ' left over.', Nn + ' ÷ ' + m + ' = ', [ans + ' r ' + (Nn - ans * m), 'quotient and remainder']),
          x('The last multiple that fits is ' + ans + ' × ' + m + ' = ' + (ans * m) + '.', ans + ' × ' + m + ' = ', [String(ans * m), 'last multiple']),
          x('The next one is ' + ((ans + 1) * m) + ', which is more than ' + Nn + '. So there are ' + ans + ' multiples.', [String(ans), 'answer'])
        ];
      } else {
        var kk = R.int(3, 5); ans = m * kk * (kk + 1) / 2; prompt = 'What is the sum of the first ' + kk + ' multiples of ' + m + '?';
        var ml = []; for (var i = 1; i <= kk; i++) ml.push(m * i);
        tr = [T(String(m * kk), 'That is only the ' + ord(kk) + ' multiple. Add all ' + kk + ' multiples together.'), T(String(ml.slice(0, kk - 1).reduce(function (a, c) { return a + c; }, 0)), 'You left out the last multiple, ' + ml[kk - 1] + '. Add all ' + kk + '.')];
        work = ml.join(' + ') + ' = ' + ans + '.'; plain = 'List the multiples by counting by ' + m + '. Then add them.';
        teach = [
          x('List the first ' + kk + ' multiples of ' + m + ' by counting by ' + m + '.', 'Multiples: ', [ml.join(', '), 'count by ' + m]),
          x('Now add them one at a time. ' + ml[0] + ' + ' + ml[1] + ' = ' + (ml[0] + ml[1]) + '.', ml[0] + ' + ' + ml[1] + ' = ', [String(ml[0] + ml[1]), 'running total']),
          x('Keep adding the rest.', ml.join(' + ') + ' = ', [String(ans), 'sum']),
          x('So the sum of the first ' + kk + ' multiples of ' + m + ' is ' + ans + '.', [String(ans), 'answer'])
        ];
      }
      return N({ skill: 'Multiples', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number', traps: tr, work: work, plain: plain, teach: teach });
    } },

    { id: 'story', level: 4, name: 'Multiplication and division stories', make: function () {
      var a = R.int(3, 12), b = R.int(3, 12), p = a * b, v = R.int(0, 3), prompt, ans, work, plain, tr, teach;
      if (v === 0) {
        var c = R.pick([['A loonie hockey pool has ', ' boxes of Timbits with ', ' Timbits in each box. How many Timbits are there?', 'Timbits'], ['A ferry has ', ' rows of seats with ', ' seats in each row. How many seats are there?', 'seats'], ['A shelf has ', ' baskets with ', ' apples in each basket. How many apples are there?', 'apples']]);
        prompt = c[0].replace('A loonie hockey pool has ', 'A bakery sells ') + a + c[1] + b + c[2]; ans = p;
        tr = [T(String(a + b), 'You added. The groups are equal, so multiply.'), T(String(p - b), 'That is one group too few. Multiply ' + a + ' × ' + b + '.')];
        work = a + ' × ' + b + ' = ' + p + ' ' + c[3] + '.'; plain = 'Equal groups: number of groups times size of each group.';
        teach = [
          x('We know the number of groups and the size of each group. We want the total.', [String(a), 'groups'], ' × ', [String(b), 'in each group'], ' = ?'),
          bars('Draw ' + a + ' equal boxes. Each box holds ' + b + '.', [row('Groups', a, 'bg-indigo-400', String(b), '?')]),
          x('Multiply. ' + a + ' × ' + b + ' = ' + p + '.', a + ' × ' + b + ' = ', [String(p), c[3]]),
          x('The total is ' + p + ' ' + c[3] + '.', [String(p), 'answer'])
        ];
      } else if (v === 1) {
        var d = R.pick([['Rinka has ' + p + ' stickers to share equally among ' + a + ' friends. How many stickers does each friend get?', 'stickers'], ['A rope ' + p + ' metres long is cut into ' + a + ' equal pieces. How long is each piece in metres?', 'metres'], ['A class has ' + p + ' pencils to share equally into ' + a + ' cups. How many pencils are in each cup?', 'pencils']]);
        prompt = d[0]; ans = b;
        tr = [T(String(p), 'That is the total. Share it equally into ' + a + ' groups.'), T(String(a), 'That is the number of groups. Find the size of each group.')];
        work = p + ' ÷ ' + a + ' = ' + b + ' ' + d[1] + '.'; plain = 'Sharing equally is dividing the total by the number of groups.';
        teach = [
          x('We know the total and the number of groups. We want the size of each group.', [String(p), 'total'], ' ÷ ', [String(a), 'groups'], ' = ?'),
          bars('Draw ' + a + ' equal boxes that together hold ' + p + '.', [row('Groups', Math.min(a, 12), 'bg-emerald-400', '?', String(p))]),
          x('Divide. ' + p + ' ÷ ' + a + ' = ' + b + ', because ' + b + ' × ' + a + ' = ' + p + '.', p + ' ÷ ' + a + ' = ', [String(b), d[1] + ' in each']),
          x('Each group gets ' + b + ' ' + d[1] + '.', [String(b), 'answer'])
        ];
      } else if (v === 2) {
        var e = R.pick([['A school has ' + p + ' students going on a trip. Each bus holds ' + a + ' students. How many buses are needed?', 'buses'], ['A baker packs ' + p + ' muffins into boxes of ' + a + '. How many boxes does the baker fill?', 'boxes'], ['Rinka has ' + p + ' loonies. She stacks them in piles of ' + a + '. How many piles does she make?', 'piles']]);
        prompt = e[0]; ans = b;
        tr = [T(String(p), 'That is the total. Ask how many groups of ' + a + ' fit into it.'), T(String(a), 'That is the size of each group. Find how many groups.')];
        work = p + ' ÷ ' + a + ' = ' + b + ' ' + e[1] + '.'; plain = 'How many groups of ' + a + ' fit into ' + p + '? Divide.';
        teach = [
          x('We know the total and the size of each group. We want the number of groups.', [String(p), 'total'], ' ÷ ', [String(a), 'size of each group'], ' = ?'),
          bars('Each box holds ' + a + '. How many boxes fit in ' + p + '?', [row('Groups', Math.min(b, 12), 'bg-amber-400', String(a), String(p))]),
          x('Divide. ' + p + ' ÷ ' + a + ' = ' + b + ', because ' + b + ' × ' + a + ' = ' + p + '.', p + ' ÷ ' + a + ' = ', [String(b), e[1]]),
          x('So we need ' + b + ' ' + e[1] + '.', [String(b), 'answer'])
        ];
      } else {
        var k = R.int(2, 9), base = R.int(3, 12), nm = R.pick([['Ella', 'Jo', 'marbles'], ['Sam', 'Mia', 'hockey cards'], ['Leo', 'Ava', 'stickers']]);
        prompt = nm[0] + ' has ' + base + ' ' + nm[2] + '. ' + nm[1] + ' has ' + k + ' times as many ' + nm[2] + ' as ' + nm[0] + '. How many ' + nm[2] + ' does ' + nm[1] + ' have?'; ans = k * base;
        tr = [T(String(k + base), 'You added. "Times as many" means multiply.'), T(String(k * base + base), 'That includes ' + nm[0] + '\'s ' + nm[2] + ' as well. The question asks only about ' + nm[1] + '.')];
        work = k + ' × ' + base + ' = ' + ans + '.'; plain = '"' + k + ' times as many" means ' + k + ' equal boxes of ' + base + '.';
        teach = [
          x(nm[0] + ' has ' + base + '. ' + nm[1] + ' has ' + k + ' times as many.', [String(base), nm[0]], ' × ', [String(k), 'times as many']),
          bars(nm[0] + ' is one box. ' + nm[1] + ' is ' + k + ' boxes of the same size.', [row(nm[0], 1, 'bg-indigo-400', String(base)), row(nm[1], k, 'bg-emerald-400', String(base), '?')]),
          x('Multiply. ' + k + ' × ' + base + ' = ' + ans + '.', k + ' × ' + base + ' = ', [String(ans), nm[2]]),
          x(nm[1] + ' has ' + ans + ' ' + nm[2] + '.', [String(ans), 'answer'])
        ];
      }
      return N({ skill: 'Multiplication and division stories', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number', traps: tr, work: work, plain: plain, teach: teach });
    } },

    { id: 'factors', level: 5, name: 'Factors', make: function () {
      var v = R.int(0, 2), prompt, ans, tr, teach, work, plain, n, f, ps;
      if (v === 0) {
        n = R.pick([12, 16, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 54, 60]); f = factorsOf(n); ps = pairsOf(n); ans = f.length;
        prompt = 'How many factors does ' + n + ' have? Count 1 and ' + n + ' too.';
        tr = [T(String(ps.length), 'That counts the pairs. Each pair gives two factors, unless the two are the same.'), T(String(ans - 2), 'You left out 1 and ' + n + '. Both are factors.')];
        work = 'The factors of ' + n + ' are ' + f.join(', ') + '. That is ' + ans + ' factors.'; plain = 'Find all the pairs that multiply to ' + n + ', then count every number in them.';
      } else if (v === 1) {
        n = R.pick([6, 8, 10, 12, 14, 15, 16, 18, 20, 21, 24]); f = factorsOf(n); ps = pairsOf(n); ans = f.reduce(function (a, c) { return a + c; }, 0);
        prompt = 'What is the sum of all the factors of ' + n + '?';
        tr = [T(String(ans - n), 'You left out ' + n + ' itself. It is a factor of ' + n + '.'), T(String(ans - 1), 'You left out 1. It is a factor of every number.')];
        work = f.join(' + ') + ' = ' + ans + '.'; plain = 'List every factor, then add them.';
      } else {
        n = R.pick([12, 16, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 54, 60]); f = factorsOf(n); ps = pairsOf(n); ans = f[f.length - 2];
        prompt = 'What is the greatest factor of ' + n + ' that is less than ' + n + '?';
        tr = [T(String(n), 'That is ' + n + ' itself. We want the greatest one below ' + n + '.'), T(String(f[f.length - 3]), 'That is the third biggest. The one just below ' + n + ' is bigger.')];
        work = 'The factors of ' + n + ' are ' + f.join(', ') + '. The greatest below ' + n + ' is ' + ans + '.'; plain = 'List the factors. Pick the biggest one that is not the number itself.';
      }
      teach = [
        x('A factor divides the number exactly. Find pairs that multiply to ' + n + '.', [String(n), 'find its factors']),
        lines('Try 1, 2, 3 and so on. Keep every pair that multiplies to ' + n + '.', ps.map(function (q) { return q[0] + ' × ' + q[1] + ' = ' + n; }), 99),
        x('Collect the numbers from every pair, in order.', 'Factors of ' + n + ': ', [f.join(', '), 'all factors']),
        x(v === 0 ? 'Count them. There are ' + ans + ' factors.' : (v === 1 ? 'Add them. ' + f.join(' + ') + ' = ' + ans + '.' : 'The last one is ' + n + ' itself. The one before it is ' + ans + '.'), [String(ans), 'answer'])
      ];
      return N({ skill: 'Factors', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number', traps: tr, work: work, plain: plain, teach: teach });
    } },

    { id: 'story2', level: 5, name: 'Two step multiplication stories', make: function () {
      var v = R.int(0, 3), prompt, ans, tr, work, plain, teach;
      if (v === 0) {
        var a = R.int(3, 9), b = R.int(3, 9), c = R.int(2, 9);
        prompt = 'Rinka buys ' + a + ' packs of stickers with ' + b + ' stickers in each pack. She also has ' + c + ' loose stickers. How many stickers does she have in all?'; ans = a * b + c;
        tr = [T(String(a * b), 'That leaves out the ' + c + ' loose stickers. Add them at the end.'), T(String(a + b + c), 'You added everything. First multiply the packs.')];
        work = a + ' × ' + b + ' = ' + (a * b) + ', then ' + (a * b) + ' + ' + c + ' = ' + ans + '.'; plain = 'Step one: stickers in the packs. Step two: add the loose ones.';
        teach = [
          x('There are two steps. First the packs, then the loose stickers.', ['packs', 'step 1'], ' then ', ['loose', 'step 2']),
          bars('Packs first. ' + a + ' packs of ' + b + '.', [row('Packs', a, 'bg-indigo-400', String(b), String(a * b)), row('Loose', 1, 'bg-emerald-400', String(c))]),
          x(a + ' × ' + b + ' = ' + (a * b) + ' stickers in the packs.', a + ' × ' + b + ' = ', [String(a * b), 'in packs']),
          x('Add the loose stickers. ' + (a * b) + ' + ' + c + ' = ' + ans + '.', (a * b) + ' + ' + c + ' = ', [String(ans), 'answer'])
        ];
      } else if (v === 1) {
        var r = R.int(5, 12), cc = R.int(6, 12), s = R.int(3, 20);
        prompt = 'A theatre has ' + r + ' rows with ' + cc + ' seats in each row. ' + s + ' seats are already taken. How many seats are still free?'; ans = r * cc - s;
        tr = [T(String(r * cc), 'That is all the seats. Take away the ' + s + ' that are taken.'), T(String(r * cc + s), 'You added the taken seats. They should be taken away.')];
        work = r + ' × ' + cc + ' = ' + (r * cc) + ', then ' + (r * cc) + ' − ' + s + ' = ' + ans + '.'; plain = 'Step one: find all the seats. Step two: subtract the seats that are taken.';
        teach = [
          x('There are two steps. Find all the seats, then take away the taken ones.', ['total', 'step 1'], ' then ', ['take away', 'step 2']),
          grid('The theatre is an array. ' + r + ' rows and ' + cc + ' seats in each row.', cc, r, [{ c0: 0, c1: cc, r0: 0, r1: r, cls: 'bg-indigo-400' }]),
          x(r + ' × ' + cc + ' = ' + (r * cc) + ' seats in all.', r + ' × ' + cc + ' = ', [String(r * cc), 'all seats']),
          x('Take away the taken seats. ' + (r * cc) + ' − ' + s + ' = ' + ans + '.', (r * cc) + ' − ' + s + ' = ', [String(ans), 'free seats'])
        ];
      } else if (v === 2) {
        var k = R.int(3, 9), q = R.int(3, 9), pr = R.int(2, 9), p2 = k * q;
        prompt = 'A baker makes ' + p2 + ' muffins and packs them in boxes of ' + q + '. There are no muffins left over. Each box sells for $' + pr + '. How many dollars does the baker get if all the boxes are sold?'; ans = k * pr;
        tr = [T(String(p2 * pr), 'You multiplied the muffins by the price. The price is for a whole box, so first find the number of boxes.'), T(String(k), 'That is the number of boxes. Multiply by the price of each box.')];
        work = p2 + ' ÷ ' + q + ' = ' + k + ' boxes, then ' + k + ' × ' + pr + ' = ' + ans + ' dollars.'; plain = 'Step one: how many boxes. Step two: how much money for that many boxes.';
        teach = [
          x('There are two steps. Find the number of boxes, then find the money.', ['boxes', 'step 1'], ' then ', ['money', 'step 2']),
          bars('Boxes of ' + q + ' make ' + p2 + ' muffins in all.', [row('Boxes', Math.min(k, 12), 'bg-indigo-400', String(q), String(p2))]),
          x(p2 + ' ÷ ' + q + ' = ' + k + ' boxes.', p2 + ' ÷ ' + q + ' = ', [String(k), 'boxes']),
          x('Each box sells for $' + pr + '. ' + k + ' × ' + pr + ' = ' + ans + '.', k + ' × ' + pr + ' = ', [String(ans), 'dollars'])
        ];
      } else {
        var w = R.int(3, 9), sv = R.int(4, 12), sp = R.int(2, w * sv - 1);
        prompt = 'Mia saves $' + sv + ' each week for ' + w + ' weeks. Then she spends $' + sp + ' on a book. How many dollars does she have left?'; ans = w * sv - sp;
        tr = [T(String(w * sv), 'That is what she saved. Take away the $' + sp + ' she spent.'), T(String(sv - sp > 0 ? sv - sp : w * sv + sp), 'Check the steps. Find the total saved first, then subtract the spending.')];
        work = w + ' × ' + sv + ' = ' + (w * sv) + ', then ' + (w * sv) + ' − ' + sp + ' = ' + ans + '.'; plain = 'Step one: find how much she saved in all. Step two: subtract what she spent.';
        teach = [
          x('There are two steps. Find the total saved, then take away the spending.', ['saved', 'step 1'], ' then ', ['spent', 'step 2']),
          bars('Weekly saving in ' + w + ' equal boxes.', [row('Weeks', w, 'bg-indigo-400', '$' + sv, '$' + (w * sv))]),
          x(w + ' × ' + sv + ' = ' + (w * sv) + ' dollars saved.', w + ' × ' + sv + ' = ', [String(w * sv), 'saved']),
          x('Subtract the book. ' + (w * sv) + ' − ' + sp + ' = ' + ans + '.', (w * sv) + ' − ' + sp + ' = ', [String(ans), 'left'])
        ];
      }
      return N({ skill: 'Two step stories', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number', traps: tr, work: work, plain: plain, teach: teach });
    } },

    { id: 'chal', level: 6, name: 'Two numbers puzzle', make: function () {
      var a = R.int(2, 12), b = R.int(2, 12);
      while (a === b) b = R.int(2, 12);
      var lo = Math.min(a, b), hi = Math.max(a, b), p = lo * hi, s = lo + hi, d = hi - lo, v = R.int(0, 1);
      var prompt = v === 0 ? 'Two whole numbers multiply to ' + p + ' and add to ' + s + '. What is the bigger number?' : 'Two whole numbers multiply to ' + p + ' and their difference is ' + d + '. What is the bigger number?';
      var ps = pairsOf(p);
      var tr = [T(String(lo), 'That is the smaller number. The question asks for the bigger one.'), T(String(p), 'That is the product. Find the two numbers that make it.')];
      if (v === 1) tr.push(T(String(s), 'That is the sum of the two numbers. The question asks for the bigger number.'));
      return N({
        skill: 'Two numbers puzzle', prompt: prompt, answer: hi, keyboard: 'numeric', placeholder: 'Type a whole number', traps: tr,
        work: 'The factor pairs of ' + p + ' include ' + lo + ' and ' + hi + '. Their ' + (v === 0 ? 'sum is ' + s : 'difference is ' + d) + '. The bigger number is ' + hi + '.', plain: 'List the pairs of factors of ' + p + '. Find the pair that also fits the second clue.',
        teach: [
          x('First clue: the two numbers multiply to ' + p + '. So they are a factor pair of ' + p + '.', ['?', 'number'], ' × ', ['?', 'number'], ' = ' + p),
          lines('List the factor pairs of ' + p + ' with their ' + (v === 0 ? 'sums' : 'differences') + '.', ps.map(function (q) { return q[0] + ' × ' + q[1] + ' = ' + p + '   ' + (v === 0 ? 'sum ' + (q[0] + q[1]) : 'difference ' + (q[1] - q[0])); }), 99),
          x('Second clue: the ' + (v === 0 ? 'sum is ' + s : 'difference is ' + d) + '. Only one pair fits.', lo + ' and ' + hi, ' ', [v === 0 ? 'sum ' + s : 'difference ' + d, 'fits']),
          x('Check. ' + lo + ' × ' + hi + ' = ' + p + '. It works.', lo + ' × ' + hi + ' = ', [String(p), 'matches']),
          x('The bigger number is ' + hi + '.', [String(hi), 'answer'])
        ]
      });
    } }
  ]);
})();
