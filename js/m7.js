/* Module 7: Angular Systems and Geometry. Lessons, vocabulary and question skills. */
(function () {
  'use strict';
  var B = window.Bank, R = B.R, S = B.s, Q = B.q, T = Q.trap;
  var x = S.x, note = S.note, bars = S.bars, fb = S.fb, row = S.row, lines = S.lines;

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
    if (!o.keyboard) o.keyboard = 'numeric';
    if (!o.placeholder) o.placeholder = 'Type the degrees';
    return Q.num(o);
  }
  function mk(label, list, total) {
    var r = { label: label, segs: list.map(function (p) { return { n: 1, cls: p[0], text: p[1] || '' }; }) };
    if (total) r.total = total;
    return r;
  }
  function deg(n) { return n + '°'; }

  /* ---------- Vocabulary ---------- */
  window.MATH_VOCAB[7] = [
    { w: 'Angle', m: 'The amount of turn between two lines that meet at a point. A wide open corner is a big angle.' },
    { w: 'Degree', m: 'The unit for angles. We write it with a small circle, like 90°. A full turn is 360°.' },
    { w: 'Right angle', m: 'A square corner, like the corner of a book. It is exactly 90°.' },
    { w: 'Acute or obtuse angle', m: 'An acute angle is smaller than 90°. An obtuse angle is bigger than 90° but smaller than 180°.' },
    { w: 'Reflex angle', m: 'An angle bigger than 180° but smaller than 360°. It bends back past a straight line.' },
    { w: 'Protractor', m: 'A half circle ruler with numbers from 0 to 180. You use it to measure angles.' },
    { w: 'Parallel lines', m: 'Lines that stay the same distance apart and never meet, like the two rails of a train track.' },
    { w: 'Perpendicular lines', m: 'Lines that cross or meet at a right angle, exactly 90°.' }
  ];

  /* ---------- Lessons ---------- */
  window.MATH_LESSONS[7] = [
    { title: '1. Angles as turns',
      explain: [
        'An angle tells you how much something turns. Open a door a little and the angle is small. Open it wide and the angle is big.',
        'Spin all the way around until you face the same way again. That is one full turn. We count turns in units called degrees. One full turn is 360 degrees, which we write as 360°.',
        'Half a turn is 180°. A quarter turn is 90°. Bigger turns mean bigger angles.'
      ],
      rule: 'A full turn is 360°. A half turn is 180°. A quarter turn is 90°.',
      mistake: 'Angle size is about the turn, not about how long the lines are drawn. Longer lines do not make a bigger angle.',
      steps: [
        bars('A full turn takes you all the way around. Cut it into 4 equal quarters. Each quarter turn is 90°.', [fb('Full turn is 360°', 4, 0, 'bg-indigo-400', '90°')]),
        bars('One quarter turn is 90°.', [fb('Quarter turn', 4, 1, 'bg-indigo-400', '90°')]),
        bars('Two quarter turns make a half turn. That is 90° + 90° = 180°.', [fb('Half turn', 4, 2, 'bg-indigo-400', '90°')]),
        bars('Three quarter turns is 270°.', [fb('Three quarters', 4, 3, 'bg-indigo-400', '90°')]),
        bars('Four quarter turns make a full turn. 4 × 90° = 360°.', [fb('Full turn', 4, 4, 'bg-emerald-400', '90°')]),
        note('Turns and degrees.', 'Remember', ['Quarter turn is 90°', 'Half turn is 180°', 'Three quarter turn is 270°', 'Full turn is 360°'])
      ] },

    { title: '2. Right angle, straight line, full turn',
      explain: [
        'Three angles are so special that we give them their own names. A right angle is a quarter turn. It looks like the corner of a book or a piece of paper.',
        'A straight angle is a half turn. It looks like a flat straight line. Two right angles fit together to make a straight angle.',
        'A full turn goes all the way around a point. Four right angles fit together to make a full turn.'
      ],
      rule: 'Right angle 90°. Straight line 180°. Full turn 360°.',
      mistake: 'A straight line counts as an angle of 180°. It is not zero. It is a half turn.',
      steps: [
        lines('This is a right angle. It is the corner of a book. It measures 90°.', ['|', '|', '|', '|', '|________'], 0),
        x('We mark a right angle with a little square in the corner. It is a quarter turn.', ['90°', 'right angle']),
        lines('A straight line is a half turn. It measures 180°.', ['________________________'], 0),
        x('Two right angles make a straight line. 90° + 90° = 180°.', ['90°', 'one'], ' + ', ['90°', 'two'], ' = ', ['180°', 'straight line']),
        x('Four right angles make a full turn. 4 × 90° = 360°.', '4 × 90° = ', ['360°', 'full turn']),
        note('Three special angles.', 'Special angles', ['Right angle is 90°', 'Straight angle is 180°', 'Full turn is 360°'])
      ] },

    { title: '3. Acute, obtuse and reflex angles',
      explain: [
        'We name angles by their size. An acute angle is smaller than a right angle. It is sharp and narrow, like a slice of pizza.',
        'An obtuse angle is bigger than a right angle but smaller than a straight line. It is wide and open.',
        'A reflex angle is bigger than a straight line but smaller than a full turn. It bends back on itself.'
      ],
      rule: 'Acute is less than 90°. Obtuse is between 90° and 180°. Reflex is between 180° and 360°.',
      mistake: 'Do not say 90° is acute or obtuse. Exactly 90° is a right angle, and exactly 180° is a straight angle.',
      steps: [
        lines('Here is a scale of turns from 0° to 360°. Every angle sits somewhere on it.', ['0°     90°     180°     360°', '|_______|________|________|', 'acute   obtuse   reflex'], 0),
        x('Acute angles are smaller than 90°. For example, 40° is acute.', ['40°', 'acute'], ' is less than 90°'),
        x('Exactly 90° is a right angle.', ['90°', 'right angle']),
        x('Obtuse angles are bigger than 90° but smaller than 180°. For example, 120° is obtuse.', ['120°', 'obtuse']),
        x('Exactly 180° is a straight angle.', ['180°', 'straight angle']),
        x('Reflex angles are bigger than 180° but smaller than 360°. For example, 250° is reflex.', ['250°', 'reflex']),
        note('A way to remember them.', 'Memory help', ['Acute is small and sharp', 'Obtuse is wide and open', 'Reflex bends back'])
      ] },

    { title: '4. Measuring with a protractor',
      explain: [
        'A protractor is a half circle ruler for angles. It has a small mark in the middle and numbers from 0 to 180 around the curved edge.',
        'Put the middle mark on the corner of the angle. Turn the protractor so one arm of the angle sits exactly on the zero line. Then read the number where the other arm crosses the scale.',
        'A protractor has two rows of numbers. Use the row that has a 0 on the arm you lined up. If the angle looks smaller than a right angle, the answer must be less than 90.'
      ],
      rule: 'Middle mark on the corner. Zero on one arm. Read the number on the other arm.',
      mistake: 'Reading from the wrong row of numbers. Look at the angle first. If it is sharp, the answer is less than 90.',
      steps: [
        lines('Here is an angle. The corner is marked with a star.', ['      /', '     /', '    /', '   /', '  *__________'], 0),
        x('Step one. Put the middle mark of the protractor on the corner.', ['Middle mark', 'on the corner']),
        x('Step two. Turn it until one arm sits on the zero line.', ['0', 'on one arm']),
        lines('Step three. Look where the other arm crosses the numbers. Here it crosses 65.', ['      / 65', '     /', '    /', '   /', '  *__________ 0'], 0),
        x('Step four. Check it. The angle looks sharp, so it must be less than 90°.', ['65°', 'acute'], ' is less than 90°'),
        x('Now suppose one arm is at 30 and the other arm is at 110 on the same row. Take the small number away.', '110 − 30 = ', ['80', 'degrees']),
        x('The angle is 80°. It is acute, so the answer makes sense.', ['80°', 'acute'])
      ] },

    { title: '5. Angles on a straight line',
      explain: [
        'A straight line is a half turn, so it is 180°. When two or more angles sit together on a straight line, they share the 180°.',
        'That means all the angles on a straight line add up to 180°.',
        'To find a missing angle, add up the angles you know and take that total away from 180.'
      ],
      rule: 'Angles on a straight line add up to 180°.',
      mistake: 'Do not use 90° or 360° here. A straight line is 180°.',
      steps: [
        lines('Two angles sit on a straight line. One is 65°. The other is a.', ['       /', '      /', '  a   /  65°', '_____/_____________'], 0),
        x('A straight line is 180°. So the two angles add up to 180°.', ['a', 'missing'], ' + 65° = ', ['180°', 'straight line']),
        x('To find a, take 65 away from 180.', 'a = 180° − 65°'),
        x('180 − 65 = 115. So a is 115°.', 'a = ', ['115°', 'answer']),
        x('Check. 115° + 65° = 180°.', '115° + 65° = ', ['180°', 'it works']),
        x('Second example. Three angles on a line are 50°, 70° and b. First add the known ones: 50 + 70 = 120.', '50° + 70° = ', ['120°', 'known']),
        x('Take that from 180. 180 − 120 = 60. So b is 60°.', 'b = 180° − 120° = ', ['60°', 'answer'])
      ] },

    { title: '6. Angles around a point',
      explain: [
        'When angles meet at one point and go all the way around, they make a full turn. A full turn is 360°.',
        'So angles around a point add up to 360°.',
        'To find a missing angle, add up the ones you know and take the total away from 360.'
      ],
      rule: 'Angles around a point add up to 360°.',
      mistake: 'Do not use 180° for a full circle around a point. Around a point it is 360°.',
      steps: [
        lines('Four angles meet at a point. Three are 90°, 130° and 75°. The fourth is d.', ['        |', '  90°   |   130°', '________|________', '        |', '   d    |    75°'], 0),
        x('All the way around is a full turn, 360°.', '90° + 130° + 75° + d = ', ['360°', 'full turn']),
        x('Add the angles we know. 90 + 130 = 220. Then 220 + 75 = 295.', '90° + 130° + 75° = ', ['295°', 'known']),
        x('Take that away from 360. 360 − 295 = 65.', 'd = 360° − 295° = ', ['65°', 'answer']),
        x('Check. 295° + 65° = 360°.', '295° + 65° = ', ['360°', 'it works'])
      ] },

    { title: '7. Angles in a triangle',
      explain: [
        'Here is a secret. Cut out any triangle and tear off its three corners. Line the corners up side by side. They make a perfect straight line.',
        'A straight line is 180°. So the three angles of any triangle always add up to 180°. It works for big, small, fat and skinny triangles.',
        'To find a missing angle, add the two you know and take the total away from 180.'
      ],
      rule: 'The three angles in a triangle add up to 180°.',
      mistake: 'Do not use 360° for a triangle. That is for four sided shapes or a full turn.',
      steps: [
        lines('Tear off the three corners of a triangle and line them up. They fit on a straight line.', ['  A  |  B  |  C', '_____|_____|_____', 'A + B + C = 180°'], 0),
        x('A triangle has angles 50° and 60°. Find the third angle.', ['50°', 'first'], ' and ', ['60°', 'second'], ' and ', ['?', 'third']),
        x('Add the two we know. 50 + 60 = 110.', '50° + 60° = ', ['110°', 'known']),
        x('Take that away from 180. 180 − 110 = 70.', '180° − 110° = ', ['70°', 'third angle']),
        x('Second example. A right triangle has a 90° angle and a 35° angle. 90 + 35 = 125.', '90° + 35° = ', ['125°', 'known']),
        x('180 − 125 = 55. The third angle is 55°.', '180° − 125° = ', ['55°', 'third angle'])
      ] },

    { title: '8. Missing angle problems',
      explain: [
        'Some problems need two steps. You use one fact to find an angle. Then you use that angle with another fact.',
        'An isosceles triangle has two equal sides, and the two angles at the bottom are equal too. Find what is left of 180°, then share it into two equal parts.',
        'Take your time. Write down what you know and which fact to use each time.'
      ],
      rule: 'Use one angle fact at a time. Straight line 180°, point 360°, triangle 180°.',
      mistake: 'Do not skip the sharing step in an isosceles triangle. The 180° leftover belongs to TWO equal angles.',
      steps: [
        x('A triangle has angles 50° and 60°. One side is stretched into a straight line. Find the outside angle next to the third corner.', ['50°', ''], ' and ', ['60°', ''], ' then ', ['?', 'outside']),
        x('Step one. Find the third angle inside. 180 − 50 − 60 = 70.', '180° − 110° = ', ['70°', 'inside angle']),
        x('Step two. The inside angle and the outside angle sit on a straight line. They add to 180°.', '70° + ', ['?', 'outside'], ' = 180°'),
        x('180 − 70 = 110. The outside angle is 110°.', '180° − 70° = ', ['110°', 'answer']),
        x('Second example. An isosceles triangle has a top angle of 40°. The two bottom angles are equal. First find what is left. 180 − 40 = 140.', '180° − 40° = ', ['140°', 'left']),
        x('Share 140 between two equal angles. 140 ÷ 2 = 70.', '140° ÷ 2 = ', ['70°', 'each bottom angle']),
        x('Check. 40° + 70° + 70° = 180°.', '40° + 70° + 70° = ', ['180°', 'it works'])
      ] },

    { title: '9. Classifying triangles',
      explain: [
        'We can sort triangles by their sides. An equilateral triangle has 3 equal sides. An isosceles triangle has exactly 2 equal sides. A scalene triangle has no equal sides.',
        'We can also sort them by their angles. An acute triangle has all 3 angles smaller than 90°. A right triangle has one angle of exactly 90°. An obtuse triangle has one angle bigger than 90°.',
        'A triangle can have only one right angle or one obtuse angle, because the three angles must add to 180°.'
      ],
      rule: 'Sides: equilateral 3 equal, isosceles 2 equal, scalene none equal. Angles: acute, right, obtuse.',
      mistake: 'If all 3 sides are equal, call it equilateral. Isosceles means exactly 2 sides are equal.',
      steps: [
        lines('This triangle has 3 equal sides. It is equilateral. All its angles are 60°.', ['    /\\', '   /  \\', '  /    \\', ' /______\\'], 0),
        x('Sides 6 cm, 6 cm and 9 cm. Exactly 2 are equal. That is an isosceles triangle.', ['6, 6, 9', 'isosceles']),
        x('Sides 4 cm, 5 cm and 7 cm. None are equal. That is a scalene triangle.', ['4, 5, 7', 'scalene']),
        x('Angles 50°, 60° and 70°. All are less than 90°. That is an acute triangle.', ['50°, 60°, 70°', 'acute triangle']),
        x('Angles 90°, 35° and 55°. One angle is exactly 90°. That is a right triangle.', ['90°, 35°, 55°', 'right triangle']),
        x('Angles 110°, 40° and 30°. One angle is bigger than 90°. That is an obtuse triangle.', ['110°, 40°, 30°', 'obtuse triangle'])
      ] },

    { title: '10. Quadrilaterals',
      explain: [
        'A quadrilateral is any shape with 4 straight sides and 4 corners. Squares, rectangles and many other shapes are quadrilaterals.',
        'The 4 angles inside any quadrilateral add up to 360°. You can check this with a rectangle. Four right angles make 4 × 90° = 360°.',
        'A parallelogram has two pairs of parallel sides. Its opposite angles are equal, and angles next to each other add up to 180°.'
      ],
      rule: 'The four angles in a quadrilateral add up to 360°.',
      mistake: 'Do not use 180° for a quadrilateral. That is for a triangle. Four sided shapes use 360°.',
      steps: [
        lines('A rectangle has 4 sides and 4 right angles.', [' ____________', '|            |', '|            |', '|____________|'], 0),
        x('Four right angles add to 360°.', '90° + 90° + 90° + 90° = ', ['360°', 'quadrilateral']),
        note('Some quadrilaterals to know.', 'Names of shapes', ['Square: 4 equal sides, 4 right angles', 'Rectangle: 4 right angles, opposite sides equal', 'Parallelogram: 2 pairs of parallel sides', 'Trapezoid: exactly 1 pair of parallel sides']),
        x('Missing angle. Three angles are 85°, 95° and 110°. Add them: 85 + 95 + 110 = 290.', '85° + 95° + 110° = ', ['290°', 'known']),
        x('Take that away from 360. 360 − 290 = 70. The fourth angle is 70°.', '360° − 290° = ', ['70°', 'fourth angle']),
        x('In a parallelogram, angles next to each other add to 180°. If one is 70°, its neighbor is 110°.', '180° − 70° = ', ['110°', 'neighbor']),
        x('Opposite angles are equal. So the angle opposite the 70° is also 70°.', ['70°', 'opposite'], ' = ', ['70°', 'opposite'])
      ] },

    { title: '11. Parallel and perpendicular lines',
      explain: [
        'Parallel lines run side by side. They stay the same distance apart and never meet, no matter how far you draw them. The rails of a train track are parallel.',
        'Perpendicular lines meet or cross at a right angle. That is a square corner of exactly 90°. A wall and the floor are perpendicular.',
        'A rectangle has both. Opposite sides are parallel. Sides that meet at a corner are perpendicular.'
      ],
      rule: 'Parallel lines never meet. Perpendicular lines meet at 90°.',
      mistake: 'Lines that cross at any angle are not always perpendicular. They must cross at exactly 90°.',
      steps: [
        lines('These two lines are parallel. They stay the same distance apart and never meet.', ['________________________', '', '________________________'], 0),
        lines('These two lines are perpendicular. They meet at a right angle of 90°.', ['        |', '        |', '        |', '________|________'], 0),
        x('Two lines cross and make an angle of 60°. They are not parallel because they meet. They are not perpendicular because 60° is not 90°.', ['60°', 'neither'], ' is not ', ['90°', 'right angle']),
        note('Look at a rectangle.', 'Lines in a rectangle', ['The top and bottom are parallel', 'The left and right sides are parallel', 'Each corner has two perpendicular sides']),
        x('Quick test. Do the lines never meet? Then parallel. Do they meet at 90°? Then perpendicular.', ['Never meet', 'parallel'], ' or ', ['Meet at 90°', 'perpendicular'])
      ] }
  ];

  /* ---------- Question skills ---------- */
  B.register(7, [

    { id: 'turn', level: 1, name: 'Turns and degrees', make: function () {
      var k, item, prompt, ans, parts, trapList;
      if (R.int(0, 1) === 1) {
        k = R.int(2, 4); ans = 90 * k; parts = k;
        prompt = R.pick(['A robot makes ' + k + ' quarter turns in a row. How many degrees has it turned in total?', 'A dancer spins ' + k + ' quarter turns. How many degrees is that?']);
        trapList = [T(k, 'That is the number of quarter turns. Each quarter turn is 90°, so multiply by 90.'), T(90, 'That is just one quarter turn. There are ' + k + ' of them.')];
      } else {
        item = R.pick([['a quarter turn', 90, 1], ['a half turn', 180, 2], ['three quarters of a turn', 270, 3], ['a full turn', 360, 4]]);
        ans = item[1]; parts = item[2];
        prompt = 'How many degrees is ' + item[0] + '?';
        trapList = ans === 360 ? [T(180, 'That is only a half turn. A full turn goes all the way around.')] : [T(360, 'That is a full turn. You need only part of it.')];
      }
      return N({
        skill: 'Turns and degrees', prompt: prompt, answer: ans, traps: trapList,
        work: 'A full turn is 360°. One quarter turn is 90°. ' + parts + ' × 90 = ' + ans + '.',
        plain: 'A full turn is 360°. Cut it into 4 quarter turns of 90° each and count how many you need.',
        teach: [
          bars('A full turn is 360°. Cut it into 4 quarter turns of 90° each.', [fb('Full turn is 360°', 4, 0, 'bg-indigo-400', '90°')]),
          bars('Count ' + parts + (parts === 1 ? ' quarter turn.' : ' quarter turns.'), [fb(parts + ' of 4', 4, parts, 'bg-emerald-400', '90°')]),
          x(parts + ' quarter ' + (parts === 1 ? 'turn' : 'turns') + ' is ' + parts + ' × 90° = ' + ans + '°.', parts + ' × 90° = ', [deg(ans), 'degrees']),
          x('The answer is ' + ans + ' degrees.', [deg(ans), 'answer'])
        ]
      });
    } },

    { id: 'classify', level: 1, name: 'Name the angle', make: function () {
      var kinds = { acute: 'Acute angle', right: 'Right angle', obtuse: 'Obtuse angle', straight: 'Straight angle', reflex: 'Reflex angle' };
      var rule = { acute: 'An acute angle is smaller than 90°.', right: 'A right angle is exactly 90°.', obtuse: 'An obtuse angle is between 90° and 180°.', straight: 'A straight angle is exactly 180°.', reflex: 'A reflex angle is between 180° and 360°.' };
      var key = R.pick(['acute', 'acute', 'right', 'obtuse', 'obtuse', 'straight', 'reflex', 'reflex']);
      var a = { acute: R.int(10, 85), right: 90, obtuse: R.int(95, 175), straight: 180, reflex: R.int(190, 350) }[key];
      var others = R.shuffle(Object.keys(kinds).filter(function (k) { return k !== key; })).slice(0, 3);
      var opts = [{ text: kinds[key], ok: true }].concat(others.map(function (k) {
        return { text: kinds[k], ok: false, trap: rule[k] + ' This angle is ' + a + '°, so that is not the right name.' };
      }));
      return Q.choice({
        skill: 'Name the angle', prompt: 'An angle measures ' + a + '°. What kind of angle is it?', options: opts,
        work: rule[key] + ' ' + a + '° fits.', plain: 'Compare the angle to 90°, 180° and 360°.',
        teach: [
          x('We have an angle of ' + a + '°. Let us compare it with the special angles 90°, 180° and 360°.', [deg(a), 'compare']),
          note('Sort by size.', 'Kinds of angle', ['Acute: less than 90°', 'Right angle: exactly 90°', 'Obtuse: between 90° and 180°', 'Straight angle: exactly 180°', 'Reflex: between 180° and 360°']),
          x(a + '° is ' + (key === 'acute' ? 'less than 90°.' : key === 'right' ? 'exactly 90°.' : key === 'obtuse' ? 'more than 90° and less than 180°.' : key === 'straight' ? 'exactly 180°.' : 'more than 180° and less than 360°.'), [deg(a), kinds[key]]),
          x('So it is a ' + kinds[key].toLowerCase() + '.', [kinds[key], 'answer'])
        ]
      });
    } },

    { id: 'parperp', level: 1, name: 'Parallel or perpendicular', make: function () {
      var an = R.pick([R.int(35, 80), R.int(100, 145)]);
      var items = [
        ['Two lines run side by side, always the same distance apart, and never meet. What are they?', 'Parallel'],
        ['Two lines cross and make a square corner of exactly 90°. What are they?', 'Perpendicular'],
        ['The two long edges of a ruler. What are they?', 'Parallel'],
        ['A wall and the floor where they meet. What are they?', 'Perpendicular'],
        ['The two rails of a straight train track. What are they?', 'Parallel'],
        ['The hour hand and the minute hand of a clock at three o\'clock. What are they?', 'Perpendicular'],
        ['Two lines cross and make an angle of ' + an + '°. What are they?', 'Neither'],
        ['Two lines cross at ' + an + '° and never run side by side. What are they?', 'Neither']
      ];
      var it = R.pick(items), ans = it[1];
      var why = { Parallel: 'Parallel lines never touch or cross. Here the lines meet.', Perpendicular: 'Perpendicular lines meet at exactly 90°. That is not what we have here.',
                  Neither: 'Think again. Do the lines never meet, or do they meet at exactly 90°?' };
      var names = ['Parallel', 'Perpendicular', 'Neither'];
      var opts = names.map(function (nm) {
        var t = nm === 'Neither' ? 'Neither parallel nor perpendicular' : nm;
        return nm === ans ? { text: t, ok: true } : { text: t, ok: false, trap: ans === 'Parallel' && nm === 'Perpendicular' ? 'Perpendicular lines meet at 90°. These lines never meet.' : ans === 'Parallel' ? 'These lines never meet, so they must be parallel.' : why[nm] };
      });
      return Q.choice({
        skill: 'Parallel or perpendicular', prompt: it[0], options: opts,
        work: ans === 'Neither' ? 'The lines meet, so they are not parallel. The angle is not 90°, so they are not perpendicular.' : ans === 'Parallel' ? 'Lines that never meet are parallel.' : 'Lines that meet at 90° are perpendicular.',
        plain: 'Parallel lines never meet. Perpendicular lines meet at a right angle.',
        teach: [
          x('Parallel lines never meet. Perpendicular lines meet at exactly 90°.', ['Parallel', 'never meet'], ' and ', ['Perpendicular', 'meet at 90°']),
          lines('Parallel lines look like this. They stay the same distance apart.', ['________________', '', '________________'], 0),
          lines('Perpendicular lines look like this. They meet at a square corner.', ['      |', '      |', '______|______'], 0),
          x('Now look at the question. The answer is ' + (ans === 'Neither' ? 'neither one.' : ans.toLowerCase() + '.'), [ans === 'Neither' ? 'Neither' : ans, 'answer'])
        ]
      });
    } },

    { id: 'tot', level: 2, name: 'Angles on a line or in a right angle', make: function () {
      var straight = R.int(0, 1) === 1, tot = straight ? 180 : 90;
      var a = straight ? R.int(20, 160) : R.int(10, 80), ans = tot - a;
      var prompt = straight ? R.pick(['Two angles sit together on a straight line. One is ' + a + '°. How big is the other angle?', 'A straight line is split into two angles. One angle is ' + a + '°. Find the other angle.'])
                            : R.pick(['Two angles fit together to make a right angle. One is ' + a + '°. How big is the other angle?', 'A right angle is split into two angles. One angle is ' + a + '°. Find the other angle.']);
      var traps = straight ? [T(90 - a, 'That works for a right angle. A straight line is 180°.'), T(360 - a, 'That is for a full turn. A straight line is a half turn, 180°.')]
                           : [T(180 - a, 'That works for a straight line. A right angle is only 90°.'), T(a, 'That is the angle you already know. Take it away from 90.')];
      var pic = straight ? lines('Two angles on a straight line. They share 180°.', ['       /', '      /', '  ?   /  ' + a + '°', '_____/_____________'], 0)
                         : lines('Two angles inside a right angle. They share 90°.', ['|', '|   /', '| ? /  ' + a + '°', '|__/______'], 0);
      return N({
        skill: 'Angles on a line or in a right angle', prompt: prompt, answer: ans, traps: traps,
        work: tot + ' − ' + a + ' = ' + ans + '.', plain: 'The two angles make ' + tot + '°. Take the one you know away from ' + tot + '.',
        teach: [
          pic,
          x((straight ? 'A straight line is 180°.' : 'A right angle is 90°.') + ' So the two angles add up to ' + tot + '°.', '? + ' + a + '° = ', [deg(tot), straight ? 'straight line' : 'right angle']),
          x('Take ' + a + ' away from ' + tot + '. ' + tot + ' − ' + a + ' = ' + ans + '.', deg(tot) + ' − ' + deg(a) + ' = ', [deg(ans), 'missing angle']),
          x('Check. ' + ans + '° + ' + a + '° = ' + tot + '°.', deg(ans) + ' + ' + deg(a) + ' = ', [deg(tot), 'it works'])
        ]
      });
    } },

    { id: 'protractor', level: 2, name: 'Read a protractor', make: function () {
      if (R.int(0, 1) === 0) {
        var m = 5 * R.int(2, 12), n = m + 5 * R.int(4, 20), ans = n - m;
        return N({
          skill: 'Read a protractor', prompt: 'You measure an angle with a protractor. The first arm crosses the scale at ' + m + '. The second arm crosses the same scale at ' + n + '. How many degrees is the angle?',
          answer: ans, traps: [T(n + m, 'You added. The angle is the gap between the two arms, so take the smaller number away from the bigger one.'), T(n, 'That is only where the second arm crosses. The first arm is not on zero, so take ' + m + ' away.')],
          work: n + ' − ' + m + ' = ' + ans + '.', plain: 'The angle is the gap between the two readings. Take the small number away from the big number.',
          teach: [
            x('The first arm is at ' + m + ', not at zero. So we cannot just read ' + n + '.', [String(m), 'first arm'], ' and ', [String(n), 'second arm']),
            x('The angle is the gap between the two arms.', deg(n) + ' − ' + deg(m)),
            x(n + ' − ' + m + ' = ' + ans + '.', n + ' − ' + m + ' = ', [deg(ans), 'the angle']),
            x('The angle is ' + ans + '°.', [deg(ans), 'answer'])
          ]
        });
      }
      var a = 5 * R.int(4, 16), sharp = R.int(0, 1) === 1, right = sharp ? a : 180 - a, wrong = sharp ? 180 - a : a;
      return Q.choice({
        skill: 'Read a protractor', prompt: 'An angle looks ' + (sharp ? 'smaller' : 'wider') + ' than a right angle. Its arm crosses the protractor at ' + a + ' on one row and ' + (180 - a) + ' on the other row. What is the size of the angle?',
        options: [
          { text: right + '°', ok: true },
          { text: wrong + '°', ok: false, trap: 'That is from the wrong row. The angle is ' + (sharp ? 'smaller' : 'wider') + ' than 90°, so the answer must be ' + (sharp ? 'less' : 'more') + ' than 90.' },
          { text: 'It could be either one', ok: false, trap: 'Use your eyes first. A sharp angle is less than 90°. A wide angle is more than 90°. That picks the right row.' }
        ],
        work: 'The angle is ' + (sharp ? 'smaller' : 'wider') + ' than 90°, so it is ' + right + '°.', plain: 'Look at the angle first. Then pick the number that fits.',
        teach: [
          x('The arm crosses two numbers, ' + a + ' and ' + (180 - a) + '. We must pick the right row.', [String(a), 'one row'], ' or ', [String(180 - a), 'other row']),
          x('Look at the angle. It looks ' + (sharp ? 'smaller' : 'wider') + ' than a right angle.', ['Angle', sharp ? 'less than 90°' : 'more than 90°']),
          x('So the answer must be ' + (sharp ? 'less' : 'more') + ' than 90.', [String(right), (sharp ? 'less' : 'more') + ' than 90']),
          x('The angle is ' + right + '°.', [deg(right), 'answer'])
        ]
      });
    } },

    { id: 'shapename', level: 2, name: 'Name the triangle or quadrilateral', make: function () {
      var cat = R.pick(['sides', 'angles', 'quad']);
      if (cat === 'sides') {
        var kind = R.pick(['Equilateral', 'Isosceles', 'Scalene']), s1, s2, s3;
        if (kind === 'Equilateral') { s1 = s2 = s3 = R.int(3, 12); }
        else if (kind === 'Isosceles') { s1 = s2 = R.int(3, 12); do { s3 = R.int(2, 14); } while (s3 === s1 || s3 >= 2 * s1); }
        else { do { s1 = R.int(3, 8); s2 = R.int(3, 10); s3 = R.int(3, 12); } while (s1 === s2 || s2 === s3 || s1 === s3 || s3 >= s1 + s2 || s1 >= s2 + s3 || s2 >= s1 + s3); }
        var sides = R.shuffle([s1, s2, s3]);
        var why = { Equilateral: 'Equilateral means all 3 sides are equal.', Isosceles: 'Isosceles means exactly 2 sides are equal.', Scalene: 'Scalene means no sides are equal.' };
        var opts = ['Equilateral', 'Isosceles', 'Scalene'].map(function (k) { return k === kind ? { text: k + ' triangle', ok: true } : { text: k + ' triangle', ok: false, trap: why[k] + ' Check how many sides are equal in ' + sides.join(', ') + '.' }; });
        return Q.choice({
          skill: 'Name the triangle', prompt: 'A triangle has sides of ' + sides[0] + ' cm, ' + sides[1] + ' cm and ' + sides[2] + ' cm. What kind of triangle is it?', options: opts,
          work: why[kind], plain: 'Count how many sides are the same length.',
          teach: [
            x('The sides are ' + sides[0] + ' cm, ' + sides[1] + ' cm and ' + sides[2] + ' cm.', [sides.join(', '), 'sides']),
            note('Name a triangle by how many sides are equal.', 'Sides', ['Equilateral: 3 equal sides', 'Isosceles: exactly 2 equal sides', 'Scalene: no equal sides']),
            x('Count the equal sides here. ' + (kind === 'Equilateral' ? 'All 3 are equal.' : kind === 'Isosceles' ? 'Exactly 2 are equal.' : 'None are equal.'), [sides.join(', '), kind]),
            x('So it is a ' + kind.toLowerCase() + ' triangle.', [kind, 'answer'])
          ]
        });
      }
      if (cat === 'angles') {
        var tk = R.pick(['Acute', 'Right', 'Obtuse']), A, Bn, C, a1;
        if (tk === 'Right') { A = 90; Bn = R.int(20, 70); C = 90 - Bn; }
        else if (tk === 'Obtuse') { A = R.int(95, 130); a1 = 180 - A; Bn = R.int(10, a1 - 10); C = a1 - Bn; }
        else { do { A = R.int(45, 80); Bn = R.int(45, 80); C = 180 - A - Bn; } while (C < 30 || C > 85); }
        var angs = R.shuffle([A, Bn, C]);
        var why2 = { Acute: 'An acute triangle has all 3 angles smaller than 90°.', Right: 'A right triangle has one angle of exactly 90°.', Obtuse: 'An obtuse triangle has one angle bigger than 90°.' };
        var opts2 = ['Acute', 'Right', 'Obtuse'].map(function (k) { return k === tk ? { text: k + ' triangle', ok: true } : { text: k + ' triangle', ok: false, trap: why2[k] + ' Look at the angles ' + angs.join('°, ') + '°.' }; });
        return Q.choice({
          skill: 'Name the triangle', prompt: 'A triangle has angles of ' + angs[0] + '°, ' + angs[1] + '° and ' + angs[2] + '°. What kind of triangle is it?', options: opts2,
          work: why2[tk], plain: 'Look at the biggest angle. Is it less than 90, exactly 90, or more than 90?',
          teach: [
            x('The angles are ' + angs.join('°, ') + '°. Look for the biggest one.', [angs.join('°, ') + '°', 'angles']),
            note('Name a triangle by its biggest angle.', 'Angles', ['Acute: all angles less than 90°', 'Right: one angle exactly 90°', 'Obtuse: one angle more than 90°']),
            x('The biggest angle is ' + Math.max(A, Bn, C) + '°. That is ' + (tk === 'Acute' ? 'less than 90°.' : tk === 'Right' ? 'exactly 90°.' : 'more than 90°.'), [deg(Math.max(A, Bn, C)), 'biggest']),
            x('So it is a ' + tk.toLowerCase() + ' triangle.', [tk, 'answer'])
          ]
        });
      }
      var q = R.pick(['Square', 'Rectangle', 'Rhombus', 'Parallelogram', 'Trapezoid']), l = R.int(4, 12), w, an = 5 * R.int(8, 16);
      do { w = R.int(3, 9); } while (w === l);
      if (an === 90) an = 70;
      var qd = {
        Square: ['A four sided shape has 4 equal sides of ' + l + ' cm and 4 right angles. What is it?', ['Square', 'Trapezoid', 'Triangle', 'Hexagon']],
        Rectangle: ['A four sided shape has 4 right angles. Its sides are ' + l + ' cm, ' + w + ' cm, ' + l + ' cm and ' + w + ' cm. What is it?', ['Rectangle', 'Square', 'Rhombus', 'Trapezoid']],
        Rhombus: ['A four sided shape has 4 equal sides of ' + l + ' cm. Its angles are ' + an + '° and ' + (180 - an) + '°, so it has no right angles. What is it?', ['Rhombus', 'Rectangle', 'Square', 'Trapezoid']],
        Parallelogram: ['A four sided shape has two pairs of parallel sides. Its sides are ' + l + ' cm and ' + w + ' cm, and it has no right angles. What is it?', ['Parallelogram', 'Rectangle', 'Rhombus', 'Trapezoid']],
        Trapezoid: ['A four sided shape has sides of ' + l + ' cm, ' + w + ' cm, ' + (l + 2) + ' cm and ' + (w + 1) + ' cm. Exactly one pair of its sides is parallel. What is it?', ['Trapezoid', 'Rectangle', 'Rhombus', 'Square']]
      };
      var why3 = { Square: 'A square has 4 equal sides AND 4 right angles.', Rectangle: 'A rectangle has 4 right angles and equal opposite sides, but its neighbor sides are different.',
                   Rhombus: 'A rhombus has 4 equal sides but no right angles.', Parallelogram: 'A parallelogram has two pairs of parallel sides and no right angles.', Trapezoid: 'A trapezoid has exactly one pair of parallel sides.',
                   Triangle: 'A triangle has 3 sides, not 4.', Hexagon: 'A hexagon has 6 sides, not 4.' };
      var opts3 = qd[q][1].map(function (k) { return k === q ? { text: k, ok: true } : { text: k, ok: false, trap: why3[k] + ' That does not match this shape.' }; });
      return Q.choice({
        skill: 'Name the quadrilateral', prompt: qd[q][0], options: opts3, work: why3[q], plain: 'Match the clues to the special features of each shape.',
        teach: [
          x('Read the clues. Look at the sides, the angles and any parallel sides.', ['Clues', 'sides and angles']),
          note('Features of four sided shapes.', 'Shape facts', ['Square: 4 equal sides, 4 right angles', 'Rectangle: 4 right angles, opposite sides equal', 'Rhombus: 4 equal sides, no right angles', 'Parallelogram: 2 pairs of parallel sides, no right angles', 'Trapezoid: exactly 1 pair of parallel sides']),
          x('The clues match this fact. ' + why3[q], [q, 'matches']),
          x('So the shape is a ' + q.toLowerCase() + '.', [q, 'answer'])
        ]
      });
    } },

    { id: 'point', level: 3, name: 'Angles around a point', make: function () {
      var k = R.pick([2, 3]), known = [], sum, miss;
      for (var t = 0; t < 100; t++) {
        known = []; sum = 0;
        for (var i = 0; i < k; i++) { var v = 5 * R.int(6, 26); known.push(v); sum += v; }
        miss = 360 - sum;
        if (miss >= 20 && miss <= 200 && miss !== sum) break;
      }
      var list = known.map(deg).join(', ');
      var addLine = known.join(' + ') + ' = ' + sum;
      return N({
        skill: 'Angles around a point', prompt: 'Angles meet at a point and go all the way around it. ' + (k + 1) + ' angles are shown. ' + (k === 2 ? 'Two of them are ' + deg(known[0]) + ' and ' + deg(known[1]) : 'Three of them are ' + deg(known[0]) + ', ' + deg(known[1]) + ' and ' + deg(known[2])) + '. What is the last angle?',
        answer: miss, traps: (180 - sum > 0 ? [T(180 - sum, 'That uses 180. Angles around a point make a full turn, so use 360.')] : []).concat([T(sum, 'That is the total of the angles you already know. Take it away from 360.')]),
        work: addLine + ', then 360 − ' + sum + ' = ' + miss + '.', plain: 'All the way around is 360°. Add the angles you know and take that away from 360.',
        teach: [
          x('Angles around a point make a full turn. A full turn is 360°.', 'All the angles add to ', ['360°', 'full turn']),
          x('Add the angles we know. ' + addLine + '.', known.map(deg).join(' + ') + ' = ', [deg(sum), 'known']),
          x('Take that away from 360. 360 − ' + sum + ' = ' + miss + '.', '360° − ' + deg(sum) + ' = ', [deg(miss), 'last angle']),
          x('Check. ' + deg(sum) + ' + ' + deg(miss) + ' = 360°.', deg(sum) + ' + ' + deg(miss) + ' = ', ['360°', 'it works'])
        ]
      });
    } },

    { id: 'triangle', level: 3, name: 'Third angle of a triangle', make: function () {
      if (R.int(0, 1) === 0) {
        var a, b, c;
        do { a = R.int(30, 100); b = R.int(20, 90); c = 180 - a - b; } while (c < 15);
        return N({
          skill: 'Third angle of a triangle', prompt: 'Two angles in a triangle are ' + deg(a) + ' and ' + deg(b) + '. What is the third angle?', answer: c,
          traps: [T(a + b, 'That is the total of the two angles you know. Take it away from 180.'), T(360 - a - b, 'You used 360. The angles in a triangle add up to 180.')],
          work: a + ' + ' + b + ' = ' + (a + b) + ', then 180 − ' + (a + b) + ' = ' + c + '.', plain: 'All three angles make 180°. Add the two you know, and take that from 180.',
          teach: [
            x('The three angles in a triangle add up to 180°.', 'a + b + c = ', ['180°', 'triangle']),
            x('Add the two angles we know. ' + a + ' + ' + b + ' = ' + (a + b) + '.', deg(a) + ' + ' + deg(b) + ' = ', [deg(a + b), 'known']),
            x('Take that away from 180. 180 − ' + (a + b) + ' = ' + c + '.', '180° − ' + deg(a + b) + ' = ', [deg(c), 'third angle']),
            x('Check. ' + a + ' + ' + b + ' + ' + c + ' = 180.', deg(a) + ' + ' + deg(b) + ' + ' + deg(c) + ' = ', ['180°', 'it works'])
          ]
        });
      }
      var r = R.int(15, 75), ans = 90 - r;
      return N({
        skill: 'Third angle of a triangle', prompt: 'A right triangle has an angle of ' + deg(r) + '. What is the third angle?', answer: ans,
        traps: [T(180 - r, 'You forgot the right angle. A right triangle already has a 90° angle. Take away both 90 and ' + r + '.'), T(r + 90, 'That is the total of the two angles you know. Take it away from 180.')],
        work: '90 + ' + r + ' = ' + (90 + r) + ', then 180 − ' + (90 + r) + ' = ' + ans + '.', plain: 'A right triangle has one 90° angle. The other two angles share the rest of the 180°.',
        teach: [
          x('A right triangle has one angle of 90°. The angles add up to 180°.', ['90°', 'right angle'], ' + ' + deg(r) + ' + ? = 180°'),
          x('Add the two angles we know. 90 + ' + r + ' = ' + (90 + r) + '.', '90° + ' + deg(r) + ' = ', [deg(90 + r), 'known']),
          x('Take that away from 180. 180 − ' + (90 + r) + ' = ' + ans + '.', '180° − ' + deg(90 + r) + ' = ', [deg(ans), 'third angle']),
          x('Shortcut. The two small angles share 90°. 90 − ' + r + ' = ' + ans + '.', '90° − ' + deg(r) + ' = ', [deg(ans), 'same answer'])
        ]
      });
    } },

    { id: 'quad', level: 4, name: 'Fourth angle of a quadrilateral', make: function () {
      var a, b, c, d;
      do { a = 5 * R.int(12, 30); b = 5 * R.int(12, 30); c = 5 * R.int(12, 30); d = 360 - a - b - c; } while (d < 30 || d > 170);
      return N({
        skill: 'Fourth angle of a quadrilateral', prompt: 'Three angles in a four sided shape are ' + deg(a) + ', ' + deg(b) + ' and ' + deg(c) + '. What is the fourth angle?', answer: d,
        traps: [T(a + b + c, 'That is the total of the three angles you know. Take it away from 360.')],
        work: a + ' + ' + b + ' + ' + c + ' = ' + (a + b + c) + ', then 360 − ' + (a + b + c) + ' = ' + d + '.', plain: 'The four angles make 360°. Add the three you know and take that from 360.',
        teach: [
          x('The four angles in any four sided shape add up to 360°.', 'a + b + c + d = ', ['360°', 'quadrilateral']),
          x('Add the three angles we know. ' + a + ' + ' + b + ' + ' + c + ' = ' + (a + b + c) + '.', deg(a) + ' + ' + deg(b) + ' + ' + deg(c) + ' = ', [deg(a + b + c), 'known']),
          x('Take that away from 360. 360 − ' + (a + b + c) + ' = ' + d + '.', '360° − ' + deg(a + b + c) + ' = ', [deg(d), 'fourth angle']),
          x('Check. ' + (a + b + c) + ' + ' + d + ' = 360.', deg(a + b + c) + ' + ' + deg(d) + ' = ', ['360°', 'it works'])
        ]
      });
    } },

    { id: 'reflex', level: 4, name: 'Reflex angles', make: function () {
      var a = 5 * R.int(6, 34), ans = 360 - a;
      var prompt = R.pick(['Around a point, one angle is ' + deg(a) + '. The rest of the way around is a reflex angle. How big is the reflex angle?', 'A corner has an angle of ' + deg(a) + ' inside. What is the size of the reflex angle on the outside of the same corner?']);
      return N({
        skill: 'Reflex angles', prompt: prompt, answer: ans,
        traps: [T(180 - a, 'That works for a straight line. Here the two angles go all the way around, so use 360.'), T(a, 'That is the angle you already know. Take it away from 360.')],
        work: '360 − ' + a + ' = ' + ans + '.', plain: 'The two angles fit together to make a full turn, 360°. Take away the one you know.',
        teach: [
          x('The ' + deg(a) + ' angle and the reflex angle go all the way around a point. They make a full turn.', deg(a) + ' + ? = ', ['360°', 'full turn']),
          x('Take ' + a + ' away from 360. 360 − ' + a + ' = ' + ans + '.', '360° − ' + deg(a) + ' = ', [deg(ans), 'reflex angle']),
          x('Check. A reflex angle is between 180° and 360°. ' + ans + '° fits.', [deg(ans), 'reflex']),
          x('The reflex angle is ' + ans + '°.', [deg(ans), 'answer'])
        ]
      });
    } },

    { id: 'isos', level: 5, name: 'Isosceles triangles', make: function () {
      if (R.int(0, 1) === 0) {
        var apex = 2 * R.int(10, 70), base = (180 - apex) / 2;
        return N({
          skill: 'Isosceles triangles', prompt: 'An isosceles triangle has a top angle of ' + deg(apex) + '. The two bottom angles are equal. How big is each bottom angle?', answer: base,
          traps: [T(180 - apex, 'That is both bottom angles together. Share it between the two equal angles.'), T(apex, 'That is the top angle. The question asks about a bottom angle.')],
          work: '180 − ' + apex + ' = ' + (180 - apex) + ', then ' + (180 - apex) + ' ÷ 2 = ' + base + '.', plain: 'Take the top angle away from 180. The rest is shared equally between the two bottom angles.',
          teach: [
            x('The three angles add up to 180°. The two bottom angles are equal.', deg(apex) + ' + ', ['?', 'bottom'], ' + ', ['?', 'bottom'], ' = 180°'),
            x('Take the top angle away from 180. 180 − ' + apex + ' = ' + (180 - apex) + '.', '180° − ' + deg(apex) + ' = ', [deg(180 - apex), 'both bottom angles']),
            x('Share it between the two equal angles. ' + (180 - apex) + ' ÷ 2 = ' + base + '.', deg(180 - apex) + ' ÷ 2 = ', [deg(base), 'each']),
            x('Check. ' + apex + ' + ' + base + ' + ' + base + ' = 180.', deg(apex) + ' + ' + deg(base) + ' + ' + deg(base) + ' = ', ['180°', 'it works'])
          ]
        });
      }
      var bs = R.int(25, 80), top = 180 - 2 * bs;
      return N({
        skill: 'Isosceles triangles', prompt: 'An isosceles triangle has two equal angles of ' + deg(bs) + ' each. What is the third angle?', answer: top,
        traps: [T(180 - bs, 'You took away only one of the equal angles. There are two of them.'), T(2 * bs, 'That is the two equal angles added together. Take that away from 180.')],
        work: bs + ' + ' + bs + ' = ' + (2 * bs) + ', then 180 − ' + (2 * bs) + ' = ' + top + '.', plain: 'Add the two equal angles. Then take that total away from 180.',
        teach: [
          x('The three angles add up to 180°. Two of them are ' + bs + '°.', deg(bs) + ' + ' + deg(bs) + ' + ? = 180°'),
          x('Add the two equal angles. ' + bs + ' + ' + bs + ' = ' + (2 * bs) + '.', deg(bs) + ' + ' + deg(bs) + ' = ', [deg(2 * bs), 'known']),
          x('Take that away from 180. 180 − ' + (2 * bs) + ' = ' + top + '.', '180° − ' + deg(2 * bs) + ' = ', [deg(top), 'third angle']),
          x('Check. ' + bs + ' + ' + bs + ' + ' + top + ' = 180.', deg(bs) + ' + ' + deg(bs) + ' + ' + deg(top) + ' = ', ['180°', 'it works'])
        ]
      });
    } },

    { id: 'pgram', level: 5, name: 'Angles in a parallelogram', make: function () {
      var a = 5 * R.int(8, 34);
      if (a === 90) a = 70;
      var opp = R.int(0, 1) === 1, ans = opp ? a : 180 - a;
      var prompt = opp ? 'A parallelogram has an angle of ' + deg(a) + '. What is the size of the angle directly opposite it?' : 'A parallelogram has an angle of ' + deg(a) + '. What is the size of the angle next to it on the same side?';
      return N({
        skill: 'Angles in a parallelogram', prompt: prompt, answer: ans,
        traps: opp ? [T(180 - a, 'That is the angle next to it. The angle directly opposite is the same size.'), T(360 - a, 'The four angles add to 360, but the opposite angle is simply equal to ' + a + '.')]
                   : [T(a, 'That is the opposite angle. The angle NEXT to it makes 180° with it.'), T(360 - a, 'That takes away only one angle from 360. Angles next to each other add to 180.')],
        work: opp ? 'Opposite angles in a parallelogram are equal, so it is ' + a + '°.' : 'Angles next to each other add to 180°. 180 − ' + a + ' = ' + ans + '.',
        plain: opp ? 'In a parallelogram the opposite angles are the same size.' : 'In a parallelogram, angles next to each other make a straight line, 180°.',
        teach: opp ? [
          lines('A parallelogram leans over. Its opposite corners are matching.', ['   ____________', '  /            /', ' /____________/'], 0),
          x('In a parallelogram, opposite angles are equal.', ['Opposite angles', 'equal']),
          x('The angle opposite ' + deg(a) + ' is also ' + deg(a) + '.', deg(a) + ' = ', [deg(a), 'answer']),
          x('Check. The other two angles are 180 − ' + a + ' = ' + (180 - a) + ' each. ' + a + ' + ' + a + ' + ' + (180 - a) + ' + ' + (180 - a) + ' = 360.', ['360°', 'it works'])
        ] : [
          lines('A parallelogram leans over. Two angles next to each other sit between parallel lines.', ['   ____________', '  /            /', ' /____________/'], 0),
          x('Angles next to each other in a parallelogram add up to 180°.', deg(a) + ' + ? = ', ['180°', 'straight line']),
          x('Take ' + a + ' away from 180. 180 − ' + a + ' = ' + ans + '.', '180° − ' + deg(a) + ' = ', [deg(ans), 'next angle']),
          x('Check. The opposite angles are equal, so the four angles are ' + a + ', ' + ans + ', ' + a + ' and ' + ans + '. They add to 360.', ['360°', 'it works'])
        ]
      });
    } },

    { id: 'barratio', level: 6, name: 'Angle bar models', make: function () {
      if (R.int(0, 1) === 0) {
        var k = R.pick([2, 3, 4, 5]), units = k + 1, u = 180 / units, big = R.int(0, 1) === 1, ans = big ? k * u : u;
        var bigSegs = [], i;
        for (i = 0; i < k; i++) bigSegs.push(['bg-emerald-400']);
        var allSegs = [['bg-indigo-400']].concat(bigSegs);
        return N({
          skill: 'Angle bar models', prompt: 'Two angles sit on a straight line. The bigger angle is ' + k + ' times as big as the smaller angle. How big is the ' + (big ? 'bigger' : 'smaller') + ' angle?', answer: ans,
          traps: [T(big ? u : k * u, 'That is the ' + (big ? 'smaller' : 'bigger') + ' angle. Read the question again to see which one is asked.'), T(180 / k, 'You shared 180 into ' + k + ' parts. There are ' + units + ' equal parts in total.')],
          work: '1 + ' + k + ' = ' + units + ' parts. 180 ÷ ' + units + ' = ' + u + '. Smaller ' + u + '°, bigger ' + (k * u) + '°.', plain: 'Draw the smaller angle as 1 box and the bigger angle as ' + k + ' boxes. Together they are ' + units + ' boxes and make 180°.',
          teach: [
            bars('The smaller angle is 1 box. The bigger angle is ' + k + ' boxes.', [mk('Smaller angle', [['bg-indigo-400']]), mk('Bigger angle', bigSegs)]),
            bars('Together they sit on a straight line. That is ' + units + ' boxes and 180°.', [mk('Straight line', allSegs, '180°')]),
            x('Find one box. 180 ÷ ' + units + ' = ' + u + '.', deg(180) + ' ÷ ' + units + ' = ', [deg(u), 'one box']),
            x('The smaller angle is 1 box, so it is ' + u + '°. The bigger angle is ' + k + ' × ' + u + ' = ' + (k * u) + '°.', [deg(u), 'smaller'], ' and ', [deg(k * u), 'bigger']),
            x('The ' + (big ? 'bigger' : 'smaller') + ' angle is ' + ans + '°.', [deg(ans), 'answer'])
          ]
        });
      }
      var opt = R.pick([[1, 2, 3], [2, 3, 4], [3, 4, 5], [1, 1, 2]]), tot = opt[0] + opt[1] + opt[2], one = 180 / tot, ask = R.int(0, 2);
      var nm = ['smallest', 'middle', 'biggest'], ansv = one * opt[ask === 2 ? 2 : ask];
      var pr = 'The angles in a triangle are in the ratio ' + opt[0] + ' to ' + opt[1] + ' to ' + opt[2] + '. How big is the ' + (opt[0] === opt[1] && ask < 2 ? 'smallest' : nm[ask]) + ' angle?';
      var trap1 = ask === 2 ? one * opt[0] : one * opt[2];
      return N({
        skill: 'Angle bar models', prompt: pr, answer: ansv,
        traps: [T(one, 'That is the size of just one box. The ' + nm[ask] + ' angle has ' + opt[ask] + (opt[ask] === 1 ? ' box' : ' boxes') + '.'), T(trap1, 'That is a different angle. Read the question again.'), T(180 / opt[ask], 'You shared 180 by the wrong number. Add all the parts first: ' + tot + ' parts.')],
        work: opt[0] + ' + ' + opt[1] + ' + ' + opt[2] + ' = ' + tot + ' parts. 180 ÷ ' + tot + ' = ' + one + '. The angles are ' + (opt[0] * one) + '°, ' + (opt[1] * one) + '° and ' + (opt[2] * one) + '°.', plain: 'The three angles make 180°. Add the ratio parts to find how many boxes there are, then find one box.',
        teach: [
          x('The three angles add up to 180°. Their sizes are in the ratio ' + opt[0] + ' to ' + opt[1] + ' to ' + opt[2] + '.', [opt.join(' : '), 'ratio']),
          bars('Draw ' + opt[0] + ' box for the first, ' + opt[1] + ' for the second, ' + opt[2] + ' for the third.', [mk('First angle', Array(opt[0]).fill(['bg-indigo-400'])), mk('Second angle', Array(opt[1]).fill(['bg-emerald-400'])), mk('Third angle', Array(opt[2]).fill(['bg-amber-300']))]),
          x('Add the boxes. ' + opt[0] + ' + ' + opt[1] + ' + ' + opt[2] + ' = ' + tot + ' boxes. They make 180°.', opt[0] + ' + ' + opt[1] + ' + ' + opt[2] + ' = ', [String(tot), 'boxes']),
          x('Find one box. 180 ÷ ' + tot + ' = ' + one + '.', deg(180) + ' ÷ ' + tot + ' = ', [deg(one), 'one box']),
          x('The angles are ' + opt[0] + ' × ' + one + ' = ' + (opt[0] * one) + ', ' + opt[1] + ' × ' + one + ' = ' + (opt[1] * one) + ' and ' + opt[2] + ' × ' + one + ' = ' + (opt[2] * one) + '.', [deg(opt[0] * one), 'first'], ' ', [deg(opt[1] * one), 'second'], ' ', [deg(opt[2] * one), 'third']),
          x('The ' + nm[ask] + ' angle is ' + ansv + '°.', [deg(ansv), 'answer'])
        ]
      });
    } }
  ]);
})();
