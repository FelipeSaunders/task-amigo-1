class utils {
    static parsePrice = (price) => {
        if (!price || isNaN(price)) {
            return '0,00'
        }

        return price.toFixed(2).replace('.', ',');
    }

    static parseDate = (date) => {
        return new Date(date).toLocaleDateString('pt-BR');
    }

    static isBetweenDate = (beginDate, endDate, guideDate) => {
        return (beginDate <= new Date(guideDate).toLocaleDateString('pt-BR')  && new Date(guideDate).toLocaleDateString('pt-BR')  <= endDate);
    }

    static isBefore = (beginDate, guideDate) => {
        return new Date(guideDate).toLocaleDateString('pt-BR') < beginDate;
    }

    static isAfter = (endDate, guideDate) => {
        return new Date(guideDate).toLocaleDateString('pt-BR')  > endDate;
    }

    static clearInputs = (array) => {
        array.forEach(item => {
            document.getElementById(item).value = "";
        })
    }

    static sortByDate = array => {
        array.sort((a, b) => {
            if (new Date(a.start_date).toLocaleDateString('pt-BR') > new Date(b.start_date).toLocaleDateString('pt-BR')){
                return 1;
            } else {
                return -1;
            }
        });

        return array;
    }
}