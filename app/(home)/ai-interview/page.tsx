"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SidebarContent from "@/components/SideBar";
import { Menu, Send, User, Bot } from "lucide-react";

type Message = {
	id: number;
	text: string;
	sender: "user" | "ai";
};

export default function AIInterviewPage() {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [jd, setJd] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [input, setInput] = useState("");
	const [isInterviewStarted, setIsInterviewStarted] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(scrollToBottom, [messages]);

	const handleStartInterview = async () => {
		if (jd.trim() === "") return;
		setIsInterviewStarted(true);
		setIsProcessing(true);
		await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulating API call
		setMessages([
			{
				id: 1,
				text: "Great! I've analyzed the job description. Let's begin the interview. Could you tell me about your relevant experience for this position?",
				sender: "ai",
			},
		]);
		setIsProcessing(false);
	};

	const handleSendMessage = async () => {
		if (input.trim() === "") return;
		const userMessage: Message = { id: messages.length + 1, text: input, sender: "user" };
		setMessages((prev) => [...prev, userMessage]);
		setInput("");
		setIsProcessing(true);
		await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulating API call
		const aiResponse: Message = {
			id: messages.length + 2,
			text: generateAIResponse(input),
			sender: "ai",
		};
		setMessages((prev) => [...prev, aiResponse]);
		setIsProcessing(false);
	};

	const generateAIResponse = (userInput: string) => {
		// This is a placeholder. In a real application, you'd call your AI service here.
		const responses = [
			"That's interesting. Can you elaborate on how that experience relates to this role?",
			"Great answer! Now, tell me about a challenging situation you've faced in your previous job.",
			"I see. How do you think your skills align with the requirements mentioned in the job description?",
			"Excellent. Can you give an example of a project where you demonstrated leadership skills?",
			"Thank you for sharing that. What do you think sets you apart from other candidates for this position?",
		];
		return responses[Math.floor(Math.random() * responses.length)];
	};

	return (
		<div className="flex h-screen bg-background text-foreground">
			{/* Main content */}
			<main className="flex flex-1 flex-col overflow-hidden p-4 md:p-6">
				<h1 className="mb-6 text-3xl font-bold">AI Interview Simulation</h1>

				{!isInterviewStarted ? (
					<motion.div
						className="flex flex-col items-center justify-center flex-1"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<div className="w-full max-w-3xl">
							<Label htmlFor="jd" className="text-lg font-semibold mb-2 block">
								Job Description
							</Label>
							<Textarea
								id="jd"
								placeholder="Paste the job description here to start the AI interview..."
								value={jd}
								onChange={(e) => setJd(e.target.value)}
								className="mb-4 min-h-[200px]"
								rows={10}
							/>
							<Button onClick={handleStartInterview} className="w-full text-lg py-6">
								Start Interview
							</Button>
						</div>
					</motion.div>
				) : (
					<motion.div
						className="flex flex-1 flex-col overflow-hidden rounded-lg border border-border bg-muted"
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5 }}
					>
						<div className="flex-1 overflow-y-auto p-4">
							<AnimatePresence>
								{messages.map((message) => (
									<motion.div
										key={message.id}
										initial={{ opacity: 0, y: 50 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -50 }}
										transition={{ duration: 0.3 }}
										className={`mb-4 flex ${
											message.sender === "user" ? "justify-end" : "justify-start"
										}`}
									>
										<div
											className={`rounded-lg px-4 py-2 max-w-[80%] ${
												message.sender === "user"
													? "bg-primary text-primary-foreground"
													: "bg-secondary"
											}`}
										>
											<div className="flex items-center gap-2 font-semibold mb-1">
												{message.sender === "user" ? (
													<User className="h-4 w-4" />
												) : (
													<Bot className="h-4 w-4" />
												)}
												{message.sender === "user" ? "You" : "AI Interviewer"}
											</div>
											<p>{message.text}</p>
										</div>
									</motion.div>
								))}
							</AnimatePresence>
							<div ref={messagesEndRef} />
						</div>
						<motion.div
							className="border-t border-border bg-background p-4"
							initial={{ y: 50, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.3 }}
						>
							<form
								onSubmit={(e) => {
									e.preventDefault();
									handleSendMessage();
								}}
								className="flex items-center gap-2"
							>
								<Input
									type="text"
									placeholder="Type your response..."
									value={input}
									onChange={(e) => setInput(e.target.value)}
									className="flex-1"
								/>
								<Button type="submit" size="icon" disabled={isProcessing}>
									<Send className="h-4 w-4" />
								</Button>
							</form>
						</motion.div>
					</motion.div>
				)}

				{isProcessing && (
					<motion.div
						className="fixed bottom-8 right-8 flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-lg"
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 50 }}
					>
						<motion.div
							className="h-3 w-3 rounded-full bg-primary-foreground"
							animate={{ scale: [1, 1.2, 1] }}
							transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
						/>
						<span>AI is thinking...</span>
					</motion.div>
				)}
			</main>
		</div>
	);
}
