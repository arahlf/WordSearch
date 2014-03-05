$(function() {

    d3.json('./grid.json', function(error, json) {
        if (error) {
            throw error;
        }

        var size = 30;
        var spacing = 2;

        var svg = d3.select('body')
            .append('svg');

        var group = svg.selectAll('g')
            .data(json)
            .enter()
            .append('g')
            .selectAll('g')
                .data(function(data) { return data; })
                .enter()
                .append('g')
                .attr('transform', function(data, x, y) {
                    var x = (x * size) + (x * spacing);
                    var y = (y * size) + (y * spacing);

                    return 'translate(' + x + ', ' + y + ')';
                });

        group.append('rect')
            .attr('width', size)
            .attr('height', size);

        group.append('text')
            .text(function(data) {
                return data;
            })
            .attr('y', size / 2 + 4)
            .attr('x', size / 2 - 4);
       
    });

});