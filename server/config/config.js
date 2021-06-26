//puerto globar
process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
process.env.CADUCIDAD_TOKEN = '48h';
process.env.SEED = process.env.NODE_ENV || 'este-es-el-seed-desarrollo';


let url;
if (process.env.NODE_ENV === 'dev') {
    url = 'mongodb://localhost:27017/cafe'
} else {
    url = process.env.MONGO_URI
}
process.env.URLDB = url;