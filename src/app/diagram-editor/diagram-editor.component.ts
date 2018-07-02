import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import * as go from 'gojs';

@Component({
  selector: 'app-diagram-editor',
  templateUrl: './diagram-editor.component.html',
  styleUrls: ['./diagram-editor.component.css']
})
export class DiagramEditorComponent implements OnInit {
  private diagram: go.Diagram = new go.Diagram();
  private palette: go.Palette = new go.Palette();

  @ViewChild('diagramDiv')
  private diagramRef: ElementRef;

  @ViewChild('paletteDiv')
  private paletteRef: ElementRef;

  @Input()
  get model(): go.Model { return this.diagram.model; }
  set model(val: go.Model) { this.diagram.model = val; }

  @Output()
  nodeSelected = new EventEmitter<go.Node | null>();

  @Output()
  modelChanged = new EventEmitter<go.ChangedEvent>();



  constructor() {
    const $ = go.GraphObject.make;

    this.diagram = new go.Diagram();
    this.diagram.initialContentAlignment = go.Spot.Center;
    this.diagram.allowDrop = true;  // necessary for dragging from Palette
    this.diagram.undoManager.isEnabled = true;
    this.diagram.addDiagramListener("ChangedSelection",
      e => {
        const node = e.diagram.selection.first();
        this.nodeSelected.emit(node instanceof go.Node ? node : null);
      });
    this.diagram.addModelChangedListener(e => e.isTransactionFinished && this.modelChanged.emit(e));

    this.diagram.nodeTemplate =
      $(go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape, "hexagon",
          {
            fill: "white", strokeWidth: 0,
            portId: "", cursor: "pointer",
            // allow many kinds of links
            fromLinkable: true, toLinkable: true,
            fromLinkableSelfNode: true, toLinkableSelfNode: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true
          },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8, editable: true },
          new go.Binding("text").makeTwoWay())
      );

    this.diagram.linkTemplate =
      $(go.Link,
        // allow relinking
        { relinkableFrom: true, relinkableTo: true },
        $(go.Shape),
        $(go.Shape, { toArrow: "OpenTriangle" })
      );

    this.palette = new go.Palette();
    this.palette.nodeTemplateMap = this.diagram.nodeTemplateMap;
    /*var myPalette2 =
    $(go.Palette, "myPaletteDiv2",
      { // customize the GridLayout to align the centers of the locationObjects
        layout: $(go.GridLayout, { alignment: go.GridLayout.Location })
      });*/

/*//circle
this.diagram.nodeTemplateMap.add("circle",
    $(go.Node, "Spot",
      $(go.Panel, "Auto",
        $(go.Shape, "circle",
          { minSize: new go.Size(30, 30), fill: "#DC3C00", stroke: null,strokeWidth: 0,
            portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
            fromLinkableSelfNode: true, toLinkableSelfNode: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true }),
        $(go.TextBlock, "circle",
          { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "white"},
          new go.Binding("text"))
      ),
    ));*/

//noFillCircle with min border
this.diagram.nodeTemplateMap.add("noFillCircle",
$(go.Node, "Spot",
  $(go.Panel, "Auto",
    $(go.Shape, "circle",
      { minSize: new go.Size(30, 30),fill:"white",stroke:"#42adf4",strokeWidth:2,
        portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
        fromLinkableSelfNode: true, toLinkableSelfNode: true,
        fromLinkableDuplicates: true, toLinkableDuplicates: true }),
    $(go.TextBlock, "circle",
      { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black",margin:4},
      new go.Binding("text"))
  ),
));
//noFillCircle with some border
this.diagram.nodeTemplateMap.add("borderCircle",
$(go.Node, "Spot",
  $(go.Panel, "Auto",
    $(go.Shape, "circle",
      { minSize: new go.Size(50, 50),fill:"white",strokeWidth:5,stroke:"#42adf4",
        portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
        fromLinkableSelfNode: true, toLinkableSelfNode: true,
        fromLinkableDuplicates: true, toLinkableDuplicates: true }),
    $(go.TextBlock, "circle",
      { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black",margin:6},
      new go.Binding("text"))
  ),
));
//noFillSquare with some border ,shape common for all ivokes
this.diagram.nodeTemplateMap.add("RoundedRectangle",
$(go.Node, "Spot",
  $(go.Panel, "Auto",
    $(go.Shape, "RoundedRectangle",
      { width:90,height:70,fill:"white",strokeWidth:2,stroke:"#75efd9",
        portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
        fromLinkableSelfNode: true, toLinkableSelfNode: true,
        fromLinkableDuplicates: true, toLinkableDuplicates: true }),
    $(go.TextBlock, "RoundedRectangle",
      { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black",margin:5,width:80,wrap: go.TextBlock.WrapDesiredSize},
      new go.Binding("text"))
  ),
));

//split
this.diagram.nodeTemplateMap.add("split",
$(go.Node, "Spot",
  $(go.Panel, "Auto",
    $(go.Shape, "circle",
      { minSize: new go.Size(40, 40),fill:"white",strokeWidth:1.5,stroke:"#42adf4",
        portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
        fromLinkableSelfNode: true, toLinkableSelfNode: true,
        fromLinkableDuplicates: true, toLinkableDuplicates: true }),
    $(go.TextBlock, "split",
      { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black"},
      new go.Binding("text"))
      ,
      $(go.Panel, "Auto",
    $(go.Shape, "circle",
      { minSize: new go.Size(30, 30),fill:"white",strokeWidth:1.5,stroke:"#42adf4",
        /* portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
        fromLinkableSelfNode: true, toLinkableSelfNode: true,
        fromLinkableDuplicates: true, toLinkableDuplicates: true */ }),
    $(go.TextBlock, "split",
      { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black",margin:4},
      new go.Binding("text"))
  ),
  ),
));

//join
this.diagram.nodeTemplateMap.add("join",
$(go.Node, "Spot",
  $(go.Panel, "Auto",
    $(go.Shape, "circle",
      { minSize: new go.Size(40, 40),fill:"white",strokeWidth:1.5,stroke:"#42adf4",
        portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
        fromLinkableSelfNode: true, toLinkableSelfNode: true,
        fromLinkableDuplicates: true, toLinkableDuplicates: true }),
    $(go.TextBlock, "",
      { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black"},
      new go.Binding("text"))
      ,
      $(go.Panel, "Auto",
    $(go.Shape, "circle",
      { minSize: new go.Size(30, 30),fill:"white",strokeWidth:1.5,stroke:"#42adf4",
        /* portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
        fromLinkableSelfNode: true, toLinkableSelfNode: true,
        fromLinkableDuplicates: true, toLinkableDuplicates: true */ }),
    $(go.TextBlock, "join",
      { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black",margin:6},
      new go.Binding("text"))
  ),
  ),
));

//merge
this.diagram.nodeTemplateMap.add("merge",
$(go.Node, "Spot",
  $(go.Panel, "Auto",
    $(go.Shape, "circle",
      { minSize: new go.Size(30,30),fill:"white",strokeWidth:1.5,stroke:"#42adf4",
        portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
        fromLinkableSelfNode: true, toLinkableSelfNode: true,
        fromLinkableDuplicates: true, toLinkableDuplicates: true }),
    $(go.TextBlock, "",
      { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black"},
      new go.Binding("text"))
      ,
      $(go.Panel, "Auto",
    $(go.Shape, "circle",
      { minSize: new go.Size(10,10),fill:"white",strokeWidth:1.5,stroke:"#42adf4",
        /* portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
        fromLinkableSelfNode: true, toLinkableSelfNode: true,
        fromLinkableDuplicates: true, toLinkableDuplicates: true */ }),
    $(go.TextBlock, "merge",
      { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black",margin:-2},
      new go.Binding("text"))
  ),
  ),
));

//diamond inclusive exclusive
this.diagram.nodeTemplateMap.add("exclusive",
    $(go.Node, "Spot",
      $(go.Panel, "Auto",
        $(go.Shape, "diamond",
          { minSize: new go.Size(50, 120), fill:"white", stroke:"#42adf4",strokeWidth:2,
            portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
            fromLinkableSelfNode: true, toLinkableSelfNode: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true }),
        $(go.TextBlock, "",
          { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black",margin:0},
          new go.Binding("text"))
      ),
    ));


    this.diagram.nodeTemplateMap.add("inclusive",
    $(go.Node, "Spot",
      $(go.Panel, "Auto",
        $(go.Shape, "diamond",
          { minSize: new go.Size(50, 120), fill:"white", stroke:"#42adf4",strokeWidth:2,
            portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
            fromLinkableSelfNode: true, toLinkableSelfNode: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true }),
        $(go.TextBlock, "",
          { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black",margin:0},
          new go.Binding("text"))
      ),
      $(go.Shape, "circle",
          { minSize: new go.Size(0.1, 0.1), fill:"#42adf4", stroke:null,strokeWidth:null,width:20,
          /*alignment:go.Spot.Top.y*/
            /*portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
            fromLinkableSelfNode: true, toLinkableSelfNode: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true*/ })
    ));


//square with 4 dots
this.diagram.nodeTemplateMap.add("squareBox",
    $(go.Node, "Auto",
      $(go.Panel, "Auto",
        $(go.Shape, "square",
          { minSize: new go.Size(30, 40), fill: "white", stroke: "#42adf4",strokeWidth:2,
            portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
            fromLinkableSelfNode: true, toLinkableSelfNode: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true }),
        $(go.TextBlock, "square",
          { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "black",margin:10},
          new go.Binding("text"))
      ),
    ));

/*
//triangle
this.diagram.nodeTemplateMap.add("triangle",
    $(go.Node, "Spot",
      $(go.Panel, "Auto",
        $(go.Shape, "triangle",
          { minSize: new go.Size(20, 40), fill: "green", stroke: null,strokeWidth: 0,
            portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
            fromLinkableSelfNode: true, toLinkableSelfNode: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true }),
        $(go.TextBlock, "triangle",
          { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "white"},
          new go.Binding("text"))
      ),
    ));
//square
this.diagram.nodeTemplateMap.add("square",
    $(go.Node, "Spot",
      $(go.Panel, "Auto",
        $(go.Shape, "square",
          { minSize: new go.Size(20, 20), fill: "blue", stroke: null,strokeWidth: 0,
            portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
            fromLinkableSelfNode: true, toLinkableSelfNode: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true }),
        $(go.TextBlock, "square",
          { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "white"},
          new go.Binding("text"))
      ),
    ));
//decagon
this.diagram.nodeTemplateMap.add("Decagon",
    $(go.Node, "Spot",
      $(go.Panel, "Auto",
        $(go.Shape, "Decagon",
          { minSize: new go.Size(40, 40), fill: "cyan", stroke: null,strokeWidth: 0,
            portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
            fromLinkableSelfNode: true, toLinkableSelfNode: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true }),
        $(go.TextBlock, "Decagon",
          { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "white"},
          new go.Binding("text"))
      ),
    ));
//pentagon
this.diagram.nodeTemplateMap.add("pentagon",
    $(go.Node, "Spot",
      $(go.Panel, "Auto",
        $(go.Shape, "pentagon",
          { minSize: new go.Size(40, 40), fill: "lightgreen", stroke: null,strokeWidth: 0,
            portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
            fromLinkableSelfNode: true, toLinkableSelfNode: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true }),
        $(go.TextBlock, "pentagon",
          { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "white"},
          new go.Binding("text"))
      ),
    ));
//hexagon
this.diagram.nodeTemplateMap.add("hexagon",
    $(go.Node, "Spot",
      $(go.Panel, "Auto",
        $(go.Shape, "hexagon",
          { minSize: new go.Size(40, 40), fill: "cyan", stroke: null,strokeWidth: 0,
            portId: "", cursor: "pointer",fromLinkable: true, toLinkable: true,
            fromLinkableSelfNode: true, toLinkableSelfNode: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true }),
        $(go.TextBlock, "hexagon",
          { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: "white"},
          new go.Binding("text"))
      ),
    ));*/
/*
    //adding picture
    this.diagram.nodeTemplate =
  $(go.Node, "Horizontal",
    // the entire node will have a light-blue background
    { background: "#44CCFF" },
    $(go.Picture,
      // Pictures should normally have an explicit width and height.
      // This picture has a red background, only visible when there is no source set
      // or when the image is partially transparent.
      { margin: 10, width: 50, height: 50, background: "red"},
      // Picture.source is data bound to the "source" attribute of the model data
      new go.Binding("source")),
    $(go.TextBlock,
      "Default Text",  // the initial value for TextBlock.text
      // some room around the text, a larger font, and a white stroke:
      { margin: 12, stroke: "white", font: "bold 16px sans-serif" },
      // TextBlock.text is data bound to the "name" attribute of the model data
      new go.Binding("text", "name"))
  );*/

    
    // initialize contents of Palette
    this.palette.model.nodeDataArray =
      [
        /*{key:"1", text: "start", category: "circle", color: "pink" },
        { text: "Alpha",category:"square", color: "cyan" },
        { text: "Beta",category:"Decagon", color: "orange" },
        { text: "Gamma",category:"triangle", color: "lightgreen" },
        { text: "Delta",category:"hexagon", color: "pink" },
        { text: "penta",category:"pentagon", color: "pink" },
        { text: "Epsilon", category: "triangle", color: "yellow" },
        { text: "end", category: "circle", color: "orange" },*/
        { text: "Start", category: "noFillCircle" },
        { text: "End", category: "borderCircle" },
        { text: "Invoke BS", category: "RoundedRectangle" },
        { text: "Invoke (Ext.Sync)", category: "RoundedRectangle" },
        { text: "Invoke (Ext.deferred)", category: "RoundedRectangle" },
        { text: "Invoke (Ext.Def.Bypass)", category: "RoundedRectangle" },
        { text: "split", category: "split" },
        { text: "join", category: "join" },
        { text: "merge", category: "merge" },
        { text: "Inclusive", category: "inclusive" },
        { text: "Exclusive", category: "exclusive" },
        { text: "Group",category:"squareBox"},
        /*{ name: "image",text:"image",source: "https://imgd.aeplcdn.com/310x174/bw/ec/33121/Yamaha-YZF-R15-V3-Front-threequarter-118919.jpg?wm=0&q=80" }*/
      ];
  }
  ngOnInit() {
    this.diagram.div = this.diagramRef.nativeElement;
    this.palette.div = this.paletteRef.nativeElement;
  }
}
/*var totalData;*/
  /*function saveData(){
    totalData=
    alert(this.diagram.model.toJson());
  }*/
