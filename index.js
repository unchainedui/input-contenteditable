import compose from 'uc-compose';
import { on, off, create, remove, addDelayRemoveClass, insertBefore } from 'uc-dom';
import html from 'uc-dom/methods';
import input from 'uc-input';
import transform from 'uc-input/transform';

const rxNbsp = /&nbsp;/ig;

const Input = function(opts) {
  this.didUpdate = opts.onChange;
  this.el = opts.el || this.render(opts);
  this.input = this.el;

  this.setup(opts);
  this.events.ekeydown = on(this.el, 'keydown', e => {
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
    this.events.eclick = on(this.el, 'click', e => {
      e.preventDefault();
    });
  }

  this.attr('contenteditable', true);
  this.trim = !!opts.trim;
  this.transforms = [];
  this.pushTransform('fix');
  this.pushTransform(opts);
}

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
          remove(el)
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
      el.focus();
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
      off(this.el, 'keydown', this.events.ekeydown);
      off(this.el, 'click', this.events.eclick);
      this.destroy();
      this.el.removeAttribute('contenteditable');
      this._remove && remove(this.el);
      delete this.el;
    }
  }
);

export default Input;
