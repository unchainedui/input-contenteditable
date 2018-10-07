(function () {
  'use strict';

  const rxQuery = /^\s*([>+~])?\s*([*\w-]+)?(?:#([\w-]+))?(?:\.([\w.-]+))?\s*/;
  const rxClassOnly = /^\.([-\w]+)$/;
  const rxIdOnly = /^#([-\w]+)$/;

  function get(selector, root = document) {
    const id = selector.match(rxIdOnly);
    if (id) {
      return document.getElementById(id[1]);
    }

    const className = selector.match(rxClassOnly);
    if (className) {
      return root.getElementsByClassName(className[1]);
    }

    return root.querySelectorAll(selector);
  }

  function query(selector) {
    let f;
    const out = [];
    if (typeof selector === 'string') {
      while (selector) {
        f = selector.match(rxQuery);
        if (f[0] === '') {
          break;
        }

        out.push({
          rel: f[1],
          tag: (f[2] || '').toUpperCase(),
          id: f[3],
          classes: (f[4]) ? f[4].split('.') : undefined
        });
        selector = selector.substring(f[0].length);
      }
    }
    return out;
  }

  function createNs(namespaceURI, selector) {
    const s = query(selector)[0];
    const tag = s.tag;
    if (!tag) {
      return null;
    }

    const el = document.createElementNs(namespaceURI, tag);
    const id = s.id;
    if (id) {
      el.id = id;
    }

    const classes = s.classes;
    if (classes) {
      el.className = classes.join(' ');
    }

    return el;
  }

  function create(selector, content) {
    const s = query(selector)[0];
    const tag = s.tag;
    if (!tag) {
      return null;
    }

    const el = document.createElement(tag);
    const id = s.id;
    if (id) {
      el.id = id;
    }

    const classes = s.classes;
    if (classes) {
      el.className = classes.join(' ');
    }

    if (content) {
      el.innerHTML = content;
    }

    return el;
  }

  function closest(el, selector) {
    while (!el.matches(selector) && (el = el.parentElement));
    return el;
  }

  function attr(el, name, value) {
    if (value === undefined) {
      return el.getAttribute(name);
    }

    el.setAttribute(name, value);
  }

  function append(parent, el) {
    parent.appendChild(el);
    return parent;
  }

  function prepend(parent, el) {
    parent.insertBefore(el, parent.firstChild);
    return parent;
  }

  function appendTo(el, parent) {
    parent.appendChild(el);
    return el;
  }

  function prependTo(el, parent) {
    parent.insertBefore(el, parent.firstChild);
    return el;
  }

  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  function on(el, event, selector, handler, options) {
    if (typeof selector !== 'string') {
      handler = selector;
      selector = undefined;
    }

    if (!selector) {
      el.addEventListener(event, handler, options);
      return handler;
    }

    return on(el, event, e => {
      const target = closest(e.target, selector);
      if (target) {
        handler.call(target, e);
      }
    }, options);
  }

  function off(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
    return handler;
  }

  function once(el, event, handler, options) {
    const _handler = (...args) => {
      handler(...args);
      off(el, event, handler);
    };

    el.addEventListener(event, handler, options);
    return _handler;
  }

  function addClass(el, ...cls) {
    return el.classList.add(...cls);
  }

  function removeClass(el, ...cls) {
    return el.classList.remove(...cls);
  }

  function toggleClass(el, cls, force) {
    return el.classList.toggle(cls, force);
  }

  function addDelayRemoveClass(el, cls, delay) {
    addClass(el, cls);
    return setTimeout(() => removeClass(el, cls), delay);
  }

  function replaceClass(el, rx, newClass) {
    const newClasses = [];
    attr(el, 'class').split(' ').forEach(function(cls) {
      const c = rx.test(cls) ? newClass : cls;

      if (newClasses.indexOf(c) === -1) {
        newClasses.push(c);
      }
    });

    attr(el, 'class', newClasses.join(' '));
    return newClasses.length;
  }

  function insertBefore(el, node) {
    return node.parentNode.insertBefore(el, node);
  }

  function insertAfter(el, node) {
    return node.parentNode.insertBefore(el, node.nextSibling);
  }

  function remove(el) {
    return el.parentNode.removeChild(el);
  }

  var dom = /*#__PURE__*/Object.freeze({
    get: get,
    query: query,
    createNs: createNs,
    create: create,
    closest: closest,
    attr: attr,
    append: append,
    prepend: prepend,
    appendTo: appendTo,
    prependTo: prependTo,
    ready: ready,
    on: on,
    off: off,
    once: once,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    addDelayRemoveClass: addDelayRemoveClass,
    replaceClass: replaceClass,
    insertBefore: insertBefore,
    insertAfter: insertAfter,
    remove: remove
  });

  function compose(...args) {
    let newObject = true;

    if (args[args.length - 1] === true) {
      args.pop();
      newObject = false;
    }

    newObject && args.unshift({});
    return Object.assign.apply(Object, args);
  }

  /*eslint-disable strict */

  const html = [
    'addClass',
    'removeClass',
    'toggleClass',
    'replaceClass',
    'appendTo',
    'prependTo',
    'insertBefore',
    'insertAfter'
  ].reduce((obj, method) => {
    obj[method] = function(...args) {
      dom[method].apply(null, [ this.el ].concat(args));
      return this;
    };
    return obj;
  }, {});

  html.attr = function(name, value) {
    if (value === undefined) {
      return this.el.getAttribute(name);
    }

    this.el.setAttribute(name, value);
    return this
  };

  html.find = function(selector) {
    return get(selector, this.el);
  };

  function closest$1(el, selector) {
    while (!el.matches(selector) && (el = el.parentElement));
    return el;
  }

  function on$1(el, event, selector, handler, options) {
    if (typeof selector !== 'string') {
      handler = selector;
      selector = undefined;
    }

    if (!selector) {
      el.addEventListener(event, handler, options);
      return handler;
    }

    return on$1(el, event, e => {
      const target = closest$1(e.target, selector);
      if (target) {
        handler.call(target, e);
      }
    }, options);
  }

  function off$1(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
    return handler;
  }

  function debounce(func, wait, immediate) {
    let timeout;
    const fn = function(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) {
          func.apply(this, args);
        }
      };

      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);

      if (callNow) {
        func.apply(this, args);
      }
    };

    fn.cancel = function() {
      clearTimeout(timeout);
    };

    return fn;
  }

  var charMap = {
    // latin
    'À': 'A',
    'Á': 'A',
    'Â': 'A',
    'Ã': 'A',
    'Ä': 'Ae',
    'Å': 'A',
    'Æ': 'AE',
    'Ç': 'C',
    'È': 'E',
    'É': 'E',
    'Ê': 'E',
    'Ë': 'E',
    'Ì': 'I',
    'Í': 'I',
    'Î': 'I',
    'Ï': 'I',
    'Ð': 'D',
    'Ñ': 'N',
    'Ò': 'O',
    'Ó': 'O',
    'Ô': 'O',
    'Õ': 'O',
    'Ö': 'Oe',
    'Ő': 'O',
    'Ø': 'O',
    'Ù': 'U',
    'Ú': 'U',
    'Û': 'U',
    'Ü': 'Ue',
    'Ű': 'U',
    'Ý': 'Y',
    'Þ': 'TH',
    'ß': 'ss',
    'à': 'a',
    'á': 'a',
    'â': 'a',
    'ã': 'a',
    'ä': 'ae',
    'å': 'a',
    'æ': 'ae',
    'ç': 'c',
    'è': 'e',
    'é': 'e',
    'ê': 'e',
    'ë': 'e',
    'ì': 'i',
    'í': 'i',
    'î': 'i',
    'ï': 'i',
    'ð': 'd',
    'ñ': 'n',
    'ò': 'o',
    'ó': 'o',
    'ô': 'o',
    'õ': 'o',
    'ö': 'oe',
    'ő': 'o',
    'ø': 'o',
    'ù': 'u',
    'ú': 'u',
    'û': 'u',
    'ü': 'ue',
    'ű': 'u',
    'ý': 'y',
    'þ': 'th',
    'ÿ': 'y',
    'ẞ': 'SS',
    // greek
    'α': 'a',
    'β': 'b',
    'γ': 'g',
    'δ': 'd',
    'ε': 'e',
    'ζ': 'z',
    'η': 'h',
    'θ': '8',
    'ι': 'i',
    'κ': 'k',
    'λ': 'l',
    'μ': 'm',
    'ν': 'n',
    'ξ': '3',
    'ο': 'o',
    'π': 'p',
    'ρ': 'r',
    'σ': 's',
    'τ': 't',
    'υ': 'y',
    'φ': 'f',
    'χ': 'x',
    'ψ': 'ps',
    'ω': 'w',
    'ά': 'a',
    'έ': 'e',
    'ί': 'i',
    'ό': 'o',
    'ύ': 'y',
    'ή': 'h',
    'ώ': 'w',
    'ς': 's',
    'ϊ': 'i',
    'ΰ': 'y',
    'ϋ': 'y',
    'ΐ': 'i',
    'Α': 'A',
    'Β': 'B',
    'Γ': 'G',
    'Δ': 'D',
    'Ε': 'E',
    'Ζ': 'Z',
    'Η': 'H',
    'Θ': '8',
    'Ι': 'I',
    'Κ': 'K',
    'Λ': 'L',
    'Μ': 'M',
    'Ν': 'N',
    'Ξ': '3',
    'Ο': 'O',
    'Π': 'P',
    'Ρ': 'R',
    'Σ': 'S',
    'Τ': 'T',
    'Υ': 'Y',
    'Φ': 'F',
    'Χ': 'X',
    'Ψ': 'PS',
    'Ω': 'W',
    'Ά': 'A',
    'Έ': 'E',
    'Ί': 'I',
    'Ό': 'O',
    'Ύ': 'Y',
    'Ή': 'H',
    'Ώ': 'W',
    'Ϊ': 'I',
    'Ϋ': 'Y',
    // turkish
    'ş': 's',
    'Ş': 'S',
    'ı': 'i',
    'İ': 'I',
    // 'ç': 'c', // duplicate
    // 'Ç': 'C', // duplicate
    // 'ü': 'ue', // duplicate
    // 'Ü': 'Ue', // duplicate
    // 'ö': 'oe', // duplicate
    // 'Ö': 'Oe', // duplicate
    'ğ': 'g',
    'Ğ': 'G',
    // macedonian
    'Ќ': 'Kj',
    'ќ': 'kj',
    'Љ': 'Lj',
    'љ': 'lj',
    'Њ': 'Nj',
    'њ': 'nj',
    'Тс': 'Ts',
    'тс': 'ts',
    // russian */
    'а': 'a',
    'б': 'b',
    'в': 'v',
    'г': 'g',
    'д': 'd',
    'е': 'e',
    'ё': 'yo',
    'ж': 'zh',
    'з': 'z',
    'и': 'i',
    'й': 'y',
    'к': 'k',
    'л': 'l',
    'м': 'm',
    'н': 'n',
    'о': 'o',
    'п': 'p',
    'р': 'r',
    'с': 's',
    'т': 't',
    'у': 'u',
    'ф': 'f',
    'х': 'h',
    'ц': 'c',
    'ч': 'ch',
    'ш': 'sh',
    'щ': 'sch',
    'ъ': '',
    'ы': 'y',
    'ь': '',
    'э': 'e',
    'ю': 'yu',
    'я': 'ya',
    'А': 'A',
    'Б': 'B',
    'В': 'V',
    'Г': 'G',
    'Д': 'D',
    'Е': 'E',
    'Ё': 'Yo',
    'Ж': 'Zh',
    'З': 'Z',
    'И': 'I',
    'Й': 'J',
    'К': 'K',
    'Л': 'L',
    'М': 'M',
    'Н': 'N',
    'О': 'O',
    'П': 'P',
    'Р': 'R',
    'С': 'S',
    'Т': 'T',
    'У': 'U',
    'Ф': 'F',
    'Х': 'H',
    'Ц': 'C',
    'Ч': 'Ch',
    'Ш': 'Sh',
    'Щ': 'Sh',
    'Ъ': '',
    'Ы': 'Y',
    'Ь': '',
    'Э': 'E',
    'Ю': 'Yu',
    'Я': 'Ya',
    // ukranian
    'Є': 'Ye',
    'І': 'I',
    'Ї': 'Yi',
    'Ґ': 'G',
    'є': 'ye',
    'і': 'i',
    'ї': 'yi',
    'ґ': 'g',
    // czech
    'č': 'c',
    'ď': 'd',
    'ě': 'e',
    'ň': 'n',
    'ř': 'r',
    'š': 's',
    'ť': 't',
    'ů': 'u',
    'ž': 'z',
    'Č': 'C',
    'Ď': 'D',
    'Ě': 'E',
    'Ň': 'N',
    'Ř': 'R',
    'Š': 'S',
    'Ť': 'T',
    'Ů': 'U',
    'Ž': 'Z',
    // polish
    'ą': 'a',
    'ć': 'c',
    'ę': 'e',
    'ł': 'l',
    'ń': 'n',
    // 'ó': 'o', // duplicate
    'ś': 's',
    'ź': 'z',
    'ż': 'z',
    'Ą': 'A',
    'Ć': 'C',
    'Ę': 'E',
    'Ł': 'L',
    'Ń': 'N',
    'Ś': 'S',
    'Ź': 'Z',
    'Ż': 'Z',
    // latvian
    'ā': 'a',
    // 'č': 'c', // duplicate
    'ē': 'e',
    'ģ': 'g',
    'ī': 'i',
    'ķ': 'k',
    'ļ': 'l',
    'ņ': 'n',
    // 'š': 's', // duplicate
    'ū': 'u',
    // 'ž': 'z', // duplicate
    'Ā': 'A',
    // 'Č': 'C', // duplicate
    'Ē': 'E',
    'Ģ': 'G',
    'Ī': 'I',
    'Ķ': 'k',
    'Ļ': 'L',
    'Ņ': 'N',
    // 'Š': 'S', // duplicate
    'Ū': 'U',
    // 'Ž': 'Z', // duplicate
    // Arabic
    'ا': 'a',
    'أ': 'a',
    'إ': 'i',
    'آ': 'aa',
    'ؤ': 'u',
    'ئ': 'e',
    'ء': 'a',
    'ب': 'b',
    'ت': 't',
    'ث': 'th',
    'ج': 'j',
    'ح': 'h',
    'خ': 'kh',
    'د': 'd',
    'ذ': 'th',
    'ر': 'r',
    'ز': 'z',
    'س': 's',
    'ش': 'sh',
    'ص': 's',
    'ض': 'dh',
    'ط': 't',
    'ظ': 'z',
    'ع': 'a',
    'غ': 'gh',
    'ف': 'f',
    'ق': 'q',
    'ك': 'k',
    'ل': 'l',
    'م': 'm',
    'ن': 'n',
    'ه': 'h',
    'و': 'w',
    'ي': 'y',
    'ى': 'a',
    'ة': 'h',
    'ﻻ': 'la',
    'ﻷ': 'laa',
    'ﻹ': 'lai',
    'ﻵ': 'laa',
    // Arabic diactrics
    'َ': 'a',
    'ً': 'an',
    'ِ': 'e',
    'ٍ': 'en',
    'ُ': 'u',
    'ٌ': 'on',
    'ْ': '',

    // Arabic numbers
    '٠': '0',
    '١': '1',
    '٢': '2',
    '٣': '3',
    '٤': '4',
    '٥': '5',
    '٦': '6',
    '٧': '7',
    '٨': '8',
    '٩': '9',
    // symbols
    '“': '"',
    '”': '"',
    '‘': '\'',
    '’': '\'',
    '∂': 'd',
    'ƒ': 'f',
    '™': '(TM)',
    '©': '(C)',
    'œ': 'oe',
    'Œ': 'OE',
    '®': '(R)',
    '†': '+',
    '℠': '(SM)',
    '…': '...',
    '˚': 'o',
    'º': 'o',
    'ª': 'a',
    '•': '*',
    // currency
    '$': 'USD',
    '€': 'EUR',
    '₢': 'BRN',
    '₣': 'FRF',
    '£': 'GBP',
    '₤': 'ITL',
    '₦': 'NGN',
    '₧': 'ESP',
    '₩': 'KRW',
    '₪': 'ILS',
    '₫': 'VND',
    '₭': 'LAK',
    '₮': 'MNT',
    '₯': 'GRD',
    '₱': 'ARS',
    '₲': 'PYG',
    '₳': 'ARA',
    '₴': 'UAH',
    '₵': 'GHS',
    '¢': 'cent',
    '¥': 'CNY',
    '元': 'CNY',
    '円': 'YEN',
    '﷼': 'IRR',
    '₠': 'EWE',
    '฿': 'THB',
    '₨': 'INR',
    '₹': 'INR',
    '₰': 'PF'
  };

  const rxAstralRange = /&nbsp;|\ud83c[\udffb-\udfff](?=\ud83c[\udffb-\udfff])|(?:[^\ud800-\udfff][\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]?|[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?(?:\u200d(?:[^\ud800-\udfff]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff])[\ufe0e\ufe0f]?(?:[\u0300-\u036f\ufe20-\ufe23\u20d0-\u20f0]|\ud83c[\udffb-\udfff])?)*/g;

  function length(str) {
    const match = str.match(rxAstralRange);
    return (match === null) ? 0 : match.length;
  }

  function substring(str, begin, end) {
    return str.match(rxAstralRange).slice(begin, end).join('')
  }

  function slugify(str) {
    return str
      .toLowerCase()
      .split('')
      .map(char => charMap[char] || char)
      .join('')
      .replace(/ /ig, '-')
      .replace(/[^-a-z0-9]{1,60}/ig, '');
  }

  var input = {
    setValue: function() {
      // interface, implement this in your class
    },

    getValue: function() {
      // interface, implement this in your class
    },

    setPlaceholder: function() {
      // interface, implement this in your class
    },

    removePlaceholder: function() {
      // interface, implement this in your class
    },

    setCarret: function() {
      // interface, implement this in your class
    },

    getCarret: function() {
      // interface, implement this in your class
    },

    resetCarret: function() {
      // interface, implement this in your class
    },

    addInput: function(opts) {
      this.debouncedUpdate = debounce(this.update, opts.debounce || 500);

      let isMeta = false;
      this._value = this.getValue();
      this.limit = opts.limit;
      this.events.click = on$1(this.el, 'click', e => e.stopPropagation());
      this.events.focus = on$1(this.input, 'focus', () => this.removeClass('input-message'));
      this.events.blur = on$1(this.input, 'blur', () => {
        isMeta = false;
        this.toggleClass('input-value', this.getValue() !== '');
        this.onKeyUp();
      });
      this.events.paste = on$1(this.input, 'paste', e => this.onPaste(e));
      this.events.keydown = on$1(this.input, 'keydown', e => {
        isMeta = e.altKey || e.ctrlKey || e.metaKey;
      });
      this.events.keyup = on$1(this.input, 'keyup', e => {
        if (isMeta || !e.keyCode) {
          return;
        }
        this.onKeyUp();
      });

      opts.placeholder && this.setPlaceholder(opts.placeholder);
      this.toggleClass('input-value', this._value !== '');
    },

    onKeyUp: function() {
      const pos = this.getCarret();
      const limit = this.limit;
      let val = this.transform(this.getValue(), true);
      let needUpdate = false;

      if (limit && length(val) > limit) {
        val = substring(val, 0, limit);
        needUpdate = true;
      }

      if (val !== this._value || needUpdate) {
        this._value = val;
        this.setValue(val);
        this.setCarret(pos);
        this.debouncedUpdate(val);
      }
    },

    onPaste: function(e) {
      const str = e.clipboardData.getData('text/plain');
      const pos = this.getCarret();
      document.execCommand('insertText', false, str);
      e.preventDefault();
      e.stopPropagation();

      setTimeout(() => {
        const val = this.transform(this.getValue());
        this.setValue(val);
        this.setCarret(pos + str.length);
        this.update(val);
      }, 100);
    },

    update: function(val, silent) {
      this.removeClass('error');
      !silent && this.onChange && this.onChange(val);
    },

    focus: function() {
      this.input.focus();
      this.resetCarret();
      return this;
    },

    blur: function() {
      this.input.blur();
      return this;
    },

    value: function(val, silent) {
      if (val === undefined) {
        return this.getValue();
      }

      const value = this.getValue();
      val = this.transform(val);

      if (val !== value) {
        this.setValue(val);
        if (silent) {
          this.toggleClass('input-value', val !== '');
        } else {
          this.update(val);
        }
      }
      return this;
    },

    on: function(...args) {
      return on$1.apply(null, [ this.input ].concat(args));
    },

    off: function(...args) {
      return off$1.apply(null, [ this.input ].concat(args));
    },

    removeInput: function() {
      this.removePlaceholder && this.removePlaceholder();
      this.removeClass('input-msg', 'input-value');

      const events = this.events;
      off$1(this.el, 'click', events.click);
      off$1(this.input, 'focus', events.focus);
      off$1(this.input, 'blur', events.blur);
      off$1(this.input, 'paste', events.paste);
      off$1(this.input, 'keydown', events.keydown);
      off$1(this.input, 'keyup', events.keyup);

      delete this.input;
      delete this.events;
    }
  };

  const rxGt = /&gt;/g;
  const rxNoTags = /<[^>]*>/ig;
  const rxMultipleSpaces = /\s{2,}/g;

  const transforms = {
    slugify,

    noHtml: str => str.replace(rxNoTags, ''),

    fix: str => str
      .replace(rxGt, '>')
      .replace(rxMultipleSpaces, ' '),

    trim: (str, stopper) => {
      if (stopper) {
        return str;
      }

      return str.trim();
    }
  };

  function apply(arr, fn, push) {
    const order = push ? 'push' : 'unshift';

    switch (typeof fn) {
      case 'string':
        arr[order](transforms[fn]);
        break;

      case 'function':
        arr[order](fn);
        break;

      case 'object':
        for (const prop in transforms) {
          if (fn[prop]) {
            arr[order](transforms[prop]);
          }
        }
        break;
    }
  }

  var transform = {
    unshiftTransform: function(fn) {
      apply(this.transforms, fn, false);
    },

    pushTransform: function(fn) {
      apply(this.transforms, fn, true);
    },

    transform: function(val, stopper) {
      if (!this.transforms.length) {
        return val;
      }

      const transforms = this.transforms;
      for (const i in transforms) {
        if (!val) {
          break;
        }

        val = transforms[i](val, stopper);
      }

      return val;
    }
  };

  const rxNbsp = /&nbsp;/ig;

  const Input = function(opts) {
    this.didUpdate = opts.onChange;
    this.el = opts.el || this.render(opts);
    this.input = this.el;

    this.events = {};
    this.addInput(opts);
    this.events.stopKeys = on(this.el, 'keydown', e => {
      switch (e.keyCode) {
        case 8:
          setTimeout(() => this.sanitizeBackspace(), 0);
          break;

        case 13:
          e.preventDefault();
          break;
      }
    });

    if (opts.stopLinks) {
      this.events.stopLinks = on(this.el, 'click', e => {
        e.preventDefault();
      });
    }

    this.attr('contenteditable', true);
    this.trim = !!opts.trim;
    this.transforms = [];
    this.pushTransform('fix');
    this.pushTransform(opts);
  };

  Input.prototype = compose(
    html,
    transform,
    input,
    {
      render: function() {
        this._remove = true;
        return create('div.contenteditable');
      },

      update: function(val, silent) {
        this.removeClass('error');
        if (!silent && this.didUpdate) {
          val = val.replace(rxNbsp, ' ');
          if (this.trim) {
            val = val.trim();
          }
          this.didUpdate(val);
        }
      },

      sanitizeBackspace: function() {
        this.find('span').forEach(el => {
          if (el.style) {
            insertBefore(el, el.textNode);
            remove(el);
          }
        });
      },

      setValue: function(val) {
        this.input.innerHTML = val;
      },

      getValue: function() {
        return this.input.innerHTML;
      },

      getCarret: function() {
        const el = this.input;
        // el.focus();
        const sel = window.getSelection();

        if (sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          const preCaretRange = range.cloneRange();
          preCaretRange.selectNodeContents(el);
          preCaretRange.setEnd(range.endContainer, range.endOffset);
          return preCaretRange.toString().length;
        }

        return 0;
      },

      setCarret: function(pos) {
        const el = this.input;
        const textNode = el.firstChild;
        if (!textNode) {
          return this;
        }

        pos = Math.min(pos, textNode.textContent.length);
        el.focus();
        const range = document.createRange();
        range.setStart(textNode, pos);
        range.setEnd(textNode, pos);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        return this;
      },

      resetCarret: function(toBegin) {
        const el = this.input;
        el.focus();
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(toBegin);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        return this;
      },

      setPlaceholder: function(placeholder) {
        this.attr('placeholder', placeholder);
        return this;
      },

      removePlaceholder: function() {
        this.el.removeAttribute('placeholder');
        return this;
      },

      error: function() {
        this.errorTimeout = addDelayRemoveClass(this.el, 'error', 600);
      },

      remove: function() {
        clearTimeout(this.errorTimeout);
        off(this.el, 'keydown', this.events.stopKeys);
        off(this.el, 'click', this.events.stopLinks);
        this.removeInput();
        this.el.removeAttribute('contenteditable');
        this._remove && remove(this.el);
        delete this.el;
      }
    }
  );

  ready(() => {
    const elDisplay = get('#display');

    const input = new Input({
      onChange: val => {
        console.log('val', val);
        if (val === 'error') {
          input.error('Oops!');
        }
      }
    }).appendTo(elDisplay);

    // setTimeout(() => input.remove(), 5000);
  });

}());
