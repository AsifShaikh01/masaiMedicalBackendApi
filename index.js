const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors")
const {userRouter} = require("./routes/User.routes")
const {employeeRouter} = require("./routes/Employee.routes");
const {connection} = require("./config/db")

const app = express();
app.use(cors())

app.use(express.json());
app.use("/api" , userRouter);
app.use("/api",employeeRouter);

app.listen(process.env.PORT , async()=>{
    try {
        await connection;
        console.log("connected to th db!!")
    } catch (error) {
        console.log("can't connect!!")
    }
    console.log(`server is running at port ${process.env.PORT}`)
})