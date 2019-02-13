const codeEditor = document.querySelector('.codemirror');

CodeMirror.fromTextArea(codeEditor, {
  lineNumbers: true,
  theme: "tomorrow-night-bright",
});
