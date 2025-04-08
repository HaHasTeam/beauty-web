import { type CalendarDate } from "@internationalized/date";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { availableTimes } from "./available-times";

interface RightPanelProps {
	date: CalendarDate;
	timeZone: string;
	weeksInMonth?: number; // Giữ lại prop này để tương thích, mặc dù không dùng
	handleChangeAvailableTime: (time: string) => void;
	selectedTime: string | null;
}

export function RightPanel({
	handleChangeAvailableTime,
	selectedTime,
}: RightPanelProps) {
	// Hàm kiểm tra xem một time slot có đang được chọn hay không
	const isTimeSelected = (timeValue: string, selectedTimeValue: string | null): boolean => {
		if (!selectedTimeValue) return false;
		
		// Tách giờ từ timeValue và selectedTimeValue để so sánh
		const [timeHour, timeMinute] = timeValue.split(":");
		const [selectedHour, selectedMinute] = selectedTimeValue.split(":");
		
		// So sánh giờ và phút
		return timeHour === selectedHour && timeMinute === selectedMinute;
	};

	// Create ref for the selected time button
	const selectedTimeRef = React.useRef<HTMLButtonElement>(null);

	// Scroll selected time into view when it changes
	React.useEffect(() => {
		if (selectedTime && selectedTimeRef.current) {
			selectedTimeRef.current.scrollIntoView({
				behavior: "smooth",
				block: "nearest",
			});
		}
	}, [selectedTime]);
	
	return (
		<div className="flex flex-col gap-4 w-[280px]">		
			<div className="grid grid-cols-2 gap-3 p-1">
				{availableTimes.map((availableTime) => {
					const timeValue = availableTime["24"]; // Luôn dùng định dạng 24h
					const isSelected = isTimeSelected(timeValue, selectedTime);
					
					return (
						<Button
							ref={isSelected ? selectedTimeRef : null}
							key={timeValue}
							variant="outline"
							size="sm"
							onClick={() => handleChangeAvailableTime(timeValue)}
							className={cn(
								"time-slot w-full justify-center py-2.5 transition-all duration-300",
								"rounded-lg font-medium text-base relative overflow-hidden",
								"border shadow-sm hover:shadow-md",
								isSelected 
									? [
										"bg-primary text-primary-foreground font-bold shadow-lg scale-105 border-primary/80",
									].join(" ")
									: [
										"hover:bg-primary/10 hover:text-primary hover:border-primary/40",
									].join(" ")
							)}
							data-selected={isSelected}
						>
							{timeValue}
						</Button>
					);
				})}
			</div>
		</div>
	);
}
