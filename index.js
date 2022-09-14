const express = require('express');
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const userRoute = require("./routes/users");
const productRoute = require("./routes/products");
const CartRoute = require("./routes/cart");
app.use(cors({
    origin:"*"
}));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB Connection Successfull"))
  .catch((err) => {
    console.error(err);
  });

  //middleware
  app.use(express.json());
  app.get("/", (req, res) =>
  res.send(`Ecommerce Server Running`)
)
app.use("/server/users",userRoute);
app.use("/server/products",productRoute);
app.use("/server/addtocart",CartRoute);

app.listen(process.env.PORT||8800  ,()=>{
    console.log("Backend server is runing");
  })