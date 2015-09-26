app.animation('.fade-toggle', function() {
    return {
        leave(element, done) {
            TweenLite.to(element, 0.4, {
                opacity: 0,
                onComplete:done
            });
        },
        enter(element, done) {
            TweenLite.set(element, {
                opacity: 0
            });

            TweenLite.to(element, 0.4, {
                opacity: 1,
                onComplete: done
            });
        }
    };
});
