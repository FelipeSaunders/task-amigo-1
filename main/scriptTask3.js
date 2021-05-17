const table = document.getElementById('table-body');
const guidesUrl = "https://augustoferreira.com/amigo/guides.json";
const insurancesUrl = "https://augustoferreira.com/amigo/insurances.json"

let guidesJson = {};
let guidesFiltered;
const sortKeys = {};

const pagination = new Pagination();

const getJsonGuides = async () => {
        const json = await axios(guidesUrl);

        if (!json) {
                return;
        }

        return json.data;
}

const getJsonInsurances = async () => {
    const json = await axios(insurancesUrl);

    if (!json) {
            return;
    }

    return json.data;
}

const init = async () => {
    jsonGuides = await getJsonGuides();
    jsonInsurances = await getJsonInsurances();
    guidesFiltered = jsonGuides.data.guides;

    insertElements(jsonGuides.data.guides, 1);
    insertInsurancesSelect(jsonInsurances.data);
    insertPagination(jsonGuides.data.total_items/jsonGuides.data.items_per_page);
}

const filter = page => {
    const filterInput = document.getElementById('input-search').value;
    const insuranceIdSelected = document.getElementById('insurance').value;
    const guides = [...jsonGuides.data.guides];
    const regex = new RegExp(filterInput, 'gi');
    const beginDate = document.getElementById('begin-date').value;
    const endDate = document.getElementById('end-date').value;
    const currentPage = page || 1;


    guidesFiltered = guides.filter(guide => {
        if (filterInput && !regex.test(guide.patient.name) && !regex.test(guide.number)) {
            return false;
        }

        if (insuranceIdSelected && (guide.insurance_id !== ~~insuranceIdSelected)) {
            return false;
        }

        if (beginDate && !endDate && utils.isBefore(beginDate, guide.start_date)) {
            return false;
        }

        if (!beginDate && endDate && utils.isAfter(endDate, guide.start_date)) {
            return false;
        }

        if (beginDate && endDate && !utils.isBetweenDate(beginDate, endDate, utils.parseDate(guide.start_date))) {
            return false;
        }

        return true;
    });

    insertElements(guidesFiltered, currentPage);
    insertPagination(guidesFiltered.length/2);
}

const sortDate = () => {
    sorted = utils.sortByDate(guidesFiltered);
    insertElements(sorted);
}

const sortBy = (attr, index, e) => {
    e.preventDefault();

    pagination.config.attr_order = attr;
    pagination.config.tableHeader[index].reverse = !pagination.config.tableHeader[index].reverse;

    if (attr === 'start_date') {
        sorted = utils.sortByDate(guidesFiltered);
    } else {
        sorted = guidesFiltered.sort((a, b) => {
            let aValue = a[attr];
            let bValue = b[attr];

            if (attr.includes('.')) {
                const splitted = attr.split('.');

                aValue = a[splitted[0]] ? a[splitted[0]][splitted[1]] : 'Não informado';
                bValue = b[splitted[0]] ? b[splitted[0]][splitted[1]] : 'Não informado';
            }

            if (pagination.config.tableHeader[index].reverse) {
                return aValue < bValue ? 1 : -1;
            }

            return aValue > bValue ? 1 : -1;
        });
    }

    pagination.renderTableHeader();

    insertElements(sorted);
}

const getItemsPerPage = (data, page) => {
    const limit = page * 2;
    const offset = (page *2) - 2;

    return data.slice(offset, limit);
}

const insertElements = (items, page)=> {
    let html = '';

    if (!page) {
        page = 1;
    }

    const itemsToShow = getItemsPerPage(items, page);

    itemsToShow.forEach(item => {
        const currentItem = item;

        if (!currentItem) {
            return;
        }

        if (!currentItem.number) {
            currentItem.number = "Não informado";
        }

        const htmlItem = `
            <tr>
                <td>${utils.parseDate(currentItem.start_date)}</ td>
                <td>${currentItem.number}</td>
                <td style=" max-width: 200px" class="text-truncate">
                    <img style="height:20px; width:20px" class="rounded-circle"src="${currentItem.patient.thumb_url || 'https://via.placeholder.com/150x150.jpg'}">
                    ${currentItem.patient.name}
                </td>
                <td class="${currentItem.health_insurance && currentItem.health_insurance.is_deleted ? 'text-through' : ''}" title="${currentItem.health_insurance && currentItem.health_insurance.is_deleted ? 'Convênio deletado!' : ''}">${(currentItem.health_insurance && currentItem.health_insurance.name) || "Não informado" }</td>
                <td class="text-right">R$ ${utils.parsePrice(currentItem.price)}</td>
            </tr>
        `;
        html += htmlItem;
    });

    if (!items.length) {
        html = `
        <tr>
            <td colspan="5" class="text-center">Nenhum registro encontrado</td>
        </tr>
        `;
    }

    table.innerHTML = html;
    return;
}

const insertPagination = quantity => {
    const navUl = document.getElementById('nav-ul');
    html = '';

    for (let i = 0; i < quantity; i++) {
        html += `<li class="page-item"><a onclick="insertElements(guidesFiltered, ${i + 1})"class="page-link"value="${i+1}"href="#">${i+1}</a></li>`;
    }

    navUl.innerHTML = html
}

const insertInsurancesSelect = insurances => {
    const select = document.getElementById('insurance');

    insurances.forEach(item => {
        const opt = document.createElement('option');
        opt.style.backgroundColor = 'white';
        opt.style.color = 'black';

        opt.value = item.id;
        opt.innerHTML = item.name;

        select.appendChild(opt);
    });
};

const navUl = document.getElementById('nav-ul');

$(function() {
    $( "#begin-date" ).datepicker({ dateFormat: 'dd/mm/yy' });
    $( "#end-date" ).datepicker({ dateFormat: 'dd/mm/yy' });
});

const todayDate = () => {
    document.getElementById('begin-date').value = new Date().toLocaleDateString('pt-BR');
    document.getElementById('end-date').value = new Date().toLocaleDateString('pt-BR');
    filter();
}

init();
