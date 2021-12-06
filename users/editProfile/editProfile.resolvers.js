import client from "../../client";
import bcrypt from "bcrypt";
import {protectedResolver} from "../users.utils";
import {createWriteStream} from "fs";
import {GraphQLUpload} from "graphql-upload";

export default {
  Upload: GraphQLUpload,
  Mutation: {
    editProfile: protectedResolver(async (_, { name, username, email, password: newPassword, avatarURL }, { loggedInUser } ) => {

      let avatarUrl = null;
      if(avatarURL){
        const { filename, createReadStream } = await avatarURL;
        const newFileName = `${loggedInUser.id}-${Date.now()}-${filename}`;
        const readStream = createReadStream();
        const writeStream = createWriteStream(process.cwd() + "/uploads/" + newFileName);
        readStream.pipe(writeStream);
        avatarUrl = `http://localhost:4000/static/${newFileName}`;
      }

      let uglyPassword = null;
      if (newPassword) uglyPassword = await bcrypt.hash(newPassword, 10);

      const updatedUser = await client.user.update({
        where: {
          id: loggedInUser.id
        }, data: {
          name: name,
          username: username,
          email: email,
          ...(avatarURL && {avatarURL: avatarUrl}),
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
