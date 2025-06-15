// sensor.js
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');

const SENSOR_ID = 'sensor1'; //  duplicar este arquivo e mudar o ID
const TOPIC = `caldeira/temperatura/${SENSOR_ID}`;

client.on('connect', () => {
  console.log(`[SENSOR] Conectado ao broker como ${SENSOR_ID}`);

  setInterval(() => {
    const temperatura = Math.floor(Math.random() * 40) + 180; // Entre 180 e 220
    client.publish(TOPIC, temperatura.toString());
    console.log(`[SENSOR] ${SENSOR_ID} publicou: ${temperatura}`);
  }, 60000); // a cada 60 segundos
});
