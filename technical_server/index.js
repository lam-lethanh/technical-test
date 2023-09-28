const express=require('express')
const app=express()
const port=3001;
const bodyParser=require('body-parser')

app.use(bodyParser.json())


const cors=require('cors')
app.use(
    cors({
      credentials: true,
      origin: ["http://localhost:3000"],
    })
  );
const result={result: 'ok'}

app.post('/post/v2', cors(), (req, res)=>{
    var result={}
    const sdk = require('api')('@scalapaydocs/v1.1#5ryqsdllosocp4');
    sdk.auth('Bearer qhtfs87hjnc12kkos');
    sdk.postV2Orders(req.body)
    .then(({ data }) => res.send(data))
    .catch(err => res.send(Error(err)));
})

app.listen(port, ()=>{
    console.log('Server running on port', port)
})