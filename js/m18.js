/* Module 18: Graphs and Tables. Lessons, vocabulary and question skills. */
(function () {
  'use strict';
  var B = window.Bank, R = B.R, S = B.s, Q = B.q, T = Q.trap;
  var x = S.x, note = S.note, bars = S.bars, row = S.row, lines = S.lines;

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
  function pad(s, n) { s = String(s); while (s.length < n) s += ' '; return s; }
  function lpad(s, n) { s = String(s); while (s.length < n) s = ' ' + s; return s; }
  var COLORS = ['bg-indigo-400', 'bg-emerald-400', 'bg-amber-300', 'bg-rose-400', 'bg-teal-500', 'bg-sky-400'];

  /* Contexts for categories. one(name) asks about a single category. */
  var CTX = [
    { key: 'pets', intro: 'A class voted for their favourite pet.', h1: 'Pet', h2: 'Votes', unit: 'votes', cats: ['Cats', 'Dogs', 'Fish', 'Birds', 'Rabbits', 'Hamsters'], one: function (n) { return 'How many votes did ' + n + ' get?'; } },
    { key: 'fruit', intro: 'Students picked a favourite fruit for snack time.', h1: 'Fruit', h2: 'Votes', unit: 'votes', cats: ['Apples', 'Bananas', 'Grapes', 'Oranges', 'Pears', 'Berries'], one: function (n) { return 'How many votes did ' + n + ' get?'; } },
    { key: 'sports', intro: 'Grade 5 students signed up for after school sports.', h1: 'Sport', h2: 'Students', unit: 'students', cats: ['Soccer', 'Hockey', 'Swimming', 'Tennis', 'Basketball', 'Badminton'], one: function (n) { return 'How many students signed up for ' + n + '?'; } },
    { key: 'books', intro: 'A school library counted the books that were borrowed.', h1: 'Type', h2: 'Books', unit: 'books', cats: ['Comic', 'Mystery', 'Science', 'Poetry', 'Fantasy', 'History'], one: function (n) { return 'How many ' + n + ' books were borrowed?'; } },
    { key: 'days', intro: 'Rinka sold cups of lemonade on five days.', h1: 'Day', h2: 'Cups', unit: 'cups', days: true, cats: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], one: function (n) { return 'How many cups were sold on ' + n + '?'; } }
  ];

  /* Make a data set with n categories and distinct values between lo and hi, all multiples of step. */
  function mkData(n, lo, hi, step) {
    step = step || 1;
    var ctx = R.pick(CTX), names;
    names = ctx.days ? ctx.cats.slice(0, Math.min(n, 5)) : R.shuffle(ctx.cats).slice(0, n);
    var m = names.length, vals = [], tries = 0;
    while (tries < 200) {
      vals = [];
      for (var i = 0; i < m; i++) vals.push(R.int(Math.ceil(lo / step), Math.floor(hi / step)) * step);
      var u = {}, ok = true;
      vals.forEach(function (v) { if (u[v]) ok = false; u[v] = 1; });
      if (ok) break;
      tries++;
    }
    return { ctx: ctx, names: names, vals: vals };
  }
  function listStr(names, vals) { return names.map(function (n, i) { return n + ' ' + vals[i]; }).join(', '); }
  function tableLines(d) {
    var w = d.ctx.h1.length;
    d.names.forEach(function (n) { if (n.length > w) w = n.length; });
    w += 3;
    var out = [pad(d.ctx.h1, w) + d.ctx.h2];
    d.names.forEach(function (n, i) { out.push(pad(n, w) + d.vals[i]); });
    return out;
  }
  function graphRows(names, vals, s) {
    return names.map(function (n, i) { return row(n + ' ' + vals[i], vals[i] / (s || 1), COLORS[i % COLORS.length], ''); });
  }
  function rowLine(d, i) { var w = d.ctx.h1.length; d.names.forEach(function (n) { if (n.length > w) w = n.length; }); return pad(d.names[i], w + 3) + d.vals[i]; }
  function idxMax(v) { var k = 0; v.forEach(function (a, i) { if (a > v[k]) k = i; }); return k; }
  function idxMin(v) { var k = 0; v.forEach(function (a, i) { if (a < v[k]) k = i; }); return k; }

  /* A vertical scale drawn with text. h is how many lines tall the bar is. half means the bar ends between lines. */
  function vscale(s, top, h, half) {
    var out = [], st = half ? 2 : 1;
    for (var r = top * st; r >= 0; r--) {
      var lab = r % st === 0 ? lpad((r / st) * s, 4) : '    ';
      var tip = r <= h * st ? '  ####' : '';
      var mark = r === h * st ? '   <= top of the bar' : '';
      out.push(lab + ' |' + tip + mark);
    }
    out.push('     ==========');
    return out;
  }
  /* A line graph drawn with text. Values must be multiples of step. */
  function lineSketch(labels, vals, step, top) {
    var out = [];
    for (var lv = top; lv >= 0; lv -= step) {
      var ln = lpad(lv, 3) + ' |';
      for (var i = 0; i < vals.length; i++) ln += vals[i] === lv ? '  *   ' : '      ';
      out.push(ln);
    }
    var ax = '    +';
    var lb = '     ';
    for (var j = 0; j < vals.length; j++) { ax += '______'; lb += ' ' + pad(labels[j], 5); }
    out.push(ax);
    out.push(lb);
    return out;
  }
  function stars(n, half) {
    var s = [];
    for (var i = 0; i < n; i++) s.push('*');
    if (half) s.push('½');
    return s.join(' ');
  }

  /* ---------- Vocabulary ---------- */
  window.MATH_VOCAB[18] = [
    { w: 'Data', m: 'Facts and numbers we collect, like how many students chose each pet.' },
    { w: 'Table', m: 'Data written in rows and columns so it is easy to find and read.' },
    { w: 'Bar graph', m: 'A graph that uses bars. A taller bar means a bigger number.' },
    { w: 'Scale', m: 'The numbers along the side of a graph. It can count by 1s, 2s, 5s, 10s or more.' },
    { w: 'Pictograph', m: 'A graph that uses small pictures or symbols. A key tells what each symbol is worth.' },
    { w: 'Key', m: 'The note on a pictograph that tells how many things one symbol stands for.' },
    { w: 'Line graph', m: 'A graph with dots joined by lines. It shows how something changes over time.' },
    { w: 'Range', m: 'The biggest number minus the smallest number. It tells how spread out the data is.' }
  ];

  /* ---------- Lessons ---------- */
  window.MATH_LESSONS[18] = [
    { title: '1. What is data?',
      explain: [
        'Data means information that we collect. If you ask your class which pet they like best, the answers are data.',
        'One good way to keep data tidy is to count with tally marks. Each little stick is one answer. Every fifth answer crosses the four sticks like a gate.',
        'After you count, you can write the numbers in a table. A table has rows and columns, so you can find any number quickly.'
      ],
      rule: 'Data is information. Count it, then keep it tidy in a table.',
      mistake: 'Do not forget to count every mark. A gate of five tally marks counts as 5, not 1.',
      steps: [
        note('Rinka asks 12 friends to pick a favourite pet. She writes each answer down.', 'Collecting data', ['Ask a question', 'Write each answer as a tally mark', 'Count the marks']),
        lines('Here are her tally marks. Each stick is one friend.', ['Cats   | | | | |', 'Dogs   | | | | | | |', 'Fish   | |'], 0),
        lines('Count each row. Cats has 5, Dogs has 7 and Fish has 2.', ['Cats   5', 'Dogs   7', 'Fish   2'], 0),
        lines('Now put the counts in a table. The left column has the names. The right column has the numbers.', ['Pet    Votes', 'Cats   5', 'Dogs   7', 'Fish   2'], 0),
        x('Check the table. 5 + 7 + 2 = 14 marks in all.', '5 + 7 + 2 = ', ['14', 'total'])
      ] },

    { title: '2. Reading a table',
      explain: [
        'To read a table, first look at the headings. The headings tell you what each column means.',
        'Then find the row you want. Slide your finger across that row until you reach the number.',
        'A table can also help you add. Add the numbers in the column to find the total.'
      ],
      rule: 'Read the headings. Find the row. Read across to the number.',
      mistake: 'Do not read the wrong row. Put your finger on the name first, then slide across.',
      steps: [
        lines('Here is a table of muffins sold at a bake sale.', ['Day    Muffins', 'Mon    12', 'Tue    8', 'Wed    15', 'Thu    10'], 0),
        note('Look at the headings first.', 'The headings', ['Day names each row', 'Muffins is the number sold']),
        lines('How many muffins were sold on Wed? Find the Wed row.', ['Wed    15'], 0),
        x('Slide across to the number. On Wed they sold 15.', 'Wed = ', ['15', 'muffins']),
        x('How many were sold in all? Add the column: 12 + 8 = 20.', '12 + 8 = ', ['20', 'so far']),
        x('Keep adding. 20 + 15 = 35. Then 35 + 10 = 45.', '35 + 10 = ', ['45', 'total'])
      ] },

    { title: '3. The parts of a bar graph',
      explain: [
        'A bar graph uses bars to show numbers. A tall bar means a big number. A short bar means a small number.',
        'Every good graph has a title that tells what it is about. It also has labels for each bar and a scale of numbers along the side.',
        'The bars are all the same width. Only the length changes.'
      ],
      rule: 'Look at the title, the labels and the scale before you read the bars.',
      mistake: 'Do not judge the graph by the picture alone. Read the numbers on the scale.',
      steps: [
        note('A bar graph has four parts.', 'Parts of a bar graph', ['Title: what the graph is about', 'Labels: names of the bars', 'Scale: the numbers on the side', 'Bars: the data']),
        bars('Here is a graph of pets. Each box in a bar is one vote.', [row('Cats 6', 6, 'bg-indigo-400', ''), row('Dogs 9', 9, 'bg-emerald-400', ''), row('Fish 3', 3, 'bg-amber-300', '')]),
        x('Dogs has the longest bar. So Dogs got the most votes.', ['Dogs', 'longest bar'], ' = ', ['9', 'most']),
        x('Fish has the shortest bar. So Fish got the fewest votes.', ['Fish', 'shortest bar'], ' = ', ['3', 'fewest']),
        note('Always check the scale to know what one box is worth.', 'Before you read', ['Read the title', 'Read the labels', 'Check the scale'])
      ] },

    { title: '4. Reading the scale',
      explain: [
        'The scale is the row of numbers beside the bars. Sometimes it counts by 1s. Often it counts by 2s, 5s or 10s.',
        'First find out how much each line is worth. Look at two lines that are next to each other and find the jump between them.',
        'If a bar ends halfway between two lines, its value is halfway between those two numbers.'
      ],
      rule: 'Find the jump between two lines. Then count by that jump.',
      mistake: 'Do not count every line as 1. If the scale counts by 5, each line is worth 5.',
      steps: [
        lines('This scale counts by 5. The bar reaches the 3rd line above zero.', vscale(5, 4, 3, false), 0),
        x('Each line is worth 5. Count by 5s: 5, 10, 15.', '3 lines × 5 = ', ['15', 'value']),
        lines('Now look at a bar that ends halfway between 10 and 15.', vscale(5, 4, 2.5, true), 0),
        x('Halfway between 10 and 15 is 12 and a half. But halves of 5 are awkward.', '10 + 5 ÷ 2 = ', ['12.5', 'halfway']),
        x('Try a scale that counts by 10. A bar halfway between 20 and 30 is 25.', '20 + 10 ÷ 2 = ', ['25', 'halfway']),
        note('Three steps for every scale.', 'Reading a scale', ['Find the jump between two lines', 'Count the lines up to the bar', 'If it is halfway, add half a jump'])
      ] },

    { title: '5. Pictographs and the key',
      explain: [
        'A pictograph uses small pictures or symbols instead of bars. Every symbol stands for a number of things.',
        'The key tells you what one symbol is worth. It might say one star equals 4 students. Always read the key first.',
        'To read a row, count the symbols. Then multiply by the number in the key.'
      ],
      rule: 'Count the symbols. Multiply by the number in the key.',
      mistake: 'Do not say 6 stars means 6 students. If the key says one star equals 4, then 6 stars means 6 × 4 = 24.',
      steps: [
        lines('Here is a pictograph. The key comes first.', ['Key: * = 4 students', 'Soccer   * * * * * *', 'Hockey   * * * *'], 1),
        x('Soccer has 6 stars. Each star is 4 students.', ['6', 'stars'], ' × ', ['4', 'key'], ' = ?'),
        x('Count by 4s: 4, 8, 12, 16, 20, 24. So 6 × 4 = 24.', '6 × 4 = ', ['24', 'students']),
        x('Hockey has 4 stars. 4 × 4 = 16.', '4 × 4 = ', ['16', 'students']),
        x('The key changes the answer. If the key said 1 star = 10, Soccer would be 60.', '6 × 10 = ', ['60', 'new key'])
      ] },

    { title: '6. Half symbols',
      explain: [
        'Sometimes a row ends with half a symbol. Half a symbol is worth half of the number in the key.',
        'If one star is 6 books, then half a star is 3 books. Find half by dividing the key by 2.',
        'Work out the whole stars first. Then add the half.'
      ],
      rule: 'Whole symbols × key. Then add half of the key for a half symbol.',
      mistake: 'A half symbol is not worth 1. It is worth half of the key number.',
      steps: [
        lines('The key says one star is 6 books. This row has 3 whole stars and a half.', ['Key: * = 6 books', 'Mystery   * * * ½'], 1),
        x('First the whole stars. 3 × 6 = 18.', '3 × 6 = ', ['18', 'whole stars']),
        x('The half star is half of 6. That is 3.', '6 ÷ 2 = ', ['3', 'half star']),
        x('Add them together. 18 + 3 = 21.', '18 + 3 = ', ['21', 'books']),
        note('Do the same every time.', 'Steps', ['Count the whole symbols', 'Multiply by the key', 'Add half the key for a half symbol'])
      ] },

    { title: '7. Most, least and how many more',
      explain: [
        'The most is the biggest number. The least is the smallest number. On a bar graph the most is the longest bar.',
        'To find how many more, take away. Subtract the smaller number from the bigger number.',
        'A bar model makes this easy to see. The gap between two bars is the difference.'
      ],
      rule: 'How many more? Big number minus small number.',
      mistake: 'Do not add when the question says how many more. Take away to find the gap.',
      steps: [
        bars('Dogs got 9 votes. Cats got 6 votes.', [row('Dogs 9', 9, 'bg-emerald-400', ''), row('Cats 6', 6, 'bg-indigo-400', '')]),
        bars('Line up the first 6 boxes. Now look at the extra boxes on the Dogs bar.', [row('Dogs 9', 6, 'bg-emerald-400', ''), row('Cats 6', 6, 'bg-indigo-400', '')]),
        x('The extra part is the difference. 9 − 6 = 3.', '9 − 6 = ', ['3', 'more']),
        x('So Dogs got 3 more votes than Cats.', ['Dogs', 'more'], ' got ', ['3 more', 'difference']),
        x('Check by adding. 6 + 3 = 9. Yes, it matches.', '6 + 3 = ', ['9', 'check'])
      ] },

    { title: '8. Totals from a graph',
      explain: [
        'To find a total, read every bar and add the numbers.',
        'Sometimes you only need some of the bars. Read the question to see which ones you need.',
        'A bar model helps. Draw each bar as a part, and the total is all the parts together.'
      ],
      rule: 'Read each bar. Add the numbers you need.',
      mistake: 'Do not add bars the question does not ask for. Check which categories count.',
      steps: [
        bars('Here are three bars. Cats 6, Dogs 9, Fish 3.', [row('Cats 6', 6, 'bg-indigo-400', ''), row('Dogs 9', 9, 'bg-emerald-400', ''), row('Fish 3', 3, 'bg-amber-300', '')]),
        x('How many votes in all? Add 6 + 9 first.', '6 + 9 = ', ['15', 'so far']),
        x('Then add the last bar. 15 + 3 = 18.', '15 + 3 = ', ['18', 'total']),
        x('Now a smaller question. Cats and Fish together is 6 + 3.', '6 + 3 = ', ['9', 'Cats and Fish']),
        x('Dogs alone is also 9. So Dogs equals Cats and Fish together.', ['9', 'Dogs'], ' = ', ['9', 'Cats + Fish'])
      ] },

    { title: '9. Double bar graphs',
      explain: [
        'A double bar graph puts two bars side by side for each category. It lets you compare two groups at once.',
        'A key tells which color belongs to which group. For example, one color for Grade 4 and another for Grade 5.',
        'In these questions we write the two sets of bars as two lists. Read the two lists carefully.'
      ],
      rule: 'Check the key. Compare the two bars in the same category.',
      mistake: 'Do not mix up the two groups. Check the key to see which bar is which.',
      steps: [
        lines('Pizza votes. Grade 4 and Grade 5 each voted for a topping.', ['Topping    Gr 4   Gr 5', 'Cheese     8      12', 'Ham        6      5', 'Veggie     4      9'], 0),
        bars('Look at Cheese. Two bars sit side by side.', [row('Grade 4: Cheese 8', 8, 'bg-indigo-400', ''), row('Grade 5: Cheese 12', 12, 'bg-emerald-400', '')]),
        x('How many voted for Cheese in both grades? Add 8 + 12.', '8 + 12 = ', ['20', 'together']),
        x('How many more in Grade 5 than Grade 4? Subtract 12 − 8.', '12 − 8 = ', ['4', 'more']),
        x('Now Ham. Grade 4 had 6 and Grade 5 had 5. Grade 4 had 1 more.', '6 − 5 = ', ['1', 'more in Grade 4'])
      ] },

    { title: '10. Line graphs',
      explain: [
        'A line graph shows how something changes over time. Each dot is a measurement, and a line joins the dots.',
        'If the line goes up, the number is growing. If it goes down, the number is getting smaller. A flat line means no change.',
        'To find a change, read two dots and take away. The steeper the line, the bigger the change.'
      ],
      rule: 'Read two dots. Subtract to find the change.',
      mistake: 'A line going up does not always mean a big number. Read the dot on the scale.',
      steps: [
        lines('A plant was measured each week. The scale counts by 2 cm.', lineSketch(['W1', 'W2', 'W3', 'W4'], [2, 4, 6, 10], 2, 10), 0),
        x('Read each dot. Week 1 is 2 cm, Week 2 is 4 cm, Week 3 is 6 cm, Week 4 is 10 cm.', ['2', 'W1'], ', ', ['4', 'W2'], ', ', ['6', 'W3'], ', ', ['10', 'W4']),
        x('How much did it grow from Week 2 to Week 4? Subtract 10 − 4.', '10 − 4 = ', ['6', 'cm']),
        x('Which week had the biggest jump? Week 3 to 4 grew 4 cm. The others grew 2 cm.', '10 − 6 = ', ['4', 'biggest jump']),
        note('The line was steepest between Week 3 and Week 4.', 'Steep lines', ['Steep means a big change', 'Flat means no change'])
      ] },

    { title: '11. Range and choosing a graph',
      explain: [
        'The range tells how spread out the data is. Find the biggest number and the smallest number. Then subtract.',
        'Different graphs are good for different jobs. A bar graph compares categories. A line graph shows change over time.',
        'A double bar graph compares two groups. A pictograph is good when you want to count in big steps with a key.'
      ],
      rule: 'Range = biggest minus smallest. Pick the graph that fits the job.',
      mistake: 'Do not use a line graph for separate categories like pets. Lines are for change over time.',
      steps: [
        x('Find the range of the temperatures 14, 9, 17, 12.', ['14, 9, 17, 12', 'data']),
        x('The biggest number is 17.', ['17', 'biggest']),
        x('The smallest number is 9.', ['9', 'smallest']),
        x('Subtract: 17 − 9 = 8. The range is 8.', '17 − 9 = ', ['8', 'range']),
        note('Match the job to the graph.', 'Choosing a graph', ['Compare categories: bar graph', 'Change over time: line graph', 'Compare two groups: double bar graph', 'Count in big steps: pictograph'])
      ] }
  ];

  /* ---------- Question skills ---------- */
  B.register(18, [

    { id: 'tableread', level: 1, name: 'Read a table', make: function () {
      var d = mkData(R.pick([4, 5]), 3, 30), k = R.int(0, d.names.length - 1), name = d.names[k], v = d.vals[k];
      return N({
        skill: 'Read a table', prompt: d.ctx.intro + ' The table shows: ' + listStr(d.names, d.vals) + '. ' + d.ctx.one(name),
        answer: v, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(d.vals[(k + 1) % d.vals.length]), 'That is the number in a different row. Find the row named ' + name + ' and read across.')],
        work: 'The row for ' + name + ' shows ' + v + '.', plain: 'Find the name in the table, then read the number beside it.',
        teach: [
          x('We need the number for ' + name + '.', [name, 'find this row']),
          lines('Here is the table. Each row has a name and a number.', tableLines(d), 0),
          lines('Find the row named ' + name + '. Read across to its number.', [rowLine(d, k)], 0),
          x('The number in that row is ' + v + '.', name + ' = ', [String(v), 'answer'])
        ]
      });
    } },

    { id: 'tabletotal', level: 1, name: 'Add the numbers in a table', make: function () {
      var d = mkData(R.pick([3, 4]), 2, 25), sum = d.vals.reduce(function (a, b) { return a + b; }, 0);
      var steps = [x('We add every number in the table.', [d.vals.join(' + '), 'add all'])];
      steps.push(lines('Here is the table.', tableLines(d), 0));
      var run = d.vals[0];
      for (var i = 1; i < d.vals.length; i++) {
        steps.push(x('Add the next number. ' + run + ' + ' + d.vals[i] + ' = ' + (run + d.vals[i]) + '.', run + ' + ' + d.vals[i] + ' = ', [String(run + d.vals[i]), i === d.vals.length - 1 ? 'total' : 'so far']));
        run += d.vals[i];
      }
      return N({
        skill: 'Total from a table', prompt: d.ctx.intro + ' The table shows: ' + listStr(d.names, d.vals) + '. How many ' + d.ctx.unit + ' is that altogether?',
        answer: sum, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(sum - d.vals[d.vals.length - 1]), 'You left out the last row. Add every row in the table.')],
        work: d.vals.join(' + ') + ' = ' + sum + '.', plain: 'Altogether means add every number.',
        teach: steps
      });
    } },

    { id: 'mostleast', level: 1, name: 'Most and least', make: function () {
      var d = mkData(R.pick([4, 5]), 3, 28), wantMost = R.int(0, 1) === 1, wantNum = R.int(0, 2) === 0;
      var k = wantMost ? idxMax(d.vals) : idxMin(d.vals), word = wantMost ? 'most' : 'least';
      var head = d.ctx.intro + ' The bar graph shows: ' + listStr(d.names, d.vals) + '. ';
      var st = [
        x('Look for the ' + (wantMost ? 'biggest' : 'smallest') + ' number.', ['Find the ' + word, wantMost ? 'longest bar' : 'shortest bar']),
        bars('Here are the bars. Each box is one.', graphRows(d.names, d.vals, 1)),
        x('Compare every bar, not just two. The ' + (wantMost ? 'longest' : 'shortest') + ' bar is ' + d.names[k] + ', with ' + d.vals[k] + '.', [d.names[k], word], ' = ', [String(d.vals[k]), 'value']),
        note('Check your pick against the other bars.', 'Double check', ['Every other bar is ' + (wantMost ? 'shorter' : 'longer'), 'So ' + d.names[k] + ' has the ' + word])
      ];
      if (wantNum) {
        return N({
          skill: 'Most and least', prompt: head + 'What is the ' + (wantMost ? 'greatest' : 'smallest') + ' number in the graph?',
          answer: d.vals[k], keyboard: 'numeric', placeholder: 'Type a number',
          traps: [T(String(wantMost ? d.vals[idxMin(d.vals)] : d.vals[idxMax(d.vals)]), 'That is the ' + (wantMost ? 'smallest' : 'biggest') + ' number. Read the question again.')],
          work: 'The ' + (wantMost ? 'longest' : 'shortest') + ' bar is ' + d.names[k] + ' at ' + d.vals[k] + '.', plain: 'Compare all the bars. Pick the ' + (wantMost ? 'longest' : 'shortest') + ' one.',
          teach: st
        });
      }
      var opts = [{ text: d.names[k], ok: true }];
      d.names.forEach(function (n, i) {
        if (i !== k && opts.length < 4) opts.push({ text: n, ok: false, trap: n + ' had ' + d.vals[i] + ', which is not the ' + word + '. Compare all the numbers.' });
      });
      return Q.choice({
        skill: 'Most and least', prompt: head + 'Which one had the ' + word + '?', options: opts,
        work: d.names[k] + ' has ' + d.vals[k] + ', which is the ' + word + '.', plain: 'Compare every number. Pick the ' + (wantMost ? 'biggest' : 'smallest') + ' one.',
        teach: st
      });
    } },

    { id: 'howmanymore', level: 2, name: 'How many more', make: function () {
      var d = mkData(4, 3, 30), i = R.int(0, 3), j = (i + R.int(1, 3)) % 4;
      var hi = d.vals[i] > d.vals[j] ? i : j, lo = hi === i ? j : i, diff = d.vals[hi] - d.vals[lo];
      var more = R.int(0, 1) === 1;
      var q = more ? 'How many more ' + d.ctx.unit + ' were there for ' + d.names[hi] + ' than for ' + d.names[lo] + '?' : 'How many fewer ' + d.ctx.unit + ' were there for ' + d.names[lo] + ' than for ' + d.names[hi] + '?';
      return N({
        skill: 'How many more', prompt: d.ctx.intro + ' The graph shows: ' + listStr(d.names, d.vals) + '. ' + q,
        answer: diff, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(d.vals[hi] + d.vals[lo]), 'You added. More and fewer ask for the gap, so take away.')],
        work: d.vals[hi] + ' − ' + d.vals[lo] + ' = ' + diff + '.', plain: 'Take the small number away from the big number to find the gap.',
        teach: [
          x('Find the two numbers. ' + d.names[hi] + ' is ' + d.vals[hi] + '. ' + d.names[lo] + ' is ' + d.vals[lo] + '.', [String(d.vals[hi]), d.names[hi]], ' and ', [String(d.vals[lo]), d.names[lo]]),
          bars('Draw both bars.', [row(d.names[hi] + ' ' + d.vals[hi], d.vals[hi], 'bg-emerald-400', ''), row(d.names[lo] + ' ' + d.vals[lo], d.vals[lo], 'bg-indigo-400', '')]),
          bars('Match the ' + d.vals[lo] + ' boxes. The extra boxes are the gap.', [row(d.names[hi] + ' ' + d.vals[hi], d.vals[lo], 'bg-emerald-400', ''), row(d.names[lo] + ' ' + d.vals[lo], d.vals[lo], 'bg-indigo-400', '')]),
          x('The gap is the difference. ' + d.vals[hi] + ' − ' + d.vals[lo] + ' = ' + diff + '.', d.vals[hi] + ' − ' + d.vals[lo] + ' = ', [String(diff), 'gap']),
          x('Check by adding. ' + d.vals[lo] + ' + ' + diff + ' = ' + d.vals[hi] + '.', d.vals[lo] + ' + ' + diff + ' = ', [String(d.vals[hi]), 'check'])
        ]
      });
    } },

    { id: 'scaleread', level: 2, name: 'Read a scale', make: function () {
      var s = R.pick([2, 5, 10, 20, 50, 100]), k = R.int(2, 6), name = R.pick(['Hockey', 'Cats', 'Apples', 'Soccer', 'Mystery', 'Tuesday']);
      var lab = [0, 1, 2, 3, 4, 5].map(function (n) { return n * s; }).join(', ') + ', and so on';
      var typ = R.int(0, 1);
      var prompt = typ === 0
        ? 'A bar graph has a scale with lines at ' + lab + '. The bar for ' + name + ' stops on the ' + k + (k === 2 ? 'nd' : k === 3 ? 'rd' : 'th') + ' line above zero. What number does the bar show?'
        : 'On a bar graph, every line on the scale is worth ' + s + '. The bar for ' + name + ' is ' + k + ' lines tall. What number does the bar show?';
      return N({
        skill: 'Read a scale', prompt: prompt, answer: k * s, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(k), 'That counts each line as 1. On this scale each line is worth ' + s + '.'), T(String(k + s), 'You added. Count by ' + s + ' instead, ' + k + ' times.')],
        work: k + ' lines × ' + s + ' = ' + (k * s) + '.', plain: 'Find what one line is worth. Then count that many lines.',
        teach: [
          x('First, find what one line is worth. Here it is ' + s + '.', ['1 line', 'one step'], ' = ', [String(s), 'value']),
          lines('The bar goes up ' + k + ' lines.', vscale(s, k + 1, k, false), 0),
          x('Count by ' + s + 's. ' + Array.apply(null, Array(k)).map(function (z, i) { return (i + 1) * s; }).join(', ') + '.', k + ' lines × ' + s + ' = ', [String(k * s), 'value']),
          x('So the bar shows ' + (k * s) + '.', [String(k * s), 'answer'])
        ]
      });
    } },

    { id: 'scalehalf', level: 3, name: 'Between the lines', make: function () {
      var s = R.pick([2, 4, 10, 20, 50, 100]), m = R.int(1, 4), lowV = m * s, hiV = lowV + s, ans = lowV + s / 2;
      var name = R.pick(['Swimming', 'Dogs', 'Grapes', 'Basketball', 'Wednesday', 'Fantasy']);
      return N({
        skill: 'Between the lines', prompt: 'A bar graph has a scale that counts by ' + s + ': 0, ' + s + ', ' + (2 * s) + ', ' + (3 * s) + ', and so on. The bar for ' + name + ' stops exactly halfway between ' + lowV + ' and ' + hiV + '. What number does the bar show?',
        answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(hiV), 'That is the top line. The bar stops halfway, not at the top line.'), T(String(lowV), 'That is the bottom line. The bar is halfway up to the next line.')],
        work: 'Half of ' + s + ' is ' + (s / 2) + '. ' + lowV + ' + ' + (s / 2) + ' = ' + ans + '.', plain: 'Halfway means add half of the jump to the lower line.',
        teach: [
          x('The two lines are ' + lowV + ' and ' + hiV + '. The jump between them is ' + s + '.', [String(lowV), 'lower line'], ' and ', [String(hiV), 'upper line']),
          lines('The bar ends halfway between the two lines.', vscale(s, m + 1, m + 0.5, true), 0),
          x('Half of the jump is ' + s + ' ÷ 2 = ' + (s / 2) + '.', s + ' ÷ 2 = ', [String(s / 2), 'half a jump']),
          x('Start at the lower line and add half a jump. ' + lowV + ' + ' + (s / 2) + ' = ' + ans + '.', lowV + ' + ' + (s / 2) + ' = ', [String(ans), 'answer'])
        ]
      });
    } },

    { id: 'pictokey', level: 2, name: 'Pictograph with a key', make: function () {
      var ctx = R.pick(CTX), name = R.pick(ctx.cats), k = R.pick([2, 3, 4, 5, 6, 10]), n = R.int(3, 9), rev = R.int(0, 2) === 0;
      var key = 'Key: * = ' + k + ' ' + ctx.unit;
      var rowT = pad(name, name.length + 3) + stars(n, false);
      if (!rev) {
        return N({
          skill: 'Pictograph with a key', prompt: 'A pictograph uses a star to stand for ' + k + ' ' + ctx.unit + '. The row for ' + name + ' has ' + n + ' stars. How many ' + ctx.unit + ' does ' + name + ' show?',
          answer: n * k, keyboard: 'numeric', placeholder: 'Type a number',
          traps: [T(String(n), 'That is the number of stars. Each star stands for ' + k + ', so multiply.'), T(String(n + k), 'You added. Multiply the stars by the key number.')],
          work: n + ' × ' + k + ' = ' + (n * k) + '.', plain: 'Each star is worth ' + k + '. Count the stars and multiply.',
          teach: [
            lines('Read the key first. One star is worth ' + k + '.', [key, rowT], 0),
            x('Count the stars in the row. There are ' + n + '.', [String(n), 'stars']),
            x('Each star is ' + k + '. Multiply. ' + n + ' × ' + k + ' = ' + (n * k) + '.', n + ' × ' + k + ' = ', [String(n * k), ctx.unit]),
            x('So ' + name + ' shows ' + (n * k) + '.', name + ' = ', [String(n * k), 'answer'])
          ]
        });
      }
      return N({
        skill: 'Pictograph with a key', prompt: 'In a pictograph, one star stands for ' + k + ' ' + ctx.unit + '. How many stars do you draw to show ' + (n * k) + ' ' + ctx.unit + '?',
        answer: n, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(n * k), 'That is the amount, not the number of stars. Divide by ' + k + '.'), T(String(n * k - k), 'Count how many groups of ' + k + ' make ' + (n * k) + '. Divide, do not subtract.')],
        work: (n * k) + ' ÷ ' + k + ' = ' + n + '.', plain: 'Each star is worth ' + k + '. Divide the amount by ' + k + ' to find the stars.',
        teach: [
          x('One star is worth ' + k + '. We need ' + (n * k) + '.', ['1 star', 'is'], ' = ', [String(k), ctx.unit]),
          x('Ask how many groups of ' + k + ' fit into ' + (n * k) + '. That is a division.', (n * k) + ' ÷ ' + k + ' = ', ['?', 'stars']),
          x('Count by ' + k + 's up to ' + (n * k) + '. It takes ' + n + ' jumps.', (n * k) + ' ÷ ' + k + ' = ', [String(n), 'stars']),
          lines('Check by drawing ' + n + ' stars.', [key, pad(name, name.length + 3) + stars(n, false)], 1)
        ]
      });
    } },

    { id: 'pictohalf', level: 3, name: 'Pictograph with half symbols', make: function () {
      var ctx = R.pick(CTX), name = R.pick(ctx.cats), k = R.pick([2, 4, 6, 8, 10, 20]), n = R.int(2, 8), ans = n * k + k / 2;
      return N({
        skill: 'Half symbols', prompt: 'In a pictograph, one star stands for ' + k + ' ' + ctx.unit + '. The row for ' + name + ' has ' + n + ' whole stars and 1 half star. How many ' + ctx.unit + ' does ' + name + ' show?',
        answer: ans, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(n * k), 'You forgot the half star. A half star is worth half of ' + k + '.'), T(String(n * k + k), 'A half star is worth half of ' + k + ', not a whole ' + k + '.')],
        work: n + ' × ' + k + ' = ' + (n * k) + '. Half of ' + k + ' is ' + (k / 2) + '. ' + (n * k) + ' + ' + (k / 2) + ' = ' + ans + '.', plain: 'Count the whole stars, then add half of the key number for the half star.',
        teach: [
          lines('The key says one star is ' + k + '. The row ends with a half star.', ['Key: * = ' + k + ' ' + ctx.unit, pad(name, name.length + 3) + stars(n, true)], 1),
          x('First the whole stars. ' + n + ' × ' + k + ' = ' + (n * k) + '.', n + ' × ' + k + ' = ', [String(n * k), 'whole stars']),
          x('The half star is half of ' + k + '. ' + k + ' ÷ 2 = ' + (k / 2) + '.', k + ' ÷ 2 = ', [String(k / 2), 'half star']),
          x('Add them. ' + (n * k) + ' + ' + (k / 2) + ' = ' + ans + '.', (n * k) + ' + ' + (k / 2) + ' = ', [String(ans), ctx.unit])
        ]
      });
    } },

    { id: 'twocat', level: 3, name: 'Two categories together', make: function () {
      var typ = R.int(0, 1);
      if (typ === 0) {
        var d = mkData(4, 4, 30), i = R.int(0, 3), j = (i + R.int(1, 3)) % 4, s = d.vals[i] + d.vals[j];
        return N({
          skill: 'Two categories together', prompt: d.ctx.intro + ' The graph shows: ' + listStr(d.names, d.vals) + '. How many ' + d.ctx.unit + ' were there for ' + d.names[i] + ' and ' + d.names[j] + ' together?',
          answer: s, keyboard: 'numeric', placeholder: 'Type a number',
          traps: [T(String(Math.abs(d.vals[i] - d.vals[j])), 'You took away. Together means add the two numbers.')],
          work: d.vals[i] + ' + ' + d.vals[j] + ' = ' + s + '.', plain: 'Together means add. Use only the two categories asked about.',
          teach: [
            x('We only need ' + d.names[i] + ' and ' + d.names[j] + '.', [d.names[i], String(d.vals[i])], ' and ', [d.names[j], String(d.vals[j])]),
            bars('Draw the two bars end to end as parts of one bar.', [row(d.names[i] + ' ' + d.vals[i], d.vals[i], 'bg-indigo-400', ''), row(d.names[j] + ' ' + d.vals[j], d.vals[j], 'bg-emerald-400', '')]),
            x('Add the two numbers. ' + d.vals[i] + ' + ' + d.vals[j] + ' = ' + s + '.', d.vals[i] + ' + ' + d.vals[j] + ' = ', [String(s), 'together']),
            x('So together they are ' + s + '.', [String(s), 'answer'])
          ]
        });
      }
      var ctx = R.pick(CTX), names = ctx.days ? ['Mon', 'Tue', 'Wed'] : R.shuffle(ctx.cats).slice(0, 3), k = R.pick([2, 4, 5, 10]);
      var c = [R.int(2, 8), R.int(2, 8), R.int(2, 8)], a = R.int(0, 2), b = (a + R.int(1, 2)) % 3, s2 = (c[a] + c[b]) * k;
      var desc = names.map(function (n, m) { return n + ' has ' + c[m] + ' stars'; }).join(', ');
      return N({
        skill: 'Two categories together', prompt: 'A pictograph uses one star for ' + k + ' ' + ctx.unit + '. ' + desc + '. How many ' + ctx.unit + ' are shown for ' + names[a] + ' and ' + names[b] + ' together?',
        answer: s2, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(c[a] + c[b]), 'That is only the number of stars. Multiply by ' + k + ' to get ' + ctx.unit + '.')],
        work: names[a] + ': ' + c[a] + ' × ' + k + ' = ' + (c[a] * k) + '. ' + names[b] + ': ' + c[b] + ' × ' + k + ' = ' + (c[b] * k) + '. Together ' + s2 + '.', plain: 'Find how much each row is worth. Then add the two rows.',
        teach: [
          x('Read the key. One star is ' + k + '.', ['1 star', 'key'], ' = ', [String(k), ctx.unit]),
          x(names[a] + ' has ' + c[a] + ' stars. ' + c[a] + ' × ' + k + ' = ' + (c[a] * k) + '.', c[a] + ' × ' + k + ' = ', [String(c[a] * k), names[a]]),
          x(names[b] + ' has ' + c[b] + ' stars. ' + c[b] + ' × ' + k + ' = ' + (c[b] * k) + '.', c[b] + ' × ' + k + ' = ', [String(c[b] * k), names[b]]),
          x('Add the two rows. ' + (c[a] * k) + ' + ' + (c[b] * k) + ' = ' + s2 + '.', (c[a] * k) + ' + ' + (c[b] * k) + ' = ', [String(s2), 'together'])
        ]
      });
    } },

    { id: 'doublebar', level: 4, name: 'Double bar graph', make: function () {
      var groups = R.pick([['Grade 4', 'Grade 5'], ['Boys', 'Girls'], ['Week 1', 'Week 2'], ['Team Red', 'Team Blue']]);
      var ctx = R.pick(CTX), names = ctx.days ? ['Mon', 'Tue', 'Wed', 'Thu'] : R.shuffle(ctx.cats).slice(0, 4);
      var a = [], b = [];
      for (var i = 0; i < 4; i++) { a.push(R.int(3, 20)); b.push(R.int(3, 20)); }
      var k = R.int(0, 3), typ = R.int(0, 2);
      var head = 'A double bar graph compares ' + groups[0] + ' and ' + groups[1] + '. ' + ctx.intro + ' ' + groups[0] + ': ' + listStr(names, a) + '. ' + groups[1] + ': ' + listStr(names, b) + '. ';
      var tab = [pad('', 8) + pad(groups[0], 9) + groups[1]];
      names.forEach(function (n, m) { tab.push(pad(n, 8) + pad(a[m], 9) + b[m]); });
      var q, ans, work, tr = [], st;
      if (typ === 0) {
        q = 'How many ' + ctx.unit + ' were there for ' + names[k] + ' in both groups together?'; ans = a[k] + b[k];
        work = a[k] + ' + ' + b[k] + ' = ' + ans + '.'; tr.push(T(String(Math.abs(a[k] - b[k])), 'You took away. Both groups together means add.'));
        st = [x('Find the ' + names[k] + ' bars. There is one bar for each group.', [names[k], 'find this pair']),
          lines('Here are the two lists side by side.', tab, 0),
          bars('Draw the two bars for ' + names[k] + '.', [row(groups[0] + ' ' + a[k], a[k], 'bg-indigo-400', ''), row(groups[1] + ' ' + b[k], b[k], 'bg-emerald-400', '')]),
          x('Add them. ' + a[k] + ' + ' + b[k] + ' = ' + ans + '.', a[k] + ' + ' + b[k] + ' = ', [String(ans), 'both groups'])];
      } else if (typ === 1) {
        if (a[k] === b[k]) b[k] += 1;
        var hiG = a[k] > b[k] ? 0 : 1, hv = Math.max(a[k], b[k]), lv = Math.min(a[k], b[k]);
        q = 'How many more ' + ctx.unit + ' did ' + groups[hiG] + ' have than ' + groups[1 - hiG] + ' for ' + names[k] + '?'; ans = hv - lv;
        head = 'A double bar graph compares ' + groups[0] + ' and ' + groups[1] + '. ' + ctx.intro + ' ' + groups[0] + ': ' + listStr(names, a) + '. ' + groups[1] + ': ' + listStr(names, b) + '. ';
        tab = [pad('', 8) + pad(groups[0], 9) + groups[1]];
        names.forEach(function (n, m) { tab.push(pad(n, 8) + pad(a[m], 9) + b[m]); });
        work = hv + ' − ' + lv + ' = ' + ans + '.'; tr.push(T(String(hv + lv), 'You added. How many more asks for the gap, so take away.'));
        st = [x('Find the ' + names[k] + ' bars. Compare the two groups.', [names[k], 'find this pair']),
          lines('Here are the two lists side by side.', tab, 0),
          bars('Line up the two bars. The extra part on the longer bar is the gap.', [row(groups[hiG] + ' ' + hv, hv, 'bg-emerald-400', ''), row(groups[1 - hiG] + ' ' + lv, lv, 'bg-indigo-400', '')]),
          x('Subtract. ' + hv + ' − ' + lv + ' = ' + ans + '.', hv + ' − ' + lv + ' = ', [String(ans), 'more'])];
      } else {
        var g = R.int(0, 1), arr = g === 0 ? a : b, tot = arr.reduce(function (p, c) { return p + c; }, 0);
        q = 'How many ' + ctx.unit + ' are there in all for ' + groups[g] + '?'; ans = tot;
        work = arr.join(' + ') + ' = ' + tot + '.'; tr.push(T(String(a.reduce(function (p, c) { return p + c; }, 0) + b.reduce(function (p, c) { return p + c; }, 0)), 'That adds both groups. The question asks only about ' + groups[g] + '.'));
        var run = arr[0];
        st = [x('We only need the ' + groups[g] + ' bars. Ignore the other group.', [groups[g], 'only this group']), lines('Here are the two lists side by side.', tab, 0)];
        for (var t2 = 1; t2 < 4; t2++) { st.push(x('Add the next bar. ' + run + ' + ' + arr[t2] + ' = ' + (run + arr[t2]) + '.', run + ' + ' + arr[t2] + ' = ', [String(run + arr[t2]), t2 === 3 ? 'total' : 'so far'])); run += arr[t2]; }
      }
      return N({
        skill: 'Double bar graph', prompt: head + q, answer: ans, keyboard: 'numeric', placeholder: 'Type a number', traps: tr,
        work: work, plain: 'Find the right bars, then add or subtract as the question says.', teach: st
      });
    } },

    { id: 'doublegap', level: 5, name: 'Biggest gap in a double bar graph', make: function () {
      var groups = R.pick([['Grade 4', 'Grade 5'], ['Boys', 'Girls'], ['Team Red', 'Team Blue']]);
      var ctx = R.pick(CTX), names = ctx.days ? ['Mon', 'Tue', 'Wed', 'Thu'] : R.shuffle(ctx.cats).slice(0, 4);
      var a, b, gaps, best, ok = false, tries = 0;
      while (!ok && tries < 100) {
        a = []; b = []; gaps = [];
        for (var i = 0; i < 4; i++) { a.push(R.int(3, 20)); b.push(R.int(3, 20)); gaps.push(Math.abs(a[i] - b[i])); }
        best = 0; gaps.forEach(function (g, m) { if (g > gaps[best]) best = m; });
        ok = gaps.filter(function (g) { return g === gaps[best]; }).length === 1 && gaps[best] > 0;
        tries++;
      }
      var head = 'A double bar graph compares ' + groups[0] + ' and ' + groups[1] + '. ' + ctx.intro + ' ' + groups[0] + ': ' + listStr(names, a) + '. ' + groups[1] + ': ' + listStr(names, b) + '. ';
      var asNum = R.int(0, 1) === 1;
      var tab = [pad('', 8) + pad('Gap', 5)];
      var st = [x('For each category, find the gap between the two bars.', ['Gap', 'big minus small']),
        lines('Here are the two lists.', [pad('', 8) + pad(groups[0], 9) + groups[1]].concat(names.map(function (n, m) { return pad(n, 8) + pad(a[m], 9) + b[m]; })), 0)];
      names.forEach(function (n, m) { st.push(x(n + ': ' + Math.max(a[m], b[m]) + ' − ' + Math.min(a[m], b[m]) + ' = ' + gaps[m] + '.', n + ' gap = ', [String(gaps[m]), m === best ? 'biggest so far' : 'gap'])); });
      st.push(x('The biggest gap is ' + gaps[best] + ', for ' + names[best] + '.', [names[best], 'biggest gap'], ' = ', [String(gaps[best]), 'gap']));
      if (asNum) {
        return N({
          skill: 'Biggest gap', prompt: head + 'What is the biggest gap between the two bars for any category?', answer: gaps[best], keyboard: 'numeric', placeholder: 'Type a number',
          traps: [T(String(a[best] + b[best]), 'That is the total. The question asks for the gap, so take away.')],
          work: 'The gaps are ' + gaps.join(', ') + '. The biggest is ' + gaps[best] + '.', plain: 'Subtract the two bars in each category. Then pick the biggest answer.', teach: st
        });
      }
      var opts = names.map(function (n, m) { return { text: n, ok: m === best, trap: m === best ? undefined : n + ' has a gap of only ' + gaps[m] + '. Work out the gap for every category and compare.' }; });
      return Q.choice({
        skill: 'Biggest gap', prompt: head + 'Which category has the biggest gap between the two bars?', options: opts,
        work: 'The gaps are ' + gaps.join(', ') + '. The biggest is ' + names[best] + '.', plain: 'Subtract the two bars in each category. Pick the biggest gap.', teach: st
      });
    } },

    { id: 'chooseGraph', level: 2, name: 'Choose the best graph', make: function () {
      var sc = [
        { p: 'Rinka wants to show how the temperature changed hour by hour during one day.', a: 'Line graph', why: 'A line graph shows change over time.' },
        { p: 'Sam wants to show how tall his bean plant grew each week for six weeks.', a: 'Line graph', why: 'A line graph shows change over time.' },
        { p: 'A class wants to show how many students chose each favourite colour. The colours are separate categories.', a: 'Bar graph', why: 'A bar graph compares separate categories.' },
        { p: 'A store wants to compare how many of five different snacks were sold.', a: 'Bar graph', why: 'A bar graph compares separate categories.' },
        { p: 'A coach wants to compare, side by side, how many boys and how many girls joined each sport.', a: 'Double bar graph', why: 'A double bar graph compares two groups for each category.' },
        { p: 'Mia wants to compare her spelling scores and her sister scores test by test, with two bars for each test.', a: 'Double bar graph', why: 'A double bar graph compares two groups side by side.' },
        { p: 'A park counted about 20, 40 and 60 visitors on three days and wants to show them with one small picture for every 20 visitors.', a: 'Pictograph', why: 'A pictograph uses symbols and a key that counts in big steps.' },
        { p: 'A class wants to show books read using one book picture for every 5 books.', a: 'Pictograph', why: 'A pictograph uses symbols and a key that counts in big steps.' }
      ];
      var s = R.pick(sc), all = ['Line graph', 'Bar graph', 'Double bar graph', 'Pictograph'];
      var says = {
        'Line graph': 'A line graph is for change over time. This job does not need that.',
        'Bar graph': 'A bar graph shows one set of separate categories. This job needs something different.',
        'Double bar graph': 'A double bar graph compares two groups. This job does not have two groups to compare.',
        'Pictograph': 'A pictograph uses symbols with a key. This job does not call for symbols.'
      };
      return Q.choice({
        skill: 'Choose the best graph', prompt: s.p + ' Which graph is the best choice?',
        options: all.map(function (n) { return { text: n, ok: n === s.a, trap: n === s.a ? undefined : says[n] }; }),
        work: s.a + '. ' + s.why, plain: 'Ask what the job is. Change over time needs a line graph. Separate categories need bars. Two groups need double bars. Big steps with a key need a pictograph.',
        teach: [
          x('First, ask what job the graph must do.', ['Job', 'what must it show?']),
          note('Read the job in the problem.', 'The job', [s.p]),
          note('Match the job to a graph.', 'Which graph fits?', ['Change over time: line graph', 'Separate categories: bar graph', 'Two groups side by side: double bar graph', 'Counting in big steps with a key: pictograph']),
          x(s.why, [s.a, 'best choice'])
        ]
      });
    } },

    { id: 'linechange', level: 4, name: 'Read a line graph', make: function () {
      var cx = R.pick([
        { intro: 'A bean plant was measured at the end of each week. Height in cm: ', unit: 'cm', lab: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'], short: ['W1', 'W2', 'W3', 'W4', 'W5'], step: 2, grow: 'grow' },
        { intro: 'Rinka counted the dollars in her savings jar at the end of each week. Dollars: ', unit: 'dollars', lab: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'], short: ['W1', 'W2', 'W3', 'W4', 'W5'], step: 5, grow: 'grow' },
        { intro: 'A library counted the total books a class read by the end of each month. Books: ', unit: 'books', lab: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], short: ['Jan', 'Feb', 'Mar', 'Apr', 'May'], step: 5, grow: 'grow' }
      ]);
      var jumps, vals, best, ok = false, tries = 0;
      while (!ok && tries < 100) {
        vals = [R.int(1, 3) * cx.step]; jumps = [];
        for (var i = 1; i < 5; i++) { var jmp = R.int(1, 4) * cx.step; jumps.push(jmp); vals.push(vals[i - 1] + jmp); }
        best = 0; jumps.forEach(function (j, m) { if (j > jumps[best]) best = m; });
        ok = jumps.filter(function (j) { return j === jumps[best]; }).length === 1 && vals[4] <= 12 * cx.step;
        tries++;
      }
      var top = Math.ceil(vals[4] / cx.step) * cx.step;
      var pts = cx.lab.map(function (l, m) { return l + ' ' + vals[m]; }).join(', ');
      var typ = R.int(0, 1), sk = lineSketch(cx.short, vals, cx.step, top);
      if (typ === 0) {
        var a = R.int(0, 2), b = a + R.int(1, 4 - a), d = vals[b] - vals[a];
        return N({
          skill: 'Read a line graph', prompt: cx.intro + pts + '. How many ' + cx.unit + ' did it increase from ' + cx.lab[a] + ' to ' + cx.lab[b] + '?',
          answer: d, keyboard: 'numeric', placeholder: 'Type a number',
          traps: [T(String(vals[b]), 'That is the value at ' + cx.lab[b] + '. The question asks how much it changed, so take away the first value.'), T(String(vals[a] + vals[b]), 'You added. A change is found by taking away.')],
          work: vals[b] + ' − ' + vals[a] + ' = ' + d + '.', plain: 'Read the two dots. Take the earlier value from the later value.',
          teach: [
            lines('Here is the line graph. Each star is a dot.', sk, 0),
            x('Read the dot for ' + cx.lab[a] + '. It is ' + vals[a] + '.', cx.lab[a] + ' = ', [String(vals[a]), 'start']),
            x('Read the dot for ' + cx.lab[b] + '. It is ' + vals[b] + '.', cx.lab[b] + ' = ', [String(vals[b]), 'end']),
            x('Subtract to find the change. ' + vals[b] + ' − ' + vals[a] + ' = ' + d + '.', vals[b] + ' − ' + vals[a] + ' = ', [String(d), 'increase'])
          ]
        });
      }
      var st = [lines('Here is the line graph. Each star is a dot.', sk, 0)];
      jumps.forEach(function (j, m) { st.push(x('From ' + cx.lab[m] + ' to ' + cx.lab[m + 1] + ' it went up ' + vals[m + 1] + ' − ' + vals[m] + ' = ' + j + '.', vals[m + 1] + ' − ' + vals[m] + ' = ', [String(j), m === best ? 'biggest so far' : 'jump'])); });
      st.push(x('The biggest jump is ' + jumps[best] + '. It is the steepest part of the line.', [String(jumps[best]), 'biggest jump']));
      return N({
        skill: 'Read a line graph', prompt: cx.intro + pts + '. What was the biggest increase from one point to the next?',
        answer: jumps[best], keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(vals[4] - vals[0]), 'That is the change over the whole graph. Look at each step between two neighbouring points.')],
        work: 'The jumps are ' + jumps.join(', ') + '. The biggest is ' + jumps[best] + '.', plain: 'Find the change between each pair of neighbouring points. Pick the biggest.', teach: st
      });
    } },

    { id: 'range', level: 4, name: 'Range', make: function () {
      var n = R.int(4, 6), v = [], i;
      for (i = 0; i < n; i++) v.push(R.int(4, 40));
      var mx = Math.max.apply(null, v), mn = Math.min.apply(null, v);
      if (mx === mn) { v[0] = mx + 5; mx = v[0]; }
      var ctx = R.pick([['The temperatures on some days were', 'degrees'], ['Rinka scored these points in some games:', 'points'], ['A class read these numbers of pages on some nights:', 'pages'], ['Some students ran these numbers of laps:', 'laps']]);
      var d = mx - mn;
      return N({
        skill: 'Range', prompt: ctx[0] + ' ' + v.join(', ') + '. What is the range of the data?', answer: d, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(mx), 'That is the biggest number. The range is the biggest minus the smallest.'), T(String(v.reduce(function (a, b) { return a + b; }, 0)), 'That is the total. The range is the biggest minus the smallest.')],
        work: mx + ' − ' + mn + ' = ' + d + '.', plain: 'The range shows how spread out the numbers are. Take the smallest from the biggest.',
        teach: [
          x('The data is ' + v.join(', ') + '.', [v.join(', '), 'data']),
          x('Find the biggest number. It is ' + mx + '.', [String(mx), 'biggest']),
          x('Find the smallest number. It is ' + mn + '.', [String(mn), 'smallest']),
          x('Subtract. ' + mx + ' − ' + mn + ' = ' + d + '.', mx + ' − ' + mn + ' = ', [String(d), 'range']),
          x('The range is ' + d + '.', 'Range = ', [String(d), 'answer'])
        ]
      });
    } },

    { id: 'missingbar', level: 5, name: 'Find the missing bar', make: function () {
      var d = mkData(4, 4, 25), k = R.int(0, 3), tot = d.vals.reduce(function (a, b) { return a + b; }, 0);
      var known = d.names.map(function (n, i) { return i === k ? null : n + ' ' + d.vals[i]; }).filter(function (z) { return z; }).join(', ');
      var kv = tot - d.vals[k];
      return N({
        skill: 'Find the missing bar', prompt: d.ctx.intro + ' There were ' + tot + ' ' + d.ctx.unit + ' in all. The graph shows: ' + known + '. The bar for ' + d.names[k] + ' is hidden. How many ' + d.ctx.unit + ' does ' + d.names[k] + ' show?',
        answer: d.vals[k], keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(kv), 'That is the total of the other bars. Take the other bars away from the total ' + tot + ' instead.'), T(String(tot), 'That is the whole total. The hidden bar is only one part of it.')],
        work: tot + ' − ' + kv + ' = ' + d.vals[k] + '.', plain: 'Add the bars you can see. Take that away from the total to find the hidden part.',
        teach: [
          x('The total is ' + tot + '. We know all the bars except ' + d.names[k] + '.', [String(tot), 'total']),
          x('Add the bars we can see. That makes ' + kv + '.', 'Known bars = ', [String(kv), 'seen']),
          bars('The whole is ' + tot + '. The known part is ' + kv + '. The rest is the hidden bar.', [row('Known ' + kv, kv, 'bg-indigo-400', ''), row('Total ' + tot, tot, 'bg-emerald-400', '')]),
          x('Take away. ' + tot + ' − ' + kv + ' = ' + d.vals[k] + '.', tot + ' − ' + kv + ' = ', [String(d.vals[k]), d.names[k]]),
          x('Check. ' + kv + ' + ' + d.vals[k] + ' = ' + tot + '.', kv + ' + ' + d.vals[k] + ' = ', [String(tot), 'check'])
        ]
      });
    } },

    { id: 'goal', level: 6, name: 'Goal and graph problems', make: function () {
      var typ = R.int(0, 1), d = mkData(4, 5, 30), tot = d.vals.reduce(function (a, b) { return a + b; }, 0);
      if (typ === 0) {
        var goal = Math.ceil((tot + R.int(6, 30)) / 10) * 10, need = goal - tot;
        return N({
          skill: 'Goal and graph problems', prompt: d.ctx.intro + ' The graph shows: ' + listStr(d.names, d.vals) + '. The class goal is ' + goal + ' ' + d.ctx.unit + ' in all. How many more ' + d.ctx.unit + ' are needed to reach the goal?',
          answer: need, keyboard: 'numeric', placeholder: 'Type a number',
          traps: [T(String(tot), 'That is the total so far. The question asks how many more are needed to reach ' + goal + '.'), T(String(goal + tot), 'You added the goal and the total. Take away instead.')],
          work: 'Total ' + d.vals.join(' + ') + ' = ' + tot + '. ' + goal + ' − ' + tot + ' = ' + need + '.', plain: 'Add all the bars first. Then take the total away from the goal.',
          teach: [
            x('Step one is to find the total so far.', [d.vals.join(' + '), 'add all']),
            x('The total is ' + tot + '.', d.vals.join(' + ') + ' = ', [String(tot), 'so far']),
            bars('The goal is ' + goal + '. The total so far is ' + tot + '. The gap is what is still needed.', [row('So far ' + tot, Math.round(tot / 5), 'bg-indigo-400', ''), row('Goal ' + goal, Math.round(goal / 5), 'bg-emerald-400', '')]),
            x('Step two is to take away. ' + goal + ' − ' + tot + ' = ' + need + '.', goal + ' − ' + tot + ' = ', [String(need), 'still needed'])
          ]
        });
      }
      var hi = idxMax(d.vals), lo = idxMin(d.vals), gap = d.vals[hi] - d.vals[lo];
      return N({
        skill: 'Goal and graph problems', prompt: d.ctx.intro + ' The graph shows: ' + listStr(d.names, d.vals) + '. How many more ' + d.ctx.unit + ' were there for the greatest category than for the smallest category?',
        answer: gap, keyboard: 'numeric', placeholder: 'Type a number',
        traps: [T(String(d.vals[hi]), 'That is the greatest number. Take away the smallest number to find how many more.'), T(String(d.vals[hi] + d.vals[lo]), 'You added. How many more asks for the gap.')],
        work: d.names[hi] + ' ' + d.vals[hi] + ' − ' + d.names[lo] + ' ' + d.vals[lo] + ' = ' + gap + '.', plain: 'Find the biggest and the smallest bars. Take away to find the gap.',
        teach: [
          x('First find the greatest and the smallest numbers.', ['Greatest', 'and smallest']),
          bars('Here are the bars.', graphRows(d.names, d.vals, 1)),
          x('The greatest is ' + d.names[hi] + ' with ' + d.vals[hi] + '. The smallest is ' + d.names[lo] + ' with ' + d.vals[lo] + '.', [String(d.vals[hi]), 'greatest'], ' and ', [String(d.vals[lo]), 'smallest']),
          x('Subtract. ' + d.vals[hi] + ' − ' + d.vals[lo] + ' = ' + gap + '.', d.vals[hi] + ' − ' + d.vals[lo] + ' = ', [String(gap), 'gap'])
        ]
      });
    } }
  ]);
})();
