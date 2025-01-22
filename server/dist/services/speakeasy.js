import speakeasy from "speakeasy";
export const generate = async () => {
    const secret = speakeasy.generateSecret({ length: 20 });
    return secret;
};
