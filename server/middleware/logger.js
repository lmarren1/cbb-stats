const log = (message) => {
    const currentDatetime = new Date().toISOString();
    console.log(`LOG @ [${currentDatetime}] MESSAGE: ${message}`);
}

module.exports = { log };
