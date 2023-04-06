// tools.js

let copySvg;

function initTools()
{
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    const copySvgUrl = chrome.runtime.getURL('images/copy.svg');
    fetch(copySvgUrl).then((response) =>
    {
        response.text().then((text) =>
        {
            copySvg = text;
        });
    });
}

function log(s)
{
    console.log(s)
}

function logError(e)
{
    console.error(e)
}

function copyToClipboard(s)
{
    navigator.clipboard.writeText(s).then(() =>
        {
            log("Copied to clipboard:\n\n" + s);
            //log("Copied text to clipboard.");
        },
        () =>
        {
            log("Copying failed. Please report.")
        });
}

function createCopyToClipboardElement()
{
    const buttonClass = "chatgpt-tools p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400";
    return (
        `<button title="Copy text to clipboard\n(right click for more options)" class="${buttonClass}">` +
        copySvg +
        "</button>"
    );
}
