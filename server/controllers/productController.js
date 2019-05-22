var ProductModel = require('../models/productModel');
var UploadsModel = require('../models/uploadsModel');
const chalk = require('chalk');
import _ from 'lodash';

module.exports = {
    addNewProduct : function (req,res){
        const { 
            productTitle, 
            productPrice, 
            productDescription, 
            productSize,
            productFeatured,
            productVisible
        } = req.body;
        const uploads = [];
        _.forEach(req.files, file => {
            uploads.push(file.filename);
        });
        ProductModel.addNewProduct({productTitle, productPrice, productDescription, productSize,productFeatured,productVisible})
        .then((productId)=>{
            UploadsModel.addNewUploads(uploads,productId)
            .then(()=>{
                res.sendStatus(200);
            })
            .catch((err)=>{
                console.log(chalk.red(err));    
            })
        })
        .catch((err)=>{
            console.log(chalk.red(err));    
        })
    },
    fetchProducts : async function (req,res){
        let results = await ProductModel.fetchAllProducts();
        let productsData = [];
        
        for(const result of results){
            let product = {}
            
            product.productId = result.productId;
            product.productTitle = result.productTitle;
            product.productPrice = result.productPrice;
            product.productDescription = result.productDescription;
            product.productSize = result.productSize;
            product.uploads = [];
            
            let uploads = await UploadsModel.fetchUploadsByProductId(result.productId);
            
            for(var i=0;i<uploads.length;i++){
                product.uploads.push(uploads[i].uploadPath)
            }
            productsData.push(product)
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(productsData));
    },
    fetchAllProductsById : async function(req,res){
        let id = req.params.id;
        let result = await ProductModel.fetchProductById(id);
        result = result[0];
        
        let product = {}
        product.productId = result.productId;
        product.productTitle = result.productTitle;
        product.productPrice = result.productPrice;
        product.productDescription = result.productDescription;
        product.productSize = result.productSize;
        product.uploads = [];
        
        let uploads = await UploadsModel.fetchUploadsByProductId(id);
        for(var i=0;i<uploads.length;i++){
            product.uploads.push(uploads[i].uploadPath)
        }
        
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(product));
    },
    fetchProductsByQuery : async (req,res)=>{
        let searchQuery = req.params.search;
        let results = await ProductModel.fetchProductsByKeywords(searchQuery);
        let productsData = [];
        console.log(results);
        for(const result of results){
            let product = {}
            
            product.productId = result.productId;
            product.productTitle = result.productTitle;
            product.productPrice = result.productPrice;
            product.productDescription = result.productDescription;
            product.productSize = result.productSize;
            product.uploads = [];
            
            let uploads = await UploadsModel.fetchUploadsByProductId(result.productId);
            
            for(var i=0;i<uploads.length;i++){
                product.uploads.push(uploads[i].uploadPath)
            }
            productsData.push(product)
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(productsData));
    }
}