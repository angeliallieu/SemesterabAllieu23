if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(() => {
            console.log('service worker registriert')
            return navigator.serviceWorker.ready
        })
        .catch(
            err => { console.log(err); }
        );
}

