
const guidesUrl = "https://augustoferreira.com/amigo/guides.json";
const div = document.querySelector('.div-inserir');
const getJsonGuides = async () => {
        const json = await axios(guidesUrl);

        if (!json) {
                return;
        }

        return json.data;
}

const init = async () => {
        const json = await getJsonGuides();
        sortByDate(json.data.guides);
        testDates(json);
}

const sortByDate = array => {
        array.sort((a, b) => {
                if (new Date(a.start_date).toLocaleDateString('pt-BR') > new Date(b.start_date).toLocaleDateString('pt-BR')){
                        return 1;
                } else {
                        return -1;
                }
        })

        array.forEach(item => {
                div.innerHTML += `<p>${new Date(item.start_date).toLocaleDateString('pt-BR')}</p>`;
        });
}


const testDates = json => {
        const dateArray = json.data.guides.forEach(item => {
                console.log(moment(item.start_date).locale('pt-BR').format('L'));
        })
        // console.log(dateArray);
}

init();
