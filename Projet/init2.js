const {openDb} = require("./db")

const tablesNames = ["amis"]


async function createFriends(db){
  const insertRequest = await db.prepare("INSERT INTO amis (name) VALUES(?)")
  const friends = ["Remi", "Cyril", "Baptiste", "Jean-Michel"]
  return await Promise.all(friends.map(friendName => {
    return insertRequest.run([friendName])
  }))
}

async function createTables(db){
  const cat = db.run(`
    CREATE TABLE IF NOT EXISTS amis(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name varchar(255)
      );
  `)
  return await Promise.all([cat])
}


async function dropTables(db){
  return await Promise.all(tablesNames.map( tableName => {
      return db.run(`DROP TABLE IF EXISTS ${tableName}`)
    }
  ))
}

(async () => {
  // open the database
  let db = await openDb()
  await dropTables(db)
  await createTables(db)
  await createFriends(db)
})()
