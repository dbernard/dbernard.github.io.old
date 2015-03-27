var exact_profanities = null;
var never_allowed = ["asshole", "fuck", "nigger", "penis", "bitch", "faggot",
                     "penis", "slut", "shithead", "shit", "cunt"];

$.get("resources/profanities.txt", function(words) {
    exact_profanities = words.split("\n");
});

$.has_profanity = function(text) {
    text = $.trim(text.toLowerCase());
    var pattern = "";

    // Never allow these as exact matches, but may be part of a word
    for (i = 0; i < exact_profanities.length - 1; i++) {
        pattern = new RegExp("\\b" + $.trim(exact_profanities[i]) + "\\b", "g");
        if (pattern.test(text)) {
            return true;
        }
    }

    // Never allow these words, even as part of another word
    for (i = 0; i < never_allowed.length; i++) {
        pattern = new RegExp(never_allowed[i], "g");
        if (pattern.test(text)) {
            return true;
        }
    }

    return false;
}
