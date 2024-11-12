import { Router } from "express";
import { Getpost } from "../controllar/postControllar.js";


const PostRoute =  Router()

PostRoute.get('/getallpost' ,Getpost )

export default PostRoute