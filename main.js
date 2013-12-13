/*
  Copyright 2013 Lee Adams <lee@4d4ms.com>

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
var ProNounce = (function() {
    var endPoint = "http://apifree.forvo.com/key",
    format = "format/json",
    STANDARD = "standard",
    _word = "",
    _audioType = "",
    _url = "",
    actions = {
        "standard" : "action/standard-pronunciation/word"
    },
    _makeUrl = function(word, action, language) {
        var apiKey = localStorage["apiKey"];
        // e.g. http://apifree.forvo.com/key/{apiKey}/format/xml/action/standard-pronunciation/word/cat/language/en
        return [endPoint, apiKey, format, actions[action], word, "language", language].join("/");
    },
    _get = function(url, success, failure) {
        var xhr = new XMLHttpRequest();

        console.info(url);
        
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                if(xhr.status === 200) {
                    success(xhr.responseText);
                } else {
                    failure(xhr.status);
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
    },
    _sayIt = function(word, language) {
        var url = _makeUrl(word, STANDARD, language);
        _get(url, 
            function(responseText) {
                var response = JSON.parse(responseText),
                url;

                if(response && response.items && response.items.length) {
                    url = response.items[0].pathmp3;

                    _word = word;
                    _url = url;
                    _audioType = "audio/mpeg";

                    chrome.tabs.executeScript(null, {file: "insertAudio.js"});
                } else {
                    console.info("Response did not have any items", response);
                }
            },
            function(status) {
                console.error("Failed to get the word " + word + ": " + status);
            });
    },
    _initialize = function () {
        var SAYIT_TITLE = "Pro Nounce '%s'",
        contexts = ["selection"],
        onSayItClick = function(info, tab) {
            console.log(JSON.stringify(info));
            console.log(JSON.stringify(tab));

            _sayIt(info.selectionText, "en");
        },
        child = chrome.contextMenus.create({ title: SAYIT_TITLE, 
                                             contexts : contexts,
                                             onclick: onSayItClick });

        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
            if(request.action === "getWordDetails") {
                sendResponse({
                    word: _word,
                    url: _url,
                    type: _audioType
                });
            }
        });
    },
    _Api = function() {
    };

    _Api.prototype.getWord = function() {
        return _word;
    };

    _Api.prototype.getAudio = function() {
        return {
            url: _url,
            type: _audioType
        }
    };

    _initialize();

    return {
        Api : _Api
    };
})();
