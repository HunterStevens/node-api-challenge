const express = require('express');
const router = express.Router();
const projectDb = require('../data/helpers/projectModel');

router.get('/', (req,res) =>{
    projectDb.get()
    .then(list =>{
        res.status(200).json(list);
    })
    .catch(err =>{
        res.status(500).json({message:"There was an internal error retrieving the data",
        error:err
        })
    })
})

router.get('/:id', validateProjectId, (req,res) =>{
    res.status(200).json(req.user);
})

router.get('/:id/actions', validateProjectId, (req,res) =>{
    const {id} = req.user;
    projectDb.getProjectActions(id)
    .then(list =>{

    })
    .catch(err =>{

    })
})

router.post('/', validateProject, (req,res) =>{
    projectDb.insert(req.body)
    .then(proj =>{
        res.status(200).json(proj);
    })
    .catch(err =>{
        res.status(500).json({message:"There was an internal error while creating a Project",
        error:err
        });
    })
})

router.put('/:id', validateProjectId, validateProject, (req,res) =>{
    const {id} = req.user;
    projectDb.update(id, req.body)
    .then(proj =>{
        res.status(200).json(proj);
    })
    .catch(err =>{
        res.status(500).json({message:"There was an internal error while updating a Project",
        error:err
        });
    })
})

router.delete('/:id', validateProjectId, (req,res) =>{
    const {id} = req.params;
    projectDb.remove(id)
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
        // if({proj}){
        //     req.user = proj;
        //     next();
        // }else{
        //     res.status(404).json({message:"the project with that ID doesn't exist."})
        // }
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
function validateProject(req,res,next){
    const {name, description} = req.body;
    if(!name || !description || name === "" || description === ""){
        res.status(404).json({ message: "missing required name and description field" });
    }
    else{

        next();
    }
}

module.exports = router;