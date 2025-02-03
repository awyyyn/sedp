import {
	twoFactorAuthResolver,
	verifyTOTPResolver,
	systemUsersResolver,
	systemUserResolver,
	updateSystemUserResolver,
	deleteSystemUserResolver,
	studentsResolver,
	studentResolver,
	sendSystemUserRegistrationEmailResolver,
	sendStudentRegistrationEmailResolver,
} from "./resolvers/index.js";

export const resolvers = {
	Query: {
		generateTOTPSecret: twoFactorAuthResolver,
		systemUsers: systemUsersResolver,
		systemUser: systemUserResolver,
		students: studentsResolver,
		student: studentResolver,
	},
	Mutation: {
		verifyTOTP: verifyTOTPResolver,
		updateSystemUser: updateSystemUserResolver,
		deleteSystemUser: deleteSystemUserResolver,
		sendSystemUserRegistrationEmail: sendSystemUserRegistrationEmailResolver,
		sendStudentRegistrationEmail: sendStudentRegistrationEmailResolver,
	},
};
