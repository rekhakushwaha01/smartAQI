const express = require('express');
const multer=require('multer');
const postModel = require('./models/post.model');
const uploadFile=require('./services/storage.service')
const app = express();
// app.get('/', (req, res) => {
//     res.send("Hello World");
// })
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() })
app.post('/create-post', upload.single('image'), async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    const result = await uploadFile(req.file.buffer);
    const post = await postModel.create({
        image: result.url,
        caption: req.body.caption
    })
    res.status(201).json({
        message: "Post created successfully",
   post
    })
})
app.get('/posts', async (req, res) => {
    const posts = await postModel.find()
    return res.status(201).json({
        message: 'post fetced successfully',
        posts
    })
})

module.exports = app;