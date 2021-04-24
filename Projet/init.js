const {openDb} = require("./db")

const tablesNames = ["categories","posts","userdata", "commentaires"]



async function createCategories(db){
  const insertRequest = await db.prepare("INSERT INTO categories(cat_name) VALUES(?)")
  const names = ["Categorie 1", "Categorie 2"]
  return await Promise.all(names.map(cat => {
    return insertRequest.run(cat)
  }))
}

async function createUserdata(db){
  const insertRequest = await db.prepare("INSERT INTO userdata(username,password) VALUES(?, ?)")
  const data = [{
    username:"username",
    password: "password",
   },
    {
     username:"admin",
     password: "admin",
    }
  ]
  return await Promise.all(data.map(users => {
    return insertRequest.run([users.username, users.password])
  }))
}

async function createPosts(db){
  const insertRequest = await db.prepare("INSERT INTO posts(name, content, category) VALUES(?, ?, ?)")
  const contents = [{
    name: "Article 1",
    content: "Lorem lipsum, Lorem lipsum Lorem lipsum Lorem lipsum",
    category: 1
  },
    {
      name: "Article 2",
      content: "Lorem lipsum, Lorem lipsum Lorem lipsum Lorem lipsum",
      category: 2
    }
  ]
  return await Promise.all(contents.map(post => {
    return insertRequest.run([post.name, post.content, post.category])
  }))
}

async function createCommentaire(db){
  const insertRequest = await db.prepare("INSERT INTO commentaires(name, content, article) VALUES(?, ?, ?)")
  const commentaire = [{
    name: "Commentaire 1",
    content: "Lorem lipsum, Lorem lipsum Lorem lipsum Lorem lipsum",
    article: 1
  }, 
  {
    name: "Commentaire 2",
    content: "Lorem lipsum, Lorem lipsum Lorem lipsum Lorem lipsum",
    article: 2
  }
  ]
  return await Promise.all( commentaire.map(comm => {
    return insertRequest.run([comm.name, comm.content, comm.article])
  }))
}

async function createTables(db){
  const cat = db.run(`
    CREATE TABLE IF NOT EXISTS categories(
      cat_id INTEGER PRIMARY KEY,
      cat_name varchar(255)
    )
  `)
  const post = db.run(`
        CREATE TABLE IF NOT EXISTS posts(
          id INTEGER PRIMARY KEY,
          name varchar(255),
          category int,
          content text,
          FOREIGN KEY(category) REFERENCES categories(cat_id)
        )
  `)
  const users = db.run(`
        CREATE TABLE IF NOT EXISTS userdata(
          id INTEGER PRIMARY KEY,
          username varchar(255),
          password varchar(255)
        )
  `)

  const commentaire = db.run(`
        CREATE TABLE IF NOT EXISTS commentaires(
          id INTEGER PRIMARY KEY,
          name varchar(255),
          content text,
          article int,
          FOREIGN KEY(article) REFERENCES post(id)
        )
  `)
  return await Promise.all([cat, post,users, commentaire])
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
  await createCategories(db)
  await createPosts(db)
  await createUserdata(db)
  await createCommentaire(db)
})()
