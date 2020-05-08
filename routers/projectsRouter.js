const express = require('express');
const server = express();
const router = express.Router();
const actionsRouter = require('./actionsRouter');
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

router.post('/', validateProject, (req,res) =>{
    
})

router.put('/:id', validateProjectId, validateProject, (req,res) =>{
    
})

router.delete('/:id', validateProjectId, (req,res) =>{
    
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

}

module.exports = router;