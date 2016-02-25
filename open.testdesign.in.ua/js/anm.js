!function() {

  'use strict';

  var elementClass = document.getElementById("paralax").getAttribute('data-anm');

  if (!elementClass) {
    return;
  }

  var msie = /MSIE.\d+\./gi.test(navigator.userAgent) &&
    +navigator.userAgent.replace(/.*MSIE.(\d+)\..*/gi, "$1") < 9;

  var eventName = 'ontouchstart' in window ||
    'onmsgesturechange' in window ? 'touchmove' : 'mousemove';

  var pause;

  var effects = [
    'x',
    'y',
    'scale',
    'opacity',
    'rotate',
    'matrix'
  ];

  var transformMap = {
    'webkitTransform' : 'translate3d',
    'MozTransform' : 'translate3d',
    'msTransform' : 'translate3d',
    'OTransform' : 'translate',
    'transform' : 'translate3d'
  };
    var transformM = {
    'wtransform' : 'translate'
  };

  function anm() {

  }  


  var elements = anm.elements = document.querySelectorAll(elementClass);


  anm.on = function() {
    pause = false;
  };


  anm.off = function() {
    pause = true;
  };


  anm.toggle = function() {
    pause = !pause;
  };


  function calculatePosition(e) {
    var pos = {};
    pos.x = e.clientX - window.innerWidth / 2 || 0;
    pos.y = e.clientY - window.innerHeight / 2 || 0;
    pos.fi = (Math.atan(pos.x === 0 ? Infinity : -pos.y / pos.x) +
      (pos.x < 0 ? Math.PI : (-pos.y < 0 ? 2 * Math.PI : 0)));
    pos.s = 45 * Math.sin(2 * pos.fi) / 100;
    pos.x /= 100;
    pos.y /= 100;
    pos.r = Math.sqrt(Math.pow(pos.x, 2) + Math.pow(pos.y, 2)) /
      Math.sqrt(Math.pow(window.innerWidth, 2) +
      Math.pow(window.innerHeight, 2)) * 2;
    return pos;
  }


  function calculateFactors(el) {
    var fact = {};
    for (var i = 0; i < effects.length; i++) {
      fact[effects[i]] = +el.getAttribute('data-speed-' + effects[i]) || 0;
    }
    return fact;
  }

  function calculateTransforms(pos, fact) {
    var transform = {};
    transform.x = pos.x * fact.x + 'px';
    transform.y = pos.y * fact.y + 'px';
    transform.scale = 1 + (pos.r * fact.scale);
    transform.opacity = 1 - (pos.r * Math.abs(fact.opacity));
    transform.matrix = pos.matrix * fact.matrix;
    transform.rotate = -pos.s * pos.r * 100 * fact.rotate + 'deg';
    return transform;
  }


  function setElementStyle(el, transform) {

    if (msie) {

      el.style.marginLeft = transform.x;
      el.style.marginTop = transform.y;

    } else {

      for (var m in transformMap) {
        if (transformMap.hasOwnProperty(m)) {
          el.style[m] = [
            transformMap[m],
            '(',
            transform.x + ',' + transform.y,
            transformMap[m] === 'translate' ? '' : ',0',
            ') scale(',
            transform.scale,
            ') rotateY(',
            transform.rotate,
            ') rotate(',
            transform.rotate,
            ')'
          ].join('');
        }
      }



      el.style.opacity = transform.opacity;
      el.style.MozOpacity = transform.opacity;

    }

  }


    function position(e) {

        if (pause) {
            return;
        }

        e = e.type === 'touchmove' ? e.changedTouches[0] : e;
        var fact, transform, pos = calculatePosition(e);

        for (var i = 0, el; i < elements.length; i++) {
            el = elements[i];
            fact = calculateFactors(el);
            transform = calculateTransforms(pos, fact);
            setElementStyle(el, transform);
        }

    }

    position({});


    if (window.addEventListener) {
        window.addEventListener(eventName, position, false);
    } else {
        window.attachEvent('onmousemove', function() {
            position.call(window, window.event);
        });
    }


    if (typeof define === 'function' && define.amd) {

        define([], function() {
            return anm;
        });

    } else if (typeof module !== 'undefined' && module.exports) {

        module.exports = anm;

    } else {

        this.anm = anm;

    }

}.call(this);