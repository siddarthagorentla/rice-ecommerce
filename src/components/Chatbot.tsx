import React, { useState, useMemo, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Product } from '../types';

interface ChatbotProps {
    products: Product[];
}

const Chatbot: React.FC<ChatbotProps> = ({ products }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([
        { role: 'bot', text: "Hello! I am MKRM's AI assistant. I can help you with product information, order tracking, and more. How can I help you today?", sources: [] }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const systemPrompt = useMemo(() => {
        const productInfo = products.map(p => `- ${p.name}: ${p.priceINR} INR per quintal. Available in units of 1 quintal. Image: ${p.image}.`).join('\n');

        return `You are an expert AI assistant for MKRM Rice, a premium rice supplier. Your goal is to be helpful, friendly, and provide accurate information to customers.
        Use the provided context about products and traceability data.
        CONTEXT:
        Products available for sale:
        ${productInfo}

        Sample traceability data:
        // Traceability data is injected by the backend

        RULES:
        - If a user asks about a product, use the context to provide its price and details.
        - If a user asks to track a batch ID, check if it exists in the sample data. If not, inform them you only have sample data.
        - For general questions about rice, farming, or recipes, use your general knowledge but mention that you are an AI assistant for MKRM Rice.
        - You can answer questions about the company's commitment to quality and sustainability.
        - Be concise. Use markdown for formatting (like lists) if it improves readability.
        - Use Google Search for questions about recent market trends, news, or topics outside the provided context. When you do, you MUST provide the source links.
        - Your name is "MKRM AI Assistant".
        `;
    }, [products]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const sendMessage = async (message: string) => {
        if (isLoading || !message.trim()) return;

        const userMessage = { role: 'user', text: message, sources: [] };
        const currentMessages = [...messages, userMessage];
        setMessages(currentMessages);
        setIsLoading(true);

        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5006';
            const response = await fetch(`${API_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: currentMessages,
                    systemPrompt: systemPrompt
                })
            });

            if (!response.ok) throw new Error('Failed to fetch chat response');

            const data = await response.json();

            setMessages(prev => [...prev, {
                role: 'bot',
                text: data.text,
                sources: data.sources || []
            }]);

        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I encountered an error. Please try again.', sources: [] }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(inputValue);
        setInputValue('');
    };

    return (
        <div className="chatbot-container">
            {isOpen && (
                <div className="chat-window" role="dialog" aria-labelledby="chat-header">
                    <div className="chat-header" id="chat-header">
                        <h3>MKRM AI Assistant</h3>
                        <button onClick={() => setIsOpen(false)} aria-label="Close chat">&times;</button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}-message`}>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="message-sources">
                                        <strong>Sources:</strong>
                                        <ul>
                                            {msg.sources.slice(0, 3).map((source: any, i: number) => (
                                                <li key={i}><a href={source.uri} target="_blank" rel="noopener noreferrer">{source.title || source.uri}</a></li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="typing-indicator" aria-label="Assistant is typing">
                                <span className="dot"></span><span className="dot"></span><span className="dot"></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="chat-input-form" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Ask a question..."
                            aria-label="Your message"
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading || !inputValue.trim()} aria-label="Send message">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </form>
                </div>
            )}
            <button className="chatbot-toggle-btn" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? "Close chat" : "Open chat"}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path></svg>
            </button>
        </div>
    );
};

export default Chatbot;
