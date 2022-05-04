const db = require('../_helper/db');

const Notification = db.Notification;
const UserLogins = db.UserLogins; 
const Product = db.Product;
const Ticket = db.Ticket;
const TicketQuery = db.Ticket_Query;
const manage_caselog = db.manage_caselog;


const { Validator } = require('node-input-validator');
const mongoose = require('mongoose');

exports.createTicket = async (req, res, next) => {
    try {
        let userInfo = await UserLogins.findById({_id : req.user._id}); 



        let data = {
            loginid: req.user._id,
            title: req.body.title,
            priority: req.body.priority,
            email: userInfo.email
        }


       


        Ticket.create(data).then(async(user) => {

            let dataQuery = {
                ticket_id: user._id,
                from: data.loginid,
                to:"ADMIN",
                message: req.body.description
            }




            let result = new TicketQuery(dataQuery)
            await result.save()


            res.send({ status: true, message: "Record inserted!", result: user });
        }).catch(err => {
            console.log(err)
            res.send({ status: false, message: "Something went wrong!" });
        })

    } catch (e) {
        console.log(e)
        res.send({ status: false, message: "Something went wrong!" });
    }
}

exports.createTicketAdmin = async (req, res, next) => {
    try {
        let userInfo = await UserLogins.findById({_id : req.body.loginid}); 



        let data = {
            loginid: req.body.loginid,
            title: req.body.title,
            priority: req.body.priority,
            email: userInfo.email
        }

console.log(data)
       


        Ticket.create(data).then(async(user) => {

            let dataQuery = {
                ticket_id: user._id,
                to: data.loginid,
                from:"ADMIN",
                message: req.body.message
            }




            let result = new TicketQuery(dataQuery)
            await result.save()


            res.send({ status: true, message: "Record inserted!", result: user });
        }).catch(err => {
            console.log(err)
            res.send({ status: false, message: "Something went wrong!" });
        })

    } catch (e) {
        console.log(e)
        res.send({ status: false, message: "Something went wrong!" });
    }
}


exports.listTicket = async (req, res, next) => {
    try {
        const reqBody = req.body;
        const Limit = reqBody.limit ? parseInt(reqBody.limit) : 10;
        const PageNo = reqBody.page ? parseInt(reqBody.page) : 0;

        let tickets = await Ticket.aggregate([
            { $match: { loginid: mongoose.Types.ObjectId(req.body.seller_id) } },
            { $lookup: { from: 'userlogins', localField: 'loginid', foreignField: '_id', as: 'seller' } },
            { $sort: { updated: -1 } },
            { $skip: (Limit * PageNo) },
            { $limit: Limit },
        ])
        if (tickets.length > 0) {
            res.send({ status: true, message: "Record found!", tickets, count: tickets.length });
        } else {
            res.send({ status: false, message: "Record not found" });
        }
    } catch (e) {
        console.log(e)
        res.send({ status: false, message: "Something went wrong!" });
    }
}

exports.listAllTickets = async (req, res, next) => {
    try {
        const reqBody = req.body;
        const Limit = reqBody.limit ? parseInt(reqBody.limit) : 10;
        const PageNo = reqBody.page ? parseInt(reqBody.page) : 0;
        const status = reqBody.status ? Number(reqBody.status) : "";

        const MATCH = {};
        if (status !== "") {
            MATCH.status = status;
        }

        let tickets = await Ticket.aggregate([
            { $lookup: { from: 'userlogins', localField: 'loginid', foreignField: '_id', as: 'seller' } },
            { $match: MATCH },
            { $sort: { updated: -1 } },
            { $skip: (Limit * PageNo) },
            { $limit: Limit },
        ])
        if (tickets.length > 0) {
            res.send({ status: true, message: "Record found!", tickets, counts: tickets.length });
        } else {
            res.send({ status: false, message: "Record not found" });
        }

    } catch (e) {
        console.log(e)
        res.send({ status: false, message: "Something went wrong!" });
    }
}

exports.ticketDetail = async (req, res, next) => {
    try {
        let tickets = await Ticket.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(req.body.ticket_id) } },
            { $lookup: { from: 'userlogins', localField: 'loginid', foreignField: '_id', as: 'seller' } }
        ])
        if (tickets.length > 0) {
            res.send({ status: true, message: "Record found!", result: tickets[0] });
        } else {
            res.send({ status: false, message: "Record not found" });
        }
    } catch (e) {
        console.log(e)
        res.send({ status: false, message: "Something went wrong!" });
    }
}

exports.updateTicketStatus = async (req, res, next) => {
    try {
        let ticket = await Ticket.findOne({ _id: req.body.ticket_id })
        if (ticket) {
            Ticket.updateOne({ _id: req.body.ticket_id }, { $set: { status: req.body.status } }).then(user => {
                res.send({ status: true, message: "Record updated!" });
            }).catch(err => {
                res.send({ status: false, message: "Something went wrong!" });
            })
        } else {
            res.send({ status: false, message: "Record not found" });
        }
    } catch (e) {
        console.log(e)
        res.send({ status: false, message: "Something went wrong!" });
    }
},
    exports.updateTicketResponse = async (req, res, next) => {
        try {
            let ticket = await Ticket.findOne({ _id: req.body.ticket_id })
            if (ticket) {
                Ticket.updateOne({ _id: req.body.ticket_id }, { $set: req.body }).then(user => {
                    res.send({ status: true, message: "Record updated!" });
                }).catch(err => {
                    res.send({ status: false, message: "Something went wrong!" });
                })
            } else {
                res.send({ status: false, message: "Record not found" });
            }
        } catch (e) {
            console.log(e)
            res.send({ status: false, message: "Something went wrong!" });
        }
    }

    , exports.ticketQueries = async (req, res, next) => {
        try {
            const {user_id, ticket_id} = req.body;
            console.log("user" , req.body)


            let tickets_messages = await TicketQuery.find( { $or:[ {'from':user_id}, {'to':user_id} ], ticket_id: ticket_id} );
            let user = await UserLogins.findOne({_id: user_id});
            let status 

            if(ticket_id !== undefined ){
                data = await Ticket.findOne({_id: ticket_id});
                status = data.status
            }else{
                status = 0;
            }
console.log(status);
            

            

            return res.json({ status: 200, tickets_messages: tickets_messages , user : user , status : status});
        } catch (e) {
            console.log(e)
            res.send({ status: false, message: "Something went wrong!" });
        }
    }

    , exports.getTickets = async (req, res, next) => {
        try {
            const { user_id } = req.body;
//   let tickets;
//   let ticketOne;
//   let ticketOneId;
//   Sortticket = await TicketQuery.find({ from: user_id });

//   console.log(Sortticket.length > 0);

//   if (Sortticket.length > 0) {
//     let sortReverse = Sortticket.reverse();

//     let arr = sortReverse.map((val) => {
//       return String(val.ticket_id);
//     });

//     let ticketsAll = await Ticket.find({ user_id: user_id });
//     let arr1 = ticketsAll.reverse().map((val) => {
//       return String(val._id);
//     });

//     let all_Tickets = [...arr, ...arr1];

//     const seen = new Set();
//     const filteredArr = all_Tickets.filter((el) => {
//       const duplicate = seen.has(el);
//       seen.add(el);
//       return !duplicate;
//     });

//     get_Tickets_order = await Promise.all(
//       filteredArr.map(async (ticket_id, index) => {
//         let tickets_notifications = await Ticket.findOne({ _id: ticket_id });
//         let data = tickets_notifications;

//         return data;
//       })
//     );

//     if (get_Tickets_order.length > 0) {
//       ticketOneId = get_Tickets_order[0]._id;
//     } else {
//       ticketOneId = "";
//     }
//   } else {
//     if (user_id != undefined || user_id != "") {
//       tickets = await Ticket.find({ user_id: user_id });
//       get_Tickets_order = tickets.reverse();

//       if (tickets.length > 0) {
//         ticketOneId = get_Tickets_order[0]._id;
//       }
//     }
//   }

let ticketsAll = await Ticket.find({ loginid: user_id });


  return res.json({
    status: 200,
    tickets: ticketsAll.reverse(),
    // ticketOne: ticketOneId, 
  });
        } catch (e) {
            console.log(e)
            res.send({ status: false, message: "Something went wrong!" });
        }
    }
 
    , exports.sendQuery = async (req, res, next) => {
        try {
            const {email , message ,ticket_id} = req.body;
            let findTicket = await Ticket.findOne({ _id: ticket_id });
            console.log("req.body ", findTicket); 
            if(findTicket.status === 0){
                res.send({ status: false, message: "Your Ticket closed by Admin" });
               return;
            }

     
            const TicketQueryList = new TicketQuery(req.body);
            await TicketQueryList.save();
            return res.json({ status: 200, message: 'Query Messsage has been generated successfully' });
        } catch (e) {
            console.log(e)
            res.send({ status: false, message: "Something went wrong!" });
        }
    }
    ,
    exports.closeTicket = async (req, res, next) => {
        try {
            const _id = req.params.id;
            await Ticket.findByIdAndUpdate(_id, {
              status: 0,
            });
            res.json({
              status: 200,
              message: "Ticket has been successfully closed",
            });
        } catch (e) {
            console.log(e)
            res.send({ status: false, message: "Something went wrong!" });
        }
    }

    , exports.getUserTickets = async (req, res, next) => {
        try {
            const { user_id } = req.body;
          let ticketsAll = await manage_caselog.find({ loginid: user_id });


  return res.json({
    status: 200,
    tickets: ticketsAll.reverse(),
  });
        } catch (e) {
            console.log(e)
            res.send({ status: false, message: "Something went wrong!" });
        }
    }

    ,
    exports.closeUserTicket = async (req, res, next) => {
        try {
            const _id = req.params.id;
            await manage_caselog.findByIdAndUpdate(_id, {
              status: 0,
            });
            res.json({
              status: 200,
              message: "Ticket has been successfully closed",
            });
        } catch (e) {
            console.log(e)
            res.send({ status: false, message: "Something went wrong!" });
        }
    }

    , exports.ticketUserQueries = async (req, res, next) => {
        try {
            const {user_id, ticket_id} = req.body;
            console.log("user" , req.body)
            

            let tickets_messages = await TicketQuery.find( { $or:[ {'from':user_id}, {'to':user_id} ], ticket_id: ticket_id} );
            let user = await  UserLogins.findOne({ $or: [{ email: user_id },{_id: user_id}] })
           
            let status 
 
            if(ticket_id !== undefined ){
                data = await manage_caselog.findOne({_id: ticket_id});
                status = data.status 
            }else{
                status = 0;
            }
console.log(status);
            

            

            return res.json({ status: 200, tickets_messages: tickets_messages , user : user , status : status});
        } catch (e) {
            console.log(e)
            res.send({ status: false, message: "Something went wrong!" });
        }
    }
    , exports.sendUserQuery = async (req, res, next) => {
        try {
            const {email , message } = req.body;
            console.log(req.body);
    
            const TicketQueryList = new TicketQuery(req.body);
            await TicketQueryList.save();
            return res.json({ status: 200, message: 'Query Messsage has been generated successfully' });
        } catch (e) {
            console.log(e)
            res.send({ status: false, message: "Something went wrong!" });
        }
    }