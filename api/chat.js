const fetch = require('node-fetch'); // Asegúrate de tener este paquete instalado

module.exports = async (req, res) => {
    // Obtener la clave API de OpenAI desde las variables de entorno en Vercel
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    // Verificar si la clave API está configurada
    if (!OPENAI_API_KEY) {
        return res.status(500).json({ response: "No se encontró la clave de API de OpenAI." });
    }

    if (req.method === 'POST') {
        const userMessage = req.body.message;

        try {
            // Realizar la solicitud a la API de OpenAI
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",  // Modelo GPT-3.5 o puedes usar otro si lo prefieres
                    messages: [{ role: "user", content: userMessage }],
                }),
            });

            const data = await response.json();

            // Depuración: ver qué respuesta está devolviendo OpenAI
            console.log('Datos recibidos de OpenAI:', data);

            if (data.choices && data.choices.length > 0) {
                // Si la respuesta es válida, devuelve el texto del chatbot
                res.status(200).json({ response: data.choices[0].message.content });
            } else {
                res.status(500).json({ response: "No se pudo obtener una respuesta." });
            }
        } catch (error) {
            // Manejar errores de la API de OpenAI
            console.error("Error en la solicitud a OpenAI:", error);
            res.status(500).json({ response: "Ocurrió un error con la solicitud." });
        }
    } else {
        // Si no es una solicitud POST, responde con método no permitido
        res.status(405).json({ response: "Método no permitido." });
    }
};
