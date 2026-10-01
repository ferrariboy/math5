/* Module 3: Fractions Operations. Lessons, vocabulary and question skills. */
(function () {
  'use strict';
  var B = window.Bank, R = B.R, S = B.s, Q = B.q, T = Q.trap;
  var x = S.x, note = S.note, bars = S.bars, fb = S.fb, grid = S.grid, groups = S.groups;

  /* ---------- Vocabulary ---------- */
  window.MATH_VOCAB[3] = [
    { w: 'Fraction', m: 'A number that names part of a whole, like 3/4. It means 3 out of 4 equal parts.' },
    { w: 'Numerator', m: 'The top number. It counts how many parts you have.' },
    { w: 'Denominator', m: 'The bottom number. It tells how many equal parts the whole is cut into.' },
    { w: 'Equivalent fractions', m: 'Different fractions that name the same amount, like 1/2 and 2/4.' },
    { w: 'Simplest form', m: 'A fraction that cannot be made smaller. 2/4 is not simplest, but 1/2 is.' },
    { w: 'Common denominator', m: 'A bottom number that two fractions can both share. You need one to add or take away fractions.' }
  ];

  /* ---------- Shared teaching steps ---------- */
  function fracOfTeach(amt, n, d, per, unit) {
    var u = unit ? ' ' + unit : '';
    return [
      x('We want ' + n + '/' + d + ' of ' + amt + '. The bottom number says how many equal groups. The top number says how many groups to take.', [n + '/' + d, 'of'], ' × ' + amt),
      groups('Cut ' + amt + ' into ' + d + ' equal groups.', d, per, 0, per + ' in each group'),
      x('Share equally: ' + amt + ' ÷ ' + d + ' = ' + per + '. Each group holds ' + per + '.', amt + ' ÷ ' + d + ' = ', [String(per), 'one group']),
      groups('Now take ' + n + ' of the ' + d + ' groups. These are the ones we keep.', d, per, n, n + ' groups taken'),
      x('Count them: ' + n + ' groups of ' + per + ' is ' + n + ' × ' + per + ' = ' + (n * per) + '.', n + ' × ' + per + ' = ', [String(n * per) + u, 'answer']),
      note('Remember the recipe. Divide by the bottom, then multiply by the top.', 'The recipe', ['Divide by the bottom number', 'Multiply by the top number'])
    ];
  }

  /* ---------- Lessons ---------- */
  window.MATH_LESSONS[3] = [
    { title: '1. What is a fraction?',
      explain: [
        'A fraction is a way to write part of something. Think of a chocolate bar cut into equal squares. If you eat some squares, the fraction tells how much you ate.',
        'The bottom number tells how many equal parts the whole bar is cut into. The top number tells how many of those parts you are talking about.',
        'The parts must be equal. If one piece is bigger than the others, you cannot use a fraction to name it.'
      ],
      rule: 'Top number: parts you have. Bottom number: parts in the whole.',
      mistake: 'Do not count only the shaded parts and the empty parts separately. The bottom number counts ALL the parts.',
      steps: [
        bars('Here is one whole bar. Nothing is shaded yet.', [fb('One whole', 8, 0)]),
        bars('Cut it into 8 equal parts. The bottom number is 8.', [fb('8 equal parts', 8, 0, 'bg-indigo-400', '1/8')]),
        bars('Shade 3 of the parts. The top number is 3.', [fb('3 shaded', 8, 3, 'bg-indigo-400', '1/8')]),
        x('Three out of eight equal parts are shaded. We write 3 over 8.', ['3/8', 'shaded out of all']),
        note('Two names to know.', 'Numerator and denominator', ['Numerator is the top number. It counts.', 'Denominator is the bottom number. It names the size of each part.'])
      ] },

    { title: '2. Equivalent fractions',
      explain: [
        'Two fractions can look different and still be the same amount. Half a pizza is the same as 2 quarters of a pizza.',
        'To make an equivalent fraction, multiply the top and the bottom by the same number. You cut each part into smaller pieces, so you have more pieces, but the amount stays the same.',
        'Never add to the top and bottom. Always multiply, or divide.'
      ],
      rule: 'Multiply top and bottom by the SAME number.',
      mistake: 'If 1/2 becomes 2/4, you did times 2 on both. Adding 2 to both would give 3/4, which is a different amount.',
      steps: [
        bars('Look at one half of a bar.', [fb('1/2', 2, 1, 'bg-emerald-400', '1/2')]),
        bars('Cut every part in half. Now the bar has 4 parts and 2 are shaded. That is 2/4.', [fb('1/2', 2, 1, 'bg-emerald-400'), fb('2/4', 4, 2, 'bg-emerald-400')]),
        bars('Cut every part into 4. Now there are 8 parts and 4 are shaded. That is 4/8.', [fb('1/2', 2, 1, 'bg-emerald-400'), fb('2/4', 4, 2, 'bg-emerald-400'), fb('4/8', 8, 4, 'bg-emerald-400')]),
        x('The shaded amount never changed. These fractions are equal.', ['1/2', 'same'], ' = ', ['2/4', 'same'], ' = ', ['4/8', 'same']),
        x('Here is the rule. Multiply the top and the bottom by the same number.', ['1', '× 2'], ' / ', ['2', '× 2'], ' = 2/4'),
        x('Let us find a missing number. 2/3 = ?/12. The bottom went from 3 to 12.', '2/3 = ', ['?', 'missing'], '/12'),
        x('3 times 4 is 12. So we multiplied by 4. Do the same on top: 2 × 4 = 8.', '2/3 = ', ['8', '2 × 4'], '/12')
      ] },

    { title: '3. Simplest form',
      explain: [
        'Simplest form means the fraction has the smallest numbers possible. It is like tidying a fraction.',
        'To simplify, find a number that goes into both the top and the bottom. Divide both by it. Keep going until no number other than 1 divides both.',
        'The biggest number that goes into both makes it quick. For 12/18, the biggest is 6.'
      ],
      rule: 'Divide top and bottom by the SAME number until you cannot anymore.',
      mistake: 'Stopping too early. 6/9 is not simplest. Both numbers still divide by 3.',
      steps: [
        x('Simplify 12/18. We look for a number that goes into both 12 and 18.', ['12/18', 'simplify']),
        note('Try 2, 3 and 6. All of them go into 12 and 18. The biggest is 6.', 'Numbers that fit into both', ['2 fits', '3 fits', '6 fits, and it is the biggest']),
        x('Divide the top by 6. 12 ÷ 6 = 2.', '12 ÷ 6 = ', ['2', 'new top']),
        x('Divide the bottom by 6. 18 ÷ 6 = 3.', '18 ÷ 6 = ', ['3', 'new bottom']),
        x('Check. Nothing except 1 goes into both 2 and 3. So 2/3 is in simplest form.', '12/18 = ', ['2/3', 'simplest'])
      ] },

    { title: '4. Adding: same bottom number',
      explain: [
        'When the bottom numbers are the same, the pieces are the same size. So you can just count pieces. Add the top numbers and keep the bottom number.',
        'The bottom number stays the same because the size of the pieces does not change. You are only counting how many.',
        'After adding, check if the answer can be simplified.'
      ],
      rule: 'Add the tops. Keep the bottom.',
      mistake: 'Do not add the bottoms. 2/8 + 3/8 is not 5/16. The pieces are still eighths.',
      steps: [
        bars('Start with 2 eighths.', [fb('2/8', 8, 2, 'bg-indigo-400')]),
        bars('Add 3 more eighths.', [fb('2/8', 8, 2, 'bg-indigo-400'), fb('+ 3/8', 8, 3, 'bg-emerald-400')]),
        bars('Put them together. Now 5 eighths are shaded.', [fb('2/8 + 3/8', 8, 5, 'bg-teal-500', '', '5/8')]),
        x('The pieces were all eighths. So we only add the tops.', ['2', 'add'], '/8 + ', ['3', 'add'], '/8 = ', ['5/8', 'answer'])
      ] },

    { title: '5. Adding: different bottoms',
      explain: [
        'Halves and thirds are different sized pieces, so you cannot count them together yet.',
        'First change both fractions so they have the same bottom number. This is called a common denominator. A good choice is a number that both bottoms go into.',
        'Then add like before: add the tops, keep the bottom.'
      ],
      rule: 'Make the bottoms match first. Then add the tops.',
      mistake: '1/2 + 1/3 is not 2/5. Adding tops and bottoms is a very common mistake.',
      steps: [
        x('Add 1/2 and 1/3. The bottoms are different, so we cannot add yet.', '1/2 + 1/3'),
        note('Find a number that both 2 and 3 go into. Count by 2s: 2, 4, 6. Count by 3s: 3, 6. They meet at 6.', 'Common denominator', ['Multiples of 2: 2, 4, 6', 'Multiples of 3: 3, 6', 'Both meet at 6']),
        x('Change 1/2 into sixths. 2 × 3 = 6, so multiply the top by 3 too.', '1/2 = ', ['3/6', '× 3 on both']),
        x('Change 1/3 into sixths. 3 × 2 = 6, so multiply the top by 2 too.', '1/3 = ', ['2/6', '× 2 on both']),
        bars('Now both are sixths. We can put the pieces together.', [fb('3/6', 6, 3, 'bg-indigo-400'), fb('+ 2/6', 6, 2, 'bg-emerald-400'), fb('total', 6, 5, 'bg-teal-500', '', '5/6')]),
        x('Add the tops: 3 + 2 = 5. Keep the bottom 6.', '3/6 + 2/6 = ', ['5/6', 'answer'])
      ] },

    { title: '6. Taking away fractions',
      explain: [
        'Subtracting fractions works the same way as adding. Make the bottoms match first. Then take away the tops.',
        'Always take the smaller amount from the bigger amount.'
      ],
      rule: 'Make the bottoms match. Take away the tops. Keep the bottom.',
      mistake: 'Do not take away the bottoms. 3/4 − 1/6 is not 2 over 2.',
      steps: [
        x('Work out 3/4 − 1/6. The bottoms are different.', '3/4 − 1/6'),
        note('Find a number that both 4 and 6 go into.', 'Common denominator', ['Multiples of 4: 4, 8, 12', 'Multiples of 6: 6, 12', 'Both meet at 12']),
        x('3/4 becomes 9/12. We multiplied by 3 on the top and the bottom.', '3/4 = ', ['9/12', '× 3']),
        x('1/6 becomes 2/12. We multiplied by 2 on the top and the bottom.', '1/6 = ', ['2/12', '× 2']),
        x('Now take away the tops. 9 − 2 = 7. Keep the 12.', '9/12 − 2/12 = ', ['7/12', 'answer'])
      ] },

    { title: '7. A fraction of an amount',
      explain: [
        'To find a fraction of a number, think of sharing. The bottom number says how many equal groups. Work out how much is in each group.',
        'The top number says how many of those groups to take. Multiply the size of one group by the top number.',
        'So the steps are: divide by the bottom, then multiply by the top.'
      ],
      rule: 'Divide by the bottom. Multiply by the top.',
      mistake: 'If you only multiply by the top, you get a number bigger than you started with. A fraction of something must be smaller than the whole.',
      steps: fracOfTeach(24, 3, 4, 6) },

    { title: '8. Fraction times fraction',
      explain: [
        'A fraction times a fraction means a part of a part. Half of three quarters is smaller than three quarters.',
        'The rule is easy. Multiply the tops together. Multiply the bottoms together. Then simplify.'
      ],
      rule: 'Top times top. Bottom times bottom. Then simplify.',
      mistake: 'You do NOT need a common denominator for multiplying. That is only for adding and taking away.',
      steps: [
        grid('One whole. Cut it into 4 columns and 2 rows.', 4, 2, []),
        grid('Color 3 of the 4 columns. That is 3/4.', 4, 2, [{ c0: 0, c1: 3, r0: 0, r1: 2, cls: 'bg-indigo-400' }]),
        grid('Now take 1/2 of that. Half means the top row only.', 4, 2, [{ c0: 0, c1: 3, r0: 0, r1: 2, cls: 'bg-indigo-400' }, { c0: 0, c1: 3, r0: 0, r1: 1, cls: 'bg-emerald-500' }]),
        grid('Only the green boxes are half of three quarters. That is 3 boxes out of 8.', 4, 2, [{ c0: 0, c1: 3, r0: 0, r1: 1, cls: 'bg-emerald-500' }]),
        x('The shortcut gives the same answer. Multiply the tops: 1 × 3 = 3.', '1/2 × 3/4 = ', ['3', 'tops'], '/?'),
        x('Multiply the bottoms: 2 × 4 = 8.', '1/2 × 3/4 = 3/', ['8', 'bottoms']),
        x('So one half times three quarters is three eighths.', '1/2 × 3/4 = ', ['3/8', 'answer'])
      ] },

    { title: '9. Whole number divided by a fraction',
      explain: [
        'When you divide by a fraction, you are asking how many of those pieces fit inside.',
        '6 ÷ 1/3 asks, "How many thirds fit into 6 wholes?" Each whole holds 3 thirds, so 6 wholes hold 18 thirds.',
        'The shortcut is to multiply the whole number by the bottom of the unit fraction.'
      ],
      rule: 'How many pieces fit? Whole number × bottom number.',
      mistake: 'Dividing by 1/3 makes the answer bigger, not smaller. There are many small pieces.',
      steps: [
        x('How many thirds fit into 6? That is 6 ÷ 1/3.', ['6 ÷ 1/3', 'how many thirds?']),
        groups('Each whole is cut into 3 thirds. Here are 6 wholes, with 3 pieces in each.', 6, 3, 0, '3 thirds in each whole'),
        x('Count the pieces. 6 wholes times 3 thirds each is 18.', '6 × 3 = ', ['18', 'thirds']),
        x('So 18 thirds fit into 6.', '6 ÷ 1/3 = ', ['18', 'answer'])
      ] },

    { title: '10. Word problems: how much is left?',
      explain: [
        'Some problems ask for the part that is left. First find the part that was used. Then take it away from the whole.',
        'You can also use the fact that the used part and the leftover part make the whole. If 3/5 is spent, then 2/5 is left.'
      ],
      rule: 'Find the part used. Subtract from the whole. Or use the leftover fraction.',
      mistake: 'Read the last sentence twice. The problem might ask for what is left, not what was spent.',
      steps: [
        x('Sam had $40. He spent 3/5 of it. How much is left?', ['$40', 'start'], ' spent ', ['3/5', 'of it']),
        groups('Cut $40 into 5 equal groups of $8.', 5, 8, 0, '$8 in each group'),
        groups('Spent 3 groups. That is 3 × 8 = 24 dollars.', 5, 8, 3, '3 groups spent'),
        x('Take that away from what he had. 40 − 24 = 16.', '$40 − $24 = ', ['$16', 'left']),
        x('Check another way. 5/5 − 3/5 = 2/5. And 2 groups of 8 is 16.', '2/5 × $40 = ', ['$16', 'same answer'])
      ] }
  ];

  /* ---------- Question skills ---------- */
  var SK = 'Fractions';

  B.register(3, [

    { id: 'name', level: 1, name: 'Name the fraction', make: function () {
      var d = R.pick([4, 5, 6, 8, 10, 12]), n = R.int(1, d - 1);
      return Q.num({
        skill: 'Name a fraction', prompt: 'A bar is cut into ' + d + ' equal parts. ' + n + (n === 1 ? ' part is' : ' parts are') + ' shaded. What fraction of the bar is shaded?',
        answer: n + '/' + d, placeholder: 'Like 3/8',
        traps: [T(d + '/' + n, 'You flipped it. The bottom number counts all the equal parts. The top number counts the shaded parts.'),
                T(n + '/' + (d - n), 'That compares shaded parts to empty parts. The bottom number must count all the parts, shaded and not shaded.')],
        work: n + ' shaded parts out of ' + d + ' equal parts is ' + n + '/' + d + '.',
        plain: 'The bottom number is the total number of equal parts. The top number is how many are shaded.',
        teach: [
          bars('This bar is cut into ' + d + ' equal parts. The bottom number is ' + d + '.', [fb('Whole bar', d, 0)]),
          bars(n + (n === 1 ? ' of the parts is shaded.' : ' of the parts are shaded.') + ' The top number is ' + n + '.', [fb('Shaded', d, n)]),
          x('So the fraction is ' + n + ' over ' + d + '.', [n + '/' + d, 'shaded out of all'])
        ]
      });
    } },

    { id: 'equiv', level: 1, name: 'Missing number in equivalent fractions', make: function () {
      var b = R.pick([2, 3, 4, 5, 6]), a = R.int(1, b - 1);
      while (R.gcd(a, b) > 1) { a = R.int(1, b - 1); }
      var m = R.int(2, 5), bm = b * m, am = a * m;
      return Q.num({
        skill: 'Equivalent fractions', prompt: 'Fill in the missing number: ' + a + '/' + b + ' = ?/' + bm,
        answer: am, keyboard: 'numeric', placeholder: 'Type the missing top number',
        traps: [T(String(a + bm - b), 'You added ' + (bm - b) + ' to the top. To keep the same amount you must multiply, not add.'),
                T(String(m), 'That is the number we multiplied by. Now use it on the top: ' + a + ' × ' + m + '.')],
        work: b + ' × ' + m + ' = ' + bm + ', so ' + a + ' × ' + m + ' = ' + am + '.',
        plain: 'Whatever you do to the bottom, you do to the top. The bottom got ' + m + ' times bigger, so the top does too.',
        teach: [
          x('Look at the bottom numbers. ' + b + ' turned into ' + bm + '.', a + '/' + b + ' = ', ['?', 'missing'], '/' + bm),
          x(b + ' × ' + m + ' = ' + bm + '. The bottom was multiplied by ' + m + '.', b + ' × ', [String(m), 'multiplier'], ' = ' + bm),
          x('Do the same to the top. ' + a + ' × ' + m + ' = ' + am + '.', a + ' × ' + m + ' = ', [String(am), 'new top']),
          x('So the missing number is ' + am + '.', a + '/' + b + ' = ', [am + '/' + bm, 'answer'])
        ]
      });
    } },

    { id: 'simplify', level: 1, name: 'Simplest form', make: function () {
      var b = R.pick([3, 4, 5, 7, 8, 9]), a = R.int(1, b - 1);
      while (R.gcd(a, b) > 1) { a = R.int(1, b - 1); }
      var g = R.int(2, 6), n = a * g, d = b * g;
      return Q.num({
        skill: 'Simplify a fraction', prompt: 'Write ' + n + '/' + d + ' in simplest form.',
        answer: a + '/' + b, simplest: true, placeholder: 'Like 2/3',
        traps: [],
        work: 'Divide the top and the bottom by ' + g + ': ' + n + ' ÷ ' + g + ' = ' + a + ' and ' + d + ' ÷ ' + g + ' = ' + b + '.',
        plain: 'Find the biggest number that goes into both numbers. Divide both by it.',
        teach: [
          x('We look for a number that goes into both ' + n + ' and ' + d + '.', [n + '/' + d, 'simplify']),
          note('Both ' + n + ' and ' + d + ' can be divided by ' + g + '.', 'A number that fits both', [g + ' goes into ' + n, g + ' goes into ' + d]),
          x('Divide the top: ' + n + ' ÷ ' + g + ' = ' + a + '.', n + ' ÷ ' + g + ' = ', [String(a), 'new top']),
          x('Divide the bottom: ' + d + ' ÷ ' + g + ' = ' + b + '.', d + ' ÷ ' + g + ' = ', [String(b), 'new bottom']),
          x('Nothing but 1 goes into both ' + a + ' and ' + b + ', so we are done.', n + '/' + d + ' = ', [a + '/' + b, 'simplest'])
        ]
      });
    } },

    { id: 'compare', level: 2, name: 'Which fraction is greater', make: function () {
      var pairs = [[3, 4, 5, 8], [2, 3, 5, 8], [3, 5, 7, 10], [1, 2, 3, 8], [5, 6, 7, 9], [2, 5, 3, 8], [3, 4, 7, 10], [4, 5, 5, 6]];
      var p = R.pick(pairs), n1 = p[0], d1 = p[1], n2 = p[2], d2 = p[3];
      if (n1 * d2 === n2 * d1) { n1 = 1; d1 = 2; n2 = 3; d2 = 5; }
      var l = R.lcm(d1, d2), a = n1 * (l / d1), b = n2 * (l / d2);
      var bigger = a > b ? n1 + '/' + d1 : n2 + '/' + d2;
      var smaller = a > b ? n2 + '/' + d2 : n1 + '/' + d1;
      return Q.choice({
        skill: 'Compare fractions', prompt: 'Which fraction is greater, ' + n1 + '/' + d1 + ' or ' + n2 + '/' + d2 + '?',
        options: [
          { text: bigger, ok: true },
          { text: smaller, ok: false, trap: 'Change both to the same bottom number, ' + l + '. Then you can compare the tops.' },
          { text: 'They are equal', ok: false, trap: 'They are not the same amount. Change both to bottom number ' + l + ' and compare.' }
        ],
        work: n1 + '/' + d1 + ' = ' + a + '/' + l + ' and ' + n2 + '/' + d2 + ' = ' + b + '/' + l + '. ' + Math.max(a, b) + ' is more than ' + Math.min(a, b) + '.',
        plain: 'When the pieces are the same size, the fraction with more pieces is bigger.',
        teach: [
          x('We compare ' + n1 + '/' + d1 + ' and ' + n2 + '/' + d2 + '. The pieces are different sizes, so we match the bottoms.', n1 + '/' + d1 + ' or ' + n2 + '/' + d2),
          x('A bottom number that both ' + d1 + ' and ' + d2 + ' go into is ' + l + '.', 'Common bottom: ', [String(l), 'common denominator']),
          x(n1 + '/' + d1 + ' becomes ' + a + '/' + l + '.', n1 + '/' + d1 + ' = ', [a + '/' + l, 'same amount']),
          x(n2 + '/' + d2 + ' becomes ' + b + '/' + l + '.', n2 + '/' + d2 + ' = ', [b + '/' + l, 'same amount']),
          x('Same size pieces. ' + Math.max(a, b) + ' is more than ' + Math.min(a, b) + ', so ' + bigger + ' is greater.', [bigger, 'greater'])
        ]
      });
    } },

    { id: 'addlike', level: 2, name: 'Add fractions, same bottom', make: function () {
      var d = R.pick([5, 6, 7, 8, 9, 10, 12]), n1 = R.int(1, d - 2), n2 = R.int(1, d - n1 - 1), s = n1 + n2;
      return Q.num({
        skill: 'Add like fractions', prompt: 'What is ' + n1 + '/' + d + ' + ' + n2 + '/' + d + '? Write it in simplest form.',
        answer: R.fr(s, d), simplest: true, placeholder: 'Like 5/8',
        traps: [T(s + '/' + (2 * d), 'You added the bottoms too. The pieces are the same size, so the bottom stays ' + d + '.')],
        work: n1 + ' + ' + n2 + ' = ' + s + ', so the answer is ' + s + '/' + d + (R.gcd(s, d) > 1 ? ', which simplifies to ' + R.fr(s, d) : '') + '.',
        plain: 'Same size pieces, so just count them. Add the tops and keep the bottom.',
        teach: [
          bars('Start with ' + n1 + ' pieces of size 1/' + d + '.', [fb(n1 + '/' + d, d, n1, 'bg-indigo-400')]),
          bars('Add ' + n2 + ' more pieces of the same size.', [fb(n1 + '/' + d, d, n1, 'bg-indigo-400'), fb('+ ' + n2 + '/' + d, d, n2, 'bg-emerald-400')]),
          x('Add the tops: ' + n1 + ' + ' + n2 + ' = ' + s + '. Keep the bottom ' + d + '.', n1 + '/' + d + ' + ' + n2 + '/' + d + ' = ', [s + '/' + d, 'add tops']),
          R.gcd(s, d) > 1 ? x('It can be simplified. Divide top and bottom by ' + R.gcd(s, d) + '.', s + '/' + d + ' = ', [R.fr(s, d), 'simplest']) : x('It is already in simplest form.', [s + '/' + d, 'answer'])
        ]
      });
    } },

    { id: 'addunlike', level: 3, name: 'Add fractions, different bottoms', make: function () {
      var pairs = [[2, 3], [2, 5], [3, 4], [3, 5], [2, 4], [3, 6], [4, 8], [2, 6], [4, 6], [5, 10]];
      for (var t = 0; t < 40; t++) {
        var p = R.pick(pairs), d1 = p[0], d2 = p[1];
        if (R.int(0, 1)) { var z = d1; d1 = d2; d2 = z; }
        var n1 = R.int(1, d1 - 1), n2 = R.int(1, d2 - 1), l = R.lcm(d1, d2);
        var a = n1 * (l / d1), b = n2 * (l / d2), s = a + b;
        if (s < l) break;
      }
      var traps = [T((n1 + n2) + '/' + (d1 + d2), 'You added the tops and the bottoms. The bottoms name the size of the pieces, so they must match before you add.')];
      return Q.num({
        skill: 'Add unlike fractions', prompt: 'What is ' + n1 + '/' + d1 + ' + ' + n2 + '/' + d2 + '? Write it in simplest form.',
        answer: R.fr(s, l), simplest: true, placeholder: 'Like 5/6', traps: traps,
        work: 'Common bottom ' + l + ': ' + a + '/' + l + ' + ' + b + '/' + l + ' = ' + s + '/' + l + (R.gcd(s, l) > 1 ? ' = ' + R.fr(s, l) : '') + '.',
        plain: 'Make the pieces the same size first. Then add the tops.',
        teach: [
          x('The bottoms ' + d1 + ' and ' + d2 + ' are different, so we cannot add yet.', n1 + '/' + d1 + ' + ' + n2 + '/' + d2),
          x('Find a number that both ' + d1 + ' and ' + d2 + ' go into. A good one is ' + l + '.', 'Common bottom: ', [String(l), 'both go into it']),
          x(n1 + '/' + d1 + ' becomes ' + a + '/' + l + '. We multiplied top and bottom by ' + (l / d1) + '.', n1 + '/' + d1 + ' = ', [a + '/' + l, '× ' + (l / d1)]),
          x(n2 + '/' + d2 + ' becomes ' + b + '/' + l + '. We multiplied top and bottom by ' + (l / d2) + '.', n2 + '/' + d2 + ' = ', [b + '/' + l, '× ' + (l / d2)]),
          x('Add the tops: ' + a + ' + ' + b + ' = ' + s + '. Keep the bottom ' + l + '.', a + '/' + l + ' + ' + b + '/' + l + ' = ', [s + '/' + l, 'sum']),
          R.gcd(s, l) > 1 ? x('Simplify. Divide top and bottom by ' + R.gcd(s, l) + '.', s + '/' + l + ' = ', [R.fr(s, l), 'simplest']) : x('It is already in simplest form.', [s + '/' + l, 'answer'])
        ]
      });
    } },

    { id: 'subunlike', level: 3, name: 'Take away fractions, different bottoms', make: function () {
      var pairs = [[2, 3], [3, 4], [4, 5], [2, 4], [3, 6], [4, 8], [4, 6], [5, 10], [3, 5]];
      var n1, d1, n2, d2, l, a, b;
      for (var t = 0; t < 60; t++) {
        var p = R.pick(pairs); d1 = p[0]; d2 = p[1];
        if (R.int(0, 1)) { var z = d1; d1 = d2; d2 = z; }
        n1 = R.int(1, d1 - 1); n2 = R.int(1, d2 - 1); l = R.lcm(d1, d2);
        a = n1 * (l / d1); b = n2 * (l / d2);
        if (a > b) break;
      }
      var df = a - b;
      var traps = [];
      if (d1 !== d2 && n1 > n2 && d1 > d2) traps.push(T((n1 - n2) + '/' + (d1 - d2), 'You took away the tops and the bottoms. Match the bottoms first, then only take away the tops.'));
      return Q.num({
        skill: 'Subtract unlike fractions', prompt: 'What is ' + n1 + '/' + d1 + ' − ' + n2 + '/' + d2 + '? Write it in simplest form.',
        answer: R.fr(df, l), simplest: true, placeholder: 'Like 7/12', traps: traps,
        work: a + '/' + l + ' − ' + b + '/' + l + ' = ' + df + '/' + l + (R.gcd(df, l) > 1 ? ' = ' + R.fr(df, l) : '') + '.',
        plain: 'Make the pieces the same size, then take the smaller top from the bigger top.',
        teach: [
          x('The bottoms are different, so we match them first.', n1 + '/' + d1 + ' − ' + n2 + '/' + d2),
          x('Both ' + d1 + ' and ' + d2 + ' go into ' + l + '. That is our common bottom.', 'Common bottom: ', [String(l), 'both go into it']),
          x(n1 + '/' + d1 + ' becomes ' + a + '/' + l + '.', n1 + '/' + d1 + ' = ', [a + '/' + l, '× ' + (l / d1)]),
          x(n2 + '/' + d2 + ' becomes ' + b + '/' + l + '.', n2 + '/' + d2 + ' = ', [b + '/' + l, '× ' + (l / d2)]),
          x('Take away the tops: ' + a + ' − ' + b + ' = ' + df + '. Keep the bottom ' + l + '.', a + '/' + l + ' − ' + b + '/' + l + ' = ', [df + '/' + l, 'difference']),
          R.gcd(df, l) > 1 ? x('Simplify. Divide top and bottom by ' + R.gcd(df, l) + '.', df + '/' + l + ' = ', [R.fr(df, l), 'simplest']) : x('It is already in simplest form.', [df + '/' + l, 'answer'])
        ]
      });
    } },

    { id: 'fracofamt', level: 4, name: 'Fraction of an amount', make: function () {
      var d = R.pick([2, 3, 4, 5, 6, 8, 10]), n = R.int(1, d - 1), per = R.int(2, 9), amt = d * per;
      var phrase = R.pick(['What is ' + n + '/' + d + ' of ' + amt + '?', 'What is ' + n + '/' + d + ' × ' + amt + '?']);
      return Q.num({
        skill: 'Find a fraction of an amount', prompt: phrase, answer: n * per, keyboard: 'numeric', placeholder: 'Type a whole number',
        traps: [T(String(n * amt), 'You multiplied by the top but forgot to share by the bottom. The bottom number tells you how many equal groups to make.'),
                T(String(per), 'That is only one group. The top number, ' + n + ', tells you how many groups to take.')],
        work: amt + ' ÷ ' + d + ' = ' + per + ', then ' + per + ' × ' + n + ' = ' + (n * per) + '.',
        plain: 'Cut ' + amt + ' into ' + d + ' equal groups of ' + per + '. Take ' + n + ' of the groups.',
        teach: fracOfTeach(amt, n, d, per)
      });
    } },

    { id: 'wordfrac', level: 4, name: 'Fraction of an amount, story', make: function () {
      var d = R.pick([3, 4, 5, 6, 8, 10]), n = R.int(1, d - 1), per = R.int(2, 9), amt = d * per;
      var t = R.pick([
        { p: 'A bag has ' + amt + ' marbles. ' + n + '/' + d + ' of them are blue. How many blue marbles are there?', u: 'marbles' },
        { p: 'A class has ' + amt + ' students. ' + n + '/' + d + ' of them walk to school. How many students walk?', u: 'students' },
        { p: 'Rinka has $' + amt + '. She spends ' + n + '/' + d + ' of it on a book. How many dollars does the book cost?', u: 'dollars' },
        { p: 'A farm has ' + amt + ' animals. ' + n + '/' + d + ' of them are sheep. How many sheep are there?', u: 'sheep' }
      ]);
      return Q.num({
        skill: 'Fraction of an amount in a story', prompt: t.p, answer: n * per, keyboard: 'numeric', placeholder: 'Type a whole number',
        traps: [T(String(n * amt), 'That is bigger than the whole amount. A fraction of a number must be smaller than the number itself.'),
                T(String(per), 'That is one group only. Take ' + n + ' groups.')],
        work: amt + ' ÷ ' + d + ' = ' + per + ', then ' + per + ' × ' + n + ' = ' + (n * per) + ' ' + t.u + '.',
        plain: 'Share the whole amount into ' + d + ' equal groups. Take ' + n + ' of them.',
        teach: fracOfTeach(amt, n, d, per, t.u)
      });
    } },

    { id: 'fracxfrac', level: 5, name: 'Multiply two fractions', make: function () {
      var d1 = R.pick([2, 3, 4, 5]), d2 = R.pick([2, 3, 4, 5, 6]), n1 = R.int(1, d1 - 1), n2 = R.int(1, d2 - 1);
      var nn = n1 * n2, dd = d1 * d2;
      return Q.num({
        skill: 'Multiply fractions', prompt: 'What is ' + n1 + '/' + d1 + ' × ' + n2 + '/' + d2 + '? Write it in simplest form.',
        answer: R.fr(nn, dd), simplest: true, placeholder: 'Like 3/8',
        traps: [T((n1 + n2) + '/' + (d1 + d2), 'You added. The sign is times. Multiply the tops together and multiply the bottoms together.')],
        work: n1 + ' × ' + n2 + ' = ' + nn + ' and ' + d1 + ' × ' + d2 + ' = ' + dd + ', so ' + nn + '/' + dd + (R.gcd(nn, dd) > 1 ? ' = ' + R.fr(nn, dd) : '') + '.',
        plain: 'A part of a part is smaller. Tops times tops, bottoms times bottoms.',
        teach: [
          x('To multiply fractions we do not need a common bottom. Multiply straight across.', n1 + '/' + d1 + ' × ' + n2 + '/' + d2),
          x('Multiply the tops: ' + n1 + ' × ' + n2 + ' = ' + nn + '.', n1 + ' × ' + n2 + ' = ', [String(nn), 'new top']),
          x('Multiply the bottoms: ' + d1 + ' × ' + d2 + ' = ' + dd + '.', d1 + ' × ' + d2 + ' = ', [String(dd), 'new bottom']),
          R.gcd(nn, dd) > 1 ? x('Simplify. Divide top and bottom by ' + R.gcd(nn, dd) + '.', nn + '/' + dd + ' = ', [R.fr(nn, dd), 'simplest']) : x('It is already in simplest form.', [nn + '/' + dd, 'answer'])
        ]
      });
    } },

    { id: 'wholediv', level: 5, name: 'Whole number divided by a unit fraction', make: function () {
      var w = R.int(2, 8), d = R.int(2, 6);
      return Q.num({
        skill: 'Divide by a unit fraction', prompt: 'What is ' + w + ' ÷ 1/' + d + '?', answer: w * d, keyboard: 'numeric', placeholder: 'Type a whole number',
        traps: [T(String(w / d), 'You divided by ' + d + '. But we are dividing by one ' + (d === 2 ? 'half' : 'part of ' + d) + ', which is a small piece, so many pieces fit.')],
        work: w + ' × ' + d + ' = ' + (w * d) + '.',
        plain: 'Each whole holds ' + d + ' pieces of size 1/' + d + '. ' + w + ' wholes hold ' + w + ' × ' + d + ' pieces.',
        teach: [
          x('How many pieces of size 1/' + d + ' fit into ' + w + '?', [w + ' ÷ 1/' + d, 'how many fit?']),
          groups('Each whole holds ' + d + ' pieces. Here are ' + w + ' wholes.', w, d, 0, d + ' pieces in each whole'),
          x('Count all the pieces. ' + w + ' × ' + d + ' = ' + (w * d) + '.', w + ' × ' + d + ' = ', [String(w * d), 'pieces']),
          x('So ' + (w * d) + ' pieces fit into ' + w + '.', w + ' ÷ 1/' + d + ' = ', [String(w * d), 'answer'])
        ]
      });
    } },

    { id: 'left', level: 6, name: 'How much is left', make: function () {
      var d = R.pick([4, 5, 6, 8, 10]), n = R.int(1, d - 1), per = R.int(2, 9), amt = d * per;
      var t = R.pick([['Sam had $' + amt + '. He spent ' + n + '/' + d + ' of it. How many dollars are left?', 'dollars'],
                      ['A tank holds ' + amt + ' liters. ' + n + '/' + d + ' of the water is used. How many liters are left?', 'liters'],
                      ['A book has ' + amt + ' pages. Mia read ' + n + '/' + d + ' of it. How many pages are left to read?', 'pages']]);
      var used = n * per, left = amt - used;
      return Q.num({
        skill: 'Fraction of an amount, what is left', prompt: t[0], answer: left, keyboard: 'numeric', placeholder: 'Type a whole number',
        traps: [T(String(used), 'That is the amount used. The question asks what is left. Take it away from ' + amt + '.')],
        work: amt + ' ÷ ' + d + ' = ' + per + ', used ' + per + ' × ' + n + ' = ' + used + ', left ' + amt + ' − ' + used + ' = ' + left + '.',
        plain: 'Find the part used, then take it away from the whole. Or find (' + (d - n) + '/' + d + ') of it.',
        teach: [
          x('First find how much was used. That is ' + n + '/' + d + ' of ' + amt + '.', [n + '/' + d + ' × ' + amt, 'used']),
          groups('Cut ' + amt + ' into ' + d + ' equal groups of ' + per + '.', d, per, 0, per + ' in each group'),
          groups('Used: ' + n + ' groups. ' + n + ' × ' + per + ' = ' + used + '.', d, per, n, n + ' groups used'),
          x('Now take that away from the whole. ' + amt + ' − ' + used + ' = ' + left + '.', amt + ' − ' + used + ' = ', [String(left) + ' ' + t[1], 'left']),
          x('Check: the other ' + (d - n) + ' groups are ' + (d - n) + ' × ' + per + ' = ' + left + '.', [String(left), 'same answer'])
        ]
      });
    } }
  ]);
})();
