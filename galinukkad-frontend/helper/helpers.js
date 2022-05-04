export const getSingleSettingData = (cards, id) => {

    let result;
    if (cards != undefined) {
        cards.map((item, key) => {
            if (item.option === id) {
                result = item.value;
            }
        })
    }

    return result;
};

