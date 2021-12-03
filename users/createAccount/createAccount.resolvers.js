import client from "../../client";
import bcrypt from "bcrypt";

export default {
  Mutation: {
    createAccount: async (
      _,
      {name, username, email, password}
    ) => {
      try {
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

        if(existingUser){
          throw new Error("This username/password is already taken.");
        }

        const uglyPassword = await bcrypt.hash(password, 10);
        return await client.user.create({
          data: {
            username: username,
            email: email,
            name: name,
            password: uglyPassword
          }
        });
      } catch (e) {
        return e;
      }
    }
  }
}
