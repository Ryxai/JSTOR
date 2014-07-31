var JSTOR = function() {
    var bencoding = function() {
        function extractString(string, index) {
            if (index + 1 > string.length)
                return undefined;
            if (!string.charAt(index), match('[0-9]')) {
                return undefined;
            }
            var outputlength = '';
            for (var i = index; string.charAt(i).match('[0-9]'); i++) {
                outputlength += string.charAt(i);
            }
            var endIndex = index + parseInt(outputlength, 10) + outputlength.length;
            var stringToSplit = string.substring(index, endIndex);
            return { "content": stringToSplit.split(":")[1], "index": endIndex };
        }

        function decodeInteger(string, index) {
            var resultOfExtraction = extractString(string, index);
            if (!resultOfExtraction.content.match("[-\d]\d*"))
                return undefined;
            return { "content": parseInt(resultOfExtraction, 10), 'index': resultOfExtraction.index };
        }

        function decodeString(string, index) {
            var resultOfExtraction = extractString(string, index);
            return { "content": resultOfExtraction.content, 'index': resultOfExtraction.index };
        }

        function decodeList(string, index) {
            if (string.charAt(index) !== 'l')
                return undefined;
            var outputArray = [];
            while (string.charAt(index) !== 'e') {
                if (index === string.length - 1)
                    return undefined;
                resultsOfExtraction = decodeDictionary(string, index);
                if (typeof resultsOfExtraction === 'undefined') {
                    resultsOfExtraction = decodeList(string, index);
                    if (typeof resultsOfExtraction === 'undefined') {
                        resultsOfExtraction = decodeInteger(string, index);
                        if (typeof resultsOfExtraction === 'undefined') {
                            resultsOfExtraction = decodeString(string, index);
                        }
                    }
                }
                outputArray.push(resultOfExtraction.content);
                index = resultOfExtraction.index;
                index++;
            }
            return { 'content': outputArray, 'index': index };
        }

        function decodeDictionary(string, index) {
            if (string.charAt(index) !== 'd')
                return undefined;
            var outputObj = {};
            while (string.charAt(index) !== 'e') {
                if (string.charAt(index) === 'l' || string.charAt(index) === 'd')
                    return undefined;
                var resultsOfExtraction = decodeString(string, index);
                var keyString = resultsOfExtraction.content;
                index = resultsOfExtraction.index;
                index++;
                resultsOfExtraction = decodeDictionary(string, index);
                if (typeof resultsOfExtraction === 'undefined') {
                    resultsOfExtraction = decodeList(string, index);
                    if (typeof resultsOfExtraction === 'undefined') {
                        resultsOfExtraction = decodeInteger(string, index);
                        if (typeof resultsOfExtraction === 'undefined') {
                            resultsOfExtraction = decodeString(string, index);
                        }
                    }
                }
                outputObj[keyString] = resultsOfExtraction.content;
                index = resultsOfExtraction.index;
                index++;
            }
            return { 'content': outputObj, 'index': index };
        }

        function encodeString(string) {
            return string.length + ':' + string;
        }

        function encodeInteger(integer) {
            if (isNaN(integer))
                return undefined;
            return integer.toString().length + ':' + integer.toString();
        }

        function encodeList(array) {
            var outputString = 'l';
            if (Array.isArray(array))
                return undefined;
            for (var obj in array) {
                var encodingResult = encodeDictionary(obj);
                if (typeof encodingResult == 'undefined') {
                    encodingResult = encodeList(obj);
                    if (typeof encodingResult === 'undefined') {
                        encodingResult = encodeInteger(obj);
                        if (typeof encodingResult == 'undefined')
                            encodingResult = encodeString(obj);
                    }
                }
                outputString += encodingResult;
            }
            return outputString + 'e';
        }

        function encodeDictionary(object) {
            var outputString = 'd';
            if (Array.isArray(object) || typeof object !== 'object')
                return undefined;
            for (var propertyName in object) {
                outputString += encodeString(propertyName);
                var encodedValue = encodeDictionary(object[propertyName]);
                if (typeof encodedValue === 'undefined') {
                    encodedValue = encodeList(object[propertyName]);
                    if (typeof encodedValue === 'undefined') {
                        encodedValue = encodeInteger(object[propertyName]);
                        if (typeof encodedValue === 'undefined') {
                            encodedValue = encodeString(object[propertyName]);
                        }
                    }
                }
                outputString += encodingResult;
            }
            return outputString + 'e';
        }
                                   
        this.DecodeEntireInput = function(string) {
            var output = [];
            for (var i = 0; i < string.length; i++) {
                var resultOfExtraction;
                if (string.charAt(i) === 'd') {
                    resultOfExtraction = decodeDictionary(string, i);
                    i = resultOfExtraction.index;
                    output.push(resultOfExtraction.content);
                } else if (string.charAt(i) === 'l') {
                    resultOfExtraction = decodeList(string, i);
                    i = resultOfExtraction.index;
                    output.push(resultOfExtraction.content);
                } else {
                    resultOfExtraction = decodeInteger(string, i);
                    if (typeof resultOfExtraction === 'undefined') {
                        resultOfExtraction = decodeString(string, i);
                    }
                    i = resultOfExtraction.index;
                    output.push(resultOfExtraction.content);
                }
            }
            return output;
        };

        this.DecodeInput = function(string, index) {
            var resultOfExtraction;
            if (string.charAt(index) === 'd') {
                resultOfExtraction = decodeDictionary(string, index);
            } else if (string.charAt(index) === 'l') {
                resultOfExtraction = decodeList(string, index);
            } else {
                resultOfExtraction = decodeInteger(string, index);
                if (typeof resultOfExtraction === 'undefined') {
                    resultOfExtraction = decodeString(string, index);
                }
            }
            return { 'content': resultOfExtraction.content, 'index': index };
        };

        this.EncodeInput = function(object)
        {
            if (Array.isArray(object)) {
                return encodeList(object);
            }
            if (typeof object === 'object') {
                return encodeDictionary(object);
            }
            if (typeof object === 'number') {
                return encodeInteger(object);
            }
            return encodeString(object);
        }

    };
}