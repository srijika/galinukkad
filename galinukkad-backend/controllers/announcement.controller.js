const db = require('../_helper/db');
const Announcement = db.Announcement
const Frequently_Asked_Question = db.Frequently_Asked_Question


notEmpty = (obj) => {
    let t = Object.keys(obj).filter(i => (obj[i] == undefined || obj[i].toString().length == 0));
    if (t.length > 0) {
        return false;
    } else {
        return true;
    }
};

module.exports = {

    listAnnouncement: async (req, res, next) => {
        
        try {
            const announcements = await Announcement.find({});
            res.json({ status: true, announcements: announcements });
        }catch(e) {
            // console.log(e);
            res.send({ status: false, err: "An Error Occured" })
        }
    },

    createAnnouncement: async (req, res, next) => {
        // console.log(req.body);  
        try {
            const announcementData = new Announcement(req.body);
            let annnouncement = await announcementData.save();
            res.json({
                status: true,
                message: 'Announcement has been successfully added'
            });
        }catch(e) {
            // console.log(e);
            res.send({ status: false, err: "An Error Occured" })
        }
    },

    editAnnouncement: async (req, res, next) => {
        console.log(req.body);  

        let announcement_id =  req.params.id;
        try {
            
            let announcement = await Announcement.findByIdAndUpdate(announcement_id, req.body);
            res.json({
                status:true,
                announcement: announcement
            });

        }catch(e) {
            // console.log(e);
            res.send({ status: false, err: "An Error Occured" })
        }
    },


    updateAnnouncement: async (req, res, next) => {
        // console.log(req.body);  

        let announcement_id =  req.params.id;

        try {
            await Announcement.findByIdAndUpdate(announcement_id, req.body);
            res.json({
                status:true,
                message: 'Announcement has been successfully updated'
            });
        }catch(e) {
            // console.log(e);
            res.send({ status: false, err: "An Error Occured" })
        }
    },

    deleteAnnouncement: async (req, res, next) => {
        // console.log(req.body);  
        let announcement_id =  req.params.id;

        try {
            await Announcement.findByIdAndDelete(announcement_id);
            res.json({
                status:true,
                message: 'Announcement has been successfully deleted'
            });
        }catch(e) {
            // console.log(e);
            res.send({ status: false, err: "An Error Occured" })
        }
    },

    changeStatusAnnoucement: async (req, res, next) => {
        // console.log(req.body);  
        let announcement_id =  req.params.id;

        try {

            // console.log(announcement_id);

            await Announcement.update(
                { "_id": announcement_id, }, 
                [
                    {
                      "$set": {
                        "status": {
                          "$cond": {
                            if: {
                              $eq: [
                                "$isRequired",
                                1
                              ]
                            },
                            then: "0",
                            else: "1"
                          }
                        }
                      }
                    }
                  ]
            )

            console.log('updated success');
            // await Announcement.findByIdAndUpdate(announcement_id);

            res.json({
                status:true,
                message: 'Announcement has been successfully deleted'
            });
        }catch(e) {
            // console.log(e);
            res.send({ status: false, err: "An Error Occured" })
        }
    },


    getAnnouncementForCustomer: async (req,res) => {
        try {
            let announcement = await Announcement.findOne({ for_customer: true, status: '1' }).select('message').sort({'updatedAt': -1});
            return res.send({ status: true, announcement: announcement });
        }catch(e) {
            // console.log(e);
            return res.send({ status: false, err: "An Error Occured" })
        }

    },

    getAnnouncementForSeller: async (req,res) => {
        try {
            let announcement = await Announcement.findOne({ for_seller: true, status: '1' }).select('message').sort({'updatedAt': -1});
            return res.send({ status: true, announcement: announcement });
        }catch(e) {
            // console.log(e);
            return res.send({ status: false, err: "An Error Occured" })
        }

    }, 

    getFaqs: async (req, res, next) => {
        console.log('get faqs data');
        console.log('get faqs data');

        try {

            // await HtmlPages.findByIdAndUpdate(Id, { isActive: isActive }).lean().exec();

            let faqs =  await Frequently_Asked_Question.find({});
            return res.send({ status: true, faqs: faqs });

        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
    }

    

}
