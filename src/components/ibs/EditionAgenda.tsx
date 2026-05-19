"use client";

import { useState } from "react";
import Image from "next/image";
import { Clock, MapPin, Mic } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { ibsOverview } from "@/data/ibs";
import type { IbsEdition } from "@/data/ibs/types";
import { IbsSectionHeading } from "./IbsSectionHeading";

export function EditionAgenda({ edition }: { edition: IbsEdition }) {
	const { locale } = useI18n();
	const labels = ibsOverview.editionLabels;
	const agenda = edition.agenda;
	if (!agenda || agenda.length === 0) return null;

	const [activeDay, setActiveDay] = useState(0);
	const currentDay = agenda[activeDay];
	const isRtl = locale === "ar";

	return (
		<section className="bg-white py-20 lg:py-28">
			<Container size="wide">
				<IbsSectionHeading
					overline={labels.agenda[locale]}
					title={
						locale === "ar"
							? "برنامج القمة — كل جلسة في وقتها."
							: "Summit programme — every session in its place."
					}
				/>

				{/* Day tabs */}
				{agenda.length > 1 && (
					<div className="mt-10 flex flex-wrap gap-3">
						{agenda.map((day, idx) => (
							<button
								key={idx}
								onClick={() => setActiveDay(idx)}
								className={`rounded-full px-6 py-2.5 text-base font-bold transition-all ${
									activeDay === idx
										? "bg-[var(--color-navy)] text-white shadow-[0_8px_24px_rgba(1,30,47,0.25)]"
										: "bg-[var(--color-warm)] text-[var(--color-slate)] hover:bg-[var(--color-gold-tint)] hover:text-[var(--color-navy)]"
								}`}
							>
								{day.dateLabel[locale]}
							</button>
						))}
					</div>
				)}

				{/* Single-day heading */}
				{agenda.length === 1 && (
					<div className="mt-10 inline-flex items-center gap-2 rounded-full bg-[var(--color-warm)] px-5 py-2 text-base font-bold text-[var(--color-navy)]">
						<MapPin className="h-4 w-4 text-[var(--color-teal)]" />
						{currentDay.dateLabel[locale]}
					</div>
				)}

				{/* Timeline */}
				<div className="relative mt-12">
					{/* Vertical line */}
					<div
						className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-line)] via-[var(--color-line)] to-transparent"
						style={{ [isRtl ? "right" : "left"]: "28px" }}
					/>

					<div className="space-y-6">
						{currentDay.items.map((item, idx) => {
							const isSession =
								item.speakers &&
								item.speakers.length > 0;
							const isBreak = !isSession;

							return (
								<div
									key={idx}
									className="relative flex gap-5 sm:gap-8"
								>
									{/* Time + node */}
									<div className="relative shrink-0 pt-2">
										<div
											className={`absolute top-4 h-3 w-3 rounded-full border-2 border-white bg-[var(--color-gold)] shadow-[0_0_12px_rgba(238,193,59,0.5)] ${isRtl ? "right-[22px]" : "left-[22px]"}`}
										/>
										<div
											className={`flex items-center gap-2 rounded-xl bg-[var(--color-navy)] px-4 py-2.5 text-lg font-bold text-white shadow-lg ${isRtl ? "mr-10" : "ml-10"}`}
										>
											<Clock className="h-4 w-4 text-[var(--color-gold)]" />
											{item.time}
										</div>
									</div>

									{/* Card */}
									<div className="min-w-0 flex-1 pb-2">
										{isBreak ? (
											/* Break / networking card */
											<div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-warm)] px-6 py-5 text-center">
												<h3 className="text-xl font-bold text-[var(--color-ink)]">
													{item.title[locale]}
												</h3>
												{item.note && (
													<span className="mt-2 inline-flex items-center gap-2 rounded-full bg-[var(--color-gold-tint)] px-4 py-1.5 text-sm font-bold text-[var(--color-gold-deep)]">
														<MapPin className="h-3.5 w-3.5" />
														{item.note[locale]}
													</span>
												)}
											</div>
										) : (
											/* Session card */
											<div className="group overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white shadow-sm transition-all hover:border-[var(--color-gold)] hover:shadow-[0_20px_60px_rgba(238,193,59,0.18)]">
												<div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:gap-8 lg:p-8">
													{/* Main content */}
													<div className="flex-1">
														<div className="flex items-center gap-2">
															<Mic className="h-5 w-5 text-[var(--color-teal)]" />
															<h3 className="text-xl font-bold text-[var(--color-ink)] sm:text-2xl">
																{item.title[locale]}
															</h3>
														</div>
														{item.description && (
															<p className="mt-3 max-w-3xl text-base leading-relaxed text-[var(--color-slate)] sm:text-lg">
																{item.description[locale]}
															</p>
														)}
														{item.note && (
															<span className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--color-gold-tint)] px-4 py-1.5 text-sm font-bold text-[var(--color-gold-deep)]">
																<MapPin className="h-4 w-4" />
																{item.note[locale]}
															</span>
														)}
													</div>

													{/* Speakers sidebar */}
													{item.speakers &&
														item.speakers.length > 0 && (
															<div className="shrink-0 sm:max-w-[340px]">
																<div className="space-y-3">
																	{item.speakers.map(
																		(sp) => (
																			<div
																				key={
																					sp.id
																				}
																				className="flex items-center gap-4 rounded-xl bg-[var(--color-warm)] p-3 transition-colors hover:bg-[var(--color-gold-tint)]"
																			>
																				{sp.photo ? (
																					<Image
																						src={
																							sp.photo
																						}
																						alt={
																							sp
																								.name[
																									locale
																								]
																						}
																						width={48}
																						height={48}
																						className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-white"
																						unoptimized
																					/>
																				) : (
																					<div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--color-navy)] text-base font-bold text-white ring-2 ring-white">
																						{
																							sp
																								.name[
																									locale
																								][0]
																						}
																					</div>
																				)}
																				<div className="min-w-0">
																					<h4 className="truncate text-base font-bold text-[var(--color-ink)]">
																						{
																							sp
																								.name[
																									locale
																								]
																						}
																					</h4>
																					{sp.org && (
																						<span className="text-sm text-[var(--color-slate)]">
																							{
																								sp
																									.org[
																										locale
																									]
																							}
																						</span>
																					)}
																				</div>
																			</div>
																		),
																	)}
																</div>
															</div>
														)}
												</div>
											</div>
										)}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</Container>
		</section>
	);
}
