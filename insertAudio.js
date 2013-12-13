// Copyright 2013 Lee Adams <lee@4d4ms.com>
(function() {
    chrome.runtime.sendMessage({action: "getWordDetails"}, function(response) {
        var audio, id;

        if(response.word != "" &&
           response.type != "" &&
           response.url != "") {

            id = "pronounce_" + response.word;
            audio = document.getElementById(id);

            if(audio) {
                audio.currentTime = 0;
                audio.load();
                audio.play();
            } else {
                audio = document.createElement("audio");
                audio.display = "none";
                audio.id = id;
                audio.src = response.url;
                audio.controls = false;
                audio.autoplay = true;                
                document.body.appendChild(audio);
            }
        }
    });
})();
