// cat.js
const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883');

const BUFFER = []; // {valor, timestamp}
const TEMPO_JANELA = 120000; // 120 segundos

let ultimaMedia = null;

client.on('connect', () => {
  console.log('[CAT] Conectado ao broker');
  client.subscribe('caldeira/temperatura/#');
});

client.on('message', (topic, message) => {
  const valor = parseFloat(message.toString());
  const agora = Date.now();

  // Adiciona ao buffer
  BUFFER.push({ valor, timestamp: agora });

  // Remove entradas com mais de 120s
  while (BUFFER.length > 0 && (agora - BUFFER[0].timestamp) > TEMPO_JANELA) {
    BUFFER.shift();
  }

  // Calcula média
  const soma = BUFFER.reduce((acc, cur) => acc + cur.valor, 0);
  const media = soma / BUFFER.length;
  console.log(`[CAT] Média atual: ${media.toFixed(2)}°C`);

  // Verifica e publica eventos
  if (media > 200) {
    client.publish('caldeira/evento/alta_temperatura', `Média: ${media.toFixed(2)}`);
    console.log('⚠️ [CAT] Temperatura alta detectada!');
  }

  if (ultimaMedia !== null && Math.abs(media - ultimaMedia) >= 5) {
    client.publish('caldeira/evento/aumento_repentino', `De ${ultimaMedia.toFixed(2)} para ${media.toFixed(2)}`);
    console.log('⚠️ [CAT] Aumento repentino detectado!');
  }

  ultimaMedia = media;
});
