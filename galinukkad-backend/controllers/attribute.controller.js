const mongoose = require('mongoose');
const db = require('../_helper/db');
const Attribute = db.Attribute
const Schema = mongoose.Schema;


module.exports = {

    listAttribute: async (req, res, next) => {
        try {
            const attribute = await Attribute.find({});
            res.json({ status: true, attribute: attribute });
        }catch(e) {
            console.log(e);
            res.send({ status: false, err: "An Error Occured" })
        }
    },

    createAttribute: async (req, res, next) => {

        try {

            let {name} = req.body;
            let findAttribute = await Attribute.findOne({ name: name });

            if(findAttribute) {
                return res.json({ status: false, message: 'Please enter unique attribute name' });    
            }

            const attributesData = new Attribute(req.body);
            await attributesData.save();

            res.json({ status: true, message: 'Attribute has been successfully added' });
        }catch(e) {
            console.log(e);
            res.send({ status: false, err: "An Error Occured" })
        }
    },

    editAttribute: async (req, res, next) => {

        let attribute_id =  req.params.id;
        try {
            
            let attribute = await Attribute.findByIdAndUpdate(attribute_id, req.body);
            res.json({
                status:true,
                attribute: attribute
            });

        }catch(e) {
            console.log(e);
            res.send({ status: false, err: "An Error Occured" })
        }
    },


    updateAttribute: async (req, res, next) => {
        let attribute_id =  req.params.id;

        try {
            let {name} = req.body;
            // console.log(attribute_id);
            // let findAttribute = await  Attribute.find({ _id: attribute_id, name: { $ne: name }});
            // // name: name , 
            // console.log(findAttribute);
            // if(findAttribute) {
            //     return res.json({ status: false, message: 'Please enter unique attribute name' });    
            // }

            await Attribute.findByIdAndUpdate(attribute_id, req.body);
            res.json({
                status:true,
                message: 'Attribute has been successfully updated'
            });
        }catch(e) {
            console.log(e);
            res.send({ status: false, err: "An Error Occured" })
        }
    },

    deleteAttribute: async (req, res, next) => {
        console.log(req.body);  
        let attribute_id =  req.params.id;

        try {
            await Attribute.findByIdAndDelete(attribute_id);
            res.json({
                status:true,
                message: 'Announcement has been successfully deleted'
            });
        }catch(e) {
            console.log(e);
            res.send({ status: false, err: "An Error Occured" })
        }
    },

}
