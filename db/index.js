
const Sequelize = require('sequelize');
let db = {};

//local
console.log(process.env.DB_NAME, process.env.DB_USERNAME);
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT
});

sequelize
  .authenticate()
  .then((con) => {
    console.log('Connection has been established successfully.', con);
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


db.sequelize = sequelize;
db.Sequelize = sequelize;

module.exports = db;

/*
npx sequelize-cli model:generate --name user --attributes first_name:string,last_name:string,email:string,phone:string,password:string,salt:string,city:string,state:string,country:string,address:string,user_type:string,google_id:string,is_active:boolean,is_deleted:boolean,created_at:date,updated_at:date,last_login:date

npx sequelize-cli model:generate --name event --attributes u_uuid:uuid,title:string,user_id:integer,event_date:date,event_start_time:date,event_end_time:date,container:integer,location:json,timezone:string,date_format:string,time_format:string,homepage:string,description:string,upcoming:boolean,featured:boolean,is_secure:boolean,is_active:boolean,is_deleted:boolean,created_at:date,updated_at:date

npx sequelize-cli model:generate --name container --attributes u_uuid:uuid,name:string,user_id:integer,is_active:boolean,is_deleted:boolean,created_at:date,updated_at:date

npx sequelize-cli model:generate --name feature --attributes u_uuid:uuid,name:string,description:string,is_active:boolean,is_deleted:boolean,created_at:date,updated_at:date

npx sequelize-cli model:generate --name event_menu --attributes u_uuid:uuid,alias:string,event_id:integer,feature_id:integer,is_active:boolean,is_deleted:boolean,created_at:date,updated_at:date

npx sequelize-cli model:generate --name agenda --attributes u_uuid:uuid,event_id:integer,user_id:integer,start_date_time:date,duration:string,venue:string,description:string,is_active:boolean,is_deleted:boolean,created_at:date,updated_at:date

*/