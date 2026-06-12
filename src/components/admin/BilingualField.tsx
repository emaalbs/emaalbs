"use client";

import { Globe } from "lucide-react";

interface Props {
	enValue: string;
	arValue: string;
	onEnChange: (v: string) => void;
	onArChange: (v: string) => void;
	label: string;
	required?: boolean;
	hint?: string;
	multiline?: boolean;
	enError?: string;
	arError?: string;
	rows?: number;
	placeholderEn?: string;
	placeholderAr?: string;
}

export function BilingualField({
	enValue,
	arValue,
	onEnChange,
	onArChange,
	label,
	required,
	hint,
	multiline,
	enError,
	arError,
	rows = 3,
	placeholderEn,
	placeholderAr,
}: Props) {
	const inputCls = (err?: string) =>
		`w-full rounded-lg border bg-white px-3 py-2.5 text-gray-900 outline-none transition focus:border-[var(--color-teal)] focus:ring-1 focus:ring-[var(--color-teal)]/20 ${
			err ? "border-red-300" : "border-gray-200"
		}`;

	const Input = multiline ? "textarea" : "input";

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2">
				<span className="text-sm font-medium text-gray-700">{label}</span>
				{required && <span className="text-red-500">*</span>}
				{hint && <span className="text-xs text-gray-400">{hint}</span>}
			</div>

			<div className="grid gap-3 md:grid-cols-2">
				{/* EN */}
				<div className="space-y-1">
					<div className="flex items-center gap-1.5">
						<span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-navy)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
							<Globe className="h-2.5 w-2.5" />
							EN
						</span>
					</div>
					<Input
						{...(multiline ? { rows } : { type: "text" })}
						value={enValue}
						onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onEnChange(e.target.value)}
						placeholder={placeholderEn}
						className={`${inputCls(enError)} ${multiline ? "resize-y" : ""}`}
					/>
					{enError && <p className="text-xs text-red-500">{enError}</p>}
				</div>

				{/* AR */}
				<div className="space-y-1">
					<div className="flex items-center gap-1.5">
						<span className="inline-flex items-center gap-1 rounded-md bg-[var(--color-gold)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--color-navy)]">
							<Globe className="h-2.5 w-2.5" />
							AR
						</span>
					</div>
					<Input
						{...(multiline ? { rows } : { type: "text" })}
						value={arValue}
						onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onArChange(e.target.value)}
						placeholder={placeholderAr}
						className={`${inputCls(arError)} ${multiline ? "resize-y" : ""}`}
						dir="rtl"
					/>
					{arError && <p className="text-xs text-red-500">{arError}</p>}
				</div>
			</div>
		</div>
	);
}
