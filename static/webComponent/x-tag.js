const xTag = (function(factroy) {
  return factroy.call();
}(function() {
  var __DEFS__ = {
    lifecycle: {
      created: function() {},
      attributeChanged: function () {}
    },
    methods: {

    }
  };
  var __CORE__ = {
    register: function(tag, options) {
      var thisDoc = document.currentScript.ownerDocument;
      var template = thisDoc.querySelector('template').content;
      var element = Object.create(HTMLElement.prototype);
      
      element.createdCallback = function() {
        var clone = document.importNode(template, true);
        
        var shadowRoot = this.attachShadow({ mode: 'open' });

        shadowRoot.appendChild(clone);

        if (!options.methods) {
          options.methods = __DEFS__.methods;
        }

        for (var method in options.methods) {
          this[method] = options.methods[method];
        }
        if (options.lifecycle && options.lifecycle.created) {
          options.lifecycle.created.call(this);
        } else {
          __DEFS__.lifecycle.created.call(this);
        }
      }
      element.attributeChangedCallback = function(attr, oldVal, newVal) {
        if (options.lifecycle && options.lifecycle.attributeChanged) {
          options.lifecycle.attributeChanged.call(this, attr, oldVal, newVal);
        } else {
          __DEFS__.lifecycle.attributeChanged.call(this, attr, oldVal, newVal);
        }
      }
      document.registerElement(tag, {
        prototype: element
      })
    }
  };
  return __CORE__;
}));