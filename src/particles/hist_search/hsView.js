(function (undefined) {

    pl.extend(ke.particles.hist_search.view, {
        toggleNotFoundCap: function () {
            ke.particles.hist_list.model.toggleListEndCap('History_Content_List_OnFindFailure');
        }
    });

})();