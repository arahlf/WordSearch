$(function() {

    d3.json('./grid.json', function(error, json) {
        if (error) {
            throw error;
        }

        var gridSize = json.length;
        var wordHighlightPadding = 2;
        var gridSize = json.length;
        var flattenedData = json.reduce(function(a, b) {
            return a.concat(b);
        });


        var size = 30;

        var svg = d3.select('body')
            .append('svg');

        var group = svg.selectAll('g')
            .data(flattenedData)
            .enter()
            .append('g')
            .attr('transform', function(data, index) {
                var x = (index % gridSize) * size;
                var y = Math.floor(index / gridSize) * size;

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



        function strokeHorizontalWord(row, col, length) {
            svg.append('rect')
                .attr('x', (col * size) + wordHighlightPadding)
                .attr('y', (row * size) + wordHighlightPadding)
                .attr('width', (length * size) - (wordHighlightPadding * 2))
                .attr('height', size - (wordHighlightPadding * 2))
                .attr('rx', 10)
                .attr('ry', 10)
                .attr('style', 'stroke: red; stroke-width: 2;');
        }

        function strokeVerticalWord(row, col, length) {
            svg.append('rect')
                .attr('x', (col * size) + wordHighlightPadding)
                .attr('y', (row * size) + wordHighlightPadding)
                .attr('width', size - (wordHighlightPadding * 2))
                .attr('height', (length * size) - (wordHighlightPadding * 2))
                .attr('rx', 10)
                .attr('ry', 10)
                .attr('style', 'stroke: red; stroke-width: 2;');
        }

        function strokeDiagonalWord(row, col, length, forward) {
            var x, y, transform;
            var side = 30 * (length - .5);

            if (forward) {
                x = (col * size) + (size / 2) + wordHighlightPadding;
                y = (row * size) + size + wordHighlightPadding;
                transform = 'rotate(-135, ' + x + ', ' + y + ')';
            }
            else {
                x = (col * size) + size +  wordHighlightPadding;
                y = (row * size) + (size / 2) - wordHighlightPadding;
                transform = 'rotate(-225, ' + x + ', ' + y + ')';
            }

            svg.append('rect')
                .attr('x', x)
                .attr('y', y)
                .attr('width', size - (wordHighlightPadding * 2))
                .attr('height', Math.sqrt(Math.pow(side, 2) + Math.pow(side, 2)))
                .attr('rx', 10)
                .attr('ry', 10)
                .attr('transform', transform)
                .attr('style', 'stroke: red; stroke-width: 2;');
        }

        function highlightWord(word) {
            var letters = word.split('');
            var i, testRow, testCol;
            var found;

            for (var row = 0; row < gridSize; row++) {
                for (var col = 0; col < gridSize; col++) {
                    if (letters[0] === json[row][col]) {
                        found = false;

                        // north
                        for (i = 1; i < letters.length; i++) {
                            testRow = row - i;

                            if (testRow >= 0 && json[testRow][col] == letters[i]) {
                                if (i == letters.length - 1) {
                                    found = true;
                                    strokeVerticalWord(row - word.length + 1, col, word.length);
                                }
                            }
                            else {
                                break;
                            }
                        }

                        if (found) {
                            return;
                        }

                        // east
                        for (i = 1; i < letters.length; i++) {
                            testCol = col + i;

                            if (testCol < gridSize && json[row][testCol] == letters[i]) {
                                if (i == letters.length - 1) {
                                    found = true;
                                    strokeHorizontalWord(row, col, word.length);
                                }
                            }
                            else {
                                break;
                            }
                        }

                        if (found) {
                            return;
                        }

                        // south
                        for (i = 1; i < letters.length; i++) {
                            testRow = row + i;

                            if (testRow < gridSize && json[testRow][col] == letters[i]) {
                                if (i == letters.length - 1) {
                                    found = true;
                                    strokeVerticalWord(row, col, word.length);
                                }
                            }
                            else {
                                break;
                            }
                        }

                        if (found) {
                            return;
                        }

                        // west
                        for (i = 1; i < letters.length; i++) {
                            testCol = col - i;

                            if (testCol >= 0 && json[row][testCol] == letters[i]) {
                                if (i == letters.length - 1) {
                                    found = true;
                                    strokeHorizontalWord(row, col - word.length + 1, word.length);
                                }
                            }
                            else {
                                break;
                            }
                        }

                        if (found) {
                            return;
                        }

                        // north east
                        for (i = 1; i < letters.length; i++) {
                            testRow = row - i;
                            testCol = col + i;

                            if (testRow >= 0 && testCol < gridSize && json[testRow][testCol] == letters[i]) {
                                if (i == letters.length - 1) {
                                    found = true;
                                    strokeDiagonalWord(row, col, word.length, true);
                                }
                            }
                            else {
                                break;
                            }
                        }

                        // south west
                        for (i = 1; i < letters.length; i++) {
                            testRow = row + i;
                            testCol = col - i;

                            if (testRow < gridSize && testCol >= 0 && json[testRow][testCol] == letters[i]) {
                                if (i == letters.length - 1) {
                                    found = true;
                                    strokeDiagonalWord(testRow, testCol, word.length, true);
                                }
                            }
                            else {
                                break;
                            }
                        }

                        if (found) {
                            return;
                        }

                        // north west
                        for (i = 1; i < letters.length; i++) {
                            testRow = row - i;
                            testCol = col - i;

                            if (testRow >= 0 && testCol >= 0 && json[testRow][testCol] == letters[i]) {
                                if (i == letters.length - 1) {
                                    found = true;
                                    strokeDiagonalWord(row, col, word.length, false);
                                }
                            }
                            else {
                                break;
                            }
                        }

                        if (found) {
                            return;
                        }

                        // south east
                        for (i = 1; i < letters.length; i++) {
                            testRow = row + i;
                            testCol = col + i;

                            if (testRow < gridSize && testCol < gridSize && json[testRow][testCol] == letters[i]) {
                                if (i == letters.length - 1) {
                                    found = true;
                                    strokeDiagonalWord(testRow, testCol, word.length, false);
                                }
                            }
                            else {
                                break;
                            }
                        }

                        if (found) {
                            return;
                        }
                    }
                }
            }

            throw new Error('Did not find: ' + word);
        }


        var words = ['HOLIDAY', 'SAINT', 'PATRICK', 'IRISH', 'GREEN', 'SHAMROCK', 'FOUR', 'LEAF', 'CLOVER', 'LUCK', 'POT', 'GOLD', 'LEPRECHAUN', 'RAINBOW', 'MARCH', 'SEVENTEEN'];

        words.forEach(highlightWord)
    });

});