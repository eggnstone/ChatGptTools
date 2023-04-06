// noinspection JSUnresolvedVariable

let menuTarget;

jQuery.noConflict();

init();

(function($)
{
    $(function()
    {
        function checkChanges()
        {
            try
            {
                const groups = $("div.group:not(.chatgpt-tools)");
                for (let groupIndex = 0; groupIndex < groups.length; groupIndex++)
                {
                    const group = groups[groupIndex];
                    group.className += " chatgpt-tools";

                    const text = getTextFromGroup(group);
                    const buttonsDiv = getButtonsDivFromGroup(group);

                    const button = document.createElement('button');
                    button.innerHTML = createCopyToClipboardElement();
                    button.onclick = () => copyToClipboard(text);
                    buttonsDiv.prepend(button);
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

function init()
{
    initTools();

    const menu = document.createElement("menu");
    menu.id = "chatgpt-tools-context-menu";
    menu.innerHTML =
        "<menu id='CopyText'>Copy text</menu>" +
        "<menu id='CopyTextAndAuthor'>Copy text and author</menu>" +
        "<menu id='CopyAllTexts'>Copy complete conversation</menu>" +
        "<menu id='CopyAllTextsAndAuthors'>Copy complete conversation and authors</menu>";
    document.body.appendChild(menu);

    // noinspection JSUnresolvedFunction
    const menuCssUrl = chrome.runtime.getURL('css/menu.css');
    fetch(menuCssUrl).then((response) =>
    {
        response.text().then((text) =>
        {
            const menuStyle = document.createElement("style");
            menuStyle.innerText = text;
            document.head.appendChild(menuStyle);
        });
    });

    document.addEventListener("click", function(e)
    {
        const menu = document.getElementById("chatgpt-tools-context-menu");
        menu.style.display = "none";

        if (e.target.id === "CopyText")
            copyText(e.target);
        else if (e.target.id === "CopyTextAndAuthor")
            copyTextAndAuthor(e.target);
        else if (e.target.id === "CopyAllTexts")
            copyAllTexts(e.target);
        else if (e.target.id === "CopyAllTextsAndAuthors")
            copyAllTextsAndAuthors(e.target);
    });

    document.addEventListener("contextmenu", function(e)
    {
        menuTarget = e.target;

        const menu = document.getElementById("chatgpt-tools-context-menu");

        let target = e.target;

        if (target.tagName.toLowerCase() === "path")
            target = target.parentElement;

        if (target.tagName.toLowerCase() === "svg")
            target = target.parentElement;

        if (target.tagName.toLowerCase() !== "button" || !target.className.startsWith("chatgpt-tools "))
        {
            menu.style.display = "none";
            return;
        }

        e.preventDefault();

        menu.style.display = "block";

        if (e.pageX + menu.clientWidth <= window.innerWidth)
            menu.style.left = e.pageX + "px";
        else
            menu.style.left = (window.innerWidth - menu.clientWidth - 2) + "px";

        if (e.pageY + menu.clientHeight <= window.innerHeight)
            menu.style.top = e.pageY + "px";
        else
            menu.style.top = (window.innerHeight - menu.clientHeight - 2) + "px";
    }, false);
}

function copyText()
{
    let target = menuTarget;
    while (target)
    {
        if (target.tagName.toLowerCase() === "div" && target.className && target.className.startsWith("group "))
            break;

        target = target.parentElement;
    }

    if (!target)
        return;

    const text = getTextFromGroup(target);
    copyToClipboard(text);
}

function copyTextAndAuthor()
{
    log("TODO: CopyTextAndAuthor");
}

function copyAllTexts()
{
    log("TODO: CopyAllTexts");
}

function copyAllTextsAndAuthors()
{
    log("TODO: copyAllTextsAndAuthors");
}

function getTextFromGroup(group)
{
    log("getTextFromGroup:");
    log("  group: " + group);
    log("  group.className: " + group.className);
    let textBase = group.children[0];
    log("  textBase: " + textBase);
    let rightPart = textBase.children[1];
    log("  rightPart: " + rightPart);
    let middleColumn = rightPart.children[0];
    log("  middleColumn: " + middleColumn);

    return middleColumn.innerText;
}

function getButtonsDivFromGroup(group)
{
    let textBase = group.children[0];
    let rightPart = textBase.children[1];
    let rightColumn = rightPart.children[1];
    let item = rightColumn.children[0];
    if (item.tagName.toLowerCase() === "div")
        item = item.children[0];

    return item.parentElement;
}
