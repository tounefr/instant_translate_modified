(function(undefined) {
  
  pl.extend(ke.templates, {
    get confirmTooltip() {
      return '\
        <div class="<%=prefix%>t conf-tooltip-wrap">\
          <div class="<%=prefix%>t conf-inside-layout">\
            <div class="<%=prefix%>t confirmation-headline">\
              <div class="<%=prefix%>t conf-head"><%=headline%></div>\
            </div>\
            <div class="<%=prefix%>t confirmation-wrap">\
              <div class="<%=prefix%>t conf-text"><%=text%></div>\
            </div>\
            <div class="<%=prefix%>t answer-buttons-wrap">\
              <div class="<%=prefix%>t answer-button pos-but"><%=positive_button%></div>\
              <div class="<%=prefix%>t answer-button neg-but"><%=negative_button%></div>\
            </div>\
          </div>\
        </div>\
      ';
    }
  });

})();