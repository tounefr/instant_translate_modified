(function(undefined) {
  
  pl.extend(ke.templates, {
    get helpTooltip() {
      return '\
        <div class="help-tt-wrap">\
          <div class="text-layout">\
            <div class="text-container"><%=content%></div>\
          </div>\
        </div>\
      ';
    }
  });

})();