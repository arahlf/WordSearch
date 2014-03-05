$(function() {

    d3.json('./grid.json', function(error, json) {
        if (error) {
            throw error;
        }

        d3.select('body')
            .selectAll('div')
                .data(json)
                .enter()
                .append('div')
                    .selectAll('span')
                    .data(function(data) { return data; })
                    .enter()
                    .append('span')
                    .text(function(data) { return data ; });
    });

});