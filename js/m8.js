/* Module 8: 3D Volume and Spatial Capacity. Lessons, vocabulary and question skills. */
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
    if (!o.keyboard) o.keyboard = 'numeric';
    if (!o.placeholder) o.placeholder = 'Type a number';
    return Q.num(o);
  }
  /* A simple picture of a box, drawn with text. */
  var BOX = ['      ________', '     /       /|', '    /_______/ |', '    |       | |', '    |       | /', '    |_______|/'];

  /* ---------- Vocabulary ---------- */
  window.MATH_VOCAB[8] = [
    { w: 'Unit cube', m: 'A small cube with every side 1 unit long. We count unit cubes to measure volume.' },
    { w: 'Volume', m: 'The amount of space inside a solid shape. It is the number of unit cubes that fill it.' },
    { w: 'Cubic centimeter', m: 'The volume of a cube that is 1 cm on every side. We write it cm³.' },
    { w: 'Cuboid', m: 'A box shape with 6 flat rectangle faces. Its volume is length × width × height.' },
    { w: 'Capacity', m: 'How much liquid a container can hold. It is measured in liters or milliliters.' },
    { w: 'Liter and milliliter', m: 'Units for liquid. 1 liter (L) is 1000 milliliters (mL). And 1 L holds 1000 cm³.' },
    { w: 'Net', m: 'A flat pattern that folds up into a 3D shape, like an unfolded cardboard box.' },
    { w: 'Face, edge and vertex', m: 'A face is a flat side. An edge is where two faces meet. A vertex is a corner where edges meet.' }
  ];

  /* ---------- Lessons ---------- */
  window.MATH_LESSONS[8] = [
    { title: '1. Unit cubes and volume',
      explain: [
        'Volume is the amount of space inside a solid shape. A box has volume because it can hold things.',
        'To measure volume, we fill the shape with small cubes that are all the same size. A unit cube has sides that are 1 unit long.',
        'Count the unit cubes, and you know the volume. If 12 cubes fill a box, the volume is 12 cubic units.'
      ],
      rule: 'Volume is the number of unit cubes that fill a shape.',
      mistake: 'Volume is not the length of the edges. It is how many cubes fit inside.',
      steps: [
        note('Start with the small cube that we count with.', 'Unit cube', ['Every side is 1 unit long', 'We count unit cubes to measure volume']),
        groups('Here are 4 rows of 3 unit cubes. Each counter is one cube.', 4, 3, 0, '3 cubes in each row'),
        x('Count them all. 4 rows of 3 cubes is 4 × 3 = 12 cubes.', '4 × 3 = ', ['12', 'cubes']),
        x('The shape is filled by 12 unit cubes. So its volume is 12 cubic units.', ['12', 'cubes'], ' = volume ', ['12', 'cubic units']),
        x('Bigger shapes hold more cubes, so they have more volume.', ['24 cubes', 'more volume'], ' is more than ', ['12 cubes', 'less volume'])
      ] },

    { title: '2. Counting cubes in layers',
      explain: [
        'It is hard to count every cube in a box. But a box is built from layers, like a stack of trays. Each layer is a flat sheet of cubes.',
        'First count the cubes in one layer. That is the length times the width. Then count how many layers are stacked up. That is the height.',
        'Every layer holds the same number of cubes. So multiply the cubes in one layer by the number of layers.'
      ],
      rule: 'Cubes in one layer × number of layers = total cubes.',
      mistake: 'Do not forget the layers. Counting only the floor gives you the cubes in ONE layer.',
      steps: [
        grid('Here is the floor of a box. It is 4 cubes long and 3 cubes wide. Each square is one cube.', 4, 3, [{ c0: 0, c1: 4, r0: 0, r1: 3, cls: 'bg-emerald-400' }]),
        x('Count one layer. 4 × 3 = 12 cubes.', '4 × 3 = ', ['12', 'cubes in one layer']),
        bars('The box is 2 layers tall. Each layer holds 12 cubes.', [row('2 layers', 2, 'bg-emerald-400', 12)]),
        x('Two layers of 12 cubes. 12 × 2 = 24.', '12 × 2 = ', ['24', 'cubes in the box']),
        x('Second example. A box has a floor of 3 × 3 = 9 cubes and is 3 layers tall.', '3 × 3 = ', ['9', 'one layer']),
        x('3 layers of 9 cubes is 9 × 3 = 27 cubes.', '9 × 3 = ', ['27', 'cubes in the box'])
      ] },

    { title: '3. Volume of a cuboid',
      explain: [
        'A cuboid is a box shape. It has a length, a width and a height.',
        'The length and the width tell how many cubes are in one layer. The height tells how many layers there are.',
        'So the volume is length times width times height. You do not need to count every cube.'
      ],
      rule: 'Volume = length × width × height.',
      mistake: 'Do not add the sides. Adding does not tell you the space inside. Volume needs multiplying.',
      steps: [
        lines('A box is 5 cubes long, 3 wide and 4 high.', BOX, 0),
        x('The floor layer has length times width. 5 × 3 = 15 cubes.', '5 × 3 = ', ['15', 'one layer']),
        x('The box is 4 layers high. So we stack 4 layers of 15.', '15 × ', ['4', 'layers']),
        x('15 × 4 = 60. The volume is 60 cubic units.', '5 × 3 × 4 = ', ['60', 'volume']),
        x('Second example. A box is 8 long, 2 wide and 6 high. 8 × 2 = 16 in one layer.', '8 × 2 = ', ['16', 'one layer']),
        x('16 × 6 = 96. The volume is 96 cubic units.', '8 × 2 × 6 = ', ['96', 'volume'])
      ] },

    { title: '4. Cubic centimeters',
      explain: [
        'A centimeter is a small length. A cubic centimeter is the volume of a tiny cube that is 1 cm long, 1 cm wide and 1 cm high. We write it cm³.',
        'When a box is measured in centimeters, its volume is in cubic centimeters. The small 3 means we multiplied three lengths.',
        'Do not mix up the units. Length is cm. Area is cm². Volume is cm³.'
      ],
      rule: 'Length is cm. Area is cm². Volume is cm³.',
      mistake: 'Do not write cm or cm² for a volume. Always write cm³.',
      steps: [
        note('One tiny cube is our unit.', 'One cubic centimeter', ['A cube 1 cm long, 1 cm wide, 1 cm high', 'We write it 1 cm³']),
        lines('A box is 4 cm long, 3 cm wide and 2 cm high.', BOX, 0),
        x('Multiply the three lengths. 4 × 3 = 12 for one layer.', '4 cm × 3 cm = ', ['12 cm²', 'one layer, the base']),
        x('Two layers. 12 × 2 = 24.', '12 × 2 = ', ['24', 'cubes']),
        x('The volume is 24 cubic centimeters, written 24 cm³.', '4 × 3 × 2 = ', ['24 cm³', 'volume']),
        note('Do not mix up the units.', 'Units', ['cm measures a length', 'cm² measures a flat area', 'cm³ measures a volume'])
      ] },

    { title: '5. Base area times height',
      explain: [
        'The bottom of a box is called its base. The area of the base tells how many cubes cover the floor.',
        'The height tells how many layers there are. So the volume is base area times height.',
        'This is the same as length times width times height, because the base area is length times width. It is a handy shortcut when you already know the base area.'
      ],
      rule: 'Volume = area of the base × height.',
      mistake: 'The base area is in square units, like cm². Multiply it by the height to get cubic units, cm³.',
      steps: [
        grid('The base of a box is 5 cm by 4 cm. Each square is 1 cm².', 5, 4, [{ c0: 0, c1: 5, r0: 0, r1: 4, cls: 'bg-emerald-400' }]),
        x('Base area is 5 × 4 = 20 cm². That is how many cubes cover the floor.', '5 × 4 = ', ['20 cm²', 'base area']),
        bars('The box is 6 cm high. That is 6 layers, each with 20 cubes.', [row('6 layers', 6, 'bg-emerald-400', 20)]),
        x('Volume is base area times height. 20 × 6 = 120.', '20 × 6 = ', ['120 cm³', 'volume']),
        x('Second example. A pool has a base area of 36 m² and is 3 m deep.', ['36 m²', 'base area'], ' and ', ['3 m', 'height']),
        x('36 × 3 = 108. The volume is 108 m³.', '36 × 3 = ', ['108 m³', 'volume'])
      ] },

    { title: '6. Capacity and liters',
      explain: [
        'Capacity is how much liquid a container can hold. A jug, a fish tank and a bottle all have a capacity.',
        'We measure capacity in liters, written L, and in milliliters, written mL. A milliliter is a tiny amount, about a drop or two.',
        '1 liter is the same as 1000 milliliters. To change liters into milliliters, multiply by 1000. To go back, divide by 1000.'
      ],
      rule: '1 L = 1000 mL. Liters to milliliters: multiply by 1000.',
      mistake: 'Do not multiply by 100. There are 1000 milliliters in a liter.',
      steps: [
        note('Two units for liquid.', 'Liters and milliliters', ['Liter is written L', 'Milliliter is written mL', '1 L = 1000 mL']),
        x('Liters to milliliters. Multiply by 1000. 3 L is 3 × 1000 = 3000 mL.', '3 L = 3 × 1000 = ', ['3000 mL', 'answer']),
        x('Milliliters to liters. Divide by 1000. 5000 mL is 5000 ÷ 1000 = 5 L.', '5000 mL ÷ 1000 = ', ['5 L', 'answer']),
        x('Half a liter is 500 mL. A quarter of a liter is 250 mL.', ['0.5 L', 'half'], ' = ', ['500 mL', 'half a liter']),
        x('1500 mL is 1500 ÷ 1000 = 1.5 L. That is 1 liter and a half.', '1500 mL = ', ['1.5 L', 'answer'])
      ] },

    { title: '7. 1000 cm³ is 1 liter',
      explain: [
        'Here is a great link. A cube that is 10 cm long, 10 cm wide and 10 cm high holds exactly 1 liter of water.',
        'Its volume is 10 × 10 × 10 = 1000 cm³. So 1000 cm³ is the same as 1 liter.',
        'That means 1 cm³ holds 1 milliliter. To change cm³ into liters, divide by 1000.'
      ],
      rule: '1000 cm³ = 1 L. And 1 cm³ = 1 mL.',
      mistake: 'Do not forget to divide by 1000 when changing cm³ to liters. A big number of cm³ is a small number of liters.',
      steps: [
        grid('The base of a cube is 10 cm by 10 cm. That is 100 cm² of cubes.', 10, 10, [{ c0: 0, c1: 10, r0: 0, r1: 10, cls: 'bg-emerald-400' }]),
        groups('The cube is 10 layers tall. Each layer has 100 cubes.', 10, 10, 10, '10 layers of 100'),
        x('10 × 10 × 10 = 1000 cubic centimeters.', '10 × 10 × 10 = ', ['1000 cm³', 'volume']),
        x('This cube holds 1 liter of water. So 1000 cm³ is 1 L.', ['1000 cm³', 'volume'], ' = ', ['1 L', 'capacity']),
        x('Example. A tank is 5000 cm³. 5000 ÷ 1000 = 5 liters.', '5000 cm³ ÷ 1000 = ', ['5 L', 'answer']),
        x('Another example. A tank is 20 cm by 25 cm by 40 cm. 20 × 25 × 40 = 20000 cm³, which is 20 L.', '20000 ÷ 1000 = ', ['20 L', 'capacity'])
      ] },

    { title: '8. Finding a missing side',
      explain: [
        'Sometimes you know the volume and two sides, and you need to find the third side. Work backward.',
        'Volume = base area × height. So the missing side is found by dividing. First find the base area. Then divide the volume by the base area.',
        'Always check your answer by multiplying all three sides again. You should get the volume back.'
      ],
      rule: 'Missing height = volume ÷ base area.',
      mistake: 'Do not divide the volume by only one side. Divide by the whole base area, which is length × width.',
      steps: [
        x('A box has volume 72 cm³. Its length is 6 cm and width is 4 cm. Find the height.', ['72 cm³', 'volume'], ', ', ['6 × 4', 'base'], ', ', ['?', 'height']),
        x('First find the base area. 6 × 4 = 24 cm².', '6 × 4 = ', ['24 cm²', 'base area']),
        x('Volume is base area times height, so 24 × ? = 72.', '24 × ', ['?', 'height'], ' = 72'),
        x('Work backward. Divide the volume by the base area. 72 ÷ 24 = 3.', '72 ÷ 24 = ', ['3 cm', 'height']),
        x('Check. 6 × 4 × 3 = 72. It works.', '6 × 4 × 3 = ', ['72', 'volume back']),
        x('Second example. Volume 150 cm³ and base area 25 cm². 150 ÷ 25 = 6.', '150 ÷ 25 = ', ['6 cm', 'height'])
      ] },

    { title: '9. Volume of two boxes joined',
      explain: [
        'Some shapes are made from two boxes stuck together. You cannot use one simple multiplication for the whole shape.',
        'Split the shape into boxes. Find the volume of each box. Then add the volumes together.',
        'Sometimes a piece is cut out of a big box. Then find the volume of the big box and take away the volume of the piece that is gone.'
      ],
      rule: 'Split into boxes. Find each volume. Add them, or take away a piece that is cut out.',
      mistake: 'Do not count the joined part twice. Make sure each box is only counted once.',
      steps: [
        grid('Look from above at an L shape. The green box is 5 cm long. The yellow box is 3 cm long. Both are 4 cm wide.', 8, 4, [{ c0: 0, c1: 5, r0: 0, r1: 4, cls: 'bg-emerald-400' }, { c0: 5, c1: 8, r0: 0, r1: 4, cls: 'bg-amber-300' }]),
        x('Both boxes are 3 cm high. The green box is 5 × 4 × 3 = 60 cm³.', '5 × 4 × 3 = ', ['60 cm³', 'green box']),
        x('The yellow box is 3 × 4 × 3 = 36 cm³.', '3 × 4 × 3 = ', ['36 cm³', 'yellow box']),
        x('Add the two volumes. 60 + 36 = 96.', '60 + 36 = ', ['96 cm³', 'total']),
        x('Check. The whole shape is 8 × 4 × 3 = 96 cm³. Same answer.', '8 × 4 × 3 = ', ['96 cm³', 'same answer']),
        x('Second example. A block is 6 × 5 × 4 = 120 cm³. A small piece 2 × 2 × 4 = 16 cm³ is cut out.', '6 × 5 × 4 = ', ['120', 'whole'], ', ', ['16', 'cut out']),
        x('Take the piece away. 120 − 16 = 104 cm³ is left.', '120 − 16 = ', ['104 cm³', 'left'])
      ] },

    { title: '10. Nets, faces, edges and vertices',
      explain: [
        'A net is a flat pattern that folds up into a 3D shape. Think of a cardboard box lying flat before it is folded.',
        'A face is a flat side of the shape. An edge is a line where two faces meet. A vertex is a corner where edges meet. The plural of vertex is vertices.',
        'A cube and a cuboid both have 6 faces, 12 edges and 8 vertices.'
      ],
      rule: 'A cube or cuboid has 6 faces, 12 edges and 8 vertices.',
      mistake: 'Do not count only the faces you can see. Remember the bottom and the back too.',
      steps: [
        lines('This is a net. It has 6 squares. Fold it up and it makes a cube.', ['    [ ]', '[ ][ ][ ][ ]', '    [ ]'], 0),
        lines('Here is the cube. Its flat sides are faces.', BOX, 0),
        x('Faces are the flat sides. Top, bottom, front, back, left, right. That is 6 faces.', ['6', 'faces']),
        x('Edges are where faces meet. 4 on the top, 4 on the bottom and 4 going up. 4 + 4 + 4 = 12.', '4 + 4 + 4 = ', ['12', 'edges']),
        x('Vertices are the corners. 4 on the top and 4 on the bottom. 4 + 4 = 8.', '4 + 4 = ', ['8', 'vertices']),
        note('Facts about a cube or cuboid.', 'Count them', ['6 faces', '12 edges', '8 vertices'])
      ] },

    { title: '11. Water in a tank',
      explain: [
        'When you pour water into a tank, the water makes a box shape of its own. It has the same base as the tank. Its height is the water level.',
        'The volume of the water is the base area times the water height. Water in liters can be changed to cm³ by multiplying by 1000.',
        'To find how high the water rises, divide the volume in cm³ by the base area.'
      ],
      rule: 'Water height = volume in cm³ ÷ base area. Change liters to cm³ first.',
      mistake: 'Change liters into cm³ before you divide. 4 L is 4000 cm³.',
      steps: [
        x('A tank has a base of 20 cm by 20 cm. We pour in 4 L of water. How high does the water rise?', ['20 × 20', 'base'], ', ', ['4 L', 'water']),
        x('Base area is 20 × 20 = 400 cm².', '20 × 20 = ', ['400 cm²', 'base area']),
        x('Change liters to cm³. 4 L is 4 × 1000 = 4000 cm³.', '4 × 1000 = ', ['4000 cm³', 'water volume']),
        x('Water volume is base area times height. 400 × ? = 4000.', '400 × ', ['?', 'height'], ' = 4000'),
        x('Divide. 4000 ÷ 400 = 10. The water is 10 cm deep.', '4000 ÷ 400 = ', ['10 cm', 'water height']),
        x('Check. 20 × 20 × 10 = 4000 cm³, which is 4 L.', '20 × 20 × 10 = ', ['4000 cm³', 'it works'])
      ] }
  ];

  /* ---------- Question skills ---------- */
  var OBJ = ['a cuboid', 'a box shaped brick', 'a tissue box', 'a cereal box', 'a cube', 'a dice'];

  B.register(8, [

    { id: 'faces', level: 1, name: 'Faces, edges and vertices', make: function () {
      if (R.int(0, 4) === 0) {
        var nets = [
          { p: 'A net is made of 6 identical squares. It folds into which solid?', a: 'Cube', o: ['Cube', 'Triangular prism', 'Square pyramid', 'Cylinder'] },
          { p: 'A net is made of 2 triangles and 3 rectangles. It folds into which solid?', a: 'Triangular prism', o: ['Triangular prism', 'Cube', 'Square pyramid', 'Cylinder'] },
          { p: 'A net is made of 1 square and 4 triangles. It folds into which solid?', a: 'Square pyramid', o: ['Square pyramid', 'Cube', 'Triangular prism', 'Cylinder'] },
          { p: 'A net is made of 6 rectangles. Four are long and thin, and two are squares. It folds into which solid?', a: 'Cuboid', o: ['Cuboid', 'Triangular prism', 'Square pyramid', 'Cylinder'] }
        ];
        var nt = R.pick(nets);
        var facts = { 'Cube': 'A cube has 6 identical square faces.', 'Triangular prism': 'A triangular prism has 2 triangle faces and 3 rectangle faces.', 'Square pyramid': 'A square pyramid has 1 square face and 4 triangle faces.', 'Cuboid': 'A cuboid has 6 rectangle faces.', 'Cylinder': 'A cylinder has curved sides, so its net has circles and one big rectangle.' };
        return Q.choice({
          skill: 'Nets of solids', prompt: nt.p,
          options: nt.o.map(function (nm) { return nm === nt.a ? { text: nm, ok: true } : { text: nm, ok: false, trap: facts[nm] + ' That does not match this net.' }; }),
          work: facts[nt.a], plain: 'Count the kinds of faces in the net. Match them to the solid.',
          teach: [
            x('Look at the flat pieces in the net.', ['Net', 'flat pieces']),
            note('Faces of some solids.', 'Match the faces', ['Cube: 6 squares', 'Cuboid: 6 rectangles', 'Triangular prism: 2 triangles, 3 rectangles', 'Square pyramid: 1 square, 4 triangles']),
            x(facts[nt.a], [nt.a, 'matches']),
            x('So the net folds into a ' + nt.a.toLowerCase() + '.', [nt.a, 'answer'])
          ]
        });
      }
      var mode = R.pick(['faces', 'edges', 'vertices']), obj = R.pick(OBJ);
      var ans = { faces: 6, edges: 12, vertices: 8 }[mode];
      var wr = { faces: [T(8, 'That is the number of vertices, or corners. Faces are the flat sides.'), T(12, 'That is the number of edges. Faces are the flat sides.')],
                 edges: [T(6, 'That is the number of faces. Edges are the lines where faces meet.'), T(8, 'That is the number of vertices, or corners. Edges are lines.')],
                 vertices: [T(6, 'That is the number of faces. Vertices are the corners.'), T(12, 'That is the number of edges. Vertices are the corners.')] }[mode];
      var parts = { faces: ['top, bottom, front, back, left and right', '6'], edges: ['4 on top, 4 on the bottom and 4 going up', '4 + 4 + 4 = 12'], vertices: ['4 on the top and 4 on the bottom', '4 + 4 = 8'] }[mode];
      return N({
        skill: 'Faces, edges and vertices', prompt: 'How many ' + mode + ' does ' + obj + ' have?', answer: ans, traps: wr,
        work: mode === 'faces' ? 'Faces: top, bottom, front, back, left and right make 6.' : mode === 'edges' ? '4 + 4 + 4 = 12 edges.' : '4 + 4 = 8 vertices.',
        plain: mode === 'faces' ? 'Faces are the flat sides.' : mode === 'edges' ? 'Edges are the lines where two faces meet.' : 'Vertices are the corners.',
        teach: [
          lines('Here is a box. It has flat sides, straight lines and corners.', BOX, 0),
          x(mode === 'faces' ? 'Faces are the flat sides.' : mode === 'edges' ? 'Edges are the lines where two faces meet.' : 'Vertices are the corners.', [mode, 'what we count']),
          x('Count them. ' + parts[0] + '.', [parts[1], mode]),
          x('So ' + obj + ' has ' + ans + ' ' + mode + '.', [String(ans), mode])
        ]
      });
    } },

    { id: 'layercount', level: 1, name: 'Cubes in one layer', make: function () {
      var l = R.int(3, 9), w = R.int(2, 6), ans = l * w;
      return N({
        skill: 'Cubes in one layer', prompt: 'The floor of a box is ' + l + ' cubes long and ' + w + ' cubes wide. How many cubes cover the floor?', answer: ans,
        traps: [T(l + w, 'You added. Rows of cubes need multiplying. There are ' + w + ' rows of ' + l + '.'), T(2 * (l + w), 'That counts the cubes around the edge only. We want every cube on the floor.')],
        work: l + ' × ' + w + ' = ' + ans + ' cubes.', plain: 'There are ' + w + ' rows with ' + l + ' cubes in each row. Multiply.',
        teach: [
          grid('Here is the floor. Each square is one cube. It is ' + l + ' long and ' + w + ' wide.', l, w, []),
          grid('Fill the floor with cubes. There are ' + w + ' rows of ' + l + '.', l, w, [{ c0: 0, c1: l, r0: 0, r1: w, cls: 'bg-emerald-400' }]),
          x(w + ' rows of ' + l + ' cubes. ' + l + ' × ' + w + ' = ' + ans + '.', l + ' × ' + w + ' = ', [String(ans), 'cubes']),
          x('The floor holds ' + ans + ' cubes.', [String(ans), 'cubes in one layer'])
        ]
      });
    } },

    { id: 'layers', level: 2, name: 'Count cubes in layers', make: function () {
      var l = R.int(2, 7), w = R.int(2, 5), h = R.int(2, 5), one = l * w, ans = one * h;
      return N({
        skill: 'Count cubes in layers', prompt: 'A box is ' + l + ' cubes long and ' + w + ' cubes wide. It is filled with ' + h + ' layers of cubes. How many cubes are in the box?', answer: ans,
        traps: [T(one, 'That is the cubes in only ONE layer. There are ' + h + ' layers.'), T(l + w + h, 'You added. Multiply the cubes in one layer by the number of layers.')],
        work: l + ' × ' + w + ' = ' + one + ' cubes in a layer. ' + one + ' × ' + h + ' = ' + ans + '.', plain: 'Count one layer. Then multiply by how many layers there are.',
        teach: [
          grid('One layer is ' + l + ' cubes long and ' + w + ' wide.', l, w, [{ c0: 0, c1: l, r0: 0, r1: w, cls: 'bg-emerald-400' }]),
          x('Cubes in one layer. ' + l + ' × ' + w + ' = ' + one + '.', l + ' × ' + w + ' = ', [String(one), 'one layer']),
          bars('There are ' + h + ' layers. Each layer holds ' + one + ' cubes.', [row(h + ' layers', h, 'bg-emerald-400', one)]),
          x('Multiply. ' + one + ' × ' + h + ' = ' + ans + '.', one + ' × ' + h + ' = ', [String(ans), 'cubes in the box'])
        ]
      });
    } },

    { id: 'volume', level: 2, name: 'Volume of a cuboid', make: function () {
      var l, w, h;
      do { l = R.int(2, 12); w = R.int(2, 10); h = R.int(2, 9); } while (l * w * h > 900);
      var ans = l * w * h, base = l * w;
      var thing = R.pick(['A cuboid', 'A fish tank', 'A storage box', 'A block of wood']);
      return N({
        skill: 'Volume of a cuboid', prompt: thing + ' is ' + l + ' cm long, ' + w + ' cm wide and ' + h + ' cm high. What is its volume in cm³?', answer: ans,
        traps: [T(base, 'That is the area of the base only. Multiply by the height too.'), T(l + w + h, 'You added the sides. Volume needs multiplying.'), T(2 * (l * w + l * h + w * h), 'That is the area of all the faces outside. Volume is the space inside.')],
        work: l + ' × ' + w + ' × ' + h + ' = ' + ans + ' cm³.', plain: 'The base has ' + base + ' cubes. Stack ' + h + ' layers of them.',
        teach: [
          x('Volume is length times width times height.', l + ' × ' + w + ' × ' + h, ' = ?'),
          x('Find the base first. ' + l + ' × ' + w + ' = ' + base + '.', l + ' × ' + w + ' = ', [String(base), 'cubes in a layer']),
          x('There are ' + h + ' layers. ' + base + ' × ' + h + ' = ' + ans + '.', base + ' × ' + h + ' = ', [String(ans), 'cubes']),
          x('The volume is ' + ans + ' cm³.', [ans + ' cm³', 'volume'])
        ]
      });
    } },

    { id: 'cubevol', level: 3, name: 'Volume of a cube', make: function () {
      var s = R.int(2, 10), ans = s * s * s;
      return N({
        skill: 'Volume of a cube', prompt: 'A cube has edges that are ' + s + ' cm long. What is its volume in cm³?', answer: ans,
        traps: [T(3 * s, 'You added ' + s + ' three times. A volume needs multiplying: ' + s + ' × ' + s + ' × ' + s + '.'), T(s * s, 'That is the area of one face. Multiply by ' + s + ' once more for the height.'), T(6 * s * s, 'That is the area of all 6 faces. Volume is the space inside.')],
        work: s + ' × ' + s + ' × ' + s + ' = ' + ans + ' cm³.', plain: 'A cube has the same length, width and height.',
        teach: [
          x('A cube has equal sides. Length, width and height are all ' + s + ' cm.', s + ' × ' + s + ' × ' + s + ' = ?'),
          x('Base first. ' + s + ' × ' + s + ' = ' + (s * s) + '.', s + ' × ' + s + ' = ', [String(s * s), 'base']),
          x('Times the height. ' + (s * s) + ' × ' + s + ' = ' + ans + '.', (s * s) + ' × ' + s + ' = ', [String(ans), 'volume']),
          x('The volume is ' + ans + ' cm³.', [ans + ' cm³', 'volume'])
        ]
      });
    } },

    { id: 'basetimes', level: 3, name: 'Base area times height', make: function () {
      var Bs = R.pick([12, 15, 18, 20, 24, 25, 30, 36, 40, 45, 48, 50]), h = R.int(2, 12), ans = Bs * h;
      var u = R.pick([['cm', 'cm²', 'cm³'], ['m', 'm²', 'm³']]);
      return N({
        skill: 'Base area times height', prompt: 'A box has a base area of ' + Bs + ' ' + u[1] + ' and a height of ' + h + ' ' + u[0] + '. What is its volume in ' + u[2] + '?', answer: ans,
        traps: [T(Bs + h, 'You added. The volume is the base area times the height.'), T(Bs, 'That is only the base area. Multiply it by the height.')],
        work: Bs + ' × ' + h + ' = ' + ans + ' ' + u[2] + '.', plain: 'The base area is the number of cubes in one layer. The height is the number of layers.',
        teach: [
          x('We know the base area and the height. Volume is base area times height.', [Bs + ' ' + u[1], 'base area'], ' × ', [h + ' ' + u[0], 'height']),
          x('The base holds ' + Bs + ' cubes in one layer. There are ' + h + ' layers.', [String(Bs), 'per layer'], ' × ', [String(h), 'layers']),
          x(Bs + ' × ' + h + ' = ' + ans + '.', Bs + ' × ' + h + ' = ', [String(ans), 'cubes']),
          x('The volume is ' + ans + ' ' + u[2] + '.', [ans + ' ' + u[2], 'volume'])
        ]
      });
    } },

    { id: 'convert', level: 4, name: 'Liters, milliliters and cm³', make: function () {
      var mode = R.pick(['Lcm', 'cmL', 'mlcm', 'mlL']);
      if (mode === 'Lcm') {
        var n = R.int(2, 9);
        return N({
          skill: 'Liters and cm³', prompt: 'A jug holds ' + n + ' L of water. What is its volume in cm³?', answer: n * 1000,
          traps: [T(n, 'That is the same number in liters. 1 L is 1000 cm³, so multiply by 1000.'), T(n * 100, 'You multiplied by 100. There are 1000 cm³ in 1 L.')],
          work: n + ' × 1000 = ' + (n * 1000) + ' cm³.', plain: '1 liter is 1000 cm³. For ' + n + ' liters, multiply by 1000.',
          teach: [
            x('Remember, 1 liter is the same as 1000 cm³.', ['1 L', 'liter'], ' = ', ['1000 cm³', 'volume']),
            x('We have ' + n + ' liters. Multiply by 1000.', n + ' × 1000 = ', [String(n * 1000), 'cm³']),
            x('So ' + n + ' L is ' + (n * 1000) + ' cm³.', [n + ' L', 'liters'], ' = ', [(n * 1000) + ' cm³', 'answer'])
          ].concat([note('Liters to cm³ means multiply by 1000.', 'Rule', ['Liters to cm³: × 1000', 'cm³ to liters: ÷ 1000'])])
        });
      }
      if (mode === 'cmL') {
        var k = R.int(2, 40), V = k * 1000;
        return N({
          skill: 'cm³ and liters', prompt: 'A tank has a volume of ' + R.fmt(V) + ' cm³. How many liters of water can it hold?', answer: k,
          traps: [T(V, 'That is the volume in cm³. Divide by 1000 to get liters.'), T(V / 100, 'You divided by 100. There are 1000 cm³ in 1 L.')],
          work: R.fmt(V) + ' ÷ 1000 = ' + k + ' L.', plain: '1000 cm³ is 1 liter. Divide by 1000.',
          teach: [
            x('Remember, 1000 cm³ holds 1 liter.', ['1000 cm³', 'volume'], ' = ', ['1 L', 'capacity']),
            x('We have ' + R.fmt(V) + ' cm³. Divide by 1000 to find how many liters.', R.fmt(V) + ' ÷ 1000 = ', [String(k), 'liters']),
            x('The tank holds ' + k + ' liters.', [k + ' L', 'answer'])
          ].concat([note('cm³ to liters means divide by 1000.', 'Rule', ['cm³ to liters: ÷ 1000', 'Liters to cm³: × 1000'])])
        });
      }
      if (mode === 'mlcm') {
        var ml = 50 * R.int(3, 30);
        return N({
          skill: 'Milliliters and cm³', prompt: 'A bottle holds ' + R.fmt(ml) + ' mL of juice. What is its volume in cm³?', answer: ml,
          traps: [T(ml / 1000, 'That changes it to liters. But 1 mL is exactly 1 cm³, so the number stays the same.')],
          work: '1 mL = 1 cm³, so ' + ml + ' mL = ' + ml + ' cm³.', plain: 'A milliliter and a cubic centimeter are the same amount.',
          teach: [
            x('Remember, 1 milliliter takes up exactly 1 cm³.', ['1 mL', 'milliliter'], ' = ', ['1 cm³', 'cubic centimeter']),
            x('So the numbers stay the same. ' + R.fmt(ml) + ' mL is ' + R.fmt(ml) + ' cm³.', R.fmt(ml) + ' mL = ', [R.fmt(ml) + ' cm³', 'answer']),
            note('Do not multiply or divide here.', 'Same amount', ['1 mL = 1 cm³', '1000 mL = 1 L = 1000 cm³']),
            x('The volume is ' + R.fmt(ml) + ' cm³.', [R.fmt(ml) + ' cm³', 'answer'])
          ]
        });
      }
      var m2 = R.pick([250, 500, 750, 1250, 1500, 2500, 3500, 4500]), lit = String(m2 / 1000);
      return N({
        skill: 'Milliliters to liters', prompt: 'A pot holds ' + R.fmt(m2) + ' mL of soup. How many liters is that? You can use a decimal.', answer: lit, keyboard: 'text', placeholder: 'Like 1.5',
        traps: [T(m2, 'That is still in milliliters. Divide by 1000 to get liters.'), T(m2 / 100, 'You divided by 100. There are 1000 mL in 1 L.')],
        work: R.fmt(m2) + ' ÷ 1000 = ' + lit + ' L.', plain: 'Divide milliliters by 1000 to get liters. Move the decimal point 3 places to the left.',
        teach: [
          x('1 liter is 1000 milliliters. To change mL to L, divide by 1000.', ['1 L', 'liter'], ' = ', ['1000 mL', 'milliliters']),
          x('Move the decimal point 3 places to the left.', R.fmt(m2) + ' ÷ 1000 = ', [lit, 'liters']),
          x('So ' + R.fmt(m2) + ' mL is ' + lit + ' L.', [lit + ' L', 'answer'])
        ].concat([note('mL to L means divide by 1000.', 'Rule', ['mL to L: ÷ 1000', 'L to mL: × 1000'])])
      });
    } },

    { id: 'capacity', level: 4, name: 'Capacity of a tank', make: function () {
      var pool = [4, 5, 8, 10, 20, 25, 40, 50], l = 10, w = 10, h = 10;
      for (var t = 0; t < 3000; t++) {
        l = R.pick(pool); w = R.pick(pool); h = R.pick(pool);
        var v = l * w * h;
        if (v % 1000 === 0 && v <= 100000 && v >= 2000) break;
        l = 10; w = 10; h = 20;
      }
      var V = l * w * h, ans = V / 1000;
      return N({
        skill: 'Capacity of a tank', prompt: 'A fish tank is ' + l + ' cm long, ' + w + ' cm wide and ' + h + ' cm high. When it is full, how many liters of water does it hold?', answer: ans,
        traps: [T(V, 'That is the volume in cm³. Divide by 1000 to change it to liters.'), T(V / 100, 'You divided by 100. There are 1000 cm³ in 1 L.')],
        work: l + ' × ' + w + ' × ' + h + ' = ' + R.fmt(V) + ' cm³. ' + R.fmt(V) + ' ÷ 1000 = ' + ans + ' L.', plain: 'Find the volume in cm³. Then divide by 1000 to get liters.',
        teach: [
          x('First find the volume in cm³. Multiply length, width and height.', l + ' × ' + w + ' × ' + h + ' = ?'),
          x(l + ' × ' + w + ' = ' + (l * w) + '. Then ' + (l * w) + ' × ' + h + ' = ' + R.fmt(V) + '.', (l * w) + ' × ' + h + ' = ', [R.fmt(V) + ' cm³', 'volume']),
          x('1000 cm³ is 1 liter. So divide by 1000.', R.fmt(V) + ' ÷ 1000 = ', [String(ans), 'liters']),
          x('The tank holds ' + ans + ' liters.', [ans + ' L', 'capacity'])
        ]
      });
    } },

    { id: 'missing', level: 5, name: 'Find a missing side', make: function () {
      var l, w, h;
      do { l = R.int(2, 12); w = R.int(2, 10); h = R.int(2, 10); } while (l * w * h > 1000);
      var V = l * w * h, base = l * w;
      if (R.int(0, 1) === 0) {
        return N({
          skill: 'Find a missing side', prompt: 'A cuboid has a volume of ' + V + ' cm³. It is ' + l + ' cm long and ' + w + ' cm wide. How high is it, in cm?', answer: h,
          traps: [T(V / l, 'That divides by only the length. Divide by the whole base area, ' + l + ' × ' + w + '.'), T(V - base, 'You took away. Work backward with division.')],
          work: l + ' × ' + w + ' = ' + base + '. ' + V + ' ÷ ' + base + ' = ' + h + '.', plain: 'Volume is base area times height. So height is volume divided by base area.',
          teach: [
            x('Volume is base area times height. We need the height.', [String(V), 'volume'], ' = ', [l + ' × ' + w, 'base'], ' × ', ['?', 'height']),
            x('Find the base area. ' + l + ' × ' + w + ' = ' + base + '.', l + ' × ' + w + ' = ', [String(base), 'base area']),
            x('Work backward. Divide the volume by the base area. ' + V + ' ÷ ' + base + ' = ' + h + '.', V + ' ÷ ' + base + ' = ', [String(h), 'height']),
            x('Check. ' + l + ' × ' + w + ' × ' + h + ' = ' + V + '. It works.', l + ' × ' + w + ' × ' + h + ' = ', [String(V), 'volume back'])
          ]
        });
      }
      return N({
        skill: 'Find a missing side', prompt: 'A box has a volume of ' + V + ' cm³ and a base area of ' + base + ' cm². How high is the box, in cm?', answer: h,
        traps: [T(V - base, 'You took away. Work backward with division.'), T(V / 2, 'Divide the volume by the base area, not by 2.')],
        work: V + ' ÷ ' + base + ' = ' + h + '.', plain: 'Volume is base area times height. So divide the volume by the base area.',
        teach: [
          x('Volume is base area times height. The base area is ' + base + ' cm².', base + ' × ', ['?', 'height'], ' = ' + V),
          x('Work backward with division. ' + V + ' ÷ ' + base + ' = ' + h + '.', V + ' ÷ ' + base + ' = ', [String(h), 'height']),
          x('Check. ' + base + ' × ' + h + ' = ' + V + '.', base + ' × ' + h + ' = ', [String(V), 'volume back']),
          x('The box is ' + h + ' cm high.', [h + ' cm', 'answer'])
        ]
      });
    } },

    { id: 'composite', level: 5, name: 'Two boxes joined', make: function () {
      var w = R.int(2, 6), h = R.int(2, 6), la = R.int(3, 8), lb = R.int(2, 6), hb = R.int(2, 6);
      var va = la * w * h, vb = lb * w * hb, ans = va + vb;
      return N({
        skill: 'Volume of two boxes joined', prompt: 'A solid is made of two boxes stuck together. Box A is ' + la + ' cm long, ' + w + ' cm wide and ' + h + ' cm high. Box B is ' + lb + ' cm long, ' + w + ' cm wide and ' + hb + ' cm high. What is the total volume in cm³?', answer: ans,
        traps: [T(va, 'That is only Box A. Add the volume of Box B too.'), T(vb, 'That is only Box B. Add the volume of Box A too.'), T(va * vb, 'You multiplied the two volumes. Two boxes joined together need their volumes ADDED.')],
        work: 'Box A: ' + la + ' × ' + w + ' × ' + h + ' = ' + va + '. Box B: ' + lb + ' × ' + w + ' × ' + hb + ' = ' + vb + '. ' + va + ' + ' + vb + ' = ' + ans + ' cm³.', plain: 'Find each box on its own. Then add the two volumes.',
        teach: [
          x('Split the solid into its two boxes. We find each volume and then add.', ['Box A', 'first'], ' + ', ['Box B', 'second']),
          x('Box A: ' + la + ' × ' + w + ' × ' + h + ' = ' + va + '.', la + ' × ' + w + ' × ' + h + ' = ', [va + ' cm³', 'Box A']),
          x('Box B: ' + lb + ' × ' + w + ' × ' + hb + ' = ' + vb + '.', lb + ' × ' + w + ' × ' + hb + ' = ', [vb + ' cm³', 'Box B']),
          x('Add them. ' + va + ' + ' + vb + ' = ' + ans + '.', va + ' + ' + vb + ' = ', [ans + ' cm³', 'total volume'])
        ]
      });
    } },

    { id: 'water', level: 5, name: 'Water level in a tank', make: function () {
      var pairs = [[10, 10], [10, 20], [20, 20], [20, 25], [25, 40], [20, 50], [10, 25], [40, 50]], l = 20, w = 20, n = 4, h = 10;
      for (var t = 0; t < 400; t++) {
        var p = R.pick(pairs); l = p[0]; w = p[1];
        h = R.int(4, 30);
        var v = l * w * h;
        if (v % 1000 === 0 && v / 1000 <= 30) { n = v / 1000; break; }
        l = 20; w = 20; h = 10; n = 4;
      }
      var base = l * w, V = n * 1000;
      return N({
        skill: 'Water level in a tank', prompt: 'A tank has a base that is ' + l + ' cm by ' + w + ' cm. ' + n + ' L of water is poured in. How many cm deep is the water?', answer: h,
        traps: [T(V, 'That is the volume in cm³. Divide it by the base area ' + base + ' to find the depth.'), T(n, 'That is the number of liters. Change liters into cm³ first, then divide by the base area.'), T(V / l, 'You divided by only one side. Divide by the whole base area, ' + l + ' × ' + w + '.')],
        work: n + ' L = ' + R.fmt(V) + ' cm³. Base ' + l + ' × ' + w + ' = ' + base + '. ' + R.fmt(V) + ' ÷ ' + base + ' = ' + h + ' cm.', plain: 'Change liters to cm³. Divide by the base area to find the water depth.',
        teach: [
          x('First change liters into cm³. Multiply by 1000.', n + ' × 1000 = ', [R.fmt(V) + ' cm³', 'water volume']),
          x('Find the base area. ' + l + ' × ' + w + ' = ' + base + '.', l + ' × ' + w + ' = ', [base + ' cm²', 'base area']),
          x('Water volume is base area times depth. ' + base + ' × ? = ' + R.fmt(V) + '.', base + ' × ', ['?', 'depth'], ' = ' + R.fmt(V)),
          x('Divide. ' + R.fmt(V) + ' ÷ ' + base + ' = ' + h + '.', R.fmt(V) + ' ÷ ' + base + ' = ', [h + ' cm', 'water depth']),
          x('Check. ' + l + ' × ' + w + ' × ' + h + ' = ' + R.fmt(V) + ' cm³, which is ' + n + ' L.', l + ' × ' + w + ' × ' + h + ' = ', [R.fmt(V) + ' cm³', 'it works'])
        ]
      });
    } },

    { id: 'cutout', level: 6, name: 'Volume with a piece cut out', make: function () {
      var L = R.int(5, 10), W = R.int(4, 8), H = R.int(3, 8), a = R.int(2, L - 2), b = R.int(2, W - 2), c = R.int(1, H - 1);
      var big = L * W * H, small = a * b * c, ans = big - small;
      return N({
        skill: 'Volume with a piece cut out', prompt: 'A block is ' + L + ' cm long, ' + W + ' cm wide and ' + H + ' cm high. A corner piece that is ' + a + ' cm long, ' + b + ' cm wide and ' + c + ' cm high is cut out. What volume is left, in cm³?', answer: ans,
        traps: [T(big, 'That is the volume of the whole block before the cut. Take away the piece that was removed.'), T(small, 'That is the piece that was cut out. We want what is left.'), T(big + small, 'You added. The piece was cut away, so take it out.')],
        work: L + ' × ' + W + ' × ' + H + ' = ' + big + '. ' + a + ' × ' + b + ' × ' + c + ' = ' + small + '. ' + big + ' − ' + small + ' = ' + ans + ' cm³.', plain: 'Find the whole block. Find the piece that is gone. Take the piece away.',
        teach: [
          x('Find the whole block first. ' + L + ' × ' + W + ' × ' + H + ' = ' + big + '.', L + ' × ' + W + ' × ' + H + ' = ', [big + ' cm³', 'whole block']),
          x('Now the piece that is cut out. ' + a + ' × ' + b + ' × ' + c + ' = ' + small + '.', a + ' × ' + b + ' × ' + c + ' = ', [small + ' cm³', 'cut piece']),
          x('Take the piece away from the block. ' + big + ' − ' + small + ' = ' + ans + '.', big + ' − ' + small + ' = ', [ans + ' cm³', 'left']),
          x('Check. The answer is less than the block, ' + big + ', so it makes sense.', [String(ans), 'less than ' + big])
        ]
      });
    } },

    { id: 'packing', level: 6, name: 'Boxes packed in a crate', make: function () {
      var a = R.int(2, 5), b = R.int(2, 5), c = R.int(2, 5), m1 = R.int(2, 5), m2 = R.int(2, 4), m3 = R.int(2, 4);
      var L = a * m1, W = b * m2, H = c * m3, crate = L * W * H, small = a * b * c, ans = m1 * m2 * m3;
      return N({
        skill: 'Boxes packed in a crate', prompt: 'A crate is ' + L + ' cm long, ' + W + ' cm wide and ' + H + ' cm high. Small boxes that are ' + a + ' cm by ' + b + ' cm by ' + c + ' cm are packed inside with no gaps. How many small boxes fit in the crate?', answer: ans,
        traps: [T(crate, 'That is the volume of the crate. We want how many small boxes fit in it.'), T(m1 + m2 + m3, 'You added the boxes along each edge. Multiply them to fill the whole crate.'), T(small, 'That is the volume of one small box. Divide the crate volume by it.')],
        work: 'Crate ' + L + ' × ' + W + ' × ' + H + ' = ' + crate + ' cm³. Small box ' + a + ' × ' + b + ' × ' + c + ' = ' + small + ' cm³. ' + crate + ' ÷ ' + small + ' = ' + ans + '.', plain: 'Divide the volume of the crate by the volume of one small box.',
        teach: [
          x('Find the volume of the crate. ' + L + ' × ' + W + ' × ' + H + ' = ' + crate + '.', L + ' × ' + W + ' × ' + H + ' = ', [crate + ' cm³', 'crate']),
          x('Find the volume of one small box. ' + a + ' × ' + b + ' × ' + c + ' = ' + small + '.', a + ' × ' + b + ' × ' + c + ' = ', [small + ' cm³', 'small box']),
          x('See how many small boxes fill the crate. Divide. ' + crate + ' ÷ ' + small + ' = ' + ans + '.', crate + ' ÷ ' + small + ' = ', [String(ans), 'boxes']),
          x('Check by counting along each edge. ' + m1 + ' along the length, ' + m2 + ' along the width and ' + m3 + ' up.', m1 + ' × ' + m2 + ' × ' + m3 + ' = ', [String(ans), 'same answer'])
        ]
      });
    } }
  ]);
})();
