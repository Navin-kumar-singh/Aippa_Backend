## Model UN INSTITUTE Registration


### Get All Committee (GET.request())

```javascript
apiJson.get('api/v2/modelUn-institute/getcommittee')
.then((res)=>{
    setArray(res.data.getCommittee)
}).catch((error)=>{
    console.log(error)
})
```

### Institute Registration (POST.reqeust)

```javascript
const data = {
       event_type,
    format,
    event_theme,
    sub_theme,
    last_date,
    date_proposed,
    slectedCommittee,
}
apiJson.post('api/v2/modelUn-institute/register/:instituteId',data)
.then((res)=>{
    console.log("show data", res.data.munRegister, res.data.create)
}).catch((error)=>{
    console.log(error)
})


```
