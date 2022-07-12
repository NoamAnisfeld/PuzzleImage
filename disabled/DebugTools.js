const debugConsole = document.createElement("div");
debugConsole.id = "debug-console";
Object.assign(debugConsole.style, {
  position: 'fixed',
  top: '0',
  left: '0',
  border: '1px solid',
  padding: '1em',
  minHeight: '1em',
  minWidth: '30ch',
  background: 'white',
  direction: 'ltr',
  whiteSpace: 'pre-line'
});
document.body.prepend(debugConsole);

function debugLog(...args) {
  const outputArray = args.map((arg) => {
    if (arg instanceof HTMLElement) {
      return `<${arg.tagName.toLowerCase()}>`;
    } else if (arg && typeof arg === "object") {
      return JSON.stringify(arg);
    } else {
      return String(arg);
    }
  }),
  outputStr = outputArray.join(", ");

  if (debugConsole) {
    debugConsole.textContent = outputStr;
  }
  console.log(outputStr);

  return args[0];
}

export { debugLog };