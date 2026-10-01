/* Module 17: Slides, Flips and Turns. Lessons, vocabulary and question skills. */
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
  function rep(c, n) { var o = ''; for (var i = 0; i < n; i++) o += c; return o; }
  function pr(a, b) { return '(' + a + ', ' + b + ')'; }
  function pt(px, py, ch) { return { x: px, y: py, ch: ch }; }
  function bounds(list, minX, minY) {
    var mx = minX || 3, my = minY || 3;
    list.forEach(function (p) { if (p.x + 1 > mx) mx = p.x + 1; if (p.y + 1 > my) my = p.y + 1; });
    return [Math.min(mx, 9), Math.min(my, 9)];
  }
  /* A first quadrant grid drawn in text. Each point shows its letter. A mirror line is | (vertical) or = (horizontal). */
  function plot(pts, mirror, mxy) {
    var b = mxy || bounds(pts), mx = b[0], my = b[1], out = [], px, py;
    for (py = my; py >= 0; py--) {
      var row = (py < 10 ? ' ' : '') + py + ' |';
      for (px = 0; px <= mx; px++) {
        var ch = '.';
        if (mirror && mirror.v === px) ch = '|';
        if (mirror && mirror.h === py) ch = '=';
        pts.forEach(function (p) { if (p.x === px && p.y === py) ch = p.ch; });
        row += ' ' + ch + ' ';
      }
      out.push(row);
    }
    out.push('   |' + rep('_', 3 * (mx + 1)));
    var lab = '    ';
    for (px = 0; px <= mx; px++) lab += ' ' + px + ' ';
    out.push(lab);
    return out;
  }
  function moveWords(dx, dy) {
    var w = [];
    if (dx > 0) w.push(dx + (dx === 1 ? ' unit right' : ' units right'));
    if (dx < 0) w.push(-dx + (dx === -1 ? ' unit left' : ' units left'));
    if (dy > 0) w.push(dy + (dy === 1 ? ' unit up' : ' units up'));
    if (dy < 0) w.push(-dy + (dy === -1 ? ' unit down' : ' units down'));
    return w.join(' and ');
  }

  /* Text for adding a signed move to a coordinate, using words instead of negatives. */
  function comb(c, d) { return d > 0 ? c + ' + ' + d + ' = ' + (c + d) : (d < 0 ? c + ' − ' + (-d) + ' = ' + (c + d) : c + ' + 0 = ' + c); }

  /* Worked steps for sliding one point. */
  function slideSteps(px, py, dx, dy, ask) {
    var nx = px + dx, ny = py + dy, st = [];
    st.push(x('The point starts at ' + pr(px, py) + '. It slides ' + moveWords(dx, dy) + '.', ['P', 'start'], ' = ', [pr(px, py), 'x, y']));
    st.push(lines('Here is point P on the grid.', plot([pt(px, py, 'P')], null, bounds([pt(px, py), pt(nx, ny)])), 0));
    if (dx !== 0) st.push(x((dx > 0 ? 'Sliding right adds to x. ' : 'Sliding left takes away from x. ') + px + (dx > 0 ? ' + ' : ' − ') + Math.abs(dx) + ' = ' + nx + '.', px + (dx > 0 ? ' + ' : ' − ') + Math.abs(dx) + ' = ', [String(nx), 'new x']));
    else st.push(x('It does not slide left or right, so x stays ' + px + '.', [String(px), 'x stays']));
    if (dy !== 0) st.push(x((dy > 0 ? 'Sliding up adds to y. ' : 'Sliding down takes away from y. ') + py + (dy > 0 ? ' + ' : ' − ') + Math.abs(dy) + ' = ' + ny + '.', py + (dy > 0 ? ' + ' : ' − ') + Math.abs(dy) + ' = ', [String(ny), 'new y']));
    else st.push(x('It does not slide up or down, so y stays ' + py + '.', [String(py), 'y stays']));
    st.push(lines('The image p is at ' + pr(nx, ny) + '.', plot([pt(px, py, 'P'), pt(nx, ny, 'p')], null, bounds([pt(px, py), pt(nx, ny)])), 0));
    st.push(x('The ' + ask + ' coordinate of the image is ' + (ask === 'x' ? nx : ny) + '.', 'Image = ', [pr(nx, ny), 'answer']));
    return st;
  }

  /* Worked steps for a flip of one point. */
  function flipSteps(px, py, dir, k, ask) {
    var st = [], vert = dir === 'v';
    var nx = vert ? 2 * k - px : px, ny = vert ? py : 2 * k - py;
    var d = Math.abs((vert ? px : py) - k), b = bounds([pt(px, py), pt(nx, ny), pt(vert ? k : 0, vert ? 0 : k)]);
    st.push(x('The point ' + pr(px, py) + ' is flipped across the ' + (vert ? 'vertical' : 'horizontal') + ' line ' + (vert ? 'x' : 'y') + ' = ' + k + '. The line is a mirror.', ['P', 'start'], ' = ', [pr(px, py), 'x, y']));
    st.push(lines('Here is P and the mirror line.', plot([pt(px, py, 'P')], vert ? { v: k } : { h: k }, b), 0));
    st.push(x('Find how far P is from the mirror. ' + (vert ? 'Compare ' + px + ' and ' + k + '.' : 'Compare ' + py + ' and ' + k + '.') + ' The distance is ' + d + '.', 'Distance = ', [String(d), 'units']));
    st.push(x('The image is the same distance on the other side of the mirror. ' + k + (((vert ? px : py) < k) ? ' + ' : ' − ') + d + ' = ' + (vert ? nx : ny) + '.', k + (((vert ? px : py) < k) ? ' + ' : ' − ') + d + ' = ', [String(vert ? nx : ny), vert ? 'new x' : 'new y']));
    st.push(x('The other coordinate does not change. ' + (vert ? 'y stays ' + py + '.' : 'x stays ' + px + '.'), [String(vert ? py : px), vert ? 'y stays' : 'x stays']));
    st.push(lines('The image p is at ' + pr(nx, ny) + '.', plot([pt(px, py, 'P'), pt(nx, ny, 'p')], vert ? { v: k } : { h: k }, b), 0));
    st.push(x('The ' + ask + ' coordinate of the image is ' + (ask === 'x' ? nx : ny) + '.', 'Image = ', [pr(nx, ny), 'answer']));
    return st;
  }

  /* Rotation of point (qx, qy) about (cx, cy). turn is 'half', 'cw' or 'ccw'. */
  function rotate(qx, qy, cx, cy, turn) {
    var dx = qx - cx, dy = qy - cy;
    if (turn === 'half') return [cx - dx, cy - dy];
    if (turn === 'cw') return [cx + dy, cy - dx];
    return [cx - dy, cy + dx];
  }
  var TURNW = { half: 'a half turn', cw: 'a quarter turn clockwise', ccw: 'a quarter turn counterclockwise' };
  function turnSteps(qx, qy, cx, cy, turn, ask) {
    var r = rotate(qx, qy, cx, cy, turn), rx = r[0], ry = r[1], dx = qx - cx, dy = qy - cy, st = [];
    var b = bounds([pt(qx, qy), pt(rx, ry), pt(cx, cy)]);
    st.push(x('Point Q is at ' + pr(qx, qy) + '. It turns ' + TURNW[turn] + ' about the point C at ' + pr(cx, cy) + '.', ['Q', 'start'], ' = ', [pr(qx, qy), 'x, y'], ' about ', ['C', 'centre']));
    st.push(lines('Here is the centre C and the point Q.', plot([pt(cx, cy, 'C'), pt(qx, qy, 'Q')], null, b), 0));
    st.push(x('Work out where Q is from C. Q is ' + moveWords(dx, dy) + ' from C.', ['Q is ' + moveWords(dx, dy), 'from C']));
    if (turn === 'half') st.push(x('A half turn flips both directions. Right becomes left. Up becomes down. So both steps swap direction.', ['half turn', 'both swap']));
    else if (turn === 'cw') st.push(x('A clockwise quarter turn is like the hour hand from 3 o\'clock to 6 o\'clock. Right becomes down, down becomes left, left becomes up, and up becomes right.', ['right → down', 'clockwise']));
    else st.push(x('A counterclockwise quarter turn is like the hour hand from 3 o\'clock to 12 o\'clock. Right becomes up, up becomes left, left becomes down, and down becomes right.', ['right → up', 'counterclockwise']));
    st.push(x('After the turn the image is ' + moveWords(rx - cx, ry - cy) + ' from C. Use C to find its coordinates. x: ' + comb(cx, rx - cx) + '. y: ' + comb(cy, ry - cy) + '.', pr(rx, ry), ' ', ['image', 'q']));
    st.push(lines('The image q is at ' + pr(rx, ry) + '.', plot([pt(cx, cy, 'C'), pt(qx, qy, 'Q'), pt(rx, ry, 'q')], null, b), 0));
    st.push(x('The ' + ask + ' coordinate of the image is ' + (ask === 'x' ? rx : ry) + '.', 'Image = ', [pr(rx, ry), 'answer']));
    return st;
  }

  /* ---------- Vocabulary ---------- */
  window.MATH_VOCAB[17] = [
    { w: 'Ordered pair', m: 'Two numbers in brackets like (3, 5). The first is how far across. The second is how far up.' },
    { w: 'Coordinate', m: 'One of the numbers in an ordered pair. The x coordinate goes across. The y coordinate goes up.' },
    { w: 'Translation (slide)', m: 'Moving a shape in a straight line without turning or flipping it.' },
    { w: 'Reflection (flip)', m: 'Flipping a shape over a mirror line to make a mirror image.' },
    { w: 'Rotation (turn)', m: 'Turning a shape around a point, like a quarter turn or a half turn.' },
    { w: 'Image', m: 'The new shape or point after it has been slid, flipped or turned.' },
    { w: 'Congruent', m: 'Exactly the same size and the same shape. Slides, flips and turns keep shapes congruent.' }
  ];

  /* ---------- Lessons ---------- */
  var TRI1 = [pt(1, 1, 'A'), pt(3, 1, 'B'), pt(1, 3, 'C')];
  var TRI2 = [pt(4, 3, 'a'), pt(6, 3, 'b'), pt(4, 5, 'c')];
  window.MATH_LESSONS[17] = [
    { title: '1. Ordered pairs on a grid',
      explain: [
        'A grid can show where a point is. We start at the corner where the two number lines meet. That corner is called (0, 0).',
        'An ordered pair has two numbers in brackets, like (3, 2). The first number tells how far to go across, to the right. The second number tells how far to go up.',
        'The order matters. (3, 2) and (2, 3) are two different places.'
      ],
      rule: 'Across first, then up. (across, up).',
      mistake: 'Do not swap the numbers. (3, 2) means 3 across and 2 up, not 2 across and 3 up.',
      steps: [
        lines('This is a grid. The corner at the bottom left is (0, 0). The numbers along the bottom go across. The numbers up the side go up.', plot([pt(0, 0, 'O')], null, [6, 5]), 0),
        x('Look at the ordered pair (3, 2). The first number is 3. That means go 3 across.', ['3', 'across'], ', 2'),
        x('The second number is 2. That means go 2 up.', '3, ', ['2', 'up']),
        lines('Start at O. Go 3 across and 2 up. Point A is at (3, 2).', plot([pt(0, 0, 'O'), pt(3, 2, 'A')], null, [6, 5]), 0),
        x('Now try (2, 3). Go 2 across and 3 up. It is a different point.', ['2', 'across'], ', ', ['3', 'up']),
        lines('Point B at (2, 3) is not the same place as A at (3, 2).', plot([pt(3, 2, 'A'), pt(2, 3, 'B')], null, [6, 5]), 0),
        note('Say it like walking.', 'Walk the grid', ['First walk across along the floor', 'Then walk up the stairs', 'Across is the x coordinate', 'Up is the y coordinate'])
      ] },

    { title: '2. Plotting a point',
      explain: [
        'To plot a point means to mark where it goes. Always begin at (0, 0).',
        'Move across by the first number. Then move up by the second number. Put a dot where you stop.',
        'A helpful memory is "along the hallway, then up the stairs". You always walk along before you go up.'
      ],
      rule: 'Start at (0, 0). Go across by x. Go up by y. Mark the point.',
      mistake: 'Do not go up first. If you go up first, you mark the wrong place.',
      steps: [
        x('Let us plot the point (5, 3). Start at (0, 0).', ['(5, 3)', 'plot'], ' from ', ['(0, 0)', 'start']),
        lines('Start at O, at the corner.', plot([pt(0, 0, 'O')], null, [7, 5]), 0),
        lines('Go across 5. We walk along the bottom. The stars show the path.', plot([pt(0, 0, 'O'), pt(1, 0, '*'), pt(2, 0, '*'), pt(3, 0, '*'), pt(4, 0, '*'), pt(5, 0, '*')], null, [7, 5]), 0),
        lines('Now go up 3. The stars show the path going up.', plot([pt(0, 0, 'O'), pt(1, 0, '*'), pt(2, 0, '*'), pt(3, 0, '*'), pt(4, 0, '*'), pt(5, 0, '*'), pt(5, 1, '*'), pt(5, 2, '*')], null, [7, 5]), 0),
        lines('Put the point where you stop. P is at (5, 3).', plot([pt(0, 0, 'O'), pt(5, 3, 'P')], null, [7, 5]), 0),
        x('The point is 5 across and 3 up.', 'P = ', ['(5, 3)', '5 across, 3 up'])
      ] },

    { title: '3. Reading a point from a grid',
      explain: [
        'Reading a point is plotting in reverse. Find the point. Look straight down to the bottom numbers to see how far across it is. Look straight to the side numbers to see how far up it is.',
        'Write the across number first, then the up number.',
        'Points on the bottom line have an up number of 0. Points on the left side line have an across number of 0.'
      ],
      rule: 'Look down for x. Look across for y. Write (x, y).',
      mistake: 'Do not read the up number first. Point C in the picture is at (4, 1), not (1, 4).',
      steps: [
        lines('Here are three points, A, B and C.', plot([pt(1, 4, 'A'), pt(4, 4, 'B'), pt(4, 1, 'C')], null, [6, 5]), 0),
        x('Point A. Look down to the bottom. It is above the 1. So x is 1.', 'A: across ', ['1', 'x']),
        x('Look to the side. A is level with the 4. So y is 4. A is at (1, 4).', 'A = ', ['(1, 4)', 'across 1, up 4']),
        x('Point B is above the 4 and level with the 4. It is at (4, 4).', 'B = ', ['(4, 4)', 'across 4, up 4']),
        x('Point C is above the 4 and level with the 1. It is at (4, 1).', 'C = ', ['(4, 1)', 'across 4, up 1']),
        x('B and C are both above the 4, so they have the same x. A and B are both level with the 4, so they have the same y.', ['same x', 'B and C'], ' ', ['same y', 'A and B'])
      ] },

    { title: '4. Slides (translations)',
      explain: [
        'A slide moves a shape in a straight line. Every point of the shape moves the same distance in the same direction. The shape does not turn or flip.',
        'The new shape is called the image. It looks exactly like the first shape, just in a new place.',
        'We describe a slide by saying how far it goes right or left, and how far it goes up or down.'
      ],
      rule: 'Every point slides the same amount in the same direction. The shape does not turn.',
      mistake: 'Do not move only one corner. Every corner must slide the same amount.',
      steps: [
        lines('Here is triangle ABC. A is at (1, 1), B is at (3, 1) and C is at (1, 3).', plot(TRI1, null, [7, 6]), 0),
        x('We slide it 3 units right and 2 units up. Every corner moves the same way.', ['3 right', 'x + 3'], ' ', ['2 up', 'y + 2']),
        lines('Now the image is triangle abc. a is at (4, 3), b is at (6, 3) and c is at (4, 5).', plot(TRI1.concat(TRI2), null, [7, 6]), 0),
        x('Check corner A. (1, 1) becomes (1 + 3, 1 + 2) = (4, 3).', 'A ', ['(1, 1)', 'start'], ' → a ', ['(4, 3)', 'image']),
        x('Check corner B. (3, 1) becomes (3 + 3, 1 + 2) = (6, 3).', 'B ', ['(3, 1)', 'start'], ' → b ', ['(6, 3)', 'image']),
        x('Check corner C. (1, 3) becomes (1 + 3, 3 + 2) = (4, 5).', 'C ', ['(1, 3)', 'start'], ' → c ', ['(4, 5)', 'image'])
      ] },

    { title: '5. Finding the image of a slide',
      explain: [
        'You can find where a point ends up without a picture. Use the numbers.',
        'Sliding right adds to x. Sliding left takes away from x. Sliding up adds to y. Sliding down takes away from y.',
        'Change only the number that goes with the direction. Right and left change x. Up and down change y.'
      ],
      rule: 'Right: x plus. Left: x minus. Up: y plus. Down: y minus.',
      mistake: 'Do not change both coordinates for a slide that goes only one way. A slide right changes only x.',
      steps: [
        x('A point is at (5, 5). It slides 3 units left and 2 units down. Where does it end up?', ['(5, 5)', 'start'], ' → ', ['3 left, 2 down', 'slide']),
        x('Left changes x. Sliding left takes away. 5 − 3 = 2.', '5 − 3 = ', ['2', 'new x']),
        x('Down changes y. Sliding down takes away. 5 − 2 = 3.', '5 − 2 = ', ['3', 'new y']),
        lines('Here is the start P and the image p.', plot([pt(5, 5, 'P'), pt(2, 3, 'p')], null, [7, 6]), 0),
        x('The image is at (2, 3).', 'Image = ', ['(2, 3)', 'answer']),
        note('Keep this chart.', 'Slide rules', ['Right: x goes up', 'Left: x goes down', 'Up: y goes up', 'Down: y goes down'])
      ] },

    { title: '6. Flips across a vertical line',
      explain: [
        'A flip makes a mirror image. The line you flip over is called the mirror line. A vertical mirror line goes straight up and down.',
        'Every point flips to the other side of the mirror. It ends up the same distance from the mirror, but on the opposite side.',
        'When you flip across a vertical line, the y coordinate stays the same. Only the x coordinate changes.'
      ],
      rule: 'Same distance from the mirror, other side. Across a vertical line, y stays the same.',
      mistake: 'The image is not on the mirror line. It is as far behind the mirror as the point is in front.',
      steps: [
        lines('The point A is at (2, 3). The mirror line is the vertical line x = 4. It is drawn with | signs.', plot([pt(2, 3, 'A')], { v: 4 }, [7, 5]), 0),
        x('How far is A from the mirror? The mirror is at x = 4 and A is at x = 2. 4 − 2 = 2.', '4 − 2 = ', ['2', 'units from mirror']),
        x('The image is 2 units on the other side of the mirror. 4 + 2 = 6.', '4 + 2 = ', ['6', 'new x']),
        x('The y coordinate does not change. It stays 3.', ['3', 'y stays']),
        lines('The image a is at (6, 3). A and a are mirror images.', plot([pt(2, 3, 'A'), pt(6, 3, 'a')], { v: 4 }, [7, 5]), 0),
        x('The mirror is exactly halfway between A and a.', 'A ', ['(2, 3)', 'start'], ' → a ', ['(6, 3)', 'image'])
      ] },

    { title: '7. Flips across a horizontal line',
      explain: [
        'A horizontal mirror line goes flat, from side to side. The point flips up or down over the mirror.',
        'Again the image is the same distance from the mirror, on the other side.',
        'This time the x coordinate stays the same, and only the y coordinate changes.'
      ],
      rule: 'Across a horizontal line, x stays the same. y changes.',
      mistake: 'Do not change x for a flip across a horizontal line. The point moves straight up or down.',
      steps: [
        lines('The point B is at (3, 1). The mirror line is the horizontal line y = 4. It is drawn with = signs.', plot([pt(3, 1, 'B')], { h: 4 }, [6, 7]), 0),
        x('How far is B from the mirror? The mirror is at y = 4 and B is at y = 1. 4 − 1 = 3.', '4 − 1 = ', ['3', 'units from mirror']),
        x('The image is 3 units on the other side of the mirror. 4 + 3 = 7.', '4 + 3 = ', ['7', 'new y']),
        x('The x coordinate does not change. It stays 3.', ['3', 'x stays']),
        lines('The image b is at (3, 7).', plot([pt(3, 1, 'B'), pt(3, 7, 'b')], { h: 4 }, [6, 7]), 0),
        x('B and b are mirror images across the line y = 4.', 'B ', ['(3, 1)', 'start'], ' → b ', ['(3, 7)', 'image'])
      ] },

    { title: '8. Turns (rotations)',
      explain: [
        'A turn spins a shape around a point. The point it spins around is called the centre of the turn. Often it is one corner of the shape.',
        'A half turn is half of a full circle. It sends everything to the opposite side. A quarter turn is half of that. We say clockwise for the way the clock hands move, and counterclockwise for the other way.',
        'To turn a point, first see how far it is from the centre. Then swap the directions. Think of the hand of a clock.'
      ],
      rule: 'Half turn: reverse both directions. Clockwise quarter turn: right becomes down, down becomes left, left becomes up, up becomes right.',
      mistake: 'Do not mix up clockwise and counterclockwise. Clockwise follows the clock hands.',
      steps: [
        lines('The point Q is at (5, 3). It turns a half turn about the centre C at (3, 2).', plot([pt(3, 2, 'C'), pt(5, 3, 'Q')], null, [7, 5]), 0),
        x('Q is 2 across and 1 up from C. 5 − 3 = 2 and 3 − 2 = 1.', ['2 across', 'from C'], ' ', ['1 up', 'from C']),
        x('A half turn reverses both. So the image is 2 across the other way and 1 down from C.', ['2 left', 'reversed'], ' ', ['1 down', 'reversed']),
        x('Add these to C. 3 − 2 = 1 and 2 − 1 = 1. The image is at (1, 1).', '(3 − 2, 2 − 1) = ', ['(1, 1)', 'image']),
        lines('The image q is on the opposite side of C, the same distance away.', plot([pt(3, 2, 'C'), pt(5, 3, 'Q'), pt(1, 1, 'q')], null, [7, 5]), 0),
        x('Now a quarter turn clockwise. Picture a clock hand pointing right, at 3 o\'clock. A quarter turn clockwise makes it point down, at 6 o\'clock.', ['right', '3 o\'clock'], ' → ', ['down', '6 o\'clock']),
        x('So a point 3 to the right of C ends up 3 below C after a quarter turn clockwise.', ['3 right', 'start'], ' → ', ['3 down', 'after turn'])
      ] },

    { title: '9. Describing slides, flips and turns',
      explain: [
        'When a shape moves, ask what happened to it. Did it just move over? Did it become a mirror image? Did it spin around a point?',
        'A slide keeps the shape facing the same way. A flip makes a mirror image, so left and right swap. A turn spins the shape around a centre.',
        'In all three, the shape stays exactly the same size and shape. Only its place or its direction changes.'
      ],
      rule: 'Slide: moves. Flip: mirror image. Turn: spins around a point.',
      mistake: 'Do not call a mirror image a slide. If left and right have swapped, it was flipped.',
      steps: [
        note('Learn the three moves.', 'Three moves', ['Slide: every point moves the same way', 'Flip: mirror image over a line', 'Turn: spins around a point']),
        x('A sled goes straight down a hill. Everything moves the same way. That is a slide.', ['sled', 'moves straight'], ' → ', ['slide', 'answer']),
        x('You see your face in a mirror. Left and right swap. That is a flip.', ['mirror', 'left and right swap'], ' → ', ['flip', 'answer']),
        x('The hands of a clock go around a centre. That is a turn.', ['clock hand', 'spins around a centre'], ' → ', ['turn', 'answer']),
        x('A butterfly has a left wing and a right wing that match like a mirror. That is a flip.', ['matching wings', 'mirror'], ' → ', ['flip', 'answer']),
        x('A Ferris wheel seat goes around the middle of the wheel. That is a turn.', ['Ferris wheel', 'around the centre'], ' → ', ['turn', 'answer'])
      ] },

    { title: '10. Congruent shapes',
      explain: [
        'Two shapes are congruent if they are exactly the same size and the same shape. You could place one on top of the other and they would match perfectly.',
        'Slides, flips and turns never change the size or shape. So the image of a shape after a slide, a flip or a turn is always congruent to the first shape.',
        'That means side lengths, angles, perimeter and area all stay the same.'
      ],
      rule: 'Slides, flips and turns keep the size and shape. The image is congruent.',
      mistake: 'A bigger or smaller copy is not congruent. Congruent means exactly the same size.',
      steps: [
        grid('Here is a rectangle that is 3 squares wide and 2 squares tall.', 8, 4, [{ c0: 0, c1: 3, r0: 0, r1: 2, cls: 'bg-indigo-400' }]),
        grid('Slide it to the right and down. Here is the image in green.', 8, 4, [{ c0: 0, c1: 3, r0: 0, r1: 2, cls: 'bg-indigo-400' }, { c0: 5, c1: 8, r0: 2, r1: 4, cls: 'bg-emerald-500' }]),
        x('Count the squares. The blue rectangle is 3 × 2 = 6 squares.', '3 × 2 = ', ['6', 'squares']),
        x('The green rectangle is also 3 wide and 2 tall. 3 × 2 = 6 squares. The area did not change.', '3 × 2 = ', ['6', 'squares']),
        x('The perimeter is the same too. 3 + 2 + 3 + 2 = 10 for both.', '3 + 2 + 3 + 2 = ', ['10', 'perimeter']),
        x('So the two rectangles are congruent.', ['blue', 'first'], ' ≅ ', ['green', 'image'])
      ] },

    { title: '11. A slide then a flip',
      explain: [
        'Sometimes a point makes two moves, one after the other. Do the first move. Write down where the point is. Then do the second move from there.',
        'Do not mix the two moves together. Take them one at a time.',
        'Check each move with the rules you know. Then check the final answer with a quick sketch if you can.'
      ],
      rule: 'Do one move at a time. Use the new position as the start of the next move.',
      mistake: 'Do not flip the original point. Flip the point after the slide.',
      steps: [
        x('A point starts at (2, 3). It slides 4 units right and 1 unit up. Then it flips across the vertical line x = 8. Where does it end up?', ['(2, 3)', 'start'], ' → slide → flip'),
        x('Move one. Slide right 4 adds to x. 2 + 4 = 6. Slide up 1 adds to y. 3 + 1 = 4.', '(2 + 4, 3 + 1) = ', ['(6, 4)', 'after the slide']),
        x('Move two. Flip across x = 8. How far is x = 6 from the mirror? 8 − 6 = 2.', '8 − 6 = ', ['2', 'from mirror']),
        x('The image is 2 units on the other side of the mirror. 8 + 2 = 10. The y stays 4.', '8 + 2 = ', ['10', 'new x']),
        x('The point ends up at (10, 4).', 'Final = ', ['(10, 4)', 'answer'])
      ] }
  ];

  /* ---------- Question skills ---------- */
  var SK = 'Slides, flips and turns';
  var WHO = ['Rinka', 'Mia', 'Sam', 'Noah'];

  B.register(17, [

    { id: 'readxy', level: 1, name: 'Read a coordinate', make: function () {
      var a = R.int(1, 9), b = R.int(1, 9);
      if (a === b) b = a === 9 ? 8 : a + 1;
      var ask = R.pick(['x', 'y']), ans = ask === 'x' ? a : b, other = ask === 'x' ? b : a;
      var name = R.pick(['A', 'B', 'P', 'Q', 'M']);
      var p = R.pick([
        'Point ' + name + ' is at the ordered pair ' + pr(a, b) + '. What is the ' + ask + ' coordinate?',
        'In the ordered pair ' + pr(a, b) + ', what is the ' + ask + ' coordinate?',
        'A treasure is hidden at ' + pr(a, b) + ' on a map grid. What is its ' + ask + ' coordinate?'
      ]);
      return N({
        skill: SK, prompt: p, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(other), 'That is the ' + (ask === 'x' ? 'y' : 'x') + ' coordinate. The x coordinate is the first number. The y coordinate is the second number.')],
        work: 'In ' + pr(a, b) + ', the first number ' + a + ' is x and the second number ' + b + ' is y. The ' + ask + ' coordinate is ' + ans + '.',
        plain: 'The first number is how far across. The second number is how far up.',
        teach: [
          x('The ordered pair is ' + pr(a, b) + '. It has two numbers.', [String(a), 'first'], ', ', [String(b), 'second']),
          x('The first number is the x coordinate. It tells how far across.', [String(a), 'x, across']),
          x('The second number is the y coordinate. It tells how far up.', [String(b), 'y, up']),
          lines('On the grid, ' + name + ' is ' + a + ' across and ' + b + ' up.', plot([pt(0, 0, 'O'), pt(a, b, name)]), 0),
          x('The ' + ask + ' coordinate is ' + ans + '.', [String(ans), ask + ' coordinate'])
        ]
      });
    } },

    { id: 'walk', level: 1, name: 'Walk across and up', make: function () {
      var a = R.int(1, 9), b = R.int(1, 9), ask = R.pick(['x', 'y']), ans = ask === 'x' ? a : b, who = R.pick(WHO);
      var p = who + ' starts at the corner (0, 0) of a grid. ' + who + ' walks ' + a + ' steps right and then ' + b + ' steps up. What is the ' + ask + ' coordinate of where ' + who + ' stops?';
      return N({
        skill: SK, prompt: p, answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(ask === 'x' ? b : a), 'That is the ' + (ask === 'x' ? 'y' : 'x') + ' coordinate. Right steps make the x coordinate. Up steps make the y coordinate.'), T(String(a + b), 'You added the two walks. Each walk is its own coordinate.')],
        work: 'Right ' + a + ' gives x = ' + a + '. Up ' + b + ' gives y = ' + b + '. The point is ' + pr(a, b) + '.',
        plain: 'Steps right make x. Steps up make y. Across first, then up.',
        teach: [
          x(who + ' starts at (0, 0) and walks ' + a + ' steps right and ' + b + ' steps up.', ['(0, 0)', 'start'], ' → ', [a + ' right', 'x'], ' → ', [b + ' up', 'y']),
          lines('The stars show the walk right along the bottom.', plot([pt(0, 0, 'O')].concat(Array.apply(null, Array(a)).map(function (_, i) { return pt(i + 1, 0, '*'); })), null, bounds([pt(a, b)])), 0),
          x('Walking ' + a + ' steps right makes x equal to ' + a + '.', [String(a), 'x']),
          x('Walking ' + b + ' steps up makes y equal to ' + b + '.', [String(b), 'y']),
          x(who + ' stops at ' + pr(a, b) + '. The ' + ask + ' coordinate is ' + ans + '.', [pr(a, b), 'stop'], ' → ', [String(ans), ask + ' coordinate'])
        ]
      });
    } },

    { id: 'pairchoice', level: 1, name: 'Choose the ordered pair', make: function () {
      var a = R.int(2, 8), b = R.int(2, 8);
      if (a === b) b = a === 8 ? 7 : a + 1;
      var v = R.int(0, 2), p, correct, opts, work;
      if (v === 0) {
        p = 'Which ordered pair names the point ' + a + ' units right and ' + b + ' units up from (0, 0)?'; correct = pr(a, b);
        opts = [{ text: correct, ok: true }, { text: pr(b, a), ok: false, trap: 'That swaps the numbers. Across comes first, so ' + a + ' right is the first number.' }, { text: pr(a, a), ok: false, trap: 'Look at the up number. The point is ' + b + ' units up, not ' + a + '.' }, { text: pr(a + b, 0), ok: false, trap: 'That adds the numbers. Each number stands for its own direction, across and up.' }];
        work = 'Across ' + a + ' is x. Up ' + b + ' is y. The pair is ' + correct + '.';
      } else if (v === 1) {
        p = 'Which of these points is on the x axis, which is the bottom line of the grid?'; correct = pr(a, 0);
        opts = [{ text: correct, ok: true }, { text: pr(0, a), ok: false, trap: 'That point has x = 0, so it is on the y axis, the line going up the side.' }, { text: pr(a, b), ok: false, trap: 'That point is up ' + b + ', so it is not on the bottom line.' }, { text: pr(b, a), ok: false, trap: 'That point is up ' + a + ', so it is not on the bottom line.' }];
        work = 'On the bottom line the y coordinate is 0. So the point is ' + correct + '.';
      } else {
        p = 'Which of these points is on the y axis, which is the line going up the left side of the grid?'; correct = pr(0, b);
        opts = [{ text: correct, ok: true }, { text: pr(b, 0), ok: false, trap: 'That point has y = 0, so it is on the x axis, the bottom line.' }, { text: pr(a, b), ok: false, trap: 'That point is ' + a + ' across, so it is not on the left side line.' }, { text: pr(b, a), ok: false, trap: 'That point is ' + b + ' across, so it is not on the left side line.' }];
        work = 'On the left side line the x coordinate is 0. So the point is ' + correct + '.';
      }
      var seen = {}; opts = opts.filter(function (o) { if (seen[o.text]) return false; seen[o.text] = 1; return true; });
      return Q.choice({
        skill: SK, prompt: p, options: opts, work: work, plain: 'Across first, then up. Points on the bottom line have y = 0. Points on the left line have x = 0.',
        teach: [
          x(p, ['(x, y)', 'across, up']),
          x('The first number is across. The second number is up.', ['x', 'across'], ' ', ['y', 'up']),
          lines('Here is the grid with the corner marked.', plot([pt(0, 0, 'O'), pt(a, v === 2 ? 0 : b, 'P')], null, bounds([pt(a, b)])), 0),
          x(work, [correct, 'answer'])
        ]
      });
    } },

    { id: 'slideimg', level: 2, name: 'Image of a slide', make: function () {
      var dx, dy, px, py;
      for (var t = 0; t < 60; t++) {
        dx = R.int(-4, 5); dy = R.int(-4, 5);
        if (R.int(0, 2) === 0) dx = 0; else if (R.int(0, 2) === 0) dy = 0;
        if (dx === 0 && dy === 0) continue;
        px = R.int(Math.max(0, -dx), Math.min(9, 9 - dx)); py = R.int(Math.max(0, -dy), Math.min(9, 9 - dy));
        if (px + dx >= 0 && py + dy >= 0 && px + dx <= 9 && py + dy <= 9) break;
      }
      var ask = R.pick(['x', 'y']), nx = px + dx, ny = py + dy, ans = ask === 'x' ? nx : ny, st = ask === 'x' ? px : py, d = ask === 'x' ? dx : dy;
      var traps = [T(String(st), 'That is the coordinate before the slide. The image has moved.')];
      if (d !== 0 && st - d >= 0) traps.push(T(String(st - d), 'You slid the wrong way. Right and up add. Left and down take away.'));
      if (d === 0) traps.push(T(String(ask === 'x' ? ny : nx), 'That is the other coordinate. Read the question again for which one it asks.'));
      return N({
        skill: SK, prompt: 'A point is at ' + pr(px, py) + '. It slides ' + moveWords(dx, dy) + '. What is the ' + ask + ' coordinate of the image?', answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: traps, work: 'The image is at ' + pr(nx, ny) + '. The ' + ask + ' coordinate is ' + ans + '.',
        plain: 'Right and up add. Left and down take away. Only the coordinate that goes with the direction changes.',
        teach: slideSteps(px, py, dx, dy, ask)
      });
    } },

    { id: 'slidedist', level: 2, name: 'How far did it slide', make: function () {
      var horiz = R.int(0, 1) === 1, a = R.int(0, 6), d = R.int(1, 3 + R.int(0, 2)), b = a + d, y = R.int(1, 9), back = R.int(0, 1) === 1;
      var from, to, dirw;
      if (horiz) { from = back ? pr(b, y) : pr(a, y); to = back ? pr(a, y) : pr(b, y); dirw = back ? 'left' : 'right'; }
      else { from = back ? pr(y, b) : pr(y, a); to = back ? pr(y, a) : pr(y, b); dirw = back ? 'down' : 'up'; }
      var traps = [T(String(a + b), 'You added the two numbers. Take the smaller from the bigger to find the distance.')];
      return N({
        skill: SK, prompt: 'A point slides from ' + from + ' to ' + to + '. How many units did it slide ' + dirw + '?', answer: d, keyboard: 'numeric', placeholder: 'Type a number', traps: traps,
        work: b + ' − ' + a + ' = ' + d + ' units ' + dirw + '.', plain: 'Only one coordinate changed. Take the smaller number away from the bigger number.',
        teach: [
          x('The point goes from ' + from + ' to ' + to + '.', [from, 'start'], ' → ', [to, 'end']),
          x('Look for the coordinate that changed. ' + (horiz ? 'The x coordinate changed, so it slid left or right.' : 'The y coordinate changed, so it slid up or down.'), [String(a), 'one number'], ' and ', [String(b), 'other number']),
          x('Take the smaller from the bigger. ' + b + ' − ' + a + ' = ' + d + '.', b + ' − ' + a + ' = ', [String(d), 'units']),
          x('The point slid ' + d + ' units ' + dirw + '.', [String(d), 'answer'])
        ]
      });
    } },

    { id: 'describe', level: 2, name: 'Slide, flip or turn', make: function () {
      var D = [
        ['Every point of a shape moves 4 units to the right. The shape does not spin.', 'Slide', 'Every point moves the same way in a straight line.'],
        ['A shape is changed into its mirror image over a line.', 'Flip', 'A mirror image is a flip.'],
        ['A shape spins a quarter turn around one of its corners.', 'Turn', 'Spinning around a point is a turn.'],
        ['A sled goes straight down a hill.', 'Slide', 'It moves in a straight line without spinning.'],
        ['You look at your face in a mirror. Left and right are swapped.', 'Flip', 'Swapping left and right makes a mirror image.'],
        ['The hour hand of a clock moves around the centre of the clock.', 'Turn', 'It spins around a centre point.'],
        ['A butterfly has a left wing that matches its right wing like a mirror.', 'Flip', 'A mirror match is a flip.'],
        ['A Ferris wheel seat goes around the centre of the wheel.', 'Turn', 'It spins around a centre point.'],
        ['A shape moves 3 units up and 2 units right, and faces the same way as before.', 'Slide', 'It moved without turning or flipping.'],
        ['A card is spun a half turn around its middle.', 'Turn', 'A half turn is a turn.']
      ];
      var d = R.pick(D), all = ['Slide', 'Flip', 'Turn'];
      var opts = all.map(function (n) { return { text: n, ok: n === d[1], trap: n === d[1] ? undefined : ({ Slide: 'A slide moves every point the same way without spinning or flipping.', Flip: 'A flip makes a mirror image over a line.', Turn: 'A turn spins the shape around a point.' })[n] + ' That does not match this story.' }; });
      return Q.choice({
        skill: SK, prompt: 'What kind of move is this? ' + d[0], options: opts, work: d[2], plain: 'Slide: moves. Flip: mirror image. Turn: spins around a point.',
        teach: [
          x('Read the story. ' + d[0], ['move', 'which kind?']),
          note('Three moves.', 'Slide, flip or turn', ['Slide: moves in a straight line, no spinning', 'Flip: mirror image over a line', 'Turn: spins around a point']),
          x(d[2], [d[1], 'match']),
          x('The move is a ' + d[1].toLowerCase() + '.', [d[1], 'answer'])
        ]
      });
    } },

    { id: 'whichstays', level: 3, name: 'Which coordinate stays the same', make: function () {
      var D = [
        ['A point is flipped across a vertical line.', 'The y coordinate', 'A vertical mirror line moves the point left or right, so only x changes.'],
        ['A point is flipped across a horizontal line.', 'The x coordinate', 'A horizontal mirror line moves the point up or down, so only y changes.'],
        ['A point slides only to the right.', 'The y coordinate', 'Sliding right changes x. The point does not move up or down.'],
        ['A point slides only up.', 'The x coordinate', 'Sliding up changes y. The point does not move left or right.'],
        ['A point slides only to the left.', 'The y coordinate', 'Sliding left changes x. The point does not move up or down.'],
        ['A point slides only down.', 'The x coordinate', 'Sliding down changes y. The point does not move left or right.']
      ];
      var d = R.pick(D), all = ['The x coordinate', 'The y coordinate', 'Both coordinates change'];
      var opts = all.map(function (n) { return { text: n, ok: n === d[1], trap: n === d[1] ? undefined : (n === 'Both coordinates change' ? 'Only one direction of movement happens here, so only one coordinate changes.' : 'That is the coordinate that changes. ' + d[2]) }; });
      return Q.choice({
        skill: SK, prompt: d[0] + ' Which coordinate stays the same?', options: opts, work: d[2] + ' So ' + d[1].toLowerCase() + ' stays the same.', plain: 'Left and right change x. Up and down change y. The other coordinate stays.',
        teach: [
          x(d[0], ['which stays?', 'x or y']),
          note('Remember.', 'Direction and coordinate', ['Moving left or right changes x', 'Moving up or down changes y']),
          x(d[2], [d[1], 'stays']),
          x('The answer is ' + d[1].toLowerCase() + '.', [d[1], 'answer'])
        ]
      });
    } },

    { id: 'reflectv', level: 3, name: 'Flip across a vertical line', make: function () {
      var k, px, py = R.int(1, 9), t;
      for (t = 0; t < 60; t++) { k = R.int(2, 7); px = R.int(0, 9); if (px !== k && 2 * k - px >= 0 && 2 * k - px <= 9) break; }
      var nx = 2 * k - px, ask = R.pick(['x', 'x', 'y']), ans = ask === 'x' ? nx : py;
      var traps = ask === 'x' ? [T(String(px), 'That is where the point started. The image is on the other side of the mirror.'), T(String(k), 'That is the mirror line. The image is not on the mirror. It is the same distance behind it.')]
                            : [T(String(nx), 'That is the new x coordinate. A flip across a vertical line does not change y.')];
      return N({
        skill: SK, prompt: 'The point ' + pr(px, py) + ' is flipped across the vertical line x = ' + k + '. What is the ' + ask + ' coordinate of the image?', answer: ans, keyboard: 'numeric', placeholder: 'Type a number', traps: traps,
        work: 'The image is at ' + pr(nx, py) + '. The ' + ask + ' coordinate is ' + ans + '.', plain: 'The image is the same distance from the mirror on the other side. Across a vertical line, y stays the same.',
        teach: flipSteps(px, py, 'v', k, ask)
      });
    } },

    { id: 'reflecth', level: 3, name: 'Flip across a horizontal line', make: function () {
      var k, py, px = R.int(1, 9), t;
      for (t = 0; t < 60; t++) { k = R.int(2, 7); py = R.int(0, 9); if (py !== k && 2 * k - py >= 0 && 2 * k - py <= 9) break; }
      var ny = 2 * k - py, ask = R.pick(['y', 'y', 'x']), ans = ask === 'y' ? ny : px;
      var traps = ask === 'y' ? [T(String(py), 'That is where the point started. The image is on the other side of the mirror.'), T(String(k), 'That is the mirror line. The image is not on the mirror. It is the same distance behind it.')]
                            : [T(String(ny), 'That is the new y coordinate. A flip across a horizontal line does not change x.')];
      return N({
        skill: SK, prompt: 'The point ' + pr(px, py) + ' is flipped across the horizontal line y = ' + k + '. What is the ' + ask + ' coordinate of the image?', answer: ans, keyboard: 'numeric', placeholder: 'Type a number', traps: traps,
        work: 'The image is at ' + pr(px, ny) + '. The ' + ask + ' coordinate is ' + ans + '.', plain: 'The image is the same distance from the mirror on the other side. Across a horizontal line, x stays the same.',
        teach: flipSteps(px, py, 'h', k, ask)
      });
    } },

    { id: 'mirrorline', level: 4, name: 'Find the mirror line', make: function () {
      var k = R.int(2, 6), d = R.int(1, Math.min(k, 9 - k)), a = k - d, b = k + d, vert = R.int(0, 1) === 1, y = R.int(1, 9);
      var A = vert ? pr(a, y) : pr(y, a), Bp = vert ? pr(b, y) : pr(y, b);
      var traps = [T(String(a + b), 'That is the two numbers added. The mirror line is halfway between them, so divide by 2.'), T(String(b - a), 'That is the distance between the points. The mirror line is halfway, so it is a number between them.')];
      return N({
        skill: SK, prompt: 'The point ' + A + ' is flipped and its image is ' + Bp + '. The mirror line is ' + (vert ? 'vertical' : 'horizontal') + ' and has the equation ' + (vert ? 'x' : 'y') + ' = k. What is k?', answer: k, keyboard: 'numeric', placeholder: 'Type a number', traps: traps,
        work: 'The mirror is halfway between ' + a + ' and ' + b + '. (' + a + ' + ' + b + ') ÷ 2 = ' + k + '.', plain: 'The mirror line sits exactly in the middle of a point and its image.',
        teach: [
          x('The point and its image are ' + A + ' and ' + Bp + '. ' + (vert ? 'Only the x coordinate changed, so the mirror is a vertical line.' : 'Only the y coordinate changed, so the mirror is a horizontal line.'), [A, 'point'], ' ', [Bp, 'image']),
          x('The mirror line is exactly halfway between ' + a + ' and ' + b + '.', [String(a), 'point'], ' and ', [String(b), 'image']),
          x('The distance between them is ' + b + ' − ' + a + ' = ' + (b - a) + '. Half of that is ' + d + '.', (b - a) + ' ÷ 2 = ', [String(d), 'half the distance']),
          x('Start at ' + a + ' and go ' + d + ' toward the image. ' + a + ' + ' + d + ' = ' + k + '.', a + ' + ' + d + ' = ', [String(k), 'mirror line']),
          lines('Check on the grid. P and p are the same distance from the mirror.', plot([pt(vert ? a : y, vert ? y : a, 'P'), pt(vert ? b : y, vert ? y : b, 'p')], vert ? { v: k } : { h: k }), 0)
        ]
      });
    } },

    { id: 'halfturn', level: 4, name: 'Half turn about a point', make: function () {
      var cx, cy, qx, qy, t;
      for (t = 0; t < 80; t++) {
        cx = R.int(2, 7); cy = R.int(2, 7); qx = R.int(0, 9); qy = R.int(0, 9);
        if ((qx === cx && qy === cy) || 2 * cx - qx < 0 || 2 * cx - qx > 9 || 2 * cy - qy < 0 || 2 * cy - qy > 9) continue;
        if (qx !== cx && qy !== cy) break;
      }
      var r = rotate(qx, qy, cx, cy, 'half'), ask = R.pick(['x', 'y']), ans = ask === 'x' ? r[0] : r[1], st = ask === 'x' ? qx : qy;
      var traps = [T(String(st), 'That is where the point started. A half turn moves it to the opposite side of the centre.'), T(String(ask === 'x' ? r[1] : r[0]), 'That is the other coordinate of the image. Read the question again for which one it asks.')];
      return N({
        skill: SK, prompt: 'The point Q at ' + pr(qx, qy) + ' is turned a half turn about the centre C at ' + pr(cx, cy) + '. What is the ' + ask + ' coordinate of the image?', answer: ans, keyboard: 'numeric', placeholder: 'Type a number', traps: traps,
        work: 'From C, Q is ' + moveWords(qx - cx, qy - cy) + '. A half turn reverses both. The image is at ' + pr(r[0], r[1]) + '.', plain: 'A half turn sends the point to the opposite side of the centre, the same distance away.',
        teach: turnSteps(qx, qy, cx, cy, 'half', ask)
      });
    } },

    { id: 'shapeslide', level: 4, name: 'Slide a shape', make: function () {
      var bx = R.int(0, 4), by = R.int(0, 4), w = R.int(2, 3), h = R.int(2, 3);
      var dx = R.int(1, Math.min(5, 9 - (bx + w))), dy = R.int(0, Math.min(4, 9 - (by + h)));
      var V = [['A', bx, by], ['B', bx + w, by], ['C', bx, by + h]];
      var pick = R.pick(V), ask = R.pick(['x', 'y']);
      if (dy === 0 && ask === 'y') ask = 'x';
      var nx = pick[1] + dx, ny = pick[2] + dy, ans = ask === 'x' ? nx : ny, st = ask === 'x' ? pick[1] : pick[2];
      var list = V.map(function (v) { return v[0] + pr(v[1], v[2]); }).join(', ');
      var img = V.map(function (v) { return pt(v[1] + dx, v[2] + dy, v[0].toLowerCase()); });
      var orig = V.map(function (v) { return pt(v[1], v[2], v[0]); });
      var traps = [T(String(st), 'That is the coordinate of the corner before the slide. The image has moved.')];
      return N({
        skill: SK, prompt: 'Triangle ABC has corners ' + list + '. It slides ' + moveWords(dx, dy) + '. What is the ' + ask + ' coordinate of the image of corner ' + pick[0] + '?', answer: ans, keyboard: 'numeric', placeholder: 'Type a number', traps: traps,
        work: pick[0] + pr(pick[1], pick[2]) + ' becomes ' + pick[0].toLowerCase() + pr(pick[1] + dx, pick[2] + dy) + '. The ' + ask + ' coordinate is ' + ans + '.', plain: 'Every corner slides the same way. Just slide the corner you were asked about.',
        teach: [
          x('Every corner of the triangle slides ' + moveWords(dx, dy) + '. We only need corner ' + pick[0] + '.', [pick[0] + pr(pick[1], pick[2]), 'start']),
          lines('Here are the corners of the triangle.', plot(orig, null, bounds(orig.concat(img))), 0),
          x('Right adds to x. ' + pick[1] + ' + ' + dx + ' = ' + (pick[1] + dx) + '.', pick[1] + ' + ' + dx + ' = ', [String(pick[1] + dx), 'new x']),
          x(dy > 0 ? 'Up adds to y. ' + pick[2] + ' + ' + dy + ' = ' + (pick[2] + dy) + '.' : 'The slide does not go up or down, so y stays ' + pick[2] + '.', dy > 0 ? pick[2] + ' + ' + dy + ' = ' : 'y = ', [String(pick[2] + dy), 'new y']),
          lines('The image corners are the small letters.', plot(orig.concat(img), null, bounds(orig.concat(img))), 0),
          x('Corner ' + pick[0].toLowerCase() + ' is at ' + pr(pick[1] + dx, pick[2] + dy) + '. The ' + ask + ' coordinate is ' + ans + '.', [String(ans), ask + ' coordinate'])
        ]
      });
    } },

    { id: 'congruent', level: 3, name: 'Congruent images', make: function () {
      var mv = R.pick(['slid 5 units to the right', 'flipped over a line', 'turned a quarter turn about a corner', 'turned a half turn about its centre', 'slid 3 units up']);
      var t = R.int(0, 3), a, b, p, ans, unit, tr, work;
      if (t === 0) { a = R.int(4, 9); b = R.int(2, a - 1); p = 'A rectangle is ' + a + ' cm long and ' + b + ' cm wide. It is ' + mv + '. How long is the long side of the image, in cm?'; ans = a; tr = [T(String(b), 'That is the short side. The question asks about the long side.')]; work = 'The image is congruent, so the long side is still ' + a + ' cm.'; }
      else if (t === 1) { a = R.int(9, 24); p = 'A triangle has a perimeter of ' + a + ' cm. It is ' + mv + '. What is the perimeter of the image, in cm?'; ans = a; tr = [T(String(a * 2), 'A slide, flip or turn does not make a shape bigger. The image has the same perimeter.')]; work = 'The image is congruent, so the perimeter is still ' + a + ' cm.'; }
      else if (t === 2) { a = R.int(2, 8); b = R.int(3, 9); p = 'A rectangle is ' + a + ' cm by ' + b + ' cm. It is ' + mv + '. What is the area of the image, in square cm?'; ans = a * b; tr = [T(String(2 * (a + b)), 'That is the perimeter. The question asks for area, which is length times width.')]; work = 'The image has the same size, so the area is ' + a + ' × ' + b + ' = ' + ans + ' square cm.'; }
      else { a = R.pick([30, 40, 45, 50, 60, 70, 80, 110, 120]); p = 'One angle of a triangle measures ' + a + '°. The triangle is ' + mv + '. What does the matching angle of the image measure, in degrees?'; ans = a; tr = [T(String(180 - a), 'That is the angle you would use to reach 180. The matching angle has the same size as the first angle.')]; work = 'The image is congruent, so the matching angle is still ' + a + '°.'; }
      return N({
        skill: SK, prompt: p, answer: ans, keyboard: 'numeric', placeholder: 'Type a number', traps: tr, work: work, plain: 'Slides, flips and turns do not change the size or shape. The image matches the first shape exactly.',
        teach: [
          x('The shape is ' + mv + '. Ask what a slide, flip or turn changes.', ['slide, flip, turn', 'moves the shape']),
          x('These moves never change the size or the shape. The image is congruent to the first shape.', ['congruent', 'same size and shape']),
          note('What stays the same?', 'Congruent shapes', ['Side lengths', 'Angles', 'Perimeter', 'Area']),
          x(work, [String(ans), 'answer'])
        ]
      });
    } },

    { id: 'quarterturn', level: 5, name: 'Quarter turn about a point', make: function () {
      var cx, cy, qx, qy, t, turn = R.pick(['cw', 'ccw']), r;
      for (t = 0; t < 200; t++) {
        cx = R.int(1, 8); cy = R.int(1, 8); qx = R.int(0, 9); qy = R.int(0, 9);
        if (qx === cx && qy === cy) continue;
        if (qx === cx || qy === cy) { if (R.int(0, 2) > 0) continue; }
        r = rotate(qx, qy, cx, cy, turn);
        if (r[0] < 0 || r[0] > 9 || r[1] < 0 || r[1] > 9) continue;
        break;
      }
      var other = rotate(qx, qy, cx, cy, turn === 'cw' ? 'ccw' : 'cw'), half = rotate(qx, qy, cx, cy, 'half');
      var ask = R.pick(['x', 'y']), ai = ask === 'x' ? 0 : 1, ans = r[ai];
      var traps = [T(String(other[ai]), 'That is what you get by turning the other way. Check clockwise and counterclockwise again.'), T(String(half[ai]), 'That is a half turn. This is only a quarter turn.'), T(String(ask === 'x' ? qx : qy), 'That is where the point started. It has moved.')];
      return N({
        skill: SK, prompt: 'The point Q at ' + pr(qx, qy) + ' is turned ' + TURNW[turn] + ' about the centre C at ' + pr(cx, cy) + '. What is the ' + ask + ' coordinate of the image?', answer: ans, keyboard: 'numeric', placeholder: 'Type a number', traps: traps,
        work: 'From C, Q is ' + moveWords(qx - cx, qy - cy) + '. After the turn it is ' + moveWords(r[0] - cx, r[1] - cy) + ' from C. The image is at ' + pr(r[0], r[1]) + '.', plain: turn === 'cw' ? 'Picture a clock hand. Clockwise turns right into down, down into left, left into up and up into right.' : 'Picture a clock hand. Counterclockwise turns right into up, up into left, left into down and down into right.',
        teach: turnSteps(qx, qy, cx, cy, turn, ask)
      });
    } },

    { id: 'reflectshape', level: 5, name: 'Flip a shape', make: function () {
      var k = R.int(4, 5), lo = R.int(1, k - 2), hi = R.int(lo + 1, k - 1), y1 = R.int(1, 3), y2 = y1 + R.int(2, 4);
      var ask = R.pick(['largest', 'smallest']), ans = ask === 'largest' ? 2 * k - lo : 2 * k - hi, st = ask === 'largest' ? hi : lo;
      var corners = pr(lo, y1) + ', ' + pr(hi, y1) + ', ' + pr(hi, y2) + ' and ' + pr(lo, y2);
      var orig = [pt(lo, y1, 'A'), pt(hi, y1, 'B'), pt(hi, y2, 'C'), pt(lo, y2, 'D')];
      var img = [pt(2 * k - lo, y1, 'a'), pt(2 * k - hi, y1, 'b'), pt(2 * k - hi, y2, 'c'), pt(2 * k - lo, y2, 'd')];
      var traps = [T(String(st), 'That is an x coordinate of the first rectangle. The image is on the other side of the mirror.'), T(String(ask === 'largest' ? 2 * k - hi : 2 * k - lo), 'That is the ' + (ask === 'largest' ? 'smallest' : 'largest') + ' x coordinate of the image. Check which one the question asks for.')];
      return N({
        skill: SK, prompt: 'A rectangle has corners at ' + corners + '. It is flipped across the vertical line x = ' + k + '. What is the ' + ask + ' x coordinate of the image?', answer: ans, keyboard: 'numeric', placeholder: 'Type a number', traps: traps,
        work: 'Each x becomes 2 × ' + k + ' minus x. ' + lo + ' becomes ' + (2 * k - lo) + ' and ' + hi + ' becomes ' + (2 * k - hi) + '. The ' + ask + ' is ' + ans + '.', plain: 'Flip each corner. The corner farthest from the mirror lands farthest on the other side.',
        teach: [
          x('The rectangle has x coordinates ' + lo + ' and ' + hi + '. The mirror is the vertical line x = ' + k + '.', [String(lo), 'left side'], ' ', [String(hi), 'right side'], ' mirror ', ['x = ' + k, 'line']),
          lines('Here is the rectangle and the mirror.', plot(orig, { v: k }, bounds(orig.concat(img))), 0),
          x('The side at x = ' + lo + ' is ' + (k - lo) + ' from the mirror. Its image is ' + (k - lo) + ' past the mirror. ' + k + ' + ' + (k - lo) + ' = ' + (2 * k - lo) + '.', k + ' + ' + (k - lo) + ' = ', [String(2 * k - lo), 'image of ' + lo]),
          x('The side at x = ' + hi + ' is ' + (k - hi) + ' from the mirror. Its image is ' + k + ' + ' + (k - hi) + ' = ' + (2 * k - hi) + '.', k + ' + ' + (k - hi) + ' = ', [String(2 * k - hi), 'image of ' + hi]),
          lines('The image rectangle is drawn with small letters.', plot(orig.concat(img), { v: k }, bounds(orig.concat(img))), 0),
          x('The ' + ask + ' x coordinate of the image is ' + ans + '.', [String(ans), 'answer'])
        ]
      });
    } },

    { id: 'combo', level: 6, name: 'Two moves in a row', make: function () {
      var px, py, dx, dy, k, vert, sx, sy, t, fx, fy;
      for (t = 0; t < 300; t++) {
        px = R.int(0, 5); py = R.int(0, 5); dx = R.int(1, 5); dy = R.int(0, 4);
        sx = px + dx; sy = py + dy; vert = R.int(0, 1) === 1; k = R.int(2, 8);
        if (sx > 9 || sy > 9) continue;
        if (vert) { fx = 2 * k - sx; fy = sy; if (fx === sx || fx < 0 || fx > 9) continue; }
        else { fx = sx; fy = 2 * k - sy; if (fy === sy || fy < 0 || fy > 9) continue; }
        break;
      }
      var ask = R.pick(['x', 'y']), ans = ask === 'x' ? fx : fy;
      var who = R.pick(WHO);
      var traps = [T(String(ask === 'x' ? sx : sy), 'That is the coordinate after the slide only. You still need to do the flip.'), T(String(ask === 'x' ? px : py), 'That is where the point started. It has moved twice.')];
      var line = (vert ? 'vertical line x = ' : 'horizontal line y = ') + k;
      return N({
        skill: SK, prompt: 'A point starts at ' + pr(px, py) + '. First it slides ' + moveWords(dx, dy) + '. Then it is flipped across the ' + line + '. What is the ' + ask + ' coordinate of the final image?', answer: ans, keyboard: 'numeric', placeholder: 'Type a number', traps: traps,
        work: 'After the slide the point is at ' + pr(sx, sy) + '. After the flip it is at ' + pr(fx, fy) + '. The ' + ask + ' coordinate is ' + ans + '.', plain: 'Do the slide first and write the new point. Then flip that new point.',
        teach: [
          x('There are two moves. Do the slide first, then the flip.', ['(' + px + ', ' + py + ')', 'start'], ' → slide → flip'),
          x('Slide. Right adds to x: ' + px + ' + ' + dx + ' = ' + sx + '. ' + (dy > 0 ? 'Up adds to y: ' + py + ' + ' + dy + ' = ' + sy + '.' : 'y stays ' + py + '.'), 'After the slide: ', [pr(sx, sy), 'new start']),
          x('Now flip ' + pr(sx, sy) + ' across the ' + line + '. The distance from the mirror is ' + Math.abs((vert ? sx : sy) - k) + '.', ['distance', String(Math.abs((vert ? sx : sy) - k))]),
          x('The image is the same distance on the other side. ' + k + ((vert ? sx : sy) < k ? ' + ' : ' − ') + Math.abs((vert ? sx : sy) - k) + ' = ' + (vert ? fx : fy) + '. The other coordinate stays the same.', k + ((vert ? sx : sy) < k ? ' + ' : ' − ') + Math.abs((vert ? sx : sy) - k) + ' = ', [String(vert ? fx : fy), vert ? 'new x' : 'new y']),
          lines('The start is P, the point after the slide is S, and the final image is f.', plot([pt(px, py, 'P'), pt(sx, sy, 'S'), pt(fx, fy, 'f')], vert ? { v: k } : { h: k }, bounds([pt(px, py), pt(sx, sy), pt(fx, fy), pt(vert ? k : 0, vert ? 0 : k)])), 0),
          x('The final image is at ' + pr(fx, fy) + '. The ' + ask + ' coordinate is ' + ans + '.', [String(ans), ask + ' coordinate'])
        ]
      });
    } }
  ]);
})();
