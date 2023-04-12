// noinspection JSUnresolvedVariable

let menuTarget;

jQuery.noConflict();

(function($)
{
    init();

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
                    const button = document.createElement('button');
                    button.innerHTML = createCopyToClipboardElement();
                    const buttonsDiv = getButtonsDivFromGroup(group);
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

            let target = e.target;
            if (target.id === "CopyText")
                onCopyTextViaTarget(menuTarget);
            else if (target.id === "CopyTextAndAuthor")
                onCopyTextAndAuthorViaTarget(menuTarget);
            else if (target.id === "CopyAllTexts")
                onCopyAllTexts();
            else if (target.id === "CopyAllTextsAndAuthors")
                onCopyAllTextsAndAuthors();
            else
            {
                if (target.tagName.toLowerCase() === "path")
                    target = target.parentElement;

                if (target.tagName.toLowerCase() === "svg")
                    target = target.parentElement;

                if (target.tagName.toLowerCase() === "button" && target.className.startsWith("chatgpt-tools "))
                    onCopyTextViaTarget(target);
            }
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

    function onCopyTextViaTarget(target)
    {
        const group = getGroupFromTarget(target);
        if (!group)
        {
            console.log("Could not get group from target.")
            return;
        }

        onCopyTextFromGroup(group);
    }

    function onCopyTextFromGroup(group)
    {
        const text = getTextFromGroup(group);
        copyToClipboard(text);
    }

    function onCopyTextAndAuthorViaTarget(target)
    {
        const group = getGroupFromTarget(target);
        if (!group)
        {
            console.log("Could not get group from target.")
            return;
        }

        const author = getAuthorFromGroup(group);
        const text = getTextFromGroup(group);
        copyToClipboard(`${author}: ${text}`);
    }

    function onCopyAllTexts()
    {
        let allTexts = "";
        const groups = $("div.group.chatgpt-tools");
        for (let groupIndex = 0; groupIndex < groups.length; groupIndex++)
        {
            const group = groups[groupIndex];
            const text = getTextFromGroup(group);
            allTexts += text + "\n\n";
        }

        copyToClipboard(allTexts);
    }

    function onCopyAllTextsAndAuthors()
    {
        let allTexts = "";
        const groups = $("div.group.chatgpt-tools");
        for (let groupIndex = 0; groupIndex < groups.length; groupIndex++)
        {
            const group = groups[groupIndex];
            const author = getAuthorFromGroup(group);
            const text = getTextFromGroup(group);
            allTexts += `${author}: ${text}\n\n`;
        }

        copyToClipboard(allTexts);
    }

    function getGroupFromTarget(target)
    {
        while (target)
        {
            if (target.tagName.toLowerCase() === "div" && target.className && target.className.startsWith("group "))
                return target;

            target = target.parentElement;
        }

        return undefined;
    }

    function getAuthorFromGroup(group)
    {
        let textBase = group.children[0];
        let leftPart = textBase.children[0];
        let child = leftPart.children[0];
        let grandChild = child.children[0];

        return grandChild.tagName.toLowerCase() === "svg" ? "ChatGPT" : "Me";
    }

    function getTextFromGroup(group)
    {
        let textBase = group.children[0];
        let rightPart = textBase.children[1];
        let middleColumn = rightPart.children[0];

        return middleColumn.innerText.trim();
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
})(jQuery);
