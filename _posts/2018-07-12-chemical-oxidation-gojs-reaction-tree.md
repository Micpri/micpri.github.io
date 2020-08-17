---
layout: post
title: Visualising Chemistry with GoJS
description: chemical reaction pathways visualised with gojs
date: 2018-07-06 13:20:00 +0100
author: Mike
<!-- jsarr:
- chem-scheme-vis/js/main.js -->
---

# Some background

The air you breathe is overwhelmingly composed of nitrogen and oxygen but also contains tens of thousands of trace gases albeit at extremely low concentrations. 

Sulfur dioxide (SO<sub>2</sub>), ozone (O<sub>3</sub>), nitrogen dioxide (NO<sub>2</sub>), CFCs, carbon monoxide (CO). These are examples of trace gases that have an impact on either human health, climate change or both. 

Volatile organic compounds (VOCs) are another important set of trace gases. They can oxidise in the atmosphere - the same sort of process that leads to iron nails rusting, apples going brown or cleaning with bleach.

These oxidised VOCs have different physical and chemical properties from their original precursors. The ability to detect and understand the formation and properties of oxidised VOCs is the focus of much research in air quality and atmospheric chemistry.

# The question and problem

As part of my PhD I am investigating the oxidation of benzene and so needed to understand the current knowledge of benzene oxidation.

Typically I would draw out a big chemical mechanism in order to map out the different reaction pathways. But if you make a mistake with pen and paper, the diagram gets messy and you end up re-drawing it many times over. 

I tried this method, but it became overly complicated owing to the complex nature of chemical reaction schemes. 

In addition, I was trying to preseve a bunch of metadata: mass, formula, the paper reference associated with each molecule. The diagram grew ever more unweidly.

Also, the information that I preserved was hard to query. What if two different molecules have the same mass or formula? How could I easily compare that on a sheet of paper?

Finally, it seemed unreasonable that I was searching online resources for information, to summarise on paper, to then re-write on a computer.

# Solution

Fortunately, the information I required is centralised in one place. The [master chemical mechanism (MCM)][mcm] is an online facility that summarises detailed atmospheric chemical reactions, including those of benzene. With this one source, I had all the information I needed. 

I decided to programmatically draw the MCM reaction scheme. This would make comparisons between different facets of the reaction mechanism easier and allow for iteratively tweak it if I made a mistake.

# Enter GoJS

I wanted this reaction scheme to be easily accessible so decided on a webpage (browser is best?). I also wanted it to be interactive so the visualisation could be made more simple.

I settled on [GoJS][gojs] as the javascript library to make the diagram. The chemical mechanism can be viewed as a series of nodes (molecules) and links (reactions) which fits exactly the model of GoJS.

# Process

To create the nodes I did the following:

- Downloaded the .kpp file for benzene from the [MCM][mcm].
- Clean the data set (e.g. remove reaction rate information).
- Use [Pybel][pybel] to generate the formula, molecular mass and an image of the molecule from the [smiles string][smiles] for each node.

To create the links:

- Extract the non VOC reactant (e.g. OH) from the node data.
- Remove any non VOC derived products (e.g. HNO<sub>3</sub>).
- Consolidate any duplicated reactions.

This produced two datasets (nodes.csv and links.csv) that I am free to tweak in order to generate the chemical mechanism. The .csv files can then be converted to JSON for reading by the web browser.

# Result

Using the TreeModel, adding some highlighting functionality and a TreeExpanderButton, the mechanism can be visualised, simplified and highlighted to show nearest neighbours. I've also got a nice dataset that I can query and use elsewhere in my analysis. The code can be found [here][code].

[gojs]: https://gojs.net/latest/index.html
[mcm]: http://mcm.leeds.ac.uk/MCM/
[pybel]: http://openbabel.org/docs/dev/UseTheLibrary/Python_PybelAPI.html
[smiles]: https://en.wikipedia.org/wiki/Simplified_molecular-input_line-entry_system
[code]: https://github.com/Mbex/ChemSchemVis

<br>
# Diagram
<div id="myDiagramDiv" style="width:inherit; height:450pt; background-color: none"></div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gojs/1.7.29/go-debug.js"></script>
<script src="{{ base.url | prepend: site.url }}/assets/chem-scheme-vis/js/chem-scheme-vis.js"></script>