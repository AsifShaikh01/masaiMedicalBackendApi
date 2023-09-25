const express = require("express");
const {EmployeeModel} = require("../model/Employee.model");
const employeeRouter = express.Router();


employeeRouter.get("/employees" , async(req,res)=>{
    const {department,sort,search,page} = req.query;
    const perPage = 5;
    const skip = (page -1) * perPage;
    let query = {};

    if(department){
        query.department = department
    }
    if(search){
        query.firstName = new RegExp(search , "i")
    }
    
    let sortOptions = {};
    if(sort){
      const [field,order] = sort.split(':');
      sortOptions[field] = order === "asc" ? 1 : -1;
    }
    try {
        const employees = await EmployeeModel.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(perPage)
        res.send(employees);
        
    } catch (error) {
        res.send(error)
    }
})

employeeRouter.post("/employees" , async (req,res)=>{
    const payload = req.body;
    try {
        const employee = new EmployeeModel(payload);
        await employee.save();
        req.send("Employee has been added successfully!!")
        
    } catch (error) {
        res.send(error)
    }
})

employeeRouter.patch("/employees/:id" ,async(req,res)=>{
    const ID = req.params.id;
    const payload = req.body;
    try {
        await EmployeeModel.findByIdAndUpdate({_id:ID},payload);
        res.send("employee details updated successfully!")
        
    } catch (error) {
        req.send(error)
    }
})
employeeRouter.delete("/employees/:id" ,async(req,res)=>{
    const ID = req.params.id;
    
    try {
        await EmployeeModel.findByIdAndDelete({_id:ID});
        res.send("employee details deleted successfully!")
        
    } catch (error) {
        req.send(error)
    }
})

module.exports={
    employeeRouter
}