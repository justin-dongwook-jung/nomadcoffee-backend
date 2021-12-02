import client from "../client";
import bcrypt from "bcrypt";

export default {
  Mutation: {
    createAccount: async (
      _,
      {username, email, name, password}
    ) => {
      const existingUser = await client.user.findFirst({
        where: {
          OR: [
            {
              username: username
            },
            {
              email: email
            }
          ]
        }
      });

      if(existingUser)  return false;

      const uglyPassword = await bcrypt.hash(password, 10);

      const user = await client.user.create({
        data: {
          username: username,
          email: email,
          name: name,
          password: uglyPassword
        }
      });

      if(user) return true;

    }
  }
}
