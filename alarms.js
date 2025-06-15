// alarms.js
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');

client.on('connect', () => {
  console.log('[ALARMS] Conectado ao broker');
  client.subscribe('caldeira/evento/#');
});

client.on('message', (topic, message) => {
  console.log(`🔔 [ALARM] Evento recebido (${topic}): ${message.toString()}`);
});
