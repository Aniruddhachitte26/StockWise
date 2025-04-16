const getChatbotResponse = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                error: "Message is required.",
            });
        }

        // Simulate a chatbot response
        const response = `Chatbot response to: ${message}`;

        return res.status(200).json({ response });
    } catch (error) {
        console.error("Error getting chatbot response:", error);
        return res.status(500).json({
            error: "Server error. Failed to get chatbot response.",
        });
    }
};

module.exports = {
    getChatbotResponse,
};