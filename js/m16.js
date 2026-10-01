/* Module 16: 2D Shapes and 3D Solids. Lessons, vocabulary and question skills. */
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
      if (!/^\d+(\.\d+)?$|^\d+\/\d+$/.test(s) || !isFinite(v) || Math.abs(v - a) < 1e-9 || seen[s]) return false;
      seen[s] = true; t.value = s; return true;
    });
    return Q.num(o);
  }
  function plur(n, w, pl) { return n + ' ' + (n === 1 ? w : (pl || w + 's')); }
  var NAMES = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon' };
  var BASE = { 3: 'triangular', 4: 'square', 5: 'pentagonal', 6: 'hexagonal', 7: 'heptagonal', 8: 'octagonal' };
  var BASEN = { 3: 'triangle', 4: 'square', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon' };

  var ART = {
    3: ['    /\\', '   /  \\', '  /____\\'],
    4: [' __________', '|          |', '|__________|'],
    5: ['     /\\', '    /  \\', '   /    \\', '   \\    /', '    \\__/'],
    6: ['    ______', '   /      \\', '  /        \\', '  \\        /', '   \\______/']
  };
  var CUBE = ['   ________', '  /       /|', ' /_______/ |', ' |       | |', ' |       | /', ' |_______|/'];

  /* Solids. A prism with an n sided base has n + 2 faces, 3n edges and 2n vertices.
     A pyramid with an n sided base has n + 1 faces, 2n edges and n + 1 vertices. */
  function prism(n, name) { return { name: name || BASE[n] + ' prism', kind: 'prism', n: n, F: n + 2, E: 3 * n, V: 2 * n }; }
  function pyramid(n, name) { return { name: name || BASE[n] + ' pyramid', kind: 'pyramid', n: n, F: n + 1, E: 2 * n, V: n + 1 }; }
  var CUBEs = prism(4, 'cube'), RPRISM = prism(4, 'rectangular prism');
  var SOLIDS = [CUBEs, RPRISM, prism(3), prism(5), prism(6), pyramid(3, 'triangular pyramid'), pyramid(4, 'square pyramid'), pyramid(5), pyramid(6)];
  var LIST = SOLIDS.filter(function (s) { return s.name !== 'cube'; });

  function partsOf(s) {
    /* Words that describe how to count each thing for this solid. */
    var n = s.n, bn = BASEN[n], b = n === 4 && s.name === 'cube' ? 'square' : (n === 4 ? 'rectangle' : bn);
    if (s.kind === 'prism') {
      return {
        F: 'Two bases (' + b + 's) plus ' + n + ' side faces: 2 + ' + n + ' = ' + s.F + '.',
        E: n + ' edges around the top, ' + n + ' around the bottom, and ' + n + ' standing edges: ' + n + ' + ' + n + ' + ' + n + ' = ' + s.E + '.',
        V: n + ' corners on the top and ' + n + ' on the bottom: ' + n + ' + ' + n + ' = ' + s.V + '.'
      };
    }
    return {
      F: 'One base (a ' + bn + ') plus ' + n + ' triangle faces: 1 + ' + n + ' = ' + s.F + '.',
      E: n + ' edges around the base and ' + n + ' edges going up to the point: ' + n + ' + ' + n + ' = ' + s.E + '.',
      V: n + ' corners on the base and 1 point at the top: ' + n + ' + 1 = ' + s.V + '.'
    };
  }
  var WORD = { F: 'faces', E: 'edges', V: 'vertices' };
  function countSteps(s, key) {
    var parts = partsOf(s), st = [];
    st.push(x('A ' + s.name + ' is a ' + (s.kind === 'prism' ? 'prism with two matching bases and rectangle sides.' : 'pyramid with one base and triangle sides that meet at a point.') + ' We count its ' + WORD[key] + '.', [s.name, 'solid'], ' → ', [WORD[key], 'count']));
    st.push(note('Here is how to count each part of a ' + s.name + '.', 'Counting a ' + s.name, ['Faces: ' + parts.F, 'Edges: ' + parts.E, 'Vertices: ' + parts.V]));
    st.push(x('We need the ' + WORD[key] + '. ' + parts[key], [String(s[key]), WORD[key]]));
    st.push(x('So a ' + s.name + ' has ' + s[key] + ' ' + WORD[key] + '.', s.name + ': ', [String(s[key]), WORD[key]]));
    st.push(note('Quick check with the Euler rule. Faces plus vertices should be 2 more than edges.', 'Check', [s.F + ' faces + ' + s.V + ' vertices = ' + (s.F + s.V), (s.E + 2) + ' is 2 more than ' + s.E + ' edges', 'It matches, so the counts fit']));
    return st;
  }

  /* ---------- Vocabulary ---------- */
  window.MATH_VOCAB[16] = [
    { w: 'Polygon', m: 'A flat closed shape made only of straight sides, like a triangle or a hexagon.' },
    { w: 'Vertex', m: 'A corner where two sides meet. More than one are called vertices.' },
    { w: 'Regular polygon', m: 'A polygon with all sides equal and all angles equal, like a square.' },
    { w: 'Line of symmetry', m: 'A fold line that cuts a shape into two halves that match exactly.' },
    { w: 'Face', m: 'A flat surface of a 3D solid. A cube has 6 square faces.' },
    { w: 'Edge', m: 'A line where two faces of a solid meet.' },
    { w: 'Prism and pyramid', m: 'A prism has two matching bases joined by rectangles. A pyramid has one base and triangles that meet at a point.' },
    { w: 'Net', m: 'A flat pattern that folds up to make a 3D solid.' }
  ];

  /* ---------- Lessons ---------- */
  window.MATH_LESSONS[16] = [
    { title: '1. Polygons and their sides',
      explain: [
        'A polygon is a flat shape that is closed and has only straight sides. Closed means there are no gaps. A circle is not a polygon because its edge is curved.',
        'A polygon is named by how many sides it has. Three sides is a triangle. Four sides is a quadrilateral. Five is a pentagon. Six is a hexagon. Seven is a heptagon. Eight is an octagon.',
        'The number of corners is always the same as the number of sides. A corner is called a vertex.'
      ],
      rule: 'Number of sides = number of vertices. The name comes from the number of sides.',
      mistake: 'A shape with a curved side is not a polygon. All the sides must be straight.',
      steps: [
        lines('This is a triangle. It has 3 straight sides and 3 corners.', ART[3], 0),
        lines('This is a quadrilateral. It has 4 sides and 4 corners. A rectangle is one kind.', ART[4], 0),
        lines('This is a pentagon. It has 5 sides and 5 corners.', ART[5], 0),
        lines('This is a hexagon. It has 6 sides and 6 corners.', ART[6], 0),
        note('Learn these names.', 'Polygon names', ['3 sides: triangle', '4 sides: quadrilateral', '5 sides: pentagon', '6 sides: hexagon', '7 sides: heptagon', '8 sides: octagon']),
        x('Count the sides of a stop sign. It has 8, so it is an octagon. It also has 8 vertices.', ['8', 'sides'], ' = ', ['8', 'vertices'])
      ] },

    { title: '2. Regular and irregular polygons',
      explain: [
        'A regular polygon has all its sides the same length and all its angles the same size. A square is regular. A stop sign is a regular octagon.',
        'An irregular polygon does not have all sides equal or all angles equal. A rectangle that is not a square is irregular, because its sides are different lengths.',
        'Both need to be true for a regular polygon. A rhombus has 4 equal sides, but its angles are not all equal, so it is irregular.'
      ],
      rule: 'Regular means equal sides AND equal angles. If either one is not equal, it is irregular.',
      mistake: 'A rectangle is not a regular polygon unless it is a square. Equal angles alone are not enough.',
      steps: [
        lines('Here is a square. All 4 sides are equal. All 4 angles are right angles.', ART[4], 0),
        x('Equal sides and equal angles means the square is a regular polygon.', ['equal sides', 'yes'], ' and ', ['equal angles', 'yes'], ' → ', ['regular', 'answer']),
        x('Now a rectangle 6 cm long and 3 cm wide. All 4 angles are right angles, so the angles are equal.', ['equal angles', 'yes']),
        x('But the sides are 6, 3, 6 and 3. They are not all equal. So it is irregular.', ['equal sides', 'no'], ' → ', ['irregular', 'answer']),
        x('A triangle with sides 5, 5 and 5 has equal sides and 3 equal angles. It is a regular triangle.', ['5, 5, 5', 'equal sides'], ' → ', ['regular', 'answer']),
        note('Use two questions.', 'Regular check', ['Are all the sides equal?', 'Are all the angles equal?', 'Two yes answers: regular', 'Any no answer: irregular'])
      ] },

    { title: '3. Triangles by their sides',
      explain: [
        'We can sort triangles by looking at how long their sides are.',
        'An equilateral triangle has 3 equal sides. An isosceles triangle has exactly 2 equal sides. A scalene triangle has no equal sides. All three sides are different.',
        'Just measure or read the three side lengths and count how many are the same.'
      ],
      rule: 'Equilateral: 3 equal sides. Isosceles: 2 equal sides. Scalene: 0 equal sides.',
      mistake: 'Do not say a triangle with sides 4, 4 and 4 is isosceles. Three equal sides is equilateral.',
      steps: [
        lines('An equilateral triangle. Every side is 5 cm.', ['    /\\', '   /  \\  5 cm each', '  /____\\'], 0),
        x('Sides 5, 5 and 5. All three are the same. That is equilateral.', ['5, 5, 5', '3 equal'], ' → ', ['equilateral', 'name']),
        x('Now sides 6, 6 and 4. Two are the same and one is different.', ['6, 6, 4', '2 equal'], ' → ', ['isosceles', 'name']),
        x('Now sides 3, 4 and 5. Every side is different.', ['3, 4, 5', '0 equal'], ' → ', ['scalene', 'name']),
        note('Remember the three names.', 'Triangles by sides', ['Equilateral: all 3 sides equal', 'Isosceles: exactly 2 sides equal', 'Scalene: no sides equal'])
      ] },

    { title: '4. Triangles by their angles',
      explain: [
        'We can also sort triangles by their angles. A right triangle has one right angle, which is exactly 90°. An acute triangle has three angles that are all less than 90°. An obtuse triangle has one angle that is more than 90°.',
        'The three angles inside any triangle always add up to 180°. This helps you find a missing angle.',
        'A triangle can have only one right angle or one obtuse angle. There is not enough room for two.'
      ],
      rule: 'Angles in a triangle add to 180°. Right: one 90°. Acute: all less than 90°. Obtuse: one more than 90°.',
      mistake: 'Do not forget to check the biggest angle. Only the biggest angle can be 90° or more.',
      steps: [
        x('The three angles in a triangle add to 180°. Let us sort a triangle with angles 90°, 40° and 50°.', ['90°', 'angle'], ' + ', ['40°', 'angle'], ' + ', ['50°', 'angle'], ' = 180°'),
        x('One angle is exactly 90°. That is a right triangle.', ['90°', 'right angle'], ' → ', ['right triangle', 'name']),
        x('Now angles 60°, 70° and 50°. The biggest is 70°, which is less than 90°. All are acute.', ['70°', 'biggest'], ' < 90° → ', ['acute', 'name']),
        x('Now angles 30°, 40° and 110°. The biggest is 110°, which is more than 90°. That is obtuse.', ['110°', 'biggest'], ' > 90° → ', ['obtuse', 'name']),
        x('Find a missing angle. Two angles are 50° and 60°. First add them: 50 + 60 = 110.', '50 + 60 = ', ['110', 'so far']),
        x('Take that from 180. 180 − 110 = 70. The missing angle is 70°.', '180 − 110 = ', ['70°', 'missing angle'])
      ] },

    { title: '5. The quadrilateral family',
      explain: [
        'A quadrilateral has 4 sides. There are many kinds, and their names depend on parallel sides, equal sides and right angles. Parallel sides stay the same distance apart and never meet.',
        'A rectangle has 4 right angles and opposite sides equal. A square has 4 equal sides and 4 right angles. A rhombus has 4 equal sides but no right angles. A parallelogram has two pairs of parallel sides.',
        'A trapezoid has exactly one pair of parallel sides. A kite has two pairs of equal sides that sit next to each other.'
      ],
      rule: 'Look for parallel sides, equal sides and right angles. Those clues give the name.',
      mistake: 'A square is also a rectangle, and it is also a rhombus. It has all their clues at the same time.',
      steps: [
        lines('A square. 4 equal sides and 4 right angles.', ART[4], 0),
        lines('A rectangle. 4 right angles. Opposite sides are equal and parallel.', [' ________________', '|                |', '|________________|'], 0),
        lines('A rhombus. 4 equal sides. Opposite sides are parallel. The angles are not right angles.', ['     ______', '    /     /', '   /_____/'], 0),
        lines('A parallelogram. Two pairs of parallel sides. Opposite sides are equal.', ['    ___________', '   /          /', '  /__________/'], 0),
        lines('A trapezoid. Exactly one pair of parallel sides. The top and the bottom are parallel.', ['     ______', '    /      \\', '   /________\\'], 0),
        note('Here are the clues in one place.', 'Quadrilateral clues', ['Square: 4 equal sides, 4 right angles', 'Rectangle: 4 right angles, sides not all equal', 'Rhombus: 4 equal sides, no right angles', 'Parallelogram: 2 pairs of parallel sides', 'Trapezoid: exactly 1 pair of parallel sides', 'Kite: 2 pairs of equal sides next to each other'])
      ] },

    { title: '6. Naming a shape from clues',
      explain: [
        'Sometimes you do not see a picture. You get clues in words, and you have to work out the shape.',
        'Go through the clues one at a time. Cross out the shapes that do not fit. Keep the shape that fits every clue.',
        'The most powerful clues are right angles, equal sides and parallel sides.'
      ],
      rule: 'Use every clue. The shape must match all of them.',
      mistake: 'Do not stop after one clue. Four right angles could be a square or a rectangle. You need the side clue too.',
      steps: [
        x('Clue set one. A shape has 4 sides, 4 right angles, and its sides are NOT all equal.', ['4 sides', 'quadrilateral'], ' ', ['4 right angles', 'clue'], ' ', ['sides not equal', 'clue']),
        x('4 right angles means square or rectangle. Sides not all equal cuts out the square.', ['rectangle', 'answer']),
        x('Clue set two. A shape has 4 equal sides, and no right angles.', ['4 equal sides', 'clue'], ' ', ['no right angles', 'clue']),
        x('4 equal sides means square or rhombus. No right angles cuts out the square.', ['rhombus', 'answer']),
        x('Clue set three. A shape has exactly one pair of parallel sides.', ['exactly 1 pair parallel', 'clue'], ' → ', ['trapezoid', 'answer']),
        x('Clue set four. A shape has two pairs of parallel sides, no right angles, and the sides are not all equal.', ['2 pairs parallel', 'clue'], ' → ', ['parallelogram', 'answer'])
      ] },

    { title: '7. Lines of symmetry',
      explain: [
        'A line of symmetry is a fold line. If you fold the shape along the line, the two halves match exactly, edge on edge.',
        'To find lines of symmetry, imagine folding the shape in different ways. Count the folds that work.',
        'Some shapes have many lines, and some have none. A regular polygon has as many lines of symmetry as it has sides.'
      ],
      rule: 'A regular polygon has as many lines of symmetry as sides. Test other shapes by folding.',
      mistake: 'A rectangle has 2 lines of symmetry, not 4. Folding along a diagonal does not make the halves match.',
      steps: [
        lines('Here is a rectangle. Fold it from left to right down the middle. The halves match. That is line one.', [' __________', '|     :    |', '|     :    |', '|_____:____|'], 0),
        lines('Fold it from top to bottom across the middle. The halves match. That is line two.', [' __________', '|          |', '|..........|', '|__________|'], 0),
        x('Now try folding corner to corner. The halves do not match. So a rectangle has 2 lines of symmetry.', ['rectangle', 'shape'], ' → ', ['2', 'lines']),
        x('An equilateral triangle has 3 lines. One goes from each corner to the middle of the opposite side.', ['equilateral triangle', 'shape'], ' → ', ['3', 'lines']),
        x('A square has 4 lines: across, up and down, and two corner to corner.', ['square', 'shape'], ' → ', ['4', 'lines']),
        x('A scalene triangle has no equal sides, so no fold works. It has 0 lines.', ['scalene triangle', 'shape'], ' → ', ['0', 'lines']),
        note('Learn these.', 'Lines of symmetry', ['Regular polygon: same as the number of sides', 'Rectangle (not a square): 2', 'Rhombus (not a square): 2', 'Parallelogram (not a rectangle): 0', 'Isosceles triangle: 1', 'Kite: 1'])
      ] },

    { title: '8. Faces, edges and vertices',
      explain: [
        'A 3D solid takes up space. It has length, width and height. We describe solids by counting three things.',
        'A face is a flat surface. An edge is a line where two faces meet. A vertex is a corner where edges meet.',
        'A cube is a good solid to start with. It has 6 faces, 12 edges and 8 vertices.'
      ],
      rule: 'Faces are flat surfaces. Edges are where faces meet. Vertices are corners.',
      mistake: 'Do not mix up edges and vertices. Edges are lines. Vertices are points.',
      steps: [
        lines('This is a cube. Look at the flat surfaces. Each one is a square face.', CUBE, 0),
        x('Count the faces. The top, the bottom, the front, the back, the left and the right. That is 6 faces.', ['6', 'faces']),
        x('Count the edges. There are 4 on the top, 4 on the bottom and 4 standing up. 4 + 4 + 4 = 12.', '4 + 4 + 4 = ', ['12', 'edges']),
        x('Count the vertices. There are 4 corners on the top and 4 on the bottom. 4 + 4 = 8.', '4 + 4 = ', ['8', 'vertices']),
        note('A cube in numbers.', 'Cube', ['6 faces, all squares', '12 edges', '8 vertices'])
      ] },

    { title: '9. Prisms and pyramids',
      explain: [
        'A prism has two matching bases with the same shape, joined by rectangle faces. It is named by its base. A triangular prism has triangle bases.',
        'A pyramid has one base. The other faces are triangles that meet at one point at the top. It is named by its base too.',
        'You can count faces, edges and vertices of a solid by using the number of sides of its base. Let us call that number n.'
      ],
      rule: 'Prism: n + 2 faces, 3n edges, 2n vertices. Pyramid: n + 1 faces, 2n edges, n + 1 vertices.',
      mistake: 'Do not forget the bases. A triangular prism has 3 rectangles plus 2 triangles, which is 5 faces.',
      steps: [
        x('Start with a triangular prism. Its base is a triangle, so n = 3.', ['triangular prism', 'solid'], ' → n = ', ['3', 'base sides']),
        x('Faces: 2 triangle bases plus 3 rectangles. 2 + 3 = 5.', '2 + 3 = ', ['5', 'faces']),
        x('Edges: 3 on top, 3 on the bottom and 3 standing up. 3 + 3 + 3 = 9.', '3 + 3 + 3 = ', ['9', 'edges']),
        x('Vertices: 3 corners on top and 3 on the bottom. 3 + 3 = 6.', '3 + 3 = ', ['6', 'vertices']),
        x('Now a square pyramid. Its base is a square, so n = 4. Faces: 1 base plus 4 triangles. 1 + 4 = 5.', '1 + 4 = ', ['5', 'faces']),
        x('Edges: 4 around the base and 4 going up to the point. 4 + 4 = 8.', '4 + 4 = ', ['8', 'edges']),
        x('Vertices: 4 on the base and 1 at the top. 4 + 1 = 5.', '4 + 1 = ', ['5', 'vertices'])
      ] },

    { title: '10. Cylinders, cones and spheres',
      explain: [
        'Some solids have curved surfaces. A curved surface is not a face, because a face must be flat.',
        'A cylinder has 2 flat faces that are circles, and 1 curved surface. A can of soup is a cylinder. A cone has 1 flat circle face, 1 curved surface and 1 vertex at the point. An ice cream cone is a cone.',
        'A sphere has no flat faces, no edges and no vertices. A basketball is a sphere. A sphere can roll in every direction.'
      ],
      rule: 'Cylinder: 2 flat faces. Cone: 1 flat face and 1 vertex. Sphere: 0 flat faces.',
      mistake: 'The curved surface is not counted as a flat face. A cylinder has 2 flat faces, not 3.',
      steps: [
        lines('A cylinder looks like a soup can. The top and the bottom are flat circles.', ['    _____', '   (     )', '   |     |', '   |     |', '   (_____)'], 0),
        x('It has 2 flat faces and 1 curved surface. Only the flat ones are called faces.', ['2', 'flat faces'], ' + ', ['1', 'curved surface']),
        lines('A cone has a round flat bottom and a point at the top.', ['     /\\', '    /  \\', '   /    \\', '  (______)'], 0),
        x('It has 1 flat face, 1 curved surface and 1 vertex at the point.', ['1', 'flat face'], ' ', ['1', 'vertex']),
        lines('A sphere is round like a ball.', ['    ___', '  /     \\', ' |       |', '  \\_____/'], 0),
        x('A sphere has no flat faces, no edges and no vertices. Everything is curved.', ['0', 'flat faces'], ' ', ['0', 'edges'], ' ', ['0', 'vertices'])
      ] },

    { title: '11. Nets of solids',
      explain: [
        'A net is a flat pattern that folds up into a 3D solid. Imagine cutting a box along some edges and flattening it. You get a net.',
        'The net shows every face of the solid. To check a net, count its shapes. A cube needs 6 squares.',
        'A triangular prism needs 2 triangles and 3 rectangles. A square pyramid needs 1 square and 4 triangles.'
      ],
      rule: 'The net has one shape for every face of the solid.',
      mistake: 'Do not forget the base. A square pyramid has 4 triangles AND 1 square, which is 5 shapes.',
      steps: [
        grid('This is a net of a cube. It is a cross shape made of squares.', 4, 3, [{ c0: 1, c1: 2, r0: 0, r1: 1, cls: 'bg-indigo-400' }, { c0: 0, c1: 4, r0: 1, r1: 2, cls: 'bg-indigo-400' }, { c0: 1, c1: 2, r0: 2, r1: 3, cls: 'bg-indigo-400' }]),
        x('Count the squares: 1 on top, 4 in the middle row, 1 on the bottom. 1 + 4 + 1 = 6.', '1 + 4 + 1 = ', ['6', 'squares']),
        x('A cube has 6 faces, so the net must have 6 squares. It matches.', ['6 faces', 'cube'], ' = ', ['6 squares', 'net']),
        x('A net for a triangular prism has 2 triangles for the bases and 3 rectangles for the sides.', ['2', 'triangles'], ' + ', ['3', 'rectangles'], ' = 5 faces'),
        x('A net for a square pyramid has 1 square base and 4 triangles.', ['1', 'square'], ' + ', ['4', 'triangles'], ' = 5 faces'),
        x('A net for a cylinder has 2 circles and 1 rectangle that wraps around the middle.', ['2', 'circles'], ' + ', ['1', 'rectangle'])
      ] },

    { title: '12. Checking counts with the Euler rule',
      explain: [
        'There is a neat pattern that works for every solid with flat faces. Add the faces and the vertices. The total is always 2 more than the number of edges.',
        'In short, faces plus vertices minus edges equals 2. Leonhard Euler was the mathematician who noticed this.',
        'You can use it to check your counting. You can also use it to find a missing number.'
      ],
      rule: 'Faces + vertices − edges = 2. So edges = faces + vertices − 2.',
      mistake: 'Do not forget to take away the 2. Faces plus vertices is not the number of edges.',
      steps: [
        x('Test it on a cube. Faces 6, vertices 8, edges 12.', ['6', 'faces'], ' + ', ['8', 'vertices'], ' − ', ['12', 'edges']),
        x('6 + 8 = 14. Then 14 − 12 = 2. The rule works.', '6 + 8 − 12 = ', ['2', 'always 2']),
        x('Now use it to find a missing number. A solid has 5 faces and 5 vertices. How many edges?', ['5', 'faces'], ' + ', ['5', 'vertices'], ' → edges?'),
        x('Add faces and vertices. 5 + 5 = 10.', '5 + 5 = ', ['10', 'faces plus vertices']),
        x('Take away 2. 10 − 2 = 8. It has 8 edges. That is a square pyramid.', '10 − 2 = ', ['8', 'edges']),
        x('Another one. A solid has 6 faces and 9 edges. Vertices = edges − faces + 2 = 9 − 6 + 2 = 5.', '9 − 6 + 2 = ', ['5', 'vertices'])
      ] }
  ];

  /* ---------- Question skills ---------- */
  var SK = '2D shapes and 3D solids';
  var SYM = [
    { n: 'square', a: 4, t: 2, ts: 'A square has 4 lines of symmetry. Two go across and up and down, and two go corner to corner.', f: ['Fold left to right: matches', 'Fold top to bottom: matches', 'Fold corner to corner: matches, both ways'] },
    { n: 'rectangle that is not a square', a: 2, t: 4, ts: 'Only 2 folds work. Folding corner to corner does not make the halves match.', f: ['Fold left to right: matches', 'Fold top to bottom: matches', 'Fold corner to corner: does not match'] },
    { n: 'rhombus that is not a square', a: 2, t: 4, ts: 'A rhombus has 2 lines of symmetry. They go corner to corner. Folding across the middle does not match.', f: ['Fold corner to opposite corner: matches, both ways', 'Fold across the middle of the sides: does not match'] },
    { n: 'parallelogram that is not a rectangle', a: 0, t: 2, ts: 'A slanted parallelogram has no fold that matches. It has 0 lines of symmetry.', f: ['Fold across the middle: does not match', 'Fold corner to corner: does not match'] },
    { n: 'equilateral triangle', a: 3, t: 1, ts: 'All three sides are equal, so a fold works from each corner. That gives 3 lines.', f: ['Fold from each corner to the middle of the opposite side: matches, 3 times'] },
    { n: 'isosceles triangle', a: 1, t: 3, ts: 'Only 1 fold works. It goes from the top corner to the middle of the different side.', f: ['Fold from the top corner to the middle of the bottom side: matches', 'The other folds do not match'] },
    { n: 'scalene triangle', a: 0, t: 1, ts: 'A scalene triangle has no equal sides, so no fold makes the halves match. It has 0 lines.', f: ['Every fold makes halves that do not match'] },
    { n: 'kite', a: 1, t: 2, ts: 'A kite has 1 line of symmetry. It goes along the long diagonal.', f: ['Fold along the long corner to corner line: matches', 'The other folds do not match'] }
  ];

  B.register(16, [

    { id: 'sides', level: 1, name: 'Sides and polygon names', make: function () {
      var n = R.int(3, 10);
      if (R.int(0, 2) > 0) {
        return N({
          skill: SK, prompt: R.pick(['How many sides does a ' + NAMES[n] + ' have?', 'A ' + NAMES[n] + ' is a polygon. How many sides does it have?', 'Rinka draws a ' + NAMES[n] + '. How many straight sides did she draw?']),
          answer: n, keyboard: 'numeric', placeholder: 'Type the number of sides',
          traps: [T(String(n + 1), 'Count again. The name tells the number of sides: ' + NAMES[n] + ' means ' + n + '.'), T(String(n - 1), 'Count again. The name tells the number of sides: ' + NAMES[n] + ' means ' + n + '.')],
          work: 'A ' + NAMES[n] + ' has ' + n + ' sides.', plain: 'The name of a polygon comes from how many sides it has.',
          teach: [
            x('We need the number of sides of a ' + NAMES[n] + '.', [NAMES[n], 'polygon'], ' → sides?'),
            note('Here are the polygon names in order.', 'Polygon names', ['3 triangle, 4 quadrilateral', '5 pentagon, 6 hexagon', '7 heptagon, 8 octagon', '9 nonagon, 10 decagon']),
            x('A ' + NAMES[n] + ' is the ' + n + ' sided polygon.', [NAMES[n], 'name'], ' = ', [String(n), 'sides']),
            x('So it has ' + n + ' sides.', [String(n), 'answer'])
          ]
        });
      }
      var others = R.shuffle([3, 4, 5, 6, 7, 8, 9, 10].filter(function (k) { return k !== n; })).slice(0, 3);
      var opts = [{ text: NAMES[n], ok: true }].concat(others.map(function (k) { return { text: NAMES[k], ok: false, trap: 'A ' + NAMES[k] + ' has ' + k + ' sides, not ' + n + '.' }; }));
      return Q.choice({
        skill: SK, prompt: 'A polygon has ' + n + ' straight sides. What is its name?', options: opts,
        work: 'A polygon with ' + n + ' sides is a ' + NAMES[n] + '.', plain: 'Match the number of sides to the polygon name.',
        teach: [
          x('We have a polygon with ' + n + ' sides. We need its name.', [String(n), 'sides'], ' → name?'),
          note('Here are the polygon names in order.', 'Polygon names', ['3 triangle, 4 quadrilateral', '5 pentagon, 6 hexagon', '7 heptagon, 8 octagon', '9 nonagon, 10 decagon']),
          x('Find ' + n + ' on the list. It is the ' + NAMES[n] + '.', [String(n), 'sides'], ' = ', [NAMES[n], 'name']),
          x('The name is ' + NAMES[n] + '.', [NAMES[n], 'answer'])
        ]
      });
    } },

    { id: 'vertices', level: 1, name: 'Vertices of a polygon', make: function () {
      var n = R.int(3, 10), v = R.int(0, 2);
      var p = v === 0 ? 'How many vertices does a ' + NAMES[n] + ' have?' : (v === 1 ? 'A polygon has ' + n + ' sides. How many vertices (corners) does it have?' : 'A polygon has ' + n + ' vertices. How many sides does it have?');
      return N({
        skill: SK, prompt: p, answer: n, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(n + 1), 'Count carefully. A polygon always has the same number of sides and vertices.'), T(String(2 * n), 'Each vertex is where two sides meet, and each side has two ends. But there are still only ' + n + ' corners.')],
        work: 'A polygon has the same number of sides and vertices. The answer is ' + n + '.',
        plain: 'Each corner is where two sides meet. Going around the shape, the corners and the sides match one for one.',
        teach: [
          x('A vertex is a corner. Two sides meet at each vertex.', ['vertex', 'corner']),
          lines('Look at a shape with ' + (n <= 6 ? n : 'many') + ' sides. Go around it. Every side ends at a corner.', ART[Math.min(Math.max(n, 3), 6)] || ART[6], 0),
          x('The number of corners is always the same as the number of sides.', ['sides', 'number'], ' = ', ['vertices', 'same number']),
          x(v === 0 ? 'A ' + NAMES[n] + ' has ' + n + ' sides, so it has ' + n + ' vertices.' : 'The answer is ' + n + '.', [String(n), 'answer'])
        ]
      });
    } },

    { id: 'regirreg', level: 1, name: 'Regular or irregular', make: function () {
      var t = R.pick([
        ['A square', 'Regular polygon', 'A square has 4 equal sides and 4 equal angles.'],
        ['A rectangle that is not a square', 'Irregular polygon', 'Its sides are not all equal, so it is irregular.'],
        ['A triangle with sides 4 cm, 4 cm and 4 cm', 'Regular polygon', 'All 3 sides are equal, and so are all 3 angles.'],
        ['A triangle with sides 3 cm, 4 cm and 5 cm', 'Irregular polygon', 'The sides are different lengths, so it is irregular.'],
        ['A stop sign shape, with 8 equal sides and 8 equal angles', 'Regular polygon', 'Equal sides and equal angles make it regular.'],
        ['A closed shape with 5 straight sides of different lengths', 'Irregular polygon', 'The sides are not all equal, so it is irregular.'],
        ['A circle', 'Not a polygon', 'A polygon must have straight sides. A circle is curved.'],
        ['A shape with 4 sides where one side is curved', 'Not a polygon', 'All sides of a polygon must be straight.'],
        ['A shape made of 3 straight lines that do not close up', 'Not a polygon', 'A polygon must be closed, with no gaps.'],
        ['A hexagon with all 6 sides equal and all 6 angles equal', 'Regular polygon', 'Equal sides and equal angles make it regular.'],
        ['A rhombus that is not a square', 'Irregular polygon', 'Its sides are equal, but its angles are not all equal, so it is irregular.']
      ]);
      var all = ['Regular polygon', 'Irregular polygon', 'Not a polygon'];
      var opts = all.map(function (a) { return { text: a, ok: a === t[1], trap: a === t[1] ? undefined : t[2] }; });
      return Q.choice({
        skill: SK, prompt: R.pick(['Which best describes this shape? ' + t[0] + '.', 'Sort this shape. ' + t[0] + '.']), options: opts,
        work: t[2], plain: 'First ask if it is a closed shape with straight sides. Then ask if all sides and angles are equal.',
        teach: [
          x('Read the shape. ' + t[0] + '.', ['first', 'is it a polygon?']),
          x('A polygon is closed and has only straight sides.', ['closed', 'no gaps'], ' + ', ['straight', 'no curves']),
          x('If it is a polygon, check the sides and the angles. A regular polygon needs both to be equal.', ['equal sides', 'and'], ' ', ['equal angles', 'both']),
          x(t[2], [t[1], 'answer'])
        ]
      });
    } },

    { id: 'trisides', level: 2, name: 'Triangles by sides', make: function () {
      var k = R.int(0, 2), a, b, c, ans;
      if (k === 0) { a = R.int(3, 9); b = a; c = a; ans = 'Equilateral'; }
      else if (k === 1) { a = R.int(3, 9); b = a; c = R.int(2, 2 * a - 1); if (c === a) c = a + 1; ans = 'Isosceles'; }
      else { do { a = R.int(3, 6); b = a + R.int(1, 3); c = b + R.int(1, 3); } while (a + b <= c); ans = 'Scalene'; }
      var sides = R.shuffle([a, b, c]);
      var eq = ans === 'Equilateral' ? 3 : (ans === 'Isosceles' ? 2 : 0);
      var say = { Equilateral: 'Equilateral means all 3 sides are equal.', Isosceles: 'Isosceles means exactly 2 sides are equal.', Scalene: 'Scalene means no sides are equal.' };
      var opts = ['Equilateral', 'Isosceles', 'Scalene'].map(function (n) { return { text: n, ok: n === ans, trap: n === ans ? undefined : 'Look at the sides ' + sides.join(', ') + '. ' + say[n] + ' That does not match.' }; });
      return Q.choice({
        skill: SK, prompt: 'A triangle has sides of ' + sides[0] + ' cm, ' + sides[1] + ' cm and ' + sides[2] + ' cm. What kind of triangle is it, by its sides?', options: opts,
        work: 'The sides are ' + sides.join(', ') + '. ' + (eq === 0 ? 'None are equal' : eq + ' are equal') + ', so it is ' + ans.toLowerCase() + '.', plain: 'Count how many sides are the same length.',
        teach: [
          x('The three sides are ' + sides.join(', ') + ' cm.', [sides.join(', '), 'sides']),
          note('The three names.', 'Triangles by sides', ['Equilateral: 3 equal sides', 'Isosceles: exactly 2 equal sides', 'Scalene: no equal sides']),
          x('Count the equal sides. ' + (eq === 0 ? 'All three are different.' : eq === 3 ? 'All three are the same.' : 'Two are the same and one is different.'), [String(eq), 'equal sides']),
          x('So the triangle is ' + ans.toLowerCase() + '.', [ans, 'answer'])
        ]
      });
    } },

    { id: 'triangles', level: 2, name: 'Triangles by angles', make: function () {
      var k = R.int(0, 2), a, b, c, ans;
      if (k === 0) { a = 90; b = R.int(20, 70); c = 90 - b; ans = 'Right triangle'; }
      else if (k === 1) { do { a = R.int(40, 80); b = R.int(40, 80); c = 180 - a - b; } while (c >= 90 || c < 25); ans = 'Acute triangle'; }
      else { c = R.int(100, 140); a = R.int(15, (180 - c) - 15); b = 180 - c - a; ans = 'Obtuse triangle'; }
      var angs = R.shuffle([a, b, c]), big = Math.max(a, b, c);
      var say = { 'Right triangle': 'A right triangle has one angle of exactly 90°.', 'Acute triangle': 'An acute triangle has all angles less than 90°.', 'Obtuse triangle': 'An obtuse triangle has one angle more than 90°.' };
      var opts = ['Right triangle', 'Acute triangle', 'Obtuse triangle'].map(function (n) { return { text: n, ok: n === ans, trap: n === ans ? undefined : 'The biggest angle is ' + big + '°. ' + say[n] + ' That does not match.' }; });
      return Q.choice({
        skill: SK, prompt: 'A triangle has angles of ' + angs[0] + '°, ' + angs[1] + '° and ' + angs[2] + '°. What kind of triangle is it, by its angles?', options: opts,
        work: 'The biggest angle is ' + big + '°. ' + (big === 90 ? 'It is exactly 90°' : big < 90 ? 'It is less than 90°' : 'It is more than 90°') + ', so it is ' + ans.toLowerCase() + '.', plain: 'Look at the biggest angle and compare it with 90°.',
        teach: [
          x('The angles are ' + angs.join('°, ') + '°. They add to 180°.', [angs.join('° + ') + '°', 'add to 180°']),
          note('The three names.', 'Triangles by angles', ['Right: one angle of exactly 90°', 'Acute: all angles less than 90°', 'Obtuse: one angle more than 90°']),
          x('Find the biggest angle. It is ' + big + '°.', [big + '°', 'biggest']),
          x(big + '° compared with 90° is ' + (big === 90 ? 'equal' : big < 90 ? 'less' : 'more') + '. So it is ' + ans.toLowerCase() + '.', [ans, 'answer'])
        ]
      });
    } },

    { id: 'missingangle', level: 3, name: 'Missing angle', make: function () {
      var v = R.int(0, 2), a, b, c, ans, p, tot, given;
      if (v === 0) { do { a = R.int(30, 80); b = R.int(30, 80); } while (a + b >= 150); tot = 180; given = [a, b]; p = 'Two angles in a triangle are ' + a + '° and ' + b + '°. What is the third angle in degrees?'; }
      else if (v === 1) { a = 90; b = R.int(20, 70); tot = 180; given = [a, b]; p = 'A right triangle has a 90° angle and a ' + b + '° angle. What is the third angle in degrees?'; }
      else { do { a = R.int(60, 120); b = R.int(60, 110); c = R.int(60, 110); } while (a + b + c >= 330); tot = 360; given = [a, b, c]; p = 'Three angles in a quadrilateral are ' + a + '°, ' + b + '° and ' + c + '°. What is the fourth angle in degrees?'; }
      var sum = given.reduce(function (s, k) { return s + k; }, 0); ans = tot - sum;
      var shape = tot === 180 ? 'triangle' : 'quadrilateral';
      var trs = [T(String(sum), 'That is the sum of the angles you know. You still need to take it away from ' + tot + '.')];
      if (v === 1) trs.push(T(String(180 - b), 'You forgot the right angle. Take away both 90 and ' + b + ' from 180.'));
      return N({
        skill: SK, prompt: p, answer: ans, keyboard: 'numeric', placeholder: 'Type the angle',
        traps: trs, work: given.join(' + ') + ' = ' + sum + ', and ' + tot + ' − ' + sum + ' = ' + ans + '.', plain: 'The angles in a ' + shape + ' add to ' + tot + '°. Add what you know and take it from ' + tot + '.',
        teach: [
          x('The angles in a ' + shape + ' add to ' + tot + '°.', ['angles', 'in a ' + shape], ' = ', [tot + '°', 'total']),
          x('Add the angles we know. ' + given.join(' + ') + ' = ' + sum + '.', given.join(' + ') + ' = ', [String(sum), 'known angles']),
          x('Take that away from ' + tot + '. ' + tot + ' − ' + sum + ' = ' + ans + '.', tot + ' − ' + sum + ' = ', [String(ans), 'missing angle']),
          x('Check. ' + sum + ' + ' + ans + ' = ' + tot + '. It works.', sum + ' + ' + ans + ' = ', [String(tot), 'total'])
        ]
      });
    } },

    { id: 'quadname', level: 3, name: 'Name the quadrilateral', make: function () {
      var Q4 = [
        ['Square', 'It has 4 equal sides and 4 right angles.'],
        ['Rectangle', 'It has 4 right angles and opposite sides equal, but the sides are not all equal.'],
        ['Rhombus', 'It has 4 equal sides and opposite sides parallel, but it has no right angles.'],
        ['Parallelogram', 'It has 2 pairs of parallel sides and opposite sides equal, but the sides are not all equal and it has no right angles.'],
        ['Trapezoid', 'It has exactly one pair of parallel sides.'],
        ['Kite', 'It has two pairs of equal sides that sit next to each other, and it has no parallel sides.']
      ];
      var ans = R.pick(Q4), others = R.shuffle(Q4.filter(function (q) { return q[0] !== ans[0]; })).slice(0, 3);
      var opts = [{ text: ans[0], ok: true }].concat(others.map(function (q) { return { text: q[0], ok: false, trap: 'Check the clues again. ' + q[1].replace(/^It has/, 'A ' + q[0].toLowerCase() + ' has') + ' That is different from the clues in the question.' }; }));
      return Q.choice({
        skill: SK, prompt: 'A quadrilateral has these clues. ' + ans[1].replace(/^It has/, 'It has') + ' What is it?', options: opts,
        work: ans[1] + ' That describes a ' + ans[0].toLowerCase() + '.', plain: 'Match every clue to the shape. Use the equal sides, parallel sides and right angles.',
        teach: [
          x('Read the clues one at a time. ' + ans[1], ['clues', 'read them all']),
          note('Remember the family.', 'Quadrilateral clues', ['Square: 4 equal sides, 4 right angles', 'Rectangle: 4 right angles, sides not all equal', 'Rhombus: 4 equal sides, no right angles', 'Parallelogram: 2 pairs of parallel sides, no right angles, sides not all equal', 'Trapezoid: exactly 1 pair of parallel sides', 'Kite: 2 pairs of equal sides next to each other']),
          x('Cross out the shapes that do not fit every clue.', ['keep', 'the one that fits']),
          x('The shape that fits every clue is the ' + ans[0].toLowerCase() + '.', [ans[0], 'answer'])
        ]
      });
    } },

    { id: 'symcount', level: 3, name: 'Count lines of symmetry', make: function () {
      if (R.int(0, 2) === 0) {
        var n = R.pick([5, 6, 7, 8, 9, 10]);
        return N({
          skill: SK, prompt: 'How many lines of symmetry does a regular ' + NAMES[n] + ' have?', answer: n, keyboard: 'numeric', placeholder: 'Type a number',
          traps: [T(String(2 * n), 'That is too many. A regular polygon has one line of symmetry for each side, not two.'), T(String(n - 1), 'Count again. A regular polygon has one line of symmetry for each of its sides.')],
          work: 'A regular ' + NAMES[n] + ' has ' + n + ' sides, so it has ' + n + ' lines of symmetry.', plain: 'A regular polygon has as many fold lines as it has sides.',
          teach: [
            x('A line of symmetry is a fold line. The two halves must match exactly.', ['fold', 'halves match']),
            x('A regular polygon has equal sides and equal angles, so it can be folded in many ways.', ['regular', 'equal sides and angles']),
            x('There is one line of symmetry for each side. A ' + NAMES[n] + ' has ' + n + ' sides.', [String(n), 'sides'], ' → ', [String(n), 'lines']),
            note('Check with a smaller shape.', 'Small examples', ['Regular triangle: 3 sides, 3 lines', 'Square: 4 sides, 4 lines', 'Regular ' + NAMES[n] + ': ' + n + ' sides, ' + n + ' lines'])
          ]
        });
      }
      var s = R.pick(SYM);
      return N({
        skill: SK, prompt: 'How many lines of symmetry does a ' + s.n + ' have?', answer: s.a, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(s.t), s.ts)],
        work: 'A ' + s.n + ' has ' + s.a + ' ' + (s.a === 1 ? 'line' : 'lines') + ' of symmetry.', plain: 'Imagine folding the shape. Count the folds where the two halves match exactly.',
        teach: [
          x('A line of symmetry is a fold line. The two halves must match exactly.', ['fold', 'halves match']),
          note('Try the folds on a ' + s.n + '.', 'Fold tests', s.f),
          x('Count the folds that work. There ' + (s.a === 1 ? 'is ' : 'are ') + s.a + '.', [String(s.a), 'lines of symmetry']),
          x('A ' + s.n + ' has ' + s.a + ' ' + (s.a === 1 ? 'line' : 'lines') + ' of symmetry.', [String(s.a), 'answer'])
        ]
      });
    } },

    { id: 'solidcount', level: 2, name: 'Faces, edges and vertices of a solid', make: function () {
      var s = R.pick(SOLIDS), key = R.pick(['F', 'E', 'V']);
      var q = { F: 'faces', E: 'edges', V: 'vertices' }[key];
      var traps = ['F', 'E', 'V'].filter(function (k) { return k !== key; }).map(function (k) { return T(String(s[k]), 'That is the number of ' + WORD[k] + ' of a ' + s.name + '. The question asks about ' + q + '.'); });
      return N({
        skill: SK, prompt: R.pick(['How many ' + q + ' does a ' + s.name + ' have?', 'Count the ' + q + ' of a ' + s.name + '. How many are there?']),
        answer: s[key], keyboard: 'numeric', placeholder: 'Type a number', traps: traps,
        work: partsOf(s)[key], plain: 'Faces are flat surfaces, edges are lines where faces meet, and vertices are corners.',
        teach: countSteps(s, key)
      });
    } },

    { id: 'curved', level: 2, name: 'Cylinders, cones and spheres', make: function () {
      var t = R.int(0, 2);
      if (t === 0) {
        var it = R.pick([
          ['I have 2 flat faces that are circles and 1 curved surface. What solid am I?', 'Cylinder', 'A cylinder has 2 flat circle faces and a curved side.'],
          ['I have 1 flat circle face, 1 curved surface and 1 vertex. What solid am I?', 'Cone', 'A cone has one flat circle and a point.'],
          ['I have no flat faces, no edges and no vertices. What solid am I?', 'Sphere', 'A sphere is round everywhere.'],
          ['A can of soup is shaped like which solid?', 'Cylinder', 'A can has a flat circle on the top and bottom and a curved side.'],
          ['A basketball is shaped like which solid?', 'Sphere', 'A ball is round on every side.'],
          ['An ice cream cone is shaped like which solid?', 'Cone', 'An ice cream cone comes to a point and has a round opening.'],
          ['Which solid has a flat circle at one end and a point at the other end?', 'Cone', 'The point is the vertex of a cone.']
        ]);
        var opts = ['Cylinder', 'Cone', 'Sphere', 'Cube'].map(function (n) { return { text: n, ok: n === it[1], trap: n === it[1] ? undefined : 'Not quite. ' + ({ Cylinder: 'A cylinder has 2 flat circle faces and a curved side.', Cone: 'A cone has 1 flat circle face and 1 vertex.', Sphere: 'A sphere has no flat faces.', Cube: 'A cube has 6 flat square faces and no curved surface.' })[n] }; });
        return Q.choice({
          skill: SK, prompt: it[0], options: opts, work: it[2], plain: 'Think about flat faces, curved surfaces and points.',
          teach: [
            x('Read the clue. ' + it[0], ['clue', 'read']),
            note('Curved solids.', 'Cylinder, cone, sphere', ['Cylinder: 2 flat circles and 1 curved side', 'Cone: 1 flat circle, 1 curved side, 1 vertex', 'Sphere: no flat faces at all']),
            x(it[2], [it[1], 'match']),
            x('The answer is the ' + it[1].toLowerCase() + '.', [it[1], 'answer'])
          ]
        });
      }
      var e = R.pick([['cylinder', 2, 'A cylinder has a flat circle on the top and on the bottom.', 3], ['cone', 1, 'A cone has one flat circle at the bottom.', 2], ['sphere', 0, 'A sphere is all curved, so it has no flat faces.', 1], ['cylinder', 2, 'A cylinder has a flat circle on the top and on the bottom.', 3]]);
      return N({
        skill: SK, prompt: 'How many flat faces does a ' + e[0] + ' have?', answer: e[1], keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(e[3]), 'Do not count the curved surface. A face must be flat.')],
        work: e[2], plain: 'Only flat surfaces are called faces. A curved surface does not count.',
        teach: [
          x('A face is a flat surface. We only count flat ones.', ['face', 'flat']),
          x('Think about the ' + e[0] + '. ' + e[2], [e[0], 'solid']),
          x('The curved surface is not a flat face, so we leave it out.', ['curved', 'not counted']),
          x('A ' + e[0] + ' has ' + e[1] + ' flat ' + (e[1] === 1 ? 'face' : 'faces') + '.', [String(e[1]), 'answer'])
        ]
      });
    } },

    { id: 'identify', level: 4, name: 'Name the solid from clues', make: function () {
      var D = [
        ['Cube', 'It has 6 faces, and all of them are squares.', 'A cube has 6 square faces.'],
        ['Rectangular prism', 'It has 6 rectangle faces, and not all of them are squares.', 'A rectangular prism has 6 rectangle faces.'],
        ['Triangular prism', 'It has 5 faces. Two are triangles and three are rectangles.', 'A triangular prism has 2 triangles and 3 rectangles.'],
        ['Square pyramid', 'It has 5 faces. One is a square and four are triangles.', 'A square pyramid has 1 square and 4 triangles.'],
        ['Triangular pyramid', 'It has 4 faces, and all four are triangles.', 'A triangular pyramid has 4 triangle faces.'],
        ['Hexagonal prism', 'It has 8 faces. Two are hexagons and six are rectangles.', 'A hexagonal prism has 2 hexagons and 6 rectangles.'],
        ['Pentagonal prism', 'It has 7 faces. Two are pentagons and five are rectangles.', 'A pentagonal prism has 2 pentagons and 5 rectangles.'],
        ['Pentagonal pyramid', 'It has 6 faces. One is a pentagon and five are triangles.', 'A pentagonal pyramid has 1 pentagon and 5 triangles.'],
        ['Cylinder', 'It has 2 flat faces that are circles and one curved surface.', 'A cylinder has 2 flat circles and a curved side.'],
        ['Cone', 'It has 1 flat face that is a circle, and 1 vertex.', 'A cone has 1 flat circle and 1 vertex.']
      ];
      var ans = R.pick(D), others = R.shuffle(D.filter(function (d) { return d[0] !== ans[0]; })).slice(0, 3);
      var opts = [{ text: ans[0], ok: true }].concat(others.map(function (d) { return { text: d[0], ok: false, trap: 'Not this one. ' + d[2] }; }));
      return Q.choice({
        skill: SK, prompt: 'Which solid is it? ' + ans[1], options: opts, work: ans[2], plain: 'Count the faces and look at their shapes. Match them to the solid.',
        teach: [
          x('Read the clue. ' + ans[1], ['clue', 'faces']),
          note('Some solids and their faces.', 'Face facts', ['Prism: 2 matching bases and rectangle sides', 'Pyramid: 1 base and triangle sides', 'Cylinder: 2 circles and a curved side', 'Cone: 1 circle, a curved side and a point']),
          x('Match the faces to a solid. ' + ans[2], [ans[0], 'match']),
          x('The solid is a ' + ans[0].toLowerCase() + '.', [ans[0], 'answer'])
        ]
      });
    } },

    { id: 'nets', level: 4, name: 'Count shapes in a net', make: function () {
      var D = [
        ['cube', 'squares', 6, 'A cube has 6 faces, and every face is a square.', [['faces', 6]]],
        ['triangular prism', 'rectangles', 3, 'A triangular prism has 3 rectangle sides and 2 triangle bases.', [['triangles', 2], ['rectangles', 3]]],
        ['triangular prism', 'triangles', 2, 'A triangular prism has 3 rectangle sides and 2 triangle bases.', [['triangles', 2], ['rectangles', 3]]],
        ['square pyramid', 'triangles', 4, 'A square pyramid has 4 triangle sides and 1 square base.', [['triangles', 4], ['squares', 1]]],
        ['rectangular prism', 'rectangles', 6, 'A rectangular prism has 6 rectangle faces.', [['rectangles', 6]]],
        ['cylinder', 'circles', 2, 'A cylinder has 2 circles and 1 rectangle that wraps around.', [['circles', 2], ['rectangles', 1]]],
        ['pentagonal prism', 'rectangles', 5, 'A pentagonal prism has 5 rectangle sides and 2 pentagon bases.', [['pentagons', 2], ['rectangles', 5]]],
        ['hexagonal prism', 'rectangles', 6, 'A hexagonal prism has 6 rectangle sides and 2 hexagon bases.', [['hexagons', 2], ['rectangles', 6]]],
        ['triangular pyramid', 'triangles', 4, 'A triangular pyramid has 4 triangle faces in all.', [['triangles', 4]]]
      ];
      var d = R.pick(D), total = d[4].reduce(function (s, p) { return s + p[1]; }, 0);
      var traps = [T(String(total), 'That counts all the shapes in the net. The question asks only about the ' + d[1] + '.')];
      return N({
        skill: SK, prompt: 'A net folds up into a ' + d[0] + '. How many ' + d[1] + ' are in the net?', answer: d[2], keyboard: 'numeric', placeholder: 'Type a number', traps: traps,
        work: d[3], plain: 'A net has one flat shape for every face of the solid.',
        teach: (d[0] === 'cube' ? [grid('This is a net of a cube. It has squares in a cross shape.', 4, 3, [{ c0: 1, c1: 2, r0: 0, r1: 1, cls: 'bg-indigo-400' }, { c0: 0, c1: 4, r0: 1, r1: 2, cls: 'bg-indigo-400' }, { c0: 1, c1: 2, r0: 2, r1: 3, cls: 'bg-indigo-400' }])] : [x('A net is the solid opened out flat. Think about the faces of the ' + d[0] + '.', [d[0], 'solid'], ' → ', ['net', 'flat pattern'])]).concat([
          note('The faces of a ' + d[0] + '.', 'Faces', d[4].map(function (p) { return p[1] + ' ' + p[0]; })),
          x('We need the ' + d[1] + '. ' + d[3], [d[1], 'count these']),
          x('There ' + (d[2] === 1 ? 'is ' : 'are ') + d[2] + ' ' + d[1] + ' in the net.', [String(d[2]), 'answer'])
        ])
      });
    } },

    { id: 'frombase', level: 4, name: 'Solid counts from the base', make: function () {
      var n = R.pick([3, 4, 5, 6, 7, 8]), kind = R.pick(['prism', 'pyramid']), key = R.pick(['F', 'E', 'V']);
      var s = kind === 'prism' ? prism(n) : pyramid(n);
      var q = WORD[key], bn = BASEN[n];
      var traps = [T(String(n), 'That is only the number of sides of the base. Count all the ' + q + ' of the solid.')];
      var other = ['F', 'E', 'V'].filter(function (k) { return k !== key; })[R.int(0, 1)];
      traps.push(T(String(s[other]), 'That is the number of ' + WORD[other] + '. The question asks for ' + q + '.'));
      var ruleText = kind === 'prism' ? { F: 'n + 2', E: '3 × n', V: '2 × n' } : { F: 'n + 1', E: '2 × n', V: 'n + 1' };
      return N({
        skill: SK, prompt: 'A ' + kind + ' has a base shaped like a ' + bn + '. How many ' + q + ' does the ' + kind + ' have?', answer: s[key], keyboard: 'numeric', placeholder: 'Type a number', traps: traps,
        work: partsOf(s)[key], plain: 'Use the number of sides of the base, ' + n + ', to count.',
        teach: [
          x('The base is a ' + bn + ', so it has ' + n + ' sides. Let n = ' + n + '.', ['n', 'sides of base'], ' = ', [String(n), 'value']),
          note('The counting rule for a ' + kind + '.', 'Rule', kind === 'prism' ? ['Faces: n + 2', 'Edges: 3 × n', 'Vertices: 2 × n'] : ['Faces: n + 1', 'Edges: 2 × n', 'Vertices: n + 1']),
          x('We need the ' + q + '. The rule is ' + ruleText[key] + '.', [ruleText[key], q + ' rule']),
          x('Put in n = ' + n + '. ' + partsOf(s)[key], [String(s[key]), q])
        ]
      });
    } },

    { id: 'euler', level: 5, name: 'Use the Euler rule', make: function () {
      var s = R.pick(LIST), find = R.pick(['F', 'E', 'V']);
      var f = s.F, e = s.E, v = s.V, ans = s[find];
      var known = ['F', 'E', 'V'].filter(function (k) { return k !== find; });
      var txt = { F: f + ' faces', E: e + ' edges', V: v + ' vertices' };
      var comp = { F: 'E − V + 2', E: 'F + V − 2', V: 'E − F + 2' };
      var work;
      if (find === 'E') work = f + ' + ' + v + ' − 2 = ' + e + '.';
      else if (find === 'V') work = e + ' − ' + f + ' + 2 = ' + v + '.';
      else work = e + ' − ' + v + ' + 2 = ' + f + '.';
      var traps = [];
      if (find === 'E') traps.push(T(String(f + v), 'That is faces plus vertices. The edges are 2 less than that.'), T(String(f + v + 2), 'The edges are 2 less than faces plus vertices, not 2 more.'));
      if (find === 'V') traps.push(T(String(e - f), 'That is edges minus faces. You must add 2 to find the vertices.'), T(String(e - f - 2), 'Add 2, not take away 2, because faces plus vertices is 2 more than edges.'));
      if (find === 'F') traps.push(T(String(e - v), 'That is edges minus vertices. You must add 2 to find the faces.'), T(String(e - v - 2), 'Add 2, not take away 2, because faces plus vertices is 2 more than edges.'));
      var rulesay = 'Remember, faces plus vertices minus edges equals 2.';
      var nm = { F: 'faces', E: 'edges', V: 'vertices' };
      var mid = find === 'E' ? f + v : (find === 'V' ? e - f : e - v), midTxt = find === 'E' ? f + ' + ' + v : (find === 'V' ? e + ' − ' + f : e + ' − ' + v);
      return N({
        skill: SK, prompt: 'A solid with flat faces has ' + txt[known[0]] + ' and ' + txt[known[1]] + '. How many ' + nm[find] + ' does it have? ' + rulesay, answer: ans, keyboard: 'numeric', placeholder: 'Type a number', traps: traps,
        work: work, plain: 'Faces plus vertices is always 2 more than edges. Use that to find the missing number.',
        teach: [
          x('The Euler rule says faces plus vertices minus edges equals 2.', ['F', 'faces'], ' + ', ['V', 'vertices'], ' − ', ['E', 'edges'], ' = 2'),
          x('We know ' + txt[known[0]] + ' and ' + txt[known[1]] + '. We want the ' + nm[find] + '.', [txt[known[0]], 'known'], ' ', [txt[known[1]], 'known']),
          x((find === 'E' ? 'Add faces and vertices first. ' : 'Take away first. ') + midTxt + ' = ' + mid + '.', midTxt + ' = ', [String(mid), 'first step']),
          x((find === 'E' ? 'Now take away 2. ' : 'Now add 2. ') + mid + (find === 'E' ? ' − 2 = ' : ' + 2 = ') + ans + '.', mid + (find === 'E' ? ' − 2 = ' : ' + 2 = '), [String(ans), nm[find]]),
          x('The solid has ' + ans + ' ' + nm[find] + '. That matches a ' + s.name + '.', [String(ans), nm[find]])
        ]
      });
    } },

    { id: 'findbase', level: 6, name: 'Find the base from the counts', make: function () {
      var n = R.pick([3, 4, 5, 6, 7, 8]), v = R.int(0, 4), p, ans = n, work, tr = [], plain;
      if (v === 0) { p = 'A pyramid has ' + (2 * n) + ' edges. How many sides does its base have?'; work = (2 * n) + ' ÷ 2 = ' + n + '.'; tr.push(T(String(2 * n), 'That is the number of edges. A pyramid has 2 edges for each side of the base, so divide by 2.')); plain = 'A pyramid has 2n edges. Divide the edges by 2.'; }
      else if (v === 1) { p = 'A prism has ' + (3 * n) + ' edges. How many sides does its base have?'; work = (3 * n) + ' ÷ 3 = ' + n + '.'; tr.push(T(String(3 * n), 'That is the number of edges. A prism has 3 edges for each side of the base, so divide by 3.')); plain = 'A prism has 3n edges. Divide the edges by 3.'; }
      else if (v === 2) { p = 'A prism has ' + (2 * n) + ' vertices. How many sides does its base have?'; work = (2 * n) + ' ÷ 2 = ' + n + '.'; tr.push(T(String(2 * n), 'That is the number of vertices. A prism has 2 vertices for each side of the base, so divide by 2.')); plain = 'A prism has 2n vertices. Divide the vertices by 2.'; }
      else if (v === 3) { p = 'A pyramid has ' + (n + 1) + ' faces. How many sides does its base have?'; work = (n + 1) + ' − 1 = ' + n + '.'; tr.push(T(String(n + 1), 'That counts the base face too. Take away 1 for the base.')); plain = 'A pyramid has n + 1 faces. Take away 1.'; }
      else { p = 'A prism has ' + (n + 2) + ' faces. How many sides does its base have?'; work = (n + 2) + ' − 2 = ' + n + '.'; tr.push(T(String(n + 2), 'That counts the two bases too. Take away 2 for the two bases.')); plain = 'A prism has n + 2 faces. Take away 2.'; }
      var rule = ['A prism: n + 2 faces, 3n edges, 2n vertices', 'A pyramid: n + 1 faces, 2n edges, n + 1 vertices'];
      return N({
        skill: SK, prompt: p, answer: ans, keyboard: 'numeric', placeholder: 'Type a number', traps: tr, work: work, plain: plain,
        teach: [
          x(p, ['base sides', 'n = ?']),
          note('Use the counting rules. The letter n is the number of sides of the base.', 'Rules', rule),
          x('Pick the rule that matches the question and work backwards.', [work.replace(/\.$/, ''), 'work backwards']),
          x('The base has ' + n + ' sides. It is a ' + BASEN[n] + '.', [String(n), 'answer'])
        ]
      });
    } },

    { id: 'mixed', level: 6, name: 'Totals across several shapes', make: function () {
      var v = R.int(0, 2);
      if (v === 0) {
        var ks = R.shuffle([3, 4, 5, 6, 8]).slice(0, R.int(2, 3)), tot = ks.reduce(function (s, k) { return s + k; }, 0);
        var names = ks.map(function (k) { return 'a ' + NAMES[k]; });
        var lst = names.length === 2 ? names[0] + ' and ' + names[1] : names[0] + ', ' + names[1] + ' and ' + names[2];
        return N({
          skill: SK, prompt: 'Rinka draws ' + lst + '. How many sides do the shapes have in all?', answer: tot, keyboard: 'numeric', placeholder: 'Type a number',
          traps: [T(String(ks.length), 'That is the number of shapes. The question asks for all their sides added together.')],
          work: ks.join(' + ') + ' = ' + tot + '.', plain: 'Find the sides of each shape. Then add them.',
          teach: [
            x('We add the number of sides of every shape.', [ks.map(function (k) { return NAMES[k] + ' ' + k; }).join(', '), 'shapes and sides']),
            note('Sides of each shape.', 'Side counts', ks.map(function (k) { return 'A ' + NAMES[k] + ' has ' + k + ' sides'; })),
            x('Add them up. ' + ks.join(' + ') + ' = ' + tot + '.', ks.join(' + ') + ' = ', [String(tot), 'sides in all']),
            x('The shapes have ' + tot + ' sides in all.', [String(tot), 'answer'])
          ]
        });
      }
      var a = R.pick(SOLIDS), b = R.pick(SOLIDS.filter(function (z) { return z.name !== a.name; })), key = R.pick(['F', 'E', 'V']), q = WORD[key], t2 = a[key] + b[key];
      var av = v === 1 ? 'A ' + a.name + ' and a ' + b.name + ' are on a shelf. How many ' + q + ' do the two solids have in all?' : 'Rinka builds a model from a ' + a.name + ' and a ' + b.name + ' that do not touch. How many ' + q + ' do they have together?';
      return N({
        skill: SK, prompt: av, answer: t2, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(Math.abs(a[key] - b[key])), 'You took one away from the other. The question asks for both together, so add.')],
        work: a[key] + ' + ' + b[key] + ' = ' + t2 + '.', plain: 'Count the ' + q + ' of each solid, then add.',
        teach: [
          x('We add the ' + q + ' of the two solids.', [a.name, 'first'], ' + ', [b.name, 'second']),
          note('Count each solid.', 'Counts', ['A ' + a.name + ' has ' + a[key] + ' ' + q + '. ' + partsOf(a)[key], 'A ' + b.name + ' has ' + b[key] + ' ' + q + '. ' + partsOf(b)[key]]),
          x('Add them. ' + a[key] + ' + ' + b[key] + ' = ' + t2 + '.', a[key] + ' + ' + b[key] + ' = ', [String(t2), q]),
          x('Together they have ' + t2 + ' ' + q + '.', [String(t2), 'answer'])
        ]
      });
    } }
  ]);

  /* Fix the article before a vowel, such as "a octagon" to "an octagon". */
  function clean(o) {
    if (typeof o === 'string') return o.replace(/\b(a|A) (?=[aeio])/g, function (m, l) { return l + 'n '; });
    if (Array.isArray(o)) { for (var i = 0; i < o.length; i++) o[i] = clean(o[i]); return o; }
    if (o && typeof o === 'object') { Object.keys(o).forEach(function (k) { o[k] = clean(o[k]); }); }
    return o;
  }
  clean(window.MATH_LESSONS[16]);
  B.skills[16].forEach(function (sk) { var mk = sk.make; sk.make = function () { return clean(mk()); }; });
})();
