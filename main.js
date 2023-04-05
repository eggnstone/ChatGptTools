// noinspection JSUnresolvedVariable
jQuery.noConflict();

(function($)
{
    $(function()
    {
        function checkChanges()
        {
            try
            {
                const groups = $("div.group:not(.chatgpt-tools-visited)");
                for (let groupIndex = 0; groupIndex < groups.length; groupIndex++)
                {
                    const group = groups[groupIndex];
                    group.className += " chatgpt-tools-visited";

                    let textBase = group.children[0];
                    let rightPart = textBase.children[1];
                    let middleColumn = rightPart.children[0];
                    let rightColumn = rightPart.children[1];
                    let item = rightColumn.children[0];
                    if (item.tagName === "DIV")
                        item = item.children[0];

                    const text = middleColumn.innerText;
                    const button = document.createElement('button');
                    button.innerHTML = createCopyToClipboardElement();
                    button.onclick = () => copyToClipboard(text);
                    item.parentElement.prepend(button);
                }
            }
            catch (e)
            {
                logError(e);
            }
        }

        // At each change of the page, checking the changes.
        new MutationObserver(checkChanges).observe(document, {childList: true, subtree: true});
    });
})(jQuery);
