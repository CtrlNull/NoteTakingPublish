/*

This extension gets around an issue where Google Drive will prompt for confirmation
when the user wants to download a file larger than a certain size.

See here for a description of the issue:
https://www.marstranslation.com/blog/how-to-skip-google-drive-virus-scan-warning-about-large-files

This extension automatically redirects to the confirmation link when needed.

TODO: only perform this auto-redirect when the request is coming from BananaPad
(i.e. check the referrer)

*/

chrome.webRequest.onHeadersReceived.addListener(
    autoConfirmGoogleDriveDownload,
    { urls: ["https://drive.google.com/*"] },
    ["blocking", "responseHeaders"]
);

function autoConfirmGoogleDriveDownload(details){
    console.log(details);

    const downloadWarningSetCookieHeader =
        details.responseHeaders
        .find(header =>
            header.name.toLowerCase() === 'set-cookie' &&
            header.value.startsWith('download_warning_'));

    if (!downloadWarningSetCookieHeader){
        return;
    }

    const token = /=(.+?);/.exec(downloadWarningSetCookieHeader.value)[1];

    console.log(`Google Drive confirm token is "${token}" for URL ${details.url}`);

    return { redirectUrl: details.url + '&confirm=' + token };
}

fetch('http://localhost:3024/fromsw');
