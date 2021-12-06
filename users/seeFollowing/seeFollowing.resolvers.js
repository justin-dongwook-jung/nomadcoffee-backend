import client from "../../client";

export default {
  Query: {
    seeFollowing: async (_, {username, lastId}) => {
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

      const following = await client.user.findUnique({
          where: { username: username }
        })
        .following({
          take: 5,
          skip: lastId?1:0,
          ...(lastId && { cursor: {id: lastId}})
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
        following: following
      }
    }
  }
}
