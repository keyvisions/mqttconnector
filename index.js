const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./config.json').toString() || fs.readFileSync('./config_sample.json').toString());

const sql = require('mssql');
const mqtt = require('mqtt');
const mqttClient = mqtt.connect(config.mqttBroker);

const log = fs.createWriteStream(config.log, { flags: 'a' });
log.entry = (name, msg) => {
    log.write(`${(new Date()).toISOString()} ${name}: ${msg}\n`);
};

sql.on('error', err => {
    log.entry('sql.error', err.message);
});

mqttClient.on('error', err => {
    log.entry('mqqtClient.error', err.message);
});

mqttClient.on('connect', (connack) => {
    mqttClient.subscribe(config.subscribe, err => {
        if (err)
            log.entry('mqttClient.subscribe.error', err.message);
        else {
            log.entry('mqqtClient', `MQTT Connector listening to '${config.subscribe}'`);
        }
    });
});

mqttClient.on('message', (topic, message, packet) => {
    sql.connect(config.db)
        .then(pool => {
            return pool.request()
                .input('topic', sql.NVarChar(256), topic)
                .input('message', sql.NVarChar(sql.MAX), message.toString())
                .query(config.db.logcmd);
        })
        .catch(err => {
            log.entry('sql.connect.error', err.message);
        });
});

mqttClient.on('end', () => {
    log.entry('mqqtClient', `MQTT Connector no longer listening to '${config.subscribe}'`);
});