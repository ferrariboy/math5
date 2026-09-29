/* Module 1: Mega Numbers. Lessons, vocabulary and question skills. */
(function () {
  'use strict';
  var B = window.Bank, R = B.R, S = B.s, Q = B.q, T = Q.trap;
  var x = S.x, note = S.note, bars = S.bars, fb = S.fb, row = S.row, grid = S.grid, groups = S.groups;
  var fmt = R.fmt;

  /* ---------- Vocabulary ---------- */
  window.MATH_VOCAB[1] = [
    { w: 'Digit', m: 'One of the ten number symbols: 0, 1, 2, 3, 4, 5, 6, 7, 8 and 9. Every number is built from digits.' },
    { w: 'Place value', m: 'What a digit is worth because of where it sits. The 5 in 5,000 is worth five thousand. The 5 in 50 is worth fifty.' },
    { w: 'Period', m: 'A group of three digits in a big number, like the thousands group. Commas separate the periods.' },
    { w: 'Base ten', m: 'Our number system. Ten of one place make one of the next place up, so ten ones make a ten and ten tens make a hundred.' },
    { w: 'Expanded form', m: 'A number written as a sum of its place values. 3,405 is 3,000 + 400 + 5.' },
    { w: 'Compare', m: 'To decide which number is greater, which is less, or whether they are equal.' },
    { w: 'Round', m: 'To swap a number for a nearby friendly number, like 3,672 to 3,700. You round to a place, like the nearest hundred.' },
    { w: 'Estimate', m: 'A smart guess that is close to the real answer. You often find it by rounding first.' }
  ];

  /* ---------- Helpers ---------- */
  var PLACES = ['ones', 'tens', 'hundreds', 'thousands', 'ten thousands', 'hundred thousands', 'millions'];
  var SING = ['one', 'ten', 'hundred', 'thousand', 'ten thousand', 'hundred thousand', 'million'];
  var ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  var TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  function pow10(k) { return Math.pow(10, k); }
  function words3(n) {
    var s = [];
    if (n >= 100) { s.push(ONES[Math.floor(n / 100)] + ' hundred'); n = n % 100; }
    if (n >= 20) { s.push(TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '')); }
    else if (n > 0) { s.push(ONES[n]); }
    return s.join(' ');
  }
  function toWords(n) {
    var m = Math.floor(n / 1000000), t = Math.floor(n / 1000) % 1000, o = n % 1000, parts = [];
    if (m) parts.push(words3(m) + ' million');
    if (t) parts.push(words3(t) + ' thousand');
    if (o) parts.push(words3(o));
    return parts.join(', ');
  }
  function pad3(n) { var s = String(n); while (s.length < 3) s = '0' + s; return s; }
  function rnd(n, p) { return Math.floor((n + p / 2) / p) * p; }
  function digitAt(n, pos) { return Math.floor(n / pow10(pos)) % 10; }
  function zeros(k) { return new Array(k + 1).join('0'); }
  function plural(k, word) { return k + ' ' + word + (k === 1 ? '' : 's'); }

  /* Number with random digits. The first digit is never 0. */
  function randNum(len) {
    var s = '';
    for (var i = 0; i < len; i++) s += (i === 0) ? R.int(1, 9) : R.int(0, 9);
    return parseInt(s, 10);
  }
  /* Tokens for x(): the number with commas, with the digits at chosen places highlighted. tags maps place to tag text. */
  function hiNum(n, tags) {
    var s = fmt(n), total = String(n).length, seen = 0, out = [], buf = '';
    for (var i = 0; i < s.length; i++) {
      var ch = s.charAt(i);
      if (ch === ',') { buf += ch; continue; }
      var pos = total - 1 - seen; seen++;
      if (tags.hasOwnProperty(pos)) {
        if (buf) { out.push(buf); buf = ''; }
        out.push([ch, tags[pos]]);
      } else buf += ch;
    }
    if (buf) out.push(buf);
    return out;
  }
  function X(cap, parts) { return x.apply(null, [cap].concat(parts)); }
  /* Keep only useful wrong answers: whole or decimal, different from the answer, no repeats. */
  function clean(list, ans) {
    var seen = {}, out = [];
    seen[String(ans)] = true;
    list.forEach(function (t) {
      var v = String(t.value);
      if (!/^\d+(\.\d+)?$/.test(v) || seen[v]) return;
      seen[v] = true;
      out.push(T(v, t.say));
    });
    return out.slice(0, 3);
  }

  /* ---------- Lessons ---------- */
  window.MATH_LESSONS[1] = [
    { title: '1. Ten of one makes one of the next',
      explain: [
        'Imagine a parking lot for toy cars. When 10 cars are parked, you swap them for one big Tens Garage. When you have 10 Tens Garages, you swap them for one Hundreds Garage.',
        'This keeps going. Ten hundreds make a thousand. Ten thousands make a ten thousand. It keeps going all the way up to a million. Every place is worth 10 times the place to its right.',
        'This pattern is why we call our numbers base ten.'
      ],
      rule: 'Every place is worth 10 times the place on its right.',
      mistake: 'Do not think each place is just one bigger. The step from one place to the next is always times 10.',
      steps: [
        groups('Here are 10 loose cars. These are ones. The lot is full.', 1, 10, 1, '10 ones'),
        note('Ten ones fit into one bigger garage. We swap them.', 'Swap ten for one', ['10 ones make 1 ten', '10 tens make 1 hundred', '10 hundreds make 1 thousand']),
        grid('Now we have 10 Tens Garages, each holding 10 cars. Ten rows of ten make 100.', 10, 10, [{ c0: 0, c1: 10, r0: 0, r1: 10, cls: 'bg-indigo-400' }]),
        bars('Ten Hundreds Garages fill one Thousands Garage.', [row('10 hundreds', 10, 'bg-emerald-400', '100', '1 thousand = 1,000')]),
        x('Each place is 10 times the place before it.', ['1', 'ones'], ' × 10 = ', ['10', 'tens'], ' × 10 = ', ['100', 'hundreds']),
        x('The pattern keeps going up to one million.', ['10,000', 'ten thousand'], ' × 10 = ', ['100,000', 'hundred thousand'], ' × 10 = ', ['1,000,000', 'one million']),
        note('A zero means a garage is empty. It is a placeholder.', 'Why zero matters', ['In 3,050 there are 0 hundreds', 'The 0 holds the place so the 3 stays in the thousands'])
      ] },

    { title: '2. The place value chart',
      explain: [
        'A place value chart gives every digit its own garage. Read the number from the left. The first digit sits in the biggest place.',
        'The value of a digit is the digit times its place. A 4 in the hundred thousands place is worth 4 × 100,000, which is 400,000.',
        'A zero in a place means that garage is empty.'
      ],
      rule: 'Value of a digit = the digit × the value of its place.',
      mistake: 'The digit and its value are not the same thing. The 8 in 80,000 is a digit 8, but its value is 80,000.',
      steps: [
        X('Look at this number. Each digit sits in its own place.', hiNum(3482051, {})),
        X('The 3 is in the millions place. It is worth 3,000,000.', hiNum(3482051, { 6: '3,000,000' })),
        X('The 4 is worth 400,000. The 8 is worth 80,000.', hiNum(3482051, { 5: '400,000', 4: '80,000' })),
        X('The 2 is in the thousands place. It is worth 2,000.', hiNum(3482051, { 3: '2,000' })),
        X('The 0 in the hundreds place is empty, so it is worth 0. The 5 is worth 50 and the 1 is worth 1.', hiNum(3482051, { 2: '0', 1: '50', 0: '1' })),
        x('Each value is the digit times its place.', ['8', 'digit'], ' × ', ['10,000', 'place'], ' = ', ['80,000', 'value'])
      ] },

    { title: '3. Reading and writing big numbers',
      explain: [
        'Big numbers are cut into groups of three digits. The commas show where the groups end. We call each group a period.',
        'To read a number, say each group and then say its name. The groups are millions, thousands and ones. We do not say the name ones.',
        'To write a number from words, write each group with three digits. Use zeros to fill any empty spots.'
      ],
      rule: 'Read one group at a time. After the first group, every group has 3 digits.',
      mistake: 'For "eight million, thirty thousand", do not write 830,000. The thousands group must be 030, so the answer is 8,030,000.',
      steps: [
        x('Here is a big number. The commas cut it into groups of three.', ['6', 'millions'], ',', ['204', 'thousands'], ',', ['057', 'ones']),
        note('Say each group, then its name.', 'Reading 6,204,057', ['6 is six million', '204 is two hundred four thousand', '057 is fifty seven']),
        note('Put it all together.', 'Say it', ['Six million, two hundred four thousand, fifty seven']),
        note('Now go backward. Write eight million, thirty thousand, nine hundred.', 'Split at the big words', ['eight million is 8', 'thirty thousand is 30', 'nine hundred is 900']),
        x('Every group after the first needs three digits. So 30 becomes 030.', ['8', 'millions'], ',', ['030', 'thirty thousand'], ',', ['900', 'ones']),
        x('Join the groups with commas. That is the answer.', ['8,030,900', 'answer'])
      ] },

    { title: '4. Expanded form',
      explain: [
        'Expanded form breaks a number into the value of each digit and adds them up. It shows exactly what each digit is worth.',
        'Skip any place that has a zero. A zero adds nothing to the total.',
        'You can also go backward. Add the parts and each part drops into its own place.'
      ],
      rule: 'Write the value of each digit and add. Skip the zeros.',
      mistake: 'Do not write the digits alone, like 2 + 7 + 5. Each part must be the full value, like 5,000.',
      steps: [
        X('Let us write 2,705,048 in expanded form.', hiNum(2705048, {})),
        X('The 2 is worth 2,000,000. The 7 is worth 700,000.', hiNum(2705048, { 6: '2,000,000', 5: '700,000' })),
        X('The 0 in the ten thousands place adds nothing. Skip it. The 5 is worth 5,000.', hiNum(2705048, { 4: 'skip', 3: '5,000' })),
        X('The 0 in the hundreds place is skipped too. The 4 is worth 40 and the 8 is worth 8.', hiNum(2705048, { 2: 'skip', 1: '40', 0: '8' })),
        x('Add the parts. This is expanded form.', '2,000,000 + 700,000 + 5,000 + 40 + 8'),
        x('Each part is a digit times its place.', '2 × 1,000,000 + 7 × 100,000 + 5 × 1,000 + 4 × 10 + 8 × 1'),
        x('Going back, add the parts and the digits fall into their places.', '2,000,000 + 700,000 + 5,000 + 40 + 8 = ', ['2,705,048', 'the number'])
      ] },

    { title: '5. Comparing numbers',
      explain: [
        'To compare two numbers, first count the digits. The number with more digits is bigger, because its first digit sits in a bigger place.',
        'If both numbers have the same number of digits, start at the left. Find the first place where the digits are different. The bigger digit wins.',
        'We use the signs greater than, less than and equal to. The open side of the sign faces the bigger number.'
      ],
      rule: 'Count digits first. Then compare from the left. The first difference decides.',
      mistake: 'Do not compare the last digits first. 384,562 is less than 384,652 even though the last digits are both 2. The difference is in the hundreds place, further left.',
      steps: [
        x('Which is bigger, 98,765 or 1,024,000?', '98,765', ' or ', '1,024,000'),
        note('Count the digits first. More digits means a bigger number.', 'Count digits', ['98,765 has 5 digits', '1,024,000 has 7 digits']),
        x('7 digits beats 5 digits. So 1,024,000 is greater.', ['1,024,000', 'greater'], ' > ', ['98,765', 'less']),
        x('Now try two numbers with the same number of digits. Compare 384,562 and 384,652.', '384,562', ' or ', '384,652'),
        X('Start at the left. The 3, the 8 and the 4 match in both numbers.', hiNum(384562, { 5: 'same', 4: 'same', 3: 'same' })),
        X('Now look at the next digits. 5 is less than 6, so the second number is bigger.', hiNum(384562, { 2: '5' }).concat([' or '], hiNum(384652, { 2: '6' }))),
        x('The open side of the sign faces the bigger number.', ['384,562', 'less'], ' < ', ['384,652', 'greater'])
      ] },

    { title: '6. Ordering numbers',
      explain: [
        'To put numbers in order, compare them two at a time, just like before. First sort by how many digits they have.',
        'Numbers with the same number of digits are compared from the left. Find the first place where they are different.',
        'Least to greatest means smallest first. Greatest to least means biggest first.'
      ],
      rule: 'Sort by digits first. Then compare from the left.',
      mistake: 'Do not forget a number. Count how many numbers you started with and check your list has the same amount.',
      steps: [
        x('Put these in order from least to greatest.', '45,320', ',  ', '4,532', ',  ', '45,302', ',  ', '45,230'),
        note('Count the digits. 4,532 has only 4 digits. The others have 5.', 'Digits', ['4,532 has 4 digits, so it is the least', 'The other three have 5 digits']),
        X('Compare the 5 digit numbers. They all start with 4 and 5. The next digit is 2 or 3.', hiNum(45320, { 2: '3' }).concat([',  '], hiNum(45302, { 2: '3' }), [',  '], hiNum(45230, { 2: '2' }))),
        x('45,230 has the smallest digit, 2. So it is the least of these three.', ['45,230', 'least of three']),
        X('Compare the last two. The next digit is 2 in one and 0 in the other.', hiNum(45320, { 1: '2' }).concat([' or '], hiNum(45302, { 1: '0' }))),
        x('0 is less than 2, so 45,302 comes before 45,320.', ['45,302', 'smaller'], ' < ', ['45,320', 'bigger']),
        x('Here is the list from least to greatest.', '4,532 < 45,230 < 45,302 < 45,320')
      ] },

    { title: '7. Rounding to the nearest ten, hundred or thousand',
      explain: [
        'Rounding swaps a number for a nearby friendly number that is easier to think about. A crowd of 3,672 fans is about 3,700 fans.',
        'Find the place you are rounding to. Look at the digit just to the right of it. If that digit is 5 or more, round up. If it is 4 or less, stay the same.',
        'Then turn every digit to the right of your place into a zero.'
      ],
      rule: '5 or more, go up. 4 or less, stay. Then zeros after the rounding place.',
      mistake: 'Do not look at the rounding digit itself. Look at the digit just to its right.',
      steps: [
        note('Rounding swaps a number for a friendly number that is close.', 'Why round?', ['A crowd of 3,672 fans is about 3,700', 'We round when a close number is good enough']),
        x('3,672 sits between two hundreds. They are 3,600 and 3,700.', '3,600', ' < ', ['3,672', 'our number'], ' < ', '3,700'),
        bars('Split the space into 10 equal steps. 3,672 is 7 steps past 3,600.', [fb('3,600 to 3,700', 10, 7, 'bg-indigo-400')]),
        bars('Halfway is 5 steps. We went past halfway, so 3,672 is closer to 3,700.', [fb('3,600 to 3,700', 10, 7, 'bg-indigo-400'), fb('Halfway', 10, 5, 'bg-amber-300')]),
        X('Here is the shortcut. Look at the digit just right of the hundreds place. It is 7.', hiNum(3672, { 2: 'rounding place', 1: 'look here' })),
        note('This is the rounding rule.', 'The rounding rule', ['5 or more: round up', '4 or less: stay the same', 'Digits after the rounding place become zero']),
        x('7 is 5 or more, so the 6 goes up to 7. The last digits become zeros.', '3,672 rounds to ', ['3,700', 'answer'])
      ] },

    { title: '8. Rounding bigger numbers',
      explain: [
        'Rounding a big number works exactly the same way. Only the place you are rounding to is different.',
        'Sometimes the digit that goes up is a 9. Then it becomes 0 and the next place goes up by 1. That is called carrying.',
        'Say the place name out loud before you start. Nearest hundred thousand means the rounding place is the hundred thousands place.'
      ],
      rule: 'Find the place. Look right. 5 or more goes up. Then zeros.',
      mistake: 'When a 9 goes up, do not write 10 in one place. Write 0 and add 1 to the place on its left.',
      steps: [
        X('Round 4,589,201 to the nearest hundred thousand. The 5 is in that place.', hiNum(4589201, { 5: 'rounding place' })),
        X('Look right. The next digit is 8.', hiNum(4589201, { 5: 'rounding place', 4: 'look here' })),
        X('8 is 5 or more. The 5 goes up to 6.', hiNum(4589201, { 5: 'goes up', 4: '5 or more' })),
        x('Every digit after it becomes a zero.', '4,589,201 rounds to ', ['4,600,000', 'answer']),
        X('Now round 2,349,870 to the nearest ten thousand. The 4 is in that place. The next digit is 9.', hiNum(2349870, { 4: 'rounding place', 3: 'look here' })),
        x('9 is 5 or more. The 4 goes up to 5.', '2,3', ['5', 'was 4'], '0,000'),
        x('Zeros fill the rest.', '2,349,870 rounds to ', ['2,350,000', 'answer']),
        note('A 9 that goes up makes a carry.', 'The carry trick', ['3,970 to the nearest hundred', 'The 9 goes up, so it becomes 0 and the 3 goes up to 4', 'The answer is 4,000'])
      ] },

    { title: '9. Multiplying by 10, 100 and 1,000',
      explain: [
        'When you multiply by 10, every digit moves one place to the left. Each digit becomes worth 10 times more.',
        'When you multiply by 100, every digit moves two places. When you multiply by 1,000, every digit moves three places.',
        'The empty places on the right fill up with zeros. So you add as many zeros as the number you multiply by has.'
      ],
      rule: 'Count the zeros in 10, 100 or 1,000. Add that many zeros.',
      mistake: 'Do not always add just one zero. 34 × 100 has two zeros, so it is 3,400, not 340.',
      steps: [
        note('Multiplying by 10 moves every digit one place to the left.', 'Times 10', ['Each digit becomes worth 10 times more', 'The empty ones place gets a zero']),
        x('Try 34 × 10. The 3 is in the tens place and the 4 is in the ones place.', ['3', 'tens'], ['4', 'ones']),
        x('Each digit moves one place left. The 3 goes to hundreds. The 4 goes to tens.', ['3', 'hundreds'], ['4', 'tens'], ['0', 'ones']),
        x('The empty ones place gets a zero.', '34 × 10 = ', ['340', 'answer']),
        x('For 100, move two places. That adds two zeros.', '34 × 100 = ', ['34', 'digits'], ['00', '2 zeros']),
        x('For 1,000, move three places. That adds three zeros.', '34 × 1,000 = ', ['34', 'digits'], ['000', '3 zeros']),
        note('Count the zeros in the number you multiply by.', 'Zero counting', ['10 has 1 zero, so add 1 zero', '100 has 2 zeros, so add 2 zeros', '1,000 has 3 zeros, so add 3 zeros']),
        x('A zero already inside the number stays put. Just add the new zeros at the end.', '205 × 100 = ', ['205', 'digits'], ['00', '2 zeros added'])
      ] },

    { title: '10. Dividing by 10, 100 and 1,000',
      explain: [
        'Dividing by 10 is the opposite of multiplying by 10. Every digit moves one place to the right.',
        'When the number ends in zeros, it is easy. Take off as many zeros as the number you divide by has.',
        'Dividing by 100 also answers a question: how many hundreds are in the number? There are 45 hundreds in 4,500.'
      ],
      rule: 'Take off as many zeros as 10, 100 or 1,000 has.',
      mistake: 'Only take off zeros that are at the end of the number. Zeros in the middle stay.',
      steps: [
        note('Dividing by 10 moves every digit one place to the right.', 'Divide by 10', ['Each digit becomes worth 10 times less', 'Zeros at the end come off']),
        x('Try 4,500 ÷ 10. Take one zero off the end.', ['450', 'one zero removed']),
        x('Now 4,500 ÷ 100. Take two zeros off.', '4,500 ÷ 100 = ', ['45', 'two zeros removed']),
        x('And 45,000 ÷ 1,000. Take three zeros off.', '45,000 ÷ 1,000 = ', ['45', 'three zeros removed']),
        note('This also counts groups. How many hundreds are in 4,500? Divide by 100.', 'How many hundreds?', ['4,500 ÷ 100 = 45', 'So there are 45 hundreds in 4,500']),
        x('Check with times. Multiplying goes the other way.', ['45', 'answer'], ' × 100 = ', ['4,500', 'we started here'])
      ] },

    { title: '11. Estimating with rounding',
      explain: [
        'An estimate is a smart guess that is close to the real answer. It helps you check if an answer makes sense, and it is fast.',
        'To estimate, round each number first. Then do the easy math on the friendly numbers.',
        'Round to the place that leaves you with easy numbers, like the nearest thousand for four digit numbers.'
      ],
      rule: 'Round each number first. Then do the easy math.',
      mistake: 'An estimate is not the exact answer. Do not do the exact math and then round at the end.',
      steps: [
        x('Estimate 4,872 + 3,215. Round each number to the nearest thousand.', '4,872 + 3,215'),
        x('4,872 is closer to 5,000.', '4,872 is about ', ['5,000', 'rounded']),
        x('3,215 is closer to 3,000.', '3,215 is about ', ['3,000', 'rounded']),
        x('Now add the friendly numbers in your head.', '5,000 + 3,000 = ', ['8,000', 'estimate']),
        x('The exact answer is 8,087. Our estimate is very close, so it makes sense.', ['8,000', 'estimate'], ' and ', ['8,087', 'exact']),
        x('It works for taking away too. Estimate 9,180 − 4,790.', '9,000 − 5,000 = ', ['4,000', 'estimate']),
        note('Use estimates to check your work.', 'Why estimate?', ['If the exact answer is far from the estimate, look for a mistake', 'Estimates are quick and you can do them in your head'])
      ] }
  ];

  /* ---------- Question skills ---------- */

  /* Shared rounding question builder */
  function roundQ(lg, len, promptFn, skillName) {
    var n = randNum(len);
    if (R.int(0, 4) === 0 && lg >= 1) { /* sometimes make the next digit exactly 5 to test the halfway rule */
      n = n - digitAt(n, lg - 1) * pow10(lg - 1) + 5 * pow10(lg - 1);
    }
    var p = pow10(lg), r = rnd(n, p), t = digitAt(n, lg), nx = digitAt(n, lg - 1), up = nx >= 5;
    var floorV = n - (n % p);
    var traps = [];
    if (up) traps.push(T(floorV, 'You rounded down. The next digit is ' + nx + ', which is 5 or more, so the ' + t + ' goes up.'));
    else traps.push(T(floorV + p, 'You rounded up. The next digit is ' + nx + ', which is 4 or less, so the ' + t + ' stays the same.'));
    traps.push(T(r + (n % p), 'The rounding place changed, but the digits after it must all become zeros.'));
    if (lg >= 2) traps.push(T(rnd(n, pow10(lg - 1)), 'That rounds to the ' + SING[lg - 1] + ' place. This question asks for the nearest ' + SING[lg] + '.'));
    var steps = [
      X('Round ' + fmt(n) + ' to the nearest ' + SING[lg] + '. Find the ' + PLACES[lg] + ' place.', hiNum(n, (function () { var o = {}; o[lg] = 'rounding place'; return o; })())),
      X('Look at the digit just to the right. It is ' + nx + '.', hiNum(n, (function () { var o = {}; o[lg] = 'rounding place'; o[lg - 1] = 'look here'; return o; })())),
      (function () {
        var o = {}; o[lg] = up ? 'goes up' : 'stays'; o[lg - 1] = up ? '5 or more' : '4 or less';
        var cap = up ? (nx + ' is 5 or more, so the ' + t + ' goes up by 1.' + (t === 9 ? ' It becomes 0 and we carry 1 to the next place.' : ''))
                     : (nx + ' is 4 or less, so the ' + t + ' stays the same.');
        return X(cap, hiNum(n, o));
      })(),
      (function () { var o = {}; o[lg - 1] = 'zeros'; for (var k = 0; k < lg - 1; k++) o[k] = ''; return X('Every digit to the right of the ' + PLACES[lg] + ' place becomes zero.', hiNum(r, o)); })(),
      x(fmt(n) + ' rounds to ' + fmt(r) + '.', [fmt(r), 'answer'])
    ];
    return Q.num({
      skill: skillName, prompt: promptFn(fmt(n), SING[lg]), answer: r, keyboard: 'numeric', placeholder: 'Type a whole number',
      traps: clean(traps, r),
      work: 'The ' + PLACES[lg] + ' digit is ' + t + '. The next digit is ' + nx + ', so we go ' + (up ? 'up' : 'nowhere') + '. The answer is ' + fmt(r) + '.',
      plain: 'Look at the digit just to the right of your place. 5 or more, go up. 4 or less, stay. Then make the rest zeros.',
      teach: steps
    });
  }

  B.register(1, [

    { id: 'dvalue', level: 1, name: 'Value of a digit', make: function () {
      var len = R.int(4, 7), digs = R.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, len);
      var n = parseInt(digs.join(''), 10), pos = R.int(1, len - 1), d = digs[len - 1 - pos], unit = pow10(pos), val = d * unit;
      var tg = {}; tg[pos] = 'this digit';
      var places = PLACES.slice(0, pos + 1).map(function (p, i) { return (i + 1) + '. ' + p; });
      return Q.num({
        skill: 'Value of a digit', prompt: 'What is the value of the digit ' + d + ' in ' + fmt(n) + '?',
        answer: val, keyboard: 'numeric', placeholder: 'Type a number',
        traps: clean([T(d, 'That is the digit itself. Its value depends on the place it sits in.'),
                      T(val * 10, 'That is one place too far to the left. Count the places again from the right.'),
                      T(val / 10, 'That is one place too far to the right. Count the places again from the right.')], val),
        work: 'The ' + d + ' is in the ' + PLACES[pos] + ' place, so its value is ' + d + ' × ' + fmt(unit) + ' = ' + fmt(val) + '.',
        plain: 'A digit is worth more when it sits further left. Multiply the digit by its place.',
        teach: [
          X('We want the value of the ' + d + ' in this number.', hiNum(n, tg)),
          note('Count the places from the right. The first place is ones.', 'Places from the right', places),
          X('The ' + d + ' sits in the ' + PLACES[pos] + ' place.', hiNum(n, (function () { var o = {}; o[pos] = PLACES[pos]; return o; })())),
          x('One ' + SING[pos] + ' is worth ' + fmt(unit) + '. We have ' + d + ' of them.', d + ' × ' + fmt(unit) + ' = ', [fmt(val), 'value']),
          x('So the value of the ' + d + ' is ' + fmt(val) + '.', [fmt(val), 'answer'])
        ]
      });
    } },

    { id: 'placech', level: 1, name: 'Name the place', make: function () {
      var len = R.int(4, 7), digs = R.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, len);
      var n = parseInt(digs.join(''), 10), pos = R.int(1, len - 1), d = digs[len - 1 - pos];
      var others = [pos - 1, pos + 1, pos - 2, pos + 2].filter(function (i) { return i >= 0 && i <= 6; }).slice(0, 2);
      var opts = [{ text: PLACES[pos], ok: true }];
      others.forEach(function (i) {
        opts.push({ text: PLACES[i], ok: false, trap: 'Count the places again from the right. Ones, tens, hundreds, thousands, ten thousands, hundred thousands, millions.' });
      });
      var tg = {}; tg[pos] = 'which place?';
      return Q.choice({
        skill: 'Name the place', prompt: 'In the number ' + fmt(n) + ', which place is the digit ' + d + ' in?', options: opts,
        work: 'Counting from the right, the ' + d + ' is in the ' + PLACES[pos] + ' place.',
        plain: 'Start at the right with ones. Move left one place at a time until you reach the digit.',
        teach: [
          X('Which place holds the ' + d + '?', hiNum(n, tg)),
          note('Count from the right.', 'The places', PLACES.slice(0, pos + 1).map(function (p, i) { return (i + 1) + '. ' + p; })),
          X('The ' + d + ' is in the ' + PLACES[pos] + ' place.', hiNum(n, (function () { var o = {}; o[pos] = PLACES[pos]; return o; })())),
          x('So the answer is ' + PLACES[pos] + '.', [PLACES[pos], 'answer'])
        ]
      });
    } },

    { id: 'words', level: 2, name: 'Words to digits', make: function () {
      var m = R.pick([0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      var t = R.pick([R.int(1, 99), R.int(100, 999), R.int(100, 999), R.int(1, 9) * 100, R.int(1, 9) * 100 + R.int(1, 9), R.int(1, 9) * 10]);
      if (m > 0 && R.int(0, 4) === 0) t = 0;
      if (m === 0) t = R.int(100, 999);
      var o = R.pick([R.int(1, 99), R.int(100, 999), R.int(1, 9) * 100, R.int(1, 9) * 100 + R.int(1, 9), R.int(1, 9) * 10]);
      if (R.int(0, 5) === 0) o = 0;
      var n = m * 1000000 + t * 1000 + o;
      var concat = String(m || '') + String(t || '') + String(o || '');
      var pieces = [];
      if (m) pieces.push('million part: ' + words3(m) + ' is ' + m);
      if (t) pieces.push('thousand part: ' + words3(t) + ' is ' + t);
      if (o) pieces.push('ones part: ' + words3(o) + ' is ' + o);
      var steps = [note('Split the words at million and thousand. Each part is one group.', 'The groups', pieces)];
      if (m) steps.push(x('The million group is ' + m + '. It has one digit.', [String(m), 'millions']));
      steps.push(t ? x('The thousand group is ' + t + '. A group needs 3 digits, so we write ' + pad3(t) + (m ? '.' : ', but the first group can drop leading zeros.'), [m ? pad3(t) : String(t), 'thousands'])
                   : x('There are no thousand words, so the thousands group is 000.', ['000', 'thousands']));
      steps.push(o ? x('The last group is ' + o + '. It needs 3 digits, so we write ' + pad3(o) + '.', [pad3(o), 'ones'])
                   : x('There are no words after thousand, so the ones group is 000.', ['000', 'ones']));
      steps.push(x('Join the groups with commas.', [fmt(n), 'answer']));
      return Q.num({
        skill: 'Write a number from words', prompt: 'Write this number using digits: ' + toWords(n) + '.',
        answer: n, keyboard: 'numeric', placeholder: 'Type the number',
        traps: clean([T(concat, 'Some zeros are missing. After the first group, every group needs 3 digits. Use 0 to fill empty places.'),
                        T(n * 10, 'That has one digit too many. Each group after the first has exactly 3 digits.')], n),
        work: toWords(n) + ' is ' + fmt(n) + '.',
        plain: 'Write each group with three digits. Fill any empty spots with zeros.',
        teach: steps
      });
    } },

    { id: 'expanded', level: 2, name: 'Expanded form', make: function () {
      var mode = R.int(0, 1);
      var len = R.int(5, 7), digs = [R.int(1, 9)], i;
      for (i = 1; i < len; i++) digs.push(R.int(0, 3) === 0 ? 0 : R.int(1, 9));
      digs[len - 1] = R.int(1, 9);
      var n = parseInt(digs.join(''), 10), parts = [], nz = [];
      for (i = 0; i < len; i++) { if (digs[i] > 0) { parts.push({ v: digs[i] * pow10(len - 1 - i), pos: len - 1 - i, d: digs[i] }); } }
      if (mode === 0) {
        var expr = parts.map(function (p) { return fmt(p.v); }).join(' + ');
        var plainDigits = parts.map(function (p) { return p.d; }).join('');
        var tags = {};
        parts.forEach(function (p) { tags[p.pos] = fmt(p.v); });
        return Q.num({
          skill: 'Expanded form', prompt: 'Write this as one number: ' + expr,
          answer: n, keyboard: 'numeric', placeholder: 'Type the number',
          traps: clean([T(plainDigits, 'Each part goes in its own place. A place with no part needs a 0.'),
                        T(parts.reduce(function (acc, p) { return acc + p.d; }, 0), 'You added only the digits. Each part is worth much more than its digit. Add the full parts.')], n),
          work: expr + ' = ' + fmt(n) + '.',
          plain: 'Put each part in its own place. Places with no part get a zero.',
          teach: [
            x('Here are the parts. Each one is the value of a digit.', expr),
            note('Look at the place of each part.', 'Where each part goes', parts.map(function (p) { return fmt(p.v) + ' has a ' + p.d + ' in the ' + PLACES[p.pos] + ' place'; })),
            X('Any place with no part gets a zero.', hiNum(n, tags)),
            x('Read the digits together.', [fmt(n), 'answer'])
          ]
        });
      }
      var k = R.int(0, parts.length - 1), miss = parts[k];
      var expr2 = parts.map(function (p, j) { return j === k ? '?' : fmt(p.v); }).join(' + ');
      var tg = {}; tg[miss.pos] = 'missing';
      return Q.num({
        skill: 'Expanded form', prompt: 'Find the missing part. ' + fmt(n) + ' = ' + expr2,
        answer: miss.v, keyboard: 'numeric', placeholder: 'Type the missing part',
        traps: clean([T(miss.d, 'That is only the digit. The part must be the full value of that digit in its place.'),
                        T(miss.v * 10, 'That is one place too far to the left. Count the places again from the right.'),
                        T(miss.v / 10, 'That is one place too far to the right. Count the places again from the right.')], miss.v),
        work: 'The ' + miss.d + ' is in the ' + PLACES[miss.pos] + ' place, so the part is ' + fmt(miss.v) + '.',
        plain: 'Find the digit that has no part in the sum. Then give its full value.',
        teach: [
          x('We need the part that is missing from the sum.', fmt(n) + ' = ' + expr2),
          X('Check each digit in ' + fmt(n) + '. One digit has no part yet.', hiNum(n, tg)),
          x('That digit is ' + miss.d + ' in the ' + PLACES[miss.pos] + ' place.', miss.d + ' × ' + fmt(pow10(miss.pos)) + ' = ', [fmt(miss.v), 'value']),
          x('So the missing part is ' + fmt(miss.v) + '.', [fmt(miss.v), 'answer'])
        ]
      });
    } },

    { id: 'compare', level: 2, name: 'Compare numbers', make: function () {
      var mode = R.pick(['greatest', 'smallest', 'sign']), i;
      if (mode !== 'sign') {
        var len = R.int(5, 7), k = R.int(0, len - 2), pos = len - 1 - k;
        var pool = k === 0 ? [1, 2, 3, 4, 5, 6, 7, 8, 9] : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var three = R.shuffle(pool).slice(0, 3);
        var prefix = [];
        for (i = 0; i < k; i++) prefix.push(i === 0 ? R.int(1, 9) : R.int(0, 9));
        var nums = three.map(function (dg) {
          var s = prefix.join('') + dg;
          for (var j = k + 1; j < len; j++) s += R.int(0, 9);
          return parseInt(s, 10);
        });
        var best = mode === 'greatest' ? Math.max.apply(null, nums) : Math.min.apply(null, nums);
        var word = mode === 'greatest' ? 'greatest' : 'smallest';
        var opts = nums.map(function (v) {
          return { text: fmt(v), ok: v === best, trap: 'Not that one. Compare from the left. The first place where the digits differ is the ' + PLACES[pos] + ' place.' };
        });
        var dbest = digitAt(best, pos);
        var hiAll = hiNum(nums[0], (function () { var o = {}; o[pos] = String(digitAt(nums[0], pos)); return o; })())
          .concat([' or '], hiNum(nums[1], (function () { var o = {}; o[pos] = String(digitAt(nums[1], pos)); return o; })()), [' or '], hiNum(nums[2], (function () { var o = {}; o[pos] = String(digitAt(nums[2], pos)); return o; })()));
        return Q.choice({
          skill: 'Compare numbers', prompt: 'Which number is the ' + word + '? ' + nums.map(fmt).join(' or '), options: opts,
          work: 'All three have ' + len + ' digits. They first differ in the ' + PLACES[pos] + ' place. The ' + word + ' has ' + dbest + ' there.',
          plain: 'Line the numbers up and compare from the left. The first place where they differ decides.',
          teach: [
            X('We look for the ' + word + '. All three have ' + len + ' digits, so we start at the left.', [fmt(nums[0]), ' or ', fmt(nums[1]), ' or ', fmt(nums[2])]),
            X(k === 0 ? 'The very first digits already differ.' : 'The digits match until the ' + PLACES[pos] + ' place.', hiAll),
            note('Compare the digits in the ' + PLACES[pos] + ' place.', 'The ' + PLACES[pos] + ' digits', nums.map(function (v) { return fmt(v) + ' has ' + digitAt(v, pos); })),
            x('The ' + word + ' digit there is ' + dbest + '. So ' + fmt(best) + ' is the ' + word + '.', [fmt(best), word])
          ]
        });
      }
      /* sign mode */
      var a, b, la = R.int(5, 7);
      var kind = R.pick(['digits', 'same', 'same', 'equal']);
      a = randNum(la);
      if (kind === 'digits') { b = randNum(la === 7 ? 6 : la + 1); }
      else if (kind === 'equal') { b = a; }
      else {
        var kk = R.int(0, la - 2), pp = la - 1 - kk, sa = String(a), sb = sa.slice(0, kk), da = parseInt(sa.charAt(kk), 10), db;
        do { db = R.int(kk === 0 ? 1 : 0, 9); } while (db === da);
        sb += db;
        for (var j = kk + 1; j < la; j++) sb += R.int(0, 9);
        b = parseInt(sb, 10);
      }
      var right = a > b ? 'greater than' : (a < b ? 'less than' : 'equal to');
      var opts2 = ['greater than', 'less than', 'equal to'].map(function (t) {
        return { text: t, ok: t === right, trap: 'Not quite. Count the digits first. If they match, compare from the left.' };
      });
      var st = [X('We compare ' + fmt(a) + ' and ' + fmt(b) + '.', [fmt(a), ' and ', fmt(b)]),
        note('There are two steps. Count the digits first. If the counts match, compare from the left.', 'The plan', ['Count the digits', 'If they match, compare from the left'])];
      if (String(a).length !== String(b).length) {
        st.push(note('Count the digits. More digits means a bigger number.', 'Count digits', [fmt(a) + ' has ' + String(a).length + ' digits', fmt(b) + ' has ' + String(b).length + ' digits']));
      } else if (a === b) {
        st.push(x('Both have ' + String(a).length + ' digits. We check every place from the left.', [fmt(a), 'all match']));
      } else {
        var dpos = 0;
        for (var q = String(a).length - 1; q >= 0; q--) { if (digitAt(a, q) !== digitAt(b, q)) { dpos = q; break; } }
        var t1 = {}, t2 = {}; t1[dpos] = String(digitAt(a, dpos)); t2[dpos] = String(digitAt(b, dpos));
        st.push(X('Both have the same number of digits. The first difference is in the ' + PLACES[dpos] + ' place.', hiNum(a, t1).concat([' and '], hiNum(b, t2))));
      }
      st.push(x('So ' + fmt(a) + ' is ' + right + ' ' + fmt(b) + '.', [fmt(a), ''], ' is ' + right + ' ', [fmt(b), '']));
      return Q.choice({
        skill: 'Compare numbers', prompt: 'Choose the right words. ' + fmt(a) + ' is ______ ' + fmt(b) + '.', options: opts2,
        work: fmt(a) + ' is ' + right + ' ' + fmt(b) + '.',
        plain: 'More digits means bigger. If the digits are the same, compare from the left.',
        teach: st
      });
    } },

    { id: 'morless', level: 3, name: 'More or less by a power of ten', make: function () {
      var j = R.int(3, 5), len = R.int(j + 2, 7), more = R.int(0, 1) === 1, i, digs = [];
      for (i = 0; i < len; i++) digs.push(i === 0 ? R.int(1, 8) : R.int(0, 9));
      digs[len - 1 - j] = more ? R.int(0, 8) : R.int(1, 9);
      var n = parseInt(digs.join(''), 10), k = pow10(j), ans = more ? n + k : n - k, dj = digitAt(n, j), d2 = more ? dj + 1 : dj - 1;
      var word = more ? 'more' : 'less';
      var tg = {}; tg[j] = 'this place';
      var tg2 = {}; tg2[j] = dj + ' becomes ' + d2;
      var tg3 = {}; tg3[j] = 'new digit';
      return Q.num({
        skill: 'More or less', prompt: 'What is ' + fmt(k) + ' ' + word + ' than ' + fmt(n) + '?',
        answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: clean([T(more ? n + k / 10 : n - k / 10, 'You changed the ' + PLACES[j - 1] + ' place. ' + fmt(k) + ' changes the ' + PLACES[j] + ' place.'),
                      T(more ? n + k * 10 : n - k * 10, 'You changed the ' + PLACES[j + 1] + ' place. ' + fmt(k) + ' changes the ' + PLACES[j] + ' place.'),
                      T(more ? n - k : n + k, 'That goes the wrong way. ' + (more ? 'More means bigger.' : 'Less means smaller.'))], ans),
        work: fmt(k) + ' is one ' + SING[j] + '. The ' + dj + ' in the ' + PLACES[j] + ' place becomes ' + d2 + '. The answer is ' + fmt(ans) + '.',
        plain: 'Find the place that ' + fmt(k) + ' lives in. Change only that digit by 1.',
        teach: [
          X('We need ' + fmt(k) + ' ' + word + ' than ' + fmt(n) + '. Only one place will change.', hiNum(n, tg)),
          x('Count the zeros in ' + fmt(k) + '. It has ' + j + '. So it is one ' + SING[j] + '.', [fmt(k), 'one ' + SING[j]]),
          X('The digit in the ' + PLACES[j] + ' place is ' + dj + '. ' + (more ? 'Add 1.' : 'Take away 1.') + ' It becomes ' + d2 + '.', hiNum(n, tg2)),
          X('All the other digits stay the same.', hiNum(ans, tg3)),
          x('So ' + fmt(k) + ' ' + word + ' than ' + fmt(n) + ' is ' + fmt(ans) + '.', [fmt(ans), 'answer'])
        ]
      });
    } },

    { id: 'roundsmall', level: 3, name: 'Round to ten, hundred, thousand', make: function () {
      var lg = R.int(1, 3), len = R.int(Math.max(3, lg + 1), Math.min(5, lg + 2));
      return roundQ(lg, len, function (s, w) { return 'Round ' + s + ' to the nearest ' + w + '.'; }, 'Rounding whole numbers');
    } },

    { id: 'shift', level: 3, name: 'Multiply or divide by 10, 100, 1,000', make: function () {
      var j = R.int(1, 3), k = pow10(j), zs = plural(j, 'zero');
      if (R.int(0, 1) === 0) {
        var n = R.int(2, 999);
        if (n % 10 === 0) n += R.int(1, 9);
        var ans = n * k;
        return Q.num({
          skill: 'Multiply by 10, 100, 1,000', prompt: 'What is ' + n + ' × ' + fmt(k) + '?',
          answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
          traps: clean([T(n * k / 10, 'You added one zero too few. ' + fmt(k) + ' has ' + zs + ', so add ' + zs + '.'),
                        T(n * k * 10, 'You added one zero too many. ' + fmt(k) + ' has ' + zs + ', so add ' + zs + '.')], ans),
          work: 'Add ' + zs + ' to ' + n + '. ' + n + ' × ' + fmt(k) + ' = ' + fmt(ans) + '.',
          plain: 'Multiplying by ' + fmt(k) + ' moves every digit ' + j + ' place' + (j > 1 ? 's' : '') + ' to the left. Zeros fill the empty spots.',
          teach: [
            x('Count the zeros in ' + fmt(k) + '. It has ' + zs + '.', [String(n), 'number'], ' × ', [fmt(k), zs]),
            x('Keep the digits of ' + n + ' the same.', [String(n), 'same digits']),
            x('Add ' + zs + ' to the end. They fill the empty places.', [String(n), 'digits'], [zeros(j), zs + ' added']),
            x('So ' + n + ' × ' + fmt(k) + ' = ' + fmt(ans) + '.', [fmt(ans), 'answer'])
          ]
        });
      }
      var base = R.int(2, 999);
      if (base % 10 === 0) base += R.int(1, 9);
      var dv = base * k;
      return Q.num({
        skill: 'Divide by 10, 100, 1,000', prompt: 'What is ' + fmt(dv) + ' ÷ ' + fmt(k) + '?',
        answer: base, keyboard: 'numeric', placeholder: 'Type a number',
        traps: clean([T(base * 10, 'You took off one zero too few. ' + fmt(k) + ' has ' + zs + ', so take off ' + zs + '.'),
                      T(base / 10, 'You took off one zero too many. ' + fmt(k) + ' has ' + zs + ', so take off ' + zs + '.')], base),
        work: 'Take ' + zs + ' off the end of ' + fmt(dv) + '. The answer is ' + base + '.',
        plain: 'Dividing by ' + fmt(k) + ' moves every digit ' + j + ' place' + (j > 1 ? 's' : '') + ' to the right. Zeros at the end come off.',
        teach: [
          x('Count the zeros in ' + fmt(k) + '. It has ' + zs + '.', [fmt(dv), 'number'], ' ÷ ', [fmt(k), zs]),
          x('Take ' + zs + ' off the end of ' + fmt(dv) + '.', [String(base), 'stays'], [zeros(j), zs + ' removed']),
          x('What is left is the answer.', [String(base), 'answer']),
          x('Check with times. ' + base + ' × ' + fmt(k) + ' should give ' + fmt(dv) + '.', base + ' × ' + fmt(k) + ' = ', [fmt(dv), 'we started here'])
        ]
      });
    } },

    { id: 'howmany', level: 4, name: 'How many tens, hundreds, thousands', make: function () {
      var lg = R.int(1, 3), base = R.int(12, 999);
      if (base % 10 === 0) base += R.int(1, 9);
      var n = base * pow10(lg), unit = pow10(lg), wordU = PLACES[lg];
      return Q.num({
        skill: 'How many groups', prompt: 'How many ' + wordU + ' are in ' + fmt(n) + '?',
        answer: base, keyboard: 'numeric', placeholder: 'Type a number',
        traps: clean([T(n, 'That is the whole number. Each ' + SING[lg] + ' is worth ' + fmt(unit) + ', so we divide to count them.'),
                      T(base * 10, 'You took off one zero too few. ' + fmt(unit) + ' has ' + plural(lg, 'zero') + '.'),
                      T(base / 10, 'You took off one zero too many. ' + fmt(unit) + ' has ' + plural(lg, 'zero') + '.')], base),
        work: fmt(n) + ' ÷ ' + fmt(unit) + ' = ' + base + '.',
        plain: 'Each group is worth ' + fmt(unit) + '. Divide to see how many groups fit.',
        teach: [
          x('One ' + SING[lg] + ' is worth ' + fmt(unit) + '. We ask how many ' + fmt(unit) + 's fit in ' + fmt(n) + '.', [fmt(n), 'total'], ' ÷ ', [fmt(unit), 'one ' + SING[lg]]),
          x(fmt(unit) + ' has ' + plural(lg, 'zero') + '. Take that many zeros off the end.', [String(base), 'stays'], [zeros(lg), 'removed']),
          x('So there are ' + base + ' ' + wordU + ' in ' + fmt(n) + '.', [String(base), 'answer']),
          x('Check. ' + base + ' × ' + fmt(unit) + ' gives back the number.', base + ' × ' + fmt(unit) + ' = ', [fmt(n), 'total'])
        ]
      });
    } },

    { id: 'roundbig', level: 4, name: 'Round big numbers', make: function () {
      var lg = R.int(4, 6), len = R.int(lg + 1, Math.min(7, lg + 2));
      return roundQ(lg, len, function (s, w) { return 'Round ' + s + ' to the nearest ' + w + '.'; }, 'Rounding big numbers');
    } },

    { id: 'estimate', level: 5, name: 'Estimate a sum or difference', make: function () {
      var lg = R.int(2, 4), plus = R.int(0, 1) === 1, a, b, ra, rb, tries = 0;
      do {
        a = randNum(R.int(lg + 1, lg + 2)); b = randNum(R.int(lg + 1, lg + 2)); ra = rnd(a, pow10(lg)); rb = rnd(b, pow10(lg)); tries++;
      } while (((ra === a && rb === b) || (!plus && (a <= b || ra <= rb))) && tries < 200);
      if (!plus && (a <= b || ra <= rb)) { a = 9 * pow10(lg + 1) + 4321 % pow10(lg + 1); b = 3 * pow10(lg + 1) + 1234 % pow10(lg + 1); ra = rnd(a, pow10(lg)); rb = rnd(b, pow10(lg)); }
      var op = plus ? ' + ' : ' − ', ans = plus ? ra + rb : ra - rb, exact = plus ? a + b : a - b, sign = plus ? 'sum' : 'difference';
      var traps = [T(exact, 'That is the exact answer. An estimate rounds each number first so the math is easy.')];
      if (rnd(a, pow10(lg)) !== a) traps.push(T(plus ? ra + b : ra - b, 'You rounded only one number. Round both numbers before you ' + (plus ? 'add' : 'take away') + '.'));
      return Q.num({
        skill: 'Estimate with rounding', prompt: 'Estimate ' + fmt(a) + op + fmt(b) + ' by rounding each number to the nearest ' + SING[lg] + '.',
        answer: ans, keyboard: 'numeric', placeholder: 'Type your estimate',
        traps: clean(traps, ans),
        work: fmt(a) + ' is about ' + fmt(ra) + ' and ' + fmt(b) + ' is about ' + fmt(rb) + '. Then ' + fmt(ra) + op + fmt(rb) + ' = ' + fmt(ans) + '.',
        plain: 'Round both numbers to friendly numbers. Then the math is easy to do in your head.',
        teach: [
          x('We round both numbers to the nearest ' + SING[lg] + ' first.', fmt(a) + op + fmt(b)),
          x('Round ' + fmt(a) + ' to the nearest ' + SING[lg] + '. It is about ' + fmt(ra) + '.', fmt(a) + ' is about ', [fmt(ra), 'rounded']),
          x('Round ' + fmt(b) + ' to the nearest ' + SING[lg] + '. It is about ' + fmt(rb) + '.', fmt(b) + ' is about ', [fmt(rb), 'rounded']),
          x('Now ' + (plus ? 'add' : 'take away') + ' the friendly numbers.', fmt(ra) + op + fmt(rb) + ' = ', [fmt(ans), 'estimate']),
          x('The exact ' + sign + ' is ' + fmt(exact) + '. Our estimate is close.', [fmt(ans), 'estimate'], ' and ', [fmt(exact), 'exact'])
        ]
      });
    } },

    { id: 'roundstory', level: 5, name: 'Rounding in a story', make: function () {
      var t = R.pick([
        { lg: 3, len: 5, p: function (s) { return 'A stadium sold ' + s + ' tickets. A news report rounds to the nearest thousand. What number does the report say?'; } },
        { lg: 4, len: 5, p: function (s) { return 'A town has ' + s + ' people. A sign rounds the number to the nearest ten thousand. What number is on the sign?'; } },
        { lg: 5, len: 6, p: function (s) { return 'A video was watched ' + s + ' times. Mia tells her friends the number to the nearest hundred thousand. What does she say?'; } },
        { lg: 3, len: 6, p: function (s) { return 'A store made $' + s + ' last year. Its poster rounds the amount to the nearest thousand dollars. What amount is on the poster?'; } },
        { lg: 1, len: 3, p: function (s) { return 'A jar holds ' + s + ' beads. Rinka rounds the number to the nearest ten. What does she write?'; } },
        { lg: 2, len: 4, p: function (s) { return 'A library has ' + s + ' books. A sign rounds the number to the nearest hundred. What number is on the sign?'; } }
      ]);
      return roundQ(t.lg, t.len, function (s) { return t.p(s); }, 'Rounding in a story');
    } },

    { id: 'build', level: 6, name: 'Build the greatest or smallest number', make: function () {
      var len = R.int(5, 6), pool = R.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
      var digs = pool.slice(0, len);
      if (digs.indexOf(0) < 0 && R.int(0, 1) === 0) digs[len - 1] = 0;
      var greatest = R.int(0, 1) === 0;
      var desc = digs.slice().sort(function (p, q) { return q - p; });
      var asc = digs.slice().sort(function (p, q) { return p - q; });
      var small = asc.slice();
      if (small[0] === 0) { var idx = 0; while (small[idx] === 0) idx++; var tmp = small[idx]; small.splice(idx, 1); small.unshift(tmp); }
      var ans = parseInt((greatest ? desc : small).join(''), 10);
      var g = parseInt(desc.join(''), 10), s = parseInt(small.join(''), 10);
      var traps = [T(greatest ? s : g, 'That is the ' + (greatest ? 'smallest' : 'greatest') + ' number. The question asks for the ' + (greatest ? 'greatest' : 'smallest') + '.')];
      if (!greatest && asc[0] === 0) traps.push(T(parseInt(asc.join(''), 10), 'A number cannot start with 0. That number only has ' + (len - 1) + ' digits. Use the smallest digit that is not zero first.'));
      var sorted = greatest ? desc : asc;
      var st = [
        x('We use each digit once: ' + digs.join(', ') + '. We want the ' + (greatest ? 'greatest' : 'smallest') + ' number.', digs.join('  '))
      ];
      if (greatest) {
        st.push(note('The biggest digit goes in the biggest place, on the left.', 'Greatest number rule', ['Sort the digits from biggest to smallest', 'Write them in that order']));
        st.push(x('Sorted from biggest to smallest.', desc.join('  ')));
      } else {
        st.push(note('The smallest digit goes in the biggest place. But a number cannot start with 0.', 'Smallest number rule', ['Sort the digits from smallest to biggest', 'If the first digit is 0, swap in the smallest digit that is not 0']));
        st.push(x(asc[0] === 0 ? 'Sorted smallest first. It starts with 0, so we cannot use it yet.' : 'Sorted from smallest to biggest.', asc.join('  ')));
        if (asc[0] === 0) st.push(x('Put the smallest digit that is not 0 first. The 0 goes second.', small.join('  ')));
      }
      st.push(x('Write the digits together. The answer is ' + fmt(ans) + '.', [fmt(ans), 'answer']));
      return Q.num({
        skill: 'Build a number', prompt: 'Use each of the digits ' + digs.join(', ') + ' exactly once. What is the ' + (greatest ? 'greatest' : 'smallest') + ' ' + len + ' digit number you can make?',
        answer: ans, keyboard: 'numeric', placeholder: 'Type the number',
        traps: clean(traps, ans),
        work: 'Order the digits ' + (greatest ? 'from biggest to smallest' : 'from smallest to biggest, with no zero at the front') + '. The answer is ' + fmt(ans) + '.',
        plain: (greatest ? 'Put the biggest digits on the left.' : 'Put the smallest digits on the left, but never start with zero.'),
        teach: st
      });
    } }
  ]);
})();
