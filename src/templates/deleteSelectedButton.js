(function() {
	
	pl.extend(ke.templates, {
    get deleteSelectedButton() {
      return '\
        <div class="button-label">\
          <div class="button-text"><%=button%></div>\
        </div>\
        <div class="ds-counter-wrap">\
          <div class="number">0</div>\
        </div>\
      ';
    }
  });

})();