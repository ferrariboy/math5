/* Module 12: Number Patterns and Tables. Lessons, vocabulary and question skills. */
(function () {
  'use strict';
  var B = window.Bank, R = B.R, S = B.s, Q = B.q, T = Q.trap;
  var x = S.x, note = S.note, bars = S.bars, row = S.row, grid = S.grid, lines = S.lines;

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
  function seq(a, d, n) { var o = []; for (var i = 0; i < n; i++) o.push(a + d * i); return o; }
  function J(arr) { return arr.join(', '); }
  function pad(v, w) { v = String(v); while (v.length < w) v += ' '; return v; }
  /* Two lines: the terms, and the jump between each pair. sign is + or −. */
  function jumpLines(terms, sign, d) {
    var t = 'Terms:  ', j = 'Jumps:     ';
    terms.forEach(function (v, i) { t += pad(v, 6); if (i < terms.length - 1) j += pad(sign + d, 6); });
    return [t, j];
  }
  /* A table written as text lines. */
  function tbl(labA, inA, labB, outA, w) {
    w = w || 5;
    var lw = Math.max(labA.length, labB.length) + 1;
    return [pad(labA, lw) + '| ' + inA.map(function (v) { return pad(v, w); }).join('| '),
            pad(labB, lw) + '| ' + outA.map(function (v) { return pad(v, w); }).join('| ')];
  }
  function ord(n) {
    var s = ['th', 'st', 'nd', 'rd'], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  /* ---------- Vocabulary ---------- */
  window.MATH_VOCAB[12] = [
    { w: 'Pattern', m: 'A list of numbers or shapes that follows a rule, so you can tell what comes next.' },
    { w: 'Term', m: 'One number in a pattern. The first number is the 1st term, the next is the 2nd term, and so on.' },
    { w: 'Rule', m: 'The instruction that makes the pattern work, like "start at 5 and add 3 each time".' },
    { w: 'Increasing pattern', m: 'A pattern where the numbers get bigger each time.' },
    { w: 'Decreasing pattern', m: 'A pattern where the numbers get smaller each time.' },
    { w: 'Input and output', m: 'In a table, the input is the number that goes in and the output is the number that comes out after the rule is used.' },
    { w: 'Position', m: 'The place of a term in the pattern. The 5th term is in position 5.' },
    { w: 'Extend', m: 'To keep a pattern going by finding more terms.' }
  ];

  /* ---------- Lessons ---------- */
  window.MATH_LESSONS[12] = [
    { title: '1. What is a pattern?',
      explain: [
        'A pattern is something that follows a rule. Think of the stripes on a scarf or the beat of a song. You can tell what comes next because the rule never changes.',
        'Some patterns repeat, like red, blue, red, blue. Other patterns grow, like a tower that gets one block taller each day.',
        'In this module we work with number patterns. Each number is called a term.'
      ],
      rule: 'A pattern follows a rule. Find the rule and you can find what comes next.',
      mistake: 'Do not guess from just two numbers. Check that the same rule works all the way along.',
      steps: [
        note('A pattern is a list that follows a rule. The rule tells you what comes next.', 'What is a pattern?', ['Colors or shapes that repeat', 'Numbers that grow or shrink in the same way']),
        lines('This pattern repeats. It goes red, blue, red, blue. R means red and B means blue.', ['R  B  R  B  R  B  ?'], 99),
        lines('The rule is red then blue, again and again. So the next one is red.', ['R  B  R  B  R  B', 'R'], 1),
        bars('Now look at a growing pattern. Each step has one more box.', [row('Step 1', 1, 'bg-indigo-400'), row('Step 2', 2, 'bg-indigo-400'), row('Step 3', 3, 'bg-indigo-400')]),
        bars('Step 4 has 4 boxes. The rule is add one box each time.', [row('Step 1', 1, 'bg-indigo-400'), row('Step 2', 2, 'bg-indigo-400'), row('Step 3', 3, 'bg-indigo-400'), row('Step 4', 4, 'bg-amber-400')]),
        x('Numbers make patterns too. Each number here is 2 more than the one before.', '2, 4, 6, 8, ', ['10', 'next term'])
      ] },

    { title: '2. Increasing patterns',
      explain: [
        'An increasing pattern gets bigger each time. You start at one number and add the same amount again and again.',
        'The amount you add is called the jump. In the pattern 3, 7, 11, 15, the jump is 4.',
        'To find the jump, subtract any term from the term after it.'
      ],
      rule: 'Increasing pattern: start somewhere, then add the same jump each time.',
      mistake: 'The jump must be the same every time. If the gaps are different, it is not this kind of pattern.',
      steps: [
        bars('Let us build a pattern. Term 1 has 2 boxes.', [row('Term 1', 2, 'bg-emerald-400')]),
        bars('Term 2 has 3 more boxes. That makes 5.', [row('Term 1', 2, 'bg-emerald-400'), row('Term 2', 5, 'bg-emerald-400')]),
        bars('Term 3 has 3 more again. That makes 8.', [row('Term 1', 2, 'bg-emerald-400'), row('Term 2', 5, 'bg-emerald-400'), row('Term 3', 8, 'bg-emerald-400')]),
        lines('Write the numbers in a line. Each jump is +3.', jumpLines([2, 5, 8, 11, '?'], '+', 3), 0),
        x('The next term is the last term plus the jump. 11 + 3 = 14.', '11 + 3 = ', ['14', 'next term']),
        x('So the pattern is 2, 5, 8, 11, 14.', J(seq(2, 3, 4)) + ', ', ['14', 'new term'])
      ] },

    { title: '3. Decreasing patterns',
      explain: [
        'A decreasing pattern gets smaller each time. You take away the same amount again and again.',
        'Imagine a jar with 40 stickers. You give away 6 stickers every day. The jar goes 40, 34, 28, 22 and so on.',
        'The jump here is minus 6. The numbers go down, so we subtract to find the next term.'
      ],
      rule: 'Decreasing pattern: start somewhere, then subtract the same jump each time.',
      mistake: 'If the numbers go down, do not add. Subtract the jump to find the next term.',
      steps: [
        x('A jar has 40 stickers. Each day 6 stickers are given away. How many are left each day?', ['40', 'start'], ' then take away 6'),
        lines('Write the numbers in a line. Each jump is −6 because the numbers go down.', jumpLines([40, 34, 28, 22, '?'], '−', 6), 0),
        x('To find the next term, subtract 6 from the last term. 22 − 6 = 16.', '22 − 6 = ', ['16', 'next term']),
        x('The pattern is 40, 34, 28, 22, 16. It is a decreasing pattern.', J(seq(40, -6, 4)) + ', ', ['16', 'new term']),
        note('Compare the two kinds of pattern.', 'Increasing and decreasing', ['Increasing: add the jump, numbers get bigger', 'Decreasing: subtract the jump, numbers get smaller'])
      ] },

    { title: '4. Stating the rule in words',
      explain: [
        'A good rule tells two things. It says where the pattern starts and how it changes each time.',
        'To find the rule, look at how far each term is from the next one. If the gap is the same every time, that is your jump.',
        'Then say the rule in words, like "Start at 5 and add 7 each time".'
      ],
      rule: 'Say where it starts, then say what is added or subtracted each time.',
      mistake: 'Do not check just one gap. Check every gap. All the jumps must match.',
      steps: [
        x('Find the rule for this pattern. It starts 5, 12, 19, 26.', J([5, 12, 19, 26])),
        x('Check the first gap. 12 − 5 = 7.', '12 − 5 = ', ['7', 'gap 1']),
        x('Check the second gap. 19 − 12 = 7.', '19 − 12 = ', ['7', 'gap 2']),
        x('Check the third gap. 26 − 19 = 7. All the gaps are 7.', '26 − 19 = ', ['7', 'gap 3']),
        lines('Every jump is +7, so the rule works.', jumpLines([5, 12, 19, 26], '+', 7), 0),
        note('Now say the rule in words. Say where it starts and what changes.', 'The rule', ['Start at 5.', 'Add 7 each time.'])
      ] },

    { title: '5. Extending a pattern',
      explain: [
        'To extend a pattern means to keep it going. Once you know the rule, you can write as many terms as you like.',
        'Use the last term you know. Apply the rule to get the next term. Then use that new term to get the one after.',
        'It helps to write each new term down so you do not lose your place.'
      ],
      rule: 'Apply the rule to the last term to get the next term. Repeat.',
      mistake: 'Always use the newest term. If you keep adding to the first term you will get stuck on the same number.',
      steps: [
        x('The rule is start at 8 and add 5 each time. Write the first 6 terms.', ['8', 'start'], ' and add 5'),
        x('Term 1 is 8. Add 5 to get term 2. 8 + 5 = 13.', '8 + 5 = ', ['13', 'term 2']),
        x('Add 5 to term 2. 13 + 5 = 18.', '13 + 5 = ', ['18', 'term 3']),
        x('Add 5 to term 3. 18 + 5 = 23.', '18 + 5 = ', ['23', 'term 4']),
        x('Keep going. 23 + 5 = 28, then 28 + 5 = 33.', J(seq(8, 5, 4)) + ', ', ['28', 'term 5'], ', ', ['33', 'term 6']),
        lines('Check with the jumps. Every jump is +5.', jumpLines(seq(8, 5, 6), '+', 5), 0)
      ] },

    { title: '6. Input output tables',
      explain: [
        'Picture a machine. You put a number in, the machine follows a rule, and a new number comes out.',
        'The number that goes in is the input. The number that comes out is the output. A table lists them side by side.',
        'To fill in the table, use the same rule on every input.'
      ],
      rule: 'Use the same rule on every input to get every output.',
      mistake: 'Do not change the rule halfway down the table. The same rule works for every row.',
      steps: [
        note('Here is a number machine. The rule is add 6.', 'The machine', ['Input goes in', 'The machine adds 6', 'Output comes out']),
        lines('Start a table. We know the inputs 1, 2, 3 and 4. The outputs are empty.', tbl('Input', [1, 2, 3, 4], 'Output', ['?', '?', '?', '?']), 99),
        x('Input 1. The machine adds 6. 1 + 6 = 7.', '1 + 6 = ', ['7', 'output']),
        x('Input 2. 2 + 6 = 8. Input 3. 3 + 6 = 9. Input 4. 4 + 6 = 10.', '2 + 6 = ', ['8', 'output'], ',  3 + 6 = ', ['9', 'output'], ',  4 + 6 = ', ['10', 'output']),
        lines('The finished table.', tbl('Input', [1, 2, 3, 4], 'Output', [7, 8, 9, 10]), 1),
        note('Look at the output row. It goes up by 1 each time because the inputs go up by 1.', 'A pattern in the table', ['Inputs go up by 1', 'Outputs go up by 1 too'])
      ] },

    { title: '7. Finding the rule from a table',
      explain: [
        'Sometimes the table is already filled in and the rule is the mystery. You must work backwards.',
        'Compare an input with its output. Try adding or subtracting first. Then try multiplying.',
        'Once you have a rule, test it on every row. A real rule works on all of them.'
      ],
      rule: 'Compare input and output. Try add, subtract, then multiply. Test every row.',
      mistake: 'If one row works but another does not, you have not found the rule yet. Try a different one.',
      steps: [
        lines('What is the rule for this table?', tbl('Input', [2, 3, 4, 5], 'Output', [8, 12, 16, 20]), 99),
        x('Try adding. 2 to 8 is +6. But 3 to 12 is +9. The gaps do not match, so it is not an add rule.', '2 → 8 is +6,  3 → 12 is +9'),
        x('Try multiplying. 8 ÷ 2 = 4. The output is 4 times the input.', '8 ÷ 2 = ', ['4', 'times']),
        x('Test the next row. 3 × 4 = 12. It works.', '3 × 4 = ', ['12', 'matches']),
        x('Test the last rows. 4 × 4 = 16 and 5 × 4 = 20. They work too.', '4 × 4 = ', ['16', 'matches'], ',  5 × 4 = ', ['20', 'matches']),
        note('The rule works on every row.', 'The rule', ['Multiply the input by 4', 'Output = input × 4'])
      ] },

    { title: '8. Finding the 10th or 20th term',
      explain: [
        'Suppose you want the 20th term. You could write all 20 terms, but there is a faster way. Use the rule.',
        'Some patterns are times tables. In 4, 8, 12, 16 each term is 4 times its position. The 20th term is 4 × 20.',
        'Other patterns start somewhere and add a jump. For the 20th term you make 19 jumps, because the first term needs no jump.'
      ],
      rule: 'Times table pattern: term = jump × position. Start and add pattern: first term + (position − 1) × jump.',
      mistake: 'For a start and add pattern, count one fewer jump than the position. The 20th term has 19 jumps.',
      steps: [
        lines('Look at the pattern 4, 8, 12, 16. We want the 10th term. Counting all the way would be slow.', tbl('Position', [1, 2, 3, 4], 'Term', [4, 8, 12, 16]), 99),
        x('Each term is 4 times its position. 4 × 1 = 4, 4 × 2 = 8, 4 × 3 = 12.', 'Term = ', ['4', 'jump'], ' × position'),
        x('The 10th term is 4 × 10 = 40.', '4 × 10 = ', ['40', '10th term']),
        x('The 20th term is 4 × 20 = 80.', '4 × 20 = ', ['80', '20th term']),
        x('Now try 5, 8, 11, 14. It starts at 5 and adds 3. The 20th term needs 19 jumps of 3.', ['5', 'start'], ' + ', ['19', 'jumps'], ' × 3'),
        x('19 × 3 = 57. That is the total added.', '19 × 3 = ', ['57', 'total added']),
        x('Start at 5 and add 57. 5 + 57 = 62. The 20th term is 62.', '5 + 57 = ', ['62', '20th term']),
        note('The number of jumps is one less than the position.', 'Careful', ['1st term: 0 jumps', '2nd term: 1 jump', '20th term: 19 jumps'])
      ] },

    { title: '9. Growing shape patterns',
      explain: [
        'Shapes can make patterns too. Each figure is built from tiles, and the number of tiles grows in a steady way.',
        'Count the tiles in each figure and write the counts in a table. Then look for the jump, just like a number pattern.',
        'You can also describe the pattern in words, like "Figure 1 has 3 tiles and each new figure has 3 more".'
      ],
      rule: 'Count the tiles in each figure. Find the jump. Use it to predict later figures.',
      mistake: 'Do not just count the new tiles. The total for each figure includes the old tiles too.',
      steps: [
        grid('Figure 1 is a column of 3 tiles.', 3, 3, [{ c0: 0, c1: 1, r0: 0, r1: 3, cls: 'bg-indigo-400' }]),
        grid('Figure 2 adds another column. Now there are 6 tiles.', 3, 3, [{ c0: 0, c1: 1, r0: 0, r1: 3, cls: 'bg-indigo-400' }, { c0: 1, c1: 2, r0: 0, r1: 3, cls: 'bg-emerald-400' }]),
        grid('Figure 3 adds one more column. Now there are 9 tiles.', 3, 3, [{ c0: 0, c1: 1, r0: 0, r1: 3, cls: 'bg-indigo-400' }, { c0: 1, c1: 2, r0: 0, r1: 3, cls: 'bg-emerald-400' }, { c0: 2, c1: 3, r0: 0, r1: 3, cls: 'bg-amber-400' }]),
        lines('Put the counts in a table.', tbl('Figure', [1, 2, 3, 4], 'Tiles', [3, 6, 9, '?']), 99),
        x('Each figure has 3 more tiles than the one before. Figure 4 has 9 + 3 = 12 tiles.', '9 + 3 = ', ['12', 'Figure 4']),
        note('Say the pattern in words.', 'The rule', ['Figure 1 has 3 tiles.', 'Each new figure has 3 more tiles.', 'Figure 10 has 3 × 10 = 30 tiles.'])
      ] },

    { title: '10. Patterns in multiplication tables',
      explain: [
        'The times tables are full of patterns. Spotting them makes facts easier to remember.',
        'In the 9 times table, the digits of every answer add up to 9. In the 5 times table, the answers end in 5 or 0.',
        'The 6 times table is double the 3 times table, and the 8 times table is double the 4 times table.'
      ],
      rule: 'Look for patterns in the digits and in doubles to help you remember times facts.',
      mistake: 'Doubling a table means multiply the answer by 2. Do not add 2.',
      steps: [
        lines('Here is the 9 times table. Look at the digits of each answer.', ['9 × 1 =  9', '9 × 2 = 18', '9 × 3 = 27', '9 × 4 = 36', '9 × 5 = 45'], 99),
        x('The digits add to 9. 1 + 8 = 9, 2 + 7 = 9, 3 + 6 = 9, 4 + 5 = 9.', ['1 + 8', '9'], ',  ', ['2 + 7', '9'], ',  ', ['3 + 6', '9'], ',  ', ['4 + 5', '9']),
        x('The tens digit goes up by 1 and the ones digit goes down by 1.', '18, 27, 36, 45: tens ', ['1, 2, 3, 4', 'up'], ' ones ', ['8, 7, 6, 5', 'down']),
        x('The 5 times table always ends in 5 or 0.', '5, 10, 15, 20, 25, 30, 35, 40'),
        x('The 6 times table is double the 3 times table. 3 × 4 = 12, so 6 × 4 = 24.', '3 × 4 = 12,  ', ['12 × 2 = 24', 'double']),
        x('The 8 times table is double the 4 times table. 4 × 7 = 28, so 8 × 7 = 56.', '4 × 7 = 28,  ', ['28 × 2 = 56', 'double']),
        x('Each answer is one more group of the number. 6 × 8 = 48, so 6 × 9 = 48 + 6 = 54.', '6 × 8 = 48,  ', ['48 + 6 = 54', 'one more group'])
      ] },

    { title: '11. Rules with two operations',
      explain: [
        'Some machines do two things to the input. For example, multiply by 2, then add 1.',
        'Always do the steps in the order the rule says. First multiply, then add.',
        'A table with an extra middle row can help. Write the result of the first step, then the final output.'
      ],
      rule: 'Do the first operation, then the second, in the order the rule says.',
      mistake: 'Do not swap the order. Multiply by 2 then add 1 is different from add 1 then multiply by 2.',
      steps: [
        note('The rule is multiply by 2, then add 1.', 'Two step machine', ['Step one: × 2', 'Step two: + 1']),
        lines('Try the inputs 1, 2, 3 and 4. First we do × 2.', ['Input   | 1    | 2    | 3    | 4', 'Times 2 | 2    | 4    | 6    | 8'], 99),
        lines('Now do the second step. Add 1 to each middle number.', ['Input   | 1    | 2    | 3    | 4', 'Times 2 | 2    | 4    | 6    | 8', 'Add 1   | 3    | 5    | 7    | 9'], 2),
        x('The outputs are 3, 5, 7, 9. Each output goes up by 2 because we multiplied by 2.', '3, 5, 7, 9 ', ['+2', 'jump']),
        x('Now find the output for input 10. Do 10 × 2 = 20 first.', '10 × 2 = ', ['20', 'step one']),
        x('Then add 1. 20 + 1 = 21. The output for input 10 is 21.', '20 + 1 = ', ['21', 'output'])
      ] },

    { title: '12. Pattern stories',
      explain: [
        'Patterns show up in real life. Saving money each week is an increasing pattern. Reading a book a little each day makes the pages left a decreasing pattern.',
        'Find the starting amount and the change each time. Then decide if the story goes up or down.',
        'Use a table for the first few steps. Then use the rule to jump ahead.'
      ],
      rule: 'Start amount, then add or subtract the same change each time. Use the number of steps.',
      mistake: 'Do not forget the starting amount. After 8 weeks of saving you have the start plus 8 jumps.',
      steps: [
        x('Rinka has $20 saved. She adds $5 every week. How much does she have after 8 weeks?', ['$20', 'start'], ' + $5 each week'),
        lines('Make a table for the first weeks.', tbl('Week', [0, 1, 2, 3], 'Saved', ['$20', '$25', '$30', '$35']), 99),
        x('Each week adds $5. After 8 weeks she added 8 × $5 = $40.', '8 × $5 = ', ['$40', 'added']),
        x('Add the starting amount. $20 + $40 = $60.', '$20 + $40 = ', ['$60', 'after 8 weeks']),
        x('Now a decreasing story. A book has 100 pages. Mia reads 8 pages each day. How many pages are left after 9 days?', ['100', 'start'], ' − 8 each day'),
        x('She read 9 × 8 = 72 pages.', '9 × 8 = ', ['72', 'read']),
        x('Take it from the start. 100 − 72 = 28 pages are left.', '100 − 72 = ', ['28', 'pages left'])
      ] }
  ];

  /* ---------- Skills ---------- */
  B.register(12, [
    { id: 'next', level: 1, name: 'Next term, increasing', make: function () {
      var d = R.pick([2, 3, 4, 5, 6, 10]), a = R.int(1, 30), t = seq(a, d, 4), ans = a + 4 * d;
      var shown = J(t) + ', ?';
      var prompt = R.pick([
        'Here is a pattern: ' + shown + '. What number comes next?',
        'Find the next term in this pattern: ' + shown + '.',
        'Rinka counts up in a pattern: ' + shown + '. What does she say next?',
        'Look at the pattern ' + shown + '. It is an increasing pattern. What is the next term?'
      ]);
      return N({
        skill: 'Next term in an increasing pattern', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(t[3]), 'That is the last number already shown. Add the jump of ' + d + ' to it to get the next term.'),
                T(String(t[3] + d + 1), 'The jump is ' + d + ', not ' + (d + 1) + '. Check the gaps between the numbers.'),
                T(String(t[3] + 2 * d), 'That skips a term. The next term is only one jump after ' + t[3] + '.')],
        work: t[1] + ' − ' + t[0] + ' = ' + d + ', so the rule is add ' + d + '. ' + t[3] + ' + ' + d + ' = ' + ans + '.',
        plain: 'Find the gap between the numbers. Add that gap to the last number.',
        teach: [
          x('Look at the pattern. We want the next term.', J(t) + ', ', ['?', 'next term']),
          lines('Find the jump between each pair of numbers. Each jump is +' + d + '.', jumpLines(t.concat(['?']), '+', d), 0),
          x('The pattern goes up, so we add ' + d + '. Start at ' + a + ' and add ' + d + ' each time.', ['Start at ' + a, 'start'], ', ', ['add ' + d, 'jump']),
          x('Add ' + d + ' to the last term. ' + t[3] + ' + ' + d + ' = ' + ans + '.', t[3] + ' + ' + d + ' = ', [String(ans), 'next term'])
        ]
      });
    } },

    { id: 'nextdown', level: 1, name: 'Next term, decreasing', make: function () {
      var d = R.pick([2, 3, 4, 5, 6, 10]), a = R.int(5 * d + 4, 120), t = seq(a, -d, 4), ans = a - 4 * d;
      var shown = J(t) + ', ?';
      var prompt = R.pick([
        'Here is a decreasing pattern: ' + shown + '. What number comes next?',
        'A jar has ' + a + ' stickers. Each day some are given away and the amounts left are ' + shown + '. How many are left the next day?',
        'Find the next term in this pattern: ' + shown + '.',
        'Rinka counts down in a pattern: ' + shown + '. What does she say next?'
      ]);
      return N({
        skill: 'Next term in a decreasing pattern', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(t[3] + d), 'You added ' + d + '. This pattern goes down, so subtract ' + d + '.'),
                T(String(t[3] - d - 1), 'The jump is ' + d + ', not ' + (d + 1) + '. Check the gaps between the numbers.'),
                T(String(t[3]), 'That is the last number already shown. Take away ' + d + ' from it.')],
        work: t[0] + ' − ' + t[1] + ' = ' + d + ', so the rule is subtract ' + d + '. ' + t[3] + ' − ' + d + ' = ' + ans + '.',
        plain: 'The numbers go down by the same amount each time. Take that amount away from the last number.',
        teach: [
          x('The numbers get smaller, so this is a decreasing pattern.', J(t) + ', ', ['?', 'next term']),
          lines('Find the jump. Each jump is −' + d + '.', jumpLines(t.concat(['?']), '−', d), 0),
          x('The rule is start at ' + a + ' and subtract ' + d + ' each time.', ['Start at ' + a, 'start'], ', ', ['subtract ' + d, 'jump']),
          x('Subtract ' + d + ' from the last term. ' + t[3] + ' − ' + d + ' = ' + ans + '.', t[3] + ' − ' + d + ' = ', [String(ans), 'next term'])
        ]
      });
    } },

    { id: 'rulepick', level: 2, name: 'Choose the rule in words', make: function () {
      var down = R.int(0, 1) === 1, d = R.pick([2, 3, 4, 5, 6, 7, 8, 9]);
      var a = down ? R.int(6 * d, 90) : R.int(1, 30), t = seq(a, down ? -d : d, 5);
      var verb = down ? 'subtract' : 'add', other = down ? 'add' : 'subtract';
      var right = 'Start at ' + a + ' and ' + verb + ' ' + d + ' each time.';
      var d2 = d + R.pick([1, 2]);
      var opts = [
        { text: right, ok: true },
        { text: 'Start at ' + a + ' and ' + other + ' ' + d + ' each time.', ok: false, trap: 'Look at the direction. The numbers go ' + (down ? 'down' : 'up') + ', so the rule must ' + verb + '.' },
        { text: 'Start at ' + a + ' and ' + verb + ' ' + d2 + ' each time.', ok: false, trap: 'Check a gap. ' + (down ? t[0] + ' − ' + t[1] : t[1] + ' − ' + t[0]) + ' = ' + d + ', not ' + d2 + '.' },
        { text: 'Start at ' + t[1] + ' and ' + verb + ' ' + d + ' each time.', ok: false, trap: 'The pattern starts at ' + a + ', not at ' + t[1] + '. Say where it really starts.' }
      ];
      return Q.choice({
        skill: 'Choose the rule in words', prompt: R.pick(['Which rule matches this pattern? ' + J(t) + '.', 'Here is a pattern: ' + J(t) + '. Which sentence gives the rule?']),
        options: opts,
        work: 'The first term is ' + a + '. Each gap is ' + d + ' and the numbers go ' + (down ? 'down' : 'up') + '. So ' + right,
        plain: 'A rule needs the starting number and what changes each time.',
        teach: [
          x('Look at the pattern and find where it starts.', J(t)),
          x('The first term is ' + a + '. So the rule must start at ' + a + '.', ['Start at ' + a, 'start']),
          x('Find a gap. ' + (down ? t[0] + ' − ' + t[1] : t[1] + ' − ' + t[0]) + ' = ' + d + '.', (down ? t[0] + ' − ' + t[1] : t[1] + ' − ' + t[0]) + ' = ', [String(d), 'jump']),
          x('The numbers go ' + (down ? 'down' : 'up') + ', so we ' + verb + '.', [verb + ' ' + d, 'each time']),
          note('Put it together.', 'The rule', [right])
        ]
      });
    } },

    { id: 'missing', level: 2, name: 'Find the missing term', make: function () {
      var down = R.int(0, 1) === 1, d = R.pick([3, 4, 5, 6, 7, 8, 9]);
      var a = down ? R.int(7 * d, 90) : R.int(1, 25), full = seq(a, down ? -d : d, 6);
      var k = R.int(1, 4), ans = full[k];
      var shown = full.map(function (v, i) { return i === k ? '?' : String(v); });
      var prompt = R.pick(['Find the missing number in the pattern: ' + J(shown) + '.', 'What number belongs where the question mark is? ' + J(shown) + '.', 'One number is hidden in this pattern: ' + J(shown) + '. What is it?']);
      return N({
        skill: 'Find a missing term', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(full[k - 1]), 'That is the number before the gap. The missing term is one jump ' + (down ? 'lower' : 'higher') + '.'),
                T(String(full[k + 1]), 'That is the number after the gap. The missing term is one jump ' + (down ? 'higher' : 'lower') + ' than it.')],
        work: 'The jump is ' + d + '. ' + full[k - 1] + (down ? ' − ' : ' + ') + d + ' = ' + ans + '.',
        plain: 'Find the jump from the numbers you can see. Use it on the term just before the gap.',
        teach: [
          x('One term is missing. Look at the numbers around it.', J(shown)),
          x('Find the jump using two neighbors that you can see. The jump is ' + d + '.', ['Jump: ' + d, 'each time']),
          x('The pattern goes ' + (down ? 'down' : 'up') + ', so we ' + (down ? 'subtract' : 'add') + '.', full[k - 1] + (down ? ' − ' : ' + ') + d + ' = ', [String(ans), 'missing term']),
          x('Check with the next term. ' + ans + (down ? ' − ' : ' + ') + d + ' = ' + full[k + 1] + '. It matches.', ans + (down ? ' − ' : ' + ') + d + ' = ', [String(full[k + 1]), 'matches'])
        ]
      });
    } },

    { id: 'tablefill', level: 3, name: 'Input output table', make: function () {
      var kind = R.pick(['add', 'subtract', 'times']), k, inp, ans, name;
      if (kind === 'add') { k = R.int(3, 19); inp = R.int(10, 60); ans = inp + k; name = 'Add ' + k; }
      else if (kind === 'subtract') { k = R.int(3, 19); inp = R.int(k + 5, 70); ans = inp - k; name = 'Subtract ' + k; }
      else { k = R.int(2, 9); inp = R.int(3, 12); ans = inp * k; name = 'Multiply by ' + k; }
      var sub = R.int(0, 1);
      var ins = [1, 2, 3].map(function (i) { return kind === 'subtract' ? k + i : i; });
      var outs = ins.map(function (v) { return kind === 'add' ? v + k : kind === 'subtract' ? v - k : v * k; });
      var prompt;
      if (sub === 0) prompt = 'A number machine has the rule "' + name + '". What is the output when the input is ' + inp + '?';
      else prompt = 'A machine changes each input into an output the same way. Input: ' + J(ins) + '. Output: ' + J(outs) + '. What output does the machine give for the input ' + inp + '?';
      var wrong = kind === 'times' ? inp + k : kind === 'add' ? inp * k : inp + k;
      var op = kind === 'add' ? ' + ' : kind === 'subtract' ? ' − ' : ' × ';
      var teach = [];
      if (sub === 1) {
        teach.push(lines('First find the rule. Compare each input with its output.', tbl('Input', ins, 'Output', outs), 99));
        teach.push(x(kind === 'times' ? 'Each output is ' + k + ' times its input. ' + ins[0] + ' × ' + k + ' = ' + outs[0] + '.' : kind === 'add' ? 'Each output is ' + k + ' more than its input. ' + ins[0] + ' + ' + k + ' = ' + outs[0] + '.' : 'Each output is ' + k + ' less than its input. ' + ins[0] + ' − ' + k + ' = ' + outs[0] + '.', ['Rule: ' + name, 'found']));
      } else {
        teach.push(note('The rule is given. Use it on the input.', 'The machine', ['Rule: ' + name, 'Input: ' + inp]));
        teach.push(x('Write the input and the rule as a number sentence.', ['Input ' + inp, 'goes in'], op + k));
      }
      teach.push(x('Put ' + inp + ' into the machine. ' + name + '.', inp + op + k + ' = ', [String(ans), 'output']));
      teach.push(x('The output is ' + ans + '.', ['Input ' + inp, 'in'], ' → ', ['Output ' + ans, 'out']));
      return N({
        skill: 'Use an input output table', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(wrong), 'You used the wrong operation. The rule is "' + name + '". Use exactly that operation.'),
                T(String(inp), 'That is the input. The machine changes the input, so apply the rule to it.')],
        work: inp + op + k + ' = ' + ans + '.',
        plain: 'Use the rule on the input number. The result is the output.',
        teach: teach
      });
    } },

    { id: 'tablerule', level: 3, name: 'Find the rule of a table', make: function () {
      var kind = R.pick(['times', 'add', 'subtract']), k, ins = R.pick([[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6], [5, 6, 7, 8]]), outs, name, unit;
      if (kind === 'times') { k = R.int(2, 9); outs = ins.map(function (v) { return v * k; }); name = 'Multiply the input by ' + k; unit = k; }
      else if (kind === 'add') { k = R.int(3, 15); outs = ins.map(function (v) { return v + k; }); name = 'Add ' + k + ' to the input'; unit = k; }
      else { k = R.int(2, 9); ins = ins.map(function (v) { return v + 10; }); outs = ins.map(function (v) { return v - k; }); name = 'Subtract ' + k + ' from the input'; unit = k; }
      var table = 'Input: ' + J(ins) + '. Output: ' + J(outs) + '.';
      var asChoice = R.int(0, 1) === 1;
      var teach = [
        lines('Here is the table. Compare each input with its output.', tbl('Input', ins, 'Output', outs), 99),
        x(kind === 'times' ? 'The outputs jump by ' + k + ' while the inputs jump by 1. That points to a times rule. ' + outs[0] + ' ÷ ' + ins[0] + ' = ' + k + '.' : kind === 'add' ? 'Look at the first row. ' + ins[0] + ' to ' + outs[0] + ' is ' + k + ' more. Check the next row. ' + ins[1] + ' to ' + outs[1] + ' is ' + k + ' more.' : 'Look at the first row. ' + ins[0] + ' to ' + outs[0] + ' is ' + k + ' less. Check the next row. ' + ins[1] + ' to ' + outs[1] + ' is ' + k + ' less.', ['Try: ' + name, 'idea']),
        x('Test the rule on the last row. ' + ins[3] + (kind === 'times' ? ' × ' : kind === 'add' ? ' + ' : ' − ') + k + ' = ' + outs[3] + '. It works.', ins[3] + (kind === 'times' ? ' × ' : kind === 'add' ? ' + ' : ' − ') + k + ' = ', [String(outs[3]), 'matches']),
        note('The rule is found.', 'The rule', [name])
      ];
      if (asChoice) {
        var names = ['Multiply the input by ' + k, 'Add ' + k + ' to the input', 'Subtract ' + k + ' from the input'];
        var opts = names.map(function (nm) { return { text: nm, ok: nm === name, trap: 'Test that rule on a row. It does not give the outputs in the table.' }; });
        opts.push({ text: 'Add ' + (k + 1) + ' to the input', ok: false, trap: 'Test it. ' + ins[0] + ' + ' + (k + 1) + ' = ' + (ins[0] + k + 1) + ', not ' + outs[0] + '.' });
        return Q.choice({
          skill: 'Find the rule of a table', prompt: 'Which rule turns each input into its output? ' + table, options: opts,
          work: name + '. For example, ' + ins[0] + (kind === 'times' ? ' × ' : kind === 'add' ? ' + ' : ' − ') + k + ' = ' + outs[0] + '.',
          plain: 'Try add, subtract and multiply on the first row, then test the rule on the other rows.',
          teach: teach
        });
      }
      var wrong = kind === 'times' ? outs[0] - ins[0] : outs[0] + ins[0];
      return N({
        skill: 'Find the rule of a table', prompt: 'A number machine changes inputs into outputs. ' + table + ' The rule is ' + (kind === 'times' ? 'multiply the input by what number?' : kind === 'add' ? 'add what number to the input?' : 'subtract what number from the input?'),
        answer: unit, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(wrong), 'Check that number on every row. ' + (kind === 'times' ? 'It works for the first row only. Test the second row too.' : 'That mixes up the input and the output.')),
                T(String(outs[3]), 'That is the last output. The rule number is what the machine uses on every input.')],
        work: name + '. Check: ' + ins[0] + (kind === 'times' ? ' × ' : kind === 'add' ? ' + ' : ' − ') + unit + ' = ' + outs[0] + '.',
        plain: 'Find what happens to the input to make the output. Then test it on every row.',
        teach: teach
      });
    } },

    { id: 'nth', level: 3, name: 'Later term of a pattern', make: function () {
      var down = R.int(0, 2) === 0, d = R.pick([2, 3, 4, 5, 6, 7]), n = R.int(6, 9);
      var a = down ? R.int((n - 1) * d + 2, 90) : R.int(1, 30);
      var first = seq(a, down ? -d : d, 3), ans = down ? a - (n - 1) * d : a + (n - 1) * d;
      var prompt = down
        ? 'A pattern starts at ' + a + '. Each term is ' + d + ' less than the one before. What is the ' + ord(n) + ' term?'
        : R.pick([
          'A pattern starts at ' + a + '. Each term is ' + d + ' more than the one before. What is the ' + ord(n) + ' term?',
          'The pattern ' + J(first) + ', and so on, keeps going. What is the ' + ord(n) + ' term?'
        ]);
      var full = seq(a, down ? -d : d, n);
      return N({
        skill: 'Find a later term', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(down ? a - n * d : a + n * d), 'You made ' + n + ' jumps. The ' + ord(n) + ' term needs only ' + (n - 1) + ' jumps because the first term has no jump.'),
                T(String(n * d), 'That leaves out the starting number ' + a + '. Start there and then make the jumps.')],
        work: 'The ' + ord(n) + ' term is ' + a + (down ? ' − ' : ' + ') + (n - 1) + ' × ' + d + ' = ' + ans + '.',
        plain: 'The 1st term is ' + a + '. Each new term makes one more jump of ' + d + '. The ' + ord(n) + ' term has ' + (n - 1) + ' jumps.',
        teach: [
          x('Start with the 1st term and the jump.', ['1st term: ' + a, 'start'], ', ', [(down ? 'subtract ' : 'add ') + d, 'jump']),
          lines('Write the terms one at a time.', tbl('Term', full.map(function (v, i) { return i + 1; }), 'Value', full, 4), 99),
          x('The ' + ord(n) + ' term needs ' + (n - 1) + ' jumps, one fewer than its position.', [String(n - 1), 'jumps'], ' × ' + d + ' = ' + ((n - 1) * d)),
          x((down ? 'Subtract from ' : 'Add to ') + a + '. ' + a + (down ? ' − ' : ' + ') + ((n - 1) * d) + ' = ' + ans + '.', a + (down ? ' − ' : ' + ') + ((n - 1) * d) + ' = ', [String(ans), ord(n) + ' term'])
        ]
      });
    } },

    { id: 'shape', level: 4, name: 'Growing shape pattern', make: function () {
      var a = R.int(3, 6), d = R.int(2, 3), n = R.int(7, 12), ans = a + (n - 1) * d;
      var thing = R.pick([['tiles', 'Figure'], ['blocks', 'Tower'], ['dots', 'Picture'], ['bricks', 'Wall'], ['stickers', 'Card']]);
      var c = R.pick(['Figure 1 uses', 'The first one uses']);
      var w = thing[1];
      var prompt = w + ' 1 uses ' + a + ' ' + thing[0] + '. Each new ' + w.toLowerCase() + ' uses ' + d + ' more ' + thing[0] + ' than the one before. How many ' + thing[0] + ' does ' + w + ' ' + n + ' use?';
      var cnt = [a, a + d, a + 2 * d];
      return N({
        skill: 'Growing shape pattern', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(a + n * d), 'That is one jump too many. ' + w + ' ' + n + ' has ' + (n - 1) + ' jumps after ' + w + ' 1.'),
                T(String((n - 1) * d), 'That only counts the ' + thing[0] + ' that were added. ' + w + ' 1 had ' + a + ' to begin with.')],
        work: a + ' + ' + (n - 1) + ' × ' + d + ' = ' + a + ' + ' + ((n - 1) * d) + ' = ' + ans + '.',
        plain: 'Start with ' + a + '. Add ' + d + ' for every figure after the first. That is ' + (n - 1) + ' times.',
        teach: [
          bars('Here are the first three. ' + w + ' 1 has ' + cnt[0] + ', ' + w + ' 2 has ' + cnt[1] + ' and ' + w + ' 3 has ' + cnt[2] + '.', [row(w + ' 1', cnt[0], 'bg-indigo-400'), row(w + ' 2', cnt[1], 'bg-indigo-400'), row(w + ' 3', cnt[2], 'bg-indigo-400')]),
          lines('Write the counts in a table. The jump is ' + d + '.', tbl(w, [1, 2, 3, 4], thing[0], seq(a, d, 4), 6), 99),
          x('To reach ' + w + ' ' + n + ', we make ' + (n - 1) + ' jumps of ' + d + '. ' + (n - 1) + ' × ' + d + ' = ' + ((n - 1) * d) + '.', (n - 1) + ' × ' + d + ' = ', [String((n - 1) * d), 'added']),
          x('Add that to the first figure. ' + a + ' + ' + ((n - 1) * d) + ' = ' + ans + '.', a + ' + ' + ((n - 1) * d) + ' = ', [String(ans), w + ' ' + n])
        ]
      });
    } },

    { id: 'multtable', level: 4, name: 'Patterns in times tables', make: function () {
      var sub = R.int(0, 2);
      if (sub === 0) {
        var k = R.int(2, 9), tens = k - 1, ones = 10 - k, tot = 9 * k;
        return N({
          skill: 'Patterns in the 9 times table', prompt: 'In the 9 times table, the two digits of every answer add up to 9. The answer to 9 × ' + k + ' has ' + tens + ' in the tens place. What is the digit in the ones place?',
          answer: ones, keyboard: 'numeric', placeholder: 'Type a digit',
          traps: [T(String(tens), 'That is the tens digit. The two digits add to 9, so the ones digit is 9 − ' + tens + '.'),
                  T(String(9 - ones), 'Check that the two digits add to 9. ' + tens + ' + ' + (9 - ones) + ' is not 9.')],
          work: '9 − ' + tens + ' = ' + ones + '. So 9 × ' + k + ' = ' + tot + '.',
          plain: 'The digits must add to 9. Take the tens digit away from 9.',
          teach: [
            lines('Look at the 9 times table.', ['9 × 1 =  9', '9 × 2 = 18', '9 × 3 = 27', '9 × 4 = 36'], 99),
            x('The digits in every answer add up to 9. For example 1 + 8 = 9 and 2 + 7 = 9.', ['1 + 8 = 9', 'digits'], ',  ', ['2 + 7 = 9', 'digits']),
            x('The tens digit is ' + tens + '. So the ones digit is 9 − ' + tens + ' = ' + ones + '.', '9 − ' + tens + ' = ', [String(ones), 'ones digit']),
            x('So 9 × ' + k + ' = ' + tot + '. Check: ' + tens + ' + ' + ones + ' = 9.', '9 × ' + k + ' = ', [String(tot), 'answer'])
          ]
        });
      }
      if (sub === 1) {
        var pr = R.pick([[2, 4], [3, 6], [4, 8], [5, 10]]), m = R.int(3, 9), known = pr[0] * m, ans = pr[1] * m;
        return N({
          skill: 'Doubling a times table', prompt: 'Sam knows that ' + pr[0] + ' × ' + m + ' = ' + known + '. The ' + pr[1] + ' times table is double the ' + pr[0] + ' times table. What is ' + pr[1] + ' × ' + m + '?',
          answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
          traps: [T(String(known + pr[0]), 'You added. Doubling means multiply by 2, so it is ' + known + ' × 2.'),
                  T(String(known + 2), 'Doubling does not mean add 2. Double ' + known + ' by adding ' + known + ' to itself.')],
          work: known + ' × 2 = ' + ans + '. So ' + pr[1] + ' × ' + m + ' = ' + ans + '.',
          plain: 'The ' + pr[1] + ' times table is twice as big as the ' + pr[0] + ' times table. Double the answer you know.',
          teach: [
            x('We know ' + pr[0] + ' × ' + m + ' = ' + known + '.', pr[0] + ' × ' + m + ' = ', [String(known), 'known fact']),
            x(pr[1] + ' is double ' + pr[0] + '. So the answer will be double too.', [pr[1], 'double of ' + pr[0]]),
            x('Double ' + known + '. ' + known + ' + ' + known + ' = ' + ans + '.', known + ' × 2 = ', [String(ans), 'doubled']),
            x('So ' + pr[1] + ' × ' + m + ' = ' + ans + '.', pr[1] + ' × ' + m + ' = ', [String(ans), 'answer'])
          ]
        });
      }
      var f = R.int(3, 9), g = R.int(4, 9), base = f * g, nxt = base + f;
      return N({
        skill: 'One more group in a times table', prompt: 'Rinka knows that ' + f + ' × ' + g + ' = ' + base + '. Use the pattern in the ' + f + ' times table to find ' + f + ' × ' + (g + 1) + '.',
        answer: nxt, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(base + g), 'You added ' + g + '. The next answer in the ' + f + ' times table is ' + f + ' more than ' + base + '.'),
                T(String(base + 1), 'You only added 1. Each step in the ' + f + ' times table adds ' + f + '.')],
        work: base + ' + ' + f + ' = ' + nxt + '.',
        plain: 'Going from ' + g + ' groups to ' + (g + 1) + ' groups adds one more group of ' + f + '.',
        teach: [
          x('We know ' + f + ' × ' + g + ' = ' + base + '.', f + ' × ' + g + ' = ', [String(base), 'known']),
          lines('Look at the ' + f + ' times table. Each answer is ' + f + ' more than the one before.', [f + ' × ' + (g - 1) + ' = ' + (base - f), f + ' × ' + g + ' = ' + base, f + ' × ' + (g + 1) + ' = ?'], 2),
          x('We want ' + f + ' × ' + (g + 1) + '. That is one more group of ' + f + '.', f + ' × ' + (g + 1), ' = ', [f + ' × ' + g + ' + ' + f, 'one more group']),
          x('Add ' + f + ' to ' + base + '. ' + base + ' + ' + f + ' = ' + nxt + '.', base + ' + ' + f + ' = ', [String(nxt), 'answer'])
        ]
      });
    } },

    { id: 'nthrule', level: 4, name: 'Use a times rule for a far term', make: function () {
      var k = R.int(2, 9), n = R.pick([10, 12, 15, 20]), ans = k * n;
      var showRule = R.int(0, 1) === 0;
      var prompt = showRule
        ? 'The rule for a pattern is: term = ' + k + ' × position. What is the ' + ord(n) + ' term?'
        : 'Here are the first terms of a pattern: ' + J(seq(k, k, 4)) + '. Each term is a times table answer. What is the ' + ord(n) + ' term?';
      var teach = [];
      if (showRule) {
        teach.push(note('The position is the place of the term in the list. The term is the number at that place.', 'Reading the rule', ['Position 1 is the 1st term', 'Position 2 is the 2nd term']));
        teach.push(x('The rule tells us to multiply the position by ' + k + '.', 'term = ', [String(k), 'jump'], ' × position'));
      }
      else {
        teach.push(lines('Write the terms with their positions.', tbl('Position', [1, 2, 3, 4], 'Term', seq(k, k, 4), 6), 99));
        teach.push(x('Each term is ' + k + ' times its position. ' + k + ' × 1 = ' + k + ', ' + k + ' × 2 = ' + (2 * k) + '.', 'term = ', [String(k), 'jump'], ' × position'));
      }
      teach.push(x('The position we want is ' + n + '.', 'position = ', [String(n), 'position']));
      teach.push(x('Multiply. ' + k + ' × ' + n + ' = ' + ans + '.', k + ' × ' + n + ' = ', [String(ans), ord(n) + ' term']));
      return N({
        skill: 'Use a times rule for a far term', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(k + n), 'You added the two numbers. The rule says to multiply the position by ' + k + '.'),
                T(String(k * (n - 1)), 'That is the ' + ord(n - 1) + ' term. Use the position ' + n + ' itself.')],
        work: k + ' × ' + n + ' = ' + ans + '.',
        plain: 'Each term is ' + k + ' times its position number. Multiply ' + k + ' by ' + n + '.',
        teach: teach
      });
    } },

    { id: 'tworule', level: 5, name: 'Two operation rule', make: function () {
      var m = R.int(2, 6), c = R.int(1, 9), inp = R.int(3, 12), sub = R.int(0, 1) === 1;
      if (sub && m * inp <= c) sub = false;
      var mid = m * inp, ans = sub ? mid - c : mid + c;
      var rule = 'multiply by ' + m + ', then ' + (sub ? 'subtract ' : 'add ') + c;
      var wrong = sub ? (inp - c) * m : (inp + c) * m;
      return N({
        skill: 'Two operation rule', prompt: R.pick(['A machine follows this rule: ' + rule + '. What is the output when the input is ' + inp + '?', 'A number machine does two steps. It will ' + rule + '. Find the output for the input ' + inp + '.']),
        answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(mid), 'That is only the first step. The rule has a second step: ' + (sub ? 'subtract ' : 'add ') + c + '.'),
                T(String(wrong), 'You did the steps in the wrong order. Multiply first, then ' + (sub ? 'subtract.' : 'add.'))],
        work: inp + ' × ' + m + ' = ' + mid + ', then ' + mid + (sub ? ' − ' : ' + ') + c + ' = ' + ans + '.',
        plain: 'Do the multiplying first. Then use the second step on that answer.',
        teach: [
          note('The machine has two steps.', 'The rule', ['Step one: × ' + m, 'Step two: ' + (sub ? '− ' : '+ ') + c]),
          x('Step one. Multiply the input ' + inp + ' by ' + m + '.', inp + ' × ' + m + ' = ', [String(mid), 'step one']),
          x('Step two. ' + (sub ? 'Subtract ' : 'Add ') + c + ' to that answer.', mid + (sub ? ' − ' : ' + ') + c + ' = ', [String(ans), 'output']),
          lines('The output for input ' + inp + ' is ' + ans + '.', ['Input   | ' + inp, 'Times ' + m + ' | ' + mid, (sub ? 'Take ' + c + ' ' : 'Add ' + c + '  ') + '| ' + ans], 2)
        ]
      });
    } },

    { id: 'saving', level: 5, name: 'Pattern story, start and change', make: function () {
      var down = R.int(0, 2) === 0;
      if (down) {
        var d = R.pick([5, 6, 8, 10, 12]), n = R.int(4, 9), s = R.int(n * d + 10, 200);
        var ans = s - n * d;
        var ctx = R.pick([
          { p: 'A water tank at a cabin holds ' + s + ' liters. The family uses ' + d + ' liters each day. How many liters are left after ' + n + ' days?', u: 'liters' },
          { p: 'A book has ' + s + ' pages. Mia reads ' + d + ' pages every day. How many pages are left after ' + n + ' days?', u: 'pages' },
          { p: 'A pack has ' + s + ' hockey cards. Sam gives away ' + d + ' cards each week. How many cards are left after ' + n + ' weeks?', u: 'cards' }
        ]);
        return N({
          skill: 'Decreasing pattern story', prompt: ctx.p, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
          traps: [T(String(s + n * d), 'You added. The amount goes down, so take it away from ' + s + '.'),
                  T(String(n * d), 'That is how much was used. The question asks how much is left. Take it away from ' + s + '.')],
          work: n + ' × ' + d + ' = ' + (n * d) + '. ' + s + ' − ' + (n * d) + ' = ' + ans + ' ' + ctx.u + '.',
          plain: 'Find how much is used in total. Then take it from the starting amount.',
          teach: [
            x('We start with ' + s + ' and take away ' + d + ' each time.', ['Start ' + s, 'start'], ', ', ['− ' + d, 'each time']),
            lines('The first few steps.', tbl('Time', [0, 1, 2, 3], 'Left', seq(s, -d, 4), 6), 99),
            x('After ' + n + ' times, the total taken away is ' + n + ' × ' + d + ' = ' + (n * d) + '.', n + ' × ' + d + ' = ', [String(n * d), 'used']),
            x('Take that from the start. ' + s + ' − ' + (n * d) + ' = ' + ans + '.', s + ' − ' + (n * d) + ' = ', [String(ans), ctx.u + ' left'])
          ]
        });
      }
      var d2 = R.pick([3, 4, 5, 6, 8, 10]), n2 = R.int(4, 12), s2 = R.int(5, 40), ans2 = s2 + n2 * d2;
      var c2 = R.pick([
        { p: 'Rinka has $' + s2 + ' saved. She adds $' + d2 + ' every week. How many dollars does she have after ' + n2 + ' weeks?', u: 'dollars' },
        { p: 'A bean plant is ' + s2 + ' cm tall today. It grows ' + d2 + ' cm each week. How tall is it after ' + n2 + ' weeks?', u: 'cm' },
        { p: 'Sam has ' + s2 + ' hockey cards. He gets ' + d2 + ' new cards every month. How many cards does he have after ' + n2 + ' months?', u: 'cards' },
        { p: 'A library has ' + s2 + ' new books on a shelf. ' + d2 + ' more books are put on the shelf each day. How many books are there after ' + n2 + ' days?', u: 'books' }
      ]);
      return N({
        skill: 'Increasing pattern story', prompt: c2.p, answer: ans2, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(n2 * d2), 'That only counts what was added. You must also count the ' + s2 + ' at the start.'),
                T(String(s2 + d2), 'That is only one jump. There are ' + n2 + ' jumps of ' + d2 + '.')],
        work: n2 + ' × ' + d2 + ' = ' + (n2 * d2) + '. ' + s2 + ' + ' + (n2 * d2) + ' = ' + ans2 + ' ' + c2.u + '.',
        plain: 'Find the total that was added. Then add it to the starting amount.',
        teach: [
          x('We start with ' + s2 + ' and add ' + d2 + ' each time.', ['Start ' + s2, 'start'], ', ', ['+ ' + d2, 'each time']),
          lines('The first few steps.', tbl('Time', [0, 1, 2, 3], 'Total', seq(s2, d2, 4), 6), 99),
          x('After ' + n2 + ' times, the total added is ' + n2 + ' × ' + d2 + ' = ' + (n2 * d2) + '.', n2 + ' × ' + d2 + ' = ', [String(n2 * d2), 'added']),
          x('Add it to the start. ' + s2 + ' + ' + (n2 * d2) + ' = ' + ans2 + '.', s2 + ' + ' + (n2 * d2) + ' = ', [String(ans2), c2.u])
        ]
      });
    } },

    { id: 'tworev', level: 6, name: 'Work backwards through two steps', make: function () {
      var m = R.int(2, 6), c = R.int(1, 9), inp = R.int(3, 15), sub = R.int(0, 1) === 1;
      var out = sub ? m * inp - c : m * inp + c;
      if (out <= 0) { sub = false; out = m * inp + c; }
      var rule = 'multiplies by ' + m + ' and then ' + (sub ? 'subtracts ' : 'adds ') + c;
      var mid = m * inp;
      return N({
        skill: 'Work backwards through two steps', prompt: R.pick(['A machine ' + rule + '. The output is ' + out + '. What was the input?', 'A number machine ' + rule + '. It gives the output ' + out + '. What number went in?']),
        answer: inp, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(sub ? out + c : out - c), 'That undoes only one step. You still need to undo the multiplying by dividing by ' + m + '.'),
                T(String(out / m), 'You must undo the ' + (sub ? 'subtract' : 'add') + ' first. Then divide by ' + m + '.')],
        work: 'Undo the ' + (sub ? 'subtract: ' + out + ' + ' + c : 'add: ' + out + ' − ' + c) + ' = ' + mid + '. Undo the multiply: ' + mid + ' ÷ ' + m + ' = ' + inp + '.',
        plain: 'Go backwards. Undo the last step first, then undo the first step.',
        teach: [
          note('The machine did two steps. To go backwards, undo them in the opposite order.', 'Undo', ['Last step was ' + (sub ? '− ' : '+ ') + c + ', so ' + (sub ? 'add ' : 'subtract ') + c, 'First step was × ' + m + ', so divide by ' + m]),
          x('Undo the last step first. ' + (sub ? 'Add ' : 'Subtract ') + c + ' from the output ' + out + '.', out + (sub ? ' + ' : ' − ') + c + ' = ', [String(mid), 'after undoing']),
          x('Now undo the multiplying. Divide by ' + m + '.', mid + ' ÷ ' + m + ' = ', [String(inp), 'input']),
          x('Check. ' + inp + ' × ' + m + ' = ' + mid + ', then ' + mid + (sub ? ' − ' : ' + ') + c + ' = ' + out + '. It matches.', inp + ' × ' + m + (sub ? ' − ' : ' + ') + c + ' = ', [String(out), 'matches'])
        ]
      });
    } },

    { id: 'whichterm', level: 6, name: 'Which term is this number', make: function () {
      var down = R.int(0, 1) === 1, d = R.pick([3, 4, 5, 6, 7, 8, 9]), n = R.int(8, 20);
      var a = down ? R.int((n - 1) * d + 5, 200) : R.int(2, 20);
      var v = down ? a - (n - 1) * d : a + (n - 1) * d;
      var jumps = n - 1, total = jumps * d;
      var prompt = down
        ? 'A pattern starts at ' + a + ' and subtracts ' + d + ' each time. Which term of the pattern is the number ' + v + '?'
        : 'A pattern starts at ' + a + ' and adds ' + d + ' each time. Which term of the pattern is the number ' + v + '?';
      return N({
        skill: 'Which term is this number', prompt: prompt, answer: n, keyboard: 'numeric', placeholder: 'Type the term number',
        traps: [T(String(n - 1), 'That is the number of jumps. The first term needs no jump, so the term number is one more than the jumps.'),
                T(String(n + 1), 'That is one too many. Count the jumps, then add 1 for the first term.')],
        work: (down ? a + ' − ' + v : v + ' − ' + a) + ' = ' + total + '. ' + total + ' ÷ ' + d + ' = ' + jumps + ' jumps. ' + jumps + ' + 1 = ' + n + '.',
        plain: 'Find how far the pattern has moved. Divide by the jump to count the jumps. The term number is one more.',
        teach: [
          x('The pattern starts at ' + a + '. We want to know where ' + v + ' fits.', ['Start ' + a, 'first term'], ', ', [(down ? 'subtract ' : 'add ') + d, 'jump'], ', target ', [String(v), 'target']),
          x('Find how far ' + v + ' is from the start. ' + (down ? a + ' − ' + v : v + ' − ' + a) + ' = ' + total + '.', (down ? a + ' − ' + v : v + ' − ' + a) + ' = ', [String(total), 'total change']),
          x('Divide by the jump to count the jumps. ' + total + ' ÷ ' + d + ' = ' + jumps + '.', total + ' ÷ ' + d + ' = ', [String(jumps), 'jumps']),
          x('The first term has no jump, so add 1. ' + jumps + ' + 1 = ' + n + '.', jumps + ' + 1 = ', [String(n), 'term number']),
          x('Check. ' + a + (down ? ' − ' : ' + ') + jumps + ' × ' + d + ' = ' + v + '. So ' + v + ' is the ' + ord(n) + ' term.', [String(v), ord(n) + ' term'])
        ]
      });
    } },

    { id: 'sticks', level: 6, name: 'Matchstick shape pattern', make: function () {
      var sh = R.pick([{ nm: 'triangles', one: 3, more: 2 }, { nm: 'squares', one: 4, more: 3 }, { nm: 'pentagons', one: 5, more: 4 }, { nm: 'hexagons', one: 6, more: 5 }]);
      var n = R.int(8, 20), ans = sh.one + (n - 1) * sh.more;
      var prompt = R.pick([
        'Matchsticks make a row of ' + sh.nm + ' joined together. One shape uses ' + sh.one + ' matchsticks. Every new shape shares a side with the last one, so it needs only ' + sh.more + ' more matchsticks. How many matchsticks make a row of ' + n + ' ' + sh.nm + '?',
        'A row of joined ' + sh.nm + ' is made from matchsticks. The first one needs ' + sh.one + ' matchsticks. Each ' + sh.nm.slice(0, -1) + ' added after that needs ' + sh.more + ' more. How many matchsticks are needed for ' + n + ' ' + sh.nm + '?'
      ]);
      var cnt = seq(sh.one, sh.more, 4);
      return N({
        skill: 'Matchstick shape pattern', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(sh.one * n), 'That is what you would need if the shapes did not share sides. Each new shape only needs ' + sh.more + ' more.'),
                T(String(sh.more * n), 'That leaves out one side. The first shape needs ' + sh.one + ' but every other shape needs ' + sh.more + ', so count ' + (n - 1) + ' extra shapes.')],
        work: sh.one + ' + ' + (n - 1) + ' × ' + sh.more + ' = ' + sh.one + ' + ' + ((n - 1) * sh.more) + ' = ' + ans + '.',
        plain: 'The first shape uses ' + sh.one + '. The other ' + (n - 1) + ' shapes use ' + sh.more + ' each. Add them up.',
        teach: [
          lines('Look at the first few rows. Each new shape adds ' + sh.more + ' matchsticks.', tbl('Shapes', [1, 2, 3, 4], 'Sticks', cnt, 6), 99),
          x('The rule is start with ' + sh.one + ' and add ' + sh.more + ' for every shape after the first.', ['Start ' + sh.one, 'first shape'], ', ', ['+ ' + sh.more, 'each new shape']),
          x('There are ' + (n - 1) + ' shapes after the first. ' + (n - 1) + ' × ' + sh.more + ' = ' + ((n - 1) * sh.more) + '.', (n - 1) + ' × ' + sh.more + ' = ', [String((n - 1) * sh.more), 'added']),
          x('Add the first shape. ' + sh.one + ' + ' + ((n - 1) * sh.more) + ' = ' + ans + '.', sh.one + ' + ' + ((n - 1) * sh.more) + ' = ', [String(ans), 'matchsticks'])
        ]
      });
    } }
  ]);
})();
