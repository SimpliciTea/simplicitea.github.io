(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./scroll-to.js');
require('./rainbow.js');

},{"./rainbow.js":2,"./scroll-to.js":3}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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
