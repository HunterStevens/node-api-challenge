const express = require('express');
const router = express.Router();
const actionsDb = require('../data/helpers/actionModel');
const projectDb = require('../data/helpers/projectModel');

router.get('/:id', validateActionId, (req,res) =>{
    res.status(200).json(req.user);
})

router.post('/:id', validateProjectId, validateAction, (req,res) =>{
    const {id} = req.user;
    const newAction = req.body;
    newAction.project_id = id;
    actionsDb.insert(newAction)
    .then(proj =>{
        projectDb.getProjectActions(id)
    })
    .catch(err =>{
        res.status(500).json({message:"There was an internal error while creating an action",
        error:err
        });
    })
})

router.put('/:id', validateActionId, validateAction, (req,res) =>{
    const {id} = req.user;
    actionsDb.update(id, req.body)
    .then(proj =>{
        res.status(200).json(proj);
    })
    .catch(err =>{
        res.status(500).json({message:"There was an internal error while updating a Project",
        error:err
        });
    })
})

router.delete('/:id', validateActionId, (req,res) =>{
    const {id} = req.params;
    actionsDb.remove(id)
    .then(proj =>{
        console.log(proj);
        projectDb.get()
        .then(list =>{
            res.status(200).json(list);
        })
        .catch(err =>{
            res.status(500).json({message:"There was an internal error retrieving the data after deleting a project",
            error:err
            })
        })
    })
    .catch(err =>{
        Console.log(err);
        res.status(500).json({message:"There was an internal error while deleting a Project",
        error:err
        });
    })
})

function validateProjectId(req,res,next){
    const {id} = req.params;
    projectDb.get(id)
    .then(proj =>{
        if(proj === null){
            res.status(404).json({message:"the project with that ID doesn't exist."})            
        }else{
            req.user = proj;
            next();
        }
    })
    .catch(err =>{
        res.status(500).json({message:"There was an internal error retrieving the Project",
        error:err
        }) 
    })
}

function validateActionId(req,res,next){
    const {id} = req.params;
    actionsDb.get(id)
    .then(proj =>{
        if(proj === null){
            res.status(404).json({message:"the project with that ID doesn't exist."})            
        }else{
            req.user = proj;
            next();
        }
    })
    .catch(err =>{
        res.status(500).json({message:"There was an internal error retrieving the Project",
        error:err
        }) 
    })
}
function validateAction(req,res,next){
    const {description, notes} = req.body;
    if(!description || !notes || description === "" || notes === ""){
        res.status(404).json({ message: "missing required notes and description field" });
    }
    else{
        next();
    }
}

module.exports = router;