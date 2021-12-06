import {gql} from "apollo-server";

export default gql`
    scalar Upload
    
    type EditProfileResult {
        ok: Boolean!
        error: String
    }

    type Mutation {
        editProfile(
            name: String
            username: String
            email: String
            password: String
            avatarURL: Upload
        ) : EditProfileResult!
    }
`
