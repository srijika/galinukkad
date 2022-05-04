const mongoose = require('mongoose');
const db = require('../_helper/db');
const Unit = db.Unit
const Schema = mongoose.Schema;


module.exports = {

    listUnit: async (req, res, next) => {
        try {
            const unit = await Unit.find({});
            res.json({ status: true, unit: unit });
        }catch(e) {
            console.log(e);
            res.send({ status: false, err: "An Error Occured" })
        }
    },

    createUnit: async (req, res, next) => {

        console.log(req.body);


        try {
            
            let {name} = req.body;
            let findunit = await Unit.findOne({ name: name });
            if(findunit != null) {
                return res.json({ status: false, message: 'Please enter unique unit name' });    
            }
            
            const unitsData = new Unit(req.body);
            await unitsData.save();

            res.json({ status: true, message: 'unit has been successfully added' });
        }catch(e) {
            console.log(e);
            res.send({ status: false, err: "An Error Occured" })
        }
    },

    editUnit: async (req, res, next) => {

        let unit_id =  req.params.id;
        try {
            
            let unit = await Unit.findByIdAndUpdate(unit_id, req.body);
            res.json({
                status:true,
                unit: unit
            });

        }catch(e) {
            console.log(e);
            res.send({ status: false, err: "An Error Occured" })
        }
    },


    updateUnit: async (req, res, next) => {
        let unit_id =  req.params.id;

        try {
            let {name} = req.body;
            // console.log(unit_id);
            // let findunit = await  Unit.find({ _id: unit_id, name: { $ne: name }});
            // // name: name , 
            // console.log(findunit);
            // if(findunit) {
            //     return res.json({ status: false, message: 'Please enter unique unit name' });    
            // }

            await Unit.findByIdAndUpdate(unit_id, req.body);
            res.json({
                status:true,
                message: 'unit has been successfully updated'
            });
        }catch(e) {
            console.log(e);
            res.send({ status: false, err: "An Error Occured" })
        }
    },

    deleteUnit: async (req, res, next) => {
        console.log(req.body);  
        let unit_id =  req.params.id;

        try {
            await Unit.findByIdAndDelete(unit_id);
            res.json({
                status:true,
                message: 'Unit has been successfully deleted'
            });
        }catch(e) {
            console.log(e);
            res.send({ status: false, err: "An Error Occured" })
        }
    },

}
