import { sign } from "crypto";
import { users } from "../dummyData/data.js";
import { User } from "../models/user.model.js";


// Resolvers for the User type
const userResolvers = {
    Mutation:{
        signUp: async (_,{input},context) =>{
            try{
                const {username,name,password,gender} = input;
                if (!username || !name || !password || !gender){
                    throw new Error("Please fill in all fields");
                } 
                const existingUser = await User.findOne({username});
                if(existingUser){
                    throw new Error("User already exists");
                }

                const salt = await bcryptjs.genSalt(10);
                const hashedPassword = await bcryptjs.hash(password, salt);

                const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
                const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`; 

                const user = new User({
                    username,
                    name,
                    password: hashedPassword,
                    gender,
                    profilePicture : gender === "male" ? boyProfilePic : girlProfilePic,
                });

                await user.save();
                await context.login(user);
                return user;
            }catch(err){
                console.log("Error in signUp resolver");
                throw new Error(err.message || "Internal server error");
            }
        },

        login: async (_,{input},context) =>{
            try{
                const {username,password} = input;
                const { user } = await context.authenticate('graphql-local', {username, password});


                await context.login(user);
                return user;
            }catch(err){
                console.log("Error in login resolver");
                throw new Error(err.message || "Internal server error");
            }
        } ,
        logout: async (_,__,context) =>{
            try{
                await context.logout();
                res.session.destroy((err)=>{
                    if(err){
                        console.log("Error in destroying session");
                        throw new Error(err.message || "Internal server error");
                    }
                });

                res.clearCookie("connect.sid");
                return {message: "Logged out successfully"}; 
            }catch(err){
                console.log("Error in logout resolver");
                throw new Error(err.message || "Internal server error");
            }
        },

    },
    Query:{
        // users: (_,_,{req,res}) =>{
        //     return users;
        // },
        authUser: async (_,__,context) =>{
            try {
                const user = await context.getUser();
                return user;
                
            } catch (err) {
                console.log("Error in authUser resolver");
                throw new Error(err.message || "Internal server error");
                
            }
        },
        user: (_, {userId}) =>{
            try {
                const user = users.find(user => user._id === userId);
                return user;
                
            } catch (err) {
                console.log("Error in user resolver");
                throw new Error(err.message || "Internal server error");
                
            }
        }
        // TODO ADD USER/TRANSACTION RELATION 


    },
}

export default userResolvers;