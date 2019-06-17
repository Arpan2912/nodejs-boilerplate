//put all queries here
module.exports = {
  "qGetUserDetail": `select * from "users" where email=:email`,

  "qCreateUser": `insert into "users" 
  (u_uuid,first_name,last_name,email,phone,password,salt,city,state,country,address,user_type,google_id,created_at,updated_at,last_login) 
    values (:u_uuid,:first_name,:last_name,:email,:phone,:password,:salt,:city,:state,:country,:address,:user_type,:google_id,:created_at,:updated_at,:last_login) returning *`,

  "qCreateUserToken": `insert into user_tokens (u_uuid,user_id,token,type,created_at,updated_at) 
  values (:u_uuid,:user_id,:token,:type,:created_at,:updated_at) returning *`,

  "qGetTokenDetail": `select * from "user_tokens" where token=:token and type=:type`,

  "qUpdateUser": (replacement) => {
    let q = `update "users" `
    if (replacement.is_active) {
      q += ` set is_active=:is_active`
    }

    if (replacement.where_id) {
      q += ` where id=:where_id`
    }
    return q;
  },

  "qDeleteUserToken": `delete from "user_tokens" where token=:token`
}