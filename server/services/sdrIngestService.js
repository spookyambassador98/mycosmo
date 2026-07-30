import net from 'net';

class SDRIngestService {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    connect(host = 'localhost', port = 12346) {
        console.log(`[SDR] Подключаемся к радиостанции на ${host}:${port}...`);
        this.client = new net.Socket();
        this.client.connect(port, host, () => {
            this.isConnected = true;
            console.log('[SDR] Линия с наземной станцией установлена. Ловим сырой эфир.');
        });
        this.client.on('data', (data) => {
            const signalPower = data.readInt8(0);
            if (signalPower > 50) {
                console.log(`[SDR] Обнаружен мощный сигнал! Мощность: ${signalPower} dB`);
            }
        });
        this.client.on('close', () => {
            this.isConnected = false;
            setTimeout(() => this.connect(host, port), 5000);
        });
        this.client.on('error', (err) => {
            console.log(`[SDR Ошибка]: ${err.message}`);
        });
    }
}

export default new SDRIngestService();
