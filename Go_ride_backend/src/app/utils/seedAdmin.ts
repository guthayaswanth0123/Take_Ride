import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";
import bcryptjs from "bcryptjs";

export const seedAdmin = async () => {
  try {
    const hashedPassword = await bcryptjs.hash(
      envVars.ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const isSuperAdminExist = await User.findOne({
      email: envVars.ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      isSuperAdminExist.password = hashedPassword;
      await isSuperAdminExist.save();
      console.log(`Admin user (${envVars.ADMIN_EMAIL}) updated with latest credentials ✅`);
      return;
    }
    console.log("Trying to create super admin");

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVars.ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Super Admin",
      role: Role.ADMIN,
      email: envVars.ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      auths: [authProvider],
    };

    const admin = await User.create(payload);
    console.log("admin created successfully");
    console.log(admin);
  } catch (error) {
    console.log(error);
  }
};