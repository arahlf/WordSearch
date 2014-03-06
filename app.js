$(function() {

    d3.json('./grid.json', function(error, json) {
        if (error) {
            throw error;
        }

        var gridSize = json.length;
        var flattenedData = json.reduce(function(a, b) {
            return a.concat(b);
        });


        var size = 30;
        var spacing = 2;

        var svg = d3.select('body')
            .append('svg');

        var group = svg.selectAll('g')
            .data(flattenedData)
            .enter()
            .append('g')
            .attr('transform', function(data, index) {
                var x = (index % gridSize) * (size + spacing);
                var y = Math.floor(index / gridSize) * (size + spacing);

                return 'translate(' + x + ', ' + y + ')';
            });

        group.append('rect')
            .attr('x', 1)
            .attr('y', 1)
            .attr('width', size - 2)
            .attr('height', size - 2);

        group.append('text')
            .text(function(data) {
                return data;
            })
            .attr('y', size / 2 + 5)
            .attr('x', size / 2 - 5);
       
    });

});