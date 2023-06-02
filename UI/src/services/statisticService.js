const fetchData = async () => {
    try {
        const response = await fetch('http://localhost:3500/trungTamDangKiem/:user/statistic');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};

const myObject = {};

fetchData()
    .then(data => {
        // Assign the fetched data to the object
        myObject.data = data;
        console.log(JSON.stringify(myObject));
    })
    .catch(error => console.error(error));
