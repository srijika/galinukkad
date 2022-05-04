const db = require('../_helper/db');
const Category = db.Category;
const UserLogins = db.UserLogins;
const accessTokenSecret = require('../config.json').jwd_secret;
var ROLES = require('../config.json').ROLES;
const jwt = require('jsonwebtoken');
const { Address } = require('../_helper/db');
var request = require('request');
var path = require('path');
var fs = require('fs');
const sharp = require('sharp');

notEmpty = (obj) => {
    let t = Object.keys(obj).filter(i => (obj[i] == undefined || obj[i].toString().length == 0));
    console.log("t", t)
    if (t.length > 0) {
        return false;
    } else {
        return true;
    }
};

module.exports = {
    cratecategory: async (req, res, next) => {

        let title = req.body.name;
        title = title.toLowerCase();
        req.body.slug = title.replace(" ", "_");
        const { slug, description, name, gst, commission } = req.body;
        if (!name || !slug || !description || !gst || !commission) {
            res.send({ status: false, message: "Required Parameter is missing" });
            return;
        }




        // IMAGE UPLOAD CODE
        const reqFiles = req.files;
        let filename;
        reqFiles.forEach(E => {
            var filePath = path.join(__dirname, '../public/categories/');
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath);
            }

            const fileUrl = filePath + E.filename;
            sharp(E.path).resize(300, 200).toFile(fileUrl, function (err) {
                if (err) {
                    console.log(err)
                }
            });

            filename = E.filename;
        });
        // IMAGE UPLOAD CODE END





        const data = await Category.find({ $or: [{ name: name }, { slug: slug }] });
        if (data.length > 0) {
            res.send({ status: false, message: "Category already exist" });
            return;
        }


        Category.create({ name, slug, description, gst, commission, image: filename,  created_at: new Date(), updated_at: new Date() }).then((data) => {
            res.send({ status: true, message: "Create Category Successfully" })
            return;
        }).catch((err) => {
            res.send({ status: false, message: err.message })
            return;
        });

    },

    updatecategory: async  (req, res, next) => {
        console.log(req.body);
        let title = req.body.name;

        title = title.toLowerCase();
        req.body.slug = title.replace(" ", "_");

        

        // IMAGE UPLOAD FOR EDIT START
        const reqFiles = req.files;
        let filename;
        console.log(reqFiles.length);
        if(reqFiles.length > 0) {

            var filePath = path.join(__dirname, '../public/categories/');
            
            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath);
            }

            // FOR IMAGE DELETE START
            let category_image = await Category.findById(req.body._id);
            let delete_image =  path.join(__dirname, `../public/categories/${category_image.image}`);
            try {
                fs.unlink(delete_image, function (err) {
                    console.log("File deleted!");
                });
            } catch (err) {
                console.log(err);
            }
            // FOR IMAGE DELETE END


            const fileUrl = filePath + reqFiles[0].filename;
            sharp(reqFiles[0].path).resize(300, 200).toFile(fileUrl, function (err) {
                if (err) {
                    console.log(err)
                }
            });
            filename = reqFiles[0].filename;
        }
        // IMAGE UPLOAD FOR EDIT END

        const { slug, description, name, _id, gst, commission } = req.body;
        if (!slug || !description || !name || !_id || !gst || !commission) {
            res.send({ status: false, message: "Required Parameter is missing" });
            return;
        }

        Category.findOne({ _id: _id }).then((data) => {
            //console.log(data)
            // res.send(data)
            //return;
            
            if (data && data._id) {
                Category.update({ _id: _id }, { $set: { name: name, slug: slug, description: description, gst: gst, commission: commission, image: filename }, updated_at: new Date() }).then((data) => {
                    res.send({ status: true, message: "Category Update Successfully" })
                    return;
                }).catch((err) => {
                    res.send({ status: false, message: err.errmsg })
                    return;
                });
            } else {
                res.send({ status: false, message: "Category doesn't exist" })
            }
        });



    },

    getCategory: (req, res, next) => {
        const { slug } = req.body;
        Category.findOne({ slug: slug }).then((data) => {

            if (data && data._id) {

                console.log(data);

                res.send({ status: true, data })
            } else {
                res.send({ status: false, message: "Category not found" })
            }
        });
    },

    getSubCatByCategory: (req, res, next) => {
        Category.aggregate([
            {
                $lookup:
                {
                    from: "sub_categories",
                    localField: "_id",
                    foreignField: "parent_category",
                    as: "subCategories"
                }
            }
        ]).then((data) => {
            if (data.length > 0) {
                res.send({ status: true, data })
            } else {
                res.send({ status: false, message: "Not created yet" });
            }
        });
    },

    getCategoryaAll: async (req, res, next) => { 
        try {
            const reqBody = req.body;

            const Limit = reqBody.limit ? parseInt(reqBody.limit) : 100;
            const PageNo = reqBody.page ? parseInt(reqBody.page) : 0;


            const count = await Category.count();
            const data = await Category.find().sort({ updated_at: -1 }).skip(Limit * PageNo).limit(Limit);
            // const data = await Category.find().select('name slug description gst commission').skip(Limit * PageNo).limit(Limit);
            let seller = await UserLogins.find({ roles : "SELLER" });
            return res.send({ status: true, data, count , seller });

        } catch (error) {
            return res.send({ status: false, message: error.message });
        }
        // Category.find().then((data) => {
        //     res.send({ status: true, data })
        // });
    },

    deletecat: (req, res, next) => {
        const { _id } = req.body;

        if (!_id) {
            return res.send({ status: false, message: 'Id is required' })
        }
        Category.deleteOne({ _id: _id }).then((data) => {
            res.send({ status: true, data })
        }).catch(err => {
            res.send({ status: false, message: err.message })
        });
    },
}
