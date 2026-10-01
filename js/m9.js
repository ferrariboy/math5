/* Module 9: Equivalent Fractions and Benchmarks. Lessons, vocabulary and question skills. */
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
  function coprime(minB, maxB) {
    var b, a;
    do { b = R.int(minB, maxB); a = R.int(1, b - 1); } while (R.gcd(a, b) > 1);
    return [a, b];
  }
  /* Hundredths as text: 50 -> "0.5", 25 -> "0.25", 125 -> "1.25", 200 -> "2" */
  function dtext(h) {
    if (h % 100 === 0) return String(h / 100);
    if (h % 10 === 0) return (h / 10 / 10).toFixed(1);
    return (h / 100).toFixed(2);
  }
  /* A number line from 0 to a whole number. d parts per whole, w characters per part.
     o.all labels every tick. o.mark puts a caret under tick number o.mark. */
  function nl(d, to, w, o) {
    o = o || {};
    var n = d * to, W = n * w + 12, lab = [], ax = [], mk = [], ml = [], i, k;
    for (i = 0; i < W; i++) { lab.push(' '); ax.push(' '); mk.push(' '); ml.push(' '); }
    for (i = 0; i <= n; i++) {
      for (k = 1; k < w && i < n; k++) ax[i * w + k] = '_';
      ax[i * w] = '|';
      var t = (i % d === 0) ? String(i / d) : (o.all ? i + '/' + d : '');
      for (k = 0; k < t.length; k++) lab[i * w + k] = t.charAt(k);
    }
    var out = [lab.join('').replace(/\s+$/, ''), ax.join('').replace(/\s+$/, '')];
    if (o.mark !== undefined) {
      mk[o.mark * w] = '^';
      var ms = o.markLabel || '';
      for (k = 0; k < ms.length; k++) ml[o.mark * w + k] = ms.charAt(k);
      out.push(mk.join('').replace(/\s+$/, ''));
      out.push(ml.join('').replace(/\s+$/, ''));
    }
    return out;
  }

  /* ---------- Vocabulary ---------- */
  window.MATH_VOCAB[9] = [
    { w: 'Fraction', m: 'A number that names part of a whole, like 3/4. It means 3 out of 4 equal parts.' },
    { w: 'Benchmark', m: 'An easy fraction to use as a landmark. We use 0, 1/2 and 1 to see where other fractions sit.' },
    { w: 'Equivalent fractions', m: 'Different fractions that name the same amount, like 1/2 and 4/8. They land on the same spot on a number line.' },
    { w: 'Simplest form', m: 'A fraction with the smallest possible numbers. 4/8 is not simplest, but 1/2 is.' },
    { w: 'Common denominator', m: 'A bottom number that two fractions can share. It lets you compare pieces of the same size.' },
    { w: 'Improper fraction', m: 'A fraction where the top is bigger than or equal to the bottom, like 11/4. It is one whole or more.' },
    { w: 'Mixed number', m: 'A whole number and a fraction together, like 2 and 3/4.' },
    { w: 'Decimal', m: 'A number that uses a point to show tenths and hundredths. 0.5 means 5 tenths, which is the same as 1/2.' }
  ];

  /* ---------- Lessons ---------- */
  window.MATH_LESSONS[9] = [
    { title: '1. Fractions on a number line',
      explain: [
        'A number line is a straight line with numbers in order. Fractions live on it too, in the spaces between the whole numbers.',
        'To place a fraction, cut the space from 0 to 1 into equal parts. The bottom number tells how many equal parts. The top number tells how many jumps to make from 0.',
        'The parts must be equal, just like the slices of a fair pizza.'
      ],
      rule: 'Bottom number: equal parts between 0 and 1. Top number: jumps from 0.',
      mistake: 'Count the jumps, not the tick marks. The 0 mark is the start, so it is not jump number one.',
      steps: [
        lines('This is a number line from 0 to 1. The space between them is one whole.', nl(1, 1, 24), 99),
        lines('Cut the whole into 4 equal parts. There are now 4 jumps from 0 to 1. Each jump is 1/4.', nl(4, 1, 6, { all: true }), 99),
        lines('Find 3/4. Start at 0 and make 3 jumps of size 1/4. The caret shows where we land.', nl(4, 1, 6, { all: true, mark: 3, markLabel: '3/4' }), 2),
        x('Read the fraction as a count of jumps. The top says how many. The bottom names the size.', '3/4 = ', ['3', 'jumps'], ' × ', ['1/4', 'size of one jump']),
        lines('Try a new one. Cut 0 to 1 into 8 equal parts and find 5/8. Count 5 jumps from 0.', nl(8, 1, 5, { all: true, mark: 5, markLabel: '5/8' }), 2),
        note('Two things to remember when you place a fraction.', 'On a number line', ['The bottom number cuts 0 to 1 into equal parts', 'The top number counts jumps from 0', 'Count jumps, not tick marks'])
      ] },

    { title: '2. Benchmarks: 0, one half and 1',
      explain: [
        'A benchmark is an easy number you know well, like a landmark on a road. Our three benchmarks are 0, 1/2 and 1.',
        'To see where a fraction sits, ask if it is close to 0, close to 1/2, or close to 1. This lets you judge a fraction fast, without much work.',
        'Here is a test for one half. Double the top number and look at the bottom number. If the doubled top matches the bottom, the fraction is exactly 1/2.'
      ],
      rule: 'Double the top and compare it with the bottom. Less means below 1/2. Equal means 1/2. More means above 1/2.',
      mistake: 'A big top number does not always mean a big fraction. 7/100 is tiny because the bottom is huge. Look at both numbers.',
      steps: [
        lines('These are our three benchmarks. 0 is nothing. 1/2 is halfway. 1 is a whole.', ['0                 1/2                 1', '|__________________|__________________|'], 99),
        x('Take 1/8. It has only 1 piece out of 8. That is tiny, so it is close to 0.', ['1/8', 'close to 0']),
        x('Take 7/8. It is missing just 1 piece to make a whole. So it is close to 1.', ['7/8', 'close to 1']),
        x('Take 3/6. Double the top: 2 × 3 = 6. That matches the bottom, so 3/6 is exactly 1/2.', '2 × 3 = 6, and the bottom is 6. ', ['3/6 = 1/2', 'exactly half']),
        x('Take 5/12. Double the top: 2 × 5 = 10. The bottom is 12. 10 is a little less than 12, so 5/12 is a little less than 1/2.', ['5/12', 'a little less than 1/2']),
        note('Use the benchmarks like a map to sort fractions quickly.', 'Benchmark map', ['Tiny top compared to the bottom: close to 0', 'Doubled top about the same as the bottom: close to 1/2', 'Top almost as big as the bottom: close to 1'])
      ] },

    { title: '3. Comparing with benchmarks',
      explain: [
        'You can compare two fractions without changing them. First sort each one against 1/2. A fraction below 1/2 is always smaller than a fraction above 1/2.',
        'If both fractions are on the same side of 1/2, look at how far each is from 0 or from 1. Being close to 1 means being a big fraction.',
        'When a fraction is missing one piece to make a whole, the smaller that missing piece is, the closer to 1 it is.'
      ],
      rule: 'Sort each fraction against 1/2 first. If they are on the same side, check the missing piece.',
      mistake: 'Do not compare the bottom numbers alone. 1/8 has a bigger bottom than 1/2, but 1/8 is the smaller fraction.',
      steps: [
        x('Which is greater, 3/8 or 5/6? Try the benchmark 1/2 first.', ['3/8', 'compare'], ' or ', ['5/6', 'compare']),
        x('For 3/8, double the top: 2 × 3 = 6. That is less than 8, so 3/8 is less than 1/2.', ['3/8', 'less than 1/2']),
        x('For 5/6, double the top: 2 × 5 = 10. That is more than 6, so 5/6 is more than 1/2.', ['5/6', 'more than 1/2']),
        lines('Here they are on a number line. 3/8 sits left of 1/2. 5/6 sits right of 1/2.', ['0       3/8  1/2          5/6    1', '|________*___|_____________*___|'], 99),
        x('Anything below 1/2 is smaller than anything above 1/2. So 5/6 is greater.', '5/6', [' > ', 'greater'], '3/8'),
        x('A trickier pair. Which is greater, 7/8 or 5/6? Both are more than 1/2.', ['7/8', 'compare'], ' or ', ['5/6', 'compare']),
        x('7/8 is missing 1/8 to reach 1. 5/6 is missing 1/6 to reach 1.', '1 − 7/8 = ', ['1/8', 'missing'], '   1 − 5/6 = ', ['1/6', 'missing']),
        x('1/8 is a smaller piece than 1/6. Less is missing from 7/8, so 7/8 is closer to 1 and greater.', ['7/8', 'greater'], ' > 5/6')
      ] },

    { title: '4. Comparing with common denominators',
      explain: [
        'If two fractions have the same bottom number, the pieces are the same size. The one with more pieces is greater.',
        'If two fractions have the same top number, you have the same count of pieces. The one with the smaller bottom has bigger pieces, so it is greater.',
        'If both numbers are different, change both fractions so they have the same bottom number. This is called a common denominator. Then compare the tops.'
      ],
      rule: 'Same bottom: bigger top wins. Same top: smaller bottom wins. Otherwise, match the bottoms first.',
      mistake: 'For 3/4 and 3/8, the bigger bottom number does not make a bigger fraction. Eighths are smaller pieces than fourths.',
      steps: [
        bars('Same bottom. Here are 3/8 and 5/8. The pieces are the same size.', [fb('3/8', 8, 3, 'bg-indigo-400'), fb('5/8', 8, 5, 'bg-emerald-400')]),
        x('More pieces of the same size is more. So 5/8 is greater than 3/8.', '5/8', ' > ', '3/8'),
        bars('Same top. Here are 3/4 and 3/8. Both have 3 pieces, but the pieces are different sizes.', [fb('3/4', 4, 3, 'bg-indigo-400'), fb('3/8', 8, 3, 'bg-emerald-400')]),
        x('Fourths are bigger pieces than eighths. So 3/4 is greater than 3/8.', '3/4', ' > ', '3/8'),
        x('Now both numbers differ. Compare 2/3 and 3/4. We need a bottom number that 3 and 4 both go into.', ['2/3', 'compare'], ' or ', ['3/4', 'compare']),
        note('Count by 3s and by 4s until they meet.', 'Find the common bottom', ['Multiples of 3: 3, 6, 9, 12', 'Multiples of 4: 4, 8, 12', 'They meet at 12']),
        x('Change both to twelfths. 2/3 becomes 8/12. 3/4 becomes 9/12.', '2/3 = ', ['8/12', '× 4 on both'], '   3/4 = ', ['9/12', '× 3 on both']),
        bars('Same size pieces now. 9 twelfths is more than 8 twelfths.', [fb('8/12', 12, 8, 'bg-indigo-400'), fb('9/12', 12, 9, 'bg-emerald-400')]),
        x('So 3/4 is greater than 2/3.', '3/4', ' > ', '2/3')
      ] },

    { title: '5. Putting fractions in order',
      explain: [
        'To order fractions from least to greatest, give them all the same bottom number. Then just order the tops, like ordering plain numbers.',
        'Choose a bottom number that all the bottoms go into. Then change every fraction to that bottom.',
        'When you are done, write the fractions in their first form, not the changed form.'
      ],
      rule: 'Same bottom for all. Order the tops. Then write the original fractions in that order.',
      mistake: 'Do not forget to change back. If 2/6 is the smallest, the original fraction is 1/3.',
      steps: [
        x('Order 5/6, 1/3 and 1/2 from least to greatest.', ['5/6', 'order'], ', ', ['1/3', 'order'], ', ', ['1/2', 'order']),
        x('The bottoms are 6, 3 and 2. All of them go into 6, so use sixths.', 'Common bottom: ', ['6', 'sixths']),
        x('5/6 is already sixths. 1/3 becomes 2/6. 1/2 becomes 3/6.', '5/6 = 5/6    1/3 = ', ['2/6', '× 2'], '    1/2 = ', ['3/6', '× 3']),
        lines('Now put them on a number line cut into sixths.', nl(6, 1, 6, { all: true }), 99),
        x('Order the tops: 2, then 3, then 5.', ['2/6', 'least'], ' < ', ['3/6', 'middle'], ' < ', ['5/6', 'greatest']),
        x('Change back to the first fractions. The order is 1/3, then 1/2, then 5/6.', ['1/3', 'least'], ' < ', ['1/2', 'middle'], ' < ', ['5/6', 'greatest'])
      ] },

    { title: '6. Equivalent fractions',
      explain: [
        'Two fractions can look different and be the same amount. Half a pizza is the same as 2 quarters or 4 eighths.',
        'To make an equivalent fraction, multiply the top and the bottom by the same number. Every part gets cut into smaller pieces, so you have more pieces, but the amount stays the same.',
        'On a number line, equivalent fractions land on the very same spot.'
      ],
      rule: 'Multiply the top and the bottom by the SAME number. Never add.',
      mistake: 'Adding the same number to top and bottom changes the amount. 1/2 plus 1 on both is 2/3, and that is not the same as 1/2.',
      steps: [
        lines('Look at halves, quarters and eighths on number lines of the same length. 1/2, 2/4 and 4/8 all land in the middle.', nl(2, 1, 16, { all: true }).concat(nl(4, 1, 8, { all: true })).concat(nl(8, 1, 4, { all: true })), 99),
        bars('Same amount, cut into more pieces each time.', [fb('1/2', 2, 1, 'bg-emerald-400'), fb('2/4', 4, 2, 'bg-emerald-400'), fb('4/8', 8, 4, 'bg-emerald-400')]),
        x('Here is the rule. Multiply the top and the bottom by the same number.', '1/2 = ', ['1 × 2', 'top'], ' / ', ['2 × 2', 'bottom'], ' = 2/4'),
        x('Now find a missing number. 2/3 = ?/12. The bottom went from 3 to 12.', '2/3 = ', ['?', 'missing'], '/12'),
        x('3 times 4 is 12. So the bottom was multiplied by 4. Do the same to the top.', '3 × ', ['4', 'multiplier'], ' = 12'),
        x('2 × 4 = 8. So the missing top number is 8.', '2/3 = ', ['8', '2 × 4'], '/12'),
        x('You can also go the other way. Divide top and bottom by the same number. 6/9 divided by 3 gives 2/3.', '6/9 = ', ['2/3', '÷ 3 on both'])
      ] },

    { title: '7. Simplest form',
      explain: [
        'Simplest form means the fraction is written with the smallest numbers possible. It is like tidying a fraction.',
        'To simplify, find a number that goes into both the top and the bottom. Divide both by it. Keep going until only 1 goes into both.',
        'You can make small steps, like dividing by 2 first. You do not have to find the biggest number right away.'
      ],
      rule: 'Divide top and bottom by the same number until only 1 goes into both.',
      mistake: 'Stopping too early. 9/12 is not simplest yet, because 3 goes into both 9 and 12.',
      steps: [
        x('Simplify 18/24. We look for a number that goes into both 18 and 24.', ['18/24', 'simplify']),
        x('Both are even, so 2 works. 18 ÷ 2 = 9 and 24 ÷ 2 = 12.', '18/24 = ', ['9/12', '÷ 2 on both']),
        x('Is 9/12 finished? Both 9 and 12 divide by 3, so no. Keep going.', ['9/12', 'not finished']),
        x('Divide by 3. 9 ÷ 3 = 3 and 12 ÷ 3 = 4.', '9/12 = ', ['3/4', '÷ 3 on both']),
        x('Only 1 goes into both 3 and 4. So 3/4 is in simplest form.', '18/24 = ', ['3/4', 'simplest']),
        x('A shortcut. The biggest number that goes into both 18 and 24 is 6. Divide by 6 once.', '18 ÷ 6 = 3 and 24 ÷ 6 = 4, so ', ['3/4', 'same answer'])
      ] },

    { title: '8. Mixed numbers to improper fractions',
      explain: [
        'A mixed number has a whole number and a fraction, like 2 and 3/4. An improper fraction has a top number bigger than its bottom, like 11/4. They can name the same amount.',
        'Each whole holds as many pieces as the bottom number. In quarters, one whole is 4/4.',
        'To change, work out how many pieces are in the wholes, then add the extra pieces.'
      ],
      rule: 'Whole number × bottom, plus top. Put it over the same bottom.',
      mistake: 'Keep the same bottom number. 2 and 3/4 becomes 11/4, not 11/8.',
      steps: [
        bars('Here is 2 and 3/4. Two full bars of quarters and a bar with 3 quarters.', [fb('Whole 1', 4, 4, 'bg-indigo-400'), fb('Whole 2', 4, 4, 'bg-indigo-400'), fb('Part', 4, 3, 'bg-emerald-400')]),
        x('Each whole is 4 quarters. Two wholes are 2 × 4 = 8 quarters.', '2 × 4 = ', ['8', 'quarters in 2 wholes']),
        x('Add the 3 extra quarters. 8 + 3 = 11 quarters.', '8 + 3 = ', ['11', 'quarters']),
        x('11 quarters is written 11/4.', '2 and 3/4 = ', ['11/4', 'improper fraction']),
        x('Try 3 and 2/5. Whole × bottom: 3 × 5 = 15.', '3 × 5 = ', ['15', 'fifths in 3 wholes']),
        x('Add the top: 15 + 2 = 17. Keep the bottom 5.', '3 and 2/5 = ', ['17/5', 'answer']),
        note('The steps are always the same.', 'The recipe', ['Multiply the whole number by the bottom', 'Add the top', 'Keep the bottom the same'])
      ] },

    { title: '9. Improper fractions to mixed numbers',
      explain: [
        'Going the other way, ask how many full wholes are hiding inside the improper fraction.',
        'Divide the top by the bottom. The answer is the number of wholes. The leftover is the number of pieces that stay as a fraction.',
        'If nothing is left over, the fraction is a whole number.'
      ],
      rule: 'Divide top by bottom. The answer is the wholes. The leftover goes over the bottom.',
      mistake: 'Do not round up. 11/4 is 2 and 3/4, not 3. It is not quite three wholes.',
      steps: [
        bars('Here is 11/4. That is 11 quarter pieces. Every 4 quarters make a whole.', [fb('Whole 1', 4, 4, 'bg-indigo-400'), fb('Whole 2', 4, 4, 'bg-indigo-400'), fb('Left over', 4, 3, 'bg-emerald-400')]),
        x('How many 4s fit in 11? Divide: 11 ÷ 4 = 2 with 3 left over.', '11 ÷ 4 = ', ['2 r 3', '2 wholes, 3 left']),
        x('2 wholes and 3 quarters left. The leftover stays over the bottom 4.', '11/4 = ', ['2 and 3/4', 'mixed number']),
        x('Try 17/5. 17 ÷ 5 = 3 with 2 left over.', '17 ÷ 5 = ', ['3 r 2', '3 wholes, 2 left']),
        x('So 17/5 is 3 wholes and 2 fifths.', '17/5 = ', ['3 and 2/5', 'answer']),
        x('If nothing is left over, you get a whole number. 12/4 = 3 because 12 ÷ 4 = 3 exactly.', '12/4 = ', ['3', 'no leftover'])
      ] },

    { title: '10. Fractions and decimals',
      explain: [
        'A decimal is just a fraction with 10, 100 or another power of ten on the bottom. 0.5 means 5 tenths. 0.25 means 25 hundredths.',
        'A hundred grid helps. It has 100 little squares, so each square is 1/100 or 0.01.',
        'Some pairs are worth memorizing: 1/2 is 0.5, 1/4 is 0.25, 3/4 is 0.75, and 1/5 is 0.2.'
      ],
      rule: 'Make the bottom 10 or 100. Then read it as a decimal.',
      mistake: 'Do not write 3/4 as 3.4. The right answer is 0.75. The digits of a fraction do not go straight into a decimal.',
      steps: [
        grid('A hundred grid. Half of the squares are shaded. That is 50 out of 100.', 10, 10, [{ c0: 0, c1: 5, r0: 0, r1: 10, cls: 'bg-indigo-400' }]),
        x('50/100 is the same as 1/2. As a decimal, 50 hundredths is 0.50, or 0.5.', '1/2 = 50/100 = ', ['0.5', 'decimal']),
        grid('One quarter is 25 squares of 100.', 10, 10, [{ c0: 0, c1: 5, r0: 0, r1: 5, cls: 'bg-emerald-400' }]),
        x('25 hundredths is 0.25. So 1/4 is 0.25.', '1/4 = 25/100 = ', ['0.25', 'decimal']),
        grid('Three quarters is 75 squares of 100.', 10, 10, [{ c0: 0, c1: 10, r0: 0, r1: 7, cls: 'bg-teal-500' }, { c0: 0, c1: 5, r0: 7, r1: 8, cls: 'bg-teal-500' }]),
        x('75 hundredths is 0.75. So 3/4 is 0.75.', '3/4 = 75/100 = ', ['0.75', 'decimal']),
        x('For fifths, make the bottom 10. 5 × 2 = 10, so multiply the top by 2 too. 1/5 = 2/10.', '1/5 = ', ['2/10', '× 2 on both'], ' = ', ['0.2', 'decimal']),
        lines('Here is a table to remember.', ['Fraction    Decimal', '1/2         0.5', '1/4         0.25', '3/4         0.75', '1/5         0.2', '1/10        0.1'], 1)
      ] },

    { title: '11. Fractions bigger than 1',
      explain: [
        'A number line does not stop at 1. Fractions bigger than 1 sit farther to the right, between 1 and 2, or 2 and 3.',
        'Cut every whole into equal parts. Then count jumps from 0. Each time you pass a whole, you can name the spot as a mixed number.',
        'Improper fractions and mixed numbers are two names for the same spot.'
      ],
      rule: 'Count the jumps from 0. Every full set of bottom number jumps is one whole.',
      mistake: 'Do not restart counting at 1. Keep counting jumps from 0. 7/4 means 7 jumps in all.',
      steps: [
        lines('A number line from 0 to 2. Each whole is cut into 4 parts, so each jump is 1/4.', nl(4, 2, 5, { all: true }), 99),
        lines('Count 7 jumps from 0 to find 7/4.', nl(4, 2, 5, { all: true, mark: 7, markLabel: '7/4' }), 2),
        x('After 4 jumps we reach 1. We have 3 jumps more. So 7/4 is 1 and 3/4.', '7/4 = ', ['1 and 3/4', 'same spot']),
        x('Now try 5/3. Cut each whole into thirds. 3 jumps make 1 whole. 5 ÷ 3 = 1 with 2 left over.', '5/3 = ', ['1 and 2/3', 'between 1 and 2']),
        note('A quick way to know which two whole numbers a fraction sits between.', 'Between which wholes?', ['Divide top by bottom', 'The answer is the whole number just before it', 'The next whole number is just after it'])
      ] },

    { title: '12. Story problem: who has more?',
      explain: [
        'Fraction stories often ask who has more, who ran farther, or who has less left.',
        'Underline the two fractions. Check if the bottoms match. If not, find a common bottom and compare the tops.',
        'Answer with the name, not just the fraction.'
      ],
      rule: 'Find the two fractions. Match the bottoms. Compare the tops. Answer with the name.',
      mistake: 'Read the last sentence. If it asks for the one who has less, choose the smaller fraction.',
      steps: [
        x('At the Terry Fox run, Ava ran 3/4 of a kilometre. Ben ran 5/8 of a kilometre. Who ran farther?', ['3/4', 'Ava'], ' or ', ['5/8', 'Ben']),
        x('The bottoms are 4 and 8. Both go into 8, so use eighths.', 'Common bottom: ', ['8', 'eighths']),
        x('3/4 becomes 6/8. 5/8 stays 5/8.', '3/4 = ', ['6/8', '× 2 on both'], '    5/8 = 5/8'),
        bars('Same size pieces. Ava has 6 eighths. Ben has 5 eighths.', [fb('Ava 6/8', 8, 6, 'bg-indigo-400'), fb('Ben 5/8', 8, 5, 'bg-emerald-400')]),
        x('6 is more than 5, so Ava ran farther.', ['Ava', 'ran farther']),
        x('Check with benchmarks. 3/4 is more than 1/2 and close to 1. 5/8 is a little more than 1/2. Ava is farther along.', ['3/4', '>'], ' ', ['5/8', ''])
      ] }
  ];

  /* ---------- Question skills ---------- */
  var HALF_TEACH = function (n, d) {
    var a = 2 * n;
    var rel = a < d ? 'less than' : (a === d ? 'equal to' : 'more than');
    return x('Double the top: 2 × ' + n + ' = ' + a + '. The bottom is ' + d + '. ' + a + ' is ' + rel + ' ' + d + '.', '2 × ' + n + ' = ', [String(a), 'doubled top'], ' and the bottom is ', [String(d), 'bottom']);
  };
  function wholeRows(w, d) { var r = []; for (var i = 1; i <= w; i++) r.push(fb('Whole ' + i, d, d, 'bg-indigo-400')); return r; }
  function mixedText(w, n, d) { return w + ' and ' + n + '/' + d; }

  B.register(9, [

    { id: 'nlname', level: 1, name: 'Name the point on a number line', make: function () {
      var d = R.pick([2, 3, 4, 5, 6, 8]), n = R.int(1, d - 1);
      var p = R.pick([
        'A number line from 0 to 1 is cut into ' + d + ' equal parts. A dot sits ' + n + (n === 1 ? ' part' : ' parts') + ' to the right of 0. What fraction is the dot at?',
        'Rinka hops along a number line from 0 to 1. It is cut into ' + d + ' equal jumps. She stops after ' + n + (n === 1 ? ' jump.' : ' jumps.') + ' What fraction does she land on?',
        'A ruler strip from 0 to 1 has ' + d + ' equal parts. A pin is placed ' + n + (n === 1 ? ' part' : ' parts') + ' from the 0 end. What fraction names the pin?'
      ]);
      return N({
        skill: 'Fractions on a number line', prompt: p, answer: n + '/' + d, placeholder: 'Like 3/8',
        traps: [T(d + '/' + n, 'You flipped the fraction. The bottom number is how many equal parts in all. The top number is how many jumps.'),
                T(n + '/' + (d - n), 'That compares jumps taken to jumps left. The bottom number counts all ' + d + ' equal parts.')],
        work: 'The whole is cut into ' + d + ' parts and the dot is ' + n + ' jumps from 0. So it is ' + n + '/' + d + '.',
        plain: 'The bottom number is how many equal parts. The top number is how many jumps from 0.',
        teach: [
          lines('The number line from 0 to 1 is cut into ' + d + ' equal parts. The bottom number is ' + d + '.', nl(d, 1, 6, { all: false }), 99),
          x('Each jump is 1/' + d + '. The dot is ' + n + ' jumps from 0. The top number is ' + n + '.', [String(n), 'jumps'], ' × ', ['1/' + d, 'one jump']),
          lines('Here is the dot at the ' + n + 'th jump.', nl(d, 1, 6, { all: true, mark: n, markLabel: n + '/' + d }), 2),
          x('So the dot is at ' + n + '/' + d + '.', [n + '/' + d, 'answer'])
        ]
      });
    } },

    { id: 'bench', level: 1, name: 'Close to 0, 1/2 or 1', make: function () {
      var d, n, a, b, c, m;
      do {
        d = R.int(4, 12); n = R.int(1, d - 1);
        a = 2 * n; b = Math.abs(2 * n - d); c = 2 * (d - n); m = Math.min(a, b, c);
      } while ([a, b, c].filter(function (v) { return v === m; }).length > 1);
      var right = m === a ? 0 : (m === b ? 1 : 2);
      var names = ['Close to 0', 'Close to 1/2', 'Close to 1'];
      var say = [
        'Double the top: 2 × ' + n + ' = ' + (2 * n) + '. That is very small next to ' + d + ', so the fraction is near 0.',
        'Double the top: 2 × ' + n + ' = ' + (2 * n) + '. That is close to ' + d + ', so the fraction is near 1/2.',
        'Only ' + (d - n) + (d - n === 1 ? ' piece is' : ' pieces are') + ' missing to make a whole, so the fraction is near 1.'
      ];
      var opts = names.map(function (t, i) { return i === right ? { text: t, ok: true } : { text: t, ok: false, trap: say[right] }; });
      var p = R.pick(['Which benchmark is ' + n + '/' + d + ' closest to?', 'Is ' + n + '/' + d + ' closest to 0, 1/2 or 1?', 'Use benchmarks. Where does ' + n + '/' + d + ' sit best?']);
      return Q.choice({
        skill: 'Benchmark fractions', prompt: p, options: opts,
        work: say[right], plain: 'Double the top and compare with the bottom. Tiny means near 0. About the same means near 1/2. Almost the whole bottom means near 1.',
        teach: [
          x('We sort ' + n + '/' + d + ' by the benchmarks 0, 1/2 and 1.', [n + '/' + d, 'where is it?']),
          HALF_TEACH(n, d),
          x(say[right], [names[right], 'reason']),
          x('So ' + n + '/' + d + ' is ' + names[right].toLowerCase() + '.', [n + '/' + d, names[right]])
        ]
      });
    } },

    { id: 'equiv', level: 2, name: 'Missing number in equivalent fractions', make: function () {
      var ab = coprime(2, 7), a = ab[0], b = ab[1], m = R.int(2, 9), am = a * m, bm = b * m;
      var v = R.int(0, 3);
      if (v === 0) {
        return N({
          skill: 'Equivalent fractions', prompt: 'Fill in the missing top number: ' + a + '/' + b + ' = ?/' + bm, answer: am, keyboard: 'numeric', placeholder: 'Type the missing top number',
          traps: [T(String(a + bm - b), 'You added ' + (bm - b) + ' to the top. To keep the same amount you must multiply, not add.'), T(String(m), 'That is the number we multiplied by. Now use it on the top: ' + a + ' × ' + m + '.')],
          work: b + ' × ' + m + ' = ' + bm + ', so ' + a + ' × ' + m + ' = ' + am + '.', plain: 'Whatever you do to the bottom, do to the top. The bottom got ' + m + ' times bigger, so the top does too.',
          teach: [
            x('The bottom went from ' + b + ' to ' + bm + '.', a + '/' + b + ' = ', ['?', 'missing'], '/' + bm),
            x(b + ' × ' + m + ' = ' + bm + '. The bottom was multiplied by ' + m + '.', b + ' × ', [String(m), 'multiplier'], ' = ' + bm),
            x('Do the same to the top. ' + a + ' × ' + m + ' = ' + am + '.', a + ' × ' + m + ' = ', [String(am), 'new top']),
            x('So the missing number is ' + am + '.', a + '/' + b + ' = ', [am + '/' + bm, 'answer'])
          ]
        });
      }
      if (v === 1) {
        return N({
          skill: 'Equivalent fractions', prompt: 'Fill in the missing bottom number: ' + a + '/' + b + ' = ' + am + '/?', answer: bm, keyboard: 'numeric', placeholder: 'Type the missing bottom number',
          traps: [T(String(b + am - a), 'You added to the bottom. Multiply instead. The top went up by a factor of ' + m + '.'), T(String(m), 'That is the multiplier. Use it on the bottom: ' + b + ' × ' + m + '.')],
          work: a + ' × ' + m + ' = ' + am + ', so ' + b + ' × ' + m + ' = ' + bm + '.', plain: 'Find what the top was multiplied by, then multiply the bottom by the same number.',
          teach: [
            x('The top went from ' + a + ' to ' + am + '.', a + '/' + b + ' = ' + am + '/', ['?', 'missing']),
            x(a + ' × ' + m + ' = ' + am + '. The top was multiplied by ' + m + '.', a + ' × ', [String(m), 'multiplier'], ' = ' + am),
            x('Do the same to the bottom. ' + b + ' × ' + m + ' = ' + bm + '.', b + ' × ' + m + ' = ', [String(bm), 'new bottom']),
            x('So the missing bottom number is ' + bm + '.', a + '/' + b + ' = ' + am + '/', [String(bm), 'answer'])
          ]
        });
      }
      if (v === 2) {
        return N({
          skill: 'Equivalent fractions', prompt: 'Fill in the missing top number: ' + am + '/' + bm + ' = ?/' + b, answer: a, keyboard: 'numeric', placeholder: 'Type the missing top number',
          traps: [T(String(am - (bm - b)), 'You took away from the top. Divide instead. The bottom was divided by ' + m + '.'), T(String(m), 'That is the number we divided by. Divide the top by it: ' + am + ' ÷ ' + m + '.')],
          work: bm + ' ÷ ' + m + ' = ' + b + ', so ' + am + ' ÷ ' + m + ' = ' + a + '.', plain: 'The bottom got smaller by dividing. Divide the top by the same number.',
          teach: [
            x('The bottom went from ' + bm + ' down to ' + b + '.', am + '/' + bm + ' = ', ['?', 'missing'], '/' + b),
            x(bm + ' ÷ ' + m + ' = ' + b + '. The bottom was divided by ' + m + '.', bm + ' ÷ ', [String(m), 'divider'], ' = ' + b),
            x('Do the same to the top. ' + am + ' ÷ ' + m + ' = ' + a + '.', am + ' ÷ ' + m + ' = ', [String(a), 'new top']),
            x('So the missing number is ' + a + '.', am + '/' + bm + ' = ', [a + '/' + b, 'answer'])
          ]
        });
      }
      var pieces = R.pick([['pizza', 'slices'], ['chocolate bar', 'squares'], ['pan of brownies', 'pieces']]);
      return N({
        skill: 'Equivalent fractions', prompt: 'A ' + pieces[0] + ' is cut into ' + b + ' equal ' + pieces[1] + ' and ' + a + ' of them are eaten. If the same ' + pieces[0] + ' was cut into ' + bm + ' equal ' + pieces[1] + ', how many would be eaten to be the same amount?', answer: am, keyboard: 'numeric', placeholder: 'Type a whole number',
        traps: [T(String(a + bm - b), 'You added instead of multiplying. Each old piece is cut into ' + m + ' smaller pieces.'), T(String(a), 'That is the count with the bigger pieces. With smaller pieces you need more.')],
        work: a + '/' + b + ' = ' + am + '/' + bm + ' because each old piece is cut into ' + m + ' smaller pieces.', plain: 'Each big piece turns into ' + m + ' small pieces, so ' + a + ' big pieces make ' + a + ' × ' + m + ' small pieces.',
        teach: [
          bars('The ' + pieces[0] + ' cut into ' + b + ' pieces. ' + a + ' are eaten.', [fb('Big pieces', b, a, 'bg-indigo-400')]),
          x('Now every piece is cut into ' + m + ' smaller pieces. ' + b + ' × ' + m + ' = ' + bm + ' pieces in all.', b + ' × ' + m + ' = ', [String(bm), 'new bottom']),
          x('Each eaten piece becomes ' + m + ' small pieces. ' + a + ' × ' + m + ' = ' + am + '.', a + ' × ' + m + ' = ', [String(am), 'new top']),
          x('So ' + am + ' of the ' + bm + ' pieces are eaten.', a + '/' + b + ' = ', [am + '/' + bm, 'same amount'])
        ]
      });
    } },

    { id: 'simplest', level: 2, name: 'Simplest form', make: function () {
      var ab, g, n, d;
      do { ab = coprime(2, 9); g = R.int(2, 7); n = ab[0] * g; d = ab[1] * g; } while (d > 40);
      var a = ab[0], b = ab[1];
      var p = R.pick([
        'Write ' + n + '/' + d + ' in simplest form.', 'Simplify ' + n + '/' + d + '.',
        'A hockey team won ' + n + ' of its ' + d + ' games. Write the fraction of games won in simplest form.',
        'Rinka finished ' + n + ' of the ' + d + ' questions. Write the fraction she finished in simplest form.'
      ]);
      return N({
        skill: 'Simplify a fraction', prompt: p, answer: a + '/' + b, simplest: true, placeholder: 'Like 2/3',
        traps: [],
        work: 'Divide the top and the bottom by ' + g + ': ' + n + ' ÷ ' + g + ' = ' + a + ' and ' + d + ' ÷ ' + g + ' = ' + b + '.',
        plain: 'Find the biggest number that goes into both numbers. Divide both by it.',
        teach: [
          x('We look for a number that goes into both ' + n + ' and ' + d + '.', [n + '/' + d, 'simplify']),
          note(g + ' goes into ' + n + ' and it goes into ' + d + '.', 'A number that fits both', [g + ' × ' + a + ' = ' + n, g + ' × ' + b + ' = ' + d]),
          x('Divide the top: ' + n + ' ÷ ' + g + ' = ' + a + '.', n + ' ÷ ' + g + ' = ', [String(a), 'new top']),
          x('Divide the bottom: ' + d + ' ÷ ' + g + ' = ' + b + '.', d + ' ÷ ' + g + ' = ', [String(b), 'new bottom']),
          x('Only 1 goes into both ' + a + ' and ' + b + '. So we are done.', n + '/' + d + ' = ', [a + '/' + b, 'simplest'])
        ]
      });
    } },

    { id: 'cmpbench', level: 3, name: 'Compare using the benchmark 1/2', make: function () {
      var d1 = R.int(3, 12), d2 = R.int(3, 12), n1, n2, k;
      do { n1 = R.int(1, d1 - 1); } while (2 * n1 >= d1);
      do { n2 = R.int(1, d2 - 1); } while (2 * n2 <= d2);
      var f1 = n1 + '/' + d1, f2 = n2 + '/' + d2;
      var flip = R.int(0, 1), askMore = R.int(0, 1);
      var first = flip ? f2 : f1, second = flip ? f1 : f2;
      var target = askMore ? f2 : f1, other = askMore ? f1 : f2;
      var word = askMore ? 'greater' : 'less';
      return Q.choice({
        skill: 'Compare with a benchmark', prompt: 'Use the benchmark 1/2 to decide. Which fraction is ' + word + ', ' + first + ' or ' + second + '?',
        options: [
          { text: target, ok: true },
          { text: other, ok: false, trap: 'Check each against 1/2. ' + f1 + ' is less than 1/2 and ' + f2 + ' is more than 1/2.' },
          { text: 'They are equal', ok: false, trap: 'They are not equal. One is below 1/2 and the other is above 1/2.' }
        ],
        work: f1 + ' is less than 1/2 because 2 × ' + n1 + ' = ' + (2 * n1) + ' is less than ' + d1 + '. ' + f2 + ' is more than 1/2 because 2 × ' + n2 + ' = ' + (2 * n2) + ' is more than ' + d2 + '.',
        plain: 'A fraction below 1/2 is always smaller than a fraction above 1/2.',
        teach: [
          x('We compare ' + f1 + ' and ' + f2 + ' using 1/2 as a benchmark.', [f1, 'compare'], ' or ', [f2, 'compare']),
          HALF_TEACH(n1, d1),
          x('So ' + f1 + ' is below 1/2.', [f1, 'less than 1/2']),
          HALF_TEACH(n2, d2),
          x('So ' + f2 + ' is above 1/2.', [f2, 'more than 1/2']),
          x('Below 1/2 is smaller than above 1/2. ' + f2 + ' is greater and ' + f1 + ' is less. The ' + word + ' one is ' + target + '.', [target, word])
        ]
      });
    } },

    { id: 'cmpcommon', level: 3, name: 'Compare with a common denominator', make: function () {
      var pairs = [[3, 4, 5, 8], [2, 3, 5, 8], [3, 5, 7, 10], [1, 2, 3, 8], [5, 6, 7, 9], [2, 5, 3, 8], [3, 4, 7, 10], [4, 5, 5, 6], [2, 3, 3, 4], [5, 6, 3, 4], [7, 12, 3, 5], [3, 8, 2, 5], [5, 8, 3, 4], [4, 9, 1, 2]];
      var p = R.pick(pairs), n1 = p[0], d1 = p[1], n2 = p[2], d2 = p[3];
      if (n1 * d2 === n2 * d1) { n1 = 1; d1 = 2; n2 = 3; d2 = 5; }
      var l = R.lcm(d1, d2), a = n1 * (l / d1), b = n2 * (l / d2);
      var f1 = n1 + '/' + d1, f2 = n2 + '/' + d2;
      var askMore = R.int(0, 1), word = askMore ? 'greater' : 'less';
      var target = (a > b) === !!askMore ? f1 : f2, other = target === f1 ? f2 : f1;
      var swap = R.int(0, 1);
      var first = swap ? f2 : f1, second = swap ? f1 : f2;
      return Q.choice({
        skill: 'Compare fractions', prompt: 'Which fraction is ' + word + ', ' + first + ' or ' + second + '?',
        options: [
          { text: target, ok: true },
          { text: other, ok: false, trap: 'Change both to the same bottom number, ' + l + ', then compare the tops.' },
          { text: 'They are equal', ok: false, trap: 'They are not the same amount. Change both to bottom number ' + l + ' and compare.' }
        ],
        work: f1 + ' = ' + a + '/' + l + ' and ' + f2 + ' = ' + b + '/' + l + '. ' + Math.max(a, b) + ' is more than ' + Math.min(a, b) + '.',
        plain: 'When the pieces are the same size, the fraction with more pieces is bigger.',
        teach: [
          x('We compare ' + f1 + ' and ' + f2 + '. The pieces are different sizes, so we match the bottoms.', [f1, 'compare'], ' or ', [f2, 'compare']),
          x('A bottom number that both ' + d1 + ' and ' + d2 + ' go into is ' + l + '.', 'Common bottom: ', [String(l), 'common denominator']),
          x(f1 + ' becomes ' + a + '/' + l + '. Multiply top and bottom by ' + (l / d1) + '.', f1 + ' = ', [a + '/' + l, '× ' + (l / d1)]),
          x(f2 + ' becomes ' + b + '/' + l + '. Multiply top and bottom by ' + (l / d2) + '.', f2 + ' = ', [b + '/' + l, '× ' + (l / d2)]),
          x('Same size pieces. ' + Math.max(a, b) + ' is more than ' + Math.min(a, b) + '. The ' + word + ' fraction is ' + target + '.', [target, word])
        ]
      });
    } },

    { id: 'fracdec', level: 3, name: 'Fractions and decimals', make: function () {
      var items = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [9, 10], [1, 20], [3, 20]];
      var it = R.pick(items), n = it[0], d = it[1], h = n * 100 / d, dt = dtext(h), f = n + '/' + d;
      var v = R.int(0, 3);
      var mul = 100 / d;
      var makeH = [
        x('The bottom is ' + d + '. We want a bottom of 100. ' + d + ' × ' + mul + ' = 100.', d + ' × ', [String(mul), 'multiplier'], ' = 100'),
        x('Multiply the top by ' + mul + ' too. ' + n + ' × ' + mul + ' = ' + h + '.', n + ' × ' + mul + ' = ', [String(h), 'new top']),
        x(f + ' is the same as ' + h + '/100.', f + ' = ', [h + '/100', 'hundredths'])
      ];
      if (v === 0 || v === 1) {
        var p = v === 0 ? 'Write ' + f + ' as a decimal.' : R.pick(['What is ' + f + ' as a decimal number?', 'A jug is ' + f + ' full. Write that fraction as a decimal.']);
        return N({
          skill: 'Fraction to decimal', prompt: p, answer: dt, placeholder: 'Type a decimal like 0.5',
          traps: [T((n + '.' + d), 'You put the top and bottom next to each other. A decimal comes from making the bottom 10 or 100.'), T('0.' + n + d, 'The digits of a fraction do not go straight into a decimal. Make the bottom 100 first.')],
          work: f + ' = ' + h + '/100 = ' + dt + '.', plain: 'Make the bottom 100. Then ' + h + ' hundredths is written ' + dt + '.',
          teach: makeH.concat([x(h + ' hundredths is written as a decimal ' + dt + '.', h + '/100 = ', [dt, 'decimal'])])
        });
      }
      if (v === 2) {
        return N({
          skill: 'Fraction to decimal', prompt: 'Fill in the missing top number: ' + f + ' = ?/100', answer: h, keyboard: 'numeric', placeholder: 'Type a whole number',
          traps: [T(String(n * 10), 'Check the bottom. ' + d + ' times ' + mul + ' is 100, so multiply the top by ' + mul + ', not by 10.')],
          work: d + ' × ' + mul + ' = 100, so ' + n + ' × ' + mul + ' = ' + h + '.', plain: 'Whatever the bottom was multiplied by to get 100, multiply the top by the same number.',
          teach: makeH.concat([x('So the missing top number is ' + h + '.', f + ' = ', [h + '/100', 'answer'])])
        });
      }
      return N({
        skill: 'Decimal to fraction', prompt: 'Write ' + dt + ' as a fraction in simplest form.', answer: R.fr(h, 100), simplest: true, placeholder: 'Like 3/5',
        traps: [],
        work: dt + ' = ' + h + '/100. Divide top and bottom by ' + R.gcd(h, 100) + ' to get ' + R.fr(h, 100) + '.', plain: 'Say the decimal as hundredths, then simplify the fraction.',
        teach: [
          x('Read the decimal as hundredths. ' + dt + ' is ' + h + ' hundredths.', dt + ' = ', [h + '/100', 'hundredths']),
          x('Now simplify. Find a number that goes into both ' + h + ' and 100. The biggest is ' + R.gcd(h, 100) + '.', [h + '/100', 'simplify']),
          x(h + ' ÷ ' + R.gcd(h, 100) + ' = ' + (h / R.gcd(h, 100)) + ' and 100 ÷ ' + R.gcd(h, 100) + ' = ' + (100 / R.gcd(h, 100)) + '.', h + '/100 = ', [R.fr(h, 100), 'simplest']),
          x('So ' + dt + ' is the same as ' + R.fr(h, 100) + '.', dt + ' = ', [R.fr(h, 100), 'answer'])
        ]
      });
    } },

    { id: 'order', level: 4, name: 'Order fractions', make: function () {
      var fams = [[2, 4, 8], [2, 3, 6], [3, 4, 12], [2, 5, 10], [4, 6, 12], [3, 6, 12]];
      var fam = R.pick(fams), L = Math.max.apply(null, fam);
      var ks = [];
      while (ks.length < 3) { var k = R.int(1, L - 1); if (ks.indexOf(k) < 0) ks.push(k); }
      var items = ks.map(function (k) {
        var ds = fam.filter(function (dd) { return (k * dd) % L === 0; });
        var dd = R.pick(ds);
        return { k: k, n: k * dd / L, d: dd };
      });
      var asc = items.slice().sort(function (p, q) { return p.k - q.k; });
      var txt = function (a) { return a.map(function (i) { return i.n + '/' + i.d; }).join(', '); };
      var shown = R.shuffle(items);
      var desc = asc.slice().reverse();
      var byTop = items.slice().sort(function (p, q) { return p.n - q.n; });
      var opts = [{ text: txt(asc), ok: true }], have = {};
      have[txt(asc)] = 1;
      var addWrong = function (arr, why) { var t = txt(arr); if (!have[t]) { have[t] = 1; opts.push({ text: t, ok: false, trap: why }); } };
      addWrong(desc, 'That is greatest to least. The question wants least to greatest.');
      addWrong(byTop, 'You ordered by the top numbers only. The bottoms are different, so the pieces are different sizes.');
      addWrong(shown, 'That is the order they were given in. Match the bottoms and order again.');
      addWrong([asc[1], asc[0], asc[2]], 'Two of these are swapped. Change all to ' + L + 'ths and check.');
      addWrong([asc[0], asc[2], asc[1]], 'Two of these are swapped. Change all to ' + L + 'ths and check.');
      opts = opts.slice(0, 4);
      var conv = items.map(function (i) { return i.n + '/' + i.d + ' = ' + i.k + '/' + L; }).join(',  ');
      return Q.choice({
        skill: 'Order fractions', prompt: 'Which list puts these fractions in order from least to greatest? ' + txt(shown), options: opts,
        work: 'In ' + L + 'ths: ' + conv + '. In order: ' + asc.map(function (i) { return i.k + '/' + L; }).join(', ') + ', which is ' + txt(asc) + '.',
        plain: 'Give every fraction the same bottom number, then order the tops.',
        teach: [
          x('The bottoms are ' + fam.join(', ') + '. All of them go into ' + L + ', so we use ' + L + 'ths.', 'Common bottom: ', [String(L), 'common denominator']),
          note('Change every fraction to ' + L + 'ths.', 'Same bottom', items.map(function (i) { return i.n + '/' + i.d + ' = ' + i.k + '/' + L; })),
          lines('Put them on a number line in ' + L + 'ths.', nl(L, 1, L > 8 ? 3 : 4), 99),
          x('Order the tops from least to greatest: ' + asc.map(function (i) { return i.k; }).join(', ') + '.', asc.map(function (i) { return i.k + '/' + L; }).join(' < ')),
          x('Change back to the fractions we were given. The order is ' + txt(asc) + '.', [txt(asc), 'answer'])
        ]
      });
    } },

    { id: 'story', level: 4, name: 'Fraction comparison story', make: function () {
      var pairs = [[3, 4, 5, 8], [2, 3, 5, 8], [3, 5, 7, 10], [5, 6, 7, 9], [2, 5, 3, 8], [3, 4, 7, 10], [4, 5, 5, 6], [2, 3, 3, 4], [5, 6, 3, 4], [1, 3, 3, 8], [7, 8, 4, 5], [5, 12, 2, 5]];
      var p = R.pick(pairs), n1 = p[0], d1 = p[1], n2 = p[2], d2 = p[3];
      var l = R.lcm(d1, d2), a = n1 * (l / d1), b = n2 * (l / d2);
      var f1 = n1 + '/' + d1, f2 = n2 + '/' + d2;
      var ctx = R.pick([
        { A: 'Ava', Bn: 'Ben', more: 'Who ran farther?', less: 'Who ran a shorter distance?', s: function (A, Bn, fa, fb2) { return 'At the Terry Fox run, ' + A + ' ran ' + fa + ' of a kilometre and ' + Bn + ' ran ' + fb2 + ' of a kilometre.'; } },
        { A: 'Mia', Bn: 'Leo', more: 'Who ate more pizza?', less: 'Who ate less pizza?', s: function (A, Bn, fa, fb2) { return 'Two friends shared same size pizzas. ' + A + ' ate ' + fa + ' of a pizza and ' + Bn + ' ate ' + fb2 + ' of a pizza.'; } },
        { A: 'Jug A', Bn: 'Jug B', more: 'Which jug has more maple syrup?', less: 'Which jug has less maple syrup?', s: function (A, Bn, fa, fb2) { return 'Two jugs are the same size. ' + A + ' is ' + fa + ' full of maple syrup and ' + Bn + ' is ' + fb2 + ' full.'; } },
        { A: 'Nora', Bn: 'Sam', more: 'Who has read more of their book?', less: 'Who has read less of their book?', s: function (A, Bn, fa, fb2) { return 'Nora and Sam are reading books of the same length. ' + A + ' has read ' + fa + ' of hers and ' + Bn + ' has read ' + fb2 + ' of his.'; } }
      ]);
      var askMore = R.int(0, 1);
      var bigA = a > b;
      var right = (bigA === !!askMore) ? ctx.A : ctx.Bn, wrong = right === ctx.A ? ctx.Bn : ctx.A;
      var rf = right === ctx.A ? f1 : f2;
      var pr = ctx.s(ctx.A, ctx.Bn, f1, f2) + ' ' + (askMore ? ctx.more : ctx.less);
      return Q.choice({
        skill: 'Compare fractions in a story', prompt: pr,
        options: [
          { text: right, ok: true },
          { text: wrong, ok: false, trap: 'Change both fractions to the same bottom number, ' + l + ', and compare again. Also check whether the question asks for more or less.' },
          { text: 'They are equal', ok: false, trap: 'They are not the same amount. In ' + l + 'ths one is ' + a + '/' + l + ' and the other is ' + b + '/' + l + '.' }
        ],
        work: ctx.A + ' has ' + f1 + ' = ' + a + '/' + l + '. ' + ctx.Bn + ' has ' + f2 + ' = ' + b + '/' + l + '. ' + (askMore ? 'More' : 'Less') + ' is ' + right + '.',
        plain: 'Match the bottoms, compare the tops, then read the question again to see if it wants more or less.',
        teach: [
          x('Find the two fractions. ' + ctx.A + ' has ' + f1 + '. ' + ctx.Bn + ' has ' + f2 + '.', [f1, ctx.A], ' or ', [f2, ctx.Bn]),
          x('The bottoms are ' + d1 + ' and ' + d2 + '. Both go into ' + l + ', so use ' + l + 'ths.', 'Common bottom: ', [String(l), 'common denominator']),
          x(f1 + ' = ' + a + '/' + l + ' and ' + f2 + ' = ' + b + '/' + l + '.', f1 + ' = ', [a + '/' + l, '× ' + (l / d1)], '    ' + f2 + ' = ', [b + '/' + l, '× ' + (l / d2)]),
          bars('Same size pieces now. Compare the amounts.', [fb(ctx.A + ' ' + a + '/' + l, l, a, 'bg-indigo-400'), fb(ctx.Bn + ' ' + b + '/' + l, l, b, 'bg-emerald-400')]),
          x('The question asks for ' + (askMore ? 'more' : 'less') + '. That is ' + right + '.', [right, askMore ? 'more' : 'less'])
        ]
      });
    } },

    { id: 'mixed2imp', level: 4, name: 'Mixed number to improper fraction', make: function () {
      var w = R.int(1, 6), ab = coprime(3, 8), n = ab[0], d = ab[1], top = w * d + n;
      var v = R.int(0, 2);
      var teach = [
        x('Each whole holds ' + d + ' pieces of size 1/' + d + '. We have ' + w + (w === 1 ? ' whole.' : ' wholes.'), mixedText(w, n, d) + ' = ', [String(w), 'wholes'], ' and ', [n + '/' + d, 'extra']),
        bars(w + (w === 1 ? ' full bar' : ' full bars') + ' and one bar with ' + n + ' pieces shaded.', wholeRows(w, d).concat([fb('Extra', d, n, 'bg-emerald-400')])),
        x('Pieces in the wholes: ' + w + ' × ' + d + ' = ' + (w * d) + '.', w + ' × ' + d + ' = ', [String(w * d), 'pieces in the wholes']),
        x('Add the extra ' + n + ' pieces: ' + (w * d) + ' + ' + n + ' = ' + top + '.', (w * d) + ' + ' + n + ' = ', [String(top), 'pieces in all'])
      ];
      if (v === 2) {
        return N({
          skill: 'Mixed numbers to improper fractions', prompt: 'How many pieces of size 1/' + d + ' are in ' + mixedText(w, n, d) + '?', answer: top, keyboard: 'numeric', placeholder: 'Type a whole number',
          traps: [T(String(w + n), 'You added the whole number and the top. Each whole holds ' + d + ' pieces, so multiply the whole number by ' + d + ' first.'), T(String(w * d), 'That counts only the wholes. Add the extra ' + n + ' pieces too.')],
          work: w + ' × ' + d + ' + ' + n + ' = ' + top + '.', plain: 'Each whole is ' + d + ' pieces. Count the pieces in the wholes and add the extra pieces.',
          teach: teach.concat([x('So there are ' + top + ' pieces of size 1/' + d + '.', [String(top), 'answer'])])
        });
      }
      var p = v === 0 ? 'Write ' + mixedText(w, n, d) + ' as an improper fraction.' : 'A recipe needs ' + mixedText(w, n, d) + ' cups of flour. Write that amount as an improper fraction.';
      return N({
        skill: 'Mixed numbers to improper fractions', prompt: p, answer: top + '/' + d, placeholder: 'Like 11/4',
        traps: [T((w + n) + '/' + d, 'You added the whole number to the top. First multiply the whole number by the bottom.'), T((w * n) + '/' + d, 'You multiplied the whole number by the top. Multiply it by the bottom, then add the top.'), T(top + '/' + (2 * d), 'The bottom number stays the same. Only the top changes.')],
        work: w + ' × ' + d + ' = ' + (w * d) + ', plus ' + n + ' is ' + top + '. So ' + top + '/' + d + '.', plain: 'Whole times bottom, plus top, over the same bottom.',
        teach: teach.concat([x('Write it over the same bottom, ' + d + '.', mixedText(w, n, d) + ' = ', [top + '/' + d, 'improper fraction'])])
      });
    } },

    { id: 'imp2mixed', level: 4, name: 'Improper fraction to mixed number', make: function () {
      var w = R.int(1, 6), ab = coprime(3, 9), n = ab[0], d = ab[1], top = w * d + n;
      var v = R.int(0, 2);
      var base = [
        x('The top ' + top + ' counts pieces. Every ' + d + ' pieces make one whole.', top + '/' + d + ' means ', [String(top), 'pieces'], ' of size ', ['1/' + d, 'each']),
        x('Divide the top by the bottom. ' + top + ' ÷ ' + d + ' = ' + w + ' with ' + n + ' left over.', top + ' ÷ ' + d + ' = ', [w + ' r ' + n, 'wholes and leftover'])
      ];
      if (v === 0) {
        return N({
          skill: 'Improper fractions to mixed numbers', prompt: 'How many whole numbers are in ' + top + '/' + d + '?', answer: w, keyboard: 'numeric', placeholder: 'Type a whole number',
          traps: [T(String(w + 1), 'You rounded up. ' + top + '/' + d + ' does not quite reach ' + (w + 1) + '. It has ' + w + ' full wholes and some left over.'), T(String(n), 'That is the leftover pieces. The question asks for the full wholes.')],
          work: top + ' ÷ ' + d + ' = ' + w + ' remainder ' + n + '. So ' + w + ' wholes.', plain: 'Divide the top by the bottom. The whole number part of the answer is the count of full wholes.',
          teach: base.concat([groups(w + ' full groups of ' + d + ' pieces make ' + w + ' wholes.', w, d, w, d + ' pieces = 1 whole'), x('So there are ' + w + ' whole numbers.', [String(w), 'answer'])])
        });
      }
      if (v === 1) {
        return N({
          skill: 'Improper fractions to mixed numbers', prompt: top + '/' + d + ' = ' + w + ' and ?/' + d + '. What is the missing top number?', answer: n, keyboard: 'numeric', placeholder: 'Type a whole number',
          traps: [T(String(w), 'That is the whole number part. The question asks for the leftover pieces.'), T(String(top - d), 'You took away only one whole. Take away all ' + w + ' wholes, which is ' + (w * d) + ' pieces.')],
          work: top + ' − ' + (w * d) + ' = ' + n + '. So the missing number is ' + n + '.', plain: 'Take away the pieces used in the whole numbers. What is left is the top of the fraction.',
          teach: base.concat([x('The ' + w + ' wholes use ' + w + ' × ' + d + ' = ' + (w * d) + ' pieces. ' + top + ' − ' + (w * d) + ' = ' + n + '.', top + ' − ' + (w * d) + ' = ', [String(n), 'leftover pieces']), x('So ' + top + '/' + d + ' = ' + mixedText(w, n, d) + '.', top + '/' + d + ' = ', [mixedText(w, n, d), 'answer'])])
        });
      }
      return N({
        skill: 'Improper fractions to mixed numbers', prompt: 'Rinka has ' + top + ' pieces, and every ' + d + ' pieces make one whole pie. She writes the total as ' + top + '/' + d + '. How many whole pies can she make?', answer: w, keyboard: 'numeric', placeholder: 'Type a whole number',
        traps: [T(String(w + 1), 'That would need ' + ((w + 1) * d) + ' pieces, but she has only ' + top + '.'), T(String(n), 'That is the number of pieces left over, not the number of whole pies.')],
        work: top + ' ÷ ' + d + ' = ' + w + ' remainder ' + n + '. She can make ' + w + ' whole pies.', plain: 'Count how many groups of ' + d + ' fit into ' + top + '.',
        teach: base.concat([groups(w + ' groups of ' + d + ' pieces. Each group is one whole pie.', w, d, w, d + ' pieces = 1 pie'), x('She can make ' + w + ' whole pies and has ' + n + ' pieces left.', [String(w), 'whole pies'])])
      });
    } },

    { id: 'nlmixed', level: 5, name: 'Fractions bigger than 1 on a number line', make: function () {
      var d = R.pick([2, 3, 4, 5]), to = R.int(2, 3), w, n, top;
      do { w = R.int(1, to - 1); n = R.int(1, d - 1); top = w * d + n; } while (R.gcd(top, d) > 1);
      var v = R.int(0, 2);
      var cw = Math.min(6, Math.max(3, Math.floor(46 / (d * to))));
      var ln = lines('A number line from 0 to ' + to + '. Each whole is cut into ' + d + ' parts. Count ' + top + ' jumps from 0.', nl(d, to, cw, { all: cw >= 5 && d <= 4, mark: top, markLabel: '?' }), 2);
      var steps = [
        ln,
        x('Each jump is 1/' + d + '. ' + d + ' jumps make one whole.', ['1/' + d, 'one jump'], ' × ' + d + ' = 1'),
        x(top + ' ÷ ' + d + ' = ' + w + ' with ' + n + ' left over. So we pass ' + w + (w === 1 ? ' whole' : ' wholes') + ' and take ' + n + (n === 1 ? ' more jump.' : ' more jumps.'), top + ' ÷ ' + d + ' = ', [w + ' r ' + n, 'wholes and leftover'])
      ];
      if (v === 0) {
        return N({
          skill: 'Improper fractions on a number line', prompt: 'A number line goes from 0 to ' + to + '. Each whole is cut into ' + d + ' equal parts. A dot is ' + top + ' parts to the right of 0. Write the dot\'s position as an improper fraction.', answer: top + '/' + d, placeholder: 'Like 7/4',
          traps: [T(w + '/' + d, 'You used the whole number as the top. Count all ' + top + ' jumps from 0. The top number is ' + top + '.'), T(n + '/' + d, 'That is only the jumps after the last whole. Count every jump from 0.')],
          work: top + ' jumps of size 1/' + d + ' is ' + top + '/' + d + '.', plain: 'Count every jump from 0. The bottom is ' + d + ' because each jump is 1/' + d + '.',
          teach: steps.concat([x('The dot is at ' + top + '/' + d + '.', [top + '/' + d, 'answer'])])
        });
      }
      if (v === 1) {
        return N({
          skill: 'Improper fractions on a number line', prompt: 'The fraction ' + top + '/' + d + ' is between two whole numbers on a number line. What is the bigger of those two whole numbers?', answer: w + 1, keyboard: 'numeric', placeholder: 'Type a whole number',
          traps: [T(String(w), 'That is the smaller whole number. The question asks for the bigger one.')],
          work: top + ' ÷ ' + d + ' = ' + w + ' remainder ' + n + '. So it is between ' + w + ' and ' + (w + 1) + '.', plain: 'Find how many whole numbers fit. The fraction is past that whole and before the next one.',
          teach: steps.concat([x(top + '/' + d + ' is past ' + w + ' and not yet ' + (w + 1) + '. The bigger whole number is ' + (w + 1) + '.', [w + ' < ' + top + '/' + d + ' < ' + (w + 1), 'between'])])
        });
      }
      return N({
        skill: 'Improper fractions on a number line', prompt: 'How many jumps of size 1/' + d + ' does it take to get from 0 to ' + mixedText(w, n, d) + '?', answer: top, keyboard: 'numeric', placeholder: 'Type a whole number',
        traps: [T(String(w + n), 'You added the whole number and the top. Each whole is ' + d + ' jumps, so ' + w + ' wholes is ' + (w * d) + ' jumps.'), T(String(w * d), 'That is the jumps to reach ' + w + '. Add the ' + n + ' extra jumps.')],
        work: w + ' × ' + d + ' = ' + (w * d) + ' jumps, plus ' + n + ' more is ' + top + '.', plain: 'Each whole is ' + d + ' jumps. Count the jumps in the wholes and add the extra jumps.',
        teach: steps.concat([x(w + ' wholes is ' + w + ' × ' + d + ' = ' + (w * d) + ' jumps. Add ' + n + ' more.', (w * d) + ' + ' + n + ' = ', [String(top), 'jumps'])])
      });
    } },

    { id: 'cmpfd', level: 5, name: 'Compare a fraction and a decimal', make: function () {
      var items = [[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [9, 10]];
      var it = R.pick(items), n = it[0], d = it[1], h = n * 100 / d, f = n + '/' + d;
      var eq = R.int(0, 3) === 0, delta, hd;
      if (eq) hd = h; else { do { delta = R.int(-15, 15); hd = h + delta; } while (delta === 0 || hd < 1 || hd > 99); }
      var dt = dtext(hd);
      var bigF = h > hd, right = eq ? 'They are equal' : (bigF ? f : dt);
      var swap = R.int(0, 1);
      var first = swap ? dt : f, second = swap ? f : dt;
      var opts = [{ text: f, ok: !eq && bigF }, { text: dt, ok: !eq && !bigF }, { text: 'They are equal', ok: eq }];
      var say = 'Change ' + f + ' to a decimal. ' + f + ' = ' + dtext(h) + '. Then compare ' + dtext(h) + ' and ' + dt + ' place by place.';
      opts.forEach(function (o) { if (!o.ok) o.trap = say; });
      return Q.choice({
        skill: 'Compare fractions and decimals', prompt: 'Which is greater, ' + first + ' or ' + second + '?', options: opts,
        work: f + ' = ' + h + '/100 = ' + dtext(h) + '. Compare ' + dtext(h) + ' with ' + dt + '. ' + (eq ? 'They are the same.' : (bigF ? dtext(h) + ' is greater.' : dt + ' is greater.')),
        plain: 'Turn the fraction into a decimal. Then compare the two decimals digit by digit, starting with the tenths.',
        teach: [
          x('One number is a fraction and the other is a decimal. Turn the fraction into a decimal.', [f, 'fraction'], ' and ', [dt, 'decimal']),
          x(f + ' becomes hundredths: ' + h + '/100.', f + ' = ', [h + '/100', 'hundredths']),
          x(h + '/100 is the decimal ' + dtext(h) + '.', h + '/100 = ', [dtext(h), 'decimal']),
          x('Now compare ' + dtext(h) + ' with ' + dt + '. Line up the places and compare from the left. Write both with two decimal places: ' + (h / 100).toFixed(2) + ' and ' + (hd / 100).toFixed(2) + '.', (h / 100).toFixed(2), eq ? ' = ' : (bigF ? ' > ' : ' < '), (hd / 100).toFixed(2)),
          x(eq ? 'They are equal.' : ('The greater one is ' + (bigF ? f : dt) + '.'), [right, 'answer'])
        ]
      });
    } },

    { id: 'chal', level: 6, name: 'Equivalent fraction puzzle', make: function () {
      var ab = coprime(2, 9), a = ab[0], b = ab[1], k = R.int(2, 9);
      var v = R.int(0, 2);
      if (v === 0) {
        var S1 = (a + b) * k;
        return N({
          skill: 'Equivalent fraction puzzle', prompt: 'A fraction equals ' + a + '/' + b + '. The top number and the bottom number add up to ' + S1 + '. What is the top number?', answer: a * k, keyboard: 'numeric', placeholder: 'Type a whole number',
          traps: [T(String(b * k), 'That is the bottom number. The question asks for the top.'), T(String(k), 'That is the size of one small box. The top number has ' + a + ' boxes.')],
          work: (a + b) + ' boxes = ' + S1 + ', so one box is ' + k + '. Top = ' + a + ' × ' + k + ' = ' + (a * k) + '.', plain: 'Draw ' + a + ' boxes for the top and ' + b + ' boxes for the bottom. They are all the same size.',
          teach: [
            bars('The fraction is ' + a + '/' + b + '. Draw ' + a + ' equal boxes for the top and ' + b + ' equal boxes for the bottom.', [row('Top', a, 'bg-indigo-400'), row('Bottom', b, 'bg-emerald-400')]),
            x('Together there are ' + a + ' + ' + b + ' = ' + (a + b) + ' boxes. They add up to ' + S1 + '.', (a + b) + ' boxes = ', [String(S1), 'total']),
            x('One box is ' + S1 + ' ÷ ' + (a + b) + ' = ' + k + '.', S1 + ' ÷ ' + (a + b) + ' = ', [String(k), 'one box']),
            bars('Every box is ' + k + '.', [row('Top', a, 'bg-indigo-400', k, String(a * k)), row('Bottom', b, 'bg-emerald-400', k, String(b * k))]),
            x('The top is ' + a + ' × ' + k + ' = ' + (a * k) + '. The bottom is ' + b + ' × ' + k + ' = ' + (b * k) + '.', [(a * k) + '/' + (b * k), 'answer'])
          ]
        });
      }
      if (v === 1) {
        var D = (b - a) * k;
        return N({
          skill: 'Equivalent fraction puzzle', prompt: 'A fraction equals ' + a + '/' + b + '. The bottom number is ' + D + ' more than the top number. What is the bottom number?', answer: b * k, keyboard: 'numeric', placeholder: 'Type a whole number',
          traps: [T(String(a * k), 'That is the top number. The question asks for the bottom.'), T(String(D), 'That is only the difference. The bottom has ' + b + ' boxes.')],
          work: (b - a) + ' boxes = ' + D + ', so one box is ' + k + '. Bottom = ' + b + ' × ' + k + ' = ' + (b * k) + '.', plain: 'The bottom is longer than the top by ' + (b - a) + ' boxes. That difference is ' + D + '.',
          teach: [
            bars('The fraction is ' + a + '/' + b + '. Draw ' + a + ' boxes for the top and ' + b + ' boxes for the bottom.', [row('Top', a, 'bg-indigo-400'), row('Bottom', b, 'bg-emerald-400')]),
            x('The bottom has ' + b + ' − ' + a + ' = ' + (b - a) + ' more boxes. That extra is ' + D + '.', (b - a) + ' boxes = ', [String(D), 'difference']),
            x('One box is ' + D + ' ÷ ' + (b - a) + ' = ' + k + '.', D + ' ÷ ' + (b - a) + ' = ', [String(k), 'one box']),
            bars('Every box is ' + k + '.', [row('Top', a, 'bg-indigo-400', k, String(a * k)), row('Bottom', b, 'bg-emerald-400', k, String(b * k))]),
            x('The bottom is ' + b + ' × ' + k + ' = ' + (b * k) + '.', [String(b * k), 'answer'])
          ]
        });
      }
      var pieceC = R.pick(['hockey cards', 'stickers', 'marbles']);
      var whole = b * k;
      return N({
        skill: 'Equivalent fraction puzzle', prompt: 'Sam has ' + whole + ' ' + pieceC + ' and ' + (a * k) + ' of them are rare. Another set has ' + b + ' ' + pieceC + ' with the same fraction of rare ones. How many rare ones are in the set of ' + b + '?', answer: a, keyboard: 'numeric', placeholder: 'Type a whole number',
        traps: [T(String(a * k), 'That is the count in the bigger set of ' + whole + '. Divide to find the count in the smaller set.')],
        work: (a * k) + '/' + whole + ' = ' + a + '/' + b + '. A set of ' + b + ' has ' + a + ' rare ones.', plain: 'Simplify the fraction. The top of the simplest form is the count for the smaller set.',
        teach: [
          x('Sam\'s fraction of rare ones is ' + (a * k) + '/' + whole + '. Simplify it by dividing top and bottom by ' + k + '.', [(a * k) + '/' + whole, 'simplify']),
          x((a * k) + ' ÷ ' + k + ' = ' + a + '. ' + whole + ' ÷ ' + k + ' = ' + b + '.', (a * k) + '/' + whole + ' = ', [a + '/' + b, '÷ ' + k + ' on both']),
          x('The bottom ' + b + ' matches the set of ' + b + '. So the top ' + a + ' is the count of rare ones.', [String(a), 'answer']),
          x('Check: ' + a + '/' + b + ' of ' + b + ' is ' + a + '. It fits.', a + '/' + b + ' × ' + b + ' = ', [String(a), 'rare ones'])
        ]
      });
    } },

    { id: 'nlmid', level: 6, name: 'Halfway between two fractions', make: function () {
      var d = R.pick([4, 6, 8, 10, 12]), a, b, mid;
      do { a = R.int(0, d - 2); b = R.int(a + 2, d); } while ((b - a) % 2 !== 0);
      mid = (a + b) / 2;
      var fa = a === 0 ? '0' : a + '/' + d, fbs = b === d ? '1' : b + '/' + d;
      var pf = R.pick([
        'On a number line, what fraction is exactly halfway between ' + fa + ' and ' + fbs + '? Write it in simplest form.',
        'Point A is at ' + fa + ' and point B is at ' + fbs + ' on a number line. Point C is exactly in the middle of A and B. Where is C? Write it in simplest form.'
      ]);
      var half = (b - a) / 2;
      return N({
        skill: 'Halfway between fractions', prompt: pf, answer: R.fr(mid, d), simplest: true, placeholder: 'Like 1/2',
        traps: [T(R.fr(half, d), 'That is the size of the half gap. Add it to the start, ' + fa + ', to find the middle.'), T(R.fr(a + b, d), 'You added the two tops but did not halve. The middle is half of the sum.')],
        work: 'In ' + d + 'ths, the gap is ' + (b - a) + ' parts. Half of it is ' + half + '. ' + a + ' + ' + half + ' = ' + mid + '. So ' + mid + '/' + d + (R.gcd(mid, d) > 1 ? ' = ' + R.fr(mid, d) : '') + '.',
        plain: 'Count the parts between the two points. Go half of that number of parts from the first point.',
        teach: [
          lines('Both points are in ' + d + 'ths. The gap between them is ' + (b - a) + ' parts.', ['Point A: ' + a + '/' + d, 'Point B: ' + b + '/' + d, 'Gap: ' + b + ' − ' + a + ' = ' + (b - a) + ' parts'], 99),
          x('Half of the gap is ' + (b - a) + ' ÷ 2 = ' + half + ' parts.', (b - a) + ' ÷ 2 = ', [String(half), 'half the gap']),
          x('Start at A and go ' + half + ' parts. ' + a + ' + ' + half + ' = ' + mid + '.', a + ' + ' + half + ' = ', [String(mid), 'middle top']),
          x('The middle is ' + mid + '/' + d + '.', [mid + '/' + d, 'point C']),
          R.gcd(mid, d) > 1 ? x('Simplify. Divide top and bottom by ' + R.gcd(mid, d) + '.', mid + '/' + d + ' = ', [R.fr(mid, d), 'simplest']) : x('It is already in simplest form.', [mid + '/' + d, 'answer'])
        ]
      });
    } }
  ]);
})();
