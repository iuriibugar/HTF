export declare function getAllSchedules(): Promise<any[]>
export declare function getScheduleForWeek(monday: Date, sunday: Date): Promise<any | null>
export declare function saveSchedule(weekStart: string, weekEnd: string, trainings: any[], userEmail: string): Promise<string>
