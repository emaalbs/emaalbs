export const fadeUp = {
	initial: { opacity: 0, y: 50 },
	whileInView: { opacity: 1, y: 0 },
	transition: { duration: 0.8, ease: "easeOut" as const },
	viewport: { once: true as const, amount: 0.2 },
};

