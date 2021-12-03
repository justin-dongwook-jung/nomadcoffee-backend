import client from "../../client";
import bcrypt from "bcrypt";
import {protectedResolver} from "../users.utils";

export default {
  Mutation: {
    editProfile: protectedResolver(async (_, { name, username, email, password: newPassword, avatarURL }, { loggedInUser } ) => {

      let uglyPassword = null;
      if (newPassword) uglyPassword = await bcrypt.hash(newPassword, 10);

      const updatedUser = await client.user.update({
        where: {
          id: loggedInUser.id
        }, data: {
          name: name,
          username: username,
          email: email,
          avatarURL: avatarURL,
          ...(uglyPassword && {password: uglyPassword})
        }
      })

      if(updatedUser.id){
        return {
          ok: true
        }
      }
      else {
        return {
          ok: false,
          error: "Could not edit profile"
        }
      }
    })
  }
}
