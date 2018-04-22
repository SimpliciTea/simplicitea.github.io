(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./scroll-to.js');
require('./menu-mobile.js');
require('./rainbow.js');

},{"./menu-mobile.js":2,"./rainbow.js":3,"./scroll-to.js":4}],2:[function(require,module,exports){
((window) => {
  'use strict';

  /*
   *  Menu Constructor
   */
  function Menu() {
    this._init();
  }

  /*
   *  Initialize Menu
   */
  Menu.prototype._init = function() {
    this.body = document.body;
    this.wrapper = document.querySelector('.nav-mobile');
    this.menu = document.querySelector('.menu-mobile')
    this.menuItems = document.querySelectorAll('.menu-item');
    this.backdrop = document.querySelector('#menu-mobile-backdrop');
    this.toggleBtn = document.querySelector('.menu-toggle');
    this.lastScrollPosition = 0;

    this._initEvents();
  }

  /*
   *  Initialize menu events
   */
  Menu.prototype._initEvents = function() {
    
    // menu toggle handler
    this.toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      this._toggle();
    })

    // sticky menu handler
    window.addEventListener('scroll', (e) => {
      this._handlePageScroll();
    })

    // toggle menu off on link click
    this.menuItems.forEach(item => {
      item.addEventListener('click', (e) => {
        this._toggle();
      })
    })
  }

  /*
   *  Toggle Menu
   */
  Menu.prototype._toggle = function() {
    this.menu.classList.toggle('active');
    this.backdrop.classList.toggle('active');
    this.body.classList.toggle('has-active-menu');
    this.menuItems.forEach((item) => {
      item.classList.toggle('active');
    })
    this.toggleBtn.classList.toggle('active');
  }

  /*
   *  Toggle Navbar Anchor
   */
  Menu.prototype._handlePageScroll = function() {
    var currY = window.scrollY;
    var header = document.querySelector('header');

    // scrolling down?
    if (currY > this.lastScrollPosition) {

      // when below header, disappear
      if (currY > header.clientHeight - this.wrapper.clientHeight) {
        if (!this.wrapper.classList.contains('nav-mobile--anchored')) {
          this.wrapper.classList.add('nav-mobile--anchored');
        }
      }
    }

    // must be scrolling up!
    else {
      if (currY < header.clientHeight - 50) {
        if (this.wrapper.classList.contains('nav-mobile--anchored')) {
          this.wrapper.classList.remove('nav-mobile--anchored');
        }
      }
    }

    this.lastScrollPosition = currY;
  }

  window.Menu = Menu;
})(window);

const menu = new Menu();

},{}],3:[function(require,module,exports){
const colors = [ 
  // 'rgb(255, 151, 25)',
  // 'rgb(255, 163, 50)',
  // 'rgb(255, 174, 76)',
  // 'rgb(255, 186, 102)',
  // 'rgb(255, 197, 127)',
  // 'rgb(255, 209, 153)',
  // 'rgb(255, 220, 177)',
  'rgb(255, 226, 188)',
  'rgb(255, 231, 203)',
  'rgb(255, 237, 211)',
  'rgb(255, 242, 225)',
  'rgb(255, 249, 237',
  'rgb(255, 255, 255'
]

let rainbowStrings = document.getElementsByClassName('rainbowjs-string');


// wrap chars of each string in spans for styling
// keeping nodeList intact
[...rainbowStrings].forEach(string => {
  let mappedChars = string.innerHTML.split('').map(char => {
    return `<span class="rainbowjs-char">${char}</span>` 
  });

  string.innerHTML = mappedChars.join('');
});

let interval;
let init = false;

// fn to trigger color cycling on letters
function cycle() {
  // seed start
  if (!init) {
    let i = 0;

    [...this.childNodes].forEach(node => {
      if (i === colors.length) i = 0;
      // let color = colors[Math.floor(Math.random() * (colors.length))] || colors[0];

      node.style.color = colors[i];
      i++;
    });

    init = true;
  }
  
  // cycle
  [...this.childNodes].forEach(node => {
    let nextColorIndex = colors.indexOf(node.style.color) + 1;
    if (nextColorIndex === 5) nextColorIndex = 0;

    node.style.color = colors[nextColorIndex]
  });
}


// hover listeners
[...rainbowStrings].forEach(string => {

  string.addEventListener('mouseenter', () => interval=setInterval(cycle.bind(string), 50));
  
  string.addEventListener('mouseleave', () => {
    clearInterval(interval);
    init = false;

    [...string.childNodes].map(node => node.style.color = 'white');
  });
});

},{}],4:[function(require,module,exports){
var scrollLinks = document.getElementsByClassName('scroll-to');


// sought a vanilla-JS solution, chose to follow
// https://pawelgrzybek.com/page-scroll-in-vanilla-javascript/
function scrollIt(destination, duration = 200, easing = 'linear', callback) {

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  const start = window.pageYOffset;
  const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();

  const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
  const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
  const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
  const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);

  if ('requestAnimationFrame' in window === false) {
    window.scroll(0, destinationOffsetToScroll);
    if (callback) {
      callback();
    }
    return;
  }

  function scroll() {
    const now = 'now' in window.performance ? performance.now() : new Date().getTime();
    const time = Math.min(1, ((now - startTime) / duration));
    
    window.scroll(0, Math.ceil((easeInOutQuad(time) * (destinationOffsetToScroll - start)) + start));

    if (window.pageYOffset >= destinationOffsetToScroll - 3) {
      if (callback) {
        callback();
      }
      return;
    }

    requestAnimationFrame(scroll);
  }

  scroll();
}


[...scrollLinks].map(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    let scrollTargetId = link.href.slice(link.href.indexOf('#') + 1);
    let scrollTarget = document.getElementById(scrollTargetId);

    scrollIt(
      scrollTarget,
      300,
      'easeInOutQuad'
    );
  })
})

},{}]},{},[1]);
