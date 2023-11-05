const { urlLiveCheck } = require("./dist/index");


const request = urlLiveCheck('https://google.com', { method: 'GET' });


const result = async () => {
    try {
        const response = await request;
        console.log(response);
    }
    catch (e) {
        console.log(e);
    }
}

console.log(result());
