const expess = require('express')
const config = require('config')
const path = require('path')
const mongoose =  require('mongoose')

const app = expess()


app.use(expess.json({extended: true}))

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link', require('./routes/link.routes'))
app.use('/t', require('./routes/redirect.routes'))

app.use('/test', require('./routes/test.routes'))
app.use('/api/casino', require('./routes/casino.routes'))
app.use('/api/balance', require('./routes/balance.routes'))
app.use('/api/coefficient', require('./routes/coefficient.routes'))


if (process.env.NODE_ENV === 'production'){
    app.use('/',  expess.static(path.join(__dirname, 'client', 'build')))

    app.get('*', (req, res)=>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

const PORT = config.get('port') || 5000

async function start(){
    try{
await mongoose.connect(config.get('mongoUri'),{
useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
        app.listen(PORT, ()=>console.log(`app has been started on port ${PORT}...`))
    } catch(e){
        console.log('server error: ', e.message)
        process.exit(1)
    }
}

start()
