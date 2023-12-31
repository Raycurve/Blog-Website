//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');


const homeStartingContent = "Welcome! This is a blog site made using EJS, Express and NodeJS with other packages like lodash,body-parser,etc, you can compose your blogs which get added to the home page and can click through all the blogs. The use of routing is done quite well in this project. A bit of bootstrap is used too!"
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const a1 ="Today was an incredible day of exploration. I visited the historic city with its ancient architecture and fascinating landmarks. The narrow cobblestone streets were filled with the charm of the past. I walked through the bustling marketplaces, tasting local delicacies and soaking in the vibrant atmosphere. The grand cathedral left me in awe with its intricate details and stained glass windows. As the day came to an end, I found myself reflecting on the rich history and stories that this city holds. It was an enriching experience that I will cherish forever";
const a2 = "Today was a day of tranquility and serenity. I ventured into the heart of nature, exploring lush green forests and crystal-clear streams. The chirping of birds and the rustling of leaves provided a soothing soundtrack. I hiked up a picturesque trail that led to a breathtaking viewpoint, offering panoramic vistas of the surrounding landscapes. The air was fresh and invigorating, revitalizing my spirit. Nature has a way of reminding us of its beauty and the importance of preserving it. I returned to my cozy cabin, feeling rejuvenated and grateful for the wonders of the natural world.";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect('mongodb://127.0.0.1:27017/BlogDB');

const postSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Post = mongoose.model("posts", postSchema);




// var posts = [{title:"Exploring the Historic City", content:a1},{title:"A Nature Retreat",content:a2}];

app.get("/",(req,res)=>{
  Post.find({}).then((posts)=>{
    // console.log(posts);
    if(posts.length == 0){
      const day1 = new Post({
        title:"Exploring the Historic City",
        content:a1
      })

      const day2 = new Post({
        title:"A Nature Retreat",
        content: a2
      })
      day1.save()
      .then(
        day2.save()
        .then(()=>{
          console.log("saved");
          res.redirect("/");
        })
      );
    }
    else{
      res.render('home',{home: homeStartingContent, pos:posts});
    }
  })
})

app.get("/about",(req,res)=>{
  res.render('about');
})

app.get("/compose",(req,res)=>{
  res.render('compose');
})

app.post("/compose",(req,res)=>{
  const post = new Post({
    title: req.body.title,
    content: req.body.post
  });
  post.save()
  .then(()=>{
    res.redirect("/");
  })
  // posts.push(post);
  // console.log(posts);

})

app.get("/posts/:title",(req,res)=>{
  console.log(req.params.title);
  // const postNames = posts.map(post => post.title.toLowerCase())

  Post.findOne({title:{ $regex: req.params.title, $options: "i" }})
  .then((post)=>{
    if(post){
      res.render('post',{title: post.title, content : post.content});
    }
    else{
      console.log("not found");
      res.redirect("/");
    }
  })
  //
  // posts.forEach((p)=>{
  //   if(p.title.toLowerCase() == _.lowerCase(req.params.title)){
  //     // console.log("match");
  //     res.render('post',{
  //       title: p.title,
  //       content: p.content
  //     });
  //   }
  // }
// )

})










app.listen(3000, function() {
  console.log("Server started on port 3000");
});
