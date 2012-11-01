var applicationData = Windows.Storage.ApplicationData.current;
var localSettings = applicationData.localSettings;

var MyInteractiveTemplate = WinJS.Utilities.markSupportedForProcessing(function MyInteractiveTemplate(itemPromise) {
    return itemPromise.then(function (currentItem) {
        var result = document.createElement("div");

        // ListView item
        result.className = "regularListIconTextItem";
        result.style.overflow = "hidden";

        // Display image
        var image = document.createElement("img");
        image.className = "regularListIconTextItem-Image";
        image.src = currentItem.data.picture;
        result.appendChild(image);

        var body = document.createElement("div");
        body.className = "regularListIconTextItem-Detail";
        body.style.overflow = "hidden";
        result.appendChild(body);

        // Display title
        //var title = document.createElement("h4");
        //title.innerText = currentItem.data.title;
        //body.appendChild(title);

        // Create a new rating control with the .win-interactive class
        // so ListView ignores touch events
        var inputControl = document.createElement("input");
        inputControl.type = "text";
        WinJS.Utilities.addClass(inputControl, "win-interactive");
        WinJS.Utilities.addClass(inputControl, "flag-answer-field");
        body.appendChild(inputControl);

        // Update the rating with a userRating if one exists, or else
        // use the averageRating property. This will produce a different
        // visual in the ratings control for user ratings.
        //var currentRating = currentItem.data.rating;
        //if (typeof (currentItem.data.userRating) === "number") {

        //    // currentItem.data.userRating is undefined if the value
        //    // has not been set in the "change" handler.
        //    ratingsControl.userRating = currentRating;
        //} else {
        //    ratingsControl.averageRating = currentRating;
        //}

        // Attach an event listener on the rating control
        inputControl.onkeyup = function (e) {
            e.which = e.which || e.keyCode;
            if (e.which == 13) { // enter key pressed
                inputControl.onfocusout(e);
            }
        };
        inputControl.onfocusout = function (event) {
            if (isCorrect(inputControl, currentItem)) {

                var correctFlags = Windows.Storage.ApplicationData.current.localSettings.values['correctFlags'];
                if (correctFlags === undefined)
                    correctFlags = [];
                else
                    correctFlags = JSON.parse(correctFlags);

                correctFlags.push(currentItem.index);
                Windows.Storage.ApplicationData.current.localSettings.values['correctFlags'] = JSON.stringify(correctFlags);

                inputControl.disabled = true;
                inputControl.value = currentItem.data.title;
                var listView = document.querySelector('#basicListView').winControl;
                listView.selection.add(currentItem.index);
                WinJS.Utilities.removeClass(inputControl, 'incorrect-answer');
            } else if (inputControl.value !== '') {
                WinJS.Utilities.addClass(inputControl, 'incorrect-answer');
            } else {
                WinJS.Utilities.removeClass(inputControl, 'incorrect-answer');
            }
        };

        return result;
    });
});

function isCorrect(inputControl, currentItem) {
    // TODO: Check if the answer was correct.
    // inputControl.value = user entered value
    // currentItem.index = index of flag.
    if (currentItem.data.title.toLowerCase() === inputControl.value.toLowerCase()) {
        return true;
    }
    var nonAlphabeticChars = currentItem.data.title.split(/[^A-Za-z]/).length;
    return (levenshteinDistance(currentItem.data.title.toLowerCase(), inputControl.value.toLowerCase()) <= nonAlphabeticChars);
}

function levenshteinDistance(a, b) {
    if (a.length == 0) return b.length;
    if (b.length == 0) return a.length;

    var matrix = [];

    // increment along the first column of each row
    var i;
    for (i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for (j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
        for (j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, // substitution
                                        Math.min(matrix[i][j - 1] + 1, // insertion
                                                 matrix[i - 1][j] + 1)); // deletion
            }
        }
    }

    return matrix[b.length][a.length];

}

(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }
            args.setPromise(WinJS.UI.processAll());

            var correctFlags = Windows.Storage.ApplicationData.current.localSettings.values['correctFlags'];
            if (correctFlags === undefined)
                correctFlags = [];
            else 
                correctFlags = JSON.parse(correctFlags);

            var listView = document.querySelector('#basicListView').winControl;
            listView.selection.set(correctFlags);
            listView.addEventListener('loadingstatechanged', function () {
                    disableInputForSelectedItems(listView);
            });
            
        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();

    function disableInputForSelectedItems(listView) {
        // Get the number of currently selected items
        var selectionCount = listView.selection.count();

        // Report the number
        if (selectionCount > 0) {
            // Get the actual selected items
            listView.selection.getItems().done(function (currentSelection) {
                var listView = document.querySelector('#basicListView').winControl;
                currentSelection.forEach(function (selectedItem) {
                    var element = listView.elementFromIndex(selectedItem.index);
                    if (element) {
                        var inputControl = element.querySelector('.flag-answer-field');
                        inputControl.value = selectedItem.data.title;
                        inputControl.disabled = true;
                    }
                });
            });

        }
    }
})();
