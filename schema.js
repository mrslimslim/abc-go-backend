const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');
const axios = require("axios");

//Customer Query
const CustomerType = new GraphQLObjectType({
    name :'Customer',
    fields:()=>({
        id:{type:GraphQLString},
        name:{type:GraphQLString},
        email:{type:GraphQLString},
        age:{type:GraphQLInt}
    })
})


//Root Query
const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        customer:{
            type:CustomerType,
            args:{
                id:{type:GraphQLString}
            },
            resolve(parentValvue,args){
                return axios.get("http://localhost:3000/customers/"+args.id).then((res)=>{
                    return res.data
                })
            }
    },
    customers:{
        type:new GraphQLList(CustomerType),
        resolve(parentValvue,args){
            return axios.get("http://localhost:3000/customers").then((res)=>{
                return res.data
            })
        }

    }
}
    
});

const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addCustomer:{
            type:CustomerType,
            args:{
                name:{type:new GraphQLNonNull(GraphQLString)},
                email:{type:new GraphQLNonNull(GraphQLString)},
                age:{type:new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValvue,args){
                return axios.post('http://localhost:3000/customers',{
                    name:args.name,
                    email:args.email,
                    age:args.age
                }).then(res => res.data);
            }
        },
        deleteCustomer:{
            type:CustomerType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValvue,args){
                return axios.delete('http://localhost:3000/customers/'+ args.id,{
                   id:args.id
                }).then(res => res.data);
            }
        },
        editCustomer:{
            type:CustomerType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLString)},
                name:{type:GraphQLString},
                email:{type:GraphQLString},
                age:{type:GraphQLInt}
            },
            resolve(parentValvue,args){
                return axios.patch('http://localhost:3000/customers/'+args.id,args).then(res => res.data);
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query:RootQuery,
    mutation
})