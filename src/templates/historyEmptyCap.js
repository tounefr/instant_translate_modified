(function() {
  
  pl.extend(ke.templates, {
    get historyEmptyCap() {
      return '\
        <div class="ec-wrap <%=has_margin%>">\
          <div class="ec-inside-layout">\
            <div class="ec-text"><%=text%></div>\
          </div>\
        </div>\
      ';
    }
  });

})();