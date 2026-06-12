"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
	id: string;
	label: string;
	count: number;
	isComplete: boolean;
	isExpanded: boolean;
	onToggle: () => void;
	children: React.ReactNode;
}

export function SectionCard({ id, label, count, isComplete, isExpanded, onToggle, children }: Props) {
	const contentRef = useRef<HTMLDivElement>(null);

	return (
		<div id={`section-${id}`} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
			<button
				type="button"
				onClick={onToggle}
				className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
			>
				<div
					className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
						isComplete
							? "bg-[var(--color-teal)] text-white"
							: "bg-gray-100 text-gray-400"
					}`}
				>
					{isComplete ? <Check className="h-3.5 w-3.5" /> : <span className="text-[10px]">{count}</span>}
				</div>
				<div className="flex-1">
					<span className="text-sm font-semibold text-gray-900">{label}</span>
					{count > 0 && <span className="ml-2 text-xs text-gray-400">· {count}</span>}
				</div>
				<ChevronDown
					className={`h-4 w-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
				/>
			</button>
			<AnimatePresence initial={false}>
				{isExpanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.25, ease: "easeInOut" }}
						className="overflow-hidden"
					>
						<div ref={contentRef} className="px-5 pb-5 pt-1 border-t border-gray-100">
							{children}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
