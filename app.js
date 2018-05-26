
var express = require("express"),
app = express(),
methodOverride = require("method-override"),
bodyParser = require("body-parser"),
mongoose = require("mongoose");

// APP CONFIG

mongoose.connect("mongodb://localhost/todo_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


// MODEL CONFIG - MONGOOSE
var todoSchema = new mongoose.Schema({
    title: String,
    level: String,
    currentProgress: String,
    location: String,
    description: String,
    created: {
        type: Date, 
        default: Date.now}
    
});

var Todo = mongoose.model("Todo" , todoSchema);


//  QUERIES

/*
app.get("/todos/sorting", function(req,res){
    
   // find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
    Todo.find({ 'level': 'Highly Important' }, function (err, todos) {
    if (err) {
        return console.log("err");
        
    }
        
    else{
    // Prints "Space Ghost is a talk show host".
    res.render("index", {todos: todos});
    console.log(todos.title, todos.currentProgress);
   
    }
    }); 
   
});

   */



// ROUTES
//INDEX ROUTES
app.get("/", function(req, res){
   res.redirect("/todos"); 
});

app.get("/todos", function(req,res){
    Todo.find({}, function(err, todos){
        if(err){
            console.log("Error!");
        }
        else {
            res.render("index", {todos: todos});
        }
    });
});




//NEW ROUTE

app.get("/todos/new", function(req,res){
    res.render("new");
})
//CREATE ROUTE

app.post("/todos", function(req,res){
   // Create todo
   Todo.create(req.body.todo, function(err,newTodo){
       if(err){
           res.render("new");
       }
       else{
        //then, redirect to the index
           res.redirect("/todos");
       }
   });
});

//SHOW ROUTE
app.get("/todos/:id", function(req,res){
    Todo.findById(req.params.id, function(err, foundTodo){
        if(err){
            res.redirect("/todos");
        }
        else{
            res.render("show", {todo: foundTodo});
        }
    })
});

//EDIT ROUTE
app.get("/todos/:id/edit", function(req,res){
    Todo.findById(req.params.id, function(err,foundTodo){
        if(err){
            res.redirect("/todos");
        }
        else{
            res.render("edit", {todo: foundTodo});
        }
        
    });
});

//UPDATE ROUTE
app.put("/todos/:id", function(req,res){
    Todo.findByIdAndUpdate(req.params.id, req.body.todo, function(err, updatedTodo){
       if(err){
           res.redirect("/todos");
       } 
       else{
           res.redirect("/todos/" + req.params.id);
       }
    });
});

//DELETE ROUTE
app.delete("/todos/:id", function(req,res){
    Todo.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/todos");
        }
        else{
            res.redirect("/todos");
        }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("everything works!");
});




