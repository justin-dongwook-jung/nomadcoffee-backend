import client from "../../client";
import { protectedResolver } from "../users.utils";

export default {
  Query: {
    seeProfile: protectedResolver((_, { username }) =>
      client.user.findUnique({
        where: {
          username,
        },
        include: {
          following: true,
          followers: true
        }
      }))
  },
};
