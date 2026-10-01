/* Module 11: Estimating Answers. Lessons, vocabulary and question skills. */
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
  function fmt(n) { return R.fmt(n); }
  /* round to the nearest place (10, 100, 1000). A tie goes up. */
  function rnd(n, place) { return Math.floor((n + place / 2) / place) * place; }
  function flo(n, place) { return Math.floor(n / place) * place; }
  function pname(place) { return { 10: 'ten', 100: 'hundred', 1000: 'thousand' }[place]; }
  function dname(place) { return { 10: 'ones', 100: 'tens', 1000: 'hundreds' }[place]; }
  function zeros(n) { var s = String(n); return s.length - s.replace(/0+$/, '').length; }
  function nz(n) { return String(n).replace(/0+$/, ''); }
  function usd(c) { return '$' + (c / 100).toFixed(2); }
  function dol(c) { return Math.floor((c + 50) / 100); }
  function dtext(n) { return '$' + fmt(n); }
  function front(n) { var s = String(n); return +(s.charAt(0) + new Array(s.length).join('0')); }

  /* A number line for rounding. lo and hi are the two neighbours. n is marked with a star. */
  function rl(lo, hi, n) {
    var W = 30, pos = Math.round((n - lo) / (hi - lo) * W), mid = W / 2, k;
    var ax = [], lab = [], mk = [];
    for (k = 0; k < W + 14; k++) { ax.push(' '); lab.push(' '); mk.push(' '); }
    for (k = 0; k <= W; k++) ax[k] = '_';
    ax[0] = '|'; ax[W] = '|'; ax[mid] = '|'; ax[pos] = '*';
    function put(arr, at, t) { for (var i = 0; i < t.length; i++) arr[at + i] = t.charAt(i); }
    put(lab, 0, fmt(lo)); put(lab, mid, fmt((lo + hi) / 2)); put(lab, W - fmt(hi).length + 1, fmt(hi));
    put(mk, pos, fmt(n));
    return [lab.join('').replace(/\s+$/, ''), ax.join('').replace(/\s+$/, ''), mk.join('').replace(/\s+$/, '')];
  }
  /* One teaching step for rounding a whole number */
  function roundStep(n, place) {
    var r = rnd(n, place), d = Math.floor((n % place) / (place / 10)), up = d >= 5;
    return x('Round ' + fmt(n) + ' to the nearest ' + pname(place) + '. Look at the ' + dname(place) + ' digit. It is ' + d + ', which is ' + (up ? '5 or more, so round up' : 'less than 5, so round down') + ' to ' + fmt(r) + '.',
      [fmt(n), 'round'], ' rounds to ', [fmt(r), up ? 'up' : 'down']);
  }
  function dollarStep(c) {
    var cents = c % 100, up = cents >= 50, r = dol(c);
    return x('Round ' + usd(c) + ' to the nearest dollar. The cents are ' + cents + ', which is ' + (up ? '50 or more, so round up' : 'less than 50, so round down') + ' to $' + r + '.',
      [usd(c), 'round'], ' rounds to ', ['$' + r, up ? 'up' : 'down']);
  }
  function notMultiple(lo, hi, place) { var v; do { v = R.int(lo, hi); } while (v % place === 0); return v; }

  /* ---------- Vocabulary ---------- */
  window.MATH_VOCAB[11] = [
    { w: 'Estimate', m: 'A smart guess that is close to the exact answer. It is quick to find, and it does not have to be exact.' },
    { w: 'Round', m: 'Change a number to a nearby friendly number, like the closest ten or hundred.' },
    { w: 'Front end estimation', m: 'Keep the first digit of each number and turn all the other digits into zeros. Then work with those easy numbers.' },
    { w: 'Compatible numbers', m: 'Numbers that are easy to work with together, like 240 and 6, because 240 divides by 6 without a remainder.' },
    { w: 'Overestimate', m: 'An estimate that is bigger than the exact answer.' },
    { w: 'Underestimate', m: 'An estimate that is smaller than the exact answer.' },
    { w: 'Reasonable', m: 'An answer that makes sense. It is close to what your estimate says it should be.' },
    { w: 'Nearest', m: 'The closest one. The nearest ten to 47 is 50, because 47 is closer to 50 than to 40.' }
  ];

  /* ---------- Lessons ---------- */
  window.MATH_LESSONS[11] = [
    { title: '1. What is an estimate?',
      explain: [
        'An estimate is a smart guess that is close to the exact answer. It tells you about how big the answer should be.',
        'We estimate when we do not need an exact answer, like guessing how much groceries will cost. We also estimate to check that an exact answer makes sense.',
        'To estimate, we change the numbers into friendly numbers that are easy to add, take away, multiply or divide in our heads.'
      ],
      rule: 'Make the numbers friendly. Do the easy math. The answer is close, but not exact.',
      mistake: 'An estimate does not need to match the exact answer. Being close is the goal.',
      steps: [
        x('A school bus has 38 students on it. There are 4 buses. About how many students are there?', ['38', 'students'], ' × ', ['4', 'buses'], ' = about ?'),
        x('38 is close to 40. That is a friendly number.', '38 is close to ', ['40', 'friendly']),
        x('Now do the easy math. 40 × 4 = 160. So there are about 160 students.', '40 × 4 = ', ['160', 'estimate']),
        x('Now check with the exact math. 38 × 4 = 152. The estimate 160 is close.', '38 × 4 = ', ['152', 'exact'], '   estimate ', ['160', 'close']),
        note('An estimate is useful in many places.', 'When we estimate', ['To guess a total quickly', 'To check that an exact answer makes sense', 'When an exact answer is not needed'])
      ] },

    { title: '2. Rounding to the nearest ten',
      explain: [
        'Rounding changes a number to the closest ten, hundred or thousand. Every number sits between two tens. Rounding tells us which one it is closer to.',
        'Look at the ones digit. If it is 5 or more, round up to the next ten. If it is less than 5, round down to the ten before it.',
        'On a number line, the halfway point tells you which way to go. A number at the halfway point rounds up.'
      ],
      rule: 'Look at the digit to the right. 5 or more: round up. Less than 5: round down.',
      mistake: 'The number 45 rounds UP to 50. Halfway rounds up.',
      steps: [
        x('Round 47 to the nearest ten. First find the two tens that 47 sits between.', ['47', 'round'], ' is between ', ['40', 'lower ten'], ' and ', ['50', 'higher ten']),
        lines('Here is a number line from 40 to 50. The star marks 47. The halfway point is 45.', rl(40, 50, 47), 2),
        x('47 is past the halfway point of 45. So it is closer to 50.', ['47', 'past halfway'], ' is closer to ', ['50', 'nearest ten']),
        x('The quick rule. The ones digit is 7. 7 is 5 or more, so round up.', '47 rounds to ', ['50', 'up']),
        x('Try 32. The ones digit is 2. 2 is less than 5, so round down to 30.', '32 rounds to ', ['30', 'down']),
        x('Try 65. The ones digit is 5. 5 is 5 or more, so round up to 70.', '65 rounds to ', ['70', 'up'])
      ] },

    { title: '3. Rounding to the nearest hundred and thousand',
      explain: [
        'To round to the nearest hundred, look at the tens digit. To round to the nearest thousand, look at the hundreds digit.',
        'If that digit is 5 or more, round up. If it is less than 5, round down. Then change every digit after the rounding place to zero.',
        'Pick the place first. The place you round to decides which digit you look at.'
      ],
      rule: 'Circle the place you round to. Look one place to the right. 5 or more: up. Less than 5: down.',
      mistake: 'Do not look at the ones digit when you round to the nearest hundred. Look at the tens digit.',
      steps: [
        x('Round 3,462 to the nearest hundred. The hundreds place holds the 4.', '3,', ['4', 'hundreds'], '62'),
        x('Look one place to the right. That is the tens digit, which is 6.', '3,4', ['6', 'look here'], '2'),
        x('6 is 5 or more, so the 4 goes up to 5. The other digits become zeros.', '3,462 rounds to ', ['3,500', 'nearest hundred']),
        x('Now round 3,462 to the nearest thousand. The thousands place holds the 3.', ['3', 'thousands'], ',462'),
        x('Look one place to the right. That is the hundreds digit, which is 4. 4 is less than 5, so the 3 stays.', '3,462 rounds to ', ['3,000', 'nearest thousand']),
        lines('On a number line from 3,000 to 4,000, the star is at 3,462, before the halfway point of 3,500.', rl(3000, 4000, 3462), 2)
      ] },

    { title: '4. Estimating sums',
      explain: [
        'To estimate a sum, round each number first. Then add the friendly numbers.',
        'The place you round to matters. Rounding to the nearest ten gives a closer estimate than rounding to the nearest hundred. Rounding to the nearest hundred is quicker.',
        'Always follow the rounding instruction in the question so everyone gets the same estimate.'
      ],
      rule: 'Round each number. Then add the rounded numbers.',
      mistake: 'Do not round only one number. Round every number in the sum.',
      steps: [
        x('Estimate 348 + 512 by rounding each number to the nearest hundred.', ['348', 'round'], ' + ', ['512', 'round']),
        x('348 has 4 in the tens place. 4 is less than 5, so 348 rounds down to 300.', '348 rounds to ', ['300', 'down']),
        x('512 has 1 in the tens place. 1 is less than 5, so 512 rounds down to 500.', '512 rounds to ', ['500', 'down']),
        x('Add the friendly numbers. 300 + 500 = 800.', '300 + 500 = ', ['800', 'estimate']),
        x('The exact sum is 348 + 512 = 860. Our estimate 800 is close.', '348 + 512 = ', ['860', 'exact']),
        x('Try again with the nearest ten. 350 + 510 = 860. That is even closer.', '350 + 510 = ', ['860', 'closer estimate'])
      ] },

    { title: '5. Estimating differences',
      explain: [
        'Estimating a difference works the same way. Round each number, then take away.',
        'Make sure you take the smaller rounded number from the bigger rounded number.',
        'Check that the estimate makes sense by adding back. If you add the small number to the difference, you should get close to the big number.'
      ],
      rule: 'Round each number. Then subtract the rounded numbers.',
      mistake: 'Round both numbers before you subtract. Do not subtract first and round after.',
      steps: [
        x('Estimate 782 − 316 by rounding each number to the nearest hundred.', ['782', 'round'], ' − ', ['316', 'round']),
        x('782 has 8 in the tens place. 8 is 5 or more, so round up to 800.', '782 rounds to ', ['800', 'up']),
        x('316 has 1 in the tens place. 1 is less than 5, so round down to 300.', '316 rounds to ', ['300', 'down']),
        x('Subtract the friendly numbers. 800 − 300 = 500.', '800 − 300 = ', ['500', 'estimate']),
        x('The exact difference is 782 − 316 = 466. Our estimate 500 is close.', '782 − 316 = ', ['466', 'exact']),
        x('Check by adding back. 500 + 300 = 800, which matches the rounded first number.', ['500', 'estimate'], ' + 300 = ', ['800', 'matches'])
      ] },

    { title: '6. Front end estimation',
      explain: [
        'Front end estimation is a very quick way to estimate. Keep only the first digit of each number. Change all the other digits to zeros.',
        'For 4,823, keep the 4 and write 4,000. For 3,190, keep the 3 and write 3,000. Then do the easy math.',
        'This method is fast, but it cuts numbers down, so sums come out a little too small.'
      ],
      rule: 'Keep the first digit. Make every other digit zero. Then add or subtract.',
      mistake: 'Front end is not the same as rounding. 4,823 becomes 4,000 with front end, but 5,000 when you round to the nearest thousand.',
      steps: [
        x('Estimate 4,823 + 3,190 with front end estimation.', ['4,823', 'front end'], ' + ', ['3,190', 'front end']),
        x('Keep the first digit of 4,823, which is 4. Make the rest zeros: 4,000.', '4,823 becomes ', ['4,000', 'front end']),
        x('Keep the first digit of 3,190, which is 3. Make the rest zeros: 3,000.', '3,190 becomes ', ['3,000', 'front end']),
        x('Add the easy numbers. 4,000 + 3,000 = 7,000.', '4,000 + 3,000 = ', ['7,000', 'estimate']),
        x('The exact sum is 8,013. The estimate 7,000 is a bit low, because we cut the numbers down.', '4,823 + 3,190 = ', ['8,013', 'exact']),
        note('Front end estimation is quick, but not the closest.', 'Good to know', ['Very fast in your head', 'Gives an underestimate for sums', 'Round instead when you need a closer estimate'])
      ] },

    { title: '7. Estimating products',
      explain: [
        'To estimate a product, round the numbers first. Then multiply the friendly numbers.',
        'Friendly numbers end in zeros. To multiply them, multiply the digits that are not zero. Then write all the zeros on the end.',
        'For 50 × 40, multiply 5 × 4 = 20. Then add the two zeros to get 2,000.'
      ],
      rule: 'Round each factor. Multiply the digits that are not zero. Then add the zeros.',
      mistake: 'Count the zeros carefully. 50 × 40 has two zeros in the factors, so the answer is 20 with two zeros, 2,000.',
      steps: [
        x('Estimate 38 × 6 by rounding 38 to the nearest ten.', ['38', 'round'], ' × ', ['6', 'keep']),
        x('38 has 8 ones. 8 is 5 or more, so 38 rounds up to 40.', '38 rounds to ', ['40', 'up']),
        x('Multiply the digit that is not zero. 4 × 6 = 24.', '4 × 6 = ', ['24', 'digits']),
        x('Put back the zero. 24 becomes 240.', '40 × 6 = ', ['240', 'estimate']),
        x('The exact answer is 228. The estimate 240 is close.', '38 × 6 = ', ['228', 'exact']),
        x('A harder one. Estimate 47 × 53 by rounding each to the nearest ten. 47 rounds to 50 and 53 rounds to 50.', '50 × 50: 5 × 5 = 25, two zeros, ', ['2,500', 'estimate'])
      ] },

    { title: '8. Estimating quotients with compatible numbers',
      explain: [
        'Compatible numbers are numbers that are easy to divide. 240 ÷ 6 is easy because 24 ÷ 6 = 4. But 247 ÷ 6 is not easy.',
        'To estimate 247 ÷ 6, change 247 to a nearby number that divides easily by 6. The number 240 is close to 247, and it divides by 6 evenly.',
        'Use your times tables to find the compatible number. 6 × 4 = 24, so 240 works.'
      ],
      rule: 'Change the number being divided to a nearby number that divides easily. Then divide.',
      mistake: 'Do not change the divisor. Keep the 6. Only change 247 to 240.',
      steps: [
        x('Estimate 247 ÷ 6. This is hard to do in your head as it is.', ['247', 'hard'], ' ÷ ', ['6', 'divisor']),
        note('Think about the 6 times table to find a friendly number near 247.', 'Look for a compatible number', ['6 × 4 = 24', 'so 6 × 40 = 240', '240 is close to 247']),
        x('Change 247 to 240. It divides by 6 with nothing left over.', '247 is close to ', ['240', 'compatible number']),
        x('Divide. 24 ÷ 6 = 4, so 240 ÷ 6 = 40.', '240 ÷ 6 = ', ['40', 'estimate']),
        x('Another one. Estimate 412 ÷ 5. Nearby 400 divides by 5. 400 ÷ 5 = 80.', '412 ≈ 400, so 400 ÷ 5 = ', ['80', 'estimate'])
      ] },

    { title: '9. Overestimates and underestimates',
      explain: [
        'An estimate that is bigger than the exact answer is an overestimate. An estimate that is smaller is an underestimate.',
        'If you round up every number in a sum, the estimate is too big. If you round down every number in a sum, it is too small.',
        'In a subtraction, it depends. Rounding the first number up and the second number down makes the answer too big.'
      ],
      rule: 'Sum: round up gives over, round down gives under. Difference: watch which number moves which way.',
      mistake: 'For a subtraction, rounding both numbers up does not tell you if it is over or under. Think about each number.',
      steps: [
        x('Estimate 47 + 38 by rounding both numbers up, to 50 and 40. The estimate is 90.', '50 + 40 = ', ['90', 'estimate']),
        x('The exact sum is 47 + 38 = 85. The estimate 90 is bigger than 85.', ['90', 'estimate'], ' > ', ['85', 'exact']),
        x('So this is an overestimate. When you make numbers bigger in a sum, the answer gets bigger.', ['overestimate', 'too big']),
        x('Now estimate 47 + 38 by rounding both numbers down, to 40 and 30. The estimate is 70.', '40 + 30 = ', ['70', 'estimate']),
        x('70 is smaller than the exact 85. That is an underestimate.', ['70', 'estimate'], ' < ', ['85', 'exact']),
        note('This helps when it matters. If you need to be sure you have enough money, round up.', 'Round up to be safe', ['Overestimate: you will have enough', 'Underestimate: you might be short'])
      ] },

    { title: '10. Is the answer reasonable?',
      explain: [
        'An answer is reasonable if it makes sense. We can check by making a quick estimate.',
        'If the exact answer is far from the estimate, something went wrong. A common slip is a misplaced zero or a forgotten step.',
        'Estimate first, then compare. If they are close, the answer is probably right.'
      ],
      rule: 'Estimate first. If the answer is close to the estimate, it is reasonable.',
      mistake: 'An answer that is close to the estimate is reasonable but not always exactly right. It only tells you that it is in the right area.',
      steps: [
        x('Sam says 489 + 312 = 1,801. Is that reasonable? Estimate to check.', '489 + 312 = ', ['1,801', 'Sam says']),
        x('Round to the nearest hundred. 489 rounds to 500. 312 rounds to 300.', ['500', '489'], ' + ', ['300', '312']),
        x('Add. 500 + 300 = 800. The sum should be about 800.', '500 + 300 = ', ['800', 'estimate']),
        x('1,801 is way bigger than 800. Sam has made a mistake.', ['1,801', 'too big'], ' is not close to ', ['800', 'estimate']),
        x('The exact answer is 489 + 312 = 801. That is very close to 800. So 801 is reasonable.', '489 + 312 = ', ['801', 'reasonable'])
      ] },

    { title: '11. Estimating money',
      explain: [
        'We use estimates when we shop. To estimate a total, round each price to the nearest dollar. Then add.',
        'To round money to the nearest dollar, look at the cents. If the cents are 50 or more, round up to the next dollar. If they are less than 50, round down.',
        'If you want to be sure you have enough money, round every price up to the next dollar.'
      ],
      rule: 'Cents 50 or more: round up. Cents less than 50: round down.',
      mistake: 'Do not forget that $3.50 rounds up to $4. Halfway rounds up.',
      steps: [
        x('Rinka buys a notebook for $3.79, a pen for $1.25 and a snack for $2.10. Estimate the total to the nearest dollar.', ['$3.79', 'notebook'], ' + ', ['$1.25', 'pen'], ' + ', ['$2.10', 'snack']),
        x('$3.79 has 79 cents. 79 is 50 or more, so round up to $4.', '$3.79 rounds to ', ['$4', 'up']),
        x('$1.25 has 25 cents. 25 is less than 50, so round down to $1.', '$1.25 rounds to ', ['$1', 'down']),
        x('$2.10 has 10 cents. 10 is less than 50, so round down to $2.', '$2.10 rounds to ', ['$2', 'down']),
        x('Add. $4 + $1 + $2 = $7. The estimate is about $7.', '$4 + $1 + $2 = ', ['$7', 'estimate']),
        x('The exact total is $7.14. Our estimate is close.', '$3.79 + $1.25 + $2.10 = ', ['$7.14', 'exact'])
      ] }
  ];

  /* ---------- Question skills ---------- */
  var ITEMS = ['a notebook', 'a pen', 'a juice box', 'a granola bar', 'a sandwich', 'a toque', 'a comic book', 'a bag of chips', 'a water bottle', 'a ruler', 'a muffin', 'a hockey card pack'];

  function prices(k) {
    var a = [];
    while (a.length < k) {
      var d = R.int(1, 9), c = R.pick([5, 9, 15, 19, 25, 29, 35, 39, 45, 49, 55, 59, 65, 69, 75, 79, 85, 89, 95, 99, 10, 20, 30, 40, 60, 70, 80, 90, 12, 24, 36, 48, 62, 74, 87, 93]);
      var v = d * 100 + c;
      if (a.indexOf(v) < 0) a.push(v);
    }
    return a;
  }
  function names(k) { return R.shuffle(ITEMS).slice(0, k); }
  function listPrices(nm, pr) {
    if (nm.length === 2) return nm[0] + ' for ' + usd(pr[0]) + ' and ' + nm[1] + ' for ' + usd(pr[1]);
    return nm[0] + ' for ' + usd(pr[0]) + ', ' + nm[1] + ' for ' + usd(pr[1]) + ' and ' + nm[2] + ' for ' + usd(pr[2]);
  }

  B.register(11, [

    { id: 'round10', level: 1, name: 'Round to the nearest ten or dollar', make: function () {
      var v = R.int(0, 2), prompt, ans, n, tr, teach, lo, hi, d;
      if (v === 2) {
        var c = notMultiple(101, 999, 100);
        while (c % 100 === 0) c = R.int(101, 999);
        ans = dol(c);
        prompt = 'Round ' + usd(c) + ' to the nearest dollar. Type the answer as a number of dollars.';
        var lo2 = Math.floor(c / 100), up = c % 100 >= 50;
        tr = [T(String(up ? lo2 : lo2 + 1), up ? 'You rounded down. The cents are ' + (c % 100) + ', which is 50 or more, so round up.' : 'You rounded up. The cents are ' + (c % 100) + ', which is less than 50, so round down.'), T((c / 100).toFixed(2), 'That is the price itself. Round it to a whole number of dollars.')];
        teach = [
          x('Rounding to the nearest dollar means finding the closest whole number of dollars. ' + usd(c) + ' sits between $' + lo2 + ' and $' + (lo2 + 1) + '.', [usd(c), 'round'], ' is between ', ['$' + lo2, 'lower'], ' and ', ['$' + (lo2 + 1), 'higher']),
          x('Look at the cents. They are ' + (c % 100) + '.', ['$' + lo2 + '.', ''], [String(c % 100).length === 1 ? '0' + (c % 100) : String(c % 100), 'cents']),
          x('The halfway point is 50 cents. ' + (c % 100) + ' is ' + (up ? '50 or more, so round up.' : 'less than 50, so round down.'), [String(c % 100), up ? '50 or more' : 'less than 50']),
          x(usd(c) + ' rounds to $' + ans + '.', usd(c) + ' rounds to ', ['$' + ans, 'nearest dollar'])
        ];
        return N({ skill: 'Rounding', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number of dollars', traps: tr, work: usd(c) + ' has ' + (c % 100) + ' cents, which is ' + (up ? '50 or more' : 'less than 50') + ', so it rounds to $' + ans + '.', plain: 'Look at the cents. 50 or more rounds up to the next dollar. Less than 50 stays at the dollar you are on.', teach: teach });
      }
      n = notMultiple(11, 999, 10); ans = rnd(n, 10); d = n % 10; lo = flo(n, 10); hi = lo + 10;
      prompt = v === 0 ? 'Round ' + n + ' to the nearest ten.' : 'A book has ' + n + ' pages. To the nearest ten, about how many pages is that?';
      tr = [T(String(d >= 5 ? lo : hi), d >= 5 ? 'You rounded down. The ones digit is ' + d + ', which is 5 or more, so round up.' : 'You rounded up. The ones digit is ' + d + ', which is less than 5, so round down.'), T(String(rnd(n, 100)), 'You rounded to the nearest hundred. This question asks for the nearest ten.')];
      teach = [
        x('Rounding to the nearest ten means finding the closest ten. ' + n + ' sits between ' + lo + ' and ' + hi + '.', [String(n), 'round'], ' is between ', [String(lo), 'lower ten'], ' and ', [String(hi), 'higher ten']),
        lines('On a number line, the star marks ' + n + '. The halfway point is ' + (lo + 5) + '.', rl(lo, hi, n), 2),
        x('Look at the ones digit. It is ' + d + '.', fmt(lo) === String(lo) ? String(lo).slice(0, -1) : String(lo).slice(0, -1), [String(d), 'ones digit']),
        x(d + ' is ' + (d >= 5 ? '5 or more, so round up' : 'less than 5, so round down') + '.', [String(d), d >= 5 ? 'round up' : 'round down']),
        x(n + ' rounds to ' + ans + '.', n + ' rounds to ', [String(ans), 'nearest ten'])
      ];
      return N({ skill: 'Rounding', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number', traps: tr, work: 'The ones digit is ' + d + ', which is ' + (d >= 5 ? '5 or more, so round up to ' + ans : 'less than 5, so round down to ' + ans) + '.', plain: 'Look at the ones digit. 5 or more goes up to the next ten. Less than 5 stays at the ten you are on.', teach: teach });
    } },

    { id: 'round100', level: 2, name: 'Round to the nearest hundred or thousand', make: function () {
      var place = R.pick([100, 1000]), n, v = R.int(0, 2);
      n = place === 100 ? notMultiple(101, 9999, 100) : notMultiple(1001, 99999, 1000);
      var ans = rnd(n, place), lo = flo(n, place), hi = lo + place, d = Math.floor((n % place) / (place / 10)), up = d >= 5;
      var pn = pname(place);
      var prompt = v === 0 ? 'Round ' + fmt(n) + ' to the nearest ' + pn + '.' : (v === 1 ? 'The town of Hope, BC has ' + fmt(n) + ' people. To the nearest ' + pn + ', about how many people is that?' : 'A stadium sold ' + fmt(n) + ' tickets. Round the number of tickets to the nearest ' + pn + '.');
      var other = place === 100 ? rnd(n, 10) : rnd(n, 100);
      var tr = [T(String(up ? lo : hi), up ? 'You rounded down. The ' + dname(place) + ' digit is ' + d + ', which is 5 or more, so round up.' : 'You rounded up. The ' + dname(place) + ' digit is ' + d + ', which is less than 5, so round down.'), T(String(other), 'You rounded to the wrong place. This question asks for the nearest ' + pn + '.')];
      return N({
        skill: 'Rounding', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number', traps: tr,
        work: 'The ' + dname(place) + ' digit is ' + d + ', which is ' + (up ? '5 or more, so round up to ' + fmt(ans) : 'less than 5, so round down to ' + fmt(ans)) + '.', plain: 'Pick the place. Look one place to the right. 5 or more goes up. Less than 5 stays.',
        teach: [
          x('We round ' + fmt(n) + ' to the nearest ' + pn + '. It sits between ' + fmt(lo) + ' and ' + fmt(hi) + '.', [fmt(n), 'round'], ' is between ', [fmt(lo), 'lower'], ' and ', [fmt(hi), 'higher']),
          lines('The star marks ' + fmt(n) + '. The halfway point is ' + fmt(lo + place / 2) + '.', rl(lo, hi, n), 2),
          x('Look one place to the right of the ' + pn + 's place. That is the ' + dname(place) + ' digit. It is ' + d + '.', [String(d), dname(place) + ' digit']),
          x(d + ' is ' + (up ? '5 or more, so round up.' : 'less than 5, so round down.'), [String(d), up ? 'round up' : 'round down']),
          x(fmt(n) + ' rounds to ' + fmt(ans) + '.', fmt(n) + ' rounds to ', [fmt(ans), 'nearest ' + pn])
        ]
      });
    } },

    { id: 'estsum', level: 2, name: 'Estimate a sum', make: function () {
      var place = R.pick([10, 100]), cnt = R.pick([2, 2, 3]), a = [], i;
      for (i = 0; i < cnt; i++) a.push(place === 10 ? notMultiple(21, 499, 10) : notMultiple(101, 2999, 100));
      var rs = a.map(function (n) { return rnd(n, place); }), est = rs.reduce(function (p, c) { return p + c; }, 0), exact = a.reduce(function (p, c) { return p + c; }, 0);
      var pn = pname(place), ex = a.map(fmt).join(' + ');
      var prompt;
      var v = R.int(0, 1);
      if (v === 0) prompt = 'Estimate ' + ex + ' by rounding each number to the nearest ' + pn + '.';
      else if (cnt === 2) prompt = 'A ferry carried ' + fmt(a[0]) + ' cars in the morning and ' + fmt(a[1]) + ' cars in the afternoon. Round each number to the nearest ' + pn + ' to estimate the total number of cars.';
      else prompt = 'A school collected ' + fmt(a[0]) + ' cans in week 1, ' + fmt(a[1]) + ' cans in week 2 and ' + fmt(a[2]) + ' cans in week 3. Round each number to the nearest ' + pn + ' to estimate the total.';
      var other = place === 10 ? 100 : 10;
      var floorSum = a.reduce(function (p, c) { return p + flo(c, place); }, 0);
      var otherSum = a.reduce(function (p, c) { return p + rnd(c, other); }, 0);
      var tr = [T(String(exact), 'That is the exact sum. The question asks for an estimate, so round each number first.'), T(String(floorSum), 'You rounded every number down. Check the digit to the right of the ' + pn + 's place. If it is 5 or more, round up.'), T(String(otherSum), 'You rounded to the wrong place. Use the nearest ' + pn + '.')];
      var teach = [x('Estimate means find a close answer. We round each number to the nearest ' + pn + ' first, then add.', ex, ' rounds to ', [rs.map(fmt).join(' + '), 'friendly numbers'])];
      a.forEach(function (n) { teach.push(roundStep(n, place)); });
      teach.push(x('Add the friendly numbers. ' + rs.map(fmt).join(' + ') + ' = ' + fmt(est) + '.', rs.map(fmt).join(' + ') + ' = ', [fmt(est), 'estimate']));
      teach.push(x('The exact sum is ' + fmt(exact) + '. Our estimate ' + fmt(est) + ' is close.', [fmt(est), 'estimate'], ' is close to ', [fmt(exact), 'exact']));
      return N({ skill: 'Estimate a sum', prompt: prompt, answer: est, keyboard: 'numeric', placeholder: 'Type your estimate', traps: tr, work: 'Round each: ' + rs.map(fmt).join(', ') + '. Add: ' + fmt(est) + '.', plain: 'Round every number to the nearest ' + pn + ', then add the rounded numbers.', teach: teach });
    } },

    { id: 'estdiff', level: 3, name: 'Estimate a difference', make: function () {
      var place = R.pick([10, 100]), a, b;
      do {
        a = place === 10 ? notMultiple(60, 499, 10) : notMultiple(401, 4999, 100);
        b = place === 10 ? notMultiple(21, 400, 10) : notMultiple(101, 3999, 100);
      } while (a - b < 3 * place || rnd(a, place) - rnd(b, place) <= 0);
      var ra = rnd(a, place), rb = rnd(b, place), est = ra - rb, exact = a - b, pn = pname(place);
      var v = R.int(0, 1);
      var prompt = v === 0 ? 'Estimate ' + fmt(a) + ' − ' + fmt(b) + ' by rounding each number to the nearest ' + pn + '.' : 'A store had ' + fmt(a) + ' hockey cards. It sold ' + fmt(b) + ' of them. Round each number to the nearest ' + pn + ' to estimate how many cards are left.';
      var tr = [T(String(exact), 'That is the exact difference. The question asks for an estimate, so round each number first.'), T(String(ra + rb), 'You added the rounded numbers. This is a subtraction.'), T(String(flo(a, place) - flo(b, place)), 'You rounded both numbers down. Check the digit to the right of the ' + pn + 's place. If it is 5 or more, round up.')];
      return N({
        skill: 'Estimate a difference', prompt: prompt, answer: est, keyboard: 'numeric', placeholder: 'Type your estimate', traps: tr,
        work: 'Round: ' + fmt(ra) + ' and ' + fmt(rb) + '. Subtract: ' + fmt(ra) + ' − ' + fmt(rb) + ' = ' + fmt(est) + '.', plain: 'Round both numbers to the nearest ' + pn + '. Then subtract the rounded numbers.',
        teach: [
          x('We round each number to the nearest ' + pn + ' first, then subtract.', fmt(a) + ' − ' + fmt(b) + ' rounds to ', [fmt(ra) + ' − ' + fmt(rb), 'friendly numbers']),
          roundStep(a, place), roundStep(b, place),
          x('Subtract the friendly numbers. ' + fmt(ra) + ' − ' + fmt(rb) + ' = ' + fmt(est) + '.', fmt(ra) + ' − ' + fmt(rb) + ' = ', [fmt(est), 'estimate']),
          x('The exact difference is ' + fmt(exact) + '. Our estimate ' + fmt(est) + ' is close.', [fmt(est), 'estimate'], ' is close to ', [fmt(exact), 'exact'])
        ]
      });
    } },

    { id: 'frontend', level: 3, name: 'Front end estimation', make: function () {
      var v = R.int(0, 2), a = [], op = '+', i;
      if (v === 0) { a = [R.int(1001, 9999), R.int(1001, 9999)]; }
      else if (v === 1) { a = [R.int(101, 999), R.int(101, 999), R.int(101, 999)]; }
      else { var p = R.int(2001, 9999); var q = R.int(1001, p - 1000); a = [p, q]; op = '−'; }
      var fr = a.map(front);
      if (op === '−' && fr[0] - fr[1] <= 0) { a = [8000 + R.int(0, 999), 2000 + R.int(0, 999)]; fr = a.map(front); }
      var est = op === '+' ? fr.reduce(function (p, c) { return p + c; }, 0) : fr[0] - fr[1];
      var exact = op === '+' ? a.reduce(function (p, c) { return p + c; }, 0) : a[0] - a[1];
      var ex = a.map(fmt).join(' ' + op + ' ');
      var greatest = a.map(function (n) { return rnd(n, Math.pow(10, String(n).length - 1)); });
      var rsum = op === '+' ? greatest.reduce(function (p, c) { return p + c; }, 0) : greatest[0] - greatest[1];
      var tr = [T(String(exact), 'That is the exact answer. Front end estimation keeps only the first digit of each number.'), T(String(rsum), 'You rounded instead. Front end keeps the first digit and does not round up.')];
      var teach = [x('Front end estimation. Keep the first digit of each number. Change every other digit to zero.', ex)];
      a.forEach(function (n, k) { teach.push(x('The first digit of ' + fmt(n) + ' is ' + String(n).charAt(0) + '. The rest become zeros: ' + fmt(fr[k]) + '.', fmt(n) + ' becomes ', [fmt(fr[k]), 'front end'])); });
      teach.push(x('Do the easy math. ' + fr.map(fmt).join(' ' + op + ' ') + ' = ' + fmt(est) + '.', fr.map(fmt).join(' ' + op + ' ') + ' = ', [fmt(est), 'estimate']));
      teach.push(x('The exact answer is ' + fmt(exact) + '. The estimate is quick and close enough for a first look.', [fmt(est), 'estimate'], ' and ', [fmt(exact), 'exact']));
      return N({ skill: 'Front end estimation', prompt: 'Use front end estimation. Keep the first digit of each number and change all the other digits to zero. Estimate ' + ex + '.', answer: est, keyboard: 'numeric', placeholder: 'Type your estimate', traps: tr, work: 'Front end numbers: ' + fr.map(fmt).join(', ') + '. Result: ' + fmt(est) + '.', plain: 'Keep only the first digit of each number and make the rest zeros. Then add or subtract.', teach: teach });
    } },

    { id: 'estmoney', level: 3, name: 'Estimate a money total', make: function () {
      var k = R.pick([2, 3, 3]), pr = prices(k), nm = names(k);
      var r = pr.map(dol), est = r.reduce(function (p, c) { return p + c; }, 0), exact = pr.reduce(function (p, c) { return p + c; }, 0);
      var flr = pr.reduce(function (p, c) { return p + Math.floor(c / 100); }, 0);
      var prompt = 'Rinka buys ' + listPrices(nm, pr) + '. Round each price to the nearest dollar to estimate the total. Type the estimate as a number of dollars.';
      var tr = [T((exact / 100).toFixed(2), 'That is the exact total. The question asks for an estimate. Round each price first.'), T(String(flr), 'You dropped the cents on every price. Round up when the cents are 50 or more.')];
      var teach = [x('We round each price to the nearest dollar, then add.', pr.map(usd).join(' + '))];
      pr.forEach(function (c) { teach.push(dollarStep(c)); });
      teach.push(x('Add the rounded prices. ' + r.map(function (v) { return '$' + v; }).join(' + ') + ' = $' + est + '.', r.map(function (v) { return '$' + v; }).join(' + ') + ' = ', ['$' + est, 'estimate']));
      teach.push(x('The exact total is ' + usd(exact) + '. Our estimate $' + est + ' is close.', ['$' + est, 'estimate'], ' and ', [usd(exact), 'exact']));
      return N({ skill: 'Estimate money', prompt: prompt, answer: est, keyboard: 'numeric', placeholder: 'Type a whole number of dollars', traps: tr, work: 'Rounded prices: ' + r.map(function (v) { return '$' + v; }).join(', ') + '. Total: $' + est + '.', plain: 'Round each price to the nearest dollar. 50 cents or more goes up. Then add the dollars.', teach: teach });
    } },

    { id: 'estprod1', level: 3, name: 'Estimate a product, one number rounded', make: function () {
      var big = R.int(0, 1), place = big ? 100 : 10, n = big ? notMultiple(120, 980, 100) : notMultiple(13, 97, 10), d = R.int(2, 9);
      var rn = rnd(n, place), est = rn * d, exact = n * d, pn = pname(place);
      var v = R.int(0, 1);
      var prompt = v === 0 ? 'Estimate ' + n + ' × ' + d + ' by rounding ' + n + ' to the nearest ' + pn + ' first.' : 'A box holds ' + d + ' pencils. There are ' + n + ' boxes. Round ' + n + ' to the nearest ' + pn + ' to estimate the total number of pencils.';
      var tr = [T(String(exact), 'That is the exact product. Round ' + n + ' first, then multiply.'), T(String((rn / place) * d), 'You left off the zero' + (place > 10 ? 's' : '') + '. ' + rn + ' × ' + d + ' has ' + zeros(rn) + ' zero' + (zeros(rn) > 1 ? 's' : '') + ' after ' + (nz(rn) * d) + '.'), T(String(flo(n, place) * d), 'You rounded down. Check the digit to the right. If it is 5 or more, round up.')];
      return N({
        skill: 'Estimate a product', prompt: prompt, answer: est, keyboard: 'numeric', placeholder: 'Type your estimate', traps: tr,
        work: n + ' rounds to ' + rn + '. ' + nz(rn) + ' × ' + d + ' = ' + (nz(rn) * d) + ', and with the zeros it is ' + est + '.', plain: 'Round the big number to a friendly number. Multiply the digits that are not zero. Then put the zeros back.',
        teach: [
          x('We round ' + n + ' to the nearest ' + pn + ', then multiply by ' + d + '.', [String(n), 'round'], ' × ', [String(d), 'keep']),
          roundStep(n, place),
          x('Multiply the digits that are not zero. ' + nz(rn) + ' × ' + d + ' = ' + (nz(rn) * d) + '.', nz(rn) + ' × ' + d + ' = ', [String(nz(rn) * d), 'without zeros']),
          x('Put back the ' + zeros(rn) + ' zero' + (zeros(rn) > 1 ? 's' : '') + '. ' + rn + ' × ' + d + ' = ' + est + '.', rn + ' × ' + d + ' = ', [String(est), 'estimate']),
          x('The exact answer is ' + exact + '. Our estimate ' + est + ' is close.', [String(est), 'estimate'], ' and ', [String(exact), 'exact'])
        ]
      });
    } },

    { id: 'estprod2', level: 4, name: 'Estimate a product, both numbers rounded', make: function () {
      var v = R.int(0, 2), a, b, ra, rb, rule;
      if (v === 0) { a = notMultiple(21, 98, 10); b = notMultiple(21, 98, 10); ra = rnd(a, 10); rb = rnd(b, 10); rule = 'Round each number to the nearest ten.'; }
      else if (v === 1) { a = notMultiple(121, 989, 100); b = notMultiple(21, 98, 10); ra = rnd(a, 100); rb = rnd(b, 10); rule = 'Round each number to its greatest place, which is the first digit.'; }
      else { a = notMultiple(21, 98, 10); b = notMultiple(21, 98, 10); ra = rnd(a, 10); rb = rnd(b, 10); rule = 'Round each number to the nearest ten.'; }
      var est = ra * rb, exact = a * b, zt = zeros(ra) + zeros(rb), core = nz(ra) * nz(rb);
      var prompt = v === 2 ? 'A theatre sells ' + b + ' tickets at $' + a + ' each. ' + rule + ' Estimate the total money in dollars.' : rule + ' Then estimate ' + a + ' × ' + b + '.';
      var tr = [T(String(exact), 'That is the exact product. Round both numbers first, then multiply.'), T(String(core * Math.pow(10, zt - 1)), 'You lost a zero. ' + ra + ' has ' + zeros(ra) + ' and ' + rb + ' has ' + zeros(rb) + ', so there are ' + zt + ' zeros in all.'), T(String(core * Math.pow(10, zt + 1)), 'You have an extra zero. Count the zeros in ' + ra + ' and ' + rb + ': ' + zt + ' in all.')];
      var ru = v === 1 ? [100, 10] : [10, 10];
      return N({
        skill: 'Estimate a product', prompt: prompt, answer: est, keyboard: 'numeric', placeholder: 'Type your estimate', traps: tr,
        work: a + ' rounds to ' + ra + ' and ' + b + ' rounds to ' + rb + '. ' + nz(ra) + ' × ' + nz(rb) + ' = ' + core + ', with ' + zt + ' zeros: ' + est + '.', plain: 'Round both numbers. Multiply the digits that are not zero. Then write all the zeros at the end.',
        teach: [
          x(rule + ' Then multiply the friendly numbers.', [String(a), 'round'], ' × ', [String(b), 'round']),
          roundStep(a, ru[0]), roundStep(b, ru[1]),
          x('Multiply the digits that are not zero. ' + nz(ra) + ' × ' + nz(rb) + ' = ' + core + '.', nz(ra) + ' × ' + nz(rb) + ' = ', [String(core), 'without zeros']),
          x('Count the zeros. ' + ra + ' has ' + zeros(ra) + ' and ' + rb + ' has ' + zeros(rb) + '. That is ' + zt + ' in all.', [String(ra), zeros(ra) + ' zero' + (zeros(ra) > 1 ? 's' : '')], ' and ', [String(rb), zeros(rb) + ' zero' + (zeros(rb) > 1 ? 's' : '')]),
          x('Write ' + zt + ' zero' + (zt > 1 ? 's' : '') + ' after ' + core + '. The estimate is ' + fmt(est) + '.', ra + ' × ' + rb + ' = ', [fmt(est), 'estimate'])
        ]
      });
    } },

    { id: 'estquot', level: 4, name: 'Estimate a quotient with compatible numbers', make: function () {
      var v = R.int(0, 2), prompt, ans, tr, teach, work, plain;
      if (v < 2) {
        var d = R.int(3, 9), k = R.int(3, 9), s = R.pick([10, 100]), c = d * k * s, r;
        do { r = R.int(-(s === 10 ? 6 : 40), (s === 10 ? 6 : 40)); } while (r === 0);
        var n = c + r; ans = k * s;
        prompt = v === 0 ? 'Use the compatible number ' + fmt(c) + ' in place of ' + fmt(n) + '. Estimate ' + fmt(n) + ' ÷ ' + d + '.' : 'A shipment of ' + fmt(n) + ' oranges is packed equally into ' + d + ' boxes. Use the compatible number ' + fmt(c) + ' in place of ' + fmt(n) + '. About how many oranges are in each box?';
        tr = [T(String(ans * 10), 'That has one zero too many. ' + d + ' × ' + (k * s) + ' is ' + fmt(c) + '.'), T(String(ans / 10), 'That has one zero too few. ' + d + ' × ' + (k * s) + ' is ' + fmt(c) + '.'), T(String(Math.floor(n / d) + 1), 'That looks like the exact division. Use the compatible number and your times table.')];
        work = fmt(c) + ' ÷ ' + d + ' = ' + fmt(ans) + ', because ' + d + ' × ' + k + ' = ' + (d * k) + '.'; plain = 'Use the easy number ' + fmt(c) + ' instead. Divide it by ' + d + ' with your times tables.';
        teach = [
          x(fmt(n) + ' ÷ ' + d + ' is hard. We use a nearby number that divides easily.', [fmt(n), 'hard'], ' ÷ ', [String(d), 'divisor']),
          x('The compatible number is ' + fmt(c) + '. It is close to ' + fmt(n) + '.', fmt(n) + ' is close to ', [fmt(c), 'compatible number']),
          x('Use your times table. ' + d + ' × ' + k + ' = ' + (d * k) + '.', d + ' × ' + k + ' = ', [String(d * k), 'times table']),
          x(s === 10 ? 'So ' + (d * k * 10) + ' ÷ ' + d + ' = ' + (k * 10) + '.' : 'So ' + fmt(c) + ' ÷ ' + d + ' = ' + fmt(ans) + '. There are two extra zeros.', fmt(c) + ' ÷ ' + d + ' = ', [fmt(ans), 'estimate']),
          x('The estimate is ' + fmt(ans) + '.', [fmt(ans), 'answer'])
        ];
      } else {
        var dv = R.pick([2, 4, 5]), h = R.int(3, 49), H = h * 100, rr;
        do { rr = R.int(-49, 49); } while (rr === 0);
        var nn = H + rr; ans = H / dv;
        prompt = 'Round ' + fmt(nn) + ' to the nearest hundred. Then divide that number by ' + dv + ' to estimate ' + fmt(nn) + ' ÷ ' + dv + '.';
        tr = [T(String(ans * 10), 'That has one zero too many. Check ' + fmt(H) + ' ÷ ' + dv + '.'), T(String(ans / 10), 'That has one zero too few. Check ' + fmt(H) + ' ÷ ' + dv + '.'), T(String(flo(nn, 100) / dv), 'You rounded down. Check the tens digit. If it is 5 or more, round up.')];
        work = fmt(nn) + ' rounds to ' + fmt(H) + '. ' + fmt(H) + ' ÷ ' + dv + ' = ' + fmt(ans) + '.'; plain = 'Round to the nearest hundred first. Then divide the friendly number.';
        teach = [
          x('We round ' + fmt(nn) + ' to the nearest hundred, then divide by ' + dv + '.', [fmt(nn), 'round'], ' ÷ ', [String(dv), 'divisor']),
          roundStep(nn, 100),
          x('Now divide the friendly number. ' + h + ' hundreds ÷ ' + dv + ' works nicely.', fmt(H) + ' ÷ ' + dv + ' = ', ['?', 'divide']),
          x(fmt(H) + ' ÷ ' + dv + ' = ' + fmt(ans) + '.', fmt(H) + ' ÷ ' + dv + ' = ', [fmt(ans), 'estimate']),
          x('The estimate is ' + fmt(ans) + '.', [fmt(ans), 'answer'])
        ];
      }
      return N({ skill: 'Estimate a quotient', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type your estimate', traps: tr, work: work, plain: plain, teach: teach });
    } },

    { id: 'compat', level: 4, name: 'Choose compatible numbers', make: function () {
      var d = R.pick([3, 4, 6, 7, 8, 9]), k = R.int(3, 9), c = d * k * 10, r = R.pick([6, 7, 8, 9, -6, -7, -8, -9]), n = c + r;
      var near = rnd(n, 10), far = c - 10 * d;
      var right = c + ' ÷ ' + d;
      var opts = [
        { text: right, ok: true },
        { text: far + ' ÷ ' + d, ok: false, trap: far + ' divides by ' + d + ' evenly, but it is far away from ' + n + '. Pick the closest one that divides easily.' },
        { text: near + ' ÷ ' + d, ok: false, trap: near + ' is close to ' + n + ', but it does not divide by ' + d + ' without a remainder. Check your times table.' },
        { text: n + ' ÷ 10', ok: false, trap: 'That changes the divisor. Keep the ' + d + ' and change only ' + n + '.' }
      ];
      return Q.choice({
        skill: 'Compatible numbers', prompt: 'Which pair of compatible numbers is best for estimating ' + n + ' ÷ ' + d + '?', options: opts,
        work: d + ' × ' + (k * 10) + ' = ' + c + ', and ' + c + ' is the multiple of ' + (d * 10) + ' that is closest to ' + n + '.', plain: 'A compatible number is close to the original number and divides easily by the divisor.',
        teach: [
          x('We need a number close to ' + n + ' that divides easily by ' + d + '.', [String(n), 'change this'], ' ÷ ', [String(d), 'keep this']),
          x('Use the times table. ' + d + ' × ' + k + ' = ' + (d * k) + '. So ' + d + ' × ' + (k * 10) + ' = ' + c + '.', d + ' × ' + (k * 10) + ' = ', [String(c), 'multiple of ' + d]),
          x(c + ' is only ' + Math.abs(r) + ' away from ' + n + '. It is very close.', [String(c), 'close to ' + n]),
          x('Check the others. ' + near + ' does not divide evenly by ' + d + '. ' + far + ' is too far away. And the divisor must stay ' + d + '.', 'Best pair: ', [right, 'answer'])
        ]
      });
    } },

    { id: 'overunder', level: 4, name: 'Overestimate or underestimate', make: function () {
      var v = R.int(0, 3);
      if (v === 3) {
        var opr = R.pick(['+', '−']), A = notMultiple(21, 89, 10), Bn = notMultiple(21, 89, 10);
        while (A === Bn || (opr === '−' && A <= Bn + 10)) { A = notMultiple(21, 89, 10); Bn = notMultiple(21, 89, 10); }
        var da = R.pick(['up', 'down']), db = R.pick(['up', 'down']);
        var right;
        if (opr === '+') right = da === db ? (da === 'up' ? 'Overestimate' : 'Underestimate') : 'Impossible to tell';
        else right = da === db ? 'Impossible to tell' : (da === 'up' ? 'Overestimate' : 'Underestimate');
        var texts = ['Overestimate', 'Underestimate', 'Impossible to tell'];
        var reason = opr === '+' ? (da === db ? 'Both numbers move ' + (da === 'up' ? 'up' : 'down') + ', so the sum moves ' + (da === 'up' ? 'up' : 'down') + ' too.' : 'One number goes up and the other goes down, so the changes work against each other. We cannot tell without adding.') :
          (da === db ? 'Both numbers move ' + da + '. The changes work against each other in a subtraction, so we cannot tell.' : da === 'up' ? 'The first number goes up, which makes the difference bigger. The second goes down, which also makes the difference bigger.' : 'The first number goes down, which makes the difference smaller. The second goes up, which also makes the difference smaller.');
        return Q.choice({
          skill: 'Overestimate or underestimate', prompt: 'Jo rounded ' + A + ' ' + da + ' and ' + Bn + ' ' + db + ' to estimate ' + A + ' ' + opr + ' ' + Bn + '. Will her estimate be an overestimate, an underestimate, or is it impossible to tell?',
          options: texts.map(function (t) { return t === right ? { text: t, ok: true } : { text: t, ok: false, trap: reason }; }),
          work: reason, plain: 'Think about what each rounding does to the answer. Bigger numbers in a sum make a bigger sum. In a subtraction, a bigger second number makes a smaller answer.',
          teach: [
            x('Jo changed ' + A + ' by rounding ' + da + ' and ' + Bn + ' by rounding ' + db + '.', [String(A), da], ' ' + opr + ' ', [String(Bn), db]),
            x(opr === '+' ? 'In a sum, a bigger number makes the sum bigger. A smaller number makes the sum smaller.' : 'In a subtraction, a bigger first number makes the answer bigger. A bigger second number makes the answer smaller.', [opr === '+' ? 'sum' : 'difference', 'think about each number']),
            x(reason, [right, 'answer']),
            note('Remember the words.', 'Over and under', ['Overestimate means the estimate is too big', 'Underestimate means the estimate is too small'])
          ]
        });
      }
      var A2, B2, est, exact, pr, place, op;
      if (v === 0) { place = 100; op = '+'; do { A2 = notMultiple(101, 999, 100); B2 = notMultiple(101, 999, 100); est = rnd(A2, 100) + rnd(B2, 100); exact = A2 + B2; } while (est === exact); pr = 'Ava estimated ' + A2 + ' + ' + B2 + ' by rounding each number to the nearest hundred. Her estimate was ' + est + '.'; }
      else if (v === 1) { place = 10; op = '−'; do { A2 = notMultiple(201, 999, 10); B2 = notMultiple(21, 190, 10); est = rnd(A2, 10) - rnd(B2, 10); exact = A2 - B2; } while (est === exact); pr = 'Ava estimated ' + A2 + ' − ' + B2 + ' by rounding each number to the nearest ten. Her estimate was ' + est + '.'; }
      else { place = 10; op = '×'; var dd; do { A2 = notMultiple(13, 97, 10); dd = R.int(3, 9); est = rnd(A2, 10) * dd; exact = A2 * dd; } while (est === exact); B2 = dd; pr = 'Ava estimated ' + A2 + ' × ' + dd + ' by rounding ' + A2 + ' to the nearest ten. Her estimate was ' + est + '.'; }
      var truth = est > exact ? 'Overestimate' : 'Underestimate';
      var tx = ['Overestimate', 'Underestimate', 'Exactly right'];
      var why = 'The exact answer is ' + exact + ' and the estimate is ' + est + '. ' + est + (est > exact ? ' is bigger, so it is an overestimate.' : ' is smaller, so it is an underestimate.');
      return Q.choice({
        skill: 'Overestimate or underestimate', prompt: pr + ' Is her estimate an overestimate or an underestimate?',
        options: tx.map(function (t) { return t === truth ? { text: t, ok: true } : { text: t, ok: false, trap: why }; }),
        work: why, plain: 'Work out the exact answer. If the estimate is bigger, it is an overestimate. If it is smaller, it is an underestimate.',
        teach: [
          x('We compare the estimate with the exact answer.', ['estimate ' + est, 'Ava'], ' and ', ['exact ?', 'find it']),
          x('Work out the exact answer. ' + A2 + ' ' + op + ' ' + B2 + ' = ' + exact + '.', A2 + ' ' + op + ' ' + B2 + ' = ', [String(exact), 'exact']),
          x('Compare. Her estimate is ' + est + '. The exact answer is ' + exact + '.', [String(est), 'estimate'], est > exact ? ' > ' : ' < ', [String(exact), 'exact']),
          x(est > exact ? 'The estimate is bigger, so it is an overestimate.' : 'The estimate is smaller, so it is an underestimate.', [truth, 'answer'])
        ]
      });
    } },

    { id: 'estmoney2', level: 4, name: 'Estimate with money in shopping stories', make: function () {
      var v = R.int(0, 3), prompt, ans, tr, teach, work, plain, k, pr, nm;
      if (v === 0) {
        var c = prices(1)[0], q = R.int(3, 9), r = dol(c); ans = r * q;
        prompt = 'Each movie ticket costs ' + usd(c) + '. Round the price to the nearest dollar. Estimate the cost of ' + q + ' tickets in dollars.';
        tr = [T(((c * q) / 100).toFixed(2), 'That is the exact cost. Round the price first, then multiply.'), T(String(Math.floor(c / 100) * q), 'You dropped the cents. Round up if the cents are 50 or more.')];
        work = usd(c) + ' rounds to $' + r + '. ' + q + ' × ' + r + ' = ' + ans + '.'; plain = 'Round the price to whole dollars. Then multiply by the number of tickets.';
        teach = [x('We round the price first, then multiply by ' + q + '.', [usd(c), 'round'], ' × ', [String(q), 'tickets']), dollarStep(c), x(q + ' × $' + r + ' = $' + ans + '.', q + ' × $' + r + ' = ', ['$' + ans, 'estimate']), x('The exact cost is ' + usd(c * q) + '. Our estimate is close.', ['$' + ans, 'estimate'], ' and ', [usd(c * q), 'exact'])];
      } else if (v === 1) {
        var bill = R.pick([20, 50]); pr = prices(2); nm = names(2);
        while (dol(pr[0]) + dol(pr[1]) >= bill - 1 || pr[0] + pr[1] > bill * 100) pr = prices(2);
        var rr = pr.map(dol); ans = bill - rr[0] - rr[1];
        prompt = 'Nina pays with a $' + bill + ' bill for ' + listPrices(nm, pr) + '. Round each price to the nearest dollar. Estimate her change in dollars.';
        tr = [T(String(rr[0] + rr[1]), 'That is the estimated cost. The change is what is left from the $' + bill + '.'), T(((bill * 100 - pr[0] - pr[1]) / 100).toFixed(2), 'That is the exact change. Round the prices first to estimate.')];
        work = 'Rounded prices $' + rr[0] + ' and $' + rr[1] + '. $' + bill + ' − $' + rr[0] + ' − $' + rr[1] + ' = $' + ans + '.'; plain = 'Round each price. Add the rounded prices. Take the total away from the bill.';
        teach = [x('Two steps. Round and add the prices, then take the total from the bill.', ['prices', 'step 1'], ' then ', ['change', 'step 2']), dollarStep(pr[0]), dollarStep(pr[1]), x('Add. $' + rr[0] + ' + $' + rr[1] + ' = $' + (rr[0] + rr[1]) + '.', '$' + rr[0] + ' + $' + rr[1] + ' = ', ['$' + (rr[0] + rr[1]), 'estimated cost']), x('Take that from $' + bill + '. $' + bill + ' − $' + (rr[0] + rr[1]) + ' = $' + ans + '.', '$' + bill + ' − $' + (rr[0] + rr[1]) + ' = ', ['$' + ans, 'estimated change'])];
      } else if (v === 2) {
        pr = prices(2); nm = names(2);
        while (dol(pr[0]) === dol(pr[1]) || dol(pr[0]) < dol(pr[1])) pr = prices(2);
        var r2 = pr.map(dol); ans = r2[0] - r2[1];
        prompt = 'Leo sees ' + nm[0] + ' for ' + usd(pr[0]) + ' and ' + nm[1] + ' for ' + usd(pr[1]) + '. Round each price to the nearest dollar. About how many dollars more is the first item than the second?';
        tr = [T(String(r2[0] + r2[1]), 'You added. The question asks how much more, so subtract.'), T(((pr[0] - pr[1]) / 100).toFixed(2), 'That is the exact difference. Round the prices first to estimate.')];
        work = '$' + r2[0] + ' − $' + r2[1] + ' = $' + ans + '.'; plain = 'Round each price. Then subtract the smaller from the bigger.';
        teach = [x('How much more means subtract. We round each price first.', usd(pr[0]) + ' − ' + usd(pr[1])), dollarStep(pr[0]), dollarStep(pr[1]), x('Subtract. $' + r2[0] + ' − $' + r2[1] + ' = $' + ans + '.', '$' + r2[0] + ' − $' + r2[1] + ' = ', ['$' + ans, 'estimate']), x('The exact difference is ' + usd(pr[0] - pr[1]) + '. Our estimate is close.', ['$' + ans, 'estimate'], ' and ', [usd(pr[0] - pr[1]), 'exact'])];
      } else {
        k = R.pick([2, 3]); pr = prices(k); nm = names(k);
        pr = pr.map(function (cc) { return cc % 100 === 0 ? cc + 7 : cc; });
        var ups = pr.map(function (cc) { return Math.ceil(cc / 100); }); ans = ups.reduce(function (p, cc) { return p + cc; }, 0);
        var exact2 = pr.reduce(function (p, cc) { return p + cc; }, 0), rd = pr.reduce(function (p, cc) { return p + dol(cc); }, 0);
        prompt = 'Sam wants to be sure he has enough money for ' + listPrices(nm, pr) + '. Round each price UP to the next whole dollar. What is the estimated total in dollars?';
        tr = [T((exact2 / 100).toFixed(2), 'That is the exact total. Round each price UP to the next dollar first.'), T(String(rd), 'You rounded to the nearest dollar. This question asks you to round every price up.')];
        work = 'Round up: ' + ups.map(function (u) { return '$' + u; }).join(', ') + '. Total: $' + ans + '.'; plain = 'Round every price up, no matter the cents. Then add. This gives a total that is a little too big, so you are safe.';
        teach = [x('Round every price UP to the next whole dollar. This gives a total that is safely big enough.', pr.map(usd).join(' + '))];
        pr.forEach(function (cc, i) { teach.push(x(usd(cc) + ' is between $' + Math.floor(cc / 100) + ' and $' + ups[i] + '. Round up to $' + ups[i] + '.', usd(cc) + ' rounds up to ', ['$' + ups[i], 'up'])); });
        teach.push(x('Add. ' + ups.map(function (u) { return '$' + u; }).join(' + ') + ' = $' + ans + '.', ups.map(function (u) { return '$' + u; }).join(' + ') + ' = ', ['$' + ans, 'estimate']));
        teach.push(x('The exact total is ' + usd(exact2) + '. Our estimate is a little more, which is safe.', ['$' + ans, 'estimate'], ' > ', [usd(exact2), 'exact']));
      }
      return N({ skill: 'Estimate with money', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number of dollars', traps: tr, work: work, plain: plain, teach: teach });
    } },

    { id: 'reasonable', level: 5, name: 'Is the answer reasonable', make: function () {
      var v = R.int(0, 2), op = R.pick(['+', '−', '×']), A, Bn, exact, est, ptxt, place = 100;
      if (op === '+') { A = notMultiple(201, 999, 100); Bn = notMultiple(201, 999, 100); exact = A + Bn; est = rnd(A, 100) + rnd(Bn, 100); }
      else if (op === '−') { do { A = notMultiple(601, 999, 100); Bn = notMultiple(101, 399, 100); } while (A - Bn < 300); exact = A - Bn; est = rnd(A, 100) - rnd(Bn, 100); }
      else { A = notMultiple(21, 98, 10); Bn = R.int(3, 9); exact = A * Bn; est = rnd(A, 10) * Bn; place = 10; }
      ptxt = A + ' ' + op + ' ' + Bn;
      if (v === 2) {
        var offs = Math.max(300, 100 * Math.round(exact * 0.5 / 100));
        var cands = [est, est + Math.max(100, place === 10 ? 100 : 200), est - (est > 300 ? 200 : 0), est * 10];
        var seenT = {}, os = [];
        cands.forEach(function (cv) { if (cv > 0 && !seenT[cv]) { seenT[cv] = 1; os.push(cv); } });
        var wrongs = os.filter(function (cv) { return cv !== est; }).slice(0, 3);
        var rule = place === 100 ? 'Round each number to the nearest hundred' : 'Round ' + A + ' to the nearest ten';
        return Q.choice({
          skill: 'Reasonable answers', prompt: rule + ' to pick the best estimate of ' + ptxt + '.',
          options: [{ text: fmt(est), ok: true }].concat(wrongs.map(function (w) { return { text: fmt(w), ok: false, trap: fmt(w) + ' does not match the rounded numbers. ' + rule + ' and then ' + (op === '+' ? 'add' : op === '−' ? 'subtract' : 'multiply') + ' them.' }; })),
          work: place === 100 ? rnd(A, 100) + ' ' + op + ' ' + rnd(Bn, 100) + ' = ' + est + '.' : rnd(A, 10) + ' × ' + Bn + ' = ' + est + '.', plain: 'Do what the question says: round, then work with the friendly numbers.',
          teach: [
            x(rule + ', then work it out.', ptxt),
            place === 100 ? x(A + ' rounds to ' + rnd(A, 100) + ' and ' + Bn + ' rounds to ' + rnd(Bn, 100) + '.', [String(rnd(A, 100)), 'round'], ' ' + op + ' ', [String(rnd(Bn, 100)), 'round']) : x(A + ' rounds to ' + rnd(A, 10) + '. The other number stays ' + Bn + '.', [String(rnd(A, 10)), 'round'], ' × ', [String(Bn), 'keep']),
            x('Work it out with the friendly numbers. The result is ' + fmt(est) + '.', [fmt(est), 'estimate']),
            x('Only ' + fmt(est) + ' matches. The others are too big or too small.', [fmt(est), 'answer'])
          ]
        });
      }
      var isRight = R.int(0, 1) === 1, claim = isRight ? exact : (R.int(0, 1) ? exact * 10 : exact + offs);
      var rtext = 'Yes, it is reasonable', wtext = 'No, it is not reasonable';
      var rule2 = place === 100 ? 'Round each number to the nearest hundred.' : 'Round ' + A + ' to the nearest ten.';
      var why = isRight ? 'The estimate is ' + fmt(est) + ' and the answer ' + fmt(claim) + ' is very close to it.' : 'The estimate is about ' + fmt(est) + ', but ' + fmt(claim) + ' is far away from that.';
      return Q.choice({
        skill: 'Reasonable answers', prompt: 'Sam says that ' + ptxt + ' = ' + fmt(claim) + '. ' + rule2 + ' Use your estimate to decide. Is his answer reasonable?',
        options: [{ text: rtext, ok: isRight, trap: isRight ? undefined : why }, { text: wtext, ok: !isRight, trap: isRight ? why : undefined }].map(function (o) { if (o.ok) delete o.trap; return o; }),
        work: why, plain: 'Estimate first. If the answer is close to your estimate, it is reasonable. If it is far away, it is not.',
        teach: [
          x('We check Sam\'s answer by making an estimate.', ptxt + ' = ', [fmt(claim), 'Sam says']),
          place === 100 ? x(rule2 + ' ' + A + ' rounds to ' + rnd(A, 100) + '. ' + Bn + ' rounds to ' + rnd(Bn, 100) + '.', [String(rnd(A, 100)), 'round'], ' ' + op + ' ', [String(rnd(Bn, 100)), 'round']) : x(rule2 + ' ' + A + ' rounds to ' + rnd(A, 10) + '.', [String(rnd(A, 10)), 'round'], ' × ', [String(Bn), 'keep']),
          x('The estimate is ' + fmt(est) + '.', [fmt(est), 'estimate']),
          x('Compare. Sam says ' + fmt(claim) + '. ' + (isRight ? 'That is very close to ' + fmt(est) + '.' : 'That is far from ' + fmt(est) + '.'), [fmt(claim), 'Sam'], ' and ', [fmt(est), 'estimate']),
          x(isRight ? 'So the answer is reasonable.' : 'So the answer is not reasonable. Sam should check his work.', [isRight ? 'reasonable' : 'not reasonable', 'answer'])
        ]
      });
    } },

    { id: 'story', level: 5, name: 'Estimation stories', make: function () {
      var v = R.int(0, 3), prompt, ans, tr, teach, work, plain;
      if (v === 0) {
        var a = [notMultiple(1001, 4999, 100), notMultiple(1001, 4999, 100), notMultiple(1001, 4999, 100)];
        var rs = a.map(function (n) { return rnd(n, 100); }); ans = rs[0] + rs[1] + rs[2];
        var ex = a.reduce(function (p, c) { return p + c; }, 0);
        prompt = 'Three BC Ferries sailings carried ' + fmt(a[0]) + ', ' + fmt(a[1]) + ' and ' + fmt(a[2]) + ' passengers. Round each number to the nearest hundred to estimate the total number of passengers.';
        tr = [T(String(ex), 'That is the exact total. Round each number to the nearest hundred first.'), T(String(a.reduce(function (p, c) { return p + flo(c, 100); }, 0)), 'You rounded every number down. Look at the tens digit each time.')];
        work = 'Round each: ' + rs.map(fmt).join(', ') + '. Add: ' + fmt(ans) + '.'; plain = 'Round each number to the nearest hundred. Then add.';
        teach = [x('We want a total, so we add. First round each number to the nearest hundred.', a.map(fmt).join(' + '))].concat(a.map(function (n) { return roundStep(n, 100); })).concat([x('Add. ' + rs.map(fmt).join(' + ') + ' = ' + fmt(ans) + '.', [fmt(ans), 'estimate'])]);
      } else if (v === 1) {
        var y1 = notMultiple(10001, 49999, 1000), y2;
        do { y2 = notMultiple(5001, y1 - 3000, 1000); } while (y2 >= y1 - 3000 || rnd(y1, 1000) - rnd(y2, 1000) <= 0);
        ans = rnd(y1, 1000) - rnd(y2, 1000);
        prompt = 'A town had ' + fmt(y1) + ' people this year and ' + fmt(y2) + ' people last year. Round each number to the nearest thousand. About how many more people live there this year?';
        tr = [T(String(y1 - y2), 'That is the exact difference. Round each number to the nearest thousand first.'), T(String(rnd(y1, 1000) + rnd(y2, 1000)), 'You added. The question asks how many more, so subtract.')];
        work = fmt(rnd(y1, 1000)) + ' − ' + fmt(rnd(y2, 1000)) + ' = ' + fmt(ans) + '.'; plain = 'How many more means subtract. Round each number to the nearest thousand first.';
        teach = [x('How many more means subtract. First round each number to the nearest thousand.', fmt(y1) + ' − ' + fmt(y2)), roundStep(y1, 1000), roundStep(y2, 1000), x('Subtract. ' + fmt(rnd(y1, 1000)) + ' − ' + fmt(rnd(y2, 1000)) + ' = ' + fmt(ans) + '.', [fmt(ans), 'estimate'])];
      } else if (v === 2) {
        var P = notMultiple(12, 48, 10), Nn = notMultiple(21, 98, 10);
        ans = rnd(P, 10) * rnd(Nn, 10);
        prompt = 'A theatre sells ' + Nn + ' tickets at $' + P + ' each. Round both numbers to the nearest ten to estimate the money collected in dollars.';
        tr = [T(String(P * Nn), 'That is the exact answer. Round both numbers to the nearest ten first.'), T(String(ans / 10), 'You lost a zero. Count the zeros in both rounded numbers.'), T(String(ans * 10), 'You have an extra zero. Count the zeros in both rounded numbers.')];
        work = rnd(P, 10) + ' × ' + rnd(Nn, 10) + ' = ' + ans + '.'; plain = 'Round both numbers. Multiply the digits that are not zero. Then write the zeros.';
        teach = [x('Total money is price times tickets. Round both numbers to the nearest ten first.', '$' + P + ' × ' + Nn), roundStep(P, 10), roundStep(Nn, 10), x('Multiply the digits that are not zero. ' + nz(rnd(P, 10)) + ' × ' + nz(rnd(Nn, 10)) + ' = ' + (nz(rnd(P, 10)) * nz(rnd(Nn, 10))) + '.', [String(nz(rnd(P, 10)) * nz(rnd(Nn, 10))), 'without zeros']), x('Add the ' + (zeros(rnd(P, 10)) + zeros(rnd(Nn, 10))) + ' zeros. The estimate is $' + fmt(ans) + '.', [dtext(ans), 'estimate'])];
      } else {
        var days = R.pick([2, 3, 4, 5, 6, 8]), h, HH;
        do { h = R.int(5, 40); HH = h * 100; } while ((HH % days) !== 0);
        var rr = R.int(1, 49) * (R.int(0, 1) ? 1 : -1), X = HH + rr; ans = HH / days;
        prompt = 'The Coquihalla trip is ' + fmt(X) + ' metres of climbing spread over ' + days + ' equal stages. Round ' + fmt(X) + ' to the nearest hundred, then divide. About how many metres are in each stage?';
        tr = [T(String(ans * 10), 'You have an extra zero. Check ' + fmt(HH) + ' ÷ ' + days + '.'), T(String(ans / 10), 'You lost a zero. Check ' + fmt(HH) + ' ÷ ' + days + '.')];
        work = fmt(X) + ' rounds to ' + fmt(HH) + '. ' + fmt(HH) + ' ÷ ' + days + ' = ' + fmt(ans) + '.'; plain = 'Round to the nearest hundred. Then divide by the number of stages.';
        teach = [x('Sharing equally means divide. Round to the nearest hundred first.', fmt(X) + ' ÷ ' + days), roundStep(X, 100), x('Divide the friendly number. ' + fmt(HH) + ' ÷ ' + days + ' = ' + fmt(ans) + '.', fmt(HH) + ' ÷ ' + days + ' = ', [fmt(ans), 'estimate']), x('About ' + fmt(ans) + ' metres in each stage.', [fmt(ans), 'answer'])];
      }
      return N({ skill: 'Estimation stories', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type your estimate', traps: tr, work: work, plain: plain, teach: teach });
    } },

    { id: 'chal', level: 6, name: 'Rounding puzzles', make: function () {
      var v = R.int(0, 2), prompt, ans, tr, teach, work, plain, big = R.int(0, 1) === 1;
      if (v === 0) {
        var X = R.int(3, 90) * 10;
        ans = big ? X + 4 : X - 5;
        prompt = 'What is the ' + (big ? 'greatest' : 'smallest') + ' whole number that rounds to ' + fmt(X) + ' when rounded to the nearest ten?';
        tr = [T(String(big ? X + 5 : X - 6), big ? fmt(X + 5) + ' has a 5 in the ones place, so it rounds up to ' + fmt(X + 10) + '.' : fmt(X - 6) + ' has a 4 in the ones place, so it rounds down to ' + fmt(X - 10) + '.'), T(String(X), 'That works, but it is not the ' + (big ? 'greatest' : 'smallest') + ' one.')];
        work = 'Numbers from ' + fmt(X - 5) + ' to ' + fmt(X + 4) + ' round to ' + fmt(X) + '. The ' + (big ? 'greatest' : 'smallest') + ' is ' + fmt(ans) + '.'; plain = 'A number rounds to ' + fmt(X) + ' when its ones digit is 5 or more just below it, or 4 or less just above it.';
        teach = [
          x('Numbers that round to ' + fmt(X) + ' are those that are closer to ' + fmt(X) + ' than to the tens next to it.', [fmt(X), 'target']),
          lines('The numbers just below and above ' + fmt(X) + '.', [fmt(X - 6) + ' rounds to ' + fmt(X - 10), fmt(X - 5) + ' rounds to ' + fmt(X) + '  (5 rounds up)', fmt(X) + ' rounds to ' + fmt(X), fmt(X + 4) + ' rounds to ' + fmt(X), fmt(X + 5) + ' rounds to ' + fmt(X + 10)], 99),
          x('The smallest is ' + fmt(X - 5) + ' because 5 rounds up. The greatest is ' + fmt(X + 4) + ' because 4 rounds down.', [fmt(X - 5), 'smallest'], ' to ', [fmt(X + 4), 'greatest']),
          x('The ' + (big ? 'greatest' : 'smallest') + ' one is ' + fmt(ans) + '.', [fmt(ans), 'answer'])
        ];
      } else if (v === 1) {
        var place = big ? 1000 : 100, X2 = place === 100 ? R.int(4, 90) * 100 : R.int(3, 90) * 1000, half = place / 2;
        var bigger = R.int(0, 1) === 1; ans = bigger ? X2 + half - 1 : X2 - half;
        prompt = 'What is the ' + (bigger ? 'greatest' : 'smallest') + ' whole number that rounds to ' + fmt(X2) + ' when rounded to the nearest ' + pname(place) + '?';
        tr = [T(String(bigger ? X2 + half : X2 - half - 1), bigger ? fmt(X2 + half) + ' is halfway to the next ' + pname(place) + ', and halfway rounds up.' : fmt(X2 - half - 1) + ' is closer to ' + fmt(X2 - place) + '.'), T(String(X2), 'That works, but it is not the ' + (bigger ? 'greatest' : 'smallest') + ' one.')];
        work = 'Numbers from ' + fmt(X2 - half) + ' to ' + fmt(X2 + half - 1) + ' round to ' + fmt(X2) + '. The ' + (bigger ? 'greatest' : 'smallest') + ' is ' + fmt(ans) + '.'; plain = 'The halfway point below is ' + fmt(X2 - half) + ', and it rounds up. The last number before the halfway point above is ' + fmt(X2 + half - 1) + '.';
        teach = [
          x('The halfway points around ' + fmt(X2) + ' are ' + fmt(X2 - half) + ' and ' + fmt(X2 + half) + '.', [fmt(X2 - half), 'halfway below'], ' and ', [fmt(X2 + half), 'halfway above']),
          x('A number at halfway below rounds up to ' + fmt(X2) + '. So ' + fmt(X2 - half) + ' is included.', [fmt(X2 - half), 'included']),
          x('A number at halfway above rounds up to ' + fmt(X2 + place) + '. So ' + fmt(X2 + half) + ' is not included. The last one is ' + fmt(X2 + half - 1) + '.', [fmt(X2 + half - 1), 'last one']),
          x('The ' + (bigger ? 'greatest' : 'smallest') + ' one is ' + fmt(ans) + '.', [fmt(ans), 'answer'])
        ];
      } else {
        var Tt = R.int(3, 9) * 1000, j = R.int(-4, 4), H = Tt - 100 * j, gr = R.int(0, 1) === 1;
        ans = gr ? H + 49 : H - 50;
        prompt = 'A whole number rounds to ' + fmt(H) + ' when rounded to the nearest hundred, and to ' + fmt(Tt) + ' when rounded to the nearest thousand. What is the ' + (gr ? 'greatest' : 'smallest') + ' number that could it be?';
        tr = [T(String(H), 'That works, but it is not the ' + (gr ? 'greatest' : 'smallest') + ' one.'), T(String(gr ? H + 50 : H - 51), gr ? fmt(H + 50) + ' rounds up to ' + fmt(H + 100) + ', not ' + fmt(H) + '.' : fmt(H - 51) + ' rounds down to ' + fmt(H - 100) + '.')];
        work = 'Nearest hundred ' + fmt(H) + ' means ' + fmt(H - 50) + ' to ' + fmt(H + 49) + '. Nearest thousand ' + fmt(Tt) + ' means ' + fmt(Tt - 500) + ' to ' + fmt(Tt + 499) + '. Both fit for ' + fmt(H - 50) + ' to ' + fmt(H + 49) + '.'; plain = 'Find the numbers that fit each rule, then see where both rules are true.';
        teach = [
          x('There are two rules. Find the numbers for each rule.', ['nearest hundred', fmt(H)], ' and ', ['nearest thousand', fmt(Tt)]),
          x('Nearest hundred is ' + fmt(H) + ': the numbers are ' + fmt(H - 50) + ' to ' + fmt(H + 49) + '.', [fmt(H - 50), 'from'], ' to ', [fmt(H + 49), 'to']),
          x('Nearest thousand is ' + fmt(Tt) + ': the numbers are ' + fmt(Tt - 500) + ' to ' + fmt(Tt + 499) + '.', [fmt(Tt - 500), 'from'], ' to ', [fmt(Tt + 499), 'to']),
          x('Both ranges fit from ' + fmt(H - 50) + ' to ' + fmt(H + 49) + '. That range is inside the thousand range.', [fmt(H - 50), 'smallest'], ' to ', [fmt(H + 49), 'greatest']),
          x('The ' + (gr ? 'greatest' : 'smallest') + ' one is ' + fmt(ans) + '.', [fmt(ans), 'answer'])
        ];
      }
      return N({ skill: 'Rounding puzzles', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a whole number', traps: tr, work: work, plain: plain, teach: teach });
    } }
  ]);
})();
