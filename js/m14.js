/* Module 14: Area and Perimeter. Lessons, vocabulary and question skills. */
(function () {
  'use strict';
  var B = window.Bank, R = B.R, S = B.s, Q = B.q, T = Q.trap;
  var x = S.x, note = S.note, grid = S.grid, lines = S.lines;

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
  var RECT = 'bg-indigo-400', GREEN = 'bg-emerald-400', AMBER = 'bg-amber-300', CUT = 'bg-rose-300';
  /* A rectangle drawn with text. Not to scale. */
  function rectArt(top, side) {
    var w = 14, padL = Math.max(0, Math.floor((w + 2 - top.length) / 2));
    return [new Array(padL + 2).join(' ') + top, ' ' + new Array(w + 1).join('_'), '|' + new Array(w + 1).join(' ') + '|',
            '|' + new Array(w + 1).join(' ') + '|  ' + side, '|' + new Array(w + 1).join('_') + '|'];
  }
  /* An L shape drawn with text: A on top, B along the bottom. Not to scale. */
  var LART = [' ________', '|        |', '|   A    |', '|________|_____', '|              |', '|      B       |', '|______________|'];
  function block(c0, c1, r0, r1, cls) { return { c0: c0, c1: c1, r0: r0, r1: r1, cls: cls }; }
  function pick2(u) { return u + '²'; }

  /* ---------- Vocabulary ---------- */
  window.MATH_VOCAB[14] = [
    { w: 'Perimeter', m: 'The distance all the way around the outside of a shape. Measured in cm or m.' },
    { w: 'Area', m: 'The amount of flat space inside a shape. It is counted in square units.' },
    { w: 'Square unit', m: 'A square with sides of one unit, like 1 cm by 1 cm. We count them to find area.' },
    { w: 'Length and width', m: 'The two side measurements of a rectangle. Length is usually the longer side.' },
    { w: 'Formula', m: 'A short rule written with words or letters. Area of a rectangle = length × width.' },
    { w: 'cm² and m²', m: 'Square centimetres and square metres. These are the units for area.' },
    { w: 'Combined shape', m: 'A shape made by joining rectangles, like an L shape. Split it into rectangles to find its area.' },
    { w: 'Missing side', m: 'A side length you are not given. You work it out from the area or perimeter.' }
  ];

  /* ---------- Lessons ---------- */
  window.MATH_LESSONS[14] = [
    { title: '1. What is perimeter?',
      explain: [
        'Imagine walking all the way around the edge of a playground. The distance you walk is the perimeter.',
        'Perimeter is the distance around the outside of a shape. To find it, add the lengths of all the sides.',
        'Perimeter is a length, so we use units like centimetres (cm) and metres (m).'
      ],
      rule: 'Perimeter is the distance around. Add all the sides.',
      mistake: 'Do not forget a side. A rectangle has four sides, so you add four numbers.',
      steps: [
        note('The perimeter is the distance all the way around the outside of a shape.', 'Perimeter', ['Like walking around the edge', 'Add up every side']),
        lines('Here is a rectangle. It is 6 cm long and 4 cm wide. The picture is not to scale.', rectArt('6 cm', '4 cm'), 99),
        x('A rectangle has 4 sides. Two are 6 cm and two are 4 cm. Walk around and add them.', '6 + 4 + 6 + 4'),
        x('Add one at a time. 6 + 4 = 10. Then 10 + 6 = 16. Then 16 + 4 = 20.', '6 + 4 + 6 + 4 = ', ['20', 'perimeter']),
        x('The perimeter is 20 cm. We say cm because it is a distance.', ['20 cm', 'perimeter']),
        note('Perimeter uses length units.', 'Units', ['cm for small things', 'm for big things like fields'])
      ] },

    { title: '2. Perimeter of rectangles and squares',
      explain: [
        'In a rectangle, opposite sides are the same length. So there are two lengths and two widths.',
        'Add the length and the width, then double it. That is perimeter = 2 × (length + width).',
        'A square has four equal sides. So its perimeter is 4 × side.'
      ],
      rule: 'Rectangle: 2 × (length + width). Square: 4 × side.',
      mistake: 'Do not add just length and width. That is only half of the way around.',
      steps: [
        lines('A rectangle is 9 m long and 5 m wide.', rectArt('9 m', '5 m'), 99),
        x('Two lengths and two widths. Add length and width first.', '9 + 5 = ', ['14', 'half way around']),
        x('That is only half the way around. Double it.', '2 × 14 = ', ['28', 'perimeter']),
        x('Check by adding every side. 9 + 5 + 9 + 5 = 28. The same.', '9 + 5 + 9 + 5 = ', ['28', 'matches']),
        x('Now a square with sides of 7 cm. All four sides are the same.', '7 + 7 + 7 + 7 = ', ['28', 'perimeter']),
        x('A shortcut for a square. 4 × 7 = 28. The perimeter is 28 cm.', '4 × 7 = ', ['28 cm', 'perimeter'])
      ] },

    { title: '3. What is area?',
      explain: [
        'Area is the amount of flat space inside a shape. Think of covering a floor with tiles. The number of tiles is the area.',
        'We count square units. A square unit is a square that is 1 unit long and 1 unit wide.',
        'When squares fill a rectangle in rows, count one row and then count how many rows.'
      ],
      rule: 'Area is how many square units fit inside a shape.',
      mistake: 'Area is not the distance around. It is the space inside.',
      steps: [
        grid('Here is a rectangle made of empty squares. It is 6 squares across and 4 squares down.', 6, 4, []),
        grid('Color one row. There are 6 squares in a row.', 6, 4, [block(0, 6, 0, 1, GREEN)]),
        grid('Two rows. That is 6 + 6 = 12 squares.', 6, 4, [block(0, 6, 0, 2, GREEN)]),
        grid('Three rows. That is 18 squares.', 6, 4, [block(0, 6, 0, 3, GREEN)]),
        grid('Four rows fill the whole rectangle. That is 24 squares.', 6, 4, [block(0, 6, 0, 4, GREEN)]),
        x('4 rows of 6 squares. The area is 24 square units.', '4 × 6 = ', ['24', 'square units'])
      ] },

    { title: '4. Area of rectangles and squares',
      explain: [
        'You do not need to count every square. Multiply the number of squares in a row by the number of rows.',
        'For a rectangle, that means area = length × width. For a square, area = side × side.',
        'The order does not matter. 9 × 5 and 5 × 9 are both 45.'
      ],
      rule: 'Rectangle: length × width. Square: side × side.',
      mistake: 'Do not add. 9 + 5 = 14 is not the area. Area needs multiplying.',
      steps: [
        grid('A rectangle is 9 cm long and 5 cm wide. Each square is 1 cm by 1 cm.', 9, 5, []),
        grid('There are 5 rows of 9 squares. All the squares are colored.', 9, 5, [block(0, 9, 0, 5, RECT)]),
        x('Multiply length by width. 9 × 5 = 45.', '9 × 5 = ', ['45', 'square cm']),
        x('The area is 45 square centimetres, or 45 cm².', ['45 cm²', 'area']),
        grid('Now a square with sides of 6 cm. It has 6 rows of 6 squares.', 6, 6, [block(0, 6, 0, 6, GREEN)]),
        x('Side times side. 6 × 6 = 36. The area is 36 cm².', '6 × 6 = ', ['36 cm²', 'area'])
      ] },

    { title: '5. Units for area and perimeter',
      explain: [
        'Perimeter is a length, so we write cm or m. Area counts squares, so we write cm² or m². The small 2 means square.',
        'A square centimetre is a square that is 1 cm on each side. A square metre is a square that is 1 m on each side.',
        'Use cm for small shapes like a book. Use m for big places like a room or a field.'
      ],
      rule: 'Perimeter: cm or m. Area: cm² or m².',
      mistake: 'Do not write 24 cm for an area. Say 24 cm² because the answer counts squares.',
      steps: [
        lines('One square centimetre is a square 1 cm long and 1 cm wide. Its area is 1 cm².', ['  1 cm', ' ______', '|      |  1 cm', '|______|'], 99),
        lines('Take the rectangle from before. It is 6 cm by 4 cm.', rectArt('6 cm', '4 cm'), 99),
        x('The perimeter is a distance. 2 × (6 + 4) = 20. We write cm.', '2 × (6 + 4) = ', ['20 cm', 'length unit']),
        x('The area counts squares. 6 × 4 = 24. We write cm².', '6 × 4 = ', ['24 cm²', 'square unit']),
        note('Match the unit to the measurement.', 'Which unit?', ['Perimeter: cm or m', 'Area: cm² or m²', 'Big places: m and m²'])
      ] },

    { title: '6. Finding a missing side',
      explain: [
        'Sometimes you know the area or the perimeter, and one side is missing. Work backwards.',
        'For area, length × width = area. So divide the area by the side you know.',
        'For perimeter, half of the perimeter is length + width. Take away the side you know. For a square, divide the perimeter by 4.'
      ],
      rule: 'Area missing side: divide. Perimeter missing side: halve, then subtract. Square: divide by 4.',
      mistake: 'Do not subtract from the whole perimeter. There are two lengths and two widths, so halve first.',
      steps: [
        x('A rectangle has an area of 40 cm² and a length of 8 cm. What is the width?', ['8', 'length'], ' × ', ['?', 'width'], ' = 40'),
        grid('Picture 8 squares in each row. We need enough rows to make 40 squares.', 8, 5, [block(0, 8, 0, 5, RECT)]),
        x('Undo the times by dividing. 40 ÷ 8 = 5. The width is 5 cm.', '40 ÷ 8 = ', ['5', 'width']),
        x('Now perimeter. A rectangle has a perimeter of 30 cm and a length of 9 cm. Half of the perimeter is length plus width.', '30 ÷ 2 = ', ['15', 'length + width']),
        x('Take away the length. 15 − 9 = 6. The width is 6 cm.', '15 − 9 = ', ['6', 'width']),
        x('Check. 2 × (9 + 6) = 30. It works.', '2 × (9 + 6) = ', ['30', 'matches']),
        x('For a square with perimeter 28 cm, all four sides are equal. Divide by 4.', '28 ÷ 4 = ', ['7', 'each side'])
      ] },

    { title: '7. Same perimeter, different area',
      explain: [
        'Two rectangles can have the same perimeter and different areas. The perimeter is the distance around, but the area is the space inside.',
        'Look at three rectangles that all have a perimeter of 20 cm. They are 8 by 2, 6 by 4 and 5 by 5.',
        'The closer a rectangle is to a square, the more area it has.'
      ],
      rule: 'Same perimeter does not mean same area. Work out each one.',
      mistake: 'Do not assume two shapes are the same size because their perimeters match.',
      steps: [
        lines('Three rectangles all with a perimeter of 20 cm.', ['Shape   Perimeter', '8 by 2  2 × 10 = 20', '6 by 4  2 × 10 = 20', '5 by 5  2 × 10 = 20'], 99),
        grid('The 8 by 2 rectangle has 2 rows of 8. Area 16 cm².', 8, 2, [block(0, 8, 0, 2, RECT)]),
        grid('The 6 by 4 rectangle has 4 rows of 6. Area 24 cm².', 6, 4, [block(0, 6, 0, 4, GREEN)]),
        grid('The 5 by 5 square has 5 rows of 5. Area 25 cm².', 5, 5, [block(0, 5, 0, 5, AMBER)]),
        lines('The perimeters are the same, but the areas are different.', ['Shape   Perimeter   Area', '8 by 2  20 cm      16 cm²', '6 by 4  20 cm      24 cm²', '5 by 5  20 cm      25 cm²'], 99),
        note('A square holds the most area for a given perimeter.', 'Remember', ['Same perimeter can give different areas', 'The squarest shape has the most area'])
      ] },

    { title: '8. L shapes: area by splitting',
      explain: [
        'An L shape is not a rectangle, but you can cut it into two rectangles. Find the area of each one and add them.',
        'There is often more than one way to cut. Any cut that makes two rectangles works.',
        'Write the area of each piece, then add them together.'
      ],
      rule: 'Split the shape into rectangles. Find each area. Add them.',
      mistake: 'Do not count a piece twice. The two rectangles must not overlap.',
      steps: [
        grid('Here is an L shape on a grid of squares. It is 6 squares wide and 5 squares tall.', 6, 5, [block(0, 2, 0, 5, RECT), block(2, 6, 3, 5, RECT)]),
        grid('Cut it into two rectangles. Piece A is blue. Piece B is green.', 6, 5, [block(0, 2, 0, 5, RECT), block(2, 6, 3, 5, GREEN)]),
        x('Piece A is 2 wide and 5 tall. 2 × 5 = 10.', 'A: 2 × 5 = ', ['10', 'square units']),
        x('Piece B is 4 wide and 2 tall. 4 × 2 = 8.', 'B: 4 × 2 = ', ['8', 'square units']),
        x('Add the two areas. 10 + 8 = 18.', '10 + 8 = ', ['18', 'square units']),
        grid('Check by counting the colored squares. There are 18.', 6, 5, [block(0, 2, 0, 5, RECT), block(2, 6, 3, 5, GREEN)]),
        x('The area of the L shape is 18 square units.', ['18', 'area'])
      ] },

    { title: '9. L shapes: perimeter',
      explain: [
        'To find the perimeter of an L shape, add the lengths of every side around the outside.',
        'Do not add any lines inside the shape. Only the edge counts.',
        'Here is a shortcut. If the L is a big rectangle with a corner missing, its perimeter is the same as the big rectangle around it.'
      ],
      rule: 'Add every outside side. Do not count lines inside.',
      mistake: 'Do not miss a side. An L shape has six sides.',
      steps: [
        grid('The same L shape. It sits inside a rectangle that is 6 wide and 5 tall.', 6, 5, [block(0, 2, 0, 5, RECT), block(2, 6, 3, 5, RECT)]),
        lines('Walk around the outside and write each side. Start at the top left corner.', ['Top: 2', 'Down: 3', 'Right: 4', 'Down: 2', 'Bottom: 6', 'Up: 5'], 99),
        x('Add all six sides. 2 + 3 + 4 + 2 + 6 + 5 = 22.', '2 + 3 + 4 + 2 + 6 + 5 = ', ['22', 'perimeter']),
        x('Now the shortcut. The big rectangle around it is 6 by 5. 2 × (6 + 5) = 22.', '2 × (6 + 5) = ', ['22', 'same answer']),
        note('When one corner is cut out, the walk around the edge is the same length as the big rectangle.', 'Shortcut', ['Works when the missing piece is in a corner', 'Add sides to be sure'])
      ] },

    { title: '10. A big rectangle with a piece cut out',
      explain: [
        'Another way to find the area of a combined shape is to start with a big rectangle. Then take away the piece that is missing.',
        'Find the area of the whole rectangle. Find the area of the missing piece. Subtract.',
        'This is often quicker than splitting into two pieces.'
      ],
      rule: 'Big rectangle area minus the missing piece area.',
      mistake: 'Do not add the missing piece. It is not part of the shape, so take it away.',
      steps: [
        grid('A rectangle is 7 wide and 5 tall. A corner piece that is 3 wide and 2 tall is cut out. The pink squares are cut out.', 7, 5, [block(0, 7, 0, 5, RECT), block(4, 7, 0, 2, CUT)]),
        x('First find the whole rectangle as if nothing was cut. 7 × 5 = 35.', '7 × 5 = ', ['35', 'whole rectangle']),
        x('Now find the piece that was cut out. 3 × 2 = 6.', '3 × 2 = ', ['6', 'cut out']),
        x('Take the cut piece away. 35 − 6 = 29.', '35 − 6 = ', ['29', 'area']),
        x('The area of the shape is 29 square units. The perimeter is still 2 × (7 + 5) = 24 because the cut is in a corner.', ['29', 'area'], ',  ', ['24', 'perimeter'])
      ] },

    { title: '11. Word problems: fence or tiles?',
      explain: [
        'Ask yourself one question. Am I going around the edge, or am I covering the inside?',
        'Fences, borders, ribbons and walking around all use perimeter. Tiles, paint, carpet and grass all use area.',
        'Write the measurement you need. Then work it out and add the right unit.'
      ],
      rule: 'Around the edge means perimeter. Covering the inside means area.',
      mistake: 'Do not mix them up. A fence uses perimeter, not area.',
      steps: [
        note('Look for clue words.', 'Clue words', ['Around, fence, border, edge: perimeter', 'Cover, tile, paint, carpet, grass: area']),
        x('Rinka wants to fence a garden that is 12 m long and 8 m wide. A fence goes around the edge. That is perimeter.', ['perimeter', 'around the edge']),
        x('Add length and width, then double it. 12 + 8 = 20 and 2 × 20 = 40.', '2 × (12 + 8) = ', ['40 m', 'fence needed']),
        x('Now tiles. A floor is 6 m long and 5 m wide. Each tile covers 1 m². Tiles cover the inside. That is area.', ['area', 'cover the inside']),
        x('Multiply length by width. 6 × 5 = 30.', '6 × 5 = ', ['30 m²', 'tiles needed']),
        x('Each tile covers 1 m², so we need 30 tiles.', ['30', 'tiles'])
      ] }
  ];

  /* ---------- Skills ---------- */
  var THINGS = ['photo', 'poster', 'garden bed', 'playground', 'picture frame', 'sandbox'];

  B.register(14, [
    { id: 'perimrect', level: 1, name: 'Perimeter of a rectangle', make: function () {
      var u = R.pick(['cm', 'm']), l = R.int(6, 25), w = R.int(3, l - 1), ans = 2 * (l + w);
      var prompt = R.pick([
        'What is the perimeter of a rectangle that is ' + l + ' ' + u + ' long and ' + w + ' ' + u + ' wide?',
        'A ' + R.pick(THINGS) + ' is a rectangle ' + l + ' ' + u + ' long and ' + w + ' ' + u + ' wide. What is its perimeter in ' + u + '?',
        'Rinka walks once around the edge of a rectangle that is ' + l + ' ' + u + ' by ' + w + ' ' + u + '. How far does she walk in ' + u + '?'
      ]);
      return N({
        skill: 'Perimeter of a rectangle', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(l + w), 'That is only half of the way around. A rectangle has two lengths and two widths.'),
                T(String(l * w), 'That is the area, the space inside. Perimeter is the distance around.'),
                T(String(2 * l + w), 'You missed one width. There are two lengths and two widths.')],
        work: l + ' + ' + w + ' + ' + l + ' + ' + w + ' = ' + ans + ' ' + u + '. Or 2 × (' + l + ' + ' + w + ') = ' + ans + '.',
        plain: 'Add all four sides. Two are ' + l + ' and two are ' + w + '.',
        teach: [
          lines('Here is the rectangle. It is ' + l + ' ' + u + ' long and ' + w + ' ' + u + ' wide.', rectArt(l + ' ' + u, w + ' ' + u), 99),
          x('There are four sides. Two lengths and two widths.', l + ' + ' + w + ' + ' + l + ' + ' + w),
          x('Add the length and the width first. ' + l + ' + ' + w + ' = ' + (l + w) + '. That is half the way around.', l + ' + ' + w + ' = ', [String(l + w), 'half way']),
          x('Double it. 2 × ' + (l + w) + ' = ' + ans + '.', '2 × ' + (l + w) + ' = ', [String(ans) + ' ' + u, 'perimeter'])
        ]
      });
    } },

    { id: 'arearect', level: 1, name: 'Area of a rectangle', make: function () {
      var u = R.pick(['cm', 'm']), l = R.int(3, 10), w = R.int(2, 8), ans = l * w;
      if (l === w) l++;
      ans = l * w;
      var prompt = R.pick([
        'What is the area of a rectangle that is ' + l + ' ' + u + ' long and ' + w + ' ' + u + ' wide? Answer in square ' + (u === 'cm' ? 'centimetres' : 'metres') + '.',
        'A ' + R.pick(THINGS) + ' is ' + l + ' ' + u + ' long and ' + w + ' ' + u + ' wide. How many square ' + (u === 'cm' ? 'centimetres' : 'metres') + ' is its area?',
        'A rectangle has sides of ' + l + ' ' + u + ' and ' + w + ' ' + u + '. Find its area in ' + pick2(u) + '.'
      ]);
      return N({
        skill: 'Area of a rectangle', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(2 * (l + w)), 'That is the perimeter, the distance around. Area is the space inside, so multiply.'),
                T(String(l + w), 'You added. Area needs the length times the width.')],
        work: l + ' × ' + w + ' = ' + ans + ' ' + pick2(u) + '.',
        plain: 'There are ' + w + ' rows with ' + l + ' squares in each row. Multiply.',
        teach: [
          grid('Picture the rectangle as squares. It is ' + l + ' squares across and ' + w + ' squares down.', l, w, []),
          grid('Color one row. It has ' + l + ' squares.', l, w, [block(0, l, 0, 1, GREEN)]),
          grid('Fill all ' + w + ' rows.', l, w, [block(0, l, 0, w, GREEN)]),
          x(w + ' rows of ' + l + ' squares. Multiply length by width.', l + ' × ' + w + ' = ', [String(ans) + ' ' + pick2(u), 'area'])
        ]
      });
    } },

    { id: 'square', level: 2, name: 'Square perimeter and area', make: function () {
      var u = R.pick(['cm', 'm']), s = R.int(3, 15), askArea = R.int(0, 1) === 1;
      if (askArea) {
        return N({
          skill: 'Square area', prompt: R.pick(['What is the area of a square with sides of ' + s + ' ' + u + '? Answer in ' + pick2(u) + '.', 'A square patio has sides of ' + s + ' ' + u + '. How many square ' + (u === 'cm' ? 'centimetres' : 'metres') + ' is its area?']),
          answer: s * s, keyboard: 'numeric', placeholder: 'Type a number',
          traps: [T(String(4 * s), 'That is the perimeter. Area is side times side.'), T(String(2 * s), 'You doubled the side. Multiply the side by itself instead.')],
          work: s + ' × ' + s + ' = ' + (s * s) + ' ' + pick2(u) + '.', plain: 'A square has ' + s + ' rows of ' + s + ' squares.',
          teach: [
            x('A square has four equal sides. Each side is ' + s + ' ' + u + '.', ['side = ' + s + ' ' + u, 'all four sides']),
            x('Area is the number of squares inside. The square has ' + s + ' rows of ' + s + '.', s + ' rows × ' + s + ' squares'),
            x('Multiply the side by itself. ' + s + ' × ' + s + ' = ' + (s * s) + '.', s + ' × ' + s + ' = ', [String(s * s) + ' ' + pick2(u), 'area']),
            x('The area is ' + (s * s) + ' ' + pick2(u) + '. Squares counted, so the unit has a small 2.', [String(s * s) + ' ' + pick2(u), 'area'])
          ]
        });
      }
      return N({
        skill: 'Square perimeter', prompt: R.pick(['What is the perimeter of a square with sides of ' + s + ' ' + u + '?', 'A square garden has sides of ' + s + ' ' + u + '. What is the perimeter in ' + u + '?']),
        answer: 4 * s, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(s * s), 'That is the area. Perimeter is the distance around, so add the four sides.'), T(String(2 * s), 'That is only two sides. A square has four.')],
        work: '4 × ' + s + ' = ' + (4 * s) + ' ' + u + '.', plain: 'All four sides are ' + s + '. Multiply ' + s + ' by 4.',
        teach: [
          x('A square has four equal sides. Each side is ' + s + ' ' + u + '.', ['side = ' + s + ' ' + u, 'all four sides']),
          x('Add all four sides.', s + ' + ' + s + ' + ' + s + ' + ' + s + ' = ', [String(4 * s), 'perimeter']),
          x('A shortcut. Four equal sides means 4 × ' + s + '.', '4 × ' + s + ' = ', [String(4 * s) + ' ' + u, 'perimeter'])
        ].concat([x('The perimeter is a distance, so the unit is ' + u + '.', [String(4 * s) + ' ' + u, 'perimeter'])])
      });
    } },

    { id: 'whichmeasure', level: 2, name: 'Perimeter or area', make: function () {
      var per = [
        'Rinka wants to put a fence around her garden.', 'A baker wants to put ribbon around the edge of a cake box lid.',
        'Sam is going to walk once around the edge of a soccer field.', 'A carpenter wants to put a wooden frame around a picture.',
        'Mia wants to put lights around the edge of a window.'
      ];
      var area = [
        'Rinka wants to cover her bedroom floor with tiles.', 'A painter wants to paint a whole wall.',
        'Sam wants to put grass seed on his whole lawn.', 'A baker wants to cover the top of a tray with paper.',
        'Mia wants to cover a table top with sticky paper.'
      ];
      var isPer = R.int(0, 1) === 1, ctx = R.pick(isPer ? per : area);
      var opts = [
        { text: 'Perimeter', ok: isPer, trap: 'Perimeter is the distance around the edge. This job covers the inside, so it needs area.' },
        { text: 'Area', ok: !isPer, trap: 'Area is the space inside. This job goes around the edge, so it needs perimeter.' },
        { text: 'Neither, only the height matters', ok: false, trap: 'A flat shape has no height here. We need the distance around or the space inside.' }
      ];
      return Q.choice({
        skill: 'Perimeter or area', prompt: ctx + ' Which measurement should be found?', options: opts,
        work: isPer ? 'Going around the edge is perimeter.' : 'Covering the inside is area.', plain: isPer ? 'The job goes around the outside, so it is perimeter.' : 'The job covers the inside, so it is area.',
        teach: [
          note('Ask one question. Are we going around the edge or covering the inside?', 'Clue', ['Around the edge: perimeter', 'Covering the inside: area']),
          x(ctx, [isPer ? 'around the edge' : 'covering the inside', isPer ? 'perimeter' : 'area']),
          x(isPer ? 'This job goes around the outside edge. That is perimeter.' : 'This job covers the whole flat space. That is area.', [isPer ? 'Perimeter' : 'Area', 'the answer']),
          note(isPer ? 'Perimeter is measured in cm or m.' : 'Area is measured in cm² or m².', 'Unit', [isPer ? 'Length units' : 'Square units'])
        ]
      });
    } },

    { id: 'unitchoice', level: 2, name: 'Choose the right unit', make: function () {
      var cases = [
        { p: 'What unit is best for the area of a classroom floor?', a: 'sq', big: true },
        { p: 'What unit is best for the area of a postage stamp?', a: 'sq', big: false },
        { p: 'What unit is best for the perimeter of a soccer field?', a: 'len', big: true },
        { p: 'What unit is best for the perimeter of a phone screen?', a: 'len', big: false },
        { p: 'What unit is best for the area of a school field?', a: 'sq', big: true },
        { p: 'What unit is best for the perimeter of a book cover?', a: 'len', big: false },
        { p: 'What unit is best for the area of a small sticker?', a: 'sq', big: false },
        { p: 'What unit is best for the perimeter of a hockey rink?', a: 'len', big: true }
      ];
      var c = R.pick(cases), right = c.a === 'sq' ? (c.big ? 'square metres (m²)' : 'square centimetres (cm²)') : (c.big ? 'metres (m)' : 'centimetres (cm)');
      var all = [
        { t: 'centimetres (cm)', a: 'len', big: false }, { t: 'metres (m)', a: 'len', big: true },
        { t: 'square centimetres (cm²)', a: 'sq', big: false }, { t: 'square metres (m²)', a: 'sq', big: true }
      ];
      var opts = all.map(function (o) {
        var ok = o.t === right, msg;
        if (o.a !== c.a) msg = c.a === 'sq' ? 'Area counts squares, so the unit needs a small 2.' : 'Perimeter is a distance, so it uses a plain length unit with no small 2.';
        else msg = c.big ? 'That unit is too small for something so big.' : 'That unit is too big for something so small.';
        return { text: o.t, ok: ok, trap: msg };
      });
      return Q.choice({
        skill: 'Choose the right unit', prompt: c.p, options: opts,
        work: 'The answer is ' + right + '.', plain: (c.a === 'sq' ? 'Area uses square units. ' : 'Perimeter uses length units. ') + (c.big ? 'Big things use metres.' : 'Small things use centimetres.'),
        teach: [
          x(c.p, [c.a === 'sq' ? 'area' : 'perimeter', 'what we measure']),
          x(c.a === 'sq' ? 'Area counts squares, so the unit is a square unit, like cm² or m².' : 'Perimeter is a distance, so the unit is a length, like cm or m.', [c.a === 'sq' ? 'square unit' : 'length unit', 'kind of unit']),
          x(c.big ? 'This is a big thing, so we use metres.' : 'This is a small thing, so we use centimetres.', [c.big ? 'metres' : 'centimetres', 'size']),
          note('Put the two ideas together.', 'The unit', [right])
        ]
      });
    } },

    { id: 'missingarea', level: 3, name: 'Missing side from area', make: function () {
      var u = R.pick(['cm', 'm']), l = R.int(4, 12), w = R.int(2, 10), A = l * w;
      if (l === w) l++;
      A = l * w;
      var prompt = R.pick([
        'A rectangle has an area of ' + A + ' ' + pick2(u) + ' and a length of ' + l + ' ' + u + '. What is its width in ' + u + '?',
        'A rectangular garden has an area of ' + A + ' ' + pick2(u) + '. It is ' + l + ' ' + u + ' long. How wide is it in ' + u + '?',
        'The area of a rectangle is ' + A + ' ' + pick2(u) + '. One side is ' + l + ' ' + u + '. How long is the other side in ' + u + '?'
      ]);
      return N({
        skill: 'Missing side from area', prompt: prompt, answer: w, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(A - l), 'You subtracted. Area is length times width, so undo it by dividing.'), T(String(A * l), 'You multiplied. To find a missing side from the area, divide.'),
                T(String(A / 2), 'That halves the area. Divide by the side you know, ' + l + ', instead.')],
        work: l + ' × ' + w + ' = ' + A + ', so ' + A + ' ÷ ' + l + ' = ' + w + ' ' + u + '.', plain: 'Area is length times width. Divide the area by the side you know.',
        teach: [
          x('Area is length times width. We know the area and one side.', [String(l), 'length'], ' × ', ['?', 'width'], ' = ' + A),
          grid('Picture rows of ' + l + ' squares. We keep adding rows until we have ' + A + ' squares.', Math.min(l, 12), Math.min(w, 10), [block(0, Math.min(l, 12), 0, Math.min(w, 10), RECT)]),
          x('Undo the times by dividing. ' + A + ' ÷ ' + l + ' = ' + w + '.', A + ' ÷ ' + l + ' = ', [String(w), 'width']),
          x('Check. ' + l + ' × ' + w + ' = ' + A + '. It works.', l + ' × ' + w + ' = ', [String(A), 'matches'])
        ]
      });
    } },

    { id: 'missingperim', level: 3, name: 'Missing side from perimeter', make: function () {
      var u = R.pick(['cm', 'm']);
      if (R.int(0, 2) === 0) {
        var s = R.int(3, 15), P = 4 * s;
        return N({
          skill: 'Missing side from perimeter', prompt: R.pick(['A square has a perimeter of ' + P + ' ' + u + '. How long is one side in ' + u + '?', 'The perimeter of a square is ' + P + ' ' + u + '. What is the length of each side?']),
          answer: s, keyboard: 'numeric', placeholder: 'Type a number',
          traps: [T(String(P / 2), 'A square has four equal sides, so divide by 4, not 2.'), T(String(P - 4), 'You subtracted. Divide the perimeter by 4 instead.')],
          work: P + ' ÷ 4 = ' + s + ' ' + u + '.', plain: 'All four sides are equal. Share the perimeter into four equal parts.',
          teach: [
            lines('A square has four equal sides. Each one is the mystery length. The picture is not to scale.', rectArt('? ' + u, '? ' + u), 99),
            x('A square has four equal sides. The perimeter is ' + P + ' ' + u + '.', ['4 × side = ' + P, 'the idea']),
            x('Share the perimeter into 4 equal sides. ' + P + ' ÷ 4 = ' + s + '.', P + ' ÷ 4 = ', [String(s), 'each side']),
            x('Check. 4 × ' + s + ' = ' + P + '. It works.', '4 × ' + s + ' = ', [String(P), 'matches'])
          ]
        });
      }
      var l = R.int(5, 18), w = R.int(2, l - 1), P2 = 2 * (l + w);
      return N({
        skill: 'Missing side from perimeter', prompt: R.pick(['A rectangle has a perimeter of ' + P2 + ' ' + u + ' and a length of ' + l + ' ' + u + '. What is its width in ' + u + '?', 'A rectangular ' + R.pick(THINGS) + ' has a perimeter of ' + P2 + ' ' + u + '. It is ' + l + ' ' + u + ' long. How wide is it in ' + u + '?']),
        answer: w, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(P2 - l), 'You took the length from the whole perimeter. Halve the perimeter first, because there are two lengths and two widths.'),
                T(String(P2 / 2), 'That is length plus width. Now take away the length to find the width.')],
        work: P2 + ' ÷ 2 = ' + (l + w) + ', then ' + (l + w) + ' − ' + l + ' = ' + w + ' ' + u + '.', plain: 'Half of the perimeter is one length plus one width. Take away the length you know.',
        teach: [
          lines('The rectangle has a length of ' + l + ' ' + u + ' and a mystery width. The picture is not to scale.', rectArt(l + ' ' + u, '? ' + u), 99),
          x('A rectangle has two lengths and two widths. So half of the perimeter is one length plus one width.', P2 + ' ÷ 2 = ', [String(l + w), 'length + width']),
          x('We know the length is ' + l + '. Take it away.', (l + w) + ' − ' + l + ' = ', [String(w), 'width']),
          x('Check. 2 × (' + l + ' + ' + w + ') = ' + P2 + '. It works.', '2 × (' + l + ' + ' + w + ') = ', [String(P2), 'matches'])
        ]
      });
    } },

    { id: 'fence', level: 3, name: 'Fence around a garden', make: function () {
      var l = R.int(8, 30), w = R.int(4, l - 1), three = R.int(0, 3) === 0;
      var name = R.pick(['Rinka', 'Sam', 'Mia', 'Priya']);
      if (three) {
        var ans3 = l + 2 * w;
        return N({
          skill: 'Fence around a garden', prompt: name + ' builds a rectangular garden ' + l + ' m long and ' + w + ' m wide. One long side is against the garage wall, so it needs no fence. How many metres of fence are needed for the other three sides?',
          answer: ans3, keyboard: 'numeric', placeholder: 'Type a number',
          traps: [T(String(2 * (l + w)), 'That fences all four sides. One long side needs no fence, so take it off.'), T(String(2 * l + w), 'You kept both long sides. The side with the wall is a long side, so only one length needs fence.')],
          work: l + ' + ' + w + ' + ' + w + ' = ' + ans3 + ' m.', plain: 'Fence one length and both widths.',
          teach: [
            lines('The garden is ' + l + ' m long and ' + w + ' m wide. The top side is the wall.', ['   wall, no fence', ' ______________', '|              |', '|              |  ' + w + ' m', '|______________|', '     ' + l + ' m'], 99),
            x('Fence one length and two widths.', String(l) + ' + ' + w + ' + ' + w),
            x('Add them. ' + l + ' + ' + w + ' = ' + (l + w) + '. Then ' + (l + w) + ' + ' + w + ' = ' + ans3 + '.', l + ' + ' + w + ' + ' + w + ' = ', [String(ans3) + ' m', 'fence']),
            x('Check. All four sides would need ' + (2 * (l + w)) + ' m. We save the ' + l + ' m along the wall. ' + (2 * (l + w)) + ' − ' + l + ' = ' + ans3 + '.', (2 * (l + w)) + ' − ' + l + ' = ', [String(ans3) + ' m', 'matches'])
          ]
        });
      }
      var ans = 2 * (l + w), what = R.pick([['fence', 'fence'], ['fence', 'fence'], ['ribbon', 'ribbon'], ['string lights', 'string lights']]);
      return N({
        skill: 'Fence around a garden', prompt: name + ' has a rectangular garden ' + l + ' m long and ' + w + ' m wide. ' + name + ' wants to put ' + (what[0] === 'fence' ? 'a fence' : what[0]) + ' all the way around the edge. How many metres of ' + what[1] + ' are needed?',
        answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(l * w), 'That is the area. A ' + what[1] + ' goes around the edge, so we need the perimeter.'), T(String(l + w), 'That is only half of the way around. There are four sides.')],
        work: '2 × (' + l + ' + ' + w + ') = ' + ans + ' m.', plain: 'Going around the edge is perimeter. Add all four sides.',
        teach: [
          x('Going around the edge means perimeter.', [what[1], 'goes around the edge']),
          x('Add the length and the width. ' + l + ' + ' + w + ' = ' + (l + w) + '.', l + ' + ' + w + ' = ', [String(l + w), 'half way']),
          x('Double it for all four sides. 2 × ' + (l + w) + ' = ' + ans + '.', '2 × ' + (l + w) + ' = ', [String(ans) + ' m', what[1] + ' needed'])
        ].concat([x('The garden needs ' + ans + ' metres of ' + what[1] + '.', [String(ans) + ' m', 'answer'])])
      });
    } },

    { id: 'tile', level: 3, name: 'Tiles to cover a floor', make: function () {
      var l = R.int(4, 12), w = R.int(3, 10);
      if (l === w) l++;
      var ans = l * w, c = R.pick([
        { p: 'A floor is ' + l + ' m long and ' + w + ' m wide. Each tile covers 1 square metre. How many tiles are needed to cover the floor?', u: 'tiles' },
        { p: 'A rectangular lawn is ' + l + ' m by ' + w + ' m. Grass squares each cover 1 square metre. How many grass squares cover the lawn?', u: 'grass squares' },
        { p: 'A poster is ' + l + ' cm by ' + w + ' cm. It is covered with stickers that are each 1 square centimetre. How many stickers are needed?', u: 'stickers' },
        { p: 'A craft board is ' + l + ' cm long and ' + w + ' cm wide. Each paper square covers 1 square centimetre. How many paper squares cover the board?', u: 'paper squares' }
      ]);
      return N({
        skill: 'Tiles to cover a floor', prompt: c.p, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(2 * (l + w)), 'That is the perimeter. Covering the inside needs the area.'), T(String(l + w), 'You added. Multiply the length by the width to count all the squares.')],
        work: l + ' × ' + w + ' = ' + ans + ' ' + c.u + '.', plain: 'Each ' + c.u.replace(/s$/, '') + ' covers one square unit. Count the squares with length times width.',
        teach: [
          x('Covering the inside means area.', ['covering', 'area']),
          grid('Picture the tiles. There are ' + w + ' rows with ' + l + ' in each row.', Math.min(l, 12), Math.min(w, 10), [block(0, Math.min(l, 12), 0, Math.min(w, 10), AMBER)]),
          x('Multiply length by width. ' + l + ' × ' + w + ' = ' + ans + '.', l + ' × ' + w + ' = ', [String(ans), c.u]),
          x('Each one covers 1 square unit, so we need ' + ans + ' ' + c.u + '.', [String(ans) + ' ' + c.u, 'answer'])
        ]
      });
    } },

    { id: 'lsplit', level: 4, name: 'L shape area by splitting', make: function () {
      var a = R.int(4, 10), b = R.int(2, 6), c = R.int(3, 8), d = R.int(2, 5), u = R.pick(['cm', 'm']);
      var A1 = a * b, A2 = c * d, ans = A1 + A2;
      var prompt = R.pick([
        'An L shape is made from two rectangles that do not overlap. Rectangle A is ' + a + ' ' + u + ' by ' + b + ' ' + u + '. Rectangle B is ' + c + ' ' + u + ' by ' + d + ' ' + u + '. What is the area of the L shape in ' + pick2(u) + '?',
        'An L shaped ' + (u === 'm' ? 'room' : 'card') + ' is split into two rectangles. One is ' + a + ' ' + u + ' by ' + b + ' ' + u + ' and the other is ' + c + ' ' + u + ' by ' + d + ' ' + u + '. Find the total area in ' + pick2(u) + '.'
      ]);
      return N({
        skill: 'L shape area by splitting', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(A1), 'That is only the first rectangle. Add the area of the second rectangle too.'), T(String(a + b + c + d), 'You added the side lengths. Multiply the sides of each rectangle first, then add the two areas.')],
        work: a + ' × ' + b + ' = ' + A1 + ' and ' + c + ' × ' + d + ' = ' + A2 + '. ' + A1 + ' + ' + A2 + ' = ' + ans + ' ' + pick2(u) + '.',
        plain: 'Find the area of each rectangle. Then add them.',
        teach: [
          lines('The L shape is split into rectangle A and rectangle B. The picture is not to scale.', LART, 99),
          x('Area of A. ' + a + ' × ' + b + ' = ' + A1 + '.', 'A: ' + a + ' × ' + b + ' = ', [String(A1), 'area of A']),
          x('Area of B. ' + c + ' × ' + d + ' = ' + A2 + '.', 'B: ' + c + ' × ' + d + ' = ', [String(A2), 'area of B']),
          x('Add the two areas. ' + A1 + ' + ' + A2 + ' = ' + ans + '.', A1 + ' + ' + A2 + ' = ', [String(ans) + ' ' + pick2(u), 'total area'])
        ]
      });
    } },

    { id: 'compare', level: 4, name: 'Compare area and perimeter', make: function () {
      if (R.int(0, 1) === 0) {
        var h = R.int(9, 16), l1 = R.int(Math.ceil(h / 2), h - 2), w1 = h - l1, l2, w2;
        do { l2 = R.int(Math.ceil(h / 2), h - 1); w2 = h - l2; } while (l2 * w2 === l1 * w1);
        var A1 = l1 * w1, A2 = l2 * w2, P = 2 * h;
        return Q.choice({
          skill: 'Compare area and perimeter', prompt: 'Two rectangles both have a perimeter of ' + P + ' cm. Rectangle A is ' + l1 + ' cm by ' + w1 + ' cm. Rectangle B is ' + l2 + ' cm by ' + w2 + ' cm. Which rectangle has the greater area?',
          options: [
            { text: 'Rectangle A', ok: A1 > A2, trap: 'Work out the areas. ' + l1 + ' × ' + w1 + ' = ' + A1 + ' and ' + l2 + ' × ' + w2 + ' = ' + A2 + '. Rectangle A is not bigger.' },
            { text: 'Rectangle B', ok: A2 > A1, trap: 'Work out the areas. ' + l1 + ' × ' + w1 + ' = ' + A1 + ' and ' + l2 + ' × ' + w2 + ' = ' + A2 + '. Rectangle B is not bigger.' },
            { text: 'They have the same area', ok: false, trap: 'Same perimeter does not mean same area. ' + A1 + ' is not equal to ' + A2 + '.' }
          ],
          work: l1 + ' × ' + w1 + ' = ' + A1 + ' cm² and ' + l2 + ' × ' + w2 + ' = ' + A2 + ' cm². ' + (A1 > A2 ? 'A' : 'B') + ' has the greater area.',
          plain: 'Same perimeter can still give different areas. Multiply the sides of each one.',
          teach: [
            x('Both perimeters are ' + P + ' cm. Check that the shapes are fair to compare.', 'A: 2 × (' + l1 + ' + ' + w1 + ') = ' + P + ',  B: 2 × (' + l2 + ' + ' + w2 + ') = ' + P),
            x('Find the area of A. ' + l1 + ' × ' + w1 + ' = ' + A1 + '.', 'A: ' + l1 + ' × ' + w1 + ' = ', [String(A1), 'cm²']),
            x('Find the area of B. ' + l2 + ' × ' + w2 + ' = ' + A2 + '.', 'B: ' + l2 + ' × ' + w2 + ' = ', [String(A2), 'cm²']),
            x('Compare. ' + Math.max(A1, A2) + ' is greater than ' + Math.min(A1, A2) + '. So rectangle ' + (A1 > A2 ? 'A' : 'B') + ' has the greater area.', [String(Math.max(A1, A2)), 'greater'], ' > ', [String(Math.min(A1, A2)), 'smaller'])
          ]
        });
      }
      var A = R.pick([24, 36, 48, 30, 40, 60]), pairs = [];
      for (var i = 1; i <= A; i++) if (A % i === 0 && i <= A / i) pairs.push([A / i, i]);
      pairs = R.shuffle(pairs.filter(function (p) { return p[1] >= 2; }));
      var p1 = pairs[0], p2 = pairs[1];
      var Pp1 = 2 * (p1[0] + p1[1]), Pp2 = 2 * (p2[0] + p2[1]);
      return Q.choice({
        skill: 'Compare area and perimeter', prompt: 'Two rectangles both have an area of ' + A + ' cm². Rectangle A is ' + p1[0] + ' cm by ' + p1[1] + ' cm. Rectangle B is ' + p2[0] + ' cm by ' + p2[1] + ' cm. Which rectangle has the greater perimeter?',
        options: [
          { text: 'Rectangle A', ok: Pp1 > Pp2, trap: 'Work out the perimeters. A is 2 × (' + p1[0] + ' + ' + p1[1] + ') = ' + Pp1 + ' and B is 2 × (' + p2[0] + ' + ' + p2[1] + ') = ' + Pp2 + '. A is not longer around.' },
          { text: 'Rectangle B', ok: Pp2 > Pp1, trap: 'Work out the perimeters. A is 2 × (' + p1[0] + ' + ' + p1[1] + ') = ' + Pp1 + ' and B is 2 × (' + p2[0] + ' + ' + p2[1] + ') = ' + Pp2 + '. B is not longer around.' },
          { text: 'They have the same perimeter', ok: false, trap: 'Same area does not mean same perimeter. ' + Pp1 + ' is not equal to ' + Pp2 + '.' }
        ],
        work: 'A: 2 × (' + p1[0] + ' + ' + p1[1] + ') = ' + Pp1 + ' cm. B: 2 × (' + p2[0] + ' + ' + p2[1] + ') = ' + Pp2 + ' cm. ' + (Pp1 > Pp2 ? 'A' : 'B') + ' has the greater perimeter.',
        plain: 'Same area can give different perimeters. Long thin shapes are longer around.',
        teach: [
          x('Both areas are ' + A + ' cm². Check. ' + p1[0] + ' × ' + p1[1] + ' = ' + A + ' and ' + p2[0] + ' × ' + p2[1] + ' = ' + A + '.', 'A: ' + p1[0] + ' × ' + p1[1] + ',  B: ' + p2[0] + ' × ' + p2[1]),
          x('Perimeter of A. 2 × (' + p1[0] + ' + ' + p1[1] + ') = ' + Pp1 + '.', 'A: ', [String(Pp1), 'cm']),
          x('Perimeter of B. 2 × (' + p2[0] + ' + ' + p2[1] + ') = ' + Pp2 + '.', 'B: ', [String(Pp2), 'cm']),
          x('Compare. ' + Math.max(Pp1, Pp2) + ' is greater than ' + Math.min(Pp1, Pp2) + '. So rectangle ' + (Pp1 > Pp2 ? 'A' : 'B') + ' has the greater perimeter.', [String(Math.max(Pp1, Pp2)), 'greater'], ' > ', [String(Math.min(Pp1, Pp2)), 'smaller'])
        ]
      });
    } },

    { id: 'lcut', level: 5, name: 'Area with a corner cut out', make: function () {
      var L = R.int(7, 12), W = R.int(5, 9), c = R.int(2, 5), d = R.int(2, 4), u = R.pick(['cm', 'm']);
      var big = L * W, cut = c * d, ans = big - cut;
      var prompt = R.pick([
        'A rectangle is ' + L + ' ' + u + ' long and ' + W + ' ' + u + ' wide. A rectangle ' + c + ' ' + u + ' by ' + d + ' ' + u + ' is cut out of one corner. What is the area of the shape that is left in ' + pick2(u) + '?',
        'An L shaped room fits inside a rectangle ' + L + ' ' + u + ' by ' + W + ' ' + u + '. The missing corner is ' + c + ' ' + u + ' by ' + d + ' ' + u + '. What is the area of the room in ' + pick2(u) + '?'
      ]);
      return N({
        skill: 'Area with a corner cut out', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(big), 'That is the whole big rectangle. The corner piece is missing, so take its area away.'), T(String(big + cut), 'You added the corner piece. It is missing, so subtract it.'),
                T(String(big - c - d), 'You took away the sides of the corner. Take away its area, ' + c + ' × ' + d + '.')],
        work: L + ' × ' + W + ' = ' + big + ', ' + c + ' × ' + d + ' = ' + cut + '. ' + big + ' − ' + cut + ' = ' + ans + ' ' + pick2(u) + '.',
        plain: 'Find the whole rectangle, then take away the missing corner.',
        teach: [
          grid('The big rectangle is ' + L + ' wide and ' + W + ' tall. The pink corner is ' + c + ' wide and ' + d + ' tall and is cut out.', L, W, [block(0, L, 0, W, RECT), block(L - c, L, 0, d, CUT)]),
          x('Area of the whole rectangle. ' + L + ' × ' + W + ' = ' + big + '.', L + ' × ' + W + ' = ', [String(big), 'whole']),
          x('Area of the corner that is cut out. ' + c + ' × ' + d + ' = ' + cut + '.', c + ' × ' + d + ' = ', [String(cut), 'cut out']),
          x('Take the cut piece away. ' + big + ' − ' + cut + ' = ' + ans + '.', big + ' − ' + cut + ' = ', [String(ans) + ' ' + pick2(u), 'area'])
        ]
      });
    } },

    { id: 'lperim', level: 5, name: 'Perimeter of an L shape', make: function () {
      var L = R.int(7, 12), W = R.int(5, 9), c = R.int(2, 5), d = R.int(2, 4), u = R.pick(['cm', 'm']);
      var ans = 2 * (L + W), sides = [L - c, d, c, W - d, L, W];
      var prompt = R.pick([
        'An L shape is a rectangle ' + L + ' ' + u + ' by ' + W + ' ' + u + ' with a rectangle ' + c + ' ' + u + ' by ' + d + ' ' + u + ' cut out of one corner. What is the perimeter of the L shape in ' + u + '?',
        'A rectangular ' + (u === 'm' ? 'yard' : 'card') + ' is ' + L + ' ' + u + ' long and ' + W + ' ' + u + ' wide. A corner piece ' + c + ' ' + u + ' by ' + d + ' ' + u + ' is removed to make an L shape. How far is it around the L shape in ' + u + '?'
      ]);
      return N({
        skill: 'Perimeter of an L shape', prompt: prompt, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(ans + 2 * (c + d)), 'You added the sides of the cut out corner twice. The outside path is the same length as the big rectangle.'),
                T(String(L * W - c * d), 'That is the area. Perimeter is the distance around.'),
                T(String(ans - 2 * (c + d)), 'You took away the corner sides. Walking around the notch is as long as walking around the corner it replaced.')],
        work: sides.join(' + ') + ' = ' + ans + '. Shortcut: 2 × (' + L + ' + ' + W + ') = ' + ans + ' ' + u + '.',
        plain: 'Cutting a corner does not change how far it is around. Use the big rectangle.',
        teach: [
          grid('The big rectangle is ' + L + ' wide and ' + W + ' tall. The pink corner is ' + c + ' by ' + d + ' and is cut out.', L, W, [block(0, L, 0, W, RECT), block(L - c, L, 0, d, CUT)]),
          lines('Walk around the outside of the L and write each side.', ['Top: ' + sides[0], 'Down: ' + sides[1], 'Right: ' + sides[2], 'Down: ' + sides[3], 'Bottom: ' + sides[4], 'Up: ' + sides[5]], 99),
          x('Add all six sides.', sides.join(' + ') + ' = ', [String(ans) + ' ' + u, 'perimeter']),
          x('Shortcut. The corner is cut out, so the path is as long as the big rectangle. 2 × (' + L + ' + ' + W + ') = ' + ans + '.', '2 × (' + L + ' + ' + W + ') = ', [String(ans), 'same answer'])
        ]
      });
    } },

    { id: 'cost', level: 5, name: 'Cost of tiles or a fence', make: function () {
      var l = R.int(4, 9), w = R.int(3, 8);
      if (l === w) l++;
      var p = R.int(2, 9), name = R.pick(['Rinka', 'Sam', 'Mia', 'Priya']);
      if (R.int(0, 1) === 0) {
        var A = l * w, ans = A * p;
        return N({
          skill: 'Cost of tiles or a fence', prompt: name + ' is tiling a rectangular floor ' + l + ' m long and ' + w + ' m wide. Tiles cost $' + p + ' for each square metre. How many dollars will the tiles cost?',
          answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
          traps: [T(String(A), 'That is the area in square metres. Multiply by the price of $' + p + ' for each square metre.'), T(String(2 * (l + w) * p), 'You used the perimeter. Tiles cover the inside, so use the area.')],
          work: l + ' × ' + w + ' = ' + A + ' m². ' + A + ' × ' + p + ' = ' + ans + ' dollars.', plain: 'Find the area, then multiply by the cost for each square metre.',
          teach: [
            note('There are two steps. First find the measurement. Then multiply by the price.', 'Plan', ['Step one: area, because tiles cover the inside', 'Step two: times the price']),
            x('Tiles cover the inside, so first find the area.', l + ' × ' + w + ' = ', [String(A) + ' m²', 'area']),
            x('Each square metre costs $' + p + '. Multiply the area by the price.', A + ' × ' + p + ' = ', [String(ans), 'dollars']),
            x('The tiles cost $' + ans + '.', [String(ans), 'dollars'])
          ]
        });
      }
      var P = 2 * (l + w), ans2 = P * p;
      return N({
        skill: 'Cost of tiles or a fence', prompt: name + ' is putting a fence around a rectangular garden ' + l + ' m long and ' + w + ' m wide. The fence costs $' + p + ' for each metre. How many dollars will the fence cost?',
        answer: ans2, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(P), 'That is the length of fence. Multiply by the price of $' + p + ' for each metre.'), T(String(l * w * p), 'You used the area. A fence goes around the edge, so use the perimeter.')],
        work: '2 × (' + l + ' + ' + w + ') = ' + P + ' m. ' + P + ' × ' + p + ' = ' + ans2 + ' dollars.', plain: 'Find the perimeter, then multiply by the cost for each metre.',
        teach: [
          note('There are two steps. First find the measurement. Then multiply by the price.', 'Plan', ['Step one: perimeter, because a fence goes around the edge', 'Step two: times the price']),
          x('A fence goes around the edge, so first find the perimeter.', '2 × (' + l + ' + ' + w + ') = ', [String(P) + ' m', 'perimeter']),
          x('Each metre costs $' + p + '. Multiply the length by the price.', P + ' × ' + p + ' = ', [String(ans2), 'dollars']),
          x('The fence costs $' + ans2 + '.', [String(ans2), 'dollars'])
        ]
      });
    } },

    { id: 'areafromperim', level: 6, name: 'Area from a perimeter clue', make: function () {
      if (R.int(0, 1) === 0) {
        var s = R.int(4, 15), P = 4 * s, u = R.pick(['cm', 'm']);
        return N({
          skill: 'Area from a perimeter clue', prompt: 'A square has a perimeter of ' + P + ' ' + u + '. What is its area in ' + pick2(u) + '?', answer: s * s, keyboard: 'numeric', placeholder: 'Type a number',
          traps: [T(String(s), 'That is one side. Multiply the side by itself to get the area.'), T(String(P), 'That is the perimeter. You need the area.'), T(String(P * P), 'Do not square the perimeter. Find one side first, then square that.')],
          work: P + ' ÷ 4 = ' + s + '. ' + s + ' × ' + s + ' = ' + (s * s) + ' ' + pick2(u) + '.', plain: 'First find one side. Then multiply the side by itself.',
          teach: [
            x('First find the side. A square has 4 equal sides. ' + P + ' ÷ 4 = ' + s + '.', P + ' ÷ 4 = ', [String(s), 'each side']),
            x('Now the area. Side times side. ' + s + ' × ' + s + ' = ' + (s * s) + '.', s + ' × ' + s + ' = ', [String(s * s), 'area']),
            grid('Picture it as squares. ' + s + ' rows of ' + s + '.', Math.min(s, 12), Math.min(s, 12), [block(0, Math.min(s, 12), 0, Math.min(s, 12), GREEN)]),
            x('The area is ' + (s * s) + ' ' + pick2(u) + '.', [String(s * s) + ' ' + pick2(u), 'area'])
          ]
        });
      }
      var l = R.int(6, 15), w = R.int(2, l - 1), P2 = 2 * (l + w), u2 = R.pick(['cm', 'm']);
      return N({
        skill: 'Area from a perimeter clue', prompt: 'A rectangle has a perimeter of ' + P2 + ' ' + u2 + ' and a length of ' + l + ' ' + u2 + '. What is its area in ' + pick2(u2) + '?', answer: l * w, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(w), 'That is only the width. Multiply the length by the width to get the area.'), T(String((P2 - l) * l), 'You took the length from the whole perimeter. Halve the perimeter first to find the width.'),
                T(String(P2 / 2 * l), 'That uses length plus width. Take away the length first to find the width.')],
        work: P2 + ' ÷ 2 = ' + (l + w) + '. ' + (l + w) + ' − ' + l + ' = ' + w + '. ' + l + ' × ' + w + ' = ' + (l * w) + ' ' + pick2(u2) + '.', plain: 'Use the perimeter to find the width. Then multiply length by width.',
        teach: [
          x('Half of the perimeter is length plus width. ' + P2 + ' ÷ 2 = ' + (l + w) + '.', P2 + ' ÷ 2 = ', [String(l + w), 'length + width']),
          x('Take away the length. ' + (l + w) + ' − ' + l + ' = ' + w + '. The width is ' + w + '.', (l + w) + ' − ' + l + ' = ', [String(w), 'width']),
          x('Now the area. ' + l + ' × ' + w + ' = ' + (l * w) + '.', l + ' × ' + w + ' = ', [String(l * w) + ' ' + pick2(u2), 'area']),
          x('So the area is ' + (l * w) + ' ' + pick2(u2) + '.', [String(l * w) + ' ' + pick2(u2), 'area'])
        ]
      });
    } },

    { id: 'minperim', level: 6, name: 'Smallest perimeter for an area', make: function () {
      var A = R.pick([16, 24, 30, 36, 40, 48, 60, 64, 72]), pairs = [], best = 1e9;
      for (var i = 1; i * i <= A; i++) if (A % i === 0) { pairs.push([A / i, i]); best = Math.min(best, 2 * (A / i + i)); }
      var worst = 2 * (A + 1);
      var rows = pairs.map(function (p) { return p[0] + ' by ' + p[1] + '   ' + 2 * (p[0] + p[1]) + ' cm'; });
      var bestPair = pairs.filter(function (p) { return 2 * (p[0] + p[1]) === best; })[0];
      return N({
        skill: 'Smallest perimeter for an area', prompt: 'A rectangle has an area of ' + A + ' cm². Its sides are whole numbers of centimetres. What is the smallest perimeter it can have in cm?',
        answer: best, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(worst), 'That is the long thin rectangle, ' + A + ' by 1. It has the biggest perimeter, not the smallest.'), T(String(A), 'That is the area. We want the perimeter of the best shaped rectangle.')],
        work: 'Try every pair of whole number sides that multiply to ' + A + ': ' + pairs.map(function (p) { return p[0] + ' by ' + p[1] + ' gives ' + 2 * (p[0] + p[1]); }).join(', ') + '. The smallest is ' + best + ' cm.',
        plain: 'List every pair of whole numbers that multiply to make the area. Find the perimeter of each. The pair closest to a square is smallest.',
        teach: [
          x('List every pair of whole numbers that multiply to make ' + A + '.', pairs.map(function (p) { return p[0] + ' × ' + p[1]; }).join(',  ')),
          lines('Find the perimeter of each pair. Perimeter is 2 × (length + width).', ['Sides       Perimeter'].concat(rows), 99),
          x('The pair closest to a square has the smallest perimeter. That is ' + bestPair[0] + ' by ' + bestPair[1] + '.', [bestPair[0] + ' by ' + bestPair[1], 'closest to a square']),
          x('The smallest perimeter is 2 × (' + bestPair[0] + ' + ' + bestPair[1] + ') = ' + best + ' cm.', '2 × (' + bestPair[0] + ' + ' + bestPair[1] + ') = ', [String(best) + ' cm', 'smallest'])
        ]
      });
    } }
  ]);
})();
