// noinspection JSUnresolvedVariable

jQuery.noConflict();

(function($)
{
    $(function()
    {
        console.log("main.js");

        function checkChanges()
        {
            log("checkChanges()");
        }


        // At each change of the page, checking the changes.
        new MutationObserver(checkChanges).observe(document, {childList: true, subtree: true});
    });
})(jQuery);
