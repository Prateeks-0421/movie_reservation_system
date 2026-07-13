const { createClient } = require("redis");

const client = createClient({

    url: process.env.REDIS_URL
    // url : "redis://127.0.0.1:6379" 

});

client.on("connect", () => {

    console.log(" Redis Connected");

});

client.on("error", (err) => {

    console.log("Redis Error:", err);

});

(async () => {

    await client.connect();

})();

module.exports = {

    client

};