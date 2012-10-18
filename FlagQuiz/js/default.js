// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509

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
        var title = document.createElement("h4");
        title.innerText = currentItem.data.title;
        body.appendChild(title);

        // Create a new rating control with the .win-interactive class
        // so ListView ignores touch events
        var inputControl = document.createElement("input");
        inputControl.type = "text";
        WinJS.Utilities.addClass(inputControl, "win-interactive");
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
        inputControl.onfocusout = function (event) {
            if (isCorrect(inputControl, currentItem)) {
                inputControl.disabled = true;
                var listView = document.querySelector('#basicListView').winControl;
                listView.selection.add(currentItem.index);
            }
        };

        return result;
    });
});

function isCorrect(inputControl, currentItem) {
    // TODO: Check if the answer was correct.
    // inputControl.value = user entered value
    // currentItem.index = index of flag.
    return true;
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
})();
