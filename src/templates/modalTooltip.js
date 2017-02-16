(function(undefined) {
  
  pl.extend(ke.templates, {
    get modalTooltip() {
      return '\
        <div class="<%=prefix%>t modal-tooltip-wrap">\
          <div class="<%=prefix%>t modal-inside-layout">\
            <div class="<%=prefix%>t m-headline">\
              <div class="<%=prefix%>t m-head"><%=headline%></div>\
              <div class="m-close-wrap">\
                <div class="m-close"></div>\
              </div>\
            </div>\
            <div class="<%=prefix%>t m-text-wrap">\
              <div class="<%=prefix%>t m-text"><%=text%></div>\
            </div>\
          </div>\
        </div>\
      ';
    }
  });

})();