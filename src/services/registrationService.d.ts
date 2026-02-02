export declare function registerForTraining(trainingData: any): Promise<string>
export declare function getUserRegistrations(userId: string): Promise<string[]>
export declare function getScheduleRegistrations(scheduleId: string): Promise<any[]>
export declare function getTrainingRegistrations(trainingId: string): Promise<any[]>
export declare function cancelRegistration(userId: string, trainingId: string): Promise<boolean>
