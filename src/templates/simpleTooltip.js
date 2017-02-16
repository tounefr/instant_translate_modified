(function(undefined) {
  
  pl.extend(ke.templates, {
    get simpleTooltip() {
      return '\
        <div class="<%=prefix%>tooltip-main-wrap <%=prefix%>tooltip-<%=ttid%> <%=prefix%>t" id="<%=prefix%>tooltip-wrap" data-ttid="<%=ttid%>">\
          <div class="<%=prefix%>t <%=prefix%>inside-layout">\
            <div class="<%=prefix%>t <%=prefix%>content"><%=content%></div>\
          </div>\
        </div>\
      ';
    }
  });

})();