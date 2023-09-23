


const footer = document.getElementById("footer");
footer.textContent = "Imported  libraries...";
const input = document.getElementById("dataSourceFile");




input.addEventListener( "change",
  (event) => {
    const files = event.target.files;
    if (files.length == 0) {
      // File was not chosen
      alert("No file selected");
      return;
    }
    footer.textContent = "Loading file " + files[0].name;
      const fr = new FileReader();
      fr.onload = (evt) => {
        const dataStr = evt.target.result;
        try {
          const data = JSON.parse(dataStr);
          parseJsonData(data);
          footer.textContent = `File loaded`;
        } catch (err) {
          footer.textContent = `Load failed due: ${err}`;
        }

      };
      fr.onerror( (e) => alert(`Could not open file: ${e.target.error.name}`));
      fr.readAsText(files[0]);
    });
    input.addEventListener( "click",
    (event) => {
      alert("Choosing file");
      const nodes = document.evaluate(
        `//main[@id='main']/section/article`,
        document,
        null,
        XPathResult.ORDERED_NODE_ITERATOR_TYPE
        );
      let node = nodes.iterateNext();
      const removed = Array();
      while (node) {
        removed.unshift(node);
        node = nodes.iterateNext();
      }
      removed.forEach(
        removedNode => {
          removed.removedNode()
        })
    });
    
footer.textContent = 'Choose file button added...';
    

    
["people", "skills", "motivations"].forEach( section => {addSection(section)});
    
footer.textContent = "Library loaded";