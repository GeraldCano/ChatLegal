const fetch = require('node-fetch');

module.exports = async (req, res) => {
    console.log("Inicio de la función");  // Verificación de inicio de función
    
    // Obtener la clave API de OpenAI desde las variables de entorno en Vercel
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    console.log("Clave API:", OPENAI_API_KEY);  // Verificación de la clave API
    
    // Verificar si la clave API está configurada
    if (!OPENAI_API_KEY) {
        console.log("No se encontró la clave de API");  // Agregar log de error
        return res.status(500).json({ response: "No se encontró la clave de API de OpenAI." });
    }

    if (req.method === 'POST') {
        console.log("Método POST recibido");  // Verificación del método recibido

        const userMessage = req.body.message;
        console.log("Mensaje recibido:", userMessage);  // Verificación del mensaje del usuario

        try {
            // Realizar la solicitud a la API de OpenAI
            console.log("Realizando solicitud a OpenAI...");
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",  // Modelo GPT-3.5
                    messages: [{ role: "user", content: userMessage }],
                }),
            });

            const data = await response.json();
            console.log("Datos recibidos de OpenAI:", data);  // Verificación de la respuesta de OpenAI

            if (data.choices && data.choices.length > 0) {
                // Si la respuesta es válida, devuelve el texto del chatbot
                res.status(200).json({ response: data.choices[0].message.content });
            } else {
                console.log("Respuesta vacía de OpenAI");
                res.status(500).json({ response: "No se pudo obtener una respuesta de OpenAI." });
            }
        } catch (error) {
            console.error("Error en la solicitud a OpenAI:", error);
            res.status(500).json({ response: "Ocurrió un error con la solicitud." });
        }
    } else {
        // Si no es una solicitud POST, responde con método no permitido
        console.log("Método no permitido");
        res.status(405).json({ response: "Método no permitido." });
    }
};

        // Si no es una solicitud POST, responde con método no permitido
        res.status(405).json({ response: "Método no permitido." });
    }
};
