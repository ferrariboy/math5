/* Module 19: Chance and Probability. Lessons, vocabulary and question skills. */
(function () {
  'use strict';
  var B = window.Bank, R = B.R, S = B.s, Q = B.q, T = Q.trap;
  var x = S.x, note = S.note, bars = S.bars, fb = S.fb, row = S.row, groups = S.groups, lines = S.lines;

  /* ---------- Helpers ---------- */
  function be(n) { return n === 1 ? 'is' : 'are'; }
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
  function pad(s, n) { s = String(s); while (s.length < n) s += ' '; return s; }
  function lpad(s, n) { s = String(s); while (s.length < n) s = ' ' + s; return s; }
  function frac(n, d) { return R.fr(n, d); }
  function simp(n, d) { return R.gcd(n, d) > 1 ? x('Simplify. Divide the top and the bottom by ' + R.gcd(n, d) + '.', n + '/' + d + ' = ', [frac(n, d), 'simplest']) : x('It is already in simplest form.', [n + '/' + d, 'answer']); }
  var HOW = ['Impossible', 'Unlikely', 'Equally likely', 'Likely', 'Certain'];
  function word(k, n) { return k === 0 ? 'Impossible' : k === n ? 'Certain' : 2 * k === n ? 'Equally likely' : 2 * k < n ? 'Unlikely' : 'Likely'; }
  var COLS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
  var TAGCLS = ['bg-rose-400', 'bg-sky-400', 'bg-emerald-400', 'bg-amber-300', 'bg-violet-400', 'bg-orange-400'];
  /* A row of outcome cells with the favourable ones marked. */
  function markLines(outs, fav) {
    var a = 'Outcome ', b = 'Match   ';
    outs.forEach(function (o, i) { a += lpad(o, 3) + ' '; b += lpad(fav[i] ? 'yes' : 'no', 3) + ' '; });
    return [a, b];
  }
  /* Two set sample space. Rows are the first set. */
  function pairRows(A, Bs) {
    return A.map(function (a) { return Bs.map(function (b) { return a + b; }).join('  '); });
  }

  /* ---------- Vocabulary ---------- */
  window.MATH_VOCAB[19] = [
    { w: 'Probability', m: 'A number that tells how likely something is. We write it as a fraction from 0 to 1.' },
    { w: 'Outcome', m: 'One possible result. A coin has two outcomes: heads and tails.' },
    { w: 'Favourable outcome', m: 'An outcome that you want. If you want red, each red marble is a favourable outcome.' },
    { w: 'Sample space', m: 'The list of every possible outcome. For one coin it is heads and tails.' },
    { w: 'Equally likely', m: 'Every outcome has the same chance. A fair coin gives heads and tails equally.' },
    { w: 'Fair', m: 'A game is fair when every player has the same chance to win.' },
    { w: 'Prediction', m: 'A smart guess about what will happen, based on the probability.' },
    { w: 'Experiment', m: 'A test you actually do, like flipping a coin 20 times, to see what happens.' }
  ];

  /* ---------- Lessons ---------- */
  window.MATH_LESSONS[19] = [
    { title: '1. How likely is it?',
      explain: [
        'Chance is about how likely something is to happen. We use five words for it: impossible, unlikely, equally likely, likely and certain.',
        'Impossible means it can never happen. Certain means it will always happen. The other words sit in between.',
        'Think of a line from impossible on the left to certain on the right. Equally likely sits exactly in the middle.'
      ],
      rule: 'Impossible, unlikely, equally likely, likely, certain. From never to always.',
      mistake: 'Unlikely does not mean impossible. Unlikely things can still happen, just not often.',
      steps: [
        lines('Here is the chance line. It runs from never on the left to always on the right.', ['Impossible  Unlikely  Equally  Likely  Certain', 'never                               always'], 0),
        note('Some examples for each word.', 'Chance words', ['Impossible: a cat flies to the moon on its own', 'Unlikely: it snows in July in Vancouver', 'Likely: it rains in Vancouver in November', 'Certain: the sun rises tomorrow']),
        x('A fair coin lands on heads about half the time. That is in the middle.', ['Heads', 'equally likely']),
        x('A bag has 9 red marbles and 1 blue marble. Picking red is very often. It is likely.', ['Red', 'likely']),
        x('Picking blue from the same bag is not often. It is unlikely.', ['Blue', 'unlikely'])
      ] },

    { title: '2. Impossible and certain',
      explain: [
        'When an event can never happen, its probability is 0. When it always happens, its probability is 1.',
        'Every other probability sits between 0 and 1. It is never less than 0 and never more than 1.',
        'Example: a bag holds only blue marbles. Picking a blue is certain, so the probability is 1. Picking a red is impossible, so the probability is 0.'
      ],
      rule: 'Impossible is 0. Certain is 1. Everything else is a fraction in between.',
      mistake: 'A probability can never be bigger than 1. If you get 5/4, something went wrong.',
      steps: [
        bars('Here is a bag with 5 blue marbles. All 5 marbles are blue.', [row('Blue marbles', 5, 'bg-sky-400', '')]),
        x('Pick one. It must be blue. 5 favourable out of 5 possible.', ['5/5', 'all of them'], ' = ', ['1', 'certain']),
        x('Now ask for a red marble. There are 0 red marbles.', ['0/5', 'none'], ' = ', ['0', 'impossible']),
        lines('Put 0 and 1 on the line.', ['0                 1/2                 1', 'Impossible                        Certain'], 0),
        note('Every probability lives from 0 to 1.', 'Remember', ['0 means it can never happen', '1 means it always happens', 'Fractions in between are the rest'])
      ] },

    { title: '3. Outcomes and equally likely',
      explain: [
        'An outcome is one possible result of an experiment. When you flip a coin, the outcomes are heads and tails. That is 2 outcomes.',
        'When you roll a die, the outcomes are 1, 2, 3, 4, 5 and 6. That is 6 outcomes.',
        'If every outcome has the same chance, we call them equally likely. A fair coin and a fair die have equally likely outcomes.'
      ],
      rule: 'List every outcome. Count them. Fair objects give equally likely outcomes.',
      mistake: 'Do not skip an outcome. A die has six sides, so six outcomes, even if you only care about one.',
      steps: [
        lines('A coin has two outcomes.', ['Heads    Tails'], 0),
        lines('A die has six outcomes.', ['1   2   3   4   5   6'], 0),
        lines('A spinner with 4 equal sections has four outcomes.', ['Red   Blue   Green   Yellow'], 0),
        x('Each outcome on a fair object has the same chance. Coin: 1 out of 2. Die: 1 out of 6.', ['1/2', 'coin'], ' and ', ['1/6', 'die']),
        note('Count the outcomes first. It is always the bottom number.', 'Counting outcomes', ['Coin: 2', 'Die: 6', 'Spinner: number of sections'])
      ] },

    { title: '4. Probability as a fraction',
      explain: [
        'To find a probability, count the favourable outcomes. These are the ones you want. Then count all the possible outcomes.',
        'Write the favourable outcomes on the top and all the outcomes on the bottom. That fraction is the probability.',
        'Always simplify the fraction. If 2 out of 4 are favourable, the probability is 2/4, which simplifies to 1/2.'
      ],
      rule: 'Probability = favourable outcomes / all possible outcomes.',
      mistake: 'The bottom is all the outcomes, not just the ones that are not wanted. 3 red and 5 blue gives 3/8, not 3/5.',
      steps: [
        bars('A bag has 8 marbles. 3 are red and 5 are blue.', [fb('8 marbles', 8, 3, 'bg-rose-400', '')]),
        x('The outcomes we want are the red ones. There are 3.', ['3', 'favourable']),
        x('All the possible outcomes are all 8 marbles.', ['8', 'all outcomes']),
        x('Put favourable on top and all outcomes on the bottom. The probability of red is 3 out of 8.', 'P(red) = ', ['3/8', 'answer']),
        x('Now try blue. 5 marbles are blue out of 8.', 'P(blue) = ', ['5/8', 'answer']),
        x('Check. The two chances add to 1 whole. 3/8 + 5/8 = 8/8 = 1.', '3/8 + 5/8 = ', ['1', 'all outcomes'])
      ] },

    { title: '5. Rolling a die',
      explain: [
        'A fair die has six faces marked 1 to 6. Each face is equally likely, so there are 6 outcomes.',
        'To find the probability of an event, count how many faces fit the event. For an even number, the faces 2, 4 and 6 fit. That is 3 faces.',
        'The probability is 3 out of 6. Simplify to get 1/2.'
      ],
      rule: 'Count the faces that fit. Put that over 6. Then simplify.',
      mistake: 'Do not forget that 6 is even too. The even numbers are 2, 4 and 6.',
      steps: [
        lines('List all 6 outcomes. Mark the ones that are even.', markLines([1, 2, 3, 4, 5, 6], [false, true, false, true, false, true]), 0),
        x('Three faces are even. That is 2, 4 and 6.', ['3', 'favourable']),
        x('There are 6 faces in all.', ['6', 'all outcomes']),
        x('So the probability of an even number is 3 out of 6.', 'P(even) = ', ['3/6', 'before simplifying']),
        x('Divide the top and the bottom by 3.', '3/6 = ', ['1/2', 'simplest']),
        x('Try a number greater than 4. Only 5 and 6 fit. That is 2 out of 6, or 1/3.', 'P(greater than 4) = 2/6 = ', ['1/3', 'simplest'])
      ] },

    { title: '6. Spinners with equal sections',
      explain: [
        'A spinner is a circle cut into sections. If all the sections are the same size, each one is equally likely.',
        'Count how many sections there are in all. That is the bottom number.',
        'Count the sections of the colour you want. That is the top number.'
      ],
      rule: 'Sections of the colour you want, over all the sections.',
      mistake: 'The sections must be equal. If one section is bigger, the spinner lands there more often and the fraction rule does not work.',
      steps: [
        lines('A spinner has 8 equal sections. 2 are red, 3 are blue and 3 are green.', ['R  R  B  B  B  G  G  G'], 0),
        x('There are 8 sections in all.', ['8', 'all outcomes']),
        x('Two sections are red. The probability of red is 2 out of 8.', 'P(red) = ', ['2/8', 'before simplifying']),
        x('Simplify. Divide top and bottom by 2.', '2/8 = ', ['1/4', 'simplest']),
        x('Now blue. Three sections out of 8. It cannot be simplified.', 'P(blue) = ', ['3/8', 'simplest'])
      ] },

    { title: '7. Marble bags',
      explain: [
        'In a marble bag problem you pick one marble without looking. Each marble is equally likely to be picked.',
        'Add up all the marbles to get the total. Then count the marbles of the colour you want.',
        'You can also find the chance of NOT getting a colour. Count all the marbles that are not that colour.'
      ],
      rule: 'Total marbles on the bottom. The colour you want on top.',
      mistake: 'Do not compare red to blue only. The bottom must include every marble in the bag.',
      steps: [
        note('A bag has 4 red, 3 blue and 5 green marbles.', 'The bag', ['4 red', '3 blue', '5 green']),
        x('Find the total first. 4 + 3 + 5 = 12.', '4 + 3 + 5 = ', ['12', 'total marbles']),
        x('The chance of green is 5 out of 12.', 'P(green) = ', ['5/12', 'simplest']),
        x('The chance of red is 4 out of 12. Simplify.', 'P(red) = 4/12 = ', ['1/3', 'simplest']),
        x('What about not red? Blue and green are not red. 3 + 5 = 8 marbles. So 8 out of 12.', 'P(not red) = 8/12 = ', ['2/3', 'simplest'])
      ] },

    { title: '8. Sample space lists',
      explain: [
        'A sample space is the list of all possible outcomes. When you do two things at once, you write every pair.',
        'For two coins, the first coin can be H or T. The second can also be H or T. So the pairs are HH, HT, TH and TT.',
        'Make an organized list so you do not miss any. Then count the favourable pairs.'
      ],
      rule: 'List every pair in an organized way. Count the pairs you want. Divide by all the pairs.',
      mistake: 'HT and TH are different outcomes. The order matters, so list both.',
      steps: [
        lines('Flip two coins. Start with the first coin as H.', ['HH  HT'], 0),
        lines('Now the first coin as T.', ['HH  HT', 'TH  TT'], 1),
        x('There are 4 outcomes in all.', ['4', 'all outcomes']),
        x('How many have exactly one head? HT and TH. That is 2.', ['2', 'favourable']),
        x('The probability of exactly one head is 2 out of 4. Simplify.', 'P(one head) = 2/4 = ', ['1/2', 'simplest']),
        x('Two heads is only HH. That is 1 out of 4.', 'P(HH) = ', ['1/4', 'simplest'])
      ] },

    { title: '9. Fair and unfair',
      explain: [
        'A game is fair when every player has the same chance to win. If one player has a better chance, the game is unfair.',
        'To check, work out each player probability. If the two fractions are equal, the game is fair.',
        'Example: Amy wins on red and Ben wins on blue. If a spinner has 3 red sections and 3 blue sections, it is fair. If it has 3 red and 1 blue, it favours Amy.'
      ],
      rule: 'Compare each player chance. Equal chances make a fair game.',
      mistake: 'A game can look fair and be unfair. Count the sections or outcomes for each player.',
      steps: [
        lines('A spinner has 6 equal sections. Amy wins on red. Ben wins on blue.', ['R  R  R  B  B  G'], 0),
        x('Amy has 3 red sections out of 6.', 'Amy = ', ['3/6', 'half']),
        x('Ben has 2 blue sections out of 6.', 'Ben = ', ['2/6', 'a third']),
        x('3 is more than 2. Amy has a better chance. The game is not fair. It favours Amy.', ['3/6', 'Amy'], ' > ', ['2/6', 'Ben']),
        x('To make it fair, change one green section to blue. Now each player has 3 sections.', ['3/6', 'Amy'], ' = ', ['3/6', 'Ben'])
      ] },

    { title: '10. Predicting many tries',
      explain: [
        'If you know the probability, you can predict how many times something will happen in many tries.',
        'A coin has a probability of 1/2 for heads. If you flip it 20 times, you expect about half of 20 to be heads. That is 10.',
        'To predict, find the fraction of the number of tries. Divide by the bottom and multiply by the top.'
      ],
      rule: 'Expected number = probability × number of tries.',
      mistake: 'A prediction is what we expect, not what must happen. You might get 9 or 11 heads instead of 10.',
      steps: [
        x('A die is rolled 30 times. About how many sixes should we expect? The chance of a six is 1/6.', ['1/6', 'P(6)'], ' of ', ['30', 'tries']),
        groups('Cut the 30 tries into 6 equal groups. There are 5 in each group.', 6, 5, 0, '5 tries in each group'),
        groups('One group is the sixes. That is 1 out of 6 groups.', 6, 5, 1, '1 group of sixes'),
        x('Divide by the bottom. 30 ÷ 6 = 5.', '30 ÷ 6 = ', ['5', 'one group']),
        x('Multiply by the top. 1 × 5 = 5. We expect about 5 sixes.', '1/6 of 30 = ', ['5', 'expected'])
      ] },

    { title: '11. Experiment and theory',
      explain: [
        'Theory tells us what should happen. An experiment tells us what did happen. They are often close, but not always the same.',
        'When you do more tries, the experiment result usually gets closer to the theory.',
        'To compare, work out the expected number from the probability. Then subtract to see how far off the real result was.'
      ],
      rule: 'Find the expected number. Compare it to the real result.',
      mistake: 'Getting a different result does not mean the coin is broken. Small numbers of tries can be far from the theory.',
      steps: [
        x('Rinka flips a fair coin 20 times. What does theory say about heads? 1/2 of 20.', ['1/2', 'theory'], ' × 20 = ', ['10', 'expected heads']),
        x('She actually gets 13 heads. This is the experiment result.', ['13', 'real result']),
        x('Compare. How far off is it? 13 − 10 = 3.', '13 − 10 = ', ['3', 'more than expected']),
        x('She writes it as a fraction. 13 heads out of 20 flips.', '13/20 = ', ['13/20', 'experiment']),
        x('Theory said 10/20, which is 1/2. Experiment gave 13/20. They are close but not the same.', ['10/20', 'theory'], ' and ', ['13/20', 'experiment'])
      ] }
  ];

  /* ---------- Question skills ---------- */
  B.register(19, [

    { id: 'imp0', level: 1, name: 'Impossible and certain', make: function () {
      var typ = R.int(0, 2), n, a, p, ans, why;
      if (typ === 0) {
        n = R.int(3, 9); var c = R.pick(['blue', 'red', 'green']), o = R.pick(['yellow', 'purple', 'orange']);
        var certain = R.int(0, 1) === 1;
        a = certain ? 1 : 0;
        p = 'A bag holds ' + n + ' ' + c + ' marbles and nothing else. You pick one without looking. What is the probability that it is ' + (certain ? c : o) + '?';
        why = certain ? 'Every marble is ' + c + ', so it is certain.' : 'There are no ' + o + ' marbles, so it is impossible.';
      } else if (typ === 1) {
        var ev = R.pick([['a 7', 0], ['a number less than 7', 1], ['a number bigger than 6', 0], ['a number from 1 to 6', 1], ['a 0', 0], ['a whole number less than 10', 1]]);
        a = ev[1]; p = 'You roll a fair die with faces 1, 2, 3, 4, 5 and 6. What is the probability of rolling ' + ev[0] + '?';
        why = a === 1 ? 'Every face fits, so it is certain.' : 'No face fits, so it is impossible.';
      } else {
        var s = R.pick([4, 6, 8]), col = R.pick(['red', 'blue']), oc = col === 'red' ? 'green' : 'yellow';
        var cer = R.int(0, 1) === 1; a = cer ? 1 : 0;
        p = 'A spinner has ' + s + ' equal sections. All of them are ' + col + '. What is the probability that it lands on ' + (cer ? col : oc) + '?';
        why = cer ? 'Every section is ' + col + ', so it is certain.' : 'No section is ' + oc + ', so it is impossible.';
      }
      ans = String(a);
      return N({
        skill: 'Impossible and certain', prompt: p, answer: ans, keyboard: 'numeric', placeholder: 'Type 0 or 1',
        traps: [T(String(1 - a), a === 1 ? 'That says it can never happen. But every outcome fits, so it always happens.' : 'That says it always happens. But no outcome fits, so it never happens.'), T('1/2', 'That would mean equally likely. Look at how many outcomes fit.')],
        work: why + ' The probability is ' + ans + '.', plain: 'Impossible is 0. Certain is 1.',
        teach: [
          x('Count the outcomes that fit what we want.', ['favourable', 'outcomes that fit']),
          note('Think about the outcomes.', 'Check', [why]),
          x(a === 1 ? 'All of the outcomes fit, so favourable equals all. The fraction is 1.' : 'None of the outcomes fit. 0 out of anything is 0.', a === 1 ? 'all/all = ' : '0/all = ', [ans, a === 1 ? 'certain' : 'impossible']),
          lines('Put it on the chance line.', ['0                 1/2                 1', 'Impossible                        Certain'], 0)
        ]
      });
    } },

    { id: 'numoutcomes', level: 1, name: 'Count the outcomes', make: function () {
      var it = R.pick([
        { p: 'How many outcomes are there when you flip one coin?', a: 2, l: 'Heads and tails.', c: ['Heads', 'Tails'] },
        { p: 'How many outcomes are there when you roll one die?', a: 6, l: 'The faces 1 to 6.', c: ['1', '2', '3', '4', '5', '6'] },
        { p: 'A spinner has 5 equal sections. How many outcomes does it have?', a: 5, l: 'One for each section.', c: ['1', '2', '3', '4', '5'] },
        { p: 'A spinner has 8 equal sections. How many outcomes does it have?', a: 8, l: 'One for each section.', c: ['1', '2', '3', '4', '5', '6', '7', '8'] },
        { p: 'A bag has 4 red, 2 blue and 3 green marbles. How many outcomes are there when you pick one marble?', a: 9, l: 'One for each marble. 4 + 2 + 3 = 9.', c: ['4 red', '2 blue', '3 green'] },
        { p: 'A bag has 6 red and 5 blue marbles. How many outcomes are there when you pick one marble?', a: 11, l: 'One for each marble. 6 + 5 = 11.', c: ['6 red', '5 blue'] },
        { p: 'A number cube has faces 1 to 6. How many outcomes are there when you roll it?', a: 6, l: 'The faces 1 to 6.', c: ['1', '2', '3', '4', '5', '6'] },
        { p: 'A hat holds 12 name cards. You pick one card. How many outcomes are there?', a: 12, l: 'One for each card.', c: ['card 1', 'card 2', 'and so on to 12'] }
      ]);
      return N({
        skill: 'Count the outcomes', prompt: it.p, answer: it.a, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(it.a - 1), 'Count again. Every possible result counts, even the ones you might not want.'), T(String(it.a + 1), 'Count again carefully. Do not count anything twice.')],
        work: it.l, plain: 'An outcome is one possible result. Count every one.',
        teach: [
          x('An outcome is one possible result. We list them all.', ['Outcomes', 'all possible results']),
          lines('Here is the list.', [it.c.join('   ')], 0),
          x('Count them. There are ' + it.a + '.', ['' + it.a, 'outcomes']),
          note('Check that you counted every one.', 'Double check', ['Do not skip any outcome', 'Do not count one twice'])
        ]
      });
    } },

    { id: 'likelyword', level: 1, name: 'Choose the chance word', make: function () {
      var n = R.pick([4, 6, 8, 10]), k = R.pick([0, 1, n / 2, n - 1, n, R.int(1, n - 1)]);
      var w = word(k, n), typ = R.int(0, 1), p;
      var col = R.pick(['red', 'blue']), oc = col === 'red' ? 'blue' : 'green';
      if (typ === 0) p = 'A bag has ' + k + ' ' + col + ' marbles and ' + (n - k) + ' ' + oc + ' marbles. You pick one without looking. How likely is it that you pick a ' + col + ' marble?';
      else p = 'A spinner has ' + n + ' equal sections. ' + k + ' of them are ' + col + ' and the rest are ' + oc + '. How likely is it that it lands on ' + col + '?';
      var says = {
        'Impossible': 'Impossible means it can never happen. Here at least one outcome fits, so it can happen.',
        'Unlikely': 'Unlikely means fewer than half of the outcomes fit. Compare ' + k + ' with half of ' + n + ', which is ' + (n / 2) + '.',
        'Equally likely': 'Equally likely means exactly half of the outcomes fit. Compare ' + k + ' with half of ' + n + ', which is ' + (n / 2) + '.',
        'Likely': 'Likely means more than half of the outcomes fit. Compare ' + k + ' with half of ' + n + ', which is ' + (n / 2) + '.',
        'Certain': 'Certain means every outcome fits. Not every outcome fits here.'
      };
      if (k === 0) says['Impossible'] = 'That is right only if none fit. Check the count again.';
      return Q.choice({
        skill: 'Choose the chance word', prompt: p,
        options: HOW.map(function (h) { return { text: h, ok: h === w, trap: h === w ? undefined : (k === 0 ? 'There are zero of that colour, so no outcome fits. Think about the words at the ends of the chance line.' : k === n ? 'Every outcome fits. Think about the words at the ends of the chance line.' : says[h]) }; }),
        work: k + ' out of ' + n + '. Half of ' + n + ' is ' + (n / 2) + '. So it is ' + w.toLowerCase() + '.', plain: 'None is impossible. All is certain. Half is equally likely. Less than half is unlikely. More than half is likely.',
        teach: [
          x('Count how many outcomes fit. ' + k + ' out of ' + n + '.', [k + '/' + n, 'fit out of all']),
          bars('Here are the ' + n + ' outcomes. The ones that fit are coloured.', [fb(n + ' outcomes', n, k, 'bg-rose-400', '')]),
          x('Half of ' + n + ' is ' + (n / 2) + '. Compare ' + k + ' with ' + (n / 2) + '.', [String(k), 'fit'], ' and half is ', [String(n / 2), 'half']),
          x('So the chance word is ' + w.toLowerCase() + '.', [w, 'answer'])
        ]
      });
    } },

    { id: 'dieprob', level: 2, name: 'Probability with a die', make: function () {
      var ev = R.pick([
        { t: 'an even number', f: function (i) { return i % 2 === 0; } },
        { t: 'an odd number', f: function (i) { return i % 2 === 1; } },
        { t: 'a number greater than 4', f: function (i) { return i > 4; } },
        { t: 'a number less than 3', f: function (i) { return i < 3; } },
        { t: 'a number less than 6', f: function (i) { return i < 6; } },
        { t: 'a multiple of 3', f: function (i) { return i % 3 === 0; } },
        { t: 'a prime number', f: function (i) { return i === 2 || i === 3 || i === 5; } },
        { t: 'the number 4', f: function (i) { return i === 4; } },
        { t: 'a number greater than 1', f: function (i) { return i > 1; } },
        { t: 'a number that is 2 or more and 4 or less', f: function (i) { return i >= 2 && i <= 4; } }
      ]);
      var outs = [1, 2, 3, 4, 5, 6], fav = outs.map(ev.f), c = fav.filter(function (z) { return z; }).length;
      var ph = R.pick(['You roll a fair die. What is the probability of rolling ' + ev.t + '? Write it as a fraction in simplest form.', 'A fair die with faces 1 to 6 is rolled once. What is the chance of getting ' + ev.t + '? Give a fraction in simplest form.']);
      return N({
        skill: 'Probability with a die', prompt: ph, answer: frac(c, 6), simplest: true, placeholder: 'Like 1/2',
        traps: [T(c + '/' + (6 - c), 'The bottom must be all 6 faces, not just the faces you do not want.'), T(String(c), 'A probability is a fraction. Put the ' + c + ' favourable faces over all 6 faces.')],
        work: c + ' of the 6 faces fit, so ' + c + '/6' + (R.gcd(c, 6) > 1 ? ' = ' + frac(c, 6) : '') + '.', plain: 'Count the faces that fit. Put that over 6. Then simplify.',
        teach: [
          x('A die has 6 faces. That is the bottom number.', ['6', 'all outcomes']),
          lines('List the faces. Mark the ones that fit ' + ev.t + '.', markLines(outs, fav), 0),
          x('Count the yes marks. There are ' + c + '.', [String(c), 'favourable']),
          x('The probability is ' + c + ' out of 6.', 'P = ', [c + '/6', 'before simplifying']),
          simp(c, 6)
        ]
      });
    } },

    { id: 'spinner', level: 2, name: 'Probability with a spinner', make: function () {
      var n = R.pick([4, 5, 6, 8, 10, 12]), r = R.int(1, Math.floor(n / 2)), b = R.int(1, n - r - 1), g = n - r - b;
      var cnt = [r, b, g], pickI = R.int(0, 2), c = cnt[pickI], name = ['red', 'blue', 'green'][pickI];
      var ph = R.pick(['A spinner has ' + n + ' equal sections. ' + r + ' ' + be(r) + ' red, ' + b + ' ' + be(b) + ' blue and ' + g + ' ' + be(g) + ' green. What is the probability that it lands on ' + name + '? Write a fraction in simplest form.',
        'Rinka spins a spinner with ' + n + ' equal sections. ' + r + (r === 1 ? ' section is red, ' : ' sections are red, ') + b + ' ' + be(b) + ' blue and ' + g + ' ' + be(g) + ' green. What is the chance that she lands on ' + name + '? Give a fraction in simplest form.']);
      var lin = [];
      for (var i = 0; i < r; i++) lin.push('R');
      for (i = 0; i < b; i++) lin.push('B');
      for (i = 0; i < g; i++) lin.push('G');
      return N({
        skill: 'Probability with a spinner', prompt: ph, answer: frac(c, n), simplest: true, placeholder: 'Like 3/8',
        traps: [T(c + '/' + (n - c), 'The bottom must count all ' + n + ' sections, not just the ones that are not ' + name + '.'), T(n + '/' + c, 'You flipped the fraction. The sections you want go on top.')],
        work: c + ' ' + name + ' sections out of ' + n + ' gives ' + c + '/' + n + (R.gcd(c, n) > 1 ? ' = ' + frac(c, n) : '') + '.', plain: 'Sections of the colour you want, over all the sections.',
        teach: [
          lines('Here are the ' + n + ' equal sections. R is red, B is blue, G is green.', [lin.join('  ')], 0),
          x('All ' + n + ' sections are possible outcomes. That is the bottom.', [String(n), 'all sections']),
          x(name.charAt(0).toUpperCase() + name.slice(1) + ' has ' + c + ' sections. That is the top.', [String(c), name + ' sections']),
          x('The probability of ' + name + ' is ' + c + ' out of ' + n + '.', 'P(' + name + ') = ', [c + '/' + n, 'before simplifying']),
          simp(c, n)
        ]
      });
    } },

    { id: 'marbles', level: 2, name: 'Marble bag probability', make: function () {
      var r = R.int(1, 8), b = R.int(1, 8), g = R.int(0, 6), tot = r + b + g;
      var items = [['red', r], ['blue', b]]; if (g > 0) items.push(['green', g]);
      var pi = R.int(0, items.length - 1), name = items[pi][0], c = items[pi][1];
      var bag = items.map(function (it) { return it[1] + ' ' + it[0]; }).join(', ').replace(/, ([^,]*)$/, ' and $1');
      return N({
        skill: 'Marble bag probability', prompt: 'A bag has ' + bag + ' marbles. You pick one marble without looking. What is the probability that it is ' + name + '? Write a fraction in simplest form.',
        answer: frac(c, tot), simplest: true, placeholder: 'Like 3/10',
        traps: [T(c + '/' + (tot - c), 'The bottom must be all ' + tot + ' marbles, not just the other colours.'), T(String(c), 'A probability is a fraction. Put ' + c + ' over the total number of marbles.')],
        work: 'Total ' + items.map(function (i) { return i[1]; }).join(' + ') + ' = ' + tot + '. ' + c + '/' + tot + (R.gcd(c, tot) > 1 ? ' = ' + frac(c, tot) : '') + '.', plain: 'Add up all the marbles. Then put the colour you want over the total.',
        teach: [
          x('First find the total number of marbles.', items.map(function (i) { return String(i[1]); }).join(' + ') + ' = ', [String(tot), 'total']),
          bars('Here are the marbles. The ' + name + ' ones are coloured.', [fb(tot + ' marbles', tot, c, 'bg-rose-400', '')]),
          x('There are ' + c + ' ' + name + ' marbles out of ' + tot + '.', 'P(' + name + ') = ', [c + '/' + tot, 'before simplifying']),
          simp(c, tot)
        ]
      });
    } },

    { id: 'notevent', level: 3, name: 'Probability of not', make: function () {
      var r = R.int(2, 8), b = R.int(1, 7), g = R.int(1, 6), tot = r + b + g;
      var items = [['red', r], ['blue', b], ['green', g]], pi = R.int(0, 2), name = items[pi][0], c = items[pi][1], nc = tot - c;
      return N({
        skill: 'Probability of not', prompt: 'A bag has ' + r + ' red, ' + b + ' blue and ' + g + ' green marbles. You pick one without looking. What is the probability that it is NOT ' + name + '? Write a fraction in simplest form.',
        answer: frac(nc, tot), simplest: true, placeholder: 'Like 2/3',
        traps: [T(frac(c, tot), 'That is the chance of ' + name + '. The question asks for NOT ' + name + '.'), T(String(nc), 'A probability is a fraction. Put ' + nc + ' over ' + tot + '.')],
        work: 'Total ' + tot + '. Not ' + name + ' is ' + tot + ' − ' + c + ' = ' + nc + '. So ' + nc + '/' + tot + (R.gcd(nc, tot) > 1 ? ' = ' + frac(nc, tot) : '') + '.', plain: 'Count the marbles that are not that colour. Put them over the total.',
        teach: [
          x('Find the total. ' + r + ' + ' + b + ' + ' + g + ' = ' + tot + '.', r + ' + ' + b + ' + ' + g + ' = ', [String(tot), 'total']),
          x('There are ' + c + ' ' + name + ' marbles. The others are not ' + name + '.', [String(c), name]),
          x('Take those away from the total. ' + tot + ' − ' + c + ' = ' + nc + '.', tot + ' − ' + c + ' = ', [String(nc), 'not ' + name]),
          x('The probability of not ' + name + ' is ' + nc + ' out of ' + tot + '.', 'P(not ' + name + ') = ', [nc + '/' + tot, 'before simplifying']),
          simp(nc, tot),
          x('Check. Chance of ' + name + ' plus chance of not ' + name + ' should make 1.', c + '/' + tot + ' + ' + nc + '/' + tot + ' = ', ['1', 'whole'])
        ]
      });
    } },

    { id: 'fair', level: 3, name: 'Fair or unfair', make: function () {
      var names = R.pick([['Amy', 'Ben'], ['Rinka', 'Sam'], ['Mia', 'Leo'], ['Nora', 'Kai']]), A = names[0], Bn = names[1];
      var typ = R.int(0, 1), st, desc, ca, cb, tot;
      if (typ === 0) {
        tot = R.pick([6, 8, 10, 12]); ca = R.int(1, Math.floor(tot / 2) - 1 || 1);
        cb = R.int(0, 2) === 0 ? ca : R.int(1, tot - ca - 1);
        if (ca + cb >= tot) cb = ca;
        desc = 'A spinner has ' + tot + ' equal sections. ' + A + ' wins if it lands on red, which has ' + ca + ' sections. ' + Bn + ' wins if it lands on blue, which has ' + cb + ' sections. The rest are green and nobody wins.';
      } else {
        var g = R.pick([
          { d: A + ' wins if a die shows an even number. ' + Bn + ' wins if it shows 1, 2 or 3.', a: 3, b: 3 },
          { d: A + ' wins if a die shows a 6. ' + Bn + ' wins if it shows 1 or 2.', a: 1, b: 2 },
          { d: A + ' wins if a die shows a number greater than 2. ' + Bn + ' wins if it shows 1 or 2.', a: 4, b: 2 },
          { d: A + ' wins if a die shows 1 or 2. ' + Bn + ' wins if it shows 5 or 6.', a: 2, b: 2 },
          { d: A + ' wins if a die shows an odd number. ' + Bn + ' wins if it shows an even number.', a: 3, b: 3 },
          { d: A + ' wins if a die shows 6. ' + Bn + ' wins if it shows a number less than 4.', a: 1, b: 3 }
        ]);
        ca = g.a; cb = g.b; tot = 6; desc = 'A fair die is rolled. ' + g.d;
      }
      var ans = ca === cb ? 'Fair' : (ca > cb ? 'Unfair, it favours ' + A : 'Unfair, it favours ' + Bn);
      var opts = [{ text: 'Fair', ok: ans === 'Fair', trap: 'The two chances are not equal. Count the outcomes for each player and compare.' },
                  { text: 'Unfair, it favours ' + A, ok: ans === 'Unfair, it favours ' + A, trap: ca === cb ? 'Both players have the same number of outcomes, so nobody is favoured.' : 'Check again. The player with more winning outcomes is favoured.' },
                  { text: 'Unfair, it favours ' + Bn, ok: ans === 'Unfair, it favours ' + Bn, trap: ca === cb ? 'Both players have the same number of outcomes, so nobody is favoured.' : 'Check again. The player with more winning outcomes is favoured.' }];
      return Q.choice({
        skill: 'Fair or unfair', prompt: desc + ' Is the game fair?', options: opts,
        work: A + ' has ' + ca + ' out of ' + tot + '. ' + Bn + ' has ' + cb + ' out of ' + tot + '. ' + (ca === cb ? 'They are equal, so the game is fair.' : 'They are not equal.'), plain: 'A game is fair when both players have the same number of ways to win.',
        teach: [
          x('Find how many ways each player can win.', [A, 'ways to win'], ' and ', [Bn, 'ways to win']),
          x(A + ' has ' + ca + ' ways out of ' + tot + '.', A + ' = ', [ca + '/' + tot, 'chance']),
          x(Bn + ' has ' + cb + ' ways out of ' + tot + '.', Bn + ' = ', [cb + '/' + tot, 'chance']),
          x(ca === cb ? 'The two chances are equal. The game is fair.' : 'The chances are not equal. The player with the bigger one is favoured.', [ans, 'answer'])
        ]
      });
    } },

    { id: 'samplespace', level: 3, name: 'Size of a sample space', make: function () {
      var it = R.pick([
        { p: 'You flip two coins. How many outcomes are in the sample space?', A: ['H', 'T'], Bs: ['H', 'T'] },
        { p: 'You flip three coins. How many outcomes are in the sample space?', A: ['H', 'T'], Bs: ['HH', 'HT', 'TH', 'TT'] },
        { p: 'You flip a coin and roll a die. How many outcomes are in the sample space?', A: ['H', 'T'], Bs: ['1', '2', '3', '4', '5', '6'] },
        { p: 'You flip a coin and spin a spinner with 3 equal sections marked A, B and C. How many outcomes are there?', A: ['H', 'T'], Bs: ['A', 'B', 'C'] },
        { p: 'Rinka has 3 shirts and 4 pairs of shorts. How many different outfits can she make with one shirt and one pair of shorts?', A: ['S1', 'S2', 'S3'], Bs: ['a', 'b', 'c', 'd'] },
        { p: 'You spin a spinner with 3 equal sections marked 1, 2 and 3, then a spinner with 4 equal sections marked A, B, C and D. How many outcomes are there?', A: ['1', '2', '3'], Bs: ['A', 'B', 'C', 'D'] },
        { p: 'A menu has 2 kinds of soup and 5 kinds of sandwich. How many different lunches with one soup and one sandwich are possible?', A: ['S1', 'S2'], Bs: ['a', 'b', 'c', 'd', 'e'] }
      ]);
      var a = it.A.length, b = it.Bs.length;
      return N({
        skill: 'Size of a sample space', prompt: it.p, answer: a * b, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(a + b), 'You added. Every choice in the first set pairs with every choice in the second set, so multiply.')],
        work: a + ' × ' + b + ' = ' + (a * b) + '.', plain: 'Each choice in the first group pairs with every choice in the second group. Multiply the two counts.',
        teach: [
          x('The first set has ' + a + ' choices. The second set has ' + b + '.', [String(a), 'first'], ' and ', [String(b), 'second']),
          lines('List every pair. Each row starts with a different first choice.', pairRows(it.A, it.Bs), 0),
          x('Each of the ' + a + ' rows has ' + b + ' pairs.', a + ' rows × ' + b + ' pairs = ', [String(a * b), 'outcomes']),
          x('So the sample space has ' + (a * b) + ' outcomes.', [String(a * b), 'answer'])
        ]
      });
    } },

    { id: 'sampleprob', level: 4, name: 'Probability with two events', make: function () {
      var typ = R.int(0, 1), outs, fav, ev, A, Bs, head;
      if (typ === 0) {
        A = ['H', 'T']; Bs = ['H', 'T'];
        ev = R.pick([['both coins show heads', function (o) { return o === 'HH'; }], ['both coins show tails', function (o) { return o === 'TT'; }], ['exactly one coin shows heads', function (o) { return o === 'HT' || o === 'TH'; }], ['at least one coin shows heads', function (o) { return o !== 'TT'; }], ['the two coins show the same side', function (o) { return o === 'HH' || o === 'TT'; }]]);
        head = 'You flip two fair coins. What is the probability that ' + ev[0] + '?';
      } else {
        A = ['H', 'T']; Bs = ['1', '2', '3', '4', '5', '6'];
        ev = R.pick([['the coin shows heads and the die shows an even number', function (o) { return o[0] === 'H' && +o[1] % 2 === 0; }], ['the coin shows tails and the die shows a 6', function (o) { return o === 'T6'; }], ['the coin shows heads and the die shows a number greater than 4', function (o) { return o[0] === 'H' && +o[1] > 4; }], ['the coin shows tails and the die shows an odd number', function (o) { return o[0] === 'T' && +o[1] % 2 === 1; }], ['the die shows a 1 or a 2, whatever the coin shows', function (o) { return +o[1] <= 2; }]]);
        head = 'You flip a fair coin and roll a fair die. What is the probability that ' + ev[0] + '?';
      }
      outs = []; A.forEach(function (a) { Bs.forEach(function (b) { outs.push(a + b); }); });
      var fv = outs.filter(ev[1]), c = fv.length, tot = outs.length;
      return N({
        skill: 'Probability with two events', prompt: head + ' Write a fraction in simplest form.', answer: frac(c, tot), simplest: true, placeholder: 'Like 1/4',
        traps: [T(String(c), 'A probability is a fraction. Put ' + c + ' over all ' + tot + ' outcomes.'), T(c + '/' + (tot - c), 'The bottom must be all ' + tot + ' outcomes in the sample space.')],
        work: 'The sample space has ' + tot + ' outcomes. ' + c + ' fit: ' + fv.join(', ') + '. So ' + c + '/' + tot + (R.gcd(c, tot) > 1 ? ' = ' + frac(c, tot) : '') + '.', plain: 'List every pair. Count the pairs that fit. Put that over all the pairs.',
        teach: [
          lines('List the whole sample space. ' + tot + ' outcomes.', pairRows(A, Bs), 0),
          x('There are ' + tot + ' outcomes in all.', [String(tot), 'all outcomes']),
          x('The outcomes that fit are ' + fv.join(', ') + '. That is ' + c + '.', [String(c), 'favourable']),
          x('The probability is ' + c + ' out of ' + tot + '.', 'P = ', [c + '/' + tot, 'before simplifying']),
          simp(c, tot)
        ]
      });
    } },

    { id: 'predict', level: 4, name: 'Predict how many', make: function () {
      var it = R.pick([
        { ev: 'the spinner lands on red', obj: 'A spinner has 8 equal sections and 3 are red. It is spun', k: 3, n: 8, u: 'red spins' },
        { ev: 'the spinner lands on blue', obj: 'A spinner has 5 equal sections and 2 are blue. It is spun', k: 2, n: 5, u: 'blue spins' },
        { ev: 'the coin shows heads', obj: 'A fair coin is flipped', k: 1, n: 2, u: 'heads' },
        { ev: 'the die shows a 6', obj: 'A fair die is rolled', k: 1, n: 6, u: 'sixes' },
        { ev: 'the die shows an even number', obj: 'A fair die is rolled', k: 3, n: 6, u: 'even numbers' },
        { ev: 'the die shows a number greater than 4', obj: 'A fair die is rolled', k: 2, n: 6, u: 'numbers greater than 4' },
        { ev: 'the marble is blue', obj: 'A bag has 10 marbles and 3 are blue. A marble is picked and put back, and this is done', k: 3, n: 10, u: 'blue marbles' },
        { ev: 'the spinner lands on green', obj: 'A spinner has 4 equal sections and 1 is green. It is spun', k: 1, n: 4, u: 'green spins' }
      ]);
      var m = R.int(2, Math.max(3, Math.floor(60 / it.n))), t = it.n * m, ans = it.k * m;
      return N({
        skill: 'Predict how many', prompt: it.obj + ' ' + t + ' times. About how many times do you expect ' + it.ev + '?',
        answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(t), 'That is the number of tries. The event happens only some of the time.'), T(String(m), 'That is the size of one group. Multiply by ' + it.k + ' to take the right number of groups.')],
        work: 'The probability is ' + it.k + '/' + it.n + '. ' + t + ' ÷ ' + it.n + ' = ' + m + ', then ' + m + ' × ' + it.k + ' = ' + ans + '.', plain: 'Find the fraction of the tries. Divide by the bottom, then multiply by the top.',
        teach: [
          x('First find the probability. It is ' + it.k + ' out of ' + it.n + '.', 'P = ', [it.k + '/' + it.n, 'probability']),
          groups('Cut the ' + t + ' tries into ' + it.n + ' equal groups of ' + m + '.', it.n, m, 0, m + ' in each group'),
          x('Divide by the bottom. ' + t + ' ÷ ' + it.n + ' = ' + m + '.', t + ' ÷ ' + it.n + ' = ', [String(m), 'one group']),
          groups('Take ' + it.k + ' of the groups. Those are the ' + it.u + '.', it.n, m, it.k, it.k + ' groups'),
          x('Multiply by the top. ' + it.k + ' × ' + m + ' = ' + ans + '.', it.k + ' × ' + m + ' = ', [String(ans), 'expected'])
        ]
      });
    } },

    { id: 'expfrac', level: 4, name: 'Experiment results as a fraction', make: function () {
      var t = R.pick([10, 20, 25, 40, 50]), r = R.int(1, t - 1);
      var it = R.pick([['A spinner was spun', 'times. It landed on red', 'red'], ['A coin was flipped', 'times. It showed heads', 'heads'], ['A die was rolled', 'times. It showed a six', 'sixes'], ['Mia picked a marble from a bag and put it back,', 'times. She picked blue', 'blue picks']]);
      return N({
        skill: 'Experiment results as a fraction', prompt: it[0] + ' ' + t + ' ' + it[1] + ' ' + r + ' times. What fraction of the tries were ' + it[2] + '? Write a fraction in simplest form.',
        answer: frac(r, t), simplest: true, placeholder: 'Like 3/10',
        traps: [T(r + '/' + (t - r), 'The bottom must be all ' + t + ' tries, not just the ones that were not ' + it[2] + '.'), T(t + '/' + r, 'You flipped the fraction. The part you want goes on top.')],
        work: r + ' out of ' + t + ' is ' + r + '/' + t + (R.gcd(r, t) > 1 ? ' = ' + frac(r, t) : '') + '.', plain: 'The tries you want go on top. All the tries go on the bottom.',
        teach: [
          x('This is an experiment. We look at what really happened.', ['Experiment', 'what happened']),
          x('There were ' + t + ' tries in all. That is the bottom.', [String(t), 'all tries']),
          x(r + ' of them were ' + it[2] + '. That is the top.', [String(r), it[2]]),
          x('The experiment result is ' + r + ' out of ' + t + '.', r + '/' + t + ' = ', [r + '/' + t, 'before simplifying']),
          simp(r, t)
        ]
      });
    } },

    { id: 'orevent', level: 4, name: 'Probability of this or that', make: function () {
      var r = R.int(1, 6), b = R.int(1, 6), g = R.int(1, 6), y = R.int(0, 4), tot = r + b + g + y;
      var cols = [['red', r], ['blue', b], ['green', g]], i = R.int(0, 2), j = (i + R.int(1, 2)) % 3, c = cols[i][1] + cols[j][1];
      var bag = 'A spinner has ' + tot + ' equal sections. ' + r + ' ' + be(r) + ' red, ' + b + ' ' + be(b) + ' blue, ' + g + ' ' + be(g) + ' green' + (y > 0 ? ' and ' + y + ' ' + be(y) + ' yellow' : '') + '.';
      return N({
        skill: 'Probability of this or that', prompt: bag + ' What is the probability that it lands on ' + cols[i][0] + ' or ' + cols[j][0] + '? Write a fraction in simplest form.',
        answer: frac(c, tot), simplest: true, placeholder: 'Like 5/12',
        traps: [T(frac(cols[i][1], tot), 'That is the chance of only ' + cols[i][0] + '. The question wants both colours together.'), T(c + '/' + (tot - c), 'The bottom must be all ' + tot + ' sections.')],
        work: cols[i][1] + ' + ' + cols[j][1] + ' = ' + c + ' sections fit. ' + c + '/' + tot + (R.gcd(c, tot) > 1 ? ' = ' + frac(c, tot) : '') + '.', plain: 'Add the sections for both colours. Put that over all the sections.',
        teach: [
          x('There are ' + tot + ' sections in all. That is the bottom.', [String(tot), 'all sections']),
          x(cols[i][0].charAt(0).toUpperCase() + cols[i][0].slice(1) + ' has ' + cols[i][1] + ' sections. ' + cols[j][0].charAt(0).toUpperCase() + cols[j][0].slice(1) + ' has ' + cols[j][1] + '.', [String(cols[i][1]), cols[i][0]], ' + ', [String(cols[j][1]), cols[j][0]]),
          x('Add them. ' + cols[i][1] + ' + ' + cols[j][1] + ' = ' + c + ' sections fit.', cols[i][1] + ' + ' + cols[j][1] + ' = ', [String(c), 'favourable']),
          x('The probability is ' + c + ' out of ' + tot + '.', 'P = ', [c + '/' + tot, 'before simplifying']),
          simp(c, tot)
        ]
      });
    } },

    { id: 'expdiff', level: 5, name: 'Compare experiment and theory', make: function () {
      var it = R.pick([
        { o: 'A fair coin is flipped', ev: 'heads', k: 1, n: 2 },
        { o: 'A fair die is rolled', ev: 'sixes', k: 1, n: 6 },
        { o: 'A fair die is rolled', ev: 'even numbers', k: 1, n: 2 },
        { o: 'A spinner with 5 equal sections, 2 of them red, is spun', ev: 'red spins', k: 2, n: 5 },
        { o: 'A spinner with 4 equal sections, 1 of them blue, is spun', ev: 'blue spins', k: 1, n: 4 }
      ]);
      var m = R.int(3, Math.max(4, Math.floor(60 / it.n))), t = it.n * m, e = it.k * m, diff = R.int(1, 4), up = R.int(0, 1) === 1 || e - diff < 0;
      var a = up ? e + diff : e - diff;
      return N({
        skill: 'Compare experiment and theory', prompt: it.o + ' ' + t + ' times. Theory says you should expect ' + it.k + '/' + it.n + ' of the tries to be ' + it.ev + '. In the experiment there were ' + a + ' ' + it.ev + '. How many ' + (up ? 'more' : 'fewer') + ' than expected was that?',
        answer: diff, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(e), 'That is the number expected from theory. Compare it with the real result, ' + a + ', and find the gap.'), T(String(a), 'That is the real result. The question asks for the gap from the number expected.')],
        work: it.k + '/' + it.n + ' of ' + t + ' = ' + e + '. ' + (up ? a + ' − ' + e : e + ' − ' + a) + ' = ' + diff + '.', plain: 'First find the expected number. Then take the smaller number from the bigger to find the gap.',
        teach: [
          x('First find the expected number. ' + it.k + '/' + it.n + ' of ' + t + '.', [it.k + '/' + it.n, 'theory'], ' of ', [String(t), 'tries']),
          x(t + ' ÷ ' + it.n + ' = ' + m + ', and ' + it.k + ' × ' + m + ' = ' + e + '. We expect ' + e + '.', it.k + ' × ' + m + ' = ', [String(e), 'expected']),
          x('The experiment gave ' + a + '.', [String(a), 'real result']),
          x('Find the gap. ' + (up ? a + ' − ' + e : e + ' − ' + a) + ' = ' + diff + '.', (up ? a + ' − ' + e : e + ' − ' + a) + ' = ', [String(diff), up ? 'more than expected' : 'fewer than expected']),
          x('The experiment was ' + diff + ' ' + (up ? 'more' : 'fewer') + ' than theory. That is a small difference.', [String(diff), 'gap'])
        ]
      });
    } },

    { id: 'missing', level: 5, name: 'Work backward from a probability', make: function () {
      var typ = R.int(0, 1), pb = R.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [3, 8], [5, 8], [3, 10], [7, 10]]);
      var a = pb[0], b = pb[1], m = R.int(2, Math.max(3, Math.floor(30 / b)));
      var nm = R.pick(['red', 'blue', 'green']);
      if (typ === 0) {
        var tot = b * m, c = a * m;
        return N({
          skill: 'Work backward from a probability', prompt: 'A bag has ' + tot + ' marbles. The probability of picking a ' + nm + ' marble is ' + a + '/' + b + '. How many ' + nm + ' marbles are in the bag?',
          answer: c, keyboard: 'numeric', placeholder: 'Type a number',
          traps: [T(String(a), 'That is only the top of the fraction. Find ' + a + '/' + b + ' of ' + tot + '.'), T(String(m), 'That is the size of one group. Multiply by ' + a + ' to take ' + a + ' groups.')],
          work: tot + ' ÷ ' + b + ' = ' + m + ', then ' + m + ' × ' + a + ' = ' + c + '.', plain: 'The probability is a fraction of the bag. Find that fraction of the total.',
          teach: [
            x('The chance of ' + nm + ' is ' + a + '/' + b + '. So ' + a + '/' + b + ' of the marbles are ' + nm + '.', [a + '/' + b, 'of the bag'], ' of ', [String(tot), 'marbles']),
            groups('Cut the ' + tot + ' marbles into ' + b + ' equal groups of ' + m + '.', b, m, 0, m + ' in each group'),
            groups('Take ' + a + ' of the groups. Those are the ' + nm + ' marbles.', b, m, a, a + ' groups'),
            x('Multiply. ' + a + ' × ' + m + ' = ' + c + '.', a + ' × ' + m + ' = ', [String(c), nm + ' marbles'])
          ]
        });
      }
      var c2 = a * m, tot2 = b * m;
      return N({
        skill: 'Work backward from a probability', prompt: 'The probability of picking a ' + nm + ' marble from a bag is ' + a + '/' + b + '. There are ' + c2 + ' ' + nm + ' marbles in the bag. How many marbles are in the bag altogether?',
        answer: tot2, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(c2), 'That is the number of ' + nm + ' marbles only. The bag holds more marbles than that.'), T(String(b), 'That is the bottom of the fraction. The bag holds ' + m + ' times as many marbles.')],
        work: c2 + ' ÷ ' + a + ' = ' + m + ', then ' + m + ' × ' + b + ' = ' + tot2 + '.', plain: a + ' groups hold ' + c2 + ' marbles, so one group holds ' + m + '. There are ' + b + ' groups.',
        teach: [
          x('The chance ' + a + '/' + b + ' means ' + a + ' out of every ' + b + ' marbles are ' + nm + '.', [a + '/' + b, 'chance']),
          groups(c2 + ' ' + nm + ' marbles fill ' + a + ' groups.', b, m, a, a + ' groups of ' + nm),
          x('One group is ' + c2 + ' ÷ ' + a + ' = ' + m + '.', c2 + ' ÷ ' + a + ' = ', [String(m), 'one group']),
          x('There are ' + b + ' groups in all. ' + b + ' × ' + m + ' = ' + tot2 + '.', b + ' × ' + m + ' = ', [String(tot2), 'marbles in all'])
        ]
      });
    } },

    { id: 'added', level: 6, name: 'Change the bag', make: function () {
      var r = R.int(2, 8), b = R.int(3, 9), k = R.int(2, 6), add = R.int(0, 1) === 1, nm = R.pick(['red', 'blue']), other = nm === 'red' ? 'blue' : 'red';
      var c = nm === 'red' ? r : b, oc = nm === 'red' ? b : r;
      var newOther = add ? oc + k : Math.max(1, oc - k), tot = c + newOther;
      var actualK = Math.abs(newOther - oc);
      if (actualK === 0) { newOther = oc + 1; tot = c + newOther; actualK = 1; add = true; }
      return N({
        skill: 'Change the bag', prompt: 'A bag has ' + c + ' ' + nm + ' marbles and ' + oc + ' ' + other + ' marbles. Then ' + actualK + ' ' + other + ' marbles are ' + (add ? 'added' : 'taken out') + '. Now you pick one marble without looking. What is the probability that it is ' + nm + '? Write a fraction in simplest form.',
        answer: frac(c, tot), simplest: true, placeholder: 'Like 3/8',
        traps: [T(frac(c, c + oc), 'That is the chance before the change. Work out the new total first.'), T(c + '/' + newOther, 'The bottom must be all the marbles now, not just the ' + other + ' ones.')],
        work: other + ' marbles now: ' + oc + (add ? ' + ' : ' − ') + actualK + ' = ' + newOther + '. Total ' + c + ' + ' + newOther + ' = ' + tot + '. So ' + c + '/' + tot + (R.gcd(c, tot) > 1 ? ' = ' + frac(c, tot) : '') + '.', plain: 'Change the count first. Then find the new total. Then put the colour you want over it.',
        teach: [
          x('First find how many ' + other + ' marbles there are now. ' + oc + (add ? ' + ' : ' − ') + actualK + ' = ' + newOther + '.', oc + (add ? ' + ' : ' − ') + actualK + ' = ', [String(newOther), other + ' now']),
          x('The ' + nm + ' marbles did not change. There are still ' + c + '.', [String(c), nm]),
          x('Find the new total. ' + c + ' + ' + newOther + ' = ' + tot + '.', c + ' + ' + newOther + ' = ', [String(tot), 'total now']),
          x('The probability is ' + c + ' out of ' + tot + '.', 'P(' + nm + ') = ', [c + '/' + tot, 'before simplifying']),
          simp(c, tot)
        ]
      });
    } }
  ]);
})();
