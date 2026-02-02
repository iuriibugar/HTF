export declare function getCurrentUser(): Promise<any>
export declare function logout(): Promise<boolean>
export declare function isAdminUser(userEmail: string, adminEmails: string[]): boolean
