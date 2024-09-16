import { transactions } from "../dummyData/data.js";

// Resolvers for the Transaction type
const transactionResolvers = {
    Query: {
        transactions: () => {
            return transactions;
        },
    },
    Mutation:{

    }
};


export default transactionResolvers;