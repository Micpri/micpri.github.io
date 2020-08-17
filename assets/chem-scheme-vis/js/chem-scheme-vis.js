
var getUrl = window.location;
var site_path = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[0];

function loadJSONfromfile(filename) {

    return new Promise( function(resolve, reject) {

      var xobj = new XMLHttpRequest();
      xobj.overrideMimeType("application/json");
      xobj.open('GET', filename, true);
      xobj.addEventListener('load', function(evt){
          resolve(JSON.parse(xobj.responseText));
      });
      xobj.addEventListener('error', function(error){
          reject(error);
      });
      xobj.send(null);
    });
};

function textStyle() { return { font: "16pt Segoe UI,sans-serif", stroke: "black" };
};

function findimage(key) {
   try{
   	// var path = "../images/"
   	var path = site_path+"/assets/chem-scheme-vis/images/"
     return path + key + ".png"
   } catch (e) {
     return false;
   }
};

function traverseDom(node, parentName, dataArray) {
  if (parentName === undefined) parentName = null;
  if (dataArray === undefined) dataArray = [];
  // skip everything but HTML Elements
  if (!(node instanceof Element)) return;
  // Ignore the navigation menus
  if (node.id === "navindex" || node.id === "navtop") return;
  // add this node to the nodeDataArray
  // var name = getName(node);
  var data = { key: name, name: name };
  dataArray.push(data);
  // add a link to its parent
  if (parentName !== null) {
    data.parent = parentName;
  }
  // find all children
  var l = node.childNodes.length;
  for (var i = 0; i < l; i++) {
    traverseDom(node.childNodes[i], name, dataArray);
  }
  return dataArray;
};

function highlightObj(obj, show) {obj.isHighlighted = show;
};

highlightColorIn = "blue";
highlightColorOut = "red";

function init() {

  if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
  var $ = go.GraphObject.make;  // for conciseness in defining templates

  myDiagram = $(go.Diagram, "myDiagramDiv",  // must be the ID or reference to div
   {"toolManager.hoverDelay": 100,  // 100 milliseconds instead of the default 850
    allowCopy: false,
    // initialViewportSpot: go.Spot.TopCenter,
    scale: 0.70, 
    click: function(e) {  // background click clears any remaining highlighteds
      e.diagram.startTransaction("clear");
      e.diagram.clearHighlighteds();
      e.diagram.commitTransaction("clear");
    },
    layout:  // create a TreeLayout for the family tree
    $(go.TreeLayout,
      { angle: 90,
        nodeSpacing: 10,
        layerSpacing: 50,
        layerStyle: go.TreeLayout.LayerSiblings
       }
      )
     }
   );

  // define each Node's appearance
  myDiagram.nodeTemplate =
    $(go.Node, "Auto", // the whole node panel
      { isTreeExpanded: false,
      click : function (e, node) {
        node.diagram.clearHighlighteds();
        node.findLinksInto().each(function(link) { highlightObj(link, true) });
        node.findLinksOutOf().each(function(link) { highlightObj(link, true) });
        node.findNodesInto().each(function(node) { highlightObj(node, true); });
        node.findNodesOutOf().each(function(node) { highlightObj(node, true); });
        }
      },
      // this event handler is defined below
      $(go.Shape, "RoundedRectangle",
        { fill: "white",
          stroke: "transparent",
          strokeWidth: 5,
          spot1: new go.Spot(0, 0, 5, 5),
          spot2: new go.Spot(1, 1, -5, -5)
        },
        new go.Binding("stroke", "isHighlighted", function(h) {
           return h ? highlightColorIn : "transparent";
        }).ofObject()
      ),
      $(go.Panel, "Vertical",
         $(go.Picture,
           {
             name: "image",
             desiredSize: new go.Size(100, 100),
            //  margin: new go.Margin(0, 0, 0, 0),
           },
           new go.Binding("source", "name", findimage)),
         // define the panel where the text will appear

      $(go.Panel, "Table",
                  {
                    maxSize: new go.Size(999, 999),
                    // margin: new go.Margin(0, 0, 0, 0),
                    defaultAlignment: go.Spot.Left
                  },
                  $(go.RowColumnDefinition, {column: 2, width: 4 }),
                  $(go.TextBlock, textStyle(),  // the name
                    {row: 1, column: 1},
                    new go.Binding("text", "name").makeTwoWay()),

                  $(go.TextBlock, textStyle(),
                    {row: 2, column: 1},
                    new go.Binding("text", "formula").makeTwoWay()),

                  $(go.TextBlock, textStyle(),
                    {row: 3, column: 1},
                    new go.Binding("text", "mass", function(v) {return v + " m/z";})),

                  $(go.TextBlock, textStyle(),
                    {row: 4, column: 1}, // we include a name so we can access this TextBlock when deleting Nodes/Links
                    new go.Binding("text", "reference", function(v) {return "REF: " + v;}))

                  )  // end Table Panel
                ), // end Horizontal Panel
                $("TreeExpanderButton",
                { alignment: go.Spot.BottomCenter, alignmentFocus: go.Spot.Top },
                { visible: true })
      );

  // replace the default Link template in the linkTemplateMap
  myDiagram.linkTemplate =
    $(go.Link,  // the whole link panel
      {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.Bezier,
        curviness: 0,
        click : function (e, link) {
          link.diagram.clearHighlighteds();
          if (link.fromNode != null) {
            highlightObj(link.fromNode, true);
            highlightObj(link, true);
          };
          if (link.toNode != null) {
            highlightObj(link.toNode, true);
            highlightObj(link, true);

          };
        }
      },
      $(go.Shape,  // the link shape
        { stroke: "black"
        },
        new go.Binding("stroke", "isHighlighted", function(h, shape) {
           return h ? highlightColorIn : shape.Rd; // DONT KNOW WHY THIS IS NOW CALLED .Rd!?!?
          }).ofObject(),
         new go.Binding("strokeWidth", "isHighlighted", function(h) {
           return h ? 3 : 1;
         }).ofObject()
      ),
      $(go.Shape,  // the arrowhead
        { toArrow: "standard",
          stroke: null
        }
      ),
      $(go.Panel, "Auto",  // this whole Panel is a link label
        $(go.Shape, "square",
         { fill: $(go.Brush, "Radial", { 0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)" }),
           stroke: "transparent"
         }
        ),
        $(go.TextBlock, // the label text
          { background:"white",
            font: "12pt  Segoe UI,sans-serif",
            stroke: "black",
            margin: 5
          },
            new go.Binding("text", "reactant"),
            new go.Binding("stroke", "isHighlighted", function(h, shape) {
              return h ? highlightColorIn : "black";
            }).ofObject(),
            new go.Binding("font", "isHighlighted", function(h) {
              return h ? "18pt  Segoe UI,sans-serif" : "12pt  Segoe UI,sans-serif";
            }).ofObject()

         )
       )
    );

  loadJSONfromfile(site_path+"/assets/chem-scheme-vis/data.json").then (function (jsondata) {

  nodeDataArray = jsondata['nodes'];
  linkDataArray = jsondata['links'];

  myDiagram.model =
    new go.GraphLinksModel(nodeDataArray, linkDataArray);
    $(go.TreeModel, {
      isReadOnly: true,  // don't allow the user to delete or copy nodes
      // build up the tree in an Array of node data
      nodeDataArray: traverseDom(document.activeElement)
    });
});

};

init();

myDiagram.addDiagramListener("InitialLayoutCompleted", function(e) {
  e.diagram.findTreeRoots().each(function(r) {
      r.expandTree(3);
    });
  });