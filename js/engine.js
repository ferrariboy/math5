/* Math Engine: divide sign, speech, and lesson step builders. No dependencies. */
(function () {
  'use strict';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* The divide sign is drawn with CSS so it looks the same on every device. */
  var DIV_HTML = '<span class="div-sign" role="img" aria-label="divided by" data-say="divided by"></span>';
  function mathHTML(v) {
    if (v === null || v === undefined) return '';
    return esc(v).replace(/÷/g, DIV_HTML);
  }

  /* ---------- Turning symbols into words a voice can say ---------- */
  function speakable(text) {
    var t = String(text);
    t = t.replace(/\$\s?(\d+(?:,\d{3})*(?:\.\d+)?)/g, '$1 dollars');
    t = t.replace(/(\d)\s*%/g, '$1 percent');
    t = t.replace(/(\d)\s*°/g, '$1 degrees');
    t = t.replace(/(\d)\s*(cm|m|km|mm|mL|L)³/g, '$1 cubic $2');
    t = t.replace(/³/g, ' cubed').replace(/²/g, ' squared');
    t = t.replace(/(\d+)\s*\/\s*(\d+)/g, '$1 over $2');
    t = t.replace(/(\d)\s*:\s*(\d)/g, '$1 to $2');
    t = t.replace(/×/g, ' times ').replace(/÷/g, ' divided by ');
    t = t.replace(/−/g, ' minus ').replace(/\s-\s/g, ' minus ');
    t = t.replace(/\+/g, ' plus ').replace(/=/g, ' equals ');
    t = t.replace(/\[\s*\?\s*\]/g, ' the missing number ').replace(/(^|[\s(=])\?(?=[\s).,=]|$)/g, '$1the missing number');
    t = t.replace(/\s+/g, ' ').trim();
    return t;
  }

  /* Split displayed text into words and build the spoken text word by word,
     so the spoken position can be mapped back to the displayed word. */
  function prepareSpeech(text) {
    var shown = String(text).split(/\s+/).filter(Boolean);
    var spoken = '';
    var starts = [];
    for (var i = 0; i < shown.length; i++) {
      var sw = speakable(shown[i]);
      if (spoken) spoken += ' ';
      starts.push(spoken.length);
      spoken += sw;
    }
    return { shown: shown, spoken: spoken, starts: starts };
  }

  function wordAt(prep, charIndex) {
    var idx = 0;
    for (var i = 0; i < prep.starts.length; i++) {
      if (prep.starts[i] <= charIndex) idx = i; else break;
    }
    return idx;
  }

  /* ---------- Speech engine ---------- */
  var synth = (typeof window !== 'undefined' && window.speechSynthesis) ? window.speechSynthesis : null;
  var token = 0;
  var voiceCache = null;
  var active = { timer: null };

  function pickVoice() {
    if (!synth) return null;
    if (voiceCache) return voiceCache;
    var list = synth.getVoices() || [];
    if (!list.length) return null;
    var english = list.filter(function (v) { return /^en[-_]/i.test(v.lang); });
    var pool = english.length ? english : list;
    function score(v) {
      var s = 0;
      if (/en[-_]CA/i.test(v.lang)) s += 4;
      else if (/en[-_]US/i.test(v.lang)) s += 3;
      else if (/en[-_](GB|AU)/i.test(v.lang)) s += 1;
      if (/natural|neural|google|microsoft|samantha|karen|aria|jenny/i.test(v.name)) s += 3;
      if (v.localService) s += 1;
      return s;
    }
    pool = pool.slice().sort(function (a, b) { return score(b) - score(a); });
    voiceCache = pool[0];
    return voiceCache;
  }
  if (synth && synth.addEventListener) {
    synth.addEventListener('voiceschanged', function () { voiceCache = null; });
  }

  function splitChunks(text) {
    var parts = text.match(/[^.!?]+[.!?]*\s*/g) || [text];
    var chunks = [];
    var cur = '';
    parts.forEach(function (p) {
      if ((cur + p).length > 180 && cur) { chunks.push(cur); cur = p; } else cur += p;
    });
    if (cur) chunks.push(cur);
    return chunks;
  }

  function cancel() {
    token += 1;
    if (active.timer) { clearTimeout(active.timer); active.timer = null; }
    if (synth) { try { synth.cancel(); } catch (e) { /* ignore */ } }
  }

  /* speak(text, { rate, onWord(index), onDone() }) reads text and calls onDone once.
     If speech is not available, onDone fires after a reading time estimate. */
  function speak(text, opts) {
    opts = opts || {};
    var rate = opts.rate || 0.95;
    cancel();
    var my = token;
    var prep = prepareSpeech(text);
    var finished = false;
    function done() {
      if (finished || my !== token) return;
      finished = true;
      if (active.timer) { clearTimeout(active.timer); active.timer = null; }
      if (opts.onDone) opts.onDone();
    }
    var estimate = Math.max(1200, prep.shown.length * 420 / rate);
    if (!synth || typeof SpeechSynthesisUtterance === 'undefined' || !prep.spoken) {
      active.timer = setTimeout(done, estimate);
      return;
    }
    var chunks = splitChunks(prep.spoken);
    var offset = 0;
    var k = 0;
    function next() {
      if (my !== token) return;
      if (k >= chunks.length) { done(); return; }
      var chunk = chunks[k];
      var base = offset;
      var u = new SpeechSynthesisUtterance(chunk);
      var v = pickVoice();
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-CA';
      u.rate = rate;
      u.pitch = 1.05;
      var advanced = false;
      function advance() {
        if (advanced || my !== token) return;
        advanced = true;
        if (active.timer) { clearTimeout(active.timer); active.timer = null; }
        offset = base + chunk.length;
        k += 1;
        next();
      }
      u.onboundary = function (e) {
        if (my !== token || !opts.onWord) return;
        if (e.name && e.name !== 'word') return;
        opts.onWord(wordAt(prep, base + (e.charIndex || 0)));
      };
      u.onend = advance;
      u.onerror = advance;
      /* Some browsers never fire onend. This timer keeps the lesson moving. */
      active.timer = setTimeout(advance, Math.max(1500, chunk.split(/\s+/).length * 520 / rate + 1500));
      try { synth.speak(u); } catch (e) { advance(); }
    }
    setTimeout(function () { if (my === token) next(); }, 40);
  }

  function pause() { if (synth) { try { synth.pause(); } catch (e) { /* ignore */ } } }
  function resume() { if (synth) { try { synth.resume(); } catch (e) { /* ignore */ } } }

  /* ---------- Reading text out of the page ---------- */
  function elText(node) {
    if (node.nodeType === 3) return node.nodeValue;
    if (node.nodeType !== 1) return '';
    if (node.matches('[data-noread], [aria-hidden="true"], script, style, svg, pre, template')) return '';
    if (node.dataset && node.dataset.say) return ' ' + node.dataset.say + ' ';
    var out = '';
    for (var c = node.firstChild; c; c = c.nextSibling) out += elText(c);
    return out;
  }
  function readableText(el) {
    var t = elText(el).replace(/\s+/g, ' ').trim();
    if (!t && el.getAttribute) t = (el.getAttribute('aria-label') || '').trim();
    return t;
  }
  var READ_SEL = 'h1,h2,h3,h4,p,li,label,output,button,summary,td,th,.readable';
  function visible(el) {
    if (!el.getClientRects().length) return false;
    var s = window.getComputedStyle(el);
    return s.visibility !== 'hidden' && s.display !== 'none';
  }
  function collectReadables(root, selector) {
    var out = [];
    var nodes = root.querySelectorAll(selector || READ_SEL);
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.closest('[data-noread], [aria-hidden="true"], pre, template')) continue;
      if (!visible(el)) continue;
      if (el.querySelector(selector || READ_SEL)) continue;
      var t = readableText(el);
      if (t) out.push({ el: el, text: t });
    }
    return out;
  }

  /* ---------- Lesson step builders ---------- */
  function pad(s, n) { s = String(s); while (s.length < n) s = ' ' + s; return s; }
  function spaces(n) { return new Array(Math.max(0, n) + 1).join(' '); }

  /* Long division, one step per digit. Returns lesson steps of kind 'lines'. */
  function longDiv(dividend, divisor) {
    var D = String(dividend);
    var d = divisor;
    var prefix = String(d) + ' ) ';
    var P = prefix.length;
    var steps = [];
    var qDigits = new Array(D.length).fill(' ');
    var work = [];
    var rem = 0;
    var started = false;
    var titleLine = function () {
      return spaces(P) + qDigits.join('');
    };
    function frame(hiFrom, cap) {
      var lines = [titleLine(), spaces(P - 2) + '_' + new Array(D.length + 1).join('_'), prefix + D].concat(work);
      steps.push({ kind: 'lines', lines: lines, hiFrom: hiFrom, cap: cap });
    }
    frame(99, 'Set it up. We will share ' + dividend + ' into groups of ' + d + '.');
    var lastQ = '';
    for (var i = 0; i < D.length; i++) {
      var cur = rem * 10 + parseInt(D[i], 10);
      if (!started && cur < d && i < D.length - 1) {
        rem = cur;
        continue;
      }
      started = true;
      var q = Math.floor(cur / d);
      var prod = q * d;
      var newRem = cur - prod;
      qDigits[i] = String(q);
      lastQ = lastQ + q;
      if (q === 0 && i < D.length - 1) {
        frame(0, d + ' does not fit into ' + cur + ', so write 0 on top and bring down the next digit.');
        if (work.length) work[work.length - 1] = spaces(P) + pad(String(parseInt(String(cur) + D[i + 1], 10)), i + 2);
        else work.push(spaces(P) + pad(String(parseInt(String(cur) + D[i + 1], 10)), i + 2));
        rem = cur;
        continue;
      }
      frame(0, d + ' goes into ' + cur + ' ' + q + (q === 1 ? ' time' : ' times') + '. Write ' + q + ' on top.');
      work.push(spaces(P) + pad(prod, i + 1));
      frame(3 + work.length - 1, q + ' times ' + d + ' is ' + prod + '. Write it under the ' + cur + '.');
      work.push(spaces(P) + pad(new Array(String(prod).length + 1).join('-'), i + 1));
      var remLine;
      if (i < D.length - 1) {
        remLine = spaces(P) + pad(String(parseInt(String(newRem) + D[i + 1], 10)), i + 2);
        work.push(remLine);
        frame(3 + work.length - 1, cur + ' take away ' + prod + ' is ' + newRem + '. Bring down the ' + D[i + 1] + '.');
      } else {
        remLine = spaces(P) + pad(String(newRem), i + 1);
        work.push(remLine);
        frame(3 + work.length - 1, cur + ' take away ' + prod + ' is ' + newRem + '. Nothing is left to bring down.');
      }
      rem = newRem;
    }
    var answer = parseInt(lastQ || '0', 10);
    var finalCap = rem === 0
      ? 'The answer is ' + answer + '.'
      : 'The answer is ' + answer + ' with ' + rem + ' left over. We write ' + answer + ' remainder ' + rem + '.';
    var finalLines = [titleLine() + (rem ? ' r ' + rem : ''), spaces(P - 2) + '_' + new Array(D.length + 1).join('_'), prefix + D].concat(work);
    steps.push({ kind: 'lines', lines: finalLines, hiFrom: 0, cap: finalCap });
    return steps;
  }

  /* Vertical addition of two decimals or whole numbers. */
  function verticalAdd(aStr, bStr) {
    function parts(s) { var p = String(s).split('.'); return { i: p[0], f: p[1] || '' }; }
    var A = parts(aStr), B = parts(bStr);
    var fl = Math.max(A.f.length, B.f.length);
    var il = Math.max(A.i.length, B.i.length);
    function norm(p) {
      var f = p.f; while (f.length < fl) f += '0';
      var i = p.i; while (i.length < il) i = '0' + i;
      return { i: i, f: f, all: i + f };
    }
    var a = norm(A), b = norm(B);
    var n = a.all.length;
    var dot = fl ? il : -1;
    var res = new Array(n).fill(' ');
    var carries = new Array(n).fill(' ');
    var carry = 0;
    var digitsOut = new Array(n);
    var sums = [];
    for (var k = n - 1; k >= 0; k--) {
      var s = parseInt(a.all[k], 10) + parseInt(b.all[k], 10) + carry;
      digitsOut[k] = s % 10;
      sums[k] = { s: s, carryIn: carry };
      carry = s >= 10 ? 1 : 0;
      sums[k].carryOut = carry;
    }
    var topDigit = carry ? String(carry) : '';
    function render(aa) {
      /* aa is the number of columns filled so far from the right */
      function withDot(str) { return dot >= 0 ? str.slice(0, dot) + '.' + str.slice(dot) : str; }
      var w = n + (dot >= 0 ? 1 : 0) + 1;
      var line1 = withDot(a.all);
      var line2 = withDot(b.all);
      var resArr = new Array(n).fill(' ');
      var carArr = new Array(n).fill(' ');
      for (var j = n - 1; j >= n - aa; j--) {
        resArr[j] = String(digitsOut[j]);
        if (sums[j].carryOut && j - 1 >= 0) carArr[j - 1] = '1';
      }
      var resStr = withDot(resArr.join(''));
      if (aa < fl) resStr = resStr.replace(/ \./, '  ');
      if (aa >= n && topDigit) resStr = topDigit + resStr; else resStr = ' ' + resStr;
      var carStr = withDot(carArr.join('')).replace(/\./, ' ');
      return [
        ' ' + carStr,
        ' ' + line1,
        '+' + line2,
        new Array(w).join('-') + '-',
        resStr
      ];
    }
    function colName(idxFromRight) {
      var names = ['ones', 'tens', 'hundreds', 'thousands'];
      var pos = n - 1 - idxFromRight;
      return pos;
    }
    var steps = [];
    var aLine = fl ? aStr : aStr;
    steps.push({ kind: 'lines', lines: render(0), hiFrom: 99, cap: 'Line up the numbers so the decimal points sit in one straight line. Fill the gap with a zero.' });
    for (var c = 1; c <= n; c++) {
      var col = n - c;
      var info = sums[col];
      var isFrac = col >= il;
      var name;
      if (isFrac) {
        var place = col - il + 1;
        name = place === 1 ? 'tenths' : (place === 2 ? 'hundredths' : 'thousandths');
      } else {
        var p2 = il - 1 - col;
        name = ['ones', 'tens', 'hundreds', 'thousands'][p2] || 'next';
      }
      var cap = 'Add the ' + name + ': ' + a.all[col] + ' + ' + b.all[col] + (info.carryIn ? ' + 1' : '') + ' = ' + info.s + '.';
      if (info.carryOut) cap += ' Write ' + (info.s % 10) + ' and carry 1.';
      else cap += ' Write ' + info.s + '.';
      steps.push({ kind: 'lines', lines: render(c), hiFrom: 4, cap: cap });
    }
    var total = (topDigit || '') + (dot >= 0 ? digitsOut.slice(0, dot).join('') + '.' + digitsOut.slice(dot).join('') : digitsOut.join(''));
    steps.push({ kind: 'lines', lines: render(n), hiFrom: 4, cap: aStr + ' + ' + bStr + ' = ' + total + '.' });
    return steps;
  }

  /* x-math works like x-text but draws the divide sign. */
  document.addEventListener('alpine:init', function () {
    window.Alpine.directive('math', function (el, data, utils) {
      var run = utils.evaluateLater(data.expression);
      utils.effect(function () {
        run(function (v) { el.innerHTML = mathHTML(v); });
      });
    });
  });

  window.MathEngine = {
    esc: esc,
    mathHTML: mathHTML,
    speakable: speakable,
    prepareSpeech: prepareSpeech,
    speech: { supported: !!synth && typeof SpeechSynthesisUtterance !== 'undefined', speak: speak, cancel: cancel, pause: pause, resume: resume },
    readableText: readableText,
    collectReadables: collectReadables,
    longDiv: longDiv,
    verticalAdd: verticalAdd
  };
})();
