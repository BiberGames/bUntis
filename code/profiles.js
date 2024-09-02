const profiles = {};

var buttonList = document.getElementById("profileButtons");

profiles.createUIList = function(profiles) {
    profiles.forEach(profile => {
	buttonList.innerHtml += "hallo<br>"
    });
};

profiles.loadSelectedProfile = function() {
    
};

export { profiles };
