// Prevent the browser's default action on dropping event,
// which is basically navigating away
document.addEventListener('dragover', e => e.preventDefault() );
document.addEventListener('drop', e => e.preventDefault() );

const handledElements = [];

function setDropZone(element) {
    if (!(element instanceof HTMLElement)) {
        throw Error('Not an HTML element');
    }

    // Make sure the handler isn't attached to an element twice
    if (handledElements.includes(element)) {
        return;
    }
    handledElements.push(element);

    element.addEventListener('drop', e => {
        // Forked from the example on https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/getAsString
        const data = e.dataTransfer.items;
        for (let i = 0; i < data.length; i += 1) {
          if ((data[i].kind == 'string') &&
              (data[i].type.match('^text/plain'))) {
            data[i].getAsString(function (s){
              console.log('Plain string: ', s);
            });
          } else if ((data[i].kind == 'string') &&
                     (data[i].type.match('^text/html'))) {
            data[i].getAsString(function (s){
              console.log('HTML: ', s);
            });
          } else if ((data[i].kind == 'string') &&
                     (data[i].type.match('^text/uri-list'))) {
            data[i].getAsString(function (s) {
              console.log('URI: ', s);
            });
          } else if ((data[i].kind == 'file') &&
                     (data[i].type.match('^image/'))) {
            const file = data[i].getAsFile();
            console.log("File: ", file.size, ' bytes');
          } else {
            data[i].getAsString(function (s) {
                console.log(data[i].type, ': ' , s);
            });
          }
        }
    });
}

export { setDropZone };