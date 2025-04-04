import { GraphQLError } from "graphql";
import { AppContext, GetAllowanceArgs } from "../../types/index.js";
import {
	createAllowance,
	readAllowance,
	readAllowances,
	updateAllowanceStatus,
} from "../../models/allowance.js";

export const createAllowanceResolver = async (
	_: never,
	data: {
		bookAllowance: number;
		miscellaneousAllowance: number;
		month: number;
		monthlyAllowance: number;
		semester: number;
		studentId: string;
		thesisAllowance: number;
		totalAmount: number;
		year: number;
		yearLevel: number;
	},
	app: AppContext
) => {
	try {
		if (
			!(app.role === "SUPER_ADMIN" || app.role === "ADMIN_MANAGE_DOCUMENTS")
		) {
			throw new GraphQLError("UnAuthorized!");
		}

		const totalAmount =
			data.bookAllowance +
			data.miscellaneousAllowance +
			data.monthlyAllowance +
			data.thesisAllowance;

		return await createAllowance({
			...data,
			totalAmount,
		});

		// return announcement;
	} catch (err) {
		console.log(err, "qq");
		throw new GraphQLError("Internal Server Error!");
	}
};

export const updateAllowanceStatusResolver = async (
	_: never,
	data: { id: string; claimed: boolean },
	app: AppContext
) => {
	try {
		if (
			!(app.role === "SUPER_ADMIN" || app.role === "ADMIN_MANAGE_DOCUMENTS")
		) {
			throw new GraphQLError("UnAuthorized!");
		}

		return await updateAllowanceStatus(data.id, data.claimed);

		// return announcement;
	} catch (err) {
		console.log(err, "qq");
		throw new GraphQLError("Internal Server Error!");
	}
};

export const allowancesResolver = async (
	_: never,
	data: GetAllowanceArgs,
	app: AppContext
) => {
	try {
		if (
			!(app.role === "SUPER_ADMIN" || app.role === "ADMIN_MANAGE_DOCUMENTS")
		) {
			throw new GraphQLError("UnAuthorized!");
		}

		return await readAllowances(data);

		// return announcement;
	} catch (err) {
		console.log(err, "qq");
		throw new GraphQLError("Internal Server Error!");
	}
};

export const allowanceResolver = async (
	_: never,
	data: { studentId: string; year: number; month: number },
	app: AppContext
) => {
	try {
		if (
			!(app.role === "SUPER_ADMIN" || app.role === "ADMIN_MANAGE_DOCUMENTS")
		) {
			throw new GraphQLError("UnAuthorized!");
		}

		return await readAllowance(data.studentId, data.year, data.month);

		// return announcement;
	} catch (err) {
		console.log(err, "qq");
		throw new GraphQLError("Internal Server Error!");
	}
};
