/* * * * * * * * * * * * * *
*      class SankeyVis        *
* * * * * * * * * * * * * */


class ScaleableTree {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.initVis()
    }

    initVis() {

        var div = document.getElementById(this.parentElement);

        // console.log("data", this.data)

        // In the div, we set up a "select" to transition between scaled and non-scaled branches
        var menu_pane = d3.select(div)
            .append("div")
            .append("span")
            .text("Layout:  ");

        var sel = menu_pane
            .append("select")
            .on("change", function (d) {
                switch (this.value) {
                    case "unscaled" :
                        tree.layout().scale(false);
                        break;
                    case "scaled" :
                        tree.layout().scale(true);
                        break;
                };
                tree.update();
            });

        sel
            .append("option")
            .attr("value", "unscaled")
            .attr("selected", 1)
            .text("Unscaled");

        sel
            .append("option")
            .attr("value", "scaled")
            .text("Scaled");

        // Show different node shapes for collapsed/non-collapsed nodes
        var node_size = 10;
        var node_fill="lightgrey";
        var node_stroke="black";

        var expanded_node = tnt.tree.node_display.circle()
            .size(node_size)
            .fill(node_fill)
            .stroke(node_stroke);

        var collapsed_node = tnt.tree.node_display.triangle()
            .size(node_size)
            .fill(node_fill)
            .stroke(node_stroke);

        var node_display = tnt.tree.node_display()
            .size(24)
            .display (function (node) {
                if (node.is_collapsed()) {
                    collapsed_node.display().call(this, node);
                } else {
                    expanded_node.display().call(this, node);
                }
            });

        var tree = tnt.tree()
            .node_display(node_display)
            .data(tnt.tree.parse_newick(this.data))
            .duration(2000)
            .layout(tnt.tree.layout.vertical()
                .width(600)
                .scale(false)
            );

        // change the height of the labels
        tree
            .label()
            .fontsize(11)
            .height(function () {
                return 20;
            });

        tree
            .on ("click", function(node){
            node.toggle();
            tree.update();
        });

        // The visualization is started at this point
        tree(div);
    }
}