function metatable() {
    var event = d3.dispatch('change');

    function table(selection) {
        selection.each(function(d) {
            var sel = d3.select(this),
                table;

            var keyset = d3.set();
            d.map(Object.keys).forEach(function(k) {
                k.forEach(function(_) {
                    keyset.add(_);
                });
            });

            var keys = keyset.values();

            bootstrap();
            paint();

            function bootstrap() {
                var controls = sel.selectAll('.controls').data([d]).enter().append('div').attr('class', 'controls');
                controls.append('button')
                    .text('new column')
                    .on('click', function() {
                        var name = prompt('column name');
                        keys.push(name);
                        paint();
                    });
                var enter = sel.selectAll('table').data([d]).enter().append('table');
                var thead = enter.append('thead');
                var tbody = enter.append('tbody');
                var tr = thead.append('tr');

                table = sel.select('table');
            }

            function paint() {

                var th = table
                    .select('thead')
                    .select('tr')
                    .selectAll('th')
                    .data(keys);

                th.enter()
                    .append('th')
                    .text(String);

                var tr = table.select('tbody').selectAll('tr')
                    .data(function(d) { return d; });

                tr.enter()
                    .append('tr');

                tr.exit().remove();

                var td = tr.selectAll('td')
                    .data(keys);

                td.enter()
                    .append('td')
                    .append('input')
                    .attr('field', String);

                tr.selectAll('input')
                    .data(function(d) {
                        return d3.range(keys.length).map(function() { return d; });
                    })
                    .classed('disabled', function(d) {
                        return d[d3.select(this).attr('field')] === undefined;
                    })
                    .property('value', function(d) {
                        return d[d3.select(this).attr('field')];
                    })
                    .on('click', function(d) {
                        d[d3.select(this).attr('field')] = '';
                        paint();
                    });
            }
        });
    }

    return d3.rebind(table, event, 'on');
}
