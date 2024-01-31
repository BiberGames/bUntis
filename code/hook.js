const webhook_message = function(webHookURL, message)
{
    console.log("Sending Webhook!");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", webHookURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        'content': message,
        'username':'Stats',
    }));
}

module.exports = {
    webhook_message
}