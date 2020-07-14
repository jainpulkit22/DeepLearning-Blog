var express= require('express')
var methodOverride = require('method-override')
var app = express()
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var expressSanitizer = require('express-sanitizer')
app.use(bodyParser.urlencoded({extended: true}))
app.use(expressSanitizer())
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(methodOverride("_method"))
mongoose.connect("mongodb://localhost/restful_blog_app")
var blogschema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})
var Blog = mongoose.model("Blog", blogschema)
/*Blog.create({
    title: "AI",
    image: "https://miro.medium.com/proxy/1*uQdZlvHn4rb4boX0_VBIVw.jpeg",
    body: "My test blog on Artificial intelligence"
}, function(err,res){
    if(err)
        console.log("Something Went Wrong!")
})*/

app.get("/blogs", function(req,res){
    Blog.find({}, function(err, result){
        if(err)
            console.log("Something went wrong!")
        else
            res.render("index", {blogs: result})
    })
})
app.get("/", function(req,res){
    res.redirect("/blogs")
})
app.get("/blogs/new", function(req,res){
    res.render("new")
})
app.post("/blogs", function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, function(err,result){
        if(err)
            res.render("new")
        else
            res.redirect("/blogs")
    })
})
app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err, result){
        if(err)
            res.render("/blogs")
        else
            res.render("show", {blog: result})
    })
})
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err,result){
        if(err)
            res.redirect("/blogs")
        else
            res.render("edit", {blog: result})
    })
})
app.put("/blogs/:id", function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, result){
        if(err)
            res.redirect("/blogs")
        else
            res.redirect("/blogs/" + req.params.id)
    })
})
app.delete("/blogs/:id", function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err)
            res.redirect("/blogs")
        else
            res.redirect("/blogs")
    })
})
app.listen(3000, function(){
    console.log("Blog has started!")
})