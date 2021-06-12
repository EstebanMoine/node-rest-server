//puerto globar
process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


let url;
if (process.env.NODE_ENV === 'dev') {
    url = 'mongodb://localhost:27017/cafe'
} else {
    url = 'mongodb+srv://esteban:VDdu5Y6pdQxfGyvo@cluster0.vg1fn.mongodb.net/cafe'
}
process.env.URLDB = url;