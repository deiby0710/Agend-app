import axios from "axios";

export const sendSMSService = async (numero, mensaje) => {
    const url = "https://api103.hablame.co/api/sms/v3/send/marketing";

    const headers = {
        'Accept': 'application/json',
        'Account': '10030136',
        'ApiKey': 'paWeBqcOCLNg7oGRtOo85tNVsT3z7f',
        'Token': 'ca5b4fed3d7a296556f601ee27a5504b',
        'Content-Type': 'application/json'
    };

    const data = {
        toNumber: numero,
        sms: mensaje,
        flash: "0",
        sc: "890202",
        request_dlvr_rcpt: "0"
    };

    const response = await axios.post(url, data, { headers });
    return response.data;
};
