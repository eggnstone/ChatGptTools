// TODO

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
    log("Copying to clipboard: " + s);
    navigator.clipboard.writeText(s).then(() =>
        {
            //log("OK")
        },
        () =>
        {
            log("Copying failed. Please report.")
        });
}

function createCopyToClipboardElement()
{
    const buttonClass = "p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400";
    let html = `<button title="Copy text to clipboard" class="${buttonClass}">`;

    html += getCopyToClipboardSvg();
    html += "</button>";

    return html;
}

function getCopyToClipboardSvg()
{
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127 127" width="16" height="16"><path fill="grey" d="M112 0H40c-8.836 0-16 7.164-16 16h8a8.01 8.01 0 0 1 8-8h72a8.01 8.01 0 0 1 8 8v72a8.01 8.01 0 0 1-8 8v8c8.836 0 16-7.164 16-16V16c0-8.836-7.164-16-16-16zM88 24H16C7.164 24 0 31.164 0 40v72c0 8.836 7.164 16 16 16h72c8.836 0 16-7.164 16-16V40c0-8.836-7.164-16-16-16zm8 88a8.01 8.01 0 0 1-8 8H16a8.01 8.01 0 0 1-8-8V40a8.01 8.01 0 0 1 8-8h72a8.01 8.01 0 0 1 8 8v72zM24 56h56v-8H24v8zm0 16h56v-8H24v8zm0 16h56v-8H24v8zm0 16h32v-8H24v8z"/></svg>';
}
