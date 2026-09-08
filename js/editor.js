/* The home page behaves like an editor: the gutter addresses real lines of
   text, the status bar reports where the pointer sits, and on the first visit
   of a session the document boots like a device before it appears.

   On a phone the lines soft-wrap. The gutter follows the same rule an editor
   does: a wrapped line keeps one number on its first visual row, and the rows
   it spills onto stay blank. */

(function () {
    'use strict';

    var TOP = 21;      /* gutter row 1 top — must match --gutter-top */
    var LH = 22;       /* grid row height  — read from --lh at layout time */

    var gutter = document.querySelector('.line-numbers');
    var gutterBg = document.querySelector('.line-numbers-bg');
    var curLine = document.querySelector('.current-line');
    var doc = document.querySelector('.doc');
    var prose = document.querySelector('.prose');
    var posOut = document.querySelector('.sb-pos');
    var bannerBox = document.querySelector('.banner-box');
    var banner = document.querySelector('.banner');

    var rows = [];
    var charWidth = 8;

    var lines = [];      /* one entry per real line of the document */
    var lit = [];        /* gutter rows currently highlighted */
    var skip = {};       /* gutter rows that are wrapped continuations */
    var numbers = [];    /* gutter row index -> the number it shows, 0 if none */

    function readLh() {
        var v = parseFloat(
            window.getComputedStyle(document.documentElement)
                .getPropertyValue('--lh')
        );
        LH = v > 0 ? v : 22;
    }

    /* ---- banner ----------------------------------------------------- */

    function fitBanner() {
        if (!banner || !bannerBox) return;

        banner.style.transform = 'none';
        bannerBox.style.height = 'auto';

        var natural = banner.offsetHeight;
        var width = banner.scrollWidth;
        var avail = bannerBox.clientWidth;
        var scale = width > 0 ? Math.min(1, avail / width) : 1;

        banner.style.transform = scale < 1 ? 'scale(' + scale + ')' : 'none';

        /* Round to the nearest whole row rather than up: a font that renders
           the art a pixel taller should cost a pixel of clipping, not a whole
           empty row of the grid. */
        bannerBox.style.height =
            Math.max(LH, Math.round((natural * scale) / LH) * LH) + 'px';
    }

    /* ---- lines ------------------------------------------------------ */

    function indexLines() {
        lines = [];
        skip = {};
        if (!doc) return;

        var docLeft = doc.getBoundingClientRect().left + window.pageXOffset;
        var els = doc.querySelectorAll('.row, .doc-title');

        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            var box = el.getBoundingClientRect();
            var text = el.querySelector('.rt');

            var top = Math.round(box.top + window.pageYOffset);
            var height = Math.round(box.height);
            var startRow = Math.round((top - TOP) / LH);
            var gridRows = Math.max(1, Math.round(height / LH));

            /* How many grid rows one visual line of this element occupies.
               The title is a single tall line, not a wrapped one. */
            var ownLh = parseFloat(window.getComputedStyle(el).lineHeight) || LH;
            var perVisual = Math.max(1, Math.round(ownLh / LH));

            for (var r = startRow + perVisual; r < startRow + gridRows; r++) {
                skip[r] = true;
            }

            lines.push({
                top: top,
                height: height,
                row: startRow,
                left: Math.round(docLeft) - 6,
                right: text
                    ? Math.round(text.getBoundingClientRect().right +
                                 window.pageXOffset) + 8
                    : Math.round(docLeft) + 14   /* a stub for a blank line */
            });
        }
    }

    /* ---- gutter ----------------------------------------------------- */

    function buildGutter() {
        if (!gutter) return;

        /* The gutter is absolutely positioned, so its own height feeds back
           into the page height. Collapse it before measuring. */
        gutter.style.height = '0px';
        if (gutterBg) gutterBg.style.height = '0px';

        var h = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            window.innerHeight
        );

        var n = Math.max(1, Math.floor((h - TOP) / LH));
        var html = '';
        var num = 1;

        numbers = [];
        for (var i = 0; i < n; i++) {
            if (skip[i]) {
                numbers.push(0);
                html += '<div class="gl"></div>';
            } else {
                numbers.push(num);
                html += '<div class="gl">' + num + '</div>';
                num++;
            }
        }

        gutter.innerHTML = html;
        gutter.style.height = (n * LH) + 'px';
        if (gutterBg) gutterBg.style.height = (h - TOP) + 'px';

        rows = gutter.children;
        lit = [];
    }

    function measureChar() {
        if (!prose) return;
        var probe = document.createElement('span');
        probe.textContent = '0000000000';
        probe.style.position = 'absolute';
        probe.style.visibility = 'hidden';
        probe.style.whiteSpace = 'pre';
        prose.appendChild(probe);
        charWidth = probe.getBoundingClientRect().width / 10 || 8;
        prose.removeChild(probe);
    }

    /* ---- pointer as caret ------------------------------------------- */

    function lineAt(pageY) {
        for (var i = 0; i < lines.length; i++) {
            if (pageY >= lines[i].top && pageY < lines[i].top + lines[i].height) {
                return lines[i];
            }
        }
        return null;
    }

    function litRows(next) {
        var i;
        for (i = 0; i < lit.length; i++) {
            if (rows[lit[i]]) rows[lit[i]].classList.remove('on');
        }
        lit = next;
        for (i = 0; i < lit.length; i++) {
            if (rows[lit[i]]) rows[lit[i]].classList.add('on');
        }
    }

    function onMove(e) {
        if (!curLine || !doc) return;

        var line = lineAt(e.clientY + window.pageYOffset);
        if (!line) {
            clearRow();
            return;
        }

        curLine.style.top = line.top + 'px';
        curLine.style.height = line.height + 'px';
        curLine.style.left = line.left + 'px';
        curLine.style.width = (line.right - line.left) + 'px';
        curLine.classList.add('on');

        /* A line may cover more than one gutter row; light all of them. */
        var count = Math.max(1, Math.round(line.height / LH));
        var next = [];
        for (var r = line.row; r < line.row + count; r++) next.push(r);
        litRows(next);

        var col = Math.floor(
            (e.clientX - doc.getBoundingClientRect().left) / charWidth
        ) + 1;
        if (col < 1) col = 1;

        if (posOut) {
            posOut.textContent =
                'Ln ' + (numbers[line.row] || line.row + 1) + ', Col ' + col;
        }
    }

    function clearRow() {
        if (curLine) curLine.classList.remove('on');
        litRows([]);
    }

    /* ---- boot -------------------------------------------------------- */

    var BOOT = [
        ['[0.000] boot: semiloker rev 0.4', ''],
        ['[0.011] clk: pll lock ........... ', 'ok'],
        ['[0.019] mem: 64k sram ........... ', 'ok'],
        ['[0.031] io : uart0 115200 ....... ', 'ok'],
        ['[0.048] fs : mount /home ........ ', 'ok'],
        ['[0.061] net: link up ............ ', 'ok'],
        ['[0.070] exec /home', '']
    ];

    function finish(boot) {
        if (doc) doc.classList.remove('booting');
        if (!boot) return;
        boot.classList.add('done');
        setTimeout(function () {
            if (boot.parentNode) boot.parentNode.removeChild(boot);
        }, 600);
    }

    function runBoot() {
        var boot = document.querySelector('.boot');
        var pre = boot && boot.querySelector('pre');
        var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        var seen = false;
        try {
            seen = sessionStorage.getItem('semiloker-booted') === '1';
        } catch (err) { seen = false; }

        if (!boot || !pre || reduce || seen) {
            if (boot && boot.parentNode) boot.parentNode.removeChild(boot);
            if (doc) doc.classList.remove('booting');
            return;
        }

        try {
            sessionStorage.setItem('semiloker-booted', '1');
        } catch (err) { /* private mode: the log just replays */ }

        var i = 0;
        (function step() {
            if (i >= BOOT.length) {
                setTimeout(function () { finish(boot); }, 280);
                return;
            }
            var text = BOOT[i][0];
            var ok = BOOT[i][1];
            pre.insertAdjacentHTML(
                'beforeend',
                text + (ok ? '<span class="ok">' + ok + '</span>' : '') + '\n'
            );
            i++;
            setTimeout(step, i === 1 ? 200 : 100);
        })();
    }

    /* ---- wiring ------------------------------------------------------ */

    if (doc) doc.classList.add('booting');

    function layout() {
        readLh();
        fitBanner();
        indexLines();
        buildGutter();
        measureChar();
    }

    var pending = null;
    function relayout() {
        clearTimeout(pending);
        pending = setTimeout(layout, 120);
    }

    layout();
    window.addEventListener('load', layout);
    window.addEventListener('resize', relayout);
    window.addEventListener('orientationchange', relayout);

    if (window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseleave', clearRow);
    }

    runBoot();
})();
