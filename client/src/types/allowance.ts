export interface Allowance {
	readonly id: string;
	studentId: string;

	year: number;
	month: number;
	semester: number;
	monthlyAllowance: number;
	bookAllowance: number;
	miscellaneousAllowance: number;
	thesisAllowance: number;
	claimed: boolean;
	claimedAt: string | null;
	yearLevel: number;
	totalAmount: number;

	createdAt: string;
	updatedAt: string;
}
