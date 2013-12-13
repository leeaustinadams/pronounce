// Copyright 2013 Lee Adams <lee@4d4ms.com>
(function() {
    var saveString = function(key, value) {
        localStorage[key] = value;
        console.log(key + " <- " + value);
    },
    loadString = function(key) {
        var value = localStorage[key];
        console.log(key + " -> " + value);
        return value;
    },
    saveStringOption = function(stringId, key) {
        var string = document.getElementById(stringId),
        value;

        value = string ? string.value : null;
        
        saveString(key, value);
    },
    saveSelectOption = function(selectId, key) {
        var select = document.getElementById(selectId),
        value;

        value = select ? select.children[select.selectedIndex].value : null;

        saveString(key, value);
    },
    loadStringOption = function(stringId, key) {
        var text = document.getElementById(stringId),
        value;

        value = loadString(key);

        if(!value) {
            return;
        }

        text.value = value;
    },
    loadSelectOption = function(selectId, key) {
        var select = document.getElementById(selectId),
        value, i, child;

        value = loadString(key);

        if(!value) {
            return;
        }

        for(i = 0; i < select.children.length; i++) {
            child = select.children[i];
            if(child.value === value) {
                child.selected = true;
            }
        }
    },
    saveOptions = function() {
        var status = document.getElementById("status");

        saveStringOption("apiKey", "apiKey");
        saveSelectOption("textLang", "textLang");
        saveSelectOption("speechLang", "speechLang");

        status.innerHTML = "Options Saved";
        setTimeout(function() {
            status.innerHTML = "";
        }, 750);
    },
    loadOptions = function() {
        var status = document.getElementById("status");

        loadStringOption("apiKey", "apiKey");
        loadSelectOption("textLang", "textLang");
        loadSelectOption("speechLang", "speechLang");

        status.innerHTML = "Options Loaded";
        setTimeout(function() {
            status.innerHTML = "";
        }, 750);
    };
    document.addEventListener("DOMContentLoaded", loadOptions);
    document.querySelector("#save").addEventListener("click", saveOptions);
})();
