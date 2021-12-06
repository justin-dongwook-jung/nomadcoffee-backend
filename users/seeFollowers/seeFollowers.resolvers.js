import client from "../../client";

export default {
  Query: {
    seeFollowers: async (_, {username, page}) => {
      const ok = await client.user.findUnique({
        where: {
          username: username
        },
        select: {
          id: true
        }
      })

      if(!ok){
        return {
          ok: false,
          error: "User not found"
        }
      }

      const followers = await client.user.findUnique({
          where: { username: username }
        })
        .followers({
          take: 5,
          skip: (page-1)*5
        });

      const totalFollowers = await client.user.count({
        where: {
          following: {
            some: { username: username }
          }
        }
      });

      return {
        ok: true,
        followers: followers,
        totalPages: Math.ceil(totalFollowers/5)
      }
    }
  }
}
