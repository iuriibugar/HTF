export declare function getAllDonations(): Promise<any[]>
export declare function createDonation(donationData: any): Promise<string>
export declare function updateDonation(donationId: string, donationData: any): Promise<string>
export declare function deleteDonation(donationId: string): Promise<boolean>
