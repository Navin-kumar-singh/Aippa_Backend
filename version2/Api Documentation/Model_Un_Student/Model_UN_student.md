## Model UN STUDENT Participation


### Get All Student Participates (GET.request())

```javascript
apiJson.get('api/v2/modelUn-student/getAllParticipates')
.then((res)=>{
    setArray(res.data.allParticipates) // changes this by your array
}).catch((error)=>{
    console.log(error)
})
```

### Institute Registration (POST.reqeust)

```javascript
const data = {
       studentId,
        instituteId,
        model_un_register_id,
        committeeId,
}
apiJson.post('api/v2/modelUn-student/participate',data)
.then((res)=>{
    console.log("show data", res.data.participate)
}).catch((error)=>{
    console.log(error)
})
```
