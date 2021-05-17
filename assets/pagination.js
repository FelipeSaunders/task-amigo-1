class Pagination {
    constructor() {
        this.renderTableHeader();
    }

    config = {
        attr_order: 'start_date',
        tableHeader: [{
            label: 'Data',
            attribute: 'start_date',
            reverse: false
        }, {
            label: 'Número',
            attribute: 'number',
            reverse: true
        }, {
            label: 'Paciente',
            attribute: 'patient.name',
            reverse: true
        }, {
            label: 'Convênio',
            attribute: 'health_insurance.name',
            reverse: true
        }, {
            label: 'Preço',
            attribute: 'price',
            reverse: true
        }]
    };

    renderTableHeader() {
        let html = '<tr>';

        this.config.tableHeader.forEach((head, index) => {
            const sortIcon = `<i class="fas fa-sort-${head.reverse ? 'down' : 'up'}"></i>`;

            html += `
                <th>
                    <a class="clean-link" onclick="sortBy('${head.attribute}', ${index}, event)" href="javascript:void;">
                        ${head.label}
                        ${this.config.attr_order === head.attribute ? sortIcon : ''}
                    </a>
                </th>
            `;
        });

        html += '</tr>';

        document.getElementById('table-head').innerHTML = html;
    }
}
