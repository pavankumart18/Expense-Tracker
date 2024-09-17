import Transaction  from '../models/transaction.model.js';

// Resolvers for the Transaction type
const transactionResolvers = {
    Query: {
        transactions: async (_,__,context) =>{
            try {
                if (!context.getUser()){
                    throw new Error("Unauthorized");
                }
                const userId = await context.getUser()._id;

                const transactions = await Transaction.find({userId});

                return transactions;
            } catch (err) {
                console.log("Error in transactions resolver");
                throw new Error(err.message || "Internal server error");
                
            }
        },
        transaction: async (_, {transactionId}, context) =>{
            try {
                if (!context.getUser()){
                    throw new Error("Unauthorized");
                }
                const userId = await context.getUser()._id;

                const transaction = await Transaction.findOne({_id: transactionId, userId});

                return transaction;
            } catch (err) {
                console.log("Error in transaction resolver");
                throw new Error(err.message || "Internal server error");
                    
                }
            },
            // TODO ADD Category Statistics Query
    },
    Mutation:{

        createTransaction: async (_, {input}, context) =>{
            try {
                if (!context.getUser()){
                    throw new Error("Unauthorized");
                }
                const userId = await context.getUser()._id;

                const transaction = new Transaction({...input, userId});
                await transaction.save();

                return transaction;
            } catch (err) {
                console.log("Error in createTransaction resolver");
                throw new Error(err.message || "Internal server error");
                
            }
        },
        updateTransaction: async (_, {input}, context) =>{
            try {
                if (!context.getUser()){
                    throw new Error("Unauthorized");
                }
                const userId = await context.getUser()._id;

                const transaction = await Transaction.findOneAndUpdate({_id: input.transactionId, userId}, {...input}, {new: true});

                return transaction;
            } catch (err) {
                console.log("Error in updateTransaction resolver");
                throw new Error(err.message || "Internal server error");
                
            }
        },
        deleteTransaction: async (_, {transactionId}, context) =>{
            try {
                if (!context.getUser()){
                    throw new Error("Unauthorized");
                }
                const userId = await context.getUser()._id;

                const transaction = await Transaction.findOneAndDelete({_id: transactionId, userId});

                return transaction;
            } catch (err) {
                console.log("Error in deleteTransaction resolver");
                throw new Error(err.message || "Internal server error");
                
            }
        }
        // TODO ADD TRANSACTION/USER RELATIONSHIP


    }
};


export default transactionResolvers;