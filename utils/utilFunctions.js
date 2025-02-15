import bcryptjs from "bcryptjs";

export const generateHashedPass = async (pass) => {
  if (pass !== "" && pass !== null && pass !== undefined) {
    const salt = await bcryptjs.genSalt(10);
    const hashPass = await bcryptjs.hash(pass, salt);
    return hashPass;
  } else {
    return "";
  }
};
